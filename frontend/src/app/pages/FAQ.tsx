import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";
import { Link } from "react-router";

export function FAQ() {
  const FAQ_SECTIONS = [
    {
      title: "Orders",
      items: [
        {
          q: "How do I place an order?",
          a: "Browse our collection, select your preferred size, and click Add to Cart. Proceed to checkout, enter your shipping details, and place your order."
        },
        {
          q: "Can I cancel my order?",
          a: "Orders can only be cancelled before they are confirmed for shipping. Once your order has been shipped, cancellations are not possible."
        },
        {
          q: "Can I change my order after placing it?",
          a: "If your order has not been processed yet, please contact our support team as soon as possible. We'll do our best to assist you."
        }
      ]
    },
    {
      title: "Shipping",
      items: [
        {
          q: "How long does delivery take?",
          a: "Orders are typically delivered within 3–7 business days, depending on your location."
        },
        {
          q: "Do you ship across India?",
          a: "Yes. We currently ship to most serviceable locations across India."
        },
        {
          q: "How can I track my order?",
          a: "Once your order is shipped, you'll receive a tracking link via SMS or email."
        }
      ]
    },
    {
      title: "Returns & Exchanges",
      items: [
        {
          q: "What is your return policy?",
          a: "Returns are accepted within 24 hours of delivery. The product must be unused, unwashed, in its original condition, and returned with all original tags and packaging."
        },
        {
          q: "Can I exchange my product?",
          a: "Yes. Exchanges are available for eligible products, subject to stock availability."
        },
        {
          q: "Are sale items eligible for returns or exchanges?",
          a: "Sale or clearance items are generally not eligible for returns or exchanges unless the product arrives damaged or defective."
        }
      ]
    },
    {
      title: "Products",
      items: [
        {
          q: "How do I choose the correct size?",
          a: "Please refer to our Size Guide before placing your order to ensure the best fit."
        },
        {
          q: "Will the product look exactly like the photos?",
          a: "We make every effort to display our products accurately. However, slight colour variations may occur due to different screen settings and lighting conditions."
        },
        {
          q: "How should I care for my garments?",
          a: "Please follow the care instructions provided on the garment label to maintain the quality and longevity of your product."
        }
      ]
    },
    {
      title: "Payments",
      items: [
        {
          q: "What payment methods do you accept?",
          a: "At the moment, Cash on Delivery (COD) is the only payment method available.\n\nSecure online payment options such as UPI, Credit Cards, Debit Cards, Net Banking, and Wallets are currently under development and will be available soon."
        },
        {
          q: "Is Cash on Delivery (COD) available?",
          a: "Yes. Cash on Delivery is available for eligible serviceable locations across India."
        },
        {
          q: "When will online payments be available?",
          a: "We're actively working to introduce secure online payment methods. These features are currently in progress and will be launched soon."
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          q: "How can I contact DripDoggy?",
          a: "You can reach us through our Contact Support page or by emailing our customer support team. We aim to respond to all enquiries as quickly as possible."
        },
        {
          q: "What are your customer support hours?",
          a: "Monday – Saturday\n10:00 AM – 6:00 PM (IST)"
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#030213] pb-24 font-sans antialiased selection:bg-neutral-200">
      {/* Header */}
      <section className="relative py-10 text-center border-b border-neutral-200/80 max-w-7xl mx-auto px-6">
        <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          SUPPORT HUB
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-[0.05em] uppercase mb-6">
          Help & FAQ
        </h1>
        <p className="text-neutral-500 max-w-2xl mx-auto text-xs tracking-wide leading-relaxed font-medium">
          Welcome to DripDoggy! We've answered some of the most common questions below. 
          If you still need assistance, feel free to contact our support team.
        </p>
      </section>

      {/* Accordions */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {FAQ_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-[10px] font-black tracking-[0.25em] text-[#030213]/40 uppercase pb-2 border-b border-neutral-200/60">
              {section.title}
            </h2>
            <Accordion type="single" collapsible className="w-full bg-white border border-neutral-200/60 divide-y divide-neutral-100">
              {section.items.map((item, itemIdx) => (
                <AccordionItem key={itemIdx} value={`${idx}-${itemIdx}`}>
                  <AccordionTrigger className="px-6 py-4.5 text-[11px] font-extrabold tracking-wider uppercase text-[#030213] text-left hover:bg-neutral-50/50 transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-neutral-500 text-[11px] leading-relaxed font-medium whitespace-pre-line">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </section>

      {/* Still Need Help CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-[#030213] text-white p-12 text-center space-y-6">
          <div className="space-y-2">
            <span className="text-[8px] font-black tracking-[0.3em] text-white/40 uppercase block">STILL NEED HELP?</span>
            <p className="text-sm text-white/70 max-w-md mx-auto font-medium">
              If you couldn't find the answer you were looking for, our support team is always here to help.
            </p>
          </div>
          <Link to="/contact" className="inline-flex bg-white text-[#030213] text-[9px] font-black tracking-widest px-8 py-3 uppercase no-underline hover:bg-white/95 transition-all">
            Visit Contact Support
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
