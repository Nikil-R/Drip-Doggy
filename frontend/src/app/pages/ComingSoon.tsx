import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Bell, Check } from "lucide-react";

const TEASER_CATEGORIES = [
  { name: "Outerwear", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=400", coming: "SS26" },
  { name: "Knitwear", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400", coming: "SS26" },
  { name: "Tailoring", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400", coming: "FW26" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400", coming: "FW26" },
];

export function ComingSoon() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030213] to-neutral-900 opacity-95" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1920")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase block mb-6">Upcoming Release</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-[0.05em] text-white mb-6 uppercase">
            Men's Syndicate
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-xl mx-auto mb-10 font-medium">
            An exploration of structural tailoring, heavyweight fabrication, and utilitarian precision.
            The first menswear capsule from Drip Doggy — engineered for the modern wardrobe.
          </p>

          {/* Notify Form */}
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-green-400 bg-white/5 border border-white/10 px-6 py-4 max-w-sm mx-auto">
              <Check className="h-4 w-4 stroke-[2]" />
              <span className="text-xs font-extrabold tracking-widest uppercase">You're on the list. We'll notify you at launch.</span>
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex gap-2 max-w-sm mx-auto">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors uppercase tracking-wider font-bold" />
              <button type="submit"
                className="bg-white text-[#030213] hover:bg-white/90 px-5 py-3 text-xs font-extrabold tracking-widest uppercase transition-all flex items-center gap-1.5 border-none cursor-pointer">
                <Bell className="h-3.5 w-3.5 stroke-[2]" />
                Notify Me
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Category Preview */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-3">Coming Collections</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-[0.05em] uppercase">What's Coming</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TEASER_CATEGORIES.map((cat) => (
            <div key={cat.name} className="group relative aspect-[3/4] overflow-hidden bg-neutral-100 border border-neutral-200/60">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-white text-sm font-extrabold tracking-[0.05em] uppercase block">{cat.name}</span>
                <span className="text-white/50 text-[9px] font-bold tracking-widest uppercase mt-1 block">{cat.coming}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="border border-neutral-200/80 bg-white p-10 md:p-14">
          <span className="text-[8px] font-black tracking-[0.3em] text-[#b2533e] uppercase block mb-3">In the meantime</span>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-[0.05em] uppercase mb-4">Explore the Current Collection</h3>
          <p className="text-xs text-neutral-500 font-medium mb-8 max-w-md mx-auto">
            Our women's and accessories collections are available now. Discover architectural silhouettes, premium fabrication, and uncompromised luxury.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop"
              className="bg-[#030213] hover:bg-neutral-800 text-white px-8 py-3.5 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-colors flex items-center gap-2">
              Shop Now <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
            </Link>
            <Link to="/"
              className="border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-8 py-3.5 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

