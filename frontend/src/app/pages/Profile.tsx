import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ProfileTab } from "../components/account/ProfileTab";
import { OrdersTab } from "../components/account/OrdersTab";
import { AddressesTab } from "../components/account/AddressesTab";
import { WishlistTab } from "../components/account/WishlistTab";
import type { AddressItem } from "../types/account";

type TabKey = "profile" | "orders" | "addresses" | "wishlist";

const NAV_ITEMS: { key: TabKey; icon: typeof User; label: string }[] = [
  { key: "profile", icon: User, label: "User Profile" },
  { key: "orders", icon: Package, label: "Order History" },
  { key: "addresses", icon: MapPin, label: "Addresses" },
  { key: "wishlist", icon: Heart, label: "Wishlist" },
];

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    const hash = window.location.hash.replace("#", "");
    if (["profile", "orders", "addresses", "wishlist"].includes(hash)) return hash as TabKey;
    return "profile";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["profile", "orders", "addresses", "wishlist"].includes(hash)) {
        setActiveTab(hash as TabKey);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [addresses, setAddresses] = useState<AddressItem[]>(() => {
    try {
      const stored = localStorage.getItem("addresses");
      if (stored) {
        const list = JSON.parse(stored);
        return list.filter((a: any) => a.firstName !== "Jeshwanth" && a.name !== "Jeshwanth");
      }
    } catch { /* noop */ }
    return [
      { id: 1, type: "HOME", firstName: profile.firstName || "Test", lastName: profile.lastName || "User",
        buildingNo: "42", buildingName: "Boutique Residency", street: "High Street", area: "Downtown",
        city: "New Delhi", state: "Delhi", postalCode: "110001", phone: "9876543210", isDefault: true },
      { id: 2, type: "OFFICE", firstName: profile.firstName || "Test", lastName: "Office",
        buildingNo: "7th", buildingName: "Corporate Tower", street: "MG Road", area: "Business District",
        city: "Mumbai", state: "Maharashtra", postalCode: "400001", phone: "9988776655", isDefault: false },
    ];
  });

  const [wishlistItems, setWishlistItems] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) return JSON.parse(stored);
    } catch { /* noop */ }
    return [
      { id: 1, brand: "CONCRETE CULTURE", name: "Reflective Utility Sling", price: 45.00,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600" },
      { id: 2, brand: "ARCHITECTURAL PRECISION", name: "Structure Tactical Layer", price: 485.00,
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600", outOfStock: true },
    ];
  });

  const removeWishlistItem = (id: number) => {
    setWishlistItems(prev => {
      const updated = prev.filter((item: any) => item.id !== id);
      try { localStorage.setItem("wishlist", JSON.stringify(updated)); window.dispatchEvent(new Event("wishlist-updated")); } catch { /* noop */ }
      return updated;
    });
  };

  const addWishlistToCart = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const stored = localStorage.getItem("cart");
      let cart = stored ? JSON.parse(stored) : [];
      const cartItemId = `${item.id}-Default-S`;
      const existing = cart.find((i: any) => i.cartItemId === cartItemId);
      if (existing) { existing.quantity += 1; }
      else {
        cart.push({ id: item.id, cartItemId, brand: item.brand, name: item.name, size: "S", color: "Default", price: item.price, quantity: 1, image: item.image });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
    } catch { /* noop */ }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Panel — Dashboard Nav */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            <div className="bg-white border border-neutral-200/80 p-6 text-center md:text-left mb-6">
              <div className="w-16 h-16 bg-[#FAF8F5] border border-neutral-200 flex items-center justify-center mx-auto md:mx-0 mb-4">
                <User className="h-8 w-8 stroke-[1.2] text-neutral-600" />
              </div>
              <h2 className="text-sm font-extrabold tracking-[0.05em] uppercase text-[#030213]">{profile.firstName} {profile.lastName}</h2>
              <p className="text-[10px] text-neutral-400 font-medium mt-1.5 lowercase">{profile.email}</p>
            </div>

            <nav className="space-y-0.5">
              {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => handleTabChange(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-extrabold tracking-[0.15em] uppercase transition-all duration-200 border cursor-pointer ${
                    activeTab === key
                      ? "bg-[#030213] text-white border-[#030213]"
                      : "bg-transparent text-neutral-600 border-transparent hover:bg-white hover:border-neutral-200"
                  }`}>
                  <Icon className={`h-3.5 w-3.5 stroke-[1.8] ${activeTab === key ? "text-white" : "text-neutral-400"}`} />
                  {label}
                </button>
              ))}
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-extrabold tracking-[0.15em] uppercase border border-transparent text-red-500 hover:bg-red-50/50 hover:border-red-200/30 transition-all duration-200 cursor-pointer bg-transparent mt-4">
                <LogOut className="h-3.5 w-3.5 stroke-[1.8]" /> Log Out
              </button>
            </nav>
          </div>

          {/* Right Panel — Tab Contents */}
          <div className="flex-1 min-w-0">
            {activeTab === "profile" && (
              <ProfileTab profile={profile} setProfile={setProfile} phoneVerified={phoneVerified} setPhoneVerified={setPhoneVerified} />
            )}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "addresses" && (
              <AddressesTab addresses={addresses} setAddresses={setAddresses} profile={profile} />
            )}
            {activeTab === "wishlist" && (
              <WishlistTab wishlistItems={wishlistItems} onRemove={removeWishlistItem} onAddToCart={addWishlistToCart} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
