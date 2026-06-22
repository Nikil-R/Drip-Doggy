import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CreditCard,
  MoreHorizontal,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Smartphone,
  Building,
  Wallet
} from "lucide-react";

const RS = "\u20B9";

// Drip Doggy Transaction KPIs
const transactionKpis = [
  { label: "Total Revenue", value: "\u20B984,62,390", change: "+18.7%", trend: "up", subtitle: "Last 30 days", icon: "TrendingUp" },
  { label: "Successful Payments", value: "3,284", change: "+12.3%", trend: "up", subtitle: "Last 30 days", icon: "CheckCircle2" },
  { label: "Pending Settlements", value: "128", change: "\u20B94,72,610", trend: "up", subtitle: "Awaiting clearance", icon: "Clock" },
  { label: "Failed / Refunded", value: "47", change: "1.4% rate", trend: "down", subtitle: "Of total transactions", icon: "XCircle" }
];

// Drip Doggy payment method distribution
const paymentMethodStats = [
  { method: "Razorpay (UPI)", transactions: 1842, revenue: 4282000, percentage: 52, color: "bg-violet-500" },
  { method: "COD", transactions: 842, revenue: 1864000, percentage: 24, color: "bg-amber-500" },
  { method: "Credit / Debit Card", transactions: 468, revenue: 1420000, percentage: 13, color: "bg-blue-500" },
  { method: "Net Banking", transactions: 284, revenue: 682390, percentage: 8, color: "bg-emerald-500" },
  { method: "Google Pay / PhonePe", transactions: 108, revenue: 382000, percentage: 3, color: "bg-rose-500" }
];

