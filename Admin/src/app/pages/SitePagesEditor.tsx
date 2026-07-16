import { useState, useEffect } from "react";
import { Check, RotateCcw, Edit2, FileText, ExternalLink, Eye, EyeOff } from "lucide-react";
import { getSitePages, setSitePages, updateSitePage, SitePageData } from "../lib/admin-content-store";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
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

const DEFAULT_PAGES: SitePageData[] = [
  {
    slug: "about",
    title: "About",
    hero: {
      tag: "DRIPDOGGY APPAREL",
      heading: "The Story",
      description: "Founded in 2026, DripDoggy is a luxury streetwear label born at the intersection of architectural precision and functional urban utility.",
      active: true,
    },
    active: true,
  },
  {
    slug: "contact",
    title: "Contact",
    hero: {
      tag: "CLIENT SERVICES",
      heading: "Contact Us",
      description: "We're here to help. Whether you have a question about your order, need sizing advice, or want to discuss wholesale opportunities — reach out and our team will get back to you.",
      active: true,
    },
    active: true,
  },
  {
    slug: "faq",
    title: "FAQ & Shipping",
    hero: {
      tag: "CLIENT SERVICES",
      heading: "FAQ & Shipping",
      description: "Everything you need to know about ordering, shipping, delivery, and more.",
      active: true,
    },
    active: true,
  },
  {
    slug: "returns",
    title: "Returns & Size Guide",
    hero: {
      tag: "CLIENT SERVICES",
      heading: "Returns & Size Guide",
      description: "Hassle-free returns, complimentary exchanges, and detailed sizing guidance.",
      active: true,
    },
    active: true,
  },
  {
    slug: "terms",
    title: "Terms of Service",
    hero: {
      tag: "THE HOUSE",
      heading: "Terms of Service",
      description: "Last updated: June 2026. Please read these terms carefully before using our website or making a purchase.",
      active: true,
    },
    active: true,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    hero: {
      tag: "THE HOUSE",
      heading: "Privacy Policy",
      description: "Last updated: June 2026. This policy describes how DripDoggy Apparel collects, uses, and protects your personal information.",
      active: true,
    },
    active: true,
  },
  {
    slug: "help",
    title: "Help Center",
    hero: {
      tag: "SUPPORT HUB",
      heading: "Help & FAQs",
      description: "Shipping timelines, returns, size guides, and everything you need to know about your order.",
      active: true,
    },
    active: true,
  },
  {
    slug: "coming-soon",
    title: "Coming Soon",
    hero: {
      tag: "UPCOMING RELEASE",
      heading: "Men's Syndicate",
      description: "An exploration of structural tailoring, heavyweight fabrication, and utilitarian precision. The first menswear capsule from DripDoggy — engineered for the modern wardrobe.",
      active: true,
    },
    active: true,
  },
];

const PAGE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  about: { bg: "bg-[#224870]/8 border-[#224870]/20", text: "text-[#224870]", dot: "bg-[#224870]" },
  contact: { bg: "bg-amber-50/60 border-amber-200/50", text: "text-amber-700", dot: "bg-amber-500" },
  faq: { bg: "bg-emerald-50/60 border-emerald-200/50", text: "text-emerald-700", dot: "bg-emerald-500" },
  returns: { bg: "bg-violet-50/60 border-violet-200/50", text: "text-violet-700", dot: "bg-violet-500" },
  terms: { bg: "bg-neutral-50 border-neutral-200/80", text: "text-neutral-600", dot: "bg-neutral-400" },
  privacy: { bg: "bg-neutral-50 border-neutral-200/80", text: "text-neutral-600", dot: "bg-neutral-400" },
  help: { bg: "bg-rose-50/60 border-rose-200/50", text: "text-rose-700", dot: "bg-rose-500" },
  "coming-soon": { bg: "bg-blue-50/60 border-blue-200/50", text: "text-blue-700", dot: "bg-blue-500" },
};

