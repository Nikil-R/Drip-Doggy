import { useState, useMemo, useRef, useEffect } from "react";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users,
  Package, Eye, MoreVertical, Clock, CheckCircle2, XCircle,
  Truck, ChevronRight, Plus, AlertTriangle, Tag, RefreshCw, MapPin, BarChart3, Layers,
  Download, X, Calendar
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const RS = "₹";

const kpiData = [
  { label: "Total Revenue", value: RS + "42,68,500", change: "+18.7%", trend: "up", subtitle: "Prev. " + RS + "35,92,000" },
  { label: "Total Orders", value: "1,842", change: "+14.4%", trend: "up", subtitle: "Prev. 1,610" },
  { label: "Avg. Order Value", value: RS + "2,318", change: "+6.2%", trend: "up", subtitle: "Prev. " + RS + "2,182" },
  { label: "Conversion Rate", value: "3.8%", change: "+0.4%", trend: "up", subtitle: "Prev. 3.4%" },
  { label: "Pending / Cancelled", value: "128 / 43", change: "-8.2%", trend: "down", subtitle: "Pending: 128 | Cancelled: 43" },
];

const weeklyRevenue = [
  { day: "Sun", revenue: 285000, orders: 42, returns: 3 },
  { day: "Mon", revenue: 342000, orders: 58, returns: 5 },
  { day: "Tue", revenue: 298000, orders: 51, returns: 2 },
  { day: "Wed", revenue: 485000, orders: 76, returns: 4 },
  { day: "Thu", revenue: 425000, orders: 68, returns: 6 },
  { day: "Fri", revenue: 512000, orders: 85, returns: 3 },
  { day: "Sat", revenue: 478000, orders: 79, returns: 7 },
];

const categorySales = [
  { name: "Outerwear", value: 35, color: "#8c6239" },
  { name: "Knitwear", value: 25, color: "#224870" },
  { name: "Tops", value: 20, color: "#717182" },
  { name: "Bottoms", value: 12, color: "#c4a77d" },
  { name: "Accessories", value: 8, color: "#d4d4d8" },
];

const sizeDistribution = [
  { size: "XS", stock: 45, sold: 120 },
  { size: "S", stock: 78, sold: 245 },
  { size: "M", stock: 112, sold: 380 },
  { size: "L", stock: 95, sold: 312 },
  { size: "XL", stock: 52, sold: 178 },
  { size: "XXL", stock: 28, sold: 89 },
];

