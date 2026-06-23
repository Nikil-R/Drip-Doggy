import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, MoreVertical, Phone, MapPin, Clock, X, Mail,
  Edit2, Slash, Download, CheckCircle, ShoppingBag, Tag,
  TrendingUp, TrendingDown, Calendar, User, Heart, AlertTriangle
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const RS = "₹";

const weeklyDataAll = [
  { day: "Mon", active: 1240, orders: 185 },
  { day: "Tue", active: 1380, orders: 212 },
  { day: "Wed", active: 1520, orders: 248 },
  { day: "Thu", active: 1410, orders: 201 },
  { day: "Fri", active: 1780, orders: 298 },
  { day: "Sat", active: 1650, orders: 275 },
  { day: "Sun", active: 1120, orders: 162 },
];

const weeklyDataVIP = [
  { day: "Mon", active: 240, orders: 120 },
  { day: "Tue", active: 310, orders: 135 },
  { day: "Wed", active: 420, orders: 180 },
  { day: "Thu", active: 350, orders: 145 },
  { day: "Fri", active: 500, orders: 230 },
  { day: "Sat", active: 480, orders: 210 },
  { day: "Sun", active: 290, orders: 110 },
];

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  avgOrder: number;
  status: "Active" | "Inactive" | "New" | "Blocked";
  address: string;
  registered: string;
  lastPurchase: string;
  favCategory: string;
  lastProduct: string;
  notes?: string;
  wishlist?: string[];
  abandonedCart?: string;
  logins?: string[];
}

