import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, CheckCircle, Truck, Eye, Printer, X, QrCode, Smartphone, Banknote, Upload, AlertCircle, RefreshCw, Palette, Tag, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { printInvoice, printBill } from "../../lib/invoice";
import type { Order, RefundDetails, RefundMethod } from "../../types/account";

// Mock Product catalog to fetch sizes & colors for exchanges
const VARIANT_CATALOG: Record<string, { sizes: string[]; colors: { name: string; price: number }[] }> = {
  "Vanguard Tactical Vest": {
    sizes: ["Small", "Medium", "Large", "X-Large"],
    colors: [
      { name: "Stealth Black", price: 185.00 },
      { name: "Olive Drab", price: 195.00 },
      { name: "Sand Tan", price: 175.00 }
    ]
  },
  "Heavyweight Hoodie": {
    sizes: ["Small", "Medium", "Large"],
    colors: [
      { name: "Sandstone", price: 300.00 },
      { name: "Charcoal Grey", price: 320.00 },
      { name: "Off White", price: 290.00 }
    ]
  },
  "Structured Canvas Jacket": {
    sizes: ["Small", "Medium", "Large"],
    colors: [
      { name: "Navy Blue", price: 5800.00 },
      { name: "Sage Green", price: 5800.00 }
    ]
  }
};

