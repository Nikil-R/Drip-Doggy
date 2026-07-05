import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Search as SearchIcon, Heart, X } from "lucide-react";
import { products } from "../data/products";
import type { Product } from "../data/products";

// ─── Extract unique brands from catalog ─────────────────────────────────────
const ALL_BRANDS = Array.from(new Set(products.map((p) => p.brand))).sort();

// ─── Helpers ────────────────────────────────────────────────────────────────
function matchesSearch(product: Product, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    product.name.toLowerCase().includes(q) ||
    product.brand.toLowerCase().includes(q)
  );
}

function getDiscountPercent(product: Product): number {
  if (!product.originalPrice) return 0;
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
}

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(qParam);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [priceOpen, setPriceOpen] = useState(false);

  // Sync URL param → input on mount/nav
  useEffect(() => {
    setSearchQuery(qParam);
  }, [qParam]);

  // ─── Filtered results ──────────────────────────────────────────────────
  const filtered = products.filter((product) => {
    // Text search
    if (!matchesSearch(product, searchQuery)) return false;

    // Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }

    // Price range filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  // ─── Derived filter counts ─────────────────────────────────────────────
  const brandCounts = ALL_BRANDS.reduce<Record<string, number>>((acc, b) => {
    const cnt = products.filter(
      (p) => p.brand === b && matchesSearch(p, searchQuery)
    ).length;
    if (cnt > 0) acc[b] = cnt;
    return acc;
  }, {});

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
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setSearchQuery("");
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 500;

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ─── LEFT — Filters ──────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-10">
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
            {selectedBrands.length > 0 && (
              <div className="flex flex-wrap gap-2 -mt-2">
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-extrabold tracking-wider uppercase bg-white border border-neutral-900/10"
                  >
                    {brand}
                    <button
                      onClick={() =>
                        setSelectedBrands((prev) =>
                          prev.filter((b) => b !== brand)
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

            {/* ── Brand Filter ──────────────────────────────────────────── */}
            <div className="pt-6 border-t border-neutral-200/60">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-4">
                BRAND / COLLECTION
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {Object.entries(brandCounts).map(([brand, count]) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2.5 text-[11px] font-semibold tracking-wider cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands((prev) => [...prev, brand]);
                        } else {
                          setSelectedBrands((prev) =>
                            prev.filter((b) => b !== brand)
                          );
                        }
                      }}
                      className="accent-[#030213] h-3.5 w-3.5 border-neutral-300 rounded-sm"
                    />
                    <span className="flex-1 text-neutral-700 group-hover:text-[#030213] transition-colors">
                      {brand}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-bold">
                      {count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Price Range ───────────────────────────────────────────── */}
            <div className="pt-6 border-t border-neutral-200/60">
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
                <div className="mt-4 space-y-4">
                  {/* Quick price chips */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Under ₹100", min: 0, max: 100 },
                      { label: "₹100 — ₹200", min: 100, max: 200 },
                      { label: "₹200 — ₹300", min: 200, max: 300 },
                      { label: "₹300+", min: 300, max: 9999 },
                    ].map((chip) => {
                      const isActive =
                        priceRange[0] === chip.min &&
                        priceRange[1] === chip.max;
                      return (
                        <button
                          key={chip.label}
                          onClick={() =>
                            isActive
                              ? setPriceRange([0, 500])
                              : setPriceRange([chip.min, chip.max])
                          }
                          className={`text-[9px] font-extrabold tracking-wider px-2.5 py-1.5 border transition-colors bg-transparent cursor-pointer ${
                            isActive
                              ? "bg-[#030213] text-white border-[#030213]"
                              : "bg-white text-neutral-600 border-neutral-200/60 hover:border-neutral-400"
                          }`}
                        >
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
                    <span>₹{priceRange[0]}</span>
                    <span className="text-neutral-300">—</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── RIGHT — Results ─────────────────────────────────────────── */}
          <div className="lg:col-span-9 space-y-8">
            {filtered.length === 0 ? (
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
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 text-[9px] font-extrabold tracking-[0.2em] text-neutral-400 uppercase">
                  <span>
                    Showing {filtered.length} result
                    {filtered.length !== 1 ? "s" : ""}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.map((product) => {
                    const isFav = wishlistedIds.has(product.id);
                    const discount = getDiscountPercent(product);
                    return (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="group flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[3/4] overflow-hidden bg-neutral-100 mb-4 relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Badge */}
                            {product.badge && (
                              <span
                                className={`absolute top-4 left-4 text-[9px] font-bold tracking-[0.15em] px-3 py-1.5 ${
                                  product.badge === "SOLD OUT"
                                    ? "bg-neutral-100 text-neutral-500"
                                    : "bg-white text-[#030213]"
                                }`}
                              >
                                {product.badge}
                              </span>
                            )}

                            {/* Favorite */}
                            <button
                              onClick={(e) => toggleWishlist(product, e)}
                              className="absolute top-4 right-4 bg-white/95 text-neutral-800 p-2 shadow-sm hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                              aria-label={
                                isFav
                                  ? "Remove from wishlist"
                                  : "Add to wishlist"
                              }
                            >
                              <Heart
                                className={`h-4 w-4 stroke-[1.5] ${
                                  isFav
                                    ? "fill-red-500 stroke-red-500"
                                    : ""
                                }`}
                              />
                            </button>

                            {/* Hover add-to-bag indicator */}
                            <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                              <div className="bg-black/90 text-white text-[8px] font-extrabold tracking-[0.2em] py-2.5 text-center uppercase backdrop-blur-sm">
                                Quick View
                              </div>
                            </div>
                          </div>

                          <span className="text-[9px] font-bold tracking-widest text-[#b2533e] uppercase">
                            {product.brand}
                          </span>
                          <h3 className="text-sm font-bold tracking-tight mb-1 mt-0.5 text-neutral-900 line-clamp-1 uppercase">
                            {product.name}
                          </h3>
                        </div>

                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xs font-semibold text-neutral-500">
                            ₹{product.price.toFixed(0)}
                          </span>
                          {product.originalPrice && (
                            <>
                              <span className="text-[10px] font-medium text-neutral-400 line-through">
                                ₹{product.originalPrice.toFixed(0)}
                              </span>
                              {discount > 0 && (
                                <span className="text-[8px] font-extrabold text-[#b2533e] uppercase tracking-wider bg-red-50 px-1 py-0.5">
                                  {discount}% OFF
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </Link>
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
