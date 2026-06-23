import { useState, useMemo } from "react";
import {
  Search, Filter, Clock, CheckCircle2, XCircle, Truck,
  ChevronLeft, ChevronRight, Plus, Download, User, MapPin, X,
  FileText, Mail, Phone, Calendar
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
  date: string; // Format: "YYYY-MM-DD"
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
    <span className="flex items-center gap-1.5 text-[8px] font-bold tracking-widest uppercase">
      {/* Square indicator dot instead of rounded-full */}
      <span className={`w-2 h-2 ${val === "Paid" ? "bg-green-600" : val === "Refunded" ? "bg-neutral-400" : "bg-red-500"}`} />
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
    Delivered: <CheckCircle2 className="w-2.5 h-2.5" />,
    Shipped: <Truck className="w-2.5 h-2.5" />,
    Processing: <Clock className="w-2.5 h-2.5" />,
    Pending: <Clock className="w-2.5 h-2.5" />,
    Cancelled: <XCircle className="w-2.5 h-2.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-bold tracking-widest border uppercase rounded-none ${styles[val] || "bg-neutral-50 text-neutral-700 border-neutral-200"}`}>
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
  
  // Date range state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Local state copy for current order editing within panel
  const [panelTracking, setPanelTracking] = useState("");
  const [panelNotes, setPanelNotes] = useState("");

  const ITEMS_PER_PAGE = 4;

  const getOrderTotal = (order: Order) => {
    return order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  };

  const getOrderQty = (order: Order) => {
    return order.items.reduce((sum, item) => sum + item.qty, 0);
  };

  // Find fully updated details based on selected ID
  const activeOrderDetails = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  // Set local input helpers when active details change
  const handleOpenPanel = (order: Order) => {
    setSelectedOrderId(order.id);
    setPanelTracking(order.trackingNumber || "");
    setPanelNotes(order.notes || "");
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Tab filter
      if (activeTab === "Completed" && o.status !== "Delivered") return false;
      if (activeTab === "Processing" && o.status !== "Processing" && o.status !== "Shipped") return false;
      if (activeTab === "Canceled" && o.status !== "Cancelled") return false;
      if (activeTab === "Pending" && o.status !== "Pending") return false;

      // Date Range Filter
      if (startDate && o.date < startDate) return false;
      if (endDate && o.date > endDate) return false;
      
      // Search filter
      const q = searchQuery.toLowerCase();
      const matchProduct = o.items.some(item => item.name.toLowerCase().includes(q));
      return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || matchProduct;
    });
  }, [orders, activeTab, searchQuery, startDate, endDate]);

  // Paginated orders matching active tab & search query
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;

  // KPI Calculations
  const stats = useMemo(() => {
    const activeList = filteredOrders;
    return {
      total: activeList.reduce((sum, o) => sum + getOrderTotal(o), 0),
      delivered: activeList.filter(o => o.status === "Delivered").length,
      processing: activeList.filter(o => o.status === "Processing" || o.status === "Shipped").length,
      pending: activeList.filter(o => o.status === "Pending").length,
      cancelled: activeList.filter(o => o.status === "Cancelled").length,
    };
  }, [filteredOrders]);

  // Update actions inside sliding details panel
  const handleUpdateStatus = (status: Order["status"]) => {
    if (!selectedOrderId) return;
    setOrders(prev => prev.map(o => o.id === selectedOrderId ? { ...o, status } : o));
  };

  const handleRefundOrder = () => {
    if (!selectedOrderId) return;
    if (confirm("Initiate return and refund process? This updates payment status to Refunded.")) {
      setOrders(prev => prev.map(o => o.id === selectedOrderId ? { ...o, payment: "Refunded", status: "Cancelled" } : o));
    }
  };

  const handleSavePanelDetails = () => {
    if (!selectedOrderId) return;
    setOrders(prev => prev.map(o => o.id === selectedOrderId ? { ...o, trackingNumber: panelTracking, notes: panelNotes } : o));
    alert("Order details updated.");
  };

  // Bulk Updates
  const handleBulkStatusChange = (status: Order["status"]) => {
    setOrders(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, status } : o));
    setSelectedIds([]);
  };

  // CSV Export
  const handleExportCSV = () => {
    const exportList = selectedIds.length > 0 ? orders.filter(o => selectedIds.includes(o.id)) : filteredOrders;
    const headers = ["Order ID,Customer,Email,Phone,Date,Payment,Status,Total Price,Items Count"];
    const rows = exportList.map(o => `"${o.id}","${o.customer}","${o.email}","${o.phone}",${o.date},${o.payment},${o.status},${getOrderTotal(o)},${getOrderQty(o)}`);
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print Invoice Function
  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const itemRows = order.items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 0; font-family: monospace; font-size: 11px;">${item.name} (${item.sku})</td>
        <td style="padding: 10px 0; text-align: center; font-size: 11px;">${item.size}</td>
        <td style="padding: 10px 0; text-align: center; font-size: 11px;">${item.qty}</td>
        <td style="padding: 10px 0; text-align: right; font-size: 11px;">₹${item.price.toLocaleString()}</td>
        <td style="padding: 10px 0; text-align: right; font-size: 11px; font-weight: bold;">₹${(item.price * item.qty).toLocaleString()}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: sans-serif; color: #030213; padding: 40px; background-color: #faf8f5; }
            .header { border-bottom: 2px solid #030213; padding-bottom: 20px; display: flex; justify-content: space-between; }
            .meta { margin: 20px 0; display: flex; justify-content: space-between; font-size: 11px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { text-transform: uppercase; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; border-bottom: 1px solid #030213; padding-bottom: 10px; }
            .total-box { margin-top: 30px; text-align: right; border-top: 2px solid #030213; padding-top: 15px; font-size: 14px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 0.2em;">DRIP DOGGY</h1>
              <p style="margin: 5px 0 0 0; font-size: 9px; color: #717182;">STREETWEAR EDITORIAL ADMIN PANEL</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; font-size: 14px;">INVOICE</h2>
              <p style="margin: 5px 0 0 0; font-size: 10px; font-weight: bold; font-family: monospace;">${order.id}</p>
            </div>
          </div>
          <div class="meta">
            <div>
              <strong>Customer details:</strong><br/>
              ${order.customer}<br/>
              ${order.email}<br/>
              ${order.phone}
            </div>
            <div style="text-align: right;">
              <strong>Delivery destination:</strong><br/>
              ${order.delivery}<br/>
              Date Ordered: ${order.date}<br/>
              Status: ${order.status}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Item Description</th>
                <th>Size</th>
                <th>Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>
          <div class="total-box">
            TOTAL AMOUNT: ₹${getOrderTotal(order).toLocaleString()}
          </div>
          <p style="margin-top: 60px; font-size: 8px; text-align: center; color: #717182; text-transform: uppercase; letter-spacing: 0.15em;">
            Thank you for shopping with Drip Doggy. Verified Admin Invoice.
          </p>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">Order Management</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Process, inspect, and fulfill Drip Doggy store orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="bg-card border border-neutral-200 hover:border-[#030213] text-neutral-600 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer flex items-center gap-1.5 rounded-none">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: RS + stats.total.toLocaleString("en-IN"), subtitle: `${filteredOrders.length} matching orders` },
          { label: "Delivered", value: stats.delivered.toString(), subtitle: "Fulfillment complete" },
          { label: "Processing", value: stats.processing.toString(), subtitle: "Active in pipeline" },
          { label: "Pending", value: stats.pending.toString(), subtitle: "Awaiting review" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[110px] hover:shadow-sm transition-shadow rounded-none">
            <div>
              <span className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase block">{stat.label}</span>
              <p className="text-[7px] text-neutral-400 font-bold uppercase mt-0.5">{stat.subtitle}</p>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-[#030213]">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Action Selection Overlay */}
      {selectedIds.length > 0 && (
        <div className="bg-[#030213] text-white p-3.5 flex items-center justify-between border border-[#030213] rounded-none">
          <span className="text-[8px] font-bold tracking-widest uppercase">
            {selectedIds.length} Orders Selected
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => handleBulkStatusChange("Delivered")} className="bg-transparent border border-white/20 text-white hover:border-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer">
              Mark Delivered
            </button>
            <button onClick={() => handleBulkStatusChange("Shipped")} className="bg-transparent border border-white/20 text-white hover:border-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer">
              Mark Shipped
            </button>
            <button onClick={() => handleBulkStatusChange("Processing")} className="bg-transparent border border-white/20 text-white hover:border-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer">
              Mark Processing
            </button>
            <button onClick={() => handleBulkStatusChange("Cancelled")} className="bg-[#b2533e] text-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer border-none">
              Cancel Selected
            </button>
            <button onClick={() => setSelectedIds([])} className="bg-transparent border-none text-white/50 hover:text-white p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      <div className="bg-card border border-neutral-200/80 p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs */}
          <div className="flex bg-card border border-neutral-200 p-1">
            {["All", "Completed", "Processing", "Pending", "Canceled"].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-[7px] font-semibold tracking-widest uppercase border-none cursor-pointer ${
                  activeTab === tab ? "bg-[#030213] text-white" : "bg-transparent text-neutral-400 hover:text-[#030213]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Date range picker */}
          <div className="flex items-center gap-1.5 border border-neutral-200 px-2 py-1 bg-card">
            <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest mr-0.5">Filter Dates:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none text-[8px] font-semibold uppercase tracking-wider focus:outline-none w-[90px]"
            />
            <span className="text-[8px] text-neutral-300 font-bold">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none text-[8px] font-semibold uppercase tracking-wider focus:outline-none w-[90px]"
            />
            {(startDate || endDate) && (
              <button onClick={() => { setStartDate(""); setEndDate(""); }} className="bg-transparent border-none text-neutral-400 hover:text-[#030213] cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search Order ID, Customer..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="bg-card border border-neutral-200 pl-9 pr-4 py-2 text-[9px] font-semibold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-full md:w-64 rounded-none"
          />
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-card border border-neutral-200/80 overflow-hidden">
        <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider">
          <thead>
            <tr className="border-b border-neutral-200 bg-card/60 text-[8px] text-neutral-400 tracking-[0.2em]">
              <th className="p-3 w-8">
                <button
                  onClick={() => {
                    const currentIds = paginatedOrders.map(o => o.id);
                    const allSelected = currentIds.every(id => selectedIds.includes(id));
                    if (allSelected) {
                      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
                    } else {
                      setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
                    }
                  }}
                  className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#030213] p-0 flex items-center"
                >
                  <span className={`w-3.5 h-3.5 border border-neutral-300 inline-block flex items-center justify-center ${paginatedOrders.every(o => selectedIds.includes(o.id)) ? "bg-[#030213] border-[#030213]" : ""}`}>
                    {paginatedOrders.every(o => selectedIds.includes(o.id)) && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                  </span>
                </button>
              </th>
              <th className="p-3 font-bold">Order ID</th>
              <th className="p-3 font-bold">Customer</th>
              <th className="p-3 font-bold">Product Details</th>
              <th className="p-3 font-bold">Size/Qty</th>
              <th className="p-3 font-bold">Total</th>
              <th className="p-3 font-bold">Payment Status</th>
              <th className="p-3 font-bold">Fulfillment</th>
              <th className="p-3 font-bold">Date</th>
              <th className="p-3 font-bold text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60">
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-100/50 transition-colors">
                <td className="p-3">
                  <button onClick={() => setSelectedIds(prev => prev.includes(order.id) ? prev.filter(x => x !== order.id) : [...prev, order.id])} className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#030213] p-0 flex items-center">
                    <span className={`w-3.5 h-3.5 border border-neutral-300 inline-block flex items-center justify-center ${selectedIds.includes(order.id) ? "bg-[#030213] border-[#030213]" : ""}`}>
                      {selectedIds.includes(order.id) && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </span>
                  </button>
                </td>
                <td className="p-3 font-mono text-[8px] text-[#030213] font-bold">{order.id}</td>
                <td className="p-3">
                  <div className="font-semibold text-[#030213]">{order.customer}</div>
                  <span className="text-[7px] text-neutral-400 font-semibold lowercase tracking-wider block mt-0.5">{order.email}</span>
                </td>
                <td className="p-3">
                  <div className="truncate max-w-[150px] font-bold text-neutral-700">
                    {order.items.map(item => item.name).join(", ")}
                  </div>
                  {order.trackingNumber && (
                    <span className="text-[6px] font-bold text-blue-700 bg-blue-50 px-1 border border-blue-200 tracking-widest mt-0.5 inline-block">
                      TRK: {order.trackingNumber}
                    </span>
                  )}
                </td>
                <td className="p-3 font-bold text-neutral-500">
                  {order.items.map(i => `${i.size}(x${i.qty})`).join(" | ")}
                </td>
                <td className="p-3 font-bold text-[#030213]">{RS}{getOrderTotal(order).toLocaleString()}</td>
                <td className="p-3"><PaymentBadge val={order.payment} /></td>
                <td className="p-3"><StatusBadge val={order.status} /></td>
                <td className="p-3 text-neutral-400 font-mono text-[8px]">{order.date}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleOpenPanel(order)}
                    className="text-[8px] font-bold border border-neutral-200 hover:border-[#030213] px-2.5 py-1 uppercase bg-card tracking-widest cursor-pointer rounded-none"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                  No orders match criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">
          Showing {paginatedOrders.length} of {filteredOrders.length} filtered orders
        </p>
        <div className="flex gap-1 items-center">
          <button 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] bg-card text-neutral-500 text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-none"
          >
            <ChevronLeft className="w-3 h-3" /> Prev
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button 
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-7 h-7 flex items-center justify-center text-[8px] font-semibold cursor-pointer border rounded-none ${currentPage === i + 1 ? "bg-[#030213] text-white border-[#030213]" : "bg-card border-neutral-200 text-neutral-500 hover:border-[#030213]"}`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] bg-card text-neutral-500 text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-none"
          >
            Next <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Order Details Panel */}
      {activeOrderDetails && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l-2 border-[#030213] shadow-2xl z-50 flex flex-col justify-between rounded-none overflow-y-auto">
          {/* Panel Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-[7px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Order Details</span>
              <h2 className="text-sm font-bold text-[#030213] uppercase tracking-widest mt-1">
                {activeOrderDetails.id}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePrintInvoice(activeOrderDetails)}
                className="p-1.5 border border-neutral-200 text-neutral-500 hover:border-[#030213] hover:text-[#030213] cursor-pointer bg-card rounded-none"
                title="Print Packing Slip"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button onClick={() => setSelectedOrderId(null)} className="text-neutral-400 hover:text-[#030213] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Panel Body */}
          <div className="p-6 flex-1 space-y-6">
            {/* Customer information */}
            <div className="space-y-2">
              <span className="text-[7px] font-bold tracking-[0.2em] text-neutral-400 uppercase block">Customer Details</span>
              <div className="border border-neutral-200 p-4 space-y-3 bg-card/40 rounded-none">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  <span className="text-[9px] font-bold uppercase text-[#030213]">{activeOrderDetails.customer}</span>
                </div>
                <div className="flex items-center gap-4 text-[8px] font-bold text-neutral-500">
                  <a href={`mailto:${activeOrderDetails.email}`} className="flex items-center gap-1 hover:text-[#030213] hover:underline">
                    <Mail className="w-3 h-3 text-neutral-400" /> {activeOrderDetails.email}
                  </a>
                  <a href={`tel:${activeOrderDetails.phone}`} className="flex items-center gap-1 hover:text-[#030213] hover:underline">
                    <Phone className="w-3 h-3 text-neutral-400" /> {activeOrderDetails.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-[8px] text-neutral-500 font-bold border-t border-neutral-100 pt-2.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <span className="uppercase">{activeOrderDetails.delivery}</span>
                </div>
              </div>
            </div>

            {/* Shipment and tracking workflow */}
            <div className="space-y-2">
              <span className="text-[7px] font-bold tracking-[0.2em] text-neutral-400 uppercase block">Fulfillment Workflow</span>
              <div className="border border-neutral-200 p-4 space-y-3 bg-card/40 rounded-none">
                <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-neutral-100">
                  <button onClick={() => handleUpdateStatus("Processing")} className={`px-2.5 py-1 text-[7px] font-bold uppercase tracking-wider border cursor-pointer ${activeOrderDetails.status === "Processing" ? "bg-[#030213] text-white border-[#030213]" : "bg-card border-neutral-200 text-neutral-500"}`}>
                    Processing
                  </button>
                  <button onClick={() => handleUpdateStatus("Shipped")} className={`px-2.5 py-1 text-[7px] font-bold uppercase tracking-wider border cursor-pointer ${activeOrderDetails.status === "Shipped" ? "bg-[#030213] text-white border-[#030213]" : "bg-card border-neutral-200 text-neutral-500"}`}>
                    Shipped
                  </button>
                  <button onClick={() => handleUpdateStatus("Delivered")} className={`px-2.5 py-1 text-[7px] font-bold uppercase tracking-wider border cursor-pointer ${activeOrderDetails.status === "Delivered" ? "bg-[#030213] text-white border-[#030213]" : "bg-card border-neutral-200 text-neutral-500"}`}>
                    Delivered
                  </button>
                  <button onClick={() => handleUpdateStatus("Cancelled")} className={`px-2.5 py-1 text-[7px] font-bold uppercase tracking-wider border cursor-pointer ${activeOrderDetails.status === "Cancelled" ? "bg-[#b2533e] text-white border-[#b2533e]" : "bg-card border-neutral-200 text-neutral-500"}`}>
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-[7px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Shipment Courier Tracking Number</label>
                  <input
                    type="text"
                    value={panelTracking}
                    onChange={(e) => setPanelTracking(e.target.value)}
                    placeholder="e.g. BD-8930482"
                    className="w-full bg-card border border-neutral-200 px-3 py-1.5 text-[9px] font-bold font-mono focus:outline-none focus:border-[#030213] rounded-none"
                  />
                </div>
              </div>
            </div>

            {/* Itemized list */}
            <div className="space-y-2">
              <span className="text-[7px] font-bold tracking-[0.2em] text-neutral-400 uppercase block">Cart Items</span>
              <div className="divide-y divide-neutral-100 border border-neutral-200 px-4 bg-card/40 rounded-none">
                {activeOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex gap-3 items-center">
                    <div className="w-10 h-10 overflow-hidden bg-neutral-100 shrink-0"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[9px] font-semibold text-[#030213] uppercase truncate">{item.name}</h4>
                      <span className="text-[7px] text-neutral-400 font-bold block mt-0.5">SKU: {item.sku} | SIZE: {item.size}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-[#030213]">{RS}{(item.price * item.qty).toLocaleString()}</p>
                      <span className="text-[7px] text-neutral-400 font-bold">Qty {item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summaries */}
            <div className="space-y-2">
              <span className="text-[7px] font-bold tracking-[0.2em] text-neutral-400 uppercase block">Financial Summary</span>
              <div className="border border-neutral-200 p-4 space-y-2 bg-card/40 text-[8px] font-semibold uppercase tracking-wider rounded-none">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Payment method</span>
                  <span className="text-[#030213]">Card remittance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Payment state</span>
                  <div className="flex items-center gap-1.5">
                    <PaymentBadge val={activeOrderDetails.payment} />
                    {activeOrderDetails.payment === "Paid" && (
                      <button onClick={handleRefundOrder} className="text-[#b2533e] hover:underline text-[7px] bg-transparent border-none cursor-pointer uppercase font-bold tracking-widest ml-1">
                        Refund
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-2 text-[9px] font-bold text-[#030213]">
                  <span>Total Gross</span>
                  <span>{RS}{getOrderTotal(activeOrderDetails).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Admin notes */}
            <div className="space-y-2">
              <span className="text-[7px] font-bold tracking-[0.2em] text-neutral-400 uppercase block">Internal Admin Notes</span>
              <textarea
                rows={3}
                value={panelNotes}
                onChange={(e) => setPanelNotes(e.target.value)}
                placeholder="Add special delivery tracking or returns notes..."
                className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none leading-relaxed"
              />
            </div>
          </div>

          {/* Panel Footer */}
          <div className="p-6 border-t border-neutral-200 flex items-center justify-end gap-2">
            <button onClick={() => setSelectedOrderId(null)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">
              Cancel
            </button>
            <button onClick={handleSavePanelDetails} className="bg-[#030213] text-white hover:bg-neutral-800 text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">
              Save Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
