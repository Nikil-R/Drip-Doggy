import { useState, useEffect } from "react";
import { RotateCcw, Check, Mail, Eye, EyeOff } from "lucide-react";
import { getNewsletterConfig, setNewsletterConfig, NewsletterConfig } from "../lib/admin-content-store";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer p-0 shrink-0 border-none outline-none ${
        enabled ? "bg-[#224870]" : "bg-neutral-350"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function NewsletterConfigEditorPage() {
  const [config, setConfig] = useState<NewsletterConfig>({
    heading: "", subtitle: "", placeholder: "", buttonText: "", consentText: "", successMessage: "", active: true,
  });
  const [toast, setToast] = useState("");

  useEffect(() => { setConfig(getNewsletterConfig()); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const save = () => { setNewsletterConfig(config); showToast("Newsletter config saved"); };

  const reset = () => {
    const defaults = {
      heading: "JOIN THE SYNDICATE",
      subtitle: "Subscribe for early drop alerts, limited edition capsules, and culture updates.",
      placeholder: "ENTER YOUR EMAIL", 
      buttonText: "SUBSCRIBE",
      consentText: "By subscribing, you agree to our Privacy Policy and consent to receive updates.",
      successMessage: "Thanks for subscribing! Welcome to the Syndicate.",
      active: true,
    };
    setConfig(defaults);
    showToast("Reset defaults applied");
  };

  return (
    <div className="space-y-8 font-sans text-[#382d24]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-[#224870]" /> Newsletter Config
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">Manage the DripDoggy newsletter signup section</p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={reset} className="border border-neutral-300 hover:border-[#224870] text-[#382d24] hover:text-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase cursor-pointer bg-transparent rounded-none transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button onClick={save} className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-colors">
            <Check className="w-3.5 h-3.5" /> Save Config
          </button>
        </div>
      </div>

      {/* Editor Block */}
      <div className="bg-card border border-neutral-200/80 p-6 space-y-4.5">
        <span className="text-[10px] font-black tracking-widest uppercase text-[#382d24] block border-b border-neutral-200/60 pb-3">Newsletter Content Parameters</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Heading</label>
            <input value={config.heading} onChange={e => setConfig({ ...config, heading: e.target.value })}
              className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
          </div>
          <div className="space-y-1">
            <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Button Text</label>
            <input value={config.buttonText} onChange={e => setConfig({ ...config, buttonText: e.target.value })}
              className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="space-y-1 md:col-span-9">
            <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Subtitle</label>
            <textarea value={config.subtitle} onChange={e => setConfig({ ...config, subtitle: e.target.value })}
              className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none h-16 text-[#382d24]" />
          </div>
          <div className="flex items-center justify-between bg-[#faf8f5] border border-neutral-300 p-2.5 h-[64px] md:col-span-3">
            <span className="text-[8.5px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              {config.active ? <Eye className="w-3.5 h-3.5 text-[#224870]" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
              Active on Home
            </span>
            <ToggleSwitch enabled={config.active} onClick={() => setConfig({ ...config, active: !config.active })} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Input Placeholder Text</label>
            <input value={config.placeholder} onChange={e => setConfig({ ...config, placeholder: e.target.value })}
              className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
          </div>
          <div className="space-y-1">
            <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Subscription Success Message</label>
            <input value={config.successMessage} onChange={e => setConfig({ ...config, successMessage: e.target.value })}
              className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Consent / Compliance Disclaimer</label>
          <textarea value={config.consentText} onChange={e => setConfig({ ...config, consentText: e.target.value })}
            className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none h-16 text-[#382d24]" />
        </div>
      </div>

      {/* Live Component Preview */}
      <div className="bg-[#faf8f5] border border-neutral-200/80 p-6 space-y-4 shadow-sm">
        <span className="text-[10px] font-black tracking-widest uppercase text-[#382d24] block border-b border-neutral-200/60 pb-3">Live Component Preview</span>
        
        {config.active ? (
          <div className="bg-black text-white py-14 px-6 text-center space-y-6 max-w-2xl mx-auto border border-neutral-800 animate-fade-in">
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-[0.12em] uppercase text-white">
              {config.heading || "JOIN THE SYNDICATE"}
            </h2>
            <p className="text-white/80 text-xs tracking-widest uppercase max-w-md mx-auto leading-relaxed">
              {config.subtitle || "Subscribe for early drop alerts, limited edition capsules, and culture updates."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto items-center border-b border-white/20 pb-2 pt-3">
              <input
                type="email"
                disabled
                placeholder={config.placeholder || "ENTER YOUR EMAIL"}
                className="bg-transparent border-none text-[11px] tracking-wider focus:outline-none flex-1 placeholder-neutral-500 uppercase text-white/50 w-full text-center sm:text-left cursor-not-allowed"
              />
              <button disabled className="text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase bg-transparent border-none p-0 shrink-0 cursor-not-allowed">
                {config.buttonText || "SUBSCRIBE"}
              </button>
            </div>
            
            <p className="text-white/40 text-[9px] tracking-wide uppercase pt-1 max-w-md mx-auto leading-normal">
              {config.consentText || "By subscribing, you agree to our Privacy Policy and consent to receive updates."}
            </p>
          </div>
        ) : (
          <div className="py-12 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest border border-dashed border-neutral-300">
            Newsletter section is currently disabled/hidden from home page
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#382d24] text-[#faf8f5] text-[9px] font-bold tracking-widest px-4.5 py-3.5 uppercase z-50 border border-neutral-700 shadow-2xl animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
