import { useState, useMemo } from "react";
import {
  Search, ChevronLeft, ChevronRight, X,
  Package, Truck, Home, RefreshCw, Check,
  ArrowUpRight, Clock, User, AlertCircle,
  TrendingUp, TrendingDown, Palette, Tag,
  ArrowRight, CreditCard, Building, QrCode, Phone, Upload, CheckCircle2, ShieldAlert
} from "lucide-react";

const RS = "₹";

type DeliveryStatus =
  | "EXCHANGE_INITIATED"
  | "EXCHANGE_APPROVED"
  | "OUT_FOR_PICKUP"
  | "RECEIVED_AT_WAREHOUSE"
  | "REPLACEMENT_DISPATCHED"
  | "EXCHANGE_COMPLETED";

type ReturnStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "RECEIVED"
  | "COMPLETED";

interface StatusTimeline {
  status: string;
  timestamp: string;
  note: string;
}

interface ExchangeItem {
  name: string;
  sku: string;
  originalSize: string;
  requestedSize: string;
  originalColor: string;
  requestedColor: string;
  qty: number;
  originalPrice: number;
  replacementPrice: number;
  image: string;
}

interface ExchangeRequest {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  reason: string;
  approvalStatus: ReturnStatus;
  deliveryStatus: DeliveryStatus;
  items: ExchangeItem[];
  paymentStatus: "paid" | "pending_payment" | "refunded" | "pending_refund" | "no_adjustment";
  adjustmentAmount: number; // Positive = customer pays more, Negative = customer gets refund
  refundMethod?: "qr_code" | "upi" | "bank_transfer";
  refundDetails?: {
    upiId?: string;
    phoneNumber?: string;
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    qrCodeImage?: string;
  };
  receiptScreenshot?: string | null;
  timeline: StatusTimeline[];
}

const DELIVERY_STAGES: { key: DeliveryStatus; label: string; icon: React.ComponentType<any> }[] = [
  { key: "EXCHANGE_INITIATED",    label: "Exchange Initiated",    icon: RefreshCw },
  { key: "EXCHANGE_APPROVED",     label: "Exchange Approved",     icon: Clock },
  { key: "OUT_FOR_PICKUP",        label: "Out for Pickup",        icon: Package },
  { key: "RECEIVED_AT_WAREHOUSE", label: "Received at Warehouse", icon: Building },
  { key: "REPLACEMENT_DISPATCHED",label: "Replacement Dispatched",icon: Truck },
  { key: "EXCHANGE_COMPLETED",    label: "Exchange Completed",    icon: Home },
];

