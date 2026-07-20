import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { OtpVerificationStep } from "./OtpVerificationStep";
import { validateEmail, validatePhone, validateOtp, validateName } from "../../utils/validation";
import { Mail, Smartphone, ArrowRight, User, Lock, Shield } from "lucide-react";
import logoIcon from "../../../assets/new_logo_icon.png";

type PortalStep = "identifier" | "otp" | "onboarding";

const GENDER_OPTIONS = ["FEMALE", "MALE", "OTHER"] as const;

export function AuthModal() {
  const { isAuthenticated, requestOtp, verifyOtp, completeOnboarding } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<PortalStep>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verifiedMethod, setVerifiedMethod] = useState<"email" | "phone" | null>(null);

  // Onboarding fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setVisible(false);
      return;
    }

    const bypassedPaths = ["/login", "/onboarding"];
    if (bypassedPaths.includes(location.pathname)) {
      setVisible(false);
      return;
    }

    // Delay pop-up by 1.5 seconds
    const timer = setTimeout(() => {
      setVisible(true);
      setStep("identifier");
      setIdentifier("");
      setOtp("");
      setError(null);
      setFirstName("");
      setLastName("");
      setGender("");
      setDateOfBirth("");
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!visible) return null;

  const handleIdentifierChange = (val: string) => {
    setIdentifier(val.toLowerCase());
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const trimmedId = identifier.trim();
    const emailErr = validateEmail(trimmedId);
    if (emailErr) {
      setError(emailErr);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await requestOtp(trimmedId);
      if (!result.success) {
        setError(result.message ?? "Something went wrong.");
        setIsSubmitting(false);
        return;
      }
      setIdentifier(trimmedId);
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

    const otpErr = validateOtp(otp);
    if (otpErr) {
      setError(otpErr);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await verifyOtp(identifier, otp);
      if (!result.success) {
        setError(result.message ?? "Invalid OTP.");
        setIsSubmitting(false);
        return;
      }

      if (result.userExists) {
        setVisible(false);
      } else {
        setStep("onboarding");
        setError(null);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const firstErr = validateName("First name", firstName);
    if (firstErr) {
      setError(firstErr);
      return;
    }
    const lastErr = validateName("Last name", lastName);
    if (lastErr) {
      setError(lastErr);
      return;
    }
    if (!gender) {
      setError("Please select a gender identity.");
      return;
    }
    if (!dateOfBirth.trim()) {
      setError("Please enter your date of birth.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await completeOnboarding({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        dateOfBirth: dateOfBirth.trim(),
      });
      if (!result.success) {
        setError(result.message ?? "Something went wrong.");
        setIsSubmitting(false);
        return;
      }
      setVisible(false);
      navigate("/", { replace: true });
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
    if (identifier.startsWith("+91")) {
      setIdentifier(identifier.replace("+91", ""));
    }
  };

  const handleIHaveCode = () => {
    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setError("Please enter your email address first.");
      return;
    }
    const emailErr = validateEmail(trimmedId);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    setError(null);
    setStep("otp");
    setOtp("");
    setResendTimer(0);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60 transition-all duration-300">
      <div className="w-full max-w-sm bg-[#FDFBF7] border border-[#eae6db] rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.15)] p-8 relative flex flex-col justify-between overflow-hidden">
        
        {/* Star decorations */}
        <div className="absolute left-10 top-12 text-[#B89C72] opacity-60">
          <span className="text-[12px]">✦</span>
        </div>
        <div className="absolute right-10 top-16 text-[#B89C72] opacity-60">
          <span className="text-[12px]">✦</span>
        </div>

        {/* Mascot/Logo */}
        <div className="flex justify-center mb-2 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(224,204,175,0.2)_0%,transparent_70%)] scale-150 pointer-events-none" />
          <img
            src={logoIcon}
            alt="DRIPDOGGY"
            className="h-20 w-auto object-contain mix-blend-multiply relative z-10"
          />
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-block px-4 py-1.5 border border-[#B89C72] rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-[#B89C72] bg-white">
            Drip Community
          </span>
        </div>

        {/* Header Title */}
        <div className="mb-6 text-center">
          {step === "identifier" ? (
            <>
              <h2 className="text-[10px] font-extrabold tracking-[0.25em] text-[#222222] uppercase">
                Welcome To
              </h2>
              <h1 className="text-3xl font-black tracking-tight uppercase text-[#1c1c1c] mt-1">
                Dripdoggy
              </h1>
              <div className="w-8 h-[2px] bg-[#B89C72] mx-auto mt-2" />
            </>
          ) : step === "otp" ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#B89C72] uppercase">
                  Verification
                </span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-wide uppercase text-neutral-900 leading-tight">
                Enter Code
              </h1>
              <p className="text-neutral-500 text-xs mt-2 font-medium">
                We sent a code to <span className="text-[#030213] font-bold">{identifier}</span>
              </p>
              {verifiedMethod && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-[8px] font-extrabold tracking-widest text-green-600 uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                    Code sent via {verifiedMethod}
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#B89C72] uppercase">
                  Complete Profile
                </span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-wide uppercase text-neutral-900 leading-tight">
                Build Your Identity
              </h1>
              <p className="text-neutral-500 text-xs mt-2 font-medium">
                Tell us a bit about yourself to personalize your experience
              </p>
            </>
          )}
        </div>

        {/* Identifier Step */}
        {step === "identifier" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <p className="text-[11px] font-medium leading-relaxed text-[#666666] text-center max-w-xs mx-auto mb-4">
              Join the DripDoggy community. Enter your email to unlock exclusive collections, early drops, and member-only updates.
            </p>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-450 pointer-events-none">
                <Mail className="h-4 w-4 stroke-[1.5]" />
              </div>
              <input
                type="text"
                id="identifier-modal"
                required
                value={identifier}
                onChange={(e) => handleIdentifierChange(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white border border-neutral-250/90 rounded-md pl-11 pr-4 py-3.5 text-xs text-[#222222] placeholder-neutral-400 font-medium outline-none focus:border-[#B89C72] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50/50 border border-red-200/50 px-4 py-3 text-center">
                <p className="text-[10px] font-bold text-red-600 tracking-wider uppercase">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !identifier.trim()}
              className="w-full bg-[#1c1c1c] hover:bg-[#2c2c2c] disabled:bg-neutral-200 text-[#c5a880] disabled:text-neutral-400 rounded-md py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-200 flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              <span>JOIN THE COMMUNITY</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5] text-[#c5a880]" />
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="h-[1px] flex-1 bg-neutral-200/80" />
              <span className="text-[8px] font-bold tracking-widest text-[#B89C72] uppercase">
                OR
              </span>
              <div className="h-[1px] flex-1 bg-neutral-200/80" />
            </div>

            <button
              type="button"
              onClick={handleIHaveCode}
              className="w-full bg-white border border-neutral-200/80 hover:border-neutral-300 text-[#1c1c1c] rounded-md py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-200 flex items-between justify-between px-5 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Lock className="h-4 w-4 text-[#B89C72] stroke-[1.5]" />
                <span>I HAVE A CODE</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5] text-[#1c1c1c]" />
            </button>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-neutral-400">
              <Shield className="h-3.5 w-3.5 stroke-[1.5]" />
              <span className="text-[10px] font-medium">Your privacy is important to us.</span>
            </div>
          </form>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <div className="space-y-6">
            <OtpVerificationStep
              otp={otp}
              onOtpChange={setOtp}
              onSubmit={handleVerifyOtp}
              onBack={handleBackToIdentifier}
              isSubmitting={isSubmitting}
              error={error}
              showDevHelper={true}
            />

            {/* Resend OTP */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || isSubmitting}
                className="text-[9px] font-extrabold tracking-widest uppercase text-neutral-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer"
              >
                {resendTimer > 0 ? `RESEND CODE IN ${resendTimer}S` : "RESEND VERIFICATION CODE"}
              </button>
            </div>
          </div>
        )}

        {/* Onboarding Step */}
        {step === "onboarding" && (
          <form onSubmit={handleOnboardingSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                  <User className="h-3.5 w-3.5 stroke-[1.5]" />
                </div>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full bg-white border border-neutral-250 pl-9 pr-3.5 py-3 text-sm focus:outline-none focus:border-[#030213] transition-all duration-200 text-neutral-900 placeholder-neutral-400"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full bg-white border border-neutral-250 px-3.5 py-3 text-sm focus:outline-none focus:border-[#030213] transition-all duration-200 text-neutral-900 placeholder-neutral-400"
                />
              </div>
            </div>

            {/* Gender Identity */}
            <div>
              <label className="text-[9px] font-extrabold tracking-[0.2em] text-neutral-500 uppercase block mb-2.5">
                Gender Identity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GENDER_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setGender(option)}
                    className={`py-3 text-[10px] font-extrabold tracking-[0.15em] uppercase border transition-all duration-200 cursor-pointer ${
                      gender === option
                        ? "bg-[#030213] text-white border-[#030213]"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-[#030213] hover:text-[#030213]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-[9px] font-extrabold tracking-[0.2em] text-neutral-500 uppercase block mb-2.5">
                Date of Birth
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-white border border-neutral-250 px-4 py-3 text-sm focus:outline-none focus:border-[#030213] transition-all duration-200 text-neutral-900 placeholder-neutral-400"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50/50 border border-red-200/50 px-4 py-3">
                <p className="text-[11px] font-bold text-red-600 tracking-wider uppercase">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !firstName.trim() || !lastName.trim() || !gender || !dateOfBirth.trim()}
              className="group relative w-full bg-[#030213] text-white py-3.5 text-[10px] font-extrabold tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border-none cursor-pointer overflow-hidden uppercase"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    SETTING UP...
                  </>
                ) : (
                  <>
                    COMPLETE ACCOUNT SETUP{" "}
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5" />
                  </>
                )}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
