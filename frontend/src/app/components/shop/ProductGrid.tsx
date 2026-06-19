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
  images: string[];
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

interface ProductCardProps {
  product: Product;
  toggleFavorite: (id: number, e: React.MouseEvent) => void;
  cartItems: any[];
  handleAddToBag: (product: Product, e: React.MouseEvent) => void;
  updateProductQuantityInCart: (product: Product, newQty: number, e: React.MouseEvent) => void;
}

function ProductCard({
  product,
  toggleFavorite,
  cartItems,
  handleAddToBag,
  updateProductQuantityInCart
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

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

  const cartItem = cartItems.find((i: any) => i.cartItemId === `${product.id}-Default-S`);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden mb-4">
        {/* Images with crossfade transition */}
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

        {/* Premium Zara-style Dash Indicators with active progress filling */}
        {isHovered && product.images.length > 1 && (
          <div className="absolute top-3 inset-x-4 flex gap-1.5 z-10 transition-all duration-300">
            {product.images.map((_, idx) => (
              <div key={idx} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden relative">
                {idx === activeIdx ? (
                  <div
                    key={`progress-${idx}`}
                    style={{ animation: 'progressGrow 1.5s linear forwards' }}
                    className="absolute left-0 top-0 h-full bg-white"
                  />
                ) : (
                  <div
                    className={`absolute left-0 top-0 h-full bg-white/40 ${idx < activeIdx ? 'w-full' : 'w-0'}`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Style block for the progress bar keyframes */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes progressGrow {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}} />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-4 left-4 bg-white text-[#030213] text-[9px] font-bold tracking-[0.15em] px-3 py-1.5 rounded-sm z-10">
            {product.badge}
          </span>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={(e) => toggleFavorite(product.id, e)}
          className="absolute top-4 right-4 bg-white/95 text-neutral-800 p-2 rounded-full shadow-sm hover:text-red-500 transition-colors z-10"
        >
          <Heart className={`h-4 w-4 stroke-[1.5] ${product.favorite ? "fill-red-500 stroke-red-500" : ""}`} />
        </button>

         {/* Hover Quick Add */}
         <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
           {!cartItem ? (
             <button
               onClick={(e) => handleAddToBag(product, e)}
               className="w-full bg-[#030213] text-white py-3 rounded text-[10px] font-bold tracking-[0.15em] hover:bg-neutral-800 transition-colors uppercase shadow-lg cursor-pointer border-none"
             >
               ADD TO BAG
             </button>
           ) : (
             <div 
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
               className="w-full bg-[#030213] text-white py-2 rounded text-[11px] font-bold tracking-[0.15em] shadow-lg flex items-center justify-between select-none px-2"
             >
               <button
                 onClick={(e) => updateProductQuantityInCart(product, cartItem.quantity - 1, e)}
                 className="px-3 py-1 text-white hover:text-neutral-300 font-extrabold text-sm cursor-pointer border-none bg-transparent"
               >
                 -
               </button>
               <span>{cartItem.quantity}</span>
               <button
                 onClick={(e) => updateProductQuantityInCart(product, cartItem.quantity + 1, e)}
                 className="px-3 py-1 text-white hover:text-neutral-300 font-extrabold text-sm cursor-pointer border-none bg-transparent"
               >
                 +
               </button>
             </div>
           )}
         </div>
      </div>

      {/* Info details */}
      <div className="flex flex-col gap-1.5 mt-1">
         <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase">{product.brand}</span>
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
               <span className="text-[8px] font-extrabold text-[#b2533e] uppercase tracking-wider bg-red-50 px-1 py-0.5 rounded-sm">
                 {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
               </span>
             </>
            )}
          </div>

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
    </Link>
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
  const genderParam = searchParams.get("gender");

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
      originalPrice: 499.00,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.25&fp-z=1.5",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.6&fp-z=1.3"
      ],
      colors: ["#FAF8F5", "#1A1A1A"]
    },
    {
      id: 2,
      brand: "CORE COLLECTION",
      name: "Oversized Knit Sweater Dress",
      price: 185.00,
      originalPrice: 399.00,
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.6",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.7&fp-z=1.4"
      ],
      colors: ["#9CA3AF", "#D2C9BD"]
    },
    {
      id: 3,
      brand: "ESSENTIALS",
      name: "Boxy Minimalist Maxi Dress",
      price: 135.00,
      originalPrice: 299.00,
      image: "https://images.unsplash.com/photo-1539008885128-403bb34856b8?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1539008885128-403bb34856b8?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1539008885128-403bb34856b8?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.2&fp-z=1.5",
        "https://images.unsplash.com/photo-1539008885128-403bb34856b8?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.6&fp-z=1.3"
      ],
      badge: "NEW"
    },
    {
      id: 4,
      brand: "ARCHIVE COLLECTION",
      name: "Structured Canvas Utility Dress",
      price: 295.00,
      originalPrice: 599.00,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.35&fp-z=1.5",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.7&fp-z=1.3"
      ],
      colors: ["#1A1A1A"],
      rating: 5
    },
    {
      id: 5,
      brand: "DRIP LUXE",
      name: "Tiered Organza Street Slip",
      price: 320.00,
      originalPrice: 699.00,
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.6",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.6&fp-z=1.3"
      ]
    },
    {
      id: 6,
      brand: "ESSENTIALS",
      name: "Architectural Drape Rib Dress",
      price: 165.00,
      originalPrice: 349.00,
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.25&fp-z=1.5",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.65&fp-z=1.3"
      ],
      colors: ["#D2C9BD"]
    },
    {
      id: 7,
      brand: "TACTICAL APPAREL",
      name: "Parachute Cotton Cargo Skirt",
      price: 195.00,
      originalPrice: 399.00,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.4&fp-z=1.5",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.7&fp-z=1.3"
      ],
      badge: "NEW"
    },
    {
      id: 8,
      brand: "DRIP LUXE",
      name: "Asymmetrical Linen Slip Dress",
      price: 210.00,
      originalPrice: 449.00,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.5",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.65&fp-z=1.3"
      ],
      rating: 5
    },
    {
      id: 9,
      brand: "CORE COLLECTION",
      name: "Oversized French Terry Dress Hoodie",
      price: 220.00,
      originalPrice: 449.00,
      image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.5",
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.7&fp-z=1.3"
      ]
    },
    {
      id: 10,
      brand: "ACCESSORIES",
      name: "Tactical Ripstop Sling Bag",
      price: 95.00,
      originalPrice: 199.00,
      image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.4&fp-z=1.5",
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.6&fp-z=1.3"
      ],
      colors: ["#000000", "#9CA3AF"]
    },
    {
      id: 11,
      brand: "ACCESSORIES",
      name: "Signature Webbing Collar & Lead Set",
      price: 65.00,
      originalPrice: 149.00,
      image: "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.5",
        "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.7&fp-z=1.3"
      ],
      colors: ["#000000", "#D4C5B9"]
    },
    {
      id: 12,
      brand: "ACCESSORIES",
      name: "Streetwear Ripstop Camp Cap",
      price: 45.00,
      originalPrice: 99.00,
      image: "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.5",
        "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.6&fp-z=1.3"
      ],
      colors: ["#000000", "#D2C9BD"]
    }
  ]);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const stored = localStorage.getItem("cart");
        setCartItems(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  const updateProductQuantityInCart = (product: Product, newQty: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("cart");
      let items = stored ? JSON.parse(stored) : [];
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
            image: product.image
          });
        }
      }
      localStorage.setItem("cart", JSON.stringify(items));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToBag = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("cart");
      let items = stored ? JSON.parse(stored) : [];
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
          image: product.image
        });
      }
      localStorage.setItem("cart", JSON.stringify(items));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger loading skeleton state on filter parameters change
  useEffect(() => {
    setIsLoading(true);
    setVisibleCount(6);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [collectionParam, newParam, categoryParam, sizeParam, colorParam, priceRangeParam, genderParam]);

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
    // Filter by gender / main category
    const isAccessories = genderParam === "accessories";
    if (isAccessories && product.brand !== "ACCESSORIES") return false;
    if (!isAccessories && product.brand === "ACCESSORIES") return false;

    // 3. Filter by subcategory
    if (categoryParam) {
      const cat = categoryParam.toLowerCase();
      const name = product.name.toLowerCase();
      if (isAccessories) {
        if (cat === "bags" && !name.includes("bag") && !name.includes("sling")) return false;
        if (cat === "caps" && !name.includes("cap") && !name.includes("hat")) return false;
        if (cat === "belts" && !name.includes("belt") && !name.includes("collar") && !name.includes("lead")) return false;
      } else {
        if (cat === "dresses" && !name.includes("dress") && !name.includes("slip")) return false;
        if (cat === "outerwear" && !name.includes("trench") && !name.includes("utility") && !name.includes("jacket") && !name.includes("hoodie") && !name.includes("sweater")) return false;
        if (cat === "tops" && !name.includes("rib") && !name.includes("tee") && !name.includes("t-shirt")) return false;
        if (cat === "skirts" && !name.includes("skirt") && !name.includes("pants")) return false;
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
            <ProductCard
              key={product.id}
              product={product}
              toggleFavorite={toggleFavorite}
              cartItems={cartItems}
              handleAddToBag={handleAddToBag}
              updateProductQuantityInCart={updateProductQuantityInCart}
            />
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


