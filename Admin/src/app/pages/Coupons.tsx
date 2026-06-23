import { useState, useMemo } from "react";
import {
  Ticket, Plus, Search, Copy, Trash2, Check,
  Calendar, Percent, Clock, Sparkles, TrendingUp, TrendingDown, X, Tag
} from "lucide-react";

const RS = "₹";

interface Coupon {
  id: string;
  code: string;
  type: "Percentage" | "Fixed";
  value: number;
  minPurchase: number;
  usageCount: number;
  usageLimit: number;
  expiryDate: string;
  status: "Active" | "Expired";
}

const initialCoupons: Coupon[] = [
  { id: "CPN-001", code: "DRIP30",      type: "Percentage", value: 30,  minPurchase: 1999, usageCount: 245, usageLimit: 500,  expiryDate: "2026-08-31", status: "Active"  },
  { id: "CPN-002", code: "DOGGY20",     type: "Percentage", value: 20,  minPurchase: 1200, usageCount: 412, usageLimit: 1000, expiryDate: "2026-10-15", status: "Active"  },
  { id: "CPN-003", code: "WELCOME500",  type: "Fixed",      value: 500, minPurchase: 2500, usageCount: 189, usageLimit: 200,  expiryDate: "2026-07-01", status: "Active"  },
  { id: "CPN-004", code: "STREETSTYLE", type: "Percentage", value: 15,  minPurchase: 999,  usageCount: 88,  usageLimit: 300,  expiryDate: "2026-09-30", status: "Active"  },
  { id: "CPN-005", code: "FLASHSALE",   type: "Percentage", value: 40,  minPurchase: 3000, usageCount: 150, usageLimit: 150,  expiryDate: "2026-05-15", status: "Expired" },
];

