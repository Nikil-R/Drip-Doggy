import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link, useNavigate } from "react-router";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Summer Linen Dress",
    price: 3499.00,
    originalPrice: 4999.00,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop&crop=focalpoint&fp-y=0.2&fp-z=1.5",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop&crop=focalpoint&fp-y=0.7&fp-z=1.3"
    ],
    badge: "Festive",
    rating: 4.8
  },
  {
    id: 2,
    name: "Sage Slip Dress",
    price: 4299.00,
    originalPrice: 5999.00,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop&crop=focalpoint&fp-y=0.3&fp-z=1.4",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop&crop=focalpoint&fp-y=0.6&fp-z=1.5"
    ],
    badge: "Exclusive",
    rating: 4.9
  },
  {
    id: 3,
    name: "Floral Wrap Dress",
    price: 2899.00,
    originalPrice: 3999.00,
    images: [
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=600&auto=format&fit=crop&crop=focalpoint&fp-y=0.25&fp-z=1.5",
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=600&auto=format&fit=crop&crop=focalpoint&fp-y=0.6&fp-z=1.3"
    ],
    badge: "Trending",
    rating: 4.7
  },
  {
    id: 4,
    name: "Crimson Evening Gown",
    price: 2199.00,
    originalPrice: 2999.00,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop&crop=focalpoint&fp-y=0.25&fp-z=1.5",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop&crop=focalpoint&fp-y=0.65&fp-z=1.3"
    ],
    badge: "Sale",
    rating: 4.6
  }
];

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  badge?: string;
  rating: number;
}

function ProductCard({ product }: { product: Product }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

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
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

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

  const saveCart = (items: any[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const size = "S";
    const color = "Default";
    const cartItemId = `${product.id}-${color}-${size}`;
    
    const existing = cartItems.find((item) => item.cartItemId === cartItemId);
    let updated;
    
    if (existing) {
      updated = cartItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [
        ...cartItems,
        {
          id: product.id,
          cartItemId,
          brand: "FEATURED APPAREL",
          name: product.name,
          size,
          color,
          price: product.price,
          quantity: 1,
          image: product.images[0]
        }
      ];
    }
    saveCart(updated);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const size = "S";
    const color = "Default";
    const cartItemId = `${product.id}-${color}-${size}`;
    
    const existing = cartItems.find((item) => item.cartItemId === cartItemId);
    let updated;
    
    if (existing) {
      updated = cartItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [
        ...cartItems,
        {
          id: product.id,
          cartItemId,
          brand: "FEATURED APPAREL",
          name: product.name,
          size,
          color,
          price: product.price,
          quantity: 1,
          image: product.images[0]
        }
      ];
    }
    saveCart(updated);
    navigate("/checkout");
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border border-neutral-100/60 bg-white hover:shadow-lg transition-all duration-300 flex flex-col h-full rounded-none">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-150">
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
                      style={{ animation: 'progressGrowFeatured 1.5s linear forwards' }}
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
            @keyframes progressGrowFeatured {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}} />

          {product.badge && (
            <Badge
              className="absolute top-3 left-3 bg-[#030213] text-white hover:bg-black font-semibold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-none"
            >
              {product.badge}
            </Badge>
          )}


        </div>

        <div className="p-3.5 flex flex-col flex-grow justify-between">
          <div>
            <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase">FEATURED</span>
            <h3 className="text-xs md:text-sm font-extrabold text-[#030213] uppercase leading-tight line-clamp-1 mt-0.5 mb-1 group-hover:text-black">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[#b2533e] text-[10px]">
                  {i < Math.floor(product.rating) ? "★" : "☆"}
                </span>
              ))}
              <span className="text-[9px] text-muted-foreground ml-1">
                ({product.rating})
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
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
        </div>
      </Card>
    </Link>
  );
}

export function FeaturedProducts() {
  return (
    <section className="snap-start snap-always min-h-screen pt-6 pb-16 lg:pt-8 lg:pb-20 flex flex-col justify-center bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-3xl lg:text-4xl mb-2 font-extrabold tracking-tight text-[#030213]">FEATURED APPAREL</h2>
          <p className="text-muted-foreground text-xs lg:text-sm uppercase tracking-widest font-semibold text-[#b2533e]">
            Handpicked premium curation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-8 lg:mt-10 pb-6">
          <Link to="/shop">
            <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-bold uppercase tracking-wider text-xs px-8 rounded-none">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}











