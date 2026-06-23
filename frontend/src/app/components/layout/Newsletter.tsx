import { useState, useEffect } from "react";
import { getNewsletterConfig } from "../../lib/content-store";

export function Newsletter() {
  const [config, setConfig] = useState(() => getNewsletterConfig());
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getNewsletterConfig());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("dd-content-changed" as any, handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("dd-content-changed" as any, handleUpdate);
    };
  }, []);

  if (!config.active) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-16 lg:py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-[0.1em] uppercase">
            {config.heading || "JOIN THE SYNDICATE"}
          </h2>
          <p className="text-white/80 text-sm tracking-widest uppercase">
            {config.subtitle || "Subscribe for early drop alerts, limited edition capsules, and culture updates."}
          </p>
          
          {submitted ? (
            <div className="p-4 bg-white/10 border border-white/20 text-xs font-bold tracking-widest uppercase max-w-md mx-auto">
              {config.successMessage || "Thanks for subscribing! Welcome to the Syndicate."}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-center border-b border-white/20 pb-2 pt-4">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={config.placeholder || "ENTER YOUR EMAIL"}
                className="bg-transparent border-none text-xs tracking-wider focus:outline-none flex-1 placeholder-neutral-500 uppercase text-white w-full text-center sm:text-left"
              />
              <button type="submit" className="text-xs font-bold tracking-[0.2em] text-white hover:opacity-75 transition-opacity uppercase bg-transparent border-none cursor-pointer p-0 shrink-0">
                {config.buttonText || "SUBSCRIBE"}
              </button>
            </form>
          )}
          
          <p className="text-white/40 text-[10px] tracking-wide uppercase pt-2">
            {config.consentText || "By subscribing, you agree to our Privacy Policy and consent to receive updates."}
          </p>
        </div>
      </div>
    </section>
  );
}


