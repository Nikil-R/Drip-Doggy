import { ShoppingCart, CircleUser, Search, Heart, Trash2, ShieldCheck, RefreshCw, Truck, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import logo from "../../imports/logo.png";
import logoIcon from "../../imports/logo_icon.png";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "./ui/sheet";
import { SearchOverlay } from "./SearchOverlay";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navSearchVal, setNavSearchVal] = useState("");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "DRIP20") {
      setAppliedPromo("DRIP20");
      setPromoDiscount(Math.round(subtotal * 0.2));
      setPromoError(null);
    } else if (promoCode.trim().toUpperCase() === "FREE50") {
      setAppliedPromo("FREE50");
      setPromoDiscount(50);
      setPromoError(null);
    } else {
      setPromoError("Invalid code. Try 'DRIP20'.");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoCode("");
    setPromoError(null);
  };

  const updateItemSize = (cartItemId: string, newSize: string) => {
    setIsLoading(true);
    const itemToChange = cartItems.find(item => item.cartItemId === cartItemId);
    if (!itemToChange) {
      setIsLoading(false);
      return;
    }
    
    // Calculate new cartItemId
    const newCartItemId = `${itemToChange.id}-${itemToChange.color}-${newSize}`;
    
    // Check if newCartItemId already exists
    const duplicateIndex = cartItems.findIndex(item => item.cartItemId === newCartItemId);
    let updated;
    if (duplicateIndex > -1 && cartItems[duplicateIndex].cartItemId !== cartItemId) {
      // Merge
      updated = cartItems.map((item, idx) => {
        if (idx === duplicateIndex) {
          return { ...item, quantity: item.quantity + itemToChange.quantity };
        }
        return item;
      }).filter(item => item.cartItemId !== cartItemId);
    } else {
      // Just change size
      updated = cartItems.map(item => {
        if (item.cartItemId === cartItemId) {
          return { ...item, size: newSize, cartItemId: newCartItemId };
        }
        return item;
      });
    }
    
    setCartItems(updated);
    saveCart(updated);
    setTimeout(() => setIsLoading(false), 300);
  };

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

  const saveCart = (items: any[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setIsLoading(true);
    const updated = cartItems.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    saveCart(updated);
    setTimeout(() => setIsLoading(false), 300);
  };

  const removeItem = (cartItemId: string) => {
    setIsLoading(true);
    const updated = cartItems.filter(item => item.cartItemId !== cartItemId);
    setCartItems(updated);
    saveCart(updated);
    setTimeout(() => setIsLoading(false), 300);
  };

  const quickShop = (rec: { id: number; name: string; price: number; image: string }) => {
    setIsLoading(true);
    let updated;
    const size = "S";
    const color = "Default";
    const cartItemId = `${rec.id}-${color}-${size}`;
    const existing = cartItems.find(item => item.cartItemId === cartItemId);
    if (existing) {
      updated = cartItems.map(item => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      updated = [
        ...cartItems,
        {
          id: rec.id,
          cartItemId,
          brand: "DRIP RECOMMENDED",
          name: rec.name,
          size,
          color,
          price: rec.price,
          quantity: 1,
          image: rec.image
        }
      ];
    }
    setCartItems(updated);
    saveCart(updated);
    setTimeout(() => setIsLoading(false), 300);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const FREE_DELIVERY_THRESHOLD = 1999;
  const DELIVERY_FEE = 99;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const amountToFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;
  const deliveryFeeValue = isFreeDelivery || totalItemCount === 0 ? 0 : DELIVERY_FEE;
  const totalToPay = Math.max(0, subtotal + deliveryFeeValue - promoDiscount);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearchVal.trim())}`);
      setNavSearchVal("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-[#FAF8F5]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo (Left) */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoIcon} alt="" className="h-18 w-auto object-contain mix-blend-multiply" />
              <img src={logo} alt="DRIP DOGGY" className="h-30 w-auto object-contain mix-blend-multiply" />
            </Link>
          </div>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-500">
            {/* Categories Hover Dropdown */}
            <div className="relative group py-5 cursor-pointer text-neutral-500 hover:text-neutral-500">
              <span className="hover:text-black transition-colors flex items-center gap-1.5">
                Categories
                <svg className="w-2.5 h-2.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              
              <div className="absolute left-0 top-full pt-1 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 ease-in-out">
                <div className="bg-[#FAF8F5] border border-neutral-200/60 shadow-lg py-2 rounded-sm">
                  
                  {/* Women Dropdown */}
                  <div className="relative group/sub px-5 py-2 hover:bg-neutral-100/60 flex items-center justify-between">
                    <Link to="/shop?gender=women" className="hover:text-black transition-colors w-full flex items-center justify-between">
                      <span>Women</span>
                      <svg className="w-2 h-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    
                    <div className="absolute left-full top-0 pl-1 w-48 opacity-0 pointer-events-none group-hover/sub:opacity-100 group-hover/sub:pointer-events-auto transition-all duration-200 ease-in-out">
                      <div className="bg-[#FAF8F5] border border-neutral-200/60 shadow-lg py-2 rounded-sm text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-500">
                        <Link to="/shop?gender=women" className="block px-5 py-2 hover:text-black hover:bg-neutral-100/60 transition-colors">
                          All Women's
                        </Link>
                        <Link to="/shop?gender=women&category=dresses" className="block px-5 py-2 hover:text-black hover:bg-neutral-100/60 transition-colors">
                          Dresses
                        </Link>
                        <Link to="/shop?gender=women&category=outerwear" className="block px-5 py-2 hover:text-black hover:bg-neutral-100/60 transition-colors">
                          Outerwear
                        </Link>
                        <Link to="/shop?gender=women&category=tops" className="block px-5 py-2 hover:text-black hover:bg-neutral-100/60 transition-colors">
                          Tops
                        </Link>
                        <Link to="/shop?gender=women&category=skirts" className="block px-5 py-2 hover:text-black hover:bg-neutral-100/60 transition-colors">
                          Skirts
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Men */}
                  <div className="px-5 py-2 hover:bg-neutral-100/60">
                    <Link to="/coming-soon" className="block hover:text-black transition-colors">
                      Men
                    </Link>
                  </div>

                  {/* Accessories */}
                  <div className="px-5 py-2 hover:bg-neutral-100/60">
                    <Link to="/coming-soon" className="block hover:text-black transition-colors">
                      Accessories
                    </Link>
                  </div>

                </div>
              </div>
            </div>

            <Link to="/about" className="hover:text-black transition-colors">About</Link>
            <Link to="/help" className="hover:text-black transition-colors">Help</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:opacity-75 transition-opacity bg-transparent border-none p-0 cursor-pointer outline-none flex items-center"
              aria-label="Open Search"
            >
              <Search className="h-4.5 w-4.5 stroke-[1.8] text-neutral-800" />
            </button>

            <Link to="/wishlist" className="hidden sm:block hover:opacity-75 transition-opacity" aria-label="Wishlist">
              <Heart className="h-4.5 w-4.5 stroke-[1.8] text-neutral-800" />
            </Link>
            
            <Link to="/account" className="hidden sm:block hover:opacity-75 transition-opacity" aria-label="Profile">
              <CircleUser className="h-4.5 w-4.5 stroke-[1.8] text-neutral-800" />
            </Link>
            
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative hover:opacity-75 transition-opacity flex items-center bg-transparent border-none p-0 cursor-pointer outline-none">
                  <ShoppingCart className="h-4.5 w-4.5 stroke-[1.8] text-neutral-800" />
                  {totalItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#b2533e] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      {totalItemCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-[#FAF8F5] p-4 flex flex-col h-full border-l border-neutral-200/60 shadow-xl overflow-y-auto">
                <SheetHeader className="p-0 pb-3 border-b border-neutral-200/60 flex flex-row items-center justify-between pr-8">
                  <SheetTitle className="text-sm font-extrabold tracking-[0.2em] uppercase text-neutral-800 leading-none">
                    My Cart
                  </SheetTitle>
                  {isLoading && (
                    <span className="text-[9px] font-bold text-[#b2533e] tracking-widest uppercase animate-pulse">
                      Updating...
                    </span>
                  )}
                </SheetHeader>

                {/* Items List */}
                <div className="space-y-3 py-3 flex-1">
                  {cartItems.length === 0 ? (
                    <div className="py-6 flex flex-col justify-center">
                      <div className="flex flex-col items-center justify-center text-center pb-4">
                        <ShoppingCart className="h-10 w-10 text-neutral-300 mb-2.5 stroke-[1.5]" />
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Your cart is empty</p>
                      </div>
                      
                      <div className="border-t border-neutral-200/50 pt-4 mt-2">
                        <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase mb-3 text-center">
                          Complete The Look
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {/* Recommended Extra 1 */}
                          <div className="bg-white border border-neutral-200/50 p-2.5 rounded-lg flex flex-col justify-between shadow-xs">
                            <div>
                              <img 
                                src="https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=200" 
                                alt="Apex Shell Jacket" 
                                className="w-full h-24 object-cover rounded bg-neutral-50 mb-2"
                              />
                              <h4 className="text-[10px] font-extrabold text-neutral-800 line-clamp-1 uppercase tracking-tight">Apex Shell Jacket</h4>
                              <span className="text-[10px] font-extrabold text-neutral-500 mt-0.5 block">₹320.00</span>
                            </div>
                            <button 
                              onClick={() => quickShop({ id: 10, name: "Apex Shell Jacket", price: 320, image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=200" })}
                              className="mt-2.5 w-full bg-neutral-900 hover:bg-neutral-800 text-white text-[8px] font-extrabold py-1.5 rounded-sm uppercase tracking-wider transition-colors border-none cursor-pointer"
                            >
                              Add to bag
                            </button>
                          </div>

                          {/* Recommended Extra 2 */}
                          <div className="bg-white border border-neutral-200/50 p-2.5 rounded-lg flex flex-col justify-between shadow-xs">
                            <div>
                              <img 
                                src="https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=200" 
                                alt="Modular Sling Bag" 
                                className="w-full h-24 object-cover rounded bg-neutral-50 mb-2"
                              />
                              <h4 className="text-[10px] font-extrabold text-neutral-800 line-clamp-1 uppercase tracking-tight">Modular Sling Bag</h4>
                              <span className="text-[10px] font-extrabold text-neutral-500 mt-0.5 block">₹210.00</span>
                            </div>
                            <button 
                              onClick={() => quickShop({ id: 11, name: "Modular Sling Bag", price: 210, image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=200" })}
                              className="mt-2.5 w-full bg-neutral-900 hover:bg-neutral-800 text-white text-[8px] font-extrabold py-1.5 rounded-sm uppercase tracking-wider transition-colors border-none cursor-pointer"
                            >
                              Add to bag
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.cartItemId} className="flex gap-4 bg-white border border-neutral-200/50 p-4 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative">
                        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded bg-neutral-100 flex-shrink-0" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase">{item.brand}</span>
                            <h4 className="text-[13px] font-extrabold text-neutral-900 tracking-tight leading-snug mt-1 pr-6 line-clamp-2">{item.name}</h4>
                            
                            <div className="flex flex-col gap-1 mt-1">
                              <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">
                                Color: {item.color}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Size:</span>
                                <select 
                                  value={item.size}
                                  onChange={(e) => updateItemSize(item.cartItemId, e.target.value)}
                                  className="text-[10px] font-extrabold uppercase bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-none rounded-sm px-1.5 py-0.5 outline-none cursor-pointer focus:ring-1 focus:ring-neutral-400"
                                >
                                  {["XS", "S", "M", "L", "XL", "XXL"].map(sz => (
                                    <option key={sz} value={sz}>{sz}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-extrabold text-neutral-900">₹{item.price}</span>
                              {item.id === 3 && (
                                <>
                                  <span className="text-[11px] font-semibold text-neutral-450 line-through">₹999.00</span>
                                  <span className="text-[8px] font-extrabold text-[#b2533e] bg-red-50 px-1 py-0.5 rounded-sm">51% OFF</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center border border-neutral-300 rounded-full px-2.5 py-1 bg-neutral-50 shadow-xs">
                              <button 
                                onClick={() => updateQuantity(item.cartItemId, -1)} 
                                className="text-neutral-400 hover:text-neutral-900 px-1.5 text-xs font-bold bg-transparent border-none cursor-pointer"
                                aria-label={`Decrease quantity for ${item.name}`}
                              >
                                -
                              </button>
                              <span className="text-[11px] font-extrabold w-4 text-center text-neutral-800">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.cartItemId, 1)} 
                                className="text-neutral-400 hover:text-neutral-900 px-1.5 text-xs font-bold bg-transparent border-none cursor-pointer"
                                aria-label={`Increase quantity for ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.cartItemId)} className="absolute top-4 right-4 text-neutral-300 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
                          <Trash2 className="h-4 w-4 stroke-[1.8]" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Promo Code Accordion */}
                {totalItemCount > 0 && (
                  <div className="border-t border-neutral-200/50 pt-3 mt-1 bg-white p-3 rounded-lg border border-neutral-200/30">
                    <button 
                      onClick={() => setIsPromoOpen(!isPromoOpen)}
                      className="w-full flex items-center justify-between text-[9px] font-extrabold tracking-widest text-neutral-400 uppercase hover:text-neutral-900 transition-colors bg-transparent border-none cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 stroke-[1.8] text-neutral-500" />
                        Apply Promo Code
                      </span>
                      {isPromoOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                    {isPromoOpen && (
                      <div className="pt-2.5 space-y-2">
                        {appliedPromo ? (
                          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-2.5 py-1.5 text-[9px] font-extrabold text-green-700 uppercase tracking-wider">
                            <span>Applied: {appliedPromo} (-₹{promoDiscount})</span>
                            <button 
                              onClick={removePromo} 
                              className="text-red-500 hover:text-red-700 font-extrabold underline text-[9px] bg-transparent border-none cursor-pointer"
                            >
                              REMOVE
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="TRY 'DRIP20'" 
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              className="flex-1 px-3 py-1.5 text-[11px] font-bold uppercase border border-neutral-300 rounded focus:outline-none placeholder-neutral-400 text-neutral-850 bg-white"
                            />
                            <button 
                              onClick={applyPromo}
                              className="bg-black hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-1.5 rounded-sm uppercase border-none cursor-pointer"
                            >
                              APPLY
                            </button>
                          </div>
                        )}
                        {promoError && (
                          <p className="text-[9px] font-extrabold text-red-500 uppercase tracking-wider">{promoError}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
 
                {/* Bill Details */}
                {totalItemCount > 0 && (
                  <div className="pt-3 border-t border-neutral-200/60 space-y-2.5 mt-2 bg-white border border-neutral-200/50 p-4 rounded-lg">
                    <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase mb-0.5">
                      Bill Summary
                    </h3>
                    <div className="space-y-1.5 text-[11px] font-medium tracking-wide">
                      <div className="flex justify-between text-neutral-500">
                        <span>Subtotal</span>
                        <span className="font-extrabold text-neutral-900">₹{subtotal}.00</span>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-green-600 font-bold">
                          <span>Promo Discount ({appliedPromo})</span>
                          <span>-₹{promoDiscount}.00</span>
                        </div>
                      )}
                      <div className="flex justify-between text-neutral-500">
                        <span>Delivery Fee (Free on orders above ₹1999)</span>
                        <span className={`font-extrabold ${deliveryFeeValue === 0 ? "text-green-600 tracking-wider" : "text-neutral-900"}`}>
                          {deliveryFeeValue === 0 ? "FREE" : `₹${deliveryFeeValue}.00`}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-extrabold text-neutral-900 border-t border-neutral-200/40 pt-2">
                        <span>Total To Pay</span>
                        <span className="text-sm">₹{totalToPay}.00</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <SheetClose asChild>
                        <Link to="/cart" className="w-full border border-neutral-900 text-neutral-950 bg-white hover:bg-neutral-900 hover:text-white py-2.5 rounded-sm text-[9px] font-extrabold tracking-widest text-center uppercase transition-colors">
                          View Cart
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/checkout" className="w-full bg-[#030213] text-white py-2.5 rounded-sm text-[9px] font-extrabold tracking-widest text-center uppercase hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-950/5">
                          Checkout
                        </Link>
                      </SheetClose>
                    </div>

                    {/* Trust Badges Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-100 text-center text-[7.5px] font-bold text-neutral-400 tracking-wider uppercase">
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
                )}

                {/* You May Also Like Suggestions (Rendered only if cart has items) */}
                {totalItemCount > 0 && (
                  <div className="border-t border-neutral-200/50 pt-3 mt-2">
                    <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase mb-2">
                      Complete the Look
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Rec 1 */}
                      <div className="bg-white border border-neutral-200/40 p-2 rounded-lg flex flex-col justify-between shadow-xs">
                        <div>
                          <img 
                            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=200" 
                            alt="Flare Skirt" 
                            className="w-full h-16 object-cover rounded bg-neutral-50 mb-1"
                          />
                          <h4 className="text-[9px] font-extrabold text-neutral-800 line-clamp-1 uppercase tracking-tight">Flare Printed Skirt</h4>
                          <span className="text-[9px] font-extrabold text-neutral-500 mt-0.5 block">₹699.00</span>
                        </div>
                        <button 
                          onClick={() => quickShop({ id: 101, name: "Flare Printed Skirt", price: 699, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=200" })}
                          className="mt-2 w-full bg-neutral-900 hover:bg-neutral-800 text-white text-[8px] font-extrabold py-1 rounded-sm uppercase tracking-wider transition-colors border-none cursor-pointer"
                        >
                          Add
                        </button>
                      </div>

                      {/* Rec 2 */}
                      <div className="bg-white border border-neutral-200/40 p-2 rounded-lg flex flex-col justify-between shadow-xs">
                        <div>
                          <img 
                            src="https://images.unsplash.com/photo-1519242220831-09410926fbff?auto=format&fit=crop&q=80&w=200" 
                            alt="Jacquard Sweat Tee" 
                            className="w-full h-16 object-cover rounded bg-neutral-50 mb-1"
                          />
                          <h4 className="text-[9px] font-extrabold text-neutral-800 line-clamp-1 uppercase tracking-tight">Jacquard Sweat Tee</h4>
                          <span className="text-[9px] font-extrabold text-neutral-500 mt-0.5 block">₹199.00</span>
                        </div>
                        <button 
                          onClick={() => quickShop({ id: 102, name: "Jacquard Sweat Tee", price: 199, image: "https://images.unsplash.com/photo-1519242220831-09410926fbff?auto=format&fit=crop&q=80&w=200" })}
                          className="mt-2 w-full bg-neutral-900 hover:bg-neutral-800 text-white text-[8px] font-extrabold py-1 rounded-sm uppercase tracking-wider transition-colors border-none cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-5 w-5 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <nav className="flex flex-col gap-4 text-xs font-bold tracking-widest uppercase text-neutral-800">
              <div className="flex flex-col gap-2 pl-3 border-l border-neutral-200">
                <span className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase mb-1">Categories</span>
                <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1 text-xs">
                  Women
                </Link>
                <Link to="/coming-soon" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1 text-xs">
                  Men
                </Link>
                <Link to="/coming-soon" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1 text-xs">
                  Accessories
                </Link>
              </div>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1">
                About
              </Link>
              <Link to="/help" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1">
                Help
              </Link>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1 border-t pt-4">
                Wishlist
              </Link>
              <Link to="/account" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1">
                Account Settings
              </Link>
            </nav>
          </div>
        )}
      </div>
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