export function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [newCode, setNewCode]             = useState("STREET30");
  const [newType, setNewType]             = useState<"Percentage" | "Fixed">("Percentage");
  const [newValue, setNewValue]           = useState(30);
  const [newMinPurchase, setNewMinPurchase] = useState(1500);
  const [newUsageLimit, setNewUsageLimit]  = useState(500);
  const [newExpiryDate, setNewExpiryDate]  = useState("2026-12-31");

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const coupon: Coupon = {
      id: `CPN-00${coupons.length + 1}`,
      code: newCode.toUpperCase().trim(),
      type: newType,
      value: Number(newValue),
      minPurchase: Number(newMinPurchase),
      usageCount: 0,
      usageLimit: Number(newUsageLimit),
      expiryDate: newExpiryDate,
      status: "Active",
    };
    setCoupons(prev => [coupon, ...prev]);
    setShowCreateModal(false);
    setNewCode("");
    setNewValue(0);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this coupon code?")) {
      setCoupons(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredCoupons = useMemo(() =>
    coupons.filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase())),
    [coupons, searchQuery]
  );

  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usageCount, 0);
  const activeCoupons = coupons.filter(c => c.status === "Active").length;

  const kpiData = [
    {
      label: "Active Tickets",
      value: activeCoupons.toString(),
      trend: "up" as const,
      change: "+2 this week",
      subtitle: "Live and redeemable codes"
    },
    {
      label: "Total Redemptions",
      value: totalRedemptions.toLocaleString("en-IN"),
      trend: "up" as const,
      change: "+18.4%",
      subtitle: "Successful coupon checkouts"
    },
    {
      label: "Discounts Distributed",
      value: `${RS}1.8L`,
      trend: "up" as const,
      change: "+24.1%",
      subtitle: "Total savings given to customers"
    },
    {
      label: "Avg. Conversion",
      value: "24.5%",
      trend: "up" as const,
      change: "+3.2%",
      subtitle: "Checkout coupon success rate"
    },
  ];

  return (
    <div className="space-y-8 font-sans">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest">
            Coupon Codes
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Configure checkout discounts, campaigns &amp; reward tickets
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer flex items-center gap-2 border-none transition-all self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Create Coupon
        </button>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((stat, idx) => (
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

      {/* ─── Coupon List ─── */}
      <div className="bg-card border border-neutral-200/80 overflow-hidden">

        {/* Table header bar */}
        <div className="p-4 border-b border-neutral-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase block">
              Coupon Repository
            </span>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-0.5">
              {filteredCoupons.length} of {coupons.length} codes
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search coupon code…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-card border border-neutral-200 pl-10 pr-4 py-2 text-[9.5px] font-semibold focus:outline-none focus:border-[#224870] placeholder-neutral-400 w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200/80 bg-background/60 text-[9.5px] text-[#615e56] font-bold tracking-[0.12em] uppercase">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Offer</th>
                <th className="p-4">Min Spend</th>
                <th className="p-4">Redeemed</th>
                <th className="p-4">Expiry</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100/80">
              {filteredCoupons.map(coupon => {
                const usedPct = Math.round((coupon.usageCount / coupon.usageLimit) * 100);
                return (
                  <tr key={coupon.id} className="hover:bg-[#224870]/5 transition-colors">
                    {/* Code */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[11px] text-[#224870] font-mono tracking-widest">{coupon.code}</span>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="p-1.5 text-neutral-400 hover:text-[#224870] hover:bg-[#224870]/10 bg-transparent border-none cursor-pointer rounded-full transition-all"
                          title="Copy code"
                        >
                          {copiedCode === coupon.code
                            ? <Check className="w-3 h-3 text-green-600 stroke-[3]" />
                            : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <span className="text-[8px] font-mono text-neutral-400">{coupon.id}</span>
                    </td>

                    {/* Offer */}
                    <td className="p-4">
                      <div className="font-black text-[12px] text-[#382d24]">
                        {coupon.type === "Percentage" ? `${coupon.value}% OFF` : `${RS}${coupon.value} OFF`}
                      </div>
                      <span className="text-[8.5px] text-[#615e56] font-semibold uppercase tracking-wider">
                        {coupon.type}
                      </span>
                    </td>

                    {/* Min Spend */}
                    <td className="p-4">
                      <span className="font-bold text-[10.5px] text-[#382d24]">{RS}{coupon.minPurchase.toLocaleString()}</span>
                    </td>

                    {/* Redeemed with progress bar */}
                    <td className="p-4">
                      <div className="font-bold text-[10.5px] text-[#382d24]">
                        {coupon.usageCount}
                        <span className="text-neutral-400 font-normal"> / {coupon.usageLimit}</span>
                      </div>
                      <div className="w-20 h-1.5 bg-neutral-100 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${usedPct >= 90 ? "bg-red-400" : "bg-[#224870]"}`}
                          style={{ width: `${Math.min(usedPct, 100)}%` }}
                        />
                      </div>
                      <span className="text-[7.5px] text-neutral-400 font-semibold">{usedPct}% used</span>
                    </td>

                    {/* Expiry */}
                    <td className="p-4">
                      <span className="font-semibold text-[9.5px] text-[#736e64]">{coupon.expiryDate}</span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 border ${
                        coupon.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-neutral-100 text-neutral-500 border-neutral-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${coupon.status === "Active" ? "bg-green-500" : "bg-neutral-400"}`} />
                        {coupon.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 bg-transparent border-none cursor-pointer rounded-full transition-all"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-[11px] text-neutral-400 font-bold uppercase tracking-widest">
                    No coupons match your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-4 py-3 border-t border-neutral-100/80 flex items-center justify-between">
          <p className="text-[9px] text-[#615e56] font-bold uppercase tracking-wider">
            {activeCoupons} active · {coupons.filter(c => c.status === "Expired").length} expired
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 text-[9px] font-bold text-[#224870] uppercase tracking-widest border border-[#224870]/30 hover:border-[#224870] px-3.5 py-1.5 bg-transparent cursor-pointer transition-all"
          >
            <Plus className="w-3 h-3" /> Add Coupon
          </button>
        </div>
      </div>

      {/* ─── Create Coupon Modal ─── */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-card w-full max-w-lg border-2 border-[#224870] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-200 flex items-start justify-between">
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Create New</span>
                <h2 className="text-[17px] font-[950] text-[#382d24] uppercase tracking-widest mt-0.5">
                  Discount Ticket
                </h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 border border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-[#382d24] bg-transparent cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Ticket Preview */}
            <div className="mx-6 mt-6 bg-[#224870] text-white p-5 relative overflow-hidden select-none">
              {/* Decorative elements */}
              <div className="absolute right-0 top-0 bottom-0 w-28 bg-white/5 skew-x-12 translate-x-10" />
              <div className="absolute -left-10 -top-10 w-24 h-24 border border-white/10 rounded-full" />
              {/* Perforation */}
              <div className="absolute right-[23%] top-0 bottom-0 border-l border-dashed border-white/30 flex flex-col justify-between py-0">
                <div className="w-3 h-3 bg-card -ml-1.5 -mt-1.5 rounded-full" />
                <div className="w-3 h-3 bg-card -ml-1.5 -mb-1.5 rounded-full" />
              </div>

              <div className="flex justify-between items-stretch h-28">
                {/* Left: details */}
                <div className="flex-1 flex flex-col justify-between pr-6">
                  <div>
                    <span className="text-[7.5px] font-bold tracking-widest uppercase bg-white/15 px-2 py-0.5">
                      Drip Doggy Ticket
                    </span>
                    <h4 className="text-[32px] font-[950] uppercase mt-1.5 tracking-tight leading-none">
                      {newType === "Percentage" ? `${newValue}%` : `${RS}${newValue}`} <span className="text-[20px] font-bold opacity-80">OFF</span>
                    </h4>
                  </div>
                  <div className="text-[8px] uppercase tracking-wider text-white/70 font-bold space-y-0.5">
                    <p>Min Spend: {RS}{Number(newMinPurchase).toLocaleString()}</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" /> Expiry: {newExpiryDate || "Dec 31, 2026"}
                    </p>
                  </div>
                </div>
                {/* Right: code stub */}
                <div className="w-24 flex flex-col items-center justify-center border-l border-white/20">
                  <span className="text-[6.5px] text-white/50 font-bold uppercase tracking-widest block mb-2">Code</span>
                  <div className="bg-white text-[#224870] font-black text-[10px] px-2.5 py-1.5 uppercase tracking-widest text-center">
                    {newCode || "STREET30"}
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCoupon} className="p-6 space-y-5">

              {/* Coupon Code */}
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. STREET30"
                  className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-[#224870] rounded-sm transition-all font-mono"
                />
              </div>

              {/* Type + Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={newType}
                    onChange={e => {
                      const val = e.target.value as "Percentage" | "Fixed";
                      setNewType(val);
                      setNewValue(val === "Percentage" ? 20 : 500);
                    }}
                    className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[10px] font-bold uppercase focus:outline-none focus:border-[#224870] rounded-sm transition-all cursor-pointer text-[#382d24]"
                  >
                    <option value="Percentage">Percentage %</option>
                    <option value="Fixed">Fixed Amount {RS}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newValue}
                    onChange={e => setNewValue(Number(e.target.value))}
                    className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[11px] font-black focus:outline-none focus:border-[#224870] rounded-sm transition-all text-[#382d24]"
                  />
                </div>
              </div>

              {/* Min Spend + Usage Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">
                    Min Spend ({RS})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newMinPurchase}
                    onChange={e => setNewMinPurchase(Number(e.target.value))}
                    className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[11px] font-black focus:outline-none focus:border-[#224870] rounded-sm transition-all text-[#382d24]"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newUsageLimit}
                    onChange={e => setNewUsageLimit(Number(e.target.value))}
                    className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[11px] font-black focus:outline-none focus:border-[#224870] rounded-sm transition-all text-[#382d24]"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">
                  Expiration Date
                </label>
                <input
                  type="date"
                  required
                  value={newExpiryDate}
                  onChange={e => setNewExpiryDate(e.target.value)}
                  className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[10px] font-bold focus:outline-none focus:border-[#224870] rounded-sm transition-all text-[#382d24]"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-6 py-2.5 uppercase bg-transparent cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-6 py-2.5 uppercase cursor-pointer border-none transition-all flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Generate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
