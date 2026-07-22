import { useState, useMemo, useEffect } from "react";
import {
  Search, CheckCircle2, ChevronLeft, ChevronRight, X,
  Package, Truck, Home, RotateCcw, Check,
  ArrowUpRight, Clock, User, AlertCircle,
  Upload, Building, Phone, QrCode,
  TrendingUp, TrendingDown, Mail, AlertTriangle, XCircle, ShieldAlert
} from "lucide-react";
import { customerApi } from "../lib/customer-api";
import { useAuthStore } from "@/app/store/auth-store";

const RS = "₹";

type DeliveryStatus =
  | "RETURN_INITIATED"
  | "RETURN_APPROVED"
  | "OUT_FOR_PICKUP"
  | "RECEIVED_AT_WAREHOUSE"
  | "REFUND_COMPLETED";

type ReturnStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "RECEIVED"
  | "COMPLETED";

interface StatusTimeline {
  status: string;
  timestamp: string;
  note: string;
}

interface ReturnItem {
  name: string;
  sku: string;
  size: string;
  qty: number;
  price: number;
  image: string;
}

interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  amount: number;
  reason: string;
  approvalStatus: ReturnStatus;
  deliveryStatus: DeliveryStatus;
  items: ReturnItem[];
  refundMethod: "qr_code" | "upi" | "bank_transfer";
  refundDetails: {
    upiId?: string;
    phoneNumber?: string;
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    qrCodeImage?: string;
  };
  timeline: StatusTimeline[];
  transactionId?: string;
  emailSent?: boolean;
  orderDbId?: number;
}

const DELIVERY_STAGES: { key: DeliveryStatus; label: string; icon: React.ComponentType<any> }[] = [
  { key: "RETURN_INITIATED",     label: "Return Initiated",     icon: RotateCcw },
  { key: "RETURN_APPROVED",      label: "Return Approved",      icon: Clock },
  { key: "OUT_FOR_PICKUP",       label: "Out for Pickup",       icon: Package },
  { key: "RECEIVED_AT_WAREHOUSE",label: "Received at Warehouse",icon: Building },
  { key: "REFUND_COMPLETED",     label: "Refund Completed",     icon: Home },
];

