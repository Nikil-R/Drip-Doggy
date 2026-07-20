import { useState, useEffect, useMemo } from "react";
import { Search, Coins, AlertCircle } from "lucide-react";
import { adminOrderApi, AdminOrderResponse } from "../lib/admin-order-api";

const RS = "₹";

export function TransactionsPage() {
  const [orders, setOrders] = useState<AdminOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  // Normalize order date to YYYY-MM-DD
  const getOrderDate = (timestamp: string) => {
    if (!timestamp) return "N/A";
    return timestamp.split("T")[0];
  };

  // Check if order was placed today (local timezone check based on ISO string)
  const isPlacedToday = (timestamp: string) => {
    if (!timestamp) return false;
    const today = new Date().toISOString().split("T")[0];
    return timestamp.startsWith(today);
  };

  // Process KPI metrics dynamically from backend orders
  const stats = useMemo(() => {
    let totalOrdersCount = orders.length;
    let totalRevenue = 0;
    let todayRevenue = 0;
    let cancelledOrdersCount = 0;
    let lostMoney = 0;

    orders.forEach(o => {
      const isCancelled = o.deliveryStatus?.toUpperCase() === "CANCELLED" || o.paymentStatus?.toUpperCase() === "REFUNDED";
      
      if (isCancelled) {
        cancelledOrdersCount++;
        lostMoney += o.totalAmount;
      } else {
        totalRevenue += o.totalAmount;
        if (isPlacedToday(o.orderTimestamp)) {
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
  }, [orders]);

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

  // Filtered orders list based on search and status
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const ledgerStatus = getLedgerStatus(o);
      if (statusFilter !== "All" && ledgerStatus !== statusFilter) return false;

      const q = searchQuery.toLowerCase();
      return (
        o.customerName?.toLowerCase().includes(q) ||
        o.orderNumber?.toLowerCase().includes(q)
      );
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="space-y-8 font-sans text-[#382d24]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#224870]" /> Payments Ledger
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Real-time Cash-on-Delivery (COD) financial reporting generated directly from order entries
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200/60 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[10px] font-bold text-red-800 uppercase tracking-widest">Error Loading Ledger</h4>
            <p className="text-[9px] text-red-700 font-bold uppercase tracking-wider mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Total Active Cash Flow</span>
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
              {loading ? "Loading transactions..." : `${filteredOrders.length} matching transactions`}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          {/* Tabs */}
          <div className="flex bg-background border border-neutral-200 p-1 rounded-full gap-0.5 flex-wrap">
            {["All", "Paid", "Pending", "Cancelled"].map(status => (
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
                <th className="p-3 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 font-semibold">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 uppercase tracking-widest text-[9.5px]">
                    Syncing Ledger Data...
                  </td>
                </tr>
              ) : filteredOrders.map((o) => {
                const ledgerStatus = getLedgerStatus(o);
                return (
                  <tr key={o.orderNumber} className="hover:bg-neutral-100/50 transition-colors">
                    <td className="p-3 font-black text-[#224870] text-[11px] tracking-wide">{o.orderNumber}</td>
                    <td className="p-3 text-[#382d24]">{o.customerName || "Anonymous Customer"}</td>
                    <td className="p-3 text-[#615e56]">COD</td>
                    <td className="p-3 font-black text-[#382d24] text-[11px]">{RS}{o.totalAmount.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-neutral-500 font-mono text-[9.5px]">{getOrderDate(o.orderTimestamp)}</td>
                    <td className="p-3 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 border text-[7.5px] font-bold tracking-widest uppercase ${
                        ledgerStatus === "Paid" 
                          ? "text-green-700 bg-green-50 border-green-200" 
                          : ledgerStatus === "Pending" 
                            ? "text-amber-700 bg-amber-50 border-amber-200" 
                            : "text-red-700 bg-red-50 border-red-200"
                      }`}>
                        {ledgerStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 uppercase tracking-widest text-[9.5px]">
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
