import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, CheckCircle, Truck, Eye, Printer, X, QrCode, Smartphone, Banknote, Upload, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { printInvoice } from "../../lib/invoice";
import type { Order, ReturnRequest, RefundDetails, RefundMethod } from "../../types/account";

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

function getTimelineSteps(status: string, datePlaced: string) {
  const isDelivered = status === "Delivered" || status === "Return Requested";
  const isShipped = status === "Shipped" || isDelivered;
  return [
    { title: "Order Placed", description: "Your order has been received", date: datePlaced, done: true },
    { title: "Processing", description: "Item picked and packed", date: datePlaced, done: true },
    { title: "Shipped", description: "In transit with carrier", date: isShipped ? "06 June 2026" : "Pending", done: isShipped },
    { title: "Out for Delivery", description: "Delivery driver is en route", date: isDelivered ? "08 June 2026" : "Pending", done: isDelivered },
    { title: "Delivered", description: "Package dropped off safely", date: isDelivered ? "08 June 2026" : "Pending", done: isDelivered },
  ];
}

export function OrdersTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("dd_storefront_orders");
    if (saved) return JSON.parse(saved);
    return ORDER_DATA;
  });
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<Order | null>(null);

  // Return Form State
  const [returnStep, setReturnStep] = useState(1);
  const [returnReason, setReturnReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");
  const [refundMethod, setRefundMethod] = useState<RefundMethod>("qr_code");
  const [refundDetails, setRefundDetails] = useState<Partial<RefundDetails>>({});
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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

  const handleOpenReturnModal = (order: Order) => {
    setSelectedReturnOrder(order);
    setReturnStep(1);
    setReturnReason("Defective / Damaged");
    setOtherReasonText("");
    setRefundMethod("qr_code");
    setRefundDetails({});
    setQrPreview(null);
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

  const handleCloseReturnModal = () => {
    setSelectedReturnOrder(null);
  };

  const handleNextStep = () => {
    if (returnStep === 1) {
      setReturnStep(2);
    }
  };

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnOrder) return;

    // Validation
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

    const finalReason = returnReason === "Other" ? `Other: ${otherReasonText}` : returnReason;

    const returnReq: ReturnRequest = {
      reason: finalReason,
      refundDetails: {
        method: refundMethod,
        ...refundDetails
      } as RefundDetails,
      submittedAt: new Date().toLocaleString(),
      status: "pending"
    };

    setOrders(prev => prev.map(o => o.id === selectedReturnOrder.id ? { ...o, status: "Return Requested", returnRequest: returnReq } : o));
    setSelectedReturnOrder(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-[120] bg-[#030213] text-white border border-[#b2533e] px-6 py-4 shadow-2xl max-w-sm">
          <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#b2533e] mb-1">Return Submitted</p>
          <p className="text-[9.5px] text-neutral-300 font-semibold leading-relaxed">
            Return request submitted successfully. Our team will review and process your refund within 3-5 business days.
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
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-neutral-200/80">
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-neutral-50/50 border-b border-neutral-200/80">
                <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold tracking-wider">
                  <div>
                    <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-0.5">Order ID</span>
                    <span className="text-[#030213] font-extrabold tracking-wide">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-0.5">Date</span>
                    <span className="text-neutral-600">{order.date}</span>
                  </div>
                  <div>
                    <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-0.5">Total</span>
                    <span className="text-[#030213] font-extrabold">₹{order.total.toFixed(0)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  {order.returnRequest ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 text-[8px] font-extrabold tracking-widest uppercase bg-purple-50 text-purple-700 border border-purple-200">
                      Return: {order.returnRequest.status.toUpperCase()}
                    </span>
                  ) : order.status === "Delivered" ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 text-[8px] font-extrabold tracking-widest uppercase bg-green-50 text-green-700 border border-green-200/60">
                      <CheckCircle className="h-3 w-3 stroke-[1.5]" /> Delivered
                    </span>
                  ) : order.status === "Cancelled" ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 text-[8px] font-extrabold tracking-widest uppercase bg-red-50 text-red-700 border border-red-200/60">
                      Cancelled
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-1 text-[8px] font-extrabold tracking-widest uppercase bg-blue-50 text-blue-700 border border-blue-200/60">
                      <Truck className="h-3 w-3 stroke-[1.5]" /> {order.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-neutral-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-14 h-18 bg-neutral-100 border border-neutral-200/60 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] font-extrabold tracking-widest text-[#b2533e] uppercase">{item.brand}</span>
                      <h4 className="text-[12px] font-extrabold text-[#030213] uppercase mt-0.5 truncate">{item.name}</h4>
                      <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-[12px] font-extrabold text-[#030213] flex-shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              {/* Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-neutral-50/30 border-t border-neutral-200/80">
                <button
                  onClick={() => setTrackingOrder(order)}
                  className="flex items-center gap-1.5 bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-4 py-2 text-[9px] font-extrabold tracking-widest uppercase transition-all cursor-pointer"
                >
                  <Eye className="h-3 w-3 stroke-[1.5]" /> Track Order
                </button>
                <div className="flex items-center gap-2">
                  {/* Cancel Button */}
                  {(order.status === "Pending" || order.status === "Processing") && (
                    <button 
                      onClick={() => handleCancelOrder(order.id)}
                      className="bg-white border border-red-200 hover:bg-red-50 text-red-500 px-4 py-2 text-[8px] font-extrabold tracking-widest uppercase transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  {/* Return Button */}
                  {order.status === "Delivered" && !order.returnRequest && (
                    <button 
                      onClick={() => handleOpenReturnModal(order)}
                      className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 px-4 py-2 text-[8px] font-extrabold tracking-widest uppercase transition-all cursor-pointer"
                    >
                      Return
                    </button>
                  )}
                  <button
                    onClick={() => printInvoice(order, profile)}
                    className="flex items-center gap-1.5 bg-[#030213] hover:bg-neutral-800 text-white px-4 py-2 text-[8px] font-extrabold tracking-widest uppercase transition-all cursor-pointer border-none"
                  >
                    <Printer className="h-3 w-3 stroke-[1.5]" /> Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return Request Modal */}
      {selectedReturnOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-neutral-200 max-w-md w-full p-8 relative shadow-2xl space-y-6">
            <button onClick={handleCloseReturnModal} className="absolute top-5 right-5 text-neutral-400 hover:text-[#030213] transition-colors bg-transparent border-none cursor-pointer">
              <X className="h-4 w-4 stroke-[1.5]" />
            </button>
            <div>
              <span className="text-[7px] font-black tracking-[0.2em] text-[#b2533e] uppercase">Order {selectedReturnOrder.id}</span>
              <h2 className="text-base font-extrabold tracking-[0.1em] uppercase mt-0.5">Submit Return Request</h2>
            </div>

            {/* Stepper Steps */}
            <div className="flex items-center justify-center gap-4 text-[9px] font-extrabold uppercase tracking-wider border-b border-neutral-100 pb-4">
              <span className={returnStep === 1 ? "text-[#b2533e]" : "text-neutral-400"}>1. Reason</span>
              <span className="text-neutral-300">/</span>
              <span className={returnStep === 2 ? "text-[#b2533e]" : "text-neutral-400"}>2. Refund Details</span>
            </div>

            <form onSubmit={handleSubmitReturn} className="space-y-4">
              {returnStep === 1 ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-2">Reason for Return</label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213]"
                    >
                      <option value="Defective / Damaged">Defective / Damaged</option>
                      <option value="Wrong Size">Wrong Size</option>
                      <option value="Not as Described">Not as Described</option>
                      <option value="Changed Mind">Changed Mind</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {returnReason === "Other" && (
                    <div>
                      <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-2">Details</label>
                      <textarea
                        value={otherReasonText}
                        onChange={(e) => setOtherReasonText(e.target.value)}
                        placeholder="Please elaborate your reason..."
                        rows={3}
                        required
                        className="w-full bg-white border border-neutral-200 p-3 text-[10px] font-medium focus:outline-none focus:border-[#030213]"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-[#030213] text-white py-3 text-[9px] font-extrabold tracking-[0.2em] uppercase border-none hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Next Step
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[8px] font-black tracking-[0.15em] uppercase text-neutral-500 mb-2.5">Select Refund Method</label>
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

                  {/* Dynamic Form Input based on Method */}
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
                            <span className="text-[7.5px] text-neutral-400 mt-0.5">PNG, JPG formats supported</span>
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
                          placeholder="e.g. example@paytm"
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
                      onClick={() => setReturnStep(1)}
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
              <h2 className="text-base font-extrabold tracking-[0.1em] uppercase">Track Shipment</h2>
            </div>
            <p className="text-[8px] font-extrabold tracking-widest text-neutral-400 uppercase mb-6">
              Order: {trackingOrder.id} | Carrier: DripExpress
            </p>
            <div className="space-y-5 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-300">
              {getTimelineSteps(trackingOrder.status, trackingOrder.date).map((step, idx) => (
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
              <span>Status: <span className={trackingOrder.status === "Delivered" ? "text-green-600" : "text-blue-600"}>{trackingOrder.status}</span></span>
              <span>Est: 10 June 2026</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
