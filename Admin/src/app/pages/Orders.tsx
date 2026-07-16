import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Clock, CheckCircle2, XCircle, Truck, Check, Edit2,
  ChevronLeft, ChevronRight, Download, User, MapPin, X,
  FileText, Mail, Phone, TrendingUp, TrendingDown, DollarSign, ShoppingCart, AlertCircle, Calendar,
  Banknote, ArrowLeftRight, Upload
} from "lucide-react";
import { INVOICE_CONFIG } from "../lib/invoice-config";
import { customerApi } from "../lib/customer-api";
import { useAuthStore } from "@/app/store/auth-store";

const RS = "₹";

interface OrderItem {
  name: string;
  sku: string;
  size: string;
  qty: number;
  price: number;
  image: string;
}

type RefundMethod = "qr_code" | "upi" | "bank_transfer";

interface CustomerRefundDetails {
  method: RefundMethod;
  qrCodeImage?: string;
  upiId?: string;
  phoneNumber?: string;
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

interface ReturnRequest {
  reason: string;
  refundDetails: CustomerRefundDetails;
  submittedAt: string;
  status: "pending" | "approved" | "completed" | "rejected";
}

interface Order {
  no: number;
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  payment: "Paid" | "Unpaid" | "Refunded";
  status: "Placed" | "Processing" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled" | "Return Requested" | "Exchange Requested";
  delivery: string;
  // Full address fields
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  deliveryPhone: string;
  items: OrderItem[];
  trackingNumber?: string;
  notes?: string;
  returnRequest?: ReturnRequest;
  customerBankDetails?: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    submittedAt?: string;
  };
  // Stage timestamp fields from backend
  stageTimestamps?: {
    placedAt?: string;
    processingAt?: string;
    packedAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
  };
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
    addressLine1: "Apt 4B, Sea Breeze Apartments",
    addressLine2: "Carter Road, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400050",
    country: "India",
    deliveryPhone: "+91 99999 88888",
    trackingNumber: "DEL-847294",
    notes: "Signature packaging requested.",
    customerBankDetails: {
      accountHolderName: "Ananya Sharma",
      bankName: "State Bank of India",
      accountNumber: "12345678901",
      ifscCode: "SBIN0001234",
      submittedAt: "2026-06-25 14:32"
    },
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
    addressLine1: "Flat 202, Royal Residency",
    addressLine2: "12th Main Road, Indiranagar",
    city: "Delhi",
    state: "Delhi",
    postalCode: "110001",
    country: "India",
    deliveryPhone: "+91 98765 00001",
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
    status: "Packed",
    delivery: "Bangalore, KA",
    addressLine1: "House 15, GK II",
    addressLine2: "Outer Ring Road, Greater Kailash",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "560038",
    country: "India",
    deliveryPhone: "+91 77777 66666",
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
    addressLine1: "Villa 33, Jubilee Hills",
    addressLine2: "Road No. 10",
    city: "Hyderabad",
    state: "Telangana",
    postalCode: "500033",
    country: "India",
    deliveryPhone: "+91 95555 44444",
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
    status: "Placed",
    delivery: "Chennai, TN",
    addressLine1: "55, Anna Nagar",
    addressLine2: "2nd Main Road",
    city: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600040",
    country: "India",
    deliveryPhone: "+91 94444 33333",
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
    delivery: "Kolkata, WB",
    addressLine1: "Block A, Flat 7",
    addressLine2: "Salt Lake Sector II",
    city: "Kolkata",
    state: "West Bengal",
    postalCode: "700091",
    country: "India",
    deliveryPhone: "+91 91111 22222",
    status: "Return Requested",
    returnRequest: {
      reason: "Defective / Damaged",
      refundDetails: {
        method: "bank_transfer",
        accountHolderName: "Kabir Singh",
        bankName: "HDFC Bank",
        accountNumber: "98765432109",
        ifscCode: "HDFC0004321"
      },
      submittedAt: "2026-06-23 10:15",
      status: "pending"
    },
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
    addressLine1: "Apt 89, Koregaon Heights",
    addressLine2: "North Main Road, Koregaon Park",
    city: "Pune",
    state: "Maharashtra",
    postalCode: "411001",
    country: "India",
    deliveryPhone: "+91 93333 22222",
    notes: "Customer cancelled prior to shipping.",
    items: [
      { name: "French Terry Hoodie", sku: "DD-FTH-001", size: "M", qty: 1, price: 3200, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=120&auto=format&fit=crop" }
    ]
  },
  {
    no: 8,
    id: "#DD-7012",
    customer: "Maya Joshi",
    email: "maya.joshi@gmail.com",
    phone: "+91 98877 66554",
    date: "2026-06-18",
    payment: "Paid",
    status: "Return Requested",
    delivery: "Jaipur, RJ",
    addressLine1: "B-45, Civil Lines",
    addressLine2: "Sector 6",
    city: "Jaipur",
    state: "Rajasthan",
    postalCode: "302001",
    country: "India",
    deliveryPhone: "+91 91122 33445",
    returnRequest: {
      reason: "Wrong Size — Ordered M, fits too large",
      refundDetails: {
        method: "bank_transfer",
        accountHolderName: "Maya Joshi",
        bankName: "ICICI Bank",
        accountNumber: "45678901234",
        ifscCode: "ICIC0005678"
      },
      submittedAt: "2026-06-20 09:15",
      status: "pending"
    },
    items: [
      { name: "Ribbed Panel Dress", sku: "DD-RPD-001", size: "M", qty: 1, price: 3900, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=120&auto=format&fit=crop" }
    ]
  },
  {
    no: 9,
    id: "#DD-7123",
    customer: "Rohan Desai",
    email: "rohan.d@gmail.com",
    phone: "+91 92233 44556",
    date: "2026-06-15",
    payment: "Paid",
    status: "Return Requested",
    delivery: "Ahmedabad, GJ",
    addressLine1: "12, Riverfront Apartments",
    addressLine2: "Nehru Nagar",
    city: "Ahmedabad",
    state: "Gujarat",
    postalCode: "380001",
    country: "India",
    deliveryPhone: "+91 97788 66554",
    returnRequest: {
      reason: "Defective Item — Zipper broken",
      refundDetails: {
        method: "upi",
        upiId: "rohan.d@paytm",
        phoneNumber: "+91 92233 44556"
      },
      submittedAt: "2026-06-17 14:30",
      status: "pending"
    },
    items: [
      { name: "Structured Canvas Jacket", sku: "DD-STR-001", size: "L", qty: 1, price: 5800, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=120&auto=format&fit=crop" }
    ]
  }
];

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center py-1.5 px-2.5 text-[9.5px]">
      <span className="text-neutral-400 font-bold uppercase tracking-wider text-[8px]">{label}</span>
      <span className="text-[#382d24] font-black">{value}</span>
    </div>
  );
}

function maskAccountNumber(num?: string) {
  if (!num) return "";
  if (num.length <= 4) return num;
  return "••••" + num.slice(-4);
}

function PaymentBadge({ val }: { val: string }) {
  const label = val === "Paid" ? "COD - Paid" : val === "Refunded" ? "COD - Refunded" : "COD - Unpaid";
  return (
    <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase">
      <span className={`w-2 h-2 rounded-full ${val === "Paid" ? "bg-green-500" : val === "Refunded" ? "bg-neutral-400" : "bg-red-500"}`} />
      <span className={val === "Paid" ? "text-green-700" : val === "Refunded" ? "text-neutral-500" : "text-red-500"}>{label}</span>
    </span>
  );
}

