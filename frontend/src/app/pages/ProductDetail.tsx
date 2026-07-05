import { useState, useEffect, useRef } from "react";
import {
  Star,
  ShieldCheck,
  ArrowRight,
  Heart,
  Share2,
  Copy,
  Check,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { getProductById, getRecommendations, DEFAULT_SIZES } from "../data/products";
import type { Product, ProductColorVariant } from "../data/products";
import { productApi } from "../lib/product-api";
import { cartApi } from "../lib/cart-api";
import { syncCart } from "../lib/cart-sync";
import { wishlistApi } from "../lib/wishlist-api";
import { syncWishlist } from "../lib/wishlist-sync";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = parseInt(id || "0", 10);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const item = await productApi.fetchProductById(productId);
        setProduct(item);
      } catch (err) {
        console.error("Error loading product detail", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 animate-pulse">Loading Product details...</p>
        </div>
      </div>
    );
  }

  // ─── 404 State ──────────────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h1 className="text-4xl font-extrabold tracking-[0.1em] mb-4 uppercase">
            Product Not Found
          </h1>
          <p className="text-neutral-500 text-xs tracking-widest uppercase mb-8">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#030213] text-white px-8 py-3.5 text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors uppercase"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetailContent product={product} />;
}

// ─── Live Product Detail ────────────────────────────────────────────────────
function ProductDetailContent({ product }: { product: Product }) {
  const navigate = useNavigate();

  // Color variants
  const hasVariants = product.variants && product.variants.length > 0;
  const firstVariant = hasVariants ? product.variants![0] : null;
  const [selectedColor, setSelectedColor] = useState(
    firstVariant?.name ?? "DEFAULT"
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [selectedSize, setSelectedSize] = useState(
    (product.sizes && product.sizes[0]) || "M"
  );
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "shipping" | "reviews"
  >("description");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  const productImages = getVariantImages(product, selectedColor);
  const colorOptions = getColorOptions(product);
  const displaySizes = (product.sizes && product.sizes.length > 0) ? product.sizes : DEFAULT_SIZES;
  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  // Cart quantity
  const [cartQuantity, setCartQuantity] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("cart");
      const items = stored ? JSON.parse(stored) : [];
      const item = items.find(
        (i: any) =>
          i.id === product.id &&
          i.color === selectedColor &&
          i.size === selectedSize
      );
      return item ? item.quantity : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const syncQuantity = () => {
      try {
        const stored = localStorage.getItem("cart");
        const items = stored ? JSON.parse(stored) : [];

        // Find the selected variant size ID
        const variant = product.rawVariants?.find(
          (v: any) => (v.variantName || "Default").toLowerCase() === selectedColor.toLowerCase()
        );
        const sizeObj = variant?.sizes?.find(
          (s: any) => (s.sizeName || "").toLowerCase() === selectedSize.toLowerCase()
        );
        const sizeId = sizeObj?.id;

        const item = items.find((i: any) => {
          if (sizeId && i.productVariantSizeId) {
            return String(i.productVariantSizeId) === String(sizeId);
          }
          return (
            i.id === product.id &&
            i.color.toLowerCase() === selectedColor.toLowerCase() &&
            i.size.toLowerCase() === selectedSize.toLowerCase()
          );
        });
        setCartQuantity(item ? item.quantity : 0);
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener("cart-updated", syncQuantity);
    window.addEventListener("storage", syncQuantity);
    syncQuantity();
    return () => {
      window.removeEventListener("cart-updated", syncQuantity);
      window.removeEventListener("storage", syncQuantity);
    };
  }, [selectedColor, selectedSize, product.id]);

  const updateProductQuantity = async (newQty: number) => {
    try {
      const token = localStorage.getItem("dripdoggy_auth_token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Resolve the backend size ID for this variant+size selection
      const variant = product.rawVariants?.find(
        (v: any) => (v.variantName || "Default").toLowerCase() === selectedColor.toLowerCase()
      );
      const sizeObj = variant?.sizes?.find(
        (s: any) => (s.sizeName || "").toLowerCase() === selectedSize.toLowerCase()
      );
      const sizeId = sizeObj?.id;
      const maxStock = sizeObj?.stockQuantity ?? 999999;

      // Find existing cart item — prefer sizeId match, fall back to string key
      const cartItemId = `${product.id}-${selectedColor.toLowerCase()}-${selectedSize.toLowerCase()}`;
      const stored = localStorage.getItem("cart");
      let items = stored ? JSON.parse(stored) : [];
      const existing = items.find((i: any) => {
        if (sizeId && i.productVariantSizeId) {
          return String(i.productVariantSizeId) === String(sizeId);
        }
        return i.cartItemId === cartItemId;
      });

      if (newQty <= 0) {
        // Remove from cart
        if (existing && existing.backendId) {
          await cartApi.removeFromCart(existing.backendId);
        }
      } else {
        // Check stock limit
        if (newQty > maxStock) {
          alert(`Out of stock! Only ${maxStock} units are available.`);
          return;
        }

        if (existing && existing.backendId) {
          // Item already in backend cart — just update quantity
          await cartApi.updateQuantity(existing.backendId, newQty);
        } else {
          // Item not in cart yet — add fresh
          if (sizeId) {
            await cartApi.addToCart(sizeId, newQty);
          } else {
            alert(`Selected size "${selectedSize}" is not available for this variant.`);
            return;
          }
        }
      }

      await syncCart();
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data?.message || e?.message || "Failed to update cart.";
      // Only show error to user if it's NOT a stock limit message we're already handling
      if (!msg.toLowerCase().includes("insufficient") && !msg.toLowerCase().includes("stock")) {
        alert(msg);
      }
    }
  };

  // Wishlist
  const [isWishlisted, setIsWishlisted] = useState(false);
  const ctaSectionRef = useRef<HTMLDivElement | null>(null);

  const [showStickyBar, setShowStickyBar] = useState(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const copyProductLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setToastMessage("Link copied successfully");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        const items = JSON.parse(stored);
        setIsWishlisted(items.some((item: any) => item.id === product.id));
      }
    } catch (e) {
      console.error(e);
    }
  }, [product.id]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem("dripdoggy_auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const stored = localStorage.getItem("wishlist");
      let items = stored ? JSON.parse(stored) : [];
      const existing = items.find((item: any) => item.id === product.id);

      if (isWishlisted) {
        if (existing && existing.backendId) {
          await wishlistApi.removeFromWishlist(existing.backendId);
        }
        setIsWishlisted(false);
      } else {
        const variant = product.rawVariants?.find(
          (v: any) => (v.variantName || "Default").toLowerCase() === selectedColor.toLowerCase()
        );
        const sizeObj = variant?.sizes?.find(
          (s: any) => s.sizeName === selectedSize
        );
        const sizeId = sizeObj?.id;
        if (sizeId) {
          await wishlistApi.addToWishlist(sizeId);
        } else {
          console.error("Size ID not found for wishlist:", selectedColor, selectedSize);
        }
        setIsWishlisted(true);
      }
      await syncWishlist();
    } catch (e) {
      console.error(e);
    }
  };

  // Sticky bar observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(
          !entry.isIntersecting && entry.boundingClientRect.top < 0
        );
      },
      { threshold: 0 }
    );

    if (ctaSectionRef.current) {
      observer.observe(ctaSectionRef.current);
    }

    return () => {
      if (ctaSectionRef.current) {
        observer.unobserve(ctaSectionRef.current);
      }
    };
  }, []);

  const handleAddToBag = () => {
    updateProductQuantity(cartQuantity + 1);
  };

  const handleBuyNow = () => {
    if (cartQuantity === 0) {
      updateProductQuantity(1);
    }
    navigate("/checkout");
  };

  // Recommendations (exclude current product)
  const recommendations = getRecommendations(product.id, 4);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200">
      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-6 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── LEFT COLUMN — Images ──────────────────────────────────── */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnail Strip */}
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {productImages.map((imgUrl, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => setCurrentImageIndex(index)}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-14 h-14 md:w-18 md:h-18 bg-neutral-100 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                      currentImageIndex === index
                        ? "border-[#030213] scale-[1.02] shadow-sm"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative flex-1 bg-neutral-100 rounded-xl overflow-hidden aspect-[4/5] lg:aspect-square group">
                <img
                  src={productImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Image Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex(
                          (prev) =>
                            (prev - 1 + productImages.length) %
                            productImages.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer border-none z-10"
                      aria-label="Previous image"
                    >
                      <svg className="h-4 w-4 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex(
                          (prev) => (prev + 1) % productImages.length
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer border-none z-10"
                      aria-label="Next image"
                    >
                      <svg className="h-4 w-4 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Wishlist Toggle */}
                <button
                  onClick={toggleWishlist}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-200 z-10 hover:scale-105 cursor-pointer border-none"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={`h-4.5 w-4.5 stroke-[1.8] transition-all duration-300 ${
                      isWishlisted
                        ? "fill-pink-500 stroke-pink-500 text-pink-500 scale-110"
                        : "text-neutral-800"
                    }`}
                  />
                </button>

                {/* Mobile dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        currentImageIndex === index
                          ? "bg-[#030213] w-3"
                          : "bg-neutral-450/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN — Product Info ───────────────────────────── */}
          <div className="lg:col-span-6 space-y-4 lg:pl-6">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200/50 pb-2">
              <nav
                className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.15em] text-[#6B7280] uppercase"
                aria-label="Breadcrumb"
              >
                <Link to="/" className="hover:underline hover:text-black transition-colors duration-150">
                  Home
                </Link>
                <span className="text-[8px] text-neutral-400">&gt;</span>
                <Link to="/shop" className="hover:underline hover:text-black transition-colors duration-150">
                  Shop
                </Link>
                <span className="text-[8px] text-neutral-400">&gt;</span>
                <span className="text-neutral-500 truncate max-w-[120px]">
                  {product.name}
                </span>
              </nav>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-7 h-7 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-neutral-800 flex items-center justify-center transition-all duration-200 cursor-pointer border-none shadow-xs hover:scale-105 active:scale-95 flex-shrink-0"
                aria-label="Share Product"
              >
                <Share2 className="h-3 w-3 stroke-[1.8]" />
              </button>
            </div>

            {/* Brand + Name */}
            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#b2533e] uppercase">
                {product.brand}
              </span>
              <h1 className="text-2xl lg:text-3.5xl font-extrabold tracking-tight mt-1 mb-2 leading-tight uppercase">
                {product.name}
              </h1>

              {/* Price + Rating */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-neutral-900">
                    ₹{product.price.toFixed(0)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xs font-semibold text-neutral-450 line-through">
                        ₹{product.originalPrice.toFixed(0)}
                      </span>
                      {discountPercent > 0 && (
                        <span className="text-[9px] font-extrabold text-[#b2533e] tracking-wider uppercase bg-red-50 px-1.5 py-0.5 rounded-sm">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>
                {(product.rating ?? 0) > 0 && (
                  <div className="flex items-center gap-0.5 text-neutral-800">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 stroke-current ${
                          i < Math.floor(product.rating ?? 0)
                            ? "fill-current text-amber-500"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                    <span className="text-[9px] font-bold tracking-wider text-neutral-450 ml-1">
                      ({product.reviewCount ?? product.reviews?.length ?? 0} REVIEWS)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-neutral-500 text-xs leading-relaxed max-w-lg">
                {product.description}
              </p>
            )}

            {/* Color Variant Selector */}
            {hasVariants && colorOptions.length > 0 && (
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] text-neutral-450 mb-1.5 uppercase">
                  Color:{" "}
                  <span className="text-neutral-900 font-extrabold">
                    {selectedColor}
                  </span>
                </p>
                <div className="flex gap-3 overflow-x-auto py-1.5 px-0.5 scrollbar-none">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color.name);
                        setCurrentImageIndex(0);
                      }}
                      className={`relative p-0.5 rounded-full border-2 transition-all duration-200 cursor-pointer flex-shrink-0 focus:outline-none ${
                        selectedColor === color.name
                          ? "border-[#030213] scale-105 shadow-sm"
                          : "border-transparent opacity-80 hover:opacity-100 hover:scale-105"
                      }`}
                      aria-label={`Select ${color.name} variant`}
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden">
                        <img
                          src={color.thumbnail}
                          alt={`${color.name} variant`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-baseline mb-1.5 max-w-md">
                <span className="text-[10px] font-bold tracking-[0.15em] text-neutral-450">
                  SIZE
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[9px] font-bold tracking-[0.15em] text-neutral-450 border-b border-neutral-300 pb-0.5 hover:text-neutral-950 transition-colors"
                >
                  SIZE GUIDE
                </button>
              </div>
              <div
                className={`grid gap-2 max-w-md`}
                style={{
                  gridTemplateColumns: `repeat(${Math.min(
                    displaySizes.length,
                    6
                  )}, 1fr)`,
                }}
              >
                {displaySizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border text-[10px] font-bold py-2 rounded-sm transition-colors text-center cursor-pointer ${
                      selectedSize === size
                        ? "bg-[#030213] text-white border-neutral-900 font-extrabold"
                        : "bg-white text-neutral-700 border-neutral-200/65 hover:border-neutral-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              ref={ctaSectionRef}
              className="grid grid-cols-2 gap-4 max-w-md pt-2"
            >
              {cartQuantity === 0 ? (
                <button
                  onClick={handleAddToBag}
                  className="bg-[#030213] text-white py-4 rounded-sm text-xs font-extrabold tracking-[0.15em] hover:bg-neutral-800 transition-all uppercase shadow-md active:scale-[0.99] border-none cursor-pointer"
                >
                  ADD TO BAG
                </button>
              ) : (
                <div className="flex items-center justify-between bg-[#030213] text-white py-3 px-1 rounded-sm text-xs font-extrabold tracking-[0.15em] shadow-md select-none">
                  <button
                    onClick={() => updateProductQuantity(cartQuantity - 1)}
                    className="px-3 py-1 text-white hover:text-neutral-300 font-extrabold text-base cursor-pointer border-none bg-transparent"
                  >
                    -
                  </button>
                  <span>{cartQuantity}</span>
                  <button
                    onClick={() => updateProductQuantity(cartQuantity + 1)}
                    className="px-3 py-1 text-white hover:text-neutral-300 font-extrabold text-base cursor-pointer border-none bg-transparent"
                  >
                    +
                  </button>
                </div>
              )}
              <button
                onClick={handleBuyNow}
                className="bg-white text-black border border-[#030213] py-4 rounded-sm text-xs font-extrabold tracking-[0.15em] hover:bg-[#030213] hover:text-white transition-all uppercase active:scale-[0.99] cursor-pointer"
              >
                BUY IT NOW
              </button>
            </div>
          </div>
        </div>

        {/* ─── Bottom Row — Design Details + Delivery Check ────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-neutral-200/60 max-w-7xl mx-auto px-6">
          {/* Design Details */}
          <div className="border border-neutral-200/80 rounded-none p-6 bg-[#FAF8F5]/30 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-neutral-900 border-b border-neutral-200/60 pb-2">
                PRODUCT FEATURES
              </h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] font-bold tracking-wider text-neutral-700 uppercase">
                {((product.designDetails && product.designDetails.length > 0) ? product.designDetails : [
                  "Elasticated Waistband",
                  "Adjustable Drawstring Closure",
                  "Dual Side-Seam Cross Pockets",
                  "Reinforced Ribbed Detailing",
                  "Premium Breathable Blend",
                  "Anti-Pilling Soft Finish"
                ]).map((detail) => (
                  <li key={detail} className="flex items-center gap-2">
                    <span className="text-[#b2533e] font-extrabold">—</span>{" "}
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-0 border-t border-neutral-200/60 pt-5 text-center divide-x divide-neutral-200/60">
              <div className="flex flex-col items-center justify-center py-1">
                <Truck className="h-5 w-5 text-neutral-900 stroke-[1.2]" />
                <span className="text-[7.5px] font-extrabold tracking-widest text-neutral-800 uppercase mt-2.5 block">
                  FREE SHIPPING
                </span>
              </div>
              <div className="flex flex-col items-center justify-center py-1">
                <RotateCcw className="h-5 w-5 text-neutral-900 stroke-[1.2]" />
                <span className="text-[7.5px] font-extrabold tracking-widest text-neutral-800 uppercase mt-2.5 block">
                  EXCHANGE STORE
                </span>
              </div>
              <div className="flex flex-col items-center justify-center py-1">
                <svg
                  className="w-5 h-5 text-neutral-900 stroke-[1.2]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                  />
                </svg>
                <span className="text-[7.5px] font-extrabold tracking-widest text-neutral-800 uppercase mt-2.5 block">
                  EASY RETURNS
                </span>
              </div>
            </div>
          </div>

          {/* Check Delivery */}
          <div className="border border-neutral-200/80 rounded-none p-6 bg-[#FAF8F5]/30 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-[11px] font-extrabold text-neutral-900 tracking-[0.2em] uppercase border-b border-neutral-200/60 pb-2">
                CHECK DELIVERY STATUS
              </h3>
              <p className="text-[9.5px] font-semibold tracking-wider text-neutral-500 uppercase leading-relaxed">
                ENTER YOUR DESTINATION PINCODE TO VERIFY SHIPPING AVAILABILITY
                AND ESTIMATED TRANSIT TIMELINES. DELIVERY TYPICALLY TAKES 2-6
                WORKING DAYS.
              </p>
              <div className="space-y-2 pt-1">
                <div className="flex border border-neutral-300 bg-white rounded-none overflow-hidden w-full">
                  <input
                    type="text"
                    placeholder="ENTER PINCODE"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      setPincodeStatus(null);
                    }}
                    className="flex-1 px-4 py-3 text-xs font-bold focus:outline-none placeholder-neutral-450 text-neutral-800 uppercase tracking-wider bg-white border-none"
                  />
                  <button
                    onClick={() => {
                      if (pincode.trim().length >= 5) {
                        setPincodeStatus(
                          `Available! Expected delivery in 2-4 working days.`
                        );
                      } else {
                        setPincodeStatus("Enter a valid pincode.");
                      }
                    }}
                    className="bg-black hover:bg-neutral-800 text-white text-[10px] font-extrabold tracking-widest px-8 uppercase border-none cursor-pointer transition-colors"
                  >
                    CHECK
                  </button>
                </div>
                {pincodeStatus && (
                  <p
                    className={`text-[9px] font-extrabold uppercase tracking-widest mt-2 ${
                      pincodeStatus.includes("Available")
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {pincodeStatus}
                  </p>
                )}
              </div>
            </div>

            {/* Delivery highlights */}
            <div className="border-t border-neutral-200/60 pt-5">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] font-bold tracking-wider text-neutral-700 uppercase">
                <li className="flex items-center gap-2">
                  <span className="text-[#b2533e] font-extrabold">—</span> Fast
                  Transit (2-6 Days)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#b2533e] font-extrabold">—</span> COD
                  Available
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#b2533e] font-extrabold">—</span>{" "}
                  Dispatch in 24 hrs
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#b2533e] font-extrabold">—</span>{" "}
                  Secure Logistics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Breakdown & Specs Section ─────────────────────────────────── */}
      {(product.description || product.specs || product.reviews) && (
        <section className="bg-white border-y border-neutral-200/60 py-8 mt-4">
          <div className="max-w-7xl mx-auto px-6">
            {/* Tab Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-neutral-200/60 mb-8 text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-500 bg-[#FAF8F5]/30">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-6 text-center border-r md:border-r border-b md:border-b-0 border-neutral-200/60 transition-all duration-300 cursor-pointer ${
                  activeTab === "description"
                    ? "bg-[#030213] text-white font-extrabold"
                    : "hover:bg-neutral-100/50 hover:text-black"
                }`}
              >
                01 / DESCRIPTION
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`py-4 px-6 text-center md:border-r border-b md:border-b-0 border-neutral-200/60 transition-all duration-300 cursor-pointer ${
                  activeTab === "specifications"
                    ? "bg-[#030213] text-white font-extrabold"
                    : "hover:bg-neutral-100/50 hover:text-black"
                }`}
              >
                02 / SPECIFICATIONS
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`py-4 px-6 text-center border-r md:border-r-0 border-neutral-200/60 transition-all duration-300 cursor-pointer ${
                  activeTab === "shipping"
                    ? "bg-[#030213] text-white font-extrabold"
                    : "hover:bg-neutral-100/50 hover:text-black"
                }`}
              >
                03 / SHIPPING & RETURNS
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-6 text-center transition-all duration-300 cursor-pointer ${
                  activeTab === "reviews"
                    ? "bg-[#030213] text-white font-extrabold"
                    : "hover:bg-neutral-100/50 hover:text-black"
                }`}
              >
                04 / REVIEWS (
                {product.reviewCount ?? product.reviews?.length ?? 0})
              </button>
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-12 space-y-6">
                {/* ─── DESCRIPTION TAB ─────────────────────────────────── */}
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-extrabold tracking-[0.1em] uppercase text-neutral-900">
                      PRODUCT BREAKDOWN
                    </h2>
                    <p className="text-neutral-500 text-sm leading-relaxed max-w-2xl">
                      {product.description ??
                        "Experience unparalleled comfort with our signature loungewear garments. Crafted from a soft cotton-polyester blend, this collection promises a cozy and breathable feel, perfect for active lifestyle layers or a restful night's sleep. Classic styling cues offer a timeless look that suits any casual setting."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                      {[
                        { title: "Comfortable Fabric", content: "The premium blend of 80% cotton and 20% polyester ensures a soft touch against your skin, keeping you comfortable all day long." },
                        { title: "Versatile Design", content: "With its solid pattern and clean fits, this range is perfect for both lounging at home and casual premium streetwear outings." },
                        { title: "Practical Features", content: "Functional waist rise parameters paired with deep cross pockets allow you to carry everyday essentials with ease." },
                        { title: "Effortless Style", content: "Constructed with half sleeves and a neat crew neck profile to offer a relaxed yet structured styling silhouette." }
                      ].map((f) => (
                        <div
                          key={f.title}
                          className="bg-neutral-50 p-4 rounded-none border border-neutral-200/50"
                        >
                          <h4 className="text-[10px] font-bold tracking-widest text-[#b2533e] mb-2 uppercase">
                            {f.title}
                          </h4>
                          <p className="text-xs text-neutral-500 leading-relaxed">
                            {f.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── SPECIFICATIONS TAB ──────────────────────────────── */}
                {activeTab === "specifications" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-extrabold tracking-[0.1em] uppercase text-neutral-900">
                      PRODUCT SPECIFICATIONS
                    </h2>
                    {(() => {
                      const isAcc = product.brand === "ACCESSORIES";
                      const specsList = (product.specs && product.specs.length > 0) ? product.specs : [
                        { label: "Fabric Type", value: isAcc ? "100% Recycled Nylon (Ballistic Grade)" : "Premium Cotton Polyester Blend" },
                        { label: "Fit / Size", value: isAcc ? "One Size (Adjustable Straps)" : "Regular Comfort Fit" },
                        { label: "Pattern", value: "Solid Matte Finish" },
                        { label: "Neck/Collar Type", value: isAcc ? "N/A" : "Classic Crew Neck" },
                        { label: "Sleeve Type", value: isAcc ? "N/A" : "Half Sleeve" },
                        { label: "Pockets", value: isAcc ? "Multi-Compartment Organizer Pockets" : "Concealed Side-Seam Cross Pockets" },
                        { label: "Wash Care", value: "Machine Wash Cold at 40°C. Do Not Bleach. Warm Iron if needed." }
                      ].filter(spec => spec.value !== "N/A");
                      
                      return (
                        <div className="border border-neutral-250/60 rounded-none overflow-hidden bg-white text-xs text-neutral-800">
                          {specsList.map((spec, idx) => (
                            <div
                              key={spec.label}
                              className={`grid grid-cols-2 ${
                                idx < specsList.length - 1
                                  ? "border-b border-neutral-150"
                                  : ""
                              } p-4`}
                            >
                              <span className="font-extrabold text-neutral-400 tracking-wider">
                                {spec.label}
                              </span>
                              <span className="font-semibold text-neutral-800">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* ─── SHIPPING TAB ────────────────────────────────────── */}
                {activeTab === "shipping" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-extrabold tracking-[0.1em] uppercase text-neutral-900">
                      SHIPPING & DISPATCH INFO
                    </h2>
                    <p className="text-neutral-500 text-sm leading-relaxed max-w-2xl">
                      Every order is handled with custom premium packaging.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {[
                        {
                          title: "DOMESTIC DISPATCH TIMELINES",
                          content:
                            "• Metro Cities (Delhi, Mumbai, Bengaluru, etc.): 2-3 working days\n• Other Regions: 4-6 working days\n• Free shipping on all prepaid orders across India.",
                        },
                        {
                          title: "7-DAY COMPLIMENTARY RETURN & EXCHANGE",
                          content:
                            "Enjoy a 7-day hassle-free return window. Size exchanges are processed with complimentary doorstep home pickup across India.",
                        },
                      ].map((info) => (
                        <div
                          key={info.title}
                          className="bg-neutral-50 p-4 rounded-none border border-neutral-200/50"
                        >
                          <h4 className="text-xs font-bold tracking-widest text-[#b2533e] mb-2 uppercase">
                            {info.title}
                          </h4>
                          <p className="text-xs text-neutral-500 leading-relaxed whitespace-pre-line">
                            {info.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── REVIEWS TAB ─────────────────────────────────────── */}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-extrabold tracking-[0.1em] uppercase text-neutral-900">
                      CUSTOMER REVIEWS
                    </h2>

                    {product.reviews && product.reviews.length > 0 ? (
                      <>
                        {/* Review Summary */}
                        <div className="flex flex-col sm:flex-row gap-6 items-center bg-neutral-50 p-6 rounded-none border border-neutral-200/40">
                          <div className="text-center sm:border-r border-neutral-200 sm:pr-8">
                            <p className="text-4xl font-extrabold text-neutral-900">
                              {product.rating?.toFixed(1) ?? "4.5"}
                            </p>
                            <div className="flex gap-0.5 my-1.5 justify-center text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-current stroke-current"
                                />
                              ))}
                            </div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                              Based on {product.reviewCount ?? product.reviews.length} reviews
                            </p>
                          </div>

                          {/* Rating Bars */}
                          <div className="flex-1 space-y-2 w-full text-xs font-semibold text-neutral-600">
                            {[5, 4, 3].map((star) => {
                              const count = product.reviews?.filter(
                                (r) => r.rating === star
                              ).length ?? 0;
                              const pct =
                                product.reviews.length > 0
                                  ? Math.round(
                                      (count / product.reviews.length) * 100
                                    )
                                  : 0;
                              return (
                                <div
                                  key={star}
                                  className="flex items-center gap-3"
                                >
                                  <span className="w-10">{star} Star</span>
                                  <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-neutral-800 rounded-full"
                                      style={{ width: `${pct}%` }}
                                    ></div>
                                  </div>
                                  <span className="w-8 text-right text-neutral-400">
                                    {pct}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Review List */}
                        <div className="divide-y divide-neutral-200/60">
                          {product.reviews.map((review, idx) => (
                            <div key={idx} className="py-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-extrabold text-neutral-900">
                                    {review.author}
                                  </span>
                                  {review.verified && (
                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                      Verified Buyer
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] font-bold text-neutral-400">
                                  {review.date}
                                </span>
                              </div>
                              <div className="flex gap-0.5 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? "fill-current stroke-current"
                                        : "text-neutral-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <h4 className="text-xs font-extrabold text-neutral-900 uppercase">
                                {review.title}
                              </h4>
                              <p className="text-xs text-neutral-500 leading-relaxed">
                                {review.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-neutral-400 text-sm">
                        No reviews yet. Be the first to review this product.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Frequently Bought Together ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-10 border-b border-neutral-200/60">
        <h2 className="text-center text-xs font-extrabold tracking-[0.25em] mb-6 uppercase">
          FREQUENTLY BOUGHT TOGETHER
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-4xl mx-auto bg-white border border-neutral-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
          {/* Images assembly */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-20 bg-neutral-100 rounded overflow-hidden">
              <img
                src={productImages[0] ?? product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-neutral-400 font-bold text-sm">+</span>
            <div className="w-16 h-20 bg-neutral-100 rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=150"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-neutral-400 font-bold text-sm">+</span>
            <div className="w-16 h-20 bg-neutral-100 rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=150"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-4">
            <div>
              <p className="text-[9px] font-bold tracking-widest text-neutral-400">
                BUNDLE PRICE
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold text-neutral-900">
                  ₹{(product.price + 245 + 165).toFixed(0)}
                </span>
                <span className="text-xs text-neutral-400 line-through">
                  ₹{(product.originalPrice ?? product.price + 245 + 165).toFixed(0)}
                </span>
              </div>
            </div>
            <button
              onClick={handleAddToBag}
              className="bg-[#030213] text-white px-6 py-3 rounded text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors uppercase cursor-pointer"
            >
              ADD BUNDLE TO BAG
            </button>
          </div>
        </div>
      </section>

      {/* ─── You May Also Like ──────────────────────────────────────────── */}
      {recommendations.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-end mb-8 border-b border-neutral-200/60 pb-4">
            <h2 className="text-xs font-extrabold tracking-[0.25em] uppercase text-neutral-900">
              YOU MAY ALSO LIKE
            </h2>
            <Link
              to="/shop"
              className="text-[10px] font-extrabold tracking-[0.15em] text-[#b2533e] hover:text-black transition-colors flex items-center gap-1.5 uppercase"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-neutral-200 bg-white">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} product={rec} />
            ))}
          </div>
        </section>
      )}


      {/* ─── Size Guide Modal ────────────────────────────────────────────── */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#FAF8F5] border border-neutral-200/80 rounded-xl max-w-2xl w-full p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-950 text-xl font-bold p-1"
            >
              ×
            </button>
            <h2 className="text-2xl font-extrabold tracking-[0.1em] mb-2 uppercase">
              SIZE GUIDE
            </h2>
            <p className="text-neutral-500 text-xs tracking-wider uppercase mb-8">
              Find the perfect fit with our measurements breakdown.
            </p>

            <div className="overflow-x-auto border border-neutral-200/60 rounded-lg bg-white">
              <table className="w-full text-left border-collapse text-xs font-semibold text-neutral-800">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold tracking-widest text-neutral-400 uppercase whitespace-nowrap">
                    <th className="py-4 px-6">SIZE</th>
                    <th className="py-4 px-6">CHEST (CM)</th>
                    <th className="py-4 px-6">ACROSS SHOULDER (CM)</th>
                    <th className="py-4 px-6">FRONT LENGTH (CM)</th>
                    <th className="py-4 px-6">TO FIT WAIST (CM)</th>
                    <th className="py-4 px-6">INSEAM LENGTH (CM)</th>
                    <th className="py-4 px-6">OUTSEAM LENGTH (CM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {[
                    { size: "XS", chest: 99.1, shoulder: 40.6, length: 64.8, waist: 68.6, inseam: 76.2, outseam: 106.7 },
                    { size: "S", chest: 104.1, shoulder: 43.2, length: 67.3, waist: 73.7, inseam: 76.2, outseam: 107.3 },
                    { size: "M", chest: 109.2, shoulder: 45.7, length: 69.8, waist: 78.7, inseam: 76.2, outseam: 108 },
                    { size: "L", chest: 114.3, shoulder: 48.3, length: 72.4, waist: 83.8, inseam: 76.2, outseam: 106 },
                    { size: "XL", chest: 119.4, shoulder: 50.8, length: 74.9, waist: 88.9, inseam: 76.2, outseam: 106.7 },
                    { size: "XXL", chest: 127, shoulder: 53.3, length: 77.5, waist: 94, inseam: 76.2, outseam: 107.3 },
                    { size: "XXXL", chest: 134.6, shoulder: 55.9, length: 80, waist: 99.1, inseam: 76.2, outseam: 108 },
                  ].map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-50/50">
                      <td className="py-4 px-6 font-bold">{row.size}</td>
                      <td className="py-4 px-6">{row.chest}</td>
                      <td className="py-4 px-6">{row.shoulder}</td>
                      <td className="py-4 px-6">{row.length}</td>
                      <td className="py-4 px-6">{row.waist}</td>
                      <td className="py-4 px-6">{row.inseam}</td>
                      <td className="py-4 px-6 text-[#b2533e]">{row.outseam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-neutral-50 rounded-lg p-4 text-[10px] font-bold tracking-wide text-neutral-500 uppercase leading-relaxed">
              * Note: For the most accurate fit, we recommend measuring at the
              chest, shoulders, and waist. If between sizes, choose the larger
              option.
            </div>
          </div>
        </div>
      )}

      {/* ─── Sticky Purchase Bar ─────────────────────────────────────────── */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-[#FAF8F5]/90 border-t border-neutral-200/60 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-[90] transition-all duration-300 ease-out transform ${
          showStickyBar
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Desktop */}
        <div className="hidden md:flex max-w-7xl mx-auto px-6 h-24 items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={productImages[0] ?? product.image}
              alt={product.name}
              className="w-[60px] h-[60px] object-cover rounded-md bg-neutral-100 flex-shrink-0"
            />
            <div>
              <h4 className="text-sm font-extrabold text-neutral-900 tracking-tight leading-snug">
                {product.name}
              </h4>
              <span className="text-sm font-extrabold text-[#b2533e] mt-0.5 block">
                ₹{product.price.toFixed(0)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">
                Selected Option
              </span>
              <span className="text-xs font-extrabold text-neutral-800 uppercase tracking-wide mt-0.5 block">
                {selectedSize} | {selectedColor}
              </span>
            </div>

            <div className="flex gap-3">
              {cartQuantity === 0 ? (
                <button
                  onClick={handleAddToBag}
                  className="w-[180px] h-[48px] bg-white text-black border border-[#030213] text-xs font-extrabold tracking-[0.15em] hover:bg-neutral-50 transition-all uppercase rounded-sm shadow-sm active:scale-[0.99] cursor-pointer"
                >
                  ADD TO BAG
                </button>
              ) : (
                <div className="w-[180px] h-[48px] bg-[#030213] text-white flex items-center justify-between text-xs font-extrabold tracking-[0.15em] rounded-sm shadow-md select-none">
                  <button
                    onClick={() => updateProductQuantity(cartQuantity - 1)}
                    className="px-4 h-full text-white hover:text-neutral-300 font-extrabold text-base cursor-pointer border-none bg-transparent"
                  >
                    -
                  </button>
                  <span>{cartQuantity}</span>
                  <button
                    onClick={() => updateProductQuantity(cartQuantity + 1)}
                    className="px-4 h-full text-white hover:text-neutral-300 font-extrabold text-base cursor-pointer border-none bg-transparent"
                  >
                    +
                  </button>
                </div>
              )}
              <button
                onClick={handleBuyNow}
                className="w-[180px] h-[48px] bg-[#030213] text-white text-xs font-extrabold tracking-[0.15em] hover:bg-neutral-800 transition-all uppercase rounded-sm shadow-md active:scale-[0.99] cursor-pointer"
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden p-3.5 space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={productImages[0] ?? product.image}
                alt="Product"
                className="w-12 h-12 object-cover rounded bg-neutral-100 flex-shrink-0"
              />
              <div>
                <h4 className="text-xs font-extrabold text-neutral-900 tracking-tight leading-tight line-clamp-1">
                  {product.name}
                </h4>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
                  {selectedSize} - {selectedColor.split(" ")[0]}
                </p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-[#b2533e]">
              ₹{product.price.toFixed(0)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {cartQuantity === 0 ? (
              <button
                onClick={handleAddToBag}
                className="w-full h-[52px] bg-white text-black border border-[#030213] text-[10px] font-extrabold tracking-[0.15em] hover:bg-neutral-50 uppercase rounded-sm active:scale-[0.99] cursor-pointer"
              >
                ADD TO BAG
              </button>
            ) : (
              <div className="w-full h-[52px] bg-[#030213] text-white flex items-center justify-between text-[10px] font-extrabold tracking-[0.15em] rounded-sm shadow-md select-none">
                <button
                  onClick={() => updateProductQuantity(cartQuantity - 1)}
                  className="px-3 h-full text-white hover:text-neutral-300 font-extrabold text-base cursor-pointer border-none bg-transparent"
                >
                  -
                </button>
                <span>{cartQuantity}</span>
                <button
                  onClick={() => updateProductQuantity(cartQuantity + 1)}
                  className="px-3 h-full text-white hover:text-neutral-300 font-extrabold text-base cursor-pointer border-none bg-transparent"
                >
                  +
                </button>
              </div>
            )}
            <button
              onClick={handleBuyNow}
              className="w-full h-[52px] bg-[#030213] text-white text-[10px] font-extrabold tracking-[0.15em] hover:bg-neutral-800 uppercase rounded-sm active:scale-[0.99] cursor-pointer"
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>

      {/* ─── Share Modal ─────────────────────────────────────────────────── */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] border border-neutral-200/80 rounded-xl max-w-md w-full p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-950 text-xl font-bold p-1 cursor-pointer border-none bg-transparent"
              aria-label="Close modal"
            >
              ×
            </button>
            <h3 className="text-sm font-extrabold tracking-[0.2em] text-[#030213] uppercase mb-1.5">
              Share Product
            </h3>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-6">
              Share this premium garment with your friends
            </p>

            <div className="space-y-3">
              {/* Copy Link */}
              <button
                onClick={copyProductLink}
                className="w-full flex items-center justify-between bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs font-bold text-neutral-800 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Copy className="h-4 w-4 stroke-[1.8]" />
                  COPY PRODUCT LINK
                </span>
                {copied ? (
                  <Check className="h-4 w-4 text-green-600 stroke-[2.5]" />
                ) : null}
              </button>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full flex items-center bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs font-bold text-neutral-800 transition-colors cursor-pointer no-underline"
              >
                <span className="flex items-center gap-2.5">
                  <svg
                    className="h-4 w-4 fill-current text-[#25D366]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.488 2.012 14.04 1.01 11.993 1.01 6.562 1.01 2.137 5.381 2.133 10.81c0 1.691.455 3.342 1.32 4.81l-1.006 3.676 3.771-.979zm11.393-5.02c-.3-.149-1.772-.865-2.046-.964-.274-.1-.474-.149-.673.149-.199.299-.772.964-.946 1.162-.175.199-.349.224-.649.075-.3-.149-1.265-.462-2.41-1.474-.89-.785-1.49-1.754-1.664-2.053-.175-.299-.019-.461.13-.61.135-.133.3-.349.449-.523.149-.174.199-.299.299-.497.1-.199.05-.373-.025-.523-.075-.149-.673-1.62-.922-2.215-.242-.58-.488-.5-.673-.51-.175-.01-.374-.01-.573-.01-.199 0-.523.075-.797.373-.274.299-1.046 1.02-1.046 2.487 0 1.467 1.07 2.885 1.22 3.085.149.199 2.107 3.188 5.101 4.467.712.304 1.269.485 1.703.621.714.227 1.365.195 1.88.117.573-.085 1.772-.715 2.022-1.405.25-.688.25-1.28.175-1.405-.075-.124-.274-.199-.573-.348z" />
                  </svg>
                  WHATSAPP
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full flex items-center bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs font-bold text-neutral-800 transition-colors cursor-pointer no-underline"
              >
                <span className="flex items-center gap-2.5">
                  <svg
                    className="h-4 w-4 fill-none stroke-current text-[#E1306C]"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  INSTAGRAM
                </span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full flex items-center bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs font-bold text-neutral-800 transition-colors cursor-pointer no-underline"
              >
                <span className="flex items-center gap-2.5">
                  <svg
                    className="h-4 w-4 fill-current text-[#1877F2]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  FACEBOOK
                </span>
              </a>

              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  window.location.href
                )}&text=${encodeURIComponent(
                  `Check out this amazing piece from Drip Doggy!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full flex items-center bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs font-bold text-neutral-800 transition-colors cursor-pointer no-underline"
              >
                <span className="flex items-center gap-2.5">
                  <svg
                    className="h-4 w-4 fill-current text-black"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X (TWITTER)
                </span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  window.location.href
                )}&text=${encodeURIComponent(
                  `Check out this amazing piece from Drip Doggy!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full flex items-center bg-white hover:bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs font-bold text-neutral-800 transition-colors cursor-pointer no-underline"
              >
                <span className="flex items-center gap-2.5">
                  <svg
                    className="h-4 w-4 fill-current text-[#0088cc]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.61l-1.91 9c-.14.63-.51.79-1.04.49l-2.91-2.15-1.4 1.35c-.15.15-.28.28-.58.28l.2-2.94 5.35-4.83c.23-.21-.05-.32-.35-.12L10.27 13.1l-2.85-.89c-.62-.2-.63-.62.13-.92l11.14-4.3c.51-.19.96.11.87.62z" />
                  </svg>
                  TELEGRAM
                </span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast Notification ──────────────────────────────────────────── */}
      {showToast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[110] bg-[#030213] text-[#FAF8F5] text-[10px] font-extrabold tracking-widest px-6 py-3.5 rounded-sm uppercase shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getVariantImages(
  product: Product,
  selectedColor: string
): string[] {
  if (product.variants && product.variants.length > 0) {
    const variant = product.variants.find((v) => v.name === selectedColor);
    if (variant) return variant.images;
  }
  return product.images.length > 0 ? product.images : [product.image];
}

function getColorOptions(
  product: Product
): ProductColorVariant[] {
  if (product.variants && product.variants.length > 0) {
    return product.variants;
  }
  // Generate a single default option from the product images
  return [
    {
      name: "DEFAULT",
      thumbnail: product.image,
      images: product.images,
    },
  ];
}

// ─── Recommendation Card ─────────────────────────────────────────────────────

interface RecProduct {
  id: number;
  brand: string;
  name: string;
  price: number;
  originalPrice: number;
  images: string[];
}

function RecommendationCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      const list = stored ? JSON.parse(stored) : [];
      setIsFavorite(list.some((item: any) => item.id === product.id));
    } catch (e) {
      console.error(e);
    }
  }, [product.id]);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      try {
        const stored = localStorage.getItem("wishlist");
        const list = stored ? JSON.parse(stored) : [];
        setIsFavorite(list.some((item: any) => item.id === product.id));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () =>
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, [product.id]);

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

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("wishlist");
      let list = stored ? JSON.parse(stored) : [];
      const exists = list.some((item: any) => item.id === product.id);

      if (exists) {
        list = list.filter((item: any) => item.id !== product.id);
        setIsFavorite(false);
      } else {
        list.push({
          id: product.id,
          brand: product.brand,
          name: product.name,
          price: product.price,
          image: product.images[0] || product.image,
        });
        setIsFavorite(true);
      }
      localStorage.setItem("wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group cursor-pointer p-4 border-r border-b lg:border-b-0 border-neutral-200 flex flex-col justify-between h-full hover:bg-neutral-50/50 transition-colors duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <div className="aspect-[3/4] bg-neutral-100 rounded-none overflow-hidden mb-3.5 relative">
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

          {isHovered && product.images.length > 1 && (
            <div className="absolute top-3 inset-x-4 flex gap-1.5 z-10 transition-all duration-300">
              {product.images.map((_, idx) => (
                <div
                  key={idx}
                  className="h-[2px] flex-1 bg-white/20 rounded-none overflow-hidden relative"
                >
                  {idx === activeIdx ? (
                    <div
                      key={`progress-rec-${idx}`}
                      style={{ animation: "progressGrowRec 1.5s linear forwards" }}
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
            @keyframes progressGrowRec {
              from { width: 0%; }
              to { width: 100%; }
            }
          `,
            }}
          />

          <button
            onClick={toggleFavorite}
            className="absolute top-2.5 right-2.5 p-1.5 bg-[#FAF8F5]/90 text-neutral-800 hover:text-red-500 transition-colors z-10 rounded-none shadow-sm border border-neutral-200/50 cursor-pointer"
          >
            <Heart
              className={`h-3 w-3 stroke-[2] ${
                isFavorite ? "fill-red-500 stroke-red-500" : ""
              }`}
            />
          </button>
        </div>
        <span className="text-[9px] font-extrabold tracking-widest text-[#b2533e] uppercase">
          {product.brand}
        </span>
        <h3 className="text-xs font-extrabold tracking-wider mt-1 mb-0.5 text-neutral-900 uppercase leading-snug line-clamp-1">
          {product.name}
        </h3>
      </div>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-xs font-bold text-neutral-800">
          ₹{product.price.toFixed(0)}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-[10px] font-semibold text-[#858383] line-through">
              ₹{product.originalPrice.toFixed(0)}
            </span>
            {discountPercent > 0 && (
              <span className="text-[8px] font-extrabold text-[#b2533e] uppercase tracking-wider bg-red-50 px-1 py-0.5 rounded-sm">
                {discountPercent}% OFF
              </span>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
