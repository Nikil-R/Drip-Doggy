import { useState, useMemo, useEffect } from "react";
import {
  Search, CheckCircle2, ChevronLeft, ChevronRight, X,
  Package, Truck, Home, RotateCcw, Check,
  ArrowUpRight, Clock, User, AlertCircle,
  Upload, Building, Phone, QrCode,
  TrendingUp, TrendingDown
} from "lucide-react";
import { customerApi } from "../lib/customer-api";
import { useAuthStore } from "@/app/store/auth-store";

const RS = "₹";

type ReturnStatus =
  | "return initiated"
  | "return pickuped"
  | "return shipped"
  | "return out of delivery"
  | "return delivered";

interface StatusTimeline {
  status: string;
  timestamp: string;
  note: string;
}

interface ReturnItem {
  name: string;
  sku: string;
  size: string;
  qty: number;
  price: number;
  image: string;
}

interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  amount: number;
  reason: string;
  status: ReturnStatus;
  items: ReturnItem[];
  refundMethod: "qr_code" | "upi" | "bank_transfer";
  refundDetails: {
    upiId?: string;
    phoneNumber?: string;
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    qrCodeImage?: string;
  };
  timeline: StatusTimeline[];
  receiptScreenshot?: string | null;
}

const RETURN_STAGES: { key: ReturnStatus; label: string; icon: React.ComponentType<any> }[] = [
  { key: "return initiated",        label: "Initiated",        icon: RotateCcw },
  { key: "return pickuped",         label: "Picked Up",        icon: Package },
  { key: "return shipped",          label: "In Transit",       icon: Truck },
  { key: "return out of delivery",  label: "Out for Delivery", icon: ArrowUpRight },
  { key: "return delivered",        label: "Delivered",        icon: Home },
];

