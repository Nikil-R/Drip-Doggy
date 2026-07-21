import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Bell, Check } from "lucide-react";
import { getSitePages, getComingSoonSlides, ComingSoonSlide } from "../lib/content-store";

export function ComingSoon() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [pageData, setPageData] = useState(() => getSitePages().find(p => p.slug === "coming-soon"));
  const [slides, setSlides] = useState<ComingSoonSlide[]>(() => getComingSoonSlides().filter(s => s.active));

  useEffect(() => {
    const handleUpdate = () => {
      setPageData(getSitePages().find(p => p.slug === "coming-soon"));
      setSlides(getComingSoonSlides().filter(s => s.active));
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

  if (pageData && !pageData.active) return null;

  const activeSlides = slides.length > 0 ? slides : [
    {
      id: "default-1",
      tagline: "UPCOMING RELEASE",
      title: "MEN'S SYNDICATE",
      description: "An exploration of structural tailoring, heavyweight fabrication, and utilitarian precision. The first menswear capsule from DripDoggy — engineered for the modern wardrobe.",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1920",
      ctaText: "NOTIFY ME",
      order: 0,
      active: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200">
      {/* Hero Release Section(s) */}
      {activeSlides.map((slide) => (
        <section key={slide.id} className="relative py-16 sm:py-24 md:py-39 overflow-hidden border-b border-neutral-200 min-h-[90vh] sm:min-h-[85vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030213]/90 via-[#030213]/80 to-neutral-900/95 z-0" />
          <div
            className="absolute inset-0 opacity-25 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url("${slide.image}")` }}
          />

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center w-full">
            <span className="text-[8px] font-black tracking-[0.3em] text-white/50 uppercase block mb-4 sm:mb-6">{slide.tagline}</span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-[0.05em] text-white mb-4 sm:mb-6 uppercase leading-tight sm:leading-none">
              {slide.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl mx-auto mb-8 sm:mb-10 font-medium px-2 sm:px-0">
              {slide.description}
            </p>

            {/* Notify Form */}
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-green-400 bg-white/5 border border-white/10 px-6 py-4 max-w-sm mx-auto">
                <Check className="h-4 w-4 stroke-[2]" />
                <span className="text-xs font-extrabold tracking-widest uppercase">You're on the list. We'll notify you at launch.</span>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2.5 sm:gap-2 max-w-sm mx-auto w-full px-2 sm:px-0">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  className="w-full sm:flex-1 bg-white/10 border border-white/20 px-4 py-3.5 sm:py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors uppercase tracking-wider font-bold text-center sm:text-left rounded-none"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-white text-[#030213] hover:bg-white/90 px-6 py-3.5 sm:py-3 text-xs font-extrabold tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer shrink-0 rounded-none"
                >
                  <Bell className="h-3.5 w-3.5 stroke-[2]" />
                  {slide.ctaText || "NOTIFY ME"}
                </button>
              </form>
            )}
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="border border-neutral-200/80 bg-white p-10 md:p-14">
          <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-4">MEMBER PRIVILEGES</span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-[0.05em] uppercase mb-4">DRIPDOGGY SYNDICATE</h2>
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
