import { useState } from "react";
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
  Sparkles
} from "lucide-react";

const RS = "\u20B9";

const availableColors = [
  { name: "Black", bg: "bg-[#030213]", label: "Black" },
  { name: "Camel", bg: "bg-[#c49a6c]", label: "Camel" },
  { name: "Ivory", bg: "bg-[#fffff0]", label: "Ivory" },
  { name: "Olive", bg: "bg-[#556b2f]", label: "Olive" },
  { name: "Blush", bg: "bg-[#de5d83]", label: "Blush" },
  { name: "Navy", bg: "bg-[#000080]", label: "Navy" },
  { name: "Charcoal", bg: "bg-[#36454f]", label: "Charcoal" },
  { name: "Burgundy", bg: "bg-[#800020]", label: "Burgundy" },
];

const categories = ["Outerwear", "Knitwear", "Tops", "Bottoms", "Accessories", "Signature", "Archive", "New Arrivals"];
const brands = ["Drip Doggy", "Syndicate", "Archive", "SS26", "FW25 Heritage", "Studio"];
const tags = ["New Arrival", "Limited Drop", "Best Seller", "Archive", "Signature Piece", "Seasonal", "Premium"];

export function AddProductPage() {
  const [productName, setProductName] = useState("Structured Canvas Jacket");
  const [description, setDescription] = useState(
    "A masterfully constructed canvas jacket built for the modern wardrobe. Features premium cotton-canvas shell, genuine horn buttons, contrast stitching, and an tailored yet relaxed silhouette. The interior is lined with our signature stripe jacquard. A Drip Doggy essential."
  );
  const [price, setPrice] = useState("12999");
  const [discountPrice, setDiscountPrice] = useState("");
  const [taxIncluded, setTaxIncluded] = useState("yes");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stockQty, setStockQty] = useState("45");
  const [stockStatus, setStockStatus] = useState("In Stock");
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [highlightProduct, setHighlightProduct] = useState(true);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedCategory, setSelectedCategory] = useState("Outerwear");
  const [selectedBrand, setSelectedBrand] = useState("Drip Doggy");
  const [selectedTag, setSelectedTag] = useState("Best Seller");
  const [sku, setSku] = useState("DD-STR-001");

  const [productImages, setProductImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=300&auto=format&fit=crop"
  ]);

  const handleRemoveImage = (index: number) => {
    setProductImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`"${productName}" (${sku}) has been published successfully!`);
  };

  const discount = Number(price) - Number(discountPrice);

  return (
    <form onSubmit={handlePublish} className="space-y-6 font-sans text-neutral-800">

      {/* ── Header Actions ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">
            Add New Product
          </h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy product catalog — add new item
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-white border border-neutral-200/80 pl-3 pr-8 py-2 text-[9px] font-extrabold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-400 w-48"
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" />
          </div>
          <button
            type="submit"
            className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase transition-colors cursor-pointer rounded-none border-none flex items-center gap-1.5"
          >
            Publish Product
          </button>
          <button
            type="button"
            className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </button>
        </div>
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── Left Column: Forms ────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-6">

          {/* ── Basic Details ─────────────────────────────────────── */}
          <div className="bg-white border border-neutral-200/60 p-6 space-y-4">
            <h3 className="text-[10px] font-black text-[#030213] uppercase tracking-widest border-b border-neutral-100 pb-3">
              Basic Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Product Name</label>
                <input type="text" required value={productName} onChange={e => setProductName(e.target.value)}
                  placeholder="Product name"
                  className="w-full bg-[#faf8f5]/60 border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">SKU</label>
                <input type="text" required value={sku} onChange={e => setSku(e.target.value)}
                  placeholder="DD-XXX-001"
                  className="w-full bg-[#faf8f5]/60 border border-neutral-200 px-3 py-2 text-[9px] font-bold font-mono focus:outline-none focus:border-[#030213]" />
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Description</label>
              <div className="relative">
                <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Product description"
                  className="w-full bg-[#faf8f5]/60 border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] leading-relaxed pb-10" />
                <div className="absolute bottom-2.5 right-3 flex items-center gap-2 text-neutral-400">
                  <button type="button" className="hover:text-[#030213] p-1 bg-transparent border-none cursor-pointer" title="Edit text">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="hover:text-[#030213] p-1 bg-transparent border-none cursor-pointer" title="Rewrite with AI">
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Pricing ────────────────────────────────────────────── */}
          <div className="bg-white border border-neutral-200/60 p-6 space-y-4">
            <h3 className="text-[10px] font-black text-[#030213] uppercase tracking-widest border-b border-neutral-100 pb-3">
              Pricing
            </h3>

            <div className="space-y-1">
              <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Price (₹)</label>
              <div className="relative">
                <input type="text" required value={price} onChange={e => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#faf8f5]/60 border border-neutral-200 pl-8 pr-3 py-2.5 text-[9px] font-bold focus:outline-none focus:border-[#030213]" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-neutral-500">{RS}</div>
                <div className="absolute right-0 top-0 bottom-0 px-3 flex items-center border-l border-neutral-200 bg-neutral-50/50 gap-1 cursor-pointer">
                  <span className="text-[9px] font-bold text-neutral-600">INR</span>
                  <ChevronDown className="w-3 h-3 text-neutral-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Discounted Price</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-[9px] font-black text-neutral-500">{RS}</div>
                  <input type="text" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#faf8f5]/60 border border-neutral-200 pl-8 pr-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213]" />
                  {discountPrice && Number(discountPrice) > 0 && (
                    <div className="absolute right-3 text-[8px] font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                      Save {RS}{discount.toLocaleString("en-IN")}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Tax Included</label>
                <div className="flex gap-4 py-2">
                  <label className="flex items-center gap-2 text-[9px] font-bold cursor-pointer">
                    <input type="radio" name="tax" value="yes" checked={taxIncluded === "yes"}
                      onChange={() => setTaxIncluded("yes")} className="accent-[#030213] h-3.5 w-3.5" />
                    Yes (GST)
                  </label>
                  <label className="flex items-center gap-2 text-[9px] font-bold cursor-pointer">
                    <input type="radio" name="tax" value="no" checked={taxIncluded === "no"}
                      onChange={() => setTaxIncluded("no")} className="accent-[#030213] h-3.5 w-3.5" />
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Sale Period</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input type="text" placeholder="Start date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    onFocus={e => (e.target.type = "date")} onBlur={e => (e.target.type = "text")}
                    className="w-full bg-[#faf8f5]/60 border border-neutral-200 pl-3 pr-8 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213]" />
                  <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <input type="text" placeholder="End date" value={endDate} onChange={e => setEndDate(e.target.value)}
                    onFocus={e => (e.target.type = "date")} onBlur={e => (e.target.type = "text")}
                    className="w-full bg-[#faf8f5]/60 border border-neutral-200 pl-3 pr-8 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213]" />
                  <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Inventory ──────────────────────────────────────────── */}
          <div className="bg-white border border-neutral-200/60 p-6 space-y-4">
            <h3 className="text-[10px] font-black text-[#030213] uppercase tracking-widest border-b border-neutral-100 pb-3">
              Inventory
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Stock Quantity</label>
                <input type="text" required value={stockQty} onChange={e => setStockQty(e.target.value)}
                  disabled={isUnlimited}
                  className="w-full bg-[#faf8f5]/60 border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] disabled:opacity-60" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Stock Status</label>
                <div className="relative">
                  <select value={stockStatus} onChange={e => setStockStatus(e.target.value)}
                    className="w-full bg-[#faf8f5]/60 border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] appearance-none">
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Backorder">Backorder</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <button type="button"
                  onClick={() => { setIsUnlimited(!isUnlimited); setStockQty(!isUnlimited ? "Unlimited" : "10"); }}
                  className={`w-10 h-5 transition-all relative cursor-pointer border ${
                    isUnlimited ? "bg-[#030213] border-[#030213]" : "bg-neutral-200 border-neutral-300"
                  }`}>
                  <span className={`w-4 h-4 bg-white absolute top-0.5 transition-all ${isUnlimited ? "right-0.5" : "left-0.5"}`} />
                </button>
                <span className="text-[9px] font-bold text-neutral-700">Unlimited Stock</span>
              </div>
              <label className="flex items-center gap-2 text-[9px] font-bold text-neutral-700 cursor-pointer">
                <input type="checkbox" checked={highlightProduct} onChange={e => setHighlightProduct(e.target.checked)}
                  className="accent-[#030213] h-3.5 w-3.5" />
                Feature this product
              </label>
            </div>
          </div>

          {/* ── Bottom Actions ──────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button"
              className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 text-[9px] font-extrabold tracking-widest px-6 py-2.5 uppercase cursor-pointer flex items-center gap-1.5">
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button type="submit"
              className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-extrabold tracking-widest px-6 py-2.5 uppercase transition-colors cursor-pointer border-none">
              Publish Product
            </button>
          </div>

        </div>

        {/* ── Right Column: Media & Taxonomies ─────────────────────────── */}
        <div className="lg:col-span-5 space-y-6">

          {/* ── Product Images ─────────────────────────────────────── */}
          <div className="bg-white border border-neutral-200/60 p-6 space-y-4">
            <h3 className="text-[10px] font-black text-[#030213] uppercase tracking-widest border-b border-neutral-100 pb-3">
              Product Images
            </h3>

            <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase block mb-1">Main Image</label>

            {productImages.length > 0 ? (
              <div className="border border-neutral-200/80 aspect-[4/3] bg-[#faf8f5]/40 flex items-center justify-center p-8 relative group">
                <img src={productImages[0]} alt="Product preview" className="max-h-full max-w-full object-contain" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button type="button" className="bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 text-[9px] font-bold px-3 py-1.5 uppercase cursor-pointer flex items-center gap-1">
                    <FolderOpen className="w-3.5 h-3.5 text-neutral-500" />
                    Browse
                  </button>
                  <button type="button" className="bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 text-[9px] font-bold px-3 py-1.5 uppercase cursor-pointer flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5 text-neutral-500" />
                    Replace
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-neutral-200 aspect-[4/3] bg-[#faf8f5]/30 flex flex-col items-center justify-center p-6 text-center">
                <Upload className="w-8 h-8 text-neutral-300 mb-2 stroke-[1.5]" />
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Drag &amp; drop</span>
                <span className="text-[7px] text-neutral-400 uppercase tracking-widest mt-1">or click to browse</span>
              </div>
            )}

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {productImages.map((img, i) => (
                <div key={i} className="border border-neutral-200 aspect-square bg-[#faf8f5]/30 relative p-1.5 flex items-center justify-center">
                  <img src={img} alt="Thumbnail" className="max-h-full max-w-full object-contain" />
                  <button type="button" onClick={() => handleRemoveImage(i)}
                    className="absolute -top-1.5 -right-1.5 bg-[#030213] text-white hover:bg-red-600 w-4 h-4 flex items-center justify-center border-none cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div className="border border-dashed border-neutral-300 hover:border-neutral-500 aspect-square flex flex-col items-center justify-center bg-[#faf8f5]/20 cursor-pointer transition-colors">
                <Plus className="w-4 h-4 text-neutral-400" />
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider mt-1">Add</span>
              </div>
            </div>
          </div>

          {/* ── Organization ────────────────────────────────────────── */}
          <div className="bg-white border border-neutral-200/60 p-6 space-y-4">
            <h3 className="text-[10px] font-black text-[#030213] uppercase tracking-widest border-b border-neutral-100 pb-3">
              Organization
            </h3>

            <div className="space-y-1">
              <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Category</label>
              <div className="relative">
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#faf8f5]/60 border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] appearance-none">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Brand / Collection</label>
              <div className="relative">
                <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full bg-[#faf8f5]/60 border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] appearance-none">
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black tracking-wider text-neutral-500 uppercase">Tag</label>
              <div className="relative">
                <select value={selectedTag} onChange={e => setSelectedTag(e.target.value)}
                  className="w-full bg-[#faf8f5]/60 border border-neutral-200 px-3 py-2 text-[9px] font-bold focus:outline-none focus:border-[#030213] appearance-none">
                  {tags.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ── Color Variants ─────────────────────────────────────── */}
          <div className="bg-white border border-neutral-200/60 p-6 space-y-4">
            <h3 className="text-[10px] font-black text-[#030213] uppercase tracking-widest border-b border-neutral-100 pb-3">
              Color Variants
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {availableColors.map(color => {
                const isSelected = selectedColor === color.name;
                const isLight = ["Ivory", "Camel"].includes(color.name);
                return (
                  <button key={color.name} type="button" onClick={() => setSelectedColor(color.name)}
                    className={`w-9 h-9 ${color.bg} border-2 transition-all cursor-pointer flex items-center justify-center ${
                      isSelected ? "border-[#030213] scale-105" : "border-transparent hover:border-neutral-400"
                    }`}
                    title={color.name}>
                    {isSelected && <Check className={`w-4 h-4 ${isLight || color.name === "Camel" ? "text-[#030213]" : "text-white"} stroke-[3.5]`} />}
                  </button>
                );
              })}
            </div>
            <p className="text-[8px] text-neutral-400 font-bold mt-2">Selected: {selectedColor}</p>
          </div>

        </div>

      </div>

    </form>
  );
}
