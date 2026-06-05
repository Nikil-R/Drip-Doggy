import { useState } from "react";
import { Link } from "react-router";
import { Search, ShoppingBag, Eye, EyeOff, Share2, HelpCircle } from "lucide-react";

export function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert(`Account created for: ${firstName} ${lastName}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 ">
      {/* Header */}
      

      {/* Main Content */}
      <div className="max-w-md w-full mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <h1 className="text-3xl font-extrabold tracking-[0.1em] mb-2 font-sans text-center uppercase">
          CREATE ACCOUNT
        </h1>
        <p className="text-neutral-500 text-xs tracking-wide text-center mb-8">
          Join DRIP DOGGY and get access to exclusive drops and premium apparel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-neutral-100 p-8 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">FIRST NAME</label>
              <input
                type="text"
                id="firstName"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">LAST NAME</label>
              <input
                type="text"
                id="lastName"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>

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
            <label htmlFor="password" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">PASSWORD</label>
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

          <div>
            <label htmlFor="confirmPassword" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">CONFIRM PASSWORD</label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#030213] text-white py-4 rounded-md text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg pt-4"
          >
            CREATE ACCOUNT
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-8 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-[#030213] font-bold border-b border-[#030213] pb-0.5 hover:opacity-75 transition-opacity">
            Sign in
          </Link>
        </p>
      </div>

      {/* Footer */}
      
    </div>
  );
}
