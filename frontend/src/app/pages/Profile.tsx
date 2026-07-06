import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ProfileTab } from "../components/account/ProfileTab";
import { OrdersTab } from "../components/account/OrdersTab";
import { AddressesTab } from "../components/account/AddressesTab";
import { WishlistTab } from "../components/account/WishlistTab";
import type { AddressItem } from "../types/account";
import { addressApi } from "../lib/address-api";

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
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth || "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("dripdoggy_auth_token");
    if (token) {
      async function loadAddresses() {
        try {
          const list = await addressApi.getAddresses();
          setAddresses(list);
        } catch (err) {
          console.error("Error loading addresses from DB:", err);
        }
      }
      loadAddresses();
    }
  }, [user]);

  const [phoneVerified, setPhoneVerified] = useState(false);

  const [addresses, setAddresses] = useState<AddressItem[]>(() => {
    try {
      const stored = localStorage.getItem("addresses");
      if (stored) {
        const list = JSON.parse(stored);
        return list.filter((a: any) => a.firstName !== "Nikil" && a.name !== "Nikil");
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
      <div className="max-w-7xl mx-auto px-2 sm:px-3 py-12">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Panel — Unified Dashboard Sidebar */}
          <div className="w-full md:w-60 flex-shrink-0">
            <div className="bg-white border border-neutral-200/80 rounded-sm overflow-hidden divide-y divide-neutral-200/60 shadow-xs">
              {/* User Profile Header Segment */}
              <div className="bg-[#FAF8F5]/80 p-5 text-center md:text-left flex md:flex-row items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#030213] flex items-center justify-center flex-shrink-0 text-white font-bold text-xs uppercase tracking-wider">
                  {profile.firstName ? profile.firstName.slice(0, 2) : "NV"}
                </div>
                <div>
                  <h2 className="text-xs font-bold tracking-[0.05em] uppercase text-[#030213]">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-[10px] text-neutral-400 font-medium mt-0.5 lowercase max-w-[140px] truncate">
                    {profile.email}
                  </p>
                </div>
              </div>

              {/* Navigation Segment */}
              <nav className="p-2 space-y-0.5">
                {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer ${
                      activeTab === key
                        ? "bg-[#FAF8F5] text-[#030213] border-l-2 border-[#b2533e] font-black"
                        : "bg-transparent text-neutral-600 border-l-2 border-transparent hover:bg-neutral-50/50 hover:text-[#030213]"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 stroke-[1.8] ${activeTab === key ? "text-[#b2533e]" : "text-neutral-400"}`} />
                    {label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[10px] font-bold tracking-[0.15em] uppercase border-l-2 border-transparent text-red-500 hover:bg-red-50/50 transition-all duration-200 cursor-pointer bg-transparent mt-2"
                >
                  <LogOut className="h-3.5 w-3.5 stroke-[1.8]" /> Log Out
                </button>
              </nav>
            </div>
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
