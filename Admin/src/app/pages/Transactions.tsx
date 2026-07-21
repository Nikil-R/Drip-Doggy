import { useState, useEffect, useMemo } from "react";
import { Search, Download, Check, Clock, Calendar } from "lucide-react";
import { adminOrderApi, AdminOrderResponse } from "../lib/admin-order-api";

const RS = "₹";

export function TransactionsPage() {
  const [orders, setOrders] = useState<AdminOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("All Time");

  // Local state for Bank Settlement toggle (persisted in localStorage)
  const [bankSettledMap, setBankSettledMap] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("dripdoggy_bank_settled_map") || "{}");
    } catch {
      return {};
    }
  });

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }
        const data = await adminOrderApi.getAllOrders(token);
        setOrders(data || []);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch orders for ledger:", err);
        setError("Failed to load transactions ledger from server.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [token]);

  // Persist Bank Settlement toggle status
  const toggleBankSettled = (orderNumber: string) => {
    setBankSettledMap((prev) => {
      const updated = { ...prev, [orderNumber]: !prev[orderNumber] };
      localStorage.setItem("dripdoggy_bank_settled_map", JSON.stringify(updated));
      return updated;
    });
  };

  // Normalize order date to YYYY-MM-DD
  const getOrderDate = (timestamp: string) => {
    if (!timestamp) return "N/A";
    return timestamp.split("T")[0];
  };

  // Date range filtering helper
  const matchesDateRange = (timestamp: string, range: string) => {
    if (!timestamp) return false;
    if (range === "All Time") return true;

    const dateStr = timestamp.split("T")[0];
    const todayStr = new Date().toISOString().split("T")[0];

    if (range === "Today") {
      return dateStr === todayStr;
    }

    if (range === "This Week") {
      const orderTime = new Date(dateStr).getTime();
      const nowTime = new Date().getTime();
      const diffDays = (nowTime - orderTime) / (1000 * 3600 * 24);
      return diffDays <= 7;
    }

    if (range === "This Month") {
      const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM
      return dateStr.startsWith(currentMonthStr);
    }

    return true;
  };

  // Filter orders by date range first
  const dateFilteredOrders = useMemo(() => {
    return orders.filter((o) => matchesDateRange(o.orderTimestamp, dateRange));
  }, [orders, dateRange]);

  // Map order status to ledger payment states
  const getLedgerStatus = (o: AdminOrderResponse): "Paid" | "Pending" | "Cancelled" => {
    const dStatus = o.deliveryStatus?.toUpperCase();
    const pStatus = o.paymentStatus?.toUpperCase();

    if (dStatus === "CANCELLED" || pStatus === "REFUNDED" || pStatus === "FAILED") {
      return "Cancelled";
    }
    if (pStatus === "PAID" || dStatus === "DELIVERED") {
      return "Paid";
    }
    return "Pending";
  };

  // Process KPI metrics dynamically from date-filtered orders
  const stats = useMemo(() => {
    let totalOrdersCount = dateFilteredOrders.length;
    let totalRevenue = 0;
    let todayRevenue = 0;
    let cancelledOrdersCount = 0;
    let lostMoney = 0;

    const todayStr = new Date().toISOString().split("T")[0];

    dateFilteredOrders.forEach((o) => {
      const isCancelled = o.deliveryStatus?.toUpperCase() === "CANCELLED" || o.paymentStatus?.toUpperCase() === "REFUNDED";

      if (isCancelled) {
        cancelledOrdersCount++;
        lostMoney += o.totalAmount;
      } else {
        totalRevenue += o.totalAmount;
        if (o.orderTimestamp?.startsWith(todayStr)) {
          todayRevenue += o.totalAmount;
        }
      }
    });

    return {
      totalOrdersCount,
      totalRevenue,
      todayRevenue,
      cancelledOrdersCount,
      lostMoney
    };
  }, [dateFilteredOrders]);

  // Filtered orders list based on status and search query
  const filteredOrders = useMemo(() => {
    return dateFilteredOrders.filter((o) => {
      const ledgerStatus = getLedgerStatus(o);
      if (statusFilter !== "All" && ledgerStatus !== statusFilter) return false;

      const q = searchQuery.toLowerCase();
      return (
        o.customerName?.toLowerCase().includes(q) ||
        o.orderNumber?.toLowerCase().includes(q)
      );
    });
  }, [dateFilteredOrders, statusFilter, searchQuery]);

  // One-click CSV Export functionality
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = ["Order Number", "Customer Name", "Payment Type", "Order Amount (INR)", "Order Date", "Payment Status", "Bank Remittance Status"];
    const rows = filteredOrders.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.customerName || "Anonymous Customer"}"`,
      "COD",
      o.totalAmount,
      `"${getOrderDate(o.orderTimestamp)}"`,
      `"${getLedgerStatus(o)}"`,
      `"${bankSettledMap[o.orderNumber] ? "Bank Deposited" : "Pending Deposit"}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `DripDoggy_Payment_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans text-[#382d24]">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Active Cash Flow</span>
          <span className="text-2xl font-bold tracking-tight text-green-700 mt-2">
            {loading ? "..." : `${RS}${stats.totalRevenue.toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Today's Ordered Cash</span>
          <span className="text-2xl font-bold tracking-tight text-[#382d24] mt-2">
            {loading ? "..." : `${RS}${stats.todayRevenue.toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Canceled Orders</span>
          <span className="text-2xl font-bold tracking-tight text-[#b2533e] mt-2">
            {loading ? "..." : stats.cancelledOrdersCount} <span className="text-xs font-normal text-neutral-400">orders</span>
          </span>
        </div>
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Canceled / Lost Money</span>
          <span className="text-2xl font-bold tracking-tight text-red-600 mt-2">
            {loading ? "..." : `${RS}${stats.lostMoney.toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>

      {/* Ledger Workspace */}
      <div className="bg-card border border-neutral-200/80 p-5 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-neutral-200/60">
          <div>
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase block">General COD Ledger Logs</span>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-0.5">
              {loading ? "Loading transactions..." : `${filteredOrders.length} matching transactions (${dateRange})`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={filteredOrders.length === 0}
              className="bg-[#224870] hover:bg-[#224870]/85 disabled:opacity-50 text-white text-[9px] font-bold tracking-widest px-3.5 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export to CSV
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          {/* Status Tabs */}
          <div className="flex bg-background border border-neutral-200 p-1 rounded-full gap-0.5 flex-wrap">
            {["All", "Paid", "Pending", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 text-[8.5px] font-bold uppercase tracking-widest border-none cursor-pointer rounded-full transition-all ${
                  statusFilter === status ? "bg-[#224870] text-white shadow-sm" : "bg-transparent text-neutral-500 hover:text-[#224870]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {/* Date Range Dropdown */}
            <div className="flex items-center gap-1.5 bg-card border border-neutral-200 px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#224870]" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent text-[#382d24] font-bold outline-none cursor-pointer border-none text-[9.5px] uppercase"
              >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-450" />
              <input
                type="text"
                placeholder="Search Order Number, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card border border-neutral-200 pl-9 pr-3 py-2 text-[9.5px] font-semibold uppercase tracking-widest focus:outline-none focus:border-[#224870] placeholder-neutral-300 w-full rounded-none transition-all text-[#382d24]"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left uppercase text-[9.5px] font-bold tracking-wider divide-y divide-neutral-100">
            <thead>
              <tr className="border-b border-neutral-200 bg-card/60 text-[9.5px] text-[#615e56] tracking-[0.15em] font-black">
                <th className="p-3 font-bold">Order Number</th>
                <th className="p-3 font-bold">Customer</th>
                <th className="p-3 font-bold">Payment Type</th>
                <th className="p-3 font-bold">Order Amount</th>
                <th className="p-3 font-bold">Date</th>
                <th className="p-3 font-bold">Order Status</th>
                <th className="p-3 font-bold text-right">Bank Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 font-semibold">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 uppercase tracking-widest text-[9.5px]">
                    Syncing Ledger Data...
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const ledgerStatus = getLedgerStatus(o);
                  const isSettled = !!bankSettledMap[o.orderNumber];
                  return (
                    <tr key={o.orderNumber} className="hover:bg-neutral-100/50 transition-colors">
                      <td className="p-3 font-black text-[#224870] text-[11px] tracking-wide">{o.orderNumber}</td>
                      <td className="p-3 text-[#382d24]">{o.customerName || "Anonymous Customer"}</td>
                      <td className="p-3 text-[#615e56]">COD</td>
                      <td className="p-3 font-black text-[#382d24] text-[11px]">{RS}{o.totalAmount.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-neutral-500 font-mono text-[9.5px]">{getOrderDate(o.orderTimestamp)}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 border text-[7.5px] font-bold tracking-widest uppercase ${
                            ledgerStatus === "Paid"
                              ? "text-green-700 bg-green-50 border-green-200"
                              : ledgerStatus === "Pending"
                              ? "text-amber-700 bg-amber-50 border-amber-200"
                              : "text-red-700 bg-red-50 border-red-200"
                          }`}
                        >
                          {ledgerStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => toggleBankSettled(o.orderNumber)}
                          title="Click to toggle Bank Deposit status"
                          className={`inline-flex items-center gap-1 px-2 py-1 border text-[7.5px] font-bold tracking-widest uppercase cursor-pointer transition-all rounded-none ${
                            isSettled
                              ? "text-green-800 bg-green-100/80 border-green-300 hover:bg-green-200/80"
                              : "text-amber-800 bg-amber-100/60 border-amber-300 hover:bg-amber-200/60"
                          }`}
                        >
                          {isSettled ? (
                            <>
                              <Check className="w-3 h-3 text-green-700" /> Bank Deposited
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-700" /> Pending Deposit
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 uppercase tracking-widest text-[9.5px]">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