const ORDER_DATA: Order[] = [
  {
    id: "DD-90210", date: "05 June 2026", total: 185.00, status: "Shipped",
    items: [{ name: "Vanguard Tactical Vest", brand: "CONCRETE CULTURE", size: "Medium", color: "Stealth Black", price: 185.00, quantity: 1, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-x=0.3&fp-y=0.65&z=2.0" }],
  },
  {
    id: "DD-87321", date: "12 May 2026", total: 600.00, status: "Delivered",
    items: [{ name: "Heavyweight Hoodie", brand: "CONCRETE CULTURE", size: "Small", color: "Sandstone", price: 300.00, quantity: 2, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600" }],
  },
];

function getTimelineSteps(order: Order, datePlaced: string) {
  const isReturn = order.status === "Return Requested" || !!order.returnRequest;
  const isExchange = order.status === "Exchange Requested" || !!(order as any).exchangeRequest;

  if (isReturn) {
    const returnStatus = order.returnRequest?.status || "pending";
    const isApproved = returnStatus === "approved" || returnStatus === "completed";
    const isOutForPickup = returnStatus === "completed"; // Mock transition
    const isReceived = returnStatus === "completed";
    const isCompleted = returnStatus === "completed";

    return [
      { title: "Return Initiated", description: "Return request submitted", date: datePlaced, done: true },
      { title: "Return Approved", description: "Request approved by warehouse", date: isApproved ? "Pending Approval" : "Pending", done: isApproved },
      { title: "Out for Pickup", description: "Courier pickup agent assigned", date: "Pending", done: isOutForPickup },
      { title: "Received at Warehouse", description: "Undergoing quality inspection", date: "Pending", done: isReceived },
      { title: "Refund Completed", description: "Refund sent back to payment source", date: "Pending", done: isCompleted }
    ];
  }

  if (isExchange) {
    const exchangeStatus = (order as any).exchangeRequest?.status || "pending";
    const isApproved = exchangeStatus === "approved" || exchangeStatus === "completed";
    const isOutForPickup = exchangeStatus === "completed";
    const isReceived = exchangeStatus === "completed";
    const isDispatched = exchangeStatus === "completed";
    const isCompleted = exchangeStatus === "completed";

    return [
      { title: "Exchange Initiated", description: "Exchange request submitted", date: datePlaced, done: true },
      { title: "Exchange Approved", description: "Request approved by warehouse", date: isApproved ? "Pending Approval" : "Pending", done: isApproved },
      { title: "Out for Pickup", description: "Courier pickup agent assigned", date: "Pending", done: isOutForPickup },
      { title: "Received at Warehouse", description: "Undergoing quality inspection", date: "Pending", done: isReceived },
      { title: "Replacement Dispatched", description: "New variant shipped out", date: "Pending", done: isDispatched },
      { title: "Exchange Completed", description: "Replacement variant delivered", date: "Pending", done: isCompleted }
    ];
  }

  const isDelivered = order.status === "Delivered";
  const isOutForDelivery = order.status === "Out for Delivery" || isDelivered;
  const isShipped = order.status === "Shipped" || isOutForDelivery;
  const isPacked = order.status === "Packed" || isShipped;
  const isProcessing = order.status === "Processing" || isPacked;
  const isPlaced = order.status === "Placed" || isProcessing;
  return [
    { title: "Placed", description: "Your order has been received", date: datePlaced, done: isPlaced },
    { title: "Processing", description: "Item is being prepared", date: isProcessing ? datePlaced : "Pending", done: isProcessing },
    { title: "Packed", description: "Item picked and packed", date: isPacked ? datePlaced : "Pending", done: isPacked },
    { title: "Shipped", description: "In transit with carrier", date: isShipped ? "06 June 2026" : "Pending", done: isShipped },
    { title: "Out for Delivery", description: "Delivery driver is en route", date: isOutForDelivery ? "08 June 2026" : "Pending", done: isOutForDelivery },
    { title: "Delivered", description: "Package dropped off safely", date: isDelivered ? "08 June 2026" : "Pending", done: isDelivered },
  ];
}

function isWithinReturnWindow(orderDateStr: string): boolean {
  try {
    const orderDate = new Date(orderDateStr);
    if (isNaN(orderDate.getTime())) return true;
    
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - deliveryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 7;
  } catch {
    return true;
  }
}

export function OrdersTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("dd_storefront_orders");
    if (saved) return JSON.parse(saved);
    return ORDER_DATA;
  });
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Return/Exchange Request State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [requestType, setRequestType] = useState<"return" | "exchange">("return");
  const [flowStep, setFlowStep] = useState(1);
  const [reason, setReason] = useState("Defective / Damaged");
  const [otherReasonText, setOtherReasonText] = useState("");
  
  // Max 3 optional defect/payout details images
  const [defectImages, setDefectImages] = useState<string[]>([]);

  // Exchange Variant selectors
  const [selectedExchangeSize, setSelectedExchangeSize] = useState("");
  const [selectedExchangeColor, setSelectedExchangeColor] = useState("");
  
  // Payout refund methods
  const [refundMethod, setRefundMethod] = useState<RefundMethod>("qr_code");
  const [refundDetails, setRefundDetails] = useState<Partial<RefundDetails>>({});
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("dd_storefront_orders", JSON.stringify(orders));
  }, [orders]);

  const profile = {
    firstName: user?.firstName || "Customer",
    lastName: user?.lastName || "",
    email: user?.email || "customer@email.com",
    phone: user?.phone || "",
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "Cancelled" } : o));
    }
  };

  const handleOpenRequestModal = (order: Order, type: "return" | "exchange") => {
    setSelectedOrder(order);
    setRequestType(type);
    setFlowStep(1);
    setReason("Defective / Damaged");
    setOtherReasonText("");
    setRefundMethod("qr_code");
    setRefundDetails({});
    setQrPreview(null);
    setDefectImages([]);

    const item = order.items[0];
    if (item && type === "exchange") {
      const config = VARIANT_CATALOG[item.name];
      if (config) {
        setSelectedExchangeSize(item.size);
        setSelectedExchangeColor(item.color);
      }
    }
  };

  const handleDefectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const availableSlots = 3 - defectImages.length;
    const filesToUpload = Array.from(files).slice(0, availableSlots);

    filesToUpload.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDefectImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveDefectImage = (indexToRemove: number) => {
    setDefectImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setQrPreview(base64);
      setRefundDetails(prev => ({ ...prev, qrCodeImage: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const calculateAdjustment = () => {
    if (!selectedOrder || requestType !== "exchange") return 0;
    const item = selectedOrder.items[0];
    if (!item) return 0;

    const config = VARIANT_CATALOG[item.name];
    if (!config) return 0;

    const selectedColorConfig = config.colors.find(c => c.name === selectedExchangeColor);
    const replacementPrice = selectedColorConfig ? selectedColorConfig.price : item.price;
    return (replacementPrice - item.price) * item.quantity;
  };

  const handleSubmitRequest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedOrder) return;

    const finalReason = reason === "Other" ? `Other: ${otherReasonText}` : reason;
    const adjustment = calculateAdjustment();

    if (requestType === "return") {
      if (refundMethod === "qr_code" && !refundDetails.qrCodeImage) {
        alert("Please upload your UPI QR Code image.");
        return;
      }
      if (refundMethod === "upi" && !refundDetails.upiId && !refundDetails.phoneNumber) {
        alert("Please fill in either your UPI ID or Phone Number.");
        return;
      }
      if (refundMethod === "bank_transfer") {
        const { accountHolderName, bankName, accountNumber, ifscCode } = refundDetails;
        if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
          alert("Please fill in all bank transfer fields.");
          return;
        }
      }

      const returnReq = {
        reason: finalReason,
        refundDetails: { method: refundMethod, ...refundDetails },
        defectImages,
        submittedAt: new Date().toLocaleString(),
        status: "pending"
      };

      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: "Return Requested", returnRequest: returnReq as any } : o));
      setToastMessage("Return request submitted successfully. Our team will review your defect images and complete your refund.");
    } else {
      const isCheaper = adjustment < 0;
      if (isCheaper) {
        if (refundMethod === "qr_code" && !refundDetails.qrCodeImage) {
          alert("Please upload your UPI QR Code image for the partial refund.");
          return;
        }
        if (refundMethod === "upi" && !refundDetails.upiId && !refundDetails.phoneNumber) {
          alert("Please fill in your UPI ID for the partial refund.");
          return;
        }
        if (refundMethod === "bank_transfer") {
          const { accountHolderName, bankName, accountNumber, ifscCode } = refundDetails;
          if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
            alert("Please complete the bank payout transfer details.");
            return;
          }
        }
      }

      const exchangeReq = {
        reason: finalReason,
        originalSize: selectedOrder.items[0]?.size,
        requestedSize: selectedExchangeSize,
        originalColor: selectedOrder.items[0]?.color,
        requestedColor: selectedExchangeColor,
        adjustmentAmount: adjustment,
        refundDetails: isCheaper ? { method: refundMethod, ...refundDetails } : null,
        defectImages,
        submittedAt: new Date().toLocaleString(),
        status: "pending"
      };

      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: "Exchange Requested", exchangeRequest: exchangeReq as any } : o));
      setToastMessage(
        adjustment > 0
          ? `Exchange request submitted. Doorstep COD of ${RS}${adjustment} will be collected during delivery.`
          : "Exchange request submitted successfully. Our logistics partner will coordinate pickup."
      );
    }

    // Unconditionally close the modal and reset steps
    setSelectedOrder(null);
    setFlowStep(1);
    setDefectImages([]);
    setQrPreview(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 6000);
  };
  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-[120] bg-[#030213] text-white border border-[#b2533e] px-6 py-4 shadow-2xl max-w-sm">
          <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#b2533e] mb-1">Request Received</p>
          <p className="text-[9.5px] text-neutral-300 font-semibold leading-relaxed">
            {toastMessage}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
        <Package className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
        <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase">Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-neutral-200/80 p-16 text-center">
          <Package className="h-12 w-12 mx-auto text-neutral-300 stroke-[1.2] mb-4" />
          <h2 className="text-sm font-extrabold tracking-[0.15em] uppercase mb-2">No Orders Yet</h2>
          <p className="text-[11px] text-neutral-500 font-medium mb-6">You haven't placed any orders yet.</p>
          <Link to="/shop" className="inline-block bg-[#030213] hover:bg-neutral-800 text-white px-8 py-3 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const withinWindow = isWithinReturnWindow(order.date);
            const hasReturn = !!order.returnRequest;
            const hasExchange = !!(order as any).exchangeRequest;
            
            return (
              <div key={order.id} className="bg-white border border-neutral-200/85 shadow-xs transition-shadow hover:shadow-sm">
                
                {/* Responsive Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-neutral-50/50 border-b border-neutral-200/60">
                  <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-4 text-[10px] font-bold tracking-wider">
                    <div>
                      <span className="text-[7.5px] font-black tracking-[0.15em] text-neutral-400 uppercase block mb-0.5">Order ID</span>
                      <span className="text-[#030213] font-black">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] font-black tracking-[0.15em] text-neutral-400 uppercase block mb-0.5">Placed On</span>
                      <span className="text-neutral-600 font-medium">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] font-black tracking-[0.15em] text-neutral-400 uppercase block mb-0.5">Total Paid</span>
                      <span className="text-[#030213] font-black font-mono">₹{order.total.toFixed(0)}</span>
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center self-start sm:self-center">
                    {order.returnRequest ? (
                      <span className="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-purple-50 text-purple-700 border border-purple-200">
                        Return: {(order.returnRequest as any).status.toUpperCase()}
                      </span>
                    ) : (order as any).exchangeRequest ? (
                      <span className="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200">
                        Exchange: {((order as any).exchangeRequest).status?.toUpperCase() || "PENDING"}
                      </span>
                    ) : order.status === "Delivered" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-green-50 text-green-700 border border-green-200/60">
                        <CheckCircle className="h-3 w-3" /> Delivered
                      </span>
                    ) : order.status === "Cancelled" ? (
                      <span className="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-200/60">
                        Cancelled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200/60">
                        <Truck className="h-3 w-3" /> {order.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items Block */}
                <div className="divide-y divide-neutral-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 px-5 py-4">
                      <div className="w-16 h-20 bg-neutral-50 border border-neutral-200/50 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <span className="text-[7.5px] font-black tracking-widest text-[#b2533e] uppercase">{item.brand}</span>
                        <h4 className="text-[12.5px] font-black text-[#030213] uppercase mt-0.5 tracking-tight truncate">{item.name}</h4>
                        <p className="text-[9.5px] text-neutral-500 font-bold uppercase tracking-wider mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                          <span>Size: <strong className="text-[#030213]">{item.size}</strong></span>
                          <span className="text-neutral-300">|</span>
                          <span>Color: <strong className="text-[#030213]">{item.color}</strong></span>
                          <span className="text-neutral-300">|</span>
                          <span>Qty: <strong className="text-[#030213]">{item.quantity}</strong></span>
                        </p>
                      </div>
                      <span className="text-[13px] font-black text-[#030213] shrink-0 pt-0.5 font-mono">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                {/* Responsive Action Buttons Container */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-4 bg-neutral-50/20 border-t border-neutral-200/60">
                  <button
                    onClick={() => setTrackingOrder(order)}
                    className="flex items-center justify-center gap-1.5 bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-4 py-2 text-[9px] font-extrabold tracking-widest uppercase transition-all cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" /> Track order
                  </button>
                  
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                    {/* Cancellation Action (Allowed strictly before Shipped stage) */}
                    {(order.status === "Placed" || order.status === "Processing" || order.status === "Packed") && (
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-white border border-red-200 hover:bg-red-50 text-red-500 px-4 py-2.5 text-[8.5px] font-black tracking-widest uppercase transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    {/* Return & Exchange Actions (Hidden if either returnRequest OR exchangeRequest exists) */}
                    {order.status === "Delivered" && !hasReturn && !hasExchange && withinWindow && (
                      <>
                        <button 
                          onClick={() => handleOpenRequestModal(order, "return")}
                          className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 px-4 py-2.5 text-[8.5px] font-black tracking-widest uppercase transition-all cursor-pointer"
                        >
                          Return
                        </button>
                        <button 
                          onClick={() => handleOpenRequestModal(order, "exchange")}
                          className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 px-4 py-2.5 text-[8.5px] font-black tracking-widest uppercase transition-all cursor-pointer"
                        >
                          Exchange
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => printInvoice(order, profile)}
                      className="bg-[#030213] hover:bg-neutral-800 text-white px-4 py-2.5 text-[8.5px] font-black tracking-widest uppercase transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" /> Invoice
                    </button>
                    <button
                      onClick={() => printBill(order, profile)}
                      className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-4 py-2.5 text-[8.5px] font-black tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" /> Bill
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Return & Exchange Request Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-neutral-200 max-w-md w-full p-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-5 right-5 text-neutral-400 hover:text-[#030213] transition-colors bg-transparent border-none cursor-pointer">
              <X className="h-4 w-4 stroke-[1.5]" />
            </button>
            <div>
              <span className="text-[7px] font-black tracking-[0.2em] text-[#b2533e] uppercase">Order {selectedOrder.id}</span>
              <h2 className="text-base font-extrabold tracking-[0.1em] uppercase mt-0.5">
                {requestType === "return" ? "Submit Return Request" : "Submit Exchange Request"}
              </h2>
            </div>

            <div className="flex items-center justify-center gap-4 text-[9px] font-extrabold uppercase tracking-wider border-b border-neutral-100 pb-4">
              <span className={flowStep === 1 ? "text-[#b2533e]" : "text-neutral-400"}>1. Selection & Reason</span>
              {(requestType === "return" || calculateAdjustment() < 0) && (
                <>
                  <span className="text-neutral-300">/</span>
                  <span className={flowStep === 2 ? "text-[#b2533e]" : "text-neutral-400"}>2. Refund Details</span>
                </>
              )}
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              {flowStep === 1 ? (
                <div className="space-y-4">
                  {requestType === "exchange" && selectedOrder.items[0] && (
                    <div className="border border-neutral-100 p-4 bg-neutral-50/50 space-y-4">
                      <p className="text-[9px] font-extrabold tracking-widest text-[#030213] uppercase">Select Replacement Variant</p>
                      
                      {VARIANT_CATALOG[selectedOrder.items[0].name]?.sizes && (
                        <div>
                          <label className="flex items-center gap-1 text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1.5">
                            <Tag className="w-3.5 h-3.5" /> Size
                          </label>
                          <select
                            value={selectedExchangeSize}
                            onChange={(e) => setSelectedExchangeSize(e.target.value)}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                          >
                            {VARIANT_CATALOG[selectedOrder.items[0].name].sizes.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {VARIANT_CATALOG[selectedOrder.items[0].name]?.colors && (
                        <div>
                          <label className="flex items-center gap-1 text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1.5">
                            <Palette className="w-3.5 h-3.5" /> Color / Style
                          </label>
                          <select
                            value={selectedExchangeColor}
                            onChange={(e) => setSelectedExchangeColor(e.target.value)}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                          >
                            {VARIANT_CATALOG[selectedOrder.items[0].name].colors.map(c => (
                              <option key={c.name} value={c.name}>{c.name} {c.price !== selectedOrder.items[0].price && `(₹${c.price})`}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="pt-2 border-t border-neutral-200/50 flex items-center justify-between text-[10px]">
                        <span className="font-bold text-neutral-500 uppercase">Adjustment Due:</span>
                        {calculateAdjustment() === 0 ? (
                          <span className="font-extrabold text-[#030213]">Even Swap (₹0)</span>
                        ) : calculateAdjustment() > 0 ? (
                          <span className="font-extrabold text-red-600">Pay Balance: +₹{calculateAdjustment()}</span>
                        ) : (
                          <span className="font-extrabold text-green-700">Refund Due: -₹{Math.abs(calculateAdjustment())}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reason Dropdown */}
                  <div>
                    <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-2">
                      Reason for {requestType === "return" ? "Return" : "Exchange"}
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                    >
                      <option value="Defective / Damaged">Defective / Damaged</option>
                      <option value="Wrong Size Ordered">Wrong Size Ordered</option>
                      <option value="Color Discrepancy">Color Discrepancy</option>
                      <option value="Not as Described">Not as Described</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {reason === "Other" && (
                    <div>
                      <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-2">Details</label>
                      <textarea
                        value={otherReasonText}
                        onChange={(e) => setOtherReasonText(e.target.value)}
                        placeholder="Elaborate your reason..."
                        rows={3}
                        required
                        className="w-full bg-white border border-neutral-200 p-3 text-[10px] font-medium focus:outline-none focus:border-[#030213]"
                      />
                    </div>
                  )}

                  {/* Optional Image Uploader (Max 3 Images) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500">
                        Upload Defect / Verification Photos
                      </label>
                      <span className="text-[7.5px] text-neutral-400 font-bold uppercase">{defectImages.length} / 3 Uploaded</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {defectImages.map((img, idx) => (
                        <div key={idx} className="aspect-square border border-neutral-200 relative bg-neutral-50 rounded-sm overflow-hidden group">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveDefectImage(idx)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity border-none cursor-pointer text-[8px] font-bold uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      {defectImages.length < 3 && (
                        <label className="aspect-square border-2 border-dashed border-neutral-200 hover:border-[#030213] flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50 rounded-sm">
                          <Camera className="w-4 h-4 text-neutral-400" />
                          <span className="text-[6.5px] text-neutral-500 font-extrabold uppercase mt-1">Add Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleDefectImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (requestType === "return" || calculateAdjustment() < 0) {
                        setFlowStep(2);
                      } else {
                        handleSubmitRequest();
                      }
                    }}
                    className="w-full bg-[#030213] text-white py-3 text-[9px] font-extrabold tracking-[0.2em] uppercase border-none hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    {requestType === "return" || calculateAdjustment() < 0 ? "Next Step" : "Submit Request"}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-2.5">
                      Select Refund Payout Option
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["qr_code", "upi", "bank_transfer"] as RefundMethod[]).map((method) => {
                        const icon = method === "qr_code" ? <QrCode className="h-4 w-4" /> : method === "upi" ? <Smartphone className="h-4 w-4" /> : <Banknote className="h-4 w-4" />;
                        const label = method === "qr_code" ? "QR Code" : method === "upi" ? "UPI ID" : "Bank";
                        const isSel = refundMethod === method;
                        return (
                          <button
                            type="button"
                            key={method}
                            onClick={() => { setRefundMethod(method); setRefundDetails({}); }}
                            className={`p-3 border flex flex-col items-center gap-1.5 transition-all text-center rounded-none cursor-pointer ${
                              isSel ? "border-[#030213] bg-[#030213]/5 text-[#030213]" : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
                            }`}
                          >
                            {icon}
                            <span className="text-[8px] font-extrabold uppercase tracking-widest">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {refundMethod === "qr_code" && (
                    <div className="space-y-2">
                      <span className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500">Upload UPI QR Code Image</span>
                      <div className="border border-dashed border-neutral-200 p-4 flex flex-col items-center justify-center cursor-pointer relative bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                        <input type="file" accept="image/*" onChange={handleQrUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        {qrPreview ? (
                          <img src={qrPreview} alt="QR Preview" className="w-24 h-24 object-contain border border-neutral-200" />
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-neutral-400 mb-1" />
                            <span className="text-[9px] text-neutral-500 font-semibold uppercase">Click or Drag Image to Upload</span>
                            <span className="text-[7.5px] text-neutral-400 mt-0.5">PNG, JPG formats</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {refundMethod === "upi" && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">UPI ID</label>
                        <input
                          type="text"
                          value={refundDetails.upiId || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, upiId: e.target.value }))}
                          placeholder="e.g. name@paytm"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                      <div className="relative flex py-1.5 items-center justify-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-100" /></div>
                        <span className="relative bg-white px-2 text-[8px] font-bold text-neutral-400 uppercase">Or</span>
                      </div>
                      <div>
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">UPI Registered Phone Number</label>
                        <input
                          type="text"
                          value={refundDetails.phoneNumber || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          placeholder="e.g. +91 9876543210"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                    </div>
                  )}

                  {refundMethod === "bank_transfer" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">Account Holder Name</label>
                        <input
                          type="text"
                          value={refundDetails.accountHolderName || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                          required
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={refundDetails.bankName || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, bankName: e.target.value }))}
                          required
                          placeholder="e.g. HDFC Bank"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">IFSC Code</label>
                        <input
                          type="text"
                          value={refundDetails.ifscCode || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                          required
                          placeholder="e.g. HDFC0001234"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-1">Account Number</label>
                        <input
                          type="text"
                          value={refundDetails.accountNumber || ""}
                          onChange={(e) => setRefundDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                          required
                          placeholder="e.g. 50100239482910"
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFlowStep(1)}
                      className="w-1/2 bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 px-4 py-3 text-[9px] font-extrabold tracking-[0.2em] uppercase transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 bg-[#030213] hover:bg-neutral-800 text-white py-3 text-[9px] font-extrabold tracking-[0.2em] uppercase transition-colors cursor-pointer border-none"
                    >
                      Submit Request
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#FAF8F5] border border-neutral-200/80 max-w-md w-full p-8 relative shadow-2xl">
            <button onClick={() => setTrackingOrder(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-[#030213] transition-colors bg-transparent border-none cursor-pointer">
              <X className="h-4 w-4 stroke-[1.5]" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <Truck className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
              <h2 className="text-base font-extrabold tracking-[0.1em] uppercase">
                {trackingOrder.status === "Return Requested" || trackingOrder.returnRequest || trackingOrder.status === "Exchange Requested" || (trackingOrder as any).exchangeRequest
                  ? "Track Return Logistics"
                  : "Track Shipment"}
              </h2>
            </div>
            <p className="text-[8px] font-extrabold tracking-widest text-neutral-400 uppercase mb-6">
              Order: {trackingOrder.id} | Carrier: DripExpress
            </p>
            <div className="space-y-5 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-300">
              {getTimelineSteps(trackingOrder, trackingOrder.date).map((step, idx) => (
                <div key={idx} className="flex gap-4 relative items-start">
                  <div className={`w-[19px] h-[19px] flex items-center justify-center text-[7px] font-extrabold z-10 border ${
                    step.done ? "bg-[#030213] text-white border-[#030213]" : "bg-white text-neutral-400 border-neutral-300"
                  }`}>
                    {step.done ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0 pt-px">
                    <div className="flex justify-between items-baseline">
                      <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${step.done ? "text-[#030213]" : "text-neutral-400"}`}>{step.title}</h4>
                      <span className="text-[7px] font-bold text-neutral-400 uppercase">{step.date}</span>
                    </div>
                    <p className="text-[9px] text-neutral-500 mt-0.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-5 border-t border-neutral-200 flex justify-between items-center text-[8px] font-extrabold tracking-widest text-neutral-500 uppercase">
              <span>Status: <span className="text-blue-600">{trackingOrder.status}</span></span>
              <span>Est: 10 June 2026</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
