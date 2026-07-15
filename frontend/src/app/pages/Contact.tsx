import { useState } from "react";
import { Mail, Clock, Send, MessageSquare } from "lucide-react";
import { validateEmail, validateName } from "../utils/validation";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    orderId: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const firstErr = validateName("First Name", formData.firstName);
    if (firstErr) { setError(firstErr); return; }

    const lastErr = validateName("Last Name", formData.lastName);
    if (lastErr) { setError(lastErr); return; }

    const emailErr = validateEmail(formData.email);
    if (emailErr) { setError(emailErr); return; }

    setSubmitted(true);
    setFormData({ firstName: "", lastName: "", email: "", orderId: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#030213] pb-24 font-sans antialiased selection:bg-neutral-200">
      {/* Header */}
      <section className="relative py-10 text-center border-b border-neutral-200/80 max-w-7xl mx-auto px-6">
        <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block mb-3">
          SUPPORT HUB
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-[0.05em] uppercase mb-6">
          Contact Support
        </h1>
        <p className="text-neutral-500 max-w-2xl mx-auto text-xs tracking-wide leading-relaxed font-medium">
          Need help? We're here for you. Whether you have a question about your order, shipping, returns, 
          sizing, or anything else, our support team is ready to assist you.
        </p>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Panel - Support Copy */}
          <div className="lg:col-span-5 space-y-12">
            
            {/* How Can We Help */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black tracking-[0.25em] text-[#030213]/40 uppercase pb-2 border-b border-neutral-200/60">
                How Can We Help?
              </h2>
              <p className="text-[12px] text-neutral-800 font-bold uppercase tracking-wider">
                We're happy to help with:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                {[
                  "Order inquiries",
                  "Shipping and delivery updates",
                  "Returns and exchanges",
                  "Size and fit guidance",
                  "Product information",
                  "Payment-related questions",
                  "General support"
                ].map((item, idx) => (
                  <li key={idx} className="text-[11px] text-neutral-500 font-medium tracking-wide">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Hours */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black tracking-[0.25em] text-[#030213]/40 uppercase pb-2 border-b border-neutral-200/60">
                Support Hours
              </h2>
              <div className="flex gap-3.5 items-start">
                <Clock className="w-5 h-5 text-neutral-500 shrink-0 stroke-[1.5] mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-neutral-800 tracking-wide uppercase">Monday – Saturday</p>
                  <p className="text-xs font-bold text-neutral-600 tracking-wide mt-1">10:00 AM – 7:00 PM (IST)</p>
                  <p className="text-[10px] text-neutral-400 font-medium tracking-wide mt-1.5 leading-relaxed">
                    We aim to respond to all inquiries as quickly as possible during business hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info & Details */}
            <div className="space-y-4 bg-white border border-neutral-200/60 p-6">
              <h3 className="text-xs font-black tracking-widest text-[#b2533e] uppercase">Contact Us</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-0.5">Customer Support</span>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <a href="mailto:support.dripdoggy@gmail.com" className="text-xs font-bold text-[#030213] hover:underline tracking-wide">
                      support.dripdoggy@gmail.com
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-0.5">Help Desk</span>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <a href="mailto:help.dripdoggy@gmail.com" className="text-xs font-bold text-[#030213] hover:underline tracking-wide">
                      help.dripdoggy@gmail.com
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-0.5">Business & Collaborations</span>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <a href="mailto:dripdoggyofficial@gmail.com" className="text-xs font-bold text-[#030213] hover:underline tracking-wide">
                      dripdoggyofficial@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <p className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">For faster assistance, please include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Your Order ID (if applicable)</li>
                  <li className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Your full name</li>
                  <li className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">A brief description of your issue</li>
                </ul>
              </div>
              <p className="text-[9px] text-neutral-400 font-medium tracking-wide pt-2">
                Our team is committed to providing a smooth and reliable customer experience. Thank you for choosing DripDoggy.
              </p>
            </div>

          </div>

          {/* Right Panel - Contact Form */}
          <div className="lg:col-span-7 bg-white border border-neutral-200/80 p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
              <MessageSquare className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
              <h3 className="text-sm font-extrabold tracking-[0.1em] uppercase">Send a Message</h3>
            </div>

            {submitted ? (
              <div className="bg-green-50/50 border border-green-200/60 p-8 text-center space-y-3">
                <span className="text-xl">✓</span>
                <h4 className="text-[11px] font-black tracking-widest uppercase text-green-800">Message Received</h4>
                <p className="text-[10px] text-neutral-500 font-medium tracking-wide">
                  Thank you. We have received your inquiry and our support team will respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1">First Name</label>
                    <input type="text" required value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase placeholder-neutral-300"
                      placeholder="FIRST NAME" />
                  </div>
                  <div>
                    <label className="block text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1">Last Name</label>
                    <input type="text" required value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase placeholder-neutral-300"
                      placeholder="LAST NAME" />
                  </div>
                </div>

                <div>
                  <label className="block text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1">Email Address</label>
                  <input type="email" required value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-[#030213] placeholder-neutral-300"
                    placeholder="EMAIL@DOMAIN.COM" />
                </div>

                <div>
                  <label className="block text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1">Order ID (Optional)</label>
                  <input type="text" value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase placeholder-neutral-300"
                    placeholder="E.G. #1045" />
                </div>

                <div>
                  <label className="block text-[7px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-1">Message</label>
                  <textarea required rows={5} value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#FAF8F5]/50 border border-neutral-200 px-3.5 py-2 text-xs font-bold focus:outline-none focus:border-[#030213] uppercase placeholder-neutral-350"
                    placeholder="HOW CAN WE ASSIST YOU?" />
                </div>

                {error && (
                  <p className="text-[9px] font-extrabold text-red-650 tracking-wider uppercase">✕ {error}</p>
                )}

                <div className="pt-2">
                  <button type="submit"
                    className="w-full bg-[#030213] hover:bg-neutral-800 text-white py-3 text-[9px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 border-none cursor-pointer">
                    <Send className="w-3.5 h-3.5" />
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Slogan Banner */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-[#030213] text-white py-10 text-center relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <p className="text-xl font-extrabold leading-tight tracking-wide uppercase italic">
              "Drip Your Way, Every Day."
            </p>
            <div className="h-px w-16 bg-white/20 mx-auto mt-2" />
          </div>
        </div>
      </section>
    </main>
  );
}
