import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  MessageSquare,
  Trash2,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Copy,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Gift,
  Heart,
  Tag,
  Clock
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RS = "\u20B9";

// ─── Drip Doggy Customer KPIs ─────────────────────────────────────────────

const kpiStats = [
  {
    label: "Total Customers",
    value: "18,450",
    change: "+22.3%",
    subtitle: "Lifetime registered"
  },
  {
    label: "Active This Month",
    value: "3,280",
    change: "+15.7%",
    subtitle: "Made a purchase in last 30 days"
  },
  {
    label: "New This Week",
    value: "845",
    change: "+11.2%",
    subtitle: "Joined in last 7 days"
  },
  {
    label: "VIP Customers",
    value: "2,140",
    change: "+8.6%",
    subtitle: "Lifetime spend > " + RS + "50,000"
  }
];

// ─── Weekly Activity Data ─────────────────────────────────────────────────

const weeklyData = [
  { day: "Mon", active: 1240, visitors: 18400, orders: 185 },
  { day: "Tue", active: 1380, visitors: 20100, orders: 212 },
  { day: "Wed", active: 1520, visitors: 22800, orders: 248 },
  { day: "Thu", active: 1410, visitors: 19500, orders: 201 },
  { day: "Fri", active: 1780, visitors: 26500, orders: 298 },
  { day: "Sat", active: 1650, visitors: 24200, orders: 275 },
  { day: "Sun", active: 1120, visitors: 15800, orders: 162 }
];

// ─── Drip Doggy Customer Data ─────────────────────────────────────────────

const initialCustomers = [
  { id: "#DD-C001", name: "Ananya Sharma", email: "ananya.sharma@gmail.com", phone: "+91 98765 43210", orders: 28, spent: 62150, avgOrder: 2220, status: "VIP", address: "42, Bandra West, Mumbai, Maharashtra", registered: "12.01.2025", lastPurchase: "15.05.2025", segment: "Premium", favCategory: "Outerwear", lastProduct: "Sartorial Trench Coat" },
  { id: "#DD-C002", name: "Rahul Verma", email: "rahul.verma@outlook.com", phone: "+91 87654 32109", orders: 15, spent: 28400, avgOrder: 1893, status: "Active", address: "78, Indiranagar, Bangalore, Karnataka", registered: "03.03.2025", lastPurchase: "12.05.2025", segment: "Standard", favCategory: "Knitwear", lastProduct: "Cashmere Blend Crew" },
  { id: "#DD-C003", name: "Priya Kapoor", email: "priya.kapoor@yahoo.com", phone: "+91 76543 21098", orders: 42, spent: 98500, avgOrder: 2345, status: "VIP", address: "15, GK II, New Delhi, Delhi", registered: "20.11.2024", lastPurchase: "18.05.2025", segment: "Premium", favCategory: "Tops", lastProduct: "Signature Silk Blouse" },
  { id: "#DD-C004", name: "Arjun Mehta", email: "arjun.mehta@gmail.com", phone: "+91 65432 10987", orders: 8, spent: 12450, avgOrder: 1556, status: "Active", address: "33, Jubilee Hills, Hyderabad, Telangana", registered: "10.04.2025", lastPurchase: "08.05.2025", segment: "Standard", favCategory: "Bottoms", lastProduct: "Pleated Wool Trousers" },
  { id: "#DD-C005", name: "Neha Gupta", email: "neha.gupta@rediffmail.com", phone: "+91 54321 09876", orders: 3, spent: 4890, avgOrder: 1630, status: "New", address: "55, Anna Nagar, Chennai, Tamil Nadu", registered: "01.05.2025", lastPurchase: "05.05.2025", segment: "First-Time", favCategory: "Dresses", lastProduct: "Linen Midi Dress" },
  { id: "#DD-C006", name: "Vikram Singh", email: "vikram.singh@gmail.com", phone: "+91 43210 98765", orders: 22, spent: 45200, avgOrder: 2055, status: "Active", address: "89, Koregaon Park, Pune, Maharashtra", registered: "05.02.2025", lastPurchase: "14.05.2025", segment: "Premium", favCategory: "Outerwear", lastProduct: "Structured Canvas Jacket" },
  { id: "#DD-C007", name: "Ishita Patel", email: "ishita.patel@proton.me", phone: "+91 32109 87654", orders: 0, spent: 0, avgOrder: 0, status: "Inactive", address: "120, Navrangpura, Ahmedabad, Gujarat", registered: "28.04.2025", lastPurchase: "\u2014", segment: "New", favCategory: "\u2014", lastProduct: "\u2014" },
  { id: "#DD-C008", name: "Aditya Joshi", email: "aditya.joshi@icloud.com", phone: "+91 21098 76543", orders: 35, spent: 73800, avgOrder: 2109, status: "VIP", address: "7, Salt Lake, Kolkata, West Bengal", registered: "10.10.2024", lastPurchase: "19.05.2025", segment: "Premium", favCategory: "Knitwear", lastProduct: "Merino Wool Cardigan" },
  { id: "#DD-C009", name: "Sanya Malhotra", email: "sanya.m@hotmail.com", phone: "+91 10987 65432", orders: 12, spent: 23100, avgOrder: 1925, status: "Active", address: "66, Malviya Nagar, Jaipur, Rajasthan", registered: "15.03.2025", lastPurchase: "11.05.2025", segment: "Standard", favCategory: "Accessories", lastProduct: "Handwoven Silk Scarf" },
  { id: "#DD-C010", name: "Karan Desai", email: "karan.desai@gmail.com", phone: "+91 19876 54321", orders: 6, spent: 11200, avgOrder: 1867, status: "Active", address: "22, Banjara Hills, Lucknow, Uttar Pradesh", registered: "22.04.2025", lastPurchase: "09.05.2025", segment: "Standard", favCategory: "Tops", lastProduct: "Relaxed Linen Shirt" },
  { id: "#DD-C011", name: "Riya Nair", email: "riya.nair@outlook.com", phone: "+91 18765 43210", orders: 18, spent: 36100, avgOrder: 2006, status: "Active", address: "5, Panampilly Nagar, Kochi, Kerala", registered: "14.02.2025", lastPurchase: "16.05.2025", segment: "Premium", favCategory: "Bottoms", lastProduct: "Tailored Linen Trousers" },
  { id: "#DD-C012", name: "Dhruv Agarwal", email: "dhruv.agarwal@yahoo.com", phone: "+91 17654 32109", orders: 1, spent: 2450, avgOrder: 2450, status: "New", address: "95, Civil Lines, Nagpur, Maharashtra", registered: "15.05.2025", lastPurchase: "15.05.2025", segment: "First-Time", favCategory: "Outerwear", lastProduct: "Drip Doggy Bomber Jacket" }
];

