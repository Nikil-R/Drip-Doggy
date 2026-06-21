import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Home,
  Briefcase,
  MapPin,
  Trash2,
  Edit2,
  Plus,
  Check,
  Mail,
  Phone,
  Truck,
  Zap,
  ChevronRight,
  Clock,
  CreditCard,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";

interface CartItem {
  id: number;
  brand: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

interface Address {
  id: number;
  type: string;
  isDefault: boolean;
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
}

// ─── Stage label config ─────────────────────────────────────────────────────
const STAGES = [
  { num: "01", label: "Information", desc: "Contact & destination" },
  { num: "02", label: "Delivery", desc: "Shipping method" },
  { num: "03", label: "Payment", desc: "Review & confirm" },
] as const;

type StageKey = 0 | 1 | 2;

// ─── Helpers ────────────────────────────────────────────────────────────────
function StageShell({
  stage,
  children,
}: {
  stage: StageKey;
  children: React.ReactNode;
}) {
  const s = STAGES[stage];
  return (
    <div className="relative pl-8">
      {/* Vertical accent rail */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-200" />
      <div className="absolute left-0 top-0 w-px h-12 bg-[#030213]" />

      {/* Stage header */}
      <div className="mb-8">
        <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase">
          STEP {s.num}
        </span>
        <h2 className="text-xl font-extrabold tracking-[0.03em] text-[#030213] uppercase mt-1">
          {s.label}
        </h2>
        <p className="text-[10px] text-neutral-500 font-medium tracking-wide mt-1">
          {s.desc}
        </p>
      </div>

      {children}
    </div>
  );
}

function RecapRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-0.5">
          {label}
        </span>
        <span className="text-[11px] font-bold text-[#030213] leading-snug block truncate">
          {value}
        </span>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex-shrink-0 text-[8px] font-extrabold tracking-widest text-neutral-400 hover:text-[#030213] uppercase underline underline-offset-2 bg-transparent border-none cursor-pointer transition-colors"
        >
          Edit
        </button>
      )}
    </div>
  );
}

function MethodCard({
  title,
  subtitle,
  price,
  badge,
  isSelected,
  onSelect,
  children,
}: {
  title: string;
  subtitle: string;
  price: string;
  badge?: string;
  isSelected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative p-5 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-2 border-[#030213] bg-[#FAF8F5]/40 shadow-sm"
          : "border border-neutral-200 bg-white hover:border-neutral-400"
      }`}
    >
      {badge && (
        <span
          className={`absolute -top-2.5 right-4 text-[7px] font-black tracking-[0.2em] uppercase px-2.5 py-1 ${
            isSelected
              ? "bg-[#030213] text-white"
              : "bg-neutral-200 text-neutral-500"
          }`}
        >
          {badge}
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 w-4 h-4 flex items-center justify-center border-2 ${
              isSelected
                ? "border-[#030213] bg-[#030213]"
                : "border-neutral-300"
            }`}
          >
            {isSelected && <Check className="h-2.5 w-2.5 text-white stroke-[3]" />}
          </div>
          <div>
            <h4 className="text-[13px] font-extrabold tracking-[0.05em] text-[#030213] uppercase">
              {title}
            </h4>
            <p className="text-[10px] text-neutral-500 font-medium tracking-wide mt-0.5">
              {subtitle}
            </p>
            {children && <div className="mt-2">{children}</div>}
          </div>
        </div>
        <span className="text-xs font-extrabold text-[#030213] flex-shrink-0">
          {price}
        </span>
      </div>
    </div>
  );
}

