import { useState, useMemo, useRef } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Shirt,
  Layers,
  Tag,
  Package,
  Eye,
  X,
  AlertTriangle,
  Check,
  LayoutGrid,
  ArrowUpDown,
  Upload,
  ChevronDown
} from "lucide-react";

const RS = "₹";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer p-0 shrink-0 border-none outline-none ${
        enabled ? "bg-[#030213]" : "bg-neutral-300"
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

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  label: string;
  sub: string;
  parent: string;
  count: number; // product count
  orders: number; // total orders
  status: "Active" | "Inactive";
  bannerImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  subCategories?: SubCategory[];
}

const initialCategoriesData: Category[] = [
  { id: "dresses", label: "Dresses", sub: "Maxi & Midi Dresses", parent: "Women", count: 24, orders: 431, status: "Active", bannerImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=120&auto=format&fit=crop", slug: "dresses", subCategories: [{ id: "maxi", name: "Maxi Dresses" }, { id: "midi", name: "Midi Dresses" }] },
  { id: "skirts", label: "Skirts", sub: "Pleated & Denim Skirts", parent: "Women", count: 16, orders: 368, status: "Active", slug: "skirts", subCategories: [{ id: "cargo", name: "Cargo Skirts" }] },
  { id: "jeans", label: "Jeans", sub: "Denim & Cargo Pants", parent: "Women", count: 18, orders: 256, status: "Active", slug: "jeans" },
  { id: "tops", label: "Tops", sub: "Crop Tops & Shirts", parent: "Women", count: 32, orders: 493, status: "Active", slug: "tops" },
  { id: "outerwear", label: "Outerwear", sub: "Jackets & Trench Coats", parent: "Women", count: 14, orders: 455, status: "Active", slug: "outerwear" },
  { id: "knitwear", label: "Knitwear", sub: "Cardigans & Sweaters", parent: "Women", count: 20, orders: 436, status: "Active", slug: "knitwear" },
  { id: "accessories", label: "Accessories", sub: "Bags & Scarves", parent: "Women", count: 12, orders: 326, status: "Active", slug: "accessories" },
  { id: "bottoms", label: "Bottoms", sub: "Trousers & Joggers", parent: "Women", count: 22, orders: 199, status: "Active", slug: "bottoms" }
];

const mockCatalogProducts = [
  { id: "#DD-P001", name: "Structured Canvas Jacket", price: 12999, orders: 342, category: "outerwear" },
  { id: "#DD-P002", name: "Sartorial Trench Coat", price: 24999, orders: 198, category: "outerwear" },
  { id: "#DD-P003", name: "Cashmere Blend Crew", price: 8999, orders: 287, category: "knitwear" },
  { id: "#DD-P004", name: "Merino Wool Cardigan", price: 11999, orders: 167, category: "knitwear" },
  { id: "#DD-P005", name: "Signature Silk Blouse", price: 6999, orders: 312, category: "tops" },
  { id: "#DD-P006", name: "Relaxed Linen Shirt", price: 5499, orders: 256, category: "tops" },
];

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategoriesData);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>("dresses");
  const [searchQuery, setSearchQuery] = useState("");
  const [sliderIndex, setSliderIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("All");

  // Grid/Carousel Toggle
  const [layoutMode, setLayoutMode] = useState<"carousel" | "grid">("carousel");

  // Selected drill-down categories products list
  const [drillDownCategory, setDrillDownCategory] = useState<Category | null>(null);

  // Modal Control States
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isEditCatOpen, setIsEditCatOpen] = useState(false);
  const [isDeleteCatOpen, setIsDeleteCatOpen] = useState(false);

  // Targets
  const [editCategoryTarget, setEditCategoryTarget] = useState<Category | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<Category | null>(null);

  // Form Inputs
  const [catLabel, setCatLabel] = useState("");
  const [catSub, setCatSub] = useState("");
  const [catParent, setCatParent] = useState("Women");
  const [catStatus, setCatStatus] = useState<"Active" | "Inactive">("Active");
  const [catBannerImage, setCatBannerImage] = useState("");
  const [catMetaTitle, setCatMetaTitle] = useState("");
  const [catMetaDescription, setCatMetaDescription] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catSubText, setCatSubText] = useState(""); // subcategories list input comma separated

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const handleNextSlider = () => {
    if (sliderIndex + 4 < categories.length) {
      setSliderIndex(prev => prev + 1);
    }
  };

  const handlePrevSlider = () => {
    if (sliderIndex > 0) {
      setSliderIndex(prev => prev - 1);
    }
  };

  // Drag and Drop Sort Order Custom Adjuster (Up/Down Buttons)
  const moveCategory = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= categories.length) return;
    
    setCategories(prev => {
      const list = [...prev];
      const temp = list[index];
      list[index] = list[nextIndex];
      list[nextIndex] = temp;
      return list;
    });
  };

  // Selected category details
  const activeCategoryDetails = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  // Filtered Categories for bottom table list
  const filteredCategories = useMemo(() => {
    let list = categories;
    
    // Tab filter
    if (activeTab === "Active") list = list.filter(c => c.status === "Active");
    else if (activeTab === "Inactive") list = list.filter(c => c.status === "Inactive");

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.label.toLowerCase().includes(q) || c.parent.toLowerCase().includes(q));
    }

    return list;
  }, [categories, activeTab, searchQuery]);

  // Paginated Categories
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE) || 1;

  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategories(prev => prev.map(c => c.id === id ? {
      ...c,
      status: c.status === "Active" ? "Inactive" : "Active"
    } : c));
  };

  // File Change Banner upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCatBannerImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catLabel) return;
    
    const id = catSlug.trim() || catLabel.toLowerCase().replace(/\s+/g, "-");
    const subList = catSubText.split(",").map(s => s.trim()).filter(Boolean).map((s, idx) => ({
      id: `${id}-sub-${idx}`,
      name: s
    }));

    const newCategory: Category = {
      id,
      label: catLabel,
      sub: catSub || "Custom description",
      parent: catParent,
      count: 0,
      orders: 0,
      status: "Active",
      bannerImage: catBannerImage || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=120&auto=format&fit=crop",
      slug: id,
      metaTitle: catMetaTitle || `${catLabel} | Drip Doggy`,
      metaDescription: catMetaDescription,
      subCategories: subList
    };

    setCategories(prev => [newCategory, ...prev]);
    setSelectedCategoryId(id);
    setIsAddCatOpen(false);
  };

  const handleOpenEditCategory = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditCategoryTarget(cat);
    setCatLabel(cat.label);
    setCatSub(cat.sub);
    setCatParent(cat.parent);
    setCatStatus(cat.status);
    setCatBannerImage(cat.bannerImage || "");
    setCatMetaTitle(cat.metaTitle || "");
    setCatMetaDescription(cat.metaDescription || "");
    setCatSlug(cat.slug || cat.id);
    setCatSubText(cat.subCategories ? cat.subCategories.map(s => s.name).join(", ") : "");
    setIsEditCatOpen(true);
  };

  const handleSaveCategoryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategoryTarget) return;

    const subList = catSubText.split(",").map(s => s.trim()).filter(Boolean).map((s, idx) => ({
      id: `${catSlug}-sub-${idx}`,
      name: s
    }));

    setCategories(prev => prev.map(c => {
      if (c.id === editCategoryTarget.id) {
        return {
          ...c,
          label: catLabel,
          sub: catSub,
          parent: catParent,
          status: catStatus,
          bannerImage: catBannerImage,
          slug: catSlug,
          metaTitle: catMetaTitle,
          metaDescription: catMetaDescription,
          subCategories: subList
        };
      }
      return c;
    }));

    setIsEditCatOpen(false);
  };

  const handleOpenDeleteCategory = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteCategoryTarget(cat);
    setIsDeleteCatOpen(true);
  };

  const handleConfirmDeleteCategory = () => {
    if (!deleteCategoryTarget) return;
    setCategories(prev => prev.filter(c => c.id !== deleteCategoryTarget.id));
    if (selectedCategoryId === deleteCategoryTarget.id) {
      setSelectedCategoryId(categories[0]?.id || null);
    }
    setIsDeleteCatOpen(false);
  };

  // Bulk operations
  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} categories?`)) {
      setCategories(prev => prev.filter(c => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    }
  };

  const handleBulkStatusChange = (status: "Active" | "Inactive") => {
    setCategories(prev => prev.map(c => selectedIds.includes(c.id) ? { ...c, status } : c));
    setSelectedIds([]);
  };

  const drillDownProducts = useMemo(() => {
    if (!drillDownCategory) return [];
    return mockCatalogProducts.filter(p => p.category === drillDownCategory.id);
  }, [drillDownCategory]);

  return (
    <div className="space-y-8 font-sans text-[#030213]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">
            Categories
          </h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Manage product collections, hierarchical subcategories and departments
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => {
              setCatLabel("");
              setCatSub("");
              setCatParent("Women");
              setCatBannerImage("");
              setCatMetaTitle("");
              setCatMetaDescription("");
              setCatSlug("");
              setCatSubText("");
              setIsAddCatOpen(true);
            }}
            className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2.5 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none border-none shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
        </div>
      </div>

      {/* Bulk actions selection overlay */}
      {selectedIds.length > 0 && (
        <div className="bg-[#030213] text-white p-3.5 flex items-center justify-between border border-[#030213] rounded-none">
          <span className="text-[8px] font-bold tracking-widest uppercase">{selectedIds.length} Categories Selected</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handleBulkStatusChange("Active")} className="bg-transparent border border-white/20 text-white hover:border-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer">
              Bulk Activate
            </button>
            <button onClick={() => handleBulkStatusChange("Inactive")} className="bg-transparent border border-white/20 text-white hover:border-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer">
              Bulk Deactivate
            </button>
            <button onClick={handleBulkDelete} className="bg-[#b2533e] text-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer border-none">
              Bulk Delete
            </button>
            <button onClick={() => setSelectedIds([])} className="bg-transparent border-none text-white/50 hover:text-white p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Category Slider / Grid View ─────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
            Collection Deck Workspace
          </span>
          <button onClick={() => setLayoutMode(prev => prev === "carousel" ? "grid" : "carousel")} className="flex items-center gap-1.5 border border-neutral-200 bg-card hover:border-[#030213] text-neutral-600 text-[8px] font-bold uppercase px-2.5 py-1.5 cursor-pointer rounded-none">
            <LayoutGrid className="w-3.5 h-3.5" /> {layoutMode === "carousel" ? "View Grid Layout" : "View Carousel Layout"}
          </button>
        </div>

        {layoutMode === "carousel" ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {categories.slice(sliderIndex, sliderIndex + 4).map(cat => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <div 
                  key={cat.id} 
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`border p-4 transition-all cursor-pointer min-h-[100px] flex flex-col justify-between ${
                    isSelected ? "bg-[#030213] border-[#030213] text-white" : "bg-card border-neutral-200 hover:border-neutral-400 text-[#030213]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[7px] font-bold uppercase tracking-widest ${isSelected ? "text-neutral-400" : "text-neutral-400"}`}>{cat.parent}</span>
                    <ToggleSwitch enabled={cat.status === "Active"} onClick={(e) => handleToggleStatus(cat.id, e)} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider">{cat.label}</h3>
                    <p className={`text-[7px] mt-0.5 ${isSelected ? "text-neutral-300" : "text-neutral-400"}`}>{cat.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(cat => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <div 
                  key={cat.id} 
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`border p-3 transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                    isSelected ? "bg-[#030213] border-[#030213] text-white" : "bg-card border-neutral-200 hover:border-neutral-400 text-[#030213]"
                  }`}
                >
                  <span className="text-[6px] font-bold uppercase tracking-widest text-neutral-400">{cat.parent}</span>
                  <div>
                    <h3 className="text-[9px] font-bold uppercase tracking-wide truncate">{cat.label}</h3>
                    <span className="text-[6.5px] font-bold block mt-1 uppercase text-neutral-500">{cat.count} Items</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {layoutMode === "carousel" && (
          <div className="flex justify-end gap-1.5">
            <button 
              disabled={sliderIndex === 0}
              onClick={handlePrevSlider}
              className="w-7 h-7 flex items-center justify-center border border-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#030213] text-neutral-500 cursor-pointer bg-card rounded-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={sliderIndex + 4 >= categories.length}
              onClick={handleNextSlider}
              className="w-7 h-7 flex items-center justify-center border border-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#030213] text-neutral-500 cursor-pointer bg-card rounded-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Category tree & hierarchy view ────────────────────────────── */}
      {activeCategoryDetails && (
        <div className="bg-card border border-neutral-200/80 p-5 grid grid-cols-1 md:grid-cols-12 gap-5 rounded-none items-start">
          <div className="md:col-span-3">
            <span className="text-[7px] font-bold tracking-[0.2em] text-neutral-400 uppercase block mb-2">Category Banner</span>
            <div className="aspect-[4/3] bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center">
              <img src={activeCategoryDetails.bannerImage || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=120&auto=format&fit=crop"} alt="Banner" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-5 space-y-3">
            <div>
              <span className="text-[7px] font-bold tracking-widest text-neutral-400 uppercase">Description</span>
              <h3 className="text-sm font-bold uppercase text-[#030213] mt-0.5">{activeCategoryDetails.label}</h3>
              <p className="text-[9px] text-neutral-500 font-bold uppercase mt-1 leading-relaxed">{activeCategoryDetails.sub}</p>
            </div>

            {/* Hierarchical Subcategories View */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-200/60">
              <span className="text-[7px] font-bold tracking-widest text-neutral-400 uppercase block">Subcategory Hierarchy</span>
              <div className="flex flex-wrap gap-1.5">
                {activeCategoryDetails.subCategories && activeCategoryDetails.subCategories.length > 0 ? (
                  activeCategoryDetails.subCategories.map(sub => (
                    <span key={sub.id} className="bg-neutral-100 border border-neutral-200 text-[#030213] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider">
                      {sub.name}
                    </span>
                  ))
                ) : (
                  <span className="text-[8px] text-neutral-400 font-bold uppercase">No subcategory configured.</span>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 border-l border-neutral-200/60 pl-5 space-y-2 text-[8.5px] font-bold uppercase tracking-wider text-neutral-700">
            <span className="text-[7px] font-bold tracking-widest text-neutral-400 uppercase block mb-1">SEO settings</span>
            <div className="flex justify-between">
              <span className="text-neutral-400">URL path</span>
              <span className="font-mono text-[#030213] font-bold">/collections/{activeCategoryDetails.slug || activeCategoryDetails.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Meta Title</span>
              <span className="text-[#030213] font-semibold max-w-[150px] truncate">{activeCategoryDetails.metaTitle || "—"}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Table Grid list ────────────────────────────────────────── */}
      <div className="bg-card border border-neutral-200/80 p-5 rounded-none space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-neutral-200/60">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border border-neutral-200 pl-8 pr-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-full rounded-none"
            />
          </div>
          
          <div className="flex items-center bg-card border border-neutral-200 p-1">
            {["All", "Active", "Inactive"].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-[7px] font-semibold tracking-widest uppercase border-none cursor-pointer rounded-none ${
                  activeTab === tab ? "bg-[#030213] text-white" : "bg-transparent text-neutral-400 hover:text-[#030213]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider divide-y divide-neutral-100">
            <thead>
              <tr className="border-b border-neutral-200 bg-card/60 text-[7px] text-neutral-400 tracking-[0.2em]">
                <th className="p-3 w-8">
                  <button
                    onClick={() => {
                      const currentIds = paginatedCategories.map(c => c.id);
                      const allSelected = currentIds.every(id => selectedIds.includes(id));
                      if (allSelected) {
                        setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
                      } else {
                        setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
                      }
                    }}
                    className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#030213] p-0 flex items-center"
                  >
                    <span className={`w-3.5 h-3.5 border border-neutral-300 inline-block flex items-center justify-center ${paginatedCategories.every(c => selectedIds.includes(c.id)) ? "bg-[#030213] border-[#030213]" : ""}`}>
                      {paginatedCategories.every(c => selectedIds.includes(c.id)) && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                  </button>
                </th>
                <th className="p-3 w-16">Reorder</th>
                <th className="p-3 font-bold">Collection Category</th>
                <th className="p-3 font-bold">Parent</th>
                <th className="p-3 font-bold">Subcategories Count</th>
                <th className="p-3 font-bold cursor-pointer hover:text-[#030213]">Products Count</th>
                <th className="p-3 font-bold">Orders</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60">
              {paginatedCategories.map((cat, idx) => {
                const globalIndex = categories.findIndex(c => c.id === cat.id);
                return (
                  <tr
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`hover:bg-neutral-100/50 transition-colors cursor-pointer ${
                      selectedCategoryId === cat.id ? "bg-neutral-100" : ""
                    }`}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setSelectedIds(prev => prev.includes(cat.id) ? prev.filter(x => x !== cat.id) : [...prev, cat.id])} className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#030213] p-0 flex items-center">
                        <span className={`w-3.5 h-3.5 border border-neutral-300 inline-block flex items-center justify-center ${selectedIds.includes(cat.id) ? "bg-[#030213] border-[#030213]" : ""}`}>
                          {selectedIds.includes(cat.id) && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                      </button>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button disabled={globalIndex === 0} onClick={() => moveCategory(globalIndex, "up")} className="p-1 border border-neutral-200 bg-card hover:border-[#030213] disabled:opacity-30 disabled:pointer-events-none cursor-pointer rounded-none">
                          <ChevronLeft className="w-3 h-3 rotate-90" />
                        </button>
                        <button disabled={globalIndex === categories.length - 1} onClick={() => moveCategory(globalIndex, "down")} className="p-1 border border-neutral-200 bg-card hover:border-[#030213] disabled:opacity-30 disabled:pointer-events-none cursor-pointer rounded-none">
                          <ChevronLeft className="w-3 h-3 -rotate-90" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-[#030213] text-[9.5px]">{cat.label}</div>
                      <span className="text-[6.5px] text-neutral-400 font-semibold tracking-wider">{cat.sub}</span>
                    </td>
                    <td className="p-3 text-neutral-500 font-bold">{cat.parent}</td>
                    <td className="p-3 font-bold text-neutral-500">{cat.subCategories ? cat.subCategories.length : 0}</td>
                    <td className="p-3" onClick={(e) => { e.stopPropagation(); setDrillDownCategory(cat); }}>
                      <span className="font-bold text-[#030213] border-b border-[#030213]/40 pb-0.5 hover:text-[#b2533e] cursor-pointer">
                        {cat.count} Products
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#030213]">{cat.orders}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <ToggleSwitch enabled={cat.status === "Active"} onClick={(e) => handleToggleStatus(cat.id, e)} />
                    </td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => handleOpenEditCategory(cat, e)} className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer" title="Edit Category">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={(e) => handleOpenDeleteCategory(cat, e)} className="text-neutral-400 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer" title="Delete Category">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-neutral-200/60 pt-4">
          <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">
            Showing {paginatedCategories.length} of {filteredCategories.length} filtered collections
          </p>
          <div className="flex gap-1 items-center">
            <button 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] bg-card text-neutral-500 text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-none"
            >
              <ChevronLeft className="w-3 h-3" /> Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-7 h-7 flex items-center justify-center text-[8px] font-semibold cursor-pointer border rounded-none ${currentPage === i + 1 ? "bg-[#030213] text-white border-[#030213]" : "bg-card border-neutral-200 text-neutral-500 hover:border-[#030213]"}`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] bg-card text-neutral-500 text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-none"
            >
              Next <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Product count drill-down list modal ───────────────────────── */}
      {drillDownCategory && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setDrillDownCategory(null)}>
          <div className="bg-card border-2 border-[#030213] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#030213] uppercase">Products in {drillDownCategory.label}</span>
              <button onClick={() => setDrillDownCategory(null)} className="text-neutral-400 hover:text-[#030213] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100">
              {drillDownProducts.map(p => (
                <div key={p.id} className="py-2.5 flex justify-between items-center text-[8.5px] font-semibold uppercase">
                  <div>
                    <p className="text-[#030213]">{p.name}</p>
                    <span className="text-[7px] text-neutral-400 font-mono block">{p.id}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[#030213]">{RS}{p.price.toLocaleString()}</p>
                    <span className="text-[7.5px] text-neutral-400 font-bold block">{p.orders} Orders</span>
                  </div>
                </div>
              ))}
              {drillDownProducts.length === 0 && (
                <p className="p-4 text-center text-neutral-400 text-[8px] font-bold uppercase">No physical products configured in this category.</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setDrillDownCategory(null)} className="bg-[#030213] text-white hover:bg-neutral-800 text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Category Modal ───────────────────────────────────────── */}
      {isAddCatOpen && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsAddCatOpen(false)}>
          <div className="bg-card border-2 border-[#030213] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#030213] uppercase">Add New Collection Category</span>
              <button onClick={() => setIsAddCatOpen(false)} className="text-neutral-400 hover:text-[#030213] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Category Title</label>
                <input required type="text" value={catLabel} onChange={e => setCatLabel(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Slug Path</label>
                  <input type="text" value={catSlug} onChange={e => setCatSlug(e.target.value)} placeholder="e.g. outerwear" className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Parent Hierarchy</label>
                  <select value={catParent} onChange={e => setCatParent(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none cursor-pointer">
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Sub Description</label>
                <input required type="text" value={catSub} onChange={e => setCatSub(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              {/* Subcategories list */}
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Subcategories (Comma separated)</label>
                <input type="text" value={catSubText} onChange={e => setCatSubText(e.target.value)} placeholder="e.g. Maxi, Midi, Mini" className="w-full bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              {/* Image upload banner */}
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Banner Image URL or Upload</label>
                <input type="file" ref={fileInputRef} onChange={handleBannerUpload} accept="image/*" className="hidden" />
                <div className="flex gap-2">
                  <input type="text" value={catBannerImage} onChange={e => setCatBannerImage(e.target.value)} placeholder="Image link" className="flex-1 bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-neutral-200 hover:border-[#030213] text-neutral-600 px-3 text-[8px] font-bold uppercase cursor-pointer rounded-none bg-card"><Upload className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {/* SEO metadata fields */}
              <div className="border-t border-neutral-100 pt-2 space-y-2">
                <span className="text-[7px] font-bold tracking-widest text-neutral-400 uppercase block">SEO Metadata</span>
                <div>
                  <input type="text" placeholder="Meta Title" value={catMetaTitle} onChange={e => setCatMetaTitle(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
                <div>
                  <textarea rows={2} placeholder="Meta Description" value={catMetaDescription} onChange={e => setCatMetaDescription(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddCatOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
                <button type="submit" className="bg-[#030213] text-white hover:bg-neutral-800 text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Create Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Category Modal ──────────────────────────────────────── */}
      {isEditCatOpen && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsEditCatOpen(false)}>
          <div className="bg-card border-2 border-[#030213] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#030213] uppercase">Edit Category Collection</span>
              <button onClick={() => setIsEditCatOpen(false)} className="text-neutral-400 hover:text-[#030213] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryEdit} className="space-y-3">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Category Title</label>
                <input required type="text" value={catLabel} onChange={e => setCatLabel(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Slug Path</label>
                  <input type="text" value={catSlug} onChange={e => setCatSlug(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Parent Hierarchy</label>
                  <select value={catParent} onChange={e => setCatParent(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none cursor-pointer">
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Sub Description</label>
                <input required type="text" value={catSub} onChange={e => setCatSub(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Subcategories (Comma separated)</label>
                <input type="text" value={catSubText} onChange={e => setCatSubText(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Banner Image URL</label>
                <input type="file" ref={fileInputRef} onChange={handleBannerUpload} accept="image/*" className="hidden" />
                <div className="flex gap-2">
                  <input type="text" value={catBannerImage} onChange={e => setCatBannerImage(e.target.value)} className="flex-1 bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-neutral-200 hover:border-[#030213] text-neutral-600 px-3 text-[8px] font-bold uppercase cursor-pointer rounded-none bg-card"><Upload className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Fulfillment Status</label>
                <select value={catStatus} onChange={e => setCatStatus(e.target.value as any)} className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* SEO metadata fields */}
              <div className="border-t border-neutral-100 pt-2 space-y-2">
                <span className="text-[7px] font-bold tracking-widest text-neutral-400 uppercase block">SEO Metadata</span>
                <div>
                  <input type="text" placeholder="Meta Title" value={catMetaTitle} onChange={e => setCatMetaTitle(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
                <div>
                  <textarea rows={2} placeholder="Meta Description" value={catMetaDescription} onChange={e => setCatMetaDescription(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9px] font-bold p-2 focus:outline-none focus:border-[#030213] rounded-none" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditCatOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
                <button type="submit" className="bg-[#030213] text-white hover:bg-neutral-800 text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ───────────────────────────────── */}
      {isDeleteCatOpen && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsDeleteCatOpen(false)}>
          <div className="bg-card border-2 border-[#030213] p-6 max-w-xs w-full space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#b2533e] uppercase">Warning — Critical Action</h3>
            <p className="text-[9px] text-neutral-500 uppercase font-bold leading-normal">
              Are you sure you want to permanently delete category <strong className="text-[#030213]">{deleteCategoryTarget?.label}</strong>? This removes all subcategory links.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setIsDeleteCatOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button 
                onClick={handleConfirmDeleteCategory} 
                className="bg-[#b2533e] text-white hover:bg-red-800 text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
