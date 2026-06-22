import { useState, useMemo } from "react";
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
  ArrowUpDown
} from "lucide-react";

const RS = "\u20B9";

// ─── Drip Doggy Categories ───────────────────────────────────────────────

const discoverCategories = [
  {
    id: "outerwear",
    label: "Outerwear",
    sub: "Jackets & Coats",
    count: 28,
    products: [
      { name: "Structured Canvas Jacket", price: 12999, orders: 142, sku: "DD-STR-001" },
      { name: "Sartorial Trench Coat", price: 24999, orders: 98, sku: "DD-SAT-001" },
      { name: "Drip Doggy Bomber Jacket", price: 15999, orders: 215, sku: "DD-BOM-001" }
    ]
  },
  {
    id: "knitwear",
    label: "Knitwear",
    sub: "Sweaters & Cardigans",
    count: 22,
    products: [
      { name: "Cashmere Blend Crew", price: 8999, orders: 167, sku: "DD-CAS-001" },
      { name: "Merino Wool Cardigan", price: 11999, orders: 89, sku: "DD-MER-001" },
      { name: "Signature Knit Polo", price: 7499, orders: 134, sku: "DD-KNT-001" }
    ]
  },
  {
    id: "tops",
    label: "Tops",
    sub: "Shirts & Blouses",
    count: 35,
    products: [
      { name: "Signature Silk Blouse", price: 6999, orders: 203, sku: "DD-SIL-001" },
      { name: "Relaxed Linen Shirt", price: 5499, orders: 178, sku: "DD-LIN-001" },
      { name: "French Terry Hoodie", price: 4499, orders: 256, sku: "DD-FTH-001" }
    ]
  },
  {
    id: "bottoms",
    label: "Bottoms",
    sub: "Trousers & Skirts",
    count: 18,
    products: [
      { name: "Pleated Wool Trousers", price: 9999, orders: 87, sku: "DD-PLE-001" },
      { name: "Tailored Linen Trousers", price: 7999, orders: 112, sku: "DD-TLT-001" },
      { name: "Linen Midi Dress", price: 8499, orders: 145, sku: "DD-LMD-001" }
    ]
  },
  {
    id: "accessories",
    label: "Accessories",
    sub: "Scarves & Belts",
    count: 15,
    products: [
      { name: "Handwoven Silk Scarf", price: 3999, orders: 231, sku: "DD-SCF-001" },
      { name: "Leather Belt", price: 2999, orders: 198, sku: "DD-BLT-001" },
      { name: "Signature Cap", price: 1999, orders: 312, sku: "DD-CAP-001" }
    ]
  },
  {
    id: "archive",
    label: "Archive",
    sub: "Past Collections",
    count: 12,
    products: [
      { name: "FW25 Heritage Coat", price: 18999, orders: 45, sku: "DD-FW25-001" },
      { name: "SS26 Resort Shirt", price: 6499, orders: 67, sku: "DD-SS26-001" },
      { name: "Limited Drop Tee", price: 3499, orders: 89, sku: "DD-LTD-001" }
    ]
  },
  {
    id: "signature",
    label: "Signature",
    sub: "Drip Doggy Icons",
    count: 10,
    products: [
      { name: "Drip Doggy Varsity Jacket", price: 19999, orders: 156, sku: "DD-VAR-001" },
      { name: "Icon Logo Sweatshirt", price: 6499, orders: 278, sku: "DD-ICO-001" },
      { name: "Founders Edition Tee", price: 4499, orders: 198, sku: "DD-FND-001" }
    ]
  },
  {
    id: "newarrivals",
    label: "New Arrivals",
    sub: "SS26 Collection",
    count: 20,
    products: [
      { name: "SS26 Linen Blend Jacket", price: 14499, orders: 34, sku: "DD-SS26-002" },
      { name: "SS26 Crop Knit Top", price: 5999, orders: 52, sku: "DD-SS26-003" },
      { name: "SS26 Pleated Mini Skirt", price: 6999, orders: 41, sku: "DD-SS26-004" }
    ]
  }
];

// ─── Flat product list for table ──────────────────────────────────────────

const allProducts = discoverCategories.flatMap(cat =>
  cat.products.map((p, i) => ({
    no: (cat.products.indexOf(p) + 1),
    name: p.name,
    category: cat.id,
    categoryLabel: cat.label,
    sku: p.sku,
    price: p.price,
    orders: p.orders,
    image: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=120&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=120&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=120&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=120&auto=format&fit=crop",
    ][i % 4]
  }))
);

