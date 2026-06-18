import { useState } from "react";
import { Link } from "react-router";
import { Search, ShoppingBag, Package, CheckCircle, Truck, Share2, HelpCircle } from "lucide-react";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "Delivered" | "Shipped" | "Processing";
  items: {
    name: string;
    brand: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

export function Orders() {
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  const [orders] = useState<Order[]>([
    {
      id: "DD-90210",
      date: "05 June 2026",
      total: 185.00,
      status: "Shipped",
      items: [
        {
          name: "Vanguard Tactical Vest",
          brand: "CONCRETE CULTURE",
          size: "Medium",
          color: "Stealth Black",
          price: 185.00,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-x=0.3&fp-y=0.65&z=2.0"
        }
      ]
    },
    {
      id: "DD-87321",
      date: "12 May 2026",
      total: 600.00,
      status: "Delivered",
      items: [
        {
          name: "Heavyweight Hoodie",
          brand: "CONCRETE CULTURE",
          size: "Small",
          color: "Sandstone",
          price: 300.00,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600"
        }
      ]
    }
  ]);

  const getTimelineSteps = (status: string, datePlaced: string) => {
    const isDelivered = status === "Delivered";
    const isShipped = status === "Shipped" || isDelivered;
    
    return [
      {
        title: "Order Placed",
        description: "Your order has been received",
        date: datePlaced,
        time: "10:30 AM",
        done: true
      },
      {
        title: "Processing",
        description: "Item picked and packed",
        date: datePlaced,
        time: "02:15 PM",
        done: true
      },
      {
        title: "Shipped",
        description: "In transit with carrier",
        date: isShipped ? "06 June 2026" : "Pending",
        time: isShipped ? "09:00 AM" : "",
        done: isShipped
      },
      {
        title: "Out for Delivery",
        description: "Delivery driver is en route",
        date: isDelivered ? "08 June 2026" : "Pending",
        time: isDelivered ? "11:45 AM" : "",
        done: isDelivered
      },
      {
        title: "Delivered",
        description: "Package dropped off safely",
        date: isDelivered ? "08 June 2026" : "Pending",
        time: isDelivered ? "03:00 PM" : "",
        done: isDelivered
      }
    ];
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 ">
      {/* Header */}
      

      {/* Main Content */}
      <div className="max-w-4xl w-full mx-auto px-6 py-12 flex-1">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-200">
          <Package className="h-6 w-6 stroke-[1.5]" />
          <h1 className="text-2xl font-extrabold tracking-[0.1em] uppercase">
            ORDER HISTORY
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-100 p-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
            <Package className="h-12 w-12 mx-auto text-neutral-300 stroke-[1.2] mb-4" />
            <p className="text-sm text-neutral-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]"
              >
                {/* Order Header info */}
                <div className="bg-neutral-50/50 border-b border-neutral-100 px-6 py-4 flex flex-wrap justify-between items-center gap-4 text-xs font-semibold">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[9px] tracking-wider text-neutral-400 uppercase">ORDER ID</p>
                      <p className="text-neutral-900 font-bold">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-wider text-neutral-400 uppercase">DATE PLACED</p>
                      <p className="text-neutral-500">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-wider text-neutral-400 uppercase">TOTAL AMOUNT</p>
                      <p className="text-neutral-950 font-bold">₹{order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {order.status === "Delivered" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-green-50 text-green-700 border border-green-200/50">
                        <CheckCircle className="h-3 w-3" /> DELIVERED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200/50">
                        <Truck className="h-3 w-3" /> SHIPPED
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedTrackingOrder(order)}
                      className="text-[9px] font-bold tracking-[0.15em] border border-neutral-300 px-3 py-1.5 rounded-sm hover:border-[#030213] hover:text-[#030213] transition-colors uppercase"
                    >
                      TRACK ORDER
                    </button>
                  </div>
                </div>

                {/* Order Items list */}
                <div className="p-6 divide-y divide-neutral-100">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-6 py-4 first:pt-0 last:pb-0">
                      <div className="w-16 h-16 rounded bg-neutral-50 border border-neutral-100 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold tracking-widest text-[#b2533e] uppercase">{item.brand}</span>
                        <h4 className="text-sm font-bold text-neutral-900 mt-0.5">{item.name}</h4>
                        <p className="text-xs text-neutral-400 mt-1 font-medium">
                          Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-neutral-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {selectedTrackingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#FAF8F5] border border-neutral-200/80 rounded-xl max-w-md w-full p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedTrackingOrder(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-950 text-xl font-bold p-1"
            >
              ×
            </button>
            <h2 className="text-xl font-extrabold tracking-[0.1em] mb-1 uppercase">
              TRACK SHIPMENT
            </h2>
            <p className="text-neutral-500 text-[10px] tracking-wider uppercase mb-6">
              ORDER ID: {selectedTrackingOrder.id} | Carrier: DripExpress
            </p>

            {/* Timeline Wrapper */}
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-250">
              {getTimelineSteps(selectedTrackingOrder.status, selectedTrackingOrder.date).map((step, idx) => (
                <div key={idx} className="flex gap-4 relative items-start">
                  {/* Dot status */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                    step.done 
                      ? "bg-[#030213] text-white border-2 border-neutral-900" 
                      : "bg-white text-neutral-400 border-2 border-neutral-250"
                  }`}>
                    {step.done ? "✓" : idx + 1}
                  </div>
                  
                  {/* Step Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${step.done ? "text-neutral-900" : "text-neutral-400"}`}>
                        {step.title}
                      </h4>
                      <span className="text-[9px] font-bold text-neutral-450 uppercase">{step.date} {step.time}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-250 flex justify-between items-center text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
              <span>STATUS: <span className={selectedTrackingOrder.status === "Delivered" ? "text-green-600" : "text-blue-600"}>{selectedTrackingOrder.status}</span></span>
              <span>EST. DELIVERY: 08 June 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      
    </div>
  );
}
