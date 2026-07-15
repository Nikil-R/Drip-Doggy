import { Link } from "react-router";

export function ClientServices() {
  const SERVICES_SECTIONS = [
    {
      title: "Order Support",
      tagline: "Need help with your order? Contact us for:",
      bullets: [
        "Order status and tracking",
        "Order modifications (before dispatch)",
        "Cancellation requests (if eligible)",
        "Product-related queries"
      ]
    },
    {
      title: "Shipping Support",
      desc: "We currently process all orders with care and provide tracking details once your order has been dispatched."
    },
    {
      title: "Returns & Exchanges",
      desc: "We offer a 24-hour return request window from the time your order is delivered.",
      subtitle: "To be eligible:",
      bullets: [
        "The item must be unused and in its original condition.",
        "Original tags and packaging must be intact.",
        "Return requests made after 24 hours may not be accepted."
      ]
    },
    {
      title: "Payments",
      desc: "Online payment options such as UPI, Cards, Net Banking, and Wallets are currently under development and will be available soon.\n\nFor now, payment methods are being processed as we prepare for launch."
    },
    {
      title: "Product Assistance",
      desc: "Need help choosing the right size or product?\nPlease refer to our Size Guide or contact our support team before placing your order."
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
          Client Services
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto text-xs tracking-wide leading-relaxed font-medium">
          Welcome to DripDoggy Client Services. We're committed to providing a smooth shopping experience 
          from the moment you place your order until it reaches your doorstep. If you need any assistance, 
          our team is here to help.
        </p>
      </section>

      {/* Services Content Sections */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {SERVICES_SECTIONS.map((section, idx) => (
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
              {section.subtitle && (
                <p className="text-[11px] text-neutral-800 font-bold uppercase tracking-widest pt-2">{section.subtitle}</p>
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
              If you have any questions or need assistance, we're always happy to help. Our support team aims 
              to respond as quickly as possible and ensure you have the best experience with DripDoggy.
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
