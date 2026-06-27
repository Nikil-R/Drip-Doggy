import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
} from "lucide-react";
import { categoryApi, BackendCategory } from "../lib/category-api";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-9 h-5 rounded-full transition-all duration-300 cursor-pointer p-0 shrink-0 border-none outline-none ${
        enabled ? "bg-[#224870]" : "bg-neutral-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

interface SubCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  categoryId: string;
}

interface Category {
  id: string;
  label: string;
  sub: string;
  parent: string;
  count: number;
  orders: number;
  status: "Active" | "Inactive";
  bannerImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  subCategories?: SubCategory[];
  revenueSales?: number;
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isEditCatOpen, setIsEditCatOpen] = useState(false);
  const [isDeleteCatOpen, setIsDeleteCatOpen] = useState(false);
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [isEditSubOpen, setIsEditSubOpen] = useState(false);
  const [isDeleteSubOpen, setIsDeleteSubOpen] = useState(false);

  // Targets
  const [editCategoryTarget, setEditCategoryTarget] = useState<Category | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<Category | null>(null);
  const [editSubTarget, setEditSubTarget] = useState<SubCategory | null>(null);
  const [deleteSubTarget, setDeleteSubTarget] = useState<SubCategory | null>(null);

  // Category Form Inputs
  const [catLabel, setCatLabel] = useState("");
  const [catSub, setCatSub] = useState("");
  const [catBannerImage, setCatBannerImage] = useState("");
  const [catImageFile, setCatImageFile] = useState<File | null>(null);

  // SubCategory Form Inputs
  const [subName, setSubName] = useState("");
  const [subDescription, setSubDescription] = useState("");
  const [subImageUrl, setSubImageUrl] = useState("");
  const [subImageFile, setSubImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const subFileInputRef = useRef<HTMLInputElement>(null);

  // Load categories from API on mount
  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryApi.getAllCategories();
      const mapped: Category[] = data.map((bc: BackendCategory) => {
        // Parse subCategoryIds back to subCategories list.
        // Since we don't have separate subcategory table queries, we map subcategory data structures.
        // We will seed / parse subcategory structures from JSON or ID arrays.
        let subCats: SubCategory[] = [];
        try {
          if (bc.subCategoryIds) {
            // Assume subCategoryIds holds comma separated names or stringified structures
            const parsed = JSON.parse(bc.subCategoryIds);
            if (Array.isArray(parsed)) {
              subCats = parsed;
            }
          }
        } catch {
          // fallback to IDs mapping if not JSON
          if (bc.subCategoryIds) {
            subCats = bc.subCategoryIds.split(",").filter(Boolean).map(idOrName => ({
              id: `${bc.categoryId}-${idOrName.trim()}`,
              name: idOrName.trim(),
              description: "Subcategory of " + bc.categoryName,
              imageUrl: "",
              isActive: true,
              categoryId: String(bc.categoryId),
            }));
          }
        }

        return {
          id: String(bc.categoryId),
          label: bc.categoryName,
          sub: bc.description,
          parent: bc.categoryName,
          count: 0,
          orders: 0,
          status: bc.isActive ? "Active" : "Inactive",
          bannerImage: bc.imagePath || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop",
          slug: bc.categoryName.toLowerCase().replace(/\s+/g, "-"),
          subCategories: subCats,
          revenueSales: 0,
        };
      });
      setCategories(mapped);
      if (mapped.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(mapped[0].id);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, isSub = false) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (isSub) {
        setSubImageFile(files[0]);
      } else {
        setCatImageFile(files[0]);
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const resetCatForm = () => {
    setCatLabel("");
    setCatSub("");
    setCatBannerImage("");
    setCatImageFile(null);
  };

  const openAddCategory = () => {
    resetCatForm();
    setIsAddCatOpen(true);
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catLabel.trim()) return;

    try {
      const added = await categoryApi.addCategory(
        catLabel.trim(),
        catSub.trim(),
        catImageFile,
        ""
      );
      await loadCategories();
      if (added && added.categoryId) {
        setSelectedCategoryId(String(added.categoryId));
      }
      setIsAddCatOpen(false);
      resetCatForm();
    } catch (err) {
      console.error("Error creating category", err);
      alert("Failed to create category. Please ensure backend is running at http://localhost:8081.");
    }
  };

  const openEditCategory = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditCategoryTarget(cat);
    setCatLabel(cat.label);
    setCatSub(cat.sub);
    setCatBannerImage(cat.bannerImage || "");
    setCatImageFile(null);
    setIsEditCatOpen(true);
  };

  const handleSaveCategoryEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategoryTarget) return;

    try {
      const subIds = JSON.stringify(editCategoryTarget.subCategories || []);
      await categoryApi.updateCategory(
        Number(editCategoryTarget.id),
        catLabel.trim(),
        catSub.trim(),
        catImageFile,
        subIds,
        editCategoryTarget.status === "Active"
      );
      await loadCategories();
      setIsEditCatOpen(false);
    } catch (err) {
      console.error("Error updating category", err);
    }
  };

  const openDeleteCategory = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteCategoryTarget(cat);
    setIsDeleteCatOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    try {
      await categoryApi.deleteCategory(Number(deleteCategoryTarget.id));
      await loadCategories();
      if (selectedCategoryId === deleteCategoryTarget.id) {
        setSelectedCategoryId(null);
      }
      setIsDeleteCatOpen(false);
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  // ── SubCategory CRUD ──

  const resetSubForm = () => {
    setSubName("");
    setSubDescription("");
    setSubImageUrl("");
    setSubImageFile(null);
  };

  const openAddSubCategory = () => {
    if (!selectedCategoryId) return;
    resetSubForm();
    setIsAddSubOpen(true);
  };

  const handleAddSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !selectedCategoryId) return;

    const activeCat = categories.find(c => c.id === selectedCategoryId);
    if (!activeCat) return;

    const id = `${selectedCategoryId}-${subName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const newSub: SubCategory = {
      id,
      name: subName.trim(),
      description: subDescription.trim(),
      imageUrl: subImageUrl,
      isActive: true,
      categoryId: selectedCategoryId,
    };

    const updatedSubCategories = [...(activeCat.subCategories || []), newSub];
    try {
      await categoryApi.updateCategory(
        Number(activeCat.id),
        activeCat.label,
        activeCat.sub,
        null,
        JSON.stringify(updatedSubCategories),
        activeCat.status === "Active"
      );
      await loadCategories();
      setIsAddSubOpen(false);
    } catch (err) {
      console.error("Error adding subcategory", err);
    }
  };

  const handleToggleSubActive = async (categoryId: string, subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const activeCat = categories.find(c => c.id === categoryId);
    if (!activeCat) return;

    const updatedSubCategories = (activeCat.subCategories || []).map(s =>
      s.id === subId ? { ...s, isActive: !s.isActive } : s
    );

    try {
      await categoryApi.updateCategory(
        Number(activeCat.id),
        activeCat.label,
        activeCat.sub,
        null,
        JSON.stringify(updatedSubCategories),
        activeCat.status === "Active"
      );
      await loadCategories();
    } catch (err) {
      console.error("Error toggling subcategory", err);
    }
  };

  const handleRemoveSubCategory = async (categoryId: string, subId: string) => {
    const activeCat = categories.find(c => c.id === categoryId);
    if (!activeCat) return;

    const updatedSubCategories = (activeCat.subCategories || []).filter(s => s.id !== subId);

    try {
      await categoryApi.updateCategory(
        Number(activeCat.id),
        activeCat.label,
        activeCat.sub,
        null,
        JSON.stringify(updatedSubCategories),
        activeCat.status === "Active"
      );
      await loadCategories();
    } catch (err) {
      console.error("Error removing subcategory", err);
    }
  };

  const openEditSubCategory = (sub: SubCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditSubTarget(sub);
    setSubName(sub.name);
    setSubDescription(sub.description);
    setSubImageUrl(sub.imageUrl);
    setSubImageFile(null);
    setIsEditSubOpen(true);
  };

  const handleSaveSubCategoryEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubTarget) return;

    const activeCat = categories.find(c => c.id === editSubTarget.categoryId);
    if (!activeCat) return;

    const updatedSubCategories = (activeCat.subCategories || []).map(s =>
      s.id === editSubTarget.id ? {
        ...s,
        name: subName.trim(),
        description: subDescription.trim(),
        imageUrl: subImageUrl,
      } : s
    );

    try {
      await categoryApi.updateCategory(
        Number(activeCat.id),
        activeCat.label,
        activeCat.sub,
        null,
        JSON.stringify(updatedSubCategories),
        activeCat.status === "Active"
      );
      await loadCategories();
      setIsEditSubOpen(false);
    } catch (err) {
      console.error("Error updating subcategory", err);
    }
  };

  const openDeleteSubCategory = (sub: SubCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteSubTarget(sub);
    setIsDeleteSubOpen(true);
  };

  const handleConfirmDeleteSubCategory = async () => {
    if (!deleteSubTarget) return;
    const activeCat = categories.find(c => c.id === deleteSubTarget.categoryId);
    if (!activeCat) return;

    const updatedSubCategories = (activeCat.subCategories || []).filter(s => s.id !== deleteSubTarget.id);

    try {
      await categoryApi.updateCategory(
        Number(activeCat.id),
        activeCat.label,
        activeCat.sub,
        null,
        JSON.stringify(updatedSubCategories),
        activeCat.status === "Active"
      );
      await loadCategories();
      setIsDeleteSubOpen(false);
    } catch (err) {
      console.error("Error deleting subcategory", err);
    }
  };

  const activeCategoryDetails = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  const filteredCategories = useMemo(() => {
    let list = categories;
    if (activeTab === "Active") list = list.filter(c => c.status === "Active");
    else if (activeTab === "Inactive") list = list.filter(c => c.status === "Inactive");

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.label.toLowerCase().includes(q) || c.parent.toLowerCase().includes(q));
    }
    return list;
  }, [categories, activeTab, searchQuery]);

  const handleToggleStatus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await categoryApi.toggleCategoryStatus(Number(id));
      await loadCategories();
    } catch (err) {
      console.error("Error toggling category status", err);
    }
  };

  const summaryStats = useMemo(() => {
    const totalCount = categories.length;
    const activeCount = categories.filter(c => c.status === "Active").length;
    const inactiveCount = categories.filter(c => c.status === "Inactive").length;
    const totalSubs = categories.reduce((sum, c) => sum + (c.subCategories?.length || 0), 0);
    return { totalCount, activeCount, inactiveCount, totalSubs };
  }, [categories]);

  return (
    <div className="space-y-6 font-sans text-[#382d24]">

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Categories", value: summaryStats.totalCount.toString(), desc: "Categories in catalog" },
          { label: "Active Categories", value: summaryStats.activeCount.toString(), desc: "Visible on storefront" },
          { label: "Inactive Categories", value: summaryStats.inactiveCount.toString(), desc: "Hidden from storefront" },
          { label: "Total Subcategories", value: summaryStats.totalSubs.toString(), desc: "Subcategories configured" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[90px] hover:shadow-sm transition-shadow">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">{stat.label}</span>
            <div className="mt-1">
              <span className="text-2xl font-bold tracking-tight text-[#382d24]">{stat.value}</span>
            </div>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left: Category List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card border border-neutral-200/80 p-5 space-y-4">

            {/* Search & Filters */}
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-neutral-200/60">
              <div className="flex items-center gap-3 flex-wrap flex-1 min-w-[280px]">
                <div className="relative flex-1 max-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Quick lookup..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-card border border-neutral-200 pl-9 pr-3 py-2 text-[9.5px] font-semibold uppercase tracking-widest focus:outline-none focus:border-[#224870] placeholder-neutral-300 w-full transition-all"
                  />
                </div>
                <div className="flex items-center bg-card border border-neutral-200 p-1">
                  {["All", "Active", "Inactive"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3.5 py-1.5 text-[8px] font-bold tracking-widest uppercase border-none cursor-pointer transition-all ${
                        activeTab === tab ? "bg-[#224870] text-white" : "bg-transparent text-neutral-500 hover:text-[#224870]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={openAddCategory}
                className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-2 transition-all cursor-pointer border-none"
              >
                <Plus className="w-3.5 h-3.5" /> Add Category
              </button>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCategories.map((cat, idx) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`group relative border transition-all duration-300 cursor-pointer overflow-hidden ${
                      isSelected
                        ? "border-[#224870] bg-[#224870]/5 shadow-sm"
                        : "border-neutral-200/80 hover:border-[#224870]/60 hover:shadow-xs"
                    }`}
                  >
                    <div className={`h-1.5 w-full ${cat.status === "Active" ? "bg-[#224870]" : "bg-neutral-300"}`} />
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-bold tracking-widest uppercase text-neutral-400">{cat.parent}</span>
                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <ToggleSwitch enabled={cat.status === "Active"} onClick={(e) => handleToggleStatus(cat.id, e)} />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[11.5px] font-black text-[#382d24] uppercase tracking-wide group-hover:text-[#224870] transition-colors">{cat.label}</h4>
                        <p className="text-[9px] text-[#615e56] font-semibold tracking-wider mt-0.5 truncate">{cat.sub}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100/60">
                        <span className="text-[9px] font-bold text-[#224870]">
                          {cat.subCategories?.length || 0} Subcategor{(cat.subCategories?.length || 0) === 1 ? "y" : "ies"}
                        </span>
                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={(e) => openEditCategory(cat, e)}
                            className="p-1.5 border border-neutral-200 hover:border-[#224870] cursor-pointer bg-card transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3 text-neutral-500" />
                          </button>
                          <button
                            onClick={(e) => openDeleteCategory(cat, e)}
                            className="p-1.5 border border-neutral-200 hover:border-red-500 cursor-pointer bg-card transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 text-neutral-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredCategories.length === 0 && (
              <div className="py-8 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                No collections found matching your search.
              </div>
            )}

          </div>
        </div>

        {/* Right: Selected Category + Subcategories */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
          {activeCategoryDetails ? (
            <div className="bg-card border border-neutral-200/80 p-5 space-y-5">

              <div className="relative aspect-[16/9] border border-neutral-200/80 overflow-hidden group">
                <img
                  src={activeCategoryDetails.bannerImage || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop"}
                  alt="Banner"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[7.5px] font-bold tracking-[0.25em] text-white/70 uppercase">{activeCategoryDetails.parent} Category</span>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider mt-0.5">{activeCategoryDetails.label}</h3>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[8px] font-bold tracking-widest text-[#615e56] uppercase">Description</span>
                <p className="text-[10px] font-semibold text-[#382d24] uppercase tracking-wide leading-relaxed">
                  {activeCategoryDetails.sub}
                </p>
              </div>

              {/* Subcategories */}
              <div className="border-t border-neutral-100 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-widest text-[#615e56] uppercase">Subcategories ({activeCategoryDetails.subCategories?.length || 0})</span>
                  <button
                    onClick={openAddSubCategory}
                    className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[8px] font-bold tracking-widest px-3 py-2 uppercase flex items-center gap-1.5 cursor-pointer border-none transition-all"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>

                {activeCategoryDetails.subCategories && activeCategoryDetails.subCategories.length > 0 ? (
                  <div className="space-y-2">
                    {activeCategoryDetails.subCategories.map(sub => (
                      <div key={sub.id} className="border border-neutral-200/80 p-3 space-y-2 hover:border-[#224870]/40 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="text-[10px] font-black text-[#382d24] uppercase tracking-wide truncate">{sub.name}</h5>
                              <span className={`text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 shrink-0 ${
                                sub.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                              }`}>
                                {sub.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <p className="text-[8.5px] text-[#615e56] font-semibold tracking-wider mt-0.5 truncate">{sub.description}</p>
                          </div>
                          {sub.imageUrl && (
                            <div className="w-10 h-10 border border-neutral-200/60 overflow-hidden shrink-0 bg-neutral-50">
                              <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                            <ToggleSwitch enabled={sub.isActive} onClick={(e) => handleToggleSubActive(activeCategoryDetails.id, sub.id, e)} />
                            <button onClick={(e) => openEditSubCategory(sub, e)} className="p-1 border border-neutral-200 hover:border-[#224870] cursor-pointer bg-card transition-colors" title="Edit">
                              <Edit2 className="w-3 h-3 text-neutral-500" />
                            </button>
                            <button onClick={(e) => openDeleteSubCategory(sub, e)} className="p-1 border border-neutral-200 hover:border-red-500 cursor-pointer bg-card transition-colors" title="Delete">
                              <Trash2 className="w-3 h-3 text-neutral-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider text-center py-4">
                    No subcategories. Click "Add" to create one.
                  </p>
                )}
              </div>

              {/* Inspector Buttons */}
              <div className="border-t border-neutral-100 pt-4 flex gap-3.5">
                <button
                  onClick={(e) => openEditCategory(activeCategoryDetails, e)}
                  className="flex-1 bg-[#224870] text-white hover:bg-[#224870]/85 text-[9px] font-bold tracking-widest py-2.5 uppercase cursor-pointer border-none transition-all flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3 h-3" /> Edit Category
                </button>
                <button
                  onClick={(e) => openDeleteCategory(activeCategoryDetails, e)}
                  className="border border-neutral-200 hover:border-red-500 hover:text-red-600 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2.5 uppercase bg-transparent cursor-pointer transition-all"
                >
                  Delete
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-card border border-neutral-200/80 p-6 text-center text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
              Please select a department to inspect details.
            </div>
          )}
        </div>

      </div>

      {/* ── Add Category Modal ── */}
      {isAddCatOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsAddCatOpen(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Add Category</span>
              <button onClick={() => setIsAddCatOpen(false)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Category Name</label>
                <input required type="text" value={catLabel} onChange={e => setCatLabel(e.target.value)} placeholder="e.g. Women" className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Description</label>
                <textarea required value={catSub} onChange={e => setCatSub(e.target.value)} placeholder="Category description..." rows={3} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24] resize-none" />
              </div>
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Upload Image</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-neutral-200 hover:border-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase flex items-center gap-2 bg-transparent cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-neutral-500" /> Choose File
                  </button>
                  {catBannerImage && <span className="text-[8px] text-green-600 font-bold uppercase">Image selected</span>}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, setCatBannerImage, false)} />
                </div>
                {catBannerImage && (
                  <div className="mt-2 w-full aspect-[16/6] border border-neutral-200/60 overflow-hidden bg-neutral-50">
                    <img src={catBannerImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddCatOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
                <button type="submit" className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-all">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Category Modal ── */}
      {isEditCatOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsEditCatOpen(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Edit Category</span>
              <button onClick={() => setIsEditCatOpen(false)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCategoryEdit} className="space-y-4">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Category Name</label>
                <input required type="text" value={catLabel} onChange={e => setCatLabel(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Description</label>
                <textarea required value={catSub} onChange={e => setCatSub(e.target.value)} rows={3} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24] resize-none" />
              </div>
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Upload Image</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-neutral-200 hover:border-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase flex items-center gap-2 bg-transparent cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-neutral-500" /> Choose File
                  </button>
                  {catBannerImage && <span className="text-[8px] text-green-600 font-bold uppercase">Image selected</span>}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, setCatBannerImage, false)} />
                </div>
                {catBannerImage && (
                  <div className="mt-2 w-full aspect-[16/6] border border-neutral-200/60 overflow-hidden bg-neutral-50">
                    <img src={catBannerImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditCatOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
                <button type="submit" className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Category Confirmation ── */}
      {isDeleteCatOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsDeleteCatOpen(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-xs w-full space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#b2533e] uppercase">Delete Category</h3>
            <p className="text-[9.5px] text-neutral-500 uppercase font-bold leading-normal">
              Are you sure you want to delete <strong className="text-[#382d24]">{deleteCategoryTarget?.label}</strong>? This removes all subcategories under it.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setIsDeleteCatOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
              <button onClick={handleConfirmDeleteCategory} className="bg-[#b2533e] text-white hover:bg-red-800 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Subcategory Modal ── */}
      {isAddSubOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsAddSubOpen(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Add Subcategory</span>
              <button onClick={() => setIsAddSubOpen(false)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Subcategory Name</label>
                <input required type="text" value={subName} onChange={e => setSubName(e.target.value)} placeholder="e.g. Dresses" className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Upload Image</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => subFileInputRef.current?.click()} className="border border-neutral-200 hover:border-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase flex items-center gap-2 bg-transparent cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-neutral-500" /> Choose File
                  </button>
                  {subImageUrl && <span className="text-[8px] text-green-600 font-bold uppercase">Image selected</span>}
                  <input ref={subFileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, setSubImageUrl, true)} />
                </div>
                {subImageUrl && (
                  <div className="mt-2 w-full aspect-[16/6] border border-neutral-200/60 overflow-hidden bg-neutral-50">
                    <img src={subImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Description</label>
                <textarea value={subDescription} onChange={e => setSubDescription(e.target.value)} placeholder="Subcategory description..." rows={2} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24] resize-none" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddSubOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
                <button type="submit" className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-all">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Subcategory Modal ── */}
      {isEditSubOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsEditSubOpen(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Edit Subcategory</span>
              <button onClick={() => setIsEditSubOpen(false)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveSubCategoryEdit} className="space-y-4">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Subcategory Name</label>
                <input required type="text" value={subName} onChange={e => setSubName(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Upload Image</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => subFileInputRef.current?.click()} className="border border-neutral-200 hover:border-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase flex items-center gap-2 bg-transparent cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-neutral-500" /> Choose File
                  </button>
                  {subImageUrl && <span className="text-[8px] text-green-600 font-bold uppercase">Image selected</span>}
                  <input ref={subFileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, setSubImageUrl, true)} />
                </div>
                {subImageUrl && (
                  <div className="mt-2 w-full aspect-[16/6] border border-neutral-200/60 overflow-hidden bg-neutral-50">
                    <img src={subImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Description</label>
                <textarea value={subDescription} onChange={e => setSubDescription(e.target.value)} placeholder="Subcategory description..." rows={2} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24] resize-none" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddSubOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
                <button type="submit" className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-all">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Subcategory Modal ── */}
      {isEditSubOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsEditSubOpen(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Edit Subcategory</span>
              <button onClick={() => setIsEditSubOpen(false)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveSubCategoryEdit} className="space-y-4">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Subcategory Name</label>
                <input required type="text" value={subName} onChange={e => setSubName(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Upload Image</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => subFileInputRef.current?.click()} className="border border-neutral-200 hover:border-[#224870] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase flex items-center gap-2 bg-transparent cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-neutral-500" /> Choose File
                  </button>
                  {subImageUrl && <span className="text-[8px] text-green-600 font-bold uppercase">Image selected</span>}
                  <input ref={subFileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, setSubImageUrl, true)} />
                </div>
                {subImageUrl && (
                  <div className="mt-2 w-full aspect-[16/6] border border-neutral-200/60 overflow-hidden bg-neutral-50">
                    <img src={subImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Description</label>
                <textarea value={subDescription} onChange={e => setSubDescription(e.target.value)} rows={2} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24] resize-none" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditSubOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
                <button type="submit" className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Subcategory Confirmation ── */}
      {isDeleteSubOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsDeleteSubOpen(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-xs w-full space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#b2533e] uppercase">Delete Subcategory</h3>
            <p className="text-[9.5px] text-neutral-500 uppercase font-bold leading-normal">
              Are you sure you want to delete <strong className="text-[#382d24]">{deleteSubTarget?.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setIsDeleteSubOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
              <button onClick={handleConfirmDeleteSubCategory} className="bg-[#b2533e] text-white hover:bg-red-800 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
