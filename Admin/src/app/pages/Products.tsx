import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
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
  discountPrice: number | null;
  stock: number;
  active: boolean;
  sizes: string[];
  image: string | null;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  status: "Active" | "Draft";
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
    { id: "VAR-001", name: "Black", sku: "DD-STR-001-BLK", mrp: 12999, discountPrice: null, stock: 20, active: true, sizes: ["S", "M", "L", "XL"], image: null },
    { id: "VAR-002", name: "Camel", sku: "DD-STR-001-CML", mrp: 12999, discountPrice: 10999, stock: 15, active: true, sizes: ["M", "L", "XL"], image: null },
    { id: "VAR-003", name: "Olive", sku: "DD-STR-001-OLV", mrp: 12999, discountPrice: null, stock: 10, active: true, sizes: ["S", "M", "L"], image: null },
  ] },
  { id: "#DD-P002", name: "Sartorial Trench Coat", category: "Outerwear", price: 24999, cost: 10000, stock: 18, status: "Active", sales: 198, revenue: 4949802, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-SAT-001", season: "FW25", dateAdded: "2026-04-05", description: "Double-breasted oversized trench coat made of waterproof cotton gabardine.", variants: [
    { id: "VAR-004", name: "Black", sku: "DD-SAT-001-BLK", mrp: 24999, discountPrice: 19999, stock: 8, active: true, sizes: ["S", "M", "L", "XL"], image: null },
    { id: "VAR-005", name: "Ivory", sku: "DD-SAT-001-IVR", mrp: 24999, discountPrice: null, stock: 10, active: true, sizes: ["M", "L"], image: null },
  ] },
  { id: "#DD-P003", name: "Cashmere Blend Crew", category: "Knitwear", price: 8999, cost: 3600, stock: 62, status: "Active", sales: 287, revenue: 2582713, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-CAS-001", season: "FW25", dateAdded: "2026-04-18", description: "Minimalist crewneck sweater knitted in 7-gauge soft cashmere blend yarn.", variants: [
    { id: "VAR-006", name: "Charcoal", sku: "DD-CAS-001-CHR", mrp: 8999, discountPrice: null, stock: 25, active: true, sizes: ["S", "M", "L", "XL"], image: null },
    { id: "VAR-007", name: "Navy", sku: "DD-CAS-001-NVY", mrp: 8999, discountPrice: 7999, stock: 22, active: true, sizes: ["XS", "S", "M", "L"], image: null },
    { id: "VAR-008", name: "Ivory", sku: "DD-CAS-001-IVR", mrp: 8999, discountPrice: null, stock: 15, active: false, sizes: ["S", "M"], image: null },
  ] },
  { id: "#DD-P004", name: "Merino Wool Cardigan", category: "Knitwear", price: 11999, cost: 4800, stock: 23, status: "Active", sales: 167, revenue: 2003833, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-MER-001", season: "FW25", dateAdded: "2026-04-20", description: "Heavy knit luxury cardigan with branded horn buttons and patch pockets.", variants: [
    { id: "VAR-009", name: "Burgundy", sku: "DD-MER-001-BRG", mrp: 11999, discountPrice: null, stock: 12, active: true, sizes: ["M", "L", "XL"], image: null },
    { id: "VAR-010", name: "Camel", sku: "DD-MER-001-CML", mrp: 11999, discountPrice: null, stock: 11, active: true, sizes: ["S", "M", "L"], image: null },
  ] },
  { id: "#DD-P005", name: "Signature Silk Blouse", category: "Tops", price: 6999, cost: 2100, stock: 78, status: "Active", sales: 312, revenue: 2183688, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-SIL-001", season: "SS26", dateAdded: "2026-05-01", description: "Relaxed fit standard blouse crafted in 100% mulberry silk.", variants: [
    { id: "VAR-011", name: "Blush", sku: "DD-SIL-001-BLS", mrp: 6999, discountPrice: null, stock: 30, active: true, sizes: ["XS", "S", "M", "L"], image: null },
    { id: "VAR-012", name: "Ivory", sku: "DD-SIL-001-IVR", mrp: 6999, discountPrice: 5999, stock: 28, active: true, sizes: ["S", "M", "L", "XL"], image: null },
    { id: "VAR-013", name: "Black", sku: "DD-SIL-001-BLK", mrp: 6999, discountPrice: null, stock: 20, active: true, sizes: ["XS", "S", "M", "L", "XL"], image: null },
  ] },
  { id: "#DD-P006", name: "Relaxed Linen Shirt", category: "Tops", price: 5499, cost: 1650, stock: 54, status: "Active", sales: 256, revenue: 1407744, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-LIN-001", season: "SS26", dateAdded: "2026-05-15", description: "Breathable airy linen button-down with raw edge details.", variants: [
    { id: "VAR-014", name: "White", sku: "DD-LIN-001-WHT", mrp: 5499, discountPrice: null, stock: 30, active: true, sizes: ["S", "M", "L", "XL"], image: null },
    { id: "VAR-015", name: "Navy", sku: "DD-LIN-001-NVY", mrp: 5499, discountPrice: null, stock: 24, active: true, sizes: ["M", "L", "XL"], image: null },
  ] },
  { id: "#DD-P007", name: "French Terry Hoodie", category: "Tops", price: 4499, cost: 1350, stock: 92, status: "Active", sales: 421, revenue: 1894079, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-FTH-001", season: "SS26", dateAdded: "2026-05-22", description: "Oversized hoodie knitted in heavy-weight French terry loops.", variants: [
    { id: "VAR-016", name: "Black", sku: "DD-FTH-001-BLK", mrp: 4499, discountPrice: 3999, stock: 40, active: true, sizes: ["S", "M", "L", "XL", "XXL"], image: null },
    { id: "VAR-017", name: "Charcoal", sku: "DD-FTH-001-CHR", mrp: 4499, discountPrice: null, stock: 30, active: true, sizes: ["S", "M", "L", "XL"], image: null },
    { id: "VAR-018", name: "Olive", sku: "DD-FTH-001-OLV", mrp: 4499, discountPrice: null, stock: 22, active: true, sizes: ["M", "L"], image: null },
  ] },
  { id: "#DD-P008", name: "Pleated Wool Trousers", category: "Bottoms", price: 9999, cost: 4000, stock: 31, status: "Active", sales: 145, revenue: 1449855, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-PLE-001", season: "FW25", dateAdded: "2026-05-25", description: "Tailored wide-leg trousers built in fine Italian tropical wool fabric.", variants: [
    { id: "VAR-019", name: "Black", sku: "DD-PLE-001-BLK", mrp: 9999, discountPrice: 8499, stock: 16, active: true, sizes: ["28", "30", "32", "34"], image: null },
    { id: "VAR-020", name: "Charcoal", sku: "DD-PLE-001-CHR", mrp: 9999, discountPrice: null, stock: 15, active: true, sizes: ["30", "32", "34"], image: null },
  ] },
  { id: "#DD-P009", name: "Tailored Linen Trousers", category: "Bottoms", price: 7999, cost: 2400, stock: 0, status: "Draft", sales: 0, revenue: 0, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-TLT-002", season: "SS26", dateAdded: "2026-06-01", description: "Minimal cream trousers in durable organic linen yarn.", variants: [
    { id: "VAR-021", name: "Cream", sku: "DD-TLT-002-CRM", mrp: 7999, discountPrice: null, stock: 0, active: true, sizes: ["30", "32", "34"], image: null },
  ] },
  { id: "#DD-P010", name: "Handwoven Silk Scarf", category: "Accessories", price: 3999, cost: 1200, stock: 120, status: "Active", sales: 534, revenue: 2135466, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-SCF-001", season: "All", dateAdded: "2026-06-05", description: "Custom jacquard patterned silk scarf with frayed edge details.", variants: [
    { id: "VAR-022", name: "Multicolor", sku: "DD-SCF-001-MCL", mrp: 3999, discountPrice: null, stock: 60, active: true, sizes: ["One Size"], image: null },
    { id: "VAR-023", name: "Black/Gold", sku: "DD-SCF-001-BGD", mrp: 3999, discountPrice: 3499, stock: 60, active: true, sizes: ["One Size"], image: null },
  ] },
  { id: "#DD-P011", name: "Drip Doggy Varsity Jacket", category: "Signature", price: 19999, cost: 8000, stock: 7, status: "Active", sales: 89, revenue: 1779911, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-VAR-001", season: "FW25", dateAdded: "2026-06-10", description: "High contrast leather-sleeve varsity jacket with chenille embroidery.", variants: [
    { id: "VAR-024", name: "Black/White", sku: "DD-VAR-001-BWH", mrp: 19999, discountPrice: null, stock: 4, active: true, sizes: ["M", "L", "XL"], image: null },
    { id: "VAR-025", name: "Navy/Red", sku: "DD-VAR-001-NRD", mrp: 19999, discountPrice: 17999, stock: 3, active: true, sizes: ["L", "XL"], image: null },
  ] },
  { id: "#DD-P012", name: "SS26 Linen Blend Jacket", category: "New Arrivals", price: 14499, cost: 5800, stock: 15, status: "Draft", sales: 0, revenue: 0, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-SS26-002", season: "SS26", dateAdded: "2026-06-18", description: "Single-button soft tailored jacket ideal for warm climates.", variants: [
    { id: "VAR-026", name: "Natural Linen", sku: "DD-SS26-002-NTL", mrp: 14499, discountPrice: null, stock: 8, active: true, sizes: ["S", "M", "L", "XL"], image: null },
    { id: "VAR-027", name: "Stone", sku: "DD-SS26-002-STN", mrp: 14499, discountPrice: 12999, stock: 7, active: true, sizes: ["M", "L", "XL"], image: null },
  ] },
];

