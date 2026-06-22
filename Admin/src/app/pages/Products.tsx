import { useState, useMemo } from "react";
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
  ChevronRight
} from "lucide-react";

const RS = "\u20B9";

function ToggleSwitch({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-9 h-[18px] rounded-full transition-colors duration-200 border-none cursor-pointer ${
        enabled ? "bg-green-500" : "bg-neutral-300"
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
        enabled ? "translate-x-[18px]" : "translate-x-0"
      }`} />
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
}

const sampleProducts: Product[] = [
  { id: "#DD-P001", name: "Structured Canvas Jacket", category: "Outerwear", price: 12999, cost: 5200, stock: 45, status: "Active", sales: 342, revenue: 4445658, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-STR-001", season: "SS26" },
  { id: "#DD-P002", name: "Sartorial Trench Coat", category: "Outerwear", price: 24999, cost: 10000, stock: 18, status: "Active", sales: 198, revenue: 4949802, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-SAT-001", season: "FW25" },
  { id: "#DD-P003", name: "Cashmere Blend Crew", category: "Knitwear", price: 8999, cost: 3600, stock: 62, status: "Active", sales: 287, revenue: 2582713, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-CAS-001", season: "FW25" },
  { id: "#DD-P004", name: "Merino Wool Cardigan", category: "Knitwear", price: 11999, cost: 4800, stock: 23, status: "Active", sales: 167, revenue: 2003833, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-MER-001", season: "FW25" },
  { id: "#DD-P005", name: "Signature Silk Blouse", category: "Tops", price: 6999, cost: 2100, stock: 78, status: "Active", sales: 312, revenue: 2183688, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-SIL-001", season: "SS26" },
  { id: "#DD-P006", name: "Relaxed Linen Shirt", category: "Tops", price: 5499, cost: 1650, stock: 54, status: "Active", sales: 256, revenue: 1407744, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-LIN-001", season: "SS26" },
  { id: "#DD-P007", name: "French Terry Hoodie", category: "Tops", price: 4499, cost: 1350, stock: 92, status: "Active", sales: 421, revenue: 1894079, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-FTH-001", season: "SS26" },
  { id: "#DD-P008", name: "Pleated Wool Trousers", category: "Bottoms", price: 9999, cost: 4000, stock: 31, status: "Active", sales: 145, revenue: 1449855, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-PLE-001", season: "FW25" },
  { id: "#DD-P009", name: "Tailored Linen Trousers", category: "Bottoms", price: 7999, cost: 2400, stock: 0, status: "Draft", sales: 0, revenue: 0, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop", sku: "DD-TLT-002", season: "SS26" },
  { id: "#DD-P010", name: "Handwoven Silk Scarf", category: "Accessories", price: 3999, cost: 1200, stock: 120, status: "Active", sales: 534, revenue: 2135466, image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop", sku: "DD-SCF-001", season: "All" },
  { id: "#DD-P011", name: "Drip Doggy Varsity Jacket", category: "Signature", price: 19999, cost: 8000, stock: 7, status: "Active", sales: 89, revenue: 1779911, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop", sku: "DD-VAR-001", season: "FW25" },
  { id: "#DD-P012", name: "SS26 Linen Blend Jacket", category: "New Arrivals", price: 14499, cost: 5800, stock: 15, status: "Draft", sales: 0, revenue: 0, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop", sku: "DD-SS26-002", season: "SS26" },
];

// ─── KPI Stats ────────────────────────────────────────────────────────────

const kpiData = [
  { label: "Total Products", value: sampleProducts.length.toString(), icon: Layers, color: "text-[#030213]" },
  { label: "Active", value: sampleProducts.filter(p => p.status === "Active").length.toString(), icon: Eye, color: "text-green-700" },
  { label: "Total Sales", value: sampleProducts.reduce((s, p) => s + p.sales, 0).toLocaleString("en-IN"), icon: TrendingUp, color: "text-[#030213]" },
  { label: "Total Revenue", value: RS + sampleProducts.reduce((s, p) => s + p.revenue, 0).toLocaleString("en-IN"), icon: DollarSign, color: "text-amber-700" },
];

// ─── Categories ────────────────────────────────────────────────────────────

const categories = ["All", "Outerwear", "Knitwear", "Tops", "Bottoms", "Accessories", "Signature", "New Arrivals"];

export function ProductsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Draft">("all");

  const filteredProducts = useMemo(() => {
    let filtered = sampleProducts;
    if (activeCategory !== "All") filtered = filtered.filter(p => p.category === activeCategory);
    if (statusFilter === "Active") filtered = filtered.filter(p => p.status === "Active");
    else if (statusFilter === "Draft") filtered = filtered.filter(p => p.status === "Draft");
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    return filtered;
  }, [search, activeCategory, statusFilter]);

  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">
            Products
          </h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy product catalog &amp; inventory
          </p>
        </div>
        <button className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none border-none">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
            <kpi.icon className={`w-5 h-5 text-neutral-400 shrink-0`} />
            <div>
              <p className={`text-lg font-black ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-neutral-200/80 p-4">
        <div className="flex flex-wrap gap-1.5">
          {/* Category tabs */}
          <div className="flex bg-[#faf8f5] border border-neutral-200/80 p-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-[7px] font-extrabold tracking-widest uppercase border-none cursor-pointer ${
                  activeCategory === cat ? "bg-[#030213] text-white" : "bg-transparent text-neutral-400 hover:text-[#030213]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Status filter */}
          <div className="flex gap-1 ml-2">
            {(["all", "Active", "Draft"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2 py-1.5 text-[7px] font-extrabold tracking-widest uppercase border border-neutral-200 cursor-pointer bg-white ${
                  statusFilter === s ? "border-[#030213] text-[#030213]" : "text-neutral-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search name, SKU or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-neutral-200/80 pl-8 pr-3 py-2 text-[9px] font-extrabold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-52"
            />
          </div>
          <button className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 p-2 cursor-pointer">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Products Table ─────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200/80 overflow-hidden">
        <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider">
          <thead>
            <tr className="border-b border-neutral-100 bg-[#faf8f5]/60 text-[8px] text-neutral-400 tracking-[0.2em]">
              <th className="p-3 font-black">Product</th>
              <th className="p-3 font-black">SKU</th>
              <th className="p-3 font-black">Category</th>
              <th className="p-3 font-black">Price</th>
              <th className="p-3 font-black">Stock</th>
              <th className="p-3 font-black">Sales</th>
              <th className="p-3 font-black">Revenue</th>
              <th className="p-3 font-black">Status</th>
              <th className="p-3 font-black text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 overflow-hidden bg-neutral-100 border border-neutral-200/50 shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[9px] font-extrabold text-[#030213]">{product.name}</p>
                      <p className="text-[7px] text-neutral-400 font-semibold">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-neutral-400 font-mono text-[8px]">{product.sku}</td>
                <td className="p-3">
                  <span className="text-[7px] font-extrabold tracking-widest bg-neutral-50 border border-neutral-200 px-2 py-0.5">
                    {product.category}
                  </span>
                </td>
                <td className="p-3 font-black text-[#030213]">{RS}{product.price.toLocaleString("en-IN")}</td>
                <td className="p-3">
                  <span className={`font-extrabold ${product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-amber-600" : "text-[#030213]"}`}>
                    {product.stock === 0 ? "OOS" : product.stock}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#030213]">{product.sales}</span>
                    <div className="w-12 h-1.5 bg-neutral-100">
                      <div className="h-full bg-[#030213]" style={{ width: Math.min((product.sales / 500) * 100, 100) + "%" }} />
                    </div>
                  </div>
                </td>
                <td className="p-3 font-black text-[#030213]">{RS}{product.revenue.toLocaleString("en-IN")}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <ToggleSwitch enabled={product.status === "Active"} onClick={() => {}} />
                    <span className={`text-[7px] font-extrabold tracking-widest ${product.status === "Active" ? "text-green-700" : "text-amber-700"}`}>{product.status}</span>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="text-neutral-400 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">
          Showing {filteredProducts.length} of {sampleProducts.length} products
        </p>
        <div className="flex gap-1 items-center">
          <button className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] bg-white text-neutral-500 text-[8px] font-extrabold tracking-widest px-3 py-1.5 uppercase transition-all cursor-pointer">
            <ChevronLeft className="w-3 h-3" /> Prev
          </button>
          <button className="w-7 h-7 flex items-center justify-center text-[8px] font-extrabold bg-[#030213] text-white border border-[#030213] cursor-pointer">1</button>
          <button className="w-7 h-7 flex items-center justify-center text-[8px] font-extrabold bg-white border border-neutral-200 text-neutral-500 cursor-pointer">2</button>
          <button className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] bg-white text-neutral-500 text-[8px] font-extrabold tracking-widest px-3 py-1.5 uppercase transition-all cursor-pointer">
            Next <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
}
