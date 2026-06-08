import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";

export function Help() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-neutral-900 pb-20">
      {/* Page Header */}
      <section className="relative py-20 text-center border-b border-neutral-200/60 max-w-7xl mx-auto px-6">
        <span className="text-[10px] font-bold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          SUPPORT HUB
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.15em] font-sans uppercase mb-6">
          HELP & FAQS
        </h1>
        <p className="text-neutral-500 max-w-2xl mx-auto text-sm tracking-wide leading-relaxed font-light">
          Find sizing guides, shipping timelines, returns portals, and general support.
        </p>
      </section>

      {/* Accordion FAQs Section */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold tracking-widest uppercase mb-8 text-neutral-800 text-center">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full bg-white border border-neutral-200/60 rounded-md p-6 shadow-sm">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xs font-bold tracking-wider uppercase text-neutral-700 hover:text-black">
              When does the next drop release?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-500 font-light leading-relaxed">
              We release custom capsule drops and archives on a rolling schedule. Sign up for our newsletter to get early access and SMS alerts for upcoming releases.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xs font-bold tracking-wider uppercase text-neutral-700 hover:text-black">
              What are your shipping rates and times?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-500 font-light leading-relaxed">
              Standard domestic shipping takes 3-5 business days. International orders typically ship via DHL Express and arrive within 5-7 business days. Free shipping applies on orders above $200.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xs font-bold tracking-wider uppercase text-neutral-700 hover:text-black">
              What is your return policy?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-500 font-light leading-relaxed">
              We accept returns on all unworn, tag-attached items within 14 days of delivery. Custom collections or limited-run archive drops are exchange-only.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xs font-bold tracking-wider uppercase text-neutral-700 hover:text-black">
              How do I determine my size?
            </AccordionTrigger>
            <AccordionContent className="text-neutral-500 font-light leading-relaxed">
              Most of our garments feature an intentional oversized, boxy box cut. We recommend ordering your true size for the intended streetwear silhouette, or sizing down if you prefer a structured, closer fit.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Contact Support info box */}
        <div className="mt-12 bg-[#b2533e]/5 border border-[#b2533e]/15 rounded-md p-6 text-center">
          <h3 className="text-sm font-bold tracking-wider uppercase text-[#b2533e] mb-2">
            Need further assistance?
          </h3>
          <p className="text-neutral-600 text-xs font-light mb-4">
            Our support desk is open Monday to Friday, 9:00 AM – 6:00 PM GMT.
          </p>
          <a 
            href="mailto:support@dripdoggy.com"
            className="inline-block border border-neutral-900 text-neutral-900 bg-white hover:bg-neutral-900 hover:text-white text-[10px] font-bold tracking-widest px-6 py-3 rounded-sm uppercase transition-colors"
          >
            Email Support Desk
          </a>
        </div>
      </section>
    </main>
  );
}
