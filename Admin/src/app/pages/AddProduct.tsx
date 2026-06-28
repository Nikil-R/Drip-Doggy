import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Search,
  Plus,
  Calendar,
  ChevronDown,
  Upload,
  X,
  Save,
  RotateCw,
  FolderOpen,
  Edit2,
  Sparkles,
  ArrowLeft,
  DollarSign,
  Package,
  Eye,
  SlidersHorizontal,
  Tags
} from "lucide-react";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const categories = ["Women", "Men", "Unisex"];
const subcategoriesMap: Record<string, string[]> = {
  "Women": ["Dresses", "Tops", "Knitwear"],
  "Men": ["Shirts", "Outerwear"],
  "Unisex": ["Bags", "Accessories"]
};
const brands = ["Drip Doggy", "Syndicate", "Archive", "SS26", "FW25 Heritage", "Studio"];
const tags = ["New Arrival", "Limited Drop", "Best Seller", "Archive", "Signature Piece", "Seasonal", "Premium"];

const mockCatalogProducts = [
  { id: "#DD-P002", name: "Sartorial Trench Coat" },
  { id: "#DD-P003", name: "Cashmere Blend Crew" },
  { id: "#DD-P004", name: "Merino Wool Cardigan" },
  { id: "#DD-P005", name: "Signature Silk Blouse" },
];

