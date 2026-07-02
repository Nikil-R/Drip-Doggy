import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, RotateCcw, Check, AlertTriangle, ArrowUp, ArrowDown, Layers, Upload } from "lucide-react";
import {
  getCuratedCollections,
  setCuratedCollections,
  CuratedCollection,
  addCuratedCollection,
  updateCuratedCollection,
  deleteCuratedCollection,
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

const DEFAULT_COLLECTIONS: CuratedCollection[] = [
  {
    id: "col-1",
    title: "SS26 New Arrivals",
    description: "Fresh drops from the latest capsule — precision cuts and architectural silhouettes.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop",
    link: "/shop?collection=ss26",
    order: 0,
    active: true,
  },
  {
    id: "col-2",
    title: "Drip Doggy Best Sellers",
    description: "Most-loved pieces by our community — season after season.",
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&h=400&fit=crop",
    link: "/shop?collection=bestsellers",
    order: 1,
    active: true,
  },
  {
    id: "col-3",
    title: "Signature Outerwear",
    description: "Canvas jackets & moto coats — the cornerstone of the Drip Doggy archive.",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=400&fit=crop",
    link: "/shop?category=outerwear",
    order: 2,
    active: true,
  },
  {
    id: "col-4",
    title: "Knitwear Capsule",
    description: "Cashmere blends & fine merino — understated luxury for the colder months.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=400&fit=crop",
    link: "/shop?category=knitwear",
    order: 3,
    active: true,
  },
];

let idCounter = 200;

export function CuratedCollectionsEditorPage() {
  const [collections, setCollections] = useState<CuratedCollection[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<CuratedCollection | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    active: true,
  });

  useEffect(() => {
    const stored = getCuratedCollections();
    if (stored.length === 0) {
      setCuratedCollections(DEFAULT_COLLECTIONS);
      setCollections(DEFAULT_COLLECTIONS);
    } else {
      setCollections(stored);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const sorted = [...collections].sort((a, b) => a.order - b.order);

  const openAdd = () => {
    setEditItem(null);
    setForm({ title: "", description: "", image: "", link: "", active: true });
    setShowModal(true);
  };

  const openEdit = (c: CuratedCollection) => {
    setEditItem(c);
    setForm({ title: c.title, description: c.description, image: c.image, link: c.link || "", active: c.active });
    setShowModal(true);
  };

  const saveModal = () => {
    if (editItem) {
      updateCuratedCollection(editItem.id, form);
    } else {
      addCuratedCollection({
        ...form,
        id: `col-${idCounter++}`,
        order: collections.length,
      });
    }
    const updated = getCuratedCollections();
    setCollections(updated);
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_collections" } }));
    setShowModal(false);
    showToast(editItem ? "Collection updated" : "Collection added");
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteCuratedCollection(deleteId);
      setCollections(getCuratedCollections());
      setDeleteId(null);
      showToast("Collection deleted");
    }
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...sorted];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    const reordered = arr.map((c, i) => ({ ...c, order: i }));
    setCuratedCollections(reordered);
    setCollections(getCuratedCollections());
  };

  const moveDown = (idx: number) => {
    if (idx >= sorted.length - 1) return;
    const arr = [...sorted];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    const reordered = arr.map((c, i) => ({ ...c, order: i }));
    setCuratedCollections(reordered);
    setCollections(getCuratedCollections());
  };

  const toggleActive = (id: string) => {
    updateCuratedCollection(id, { active: !collections.find(c => c.id === id)?.active });
    setCollections(getCuratedCollections());
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_collections" } }));
  };

  const saveAll = () => {
    setCuratedCollections(sorted);
    window.dispatchEvent(new CustomEvent("dd-content-changed", { detail: { key: "dd_content_collections" } }));
    showToast("Collections saved & synced");
  };

  const reset = () => {
    setCuratedCollections(DEFAULT_COLLECTIONS);
    setCollections(DEFAULT_COLLECTIONS);
    showToast("Reset to defaults");
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-[#224870]" />
            <h1 className="text-[11px] font-black text-[#030213] uppercase tracking-[0.25em]">Curated Collections</h1>
          </div>
          <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">
            Manage the "Curated For You" grid on the Shop page — drag to reorder, toggle to show/hide
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={reset}
            className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-3 py-2 uppercase cursor-pointer bg-white rounded-none flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={openAdd}
            className="border border-[#224870] text-[#224870] hover:bg-[#224870] hover:text-white text-[9px] font-bold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Collection
          </button>
          <button
            onClick={saveAll}
            className="bg-[#224870] hover:bg-[#1a3a5c] text-white text-[9px] font-bold tracking-widest px-5 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Save & Sync
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="bg-[#224870]/8 border border-[#224870]/20 px-5 py-3 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#224870]" />
        <span className="text-[8px] font-bold text-[#224870] uppercase tracking-[0.2em]">
          {sorted.filter(c => c.active).length} of {sorted.length} collections active ·
          Displayed as a 3-column grid on the Shop page under "Curated For You"
        </span>
      </div>

      {/* Collection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {sorted.map((c, idx) => (
          <div
            key={c.id}
            className={`bg-white border border-neutral-200/80 overflow-hidden transition-all duration-200 group ${
              c.active ? "opacity-100" : "opacity-50"
            }`}
          >
            {/* Image */}
            <div className="relative aspect-[3/2] bg-neutral-100 overflow-hidden">
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Layers className="w-8 h-8 text-neutral-300" />
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Position badge */}
              <div className="absolute top-2.5 left-2.5 bg-[#224870] text-white text-[7px] font-black tracking-widest px-2 py-1 uppercase">
                #{idx + 1}
              </div>
              {/* Active toggle */}
              <div className="absolute top-2.5 right-2.5">
                <ToggleSwitch enabled={c.active} onClick={() => toggleActive(c.id)} />
              </div>
              {/* Bottom text overlay (like frontend) */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-[11px] font-black uppercase tracking-[0.15em] mb-0.5">{c.title}</h3>
                <p className="text-[8px] text-white/80 line-clamp-1">{c.description}</p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="disabled:opacity-20 cursor-pointer bg-transparent border-none text-neutral-400 hover:text-[#224870] p-1 transition-colors"
                  title="Move up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx >= sorted.length - 1}
                  className="disabled:opacity-20 cursor-pointer bg-transparent border-none text-neutral-400 hover:text-[#224870] p-1 transition-colors"
                  title="Move down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                {c.link && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[7px] font-mono text-neutral-400 hover:text-[#224870] ml-1 transition-colors truncate max-w-[100px]"
                    title={c.link}
                  >
                    {c.link}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(c)}
                  className="text-neutral-400 hover:text-[#224870] p-1.5 bg-transparent border-none cursor-pointer transition-colors"
                  title="Edit collection"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(c.id)}
                  className="text-neutral-400 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer transition-colors"
                  title="Delete collection"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Placeholder */}
        <button
          onClick={openAdd}
          className="border-2 border-dashed border-neutral-200 hover:border-[#224870] bg-transparent cursor-pointer flex flex-col items-center justify-center gap-2 aspect-[3/2] text-neutral-300 hover:text-[#224870] transition-all duration-200 group"
        >
          <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] font-bold uppercase tracking-widest">Add Collection</span>
        </button>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white border border-neutral-200 w-full max-w-xl mx-4 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-[#224870] px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-[7px] font-black tracking-[0.3em] text-white/50 uppercase mb-1">
                  {editItem ? "Editing Collection" : "New Collection"}
                </p>
                <h2 className="text-sm font-black text-white uppercase tracking-[0.15em]">
                  {editItem ? editItem.title : "Add a Curated Collection"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white cursor-pointer bg-transparent border-none transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image preview */}
            {form.image && (
              <div className="h-32 overflow-hidden bg-neutral-100">
                <img src={form.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">
                    Title *
                  </label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. SS26 New Arrivals"
                    className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">
                    Link (optional)
                  </label>
                  <input
                    value={form.link}
                    onChange={e => setForm({ ...form, link: e.target.value })}
                    placeholder="/shop?collection=…"
                    className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-mono focus:outline-none focus:border-[#224870] rounded-none bg-white text-neutral-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">
                  Short Description
                </label>
                <input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Fresh drops from the latest capsule"
                  className="w-full border border-neutral-200 px-3 py-2 text-[9px] font-medium focus:outline-none focus:border-[#224870] rounded-none bg-white"
                />
              </div>

              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">
                  Image Upload * <span className="text-red-500 font-normal lowercase text-[7px]">(600x400 pixels)</span>
                </label>
                <div className="flex items-center gap-3">
                  {form.image ? (
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-[75px] h-[50px] border border-neutral-200 overflow-hidden bg-neutral-50 flex-shrink-0">
                        <img src={form.image} alt="Collection asset" className="w-full h-full object-cover" />
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
                                    if (img.width !== 600 || img.height !== 400) {
                                      alert(`Error: Image dimensions are ${img.width}x${img.height}px. It must be exactly 600x400 pixels.`);
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
                                  if (img.width !== 600 || img.height !== 400) {
                                    alert(`Error: Image dimensions are ${img.width}x${img.height}px. It must be exactly 600x400 pixels.`);
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
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Upload 600x400px Image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase">Active</label>
                <ToggleSwitch enabled={form.active} onClick={() => setForm({ ...form, active: !form.active })} />
                <span className="text-[7px] text-neutral-400">
                  {form.active ? "This collection will appear in the shop grid" : "Hidden from frontend"}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50">
              <button
                onClick={() => setShowModal(false)}
                className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveModal}
                disabled={!form.title}
                className="bg-[#224870] hover:bg-[#1a3a5c] disabled:opacity-40 text-white text-[9px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer rounded-none border-none transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> {editItem ? "Update" : "Create Collection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (() => {
        const target = collections.find(c => c.id === deleteId);
        return (
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
                  <h3 className="text-[11px] font-black text-[#030213] uppercase tracking-widest mb-1">Delete Collection?</h3>
                  {target && (
                    <p className="text-[8px] text-neutral-500">
                      "<span className="font-bold text-[#030213]">{target.title}</span>" will be permanently removed from the shop page.
                    </p>
                  )}
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
        );
      })()}

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
