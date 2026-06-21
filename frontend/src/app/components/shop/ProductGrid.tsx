import { Heart, Star, ShoppingBag, Plus, Minus, RotateCcw } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useState, useEffect, useRef, useMemo } from "react";
import { products as catalogProducts } from "../../data/products";
import type { Product } from "../../data/products";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDiscountPercent(product: Product): number {
  if (!product.originalPrice) return 0;
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
}

type SortOption = "default" | "price-asc" | "price-desc";

interface CartItem {
  id: number;
  cartItemId: string;
  quantity: number;
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="flex flex-col justify-between">
      <div className="aspect-[3/4] bg-neutral-200/60 animate-pulse" />
      <div className="space-y-2.5 mt-4">
        <div className="h-2.5 bg-neutral-200/60 animate-pulse rounded w-1/4" />
        <div className="h-4 bg-neutral-200/60 animate-pulse rounded w-3/4" />
        <div className="h-3 bg-neutral-200/60 animate-pulse rounded w-1/5 mt-1" />
      </div>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────

function ProductCard({
  product,
  isFav,
  onToggleFav,
  cartQty,
  onAddToBag,
  onUpdateQty,
}: {
  product: Product;
  isFav: boolean;
  cartQty: number;
  onToggleFav: (e: React.MouseEvent) => void;
  onAddToBag: (e: React.MouseEvent) => void;
  onUpdateQty: (newQty: number, e: React.MouseEvent) => void;
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
            className={`absolute top-4 left-4 text-[9px] font-bold tracking-[0.15em] px-3 py-1.5 z-10 ${
              product.badge === "SOLD OUT"
                ? "bg-neutral-100 text-neutral-500"
                : "bg-white text-[#030213]"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={onToggleFav}
          className="absolute top-4 right-4 bg-white/95 text-neutral-800 p-2 shadow-sm hover:text-red-500 transition-colors z-10 bg-transparent border-none cursor-pointer"
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 stroke-[1.5] ${
              isFav ? "fill-red-500 stroke-red-500" : ""
            }`}
          />
        </button>

        {/* Add to Bag Overlay — visible on hover */}
        <div
          className={`absolute inset-x-4 bottom-4 transition-all duration-300 z-20 ${
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          {cartQty === 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToBag(e);
              }}
              className="w-full bg-black/90 hover:bg-black text-white text-[9px] font-extrabold tracking-[0.2em] py-3 uppercase backdrop-blur-sm transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5 stroke-[2]" />
              ADD TO BAG
            </button>
          ) : (
            <div className="w-full bg-black/90 text-white backdrop-blur-sm flex items-center justify-between px-3 py-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateQty(cartQty - 1, e);
                }}
                className="text-white hover:text-neutral-300 font-extrabold text-sm bg-transparent border-none cursor-pointer p-1"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3 stroke-[2]" />
              </button>
              <span className="text-[10px] font-extrabold tracking-wider">
                {cartQty} IN BAG
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateQty(cartQty + 1, e);
                }}
                className="text-white hover:text-neutral-300 font-extrabold text-sm bg-transparent border-none cursor-pointer p-1"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3 stroke-[2]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 mt-1">
        <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase">
          {product.brand}
        </span>
        <h3 className="text-xs md:text-sm font-extrabold text-[#030213] uppercase leading-tight line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-sm font-extrabold text-neutral-900">
            ₹{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xs font-semibold text-neutral-450 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-[8px] font-extrabold text-[#b2533e] uppercase tracking-wider bg-red-50 px-1 py-0.5">
                  {discount}% OFF
                </span>
              )}
            </>
          )}
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5">
            {product.colors.map((c, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 border border-neutral-200"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        {product.rating && (
          <div className="flex items-center text-neutral-800">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-2.5 w-2.5 fill-current stroke-current"
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Product Grid ──────────────────────────────────────────────────────────

export function ProductGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionParam = searchParams.get("collection");
  const newParam = searchParams.get("new");
  const categoryParam = searchParams.get("category");
  const sizeParam = searchParams.get("size");
  const colorParam = searchParams.get("color");
  const priceRangeParam = searchParams.get("price");
  const genderParam = searchParams.get("gender");
  const sortParam = searchParams.get("sort");

  const [isLoading, setIsLoading] = useState(true);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Use shared catalog — no more hardcoded products
  const [products] = useState<Product[]>(catalogProducts);

  // ─── Wishlist sync ────────────────────────────────────────────────────
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

  // ─── Cart sync ────────────────────────────────────────────────────────
  const [cartLookup, setCartLookup] = useState<Map<string, number>>(() => {
    const map = new Map<string, number>();
    try {
      const stored = localStorage.getItem("cart");
      const items: CartItem[] = stored ? JSON.parse(stored) : [];
      for (const item of items) {
        map.set(item.cartItemId, item.quantity);
      }
    } catch {
      /* ignore */
    }
    return map;
  });

  useEffect(() => {
    const sync = () => {
      try {
        const stored = localStorage.getItem("cart");
        const items: CartItem[] = stored ? JSON.parse(stored) : [];
        const map = new Map<string, number>();
        for (const item of items) {
          map.set(item.cartItemId, item.quantity);
        }
        setCartLookup(map);
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const getCartQty = (productId: number): number => {
    const key = `${productId}-Default-S`;
    return cartLookup.get(key) ?? 0;
  };

  const handleAddToBag = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("cart");
      let items: any[] = stored ? JSON.parse(stored) : [];
      const cartItemId = `${product.id}-Default-S`;
      const existing = items.find((i: any) => i.cartItemId === cartItemId);
      if (existing) {
        existing.quantity += 1;
      } else {
        items.push({
          id: product.id,
          cartItemId,
          brand: product.brand,
          name: product.name,
          size: "S",
          color: "Default",
          price: product.price,
          quantity: 1,
          image: product.image,
        });
      }
      localStorage.setItem("cart", JSON.stringify(items));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQty = (
    product: Product,
    newQty: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("cart");
      let items: any[] = stored ? JSON.parse(stored) : [];
      const cartItemId = `${product.id}-Default-S`;

      if (newQty <= 0) {
        items = items.filter((i: any) => i.cartItemId !== cartItemId);
      } else {
        const existing = items.find((i: any) => i.cartItemId === cartItemId);
        if (existing) {
          existing.quantity = newQty;
        } else {
          items.push({
            id: product.id,
            cartItemId,
            brand: product.brand,
            name: product.name,
            size: "S",
            color: "Default",
            price: product.price,
            quantity: newQty,
            image: product.image,
          });
        }
      }
      localStorage.setItem("cart", JSON.stringify(items));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("wishlist");
      let list: any[] = stored ? JSON.parse(stored) : [];
      const exists = list.some((item: any) => item.id === product.id);

      if (exists) {
        list = list.filter((item: any) => item.id !== product.id);
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

  // ─── Loading skeleton on param change ──────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    setVisibleCount(6);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [
    collectionParam,
    newParam,
    categoryParam,
    sizeParam,
    colorParam,
    priceRangeParam,
    genderParam,
    sortParam,
  ]);

  // ─── Filter + Sort ────────────────────────────────────────────────────
  const sortBy: SortOption =
    sortParam === "price-asc" || sortParam === "price-desc"
      ? sortParam
      : "default";

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // Collection filter
      if (collectionParam) {
        const col = collectionParam.toLowerCase();
        if (col === "core" && !product.brand.toLowerCase().includes("core"))
          return false;
        if (col === "archive" && !product.brand.toLowerCase().includes("archive"))
          return false;
        if (col === "luxe" && !product.brand.toLowerCase().includes("luxe"))
          return false;
        if (col === "tactical" && !product.brand.toLowerCase().includes("tactical"))
          return false;
      }

      // New arrivals filter
      if (newParam === "true" && product.badge !== "NEW") return false;

      // Gender / main category filter
      const isAccessories = genderParam === "accessories";
      if (isAccessories && product.brand !== "ACCESSORIES") return false;
      if (!isAccessories && product.brand === "ACCESSORIES") return false;

      // Subcategory filter
      if (categoryParam) {
        const cat = categoryParam.toLowerCase();
        const name = product.name.toLowerCase();
        if (isAccessories) {
          if (cat === "bags" && !name.includes("bag") && !name.includes("sling"))
            return false;
          if (cat === "caps" && !name.includes("cap") && !name.includes("hat"))
            return false;
          if (
            cat === "belts" &&
            !name.includes("belt") &&
            !name.includes("collar") &&
            !name.includes("lead")
          )
            return false;
        } else {
          if (
            cat === "dresses" &&
            !name.includes("dress") &&
            !name.includes("slip")
          )
            return false;
          if (
            cat === "outerwear" &&
            !name.includes("trench") &&
            !name.includes("utility") &&
            !name.includes("jacket") &&
            !name.includes("hoodie") &&
            !name.includes("sweater")
          )
            return false;
          if (
            cat === "tops" &&
            !name.includes("rib") &&
            !name.includes("tee") &&
            !name.includes("t-shirt")
          )
            return false;
          if (
            cat === "skirts" &&
            !name.includes("skirt") &&
            !name.includes("pants")
          )
            return false;
        }
      }

      // ✅ SIZE FILTER — now actually works!
      if (sizeParam) {
        const sz = sizeParam.toUpperCase();
        const productSizes = product.sizes ?? [];
        if (productSizes.length > 0 && !productSizes.includes(sz))
          return false;
      }

      // Color filter
      if (colorParam) {
        const col = colorParam.toLowerCase();
        if (product.colors) {
          const hasColor = product.colors.some((c) => {
            if (col === "black" && (c === "#1A1A1A" || c === "#000000"))
              return true;
            if (col === "white" && (c === "#FAF8F5" || c === "#FFFFFF"))
              return true;
            if (col === "gray" && c === "#9CA3AF") return true;
            if (col === "beige" && (c === "#D2C9BD" || c === "#D4C5B9"))
              return true;
            if (col === "brown" && c === "#92400E") return true;
            return false;
          });
          if (!hasColor) return false;
        } else {
          return false;
        }
      }

      // Price range filter
      const [minPrice, maxPrice] = priceRangeParam
        ? priceRangeParam.split("-").map(Number)
        : [0, 500];
      if (product.price < minPrice || product.price > maxPrice) return false;

      return true;
    });

    // Sort
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    products,
    collectionParam,
    newParam,
    categoryParam,
    sizeParam,
    colorParam,
    priceRangeParam,
    genderParam,
    sortBy,
  ]);

  // ─── Infinite scroll ──────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          visibleCount < filteredProducts.length &&
          !isInfiniteLoading
        ) {
          setIsInfiniteLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(filteredProducts.length, prev + 3)
            );
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

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div>
      {/* Sorting bar */}
      <div className="flex justify-between items-baseline mb-8 text-xs font-bold tracking-widest text-neutral-400 uppercase">
        <p>
          SHOWING {isLoading ? "..." : filteredProducts.length} PRODUCT
          {filteredProducts.length !== 1 ? "S" : ""}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px]">SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              const val = e.target.value;
              const newParams = new URLSearchParams(searchParams);
              if (val === "default") {
                newParams.delete("sort");
              } else {
                newParams.set("sort", val);
              }
              setSearchParams(newParams, { replace: true });
            }}
            className="bg-transparent border-none text-[10px] font-bold text-[#030213] tracking-widest uppercase focus:outline-none cursor-pointer"
          >
            <option value="default">DEFAULT</option>
            <option value="price-asc">PRICE LOW TO HIGH</option>
            <option value="price-desc">PRICE HIGH TO LOW</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
        {isLoading ? (
          [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
        ) : filteredProducts.length === 0 ? (
          /* ── Empty State ──────────────────────────────────────────── */
          <div className="col-span-full bg-white border border-neutral-200/80 p-12 md:p-16 text-center">
            <RotateCcw className="h-10 w-10 text-neutral-300 mx-auto mb-4 stroke-[1.2]" />
            <h2 className="text-sm font-extrabold tracking-[0.2em] uppercase mb-2">
              No Products Found
            </h2>
            <p className="text-[11px] text-neutral-500 leading-relaxed max-w-sm mx-auto mb-6">
              No products match your current filter selection. Try adjusting
              or clearing your filters.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#030213] text-white px-8 py-3 text-[10px] font-extrabold tracking-[0.2em] hover:bg-neutral-800 transition-colors uppercase"
            >
              Clear Filters
            </Link>
          </div>
        ) : (
          filteredProducts.slice(0, visibleCount).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFav={wishlistedIds.has(product.id)}
              cartQty={getCartQty(product.id)}
              onToggleFav={(e) => toggleWishlist(product, e)}
              onAddToBag={(e) => handleAddToBag(product, e)}
              onUpdateQty={(newQty, e) => handleUpdateQty(product, newQty, e)}
            />
          ))
        )}

        {/* Infinite scroll loading skeletons */}
        {!isLoading && isInfiniteLoading && (
          <>
            {[
              ...Array(
                Math.min(3, filteredProducts.length - visibleCount)
              ),
            ].map((_, i) => (
              <ProductSkeleton key={`inf-${i}`} />
            ))}
          </>
        )}
      </div>

      {/* Infinite scroll trigger */}
      {visibleCount < filteredProducts.length && (
        <div
          ref={loaderRef}
          className="h-24 flex items-center justify-center mt-6"
        >
          {isInfiniteLoading && (
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-[#030213]" />
              <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                LOADING MORE...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