const categories = ["All", "Outerwear", "Knitwear", "Tops", "Bottoms", "Accessories", "Signature", "New Arrivals"];

export function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Draft">("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "low" | "out">("all");
  
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

  const kpiData = useMemo(() => [
    { label: "Total Products", value: products.length.toString(), desc: "Products in catalog", color: "text-[#382d24]" },
    { label: "Active Products", value: products.filter(p => p.status === "Active").length.toString(), desc: "Visible on store", color: "text-[#224870]" },
    { label: "Inactive Products", value: products.filter(p => p.status === "Draft").length.toString(), desc: "Hidden drafts", color: "text-[#615e56]" },
    { label: "Out of Stock", value: products.filter(p => p.stock === 0).length.toString(), desc: "Needs replenishment", color: "text-[#b2533e]" },
  ], [products]);

  const handleToggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "Active" ? "Draft" : "Active" } : p));
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

    // Category Filter
    if (activeCategory !== "All") {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Status Filter
    if (statusFilter === "Active") {
      filtered = filtered.filter(p => p.status === "Active");
    } else if (statusFilter === "Draft") {
      filtered = filtered.filter(p => p.status === "Draft");
    }

    // Stock Filter
    if (stockFilter === "in") {
      filtered = filtered.filter(p => p.stock > 10);
    } else if (stockFilter === "low") {
      filtered = filtered.filter(p => p.stock > 0 && p.stock <= 10);
    } else if (stockFilter === "out") {
      filtered = filtered.filter(p => p.stock === 0);
    }

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
  }, [products, search, activeCategory, statusFilter, stockFilter, sortKey, sortDir]);

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

  const handleBulkStatusChange = (status: "Active" | "Draft") => {
    setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status } : p));
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const listToExport = selectedIds.length > 0 ? products.filter(p => selectedIds.includes(p.id)) : filteredProducts;
    const headers = ["Product ID,Name,SKU,Category,Price,Stock,Status,Date Added"];
    const rows = listToExport.map(p => `${p.id},"${p.name}","${p.sku}",${p.category},${p.price},${p.stock},${p.status},${p.dateAdded}`);
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };  return (
    <div className="space-y-6 font-sans text-[#382d24]">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[90px] hover:shadow-sm transition-shadow">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">{kpi.label}</span>
            <div className="mt-1">
              <span className={`text-2xl font-bold tracking-tight ${kpi.color} whitespace-nowrap`}>{kpi.value}</span>
            </div>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1">{kpi.desc}</p>
          </div>
        ))}
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
            <button onClick={() => handleBulkStatusChange("Draft")} className="bg-transparent border border-white/30 text-white hover:border-white text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer transition-all">
              Bulk Draft
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
          {/* Row 1: Collections Navigation */}
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#615e56] uppercase tracking-widest mb-3">
              <Tags className="w-3.5 h-3.5 text-[#224870]" /> Collections / Departments
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-neutral-200/60 pb-3">
              {categories.map(cat => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                    className={`relative pb-2 text-[10px] font-black uppercase tracking-wider cursor-pointer border-none bg-transparent transition-all ${
                      isActive ? "text-[#224870] font-black" : "text-[#615e56]/80 hover:text-[#382d24]"
                    }`}
                  >
                    {cat}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#224870]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Search on the left, filters on the right (Highly visible layout) */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-4 flex-1">
              {/* Search Input (Left side, solid visible border) */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#382d24]" />
                <input
                  type="text"
                  placeholder="SEARCH CATALOG (NAME, SKU, ID)..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="bg-card border-2 border-neutral-300 focus:border-[#224870] pl-10 pr-4 py-2.5 text-[9.5px] font-black uppercase tracking-wider placeholder-[#736e64] w-full outline-none transition-all text-[#382d24]"
                />
              </div>

              {/* Sub-attribute select drop-downs */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Status segment filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-[#615e56] uppercase tracking-widest">Status:</span>
                  <div className="flex bg-card border border-neutral-300 p-0.5">
                    {(["all", "Active", "Draft"] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                        className={`px-3 py-1.5 text-[8.5px] font-black tracking-widest uppercase border-none cursor-pointer transition-all ${
                          statusFilter === s ? "bg-[#224870] text-white" : "bg-transparent text-[#615e56] hover:text-[#382d24]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Levels Filter (themed dropdown select) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-[#615e56] uppercase tracking-widest">Inventory:</span>
                  <select
                    value={stockFilter}
                    onChange={(e) => { setStockFilter(e.target.value as any); setCurrentPage(1); }}
                    className="bg-card border-2 border-neutral-300 px-3 py-2 text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-[#224870] cursor-pointer text-[#382d24] transition-all"
                  >
                    <option value="all">All Levels</option>
                    <option value="in">In Stock (&gt; 10)</option>
                    <option value="low">Low Stock (1-10)</option>
                    <option value="out">Out of Stock (0)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action buttons inline */}
            <div className="flex items-center gap-2 self-start xl:self-auto">
              <button onClick={handleExportCSV} className="bg-card hover:bg-neutral-100 border border-neutral-200 text-[#382d24] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button onClick={() => navigate("/admin/products/new")} className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none border-none">
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
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
                        <p className="text-[8px] text-[#736e64] font-mono tracking-wider mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-[#382d24]">{product.id}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-300" />
                          <span>{product.sku}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-300" />
                          <span className="text-neutral-400 font-bold uppercase">{product.category}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-300" />
                          <span className="text-neutral-400 font-bold uppercase">{product.season}</span>
                        </p>
                        {/* Variant Chips */}
                        {product.variants && product.variants.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {product.variants.filter(v => v.active).map(v => (
                              <span key={v.id} className="inline-flex items-center gap-1 text-[7.5px] font-bold tracking-wider bg-white border border-neutral-200 px-1.5 py-0.5 uppercase">
                                <span className={`w-2 h-2 rounded-full border border-neutral-300 inline-block ${v.name === 'Black' ? 'bg-black' : v.name === 'Camel' ? 'bg-amber-600' : v.name === 'Olive' ? 'bg-green-700' : v.name === 'Ivory' ? 'bg-amber-50' : v.name === 'Charcoal' ? 'bg-gray-600' : v.name === 'Navy' ? 'bg-blue-900' : v.name === 'Burgundy' ? 'bg-red-900' : v.name === 'Blush' ? 'bg-pink-300' : v.name === 'White' ? 'bg-white' : v.name === 'Cream' ? 'bg-yellow-50' : v.name === 'Multicolor' ? 'bg-gradient-to-r from-red-400 via-blue-400 to-green-400' : v.name === 'Black/White' ? 'bg-gradient-to-r from-black to-white' : v.name === 'Navy/Red' ? 'bg-gradient-to-r from-blue-900 to-red-600' : v.name === 'Natural Linen' ? 'bg-yellow-100' : v.name === 'Stone' ? 'bg-stone-300' : v.name === 'Black/Gold' ? 'bg-gradient-to-r from-black to-yellow-500' : 'bg-neutral-400'}`} />
                                {v.name}
                                {v.sizes.length > 0 && (
                                  <span className="text-[6.5px] text-neutral-400 font-mono ml-0.5">
                                    ({v.sizes.join(", ")})
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-3 font-black text-[#382d24] text-[11px]">{RS}{product.price.toLocaleString("en-IN")}</td>
                  <td className="py-5 px-3">
                    {product.stock === 0 ? (
                      <span className="text-[7.5px] font-black tracking-widest bg-red-50 border border-red-200/80 px-2 py-0.5 text-red-700 rounded-sm">
                        OUT OF STOCK
                      </span>
                    ) : product.stock < 10 ? (
                      <span className="text-[7.5px] font-black tracking-widest bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-amber-700 rounded-sm">
                        LOW ({product.stock})
                      </span>
                    ) : (
                      <span className="font-bold text-[#382d24] bg-neutral-50 border border-neutral-200 px-2 py-0.5 text-[8px]">
                        {product.stock} Units
                      </span>
                    )}
                  </td>
                  <td className="py-5 px-3">
                    <div className="flex items-center gap-2">
                      <ToggleSwitch enabled={product.status === "Active"} onClick={() => handleToggleStatus(product.id)} />
                      <span className={`text-[8px] font-black tracking-widest ${product.status === "Active" ? "text-green-700" : "text-amber-700"}`}>{product.status}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setPreviewProduct(product); }} title="Quick Preview" className="text-neutral-400 hover:text-[#224870] hover:bg-[#224870]/10 p-2 bg-transparent border-none cursor-pointer rounded-xs transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
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
                      <span className="text-sm font-black text-[#382d24]">{RS}{previewProduct.price.toLocaleString("en-IN")}</span>
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
                  <div className="space-y-3">
                    {previewProduct.variants.map(v => (
                      <div key={v.id} className={`border ${v.active ? 'border-neutral-200' : 'border-neutral-200/50 bg-neutral-50/50'} p-4`}>
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Variant Image */}
                          <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                            {v.image ? (
                              <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-neutral-300 uppercase">No img</div>
                            )}
                          </div>
                          
                          {/* Variant Details */}
                          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                            <div>
                              <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block">Variant</span>
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
                              <span className="text-[10px] font-black text-[#382d24]">{RS}{v.mrp.toLocaleString("en-IN")}</span>
                            </div>
                            <div>
                              <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block">Discount Price</span>
                              <span className={`text-[10px] font-black ${v.discountPrice ? 'text-green-700' : 'text-neutral-400'}`}>
                                {v.discountPrice ? `${RS}${v.discountPrice.toLocaleString("en-IN")}` : '—'}
                              </span>
                            </div>
                            <div>
                              <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block">Stock</span>
                              <span className={`text-[10px] font-black ${v.stock === 0 ? 'text-red-600' : 'text-[#382d24]'}`}>{v.stock}</span>
                            </div>
                            <div className="sm:col-span-2 lg:col-span-1">
                              <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block">Available Sizes</span>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {v.sizes.map(s => (
                                  <span key={s} className="text-[8px] font-bold bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 text-[#382d24]">{s}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                onClick={() => {
                  setProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
                  setDeleteProduct(null);
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
