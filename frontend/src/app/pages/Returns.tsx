import { ArrowRight, RotateCcw, RefreshCw, Ruler, Shield, AlertTriangle, Check, Truck } from "lucide-react";
import { Link } from "react-router";

const RETURN_STEPS = [
  {
    icon: RotateCcw,
    title: "Initiate Return",
    desc: "Log into your Account Dashboard and select the order you wish to return. Choose the items and reason for return. Alternatively, contact our support team with your Order ID.",
  },
  {
    icon: Check,
    title: "Get Approved",
    desc: "Our team reviews your request within 24 hours. Once approved, you'll receive a return authorization and pickup schedule via email and SMS.",
  },
  {
    icon: Truck,
    title: "Ship It Back",
    desc: "Pack the items securely in their original packaging with all tags attached. Our courier partner will pick up the package from your address within 3–5 business days — at no cost to you.",
  },
  {
    icon: RefreshCw,
    title: "Refund Processed",
    desc: "Once we receive and inspect the items, your refund is processed within 7 business days. The amount is credited back to your original payment method. For COD orders, we'll arrange a bank transfer.",
  },
];

const SIZE_CHART = [
  { size: "XS", bust: "30–31\"", waist: "23–24\"", hip: "33–34\"", uk: "4–6", us: "0–2" },
  { size: "S", bust: "32–33\"", waist: "25–26\"", hip: "35–36\"", uk: "8–10", us: "4–6" },
  { size: "M", bust: "34–35\"", waist: "27–28\"", hip: "37–38\"", uk: "10–12", us: "6–8" },
  { size: "L", bust: "36–37\"", waist: "29–30\"", hip: "39–40\"", uk: "14–16", us: "10–12" },
  { size: "XL", bust: "38–40\"", waist: "31–33\"", hip: "41–43\"", uk: "16–18", us: "12–14" },
  { size: "XXL", bust: "41–43\"", waist: "34–36\"", hip: "44–46\"", uk: "18–20", us: "14–16" },
];

const CARE_INSTRUCTIONS = [
  { title: "Machine Wash Cold", desc: "Turn inside out. Use mild detergent. Do not bleach. Wash with like colors." },
  { title: "Hang or Flat Dry", desc: "Avoid tumble drying. Reshape while damp to maintain the garment's structural integrity." },
  { title: "Cool Iron", desc: "Iron on low heat. Avoid direct contact with prints, embroidery, or hardware details." },
  { title: "Dry Clean (Recommended)", desc: "For structured pieces and outerwear, professional dry cleaning is recommended to preserve the silhouette." },
];

