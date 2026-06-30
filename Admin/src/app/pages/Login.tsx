import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/app/store/auth-store";
import { Shield, Key, Mail, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import logoIcon from "@/assets/new_logo_icon.png";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");

  // OTP workflow flags
  const [loginStep, setLoginStep] = useState<"email" | "otp">("email");
  const [emailOtp, setEmailOtp] = useState("");

  const handleSendEmailOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoginStep("otp");
    }, 800);
  };

  const handleVerifyEmailOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      setError("");
      // Authenticate immediately
      await login("admin@dripdoggy.com", "admin123");
      navigate("/admin/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col md:flex-row font-sans text-foreground">
      
      {/* Left Column: Visual Brand Banner */}
      <div className="w-full md:w-5/12 bg-[#224870] flex flex-col justify-between p-8 md:p-14 text-white relative overflow-hidden select-none border-b md:border-b-0 md:border-r border-neutral-200/20">
        {/* Subtle background lines decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        </div>

        {/* Brand Icon Block Placeholder or empty spacing */}
        <div className="z-10" />

        {/* Central Core Message */}
        <div className="my-auto py-12 space-y-3.5 z-10">
          <span className="text-[9px] font-black tracking-[0.2em] text-[#faf8f5]/65 uppercase block">Secure Admin Panel</span>
          <h1 className="text-3xl font-black uppercase tracking-widest leading-none text-white">
            ADMINISTRATOR<br/>
            DASHBOARD
          </h1>
          <p className="text-[10.5px] text-white/70 uppercase leading-relaxed tracking-wider font-semibold max-w-sm pt-2">
            Workspace access portal to manage product catalogs, view business analytics, and organize store settings.
          </p>
        </div>

        {/* Security Indicator */}
        <div className="flex items-center gap-2 z-10 pt-4 md:pt-0">
          <Shield className="w-4 h-4 text-white/60" />
          <span className="text-[8px] text-white/60 font-bold uppercase tracking-widest">
            Secured admin credentials login session
          </span>
        </div>
      </div>

      {/* Right Column: Interaction Form */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-8 md:p-16 relative bg-[#faf8f5]">
        
        {/* Clean outline grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="w-full max-w-[400px] space-y-6 relative z-10">
          
          {/* Centered Brand Logos Block */}
          <div className="flex flex-col items-center justify-center space-y-0.5">
            <img src={logoIcon} alt="Drip Doggy Icon" className="w-20 h-20 object-contain mix-blend-multiply" />
            <img src={logo} alt="Drip Doggy Logo" className="h-29 w-auto max-w-[130px] object-contain mix-blend-multiply -mt-10 -mb-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-[950] text-[#382d24] uppercase tracking-wider text-center">Sign In</h2>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest text-center">Please enter your workspace details below.</p>
          </div>

          <div className="bg-card border border-border p-8 space-y-6 shadow-sm">
            {error && (
              <div className="border border-red-200 bg-red-50/50 text-red-700 text-[8.5px] font-bold px-3.5 py-2.5 uppercase tracking-wider">
                {error}
              </div>
            )}

            <form onSubmit={loginStep === "email" ? handleSendEmailOtp : handleVerifyEmailOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                  <input
                    required
                    disabled={loginStep === "otp"}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@dripdoggy.com"
                    className="w-full bg-[#faf8f5] border border-border pl-10 pr-4 py-3 text-[10px] font-bold uppercase focus:outline-none focus:border-[#224870] text-foreground transition-all rounded-none disabled:opacity-75"
                  />
                </div>
              </div>

              {loginStep === "otp" && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest">Enter 6-Digit OTP</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                    <input
                      required
                      autoFocus
                      maxLength={6}
                      type="text"
                      value={emailOtp}
                      onChange={e => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="• • • • • •"
                      className="w-full bg-[#faf8f5] border border-border pl-10 pr-4 py-3 text-[11px] tracking-[0.6em] font-black focus:outline-none focus:border-[#224870] text-foreground text-center transition-all rounded-none"
                    />
                  </div>
                  <span className="text-[8px] text-muted-foreground/85 font-semibold block mt-1.5 uppercase">We sent a verification code to {email}.</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {loginStep === "otp" && (
                  <button
                    type="button"
                    onClick={() => {
                      setLoginStep("email");
                      setEmailOtp("");
                    }}
                    className="border border-border hover:border-muted-foreground text-foreground text-[9px] font-bold tracking-widest px-4 py-3 uppercase bg-transparent cursor-pointer rounded-none transition-all"
                  >
                    Edit Email
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#224870] hover:bg-[#224870]/90 text-white text-[9px] font-bold tracking-widest py-3 uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border-none rounded-none"
                >
                  {loading ? "Processing..." : loginStep === "email" ? "Verify OTP" : "Sign In"}
                  {loginStep === "email" && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-[8.5px] text-muted-foreground/60 font-bold uppercase tracking-widest mt-4">
            Drip Doggy Admin Panel &copy; 2026
          </p>

        </div>
      </div>

    </div>
  );
}
