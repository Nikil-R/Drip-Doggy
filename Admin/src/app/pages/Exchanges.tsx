import { useState, useMemo } from "react";
import {
  Search, ChevronLeft, ChevronRight, X,
  Package, Truck, Home, RefreshCw, Check,
  ArrowUpRight, Clock, User, AlertCircle,
  TrendingUp, TrendingDown
} from "lucide-react";

const RS = "₹";

type ExchangeStatus =
  | "exchange initiated"
  | "exchange pickuped"
  | "exchange shipped"
  | "exchange out of delivery"
  | "exchange delivered";

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
  qty: number;
  price: number;
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
  status: ExchangeStatus;
  items: ExchangeItem[];
  timeline: StatusTimeline[];
}

const EXCHANGE_STAGES: { key: ExchangeStatus; label: string; icon: React.ComponentType<any> }[] = [
  { key: "exchange initiated",        label: "Initiated",          icon: RefreshCw },
  { key: "exchange pickuped",         label: "Picked Up",          icon: Package },
  { key: "exchange shipped",          label: "Replacement Sent",   icon: Truck },
  { key: "exchange out of delivery",  label: "Out for Delivery",   icon: ArrowUpRight },
  { key: "exchange delivered",        label: "Delivered",          icon: Home },
];

const STATUS_META: Record<ExchangeStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
  "exchange initiated":       { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500",   label: "Initiated" },
  "exchange pickuped":        { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500",    label: "Picked Up" },
  "exchange shipped":         { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200",  dot: "bg-indigo-500",  label: "Replacement Sent" },
  "exchange out of delivery": { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  dot: "bg-violet-500",  label: "Out for Delivery" },
  "exchange delivered":       { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-200",   dot: "bg-green-500",   label: "Delivered" },
};

const initialExchanges: ExchangeRequest[] = [
  {
    id: "EXC-2012", orderId: "#DD-6544", customerName: "Karan Johar",
    email: "karan.j@gmail.com", phone: "+91 99999 77777", date: "2026-06-26",
    reason: "Jacket fits too snug around shoulders. Requesting size up.",
    status: "exchange initiated",
    items: [{ name: "Structured Canvas Jacket", sku: "DD-STR-001", originalSize: "M", requestedSize: "L", qty: 1, price: 5800, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop" }],
    timeline: [{ status: "exchange initiated", timestamp: "2026-06-26 11:20", note: "Customer submitted exchange request via profile dashboard." }]
  },
  {
    id: "EXC-2011", orderId: "#DD-6542", customerName: "Meera Patel",
    email: "meera.p@yahoo.com", phone: "+91 98765 00000", date: "2026-06-25",
    reason: "Dress size feels too loose. Requesting size S instead of M.",
    status: "exchange shipped",
    items: [{ name: "Everyday Relaxed Shift Dress", sku: "DD-EVE-002", originalSize: "M", requestedSize: "S", qty: 1, price: 3200, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop" }],
    timeline: [
      { status: "exchange initiated", timestamp: "2026-06-25 09:45", note: "Customer requested exchange." },
      { status: "exchange pickuped", timestamp: "2026-06-26 14:00", note: "Original item collected by courier pickup agent." },
      { status: "exchange shipped", timestamp: "2026-06-27 10:30", note: "Replacement (Size S) dispatched to customer address." }
    ]
  },
  {
    id: "EXC-2010", orderId: "#DD-6538", customerName: "Vikram Nair",
    email: "vikram.n@gmail.com", phone: "+91 90000 11111", date: "2026-06-21",
    reason: "Wrong color delivered — requested Black instead of Navy.",
    status: "exchange delivered",
    items: [{ name: "Modern Oversized Knitwear", sku: "DD-MOD-003", originalSize: "L", requestedSize: "L", qty: 1, price: 4200, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" }],
    timeline: [
      { status: "exchange initiated", timestamp: "2026-06-21 08:00", note: "Exchange request raised." },
      { status: "exchange pickuped", timestamp: "2026-06-22 11:30", note: "Incorrect item collected from customer." },
      { status: "exchange shipped", timestamp: "2026-06-23 09:00", note: "Correct Black color variant dispatched." },
      { status: "exchange out of delivery", timestamp: "2026-06-24 12:00", note: "Out for delivery to customer." },
      { status: "exchange delivered", timestamp: "2026-06-24 17:30", note: "Customer received correct item. Exchange complete." }
    ]
  }
];

function StatusBadge({ status }: { status: ExchangeStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.dot}`} />
      {m.label}
    </span>
  );
}

export function ExchangesPage() {
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>(initialExchanges);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "In Progress" | "Completed">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const active = useMemo(() => exchanges.find(e => e.id === selectedId) || null, [exchanges, selectedId]);

  const filtered = useMemo(() => exchanges.filter(e => {
    if (activeTab === "Pending" && e.status !== "exchange initiated") return false;
    if (activeTab === "In Progress" && !["exchange pickuped", "exchange shipped", "exchange out of delivery"].includes(e.status)) return false;
    if (activeTab === "Completed" && e.status !== "exchange delivered") return false;
    const q = searchQuery.toLowerCase();
    return e.id.toLowerCase().includes(q) || e.orderId.toLowerCase().includes(q) || e.customerName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
  }), [exchanges, activeTab, searchQuery]);

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filtered, currentPage]);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;

  const updateStatus = (id: string, s: ExchangeStatus) => {
    setExchanges(prev => prev.map(e => {
      if (e.id !== id) return e;
      const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
      return { ...e, status: s, timeline: [...e.timeline, { status: s, timestamp: ts, note: `Status updated to "${s}".` }] };
    }));
  };

  const pendingCount = exchanges.filter(e => e.status === "exchange initiated").length;
  const inProgressCount = exchanges.filter(e => ["exchange pickuped", "exchange shipped", "exchange out of delivery"].includes(e.status)).length;
  const completedCount = exchanges.filter(e => e.status === "exchange delivered").length;
  const totalItems = exchanges.reduce((s, e) => s + e.items.reduce((a, i) => a + i.qty, 0), 0);

  return (
    <div className="space-y-6 font-sans">

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Exchanges", value: exchanges.length.toString(), trend: "up" as const, change: `${totalItems} items`, subtitle: "All time exchange requests" },
          { label: "Pending Pickup", value: pendingCount.toString(), trend: pendingCount > 0 ? "down" as const : "up" as const, change: `${exchanges.length > 0 ? Math.round((pendingCount / exchanges.length) * 100) : 0}% share`, subtitle: "Awaiting agent pickup" },
          { label: "In Progress", value: inProgressCount.toString(), trend: "up" as const, change: `${exchanges.length > 0 ? Math.round((inProgressCount / exchanges.length) * 100) : 0}% share`, subtitle: "Replacement in transit" },
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
            {(["All", "Pending", "In Progress", "Completed"] as const).map(tab => (
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
              <th className="p-4">Item</th>
              <th className="p-4">Size Swap</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
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
                    <p className="text-[10.5px] font-bold text-[#382d24] leading-tight">{exc.items[0]?.name}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-sm">{exc.items[0]?.originalSize}</span>
                    <span className="text-[10px] text-neutral-300 font-bold">→</span>
                    <span className="text-[9px] font-black uppercase px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-sm">{exc.items[0]?.requestedSize}</span>
                  </div>
                </td>
                <td className="p-4"><StatusBadge status={exc.status} /></td>
                <td className="p-4 text-[10px] text-[#615e56] font-semibold">{exc.date}</td>
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
                <span className="text-[8.5px] font-bold tracking-[0.3em] text-[#615e56] uppercase block">Exchange Details</span>
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
                <StatusBadge status={active.status} />
              </div>

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
                        <p className="text-[12px] font-bold text-[#224870] mt-1">{RS}{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    {/* Size swap row */}
                    <div className="border-t border-neutral-200/60 px-4 py-3 bg-background/40 flex items-center justify-center gap-5">
                      <div className="text-center">
                        <p className="text-[8.5px] font-bold uppercase tracking-widest text-[#615e56] mb-2">Original Size</p>
                        <span className="inline-flex items-center justify-center w-12 h-12 bg-red-50 border-2 border-red-200 text-red-700 font-bold text-lg">{item.originalSize}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-6 h-[2px] bg-neutral-200" />
                        <span className="text-[7.5px] font-bold uppercase tracking-widest text-neutral-400">Swap</span>
                        <div className="w-6 h-[2px] bg-neutral-200" />
                      </div>
                      <div className="text-center">
                        <p className="text-[8.5px] font-bold uppercase tracking-widest text-[#615e56] mb-2">New Size</p>
                        <span className="inline-flex items-center justify-center w-12 h-12 bg-green-50 border-2 border-green-300 text-green-700 font-bold text-lg">{item.requestedSize}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-3 px-3.5 py-3 bg-amber-50 border border-amber-200/60 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700">Reason for Exchange</p>
                    <p className="text-[10.5px] font-semibold text-[#382d24] mt-0.5">{active.reason}</p>
                  </div>
                </div>
              </div>

              {/* Vertical Timeline */}
              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-4">Exchange Journey</span>
                <div className="relative">
                  <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-neutral-100" />
                  {EXCHANGE_STAGES.map((stage, idx) => {
                    const stageIdx = EXCHANGE_STAGES.findIndex(s => s.key === active.status);
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

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
