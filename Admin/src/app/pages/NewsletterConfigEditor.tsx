import { useState, useEffect } from "react";
import { RotateCcw, Check } from "lucide-react";
import { getNewsletterConfig, setNewsletterConfig, NewsletterConfig } from "../lib/admin-content-store";

export function NewsletterConfigEditorPage() {
  const [config, setConfig] = useState<NewsletterConfig>({
    heading: "", subtitle: "", placeholder: "", buttonText: "", consentText: "", successMessage: "", active: true,
  });
  const [toast, setToast] = useState("");

  useEffect(() => { setConfig(getNewsletterConfig()); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const save = () => { setNewsletterConfig(config); showToast("Newsletter config saved"); };

  const reset = () => {
    setConfig({
      heading: "JOIN THE DRIP DOGGY CREW",
      subtitle: "Get early access to limited drops, exclusive capsule collections, and Mumbai-based culture updates straight to your inbox.",
      placeholder: "ENTER YOUR EMAIL", buttonText: "SUBSCRIBE",
      consentText: "By subscribing, you agree to our Privacy Policy and consent to receive updates from Drip Doggy.",
      successMessage: "You're in! Welcome to the Drip Doggy Syndicate.",
      active: true,
    });
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Newsletter Config</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Manage the Drip Doggy newsletter signup section</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer bg-white rounded-none"><RotateCcw className="w-3 h-3" /> Reset Defaults</button>
          <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none"><Check className="w-3.5 h-3.5" /> Save</button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200/80 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Heading</label>
            <input value={config.heading} onChange={e => setConfig({ ...config, heading: e.target.value })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
          </div>
          <div>
            <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Button Text</label>
            <input value={config.buttonText} onChange={e => setConfig({ ...config, buttonText: e.target.value })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
          </div>
        </div>
        <div>
          <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Subtitle</label>
          <textarea value={config.subtitle} onChange={e => setConfig({ ...config, subtitle: e.target.value })}
            className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none h-12" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Placeholder Text</label>
            <input value={config.placeholder} onChange={e => setConfig({ ...config, placeholder: e.target.value })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
          </div>
          <div>
            <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Success Message</label>
            <input value={config.successMessage} onChange={e => setConfig({ ...config, successMessage: e.target.value })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
          </div>
        </div>
        <div>
          <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Consent Text</label>
          <textarea value={config.consentText} onChange={e => setConfig({ ...config, consentText: e.target.value })}
            className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none h-12" />
        </div>
      </div>

      {toast && <div className="fixed bottom-6 right-6 bg-[#030213] text-white text-[9px] font-extrabold tracking-widest px-4 py-3 uppercase z-50">{toast}</div>}
    </div>
  );
}