const STATUS_META: Record<ReturnStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
  "return initiated":       { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500",   label: "Initiated" },
  "return pickuped":        { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500",    label: "Picked Up" },
  "return shipped":         { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200",  dot: "bg-indigo-500",  label: "In Transit" },
  "return out of delivery": { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  dot: "bg-violet-500",  label: "Out for Delivery" },
  "return delivered":       { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-200",   dot: "bg-green-500",   label: "Delivered" },
};

const initialReturns: ReturnRequest[] = [
  {
    id: "RET-1082", orderId: "#DD-6545", customerName: "Ananya Sharma",
    email: "ananya.s@gmail.com", phone: "+91 98765 43210", date: "2026-06-25", amount: 5800,
    reason: "Size is too large, fabric feels heavy.",
    status: "return initiated",
    items: [{ name: "Structured Canvas Jacket", sku: "DD-STR-001", size: "L", qty: 1, price: 5800, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop" }],
    refundMethod: "bank_transfer",
    refundDetails: { accountHolderName: "Ananya Sharma", bankName: "State Bank of India", accountNumber: "12345678901", ifscCode: "SBIN0000001" },
    timeline: [{ status: "return initiated", timestamp: "2026-06-25 14:30", note: "Customer submitted return request online." }]
  },
  {
    id: "RET-1081", orderId: "#DD-6543", customerName: "Rohan Mehta",
    email: "rohan.mehta@yahoo.com", phone: "+91 91234 56789", date: "2026-06-24", amount: 3200,
    reason: "Colour discrepancy from website photo.",
    status: "return pickuped",
    items: [{ name: "Everyday Relaxed Shift Dress", sku: "DD-EVE-002", size: "M", qty: 1, price: 3200, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop" }],
    refundMethod: "upi",
    refundDetails: { upiId: "rohanmehta@okaxis", phoneNumber: "+91 91234 56789" },
    timeline: [
      { status: "return initiated", timestamp: "2026-06-24 10:15", note: "Customer submitted return request online." },
      { status: "return pickuped", timestamp: "2026-06-25 11:00", note: "Pickup agent collected the package from customer." }
    ]
  },
  {
    id: "RET-1080", orderId: "#DD-6541", customerName: "Priya Patel",
    email: "priya.p@gmail.com", phone: "+91 98989 89898", date: "2026-06-22", amount: 4500,
    reason: "Defective stitching on left side seam.",
    status: "return delivered",
    items: [{ name: "Modern Oversized Knitwear", sku: "DD-MOD-003", size: "S", qty: 1, price: 4500, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" }],
    refundMethod: "qr_code",
    refundDetails: { qrCodeImage: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=200&auto=format&fit=crop" },
    timeline: [
      { status: "return initiated", timestamp: "2026-06-22 09:00", note: "Return request submitted by customer." },
      { status: "return pickuped", timestamp: "2026-06-23 14:00", note: "Pickup agent collected the package." },
      { status: "return shipped", timestamp: "2026-06-24 08:30", note: "Package handed to logistics partner for transit." },
      { status: "return out of delivery", timestamp: "2026-06-25 10:00", note: "Out for warehouse delivery." },
      { status: "return delivered", timestamp: "2026-06-25 16:30", note: "Package received and inspected at warehouse." }
    ]
  }
];

function StatusBadge({ status }: { status: ReturnStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.dot}`} />
      {m.label}
    </span>
  );
}

export function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>(initialReturns);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "In Transit" | "Completed">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const list = await customerApi.getAllCustomers(token);
        if (!list?.length) return;
        const details = await Promise.all(list.map((c: any) => customerApi.getCustomerDetails(c.id, token).catch(() => null)));
        const loaded: ReturnRequest[] = [];
        for (const d of details) {
          if (!d?.recentOrders?.length) continue;
          for (const ro of d.recentOrders) {
            if (!ro.status?.toUpperCase().includes("RETURN")) continue;
            const id = `RET-${ro.id.replace(/\D/g, "") || "100"}`;
            if (returns.some(r => r.id === id || r.orderId === ro.id)) continue;
            loaded.push({
              id, orderId: ro.id,
              customerName: `${d.onboardingProfile?.firstName || ""} ${d.onboardingProfile?.lastName || ""}`.trim() || "Customer",
              email: d.onboardingProfile?.email || "", phone: d.onboardingProfile?.phone || "",
              date: ro.date?.split(" ")?.[0] || "2026-07-08", amount: ro.amount,
              reason: "Customer requested return via dashboard.",
              status: "return initiated",
              items: [{ name: "Structured Canvas Jacket", sku: `DD-${ro.id}`, size: "M", qty: 1, price: ro.amount - 90, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop" }],
              refundMethod: "bank_transfer",
              refundDetails: { accountHolderName: `${d.onboardingProfile?.firstName || ""} ${d.onboardingProfile?.lastName || ""}`.trim() || "Customer", bankName: "HDFC Bank", accountNumber: "50100293847291", ifscCode: "HDFC0000001" },
              timeline: [{ status: "return initiated", timestamp: ro.date || "2026-07-08 12:00", note: "Return request submitted." }]
            });
          }
        }
        if (loaded.length) setReturns(prev => { const seen = new Set<string>(); return [...loaded, ...prev].filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; }); });
      } catch (e) { console.error(e); }
    }
    load();
  }, [token]);

  const active = useMemo(() => returns.find(r => r.id === selectedId) || null, [returns, selectedId]);

  const filtered = useMemo(() => returns.filter(r => {
    if (activeTab === "Pending" && r.status !== "return initiated") return false;
    if (activeTab === "In Transit" && !["return pickuped", "return shipped", "return out of delivery"].includes(r.status)) return false;
    if (activeTab === "Completed" && r.status !== "return delivered") return false;
    const q = searchQuery.toLowerCase();
    return r.id.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
  }), [returns, activeTab, searchQuery]);

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filtered, currentPage]);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;

  const updateStatus = (id: string, s: ReturnStatus) => {
    setReturns(prev => prev.map(r => {
      if (r.id !== id) return r;
      const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
      return { ...r, status: s, timeline: [...r.timeline, { status: s, timestamp: ts, note: `Status updated to "${s}".` }] };
    }));
  };

  const uploadProof = (id: string, url: string) => setReturns(prev => prev.map(r => r.id === id ? { ...r, receiptScreenshot: url } : r));

  const pendingCount = returns.filter(r => r.status === "return initiated").length;
  const inTransitCount = returns.filter(r => ["return pickuped", "return shipped", "return out of delivery"].includes(r.status)).length;
  const completedCount = returns.filter(r => r.status === "return delivered").length;
  const totalRefund = returns.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6 font-sans">

      {/* ─── KPI Cards ─── (same pattern as Orders page) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Refund Value", value: `${RS}${totalRefund.toLocaleString("en-IN")}`, trend: "up" as const, change: `${returns.length} returns`, subtitle: "Across all return cases" },
          { label: "Pending Pickup", value: pendingCount.toString(), trend: pendingCount > 0 ? "down" as const : "up" as const, change: `${returns.length > 0 ? Math.round((pendingCount / returns.length) * 100) : 0}% share`, subtitle: "Awaiting agent pickup" },
          { label: "In Transit", value: inTransitCount.toString(), trend: "up" as const, change: `${returns.length > 0 ? Math.round((inTransitCount / returns.length) * 100) : 0}% share`, subtitle: "On the way to warehouse" },
          { label: "Completed", value: completedCount.toString(), trend: "up" as const, change: `${returns.length > 0 ? Math.round((completedCount / returns.length) * 100) : 0}% rate`, subtitle: "Return fulfilled" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">{stat.label}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl font-bold tracking-tight text-[#382d24] whitespace-nowrap">{stat.value}</span>
              <span className={`inline-flex items-center gap-0.5 text-[9px] font-semibold px-1 py-0.5 border rounded-sm whitespace-nowrap ${stat.trend === "up" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                {stat.trend === "up" ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                {stat.change}
              </span>
            </div>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* ─── Filters Panel ─── */}
      <div className="bg-card border border-neutral-200/80 p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-nowrap items-center gap-3 shrink-0">
          <div className="flex bg-background border border-neutral-200 p-1 rounded-full gap-0.5">
            {(["All", "Pending", "In Transit", "Completed"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 text-[8.5px] font-bold tracking-widest uppercase border-none cursor-pointer rounded-full transition-all ${
                  activeTab === tab ? "bg-[#224870] text-white shadow-sm" : "bg-transparent text-neutral-500 hover:text-[#224870]"
                }`}
              >{tab}</button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by ID, order, customer..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="bg-card border border-neutral-200 pl-9 pr-4 py-2 text-[10px] font-semibold focus:outline-none focus:border-[#224870] placeholder-neutral-400 w-full xl:w-72 rounded-full transition-all"
          />
        </div>
      </div>

      {/* ─── Returns Table ─── */}
      <div className="bg-card border border-neutral-200/80 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200/80 bg-background/60 text-[9.5px] text-[#615e56] font-bold tracking-[0.12em] uppercase">
              <th className="p-4">Return ID</th>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Item</th>
              <th className="p-4">Refund Amt</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100/80">
            {paginated.map(ret => (
              <tr key={ret.id} onClick={() => setSelectedId(ret.id)} className="hover:bg-[#224870]/5 transition-colors cursor-pointer">
                <td className="p-4 font-mono text-[10.5px] text-[#224870] font-black">{ret.id}</td>
                <td className="p-4 font-mono text-[10px] text-neutral-600 font-bold">{ret.orderId}</td>
                <td className="p-4">
                  <p className="font-bold text-[11px] text-[#382d24]">{ret.customerName}</p>
                  <p className="text-[9.5px] text-[#615e56] mt-0.5">{ret.email}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2.5">
                    <img src={ret.items[0]?.image} alt="" className="w-9 h-9 object-cover border border-neutral-200 shrink-0" />
                    <div>
                      <p className="text-[10.5px] font-bold text-[#382d24] leading-tight">{ret.items[0]?.name}</p>
                      <p className="text-[9px] text-[#615e56] mt-0.5">Size {ret.items[0]?.size} · Qty {ret.items[0]?.qty}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-bold text-[12px] text-[#382d24]">{RS}{ret.amount.toLocaleString()}</td>
                <td className="p-4"><StatusBadge status={ret.status} /></td>
                <td className="p-4 text-[10px] text-[#615e56] font-semibold">{ret.date}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-[11px] text-[#615e56] font-bold uppercase tracking-widest">
                  No return requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Pagination ─── */}
      <div className="flex items-center justify-between">
        <p className="text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider">
          Showing {paginated.length} of {filtered.length} returns
        </p>
        <div className="flex gap-1.5 items-center">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#224870] hover:text-[#224870] bg-card text-[#615e56] text-[9px] font-bold tracking-widest px-4 py-2 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-full">
            <ChevronLeft className="w-3 h-3" /> Prev
          </button>
          <span className="px-3 py-1.5 text-[9px] font-bold text-[#615e56] border border-neutral-100 rounded-full bg-neutral-50">
            {currentPage} / {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#224870] hover:text-[#224870] bg-card text-[#615e56] text-[9px] font-bold tracking-widest px-4 py-2 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-full">
            Next <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ─── Detail Slide-in Panel ─── */}
      {active && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelectedId(null)}>
          <div className="flex-1 bg-black/30 backdrop-blur-[2px]" />
          <div className="w-full max-w-[500px] bg-white h-full overflow-y-auto flex flex-col shadow-2xl border-l border-neutral-200" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="sticky top-0 bg-white z-20 px-6 py-5 border-b border-neutral-200/60 flex items-start justify-between">
              <div>
                <span className="text-[8.5px] font-bold tracking-[0.3em] text-[#615e56] uppercase block">Return Details</span>
                <h2 className="text-lg font-bold text-[#382d24] uppercase tracking-tight mt-0.5">{active.id}</h2>
                <p className="text-[10px] text-[#615e56] font-semibold mt-1">Order {active.orderId} · {active.date}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="w-8 h-8 flex items-center justify-center border border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-[#382d24] bg-transparent cursor-pointer rounded-full transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 px-6 py-6 space-y-6">

              {/* Customer */}
              <div className="bg-card border border-neutral-200/80 p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#224870]/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#224870]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[12px] text-[#382d24]">{active.customerName}</p>
                  <p className="text-[9.5px] text-[#615e56] mt-0.5">{active.email}</p>
                  <p className="text-[9.5px] text-[#615e56]">{active.phone}</p>
                </div>
                <StatusBadge status={active.status} />
              </div>

              {/* Items */}
              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-3">Returned Items</span>
                <div className="divide-y divide-neutral-100 border border-neutral-200/80">
                  {active.items.map((item, i) => (
                    <div key={i} className="p-3.5 flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover border border-neutral-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#382d24] uppercase tracking-wide truncate">{item.name}</p>
                        <p className="text-[9.5px] text-[#615e56] mt-0.5">SKU: {item.sku} · Size: <strong className="text-[#382d24]">{item.size}</strong> · Qty: <strong className="text-[#382d24]">{item.qty}</strong></p>
                      </div>
                      <p className="text-[13px] font-bold text-[#224870] shrink-0">{RS}{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 px-3.5 py-3 bg-amber-50 border border-amber-200/60 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700">Reason for Return</p>
                    <p className="text-[10.5px] font-semibold text-[#382d24] mt-0.5">{active.reason}</p>
                  </div>
                </div>
              </div>

              {/* Vertical Timeline */}
              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-4">Return Journey</span>
                <div className="relative">
                  <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-neutral-100" />
                  {RETURN_STAGES.map((stage, idx) => {
                    const stageIdx = RETURN_STAGES.findIndex(s => s.key === active.status);
                    const isDone = idx <= stageIdx;
                    const isCurrent = idx === stageIdx;
                    const log = active.timeline.find(t => t.status === stage.key);
                    const Icon = stage.icon;
                    return (
                      <div key={stage.key} className="relative flex items-start gap-4 pb-5">
                        <button
                          onClick={() => updateStatus(active.id, stage.key)}
                          className={`relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                            isCurrent ? "bg-[#224870] border-[#224870] text-white shadow-md scale-105" :
                            isDone ? "bg-white border-[#224870] text-[#224870]" :
                            "bg-white border-neutral-200 text-neutral-300"
                          }`}
                        >
                          {isDone && !isCurrent ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                        </button>
                        <div className="flex-1 min-w-0 pt-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-[10.5px] font-bold uppercase tracking-wide ${isCurrent ? "text-[#224870]" : isDone ? "text-[#382d24]" : "text-neutral-300"}`}>{stage.label}</p>
                            {isCurrent && <span className="text-[7.5px] font-bold uppercase tracking-widest bg-[#224870]/10 text-[#224870] px-2 py-0.5 rounded-full">Current</span>}
                          </div>
                          {log ? <p className="text-[9.5px] text-[#615e56] mt-0.5 leading-relaxed">{log.note}</p> : !isDone ? <p className="text-[9.5px] text-neutral-300 mt-0.5 italic">Awaiting update</p> : null}
                          {log && <p className="text-[8.5px] font-semibold text-neutral-400 mt-1 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {log.timestamp}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Refund Details */}
              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-3">Refund Details</span>
                <div className="border border-neutral-200/80 bg-card">
                  <div className="px-4 py-3 border-b border-neutral-200/60 bg-background/40 flex items-center gap-2">
                    {active.refundMethod === "bank_transfer" && <Building className="w-4 h-4 text-[#224870]" />}
                    {active.refundMethod === "upi" && <Phone className="w-4 h-4 text-[#224870]" />}
                    {active.refundMethod === "qr_code" && <QrCode className="w-4 h-4 text-[#224870]" />}
                    <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#224870]">
                      {active.refundMethod === "bank_transfer" ? "Bank Transfer" : active.refundMethod === "upi" ? "UPI Transfer" : "QR Code"}
                    </span>
                    <span className="ml-auto text-[13px] font-bold text-[#382d24]">{RS}{active.amount.toLocaleString()}</span>
                  </div>
                  <div className="px-4 py-3 space-y-2 text-[10.5px]">
                    {active.refundMethod === "upi" && (
                      <>
                        <div className="flex justify-between"><span className="text-[#615e56] font-semibold">UPI ID</span><span className="font-bold text-[#382d24] font-mono">{active.refundDetails.upiId}</span></div>
                        {active.refundDetails.phoneNumber && <div className="flex justify-between"><span className="text-[#615e56] font-semibold">Phone</span><span className="font-bold text-[#382d24]">{active.refundDetails.phoneNumber}</span></div>}
                      </>
                    )}
                    {active.refundMethod === "bank_transfer" && (
                      <>
                        <div className="flex justify-between"><span className="text-[#615e56] font-semibold">Account Holder</span><span className="font-bold text-[#382d24]">{active.refundDetails.accountHolderName}</span></div>
                        <div className="flex justify-between"><span className="text-[#615e56] font-semibold">Bank</span><span className="font-bold text-[#382d24]">{active.refundDetails.bankName}</span></div>
                        <div className="flex justify-between"><span className="text-[#615e56] font-semibold">Account No.</span><span className="font-bold text-[#382d24] font-mono">{active.refundDetails.accountNumber}</span></div>
                        <div className="flex justify-between"><span className="text-[#615e56] font-semibold">IFSC</span><span className="font-bold text-[#382d24] font-mono">{active.refundDetails.ifscCode}</span></div>
                      </>
                    )}
                    {active.refundMethod === "qr_code" && (
                      <div className="flex justify-center py-3">
                        <img src={active.refundDetails.qrCodeImage} alt="QR Code" className="w-28 h-28 border border-neutral-200 object-contain bg-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Proof Upload */}
              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-3">Payout Proof</span>
                {active.receiptScreenshot ? (
                  <div className="border border-green-200 bg-green-50 p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[9.5px] font-bold uppercase tracking-widest text-green-700">Proof Uploaded</p>
                      <p className="text-[9.5px] text-green-600 font-semibold mt-0.5">Transaction receipt recorded.</p>
                    </div>
                    <img src={active.receiptScreenshot} alt="Proof" className="w-12 h-12 object-cover border border-green-200" />
                  </div>
                ) : (
                  <label className="flex items-center gap-3 border-2 border-dashed border-neutral-200 hover:border-[#224870] p-4 cursor-pointer transition-all group bg-card hover:bg-[#224870]/3">
                    <div className="w-9 h-9 bg-neutral-100 group-hover:bg-[#224870]/10 flex items-center justify-center transition-all shrink-0">
                      <Upload className="w-4 h-4 text-neutral-400 group-hover:text-[#224870] transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#615e56] group-hover:text-[#224870] transition-colors">Upload Receipt Screenshot</p>
                      <p className="text-[9.5px] text-[#615e56] font-semibold mt-0.5">Attach bank transaction proof to complete payout.</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadProof(active.id, URL.createObjectURL(f)); }} />
                  </label>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
