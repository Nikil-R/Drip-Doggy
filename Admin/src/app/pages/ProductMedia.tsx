import { useState, useMemo, useRef } from "react";
import { Search, Trash2, AlertTriangle, X, Upload, Star, Camera, Layers, Eye, Check, Plus, FolderOpen } from "lucide-react";

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
  
  // Bulk upload modal states
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<"file" | "url">("file");
  const [bulkProduct, setBulkProduct] = useState("");
  const [bulkUrlsText, setBulkUrlsText] = useState("");
  const [bulkUploadedFiles, setBulkUploadedFiles] = useState<string[]>([]);
  const [bulkAltText, setBulkAltText] = useState("Product detail shot");
  
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // KPIs
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

  // Handle Multi-file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setBulkUploadedFiles(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Add all selected files/URLs in bulk
  const handleAddBulkMedia = () => {
    if (!bulkProduct) {
      alert("Please select a target product to map the media assets to.");
      return;
    }

    const existingSku = media.find(m => m.productName === bulkProduct)?.sku || "DD-MOCK-" + Math.floor(Math.random() * 900 + 100);
    const newItems: ProductMediaItem[] = [];

    if (activeTab === "file") {
      if (bulkUploadedFiles.length === 0) {
        alert("Please browse or drag files to upload first.");
        return;
      }
      bulkUploadedFiles.forEach((fileUrl, i) => {
        newItems.push({
          id: Date.now() + i,
          productName: bulkProduct,
          productId: 100,
          url: fileUrl,
          alt: `${bulkAltText} ${i + 1}`,
          isPrimary: false,
          sku: existingSku
        });
      });
    } else {
      const urls = bulkUrlsText
        .split("\n")
        .map(u => u.trim())
        .filter(u => u.startsWith("http") || u.startsWith("https"));

      if (urls.length === 0) {
        alert("Please paste at least one valid image URL starting with http:// or https://");
        return;
      }
      urls.forEach((url, i) => {
        newItems.push({
          id: Date.now() + i,
          productName: bulkProduct,
          productId: 100,
          url: url,
          alt: `${bulkAltText} ${i + 1}`,
          isPrimary: false,
          sku: existingSku
        });
      });
    }

    setMedia(prev => [...prev, ...newItems]);
    // Reset state
    setBulkUploadedFiles([]);
    setBulkUrlsText("");
    setBulkProduct("");
    setShowAdd(false);
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
    <div className="space-y-8 font-sans text-[#382d24]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-[#224870]" /> Product Media
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Drip Doggy product images &amp; assets catalog
          </p>
        </div>
        <button 
          onClick={() => setShowAdd(true)} 
          className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none border-none"
        >
          <Upload className="w-3.5 h-3.5" /> Bulk Add Assets
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Total Images</span>
            <Camera className="w-4 h-4 text-[#615e56]/70" />
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-2xl font-bold tracking-tight text-[#382d24] whitespace-nowrap">{totalImages}</span>
          </div>
          <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">Total assets uploaded to catalog</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Primary Images</span>
            <Star className="w-4 h-4 text-amber-600 fill-amber-600/10" />
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-2xl font-bold tracking-tight text-amber-700 whitespace-nowrap">{primaryImages}</span>
          </div>
          <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">Cover thumbnail highlights</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Products w/ Media</span>
            <Layers className="w-4 h-4 text-[#615e56]/70" />
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-2xl font-bold tracking-tight text-[#382d24] whitespace-nowrap">{productsWithMedia}</span>
          </div>
          <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">Distinct items with active media</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Total Products</span>
            <Eye className="w-4 h-4 text-[#615e56]/70" />
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-2xl font-bold tracking-tight text-[#382d24] whitespace-nowrap">{allProducts.length}</span>
          </div>
          <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">Total products defined in catalog</p>
        </div>

      </div>

      {/* Unified Media Library Section */}
      <div className="bg-card border border-neutral-200/80 p-6 space-y-6">
        
        {/* Filters and Header Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
          <span className="text-xs font-black uppercase tracking-widest text-[#382d24]">Catalog Asset Grid</span>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search Input (Highly Visible) */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#615e56]" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#faf8f5] border border-neutral-300 focus:border-[#224870] pl-9.5 pr-4 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none text-[#382d24] placeholder-neutral-400" 
              />
            </div>
            
            {/* Dropdown (Highly Visible) */}
            <select 
              value={selectedProduct} 
              onChange={e => setSelectedProduct(e.target.value)}
              className="border border-neutral-300 focus:border-[#224870] px-3.5 py-2 text-[10px] font-bold uppercase focus:outline-none bg-[#faf8f5] cursor-pointer text-[#382d24] rounded-none"
            >
              <option value="">All Products</option>
              {allProducts.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
          {filtered.map(m => (
            <div key={m.id} className="bg-[#faf8f5] border border-neutral-200/80 group relative flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="aspect-square bg-neutral-100 overflow-hidden relative border-b border-neutral-200/60">
                <img src={m.url} alt={m.alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                {m.isPrimary && (
                  <div className="absolute top-2 left-2 bg-[#224870] text-white text-[7px] font-bold tracking-widest px-1.5 py-0.5 uppercase">
                    PRIMARY
                  </div>
                )}
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-[#382d24] uppercase tracking-wide truncate">{m.productName}</p>
                  <p className="text-[9px] text-[#615e56] font-semibold mt-1 truncate">{m.alt}</p>
                  {m.sku && <p className="text-[8px] text-neutral-450 font-mono mt-1">{m.sku}</p>}
                </div>
                <div className="flex items-center justify-between pt-2.5 border-t border-neutral-200/60">
                  {m.isPrimary ? (
                    <span className="text-[8px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 border border-green-200 uppercase tracking-wider flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" /> Primary
                    </span>
                  ) : (
                    <button 
                      onClick={() => setPrimary(m.id)} 
                      className="text-[8px] font-bold text-[#615e56] hover:text-[#224870] cursor-pointer bg-transparent border-none uppercase tracking-wider transition-colors"
                    >
                      Set Primary
                    </button>
                  )}
                  <button 
                    onClick={() => setDeleteId(m.id)} 
                    className="text-neutral-300 hover:text-[#b2533e] cursor-pointer bg-transparent border-none transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-400 font-bold uppercase tracking-widest">
              No media assets match your search parameters.
            </div>
          )}
        </div>
      </div>

      {/* Bulk Add Media Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowAdd(false)}>
          <div className="bg-card border border-neutral-200 w-full max-w-xl mx-4 p-6 rounded-none animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-neutral-250">
              <h2 className="text-xs font-bold text-[#382d24] uppercase tracking-widest">Bulk Add Media Assets</h2>
              <button onClick={() => setShowAdd(false)} className="text-neutral-450 hover:text-[#382d24] cursor-pointer bg-transparent border-none"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-4">
              {/* Product selector for the batch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Target Product Mapping</label>
                  <select value={bulkProduct} onChange={e => setBulkProduct(e.target.value)}
                    className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9.5px] font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24]">
                    <option value="">Select product to map these to...</option>
                    {allProducts.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider block">Default Alt Description</label>
                  <input type="text" value={bulkAltText} onChange={e => setBulkAltText(e.target.value)}
                    className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9.5px] font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" placeholder="e.g. Model photoshoot detail" />
                </div>
              </div>

              {/* Tab Selector: Upload local files only */}
              <div className="flex border-b border-neutral-200">
                <button 
                  type="button" 
                  className="flex-1 py-1.5 text-[9px] font-black uppercase border-none bg-[#224870] text-white">
                  Upload Product Files
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
                
                {bulkUploadedFiles.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold uppercase text-[#615e56]">{bulkUploadedFiles.length} files selected for batch upload:</span>
                    <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-2 bg-[#faf8f5] border border-neutral-200">
                      {bulkUploadedFiles.map((file, i) => (
                        <div key={i} className="aspect-square border border-neutral-200 relative p-1 bg-white">
                          <img src={file} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setBulkUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute -top-1 -right-1 bg-[#b2533e] text-white hover:bg-red-800 w-3.5 h-3.5 flex items-center justify-center border-none cursor-pointer">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                      <div onClick={() => fileInputRef.current?.click()} className="aspect-square border border-dashed border-neutral-300 hover:border-[#224870] flex flex-col items-center justify-center cursor-pointer">
                        <Plus className="w-4 h-4 text-neutral-400" />
                        <span className="text-[7.5px] font-bold text-[#615e56] uppercase mt-0.5">Add</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-neutral-200 aspect-video bg-neutral-50/20 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-neutral-400">
                    <Upload className="w-8 h-8 text-neutral-300 mb-2 stroke-[1.5]" />
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Drag &amp; drop or click to choose multiple files</span>
                    <span className="text-[8px] text-neutral-400 uppercase mt-1">Accepts JPG, PNG, WEBP, etc.</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2.5 mt-6 pt-3 border-t border-neutral-200/60">
              <button 
                onClick={() => {
                  setShowAdd(false);
                  setBulkUploadedFiles([]);
                  setBulkUrlsText("");
                }} 
                className="border border-neutral-200 hover:border-[#382d24] text-[#615e56] hover:text-[#382d24] text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddBulkMedia} 
                className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9px] font-bold tracking-widest px-4.5 py-2.5 uppercase cursor-pointer border-none rounded-none"
              >
                Upload Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-card border border-neutral-200 p-6 max-w-sm mx-4 rounded-none animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2.5 text-[#b2533e] mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Delete Media Asset?</h3>
            </div>
            <p className="text-[9.5px] text-[#615e56] font-semibold leading-relaxed mb-5">
              Are you sure you want to delete this media asset? This action will permanently remove it from the catalog cache.
            </p>
            <div className="flex justify-end gap-2.5">
              <button 
                onClick={() => setDeleteId(null)} 
                className="border border-neutral-200 hover:border-[#382d24] text-[#615e56] hover:text-[#382d24] text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none"
              >
                Cancel
              </button>
              <button 
                onClick={() => { setMedia(media.filter(m => m.id !== deleteId)); setDeleteId(null); }} 
                className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-bold tracking-widest px-4.5 py-2.5 uppercase cursor-pointer border-none rounded-none"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