export function Checkout() {
  const { user } = useAuth();

  const [cartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );

  // Contact Info — prefill from authenticated user
  const [email, setEmail] = useState(() => user?.email ?? "");
  const [phone, setPhone] = useState(() => user?.phone ?? "");

  // Auto-fill from auth user if fields are still empty after mount
  useEffect(() => {
    if (user) {
      setEmail((prev) => (prev ? prev : user.email));
      setPhone((prev) => (prev ? prev : user.phone));
    }
  }, [user]);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const stored = localStorage.getItem("addresses");
      if (stored) {
        const list = JSON.parse(stored);
        const cleaned = list.filter(
          (a: any) => a.name !== "Jeshwanth" && a.firstName !== "Jeshwanth"
        );
        return cleaned;
      }
    } catch {}
    return [];
  });

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    () => {
      const defaultAddr = addresses.find((a) => a.isDefault);
      return defaultAddr ? defaultAddr.id : addresses[0]?.id || null;
    }
  );

  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const defaultAddr = addresses.find((a) => a.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : addresses[0].id);
    } else if (addresses.length === 0) {
      setSelectedAddressId(null);
    }
  }, [addresses, selectedAddressId]);

  // Address form state
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const [saveNextTime, setSaveNextTime] = useState(true);
  const [isOrdered, setIsOrdered] = useState(false);

  // Pricing
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 1999 || subtotal === 0 ? 0 : 90;
  const shippingCost = shippingMethod === "express" ? 150.0 : deliveryFee;
  const total = subtotal + shippingCost;
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  const activeAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  const handleOpenAddForm = () => {
    setEditingAddressId(null);
    setAddressForm({
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
      isDefault: addresses.length === 0,
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    const isStandardType = addr.type === "HOME" || addr.type === "OFFICE";
    setAddressForm({
      type: isStandardType ? addr.type : "OTHER",
      otherName: isStandardType ? "" : addr.type,
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      buildingNo: addr.buildingNo || "",
      buildingName: addr.buildingName || "",
      street: addr.street,
      area: addr.area,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      phone: addr.phone,
      isDefault: addr.isDefault,
    });
    setIsFormOpen(true);
  };

  const handleDeleteAddress = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    if (selectedAddressId === id) {
      setSelectedAddressId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const finalType =
      addressForm.type === "OTHER"
        ? (addressForm.otherName.trim() || "OTHER").toUpperCase()
        : addressForm.type;

    if (editingAddressId !== null) {
      const updated = addresses.map((addr) => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            type: finalType,
            firstName: addressForm.firstName,
            lastName: addressForm.lastName,
            buildingNo: addressForm.buildingNo,
            buildingName: addressForm.buildingName,
            street: addressForm.street,
            area: addressForm.area,
            city: addressForm.city,
            state: addressForm.state,
            postalCode: addressForm.postalCode,
            phone: addressForm.phone,
            isDefault: addressForm.isDefault ? true : addr.isDefault,
          };
        }
        return addressForm.isDefault ? { ...addr, isDefault: false } : addr;
      });
      setAddresses(updated);
      setIsFormOpen(false);
      setEditingAddressId(null);
    } else {
      const newId = Date.now();
      const newAddress: Address = {
        id: newId,
        type: finalType,
        isDefault: addressForm.isDefault || addresses.length === 0,
        firstName: addressForm.firstName,
        lastName: addressForm.lastName,
        buildingNo: addressForm.buildingNo,
        buildingName: addressForm.buildingName,
        street: addressForm.street,
        area: addressForm.area,
        city: addressForm.city,
        state: addressForm.state,
        postalCode: addressForm.postalCode,
        phone: addressForm.phone,
      };

      const updated = addressForm.isDefault
        ? addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
        : [...addresses, newAddress];

      setAddresses(updated);
      setSelectedAddressId(newId);
      setIsFormOpen(false);
    }
  };

  const handleContinueToDelivery = () => {
    if (!activeAddress) {
      alert("Please add and select a shipping address.");
      return;
    }
    if (!email.trim() || !phone.trim()) {
      alert("Please fill in contact details (email and phone number).");
      return;
    }
    setStep(2);
  };

  const handleContinueToPayment = () => {
    setStep(3);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cart-updated"));
  };

  // ─── Success State ────────────────────────────────────────────────────────
  if (isOrdered) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased py-20">
        <div className="max-w-md mx-auto px-6 text-center flex flex-col justify-center items-center">
          <div className="w-16 h-16 bg-green-50 border border-green-200 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600 stroke-[1.2]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-[0.05em] mb-4 uppercase">
            Order Placed Successfully
          </h1>
          <p className="text-neutral-500 text-xs leading-relaxed mb-8 uppercase tracking-wider font-bold">
            Your Cash on Delivery order is confirmed! A notification will be sent
            to{" "}
            <span className="font-semibold text-neutral-900">{phone}</span>{" "}
            shortly.
          </p>
          <Link
            to="/"
            className="block w-full bg-black text-white py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors uppercase"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ─── Main Checkout ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* ─── Editorial Progress Band ─────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-0 mb-12 border border-neutral-200/80 bg-white">
          {([1, 2, 3] as const).map((s, idx) => {
            const stage = STAGES[idx];
            const isActive = step === s;
            const isCompleted = step > s;
            return (
              <button
                key={s}
                disabled={!isCompleted && !isActive}
                onClick={() => {
                  if (isCompleted) setStep(s);
                }}
                className={`relative flex flex-col items-start p-4 text-left transition-all duration-200 bg-transparent border-none cursor-pointer ${
                  isCompleted ? "hover:bg-neutral-50" : ""
                } ${isActive ? "" : ""} ${
                  !isCompleted && !isActive ? "opacity-50 cursor-default" : ""
                } ${idx < 2 ? "border-r border-neutral-200/80" : ""}`}
              >
                {/* Top indicator */}
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-[9px] font-black transition-all ${
                      isActive
                        ? "bg-[#030213] text-white"
                        : isCompleted
                        ? "bg-[#b2533e] text-white"
                        : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    ) : (
                      stage.num
                    )}
                  </div>
                  <span
                    className={`text-[8px] font-black tracking-[0.25em] uppercase ${
                      isActive || isCompleted
                        ? "text-[#030213]"
                        : "text-neutral-400"
                    }`}
                  >
                    STEP {stage.num}
                  </span>
                </div>

                {/* Title + desc */}
                <span
                  className={`text-[11px] font-extrabold tracking-[0.05em] uppercase ${
                    isActive ? "text-[#030213]" : "text-neutral-600"
                  }`}
                >
                  {stage.label}
                </span>
                <span className="text-[8px] text-neutral-400 font-medium tracking-wide mt-0.5">
                  {stage.desc}
                </span>

                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#030213]" />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── Main Grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* ─── Left Column — Steps ──────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-8">
            {/* ═══════════════════════════════════════════════════════════════
                STEP 1 — INFORMATION
                ═══════════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <StageShell stage={0}>
                <div className="space-y-10">
                  {/* ─ A. Account Contact ──────────────────────────────── */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5]" />
                      <span className="text-[9px] font-black tracking-[0.25em] text-neutral-500 uppercase">
                        Account Contact
                      </span>
                      {user && (
                        <span className="text-[7px] font-black tracking-[0.2em] text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 uppercase ml-auto">
                          Verified Profile
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-neutral-200 bg-white p-4">
                        <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-1">
                          {user ? "Registered Email" : "Email Address"}
                        </span>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5] flex-shrink-0" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="w-full bg-transparent border-none p-0 text-xs font-bold tracking-wide text-[#030213] focus:outline-none placeholder-neutral-300 uppercase"
                          />
                        </div>
                        {user && (
                          <span className="text-[7px] text-neutral-400 font-medium mt-1.5 block">
                            Auto-filled from your account
                          </span>
                        )}
                      </div>

                      <div className="border border-neutral-200 bg-white p-4">
                        <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-1">
                          {user ? "Registered Mobile" : "Phone Number"}
                        </span>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5] flex-shrink-0" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone number"
                            className="w-full bg-transparent border-none p-0 text-xs font-bold tracking-wide text-[#030213] focus:outline-none placeholder-neutral-300"
                          />
                        </div>
                        {user && (
                          <span className="text-[7px] text-neutral-400 font-medium mt-1.5 block">
                            For delivery updates
                          </span>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* ─ B. Delivery Destination ──────────────────────────── */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5]" />
                      <span className="text-[9px] font-black tracking-[0.25em] text-neutral-500 uppercase">
                        Delivery Destination
                      </span>
                      <span className="text-[8px] text-neutral-400 font-medium ml-auto">
                        {addresses.length} saved
                      </span>
                    </div>

                    {isFormOpen ? (
                      /* Address form */
                      <form
                        onSubmit={handleSaveAddress}
                        className="bg-white border border-neutral-200 p-6 space-y-5"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black tracking-[0.2em] text-[#030213] uppercase">
                            {editingAddressId
                              ? "Edit Destination"
                              : "New Destination"}
                          </h4>
                          <span className="text-[8px] text-neutral-400 font-medium">
                            Fulfilment details
                          </span>
                        </div>

                        {/* Location Type */}
                        <div>
                          <label className="block text-[7px] font-black tracking-[0.2em] mb-2 text-neutral-400 uppercase">
                            Location Type
                          </label>
                          <div className="flex gap-2">
                            {["HOME", "OFFICE", "OTHER"].map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() =>
                                  setAddressForm({ ...addressForm, type: t })
                                }
                                className={`flex-1 py-2.5 text-[9px] font-extrabold tracking-[0.2em] uppercase border transition-colors ${
                                  addressForm.type === t
                                    ? "bg-[#030213] text-white border-[#030213]"
                                    : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {addressForm.type === "OTHER" && (
                          <div>
                            <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">
                              Location Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Studio, Warehouse"
                              value={addressForm.otherName}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  otherName: e.target.value,
                                })
                              }
                              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase"
                            />
                          </div>
                        )}

                        {/* Name */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">
                              First Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="First Name"
                              value={addressForm.firstName}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  firstName: e.target.value,
                                })
                              }
                              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase"
                            />
                          </div>
                          <div>
                            <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">
                              Last Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Last Name"
                              value={addressForm.lastName}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  lastName: e.target.value,
                                })
                              }
                              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase"
                            />
                          </div>
                        </div>

                        {/* Building */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">
                              Building No.
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Building No."
                              value={addressForm.buildingNo}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  buildingNo: e.target.value,
                                })
                              }
                              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase"
                            />
                          </div>
                          <div>
                            <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">
                              Building Name
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Building Name"
                              value={addressForm.buildingName}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  buildingName: e.target.value,
                                })
                              }
                              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">
                            Street / Locality
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Street name &amp; locality"
                            value={addressForm.street}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                street: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase"
                          />
                        </div>

                        {/* City, State, Pincode */}
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">
                              City
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="City"
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  city: e.target.value,
                                })
                              }
                              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase"
                            />
                          </div>
                          <div>
                            <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">
                              State
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="State"
                              value={addressForm.state}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  state: e.target.value,
                                })
                              }
                              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase"
                            />
                          </div>
                          <div>
                            <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">
                              Pincode
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Pincode"
                              value={addressForm.postalCode}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  postalCode: e.target.value,
                                })
                              }
                              className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[7px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">
                            Delivery Phone
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="Phone number for this address"
                            value={addressForm.phone}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                phone: e.target.value,
                              })
                            }
                            className="w-full bg-white border border-neutral-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="makeDefault"
                            checked={addressForm.isDefault}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                isDefault: e.target.checked,
                              })
                            }
                            className="accent-[#030213]"
                          />
                          <label
                            htmlFor="makeDefault"
                            className="text-[8px] font-extrabold text-neutral-500 uppercase cursor-pointer tracking-wider"
                          >
                            Make this my default shipping address
                          </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="submit"
                            className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-6 py-2.5 uppercase transition-colors"
                          >
                            {editingAddressId ? "Save Changes" : "Add Address"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="bg-transparent text-neutral-500 hover:text-[#030213] text-[9px] font-extrabold tracking-widest px-6 py-2.5 uppercase border border-neutral-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* Address grid */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <div
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`relative p-5 border cursor-pointer transition-all ${
                                isSelected
                                  ? "border-2 border-[#030213] bg-[#FAF8F5]/30 shadow-sm"
                                  : "border border-neutral-200 bg-white hover:border-neutral-400"
                              }`}
                            >
                              {/* Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-1.5">
                                  {addr.type === "HOME" ? (
                                    <Home className="h-3 w-3 text-neutral-500 stroke-[1.5]" />
                                  ) : addr.type === "OFFICE" ? (
                                    <Briefcase className="h-3 w-3 text-neutral-500 stroke-[1.5]" />
                                  ) : (
                                    <MapPin className="h-3 w-3 text-neutral-500 stroke-[1.5]" />
                                  )}
                                  <span className="text-[8px] font-black tracking-widest text-[#b2533e] uppercase">
                                    {addr.type}
                                  </span>
                                  {addr.isDefault && (
                                    <span className="bg-[#030213] text-white text-[7px] font-black tracking-wider px-1.5 py-0.5 uppercase flex items-center gap-0.5">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) =>
                                      handleOpenEditForm(addr, e)
                                    }
                                    className="p-1 text-neutral-400 hover:text-[#030213] transition-colors bg-transparent border-none cursor-pointer"
                                  >
                                    <Edit2 className="h-3 w-3 stroke-[1.8]" />
                                  </button>
                                  <button
                                    onClick={(e) =>
                                      handleDeleteAddress(addr.id, e)
                                    }
                                    className="p-1 text-neutral-400 hover:text-[#b2533e] transition-colors bg-transparent border-none cursor-pointer"
                                  >
                                    <Trash2 className="h-3 w-3 stroke-[1.8]" />
                                  </button>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="text-[10px] leading-relaxed text-neutral-600 font-bold uppercase tracking-wider">
                                <p className="font-extrabold text-[#030213] text-xs mb-1">
                                  {addr.firstName} {addr.lastName}
                                </p>
                                <p>
                                  {addr.buildingNo && `${addr.buildingNo}, `}
                                  {addr.buildingName && `${addr.buildingName}, `}
                                  {addr.street}
                                </p>
                                <p>{addr.area}</p>
                                <p>
                                  {addr.city}, {addr.state} — {addr.postalCode}
                                </p>
                                <p className="text-[8px] font-extrabold text-[#b2533e] mt-2 tracking-widest">
                                  PH: {addr.phone}
                                </p>
                              </div>

                              {/* Selection footer */}
                              <div className="mt-3 pt-3 border-t border-neutral-100">
                                {isSelected ? (
                                  <div className="flex items-center gap-2 text-[8px] font-extrabold tracking-widest text-[#030213] uppercase">
                                    <Check className="h-3 w-3 stroke-[2.5]" />
                                    <span>Selected for this order</span>
                                  </div>
                                ) : (
                                  <span className="text-[8px] font-extrabold tracking-widest text-neutral-400 uppercase">
                                    Select address
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Add new card */}
                        <div
                          onClick={handleOpenAddForm}
                          className="border border-dashed border-neutral-300 hover:border-[#030213] bg-white/40 hover:bg-white p-5 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[220px]"
                        >
                          <Plus className="h-6 w-6 text-neutral-300 mb-2 stroke-[1.5]" />
                          <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase">
                            Add New Destination
                          </span>
                          <span className="text-[8px] text-neutral-400 font-medium mt-1">
                            Home, studio, office or other
                          </span>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* ─ C. Footer actions ──────────────────────────────── */}
                  <div className="space-y-4 pt-2 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="saveNextTime"
                        checked={saveNextTime}
                        onChange={(e) => setSaveNextTime(e.target.checked)}
                        className="accent-[#030213]"
                      />
                      <label
                        htmlFor="saveNextTime"
                        className="text-[9px] font-bold text-neutral-500 uppercase cursor-pointer tracking-wider"
                      >
                        Save this information for next time
                      </label>
                    </div>

                    <button
                      onClick={handleContinueToDelivery}
                      className="w-full bg-[#030213] hover:bg-neutral-800 text-white py-4 text-xs font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 uppercase"
                    >
                      Continue to Delivery
                      <ChevronRight className="h-3.5 w-3.5 stroke-[2]" />
                    </button>
                  </div>
                </div>
              </StageShell>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                STEP 2 — DELIVERY
                ═══════════════════════════════════════════════════════════════ */}
            {step === 2 && activeAddress && (
              <StageShell stage={1}>
                <div className="space-y-10">
                  {/* ─ A. Recap Ledger ──────────────────────────────────── */}
                  <section>
                    <div className="border border-neutral-200 bg-white divide-y divide-neutral-100 px-4 py-1">
                      <RecapRow
                        label="Contact"
                        value={`${email} | ${phone}`}
                        onEdit={() => setStep(1)}
                      />
                      <RecapRow
                        label="Destination"
                        value={`${activeAddress.firstName} ${activeAddress.lastName}, ${
                          activeAddress.buildingNo
                            ? `${activeAddress.buildingNo}, `
                            : ""
                        }${
                          activeAddress.buildingName
                            ? `${activeAddress.buildingName}, `
                          : ""
                        }${activeAddress.street}, ${activeAddress.area}, ${
                          activeAddress.city
                        }, ${activeAddress.state} — ${
                          activeAddress.postalCode
                        }`}
                        onEdit={() => setStep(1)}
                      />
                    </div>
                  </section>

                  {/* ─ B. Delivery Method ───────────────────────────────── */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Truck className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5]" />
                      <span className="text-[9px] font-black tracking-[0.25em] text-neutral-500 uppercase">
                        Choose Delivery Method
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MethodCard
                        title="Standard Delivery"
                        subtitle="3 — 5 Working Days"
                        price={
                          deliveryFee === 0
                            ? "FREE"
                            : `₹${deliveryFee.toFixed(2)}`
                        }
                        badge="Recommended"
                        isSelected={shippingMethod === "standard"}
                        onSelect={() => setShippingMethod("standard")}
                      >
                        <div className="flex items-center gap-3 text-[8px] text-neutral-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 stroke-[1.5]" />
                            Tracked Dispatch
                          </span>
                          <span className="flex items-center gap-1">
                            <Check className="h-3 w-3 stroke-[1.5]" />
                            COD Eligible
                          </span>
                        </div>
                      </MethodCard>

                      <MethodCard
                        title="Express Shipping"
                        subtitle="Next Working Day"
                        price="₹150.00"
                        badge="Fastest"
                        isSelected={shippingMethod === "express"}
                        onSelect={() => setShippingMethod("express")}
                      >
                        <div className="flex items-center gap-3 text-[8px] text-neutral-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3 stroke-[1.5]" />
                            Priority Dispatch
                          </span>
                          <span className="flex items-center gap-1">
                            <Check className="h-3 w-3 stroke-[1.5]" />
                            COD Eligible
                          </span>
                        </div>
                      </MethodCard>
                    </div>
                  </section>

                  {/* ─ C. Actions ────────────────────────────────────── */}
                  <div className="flex flex-col md:flex-row gap-3 pt-2 border-t border-neutral-100">
                    <button
                      onClick={() => setStep(1)}
                      className="w-full md:w-1/3 border border-neutral-200 hover:bg-neutral-50 text-neutral-500 py-3.5 text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="h-3 w-3 stroke-[2]" />
                      Back to Info
                    </button>
                    <button
                      onClick={handleContinueToPayment}
                      className="w-full md:w-2/3 bg-[#030213] hover:bg-neutral-800 text-white py-3.5 text-xs font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 uppercase"
                    >
                      Continue to Payment
                      <ChevronRight className="h-3.5 w-3.5 stroke-[2]" />
                    </button>
                  </div>
                </div>
              </StageShell>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                STEP 3 — PAYMENT
                ═══════════════════════════════════════════════════════════════ */}
            {step === 3 && activeAddress && (
              <StageShell stage={2}>
                <div className="space-y-10">
                  {/* ─ A. Recap Ledger ──────────────────────────────────── */}
                  <section>
                    <div className="border border-neutral-200 bg-white divide-y divide-neutral-100 px-4 py-1">
                      <RecapRow
                        label="Contact"
                        value={`${email} | ${phone}`}
                        onEdit={() => setStep(1)}
                      />
                      <RecapRow
                        label="Ship To"
                        value={`${activeAddress.firstName} ${activeAddress.lastName}, ${
                          activeAddress.buildingNo
                            ? `${activeAddress.buildingNo}, `
                          : ""
                        }${
                          activeAddress.buildingName
                            ? `${activeAddress.buildingName}, `
                          : ""
                        }${activeAddress.street}, ${activeAddress.area}, ${
                          activeAddress.city
                        }, ${activeAddress.state} — ${
                          activeAddress.postalCode
                        }`}
                        onEdit={() => setStep(1)}
                      />
                      <RecapRow
                        label="Method"
                        value={
                          shippingMethod === "express"
                            ? "Express Shipping — ₹150.00"
                            : `Standard Delivery — ${
                                deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`
                              }`
                        }
                        onEdit={() => setStep(2)}
                      />
                    </div>
                  </section>

                  {/* ─ B. Payment Method ────────────────────────────────── */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-3.5 w-3.5 text-neutral-400 stroke-[1.5]" />
                      <span className="text-[9px] font-black tracking-[0.25em] text-neutral-500 uppercase">
                        Payment Selection
                      </span>
                    </div>

                    <div className="border border-neutral-200 bg-white p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#FAF8F5] border border-neutral-200 flex items-center justify-center flex-shrink-0">
                          <div className="h-2 w-2 bg-[#030213]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-extrabold tracking-[0.05em] text-[#030213] uppercase">
                              Cash on Delivery (COD)
                            </h4>
                            <span className="text-[7px] font-black tracking-[0.2em] text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 uppercase">
                              Available
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                            Pay with cash upon delivery. Please keep the exact
                            amount of{" "}
                            <span className="font-extrabold text-[#030213]">
                              ₹{total.toFixed(2)}
                            </span>{" "}
                            ready when your courier arrives.
                          </p>
                          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-4 text-[8px] text-neutral-400 font-medium">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3 stroke-[1.5]" />
                              Pay at doorstep
                            </span>
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3 stroke-[1.5]" />
                              No extra charges
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ─ C. Confirmation note ───────────────────────────── */}
                  <p className="text-[8px] text-neutral-400 font-medium tracking-wide leading-relaxed">
                    By placing this order, you confirm that your shipping and
                    payment details are accurate. Your order will be processed
                    upon confirmation.
                  </p>

                  {/* ─ D. Actions ────────────────────────────────────── */}
                  <form
                    onSubmit={handleSubmitOrder}
                    className="flex flex-col md:flex-row gap-3 pt-2 border-t border-neutral-100"
                  >
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full md:w-1/3 border border-neutral-200 hover:bg-neutral-50 text-neutral-500 py-3.5 text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="h-3 w-3 stroke-[2]" />
                      Back to Delivery
                    </button>
                    <button
                      type="submit"
                      className="w-full md:w-2/3 bg-[#030213] hover:bg-neutral-800 text-white py-3.5 text-xs font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 uppercase"
                    >
                      Confirm & Place Order
                      <span className="text-white/70 font-bold text-[10px]">
                        (₹{total.toFixed(2)})
                      </span>
                    </button>
                  </form>
                </div>
              </StageShell>
            )}
          </div>

          {/* ─── Right Column — Order Summary ───────────────────────────── */}
          <div className="lg:col-span-4 bg-white border border-neutral-200/80 p-6 space-y-6 sticky top-24">
            <h2 className="text-xs font-extrabold tracking-[0.2em] pb-3 border-b border-neutral-200/60 uppercase">
              Your Order
            </h2>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 divide-y divide-neutral-100">
              {cartItems.map((item, idx) => (
                <div
                  key={item.id + "-" + idx}
                  className="flex gap-4 items-center pt-3 first:pt-0"
                >
                  <div className="w-14 aspect-[3/4] overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-extrabold tracking-wider text-[#b2533e] uppercase">
                      {item.brand}
                    </span>
                    <h4 className="text-[11px] font-extrabold text-neutral-900 truncate uppercase mt-0.5 leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-1">
                      Qty: {item.quantity} | Size: {item.size} | Color:{" "}
                      {item.color}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-neutral-950">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3.5 pt-5 border-t border-neutral-200/80 text-[10px] font-bold tracking-wider text-neutral-600 uppercase">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-extrabold text-neutral-950">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {shippingCost > 0
                    ? `₹${shippingCost.toFixed(2)}`
                    : "FREE"}
                </span>
              </div>
              <div className="border-t border-neutral-150 pt-3 flex justify-between text-xs font-extrabold text-neutral-950">
                <span>Total</span>
                <span className="text-sm font-extrabold">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-neutral-50/50 border border-neutral-200/50 p-4 flex gap-3 text-[9px] font-bold text-neutral-500 uppercase tracking-wide leading-relaxed">
              <ShieldCheck className="h-5 w-5 text-neutral-600 flex-shrink-0 stroke-[1.5]" />
              <div>
                <h5 className="font-black text-neutral-800 text-[10px] tracking-widest mb-0.5">
                  Secure Checkout
                </h5>
                <p>
                  Your credentials and private data are encrypted under TLS
                  standards during processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
