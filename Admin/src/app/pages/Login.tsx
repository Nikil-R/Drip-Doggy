import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/app/store/auth-store";
import { LogIn, Eye, EyeOff, Shield } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("admin@dripdoggy.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Try admin@dripdoggy.com / admin123");
    }
  };

  return (
    <div className="min-h-screen bg-[#030213] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-20 w-96 h-96 border border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-64 h-64 border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">

        {/* ── Logo + Header ────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-card flex items-center justify-center mx-auto mb-5">
            <span className="text-[#030213] font-bold text-xl tracking-tight">DD</span>
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest">
            Drip Doggy
          </h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1.5">
            Admin Dashboard
          </p>
        </div>

        {/* ── Login Card ───────────────────────────────────────────── */}
        <div className="bg-card p-8 border border-neutral-200/80">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[8px] font-bold text-neutral-500 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-card border border-neutral-200 text-[9px] font-bold focus:outline-none focus:border-[#030213] transition-all placeholder-neutral-300 uppercase tracking-wider"
                placeholder="admin@dripdoggy.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[8px] font-bold text-neutral-500 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-card border border-neutral-200 text-[9px] font-bold focus:outline-none focus:border-[#030213] transition-all placeholder-neutral-300 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#030213] bg-transparent border-none cursor-pointer p-0"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[8px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-[#030213] h-3 w-3"
                />
                Remember me
              </label>
              <button type="button" className="text-[8px] font-semibold text-neutral-400 hover:text-[#030213] uppercase tracking-wider bg-transparent border-none cursor-pointer">
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="border border-red-200 bg-red-50 text-red-700 text-[8px] font-semibold px-3 py-2.5 uppercase tracking-wider">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest py-2.5 uppercase transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="h-3.5 w-3.5" />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* ── Security note ────────────────────────────────────────── */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <Shield className="w-3 h-3 text-neutral-500" />
          <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider">
            Secured with OAuth 2.0 &amp; 256-bit encryption
          </span>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <p className="text-center text-[8px] text-neutral-600 font-bold uppercase tracking-widest mt-4">
          Drip Doggy Admin Panel &copy; 2026 &middot; Mumbai, India
        </p>

      </div>
    </div>
  );
}
