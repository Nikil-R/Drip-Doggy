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
import { wishlistApi } from "../lib/wishlist-api";
import { syncWishlist } from "../lib/wishlist-sync";
import { productApi } from "../lib/product-api";

type TabKey = "profile" | "orders" | "addresses" | "wishlist";

const NAV_ITEMS: { key: TabKey; icon: typeof User; label: string }[] = [
  { key: "orders", icon: Package, label: "Orders" },
  { key: "profile", icon: User, label: "Profile" },
  { key: "addresses", icon: MapPin, label: "Addresses" },
  { key: "wishlist", icon: Heart, label: "Wishlist" },
];

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    const hash = window.location.hash.replace("#", "");
    if (["profile", "orders", "addresses", "wishlist"].includes(hash)) return hash as TabKey;
    return "orders"; // Default to order history as it is the most critical tab
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

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
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

  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dripdoggy_auth_token");
    if (token) {
      async function loadAddresses() {
        setIsAddressLoading(true);
        try {
          const list = await addressApi.getAddresses();
          setAddresses(list);
        } catch (err) {
          console.error("Error loading addresses:", err);
        } finally {
          setIsAddressLoading(false);
        }
      }
      loadAddresses();
    } else {
      setIsAddressLoading(false);
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
    ];
  });

  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("dripdoggy_auth_token");
    if (!token) {
      setIsWishlistLoading(false);
      return;
    }
    async function loadWishlist() {
      setIsWishlistLoading(true);
      try {
        await syncWishlist();
        const stored = localStorage.getItem("wishlist");
        if (stored) setWishlistItems(JSON.parse(stored));
      } catch (err) {
        console.error("Error loading wishlist:", err);
      } finally {
        setIsWishlistLoading(false);
      }
    }
    loadWishlist();
  }, [user]);

  const removeWishlistItem = async (id: number) => {
    setWishlistItems(prev => {
      const updated = prev.filter((i: any) => i.id !== id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleWishlistArchive = async (item: any) => {
    // noop simulation
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

  // Helper to extract first initials of FirstName & LastName
  const getInitials = () => {
    const firstInitial = profile.firstName ? profile.firstName.trim().charAt(0) : "";
    const lastInitial = profile.lastName ? profile.lastName.trim().charAt(0) : "";
    return (firstInitial + lastInitial).toUpperCase() || "NV";
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200">
      {/* Upper Profile Info Card */}
      <div className="bg-white border-b border-neutral-200/80 shadow-xs relative">
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-left flex-row">
            <div className="w-16 h-16 rounded-full bg-[#030213] text-white flex items-center justify-center font-extrabold text-lg uppercase tracking-wider shadow-sm shrink-0">
              {getInitials()}
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-wider uppercase text-[#030213]">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-[10px] text-neutral-500 font-bold lowercase tracking-widest mt-1">
                {profile.email}
              </p>
            </div>
          </div>
          
          {/* Top-Right Logout Button */}
          <button
            onClick={handleLogout}
            title="Log Out"
            className="w-10 h-10 border border-neutral-200 hover:border-red-200 hover:bg-red-50 text-neutral-600 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer bg-white rounded-full shrink-0"
          >
            <LogOut className="h-4.5 w-4.5 stroke-[1.8]" />
          </button>
        </div>

        {/* Mobile Horizontal Navigation Scroller Tab */}
        <div className="md:hidden border-t border-neutral-100 flex overflow-x-auto scrollbar-none px-4">
          <div className="flex gap-2 py-3 shrink-0">
            {NAV_ITEMS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${
                  activeTab === key
                    ? "bg-[#030213] text-white"
                    : "bg-neutral-100 text-neutral-500 hover:text-[#030213]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Navigation Panel (hidden on mobile) */}
          <div className="hidden md:block w-56 flex-shrink-0">
            <div className="bg-white border border-neutral-200/85 p-3 space-y-1">
              <p className="text-[7.5px] font-black tracking-[0.2em] text-neutral-400 uppercase px-3 py-1">Navigation</p>
              {NAV_ITEMS.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-[9px] font-extrabold tracking-widest uppercase transition-all cursor-pointer border-none ${
                    activeTab === key
                      ? "bg-[#030213] text-white"
                      : "bg-transparent text-neutral-500 hover:bg-neutral-50 hover:text-[#030213]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 stroke-[2]" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Tab Contents Panel */}
          <div className="flex-1 min-w-0">
            {activeTab === "profile" && (
              <ProfileTab profile={profile} setProfile={setProfile} phoneVerified={phoneVerified} setPhoneVerified={setPhoneVerified} />
            )}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "addresses" && (
              <AddressesTab addresses={addresses} setAddresses={setAddresses} profile={profile} isLoading={isAddressLoading} />
            )}
            {activeTab === "wishlist" && (
              <WishlistTab wishlistItems={wishlistItems} isLoading={isWishlistLoading} onRemove={removeWishlistItem} onAddToCart={addWishlistToCart}
                onToggleArchive={toggleWishlistArchive}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}