export function Returns() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#030213] pb-20 font-sans antialiased selection:bg-neutral-200">
      {/* ─── Page Header ─── */}
      <section className="relative py-20 text-center border-b border-neutral-200/80 max-w-7xl mx-auto px-6">
        <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          CLIENT SERVICES
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] uppercase mb-4">
          Returns & Size Guide
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto text-xs tracking-wide leading-relaxed font-medium">
          Hassle-free returns, complimentary exchanges, and detailed sizing guidance to help you find
          your perfect fit in the Drip Doggy silhouette.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        {/* ─── Return Process ─── */}
        <div>
          <span className="text-[8px] font-black tracking-[0.3em] text-[#b2533e] uppercase block mb-2">
            Easy Returns
          </span>
          <h2 className="text-xl font-extrabold tracking-[0.05em] uppercase mb-6">
            Return Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {RETURN_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="bg-white border border-neutral-200/80 p-6 relative">
                  <span className="text-[10px] font-extrabold text-neutral-200 absolute top-4 right-4">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <Icon className="h-5 w-5 text-neutral-600 stroke-[1.5] mb-3" />
                  <h3 className="text-[11px] font-extrabold tracking-[0.1em] uppercase text-[#030213] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Policy Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Returns */}
          <div className="bg-white border border-neutral-200/80 p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 border border-green-200 flex items-center justify-center">
                <RotateCcw className="h-4.5 w-4.5 text-green-600 stroke-[1.5]" />
              </div>
              <div>
                <span className="text-[8px] font-extrabold tracking-[0.2em] text-green-700 uppercase block">
                  Policy
                </span>
                <h3 className="text-sm font-extrabold uppercase tracking-tight">Returns</h3>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mb-5">
              We accept returns on unworn, unwashed items with all tags and original packaging
              within <span className="font-extrabold text-[#030213]">14 calendar days</span> of
              delivery. Free pickup is arranged for eligible items.
            </p>
            <div className="space-y-2.5">
              {[
                "Items must be unworn, unwashed, and free of any odor or stains",
                "All original tags must be attached and intact",
                "Original packaging including garment bag must be included",
                "Free pickup arranged within 3–5 business days of approval",
                "Refund processed within 7 business days of receiving the return",
                "Refund credited to original payment method (bank transfer for COD)",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-green-600 text-[10px] mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-[10px] text-neutral-500 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-white border border-neutral-200/80 p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 border border-[#b2533e]/20 flex items-center justify-center">
                <RefreshCw className="h-4.5 w-4.5 text-[#b2533e] stroke-[1.5]" />
              </div>
              <div>
                <span className="text-[8px] font-extrabold tracking-[0.2em] text-[#b2533e] uppercase block">
                  Policy
                </span>
                <h3 className="text-sm font-extrabold uppercase tracking-tight">Exchanges</h3>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mb-5">
              Size exchanges are processed with <span className="font-extrabold text-[#030213]">complimentary</span>{" "}
              pickup and re-delivery across India within 14 days of delivery.
            </p>
            <div className="space-y-2.5">
              {[
                "Complimentary size exchange within 14 calendar days",
                "Free pickup and re-delivery across all serviceable pin codes",
                "Exchange processed and dispatched within 5–7 business days",
                "Limited-edition drops and archive pieces: exchange only (no returns)",
                "Custom collections: exchange only, subject to availability",
                "Price differences adjusted — refund or charge as applicable",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <span className="text-[#b2533e] text-[10px] mt-0.5 flex-shrink-0">→</span>
                  <span className="text-[10px] text-neutral-500 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-50/50 border border-amber-200/60 p-5 flex items-start gap-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 stroke-[1.5] flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[8px] font-extrabold tracking-[0.2em] text-amber-700 uppercase block mb-1">
              Important Notes
            </span>
            <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
              Archive drops, limited-edition capsules, and custom collections are exchange-only and
              cannot be returned for a refund. All final sale items are clearly marked on the product
              page. International returns are not available at this time.
            </p>
          </div>
        </div>

        {/* ─── Size Guide ─── */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Ruler className="h-4.5 w-4.5 text-neutral-400 stroke-[1.5]" />
            <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase">
              Size Guide & Fit Recommendations
            </span>
          </div>

          {/* Fit Philosophy */}
          <div className="bg-white border border-neutral-200/80 p-8 mb-8">
            <h3 className="text-[11px] font-extrabold tracking-[0.1em] uppercase text-[#030213] mb-3">
              The Drip Doggy Silhouette
            </h3>
            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mb-6">
              Most Drip Doggy garments feature an intentionally oversized, architectural silhouette.
              Our fit philosophy prioritizes drape and volume over a restrictive fit. Use the guide
              below to find your ideal size, and when in doubt, we recommend sizing down for a
              structured look or staying true to size for the intended streetwear silhouette.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { size: "XS – S", fit: "Slim / Cropped", desc: "True-to-size for a structured, fitted look. Ideal for layering under outerwear." },
                { size: "M – L", fit: "Oversized / Relaxed", desc: "The intended Drip Doggy silhouette. Relaxed through the body with room to layer." },
                { size: "XL – XXL", fit: "Extended / Draped", desc: "Loose, volumetric, and avant-garde. Maximum drape for an editorial silhouette." },
              ].map((s) => (
                <div key={s.size} className="border border-neutral-200/60 p-5">
                  <span className="text-base font-extrabold text-[#030213] block">{s.size}</span>
                  <span className="text-[8px] font-extrabold tracking-widest text-[#b2533e] uppercase block mt-1 mb-1.5">
                    {s.fit}
                  </span>
                  <span className="text-[9px] text-neutral-400 font-medium">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Size Chart Table */}
          <div className="bg-white border border-neutral-200/80 overflow-x-auto mb-8">
            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/50">
                  <th className="px-6 py-3.5 font-extrabold tracking-wider uppercase text-neutral-600">Size</th>
                  <th className="px-6 py-3.5 font-extrabold tracking-wider uppercase text-neutral-600">Bust</th>
                  <th className="px-6 py-3.5 font-extrabold tracking-wider uppercase text-neutral-600">Waist</th>
                  <th className="px-6 py-3.5 font-extrabold tracking-wider uppercase text-neutral-600">Hip</th>
                  <th className="px-6 py-3.5 font-extrabold tracking-wider uppercase text-neutral-600">UK</th>
                  <th className="px-6 py-3.5 font-extrabold tracking-wider uppercase text-neutral-600">US</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-extrabold text-[#030213]">{row.size}</td>
                    <td className="px-6 py-3.5 text-neutral-500 font-medium">{row.bust}</td>
                    <td className="px-6 py-3.5 text-neutral-500 font-medium">{row.waist}</td>
                    <td className="px-6 py-3.5 text-neutral-500 font-medium">{row.hip}</td>
                    <td className="px-6 py-3.5 text-neutral-500 font-medium">{row.uk}</td>
                    <td className="px-6 py-3.5 text-neutral-500 font-medium">{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Measuring Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                title: "Chest / Bust",
                steps: [
                  "Measure under your arms, around the fullest part of your chest",
                  "Keep the measuring tape parallel to the floor",
                  "Ensure the tape is snug but not tight",
                ],
              },
              {
                title: "Waist",
                steps: [
                  "Measure around your natural waistline",
                  "This is the narrowest part of your torso",
                  "Keep the tape comfortably loose — not pulled tight",
                ],
              },
              {
                title: "Hips",
                steps: [
                  "Stand with feet together",
                  "Measure around the fullest part of your hips",
                  "Typically 7–9 inches below your waistline",
                ],
              },
            ].map((m) => (
              <div key={m.title} className="bg-white border border-neutral-200/80 p-5">
                <span className="text-[9px] font-extrabold tracking-widest text-[#030213] uppercase block mb-2">
                  {m.title}
                </span>
                <ol className="space-y-1">
                  {m.steps.map((step, i) => (
                    <li key={i} className="text-[9px] text-neutral-500 font-medium flex items-start gap-2">
                      <span className="text-neutral-300">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="bg-neutral-50/50 border border-neutral-200/60 p-4 flex items-start gap-3">
            <span className="text-[8px] font-extrabold tracking-wider uppercase text-neutral-600 flex-shrink-0">
              Tip:
            </span>
            <span className="text-[10px] text-neutral-500 font-medium">
              Check individual product pages for garment-specific measurements. Each piece has
              detailed dimensions (chest width, body length, sleeve length) listed under the
              specifications tab. When between sizes, we recommend sizing up for an oversized fit or
              down for a more structured silhouette.
            </span>
          </div>
        </div>

        {/* ─── Garment Care ─── */}
        <div>
          <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-6">
            Garment Care Instructions
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CARE_INSTRUCTIONS.map((c) => (
              <div key={c.title} className="bg-white border border-neutral-200/80 p-5">
                <span className="text-[8px] font-extrabold tracking-widest text-[#030213] uppercase block mb-1.5">
                  {c.title}
                </span>
                <span className="text-[9px] text-neutral-500 font-medium">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Bottom CTA ─── */}
        <div className="border border-neutral-200/80 bg-white p-8 text-center">
          <Shield className="h-6 w-6 text-neutral-300 stroke-[1.5] mx-auto mb-4" />
          <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-3">
            Need to Start a Return or Exchange?
          </span>
          <p className="text-xs text-neutral-500 font-medium mb-6 max-w-lg mx-auto">
            Log into your account dashboard to initiate a return or exchange. Our team processes all
            requests within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/account#orders"
              className="inline-flex items-center gap-2 bg-[#030213] hover:bg-neutral-800 text-white px-6 py-3 text-[9px] font-extrabold tracking-widest uppercase transition-all duration-300 no-underline group"
            >
              My Orders
              <ArrowRight className="h-3 w-3 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/contact"
              className="border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-6 py-3 text-[9px] font-extrabold tracking-widest uppercase transition-colors no-underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
