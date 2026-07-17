import { useState, useEffect } from "react";
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
import { useAuthStore } from "@/app/store/auth-store";
import { bundleApi } from "../lib/bundle-api";
import { productApi } from "../lib/product-api";

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
  mainProductName?: string;
  mainVariantName?: string;
  mainPrice?: number;
  mainImageUrl?: string;
  discountType: "PERCENTAGE" | "FLAT" | "FREE_SHIPPING";
  discountValue: number;
  isActive: boolean;
  variants?: any[];
  items?: BundleItem[];
}

export function ProductBundlesPage() {
  const { token } = useAuthStore();
  const [catalog, setCatalog] = useState<any[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Composer Form States
  const [title, setTitle] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FLAT" | "FREE_SHIPPING">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(10);
  
  // Selected variant structures in Composer
  const [selectedMainVariantId, setSelectedMainVariantId] = useState<number | "">("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Search input query states
  const [mainSearch, setMainSearch] = useState("");
  const [companionSearch, setCompanionSearch] = useState("");

  // Fetch bundles and products from API
  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const fetchedProducts = await productApi.fetchAllProducts(token);
      const mappedCatalog = fetchedProducts.map((p) => ({
        productId: p.id,
        productName: p.productName,
        variants: (p.variants || []).map((v) => ({
          id: v.id,
          variantName: v.variantName,
          price: v.price,
          mrp: v.mrp,
          imageUrl: v.primaryImageUrl || (v.imageUrls && v.imageUrls[0]) || ""
        }))
      }));
      setCatalog(mappedCatalog);

      const fetchedBundles = await bundleApi.fetchAllBundles(token);
      setBundles(fetchedBundles);
    } catch (err) {
      console.error("Error loading bundle catalog details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Find variant details helper
  const findVariant = (id: number) => {
    for (const prod of catalog) {
      const v = prod.variants.find((x: any) => x.id === id);
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
  const allCatalogVariants = catalog.flatMap((p) =>
    p.variants.map((v: any) => ({
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

  const handleToggleActive = async (id: number) => {
    if (!token) return;
    try {
      await bundleApi.toggleBundleStatus(id, token);
      loadData();
    } catch (err) {
      alert("Failed to toggle bundle active status.");
      console.error(err);
    }
  };

  const handleDeleteBundle = async (id: number) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this bundle?")) return;
    try {
      await bundleApi.deleteBundle(id, token);
      loadData();
    } catch (err) {
      alert("Failed to delete product bundle.");
      console.error(err);
    }
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

  const handleSaveBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedMainVariantId || selectedItems.length === 0) {
      alert("Please complete the bundle details and select at least one item.");
      return;
    }
    if (!token) return;

    try {
      const payload = {
        title: title.trim(),
        mainProductVariantId: Number(selectedMainVariantId),
        discountType: discountType,
        discountValue: Number(discountValue),
        productVariantIds: [Number(selectedMainVariantId), ...selectedItems.map(Number)],
        isActive: true
      };

      await bundleApi.createOrUpdateBundle(payload, token);
      loadData();
      
      // Reset Form
      setTitle("");
      setDiscountType("PERCENTAGE");
      setDiscountValue(10);
      setSelectedMainVariantId("");
      setSelectedItems([]);
      setMainSearch("");
      setCompanionSearch("");
      setShowComposer(false);
    } catch (err) {
      alert("Failed to publish product bundle.");
      console.error(err);
    }
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
                  const mainVariant = b.variants?.find((v: any) => v.variantId === b.mainProductVariantId) || {
                    productName: b.mainProductName || "Main Product",
                    variantName: b.mainVariantName || "Main Variant",
                    price: b.mainPrice || 0,
                    primaryImageUrl: b.mainImageUrl || ""
                  };

                  const companionVariants = b.variants?.filter((v: any) => v.variantId !== b.mainProductVariantId).map((v: any) => ({
                    variantId: v.variantId,
                    productName: v.productName,
                    variantName: v.variantName,
                    price: v.price,
                    imageUrl: v.primaryImageUrl
                  })) || (b.items || []);

                  const itemsPriceSum = companionVariants.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
                  const totalOrig = (mainVariant.price || 0) + itemsPriceSum;
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
                            src={mainVariant.primaryImageUrl || mainVariant.imageUrl}
                            alt={mainVariant.variantName}
                            className="w-9 h-9 object-cover rounded border border-neutral-100"
                          />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-neutral-900 truncate">{mainVariant.productName}</p>
                            <p className="text-[9px] text-[#224870] truncate">{mainVariant.variantName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Companion Items thumbnails list */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 max-w-sm overflow-hidden">
                          {companionVariants.map((item: any, idx: number) => (
                            <div key={item.variantId || idx} className="relative group shrink-0">
                              <img
                                src={item.imageUrl || item.primaryImageUrl}
                                alt={item.variantName}
                                className="w-8 h-8 object-cover rounded border border-neutral-100"
                              />
                            </div>
                          ))}
                          <span className="text-[10px] text-neutral-400 font-bold ml-1">
                            (+{companionVariants.length} items)
                          </span>
                        </div>
                      </td>

                      {/* Discount type / value */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                          b.discountType === "PERCENTAGE" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-150" 
                            : b.discountType === "FREE_SHIPPING"
                            ? "bg-amber-50 text-amber-700 border border-amber-150"
                            : "bg-[#224870]/10 text-[#224870] border border-[#224870]/20"
                        }`}>
                          {b.discountType === "PERCENTAGE" ? <Percent className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                          {b.discountValue} {b.discountType === "PERCENTAGE" ? "% Off" : b.discountType === "FREE_SHIPPING" ? "Free Ship" : "Flat Off"}
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
