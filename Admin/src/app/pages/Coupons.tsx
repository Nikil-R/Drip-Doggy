import { useState } from "react";
import {
  Ticket,
  Plus,
  Search,
  Copy,
  Trash2,
  Edit,
  Check,
  Calendar,
  Percent,
  Clock,
  Sparkles
} from "lucide-react";

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

export function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Add new coupon form states
  const [newCode, setNewCode] = useState("STREET30");
  const [newType, setNewType] = useState<"Percentage" | "Fixed">("Percentage");
  const [newValue, setNewValue] = useState(30);
  const [newMinPurchase, setNewMinPurchase] = useState(1500);
  const [newUsageLimit, setNewUsageLimit] = useState(500);
  const [newExpiryDate, setNewExpiryDate] = useState("2026-12-31");

  // Mock list of coupon codes
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: "CPN-001", code: "DRIP30", type: "Percentage", value: 30, minPurchase: 1999, usageCount: 245, usageLimit: 500, expiryDate: "2026-08-31", status: "Active" },
    { id: "CPN-002", code: "DOGGY20", type: "Percentage", value: 20, minPurchase: 1200, usageCount: 412, usageLimit: 1000, expiryDate: "2026-10-15", status: "Active" },
    { id: "CPN-003", code: "WELCOME500", type: "Fixed", value: 500, minPurchase: 2500, usageCount: 189, usageLimit: 200, expiryDate: "2026-07-01", status: "Active" },
    { id: "CPN-004", code: "STREETSTYLE", type: "Percentage", value: 15, minPurchase: 999, usageCount: 88, usageLimit: 300, expiryDate: "2026-09-30", status: "Active" },
    { id: "CPN-005", code: "FLASHSALE", type: "Percentage", value: 40, minPurchase: 3000, usageCount: 150, usageLimit: 150, expiryDate: "2026-05-15", status: "Expired" }
  ]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: Coupon = {
      id: `CPN-00${coupons.length + 1}`,
      code: newCode.toUpperCase().trim(),
      type: newType,
      value: Number(newValue),
      minPurchase: Number(newMinPurchase),
      usageCount: 0,
      usageLimit: Number(newUsageLimit),
      expiryDate: newExpiryDate,
      status: "Active"
    };

    setCoupons(prev => [newCoupon, ...prev]);
    // reset form
    setNewCode("");
    setNewValue(0);
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans text-neutral-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-bold text-[#030213] tracking-tight">Coupon Codes</h1>
          <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Configure checkout discount tickets, campaigns, and user rewards
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-neutral-200/60 p-5 rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Active Tickets</span>
            <Ticket className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold text-[#030213] mt-2">
            {coupons.filter(c => c.status === "Active").length}
          </p>
          <div className="mt-1 text-[9px] font-semibold text-neutral-400">
            Live and redeemable codes
          </div>
        </div>

        <div className="bg-card border border-neutral-200/60 p-5 rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Total Redemptions</span>
            <Percent className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold text-[#030213] mt-2">1,094</p>
          <div className="mt-1 text-[9px] font-semibold text-neutral-400">
            Successful checkouts
          </div>
        </div>

        <div className="bg-card border border-neutral-200/60 p-5 rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-[#030213] uppercase tracking-widest">Saved Customers</span>
            <Sparkles className="w-4 h-4 text-[#b2533e]" />
          </div>
          <p className="text-2xl font-bold text-[#b2533e] mt-2">₹1.8L</p>
          <div className="mt-1 text-[9px] font-semibold text-neutral-400">
            Total discounts distributed
          </div>
        </div>

        <div className="bg-card border border-neutral-200/60 p-5 rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Avg Conversion</span>
            <Clock className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold text-[#030213] mt-2">24.5%</p>
          <div className="mt-1 text-[9px] font-semibold text-neutral-400">
            Checkout coupon success rate
          </div>
        </div>
      </div>

      {/* Main Grid splits: Left is Create / Preview, Right is List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Create Form + Ticket Card Preview */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Create Card */}
          <div className="bg-card border border-neutral-200/60 p-6 rounded-none space-y-4">
            <h3 className="text-xs font-bold uppercase text-[#030213] tracking-widest border-b border-neutral-100 pb-3">
              Create Discount Ticket
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="e.g. STREET30"
                  className="w-full bg-card/60 border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-neutral-400 rounded-none font-bold uppercase tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Discount Type</label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      const val = e.target.value as "Percentage" | "Fixed";
                      setNewType(val);
                      setNewValue(val === "Percentage" ? 20 : 500);
                    }}
                    className="w-full bg-card/60 border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-neutral-400 rounded-none font-bold uppercase"
                  >
                    <option value="Percentage">Percentage %</option>
                    <option value="Fixed">Fixed Amount ₹</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full bg-card/60 border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-neutral-400 rounded-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Min Spend (₹)</label>
                  <input
                    type="number"
                    value={newMinPurchase}
                    onChange={(e) => setNewMinPurchase(Number(e.target.value))}
                    className="w-full bg-card/60 border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-neutral-400 rounded-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Usage Limit</label>
                  <input
                    type="number"
                    value={newUsageLimit}
                    onChange={(e) => setNewUsageLimit(Number(e.target.value))}
                    className="w-full bg-card/60 border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-neutral-400 rounded-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Expiration Date</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full bg-card/60 border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-neutral-400 rounded-none font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#030213] hover:bg-neutral-800 text-white text-[10px] font-semibold tracking-widest py-2.5 uppercase cursor-pointer rounded-none border-none flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Generate Coupon
              </button>
            </form>
          </div>

          {/* STREETWEAR INNOVATIVE TICKET PREVIEW CARD */}
          <div className="bg-[#b2533e] text-white p-5 rounded-none relative overflow-hidden select-none shadow-md">
            {/* Background design elements */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-card/5 skew-x-12 translate-x-8" />
            <div className="absolute -left-12 -top-12 w-28 h-28 border border-white/10 rounded-full" />

            {/* Ticket Perforation Dashed Line */}
            <div className="absolute right-[22%] top-0 bottom-0 border-l border-dashed border-white/40 flex flex-col justify-between py-2">
              <div className="w-3 h-3 bg-card -ml-1.5 -mt-3.5 rounded-full" />
              <div className="w-3 h-3 bg-card -ml-1.5 -mb-3.5 rounded-full" />
            </div>

            <div className="flex justify-between items-stretch h-32">
              {/* Left Section: Coupon details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-bold tracking-widest uppercase bg-card/20 px-2 py-0.5 rounded-none">
                    Drip Doggy Ticket
                  </span>
                  <h4 className="text-3xl font-bold uppercase mt-2 tracking-tight">
                    {newType === "Percentage" ? `${newValue}%` : `₹${newValue}`} OFF
                  </h4>
                </div>

                <div className="text-[8.5px] uppercase tracking-wider text-white/80 font-bold space-y-0.5">
                  <p>Min Spend: ₹{newMinPurchase.toLocaleString()}</p>
                  <p className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> Expiry: {newExpiryDate || "Dec 31"}</p>
                </div>
              </div>

              {/* Right Section: Copyable Code */}
              <div className="w-24 flex flex-col items-center justify-center pl-4 border-l border-white/10">
                <span className="text-[7px] text-white/60 font-bold uppercase tracking-widest block mb-2">Checkout Code</span>
                <div className="bg-card text-[#b2533e] font-bold text-xs px-2.5 py-1.5 rounded-none uppercase tracking-wider text-center cursor-pointer shadow hover:scale-105 active:scale-95 transition-all">
                  {newCode || "STREET30"}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Coupon list table */}
        <div className="lg:col-span-7 bg-card border border-neutral-200/60 p-6 rounded-none space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-[#030213] tracking-widest">
              Coupon Repository
            </h3>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card/60 border border-neutral-200 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-neutral-400 placeholder-neutral-400 w-44 rounded-none"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider">
              <thead>
                <tr className="border-b border-neutral-100 bg-card/60 text-[8px] text-neutral-400 tracking-[0.2em]">
                  <th className="p-3 font-bold">Coupon Code</th>
                  <th className="p-3 font-bold">Offer Details</th>
                  <th className="p-3 font-bold">Redeemed</th>
                  <th className="p-3 font-bold">Expiration</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#030213] text-[9.5px]">{coupon.code}</span>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="text-neutral-400 hover:text-[#030213] p-1 bg-transparent border-none cursor-pointer rounded-none"
                          title="Copy Code"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3 h-3 text-green-600 stroke-[3]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-[#030213]">
                        {coupon.type === "Percentage" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                      </p>
                      <span className="text-[6.5px] text-neutral-400 font-bold block">Min Purchase: ₹{coupon.minPurchase}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-[#030213]">{coupon.usageCount}</span>
                      <span className="text-neutral-400"> / {coupon.usageLimit}</span>
                    </td>
                    <td className="p-3 text-neutral-600 font-bold">
                      {coupon.expiryDate}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                        coupon.status === "Active" 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="text-neutral-400 hover:text-[#030213] p-1 bg-transparent border-none cursor-pointer">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="text-neutral-400 hover:text-red-600 p-1 bg-transparent border-none cursor-pointer"
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

      </div>

    </div>
  );
}
