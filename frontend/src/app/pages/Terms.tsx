import { FileText, ShoppingBag, RefreshCw, Truck, Shield, Scale, AlertTriangle, Mail, Ban, Eye } from "lucide-react";
import { Link } from "react-router";

const SECTIONS = [
  {
    icon: ShoppingBag,
    title: "1. Orders & Acceptance",
    paragraphs: [
      "By placing an order on Drip Doggy, you agree to purchase the selected items at the listed price, subject to availability. All orders are subject to acceptance and availability, and we reserve the right to refuse or cancel any order at our sole discretion.",
      "We may cancel orders for reasons including but not limited to: product unavailability, pricing errors, payment verification failures, suspected fraudulent activity, or shipping restrictions. In such cases, you will be notified and any amount paid will be refunded in full.",
      "Upon successful order placement, you will receive an order confirmation email. This confirmation does not constitute acceptance of your order — acceptance occurs when your item is dispatched and a shipping confirmation is sent.",
    ],
  },
  {
    icon: RefreshCw,
    title: "2. Returns & Refunds",
    paragraphs: [
      "Our return policy allows returns within 14 calendar days of delivery for unworn, unwashed items with all tags and original packaging intact. Custom collections, archive drops, and limited-edition capsules are exchange-only and cannot be returned for a refund.",
      "Refunds are processed within 7 business days of receiving and inspecting the returned item. The refund amount is credited to your original payment method. For COD orders, refunds are processed via bank transfer.",
      "All final sale items are clearly marked on the product page. Drip Doggy reserves the right to refuse returns that do not meet our policy requirements. Return shipping costs are borne by Drip Doggy for eligible returns within India.",
    ],
  },
  {
    icon: Truck,
    title: "3. Shipping & Delivery",
    paragraphs: [
      "We aim to dispatch all orders within 24 hours of confirmation (excluding weekends and public holidays). Delivery timelines vary based on the shipping method selected and the delivery location. Standard delivery takes 3–5 business days, while express shipping guarantees next-day delivery.",
      "Risk of loss and title for purchased items pass to you upon delivery. Drip Doggy is not responsible for delays caused by courier partners, customs clearance, or force majeure events including natural disasters, pandemics, or government actions.",
      "Shipping charges (if applicable) are calculated and displayed at checkout. Free shipping is available on orders above ₹1,999. COD orders are subject to a maximum order value limit as specified on the checkout page.",
    ],
  },
  {
    icon: Shield,
    title: "4. Intellectual Property Rights",
    paragraphs: [
      "All content on this website — including but not limited to designs, logos, trademarks, text, images, graphics, product designs, packaging, and source code — is the exclusive intellectual property of Drip Doggy Apparel or its licensors and is protected by applicable intellectual property laws.",
      "You may not reproduce, distribute, modify, create derivative works from, publicly display, or otherwise use any content from this website without prior written consent from Drip Doggy. Unauthorized use of our intellectual property may result in legal action.",
      "The Drip Doggy name, logo, and all related product names, design marks, and slogans are trademarks of Drip Doggy Apparel. All other trademarks appearing on this website are the property of their respective owners.",
    ],
  },
  {
    icon: Scale,
    title: "5. Limitation of Liability",
    paragraphs: [
      "Drip Doggy Apparel shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our products or website, including but not limited to loss of profits, data, or goodwill.",
      "Our total liability for any claim arising from the purchase or use of our products shall not exceed the purchase price of the product giving rise to the claim. This limitation applies regardless of the form of action, whether in contract, tort, or otherwise.",
      "Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you. In such cases, our liability shall be limited to the fullest extent permitted by applicable law.",
    ],
  },
  {
    icon: Ban,
    title: "6. Prohibited Uses",
    paragraphs: [
      "You agree not to use our website for any unlawful purpose or in violation of these terms. Prohibited activities include but are not limited to: attempting to gain unauthorized access to our systems, engaging in any form of data scraping, or interfering with the proper functioning of the website.",
      "Reselling Drip Doggy products for commercial purposes without explicit written authorization is strictly prohibited. We reserve the right to cancel orders and restrict accounts engaged in unauthorized commercial resale.",
      "Any form of fraudulent activity, including but not limited to using stolen payment methods, providing false information, or attempting to manipulate our pricing or inventory systems, will result in immediate account termination and may be reported to relevant authorities.",
    ],
  },
  {
    icon: Eye,
    title: "7. Privacy & Data Protection",
    paragraphs: [
      "Your use of our website is also governed by our Privacy Policy, which is incorporated into these terms by reference. Please review our Privacy Policy to understand our practices regarding the collection, use, and protection of your personal information.",
      "We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
      "By using our website, you consent to the collection and use of your information as described in our Privacy Policy. You have the right to access, correct, or delete your personal data as outlined in that policy.",
    ],
  },
  {
    icon: FileText,
    title: "8. Changes to Terms",
    paragraphs: [
      "Drip Doggy reserves the right to update, modify, or replace any part of these Terms of Service at any time without prior notice. Changes will be effective immediately upon posting on this page. Your continued use of our website after any changes constitutes acceptance of the modified terms.",
      "We encourage you to review these terms periodically for any updates. The date of the most recent revision is displayed at the top of this page. Material changes will be communicated via email or a prominent notice on our website.",
      "If any provision of these terms is found to be unenforceable or invalid under applicable law, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.",
    ],
  },
  {
    icon: Mail,
    title: "9. Contact Information",
    paragraphs: [
      "For questions about these Terms of Service, to report a violation, or to submit a complaint, please contact our legal department. We are committed to addressing all inquiries promptly and professionally.",
      "Drip Doggy Apparel operates as a registered entity under the laws of India. These terms are governed by the laws of India, and any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.",
      "If you have any questions or concerns, please do not hesitate to contact our support team. We value your business and are committed to providing you with the highest standard of service.",
    ],
  },
];

