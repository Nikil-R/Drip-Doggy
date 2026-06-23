import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Search,
  Plus,
  Calendar,
  ChevronDown,
  Upload,
  X,
  Check,
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

const RS = "₹";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const categories = ["Outerwear", "Knitwear", "Tops", "Bottoms", "Accessories", "Signature", "Archive", "New Arrivals"];
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

interface VariantItem {
  color: string;
  size: string;
  price: number;
  stock: number;
}

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-9 h-5 flex items-center transition-all duration-300 focus:outline-none rounded-none border ${
        enabled ? "bg-[#224870] border-[#224870]" : "bg-transparent border-[#382d24]/30"
      }`}
    >
      <span
        className={`w-4 h-4 transition-all duration-300 ${
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
  
  // Pricing
  const [price, setPrice] = useState("12999");
  const [discountPrice, setDiscountPrice] = useState("");
  const [taxIncluded, setTaxIncluded] = useState("yes");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Inventory
  const [stockQty, setStockQty] = useState("45");
  const [stockStatus, setStockStatus] = useState("In Stock");
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [highlightProduct, setHighlightProduct] = useState(true);

  // Organization
  const [selectedCategory, setSelectedCategory] = useState("Outerwear");
  const [selectedBrand, setSelectedBrand] = useState("Drip Doggy");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Best Seller"]);
  
  // SEO Metadata
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [isAutoSlug, setIsAutoSlug] = useState(true);

  // Scheduling & Cross Sells
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<string[]>([]);

  // Variants & Color Palette
  const [colorPalette, setColorPalette] = useState([
    { name: "Black", bg: "#030213" },
    { name: "Camel", bg: "#c49a6c" },
    { name: "Ivory", bg: "#fdfaf3" },
    { name: "Olive", bg: "#556b2f" },
    { name: "Blush", bg: "#de5d83" },
    { name: "Navy", bg: "#000080" },
    { name: "Charcoal", bg: "#36454f" },
    { name: "Burgundy", bg: "#800020" },
  ]);
  const [selectedColors, setSelectedColors] = useState<string[]>(["Black"]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["M", "L"]);
  const [variantCustomizations, setVariantCustomizations] = useState<VariantItem[]>([]);

  // Custom Color Creator state
  const [customColorName, setCustomColorName] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#224870");

  // Media
  const [productImages, setProductImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=300&auto=format&fit=crop"
  ]);

  // Validation feedback
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Auto-slug generation from name
  useEffect(() => {
    if (isAutoSlug) {
      setSlug(
        productName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  }, [productName, isAutoSlug]);

  // Load draft or edit product on mount
  useEffect(() => {
    if (isEdit && id) {
      const cleanId = id.startsWith("DD-P") ? `#${id}` : id;
      const product = sampleProductsForEdit.find(p => p.id === cleanId || p.id.replace("#", "") === id);
      if (product) {
        setProductName(product.name);
        setSku(product.sku);
        setDescription(product.description || "");
        setPrice(product.price.toString());
        setStockQty(product.stock.toString());
        setStockStatus(product.stock === 0 ? "Out of Stock" : product.stock < 10 ? "Low Stock" : "In Stock");
        setSelectedCategory(product.category);
        setProductImages([product.image]);
        setSlug(product.sku.toLowerCase());
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
            setPrice(draft.price || "");
            setDiscountPrice(draft.discountPrice || "");
            setTaxIncluded(draft.taxIncluded || "yes");
            setStockQty(draft.stockQty || "");
            setSelectedCategory(draft.selectedCategory || "Outerwear");
            setSelectedBrand(draft.selectedBrand || "Drip Doggy");
            setSelectedColors(draft.selectedColors || ["Black"]);
            setSelectedSizes(draft.selectedSizes || ["M"]);
            setSlug(draft.slug || "");
            setMetaTitle(draft.metaTitle || "");
            setMetaDescription(draft.metaDescription || "");
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

  // Sync variant customizations list when selected colors/sizes update
  useEffect(() => {
    const defaultPrice = Number(price) || 0;
    const defaultStock = isUnlimited ? 9999 : Number(stockQty) || 0;

    const list: VariantItem[] = [];
    selectedColors.forEach(c => {
      selectedSizes.forEach(s => {
        const existing = variantCustomizations.find(item => item.color === c && item.size === s);
        list.push({
          color: c,
          size: s,
          price: existing ? existing.price : defaultPrice,
          stock: existing ? existing.stock : Math.round(defaultStock / (selectedColors.length * selectedSizes.length || 1))
        });
      });
    });
    setVariantCustomizations(list);
  }, [selectedColors, selectedSizes, price, stockQty, isUnlimited]);

  // Save draft manually
  const handleSaveDraft = () => {
    const draft = {
      productName,
      sku,
      description,
      price,
      discountPrice,
      taxIncluded,
      stockQty,
      selectedCategory,
      selectedBrand,
      selectedColors,
      selectedSizes,
      slug,
      metaTitle,
      metaDescription,
      productImages
    };
    localStorage.setItem("drip-doggy-product-draft", JSON.stringify(draft));
    setFeedbackMsg("Draft saved successfully to browser local storage.");
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  // AI assisted copywriting helper
  const handleAICopywrite = () => {
    const generated = `Experience the ultimate expression of modern street luxury. The Drip Doggy "${productName}" is a signature garment from our latest ${selectedCategory} collection. Meticulously designed with input from the ${selectedBrand} studio team, this piece utilizes heavyweight premium fabrics, customized details, and features our trademark athletic-relaxed block cut. Designed to be styled effortlessly.`;
    setDescription(generated);
    setFeedbackMsg("AI description generated.");
    setTimeout(() => setFeedbackMsg(""), 3000);
  };

  // Custom image handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setProductImages(prev => [...prev, event.target!.result as string]);
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
    if (!price || Number(price) <= 0) errors.push("A valid retail price is required.");
    if (!isUnlimited && (!stockQty || Number(stockQty) < 0)) errors.push("Valid stock levels are required.");
    if (selectedColors.length === 0) errors.push("At least one color variant must be selected.");
    if (selectedSizes.length === 0) errors.push("At least one size variant must be selected.");

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

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    setColorPalette(prev => [...prev, { name: customColorName.trim(), bg: customColorHex }]);
    setSelectedColors(prev => [...prev, customColorName.trim()]);
    setCustomColorName("");
  };

  const discount = Number(price) - Number(discountPrice);

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

      {/* Main Single-Column Redesigned Form Stack (Friendly flow, SEO at bottom) */}
      <div className="max-w-4xl mx-auto space-y-8">

        {/* 1. Basic Specifications & Organization */}
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
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Category Taxonomy</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] transition-all">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Brand / Label Collection</label>
              <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] transition-all">
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Tag Badges (Multiple Select)</label>
            <div className="flex flex-wrap gap-2 p-3 bg-[#faf8f5] border border-[#382d24]/20 max-h-24 overflow-y-auto">
              {tags.map(t => {
                const isChecked = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
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
              <button type="button" onClick={handleAICopywrite} className="text-[#b2533e] hover:text-[#224870] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 bg-transparent border-none cursor-pointer transition-colors">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Assisted Copywriter
              </button>
            </div>
            <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Detailed description of fabrics, fit, and seasonal inspirations..."
              className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] leading-relaxed rounded-none text-[#382d24] transition-all" />
          </div>
        </div>

        {/* 2. Pricing Details */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-7 space-y-5">
          <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest border-b border-[#382d24]/15 pb-4">
            2. Pricing Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Base Retail Price (₹)</label>
              <div className="relative">
                <input type="text" value={price} onChange={e => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#faf8f5] border border-[#382d24]/20 pl-8 pr-12 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">{RS}</div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-400">INR</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Discounted Price (₹)</label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-xs font-bold text-neutral-500">{RS}</div>
                <input type="text" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#faf8f5] border border-[#382d24]/20 pl-8 pr-3 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all" />
                {discountPrice && Number(discountPrice) > 0 && (
                  <div className="absolute right-3 text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                    -{Math.round((discount / Number(price)) * 100)}% (Save {RS}{discount.toLocaleString("en-IN")})
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">GST Rate Structure</label>
              <div className="flex gap-6 py-2">
                <button
                  type="button"
                  onClick={() => setTaxIncluded("yes")}
                  className="flex items-center gap-2.5 bg-transparent border-none p-0 cursor-pointer text-xs font-bold text-[#382d24]"
                >
                  <span className={`w-5 h-5 border transition-all flex items-center justify-center ${taxIncluded === "yes" ? "border-[#224870] bg-[#224870] text-white" : "border-[#382d24]/30 text-transparent"}`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  GST Included (12% Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setTaxIncluded("no")}
                  className="flex items-center gap-2.5 bg-transparent border-none p-0 cursor-pointer text-xs font-bold text-[#382d24]"
                >
                  <span className={`w-5 h-5 border transition-all flex items-center justify-center ${taxIncluded === "no" ? "border-[#224870] bg-[#224870] text-white" : "border-[#382d24]/30 text-transparent"}`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  Tax Exempt / Zero Rate
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Sale Duration Dates (Optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Stock & Inventory Settings */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-7 space-y-5">
          <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest border-b border-[#382d24]/15 pb-4">
            3. Stock &amp; Inventory Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Total Inventory Stock Qty</label>
              <input type="text" value={stockQty} onChange={e => setStockQty(e.target.value)}
                disabled={isUnlimited}
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] disabled:opacity-40 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Inventory Stock Status</label>
              <select value={stockStatus} onChange={e => setStockStatus(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] transition-all">
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Backorder">Backorder</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#382d24]/10 mt-3">
            <div className="flex items-center gap-3">
              <ToggleSwitch enabled={isUnlimited} onClick={() => { setIsUnlimited(!isUnlimited); setStockQty(!isUnlimited ? "Unlimited" : "10"); }} />
              <span className="text-[11px] font-bold text-[#382d24] uppercase tracking-wider">Unlimited Inventory Stock</span>
            </div>

            <button
              type="button"
              onClick={() => setHighlightProduct(!highlightProduct)}
              className="flex items-center gap-3 text-[11px] font-bold text-[#382d24] bg-transparent border-none cursor-pointer p-0 uppercase tracking-wider"
            >
              <span className={`w-5 h-5 border transition-all duration-200 flex items-center justify-center ${
                highlightProduct ? "bg-[#224870] border-[#224870] text-white" : "bg-transparent border-[#382d24]/30 text-transparent"
              }`}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              Featured Showcase Product
            </button>
          </div>

          <div className="border-t border-[#382d24]/10 pt-4 space-y-4">
            <button
              type="button"
              onClick={() => setIsScheduled(!isScheduled)}
              className="flex items-center gap-3 text-[11px] font-bold text-[#382d24] bg-transparent border-none cursor-pointer p-0 uppercase tracking-wider"
            >
              <span className={`w-5 h-5 border transition-all duration-200 flex items-center justify-center ${
                isScheduled ? "bg-[#224870] border-[#224870] text-white" : "bg-transparent border-[#382d24]/30 text-transparent"
              }`}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              Schedule Publishing Live Date
            </button>
            {isScheduled && (
              <input type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] transition-all" />
            )}
          </div>
        </div>

        {/* 4. Product Media */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-7 space-y-5">
          <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest border-b border-[#382d24]/15 pb-4">
            4. Gallery Images
          </h3>

          <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Upload Media Assets</label>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />

          {productImages.length > 0 ? (
            <div className="border border-[#382d24]/15 bg-neutral-50/30 flex items-center justify-center p-6 relative group aspect-video">
              <img src={productImages[0]} alt="Product preview" className="max-h-full max-w-full object-contain" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white hover:bg-neutral-100 border border-neutral-200 text-[#382d24] text-[10px] font-bold px-4 py-2 uppercase cursor-pointer flex items-center gap-1.5 rounded-none">
                  <FolderOpen className="w-4 h-4 text-neutral-500" /> Browse
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white hover:bg-neutral-100 border border-neutral-200 text-[#382d24] text-[10px] font-bold px-4 py-2 uppercase cursor-pointer flex items-center gap-1.5 rounded-none">
                  <RotateCw className="w-4 h-4 text-neutral-500" /> Replace
                </button>
              </div>
            </div>
          ) : (
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#382d24]/20 aspect-video bg-neutral-50/20 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-neutral-400">
              <Upload className="w-9 h-9 text-neutral-300 mb-2 stroke-[1.5]" />
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Drag &amp; drop / click to upload</span>
            </div>
          )}

          {/* Thumbnails */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
            {productImages.map((img, i) => (
              <div key={i} className="border border-[#382d24]/15 aspect-square bg-[#faf8f5] relative p-1.5 flex items-center justify-center">
                <img src={img} alt="Thumbnail" className="max-h-full max-w-full object-contain" />
                <button type="button" onClick={() => setProductImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1.5 -right-1.5 bg-[#b2533e] text-white hover:bg-red-800 w-5 h-5 flex items-center justify-center border-none cursor-pointer shadow-sm">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-[#382d24]/20 hover:border-[#224870] aspect-square flex flex-col items-center justify-center bg-card/25 cursor-pointer transition-colors">
              <Plus className="w-5 h-5 text-neutral-400" />
              <span className="text-[9px] font-bold text-[#615e56] uppercase tracking-wider mt-1.5">Add Image</span>
            </div>
          </div>
        </div>

        {/* 5. Color & Size Customization */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-7 space-y-6">
          <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest border-b border-[#382d24]/15 pb-4">
            5. Color &amp; Size Customization
          </h3>

          {/* Color Checklist + Dynamic Custom Creator */}
          <div className="space-y-4">
            <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Active Color Palette</label>
            <div className="flex flex-wrap gap-3 pb-2">
              {colorPalette.map(color => {
                const isSelected = selectedColors.includes(color.name);
                const isLightColor = ["Ivory", "Camel", "White"].includes(color.name) || color.bg === "#fdfaf3" || color.bg.toLowerCase() === "#ffffff";
                return (
                  <button key={color.name} type="button" 
                    onClick={() => {
                      setSelectedColors(prev => prev.includes(color.name) ? prev.filter(x => x !== color.name) : [...prev, color.name]);
                    }}
                    style={{ backgroundColor: color.bg }}
                    className={`w-10 h-10 border-2 transition-all cursor-pointer flex items-center justify-center rounded-none relative ${
                      isSelected ? "scale-105 border-[#224870] ring-1 ring-[#224870]" : "border-[#382d24]/15 hover:border-neutral-400"
                    }`}
                    title={color.name}>
                    {isSelected && <Check className={`w-5 h-5 ${isLightColor ? "text-[#382d24]" : "text-white"} stroke-[3.5]`} />}
                  </button>
                );
              })}
            </div>

            {/* Custom Color Creator / Color Picker */}
            <div className="bg-[#faf8f5] border border-[#382d24]/15 p-4.5 space-y-3.5 max-w-sm">
              <span className="text-[11px] font-bold text-[#615e56] uppercase tracking-wider block">Create Custom Color Node</span>
              <div className="flex gap-2.5">
                <input 
                  type="text" 
                  value={customColorName} 
                  onChange={e => setCustomColorName(e.target.value)}
                  placeholder="e.g. Sage Green"
                  className="flex-1 bg-[#faf8f5] border border-[#382d24]/20 px-3 py-2 text-xs font-bold uppercase focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" 
                />
                <input 
                  type="color" 
                  value={customColorHex} 
                  onChange={e => setCustomColorHex(e.target.value)} 
                  className="w-10 h-10 border border-[#382d24]/20 cursor-pointer p-0 bg-transparent rounded-none" 
                />
                <button 
                  type="button" 
                  onClick={handleAddCustomColor}
                  className="bg-[#224870] hover:bg-[#224870]/90 text-white text-[9px] font-black uppercase px-4.5 tracking-widest border-none cursor-pointer transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Active Sizes Selection</label>
            <div className="flex bg-[#faf8f5] border border-[#382d24]/20 p-1 max-w-sm">
              {availableSizes.map(size => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSizes(prev => prev.includes(size) ? prev.filter(x => x !== size) : [...prev, size]);
                    }}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase cursor-pointer border-none transition-all ${
                      isSelected ? "bg-[#224870] text-white" : "bg-transparent text-[#615e56] hover:text-[#224870]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matrix table */}
          <div className="space-y-3 border-t border-[#382d24]/10 pt-5">
            <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Variant Customization Pricing Matrix</label>
            <div className="overflow-x-auto">
              <table className="w-full text-left uppercase text-[9.5px] font-bold tracking-wider border border-[#382d24]/15">
                <thead>
                  <tr className="bg-neutral-50 border-b border-[#382d24]/15 text-[#615e56]">
                    <th className="p-3">Variant Node</th>
                    <th className="p-3 w-40">Retail Price Override (₹)</th>
                    <th className="p-3 w-36">Stock Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#382d24]/10">
                  {variantCustomizations.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/40">
                      <td className="p-3 text-[#382d24]">
                        {item.color} / Size {item.size}
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const newPrice = Number(e.target.value);
                            setVariantCustomizations(prev => prev.map((itm, i) => i === idx ? { ...itm, price: newPrice } : itm));
                          }}
                          className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.stock}
                          disabled={isUnlimited}
                          onChange={(e) => {
                            const newStock = Number(e.target.value);
                            setVariantCustomizations(prev => prev.map((itm, i) => i === idx ? { ...itm, stock: newStock } : itm));
                          }}
                          className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24] disabled:opacity-40"
                        />
                      </td>
                    </tr>
                  ))}
                  {variantCustomizations.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-5 text-center text-neutral-400 font-bold tracking-widest">
                        Please select colors and sizes to generate variants list
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 6. Cross-Sell Showcase Recommendations */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-7 space-y-4">
          <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest border-b border-[#382d24]/15 pb-4">
            6. Showcase &amp; Recommendations (Bundle Offers)
          </h3>

          <div className="space-y-3">
            <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">Frequently Bought Together Recommendations</label>
            <div className="flex flex-col gap-2 p-2.5 bg-[#faf8f5] border border-[#382d24]/20 max-h-36 overflow-y-auto">
              {mockCatalogProducts.map(p => {
                const isChecked = relatedProducts.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setRelatedProducts(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase border cursor-pointer flex items-center justify-between transition-all ${
                      isChecked ? "bg-[#224870] border-[#224870] text-white" : "bg-[#faf8f5] border-[#382d24]/10 text-[#615e56] hover:border-neutral-200"
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className={`font-mono text-[9px] ${isChecked ? "text-white/70" : "text-neutral-400"}`}>{p.id}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 7. Search Engine Optimization (SEO - Bottom) */}
        <div className="bg-[#faf8f5] border border-[#382d24]/15 p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-[#382d24]/15 pb-4">
            <h3 className="text-sm font-black text-[#382d24] uppercase tracking-widest">
              7. Search Engine Optimization (SEO Metadata)
            </h3>
            
            <button
              type="button"
              onClick={() => setIsAutoSlug(!isAutoSlug)}
              className="flex items-center gap-2 text-[10px] font-bold text-[#382d24] bg-transparent border-none cursor-pointer p-0 uppercase tracking-wider"
            >
              <span className={`w-4 h-4 border transition-all duration-200 flex items-center justify-center ${
                isAutoSlug ? "bg-[#224870] border-[#224870] text-white" : "bg-transparent border-[#382d24]/30 text-transparent"
              }`}>
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              Auto Slug
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">URL Slug Path</label>
              <input type="text" value={slug} onChange={e => { setSlug(e.target.value); setIsAutoSlug(false); }}
                placeholder="slug-path-format"
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">SEO Title Tag Override</label>
              <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)}
                placeholder="Luxury SEO optimized title"
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#615e56] uppercase tracking-wider block">SEO Description Override</label>
              <textarea rows={2} value={metaDescription} onChange={e => setMetaDescription(e.target.value)}
                placeholder="Google index snippet overview..."
                className="w-full bg-[#faf8f5] border border-[#382d24]/20 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#224870] rounded-none text-[#382d24]" />
            </div>
          </div>
        </div>

      </div>

    </form>
  );
}
