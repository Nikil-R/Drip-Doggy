import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Search as SearchIcon, Heart, ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: number;
  collection: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "NEW" | "SOLD OUT";
  favorite?: boolean;
}

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(qParam || "Oversized");
  const [activeFilters, setActiveFilters] = useState(["Oversized", "Black", "XL"]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(["TOPS"]);
  const [selectedSize, setSelectedSize] = useState("XL");

  useEffect(() => {
    if (qParam) {
      setSearchQuery(qParam);
      // Sync active filters to show the searched term
      setActiveFilters(prev => [qParam, ...prev.filter(f => f !== "Oversized" && f !== qParam)]);
    }
  }, [qParam]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      collection: "CORE COLLECTION",
      name: "Oversized Heavyweight Hoodie",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600",
      favorite: false
    },
    {
      id: 2,
      collection: "ESSENTIALS",
      name: "Boxy Fit Drop Shoulder Tee",
      price: 65.00,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600",
      badge: "NEW",
      favorite: false
    },
    {
      id: 3,
      collection: "TACTICAL",
      name: "Oversized Parachute Pants",
      price: 145.00,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=600",
      favorite: false
    },
    {
      id: 4,
      collection: "LIMITED EDITION",
      name: "Washed Canvas Overcoat",
      price: 220.00,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600",
      badge: "SOLD OUT",
      favorite: false
    }
  ]);

  const toggleFavorite = (id: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
    if (filter === "XL") setSelectedSize("");
  };

  const resetAllFilters = () => {
    setActiveFilters([]);
    setSelectedCategory([]);
    setSelectedSize("");
  };

  const filteredProducts = products.filter(product => {
    if (!searchQuery.trim()) return true;
    return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           product.collection.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Search Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 mb-3 uppercase">
            {filteredProducts.length} PRODUCTS FOUND
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8 font-sans">
            Search Results for "{searchQuery}"
          </h1>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const newParams = new URLSearchParams(searchParams);
              if (searchQuery.trim()) {
                newParams.set("q", searchQuery.trim());
              } else {
                newParams.delete("q");
              }
              setSearchParams(newParams);
            }}
            className="relative border-b border-neutral-300 pb-2 flex items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-center text-sm font-semibold tracking-wider focus:outline-none placeholder-neutral-400"
              placeholder="Search..."
            />
            <button type="submit" className="absolute right-2 hover:opacity-75 transition-opacity">
              <SearchIcon className="h-4 w-4 text-neutral-800" />
            </button>
          </form>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Filters */}
          <div className="lg:col-span-3 space-y-10">
            <div>
              <div className="flex justify-between items-baseline mb-6">
                <h2 className="text-sm font-extrabold tracking-[0.2em]">FILTERS</h2>
                {activeFilters.length > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="text-[9px] font-bold tracking-[0.15em] text-neutral-450 border-b border-neutral-300 pb-0.5 hover:text-neutral-900 transition-colors"
                  >
                    RESET ALL
                  </button>
                )}
              </div>

              {/* Refined By Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {activeFilters.map(filter => (
                  <span
                    key={filter}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm text-[10px] font-bold tracking-wider uppercase border border-neutral-900/10 ${
                      filter === "Black" ? "bg-[#030213] text-white" : "bg-white text-[#030213]"
                    }`}
                  >
                    {filter}
                    <button
                      onClick={() => removeFilter(filter)}
                      className="opacity-60 hover:opacity-100 font-normal ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="pt-6 border-t border-neutral-200/60">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-4">
                CATEGORY
              </h3>
              <div className="space-y-3">
                {["OUTERWEAR", "TOPS", "BOTTOMS"].map(cat => (
                  <label key={cat} className="flex items-center gap-3 text-xs font-semibold tracking-wider cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategory.includes(cat)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategory(prev => [...prev, cat]);
                        } else {
                          setSelectedCategory(prev => prev.filter(c => c !== cat));
                        }
                      }}
                      className="accent-[#030213] h-4 w-4 border-neutral-300 rounded"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="pt-6 border-t border-neutral-200/60">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-4">
                SIZE
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {["S", "M", "L", "XL"].map(sz => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(sz);
                      if (!activeFilters.includes(sz)) {
                        setActiveFilters(prev => [...prev.filter(f => f !== "S" && f !== "M" && f !== "L" && f !== "XL"), sz]);
                      }
                    }}
                    className={`border text-[10px] font-bold py-2.5 rounded-sm transition-colors text-center ${
                      selectedSize === sz
                        ? "bg-[#030213] text-white border-neutral-900"
                        : "bg-white text-neutral-700 border-neutral-200/60 hover:border-neutral-900"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Search Results Grid */}
          <div className="lg:col-span-9 space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="group relative flex flex-col justify-between">
                  <div>
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 mb-4 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Badge (New / Sold out) */}
                      {product.badge && (
                        <span className={`absolute top-4 left-4 text-[9px] font-bold tracking-[0.15em] px-3 py-1.5 rounded-sm ${
                          product.badge === "SOLD OUT" 
                            ? "bg-neutral-100 text-neutral-500" 
                            : "bg-white text-[#030213]"
                        }`}>
                          {product.badge}
                        </span>
                      )}

                      {/* Favorite button */}
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-4 right-4 bg-white/95 text-neutral-800 p-2 rounded-full shadow-sm hover:text-red-500 transition-colors"
                      >
                        <Heart className={`h-4 w-4 stroke-[1.5] ${product.favorite ? "fill-red-500 stroke-red-500" : ""}`} />
                      </button>
                    </div>

                    <span className="text-[9px] font-bold tracking-widest text-[#b2533e] uppercase">
                      {product.collection}
                    </span>
                    <h3 className="text-sm font-bold tracking-tight mb-1 mt-0.5 text-neutral-900 line-clamp-1">
                      {product.name}
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-neutral-500">
                      ₹{product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-6 pt-12 border-t border-neutral-200/60 text-xs font-bold text-neutral-400">
              <button className="hover:text-neutral-900">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-neutral-900 border-b-2 border-neutral-900 pb-0.5">1</span>
              <button className="hover:text-neutral-900">2</button>
              <button className="hover:text-neutral-900">3</button>
              <button className="hover:text-neutral-900">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

