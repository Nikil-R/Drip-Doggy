import { useState } from "react";
import { Link } from "react-router";
import { Search, ShoppingBag, Eye, EyeOff, Share2, HelpCircle } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Signed in as: ${email}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 ">
      {/* Header */}
      

      {/* Main Content */}
      <div className="max-w-md w-full mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <h1 className="text-3xl font-extrabold tracking-[0.1em] mb-2 font-sans text-center uppercase">
          SIGN IN
        </h1>
        <p className="text-neutral-500 text-xs tracking-wide text-center mb-8">
          Welcome back to DRIP DOGGY. Please enter your details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-neutral-100 p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
          <div>
            <label htmlFor="email" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">EMAIL ADDRESS</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-[10px] font-bold tracking-wider text-neutral-500">PASSWORD</label>
              <Link to="#" className="text-[10px] font-bold tracking-wider text-neutral-400 hover:text-neutral-900">FORGOT PASSWORD?</Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF8F5]/50 border border-neutral-200 pl-4 pr-10 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#030213]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#030213] text-white py-4 rounded-md text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg"
          >
            SIGN IN
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-8 font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#030213] font-bold border-b border-[#030213] pb-0.5 hover:opacity-75 transition-opacity">
            Create one
          </Link>
        </p>
      </div>

      {/* Footer */}
      
    </div>
  );
}

