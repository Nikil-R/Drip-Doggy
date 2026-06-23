import { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2, Tag, X, Check, AlertTriangle, TrendingUp, Gift, Copy, Calendar, Sparkles } from "lucide-react";

const RS = "₹";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer p-0 shrink-0 border-none outline-none ${
        enabled ? "bg-[#030213]" : "bg-neutral-300"
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
  const color = pct >= 90 ? "bg-[#030213]" : pct >= 60 ? "bg-amber-600" : "bg-neutral-800";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 bg-neutral-200 rounded-none overflow-hidden">
        <div className={`h-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[7.5px] font-bold text-neutral-500">{used}/{limit > 0 ? limit : "∞"}</span>
    </div>
  );
}

export function CouponCodePage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "expired">("all");
  const [showModal, setShowModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Detailed Modal form state
  const [form, setForm] = useState<Omit<Coupon, "id" | "usedCount">>({
    code: "", type: "percentage", value: 0, minAmount: 0, maxDiscount: 0,
    usageLimit: 0, validFrom: "", validTo: "", status: "active",
    category: "All", description: "", stackable: false, firstOrderOnly: false,
    targetSegment: "all", excludedCategories: []
  });

  const filtered = useMemo(() => {
    return coupons.filter(c => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (search && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [coupons, search, statusFilter]);

  const summaryStats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter(c => c.status === "active").length;
    const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);
    const avgUsage = totalUsed > 0 ? Math.round((totalUsed / coupons.length)) : 0;
    const totalRevenueDriven = coupons.reduce((sum, c) => sum + (c.revenueGenerated || 0), 0);
    return { total, active, totalUsed, avgUsage, totalRevenueDriven };
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

  // Auto generate styled coupon code
  const handleAutoGenerateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "DD-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm(prev => ({ ...prev, code }));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // Save Add/Edit handler
  const save = () => {
    if (!form.code.trim()) return;

    // Validate dates and automatically set expired status if validTo is passed
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
  };

  const confirmDelete = () => {
    if (deleteId) {
      setCoupons(prev => prev.filter(c => c.id !== deleteId));
      setSelectedIds(prev => prev.filter(id => id !== deleteId));
      setDeleteId(null);
    }
  };

  // Bulk options
  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} coupon codes?`)) {
      setCoupons(prev => prev.filter(c => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    }
  };

  const handleBulkStatusChange = (status: "active" | "inactive") => {
    setCoupons(prev => prev.map(c => selectedIds.includes(c.id) ? { ...c, status } : c));
    setSelectedIds([]);
  };

  return (
    <div className="space-y-8 font-sans text-[#030213]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">Coupons &amp; Offers</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Configure discounts, referral campaigns, and checkouts promotions</p>
        </div>
        <button onClick={openAdd} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none border-none">
          <Plus className="w-3.5 h-3.5" /> Create Coupon
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: "Total Coupon Codes", value: summaryStats.total },
          { label: "Active Promos", value: summaryStats.active },
          { label: "Total Redemptions", value: summaryStats.totalUsed },
          { label: "Revenue Driven (Bank)", value: RS + summaryStats.totalRevenueDriven.toLocaleString("en-IN") }
        ].map((stat, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[105px] rounded-none hover:shadow-sm">
            <div>
              <span className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase block">{stat.label}</span>
            </div>
            <div className="mt-3">
              <span className="text-xl font-bold tracking-tight text-[#030213]">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk action selection bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#030213] text-white p-3.5 flex items-center justify-between border border-[#030213] rounded-none">
          <span className="text-[8px] font-bold tracking-widest uppercase">{selectedIds.length} Coupons Selected</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handleBulkStatusChange("active")} className="bg-transparent border border-white/20 text-white hover:border-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer">
              Bulk Activate
            </button>
            <button onClick={() => handleBulkStatusChange("inactive")} className="bg-transparent border border-white/20 text-white hover:border-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer">
              Bulk Deactivate
            </button>
            <button onClick={handleBulkDelete} className="bg-[#b2533e] text-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer border-none">
              Bulk Delete
            </button>
            <button onClick={() => setSelectedIds([])} className="bg-transparent border-none text-white/50 hover:text-white p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Core grid body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Table */}
        <div className="lg:col-span-8 bg-card border border-neutral-200/80 p-5 rounded-none space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search coupon code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-card border border-neutral-200 pl-8 pr-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-full rounded-none"
              />
            </div>

            <div className="flex items-center bg-card border border-neutral-200 p-1">
              {["all", "active", "inactive", "expired"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab as any)}
                  className={`px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest border-none cursor-pointer rounded-none ${
                    statusFilter === tab ? "bg-[#030213] text-white" : "bg-transparent text-neutral-400 hover:text-[#030213]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left uppercase text-[8.5px] font-bold tracking-wider divide-y divide-neutral-100 border border-neutral-200/60">
              <thead>
                <tr className="border-b border-neutral-200 bg-card/60 text-[7px] text-neutral-400 tracking-[0.2em]">
                  <th className="p-3 w-8">
                    <button
                      onClick={() => {
                        const currentIds = filtered.map(c => c.id);
                        const allSelected = currentIds.every(id => selectedIds.includes(id));
                        if (allSelected) {
                          setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
                        } else {
                          setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
                        }
                      }}
                      className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#030213] p-0 flex items-center"
                    >
                      <span className={`w-3.5 h-3.5 border border-neutral-300 inline-block flex items-center justify-center ${filtered.every(c => selectedIds.includes(c.id)) ? "bg-[#030213] border-[#030213]" : ""}`}>
                        {filtered.every(c => selectedIds.includes(c.id)) && <Check className="w-2.5 h-2.5 text-white" />}
                      </span>
                    </button>
                  </th>
                  <th className="p-3 font-bold">Offer Details</th>
                  <th className="p-3 font-bold">Discount Rate</th>
                  <th className="p-3 font-bold">Constraints</th>
                  <th className="p-3 font-bold">Redemptions</th>
                  <th className="p-3 font-bold">Revenue Driven</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                {filtered.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-neutral-100/50 transition-colors">
                    <td className="p-3">
                      <button onClick={() => setSelectedIds(prev => prev.includes(coupon.id) ? prev.filter(x => x !== coupon.id) : [...prev, coupon.id])} className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#030213] p-0 flex items-center">
                        <span className={`w-3.5 h-3.5 border border-neutral-300 inline-block flex items-center justify-center ${selectedIds.includes(coupon.id) ? "bg-[#030213] border-[#030213]" : ""}`}>
                          {selectedIds.includes(coupon.id) && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-[#030213] text-[9.5px]">{coupon.code}</div>
                      <span className="text-[6.5px] text-neutral-400 font-semibold tracking-wide lowercase">{coupon.description}</span>
                    </td>
                    <td className="p-3 font-bold text-[#030213]">
                      {coupon.type === "percentage" ? `${coupon.value}% OFF` : coupon.type === "freeship" ? "FREE SHIP" : `${RS}${coupon.value} OFF`}
                    </td>
                    <td className="p-3 text-neutral-500 font-bold">
                      <div>Min Spend: {RS}{coupon.minAmount}</div>
                      <span className="text-[6.5px] text-neutral-400">Excludes: {coupon.category}</span>
                    </td>
                    <td className="p-3">
                      <UsageBar used={coupon.usedCount} limit={coupon.usageLimit} />
                    </td>
                    <td className="p-3 font-bold text-green-700">
                      {RS}{(coupon.revenueGenerated || 0).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <ToggleSwitch enabled={coupon.status === "active"} onClick={() => toggleStatus(coupon)} />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(coupon)} className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteId(coupon.id)} className="text-neutral-400 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer">
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

        {/* Right Column: Digital Coupon Ticket Previews */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-[9px] font-bold tracking-[0.25em] text-neutral-400 uppercase block pl-1">Streetwear Digital Tickets</span>
          
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
            {coupons.filter(c => c.status === "active").map((coupon, i) => {
              const borderStyles = 
                coupon.type === "percentage" ? "border-2 border-[#2b3a2b]" :
                coupon.type === "flat" ? "border-2 border-[#544331]" :
                "border-2 border-[#1f2937]";
                
              const bgStyles = 
                coupon.type === "percentage" ? "bg-[#334633]" :
                coupon.type === "flat" ? "bg-[#66523d]" :
                "bg-[#374151]";

              const textColors = "text-[#fef9f0]"; // High contrast cream text

              return (
                <div key={coupon.id} className={`${borderStyles} ${bgStyles} p-4.5 rounded-none relative overflow-hidden select-none`}>
                  {/* Perforation design lines */}
                  <div className={`absolute right-[25%] top-0 bottom-0 border-l-2 border-dashed ${coupon.type === "percentage" ? "border-[#faf7f2]/20" : coupon.type === "flat" ? "border-[#faf7f2]/20" : "border-neutral-400/20"} flex flex-col justify-between py-2`}>
                    <div className={`${bgStyles} w-2.5 h-2.5 border ${borderStyles} -ml-[6px] -mt-3.5 rounded-full`} />
                    <div className={`${bgStyles} w-2.5 h-2.5 border ${borderStyles} -ml-[6px] -mb-3.5 rounded-full`} />
                  </div>

                  <div className="flex justify-between items-stretch h-24">
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className={`text-[6.5px] font-bold tracking-[0.25em] uppercase border px-2 py-0.5 ${
                          coupon.type === "percentage" ? "border-[#8fa78f] text-[#8fa78f]" : 
                          coupon.type === "flat" ? "border-[#d0bfa7] text-[#d0bfa7]" : 
                          "border-neutral-400 text-neutral-400"
                        }`}>Drip Doggy Offer Ticket</span>
                        <h4 className={`text-lg font-bold uppercase mt-2 tracking-tighter ${textColors}`}>
                          {coupon.type === "percentage" ? `${coupon.value}%` : coupon.type === "freeship" ? "FREE" : `₹${coupon.value}`} OFF
                        </h4>
                      </div>
                      <div className="text-[7.5px] uppercase tracking-wider text-neutral-300 font-bold">
                        Min Spend: {RS}{coupon.minAmount.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="w-20 flex flex-col items-center justify-center pl-2.5 border-l border-neutral-200/25">
                      <span className="text-[6.5px] text-neutral-300 font-bold uppercase tracking-widest block mb-1">Code</span>
                      <div 
                        onClick={() => handleCopyCode(coupon.code)}
                        className={`text-[#1d1c16] hover:bg-neutral-100 transition-colors font-bold text-[8px] px-2 py-1 rounded-none uppercase cursor-pointer text-center relative ${
                          coupon.type === "percentage" ? "bg-[#8fa78f]" : 
                          coupon.type === "flat" ? "bg-[#d0bfa7]" : 
                          "bg-neutral-300"
                        }`}
                      >
                        {copiedCode === coupon.code ? <Check className="w-3 h-3 mx-auto" /> : coupon.code}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card border-2 border-[#030213] w-full max-w-lg p-6 rounded-none space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-[10px] font-bold text-[#030213] uppercase tracking-widest">{editCoupon ? "Edit Promotion Token" : "Create Promotion Token"}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Coupon Code</label>
                  <button type="button" onClick={handleAutoGenerateCode} className="text-[#b2533e] hover:text-[#030213] text-[7.5px] font-bold uppercase tracking-widest flex items-center gap-1 bg-transparent border-none cursor-pointer">
                    <Sparkles className="w-3 h-3" /> Auto Code Generate
                  </button>
                </div>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none bg-card" placeholder="e.g. DD-SUMMER50" />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Description</label>
                <input value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card" placeholder="Welcome discount description details" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Discount Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })}
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none bg-card cursor-pointer">
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (Fixed Amount)</option>
                  <option value="freeship">Free Shipping</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Discount Value</label>
                <input type="number" disabled={form.type === "freeship"} value={form.type === "freeship" ? 0 : form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })}
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card disabled:opacity-50" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Min Spend Billed (₹)</label>
                <input type="number" value={form.minAmount} onChange={e => setForm({ ...form, minAmount: Number(e.target.value) })}
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Max Discount Cap (₹)</label>
                <input type="number" disabled={form.type === "freeship"} value={form.type === "freeship" ? 0 : form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card disabled:opacity-50" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Total Usage Limit</label>
                <input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: Number(e.target.value) })}
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Excluded Categories</label>
                <select value={form.category || "All"} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none bg-card cursor-pointer">
                  <option value="All">All Categories</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Knitwear">Knitwear</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Valid From</label>
                <input type="date" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })}
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Valid To</label>
                <input type="date" value={form.validTo} onChange={e => setForm({ ...form, validTo: e.target.value })}
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none bg-card" />
              </div>

              <div className="col-span-2 grid grid-cols-3 gap-2 border-t border-neutral-200 pt-3">
                <label className="flex items-center gap-1 text-[8px] font-bold text-neutral-700 uppercase cursor-pointer">
                  <input type="checkbox" checked={form.stackable} onChange={e => setForm({ ...form, stackable: e.target.checked })} className="accent-[#030213]" />
                  Stackable
                </label>
                <label className="flex items-center gap-1 text-[8px] font-bold text-neutral-700 uppercase cursor-pointer">
                  <input type="checkbox" checked={form.firstOrderOnly} onChange={e => setForm({ ...form, firstOrderOnly: e.target.checked })} className="accent-[#030213]" />
                  1st Order Only
                </label>
                <div className="flex border border-neutral-200 bg-card px-1 py-0.5">
                  <span className="text-[6.5px] font-bold text-neutral-400 uppercase tracking-widest mr-1 self-center">Segment:</span>
                  <select value={form.targetSegment} onChange={e => setForm({ ...form, targetSegment: e.target.value as any })} className="bg-transparent border-none text-[8px] font-semibold uppercase focus:outline-none cursor-pointer w-full">
                    <option value="all">All Groups</option>
                    <option value="vip">VIP Only</option>
                    <option value="new">New Only</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-600 text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none bg-transparent">Cancel</button>
              <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">{editCoupon ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-xs flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-card border-2 border-[#030213] p-6 max-w-sm mx-4 rounded-none space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-[10px] font-bold text-[#b2533e] uppercase tracking-widest">Delete Coupon Code Token?</h3>
            <p className="text-[9px] text-neutral-500 font-bold uppercase leading-normal">This action is permanent and will invalidate active customer shopping checkout tokens.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={confirmDelete} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
