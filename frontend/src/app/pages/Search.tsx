import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Search as SearchIcon, Heart, X, Loader, Star } from "lucide-react";
import { productApi } from "../lib/product-api";
import { Slider } from "../components/ui/slider";
import type { Product } from "../data/products";

// ─── Helpers ────────────────────────────────────────────────────────────────
function matchesSearch(product: Product, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    product.name.toLowerCase().includes(q) ||
    product.brand.toLowerCase().includes(q) ||
    (product.description || "").toLowerCase().includes(q)
  );
}

function getDiscountPercent(product: Product): number {
  if (!product.originalPrice) return 0;
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
}

function ProductCard({
  product,
  isFav,
  onToggleFav,
}: {
  product: Product;
  isFav: boolean;
  onToggleFav: (e: React.MouseEvent) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const discount = getDiscountPercent(product);

  useEffect(() => {
    if (!isHovered) {
      setActiveIdx(0);
      return;
    }
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % product.images.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [isHovered, product.images.length]);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col justify-between relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4">
        {/* Image crossfade */}
        {product.images.map((imgSrc, idx) => (
          <img
            key={idx}
            src={imgSrc}
            alt={`${product.name} - View ${idx + 1}`}
            style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[750ms] ${
              idx === activeIdx ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        ))}

        {/* Progress indicators */}
        {isHovered && product.images.length > 1 && (
          <div className="absolute top-3 inset-x-4 flex gap-1.5 z-10 transition-all duration-300">
            {product.images.map((_, idx) => (
              <div
                key={idx}
                className="h-[2px] flex-1 bg-white/20 overflow-hidden relative"
              >
                {idx === activeIdx ? (
                  <div
                    key={`progress-${idx}`}
                    style={{ animation: "progressGrowShop 1.5s linear forwards" }}
                    className="absolute left-0 top-0 h-full bg-white"
                  />
                ) : (
                  <div
                    className={`absolute left-0 top-0 h-full bg-white/40 ${
                      idx < activeIdx ? "w-full" : "w-0"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes progressGrowShop {
              from { width: 0%; }
              to { width: 100%; }
            }
          `,
          }}
        />

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-2 left-2 sm:top-4 sm:left-4 text-[7px] sm:text-[9px] font-extrabold sm:font-bold tracking-wider sm:tracking-[0.15em] px-2 py-0.5 sm:px-3 sm:py-1 z-10 bg-white/75 backdrop-blur-xs border border-white/40 rounded-xs shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${
              product.badge === "SOLD OUT"
                ? "text-neutral-500"
                : "text-[#030213]"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={onToggleFav}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/75 backdrop-blur-xs text-neutral-800 p-1.5 sm:p-2 border border-white/40 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:text-[#fd6585] transition-all z-10 cursor-pointer"
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[1.5] transition-colors ${
              isFav ? "fill-[#fd6585] stroke-[#fd6585]" : "stroke-neutral-800"
            }`}
          />
        </button>

      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 mt-1">
        <h3 className="text-xs md:text-sm font-extrabold text-[#030213] uppercase leading-tight line-clamp-1">
          {product.name}
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-extrabold text-neutral-900">
              ₹{Math.floor(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-[10px] sm:text-xs font-semibold text-neutral-450 line-through">
                  ₹{Math.floor(product.originalPrice)}
                </span>
                {discount > 0 && (
                  <span className="text-[8px] font-extrabold text-[#b2533e] uppercase tracking-wider bg-red-50 px-1 py-0.5">
                    {discount}% OFF
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center text-neutral-800 flex-shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-2.5 w-2.5 fill-current stroke-current"
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(qParam);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [priceOpen, setPriceOpen] = useState(true);

  // Sync URL param → input on mount/nav
  useEffect(() => {
    setSearchQuery(qParam);
  }, [qParam]);

  // Load products dynamically
  useEffect(() => {
    async function loadSearchProducts() {
      try {
        setLoading(true);
        const list = await productApi.fetchProducts();
        setDbProducts(list || []);
        if (list && list.length > 0) {
          const maxP = Math.max(...list.map(p => p.price));
          setPriceRange([0, Math.max(maxP, 5000)]);
        }
      } catch (err) {
        console.error("Failed to load products for search:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSearchProducts();
  }, []);

  // ─── Filtered results ──────────────────────────────────────────────────
  let filtered = dbProducts.filter((product) => {
    // Text search
    const cleanQuery = searchQuery.toLowerCase().trim();
    if (cleanQuery === "best sellers" || cleanQuery === "best seller" || cleanQuery === "best-sellers" || cleanQuery === "best-seller") {
      const match = (product.badge || "").toLowerCase().includes("best") || 
                    product.name.toLowerCase().includes("best") ||
                    (product.description || "").toLowerCase().includes("best") ||
                    (product.badge || "").toLowerCase().includes("seller") ||
                    (product.brand || "").toLowerCase().includes("best");
      if (!match) return false;
    } else {
      if (!matchesSearch(product, searchQuery)) return false;
    }

    // Size filter
    if (selectedSizes.length > 0) {
      const hasMatchingSize = (product.sizes || []).some(s => selectedSizes.includes(s.toUpperCase()));
      if (!hasMatchingSize) return false;
    }

    // Price range filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  // Determine if we are showing fallback products
  let isShowingFallback = false;
  let fallbackMessage = "";

  if (filtered.length === 0 && !loading) {
    isShowingFallback = true;
    
    // 1. Try keyword matching
    const keywords = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    let keywordMatches: Product[] = [];
    if (keywords.length > 0) {
      keywordMatches = dbProducts.filter((product) => {
        if (selectedSizes.length > 0) {
          const hasMatchingSize = (product.sizes || []).some(s => selectedSizes.includes(s.toUpperCase()));
          if (!hasMatchingSize) return false;
        }
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
        
        return keywords.some(word => 
          product.name.toLowerCase().includes(word) ||
          product.brand.toLowerCase().includes(word) ||
          (product.description || "").toLowerCase().includes(word)
        );
      });
    }

    if (keywordMatches.length > 0) {
      filtered = keywordMatches;
      fallbackMessage = `No exact matches found. Showing similar products for "${searchQuery}":`;
    } else {
      // 2. Default fallback products
      filtered = dbProducts.filter((product) => {
        if (selectedSizes.length > 0) {
          const hasMatchingSize = (product.sizes || []).some(s => selectedSizes.includes(s.toUpperCase()));
          if (!hasMatchingSize) return false;
        }
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
        return true;
      }).slice(0, 8);
      fallbackMessage = `No products found. Explore our Drip Doggy collection:`;
    }
  }

  // ─── Wishlist sync ─────────────────────────────────────────────────────
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      const list: { id: number }[] = stored ? JSON.parse(stored) : [];
      return new Set(list.map((item) => item.id));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    const sync = () => {
      try {
        const stored = localStorage.getItem("wishlist");
        const list: { id: number }[] = stored ? JSON.parse(stored) : [];
        setWishlistedIds(new Set(list.map((item) => item.id)));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("wishlist-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("wishlist-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("wishlist");
      let list: { id: number; brand: string; name: string; price: number; image: string }[] =
        stored ? JSON.parse(stored) : [];
      const exists = list.some((item) => item.id === product.id);

      if (exists) {
        list = list.filter((item) => item.id !== product.id);
      } else {
        list.push({
          id: product.id,
          brand: product.brand,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }

      localStorage.setItem("wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    const maxP = dbProducts.length > 0 ? Math.max(...dbProducts.map(p => p.price)) : 10000;
    setPriceRange([0, Math.max(maxP, 5000)]);
    setSearchQuery("");
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedSizes.length > 0 || priceRange[0] > 0 || priceRange[1] < (dbProducts.length > 0 ? Math.max(...dbProducts.map(p => p.price)) : 10000);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* ─── Search Header ────────────────────────────────────────────── */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 mb-3 uppercase">
            {filtered.length} PRODUCT{filtered.length !== 1 ? "S" : ""} FOUND
          </p>
          {searchQuery && (
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8 font-sans">
              Results for &ldquo;{searchQuery}&rdquo;
            </h1>
          )}

          {/* Search Bar */}
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
              placeholder="Search by product name or brand..."
            />
            <button
              type="submit"
              className="absolute right-2 hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer"
              aria-label="Search"
            >
              <SearchIcon className="h-4 w-4 text-neutral-800" />
            </button>
          </form>
        </div>

        {/* ─── Two Column Layout ─────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── LEFT — Filters ──────────────────────────────────────────── */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-10">
            <div className="flex justify-between items-baseline mb-2">
              <h2 className="text-sm font-extrabold tracking-[0.2em]">FILTERS</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[9px] font-bold tracking-[0.15em] text-neutral-400 border-b border-neutral-300 pb-0.5 hover:text-neutral-900 transition-colors bg-transparent border-none cursor-pointer"
                >
                  RESET ALL
                </button>
              )}
            </div>

            {/* Active filter tags */}
            {selectedSizes.length > 0 && (
              <div className="flex flex-wrap gap-2 -mt-2">
                {selectedSizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-extrabold tracking-wider uppercase bg-white border border-neutral-900/10"
                  >
                    {size}
                    <button
                      onClick={() =>
                        setSelectedSizes((prev) =>
                          prev.filter((s) => s !== size)
                        )
                      }
                      className="opacity-50 hover:opacity-100 bg-transparent border-none cursor-pointer p-0"
                    >
                      <X className="h-2.5 w-2.5 stroke-[2.5]" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* ── Size Filter ──────────────────────────────────────────── */}
            <div className="pt-6 border-t border-neutral-200/60">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-4">
                SIZE
              </h3>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSizes(prev => prev.filter(s => s !== size));
                        } else {
                          setSelectedSizes(prev => [...prev, size]);
                        }
                      }}
                      className={`w-10 h-10 flex items-center justify-center text-[10px] font-bold tracking-wider transition-all duration-300 border rounded-none cursor-pointer uppercase ${
                        isSelected
                          ? "bg-[#030213] text-white border-[#030213] shadow-[0_2px_8px_rgba(0,0,0,0.15)] font-black"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-800 hover:text-neutral-900"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Price Range ───────────────────────────────────────────── */}
            <div className="pt-6 border-t border-neutral-200/60 pb-4">
              <button
                onClick={() => setPriceOpen(!priceOpen)}
                className="w-full flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase bg-transparent border-none cursor-pointer"
              >
                PRICE RANGE
                <svg
                  className={`h-3 w-3 text-neutral-400 transition-transform ${
                    priceOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {priceOpen && (
                <div className="mt-5 px-1.5">
                  <Slider
                    min={0}
                    max={Math.max(dbProducts.length > 0 ? Math.max(...dbProducts.map(p => p.price)) : 10000, 5000)}
                    step={100}
                    value={priceRange}
                    onValueChange={(val: number[]) => setPriceRange([val[0], val[1]])}
                    className="w-full cursor-pointer accent-[#030213] h-1.5"
                  />
                  <div className="flex justify-between items-baseline mt-4 text-[10px] font-extrabold tracking-widest text-neutral-700 uppercase">
                    <span className="bg-neutral-50 px-2 py-1 border border-neutral-200/50">₹{priceRange[0]}</span>
                    <span className="text-neutral-300">—</span>
                    <span className="bg-neutral-50 px-2 py-1 border border-neutral-200/50">₹{priceRange[1]}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-100 rounded-sm">
                <Loader className="animate-spin h-8 w-8 text-[#030213] mb-3" />
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400">Loading catalog...</p>
              </div>
            ) : filtered.length === 0 ? (
              /* ── Empty State ────────────────────────────────────────────── */
              <div className="bg-white border border-neutral-200/80 p-12 md:p-16 text-center">
                <div className="max-w-sm mx-auto">
                  <SearchIcon className="h-10 w-10 text-neutral-300 mx-auto mb-4 stroke-[1.2]" />
                  <h2 className="text-sm font-extrabold tracking-[0.2em] uppercase mb-2">
                    No Products Found
                  </h2>
                  <p className="text-[11px] text-neutral-500 leading-relaxed mb-6">
                    {searchQuery
                      ? `We couldn't find any results for "${searchQuery}". Try adjusting your search or filters.`
                      : "No products match your current filters. Try expanding your criteria."}
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={clearFilters}
                      className="w-full bg-[#030213] text-white py-3 text-[10px] font-extrabold tracking-[0.2em] hover:bg-neutral-800 transition-colors uppercase bg-transparent border-none cursor-pointer"
                    >
                      Clear All Filters
                    </button>

                    <Link
                      to="/shop"
                      className="block w-full border border-neutral-300 text-neutral-700 py-3 text-[10px] font-extrabold tracking-[0.2em] hover:bg-neutral-100 transition-colors uppercase text-center"
                    >
                      Browse Full Shop
                    </Link>
                  </div>

                  {/* Suggestions */}
                  <div className="mt-8 pt-6 border-t border-neutral-100">
                    <p className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase mb-3">
                      Suggestions
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Dress", "Trench", "Linen", "Canvas", "Oversized"]
                        .filter(
                          (s) =>
                            !searchQuery
                              ?.toLowerCase()
                              .includes(s.toLowerCase())
                        )
                        .slice(0, 4)
                        .map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => {
                              setSearchQuery(suggestion);
                              setSearchParams({ q: suggestion });
                            }}
                            className="text-[9px] font-extrabold tracking-wider text-[#b2533e] border border-[#b2533e]/20 bg-[#b2533e]/5 px-3 py-1.5 hover:bg-[#b2533e]/10 transition-colors bg-transparent border-none cursor-pointer"
                          >
                            {suggestion}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Results Grid ──────────────────────────────────────────── */
              <>
                {/* Result meta */}
                <div className="flex flex-col gap-2 pb-4 border-b border-neutral-200/60">
                  <div className="flex items-center justify-between text-[9px] font-extrabold tracking-[0.2em] text-neutral-400 uppercase">
                    <span>
                      {isShowingFallback ? "RECOMMENDED PRODUCTS" : `Showing ${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
                    </span>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="hover:text-neutral-900 transition-colors bg-transparent border-none cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                  {isShowingFallback && (
                    <p className="text-xs font-bold text-[#b2533e] uppercase tracking-wider">{fallbackMessage}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.map((product) => {
                    const isFav = wishlistedIds.has(product.id);
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isFav={isFav}
                        onToggleFav={(e) => toggleWishlist(product, e)}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
