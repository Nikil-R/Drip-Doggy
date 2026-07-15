import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, User } from "lucide-react";
import logoIcon from "../../assets/new_logo_icon.png";
import { validateName } from "../utils/validation";

const BRAND_IMAGES = [
  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
];

const GENDER_OPTIONS = ["FEMALE", "MALE", "OTHER"] as const;

export function Onboarding() {
  const { isAuthenticated, pendingIdentifier, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

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

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!pendingIdentifier) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
      navigate("/shop", { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Join The Syndicate
            </h2>
            <p className="text-sm text-white/70 tracking-wide leading-relaxed font-light">
              Complete your profile to unlock a curated shopping experience tailored
              to your style. Limited drops and early releases await.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              {["MEMBERS ONLY", "EARLY DROPS", "LIMITED EDITIONS"].map((feat) => (
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
            SS26 Collection — Avant-Garde Streetwear
          </p>
        </div>
      </div>

      {/* Right Panel — Onboarding Form */}
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

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-[9px] font-extrabold tracking-[0.3em] text-neutral-400 uppercase">
                Complete Profile
              </span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-[0.05em] text-center uppercase">
              Build Your Identity
            </h1>
            <p className="text-neutral-500 text-xs tracking-wide text-center mt-3 font-medium">
              Tell us a bit about yourself to personalize your experience
            </p>
          </div>

          {/* Onboarding Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full bg-white border border-neutral-200 pl-9 pr-3.5 py-3 text-sm focus:outline-none focus:border-[#030213] transition-all duration-200 text-neutral-900 placeholder-neutral-400"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full bg-white border border-neutral-200 px-3.5 py-3 text-sm focus:outline-none focus:border-[#030213] transition-all duration-200 text-neutral-900 placeholder-neutral-400"
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
                className="w-full bg-white border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-[#030213] transition-all duration-200 text-neutral-900 placeholder-neutral-400"
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
              className="group relative w-full bg-[#030213] text-white py-3.5 text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border-none cursor-pointer overflow-hidden"
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
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
