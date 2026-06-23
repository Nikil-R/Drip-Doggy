import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
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
  Copy,
  Check
} from "lucide-react";

const RS = "₹";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
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

// ─── Drip Doggy Products ─────────────────────────────────────────────────

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
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [activeMoreMenuId, setActiveMoreMenuId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const kpiData = useMemo(() => [
    { label: "Total Products", value: products.length.toString(), icon: Layers, color: "text-[#030213]" },
    { label: "Active", value: products.filter(p => p.status === "Active").length.toString(), icon: Eye, color: "text-green-700" },
    { label: "Total Sales", value: products.reduce((s, p) => s + p.sales, 0).toLocaleString("en-IN"), icon: TrendingUp, color: "text-[#030213]" },
    { label: "Total Revenue", value: RS + products.reduce((s, p) => s + p.revenue, 0).toLocaleString("en-IN"), icon: DollarSign, color: "text-amber-700" },
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

  // Toggle selection for bulk actions
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

  // Bulk Operations
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

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProduct) return;
    setProducts(prev => prev.map(p => p.id === editProduct.id ? editProduct : p));
    setEditProduct(null);
  };

  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">
            Products
          </h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy product catalog &amp; inventory management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="bg-card hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={() => navigate("/admin/products/new")} className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none border-none">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="bg-card border border-neutral-200/80 p-4 flex items-center gap-3">
            <kpi.icon className={`w-5 h-5 text-neutral-400 shrink-0`} />
            <div>
              <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[7px] text-neutral-400 font-semibold uppercase tracking-wider">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bulk Actions / Selection Bar ─────────────────────────────── */}
      {selectedIds.length > 0 && (
        <div className="bg-[#030213] text-white p-3.5 flex items-center justify-between border border-[#030213]">
          <span className="text-[8px] font-bold tracking-widest uppercase">
            {selectedIds.length} Products Selected
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => handleBulkStatusChange("Active")} className="bg-transparent border border-white/20 text-white hover:border-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer">
              Bulk Activate
            </button>
            <button onClick={() => handleBulkStatusChange("Draft")} className="bg-transparent border border-white/20 text-white hover:border-white text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase cursor-pointer">
              Bulk Draft
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

      {/* ── Filters ────────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-card border border-neutral-200/80 p-4">
        <div className="flex flex-wrap gap-1.5 items-center">
          {/* Category tabs */}
          <div className="flex bg-card border border-neutral-200/80 p-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-[7px] font-semibold tracking-widest uppercase border-none cursor-pointer ${
                  activeCategory === cat ? "bg-[#030213] text-white" : "bg-transparent text-neutral-400 hover:text-[#030213]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Status filter */}
          <div className="flex bg-card border border-neutral-200/80 p-1">
            {(["all", "Active", "Draft"] as const).map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                className={`px-2.5 py-1 text-[7px] font-semibold tracking-widest uppercase border-none cursor-pointer ${
                  statusFilter === s ? "bg-[#030213] text-white" : "bg-transparent text-neutral-400 hover:text-[#030213]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Stock Filter */}
          <div className="flex border border-neutral-200/80 bg-card px-2 py-1">
            <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest mr-1 self-center">Stock:</span>
            <select
              value={stockFilter}
              onChange={(e) => { setStockFilter(e.target.value as any); setCurrentPage(1); }}
              className="bg-transparent border-none text-[8px] font-semibold uppercase tracking-widest focus:outline-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full xl:w-auto justify-between xl:justify-end">
          <div className="relative flex-1 xl:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search name, SKU..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="bg-card border border-neutral-200/80 pl-8 pr-3 py-2 text-[9px] font-semibold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-full xl:w-52"
            />
          </div>
        </div>
      </div>

      {/* ── Products Table ─────────────────────────────────────────── */}
      <div className="bg-card border border-neutral-200/80 overflow-hidden">
        <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider">
          <thead>
            <tr className="border-b border-neutral-200 bg-card/60 text-[8px] text-neutral-400 tracking-[0.2em]">
              <th className="p-3 w-8">
                <button onClick={handleSelectAll} className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#030213] p-0 flex items-center">
                  <span className={`w-3.5 h-3.5 border border-neutral-300 inline-block flex items-center justify-center ${paginatedProducts.every(p => selectedIds.includes(p.id)) ? "bg-[#030213] border-[#030213]" : ""}`}>
                    {paginatedProducts.every(p => selectedIds.includes(p.id)) && <Check className="w-2.5 h-2.5 text-white" />}
                  </span>
                </button>
              </th>
              <th className="p-3 font-bold cursor-pointer hover:text-[#030213]" onClick={() => handleSort("name")}>
                Product {sortKey === "name" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
              </th>
              <th className="p-3 font-bold cursor-pointer hover:text-[#030213]" onClick={() => handleSort("sku")}>
                SKU {sortKey === "sku" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
              </th>
              <th className="p-3 font-bold cursor-pointer hover:text-[#030213]" onClick={() => handleSort("category")}>
                Category {sortKey === "category" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
              </th>
              <th className="p-3 font-bold cursor-pointer hover:text-[#030213]" onClick={() => handleSort("price")}>
                Price {sortKey === "price" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
              </th>
              <th className="p-3 font-bold cursor-pointer hover:text-[#030213]" onClick={() => handleSort("stock")}>
                Stock {sortKey === "stock" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
              </th>
              <th className="p-3 font-bold cursor-pointer hover:text-[#030213]" onClick={() => handleSort("sales")}>
                Sales {sortKey === "sales" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
              </th>
              <th className="p-3 font-bold cursor-pointer hover:text-[#030213]" onClick={() => handleSort("revenue")}>
                Revenue {sortKey === "revenue" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
              </th>
              <th className="p-3 font-bold cursor-pointer hover:text-[#030213]" onClick={() => handleSort("dateAdded")}>
                Date Added {sortKey === "dateAdded" && (sortDir === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
              </th>
              <th className="p-3 font-bold">Status</th>
              <th className="p-3 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60">
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-100/50 transition-colors">
                <td className="p-3">
                  <button onClick={() => handleSelectRow(product.id)} className="bg-transparent border-none cursor-pointer text-neutral-400 hover:text-[#030213] p-0 flex items-center">
                    <span className={`w-3.5 h-3.5 border border-neutral-300 inline-block flex items-center justify-center ${selectedIds.includes(product.id) ? "bg-[#030213] border-[#030213]" : ""}`}>
                      {selectedIds.includes(product.id) && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 overflow-hidden bg-neutral-100 border border-neutral-200/50 shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-[#030213]">{product.name}</p>
                      <p className="text-[7px] text-neutral-400 font-semibold">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-neutral-400 font-mono text-[8px]">{product.sku}</td>
                <td className="p-3">
                  <span className="text-[7px] font-semibold tracking-widest bg-neutral-100 border border-neutral-200/60 px-2 py-0.5">
                    {product.category}
                  </span>
                </td>
                <td className="p-3 font-bold text-[#030213]">{RS}{product.price.toLocaleString("en-IN")}</td>
                <td className="p-3">
                  <span className={`font-semibold ${product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-amber-600" : "text-[#030213]"}`}>
                    {product.stock === 0 ? "OOS" : product.stock}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#030213]">{product.sales}</span>
                    <div className="w-12 h-1 bg-neutral-200">
                      <div className="h-full bg-[#030213]" style={{ width: Math.min((product.sales / 500) * 100, 100) + "%" }} />
                    </div>
                  </div>
                </td>
                <td className="p-3 font-bold text-[#030213]">{RS}{product.revenue.toLocaleString("en-IN")}</td>
                <td className="p-3 text-neutral-500 font-mono text-[8px]">{product.dateAdded}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <ToggleSwitch enabled={product.status === "Active"} onClick={() => handleToggleStatus(product.id)} />
                    <span className={`text-[7px] font-semibold tracking-widest ${product.status === "Active" ? "text-green-700" : "text-amber-700"}`}>{product.status}</span>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1 relative">
                    <button onClick={() => setPreviewProduct(product)} title="Quick Preview" className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setEditProduct(product)} title="Edit Product" className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteProduct(product)} title="Delete Product" className="text-neutral-400 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="relative">
                      <button onClick={() => setActiveMoreMenuId(activeMoreMenuId === product.id ? null : product.id)} className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                      {activeMoreMenuId === product.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMoreMenuId(null)} />
                          <div className="absolute right-0 mt-1 bg-card border-2 border-[#030213] w-28 text-left z-20 shadow-md">
                            <button onClick={() => { 
                              const dupe = { ...product, id: `#DD-P${Math.floor(100 + Math.random() * 900)}`, sku: product.sku + "-COPY", name: product.name + " (Copy)" };
                              setProducts(prev => [dupe, ...prev]);
                              setActiveMoreMenuId(null);
                            }} className="w-full text-left px-3 py-1.5 text-[8px] font-bold uppercase hover:bg-neutral-100 border-none bg-transparent cursor-pointer">
                              Duplicate
                            </button>
                            <button onClick={() => {
                              handleToggleStatus(product.id);
                              setActiveMoreMenuId(null);
                            }} className="w-full text-left px-3 py-1.5 text-[8px] font-bold uppercase hover:bg-neutral-100 border-t border-neutral-200 bg-transparent cursor-pointer border-none">
                              {product.status === "Active" ? "Set Draft" : "Set Active"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={11} className="p-6 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                  No products match current filter configuration
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">
          Showing {paginatedProducts.length} of {filteredProducts.length} filtered products
        </p>
        <div className="flex gap-1 items-center">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] bg-card text-neutral-500 text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-3 h-3" /> Prev
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-7 h-7 flex items-center justify-center text-[8px] font-semibold cursor-pointer border ${currentPage === i + 1 ? "bg-[#030213] text-white border-[#030213]" : "bg-card border-neutral-200 text-neutral-500 hover:border-[#030213]"}`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] bg-card text-neutral-500 text-[8px] font-semibold tracking-widest px-3 py-1.5 uppercase transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
          >
            Next <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── Quick Preview Modal ─────────────────────────────────────── */}
      {previewProduct && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setPreviewProduct(null)}>
          <div className="bg-card border-2 border-[#030213] max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Product Quick Preview</span>
              <button onClick={() => setPreviewProduct(null)} className="text-[9px] font-bold text-neutral-400 hover:text-[#030213] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                <img src={previewProduct.image} alt={previewProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[11px] font-bold text-[#030213] uppercase tracking-wider">{previewProduct.name}</h3>
                <p className="text-[8px] text-neutral-400 font-mono">{previewProduct.id} | {previewProduct.sku}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[8px] font-semibold tracking-widest bg-neutral-100 px-2 py-0.5 border border-neutral-200">{previewProduct.category}</span>
                  <span className={`text-[8px] font-semibold tracking-widest px-2 py-0.5 border ${previewProduct.status === "Active" ? "bg-green-50 border-green-200 text-green-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>{previewProduct.status}</span>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-neutral-600 uppercase font-semibold leading-relaxed border-t border-neutral-100 pt-3">
              {previewProduct.description || "No description configured for this product."}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100">
              <div className="border border-neutral-200 p-2 text-center bg-card/40">
                <span className="text-[6px] text-neutral-400 uppercase font-bold tracking-wider block">Price</span>
                <span className="text-[10px] font-bold text-[#030213]">{RS}{previewProduct.price.toLocaleString("en-IN")}</span>
              </div>
              <div className="border border-neutral-200 p-2 text-center bg-card/40">
                <span className="text-[6px] text-neutral-400 uppercase font-bold tracking-wider block">Stock Level</span>
                <span className={`text-[10px] font-bold block ${previewProduct.stock === 0 ? "text-red-600" : "text-[#030213]"}`}>{previewProduct.stock}</span>
              </div>
              <div className="border border-[#030213]/10 p-2 text-center bg-card/40">
                <span className="text-[6px] text-neutral-400 uppercase font-bold tracking-wider block">Sales Revenue</span>
                <span className="text-[10px] font-bold text-[#030213]">{RS}{previewProduct.revenue.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setPreviewProduct(null)} className="bg-[#030213] text-white hover:bg-neutral-800 text-[9px] font-bold tracking-widest px-5 py-2 uppercase cursor-pointer border-none rounded-none">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Product Quick Modal ─────────────────────────────────── */}
      {editProduct && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setEditProduct(null)}>
          <div className="bg-card border-2 border-[#030213] max-w-sm w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-[8px] font-bold tracking-[0.2em] text-[#030213] uppercase">Quick Product Edit</span>
              <button onClick={() => setEditProduct(null)} className="text-neutral-400 hover:text-[#030213] bg-transparent border-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Product Title</label>
                <input 
                  required
                  type="text" 
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">SKU Code</label>
                  <input 
                    required
                    type="text" 
                    value={editProduct.sku}
                    onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })}
                    className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" 
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Category</label>
                  <select 
                    value={editProduct.category}
                    onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                    className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none cursor-pointer"
                  >
                    {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Retail Price (INR)</label>
                  <input 
                    required
                    type="number" 
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                    className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" 
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-bold tracking-widest text-[#030213] uppercase mb-1">Stock Count</label>
                  <input 
                    required
                    type="number" 
                    value={editProduct.stock}
                    onChange={(e) => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
                    className="w-full bg-card border border-neutral-200 text-[9px] font-semibold uppercase p-2 focus:outline-none focus:border-[#030213] rounded-none" 
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setEditProduct(null)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
                <button type="submit" className="bg-[#030213] text-white hover:bg-neutral-800 text-[9px] font-bold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ───────────────────────────────── */}
      {deleteProduct && (
        <div className="fixed inset-0 bg-[#030213]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setDeleteProduct(null)}>
          <div className="bg-card border-2 border-[#030213] p-6 max-w-xs w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#b2533e] uppercase">Warning — Critical Action</h3>
            <p className="text-[9px] text-neutral-500 uppercase font-bold leading-normal">
              Are you sure you want to permanently delete <strong className="text-[#030213]">{deleteProduct.name}</strong> from the catalog? This action is irreversible.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setDeleteProduct(null)} className="border border-neutral-200 hover:border-neutral-400 text-neutral-500 text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button 
                onClick={() => {
                  setProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
                  setDeleteProduct(null);
                }} 
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
