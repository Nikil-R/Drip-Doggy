import { useState, useEffect } from "react";
import { X, RotateCcw, Check, Star, Eye, EyeOff } from "lucide-react";
import { getSignaturePieces, setSignaturePieces, SignaturePiecesConfig } from "../lib/admin-content-store";

// Product catalog reference (shared with frontend)
const PRODUCT_CATALOG = [
  { id: 1, name: "Structured Canvas Jacket", price: 12999 },
  { id: 2, name: "Pinstripe Relaxed Shirt", price: 8499 },
  { id: 3, name: "Cashmere Blend Knit", price: 15999 },
  { id: 4, name: "Satin Asymmetric Top", price: 6499 },
  { id: 5, name: "Moto Biker Jacket", price: 18999 },
  { id: 6, name: "Pleated Wide-Leg Trousers", price: 7499 },
  { id: 7, name: "Oversized Blazer Dress", price: 11499 },
  { id: 8, name: "Slim-Fit Turtleneck", price: 5499 },
  { id: 9, name: "Wool Cashmere Overcoat", price: 24999 },
  { id: 10, name: "Drape Front Bodysuit", price: 4299 },
  { id: 11, name: "Parachute Cargo Skirt", price: 6499 },
  { id: 12, name: "Oversized Knit Cardigan", price: 9999 },
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

export function SignaturePiecesEditorPage() {
  const [config, setConfigState] = useState<SignaturePiecesConfig>({
    sectionTitle: "Signature Pieces", sectionSubtitle: "Brand Uniform", productIds: [], active: true,
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => { const c = getSignaturePieces(); setConfigState(c); setSelectedIds(c.productIds); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const save = () => { setSignaturePieces({ ...config, productIds: selectedIds }); showToast("Signature pieces saved"); };

  const reset = () => {
    const d: SignaturePiecesConfig = { sectionTitle: "Signature Pieces", sectionSubtitle: "Brand Uniform", productIds: [4, 9, 1, 6], active: true };
    setConfigState(d); setSelectedIds(d.productIds);
    showToast("Reset defaults applied");
  };

  const toggleProduct = (id: number) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-8 font-sans text-[#382d24]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <Star className="w-5 h-5 text-[#224870]" /> Signature Pieces
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">Select Drip Doggy signature pieces for the homepage section</p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={reset} className="border border-neutral-300 hover:border-[#224870] text-[#382d24] hover:text-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer bg-transparent rounded-none transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
          <button onClick={save} className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none transition-colors">
            <Check className="w-3.5 h-3.5" /> Save Section
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="bg-card border border-neutral-200/80 p-6 space-y-5">
        <span className="text-[10px] font-black tracking-widest uppercase text-[#382d24] block border-b border-neutral-200/60 pb-3">Section Metadata &amp; Configuration</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Section Title</label>
            <input value={config.sectionTitle} onChange={e => setConfigState({ ...config, sectionTitle: e.target.value })}
              className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
          </div>
          <div className="space-y-1">
            <label className="text-[8.5px] font-bold tracking-wider text-neutral-500 uppercase block">Section Subtitle</label>
            <input value={config.sectionSubtitle} onChange={e => setConfigState({ ...config, sectionSubtitle: e.target.value })}
              className="w-full border border-neutral-300 bg-[#faf8f5] px-3.5 py-2 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
          </div>
          <div className="flex items-center justify-between bg-[#faf8f5] border border-neutral-300 p-2.5 h-[38px]">
            <span className="text-[8.5px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              {config.active ? <Eye className="w-3.5 h-3.5 text-[#224870]" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
              Active on Home
            </span>
            <ToggleSwitch enabled={config.active} onClick={() => setConfigState({ ...config, active: !config.active })} />
          </div>
        </div>
      </div>

      {/* Product Selector */}
      <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#382d24]">Select Signature Products ({selectedIds.length} selected)</span>
          <span className="text-[9.5px] font-black text-[#615e56] uppercase tracking-wider">Nominal display limit: 4 products</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {PRODUCT_CATALOG.map(p => {
            const selected = selectedIds.includes(p.id);
            return (
              <button key={p.id} onClick={() => toggleProduct(p.id)}
                className={`text-left p-4 border cursor-pointer transition-all rounded-none ${
                  selected ? "border-[#224870] bg-[#224870]/5" : "border-neutral-200 bg-[#faf8f5]/20 hover:border-neutral-400"
                }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-tight truncate mr-2 ${selected ? "text-[#224870]" : "text-[#382d24]"}`}>{p.name}</span>
                  <div className={`w-4 h-4 border flex items-center justify-center shrink-0 rounded-none ${selected ? "bg-[#224870] border-[#224870]" : "border-neutral-300"}`}>
                    {selected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                </div>
                <span className="text-[9px] text-[#382d24] font-black mt-1.5 block">₹{p.price.toLocaleString("en-IN")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#382d24] text-[#faf8f5] text-[9px] font-bold tracking-widest px-4.5 py-3.5 uppercase z-50 border border-neutral-700 shadow-2xl animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