const topSellingProducts = [
  { name: "Structured Canvas Jacket", sku: "#DD-STR-001", price: 5800, orders: 342, revenue: 1983600, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=120&auto=format&fit=crop", status: "In Stock" },
  { name: "Sartorial Trench Coat", sku: "#DD-SAR-001", price: 6900, orders: 287, revenue: 1980300, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=120&auto=format&fit=crop", status: "In Stock" },
  { name: "French Terry Hoodie", sku: "#DD-FTH-001", price: 3200, orders: 256, revenue: 819200, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=120&auto=format&fit=crop", status: "Low Stock" },
  { name: "Parachute Cargo Skirt", sku: "#DD-PCS-001", price: 3400, orders: 198, revenue: 673200, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=120&auto=format&fit=crop", status: "In Stock" },
  { name: "Boxy Minimalist Maxi", sku: "#DD-BMM-001", price: 4200, orders: 167, revenue: 701400, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=120&auto=format&fit=crop", status: "Out of Stock" },
];

const recentOrders = [
  { id: "#DD-6545", customer: "Ananya Sharma", product: "Structured Canvas Jacket", size: "M", amount: 5800, status: "Delivered", date: "22 Jun | 2:30 pm" },
  { id: "#DD-5412", customer: "Rahul Verma", product: "French Terry Hoodie", size: "L", amount: 3200, status: "Shipped", date: "22 Jun | 1:15 pm" },
  { id: "#DD-6622", customer: "Priya Kapoor", product: "Parachute Cargo Skirt", size: "S", amount: 3400, status: "Processing", date: "22 Jun | 11:45 am" },
  { id: "#DD-6462", customer: "Arjun Mehta", product: "Sartorial Trench Coat", size: "XL", amount: 6900, status: "Delivered", date: "21 Jun | 6:20 pm" },
  { id: "#DD-6710", customer: "Neha Gupta", product: "Boxy Minimalist Maxi", size: "M", amount: 4200, status: "Pending", date: "21 Jun | 4:50 pm" },
];

const citySales = [
  { city: "Mumbai", sales: 1245000, orders: 412, growth: "+22%", pct: "100%" },
  { city: "Delhi", sales: 985000, orders: 345, growth: "+18%", pct: "79%" },
  { city: "Bangalore", sales: 876000, orders: 298, growth: "+31%", pct: "70%" },
  { city: "Hyderabad", sales: 645000, orders: 212, growth: "+15%", pct: "52%" },
  { city: "Chennai", sales: 523000, orders: 178, growth: "+12%", pct: "42%" },
];

const collectionPerformance = [
  { name: "SS26 Women's Capsule", revenue: 1580000, items: 6, status: "Active" },
  { name: "Archive Collection", revenue: 985000, items: 4, status: "Active" },
  { name: "Signature Pieces", revenue: 1420000, items: 4, status: "Active" },
  { name: "FW25 Legacy", revenue: 2100000, items: 8, status: "Archived" },
];

const activeUsersData = [
  { time: "11 AM", users: 540 },
  { time: "12 PM", users: 620 },
  { time: "1 PM", users: 480 },
  { time: "2 PM", users: 710 },
  { time: "3 PM", users: 890 },
  { time: "Now", users: 847 },
];

const lowStockItems = [
  { name: "Sartorial Trench", size: "XS", stock: 2 },
  { name: "French Terry Hoodie", size: "XXL", stock: 3 },
  { name: "Structured Canvas", size: "XL", stock: 4 },
  { name: "Drape Rib Maxi", size: "S", stock: 1 },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-green-50 text-green-700 border-green-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-neutral-50 text-neutral-700 border-neutral-200",
    "In Stock": "bg-green-50 text-green-700 border-green-200",
    "Low Stock": "bg-amber-50 text-amber-700 border-amber-200",
    "Out of Stock": "bg-red-50 text-red-700 border-red-200",
    Active: "bg-green-50 text-green-700 border-green-200",
    Archived: "bg-neutral-100 text-neutral-500 border-neutral-200",
  };
  const icons: Record<string, React.ReactNode> = {
    Delivered: <CheckCircle2 className="w-2.5 h-2.5" />,
    Shipped: <Truck className="w-2.5 h-2.5" />,
    Processing: <Clock className="w-2.5 h-2.5" />,
    Pending: <Clock className="w-2.5 h-2.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-bold tracking-widest border uppercase ${styles[status] || "bg-neutral-50 text-neutral-700 border-neutral-200"}`}>
      {icons[status]}{status}
    </span>
  );
}

function ExportCSV() {
  const headers = ["Product,SKU,Orders,Revenue,Status"];
  const rows = topSellingProducts.map(p => `${p.name},"${p.sku}",${p.orders},${p.revenue},${p.status}`);
  const csv = [...headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dashboard-products-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function ExportOrdersCSV() {
  const headers = ["Order ID,Customer,Product,Size,Amount,Status,Date"];
  const rows = recentOrders.map(o => `${o.id},"${o.customer}","${o.product}",${o.size},${o.amount},${o.status},${o.date}`);
  const csv = [...headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dashboard-orders-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-neutral-300 shadow-lg px-3 py-2 text-[9px] font-sans uppercase font-bold tracking-wider rounded-sm">
      <p className="font-extrabold text-[#382d24] mb-1.5">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-[#615e56] leading-5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}:</span>
          <span className="text-[#382d24] font-bold">
            {entry.name === "Revenue" || entry.name === "AOV" 
              ? RS + Number(entry.value).toLocaleString() 
              : entry.name === "Active Users" 
                ? Number(entry.value).toLocaleString() 
                : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

import { useNavigate } from "react-router";

export function DashboardPage() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [comparisonMode, setComparisonMode] = useState("prev_week");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBulkDiscountModal, setShowBulkDiscountModal] = useState(false);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const [showComparisonDropdown, setShowComparisonDropdown] = useState(false);
  
  // Custom Calendar state (default to June 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // June

  const daysInMonth = useMemo(() => new Date(currentYear, currentMonth + 1, 0).getDate(), [currentYear, currentMonth]);
  const startDay = useMemo(() => new Date(currentYear, currentMonth, 1).getDay(), [currentYear, currentMonth]);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleDateClick = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      setDateRange({ start: dateStr, end: "" });
    } else {
      const start = new Date(dateRange.start);
      const clicked = new Date(dateStr);
      if (clicked < start) {
        setDateRange({ start: dateStr, end: dateRange.start });
      } else {
        setDateRange({ start: dateRange.start, end: dateStr });
      }
      setShowCustomCalendar(false);
    }
  };

  const getFormattedDateString = () => {
    if (!dateRange.start) return "Select Date Range";
    const startStr = new Date(dateRange.start).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    if (!dateRange.end) return `${startStr} - ...`;
    const endStr = new Date(dateRange.end).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    return `${startStr} - ${endStr}`;
  };

  const calendarRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCustomCalendar(false);
      }
      if (comparisonRef.current && !comparisonRef.current.contains(event.target as Node)) {
        setShowComparisonDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const dateRangeMultiplier = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return null;
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays / 7;
  }, [dateRange.start, dateRange.end]);

  const activeMultiplier = useMemo(() => {
    if (dateRangeMultiplier !== null) return dateRangeMultiplier;
    return selectedPeriod === "7d" ? 1 : selectedPeriod === "30d" ? 4.2 : 12.5;
  }, [selectedPeriod, dateRangeMultiplier]);

  const adjustedKPIData = useMemo(() => {
    const mult = activeMultiplier;
    const compLabel = comparisonMode === "prev_week" ? "vs Last Week" : "vs Last Month";
    const compMult = comparisonMode === "prev_week" ? 1.0 : 1.15;
    
    return kpiData.map(kpi => {
      if (kpi.label === "Total Revenue") {
        const val = Math.round(4268500 * mult);
        const prevVal = Math.round(3592000 * mult * compMult);
        return { 
          ...kpi, 
          value: "₹" + val.toLocaleString(), 
          change: `+${((val - prevVal) / prevVal * 100).toFixed(1)}%`,
          subtitle: `Prev. ₹${prevVal.toLocaleString()} (${compLabel})`
        };
      }
      if (kpi.label === "Total Orders") {
        const val = Math.round(1842 * mult);
        const prevVal = Math.round(1610 * mult * compMult);
        return { 
          ...kpi, 
          value: val.toLocaleString(), 
          change: `+${((val - prevVal) / prevVal * 100).toFixed(1)}%`,
          subtitle: `Prev. ${prevVal.toLocaleString()} (${compLabel})`
        };
      }
      if (kpi.label === "Avg. Order Value") {
        const val = Math.round(2318 * (1 + (mult - 1) * 0.03));
        const prevVal = Math.round(2182 * (1 + (mult - 1) * 0.03));
        return { 
          ...kpi, 
          value: "₹" + val.toLocaleString(),
          change: `+${((val - prevVal) / prevVal * 100).toFixed(1)}%`,
          subtitle: `Prev. ₹${prevVal.toLocaleString()} (${compLabel})`
        };
      }
      return kpi;
    });
  }, [activeMultiplier, comparisonMode]);

  const adjustedWeeklyRevenue = useMemo(() => {
    const mult = activeMultiplier;
    return weeklyRevenue.map(item => ({
      ...item,
      revenue: Math.round(item.revenue * (mult > 1 ? Math.sqrt(mult) : mult)),
      orders: Math.round(item.orders * (mult > 1 ? Math.sqrt(mult) : mult))
    }));
  }, [activeMultiplier]);

  const adjustedCategorySales = useMemo(() => {
    const shift = selectedPeriod === "7d" ? 0 : selectedPeriod === "30d" ? 2 : -3;
    return categorySales.map((item, idx) => ({
      ...item,
      value: Math.max(5, item.value + (idx % 2 === 0 ? shift : -shift))
    }));
  }, [selectedPeriod]);

  const adjustedSizeDistribution = useMemo(() => {
    const mult = activeMultiplier;
    return sizeDistribution.map(item => ({
      ...item,
      stock: Math.round(item.stock * (mult > 1 ? Math.sqrt(mult) : mult)),
      sold: Math.round(item.sold * (mult > 1 ? Math.sqrt(mult) : mult))
    }));
  }, [activeMultiplier]);

  return (
    <div className="space-y-8 font-sans">

      {/* ═══ Header ═══ */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2">
            DripDoggy Dashboard
            {isRefreshing && <RefreshCw className="h-4 w-4 animate-spin text-[#224870]" />}
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">Luxury Streetwear — Real-Time Analytics &amp; Operations</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Refetch/Reload */}
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 border border-neutral-200 text-neutral-500 hover:border-[#224870] hover:text-[#382d24] cursor-pointer bg-card disabled:opacity-50"
            title="Reload Data"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Period Selector */}
          <div className="flex items-center border border-neutral-200">
            {["7d", "30d", "90d"].map((p) => (
              <button key={p} onClick={() => { setSelectedPeriod(p); setDateRange({ start: "", end: "" }); }}
                className={`px-3 py-1.5 text-[9px] font-semibold tracking-widest border-none cursor-pointer uppercase ${selectedPeriod === p && !dateRange.start ? "bg-[#224870] text-white" : "bg-card text-neutral-500 hover:text-[#382d24]"}`}>
                {p === "7d" ? "7D" : p === "30d" ? "30D" : "90D"}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => { setShowCustomCalendar(!showCustomCalendar); setShowComparisonDropdown(false); }}
              className="flex items-center gap-2 border border-neutral-200/80 px-2.5 py-1.5 bg-card hover:border-[#224870] transition-colors rounded-sm text-[9px] font-bold text-[#382d24] uppercase tracking-wider cursor-pointer"
            >
              <Calendar className="h-3.5 w-3.5 text-[#615e56] shrink-0" />
              <span>{getFormattedDateString()}</span>
            </button>

            {showCustomCalendar && (
              <div className="absolute top-10 right-0 w-64 bg-card border border-neutral-300 z-30 shadow-2xl p-4 rounded-sm font-sans text-foreground text-[10px]">
                {/* Month/Year selector header */}
                <div className="flex justify-between items-center mb-3">
                  <button 
                    onClick={() => {
                      if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
                      else { setCurrentMonth(currentMonth - 1); }
                    }} 
                    className="p-1 hover:bg-neutral-250 bg-transparent border-none cursor-pointer text-[#382d24] font-bold text-[11px]"
                  >
                    &lt;
                  </button>
                  <span className="font-extrabold uppercase tracking-widest text-[#382d24]">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <button 
                    onClick={() => {
                      if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
                      else { setCurrentMonth(currentMonth + 1); }
                    }} 
                    className="p-1 hover:bg-neutral-250 bg-transparent border-none cursor-pointer text-[#382d24] font-bold text-[11px]"
                  >
                    &gt;
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-[#615e56] uppercase text-[8px] tracking-widest mb-1.5">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <span key={d}>{d}</span>)}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells before start of month */}
                  {Array.from({ length: startDay }).map((_, idx) => (
                    <div key={`empty-${idx}`} />
                  ))}
                  {/* Month days */}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
                    const formattedDay = String(dayNum).padStart(2, "0");
                    const cellDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
                    
                    const isSelected = dateRange.start === cellDateStr || dateRange.end === cellDateStr;
                    
                    const inRange = (() => {
                      if (!dateRange.start || !dateRange.end) return false;
                      const cellDate = new Date(cellDateStr);
                      return cellDate >= new Date(dateRange.start) && cellDate <= new Date(dateRange.end);
                    })();

                    return (
                      <button
                        key={dayNum}
                        onClick={() => handleDateClick(dayNum)}
                        className={`p-1.5 font-bold rounded-none text-center cursor-pointer text-[9px] transition-colors border-none ${
                          isSelected ? "bg-[#224870] text-white" :
                          inRange ? "bg-[#224870]/15 text-[#382d24]" :
                          "bg-transparent text-[#382d24] hover:bg-neutral-200/40"
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center border-t border-neutral-200/60 pt-3.5 mt-3.5">
                  <button 
                    onClick={() => { setDateRange({ start: "", end: "" }); setShowCustomCalendar(false); }}
                    className="text-[8px] font-bold text-red-700 hover:underline uppercase bg-transparent border-none cursor-pointer"
                  >
                    Clear Range
                  </button>
                  <button 
                    onClick={() => setShowCustomCalendar(false)}
                    className="text-[8px] font-bold text-[#382d24] hover:underline uppercase bg-transparent border-none cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Custom Comparison Period Toggle */}
          <div className="relative" ref={comparisonRef}>
            <button
              onClick={() => { setShowComparisonDropdown(!showComparisonDropdown); setShowCustomCalendar(false); }}
              className="flex items-center gap-1.5 border border-neutral-200/80 bg-card px-2.5 py-1.5 hover:border-[#224870] transition-colors rounded-sm text-[9px] font-bold text-[#382d24] uppercase tracking-wider cursor-pointer"
            >
              <span className="text-[9px] font-extrabold text-[#615e56] uppercase tracking-widest">VS:</span>
              <span>{comparisonMode === "prev_week" ? "Last Week" : "Last Month"}</span>
            </button>

            {showComparisonDropdown && (
              <div className="absolute top-10 right-0 w-32 bg-card border border-neutral-300 z-30 shadow-2xl p-1.5 rounded-sm font-sans uppercase text-[9px]">
                {[{ label: "Last Week", value: "prev_week" }, { label: "Last Month", value: "prev_month" }].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setComparisonMode(opt.value); setShowComparisonDropdown(false); }}
                    className={`w-full text-left p-2 cursor-pointer font-bold transition-all border-none ${
                      comparisonMode === opt.value ? "bg-[#224870]/10 text-[#382d24]" : "bg-transparent text-[#615e56] hover:text-[#382d24] hover:bg-neutral-250"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ 5 KPI Cards ═══ */}
      <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 transition-all duration-300 ${isRefreshing ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
        {adjustedKPIData.map((stat, idx) => (
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

      {/* ═══ Charts Row ═══ */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300 ${isRefreshing ? "opacity-40 pointer-events-none" : "opacity-100"}`}>

        {/* Revenue Area Chart */}
        <div className="lg:col-span-5 bg-card border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10.5px] font-bold tracking-[0.1em] text-[#382d24] uppercase">Revenue This Week</span>
            <div className="flex items-center gap-3 text-[9.5px] font-semibold text-neutral-400 uppercase">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#224870]" /> Revenue</span>
            </div>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adjustedWeeklyRevenue} margin={{ left: -15, right: 5, top: 5, bottom: 0 }}>
                <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#224870" stopOpacity={0.15} /><stop offset="95%" stopColor="#224870" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#747878", fontWeight: 400 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#747878", fontWeight: 400 }} tickFormatter={(v) => RS + (v / 1000).toFixed(0) + "k"} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#224870" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t border-neutral-100">
            {[{ label: "Total Rev", val: RS + (28.25 * activeMultiplier).toFixed(2) + "L" }, { label: "Orders", val: Math.round(459 * activeMultiplier).toString() }, { label: "Returns", val: Math.round(30 * activeMultiplier).toString() }, { label: "AOV", val: RS + Math.round(2318 * (1 + (activeMultiplier - 1) * 0.03)).toLocaleString() }].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-[9px] font-medium text-neutral-450 uppercase tracking-wider">{s.label}</p>
                <p className="text-[11.5px] font-bold text-[#382d24] mt-0.5">{s.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Donut Chart - Category Sales */}
        <div className="lg:col-span-3 bg-card border border-neutral-200/80 p-5">
          <span className="text-[10.5px] font-bold tracking-[0.1em] text-[#382d24] uppercase block mb-2">Sales by Category</span>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={adjustedCategorySales} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={2}>
                  {adjustedCategorySales.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 pt-2 border-t border-neutral-100">
            {adjustedCategorySales.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2" style={{ backgroundColor: c.color }} />
                <span className="text-[9px] font-medium text-neutral-500 uppercase">{c.name} {c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart - Size Distribution */}
        <div className="lg:col-span-4 bg-card border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10.5px] font-bold tracking-[0.1em] text-[#382d24] uppercase">Size Distribution</span>
            <span className="text-[9.5px] font-semibold text-neutral-400">Stock vs Sold</span>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adjustedSizeDistribution} margin={{ left: -10, right: 5, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                <XAxis dataKey="size" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#747878", fontWeight: 400 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#747878", fontWeight: 400 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="stock" name="In Stock" fill="#717182" barSize={12} />
                <Bar dataKey="sold" name="Sold" fill="#224870" barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-[9.5px] font-medium text-neutral-450 mt-2 pt-2 border-t border-neutral-100">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#717182]" /> In Stock</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#224870]" /> Sold</span>
            <span className="font-semibold text-[#382d24]">M is best-selling size</span>
          </div>
        </div>
      </div>

      {/* ═══ Low Stock Alert ═══ */}
      <div className="bg-red-50/60 border border-red-200/80 p-4 flex items-start gap-3 rounded-sm">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-[11px] font-bold text-red-800 uppercase tracking-widest">Low Stock Alert — {lowStockItems.length} items need restocking</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {lowStockItems.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-card border border-red-200/60 px-2 py-1 text-[9.5px] font-bold text-red-800 rounded-sm">
                <Package className="w-2.5 h-2.5" />
                {item.name} ({item.size}) — {item.stock} left
              </span>
            ))}
          </div>
        </div>
        <button className="text-[10px] font-bold tracking-widest text-red-800 hover:underline bg-transparent border-none cursor-pointer shrink-0 uppercase">Restock All</button>
      </div>

      {/* ═══ Top Selling & Recent Orders ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-7 bg-card border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-[900] tracking-[0.1em] text-[#382d24] uppercase">Top Selling Products</span>
            <button className="text-[9.5px] font-semibold tracking-widest uppercase text-[#224870] hover:underline bg-transparent border-none cursor-pointer">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left uppercase text-[9.5px] tracking-wider">
              <thead>
                <tr className="border-b border-neutral-200/60 text-[#615e56] text-[9.5px] tracking-[0.1em] font-bold">
                  <th className="pb-2.5 font-bold">Product</th>
                  <th className="pb-2.5 font-bold">Orders</th>
                  <th className="pb-2.5 font-bold">Revenue</th>
                  <th className="pb-2.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100/60">
                {topSellingProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-neutral-100 overflow-hidden shrink-0"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /></div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#382d24] text-[11px] truncate max-w-[160px]">{p.name}</p>
                          <span className="text-[9.5px] text-[#736e64] font-semibold">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 text-[#382d24] font-semibold">{p.orders}</td>
                    <td className="py-2.5 font-bold text-[#382d24]">{RS}{p.revenue.toLocaleString()}</td>
                    <td className="py-2.5"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 bg-card border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-[900] tracking-[0.1em] text-[#382d24] uppercase">Recent Orders</span>
            <button className="text-[9.5px] font-semibold tracking-widest uppercase text-[#224870] hover:underline bg-transparent border-none cursor-pointer">View All</button>
          </div>
          <div className="divide-y divide-neutral-200/60">
            {recentOrders.slice(0, 4).map((o, i) => (
              <div key={i} className="flex items-center gap-3 py-3 hover:bg-neutral-50/30 transition-all first:pt-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] font-bold text-[#382d24] uppercase truncate">{o.customer}</span>
                    <span className="text-[11.5px] font-bold text-[#382d24]">{RS}{o.amount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9.5px] text-[#524f46] font-bold uppercase">{o.product}</span>
                    <span className="text-neutral-300 mx-1">|</span>
                    <span className="text-[9.5px] text-[#615e56] font-semibold">Size {o.size}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[9.5px] text-[#736e64] font-semibold">{o.date}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ City Sales & Quick Actions ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-7 bg-card border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-[900] tracking-[0.1em] text-[#382d24] uppercase">Sales by City</span>
            <span className="text-[9.5px] font-semibold text-[#615e56]">Top 5 Indian Markets</span>
          </div>
          <div className="space-y-2.5">
            {citySales.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[10.5px] font-semibold text-[#382d24] uppercase tracking-wide mb-1">
                    <span>{c.city}</span>
                    <span className="text-green-600 text-[9.5px] font-bold">{RS}{c.sales.toLocaleString()} ({c.growth})</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100"><div className="h-full bg-[#224870]" style={{ width: c.pct }} /></div>
                  <span className="text-[9px] text-[#615e56] font-semibold mt-1 block">{c.orders} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4 h-full">
          <div className="bg-card border border-neutral-200/80 p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-[900] tracking-[0.1em] text-[#382d24] uppercase">Active Users Now</span>
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  <span className="text-[8px] font-bold text-green-600 uppercase tracking-widest">Live</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#382d24] mt-1">847</h3>
                <p className="text-[9.5px] text-[#615e56] font-semibold uppercase mt-0.5">+12% vs last hour</p>
              </div>
            </div>
            <div className="h-[75px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeUsersData} margin={{ left: -32, right: 0, top: 5, bottom: 0 }}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} interval={0} tick={{ fontSize: 8, fill: "#747878", fontWeight: 600 }} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="users" name="Active Users" fill="#8c6239" barSize={16}>
                    {activeUsersData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.time === "Now" ? "#224870" : "#8c6239"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-neutral-200/80 p-5 flex-1 flex flex-col justify-between">
            <span className="text-[13px] font-[900] tracking-[0.1em] text-[#382d24] uppercase block mb-3">Quick Actions</span>
            <div className="grid grid-cols-2 gap-2 flex-1 items-center mt-2">
              {[{ label: "New Product", icon: "Package", action: () => navigate("/admin/products/new") }, 
                { label: "New Collection", icon: "Layers", action: () => navigate("/admin/content/collections") }, 
                { label: "Bulk Discount", icon: "Tag", action: () => setShowBulkDiscountModal(true) }, 
                { label: "Export", icon: "BarChart3", action: () => ExportCSV() }].map((act, i) => {
                const Icon = { Package, Layers, Tag, BarChart3 }[act.icon] || Package;
                return (
                  <button key={i} onClick={act.action} className="border border-neutral-200/80 hover:border-[#224870] p-2 text-center transition-all bg-card hover:bg-neutral-50/50 cursor-pointer group h-full flex flex-col justify-center items-center">
                    <Icon className="w-4 h-4 mx-auto text-[#615e56] group-hover:text-[#382d24] mb-1 transition-colors" />
                    <span className="text-[9px] font-bold text-[#615e56] group-hover:text-[#382d24] uppercase tracking-widest block transition-colors">{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Bulk Discount Modal ═══ */}
      {showBulkDiscountModal && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setShowBulkDiscountModal(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Bulk Discount Authority</h3>
              <button onClick={() => setShowBulkDiscountModal(false)} className="text-[9px] font-bold text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer uppercase">Close</button>
            </div>
            
            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
              Apply a blanket discount rate across multiple product categories simultaneously.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as any;
              const discount = target.discount.value;
              const category = target.category.value;
              alert(`Successfully applied bulk discount of ${discount}% to category "${category}"!`);
              setShowBulkDiscountModal(false);
            }} className="space-y-3">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Target Category</label>
                <select name="category" className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#224870] rounded-none cursor-pointer">
                  <option value="All Categories">All Categories</option>
                  <option value="Outerwear">Outerwear</option>
                  <option value="Knitwear">Knitwear</option>
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                </select>
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Discount rate (%)</label>
                <input required type="number" name="discount" min="0" max="90" placeholder="e.g. 15" className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#224870] rounded-none" />
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Active Duration (Days)</label>
                <select name="duration" className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#224870] rounded-none cursor-pointer">
                  <option value="3">3 Days</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowBulkDiscountModal(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
                <button type="submit" className="bg-[#224870] text-white hover:bg-[#224870]/80 text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Apply Rate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
