import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { ProductFilters } from "../components/shop/ProductFilters";
import { ProductGrid } from "../components/shop/ProductGrid";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { SlidersHorizontal, Search, ArrowUpDown } from "lucide-react";

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(searchParams.get("q") || "");

  const totalFilters = getActiveFilterCount(searchParams);

  // Sync search input with URL param changes
  useEffect(() => {
    setSearchVal(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchVal.trim()) {
      newParams.set("q", searchVal.trim());
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSortChange = (sortBy: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (sortBy === "default") {
      newParams.delete("sort");
    } else {
      newParams.set("sort", sortBy);
    }
    setSearchParams(newParams, { replace: true });
  };

  return (
    <main className="pt-4 lg:pt-8 bg-[#FAF8F5]/30 min-h-screen">
      {/* Search & Utility Toolbar for Mobile & Tablet */}
      <div className="lg:hidden max-w-7xl mx-auto px-6 pb-4 space-y-3.5">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="SEARCH D.D. ARCHIVE..."
            className="w-full bg-white border border-neutral-200/80 pl-10 pr-4 py-3 text-[10px] font-bold tracking-widest placeholder-neutral-400 uppercase rounded-none focus:outline-none focus:border-[#030213] transition-colors"
          />
          <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 bg-transparent border-none cursor-pointer p-0">
            <Search className="h-3.5 w-3.5 stroke-[1.8]" />
          </button>
        </form>

        {/* Action Controls: Filter & Sort Grid */}
        <div className="grid grid-cols-2 border border-neutral-200/80 bg-white divide-x divide-neutral-200/80">
          {/* Filter button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center justify-center gap-2 py-3.5 text-[9px] font-black tracking-[0.25em] text-[#030213] uppercase hover:bg-neutral-50 transition-colors bg-transparent border-none cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 stroke-[1.8]" />
            FILTERS
            {totalFilters > 0 && (
              <span className="bg-[#030213] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-none ml-1">
                {totalFilters}
              </span>
            )}
          </button>

          {/* Sort dropdown overlay wrapper */}
          <div className="relative flex items-center justify-center">
            <button
              className="flex items-center justify-center gap-2 py-3.5 text-[9px] font-black tracking-[0.25em] text-[#030213] uppercase hover:bg-neutral-50 transition-colors bg-transparent border-none cursor-pointer w-full"
            >
              <ArrowUpDown className="h-3.5 w-3.5 stroke-[1.8]" />
              <select
                value={searchParams.get("sort") || "default"}
                onChange={(e) => handleSortChange(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              >
                <option value="default">SORT: DEFAULT</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
              </select>
              <span>
                {searchParams.get("sort") === "price-asc" ? "PRICE: L-H" : 
                 searchParams.get("sort") === "price-desc" ? "PRICE: H-L" : "SORT: DEFAULT"}
              </span>
            </button>
          </div>
        </div>
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
      <section id="products-section" className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
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