// Mock Drip Doggy Transactions
const mockTransactions = [
  { id: "DD-ORD-2026-4281", customer: "Ananya Sharma", product: "Structured Canvas Jacket", date: "15 Jun 2026", amount: 12999, method: "Razorpay (UPI)", status: "Completed" },
  { id: "DD-ORD-2026-4280", customer: "Rahul Verma", product: "Pinstripe Relaxed Shirt", date: "15 Jun 2026", amount: 8499, method: "Credit Card", status: "Completed" },
  { id: "DD-ORD-2026-4279", customer: "Priya Kapoor", product: "Cashmere Blend Knit", date: "14 Jun 2026", amount: 15999, method: "COD", status: "Pending" },
  { id: "DD-ORD-2026-4278", customer: "Aditya Joshi", product: "Satin Asymmetric Top", date: "14 Jun 2026", amount: 6499, method: "Razorpay (UPI)", status: "Completed" },
  { id: "DD-ORD-2026-4277", customer: "Neha Gupta", product: "Moto Biker Jacket", date: "14 Jun 2026", amount: 18999, method: "Net Banking", status: "Completed" },
  { id: "DD-ORD-2026-4276", customer: "Sameer Patel", product: "Pleated Wide-Leg Trousers", date: "13 Jun 2026", amount: 7499, method: "Google Pay", status: "Failed" },
  { id: "DD-ORD-2026-4275", customer: "Kavita Singh", product: "Oversized Blazer Dress", date: "13 Jun 2026", amount: 11499, method: "Credit Card", status: "Completed" },
  { id: "DD-ORD-2026-4274", customer: "Arjun Nair", product: "Slim-Fit Turtleneck", date: "13 Jun 2026", amount: 5499, method: "Razorpay (UPI)", status: "Refunded" },
  { id: "DD-ORD-2026-4273", customer: "Meera Reddy", product: "Structured Canvas Jacket", date: "12 Jun 2026", amount: 12999, method: "COD", status: "Completed" },
  { id: "DD-ORD-2026-4272", customer: "Vikram Desai", product: "Pinstripe Relaxed Shirt", date: "12 Jun 2026", amount: 8499, method: "Net Banking", status: "Pending" },
  { id: "DD-ORD-2026-4271", customer: "Ananya Sharma", product: "Wool Cashmere Overcoat", date: "12 Jun 2026", amount: 24999, method: "Razorpay (UPI)", status: "Completed" },
  { id: "DD-ORD-2026-4270", customer: "Rahul Verma", product: "Cashmere Blend Knit", date: "11 Jun 2026", amount: 15999, method: "Credit Card", status: "Completed" }
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "text-green-600",
    Pending: "text-amber-500",
    Failed: "text-red-500",
    Refunded: "text-blue-500"
  };

  const dotColors: Record<string, string> = {
    Completed: "bg-green-600",
    Pending: "bg-amber-500",
    Failed: "bg-red-600",
    Refunded: "bg-blue-500"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] font-black tracking-wider uppercase ${styles[status] || 'text-neutral-500'}`}>
      <span className={`w-1 h-1 rounded-full ${dotColors[status] || 'bg-neutral-500'}`} />
      {status}
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  let icon = null;
  if (method.includes("UPI") || method.includes("Google") || method.includes("PhonePe")) icon = <Smartphone className="w-3.5 h-3.5" />;
  else if (method === "COD") icon = <Wallet className="w-3.5 h-3.5" />;
  else if (method.includes("Card")) icon = <CreditCard className="w-3.5 h-3.5" />;
  else if (method.includes("Banking")) icon = <Building className="w-3.5 h-3.5" />;

  return (
    <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold tracking-wider uppercase text-neutral-600">
      {icon}
      {method}
    </span>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  XCircle: <XCircle className="w-4 h-4" />
};

export function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(t => {
      if (activeTab === "Completed" && t.status !== "Completed") return false;
      if (activeTab === "Pending" && t.status !== "Pending") return false;
      if (activeTab === "Failed" && t.status !== "Failed" && t.status !== "Refunded") return false;

      const q = searchQuery.toLowerCase();
      return (
        t.customer.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.product.toLowerCase().includes(q) ||
        t.method.toLowerCase().includes(q)
      );
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-8 font-sans">

      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">
          Transactions
        </h1>
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
          Monitor all payment activity, settlements &amp; gateway performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {transactionKpis.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[105px] rounded-none hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">
                {stat.label}
              </span>
              <span className="text-neutral-400">
                {iconMap[stat.icon]}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-[#030213]">
                {stat.value}
              </span>
              <span className={`text-[8px] font-black px-1.5 py-0.5 border rounded-none uppercase tracking-wide ${stat.trend === 'up' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-[7px] text-neutral-400 font-bold uppercase mt-1">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Payment Methods + Transaction List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Payment Method Breakdown */}
        <div className="lg:col-span-4 bg-white border border-neutral-200/80 p-6 rounded-none space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">
              Payment Methods
            </span>
            <CreditCard className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="space-y-4">
            {paymentMethodStats.map((pm, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-extrabold tracking-wider text-[#030213] uppercase">{pm.method}</span>
                  <span className="font-black text-[#030213]">\u20B9{pm.revenue.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-[8px] text-neutral-400 font-bold">
                  <span>{pm.transactions.toLocaleString()} txns</span>
                  <span>{pm.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-none overflow-hidden">
                  <div className={`h-full rounded-none ${pm.color}`} style={{ width: `${pm.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Drip Doggy settlement info */}
          <div className="border-t border-neutral-100 pt-4 mt-2">
            <div className="flex items-center justify-between text-[8px] font-bold tracking-wider text-neutral-400 uppercase">
              <span>Next Settlement</span>
              <span className="text-[#030213] font-black">\u20B96,84,200</span>
            </div>
            <div className="flex items-center justify-between text-[8px] font-bold tracking-wider text-neutral-400 uppercase mt-1">
              <span>Settlement Cycle</span>
              <span className="text-[#030213] font-black">T+1</span>
            </div>
            <div className="flex items-center justify-between text-[8px] font-bold tracking-wider text-neutral-400 uppercase mt-1">
              <span>Gateway Partner</span>
              <span className="text-[#030213] font-black">Razorpay</span>
            </div>
          </div>
        </div>

        {/* Right: Transactions Table */}
        <div className="lg:col-span-8 bg-white border border-neutral-200/80 p-6 rounded-none space-y-6">

          {/* Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex bg-[#faf8f5] border border-neutral-200/80 p-1.5 rounded-none shrink-0">
              {["All", "Completed", "Pending", "Failed"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-[9px] font-extrabold tracking-widest uppercase transition-all border-none cursor-pointer rounded-none ${
                    activeTab === tab
                      ? "bg-[#030213] text-white"
                      : "bg-transparent text-neutral-400 hover:text-[#030213]"
                  }`}
                >
                  {tab}{tab === "All" ? ` (${mockTransactions.length})` : ""}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by order, customer or product"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-neutral-200/80 pl-8 pr-3 py-2 text-[9px] font-extrabold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-56 rounded-none"
                />
              </div>
              <button className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 p-2 rounded-none cursor-pointer">
                <Filter className="h-4.5 w-4.5" />
              </button>
              <button className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 p-2 rounded-none cursor-pointer">
                <ArrowUpDown className="h-4.5 w-4.5" />
              </button>
              <button className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 p-2 rounded-none cursor-pointer">
                <MoreHorizontal className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider divide-y divide-neutral-100">
              <thead>
                <tr className="border-b border-neutral-100 bg-[#faf8f5]/60 text-[8px] text-neutral-400 tracking-[0.2em]">
                  <th className="p-3 font-black">Order ID</th>
                  <th className="p-3 font-black">Customer</th>
                  <th className="p-3 font-black">Product</th>
                  <th className="p-3 font-black">Date</th>
                  <th className="p-3 font-black">Amount</th>
                  <th className="p-3 font-black">Method</th>
                  <th className="p-3 font-black">Status</th>
                  <th className="p-3 font-black text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredTransactions.map((t, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-3 font-black text-[#030213] text-[8px]">{t.id}</td>
                    <td className="p-3 font-extrabold text-[#030213] whitespace-nowrap">{t.customer}</td>
                    <td className="p-3 text-neutral-500 font-medium max-w-[160px] truncate">{t.product}</td>
                    <td className="p-3 text-neutral-500 font-medium whitespace-nowrap">{t.date}</td>
                    <td className="p-3 font-black text-[#030213] whitespace-nowrap">\u20B9{t.amount.toLocaleString("en-IN")}</td>
                    <td className="p-3"><MethodBadge method={t.method} /></td>
                    <td className="p-3"><StatusBadge status={t.status} /></td>
                    <td className="p-3 text-right">
                      <button className="text-[8px] font-black tracking-widest uppercase text-[#b2533e] hover:underline bg-transparent border-none cursor-pointer">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <button className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] hover:text-[#030213] bg-white text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase transition-all rounded-none cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <div className="flex gap-1.5 items-center">
              {[1, 2, 3].map(p => (
                <button
                  key={p}
                  className={`w-8 h-8 flex items-center justify-center text-[9px] font-extrabold border rounded-none cursor-pointer transition-all ${
                    p === 1
                      ? "bg-[#030213] text-white border-[#030213]"
                      : "bg-white border-neutral-200 text-neutral-500 hover:border-[#030213]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="text-[9px] text-neutral-400 tracking-wider">...</span>
              <button className="w-8 h-8 flex items-center justify-center text-[9px] font-extrabold border border-neutral-200 text-neutral-500 hover:border-[#030213] rounded-none cursor-pointer">
                12
              </button>
            </div>

            <button className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] hover:text-[#030213] bg-white text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase transition-all rounded-none cursor-pointer">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Recent Activity Footer */}
      <div className="bg-white border border-neutral-200/80 p-5 rounded-none flex items-center justify-between">
        <div className="flex items-center gap-3 text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          <span>Last settlement processed: <span className="text-[#030213] font-black">16 Jun 2026, 03:00 AM IST</span></span>
        </div>
        <div className="flex items-center gap-4 text-[8px] font-black tracking-widest uppercase">
          <button className="text-[#030213] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1">
            <IndianRupee className="w-3 h-3" /> View Payouts
          </button>
          <button className="text-[#b2533e] hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Report Issue
          </button>
        </div>
      </div>

    </div>
  );
}
