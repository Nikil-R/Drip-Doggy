import { Link } from "react-router";

export function Returns() {
  const POLICY_SECTIONS = [
    {
      title: "Eligibility for Returns",
      bullets: [
        "Return requests must be raised within 24 hours of receiving the order.",
        "The product must be unused, unwashed, and in its original condition with all original tags, packaging, and accessories intact.",
        "An unboxing video is required for claims related to damaged, defective, missing, or incorrect items.",
        "Products showing signs of use, washing, alteration, or damage caused after delivery are not eligible for return."
      ]
    },
    {
      title: "Non-Returnable Items",
      tagline: "Returns will not be accepted for:",
      bullets: [
        "Products requested after the 24-hour return window.",
        "Items without original tags or packaging.",
        "Products that have been used, washed, or altered."
      ]
    },
    {
      title: "Return Process",
      numbered: [
        "Contact our Support Team within 24 hours of delivery.",
        "Share your Order ID, clear photos, and the unboxing video.",
        "Our team will review your request within 1–2 business days.",
        "If approved, we will arrange a return or replacement based on availability."
      ]
    },
    {
      title: "Refunds",
      desc: "Approved refunds will be processed after the returned product passes our quality inspection.\n\nRefunds will be issued to the original payment method (or store credit, if applicable) within 5–7 business days after approval."
    },
    {
      title: "Exchanges",
      desc: "Exchanges are available only for eligible products, subject to stock availability."
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#030213] pb-24 font-sans antialiased selection:bg-neutral-200">
      {/* Page Header */}
      <section className="relative py-10 text-center border-b border-neutral-200/80 max-w-7xl mx-auto px-6">
        <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          SUPPORT HUB
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] uppercase mb-4">
          Return Policy
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto text-xs tracking-wide leading-relaxed font-medium">
          At DripDoggy, customer satisfaction is important to us. If you receive a damaged, defective, 
          or incorrect product, you may request a return within 24 hours of delivery.
        </p>
        <span className="text-[8px] font-bold text-neutral-400 tracking-widest uppercase mt-4 block">
          Last Updated: July 2026
        </span>
      </section>

      {/* Policy Content Sections */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {POLICY_SECTIONS.map((section, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <span className="text-[9px] font-black tracking-[0.25em] text-[#030213]/40 uppercase block pt-1">
                {String(idx + 1).padStart(2, "0")} / {section.title}
              </span>
            </div>
            <div className="md:col-span-8 space-y-4">
              <h2 className="text-lg font-extrabold tracking-[0.05em] uppercase">
                {section.title}
              </h2>
              {section.tagline && (
                <p className="text-[12px] text-neutral-800 font-bold uppercase tracking-wider">{section.tagline}</p>
              )}
              {section.desc && (
                <p className="text-[12px] text-neutral-600 font-medium leading-relaxed tracking-wide whitespace-pre-line">
                  {section.desc}
                </p>
              )}
              {section.bullets && (
                <ul className="list-disc pl-5 space-y-2">
                  {section.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx} className="text-[11px] text-neutral-500 font-medium tracking-wide">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {section.numbered && (
                <ol className="list-decimal pl-5 space-y-2">
                  {section.numbered.map((numItem, numIdx) => (
                    <li key={numIdx} className="text-[11px] text-neutral-500 font-medium tracking-wide">
                      {numItem}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Need Help Footer Banner */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-[#030213] text-white p-12 text-center space-y-6">
          <div className="space-y-2">
            <span className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase block">NEED HELP?</span>
            <p className="text-sm text-white/70 max-w-md mx-auto font-medium">
              If you have any questions regarding returns, please contact our Customer Support team. We're always happy to help.
            </p>
          </div>
          <Link to="/contact" className="inline-flex bg-white text-[#030213] text-[9px] font-black tracking-widest px-8 py-3 uppercase no-underline hover:bg-white/95 transition-all">
            Contact Support Page
          </Link>
          <div className="pt-4 border-t border-white/10 space-y-1">
            <p className="text-[10px] font-black tracking-widest uppercase">DripDoggy</p>
            <p className="text-[9px] text-[#b2533e] font-black tracking-widest uppercase">Drip Your Way, Every Day.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