const APPROVAL_META: Record<ReturnStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
  "PENDING":   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500",   label: "Pending Review" },
  "APPROVED":  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500",    label: "Approved" },
  "REJECTED":  { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500",     label: "Rejected" },
  "RECEIVED":  { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200",  dot: "bg-indigo-500",  label: "Package Received" },
  "COMPLETED": { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-200",   dot: "bg-green-500",   label: "Completed" },
};

const initialExchanges: ExchangeRequest[] = [
  {
    id: "EXC-2012", orderId: "#DD-6544", customerName: "Karan Johar",
    email: "karan.j@gmail.com", phone: "+91 99999 77777", date: "2026-06-26",
    reason: "Jacket fits too snug around shoulders. Requesting size up and different color.",
    approvalStatus: "PENDING",
    deliveryStatus: "EXCHANGE_INITIATED",
    paymentStatus: "no_adjustment",
    adjustmentAmount: 0,
    items: [{
      name: "Structured Canvas Jacket", sku: "DD-STR-001",
      originalSize: "M", requestedSize: "L",
      originalColor: "Navy Blue", requestedColor: "Sage Green",
      qty: 1, originalPrice: 5800, replacementPrice: 5800,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop"
    }],
    timeline: [{ status: "EXCHANGE_INITIATED", timestamp: "2026-06-26 11:20", note: "Customer submitted exchange request via profile dashboard." }]
  },
  {
    id: "EXC-2011", orderId: "#DD-6542", customerName: "Meera Patel",
    email: "meera.p@yahoo.com", phone: "+91 98765 00000", date: "2026-06-25",
    reason: "Dress size feels too loose. Requesting size S and upgraded premium fabric color variant.",
    approvalStatus: "APPROVED",
    deliveryStatus: "OUT_FOR_PICKUP",
    paymentStatus: "pending_payment",
    adjustmentAmount: 600,
    items: [{
      name: "Everyday Relaxed Shift Dress", sku: "DD-EVE-002",
      originalSize: "M", requestedSize: "S",
      originalColor: "Classic Denim", requestedColor: "Indigo Linen",
      qty: 1, originalPrice: 3200, replacementPrice: 3800,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop"
    }],
    timeline: [
      { status: "PENDING", timestamp: "2026-06-25 09:45", note: "Customer requested exchange." },
      { status: "APPROVED", timestamp: "2026-06-25 15:00", note: "Admin approved exchange. Awaiting adjustment payment." }
    ]
  },
  {
    id: "EXC-2010", orderId: "#DD-6538", customerName: "Vikram Nair",
    email: "vikram.n@gmail.com", phone: "+91 90000 11111", date: "2026-06-21",
    reason: "Downgrading to standard cotton knitwear and smaller size.",
    approvalStatus: "COMPLETED",
    deliveryStatus: "EXCHANGE_COMPLETED",
    paymentStatus: "refunded",
    adjustmentAmount: -700,
    refundMethod: "bank_transfer",
    refundDetails: {
      accountHolderName: "Vikram Nair",
      bankName: "HDFC Bank",
      accountNumber: "50100293847291",
      ifscCode: "HDFC0000001"
    },
    items: [{
      name: "French Terry Hoodie", sku: "DD-FTH-001",
      originalSize: "M", requestedSize: "S",
      originalColor: "Charcoal Grey", requestedColor: "Sandstone",
      qty: 1, originalPrice: 3900, replacementPrice: 3200,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200&auto=format&fit=crop"
    }],
    timeline: [
      { status: "PENDING", timestamp: "2026-06-21 14:10", note: "Customer requested exchange." },
      { status: "APPROVED", timestamp: "2026-06-21 16:30", note: "Admin approved request." },
      { status: "EXCHANGE_COMPLETED", timestamp: "2026-06-23 11:15", note: "Logistics complete. Replacement item delivered." }
    ]
  }
];

function ApprovalStatusBadge({ status }: { status: ReturnStatus }) {
  const m = APPROVAL_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.dot}`} />
      {m.label}
    </span>
  );
}

export const ExchangesPage = () => {
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>(() => {
    const saved = localStorage.getItem("dd_admin_exchanges");
    if (saved) return JSON.parse(saved);
    return initialExchanges;
  });
  const [activeTab, setActiveTab] = useState<"All" | "Pending Review" | "Active Logistics" | "Completed">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExchangeId, setSelectedExchangeId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const active = exchanges.find(e => e.id === selectedExchangeId);

  const filtered = useMemo(() => exchanges.filter(e => {
    if (activeTab === "Pending Review" && e.approvalStatus !== "PENDING") return false;
    if (activeTab === "Active Logistics" && (e.approvalStatus === "PENDING" || e.approvalStatus === "COMPLETED" || e.approvalStatus === "REJECTED")) return false;
    if (activeTab === "Completed" && e.approvalStatus !== "COMPLETED") return false;
    const q = searchQuery.toLowerCase();
    return e.id.toLowerCase().includes(q) || e.orderId.toLowerCase().includes(q) || e.customerName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
  }), [exchanges, activeTab, searchQuery]);

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filtered, currentPage]);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;

  const setSelectedId = (id: string | null) => {
    setSelectedExchangeId(id);
  };

  const updateApprovalStatus = (id: string, s: ReturnStatus) => {
    setExchanges(prev => prev.map(e => {
      if (e.id !== id) return e;
      const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
      let dStatus = e.deliveryStatus;
      if (s === "APPROVED" && e.deliveryStatus === "EXCHANGE_INITIATED") {
        dStatus = "EXCHANGE_APPROVED";
      } else if (s === "RECEIVED") {
        dStatus = "RECEIVED_AT_WAREHOUSE";
      }
      return {
        ...e,
        approvalStatus: s,
        deliveryStatus: dStatus,
        timeline: [...e.timeline, { status: s, timestamp: ts, note: `Admin updated request status to: ${s}` }]
      };
    }));
  };

  const updateDeliveryStatus = (id: string, ds: DeliveryStatus) => {
    setExchanges(prev => prev.map(e => {
      if (e.id !== id) return e;
      const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
      let appStatus = e.approvalStatus;
      let payStatus = e.paymentStatus;
      if (ds === "EXCHANGE_COMPLETED") {
        if (appStatus === "APPROVED" || appStatus === "RECEIVED") {
          appStatus = "COMPLETED";
        }
        if (payStatus === "pending_payment") {
          payStatus = "paid";
        }
      }
      return {
        ...e,
        deliveryStatus: ds,
        approvalStatus: appStatus,
        paymentStatus: payStatus,
        timeline: [...e.timeline, { status: ds, timestamp: ts, note: `Logistics update: exchange package is now ${ds.replaceAll("_", " ")}.` }]
      };
    }));
  };

  const verifyPayment = (id: string) => {
    setExchanges(prev => prev.map(e => {
      if (e.id !== id) return e;
      const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
      return {
        ...e,
        paymentStatus: "paid",
        timeline: [...e.timeline, { status: e.approvalStatus, timestamp: ts, note: `Additional payment of ${RS}${e.adjustmentAmount} verified by admin.` }]
      };
    }));
  };

  const uploadProof = (id: string, url: string) => {
    setExchanges(prev => prev.map(e => {
      if (e.id !== id) return e;
      const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
      return {
        ...e,
        receiptScreenshot: url,
        paymentStatus: "refunded",
        timeline: [...e.timeline, { status: e.approvalStatus, timestamp: ts, note: `Refund payout of ${RS}${Math.abs(e.adjustmentAmount)} confirmed.` }]
      };
    }));
  };

  const pendingCount = exchanges.filter(e => e.approvalStatus === "PENDING").length;
  const activeLogisticsCount = exchanges.filter(e => e.approvalStatus === "APPROVED" || e.approvalStatus === "RECEIVED").length;
  const completedCount = exchanges.filter(e => e.approvalStatus === "COMPLETED").length;
  const totalItems = exchanges.reduce((s, e) => s + e.items.reduce((a, i) => a + i.qty, 0), 0);

  return (
    <div className="space-y-6 font-sans">

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Exchanges", value: exchanges.length.toString(), trend: "up" as const, change: `${totalItems} items`, subtitle: "All time exchange requests" },
          { label: "Pending Review", value: pendingCount.toString(), trend: pendingCount > 0 ? "down" as const : "up" as const, change: `${exchanges.length > 0 ? Math.round((pendingCount / exchanges.length) * 100) : 0}% share`, subtitle: "Awaiting review approval" },
          { label: "Active Logistics", value: activeLogisticsCount.toString(), trend: "up" as const, change: `${exchanges.length > 0 ? Math.round((activeLogisticsCount / exchanges.length) * 100) : 0}% share`, subtitle: "Logistics in execution" },
          { label: "Completed", value: completedCount.toString(), trend: "up" as const, change: `${exchanges.length > 0 ? Math.round((completedCount / exchanges.length) * 100) : 0}% rate`, subtitle: "Exchanges fulfilled" },
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
            {(["All", "Pending Review", "Active Logistics", "Completed"] as const).map(tab => (
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

      {/* ─── Exchanges Table ─── */}
      <div className="bg-card border border-neutral-200/80 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200/80 bg-background/60 text-[9.5px] text-[#615e56] font-bold tracking-[0.12em] uppercase">
              <th className="p-4">Exch. ID</th>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Item Swap details</th>
              <th className="p-4">Price Adjustment</th>
              <th className="p-4">Review Status</th>
              <th className="p-4">Logistics status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100/80">
            {paginated.map(exc => (
              <tr key={exc.id} onClick={() => setSelectedId(exc.id)} className="hover:bg-[#224870]/5 transition-colors cursor-pointer">
                <td className="p-4 font-mono text-[10.5px] text-[#224870] font-black">{exc.id}</td>
                <td className="p-4 font-mono text-[10px] text-neutral-600 font-bold">{exc.orderId}</td>
                <td className="p-4">
                  <p className="font-bold text-[11px] text-[#382d24]">{exc.customerName}</p>
                  <p className="text-[9.5px] text-[#615e56] mt-0.5">{exc.email}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2.5">
                    <img src={exc.items[0]?.image} alt="" className="w-9 h-9 object-cover border border-neutral-200 shrink-0" />
                    <div>
                      <p className="text-[10.5px] font-bold text-[#382d24] leading-tight">{exc.items[0]?.name}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-sm">
                          {exc.items[0]?.originalSize} / {exc.items[0]?.originalColor}
                        </span>
                        <span className="text-[8.5px] text-neutral-400 font-bold">→</span>
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-[#224870]/10 text-[#224870] rounded-sm">
                          {exc.items[0]?.requestedSize} / {exc.items[0]?.requestedColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-bold text-[11px]">
                  {exc.adjustmentAmount === 0 ? (
                    <span className="text-neutral-500">Even Swap (₹0)</span>
                  ) : exc.adjustmentAmount > 0 ? (
                    <div>
                      <span className="text-red-600 font-extrabold">+{RS}{exc.adjustmentAmount}</span>
                      <p className={`text-[8.5px] font-bold uppercase mt-0.5 ${exc.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}>
                        {exc.paymentStatus === "paid" ? "Paid" : "Awaiting Pay"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-green-700 font-extrabold">-{RS}{Math.abs(exc.adjustmentAmount)}</span>
                      <p className={`text-[8.5px] font-bold uppercase mt-0.5 ${exc.paymentStatus === "refunded" ? "text-green-600" : "text-blue-600"}`}>
                        {exc.paymentStatus === "refunded" ? "Refunded" : "Awaiting Ref"}
                      </p>
                    </div>
                  )}
                </td>
                <td className="p-4"><ApprovalStatusBadge status={exc.approvalStatus} /></td>
                <td className="p-4 text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider">
                  {exc.deliveryStatus.replace("RETURN_", "").replace("_", " ")}
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-[11px] text-[#615e56] font-bold uppercase tracking-widest">
                  No exchange requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Pagination ─── */}
      <div className="flex items-center justify-between">
        <p className="text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider">
          Showing {paginated.length} of {filtered.length} exchanges
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

      {/* ─── Exchange Detail Slide-in Panel ─── */}
      {active && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelectedId(null)}>
          <div className="flex-1 bg-black/30 backdrop-blur-[2px]" />
          <div className="w-full max-w-[500px] bg-white h-full overflow-y-auto flex flex-col shadow-2xl border-l border-neutral-200" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="sticky top-0 bg-white z-20 px-6 py-5 border-b border-neutral-200/60 flex items-start justify-between">
              <div>
                <span className="text-[8.5px] font-bold tracking-[0.3em] text-[#615e56] uppercase block">Exchange Request</span>
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
                <div className="w-9 h-9 bg-[#224870]/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#224870]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[12px] text-[#382d24]">{active.customerName}</p>
                  <p className="text-[9.5px] text-[#615e56] mt-0.5">{active.email}</p>
                  <p className="text-[9.5px] text-[#615e56]">{active.phone}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <ApprovalStatusBadge status={active.approvalStatus} />
                  <span className="text-[8px] font-black uppercase bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-sm">
                    {active.deliveryStatus.replace("RETURN_", "").replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Step 1: Administrative Approval review (when Pending) */}
              {active.approvalStatus === "PENDING" && (
                <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-sm space-y-3">
                  <div className="flex items-center gap-2 text-amber-700 font-extrabold text-[10px] uppercase">
                    <ShieldAlert className="w-4.5 h-4.5" /> Administrative Approval Needed
                  </div>
                  <p className="text-[10px] text-[#615e56] leading-relaxed">
                    Verify request variant defect claims. Approving begins the logistics courier pickup journey.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateApprovalStatus(active.id, "REJECTED")}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[9.5px] font-bold uppercase tracking-widest py-2 rounded-sm cursor-pointer transition-all border-none"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => updateApprovalStatus(active.id, "APPROVED")}
                      className="flex-1 bg-green-700 hover:bg-green-800 text-white text-[9.5px] font-bold uppercase tracking-widest py-2 rounded-sm cursor-pointer transition-all border-none"
                    >
                      Approve Request
                    </button>
                  </div>
                </div>
              )}

              {/* Items with size swap */}
              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-3">Exchange Item</span>
                {active.items.map((item, i) => (
                  <div key={i} className="border border-neutral-200/80 bg-card">
                    <div className="p-3.5 flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover border border-neutral-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#382d24] uppercase tracking-wide truncate">{item.name}</p>
                        <p className="text-[9.5px] text-[#615e56] mt-0.5">SKU: {item.sku} · Qty: <strong className="text-[#382d24]">{item.qty}</strong></p>
                      </div>
                    </div>
                    {/* Size swap row */}
                    <div className="border-t border-neutral-200/60 p-4 bg-background/40 grid grid-cols-2 gap-4">
                      {/* Left: Original */}
                      <div className="border-r border-neutral-200/60 pr-2">
                        <p className="text-[8.5px] font-bold uppercase tracking-widest text-red-600 mb-2">Original Choice</p>
                        <div className="space-y-1 text-[10px]">
                          <p className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-neutral-400" /> Size: <strong className="text-[#382d24]">{item.originalSize}</strong></p>
                          <p className="flex items-center gap-1.5"><Palette className="w-3.5 h-3.5 text-neutral-400" /> Color: <strong className="text-[#382d24]">{item.originalColor}</strong></p>
                          <p className="text-[#615e56] mt-1 font-semibold">Price Paid: <strong>{RS}{item.originalPrice}</strong></p>
                        </div>
                      </div>

                      {/* Right: Requested */}
                      <div className="pl-2">
                        <p className="text-[8.5px] font-bold uppercase tracking-widest text-green-700 mb-2">Replacement Choice</p>
                        <div className="space-y-1 text-[10px]">
                          <p className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-neutral-400" /> Size: <strong className="text-[#382d24]">{item.requestedSize}</strong></p>
                          <p className="flex items-center gap-1.5"><Palette className="w-3.5 h-3.5 text-neutral-400" /> Color: <strong className="text-[#382d24]">{item.requestedColor}</strong></p>
                          <p className="text-[#615e56] mt-1 font-semibold">New Price: <strong>{RS}{item.replacementPrice}</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-3 px-3.5 py-3 bg-neutral-50 border border-neutral-200/60 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#615e56]">Reason for Exchange</p>
                    <p className="text-[10.5px] font-semibold text-[#382d24] mt-0.5">{active.reason}</p>
                  </div>
                </div>
              </div>

              {/* Price adjustment & Transaction ledger */}
              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-3">Price Adjustment Status</span>
                <div className="border border-neutral-200/80 bg-card rounded-sm p-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 font-semibold">Replacement item price:</span>
                    <span className="font-bold text-[#382d24]">{RS}{active.items[0]?.replacementPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] border-b border-neutral-200/50 pb-2">
                    <span className="text-neutral-500 font-semibold">Original item price:</span>
                    <span className="font-bold text-[#382d24]">{RS}{active.items[0]?.originalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-[#382d24] uppercase">Net Adjustment:</span>
                    {active.adjustmentAmount === 0 ? (
                      <span className="text-[12px] font-bold text-[#382d24]">Even Swap (₹0)</span>
                    ) : active.adjustmentAmount > 0 ? (
                      <div className="text-right">
                        <span className="text-[13px] font-bold text-red-600">+{RS}{active.adjustmentAmount}</span>
                        <p className={`text-[8.5px] font-bold uppercase ${active.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}>
                          {active.paymentStatus === "paid" ? "Payment Completed" : "Awaiting Pay"}
                        </p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-[13px] font-bold text-green-700">Refund Customer {RS}{Math.abs(active.adjustmentAmount)}</span>
                        <p className={`text-[8.5px] font-bold uppercase ${active.paymentStatus === "refunded" ? "text-green-600" : "text-blue-600"}`}>
                          {active.paymentStatus === "refunded" ? "Refund Transferred" : "Pending Refund Process"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Physical courier logistics tracking */}
              {active.approvalStatus !== "PENDING" && active.approvalStatus !== "REJECTED" && (
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-4">Package Logistics Tracking</span>
                  <div className="relative">
                    <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-neutral-100" />
                    {DELIVERY_STAGES.map((stage, idx) => {
                      const stageIdx = DELIVERY_STAGES.findIndex(s => s.key === active.deliveryStatus);
                      const isDone = idx <= stageIdx;
                      const isCurrent = idx === stageIdx;
                      const log = active.timeline.find(t => t.status === stage.key);
                      const Icon = stage.icon;
                      return (
                        <div key={stage.key} className="relative flex items-start gap-4 pb-5">
                          <button
                            disabled={active.adjustmentAmount > 0 && active.paymentStatus === "pending_payment" && idx > 0}
                            onClick={() => updateDeliveryStatus(active.id, stage.key)}
                            className={`relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                              isCurrent ? "bg-[#224870] border-[#224870] text-white shadow-md scale-105" :
                              isDone ? "bg-white border-[#224870] text-[#224870]" :
                              "bg-white border-neutral-200 text-neutral-300"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isDone && !isCurrent ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                          </button>
                          <div className="flex-1 min-w-0 pt-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-[10.5px] font-bold uppercase tracking-wide ${isCurrent ? "text-[#224870]" : isDone ? "text-[#382d24]" : "text-neutral-300"}`}>{stage.label}</p>
                              {isCurrent && <span className="text-[7.5px] font-bold uppercase tracking-widest bg-[#224870]/10 text-[#224870] px-2 py-0.5 rounded-full">Active</span>}
                            </div>
                            {log ? <p className="text-[9.5px] text-[#615e56] mt-0.5 leading-relaxed">{log.note}</p> : !isDone ? <p className="text-[9.5px] text-neutral-300 mt-0.5 italic">Awaiting transit scan</p> : null}
                            {log && <p className="text-[8.5px] font-semibold text-neutral-400 mt-1 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {log.timestamp}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* If Refund is Due & Not refunded yet, show refund inputs */}
              {active.adjustmentAmount < 0 && (
                <div className="space-y-4">
                  {/* Bank Details section */}
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-3">Refund Bank Details</span>
                    <div className="border border-neutral-200/80 bg-card rounded-sm p-4 space-y-2.5 text-[10.5px]">
                      <div className="flex justify-between"><span className="text-[#615e56] font-semibold">Account Holder</span><span className="font-bold text-[#382d24]">{active.refundDetails?.accountHolderName || active.customerName}</span></div>
                      <div className="flex justify-between"><span className="text-[#615e56] font-semibold">Bank Name</span><span className="font-bold text-[#382d24]">{active.refundDetails?.bankName || "HDFC Bank"}</span></div>
                      <div className="flex justify-between"><span className="text-[#615e56] font-semibold">Account Number</span><span className="font-bold text-[#382d24] font-mono">{active.refundDetails?.accountNumber || "50100293847291"}</span></div>
                      <div className="flex justify-between"><span className="text-[#615e56] font-semibold">IFSC Code</span><span className="font-bold text-[#382d24] font-mono">{active.refundDetails?.ifscCode || "HDFC0000001"}</span></div>
                    </div>
                  </div>

                  {/* Proof upload */}
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-3">Upload Refund Payout Proof</span>
                    {active.receiptScreenshot ? (
                      <div className="border border-green-200 bg-green-50 p-4 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[9.5px] font-bold uppercase tracking-widest text-green-700">Refund Transferred</p>
                          <p className="text-[9.5px] text-green-600 font-semibold mt-0.5">Transaction receipt recorded.</p>
                        </div>
                        <img src={active.receiptScreenshot} alt="Proof" className="w-12 h-12 object-cover border border-green-200 rounded-sm" />
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 border-2 border-dashed border-neutral-200 hover:border-[#224870] p-4 cursor-pointer transition-all group bg-card hover:bg-[#224870]/3">
                        <div className="w-9 h-9 bg-neutral-100 group-hover:bg-[#224870]/10 flex items-center justify-center transition-all shrink-0">
                          <Upload className="w-4 h-4 text-neutral-400 group-hover:text-[#224870] transition-colors" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#615e56] group-hover:text-[#224870] transition-colors">Upload Payout Screenshot</p>
                          <p className="text-[9.5px] text-[#615e56] font-semibold mt-0.5">Upload bank screenshot of refund transfer.</p>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadProof(active.id, URL.createObjectURL(f)); }} />
                      </label>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
