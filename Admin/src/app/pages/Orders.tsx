import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Clock, CheckCircle2, XCircle, Truck,
  ChevronLeft, ChevronRight, Download, User, MapPin, X,
  FileText, Mail, Phone, TrendingUp, TrendingDown, DollarSign, ShoppingCart, AlertCircle, Calendar
} from "lucide-react";

const RS = "₹";

interface OrderItem {
  name: string;
  sku: string;
  size: string;
  qty: number;
  price: number;
  image: string;
}

interface Order {
  no: number;
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  payment: "Paid" | "Unpaid" | "Refunded";
  status: "Delivered" | "Shipped" | "Processing" | "Pending" | "Cancelled";
  delivery: string;
  items: OrderItem[];
  trackingNumber?: string;
  notes?: string;
}

const initialOrders: Order[] = [
  {
    no: 1,
    id: "#DD-6545",
    customer: "Ananya Sharma",
    email: "ananya.s@gmail.com",
    phone: "+91 98765 43210",
    date: "2026-06-22",
    payment: "Paid",
    status: "Delivered",
    delivery: "Mumbai, MH",
    trackingNumber: "DEL-847294",
    notes: "Signature packaging requested.",
    items: [
      { name: "Structured Canvas Jacket", sku: "DD-STR-001", size: "M", qty: 1, price: 5800, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=120&auto=format&fit=crop" },
      { name: "French Terry Hoodie", sku: "DD-FTH-001", size: "L", qty: 2, price: 3200, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=120&auto=format&fit=crop" }
    ]
  },
  {
    no: 2,
    id: "#DD-5412",
    customer: "Rahul Verma",
    email: "rahul.v@yahoo.com",
    phone: "+91 99887 66554",
    date: "2026-06-22",
    payment: "Paid",
    status: "Shipped",
    delivery: "Delhi, DL",
    trackingNumber: "BD-920485",
    notes: "",
    items: [
      { name: "French Terry Hoodie", sku: "DD-FTH-001", size: "L", qty: 1, price: 6400, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=120&auto=format&fit=crop" }
    ]
  },
  {
    no: 3,
    id: "#DD-6622",
    customer: "Priya Kapoor",
    email: "priya.k@outlook.com",
    phone: "+91 77665 44332",
    date: "2026-06-22",
    payment: "Paid",
    status: "Processing",
    delivery: "Bangalore, KA",
    items: [
      { name: "Parachute Cargo Skirt", sku: "DD-PCS-001", size: "S", qty: 1, price: 3400, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=120&auto=format&fit=crop" }
    ]
  },
  {
    no: 4,
    id: "#DD-6462",
    customer: "Arjun Mehta",
    email: "arjun.mehta@gmail.com",
    phone: "+91 88776 55443",
    date: "2026-06-21",
    payment: "Paid",
    status: "Delivered",
    delivery: "Hyderabad, TS",
    trackingNumber: "XP-304928",
    items: [
      { name: "Sartorial Trench Coat", sku: "DD-SAR-001", size: "XL", qty: 1, price: 6900, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=120&auto=format&fit=crop" },
      { name: "Ribbed Panel Dress", sku: "DD-RPD-001", size: "M", qty: 1, price: 3900, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=120&auto=format&fit=crop" }
    ]
  },
  {
    no: 5,
    id: "#DD-6710",
    customer: "Neha Gupta",
    email: "neha.gupta@gmail.com",
    phone: "+91 99008 87766",
    date: "2026-06-21",
    payment: "Unpaid",
    status: "Pending",
    delivery: "Chennai, TN",
    items: [
      { name: "Boxy Minimalist Maxi", sku: "DD-BMM-001", size: "M", qty: 1, price: 4200, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=120&auto=format&fit=crop" }
    ]
  },
  {
    no: 6,
    id: "#DD-6821",
    customer: "Kabir Singh",
    email: "kabir.singh@gmail.com",
    phone: "+91 98888 77777",
    date: "2026-06-20",
    payment: "Paid",
    status: "Delivered",
    delivery: "Kolkata, WB",
    items: [
      { name: "Structured Canvas Jacket", sku: "DD-STR-001", size: "L", qty: 1, price: 5800, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=120&auto=format&fit=crop" }
    ]
  },
  {
    no: 7,
    id: "#DD-6912",
    customer: "Ishaan Khatter",
    email: "ishaan@khatter.me",
    phone: "+91 97766 55441",
    date: "2026-06-19",
    payment: "Paid",
    status: "Cancelled",
    delivery: "Pune, MH",
    notes: "Customer cancelled prior to shipping.",
    items: [
      { name: "French Terry Hoodie", sku: "DD-FTH-001", size: "M", qty: 1, price: 3200, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=120&auto=format&fit=crop" }
    ]
  }
];

function PaymentBadge({ val }: { val: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase">
      <span className={`w-2 h-2 rounded-full ${val === "Paid" ? "bg-green-500" : val === "Refunded" ? "bg-neutral-400" : "bg-red-500"}`} />
      <span className={val === "Paid" ? "text-green-700" : val === "Refunded" ? "text-neutral-500" : "text-red-500"}>{val}</span>
    </span>
  );
}

function StatusBadge({ val }: { val: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-green-50 text-green-700 border-green-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-neutral-50 text-neutral-700 border-neutral-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  const icons: Record<string, React.ReactNode> = {
    Delivered: <CheckCircle2 className="w-3.5 h-3.5" />,
    Shipped: <Truck className="w-3 h-3" />,
    Processing: <Clock className="w-3 h-3" />,
    Pending: <Clock className="w-3 h-3" />,
    Cancelled: <XCircle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9.5px] font-bold tracking-wider border uppercase rounded-full ${styles[val] || "bg-neutral-50 text-neutral-700 border-neutral-200"}`}>
      {icons[val]}{val}
    </span>
  );
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [panelTracking, setPanelTracking] = useState("");
  const [panelNotes, setPanelNotes] = useState("");

  // Dashboard-style calendar
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(5); // June
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
    setCurrentPage(1);
  };

  const getDateLabel = () => {
    if (!dateRange.start) return "Select Date Range";
    const s = new Date(dateRange.start).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    if (!dateRange.end) return `${s} - ...`;
    const e = new Date(dateRange.end).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    return `${s} – ${e}`;
  };

  const ITEMS_PER_PAGE = 5;

  const getOrderTotal = (order: Order) =>
    order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const getOrderQty = (order: Order) =>
    order.items.reduce((sum, item) => sum + item.qty, 0);

  const activeOrderDetails = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  const handleOpenModal = (order: Order) => {
    setSelectedOrderId(order.id);
    setPanelTracking(order.trackingNumber || "");
    setPanelNotes(order.notes || "");
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (activeTab === "Completed" && o.status !== "Delivered") return false;
      if (activeTab === "Processing" && o.status !== "Processing" && o.status !== "Shipped") return false;
      if (activeTab === "Canceled" && o.status !== "Cancelled") return false;
      if (activeTab === "Pending" && o.status !== "Pending") return false;
      if (dateRange.start && o.date < dateRange.start) return false;
      if (dateRange.end && o.date > dateRange.end) return false;
      const q = searchQuery.toLowerCase();
      const matchProduct = o.items.some((item) => item.name.toLowerCase().includes(q));
      return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || matchProduct;
    });
  }, [orders, activeTab, searchQuery, dateRange]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;

  const stats = useMemo(() => {
    const all = orders;
    const filtered = filteredOrders;
    return {
      total: filtered.reduce((sum, o) => sum + getOrderTotal(o), 0),
      allTimeTotal: all.reduce((sum, o) => sum + getOrderTotal(o), 0),
      delivered: filtered.filter((o) => o.status === "Delivered").length,
      processing: filtered.filter((o) => o.status === "Processing" || o.status === "Shipped").length,
      pending: filtered.filter((o) => o.status === "Pending").length,
      cancelled: filtered.filter((o) => o.status === "Cancelled").length,
      totalItems: filtered.reduce((sum, o) => sum + getOrderQty(o), 0),
      avgOrder: filtered.length > 0 ? Math.round(filtered.reduce((sum, o) => sum + getOrderTotal(o), 0) / filtered.length) : 0,
    };
  }, [filteredOrders, orders]);

  const handleUpdateStatus = (status: Order["status"]) => {
    if (!selectedOrderId) return;
    setOrders((prev) => prev.map((o) => (o.id === selectedOrderId ? { ...o, status } : o)));
  };

  const handleRefundOrder = () => {
    if (!selectedOrderId) return;
    if (confirm("Initiate return and refund process? This updates payment status to Refunded.")) {
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrderId ? { ...o, payment: "Refunded", status: "Cancelled" } : o))
      );
    }
  };

  const handleSaveDetails = () => {
    if (!selectedOrderId) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrderId ? { ...o, trackingNumber: panelTracking, notes: panelNotes } : o))
    );
    setSelectedOrderId(null);
  };

  const handleExportCSV = () => {
    const exportList = filteredOrders;
    const headers = ["Order ID,Customer,Email,Phone,Date,Payment,Status,Total Price,Items Count"];
    const rows = exportList.map(
      (o) => `"${o.id}","${o.customer}","${o.email}","${o.phone}",${o.date},${o.payment},${o.status},${getOrderTotal(o)},${getOrderQty(o)}`
    );
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const itemRows = order.items
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; font-family: monospace; font-size: 11px;">${item.name} (${item.sku})</td>
        <td style="padding: 10px 0; text-align: center; font-size: 11px;">${item.size}</td>
        <td style="padding: 10px 0; text-align: center; font-size: 11px;">${item.qty}</td>
        <td style="padding: 10px 0; text-align: right; font-size: 11px;">₹${item.price.toLocaleString()}</td>
        <td style="padding: 10px 0; text-align: right; font-size: 11px; font-weight: bold;">₹${(item.price * item.qty).toLocaleString()}</td>
      </tr>
    `
      )
      .join("");
    printWindow.document.write(`
      <html><head><title>Invoice - ${order.id}</title>
      <style>
        body { font-family: sans-serif; color: #382d24; padding: 40px; background-color: #faf8f5; }
        .header { border-bottom: 2px solid #224870; padding-bottom: 20px; display: flex; justify-content: space-between; }
        .meta { margin: 20px 0; display: flex; justify-content: space-between; font-size: 11px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        th { text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; border-bottom: 1px solid #224870; padding-bottom: 10px; }
        .total-box { margin-top: 30px; text-align: right; border-top: 2px solid #224870; padding-top: 15px; font-size: 14px; font-weight: bold; }
      </style></head><body>
      <div class="header">
        <div><h1 style="margin: 0; font-size: 20px; letter-spacing: 0.2em;">DRIP DOGGY</h1>
        <p style="margin: 5px 0 0 0; font-size: 9px; color: #717182;">STREETWEAR EDITORIAL ADMIN PANEL</p></div>
        <div style="text-align: right;"><h2 style="margin: 0; font-size: 14px;">INVOICE</h2>
        <p style="margin: 5px 0 0 0; font-size: 10px; font-weight: bold; font-family: monospace;">${order.id}</p></div>
      </div>
      <div class="meta">
        <div><strong>Customer details:</strong><br/>${order.customer}<br/>${order.email}<br/>${order.phone}</div>
        <div style="text-align: right;"><strong>Delivery destination:</strong><br/>${order.delivery}<br/>Date Ordered: ${order.date}<br/>Status: ${order.status}</div>
      </div>
      <table><thead><tr>
        <th style="text-align: left;">Item Description</th><th>Size</th><th>Qty</th><th style="text-align: right;">Unit Price</th><th style="text-align: right;">Amount</th>
      </tr></thead><tbody>${itemRows}</tbody></table>
      <div class="total-box">TOTAL AMOUNT: ₹${getOrderTotal(order).toLocaleString()}</div>
      <p style="margin-top: 60px; font-size: 8px; text-align: center; color: #717182; text-transform: uppercase; letter-spacing: 0.15em;">Thank you for shopping with Drip Doggy. Verified Admin Invoice.</p>
      <script>window.onload = function() { window.print(); }</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-8 font-sans">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2">
            Order Management
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Process, inspect, and fulfill Drip Doggy store orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-card border border-neutral-200 hover:border-[#224870] hover:text-[#224870] text-[#615e56] text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer flex items-center gap-2 rounded-full transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `${RS}${stats.total.toLocaleString("en-IN")}`,
            trend: "up" as const,
            change: "+12.4%",
            subtitle: `From ${filteredOrders.length} matching orders`
          },
          {
            label: "Delivered",
            value: stats.delivered.toString(),
            trend: "up" as const,
            change: `${filteredOrders.length > 0 ? Math.round((stats.delivered / filteredOrders.length) * 100) : 0}% rate`,
            subtitle: "Fulfillment complete"
          },
          {
            label: "Processing",
            value: stats.processing.toString(),
            trend: "up" as const,
            change: `${filteredOrders.length > 0 ? Math.round((stats.processing / filteredOrders.length) * 100) : 0}% share`,
            subtitle: "Active in pipeline"
          },
          {
            label: "Pending",
            value: stats.pending.toString(),
            trend: stats.pending > 0 ? "down" as const : "up" as const,
            change: `AOV ${RS}${stats.avgOrder.toLocaleString()}`,
            subtitle: "Awaiting review"
          }
        ].map((stat, idx) => (
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

      {/* ─── Filters Panel ─── */}
      <div className="bg-card border border-neutral-200/80 p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 rounded-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="flex bg-background border border-neutral-200 p-1 rounded-full gap-0.5">
            {["All", "Completed", "Processing", "Pending", "Canceled"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 text-[8.5px] font-bold tracking-widest uppercase border-none cursor-pointer rounded-full transition-all ${
                  activeTab === tab ? "bg-[#224870] text-white shadow-sm" : "bg-transparent text-neutral-500 hover:text-[#224870]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dashboard-style Calendar Picker */}
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
                {/* Month nav */}
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

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-[#615e56] uppercase text-[8px] tracking-widest mb-1.5">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <span key={d}>{d}</span>)}
                </div>

                {/* Days */}
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
                          inRange ? "bg-[#224870]/15 text-[#382d24]" :
                          "bg-transparent text-[#382d24] hover:bg-neutral-200/40"
                        }`}
                      >{dayNum}</button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center border-t border-neutral-200/60 pt-3.5 mt-3.5">
                  <button
                    onClick={() => { setDateRange({ start: "", end: "" }); setShowCalendar(false); setCurrentPage(1); }}
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
            placeholder="Search order ID, customer, product…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="bg-card border border-neutral-200 pl-10 pr-4 py-2 text-[9.5px] font-semibold focus:outline-none focus:border-[#224870] placeholder-neutral-400 w-full md:w-72 rounded-full transition-all"
          />
        </div>
      </div>

      {/* ─── Orders Table ─── */}
      <div className="bg-card border border-neutral-200/80 overflow-hidden rounded-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200/80 bg-background/60 text-[9.5px] text-[#615e56] font-bold tracking-[0.12em] uppercase">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Products</th>
              <th className="p-4">Size / Qty</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100/80">
            {paginatedOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-[#224870]/5 transition-colors cursor-pointer"
                onClick={() => handleOpenModal(order)}
              >
                <td className="p-4 font-mono text-[10px] text-[#224870] font-black">{order.id}</td>
                <td className="p-4">
                  <div className="font-bold text-[11px] text-[#382d24]">{order.customer}</div>
                  <span className="text-[9px] text-neutral-400 font-medium block mt-0.5">{order.email}</span>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-[10.5px] text-[#524f46] max-w-[180px] truncate">
                    {order.items.map((item) => item.name).join(", ")}
                  </div>
                  {order.trackingNumber && (
                    <span className="text-[7px] font-bold text-[#224870] bg-[#224870]/10 px-1.5 py-0.5 border border-[#224870]/20 tracking-widest mt-1 inline-block rounded">
                      TRK: {order.trackingNumber}
                    </span>
                  )}
                </td>
                <td className="p-4 text-[10px] font-semibold text-[#615e56]">
                  {order.items.map((i) => `${i.size} ×${i.qty}`).join(" | ")}
                </td>
                <td className="p-4 font-black text-[11px] text-[#382d24]">{RS}{getOrderTotal(order).toLocaleString()}</td>
                <td className="p-4"><PaymentBadge val={order.payment} /></td>
                <td className="p-4"><StatusBadge val={order.status} /></td>
                <td className="p-4 text-[9.5px] text-[#736e64] font-semibold">{order.date}</td>
              </tr>
            ))}
            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-[11px] text-neutral-400 font-bold uppercase tracking-widest">
                  No orders match current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Pagination ─── */}
      <div className="flex items-center justify-between">
        <p className="text-[9px] text-[#615e56] font-bold uppercase tracking-wider">
          Showing {paginatedOrders.length} of {filteredOrders.length} orders
        </p>
        <div className="flex gap-1.5 items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#224870] hover:text-[#224870] bg-card text-[#615e56] text-[9px] font-bold tracking-widest px-4 py-2 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-full"
          >
            <ChevronLeft className="w-3 h-3" /> Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-8 h-8 flex items-center justify-center text-[9px] font-bold cursor-pointer border transition-all rounded-full ${
                currentPage === i + 1 ? "bg-[#224870] text-white border-[#224870]" : "bg-card border-neutral-200 text-[#615e56] hover:border-[#224870] hover:text-[#224870]"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#224870] hover:text-[#224870] bg-card text-[#615e56] text-[9px] font-bold tracking-widest px-4 py-2 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-full"
          >
            Next <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ─── Order Detail Modal ─── */}
      {activeOrderDetails && (
        <div
          className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrderId(null)}
        >
          <div
            className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl border border-neutral-200/80 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-200 flex items-start justify-between sticky top-0 bg-card z-10">
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Order Details</span>
                <h2 className="text-[18px] font-[950] text-[#224870] uppercase tracking-widest mt-0.5">{activeOrderDetails.id}</h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <StatusBadge val={activeOrderDetails.status} />
                  <PaymentBadge val={activeOrderDetails.payment} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintInvoice(activeOrderDetails)}
                  className="p-2 border border-neutral-200 text-neutral-500 hover:border-[#224870] hover:text-[#224870] cursor-pointer bg-card rounded-full transition-all"
                  title="Print Invoice"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="p-2 border border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-[#382d24] bg-transparent cursor-pointer rounded-full transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* 2-col layout: Customer + Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Customer Details */}
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Customer</span>
                  <div className="border border-neutral-200 p-4 space-y-3 bg-background/50 rounded-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-[#224870]/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-[#224870]" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-[#382d24] uppercase">{activeOrderDetails.customer}</p>
                        <p className="text-[8.5px] text-neutral-400 font-semibold">{activeOrderDetails.email}</p>
                      </div>
                    </div>
                    <div className="border-t border-neutral-100 pt-2.5 space-y-1.5">
                      <a href={`tel:${activeOrderDetails.phone}`} className="flex items-center gap-2 text-[9px] font-semibold text-neutral-500 hover:text-[#224870] transition-colors">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" /> {activeOrderDetails.phone}
                      </a>
                      <div className="flex items-center gap-2 text-[9px] font-semibold text-neutral-500">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="uppercase">{activeOrderDetails.delivery}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Financial Summary</span>
                  <div className="border border-neutral-200 p-4 space-y-2.5 bg-background/50 rounded-sm text-[9px]">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-semibold uppercase tracking-wider">Items Total</span>
                      <span className="font-bold text-[#382d24]">{RS}{getOrderTotal(activeOrderDetails).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-semibold uppercase tracking-wider">Payment Method</span>
                      <span className="font-bold text-[#382d24]">Card</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 font-semibold uppercase tracking-wider">Payment Status</span>
                      <div className="flex items-center gap-2">
                        <PaymentBadge val={activeOrderDetails.payment} />
                        {activeOrderDetails.payment === "Paid" && (
                          <button onClick={handleRefundOrder} className="text-red-500 hover:underline text-[8px] bg-transparent border-none cursor-pointer uppercase font-bold tracking-widest">
                            Refund
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between border-t border-neutral-200 pt-2.5 text-[11px] font-black text-[#382d24]">
                      <span>Total Gross</span>
                      <span>{RS}{getOrderTotal(activeOrderDetails).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fulfillment Workflow */}
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Fulfillment Workflow</span>
                <div className="border border-neutral-200 p-4 bg-background/50 rounded-sm space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(["Processing", "Shipped", "Delivered", "Cancelled"] as Order["status"][]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(st)}
                        className={`px-4 py-1.5 text-[8.5px] font-bold uppercase tracking-wider border cursor-pointer rounded-full transition-all ${
                          activeOrderDetails.status === st
                            ? st === "Cancelled" ? "bg-red-500 text-white border-red-500" : "bg-[#224870] text-white border-[#224870]"
                            : st === "Cancelled" ? "bg-card border-neutral-200 text-neutral-500 hover:border-red-500 hover:text-red-500"
                            : "bg-card border-neutral-200 text-neutral-500 hover:border-[#224870] hover:text-[#224870]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Tracking Number</label>
                    <input
                      type="text"
                      value={panelTracking}
                      onChange={(e) => setPanelTracking(e.target.value)}
                      placeholder="e.g. BD-8930482"
                      className="w-full bg-card border border-neutral-200 px-3 py-2 text-[10px] font-bold font-mono focus:outline-none focus:border-[#224870] rounded-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">
                  Cart Items — {activeOrderDetails.items.length} item{activeOrderDetails.items.length > 1 ? "s" : ""}
                </span>
                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-sm bg-background/50">
                  {activeOrderDetails.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex gap-4 items-center">
                      <div className="w-14 h-14 overflow-hidden bg-neutral-100 shrink-0 rounded-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10.5px] font-bold text-[#382d24] uppercase truncate">{item.name}</h4>
                        <span className="text-[8.5px] text-neutral-400 font-semibold block mt-0.5">SKU: {item.sku} &nbsp;|&nbsp; SIZE: {item.size}</span>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[8.5px] font-semibold text-[#615e56]">Qty: {item.qty}</span>
                          <span className="text-[8.5px] font-semibold text-[#615e56]">{RS}{item.price.toLocaleString()} each</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px] font-black text-[#382d24]">{RS}{(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Internal Admin Notes</span>
                <textarea
                  rows={3}
                  value={panelNotes}
                  onChange={(e) => setPanelNotes(e.target.value)}
                  placeholder="Add delivery instructions, special handling, returns notes…"
                  className="w-full bg-card border border-neutral-200 px-3 py-2.5 text-[10px] font-semibold focus:outline-none focus:border-[#224870] rounded-sm leading-relaxed transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-neutral-200 flex items-center justify-end gap-3 bg-card sticky bottom-0">
              <button
                onClick={() => setSelectedOrderId(null)}
                className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-6 py-2.5 uppercase bg-transparent cursor-pointer rounded-full transition-all"
              >
                Close
              </button>
              <button
                onClick={handleSaveDetails}
                className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-6 py-2.5 uppercase cursor-pointer rounded-full border-none transition-all"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
