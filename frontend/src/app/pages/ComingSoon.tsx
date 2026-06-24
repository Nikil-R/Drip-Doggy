import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Bell, Check } from "lucide-react";
import { getSitePages, getComingSoonTeasers } from "../lib/content-store";

export function ComingSoon() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [pageData, setPageData] = useState(() => getSitePages().find(p => p.slug === "coming-soon"));
  const [teasers, setTeasers] = useState(() => getComingSoonTeasers().filter(t => t.active));

  useEffect(() => {
    const handleUpdate = () => {
      setPageData(getSitePages().find(p => p.slug === "coming-soon"));
      setTeasers(getComingSoonTeasers().filter(t => t.active));
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("dd-content-changed" as any, handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("dd-content-changed" as any, handleUpdate);
    };
  }, []);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const hero = pageData?.hero || {
    tag: "UPCOMING RELEASE",
    heading: "Men's Syndicate",
    description: "An exploration of structural tailoring, heavyweight fabrication, and utilitarian precision. The first menswear capsule from Drip Doggy — engineered for the modern wardrobe.",
    active: true
  };

  if (pageData && !pageData.active) return null;

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
          <span className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase block mb-6">{hero.tag}</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-[0.05em] text-white mb-6 uppercase">
            {hero.heading}
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-xl mx-auto mb-10 font-medium">
            {hero.description}
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
      {teasers.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-3">Coming Collections</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-[0.05em] uppercase">What's Coming</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {teasers.sort((a, b) => a.order - b.order).map((cat) => (
              <div key={cat.id} className="group relative aspect-[3/4] overflow-hidden bg-neutral-100 border border-neutral-200/60">
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
      )}

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="border border-neutral-200/80 bg-white p-10 md:p-14">
          <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-4">MEMBER PRIVILEGES</span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-[0.05em] uppercase mb-4">DRIP DOGGY SYNDICATE</h2>
          <p className="text-neutral-500 text-xs tracking-wide leading-relaxed max-w-lg mx-auto mb-8 font-medium">
            Members receive priority allocations on all upcoming capsules, complimentary domestic shipping,
            and exclusive access to private archive sales. Join the syndicate today.
          </p>
          <Link to="/shop" className="bg-[#030213] text-white hover:bg-neutral-800 text-[10px] font-extrabold tracking-widest uppercase px-6 py-4 inline-flex items-center gap-2 transition-colors">
            Explore Current Collection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