export function SitePagesEditorPage() {
  const [pages, setPages] = useState<SitePageData[]>([]);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ tag: "", heading: "", description: "" });
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = getSitePages();
    if (stored.length === 0) {
      setSitePages(DEFAULT_PAGES);
      setPages(DEFAULT_PAGES);
    } else {
      setPages(stored);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const reset = () => {
    setSitePages(DEFAULT_PAGES);
    setPages(DEFAULT_PAGES);
    showToast("Reset to default pages");
  };

  const saveAll = () => {
    setSitePages(pages);
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_site_pages" } }));
    showToast("Site pages saved & synced");
  };

  const toggleActive = (slug: string) => {
    const updated = pages.map(p => p.slug === slug ? { ...p, active: !p.active } : p);
    setPages(updated);
    setSitePages(updated);
  };

  const toggleHeroActive = (slug: string) => {
    const updated = pages.map(p =>
      p.slug === slug ? { ...p, hero: { ...p.hero, active: !p.hero.active } } : p
    );
    setPages(updated);
    setSitePages(updated);
  };

  const openEdit = (p: SitePageData) => {
    setEditSlug(p.slug);
    setEditForm({ tag: p.hero.tag, heading: p.hero.heading, description: p.hero.description });
  };

  const saveEdit = () => {
    if (!editSlug) return;
    const updated = pages.map(p =>
      p.slug === editSlug ? { ...p, hero: { ...p.hero, ...editForm } } : p
    );
    setPages(updated);
    setSitePages(updated);
    updateSitePage(editSlug, { hero: { ...editForm, active: true } });
    setEditSlug(null);
    showToast("Page hero updated");
  };

  const editingPage = pages.find(p => p.slug === editSlug);

  return (
    <div className="space-y-8 font-sans text-[#382d24]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#224870]" /> Site Pages
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Edit hero sections for static pages — About, Contact, FAQ, Returns, Terms, Privacy
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={reset}
            className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-3 py-2 uppercase cursor-pointer bg-white rounded-none flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={saveAll}
            className="bg-[#224870] hover:bg-[#1a3a5c] text-white text-[9px] font-bold tracking-widest px-5 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Save All
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-[#224870]/8 border border-[#224870]/20 px-5 py-3 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#224870]" />
        <span className="text-[8px] font-bold text-[#224870] uppercase tracking-[0.2em]">
          {pages.filter(p => p.active).length} of {pages.length} pages active ·
          Click "Edit Hero" to update the banner content for any page
        </span>
      </div>

      {/* Page Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map(p => {
          const colors = PAGE_COLORS[p.slug] || PAGE_COLORS.terms;
          return (
            <div
              key={p.slug}
              className={`border overflow-hidden transition-all duration-200 ${
                p.active ? "opacity-100" : "opacity-60"
              } bg-white border-neutral-200/80`}
            >
              {/* Card header */}
              <div className={`border-b px-5 py-3 flex items-center justify-between ${colors.bg}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  <div>
                    <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${colors.text}`}>{p.title}</p>
                    <a
                      href={`/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[7px] font-bold tracking-wider flex items-center gap-1 mt-0.5 hover:opacity-70 transition-opacity ${colors.text}`}
                    >
                      /{p.slug} <ExternalLink className="w-2 h-2" />
                    </a>
                  </div>
                </div>
                <ToggleSwitch enabled={p.active} onClick={() => toggleActive(p.slug)} />
              </div>

              {/* Hero Preview */}
              <div className="px-5 py-4 space-y-3">
                <div className="bg-neutral-50 border border-neutral-100 p-4 space-y-1.5">
                  <span className={`text-[7px] font-black tracking-[0.3em] uppercase ${colors.text}`}>
                    {p.hero.tag}
                  </span>
                  <p className="text-[11px] font-extrabold text-[#030213] uppercase tracking-tight leading-tight">
                    {p.hero.heading}
                  </p>
                  <p className="text-[8px] text-neutral-500 leading-relaxed line-clamp-2 font-medium">
                    {p.hero.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => openEdit(p)}
                    className={`flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest cursor-pointer bg-transparent border-none transition-colors ${colors.text} hover:opacity-70`}
                  >
                    <Edit2 className="w-3 h-3" /> Edit Hero
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-wider">Hero Active</span>
                    <ToggleSwitch enabled={p.hero.active} onClick={() => toggleHeroActive(p.slug)} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editSlug && editingPage && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setEditSlug(null)}
        >
          <div
            className="bg-white border border-neutral-200 w-full max-w-xl mx-4 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#224870] px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-[7px] font-black tracking-[0.3em] text-white/50 uppercase mb-1">Editing Hero Section</p>
                <h2 className="text-sm font-black text-white uppercase tracking-[0.15em]">{editingPage.title}</h2>
              </div>
              <button
                onClick={() => setEditSlug(null)}
                className="text-white/60 hover:text-white cursor-pointer bg-transparent border-none transition-colors"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>

            {/* Live preview */}
            <div className="bg-[#FAF8F5] border-b border-neutral-200 px-6 py-5">
              <p className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Live Preview</p>
              <div className="text-center py-4 border border-neutral-200/60 bg-white px-6">
                <span className="text-[8px] font-black tracking-[0.3em] text-[#b2533e] uppercase block mb-2">
                  {editForm.tag || "TAG"}
                </span>
                <h3 className="text-lg font-extrabold tracking-tight uppercase mb-2">
                  {editForm.heading || "Heading"}
                </h3>
                <p className="text-[10px] text-neutral-500 font-medium max-w-sm mx-auto leading-relaxed">
                  {editForm.description || "Description will appear here…"}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">
                    Tag / Eyebrow
                  </label>
                  <input
                    value={editForm.tag}
                    onChange={e => setEditForm({ ...editForm, tag: e.target.value })}
                    placeholder="e.g. DRIPDOGGY APPAREL"
                    className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">
                    Heading
                  </label>
                  <input
                    value={editForm.heading}
                    onChange={e => setEditForm({ ...editForm, heading: e.target.value })}
                    placeholder="e.g. The Story"
                    className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  placeholder="Enter a short descriptive paragraph for this page's hero banner…"
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-medium leading-relaxed focus:outline-none focus:border-[#224870] rounded-none bg-white resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50">
              <button
                onClick={() => setEditSlug(null)}
                className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-[#224870] hover:bg-[#1a3a5c] text-white text-[9px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer rounded-none border-none transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Update Hero
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#224870] text-white text-[9px] font-bold tracking-widest px-5 py-3 uppercase z-50 flex items-center gap-2 shadow-xl">
          <Check className="w-3.5 h-3.5" />
          {toast}
        </div>
      )}
    </div>
  );
}
