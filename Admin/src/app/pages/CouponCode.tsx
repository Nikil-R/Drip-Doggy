import { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2, Tag, X, Check, AlertTriangle, TrendingUp, Gift, Copy } from "lucide-react";

const RS = "\u20B9";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-9 h-[18px] rounded-full transition-colors duration-200 border-none cursor-pointer ${
        enabled ? "bg-green-500" : "bg-neutral-300"
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
        enabled ? "translate-x-[18px]" : "translate-x-0"
      }`} />
    </button>
  );
}

interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "flat";
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
}

const initialCoupons: Coupon[] = [
  { id: 1, code: "DD-WELCOME15", type: "percentage", value: 15, minAmount: 1500, maxDiscount: 3000, usageLimit: 500, usedCount: 284, validFrom: "2026-01-01", validTo: "2026-12-31", status: "active", category: "All", description: "Welcome discount for new customers" },
  { id: 2, code: "DD-FLAT500", type: "flat", value: 500, minAmount: 2500, maxDiscount: 500, usageLimit: 200, usedCount: 87, validFrom: "2026-03-01", validTo: "2026-09-30", status: "active", category: "Outerwear", description: "Flat discount on outerwear collection" },
  { id: 3, code: "DD-SUMMER25", type: "percentage", value: 25, minAmount: 3000, maxDiscount: 7500, usageLimit: 300, usedCount: 0, validFrom: "2026-06-01", validTo: "2026-08-31", status: "active", category: "Knitwear", description: "Summer knitwear special" },
  { id: 4, code: "DD-VIP-1K", type: "flat", value: 1000, minAmount: 5000, maxDiscount: 1000, usageLimit: 100, usedCount: 42, validFrom: "2026-01-01", validTo: "2026-12-31", status: "active", category: "Premium", description: "VIP members exclusive" },
  { id: 5, code: "DD-FREESHIP", type: "flat", value: 0, minAmount: 2999, maxDiscount: 499, usageLimit: 1000, usedCount: 612, validFrom: "2026-01-01", validTo: "2026-12-31", status: "active", category: "All", description: "Free shipping on orders above " + RS + "2,999" },
  { id: 6, code: "DD-BOGO50", type: "percentage", value: 50, minAmount: 6000, maxDiscount: 5000, usageLimit: 50, usedCount: 18, validFrom: "2026-04-01", validTo: "2026-06-30", status: "active", category: "Tops", description: "Buy one get one 50% off on tops" },
  { id: 7, code: "DD-ARCHIVE40", type: "percentage", value: 40, minAmount: 2000, maxDiscount: 8000, usageLimit: 150, usedCount: 95, validFrom: "2026-01-01", validTo: "2026-03-31", status: "expired", category: "Archive", description: "Archive collection clearance" },
  { id: 8, code: "DD-DIWALI24", type: "flat", value: 1500, minAmount: 7000, maxDiscount: 1500, usageLimit: 0, usedCount: 203, validFrom: "2025-10-01", validTo: "2025-11-15", status: "expired", category: "All", description: "Diwali festive special" },
  { id: 9, code: "DD-NEW10", type: "percentage", value: 10, minAmount: 1000, maxDiscount: 2000, usageLimit: 0, usedCount: 345, validFrom: "2026-02-01", validTo: "2026-07-31", status: "active", category: "All", description: "Spring collection launch" },
  { id: 10, code: "DD-OFFLINE20", type: "percentage", value: 20, minAmount: 2500, maxDiscount: 4000, usageLimit: 0, usedCount: 0, validFrom: "2026-06-15", validTo: "2026-09-15", status: "inactive", category: "All", description: "In-store events (currently offline)" }
];

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 100;
  const color = pct >= 90 ? "bg-green-600" : pct >= 60 ? "bg-amber-500" : "bg-blue-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-neutral-100">
        <div className={`h-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[7px] font-bold text-neutral-500">{used}/{limit > 0 ? limit : "\u221E"}</span>
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

  const [form, setForm] = useState<Omit<Coupon, "id" | "usedCount">>({
    code: "", type: "percentage", value: 0, minAmount: 0, maxDiscount: 0,
    usageLimit: 0, validFrom: "", validTo: "", status: "active",
    category: "All", description: "",
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
    const avgUsage = totalUsed > 0 ? Math.round((totalUsed / coupons.filter(c => c.usageLimit > 0).length)) : 0;
    return { total, active, totalUsed, avgUsage };
  }, [coupons]);

  const openAdd = () => {
    setEditCoupon(null);
    setForm({ code: "", type: "percentage", value: 0, minAmount: 0, maxDiscount: 0, usageLimit: 0, validFrom: "", validTo: "", status: "active" });
    setShowModal(true);
  };

  const openEdit = (c: Coupon) => {
    setEditCoupon(c);
    setForm({ code: c.code, type: c.type, value: c.value, minAmount: c.minAmount, maxDiscount: c.maxDiscount, usageLimit: c.usageLimit, validFrom: c.validFrom, validTo: c.validTo, status: c.status, category: c.category || "All", description: c.description || "" });
    setShowModal(true);
  };

  const save = () => {
    if (editCoupon) {
      setCoupons(coupons.map(c => c.id === editCoupon.id ? { ...c, ...form } : c));
    } else {
      setCoupons([...coupons, { ...form, id: Date.now(), usedCount: 0 }]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id: number) => {
    setCoupons(coupons.map(c => c.id === id ? {
      ...c,
      status: c.status === "active" ? "inactive" as const : c.status === "inactive" ? "active" as const : c.status
    } : c));
  };

  const confirmDelete = () => {
    if (deleteId) { setCoupons(coupons.filter(c => c.id !== deleteId)); setDeleteId(null); }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Coupon Codes</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy promotional campaigns &amp; discounts
          </p>
        </div>
        <button onClick={openAdd} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none border-none">
          <Plus className="w-3.5 h-3.5" /> Create Coupon
        </button>
      </div>

      {/* ── Summary KPIs ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <Tag className="w-5 h-5 text-neutral-400 shrink-0" />
          <div>
            <p className="text-lg font-black text-[#030213]">{summaryStats.total}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Total Coupons</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="text-lg font-black text-green-700">{summaryStats.active}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Active Now</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-neutral-400 shrink-0" />
          <div>
            <p className="text-lg font-black text-[#030213]">{summaryStats.totalUsed.toLocaleString("en-IN")}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Total Uses</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <Gift className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-lg font-black text-amber-700">{summaryStats.avgUsage.toLocaleString("en-IN")}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Avg. Uses</p>
          </div>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-neutral-200/80 p-4">
        <div className="flex gap-1.5">
          {(["all", "active", "inactive", "expired"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-[9px] font-extrabold tracking-widest uppercase cursor-pointer rounded-none border-none ${
                statusFilter === s ? "bg-[#030213] text-white" : "bg-[#faf8f5] text-neutral-400 hover:text-[#030213]"
              }`}>{s} {s !== "all" && `(${coupons.filter(c => c.status === s).length})`}</button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <input type="text" placeholder="Search coupon code..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-white border border-neutral-200/80 pl-8 pr-3 py-2 text-[9px] font-extrabold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-48 rounded-none" />
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200/80 overflow-hidden">
        <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider">
          <thead>
            <tr className="border-b border-neutral-100 bg-[#faf8f5]/60 text-[8px] text-neutral-400 tracking-[0.2em]">
              <th className="p-3 font-black">Code</th>
              <th className="p-3 font-black">Discount</th>
              <th className="p-3 font-black">Min Order</th>
              <th className="p-3 font-black">Usage</th>
              <th className="p-3 font-black">Category</th>
              <th className="p-3 font-black">Valid Period</th>
              <th className="p-3 font-black">Status</th>
              <th className="p-3 font-black text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-[#030213]">{c.code}</span>
                    <button
                      onClick={() => handleCopyCode(c.code)}
                      className="text-neutral-400 hover:text-[#030213] p-0.5 bg-transparent border-none cursor-pointer"
                      title="Copy code"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {copiedCode === c.code && <span className="text-[6px] text-green-600 font-extrabold">Copied!</span>}
                    {c.description && <span className="text-[6px] text-neutral-400 font-semibold lowercase hidden xl:inline ml-1">— {c.description}</span>}
                  </div>
                </td>
                <td className="p-3">
                  <span className={`font-extrabold ${c.value > 0 ? "text-[#030213]" : "text-neutral-500"}`}>
                    {c.type === "percentage" ? `${c.value}% OFF` : c.value > 0 ? RS + c.value.toLocaleString("en-IN") + " OFF" : "FREE SHIPPING"}
                  </span>
                  {c.maxDiscount > 0 && c.type === "percentage" && (
                    <span className="text-[7px] text-neutral-400 font-semibold block">Max {RS}{c.maxDiscount.toLocaleString("en-IN")}</span>
                  )}
                </td>
                <td className="p-3 text-neutral-500">{RS}{c.minAmount.toLocaleString("en-IN")}</td>
                <td className="p-3"><UsageBar used={c.usedCount} limit={c.usageLimit} /></td>
                <td className="p-3"><span className="text-[7px] font-extrabold tracking-widest bg-neutral-50 border border-neutral-200 px-2 py-0.5">{c.category || "All"}</span></td>
                <td className="p-3 text-[7px] text-neutral-500 whitespace-nowrap">{c.validFrom} <span className="text-neutral-300">→</span> {c.validTo}</td>
                <td className="p-3">
                  {c.status === "expired" ? (
                    <span className="text-[8px] font-extrabold tracking-widest px-2 py-0.5 bg-red-50 text-red-600">EXPIRED</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ToggleSwitch enabled={c.status === "active"} onClick={() => toggleStatus(c.id)} />
                      <span className={`text-[7px] font-extrabold tracking-widest ${c.status === "active" ? "text-green-700" : "text-neutral-400"}`}>{c.status === "active" ? "ACTIVE" : "INACTIVE"}</span>
                    </div>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => openEdit(c)} className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteId(c.id)} className="text-neutral-400 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Add/Edit Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white border border-neutral-200 w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-[#030213] uppercase tracking-widest">{editCoupon ? "Edit Coupon" : "Create Coupon"}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Coupon Code</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" placeholder="e.g. DD-SAVE20" />
              </div>
              <div className="col-span-2">
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Description (optional)</label>
                <input value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" placeholder="e.g. Summer collection special" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Discount Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as "percentage" | "flat" })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none bg-white">
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (Fixed / Free Shipping)</option>
                </select>
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Value</label>
                <input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Min Order (₹)</label>
                <input type="number" value={form.minAmount} onChange={e => setForm({ ...form, minAmount: Number(e.target.value) })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Max Discount (₹)</label>
                <input type="number" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Usage Limit (0 = ∞)</label>
                <input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: Number(e.target.value) })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Category</label>
                <select value={form.category || "All"} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none bg-white">
                  <option value="All">All Products</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Knitwear">Knitwear</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Premium">Premium</option>
                  <option value="Archive">Archive</option>
                </select>
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Valid From</label>
                <input type="date" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Valid To</label>
                <input type="date" value={form.validTo} onChange={e => setForm({ ...form, validTo: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as "active" | "inactive" | "expired" })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none bg-white">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
              <button onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none bg-white">Cancel</button>
              <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">{editCoupon ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-white border border-neutral-200 p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-sm font-black text-[#030213] uppercase tracking-widest mb-2">Delete Coupon?</h3>
            <p className="text-[9px] text-neutral-500 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer bg-white rounded-none">Cancel</button>
              <button onClick={confirmDelete} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
