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
}

const sampleProducts: Product[] = [
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
  { id: "#DD-P012", name: "SS26 Linen Blend Jacket", category: "New Arrivals", price: 14499, cost: 5800, stock: 15, status: "Draft", sales: 0, revenue: 0, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-SS26-002", season: "SS26", dateAdded: "2026-06-18", description: "Single-button soft tailored jacket ideal for warm climates." },
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
    { label: "Total Products", value: products.length.toString(), trend: "up", change: "+2 new", desc: "Catalog items linked", color: "text-[#382d24]" },
    { label: "Active Nodes", value: products.filter(p => p.status === "Active").length.toString(), trend: "up", change: "100% capacity", desc: "Visible on store", color: "text-green-700" },
    { label: "Total Sales", value: products.reduce((s, p) => s + p.sales, 0).toLocaleString("en-IN"), trend: "up", change: "+12.4%", desc: "Volume dispatched", color: "text-[#224870]" },
    { label: "Total Revenue", value: RS + (products.reduce((s, p) => s + p.revenue, 0) / 10000000).toFixed(2) + "Cr", trend: "up", change: "+18.8%", desc: "Gross product volume", color: "text-[#8c6239]" },
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
    const headers = ["Product ID,Name,SKU,Category,Price,Stock,Status,Sales,Revenue,Date Added"];
    const rows = listToExport.map(p => `${p.id},"${p.name}","${p.sku}",${p.category},${p.price},${p.stock},${p.status},${p.sales},${p.revenue},${p.dateAdded}`);
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 font-sans text-[#382d24]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#224870]" /> Products
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Drip Doggy product catalog &amp; inventory management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="bg-card hover:bg-neutral-100 border border-neutral-200 text-[#382d24] text-[9.5px] font-bold tracking-widest px-4 py-2.5 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={() => navigate("/admin/products/new")} className="bg-[#224870] hover:bg-[#224870]/85 text-white text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none border-none">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px] hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">{kpi.label}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className={`text-2xl font-bold tracking-tight ${kpi.color} whitespace-nowrap`}>{kpi.value}</span>
              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1 py-0.5 border rounded-sm whitespace-nowrap bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="h-2.5 w-2.5" />
                {kpi.change}
              </span>
            </div>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">{kpi.desc}</p>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input (Left side, solid visible border) */}
            <div className="relative w-full md:w-80">
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
                <th className="py-4 px-3 font-bold cursor-pointer hover:text-[#224870] transition-colors" onClick={() => handleSort("sales")}>
                  Sales / Revenue {sortKey === "sales" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3 ml-0.5 text-[#224870]" /> : <ChevronDown className="inline w-3 h-3 ml-0.5 text-[#224870]" />)}
                </th>
                <th className="py-4 px-3 font-bold">Status</th>
                <th className="py-4 px-4 font-bold text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#fdfaf3]/60 transition-colors group">
                  <td className="py-5 px-4 text-center">
                    <button onClick={() => handleSelectRow(product.id)} className="bg-transparent border-none cursor-pointer text-neutral-300 hover:text-[#224870] p-0 inline-flex items-center justify-center">
                      <span className={`w-4 h-4 border border-neutral-300 inline-flex items-center justify-center transition-all ${selectedIds.includes(product.id) ? "bg-[#224870] border-[#224870]" : "bg-card"}`}>
                        {selectedIds.includes(product.id) && <Check className="w-2.5 h-2.5 text-white" />}
                      </span>
                    </button>
                  </td>
                  <td className="py-5 px-2">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 overflow-hidden bg-neutral-100 border border-neutral-200/60 shrink-0 shadow-xs relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="min-w-0">
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
                    <div>
                      <p className="font-black text-[#382d24] text-[10px]">{product.sales} Sold</p>
                      <p className="font-black text-[#224870] text-[8.5px] mt-0.5">{RS}{(product.revenue / 100000).toFixed(1)}L Gross</p>
                    </div>
                  </td>
                  <td className="py-5 px-3">
                    <div className="flex items-center gap-2">
                      <ToggleSwitch enabled={product.status === "Active"} onClick={() => handleToggleStatus(product.id)} />
                      <span className={`text-[8px] font-black tracking-widest ${product.status === "Active" ? "text-green-700" : "text-amber-700"}`}>{product.status}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setPreviewProduct(product)} title="Quick Preview" className="text-neutral-400 hover:text-[#224870] hover:bg-[#224870]/10 p-2 bg-transparent border-none cursor-pointer rounded-xs transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => navigate(`/admin/products/edit/${product.id.replace("#", "")}`)} title="Edit Product" className="text-neutral-400 hover:text-[#224870] hover:bg-[#224870]/10 p-2 bg-transparent border-none cursor-pointer rounded-xs transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteProduct(product)} title="Delete Product" className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-2 bg-transparent border-none cursor-pointer rounded-xs transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
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

      {/* Quick Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setPreviewProduct(null)}>
          <div className="bg-card border-2 border-[#224870] max-w-md w-full p-6 space-y-4 rounded-none" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#615e56] uppercase">Product Quick Preview</span>
              <button onClick={() => setPreviewProduct(null)} className="text-neutral-400 hover:text-[#382d24] bg-transparent border-none cursor-pointer transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                <img src={previewProduct.image} alt={previewProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-[12px] font-black text-[#382d24] uppercase tracking-wider">{previewProduct.name}</h3>
                <p className="text-[8.5px] text-[#736e64] font-mono font-bold">{previewProduct.id} | {previewProduct.sku}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[7.5px] font-bold tracking-widest bg-neutral-100 px-2 py-0.5 border border-neutral-200/60 uppercase text-neutral-500 rounded-sm">{previewProduct.category}</span>
                  <span className={`text-[7.5px] font-bold tracking-widest px-2 py-0.5 border uppercase rounded-sm ${previewProduct.status === "Active" ? "bg-green-50 border-green-200 text-green-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>{previewProduct.status}</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-[#615e56] uppercase font-semibold leading-relaxed border-t border-neutral-100 pt-3.5">
              {previewProduct.description || "No description configured for this product."}
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-neutral-100">
              <div className="border border-neutral-200 p-2.5 text-center bg-card">
                <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block mb-0.5">Price</span>
                <span className="text-[11px] font-black text-[#382d24]">{RS}{previewProduct.price.toLocaleString("en-IN")}</span>
              </div>
              <div className="border border-neutral-200 p-2.5 text-center bg-card">
                <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block mb-0.5">Stock Level</span>
                <span className={`text-[11px] font-black block ${previewProduct.stock === 0 ? "text-red-600" : "text-[#382d24]"}`}>{previewProduct.stock}</span>
              </div>
              <div className="border border-neutral-200 p-2.5 text-center bg-card">
                <span className="text-[7px] text-neutral-400 uppercase font-bold tracking-wider block mb-0.5">Revenue</span>
                <span className="text-[11px] font-black text-[#224870]">{RS}{previewProduct.revenue.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="pt-2.5 flex justify-end">
              <button onClick={() => setPreviewProduct(null)} className="bg-[#224870] text-white hover:bg-[#224870]/85 text-[9.5px] font-bold tracking-widest px-5 py-2.5 uppercase cursor-pointer border-none rounded-none transition-colors">
                Dismiss
              </button>
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