export function Terms() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#030213] pb-20 font-sans antialiased selection:bg-neutral-200">
      {/* ─── Page Header ─── */}
      <section className="relative py-20 text-center border-b border-neutral-200/80 max-w-7xl mx-auto px-6">
        <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          THE HOUSE
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] uppercase mb-4">
          Terms of Service
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto text-xs tracking-wide leading-relaxed font-medium">
          Last updated: June 2026. Please read these terms carefully before using our website or
          making a purchase. These terms constitute a legally binding agreement.
        </p>
      </section>

      {/* ─── Intro ─── */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <div className="bg-white border border-neutral-200/80 p-8 lg:p-10">
          <FileText className="h-5 w-5 text-neutral-300 stroke-[1.5] mb-4" />
          <p className="text-[12px] text-neutral-600 font-medium leading-relaxed mb-4">
            These Terms of Service (&ldquo;Terms&rdquo; or &ldquo;Agreement&rdquo;) govern your access to and use of the Drip Doggy 
            website, including any subdomains, and your purchase of products from Drip Doggy Apparel 
            (&ldquo;Drip Doggy,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
          </p>
          <p className="text-[11px] text-neutral-400 font-medium">
            By accessing our website, creating an account, or making a purchase, you agree to be 
            bound by these Terms. If you do not agree to all of these Terms, please do not use our 
            website or services.
          </p>
        </div>
      </section>

      {/* ─── Sections ─── */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="space-y-5">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="bg-white border border-neutral-200/80 p-6 lg:p-8 flex items-start gap-5">
                <div className="w-11 h-11 border border-neutral-200/80 flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#FAF8F5]">
                  <Icon className="h-4.5 w-4.5 text-neutral-600 stroke-[1.5]" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-[#030213]">
                    {section.title}
                  </h3>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-[11px] text-neutral-500 font-medium leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Contact CTA ─── */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="border border-neutral-200/80 bg-white p-8 text-center">
          <AlertTriangle className="h-6 w-6 text-neutral-300 stroke-[1.5] mx-auto mb-4" />
          <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-3">
            Have Questions About These Terms?
          </span>
          <p className="text-xs text-neutral-500 font-medium mb-6 max-w-lg mx-auto">
            Our legal team is available to address any questions or concerns regarding these terms.
            We encourage you to reach out if anything is unclear.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="bg-[#030213] hover:bg-neutral-800 text-white px-6 py-3 text-[9px] font-extrabold tracking-widest uppercase transition-colors no-underline"
            >
              Contact Legal
            </Link>
            <Link
              to="/privacy"
              className="border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-6 py-3 text-[9px] font-extrabold tracking-widest uppercase transition-colors no-underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
