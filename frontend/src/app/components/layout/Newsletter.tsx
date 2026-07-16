import { useState, useEffect } from "react";
import { getNewsletterConfig } from "../../lib/content-store";
import axios from "axios";
import { Check } from "lucide-react";
import { API_CONFIG } from "@/app/utils/api-config";
import { useAuth } from "../../context/AuthContext";

export function Newsletter() {
  const [config, setConfig] = useState(() => getNewsletterConfig());
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getNewsletterConfig());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("dd-content-changed" as any, handleUpdate);
    
    // 1. Read persisted subscription state (instant)
    const saved = localStorage.getItem("dripdoggy_subscribed_email");
    if (saved) {
      setEmail(saved);
      setSubmitted(true);
    }
    
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("dd-content-changed" as any, handleUpdate);
    };
  }, []);

  // 2. Proactive check if the logged in user is already in the subscribers table
  useEffect(() => {
    const checkPersistentSubscription = async () => {
      if (isAuthenticated && user?.email) {
        // If already loaded from localStorage, skip
        const saved = localStorage.getItem("dripdoggy_subscribed_email");
        if (saved && saved.toLowerCase() === user.email.toLowerCase()) {
          return;
        }
        
        try {
          // Attempt silent subscription to verify if they are already in the DB
          await axios.post(`${API_CONFIG.BASE_URL}/dripdoggy/api/public/newsletter/subscribe`, {
            email: user.email.trim()
          });
          localStorage.setItem("dripdoggy_subscribed_email", user.email.trim());
          setEmail(user.email.trim());
          setSubmitted(true);
        } catch (err: any) {
          const msg = err.response?.data?.message || "";
          if (msg.includes("already subscribed") || err.response?.status === 400) {
            localStorage.setItem("dripdoggy_subscribed_email", user.email.trim());
            setEmail(user.email.trim());
            setSubmitted(true);
          }
        }
      }
    };
    checkPersistentSubscription();
  }, [isAuthenticated, user]);

  if (!config.active) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await axios.post(`${API_CONFIG.BASE_URL}/dripdoggy/api/public/newsletter/subscribe`, {
        email: email.trim()
      });
      localStorage.setItem("dripdoggy_subscribed_email", email.trim());
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-center border-b border-white/20 pb-2 pt-4">
              <input
                type="email"
                required
                disabled={submitted}
                readOnly={submitted}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={config.placeholder || "ENTER YOUR EMAIL"}
                className={`bg-transparent border-none text-xs tracking-wider focus:outline-none flex-1 placeholder-neutral-500 uppercase text-white w-full text-center sm:text-left ${
                  submitted ? "pointer-events-none select-none opacity-60 cursor-default" : ""
                }`}
              />
              <button 
                type="submit" 
                disabled={isSubmitting || submitted}
                className={`text-xs font-bold tracking-[0.2em] uppercase bg-transparent border-none p-0 shrink-0 flex items-center gap-1.5 ${
                  submitted
                    ? "text-green-500 opacity-80 cursor-default pointer-events-none"
                    : "text-white hover:opacity-75 transition-opacity cursor-pointer disabled:opacity-50"
                }`}
              >
                {submitted ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500 stroke-[2.5]" />
                    <span>SUBSCRIBED</span>
                  </>
                ) : isSubmitting ? (
                  "SUBSCRIBING..."
                ) : (
                  config.buttonText || "SUBSCRIBE"
                )}
              </button>
            </form>
            {submitted && (
              <p className="text-[10px] font-bold text-green-500 tracking-wider uppercase">
                {config.successMessage || "Thanks for subscribing! Welcome to the Syndicate."}
              </p>
            )}
            {errorMsg && (
              <p className="text-[10px] font-bold text-red-500 tracking-wider uppercase">{errorMsg}</p>
            )}
          </div>
          
          <p className="text-white/40 text-[10px] tracking-wide uppercase pt-2">
            {config.consentText || "By subscribing, you agree to our Privacy Policy and consent to receive updates."}
          </p>
        </div>
      </div>
    </section>
  );
}


