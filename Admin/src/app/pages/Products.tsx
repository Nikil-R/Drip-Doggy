import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/app/store/auth-store";
import { productApi } from "@/app/lib/product-api";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Layers,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  ChevronUp,
  ChevronDown,
  Check,
  AlertTriangle,
  Package,
  Tags
} from "lucide-react";

const RS = "₹";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
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

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  mrp: number;
  discountType: "percentage" | "value";
  discountValue: number;
  finalPrice: number;
  sizeStock: Record<string, number>; // Maps size to its quantity
  active: boolean;
  sizes: string[];
  images: string[];
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  status: "Active" | "Inactive";
  sales: number;
  revenue: number;
  image: string;
  sku: string;
  season: string;
  dateAdded: string;
  description: string;
  variants: ProductVariant[];
}

const sampleProducts: Product[] = [
  { id: "#DD-P001", name: "Structured Canvas Jacket", category: "Outerwear", price: 12999, cost: 5200, stock: 45, status: "Active", sales: 342, revenue: 4445658, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-STR-001", season: "SS26", dateAdded: "2026-03-12", description: "Premium heavy-weight structured canvas utility jacket with signature hardware.", variants: [
    { id: "VAR-001", name: "Black", sku: "DD-STR-001-BLK", mrp: 12999, discountType: "percentage", discountValue: 0, finalPrice: 12999, sizeStock: { "S": 10, "M": 5, "L": 5 }, active: true, sizes: ["S", "M", "L"], images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop"] },
    { id: "VAR-002", name: "Camel", sku: "DD-STR-001-CML", mrp: 12999, discountType: "value", discountValue: 2000, finalPrice: 10999, sizeStock: { "M": 10, "L": 5 }, active: true, sizes: ["M", "L"], images: [] },
    { id: "VAR-003", name: "Olive", sku: "DD-STR-001-OLV", mrp: 12999, discountType: "percentage", discountValue: 0, finalPrice: 12999, sizeStock: { "S": 5, "M": 5 }, active: true, sizes: ["S", "M"], images: [] },
  ] },
  { id: "#DD-P002", name: "Sartorial Trench Coat", category: "Outerwear", price: 24999, cost: 10000, stock: 18, status: "Active", sales: 198, revenue: 4949802, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-SAT-001", season: "FW25", dateAdded: "2026-04-05", description: "Double-breasted oversized trench coat made of waterproof cotton gabardine.", variants: [
    { id: "VAR-004", name: "Black", sku: "DD-SAT-001-BLK", mrp: 24999, discountType: "value", discountValue: 5000, finalPrice: 19999, sizeStock: { "S": 4, "M": 4 }, active: true, sizes: ["S", "M"], images: ["https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop"] },
    { id: "VAR-005", name: "Ivory", sku: "DD-SAT-001-IVR", mrp: 24999, discountType: "percentage", discountValue: 0, finalPrice: 24999, sizeStock: { "M": 10 }, active: true, sizes: ["M"], images: [] },
  ] },
  { id: "#DD-P003", name: "Cashmere Blend Crew", category: "Knitwear", price: 8999, cost: 3600, stock: 62, status: "Active", sales: 287, revenue: 2582713, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-CAS-001", season: "FW25", dateAdded: "2026-04-18", description: "Minimalist crewneck sweater knitted in 7-gauge soft cashmere blend yarn.", variants: [
    { id: "VAR-006", name: "Charcoal", sku: "DD-CAS-001-CHR", mrp: 8999, discountType: "percentage", discountValue: 0, finalPrice: 8999, sizeStock: { "S": 10, "M": 15 }, active: true, sizes: ["S", "M"], images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop"] },
    { id: "VAR-007", name: "Navy", sku: "DD-CAS-001-NVY", mrp: 8999, discountType: "value", discountValue: 1000, finalPrice: 7999, sizeStock: { "S": 12, "M": 10 }, active: true, sizes: ["S", "M"], images: [] },
  ] }
];

const categories = ["All", "Outerwear", "Knitwear", "Tops", "Bottoms", "Accessories", "Signature", "New Arrivals"];

