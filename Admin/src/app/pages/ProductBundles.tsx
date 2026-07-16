import { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Boxes,
  Percent,
  Check,
  X,
  ArrowRight,
  Info,
  DollarSign
} from "lucide-react";

const RS = "₹";

interface BundleItem {
  id: number;
  variantId: number;
  productName: string;
  variantName: string;
  price: number;
  imageUrl: string;
}

interface Bundle {
  id: number;
  title: string;
  mainProductVariantId: number;
  mainProductName: string;
  mainVariantName: string;
  mainPrice: number;
  mainImageUrl: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  isActive: boolean;
  items: BundleItem[];
}

// Highly stylized Mock Catalog Data for Admin composing
const MOCK_CATALOG = [
  {
    productId: 101,
    productName: "Drip Oversized Denim Jacket",
    variants: [
      { id: 1001, variantName: "Dark Indigo Wash", price: 3499, imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&h=400&q=80" },
      { id: 1002, variantName: "Acid Bleach Grey", price: 3699, imageUrl: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=400&h=400&q=80" }
    ]
  },
  {
    productId: 102,
    productName: "Syndicate Utility Cargo Pants",
    variants: [
      { id: 2001, variantName: "Olive Drab Green", price: 2499, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&h=400&q=80" },
      { id: 2002, variantName: "Midnight Black", price: 2499, imageUrl: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=400&h=400&q=80" }
    ]
  },
  {
    productId: 103,
    productName: "Classic Heavyweight Graphic Tee",
    variants: [
      { id: 3001, variantName: "Vintage Off-White", price: 1299, imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&h=400&q=80" },
      { id: 3002, variantName: "Carbon Black", price: 1299, imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&h=400&q=80" }
    ]
  },
  {
    productId: 104,
    productName: "Drip Streetwear Chunky Sneakers",
    variants: [
      { id: 4001, variantName: "Triple Chalk White", price: 4999, imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&h=400&q=80" },
      { id: 4002, variantName: "Graffiti Neon", price: 5499, imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&h=400&q=80" }
    ]
  }
];

// Initial mock bundles loaded
const INITIAL_BUNDLES: Bundle[] = [
  {
    id: 1,
    title: "Signature Cargo Matching Fit",
    mainProductVariantId: 1001,
    mainProductName: "Drip Oversized Denim Jacket",
    mainVariantName: "Dark Indigo Wash",
    mainPrice: 3499,
    mainImageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&h=400&q=80",
    discountType: "PERCENTAGE",
    discountValue: 15,
    isActive: true,
    items: [
      {
        id: 11,
        variantId: 2001,
        productName: "Syndicate Utility Cargo Pants",
        variantName: "Olive Drab Green",
        price: 2499,
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&h=400&q=80"
      },
      {
        id: 12,
        variantId: 3001,
        productName: "Classic Heavyweight Graphic Tee",
        variantName: "Vintage Off-White",
        price: 1299,
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&h=400&q=80"
      }
    ]
  }
];

export function ProductBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>(INITIAL_BUNDLES);
  const [showComposer, setShowComposer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Composer Form States
  const [title, setTitle] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FLAT">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(10);
  
  // Selected variant structures in Composer
  const [selectedMainVariantId, setSelectedMainVariantId] = useState<number | "">("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Search input query states
  const [mainSearch, setMainSearch] = useState("");
  const [companionSearch, setCompanionSearch] = useState("");

  // Find variant details helper
  const findVariant = (id: number) => {
    for (const prod of MOCK_CATALOG) {
      const v = prod.variants.find((x) => x.id === id);
      if (v) {
        return {
          productId: prod.productId,
          productName: prod.productName,
          ...v
        };
      }
    }
    return null;
  };

  // Pre-calculated filtered lists for composer selector widgets
  const allCatalogVariants = MOCK_CATALOG.flatMap((p) =>
    p.variants.map((v) => ({
      ...v,
      productId: p.productId,
      productName: p.productName,
      fullName: `${p.productName} ${v.variantName}`
    }))
  );

  const filteredMainVariants = allCatalogVariants.filter((v) =>
    v.fullName.toLowerCase().includes(mainSearch.toLowerCase())
  );

  const filteredCompanionVariants = allCatalogVariants.filter((v) =>
    v.fullName.toLowerCase().includes(companionSearch.toLowerCase())
  );

  // Calculations for composer
  const mainVariantDetail = selectedMainVariantId ? findVariant(selectedMainVariantId as number) : null;
  const itemsDetails = selectedItems.map((id) => findVariant(id)).filter(Boolean);
  
  const originalTotal = (mainVariantDetail?.price || 0) + itemsDetails.reduce((sum, item) => sum + (item?.price || 0), 0);
  
  const bundlePrice = (() => {
    if (discountType === "PERCENTAGE") {
      return Math.round(originalTotal * (1 - discountValue / 100));
    } else {
      return Math.max(0, originalTotal - discountValue);
    }
  })();

  const handleToggleActive = (id: number) => {
    setBundles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const handleDeleteBundle = (id: number) => {
    setBundles((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAddBundleItem = (varId: number) => {
    if (varId === selectedMainVariantId) return; // Cannot bundle main variant with itself
    if (selectedItems.includes(varId)) {
      setSelectedItems((prev) => prev.filter((id) => id !== varId));
    } else {
      if (selectedItems.length >= 3) return; // Maximum bundle count limit
      setSelectedItems((prev) => [...prev, varId]);
    }
  };

  const handleSaveBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedMainVariantId || selectedItems.length === 0) {
      alert("Please complete the bundle details and select at least one item.");
      return;
    }

    const main = findVariant(selectedMainVariantId as number)!;
    const mappedItems: BundleItem[] = selectedItems.map((id, index) => {
      const item = findVariant(id)!;
      return {
        id: Date.now() + index,
        variantId: item.id,
        productName: item.productName,
        variantName: item.variantName,
        price: item.price,
        imageUrl: item.imageUrl
      };
    });

    const newBundle: Bundle = {
      id: Date.now(),
      title: title.trim(),
      mainProductVariantId: main.id,
      mainProductName: main.productName,
      mainVariantName: main.variantName,
      mainPrice: main.price,
      mainImageUrl: main.imageUrl,
      discountType,
      discountValue,
      isActive: true,
      items: mappedItems
    };

    setBundles((prev) => [newBundle, ...prev]);
    
    // Reset Form
    setTitle("");
    setDiscountType("PERCENTAGE");
    setDiscountValue(10);
    setSelectedMainVariantId("");
    setSelectedItems([]);
    setMainSearch("");
    setCompanionSearch("");
    setShowComposer(false);
  };

  const filteredBundles = bundles.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900">Product Bundle Page</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Create promotional matching item capsules (Frequently Bought Together) with locked style configurations.
          </p>
        </div>
        <button
          onClick={() => setShowComposer(!showComposer)}
          className="flex items-center gap-2 bg-[#224870] hover:bg-[#1a3858] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-sm"
        >
          {showComposer ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showComposer ? "Close Creator" : "Create New Bundle"}
        </button>
      </div>

      {showComposer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white border border-neutral-200/80 p-6 rounded-xl shadow-sm animate-in fade-in duration-200">
          
          {/* Main Parameters Configuration Form */}
          <div className="space-y-5 lg:col-span-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-800 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#224870]" />
              Bundle Composer Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Bundle Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vintage Denim Winter Capsule"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#224870] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#224870] focus:bg-white"
                  >
                    <option value="PERCENTAGE">PERCENTAGE (%)</option>
                    <option value="FLAT">FLAT RATE ({RS})</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#224870] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Select Main Item */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                1. Select Main Variant (Offer trigger product variant)
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="🔍 Type to filter main variants..."
                  value={mainSearch}
                  onChange={(e) => setMainSearch(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#224870]"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-neutral-200/60 p-3 rounded-lg bg-neutral-50/50">
                  {filteredMainVariants.length > 0 ? (
                    filteredMainVariants.map((v) => {
                      const isSelected = selectedMainVariantId === v.id;
                      const isUsedInCompanion = selectedItems.includes(v.id);
                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={isUsedInCompanion}
                          onClick={() => {
                            setSelectedMainVariantId(v.id);
                          }}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                            isUsedInCompanion
                              ? "bg-neutral-100 border-neutral-200 opacity-50 cursor-not-allowed"
                              : isSelected
                              ? "bg-[#224870]/5 border-[#224870] ring-1 ring-[#224870]"
                              : "bg-white border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <img
                            src={v.imageUrl}
                            alt={v.variantName}
                            className="w-10 h-10 object-cover rounded-md border border-neutral-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-neutral-900 truncate">{v.productName}</p>
                            <p className="text-[9px] text-neutral-500 truncate">{v.variantName}</p>
                            {isSelected && (
                              <span className="text-[8px] font-extrabold text-[#224870] bg-[#224870]/10 px-1 py-0.5 rounded uppercase mt-0.5 inline-block">
                                Selected Main
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-semibold text-neutral-900 whitespace-nowrap">
                            {RS}{v.price}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center py-6 text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                      No matching products found
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Select Bundle Companion Items */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                2. Add Companion Items (Select up to 3 variants to pack with main item)
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="🔍 Type to filter companion items..."
                  value={companionSearch}
                  onChange={(e) => setCompanionSearch(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#224870]"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-neutral-200/60 p-3 rounded-lg bg-neutral-50/50">
                  {filteredCompanionVariants.length > 0 ? (
                    filteredCompanionVariants.map((v) => {
                      const isMain = v.id === selectedMainVariantId;
                      const isSelected = selectedItems.includes(v.id);
                      return (
                        <button
                          key={v.id}
                          type="button"
                          disabled={isMain}
                          onClick={() => handleAddBundleItem(v.id)}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                            isMain
                              ? "bg-neutral-100 border-neutral-200 opacity-50 cursor-not-allowed"
                              : isSelected
                              ? "bg-[#224870]/5 border-[#224870] ring-1 ring-[#224870]"
                              : "bg-white border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <img
                            src={v.imageUrl}
                            alt={v.variantName}
                            className="w-10 h-10 object-cover rounded-md border border-neutral-200"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-neutral-900 truncate">{v.productName}</p>
                            <p className="text-[9px] text-neutral-500 truncate">{v.variantName}</p>
                          </div>
                          <span className="text-[10px] font-semibold text-neutral-900 whitespace-nowrap">
                            {RS}{v.price}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center py-6 text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                      No matching products found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Storefront Mock Preview Card */}
          <div className="bg-[#FAF8F5] border border-neutral-200/80 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-inner">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-bold tracking-widest text-[#224870] bg-[#224870]/10 px-2 py-0.5 rounded uppercase">
                  Live Preview
                </span>
                <span className="text-[9px] text-neutral-400">Storefront View</span>
              </div>
              <h4 className="text-xs font-bold text-neutral-800 tracking-wide mb-4">
                {title || "Bundle Title Placeholder"}
              </h4>

              {/* Mockup matching product page card */}
              <div className="space-y-3">
                {mainVariantDetail && (
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#224870]/20">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={mainVariantDetail.imageUrl}
                        className="w-10 h-10 object-cover rounded border border-neutral-100"
                      />
                      <div>
                        <p className="text-[10px] font-black text-neutral-900">{mainVariantDetail.productName}</p>
                        <span className="text-[9px] font-bold text-[#224870]">Locked Style: {mainVariantDetail.variantName}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-800">{RS}{mainVariantDetail.price}</span>
                  </div>
                )}

                {itemsDetails.length > 0 ? (
                  itemsDetails.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-neutral-200">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item?.imageUrl}
                          className="w-10 h-10 object-cover rounded border border-neutral-100"
                        />
                        <div>
                          <p className="text-[10px] font-black text-neutral-900">{item?.productName}</p>
                          <span className="text-[9px] text-neutral-500">Locked Style: {item?.variantName}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-800">{RS}{item?.price}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 border border-dashed border-neutral-300 rounded-lg text-neutral-400">
                    <Plus className="w-5 h-5 mb-1 text-neutral-300 animate-bounce" />
                    <span className="text-[9px] uppercase tracking-wider font-bold">Add companion items</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Original Total</p>
                  <p className="text-xs font-semibold text-neutral-500 line-through">{RS}{originalTotal}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#224870]">Bundle Offer Price</p>
                  <p className="text-base font-black text-neutral-900">{RS}{bundlePrice}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveBundle}
                disabled={!title.trim() || !selectedMainVariantId || selectedItems.length === 0}
                className="w-full bg-[#224870] hover:bg-[#1a3858] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Publish Product Bundle
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Existing Bundles List Table */}
      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-800 flex items-center gap-2">
            <Boxes className="w-4.5 h-4.5 text-[#224870]" />
            Active Product Bundles
          </h2>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search bundles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#224870] focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold text-neutral-800">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-150 text-[10px] font-bold tracking-widest text-neutral-400 uppercase whitespace-nowrap">
                <th className="py-4 px-6">BUNDLE DETAILS</th>
                <th className="py-4 px-6">MAIN TRIGGER ITEM</th>
                <th className="py-4 px-6">COMPANION ITEMS</th>
                <th className="py-4 px-6 text-center">DISCOUNT</th>
                <th className="py-4 px-6 text-right">PRICING VALUE</th>
                <th className="py-4 px-6 text-center">STATUS</th>
                <th className="py-4 px-6 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredBundles.length > 0 ? (
                filteredBundles.map((b) => {
                  const itemsPriceSum = b.items.reduce((sum, item) => sum + item.price, 0);
                  const totalOrig = b.mainPrice + itemsPriceSum;
                  const finalBPrice = b.discountType === "PERCENTAGE" 
                    ? Math.round(totalOrig * (1 - b.discountValue / 100))
                    : Math.max(0, totalOrig - b.discountValue);

                  return (
                    <tr key={b.id} className="hover:bg-neutral-50/50">
                      
                      {/* Bundle title */}
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-neutral-900 text-xs">{b.title}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">Bundle ID: #{b.id}</p>
                        </div>
                      </td>

                      {/* Main Variant */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <img
                            src={b.mainImageUrl}
                            alt={b.mainVariantName}
                            className="w-9 h-9 object-cover rounded border border-neutral-100"
                          />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-neutral-900 truncate">{b.mainProductName}</p>
                            <p className="text-[9px] text-[#224870] truncate">{b.mainVariantName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Companion Items thumbnails list */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 max-w-sm overflow-hidden">
                          {b.items.map((item) => (
                            <div key={item.id} className="relative group shrink-0">
                              <img
                                src={item.imageUrl}
                                alt={item.variantName}
                                className="w-8 h-8 object-cover rounded border border-neutral-100"
                              />
                            </div>
                          ))}
                          <span className="text-[10px] text-neutral-400 font-bold ml-1">
                            (+{b.items.length} items)
                          </span>
                        </div>
                      </td>

                      {/* Discount type / value */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                          b.discountType === "PERCENTAGE" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-150" 
                            : "bg-[#224870]/10 text-[#224870] border border-[#224870]/20"
                        }`}>
                          {b.discountType === "PERCENTAGE" ? <Percent className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                          {b.discountValue} {b.discountType === "PERCENTAGE" ? "% Off" : "Flat Off"}
                        </span>
                      </td>

                      {/* Value pricing comparison */}
                      <td className="py-4 px-6 text-right">
                        <div>
                          <p className="font-extrabold text-neutral-900">{RS}{finalBPrice.toLocaleString()}</p>
                          <p className="text-[10px] text-neutral-400 line-through mt-0.5">{RS}{totalOrig.toLocaleString()}</p>
                        </div>
                      </td>

                      {/* Active Status toggle */}
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(b.id)}
                          className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                            b.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-neutral-100 text-neutral-400 border-neutral-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${b.isActive ? "bg-emerald-500 animate-pulse" : "bg-neutral-300"}`} />
                          {b.isActive ? "ACTIVE" : "INACTIVE"}
                        </button>
                      </td>

                      {/* Delete actions */}
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteBundle(b.id)}
                          className="text-neutral-400 hover:text-red-600 p-1.5 rounded transition-all inline-flex items-center"
                          title="Delete Bundle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 font-semibold uppercase tracking-wider">
                    <Boxes className="w-8 h-8 mx-auto mb-2 text-neutral-300 animate-pulse" />
                    No Product Bundles Configured
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
