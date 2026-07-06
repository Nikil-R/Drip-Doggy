import { ShoppingCart, CircleUser, Search, Heart, Trash2, ShieldCheck, RefreshCw, Truck, Tag, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import logo from "../../../assets/logo.png";
import logoIcon from "../../../assets/new_logo_icon.png";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "../ui/sheet";
import { SearchOverlay } from "../search/SearchOverlay";
import { useAuth } from "../../context/AuthContext";
import { categoryApi, Category } from "../../lib/category-api";
import { cartApi } from "../../lib/cart-api";
import { syncCart } from "../../lib/cart-sync";
import { productApi } from "../../lib/product-api";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navSearchVal, setNavSearchVal] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const list = await categoryApi.fetchCategories();
        setCategories(list.filter(c => c.isActive !== false));
      } catch (err) {
        console.error("Error loading categories in header", err);
      }
    }
    loadCategories();
  }, []);

  const [navConfig, setNavConfig] = useState<any>(null);

  useEffect(() => {
    const loadNav = () => {
      try {
        const stored = localStorage.getItem("dd_content_navigation");
        if (stored) {
          setNavConfig(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener("dd-content-changed", loadNav);
    window.addEventListener("storage", loadNav);
    loadNav();

    return () => {
      window.removeEventListener("dd-content-changed", loadNav);
      window.removeEventListener("storage", loadNav);
    };
  }, []);

  const categoriesNode = navConfig?.desktopItems?.find(
    (item: any) => item.label.toLowerCase() === "categories"
  );
  const categoriesChildren = categoriesNode?.children || [];

  const dropdownItems = categoriesChildren.length > 0
    ? categoriesChildren
    : categories.map((cat) => {
        const isWomen = cat.categoryName.toLowerCase().includes("women");
        return {
          label: cat.categoryName,
          to: isWomen ? `/shop?category=${cat.categoryName.toLowerCase()}` : "/coming-soon",
          children: isWomen ? cat.subCategories?.map((sub) => ({
            label: sub.subcategoryName,
            to: `/shop?category=${cat.categoryName.toLowerCase()}&subcategory=${sub.subcategoryName.toLowerCase()}`
          })) : []
        };
      });

  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        const hasOldJunk = parsed.some((item: any) => 
          item.name === "Vanguard Tactical Vest" || 
          item.name === "Heavyweight Hoodie" || 
          item.name === "Apex Shell Jacket" || 
          item.name === "Modular Sling Bag" ||
          item.cartItemId.includes("coffee-brown") ||
          item.cartItemId.includes("clay-sand") ||
          item.cartItemId.includes("burnt-copper") ||
          item.cartItemId.includes("editorial-ivory")
        );
        if (parsed.length > 0 && !hasOldJunk) return parsed;
      }
      const defaultItems = [
        {
          id: 1,
          cartItemId: "1-Default-S",
          brand: "DRIP DOGGY COLLECTION",
          name: "SARTORIAL PLEATED TRENCH DRESS",
          size: "S",
          color: "Default",
          price: 245.00,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 2,
          cartItemId: "2-Default-S",
          brand: "CORE COLLECTION",
          name: "OVERSIZED KNIT SWEATER DRESS",
          size: "S",
          color: "Default",
          price: 185.00,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 3,
          cartItemId: "3-JET BLACK-M",
          brand: "ARCHITECTURAL PRECISION SERIES",
          name: "STRUCTURE TACTICAL LAYER",
          size: "M",
          color: "JET BLACK",
          price: 485.00,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 4,
          cartItemId: "4-Default-S",
          brand: "ARCHIVE COLLECTION",
          name: "STRUCTURED CANVAS UTILITY DRESS",
          size: "S",
          color: "Default",
          price: 295.00,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600"
        }
      ];
      localStorage.setItem("cart", JSON.stringify(defaultItems));
      return defaultItems;
    } catch {
      return [];
    }
  });

  const [wishlistCount, setWishlistCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      const list = stored ? JSON.parse(stored) : [];
      return list.length;
    } catch {
      return 0;
    }
  });


  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-menu-container")) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isProfileOpen]);

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

  const updateItemSize = async (cartItemId: string, newSize: string) => {
    setIsLoading(true);
    const itemToChange = cartItems.find(item => item.cartItemId === cartItemId);
    if (!itemToChange) {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("dripdoggy_auth_token");
    if (token && itemToChange.backendId) {
      try {
        const products = await productApi.fetchProducts();
        let newSizeId: number | null = null;
        products.forEach(p => {
          if (p.rawVariants) {
            p.rawVariants.forEach(v => {
              const colorName = (v.variantName || "Default").toLowerCase();
              if (colorName === itemToChange.color.toLowerCase() && v.sizes) {
                v.sizes.forEach((s: any) => {
                  if ((s.sizeName || "").toLowerCase() === newSize.toLowerCase()) {
                    newSizeId = s.id;
                  }
                });
              }
            });
          }
        });

        if (newSizeId) {
          await cartApi.removeFromCart(itemToChange.backendId);
          await cartApi.addToCart(newSizeId, itemToChange.quantity);
          await syncCart();
        } else {
          console.warn("Could not resolve backend sizeId for update:", newSize);
        }
      } catch (err) {
        console.error("Error updating size in DB:", err);
      }
    } else {
      const newCartItemId = `${itemToChange.id}-${itemToChange.color}-${newSize}`;
      const duplicateIndex = cartItems.findIndex(item => item.cartItemId === newCartItemId);
      let updated;
      if (duplicateIndex > -1 && cartItems[duplicateIndex].cartItemId !== cartItemId) {
        updated = cartItems.map((item, idx) => {
          if (idx === duplicateIndex) {
            return { ...item, quantity: item.quantity + itemToChange.quantity };
          }
          return item;
        }).filter(item => item.cartItemId !== cartItemId);
      } else {
        updated = cartItems.map(item => {
          if (item.cartItemId === cartItemId) {
            return { ...item, size: newSize, cartItemId: newCartItemId };
          }
          return item;
        });
      }
      setCartItems(updated);
      saveCart(updated);
    }
    setIsLoading(false);
  };

  const [productsList, setProductsList] = useState<any[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const list = await productApi.fetchProducts();
        setProductsList(list);
      } catch (err) {
        console.error("Error loading products in header:", err);
      }
    }
    loadProducts();
  }, []);

  const getAvailableSizesForItem = (item: any) => {
    const prod = productsList.find(p => p.id === item.id);
    if (!prod || !prod.rawVariants) return ["XS", "S", "M", "L", "XL", "XXL"]; // default fallback
    const variant = prod.rawVariants.find((v: any) => (v.variantName || "Default").toLowerCase() === item.color.toLowerCase());
    if (!variant || !variant.sizes) return ["XS", "S", "M", "L", "XL", "XXL"]; // default fallback
    return variant.sizes.map((s: any) => s.sizeName).filter(Boolean);
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

    const handleWishlistUpdate = () => {
      try {
        const stored = localStorage.getItem("wishlist");
        const list = stored ? JSON.parse(stored) : [];
        setWishlistCount(list.length);
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    window.addEventListener("storage", handleCartUpdate);
    window.addEventListener("storage", handleWishlistUpdate);
    
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("storage", handleWishlistUpdate);
    };
  }, []);


  const saveCart = (items: any[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQuantity = async (cartItemId: string, delta: number) => {
    setIsLoading(true);
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    if (!item) {
      setIsLoading(false);
      return;
    }
    const newQty = Math.max(1, item.quantity + delta);

    const token = localStorage.getItem("dripdoggy_auth_token");
    if (token && item.backendId) {
      try {
        await cartApi.updateQuantity(item.backendId, newQty);
        await syncCart();
      } catch (err) {
        console.error("Error updating quantity in DB:", err);
      }
    } else {
      const updated = cartItems.map(i => {
        if (i.cartItemId === cartItemId) {
          return { ...i, quantity: newQty };
        }
        return i;
      });
      setCartItems(updated);
      saveCart(updated);
    }
    setIsLoading(false);
  };

  const removeItem = async (cartItemId: string) => {
    setIsLoading(true);
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    const token = localStorage.getItem("dripdoggy_auth_token");
    if (token && item?.backendId) {
      try {
        await cartApi.removeFromCart(item.backendId);
        await syncCart();
      } catch (err) {
        console.error("Error removing item from DB:", err);
      }
    } else {
      const updated = cartItems.filter(i => i.cartItemId !== cartItemId);
      setCartItems(updated);
      saveCart(updated);
    }
    setIsLoading(false);
  };

  const quickShop = async (rec: { id: number; name: string; price: number; image: string }) => {
    setIsLoading(true);
    const size = "S";
    const color = "Default";
    const cartItemId = `${rec.id}-${color}-${size}`;
    const existing = cartItems.find(item => item.cartItemId === cartItemId);

    const token = localStorage.getItem("dripdoggy_auth_token");
    if (token) {
      try {
        if (existing && existing.backendId) {
          await cartApi.updateQuantity(existing.backendId, existing.quantity + 1);
        } else {
          const products = await productApi.fetchProducts();
          const targetProduct = products.find(p => p.id === rec.id);
          let sizeId: number | null = null;
          if (targetProduct && targetProduct.rawVariants) {
            const firstVar = targetProduct.rawVariants[0];
            if (firstVar && firstVar.sizes) {
              const matchingSize = firstVar.sizes.find((s: any) => (s.sizeName || "").toLowerCase() === size.toLowerCase()) || firstVar.sizes[0];
              if (matchingSize) sizeId = matchingSize.id;
            }
          }
          if (sizeId) {
            await cartApi.addToCart(sizeId, 1);
          } else {
            console.warn("Could not find matching sizeId for quickShop item");
          }
        }
        await syncCart();
      } catch (err) {
        console.error("Error in DB quickShop:", err);
      }
    } else {
      let updated;
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
    }
    setIsLoading(false);
  };  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
      <header className="sticky top-0 z-50 w-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
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
                <div className="bg-[#FAF8F5] border border-neutral-200/60 shadow-lg py-2 rounded-sm text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-500">
                  {dropdownItems.map((cat: any, catIdx: number) => (
                    <div key={catIdx} className="relative group/sub px-5 py-2 hover:bg-neutral-100/60 flex items-center justify-between">
                      <Link to={cat.to} className="hover:text-black transition-colors w-full flex items-center justify-between">
                        <span>{cat.label}</span>
                        {cat.children && cat.children.length > 0 && (
                          <svg className="w-2.5 h-2.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </Link>
                      
                      {cat.children && cat.children.length > 0 && (
                        <div className="absolute left-full top-0 pl-1 w-48 opacity-0 pointer-events-none group-hover/sub:opacity-100 group-hover/sub:pointer-events-auto transition-all duration-200 ease-in-out">
                          <div className="bg-[#FAF8F5] border border-neutral-200/60 shadow-lg py-2 rounded-sm text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-500">
                            {cat.children.map((sub: any, subIdx: number) => (
                              <Link 
                                key={subIdx} 
                                to={sub.to} 
                                className="block px-5 py-2 hover:text-black hover:bg-neutral-100/60 transition-colors"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {dropdownItems.length === 0 && (
                    <div className="px-5 py-2 text-neutral-400 text-[9px]">
                      No categories
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Link to="/about" className="hover:text-black transition-colors">About</Link>
            <Link to="/help" className="hover:text-black transition-colors">Help</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6 h-full">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:opacity-75 transition-opacity bg-transparent border-none p-0 cursor-pointer outline-none flex items-center"
              aria-label="Open Search"
            >
              <Search className="h-4.5 w-4.5 stroke-[1.8] text-neutral-800" />
            </button>

            {isAuthenticated && (
              <>
                <Link to="/wishlist" className="hidden sm:block hover:opacity-75 transition-opacity relative" aria-label="Wishlist">
              <Heart className="h-4.5 w-4.5 stroke-[1.8] text-neutral-800" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#b2533e] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
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
              <SheetContent className="w-full sm:max-w-md bg-[#FAF8F5] p-4 flex flex-col h-full border-l border-neutral-200/60 shadow-xl overflow-hidden">
                <SheetHeader className="p-0 pb-3 border-b border-neutral-200/60 flex flex-row items-center justify-between pr-8 flex-shrink-0">
                  <SheetTitle className="text-sm font-extrabold tracking-[0.2em] uppercase text-neutral-800 leading-none flex items-center gap-2">
                    My Cart
                    {totalItemCount > 0 && (
                      <span className="text-[9px] font-extrabold text-[#b2533e] tracking-widest uppercase">
                        // {totalItemCount} {totalItemCount === 1 ? 'ITEM' : 'ITEMS'} SELECTED
                      </span>
                    )}
                  </SheetTitle>
                  {isLoading && (
                    <span className="text-[9px] font-bold text-[#b2533e] tracking-widest uppercase animate-pulse">
                      Updating...
                    </span>
                  )}
                </SheetHeader>

                {/* Items List - Scrollable */}
                <div className="space-y-3 py-3 flex-1 overflow-y-auto pr-1">
                  {cartItems.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <ShoppingCart className="h-10 w-10 text-neutral-300 mb-2.5 stroke-[1.5]" />
                      <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Your cart is empty</p>
                    </div>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.cartItemId} className="flex gap-4 bg-white border border-neutral-200/50 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative">
                        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-neutral-100 flex-shrink-0" />
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
                                  className="text-[10px] font-extrabold uppercase bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-none px-1.5 py-0.5 outline-none cursor-pointer focus:ring-1 focus:ring-neutral-400"
                                  aria-label="Select size"
                                >
                                  {getAvailableSizesForItem(item).map(sz => (
                                    <option key={sz} value={sz}>{sz}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-extrabold text-neutral-900">₹{Math.floor(item.price)}</span>
                              {item.originalPrice && Math.floor(item.originalPrice) > Math.floor(item.price) && (
                                <>
                                  <span className="text-[11px] font-semibold text-neutral-450 line-through">₹{Math.floor(item.originalPrice)}</span>
                                  <span className="text-[8px] font-extrabold text-[#b2533e] bg-red-50 px-1 py-0.5 rounded-sm">
                                    {item.discountType === "value" || item.discountType === "flat"
                                      ? `₹${Math.floor(item.discountValue)} OFF`
                                      : `${Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF`}
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center border border-neutral-300 px-2.5 py-1 bg-neutral-50 shadow-xs">
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
                        <button onClick={() => removeItem(item.cartItemId)} className="absolute top-4 right-4 text-[#b2533e] hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer" aria-label="Remove item">
                          <Trash2 className="h-4 w-4 stroke-[1.8]" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Sticky Cart Footer Container */}
                {totalItemCount > 0 && (
                  <div className="border-t border-neutral-250 pt-2 mt-auto bg-[#FAF8F5] space-y-2 flex-shrink-0">
                    {/* Promo Code Selector */}
                    <div className="px-1">
                      <button 
                        onClick={() => setIsPromoOpen(!isPromoOpen)}
                        className="w-full flex items-center justify-between text-[9px] font-extrabold tracking-[0.15em] text-neutral-800 uppercase hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer py-0.5"
                      >
                        <span className="flex items-center gap-1.5">
                          <Tag className="h-3 w-3 stroke-[1.8] text-neutral-800" />
                          Apply Promo Code
                        </span>
                        {isPromoOpen ? <ChevronUp className="h-3 w-3 text-neutral-600" /> : <ChevronDown className="h-3 w-3 text-neutral-600" />}
                      </button>
                      {isPromoOpen && (
                        <div className="pt-1.5">
                          {appliedPromo ? (
                            <div className="flex items-center justify-between bg-neutral-100 border border-neutral-200 px-2 py-1 text-[8.5px] font-extrabold text-neutral-800 uppercase tracking-widest rounded-none">
                              <span>PROMO: {appliedPromo} (-₹{promoDiscount})</span>
                              <button 
                                onClick={removePromo} 
                                className="text-[#b2533e] hover:opacity-75 font-extrabold underline text-[8.5px] bg-transparent border-none cursor-pointer"
                              >
                                REMOVE
                              </button>
                            </div>
                          ) : (
                            <div className="flex border-b border-neutral-300 focus-within:border-neutral-900 transition-colors py-0.5">
                              <input 
                                type="text" 
                                placeholder="ENTER PROMO CODE" 
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="flex-1 bg-transparent text-[10px] font-bold tracking-wider placeholder-neutral-400 focus:outline-none uppercase border-none py-0.5"
                              />
                              <button 
                                onClick={applyPromo}
                                className="text-[9px] font-extrabold tracking-widest text-neutral-900 hover:opacity-75 uppercase transition-colors px-1 bg-transparent border-none cursor-pointer"
                              >
                                APPLY
                              </button>
                            </div>
                          )}
                          {promoError && (
                            <p className="text-[8px] font-extrabold text-[#ba1a1a] uppercase tracking-wider mt-0.5">{promoError}</p>
                          )}
                        </div>
                      )}
                    </div>
 
                    {/* Bill Details */}
                    <div className="border-t border-neutral-200/60 pt-2 px-1 space-y-2">
                      <div className="space-y-1 text-[9px] font-bold tracking-wider text-neutral-600 uppercase">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-extrabold text-neutral-900">₹{Math.floor(subtotal)}</span>
                        </div>
                        {promoDiscount > 0 && (
                          <div className="flex justify-between text-green-600 font-extrabold">
                            <span>Promo Discount ({appliedPromo})</span>
                            <span>-₹{Math.floor(promoDiscount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Delivery</span>
                          <span className={`font-extrabold ${deliveryFeeValue === 0 ? "text-green-600" : "text-neutral-900"}`}>
                            {deliveryFeeValue === 0 ? "FREE" : `₹${Math.floor(deliveryFeeValue)}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] font-extrabold text-neutral-950 border-t border-neutral-200 pt-1.5">
                          <span>Total to Pay</span>
                          <span className="text-xs">₹{Math.floor(totalToPay)}.00</span>
                        </div>
                      </div>
                      
                      {/* Actions side-by-side */}
                      <div className="grid grid-cols-2 gap-2 pt-1 pb-1">
                        <SheetClose asChild>
                          <button
                            onClick={() => {
                              if (isAuthenticated) {
                                navigate('/checkout');
                              } else {
                                navigate('/login', { state: { from: { pathname: '/checkout' } } });
                              }
                            }}
                            className="flex items-center justify-center w-full bg-black hover:bg-neutral-800 text-white py-2.5 rounded-none text-[9px] font-extrabold tracking-[0.15em] text-center uppercase transition-all duration-300 cursor-pointer border border-black"
                          >
                            CHECKOUT
                          </button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/cart" className="flex items-center justify-center w-full border border-neutral-900 text-neutral-950 bg-white hover:bg-neutral-900 hover:text-white py-2.5 rounded-none text-[9px] font-extrabold tracking-[0.15em] text-center uppercase transition-all duration-300 cursor-pointer">
                            VIEW CART
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </>
        )}

            {isAuthenticated ? (
              <div 
                className="relative hidden sm:block h-full flex items-center px-3 cursor-pointer profile-menu-container"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div 
                  className="hover:opacity-75 transition-opacity flex items-center h-full" 
                  aria-label="Profile"
                >
                  <CircleUser className="h-4.5 w-4.5 stroke-[1.8] text-neutral-800" />
                </div>
                <div className={`absolute right-0 top-full pt-[10px] w-60 transition-all duration-300 ease-in-out z-50 ${
                  isProfileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`} onClick={(e) => e.stopPropagation()}>
                  <div className="bg-[#FAF8F5] border border-neutral-250/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-3 rounded-none text-left flex flex-col text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-800">
                    {user && (
                      <>
                        {/* User Details Header */}
                        <Link 
                          to="/account"
                          onClick={() => setIsProfileOpen(false)}
                          title="User Profile"
                          className="px-5 py-4 border-b border-neutral-200/80 flex flex-col bg-neutral-100/30 hover:bg-neutral-100/50 transition-colors"
                        >
                          <span className="text-[13px] font-black tracking-[0.1em] text-neutral-900 uppercase">{user.firstName} {user.lastName}</span>
                          <span className="text-[10px] font-bold tracking-normal text-neutral-500 lowercase mt-1.5">{user.email}</span>
                        </Link>
                        
                        {/* Navigation Links */}
                        <Link 
                          to="/account#orders" 
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-5 py-3 hover:text-black hover:bg-neutral-150/60 transition-colors mt-2"
                        >
                          My Orders
                        </Link>
                        <Link 
                          to="/account#addresses" 
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-5 py-3 hover:text-black hover:bg-neutral-155/60 transition-colors"
                        >
                          Address
                        </Link>
                        <Link 
                          to="/account#wishlist" 
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-5 py-3 hover:text-black hover:bg-neutral-155/60 transition-colors"
                        >
                          Wishlist
                        </Link>
                        <button 
                          onClick={() => { logout(); setIsProfileOpen(false); navigate('/login'); }}
                          className="w-full flex items-center gap-2 text-left px-5 py-3 text-red-600 hover:text-red-700 hover:bg-red-50/40 transition-colors border-t border-neutral-200/60 mt-2 pt-3 text-[11px] font-bold tracking-[0.15em] uppercase bg-transparent border-none cursor-pointer"
                        >
                          <LogOut className="h-3.5 w-3.5 stroke-[1.8] text-red-600" />
                          <span className="text-red-600">Sign Out</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="hidden sm:flex hover:opacity-75 transition-opacity items-center px-3 bg-transparent border-none cursor-pointer h-full"
                aria-label="Login"
              >
                <CircleUser className="h-4.5 w-4.5 stroke-[1.8] text-neutral-800" />
              </button>
            )}

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
                {dropdownItems.map((cat: any, idx: number) => (
                  <Link key={idx} to={cat.to} onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1 text-xs">
                    {cat.label}
                  </Link>
                ))}
              </div>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1">
                About
              </Link>
              <Link to="/help" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1">
                Help
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1 border-t pt-4 flex justify-between items-center">
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="bg-[#b2533e] text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/account" onClick={() => setIsMenuOpen(false)} className="hover:text-black py-1">
                    Account Settings
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}



