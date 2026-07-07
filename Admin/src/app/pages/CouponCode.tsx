import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Plus, Edit2, Trash2, X, Check, Copy, Calendar, Sparkles, TrendingUp, TrendingDown,
  Percent, ShoppingBag, ArrowRight, Tag, HelpCircle, Info
} from "lucide-react";

const RS = "₹";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer p-0 shrink-0 border-none outline-none ${
        enabled ? "bg-[#224870]" : "bg-neutral-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "flat" | "freeship";
  value: number;
  minAmount: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  status: "active" | "inactive" | "expired";
  category?: string;
  description?: string;
  stackable?: boolean;
  firstOrderOnly?: boolean;
  targetSegment?: "all" | "vip" | "new";
  excludedCategories?: string[];
  revenueGenerated?: number;
}

const initialCoupons: Coupon[] = [
  { id: 1, code: "DD-WELCOME15", type: "percentage", value: 15, minAmount: 1500, maxDiscount: 3000, usageLimit: 500, usedCount: 284, validFrom: "2026-01-01", validTo: "2026-12-31", status: "active", category: "All", description: "Welcome discount for new customers", stackable: false, firstOrderOnly: true, targetSegment: "new", revenueGenerated: 342000 },
  { id: 2, code: "DD-FLAT500", type: "flat", value: 500, minAmount: 2500, maxDiscount: 500, usageLimit: 200, usedCount: 87, validFrom: "2026-03-01", validTo: "2026-09-30", status: "active", category: "Outerwear", description: "Flat discount on outerwear collection", stackable: true, firstOrderOnly: false, targetSegment: "all", revenueGenerated: 125000 },
  { id: 3, code: "DD-SUMMER25", type: "percentage", value: 25, minAmount: 3000, maxDiscount: 7500, usageLimit: 300, usedCount: 0, validFrom: "2026-06-01", validTo: "2026-08-31", status: "active", category: "Knitwear", description: "Summer knitwear special", stackable: false, firstOrderOnly: false, targetSegment: "all", revenueGenerated: 0 },
  { id: 4, code: "DD-WELCOME500", type: "flat", value: 500, minAmount: 2500, maxDiscount: 500, usageLimit: 100, usedCount: 42, validFrom: "2026-01-01", validTo: "2026-12-31", status: "active", category: "All", description: "Special checkout welcome gift", stackable: false, firstOrderOnly: true, targetSegment: "all", revenueGenerated: 21000 },
  { id: 5, code: "DD-FREESHIP", type: "freeship", value: 0, minAmount: 2999, maxDiscount: 499, usageLimit: 1000, usedCount: 612, validFrom: "2026-01-01", validTo: "2026-12-31", status: "active", category: "All", description: "Free shipping on orders above " + RS + "2,999", stackable: true, firstOrderOnly: false, targetSegment: "all", revenueGenerated: 154000 }
];

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 100;
  const color = pct >= 90 ? "bg-[#382d24]" : pct >= 60 ? "bg-amber-600" : "bg-[#224870]";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 bg-neutral-200 rounded-none overflow-hidden">
        <div className={`h-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[8px] font-bold text-neutral-500">{used}/{limit > 0 ? limit : "∞"}</span>
    </div>
  );
}

export function CouponCodePage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "expired">("all");
  const [segmentFilter, setSegmentFilter] = useState<"all" | "vip" | "new">("all");
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Date range state
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(5);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Form state
  const [form, setForm] = useState<Omit<Coupon, "id" | "usedCount">>({
    code: "", type: "percentage", value: 0, minAmount: 0, maxDiscount: 0,
    usageLimit: 0, validFrom: "", validTo: "", status: "active",
    category: "All", description: "", stackable: false, firstOrderOnly: false,
    targetSegment: "all", excludedCategories: []
  });

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysInMonth = useMemo(() => new Date(calYear, calMonth + 1, 0).getDate(), [calYear, calMonth]);
  const startDay = useMemo(() => new Date(calYear, calMonth, 1).getDay(), [calYear, calMonth]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) setShowCalendar(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDateClick = (day: number) => {
    const fm = String(calMonth + 1).padStart(2, "0");
    const fd = String(day).padStart(2, "0");
    const dateStr = `${calYear}-${fm}-${fd}`;
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: dateStr, end: "" });
    } else {
      const start = new Date(dateRange.start);
      const clicked = new Date(dateStr);
      if (clicked < start) setDateRange({ start: dateStr, end: dateRange.start });
      else setDateRange({ start: dateRange.start, end: dateStr });
      setShowCalendar(false);
    }
  };

  const getDateLabel = () => {
    if (!dateRange.start) return "Select Date Range";
    const s = new Date(dateRange.start).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    if (!dateRange.end) return `${s} - ...`;
    const e = new Date(dateRange.end).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    return `${s} – ${e}`;
  };

  const filtered = useMemo(() => {
    return coupons.filter(c => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (segmentFilter !== "all" && c.targetSegment !== segmentFilter) return false;
      if (search && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
      
      // Date filters
      if (dateRange.start) {
        if (!c.validFrom || c.validFrom < dateRange.start) return false;
      }
      if (dateRange.end) {
        if (!c.validTo || c.validTo > dateRange.end) return false;
      }
      return true;
    });
  }, [coupons, search, statusFilter, segmentFilter, dateRange]);

  const summaryStats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter(c => c.status === "active").length;
    const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);
    const totalRevenueDriven = coupons.reduce((sum, c) => sum + (c.revenueGenerated || 0), 0);
    return { total, active, totalUsed, totalRevenueDriven };
  }, [coupons]);

  const openAdd = () => {
    setEditCoupon(null);
    setForm({ 
      code: "", type: "percentage", value: 0, minAmount: 0, maxDiscount: 0, 
      usageLimit: 0, validFrom: "", validTo: "", status: "active", 
      category: "All", description: "", stackable: false, firstOrderOnly: false,
      targetSegment: "all", excludedCategories: [] 
    });
    setShowModal(true);
  };

  const openEdit = (c: Coupon) => {
    setEditCoupon(c);
    setForm({ 
      code: c.code, type: c.type, value: c.value, minAmount: c.minAmount, 
      maxDiscount: c.maxDiscount, usageLimit: c.usageLimit, validFrom: c.validFrom, 
      validTo: c.validTo, status: c.status, category: c.category || "All", 
      description: c.description || "", stackable: c.stackable || false, 
      firstOrderOnly: c.firstOrderOnly || false, targetSegment: c.targetSegment || "all",
      excludedCategories: c.excludedCategories || []
    });
    setShowModal(true);
  };

  const handleAutoGenerateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "DD-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm(prev => ({ ...prev, code }));
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const save = () => {
    if (!form.code.trim()) return;

    let computedStatus = form.status;
    if (form.validTo) {
      const today = new Date().toISOString().split("T")[0];
      if (form.validTo < today) {
        computedStatus = "expired";
      }
    }

    if (editCoupon) {
      setCoupons(prev => prev.map(c => c.id === editCoupon.id ? { 
        ...c, 
        code: form.code, type: form.type, value: form.value, minAmount: form.minAmount,
        maxDiscount: form.maxDiscount, usageLimit: form.usageLimit, validFrom: form.validFrom,
        validTo: form.validTo, status: computedStatus, category: form.category, 
        description: form.description, stackable: form.stackable, 
        firstOrderOnly: form.firstOrderOnly, targetSegment: form.targetSegment,
        excludedCategories: form.excludedCategories
      } : c));
    } else {
      const newCoupon: Coupon = {
        id: Math.max(...coupons.map(c => c.id)) + 1,
        usedCount: 0,
        code: form.code,
        type: form.type,
        value: form.value,
        minAmount: form.minAmount,
        maxDiscount: form.maxDiscount,
        usageLimit: form.usageLimit,
        validFrom: form.validFrom,
        validTo: form.validTo,
        status: computedStatus,
        category: form.category,
        description: form.description,
        stackable: form.stackable,
        firstOrderOnly: form.firstOrderOnly,
        targetSegment: form.targetSegment,
        excludedCategories: form.excludedCategories,
        revenueGenerated: 0
      };
      setCoupons(prev => [...prev, newCoupon]);
    }
    setShowModal(false);
  };

  const toggleStatus = (c: Coupon) => {
    const nextStatus = c.status === "active" ? "inactive" : "active";
    setCoupons(prev => prev.map(item => item.id === c.id ? { ...item, status: nextStatus } : item));
    if (selectedCoupon && selectedCoupon.id === c.id) {
      setSelectedCoupon(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      setCoupons(prev => prev.filter(c => c.id !== deleteId));
      if (selectedCoupon && selectedCoupon.id === deleteId) {
        setSelectedCoupon(null);
      }
      setDeleteId(null);
    }
  };

  const tabs = [
    { id: "all", label: "All", count: coupons.length },
    { id: "active", label: "Active", count: coupons.filter(c => c.status === "active").length },
    { id: "inactive", label: "Inactive", count: coupons.filter(c => c.status === "inactive").length },
    { id: "expired", label: "Expired", count: coupons.filter(c => c.status === "expired").length },
  ];

  return (
    <div className="space-y-8 font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest">Coupons &amp; Offers</h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">Configure discounts, COUPON tickets, and checkout promotions</p>
        </div>
        <button onClick={openAdd} className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-2 transition-all cursor-pointer border-none self-start md:self-auto">
          <Plus className="w-3.5 h-3.5" /> Create Coupon
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Coupon Codes", value: summaryStats.total.toString(), trend: "up", change: "+12.5%", subtitle: "Total coupons created" },
          { label: "Active Promos", value: summaryStats.active.toString(), trend: "up", change: "+8.4%", subtitle: "Currently live at checkout" },
          { label: "Total Redemptions", value: summaryStats.totalUsed.toLocaleString("en-IN"), trend: "up", change: "+24.1%", subtitle: "Successful checkouts" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">{stat.label}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl font-bold tracking-tight text-[#382d24] whitespace-nowrap">{stat.value}</span>
              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1 py-0.5 border rounded-sm whitespace-nowrap bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="h-2.5 w-2.5" />
                {stat.change}
              </span>
            </div>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Core Grid Body */}
      <div className="bg-card border border-neutral-200/80 overflow-hidden">
        
        {/* Filters bar */}
        <div className="p-4 border-b border-neutral-200/60 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Status tabs */}
            <div className="flex bg-background border border-neutral-200 p-1 rounded-full gap-0.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 text-[8.5px] font-bold tracking-widest uppercase border-none cursor-pointer rounded-full transition-all ${
                    statusFilter === tab.id ? "bg-[#224870] text-white shadow-sm" : "bg-transparent text-neutral-500 hover:text-[#224870]"
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 text-[7px] ${statusFilter === tab.id ? "text-white/70" : "text-neutral-400"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>



            {/* Calendar picker */}
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-2 border border-neutral-200/80 px-2.5 py-1.5 bg-card hover:border-[#224870] transition-colors rounded-sm text-[9px] font-bold text-[#382d24] uppercase tracking-wider cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5 text-[#615e56] shrink-0" />
                <span>{getDateLabel()}</span>
              </button>

              {showCalendar && (
                <div className="absolute top-10 left-0 w-64 bg-card border border-neutral-300 z-30 shadow-2xl p-4 rounded-sm font-sans text-[10px]">
                  <div className="flex justify-between items-center mb-3">
                    <button
                      type="button"
                      onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}
                      className="p-1 hover:bg-neutral-100 bg-transparent border-none cursor-pointer text-[#382d24] font-bold text-[11px]"
                    >&lt;</button>
                    <span className="font-extrabold uppercase tracking-widest text-[#382d24]">
                      {monthNames[calMonth]} {calYear}
                    </span>
                    <button
                      type="button"
                      onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}
                      className="p-1 hover:bg-neutral-100 bg-transparent border-none cursor-pointer text-[#382d24] font-bold text-[11px]"
                    >&gt;</button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center font-bold text-[#615e56] uppercase text-[8px] tracking-widest mb-1.5">
                    {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <span key={d}>{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const fm = String(calMonth + 1).padStart(2, "0");
                      const fd = String(dayNum).padStart(2, "0");
                      const cellStr = `${calYear}-${fm}-${fd}`;
                      const isSelected = dateRange.start === cellStr || dateRange.end === cellStr;
                      const inRange = (() => {
                        if (!dateRange.start || !dateRange.end) return false;
                        const d = new Date(cellStr);
                        return d >= new Date(dateRange.start) && d <= new Date(dateRange.end);
                      })();
                      return (
                        <button
                          key={dayNum}
                          type="button"
                          onClick={() => handleDateClick(dayNum)}
                          className={`p-1.5 font-bold rounded-none text-center cursor-pointer text-[9px] transition-colors border-none ${
                            isSelected ? "bg-[#224870] text-white" :
                            inRange    ? "bg-[#224870]/15 text-[#382d24]" :
                                         "bg-transparent text-[#382d24] hover:bg-neutral-200/40"
                          }`}
                        >{dayNum}</button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center border-t border-neutral-200/60 pt-3.5 mt-3.5">
                    <button
                      type="button"
                      onClick={() => { setDateRange({ start: "", end: "" }); setShowCalendar(false); }}
                      className="text-[8px] font-bold text-red-700 hover:underline uppercase bg-transparent border-none cursor-pointer"
                    >Clear Range</button>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(false)}
                      className="bg-[#224870] text-white text-[8px] font-bold tracking-widest px-3 py-1 uppercase cursor-pointer border-none"
                    >Close</button>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search coupon code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-card border border-neutral-200 pl-10 pr-4 py-2 text-[9.5px] font-semibold focus:outline-none focus:border-[#224870] placeholder-neutral-400 w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        {/* Table - No Checkboxes, Row click opens Detail Modal */}
        <div className="overflow-x-auto">
          <table className="w-full text-left uppercase text-[9.5px] tracking-wider divide-y divide-neutral-100/80">
            <thead>
              <tr className="border-b border-neutral-200/80 bg-background/60 text-[9.5px] text-[#615e56] font-[900] tracking-[0.12em]">
                <th className="p-4 font-bold">Offer Details</th>
                <th className="p-4 font-bold">Discount Rate</th>
                <th className="p-4 font-bold">Constraints</th>
                <th className="p-4 font-bold">Redemptions</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100/80">
              {filtered.map(coupon => (
                <tr
                  key={coupon.id}
                  onClick={() => setSelectedCoupon(coupon)}
                  className="hover:bg-[#224870]/5 transition-colors cursor-pointer"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[11px] text-[#382d24] uppercase tracking-wider">{coupon.code}</span>
                      <button
                        onClick={(e) => handleCopyCode(coupon.code, e)}
                        className="p-1 text-neutral-400 hover:text-[#224870] hover:bg-[#224870]/10 bg-transparent border-none cursor-pointer rounded-full transition-all"
                      >
                        {copiedCode === coupon.code ? <Check className="w-3 h-3 text-green-600 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <span className="text-[8px] text-[#615e56] font-semibold">{coupon.description || "No description"}</span>
                  </td>
                  <td className="p-4 font-bold text-[#382d24] text-[10.5px]">
                    {coupon.type === "percentage" ? `${coupon.value}% OFF` : coupon.type === "freeship" ? "FREE SHIP" : `${RS}${coupon.value} OFF`}
                  </td>
                  <td className="p-4 text-[#736e64] font-semibold text-[9.5px]">
                    <div>Min: {RS}{coupon.minAmount.toLocaleString()}</div>
                    <span className="text-[8px] text-[#615e56]">Category: {coupon.category}</span>
                  </td>
                  <td className="p-4">
                    <UsageBar used={coupon.usedCount} limit={coupon.usageLimit} />
                  </td>
                  <td className="p-4">
                    <ToggleSwitch enabled={coupon.status === "active"} onClick={() => toggleStatus(coupon)} />
                  </td>
                  <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(coupon)}
                        className="text-neutral-400 hover:text-[#224870] hover:bg-[#224870]/10 p-1.5 bg-transparent border-none cursor-pointer rounded-sm transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(coupon.id)}
                        className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1.5 bg-transparent border-none cursor-pointer rounded-sm transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Detail Modal */}
      {selectedCoupon && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setSelectedCoupon(null)}>
          <div className="bg-card border-2 border-[#224870] w-full max-w-lg select-none" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-200 flex items-start justify-between">
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-[#615e56] uppercase">Coupon Details</span>
                <h2 className="text-[17px] font-[950] text-[#382d24] uppercase tracking-widest mt-0.5">{selectedCoupon.code}</h2>
              </div>
              <button onClick={() => setSelectedCoupon(null)} className="p-2 border border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-[#382d24] bg-transparent cursor-pointer transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* High fidelity ticket display */}
              <div className="bg-[#224870] text-white p-5 relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-28 bg-white/5 skew-x-12 translate-x-10" />
                <div className="absolute -left-10 -top-10 w-24 h-24 border border-white/10 rounded-full" />
                <div className="absolute right-[23%] top-0 bottom-0 border-l border-dashed border-white/30 flex flex-col justify-between py-0">
                  <div className="w-3 h-3 bg-card -ml-1.5 -mt-1.5 rounded-full" />
                  <div className="w-3 h-3 bg-card -ml-1.5 -mb-1.5 rounded-full" />
                </div>
                <div className="flex justify-between items-stretch h-28">
                  <div className="flex-1 flex flex-col justify-between pr-6">
                    <div>
                      <span className="text-[7.5px] font-bold tracking-widest uppercase bg-white/15 px-2 py-0.5">Drip Doggy Premium Offer</span>
                      <h4 className="text-[32px] font-[950] uppercase mt-1.5 tracking-tight leading-none">
                        {selectedCoupon.type === "percentage" ? `${selectedCoupon.value}%` : selectedCoupon.type === "freeship" ? "FREE" : `${RS}${selectedCoupon.value}`} <span className="text-[20px] font-bold opacity-80">OFF</span>
                      </h4>
                    </div>
                    <div className="text-[8px] uppercase tracking-wider text-white/70 font-bold space-y-0.5">
                      <p>Min Spend: {RS}{Number(selectedCoupon.minAmount).toLocaleString()}</p>
                      <p className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> Valid: {selectedCoupon.validFrom || "—"} to {selectedCoupon.validTo || "—"}</p>
                    </div>
                  </div>
                  <div className="w-24 flex flex-col items-center justify-center border-l border-white/20">
                    <span className="text-[6.5px] text-white/50 font-bold uppercase tracking-widest block mb-2">Code</span>
                    <div
                      onClick={(e) => handleCopyCode(selectedCoupon.code, e)}
                      className="bg-white text-[#224870] font-black text-[10px] px-2.5 py-1.5 uppercase tracking-widest text-center cursor-pointer hover:bg-neutral-100 transition-colors"
                    >
                      {copiedCode === selectedCoupon.code ? <Check className="w-3.5 h-3.5 mx-auto" /> : selectedCoupon.code}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Summary Grid */}
              <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-5">
                <div>
                  <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">COUPON Description</span>
                  <p className="text-[11px] font-bold text-[#382d24] mt-1">{selectedCoupon.description || "No description set for this coupon COUPON."}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Revenue Generated</span>
                  <p className="text-[12px] font-black text-green-700 mt-1">{RS}{selectedCoupon.revenueGenerated?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Target Segment</span>
                  <p className="text-[10px] font-bold text-[#382d24] uppercase tracking-wider mt-1">{selectedCoupon.targetSegment || "All Customers"}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Category Scope</span>
                  <p className="text-[10px] font-bold text-[#382d24] uppercase tracking-wider mt-1">{selectedCoupon.category || "All Categories"}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Stackable Offer</span>
                  <p className="text-[10px] font-bold text-[#382d24] uppercase tracking-wider mt-1">{selectedCoupon.stackable ? "Yes, can combine" : "No, single use"}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Customer Limit</span>
                  <p className="text-[10px] font-bold text-[#382d24] uppercase tracking-wider mt-1">{selectedCoupon.firstOrderOnly ? "First order only" : "Multiple orders allowed"}</p>
                </div>
              </div>

              {/* Redemptions Progress */}
              <div className="border-t border-neutral-100 pt-5 space-y-2">
                <div className="flex justify-between items-center text-[9px] font-bold text-[#382d24] uppercase tracking-wider">
                  <span>Redemptions Status</span>
                  <span>{selectedCoupon.usedCount} of {selectedCoupon.usageLimit || "∞"} used</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-none overflow-hidden">
                  <div
                    className="h-full bg-[#224870] transition-all"
                    style={{ width: `${selectedCoupon.usageLimit ? (selectedCoupon.usedCount / selectedCoupon.usageLimit) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200 flex justify-between items-center bg-background/50">
              <button
                onClick={() => {
                  const toDelete = selectedCoupon.id;
                  setSelectedCoupon(null);
                  setDeleteId(toDelete);
                }}
                className="text-red-700 hover:text-red-800 text-[9.5px] font-bold tracking-widest uppercase bg-transparent border-none cursor-pointer"
              >
                Delete COUPON
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCoupon(null)}
                  className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2 uppercase bg-transparent cursor-pointer transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const c = selectedCoupon;
                    setSelectedCoupon(null);
                    openEdit(c);
                  }}
                  className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer border-none transition-all"
                >
                  Edit Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal (with Live Preview) */}
      {showModal && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card border-2 border-[#224870] w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-200 flex items-start justify-between">
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase">{editCoupon ? "Edit" : "Create New"}</span>
                <h2 className="text-[17px] font-[950] text-[#382d24] uppercase tracking-widest mt-0.5">{editCoupon ? "Modify Coupon" : "Create Coupon"}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 border border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-[#382d24] bg-transparent cursor-pointer transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Form columns */}
              <div className="lg:col-span-7 p-6 border-r border-neutral-200 space-y-5 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[8px] font-bold tracking-widest text-[#615e56] uppercase">Coupon Code</label>
                    </div>
                    <input
                      value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-[#224870] transition-all font-mono"
                      placeholder="e.g. DD-SUMMER50"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">Description</label>
                    <input
                      value={form.description || ""}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[10px] font-bold focus:outline-none focus:border-[#224870] transition-all text-[#382d24]"
                      placeholder="e.g. Welcome discount for new customers"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">Discount Type</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value as any })}
                      className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[10px] font-bold uppercase focus:outline-none focus:border-[#224870] transition-all cursor-pointer text-[#382d24]"
                    >
                      <option value="percentage">Percentage %</option>
                      <option value="flat">Fixed Amount {RS}</option>
                      <option value="freeship">Free Shipping</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">Discount Value</label>
                    <input
                      type="number"
                      disabled={form.type === "freeship"}
                      value={form.type === "freeship" ? 0 : form.value}
                      onChange={e => setForm({ ...form, value: Number(e.target.value) })}
                      className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[11px] font-black focus:outline-none focus:border-[#224870] transition-all text-[#382d24] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">Min Spend ({RS})</label>
                    <input
                      type="number"
                      value={form.minAmount}
                      onChange={e => setForm({ ...form, minAmount: Number(e.target.value) })}
                      className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[11px] font-black focus:outline-none focus:border-[#224870] transition-all text-[#382d24]"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">Max Discount Cap ({RS})</label>
                    <input
                      type="number"
                      disabled={form.type === "freeship"}
                      value={form.type === "freeship" ? 0 : form.maxDiscount}
                      onChange={e => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                      className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[11px] font-black focus:outline-none focus:border-[#224870] transition-all text-[#382d24] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">Usage Limit</label>
                    <input
                      type="number"
                      value={form.usageLimit}
                      onChange={e => setForm({ ...form, usageLimit: Number(e.target.value) })}
                      className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[11px] font-black focus:outline-none focus:border-[#224870] transition-all text-[#382d24]"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">Category Scope</label>
                    <select
                      value={form.category || "All"}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[10px] font-bold uppercase focus:outline-none focus:border-[#224870] transition-all cursor-pointer text-[#382d24]"
                    >
                      <option value="All">All Categories</option>
                      <option value="Outerwear">Outerwear</option>
                      <option value="Knitwear">Knitwear</option>
                      <option value="Tops">Tops</option>
                      <option value="Bottoms">Bottoms</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">Valid From</label>
                    <input
                      type="date"
                      value={form.validFrom}
                      onChange={e => setForm({ ...form, validFrom: e.target.value })}
                      className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[10px] font-bold focus:outline-none focus:border-[#224870] transition-all text-[#382d24]"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">Valid To</label>
                    <input
                      type="date"
                      value={form.validTo}
                      onChange={e => setForm({ ...form, validTo: e.target.value })}
                      className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[10px] font-bold focus:outline-none focus:border-[#224870] transition-all text-[#382d24]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 border-t border-neutral-200 pt-4">
                  <label className="flex items-center gap-1.5 text-[8.5px] font-bold text-[#615e56] uppercase cursor-pointer">
                    <input type="checkbox" checked={form.stackable} onChange={e => setForm({ ...form, stackable: e.target.checked })} className="accent-[#224870]" />
                    Stackable
                  </label>
                  <label className="flex items-center gap-1.5 text-[8.5px] font-bold text-[#615e56] uppercase cursor-pointer">
                    <input type="checkbox" checked={form.firstOrderOnly} onChange={e => setForm({ ...form, firstOrderOnly: e.target.checked })} className="accent-[#224870]" />
                    1st Order Only
                  </label>
                </div>
              </div>

              {/* Live Preview Column */}
              <div className="lg:col-span-5 p-6 bg-background flex flex-col justify-center items-center space-y-6">
                <span className="text-[8.5px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Coupon Preview</span>
                
                <div className="bg-[#224870] text-white p-5 relative overflow-hidden select-none w-full max-w-xs shadow-md">
                  <div className="absolute right-0 top-0 bottom-0 w-24 bg-white/5 skew-x-12 translate-x-10" />
                  <div className="absolute -left-10 -top-10 w-20 h-20 border border-white/10 rounded-full" />
                  <div className="absolute right-[25%] top-0 bottom-0 border-l border-dashed border-white/30 flex flex-col justify-between py-0">
                    <div className="w-2.5 h-2.5 bg-background -ml-[5px] -mt-[5px] rounded-full" />
                    <div className="w-2.5 h-2.5 bg-background -ml-[5px] -mb-[5px] rounded-full" />
                  </div>
                  <div className="flex justify-between items-stretch h-24">
                    <div className="flex-1 flex flex-col justify-between pr-4">
                      <div>
                        <span className="text-[6.5px] font-bold tracking-widest uppercase bg-white/15 px-1.5 py-0.5">Drip Doggy Ticket</span>
                        <h4 className="text-[24px] font-[950] uppercase mt-1 tracking-tight leading-none">
                          {form.type === "percentage" ? `${form.value}%` : form.type === "freeship" ? "FREE" : `${RS}${form.value}`} <span className="text-[16px] font-bold opacity-80">OFF</span>
                        </h4>
                      </div>
                      <div className="text-[7.5px] uppercase tracking-wider text-white/70 font-bold space-y-0.5">
                        <p>Min: {RS}{Number(form.minAmount).toLocaleString()}</p>
                        <p className="flex items-center gap-0.5"><Calendar className="w-2 h-2" /> Valid to: {form.validTo || "—"}</p>
                      </div>
                    </div>
                    <div className="w-20 flex flex-col items-center justify-center border-l border-white/20">
                      <span className="text-[6px] text-white/50 font-bold uppercase tracking-widest block mb-1">Code</span>
                      <div className="bg-white text-[#224870] font-black text-[9px] px-2 py-1 uppercase tracking-widest text-center">
                        {form.code || "CODE"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-neutral-200/80 p-4 w-full max-w-xs space-y-2 text-[9px] text-[#615e56]">
                  <div className="flex justify-between">
                    <span className="font-semibold uppercase">Category Restriction:</span>
                    <span className="font-bold text-[#382d24]">{form.category || "All"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold uppercase">Usage Limit:</span>
                    <span className="font-bold text-[#382d24]">{form.usageLimit > 0 ? form.usageLimit : "Unlimited"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold uppercase">Stackable:</span>
                    <span className="font-bold text-[#382d24]">{form.stackable ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200 flex items-center justify-end gap-3 bg-background/50">
              <button type="button" onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-6 py-2.5 uppercase bg-transparent cursor-pointer transition-all">Cancel</button>
              <button type="button" onClick={save} className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-6 py-2.5 uppercase cursor-pointer border-none transition-all">{editCoupon ? "Update" : "Create Coupon"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm mx-4 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <h3 className="text-[11px] font-bold text-red-700 uppercase tracking-widest">Delete Coupon Code?</h3>
            </div>
            <p className="text-[9.5px] text-[#615e56] font-semibold">This action is permanent and will invalidate this coupon for all customers.</p>
            <div className="flex justify-end gap-3 pt-2 border-t border-neutral-200">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2 uppercase bg-transparent cursor-pointer transition-all">Cancel</button>
              <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white text-[9.5px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer border-none transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
