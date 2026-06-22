import { useState, useMemo } from "react";
import { Search, Trash2, AlertTriangle, ExternalLink, Upload, Star, Camera, Layers, Eye } from "lucide-react";

interface ProductMediaItem {
  id: number;
  productName: string;
  productId: number;
  url: string;
  alt: string;
  isPrimary: boolean;
  sku?: string;
}

// ─── Drip Doggy Products List ─────────────────────────────────────────────

const allProducts = [
  "Structured Canvas Jacket", "Sartorial Trench Coat", "Cashmere Blend Crew",
  "Merino Wool Cardigan", "Signature Silk Blouse", "Relaxed Linen Shirt",
  "French Terry Hoodie", "Pleated Wool Trousers", "Tailored Linen Trousers",
  "Handwoven Silk Scarf", "Drip Doggy Varsity Jacket", "Linen Midi Dress",
  "Signature Cap", "Leather Belt", "Drip Doggy Bomber Jacket"
];

// ─── Drip Doggy Media ─────────────────────────────────────────────────────

const initialMedia: ProductMediaItem[] = [
  { id: 1, productName: "Structured Canvas Jacket", productId: 4, url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=300&h=300&fit=crop", alt: "Front view", isPrimary: true, sku: "DD-STR-001" },
  { id: 2, productName: "Structured Canvas Jacket", productId: 4, url: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=300&h=300&fit=crop", alt: "Detail - stitching", isPrimary: false, sku: "DD-STR-001" },
  { id: 3, productName: "Sartorial Trench Coat", productId: 1, url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=300&h=300&fit=crop", alt: "Front view", isPrimary: true, sku: "DD-SAT-001" },
  { id: 4, productName: "Sartorial Trench Coat", productId: 1, url: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=300&h=300&fit=crop", alt: "Lining detail", isPrimary: false, sku: "DD-SAT-001" },
  { id: 5, productName: "Cashmere Blend Crew", productId: 9, url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=300&h=300&fit=crop", alt: "Front view", isPrimary: true, sku: "DD-CAS-001" },
  { id: 6, productName: "French Terry Hoodie", productId: 9, url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=300&h=300&fit=crop", alt: "Front view", isPrimary: true, sku: "DD-FTH-001" },
  { id: 7, productName: "Signature Silk Blouse", productId: 9, url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=300&h=300&fit=crop", alt: "Front view", isPrimary: true, sku: "DD-SIL-001" },
  { id: 8, productName: "Merino Wool Cardigan", productId: 9, url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=300&h=300&fit=crop", alt: "Flat lay", isPrimary: true, sku: "DD-MER-001" },
  { id: 9, productName: "Handwoven Silk Scarf", productId: 9, url: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=300&h=300&fit=crop", alt: "Pattern detail", isPrimary: true, sku: "DD-SCF-001" },
  { id: 10, productName: "Drip Doggy Varsity Jacket", productId: 9, url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=300&h=300&fit=crop", alt: "Front view", isPrimary: true, sku: "DD-VAR-001" },
  { id: 11, productName: "Relaxed Linen Shirt", productId: 9, url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=300&h=300&fit=crop", alt: "Front view", isPrimary: true, sku: "DD-LIN-001" },
  { id: 12, productName: "Pleated Wool Trousers", productId: 9, url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=300&h=300&fit=crop", alt: "Front view", isPrimary: true, sku: "DD-PLE-001" },
];

export function ProductMediaPage() {
  const [media, setMedia] = useState<ProductMediaItem[]>(initialMedia);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newProduct, setNewProduct] = useState("");

  // ── KPIs ─────────────────────────────────────────────────────────
  const totalImages = media.length;
  const primaryImages = media.filter(m => m.isPrimary).length;
  const productsWithMedia = new Set(media.map(m => m.productName)).size;

  const filtered = useMemo(() => {
    return media.filter(m => {
      if (selectedProduct && m.productName !== selectedProduct) return false;
      if (search && !m.productName.toLowerCase().includes(search.toLowerCase()) && !m.alt.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [media, search, selectedProduct]);

  const addMedia = () => {
    if (!newUrl || !newProduct) return;
    const product = allProducts.find(p => p === newProduct);
    if (!product) return;
    const existingSku = media.find(m => m.productName === product)?.sku;
    setMedia([...media, { id: Date.now(), productName: product, productId: 100, url: newUrl, alt: newAlt || "Media", isPrimary: false, sku: existingSku }]);
    setNewUrl(""); setNewAlt(""); setNewProduct(""); setShowAdd(false);
  };

  const setPrimary = (id: number) => {
    const target = media.find(m => m.id === id);
    if (!target) return;
    setMedia(media.map(m => ({
      ...m,
      isPrimary: m.productName === target.productName ? m.id === id : m.isPrimary
    })));
  };

  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Product Media</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy product images &amp; assets
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none">
          <Upload className="w-3.5 h-3.5" /> Add Media
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <Camera className="w-5 h-5 text-neutral-400 shrink-0" />
          <div>
            <p className="text-lg font-black text-[#030213]">{totalImages}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Total Images</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <Star className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-lg font-black text-amber-700">{primaryImages}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Primary Images</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <Layers className="w-5 h-5 text-neutral-400 shrink-0" />
          <div>
            <p className="text-lg font-black text-[#030213]">{productsWithMedia}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Products w/ Media</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <Eye className="w-5 h-5 text-neutral-400 shrink-0" />
          <div>
            <p className="text-lg font-black text-[#030213]">{allProducts.length}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Total Products</p>
          </div>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white border border-neutral-200/80 p-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <input type="text" placeholder="Search by product or alt text..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-neutral-200/80 pl-8 pr-3 py-2 text-[9px] font-extrabold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300" />
        </div>
        <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
          className="border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] bg-white">
          <option value="">All Products</option>
          {allProducts.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* ── Media Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(m => (
          <div key={m.id} className="bg-white border border-neutral-200/80 group relative">
            <div className="aspect-square bg-neutral-100 overflow-hidden relative">
              <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
              {m.isPrimary && (
                <div className="absolute top-2 left-2 bg-[#030213] text-white text-[6px] font-extrabold tracking-widest px-1.5 py-0.5 uppercase">
                  PRIMARY
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-[8px] font-black text-[#030213] uppercase tracking-wide truncate">{m.productName}</p>
              <p className="text-[7px] text-neutral-400 font-medium mt-0.5">{m.alt}</p>
              {m.sku && <p className="text-[6.5px] text-neutral-300 font-mono mt-0.5">{m.sku}</p>}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                {m.isPrimary ? (
                  <span className="text-[7px] font-extrabold text-green-700 bg-green-50 px-2 py-0.5 uppercase">Primary</span>
                ) : (
                  <button onClick={() => setPrimary(m.id)} className="text-[7px] font-extrabold text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none uppercase">Set Primary</button>
                )}
                <button onClick={() => setDeleteId(m.id)} className="text-neutral-300 hover:text-[#b2533e] cursor-pointer bg-transparent border-none"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add Media Modal ────────────────────────────────────────── */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="bg-white border border-neutral-200 w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-[#030213] uppercase tracking-widest">Add Media</h2>
              <button onClick={() => setShowAdd(false)} className="text-neutral-400 hover:text-[#030213] cursor-pointer bg-transparent border-none"><ExternalLink className="w-4 h-4 rotate-45" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Product</label>
                <select value={newProduct} onChange={e => setNewProduct(e.target.value)}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] bg-white">
                  <option value="">Select product...</option>
                  {allProducts.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Image URL</label>
                <input value={newUrl} onChange={e => setNewUrl(e.target.value)}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213]" placeholder="https://..." />
              </div>
              <div>
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase mb-1 block">Alt Text</label>
                <input value={newAlt} onChange={e => setNewAlt(e.target.value)}
                  className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213]" placeholder="e.g. Front view" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
              <button onClick={() => setShowAdd(false)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer">Cancel</button>
              <button onClick={addMedia} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer border-none">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ─────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-white border border-neutral-200 p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-sm font-black text-[#030213] uppercase tracking-widest mb-2">Delete Media?</h3>
            <p className="text-[9px] text-neutral-500 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase bg-white cursor-pointer">Cancel</button>
              <button onClick={() => { setMedia(media.filter(m => m.id !== deleteId)); setDeleteId(null); }} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer border-none">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
