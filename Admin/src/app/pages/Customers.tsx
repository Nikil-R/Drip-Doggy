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
  Heart,
  Tag,
  Clock,
  X,
  Mail,
  Edit2,
  Slash,
  Download,
  CheckCircle,
  FileText
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

const RS = "₹";

const kpiStats = [
  { label: "Total Customers", value: "18,450", change: "+22.3%", subtitle: "Lifetime registered" },
  { label: "Active This Month", value: "3,280", change: "+15.7%", subtitle: "Made purchase in last 30d" },
  { label: "New This Week", value: "845", change: "+11.2%", subtitle: "Joined in last 7 days" },
  { label: "Inactive Customers", value: "1,120", change: "-2.5%", subtitle: "No orders in last 90 days" }
];

const weeklyDataAll = [
  { day: "Mon", active: 1240, visitors: 18400, orders: 185 },
  { day: "Tue", active: 1380, visitors: 20100, orders: 212 },
  { day: "Wed", active: 1520, visitors: 22800, orders: 248 },
  { day: "Thu", active: 1410, visitors: 19500, orders: 201 },
  { day: "Fri", active: 1780, visitors: 26500, orders: 298 },
  { day: "Sat", active: 1650, visitors: 24200, orders: 275 },
  { day: "Sun", active: 1120, visitors: 15800, orders: 162 }
];

