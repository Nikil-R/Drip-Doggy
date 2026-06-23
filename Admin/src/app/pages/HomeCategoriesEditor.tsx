import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Check, RotateCcw, AlertTriangle } from "lucide-react";
import { getHomeCategories, setHomeCategories, HomeCategory, addHomeCategory, updateHomeCategory, deleteHomeCategory } from "../lib/admin-content-store";

let idCounter = 100;

export function HomeCategoriesEditorPage() {
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<HomeCategory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ title: "", image: "", description: "", route: "", comingSoon: false, comingSeason: "", active: true });

  useEffect(() => { setCategories(getHomeCategories()); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const openAdd = () => { setEditCat(null); setForm({ title: "", image: "", description: "", route: "/shop", comingSoon: false, comingSeason: "", active: true }); setShowModal(true); };
  const openEdit = (c: HomeCategory) => { setEditCat(c); setForm({ title: c.title, image: c.image, description: c.description, route: c.route, comingSoon: c.comingSoon, comingSeason: c.comingSeason || "", active: c.active }); setShowModal(true); };

  const save = () => {
    if (editCat) { updateHomeCategory(editCat.id, form); setCategories(getHomeCategories()); }
    else { addHomeCategory({ ...form, id: "cat-" + idCounter++, order: categories.length }); setCategories(getHomeCategories()); }
    setShowModal(false); showToast(editCat ? "Category updated" : "Category added");
  };

  const remove = () => { if (deleteId) { deleteHomeCategory(deleteId); setCategories(getHomeCategories()); setDeleteId(null); showToast("Category deleted"); } };

  const reset = () => {
    const defaults: HomeCategory[] = [
      { id: "cat-1", title: "Outerwear Edit", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800", description: "Structured jackets & moto coats", route: "/shop?category=outerwear", comingSoon: false, order: 0, active: true },
      { id: "cat-2", title: "Knitwear Collection", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800", description: "Cashmere blends & fine knits", route: "/shop?category=knitwear", comingSoon: false, order: 1, active: true },
      { id: "cat-3", title: "Signature Archive", image: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&q=80&w=800", description: "Limited edition past drops", route: "/shop?category=archive", comingSoon: false, order: 2, active: true },
      { id: "cat-4", title: "FW25 Heritage", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800", description: "Heritage-inspired capsule", route: "/coming-soon", comingSoon: true, comingSeason: "FW25", order: 3, active: true },
    ];
    setHomeCategories(defaults);
    setCategories(defaults);
    showToast("Reset to defaults");
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">Home Categories</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Manage Drip Doggy homepage category cards</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer bg-card rounded-none"><RotateCcw className="w-3 h-3" /> Reset</button>
          <button onClick={openAdd} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none"><Plus className="w-3.5 h-3.5" /> Add Category</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((c, idx) => (
          <div key={c.id} className="bg-card border border-neutral-200/80 p-4 flex gap-4">
            <div className="w-20 h-20 bg-neutral-100 border border-neutral-200/50 overflow-hidden shrink-0">
              <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-wide">{c.title}</h3>
                {c.comingSoon && <span className="text-[7px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5">SOON</span>}
              </div>
              <p className="text-[8px] text-neutral-400 font-bold mt-0.5">{c.description}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[7px] text-neutral-400">#{idx + 1}</span>
                <span className="text-[7px] text-neutral-400">{c.route}</span>
                {c.comingSeason && <span className="text-[7px] text-neutral-400">{c.comingSeason}</span>}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(c)} className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => setDeleteId(c.id)} className="text-neutral-400 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-neutral-200 w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-[#030213] uppercase tracking-widest">{editCat ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Title</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
                <div>
                  <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Route</label>
                  <input value={form.route} onChange={e => setForm({ ...form, route: e.target.value })}
                    className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
              </div>
              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Image URL</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.comingSoon} onChange={e => setForm({ ...form, comingSoon: e.target.checked })}
                    className="accent-[#030213] h-4 w-4" />
                  <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider">Coming Soon</span>
                </label>
                {form.comingSoon && (
                  <div>
                    <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Season</label>
                    <input value={form.comingSeason} onChange={e => setForm({ ...form, comingSeason: e.target.value })}
                      className="border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" placeholder="e.g. FW26" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
              <button onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-card cursor-pointer rounded-none">Cancel</button>
              <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">{editCat ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-card border border-neutral-200 p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-sm font-bold text-[#030213] uppercase tracking-widest mb-2">Delete Category?</h3>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-card cursor-pointer rounded-none">Cancel</button>
              <button onClick={remove} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 bg-[#030213] text-white text-[9px] font-semibold tracking-widest px-4 py-3 uppercase z-50">{toast}</div>}
    </div>
  );
}
