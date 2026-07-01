export function About() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#030213] pb-20 font-sans antialiased selection:bg-neutral-200">
      {/* Hero Header */}
      <section className="relative py-24 text-center border-b border-neutral-200/80 max-w-7xl mx-auto px-6">
        <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          DRIP DOGGY APPAREL
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-[0.05em] uppercase mb-6">
          The Story
        </h1>
        <p className="text-neutral-500 max-w-2xl mx-auto text-xs tracking-wide leading-relaxed font-medium">
          Founded in 2026, Drip Doggy is a luxury streetwear label born at the intersection of architectural precision and functional urban utility.
        </p>
      </section>

      {/* Philosophy Banner */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-[#030213] text-white p-10 md:p-16 text-center">
          <span className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase block mb-4">Manifesto</span>
          <p className="text-xl md:text-2xl font-extrabold leading-tight tracking-tight max-w-2xl mx-auto">
            "We do not design for a season. We build pieces for the archive."
          </p>
          <div className="h-px w-12 bg-white/30 mx-auto mt-6" />
        </div>
      </section>

      {/* Values Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-lg font-extrabold tracking-[0.1em] uppercase mb-10 text-center">House Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Architectural Precision", desc: "Every silhouette is engineered with intention — double-faced seams, differential rib panels, and precision-molded fits that sculpt the body." },
            { title: "Material Integrity", desc: "We work exclusively with certified ethical mills. Premium European linen, heavyweight French terry, custom-milled organic cotton, and ripstop nylon blends." },
            { title: "Drop Culture", desc: "Limited capsules released on a rolling schedule. No seasonal overproduction — each drop is curated, restricted, and built to hold value in your archive." },
          ].map((v) => (
            <div key={v.title} className="border border-neutral-200/80 p-6 bg-white">
              <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase block mb-3">{v.title}</span>
              <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Craftsmanship + Materials */}
      <section className="bg-white border-t border-b border-neutral-200/80 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800"
                alt="Premium fabric details"
                className="w-full aspect-[3/4] object-cover border border-neutral-200/60"
              />
            </div>
            <div className="space-y-8">
              <div>
                <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-3">Craftsmanship</span>
                <h3 className="text-lg font-extrabold tracking-[0.05em] uppercase mb-3">Made to Last</h3>
                <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
                  Each piece undergoes rigorous construction standards. Double-stitched seams, reinforced stress points, and premium hardware ensure your garment outlives seasonal trends.
                </p>
              </div>
              <div className="pt-6 border-t border-neutral-100">
                <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-3">Materials</span>
                <h3 className="text-lg font-extrabold tracking-[0.05em] uppercase mb-3">Premium Fabrication</h3>
                <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
                  Heavyweight French terry at 380 GSM. Custom-milled organic cotton. European linen with stone-washed finish. Technical ripstop with water-resistant coating. Every fabric is chosen for its hand feel, drape, and longevity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drops Philosophy */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase">Drops & Capsules</span>
            <h2 className="text-2xl font-extrabold tracking-[0.05em] uppercase">Curated. Limited. Intentional.</h2>
            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
              We release in capsules — small, deliberate collections built around a central design narrative. Each drop is produced in limited quantities and rarely restocked. This isn't scarcity for its own sake; it's a commitment to quality over volume. When a piece is gone, it enters the archive.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {["CAPSULE DROPS", "LIMITED EDITIONS", "ARCHIVE GRADED"].map((tag) => (
                <span key={tag} className="text-[8px] font-extrabold tracking-widest text-neutral-500 border border-neutral-200 px-3 py-1.5 uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"
              alt="Curated collection"
              className="w-full aspect-[4/3] object-cover border border-neutral-200/60"
            />
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border-t border-neutral-200/80 pt-8 flex justify-between items-center text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
          <span>EST. 2026</span>
          <span>MILAN — SEOUL — LONDON</span>
          <span>SS26 COLLECTION</span>
        </div>
      </section>
    </main>
  );
}

