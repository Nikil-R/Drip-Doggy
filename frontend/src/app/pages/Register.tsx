import { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { OtpVerificationStep } from "../components/auth/OtpVerificationStep";
import { User, Mail, Phone, ArrowRight } from "lucide-react";
import logoIcon from "../../assets/logo_icon.png";

type RegisterStep = "details" | "otp";

const BRAND_IMAGES = [
  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
];

export function Register() {
  const { isAuthenticated, requestRegisterOtp, verifyRegisterOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<RegisterStep>("details");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verifiedMethod, setVerifiedMethod] = useState<"email" | "phone" | null>(null);

  // Rotating background images
  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setBgIndex((prev) => (prev + 1) % BRAND_IMAGES.length);
        setIsFading(false);
      }, 1000);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number with at least 10 digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestRegisterOtp(form);
      if (!result.success) {
        setError(result.message ?? "Something went wrong.");
        setIsSubmitting(false);
        return;
      }
      setStep("otp");
      setOtp("");
      setResendTimer(30);
      setVerifiedMethod("email");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await requestRegisterOtp(form);
      setResendTimer(30);
      setOtp("");
    } catch {
      setError("Failed to resend. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await verifyRegisterOtp(form, otp);
      if (!result.success) {
        setError(result.message ?? "Invalid OTP.");
        setIsSubmitting(false);
        return;
      }
      navigate("/", { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDetails = () => {
    setStep("details");
    setError(null);
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 flex">
      {/* Left Panel — Brand Imagery */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-neutral-900">
        {BRAND_IMAGES.map((img, idx) => (
          <div key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              idx === bgIndex && !isFading ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${img})` }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-16 h-full">
          <div>
            <img src={logoIcon} alt="DRIP DOGGY" className="h-14 w-auto object-contain brightness-0 invert" />
          </div>
          <div className="space-y-4 max-w-md">
            <div className="h-px w-16 bg-white/40 mb-6" />
            <h2 className="text-4xl font-extrabold tracking-[0.05em] text-white leading-tight uppercase">
              Join the Syndicate
            </h2>
            <p className="text-sm text-white/70 tracking-wide leading-relaxed font-light">
              Create your DRIP DOGGY account and unlock exclusive access to limited drops, early releases, and a curated shopping experience.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              {["MEMBERS ONLY", "EARLY DROPS", "LIMITED EDITIONS"].map((feat) => (
                <span key={feat}
                  className="text-[9px] font-extrabold tracking-widest text-white/60 border border-white/20 px-3 py-1.5 uppercase">
                  {feat}
                </span>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-white/30 tracking-wider uppercase font-bold">
            SS26 Collection — Avant-Garde Streetwear
          </p>
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0 min-h-screen lg:min-h-0">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logoIcon} alt="DRIP DOGGY" className="h-12 w-auto object-contain mix-blend-multiply" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-[9px] font-extrabold tracking-[0.3em] text-neutral-400 uppercase">Register</span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>
            {step === "details" ? (
              <>
                <h1 className="text-3xl font-extrabold tracking-[0.05em] text-center uppercase">Create Account</h1>
                <p className="text-neutral-500 text-xs tracking-wide text-center mt-3 font-medium">
                  Fill in your details to join DRIP DOGGY
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-extrabold tracking-[0.05em] text-center uppercase">Confirm Your Account</h1>
                <p className="text-neutral-500 text-xs tracking-wide text-center mt-3 font-medium">
                  Enter the code sent to <span className="text-[#030213] font-bold">{form.email}</span>
                </p>
                {verifiedMethod && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-[8px] font-extrabold tracking-widest text-green-600 uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      Code sent via {verifiedMethod === "email" ? "email" : "SMS"}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Details Step */}
          {step === "details" && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <User className="h-3.5 w-3.5 stroke-[1.5]" />
                  </div>
                  <input type="text" id="firstName" required value={form.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                    placeholder="First name"
                    className="w-full bg-white border border-neutral-200 pl-9 pr-3.5 py-3 text-sm focus:outline-none focus:border-[#030213] transition-all duration-200 text-neutral-900 placeholder-neutral-400" />
                </div>
                <div>
                  <input type="text" id="lastName" required value={form.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                    placeholder="Last name"
                    className="w-full bg-white border border-neutral-200 px-3.5 py-3 text-sm focus:outline-none focus:border-[#030213] transition-all duration-200 text-neutral-900 placeholder-neutral-400" />
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                  <Mail className="h-3.5 w-3.5 stroke-[1.5]" />
                </div>
                <input type="email" id="email" required value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-white border border-neutral-200 pl-9 pr-3.5 py-3 text-sm focus:outline-none focus:border-[#030213] transition-all duration-200 text-neutral-900 placeholder-neutral-400" />
              </div>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                  <Phone className="h-3.5 w-3.5 stroke-[1.5]" />
                </div>
                <input type="tel" id="phone" required value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  placeholder="Phone number"
                  className="w-full bg-white border border-neutral-200 pl-9 pr-3.5 py-3 text-sm focus:outline-none focus:border-[#030213] transition-all duration-200 text-neutral-900 placeholder-neutral-400" />
              </div>

              {error && (
                <div className="bg-red-50/50 border border-red-200/50 px-4 py-3">
                  <p className="text-[11px] font-bold text-red-600 tracking-wider uppercase">{error}</p>
                </div>
              )}

              <button type="submit"
                disabled={isSubmitting || !form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()}
                className="group relative w-full bg-[#030213] text-white py-3.5 text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border-none cursor-pointer overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> SENDING OTP...</>
                  ) : (
                    <>CREATE ACCOUNT <ArrowRight className="h-3.5 w-3.5 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5" /></>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </form>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <OtpVerificationStep
              otp={otp}
              onOtpChange={setOtp}
              onSubmit={handleVerifyOtp}
              onBack={handleBackToDetails}
              onAutoFill={() => setOtp("123456")}
              isSubmitting={isSubmitting}
              error={error}
              showDevHelper={true}
              submitLabel="CONFIRM & CREATE ACCOUNT"
            />
          )}

          {/* OTP actions (resend + change) */}
          {step === "otp" && (
            <div className="mt-6 space-y-3 text-center">
              <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || isSubmitting}
                className="text-[10px] font-extrabold tracking-widest uppercase text-[#b2533e] hover:text-[#a04835] transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
              </button>
              <div>
                <button type="button" onClick={handleBackToDetails}
                  className="text-[9px] font-bold text-neutral-400 hover:text-neutral-600 underline underline-offset-2 bg-transparent border-none cursor-pointer">
                  Change details
                </button>
              </div>
            </div>
          )}

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-500 font-medium">
              Already have an account?{" "}
              <Link to="/login"
                className="text-[#030213] font-bold border-b border-[#030213] pb-0.5 hover:opacity-75 transition-opacity inline-flex items-center gap-1">
                Sign in <ArrowRight className="h-3 w-3 stroke-[2]" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