export function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [sliderIndex, setSliderIndex] = useState(0);

  const visibleCategories = useMemo(() => {
    return discoverCategories.slice(sliderIndex, sliderIndex + 4);
  }, [sliderIndex]);

  const handleNextSlider = () => {
    if (sliderIndex + 4 < discoverCategories.length) {
      setSliderIndex(prev => prev + 1);
    }
  };

  const handlePrevSlider = () => {
    if (sliderIndex > 0) {
      setSliderIndex(prev => prev - 1);
    }
  };

  // ── Stats from selected category ──────────────────────────────────────
  const categoryStats = useMemo(() => {
    if (!selectedCategory) return null;
    const cat = discoverCategories.find(c => c.id === selectedCategory);
    if (!cat) return null;
    return {
      label: cat.label,
      count: cat.count,
      totalOrders: cat.products.reduce((s, p) => s + p.orders, 0),
      avgPrice: Math.round(cat.products.reduce((s, p) => s + p.price, 0) / cat.products.length),
      topSelling: [...cat.products].sort((a, b) => b.orders - a.orders)[0]
    };
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    const targetCategory = selectedCategory || discoverCategories[0].id;
    let filtered = allProducts.filter(p => p.category === targetCategory);

    if (activeTab === "Featured") filtered = filtered.filter(p => p.orders >= 150);
    else if (activeTab === "New") filtered = filtered.filter(p => p.orders < 60);
    else if (activeTab === "Premium") filtered = filtered.filter(p => p.price >= 10000);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }

    return filtered;
  }, [selectedCategory, activeTab, searchQuery]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.no));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (no: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, no]);
    } else {
      setSelectedProducts(prev => prev.filter(n => n !== no));
    }
  };

  const tabs = [
    { id: "All", label: "All" },
    { id: "Featured", label: "Best Sellers" },
    { id: "New", label: "New" },
    { id: "Premium", label: "Premium (" + RS + "10K+)" }
  ];

  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">
            Categories
          </h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy collections &amp; product catalog
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 transition-colors cursor-pointer rounded-none border-none">
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
          <button className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase transition-all cursor-pointer rounded-none">
            Bulk Actions
          </button>
        </div>
      </div>

      {/* ── Category KPIs ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <Layers className="w-5 h-5 text-neutral-400 shrink-0" />
          <div>
            <p className="text-lg font-black text-[#030213]">{discoverCategories.length}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Collections</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <Package className="w-5 h-5 text-neutral-400 shrink-0" />
          <div>
            <p className="text-lg font-black text-[#030213]">{allProducts.length}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Total Products</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <Eye className="w-5 h-5 text-neutral-400 shrink-0" />
          <div>
            <p className="text-lg font-black text-[#030213]">{allProducts.reduce((s, p) => s + p.orders, 0).toLocaleString("en-IN")}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Total Orders</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
          <Tag className="w-5 h-5 text-neutral-400 shrink-0" />
          <div>
            <p className="text-lg font-black text-amber-700">{RS}{Math.round(allProducts.reduce((s, p) => s + p.price, 0) / allProducts.length).toLocaleString("en-IN")}</p>
            <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider">Avg. Price</p>
          </div>
        </div>
      </div>

      {/* ── Category Slider ─────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200/80 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">Collections</span>
            {selectedCategory && (
              <span className="text-[7px] font-extrabold text-[#030213] bg-neutral-100 px-2 py-0.5 uppercase tracking-wider">
                Selected: {discoverCategories.find(c => c.id === selectedCategory)?.label}
              </span>
            )}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handlePrevSlider}
              disabled={sliderIndex === 0}
              className="w-7 h-7 flex items-center justify-center border border-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#030213] text-neutral-500 cursor-pointer bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextSlider}
              disabled={sliderIndex + 4 >= discoverCategories.length}
              className="w-7 h-7 flex items-center justify-center border border-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#030213] text-neutral-500 cursor-pointer bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {visibleCategories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`border p-4 flex items-center gap-4 cursor-pointer transition-all hover:shadow-sm ${
                  isSelected ? "border-2 border-[#030213] bg-[#faf8f5]/65" : "border-neutral-200 bg-white hover:border-neutral-400"
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-neutral-50 border border-neutral-100 shrink-0">
                  <Shirt className={`w-5 h-5 ${isSelected ? "text-[#030213]" : "text-neutral-400"}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[10px] font-black uppercase text-neutral-900 tracking-wide leading-tight truncate">{cat.label}</h4>
                  <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest block mt-0.5">{cat.sub}</span>
                  <span className="text-[7px] font-extrabold text-neutral-500 block mt-0.5">{cat.count} products</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Category Stats (when selected) ─────────────────────────── */}
        {categoryStats && (
          <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-neutral-100 mt-4">
            <div className="flex items-center gap-2 text-[7px] font-extrabold text-neutral-500 uppercase tracking-wider">
              <Package className="w-3 h-3" /> {categoryStats.count} Products
            </div>
            <div className="flex items-center gap-2 text-[7px] font-extrabold text-neutral-500 uppercase tracking-wider">
              <Eye className="w-3 h-3" /> {categoryStats.totalOrders.toLocaleString("en-IN")} Total Orders
            </div>
            <div className="flex items-center gap-2 text-[7px] font-extrabold text-neutral-500 uppercase tracking-wider">
              <Tag className="w-3 h-3" /> Avg {RS}{categoryStats.avgPrice.toLocaleString("en-IN")}
            </div>
            <div className="flex items-center gap-2 text-[7px] font-extrabold text-amber-700 uppercase tracking-wider">
              <Eye className="w-3 h-3" /> Top: {categoryStats.topSelling.name}
            </div>
          </div>
        )}
      </div>

      {/* ── Products Table ─────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200/80 p-6 space-y-6">

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-[#faf8f5] border border-neutral-200/80 p-1.5 shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-[9px] font-extrabold tracking-widest uppercase transition-all border-none cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#030213] text-white"
                    : "bg-transparent text-neutral-400 hover:text-[#030213]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search product or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-neutral-200/80 pl-8 pr-3 py-2 text-[9px] font-extrabold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-48"
              />
            </div>
            <button className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 p-2 cursor-pointer">
              <Filter className="h-4.5 w-4.5" />
            </button>
            <button className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 p-2 cursor-pointer">
              <ArrowUpDown className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider divide-y divide-neutral-100">
            <thead>
              <tr className="border-b border-neutral-100 bg-[#faf8f5]/60 text-[8px] text-neutral-400 tracking-[0.2em]">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="accent-[#030213] h-3.5 w-3.5 cursor-pointer"
                  />
                </th>
                <th className="p-3 font-black">Product</th>
                <th className="p-3 font-black">SKU</th>
                <th className="p-3 font-black">Price</th>
                <th className="p-3 font-black">Orders</th>
                <th className="p-3 font-black">Category</th>
                <th className="p-3 font-black text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((p, idx) => {
                const isChecked = selectedProducts.includes(p.no);
                return (
                  <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleSelectProduct(p.no, e.target.checked)}
                        className="accent-[#030213] h-3.5 w-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 text-[#030213] font-black">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 overflow-hidden bg-neutral-100 border border-neutral-200/50 shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-extrabold text-[#030213] text-[9.5px] truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-neutral-400 font-mono text-[8px]">{p.sku}</td>
                    <td className="p-3 font-black text-[#030213]">{RS}{p.price.toLocaleString("en-IN")}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#030213]">{p.orders}</span>
                        <div className="w-12 h-1.5 bg-neutral-100">
                          <div className="h-full bg-[#030213] transition-all" style={{ width: Math.min((p.orders / 300) * 100, 100) + "%" }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-[7px] font-extrabold tracking-widest bg-neutral-50 border border-neutral-200 px-2 py-0.5">
                        {p.categoryLabel}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="text-neutral-400 hover:text-[#030213] p-1.5 bg-transparent border-none cursor-pointer">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="text-neutral-400 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer">
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
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <button className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] hover:text-[#030213] bg-white text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase transition-all cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <div className="flex gap-1.5 items-center">
            {[1, 2, 3, 4, 5].map(p => (
              <button
                key={p}
                className={`w-8 h-8 flex items-center justify-center text-[9px] font-extrabold border cursor-pointer transition-all ${
                  p === 1 ? "bg-[#030213] text-white border-[#030213]" : "bg-white border-neutral-200 text-neutral-500 hover:border-[#030213]"
                }`}
              >
                {p}
              </button>
            ))}
            <span className="text-[9px] text-neutral-400 tracking-wider">.....</span>
            <button className="w-8 h-8 flex items-center justify-center text-[9px] font-extrabold border border-neutral-200 text-neutral-500 hover:border-[#030213] cursor-pointer">
              12
            </button>
          </div>
          <button className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] hover:text-[#030213] bg-white text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase transition-all cursor-pointer">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
