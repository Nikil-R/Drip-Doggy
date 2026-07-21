import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ChevronDown,
  Mail,
  Instagram,
  Youtube,
  Facebook,
  Link2,
} from "lucide-react";
import logo from "@/assets/logo.png";
import logoIcon from "@/assets/new_logo_icon.png";
import { motion } from "motion/react";
import { getFooterConfig } from "../../lib/content-store";
import { validateEmail } from "../../utils/validation";
import axios from "axios";
import { API_CONFIG } from "@/app/utils/api-config";
import { useAuth } from "../../context/AuthContext";

const XLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Icon mapping for social platforms
const ICON_MAP: Record<string, React.ElementType> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: XLogo,
  x: XLogo,
  facebook: Facebook,
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function MobileAccordion({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E5E5E5]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-[16px] font-black uppercase tracking-[0.1em] text-[#111111] bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 text-[#111111] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-4" : "max-h-0"}`}>
        <ul className="space-y-3.5 pt-1">
          {links.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className="text-[13px] text-[#6B6B6B] hover:text-[#111111] transition-colors font-semibold uppercase tracking-wider">{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DesktopAccordion({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E5E5E5]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-[18px] font-black uppercase tracking-[0.1em] text-[#111111] bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
      >
        <span>{title}</span>
        <ChevronDown className={`h-4.5 w-4.5 text-[#111111] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-4" : "max-h-0"}`}>
        <ul className="space-y-4 pt-2">
          {links.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className="text-[14px] text-[#6B6B6B] hover:text-[#111111] transition-colors font-medium">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SocialButton({ platform, label, href }: { platform: string; label: string; href: string }) {
  const Icon = ICON_MAP[platform.toLowerCase()] || Link2;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="w-11 h-11 lg:w-12 lg:h-12 border border-[#BDBDBD] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-300 bg-white"
      aria-label={label}>
      <Icon className="h-[18px] w-[18px] lg:h-5 lg:w-5 stroke-[1.5]" />
    </a>
  );
}

// ─── Footer Component ───────────────────────────────────────────────────────

export function Footer() {
  const [config, setConfig] = useState(() => getFooterConfig());
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success" | "error">("idle");
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getFooterConfig());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("dd-content-changed" as any, handleUpdate);

    // 1. Read persisted subscription state (instant)
    const saved = localStorage.getItem("dripdoggy_subscribed_email");
    if (saved) {
      setEmail(saved);
      setSubscribeStatus("success");
    }

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("dd-content-changed" as any, handleUpdate);
    };
  }, []);

  if (!config || !config.active) return null;

  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeError(null);
    const err = validateEmail(email);
    if (err) {
      setSubscribeError(err);
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API_CONFIG.BASE_URL}/dripdoggy/api/public/newsletter/subscribe`, {
        email: email.trim()
      });
      localStorage.setItem("dripdoggy_subscribed_email", email.trim());
      setSubscribeStatus("success");
    } catch (err: any) {
      setSubscribeError(err.response?.data?.message || "Failed to subscribe. Please try again.");
      setSubscribeStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to split text by <br /> or \n for styling heading line breaks
  const renderHeading = (text: string) => {
    return text.split(/<br\s*\/?>|\n/).map((line, idx, arr) => (
      <span key={idx}>
        {line}
        {idx < arr.length - 1 && <br />}
      </span>
    ));
  };

  const activeSocials = (config.socialLinks || []).filter(s => s.active);

  return (
    <footer>
      {/* ═════════════════════════════════════════════════════════════════════
          SECTION A — DARK CTA PRE-FOOTER (reveal on scroll)
          ═════════════════════════════════════════════════════════════════════ */}
      {config.ctaSection && (
        <motion.div
          id="footer-cta"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-[#030213] text-white">
            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="space-y-4">
                  <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#b2533e] uppercase block">
                    {config.ctaSection.tag || "Private Access / DripDoggy Syndicate"}
                  </span>
                  <h2 className="text-3xl lg:text-5xl font-extrabold tracking-[0.03em] uppercase leading-tight">
                    {renderHeading(config.ctaSection.heading || "Join the\nNext Drop")}
                  </h2>
                  <p className="text-sm text-white/60 tracking-wide leading-relaxed font-light max-w-md">
                    {config.ctaSection.description || "Receive early access to limited capsules, archival restocks, and editorial releases before the public drop."}
                  </p>
                </div>
                <div className="space-y-6">
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                        <Mail className="h-4 w-4 stroke-[1.5]" />
                      </div>
                      <input type="email" required 
                        disabled={subscribeStatus === "success"}
                        readOnly={subscribeStatus === "success"}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={`w-full bg-white/5 border border-white/15 pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors rounded-none ${
                          subscribeStatus === "success" ? "pointer-events-none select-none opacity-60 cursor-default" : ""
                        }`} />
                    </div>
                    <button type="submit"
                      disabled={isSubmitting || subscribeStatus === "success"}
                      className={`group inline-flex items-center gap-2 px-7 py-3.5 text-xs font-extrabold tracking-[0.2em] transition-all duration-300 border-none uppercase ${
                        subscribeStatus === "success" 
                          ? "bg-green-600 text-white opacity-85 cursor-default pointer-events-none" 
                          : "bg-white text-[#030213] hover:bg-white/90 cursor-pointer disabled:opacity-50"
                      }`}>
                      {subscribeStatus === "success" ? "SUBSCRIBED" : (isSubmitting ? "SUBSCRIBING..." : (config.ctaSection.buttonText || "SUBSCRIBE"))}
                      {subscribeStatus !== "success" && (
                        <ArrowRight className="h-3.5 w-3.5 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5" />
                      )}
                    </button>
                  </form>
                  {subscribeError && (
                    <p className="text-[11px] text-red-400 font-bold tracking-wider uppercase">✕ {subscribeError}</p>
                  )}
                  {subscribeStatus === "success" && (
                    <p className="text-[11px] text-green-450 font-bold tracking-wider uppercase">✓ You are into the syndicate.</p>
                  )}
                  {config.ctaSection.chips && config.ctaSection.chips.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {config.ctaSection.chips.map((chip) => (
                        <span key={chip} className="text-[8px] font-extrabold tracking-[0.2em] text-white/50 border border-white/10 px-3 py-1.5 uppercase">{chip}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION B — WARM EDITORIAL MAIN FOOTER
          ═════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#F7F5F2] border-t border-[#E5E5E5] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <span className="text-[12vw] lg:text-[10vw] font-extrabold tracking-[0.05em] text-[#030213]/[0.025] whitespace-nowrap uppercase leading-none">
            {config.brandName || "DRIPDOGGY"}
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto pt-6 pb-14 lg:pt-8 lg:pb-16">
          {/* Desktop Layout */}
          <div className="hidden lg:block max-w-[1440px] mx-auto px-10 mt-[-25px]">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-6">
                <img src={logoIcon} alt="" className="h-20 w-auto object-contain mix-blend-multiply" />
                <img src={logo} alt={config.brandName || "DRIPDOGGY"} className="h-30 w-auto object-contain mix-blend-multiply ml-[-15px]" />
              </div>
              <span className="block text-[18px] font-black tracking-[2px] text-[#B35A3C] uppercase">
                {config.tagline || "Luxury Streetwear / Est. 2026"}
              </span>
              <p className="text-[16px] leading-[26px] text-[#6B6B6B] font-semibold max-w-xl">
                {config.description || "Architectural silhouettes, premium fabrication, and uncompromised street luxury for the modern wardrobe."}
              </p>

              {activeSocials.length > 0 && (
                <div className="flex gap-4 pt-2">
                  {activeSocials.map((s) => (
                    <SocialButton key={s.label} platform={s.platform} label={s.label} href={s.url} />
                  ))}
                </div>
              )}
            </div>
            
            {config.linkGroups && config.linkGroups.length > 0 && (
              <div className="space-y-4 mt-8">
                {config.linkGroups.map((group, gi) => (
                  <DesktopAccordion key={gi} title={group.title} links={group.links} />
                ))}
              </div>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden px-6 space-y-2 text-center flex flex-col items-center">
            <div className="space-y-4 pb-6 border-b border-[#E5E5E5] w-full flex flex-col items-center">
              <div className="flex flex-col items-center gap-0">
                <img src={logoIcon} alt="" className="h-20 w-auto object-contain mix-blend-multiply" />
                <img src={logo} alt={config.brandName || "DRIPDOGGY"} className="h-40 w-auto object-contain mix-blend-multiply mt-[-60px]" />
              </div>
              <span className="block text-[16px] font-black tracking-[1.5px] text-[#B35A3C] uppercase mt-[-50px]">
                {config.tagline || "Luxury Streetwear / Est. 2026"}
              </span>
              <p className="text-[14px] leading-[22px] text-[#6B6B6B] font-semibold max-w-sm">
                {config.description || "Architectural silhouettes, premium fabrication, and uncompromised street luxury for the modern wardrobe."}
              </p>
              {activeSocials.length > 0 && (
                <div className="flex gap-3 pt-2 mb-6 justify-center">
                  {activeSocials.map((s) => (
                    <SocialButton key={s.label} platform={s.platform} label={s.label} href={s.url} />
                  ))}
                </div>
              )}
            </div>
            
            {config.linkGroups && (
              <div className="w-full text-left space-y-4">
                {config.linkGroups.map((group, gi) => (
                  <MobileAccordion key={gi} title={group.title} links={group.links} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#030213] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-white/40 font-extrabold tracking-[0.2em] order-2 md:order-1 text-center md:text-left">
              © {new Date().getFullYear()} DripDoggy. Drip Your Way, Every Day. All Rights Reserved.
            </p>
            <div className="hidden md:flex items-center gap-1 order-1 md:order-2">
              <Link to="/privacy" className="text-[10px] text-white/40 hover:text-white transition-colors font-extrabold tracking-[0.2em] uppercase">Privacy</Link>
              <span className="text-white/10 font-bold mx-1.5 select-none">·</span>
              <Link to="/terms" className="text-[10px] text-white/40 hover:text-white transition-colors font-extrabold tracking-[0.2em] uppercase">Terms</Link>
              <span className="text-white/10 font-bold mx-1.5 select-none">·</span>
              <Link to="/privacy" className="text-[10px] text-white/40 hover:text-white transition-colors font-extrabold tracking-[0.2em] uppercase">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
