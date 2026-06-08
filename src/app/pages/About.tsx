export function About() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-neutral-900 pb-20">
      {/* Hero Header */}
      <section className="relative py-24 text-center border-b border-neutral-200/60 max-w-7xl mx-auto px-6">
        <span className="text-[10px] font-bold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          DRIP DOGGY APPAREL
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-[0.1em] font-sans uppercase mb-6">
          OUR STORY
        </h1>
        <p className="text-neutral-500 max-w-2xl mx-auto text-sm md:text-base tracking-wide leading-relaxed font-light">
          Founded in 2026, Drip Doggy is a contemporary streetwear brand born at the intersection of high fashion silhouettes and functional urban utility.
        </p>
      </section>

      {/* Grid Content */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800" 
            alt="Avant-garde clothing details" 
            className="rounded-lg shadow-xl aspect-[3/4] object-cover w-full"
          />
        </div>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold tracking-widest uppercase mb-3 text-neutral-800">
              The Brand Manifesto
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed font-light">
              We create structural garments designed to stand out. Our drops are intentionally restricted and curated—built around minimalist geometry, heavy textures, and utility hardware. We do not design for a season; we build pieces for the archive.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-widest uppercase mb-3 text-neutral-800">
              Premium Craftsmanship
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed font-light">
              Every detail is engineered with intention—from double-faced seam constructions and heavy rib finishes to high-gauge cottons and bespoke nylon blends. We work exclusively with certified ethical mills that respect the fabric and the makers.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-200">
            <span className="text-xs font-bold tracking-widest uppercase text-neutral-400 block mb-1">
              HEADQUARTERS
            </span>
            <p className="text-neutral-700 text-xs tracking-wider">
              EST. 2026 // MILAN - SEOUL - LONDON
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
