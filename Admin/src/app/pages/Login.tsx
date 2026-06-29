import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/app/store/auth-store";
import { Shield, Key, Mail, Phone, Calendar, User, ArrowRight } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");

  // OTP workflow flags
  const [loginStep, setLoginStep] = useState<"email" | "otp">("email");
  const [regStep, setRegStep] = useState<"email" | "email-otp" | "profile" | "phone-otp">("email");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const handleSendEmailOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (activeTab === "login") {
        setLoginStep("otp");
      } else {
        setRegStep("email-otp");
      }
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
      if (activeTab === "login") {
        // Authenticate immediately
        await login("admin@dripdoggy.com", "admin123");
        navigate("/admin/dashboard");
      } else {
        setRegStep("profile");
      }
    }, 800);
  };

  const handleSendPhoneOtp = () => {
    setError("");
    if (!firstName.trim()) {
      setError("First Name is required to complete profile.");
      return;
    }
    if (!lastName.trim()) {
      setError("Last Name is required to complete profile.");
      return;
    }
    if (!dob) {
      setError("Date of Birth is required to complete profile.");
      return;
    }
    if (!phone.trim()) {
      setError("Phone Number is required to complete profile.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRegStep("phone-otp");
    }, 800);
  };

  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOtp.length !== 6) {
      setError("Please enter a valid 6-digit SMS OTP.");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      setError("");
      // Perform mock registration and log in
      await login("admin@dripdoggy.com", "admin123");
      navigate("/admin/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-sans text-foreground">
      
      {/* Decorative clean outline grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="w-full max-w-[440px] relative z-10 space-y-8">
        
        {/* Logo Section */}
        <div className="text-center space-y-3.5">
          <div className="w-14 h-14 bg-card border border-border flex items-center justify-center mx-auto shadow-xs">
            <span className="text-foreground font-black text-xl tracking-tighter">DD</span>
          </div>
          <div>
            <h1 className="text-xl font-[950] text-foreground uppercase tracking-widest">DRIP DOGGY</h1>
            <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest mt-1 block">Security Authority Portal</span>
          </div>
        </div>

        {/* Form Box */}
        <div className="bg-card border border-border p-8 space-y-6 shadow-sm">
          
          {/* Top Tabs: Login vs Register */}
          <div className="grid grid-cols-2 border-b border-border pb-3">
            <button
              onClick={() => {
                setActiveTab("login");
                setLoginStep("email");
                setError("");
              }}
              className={`pb-2.5 text-[9.5px] font-black uppercase tracking-wider bg-transparent border-none cursor-pointer transition-all ${
                activeTab === "login" ? "text-[#224870] border-b-2 border-[#224870]" : "text-muted-foreground/75"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setRegStep("email");
                setError("");
              }}
              className={`pb-2.5 text-[9.5px] font-black uppercase tracking-wider bg-transparent border-none cursor-pointer transition-all ${
                activeTab === "register" ? "text-[#224870] border-b-2 border-[#224870]" : "text-muted-foreground/75"
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50/50 text-red-700 text-[8.5px] font-bold px-3.5 py-2.5 uppercase tracking-wider">
              {error}
            </div>
          )}

          {/* ────────────────── SIGN IN ────────────────── */}
          {activeTab === "login" && (
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
                    placeholder="ENTER YOUR EMAIL..."
                    className="w-full bg-background border border-border pl-10 pr-4 py-3 text-[10px] font-bold uppercase focus:outline-none focus:border-[#224870] text-foreground transition-all rounded-none disabled:opacity-75"
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
                      placeholder="E.G. 123456"
                      className="w-full bg-background border border-border pl-10 pr-4 py-3 text-[10.5px] tracking-[0.45em] font-black focus:outline-none focus:border-[#224870] text-foreground transition-all rounded-none"
                    />
                  </div>
                  <span className="text-[8px] text-muted-foreground/80 font-semibold block mt-1.5 uppercase">We sent a verification code to {email}.</span>
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
                    className="border border-border hover:border-muted-foreground text-foreground text-[9.5px] font-bold tracking-widest px-4.5 py-3 uppercase bg-transparent cursor-pointer rounded-none transition-all"
                  >
                    Edit Email
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest py-3 uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border-none rounded-none"
                >
                  {loading ? "Processing..." : loginStep === "email" ? "Verify OTP" : "Sign In"}
                  {loginStep === "email" && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>
          )}

          {/* ────────────────── REGISTER ────────────────── */}
          {activeTab === "register" && (
            <div className="space-y-4">
              
              {/* Step 1 & 2: Email and Email Verification OTP */}
              {(regStep === "email" || regStep === "email-otp") && (
                <form onSubmit={regStep === "email" ? handleSendEmailOtp : handleVerifyEmailOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                      <input
                        required
                        disabled={regStep === "email-otp"}
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="ENTER REGISTRATION EMAIL..."
                        className="w-full bg-background border border-border pl-10 pr-4 py-3 text-[10px] font-bold uppercase focus:outline-none focus:border-[#224870] text-foreground transition-all rounded-none disabled:opacity-75"
                      />
                    </div>
                  </div>

                  {regStep === "email-otp" && (
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
                          placeholder="E.G. 123456"
                          className="w-full bg-background border border-border pl-10 pr-4 py-3 text-[10.5px] tracking-[0.45em] font-black focus:outline-none focus:border-[#224870] text-foreground transition-all rounded-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {regStep === "email-otp" && (
                      <button
                        type="button"
                        onClick={() => {
                          setRegStep("email");
                          setEmailOtp("");
                        }}
                        className="border border-border hover:border-muted-foreground text-foreground text-[9.5px] font-bold tracking-widest px-4.5 py-3 uppercase bg-transparent cursor-pointer rounded-none transition-all"
                      >
                        Edit Email
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest py-3 uppercase transition-colors disabled:opacity-50 cursor-pointer border-none rounded-none"
                    >
                      {loading ? "Processing..." : regStep === "email" ? "Verify OTP" : "Sign In"}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3 & 4: Profile Details & Phone OTP Verification */}
              {(regStep === "profile" || regStep === "phone-otp") && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest">First Name</label>
                      <input
                        required
                        disabled={regStep === "phone-otp"}
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="FIRST NAME"
                        className="w-full bg-background border border-border px-3.5 py-2.5 text-[9.5px] font-bold uppercase focus:outline-none focus:border-[#224870] text-foreground transition-all rounded-none disabled:opacity-75"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest">Last Name</label>
                      <input
                        required
                        disabled={regStep === "phone-otp"}
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="LAST NAME"
                        className="w-full bg-background border border-border px-3.5 py-2.5 text-[9.5px] font-bold uppercase focus:outline-none focus:border-[#224870] text-foreground transition-all rounded-none disabled:opacity-75"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest">Gender</label>
                      <select
                        value={gender}
                        disabled={regStep === "phone-otp"}
                        onChange={e => setGender(e.target.value)}
                        className="w-full bg-background border border-border px-3.5 py-2.5 text-[9.5px] font-bold uppercase focus:outline-none focus:border-[#224870] text-foreground cursor-pointer rounded-none transition-all disabled:opacity-75"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest">Date of Birth</label>
                      <input
                        required
                        disabled={regStep === "phone-otp"}
                        type="date"
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        className="w-full bg-background border border-border px-3.5 py-2 text-[9.5px] font-bold uppercase focus:outline-none focus:border-[#224870] text-foreground rounded-none transition-all disabled:opacity-75"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                        <input
                          required
                          disabled={regStep === "phone-otp"}
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="PHONE NUMBER"
                          className="w-full bg-background border border-border pl-10 pr-4 py-2.5 text-[9.5px] font-bold focus:outline-none focus:border-[#224870] text-foreground transition-all rounded-none disabled:opacity-75"
                        />
                      </div>
                      {regStep === "profile" && (
                        <button
                          type="button"
                          onClick={handleSendPhoneOtp}
                          className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[8.5px] font-bold tracking-widest px-4.5 py-2.5 uppercase cursor-pointer border-none shrink-0 rounded-none transition-colors"
                        >
                          Verify Phone
                        </button>
                      )}
                    </div>
                  </div>

                  {regStep === "phone-otp" && (
                    <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 pt-2">
                      <div className="space-y-1.5 animate-fade-in">
                        <label className="block text-[8.5px] font-bold text-muted-foreground uppercase tracking-widest">Enter SMS Verification OTP</label>
                        <div className="relative">
                          <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
                          <input
                            required
                            autoFocus
                            maxLength={6}
                            type="text"
                            value={phoneOtp}
                            onChange={e => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
                            placeholder="ENTER SMS OTP..."
                            className="w-full bg-background border border-border pl-10 pr-4 py-3 text-[10.5px] tracking-[0.45em] font-black focus:outline-none focus:border-[#224870] text-foreground transition-all rounded-none"
                          />
                        </div>
                        <span className="text-[8px] text-muted-foreground/80 font-semibold block mt-1.5 uppercase">We sent a verification SMS to {phone}.</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRegStep("profile");
                            setPhoneOtp("");
                          }}
                          className="border border-border hover:border-muted-foreground text-foreground text-[9.5px] font-bold tracking-widest px-4.5 py-3 uppercase bg-transparent cursor-pointer rounded-none transition-all"
                        >
                          Edit Profile
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest py-3 uppercase transition-colors disabled:opacity-50 cursor-pointer border-none rounded-none"
                        >
                          {loading ? "Verifying..." : "Sign In"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Security Info */}
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[8.5px] text-muted-foreground font-bold uppercase tracking-wider">
            Secured passwordless token-auth protocol
          </span>
        </div>

        {/* Footer */}
        <p className="text-center text-[8.5px] text-muted-foreground/70 font-bold uppercase tracking-widest mt-4">
          Drip Doggy Admin Panel &copy; 2026
        </p>

      </div>
    </div>
  );
}
