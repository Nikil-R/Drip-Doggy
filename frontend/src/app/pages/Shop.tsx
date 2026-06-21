import { useSearchParams } from "react-router";
import { ProductFilters } from "../components/shop/ProductFilters";
import { ProductGrid } from "../components/shop/ProductGrid";


export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <main className="pt-8">
      {/* Main Content */}
      <section id="products-section" className="max-w-7xl mx-auto px-8 pb-16">
        <div className="flex gap-8">
          <ProductFilters />
          <div className="flex-1">
            <ProductGrid />
          </div>
        </div>
      </section>

    </main>
  );
}
