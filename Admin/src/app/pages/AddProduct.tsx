import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
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
  ArrowLeft
} from "lucide-react";

const RS = "₹";

const availableColors = [
  { name: "Black", bg: "bg-[#030213]" },
  { name: "Camel", bg: "bg-[#c49a6c]" },
  { name: "Ivory", bg: "bg-[#fffff0]" },
  { name: "Olive", bg: "bg-[#556b2f]" },
  { name: "Blush", bg: "bg-[#de5d83]" },
  { name: "Navy", bg: "bg-[#000080]" },
  { name: "Charcoal", bg: "bg-[#36454f]" },
  { name: "Burgundy", bg: "bg-[#800020]" },
];

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

interface VariantItem {
  color: string;
  size: string;
  price: number;
  stock: number;
}

export function AddProductPage() {
  const navigate = useNavigate();
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

  // Variants
  const [selectedColors, setSelectedColors] = useState<string[]>(["Black"]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["M", "L"]);
  const [variantCustomizations, setVariantCustomizations] = useState<VariantItem[]>([]);

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

  // Load draft on mount
  useEffect(() => {
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
  }, []);

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

  // Save draft manually or auto-save helper
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

  // Publish validation and handler
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
    alert(`"${productName}" (${sku}) has been successfully published!`);
    navigate("/admin/products");
  };

  const discount = Number(price) - Number(discountPrice);

  return (
    <form onSubmit={handlePublish} className="space-y-6 font-sans text-[#030213]">

      {/* ── Header Actions ─────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <button type="button" onClick={() => navigate("/admin/products")} className="text-[8px] font-bold uppercase text-neutral-400 hover:text-[#030213] tracking-widest flex items-center gap-1 bg-transparent border-none cursor-pointer mb-1.5">
            <ArrowLeft className="w-3 h-3" /> Back to Catalog
          </button>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">
            Add New Product
          </h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy product creation interface
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {feedbackMsg && (
            <span className="text-[8px] bg-green-50 border border-green-200 text-green-700 px-3 py-2 font-bold uppercase tracking-wider">
              {feedbackMsg}
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="bg-card border border-neutral-200 hover:border-[#030213] text-neutral-600 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase transition-all cursor-pointer flex items-center gap-1.5 rounded-none"
          >
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </button>
          <button
            type="submit"
            className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase transition-colors cursor-pointer rounded-none border-none flex items-center gap-1.5"
          >
            Publish Product
          </button>
        </div>
      </div>

      {/* ── Validation Alerts ─────────────────────────────────────── */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-none">
          <h4 className="text-[9px] font-bold text-red-800 uppercase tracking-widest mb-1.5">Please address the following requirements:</h4>
          <ul className="list-disc pl-4 text-[8px] font-bold text-red-700 uppercase tracking-wider space-y-1">
            {validationErrors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* ── Main Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── Left Column: Forms ────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-6">

          {/* ── Basic Details ─────────────────────────────────────── */}
          <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-widest border-b border-neutral-200/60 pb-3">
              Basic Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Product Name</label>
                <input type="text" value={productName} onChange={e => setProductName(e.target.value)}
                  placeholder="Product name"
                  className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">SKU Code</label>
                <input type="text" value={sku} onChange={e => setSku(e.target.value)}
                  placeholder="DD-XXX-001"
                  className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold font-mono focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
            </div>

            <div className="space-y-1 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Description</label>
                <button type="button" onClick={handleAICopywrite} className="text-[#b2533e] hover:text-[#030213] text-[7px] font-semibold uppercase tracking-widest flex items-center gap-1 bg-transparent border-none cursor-pointer">
                  <Sparkles className="w-2.5 h-2.5 animate-pulse" /> AI Assisting Description
                </button>
              </div>
              <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Product description details..."
                className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] leading-relaxed rounded-none" />
            </div>
          </div>

          {/* ── Pricing ────────────────────────────────────────────── */}
          <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-widest border-b border-neutral-200/60 pb-3">
              Pricing Details
            </h3>

            <div className="space-y-1">
              <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Base Retail Price (₹)</label>
              <div className="relative">
                <input type="text" value={price} onChange={e => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-card border border-neutral-200 pl-8 pr-3 py-2.5 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-neutral-500">{RS}</div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-neutral-400">INR</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Discounted Price (₹)</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-[9px] font-bold text-neutral-500">{RS}</div>
                  <input type="text" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)}
                    placeholder="0"
                    className="w-full bg-card border border-neutral-200 pl-8 pr-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
                  {discountPrice && Number(discountPrice) > 0 && (
                    <div className="absolute right-3 text-[7px] font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                      -{Math.round((discount / Number(price)) * 100)}% (Save {RS}{discount.toLocaleString("en-IN")})
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">GST Rate Structure</label>
                <div className="flex gap-4 py-2">
                  <label className="flex items-center gap-2 text-[9px] font-bold cursor-pointer">
                    <input type="radio" name="tax" value="yes" checked={taxIncluded === "yes"}
                      onChange={() => setTaxIncluded("yes")} className="accent-[#030213] h-3.5 w-3.5" />
                    GST (12% Apparel Standard)
                  </label>
                  <label className="flex items-center gap-2 text-[9px] font-bold cursor-pointer">
                    <input type="radio" name="tax" value="no" checked={taxIncluded === "no"}
                      onChange={() => setTaxIncluded("no")} className="accent-[#030213] h-3.5 w-3.5" />
                    Tax Exempt / Zero Rate
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Sale Period Dates (Optional)</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
                <div className="relative">
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Variant Customizations ─────────────────────────────────── */}
          <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-widest border-b border-neutral-200/60 pb-3">
              Size &amp; Price Customization Matrix
            </h3>
            <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">
              Define custom pricing or custom stock overrides per variant below.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left uppercase text-[8px] font-bold tracking-widest border border-neutral-200/60">
                <thead>
                  <tr className="bg-neutral-100/60 border-b border-neutral-200">
                    <th className="p-2">Variant</th>
                    <th className="p-2 w-32">Price Override (₹)</th>
                    <th className="p-2 w-28">Stock Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/60">
                  {variantCustomizations.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/50">
                      <td className="p-2 text-neutral-700">
                        {item.color} / Size {item.size}
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const newPrice = Number(e.target.value);
                            setVariantCustomizations(prev => prev.map((itm, i) => i === idx ? { ...itm, price: newPrice } : itm));
                          }}
                          className="w-full bg-card border border-neutral-200 p-1 text-[8px] font-semibold focus:outline-none focus:border-[#030213] rounded-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.stock}
                          disabled={isUnlimited}
                          onChange={(e) => {
                            const newStock = Number(e.target.value);
                            setVariantCustomizations(prev => prev.map((itm, i) => i === idx ? { ...itm, stock: newStock } : itm));
                          }}
                          className="w-full bg-card border border-neutral-200 p-1 text-[8px] font-semibold focus:outline-none focus:border-[#030213] rounded-none disabled:opacity-40"
                        />
                      </td>
                    </tr>
                  ))}
                  {variantCustomizations.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-neutral-400 font-bold">
                        Please select colors and sizes to generate variants.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── SEO Metadata ─────────────────────────────────────────── */}
          <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
              <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-widest">
                Search Engine Optimization
              </h3>
              <label className="flex items-center gap-1.5 text-[8px] font-bold text-neutral-400 uppercase cursor-pointer">
                <input type="checkbox" checked={isAutoSlug} onChange={e => setIsAutoSlug(e.target.checked)} className="accent-[#030213]" />
                Auto Slug
              </label>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">URL Slug Path</label>
                <input type="text" value={slug} onChange={e => { setSlug(e.target.value); setIsAutoSlug(false); }}
                  placeholder="structured-canvas-jacket"
                  className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold font-mono focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Meta Title</label>
                <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)}
                  placeholder={productName + " | Drip Doggy Streetwear"}
                  className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Meta Description</label>
                <textarea rows={2} value={metaDescription} onChange={e => setMetaDescription(e.target.value)}
                  placeholder={description.slice(0, 100) + "..."}
                  className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Column: Media & Taxonomies ─────────────────────────── */}
        <div className="lg:col-span-5 space-y-6">

          {/* ── Inventory & Visibility ─────────────────────────────────── */}
          <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-widest border-b border-neutral-200/60 pb-3">
              Stock &amp; Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Total Stock</label>
                <input type="text" value={stockQty} onChange={e => setStockQty(e.target.value)}
                  disabled={isUnlimited}
                  className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none disabled:opacity-50" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Stock Status</label>
                <select value={stockStatus} onChange={e => setStockStatus(e.target.value)}
                  className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none cursor-pointer">
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Backorder">Backorder</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <button type="button"
                  onClick={() => { setIsUnlimited(!isUnlimited); setStockQty(!isUnlimited ? "Unlimited" : "10"); }}
                  className={`w-10 h-5 transition-all relative cursor-pointer border rounded-full p-0 shrink-0 ${
                    isUnlimited ? "bg-[#030213] border-[#030213]" : "bg-neutral-200 border-neutral-300"
                  }`}>
                  <span className={`w-4 h-4 bg-card absolute top-0.5 transition-all rounded-full ${isUnlimited ? "right-0.5" : "left-0.5"}`} />
                </button>
                <span className="text-[9px] font-bold text-neutral-700 uppercase">Unlimited Stock</span>
              </div>
              <label className="flex items-center gap-2 text-[9px] font-bold text-neutral-700 cursor-pointer">
                <input type="checkbox" checked={highlightProduct} onChange={e => setHighlightProduct(e.target.checked)}
                  className="accent-[#030213] h-3.5 w-3.5 rounded-none" />
                Feature Product
              </label>
            </div>

            <div className="border-t border-neutral-200/60 pt-4 space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-bold text-neutral-700 cursor-pointer">
                <input type="checkbox" checked={isScheduled} onChange={e => setIsScheduled(e.target.checked)} className="accent-[#030213] h-3.5 w-3.5 rounded-none" />
                Schedule Publishing
              </label>
              {isScheduled && (
                <input type="datetime-local" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}
                  className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none" />
              )}
            </div>
          </div>

          {/* ── Product Images ─────────────────────────────────────── */}
          <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-widest border-b border-neutral-200/60 pb-3">
              Product Images
            </h3>

            <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase block mb-1">Upload Media</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />

            {productImages.length > 0 ? (
              <div className="border border-neutral-200 bg-card flex items-center justify-center p-6 relative group aspect-video">
                <img src={productImages[0]} alt="Product preview" className="max-h-full max-w-full object-contain" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-card hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-[8px] font-bold px-3 py-1.5 uppercase cursor-pointer flex items-center gap-1 rounded-none">
                    <FolderOpen className="w-3.5 h-3.5 text-neutral-500" /> Browse
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-card hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-[8px] font-bold px-3 py-1.5 uppercase cursor-pointer flex items-center gap-1 rounded-none">
                    <RotateCw className="w-3.5 h-3.5 text-neutral-500" /> Replace
                  </button>
                </div>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-neutral-200 aspect-video bg-card flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-neutral-400">
                <Upload className="w-8 h-8 text-neutral-300 mb-2 stroke-[1.5]" />
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Drag &amp; drop / click to upload</span>
              </div>
            )}

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {productImages.map((img, i) => (
                <div key={i} className="border border-neutral-200 aspect-square bg-card relative p-1.5 flex items-center justify-center">
                  <img src={img} alt="Thumbnail" className="max-h-full max-w-full object-contain" />
                  <button type="button" onClick={() => setProductImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 bg-[#030213] text-white hover:bg-[#b2533e] w-4 h-4 flex items-center justify-center border-none cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-neutral-300 hover:border-neutral-500 aspect-square flex flex-col items-center justify-center bg-card/20 cursor-pointer transition-colors">
                <Plus className="w-4 h-4 text-neutral-400" />
                <span className="text-[7px] font-bold text-neutral-500 uppercase tracking-wider mt-1">Add</span>
              </div>
            </div>
          </div>

          {/* ── Organization ────────────────────────────────────────── */}
          <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-widest border-b border-neutral-200/60 pb-3">
              Catalog Organization
            </h3>

            <div className="space-y-1">
              <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Category</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none cursor-pointer">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Brand Collection</label>
              <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}
                className="w-full bg-card border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] rounded-none cursor-pointer">
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Tags Selection (Multiple)</label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-card border border-neutral-200 max-h-24 overflow-y-auto">
                {tags.map(t => {
                  const isChecked = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
                      }}
                      className={`px-2 py-1 text-[7px] font-semibold uppercase border cursor-pointer ${isChecked ? "bg-[#030213] border-[#030213] text-white" : "bg-card border-neutral-200 text-neutral-500 hover:border-neutral-400"}`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Color Variants ─────────────────────────────────────── */}
          <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-widest border-b border-neutral-200/60 pb-3">
              Color Variants (Multiple)
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              {availableColors.map(color => {
                const isSelected = selectedColors.includes(color.name);
                const isLight = ["Ivory", "Camel"].includes(color.name);
                return (
                  <button key={color.name} type="button" 
                    onClick={() => {
                      setSelectedColors(prev => prev.includes(color.name) ? prev.filter(x => x !== color.name) : [...prev, color.name]);
                    }}
                    className={`w-9 h-9 ${color.bg} border-2 transition-all cursor-pointer flex items-center justify-center rounded-none ${
                      isSelected ? "border-[#030213] scale-105" : "border-neutral-200 hover:border-neutral-400"
                    }`}
                    title={color.name}>
                    {isSelected && <Check className={`w-4 h-4 ${isLight || color.name === "Camel" ? "text-[#030213]" : "text-white"} stroke-[3.5]`} />}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-[8px] font-bold tracking-wider text-neutral-500 uppercase mb-1">Select Active Sizes</label>
              <div className="flex bg-card border border-neutral-200 p-1">
                {availableSizes.map(size => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSizes(prev => prev.includes(size) ? prev.filter(x => x !== size) : [...prev, size]);
                      }}
                      className={`flex-1 py-1.5 text-[8px] font-bold uppercase cursor-pointer border-none ${
                        isSelected ? "bg-[#030213] text-white" : "bg-transparent text-neutral-400 hover:text-[#030213]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Cross-Sells ─────────────────────────────────────────── */}
          <div className="bg-card border border-neutral-200/80 p-6 space-y-4">
            <h3 className="text-[10px] font-bold text-[#030213] uppercase tracking-widest border-b border-neutral-200/60 pb-3">
              Cross-Sell &amp; Recommendations
            </h3>

            <div className="space-y-1">
              <label className="text-[8px] font-bold tracking-wider text-neutral-500 uppercase">Related Showcase Items</label>
              <div className="flex flex-col gap-1.5 p-2 bg-card border border-neutral-200 max-h-32 overflow-y-auto">
                {mockCatalogProducts.map(p => {
                  const isChecked = relatedProducts.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setRelatedProducts(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]);
                      }}
                      className={`w-full text-left px-2 py-1.5 text-[8px] font-semibold uppercase border cursor-pointer flex items-center justify-between ${isChecked ? "bg-[#030213] border-[#030213] text-white" : "bg-card border-neutral-100 text-neutral-500 hover:border-neutral-200"}`}
                    >
                      <span>{p.name}</span>
                      <span className="font-mono text-[7px] text-neutral-400">{p.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>

    </form>
  );
}
