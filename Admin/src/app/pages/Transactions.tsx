import { useState, useEffect, useCallback } from "react";
import { Search, Download, Check, Clock, Calendar, AlertCircle } from "lucide-react";
import { adminPaymentApi, PaymentSummary, PaymentItem } from "../lib/admin-payment-api";
import { adminOrderApi, AdminOrderResponse } from "../lib/admin-order-api";
import { useAuthStore } from "../store/auth-store";

const RS = "₹";

export function TransactionsPage() {
  const { token: storeToken } = useAuthStore();
  const token = storeToken || localStorage.getItem("token") || sessionStorage.getItem("token");

  const [summary, setSummary] = useState<PaymentSummary>({
    totalActiveCashFlow: 0,
    todayRevenue: 0,
    cancelledOrdersCount: 0,
    lostMoney: 0
  });
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [togglingOrder, setTogglingOrder] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateRange, setDateRange] = useState("All Time");

  // Fetch Payment Ledger from backend
  const fetchLedger = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Admin session required. Please log in to access the transactions ledger.");
        setLoading(false);
        return;
      }

      // Format backend parameters
      const statusParam = statusFilter === "All" ? undefined : statusFilter.toUpperCase();
      let dateRangeParam: string | undefined = undefined;
      if (dateRange === "Today") dateRangeParam = "today";
      else if (dateRange === "This Week") dateRangeParam = "7d";
      else if (dateRange === "This Month") dateRangeParam = "30d";
      else if (dateRange === "All Time") dateRangeParam = "all";

      try {
        const data = await adminPaymentApi.getPaymentLedger(token, {
          status: statusParam,
          dateRange: dateRangeParam,
          search: searchQuery || undefined
        });

        if (data && data.summary) {
          setSummary(data.summary);
          setPayments(data.payments || []);
          return;
        }
      } catch (backendErr: any) {
        if (backendErr.response?.status === 403 || backendErr.response?.status === 401) {
          setError("Admin authorization required. Please log in with admin credentials.");
          setLoading(false);
          return;
        }
      }

      // Fallback to Admin Orders API if payments endpoint is unreachable
      try {
        const ordersData: AdminOrderResponse[] = await adminOrderApi.getAllOrders(token);
        let activeCash = 0;
        let todayRev = 0;
        let cancelledCount = 0;
        let lostAmt = 0;
        const todayStr = new Date().toISOString().split("T")[0];

        const mappedItems: PaymentItem[] = (ordersData || []).map((o) => {
          const isCancelled = o.deliveryStatus?.toUpperCase() === "CANCELLED" || o.paymentStatus?.toUpperCase() === "REFUNDED";
          if (isCancelled) {
            cancelledCount++;
            lostAmt += o.totalAmount;
          } else {
            activeCash += o.totalAmount;
            if (o.orderTimestamp?.startsWith(todayStr)) {
              todayRev += o.totalAmount;
            }
          }

          let pStatus = "PENDING";
          if (isCancelled) pStatus = "CANCELLED";
          else if (o.paymentStatus?.toUpperCase() === "PAID" || o.deliveryStatus?.toUpperCase() === "DELIVERED") pStatus = "PAID";

          const localMap = JSON.parse(localStorage.getItem("dripdoggy_bank_settled_map") || "{}");
          const isSettled = !!localMap[o.orderNumber];

          return {
            orderNumber: o.orderNumber,
            customerName: o.customerName || "Guest Customer",
            paymentType: "COD",
            amount: o.totalAmount,
            orderDate: o.orderTimestamp,
            paymentStatus: pStatus,
            bankSettlementStatus: isSettled ? "BANK_DEPOSITED" : "PENDING_DEPOSIT"
          };
        });

        setSummary({
          totalActiveCashFlow: activeCash,
          todayRevenue: todayRev,
          cancelledOrdersCount: cancelledCount,
          lostMoney: lostAmt
        });
        setPayments(mappedItems);
      } catch (fallbackErr: any) {
        if (fallbackErr.response?.status === 403 || fallbackErr.response?.status === 401) {
          setError("Admin session expired. Please log in again.");
        } else {
          setError("Failed to load transactions ledger from server.");
        }
      }

    } catch (err: any) {
      setError("Failed to load transactions ledger from server.");
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, dateRange, searchQuery]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  // Handle Bank Settlement Toggle
  const handleToggleBankSettlement = async (item: PaymentItem) => {
    if (!token) return;

    const pStatus = item.paymentStatus?.toUpperCase() || "PENDING";
    if (pStatus !== "PAID" && pStatus !== "SUCCESS") {
      setActionMessage({
        text: `Bank settlement for order ${item.orderNumber} cannot be updated to Bank Deposited while order is Pending/In-Transit.`,
        type: "error"
      });
      return;
    }

    const currentStatus = item.bankSettlementStatus;
    const targetStatus = currentStatus === "BANK_DEPOSITED" ? "PENDING_DEPOSIT" : "BANK_DEPOSITED";

    // Optimistic UI update
    setTogglingOrder(item.orderNumber);
    setActionMessage(null);

    // Save in local storage as instant backup
    try {
      const localMap = JSON.parse(localStorage.getItem("dripdoggy_bank_settled_map") || "{}");
      localMap[item.orderNumber] = targetStatus === "BANK_DEPOSITED";
      localStorage.setItem("dripdoggy_bank_settled_map", JSON.stringify(localMap));
    } catch {}

    try {
      const response = await adminPaymentApi.updateBankSettlement(item.orderNumber, targetStatus, token);
      
      // Update local state immediately
      setPayments((prev) =>
        prev.map((p) => (p.orderNumber === item.orderNumber ? { ...p, bankSettlementStatus: targetStatus } : p))
      );

      setActionMessage({
        text: response.message || `Bank settlement updated to ${targetStatus === "BANK_DEPOSITED" ? "Bank Deposited" : "Pending Deposit"}`,
        type: "success"
      });
    } catch (err: any) {
      console.error("Failed to update bank settlement:", err);
      const errMsg = err.response?.data?.message || err.response?.data || "Could not update bank settlement status.";
      
      setActionMessage({
        text: errMsg,
        type: "error"
      });

      // Revert local map backup if error
      try {
        const localMap = JSON.parse(localStorage.getItem("dripdoggy_bank_settled_map") || "{}");
        localMap[item.orderNumber] = currentStatus === "BANK_DEPOSITED";
        localStorage.setItem("dripdoggy_bank_settled_map", JSON.stringify(localMap));
      } catch {}
    } finally {
      setTogglingOrder(null);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  // Helper date formatting
  const getOrderDateStr = (timestamp: string) => {
    if (!timestamp) return "N/A";
    return timestamp.split("T")[0];
  };

  // CSV Export
  const handleExportCSV = () => {
    if (payments.length === 0) return;

    const headers = ["Order Number", "Customer Name", "Payment Type", "Order Amount (INR)", "Order Date", "Payment Status", "Bank Remittance Status"];
    const rows = payments.map((p) => {
      const isCancelled = p.paymentStatus?.toUpperCase() === "CANCELLED" || p.paymentStatus?.toUpperCase() === "FAILED" || p.paymentStatus?.toUpperCase() === "REFUNDED";
      const bankStatus = isCancelled ? "N/A (Cancelled)" : (p.bankSettlementStatus === "BANK_DEPOSITED" ? "Bank Deposited" : "Pending Deposit");
      return [
        `"${p.orderNumber}"`,
        `"${p.customerName || "Anonymous Customer"}"`,
        `"${p.paymentType || "COD"}"`,
        p.amount,
        `"${getOrderDateStr(p.orderDate)}"`,
        `"${p.paymentStatus || "PENDING"}"`,
        `"${bankStatus}"`
      ];
    });

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
      {/* Toast / Notification Banner */}
      {actionMessage && (
        <div
          className={`p-3.5 border text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
            actionMessage.type === "success"
              ? "bg-green-50 text-green-800 border-green-300"
              : "bg-red-50 text-red-800 border-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs font-black hover:opacity-75 bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Active Cash Flow</span>
          <span className="text-2xl font-bold tracking-tight text-green-700 mt-2">
            {loading ? "..." : `${RS}${(summary.totalActiveCashFlow || 0).toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Today's Ordered Cash</span>
          <span className="text-2xl font-bold tracking-tight text-[#382d24] mt-2">
            {loading ? "..." : `${RS}${(summary.todayRevenue || 0).toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Canceled Orders</span>
          <span className="text-2xl font-bold tracking-tight text-[#b2533e] mt-2">
            {loading ? "..." : summary.cancelledOrdersCount || 0} <span className="text-xs font-normal text-neutral-400">orders</span>
          </span>
        </div>
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[90px]">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Canceled / Lost Money</span>
          <span className="text-2xl font-bold tracking-tight text-red-600 mt-2">
            {loading ? "..." : `${RS}${(summary.lostMoney || 0).toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>

      {/* Ledger Workspace */}
      <div className="bg-card border border-neutral-200/80 p-5 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-neutral-200/60">
          <div>
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase block">General COD Ledger Logs</span>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-0.5">
              {loading ? "Loading transactions..." : `${payments.length} matching transactions (${dateRange})`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={payments.length === 0}
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
            {["All", "Paid", "Pending", "Cancelled", "Refunded"].map((status) => (
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

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

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
                    Syncing Ledger Data from Server...
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const pStatus = p.paymentStatus?.toUpperCase() || "PENDING";
                  const isPaid = pStatus === "PAID" || pStatus === "SUCCESS";
                  const isRefunded = pStatus === "REFUNDED" || pStatus === "REFUND_PENDING";
                  const isCancelled = (pStatus === "CANCELLED" || pStatus === "FAILED") && !isRefunded;
                  const isPending = !isPaid && !isCancelled && !isRefunded;
                  const isSettled = p.bankSettlementStatus === "BANK_DEPOSITED";
                  const isTogglingThis = togglingOrder === p.orderNumber;

                  return (
                    <tr key={p.orderNumber} className="hover:bg-neutral-100/50 transition-colors">
                      <td className="p-3 font-black text-[#224870] text-[11px] tracking-wide">{p.orderNumber}</td>
                      <td className="p-3 text-[#382d24]">{p.customerName || "Anonymous Customer"}</td>
                      <td className="p-3 text-[#615e56]">{p.paymentType || "COD"}</td>
                      <td className="p-3 font-black text-[#382d24] text-[11px]">
                        {RS}{(p.amount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 text-neutral-500 font-mono text-[9.5px]">{getOrderDateStr(p.orderDate)}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 border text-[7.5px] font-bold tracking-widest uppercase ${
                            isPaid
                              ? "text-green-700 bg-green-50 border-green-200"
                              : isRefunded
                              ? "text-purple-700 bg-purple-50 border-purple-200"
                              : isCancelled
                              ? "text-red-700 bg-red-50 border-red-200"
                              : "text-amber-700 bg-amber-50 border-amber-200"
                          }`}
                        >
                          {isPaid ? "Paid" : isRefunded ? "Refunded" : isCancelled ? "Cancelled" : "Pending"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {isRefunded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 border text-[7.5px] font-bold tracking-widest uppercase bg-purple-50 text-purple-600 border-purple-200 cursor-not-allowed">
                            N/A (Refunded)
                          </span>
                        ) : isCancelled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 border text-[7.5px] font-bold tracking-widest uppercase bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed">
                            N/A (Cancelled)
                          </span>
                        ) : isPending ? (
                          <span
                            title="Bank settlement can only be deposited once order is delivered & paid."
                            className="inline-flex items-center gap-1 px-2 py-1 border text-[7.5px] font-bold tracking-widest uppercase text-amber-800/60 bg-amber-50/60 border-amber-200/60 cursor-not-allowed opacity-75"
                          >
                            <Clock className="w-3 h-3 text-amber-600/70" /> Pending Deposit
                          </span>
                        ) : (
                          <button
                            disabled={isTogglingThis}
                            onClick={() => handleToggleBankSettlement(p)}
                            title="Click to toggle Bank Deposit status"
                            className={`inline-flex items-center gap-1 px-2 py-1 border text-[7.5px] font-bold tracking-widest uppercase cursor-pointer transition-all rounded-none ${
                              isSettled
                                ? "text-green-800 bg-green-100/80 border-green-300 hover:bg-green-200/80"
                                : "text-amber-800 bg-amber-100/60 border-amber-300 hover:bg-amber-200/60"
                            } ${isTogglingThis ? "opacity-50 cursor-wait" : ""}`}
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
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
              {!loading && payments.length === 0 && (
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