const APPROVAL_META: Record<ReturnStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
  "PENDING":   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500",   label: "Pending Review" },
  "APPROVED":  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500",    label: "Approved" },
  "REJECTED":  { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500",     label: "Rejected" },
  "RECEIVED":  { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200",  dot: "bg-indigo-500",  label: "Package Received" },
  "COMPLETED": { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-200",   dot: "bg-green-500",   label: "Completed" },
};

// Helper function to format return ID in the frontend (e.g. 4 -> RET-004)
function formatReturnId(id: string | number) {
  const numericId = Number(id);
  if (isNaN(numericId)) return String(id);
  return `RET-${String(numericId).padStart(3, "0")}`;
}

function ApprovalStatusBadge({ status }: { status: ReturnStatus }) {
  const m = APPROVAL_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.dot}`} />
      {m.label}
    </span>
  );
}

function LogisticsStatusBadge({ status }: { status: string }) {
  const cleanStatus = status.replace("RETURN_", "").replace("EXCHANGE_", "").replace(/_/g, " ");
  
  let bg = "bg-neutral-100";
  let text = "text-neutral-700";
  let border = "border-neutral-250";
  let dot = "bg-neutral-500";
  
  if (status.includes("INITIATED")) {
    bg = "bg-blue-50/50";
    text = "text-blue-700";
    border = "border-blue-200/60";
    dot = "bg-blue-600";
  } else if (status.includes("APPROVED")) {
    bg = "bg-sky-50/50";
    text = "text-sky-700";
    border = "border-sky-200/60";
    dot = "bg-sky-500";
  } else if (status.includes("PICKUP")) {
    bg = "bg-amber-50/50";
    text = "text-amber-700";
    border = "border-amber-250/60";
    dot = "bg-amber-600";
  } else if (status.includes("WAREHOUSE")) {
    bg = "bg-indigo-50/50";
    text = "text-indigo-700";
    border = "border-indigo-200/60";
    dot = "bg-indigo-600";
  } else if (status.includes("DISPATCHED")) {
    bg = "bg-purple-50/50";
    text = "text-purple-700";
    border = "border-purple-200/60";
    dot = "bg-purple-600";
  } else if (status.includes("COMPLETED")) {
    bg = "bg-green-50/50";
    text = "text-green-700";
    border = "border-green-200/60";
    dot = "bg-green-600";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest border ${bg} ${text} ${border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      {cleanStatus}
    </span>
  );
}

import { adminOrderApi, AdminReturnResponse } from "../lib/admin-order-api";

export function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Pending Review" | "Active Logistics" | "Completed">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<{ id: string; stage: DeliveryStatus } | null>(null);
  const ITEMS_PER_PAGE = 5;
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const [backendRequests, allOrders] = await Promise.all([
          adminOrderApi.getAllReturnRequests(token!),
          adminOrderApi.getAllOrders(token!)
        ]);
        if (!backendRequests) return;

        // Map order database ID to its delivery status for tracking manual stages across refreshes
        const orderStatusMap = new Map<number, string>();
        if (allOrders) {
          allOrders.forEach(o => {
            // Find database ID corresponding to order if possible, or build lookup
            // Typically order matches orderNumber/id
            // Let's index by orderNumber
            if (o.orderNumber) {
              orderStatusMap.set(Number(o.orderNumber.replace("#DD-", "").replace("DD-", "")), o.deliveryStatus);
            }
          });
        }

        // Filter for RETURN types
        const returnRequests = backendRequests.filter(r => r.requestType === "RETURN");
        const loaded: ReturnRequest[] = returnRequests.map(r => {
          let mappedApproval: ReturnStatus = "PENDING";
          let mappedDelivery: DeliveryStatus = "RETURN_INITIATED";
          const statusUpper = r.status?.toUpperCase() || "";

          if (statusUpper === "PENDING" || statusUpper === "INITIATED") {
            mappedApproval = "PENDING";
            mappedDelivery = "RETURN_INITIATED";
          } else if (statusUpper === "APPROVED") {
            mappedApproval = "APPROVED";
            mappedDelivery = "RETURN_APPROVED";
          } else if (statusUpper === "REJECTED") {
            mappedApproval = "REJECTED";
            mappedDelivery = "RETURN_INITIATED";
          } else if (statusUpper === "RECEIVED") {
            mappedApproval = "RECEIVED";
            mappedDelivery = "RECEIVED_AT_WAREHOUSE";
          } else if (statusUpper === "REFUND_COMPLETED" || statusUpper === "COMPLETED") {
            mappedApproval = "COMPLETED";
            mappedDelivery = "REFUND_COMPLETED";
          }

          // If the parent order exists and has progressed to active logistics stages, override mappedDelivery
          if (r.orderId) {
            const orderDelivery = orderStatusMap.get(Number(r.orderId));
            if (orderDelivery) {
              const oUpper = orderDelivery.toUpperCase();
              if (oUpper === "RETURN_PICKUPED" || oUpper === "OUT_FOR_PICKUP") {
                mappedDelivery = "OUT_FOR_PICKUP";
                if (mappedApproval === "PENDING") mappedApproval = "APPROVED";
              } else if (oUpper === "RETURN_SHIPPED" || oUpper === "RECEIVED_AT_WAREHOUSE") {
                mappedDelivery = "RECEIVED_AT_WAREHOUSE";
                mappedApproval = "RECEIVED";
              } else if (oUpper === "RETURN_DELIVERED" || oUpper === "REFUND_COMPLETED") {
                mappedDelivery = "REFUND_COMPLETED";
                mappedApproval = "COMPLETED";
              }
            }
          }

          let mappedMethod: "qr_code" | "upi" | "bank_transfer" = "bank_transfer";
          if (r.qrCodeImageUrl) mappedMethod = "qr_code";
          else if (r.upiId || r.upiPhone) mappedMethod = "upi";

          return {
            id: String(r.id),
            orderId: r.orderNumber,
            customerName: r.customerName || "Customer",
            email: r.customerEmail || "",
            phone: r.upiPhone || r.phone || "",
            date: r.createdAt?.split("T")?.[0] || "2026-07-08",
            amount: r.productPrice * (r.requestedQuantity || r.productQuantity || 1),
            reason: r.cancelReason || "No reason provided",
            approvalStatus: mappedApproval,
            deliveryStatus: mappedDelivery,
            items: [{
              name: r.productName,
              sku: `DD-VAR-${r.orderItemId}`,
              size: r.productSize || "M",
              qty: r.requestedQuantity || r.productQuantity || 1,
              price: r.productPrice,
              image: r.defectImageUrl1 || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop"
            }],
            refundMethod: mappedMethod,
            refundDetails: {
              upiId: r.upiId,
              phoneNumber: r.upiPhone,
              accountHolderName: r.bankAccountName,
              bankName: r.bankName,
              accountNumber: r.bankAccountNumber,
              ifscCode: r.bankIfsc,
              qrCodeImage: r.qrCodeImageUrl
            },
            timeline: [
              { status: "PENDING", timestamp: r.createdAt || "2026-07-08 12:00", note: "Return request submitted." },
              r.resolvedAt ? { status: "COMPLETED", timestamp: r.resolvedAt, note: "Return request resolved." } : null
            ].filter(Boolean) as any[],
            orderDbId: r.orderId
          };
        });

        setReturns(loaded);
      } catch (e) {
        console.error("Failed to load return requests:", e);
      }
    }
    load();
  }, [token]);

  const active = useMemo(() => returns.find(r => r.id === selectedId) || null, [returns, selectedId]);

  const filtered = useMemo(() => returns.filter(r => {
    if (activeTab === "Pending Review" && r.approvalStatus !== "PENDING") return false;
    if (activeTab === "Active Logistics" && (r.approvalStatus === "PENDING" || r.approvalStatus === "COMPLETED" || r.approvalStatus === "REJECTED")) return false;
    if (activeTab === "Completed" && r.approvalStatus !== "COMPLETED") return false;
    const q = searchQuery.toLowerCase();
    return r.id.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
  }), [returns, activeTab, searchQuery]);

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filtered, currentPage]);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;

  // Handles transition of administrative status
  const updateApprovalStatus = async (id: string, s: ReturnStatus) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // Map visual approved state to status endpoints
      if (s === "APPROVED" || s === "REJECTED") {
        await adminOrderApi.updateReturnStatus(Number(id), s, token!);
      }
      setReturns(prev => prev.map(r => {
        if (r.id !== id) return r;
        const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
        let updatedTimeline = [...r.timeline, { status: s, timestamp: ts, note: `Admin updated request status to: ${s}` }];
        
        // Auto-drive deliveryStatus based on approval transitions
        let dStatus = r.deliveryStatus;
        if (s === "APPROVED" && r.deliveryStatus === "RETURN_INITIATED") {
          dStatus = "RETURN_APPROVED";
        } else if (s === "RECEIVED") {
          dStatus = "RECEIVED_AT_WAREHOUSE";
        }

        return {
          ...r,
          approvalStatus: s,
          deliveryStatus: dStatus,
          timeline: updatedTimeline
        };
      }));
    } catch (e) {
      console.error("Failed to update return approval status:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handles updating physical logistics timeline tracking
  const updateDeliveryStatus = async (id: string, ds: DeliveryStatus) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const returnRequest = returns.find(r => r.id === id);
      const orderDbId = returnRequest?.orderDbId;

      // Map admin delivery stages to Order DeliveryStatus backend enums
      const backendStatusMap: Partial<Record<DeliveryStatus, string>> = {
        "OUT_FOR_PICKUP": "RETURN_PICKUPED",
        "RECEIVED_AT_WAREHOUSE": "RETURN_SHIPPED", // or RETURN_SHIPPED/RETURN_OUT_OF_DELIVERY transitions
        "REFUND_COMPLETED": "RETURN_DELIVERED"
      };
      const backendStatus = backendStatusMap[ds];

      if (backendStatus && orderDbId) {
        await adminOrderApi.updateOrderStatus(orderDbId, backendStatus, token!);
      }

      setReturns(prev => prev.map(r => {
        if (r.id !== id) return r;
        const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
        
        // Auto transition approval status based on delivery stage
        let appStatus = r.approvalStatus;
        if (ds === "RECEIVED_AT_WAREHOUSE" && appStatus === "APPROVED") {
          appStatus = "RECEIVED";
        } else if (ds === "REFUND_COMPLETED") {
          appStatus = "COMPLETED";
        }

        return {
          ...r,
          deliveryStatus: ds,
          approvalStatus: appStatus,
          timeline: [...r.timeline, { status: ds, timestamp: ts, note: `Logistics update: package is now ${ds.replaceAll("_", " ")}.` }]
        };
      }));
    } catch (e) {
      console.error("Failed to update return logistics delivery status:", e);
    } finally {
      setIsSubmitting(false);
      setPendingStageChange(null);
    }
  };

  // Called when admin clicks a manual logistics stage node
  const handleStageClick = (id: string, stage: DeliveryStatus) => {
    // RETURN_INITIATED is auto-set on creation, RETURN_APPROVED is auto-set on approval — non-clickable
    if (stage === "RETURN_INITIATED" || stage === "RETURN_APPROVED") return;
    setPendingStageChange({ id, stage });
  };

  const updateTransactionId = (id: string, val: string) => setReturns(prev => prev.map(r => r.id === id ? { ...r, transactionId: val } : r));

  const handleConfirmRefundPayout = async () => {
    if (!active) return;
    setSendingEmail(true);
    setEmailStatusMessage("Resolving return request & transferring payout proof...");

    try {
      // 2. Resolve on backend (action: REFUND, passes transactionId)
      await adminOrderApi.resolveReturnRequest(
        Number(active.id),
        "REFUND",
        "",
        active.transactionId || null,
        token!
      );

      const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
      setReturns(prev => prev.map(r => {
        if (r.id !== active.id) return r;
        return {
          ...r,
          approvalStatus: "COMPLETED",
          emailSent: true,
          timeline: [
            ...r.timeline,
            { status: "COMPLETED", timestamp: ts, note: `Refund of ${RS}${r.amount} paid out. Request COMPLETED.` }
          ]
        };
      }));

      setSendingEmail(false);
      setShowConfirmModal(false);
      setEmailStatusMessage("");
      alert(`Success! Payout resolved and confirmation email dispatched to ${active.customerName} (${active.email}).`);
    } catch (err) {
      console.error("Failed to resolve return request on backend:", err);
      setSendingEmail(false);
      setEmailStatusMessage("");
      alert("Error: Resolution failed. Please ensure refund transaction ID and proof screenshot are provided.");
    }
  };

  const pendingCount = returns.filter(r => r.approvalStatus === "PENDING").length;
  const activeLogisticsCount = returns.filter(r => r.approvalStatus === "APPROVED" || r.approvalStatus === "RECEIVED").length;
  const completedCount = returns.filter(r => r.approvalStatus === "COMPLETED").length;
  const totalRefund = returns.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6 font-sans">

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Refund Value", value: `${RS}${totalRefund.toLocaleString("en-IN")}`, trend: "up" as const, change: `${returns.length} returns`, subtitle: "Across all return cases" },
          { label: "Pending Review", value: pendingCount.toString(), trend: pendingCount > 0 ? "down" as const : "up" as const, change: `${returns.length > 0 ? Math.round((pendingCount / returns.length) * 100) : 0}% share`, subtitle: "Awaiting approval review" },
          { label: "Active Logistics", value: activeLogisticsCount.toString(), trend: "up" as const, change: `${returns.length > 0 ? Math.round((activeLogisticsCount / returns.length) * 100) : 0}% share`, subtitle: "In-pickup or warehouse transit" },
          { label: "Completed", value: completedCount.toString(), trend: "up" as const, change: `${returns.length > 0 ? Math.round((completedCount / returns.length) * 100) : 0}% rate`, subtitle: "Fulfillment complete" },
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
      <div className="bg-card border border-neutral-200/80 p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-nowrap items-center gap-3 shrink-0">
          <div className="flex bg-background border border-neutral-200 p-1 rounded-full gap-0.5">
            {(["All", "Pending Review", "Active Logistics", "Completed"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 text-[8.5px] font-bold tracking-widest uppercase border-none cursor-pointer rounded-full transition-all ${
                  activeTab === tab ? "bg-[#224870] text-white shadow-sm" : "bg-transparent text-neutral-500 hover:text-[#224870]"
                }`}
              >{tab}</button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by ID, order, customer..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="bg-card border border-neutral-200 pl-9 pr-4 py-2 text-[10px] font-semibold focus:outline-none focus:border-[#224870] placeholder-neutral-400 w-full xl:w-72 rounded-full transition-all"
          />
        </div>
      </div>

      {/* ─── Returns Table ─── */}
      <div className="bg-card border border-neutral-200/80 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200/80 bg-background/60 text-[9.5px] text-[#615e56] font-bold tracking-[0.12em] uppercase">
              <th className="p-4">Return ID</th>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Item</th>
              <th className="p-4">Refund Amt</th>
              <th className="p-4">Review Status</th>
              <th className="p-4">Logistics status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100/80">
            {paginated.map(ret => (
              <tr key={ret.id} onClick={() => setSelectedId(ret.id)} className="hover:bg-[#224870]/5 transition-colors cursor-pointer">
                <td className="p-4 font-mono text-[10.5px] text-[#224870] font-black">{formatReturnId(ret.id)}</td>
                <td className="p-4 font-mono text-[10px] text-neutral-600 font-bold">{ret.orderId}</td>
                <td className="p-4">
                  <p className="font-bold text-[11px] text-[#382d24]">{ret.customerName}</p>
                  <p className="text-[9.5px] text-[#615e56] mt-0.5">{ret.email}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2.5">
                    <img src={ret.items[0]?.image} alt="" className="w-9 h-9 object-cover border border-neutral-200 shrink-0" />
                    <div>
                      <p className="text-[10.5px] font-bold text-[#382d24] leading-tight">{ret.items[0]?.name}</p>
                      <p className="text-[9px] text-[#615e56] mt-0.5">Size {ret.items[0]?.size} · Qty {ret.items[0]?.qty}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-bold text-[12px] text-[#382d24]">{RS}{ret.amount.toLocaleString()}</td>
                <td className="p-4"><ApprovalStatusBadge status={ret.approvalStatus} /></td>
                <td className="p-4">
                  <LogisticsStatusBadge status={ret.deliveryStatus} />
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-[11px] text-[#615e56] font-bold uppercase tracking-widest">
                  No return requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Pagination ─── */}
      <div className="flex items-center justify-between">
        <p className="text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider">
          Showing {paginated.length} of {filtered.length} returns
        </p>
        <div className="flex gap-1.5 items-center">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#224870] hover:text-[#224870] bg-card text-[#615e56] text-[9px] font-bold tracking-widest px-4 py-2 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-full">
            <ChevronLeft className="w-3 h-3" /> Prev
          </button>
          <span className="px-3 py-1.5 text-[9px] font-bold text-[#615e56] border border-neutral-100 rounded-full bg-neutral-50">
            {currentPage} / {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#224870] hover:text-[#224870] bg-card text-[#615e56] text-[9px] font-bold tracking-widest px-4 py-2 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-full">
            Next <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ─── Detail Slide-in Panel ─── */}
      {active && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelectedId(null)}>
          <div className="flex-1 bg-black/30 backdrop-blur-[2px]" />
          <div className="w-full max-w-[500px] bg-white h-full overflow-y-auto flex flex-col shadow-2xl border-l border-neutral-200" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="sticky top-0 bg-white z-20 px-6 py-5 border-b border-neutral-200/60 flex items-start justify-between">
              <div>
                <span className="text-[8.5px] font-bold tracking-[0.3em] text-[#615e56] uppercase block">Return Request</span>
                <h2 className="text-lg font-bold text-[#382d24] uppercase tracking-tight mt-0.5">{formatReturnId(active.id)}</h2>
                <p className="text-[10px] text-[#615e56] font-semibold mt-1">Order {active.orderId} · {active.date}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="w-8 h-8 flex items-center justify-center border border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-[#382d24] bg-transparent cursor-pointer rounded-full transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 px-6 py-6 space-y-6">

              {/* Customer */}
              <div className="bg-card border border-neutral-200/80 p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#224870]/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#224870]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[12px] text-[#382d24]">{active.customerName}</p>
                  <p className="text-[9.5px] text-[#615e56] mt-0.5">{active.email}</p>
                  {active.phone && active.phone !== active.email && (
                    <p className="text-[9.5px] text-[#615e56]">{active.phone}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <ApprovalStatusBadge status={active.approvalStatus} />
                </div>
              </div>

              {/* Step 1: Administrative Approval review (when Pending) */}
              {active.approvalStatus === "PENDING" && (
                <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-sm space-y-3">
                  <div className="flex items-center gap-2 text-amber-700 font-extrabold text-[10px] uppercase">
                    <ShieldAlert className="w-4.5 h-4.5" /> Administrative Approval Action Needed
                  </div>
                  <p className="text-[10px] text-[#615e56] leading-relaxed">
                    Verify request defect claims. Approving begins the logistics courier pickup journey.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateApprovalStatus(active.id, "REJECTED")}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[9.5px] font-bold uppercase tracking-widest py-2 rounded-sm cursor-pointer transition-all border-none"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => updateApprovalStatus(active.id, "APPROVED")}
                      className="flex-1 bg-green-700 hover:bg-green-800 text-white text-[9.5px] font-bold uppercase tracking-widest py-2 rounded-sm cursor-pointer transition-all border-none"
                    >
                      Approve Request
                    </button>
                  </div>
                </div>
              )}

              {/* Items */}
              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-3">Returned Items</span>
                <div className="divide-y divide-neutral-100 border border-neutral-200/80">
                  {active.items.map((item, i) => (
                    <div key={i} className="p-3.5 flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover border border-neutral-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#382d24] uppercase tracking-wide truncate">{item.name}</p>
                        <p className="text-[9.5px] text-[#615e56] mt-0.5">SKU: {item.sku} · Size: <strong className="text-[#382d24]">{item.size}</strong> · Qty: <strong className="text-[#382d24]">{item.qty}</strong></p>
                      </div>
                      <p className="text-[13px] font-bold text-[#224870] shrink-0">{RS}{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 px-3.5 py-3 bg-neutral-50 border border-neutral-200/60 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#615e56]">Reason for Return</p>
                    <p className="text-[10.5px] font-semibold text-[#382d24] mt-0.5">{active.reason}</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Physical Package Logistics timeline (only if approved) */}
              {active.approvalStatus !== "PENDING" && active.approvalStatus !== "REJECTED" && (
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-4">Package Logistics Tracking</span>
                  <div className="relative">
                    <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-neutral-100" />
                    {DELIVERY_STAGES.map((stage, idx) => {
                      const stageIdx = DELIVERY_STAGES.findIndex(s => s.key === active.deliveryStatus);
                      const isDone = idx <= stageIdx;
                      const isCurrent = idx === stageIdx;
                      const isAutoManaged = stage.key === "RETURN_INITIATED" || stage.key === "RETURN_APPROVED";
                      const isClickable = !isAutoManaged;
                      const log = active.timeline.find(t => t.status === stage.key);
                      const Icon = stage.icon;

                      // Determine if clicking this stage is disabled
                      let isDisabledStage = false;
                      let disableReason = "";

                      if (isDone && !isCurrent) {
                        // 1. Disable clicking on previously completed stages
                        isDisabledStage = true;
                        disableReason = "Stage already completed";
                      } else if (stage.key === "REFUND_COMPLETED") {
                        // 2. Disable clicking REFUND_COMPLETED until receipt screenshot is uploaded AND email sent
                        const hasProof = !!active.receiptScreenshot;
                        const emailSent = active.approvalStatus === "COMPLETED";
                        if (!hasProof || !emailSent) {
                          isDisabledStage = true;
                          disableReason = !hasProof
                            ? "Upload receipt screenshot first"
                            : "Confirm and Send Email to customer first";
                        }
                      }

                      return (
                        <div key={stage.key} className="relative flex items-start gap-4 pb-5">
                          <button
                            disabled={isDisabledStage}
                            onClick={() => isClickable && !isDisabledStage && handleStageClick(active.id, stage.key)}
                            title={isAutoManaged ? "Auto-managed stage" : disableReason || `Set to: ${stage.label}`}
                            className={`relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all ${
                              isAutoManaged
                                ? "cursor-default"
                                : isDisabledStage
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer hover:scale-105"
                            } ${
                              isCurrent ? "bg-[#224870] border-[#224870] text-white shadow-md scale-105" :
                              isDone ? "bg-white border-[#224870] text-[#224870]" :
                              "bg-white border-neutral-200 text-neutral-300"
                            }`}
                          >
                            {isDone && !isCurrent ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                          </button>
                          <div className="flex-1 min-w-0 pt-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-[10.5px] font-bold uppercase tracking-wide ${isCurrent ? "text-[#224870]" : isDone ? "text-[#382d24]" : "text-neutral-300"}`}>{stage.label}</p>
                              <div className="flex items-center gap-1.5">
                                {isCurrent && <span className="text-[7.5px] font-bold uppercase tracking-widest bg-[#224870]/10 text-[#224870] px-2 py-0.5 rounded-full">Active</span>}
                                {isAutoManaged && <span className="text-[7px] font-bold uppercase tracking-widest bg-neutral-100 text-neutral-400 px-1.5 py-0.5 rounded-full">Auto</span>}
                              </div>
                            </div>
                            {log ? <p className="text-[9.5px] text-[#615e56] mt-0.5 leading-relaxed">{log.note}</p> : !isDone ? <p className="text-[9.5px] text-neutral-300 mt-0.5 italic">Awaiting shipment scan</p> : null}
                            {log && <p className="text-[8.5px] font-semibold text-neutral-400 mt-1 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {log.timestamp}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Refund Details */}
              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-3">Refund details</span>
                <div className="border border-neutral-200/80 bg-card">
                  <div className="px-4 py-3 border-b border-neutral-200/60 bg-background/40 flex items-center gap-2">
                    {active.refundMethod === "bank_transfer" && <Building className="w-4 h-4 text-[#224870]" />}
                    {active.refundMethod === "upi" && <Phone className="w-4 h-4 text-[#224870]" />}
                    {active.refundMethod === "qr_code" && <QrCode className="w-4 h-4 text-[#224870]" />}
                    <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#224870]">
                      {active.refundMethod === "bank_transfer" ? "Bank Transfer" : active.refundMethod === "upi" ? "UPI Transfer" : "QR Code"}
                    </span>
                    <span className="ml-auto text-[13px] font-bold text-[#382d24]">{RS}{active.amount.toLocaleString()}</span>
                  </div>
                  <div className="px-4 py-3 space-y-2 text-[10.5px]">
                    {active.refundMethod === "upi" && (
                      <>
                        <div className="flex justify-between"><span className="text-[#615e56] font-semibold">UPI ID</span><span className="font-bold text-[#382d24] font-mono">{active.refundDetails.upiId}</span></div>
                        {active.refundDetails.phoneNumber && <div className="flex justify-between"><span className="text-[#615e56] font-semibold">Phone</span><span className="font-bold text-[#382d24]">{active.refundDetails.phoneNumber}</span></div>}
                      </>
                    )}
                    {active.refundMethod === "bank_transfer" && (
                      <>
                        <div className="flex justify-between"><span className="text-[#615e56] font-semibold">Account Holder</span><span className="font-bold text-[#382d24]">{active.refundDetails.accountHolderName}</span></div>
                        <div className="flex justify-between"><span className="text-[#615e56] font-semibold">Bank</span><span className="font-bold text-[#382d24]">{active.refundDetails.bankName}</span></div>
                        <div className="flex justify-between"><span className="text-[#615e56] font-semibold">Account No.</span><span className="font-bold text-[#382d24] font-mono">{active.refundDetails.accountNumber}</span></div>
                        <div className="flex justify-between"><span className="text-[#615e56] font-semibold">IFSC</span><span className="font-bold text-[#382d24] font-mono">{active.refundDetails.ifscCode}</span></div>
                      </>
                    )}
                    {active.refundMethod === "qr_code" && (
                      <div className="flex justify-center py-3">
                        <img src={active.refundDetails.qrCodeImage} alt="QR Code" className="w-28 h-28 border border-neutral-200 object-contain bg-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Refund proof submission (only after package reaches RECEIVED or RETURN_DELIVERED stage) */}
              {active.approvalStatus !== "PENDING" && active.approvalStatus !== "REJECTED" && (
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-3">Refund Verification & Closeout</span>
                  
                  <div className="space-y-3">
                    <div className="bg-card border border-neutral-200/80 p-4 rounded-sm">
                      <label className="block text-[9.5px] font-bold tracking-widest text-[#615e56] uppercase mb-2">Transaction ID</label>
                      <input 
                        type="text" 
                        placeholder="e.g. TXN123456789"
                        value={active.transactionId || ""}
                        onChange={e => updateTransactionId(active.id, e.target.value)}
                        className="w-full bg-white border border-neutral-200 p-2.5 text-xs font-semibold focus:outline-none focus:border-[#224870] transition-colors rounded-sm"
                        disabled={active.approvalStatus === "COMPLETED"}
                      />
                      <p className="text-[9px] text-[#615e56] font-semibold mt-1.5">Enter the bank transaction ID for the refund to unlock confirmation.</p>
                    </div>

                    {active.approvalStatus !== "COMPLETED" && (
                      <button
                        onClick={() => setShowConfirmModal(true)}
                        disabled={!active.transactionId?.trim()}
                        className={`w-full text-white text-[9.5px] font-black uppercase tracking-wider py-2.5 px-4 rounded-sm transition-all flex items-center justify-center gap-2 border-none ${active.transactionId?.trim() ? "bg-[#224870] hover:bg-[#1a3858] cursor-pointer" : "bg-neutral-300 cursor-not-allowed"}`}
                      >
                        <Mail className="w-4 h-4" /> Confirm & Send Email to Customer
                      </button>
                    )}

                    {active.approvalStatus === "COMPLETED" && (
                      <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold bg-green-50 border border-green-200 p-2.5 rounded-sm mt-2">
                        <Check className="w-4 h-4" /> Refund complete. Email notifications sent successfully.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ─── Stage Change Confirmation Modal ─── */}
      {pendingStageChange && (() => {
        const stageMeta = DELIVERY_STAGES.find(s => s.key === pendingStageChange.stage);
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white border border-neutral-200 w-full max-w-[420px] p-6 rounded-sm shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-full shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#382d24] uppercase tracking-wider">Confirm Stage Change</h3>
                  <p className="text-[10.5px] text-[#615e56] font-semibold mt-1.5 leading-relaxed">
                    Are you sure you want to advance this return to:
                  </p>
                  <p className="text-[13px] font-black text-[#224870] uppercase tracking-wider mt-1">
                    {stageMeta?.label}
                  </p>
                </div>
              </div>
              <p className="text-[9.5px] text-[#615e56] font-medium leading-relaxed bg-neutral-50 border border-neutral-200 p-3 rounded-sm">
                This will update the logistics stage for the customer and notify them of the progress.
              </p>
              <div className="flex gap-2.5 pt-1">
                <button
                  disabled={isSubmitting}
                  onClick={() => setPendingStageChange(null)}
                  className="flex-1 border border-neutral-200 hover:bg-neutral-50 text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-sm cursor-pointer transition-all bg-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={() => updateDeliveryStatus(pendingStageChange.id, pendingStageChange.stage)}
                  className="flex-1 bg-[#224870] hover:bg-[#1a3858] text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-sm cursor-pointer transition-all border-none disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    "Yes, Change"
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── Confirmation Modal ─── */}
      {showConfirmModal && active && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-neutral-200 w-full max-w-[450px] p-6 rounded-sm shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-full shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#382d24] uppercase tracking-wider">Confirm Payout & Notify Customer</h3>
                <p className="text-xs text-[#615e56] font-semibold mt-1">
                  You are finalizing the refund of <strong>{RS}{active.amount}</strong> to <strong>{active.customerName}</strong>.
                </p>
              </div>
            </div>

            <div className="bg-neutral-50 p-3.5 border border-neutral-200/80 rounded-sm space-y-2 text-[10.5px]">
              <p className="font-bold text-[#382d24] border-b border-neutral-200 pb-1.5 mb-1.5 uppercase text-[9px] tracking-wider">Recipient Payout Details</p>
              {active.refundMethod === "bank_transfer" && (
                <>
                  <p><span className="text-[#615e56] font-medium">Bank Name:</span> <strong className="text-[#382d24]">{active.refundDetails.bankName}</strong></p>
                  <p><span className="text-[#615e56] font-medium">Account Holder:</span> <strong className="text-[#382d24]">{active.refundDetails.accountHolderName}</strong></p>
                  <p><span className="text-[#615e56] font-medium">Account Number:</span> <strong className="text-[#382d24] font-mono">{active.refundDetails.accountNumber}</strong></p>
                  <p><span className="text-[#615e56] font-medium">IFSC Code:</span> <strong className="text-[#382d24] font-mono">{active.refundDetails.ifscCode}</strong></p>
                </>
              )}
              {active.refundMethod === "upi" && (
                <p><span className="text-[#615e56] font-medium">UPI Address:</span> <strong className="text-[#382d24] font-mono">{active.refundDetails.upiId}</strong></p>
              )}
            </div>

            <p className="text-[10px] text-[#615e56] leading-relaxed font-semibold">
              An email notification confirming payout credit with the transaction receipt attachment will be sent to <strong>{active.email}</strong>.
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                disabled={sendingEmail}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border border-neutral-200 hover:bg-neutral-50 text-[10px] font-bold uppercase tracking-wider py-2 rounded-sm cursor-pointer transition-all bg-white"
              >
                Cancel
              </button>
              <button
                disabled={sendingEmail}
                onClick={handleConfirmRefundPayout}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white text-[10px] font-bold uppercase tracking-wider py-2 rounded-sm cursor-pointer transition-all flex items-center justify-center gap-1 border-none disabled:opacity-50"
              >
                {sendingEmail ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  "Yes, Send Receipt"
                )}
              </button>
            </div>
            {emailStatusMessage && (
              <p className="text-[9.5px] text-center text-blue-600 font-semibold animate-pulse">{emailStatusMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
