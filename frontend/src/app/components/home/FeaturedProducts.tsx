import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { products } from "../../data/products";

// Distinct product sets for each section — no duplicates across sections
const CATALOG = products;

// New Arrivals: products with NEW badge (ids 3, 7) or first 4 as fallback
const NEW_ARRIVALS = CATALOG.filter(p => p.badge === "NEW");
const NEW_ARRIVALS_SET = NEW_ARRIVALS.length >= 2 ? NEW_ARRIVALS.slice(0, 4) : CATALOG.slice(4, 8);

// Best Sellers: highest-rated products (rating >= 4.8) or next 4 as fallback
const BESTSELLERS = CATALOG.filter(p => p.rating && p.rating >= 4.8);
const BESTSELLERS_SET = BESTSELLERS.length >= 2 ? BESTSELLERS.slice(0, 4) : CATALOG.slice(8, 12);

// Featured Apparel: first 4 products
const FEATURED_SET = CATALOG.slice(0, 4);

function ProductCard({ product }: { product: typeof CATALOG[0] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const stored = localStorage.getItem("cart");
        setCartItems(stored ? JSON.parse(stored) : []);
      } catch { /* noop */ }
    };
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  useEffect(() => {
    if (!isHovered) { setActiveIdx(0); return; }
    const timer = setInterval(() => setActiveIdx(prev => (prev + 1) % product.images.length), 1500);
    return () => clearInterval(timer);
  }, [isHovered, product.images.length]);

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = "S";
    const color = "Default";
    const cartItemId = `${product.id}-${color}-${size}`;
    const existing = cartItems.find(item => item.cartItemId === cartItemId);
    let updated;
    if (existing) {
      updated = cartItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [...cartItems, {
        id: product.id, cartItemId, brand: product.brand, name: product.name,
        size, color, price: product.price, quantity: 1, image: product.image,
      }];
    }
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isInCart = cartItems.some((item: any) => item.id === product.id);

  return (
    <Link to={`/product/${product.id}`}
      className="group flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
        {product.images.map((imgSrc, idx) => (
          <img key={idx} src={imgSrc} alt={`${product.name} - View ${idx + 1}`}
            style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[750ms] ${
              idx === activeIdx ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`} />
        ))}

        {isHovered && product.images.length > 1 && (
          <div className="absolute top-3 inset-x-4 flex gap-1.5 z-10">
            {product.images.map((_, idx) => (
              <div key={idx} className="h-[2px] flex-1 bg-white/20 overflow-hidden relative">
                {idx === activeIdx ? (
                  <div key={`progress-${idx}`}
                    style={{ animation: 'progressGrow 1.5s linear forwards' }}
                    className="absolute left-0 top-0 h-full bg-white" />
                ) : (
                  <div className={`absolute left-0 top-0 h-full bg-white/40 ${idx < activeIdx ? 'w-full' : 'w-0'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes progressGrow { from { width: 0%; } to { width: 100%; } }
        `}} />

        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#030213] text-white text-[8px] font-extrabold tracking-wider uppercase px-2 py-1 z-10">
            {product.badge}
          </span>
        )}

        <button onClick={handleAddToBag}
          className="absolute inset-x-4 bottom-4 bg-black/95 text-white hover:bg-neutral-900 py-3 text-[9px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 border-none cursor-pointer z-10 shadow-lg flex items-center justify-center gap-2">
          <ShoppingBag className="h-3 w-3 stroke-[2]" />
          {isInCart ? "ADD MORE" : "ADD TO BAG"}
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase">{product.brand}</span>
        <h3 className="text-xs md:text-sm font-extrabold text-[#030213] uppercase leading-tight line-clamp-1 group-hover:underline">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-sm font-extrabold text-neutral-900">₹{product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <>
              <span className="text-xs font-semibold text-neutral-450 line-through">₹{product.originalPrice.toFixed(2)}</span>
              <span className="text-[8px] font-extrabold text-[#b2533e] uppercase tracking-wider bg-red-50 px-1.5 py-0.5">{discountPercent}% OFF</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function ProductGridSection({ title, subtitle, items, linkText }: {
  title: string; subtitle: string; items: typeof CATALOG; linkText?: string;
}) {
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-baseline mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#030213] uppercase">{title}</h2>
            <p className="text-[10px] text-[#b2533e] font-extrabold tracking-widest uppercase mt-1">{subtitle}</p>
          </div>
          {linkText && (
            <Link to="/shop"
              className="text-[10px] font-bold tracking-[0.2em] border-b border-neutral-900 pb-0.5 hover:opacity-75 transition-opacity uppercase flex-shrink-0">
              {linkText}
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialBanner({ title, subtitle, cta, image, reverse }: {
  title: string; subtitle: string; cta: string; image: string; reverse?: boolean;
}) {
  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 items-center`}>
          <div className="w-full lg:w-1/2 aspect-[4/3] overflow-hidden bg-neutral-100">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="w-full lg:w-1/2 max-w-md">
            <span className="text-[8px] font-black tracking-[0.3em] text-neutral-400 uppercase mb-4 block">Editorial</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#030213] uppercase mb-4">{title}</h2>
            <p className="text-[13px] text-neutral-600 leading-relaxed mb-8 font-medium">{subtitle}</p>
            <Link to="/shop"
              className="inline-block bg-[#030213] hover:bg-neutral-800 text-white px-8 py-3.5 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-colors">
              {cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  return (
    <>
      {/* New Arrivals */}
      <ProductGridSection
        title="New Arrivals"
        subtitle="The latest drops"
        items={NEW_ARRIVALS_SET}
        linkText="View All"
      />

      {/* Editorial Banner */}
      <EditorialBanner
        title="Architectural Precision"
        subtitle="Each piece is engineered with precision-molded panels, differential ribbing, and reinforced structural seams. Luxury streetwear redefined."
        cta="Explore the Collection"
        image="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop"
      />

      {/* Best Sellers */}
      <ProductGridSection
        title="Best Sellers"
        subtitle="Most wanted"
        items={BESTSELLERS_SET}
        linkText="View All"
      />

      {/* Second Editorial Banner */}
      <EditorialBanner
        title="SS26 Capsule"
        subtitle="Heavyweight French terry meets architectural tailoring. The new season explores the tension between utility and elegance."
        cta="Shop the Capsule"
        image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
        reverse
      />

      {/* Featured Apparel */}
      <section className="snap-start snap-always min-h-screen pt-6 pb-16 lg:pt-8 lg:pb-20 flex flex-col justify-center bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-3xl lg:text-4xl mb-2 font-extrabold tracking-tight text-[#030213] uppercase">Featured Apparel</h2>
            <p className="text-xs lg:text-sm uppercase tracking-widest font-semibold text-[#b2533e]">
              Handpicked premium curation
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
            {FEATURED_SET.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8 lg:mt-10">
            <Link to="/shop"
              className="inline-block border-2 border-[#030213] text-[#030213] hover:bg-[#030213] hover:text-white px-8 py-3 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
