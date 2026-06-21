import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";
import { Truck, Clock, Package, CreditCard, Globe, RotateCcw, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const SHIPPING_TIERS = [
  {
    icon: Truck,
    title: "Standard Delivery",
    timeline: "3–5 Business Days",
    cost: "FREE above ₹1,999 / ₹99 flat",
    badge: "Most Popular",
    details: [
      "Dispatched within 24 hours of order confirmation",
      "Tracked shipping across all major metros",
      "SMS and email tracking updates",
      "Delivered Monday–Saturday, 9 AM – 7 PM",
    ],
  },
  {
    icon: Clock,
    title: "Express Shipping",
    timeline: "Next Working Day",
    cost: "₹150 flat rate",
    badge: "Fastest",
    details: [
      "Same-day dispatch for orders placed before 12 PM IST",
      "Priority handling and dedicated courier",
      "Real-time GPS tracking available",
      "Guaranteed next-day delivery within serviceable pin codes",
    ],
  },
  {
    icon: Package,
    title: "Store Pickup (Coming Soon)",
    timeline: "Select Locations",
    cost: "Free",
    badge: "Coming Soon",
    details: [
      "Pick up from our partner locations",
      "Zero shipping cost",
      "Ready within 2–4 hours of order placement",
      "Currently available in select metro cities",
    ],
  },
];

const FAQ_ITEMS = [
  {
    value: "delivery-timeline",
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 3–5 business days across all major Indian metros. We dispatch all orders within 24 hours of confirmation (excluding weekends and public holidays). Express shipping guarantees next-working-day delivery when you place your order before 12 PM IST. For remote locations, please allow an additional 1–2 business days.",
  },
  {
    value: "shipping-cost",
    question: "What are your shipping charges?",
    answer:
      "We offer free standard shipping on all orders above ₹1,999. Orders below this threshold are charged a flat ₹99 delivery fee. Express shipping is available at a flat ₹150 rate regardless of order value. There are no hidden charges — the price you see at checkout is the final price. COD orders include a nominal convenience fee that is clearly displayed before payment.",
  },
  {
    value: "cod",
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Yes, Cash on Delivery is available across all serviceable pin codes in India. Simply select COD at checkout — no extra paperwork or registration required. Pay in cash when your package arrives. Our delivery partner will provide a payment receipt for your records. COD is limited to orders under ₹10,000. For higher-value orders, we recommend using our secure prepaid options (coming soon).",
  },
  {
    value: "tracking",
    question: "How do I track my order?",
    answer:
      "You can track your order in real-time through your Account Dashboard under Order History. Each order receives a unique tracking number once dispatched, which is sent to you via SMS and email. You can use this tracking number on our courier partner's website for detailed shipment updates, including estimated delivery time and live GPS tracking for express shipments.",
  },
  {
    value: "international",
    question: "Do you ship internationally?",
    answer:
      "International shipping is currently in development and will launch in late 2026. We are working with global logistics partners to ensure reliable delivery to key markets including North America, Europe, Southeast Asia, and the Middle East. Subscribe to our newsletter to receive updates on our global launch. International customers may subscribe now to receive early access notifications.",
  },
  {
    value: "dispatch",
    question: "When will my order be dispatched?",
    answer:
      "All orders are dispatched within 24 hours of confirmation, Monday through Saturday. Orders placed on Sundays or public holidays are processed the next business day. During peak periods (new drops, festivals, and sale events), dispatch may take 48–72 hours. You will receive a confirmation email with tracking details the moment your package is handed to the courier.",
  },
  {
    value: "delivery-partners",
    question: "Which courier partners do you use?",
    answer:
      "We partner with leading logistics providers including Delhivery, Blue Dart, and India Post to ensure reliable nationwide coverage. For express shipping, we use premium courier services with dedicated handling. The specific courier partner for your order is determined based on your delivery pincode and the shipping method selected at checkout.",
  },
  {
    value: "pricing",
    question: "Are there any hidden charges?",
    answer:
      "No — Drip Doggy believes in transparent pricing. The price displayed on the product page and at checkout is the final amount you pay. Shipping charges (if applicable) are clearly shown before you confirm your order. We do not charge additional handling fees, packaging fees, or fuel surcharges. GST is included in all displayed prices.",
  },
  {
    value: "payment-methods",
    question: "What payment methods do you accept?",
    answer:
      "We currently accept Cash on Delivery (COD) across all serviceable pin codes. We are actively integrating UPI, credit/debit cards, and net banking through our payment partners. These options will be available in the coming months. Subscribe to our newsletter to be notified when new payment methods launch.",
  },
  {
    value: "address-change",
    question: "Can I change my shipping address after placing an order?",
    answer:
      "You can modify your shipping address within 1 hour of placing your order. Contact our support team immediately with your Order ID and the corrected address. Once the order has been dispatched, address changes may not be possible. We recommend double-checking your shipping details before confirming checkout.",
  },
];

export function FAQ() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#030213] pb-20 font-sans antialiased selection:bg-neutral-200">
      {/* ─── Page Header ─── */}
      <section className="relative py-20 text-center border-b border-neutral-200/80 max-w-7xl mx-auto px-6">
        <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          CLIENT SERVICES
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] uppercase mb-4">
          FAQ & Shipping
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto text-xs tracking-wide leading-relaxed font-medium">
          Everything you need to know about ordering, shipping, delivery, and more. Find answers to
          the most common questions below.
        </p>
      </section>

      {/* ─── Shipping Tiers ─── */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-6">
          Shipping Options
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SHIPPING_TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.title}
                className="bg-white border border-neutral-200/80 p-6 relative"
              >
                <span className="text-[7px] font-extrabold tracking-[0.25em] text-[#b2533e] uppercase block mb-1">
                  {tier.badge}
                </span>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Icon className="h-5 w-5 text-neutral-600 stroke-[1.5] mb-2" />
                    <h3 className="text-[11px] font-extrabold tracking-[0.1em] uppercase text-[#030213]">
                      {tier.title}
                    </h3>
                  </div>
                </div>
                <p className="text-[18px] font-extrabold text-[#030213] mb-0.5">{tier.timeline}</p>
                <p className="text-[9px] text-neutral-500 font-bold mb-4 uppercase tracking-wider">{tier.cost}</p>
                <ul className="space-y-1.5">
                  {tier.details.map((d) => (
                    <li key={d} className="text-[10px] text-neutral-500 font-medium flex items-start gap-2">
                      <span className="text-neutral-300 mt-0.5">—</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-neutral-50/50 border border-neutral-200/60 p-4 mt-5 flex items-start gap-3">
          <span className="text-[8px] font-extrabold tracking-wider uppercase text-neutral-600 flex-shrink-0">
            Note:
          </span>
          <span className="text-[10px] text-neutral-500 font-medium">
            All orders are dispatched within 24 hours of confirmation. Tracking updates are sent via
            SMS and email once your package is handed to the courier partner. Delivery timelines
            begin from the date of dispatch, not from the date of order placement.
          </span>
        </div>
      </section>

      {/* ─── FAQ Accordion ─── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-4 w-4 text-neutral-400 stroke-[1.5]" />
          <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase">
            Frequently Asked Questions
          </span>
        </div>

        <Accordion type="single" collapsible className="w-full bg-white border border-neutral-200/80 divide-y divide-neutral-100">
          {FAQ_ITEMS.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value}>
              <AccordionTrigger className="px-6 py-5 text-xs font-extrabold tracking-wider uppercase text-[#030213] hover:bg-neutral-50/50 transition-colors [&[data-state=open]]:bg-neutral-50/50 text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-neutral-500 text-xs leading-relaxed font-medium">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="max-w-3xl mx-auto px-6">
        <div className="border border-neutral-200/80 bg-white p-8 text-center">
          <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-3">
            Still Have Questions?
          </span>
          <p className="text-xs text-neutral-500 font-medium mb-6 max-w-lg mx-auto">
            Our support team is ready to assist with any questions not covered here. We typically
            respond within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#030213] hover:bg-neutral-800 text-white px-6 py-3 text-[9px] font-extrabold tracking-widest uppercase transition-all duration-300 no-underline group"
            >
              Contact Support
              <ArrowRight className="h-3 w-3 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/returns"
              className="border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-6 py-3 text-[9px] font-extrabold tracking-widest uppercase transition-colors no-underline"
            >
              Returns & Size Guide
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
