import { useState, useEffect } from "react";
import { RotateCcw, Check, Sparkles, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { FeaturedProductsConfig } from "../lib/admin-content-store";
import { useAuthStore } from "../store/auth-store";
import { adminCuratedCollectionApi } from "../lib/curated-collection-api";
import { productApi } from "../lib/product-api";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
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

export function FeaturedProductsEditorPage() {
  const { token } = useAuthStore();
  const [config, setConfigState] = useState<FeaturedProductsConfig>({
    sectionTitle: "New In", sectionSubtitle: "New This Season", productIds: [], maxProducts: 4, active: true,
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [productCatalog, setProductCatalog] = useState<{ id: number; name: string; price: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");

  const loadData = async () => {
    if (!token) return;
    try {
      // 1. Fetch real products
      const prods = await productApi.fetchAllProducts(token);
      setProductCatalog(prods.map(p => ({
        id: p.id,
        name: p.productName,
        price: p.variants?.[0]?.price || 0
      })));

      // 2. Fetch curated collection config (using sectionKey: NEW_IN)
      const data = await adminCuratedCollectionApi.getCollection("NEW_IN", token);
      const validProductIds = (data.products?.map(p => p.id) || []).filter(id => prods.some(prod => prod.id === id));
      setConfigState({
        sectionTitle: data.title || "New In",
        sectionSubtitle: data.subtitle || "New This Season",
        productIds: validProductIds,
        active: data.isActive,
        maxProducts: 4
      });
      setSelectedIds(validProductIds);
    } catch (err) {
      console.error("Failed to load new in collection:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const save = async () => {
    if (!token) return;
    try {
      await adminCuratedCollectionApi.updateCollection("NEW_IN", {
        title: config.sectionTitle,
        subtitle: config.sectionSubtitle || "",
        isActive: config.active,
        productIds: selectedIds
      }, token);
      showToast("New In configuration saved");
    } catch (err) {
      console.error("Failed to save new in collection:", err);
      showToast("Error saving new in collection");
    }
  };

  const reset = () => {
    showToast("Feature disabled. Managed via DB.");
  };

  const toggleProduct = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...selectedIds];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    setSelectedIds(arr);
  };

  const moveDown = (idx: number) => {
    if (idx >= selectedIds.length - 1) return;
    const arr = [...selectedIds];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    setSelectedIds(arr);
  };

  return (
    <div className="space-y-6 font-sans text-[#382d24]">
      {/* Editor Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Column 1: Settings & Display Order */}
        <div className="xl:col-span-5 space-y-6">
          {/* Metadata Block */}
          <div className="bg-white border border-neutral-200/80 p-5 space-y-4 shadow-sm">
            <h3 className="text-[9px] font-black tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2">Section Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">Section Title</label>
                <input 
                  value={config.sectionTitle || ""} 
                  onChange={e => setConfigState({ ...config, sectionTitle: e.target.value })}
                  placeholder="e.g. New In"
                  className="w-full border border-neutral-200 px-3 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none bg-white text-[#030213]" 
                />
              </div>
              <div>
                <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5 block">Section Subtitle</label>
                <input 
                  value={config.sectionSubtitle || ""} 
                  onChange={e => setConfigState({ ...config, sectionSubtitle: e.target.value })}
                  placeholder="e.g. New This Season"
                  className="w-full border border-neutral-200 px-3 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none bg-white text-[#030213]" 
                />
              </div>
              <div className="flex flex-wrap items-center justify-between border-t border-neutral-100 pt-4 mt-2 gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase">Active Status</label>
                  <ToggleSwitch enabled={config.active} onClick={() => setConfigState({ ...config, active: !config.active })} />
                  <span className="text-[7px] text-neutral-400 font-semibold uppercase tracking-wider min-w-[45px]">
                    {config.active ? "Visible" : "Hidden"}
                  </span>
                </div>
                <div className="flex gap-2.5 shrink-0">
                  <button
                    onClick={reset}
                    className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer bg-white rounded-none flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> Reset
                  </button>
                  <button
                    onClick={save}
                    className="bg-[#224870] hover:bg-[#1a3a5c] text-white text-[8px] font-bold tracking-widest px-4 py-1.5 uppercase flex items-center gap-1 cursor-pointer rounded-none border-none transition-colors"
                  >
                    <Check className="w-3 h-3" /> Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order list */}
          <div className="bg-white border border-neutral-200/80 p-5 space-y-4 shadow-sm">
            <h3 className="text-[9px] font-black tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2">
              Item Display Order ({selectedIds.length})
            </h3>
            {selectedIds.length === 0 ? (
              <p className="text-[8px] text-neutral-400 uppercase tracking-wider font-semibold py-4 text-center">No products selected.</p>
            ) : (
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {selectedIds.map((id, index) => {
                  const p = productCatalog.find(prod => prod.id === id);
                  if (!p) return null;
                  return (
                    <div key={id} className="flex items-center justify-between border border-neutral-200 bg-neutral-50/50 px-2.5 py-1.5">
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="text-[7px] text-neutral-400 font-bold uppercase tracking-wider mr-1.5">#{index + 1}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-800 truncate inline-block max-w-[140px] align-middle">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 text-neutral-400 hover:text-[#224870] disabled:opacity-20 cursor-pointer bg-transparent border-none">
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button onClick={() => moveDown(index)} disabled={index === selectedIds.length - 1} className="p-1 text-neutral-400 hover:text-[#224870] disabled:opacity-20 cursor-pointer bg-transparent border-none">
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button onClick={() => toggleProduct(id)} className="p-1 text-neutral-400 hover:text-[#b2533e] cursor-pointer bg-transparent border-none ml-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Search & Selector */}
        <div className="xl:col-span-4 bg-white border border-neutral-200/80 p-5 space-y-4 shadow-sm h-[580px] flex flex-col">
          <div className="border-b border-neutral-100 pb-3 flex items-center justify-between gap-4">
            <h3 className="text-[9px] font-black tracking-widest uppercase text-neutral-400">Select Products</h3>
            <input 
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border border-neutral-200 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider focus:outline-none focus:border-[#224870] rounded-none bg-neutral-50 text-[#030213] w-40" 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 content-start">
            {productCatalog
              .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(p => {
                const selected = selectedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`text-left p-3 border cursor-pointer transition-all duration-150 rounded-none flex flex-col justify-between h-20 ${
                      selected 
                        ? "border-[#224870] bg-[#224870]/5" 
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <span className={`text-[9px] font-bold uppercase tracking-wider line-clamp-2 mr-2 ${selected ? "text-[#224870]" : "text-neutral-800"}`}>
                        {p.name}
                      </span>
                      <div className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 rounded-none ${selected ? "bg-[#224870] border-[#224870]" : "border-neutral-350"}`}>
                        {selected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-[9px] font-extrabold text-neutral-400">₹{p.price.toLocaleString("en-IN")}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Column 3: Live Home Preview */}
        <div className="xl:col-span-3 bg-[#FAF8F5] border border-neutral-200 p-5 space-y-4 shadow-sm h-[580px] flex flex-col">
          <h3 className="text-[9px] font-black tracking-widest uppercase text-neutral-400 border-b border-neutral-200/60 pb-2">Home Preview</h3>
          
          <div className="bg-white border border-neutral-200/80 p-4 flex-1 overflow-y-auto">
            <span className="text-[6px] font-extrabold tracking-[0.25em] text-[#b2533e] uppercase block mb-1">
              {config.sectionSubtitle || "New This Season"}
            </span>
            <h4 className="text-[12px] font-extrabold tracking-tight text-[#030213] uppercase mb-4 border-b border-neutral-100 pb-2">
              {config.sectionTitle || "New In"}
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {selectedIds.map(id => {
                const p = productCatalog.find(prod => prod.id === id);
                if (!p) return null;
                return (
                  <div key={id} className="border border-neutral-100 p-2 bg-neutral-50/20">
                    <div className="aspect-[3/4] bg-neutral-100 mb-1 flex items-center justify-center">
                      <span className="text-[5px] font-bold text-neutral-400 uppercase tracking-widest">Product Image</span>
                    </div>
                    <span className="text-[7px] font-bold uppercase tracking-wider text-neutral-800 line-clamp-1 block">{p.name}</span>
                    <span className="text-[7px] font-black text-[#224870] mt-0.5 block">₹{p.price.toLocaleString("en-IN")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#224870] text-white text-[9px] font-bold tracking-widest px-5 py-3 uppercase z-50 flex items-center gap-2 shadow-xl">
          <Check className="w-3.5 h-3.5" />
          {toast}
        </div>
      )}
    </div>
  );
}
