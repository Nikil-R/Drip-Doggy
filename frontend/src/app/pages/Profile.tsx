import { useState, useEffect } from "react";
import { Link } from "react-router";
import { User, Package, MapPin, CheckCircle, Truck, Heart, LogOut, Trash2, Plus } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "wishlist">(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "orders" || hash === "profile" || hash === "addresses" || hash === "wishlist") {
      return hash;
    }
    return "profile";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "orders" || hash === "profile" || hash === "addresses" || hash === "wishlist") {
        setActiveTab(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (tab: "profile" | "orders" | "addresses" | "wishlist") => {
    setActiveTab(tab);
    window.location.hash = tab;
  };
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
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

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home Address (Default)",
      street: "123 Kings Road",
      city: "London",
      postalCode: "SW3 4TR",
      country: "United Kingdom"
    },
    {
      id: 2,
      type: "Office Address",
      street: "456 Canary Wharf",
      city: "London",
      postalCode: "E14 5AB",
      country: "United Kingdom"
    }
  ]);

  const [wishlistItems, setWishlistItems] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 1,
        brand: "CONCRETE CULTURE",
        name: "Reflective Utility Sling",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600"
      }
    ];
  });

  const removeWishlistItem = (id: number) => {
    setWishlistItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem("wishlist", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      alert("Logged out successfully.");
      window.location.href = "/";
    }
  };

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
                onClick={() => handleTabChange("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-wider transition-colors ${
                  activeTab === "profile"
                    ? "bg-[#030213] text-white"
                    : "hover:bg-white text-neutral-700 border border-transparent hover:border-neutral-100"
                }`}
              >
                <User className="h-4 w-4 stroke-[1.5]" />
                USER PROFILE
              </button>
              <button
                onClick={() => handleTabChange("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-wider transition-colors ${
                  activeTab === "orders"
                    ? "bg-[#030213] text-white"
                    : "hover:bg-white text-neutral-700 border border-transparent hover:border-neutral-100"
                }`}
              >
                <Package className="h-4 w-4 stroke-[1.5]" />
                ORDER HISTORY
              </button>
              <button
                onClick={() => handleTabChange("addresses")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-wider transition-colors ${
                  activeTab === "addresses"
                    ? "bg-[#030213] text-white"
                    : "hover:bg-white text-neutral-700 border border-transparent hover:border-neutral-100"
                }`}
              >
                <MapPin className="h-4 w-4 stroke-[1.5]" />
                ADDRESSES
              </button>
              <button
                onClick={() => handleTabChange("wishlist")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-wider transition-colors ${
                  activeTab === "wishlist"
                    ? "bg-[#030213] text-white"
                    : "hover:bg-white text-neutral-700 border border-transparent hover:border-neutral-100"
                }`}
              >
                <Heart className="h-4 w-4 stroke-[1.5]" />
                WISHLIST
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-wider transition-colors text-red-600 hover:bg-red-50/50 border border-transparent hover:border-red-100/30 mt-6"
              >
                <LogOut className="h-4 w-4 stroke-[1.5]" />
                LOG OUT
              </button>
            </nav>
          </div>

          {/* Right Panel - Tab Contents */}
          <div className="flex-1">
            {/* Order History Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h1 className="text-xl font-extrabold tracking-[0.1em] uppercase mb-6 pb-2 border-b border-neutral-200">
                  ORDER HISTORY
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
                              <p className="text-[9px] tracking-wider text-neutral-440 uppercase">ORDER ID</p>
                              <p className="text-neutral-900 font-bold">{order.id}</p>
                            </div>
                            <div>
                              <p className="text-[9px] tracking-wider text-neutral-440 uppercase">DATE PLACED</p>
                              <p className="text-neutral-500">{order.date}</p>
                            </div>
                            <div>
                              <p className="text-[9px] tracking-wider text-neutral-440 uppercase">TOTAL AMOUNT</p>
                              <p className="text-neutral-950 font-bold">₹{order.total.toFixed(2)}</p>
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
                                <span className="text-sm font-bold text-neutral-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions Footer */}
                        <div className="px-6 py-4 bg-neutral-50/20 border-t border-neutral-100 flex items-center justify-between gap-4">
                          <button
                            onClick={() => setExpandedOrderId(prev => prev === order.id ? null : order.id)}
                            className="bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] font-bold tracking-wider px-5 py-2.5 rounded-sm uppercase transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                          >
                            {expandedOrderId === order.id ? "Hide Tracking" : "Track Order"}
                          </button>
                          
                          <div className="flex gap-2">
                            {order.status !== "Delivered" ? (
                              <button
                                onClick={() => alert(`Order ${order.id} cancellation request submitted.`)}
                                className="bg-white hover:bg-red-50 text-red-500 border border-red-200 text-[10px] font-bold tracking-wider px-5 py-2.5 rounded-sm uppercase transition-all cursor-pointer"
                              >
                                Cancel Order
                              </button>
                            ) : (
                              <button
                                onClick={() => alert(`Return process initiated for order ${order.id}.`)}
                                className="bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] font-bold tracking-wider px-5 py-2.5 rounded-sm uppercase transition-all cursor-pointer"
                              >
                                Request Return
                              </button>
                            )}
                            <button
                              onClick={() => alert("Invoice download started...")}
                              className="bg-[#030213] hover:bg-neutral-800 text-white text-[10px] font-bold tracking-wider px-5 py-2.5 rounded-sm uppercase transition-all shadow-sm cursor-pointer border-none"
                            >
                              Invoice
                            </button>
                          </div>
                        </div>

                        {/* Expanded Tracking Timeline */}
                        {expandedOrderId === order.id && (
                          <div className="bg-neutral-50 p-6 border-t border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-200 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                              <div>
                                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-800">
                                  Estimated Delivery: 10 June 2026
                                </h4>
                                <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-widest">
                                  Carrier: BlueDart Express • Tracking ID: BD-901287410
                                </p>
                              </div>
                              <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-500 bg-white border border-neutral-200 px-3 py-1.5 rounded-sm">
                                Standard Delivery
                              </span>
                            </div>

                            {/* Visual Timeline Stepper */}
                            <div className="pt-4 pb-2">
                              <div className="flex items-center w-full">
                                {/* Step 1: Order Confirmed */}
                                <div className="flex items-center text-xs font-bold text-neutral-900 relative">
                                  <div className="rounded-full transition duration-500 ease-in-out h-6 w-6 border-2 border-green-600 bg-green-50 flex items-center justify-center text-green-700 text-[10px]">
                                    ✓
                                  </div>
                                  <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider text-center w-20 font-extrabold">
                                    Confirmed
                                  </div>
                                </div>
                                <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                                  order.status === "Shipped" || order.status === "Delivered" ? "border-green-600" : "border-neutral-200"
                                }`}></div>

                                {/* Step 2: Shipped */}
                                <div className="flex items-center text-xs font-bold text-neutral-900 relative">
                                  <div className={`rounded-full transition duration-500 ease-in-out h-6 w-6 border-2 flex items-center justify-center text-[10px] ${
                                    order.status === "Shipped" || order.status === "Delivered"
                                      ? "border-green-600 bg-green-50 text-green-700"
                                      : "border-neutral-300 bg-white text-neutral-400"
                                  }`}>
                                    {order.status === "Shipped" || order.status === "Delivered" ? "✓" : "2"}
                                  </div>
                                  <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider text-center w-20 font-extrabold">
                                    Shipped
                                  </div>
                                </div>
                                <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                                  order.status === "Delivered" ? "border-green-600" : "border-neutral-200"
                                }`}></div>

                                {/* Step 3: Out for Delivery */}
                                <div className="flex items-center text-xs font-bold text-neutral-900 relative">
                                  <div className={`rounded-full transition duration-500 ease-in-out h-6 w-6 border-2 flex items-center justify-center text-[10px] ${
                                    order.status === "Delivered"
                                      ? "border-green-600 bg-green-50 text-green-700"
                                      : order.status === "Shipped"
                                      ? "border-blue-600 bg-blue-50 text-blue-700 animate-pulse"
                                      : "border-neutral-300 bg-white text-neutral-400"
                                  }`}>
                                    {order.status === "Delivered" ? "✓" : "3"}
                                  </div>
                                  <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider text-center w-24 font-extrabold">
                                    Out for Delivery
                                  </div>
                                </div>
                                <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                                  order.status === "Delivered" ? "border-green-600" : "border-neutral-200"
                                }`}></div>

                                {/* Step 4: Delivered */}
                                <div className="flex items-center text-xs font-bold text-neutral-900 relative">
                                  <div className={`rounded-full transition duration-500 ease-in-out h-6 w-6 border-2 flex items-center justify-center text-[10px] ${
                                    order.status === "Delivered"
                                      ? "border-green-600 bg-green-50 text-green-700"
                                      : "border-neutral-300 bg-white text-neutral-400"
                                  }`}>
                                    4
                                  </div>
                                  <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider text-center w-20 font-extrabold">
                                    Delivered
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Spacing for timeline labels */}
                            <div className="h-6"></div>

                            {/* Shipping Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-200/60 text-xs font-semibold">
                              <div>
                                <p className="text-[9px] tracking-wider text-neutral-440 uppercase">Shipping Address</p>
                                <p className="text-neutral-800 font-bold mt-1">{profile.firstName} {profile.lastName}</p>
                                <p className="text-neutral-500 mt-0.5">{profile.address}, {profile.city}, {profile.postalCode}</p>
                              </div>
                              <div>
                                <p className="text-[9px] tracking-wider text-neutral-440 uppercase font-extrabold">Help & Support</p>
                                <p className="text-neutral-500 mt-1">Need help with this order? Contact our support panel.</p>
                                <button
                                  onClick={() => alert("Redirecting to support panel...")}
                                  className="text-[#b2533e] hover:underline font-bold text-[10px] uppercase mt-2 border-none bg-transparent cursor-pointer"
                                >
                                  Contact Support →
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === "profile" && (
              <div className="bg-white border border-neutral-100 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                <h1 className="text-xl font-extrabold tracking-[0.1em] uppercase mb-8 pb-2 border-b border-neutral-200">
                  USER PROFILE
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
                    className="bg-[#030213] text-white px-8 py-3.5 rounded-md text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg border-none cursor-pointer"
                  >
                    SAVE CHANGES
                  </button>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="bg-white border border-neutral-100 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                <div className="flex justify-between items-center mb-8 pb-2 border-b border-neutral-200">
                  <h1 className="text-xl font-extrabold tracking-[0.1em] uppercase">
                    ADDRESSES
                  </h1>
                  <button 
                    onClick={() => alert("Add Address modal open!")}
                    className="flex items-center gap-1.5 bg-[#030213] text-white px-4 py-2 rounded-md text-[10px] font-bold tracking-wider hover:bg-neutral-800 transition-colors uppercase border-none cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> ADD NEW
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map(address => (
                    <div key={address.id} className="border border-neutral-200 rounded-xl p-6 bg-[#FAF8F5]/50 relative hover:border-neutral-900 transition-colors">
                      <span className="text-[10px] font-extrabold text-[#b2533e] uppercase tracking-widest block mb-2">{address.type}</span>
                      <p className="text-sm font-bold text-neutral-800">{profile.firstName} {profile.lastName}</p>
                      <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{address.street}, {address.city}, {address.postalCode}, {address.country}</p>
                      <div className="mt-6 flex gap-4 text-[10px] font-bold tracking-wider">
                        <button onClick={() => alert("Editing Address!")} className="text-neutral-800 hover:text-neutral-950 uppercase border-none bg-transparent cursor-pointer">EDIT</button>
                        <button onClick={() => setAddresses(prev => prev.filter(a => a.id !== address.id))} className="text-red-500 hover:text-red-700 uppercase border-none bg-transparent cursor-pointer">REMOVE</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="bg-white border border-neutral-100 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                <h1 className="text-xl font-extrabold tracking-[0.1em] uppercase mb-8 pb-2 border-b border-neutral-200">
                  WISHLIST
                </h1>

                {wishlistItems.length === 0 ? (
                  <div className="py-12 text-center">
                    <Heart className="h-12 w-12 mx-auto text-neutral-300 stroke-[1.2] mb-4" />
                    <p className="text-sm text-neutral-500 mb-6 font-medium">Your wishlist is empty.</p>
                    <Link
                      to="/shop"
                      className="inline-block bg-[#030213] text-white px-6 py-2.5 rounded-md text-[10px] font-bold tracking-[0.15em] hover:bg-neutral-800 transition-colors uppercase"
                    >
                      Browse Shop
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistItems.map(item => (
                      <div key={item.id} className="border border-neutral-150 rounded-xl p-4 flex gap-4 bg-white relative hover:border-neutral-900 transition-colors">
                        <div className="w-20 h-24 rounded bg-neutral-50 border border-neutral-100 overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <span className="text-[9px] font-bold tracking-widest text-[#b2533e] uppercase">{item.brand}</span>
                            <h4 className="text-xs font-bold text-neutral-900 mt-0.5 line-clamp-1">{item.name}</h4>
                            <p className="text-xs font-semibold text-neutral-500 mt-1">₹{item.price.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => alert(`Added "${item.name}" to bag!`)}
                            className="bg-[#030213] text-white py-2 px-4 rounded text-[9px] font-bold tracking-[0.15em] hover:bg-neutral-800 transition-colors uppercase max-w-max border-none cursor-pointer"
                          >
                            ADD TO BAG
                          </button>
                        </div>
                        <button
                          onClick={() => removeWishlistItem(item.id)}
                          className="absolute top-4 right-4 text-neutral-300 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 stroke-[1.5]" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      
    </div>
  );
}

