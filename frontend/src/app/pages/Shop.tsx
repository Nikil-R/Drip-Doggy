import { useState } from "react";
import { useSearchParams } from "react-router";
import { ProductFilters } from "../components/shop/ProductFilters";
import { ProductGrid } from "../components/shop/ProductGrid";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

export function Shop() {
  const [searchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const totalFilters = getActiveFilterCount(searchParams);

  return (
    <main className="pt-8">
      {/* Mobile Filter Bar */}
      <div className="lg:hidden max-w-7xl mx-auto px-8 pb-4">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="w-full flex items-center justify-center gap-2 border border-neutral-200 bg-white py-3 text-[10px] font-extrabold tracking-[0.2em] uppercase hover:bg-neutral-50 transition-colors bg-transparent border-none cursor-pointer"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 stroke-[1.8]" />
          FILTERS
          {totalFilters > 0 && (
            <span className="bg-[#030213] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm ml-1">
              {totalFilters}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-full sm:max-w-sm bg-[#FAF8F5] overflow-y-auto">
          <SheetHeader className="p-0">
            <SheetTitle className="sr-only">Filters</SheetTitle>
          </SheetHeader>
          <div className="pt-6 pb-8">
            <ProductFilters isMobile />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <section id="products-section" className="max-w-7xl mx-auto px-8 pb-16">
        <div className="flex gap-8">
          {/* Desktop filters — hidden on mobile */}
          <div className="hidden lg:block">
            <ProductFilters />
          </div>
          <div className="flex-1 min-w-0">
            <ProductGrid />
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Helper ────────────────────────────────────────────────────────────────

function getActiveFilterCount(params: URLSearchParams): number {
  let count = 0;
  if (params.get("category")) count++;
  if (params.get("size")) count++;
  if (params.get("color")) count++;
  if (params.get("price")) count++;
  if (params.get("collection")) count++;
  if (params.get("new")) count++;
  return count;
}
