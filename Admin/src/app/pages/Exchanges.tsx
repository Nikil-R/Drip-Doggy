import { useState, useMemo } from "react";
import {
  Search, ChevronLeft, ChevronRight, X,
  Package, Truck, Home, RefreshCw, Check,
  ArrowUpRight, Clock, User, AlertCircle,
  TrendingUp, TrendingDown, Palette, Tag,
  ArrowRight, CreditCard, Building, QrCode, Phone, Upload, CheckCircle2, ShieldAlert
} from "lucide-react";
import { productApi } from "../lib/product-api";

const RS = "₹";

type DeliveryStatus =
  | "EXCHANGE_INITIATED"
  | "EXCHANGE_APPROVED"
  | "OUT_FOR_PICKUP"
  | "RECEIVED_AT_WAREHOUSE"
  | "REPLACEMENT_DISPATCHED"
  | "EXCHANGE_COMPLETED";

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

interface ExchangeItem {
  name: string;
  sku: string;
  originalSize: string;
  requestedSize: string;
  originalColor: string;
  requestedColor: string;
  qty: number;
  originalPrice: number;
  replacementPrice: number;
  image: string;
}

interface ExchangeRequest {
  id: string;
  orderDbId?: number;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  reason: string;
  approvalStatus: ReturnStatus;
  deliveryStatus: DeliveryStatus;
  items: ExchangeItem[];
  paymentStatus: "paid" | "pending_payment" | "refunded" | "pending_refund" | "no_adjustment";
  adjustmentAmount: number; // Positive = customer pays more, Negative = customer gets refund
  refundMethod?: "qr_code" | "upi" | "bank_transfer";
  refundDetails?: {
    upiId?: string;
    phoneNumber?: string;
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    qrCodeImage?: string;
  };
  transactionId?: string;
  defectImages?: string[];
  timeline: StatusTimeline[];
}

const DELIVERY_STAGES: { key: DeliveryStatus; label: string; icon: React.ComponentType<any> }[] = [
  { key: "EXCHANGE_INITIATED",    label: "Exchange Initiated",    icon: RefreshCw },
  { key: "EXCHANGE_APPROVED",     label: "Exchange Approved",     icon: Clock },
  { key: "OUT_FOR_PICKUP",        label: "Out for Pickup",        icon: Package },
  { key: "RECEIVED_AT_WAREHOUSE", label: "Received at Warehouse", icon: Building },
  { key: "REPLACEMENT_DISPATCHED",label: "Replacement Placed",    icon: Truck },
  { key: "EXCHANGE_COMPLETED",    label: "Exchange Completed",    icon: Home },
];

