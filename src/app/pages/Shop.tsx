import { ProductFilters } from "../components/ProductFilters";
import { ProductGrid } from "../components/ProductGrid";
import { CuratedCollections } from "../components/CuratedCollections";
import { Newsletter } from "../components/Newsletter";

export function Shop() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-5 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-[0.15em] mb-6 font-sans uppercase">
          SHOP ALL
        </h1>
        <p className="text-neutral-500 max-w-2xl mx-auto text-sm tracking-wide leading-relaxed font-light">
          Explore our entire collection of premium streetwear. From everyday essentials to standout pieces.
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-8 pb-16">
        <div className="flex gap-8">
          <ProductFilters />
          <div className="flex-1">
            <ProductGrid />
          </div>
        </div>
      </section>

      <CuratedCollections />
      <Newsletter />
    </main>
  );
}