const sampleProductsForEdit = [
  { id: "#DD-P001", name: "Structured Canvas Jacket", category: "Outerwear", price: 12999, cost: 5200, stock: 45, status: "Active", sales: 342, revenue: 4445658, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-STR-001", season: "SS26", dateAdded: "2026-03-12", description: "Premium heavy-weight structured canvas utility jacket with signature hardware." },
  { id: "#DD-P002", name: "Sartorial Trench Coat", category: "Outerwear", price: 24999, cost: 10000, stock: 18, status: "Active", sales: 198, revenue: 4949802, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-SAT-001", season: "FW25", dateAdded: "2026-04-05", description: "Double-breasted oversized trench coat made of waterproof cotton gabardine." },
  { id: "#DD-P003", name: "Cashmere Blend Crew", category: "Knitwear", price: 8999, cost: 3600, stock: 62, status: "Active", sales: 287, revenue: 2582713, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-CAS-001", season: "FW25", dateAdded: "2026-04-18", description: "Minimalist crewneck sweater knitted in 7-gauge soft cashmere blend yarn." },
  { id: "#DD-P004", name: "Merino Wool Cardigan", category: "Knitwear", price: 11999, cost: 4800, stock: 23, status: "Active", sales: 167, revenue: 2003833, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-MER-001", season: "FW25", dateAdded: "2026-04-20", description: "Heavy knit luxury cardigan with branded horn buttons and patch pockets." },
  { id: "#DD-P005", name: "Signature Silk Blouse", category: "Tops", price: 6999, cost: 2100, stock: 78, status: "Active", sales: 312, revenue: 2183688, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-SIL-001", season: "SS26", dateAdded: "2026-05-01", description: "Relaxed fit standard blouse crafted in 100% mulberry silk." },
  { id: "#DD-P006", name: "Relaxed Linen Shirt", category: "Tops", price: 5499, cost: 1650, stock: 54, status: "Active", sales: 256, revenue: 1407744, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-LIN-001", season: "SS26", dateAdded: "2026-05-15", description: "Breathable airy linen button-down with raw edge details." },
  { id: "#DD-P007", name: "French Terry Hoodie", category: "Tops", price: 4499, cost: 1350, stock: 92, status: "Active", sales: 421, revenue: 1894079, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-FTH-001", season: "SS26", dateAdded: "2026-05-22", description: "Oversized hoodie knitted in heavy-weight French terry loops." },
  { id: "#DD-P008", name: "Pleated Wool Trousers", category: "Bottoms", price: 9999, cost: 4000, stock: 31, status: "Active", sales: 145, revenue: 1449855, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-PLE-001", season: "FW25", dateAdded: "2026-05-25", description: "Tailored wide-leg trousers built in fine Italian tropical wool fabric." },
  { id: "#DD-P009", name: "Tailored Linen Trousers", category: "Bottoms", price: 7999, cost: 2400, stock: 0, status: "Draft", sales: 0, revenue: 0, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-TLT-002", season: "SS26", dateAdded: "2026-06-01", description: "Minimal cream trousers in durable organic linen yarn." },
  { id: "#DD-P010", name: "Handwoven Silk Scarf", category: "Accessories", price: 3999, cost: 1200, stock: 120, status: "Active", sales: 534, revenue: 2135466, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-SCF-001", season: "All", dateAdded: "2026-06-05", description: "Custom jacquard patterned silk scarf with frayed edge details." },
  { id: "#DD-P011", name: "Drip Doggy Varsity Jacket", category: "Signature", price: 19999, cost: 8000, stock: 7, status: "Active", sales: 89, revenue: 1779911, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-VAR-001", season: "FW25", dateAdded: "2026-06-10", description: "High contrast leather-sleeve varsity jacket with chenille embroidery." },
  { id: "#DD-P012", name: "SS26 Linen Blend Jacket", category: "New Arrivals", price: 14499, cost: 5800, stock: 15, status: "Draft", sales: 0, revenue: 0, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-SS26-002", season: "SS26", dateAdded: "2026-06-18", description: "Single-button soft tailored jacket ideal for warm climates." }
];

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  mrp: string;
  discountType: "percentage" | "value";
  discountValue: string;
  finalPrice: string;
  sizeStock: Record<string, string>; // Maps size code to its quantity
  active: boolean;
  sizes: string[];
  images: string[];
}

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-9 h-5 flex items-center transition-all duration-300 focus:outline-none rounded-full border ${
        enabled ? "bg-[#224870] border-[#224870]" : "bg-transparent border-[#382d24]/30"
      }`}
    >
      <span
        className={`w-4 h-4 rounded-full transition-all duration-300 ${
          enabled ? "translate-x-4 bg-white" : "translate-x-0.5 bg-[#382d24]/60"
        }`}
      />
    </button>
  );
}

export function AddProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core Form States
  const [productName, setProductName] = useState("Structured Canvas Jacket");
  const [sku, setSku] = useState("DD-STR-001");
  const [description, setDescription] = useState(
    "A masterfully constructed canvas jacket built for the modern wardrobe. Features premium cotton-canvas shell, genuine horn buttons, contrast stitching, and a tailored yet relaxed silhouette. A Drip Doggy essential."
  );
  
  // Organization
  const [selectedCategory, setSelectedCategory] = useState("Women");
  const [selectedSubCategory, setSelectedSubCategory] = useState("Dresses");

  useEffect(() => {
    const list = subcategoriesMap[selectedCategory] || [];
    if (list.length > 0) {
      setSelectedSubCategory(list[0]);
    } else {
      setSelectedSubCategory("");
    }
  }, [selectedCategory]);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Best Seller"]);

  // Product Variants (color-based)
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Media (single cover image)
  const [productImages, setProductImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
  ]);

  // Validation feedback
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Load draft or edit product on mount
  useEffect(() => {
    if (isEdit && id) {
      const cleanId = id.startsWith("DD-P") ? `#${id}` : id;
      const product = sampleProductsForEdit.find(p => p.id === cleanId || p.id.replace("#", "") === id);
      if (product) {
        setProductName(product.name);
        setSku(product.sku);
        setDescription(product.description || "");
        setSelectedCategory(product.category);
        setProductImages([product.image]);
      }
    } else {
      const saved = localStorage.getItem("drip-doggy-product-draft");
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          if (confirm("Would you like to resume editing your saved draft?")) {
            setProductName(draft.productName || "");
            setSku(draft.sku || "");
            setDescription(draft.description || "");
            setSelectedCategory(draft.selectedCategory || "Women");
            setProductImages(draft.productImages || []);
            setFeedbackMsg("Draft restored.");
            setTimeout(() => setFeedbackMsg(""), 3000);
          }
        } catch (e) {
          console.error("Error loading draft", e);
        }
      }
    }
  }, [id, isEdit]);


  // Save draft manually
  const handleSaveDraft = () => {
    const draft = {
      productName,
      sku,
      description,
      selectedCategory,
      productImages
    };
    localStorage.setItem("drip-doggy-product-draft", JSON.stringify(draft));
    setFeedbackMsg("Draft saved successfully to browser local storage.");
    setTimeout(() => setFeedbackMsg(""), 3000);
  };


  // Custom image handling with 3:4 aspect checking (600x800 resolution)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const base64Url = event.target.result as string;
            const img = new Image();
            img.onload = () => {
              if (img.width !== 600 || img.height !== 800) {
                alert(`Error: Cover image dimensions are ${img.width}x${img.height}px. Product cover images must be exactly 600x800 pixels (3:4 aspect ratio).`);
                if (e.target) e.target.value = "";
              } else {
                setProductImages(prev => [...prev, base64Url]);
              }
            };
            img.src = base64Url;
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!productName.trim()) errors.push("Product Name is required.");
    if (!sku.trim()) errors.push("SKU code is required.");
    if (variants.length === 0) errors.push("At least one product variant is required.");

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setValidationErrors([]);
    localStorage.removeItem("drip-doggy-product-draft");
    alert(`"${productName}" (${sku}) has been successfully ${isEdit ? "updated" : "published"}!`);
    navigate("/admin/products");
  };

  return (
    <form onSubmit={handlePublish} className="space-y-8 font-sans text-[#382d24]">

      {/* Header Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[#382d24]/15 pb-5">
        <div>
          <button type="button" onClick={() => navigate("/admin/products")} className="text-[10px] font-black uppercase text-[#615e56] hover:text-[#224870] tracking-widest flex items-center gap-1.5 bg-transparent border-none cursor-pointer mb-2.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </button>
          <h1 className="text-2xl font-[950] text-[#382d24] uppercase tracking-widest">
            {isEdit ? "Edit Product Details" : "Add New Product"}
          </h1>
          <p className="text-xs text-[#615e56] font-[800] uppercase tracking-wider mt-1.5">
            {isEdit ? `Modifying Catalog Node: ${id}` : "Drip Doggy product creation interface"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {feedbackMsg && (
            <span className="text-[10px] bg-green-50 border border-green-200 text-green-700 px-4 py-2 font-bold uppercase tracking-wider">
              {feedbackMsg}
            </span>
          )}
          {!isEdit && (
            <button
              type="button"
              onClick={handleSaveDraft}
              className="bg-transparent border border-[#382d24]/30 hover:border-[#224870] text-[#382d24] hover:text-[#224870] text-[10.5px] font-black tracking-widest px-4.5 py-2.5 uppercase transition-all cursor-pointer flex items-center gap-2 rounded-none"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
          )}
          <button
            type="submit"
            className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[10.5px] font-black tracking-widest px-5.5 py-3 uppercase transition-colors cursor-pointer rounded-none border-none flex items-center gap-2"
          >
            {isEdit ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </div>

      {/* Validation Alerts */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-5 rounded-none">
          <h4 className="text-[11px] font-bold text-red-800 uppercase tracking-widest mb-2">Please address the following requirements:</h4>
          <ul className="list-disc pl-5 text-[10px] font-bold text-red-700 uppercase tracking-wider space-y-1.5">
            {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">

        {/* 1. Specifications & Organization */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-7 space-y-5">
          <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest border-b border-[#382d24]/15 pb-4">
            1. Specifications &amp; Organization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Product Title / Name</label>
              <input type="text" value={productName} onChange={e => setProductName(e.target.value)}
                placeholder="e.g. Structured Canvas Jacket"
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">SKU Code identifier</label>
              <input type="text" value={sku} onChange={e => setSku(e.target.value)}
                placeholder="e.g. DD-STR-001"
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold font-mono focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Category</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] transition-all">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Subcategory</label>
              <select value={selectedSubCategory} onChange={e => setSelectedSubCategory(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] transition-all">
                {(subcategoriesMap[selectedCategory] || []).map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Tag Badge (Single Select)</label>
            <div className="flex flex-wrap gap-2 p-3 bg-[#faf8f5] border border-[#382d24]/20 max-h-24 overflow-y-auto">
              {tags.map(t => {
                const isChecked = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSelectedTags([t]);
                    }}
                    className={`px-3 py-1.5 text-[9px] font-bold uppercase border cursor-pointer transition-all ${
                      isChecked ? "bg-[#224870] border-[#224870] text-white" : "bg-transparent border-[#382d24]/25 text-[#615e56]/90 hover:border-neutral-400"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Editorial Description</label>
            </div>
            <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Detailed description of fabrics, fit, and seasonal inspirations..."
              className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] leading-relaxed rounded-none text-[#382d24] transition-all" />
          </div>
        </div>



        {/* 2. Cover Image */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest">
                2. Cover Image <span className="text-red-500 font-normal lowercase text-xs">(600x800 pixels)</span>
              </h3>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            {productImages.length > 0 ? (
              <div className="flex items-center gap-3">
                <div className="w-[60px] h-[80px] border border-[#382d24]/15 overflow-hidden bg-neutral-50/50 flex-shrink-0">
                  <img src={productImages[0]} alt="Product" className="w-full h-full object-cover" />
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-transparent border border-[#382d24]/20 hover:border-[#224870] text-[#382d24] text-[9px] font-bold px-3 py-1.5 uppercase cursor-pointer transition-colors rounded-none">
                  <FolderOpen className="w-3.5 h-3.5 inline-block mr-1 text-neutral-500" /> Browse
                </button>
                <button type="button" onClick={() => setProductImages([])} className="bg-transparent border border-[#382d24]/20 text-[#b2533e] text-[9px] font-bold px-3 py-1.5 uppercase cursor-pointer hover:border-[#b2533e] transition-colors rounded-none">
                  <X className="w-3.5 h-3.5 inline-block mr-1" /> Remove
                </button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 cursor-pointer px-4 py-2.5 border-2 border-dashed border-[#382d24]/20 hover:border-neutral-400 transition-colors rounded-none">
                <Upload className="w-5 h-5 text-neutral-300 stroke-[1.5]" />
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Upload cover image</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Product Variants */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-[#382d24]/15 pb-4">
            <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest">
              3. Product Variants
            </h3>
            <button
              type="button"
              onClick={() => setVariants(prev => [...prev, {
                id: Date.now().toString(),
                name: "",
                sku: "",
                mrp: "",
                discountType: "percentage",
                discountValue: "",
                finalPrice: "",
                sizeStock: {},
                active: true,
                sizes: [],
                images: [],
              }])}
              className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-black tracking-widest px-4 py-2.5 uppercase flex items-center gap-1.5 border-none cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Variant
            </button>
          </div>

          {variants.length === 0 && (
            <div className="border-2 border-dashed border-[#382d24]/15 p-8 text-center">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">No variants added yet. Click "Add Variant" to begin.</span>
            </div>
          )}

          <div className="space-y-6">
            {variants.map((variant, idx) => (
              <div key={variant.id} className="border border-[#382d24]/15 bg-white p-6 space-y-5 relative">
                {/* Variant Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#224870] uppercase tracking-widest">Variant {idx + 1}</span>
                  <div className="flex items-center gap-3">
                    {/* Active Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#615e56] uppercase tracking-wider">Active</span>
                      <ToggleSwitch
                        enabled={variant.active}
                        onClick={() => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, active: !v.active } : v))}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setVariants(prev => prev.filter((_, i) => i !== idx))}
                      className="text-neutral-400 hover:text-[#b2533e] bg-transparent border-none cursor-pointer p-0 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Variant Images <span className="text-red-500 font-normal lowercase text-[9px]">(600x800 pixels)</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      {variant.images.map((img, imgIdx) => (
                        <div key={imgIdx} className="border border-[#382d24]/15 w-[75px] h-[100px] relative bg-neutral-50 flex items-center justify-center p-1 shadow-xs">
                          <img src={img} alt="Variant asset" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setVariants(prev => prev.map((v, i) => i === idx ? {
                                ...v,
                                images: v.images.filter((_, idxImg) => idxImg !== imgIdx)
                              } : v));
                            }}
                            className="absolute -top-1 -right-1 bg-[#b2533e] text-white hover:bg-red-800 w-4.5 h-4.5 flex items-center justify-center border-none cursor-pointer rounded-none"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.multiple = true;
                          input.onchange = (e: any) => {
                            const files = e.target.files;
                            if (files) {
                              Array.from(files).forEach((file: any) => {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result) {
                                    const base64Url = ev.target.result as string;
                                    const img = new Image();
                                    img.onload = () => {
                                      if (img.width !== 600 || img.height !== 800) {
                                        alert(`Error: Variant image dimensions are ${img.width}x${img.height}px. Variant images must be exactly 600x800 pixels (3:4 aspect ratio).`);
                                      } else {
                                        setVariants(prev => prev.map((v, i) => i === idx ? {
                                          ...v,
                                          images: [...v.images, base64Url]
                                        } : v));
                                      }
                                    };
                                    img.src = base64Url;
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }
                          };
                          input.click();
                        }}
                        className="border-2 border-dashed border-[#382d24]/20 w-[75px] h-[100px] flex flex-col items-center justify-center cursor-pointer hover:border-[#224870] transition-colors"
                      >
                        <Upload className="w-4 h-4 text-neutral-300 stroke-[1.5]" />
                        <span className="text-[7.5px] font-black text-neutral-400 uppercase tracking-wider mt-1 text-center leading-tight">Add 3:4</span>
                      </div>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Variant Name</label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={e => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, name: e.target.value } : v))}
                        placeholder="e.g. Black, Red, Navy"
                        className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">SKU</label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={e => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, sku: e.target.value } : v))}
                        placeholder="e.g. DD-P001-BLK"
                        className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-2.5 text-xs font-bold font-mono focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">MRP (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                        <input
                          type="text"
                          value={variant.mrp}
                          onChange={e => {
                            const mrpValue = e.target.value;
                            setVariants(prev => prev.map((v, i) => {
                              if (i !== idx) return v;
                              const mrpNum = Number(mrpValue) || 0;
                              const discNum = Number(v.discountValue) || 0;
                              let finalVal = mrpNum;
                              if (v.discountType === "percentage") {
                                finalVal = mrpNum - (mrpNum * (discNum / 100));
                              } else {
                                finalVal = mrpNum - discNum;
                              }
                              return {
                                ...v,
                                mrp: mrpValue,
                                finalPrice: finalVal > 0 ? String(Math.round(finalVal)) : "0"
                              };
                            }));
                          }}
                          placeholder="0"
                          className="w-full bg-[#faf8f5] border border-[#382d24]/20 pl-7 pr-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Discount Option</label>
                        <select
                          value={variant.discountType}
                          onChange={e => {
                            const discType = e.target.value as "percentage" | "value";
                            setVariants(prev => prev.map((v, i) => {
                              if (i !== idx) return v;
                              const mrpNum = Number(v.mrp) || 0;
                              const discNum = Number(v.discountValue) || 0;
                              let finalVal = mrpNum;
                              if (discType === "percentage") {
                                finalVal = mrpNum - (mrpNum * (discNum / 100));
                              } else {
                                finalVal = mrpNum - discNum;
                              }
                              return {
                                ...v,
                                discountType: discType,
                                finalPrice: finalVal > 0 ? String(Math.round(finalVal)) : "0"
                              };
                            }));
                          }}
                          className="text-[9px] font-bold uppercase border-none bg-transparent text-[#224870] focus:outline-none cursor-pointer"
                        >
                          <option value="percentage">% Percent</option>
                          <option value="value">₹ Flat Value</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={variant.discountValue}
                        onChange={e => {
                          const discValue = e.target.value;
                          setVariants(prev => prev.map((v, i) => {
                            if (i !== idx) return v;
                            const mrpNum = Number(v.mrp) || 0;
                            const discNum = Number(discValue) || 0;
                            let finalVal = mrpNum;
                            if (v.discountType === "percentage") {
                              finalVal = mrpNum - (mrpNum * (discNum / 100));
                            } else {
                              finalVal = mrpNum - discNum;
                            }
                            return {
                              ...v,
                              discountValue: discValue,
                              finalPrice: finalVal > 0 ? String(Math.round(finalVal)) : "0"
                            };
                          }));
                        }}
                        placeholder={variant.discountType === "percentage" ? "e.g. 10 for 10%" : "e.g. 500 for flat ₹500"}
                        className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Final Computed Price (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">₹</span>
                        <input
                          type="text"
                          value={variant.finalPrice}
                          disabled
                          placeholder="Calculated automatically"
                          className="w-full bg-neutral-100 border border-[#382d24]/10 pl-7 pr-3 py-2.5 text-xs font-bold text-neutral-500 rounded-none cursor-not-allowed select-none"
                        />
                      </div>
                    </div>

                     {/* Sizes Selection */}
                     <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Available Sizes</label>
                      <div className="flex flex-wrap gap-1.5">
                        {availableSizes.map(size => {
                          const isSelected = variant.sizes.includes(size);
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setVariants(prev => prev.map((v, i) => {
                                if (i !== idx) return v;
                                const sizesList = v.sizes.includes(size) 
                                  ? v.sizes.filter(s => s !== size) 
                                  : [...v.sizes, size];
                                
                                // Create copy of sizeStock to initialize or clean values
                                const newSizeStock = { ...v.sizeStock };
                                if (v.sizes.includes(size)) {
                                  delete newSizeStock[size];
                                } else {
                                  newSizeStock[size] = "";
                                }

                                return {
                                  ...v,
                                  sizes: sizesList,
                                  sizeStock: newSizeStock
                                };
                              }))}
                              className={`px-3 py-1.5 text-[9px] font-bold uppercase border cursor-pointer transition-all ${
                                isSelected ? "bg-[#224870] border-[#224870] text-white" : "bg-[#faf8f5] border-[#382d24]/20 text-[#615e56] hover:border-[#224870]"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stock Inputs by Size */}
                    {variant.sizes.length > 0 && (
                      <div className="sm:col-span-2 space-y-2.5 border-t border-neutral-100 pt-3">
                        <label className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Stock Quantity by Size</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {variant.sizes.map(size => (
                            <div key={size} className="space-y-1">
                              <span className="text-[10px] font-extrabold text-[#382d24] uppercase block">Size {size}</span>
                              <input
                                type="text"
                                value={variant.sizeStock[size] || ""}
                                onChange={e => {
                                  const val = e.target.value;
                                  setVariants(prev => prev.map((v, i) => {
                                    if (i !== idx) return v;
                                    return {
                                      ...v,
                                      sizeStock: {
                                        ...v.sizeStock,
                                        [size]: val
                                      }
                                    };
                                  }));
                                }}
                                placeholder="0"
                                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>



      </div>

    </form>
  );
}

