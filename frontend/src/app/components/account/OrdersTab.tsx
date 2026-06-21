import { useState } from "react";
import { Link } from "react-router";
import { Package, CheckCircle, Truck, Eye, Printer, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { printInvoice } from "../../lib/invoice";
import type { Order } from "../../types/account";

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
  const isDelivered = status === "Delivered";
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
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  const profile = {
    firstName: user?.firstName || "Customer",
    lastName: user?.lastName || "",
    email: user?.email || "customer@email.com",
    phone: user?.phone || "",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
        <Package className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
        <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase">Order History</h1>
      </div>

      {ORDER_DATA.length === 0 ? (
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
          {ORDER_DATA.map((order) => (
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
                    <span className="text-[#030213] font-extrabold">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  {order.status === "Delivered" ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 text-[8px] font-extrabold tracking-widest uppercase bg-green-50 text-green-700 border border-green-200/60">
                      <CheckCircle className="h-3 w-3 stroke-[1.5]" /> Delivered
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
                    <span className="text-[12px] font-extrabold text-[#030213] flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
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
                  {order.status !== "Delivered" ? (
                    <button onClick={() => alert(`Order ${order.id} cancellation submitted.`)}
                      className="bg-white border border-red-200 hover:bg-red-50 text-red-500 px-4 py-2 text-[8px] font-extrabold tracking-widest uppercase transition-all cursor-pointer">
                      Cancel
                    </button>
                  ) : (
                    <button onClick={() => alert(`Return initiated for order ${order.id}.`)}
                      className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 px-4 py-2 text-[8px] font-extrabold tracking-widest uppercase transition-all cursor-pointer">
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
