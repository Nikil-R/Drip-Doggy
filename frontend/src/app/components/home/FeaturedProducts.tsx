import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { products } from "../../data/products";
import type { Product } from "../../data/products";
import { Star } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";


function ProductCard({ product }: { product: Product }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) { setActiveIdx(0); return; }
    const timer = setInterval(() => setActiveIdx(prev => (prev + 1) % product.images.length), 1500);
    return () => clearInterval(timer);
  }, [isHovered, product.images.length]);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
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
          <div className="absolute top-3 inset-x-4 flex gap-1.5 z-10">
            {product.images.map((_, idx) => (
              <div key={idx} className="h-[2px] flex-1 bg-white/20 overflow-hidden relative">
                {idx === activeIdx ? (
                  <div
                    key={`progress-${idx}`}
                    style={{ animation: 'progressGrow 1.5s linear forwards' }}
                    className="absolute left-0 top-0 h-full bg-white"
                  />
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
      </div>

      <div className="flex flex-col gap-0.5 mt-1.5">
        <span className="text-[8px] font-extrabold tracking-[0.25em] text-[#b2533e] uppercase h-3 flex items-center">
          {product.brand}
        </span>
        <h3 className="text-xs md:text-sm font-extrabold text-[#030213] uppercase leading-tight truncate block group-hover:underline h-6 pt-1">
          {product.name}
        </h3>
        <div className="flex items-center flex-wrap h-5">
          <span className="text-xs sm:text-sm font-extrabold text-neutral-900">
            ₹{product.price.toFixed(0)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-[10px] sm:text-xs font-semibold text-neutral-450 line-through ml-2.5">
                ₹{product.originalPrice.toFixed(0)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[8px] font-extrabold text-[#b2533e] uppercase tracking-wider bg-red-50 px-1 py-0.5 rounded-sm ml-2">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </>
          )}
        </div>
        <div className="h-4 flex items-center">
          {product.rating !== undefined && product.rating > 0 ? (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <div className="flex items-center text-[#ffc107]">
                {[...Array(5)].map((_, i) => {
                  const isFilled = i < Math.round(product.rating || 0);
                  return (
                    <Star
                      key={i}
                      className={`h-2.5 w-2.5 ${isFilled ? "fill-current" : "text-neutral-200"}`}
                    />
                  );
                })}
              </div>
              <span className="text-[8px] font-extrabold text-neutral-500 ml-0.5">
                {product.rating.toFixed(1)}
              </span>
            </div>
          ) : (
            <div className="h-2.5" />
          )}
        </div>
      </div>
    </Link>
  );
}

import { curatedCollectionApi } from "../../lib/curated-collection-api";

export function FeaturedProducts() {
  const { isAuthenticated } = useAuth();
  const [config, setConfig] = useState({
    sectionTitle: "New Arrivals",
    sectionSubtitle: "New This Season",
    active: true
  });
  const [finalProducts, setFinalProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await curatedCollectionApi.getCollection("NEW_IN");
        setConfig({
          sectionTitle: data.title || "New Arrivals",
          sectionSubtitle: data.subtitle || "New This Season",
          active: data.isActive
        });
        
        const rawProds = data.products || [];
        const enriched = await Promise.all(
          rawProds.map(async (prod) => {
            try {
              const reviewsUrl = `/dripdoggy/api/public/reviews/product/${prod.id}`;
              const reviewsRes = await axios.get<any[]>(reviewsUrl);
              const reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
              const avgRating = reviews.length > 0
                ? Number((reviews.reduce((sum, rev) => sum + Number(rev.rating ?? 5), 0) / reviews.length).toFixed(1))
                : 0;
              return {
                ...prod,
                rating: avgRating,
                reviewCount: reviews.length
              };
            } catch (err) {
              console.error("Failed to load reviews for featured prod:", prod.id, err);
              return {
                ...prod,
                rating: 0,
                reviewCount: 0
              };
            }
          })
        );
        setFinalProducts(enriched);
      } catch (err) {
        console.error("Failed to load featured products:", err);
      }
    }
    loadProducts();
  }, [isAuthenticated]);

  if (!config.active) return null;

  return (
    <section id="new-in" className="pt-2 pb-16 lg:pt-6 lg:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10">
          <span className="text-[8px] font-extrabold tracking-[0.25em] text-[#b2533e] uppercase block mb-2">
            {config.sectionSubtitle || "New This Season"}
          </span>
          <div className="flex justify-between items-baseline">
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#030213] uppercase">
              {config.sectionTitle || "New Arrivals"}
            </h2>
            <Link
              to="/shop"
              className="text-[10px] font-bold tracking-[0.2em] border-b border-neutral-900 pb-0.5 hover:opacity-75 transition-opacity uppercase flex-shrink-0"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {finalProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
