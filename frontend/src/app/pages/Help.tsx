import { useState, useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";
import { getSitePages } from "../lib/content-store";

export function Help() {
  const [pageData, setPageData] = useState(() => getSitePages().find(p => p.slug === "help"));

  useEffect(() => {
    const handleUpdate = () => {
      setPageData(getSitePages().find(p => p.slug === "help"));
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("dd-content-changed" as any, handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("dd-content-changed" as any, handleUpdate);
    };
  }, []);

  const hero = pageData?.hero || {
    tag: "SUPPORT HUB",
    heading: "Help & FAQs",
    description: "Shipping timelines, returns, size guides, and everything you need to know about your order.",
    active: true
  };

  if (pageData && !pageData.active) return null;

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#030213] pb-20 font-sans antialiased selection:bg-neutral-200">
      {/* Page Header */}
      {hero.active && (
        <section className="relative py-20 text-center border-b border-neutral-200/80 max-w-7xl mx-auto px-6">
          <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
            {hero.tag}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] uppercase mb-4">
            {hero.heading}
          </h1>
          <p className="text-neutral-500 max-w-xl mx-auto text-xs tracking-wide leading-relaxed font-medium">
            {hero.description}
          </p>
        </section>
      )}

      {/* Quick Links Grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Shipping Info", desc: "Delivery times & rates", anchor: "shipping" },
            { label: "Returns & Exchanges", desc: "14-day policy & process", anchor: "returns" },
            { label: "Size Guide", desc: "Find your perfect fit", anchor: "sizing" },
            { label: "Order Support", desc: "Track & manage orders", anchor: "orders" },
          ].map((item) => (
            <a key={item.anchor} href={`#${item.anchor}`}
              className="group bg-white border border-neutral-200/80 p-6 hover:border-[#030213]/40 transition-all duration-200 no-underline">
              <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase block mb-1">{item.label}</span>
              <span className="text-[11px] text-neutral-500 font-medium">{item.desc}</span>
            </a>
          ))}
        </div>

        {/* FAQ Accordion */}
        <h2 className="text-lg font-extrabold tracking-[0.1em] uppercase mb-8 text-[#030213]">Frequently Asked Questions</h2>

        <Accordion type="single" collapsible className="w-full bg-white border border-neutral-200/80 divide-y divide-neutral-100">
          {/* Shipping */}
          <AccordionItem value="shipping" id="shipping">
            <AccordionTrigger className="px-6 py-5 text-xs font-extrabold tracking-wider uppercase text-[#030213] hover:bg-neutral-50/50 transition-colors [&[data-state=open]]:bg-neutral-50/50">
              What are your shipping rates and timelines?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-neutral-500 text-xs leading-relaxed font-medium">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="border border-neutral-200/60 p-4">
                    <span className="text-[8px] font-extrabold tracking-widest text-[#030213] uppercase block mb-2">Standard Delivery</span>
                    <p className="text-[11px] font-medium">3–5 business days across all major metros.</p>
                    <p className="text-[9px] text-green-700 font-extrabold tracking-wider uppercase mt-2">Free on orders above ₹1,999</p>
                  </div>
                  <div className="border border-neutral-200/60 p-4">
                    <span className="text-[8px] font-extrabold tracking-widest text-[#030213] uppercase block mb-2">Express Shipping</span>
                    <p className="text-[11px] font-medium">Next working day dispatch. ₹150 flat rate.</p>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase mt-2">COD available on all orders</p>
                  </div>
                </div>
                <div className="bg-neutral-50/50 border border-neutral-200/60 p-4 flex items-start gap-3">
                  <span className="text-[8px] font-extrabold tracking-wider uppercase text-neutral-600 flex-shrink-0">Note:</span>
                  <span className="text-[10px] text-neutral-500 font-medium">All orders are dispatched within 24 hours. Tracking updates are sent via SMS and email once your package is handed to the courier partner.</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Returns */}
          <AccordionItem value="returns" id="returns">
            <AccordionTrigger className="px-6 py-5 text-xs font-extrabold tracking-wider uppercase text-[#030213] hover:bg-neutral-50/50 transition-colors [&[data-state=open]]:bg-neutral-50/50">
              What is your return and exchange policy?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-neutral-500 text-xs leading-relaxed font-medium">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="border border-neutral-200/60 p-4">
                    <span className="text-[8px] font-extrabold tracking-widest text-green-700 uppercase block mb-2">Returns</span>
                    <p className="text-[11px] font-medium">Unworn items with tags attached accepted within 14 days of delivery.</p>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase mt-2">Free pickup for eligible items</p>
                  </div>
                  <div className="border border-neutral-200/60 p-4">
                    <span className="text-[8px] font-extrabold tracking-widest text-[#b2533e] uppercase block mb-2">Exchanges</span>
                    <p className="text-[11px] font-medium">Size exchanges are processed with complimentary pickup and re-delivery across India.</p>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase mt-2">Limited-edition drops: exchange only</p>
                  </div>
                </div>
                <div className="bg-amber-50/50 border border-amber-200/60 p-4">
                  <p className="text-[9px] font-extrabold tracking-wider text-amber-700 uppercase">
                    Custom collections and archive drops are exchange-only. Final sale items cannot be returned.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Size Guide */}
          <AccordionItem value="sizing" id="sizing">
            <AccordionTrigger className="px-6 py-5 text-xs font-extrabold tracking-wider uppercase text-[#030213] hover:bg-neutral-50/50 transition-colors [&[data-state=open]]:bg-neutral-50/50">
              How do I find my size?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-neutral-500 text-xs leading-relaxed font-medium">
              <div className="space-y-4">
                <p className="text-[11px] font-medium">Most Drip Doggy garments feature an intentionally oversized, boxy silhouette. We recommend:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { size: "XS–S", fit: "Slim / Cropped", desc: "True-to-size for a structured fit" },
                    { size: "M–L", fit: "Oversized / Relaxed", desc: "Intended streetwear silhouette" },
                    { size: "XL–XXL", fit: "Extended / Draped", desc: "Loose, layered, and volumetric" },
                  ].map((s) => (
                    <div key={s.size} className="border border-neutral-200/60 p-4 text-center">
                      <span className="text-sm font-extrabold text-[#030213] block">{s.size}</span>
                      <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase block mt-1">{s.fit}</span>
                      <span className="text-[9px] text-neutral-400 font-medium mt-1 block">{s.desc}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-neutral-50/50 border border-neutral-200/60 p-4 flex items-start gap-3">
                  <span className="text-[8px] font-extrabold tracking-wider uppercase text-neutral-600 flex-shrink-0">Tip:</span>
                  <span className="text-[10px] text-neutral-500 font-medium">Check the product page for individual garment measurements. Each piece has specific dimensions listed under the specs tab.</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Orders */}
          <AccordionItem value="orders" id="orders">
            <AccordionTrigger className="px-6 py-5 text-xs font-extrabold tracking-wider uppercase text-[#030213] hover:bg-neutral-50/50 transition-colors [&[data-state=open]]:bg-neutral-50/50">
              How do I track or cancel my order?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-neutral-500 text-xs leading-relaxed font-medium">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="border border-neutral-200/60 p-4">
                    <span className="text-[8px] font-extrabold tracking-widest text-[#030213] uppercase block mb-2">Track Your Order</span>
                    <p className="text-[11px] font-medium">Visit your Account Dashboard → Order History to view real-time tracking updates for every order.</p>
                  </div>
                  <div className="border border-neutral-200/60 p-4">
                    <span className="text-[8px] font-extrabold tracking-widest text-red-500 uppercase block mb-2">Cancel Order</span>
                    <p className="text-[11px] font-medium">Orders can be cancelled within 1 hour of placement. Once dispatched, please initiate a return instead.</p>
                  </div>
                </div>
                <div className="bg-neutral-50/50 border border-neutral-200/60 p-4">
                  <p className="text-[9px] font-extrabold tracking-wider text-neutral-600 uppercase">Need help? Contact support with your order ID.</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Payments */}
          <AccordionItem value="payments">
            <AccordionTrigger className="px-6 py-5 text-xs font-extrabold tracking-wider uppercase text-[#030213] hover:bg-neutral-50/50 transition-colors [&[data-state=open]]:bg-neutral-50/50">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-neutral-500 text-xs leading-relaxed font-medium">
              <p className="text-[11px] font-medium mb-4">We currently offer Cash on Delivery (COD) across all serviceable pin codes. Pay with cash upon delivery — no extra charges.</p>
              <div className="bg-neutral-50/50 border border-neutral-200/60 p-4 flex items-start gap-3">
                <span className="text-[8px] font-extrabold tracking-wider uppercase text-neutral-600 flex-shrink-0">Coming Soon:</span>
                <span className="text-[10px] text-neutral-500 font-medium">UPI, credit/debit cards, and net banking are being integrated for a seamless checkout experience.</span>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Product Care */}
          <AccordionItem value="care">
            <AccordionTrigger className="px-6 py-5 text-xs font-extrabold tracking-wider uppercase text-[#030213] hover:bg-neutral-50/50 transition-colors [&[data-state=open]]:bg-neutral-50/50">
              How do I care for my Drip Doggy garments?
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-neutral-500 text-xs leading-relaxed font-medium">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { title: "Machine Wash Cold", desc: "Turn inside out. Use mild detergent. Do not bleach." },
                  { title: "Hang or Flat Dry", desc: "Avoid tumble drying. Reshape while damp to maintain structure." },
                  { title: "Cool Iron", desc: "Iron on low heat. Avoid direct contact with prints or hardware." },
                ].map((c) => (
                  <div key={c.title} className="border border-neutral-200/60 p-4">
                    <span className="text-[8px] font-extrabold tracking-widest text-[#030213] uppercase block mb-1">{c.title}</span>
                    <span className="text-[9px] text-neutral-500 font-medium">{c.desc}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Contact Block */}
        <div className="mt-12 border border-neutral-200/80 bg-white p-8 text-center">
          <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-3">Still need help?</span>
          <h3 className="text-lg font-extrabold tracking-[0.1em] uppercase mb-3">Contact Support</h3>
          <p className="text-xs text-neutral-500 font-medium mb-6 max-w-md mx-auto">
            Our support desk is open Monday to Friday, 9:00 AM – 6:00 PM IST. We respond within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:support@dripdoggy.com"
              className="bg-[#030213] hover:bg-neutral-800 text-white px-6 py-3 text-[9px] font-extrabold tracking-widest uppercase transition-colors no-underline">
              Email Support
            </a>
            <a href="tel:+919876543210"
              className="border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-6 py-3 text-[9px] font-extrabold tracking-widest uppercase transition-colors no-underline">
              Call Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

