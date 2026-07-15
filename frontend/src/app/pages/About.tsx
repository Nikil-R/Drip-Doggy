export function About() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#030213] pb-24 font-sans antialiased selection:bg-neutral-200">
      {/* Editorial Hero Header */}
      <section className="relative py-12 text-center border-b border-neutral-200/80 max-w-7xl mx-auto px-10">
        <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          EST. BENGALURU, INDIA
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-[0.05em] uppercase mb-6">
          About DripDoggy
        </h1>
        <p className="text-neutral-500 max-w-2xl mx-auto text-sm tracking-wide leading-relaxed font-medium">
          DripDoggy is a premium denim and contemporary streetwear brand born in Bengaluru, India. 
          Built on the belief that clothing should be more than just fashion, we create pieces that 
          reflect individuality, confidence, and self-expression.
        </p>
      </section>

      {/* Brand Narrative Sections */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <span className="text-[9px] font-black tracking-[0.25em] text-[#030213]/40 uppercase block pt-1">
              01 / CRAFTSMANSHIP
            </span>
          </div>
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-lg font-extrabold tracking-[0.05em] uppercase">Premium Denim & Streetwear</h2>
            <p className="text-[12px] text-neutral-600 font-medium leading-relaxed tracking-wide">
              Our focus is on premium craftsmanship, distinctive artwork, and thoughtfully designed collections 
              that blend modern street culture with timeless denim. Every garment is carefully developed with 
              attention to quality, comfort, and detail, ensuring it not only looks exceptional but also feels 
              made to last.
            </p>
          </div>
        </div>

        <div className="h-px bg-neutral-200/60" />

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <span className="text-[9px] font-black tracking-[0.25em] text-[#030213]/40 uppercase block pt-1">
              02 / INDIVIDUALITY
            </span>
          </div>
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-lg font-extrabold tracking-[0.05em] uppercase">Narratives Over Trends</h2>
            <p className="text-[12px] text-neutral-600 font-medium leading-relaxed tracking-wide">
              At DripDoggy, we believe every collection should tell a story. Inspired by creativity, music, art, 
              and culture, our designs are made for individuals who choose originality over ordinary. We don't 
              simply follow trends—we create pieces that help people express who they are.
            </p>
          </div>
        </div>

        <div className="h-px bg-neutral-200/60" />

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <span className="text-[9px] font-black tracking-[0.25em] text-[#030213]/40 uppercase block pt-1">
              03 / PRODUCTION
            </span>
          </div>
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-lg font-extrabold tracking-[0.05em] uppercase">Intentional Volumes</h2>
            <p className="text-[12px] text-neutral-600 font-medium leading-relaxed tracking-wide">
              Every stitch, every wash, and every graphic is crafted with purpose. By producing limited collections 
              and maintaining high-quality standards, we aim to deliver an exclusive experience that our 
              customers can wear with confidence.
            </p>
          </div>
        </div>

        <div className="h-px bg-neutral-200/60" />

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <span className="text-[9px] font-black tracking-[0.25em] text-[#030213]/40 uppercase block pt-1">
              04 / COMMUNITY
            </span>
          </div>
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-lg font-extrabold tracking-[0.05em] uppercase">The Syndicate</h2>
            <p className="text-[12px] text-neutral-600 font-medium leading-relaxed tracking-wide">
              DripDoggy is more than a fashion brand—it's a community built for creators, dreamers, and those who 
              dare to stand out. As we grow, we remain committed to delivering premium fashion with authentic design, 
              exceptional craftsmanship, and meaningful storytelling.
            </p>
          </div>
        </div>
      </section>

      {/* Manifesto Callout Banner */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-[#030213] text-white p-12 md:p-18 text-center relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <span className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase block">MOTTO</span>
            <p className="text-2xl md:text-3xl font-extrabold leading-tight tracking-wide uppercase italic">
              "Drip Your Way, Every Day."
            </p>
            <div className="h-px w-16 bg-white/20 mx-auto mt-4" />
          </div>
        </div>
      </section>
    </main>
  );
}
