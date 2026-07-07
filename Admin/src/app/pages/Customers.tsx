import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, MoreVertical, Phone, MapPin, Clock, X, Mail,
  Download, CheckCircle, ShoppingBag, Tag,
  TrendingUp, TrendingDown, Calendar, User, Heart, AlertTriangle, UserX
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


interface CartItem {
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  label: string;
  firstName: string;
  lastName: string;
  building: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  deliveryPhone: string;
}

interface CustomerOrder {
  id: string;
  date: string;
  amount: number;
  status: "Delivered" | "Shipped" | "Processing" | "Pending" | "Cancelled";
  payment: "Paid" | "Unpaid" | "Refunded";
}

interface Customer {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other" | "Unspecified";
  dob: string;
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
  cartItems?: CartItem[];
  addresses?: ShippingAddress[];
  recentOrders?: CustomerOrder[];
  abandonedCart?: string;
  logins?: string[];
}

const mockCustomersData: Customer[] = [
  {
    id: "#DD-C001", name: "Ananya Sharma", firstName: "Ananya", lastName: "Sharma",
    email: "ananya.sharma@gmail.com", phone: "+91 98765 43210", gender: "Female", dob: "1998-04-15",
    orders: 28, spent: 62150, avgOrder: 2220, status: "Active",
    address: "42, Bandra West, Mumbai, Maharashtra", registered: "2025-01-12", lastPurchase: "2026-05-15",
    favCategory: "Outerwear", lastProduct: "Sartorial Trench Coat",
    notes: "Prefers minimal packaging.",
    wishlist: ["Structured Canvas Jacket", "French Terry Hoodie"],
    cartItems: [
      {
        name: "Signature Silk Blouse",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop",
        color: "Midnight Black",
        size: "M",
        quantity: 1,
        price: 1699
      }
    ],
    addresses: [
      {
        label: "Home",
        firstName: "Ananya",
        lastName: "Sharma",
        building: "Apt 4B, Sea Breeze Apartments",
        street: "Carter Road",
        area: "Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        deliveryPhone: "+91 99999 88888"
      },
      {
        label: "Office",
        firstName: "Ananya",
        lastName: "Sharma",
        building: "5th Floor, Maker Chambers VI",
        street: "Nariman Point",
        area: "Colaba",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400021",
        deliveryPhone: "+91 98888 77777"
      }
    ],
    recentOrders: [
      { id: "#DD-6545", date: "2026-06-22", amount: 3450, status: "Delivered", payment: "Paid" },
      { id: "#DD-6210", date: "2026-05-15", amount: 1699, status: "Delivered", payment: "Paid" }
    ],
    logins: ["2026-06-22 14:30 - Mumbai, IN", "2026-06-20 11:15 - Mumbai, IN"]
  },
  {
    id: "#DD-C002", name: "Rahul Verma", firstName: "Rahul", lastName: "Verma",
    email: "rahul.verma@outlook.com", phone: "+91 87654 32109", gender: "Male", dob: "1995-09-22",
    orders: 15, spent: 28400, avgOrder: 1893, status: "Active",
    address: "78, Indiranagar, Bangalore, Karnataka", registered: "2025-03-03", lastPurchase: "2026-05-12",
    favCategory: "Knitwear", lastProduct: "Cashmere Blend Crew",
    wishlist: ["Merino Wool Cardigan"],
    cartItems: [],
    addresses: [
      {
        label: "Home",
        firstName: "Rahul",
        lastName: "Verma",
        building: "Flat 202, Royal Residency",
        street: "12th Main Road",
        area: "Indiranagar",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560038",
        deliveryPhone: "+91 98765 00001"
      }
    ],
    recentOrders: [
      { id: "#DD-6120", date: "2026-05-12", amount: 1893, status: "Delivered", payment: "Paid" }
    ],
    logins: ["2026-06-21 09:45 - Bangalore, IN"]
  },
  {
    id: "#DD-C003", name: "Priya Kapoor", firstName: "Priya", lastName: "Kapoor",
    email: "priya.kapoor@yahoo.com", phone: "+91 76543 21098", gender: "Female", dob: "1997-12-05",
    orders: 42, spent: 98500, avgOrder: 2345, status: "Active",
    address: "15, GK II, New Delhi, Delhi", registered: "2024-11-20", lastPurchase: "2026-05-18",
    favCategory: "Tops", lastProduct: "Signature Silk Blouse",
    notes: "Requires fast shipping options.",
    wishlist: ["Sartorial Trench Coat", "Tailored Linen Trousers"],
    cartItems: [
      {
        name: "French Terry Hoodie",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop",
        color: "Sage Green",
        size: "L",
        quantity: 2,
        price: 2450
      }
    ],
    addresses: [
      {
        label: "Home",
        firstName: "Priya",
        lastName: "Kapoor",
        building: "House 15, GK II",
        street: "Outer Ring Road",
        area: "Greater Kailash",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110048",
        deliveryPhone: "+91 77777 66666"
      },
      {
        label: "Studio (Others)",
        firstName: "Priya",
        lastName: "Kapoor",
        building: "Studio 301, Creative Lofts",
        street: "Okhla Phase III",
        area: "Okhla",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110020",
        deliveryPhone: "+91 88888 55555"
      }
    ],
    recentOrders: [
      { id: "#DD-6412", date: "2026-05-18", amount: 2450, status: "Delivered", payment: "Paid" }
    ],
    logins: ["2026-06-22 16:10 - Delhi, IN", "2026-06-18 10:20 - Delhi, IN"]
  },
  {
    id: "#DD-C004", name: "Arjun Mehta", firstName: "Arjun", lastName: "Mehta",
    email: "arjun.mehta@gmail.com", phone: "+91 65432 10987", gender: "Male", dob: "1992-07-30",
    orders: 8, spent: 12450, avgOrder: 1556, status: "Active",
    address: "33, Jubilee Hills, Hyderabad, Telangana", registered: "2025-04-10", lastPurchase: "2026-05-08",
    favCategory: "Bottoms", lastProduct: "Pleated Wool Trousers", wishlist: [], cartItems: [],
    addresses: [
      {
        label: "Home",
        firstName: "Arjun",
        lastName: "Mehta",
        building: "Villa 33, Jubilee Hills",
        street: "Road No. 10",
        area: "Jubilee Hills",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500033",
        deliveryPhone: "+91 95555 44444"
      }
    ],
    recentOrders: []
  },
  {
    id: "#DD-C005", name: "Neha Gupta", firstName: "Neha", lastName: "Gupta",
    email: "neha.gupta@rediffmail.com", phone: "+91 54321 09876", gender: "Female", dob: "2000-02-18",
    orders: 3, spent: 4890, avgOrder: 1630, status: "Active",
    address: "55, Anna Nagar, Chennai, Tamil Nadu", registered: "2026-05-01", lastPurchase: "2026-05-05",
    favCategory: "Dresses", lastProduct: "Linen Midi Dress",
    wishlist: ["Structured Canvas Jacket"], cartItems: [],
    addresses: [
      {
        label: "Home",
        firstName: "Neha",
        lastName: "Gupta",
        building: "55, Anna Nagar",
        street: "2nd Main Road",
        area: "Anna Nagar",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600040",
        deliveryPhone: "+91 94444 33333"
      }
    ],
    recentOrders: []
  },
  {
    id: "#DD-C006", name: "Vikram Singh", firstName: "Vikram", lastName: "Singh",
    email: "vikram.singh@gmail.com", phone: "+91 43210 98765", gender: "Male", dob: "1994-11-12",
    orders: 22, spent: 45200, avgOrder: 2055, status: "Active",
    address: "89, Koregaon Park, Pune, Maharashtra", registered: "2025-02-05", lastPurchase: "2026-05-14",
    favCategory: "Outerwear", lastProduct: "Structured Canvas Jacket", cartItems: [],
    addresses: [
      {
        label: "Home",
        firstName: "Vikram",
        lastName: "Singh",
        building: "Apt 89, Koregaon Heights",
        street: "North Main Road",
        area: "Koregaon Park",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
        deliveryPhone: "+91 93333 22222"
      }
    ],
    recentOrders: []
  },
  {
    id: "#DD-C007", name: "Ishita Patel", firstName: "Ishita", lastName: "Patel",
    email: "ishita.patel@proton.me", phone: "+91 32109 87654", gender: "Female", dob: "1999-08-25",
    orders: 0, spent: 0, avgOrder: 0, status: "Inactive",
    address: "120, Navrangpura, Ahmedabad, Gujarat", registered: "2026-04-28",
    lastPurchase: "—", favCategory: "—", lastProduct: "—", cartItems: [],
    addresses: [],
    recentOrders: []
  },
  {
    id: "#DD-C008", name: "Aditya Joshi", firstName: "Aditya", lastName: "Joshi",
    email: "aditya.joshi@icloud.com", phone: "+91 21098 76543", gender: "Male", dob: "1996-03-08",
    orders: 35, spent: 73800, avgOrder: 2109, status: "Active",
    address: "7, Salt Lake, Kolkata, West Bengal", registered: "2024-10-10", lastPurchase: "2026-05-19",
    favCategory: "Knitwear", lastProduct: "Merino Wool Cardigan", cartItems: [],
    addresses: [
      {
        label: "Home",
        firstName: "Aditya",
        lastName: "Joshi",
        building: "Block A, Flat 7",
        street: "Salt Lake Sector II",
        area: "Salt Lake",
        city: "Kolkata",
        state: "West Bengal",
        pincode: "700091",
        deliveryPhone: "+91 91111 22222"
      }
    ],
    recentOrders: []
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
    if (dateRange.start) list = list.filter(c => c.registered >= dateRange.start);
    if (dateRange.end) list = list.filter(c => c.registered <= dateRange.end);
    return list;
  }, [customers, searchQuery, activeTab, dateRange]);

  const handleToggleBlock = (id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "Blocked" ? "Active" : "Blocked" } : c));
  };



  const tabs = [
    { id: "all",      label: "All",      count: customers.length },
    { id: "active",   label: "Active",   count: customers.filter(c => c.status === "Active").length },
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

          {/* Search & Export */}
          <div className="flex items-center gap-3">
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
            <button
              onClick={() => {
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
              }}
              className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer flex items-center gap-1.5 transition-all shrink-0 rounded-full border-none"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200/80 bg-background/60 text-[9.5px] text-[#615e56] font-bold tracking-[0.12em] uppercase">
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Registered</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Cart Items</th>
                <th className="p-4">Wishlist</th>
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
                        <p className="font-bold text-[11.5px] text-[#382d24]">{c.name}</p>
                        <span className="text-[9.5px] text-[#615e56] font-bold block mt-0.5">{c.email}</span>
                        <span className="text-[9px] font-mono text-[#224870] font-black block mt-0.5">{c.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[9.5px] text-[#615e56] font-semibold font-mono">{c.phone}</td>
                  <td className="p-4 text-[9.5px] text-[#736e64] font-semibold">{c.registered}</td>
                  <td className="p-4 font-black text-[11px] text-[#382d24]">{c.orders}</td>
                  <td className="p-4 text-[10px] font-semibold text-[#615e56]">
                    {c.cartItems && c.cartItems.length > 0 ? `${c.cartItems.length} item${c.cartItems.length > 1 ? 's' : ''}` : "—"}
                  </td>
                  <td className="p-4 text-[10px] font-semibold text-[#615e56]">
                    {c.wishlist && c.wishlist.length > 0 ? `${c.wishlist.length} item${c.wishlist.length > 1 ? 's' : ''}` : "—"}
                  </td>
                  <td className="p-4"><StatusBadge status={c.status} /></td>
                  <td className="p-4" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleToggleBlock(c.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 bg-transparent border-none cursor-pointer rounded-full transition-all"
                        title={c.status === "Blocked" ? "Unblock" : "Block Customer"}
                      >
                        <UserX className="w-3.5 h-3.5" />
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
                  <span className="text-[10px] font-black tracking-wider text-[#382d24]/60 uppercase">Customer Profile</span>
                  <h2 className="text-[17px] font-[950] text-[#382d24] uppercase tracking-widest mt-0.5">{selectedCustomer.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <StatusBadge status={selectedCustomer.status} />
                    <span className="text-[10px] font-mono text-[#224870] font-black">{selectedCustomer.id}</span>
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

              {/* 2-col layout to balance heights and prevent blank spaces */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Personal Onboarding Profile + Purchase Summary */}
                <div className="space-y-6">
                  {/* Onboarding Profile Card */}
                  <div>
                  <span className="text-[10.5px] font-[950] tracking-wider text-[#382d24] uppercase block mb-2">Onboarding Profile</span>
                  <div className="border border-neutral-200 p-4 space-y-3 bg-background/50 rounded-sm text-[10px] font-bold text-[#615e56]">
                    <div className="flex justify-between items-center pb-1.5 border-b border-neutral-100">
                      <span className="text-[#615e56] uppercase tracking-wider text-[9px] font-bold">Customer ID</span>
                      <span className="text-[#382d24] font-black text-[10.5px]">{selectedCustomer.id}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1.5 border-b border-neutral-100">
                      <span className="text-[#615e56] uppercase tracking-wider text-[9px] font-bold">First Name</span>
                      <span className="text-[#382d24] font-extrabold text-[10.5px]">{selectedCustomer.firstName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1.5 border-b border-neutral-100">
                      <span className="text-[#615e56] uppercase tracking-wider text-[9px] font-bold">Last Name</span>
                      <span className="text-[#382d24] font-extrabold text-[10.5px]">{selectedCustomer.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1.5 border-b border-neutral-100">
                      <span className="text-[#615e56] uppercase tracking-wider text-[9px] font-bold">Gender</span>
                      <span className="text-[#382d24] font-extrabold text-[10.5px]">{selectedCustomer.gender}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1.5 border-b border-neutral-100">
                      <span className="text-[#615e56] uppercase tracking-wider text-[9px] font-bold">Date of Birth</span>
                      <span className="text-[#382d24] font-extrabold text-[10.5px]">{selectedCustomer.dob}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1.5 border-b border-neutral-100">
                      <span className="text-[#615e56] uppercase tracking-wider text-[9px] font-bold">Email</span>
                      <span className="text-[#224870] font-extrabold text-[10.5px] lowercase truncate select-all">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#615e56] uppercase tracking-wider text-[9px] font-bold">Phone</span>
                      <span className="text-[#382d24] font-extrabold text-[10.5px] select-all">{selectedCustomer.phone}</span>
                    </div>
                  </div>
                  </div>

                  {/* Purchase Summary Card */}
                  <div>
                    <span className="text-[10.5px] font-[950] tracking-wider text-[#382d24] uppercase block mb-2">Purchase Summary</span>
                    <div className="border border-neutral-200 p-4 space-y-3 bg-background/50 rounded-sm text-[10px] font-bold text-[#615e56]">
                      <div className="flex justify-between items-center pb-1.5 border-b border-neutral-100">
                        <span className="text-[#615e56] uppercase tracking-wider text-[9px] font-bold">Total Orders</span>
                        <span className="font-black text-[12.5px] text-[#382d24]">{selectedCustomer.orders}</span>
                      </div>
                      <div className="flex justify-between items-center pb-1.5 border-b border-neutral-100">
                        <span className="text-[#615e56] uppercase tracking-wider text-[9px] font-bold">Last Purchase</span>
                        <span className="font-extrabold text-[10.5px] text-[#382d24]">{selectedCustomer.lastPurchase}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#615e56] uppercase tracking-wider text-[9px] font-bold">Date Joined</span>
                        <span className="font-extrabold text-[10.5px] text-[#382d24]">{selectedCustomer.registered}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Address Module List */}
                <div>
                  <span className="text-[10.5px] font-[950] tracking-wider text-[#382d24] uppercase block mb-2">Shipping Addresses</span>
                  <div className="space-y-4">
                    {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                      selectedCustomer.addresses.map((addr, idx) => (
                        <div key={idx} className="border border-neutral-200 p-4 bg-background/50 rounded-sm space-y-2">
                          <div className="flex justify-between items-center pb-1.5 border-b border-neutral-100">
                            <span className="bg-[#224870]/10 text-[#224870] px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-widest rounded-sm">
                              {addr.label}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#615e56] font-semibold space-y-1">
                            <p className="text-[#382d24] font-black uppercase tracking-wide">
                              {addr.firstName} {addr.lastName}
                            </p>
                            <p className="uppercase">{addr.building}</p>
                            <p className="uppercase">{addr.street}</p>
                            <p className="uppercase">{addr.area}</p>
                            <p className="uppercase font-bold text-[#382d24]">
                              {addr.city}, {addr.state} — {addr.pincode}
                            </p>
                            {addr.deliveryPhone && (
                              <div className="pt-1.5 border-t border-neutral-100/50 flex items-center gap-1.5 text-neutral-400 font-bold text-[8.5px]">
                                <span>Alternative Contact:</span>
                                <span className="text-[#224870] select-all">{addr.deliveryPhone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="border border-neutral-200 p-6 text-center text-[9px] font-bold text-neutral-400 uppercase tracking-wider bg-background/10 rounded-sm">
                        No saved addresses found
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Order History */}
              <div>
                <span className="text-[10.5px] font-[950] tracking-wider text-[#382d24] uppercase block mb-2">
                  Recent Orders History
                </span>
                {selectedCustomer.recentOrders && selectedCustomer.recentOrders.length > 0 ? (
                  <div className="border border-neutral-200 rounded-sm overflow-hidden bg-background/30 text-[10px]">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-neutral-200 bg-background/50 text-[8.5px] text-[#615e56] font-bold tracking-widest uppercase">
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Delivery Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {selectedCustomer.recentOrders.map((ord, idx) => (
                          <tr key={idx} className="text-[#382d24] font-semibold">
                            <td className="p-3 font-mono font-black text-[#224870]">{ord.id}</td>
                            <td className="p-3">{ord.date}</td>
                            <td className="p-3 font-black">{RS}{ord.amount.toLocaleString("en-IN")}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                                ord.payment === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {ord.payment}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                                ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                              }`}>
                                {ord.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="border border-neutral-200 p-4 text-center text-[9px] font-bold text-neutral-400 uppercase tracking-wider bg-background/10 rounded-sm">
                    No orders placed yet
                  </div>
                )}
              </div>

              {/* Shopping Cart List */}
              <div>
                <span className="text-[10.5px] font-[950] tracking-wider text-[#382d24] uppercase block mb-2">
                  Shopping Cart Items
                </span>
                {selectedCustomer.cartItems && selectedCustomer.cartItems.length > 0 ? (
                  <div className="border border-neutral-200 rounded-sm overflow-hidden bg-background/30">
                    {selectedCustomer.cartItems.map((item, index) => (
                      <div key={index} className="p-3.5 flex items-center justify-between border-b border-neutral-200 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover border border-neutral-200 rounded-sm" />
                          <div>
                            <p className="text-[10px] font-black text-[#382d24] uppercase tracking-wide">{item.name}</p>
                            <div className="flex gap-2 text-[8px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">
                              <span>Color: {item.color}</span>
                              <span>•</span>
                              <span>Size: {item.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10.5px] font-black text-[#382d24]">{RS}{item.price.toLocaleString("en-IN")}</p>
                          <p className="text-[8.5px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-neutral-200 p-4 text-center text-[9px] font-bold text-neutral-400 uppercase tracking-wider bg-background/10 rounded-sm">
                    No items in cart
                  </div>
                )}
              </div>

              {/* Wishlist List */}
              <div>
                <span className="text-[10.5px] font-[950] tracking-wider text-[#382d24] uppercase block mb-2">
                  Wishlist Styles
                </span>
                {selectedCustomer.wishlist && selectedCustomer.wishlist.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.wishlist.map(w => (
                      <span key={w} className="bg-[#224870]/8 border border-[#224870]/20 text-[#224870] px-3 py-1.5 text-[8.5px] font-black uppercase tracking-wider rounded-sm">
                        {w}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="border border-neutral-200 p-4 text-center text-[9px] font-bold text-neutral-400 uppercase tracking-wider bg-background/10 rounded-sm">
                    No items in wishlist
                  </div>
                )}
              </div>

              {/* Customer Actions */}
              <div>
                <span className="text-[10.5px] font-[950] tracking-wider text-[#382d24] uppercase block mb-2">Customer Actions</span>
                <button
                  onClick={() => handleToggleBlock(selectedCustomer.id)}
                  className="w-full bg-card border border-neutral-200 hover:border-red-500 hover:text-red-500 text-neutral-600 py-2.5 text-[9px] font-bold uppercase tracking-widest cursor-pointer rounded-full flex items-center justify-center gap-2 transition-all"
                >
                  <UserX className="w-3.5 h-3.5" />
                  {selectedCustomer.status === "Blocked" ? "Unblock Account" : "Block Account"}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-neutral-200 flex items-center justify-end bg-card sticky bottom-0">
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="border border-neutral-300 hover:border-[#224870] hover:text-[#224870] text-[#382d24] text-[10px] font-extrabold tracking-widest px-6 py-2.5 uppercase bg-transparent cursor-pointer rounded-full transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
