import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ChevronDown,
  Mail,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Link2,
} from "lucide-react";
import logo from "../../../assets/logo.png";
import logoIcon from "../../../assets/new_logo_icon.png";
import { motion } from "motion/react";
import { getFooterConfig } from "../../lib/content-store";
import { validateEmail } from "../../utils/validation";

// Icon mapping for social platforms
const ICON_MAP: Record<string, React.ElementType> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  facebook: Facebook,
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function MobileAccordion({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200/70">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-[10px] font-extrabold tracking-[0.2em] uppercase text-neutral-800 bg-transparent border-none cursor-pointer"
      >
        {title}
        <ChevronDown className={`h-3 w-3 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-3" : "max-h-0"}`}>
        <ul className="space-y-2.5">
          {links.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className="text-[11px] text-neutral-500 hover:text-[#030213] transition-colors font-medium">{link.label}</Link>
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
      className="w-10 h-10 border border-neutral-300 flex items-center justify-center text-neutral-500 hover:bg-[#030213] hover:text-white hover:border-[#030213] transition-all duration-300 group"
      aria-label={label}>
      <Icon className="h-4 w-4 stroke-[1.5]" />
    </a>
  );
}

// ─── Footer Component ───────────────────────────────────────────────────────

export function Footer() {
  const [config, setConfig] = useState(() => getFooterConfig());
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getFooterConfig());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("dd-content-changed" as any, handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("dd-content-changed" as any, handleUpdate);
    };
  }, []);

  if (!config || !config.active) return null;

  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeError(null);
    const err = validateEmail(email);
    if (err) {
      setSubscribeError(err);
      return;
    }
    setSubscribeStatus("success");
    setEmail("");
    setTimeout(() => setSubscribeStatus("idle"), 5000);
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
                    {config.ctaSection.tag || "Private Access / Drip Doggy Syndicate"}
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
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full bg-white/5 border border-white/15 pl-10 pr-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors rounded-none" />
                    </div>
                    <button type="submit"
                      className="group inline-flex items-center gap-2 bg-white text-[#030213] px-7 py-3.5 text-xs font-extrabold tracking-[0.2em] hover:bg-white/90 transition-all duration-300 border-none cursor-pointer uppercase">
                      {subscribeStatus === "success" ? "SUBSCRIBED" : (config.ctaSection.buttonText || "SUBSCRIBE")}
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </form>
                  {subscribeError && (
                    <p className="text-[11px] text-red-400 font-bold tracking-wider uppercase">✕ {subscribeError}</p>
                  )}
                  {subscribeStatus === "success" && (
                    <p className="text-[11px] text-green-400/80 font-bold tracking-wider uppercase">✓ You&apos;re on the list. Welcome to the Syndicate.</p>
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
      <div className="bg-[#FAF8F5] border-t border-neutral-200/60 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <span className="text-[12vw] lg:text-[10vw] font-extrabold tracking-[0.05em] text-[#030213]/[0.025] whitespace-nowrap uppercase leading-none">
            {config.brandName || "DRIP DOGGY"}
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 lg:py-16">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-10">
            <div className="col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <img src={logoIcon} alt="" className="h-20 w-auto object-contain mix-blend-multiply" />
                <img src={logo} alt={config.brandName || "DRIP DOGGY"} className="h-24 w-auto object-contain mix-blend-multiply" />
              </div>
              <span className="block text-[9px] font-extrabold tracking-[0.25em] text-[#b2533e] uppercase">
                {config.tagline || "Luxury Streetwear / Est. 2026"}
              </span>
              <p className="text-sm text-neutral-500 leading-relaxed font-light max-w-sm">
                {config.description || "Architectural silhouettes, premium fabrication, and uncompromised street luxury for the modern wardrobe."}
              </p>

              {activeSocials.length > 0 && (
                <div className="flex gap-2.5 pt-4">
                  {activeSocials.map((s) => (
                    <SocialButton key={s.label} platform={s.platform} label={s.label} href={s.url} />
                  ))}
                </div>
              )}
            </div>
            
            {config.linkGroups && config.linkGroups.length > 0 && (
              <div 
                className="col-span-7 grid gap-8"
                style={{ gridTemplateColumns: `repeat(${config.linkGroups.length}, minmax(0, 1fr))` }}
              >
                {config.linkGroups.map((group, gi) => (
                  <div key={gi}>
                    <h4 className="text-[10px] font-extrabold tracking-[0.25em] text-neutral-800 uppercase mb-5">
                      {group.title}
                    </h4>
                    <ul className="space-y-3">
                      {group.links.map((link, li) => (
                        <li key={li}>
                          <Link to={link.to} className="text-[12px] text-neutral-500 hover:text-[#030213] transition-colors duration-200 font-medium">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-2">
            <div className="space-y-4 pb-6 border-b border-neutral-200/70">
              <div className="flex items-center gap-3">
                <img src={logoIcon} alt="" className="h-22 w-auto object-contain mix-blend-multiply" />
                <img src={logo} alt={config.brandName || "DRIP DOGGY"} className="h-24 w-auto object-contain mix-blend-multiply" />
              </div>
              <span className="block text-[8px] font-extrabold tracking-[0.25em] text-[#b2533e] uppercase">
                {config.tagline || "Luxury Streetwear / Est. 2026"}
              </span>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                {config.description || "Architectural silhouettes, premium fabrication, and uncompromised street luxury for the modern wardrobe."}
              </p>
              {activeSocials.length > 0 && (
                <div className="flex gap-2.5 pt-2">
                  {activeSocials.map((s) => (
                    <SocialButton key={s.label} platform={s.platform} label={s.label} href={s.url} />
                  ))}
                </div>
              )}
            </div>
            
            {config.linkGroups && config.linkGroups.map((group, gi) => (
              <MobileAccordion key={gi} title={group.title} links={group.links} />
            ))}
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          SECTION D — BOTTOM LEGAL BAR
          ═════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#030213]">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-white/40 font-bold tracking-wider uppercase order-2 md:order-1">
              {config.copyrightText ? config.copyrightText.replace("{year}", new Date().getFullYear().toString()) : `© ${new Date().getFullYear()} Drip Doggy. All rights reserved.`}
            </p>
            <div className="flex items-center gap-4 order-1 md:order-2">
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/privacy" className="text-[9px] text-white/40 hover:text-white/70 transition-colors font-bold tracking-wider uppercase">Privacy</Link>
                <span className="text-white/10 text-[8px]">|</span>
                <Link to="/terms" className="text-[9px] text-white/40 hover:text-white/70 transition-colors font-bold tracking-wider uppercase">Terms</Link>
                <span className="text-white/10 text-[8px]">|</span>
                <Link to="/privacy" className="text-[9px] text-white/40 hover:text-white/70 transition-colors font-bold tracking-wider uppercase">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
