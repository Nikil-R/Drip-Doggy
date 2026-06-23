import { useState, useEffect } from "react";
import { RotateCcw, Check, Edit2, Eye, EyeOff, FileText } from "lucide-react";
import { getSitePages, setSitePages, updateSitePage, SitePageData } from "../lib/admin-content-store";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer p-0 shrink-0 border-none outline-none ${
        enabled ? "bg-[#030213]" : "bg-neutral-300"
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


export function SitePagesEditorPage() {
  const [pages, setPages] = useState<SitePageData[]>([]);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ tag: "", heading: "", description: "" });
  const [toast, setToast] = useState("");

  useEffect(() => { setPages(getSitePages()); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const reset = () => {
    const defaults: SitePageData[] = [
      { slug: "about", title: "About", hero: { tag: "DRIP DOGGY APPAREL", heading: "The Story", description: "Founded in 2026, Drip Doggy is a luxury streetwear label born at the intersection of architectural precision and functional urban utility.", active: true }, active: true },
      { slug: "contact", title: "Contact", hero: { tag: "CLIENT SERVICES", heading: "Contact Us", description: "We're here to help. Whether you have a question about your order, need sizing advice, or want to discuss wholesale opportunities.", active: true }, active: true },
      { slug: "faq", title: "FAQ & Shipping", hero: { tag: "CLIENT SERVICES", heading: "FAQ & Shipping", description: "Everything you need to know about ordering, shipping, delivery, and more.", active: true }, active: true },
      { slug: "returns", title: "Returns & Size Guide", hero: { tag: "CLIENT SERVICES", heading: "Returns & Size Guide", description: "Hassle-free returns, complimentary exchanges, and detailed sizing guidance.", active: true }, active: true },
      { slug: "terms", title: "Terms of Service", hero: { tag: "THE HOUSE", heading: "Terms of Service", description: "Please read these terms carefully before using our website.", active: true }, active: true },
      { slug: "privacy", title: "Privacy Policy", hero: { tag: "THE HOUSE", heading: "Privacy Policy", description: "This policy describes how we collect, use, and protect your personal information.", active: true }, active: true },
    ];
    setSitePages(defaults);
    setPages(defaults);
    showToast("Reset to defaults");
  };

  const save = () => { showToast("Site pages saved"); };

  const toggleActive = (slug: string) => {
    const p = pages.find(x => x.slug === slug);
    if (p) { updateSitePage(slug, { active: !p.active }); setPages(getSitePages()); }
  };

  const openEdit = (p: SitePageData) => {
    setEditSlug(p.slug);
    setEditForm({ tag: p.hero.tag, heading: p.hero.heading, description: p.hero.description });
  };

  const saveEdit = () => {
    if (editSlug) { updateSitePage(editSlug, { hero: { ...editForm, active: true } }); setPages(getSitePages()); setEditSlug(null); showToast("Page hero updated"); }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">Site Pages</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Manage hero sections for static pages</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer bg-card rounded-none"><RotateCcw className="w-3 h-3" /> Reset</button>
          <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none"><Check className="w-3.5 h-3.5" /> Save</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map(p => (
          <div key={p.slug} className="bg-card border border-neutral-200/80 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-neutral-100 border border-neutral-200/50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-wide">{p.title}</h3>
                <span className="text-[7px] text-neutral-400 font-bold">/{p.slug}</span>
              </div>
              <ToggleSwitch enabled={p.active} onClick={() => toggleActive(p.slug)} />
            </div>
            <div className="bg-card p-3 text-[8px]">
              <span className="font-semibold text-neutral-400 uppercase tracking-wider">{p.hero.tag}</span>
              <p className="font-bold text-[#030213] mt-1">{p.hero.heading}</p>
              <p className="text-neutral-500 mt-1 line-clamp-2">{p.hero.description}</p>
            </div>
            <button onClick={() => openEdit(p)} className="mt-3 text-[8px] font-semibold text-[#030213] hover:text-neutral-600 uppercase tracking-widest cursor-pointer bg-transparent border-none">
              <Edit2 className="w-3 h-3 inline mr-1" /> Edit Hero
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editSlug && (() => {
        const page = pages.find(p => p.slug === editSlug);
        if (!page) return null;
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditSlug(null)}>
            <div className="bg-card border border-neutral-200 w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-[#030213] uppercase tracking-widest">Edit: {page.title}</h2>
                <button onClick={() => setEditSlug(null)} className="text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none"><EyeOff className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Tag</label>
                  <input value={editForm.tag} onChange={e => setEditForm({ ...editForm, tag: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Heading</label>
                  <input value={editForm.heading} onChange={e => setEditForm({ ...editForm, heading: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Description</label>
                  <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none h-24" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
                <button onClick={() => setEditSlug(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-card cursor-pointer rounded-none">Cancel</button>
                <button onClick={saveEdit} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Update</button>
              </div>
            </div>
          </div>
        );
      })()}

      {toast && <div className="fixed bottom-6 right-6 bg-[#030213] text-white text-[9px] font-semibold tracking-widest px-4 py-3 uppercase z-50">{toast}</div>}
    </div>
  );
}
