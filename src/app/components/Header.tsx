import { ShoppingCart, CircleUser, Search, Heart, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
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

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      brand: "Velocitee™ 26",
      name: "Velocitee™ 26 – Airdry® – Ultra-Light Ventilated Running Tee - Polyamide With Efast",
      size: "XS",
      color: "Lime",
      price: 599,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=200",
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const updateQuantity = (id: number, delta: number) => {
    setIsLoading(true);
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
    setTimeout(() => setIsLoading(false), 300);
  };

  const removeItem = (id: number) => {
    setIsLoading(true);
    setCartItems(prev => prev.filter(item => item.id !== id));
    setTimeout(() => setIsLoading(false), 300);
  };

  const quickShop = (rec: { id: number; name: string; price: number; image: string }) => {
    setIsLoading(true);
    setCartItems(prev => {
      const existing = prev.find(item => item.id === rec.id);
      if (existing) {
        return prev.map(item => item.id === rec.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [
        ...prev,
        {
          id: rec.id,
          brand: "DRIP RECOMMENDED",
          name: rec.name,
          size: "S",
          color: "Default",
          price: rec.price,
          quantity: 1,
          image: rec.image
        }
      ];
    });
    setTimeout(() => setIsLoading(false), 300);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const FREE_DELIVERY_THRESHOLD = 1999;
  const DELIVERY_FEE = 99;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const amountToFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;
  const deliveryFeeValue = isFreeDelivery || totalItemCount === 0 ? 0 : DELIVERY_FEE;
  const totalToPay = subtotal + deliveryFeeValue;

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
                <SheetHeader className="pb-2 border-b border-neutral-200/60">
                  <SheetTitle className="text-sm font-extrabold tracking-[0.2em] uppercase text-neutral-800">
                    My Cart
                  </SheetTitle>
                </SheetHeader>

                {/* Selected Item Count & Loader */}
                <div className="flex justify-between items-center mt-2.5 mb-1.5">
                  <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
                    {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"} Selected
                  </span>
                  {isLoading && (
                    <span className="text-[9px] font-bold text-[#b2533e] tracking-widest uppercase animate-pulse">
                      Loading...
                    </span>
                  )}
                </div>

                {/* Free Delivery Promo Bar */}
                {totalItemCount > 0 && (
                  <div className="mb-2">
                    {isFreeDelivery ? (
                      <div className="bg-green-50 border border-green-200 text-center py-1.5 px-3 text-[9px] font-extrabold tracking-wider text-green-700 uppercase rounded-sm">
                        🎉 You have unlocked free delivery!
                      </div>
                    ) : (
                      <div className="bg-[#b2533e]/5 border border-[#b2533e]/15 text-center py-1.5 px-3 text-[8px] font-extrabold tracking-wider text-[#b2533e] uppercase rounded-sm">
                        SHOP FOR ₹{amountToFreeDelivery} MORE TO UNLOCK FREE DELIVERY
                      </div>
                    )}
                  </div>
                )}
                
                {/* Items List */}
                <div className="space-y-2.5 py-1">
                  {cartItems.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                      <ShoppingCart className="h-10 w-10 text-neutral-300 mb-3 stroke-[1.5]" />
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Your cart is empty</p>
                      <SheetClose asChild>
                        <Link to="/shop" className="mt-4 border border-neutral-900 text-neutral-950 bg-white hover:bg-neutral-900 hover:text-white text-[9px] font-bold tracking-widest px-6 py-2.5 rounded-sm uppercase transition-colors">
                          Shop Collections
                        </Link>
                      </SheetClose>
                    </div>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="flex gap-3 bg-white border border-neutral-100 p-2.5 rounded-md shadow-xs relative">
                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded bg-neutral-100 flex-shrink-0" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[8px] font-bold tracking-widest text-[#b2533e] uppercase">{item.brand}</span>
                            <h4 className="text-xs font-bold text-neutral-900 tracking-tight leading-snug mt-0.5 pr-6">{item.name}</h4>
                            <p className="text-[9px] text-neutral-400 mt-0.5">{item.size} - {item.color}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2.5">
                            <span className="text-xs font-extrabold text-neutral-900">₹{item.price}</span>
                            <div className="flex items-center border border-neutral-200 rounded-full px-2 py-0.5 bg-neutral-50">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)} 
                                className="text-neutral-400 hover:text-neutral-900 px-1 text-xs"
                                aria-label={`Decrease quantity for ${item.name}`}
                              >
                                -
                              </button>
                              <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)} 
                                className="text-neutral-400 hover:text-neutral-900 px-1 text-xs"
                                aria-label={`Increase quantity for ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="absolute top-2.5 right-2 text-neutral-300 hover:text-red-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5 stroke-[1.8]" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Bill Details */}
                {totalItemCount > 0 && (
                  <div className="pt-3 border-t border-neutral-200/60 space-y-2 mt-4">
                    <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase mb-0.5">
                      Bill Details
                    </h3>
                    <div className="space-y-1.5 text-[11px] font-medium tracking-wide">
                      <div className="flex justify-between text-neutral-500">
                        <span>Item Total</span>
                        <span className="font-bold text-neutral-900">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Delivery Fee (Free on orders above ₹1999)</span>
                        <span className={`font-bold ${deliveryFeeValue === 0 ? "text-green-600 tracking-wider" : "text-neutral-900"}`}>
                          {deliveryFeeValue === 0 ? "FREE" : `₹${deliveryFeeValue}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-extrabold text-neutral-900 border-t border-neutral-200/40 pt-1.5">
                        <span>To Pay</span>
                        <span>₹{totalToPay}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-1.5">
                      <SheetClose asChild>
                        <Link to="/cart" className="w-full border border-neutral-900 text-neutral-950 bg-white hover:bg-neutral-900 hover:text-white py-2 rounded-sm text-[9px] font-extrabold tracking-widest text-center uppercase transition-colors">
                          View Cart
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/checkout" className="w-full bg-[#030213] text-white py-2 rounded-sm text-[9px] font-extrabold tracking-widest text-center uppercase hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-950/5">
                          Checkout
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="border-t border-neutral-200/60 pt-3 mt-4">
                  <h3 className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase mb-2.5">
                    You May Also Like
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Recommendation 1 */}
                    <div className="bg-white border border-neutral-100 p-2 rounded-md flex flex-col justify-between">
                      <div>
                        <img 
                          src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=200" 
                          alt="Flare Fit Mid Rise Printed Skirt" 
                          className="w-full h-16 object-cover rounded bg-neutral-50 mb-1.5"
                        />
                        <h4 className="text-[9px] font-bold text-neutral-800 line-clamp-1">Flare Fit Mid Rise Printed Skirt</h4>
                        <span className="text-[10px] font-extrabold text-neutral-900 mt-0.5 block">₹699</span>
                      </div>
                      <button 
                        onClick={() => quickShop({ id: 101, name: "Flare Fit Mid Rise Printed Skirt", price: 699, image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=200" })}
                        className="mt-2 w-full bg-neutral-900 hover:bg-[#b2533e] text-white text-[8px] font-bold py-1 rounded-sm uppercase tracking-wider transition-colors"
                      >
                        QUICK SHOP
                      </button>
                    </div>

                    {/* Recommendation 2 */}
                    <div className="bg-white border border-neutral-100 p-2 rounded-md flex flex-col justify-between">
                      <div>
                        <img 
                          src="https://images.unsplash.com/photo-1519242220831-09410926fbff?auto=format&fit=crop&q=80&w=200" 
                          alt="Girls Regular Fit Jacquard Sweat Tee" 
                          className="w-full h-16 object-cover rounded bg-neutral-50 mb-1.5"
                        />
                        <h4 className="text-[9px] font-bold text-neutral-800 line-clamp-1">Girls Regular Fit Jacquard Sweat Tee</h4>
                        <span className="text-[10px] font-extrabold text-neutral-900 mt-0.5 block">₹199</span>
                      </div>
                      <button 
                        onClick={() => quickShop({ id: 102, name: "Girls Regular Fit Jacquard Sweat Tee", price: 199, image: "https://images.unsplash.com/photo-1519242220831-09410926fbff?auto=format&fit=crop&q=80&w=200" })}
                        className="mt-2 w-full bg-neutral-900 hover:bg-[#b2533e] text-white text-[8px] font-bold py-1 rounded-sm uppercase tracking-wider transition-colors"
                      >
                        QUICK SHOP
                      </button>
                    </div>
                  </div>
                </div>
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