const APPROVAL_META: Record<ReturnStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
  "PENDING":   { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500",   label: "Pending Review" },
  "APPROVED":  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500",    label: "Approved" },
  "REJECTED":  { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500",     label: "Rejected" },
  "RECEIVED":  { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200",  dot: "bg-indigo-500",  label: "Package Received" },
  "COMPLETED": { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-200",   dot: "bg-green-500",   label: "Completed" },
};



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

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/auth-store";
import { adminOrderApi } from "../lib/admin-order-api";

export const ExchangesPage = () => {
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"All" | "Pending Review" | "Active Logistics" | "Completed">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExchangeId, setSelectedExchangeId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<{ id: string; stage: DeliveryStatus } | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const ITEMS_PER_PAGE = 6;
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const [backendRequests, products, allOrders] = await Promise.all([
          adminOrderApi.getAllReturnRequests(token!),
          productApi.fetchAllProducts(token!).catch(() => []),
          adminOrderApi.getAllOrders(token!).catch(() => [])
        ]);
        if (!backendRequests) return;

        const orderStatusMap = new Map<number, string>();
        const orderTrackingMap = new Map<number, string>();
        if (allOrders) {
          allOrders.forEach((o: any) => {
            if (o.orderNumber) {
              const numericId = Number(o.orderNumber.replace("#DD-", "").replace("DD-", ""));
              orderStatusMap.set(numericId, o.deliveryStatus);
              orderTrackingMap.set(numericId, o.trackingNumber);
            }
          });
        }

        const exchangeRequests = backendRequests.filter(r => r.requestType?.toUpperCase() === "EXCHANGE");
        const loaded: ExchangeRequest[] = exchangeRequests.map(r => {
          let mappedApproval: ReturnStatus = "PENDING";
          let mappedDelivery: DeliveryStatus = "EXCHANGE_INITIATED";
          const statusUpper = r.status?.toUpperCase() || "";

          if (statusUpper === "PENDING" || statusUpper === "INITIATED") {
            mappedApproval = "PENDING";
            mappedDelivery = "EXCHANGE_INITIATED";
          } else if (statusUpper === "APPROVED") {
            mappedApproval = "APPROVED";
            mappedDelivery = "EXCHANGE_APPROVED";
          } else if (statusUpper === "REJECTED") {
            mappedApproval = "REJECTED";
            mappedDelivery = "EXCHANGE_INITIATED";
          } else if (statusUpper === "RECEIVED") {
            mappedApproval = "RECEIVED";
            mappedDelivery = "RECEIVED_AT_WAREHOUSE";
          } else if (statusUpper === "EXCHANGE_COMPLETED" || statusUpper === "COMPLETED") {
            mappedApproval = "COMPLETED";
            mappedDelivery = "EXCHANGE_COMPLETED";
          }

          if (r.orderId) {
            const orderDelivery = orderStatusMap.get(Number(r.orderId));
            if (orderDelivery) {
              const oUpper = orderDelivery.toUpperCase();
              if (oUpper === "EXCHANGE_PICKUPED" || oUpper === "OUT_FOR_PICKUP" || oUpper === "RETURN_PICKUPED") {
                mappedDelivery = "OUT_FOR_PICKUP";
              } else if (oUpper === "EXCHANGE_SHIPPED" || oUpper === "RECEIVED_AT_WAREHOUSE" || oUpper === "RETURN_SHIPPED") {
                mappedDelivery = "RECEIVED_AT_WAREHOUSE";
              } else if (oUpper === "EXCHANGE_PACKED" || oUpper === "EXCHANGE_OUT_OF_DELIVERY" || oUpper === "REPLACEMENT_DISPATCHED" || oUpper === "RETURN_OUT_OF_DELIVERY") {
                mappedDelivery = "REPLACEMENT_DISPATCHED";
              } else if (oUpper === "EXCHANGE_DELIVERED" || oUpper === "EXCHANGE_COMPLETED" || oUpper === "RETURN_DELIVERED") {
                mappedDelivery = "EXCHANGE_COMPLETED";
              }
            }
          }

          const matchedProduct = products.find((p: any) => (p.name || p.productName || "").toLowerCase() === (r.productName || "").toLowerCase());
          const originalColor = (r as any).productColor || "N/A";
          const matchedVariant = matchedProduct?.variants?.find((v: any) => (v.variantName || "").toLowerCase() === originalColor.toLowerCase());
          const imgUrl = matchedVariant?.imageUrls?.[0] || matchedProduct?.images?.[0] || matchedProduct?.variants?.[0]?.imageUrls?.[0] || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop";

          return {
            id: r.id.toString().startsWith("EXC-") ? r.id.toString() : "EXE-" + String(r.id).padStart(3, '0'),
            orderDbId: r.orderId,
            orderId: r.orderNumber,
            customerName: r.customerName || "Customer",
            email: r.customerEmail || "",
            phone: (r as any).customerPhone || r.upiPhone || "",
            date: r.createdAt?.split("T")?.[0] || "2026-07-08",
            reason: r.cancelReason || "Exchange request submitted.",
            approvalStatus: mappedApproval,
            deliveryStatus: mappedDelivery,
            trackingNumber: r.trackingNumber || (r.orderId ? orderTrackingMap.get(Number(r.orderId)) : undefined),
            paymentStatus: "no_adjustment",
            adjustmentAmount: 0,
            items: [{
              name: r.productName,
              sku: `DD-VAR-${r.orderItemId}`,
              originalSize: r.productSize || "M",
              requestedSize: r.targetSize || "M",
              originalColor: originalColor,
              requestedColor: (r as any).targetColor || "N/A",
              qty: r.requestedQuantity || 1,
              originalPrice: r.productPrice,
              replacementPrice: r.productPrice,
              image: imgUrl
            }],
            defectImages: [r.defectImageUrl1, r.defectImageUrl2, r.defectImageUrl3].filter(Boolean) as string[],
            timeline: [
              { status: "PENDING", timestamp: r.createdAt || "2026-07-08 12:00", note: "Exchange request submitted." },
              r.resolvedAt ? { status: "COMPLETED", timestamp: r.resolvedAt, note: "Exchange resolved." } : null
            ].filter(Boolean) as any[]
          };
        });

        setExchanges(prev => {
          const merged = [...loaded];
          merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.id.localeCompare(a.id));
          const seen = new Set<string>();
          return merged.filter(e => {
            if (seen.has(e.id)) return false;
            seen.add(e.id);
            return true;
          });
        });
      } catch (err) {
        console.error("Failed to load exchange requests:", err);
      }
    }
    load();
  }, [token]);

  const active = exchanges.find(e => e.id === selectedExchangeId);

  const filtered = useMemo(() => exchanges.filter(e => {
    if (activeTab === "Pending Review" && e.approvalStatus !== "PENDING") return false;
    if (activeTab === "Active Logistics" && (e.approvalStatus === "PENDING" || e.approvalStatus === "COMPLETED" || e.approvalStatus === "REJECTED")) return false;
    if (activeTab === "Completed" && e.approvalStatus !== "COMPLETED") return false;
    const q = searchQuery.toLowerCase();
    return e.id.toLowerCase().includes(q) || e.orderId.toLowerCase().includes(q) || e.customerName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
  }), [exchanges, activeTab, searchQuery]);

  const paginated = useMemo(() => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filtered, currentPage]);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;

  const setSelectedId = (id: string | null) => {
    setSelectedExchangeId(id);
  };

  const updateApprovalStatus = async (id: string, s: ReturnStatus) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const numericId = parseInt(id.replace(/\D/g, ''), 10);
      const exchangeRequest = exchanges.find(r => r.id === id);
      const orderDbId = exchangeRequest?.orderDbId;

      if (s === "APPROVED" || s === "REJECTED") {
        await adminOrderApi.updateReturnStatus(numericId, s, token!);
      }
      if (s === "APPROVED" && orderDbId) {
        try {
          await adminOrderApi.updateOrderStatus(orderDbId, "EXCHANGE_INITIATED", token!);
        } catch (e) {
          console.warn("Parent order state transition ignored or failed:", e);
        }
      }
      setExchanges(prev => prev.map(e => {
        if (e.id !== id) return e;
        const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
        let dStatus = e.deliveryStatus;
        if (s === "APPROVED" && e.deliveryStatus === "EXCHANGE_INITIATED") {
          dStatus = "EXCHANGE_APPROVED";
        } else if (s === "RECEIVED") {
          dStatus = "RECEIVED_AT_WAREHOUSE";
        }
        return {
          ...e,
          approvalStatus: s,
          deliveryStatus: dStatus,
          timeline: [...e.timeline, { status: s, timestamp: ts, note: `Admin updated request status to: ${s}` }]
        };
      }));
    } catch (err: any) {
      console.error("Failed to update exchange approval status:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Unknown error";
      alert("Failed to update approval status: " + errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDeliveryStatus = async (id: string, ds: DeliveryStatus, trackingId?: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const numericId = parseInt(id.replace(/\D/g, ''), 10);
      const exchangeRequest = exchanges.find(r => r.id === id);
      const orderDbId = exchangeRequest?.orderDbId;

      const backendStatusMap: Partial<Record<DeliveryStatus, string>> = {
        "OUT_FOR_PICKUP": "EXCHANGE_PICKUPED",
        "RECEIVED_AT_WAREHOUSE": "EXCHANGE_SHIPPED", 
        "REPLACEMENT_DISPATCHED": "EXCHANGE_PACKED",
        "EXCHANGE_COMPLETED": "EXCHANGE_DELIVERED"
      };
      const backendStatus = backendStatusMap[ds];

      if (ds === "OUT_FOR_PICKUP" && orderDbId) {
        try {
          await adminOrderApi.updateOrderStatus(orderDbId, "EXCHANGE_INITIATED", token!);
        } catch (e) {
          console.warn("Pre-transition to EXCHANGE_INITIATED failed or was ignored:", e);
        }
      }

      if (ds === "REPLACEMENT_DISPATCHED" && trackingId && orderDbId) {
        await adminOrderApi.updateOrderTracking(orderDbId, trackingId, token!);
      }

      if (backendStatus && orderDbId) {
        await adminOrderApi.updateOrderStatus(orderDbId, backendStatus, token!);
      }

      if (ds === "EXCHANGE_COMPLETED") {
        const trackingNum = exchangeRequest?.trackingNumber || "EXCH-SHP-" + id;
        // Resolve exchange directly on the backend
        await adminOrderApi.resolveReturnRequest(numericId, "EXCHANGE", trackingNum, null, token!);
      }
      setExchanges(prev => prev.map(e => {
        if (e.id !== id) return e;
        const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
        let appStatus = e.approvalStatus;
        let payStatus = e.paymentStatus;
        if (ds === "EXCHANGE_COMPLETED") {
          if (appStatus === "APPROVED" || appStatus === "RECEIVED") {
            appStatus = "COMPLETED";
          }
          if (payStatus === "pending_payment") {
            payStatus = "paid";
          }
        }
        return {
          ...e,
          deliveryStatus: ds,
          approvalStatus: appStatus,
          paymentStatus: payStatus,
          trackingNumber: trackingId || e.trackingNumber,
          timeline: [...e.timeline, { status: ds, timestamp: ts, note: `Logistics update: exchange package is now ${ds.replaceAll("_", " ")}.` }]
        };
      }));
    } catch (err: any) {
      console.error("Failed to update exchange logistics status:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Unknown error";
      alert("Failed to update logistics stage: " + errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTracking = async (id: string, newTracking: string) => {
    try {
      const exchangeRequest = exchanges.find(r => r.id === id);
      const orderDbId = exchangeRequest?.orderDbId;
      if (!orderDbId) {
        alert("Cannot find parent order database ID for tracking update.");
        return;
      }
      await adminOrderApi.updateOrderTracking(orderDbId, newTracking, token!);
      setExchanges(prev => prev.map(e => {
        if (e.id !== id) return e;
        return {
          ...e,
          trackingNumber: newTracking
        };
      }));
    } catch (err: any) {
      console.error("Failed to update tracking details:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Unknown error";
      alert("Failed to save tracking details on backend: " + errMsg);
    }
  };

  const verifyPayment = async (id: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const numericId = parseInt(id.replace(/\D/g, ''), 10);
      // Mock payment verification resolves completed exchanges
      await adminOrderApi.resolveReturnRequest(numericId, "EXCHANGE", "EXCH-SHP-" + id, null, token!);
      setExchanges(prev => prev.map(e => {
        if (e.id !== id) return e;
        const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
        return {
          ...e,
          paymentStatus: "paid",
          timeline: [...e.timeline, { status: e.approvalStatus, timestamp: ts, note: `Additional payment of ${RS}${e.adjustmentAmount} verified by admin.` }]
        };
      }));
    } catch (err) {
      console.error("Failed to verify exchange payment on backend:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTransactionId = (id: string, val: string) => setExchanges(prev => prev.map(e => e.id === id ? { ...e, transactionId: val } : e));

  const resolveExchangeRefund = async (id: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const e = exchanges.find(x => x.id === id);
      if (!e) return;
      
      // Resolve negative adjustment payout refunds
      await adminOrderApi.resolveReturnRequest(Number(id), "EXCHANGE", "", e.transactionId || null, token!);
      setExchanges(prev => prev.map(e => {
        if (e.id !== id) return e;
        const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
        return {
          ...e,
          transactionId: e.transactionId,
          paymentStatus: "refunded",
          timeline: [...e.timeline, { status: e.approvalStatus, timestamp: ts, note: `Refund payout of ${RS}${Math.abs(e.adjustmentAmount)} confirmed.` }]
        };
      }));
    } catch (err) {
      console.error("Failed to submit refund proof on backend:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = exchanges.filter(e => e.approvalStatus === "PENDING").length;
  const activeLogisticsCount = exchanges.filter(e => e.approvalStatus === "APPROVED" || e.approvalStatus === "RECEIVED").length;
  const completedCount = exchanges.filter(e => e.approvalStatus === "COMPLETED").length;
  const totalItems = exchanges.reduce((s, e) => s + e.items.reduce((a, i) => a + i.qty, 0), 0);

  return (
    <div className="space-y-6 font-sans">

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Exchanges", value: exchanges.length.toString(), trend: "up" as const, change: `${totalItems} items`, subtitle: "All time exchange requests" },
          { label: "Pending Review", value: pendingCount.toString(), trend: pendingCount > 0 ? "down" as const : "up" as const, change: `${exchanges.length > 0 ? Math.round((pendingCount / exchanges.length) * 100) : 0}% share`, subtitle: "Awaiting review approval" },
          { label: "Active Logistics", value: activeLogisticsCount.toString(), trend: "up" as const, change: `${exchanges.length > 0 ? Math.round((activeLogisticsCount / exchanges.length) * 100) : 0}% share`, subtitle: "Logistics in execution" },
          { label: "Completed", value: completedCount.toString(), trend: "up" as const, change: `${exchanges.length > 0 ? Math.round((completedCount / exchanges.length) * 100) : 0}% rate`, subtitle: "Exchanges fulfilled" },
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

      {/* ─── Exchanges Table ─── */}
      <div className="bg-card border border-neutral-200/80 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200/80 bg-background/60 text-[9.5px] text-[#615e56] font-bold tracking-[0.12em] uppercase">
              <th className="p-4">Exch. ID</th>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Item Swap details</th>

              <th className="p-4">Review Status</th>
              <th className="p-4">Logistics status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100/80">
            {paginated.map(exc => (
              <tr key={exc.id} onClick={() => setSelectedId(exc.id)} className="hover:bg-[#224870]/5 transition-colors cursor-pointer">
                <td className="p-4 font-mono text-[10.5px] text-[#224870] font-black">{exc.id}</td>
                <td className="p-4 font-mono text-[10px] text-neutral-600 font-bold">{exc.orderId}</td>
                <td className="p-4">
                  <p className="font-bold text-[11px] text-[#382d24]">{exc.customerName}</p>
                  <p className="text-[9.5px] text-[#615e56] mt-0.5">{exc.email}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2.5">
                    <img src={exc.items[0]?.image} alt="" className="w-9 h-9 object-cover border border-neutral-200 shrink-0" />
                    <div>
                      <p className="text-[10.5px] font-bold text-[#382d24] leading-tight">{exc.items[0]?.name}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-sm">
                          {exc.items[0]?.originalColor && exc.items[0]?.originalColor !== "N/A" ? exc.items[0]?.originalColor + " " : ""}{exc.items[0]?.originalSize}
                        </span>
                        <span className="text-[8.5px] text-neutral-400 font-bold">→</span>
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-[#224870]/10 text-[#224870] rounded-sm">
                          {exc.items[0]?.requestedColor && exc.items[0]?.requestedColor !== "N/A" ? exc.items[0]?.requestedColor + " " : ""}{exc.items[0]?.requestedSize}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-4"><ApprovalStatusBadge status={exc.approvalStatus} /></td>
                <td className="p-4">
                  <LogisticsStatusBadge status={exc.deliveryStatus} />
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-[11px] text-[#615e56] font-bold uppercase tracking-widest">
                  No exchange requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── Pagination ─── */}
      <div className="flex items-center justify-between">
        <p className="text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider">
          Showing {paginated.length} of {filtered.length} exchanges
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

      {/* ─── Exchange Detail Slide-in Panel ─── */}
      {active && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelectedId(null)}>
          <div className="flex-1 bg-black/30 backdrop-blur-[2px]" />
          <div className="w-full max-w-[500px] bg-white h-full overflow-y-auto flex flex-col shadow-2xl border-l border-neutral-200" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="sticky top-0 bg-white z-20 px-6 py-5 border-b border-neutral-200/60 flex items-start justify-between">
              <div>
                <span className="text-[8.5px] font-bold tracking-[0.3em] text-[#615e56] uppercase block">Exchange Request</span>
                <h2 className="text-lg font-bold text-[#382d24] uppercase tracking-tight mt-0.5">{active.id}</h2>
                <p className="text-[10px] text-[#615e56] font-semibold mt-1">Order {active.orderId} · {active.date}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="w-8 h-8 flex items-center justify-center border border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-[#382d24] bg-transparent cursor-pointer rounded-full transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 px-6 py-6 space-y-6">

              {/* Customer */}
              <div className="bg-card border border-neutral-200/80 p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-[#224870]/10 flex items-center justify-center shrink-0">
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
                  <LogisticsStatusBadge status={active.deliveryStatus} />
                </div>
              </div>

              {/* Step 1: Administrative Approval review (when Pending) */}
              {active.approvalStatus === "PENDING" && (
                <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-sm space-y-3">
                  <div className="flex items-center gap-2 text-amber-700 font-extrabold text-[10px] uppercase">
                    <ShieldAlert className="w-4.5 h-4.5" /> Administrative Approval Needed
                  </div>
                  <p className="text-[10px] text-[#615e56] leading-relaxed">
                    Verify request variant defect claims. Approving begins the logistics courier pickup journey.
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

              {/* Reason for Exchange Highlighted */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">Reason for Exchange</p>
                </div>
                <p className="text-[12px] font-bold text-amber-900 leading-snug">{active.reason}</p>
                
                {/* Defect Images */}
                {active.defectImages && active.defectImages.length > 0 && (
                  <div className="mt-3 border-t border-amber-200/50 pt-3">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-amber-800 mb-2">Customer Uploaded Photos</p>
                    <div className="flex gap-2">
                      {active.defectImages.map((img, idx) => (
                        <a key={idx} href={img} target="_blank" rel="noreferrer" className="block">
                          <img src={img} alt="Defect" className="w-12 h-12 object-cover border border-amber-200 rounded-sm hover:opacity-80 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Items with size swap */}
              <div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-3">Exchange Item</span>
                {active.items.map((item, i) => (
                  <div key={i} className="border border-neutral-200/80 bg-card">
                    <div className="p-3.5 flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover border border-neutral-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#382d24] uppercase tracking-wide truncate">{item.name}</p>
                        <p className="text-[9.5px] text-[#615e56] mt-0.5">SKU: {item.sku} · Qty: <strong className="text-[#382d24]">{item.qty}</strong></p>
                      </div>
                    </div>
                    {/* Size swap row */}
                    <div className="border-t border-neutral-200/60 p-4 bg-background/40 grid grid-cols-2 gap-4">
                      {/* Left: Original */}
                      <div className="border-r border-neutral-200/60 pr-2">
                        <p className="text-[8.5px] font-bold uppercase tracking-widest text-red-600 mb-2">Original Choice</p>
                        <div className="space-y-1 text-[10px]">
                          <p className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-neutral-400" /> Size: <strong className="text-[#382d24]">{item.originalSize}</strong></p>
                          <p className="flex items-center gap-1.5"><Palette className="w-3.5 h-3.5 text-neutral-400" /> Variant / Color: <strong className="text-[#382d24]">{item.originalColor}</strong></p>
                        </div>
                      </div>

                      {/* Right: Requested */}
                      <div className="pl-2">
                        <p className="text-[8.5px] font-bold uppercase tracking-widest text-green-700 mb-2">Replacement Choice</p>
                        <div className="space-y-1 text-[10px]">
                          <p className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-neutral-400" /> Size: <strong className="text-[#382d24]">{item.requestedSize}</strong></p>
                          <p className="flex items-center gap-1.5"><Palette className="w-3.5 h-3.5 text-neutral-400" /> Variant / Color: <strong className="text-[#382d24]">{item.requestedColor}</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>



              {/* Step 2: Physical courier logistics tracking */}
              {active.approvalStatus !== "PENDING" && active.approvalStatus !== "REJECTED" && (
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase block mb-4">Package Logistics Tracking</span>
                  <div className="relative">
                    <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-neutral-100" />
                    {DELIVERY_STAGES.map((stage, idx) => {
                      const stageIdx = DELIVERY_STAGES.findIndex(s => s.key === active.deliveryStatus);
                      const isDone = idx <= stageIdx;
                      const isCurrent = idx === stageIdx;
                      const isClickable = idx === stageIdx + 1;
                      const log = active.timeline.find(t => t.status === stage.key);
                      const Icon = stage.icon;
                      return (
                        <div key={stage.key} className="relative flex items-start gap-4 pb-5">
                          <button
                            disabled={!isClickable || isSubmitting}
                            onClick={() => {
                              if (!isDone) {
                                setPendingStageChange({ id: active.id, stage: stage.key });
                              }
                            }}
                            className={`relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                              isCurrent ? "bg-[#224870] border-[#224870] text-white shadow-md scale-105" :
                              isDone ? "bg-white border-[#224870] text-[#224870]" :
                              isClickable ? "bg-white border-[#224870]/60 text-[#224870]/60 hover:bg-[#224870]/5" :
                              "bg-white border-neutral-200 text-neutral-300"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isDone && !isCurrent ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                          </button>
                          <div className="flex-1 min-w-0 pt-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-[10.5px] font-bold uppercase tracking-wide ${isCurrent ? "text-[#224870]" : isDone ? "text-[#382d24]" : "text-neutral-300"}`}>{stage.label}</p>
                              {isCurrent && <span className="text-[7.5px] font-bold uppercase tracking-widest bg-[#224870]/10 text-[#224870] px-2 py-0.5 rounded-full">Active</span>}
                            </div>
                            {log && (
                              <div className="text-[8.5px] font-semibold text-neutral-400 mt-1 flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {log.timestamp}</span>
                                {stage.key === "REPLACEMENT_DISPATCHED" && (
                                  <>
                                    {active.trackingNumber ? (
                                      <span className="inline-flex items-center gap-1 bg-[#224870]/10 text-[#224870] px-1.5 py-0.5 rounded-sm">
                                        Tracking: <strong className="text-[#382d24]">{active.trackingNumber}</strong>
                                        <button
                                          onClick={() => {
                                            const newTracking = prompt("Edit Courier Tracking ID:", active.trackingNumber);
                                            if (newTracking !== null && newTracking.trim()) {
                                              handleEditTracking(active.id, newTracking.trim());
                                            }
                                          }}
                                          className="text-neutral-500 hover:text-neutral-700 underline ml-1 cursor-pointer bg-transparent border-none p-0 text-[8.5px] font-bold"
                                        >
                                          Edit
                                        </button>
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          const newTracking = prompt("Enter Courier Tracking ID:");
                                          if (newTracking !== null && newTracking.trim()) {
                                            handleEditTracking(active.id, newTracking.trim());
                                          }
                                        }}
                                        className="text-[#224870] hover:underline cursor-pointer bg-transparent border-none p-0 text-[8.5px] font-bold"
                                      >
                                        + Add Tracking ID
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Logistics Stage */}
      {pendingStageChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-[13px] font-black text-[#382d24] uppercase tracking-wide">Update Stage?</h3>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Are you sure you want to change the logistics stage?</p>
                </div>
              </div>
              <div className="bg-neutral-50 p-3 rounded-md border border-neutral-100 mb-5">
                <p className="text-[11px] font-bold text-center text-[#224870]">
                  New Stage: {DELIVERY_STAGES.find(s => s.key === pendingStageChange.stage)?.label}
                </p>
              </div>

              {pendingStageChange.stage === "REPLACEMENT_DISPATCHED" && (
                <div className="mb-5">
                  <label className="block text-[9.5px] font-bold uppercase tracking-widest text-[#382d24] mb-2">Courier Tracking ID</label>
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. EXCH-SHP-010)"
                    className="w-full border border-neutral-200 p-2.5 text-[11px] font-medium outline-none focus:border-[#224870] rounded-sm"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPendingStageChange(null);
                    setTrackingInput("");
                  }}
                  disabled={isSubmitting}
                  className="flex-1 bg-white border border-neutral-200 text-neutral-600 text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-sm hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (pendingStageChange.stage === "REPLACEMENT_DISPATCHED" && !trackingInput.trim()) {
                      alert("Please enter a Courier Tracking ID.");
                      return;
                    }
                    await updateDeliveryStatus(pendingStageChange.id, pendingStageChange.stage, trackingInput.trim());
                    setPendingStageChange(null);
                    setTrackingInput("");
                  }}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#224870] hover:bg-[#1a3857] text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                  ) : (
                    "Yes, Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
