import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  ShieldCheck, ArrowLeft, CheckCircle2, Home, Briefcase, MapPin, ShoppingBag,
  Plus, Check, Mail, Phone, Truck, Zap, ChevronRight, Clock, CreditCard, X,
  Plus, Check, Mail, Phone, Truck, Zap, ChevronRight, Clock, CreditCard, X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";
import { addressApi } from "../lib/address-api";
import { cartApi } from "../lib/cart-api";
import { couponApi } from "../lib/coupon-api";
import { orderApi } from "../lib/order-api";
import { cartApi } from "../lib/cart-api";
import { couponApi } from "../lib/coupon-api";
import { orderApi } from "../lib/order-api";
import { getSessionToken } from "../lib/auth-storage";


interface CartItem {
  id: number; brand: string; name: string; size: string; color: string;
  price: number; quantity: number; image: string;
}

interface Address {
  id: number; type: string; isDefault: boolean; firstName: string; lastName: string;
  buildingNo: string; buildingName: string; street: string; area: string;
  city: string; state: string; postalCode: string; phone: string;
}

const STEPS = [
  { num: "01", label: "Information", desc: "Contact & delivery destination" },
  { num: "02", label: "Delivery", desc: "Choose shipping method" },
  { num: "03", label: "Review & Confirm", desc: "Verify & place order" },
const STEPS = [
  { num: "01", label: "Information", desc: "Contact & delivery destination" },
  { num: "02", label: "Delivery", desc: "Choose shipping method" },
  { num: "03", label: "Review & Confirm", desc: "Verify & place order" },
] as const;

function StepIndicator({ current }: { current: number }) {
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((s, idx) => {
        const stepNum = idx + 1;
        const isActive = current === stepNum;
        const isCompleted = current > stepNum;
        return (
          <div key={s.num} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#030213] text-white"
                    : isActive
                    ? "bg-[#030213] text-white shadow-md shadow-black/10"
                    : "bg-neutral-200 text-neutral-400"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[2.5]" /> : s.num}
              </div>
              <span
                className={`mt-1.5 text-[8px] font-extrabold tracking-[0.2em] uppercase transition-colors ${
                  isActive || isCompleted ? "text-[#030213]" : "text-neutral-400"
                }`}
              >
                {s.label}
              </span>
              <span className="text-[6.5px] text-neutral-400 font-medium tracking-wider mt-0.5 hidden sm:block">
                {s.desc}
              </span>
            </div>
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className={`w-16 sm:w-28 h-px mx-3 sm:mx-5 mb-6 transition-colors duration-300 ${
                current > stepNum ? "bg-[#030213]" : "bg-neutral-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SummaryCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-neutral-200/80 p-5 ${className}`}>
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((s, idx) => {
        const stepNum = idx + 1;
        const isActive = current === stepNum;
        const isCompleted = current > stepNum;
        return (
          <div key={s.num} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#030213] text-white"
                    : isActive
                    ? "bg-[#030213] text-white shadow-md shadow-black/10"
                    : "bg-neutral-200 text-neutral-400"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[2.5]" /> : s.num}
              </div>
              <span
                className={`mt-1.5 text-[8px] font-extrabold tracking-[0.2em] uppercase transition-colors ${
                  isActive || isCompleted ? "text-[#030213]" : "text-neutral-400"
                }`}
              >
                {s.label}
              </span>
              <span className="text-[6.5px] text-neutral-400 font-medium tracking-wider mt-0.5 hidden sm:block">
                {s.desc}
              </span>
            </div>
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className={`w-16 sm:w-28 h-px mx-3 sm:mx-5 mb-6 transition-colors duration-300 ${
                current > stepNum ? "bg-[#030213]" : "bg-neutral-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SummaryCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-neutral-200/80 p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeading({ icon: Icon, label, right }: { icon: any; label: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-6 h-6 bg-[#030213] flex items-center justify-center">
        <Icon className="h-3 w-3 text-white stroke-[2]" />
      </div>
      <span className="text-[9px] font-black tracking-[0.25em] text-[#030213] uppercase flex-1">{label}</span>
      {right}
    </div>
  );
}

function SectionHeading({ icon: Icon, label, right }: { icon: any; label: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="w-6 h-6 bg-[#030213] flex items-center justify-center">
        <Icon className="h-3 w-3 text-white stroke-[2]" />
      </div>
      <span className="text-[9px] font-black tracking-[0.25em] text-[#030213] uppercase flex-1">{label}</span>
      {right}
    </div>
  );
}

function RecapRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0 border-b border-neutral-100 last:border-none">
    <div className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0 border-b border-neutral-100 last:border-none">
      <div className="min-w-0 flex-1">
        <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-0.5">{label}</span>
        <span className="text-[10px] font-bold text-[#030213] leading-snug block truncate">{value}</span>
        <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-0.5">{label}</span>
        <span className="text-[10px] font-bold text-[#030213] leading-snug block truncate">{value}</span>
      </div>
      {onEdit && (
        <button onClick={onEdit}
          className="flex-shrink-0 text-[7px] font-extrabold tracking-widest text-[#b2533e] hover:text-[#030213] uppercase underline underline-offset-2 bg-transparent border-none cursor-pointer transition-colors">
          className="flex-shrink-0 text-[7px] font-extrabold tracking-widest text-[#b2533e] hover:text-[#030213] uppercase underline underline-offset-2 bg-transparent border-none cursor-pointer transition-colors">
          Edit
        </button>
      )}
    </div>
  );
}

function MethodCard({ title, subtitle, price, badge, isSelected, onSelect, children }: {
  title: string; subtitle: string; price: string; badge?: string;
  isSelected: boolean; onSelect: () => void; children?: React.ReactNode;
}) {
  return (
    <div onClick={onSelect}
      className={`relative p-5 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-2 border-[#030213] bg-[#FAF8F5] shadow-sm"
          : "border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-sm"
          ? "border-2 border-[#030213] bg-[#FAF8F5] shadow-sm"
          : "border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-sm"
      }`}>
      {badge && (
        <span className={`absolute -top-2.5 right-4 text-[6.5px] font-black tracking-[0.2em] uppercase px-2.5 py-1 ${
        <span className={`absolute -top-2.5 right-4 text-[6.5px] font-black tracking-[0.2em] uppercase px-2.5 py-1 ${
          isSelected ? "bg-[#030213] text-white" : "bg-neutral-200 text-neutral-500"
        }`}>{badge}</span>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`mt-1 w-5 h-5 flex items-center justify-center border-2 transition-all ${
        <div className="flex items-start gap-3.5">
          <div className={`mt-1 w-5 h-5 flex items-center justify-center border-2 transition-all ${
            isSelected ? "border-[#030213] bg-[#030213]" : "border-neutral-300"
          }`}>
            {isSelected && <Check className="h-3 w-3 text-white stroke-[3]" />}
            {isSelected && <Check className="h-3 w-3 text-white stroke-[3]" />}
          </div>
          <div>
            <h4 className="text-[12px] font-extrabold tracking-[0.05em] text-[#030213] uppercase">{title}</h4>
            <p className="text-[9px] text-neutral-500 font-medium tracking-wide mt-0.5">{subtitle}</p>
            {children && <div className="mt-2.5">{children}</div>}
            <h4 className="text-[12px] font-extrabold tracking-[0.05em] text-[#030213] uppercase">{title}</h4>
            <p className="text-[9px] text-neutral-500 font-medium tracking-wide mt-0.5">{subtitle}</p>
            {children && <div className="mt-2.5">{children}</div>}
          </div>
        </div>
        <span className="text-sm font-extrabold text-[#030213] flex-shrink-0">{price}</span>
        <span className="text-sm font-extrabold text-[#030213] flex-shrink-0">{price}</span>
      </div>
    </div>
  );
}

function OTPVerification({
  target, otpCode, setOtpCode, setOtpError, otpError, isVerifying, onVerify, onCancel, label,
}: {
  target: "email" | "phone"; otpCode: string; setOtpCode: (v: string) => void; setOtpError: (v: string | null) => void;
  otpError: string | null; isVerifying: boolean; onVerify: () => void; onCancel: () => void;
  label: string;
}) {
  return (
    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-3">
      <p className="text-[8px] font-extrabold text-[#b2533e] uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text" maxLength={6} value={otpCode}
          onChange={(e) => { setOtpCode(e.target.value); setOtpError(null); }}
          placeholder="Enter OTP"
          className="border border-neutral-200 px-3 py-1.5 text-[9px] font-mono font-bold w-28 focus:outline-none focus:border-[#030213] tracking-widest text-center uppercase"
        />
        <button type="button" onClick={onVerify} disabled={isVerifying || otpCode.length !== 6}
          className="bg-[#030213] text-white text-[8px] font-extrabold tracking-widest px-4 py-1.5 uppercase hover:bg-neutral-800 disabled:opacity-40 transition-colors">
          {isVerifying ? "..." : "Confirm"}
        </button>
        <button type="button" onClick={onCancel}
          className="text-neutral-500 text-[8px] font-extrabold tracking-widest px-2 py-1.5 uppercase hover:text-[#030213] bg-transparent border-none cursor-pointer">
          Cancel
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[6.5px] font-mono text-neutral-400 uppercase">Test OTP: 123456</span>
        <button type="button" onClick={() => setOtpCode("123456")}
          className="text-[6.5px] font-extrabold tracking-wider text-[#b2533e] uppercase hover:underline bg-transparent border-none cursor-pointer">
          Auto-fill
        </button>
      </div>
      {otpError && <p className="text-[8px] font-extrabold text-red-600 tracking-wider">{otpError}</p>}
    </div>
  );
}

function OTPVerification({
  target, otpCode, setOtpCode, setOtpError, otpError, isVerifying, onVerify, onCancel, label,
}: {
  target: "email" | "phone"; otpCode: string; setOtpCode: (v: string) => void; setOtpError: (v: string | null) => void;
  otpError: string | null; isVerifying: boolean; onVerify: () => void; onCancel: () => void;
  label: string;
}) {
  return (
    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-3">
      <p className="text-[8px] font-extrabold text-[#b2533e] uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text" maxLength={6} value={otpCode}
          onChange={(e) => { setOtpCode(e.target.value); setOtpError(null); }}
          placeholder="Enter OTP"
          className="border border-neutral-200 px-3 py-1.5 text-[9px] font-mono font-bold w-28 focus:outline-none focus:border-[#030213] tracking-widest text-center uppercase"
        />
        <button type="button" onClick={onVerify} disabled={isVerifying || otpCode.length !== 6}
          className="bg-[#030213] text-white text-[8px] font-extrabold tracking-widest px-4 py-1.5 uppercase hover:bg-neutral-800 disabled:opacity-40 transition-colors">
          {isVerifying ? "..." : "Confirm"}
        </button>
        <button type="button" onClick={onCancel}
          className="text-neutral-500 text-[8px] font-extrabold tracking-widest px-2 py-1.5 uppercase hover:text-[#030213] bg-transparent border-none cursor-pointer">
          Cancel
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[6.5px] font-mono text-neutral-400 uppercase">Test OTP: 123456</span>
        <button type="button" onClick={() => setOtpCode("123456")}
          className="text-[6.5px] font-extrabold tracking-wider text-[#b2533e] uppercase hover:underline bg-transparent border-none cursor-pointer">
          Auto-fill
        </button>
      </div>
      {otpError && <p className="text-[8px] font-extrabold text-red-600 tracking-wider">{otpError}</p>}
    </div>
  );
}

export function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      const timer = setTimeout(() => navigate("/shop"), 1500);
      return () => clearTimeout(timer);
    }
  }, [cartItems.length, navigate]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  const registeredEmail = user?.email || "";
  const registeredPhone = user?.phone || "";

  const isEmailPreVerified = !!registeredEmail;
  const isPhonePreVerified = !!registeredPhone;

  const [email, setEmail] = useState(() => registeredEmail);
  const [phone, setPhone] = useState(() => registeredPhone);

  const [isEmailVerifiedLocally, setIsEmailVerifiedLocally] = useState(isEmailPreVerified);
  const [isPhoneVerifiedLocally, setIsPhoneVerifiedLocally] = useState(isPhonePreVerified);

  const [verifyingTarget, setVerifyingTarget] = useState<"email" | "phone" | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.email) { setEmail(user.email); setIsEmailVerifiedLocally(true); }
      if (user.phone) { setPhone(user.phone); setIsPhoneVerifiedLocally(true); }
      if (user.email) { setEmail(user.email); setIsEmailVerifiedLocally(true); }
      if (user.phone) { setPhone(user.phone); setIsPhoneVerifiedLocally(true); }
    }
  }, [user]);

  const [addresses, setAddresses] = useState<Address[]>(() => {
    try { const stored = localStorage.getItem("addresses"); return stored ? JSON.parse(stored) : []; }
    catch { return []; }
    try { const stored = localStorage.getItem("addresses"); return stored ? JSON.parse(stored) : []; }
    catch { return []; }
  });

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(() => {
    const d = addresses.find(a => a.isDefault);
    return d ? d.id : addresses[0]?.id || null;
    const d = addresses.find(a => a.isDefault);
    return d ? d.id : addresses[0]?.id || null;
  });

  const [showAddressSelectorModal, setShowAddressSelectorModal] = useState(false);

  useEffect(() => {
    async function loadApiAddresses() {
      if (getSessionToken()) {
        try {
          const list = await addressApi.getAddresses();
          if (list) {
            setAddresses(list);
            const d = list.find(a => a.isDefault);
            setSelectedAddressId(d ? d.id : list[0]?.id || null);
            const d = list.find(a => a.isDefault);
            setSelectedAddressId(d ? d.id : list[0]?.id || null);
          }
        } catch (err) { console.error("Failed to load addresses from API", err); }
        } catch (err) { console.error("Failed to load addresses from API", err); }
      }
    }
    loadApiAddresses();
  }, []);

  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const d = addresses.find(a => a.isDefault);
      setSelectedAddressId(d ? d.id : addresses[0].id);
      const d = addresses.find(a => a.isDefault);
      setSelectedAddressId(d ? d.id : addresses[0].id);
    } else if (addresses.length === 0) {
      setSelectedAddressId(null);
    }
  }, [addresses, selectedAddressId]);

  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => localStorage.getItem("appliedPromo"));
  const [promoDiscount, setPromoDiscount] = useState<number>(() => Number(localStorage.getItem("promoDiscount")) || 0);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [availableCheckoutCoupons, setAvailableCheckoutCoupons] = useState<any[]>([]);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const token = getSessionToken();
        if (token) {
          const cc = await couponApi.fetchCustomerCoupons();
          setAvailableCheckoutCoupons(cc);
        } else {
          const pc = await couponApi.fetchPublicCoupons();
          setAvailableCheckoutCoupons(pc);
        }
      } catch (err) {
        console.error("Failed to load checkout coupons", err);
        try { const pc = await couponApi.fetchPublicCoupons(); setAvailableCheckoutCoupons(pc); }
        catch { /* ignore */ }
      }
    }
    loadCoupons();
  }, []);

  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [availableCheckoutCoupons, setAvailableCheckoutCoupons] = useState<any[]>([]);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const token = getSessionToken();
        if (token) {
          const cc = await couponApi.fetchCustomerCoupons();
          setAvailableCheckoutCoupons(cc);
        } else {
          const pc = await couponApi.fetchPublicCoupons();
          setAvailableCheckoutCoupons(pc);
        }
      } catch (err) {
        console.error("Failed to load checkout coupons", err);
        try { const pc = await couponApi.fetchPublicCoupons(); setAvailableCheckoutCoupons(pc); }
        catch { /* ignore */ }
      }
    }
    loadCoupons();
  }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    type: "HOME", otherName: "", firstName: "", lastName: "",
    buildingNo: "", buildingName: "", street: "", area: "",
    city: "", state: "", postalCode: "", phone: "", isDefault: false,
  });

  const [isOrdered, setIsOrdered] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<any>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [orderSubmitError, setOrderSubmitError] = useState<string | null>(null);

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shippingCost, setShippingCost] = useState(90);
  const [total, setTotal] = useState(0);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<any>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [orderSubmitError, setOrderSubmitError] = useState<string | null>(null);

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shippingCost, setShippingCost] = useState(90);
  const [total, setTotal] = useState(0);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : 90;

  useEffect(() => {
    async function updateOrderPreview() {
      if (cartItems.length === 0) return;
      try {
        const preview = await orderApi.previewOrder({
          deliveryMethod: shippingMethod.toUpperCase(),
          couponCode: appliedPromo || undefined
        });
        setSubtotal((preview as any).subTotal ?? preview.subtotal ?? 0);
        setPromoDiscount(preview.discount ?? 0);
        setTax(preview.tax ?? 0);
        setShippingCost(preview.shippingFee ?? 0);
        setTotal(preview.grandTotal ?? 0);
      } catch (err) {
        console.error("Failed to preview order from backend", err);
        const localSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const localDeliveryFee = localSubtotal === 0 ? 0 : 90;
        const localIsFreeShippingPromo = appliedPromo === "FREESHIP" || appliedPromo === "FREE";
        const localShippingCost = localIsFreeShippingPromo ? 0 : (shippingMethod === "express" ? 150.0 : localDeliveryFee);
        const localDiscount = Number(localStorage.getItem("promoDiscount")) || 0;
        const localDiscountedSubtotal = Math.max(0, localSubtotal - localDiscount);
        const localTax = localDiscountedSubtotal * 0.18;
        
        setSubtotal(localSubtotal);
        setPromoDiscount(localDiscount);
        setTax(localTax);
        setShippingCost(localShippingCost);
        setTotal(localDiscountedSubtotal + localTax + localShippingCost);
      }
    }
    updateOrderPreview();
  }, [cartItems, shippingMethod, appliedPromo]);


  useEffect(() => { localStorage.setItem("addresses", JSON.stringify(addresses)); }, [addresses]);

  const activeAddress = addresses.find(a => a.id === selectedAddressId) || null;

  const handleOpenAddForm = () => {
    setEditingAddressId(null);
    setAddressForm({
      type: "HOME", otherName: "", firstName: "", lastName: "",
      buildingNo: "", buildingName: "", street: "", area: "", city: "", state: "",
      postalCode: "", phone: "", isDefault: addresses.length === 0,
    });
    setIsFormOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = addressForm.type === "OTHER"
      ? (addressForm.otherName.trim() || "OTHER").toUpperCase()
      : addressForm.type;

    const requestData = {
      type: finalType, firstName: addressForm.firstName, lastName: addressForm.lastName,
      buildingNo: addressForm.buildingNo, buildingName: addressForm.buildingName, street: addressForm.street,
      area: addressForm.area, city: addressForm.city, state: addressForm.state,
      postalCode: addressForm.postalCode, phone: addressForm.phone, isDefault: addressForm.isDefault
    };

    if (editingAddressId !== null) {
      if (getSessionToken()) {
        try { await addressApi.updateAddress(editingAddressId, requestData); }
        catch (err) { console.error("Failed to update address via API", err); }
        try { await addressApi.updateAddress(editingAddressId, requestData); }
        catch (err) { console.error("Failed to update address via API", err); }
      }
      setAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...a, ...requestData } : addressForm.isDefault ? { ...a, isDefault: false } : a));
      setAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...a, ...requestData } : addressForm.isDefault ? { ...a, isDefault: false } : a));
    } else {
      let savedId = Date.now();
      if (getSessionToken()) {
        try { const res = await addressApi.createAddress(requestData); if (res?.data?.id) savedId = res.data.id; }
        catch (err) { console.error("Failed to create address via API", err); }
        try { const res = await addressApi.createAddress(requestData); if (res?.data?.id) savedId = res.data.id; }
        catch (err) { console.error("Failed to create address via API", err); }
      }
      const newAddr: Address = { id: savedId, ...requestData, isDefault: addressForm.isDefault || addresses.length === 0 };
      setAddresses(prev => addressForm.isDefault ? prev.map(a => ({ ...a, isDefault: false })).concat(newAddr) : [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
      const newAddr: Address = { id: savedId, ...requestData, isDefault: addressForm.isDefault || addresses.length === 0 };
      setAddresses(prev => addressForm.isDefault ? prev.map(a => ({ ...a, isDefault: false })).concat(newAddr) : [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
    }
    setIsFormOpen(false);
    setEditingAddressId(null);
  };

  const startVerification = async (target: "email" | "phone") => {
  const startVerification = async (target: "email" | "phone") => {
    if (target === "email") {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setEmailError("Please enter a valid email address before verifying.");
        return;
      }
      setEmailError(null);
      setVerifyingTarget(target);
      setOtpCode("");
      setOtpError(null);
      setVerifyingTarget(target);
      setOtpCode("");
      setOtpError(null);
    } else {
      const cleanPhone = phone.replace(/\D/g, "");
      if (!phone.trim() || cleanPhone.length !== 10) {
      const cleanPhone = phone.replace(/\D/g, "");
      if (!phone.trim() || cleanPhone.length !== 10) {
        setPhoneError("Please enter a valid 10-digit phone number before verifying.");
        return;
      }
      setPhoneError(null);
      setIsSendingOtp(true);
      try {
        await orderApi.sendCheckoutOtp(cleanPhone);
        setVerifyingTarget(target);
        setOtpCode("");
        setOtpError(null);
      } catch (err: any) {
        console.error("Failed to send OTP to phone", err);
        setPhoneError(err?.response?.data?.message || "Failed to send OTP. Please try again.");
      } finally {
        setIsSendingOtp(false);
      }
    }
      setIsSendingOtp(true);
      try {
        await orderApi.sendCheckoutOtp(cleanPhone);
        setVerifyingTarget(target);
        setOtpCode("");
        setOtpError(null);
      } catch (err: any) {
        console.error("Failed to send OTP to phone", err);
        setPhoneError(err?.response?.data?.message || "Failed to send OTP. Please try again.");
      } finally {
        setIsSendingOtp(false);
      }
    }
  };

  const handleVerifyOtpLocal = async () => {
  const handleVerifyOtpLocal = async () => {
    setOtpError(null);
    setIsVerifyingOtp(true);
    try {
      if (verifyingTarget === "email") {
        if (otpCode === "123456") {
    try {
      if (verifyingTarget === "email") {
        if (otpCode === "123456") {
          setIsEmailVerifiedLocally(true);
          setEmailError(null);
          setVerifyingTarget(null);
        } else {
          setOtpError("Invalid code. Please enter 123456 to verify.");
        }
      } else if (verifyingTarget === "phone") {
        const cleanPhone = phone.replace(/\D/g, "");
        await orderApi.verifyCheckoutOtp(cleanPhone, otpCode);
        setIsPhoneVerifiedLocally(true);
        setPhoneError(null);
          setVerifyingTarget(null);
        } else {
          setOtpError("Invalid code. Please enter 123456 to verify.");
        }
      } else if (verifyingTarget === "phone") {
        const cleanPhone = phone.replace(/\D/g, "");
        await orderApi.verifyCheckoutOtp(cleanPhone, otpCode);
        setIsPhoneVerifiedLocally(true);
        setPhoneError(null);
        setVerifyingTarget(null);
      }
    } catch (err: any) {
      console.error("Failed to verify OTP", err);
      setOtpError(err?.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
    } catch (err: any) {
      console.error("Failed to verify OTP", err);
      setOtpError(err?.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
    }
  };

  const validateStep1 = (): boolean => {
    let valid = true;
    setEmailError(null); setPhoneError(null); setAddressError(null);
    setEmailError(null); setPhoneError(null); setAddressError(null);

    if (!email.trim()) { setEmailError("Email address is required."); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setEmailError("Please enter a valid email address."); valid = false; }
    else if (!isEmailVerifiedLocally) { setEmailError("Please verify your email using OTP first."); valid = false; }
    if (!email.trim()) { setEmailError("Email address is required."); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setEmailError("Please enter a valid email address."); valid = false; }
    else if (!isEmailVerifiedLocally) { setEmailError("Please verify your email using OTP first."); valid = false; }

    if (!phone.trim()) { setPhoneError("Phone number is required."); valid = false; }
    else if (phone.replace(/\D/g, "").length < 10) { setPhoneError("Please enter a valid 10-digit phone number."); valid = false; }
    else if (!isPhoneVerifiedLocally) { setPhoneError("Please verify your phone number using OTP first."); valid = false; }
    if (!phone.trim()) { setPhoneError("Phone number is required."); valid = false; }
    else if (phone.replace(/\D/g, "").length < 10) { setPhoneError("Please enter a valid 10-digit phone number."); valid = false; }
    else if (!isPhoneVerifiedLocally) { setPhoneError("Please verify your phone number using OTP first."); valid = false; }

    if (!activeAddress) { setAddressError("Please add and select a delivery address."); valid = false; }
    if (!activeAddress) { setAddressError("Please add and select a delivery address."); valid = false; }

    return valid;
  };

  const handleContinueToDelivery = () => { if (validateStep1()) setStep(2); };
  const handleContinueToReview = () => setStep(3);
  const handleContinueToDelivery = () => { if (validateStep1()) setStep(2); };
  const handleContinueToReview = () => setStep(3);

  const handleSubmitOrder = async (e: React.FormEvent) => {
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAddress) {
      setOrderSubmitError("Please select a valid delivery address.");
      return;
    }
    setOrderSubmitError(null);
    setIsSubmittingOrder(true);

    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const response = await orderApi.placeOrder({
        addressId: activeAddress.id,
        phoneNo: cleanPhone,
        deliveryMethod: shippingMethod.toUpperCase(),
        couponCode: appliedPromo || undefined
      });

      setPlacedOrderInfo(response);
      setIsOrdered(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

      // Save order items description in a shared cookie for the admin panel to read!
      const productNames = cartItems.map(item => item.name).join(", ");
      const existingMapStr = document.cookie.split("; ").find(row => row.startsWith("dd_placed_orders="))?.split("=")[1] || "{}";
      try {
        const decodedMap = JSON.parse(decodeURIComponent(existingMapStr));
        decodedMap[response.orderNumber] = productNames;
        document.cookie = `dd_placed_orders=${encodeURIComponent(JSON.stringify(decodedMap))}; path=/; max-age=31536000; domain=localhost`;
      } catch (e) {
        const newMap = { [response.orderNumber]: productNames };
        document.cookie = `dd_placed_orders=${encodeURIComponent(JSON.stringify(newMap))}; path=/; max-age=31536000; domain=localhost`;
      }

      const token = getSessionToken();
      if (token) {
        cartApi.clearCart().catch(err => console.error("Failed to clear backend cart", err));
      }
      localStorage.removeItem("cart");
      localStorage.removeItem("appliedPromo");
      localStorage.removeItem("promoDiscount");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err: any) {
      console.error("Failed to place order via API", err);
      setOrderSubmitError(err?.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const applyPromoCode = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code || isApplyingPromo) return;

    setIsApplyingPromo(true);

    const token = getSessionToken();
    if (token) {
      try {
        const result = await couponApi.validateCoupon(code, subtotal);
        if (result.valid) {
          const discount = result.discountAmount || (
            result.discountType === "percentage"
              ? Math.round((result.discountValue || 0) / 100 * subtotal)
              : result.discountValue || 0
          );
          setAppliedPromo(code);
          setPromoDiscount(discount);
          localStorage.setItem("appliedPromo", code);
          localStorage.setItem("promoDiscount", discount.toString());
          setPromoInput("");
          setPromoError(null);
          setIsApplyingPromo(false);
          return;
        }
      } catch (err) {
        console.error("Backend coupon validation failed, falling back", err);
      }
    }

    if (code === "FREESHIP" || code === "FREE") {
      setAppliedPromo(code); setPromoDiscount(0);
      localStorage.setItem("appliedPromo", code); localStorage.setItem("promoDiscount", "0");
      setPromoInput(""); setPromoError(null);
    } else if (code === "DD-WELCOME") {
      const d = Math.round(subtotal * 0.15);
      setAppliedPromo(code); setPromoDiscount(d);
      localStorage.setItem("appliedPromo", code); localStorage.setItem("promoDiscount", d.toString());
      setPromoInput(""); setPromoError(null);
    } else if (code === "DRIP10") {
      const d = subtotal * 0.1;
      setAppliedPromo(code); setPromoDiscount(d);
      localStorage.setItem("appliedPromo", code); localStorage.setItem("promoDiscount", d.toString());
      setPromoInput(""); setPromoError(null);
    } else if (code === "DRIP20") {
      const d = subtotal * 0.2;
      setAppliedPromo(code); setPromoDiscount(d);
      localStorage.setItem("appliedPromo", code); localStorage.setItem("promoDiscount", d.toString());
      setPromoInput(""); setPromoError(null);
    } else {
      setPromoError("Invalid coupon code.");
    }
    setIsApplyingPromo(false);
  };

  // ---- Empty cart state ----
    if (!activeAddress) {
      setOrderSubmitError("Please select a valid delivery address.");
      return;
    }
    setOrderSubmitError(null);
    setIsSubmittingOrder(true);

    try {
      const cleanPhone = phone.replace(/\D/g, "");
      const response = await orderApi.placeOrder({
        addressId: activeAddress.id,
        phoneNo: cleanPhone,
        deliveryMethod: shippingMethod.toUpperCase(),
        couponCode: appliedPromo || undefined
      });

      setPlacedOrderInfo(response);
      setIsOrdered(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

      // Save order items description in a shared cookie for the admin panel to read!
      const productNames = cartItems.map(item => item.name).join(", ");
      const existingMapStr = document.cookie.split("; ").find(row => row.startsWith("dd_placed_orders="))?.split("=")[1] || "{}";
      try {
        const decodedMap = JSON.parse(decodeURIComponent(existingMapStr));
        decodedMap[response.orderNumber] = productNames;
        document.cookie = `dd_placed_orders=${encodeURIComponent(JSON.stringify(decodedMap))}; path=/; max-age=31536000; domain=localhost`;
      } catch (e) {
        const newMap = { [response.orderNumber]: productNames };
        document.cookie = `dd_placed_orders=${encodeURIComponent(JSON.stringify(newMap))}; path=/; max-age=31536000; domain=localhost`;
      }

      const token = getSessionToken();
      if (token) {
        cartApi.clearCart().catch(err => console.error("Failed to clear backend cart", err));
      }
      localStorage.removeItem("cart");
      localStorage.removeItem("appliedPromo");
      localStorage.removeItem("promoDiscount");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err: any) {
      console.error("Failed to place order via API", err);
      setOrderSubmitError(err?.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const applyPromoCode = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code || isApplyingPromo) return;

    setIsApplyingPromo(true);

    const token = getSessionToken();
    if (token) {
      try {
        const result = await couponApi.validateCoupon(code, subtotal);
        if (result.valid) {
          const discount = result.discountAmount || (
            result.discountType === "percentage"
              ? Math.round((result.discountValue || 0) / 100 * subtotal)
              : result.discountValue || 0
          );
          setAppliedPromo(code);
          setPromoDiscount(discount);
          localStorage.setItem("appliedPromo", code);
          localStorage.setItem("promoDiscount", discount.toString());
          setPromoInput("");
          setPromoError(null);
          setIsApplyingPromo(false);
          return;
        }
      } catch (err) {
        console.error("Backend coupon validation failed, falling back", err);
      }
    }

    if (code === "FREESHIP" || code === "FREE") {
      setAppliedPromo(code); setPromoDiscount(0);
      localStorage.setItem("appliedPromo", code); localStorage.setItem("promoDiscount", "0");
      setPromoInput(""); setPromoError(null);
    } else if (code === "DD-WELCOME") {
      const d = Math.round(subtotal * 0.15);
      setAppliedPromo(code); setPromoDiscount(d);
      localStorage.setItem("appliedPromo", code); localStorage.setItem("promoDiscount", d.toString());
      setPromoInput(""); setPromoError(null);
    } else if (code === "DRIP10") {
      const d = subtotal * 0.1;
      setAppliedPromo(code); setPromoDiscount(d);
      localStorage.setItem("appliedPromo", code); localStorage.setItem("promoDiscount", d.toString());
      setPromoInput(""); setPromoError(null);
    } else if (code === "DRIP20") {
      const d = subtotal * 0.2;
      setAppliedPromo(code); setPromoDiscount(d);
      localStorage.setItem("appliedPromo", code); localStorage.setItem("promoDiscount", d.toString());
      setPromoInput(""); setPromoError(null);
    } else {
      setPromoError("Invalid coupon code.");
    }
    setIsApplyingPromo(false);
  };

  // ---- Empty cart state ----
  if (cartItems.length === 0 && !isOrdered) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased py-24">
      <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased py-24">
        <div className="max-w-md mx-auto px-6 text-center">
          <ShoppingBag className="h-14 w-14 mx-auto text-neutral-200 mb-5" />
          <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase mb-3">Your Cart is Empty</h1>
          <ShoppingBag className="h-14 w-14 mx-auto text-neutral-200 mb-5" />
          <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase mb-3">Your Cart is Empty</h1>
          <p className="text-[11px] text-neutral-500 font-medium mb-6">Add items to your cart before checking out.</p>
          <Link to="/shop"
            className="inline-block bg-[#030213] hover:bg-neutral-800 text-white px-10 py-3.5 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-colors">
            className="inline-block bg-[#030213] hover:bg-neutral-800 text-white px-10 py-3.5 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-colors">
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  // ---- Success state ----
  // ---- Success state ----
  if (isOrdered) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased py-24">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
      <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased py-24">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600 stroke-[1.2]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-[0.05em] mb-4 uppercase">Order Placed Successfully</h1>
          
          {placedOrderInfo && (
            <div className="bg-white border border-neutral-200 p-5 text-left space-y-3.5 mb-8 text-[9px] font-bold uppercase tracking-wider text-neutral-600">
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span>Order Code:</span>
                <span className="text-[#030213] font-extrabold">{placedOrderInfo.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span>Total Amount:</span>
                <span className="text-[#030213] font-extrabold">₹{placedOrderInfo.totalAmount?.toLocaleString("en-IN")}</span>
              </div>
              {placedOrderInfo.discount > 0 && (
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span>Discount Applied:</span>
                  <span className="text-green-600 font-extrabold">-₹{placedOrderInfo.discount?.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span>Shipping Method:</span>
                <span className="text-[#030213] font-extrabold">{placedOrderInfo.deliveryMethod}</span>
              </div>
              <div className="flex flex-col border-b border-neutral-100 pb-2 gap-1 text-left">
                <span>Deliver To:</span>
                <span className="text-[#030213] font-extrabold normal-case font-medium text-[10px] leading-relaxed">
                  {placedOrderInfo.destinationAddress || placedOrderInfo.destination}
                </span>
              </div>
            </div>
          )}

          
          {placedOrderInfo && (
            <div className="bg-white border border-neutral-200 p-5 text-left space-y-3.5 mb-8 text-[9px] font-bold uppercase tracking-wider text-neutral-600">
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span>Order Code:</span>
                <span className="text-[#030213] font-extrabold">{placedOrderInfo.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span>Total Amount:</span>
                <span className="text-[#030213] font-extrabold">₹{placedOrderInfo.totalAmount?.toLocaleString("en-IN")}</span>
              </div>
              {placedOrderInfo.discount > 0 && (
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                  <span>Discount Applied:</span>
                  <span className="text-green-600 font-extrabold">-₹{placedOrderInfo.discount?.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-neutral-100 pb-2">
                <span>Shipping Method:</span>
                <span className="text-[#030213] font-extrabold">{placedOrderInfo.deliveryMethod}</span>
              </div>
              <div className="flex flex-col border-b border-neutral-100 pb-2 gap-1 text-left">
                <span>Deliver To:</span>
                <span className="text-[#030213] font-extrabold normal-case font-medium text-[10px] leading-relaxed">
                  {placedOrderInfo.destinationAddress || placedOrderInfo.destination}
                </span>
              </div>
            </div>
          )}

          <p className="text-neutral-500 text-xs leading-relaxed mb-8 uppercase tracking-wider font-bold">
            Your Cash on Delivery order is confirmed! A notification will be sent shortly.
            Your Cash on Delivery order is confirmed! A notification will be sent shortly.
          </p>
          <Link to="/"
            className="block w-full bg-[#030213] text-white py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors uppercase">
            className="block w-full bg-[#030213] text-white py-4 text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors uppercase">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.12em] uppercase">Checkout</h1>
          <p className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase mt-1">
            {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} · ₹{total.toFixed(0)}
          </p>
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.12em] uppercase">Checkout</h1>
          <p className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase mt-1">
            {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} · ₹{total.toFixed(0)}
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ======= LEFT COLUMN — Steps ======= */}
          <div className="lg:col-span-8 space-y-6">

            {/* ——— STEP 1 — INFORMATION ——— */}
        {/* Step Indicator */}
        <StepIndicator current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ======= LEFT COLUMN — Steps ======= */}
          <div className="lg:col-span-8 space-y-6">

            {/* ——— STEP 1 — INFORMATION ——— */}
            {step === 1 && (
              <div className="space-y-8">
                {/* Contact Section */}
                <SummaryCard>
                  <SectionHeading icon={Mail} label="Account Contact" right={
                    user && <span className="text-[6.5px] font-black tracking-[0.2em] text-green-700 bg-green-50 border border-green-200/60 px-2 py-0.5 uppercase">Verified Profile</span>
                  } />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="border border-neutral-200 bg-white p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase">Email Address</span>
                        {isEmailVerifiedLocally && (
                          <span className="text-[6px] font-black tracking-[0.15em] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 uppercase flex items-center gap-0.5">
                            <Check className="h-2 w-2 stroke-[3]" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-neutral-300 stroke-[1.5] flex-shrink-0" />
                        <input type="email" required value={email}
                          onChange={(e) => { if (!isEmailVerifiedLocally) { setEmail(e.target.value); setEmailError(null); } }}
                          placeholder="Email address" readOnly={isEmailVerifiedLocally}
                          className={`w-full bg-transparent border-none p-0 text-[11px] font-bold tracking-wide text-[#030213] focus:outline-none placeholder-neutral-300 uppercase ${isEmailVerifiedLocally ? "opacity-60 cursor-not-allowed" : ""}`} />
                        {!isEmailVerifiedLocally && email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && verifyingTarget !== "email" && (
                          <button type="button" onClick={() => startVerification("email")}
                            className="text-[8px] font-black tracking-widest text-[#b2533e] hover:text-[#030213] uppercase underline underline-offset-2 transition-colors bg-transparent border-none flex-shrink-0 cursor-pointer">
                            Verify
                          </button>
                        )}
                      </div>
                      {emailError && <p className="text-[7.5px] font-extrabold text-red-600 mt-1.5 tracking-wider">{emailError}</p>}
                      {isEmailPreVerified && <span className="text-[7px] text-neutral-400 font-medium mt-1.5 block">Auto-filled from your account</span>}
                      {verifyingTarget === "email" && (
                        <OTPVerification target="email" otpCode={otpCode} setOtpCode={setOtpCode} setOtpError={setOtpError} otpError={otpError}
                          isVerifying={isVerifyingOtp} onVerify={handleVerifyOtpLocal}
                          onCancel={() => setVerifyingTarget(null)} label={`Verify Email (OTP sent to ${email})`} />
                      )}
                    </div>
              <div className="space-y-8">
                {/* Contact Section */}
                <SummaryCard>
                  <SectionHeading icon={Mail} label="Account Contact" right={
                    user && <span className="text-[6.5px] font-black tracking-[0.2em] text-green-700 bg-green-50 border border-green-200/60 px-2 py-0.5 uppercase">Verified Profile</span>
                  } />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="border border-neutral-200 bg-white p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase">Email Address</span>
                        {isEmailVerifiedLocally && (
                          <span className="text-[6px] font-black tracking-[0.15em] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 uppercase flex items-center gap-0.5">
                            <Check className="h-2 w-2 stroke-[3]" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-neutral-300 stroke-[1.5] flex-shrink-0" />
                        <input type="email" required value={email}
                          onChange={(e) => { if (!isEmailVerifiedLocally) { setEmail(e.target.value); setEmailError(null); } }}
                          placeholder="Email address" readOnly={isEmailVerifiedLocally}
                          className={`w-full bg-transparent border-none p-0 text-[11px] font-bold tracking-wide text-[#030213] focus:outline-none placeholder-neutral-300 uppercase ${isEmailVerifiedLocally ? "opacity-60 cursor-not-allowed" : ""}`} />
                        {!isEmailVerifiedLocally && email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && verifyingTarget !== "email" && (
                          <button type="button" onClick={() => startVerification("email")}
                            className="text-[8px] font-black tracking-widest text-[#b2533e] hover:text-[#030213] uppercase underline underline-offset-2 transition-colors bg-transparent border-none flex-shrink-0 cursor-pointer">
                            Verify
                          </button>
                        )}
                      </div>
                      {emailError && <p className="text-[7.5px] font-extrabold text-red-600 mt-1.5 tracking-wider">{emailError}</p>}
                      {isEmailPreVerified && <span className="text-[7px] text-neutral-400 font-medium mt-1.5 block">Auto-filled from your account</span>}
                      {verifyingTarget === "email" && (
                        <OTPVerification target="email" otpCode={otpCode} setOtpCode={setOtpCode} setOtpError={setOtpError} otpError={otpError}
                          isVerifying={isVerifyingOtp} onVerify={handleVerifyOtpLocal}
                          onCancel={() => setVerifyingTarget(null)} label={`Verify Email (OTP sent to ${email})`} />
                      )}
                    </div>

                    {/* Phone */}
                    <div className="border border-neutral-200 bg-white p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase">Phone Number</span>
                        {isPhoneVerifiedLocally && (
                          <span className="text-[6px] font-black tracking-[0.15em] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 uppercase flex items-center gap-0.5">
                            <Check className="h-2 w-2 stroke-[3]" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-neutral-300 stroke-[1.5] flex-shrink-0" />
                        <input type="tel" required value={phone}
                          onChange={(e) => { if (!isPhoneVerifiedLocally) { setPhone(e.target.value); setPhoneError(null); } }}
                          placeholder="Phone number" readOnly={isPhoneVerifiedLocally}
                          className={`w-full bg-transparent border-none p-0 text-[11px] font-bold tracking-wide text-[#030213] focus:outline-none placeholder-neutral-300 ${isPhoneVerifiedLocally ? "opacity-60 cursor-not-allowed" : ""}`} />
                        {!isPhoneVerifiedLocally && phone.trim() && phone.replace(/\D/g, "").length >= 10 && verifyingTarget !== "phone" && (
                          <button type="button" onClick={() => startVerification("phone")}
                            className="text-[8px] font-black tracking-widest text-[#b2533e] hover:text-[#030213] uppercase underline underline-offset-2 transition-colors bg-transparent border-none flex-shrink-0 cursor-pointer">
                            Verify
                          </button>
                        )}
                      </div>
                      {phoneError && <p className="text-[7.5px] font-extrabold text-red-600 mt-1.5 tracking-wider">{phoneError}</p>}
                      {isPhonePreVerified && <span className="text-[7px] text-neutral-400 font-medium mt-1.5 block">Auto-filled from your account</span>}
                      {verifyingTarget === "phone" && (
                        <OTPVerification target="phone" otpCode={otpCode} setOtpCode={setOtpCode} setOtpError={setOtpError} otpError={otpError}
                          isVerifying={isVerifyingOtp} onVerify={handleVerifyOtpLocal}
                          onCancel={() => setVerifyingTarget(null)} label={`Verify Phone (OTP sent to ${phone})`} />
                      )}
                    </div>
                  </div>
                </SummaryCard>

                {/* Delivery Destination */}
                <SummaryCard>
                  <SectionHeading icon={MapPin} label="Delivery Destination" right={
                    <span className="text-[7px] text-neutral-400 font-bold tracking-wider">{addresses.length} saved</span>
                  } />
                    {/* Phone */}
                    <div className="border border-neutral-200 bg-white p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase">Phone Number</span>
                        {isPhoneVerifiedLocally && (
                          <span className="text-[6px] font-black tracking-[0.15em] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 uppercase flex items-center gap-0.5">
                            <Check className="h-2 w-2 stroke-[3]" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-neutral-300 stroke-[1.5] flex-shrink-0" />
                        <input type="tel" required value={phone}
                          onChange={(e) => { if (!isPhoneVerifiedLocally) { setPhone(e.target.value); setPhoneError(null); } }}
                          placeholder="Phone number" readOnly={isPhoneVerifiedLocally}
                          className={`w-full bg-transparent border-none p-0 text-[11px] font-bold tracking-wide text-[#030213] focus:outline-none placeholder-neutral-300 ${isPhoneVerifiedLocally ? "opacity-60 cursor-not-allowed" : ""}`} />
                        {!isPhoneVerifiedLocally && phone.trim() && phone.replace(/\D/g, "").length >= 10 && verifyingTarget !== "phone" && (
                          <button type="button" onClick={() => startVerification("phone")}
                            className="text-[8px] font-black tracking-widest text-[#b2533e] hover:text-[#030213] uppercase underline underline-offset-2 transition-colors bg-transparent border-none flex-shrink-0 cursor-pointer">
                            Verify
                          </button>
                        )}
                      </div>
                      {phoneError && <p className="text-[7.5px] font-extrabold text-red-600 mt-1.5 tracking-wider">{phoneError}</p>}
                      {isPhonePreVerified && <span className="text-[7px] text-neutral-400 font-medium mt-1.5 block">Auto-filled from your account</span>}
                      {verifyingTarget === "phone" && (
                        <OTPVerification target="phone" otpCode={otpCode} setOtpCode={setOtpCode} setOtpError={setOtpError} otpError={otpError}
                          isVerifying={isVerifyingOtp} onVerify={handleVerifyOtpLocal}
                          onCancel={() => setVerifyingTarget(null)} label={`Verify Phone (OTP sent to ${phone})`} />
                      )}
                    </div>
                  </div>
                </SummaryCard>

                {/* Delivery Destination */}
                <SummaryCard>
                  <SectionHeading icon={MapPin} label="Delivery Destination" right={
                    <span className="text-[7px] text-neutral-400 font-bold tracking-wider">{addresses.length} saved</span>
                  } />

                  {addressError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200">
                      <p className="text-[7.5px] font-extrabold text-red-600 tracking-wider">{addressError}</p>
                    </div>
                  )}
                  {addressError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200">
                      <p className="text-[7.5px] font-extrabold text-red-600 tracking-wider">{addressError}</p>
                    </div>
                  )}

                  {isFormOpen ? (
                    <form onSubmit={handleSaveAddress} className="bg-neutral-50/50 border border-neutral-200 p-5 space-y-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[9px] font-black tracking-[0.2em] text-[#030213] uppercase">{editingAddressId ? "Edit Destination" : "New Destination"}</h4>
                        <span className="text-[7px] text-neutral-400 font-medium">Fulfilment details</span>
                      </div>
                      <div>
                        <label className="block text-[6.5px] font-black tracking-[0.2em] mb-2 text-neutral-400 uppercase">Location Type</label>
                        <div className="flex gap-2">
                          {["HOME", "OFFICE", "OTHER"].map((t) => (
                            <button key={t} type="button" onClick={() => setAddressForm({ ...addressForm, type: t })}
                              className={`flex-1 py-2 text-[8px] font-extrabold tracking-[0.2em] uppercase border transition-colors cursor-pointer ${
                                addressForm.type === t ? "bg-[#030213] text-white border-[#030213]" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
                              }`}>{t}</button>
                          ))}
                        </div>
                      </div>
                      {addressForm.type === "OTHER" && (
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Location Name</label>
                          <input type="text" required placeholder="e.g. Studio, Warehouse" value={addressForm.otherName}
                            onChange={(e) => setAddressForm({ ...addressForm, otherName: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">First Name</label>
                          <input type="text" required placeholder="First Name" value={addressForm.firstName}
                            onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Last Name</label>
                          <input type="text" required placeholder="Last Name" value={addressForm.lastName}
                            onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Building No.</label>
                          <input type="text" required placeholder="Building No." value={addressForm.buildingNo}
                            onChange={(e) => setAddressForm({ ...addressForm, buildingNo: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Building Name</label>
                          <input type="text" required placeholder="Building Name" value={addressForm.buildingName}
                            onChange={(e) => setAddressForm({ ...addressForm, buildingName: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Street / Locality</label>
                        <input type="text" required placeholder="Street name & locality" value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">City</label>
                          <input type="text" required placeholder="City" value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">State</label>
                          <input type="text" required placeholder="State" value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Pincode</label>
                          <input type="text" required placeholder="Pincode" value={addressForm.postalCode}
                            onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Delivery Phone</label>
                        <input type="tel" required placeholder="Phone number for this address" value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="makeDefault" checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="accent-[#030213]" />
                        <label htmlFor="makeDefault" className="text-[7.5px] font-extrabold text-neutral-500 uppercase cursor-pointer tracking-wider">Set as default shipping address</label>
                      </div>
                      <div className="flex gap-3 pt-1">
                        <button type="submit"
                          className="bg-[#030213] hover:bg-neutral-800 text-white text-[8px] font-extrabold tracking-widest px-6 py-2.5 uppercase transition-colors cursor-pointer">
                          {editingAddressId ? "Save Changes" : "Add Address"}
                        </button>
                        <button type="button" onClick={() => setIsFormOpen(false)}
                          className="bg-transparent text-neutral-500 hover:text-[#030213] text-[8px] font-extrabold tracking-widest px-6 py-2.5 uppercase border border-neutral-200 transition-colors cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      {activeAddress ? (
                        <div className="border border-neutral-200 bg-white p-5 relative">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-1.5">
                              {activeAddress.type === "HOME" ? <Home className="h-3.5 w-3.5 text-[#030213]" /> : activeAddress.type === "OFFICE" ? <Briefcase className="h-3.5 w-3.5 text-[#030213]" /> : <MapPin className="h-3.5 w-3.5 text-[#030213]" />}
                              <span className="text-[7.5px] font-black tracking-widest text-[#030213] uppercase">{activeAddress.type}</span>
                              {activeAddress.isDefault && <span className="bg-[#030213] text-white text-[6.5px] font-black tracking-wider px-1.5 py-0.5 uppercase">Default</span>}
                            </div>
                            <span className="text-[7px] font-black text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-1">
                              <Check className="h-2.5 w-2.5 stroke-[3]" /> Selected
                            </span>
                          </div>
                          <div className="text-[10px] leading-relaxed text-neutral-600 font-bold uppercase tracking-wider">
                            <p className="font-extrabold text-[#030213] text-[11px] mb-1">{activeAddress.firstName} {activeAddress.lastName}</p>
                            <p>{activeAddress.buildingNo && `${activeAddress.buildingNo}, `}{activeAddress.buildingName && `${activeAddress.buildingName}, `}{activeAddress.street}</p>
                            <p>{activeAddress.area}</p>
                            <p>{activeAddress.city}, {activeAddress.state} — {activeAddress.postalCode}</p>
                            <p className="text-[7.5px] font-extrabold text-[#030213] mt-2 tracking-widest">PH: {activeAddress.phone}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-dashed border-neutral-300 p-8 text-center bg-white">
                          <MapPin className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                          <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">No address selected</p>
                        </div>
                      )}
                  {isFormOpen ? (
                    <form onSubmit={handleSaveAddress} className="bg-neutral-50/50 border border-neutral-200 p-5 space-y-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[9px] font-black tracking-[0.2em] text-[#030213] uppercase">{editingAddressId ? "Edit Destination" : "New Destination"}</h4>
                        <span className="text-[7px] text-neutral-400 font-medium">Fulfilment details</span>
                      </div>
                      <div>
                        <label className="block text-[6.5px] font-black tracking-[0.2em] mb-2 text-neutral-400 uppercase">Location Type</label>
                        <div className="flex gap-2">
                          {["HOME", "OFFICE", "OTHER"].map((t) => (
                            <button key={t} type="button" onClick={() => setAddressForm({ ...addressForm, type: t })}
                              className={`flex-1 py-2 text-[8px] font-extrabold tracking-[0.2em] uppercase border transition-colors cursor-pointer ${
                                addressForm.type === t ? "bg-[#030213] text-white border-[#030213]" : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
                              }`}>{t}</button>
                          ))}
                        </div>
                      </div>
                      {addressForm.type === "OTHER" && (
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Location Name</label>
                          <input type="text" required placeholder="e.g. Studio, Warehouse" value={addressForm.otherName}
                            onChange={(e) => setAddressForm({ ...addressForm, otherName: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">First Name</label>
                          <input type="text" required placeholder="First Name" value={addressForm.firstName}
                            onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Last Name</label>
                          <input type="text" required placeholder="Last Name" value={addressForm.lastName}
                            onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Building No.</label>
                          <input type="text" required placeholder="Building No." value={addressForm.buildingNo}
                            onChange={(e) => setAddressForm({ ...addressForm, buildingNo: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Building Name</label>
                          <input type="text" required placeholder="Building Name" value={addressForm.buildingName}
                            onChange={(e) => setAddressForm({ ...addressForm, buildingName: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Street / Locality</label>
                        <input type="text" required placeholder="Street name & locality" value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">City</label>
                          <input type="text" required placeholder="City" value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">State</label>
                          <input type="text" required placeholder="State" value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                        <div>
                          <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Pincode</label>
                          <input type="text" required placeholder="Pincode" value={addressForm.postalCode}
                            onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                            className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[6.5px] font-black tracking-[0.2em] mb-1 text-neutral-400 uppercase">Delivery Phone</label>
                        <input type="tel" required placeholder="Phone number for this address" value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-[10px] font-bold focus:outline-none focus:border-[#030213] uppercase" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="makeDefault" checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="accent-[#030213]" />
                        <label htmlFor="makeDefault" className="text-[7.5px] font-extrabold text-neutral-500 uppercase cursor-pointer tracking-wider">Set as default shipping address</label>
                      </div>
                      <div className="flex gap-3 pt-1">
                        <button type="submit"
                          className="bg-[#030213] hover:bg-neutral-800 text-white text-[8px] font-extrabold tracking-widest px-6 py-2.5 uppercase transition-colors cursor-pointer">
                          {editingAddressId ? "Save Changes" : "Add Address"}
                        </button>
                        <button type="button" onClick={() => setIsFormOpen(false)}
                          className="bg-transparent text-neutral-500 hover:text-[#030213] text-[8px] font-extrabold tracking-widest px-6 py-2.5 uppercase border border-neutral-200 transition-colors cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      {activeAddress ? (
                        <div className="border border-neutral-200 bg-white p-5 relative">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-1.5">
                              {activeAddress.type === "HOME" ? <Home className="h-3.5 w-3.5 text-[#030213]" /> : activeAddress.type === "OFFICE" ? <Briefcase className="h-3.5 w-3.5 text-[#030213]" /> : <MapPin className="h-3.5 w-3.5 text-[#030213]" />}
                              <span className="text-[7.5px] font-black tracking-widest text-[#030213] uppercase">{activeAddress.type}</span>
                              {activeAddress.isDefault && <span className="bg-[#030213] text-white text-[6.5px] font-black tracking-wider px-1.5 py-0.5 uppercase">Default</span>}
                            </div>
                            <span className="text-[7px] font-black text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-1">
                              <Check className="h-2.5 w-2.5 stroke-[3]" /> Selected
                            </span>
                          </div>
                          <div className="text-[10px] leading-relaxed text-neutral-600 font-bold uppercase tracking-wider">
                            <p className="font-extrabold text-[#030213] text-[11px] mb-1">{activeAddress.firstName} {activeAddress.lastName}</p>
                            <p>{activeAddress.buildingNo && `${activeAddress.buildingNo}, `}{activeAddress.buildingName && `${activeAddress.buildingName}, `}{activeAddress.street}</p>
                            <p>{activeAddress.area}</p>
                            <p>{activeAddress.city}, {activeAddress.state} — {activeAddress.postalCode}</p>
                            <p className="text-[7.5px] font-extrabold text-[#030213] mt-2 tracking-widest">PH: {activeAddress.phone}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-dashed border-neutral-300 p-8 text-center bg-white">
                          <MapPin className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                          <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">No address selected</p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2.5">
                        {addresses.length > 1 && (
                          <button type="button" onClick={() => setShowAddressSelectorModal(true)}
                            className="border border-[#030213] hover:bg-neutral-50 text-[#030213] text-[8px] font-extrabold tracking-widest px-4 py-2.5 uppercase transition-all cursor-pointer bg-white">
                            Choose Other Address
                          </button>
                        )}
                        <button type="button" onClick={handleOpenAddForm}
                          className="border border-neutral-300 hover:border-[#030213] text-[#b2533e] text-[8px] font-extrabold tracking-widest px-4 py-2.5 uppercase transition-all cursor-pointer bg-white flex items-center gap-1.5">
                          <Plus className="h-3 w-3 stroke-[2]" /> Add New Address
                        </button>
                        <Link to="/account#addresses"
                          className="text-[8px] font-extrabold tracking-widest text-[#030213] hover:underline uppercase ml-auto">
                          Manage in Account
                        </Link>
                      </div>
                    </div>
                  )}
                      <div className="flex flex-wrap items-center gap-2.5">
                        {addresses.length > 1 && (
                          <button type="button" onClick={() => setShowAddressSelectorModal(true)}
                            className="border border-[#030213] hover:bg-neutral-50 text-[#030213] text-[8px] font-extrabold tracking-widest px-4 py-2.5 uppercase transition-all cursor-pointer bg-white">
                            Choose Other Address
                          </button>
                        )}
                        <button type="button" onClick={handleOpenAddForm}
                          className="border border-neutral-300 hover:border-[#030213] text-[#b2533e] text-[8px] font-extrabold tracking-widest px-4 py-2.5 uppercase transition-all cursor-pointer bg-white flex items-center gap-1.5">
                          <Plus className="h-3 w-3 stroke-[2]" /> Add New Address
                        </button>
                        <Link to="/account#addresses"
                          className="text-[8px] font-extrabold tracking-widest text-[#030213] hover:underline uppercase ml-auto">
                          Manage in Account
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Address selector modal */}
                  {showAddressSelectorModal && (
                    <div className="fixed inset-0 bg-[#030213]/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowAddressSelectorModal(false)}>
                      <div className="bg-white border border-neutral-200 p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-5">
                          <h3 className="text-[10px] font-black tracking-[0.2em] text-[#030213] uppercase flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Select Delivery Destination
                          </h3>
                          <button onClick={() => setShowAddressSelectorModal(false)} className="text-neutral-400 hover:text-black bg-transparent border-none cursor-pointer">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {addresses.map((addr) => {
                            const isSel = selectedAddressId === addr.id;
                            return (
                              <div key={addr.id} onClick={() => { setSelectedAddressId(addr.id); setShowAddressSelectorModal(false); }}
                                className={`relative p-4 border cursor-pointer transition-all ${
                                  isSel ? "border-2 border-[#030213] bg-[#FAF8F5] shadow-sm" : "border border-neutral-200 bg-white hover:border-neutral-400"
                                }`}>
                                <div className="flex items-center gap-1.5 mb-2.5">
                                  {addr.type === "HOME" ? <Home className="h-3 w-3 text-neutral-500" /> : addr.type === "OFFICE" ? <Briefcase className="h-3 w-3 text-neutral-500" /> : <MapPin className="h-3 w-3 text-neutral-500" />}
                                  <span className="text-[7px] font-black tracking-widest text-[#b2533e] uppercase">{addr.type}</span>
                                  {addr.isDefault && <span className="bg-[#030213] text-white text-[6.5px] font-black tracking-wider px-1.5 py-0.5 uppercase">Default</span>}
                                </div>
                                <div className="text-[9px] leading-relaxed text-neutral-600 font-bold uppercase tracking-wider">
                                  <p className="font-extrabold text-[#030213] text-[10px] mb-1">{addr.firstName} {addr.lastName}</p>
                                  <p>{addr.buildingNo && `${addr.buildingNo}, `}{addr.buildingName && `${addr.buildingName}, `}{addr.street}</p>
                                  <p>{addr.city}, {addr.state} — {addr.postalCode}</p>
                                  <p className="text-[7px] font-extrabold text-[#b2533e] mt-1.5">PH: {addr.phone}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </SummaryCard>

                {/* Continue button */}
                <button onClick={handleContinueToDelivery}
                  className="w-full bg-[#030213] hover:bg-neutral-800 text-white py-4 text-[10px] font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 uppercase cursor-pointer border-none">
                  Continue to Delivery <ChevronRight className="h-3.5 w-3.5 stroke-[2]" />
                </button>
              </div>
                  {/* Address selector modal */}
                  {showAddressSelectorModal && (
                    <div className="fixed inset-0 bg-[#030213]/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowAddressSelectorModal(false)}>
                      <div className="bg-white border border-neutral-200 p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-5">
                          <h3 className="text-[10px] font-black tracking-[0.2em] text-[#030213] uppercase flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Select Delivery Destination
                          </h3>
                          <button onClick={() => setShowAddressSelectorModal(false)} className="text-neutral-400 hover:text-black bg-transparent border-none cursor-pointer">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {addresses.map((addr) => {
                            const isSel = selectedAddressId === addr.id;
                            return (
                              <div key={addr.id} onClick={() => { setSelectedAddressId(addr.id); setShowAddressSelectorModal(false); }}
                                className={`relative p-4 border cursor-pointer transition-all ${
                                  isSel ? "border-2 border-[#030213] bg-[#FAF8F5] shadow-sm" : "border border-neutral-200 bg-white hover:border-neutral-400"
                                }`}>
                                <div className="flex items-center gap-1.5 mb-2.5">
                                  {addr.type === "HOME" ? <Home className="h-3 w-3 text-neutral-500" /> : addr.type === "OFFICE" ? <Briefcase className="h-3 w-3 text-neutral-500" /> : <MapPin className="h-3 w-3 text-neutral-500" />}
                                  <span className="text-[7px] font-black tracking-widest text-[#b2533e] uppercase">{addr.type}</span>
                                  {addr.isDefault && <span className="bg-[#030213] text-white text-[6.5px] font-black tracking-wider px-1.5 py-0.5 uppercase">Default</span>}
                                </div>
                                <div className="text-[9px] leading-relaxed text-neutral-600 font-bold uppercase tracking-wider">
                                  <p className="font-extrabold text-[#030213] text-[10px] mb-1">{addr.firstName} {addr.lastName}</p>
                                  <p>{addr.buildingNo && `${addr.buildingNo}, `}{addr.buildingName && `${addr.buildingName}, `}{addr.street}</p>
                                  <p>{addr.city}, {addr.state} — {addr.postalCode}</p>
                                  <p className="text-[7px] font-extrabold text-[#b2533e] mt-1.5">PH: {addr.phone}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </SummaryCard>

                {/* Continue button */}
                <button onClick={handleContinueToDelivery}
                  className="w-full bg-[#030213] hover:bg-neutral-800 text-white py-4 text-[10px] font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 uppercase cursor-pointer border-none">
                  Continue to Delivery <ChevronRight className="h-3.5 w-3.5 stroke-[2]" />
                </button>
              </div>
            )}

            {/* ——— STEP 2 — DELIVERY ——— */}
            {/* ——— STEP 2 — DELIVERY ——— */}
            {step === 2 && activeAddress && (
              <div className="space-y-8">
                {/* Recap */}
                <SummaryCard>
                  <RecapRow label="Contact" value={`${email} | ${phone}`} onEdit={() => setStep(1)} />
                  <div className="mt-1" />
                  <RecapRow label="Destination"
                    value={`${activeAddress.firstName} ${activeAddress.lastName}, ${activeAddress.buildingNo ? `${activeAddress.buildingNo}, ` : ""}${activeAddress.buildingName ? `${activeAddress.buildingName}, ` : ""}${activeAddress.street}${activeAddress.area ? `, ${activeAddress.area}` : ""}, ${activeAddress.city}, ${activeAddress.state} — ${activeAddress.postalCode}`}
                    onEdit={() => setStep(1)} />
                </SummaryCard>

                {/* Delivery method */}
                <SummaryCard>
                  <SectionHeading icon={Truck} label="Delivery Method" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MethodCard title="Standard Delivery" subtitle="3 — 5 Working Days"
                      price={deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(0)}`} badge="Recommended"
                      isSelected={shippingMethod === "standard"} onSelect={() => setShippingMethod("standard")}>
                      <div className="flex items-center gap-3 text-[7.5px] text-neutral-400 font-medium">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 stroke-[1.5]" /> Tracked Dispatch</span>
                        <span className="flex items-center gap-1"><Check className="h-3 w-3 stroke-[1.5]" /> COD Eligible</span>
                      </div>
                    </MethodCard>
                    <MethodCard title="Express Shipping" subtitle="Next Working Day" price="₹150" badge="Fastest"
                      isSelected={shippingMethod === "express"} onSelect={() => setShippingMethod("express")}>
                      <div className="flex items-center gap-3 text-[7.5px] text-neutral-400 font-medium">
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3 stroke-[1.5]" /> Priority Dispatch</span>
                        <span className="flex items-center gap-1"><Check className="h-3 w-3 stroke-[1.5]" /> COD Eligible</span>
                      </div>
                    </MethodCard>
                  </div>
                </SummaryCard>

                {/* Navigation */}
                <div className="flex flex-col md:flex-row gap-3">
                  <button onClick={() => setStep(1)}
                    className="w-full md:w-1/3 border border-neutral-200 hover:bg-neutral-50 bg-white text-neutral-500 py-3.5 text-[9px] font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                    <ArrowLeft className="h-3 w-3 stroke-[2]" /> Back to Info
                  </button>
                  <button onClick={handleContinueToReview}
                    className="w-full md:w-2/3 bg-[#030213] hover:bg-neutral-800 text-white py-3.5 text-[9px] font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 uppercase cursor-pointer border-none">
                    Continue to Review <ChevronRight className="h-3.5 w-3.5 stroke-[2]" />
                  </button>
                </div>
              </div>
              <div className="space-y-8">
                {/* Recap */}
                <SummaryCard>
                  <RecapRow label="Contact" value={`${email} | ${phone}`} onEdit={() => setStep(1)} />
                  <div className="mt-1" />
                  <RecapRow label="Destination"
                    value={`${activeAddress.firstName} ${activeAddress.lastName}, ${activeAddress.buildingNo ? `${activeAddress.buildingNo}, ` : ""}${activeAddress.buildingName ? `${activeAddress.buildingName}, ` : ""}${activeAddress.street}${activeAddress.area ? `, ${activeAddress.area}` : ""}, ${activeAddress.city}, ${activeAddress.state} — ${activeAddress.postalCode}`}
                    onEdit={() => setStep(1)} />
                </SummaryCard>

                {/* Delivery method */}
                <SummaryCard>
                  <SectionHeading icon={Truck} label="Delivery Method" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MethodCard title="Standard Delivery" subtitle="3 — 5 Working Days"
                      price={deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(0)}`} badge="Recommended"
                      isSelected={shippingMethod === "standard"} onSelect={() => setShippingMethod("standard")}>
                      <div className="flex items-center gap-3 text-[7.5px] text-neutral-400 font-medium">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 stroke-[1.5]" /> Tracked Dispatch</span>
                        <span className="flex items-center gap-1"><Check className="h-3 w-3 stroke-[1.5]" /> COD Eligible</span>
                      </div>
                    </MethodCard>
                    <MethodCard title="Express Shipping" subtitle="Next Working Day" price="₹150" badge="Fastest"
                      isSelected={shippingMethod === "express"} onSelect={() => setShippingMethod("express")}>
                      <div className="flex items-center gap-3 text-[7.5px] text-neutral-400 font-medium">
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3 stroke-[1.5]" /> Priority Dispatch</span>
                        <span className="flex items-center gap-1"><Check className="h-3 w-3 stroke-[1.5]" /> COD Eligible</span>
                      </div>
                    </MethodCard>
                  </div>
                </SummaryCard>

                {/* Navigation */}
                <div className="flex flex-col md:flex-row gap-3">
                  <button onClick={() => setStep(1)}
                    className="w-full md:w-1/3 border border-neutral-200 hover:bg-neutral-50 bg-white text-neutral-500 py-3.5 text-[9px] font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                    <ArrowLeft className="h-3 w-3 stroke-[2]" /> Back to Info
                  </button>
                  <button onClick={handleContinueToReview}
                    className="w-full md:w-2/3 bg-[#030213] hover:bg-neutral-800 text-white py-3.5 text-[9px] font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 uppercase cursor-pointer border-none">
                    Continue to Review <ChevronRight className="h-3.5 w-3.5 stroke-[2]" />
                  </button>
                </div>
              </div>
            )}

            {/* ——— STEP 3 — REVIEW & CONFIRM ——— */}
            {/* ——— STEP 3 — REVIEW & CONFIRM ——— */}
            {step === 3 && activeAddress && (
              <div className="space-y-8">
                {/* Order Summary Review */}
                <SummaryCard>
                  <SectionHeading icon={CheckCircle2} label="Order Review" />
                  <div className="space-y-1">
                    <RecapRow label="Contact" value={`${email} | ${phone}`} onEdit={() => setStep(1)} />
                    <RecapRow label="Ship To"
                      value={`${activeAddress.firstName} ${activeAddress.lastName}, ${activeAddress.buildingNo ? `${activeAddress.buildingNo}, ` : ""}${activeAddress.buildingName ? `${activeAddress.buildingName}, ` : ""}${activeAddress.street}${activeAddress.area ? `, ${activeAddress.area}` : ""}, ${activeAddress.city}, ${activeAddress.state} — ${activeAddress.postalCode}`}
                      onEdit={() => setStep(1)} />
                    <RecapRow label="Method"
                      value={shippingMethod === "express" ? "Express Shipping — ₹150" : `Standard Delivery — ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}`}
                      onEdit={() => setStep(2)} />
                  </div>
                </SummaryCard>
              <div className="space-y-8">
                {/* Order Summary Review */}
                <SummaryCard>
                  <SectionHeading icon={CheckCircle2} label="Order Review" />
                  <div className="space-y-1">
                    <RecapRow label="Contact" value={`${email} | ${phone}`} onEdit={() => setStep(1)} />
                    <RecapRow label="Ship To"
                      value={`${activeAddress.firstName} ${activeAddress.lastName}, ${activeAddress.buildingNo ? `${activeAddress.buildingNo}, ` : ""}${activeAddress.buildingName ? `${activeAddress.buildingName}, ` : ""}${activeAddress.street}${activeAddress.area ? `, ${activeAddress.area}` : ""}, ${activeAddress.city}, ${activeAddress.state} — ${activeAddress.postalCode}`}
                      onEdit={() => setStep(1)} />
                    <RecapRow label="Method"
                      value={shippingMethod === "express" ? "Express Shipping — ₹150" : `Standard Delivery — ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}`}
                      onEdit={() => setStep(2)} />
                  </div>
                </SummaryCard>

                {/* Cart Items Review */}
                <SummaryCard>
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="h-3.5 w-3.5 text-[#030213] stroke-[1.5]" />
                    <span className="text-[9px] font-black tracking-[0.25em] text-[#030213] uppercase">Items ({totalItemCount})</span>
                  </div>
                  <div className="space-y-3 divide-y divide-neutral-100">
                    {cartItems.map((item, idx) => (
                      <div key={`review-${item.id}-${idx}`} className="flex gap-3 items-start pt-3 first:pt-0">
                        <div className="w-10 h-13 aspect-[3/4] overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200/40">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[6.5px] font-extrabold tracking-widest text-[#b2533e] uppercase block">{item.brand}</span>
                          <h4 className="text-[10px] font-extrabold text-neutral-900 truncate uppercase mt-0.5">{item.name}</h4>
                          <p className="text-[7.5px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Qty: {item.quantity} · {item.size} · {item.color}</p>
                        </div>
                        <span className="text-[10px] font-extrabold text-neutral-950 flex-shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </SummaryCard>

                {/* Payment Info (COD) */}
                <SummaryCard>
                  <SectionHeading icon={CreditCard} label="Payment Method" />
                  <div className="border-2 border-[#030213] bg-[#FAF8F5] p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0">
                        <div className="h-3 w-3 bg-[#030213]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-[11px] font-extrabold tracking-[0.05em] text-[#030213] uppercase">Cash on Delivery (COD)</h4>
                          <span className="text-[6.5px] font-black tracking-[0.2em] text-green-700 bg-green-50 border border-green-200/60 px-2 py-0.5 uppercase">Selected</span>
                        </div>
                        <p className="text-[9px] text-neutral-500 leading-relaxed font-medium">
                          Pay with cash upon delivery. Please keep the exact amount of{" "}
                          <span className="font-extrabold text-[#030213]">₹{Math.max(0, total).toFixed(0)}</span> ready.
                        </p>
                        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-4 text-[7.5px] text-neutral-400 font-medium">
                          <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 stroke-[1.5]" /> Pay at doorstep</span>
                          <span className="flex items-center gap-1"><Check className="h-3 w-3 stroke-[1.5]" /> No extra charges</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200/60">
                      <p className="text-[7.5px] font-extrabold tracking-widest text-green-700 uppercase flex items-center gap-1">
                        <Check className="h-3 w-3 stroke-[2]" /> Promo {appliedPromo} applied — saving ₹{promoDiscount.toFixed(0)}
                      </p>
                    </div>
                  )}
                </SummaryCard>
                {/* Cart Items Review */}
                <SummaryCard>
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="h-3.5 w-3.5 text-[#030213] stroke-[1.5]" />
                    <span className="text-[9px] font-black tracking-[0.25em] text-[#030213] uppercase">Items ({totalItemCount})</span>
                  </div>
                  <div className="space-y-3 divide-y divide-neutral-100">
                    {cartItems.map((item, idx) => (
                      <div key={`review-${item.id}-${idx}`} className="flex gap-3 items-start pt-3 first:pt-0">
                        <div className="w-10 h-13 aspect-[3/4] overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200/40">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[6.5px] font-extrabold tracking-widest text-[#b2533e] uppercase block">{item.brand}</span>
                          <h4 className="text-[10px] font-extrabold text-neutral-900 truncate uppercase mt-0.5">{item.name}</h4>
                          <p className="text-[7.5px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Qty: {item.quantity} · {item.size} · {item.color}</p>
                        </div>
                        <span className="text-[10px] font-extrabold text-neutral-950 flex-shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </SummaryCard>

                {/* Payment Info (COD) */}
                <SummaryCard>
                  <SectionHeading icon={CreditCard} label="Payment Method" />
                  <div className="border-2 border-[#030213] bg-[#FAF8F5] p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0">
                        <div className="h-3 w-3 bg-[#030213]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-[11px] font-extrabold tracking-[0.05em] text-[#030213] uppercase">Cash on Delivery (COD)</h4>
                          <span className="text-[6.5px] font-black tracking-[0.2em] text-green-700 bg-green-50 border border-green-200/60 px-2 py-0.5 uppercase">Selected</span>
                        </div>
                        <p className="text-[9px] text-neutral-500 leading-relaxed font-medium">
                          Pay with cash upon delivery. Please keep the exact amount of{" "}
                          <span className="font-extrabold text-[#030213]">₹{Math.max(0, total).toFixed(0)}</span> ready.
                        </p>
                        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-4 text-[7.5px] text-neutral-400 font-medium">
                          <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 stroke-[1.5]" /> Pay at doorstep</span>
                          <span className="flex items-center gap-1"><Check className="h-3 w-3 stroke-[1.5]" /> No extra charges</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200/60">
                      <p className="text-[7.5px] font-extrabold tracking-widest text-green-700 uppercase flex items-center gap-1">
                        <Check className="h-3 w-3 stroke-[2]" /> Promo {appliedPromo} applied — saving ₹{promoDiscount.toFixed(0)}
                      </p>
                    </div>
                  )}
                </SummaryCard>

                <p className="text-[7.5px] text-neutral-400 font-medium tracking-wide leading-relaxed">
                  By placing this order, you confirm that your shipping and payment details are accurate. Your order will be processed upon confirmation.
                </p>
                <p className="text-[7.5px] text-neutral-400 font-medium tracking-wide leading-relaxed">
                  By placing this order, you confirm that your shipping and payment details are accurate. Your order will be processed upon confirmation.
                </p>

                {orderSubmitError && (
                  <div className="bg-red-50 border border-red-200 text-red-650 p-3.5 text-[9px] font-[900] uppercase tracking-widest text-center">
                    {orderSubmitError}
                  </div>
                )}

                <form onSubmit={handleSubmitOrder} className="flex flex-col md:flex-row gap-3">
                  <button type="button" onClick={() => setStep(2)} disabled={isSubmittingOrder}
                    className="w-full md:w-1/3 border border-neutral-200 hover:bg-neutral-50 bg-white text-neutral-500 py-3.5 text-[9px] font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40">
                    <ArrowLeft className="h-3 w-3 stroke-[2]" /> Back to Delivery
                  </button>
                  <button type="submit" disabled={isSubmittingOrder}
                    className="w-full md:w-2/3 bg-[#030213] hover:bg-neutral-800 text-white py-3.5 text-[9px] font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 uppercase cursor-pointer border-none disabled:opacity-50">
                    {isSubmittingOrder ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 stroke-[2]" /> Confirm & Place Order
                        <span className="text-white/70 font-bold text-[10px]">(₹{Math.max(0, total).toFixed(0)})</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
                {orderSubmitError && (
                  <div className="bg-red-50 border border-red-200 text-red-650 p-3.5 text-[9px] font-[900] uppercase tracking-widest text-center">
                    {orderSubmitError}
                  </div>
                )}

                <form onSubmit={handleSubmitOrder} className="flex flex-col md:flex-row gap-3">
                  <button type="button" onClick={() => setStep(2)} disabled={isSubmittingOrder}
                    className="w-full md:w-1/3 border border-neutral-200 hover:bg-neutral-50 bg-white text-neutral-500 py-3.5 text-[9px] font-extrabold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40">
                    <ArrowLeft className="h-3 w-3 stroke-[2]" /> Back to Delivery
                  </button>
                  <button type="submit" disabled={isSubmittingOrder}
                    className="w-full md:w-2/3 bg-[#030213] hover:bg-neutral-800 text-white py-3.5 text-[9px] font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 uppercase cursor-pointer border-none disabled:opacity-50">
                    {isSubmittingOrder ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 stroke-[2]" /> Confirm & Place Order
                        <span className="text-white/70 font-bold text-[10px]">(₹{Math.max(0, total).toFixed(0)})</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* ======= RIGHT COLUMN — Order Summary ======= */}
          <div className="lg:col-span-4 space-y-5 sticky top-24">
            {/* Cart Items */}
            <SummaryCard>
              <h2 className="text-[9px] font-extrabold tracking-[0.2em] pb-3 border-b border-neutral-200/60 uppercase flex items-center justify-between">
                Your Cart Items
                <span className="text-[7px] font-bold text-neutral-400 tracking-wider">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
              </h2>
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 mt-3 divide-y divide-neutral-100">
                {cartItems.map((item, idx) => (
                  <div key={item.id + "-" + idx} className="flex gap-3 items-start pt-3 first:pt-0">
                    <div className="w-11 aspect-[3/4] overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200/40">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[6.5px] font-extrabold tracking-widest text-[#b2533e] uppercase block">{item.brand}</span>
                      <h4 className="text-[9px] font-extrabold text-neutral-900 truncate uppercase mt-0.5 leading-tight">{item.name}</h4>
                      <p className="text-[7.5px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Qty: {item.quantity} | {item.size} | {item.color}</p>
                      <span className="text-[9px] font-extrabold text-neutral-950 mt-0.5 block">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SummaryCard>

            {/* Available Coupon Banners */}
            {!appliedPromo && availableCheckoutCoupons.length > 0 && (
              <div className="space-y-2">
                <span className="block text-[6.5px] font-black tracking-[0.25em] text-neutral-400 uppercase px-0.5">Offers</span>
                {availableCheckoutCoupons.slice(0, 3).map((cpn: any) => (
                  <button key={cpn.id || cpn.code}
                    onClick={() => { setPromoInput(cpn.code); setPromoError(null); }}
                    className="w-full text-left bg-gradient-to-r from-[#224870] to-[#1a3650] p-3 border-none cursor-pointer hover:brightness-110 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="bg-white text-[#224870] font-black text-[7.5px] px-2 py-0.5 uppercase tracking-widest">{cpn.code}</span>
                          <span className="text-white/50 text-[6px] font-bold uppercase tracking-widest">
                            {cpn.discountType === "percentage" ? `${cpn.discountValue}% OFF` : cpn.discountType === "freeship" ? "FREE SHIPPING" : `FLAT ₹${cpn.discountValue}`}
                          </span>
                        </div>
                        <p className="text-white/70 text-[7px] font-medium tracking-wide leading-tight">
                          {cpn.description || (cpn.discountType === "percentage"
                            ? `Save ${cpn.discountValue}% on your order`
                            : cpn.discountType === "freeship"
                            ? `Free shipping on orders above ₹${(cpn.minOrder || 0).toLocaleString("en-IN")}`
                            : `Flat ₹${cpn.discountValue} off on orders above ₹${(cpn.minOrder || 0).toLocaleString("en-IN")}`
                          )}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-[6px] font-extrabold tracking-widest text-white/50 uppercase underline underline-offset-2 group-hover:text-white/80 transition-colors">APPLY</span>
                    </div>
                  </button>
                ))}
          {/* ======= RIGHT COLUMN — Order Summary ======= */}
          <div className="lg:col-span-4 space-y-5 sticky top-24">
            {/* Cart Items */}
            <SummaryCard>
              <h2 className="text-[9px] font-extrabold tracking-[0.2em] pb-3 border-b border-neutral-200/60 uppercase flex items-center justify-between">
                Your Cart Items
                <span className="text-[7px] font-bold text-neutral-400 tracking-wider">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
              </h2>
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 mt-3 divide-y divide-neutral-100">
                {cartItems.map((item, idx) => (
                  <div key={item.id + "-" + idx} className="flex gap-3 items-start pt-3 first:pt-0">
                    <div className="w-11 aspect-[3/4] overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200/40">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[6.5px] font-extrabold tracking-widest text-[#b2533e] uppercase block">{item.brand}</span>
                      <h4 className="text-[9px] font-extrabold text-neutral-900 truncate uppercase mt-0.5 leading-tight">{item.name}</h4>
                      <p className="text-[7.5px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Qty: {item.quantity} | {item.size} | {item.color}</p>
                      <span className="text-[9px] font-extrabold text-neutral-950 mt-0.5 block">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SummaryCard>

            {/* Available Coupon Banners */}
            {!appliedPromo && availableCheckoutCoupons.length > 0 && (
              <div className="space-y-2">
                <span className="block text-[6.5px] font-black tracking-[0.25em] text-neutral-400 uppercase px-0.5">Offers</span>
                {availableCheckoutCoupons.slice(0, 3).map((cpn: any) => (
                  <button key={cpn.id || cpn.code}
                    onClick={() => { setPromoInput(cpn.code); setPromoError(null); }}
                    className="w-full text-left bg-gradient-to-r from-[#224870] to-[#1a3650] p-3 border-none cursor-pointer hover:brightness-110 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="bg-white text-[#224870] font-black text-[7.5px] px-2 py-0.5 uppercase tracking-widest">{cpn.code}</span>
                          <span className="text-white/50 text-[6px] font-bold uppercase tracking-widest">
                            {cpn.discountType === "percentage" ? `${cpn.discountValue}% OFF` : cpn.discountType === "freeship" ? "FREE SHIPPING" : `FLAT ₹${cpn.discountValue}`}
                          </span>
                        </div>
                        <p className="text-white/70 text-[7px] font-medium tracking-wide leading-tight">
                          {cpn.description || (cpn.discountType === "percentage"
                            ? `Save ${cpn.discountValue}% on your order`
                            : cpn.discountType === "freeship"
                            ? `Free shipping on orders above ₹${(cpn.minOrder || 0).toLocaleString("en-IN")}`
                            : `Flat ₹${cpn.discountValue} off on orders above ₹${(cpn.minOrder || 0).toLocaleString("en-IN")}`
                          )}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-[6px] font-extrabold tracking-widest text-white/50 uppercase underline underline-offset-2 group-hover:text-white/80 transition-colors">APPLY</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Promo Code */}
            <SummaryCard>
              <span className="block text-[6.5px] font-black tracking-[0.25em] text-neutral-400 uppercase mb-2.5">Promo Code</span>
              <div className="flex gap-2">
                <input type="text" placeholder="ENTER COUPON CODE" value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value); setPromoError(null); }}
                  className="flex-1 border border-neutral-200 px-3 py-2 text-[8px] font-bold focus:outline-none focus:border-[#030213] uppercase tracking-widest bg-white" />
                <button type="button" onClick={applyPromoCode} disabled={isApplyingPromo}
                  className="bg-[#030213] hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-[8px] font-extrabold tracking-widest px-4 py-2 uppercase transition-colors cursor-pointer disabled:cursor-not-allowed border-none flex items-center gap-1.5">
                  {isApplyingPromo ? (
                    <><span className="inline-block h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Applying</>
                  ) : "Apply"}
                </button>
              </div>
              {promoError && <p className="text-[7.5px] font-extrabold text-red-600 uppercase mt-2 tracking-wider">{promoError}</p>}
            )}

            {/* Promo Code */}
            <SummaryCard>
              <span className="block text-[6.5px] font-black tracking-[0.25em] text-neutral-400 uppercase mb-2.5">Promo Code</span>
              <div className="flex gap-2">
                <input type="text" placeholder="ENTER COUPON CODE" value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value); setPromoError(null); }}
                  className="flex-1 border border-neutral-200 px-3 py-2 text-[8px] font-bold focus:outline-none focus:border-[#030213] uppercase tracking-widest bg-white" />
                <button type="button" onClick={applyPromoCode} disabled={isApplyingPromo}
                  className="bg-[#030213] hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-[8px] font-extrabold tracking-widest px-4 py-2 uppercase transition-colors cursor-pointer disabled:cursor-not-allowed border-none flex items-center gap-1.5">
                  {isApplyingPromo ? (
                    <><span className="inline-block h-3 w-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Applying</>
                  ) : "Apply"}
                </button>
              </div>
              {promoError && <p className="text-[7.5px] font-extrabold text-red-600 uppercase mt-2 tracking-wider">{promoError}</p>}
              {appliedPromo && (
                <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200/60 p-2.5">
                  <span className="text-[7.5px] font-extrabold tracking-wider text-green-700 uppercase">
                    <Check className="h-3 w-3 inline stroke-[2.5] mr-1" /> {appliedPromo} Applied
                  </span>
                  <button type="button" onClick={() => { setAppliedPromo(null); setPromoDiscount(0); localStorage.removeItem("appliedPromo"); localStorage.removeItem("promoDiscount"); }}
                    className="text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer text-[7.5px] font-black uppercase underline underline-offset-2">
                <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200/60 p-2.5">
                  <span className="text-[7.5px] font-extrabold tracking-wider text-green-700 uppercase">
                    <Check className="h-3 w-3 inline stroke-[2.5] mr-1" /> {appliedPromo} Applied
                  </span>
                  <button type="button" onClick={() => { setAppliedPromo(null); setPromoDiscount(0); localStorage.removeItem("appliedPromo"); localStorage.removeItem("promoDiscount"); }}
                    className="text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer text-[7.5px] font-black uppercase underline underline-offset-2">
                    Remove
                  </button>
                </div>
              )}
            </SummaryCard>
            </SummaryCard>

            {/* Price Breakdown */}
            <SummaryCard>
              <div className="space-y-2.5 text-[8.5px] font-bold tracking-wider text-neutral-600 uppercase">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-neutral-950">₹{subtotal.toFixed(0)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-extrabold">
                    <span>Promo ({appliedPromo})</span>
                    <span>-₹{promoDiscount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-extrabold text-neutral-950">₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className={`font-extrabold ${shippingCost === 0 ? "text-green-600" : "text-neutral-950"}`}>
                    {shippingCost > 0 ? `₹${shippingCost.toFixed(0)}` : "FREE"}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-2.5 flex justify-between text-[10px] font-extrabold text-neutral-950">
                  <span>Total</span>
                  <span className="text-sm font-extrabold">₹{Math.max(0, total).toFixed(0)}</span>
                </div>
              </div>
            </SummaryCard>

            {/* Secure Checkout */}
            <div className="bg-neutral-50/50 border border-neutral-200/50 p-4 flex gap-3 text-[7.5px] font-bold text-neutral-500 uppercase tracking-wide leading-relaxed">
              <ShieldCheck className="h-4 w-4 text-neutral-600 flex-shrink-0 stroke-[1.5]" />
              <div>
                <h5 className="font-black text-neutral-800 text-[8px] tracking-widest mb-0.5">Secure Checkout</h5>
                <h5 className="font-black text-neutral-800 text-[8px] tracking-widest mb-0.5">Secure Checkout</h5>
                <p>Your credentials and private data are encrypted under TLS standards during processing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
