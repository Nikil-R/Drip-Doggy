import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Check, RotateCcw, AlertTriangle, Layers, Eye, EyeOff } from "lucide-react";
import { HomeCategory } from "../lib/admin-content-store";
import { useAuthStore } from "../store/auth-store";
import { adminHomeCategoryApi } from "../lib/home-category-api";

const DEFAULT_CATEGORIES_DATA: HomeCategory[] = [
  { 
    id: "cat-1", 
    title: "Women's Collection", 
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800", 
    description: "Utility layers & draped silhouettes", 
    route: "/shop?gender=women", 
    comingSoon: false, 
    comingSeason: "", 
    order: 0, 
    active: true 
  },
  { 
    id: "cat-2", 
    title: "Men's Syndicate", 
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800", 
    description: "Upcoming menswear capsule", 
    route: "/coming-soon", 
    comingSoon: true, 
    comingSeason: "FW26", 
    order: 1, 
    active: true 
  },
];

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

export function HomeCategoriesEditorPage() {
  const { token } = useAuthStore();
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<HomeCategory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [form, setForm] = useState({ 
    title: "", 
    image: "", 
    description: "", 
    route: "", 
    comingSoon: false, 
    comingSeason: "", 
    active: true 
  });

  const loadCategories = async () => {
    if (!token) return;
    try {
      const data = await adminHomeCategoryApi.getAllCategories(token);
      const mapped = data.map((c): HomeCategory => ({
        id: String(c.id),
        title: c.title || "",
        description: c.description || "",
        image: c.imageUrl || "",
        route: c.route || "/shop",
        comingSoon: !!c.comingSoon,
        comingSeason: c.comingSeason || "",
        order: c.displayOrder || 0,
        active: c.isActive
      }));
      setCategories(mapped);
    } catch (err) {
      console.error("Failed to load home categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [token]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const openAdd = () => { 
    setEditCat(null); 
    setImageFile(null);
    setForm({ title: "Collections Special", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800", description: "Archival drops & vintage releases", route: "/shop", comingSoon: false, comingSeason: "", active: true }); 
    setShowModal(true); 
  };
  
  const openEdit = (c: HomeCategory) => { 
    setEditCat(c); 
    setImageFile(null);
    setForm({ title: c.title, image: c.image, description: c.description, route: c.route, comingSoon: c.comingSoon, comingSeason: c.comingSeason || "", active: c.active }); 
    setShowModal(true); 
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        const base64Url = reader.result;
        const img = new Image();
        img.onload = () => {
          const ratio = img.width / img.height;
          // 4:5 aspect ratio is exactly 0.8. We allow a tiny tolerance for minor pixel roundings.
          if (Math.abs(ratio - 0.8) > 0.01) {
            alert(`Upload Rejected: Aspect ratio is not 4:5. Current dimensions are ${img.width}x${img.height}px (Ratio: ${ratio.toFixed(2)}). Please upload an image with a 4:5 portrait aspect ratio (e.g. 800x1000, 1200x1500, etc.).`);
            if (e.target) e.target.value = "";
          } else {
            setForm(prev => ({ ...prev, image: base64Url }));
          }
        };
        img.src = base64Url;
      }
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!token) return;
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("route", form.route);
      formData.append("comingSoon", String(form.comingSoon));
      formData.append("comingSeason", form.comingSeason);
      formData.append("isActive", String(form.active));
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editCat) {
        formData.append("displayOrder", String(editCat.order));
        await adminHomeCategoryApi.updateCategory(Number(editCat.id), formData, token);
      } else {
        formData.append("displayOrder", String(categories.length));
        await adminHomeCategoryApi.createCategory(formData, token);
      }

      await loadCategories();
      setShowModal(false);
      showToast(editCat ? "Category updated" : "Category added");
    } catch (err) {
      console.error("Failed to save category:", err);
      showToast("Error saving category");
    }
  };

  const remove = async () => { 
    if (deleteId && token) { 
      try {
        await adminHomeCategoryApi.deleteCategory(Number(deleteId), token);
        await loadCategories();
        setDeleteId(null);
        showToast("Category deleted"); 
      } catch (err) {
        console.error("Failed to delete category:", err);
        showToast("Error deleting category");
      }
    } 
  };

  const reset = () => {
    showToast("Feature disabled. Managed via DB.");
  };

  const toggleActive = async (id: string) => {
    if (!token) return;
    try {
      await adminHomeCategoryApi.toggleCategoryActive(Number(id), token);
      await loadCategories();
      showToast("Visibility toggled");
    } catch (err) {
      console.error("Failed to toggle category status:", err);
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#382d24]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#224870]" /> Home Categories
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">Manage Drip Doggy homepage category cards</p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={reset} className="border border-neutral-300 hover:border-[#224870] text-[#382d24] hover:text-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase cursor-pointer bg-transparent rounded-none transition-colors"><RotateCcw className="w-3.5 h-3.5" /> Reset Defaults</button>
          <button onClick={openAdd} className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-colors"><Plus className="w-3.5 h-3.5" /> Add Category</button>
        </div>
      </div>

      {/* Category Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((c, idx) => (
          <div key={c.id} className="bg-card border border-neutral-200/80 p-5 flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-20 h-20 bg-neutral-100 border border-neutral-250/50 overflow-hidden shrink-0">
              <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-[11px] font-black text-[#382d24] uppercase tracking-wide">{c.title}</h3>
                {c.comingSoon && <span className="text-[7.5px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-500/10">SOON</span>}
              </div>
              <p className="text-[9px] text-[#615e56] font-bold mt-1 leading-relaxed">{c.description}</p>
              <div className="flex items-center gap-3 mt-3 text-[8px] text-neutral-400 font-bold uppercase tracking-wider">
                <span>Pos: {idx + 1}</span>
                <span className="truncate max-w-[120px]">{c.route}</span>
                {c.comingSeason && <span>Season: {c.comingSeason}</span>}
              </div>
            </div>

            <div className="flex flex-col items-end justify-between shrink-0 pl-2">
              <div className="flex items-center gap-1">
                {c.active ? <Eye className="w-3.5 h-3.5 text-[#224870]" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
                <ToggleSwitch enabled={c.active} onClick={() => toggleActive(c.id)} />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEdit(c)} 
                  className="text-white bg-[#224870] hover:bg-[#224870]/85 p-1.5 cursor-pointer transition-colors rounded-none flex items-center justify-center border-none shadow-sm"
                  title="Edit Category"
                >
                  <Edit2 className="w-3 h-3 text-white" />
                </button>
                <button 
                  onClick={() => setDeleteId(c.id)} 
                  className="text-white bg-[#b2533e] hover:bg-[#b2533e]/85 p-1.5 cursor-pointer transition-colors rounded-none flex items-center justify-center border-none shadow-sm"
                  title="Delete Category"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-neutral-300 w-full max-w-xl mx-4 p-6 my-8 rounded-none shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3.5 mb-5">
              <h2 className="text-xs font-bold text-[#382d24] uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#224870]" />
                {editCat ? "Edit Home Category" : "Create Home Category"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-450 hover:text-black cursor-pointer bg-transparent border-none p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4.5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Title</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Route</label>
                  <input value={form.route} onChange={e => setForm({ ...form, route: e.target.value })}
                    className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
                </div>
              </div>

              {/* Background Image Inputs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Category Banner Image</label>
                  <span className="text-[7.5px] text-[#b2533e] font-black uppercase tracking-wider bg-red-50 px-2 py-0.5 border border-red-200">Required Ratio: 4:5 Aspect Ratio</span>
                </div>
                <div className="bg-[#faf8f5] p-3.5 border border-neutral-300">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase text-neutral-400 block mb-1">Upload File</span>
                    <label className="w-full border border-neutral-300 hover:border-[#224870] bg-white px-3.5 py-2 text-xs font-bold text-[#382d24] flex items-center justify-center cursor-pointer transition-colors relative h-[38px]">
                      <span className="truncate">{form.image.startsWith("data:") ? "Image Loaded" : "Choose File..."}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </label>
                  </div>
                </div>
                {form.image && (
                  <div className="mt-2 flex flex-col items-center bg-neutral-50 p-3 border border-neutral-200">
                    <span className="text-[8px] font-black uppercase text-neutral-400 block mb-2">Category Card Aspect Preview (4:5 aspect)</span>
                    <div className="w-[160px] h-[200px] border border-neutral-300 overflow-hidden shrink-0 relative group shadow-sm">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
              </div>

              <div className="flex items-center gap-6 bg-[#faf8f5] p-3 border border-neutral-200">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.comingSoon} onChange={e => setForm({ ...form, comingSoon: e.target.checked })}
                    className="accent-[#224870] h-4.5 w-4.5 cursor-pointer" />
                  <span className="text-[9px] font-black text-[#615e56] uppercase tracking-wider">Coming Soon Capsule</span>
                </label>
                {form.comingSoon && (
                  <div className="flex items-center gap-2">
                    <span className="text-[8.5px] font-bold text-neutral-500 uppercase tracking-widest">Season Label</span>
                    <input value={form.comingSeason} onChange={e => setForm({ ...form, comingSeason: e.target.value })}
                      className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] w-28" placeholder="e.g. FW26" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200/60">
              <button onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-[#382d24] text-neutral-500 text-[9px] font-semibold tracking-widest px-4.5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={save} className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9px] font-semibold tracking-widest px-4.5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-colors">{editCat ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-card border border-neutral-300 p-6 max-w-sm mx-4 shadow-2xl rounded-none animate-scale-in" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-xs font-bold text-[#382d24] uppercase tracking-widest mb-2">Delete Category?</h3>
            <p className="text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider mb-4 leading-relaxed">This will remove this category card permanently. This action cannot be undone.</p>
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
