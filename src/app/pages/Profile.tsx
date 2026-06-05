import { useState } from "react";
import { Link } from "react-router";
import { Search, ShoppingBag, User, Package, Settings, MapPin, CheckCircle, Truck, Share2, HelpCircle } from "lucide-react";

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

export function Profile() {
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("orders");
  const [profile, setProfile] = useState({
    firstName: "Nikil",
    lastName: "Kumar",
    email: "nikil@example.com",
    phone: "+44 7911 123456",
    address: "123 Kings Road",
    city: "London",
    postalCode: "SW3 4TR",
    country: "United Kingdom"
  });

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

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 ">
      {/* Header */}
      

      {/* Main Dashboard Container */}
      <div className="max-w-6xl w-full mx-auto px-6 py-12 flex-1">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left Panel - Dashboard Nav */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            <div className="bg-white border border-neutral-100 rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.01)] text-center md:text-left mb-6">
              <div className="w-16 h-16 bg-neutral-150 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4 border border-neutral-200">
                <User className="h-8 w-8 stroke-[1.2] text-neutral-600" />
              </div>
              <h2 className="text-base font-bold tracking-tight">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 font-medium">{profile.email}</p>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-wider transition-colors ${
                  activeTab === "orders"
                    ? "bg-[#030213] text-white"
                    : "hover:bg-white text-neutral-700 border border-transparent hover:border-neutral-100"
                }`}
              >
                <Package className="h-4 w-4 stroke-[1.5]" />
                MY ORDERS
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-wider transition-colors ${
                  activeTab === "profile"
                    ? "bg-[#030213] text-white"
                    : "hover:bg-white text-neutral-700 border border-transparent hover:border-neutral-100"
                }`}
              >
                <Settings className="h-4 w-4 stroke-[1.5]" />
                PROFILE SETTINGS
              </button>
            </nav>
          </div>

          {/* Right Panel - Tab Contents */}
          <div className="flex-1">
            {activeTab === "orders" ? (
              <div className="space-y-6">
                <h1 className="text-xl font-extrabold tracking-[0.1em] uppercase mb-6 pb-2 border-b border-neutral-200">
                  MY ORDERS
                </h1>

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
                              <p className="text-neutral-950 font-bold">£{order.total.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {order.status === "Delivered" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-green-50 text-green-700 border border-green-200/50">
                                <CheckCircle className="h-3 w-3" /> DELIVERED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200/50">
                                <Truck className="h-3 w-3" /> SHIPPED
                              </span>
                            )}
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
                                <span className="text-sm font-bold text-neutral-900">£{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-neutral-100 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                <h1 className="text-xl font-extrabold tracking-[0.1em] uppercase mb-8 pb-2 border-b border-neutral-200">
                  PROFILE SETTINGS
                </h1>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">FIRST NAME</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">LAST NAME</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">PHONE NUMBER</label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-100">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-neutral-500 mb-6 uppercase flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-600" /> SHIPPING ADDRESS
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">ADDRESS</label>
                        <input
                          type="text"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">CITY</label>
                        <input
                          type="text"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                          className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">POSTAL CODE</label>
                        <input
                          type="text"
                          value={profile.postalCode}
                          onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                          className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#030213] text-white px-8 py-3.5 rounded-md text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg"
                  >
                    SAVE CHANGES
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      
    </div>
  );
}