const mockCustomersData: Customer[] = [
  {
    id: "#DD-C001", name: "Ananya Sharma", email: "ananya.sharma@gmail.com", phone: "+91 98765 43210",
    orders: 28, spent: 62150, avgOrder: 2220, status: "Active",
    address: "42, Bandra West, Mumbai, Maharashtra", registered: "2025-01-12", lastPurchase: "2026-05-15",
    favCategory: "Outerwear", lastProduct: "Sartorial Trench Coat",
    notes: "VIP customer. Prefers minimal packaging.",
    wishlist: ["Structured Canvas Jacket", "French Terry Hoodie"],
    abandonedCart: "Signature Silk Blouse (Size M)",
    logins: ["2026-06-22 14:30 - Mumbai, IN", "2026-06-20 11:15 - Mumbai, IN"]
  },
  {
    id: "#DD-C002", name: "Rahul Verma", email: "rahul.verma@outlook.com", phone: "+91 87654 32109",
    orders: 15, spent: 28400, avgOrder: 1893, status: "Active",
    address: "78, Indiranagar, Bangalore, Karnataka", registered: "2025-03-03", lastPurchase: "2026-05-12",
    favCategory: "Knitwear", lastProduct: "Cashmere Blend Crew",
    wishlist: ["Merino Wool Cardigan"],
    logins: ["2026-06-21 09:45 - Bangalore, IN"]
  },
  {
    id: "#DD-C003", name: "Priya Kapoor", email: "priya.kapoor@yahoo.com", phone: "+91 76543 21098",
    orders: 42, spent: 98500, avgOrder: 2345, status: "Active",
    address: "15, GK II, New Delhi, Delhi", registered: "2024-11-20", lastPurchase: "2026-05-18",
    favCategory: "Tops", lastProduct: "Signature Silk Blouse",
    notes: "Requires fast shipping options.",
    wishlist: ["Sartorial Trench Coat", "Tailored Linen Trousers"],
    abandonedCart: "French Terry Hoodie (Size L)",
    logins: ["2026-06-22 16:10 - Delhi, IN", "2026-06-18 10:20 - Delhi, IN"]
  },
  {
    id: "#DD-C004", name: "Arjun Mehta", email: "arjun.mehta@gmail.com", phone: "+91 65432 10987",
    orders: 8, spent: 12450, avgOrder: 1556, status: "Active",
    address: "33, Jubilee Hills, Hyderabad, Telangana", registered: "2025-04-10", lastPurchase: "2026-05-08",
    favCategory: "Bottoms", lastProduct: "Pleated Wool Trousers", wishlist: []
  },
  {
    id: "#DD-C005", name: "Neha Gupta", email: "neha.gupta@rediffmail.com", phone: "+91 54321 09876",
    orders: 3, spent: 4890, avgOrder: 1630, status: "New",
    address: "55, Anna Nagar, Chennai, Tamil Nadu", registered: "2026-05-01", lastPurchase: "2026-05-05",
    favCategory: "Dresses", lastProduct: "Linen Midi Dress",
    wishlist: ["Structured Canvas Jacket"]
  },
  {
    id: "#DD-C006", name: "Vikram Singh", email: "vikram.singh@gmail.com", phone: "+91 43210 98765",
    orders: 22, spent: 45200, avgOrder: 2055, status: "Active",
    address: "89, Koregaon Park, Pune, Maharashtra", registered: "2025-02-05", lastPurchase: "2026-05-14",
    favCategory: "Outerwear", lastProduct: "Structured Canvas Jacket"
  },
  {
    id: "#DD-C007", name: "Ishita Patel", email: "ishita.patel@proton.me", phone: "+91 32109 87654",
    orders: 0, spent: 0, avgOrder: 0, status: "Inactive",
    address: "120, Navrangpura, Ahmedabad, Gujarat", registered: "2026-04-28",
    lastPurchase: "—", favCategory: "—", lastProduct: "—"
  },
  {
    id: "#DD-C008", name: "Aditya Joshi", email: "aditya.joshi@icloud.com", phone: "+91 21098 76543",
    orders: 35, spent: 73800, avgOrder: 2109, status: "Active",
    address: "7, Salt Lake, Kolkata, West Bengal", registered: "2024-10-10", lastPurchase: "2026-05-19",
    favCategory: "Knitwear", lastProduct: "Merino Wool Cardigan"
  }
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { dot: string; text: string }> = {
    Active:   { dot: "bg-emerald-500", text: "text-emerald-700" },
    Inactive: { dot: "bg-neutral-400", text: "text-neutral-500" },
    New:      { dot: "bg-[#224870]",   text: "text-[#224870]"   },
    Blocked:  { dot: "bg-red-500",     text: "text-red-600"     },
  };
  const s = config[status] || config.Inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-neutral-200 shadow-md px-3.5 py-2.5 text-[9px] font-sans uppercase font-bold tracking-wider">
      <p className="font-semibold text-[#382d24] mb-1.5">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-1.5 text-neutral-500 leading-5">
          <span className="w-1.5 h-1.5" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}:</span>
          <span className="text-[#382d24] font-bold">{entry.value.toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
}

function CustomerAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#224870", "#382d24", "#615e56"];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return (
    <div
      className="w-9 h-9 flex items-center justify-center text-[10px] font-black text-white tracking-wide rounded-full shrink-0"
      style={{ backgroundColor: colors[idx] }}
    >
      {initials}
    </div>
  );
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomersData);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [segment, setSegment] = useState<"all" | "vip" | "atrisk" | "new">("all");
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [panelNoteText, setPanelNoteText] = useState("");
  const [chartSegment, setChartSegment] = useState<"all" | "vip">("all");

  // Dashboard-style calendar
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(5);
  const calendarRef = useRef<HTMLDivElement>(null);

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

  const selectedCustomer = useMemo(() => customers.find(c => c.id === selectedCustomerId) || null, [customers, selectedCustomerId]);

  const handleOpenModal = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setPanelNoteText(customer.notes || "");
  };

  const handleSavePanelNotes = () => {
    if (!selectedCustomerId) return;
    setCustomers(prev => prev.map(c => c.id === selectedCustomerId ? { ...c, notes: panelNoteText } : c));
    setSelectedCustomerId(null);
  };

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let list = customers.filter(c =>
      c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) ||
      c.phone.includes(q) || c.email.toLowerCase().includes(q)
    );
    if (activeTab === "active") list = list.filter(c => c.status === "Active");
    else if (activeTab === "new") list = list.filter(c => c.status === "New");
    else if (activeTab === "inactive") list = list.filter(c => c.status === "Inactive");
    if (segment === "vip") list = list.filter(c => c.spent >= 50000);
    else if (segment === "atrisk") list = list.filter(c => c.status === "Inactive" || c.status === "Blocked");
    else if (segment === "new") list = list.filter(c => c.status === "New" || c.registered >= "2026-05-01");
    if (dateRange.start) list = list.filter(c => c.registered >= dateRange.start);
    if (dateRange.end) list = list.filter(c => c.registered <= dateRange.end);
    return list;
  }, [customers, searchQuery, activeTab, segment, dateRange]);

  const handleToggleBlock = (id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "Blocked" ? "Active" : "Blocked" } : c));
  };

  const handleExportCSV = () => {
    const headers = ["Customer ID,Name,Email,Phone,Orders,Spent,Avg Order,Status,Registered,Address"];
    const rows = filteredCustomers.map(c => `"${c.id}","${c.name}","${c.email}","${c.phone}",${c.orders},${c.spent},${c.avgOrder},${c.status},${c.registered},"${c.address}"`);
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer) return;
    setCustomers(prev => prev.map(c => c.id === editCustomer.id ? editCustomer : c));
    setEditCustomer(null);
  };

  const tabs = [
    { id: "all",      label: "All",      count: customers.length },
    { id: "active",   label: "Active",   count: customers.filter(c => c.status === "Active").length },
    { id: "new",      label: "New",      count: customers.filter(c => c.status === "New").length },
    { id: "inactive", label: "Inactive", count: customers.filter(c => c.status === "Inactive").length },
  ];

  const kpiData = [
    {
      label: "Total Customers",
      value: "18,450",
      trend: "up" as const,
      change: "+22.3%",
      subtitle: "Lifetime registered accounts"
    },
    {
      label: "Active This Month",
      value: "3,280",
      trend: "up" as const,
      change: "+15.7%",
      subtitle: "Purchased in last 30 days"
    },
    {
      label: "New This Week",
      value: "845",
      trend: "up" as const,
      change: "+11.2%",
      subtitle: "Joined in last 7 days"
    },
    {
      label: "Inactive Customers",
      value: "1,120",
      trend: "down" as const,
      change: "-2.5%",
      subtitle: "No orders in last 90 days"
    },
  ];

  return (
    <div className="space-y-8 font-sans">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest">
            Customer Management
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Drip Doggy customer profiles &amp; marketing segments
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-card border border-neutral-200 hover:border-[#224870] hover:text-[#224870] text-[#615e56] text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer flex items-center gap-2 rounded-full transition-all self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" /> Export Customers
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

      {/* ─── Activity Chart ─── */}
      <div className="bg-card border border-neutral-200/80 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase block">
              Customer Activity Trends
            </span>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-0.5">Weekly active customers &amp; orders</p>
          </div>
          <div className="flex items-center border border-neutral-200">
            {(["all", "vip"] as const).map(t => (
              <button key={t} onClick={() => setChartSegment(t)}
                className={`px-3 py-1.5 text-[8.5px] font-bold uppercase tracking-widest border-none cursor-pointer transition-all ${chartSegment === t ? "bg-[#224870] text-white" : "bg-card text-neutral-400 hover:text-[#382d24]"}`}>
                {t === "all" ? "All Accounts" : "VIP Focus"}
              </button>
            ))}
          </div>
        </div>

        {/* Summary chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: "Avg. Session Time",       value: "4m 32s",     Icon: Clock     },
            { label: "Loyalty Repeat Rate",     value: "68.4%",      Icon: ShoppingBag },
            { label: "Customer Lifetime Value", value: RS + "32,800", Icon: Tag       },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 border border-neutral-200/60 bg-background/50 p-3.5">
              <item.Icon className="w-4 h-4 text-[#224870] shrink-0" />
              <div>
                <p className="text-[12px] font-bold text-[#382d24]">{item.value}</p>
                <p className="text-[8.5px] text-[#615e56] font-semibold uppercase tracking-wider mt-0.5">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-[170px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartSegment === "all" ? weeklyDataAll : weeklyDataVIP} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="customerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#224870" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#224870" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,45,36,0.06)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#615e56", fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#615e56", fontWeight: 700 }} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="active" name="Active Customers" stroke="#224870" strokeWidth={2.5} fill="url(#customerGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Filters + Table ─── */}
      <div className="bg-card border border-neutral-200/80 overflow-hidden">

        {/* Filter bar */}
        <div className="p-4 border-b border-neutral-200/60 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">

            {/* Status tabs */}
            <div className="flex bg-background border border-neutral-200 p-1 rounded-full gap-0.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSelectedCustomerId(null); }}
                  className={`px-3.5 py-1.5 text-[8.5px] font-bold tracking-widest uppercase border-none cursor-pointer rounded-full transition-all ${
                    activeTab === tab.id ? "bg-[#224870] text-white shadow-sm" : "bg-transparent text-neutral-500 hover:text-[#224870]"
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 text-[7px] ${activeTab === tab.id ? "text-white/70" : "text-neutral-400"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Segment select */}
            <div className="flex items-center border border-neutral-200 bg-card px-3 py-1.5 rounded-sm gap-2">
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Segment:</span>
              <select
                value={segment}
                onChange={e => setSegment(e.target.value as any)}
                className="bg-transparent border-none text-[8.5px] font-bold uppercase tracking-wider focus:outline-none cursor-pointer text-[#382d24]"
              >
                <option value="all">All Groups</option>
                <option value="vip">VIP (LTV &gt; 50k)</option>
                <option value="new">New Accounts</option>
                <option value="atrisk">At-Risk / Inactive</option>
              </select>
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
                      onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}
                      className="p-1 hover:bg-neutral-100 bg-transparent border-none cursor-pointer text-[#382d24] font-bold text-[11px]"
                    >&lt;</button>
                    <span className="font-extrabold uppercase tracking-widest text-[#382d24]">
                      {monthNames[calMonth]} {calYear}
                    </span>
                    <button
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
                      onClick={() => { setDateRange({ start: "", end: "" }); setShowCalendar(false); }}
                      className="text-[8px] font-bold text-red-700 hover:underline uppercase bg-transparent border-none cursor-pointer"
                    >Clear Range</button>
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="text-[8px] font-bold text-[#382d24] hover:underline uppercase bg-transparent border-none cursor-pointer"
                    >Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search name, email, phone…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-card border border-neutral-200 pl-10 pr-4 py-2 text-[9.5px] font-semibold focus:outline-none focus:border-[#224870] placeholder-neutral-400 w-full md:w-72 rounded-full transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200/80 bg-background/60 text-[9.5px] text-[#615e56] font-bold tracking-[0.12em] uppercase">
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Avg. Order</th>
                <th className="p-4">Registered</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100/80">
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-[#224870]/5 transition-colors cursor-pointer"
                  onClick={() => handleOpenModal(c)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <CustomerAvatar name={c.name} />
                      <div>
                        <p className="font-bold text-[11px] text-[#382d24]">{c.name}</p>
                        <span className="text-[8.5px] text-neutral-400 font-medium block">{c.email}</span>
                        <span className="text-[7.5px] font-mono text-[#224870] font-bold">{c.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[9.5px] text-[#615e56] font-semibold font-mono">{c.phone}</td>
                  <td className="p-4 font-black text-[11px] text-[#382d24]">{c.orders}</td>
                  <td className="p-4 font-black text-[11px] text-[#382d24]">{RS}{c.spent.toLocaleString("en-IN")}</td>
                  <td className="p-4 text-[10px] font-semibold text-[#615e56]">{c.avgOrder > 0 ? `${RS}${c.avgOrder.toLocaleString("en-IN")}` : "—"}</td>
                  <td className="p-4 text-[9.5px] text-[#736e64] font-semibold">{c.registered}</td>
                  <td className="p-4"><StatusBadge status={c.status} /></td>
                  <td className="p-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditCustomer(c)}
                        className="p-1.5 text-neutral-400 hover:text-[#224870] hover:bg-[#224870]/10 bg-transparent border-none cursor-pointer rounded-full transition-all"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleBlock(c.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 bg-transparent border-none cursor-pointer rounded-full transition-all"
                        title={c.status === "Blocked" ? "Unblock" : "Block Customer"}
                      >
                        <Slash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-[11px] text-neutral-400 font-bold uppercase tracking-widest">
                    No customers match current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-4 py-3 border-t border-neutral-100/80 flex items-center justify-between">
          <p className="text-[9px] text-[#615e56] font-bold uppercase tracking-wider">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
          <p className="text-[9px] text-[#615e56] font-semibold">
            Click any row to view full profile
          </p>
        </div>
      </div>

      {/* ─── Customer Detail Modal ─── */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCustomerId(null)}
        >
          <div
            className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl border border-neutral-200/80 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-200 flex items-start justify-between sticky top-0 bg-card z-10">
              <div className="flex items-center gap-4">
                <CustomerAvatar name={selectedCustomer.name} />
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Customer Profile</span>
                  <h2 className="text-[17px] font-[950] text-[#382d24] uppercase tracking-widest mt-0.5">{selectedCustomer.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <StatusBadge status={selectedCustomer.status} />
                    <span className="text-[8px] font-mono text-[#224870] font-bold">{selectedCustomer.id}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="p-2 border border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-[#382d24] bg-transparent cursor-pointer rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">

              {/* 2-col: Contact + Purchase Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Contact Details */}
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Contact</span>
                  <div className="border border-neutral-200 p-4 space-y-2.5 bg-background/50 rounded-sm text-[9px]">
                    <a href={`mailto:${selectedCustomer.email}`} className="flex items-center gap-2 font-semibold text-neutral-600 hover:text-[#224870] transition-colors">
                      <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="lowercase truncate">{selectedCustomer.email}</span>
                    </a>
                    <a href={`tel:${selectedCustomer.phone}`} className="flex items-center gap-2 font-semibold text-neutral-600 hover:text-[#224870] transition-colors">
                      <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      {selectedCustomer.phone}
                    </a>
                    <div className="flex items-start gap-2 text-neutral-600 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span className="uppercase text-[8.5px]">{selectedCustomer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Purchase Summary */}
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Purchase Summary</span>
                  <div className="border border-neutral-200 p-4 space-y-2.5 bg-background/50 rounded-sm text-[9px]">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-semibold uppercase tracking-wider">Total Orders</span>
                      <span className="font-black text-[12px] text-[#382d24]">{selectedCustomer.orders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-semibold uppercase tracking-wider">Total Spent</span>
                      <span className="font-black text-[12px] text-[#382d24]">{RS}{selectedCustomer.spent.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-semibold uppercase tracking-wider">Avg. Order Value</span>
                      <span className="font-bold text-[#382d24]">{selectedCustomer.avgOrder > 0 ? `${RS}${selectedCustomer.avgOrder.toLocaleString("en-IN")}` : "—"}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-neutral-100 pt-2">
                      <span className="text-neutral-400 font-semibold uppercase tracking-wider">Fav. Category</span>
                      <span className="font-bold text-[#224870]">{selectedCustomer.favCategory}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-semibold uppercase tracking-wider">Last Purchase</span>
                      <span className="font-semibold text-[#736e64]">{selectedCustomer.lastPurchase}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-semibold uppercase tracking-wider">Registered</span>
                      <span className="font-semibold text-[#736e64]">{selectedCustomer.registered}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Abandoned Cart */}
              {selectedCustomer.abandonedCart && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black text-amber-800 uppercase tracking-wider">Abandoned Cart</p>
                    <p className="text-[9px] font-semibold text-amber-700 mt-0.5">{selectedCustomer.abandonedCart} — awaiting checkout for 24h+</p>
                  </div>
                </div>
              )}

              {/* Wishlist */}
              {selectedCustomer.wishlist && selectedCustomer.wishlist.length > 0 && (
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">
                    Wishlisted Styles — {selectedCustomer.wishlist.length} items
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.wishlist.map(w => (
                      <span key={w} className="bg-[#224870]/8 border border-[#224870]/20 text-[#224870] px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wider rounded-sm">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Login History */}
              {selectedCustomer.logins && (
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Recent Activity Log</span>
                  <div className="border border-neutral-200 bg-background/50 rounded-sm p-3 space-y-1.5">
                    {selectedCustomer.logins.map((log, i) => (
                      <div key={i} className="text-[8.5px] font-mono text-[#615e56] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Internal Admin Notes</span>
                <textarea
                  rows={3}
                  value={panelNoteText}
                  onChange={e => setPanelNoteText(e.target.value)}
                  placeholder="Add VIP details, sizing preferences, special handling notes…"
                  className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[10px] font-semibold focus:outline-none focus:border-[#224870] rounded-sm leading-relaxed transition-all"
                />
              </div>

              {/* Customer Actions */}
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Customer Actions</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEditCustomer(selectedCustomer); setSelectedCustomerId(null); }}
                    className="flex-1 bg-card border border-neutral-200 hover:border-[#224870] hover:text-[#224870] text-neutral-600 py-2.5 text-[9px] font-bold uppercase tracking-widest cursor-pointer rounded-full flex items-center justify-center gap-2 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                  <button
                    onClick={() => handleToggleBlock(selectedCustomer.id)}
                    className="flex-1 bg-card border border-neutral-200 hover:border-red-500 hover:text-red-500 text-neutral-600 py-2.5 text-[9px] font-bold uppercase tracking-widest cursor-pointer rounded-full flex items-center justify-center gap-2 transition-all"
                  >
                    <Slash className="w-3.5 h-3.5" />
                    {selectedCustomer.status === "Blocked" ? "Unblock Account" : "Block Account"}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-neutral-200 flex items-center justify-end gap-3 bg-card sticky bottom-0">
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-6 py-2.5 uppercase bg-transparent cursor-pointer rounded-full transition-all"
              >
                Close
              </button>
              <button
                onClick={handleSavePanelNotes}
                className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-6 py-2.5 uppercase cursor-pointer rounded-full border-none transition-all"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Customer Modal ─── */}
      {editCustomer && (
        <div
          className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setEditCustomer(null)}
        >
          <div
            className="bg-card w-full max-w-sm border border-neutral-200/80 shadow-2xl rounded-sm"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Edit Profile</span>
                <h3 className="text-[13px] font-[950] text-[#382d24] uppercase tracking-widest mt-0.5">{editCustomer.name}</h3>
              </div>
              <button onClick={() => setEditCustomer(null)} className="p-2 border border-neutral-200 text-neutral-400 hover:border-neutral-400 bg-transparent cursor-pointer rounded-full transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              {[
                { label: "Customer Name",     field: "name",    type: "text"  },
                { label: "Email Address",     field: "email",   type: "email" },
                { label: "Phone Number",      field: "phone",   type: "text"  },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">{label}</label>
                  <input
                    required type={type}
                    value={(editCustomer as any)[field]}
                    onChange={e => setEditCustomer({ ...editCustomer, [field]: e.target.value })}
                    className="w-full bg-card border border-neutral-200 text-[10px] font-semibold px-3 py-2 focus:outline-none focus:border-[#224870] rounded-sm transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#615e56] uppercase mb-1.5">Shipping Address</label>
                <textarea
                  required rows={2}
                  value={editCustomer.address}
                  onChange={e => setEditCustomer({ ...editCustomer, address: e.target.value })}
                  className="w-full bg-card border border-neutral-200 text-[10px] font-semibold px-3 py-2 focus:outline-none focus:border-[#224870] rounded-sm transition-all leading-relaxed"
                />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setEditCustomer(null)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2 uppercase bg-transparent cursor-pointer rounded-full transition-all">
                  Cancel
                </button>
                <button type="submit" className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer rounded-full border-none transition-all">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
