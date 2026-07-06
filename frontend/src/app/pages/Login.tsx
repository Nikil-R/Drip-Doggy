import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { OtpVerificationStep } from "../components/auth/OtpVerificationStep";
import { Mail, Smartphone, ArrowRight, ShoppingBag } from "lucide-react";
import logoIcon from "../../assets/new_logo_icon.png";

type PortalStep = "identifier" | "otp";

const BRAND_IMAGES = [
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
];

export function Login() {
  const { isAuthenticated, requestOtp, verifyOtp, pendingIdentifier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<PortalStep>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verifiedMethod, setVerifiedMethod] = useState<"email" | "phone" | null>(null);

  const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const isCheckoutFlow = fromPath?.includes("checkout");

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

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (isAuthenticated) {
    return <Navigate to={fromPath || "/"} replace />;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await requestOtp(identifier);
      if (!result.success) {
        setError(result.message ?? "Something went wrong.");
        setIsSubmitting(false);
        return;
      }
      setStep("otp");
      setOtp("");
      setResendTimer(30);
      setVerifiedMethod(identifier.includes("@") ? "email" : "phone");
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
      await requestOtp(identifier);
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
      const result = await verifyOtp(identifier, otp);
      if (!result.success) {
        setError(result.message ?? "Invalid OTP.");
        setIsSubmitting(false);
        return;
      }

      if (result.userExists) {
        navigate(fromPath || "/", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToIdentifier = () => {
    setStep("identifier");
    setError(null);
    setOtp("");
  };

  const isEmail = identifier.includes("@");

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 flex">
      {/* Left Panel — Brand Imagery */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-neutral-900">
        {BRAND_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              idx === bgIndex && !isFading ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-16 h-full">
          <div>
          </div>
          <div className="space-y-4 max-w-md">
            <div className="h-px w-16 bg-white/40 mb-6" />
            <h2 className="text-4xl font-extrabold tracking-[0.05em] text-white leading-tight uppercase">
              {isCheckoutFlow ? "Almost There" : "Access The Syndicate"}
            </h2>
            <p className="text-sm text-white/70 tracking-wide leading-relaxed font-light">
              {isCheckoutFlow
                ? "Sign in to complete your order. Your cart items will be waiting for you."
                : "Enter the portal. Your access to exclusive drops, early releases, and curated collections awaits."}
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              {["EXCLUSIVE DROPS", "EARLY ACCESS", "PERSONAL ARCHIVE"].map((feat) => (
                <span
                  key={feat}
                  className="text-[9px] font-extrabold tracking-widest text-white/60 border border-white/20 px-3 py-1.5 uppercase"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-white/30 tracking-wider uppercase font-bold">
            SS26 Collection — Architectural Precision
          </p>
        </div>
      </div>

      {/* Right Panel — Smart Portal */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0 min-h-screen lg:min-h-0">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img
              src={logoIcon}
              alt="DRIP DOGGY"
              className="h-12 w-auto object-contain mix-blend-multiply"
            />
          </div>

          {/* Checkout Flow Banner */}
          {isCheckoutFlow && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200/60 flex items-center gap-2">
              <ShoppingBag className="h-3.5 w-3.5 text-amber-600 stroke-[1.5] flex-shrink-0" />
              <p className="text-[8px] font-extrabold tracking-widest text-amber-700 uppercase">
                Sign in to continue to checkout
              </p>
            </div>
          )}

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-[9px] font-extrabold tracking-[0.3em] text-neutral-400 uppercase">
                {step === "identifier" ? "Portal" : "Verification"}
              </span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>
            {step === "identifier" ? (
              <>
                <h1 className="text-3xl font-extrabold tracking-[0.05em] text-center uppercase">
                  Access The Syndicate
                </h1>
                <p className="text-neutral-500 text-xs tracking-wide text-center mt-3 font-medium">
                  {isCheckoutFlow
                    ? "Enter your email or phone to verify and proceed"
                    : "Enter your email or phone number to get started"}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-extrabold tracking-[0.05em] text-center uppercase">
                  Enter Code
                </h1>
                <p className="text-neutral-500 text-xs tracking-wide text-center mt-3 font-medium">
                  We sent a code to{" "}
                  <span className="text-[#030213] font-bold">{identifier}</span>
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

          {/* Identifier Step */}
          {step === "identifier" && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                  {isEmail || identifier.length === 0 ? (
                    <Mail className="h-4 w-4 stroke-[1.5]" />
                  ) : (
                    <Smartphone className="h-4 w-4 stroke-[1.5]" />
                  )}
                </div>
                <input
                  type="text"
                  id="identifier"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ENTER EMAIL OR PHONE"
                  className="w-full bg-white border border-neutral-200 pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#030213] transition-all duration-200 text-neutral-900 placeholder-neutral-400"
                  autoComplete="username"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {identifier.length > 0 && (
                    <span className="text-[7px] font-extrabold tracking-widest text-neutral-400 uppercase">
                      {isEmail ? "EMAIL" : "PHONE"}
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50/50 border border-red-200/50 px-4 py-3">
                  <p className="text-[11px] font-bold text-red-600 tracking-wider uppercase">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !identifier.trim()}
                className="group relative w-full bg-[#030213] text-white py-3.5 text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border-none cursor-pointer overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      SENDING OTP...
                    </>
                  ) : (
                    <>
                      {isCheckoutFlow ? "VERIFY & CONTINUE" : "SEND OTP"}{" "}
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5" />
                    </>
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
              onBack={handleBackToIdentifier}
              isSubmitting={isSubmitting}
              error={error}
              showDevHelper={false}
              submitLabel={isCheckoutFlow ? "VERIFY & CHECKOUT" : "VERIFY & SIGN IN"}
            />
          )}

          {/* OTP actions (resend + change) */}
          {step === "otp" && (
            <div className="mt-6 space-y-3 text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || isSubmitting}
                className="text-[10px] font-extrabold tracking-widest uppercase text-[#b2533e] hover:text-[#a04835] transition-colors bg-transparent border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