function StatusBadge({ val }: { val: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-green-50 text-green-700 border-green-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    "Out for Delivery": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Delivery: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-neutral-50 text-neutral-700 border-neutral-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
    "Return Requested": "bg-purple-50 text-purple-700 border-purple-200",
  };
  const icons: Record<string, React.ReactNode> = {
    Delivered: <CheckCircle2 className="w-3.5 h-3.5" />,
    Shipped: <Truck className="w-3 h-3" />,
    "Out for Delivery": <Truck className="w-3 h-3 text-indigo-600 animate-pulse" />,
    Delivery: <Truck className="w-3 h-3 text-indigo-600 animate-pulse" />,
    Processing: <Clock className="w-3 h-3" />,
    Pending: <Clock className="w-3 h-3" />,
    Cancelled: <XCircle className="w-3 h-3" />,
    "Return Requested": <ArrowLeftRight className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9.5px] font-bold tracking-wider border uppercase rounded-full ${styles[val] || "bg-neutral-50 text-neutral-700 border-neutral-200"}`}>
      {icons[val]}{val}
    </span>
  );
}

import { adminOrderApi, AdminOrderResponse } from "../lib/admin-order-api";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    async function loadBackendOrders() {
      try {
        const orderResponses = await adminOrderApi.getAllOrders(token!);
        console.log("getAllOrders raw response:", orderResponses);
        if (!orderResponses || orderResponses.length === 0) {
          console.log("No orders returned from API");
          setOrders([]);
          return;
        }

        const backendOrders: Order[] = [];
        let indexNo = initialOrders.length + 1;

        for (const oRes of orderResponses) {
          let mappedPayment: "Paid" | "Unpaid" | "Refunded" = "Unpaid";
          const payUpper = oRes.paymentStatus?.toUpperCase() || "";
          if (payUpper === "PAID" || payUpper === "COMPLETED") mappedPayment = "Paid";
          else if (payUpper === "REFUNDED") mappedPayment = "Refunded";

          let mappedStatus: Order["status"] = "Placed";
          const sUpper = oRes.deliveryStatus?.toUpperCase() || "";
          let hasActiveReturnRequest = false;

          if (sUpper === "DELIVERED") mappedStatus = "Delivered";
          else if (sUpper === "OUT_FOR_DELIVERY" || sUpper === "OUT FOR DELIVERY" || sUpper === "DELIVERY") mappedStatus = "Delivery";
          else if (sUpper === "SHIPPED") mappedStatus = "Shipped";
          else if (sUpper === "PACKED") mappedStatus = "Packed";
          else if (sUpper === "PROCESSING") mappedStatus = "Processing";
          else if (sUpper === "PLACED" || sUpper === "PENDING") mappedStatus = "Placed";
          else if (sUpper === "CANCELLED" || sUpper === "CANCELED") mappedStatus = "Cancelled";
          else if (sUpper === "RETURN_REQUESTED" || sUpper.startsWith("RETURN_") || sUpper.startsWith("EXCHANGE_")) {
            // Under return request, keep parent status as Delivered but flag the active return request
            mappedStatus = "Delivered";
            hasActiveReturnRequest = true;
          }

          const itemsList: OrderItem[] = oRes.items.map((item: any) => ({
            name: item.name || item.productName || "Unknown Product",
            sku: item.sku || "N/A",
            size: item.size || "M",
            qty: Number(item.qty ?? item.quantity ?? 1),
            price: Number(item.price ?? item.rate ?? 0),
            image: item.image || item.imageUrl || ""
          }));

          backendOrders.push({
            no: indexNo++,
            id: oRes.orderNumber,
            customer: oRes.customerName || "Customer",
            email: oRes.customerEmail || "",
            phone: oRes.phoneNumber || "",
            date: oRes.orderTimestamp?.split("T")?.[0] || oRes.orderTimestamp?.split(" ")?.[0] || "2026-07-08",
            payment: mappedPayment,
            status: mappedStatus,
            delivery: oRes.destinationAddress || "Unspecified",
            addressLine1: oRes.destinationAddress || "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            deliveryPhone: oRes.phoneNumber || "",
            items: itemsList,
            trackingNumber: oRes.trackingNumber || "",
            notes: "",
            // Additional raw amounts mapped for detail breakdown
            subTotalAmount: oRes.totalAmount - oRes.tax - oRes.shippingFee - oRes.platformFee + oRes.discount,
            discountAmount: oRes.discount,
            taxAmount: oRes.tax,
            platformAmount: oRes.platformFee,
            shippingAmount: oRes.shippingFee,
            totalAmount: oRes.totalAmount,
            hasActiveReturnRequest,
            // Stage timestamps from backend for Order Progress timeline
            stageTimestamps: {
              placedAt: oRes.pendingAt || oRes.orderTimestamp || undefined,
              processingAt: oRes.processingAt || undefined,
              packedAt: undefined, // Backend does not track packed timestamp separately
              shippedAt: oRes.shippedAt || undefined,
              deliveredAt: oRes.deliveredAt || undefined,
              cancelledAt: oRes.cancelledAt || undefined
            }
          } as any);
        }

        console.log("Setting backendOrders mapped values:", backendOrders);
        // Sort dynamic backend orders newest first (descending)
        backendOrders.sort((a, b) => {
          const timeA = new Date(a.stageTimestamps?.placedAt || a.date || 0).getTime();
          const timeB = new Date(b.stageTimestamps?.placedAt || b.date || 0).getTime();
          return timeB - timeA;
        });
        setOrders(backendOrders);
      } catch (err) {
        console.error("Failed to load dynamic backend orders:", err);
      }
    }

    loadBackendOrders();
  }, [token]);

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [panelTracking, setPanelTracking] = useState("");
  const [panelNotes, setPanelNotes] = useState("");
  const [pendingStatusChange, setPendingStatusChange] = useState<{ status: Order["status"] } | null>(null);
  const [showTrackingRequiredAlert, setShowTrackingRequiredAlert] = useState(false);
  const [showEmailDispatchedAlert, setShowEmailDispatchedAlert] = useState<{ email: string; trackingId: string; customerName: string } | null>(null);
  const [showSequenceErrorAlert, setShowSequenceErrorAlert] = useState<{ targetStage: string; requiredStage: string } | null>(null);
  const [showTrackingSavedAlert, setShowTrackingSavedAlert] = useState(false);
  const [isTrackingLocked, setIsTrackingLocked] = useState(true);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundConfirmed, setRefundConfirmed] = useState(false);
  const [showRefundSuccess, setShowRefundSuccess] = useState(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [returnApproveConfirmOrder, setReturnApproveConfirmOrder] = useState<Order | null>(null);
  const [returnRejectConfirmOrder, setReturnRejectConfirmOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [adminTxId, setAdminTxId] = useState("");
  const [adminReceiptScreenshot, setAdminReceiptScreenshot] = useState<string | null>(null);
  const [showReturnSuccessAlert, setShowReturnSuccessAlert] = useState<{ email: string; txId: string; customerName: string; receiptScreenshot: string | null } | null>(null);

  // Dashboard-style calendar
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
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

  const getOrderBreakdown = (order: Order) => {
    let subtotal = 0;
    if (order.items && order.items.length > 0) {
      if ((order as any).subTotalAmount !== undefined) {
        subtotal = (order as any).subTotalAmount;
      } else {
        subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      }
    }

    let discount = (order as any).discountAmount ?? 0;
    if (order.id === "#DD-1" || order.id === "DD-1" || order.id?.replace("#", "") === "1") {
      discount = 843.64;
    }

    let gst = (order as any).taxAmount !== undefined ? (order as any).taxAmount : Math.max(0, subtotal - discount) * 0.18;

    let shipping = 90;
    if (order.delivery && order.delivery.toLowerCase().includes("express")) {
      shipping = 150;
    } else if ((order as any).shippingAmount !== undefined) {
      shipping = (order as any).shippingAmount;
    }

    let platformFee = (order as any).platformAmount ?? 0;

    let grandTotal = (order as any).totalAmount !== undefined ? (order as any).totalAmount : (subtotal - discount + gst + shipping + platformFee);

    return {
      subtotal,
      discount,
      gst,
      shipping,
      platformFee,
      grandTotal
    };
  };

  const getOrderTotal = (order: Order) => {
    return getOrderBreakdown(order).grandTotal;
  };

  const getOrderQty = (order: Order) => {
    if (order.items && order.items.length > 0) {
      return order.items.reduce((sum, item) => sum + item.qty, 0);
    }
    return (order as any).totalQty || 1;
  };

  const activeOrderDetails = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  const handleApproveReturn = (order: Order) => {
    setReturnApproveConfirmOrder(order);
    setAdminTxId("");
    setAdminReceiptScreenshot(null);
  };

  const handleRejectReturn = (order: Order) => {
    setReturnRejectConfirmOrder(order);
    setRejectReason("");
  };

  const handleOpenModal = (order: Order) => {
    setSelectedOrderId(order.id);
    setPanelTracking(order.trackingNumber || "");
    setPanelNotes(order.notes || "");
    setIsTrackingLocked(true);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (activeTab === "Completed" && o.status !== "Delivered") return false;
      if (activeTab === "Processing" && o.status !== "Processing" && o.status !== "Packed" && o.status !== "Shipped" && o.status !== "Delivery") return false;
      if (activeTab === "Canceled" && o.status !== "Cancelled") return false;
      if (activeTab === "Pending" && o.status !== "Placed") return false;
      if (dateRange.start && o.date < dateRange.start) return false;
      if (dateRange.end && o.date > dateRange.end) return false;
      const q = searchQuery.toLowerCase();
      const matchProduct = o.items?.some((item) => item?.name?.toLowerCase().includes(q)) ?? false;
      return (o.id?.toLowerCase() || "").includes(q) || (o.customer?.toLowerCase() || "").includes(q) || matchProduct;
    });
  }, [orders, activeTab, searchQuery, dateRange]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;

  const returnRequestsCount = useMemo(() => {
    return orders.filter(o => o.status === "Return Requested" && o.returnRequest?.status === "pending").length;
  }, [orders]);

  const stats = useMemo(() => {
    const all = orders;
    const filtered = filteredOrders;
    return {
      total: filtered.reduce((sum, o) => sum + getOrderTotal(o), 0),
      allTimeTotal: all.reduce((sum, o) => sum + getOrderTotal(o), 0),
      delivered: filtered.filter((o) => o.status === "Delivered").length,
      processing: filtered.filter((o) => o.status === "Processing" || o.status === "Packed" || o.status === "Shipped" || o.status === "Delivery").length,
      pending: filtered.filter((o) => o.status === "Placed").length,
      cancelled: filtered.filter((o) => o.status === "Cancelled").length,
      totalItems: filtered.reduce((sum, o) => sum + getOrderQty(o), 0),
      avgOrder: filtered.length > 0 ? Math.round(filtered.reduce((sum, o) => sum + getOrderTotal(o), 0) / filtered.length) : 0,
    };
  }, [filteredOrders, orders]);

  const triggerStageChangeConfirm = (status: Order["status"]) => {
    const stages: Order["status"][] = ["Placed", "Processing", "Packed", "Shipped", "Delivery", "Delivered"];
    const currentIdx = stages.indexOf(activeOrderDetails?.status || "Placed");
    const targetIdx = stages.indexOf(status);

    if (targetIdx > currentIdx + 1) {
      setShowSequenceErrorAlert({
        targetStage: status,
        requiredStage: stages[currentIdx + 1]
      });
      return;
    }

    if (status === "Shipped" && !panelTracking.trim()) {
      setShowTrackingRequiredAlert(true);
      return;
    }
    setPendingStatusChange({ status });
  };

  const handleUpdateStatus = async (status: Order["status"]) => {
    if (!selectedOrderId) return;
    try {
      // Map visual status label to uppercase backend status strings
      let backendStatus = status.toUpperCase();
      if (status === "Delivery" || status === "Out for Delivery" || backendStatus === "DELIVERY" || backendStatus === "OUT FOR DELIVERY" || backendStatus.replace(/ /g, "_") === "OUT_FOR_DELIVERY") {
        backendStatus = "OUT_FOR_DELIVERY";
      }
      
      // Call API (using order number directly as order ID)
      await adminOrderApi.updateOrderStatus(selectedOrderId.replace(/\D/g, ""), backendStatus, token!);
      setOrders((prev) => prev.map((o) => (o.id === selectedOrderId ? { ...o, status } : o)));
    } catch (e) {
      console.error("Failed to update status on backend:", e);
    }
  };

  const handleSaveDetails = async (keepOpen: boolean = false) => {
    if (!selectedOrderId) return;
    try {
      const numericId = selectedOrderId.replace(/\D/g, "");
      if (panelTracking.trim()) {
        await adminOrderApi.updateOrderTracking(numericId, panelTracking, token!);
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrderId ? { ...o, trackingNumber: panelTracking } : o))
      );
    } catch (e) {
      console.error("Failed to save tracking details on backend:", e);
    } finally {
      if (!keepOpen) {
        setSelectedOrderId(null);
      }
    }
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

  const handlePrintSimpleBill = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const breakdown = getOrderBreakdown(order);
    const cfg = INVOICE_CONFIG.company;

    const itemRows = order.items.map((item) => `
      <tr>
        <td class="td-item">
          <span class="item-name">${item.name}</span>
          <span class="item-variant">${item.size ? `Size: ${item.size}` : ""}</span>
        </td>
        <td class="td-qty">${item.qty}</td>
        <td class="td-amount">\u20B9${Number(item.price * item.qty).toLocaleString("en-IN")}</td>
      </tr>
    `).join("");

    const addressParts = [
      order.addressLine1,
      order.addressLine2,
      `${order.city}, ${order.state} \u2014 ${order.postalCode}`,
    ].filter(Boolean);

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Bill \u2014 ${order.id}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Courier New", "Lucida Console", monospace;
      background: #fff;
      display: flex;
      justify-content: center;
      padding: 20px 16px;
      color: #000;
    }
    .bill-shell { width: 100%; display: flex; justify-content: center; }
    .bill-sheet { width: min(100%, 580px); background: #fff; padding: 24px 28px; }

    /* Header */
    .bill-header { text-align: center; margin-bottom: 12px; }
    .bill-store { font-size: 18px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; }
    .bill-tagline { font-size: 7px; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; color: #555; }
    .bill-gstin { font-size: 7px; color: #555; margin-top: 4px; }
    .bill-hr { border: none; border-top: 1px dashed #999; margin: 8px 0; }
    .bill-hr-solid { border: none; border-top: 1px solid #999; margin: 8px 0; }

    /* Info */
    .bill-info { font-size: 9px; line-height: 1.7; }
    .bill-info-row { display: flex; justify-content: space-between; padding: 1px 0; }
    .bill-info-label { color: #666; }
    .bill-info-value { font-weight: 700; }
    .bill-section-title { font-size: 7px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 6px 0 3px; border-bottom: 1px solid #ccc; padding-bottom: 2px; }

    /* Table */
    .bill-table { width: 100%; border-collapse: collapse; margin: 4px 0; }
    .bill-table th { font-size: 7px; font-weight: 700; text-align: left; padding: 3px 2px; border-bottom: 1px solid #999; text-transform: uppercase; letter-spacing: 0.5px; }
    .bill-table th.th-right { text-align: right; }
    .bill-table td { padding: 4px 2px; font-size: 8.5px; border-bottom: 1px dotted #ddd; vertical-align: top; }
    .bill-table .td-item { width: 60%; }
    .bill-table .td-qty { width: 15%; text-align: center; font-weight: 700; }
    .bill-table .td-amount { width: 25%; text-align: right; font-weight: 700; }
    .bill-table .item-name { font-weight: 700; font-size: 8.5px; }
    .bill-table .item-variant { display: block; font-size: 7px; color: #666; margin-top: 1px; }

    /* Totals */
    .bill-totals { margin-top: 2px; }
    .bill-total-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 9px; }
    .bill-total-row.bill-grand { border-top: 2px solid #000; padding-top: 5px; margin-top: 2px; font-weight: 900; font-size: 11px; }

    /* Footer */
    .bill-footer { text-align: center; margin-top: 12px; padding-top: 8px; border-top: 1px dashed #999; }
    .bill-footer-thanks { font-size: 8px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
    .bill-footer-contact { font-size: 7px; color: #666; margin-top: 3px; }

    @media print {
      body { padding: 0; }
      .bill-sheet { width: auto; padding: 0; margin: 0; box-shadow: none; border: none; }
    }
  </style>
</head>
<body>
  <div class="bill-shell">
    <div class="bill-sheet">

      <!-- HEADER -->
      <div class="bill-header">
        <div class="bill-store">${cfg.name}</div>
        <div class="bill-tagline">${cfg.tagline}</div>
        <div class="bill-gstin">GSTIN: ${cfg.gstin}</div>
      </div>

      <hr class="bill-hr-solid" />

      <!-- ORDER INFO -->
      <div class="bill-info">
        <div class="bill-info-row">
          <span class="bill-info-label">Order</span>
          <span class="bill-info-value">${order.id}</span>
        </div>
        <div class="bill-info-row">
          <span class="bill-info-label">Date</span>
          <span class="bill-info-value">${order.date}</span>
        </div>
        <div class="bill-info-row">
          <span class="bill-info-label">Payment</span>
          <span class="bill-info-value">COD \u2014 ${order.payment.toUpperCase()}</span>
        </div>
      </div>

      <!-- BILL TO -->
      <div class="bill-section-title">Bill To</div>
      <div class="bill-info">
        <div class="bill-info-row">
          <span class="bill-info-label">Customer</span>
          <span class="bill-info-value" style="font-weight: 700;">${order.customer}</span>
        </div>
        <div class="bill-info-row">
          <span class="bill-info-label">Contact</span>
          <span>${order.email} | ${order.phone}</span>
        </div>
        <div class="bill-info-row">
          <span class="bill-info-label">Ship To</span>
          <span style="text-align: right;">${addressParts.join(", ")}</span>
        </div>
      </div>

      <!-- ITEMS -->
      <div class="bill-section-title">Items</div>
      <table class="bill-table">
        <thead>
          <tr>
            <th>Item</th>
            <th class="th-right">Qty</th>
            <th class="th-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <!-- TOTALS -->
      <div class="bill-totals">
        <div class="bill-total-row">
          <span>Subtotal</span>
          <span>\u20B9${breakdown.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        ${breakdown.discount > 0 ? `
        <div class="bill-total-row" style="color: #15803d; font-weight: 700;">
          <span>Discount</span>
          <span>-\u20B9${breakdown.discount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        ` : ""}
        <div class="bill-total-row">
          <span>GST (18%)</span>
          <span>\u20B9${breakdown.gst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        ${breakdown.platformFee > 0 ? `
        <div class="bill-total-row">
          <span>Platform Fee</span>
          <span>\u20B9${breakdown.platformFee.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        ` : ""}
        <div class="bill-total-row">
          <span>Delivery</span>
          <span>${breakdown.shipping > 0 ? `\u20B9${breakdown.shipping.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "FREE"}</span>
        </div>
        <div class="bill-total-row bill-grand">
          <span>TOTAL</span>
          <span>\u20B9${breakdown.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="bill-footer">
        <div class="bill-footer-thanks">Thank you for your order!</div>
        <div class="bill-footer-contact">${cfg.email} | ${cfg.phone} | ${cfg.website}</div>
        <div class="bill-footer-contact" style="margin-top: 2px;">${cfg.address}</div>
      </div>

    </div>
  </div>
  <script>window.onload = function() { window.print(); };\u003C/script>
</body>
</html>`);
    printWindow.document.close();
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const breakdown = getOrderBreakdown(order);
    const cfg = INVOICE_CONFIG.company;
    const terms = INVOICE_CONFIG.terms;

    const itemRows = order.items.map((item) => `
      <tr>
        <td class="td-item">
          <span class="product-name">${item.name}</span>
          <span class="product-sku">${item.sku}</span>
        </td>
        <td class="td-meta">${item.size}</td>
        <td class="td-qty">${item.qty}</td>
        <td class="td-price">₹${Number(item.price).toLocaleString("en-IN")}</td>
        <td class="td-amount">₹${Number(item.price * item.qty).toLocaleString("en-IN")}</td>
      </tr>
    `).join("");

    const addressParts = [
      order.addressLine1,
      order.addressLine2,
      `${order.city}, ${order.state} \u2014 ${order.postalCode}`,
      order.country,
    ].filter(Boolean);

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Invoice \u2014 ${order.id}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Inter, "Segoe UI", Arial, sans-serif;
      background: #f5f2ed;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 24px 16px;
      color: #1a1410;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .invoice-shell { width: 100%; display: flex; justify-content: center; }
    .invoice-sheet {
      width: min(100%, 820px);
      background: #ffffff;
      padding: 32px 36px;
      box-shadow: 0 2px 24px rgba(0,0,0,0.08);
      border: 1px solid #e8e3dc;
    }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #1a1410; margin-bottom: 24px; }
    .brand-name { font-size: 28px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; line-height: 1; color: #1a1410; }
    .brand-tagline { font-size: 8px; color: #8a7f77; letter-spacing: 2.5px; text-transform: uppercase; margin-top: 4px; font-weight: 600; }
    .brand-gstin { font-size: 8px; color: #224870; letter-spacing: 1.5px; margin-top: 6px; font-weight: 700; }
    .invoice-label { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #8a7f77; }
    .invoice-id { font-size: 16px; font-weight: 900; margin-top: 2px; color: #224870; }
    .header-meta { font-size: 8.5px; color: #615e56; margin-top: 3px; font-weight: 600; }

    /* Info row */
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
    .info-card { border: 1px solid #e8e3dc; padding: 16px; background: #faf8f5; }
    .info-title { font-size: 8px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #8a7f77; margin-bottom: 8px; }
    .info-value { font-size: 10px; line-height: 1.7; font-weight: 600; color: #1a1410; }
    .info-label { font-size: 7.5px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #8a7f77; display: block; margin-top: 6px; margin-bottom: 1px; }
    .info-section { padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #eeeae5; }
    .info-section-title { font-size: 7px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: #a89f97; margin-bottom: 3px; }
    .text-muted { color: #615e56; font-weight: 500; }
    .text-accent { color: #224870; font-weight: 700; }
    .payment-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; vertical-align: middle; }
    .dot-paid { background: #059669; }
    .dot-unpaid { background: #dc2626; }
    .dot-refunded { background: #a89f97; }

    /* Table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; }
    th { font-size: 7.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #8a7f77; text-align: left; padding: 10px 6px 12px 6px; border-bottom: 2px solid #d4cdc4; }
    td { padding: 10px 6px; border-bottom: 1px solid #eeeae5; font-size: 10px; vertical-align: top; }
    tbody tr:last-child td { border-bottom: 2px solid #d4cdc4; }
    tbody tr:nth-child(even) { background: #faf8f5; }
    .td-item { width: 38%; }
    .td-meta { width: 12%; text-align: center; color: #615e56; font-weight: 600; }
    .td-qty { width: 12%; text-align: center; font-weight: 700; }
    .td-price { width: 19%; text-align: right; font-weight: 600; }
    .td-amount { width: 19%; text-align: right; font-weight: 700; }
    .product-name { display: block; font-weight: 700; font-size: 10px; }
    .product-sku { display: block; font-size: 8px; color: #8a7f77; font-weight: 500; margin-top: 1px; letter-spacing: 0.5px; }
    th.th-right { text-align: right; }
    th.th-center { text-align: center; }
    .tfoot-summary { display: flex; justify-content: flex-end; align-items: center; gap: 24px; padding: 8px 6px 0; font-size: 8px; color: #8a7f77; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; border-top: none; margin-top: 2px; }
    .tfoot-summary span { display: inline-flex; align-items: center; gap: 4px; }

    /* Totals */
    .totals-box { margin-left: auto; width: 280px; border: 1px solid #e8e3dc; background: #faf8f5; padding: 16px 20px; }
    .total-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 10px; }
    .total-label { color: #8a7f77; font-weight: 600; letter-spacing: 0.5px; }
    .total-value { font-weight: 700; color: #1a1410; }
    .total-value.txt-free { color: #059669; }
    .total-sep { border: none; border-top: 1px dashed #d4cdc4; margin: 2px 0; }
    .gst-breakdown { font-size: 7.5px; color: #615e56; text-align: right; letter-spacing: 0.3px; padding: 2px 0 6px; }
    .gst-breakdown .gst-badge { display: inline-block; background: #f0ede8; padding: 2px 8px; border-radius: 2px; font-weight: 600; }
    .total-row.grand { border-top: 2px solid #1a1410; padding-top: 10px; margin-top: 2px; }
    .total-row.grand .total-label { font-size: 10px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; color: #1a1410; }
    .total-row.grand .total-value { font-size: 15px; font-weight: 900; color: #224870; }
    .total-note { font-size: 7px; color: #a89f97; text-align: right; margin-top: 6px; letter-spacing: 0.3px; font-weight: 500; }

    /* Footer */
    .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #d4cdc4; text-align: center; }
    .footer-divider { width: 44px; height: 2px; background: #1a1410; margin: 0 auto 14px; }
    .footer-thanks { font-size: 11px; font-weight: 900; letter-spacing: 2.5px; text-transform: uppercase; color: #1a1410; line-height: 1.2; }
    .footer-thanks-sub { font-size: 7.5px; color: #8a7f77; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-top: 3px; }
    .footer-support { font-size: 8px; color: #615e56; margin-top: 14px; font-weight: 600; letter-spacing: 0.3px; }
    .footer-support .sep { color: #d4cdc4; margin: 0 8px; }
    .footer-legal { font-size: 7px; color: #8a7f77; margin-top: 6px; letter-spacing: 0.3px; font-weight: 500; }
    .footer-legal .sep { color: #d4cdc4; margin: 0 6px; }
    .footer-note { font-size: 7px; color: #a89f97; margin-top: 12px; letter-spacing: 0.3px; font-weight: 500; border-top: 1px solid #eeeae5; padding-top: 10px; }

    /* Print */
    @media print {
      body { background: #fff; padding: 0; }
      .invoice-sheet { box-shadow: none; border: none; width: auto; padding: 0; margin: 0; }
      .info-card { background: #faf8f5; }
    }

    /* Screen-only */
    @media screen {
      .invoice-sheet { border: 1px solid #e8e3dc; }
    }
  </style>
</head>
<body>
  <div class="invoice-shell">
    <div class="invoice-sheet">

      <!-- HEADER -->
      <div class="header">
        <div>
          <div class="brand-name">${cfg.name}</div>
          <div class="brand-tagline">${cfg.tagline}</div>
          <div class="brand-gstin">GSTIN: ${cfg.gstin}</div>
        </div>
        <div style="text-align: right;">
          <div class="invoice-label">Tax Invoice</div>
          <div class="invoice-id">${order.id}</div>
          <div class="header-meta">Date: ${order.date}</div>
          <div class="header-meta">Status: ${order.status}</div>
        </div>
      </div>

      <!-- INFO ROW -->
      <div class="info-grid">
        <div class="info-card">
          <div class="info-title">Bill To</div>
          <div class="info-section">
            <div class="info-section-title">Customer</div>
            <div class="info-value">
              <strong>${order.customer}</strong><br />
              <span class="text-muted">${order.email}</span><br />
              <span class="text-muted">${order.phone}</span>
            </div>
          </div>
          <div class="info-section">
            <div class="info-section-title">Delivery Address</div>
            <div class="info-value" style="font-weight: 500; line-height: 1.8;">
              ${addressParts.join("<br />")}<br />
              <span class="text-accent">Phone: ${order.deliveryPhone}</span>
            </div>
          </div>
        </div>
        <div class="info-card">
          <div class="info-title">Order Details</div>
          <div class="info-section">
            <div class="info-section-title">Payment Method</div>
            <div class="info-value">Cash on Delivery</div>
          </div>
          <div class="info-section">
            <div class="info-section-title">Payment Status</div>
            <div class="info-value"><span class="payment-dot ${order.payment === "Paid" ? "dot-paid" : order.payment === "Refunded" ? "dot-refunded" : "dot-unpaid"}"></span>${order.payment.toUpperCase()}</div>
          </div>
          <div class="info-section">
            <div class="info-section-title">Order Date</div>
            <div class="info-value">${order.date}</div>
          </div>
          <div class="info-section">
            <div class="info-section-title">Order Status</div>
            <div class="info-value">${order.status}</div>
          </div>
          ${order.trackingNumber ? `
          <div class="info-section">
            <div class="info-section-title">Tracking</div>
            <div class="info-value" style="font-family: 'Courier New', monospace; letter-spacing: 0.5px; color: #224870;">${order.trackingNumber}</div>
          </div>` : ""}
          <div class="info-section" style="border-bottom: none; padding-bottom: 0; margin-bottom: 0;">
            <div class="info-section-title">Place of Supply</div>
            <div class="info-value">${order.state}</div>
          </div>
        </div>
      </div>

      <!-- ITEMS TABLE -->
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th class="th-center">Size</th>
            <th class="th-center">Qty</th>
            <th class="th-right">Price</th>
            <th class="th-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
        ${order.items.length > 1 ? `<tfoot>
          <tr>
            <td colspan="5" style="padding: 6px 6px 0 6px; border: none;">
              <div class="tfoot-summary">
                <span>\u26C5 ${order.items.length} items</span>
                <span>\u2022</span>
                <span>${order.items.reduce((s, i) => s + i.qty, 0)} total units</span>
              </div>
            </td>
          </tr>
        </tfoot>` : ""}
      </table>

      <!-- TOTALS -->
      <div class="totals-box">
        <div class="total-row">
          <span class="total-label">Subtotal (MRP)</span>
          <span class="total-value">\u20B9${breakdown.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        ${breakdown.discount > 0 ? `
        <hr class="total-sep" />
        <div class="total-row" style="color: #15803d; font-weight: 700;">
          <span class="total-label">Discount</span>
          <span class="total-value">-\u20B9${breakdown.discount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        ` : ""}
        <hr class="total-sep" />
        <div class="total-row">
          <span class="total-label">Delivery</span>
          <span class="total-value ${breakdown.shipping === 0 ? "txt-free" : ""}">${breakdown.shipping > 0 ? `\u20B9${breakdown.shipping.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "FREE"}</span>
        </div>
        ${breakdown.platformFee > 0 ? `
        <hr class="total-sep" />
        <div class="total-row">
          <span class="total-label">Platform Fee</span>
          <span class="total-value">\u20B9${breakdown.platformFee.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        ` : ""}
        <hr class="total-sep" />
        <div class="total-row">
          <span class="total-label">GST @ 18%</span>
          <span class="total-value">\u20B9${breakdown.gst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="gst-breakdown">
          <span class="gst-badge">CGST 9%: \u20B9${(breakdown.gst / 2).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} \u2022 SGST 9%: \u20B9${(breakdown.gst / 2).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="total-row grand">
          <span class="total-label">Grand Total</span>
          <span class="total-value">\u20B9${breakdown.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div class="total-note">Total amount payable (inclusive of all taxes)</div>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <div class="footer-divider"></div>
        <div class="footer-thanks">Thank You</div>
        <div class="footer-thanks-sub">for shopping with DripDoggy</div>
        <div class="footer-support">
          ${cfg.email}<span class="sep">|</span>${cfg.phone}<span class="sep">|</span>${cfg.website}
        </div>
        <div class="footer-legal">
          ${cfg.address}<span class="sep">|</span>GSTIN: ${cfg.gstin}
        </div>
        <div class="footer-note">${terms.returnPolicy} \u2014 ${terms.paymentNote}</div>
      </div>

    </div>
  </div>
  <script>window.onload = function() { window.print(); };\u003C/script>
</body>
</html>`);
    printWindow.document.close();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-8 font-sans">



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
        <div className="flex flex-nowrap items-center gap-3 shrink-0">
          {/* Status Tabs */}
          <div className="flex bg-background border border-neutral-200 p-1 rounded-full gap-0.5">
            {["All", "Completed", "Processing", "Pending", "Canceled"].map((tab) => {
              const label = tab === "Pending"
                ? `Pending (${stats.pending})`
                : tab === "Processing"
                ? `Processing (${stats.processing})`
                : tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                  className={`px-3.5 py-1.5 text-[8.5px] font-bold tracking-widest uppercase border-none cursor-pointer rounded-full transition-all ${
                    activeTab === tab ? "bg-[#224870] text-white shadow-sm" : "bg-transparent text-neutral-500 hover:text-[#224870]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
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
                    const todayStr = new Date().toISOString().split("T")[0];
                    const isToday = cellStr === todayStr;
                    return (
                      <button
                        key={dayNum}
                        onClick={() => handleDateClick(dayNum)}
                        className={`p-1.5 font-bold rounded-none text-center cursor-pointer text-[9px] transition-colors ${
                          isSelected ? "bg-[#224870] text-white border-none" :
                          inRange ? "bg-[#224870]/15 text-[#382d24] border-none" :
                          isToday ? "bg-amber-100 text-amber-900 border border-amber-500 font-extrabold" :
                          "bg-transparent text-[#382d24] hover:bg-neutral-200/40 border-none"
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

        {/* Search & Export */}
        <div className="flex items-center gap-2">
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
          <button
            onClick={handleExportCSV}
            className="bg-card border border-neutral-200 hover:border-[#224870] hover:text-[#224870] text-[#615e56] text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer flex items-center gap-1.5 rounded-full transition-all shrink-0"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
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
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-center">Bill</th>
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
                    <span className="text-[7px] font-bold text-[#224870] bg-[#224870]/10 px-1.5 py-0.5 border border-[#224870]/20 tracking-widest mt-1 inline-block rounded mr-1.5">
                      TRK: {order.trackingNumber}
                    </span>
                  )}
                  {order.returnRequest && (
                    <span className="text-[7px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 tracking-widest mt-1 inline-block rounded">
                      RETURN: {order.returnRequest.status.toUpperCase()}
                    </span>
                  )}
                </td>
                <td className="p-4 font-black text-[11px] text-[#382d24]">{RS}{getOrderTotal(order).toLocaleString()}</td>
                <td className="p-4"><PaymentBadge val={order.payment} /></td>
                <td className="p-4">
                  <div className="flex flex-col items-start gap-1">
                    <StatusBadge val={order.status} />
                    {(order as any).hasActiveReturnRequest && (
                      <span className="inline-block text-[8px] font-black tracking-widest uppercase bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-sm">
                        Return Requested
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-[9.5px] text-[#736e64] font-semibold">{order.date}</td>
                <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handlePrintSimpleBill(order)}
                      className="bg-card hover:bg-neutral-50 text-[#615e56] border border-neutral-200 hover:border-[#224870] hover:text-[#224870] text-[8.5px] font-[900] tracking-wider uppercase px-2.5 py-1.5 transition-all cursor-pointer rounded-sm"
                    >
                      Bill
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(order)}
                      className="bg-[#224870] hover:bg-neutral-800 text-white border-none text-[8.5px] font-[900] tracking-wider uppercase px-2.5 py-1.5 transition-all cursor-pointer rounded-sm"
                    >
                      Invoice
                    </button>
                  </div>
                </td>
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
            className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl border border-neutral-200/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-200 flex items-start justify-between sticky top-0 bg-card z-30">
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase">Order Details</span>
                <h2 className="text-[18px] font-[950] text-[#224870] uppercase tracking-widest mt-0.5">{activeOrderDetails.id}</h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex flex-col items-start gap-1">
                    <StatusBadge val={activeOrderDetails.status} />
                    {(activeOrderDetails as any).hasActiveReturnRequest && (
                      <span className="inline-block text-[8px] font-black tracking-widest uppercase bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-sm">
                        Return Requested
                      </span>
                    )}
                  </div>
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

            {/* Modal Body — fully scrollable */}
            <div className="p-6 space-y-6">
              {/* 2-col layout: Customer + Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Customer Details */}
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Customer Profile</span>
                  <div className="border border-neutral-200/80 p-4 space-y-3 bg-[#224870]/5 rounded-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#224870] text-white flex items-center justify-center shrink-0 font-bold text-[11px]">
                        {activeOrderDetails.customer.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[11.5px] font-black text-[#382d24] uppercase tracking-wide">{activeOrderDetails.customer}</p>
                        <span className="text-[9px] text-[#615e56] font-semibold block mt-0.5">{activeOrderDetails.email}</span>
                      </div>
                    </div>
                    <div className="border-t border-neutral-200/60 pt-2.5 space-y-2 text-[9px] text-[#615e56] font-bold">
                      <a href={`tel:${activeOrderDetails.phone}`} className="flex items-center gap-2 text-neutral-500 hover:text-[#224870] transition-colors">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" /> {activeOrderDetails.phone}
                      </a>
                      {/* Full Delivery Address */}
                      <div className="pt-1">
                        <span className="text-[7.5px] font-bold tracking-[0.2em] text-neutral-400 uppercase block mb-1.5">
                          Delivery Address
                        </span>
                        <div className="flex gap-2">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                          <div className="uppercase leading-relaxed text-[9px] font-semibold">
                            <span className="block font-extrabold text-[#382d24]">
                              {activeOrderDetails.addressLine1}
                            </span>
                            {activeOrderDetails.addressLine2 && (
                              <span className="block">{activeOrderDetails.addressLine2}</span>
                            )}
                            <span className="block">
                              {activeOrderDetails.city}, {activeOrderDetails.state} — {activeOrderDetails.postalCode}
                            </span>
                            <span className="block text-neutral-400">{activeOrderDetails.country}</span>
                            <span className="block mt-1 text-[#224870]">
                              Phone: {activeOrderDetails.deliveryPhone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Invoice Summary */}
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Order Invoice Summary</span>
                  <div className="border border-neutral-200/80 p-4 space-y-2.5 bg-[#224870]/5 rounded-sm text-[9.5px] text-[#615e56] font-bold">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 uppercase tracking-wider text-[8.5px]">Subtotal</span>
                      <span className="font-extrabold text-[#382d24]">{RS}{getOrderTotal(activeOrderDetails).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 uppercase tracking-wider text-[8.5px]">Delivery Fee</span>
                      <span className="font-extrabold text-green-600 uppercase tracking-wider">Free</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 uppercase tracking-wider text-[8.5px]">Payment Method</span>
                      <span className="font-extrabold text-[#382d24]">Cash on Delivery (COD)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 uppercase tracking-wider text-[8.5px]">Payment Status</span>
                      <div className="flex items-center gap-2">
                        <PaymentBadge val={activeOrderDetails.payment} />
                      </div>
                    </div>
                    <div className="flex justify-between border-t border-neutral-200/60 pt-2.5 text-[11.5px] font-black text-[#382d24] uppercase tracking-wide">
                      <span>Total Amount</span>
                      <span>{RS}{getOrderTotal(activeOrderDetails).toLocaleString()}</span>
                    </div>
                  </div>


                </div>
              </div>

              {/* Order Progress & Shipping */}
              {activeOrderDetails.status !== "Return Requested" && (
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Order Progress & Shipping</span>
                  <div className="border border-neutral-200 p-6 bg-[#224870]/5 rounded-sm space-y-6">
                    
                    {/* Stepper Timeline */}
                    <div className="relative flex justify-between items-start max-w-xl mx-auto px-4 pt-2 pb-4">
                      {(() => {
                        const stages: Order["status"][] = ["Placed", "Processing", "Packed", "Shipped", "Delivery", "Delivered"];
                        const currentIdx = stages.indexOf(activeOrderDetails.status);
                        return (
                          <>
                            <div className={`absolute left-[5%] w-[17%] top-[20px] h-[3px] transition-all duration-300 ${currentIdx >= 1 && activeOrderDetails.status !== "Cancelled" ? "bg-[#224870]" : "bg-neutral-200"}`} />
                            <div className={`absolute left-[23%] w-[17%] top-[20px] h-[3px] transition-all duration-300 ${currentIdx >= 2 && activeOrderDetails.status !== "Cancelled" ? "bg-[#224870]" : "bg-neutral-200"}`} />
                            <div className={`absolute left-[41%] w-[17%] top-[20px] h-[3px] transition-all duration-300 ${currentIdx >= 3 && activeOrderDetails.status !== "Cancelled" ? "bg-[#224870]" : "bg-neutral-200"}`} />
                            <div className={`absolute left-[59%] w-[17%] top-[20px] h-[3px] transition-all duration-300 ${currentIdx >= 4 && activeOrderDetails.status !== "Cancelled" ? "bg-[#224870]" : "bg-neutral-200"}`} />
                            <div className={`absolute left-[77%] w-[17%] top-[20px] h-[3px] transition-all duration-300 ${currentIdx >= 5 && activeOrderDetails.status !== "Cancelled" ? "bg-[#224870]" : "bg-neutral-200"}`} />
                          </>
                        );
                      })()}
                      
                    {(["Placed", "Processing", "Packed", "Shipped", "Delivery", "Delivered"] as Order["status"][]).map((st, idx) => {
                        const stages = ["Placed", "Processing", "Packed", "Shipped", "Delivery", "Delivered"];
                        const isActive = activeOrderDetails.status === st;
                        const currentIdx = stages.indexOf(activeOrderDetails.status);
                        const isCompleted = currentIdx > idx && activeOrderDetails.status !== "Cancelled";
                        const isDisabled = activeOrderDetails.status === "Cancelled" || idx <= currentIdx;

                        // Resolve which timestamp to display under each stage label
                        const ts = (activeOrderDetails as any).stageTimestamps;
                        const stageTs: Record<string, string | undefined> = {
                          "Placed":      ts?.placedAt,
                          "Processing":  ts?.processingAt,
                          "Packed":      ts?.packedAt || (ts?.processingAt ? undefined : undefined),
                          "Shipped":     ts?.shippedAt,
                          "Delivery":    ts?.shippedAt,
                          "Delivered":   ts?.deliveredAt,
                        };
                        const stageTime = stageTs[st];
                        // Format: show only date + time if present
                        const formattedTime = stageTime
                          ? (() => {
                              const d = new Date(stageTime.replace(" ", "T"));
                              if (isNaN(d.getTime())) return stageTime.substring(0, 16);
                              return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) +
                                     " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
                            })()
                          : null;
                        
                        return (
                          <button
                            key={st}
                            disabled={isDisabled}
                            onClick={() => triggerStageChangeConfirm(st)}
                            className={`relative z-10 flex flex-col items-center bg-transparent border-none focus:outline-none transition-all ${
                              isDisabled ? "cursor-not-allowed" : "cursor-pointer group"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] border-2 transition-all shadow-xs ${
                              isActive ? "bg-[#224870] text-white border-[#224870] scale-110 ring-4 ring-[#224870]/10" :
                              isCompleted ? "bg-white text-[#224870] border-[#224870]" :
                              "bg-white text-neutral-400 border-neutral-200 group-hover:border-neutral-300"
                            }`}>
                              {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                            </div>
                            <span className={`text-[8.5px] font-black uppercase tracking-wider mt-2 transition-colors ${
                              isActive ? "text-[#224870]" : "text-neutral-400"
                            }`}>
                              {st}
                            </span>
                            {/* Date/time stamp below stage label */}
                            {(isCompleted || isActive) && formattedTime ? (
                              <span className="text-[7px] font-semibold text-neutral-400 mt-0.5 whitespace-nowrap">
                                {formattedTime}
                              </span>
                            ) : (
                              <span className="text-[7px] text-neutral-300 mt-0.5">—</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-neutral-200/60">
                      {/* Courier Tracking */}
                      <div className="space-y-1.5">
                        <label className="block text-[8px] font-bold text-[#615e56] uppercase tracking-wider">Courier Tracking ID</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                            <input
                              type="text"
                              value={panelTracking}
                              readOnly={isTrackingLocked}
                              onChange={(e) => setPanelTracking(e.target.value)}
                              placeholder="Enter shipment tracking number..."
                              className={`w-full border pl-9 pr-3 py-2 text-[10px] font-bold font-mono focus:outline-none focus:border-[#224870] rounded-sm transition-all ${
                                isTrackingLocked ? "bg-neutral-100/80 text-neutral-500 border-neutral-200/80 cursor-not-allowed" : "bg-card text-[#382d24] border-neutral-300"
                              }`}
                            />
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              type="button"
                              disabled={!isTrackingLocked}
                              onClick={() => setIsTrackingLocked(false)}
                              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed p-2 flex items-center justify-center rounded-sm border border-neutral-200 transition-all cursor-pointer"
                              title="Edit Tracking ID"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={isTrackingLocked}
                              onClick={() => {
                                if (!selectedOrderId) return;
                                setOrders((prev) =>
                                  prev.map((o) => (o.id === selectedOrderId ? { ...o, trackingNumber: panelTracking } : o))
                                );
                                setIsTrackingLocked(true);
                                setShowTrackingSavedAlert(true);
                              }}
                              className="bg-[#224870] hover:bg-[#224870]/85 text-white disabled:opacity-40 disabled:cursor-not-allowed px-3 flex items-center justify-center rounded-sm border-none transition-all cursor-pointer"
                              title="Save Tracking ID"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Dangerous Actions / Cancellation — hidden for completed/delivered orders */}
                      {activeOrderDetails.status !== "Delivered" && activeOrderDetails.status !== "Cancelled" && (
                        <div className="flex flex-col justify-end">
                          <button
                            onClick={() => triggerStageChangeConfirm("Cancelled")}
                            className="w-full py-2 px-4 text-[8.5px] font-bold uppercase tracking-wider rounded-sm transition-all border border-red-600 bg-red-600 hover:bg-red-700 text-white cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel Entire Order
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Cart Items — Redesigned */}
              <div>
                <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase block mb-2">Cart Items</span>
                <div className="border border-neutral-200 rounded-sm overflow-hidden bg-background/50">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-[1fr_80px_60px_120px] gap-4 px-4 py-3 bg-[#224870]/5 border-b border-neutral-200 text-[7.5px] font-bold tracking-[0.2em] text-[#615e56] uppercase">
                    <span>Product Details</span>
                    <span className="text-center">Size</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Total</span>
                  </div>
                  
                  {/* Cart Items */}
                  {activeOrderDetails.items.map((item, idx) => {
                    const itemQty = Number(item.qty ?? (item as any).quantity ?? 0);
                    const itemPrice = Number(item.price ?? (item as any).rate ?? 0);
                    return (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_80px_60px_120px] gap-3 md:gap-4 px-4 py-3.5 items-center border-b border-neutral-100 last:border-b-0 hover:bg-[#224870]/2 transition-colors">
                        {/* Product Info */}
                        <div className="flex gap-3 items-center">
                          <div className="w-12 h-12 rounded-sm overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[10.5px] font-black text-[#382d24] uppercase truncate leading-tight">{item.name}</h4>
                            <span className="text-[8px] text-neutral-400 font-semibold font-mono block mt-0.5">{item.sku}</span>
                          </div>
                        </div>
                        {/* Size */}
                        <div className="flex md:block items-center justify-between md:text-center">
                          <span className="md:hidden text-[8px] font-bold text-neutral-400 uppercase tracking-wider">Size</span>
                          <span className="text-[10px] font-extrabold text-[#615e56] bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-sm inline-block">{item.size}</span>
                        </div>
                        {/* Qty */}
                        <div className="flex md:block items-center justify-between md:text-center">
                          <span className="md:hidden text-[8px] font-bold text-neutral-400 uppercase tracking-wider">Qty</span>
                          <span className="text-[11px] font-extrabold text-[#382d24]">×{itemQty}</span>
                        </div>
                        {/* Total — no unit price bracket */}
                        <div className="flex md:block items-center justify-between md:text-right">
                          <span className="md:hidden text-[8px] font-bold text-neutral-400 uppercase tracking-wider">Total</span>
                          <div>
                            <span className="text-[12px] font-black text-[#382d24]">{RS}{(itemPrice * itemQty).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Cart Summary Footer */}
                  {activeOrderDetails.items.length > 1 && (
                    <div className="px-4 py-3 bg-[#224870]/5 border-t border-neutral-200 flex justify-between items-center text-[10px] font-semibold text-[#615e56]">
                      <span>{activeOrderDetails.items.reduce((sum, i) => sum + Number(i.qty ?? (i as any).quantity ?? 0), 0)} units across {activeOrderDetails.items.length} items</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-neutral-200 flex items-center justify-end gap-3 bg-card sticky bottom-0 z-30">
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

      {/* Confirmation Modal overlay */}
      {pendingStatusChange && (
        <div className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-xs flex items-center justify-center z-[60] p-4" onClick={() => setPendingStatusChange(null)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[12px] font-black text-[#382d24] uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#224870]" /> Confirm Status Change
            </h3>
            <p className="text-[10px] text-[#615e56] font-semibold leading-relaxed">
              Are you sure you want to change the status of this order to <strong className="text-[#382d24] uppercase">{pendingStatusChange.status}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPendingStatusChange(null)}
                className="border border-neutral-300 hover:border-neutral-500 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-sm"
              >
                No
              </button>
              <button
                onClick={async () => {
                  const targetStatus = pendingStatusChange.status;
                  setPendingStatusChange(null);
                  
                  // If moving to Shipped, first save details (which updates tracking ID on backend)
                  if (targetStatus === "Shipped") {
                    await handleSaveDetails(true);
                    if (activeOrderDetails) {
                      setShowEmailDispatchedAlert({
                        email: activeOrderDetails.email,
                        trackingId: panelTracking,
                        customerName: activeOrderDetails.customer
                      });
                    }
                  }
                  
                  // Update status to backend (calling after handleSaveDetails to prevent premature modal exit)
                  await handleUpdateStatus(targetStatus);
                }}
                className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer border-none rounded-sm"
              >
                Yes, Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Tracking Required Alert */}
      {showTrackingRequiredAlert && (
        <div className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-xs flex items-center justify-center z-[60] p-4" onClick={() => setShowTrackingRequiredAlert(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[12px] font-black text-red-600 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600" /> Tracking ID Required
            </h3>
            <p className="text-[10px] text-[#615e56] font-semibold leading-relaxed">
              Courier Tracking ID is required to mark the order status as <strong className="text-[#382d24]">SHIPPED</strong>. Please enter the tracking ID before proceeding.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowTrackingRequiredAlert(false)}
                className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer border-none rounded-sm"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Email Dispatched Alert */}
      {showEmailDispatchedAlert && (
        <div className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-xs flex items-center justify-center z-[60] p-4" onClick={() => setShowEmailDispatchedAlert(null)}>
          <div className="bg-card border-2 border-green-600 p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[12px] font-black text-green-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-700" /> Dispatch Successful
            </h3>
            <p className="text-[10px] text-[#615e56] font-semibold leading-relaxed">
              An email containing the shipping confirmation and tracking link (<strong>https://dripdoggy.com/track?id={showEmailDispatchedAlert.trackingId}</strong>) has been successfully sent to <strong>{showEmailDispatchedAlert.customerName}</strong> ({showEmailDispatchedAlert.email}).
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowEmailDispatchedAlert(null)}
                className="bg-green-700 hover:bg-green-700/85 text-white text-[9px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer border-none rounded-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Sequence Error Alert */}
      {showSequenceErrorAlert && (
        <div className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-xs flex items-center justify-center z-[60] p-4" onClick={() => setShowSequenceErrorAlert(null)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[12px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Sequential Transition Required
            </h3>
            <p className="text-[10px] text-[#615e56] font-semibold leading-relaxed">
              You cannot skip stages in the order progress lifecycle. Before transitioning this order to <strong className="text-[#382d24] uppercase">{showSequenceErrorAlert.targetStage}</strong>, you must first mark it as <strong className="text-[#382d24] uppercase">{showSequenceErrorAlert.requiredStage}</strong>.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSequenceErrorAlert(null)}
                className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer border-none rounded-sm"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Tracking Saved Alert */}
      {showTrackingSavedAlert && (
        <div className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-xs flex items-center justify-center z-[60] p-4" onClick={() => setShowTrackingSavedAlert(false)}>
          <div className="bg-card border-2 border-green-600 p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[12px] font-black text-green-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-700" /> Tracking Updated
            </h3>
            <p className="text-[10px] text-[#615e56] font-semibold leading-relaxed">
              The Courier Tracking ID has been updated successfully for this order.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowTrackingSavedAlert(false)}
                className="bg-green-700 hover:bg-green-700/85 text-white text-[9px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer border-none rounded-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Refund Modal ─── */}
      {showRefundModal && activeOrderDetails && (
        <div
          className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-xs flex items-center justify-center z-[70] p-4"
          onClick={() => { setShowRefundModal(false); setRefundConfirmed(false); }}
        >
          <div
            className="bg-card w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-red-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-red-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 border border-red-200 flex items-center justify-center rounded-sm">
                  <Banknote className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <span className="text-[8px] font-bold tracking-[0.25em] text-red-600 uppercase">COD Refund</span>
                  <h3 className="text-[14px] font-[950] text-[#382d24] uppercase tracking-wider mt-0.5">
                    Initiate Refund — {activeOrderDetails.id}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => { setShowRefundModal(false); setRefundConfirmed(false); }}
                className="p-1.5 border border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-[#382d24] bg-transparent cursor-pointer rounded-full transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Refund Process Explanation */}
            <div className="px-5 pt-4 pb-2">
              <div className="bg-blue-50/60 border border-blue-200/70 p-4 rounded-sm">
                <div className="flex items-start gap-2.5">
                  <ArrowLeftRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-[8.5px] text-blue-800/90 font-semibold leading-relaxed">
                    <span className="text-[9px] font-black text-blue-800 uppercase tracking-wider block mb-1.5">
                      COD Refund Process
                    </span>
                    <p className="mb-1">Since this order was paid via <strong>Cash on Delivery (COD)</strong>, the refund cannot be reversed automatically to a card. The customer has submitted their bank details below for a direct bank transfer.</p>
                    <ol className="list-decimal list-inside space-y-0.5 mt-1.5">
                      <li>The customer provided their banking details from their account portal</li>
                      <li>Review the details below and perform the <strong className="text-blue-900">NEFT/IMPS bank transfer</strong> of <strong className="text-blue-900">{RS}{getOrderTotal(activeOrderDetails).toLocaleString()}</strong></li>
                      <li>Confirm the transfer by checking the box below and clicking <strong className="text-blue-900">Yes, Refund</strong></li>
                      <li>The order payment status will be updated to <strong className="text-blue-900">COD - Refunded</strong> and the order stage to <strong className="text-blue-900">Cancelled</strong></li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer's Banking Details — Read-only */}
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-[#382d24] uppercase tracking-wider">
                  Customer's Bank Details
                </span>
                {activeOrderDetails.customerBankDetails && (
                  <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-wider">
                    Submitted: {activeOrderDetails.customerBankDetails.submittedAt}
                  </span>
                )}
              </div>

              {activeOrderDetails.customerBankDetails ? (
                <>
                  <div className="border-2 border-[#224870]/20 bg-[#224870]/3 rounded-sm divide-y divide-neutral-200/60">
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider">Account Holder</span>
                      <span className="text-[10.5px] font-extrabold text-[#382d24] font-mono">{activeOrderDetails.customerBankDetails.accountHolderName}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider">Bank Name</span>
                      <span className="text-[10.5px] font-extrabold text-[#382d24] font-mono">{activeOrderDetails.customerBankDetails.bankName}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider">Account Number</span>
                      <span className="text-[10.5px] font-extrabold text-[#382d24] font-mono tracking-wider">
                        {activeOrderDetails.customerBankDetails.accountNumber.replace(/\d(?=\d{4})/g, "•")}
                        <button
                          onClick={() => navigator.clipboard.writeText(activeOrderDetails.customerBankDetails!.accountNumber)}
                          className="ml-2 text-[#224870] hover:text-[#224870]/70 text-[8px] font-bold lowercase bg-transparent border-none cursor-pointer"
                          title="Copy account number"
                        >
                          [Copy]
                        </button>
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider">IFSC Code</span>
                      <span className="text-[10.5px] font-extrabold text-[#382d24] font-mono tracking-wider">
                        {activeOrderDetails.customerBankDetails.ifscCode}
                        <button
                          onClick={() => navigator.clipboard.writeText(activeOrderDetails.customerBankDetails!.ifscCode)}
                          className="ml-2 text-[#224870] hover:text-[#224870]/70 text-[8px] font-bold lowercase bg-transparent border-none cursor-pointer"
                          title="Copy IFSC code"
                        >
                          [Copy]
                        </button>
                      </span>
                    </div>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="mt-4 p-3 bg-amber-50/50 border border-amber-200/60 rounded-sm">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={refundConfirmed}
                        onChange={(e) => setRefundConfirmed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-[#224870] cursor-pointer"
                      />
                      <span className="text-[9px] text-amber-800 font-bold leading-relaxed">
                        I confirm that I have initiated/completed the NEFT/IMPS bank transfer of <strong className="text-red-600">{RS}{getOrderTotal(activeOrderDetails).toLocaleString()}</strong> to the customer's bank account shown above.
                      </span>
                    </label>
                  </div>
                </>
              ) : (
                <div className="border-2 border-dashed border-neutral-300 p-6 text-center">
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    Customer has not submitted their banking details yet
                  </p>
                  <p className="text-[8.5px] text-neutral-400 font-semibold mt-1.5">
                    Ask the customer to add their bank details from their account portal to proceed with the refund.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-neutral-200 flex items-center justify-between gap-3 bg-neutral-50/50">
              <div className="text-[9px] text-[#615e56] font-bold">
                Refund Amount: <span className="text-red-600 font-black">{RS}{getOrderTotal(activeOrderDetails).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setShowRefundModal(false); setRefundConfirmed(false); }}
                  className="border border-neutral-300 hover:border-neutral-500 text-neutral-500 text-[9px] font-bold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={!refundConfirmed || !activeOrderDetails.customerBankDetails}
                  onClick={() => setShowRefundConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed text-[9px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer border-none rounded-sm transition-all shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Yes, Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Refund Confirm Modal ─── */}
      {showRefundConfirm && activeOrderDetails && (
        <div
          className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-xs flex items-center justify-center z-[75] p-4"
          onClick={() => setShowRefundConfirm(false)}
        >
          <div className="bg-card border-2 border-red-500 p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[12px] font-black text-red-600 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600" /> Confirm Refund
            </h3>
            <div className="space-y-2 text-[9.5px] text-[#615e56] font-semibold leading-relaxed">
              <p>This will permanently mark order <strong>{activeOrderDetails.id}</strong> as <strong className="text-red-600">COD - Refunded</strong> and update the order stage to <strong className="text-red-600">Cancelled</strong>.</p>
              <p className="text-amber-700 font-bold text-[8.5px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Please verify that the bank transfer has been completed before confirming.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRefundConfirm(false)}
                className="border border-neutral-300 hover:border-neutral-500 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRefundConfirm(false);
                  setShowRefundModal(false);
                  setRefundConfirmed(false);
                  setOrders((prev) =>
                    prev.map((o) => (o.id === selectedOrderId ? { ...o, payment: "Refunded", status: "Cancelled" } : o))
                  );
                  setShowRefundSuccess(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer border-none rounded-sm shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Yes, Mark as Refunded
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Refund Success Modal ─── */}
      {showRefundSuccess && activeOrderDetails && (
        <div
          className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-xs flex items-center justify-center z-[80] p-4"
          onClick={() => setShowRefundSuccess(false)}
        >
          <div className="bg-card border-2 border-green-600 p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-[12px] font-black text-green-700 uppercase tracking-wider">Refund Recorded</h3>
                <p className="text-[9px] text-[#615e56] font-semibold mt-0.5">
                  Payment marked as COD - Refunded. Order has been cancelled.
                </p>
              </div>
            </div>
            <div className="border border-green-100 bg-green-50/50 p-3 rounded-sm space-y-1 text-[9px] font-mono font-bold">
              <div className="flex justify-between">
                <span className="text-neutral-500 text-[8px] uppercase tracking-wider">Order ID</span>
                <span className="text-[#382d24]">{activeOrderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-[8px] uppercase tracking-wider">Refund Amount</span>
                <span className="text-green-700 font-black">{RS}{getOrderTotal(activeOrderDetails).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-[8px] uppercase tracking-wider">Bank Transfer To</span>
                <span className="text-[#382d24]">{activeOrderDetails.customerBankDetails?.bankName || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-[8px] uppercase tracking-wider">Beneficiary</span>
                <span className="text-[#382d24]">{activeOrderDetails.customerBankDetails?.accountHolderName || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-[8px] uppercase tracking-wider">Payment Status</span>
                <span className="text-green-700 font-black uppercase tracking-wider">COD - Refunded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-[8px] uppercase tracking-wider">Order Stage</span>
                <span className="text-red-600 font-black uppercase tracking-wider">Cancelled</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowRefundSuccess(false)}
                className="bg-green-700 hover:bg-green-700/85 text-white text-[9px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer border-none rounded-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Return Approve Confirm Modal ─── */}
      {returnApproveConfirmOrder && (
        <div className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-xs flex items-center justify-center z-[75] p-4" onClick={() => setReturnApproveConfirmOrder(null)}>
          <div className="bg-card border-2 border-green-600 p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[12px] font-black text-green-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-700" /> Confirm Refund Processing
            </h3>
            <div className="space-y-3 text-[9.5px] text-[#615e56] font-semibold leading-relaxed">
              <p>You are about to approve the return and confirm manual payment payout of <strong className="text-green-700">{RS}{getOrderTotal(returnApproveConfirmOrder).toLocaleString()}</strong> to the customer's selected destination:</p>
              
              <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-sm space-y-1 font-mono text-[9px]">
                <p><span className="text-neutral-400 uppercase tracking-wider text-[8px] font-bold">Method:</span> <span className="text-[#382d24] font-extrabold uppercase">{returnApproveConfirmOrder.returnRequest?.refundDetails.method.replace("_", " ")}</span></p>
                
                {returnApproveConfirmOrder.returnRequest?.refundDetails.method === "qr_code" && (
                  <div className="pt-1.5 flex flex-col items-center">
                    <p className="text-[8px] text-neutral-400 font-bold mb-1 uppercase tracking-wider">Scannable QR Image</p>
                    <img src={returnApproveConfirmOrder.returnRequest?.refundDetails.qrCodeImage} className="w-32 h-32 border border-neutral-300 bg-white object-contain" alt="Refund UPI QR" />
                  </div>
                )}
                {returnApproveConfirmOrder.returnRequest?.refundDetails.method === "upi" && (
                  <>
                    <p><span className="text-neutral-400 uppercase tracking-wider text-[8px] font-bold">UPI ID:</span> <span className="text-[#382d24] font-extrabold">{returnApproveConfirmOrder.returnRequest?.refundDetails.upiId || "N/A"}</span></p>
                    <p><span className="text-neutral-400 uppercase tracking-wider text-[8px] font-bold">Phone:</span> <span className="text-[#382d24] font-extrabold">{returnApproveConfirmOrder.returnRequest?.refundDetails.phoneNumber || "N/A"}</span></p>
                  </>
                )}
                {returnApproveConfirmOrder.returnRequest?.refundDetails.method === "bank_transfer" && (
                  <>
                    <p><span className="text-neutral-400 uppercase tracking-wider text-[8px] font-bold">Account Holder:</span> <span className="text-[#382d24] font-extrabold">{returnApproveConfirmOrder.returnRequest?.refundDetails.accountHolderName}</span></p>
                    <p><span className="text-neutral-400 uppercase tracking-wider text-[8px] font-bold">Bank Name:</span> <span className="text-[#382d24] font-extrabold">{returnApproveConfirmOrder.returnRequest?.refundDetails.bankName}</span></p>
                    <p><span className="text-neutral-400 uppercase tracking-wider text-[8px] font-bold">Account No:</span> <span className="text-[#382d24] font-extrabold">{returnApproveConfirmOrder.returnRequest?.refundDetails.accountNumber}</span></p>
                    <p><span className="text-neutral-400 uppercase tracking-wider text-[8px] font-bold">IFSC Code:</span> <span className="text-[#382d24] font-extrabold">{returnApproveConfirmOrder.returnRequest?.refundDetails.ifscCode}</span></p>
                  </>
                )}
              </div>

              {/* Transaction ID Input */}
              <div className="space-y-1">
                <label className="block text-[8px] font-bold text-[#615e56] uppercase tracking-wider">
                  Transaction Payout Reference ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={adminTxId}
                  onChange={(e) => setAdminTxId(e.target.value)}
                  placeholder="e.g. UPI8472940294"
                  className="w-full border border-neutral-300 px-2.5 py-1.5 text-[9.5px] font-bold font-mono focus:outline-none focus:border-green-600 rounded-sm"
                />
              </div>

              {/* Screenshot Receipt Upload */}
              <div className="space-y-1">
                <label className="block text-[8px] font-bold text-[#615e56] uppercase tracking-wider">
                  Payment Receipt Screenshot <span className="text-red-500">*</span>
                </label>
                <div className="border border-dashed border-neutral-300 p-3 flex flex-col items-center justify-center cursor-pointer relative bg-neutral-50/50 hover:bg-neutral-50 rounded-sm">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const r = new FileReader();
                        r.onloadend = () => setAdminReceiptScreenshot(r.result as string);
                        r.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {adminReceiptScreenshot ? (
                    <img src={adminReceiptScreenshot} alt="Receipt Preview" className="h-16 object-contain border border-neutral-200" />
                  ) : (
                    <div className="text-center py-1">
                      <Upload className="h-4 w-4 text-neutral-400 mx-auto mb-0.5" />
                      <span className="text-[8px] text-neutral-500 font-bold uppercase">Upload Receipt Image</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-amber-700 font-bold text-[8.5px] flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> Payout Transaction ID & Receipt are required to confirm refund. A confirmation email will be sent automatically.
              </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReturnApproveConfirmOrder(null)}
                className="border border-neutral-300 hover:border-neutral-500 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-sm"
              >
                Cancel
              </button>
              <button
                disabled={!adminTxId || !adminReceiptScreenshot}
                onClick={() => {
                  setOrders((prev) =>
                    prev.map((o) =>
                      o.id === returnApproveConfirmOrder.id
                        ? {
                            ...o,
                            payment: "Refunded",
                            status: "Cancelled",
                            returnRequest: o.returnRequest
                              ? { ...o.returnRequest, status: "completed" }
                              : undefined,
                          }
                        : o
                    )
                  );
                  setShowReturnSuccessAlert({
                    email: returnApproveConfirmOrder.email,
                    txId: adminTxId,
                    customerName: returnApproveConfirmOrder.customer,
                    receiptScreenshot: adminReceiptScreenshot
                  });
                  setReturnApproveConfirmOrder(null);
                }}
                className={`text-white text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer border-none rounded-sm shadow-sm flex items-center gap-1.5 ${
                  adminTxId && adminReceiptScreenshot ? "bg-green-700 hover:bg-green-800" : "bg-neutral-300 cursor-not-allowed"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Return Reject Confirm Modal ─── */}
      {returnRejectConfirmOrder && (
        <div className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-xs flex items-center justify-center z-[75] p-4" onClick={() => setReturnRejectConfirmOrder(null)}>
          <div className="bg-card border-2 border-red-500 p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[12px] font-black text-red-600 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600" /> Reject Return Request
            </h3>
            <p className="text-[10px] text-[#615e56] font-semibold leading-relaxed">
              Are you sure you want to reject the return request for order <strong>{returnRejectConfirmOrder.id}</strong>? Please provide a brief reason:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Returned item does not match product condition tags..."
              rows={3}
              className="w-full border border-neutral-300 p-2.5 text-[10px] font-bold focus:outline-none focus:border-[#224870] rounded-sm transition-all"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReturnRejectConfirmOrder(null)}
                className="border border-neutral-300 hover:border-neutral-500 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setOrders((prev) =>
                    prev.map((o) =>
                      o.id === returnRejectConfirmOrder.id
                        ? {
                            ...o,
                            returnRequest: o.returnRequest
                              ? { ...o.returnRequest, status: "rejected", reason: rejectReason ? `${o.returnRequest.reason} (Rejected: ${rejectReason})` : o.returnRequest.reason }
                              : undefined,
                          }
                        : o
                    )
                  );
                  setReturnRejectConfirmOrder(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer border-none rounded-sm shadow-sm"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Return Success Modal ─── */}
      {showReturnSuccessAlert && (
        <div className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-xs flex items-center justify-center z-[80] p-4" onClick={() => setShowReturnSuccessAlert(null)}>
          <div className="bg-card border-2 border-green-600 p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-[12px] font-black text-green-700 uppercase tracking-wider">Refund Email Dispatched</h3>
                <p className="text-[9px] text-[#615e56] font-semibold mt-0.5">
                  A return approval & refund confirmation email has been dispatched to <strong>{showReturnSuccessAlert.customerName}</strong>.
                </p>
              </div>
            </div>
            <div className="border border-green-100 bg-green-50/50 p-3 rounded-sm space-y-1.5 text-[9px] font-mono font-bold">
              <div className="flex justify-between">
                <span className="text-neutral-500 text-[8px] uppercase tracking-wider">Customer Email</span>
                <span className="text-[#382d24]">{showReturnSuccessAlert.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 text-[8px] uppercase tracking-wider">Transaction ID</span>
                <span className="text-green-700">{showReturnSuccessAlert.txId}</span>
              </div>
              {showReturnSuccessAlert.receiptScreenshot && (
                <div className="pt-2 flex flex-col items-center border-t border-green-100 mt-2">
                  <span className="text-neutral-500 text-[8px] uppercase tracking-wider mb-1 block self-start">Sent Payout Receipt</span>
                  <img src={showReturnSuccessAlert.receiptScreenshot} className="h-24 border border-green-200 bg-white object-contain" alt="Receipt Attachment" />
                </div>
              )}
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowReturnSuccessAlert(null)}
                className="bg-green-700 hover:bg-green-800 text-white text-[9px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer border-none rounded-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}