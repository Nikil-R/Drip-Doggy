import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  User,
  Package,
  MapPin,
  CheckCircle,
  Truck,
  Heart,
  LogOut,
  Trash2,
  Plus,
  Mail,
  Phone,
  ShieldCheck,
  Zap,
  BadgeCheck,
  Printer,
  Eye,
  X,
  Edit2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMockOtp } from "../lib/auth-storage";
import { OTPInput } from "input-otp";

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

interface AddressItem {
  id: number;
  type: string;
  firstName: string;
  lastName: string;
  buildingNo: string;
  buildingName: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

// ─── Invoice Print Component ────────────────────────────────────────────────
function generateInvoiceHTML(order: Order, user: { firstName: string; lastName: string; email: string; phone: string }) {
  return `
<!DOCTYPE html>
<html>
<head><title>Invoice — ${order.id}</title>
<style>
  @page { margin: 20mm 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; color: #111; background: #fff; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 24px; }
  .brand { font-size: 24px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; }
  .brand-sub { font-size: 9px; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
  .invoice-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #666; }
  .invoice-number { font-size: 18px; font-weight: 900; margin-top: 4px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
  .section-title { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-bottom: 6px; }
  .section-value { font-size: 10px; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { font-size: 8px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #888; text-align: left; padding: 8px 4px; border-bottom: 1px solid #ddd; }
  td { font-size: 10px; padding: 10px 4px; border-bottom: 1px solid #eee; }
  .amount { text-align: right; font-weight: 700; }
  .total-row td { font-size: 12px; font-weight: 900; border-top: 2px solid #111; padding-top: 10px; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 8px; color: #aaa; letter-spacing: 1px; text-transform: uppercase; text-align: center; }
  .status-badge { display: inline-block; font-size: 8px; font-weight: 700; letter-spacing: 2px; padding: 3px 8px; border: 1px solid #111; text-transform: uppercase; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">DRIP DOGGY</div>
      <div class="brand-sub">Luxury Streetwear — Est. 2026</div>
    </div>
    <div style="text-align: right;">
      <div class="invoice-title">Invoice / Tax Receipt</div>
      <div class="invoice-number">${order.id}</div>
      <div style="font-size:9px;color:#888;margin-top:4px;">Date: ${order.date}</div>
    </div>
  </div>

  <div class="grid-2">
    <div>
      <div class="section-title">Bill To</div>
      <div class="section-value">
        ${user.firstName} ${user.lastName}<br>
        ${user.email}<br>
        ${user.phone}
      </div>
    </div>
    <div>
      <div class="section-title" style="text-align:right;">Order Status</div>
      <div style="text-align:right;margin-top:4px;">
        <span class="status-badge">${order.status}</span>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Item</th><th>Brand</th><th>Size/Color</th><th class="amount">Qty</th><th class="amount">Price</th><th class="amount">Total</th></tr>
    </thead>
    <tbody>
      ${order.items.map(item => `
        <tr>
          <td style="font-weight:700;">${item.name}</td>
          <td style="color:#888;font-size:9px;">${item.brand}</td>
          <td style="color:#888;font-size:9px;">${item.size} / ${item.color}</td>
          <td class="amount">${item.quantity}</td>
          <td class="amount">₹${item.price.toFixed(2)}</td>
          <td class="amount">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div style="margin-left:auto;width:280px;">
    <div style="display:flex;justify-content:space-between;font-size:10px;padding:4px 0;">
      <span style="color:#888;letter-spacing:1px;text-transform:uppercase;font-size:9px;">Subtotal</span>
      <span style="font-weight:700;">₹${order.total.toFixed(2)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:10px;padding:4px 0;">
      <span style="color:#888;letter-spacing:1px;text-transform:uppercase;font-size:9px;">Delivery</span>
      <span style="font-weight:700;">FREE</span>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:12px;padding:8px 0;border-top:2px solid #111;margin-top:4px;font-weight:900;">
      <span style="letter-spacing:1px;text-transform:uppercase;">Total</span>
      <span>₹${order.total.toFixed(2)}</span>
    </div>
  </div>

  <div class="footer">
    Drip Doggy — Architectural silhouettes, premium fabrication, uncompromised street luxury.<br>
    Thank you for your order.
  </div>

  <script>window.print();window.close();<\/script>
</body>
</html>`;
}

// ─── Phone OTP Verification Module ──────────────────────────────────────────
function PhoneVerification({
  phone,
  onVerified,
}: {
  phone: string;
  onVerified: () => void;
}) {
  const [step, setStep] = useState<"idle" | "otp" | "success">("idle");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async () => {
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number with at least 10 digits.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    // Simulate OTP send delay
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    setStep("otp");
    setOtp("");
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    if (otp !== getMockOtp()) {
      setError("Invalid OTP. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setStep("success");
    onVerified();
  };

  const handleAutoFill = () => {
    setOtp(getMockOtp());
    setTimeout(() => {
      handleVerifyOtp();
    }, 150);
  };

  if (step === "success") {
    return (
      <div className="flex items-center gap-1.5 text-green-600">
        <BadgeCheck className="h-3.5 w-3.5 stroke-[1.5]" />
        <span className="text-[9px] font-extrabold tracking-wider uppercase">Phone Verified</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {step === "idle" ? (
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 text-[9px] font-extrabold tracking-widest uppercase text-[#b2533e] hover:text-[#a04835] transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50"
        >
          <ShieldCheck className="h-3 w-3 stroke-[1.5]" />
          {isSubmitting ? "SENDING..." : "VERIFY PHONE"}
        </button>
      ) : (
        <div className="space-y-3 border border-neutral-200 bg-[#FAF8F5] p-4">
          <p className="text-[8px] font-extrabold tracking-widest text-neutral-500 uppercase">
            Enter OTP sent to <span className="text-[#030213]">{phone}</span>
          </p>
          <div className="flex justify-center">
            <OTPInput
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={isSubmitting}
              containerClassName="flex items-center gap-1.5"
              render={({ slots }) => (
                <>
                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className={`w-8 h-10 flex items-center justify-center text-sm font-mono font-extrabold bg-white border transition-all duration-200 ${
                        slot.isActive
                          ? "border-[#030213] ring-1 ring-[#030213]/20"
                          : "border-neutral-200"
                      }`}
                    >
                      {slot.char ? (
                        <span>{slot.char}</span>
                      ) : (
                        <span className="text-neutral-300">•</span>
                      )}
                    </div>
                  ))}
                </>
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isSubmitting || otp.length !== 6}
              className="flex-1 bg-[#030213] hover:bg-neutral-800 text-white text-[8px] font-extrabold tracking-widest py-2 uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {isSubmitting ? "VERIFYING..." : "VERIFY OTP"}
            </button>
            <button
              type="button"
              onClick={handleAutoFill}
              className="flex items-center gap-1 text-[8px] font-extrabold tracking-widest text-[#b2533e] hover:text-[#a04835] transition-colors px-2 bg-transparent border-none cursor-pointer"
            >
              <Zap className="h-3 w-3" />
              AUTO-FILL
            </button>
          </div>

          {error && (
            <p className="text-[8px] font-extrabold text-red-600 tracking-wider uppercase">{error}</p>
          )}

          <button
            type="button"
            onClick={() => { setStep("idle"); setError(null); }}
            className="text-[8px] font-bold text-neutral-400 hover:text-neutral-600 underline underline-offset-2 bg-transparent border-none cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

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
    } catch {}
    return [
      {
        id: 1, type: "HOME", firstName: profile.firstName || "Test", lastName: profile.lastName || "User",
        buildingNo: "42", buildingName: "Boutique Residency", street: "High Street", area: "Downtown",
        city: "New Delhi", state: "Delhi", postalCode: "110001", phone: "9876543210", isDefault: true,
      },
      {
        id: 2, type: "OFFICE", firstName: profile.firstName || "Test", lastName: "Office",
        buildingNo: "7th", buildingName: "Corporate Tower", street: "MG Road", area: "Business District",
        city: "Mumbai", state: "Maharashtra", postalCode: "400001", phone: "9988776655", isDefault: false,
      },
    ];
  });

  // Address form state
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    type: "HOME",
    otherName: "",
    firstName: "",
    lastName: "",
    buildingNo: "",
    buildingName: "",
    street: "",
    area: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    isDefault: false,
  });

  // Sync addresses to localStorage
  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  const [wishlistItems, setWishlistItems] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) return JSON.parse(stored);
    } catch { /* noop */ }
    return [
      {
        id: 1, brand: "CONCRETE CULTURE", name: "Reflective Utility Sling", price: 45.00,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: 2, brand: "ARCHITECTURAL PRECISION", name: "Structure Tactical Layer", price: 485.00,
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600",
        outOfStock: true,
      },
    ];
  });

  const [orders] = useState<Order[]>([
    {
      id: "DD-90210",
      date: "05 June 2026",
      total: 185.00,
      status: "Shipped",
      items: [{
        name: "Vanguard Tactical Vest",
        brand: "CONCRETE CULTURE",
        size: "Medium",
        color: "Stealth Black",
        price: 185.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-x=0.3&fp-y=0.65&z=2.0",
      }],
    },
    {
      id: "DD-87321",
      date: "12 May 2026",
      total: 600.00,
      status: "Delivered",
      items: [{
        name: "Heavyweight Hoodie",
        brand: "CONCRETE CULTURE",
        size: "Small",
        color: "Sandstone",
        price: 300.00,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600",
      }],
    },
  ]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const removeWishlistItem = (id: number) => {
    setWishlistItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem("wishlist", JSON.stringify(updated));
        window.dispatchEvent(new Event("wishlist-updated"));
      } catch { /* noop */ }
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
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: item.id,
          cartItemId,
          brand: item.brand,
          name: item.name,
          size: "S",
          color: "Default",
          price: item.price,
          quantity: 1,
          image: item.image,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
    } catch { /* noop */ }
  };

  // ─── Address handlers ──────────────────────────────────────────────────
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      type: "HOME", otherName: "", firstName: profile.firstName, lastName: profile.lastName,
      buildingNo: "", buildingName: "", street: "", area: "", city: "", state: "", postalCode: "", phone: profile.phone, isDefault: addresses.length === 0,
    });
    setIsAddressFormOpen(true);
  };

  const handleOpenEditAddress = (addr: AddressItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    const isStandardType = addr.type === "HOME" || addr.type === "OFFICE";
    setAddressForm({
      type: isStandardType ? addr.type : "OTHER",
      otherName: isStandardType ? "" : addr.type,
      firstName: addr.firstName,
      lastName: addr.lastName,
      buildingNo: addr.buildingNo,
      buildingName: addr.buildingName,
      street: addr.street,
      area: addr.area,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      phone: addr.phone,
      isDefault: addr.isDefault,
    });
    setIsAddressFormOpen(true);
  };

  const handleDeleteAddress = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = addressForm.type === "OTHER"
      ? (addressForm.otherName.trim() || "OTHER").toUpperCase()
      : addressForm.type;

    if (editingAddressId !== null) {
      setAddresses(prev => prev.map(addr =>
        addr.id === editingAddressId
          ? { ...addr, type: finalType, firstName: addressForm.firstName, lastName: addressForm.lastName,
              buildingNo: addressForm.buildingNo, buildingName: addressForm.buildingName, street: addressForm.street,
              area: addressForm.area, city: addressForm.city, state: addressForm.state,
              postalCode: addressForm.postalCode, phone: addressForm.phone, isDefault: addressForm.isDefault ? true : addr.isDefault }
          : addressForm.isDefault ? { ...addr, isDefault: false } : addr
      ));
    } else {
      const newAddr: AddressItem = {
        id: Date.now(), type: finalType,
        firstName: addressForm.firstName, lastName: addressForm.lastName,
        buildingNo: addressForm.buildingNo, buildingName: addressForm.buildingName,
        street: addressForm.street, area: addressForm.area,
        city: addressForm.city, state: addressForm.state,
        postalCode: addressForm.postalCode, phone: addressForm.phone,
        isDefault: addressForm.isDefault || addresses.length === 0,
      };
      setAddresses(prev => addressForm.isDefault
        ? prev.map(a => ({ ...a, isDefault: false })).concat(newAddr)
        : [...prev, newAddr]
      );
    }
    setIsAddressFormOpen(false);
    setEditingAddressId(null);
  };

  const handlePrintInvoice = (order: Order) => {
    const html = generateInvoiceHTML(order, profile);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const getTimelineSteps = (status: string, datePlaced: string) => {
    const isDelivered = status === "Delivered";
    const isShipped = status === "Shipped" || isDelivered;
    return [
      { title: "Order Placed", description: "Your order has been received", date: datePlaced, time: "10:30 AM", done: true },
      { title: "Processing", description: "Item picked and packed", date: datePlaced, time: "02:15 PM", done: true },
      { title: "Shipped", description: "In transit with carrier", date: isShipped ? "06 June 2026" : "Pending", time: isShipped ? "09:00 AM" : "", done: isShipped },
      { title: "Out for Delivery", description: "Delivery driver is en route", date: isDelivered ? "08 June 2026" : "Pending", time: isDelivered ? "11:45 AM" : "", done: isDelivered },
      { title: "Delivered", description: "Package dropped off safely", date: isDelivered ? "08 June 2026" : "Pending", time: isDelivered ? "03:00 PM" : "", done: isDelivered },
    ];
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* ─── Left Panel — Dashboard Nav ─────────────────────────────── */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2">
            <div className="bg-white border border-neutral-200/80 p-6 text-center md:text-left mb-6">
              <div className="w-16 h-16 bg-[#FAF8F5] border border-neutral-200 flex items-center justify-center mx-auto md:mx-0 mb-4">
                <User className="h-8 w-8 stroke-[1.2] text-neutral-600" />
              </div>
              <h2 className="text-sm font-extrabold tracking-[0.05em] uppercase text-[#030213]">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-[10px] text-neutral-400 font-medium mt-1.5 lowercase">{profile.email}</p>
            </div>

            <nav className="space-y-0.5">
              {([
                { key: "profile", icon: User, label: "User Profile" },
                { key: "orders", icon: Package, label: "Order History" },
                { key: "addresses", icon: MapPin, label: "Addresses" },
                { key: "wishlist", icon: Heart, label: "Wishlist" },
              ] as const).map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-extrabold tracking-[0.15em] uppercase transition-all duration-200 border cursor-pointer ${
                    activeTab === key
                      ? "bg-[#030213] text-white border-[#030213]"
                      : "bg-transparent text-neutral-600 border-transparent hover:bg-white hover:border-neutral-200"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 stroke-[1.8] ${activeTab === key ? "text-white" : "text-neutral-400"}`} />
                  {label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-extrabold tracking-[0.15em] uppercase border border-transparent text-red-500 hover:bg-red-50/50 hover:border-red-200/30 transition-all duration-200 cursor-pointer bg-transparent mt-4"
              >
                <LogOut className="h-3.5 w-3.5 stroke-[1.8]" />
                Log Out
              </button>
            </nav>
          </div>

          {/* ─── Right Panel — Tab Contents ─────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* ═══════════════════════════════════════════════════════════════
                TAB — PROFILE
                ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "profile" && (
              <div className="bg-white border border-neutral-200/80 p-8">
                <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 mb-8">
                  <User className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
                  <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase">User Profile</h1>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
                  {/* Name Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-3.5 py-2.5 text-xs font-bold tracking-wide focus:outline-none focus:border-[#030213] transition-colors uppercase placeholder-neutral-300"
                        placeholder="FIRST NAME"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-3.5 py-2.5 text-xs font-bold tracking-wide focus:outline-none focus:border-[#030213] transition-colors uppercase placeholder-neutral-300"
                        placeholder="LAST NAME"
                      />
                    </div>
                  </div>

                  {/* Email — Read-only, verified */}
                  <div>
                    <label className="block text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 bg-green-50/50 border border-green-200/60 px-3.5 py-2.5">
                      <Mail className="h-4 w-4 text-green-600 stroke-[1.5] flex-shrink-0" />
                      <span className="flex-1 text-xs font-bold tracking-wide text-neutral-700 lowercase">
                        {profile.email}
                      </span>
                      <span className="flex items-center gap-1 text-[8px] font-extrabold tracking-widest text-green-600 uppercase">
                        <BadgeCheck className="h-3.5 w-3.5 stroke-[1.5]" />
                        Verified
                      </span>
                    </div>
                    <p className="text-[7px] text-neutral-400 font-medium mt-1 tracking-wide">
                      Email is verified and cannot be changed. Contact support for email changes.
                    </p>
                  </div>

                  {/* Phone — Editable with verify button */}
                  <div>
                    <label className="block text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-3 bg-[#FAF8F5]/50 border border-neutral-200 px-3.5 py-2.5">
                      <Phone className="h-4 w-4 text-neutral-400 stroke-[1.5] flex-shrink-0" />
                      <input
                        type="tel"
                        required
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="flex-1 bg-transparent border-none p-0 text-xs font-bold tracking-wide focus:outline-none text-neutral-700 placeholder-neutral-300"
                        placeholder="PHONE NUMBER"
                      />
                      <div className="flex-shrink-0">
                        {phoneVerified ? (
                          <span className="flex items-center gap-1 text-[8px] font-extrabold tracking-widest text-green-600 uppercase">
                            <BadgeCheck className="h-3.5 w-3.5 stroke-[1.5]" />
                            Verified
                          </span>
                        ) : (
                          <PhoneVerification
                            phone={profile.phone}
                            onVerified={() => setPhoneVerified(true)}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <button
                      type="submit"
                      className="bg-[#030213] hover:bg-neutral-800 text-white px-8 py-3 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-200 border-none cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                TAB — ORDER HISTORY
                ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "orders" && (
              <div className="space-y-6">
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
                              <span className="text-[#030213] font-extrabold">₹{order.total.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            {order.status === "Delivered" ? (
                              <span className="flex items-center gap-1 px-2.5 py-1 text-[8px] font-extrabold tracking-widest uppercase bg-green-50 text-green-700 border border-green-200/60">
                                <CheckCircle className="h-3 w-3 stroke-[1.5]" />
                                Delivered
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2.5 py-1 text-[8px] font-extrabold tracking-widest uppercase bg-blue-50 text-blue-700 border border-blue-200/60">
                                <Truck className="h-3 w-3 stroke-[1.5]" />
                                {order.status}
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
                              <span className="text-[12px] font-extrabold text-[#030213] flex-shrink-0">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Actions Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-neutral-50/30 border-t border-neutral-200/80">
                          <button
                            onClick={() => setTrackingOrder(order)}
                            className="flex items-center gap-1.5 bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-4 py-2 text-[9px] font-extrabold tracking-widest uppercase transition-all cursor-pointer"
                          >
                            <Eye className="h-3 w-3 stroke-[1.5]" />
                            Track Order
                          </button>
                          <div className="flex items-center gap-2">
                            {order.status !== "Delivered" ? (
                              <button
                                onClick={() => alert(`Order ${order.id} cancellation submitted.`)}
                                className="bg-white border border-red-200 hover:bg-red-50 text-red-500 px-4 py-2 text-[8px] font-extrabold tracking-widest uppercase transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                            ) : (
                              <button
                                onClick={() => alert(`Return initiated for order ${order.id}.`)}
                                className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 px-4 py-2 text-[8px] font-extrabold tracking-widest uppercase transition-all cursor-pointer"
                              >
                                Return
                              </button>
                            )}
                            <button
                              onClick={() => handlePrintInvoice(order)}
                              className="flex items-center gap-1.5 bg-[#030213] hover:bg-neutral-800 text-white px-4 py-2 text-[8px] font-extrabold tracking-widest uppercase transition-all cursor-pointer border-none"
                            >
                              <Printer className="h-3 w-3 stroke-[1.5]" />
                              Invoice
                            </button>
                          </div>
                        </div>

                        {/* Expanded Tracking */}
                        {expandedOrderId === order.id && (
                          <div className="border-t border-neutral-200/80 p-6 bg-neutral-50/30 space-y-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-[10px] font-extrabold tracking-wider uppercase text-[#030213]">Estimated Delivery</h4>
                                <p className="text-[9px] text-neutral-500 font-medium mt-0.5">10 June 2026 • BlueDart Express</p>
                              </div>
                              <span className="text-[8px] font-extrabold tracking-widest text-neutral-500 uppercase border border-neutral-200 px-2.5 py-1">Standard</span>
                            </div>
                            <div className="flex items-center w-full pt-2">
                              {[
                                { label: "Confirmed", done: true },
                                { label: "Shipped", done: order.status === "Shipped" || order.status === "Delivered" },
                                { label: "Out for Delivery", done: order.status === "Delivered" },
                                { label: "Delivered", done: order.status === "Delivered" },
                              ].map((step, idx, arr) => (
                                <div key={step.label} className="flex items-center flex-1 last:flex-none">
                                  <div className="flex flex-col items-center">
                                    <div className={`w-6 h-6 flex items-center justify-center text-[8px] font-black border-2 ${
                                      step.done
                                        ? "bg-green-50 border-green-600 text-green-700"
                                        : "bg-white border-neutral-300 text-neutral-400"
                                    }`}>
                                      {step.done ? "✓" : idx + 1}
                                    </div>
                                    <span className="text-[7px] font-extrabold tracking-wider uppercase text-center mt-1.5 whitespace-nowrap text-neutral-500">
                                      {step.label}
                                    </span>
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-1 mt-[-1.5rem] ${step.done ? "bg-green-600" : "bg-neutral-200"}`} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                TAB — ADDRESSES
                ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "addresses" && (
              <div className="bg-white border border-neutral-200/80 p-8">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-8">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
                    <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase">Addresses</h1>
                  </div>
                  {!isAddressFormOpen && (
                    <button
                      onClick={handleOpenAddAddress}
                      className="flex items-center gap-1.5 bg-[#030213] hover:bg-neutral-800 text-white px-4 py-2.5 text-[9px] font-extrabold tracking-widest uppercase transition-all border-none cursor-pointer"
                    >
                      <Plus className="h-3 w-3 stroke-[1.5]" />
                      Add New
                    </button>
                  )}
                </div>

                {isAddressFormOpen ? (
                  <form onSubmit={handleSaveAddress} className="bg-white border border-neutral-200 p-6 space-y-5 mb-8">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black tracking-[0.2em] text-[#030213] uppercase">
                        {editingAddressId ? "Edit Address" : "New Address"}
                      </h4>
                      <span className="text-[8px] text-neutral-400 font-medium">Fulfilment details</span>
                    </div>

                    <div>
                      <label className="block text-[7px] font-black tracking-[0.2em] mb-2 text-neutral-400 uppercase">Location Type</label>
                      <div className="flex gap-2">
                        {["HOME", "OFFICE", "OTHER"].map((t) => (
                          <button key={t} type="button"
                            onClick={() => setAddressForm({ ...addressForm, type: t })}
                            className={`flex-1 py-2.5 text-[9px] font-extrabold tracking-[0.2em] uppercase border transition-colors ${
                              addressForm.type === t
                                ? "bg-[#030213] text-white border-[#030213]"
                                : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
                            }`}
                          >{t}</button>
                        ))}
                      </div>
                    </div>

                    {addressForm.type === "OTHER" && (
                      <div>
                        <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Location Name</label>
                        <input type="text" required placeholder="e.g. Studio, Warehouse" value={addressForm.otherName}
                          onChange={(e) => setAddressForm({ ...addressForm, otherName: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">First Name</label>
                        <input type="text" required placeholder="First Name" value={addressForm.firstName}
                          onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                      <div>
                        <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Last Name</label>
                        <input type="text" required placeholder="Last Name" value={addressForm.lastName}
                          onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Building No.</label>
                        <input type="text" required placeholder="Building No." value={addressForm.buildingNo}
                          onChange={(e) => setAddressForm({ ...addressForm, buildingNo: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                      <div>
                        <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Building Name</label>
                        <input type="text" required placeholder="Building Name" value={addressForm.buildingName}
                          onChange={(e) => setAddressForm({ ...addressForm, buildingName: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Street / Locality</label>
                      <input type="text" required placeholder="Street name &amp; locality" value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
                    </div>

                    <div>
                      <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Area / Locality</label>
                      <input type="text" required placeholder="Area" value={addressForm.area}
                        onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                        className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">City</label>
                        <input type="text" required placeholder="City" value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                      <div>
                        <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">State</label>
                        <input type="text" required placeholder="State" value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                      <div>
                        <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Pincode</label>
                        <input type="text" required placeholder="Pincode" value={addressForm.postalCode}
                          onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Phone Number</label>
                      <input type="tel" required placeholder="Phone number" value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase" />
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="makeDefaultProfile" checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="accent-[#030213]" />
                      <label htmlFor="makeDefaultProfile" className="text-[8px] font-extrabold text-neutral-500 uppercase cursor-pointer tracking-wider">
                        Make this my default shipping address
                      </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="submit"
                        className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-6 py-2.5 uppercase transition-colors">
                        {editingAddressId ? "Save Changes" : "Add Address"}
                      </button>
                      <button type="button" onClick={() => { setIsAddressFormOpen(false); setEditingAddressId(null); }}
                        className="bg-transparent text-neutral-500 hover:text-[#030213] text-[9px] font-extrabold tracking-widest px-6 py-2.5 uppercase border border-neutral-200 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {addresses.map((addr) => {
                      const typeIcon = addr.type === "HOME"
                        ? "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        : addr.type === "OFFICE"
                        ? "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        : "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z";
                      return (
                        <div key={addr.id}
                          className="border border-neutral-200 p-6 hover:border-[#030213]/40 transition-all duration-200 group relative"
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <svg className="h-3.5 w-3.5 text-[#b2533e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d={typeIcon} />
                            </svg>
                            <span className="text-[8px] font-black tracking-[0.2em] text-[#b2533e] uppercase">{addr.type}</span>
                            {addr.isDefault && (
                              <span className="flex items-center gap-0.5 text-[7px] font-black tracking-widest uppercase text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 ml-1">
                                <BadgeCheck className="h-2.5 w-2.5 stroke-[1.5]" />
                                Default
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] leading-relaxed text-neutral-600 font-bold uppercase tracking-wider">
                            <p className="font-extrabold text-[#030213] text-[13px] mb-1.5">{addr.firstName} {addr.lastName}</p>
                            <p>{addr.buildingNo && `${addr.buildingNo}, `}{addr.buildingName && `${addr.buildingName}, `}{addr.street}</p>
                            <p>{addr.area && `${addr.area}, `}{addr.city}, {addr.state} — {addr.postalCode}</p>
                            <p className="text-[8px] font-extrabold text-[#b2533e] mt-2 tracking-widest">PH: {addr.phone}</p>
                          </div>

                          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-neutral-100">
                            <button onClick={(e) => handleOpenEditAddress(addr, e)}
                              className="flex items-center gap-1 text-[8px] font-extrabold tracking-widest uppercase text-neutral-500 hover:text-[#030213] transition-colors bg-transparent border-none cursor-pointer">
                              <Edit2 className="h-3 w-3 stroke-[1.5]" /> Edit
                            </button>
                            <span className="text-neutral-200">|</span>
                            <button onClick={(e) => handleDeleteAddress(addr.id, e)}
                              className="flex items-center gap-1 text-[8px] font-extrabold tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer">
                              <Trash2 className="h-3 w-3 stroke-[1.5]" /> Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                TAB — WISHLIST
                ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "wishlist" && (
              <div className="bg-white border border-neutral-200/80 p-8">
                <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 mb-8">
                  <Heart className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
                  <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase">Wishlist</h1>
                  {wishlistItems.length > 0 && (
                    <span className="text-[8px] font-extrabold tracking-widest text-neutral-400 uppercase ml-auto">
                      {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
                    </span>
                  )}
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="py-16 text-center">
                    <Heart className="h-12 w-12 mx-auto text-neutral-300 stroke-[1.2] mb-4" />
                    <h2 className="text-sm font-extrabold tracking-[0.15em] uppercase mb-2">Your Wishlist is Empty</h2>
                    <p className="text-[11px] text-neutral-500 font-medium mb-6">Save your favorite items for later.</p>
                    <Link
                      to="/shop"
                      className="inline-block bg-[#030213] hover:bg-neutral-800 text-white px-8 py-3 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-colors"
                    >
                      Browse Shop
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {wishlistItems.map((item) => {
                      const isOutOfStock = item.outOfStock;
                      return (
                        <Link
                          key={item.id}
                          to={`/product/${item.id}`}
                          className="flex gap-4 border border-neutral-200 p-4 hover:border-[#030213]/40 transition-all duration-200 group relative cursor-pointer no-underline"
                        >
                          {/* Image */}
                          <div className="w-20 h-24 bg-neutral-100 border border-neutral-200/60 overflow-hidden flex-shrink-0 relative">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            {isOutOfStock && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-[7px] font-extrabold tracking-[0.15em] uppercase -rotate-12 border border-white/60 px-2 py-1">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                            <div>
                              <span className="text-[8px] font-extrabold tracking-widest text-[#b2533e] uppercase block">
                                {item.brand}
                              </span>
                              <h4 className="text-[12px] font-extrabold text-[#030213] uppercase mt-1 leading-tight truncate group-hover:underline">
                                {item.name}
                              </h4>
                              <p className="text-[12px] font-extrabold text-neutral-900 mt-1.5">
                                ₹{item.price.toFixed(2)}
                              </p>
                            </div>
                            {isOutOfStock ? (
                              <span className="inline-block text-[8px] font-extrabold tracking-widest text-red-500 uppercase">
                                Currently Unavailable
                              </span>
                            ) : (
                              <button
                                onClick={(e) => addWishlistToCart(item, e)}
                                className="bg-[#030213] hover:bg-neutral-800 text-white py-2 px-4 text-[8px] font-extrabold tracking-widest uppercase transition-all max-w-max border-none cursor-pointer"
                              >
                                Add to Bag
                              </button>
                            )}
                          </div>

                          {/* Remove */}
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeWishlistItem(item.id); }}
                            className="absolute top-3 right-3 text-neutral-300 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                            aria-label="Remove from wishlist"
                          >
                            <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                          </button>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Tracking Modal ──────────────────────────────────────────────── */}
      {trackingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#FAF8F5] border border-neutral-200/80 max-w-md w-full p-8 relative shadow-2xl">
            <button
              onClick={() => setTrackingOrder(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-[#030213] transition-colors bg-transparent border-none cursor-pointer"
            >
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
                      <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${step.done ? "text-[#030213]" : "text-neutral-400"}`}>
                        {step.title}
                      </h4>
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
