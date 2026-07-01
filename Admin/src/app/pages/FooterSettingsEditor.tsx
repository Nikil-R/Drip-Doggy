import { useState, useEffect } from "react";
import { RotateCcw, Check, Plus, Trash2, ArrowUp, ArrowDown, Shield, Mail, Instagram, Youtube, Twitter, Facebook, Link2, Eye, EyeOff, LayoutGrid, Globe, Share2 } from "lucide-react";
import { getFooterConfig, setFooterConfig, FooterConfig, FooterLink, SocialLink } from "../lib/admin-content-store";

// Icon mapping for social platforms in preview
const PREVIEW_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  facebook: Facebook,
};

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer p-0 shrink-0 border-none outline-none ${
        enabled ? "bg-[#224870]" : "bg-neutral-300"
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

export function FooterSettingsEditorPage() {
  const [config, setConfigState] = useState<FooterConfig>({
    brandName: "", tagline: "", description: "", copyrightText: "",
    ctaSection: { tag: "", heading: "", description: "", buttonText: "", chips: [] },
    linkGroups: [], socialLinks: [], active: true,
  });
  const [activeTab, setActiveTab] = useState<"brand" | "cta" | "links" | "social">("brand");
  const [toast, setToast] = useState("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setConfigState(getFooterConfig());
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const save = () => {
    setFooterConfig(config);
    // Dispatch custom event to sync in same-window frames if any
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_footer" } }));
    showToast("Footer configuration saved");
  };

  const reset = () => {
    const defaults: FooterConfig = {
      brandName: "DRIP DOGGY",
      tagline: "Luxury Streetwear / Est. 2026",
      description: "Architectural silhouettes, premium fabrication, and uncompromised street luxury for the modern wardrobe.",
      copyrightText: "© 2026 Drip Doggy. All rights reserved.",
      ctaSection: {
        tag: "Private Access / Drip Doggy Syndicate",
        heading: "Join the Next Drop",
        description: "Receive early access to limited capsules, archival restocks, and editorial releases before the public drop.",
        buttonText: "SUBSCRIBE",
        chips: ["EARLY ACCESS", "LIMITED CAPSULES", "MEMBERS-ONLY"]
      },
      linkGroups: [
        {
          title: "Shop",
          links: [
            { label: "New In", to: "/shop" },
            { label: "Outerwear", to: "/shop?category=outerwear" },
            { label: "Knitwear", to: "/shop?category=knitwear" },
            { label: "Wishlist", to: "/account#wishlist" },
            { label: "Accessories (Soon)", to: "/coming-soon" },
            { label: "Men's Syndicate (Soon)", to: "/coming-soon" }
          ]
        },
        {
          title: "Client Services",
          links: [
            { label: "Contact Us", to: "/contact" },
            { label: "FAQ & Shipping", to: "/faq" },
            { label: "Returns & Size Guide", to: "/returns" },
            { label: "Track Order", to: "/account#orders" }
          ]
        },
        {
          title: "The House",
          links: [
            { label: "About Drip Doggy", to: "/about" },
            { label: "Privacy Policy", to: "/privacy" },
            { label: "Terms of Service", to: "/terms" }
          ]
        }
      ],
      socialLinks: [
        { platform: "instagram", label: "Instagram", url: "#", active: true },
        { platform: "youtube", label: "YouTube", url: "#", active: true },
        { platform: "twitter", label: "X / Twitter", url: "#", active: true },
        { platform: "facebook", label: "Facebook", url: "#", active: true }
      ],
      active: true,
    };
    setConfigState(defaults);
    showToast("Reset defaults applied");
  };

  const updateChips = (chipsString: string) => {
    const list = chipsString.split(",").map(s => s.trim()).filter(Boolean);
    setConfigState({
      ...config,
      ctaSection: { ...config.ctaSection, chips: list }
    });
  };

  // Group sorting / positioning helpers
  const moveGroup = (index: number, direction: "up" | "down") => {
    const groups = [...config.linkGroups];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= groups.length) return;
    const temp = groups[index];
    groups[index] = groups[targetIndex];
    groups[targetIndex] = temp;
    setConfigState({ ...config, linkGroups: groups });
  };

  const moveLink = (groupIndex: number, linkIndex: number, direction: "up" | "down") => {
    const groups = [...config.linkGroups];
    const targetIndex = direction === "up" ? linkIndex - 1 : linkIndex + 1;
    if (targetIndex < 0 || targetIndex >= groups[groupIndex].links.length) return;
    const temp = groups[groupIndex].links[linkIndex];
    groups[groupIndex].links[linkIndex] = groups[groupIndex].links[targetIndex];
    groups[groupIndex].links[targetIndex] = temp;
    setConfigState({ ...config, linkGroups: groups });
  };

  return (
    <div className="space-y-8 font-sans text-[#382d24]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#224870]" /> Footer Settings
          </h1>
          <p className="text-[11px] text-[#382d24]/60 font-[900] uppercase tracking-wider mt-1">Configure brand identity, legal notices, footer columns, and social links</p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={reset} className="border border-neutral-300 hover:border-[#224870] text-[#382d24] hover:text-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase cursor-pointer bg-transparent rounded-none transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button onClick={save} className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-colors">
            <Check className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </div>

      {/* Visibility Toggle Switch */}
      <div className="bg-[#faf8f5] border border-neutral-200/80 p-4.5 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-xs font-black uppercase tracking-wider block">Global Footer Status</span>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Enable or disable footer widget visibility across Drip Doggy storefront</p>
        </div>
        <div className="flex items-center gap-4 bg-white border border-neutral-200/80 px-4 py-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
            {config.active ? <Eye className="w-3.5 h-3.5 text-[#224870]" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
            {config.active ? "Footer Visible" : "Footer Hidden"}
          </span>
          <ToggleSwitch enabled={config.active} onClick={() => setConfigState({ ...config, active: !config.active })} />
        </div>
      </div>

      {/* Editor Tabs & Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-8 bg-card border border-neutral-200/80 shadow-xs">
          {/* Editor Tabs */}
          <div className="flex border-b border-neutral-200 bg-[#faf8f5]">
            <button
              onClick={() => setActiveTab("brand")}
              className={`flex-1 py-3.5 text-[9.5px] font-black uppercase tracking-widest text-center transition-colors border-none cursor-pointer ${
                activeTab === "brand" ? "bg-white border-b-2 border-b-[#224870] text-[#224870]" : "text-neutral-500 hover:text-[#382d24]"
              }`}
            >
              Identity & Info
            </button>
            <button
              onClick={() => setActiveTab("cta")}
              className={`flex-1 py-3.5 text-[9.5px] font-black uppercase tracking-widest text-center transition-colors border-none cursor-pointer ${
                activeTab === "cta" ? "bg-white border-b-2 border-b-[#224870] text-[#224870]" : "text-neutral-500 hover:text-[#382d24]"
              }`}
            >
              Syndicate CTA
            </button>
            <button
              onClick={() => setActiveTab("links")}
              className={`flex-1 py-3.5 text-[9.5px] font-black uppercase tracking-widest text-center transition-colors border-none cursor-pointer ${
                activeTab === "links" ? "bg-white border-b-2 border-b-[#224870] text-[#224870]" : "text-neutral-500 hover:text-[#382d24]"
              }`}
            >
              Columns & Links
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`flex-1 py-3.5 text-[9.5px] font-black uppercase tracking-widest text-center transition-colors border-none cursor-pointer ${
                activeTab === "social" ? "bg-white border-b-2 border-b-[#224870] text-[#224870]" : "text-neutral-500 hover:text-[#382d24]"
              }`}
            >
              Social Channels
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: BRAND IDENTITY */}
            {activeTab === "brand" && (
              <div className="space-y-5">
                <div className="border-b border-neutral-100 pb-3">
                  <span className="text-[10px] font-black tracking-widest uppercase text-neutral-400 block">Brand Info & Legal Specifications</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Brand Name</label>
                    <input
                      value={config.brandName}
                      onChange={e => setConfigState({ ...config, brandName: e.target.value })}
                      className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Brand Tagline</label>
                    <input
                      value={config.tagline}
                      onChange={e => setConfigState({ ...config, tagline: e.target.value })}
                      className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Copyright Banner</label>
                  <input
                    value={config.copyrightText}
                    onChange={e => setConfigState({ ...config, copyrightText: e.target.value })}
                    className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                    placeholder="Use {year} for dynamic current year"
                  />
                  <p className="text-[8.5px] text-neutral-400 font-bold uppercase tracking-wider">Example: © &#123;year&#125; Drip Doggy. All rights reserved.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Brand Editorial Description</label>
                  <textarea
                    value={config.description}
                    onChange={e => setConfigState({ ...config, description: e.target.value })}
                    className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none h-24 text-[#382d24]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: SYNDICATE CTA */}
            {activeTab === "cta" && (
              <div className="space-y-5">
                <div className="border-b border-neutral-100 pb-3">
                  <span className="text-[10px] font-black tracking-widest uppercase text-neutral-400 block">Pre-Footer Syndicate CTA Banner</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Tagline Badge</label>
                    <input
                      value={config.ctaSection?.tag || ""}
                      onChange={e => setConfigState({
                        ...config,
                        ctaSection: { ...(config.ctaSection || { tag: "", heading: "", description: "", buttonText: "", chips: [] }), tag: e.target.value }
                      })}
                      className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Subscribe Button Text</label>
                    <input
                      value={config.ctaSection?.buttonText || ""}
                      onChange={e => setConfigState({
                        ...config,
                        ctaSection: { ...(config.ctaSection || { tag: "", heading: "", description: "", buttonText: "", chips: [] }), buttonText: e.target.value }
                      })}
                      className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Heading Title</label>
                  <input
                    value={config.ctaSection?.heading || ""}
                    onChange={e => setConfigState({
                      ...config,
                      ctaSection: { ...(config.ctaSection || { tag: "", heading: "", description: "", buttonText: "", chips: [] }), heading: e.target.value }
                    })}
                    className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                    placeholder="Use \n or <br /> to break lines"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Tag Description</label>
                  <textarea
                    value={config.ctaSection?.description || ""}
                    onChange={e => setConfigState({
                      ...config,
                      ctaSection: { ...(config.ctaSection || { tag: "", heading: "", description: "", buttonText: "", chips: [] }), description: e.target.value }
                    })}
                    className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none h-20 text-[#382d24]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Promo Chips (Comma Separated)</label>
                  <input
                    value={(config.ctaSection?.chips || []).join(", ")}
                    onChange={e => updateChips(e.target.value)}
                    className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                    placeholder="EARLY ACCESS, LIMITED RESTOCKS"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: NAV COLUMNS */}
            {activeTab === "links" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="text-[10px] font-black tracking-widest uppercase text-neutral-400 block">Link Group Directory Columns</span>
                  <button
                    onClick={() => {
                      setConfigState({
                        ...config,
                        linkGroups: [...config.linkGroups, { title: "NEW COLUMN", links: [] }]
                      });
                    }}
                    className="flex items-center gap-1 bg-[#224870] hover:bg-[#224870]/90 text-white text-[8px] font-black tracking-widest px-3 py-1.5 uppercase cursor-pointer border-none rounded-none"
                  >
                    <Plus className="w-3 h-3" /> Add Column
                  </button>
                </div>

                <div className="space-y-4">
                  {config.linkGroups.map((group, gi) => (
                    <div key={gi} className="border border-neutral-200/80 bg-[#faf8f5] p-4.5 space-y-3.5 relative">
                      {/* Column Header & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Col {gi+1}:</span>
                          <input
                            value={group.title}
                            onChange={e => {
                              const list = [...config.linkGroups];
                              list[gi].title = e.target.value;
                              setConfigState({ ...config, linkGroups: list });
                            }}
                            placeholder="Column Title"
                            className="border border-neutral-300 bg-white px-2 py-1 text-[10px] font-black uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] w-48"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            disabled={gi === 0}
                            onClick={() => moveGroup(gi, "up")}
                            className="p-1 border border-neutral-200 hover:border-[#224870] text-[#382d24] disabled:opacity-30 disabled:pointer-events-none cursor-pointer bg-white"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={gi === config.linkGroups.length - 1}
                            onClick={() => moveGroup(gi, "down")}
                            className="p-1 border border-neutral-200 hover:border-[#224870] text-[#382d24] disabled:opacity-30 disabled:pointer-events-none cursor-pointer bg-white"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setConfigState({
                                ...config,
                                linkGroups: config.linkGroups.filter((_, i) => i !== gi)
                              });
                            }}
                            className="p-1 text-[#b2533e] hover:bg-[#b2533e]/10 border border-[#b2533e]/30 cursor-pointer bg-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Links List */}
                      <div className="space-y-2 pl-3 border-l border-neutral-200/80">
                        {group.links.map((link, li) => (
                          <div key={li} className="flex items-center gap-2">
                            <input
                              value={link.label}
                              onChange={e => {
                                const list = [...config.linkGroups];
                                list[gi].links[li].label = e.target.value;
                                setConfigState({ ...config, linkGroups: list });
                              }}
                              placeholder="Link Label"
                              className="border border-neutral-300 bg-white px-2 py-1 text-[9px] font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] flex-1"
                            />
                            <input
                              value={link.to}
                              onChange={e => {
                                const list = [...config.linkGroups];
                                list[gi].links[li].to = e.target.value;
                                setConfigState({ ...config, linkGroups: list });
                              }}
                              placeholder="Destination URL / Route"
                              className="border border-neutral-300 bg-white px-2 py-1 text-[9px] font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] w-48"
                            />
                            <div className="flex items-center gap-1">
                              <button
                                disabled={li === 0}
                                onClick={() => moveLink(gi, li, "up")}
                                className="p-1 hover:text-[#224870] text-neutral-400 disabled:opacity-20 cursor-pointer bg-transparent border-none"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                disabled={li === group.links.length - 1}
                                onClick={() => moveLink(gi, li, "down")}
                                className="p-1 hover:text-[#224870] text-neutral-400 disabled:opacity-20 cursor-pointer bg-transparent border-none"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  const list = [...config.linkGroups];
                                  list[gi].links = list[gi].links.filter((_, i) => i !== li);
                                  setConfigState({ ...config, linkGroups: list });
                                }}
                                className="p-1 text-neutral-300 hover:text-[#b2533e] cursor-pointer bg-transparent border-none"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {group.links.length === 0 && (
                          <div className="py-2.5 text-center text-[8.5px] font-bold text-neutral-400 uppercase tracking-wider">
                            No links configured in this column
                          </div>
                        )}

                        <button
                          onClick={() => {
                            const list = [...config.linkGroups];
                            list[gi].links.push({ label: "NEW LINK", to: "#" });
                            setConfigState({ ...config, linkGroups: list });
                          }}
                          className="flex items-center gap-1 text-[8px] font-black text-[#224870] hover:text-[#224870]/80 cursor-pointer bg-transparent border-none pt-1"
                        >
                          <Plus className="w-3 h-3" /> Add Link Item
                        </button>
                      </div>
                    </div>
                  ))}

                  {config.linkGroups.length === 0 && (
                    <div className="py-8 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest border border-dashed border-neutral-300">
                      No Columns Configured. Click &quot;Add Column&quot; to build directory structures.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: SOCIAL CHANNELS */}
            {activeTab === "social" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="text-[10px] font-black tracking-widest uppercase text-neutral-400 block">Social Media Handles</span>
                  <button
                    onClick={() => {
                      setConfigState({
                        ...config,
                        socialLinks: [...config.socialLinks, { platform: "instagram", label: "Instagram", url: "#", active: true }]
                      });
                    }}
                    className="flex items-center gap-1 bg-[#224870] hover:bg-[#224870]/90 text-white text-[8px] font-black tracking-widest px-3 py-1.5 uppercase cursor-pointer border-none rounded-none"
                  >
                    <Plus className="w-3 h-3" /> Add Account
                  </button>
                </div>

                <div className="space-y-3">
                  {config.socialLinks.map((sl, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#faf8f5] border border-neutral-200/80 p-3.5">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase block">Platform (ID)</label>
                          <input
                            value={sl.platform}
                            onChange={e => {
                              const list = [...config.socialLinks];
                              list[i].platform = e.target.value;
                              setConfigState({ ...config, socialLinks: list });
                            }}
                            className="w-full border border-neutral-300 bg-white px-2 py-1.5 text-[9px] font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                            placeholder="instagram, youtube, twitter, facebook"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase block">Label Name</label>
                          <input
                            value={sl.label}
                            onChange={e => {
                              const list = [...config.socialLinks];
                              list[i].label = e.target.value;
                              setConfigState({ ...config, socialLinks: list });
                            }}
                            className="w-full border border-neutral-300 bg-white px-2 py-1.5 text-[9px] font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                            placeholder="Instagram Account"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase block">Target URL</label>
                          <input
                            value={sl.url}
                            onChange={e => {
                              const list = [...config.socialLinks];
                              list[i].url = e.target.value;
                              setConfigState({ ...config, socialLinks: list });
                            }}
                            className="w-full border border-neutral-300 bg-white px-2 py-1.5 text-[9px] font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <div className="flex flex-col items-center">
                          <span className="text-[7.5px] font-black text-neutral-400 uppercase tracking-widest mb-1">State</span>
                          <button
                            onClick={() => {
                              const list = [...config.socialLinks];
                              list[i].active = !list[i].active;
                              setConfigState({ ...config, socialLinks: list });
                            }}
                            className={`text-[8px] font-black tracking-widest px-2.5 py-1 cursor-pointer border-none rounded-none transition-colors ${
                              sl.active ? "bg-green-100 text-green-800" : "bg-neutral-200 text-neutral-500"
                            }`}
                          >
                            {sl.active ? "ACTIVE" : "HIDDEN"}
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setConfigState({
                              ...config,
                              socialLinks: config.socialLinks.filter((_, j) => j !== i)
                            });
                          }}
                          className="p-2 text-[#b2533e] hover:bg-[#b2533e]/10 border border-[#b2533e]/30 cursor-pointer bg-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {config.socialLinks.length === 0 && (
                    <div className="py-8 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest border border-dashed border-neutral-300">
                      No social links configured. Click &quot;Add Account&quot; to define handles.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Side */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#faf8f5] border border-neutral-200/80 p-5 shadow-xs space-y-4.5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
              <span className="text-[10px] font-black tracking-widest uppercase text-[#382d24] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#224870]" /> Live Visual Footer
              </span>
              <div className="flex border border-neutral-200 bg-white p-0.5">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-3 py-1 text-[8.5px] font-black uppercase tracking-wider border-none cursor-pointer transition-colors ${
                    previewDevice === "desktop" ? "bg-[#224870] text-white" : "text-neutral-500 hover:text-[#382d24]"
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-3 py-1 text-[8.5px] font-black uppercase tracking-wider border-none cursor-pointer transition-colors ${
                    previewDevice === "mobile" ? "bg-[#224870] text-white" : "text-neutral-500 hover:text-[#382d24]"
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {config.active ? (
              <div className={`border border-neutral-300/80 bg-white overflow-hidden transition-all duration-300 ${
                previewDevice === "mobile" ? "max-w-[320px] mx-auto" : "w-full"
              }`} style={{ zoom: previewDevice === "mobile" ? 0.85 : 0.65 }}>
                {/* Visual rendering identical to client-side component */}
                {config.ctaSection && (
                  <div className="bg-[#030213] text-white p-8 text-left space-y-6">
                    <div className="space-y-2.5">
                      <span className="text-[8px] font-[900] tracking-[0.25em] text-[#b2533e] uppercase block">
                        {config.ctaSection.tag || "Private Access / Drip Doggy Syndicate"}
                      </span>
                      <h2 className="text-xl font-extrabold tracking-wide uppercase leading-tight">
                        {(config.ctaSection.heading || "Join the Next Drop").split(/<br\s*\/?>|\n/).map((line, idx) => (
                          <span key={idx}>{line}<br /></span>
                        ))}
                      </h2>
                      <p className="text-[10px] text-white/50 leading-relaxed font-light">
                        {config.ctaSection.description || "Receive early access to limited capsules."}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          disabled
                          placeholder="Your email address"
                          value={subscribeEmail}
                          onChange={e => setSubscribeEmail(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-[10px] text-white placeholder-white/30 rounded-none focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            setSubscribed(true);
                            setTimeout(() => setSubscribed(false), 2000);
                          }}
                          className="bg-white hover:bg-white/90 text-[#030213] px-4 py-2 text-[9px] font-black uppercase tracking-wider border-none rounded-none cursor-pointer flex items-center gap-1.5"
                        >
                          {subscribed ? "Subscribed" : (config.ctaSection.buttonText || "SUBSCRIBE")}
                          <ArrowRightIcon className="w-3 h-3 text-[#030213]" />
                        </button>
                      </div>

                      {config.ctaSection.chips && config.ctaSection.chips.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {config.ctaSection.chips.map(chip => (
                            <span key={chip} className="text-[7px] font-bold tracking-widest text-white/40 border border-white/10 px-2 py-0.5 uppercase">{chip}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Main section */}
                <div className="bg-[#faf8f5] p-8 border-t border-neutral-200/60 relative overflow-hidden text-[#382d24]">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] uppercase">
                    <span className="text-[4rem] font-black tracking-widest">{config.brandName || "DRIP DOGGY"}</span>
                  </div>

                  {previewDevice === "desktop" ? (
                    /* Desktop Preview layout */
                    <div className="grid grid-cols-12 gap-6 relative z-10 text-left">
                      <div className="col-span-6 space-y-4">
                        <span className="text-[14px] font-[950] tracking-wider text-[#382d24] block uppercase">{config.brandName || "DRIP DOGGY"}</span>
                        <span className="block text-[8px] font-black tracking-[0.2em] text-[#b2533e] uppercase">
                          {config.tagline || "Luxury Streetwear / Est. 2026"}
                        </span>
                        <p className="text-[10px] text-neutral-500 leading-relaxed font-light">
                          {config.description || "Architectural silhouettes, premium fabrication, and uncompromised street luxury."}
                        </p>

                        <div className="flex gap-1.5 pt-1">
                          {config.socialLinks.filter(s => s.active).map(s => {
                            const Icon = PREVIEW_ICONS[s.platform.toLowerCase()] || Link2;
                            return (
                              <div key={s.label} className="w-7 h-7 border border-neutral-300 flex items-center justify-center text-neutral-500 bg-white">
                                <Icon className="w-3.5 h-3.5 stroke-[1.5]" />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="col-span-6 grid grid-cols-3 gap-4">
                        {config.linkGroups.map((g, gi) => (
                          <div key={gi} className="space-y-3">
                            <h4 className="text-[9px] font-black tracking-widest text-[#382d24] uppercase border-b border-neutral-200 pb-1">{g.title}</h4>
                            <ul className="space-y-1.5 p-0 m-0 list-none">
                              {g.links.map((l, li) => (
                                <li key={li}>
                                  <span className="text-[9px] text-neutral-400 hover:text-[#224870] cursor-pointer font-medium">{l.label}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Mobile Preview layout */
                    <div className="space-y-5 relative z-10 text-left">
                      <div className="space-y-3.5">
                        <span className="text-[13px] font-[950] tracking-wider text-[#382d24] block uppercase">{config.brandName || "DRIP DOGGY"}</span>
                        <span className="block text-[7.5px] font-black tracking-[0.18em] text-[#b2533e] uppercase">
                          {config.tagline || "Luxury Streetwear / Est. 2026"}
                        </span>
                        <p className="text-[9.5px] text-neutral-500 leading-relaxed font-light">
                          {config.description || "Architectural silhouettes, premium fabrication."}
                        </p>
                        <div className="flex gap-1.5">
                          {config.socialLinks.filter(s => s.active).map(s => {
                            const Icon = PREVIEW_ICONS[s.platform.toLowerCase()] || Link2;
                            return (
                              <div key={s.label} className="w-7 h-7 border border-neutral-300 flex items-center justify-center text-neutral-500 bg-white">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="border-t border-neutral-200 pt-2 space-y-1">
                        {config.linkGroups.map((g, gi) => (
                          <div key={gi} className="border-b border-neutral-200/60 py-2.5 flex items-center justify-between text-[9px] font-black uppercase text-[#382d24] tracking-widest">
                            <span>{g.title}</span>
                            <span className="text-neutral-400 text-xs">+</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom legal bar */}
                <div className="bg-[#030213] text-white/40 p-4.5 text-center text-[8px] font-black tracking-wider uppercase border-t border-white/5">
                  <div>
                    {config.copyrightText ? config.copyrightText.replace("{year}", new Date().getFullYear().toString()) : `© ${new Date().getFullYear()} Drip Doggy. All rights reserved.`}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest border border-dashed border-neutral-300">
                Footer widget disabled globally.
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#382d24] text-[#faf8f5] text-[9.5px] font-bold tracking-widest px-4.5 py-3.5 uppercase z-50 border border-neutral-700 shadow-2xl animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}

// Inline component replacement for ArrowRight in preview
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
