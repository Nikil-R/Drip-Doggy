import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Eye, EyeOff, X, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { getHeroSlides, setHeroSlides, HeroSlide, addHeroSlide, updateHeroSlide, deleteHeroSlide } from "../lib/admin-content-store";

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

let idCounter = Date.now();

export function HeroSlidesEditorPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editSlide, setEditSlide] = useState<HeroSlide | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState<Omit<HeroSlide, "id" | "order">>({
    tagline: "", title: "", description: "", image: "", ctaText: "", ctaLink: "", active: true,
  });

  useEffect(() => { setSlides(getHeroSlides()); }, []);

  const saveAll = (newSlides: HeroSlide[]) => {
    setHeroSlides(newSlides);
    setSlides(newSlides);
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_hero_slides" } }));
    showToast("Hero slides saved");
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const sorted = useMemo(() => [...slides].sort((a, b) => a.order - b.order), [slides]);

  const openAdd = () => {
    setEditSlide(null);
    setForm({ tagline: "New Arrivals", title: "SS26 Capsule Is Here", description: "Architectural precision meets luxury streetwear. The new season explores structured silhouettes, differential textures, and reinforced seams.", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop", ctaText: "Shop Now", ctaLink: "/shop", active: true });
    setShowModal(true);
  };

  const openEdit = (s: HeroSlide) => {
    setEditSlide(s);
    setForm({ tagline: s.tagline, title: s.title, description: s.description, image: s.image, ctaText: s.ctaText || "", ctaLink: s.ctaLink || "", active: s.active });
    setShowModal(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setForm(prev => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (editSlide) {
      updateHeroSlide(editSlide.id, { ...form, order: editSlide.order });
      setSlides(getHeroSlides());
    } else {
      addHeroSlide({ ...form, id: `slide-${idCounter++}`, order: slides.length });
      setSlides(getHeroSlides());
    }
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_hero_slides" } }));
    setShowModal(false);
    showToast(editSlide ? "Slide updated" : "Slide added");
  };

  const remove = () => {
    if (deleteId) {
      deleteHeroSlide(deleteId);
      setSlides(getHeroSlides());
      setDeleteId(null);
      window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_hero_slides" } }));
      showToast("Slide deleted");
    }
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...sorted];
    [arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]];
    saveAll(arr.map((s, i) => ({ ...s, order: i })));
  };

  const moveDown = (idx: number) => {
    if (idx >= sorted.length - 1) return;
    const arr = [...sorted];
    [arr[idx], arr[idx+1]] = [arr[idx+1], arr[idx]];
    saveAll(arr.map((s, i) => ({ ...s, order: i })));
  };

  const toggleActive = (id: string) => {
    const s = slides.find(x => x.id === id);
    if (s) {
      updateHeroSlide(id, { active: !s.active });
      setSlides(getHeroSlides());
      window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_hero_slides" } }));
      showToast("Toggled visibility");
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#382d24]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-[#224870]" /> Hero Slides
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">Manage Drip Doggy homepage hero banner slides</p>
        </div>
        <button onClick={openAdd} className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Slide
        </button>
      </div>

      {/* Slide Listing */}
      <div className="space-y-4">
        {sorted.map((s, idx) => (
          <div key={s.id} className="bg-card border border-neutral-200/80 p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1 text-neutral-300 shrink-0">
              <button onClick={() => moveUp(idx)} disabled={idx === 0} className="disabled:opacity-30 cursor-pointer bg-transparent border-none p-1 text-neutral-400 hover:text-[#224870] transition-colors"><ArrowUp className="w-3.5 h-3.5" /></button>
              <button onClick={() => moveDown(idx)} disabled={idx >= sorted.length - 1} className="disabled:opacity-30 cursor-pointer bg-transparent border-none p-1 text-neutral-400 hover:text-[#224870] transition-colors"><ArrowDown className="w-3.5 h-3.5" /></button>
            </div>
            
            <div className="w-28 h-18 bg-neutral-100 border border-neutral-250/50 overflow-hidden shrink-0">
              <img src={s.image} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="text-[9.5px] font-black text-neutral-400">#{s.order + 1}</span>
                <span className="text-[8px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 uppercase tracking-wider">{s.tagline}</span>
              </div>
              <h3 className="text-[10.5px] font-black text-[#382d24] uppercase tracking-wide truncate mt-1.5">{s.title}</h3>
              <p className="text-[9px] text-[#615e56] truncate mt-0.5">{s.description}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 mr-1">
                {s.active ? <Eye className="w-3.5 h-3.5 text-[#224870]" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
                <ToggleSwitch enabled={s.active} onClick={() => toggleActive(s.id)} />
              </div>
              <button 
                onClick={() => openEdit(s)} 
                className="text-white bg-[#224870] hover:bg-[#224870]/85 p-2 cursor-pointer transition-colors rounded-none flex items-center justify-center border-none shadow-sm"
                title="Edit Slide"
              >
                <Edit2 className="w-3.5 h-3.5 text-white" />
              </button>
              <button 
                onClick={() => setDeleteId(s.id)} 
                className="text-white bg-[#b2533e] hover:bg-[#b2533e]/85 p-2 cursor-pointer transition-colors rounded-none flex items-center justify-center border-none shadow-sm"
                title="Delete Slide"
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Modal Editor */}
      {showModal && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-neutral-300 w-full max-w-xl mx-4 p-6 my-8 rounded-none shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3.5 mb-5">
              <h2 className="text-xs font-bold text-[#382d24] uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#224870]" />
                {editSlide ? "Edit Banner Slide" : "Create Banner Slide"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-450 hover:text-black cursor-pointer bg-transparent border-none p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4.5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Tagline</label>
                  <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })}
                    className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Title</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none h-20 text-[#382d24]" />
              </div>

              {/* Background Image Inputs */}
              <div className="space-y-2">
                <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Background Image</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#faf8f5] p-3.5 border border-neutral-300">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-neutral-400 block mb-1">Option A: Image URL</span>
                    <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                      className="w-full border border-neutral-300 bg-white px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" placeholder="https://..." />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-neutral-400 block mb-1">Option B: Upload File</span>
                    <label className="w-full border border-neutral-300 hover:border-[#224870] bg-white px-3.5 py-2 text-xs font-bold text-[#382d24] flex items-center justify-center cursor-pointer transition-colors relative h-[38px]">
                      <span className="truncate">{form.image.startsWith("data:") ? "Image Loaded" : "Choose File..."}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </label>
                  </div>
                </div>
                {form.image && (
                  <div className="mt-2 w-full h-24 bg-neutral-100 border border-neutral-250 overflow-hidden relative group">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#382d24]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[9px] font-bold uppercase tracking-wider">Image Preview</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">CTA Text</label>
                  <input value={form.ctaText || ""} onChange={e => setForm({ ...form, ctaText: e.target.value })}
                    className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">CTA Link</label>
                  <input value={form.ctaLink || ""} onChange={e => setForm({ ...form, ctaLink: e.target.value })}
                    className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200/60">
              <button onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-[#382d24] text-neutral-500 text-[9px] font-semibold tracking-widest px-4.5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={save} className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9px] font-semibold tracking-widest px-4.5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-colors">{editSlide ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-card border border-neutral-300 p-6 max-w-sm mx-4 shadow-2xl rounded-none animate-scale-in" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-xs font-bold text-[#382d24] uppercase tracking-widest mb-2">Delete Slide?</h3>
            <p className="text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider mb-4 leading-relaxed">This will remove this hero slide permanently. This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-300 hover:border-[#382d24] text-neutral-500 text-[9px] font-semibold tracking-widest px-4.5 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={remove} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-semibold tracking-widest px-4.5 py-2 uppercase cursor-pointer rounded-none border-none transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notice */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#382d24] text-[#faf8f5] text-[9px] font-bold tracking-widest px-4.5 py-3.5 uppercase z-50 border border-neutral-700 shadow-2xl animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
