import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, RotateCcw, Check, AlertTriangle, ArrowUp, ArrowDown, Sparkles, Upload } from "lucide-react";
import {
  getComingSoonTeasers,
  setComingSoonTeasers,
  ComingSoonTeaser,
  addComingSoonTeaser,
  updateComingSoonTeaser,
  deleteComingSoonTeaser,
} from "../lib/admin-content-store";

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

const DEFAULT_TEASERS: ComingSoonTeaser[] = [
  { id: "t-1", name: "Outerwear", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=400", coming: "SS26", order: 0, active: true },
  { id: "t-2", name: "Knitwear", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400", coming: "SS26", order: 1, active: true },
  { id: "t-3", name: "Tailoring", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400", coming: "FW26", order: 2, active: true },
  { id: "t-4", name: "Accessories", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400", coming: "FW26", order: 3, active: true },
];

let idCounter = Date.now();

export function ComingSoonEditorPage() {
  const [teasers, setTeasers] = useState<ComingSoonTeaser[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ComingSoonTeaser | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    name: "",
    image: "",
    coming: "",
    active: true,
  });

  useEffect(() => {
    const stored = getComingSoonTeasers();
    if (stored.length === 0) {
      setComingSoonTeasers(DEFAULT_TEASERS);
      setTeasers(DEFAULT_TEASERS);
    } else {
      setTeasers(stored);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const sorted = [...teasers].sort((a, b) => a.order - b.order);

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: "", image: "", coming: "SS26", active: true });
    setShowModal(true);
  };

  const openEdit = (t: ComingSoonTeaser) => {
    setEditItem(t);
    setForm({ name: t.name, image: t.image, coming: t.coming, active: t.active });
    setShowModal(true);
  };

  const saveModal = () => {
    if (editItem) {
      updateComingSoonTeaser(editItem.id, form);
    } else {
      addComingSoonTeaser({
        ...form,
        id: `t-${idCounter++}`,
        order: teasers.length,
      });
    }
    const updated = getComingSoonTeasers();
    setTeasers(updated);
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_coming_soon_teasers" } }));
    setShowModal(false);
    showToast(editItem ? "Teaser updated" : "Teaser added");
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteComingSoonTeaser(deleteId);
      setTeasers(getComingSoonTeasers());
      setDeleteId(null);
      window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_coming_soon_teasers" } }));
      showToast("Teaser deleted");
    }
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...sorted];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    const reordered = arr.map((t, i) => ({ ...t, order: i }));
    setComingSoonTeasers(reordered);
    setTeasers(getComingSoonTeasers());
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_coming_soon_teasers" } }));
  };

  const moveDown = (idx: number) => {
    if (idx >= sorted.length - 1) return;
    const arr = [...sorted];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    const reordered = arr.map((t, i) => ({ ...t, order: i }));
    setComingSoonTeasers(reordered);
    setTeasers(getComingSoonTeasers());
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_coming_soon_teasers" } }));
  };

  const toggleActive = (id: string) => {
    const target = teasers.find(t => t.id === id);
    if (target) {
      updateComingSoonTeaser(id, { active: !target.active });
      setTeasers(getComingSoonTeasers());
      window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_coming_soon_teasers" } }));
    }
  };

  const reset = () => {
    setComingSoonTeasers(DEFAULT_TEASERS);
    setTeasers(DEFAULT_TEASERS);
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_coming_soon_teasers" } }));
    showToast("Reset to brand defaults");
  };

  return (
    <div className="space-y-6 font-sans text-[#382d24]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#224870]" /> Coming Soon Teasers
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Manage category teasers on the Coming Soon storefront page
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={reset}
            className="border border-neutral-300 hover:border-[#224870] text-[#382d24] hover:text-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer bg-transparent rounded-none transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button
            onClick={openAdd}
            className="bg-[#224870] hover:bg-[#1a3a5c] text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Teaser Card
          </button>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {sorted.map((t, idx) => (
          <div
            key={t.id}
            className={`bg-white border border-neutral-200/80 overflow-hidden transition-all duration-200 group ${
              t.active ? "opacity-100" : "opacity-50"
            }`}
          >
            {/* Image container */}
            <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
              {t.image ? (
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-neutral-300" />
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Position badge */}
              <div className="absolute top-2.5 left-2.5 bg-[#224870] text-white text-[7px] font-black tracking-widest px-2 py-1 uppercase">
                #{idx + 1}
              </div>
              {/* Active toggle */}
              <div className="absolute top-2.5 right-2.5">
                <ToggleSwitch enabled={t.active} onClick={() => toggleActive(t.id)} />
              </div>
              {/* Bottom text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-[11px] font-black uppercase tracking-[0.15em] mb-0.5">{t.name}</h3>
                <p className="text-[8px] text-white/50 font-bold uppercase tracking-wider">{t.coming}</p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-neutral-100 bg-neutral-50/30">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="disabled:opacity-20 cursor-pointer bg-transparent border-none text-neutral-400 hover:text-[#224870] p-1 transition-colors"
                  title="Move left/up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx >= sorted.length - 1}
                  className="disabled:opacity-20 cursor-pointer bg-transparent border-none text-neutral-400 hover:text-[#224870] p-1 transition-colors"
                  title="Move right/down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(t)}
                  className="text-neutral-400 hover:text-[#224870] p-1 bg-transparent border-none cursor-pointer transition-colors"
                  title="Edit card"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(t.id)}
                  className="text-neutral-400 hover:text-[#b2533e] p-1 bg-transparent border-none cursor-pointer transition-colors"
                  title="Delete card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Teaser Placeholder */}
        <button
          onClick={openAdd}
          className="border-2 border-dashed border-neutral-200 hover:border-[#224870] bg-transparent cursor-pointer flex flex-col items-center justify-center gap-2 aspect-[3/4] text-neutral-350 hover:text-[#224870] transition-all duration-200 group"
        >
          <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] font-bold uppercase tracking-widest">Add Card</span>
        </button>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white border border-neutral-200 w-full max-w-md mx-4 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#224870] px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-[7px] font-black tracking-[0.3em] text-white/50 uppercase mb-1">
                  {editItem ? "Editing Card" : "New Card"}
                </p>
                <h2 className="text-sm font-black text-white uppercase tracking-[0.15em]">
                  {editItem ? editItem.name : "Add Teaser Card"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white cursor-pointer bg-transparent border-none transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="px-6 py-5 space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">
                    Card Title *
                  </label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Outerwear"
                    className="w-full border border-neutral-200 px-3 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none bg-white text-[#030213]"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">
                    Release Season *
                  </label>
                  <input
                    value={form.coming}
                    onChange={e => setForm({ ...form, coming: e.target.value })}
                    placeholder="e.g. SS26"
                    className="w-full border border-neutral-200 px-3 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none bg-white text-[#030213]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">
                  Image Upload * <span className="text-red-500 font-normal lowercase text-[7px]">(600x800 pixels)</span>
                </label>
                <div className="flex items-center gap-3">
                  {form.image ? (
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-[60px] h-[80px] border border-neutral-200 overflow-hidden bg-neutral-50 flex-shrink-0">
                        <img src={form.image} alt="Coming Soon asset" className="w-full h-full object-cover" />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  const base64Url = ev.target.result as string;
                                  const img = new Image();
                                  img.onload = () => {
                                    if (img.width !== 600 || img.height !== 800) {
                                      alert(`Error: Image dimensions are ${img.width}x${img.height}px. It must be exactly 600x800 pixels.`);
                                    } else {
                                      setForm(prev => ({ ...prev, image: base64Url }));
                                    }
                                  };
                                  img.src = base64Url;
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }} 
                        className="bg-white border border-neutral-250 hover:border-[#030213] text-[#030213] text-[8px] font-bold px-3 py-1.5 uppercase cursor-pointer transition-colors rounded-none"
                      >
                        Change Image
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setForm(prev => ({ ...prev, image: "" }))} 
                        className="bg-transparent border border-neutral-250 text-[#b2533e] text-[8px] font-bold px-3 py-1.5 uppercase cursor-pointer hover:border-[#b2533e] transition-colors rounded-none"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                const base64Url = ev.target.result as string;
                                const img = new Image();
                                img.onload = () => {
                                  if (img.width !== 600 || img.height !== 800) {
                                    alert(`Error: Image dimensions are ${img.width}x${img.height}px. It must be exactly 600x800 pixels.`);
                                  } else {
                                    setForm(prev => ({ ...prev, image: base64Url }));
                                  }
                                };
                                img.src = base64Url;
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }} 
                      className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-dashed border-neutral-250 hover:border-neutral-400 transition-colors rounded-none bg-white w-full justify-center"
                    >
                      <Upload className="w-4 h-4 text-neutral-300 stroke-[1.5]" />
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Upload 600x800px Image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase">Active</label>
                <ToggleSwitch enabled={form.active} onClick={() => setForm({ ...form, active: !form.active })} />
                <span className="text-[7px] text-neutral-400">
                  {form.active ? "Visible on Coming Soon grid" : "Hidden from Coming Soon grid"}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50/50">
              <button
                onClick={() => setShowModal(false)}
                className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveModal}
                disabled={!form.name || !form.image || !form.coming}
                className="bg-[#224870] hover:bg-[#1a3a5c] disabled:opacity-40 text-white text-[9px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer rounded-none border-none transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Save Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-white border border-neutral-200 p-6 max-w-sm mx-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#b2533e]" />
              </div>
              <div>
                <h3 className="text-[11px] font-black text-[#030213] uppercase tracking-widest mb-1">Delete Card?</h3>
                <p className="text-[8px] text-neutral-500 uppercase tracking-wider font-semibold">
                  This card teaser will be permanently removed from the storefront grid.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#224870] text-white text-[9px] font-bold tracking-widest px-5 py-3 uppercase z-50 flex items-center gap-2 shadow-xl">
          <Check className="w-3.5 h-3.5" />
          {toast}
        </div>
      )}
    </div>
  );
}
