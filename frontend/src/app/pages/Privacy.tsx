import { Shield, Eye, Lock, Trash2, Cookie, Mail, FileText, Database, Share2, UserCheck } from "lucide-react";
import { Link } from "react-router";

const SECTIONS = [
  {
    icon: Eye,
    title: "1. Information We Collect",
    paragraphs: [
      "We collect information you provide directly to us when you create an account, make a purchase, contact our support team, or subscribe to our newsletter. This includes your full name, email address, shipping address, phone number, and payment information.",
      "When you browse our website, we automatically collect certain information through cookies and similar technologies. This includes your IP address, browser type and version, device type, operating system, referring URLs, pages viewed, and the duration of your visit.",
      "We may also collect information about your preferences, sizing data, and product interactions to personalize your shopping experience and recommend products that match your style.",
    ],
  },
  {
    icon: Database,
    title: "2. How We Use Your Information",
    paragraphs: [
      "Your information is used to process and fulfill your orders, including payment processing, shipping, and delivery confirmation. We communicate with you about your orders, respond to your inquiries, and provide customer support.",
      "With your explicit consent, we may send you marketing communications about new drops, exclusive releases, and editorial content. You can withdraw this consent at any time by unsubscribing.",
      "We analyze browsing behavior and purchase history to improve our website, optimize product recommendations, and enhance your overall shopping experience.",
    ],
  },
  {
    icon: Shield,
    title: "3. Data Protection & Security",
    paragraphs: [
      "Drip Doggy implements industry-standard security measures to protect your personal information. All data transmitted through our website is encrypted using TLS (Transport Layer Security) protocol, ensuring that your information is secure during transmission.",
      "Payment processing is handled by our trusted third-party payment partners who maintain PCI DSS compliance. Your full payment details are never stored on our servers.",
      "We conduct regular security audits and vulnerability assessments to ensure our systems remain secure. Access to personal data is restricted to authorized personnel only.",
    ],
  },
  {
    icon: Share2,
    title: "4. Information Sharing & Disclosure",
    paragraphs: [
      "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, processing payments, fulfilling orders, and delivering packages.",
      "These service providers are contractually bound to protect your information and may only use it for the specific services they provide to us. We require all third-party partners to maintain confidentiality and comply with applicable data protection laws.",
      "We may disclose your information if required by law, to enforce our terms and conditions, or to protect the rights, property, or safety of Drip Doggy, our customers, or others.",
    ],
  },
  {
    icon: Cookie,
    title: "5. Cookies & Tracking Technologies",
    paragraphs: [
      "We use essential cookies to ensure our website functions properly. These cookies are necessary for core functionality such as maintaining your shopping cart, remembering your login status, and processing checkout.",
      "Analytics cookies help us understand how visitors interact with our website — which pages are most popular, how users navigate between pages, and where they encounter issues. This data helps us continuously improve your browsing experience.",
      "You can control cookie preferences through your browser settings. Please note that disabling certain cookies may affect the functionality of our website, particularly the shopping cart and checkout processes.",
    ],
  },
  {
    icon: Trash2,
    title: "6. Data Retention & Deletion",
    paragraphs: [
      "We retain your personal data only for as long as necessary to fulfill the purposes described in this policy, or as required by applicable law. Order information is retained for accounting and tax compliance purposes as mandated by Indian regulations.",
      "You may request deletion of your account and associated personal data at any time by contacting our support team. We will process deletion requests within 30 calendar days of verification.",
      "Upon deletion, your personal data is permanently removed from our active systems. Residual copies may remain in our backup systems for a limited period before being automatically overwritten.",
    ],
  },
  {
    icon: UserCheck,
    title: "7. Your Rights & Choices",
    paragraphs: [
      "You have the right to access, correct, or update your personal information at any time through your account dashboard. You may also request a copy of the data we hold about you by contacting our support team.",
      "You may opt out of marketing communications at any time by clicking the 'unsubscribe' link in our emails or by updating your communication preferences in your account settings.",
      "You have the right to restrict or object to the processing of your data, and the right to data portability. Requests will be reviewed and processed in accordance with applicable data protection laws.",
    ],
  },
  {
    icon: Mail,
    title: "8. Contact & Complaints",
    paragraphs: [
      "If you have any questions, concerns, or complaints regarding this Privacy Policy or our data handling practices, please contact our Data Protection Officer at privacy@dripdoggy.com.",
      "We are committed to resolving any concerns you may have. If you are dissatisfied with our response, you have the right to lodge a complaint with the relevant data protection authority.",
      "This policy was last updated in June 2026. We reserve the right to modify this policy at any time. Changes will be posted on this page with an updated effective date.",
    ],
  },
];

export function Privacy() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#030213] pb-20 font-sans antialiased selection:bg-neutral-200">
      {/* ─── Page Header ─── */}
      <section className="relative py-20 text-center border-b border-neutral-200/80 max-w-7xl mx-auto px-6">
        <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          THE HOUSE
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] uppercase mb-4">
          Privacy Policy
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto text-xs tracking-wide leading-relaxed font-medium">
          Last updated: June 2026. This policy describes how Drip Doggy Apparel collects, uses, and
          protects your personal information.
        </p>
      </section>

      {/* ─── Intro ─── */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <div className="bg-white border border-neutral-200/80 p-8 lg:p-10">
          <FileText className="h-5 w-5 text-neutral-300 stroke-[1.5] mb-4" />
          <p className="text-[12px] text-neutral-600 font-medium leading-relaxed mb-4">
            Drip Doggy Apparel (&ldquo;Drip Doggy,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you visit our website, make a purchase, or interact with our services.
          </p>
          <p className="text-[11px] text-neutral-400 font-medium">
            By using our website or providing your information to us, you consent to the practices 
            described in this policy. If you do not agree with any part of this policy, please 
            discontinue use of our website.
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
          <Shield className="h-6 w-6 text-neutral-300 stroke-[1.5] mx-auto mb-4" />
          <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-3">
            Questions About Your Privacy?
          </span>
          <p className="text-xs text-neutral-500 font-medium mb-6 max-w-lg mx-auto">
            Our Data Protection Officer is available to address any questions or concerns you may
            have about how we handle your personal information.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="bg-[#030213] hover:bg-neutral-800 text-white px-6 py-3 text-[9px] font-extrabold tracking-widest uppercase transition-colors no-underline"
            >
              Contact DPO
            </Link>
            <a
              href="mailto:privacy@dripdoggy.com"
              className="border border-neutral-200 hover:border-[#030213] text-neutral-600 hover:text-[#030213] px-6 py-3 text-[9px] font-extrabold tracking-widest uppercase transition-colors no-underline"
            >
              Email DPO
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
