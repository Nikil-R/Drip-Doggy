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
  receiptScreenshot?: string | null;
  emailSent?: boolean;
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

const initialReturns: ReturnRequest[] = [
  {
    id: "RET-1082", orderId: "#DD-6545", customerName: "Ananya Sharma",
    email: "ananya.s@gmail.com", phone: "+91 98765 43210", date: "2026-06-25", amount: 5800,
    reason: "Size is too large, fabric feels heavy.",
    approvalStatus: "PENDING",
    deliveryStatus: "RETURN_INITIATED",
    items: [{ name: "Structured Canvas Jacket", sku: "DD-STR-001", size: "L", qty: 1, price: 5800, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=200&auto=format&fit=crop" }],
    refundMethod: "bank_transfer",
    refundDetails: { accountHolderName: "Ananya Sharma", bankName: "State Bank of India", accountNumber: "12345678901", ifscCode: "SBIN0000001" },
    timeline: [{ status: "PENDING", timestamp: "2026-06-25 14:30", note: "Customer submitted return request online. Status set to Pending." }]
  },
  {
    id: "RET-1081", orderId: "#DD-6543", customerName: "Rohan Mehta",
    email: "rohan.mehta@yahoo.com", phone: "+91 91234 56789", date: "2026-06-24", amount: 3200,
    reason: "Colour discrepancy from website photo.",
    approvalStatus: "APPROVED",
    deliveryStatus: "OUT_FOR_PICKUP",
    items: [{ name: "Everyday Relaxed Shift Dress", sku: "DD-EVE-002", size: "M", qty: 1, price: 3200, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&auto=format&fit=crop" }],
    refundMethod: "upi",
    refundDetails: { upiId: "rohanmehta@okaxis", phoneNumber: "+91 91234 56789" },
    timeline: [
      { status: "PENDING", timestamp: "2026-06-24 10:15", note: "Customer submitted return request." },
      { status: "APPROVED", timestamp: "2026-06-24 16:00", note: "Admin approved return request." },
      { status: "OUT_FOR_PICKUP", timestamp: "2026-06-25 11:00", note: "Courier package collected from customer." }
    ]
  },
  {
    id: "RET-1080", orderId: "#DD-6541", customerName: "Priya Patel",
    email: "priya.p@gmail.com", phone: "+91 98989 89898", date: "2026-06-22", amount: 4500,
    reason: "Defective stitching on left side seam.",
    approvalStatus: "COMPLETED",
    deliveryStatus: "REFUND_COMPLETED",
    items: [{ name: "Modern Oversized Knitwear", sku: "DD-MOD-003", size: "S", qty: 1, price: 4500, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" }],
    refundMethod: "qr_code",
    refundDetails: { qrCodeImage: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=200&auto=format&fit=crop" },
    timeline: [
      { status: "PENDING", timestamp: "2026-06-22 09:00", note: "Return request submitted." },
      { status: "APPROVED", timestamp: "2026-06-22 13:00", note: "Admin approved request." },
      { status: "OUT_FOR_PICKUP", timestamp: "2026-06-23 14:00", note: "Pickup completed." },
      { status: "RECEIVED_AT_WAREHOUSE", timestamp: "2026-06-25 16:30", note: "Received at warehouse." },
      { status: "COMPLETED", timestamp: "2026-06-26 12:00", note: "Refund paid out." }
    ]
  }
];

function ApprovalStatusBadge({ status }: { status: ReturnStatus }) {
  const m = APPROVAL_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.dot}`} />
      {m.label}
    </span>
  );
}

import { adminOrderApi, AdminReturnResponse } from "../lib/admin-order-api";

export function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>(initialReturns);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Pending Review" | "Active Logistics" | "Completed">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState("");
  const ITEMS_PER_PAGE = 5;
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const backendRequests = await adminOrderApi.getAllReturnRequests(token!);
        if (!backendRequests) return;

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

          let mappedMethod: "qr_code" | "upi" | "bank_transfer" = "bank_transfer";
          if (r.qrCodeImageUrl) mappedMethod = "qr_code";
          else if (r.upiId || r.upiPhone) mappedMethod = "upi";

          return {
            id: String(r.id),
            orderId: r.orderNumber,
            customerName: r.customerName || "Customer",
            email: r.customerEmail || "",
            phone: r.customerEmail || "",
            date: r.createdAt?.split("T")?.[0] || "2026-07-08",
            amount: r.productPrice * r.productQuantity,
            reason: r.cancelReason || "No reason provided",
            approvalStatus: mappedApproval,
            deliveryStatus: mappedDelivery,
            items: [{
              name: r.productName,
              sku: `DD-VAR-${r.orderItemId}`,
              size: r.productSize || "M",
              qty: r.productQuantity || 1,
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
            ].filter(Boolean) as any[]
          };
        });

        setReturns(prev => {
          const merged = [...loaded, ...initialReturns];
          const seen = new Set<string>();
          return merged.filter(r => {
            if (seen.has(r.id)) return false;
            seen.add(r.id);
            return true;
          });
        });
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
    }
  };

  // Handles updating physical logistics timeline tracking
  const updateDeliveryStatus = async (id: string, ds: DeliveryStatus) => {
    try {
      // If setting resolved states like received at warehouse, we map to status endpoint updates
      if (ds === "RECEIVED_AT_WAREHOUSE") {
        await adminOrderApi.updateReturnStatus(Number(id), "RECEIVED", token!);
      }
      setReturns(prev => prev.map(r => {
        if (r.id !== id) return r;
        const ts = new Date().toISOString().replace("T", " ").substring(0, 16);
        
        // Auto transition approval status to RECEIVED once courier drops it back
        let appStatus = r.approvalStatus;
        if (ds === "RECEIVED_AT_WAREHOUSE" && appStatus === "APPROVED") {
          appStatus = "RECEIVED";
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
    }
  };

  const uploadProof = (id: string, url: string) => setReturns(prev => prev.map(r => r.id === id ? { ...r, receiptScreenshot: url } : r));

  const handleConfirmRefundPayout = async () => {
    if (!active) return;
    setSendingEmail(true);
    setEmailStatusMessage("Resolving return request & transferring payout proof...");

    try {
      // 1. Convert base64 mockup or screenshot url to File payload
      let receiptFile: File | null = null;
      if (active.receiptScreenshot) {
        // Mock a File if it's already a string reference, or fetch file object
        const response = await fetch(active.receiptScreenshot);
        const blob = await response.blob();
        receiptFile = new File([blob], `refund_receipt_${active.id}.png`, { type: "image/png" });
      }

      // 2. Resolve on backend (action: REFUND, passes proof image)
      await adminOrderApi.resolveReturnRequest(
        Number(active.id),
        "REFUND",
        "",
        receiptFile,
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
                <td className="p-4 font-mono text-[10.5px] text-[#224870] font-black">{ret.id}</td>
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
                <td className="p-4 text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider">
                  {ret.deliveryStatus.replace("RETURN_", "").replace("_", " ")}
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
                <div className="w-9 h-9 rounded-full bg-[#224870]/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#224870]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[12px] text-[#382d24]">{active.customerName}</p>
                  <p className="text-[9.5px] text-[#615e56] mt-0.5">{active.email}</p>
                  <p className="text-[9.5px] text-[#615e56]">{active.phone}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <ApprovalStatusBadge status={active.approvalStatus} />
                  <span className="text-[8px] font-black uppercase bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-sm">
                    {active.deliveryStatus.replace("RETURN_", "").replace("_", " ")}
                  </span>
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
                      const log = active.timeline.find(t => t.status === stage.key);
                      const Icon = stage.icon;
                      return (
                        <div key={stage.key} className="relative flex items-start gap-4 pb-5">
                          <button
                            onClick={() => updateDeliveryStatus(active.id, stage.key)}
                            className={`relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
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
                              {isCurrent && <span className="text-[7.5px] font-bold uppercase tracking-widest bg-[#224870]/10 text-[#224870] px-2 py-0.5 rounded-full">Active</span>}
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
                  {active.receiptScreenshot ? (
                    <div className="space-y-3">
                      <div className="border border-green-200 bg-green-50 p-4 flex items-center gap-3 rounded-sm">
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[9.5px] font-bold uppercase tracking-widest text-green-700">Proof Uploaded</p>
                          <p className="text-[9.5px] text-green-600 font-semibold mt-0.5">Transaction receipt recorded.</p>
                        </div>
                        <img src={active.receiptScreenshot} alt="Proof" className="w-12 h-12 object-cover border border-green-200" />
                      </div>

                      {active.approvalStatus !== "COMPLETED" && (
                        <button
                          onClick={() => setShowConfirmModal(true)}
                          className="w-full bg-[#224870] hover:bg-[#1a3858] text-white text-[9.5px] font-black uppercase tracking-wider py-2.5 px-4 rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                        >
                          <Mail className="w-4 h-4" /> Confirm & Send Email to Customer
                        </button>
                      )}

                      {active.approvalStatus === "COMPLETED" && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold bg-green-50 border border-green-200 p-2.5 rounded-sm">
                          <Check className="w-4 h-4" /> Refund complete. Email notifications sent successfully.
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="flex items-center gap-3 border-2 border-dashed border-neutral-200 hover:border-[#224870] p-4 cursor-pointer transition-all group bg-card hover:bg-[#224870]/3">
                      <div className="w-9 h-9 bg-neutral-100 group-hover:bg-[#224870]/10 flex items-center justify-center transition-all shrink-0">
                        <Upload className="w-4 h-4 text-neutral-400 group-hover:text-[#224870] transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#615e56] group-hover:text-[#224870] transition-colors">Upload Receipt Screenshot</p>
                        <p className="text-[9.5px] text-[#615e56] font-semibold mt-0.5">Attach bank transaction proof to unlock confirmation.</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadProof(active.id, URL.createObjectURL(f)); }} />
                    </label>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

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
                {sendingEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Yes, Send Receipt"}
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