// ─── Sub-Components ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { dot: string; text: string; label: string }> = {
    Active: { dot: "bg-emerald-500", text: "text-emerald-700", label: "Active" },
    Inactive: { dot: "bg-neutral-400", text: "text-neutral-500", label: "Inactive" },
    VIP: { dot: "bg-amber-500", text: "text-amber-700", label: "VIP" },
    New: { dot: "bg-blue-500", text: "text-blue-700", label: "New" }
  };
  const s = config[status] || config.Inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[8px] font-extrabold tracking-widest uppercase ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function SegmentBadge({ segment }: { segment: string }) {
  const colors: Record<string, string> = {
    "Premium": "bg-neutral-50 text-[#030213] border-neutral-300",
    "Standard": "bg-neutral-50 text-neutral-500 border-neutral-200",
    "First-Time": "bg-blue-50 text-blue-700 border-blue-200"
  };
  const label = segment === "First-Time" ? "First Time" : segment;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[7px] font-extrabold tracking-widest uppercase border ${colors[segment] || colors.Standard}`}>
      {label}
    </span>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-neutral-200 shadow-md px-3.5 py-2.5 text-[9px] font-sans uppercase font-bold tracking-wider">
      <p className="font-extrabold text-[#030213] mb-1.5">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-1.5 text-neutral-500 leading-5">
          <span className="w-1.5 h-1.5" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}:</span>
          <span className="text-[#030213] font-black">{entry.value.toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
}

function CustomerAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const bgColors = ["#030213", "#b2533e", "#2563eb", "#d97706", "#059669", "#7c3aed", "#db2777", "#ea580c"];
  const colorIndex = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % bgColors.length;
  return (
    <div
      className="w-8 h-8 flex items-center justify-center text-[10px] font-black text-white tracking-wide"
      style={{ backgroundColor: bgColors[colorIndex] }}
    >
      {initials}
    </div>
  );
}

export function CustomersPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const selectedCustomer = useMemo(() => {
    return initialCustomers.find(c => c.id === selectedCustomerId) || null;
  }, [selectedCustomerId]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let filtered = initialCustomers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    );
    if (activeTab === "active") filtered = filtered.filter(c => c.status === "Active");
    else if (activeTab === "vip") filtered = filtered.filter(c => c.status === "VIP");
    else if (activeTab === "new") filtered = filtered.filter(c => c.status === "New");
    else if (activeTab === "inactive") filtered = filtered.filter(c => c.status === "Inactive");
    return filtered;
  }, [searchQuery, activeTab]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 1500);
  };

  const tabs = [
    { id: "all", label: "All Customers", count: initialCustomers.length },
    { id: "active", label: "Active", count: initialCustomers.filter(c => c.status === "Active").length },
    { id: "vip", label: "VIP", count: initialCustomers.filter(c => c.status === "VIP").length },
    { id: "new", label: "New", count: initialCustomers.filter(c => c.status === "New").length },
    { id: "inactive", label: "Inactive", count: initialCustomers.filter(c => c.status === "Inactive").length }
  ];

  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">
          Customers
        </h1>
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
          Drip Doggy customer profiles, order history, and shopping insights
        </p>
      </div>

      {/* ── KPI Cards Row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[115px] hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase block">
                  {stat.label}
                </span>
                <p className="text-[6.5px] text-neutral-400 font-bold uppercase mt-0.5">{stat.subtitle}</p>
              </div>
              <button className="text-neutral-400 hover:text-[#030213] p-1 bg-transparent border-none cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-2xl font-black tracking-tight $text-[#030213]`}>
                {stat.value}
              </span>
              <span className="text-[7px] font-black px-1.5 py-0.5 border bg-green-50 text-green-700 border-green-200 uppercase tracking-wide">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart + Summary ─────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200/80 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase block">
              Customer Activity &mdash; This Week
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[7px] bg-neutral-100 border border-neutral-200 px-2 py-1 font-bold text-[#030213] uppercase tracking-wider cursor-pointer">This week</span>
            <span className="text-[7px] text-neutral-400 font-bold uppercase tracking-wider cursor-pointer hover:text-[#030213] px-2 py-1">Last week</span>
          </div>
        </div>

        {/* Summary chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Avg. Session", value: "4m 32s", icon: Clock },
            { label: "Repeat Rate", value: "68.4%", icon: ShoppingBag },
            { label: "Avg. Order Value", value: RS + "2,045", icon: Tag },
            { label: "Lifetime Value", value: RS + "32,800", icon: Gift }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 border border-neutral-100 bg-[#faf8f5]/60 p-3">
              <item.icon className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <p className="text-[11px] font-black text-[#030213]">{item.value}</p>
                <p className="text-[6.5px] text-neutral-400 font-extrabold uppercase tracking-wider">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Area Chart */}
        <div className="h-[170px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b2533e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#b2533e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "#717182", fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "#717182", fontWeight: 700 }} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="active" name="Active Customers" stroke="#b2533e" strokeWidth={2.5} fill="url(#activeGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Customer Table + Detail Panel ───────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] font-black tracking-[0.25em] text-neutral-400 uppercase">
            {selectedCustomerId ? "Customer Details" : "All Customers"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── Table ────────────────────────────────────────────────── */}
          <div className={selectedCustomerId ? "lg:col-span-7 bg-white border border-neutral-200/80 p-5" : "lg:col-span-12 bg-white border border-neutral-200/80 p-5"}>

            {/* Search + Filter Bar */}
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search name, ID, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-neutral-200 pl-8 pr-3 py-1.5 text-[9px] font-extrabold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-full"
                />
              </div>
              <div className="flex items-center gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 text-[7px] font-extrabold tracking-widest uppercase border-none cursor-pointer ${
                      activeTab === tab.id ? "bg-[#030213] text-white" : "bg-transparent text-neutral-400 hover:text-[#030213]"
                    }`}
                  >
                    {tab.label} <span className="opacity-50">({tab.count})</span>
                  </button>
                ))}
                <button className="flex items-center gap-1 bg-[#faf8f5] border border-neutral-200 px-3 py-1.5 text-[8px] font-black tracking-widest uppercase text-neutral-600 hover:text-[#030213] cursor-pointer ml-2">
                  <Filter className="w-3 h-3" /> Filter
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left uppercase text-[8.5px] font-bold tracking-wider divide-y divide-neutral-100">
                <thead>
                  <tr className="border-b border-neutral-100 bg-[#faf8f5]/60 text-[7px] text-neutral-400 tracking-[0.2em]">
                    <th className="p-3 font-black">Customer</th>
                    <th className="p-3 font-black">Phone</th>
                    <th className="p-3 font-black">Orders</th>
                    <th className="p-3 font-black">Total Spent</th>
                    <th className="p-3 font-black">AOV</th>
                    <th className="p-3 font-black">Segment</th>
                    <th className="p-3 font-black">Status</th>
                    <th className="p-3 font-black text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredCustomers.map((c, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelectedCustomerId(c.id === selectedCustomerId ? null : c.id)}
                      className={`hover:bg-neutral-50/50 transition-colors cursor-pointer ${
                        selectedCustomerId === c.id ? "bg-[#faf8f5]" : ""
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <CustomerAvatar name={c.name} />
                          <div>
                            <p className="font-extrabold text-[#030213] text-[10px]">{c.name}</p>
                            <span className="text-[7px] text-neutral-400 font-semibold tracking-wider lowercase">{c.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-neutral-500 font-medium">{c.phone}</td>
                      <td className="p-3 font-extrabold text-[#030213]">{c.orders}</td>
                      <td className="p-3 font-black text-[#030213]">{RS}{c.spent.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-neutral-600 font-bold">{c.orders > 0 ? RS + c.avgOrder.toLocaleString("en-IN") : "\u2014"}</td>
                      <td className="p-3"><SegmentBadge segment={c.segment} /></td>
                      <td className="p-3"><StatusBadge status={c.status} /></td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer" title="Message">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button className="text-neutral-400 hover:text-red-600 p-1.5 bg-transparent border-none cursor-pointer" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between mt-4">
              <button className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] bg-white text-neutral-500 text-[8px] font-extrabold tracking-widest px-3 py-1.5 uppercase transition-all cursor-pointer">
                <ChevronLeft className="w-3 h-3" /> Prev
              </button>
              <div className="flex gap-1 items-center">
                {[1, 2, 3].map(p => (
                  <button
                    key={p}
                    className={`w-7 h-7 flex items-center justify-center text-[8px] font-extrabold border cursor-pointer ${
                      p === 1 ? "bg-[#030213] text-white border-[#030213]" : "bg-white border-neutral-200 text-neutral-500"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <span className="text-[8px] text-neutral-400">...</span>
                <button className="w-7 h-7 flex items-center justify-center text-[8px] font-extrabold border border-neutral-200 text-neutral-500 cursor-pointer">
                  12
                </button>
              </div>
              <button className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] bg-white text-neutral-500 text-[8px] font-extrabold tracking-widest px-3 py-1.5 uppercase transition-all cursor-pointer">
                Next <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ── Customer Detail Side Panel ──────────────────────────────── */}
          {selectedCustomer && (
            <div className="lg:col-span-5 bg-white border border-neutral-200/80 p-5 space-y-5 sticky top-24">

              {/* Profile Header */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-100">
                <div className="w-14 h-14 border border-neutral-200 overflow-hidden bg-neutral-100">
                  <img
                    src={"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"}
                    alt={selectedCustomer.name}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black uppercase text-[#030213] tracking-wide">{selectedCustomer.name}</h4>
                    <StatusBadge status={selectedCustomer.status} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[8px] font-semibold text-neutral-400 truncate block lowercase">{selectedCustomer.email}</span>
                    <button
                      onClick={() => handleCopyEmail(selectedCustomer.email)}
                      className="text-neutral-400 hover:text-[#030213] p-0.5 bg-transparent border-none cursor-pointer shrink-0"
                      title="Copy Email"
                    >
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  {copiedEmail === selectedCustomer.email && (
                    <span className="text-[6px] text-green-600 font-extrabold uppercase tracking-widest block mt-0.5">Copied!</span>
                  )}
                </div>
              </div>

              {/* Contact + ID */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2.5 border border-neutral-200 px-3 py-2 bg-white">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="text-[8.5px] font-bold text-[#030213]">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 border border-neutral-200 px-3 py-2 bg-white">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="text-[8.5px] font-bold text-[#030213] uppercase">{selectedCustomer.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 border border-neutral-200 px-3 py-2 bg-white">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="text-[8.5px] font-bold text-[#030213] uppercase tracking-wide">{selectedCustomer.address}</span>
              </div>

              {/* Social Media */}
              <div className="space-y-2">
                <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Social Profiles</p>
                <div className="flex items-center gap-2">
                  {[Facebook, Instagram, Twitter, Linkedin].map((Social, i) => (
                    <button
                      key={i}
                      className="w-7 h-7 bg-neutral-50 hover:bg-[#030213] hover:text-white border border-neutral-200 text-neutral-500 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Social className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Shopping Preferences */}
              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Shopping Profile</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border border-neutral-200 p-2.5 bg-white">
                    <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Segment</p>
                    <p className="text-[10px] font-black text-[#030213] mt-0.5"><SegmentBadge segment={selectedCustomer.segment} /></p>
                  </div>
                  <div className="border border-neutral-200 p-2.5 bg-white">
                    <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Preferred</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Heart className="w-3 h-3 text-[#b2533e]" />
                      <span className="text-[10px] font-black text-[#030213]">{selectedCustomer.favCategory}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Stats */}
              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Order Overview</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="border border-neutral-200 p-2.5 text-center bg-white">
                    <span className="text-sm font-black text-[#030213] block">{selectedCustomer.orders}</span>
                    <span className="text-[6px] text-neutral-400 font-extrabold uppercase tracking-widest block mt-0.5">Total</span>
                  </div>
                  <div className="border border-neutral-200 p-2.5 text-center bg-white">
                    <span className="text-sm font-black text-green-700 block">{selectedCustomer.orders > 0 ? Math.round(selectedCustomer.orders * 0.85) : 0}</span>
                    <span className="text-[6px] text-neutral-400 font-extrabold uppercase tracking-widest block mt-0.5">Completed</span>
                  </div>
                  <div className="border border-neutral-200 p-2.5 text-center bg-white">
                    <span className="text-sm font-black text-red-600 block">{selectedCustomer.orders > 0 ? Math.round(selectedCustomer.orders * 0.1) : 0}</span>
                    <span className="text-[6px] text-neutral-400 font-extrabold uppercase tracking-widest block mt-0.5">Canceled</span>
                  </div>
                </div>
              </div>

              {/* Financial Overview */}
              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Financial Summary</p>
                <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                  <span className="text-neutral-400 font-semibold">Lifetime Spend:</span>
                  <span className="font-black text-[#030213]">
                    {selectedCustomer.spent > 0 ? RS + selectedCustomer.spent.toLocaleString("en-IN") : "\u2014"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                  <span className="text-neutral-400 font-semibold">Avg. Order Value:</span>
                  <span className="font-black text-[#030213]">
                    {selectedCustomer.avgOrder > 0 ? RS + selectedCustomer.avgOrder.toLocaleString("en-IN") : "\u2014"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                  <span className="text-neutral-400 font-semibold">Registered:</span>
                  <span className="font-extrabold text-[#030213]">{selectedCustomer.registered}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] uppercase tracking-wider">
                  <span className="text-neutral-400 font-semibold">Last Purchase:</span>
                  <span className="font-extrabold text-[#030213]">{selectedCustomer.lastPurchase}</span>
                </div>
              </div>

              {/* Last Product */}
              {selectedCustomer.lastProduct !== "\u2014" && (
                <div className="border-t border-neutral-100 pt-4">
                  <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider mb-2">Last Purchased</p>
                  <div className="flex items-center gap-2.5 border border-neutral-200 p-3 bg-white">
                    <ShoppingBag className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div>
                      <p className="text-[9px] font-extrabold text-[#030213] uppercase tracking-wide">{selectedCustomer.lastProduct}</p>
                      <p className="text-[6.5px] text-neutral-400 font-bold uppercase tracking-widest">Drip Doggy</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