const mapBackendProductToFrontend = (p: any): any => {
  if (!p) return null;
  try {
    let totalStock = 0;
    const mappedVariants = (p.variants || []).map((v: any) => {
      if (!v) return null;
      const sizeStockMap: Record<string, number> = {};
      (v.sizes || []).forEach((s: any) => {
        if (s && s.sizeName) {
          sizeStockMap[s.sizeName] = s.stockQuantity || 0;
          totalStock += s.stockQuantity || 0;
        }
      });
      return {
        id: v.id ? String(v.id) : "",
        name: v.variantName || "",
        sku: v.skuCode || "",
        mrp: v.mrp || 0,
        discountType: v.discountType?.toLowerCase() || "percentage",
        discountValue: v.discountValue || 0,
        finalPrice: v.price || v.mrp || 0,
        sizeStock: sizeStockMap,
        active: v.isActive !== false,
        sizes: (v.sizes || []).map((s: any) => s?.sizeName).filter(Boolean),
        images: v.imageUrls || []
      };
    }).filter(Boolean);

    return {
      id: p.id ? `#DD-P${p.id}` : "",
      name: p.productName || "",
      category: p.categoryName || "Uncategorized",
      price: p.variants && p.variants.length > 0 ? Math.min(...p.variants.map((v: any) => v?.price || v?.mrp || 0)) : 0,
      cost: 0,
      stock: totalStock,
      status: p.isActive !== false ? "Active" : "Inactive",
      sales: 0,
      revenue: 0,
      image: p.variants && p.variants.length > 0 && p.variants[0].imageUrls && p.variants[0].imageUrls.length > 0 
        ? p.variants[0].imageUrls[0] 
        : "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop",
      sku: p.skuCode || "",
      season: p.baseTitle || "SS26",
      dateAdded: "2026-06-01",
      description: p.productDescription || "",
      variants: mappedVariants,
      specification: p.specification || null,
      features: (p.features || []).map((f: any) => f?.featureName).filter(Boolean),
      subcategory: p.subcategoryName || "Uncategorized"
    };
  } catch (err) {
    console.error("Failed to map backend product to frontend:", p, err);
    return null;
  }
};

