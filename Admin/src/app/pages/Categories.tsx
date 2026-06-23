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
  ChevronDown,
  TrendingUp,
  Globe,
  PieChart as PieIcon
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const RS = "₹";

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
  revenueSales?: number; // Sales revenue
}

const initialCategoriesData: Category[] = [
  { id: "outerwear", label: "Outerwear", sub: "Jackets & Trench Coats", parent: "Women", count: 14, orders: 455, status: "Active", bannerImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=400&auto=format&fit=crop", slug: "outerwear", subCategories: [{ id: "jackets", name: "Jackets" }, { id: "coats", name: "Trench Coats" }], revenueSales: 342000 },
  { id: "dresses", label: "Dresses", sub: "Maxi & Midi Dresses", parent: "Women", count: 24, orders: 431, status: "Active", bannerImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop", slug: "dresses", subCategories: [{ id: "maxi", name: "Maxi Dresses" }, { id: "midi", name: "Midi Dresses" }], revenueSales: 298000 },
  { id: "knitwear", label: "Knitwear", sub: "Cardigans & Sweaters", parent: "Women", count: 20, orders: 436, status: "Active", bannerImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop", slug: "knitwear", subCategories: [{ id: "sweaters", name: "Sweaters" }, { id: "cardigans", name: "Cardigans" }], revenueSales: 254000 },
  { id: "tops", label: "Tops", sub: "Crop Tops & Shirts", parent: "Women", count: 32, orders: 493, status: "Active", bannerImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop", slug: "tops", subCategories: [{ id: "shirts", name: "Shirts" }, { id: "crops", name: "Crop Tops" }], revenueSales: 395000 },
  { id: "skirts", label: "Skirts", sub: "Pleated & Denim Skirts", parent: "Women", count: 16, orders: 368, status: "Active", bannerImage: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=400&auto=format&fit=crop", slug: "skirts", subCategories: [{ id: "cargo", name: "Cargo Skirts" }], revenueSales: 189000 },
  { id: "jeans", label: "Jeans", sub: "Denim & Cargo Pants", parent: "Women", count: 18, orders: 256, status: "Active", bannerImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&auto=format&fit=crop", slug: "jeans", subCategories: [{ id: "denim", name: "Denim Jeans" }], revenueSales: 165000 },
  { id: "accessories", label: "Accessories", sub: "Bags & Scarves", parent: "Women", count: 12, orders: 326, status: "Active", bannerImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop", slug: "accessories", subCategories: [{ id: "bags", name: "Handbags" }, { id: "scarves", name: "Scarves" }], revenueSales: 122000 },
  { id: "bottoms", label: "Bottoms", sub: "Trousers & Joggers", parent: "Women", count: 22, orders: 199, status: "Active", bannerImage: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=400&auto=format&fit=crop", slug: "bottoms", subCategories: [{ id: "trousers", name: "Trousers" }], revenueSales: 94000 }
];

const mockCatalogProducts = [
  { id: "#DD-P001", name: "Structured Canvas Jacket", price: 12999, orders: 342, category: "outerwear", sku: "DD-STR-001" },
  { id: "#DD-P002", name: "Sartorial Trench Coat", price: 24999, orders: 198, category: "outerwear", sku: "DD-SAR-001" },
  { id: "#DD-P003", name: "Cashmere Blend Crew", price: 8999, orders: 287, category: "knitwear", sku: "DD-CSH-001" },
  { id: "#DD-P004", name: "Merino Wool Cardigan", price: 11999, orders: 167, category: "knitwear", sku: "DD-MRN-001" },
  { id: "#DD-P005", name: "Signature Silk Blouse", price: 6999, orders: 312, category: "tops", sku: "DD-SIL-001" },
  { id: "#DD-P006", name: "Relaxed Linen Shirt", price: 5499, orders: 256, category: "tops", sku: "DD-LIN-001" },
];

const categoryTrendMockData: Record<string, { month: string; sales: number }[]> = {
  outerwear: [
    { month: "Jan", sales: 24000 }, { month: "Feb", sales: 38000 }, { month: "Mar", sales: 45000 },
    { month: "Apr", sales: 52000 }, { month: "May", sales: 78000 }, { month: "Jun", sales: 105000 }
  ],
  dresses: [
    { month: "Jan", sales: 18000 }, { month: "Feb", sales: 29000 }, { month: "Mar", sales: 38000 },
    { month: "Apr", sales: 49000 }, { month: "May", sales: 64000 }, { month: "Jun", sales: 100000 }
  ],
  knitwear: [
    { month: "Jan", sales: 35000 }, { month: "Feb", sales: 42000 }, { month: "Mar", sales: 31000 },
    { month: "Apr", sales: 28000 }, { month: "May", sales: 48000 }, { month: "Jun", sales: 70000 }
  ],
  tops: [
    { month: "Jan", sales: 41000 }, { month: "Feb", sales: 48000 }, { month: "Mar", sales: 56000 },
    { month: "Apr", sales: 68000 }, { month: "May", sales: 82000 }, { month: "Jun", sales: 100000 }
  ]
};

const defaultTrendData = [
  { month: "Jan", sales: 10000 }, { month: "Feb", sales: 15000 }, { month: "Mar", sales: 18000 },
  { month: "Apr", sales: 22000 }, { month: "May", sales: 31000 }, { month: "Jun", sales: 40000 }
];

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategoriesData);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>("outerwear");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

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
  const [catSubText, setCatSubText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reorder sort adjuster
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

  const activeCategoryDetails = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  const activeCategoryTrend = useMemo(() => {
    if (!selectedCategoryId) return defaultTrendData;
    return categoryTrendMockData[selectedCategoryId] || defaultTrendData;
  }, [selectedCategoryId]);

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

  const handleToggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategories(prev => prev.map(c => c.id === id ? {
      ...c,
      status: c.status === "Active" ? "Inactive" : "Active"
    } : c));
  };

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
      bannerImage: catBannerImage || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop",
      slug: id,
      metaTitle: catMetaTitle || `${catLabel} | Drip Doggy`,
      metaDescription: catMetaDescription,
      subCategories: subList,
      revenueSales: 0
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

  const drillDownProducts = useMemo(() => {
    if (!drillDownCategory) return [];
    return mockCatalogProducts.filter(p => p.category === drillDownCategory.id);
  }, [drillDownCategory]);

  const summaryStats = useMemo(() => {
    const totalCount = categories.length;
    const activeCount = categories.filter(c => c.status === "Active").length;
    const totalProducts = categories.reduce((sum, c) => sum + c.count, 0);
    const totalOrders = categories.reduce((sum, c) => sum + c.orders, 0);
    return { totalCount, activeCount, totalProducts, totalOrders };
  }, [categories]);

  return (
    <div className="space-y-8 font-sans text-[#382d24]">

      {/* Modern Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#224870]" /> Categories
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Map catalog categories, manage subcategory hierarchy, and view SEO properties
          </p>
        </div>
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
          className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-6 py-3 uppercase flex items-center gap-2 transition-all cursor-pointer border-none"
        >
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>

      {/* KPI Highlight Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Categories", value: summaryStats.totalCount.toString(), change: "+2 this quarter", trend: "up", desc: "Catalog categories live" },
          { label: "Active Nodes", value: summaryStats.activeCount.toString(), change: "100% capacity", trend: "up", desc: "Visible categories in menu" },
          { label: "Total Linked Items", value: summaryStats.totalProducts.toString(), change: "+14 this week", trend: "up", desc: "Products assigned to categories" },
          { label: "Accumulated Orders", value: summaryStats.totalOrders.toLocaleString("en-IN"), change: "+12.8%", trend: "up", desc: "Transactions driven" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">{stat.label}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl font-bold tracking-tight text-[#382d24] whitespace-nowrap">{stat.value}</span>
              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1 py-0.5 border rounded-sm whitespace-nowrap bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="h-2.5 w-2.5" />
                {stat.change}
              </span>
            </div>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Two-Column Interactive Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Directory Workspace List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card border border-neutral-200/80 p-5 space-y-4">
            
            {/* Filter & Search Controls */}
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-neutral-200/60">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Quick lookup by title..."
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

            {/* Interactive Grid of Collection Cards */}
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
                    {/* Small Color Bar */}
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

                      {/* Stats & Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100/60">
                        <div className="flex items-center gap-4">
                          <div 
                            onClick={(e) => { e.stopPropagation(); setDrillDownCategory(cat); }}
                            className="text-[9px] font-bold text-[#224870] hover:text-[#382d24] cursor-pointer"
                          >
                            {cat.count} Products
                          </div>
                          <span className="text-[9px] text-[#615e56] font-bold">{cat.orders} Orders</span>
                        </div>

                        {/* Reorder Arrows */}
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <button 
                            disabled={idx === 0}
                            onClick={() => moveCategory(idx, "up")}
                            className="p-1 border border-neutral-200 hover:border-[#224870] disabled:opacity-30 cursor-pointer bg-card transition-colors"
                          >
                            <ChevronLeft className="w-3 h-3 rotate-90" />
                          </button>
                          <button 
                            disabled={idx === filteredCategories.length - 1}
                            onClick={() => moveCategory(idx, "down")}
                            className="p-1 border border-neutral-200 hover:border-[#224870] disabled:opacity-30 cursor-pointer bg-card transition-colors"
                          >
                            <ChevronLeft className="w-3 h-3 -rotate-90" />
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

        {/* Right Side: Sticky Premium Inspector Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
          {activeCategoryDetails ? (
            <div className="bg-card border border-neutral-200/80 p-5 space-y-5">
              
              {/* Card Banner Image Overlay */}
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

              {/* General Description */}
              <div className="space-y-1">
                <span className="text-[8px] font-bold tracking-widest text-[#615e56] uppercase">Overview Description</span>
                <p className="text-[10px] font-semibold text-[#382d24] uppercase tracking-wide leading-relaxed">
                  {activeCategoryDetails.sub}
                </p>
              </div>

              {/* Recharts Analytics Panel */}
              <div className="border-t border-neutral-100 pt-4 space-y-2">
                <span className="text-[8px] font-bold tracking-widest text-[#615e56] uppercase block">June Analytics (Sales Trend)</span>
                <div className="h-[100px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeCategoryTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#224870" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#224870" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 7, fill: "#615e56", fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 7, fill: "#615e56", fontWeight: 700 }} />
                      <Tooltip 
                        contentStyle={{ background: "#fff", border: "1px solid #e5e5e5", fontSize: "7px", fontFamily: "monospace" }} 
                        labelStyle={{ fontWeight: "bold" }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#224870" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subcategories tags */}
              <div className="border-t border-neutral-100 pt-4 space-y-2">
                <span className="text-[8px] font-bold tracking-widest text-[#615e56] uppercase block">Subcategory Nodes</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeCategoryDetails.subCategories && activeCategoryDetails.subCategories.length > 0 ? (
                    activeCategoryDetails.subCategories.map(sub => (
                      <span key={sub.id} className="bg-[#224870]/10 text-[#224870] px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider rounded-sm">
                        {sub.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[8px] text-neutral-400 font-bold uppercase">No nodes linked.</span>
                  )}
                </div>
              </div>

              {/* Google Search SEO Simulation */}
              <div className="border-t border-neutral-100 pt-4 space-y-2">
                <span className="text-[8px] font-bold tracking-widest text-[#615e56] uppercase block flex items-center gap-1"><Globe className="w-3 h-3 text-[#224870]" /> Google SEO Index Preview</span>
                <div className="bg-neutral-50 border border-neutral-200 p-3 space-y-1">
                  <div className="text-[8.5px] font-semibold text-[#1a0dab] hover:underline cursor-pointer tracking-normal lowercase truncate">
                    dripdoggy.com/collections/{activeCategoryDetails.slug || activeCategoryDetails.id}
                  </div>
                  <div className="text-[9.5px] font-bold text-[#1a0dab] leading-tight truncate">
                    {activeCategoryDetails.metaTitle || `${activeCategoryDetails.label} Collection | Drip Doggy`}
                  </div>
                  <div className="text-[8.5px] text-[#545454] leading-normal font-sans uppercase tracking-wider">
                    {activeCategoryDetails.metaDescription || `Browse our exclusive luxury curation of ${activeCategoryDetails.label.toLowerCase()} at Drip Doggy.`}
                  </div>
                </div>
              </div>

              {/* Inspector Buttons */}
              <div className="border-t border-neutral-100 pt-4 flex gap-3.5">
                <button 
                  onClick={(e) => handleOpenEditCategory(activeCategoryDetails, e)}
                  className="flex-1 bg-[#224870] text-white hover:bg-[#224870]/85 text-[9px] font-bold tracking-widest py-2.5 uppercase cursor-pointer border-none transition-all flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3 h-3" /> Edit Collection
                </button>
                <button 
                  onClick={(e) => handleOpenDeleteCategory(activeCategoryDetails, e)}
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

      {/* ── Product count drill-down list modal ───────────────────────── */}
      {drillDownCategory && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setDrillDownCategory(null)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Products in {drillDownCategory.label}</span>
              <button onClick={() => setDrillDownCategory(null)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100">
              {drillDownProducts.map(p => (
                <div key={p.id} className="py-2.5 flex justify-between items-center text-[9px] font-semibold uppercase">
                  <div>
                    <p className="text-[#382d24]">{p.name}</p>
                    <span className="text-[8px] text-neutral-400 font-mono block mt-0.5">{p.sku}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[#382d24]">{RS}{p.price.toLocaleString()}</p>
                    <span className="text-[7.5px] text-neutral-400 font-bold block">{p.orders} Orders</span>
                  </div>
                </div>
              ))}
              {drillDownProducts.length === 0 && (
                <p className="p-4 text-center text-neutral-400 text-[8px] font-bold uppercase">No physical products configured in this category.</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setDrillDownCategory(null)} className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer rounded-none border-none transition-all">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Category Modal ───────────────────────────────────────── */}
      {isAddCatOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsAddCatOpen(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Create Category</span>
              <button onClick={() => setIsAddCatOpen(false)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Category Title</label>
                <input required type="text" value={catLabel} onChange={e => setCatLabel(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Slug Path</label>
                  <input type="text" value={catSlug} onChange={e => setCatSlug(e.target.value)} placeholder="e.g. outerwear" className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
                </div>
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Parent Hierarchy</label>
                  <select value={catParent} onChange={e => setCatParent(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] transition-all">
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Sub Description</label>
                <input required type="text" value={catSub} onChange={e => setCatSub(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Subcategories (Comma separated)</label>
                <input type="text" value={catSubText} onChange={e => setCatSubText(e.target.value)} placeholder="e.g. Maxi, Midi, Mini" className="w-full bg-card border border-neutral-200 text-[9.5px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Banner Image URL or Upload</label>
                <input type="file" ref={fileInputRef} onChange={handleBannerUpload} accept="image/*" className="hidden" />
                <div className="flex gap-2">
                  <input type="text" value={catBannerImage} onChange={e => setCatBannerImage(e.target.value)} placeholder="Image link" className="flex-1 bg-card border border-neutral-200 text-[9.5px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-neutral-200 hover:border-[#224870] text-neutral-600 px-3 text-[8px] font-bold uppercase cursor-pointer rounded-none bg-card transition-colors"><Upload className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {/* SEO metadata fields */}
              <div className="border-t border-neutral-100 pt-2 space-y-2">
                <span className="text-[7.5px] font-bold tracking-widest text-neutral-400 uppercase block">SEO Metadata</span>
                <div>
                  <input type="text" placeholder="Meta Title" value={catMetaTitle} onChange={e => setCatMetaTitle(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
                </div>
                <div>
                  <textarea rows={2} placeholder="Meta Description" value={catMetaDescription} onChange={e => setCatMetaDescription(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddCatOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
                <button type="submit" className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-all">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Category Modal ──────────────────────────────────────── */}
      {isEditCatOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsEditCatOpen(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#382d24] uppercase">Edit Category Settings</span>
              <button onClick={() => setIsEditCatOpen(false)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryEdit} className="space-y-3">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Category Title</label>
                <input required type="text" value={catLabel} onChange={e => setCatLabel(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Slug Path</label>
                  <input type="text" value={catSlug} onChange={e => setCatSlug(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
                </div>
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Parent Hierarchy</label>
                  <select value={catParent} onChange={e => setCatParent(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] transition-all">
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Sub Description</label>
                <input required type="text" value={catSub} onChange={e => setCatSub(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Subcategories (Comma separated)</label>
                <input type="text" value={catSubText} onChange={e => setCatSubText(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Banner Image URL</label>
                <input type="file" ref={fileInputRef} onChange={handleBannerUpload} accept="image/*" className="hidden" />
                <div className="flex gap-2">
                  <input type="text" value={catBannerImage} onChange={e => setCatBannerImage(e.target.value)} className="flex-1 bg-card border border-neutral-200 text-[9.5px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-neutral-200 hover:border-[#224870] text-neutral-600 px-3 text-[8px] font-bold uppercase cursor-pointer rounded-none bg-card transition-colors"><Upload className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#382d24] uppercase mb-1">Fulfillment Status</label>
                <select value={catStatus} onChange={e => setCatStatus(e.target.value as any)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-semibold uppercase p-2.5 focus:outline-none focus:border-[#224870] rounded-none cursor-pointer text-[#382d24] transition-all">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* SEO metadata fields */}
              <div className="border-t border-neutral-100 pt-2 space-y-2">
                <span className="text-[7.5px] font-bold tracking-widest text-neutral-400 uppercase block">SEO Metadata</span>
                <div>
                  <input type="text" placeholder="Meta Title" value={catMetaTitle} onChange={e => setCatMetaTitle(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
                </div>
                <div>
                  <textarea rows={2} placeholder="Meta Description" value={catMetaDescription} onChange={e => setCatMetaDescription(e.target.value)} className="w-full bg-card border border-neutral-200 text-[9.5px] font-bold p-2.5 focus:outline-none focus:border-[#224870] rounded-none transition-all text-[#382d24]" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsEditCatOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
                <button type="submit" className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ───────────────────────────────── */}
      {isDeleteCatOpen && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setIsDeleteCatOpen(false)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-xs w-full space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#b2533e] uppercase">Warning — Critical Action</h3>
            <p className="text-[9.5px] text-neutral-500 uppercase font-bold leading-normal">
              Are you sure you want to permanently delete category <strong className="text-[#382d24]">{deleteCategoryTarget?.label}</strong>? This removes all subcategory links.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setIsDeleteCatOpen(false)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
              <button 
                onClick={handleConfirmDeleteCategory} 
                className="bg-[#b2533e] text-white hover:bg-red-800 text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none transition-all"
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
