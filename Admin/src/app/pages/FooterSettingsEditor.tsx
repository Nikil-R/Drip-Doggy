import { useState, useEffect } from "react";
import { RotateCcw, Check, Plus, Trash2, GripVertical } from "lucide-react";
import { getFooterConfig, setFooterConfig, FooterConfig, FooterLink, SocialLink } from "../lib/admin-content-store";

export function FooterSettingsEditorPage() {
  const [config, setConfigState] = useState<FooterConfig>({
    brandName: "", tagline: "", description: "", copyrightText: "",
    ctaSection: { tag: "", heading: "", description: "", buttonText: "", chips: [] },
    linkGroups: [], socialLinks: [], active: true,
  });
  const [toast, setToast] = useState("");

  useEffect(() => { setConfigState(getFooterConfig()); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const save = () => { setFooterConfig(config); showToast("Footer saved"); };

  const reset = () => {
    setConfigState({
      brandName: "DRIP DOGGY", tagline: "Luxury Streetwear / Est. 2026",
      description: "Architectural silhouettes, premium fabrication, and uncompromised street luxury for the modern wardrobe.",
      copyrightText: "(c) 2026 Drip Doggy. All rights reserved.",
      ctaSection: { tag: "Private Access / Drip Doggy Syndicate", heading: "Join the Next Drop", description: "Receive early access to limited capsules, archival restocks, and editorial releases before the public drop.", buttonText: "SUBSCRIBE", chips: ["EARLY ACCESS", "LIMITED CAPSULES", "MEMBERS-ONLY"] },
      linkGroups: [
        { title: "Shop", links: [{ label: "New In", to: "/shop" }, { label: "Outerwear", to: "/shop?category=outerwear" }, { label: "Wishlist", to: "/account#wishlist" }] },
        { title: "Client Services", links: [{ label: "Contact Us", to: "/contact" }, { label: "FAQ & Shipping", to: "/faq" }] },
        { title: "The House", links: [{ label: "About Drip Doggy", to: "/about" }, { label: "Privacy Policy", to: "/privacy" }] },
      ],
      socialLinks: [
        { platform: "instagram", label: "Instagram", url: "#", active: true },
        { platform: "youtube", label: "YouTube", url: "#", active: true },
      ],
      active: true,
    });
  };

  const updateChips = (chips: string[]) => setConfigState({ ...config, ctaSection: { ...config.ctaSection, chips } });

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">Footer Settings</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Manage footer content and links</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer bg-card rounded-none"><RotateCcw className="w-3 h-3" /> Reset</button>
          <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none"><Check className="w-3.5 h-3.5" /> Save</button>
        </div>
      </div>

      {/* Brand Info */}
      <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
        <h3 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Brand Info</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Brand Name</label>
            <input value={config.brandName} onChange={e => setConfigState({ ...config, brandName: e.target.value })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
          </div>
          <div>
            <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Tagline</label>
            <input value={config.tagline} onChange={e => setConfigState({ ...config, tagline: e.target.value })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
          </div>
          <div>
            <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Copyright Text</label>
            <input value={config.copyrightText} onChange={e => setConfigState({ ...config, copyrightText: e.target.value })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
          </div>
        </div>
        <div>
          <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Description</label>
          <textarea value={config.description} onChange={e => setConfigState({ ...config, description: e.target.value })}
            className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none h-16" />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
        <h3 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">CTA Section (Newsletter in Footer)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Tag</label>
            <input value={config.ctaSection.tag} onChange={e => setConfigState({ ...config, ctaSection: { ...config.ctaSection, tag: e.target.value } })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
          </div>
          <div>
            <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Heading</label>
            <input value={config.ctaSection.heading} onChange={e => setConfigState({ ...config, ctaSection: { ...config.ctaSection, heading: e.target.value } })}
              className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
          </div>
        </div>
        <div>
          <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Description</label>
          <textarea value={config.ctaSection.description} onChange={e => setConfigState({ ...config, ctaSection: { ...config.ctaSection, description: e.target.value } })}
            className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none h-12" />
        </div>
        <div>
          <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Chips (comma-separated)</label>
          <input value={config.ctaSection.chips.join(", ")} onChange={e => updateChips(e.target.value.split(",").map(s => s.trim()))}
            className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
        </div>
      </div>

      {/* Link Groups */}
      <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
        <h3 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Link Groups</h3>
        {config.linkGroups.map((group, gi) => (
          <div key={gi} className="border border-neutral-100 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <input value={group.title} onChange={e => {
                const g = [...config.linkGroups];
                g[gi] = { ...g[gi], title: e.target.value };
                setConfigState({ ...config, linkGroups: g });
              }} className="border border-neutral-200/80 px-2 py-1 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none w-48" />
              <button onClick={() => setConfigState({ ...config, linkGroups: config.linkGroups.filter((_, i) => i !== gi) })}
                className="text-[#b2533e] text-[7px] font-semibold cursor-pointer bg-transparent border-none">REMOVE</button>
            </div>
            {group.links.map((link, li) => (
              <div key={li} className="flex items-center gap-2 ml-4">
                <input value={link.label} onChange={e => {
                  const g = [...config.linkGroups];
                  g[gi].links[li] = { ...g[gi].links[li], label: e.target.value };
                  setConfigState({ ...config, linkGroups: g });
                }} className="border border-neutral-200/80 px-2 py-1 text-[8px] font-bold focus:outline-none focus:border-[#030213] rounded-none w-40" />
                <input value={link.to} onChange={e => {
                  const g = [...config.linkGroups];
                  g[gi].links[li] = { ...g[gi].links[li], to: e.target.value };
                  setConfigState({ ...config, linkGroups: g });
                }} className="border border-neutral-200/80 px-2 py-1 text-[8px] font-bold focus:outline-none focus:border-[#030213] rounded-none w-32" />
                <button onClick={() => {
                  const g = [...config.linkGroups];
                  g[gi].links = g[gi].links.filter((_, i) => i !== li);
                  setConfigState({ ...config, linkGroups: g });
                }} className="text-neutral-300 hover:text-[#b2533e] cursor-pointer bg-transparent border-none"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
            <button onClick={() => {
              const g = [...config.linkGroups];
              g[gi].links.push({ label: "", to: "" });
              setConfigState({ ...config, linkGroups: g });
            }} className="text-[7px] font-semibold text-[#030213] hover:text-neutral-600 cursor-pointer bg-transparent border-none ml-4">+ Add Link</button>
          </div>
        ))}
        <button onClick={() => setConfigState({ ...config, linkGroups: [...config.linkGroups, { title: "", links: [] }] })}
          className="border border-dashed border-neutral-300 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase w-full cursor-pointer bg-transparent">+ Add Link Group</button>
      </div>

      {/* Social Links */}
      <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
        <h3 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Social Links</h3>
        {config.socialLinks.map((sl, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={sl.platform} onChange={e => {
              const s = [...config.socialLinks];
              s[i] = { ...s[i], platform: e.target.value };
              setConfigState({ ...config, socialLinks: s });
            }} className="border border-neutral-200/80 px-2 py-1 text-[8px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none w-28" />
            <input value={sl.label} onChange={e => {
              const s = [...config.socialLinks];
              s[i] = { ...s[i], label: e.target.value };
              setConfigState({ ...config, socialLinks: s });
            }} className="border border-neutral-200/80 px-2 py-1 text-[8px] font-bold focus:outline-none focus:border-[#030213] rounded-none w-28" />
            <input value={sl.url} onChange={e => {
              const s = [...config.socialLinks];
              s[i] = { ...s[i], url: e.target.value };
              setConfigState({ ...config, socialLinks: s });
            }} className="border border-neutral-200/80 px-2 py-1 text-[8px] font-bold focus:outline-none focus:border-[#030213] rounded-none w-40" />
            <button onClick={() => {
              const s = [...config.socialLinks];
              s[i] = { ...s[i], active: !s[i].active };
              setConfigState({ ...config, socialLinks: s });
            }} className={`text-[7px] font-semibold tracking-widest px-2 py-1 cursor-pointer border-none ${sl.active ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-400"}`}>{sl.active ? "ON" : "OFF"}</button>
            <button onClick={() => setConfigState({ ...config, socialLinks: config.socialLinks.filter((_, j) => j !== i) })}
              className="text-neutral-300 hover:text-[#b2533e] cursor-pointer bg-transparent border-none"><Trash2 className="w-3 h-3" /></button>
          </div>
        ))}
        <button onClick={() => setConfigState({ ...config, socialLinks: [...config.socialLinks, { platform: "", label: "", url: "", active: true }] })}
          className="text-[7px] font-semibold text-[#030213] hover:text-neutral-600 cursor-pointer bg-transparent border-none">+ Add Social Link</button>
      </div>

      {toast && <div className="fixed bottom-6 right-6 bg-[#030213] text-white text-[9px] font-semibold tracking-widest px-4 py-3 uppercase z-50">{toast}</div>}
    </div>
  );
}
