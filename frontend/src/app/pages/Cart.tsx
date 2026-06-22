import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Heart, ShoppingBag, ShieldCheck, RefreshCw, Truck, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { products } from "../data/products";

interface CartItem {
  id: number;
  cartItemId: string;
  brand: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
  favorite?: boolean;
  originalPrice?: number;
  outOfStock?: boolean;
}

function CheckoutButton({ cartItems }: { cartItems: CartItem[] }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
    }
  };

  return (
    <button onClick={handleCheckout} disabled={cartItems.length === 0}
      className={`w-full bg-[#030213] text-white py-3.5 text-[10px] font-extrabold tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-950/10 cursor-pointer disabled:cursor-not-allowed border border-black ${cartItems.length === 0 ? "opacity-50" : ""}`}>
      PROCEED TO CHECKOUT
    </button>
  );
}

export function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      const items = storedCart ? JSON.parse(storedCart) : [];
      const storedWishlist = localStorage.getItem("wishlist");
      const wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
      const wishlistIds = new Set(wishlist.map((w: any) => w.id));
      return items.map((item: any) => ({
        ...item,
        favorite: wishlistIds.has(item.id),
      }));
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => localStorage.getItem("appliedPromo") || null);
  const [promoDiscount, setPromoDiscount] = useState<number>(() => Number(localStorage.getItem("promoDiscount")) || 0);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Sync state with localStorage
  useEffect(() => {
    const syncCart = () => {
      try {
        const storedCart = localStorage.getItem("cart");
        const items = storedCart ? JSON.parse(storedCart) : [];
        const storedWishlist = localStorage.getItem("wishlist");
        const wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
        const wishlistIds = new Set(wishlist.map((w: any) => w.id));
        setCartItems(items.map((item: any) => ({ ...item, favorite: wishlistIds.has(item.id) })));
      } catch {
        setCartItems([]);
      }
    };
    window.addEventListener("cart-updated", syncCart);
    window.addEventListener("wishlist-updated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("cart-updated", syncCart);
      window.removeEventListener("wishlist-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      );
      saveCart(updated);
      return updated;
    });
  };

  const removeItem = (cartItemId: string) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.cartItemId !== cartItemId);
      saveCart(updated);
      return updated;
    });
  };

  const toggleFavorite = (cartItemId: string) => {
    const itemToToggle = cartItems.find(item => item.cartItemId === cartItemId);
    if (!itemToToggle) return;

    const nextFavorite = !itemToToggle.favorite;
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, favorite: nextFavorite } : item
      );
      saveCart(updated);
      return updated;
    });

    try {
      const stored = localStorage.getItem("wishlist");
      let wishlist = stored ? JSON.parse(stored) : [];
      if (nextFavorite) {
        if (!wishlist.some((wItem: any) => wItem.id === itemToToggle.id)) {
          wishlist.push({ id: itemToToggle.id, brand: itemToToggle.brand, name: itemToToggle.name, price: itemToToggle.price, image: itemToToggle.image });
        }
      } else {
        wishlist = wishlist.filter((wItem: any) => wItem.id !== itemToToggle.id);
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch { /* noop */ }
  };

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "DRIP20") {
      setAppliedPromo("DRIP20");
      setPromoDiscount(Math.round(subtotal * 0.2));
      setPromoError(null);
      localStorage.setItem("appliedPromo", "DRIP20");
      localStorage.setItem("promoDiscount", String(Math.round(subtotal * 0.2)));
    } else if (code === "FREE50") {
      setAppliedPromo("FREE50");
      setPromoDiscount(50);
      setPromoError(null);
      localStorage.setItem("appliedPromo", "FREE50");
      localStorage.setItem("promoDiscount", "50");
    } else {
      setPromoError(`Invalid code "${code}". Try DRIP20 (20% off) or FREE50 (₹50 off).`);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoCode("");
    setPromoError(null);
    localStorage.removeItem("appliedPromo");
    localStorage.removeItem("promoDiscount");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getOriginalPrice = (item: CartItem) => {
    if (item.originalPrice) return item.originalPrice;
    const catalog = products.find(p => p.id === item.id);
    if (catalog?.originalPrice) return catalog.originalPrice;
    return Math.round(item.price * 2.05);
  };

  const deliveryFeeValue = subtotal > 1999 || totalItemCount === 0 ? 0 : 90;
  const totalToPay = Math.max(0, subtotal - promoDiscount + deliveryFeeValue);

  // Recommended products from shared catalog (exclude items already in cart)
  const cartItemIds = new Set(cartItems.map(i => i.id));
  const recommendedProducts = products
    .filter(p => !cartItemIds.has(p.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(p => ({
      id: p.id,
      brand: p.brand,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      images: p.images,
      badge: p.badge,
    }));

  const addRecommendedToCart = (product: any) => {
    const cartItemId = `${product.id}-Default-S`;
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prev, {
          id: product.id, cartItemId, brand: product.brand, name: product.name,
          size: "S", color: "Default", price: product.price, quantity: 1, image: product.images[0],
        }];
      }
      saveCart(updated);
      return updated;
    });
  };

  // Cart is empty — show full empty state with catalogue recommendations
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 py-5">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold tracking-[0.15em] mb-0.1 uppercase">SHOPPING CART</h1>
          <p className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase mb-8">0 items in your bag</p>

          <div className="bg-[#FAF8F5]/30 border border-neutral-200/80 p-12 text-center">
            <ShoppingBag className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-sm font-extrabold tracking-[0.2em] mb-2 uppercase">Your cart is empty</h2>
            <p className="text-neutral-450 text-xs tracking-wider mb-6">Start shopping to add items to your cart.</p>
            <Link to="/shop"
              className="bg-black hover:bg-neutral-800 text-white text-xs font-extrabold tracking-[0.2em] px-8 py-3.5 uppercase transition-colors inline-block">
              Shop Now
            </Link>
          </div>

          {/* Recommendations for empty cart */}
          <section className="mt-16 pt-12 border-t border-neutral-200">
            <h2 className="text-xl font-bold tracking-[0.1em] uppercase mb-8 font-sans">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendedProducts.slice(0, 4).map((prod) => (
                <RecommendedCard key={prod.id} product={prod} onAddToBag={addRecommendedToCart} />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 py-5">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-extrabold tracking-[0.15em] mb-0.1 uppercase">SHOPPING CART</h1>
        <p className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase mb-8">
          {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in your bag
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Items */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-6 pb-4 border-b border-neutral-200 text-[9px] font-extrabold tracking-[0.2em] text-neutral-400 uppercase">
                <div className="col-span-6">PRODUCT</div>
                <div className="col-span-2 text-center">PRICE</div>
                <div className="col-span-2 text-center">QUANTITY</div>
                <div className="col-span-2 text-right">TOTAL</div>
              </div>

              <div className="divide-y divide-neutral-200 border-b border-neutral-200">
                {cartItems.map(item => {
                  const originalPrice = getOriginalPrice(item);
                  const discountPercent = Math.round(((originalPrice - item.price) / originalPrice) * 100);
                  const isOutOfStock = item.outOfStock;

                  return (
                    <div key={item.cartItemId} className="py-6 flex flex-col md:grid md:grid-cols-12 md:gap-6 items-center relative">
                      {/* ITEM COLUMN */}
                      <div className="col-span-6 flex gap-6 w-full items-start">
                        <Link to={`/product/${item.id}`} className="w-20 md:w-24 aspect-[3/4] overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200/40 block">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex-1 flex flex-col justify-between min-h-[100px] md:min-h-0">
                          <div>
                            <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase">{item.brand}</span>
                            <Link to={`/product/${item.id}`} className="block">
                              <h2 className="text-xs md:text-sm font-extrabold tracking-wide mt-1 mb-1.5 uppercase text-neutral-900 leading-tight hover:underline">{item.name}</h2>
                            </Link>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                              Size: {item.size} | Color: {item.color}
                            </p>
                            {isOutOfStock && (
                              <span className="inline-block mt-1 text-[8px] font-extrabold tracking-widest text-red-500 uppercase">Currently Unavailable</span>
                            )}
                          </div>

                          {/* Mobile-only Price and Quantity */}
                          <div className="flex justify-between items-center mt-4 md:hidden">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-neutral-900">₹{item.price.toFixed(2)}</span>
                                <span className="text-[10px] font-medium text-neutral-450 line-through">₹{originalPrice.toFixed(2)}</span>
                                <span className="text-[8px] font-black text-[#b2533e] uppercase tracking-wider bg-red-50 px-1 py-0.5">{discountPercent}% OFF</span>
                              </div>
                            </div>
                            <div className="flex items-center border border-neutral-300 px-2 py-0.5 bg-white">
                              <button onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="text-neutral-400 hover:text-neutral-900 px-1.5 text-xs font-bold bg-transparent border-none cursor-pointer">-</button>
                              <span className="text-[10px] font-extrabold w-5 text-center text-neutral-800">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.cartItemId, 1)}
                                className="text-neutral-400 hover:text-neutral-900 px-1.5 text-xs font-bold bg-transparent border-none cursor-pointer">+</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* DESKTOP PRICE */}
                      <div className="hidden md:flex col-span-2 flex-col items-center justify-center text-center gap-1">
                        <div className="flex items-center gap-2 justify-center">
                          <span className="text-sm font-extrabold text-neutral-900">₹{item.price.toFixed(2)}</span>
                          <span className="text-[10px] font-medium text-neutral-450 line-through">₹{originalPrice.toFixed(2)}</span>
                        </div>
                        <span className="text-[8px] font-black text-[#b2533e] uppercase tracking-widest bg-red-50 px-1.5 py-0.5">{discountPercent}% OFF</span>
                      </div>

                      {/* DESKTOP QUANTITY */}
                      <div className="hidden md:flex col-span-2 justify-center">
                        <div className="flex items-center border border-neutral-200/80 px-2 py-1 bg-white">
                          <button onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="text-neutral-400 hover:text-neutral-900 px-2 text-xs font-bold bg-transparent border-none cursor-pointer">-</button>
                          <span className="text-[11px] font-extrabold w-6 text-center text-neutral-800">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="text-neutral-400 hover:text-neutral-900 px-2 text-xs font-bold bg-transparent border-none cursor-pointer">+</button>
                        </div>
                      </div>

                      {/* DESKTOP TOTAL */}
                      <div className="col-span-2 w-full flex md:flex-col items-center justify-between md:items-end md:justify-center gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-neutral-100 md:border-none">
                        <div className="flex items-center gap-1.5 md:absolute md:top-6 md:right-0">
                          <button onClick={() => removeItem(item.cartItemId)}
                            className="p-1 text-[#b2533e] hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer" aria-label="Remove item">
                            <Trash2 className="h-4.5 w-4.5 stroke-[1.8]" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block md:hidden">Total:</span>
                          <span className="text-sm font-extrabold text-neutral-950">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 bg-[#FAF8F5]/30 border border-neutral-200/80 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-extrabold tracking-[0.2em] mb-4 pb-2 border-b border-neutral-200/60 uppercase">ORDER SUMMARY</h2>

              {/* Free Shipping Progress Bar */}
              <div className="mb-6 p-4 bg-white border border-neutral-200/60">
                {subtotal >= 1999 ? (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-extrabold tracking-wider text-green-600 uppercase">You qualify for FREE shipping!</span>
                      <span className="text-[10px] font-black text-green-600">100%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 overflow-hidden">
                      <div className="h-full bg-green-600 w-full transition-all duration-500"></div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-extrabold tracking-wider text-neutral-500 uppercase">
                        Add <span className="text-neutral-900 font-black">₹{(1999 - subtotal).toFixed(2)}</span> more for FREE shipping
                      </span>
                      <span className="text-[10px] font-black text-neutral-850">{Math.round((subtotal / 1999) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 overflow-hidden">
                      <div className="h-full bg-black transition-all duration-500" style={{ width: `${(subtotal / 1999) * 100}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3.5 text-[10px] font-bold tracking-wider text-neutral-600 uppercase mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-neutral-950">₹{subtotal.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-extrabold">
                    <span>Promo Discount ({appliedPromo})</span>
                    <span>-₹{promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className={`font-extrabold ${deliveryFeeValue === 0 ? "text-green-600 tracking-widest font-black text-[9.5px]" : "text-neutral-950"}`}>
                    {deliveryFeeValue === 0 ? "FREE" : `₹${deliveryFeeValue.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-3.5 flex justify-between text-xs font-extrabold text-neutral-950">
                  <span>Total To Pay</span>
                  <span className="text-sm font-extrabold">₹{totalToPay.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="py-4 border-t border-neutral-200/60 mb-6">
                <label className="text-[9px] font-extrabold tracking-widest text-neutral-400 uppercase block mb-2">PROMO CODE</label>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-neutral-100 border border-neutral-200 px-3 py-2 text-[9px] font-extrabold text-neutral-800 uppercase tracking-widest">
                    <span>Applied: {appliedPromo} (-₹{promoDiscount}.00)</span>
                    <button onClick={removePromo}
                      className="text-[#b2533e] hover:opacity-75 font-extrabold underline bg-transparent border-none cursor-pointer">REMOVE</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" placeholder="ENTER CODE (TRY DRIP20)"
                      value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-white border border-neutral-300 px-3 py-2 text-[10px] tracking-wider placeholder-neutral-400 focus:outline-none focus:border-neutral-900 uppercase font-bold" />
                    <button onClick={applyPromo}
                      className="bg-black hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase transition-all duration-300 cursor-pointer border border-black">
                      APPLY
                    </button>
                  </div>
                )}
                {promoError && <p className="text-[#ba1a1a] text-[9px] mt-1.5 font-bold uppercase tracking-wider">{promoError}</p>}
                {!appliedPromo && !promoError && (
                  <p className="text-[7px] text-neutral-400 font-medium mt-1.5 tracking-wide">Try <strong>DRIP20</strong> for 20% off or <strong>FREE50</strong> for ₹50 off.</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <CheckoutButton cartItems={cartItems} />
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-200/40 text-center text-[7.5px] font-bold text-neutral-400 tracking-wider uppercase">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 stroke-[1.8] text-neutral-500" />
                  <span>SECURE PAYMENTS</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="h-3.5 w-3.5 stroke-[1.8] text-neutral-500" />
                  <span>EASY EXCHANGES</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="h-3.5 w-3.5 stroke-[1.8] text-neutral-500" />
                  <span>EXPRESS DELIVERY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <section className="mt-24 pt-16 border-t border-neutral-200">
          <div className="flex justify-between items-baseline mb-10">
            <h2 className="text-xl font-bold tracking-[0.1em] uppercase font-sans">YOU MAY ALSO LIKE</h2>
            <Link to="/shop"
              className="text-[10px] font-bold tracking-[0.2em] border-b border-neutral-900 pb-0.5 hover:opacity-75 transition-opacity uppercase">
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendedProducts.slice(0, 4).map((prod) => (
              <RecommendedCard key={prod.id} product={prod} onAddToBag={addRecommendedToCart} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function RecommendedCard({ product, onAddToBag }: { product: any; onAddToBag: (p: any) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!isHovered) { setActiveIdx(0); return; }
    const timer = setInterval(() => setActiveIdx((prev) => (prev + 1) % product.images.length), 1500);
    return () => clearInterval(timer);
  }, [isHovered, product.images.length]);

  return (
    <div className="group flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Link to={`/product/${product.id}`} className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4 block">
        {product.images.map((imgSrc: string, idx: number) => (
          <img key={idx} src={imgSrc} alt={`${product.name} - View ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[750ms] ${idx === activeIdx ? "opacity-100 scale-105" : "opacity-0 scale-100"}`} />
        ))}
        {isHovered && product.images.length > 1 && (
          <div className="absolute top-3 inset-x-4 flex gap-1.5 z-10 transition-all duration-300">
            {product.images.map((_: any, idx: number) => (
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
        {product.badge && (
          <span className="absolute bottom-4 left-4 bg-white text-[#030213] text-[9px] font-extrabold tracking-[0.15em] px-3 py-1.5 z-10 uppercase">{product.badge}</span>
        )}
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToBag(product); }}
          className="absolute inset-x-4 bottom-4 bg-black/95 text-white hover:bg-neutral-900 py-3 text-[9px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 border-none cursor-pointer z-10 shadow-lg">
          ADD TO BAG
        </button>
      </Link>
      <Link to={`/product/${product.id}`} className="no-underline">
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase">{product.brand}</span>
          <h3 className="text-xs font-extrabold text-[#030213] uppercase leading-tight line-clamp-1">{product.name}</h3>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-sm font-extrabold text-neutral-900">₹{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xs font-semibold text-neutral-450 line-through">₹{product.originalPrice.toFixed(2)}</span>
                <span className="text-[8px] font-extrabold text-[#b2533e] uppercase tracking-wider bg-red-50 px-1.5 py-0.5">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
