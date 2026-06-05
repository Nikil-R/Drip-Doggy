import { Star, Heart } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useState, useEffect, useRef } from "react";

interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  image: string;
  badge?: string;
  colors?: string[];
  favorite?: boolean;
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col justify-between">
      <div className="aspect-[3/4] bg-neutral-200/60 animate-pulse rounded-lg" />
      <div className="space-y-2.5 mt-4">
        <div className="h-2.5 bg-neutral-200/60 animate-pulse rounded w-1/4" />
        <div className="h-4 bg-neutral-200/60 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-neutral-200/60 animate-pulse rounded w-1/5 mt-1" />
      </div>
    </div>
  );
}

export function ProductGrid() {
  const [searchParams] = useSearchParams();
  const collectionParam = searchParams.get("collection");
  const newParam = searchParams.get("new");
  const categoryParam = searchParams.get("category");
  const sizeParam = searchParams.get("size");
  const colorParam = searchParams.get("color");
  const priceRangeParam = searchParams.get("price");

  const [isLoading, setIsLoading] = useState(true);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      brand: "DRIP DOGGY COLLECTION",
      name: "Sartorial Pleated Trench Dress",
      price: 245.00,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
      colors: ["#FAF8F5", "#1A1A1A"]
    },
    {
      id: 2,
      brand: "CORE COLLECTION",
      name: "Oversized Knit Sweater Dress",
      price: 185.00,
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600",
      colors: ["#9CA3AF", "#D2C9BD"]
    },
    {
      id: 3,
      brand: "ESSENTIALS",
      name: "Boxy Minimalist Maxi Dress",
      price: 135.00,
      image: "https://images.unsplash.com/photo-1539008885128-403bb34856b8?auto=format&fit=crop&q=80&w=600",
      badge: "NEW"
    },
    {
      id: 4,
      brand: "ARCHIVE COLLECTION",
      name: "Structured Canvas Utility Dress",
      price: 295.00,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
      colors: ["#1A1A1A"],
      rating: 5
    },
    {
      id: 5,
      brand: "DRIP LUXE",
      name: "Tiered Organza Street Slip",
      price: 320.00,
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 6,
      brand: "ESSENTIALS",
      name: "Architectural Drape Rib Dress",
      price: 165.00,
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
      colors: ["#D2C9BD"]
    },
    {
      id: 7,
      brand: "TACTICAL APPAREL",
      name: "Parachute Cotton Cargo Skirt",
      price: 195.00,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
      badge: "NEW"
    },
    {
      id: 8,
      brand: "DRIP LUXE",
      name: "Asymmetrical Linen Slip Dress",
      price: 210.00,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
      rating: 5
    },
    {
      id: 9,
      brand: "CORE COLLECTION",
      name: "Oversized French Terry Dress Hoodie",
      price: 220.00,
      image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600"
    }
  ]);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const handleAddToBag = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Added ${name} to bag!`);
  };

  // Trigger loading skeleton state on filter parameters change
  useEffect(() => {
    setIsLoading(true);
    setVisibleCount(6);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [collectionParam, newParam, categoryParam, sizeParam, colorParam, priceRangeParam]);

  const filteredProducts = products.filter(product => {
    // 1. Filter by collection
    if (collectionParam) {
      const col = collectionParam.toLowerCase();
      if (col === "core" && !product.brand.toLowerCase().includes("core")) return false;
      if (col === "archive" && !product.brand.toLowerCase().includes("archive")) return false;
      if (col === "luxe" && !product.brand.toLowerCase().includes("luxe")) return false;
      if (col === "tactical" && !product.brand.toLowerCase().includes("tactical")) return false;
    }
    // 2. Filter by new arrivals
    if (newParam === "true" && product.badge !== "NEW") return false;
    // 3. Filter by category
    if (categoryParam) {
      const cat = categoryParam.toLowerCase();
      const name = product.name.toLowerCase();
      if (cat === "hoodies") {
        if (!name.includes("hoodie") && !name.includes("sweater")) return false;
      } else if (cat === "jackets") {
        if (!name.includes("jacket") && !name.includes("trench") && !name.includes("utility")) return false;
      } else if (cat === "t-shirts") {
        if (!name.includes("tee") && !name.includes("t-shirt") && !name.includes("rib") && !name.includes("slip") && !name.includes("maxi")) return false;
      } else if (cat === "pants") {
        if (!name.includes("pants") && !name.includes("skirt")) return false;
      } else if (cat === "accessories") {
        if (!name.includes("bag") && !name.includes("sling") && !name.includes("collar") && !name.includes("lead")) return false;
      }
    }
    // 4. Filter by color
    if (colorParam) {
      const col = colorParam.toLowerCase();
      if (product.colors) {
        const hasColor = product.colors.some(c => {
          if (col === "black" && (c === "#1A1A1A" || c === "#000000")) return true;
          if (col === "white" && (c === "#FAF8F5" || c === "#FFFFFF")) return true;
          if (col === "gray" && c === "#9CA3AF") return true;
          if (col === "beige" && (c === "#D2C9BD" || c === "#D4C5B9")) return true;
          if (col === "brown" && c === "#92400E") return true;
          return false;
        });
        if (!hasColor) return false;
      } else {
        return false;
      }
    }
    // 5. Filter by price range
    const [minPrice, maxPrice] = priceRangeParam ? priceRangeParam.split("-").map(Number) : [0, 500];
    if (product.price < minPrice || product.price > maxPrice) return false;

    return true;
  });

  // Setup intersection observer for infinite scroll / lazy loading on scroll
  useEffect(() => {
    if (isLoading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && visibleCount < filteredProducts.length && !isInfiniteLoading) {
          setIsInfiniteLoading(true);
          setTimeout(() => {
            setVisibleCount(prev => Math.min(filteredProducts.length, prev + 3));
            setIsInfiniteLoading(false);
          }, 800);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, visibleCount, filteredProducts.length, isInfiniteLoading]);

  return (
    <div>
      {/* Sorting bar */}
      <div className="flex justify-between items-baseline mb-8 text-xs font-bold tracking-widest text-neutral-400 uppercase">
        <p>SHOWING {isLoading ? "..." : filteredProducts.length} PRODUCTS</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px]">SORT BY:</span>
          <select className="bg-transparent border-none text-[10px] font-bold text-[#030213] tracking-widest uppercase focus:outline-none cursor-pointer">
            <option>DEFAULT</option>
            <option>PRICE LOW TO HIGH</option>
            <option>PRICE HIGH TO LOW</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
        {isLoading ? (
          // Initial skeleton load state
          [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
        ) : (
          filteredProducts.slice(0, visibleCount).map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-white text-[#030213] text-[9px] font-bold tracking-[0.15em] px-3 py-1.5 rounded-sm">
                    {product.badge}
                  </span>
                )}

                {/* Wishlist Heart */}
                <button
                  onClick={(e) => toggleFavorite(product.id, e)}
                  className="absolute top-4 right-4 bg-white/95 text-neutral-800 p-2 rounded-full shadow-sm hover:text-red-500 transition-colors"
                >
                  <Heart className={`h-4 w-4 stroke-[1.5] ${product.favorite ? "fill-red-500 stroke-red-500" : ""}`} />
                </button>

                {/* Hover Quick Add */}
                <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => handleAddToBag(product.name, e)}
                    className="w-full bg-[#030213] text-white py-3 rounded text-[10px] font-bold tracking-[0.15em] hover:bg-neutral-800 transition-colors uppercase shadow-lg"
                  >
                    ADD TO BAG
                  </button>
                </div>
              </div>

              {/* Info details */}
              <div>
                <span className="text-[9px] font-bold tracking-widest text-[#b2533e] uppercase">
                  {product.brand}
                </span>
                <h3 className="text-sm font-bold tracking-tight mt-0.5 mb-1.5 text-neutral-900 line-clamp-1">
                  {product.name}
                </h3>

                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-xs font-semibold text-neutral-500">
                    £{product.price.toFixed(2)}
                  </span>

                  <div className="flex justify-between items-center gap-1.5">
                    {/* Colors indicators */}
                    {product.colors && (
                      <div className="flex gap-1.5">
                        {product.colors.map((c, i) => (
                          <div
                            key={i}
                            className="w-2.5 h-2.5 rounded-full border border-neutral-200"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Ratings */}
                    {product.rating && (
                      <div className="flex items-center text-neutral-800">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-2.5 w-2.5 fill-current stroke-current" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}

        {/* Append loading skeletons when infinite scroll triggers */}
        {!isLoading && isInfiniteLoading && (
          [...Array(Math.min(3, filteredProducts.length - visibleCount))].map((_, i) => (
            <ProductSkeleton key={`infinite-skeleton-${i}`} />
          ))
        )}
      </div>

      {/* Infinite Scroll Trigger & Spinner */}
      {visibleCount < filteredProducts.length && (
        <div ref={loaderRef} className="h-24 flex items-center justify-center mt-6">
          {isInfiniteLoading && (
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-[#030213]" />
              <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">LOADING MORE...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
