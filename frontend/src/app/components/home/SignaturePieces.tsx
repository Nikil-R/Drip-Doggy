import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { products } from "../../data/products";
import type { Product } from "../../data/products";
import { getSignaturePieces } from "../../lib/content-store";

function SignatureCard({ product }: { product: Product }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) { setActiveIdx(0); return; }
    const timer = setInterval(
      () => setActiveIdx((prev) => (prev + 1) % product.images.length),
      1500
    );
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

        {isHovered && product.images.length > 1 && (
          <div className="absolute top-3 inset-x-4 flex gap-1.5 z-10">
            {product.images.map((_, idx) => (
              <div key={idx} className="h-[2px] flex-1 bg-white/20 overflow-hidden relative">
                {idx === activeIdx ? (
                  <div
                    key={`progress-${idx}`}
                    style={{ animation: "progressGrow 1.5s linear forwards" }}
                    className="absolute left-0 top-0 h-full bg-white"
                  />
                ) : (
                  <div
                    className={`absolute left-0 top-0 h-full bg-white/40 ${idx < activeIdx ? "w-full" : "w-0"}`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes progressGrow { from { width: 0%; } to { width: 100%; } }
        `}} />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[8px] font-extrabold tracking-[0.25em] text-[#b2533e] uppercase">
          {product.brand}
        </span>
        <h3 className="text-xs md:text-sm font-extrabold text-[#030213] uppercase leading-tight line-clamp-1 group-hover:underline">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-sm font-extrabold text-neutral-900">
            ₹{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-[10px] font-semibold text-neutral-450 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-[8px] font-extrabold text-[#b2533e] uppercase tracking-wider bg-red-50 px-1 py-0.5 rounded-sm">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export function SignaturePieces() {
  const [config, setConfig] = useState(() => getSignaturePieces());

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getSignaturePieces());
    };
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("dd-content-changed" as any, handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("dd-content-changed" as any, handleUpdate);
    };
  }, []);

  if (!config.active) return null;

  // Resolve dynamic product list
  const displayedProducts = config.productIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p)
    .slice(0, config.maxProducts || 4);

  const fallbackIds = [4, 9, 1, 6];
  const finalProducts = (displayedProducts.length > 0 ? displayedProducts : fallbackIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p))
    .slice(0, config.maxProducts || 4);

  return (
    <section id="signature-pieces" className="pt-2 pb-8 lg:pt-6 lg:pb-10 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <span className="text-[8px] font-extrabold tracking-[0.25em] text-[#b2533e] uppercase block mb-2">
            {config.sectionSubtitle || "Brand Uniform"}
          </span>
          <div className="flex justify-between items-baseline">
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#030213] uppercase">
              {config.sectionTitle || "Signature Pieces"}
            </h2>
            <Link
              to="/shop"
              className="text-[10px] font-bold tracking-[0.2em] border-b border-neutral-900 pb-0.5 hover:opacity-75 transition-opacity uppercase flex-shrink-0"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {finalProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <SignatureCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