const weeklyDataVIP = [
  { day: "Mon", active: 240, visitors: 2800, orders: 120 },
  { day: "Tue", active: 310, visitors: 3100, orders: 135 },
  { day: "Wed", active: 420, visitors: 4200, orders: 180 },
  { day: "Thu", active: 350, visitors: 3500, orders: 145 },
  { day: "Fri", active: 500, visitors: 5800, orders: 230 },
  { day: "Sat", active: 480, visitors: 5200, orders: 210 },
  { day: "Sun", active: 290, visitors: 3300, orders: 110 }
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
    id: "#DD-C001", 
    name: "Ananya Sharma", 
    email: "ananya.sharma@gmail.com", 
    phone: "+91 98765 43210", 
    orders: 28, 
    spent: 62150, 
    avgOrder: 2220, 
    status: "Active", 
    address: "42, Bandra West, Mumbai, Maharashtra", 
    registered: "2025-01-12", 
    lastPurchase: "2026-05-15", 
    favCategory: "Outerwear", 
    lastProduct: "Sartorial Trench Coat",
    notes: "VIP customer. Prefers minimal packaging.",
    wishlist: ["Structured Canvas Jacket", "French Terry Hoodie"],
    abandonedCart: "Signature Silk Blouse (Size M)",
    logins: ["2026-06-22 14:30 - Mumbai, IN", "2026-06-20 11:15 - Mumbai, IN"]
  },
  { 
    id: "#DD-C002", 
    name: "Rahul Verma", 
    email: "rahul.verma@outlook.com", 
    phone: "+91 87654 32109", 
    orders: 15, 
    spent: 28400, 
    avgOrder: 1893, 
    status: "Active", 
    address: "78, Indiranagar, Bangalore, Karnataka", 
    registered: "2025-03-03", 
    lastPurchase: "2026-05-12", 
    favCategory: "Knitwear", 
    lastProduct: "Cashmere Blend Crew",
    wishlist: ["Merino Wool Cardigan"],
    logins: ["2026-06-21 09:45 - Bangalore, IN"]
  },
  { 
    id: "#DD-C003", 
    name: "Priya Kapoor", 
    email: "priya.kapoor@yahoo.com", 
    phone: "+91 76543 21098", 
    orders: 42, 
    spent: 98500, 
    avgOrder: 2345, 
    status: "Active", 
    address: "15, GK II, New Delhi, Delhi", 
    registered: "2024-11-20", 
    lastPurchase: "2026-05-18", 
    favCategory: "Tops", 
    lastProduct: "Signature Silk Blouse",
    notes: "Requires fast shipping options.",
    wishlist: ["Sartorial Trench Coat", "Tailored Linen Trousers"],
    abandonedCart: "French Terry Hoodie (Size L)",
    logins: ["2026-06-22 16:10 - Delhi, IN", "2026-06-18 10:20 - Delhi, IN"]
  },
  { 
    id: "#DD-C004", 
    name: "Arjun Mehta", 
    email: "arjun.mehta@gmail.com", 
    phone: "+91 65432 10987", 
    orders: 8, 
    spent: 12450, 
    avgOrder: 1556, 
    status: "Active", 
    address: "33, Jubilee Hills, Hyderabad, Telangana", 
    registered: "2025-04-10", 
    lastPurchase: "2026-05-08", 
    favCategory: "Bottoms", 
    lastProduct: "Pleated Wool Trousers",
    wishlist: []
  },
  { 
    id: "#DD-C005", 
    name: "Neha Gupta", 
    email: "neha.gupta@rediffmail.com", 
    phone: "+91 54321 09876", 
    orders: 3, 
    spent: 4890, 
    avgOrder: 1630, 
    status: "New", 
    address: "55, Anna Nagar, Chennai, Tamil Nadu", 
    registered: "2026-05-01", 
    lastPurchase: "2026-05-05", 
    favCategory: "Dresses", 
    lastProduct: "Linen Midi Dress",
    wishlist: ["Structured Canvas Jacket"]
  },
  { 
    id: "#DD-C006", 
    name: "Vikram Singh", 
    email: "vikram.singh@gmail.com", 
    phone: "+91 43210 98765", 
    orders: 22, 
    spent: 45200, 
    avgOrder: 2055, 
    status: "Active", 
    address: "89, Koregaon Park, Pune, Maharashtra", 
    registered: "2025-02-05", 
    lastPurchase: "2026-05-14", 
    favCategory: "Outerwear", 
    lastProduct: "Structured Canvas Jacket"
  },
  { 
    id: "#DD-C007", 
    name: "Ishita Patel", 
    email: "ishita.patel@proton.me", 
    phone: "+91 32109 87654", 
    orders: 0, 
    spent: 0, 
    avgOrder: 0, 
    status: "Inactive", 
    address: "120, Navrangpura, Ahmedabad, Gujarat", 
    registered: "2026-04-28", 
    lastPurchase: "—", 
    favCategory: "—", 
    lastProduct: "—"
  },
  { 
    id: "#DD-C008", 
    name: "Aditya Joshi", 
    email: "aditya.joshi@icloud.com", 
    phone: "+91 21098 76543", 
    orders: 35, 
    spent: 73800, 
    avgOrder: 2109, 
    status: "Active", 
    address: "7, Salt Lake, Kolkata, West Bengal", 
    registered: "2024-10-10", 
    lastPurchase: "2026-05-19", 
    favCategory: "Knitwear", 
    lastProduct: "Merino Wool Cardigan"
  }
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    Active: { bg: "bg-emerald-600", text: "text-emerald-700", label: "Active" },
    Inactive: { bg: "bg-neutral-400", text: "text-neutral-500", label: "Inactive" },
    New: { bg: "bg-blue-600", text: "text-blue-700", label: "New" },
    Blocked: { bg: "bg-red-600", text: "text-red-700", label: "Blocked" }
  };
  const s = config[status] || config.Inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[8px] font-semibold tracking-widest uppercase ${s.text}`}>
      {/* Square indicator dot instead of rounded-full */}
      <span className={`w-1.5 h-1.5 ${s.bg}`} />
      {s.label}
    </span>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-neutral-200 shadow-md px-3.5 py-2.5 text-[9px] font-sans uppercase font-bold tracking-wider rounded-none">
      <p className="font-semibold text-[#030213] mb-1.5">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-1.5 text-neutral-500 leading-5">
          <span className="w-1.5 h-1.5 rounded-none" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}:</span>
          <span className="text-[#030213] font-bold">{entry.value.toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
}

function CustomerAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const bgColors = ["#030213", "#b2533e", "#717182"];
  const colorIndex = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % bgColors.length;
  return (
    <div
      className="w-8 h-8 flex items-center justify-center text-[10px] font-bold text-white tracking-wide rounded-none shrink-0"
      style={{ backgroundColor: bgColors[colorIndex] }}
    >
      {initials}
    </div>
  );
}

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomersData);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Segment state: "all" | "vip" | "atrisk" | "new"
  const [segment, setSegment] = useState<"all" | "vip" | "atrisk" | "new">("all");

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & inputs state
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [campaignModal, setCampaignModal] = useState(false);
  const [sendEmailText, setSendEmailText] = useState({ subject: "", body: "" });
  const [panelNoteText, setPanelNoteText] = useState("");

  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const handleOpenPanel = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setPanelNoteText(customer.notes || "");
  };

  const handleSavePanelNotes = () => {
    if (!selectedCustomerId) return;
    setCustomers(prev => prev.map(c => c.id === selectedCustomerId ? { ...c, notes: panelNoteText } : c));
    alert("Internal customer notes updated.");
  };

  // Filter logic
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let list = customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    );

    // Tab filters
    if (activeTab === "active") list = list.filter(c => c.status === "Active");
    else if (activeTab === "new") list = list.filter(c => c.status === "New");
    else if (activeTab === "inactive") list = list.filter(c => c.status === "Inactive");

    // Segment filters
    if (segment === "vip") {
      list = list.filter(c => c.spent >= 50000);
    } else if (segment === "atrisk") {
      list = list.filter(c => c.status === "Inactive" || c.status === "Blocked");
    } else if (segment === "new") {
      list = list.filter(c => c.status === "New" || c.registered >= "2026-05-01");
    }

    return list;
  }, [customers, searchQuery, activeTab, segment]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 1500);
  };

  // Toggle active/blocked status
  const handleToggleBlock = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === "Blocked" ? "Active" : "Blocked";
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Bulk Operations
  const handleBulkDeactivate = () => {
    setCustomers(prev => prev.map(c => selectedIds.includes(c.id) ? { ...c, status: "Inactive" } : c));
    setSelectedIds([]);
  };

  const handleBulkCampaign = () => {
    setCampaignModal(true);
  };

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const count = selectedIds.length > 0 ? selectedIds.length : filteredCustomers.length;
    alert(`Successfully launched email campaign "${sendEmailText.subject}" to ${count} target customers.`);
    setCampaignModal(false);
    setSendEmailText({ subject: "", body: "" });
    setSelectedIds([]);
  };

  // Export Customer List CSV
  const handleExportCSV = () => {
    const listToExport = selectedIds.length > 0 ? customers.filter(c => selectedIds.includes(c.id)) : filteredCustomers;
    const headers = ["Customer ID,Name,Email,Phone,Orders,Spent,Avg Order,Status,Registered,Address"];
    const rows = listToExport.map(c => `"${c.id}","${c.name}","${c.email}","${c.phone}",${c.orders},${c.spent},${c.avgOrder},${c.status},${c.registered},"${c.address}"`);
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save Edit Modal
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer) return;
    setCustomers(prev => prev.map(c => c.id === editCustomer.id ? editCustomer : c));
    setEditCustomer(null);
  };

  const tabs = [
    { id: "all", label: "All Customers", count: customers.length },
    { id: "active", label: "Active", count: customers.filter(c => c.status === "Active").length },
    { id: "new", label: "New", count: customers.filter(c => c.status === "New").length },
    { id: "inactive", label: "Inactive", count: customers.filter(c => c.status === "Inactive").length }
  ];

  return (
    <div className="space-y-8 font-sans text-[#030213]">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">
            Customers
          </h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy customer profiles &amp; marketing segments
          </p>
        </div>
        <button onClick={handleExportCSV} className="bg-card border border-neutral-200 hover:border-[#030213] text-neutral-600 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none">
          <Download className="w-3.5 h-3.5" /> Export Customers
        </button>
      </div>

      {/* ── KPI Cards Row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiStats.map((stat, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[115px] hover:shadow-sm transition-shadow rounded-none">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[7px] font-bold tracking-[0.2em] text-neutral-400 uppercase block">
                  {stat.label}
                </span>
                <p className="text-[6.5px] text-neutral-400 font-bold uppercase mt-0.5">{stat.subtitle}</p>
              </div>
              <MoreVertical className="h-4 w-4 text-neutral-300" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-[#030213]">{stat.value}</span>
              <span className="text-[7px] font-bold px-1.5 py-0.5 border bg-green-50 text-green-700 border-green-200 uppercase tracking-wide">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart + Summary ─────────────────────────────────────────── */}
      <div className="bg-card border border-neutral-200/80 p-6 rounded-none">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase block">
            Customer Activity Trends
          </span>
          <div className="flex items-center border border-neutral-200">
            {["all", "vip"].map((t) => (
              <button key={t} onClick={() => setSegment(t as any)}
                className={`px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest border-none cursor-pointer ${segment === t ? "bg-[#030213] text-white" : "bg-card text-neutral-400"}`}>
                {t === "all" ? "All Accounts" : "VIP Focus"}
              </button>
            ))}
          </div>
        </div>

        {/* Summary chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: "Avg. Session Time", value: "4m 32s", icon: Clock },
            { label: "Loyalty Repeat Rate", value: "68.4%", icon: ShoppingBag },
            { label: "Customer Lifetime Value", value: RS + "32,800", icon: Tag }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 border border-neutral-200/60 bg-card p-3 rounded-none">
              <item.icon className="w-4 h-4 text-neutral-400 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-[#030213]">{item.value}</p>
                <p className="text-[6.5px] text-neutral-400 font-semibold uppercase tracking-wider">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Area Chart */}
        <div className="h-[170px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={segment === "all" ? weeklyDataAll : weeklyDataVIP} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
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

      {/* ── Bulk Actions floating bar ─────────────────────────────────── */}
      {selectedIds.length > 0 && (
        <div className="bg-[#030213] text-white p-3.5 flex items-center justify-between border border-[#030213] rounded-none">
          <span className="text-[8px] font-bold tracking-widest uppercase">{selectedIds.length} Customers Selected</span>
          <div className="flex items-center gap-2">
            <button onClick={handleBulkCampaign} className="bg-transparent border border-white/20 text-white hover:border-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer">
              Send Campaign
            </button>
            <button onClick={handleBulkDeactivate} className="bg-[#b2533e] text-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer border-none">
              Deactivate Accounts
            </button>
            <button onClick={() => setSelectedIds([])} className="bg-transparent border-none text-white/50 hover:text-white p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Customer Grid / Layout ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── Table Column ──────────────────────────────────────────── */}
        <div className={selectedCustomerId ? "lg:col-span-7 bg-card border border-neutral-200/80 p-5 rounded-none" : "lg:col-span-12 bg-card border border-neutral-200/80 p-5 rounded-none"}>
          
          {/* Controls */}
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border border-neutral-200 pl-8 pr-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-full rounded-none"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-card border border-neutral-200 p-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setSelectedCustomerId(null); }}
                    className={`px-3 py-1.5 text-[7px] font-semibold tracking-widest uppercase border-none cursor-pointer rounded-none ${
                      activeTab === tab.id ? "bg-[#030213] text-white" : "bg-transparent text-neutral-400 hover:text-[#030213]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Segment Dropdown */}
              <div className="flex border border-neutral-200 bg-card px-2 py-1">
                <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest mr-1 self-center">Segment:</span>
                <select
                  value={segment}
                  onChange={(e) => setSegment(e.target.value as any)}
                  className="bg-transparent border-none text-[8px] font-semibold uppercase tracking-widest focus:outline-none cursor-pointer"
                >
                  <option value="all">All Groups</option>
                  <option value="vip">VIP (LTV &gt; 50k)</option>
                  <option value="new">New Accounts</option>
                  <option value="atrisk">At-Risk / Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left uppercase text-[8.5px] font-bold tracking-wider divide-y divide-neutral-100">
              <thead>
                <tr className="border-b border-neutral-200 bg-card/60 text-[7px] text-neutral-400 tracking-[0.2em]">
                  <th className="p-3 w-8">
                    <button
                      onClick={() => {
                        const currentIds = filteredCustomers.map(c => c.id);
                        const allSelected = currentIds.every(id => selectedIds.includes(id));
                        if (allSelected) {
                          setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
                        } else {
                          setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
                        }
                      }}
                      className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#030213] p-0 flex items-center"
                    >
                      <span className={`w-3.5 h-3.5 border border-neutral-300 inline-block flex items-center justify-center ${filteredCustomers.every(c => selectedIds.includes(c.id)) ? "bg-[#030213] border-[#030213]" : ""}`}>
                        {filteredCustomers.every(c => selectedIds.includes(c.id)) && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                      </span>
                    </button>
                  </th>
                  <th className="p-3 font-bold">Customer</th>
                  <th className="p-3 font-bold">Phone</th>
                  <th className="p-3 font-bold">Orders</th>
                  <th className="p-3 font-bold">Spent</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                {filteredCustomers.map((c, i) => (
                  <tr
                    key={i}
                    onClick={() => handleOpenPanel(c)}
                    className={`hover:bg-neutral-100/50 transition-colors cursor-pointer ${
                      selectedCustomerId === c.id ? "bg-neutral-100" : ""
                    }`}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setSelectedIds(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])} className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#030213] p-0 flex items-center">
                        <span className={`w-3.5 h-3.5 border border-neutral-300 inline-block flex items-center justify-center ${selectedIds.includes(c.id) ? "bg-[#030213] border-[#030213]" : ""}`}>
                          {selectedIds.includes(c.id) && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                        </span>
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <CustomerAvatar name={c.name} />
                        <div>
                          <p className="font-semibold text-[#030213] text-[9px]">{c.name}</p>
                          <span className="text-[6.5px] text-neutral-400 font-semibold tracking-wider lowercase">{c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-neutral-500 font-mono text-[8px]">{c.phone}</td>
                    <td className="p-3 font-bold text-[#030213]">{c.orders}</td>
                    <td className="p-3 font-bold text-[#030213]">{RS}{c.spent.toLocaleString("en-IN")}</td>
                    <td className="p-3"><StatusBadge status={c.status} /></td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditCustomer(c)} className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer" title="Edit Profile">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleToggleBlock(c.id)} className="text-neutral-400 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer" title={c.status === "Blocked" ? "Activate" : "Block Customer"}>
                          <Slash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-neutral-400 font-bold uppercase">No matching customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Side Details Drawer ────────────────────────────────────── */}
        {selectedCustomer && (
          <div className="lg:col-span-5 bg-card border border-neutral-200/80 p-5 space-y-5 sticky top-24 rounded-none">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <span className="text-[7px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Customer Profile</span>
                <h3 className="text-[10px] font-bold uppercase text-[#030213] tracking-widest mt-1">{selectedCustomer.name}</h3>
              </div>
              <button onClick={() => setSelectedCustomerId(null)} className="text-neutral-400 hover:text-[#030213] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile detail tags */}
            <div className="space-y-3">
              <div className="border border-neutral-200 p-3 bg-card space-y-2 text-[8px] font-semibold uppercase tracking-wide">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Account ID</span>
                  <span className="font-mono text-[#030213]">{selectedCustomer.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status</span>
                  <StatusBadge status={selectedCustomer.status} />
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-2">
                  <span className="text-neutral-400">Email</span>
                  <a href={`mailto:${selectedCustomer.email}`} className="text-[#030213] lowercase hover:underline">{selectedCustomer.email}</a>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Mobile</span>
                  <a href={`tel:${selectedCustomer.phone}`} className="text-[#030213] hover:underline">{selectedCustomer.phone}</a>
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-2">
                  <span className="text-neutral-400">Address</span>
                  <span className="text-right text-[#030213] max-w-[200px] truncate">{selectedCustomer.address}</span>
                </div>
              </div>
            </div>

            {/* Abandoned Cart & Wishlist Warnings */}
            {selectedCustomer.abandonedCart && (
              <div className="bg-amber-50 border border-amber-200 p-3 text-[8px] font-bold uppercase tracking-wider text-amber-800">
                ⚠️ Abandoned Cart: {selectedCustomer.abandonedCart} (Awaiting checkout 24h)
              </div>
            )}

            {/* Wishlist View */}
            {selectedCustomer.wishlist && selectedCustomer.wishlist.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[7px] font-bold tracking-widest uppercase text-neutral-400 block">Wishlisted Styles</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCustomer.wishlist.map(w => (
                    <span key={w} className="bg-neutral-100 border border-neutral-200 text-[#030213] px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider">{w}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Logins history */}
            {selectedCustomer.logins && (
              <div className="space-y-1.5">
                <span className="text-[7px] font-bold tracking-widest uppercase text-neutral-400 block">Recent Activity Log</span>
                <div className="border border-neutral-200 bg-card p-2 space-y-1 text-[7px] font-mono text-neutral-500">
                  {selectedCustomer.logins.map((log, index) => <div key={index}>{log}</div>)}
                </div>
              </div>
            )}

            {/* Internal Notes textarea */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-200/60">
              <span className="text-[7px] font-bold tracking-widest uppercase text-neutral-400 block">Internal notes</span>
              <textarea
                value={panelNoteText}
                onChange={(e) => setPanelNoteText(e.target.value)}
                rows={2}
                placeholder="Add VIP details or customer sizing preferences..."
                className="w-full bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none leading-normal"
              />
              <button onClick={handleSavePanelNotes} className="w-full bg-[#030213] text-white hover:bg-neutral-800 py-1.5 text-[8px] font-bold uppercase tracking-widest cursor-pointer rounded-none border-none">
                Save Notes
              </button>
            </div>

            {/* Customer Operations Panel */}
            <div className="pt-3 border-t border-neutral-200/60 space-y-3">
              <span className="text-[7px] font-bold tracking-widest uppercase text-neutral-400 block">Customer Actions</span>
              <div className="flex gap-2">
                <button onClick={() => setEditCustomer(selectedCustomer)} className="flex-1 bg-card border border-neutral-200 hover:border-[#030213] text-neutral-700 hover:text-[#030213] py-2 text-[8px] font-bold uppercase tracking-widest cursor-pointer rounded-none flex items-center justify-center gap-1">
                  <Edit2 className="w-3 h-3" /> Edit Profile
                </button>
                <button onClick={() => handleToggleBlock(selectedCustomer.id)} className="flex-1 bg-card border border-neutral-200 hover:border-[#b2533e] text-neutral-700 hover:text-[#b2533e] py-2 text-[8px] font-bold uppercase tracking-widest cursor-pointer rounded-none flex items-center justify-center gap-1">
                  <Slash className="w-3 h-3" /> {selectedCustomer.status === "Blocked" ? "Unblock Account" : "Block Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Edit Customer Modal ─────────────────────────────────────── */}
      {editCustomer && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setEditCustomer(null)}>
          <div className="bg-card border-2 border-[#030213] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#030213] uppercase">Edit Customer Profile</span>
              <button onClick={() => setEditCustomer(null)} className="text-neutral-400 hover:text-[#030213] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Customer Name</label>
                <input required type="text" value={editCustomer.name} onChange={e => setEditCustomer({ ...editCustomer, name: e.target.value })} className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
              
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Email Address</label>
                <input required type="email" value={editCustomer.email} onChange={e => setEditCustomer({ ...editCustomer, email: e.target.value })} className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Phone Number</label>
                <input required type="text" value={editCustomer.phone} onChange={e => setEditCustomer({ ...editCustomer, phone: e.target.value })} className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Shipping Address</label>
                <textarea required rows={2} value={editCustomer.address} onChange={e => setEditCustomer({ ...editCustomer, address: e.target.value })} className="w-full bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditCustomer(null)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
                <button type="submit" className="bg-[#030213] text-white hover:bg-neutral-800 text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Bulk Send Campaign Email Modal ────────────────────────────── */}
      {campaignModal && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setCampaignModal(false)}>
          <div className="bg-card border-2 border-[#030213] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#030213] uppercase">Launch Email Campaign</span>
              <button onClick={() => setCampaignModal(false)} className="text-neutral-400 hover:text-[#030213] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendCampaign} className="space-y-3">
              <div className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
                Targeting: {selectedIds.length > 0 ? `${selectedIds.length} selected customers` : "All filtered listings"}
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Email Subject</label>
                <input required type="text" placeholder="e.g. SS26 Exclusive Private Drop Access" value={sendEmailText.subject} onChange={e => setSendEmailText({ ...sendEmailText, subject: e.target.value })} className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Email Body Description</label>
                <textarea required rows={4} placeholder="Write premium copy newsletter details..." value={sendEmailText.body} onChange={e => setSendEmailText({ ...sendEmailText, body: e.target.value })} className="w-full bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setCampaignModal(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
                <button type="submit" className="bg-[#030213] text-white hover:bg-neutral-800 text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Send Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
