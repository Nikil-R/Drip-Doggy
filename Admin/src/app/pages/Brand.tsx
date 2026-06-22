import { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2, Image as ImageIcon, AlertTriangle, Package, Eye, DollarSign, Layers, Calendar } from "lucide-react";

const RS = "\u20B9";

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

interface Brand {
  id: number;
  name: string;
  logo: string;
  description: string;
  status: "active" | "inactive";
  productCount: number;
  totalRevenue: number;
  avgPrice: number;
  founded: string;
  collections: number;
  categories: string[];
}

const initialBrands: Brand[] = [
  { id: 1, name: "Drip Doggy", logo: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=120&h=120&fit=crop", description: "Luxury streetwear label — Mumbai, India", status: "active", productCount: 24, totalRevenue: 24476747, avgPrice: 10874, founded: "2024", collections: 8, categories: ["Outerwear", "Knitwear", "Tops", "Bottoms", "Accessories"] },
  { id: 2, name: "Syndicate", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=120&fit=crop", description: "Premium urban collection — Bangalore", status: "active", productCount: 14, totalRevenue: 12850000, avgPrice: 9178, founded: "2025", collections: 4, categories: ["Outerwear", "Tops", "Accessories"] },
  { id: 3, name: "Archive", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=120&fit=crop", description: "Limited edition drops & past seasons", status: "active", productCount: 8, totalRevenue: 8200000, avgPrice: 14500, founded: "2024", collections: 3, categories: ["Outerwear", "Knitwear", "Bottoms"] },
  { id: 4, name: "SS26", logo: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=120&h=120&fit=crop", description: "Spring/Summer 2026 collection", status: "active", productCount: 6, totalRevenue: 2850000, avgPrice: 8999, founded: "2026", collections: 2, categories: ["Tops", "Bottoms", "New Arrivals"] },
  { id: 5, name: "FW25 Heritage", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=120&fit=crop", description: "Fall/Winter 2025 heritage line", status: "active", productCount: 10, totalRevenue: 15600000, avgPrice: 13200, founded: "2025", collections: 3, categories: ["Outerwear", "Knitwear", "Bottoms"] },
  { id: 6, name: "Studio", logo: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=120&h=120&fit=crop", description: "Experimental designs & prototypes", status: "inactive", productCount: 0, totalRevenue: 0, avgPrice: 0, founded: "2025", collections: 1, categories: [] },
];

export function BrandPage() {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", logo: "", description: "", status: "active" as "active" | "inactive" });

  const filtered = useMemo(() => brands.filter(b => !search || b.name.toLowerCase().includes(search.toLowerCase())), [brands, search]);

  // ── KPI Stats ───────────────────────────────────────────────────
  const kpis = useMemo(() => [
    { label: "Total Brands", value: brands.length.toString(), icon: Layers, color: "text-[#030213]" },
    { label: "Active", value: brands.filter(b => b.status === "active").length.toString(), icon: Eye, color: "text-green-700" },
    { label: "Total Products", value: brands.reduce((s, b) => s + b.productCount, 0).toString(), icon: Package, color: "text-[#030213]" },
    { label: "Total Revenue", value: RS + brands.reduce((s, b) => s + b.totalRevenue, 0).toLocaleString("en-IN"), icon: DollarSign, color: "text-amber-700" },
  ], [brands]);

  const openAdd = () => { setEditBrand(null); setForm({ name: "", logo: "", description: "", status: "active" }); setShowModal(true); };
  const openEdit = (b: Brand) => { setEditBrand(b); setForm({ name: b.name, logo: b.logo, description: b.description, status: b.status }); setShowModal(true); };

  const save = () => {
    if (editBrand) {
      setBrands(brands.map(b => b.id === editBrand.id ? { ...b, ...form } : b));
    } else {
      setBrands([...brands, { ...form, id: Date.now(), productCount: 0, totalRevenue: 0, avgPrice: 0, founded: "2026", collections: 0, categories: [] }]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id: number) => {
    setBrands(brands.map(b => b.id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b));
  };
  const confirmDelete = () => { if (deleteId) { setBrands(brands.filter(b => b.id !== deleteId)); setDeleteId(null); } };

  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Brands</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy collections &amp; sub-labels
          </p>
        </div>
        <button onClick={openAdd} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none">
          <Plus className="w-3.5 h-3.5" /> Add Brand
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
            <kpi.icon className="w-5 h-5 text-neutral-400 shrink-0" />
            <div>
              <p className={`text-lg font-black ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white border border-neutral-200/80 p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <input type="text" placeholder="Search brands..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-white border border-neutral-200/80 pl-8 pr-3 py-2 text-[9px] font-extrabold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-64 rounded-none" />
        </div>
      </div>

      {/* ── Brand Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(b => (
          <div key={b.id} className="bg-white border border-neutral-200/80 p-6 flex flex-col gap-4">
            {/* Top: Logo + Name + Actions */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-neutral-100 border border-neutral-200/50 flex items-center justify-center overflow-hidden shrink-0">
                {b.logo ? <img src={b.logo} alt={b.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-neutral-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-black text-[#030213] uppercase tracking-wide truncate">{b.name}</h3>
                  <span className={`text-[6px] font-extrabold px-1 py-0.5 uppercase ${b.status === "active" ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"}`}>{b.status}</span>
                </div>
                <p className="text-[8px] text-neutral-400 font-bold mt-0.5 uppercase tracking-wider">{b.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5 text-[7px] text-neutral-400 font-extrabold">
                    <Calendar className="w-3 h-3" />
                    {b.founded}
                  </div>
                  <div className="flex items-center gap-1.5 text-[7px] text-neutral-400 font-extrabold">
                    <Layers className="w-3 h-3" />
                    {b.collections} collections
                  </div>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(b)} className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeleteId(b.id)} className="text-neutral-400 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-neutral-100">
              <div className="text-center">
                <p className="text-[11px] font-black text-[#030213]">{b.productCount}</p>
                <p className="text-[6px] font-extrabold text-neutral-400 uppercase tracking-widest mt-0.5">Products</p>
              </div>
              <div className="text-center border-x border-neutral-100">
                <p className="text-[11px] font-black text-amber-700">{b.totalRevenue > 0 ? RS + (b.totalRevenue / 100000).toFixed(1) + "L" : "—"}</p>
                <p className="text-[6px] font-extrabold text-neutral-400 uppercase tracking-widest mt-0.5">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black text-[#030213]">{b.avgPrice > 0 ? RS + b.avgPrice.toLocaleString("en-IN") : "—"}</p>
                <p className="text-[6px] font-extrabold text-neutral-400 uppercase tracking-widest mt-0.5">Avg Price</p>
              </div>
            </div>

            {/* Category tags */}
            {b.categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {b.categories.map(cat => (
                  <span key={cat} className="text-[6.5px] font-extrabold tracking-widest bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 uppercase">{cat}</span>
                ))}
              </div>
            )}

            {/* Status toggle */}
            <div className="flex items-center gap-2 pt-1">
              <ToggleSwitch enabled={b.status === "active"} onClick={() => toggleStatus(b.id)} />
              <span className={`text-[7px] font-extrabold tracking-widest ${b.status === "active" ? "text-green-700" : "text-neutral-400"}`}>{b.status === "active" ? "ACTIVE" : "INACTIVE"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add/Edit Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white border border-neutral-200 w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-[#030213] uppercase tracking-widest">{editBrand ? "Edit Brand" : "Add Brand"}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none"><Trash2 className="w-4 h-4 rotate-45" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Brand Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" placeholder="e.g. Drip Doggy" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Logo URL</label>
                <input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" placeholder="https://..." />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none h-20" />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as "active" | "inactive" })}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none bg-white">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
              <button onClick={() => setShowModal(false)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none">Cancel</button>
              <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">{editBrand ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-white border border-neutral-200 p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-sm font-black text-[#030213] uppercase tracking-widest mb-2">Delete Brand?</h3>
            <p className="text-[9px] text-neutral-500 mb-4">This will remove the brand permanently.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer rounded-none">Cancel</button>
              <button onClick={confirmDelete} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
