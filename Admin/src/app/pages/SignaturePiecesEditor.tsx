import { useState, useEffect } from "react";
import { X, RotateCcw, Check, Star } from "lucide-react";
import { getSignaturePieces, setSignaturePieces, SignaturePiecesConfig } from "../lib/admin-content-store";

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
    const d: SignaturePiecesConfig = { sectionTitle: "Drip Doggy Signature", sectionSubtitle: "Brand Uniform", productIds: [1, 5, 7, 12], active: true };
    setConfigState(d); setSelectedIds(d.productIds);
  };

  const toggleProduct = (id: number) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">Signature Pieces</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Select Drip Doggy signature pieces for the homepage section</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer bg-card rounded-none">
            <RotateCcw className="w-3 h-3" /> Reset Defaults
          </button>
          <button onClick={save} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer rounded-none border-none">
            <Check className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>

      <div className="bg-card border border-neutral-200/80 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Section Title</label>
          <input value={config.sectionTitle} onChange={e => setConfigState({ ...config, sectionTitle: e.target.value })}
            className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
        </div>
        <div>
          <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1 block">Section Subtitle</label>
          <input value={config.sectionSubtitle} onChange={e => setConfigState({ ...config, sectionSubtitle: e.target.value })}
            className="w-full border border-neutral-200/80 px-3 py-2 text-[9px] font-bold uppercase focus:outline-none focus:border-[#030213] rounded-none" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Select Products ({selectedIds.length} selected)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {PRODUCT_CATALOG.map(p => {
            const selected = selectedIds.includes(p.id);
            return (
              <button key={p.id} onClick={() => toggleProduct(p.id)}
                className={`text-left p-4 border cursor-pointer transition-all ${
                  selected ? "border-[#030213] bg-card" : "border-neutral-200/80 bg-card hover:border-neutral-400"
                }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase tracking-wide ${selected ? "text-[#030213]" : "text-neutral-600"}`}>{p.name}</span>
                  <div className={`w-4 h-4 border flex items-center justify-center ${selected ? "bg-[#030213] border-[#030213]" : "border-neutral-300"}`}>
                    {selected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <span className="text-[8px] text-neutral-400 font-bold mt-1 block">\u20B9{p.price.toLocaleString("en-IN")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {toast && <div className="fixed bottom-6 right-6 bg-[#030213] text-white text-[9px] font-semibold tracking-widest px-4 py-3 uppercase z-50">{toast}</div>}
    </div>
  );
}
