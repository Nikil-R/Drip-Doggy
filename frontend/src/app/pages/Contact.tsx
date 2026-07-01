import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

const CONTACT_METHODS = [
  {
    icon: Mail,
    label: "Email Support",
    value: "support@dripdoggy.com",
    href: "mailto:support@dripdoggy.com",
    description: "For order inquiries, returns, and general questions. We respond within 24 hours.",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    description: "Monday–Friday, 9:00 AM – 6:00 PM IST. Please have your order ID ready.",
  },
  {
    icon: MapPin,
    label: "Corporate Studio",
    value: "Milan — Seoul — London",
    description: "Global design and operations headquarters.",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon–Fri, 9:00 AM – 6:00 PM IST",
    description: "Weekend inquiries are answered on the next business day.",
  },
];

const FAQ_PREVIEWS = [
  { q: "How long does shipping take?", link: "/faq" },
  { q: "What is your return policy?", link: "/returns" },
  { q: "How do I track my order?", link: "/account#orders" },
  { q: "Do you offer size exchanges?", link: "/returns" },
];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    orderId: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#030213] pb-20 font-sans antialiased selection:bg-neutral-200">
      {/* ─── Page Header ─── */}
      <section className="relative py-20 text-center border-b border-neutral-200/80 max-w-7xl mx-auto px-6">
        <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          CLIENT SERVICES
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] uppercase mb-4">
          Contact Us
        </h1>
        <p className="text-neutral-500 max-w-xl mx-auto text-xs tracking-wide leading-relaxed font-medium">
          We're here to help. Whether you have a question about your order, need sizing advice, or
          want to discuss wholesale opportunities — reach out and our team will get back to you.
        </p>
      </section>

      {/* ─── Main Content ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* ─── Left: Contact Info ─── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Methods */}
            <div>
              <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-6">
                How to Reach Us
              </span>
              <div className="space-y-6">
                {CONTACT_METHODS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-11 h-11 border border-neutral-200/80 flex items-center justify-center flex-shrink-0 bg-white">
                        <Icon className="h-4.5 w-4.5 text-neutral-600 stroke-[1.5]" />
                      </div>
                      <div>
                        <span className="text-[8px] font-extrabold tracking-[0.2em] text-[#b2533e] uppercase block mb-0.5">
                          {item.label}
                        </span>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-[13px] text-neutral-800 hover:text-[#030213] transition-colors font-bold no-underline block"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="text-[13px] text-neutral-800 font-bold block">{item.value}</span>
                        )}
                        <p className="text-[10px] text-neutral-400 font-medium mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Response Time */}
            <div className="border-t border-neutral-200/80 pt-6">
              <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-3">
                Response Commitment
              </span>
              <div className="bg-white border border-neutral-200/80 p-5 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-neutral-600 uppercase tracking-wider">Email</span>
                  <span className="font-extrabold text-green-700">&lt; 24 hours</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-neutral-600 uppercase tracking-wider">Phone</span>
                  <span className="font-extrabold text-green-700">Instant (business hours)</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-neutral-600 uppercase tracking-wider">Social</span>
                  <span className="font-extrabold text-neutral-400">&lt; 4 hours</span>
                </div>
                <div className="h-px bg-neutral-200/60 my-1" />
                <p className="text-[9px] text-neutral-400 font-medium">
                  For urgent order issues, include your Order ID (DD-2026-XXXX) for faster processing.
                </p>
              </div>
            </div>

            {/* Quick FAQs */}
            <div className="border-t border-neutral-200/80 pt-6">
              <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-4">
                Quick Answers
              </span>
              <div className="space-y-2">
                {FAQ_PREVIEWS.map((faq) => (
                  <Link
                    key={faq.q}
                    to={faq.link}
                    className="flex items-center justify-between bg-white border border-neutral-200/80 px-4 py-3 hover:border-[#030213]/30 transition-colors group no-underline"
                  >
                    <span className="text-[10px] font-medium text-neutral-600 group-hover:text-[#030213] transition-colors">
                      {faq.q}
                    </span>
                    <ArrowRight className="h-3 w-3 text-neutral-300 group-hover:text-[#030213] transition-colors stroke-[2]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Right: Contact Form ─── */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-neutral-200/80 p-8 lg:p-10">
              <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase block mb-6">
                Send Us a Message
              </span>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 border-2 border-green-500/30 flex items-center justify-center mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600 stroke-[1.5]" />
                  </div>
                  <p className="text-base font-extrabold uppercase tracking-wider text-[#030213] mb-2">
                    Message Sent Successfully
                  </p>
                  <p className="text-[11px] text-neutral-500 font-medium max-w-sm">
                    Thank you for reaching out. Our team will review your inquiry and respond within
                    24 hours. For urgent matters, please call us during business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[8px] font-extrabold tracking-[0.2em] text-neutral-500 uppercase block mb-1.5">
                        First Name <span className="text-[#b2533e]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full border border-neutral-200/80 px-3.5 py-3 text-[12px] font-medium text-neutral-800 bg-[#FAF8F5] focus:outline-none focus:border-[#030213] transition-colors placeholder-neutral-300"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-extrabold tracking-[0.2em] text-neutral-500 uppercase block mb-1.5">
                        Last Name <span className="text-[#b2533e]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full border border-neutral-200/80 px-3.5 py-3 text-[12px] font-medium text-neutral-800 bg-[#FAF8F5] focus:outline-none focus:border-[#030213] transition-colors placeholder-neutral-300"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] font-extrabold tracking-[0.2em] text-neutral-500 uppercase block mb-1.5">
                      Email Address <span className="text-[#b2533e]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-neutral-200/80 px-3.5 py-3 text-[12px] font-medium text-neutral-800 bg-[#FAF8F5] focus:outline-none focus:border-[#030213] transition-colors placeholder-neutral-300"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] font-extrabold tracking-[0.2em] text-neutral-500 uppercase block mb-1.5">
                      Order ID (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      className="w-full border border-neutral-200/80 px-3.5 py-3 text-[12px] font-medium text-neutral-800 bg-[#FAF8F5] focus:outline-none focus:border-[#030213] transition-colors placeholder-neutral-300"
                      placeholder="DD-2026-XXXX"
                    />
                  </div>

                  <div>
                    <label className="text-[8px] font-extrabold tracking-[0.2em] text-neutral-500 uppercase block mb-1.5">
                      Subject <span className="text-[#b2533e]">*</span>
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full border border-neutral-200/80 px-3.5 py-3 text-[12px] font-medium text-neutral-800 bg-[#FAF8F5] focus:outline-none focus:border-[#030213] transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Inquiry</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="product">Product Question</option>
                      <option value="wholesale">Wholesale / Collaboration</option>
                      <option value="press">Press & Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] font-extrabold tracking-[0.2em] text-neutral-500 uppercase block mb-1.5">
                      Message <span className="text-[#b2533e]">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full border border-neutral-200/80 px-3.5 py-3 text-[12px] font-medium text-neutral-800 bg-[#FAF8F5] focus:outline-none focus:border-[#030213] transition-colors placeholder-neutral-300 resize-none"
                      placeholder="Tell us how we can help you. Include as much detail as possible so we can assist you efficiently."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#030213] hover:bg-neutral-800 text-white py-4 text-[9px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 border-none cursor-pointer flex items-center justify-center gap-3 group"
                    >
                      <Send className="h-3.5 w-3.5 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5" />
                      Send Message
                    </button>
                  </div>

                  <p className="text-[8px] text-neutral-400 font-medium text-center pt-1">
                    By submitting this form, you agree to our{" "}
                    <Link to="/privacy" className="underline hover:text-[#030213]">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="border-t border-neutral-200/80 pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-neutral-400 stroke-[1.5]" />
            <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase">
              Prefer self-service? Visit our{" "}
              <Link to="/faq" className="text-[#030213] underline hover:opacity-75">
                FAQ
              </Link>{" "}
              or{" "}
              <Link to="/returns" className="text-[#030213] underline hover:opacity-75">
                Returns Center
              </Link>
            </span>
          </div>
          <div className="flex gap-3">
            {["WhatsApp", "Instagram", "X"].map((platform) => (
              <span
                key={platform}
                className="text-[8px] font-extrabold tracking-widest text-neutral-300 border border-neutral-200 px-3 py-1.5 uppercase"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
