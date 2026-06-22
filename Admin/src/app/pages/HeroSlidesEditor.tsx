import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Edit2, GripVertical, Eye, EyeOff, X, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
import { getHeroSlides, setHeroSlides, HeroSlide, addHeroSlide, updateHeroSlide, deleteHeroSlide } from "../lib/admin-content-store";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-9 h-[18px] rounded-full transition-colors duration-200 border-none cursor-pointer ${
        enabled ? "bg-green-500" : "bg-neutral-300"
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
        enabled ? "translate-x-[18px]" : "translate-x-0"
      }`} />
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

  const save = () => {
    if (editSlide) {
      updateHeroSlide(editSlide.id, { ...form, order: editSlide.order });
      setSlides(getHeroSlides());
    } else {
      addHeroSlide({ ...form, id: `slide-${idCounter++}`, order: slides.length });
      setSlides(getHeroSlides());
    }
    setShowModal(false);
    showToast(editSlide ? "Slide updated" : "Slide added");
  };

  const remove = () => {
    if (deleteId) { deleteHeroSlide(deleteId); setSlides(getHeroSlides()); setDeleteId(null); showToast("Slide deleted"); }
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
    if (s) { updateHeroSlide(id, { active: !s.active }); setSlides(getHeroSlides()); showToast("Toggled visibility"); }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Hero Slides</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Manage Drip Doggy homepage hero banner slides</p>
        </div>
        <button onClick={openAdd} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none">
          <Plus className="w-3.5 h-3.5" /> Add Slide
        </button>
      </div>

      <div className="space-y-3">
        {sorted.map((s, idx) => (
          <div key={s.id} className="bg-white border border-neutral-200/80 p-4 flex items-center gap-4">
            <div className="flex flex-col gap-1 text-neutral-300">
              <button onClick={() => moveUp(idx)} disabled={idx === 0} className="disabled:opacity-30 cursor-pointer bg-transparent border-none p-0.5"><ArrowUp className="w-3 h-3" /></button>
              <button onClick={() => moveDown(idx)} disabled={idx >= sorted.length - 1} className="disabled:opacity-30 cursor-pointer bg-transparent border-none p-0.5"><ArrowDown className="w-3 h-3" /></button>
            </div>
            <div className="w-24 h-16 bg-neutral-100 border border-neutral-200/50 overflow-hidden shrink-0">
              <img src={s.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-neutral-400">#{s.order + 1}</span>
                <span className="text-[8px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5">{s.tagline}</span>
              </div>
              <h3 className="text-[10px] font-black text-[#030213] uppercase tracking-wide truncate mt-1">{s.title}</h3>
              <p className="text-[8px] text-neutral-400 truncate">{s.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ToggleSwitch enabled={s.active} onClick={() => toggleActive(s.id)} />
              <button onClick={() => openEdit(s)} className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => setDeleteId(s.id)} className="text-neutral-400 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white border border-neutral-200 w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-[#030213] uppercase tracking-widest">{editSlide ? "Edit Slide" : "Add Slide"}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Tagline</label>
                  <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
                <div>
                  <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Title</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none h-16" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Background Image URL</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">CTA Text</label>
                  <input value={form.ctaText || ""} onChange={e => setForm({ ...form, ctaText: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
                <div>
                  <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">CTA Link</label>
                  <input value={form.ctaLink || ""} onChange={e => setForm({ ...form, ctaLink: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
              <button onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none">Cancel</button>
              <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">{editSlide ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-white border border-neutral-200 p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-sm font-black text-[#030213] uppercase tracking-widest mb-2">Delete Slide?</h3>
            <p className="text-[9px] text-neutral-500 mb-4">This will remove this hero slide permanently.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none">Cancel</button>
              <button onClick={remove} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#030213] text-white text-[9px] font-extrabold tracking-widest px-4 py-3 uppercase z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
