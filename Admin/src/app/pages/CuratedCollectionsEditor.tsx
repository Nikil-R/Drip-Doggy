import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, RotateCcw, Check, AlertTriangle, ArrowUp, ArrowDown, Image as ImageIcon } from "lucide-react";
import { getCuratedCollections, setCuratedCollections, CuratedCollection, addCuratedCollection, updateCuratedCollection, deleteCuratedCollection } from "../lib/admin-content-store";

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


let idCounter = 100;

export function CuratedCollectionsEditorPage() {
  const [collections, setCollections] = useState<CuratedCollection[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<CuratedCollection | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ title: "", description: "", image: "", link: "", active: true });

  useEffect(() => { setCollections(getCuratedCollections()); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const sorted = [...collections].sort((a, b) => a.order - b.order);

  const openAdd = () => { setEditItem(null); setForm({ title: "", description: "", image: "", link: "", active: true }); setShowModal(true); };
  const openEdit = (c: CuratedCollection) => { setEditItem(c); setForm({ title: c.title, description: c.description, image: c.image, link: c.link || "", active: c.active }); setShowModal(true); };

  const save = () => {
    if (editItem) { updateCuratedCollection(editItem.id, form); setCollections(getCuratedCollections()); }
    else { addCuratedCollection({ ...form, id: "col-" + idCounter++, order: collections.length }); setCollections(getCuratedCollections()); }
    setShowModal(false); showToast(editItem ? "Collection updated" : "Collection added");
  };

  const remove = () => { if (deleteId) { deleteCuratedCollection(deleteId); setCollections(getCuratedCollections()); setDeleteId(null); showToast("Collection deleted"); } };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...sorted];
    [arr[idx-1], arr[idx]] = [arr[idx], arr[idx-1]];
    setCuratedCollections(arr.map((c, i) => ({ ...c, order: i })));
    setCollections(getCuratedCollections());
  };

  const moveDown = (idx: number) => {
    if (idx >= sorted.length - 1) return;
    const arr = [...sorted];
    [arr[idx], arr[idx+1]] = [arr[idx+1], arr[idx]];
    setCuratedCollections(arr.map((c, i) => ({ ...c, order: i })));
    setCollections(getCuratedCollections());
  };

  const reset = () => {
    const defaults: CuratedCollection[] = [
      { id: "col-1", title: "SS26 New Arrivals", description: "Fresh drops from the latest capsule", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop", order: 0, active: true },
      { id: "col-2", title: "Drip Doggy Best Sellers", description: "Most-loved pieces by our community", image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&h=400&fit=crop", order: 1, active: true },
      { id: "col-3", title: "Signature Outerwear", description: "Canvas jackets & moto coats", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=400&fit=crop", order: 2, active: true },
      { id: "col-4", title: "Knitwear Capsule", description: "Cashmere blends & fine merino", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=400&fit=crop", order: 3, active: true },
    ];
    setCuratedCollections(defaults);
    setCollections(defaults);
    showToast("Reset to defaults");
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Curated Collections</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Manage Drip Doggy shop page curated collections</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer bg-white rounded-none"><RotateCcw className="w-3 h-3" /> Reset</button>
          <button onClick={openAdd} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none"><Plus className="w-3.5 h-3.5" /> Add Collection</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((c, idx) => (
          <div key={c.id} className="bg-white border border-neutral-200/80 overflow-hidden">
            <div className="aspect-[3/2] bg-neutral-100 overflow-hidden relative group">
              <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2">
                <ToggleSwitch enabled={c.active} onClick={() => {
                  const updated = { ...c, active: !c.active };
                  updateCuratedCollection(c.id, { active: !c.active });
                  setCollections(getCuratedCollections());
                }} />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-[#030213] uppercase tracking-wide">{c.title}</h3>
                <div className="flex gap-0.5">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="disabled:opacity-30 cursor-pointer bg-transparent border-none text-neutral-300 hover:text-[#030213] p-0.5"><ArrowUp className="w-3 h-3" /></button>
                  <button onClick={() => moveDown(idx)} disabled={idx >= sorted.length - 1} className="disabled:opacity-30 cursor-pointer bg-transparent border-none text-neutral-300 hover:text-[#030213] p-0.5"><ArrowDown className="w-3 h-3" /></button>
                </div>
              </div>
              <p className="text-[8px] text-neutral-400 font-bold mt-1">{c.description}</p>
              {c.link && <span className="text-[7px] text-neutral-400 mt-1 block">{c.link}</span>}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                <span className="text-[7px] font-bold text-neutral-400">#{c.order + 1}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(c)} className="text-neutral-400 hover:text-[#030213] p-1 bg-transparent border-none cursor-pointer"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => setDeleteId(c.id)} className="text-neutral-400 hover:text-[#b2533e] p-1 bg-transparent border-none cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white border border-neutral-200 w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-[#030213] uppercase tracking-widest">{editItem ? "Edit Collection" : "Add Collection"}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Title</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
                <div>
                  <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Link (optional)</label>
                  <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Image URL</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" placeholder="https://..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
              <button onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none">Cancel</button>
              <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">{editItem ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-white border border-neutral-200 p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-sm font-black text-[#030213] uppercase tracking-widest mb-2">Delete Collection?</h3>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none">Cancel</button>
              <button onClick={remove} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 bg-[#030213] text-white text-[9px] font-extrabold tracking-widest px-4 py-3 uppercase z-50">{toast}</div>}
    </div>
  );
}