export function ProductsPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");
  const [checkedStocks, setCheckedStocks] = useState<string[]>(["in", "low", "out"]);
  const [genderFilter, setGenderFilter] = useState<string>("All");
  
  // Sort State
  const [sortKey, setSortKey] = useState<keyof Product>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Selection State for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Panels State
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const loadProducts = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const list = await productApi.fetchAllProducts(token);
      console.log("FETCHED PRODUCTS:", JSON.stringify(list, null, 2));
      setProducts(list.map(mapBackendProductToFrontend).filter(Boolean));
    } catch (e) {
      console.error("Error loading products", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [token]);

  const getProductStockSum = (p: Product) => {
    let sum = 0;
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach(v => {
        if (v.sizeStock) {
          Object.values(v.sizeStock).forEach(qty => { sum += (Number(qty) || 0); });
        }
      });
    } else {
      sum = p.stock;
    }
    return sum;
  };

  const kpiData = useMemo(() => {
    return [
      { id: "all", label: "Total Products", value: products.length.toString(), desc: "Click to reset active status filter", color: "text-[#382d24]" },
      { id: "active", label: "Active Products", value: products.filter(p => p.status === "Active").length.toString(), desc: "Click to show active products", color: "text-[#224870]" },
      { id: "inactive", label: "Inactive Products", value: products.filter(p => p.status === "Inactive").length.toString(), desc: "Click to show inactive products", color: "text-[#615e56]" },
      { id: "outofstock", label: "Out of Stock", value: products.filter(p => getProductStockSum(p) === 0).length.toString(), desc: "Click to filter out-of-stock items", color: "text-[#b2533e]" },
    ];
  }, [products]);

  const handleToggleStatus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stops preview product modal from opening
    if (!token) return;
    try {
      const rawId = parseInt(id.replace("#DD-P", "").replace("DD-P", ""));
      await productApi.toggleProductStatus(rawId, token);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p));
    } catch (err) {
      console.error("Error toggling status", err);
    }
  };

  const handleSort = (key: keyof Product) => {
    if (sortKey === key) {
      setSortDir(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Subcategory Filter
    if (activeCategory !== "All") {
      filtered = filtered.filter(p => p.subcategory?.toLowerCase() === activeCategory.toLowerCase());
    }

    // Gender Category Filter
    if (genderFilter !== "All") {
      filtered = filtered.filter(p => {
        const nameClean = p.name.toLowerCase();
        if (genderFilter === "Women") {
          return nameClean.includes("silk") || nameClean.includes("trench") || nameClean.includes("blouse") || nameClean.includes("jacket") || p.id === "#DD-P001" || p.id === "#DD-P002";
        }
        if (genderFilter === "Men") {
          return nameClean.includes("crew") || nameClean.includes("cardigan") || nameClean.includes("hoodie") || nameClean.includes("shirt") || p.id === "#DD-P003";
        }
        if (genderFilter === "Unisex") {
          return nameClean.includes("scarf") || nameClean.includes("varsity") || nameClean.includes("trousers");
        }
        return true;
      });
    }

    // Status Filter
    if (statusFilter === "Active") {
      filtered = filtered.filter(p => p.status === "Active");
    } else if (statusFilter === "Inactive") {
      filtered = filtered.filter(p => p.status === "Inactive");
    }

    // Stock Filter
    filtered = filtered.filter(p => {
      const totalStock = getProductStockSum(p);
      let currentLevel = "in";
      if (totalStock === 0) {
        currentLevel = "out";
      } else if (totalStock <= 10) {
        currentLevel = "low";
      }
      return checkedStocks.includes(currentLevel);
    });

    // Search Query
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }

    // Sort Execution
    filtered = [...filtered].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDir === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });

    return filtered;
  }, [products, search, activeCategory, genderFilter, statusFilter, checkedStocks, sortKey, sortDir]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    const currentIds = paginatedProducts.map(p => p.id);
    const allSelected = currentIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    }
  };

  const handleBulkStatusChange = (status: "Active" | "Inactive") => {
    setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status } : p));
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const listToExport = selectedIds.length > 0 ? products.filter(p => selectedIds.includes(p.id)) : filteredProducts;
    const headers = ["Product ID,Name,SKU,Category,Price,Stock,Status,Date Added"];
    const rows = listToExport.map(p => {
      const sumStock = getProductStockSum(p);
      return `${p.id},"${p.name}","${p.sku}",${p.category},${p.price},${sumStock},${p.status},${p.dateAdded}`;
    });
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to check if a specific KPI filter is currently active
  const isKpiSelected = (id: string) => {
    if (id === "active") return statusFilter === "Active";
    if (id === "inactive") return statusFilter === "Inactive";
    if (id === "outofstock") return checkedStocks.length === 1 && checkedStocks[0] === "out";
    return false;
  };

  // Click handler for KPI Cards to apply statuses/stock filtering dynamically
  const handleKpiClick = (id: string) => {
    if (id === "all") return; // Non-interactive
    setCurrentPage(1);

    if (id === "active") {
      setStatusFilter(prev => prev === "Active" ? "all" : "Active");
      setCheckedStocks(["in", "low", "out"]);
    } else if (id === "inactive") {
      setStatusFilter(prev => prev === "Inactive" ? "all" : "Inactive");
      setCheckedStocks(["in", "low", "out"]);
    } else if (id === "outofstock") {
      setStatusFilter("all");
      setCheckedStocks(prev => prev.length === 1 && prev[0] === "out" ? ["in", "low", "out"] : ["out"]);
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#382d24]">

      {/* KPI Cards (Interactive Filters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const selected = isKpiSelected(kpi.id);
          const isInteractive = kpi.id !== "all";
          return (
            <div
              key={kpi.id}
              onClick={() => isInteractive && handleKpiClick(kpi.id)}
              className={`bg-card border p-5 flex flex-col justify-between min-h-[90px] transition-all duration-300 ${
                isInteractive ? "cursor-pointer hover:shadow-md" : ""
              } ${
                selected ? "border-[#224870] border-2 shadow-xs bg-[#224870]/5" : "border-neutral-200/80"
              }`}
            >
              <span className="text-[10px] font-black tracking-[0.15em] text-[#615e56] uppercase">{kpi.label}</span>
              <div className="mt-2">
                <span className={`text-3xl font-black tracking-tight ${kpi.color} whitespace-nowrap`}>{kpi.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Actions / Selection Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#224870] text-white p-4 flex items-center justify-between border border-[#224870]/90">
          <span className="text-[10px] font-[900] tracking-widest uppercase flex items-center gap-2">
            <Check className="w-4 h-4 bg-white/20 p-0.5 rounded-full" /> {selectedIds.length} Products Selected
          </span>
          <div className="flex items-center gap-3">
            <button onClick={() => handleBulkStatusChange("Active")} className="bg-transparent border border-white/30 text-white hover:border-white text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer transition-all">
              Bulk Activate
            </button>
            <button onClick={() => handleBulkStatusChange("Inactive")} className="bg-transparent border border-white/30 text-white hover:border-white text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer transition-all">
              Bulk Deactivate
            </button>
            <button onClick={handleBulkDelete} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer border-none transition-all">
              Bulk Delete
            </button>
            <button onClick={() => setSelectedIds([])} className="bg-transparent border-none text-white/60 hover:text-white p-1.5 cursor-pointer transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Unified Filter & Catalog Panel */}
      <div className="bg-card border border-neutral-200/80 rounded-none overflow-hidden">
        
        {/* Filter Section */}
        <div className="p-6 border-b border-neutral-200/60 space-y-6">
          
          {/* Top Row: Search, Categories, Inventory dropdown, Export, and Add Product */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* 1. Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#382d24]" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="bg-card border-2 border-neutral-300 focus:border-[#224870] pl-9 pr-3 py-2 text-[9.5px] font-black uppercase tracking-wider placeholder-[#736e64] w-full outline-none transition-all text-[#382d24]"
              />
            </div>

            {/* 2. Category Selector Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black text-[#615e56] uppercase tracking-widest shrink-0">Category:</span>
              <select
                value={genderFilter}
                onChange={(e) => {
                  setGenderFilter(e.target.value);
                  setActiveCategory("All");
                  setCurrentPage(1);
                }}
                className="bg-card border-2 border-neutral-300 px-3 py-2 text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-[#224870] cursor-pointer text-[#382d24] transition-all"
              >
                <option value="All">All Categories</option>
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            {/* 3. Stock Level Selector Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black text-[#615e56] uppercase tracking-widest shrink-0">Inventory:</span>
              <select
                value={checkedStocks.length === 3 ? "all" : checkedStocks[0] || "all"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "all") {
                    setCheckedStocks(["in", "low", "out"]);
                  } else {
                    setCheckedStocks([val]);
                  }
                  setCurrentPage(1);
                }}
                className="bg-card border-2 border-neutral-300 px-3 py-2 text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-[#224870] cursor-pointer text-[#382d24] transition-all"
              >
                <option value="all">All Levels</option>
                <option value="in">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            {/* Spacer to push action buttons right on large screens */}
            <div className="flex-1 min-w-0 md:block hidden" />

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handleExportCSV} className="bg-card hover:bg-neutral-100 border border-neutral-200 text-[#382d24] text-[9.5px] font-bold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button onClick={() => navigate("/admin/products/new")} className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none border-none">
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>

          </div>

          {/* Bottom Row: Dynamic Subcategories Navigation based on Category selection */}
          <div className="border-t border-neutral-200/40 pt-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-[#615e56] uppercase tracking-widest shrink-0">Subcategories:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => { setActiveCategory("All"); setCurrentPage(1); }}
                  className={`px-3 py-1.5 text-[8.5px] font-black uppercase tracking-wider cursor-pointer transition-all border ${
                    activeCategory === "All"
                      ? "bg-[#224870] border-[#224870] text-white"
                      : "bg-transparent border-neutral-200 text-[#615e56] hover:border-neutral-400"
                  }`}
                >
                  All 
                </button>

                {(() => {
                  // Get subcategories map matching category Selection
                  let list: string[] = [];
                  if (genderFilter === "Women") {
                    list = ["Dresses", "Tops", "Knitwear"];
                  } else if (genderFilter === "Men") {
                    list = ["Shirts", "Outerwear"];
                  } else if (genderFilter === "Unisex") {
                    list = ["Bags", "Accessories"];
                  } else {
                    list = ["Dresses", "Tops", "Knitwear", "Shirts", "Outerwear", "Bags", "Accessories"];
                  }

                  return list.map(sub => {
                    const isActive = activeCategory === sub;
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => { setActiveCategory(sub); setCurrentPage(1); }}
                        className={`px-3 py-1.5 text-[8.5px] font-black uppercase tracking-wider cursor-pointer transition-all border ${
                          isActive
                            ? "bg-[#224870] border-[#224870] text-white"
                            : "bg-transparent border-neutral-200 text-[#615e56] hover:border-neutral-400"
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full">
          <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider table-auto">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[9px] text-[#615e56] tracking-[0.12em]">
                <th className="py-4 px-4 w-12 text-center">
                  <button onClick={handleSelectAll} className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#224870] p-0 inline-flex items-center justify-center">
                    <span className={`w-4 h-4 border border-neutral-300 inline-flex items-center justify-center transition-all ${paginatedProducts.every(p => selectedIds.includes(p.id)) ? "bg-[#224870] border-[#224870]" : "bg-card"}`}>
                      {paginatedProducts.every(p => selectedIds.includes(p.id)) && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                  </button>
                </th>
                <th className="py-4 px-2 font-bold cursor-pointer hover:text-[#224870] transition-colors" onClick={() => handleSort("name")}>
                  Product &amp; Catalog Details {sortKey === "name" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3 ml-0.5 text-[#224870]" /> : <ChevronDown className="inline w-3 h-3 ml-0.5 text-[#224870]" />)}
                </th>
                <th className="py-4 px-3 font-bold cursor-pointer hover:text-[#224870] transition-colors" onClick={() => handleSort("price")}>
                  Price {sortKey === "price" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3 ml-0.5 text-[#224870]" /> : <ChevronDown className="inline w-3 h-3 ml-0.5 text-[#224870]" />)}
                </th>
                <th className="py-4 px-3 font-bold cursor-pointer hover:text-[#224870] transition-colors" onClick={() => handleSort("stock")}>
                  Stock Level {sortKey === "stock" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3 ml-0.5 text-[#224870]" /> : <ChevronDown className="inline w-3 h-3 ml-0.5 text-[#224870]" />)}
                </th>
                <th className="py-4 px-3 font-bold">Status</th>
                <th className="py-4 px-4 font-bold text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60">
              {paginatedProducts.map((product) => (
                <tr key={product.id} onClick={() => setPreviewProduct(product)} className="hover:bg-[#fdfaf3]/60 transition-colors group cursor-pointer">
                  <td className="py-5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleSelectRow(product.id)} className="bg-transparent border-none cursor-pointer text-neutral-300 hover:text-[#224870] p-0 inline-flex items-center justify-center">
                      <span className={`w-4 h-4 border border-neutral-300 inline-flex items-center justify-center transition-all ${selectedIds.includes(product.id) ? "bg-[#224870] border-[#224870]" : "bg-card"}`}>
                        {selectedIds.includes(product.id) && <Check className="w-2.5 h-2.5 text-white" />}
                      </span>
                    </button>
                  </td>
                  <td className="py-5 px-2">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 overflow-hidden bg-neutral-100 border border-neutral-200/60 shrink-0 shadow-xs relative mt-0.5">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-black text-[#382d24] tracking-wide truncate">{product.name}</p>
                        <p className="text-[9px] text-[#224870] font-black uppercase tracking-wider mt-1 flex items-center gap-1">
                          <span>{product.variants?.length || 0} {product.variants?.length === 1 ? 'Variant' : 'Variants'}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-3 font-black text-[#382d24] text-[11px]">
                    {product.variants && product.variants.length > 0 ? (
                      <div className="space-y-0.5">
                        <div className="text-[7.5px] text-[#615e56]/80 font-bold uppercase tracking-wider">Starts From</div>
                        <div className="text-[10px] text-neutral-400 font-bold"><span className="text-[#382d24]">{RS}{Math.round(Math.min(...product.variants.map(v => v.finalPrice))).toLocaleString("en-IN")}</span></div>
                      </div>
                    ) : (
                      <span>{RS}{Math.round(product.price).toLocaleString("en-IN")}</span>
                    )}
                  </td>
                  <td className="py-5 px-3">
                    {(() => {
                      // Sum all quantities across all sizes for all variants
                      let totalStock = 0;
                      if (product.variants && product.variants.length > 0) {
                        product.variants.forEach(v => {
                          if (v.sizeStock) {
                            Object.values(v.sizeStock).forEach(qty => {
                              totalStock += (Number(qty) || 0);
                            });
                          }
                        });
                      } else {
                        totalStock = product.stock;
                      }

                      return totalStock === 0 ? (
                        <span className="text-[7.5px] font-black tracking-widest bg-red-50 border border-red-200/80 px-2 py-0.5 text-red-700 rounded-sm">
                          OUT OF STOCK
                        </span>
                      ) : totalStock < 10 ? (
                        <span className="text-[7.5px] font-black tracking-widest bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-amber-700 rounded-sm">
                          LOW ({totalStock})
                        </span>
                      ) : (
                        <span className="font-bold text-[#382d24] bg-neutral-50 border border-neutral-200 px-2 py-0.5 text-[8px]">
                          {totalStock} Units
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-5 px-3">
                    <div className="flex items-center gap-2">
                      <ToggleSwitch enabled={product.status === "Active"} onClick={(e) => handleToggleStatus(product.id, e)} />
                      <span className={`text-[8px] font-black tracking-widest ${product.status === "Active" ? "text-green-700" : "text-amber-700"}`}>{product.status}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/edit/${product.id.replace("#", "")}`); }} title="Edit Product" className="text-neutral-400 hover:text-[#224870] hover:bg-[#224870]/10 p-2 bg-transparent border-none cursor-pointer rounded-xs transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteProduct(product); }} title="Delete Product" className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-2 bg-transparent border-none cursor-pointer rounded-xs transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                    No products match current filter configuration
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-[9.5px] text-[#615e56] font-bold uppercase tracking-wider">
          Showing {paginatedProducts.length} of {filteredProducts.length} filtered products
        </p>
        <div className="flex gap-1.5 items-center">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#224870] bg-card text-[#615e56] text-[8.5px] font-bold tracking-widest px-3.5 py-2 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-none"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-7 h-7 flex items-center justify-center text-[8.5px] font-bold cursor-pointer transition-all border ${currentPage === i + 1 ? "bg-[#224870] text-white border-[#224870]" : "bg-card border-neutral-200 text-[#615e56] hover:border-[#224870]"}`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#224870] bg-card text-[#615e56] text-[8.5px] font-bold tracking-widest px-3.5 py-2 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-none"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Details Modal */}
      {previewProduct && (
        <div className="fixed inset-0 bg-[#382d24]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setPreviewProduct(null)}>
          <div className="bg-white border-2 border-[#224870] max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-none shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#224870]/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#224870]" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[#382d24] uppercase tracking-widest">Product Details</h2>
                  <p className="text-[8.5px] text-[#615e56] font-bold uppercase tracking-wider">{previewProduct.id} — {previewProduct.sku}</p>
                </div>
              </div>
              <button onClick={() => setPreviewProduct(null)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Hero Section: Image + Key Info */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Image */}
                <div className="w-full md:w-48 h-48 bg-neutral-50 border border-neutral-200 overflow-hidden shrink-0">
                  <img src={previewProduct.image} alt={previewProduct.name} className="w-full h-full object-cover" />
                </div>

                {/* Key Info */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-black text-[#382d24] uppercase tracking-wider leading-tight">{previewProduct.name}</h3>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[8px] font-bold tracking-widest bg-neutral-100 px-2.5 py-1 border border-neutral-200/60 uppercase text-neutral-600">{previewProduct.category}</span>
                    <span className="text-[8px] font-bold tracking-widest bg-neutral-100 px-2.5 py-1 border border-neutral-200/60 uppercase text-neutral-600">{previewProduct.season}</span>
                    <span className={`text-[8px] font-bold tracking-widest px-2.5 py-1 border uppercase ${
                      previewProduct.status === "Active" ? "bg-green-50 border-green-200 text-green-700" : "bg-amber-50 border-amber-200 text-amber-700"
                    }`}>{previewProduct.status}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="border border-neutral-200 p-3 text-center bg-[#faf8f5]">
                      <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Price</span>
                      <span className="text-sm font-black text-[#382d24]">{RS}{Math.round(previewProduct.price).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="border border-neutral-200 p-3 text-center bg-[#faf8f5]">
                      <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Total Stock</span>
                      <span className={`text-sm font-black block ${previewProduct.stock === 0 ? "text-red-600" : "text-[#382d24]"}`}>{previewProduct.stock}</span>
                    </div>
                    <div className="border border-neutral-200 p-3 text-center bg-[#faf8f5]">
                      <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Variants</span>
                      <span className="text-sm font-black text-[#224870]">{previewProduct.variants?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-neutral-100 pt-5">
                <h4 className="text-[10px] font-black text-[#615e56] uppercase tracking-widest mb-2.5">Product Description</h4>
                <p className="text-[11px] text-[#382d24] font-medium leading-relaxed">
                  {previewProduct.description || "No description configured for this product."}
                </p>
              </div>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-neutral-100 pt-5">
                <div>
                  <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Product ID</span>
                  <span className="text-[10px] font-bold text-[#382d24] font-mono">{previewProduct.id}</span>
                </div>
                <div>
                  <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">SKU</span>
                  <span className="text-[10px] font-bold text-[#382d24] font-mono">{previewProduct.sku}</span>
                </div>
                <div>
                  <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Season</span>
                  <span className="text-[10px] font-bold text-[#382d24]">{previewProduct.season}</span>
                </div>
                <div>
                  <span className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider block mb-1">Date Added</span>
                  <span className="text-[10px] font-bold text-[#382d24]">{previewProduct.dateAdded}</span>
                </div>
              </div>

              {/* Variants Section */}
              {previewProduct.variants && previewProduct.variants.length > 0 && (
                <div className="border-t border-neutral-100 pt-5">
                  <h4 className="text-[10px] font-black text-[#615e56] uppercase tracking-widest mb-3">
                    Product Variants ({previewProduct.variants.length})
                  </h4>
                  <div className="space-y-4">
                    {previewProduct.variants.map(v => {
                      // Sum this variant's stock
                      const totalVariantStock = v.sizeStock ? Object.values(v.sizeStock).reduce((sum, val) => sum + (Number(val) || 0), 0) : 0;
                      return (
                        <div key={v.id} className={`border ${v.active ? 'border-neutral-200' : 'border-neutral-200/50 bg-neutral-50/50'} p-5 space-y-4`}>
                          <div className="flex flex-col sm:flex-row gap-4">
                            {/* Variant Gallery */}
                            <div className="flex gap-1.5 overflow-x-auto shrink-0 py-0.5 max-w-full sm:max-w-[200px]">
                              {v.images && v.images.length > 0 ? (
                                v.images.map((img, imgIdx) => (
                                  <div key={imgIdx} className="w-14 h-14 bg-neutral-100 border border-neutral-200 shrink-0">
                                    <img src={img} alt={`${v.name} asset ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                  </div>
                                ))
                              ) : (
                                <div className="w-14 h-14 bg-neutral-50 border border-neutral-200 shrink-0 flex items-center justify-center text-[7.5px] font-bold text-neutral-300 uppercase">No Img</div>
                              )}
                            </div>
                            
                            {/* Variant Details */}
                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2.5">
                              <div>
                                <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block">Variant Name</span>
                                <span className="text-[10px] font-bold text-[#382d24] flex items-center gap-1.5">
                                  {!v.active && <span className="text-[7px] text-amber-600 font-bold">(Inactive)</span>}
                                  {v.name}
                                </span>
                              </div>
                              <div>
                                <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block">SKU</span>
                                <span className="text-[9px] font-bold text-[#382d24] font-mono">{v.sku}</span>
                              </div>
                              <div>
                                <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block">MRP</span>
                                <span className="text-[10px] font-black text-[#382d24]">{RS}{Math.round(v.mrp).toLocaleString("en-IN")}</span>
                              </div>
                              <div>
                                <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block">Discount</span>
                                <span className="text-[9px] font-bold text-green-700">
                                  {v.discountValue > 0 ? (
                                    v.discountType === "percentage" ? `${v.discountValue}% Off` : `${RS}${v.discountValue} Off`
                                  ) : "No discount"}
                                </span>
                              </div>
                              <div>
                                <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block">Final Price</span>
                                <span className="text-[10px] font-black text-[#224870]">{RS}{Math.round(v.finalPrice).toLocaleString("en-IN")}</span>
                              </div>
                              <div>
                                <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block">Total Stock</span>
                                <span className={`text-[10px] font-black ${totalVariantStock === 0 ? 'text-red-600' : 'text-[#382d24]'}`}>{totalVariantStock} Units</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block">Available Sizes</span>
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {v.sizes.map(s => (
                                    <span key={s} className="text-[8px] font-bold bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 text-[#382d24]">{s}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Stock Breakdowns by Sizes */}
                          {v.sizes.length > 0 && (
                            <div className="border-t border-neutral-100 pt-3 bg-neutral-50/50 p-2.5 space-y-1.5">
                              <span className="text-[8px] text-[#615e56] uppercase font-bold tracking-wider block">Inventory Breakdown by Size</span>
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {v.sizes.map(size => {
                                  const sizeStockVal = v.sizeStock ? v.sizeStock[size] : 0;
                                  return (
                                    <div key={size} className="bg-white border border-neutral-200 px-2 py-1 flex items-center justify-between text-[8.5px]">
                                      <span className="font-extrabold text-[#615e56]">{size}:</span>
                                      <span className={`font-black ${Number(sizeStockVal) === 0 ? 'text-red-600' : 'text-[#382d24]'}`}>
                                        {sizeStockVal !== undefined ? sizeStockVal : 0}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 flex items-center justify-between">
              <button 
                onClick={() => { setPreviewProduct(null); setDeleteProduct(previewProduct); }} 
                className="border border-[#b2533e] text-[#b2533e] hover:bg-red-50 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer rounded-none transition-all"
              >
                Delete Product
              </button>
              <div className="flex items-center gap-3">
                <button onClick={() => setPreviewProduct(null)} className="border border-neutral-200 hover:border-neutral-400 text-[#615e56] text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none transition-all">
                  Close
                </button>
                <button 
                  onClick={() => navigate(`/admin/products/edit/${previewProduct.id.replace("#", "")}`)}
                  className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-6 py-2.5 uppercase flex items-center gap-2 cursor-pointer border-none rounded-none transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProduct && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setDeleteProduct(null)}>
          <div className="bg-card border-2 border-[#224870] p-6 max-w-sm w-full space-y-4 rounded-none" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-[#b2533e]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-xs font-black tracking-widest uppercase">Warning — Critical Action</h3>
            </div>
            <p className="text-[10px] text-[#615e56] uppercase font-bold leading-normal">
              Are you sure you want to permanently delete <strong className="text-[#382d24]">{deleteProduct.name}</strong> from the catalog? This action is irreversible.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button onClick={() => setDeleteProduct(null)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase bg-transparent cursor-pointer rounded-none transition-all">Cancel</button>
              <button 
                onClick={async () => {
                  if (!token) return;
                  try {
                    const rawId = parseInt(deleteProduct.id.replace("#DD-P", "").replace("DD-P", ""));
                    await productApi.deleteProduct(rawId, token);
                    setProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
                    setDeleteProduct(null);
                  } catch (err) {
                    console.error("Error deleting product", err);
                  }
                }} 
                className="bg-[#b2533e] text-white hover:bg-red-800 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer rounded-none border-none transition-all"
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
