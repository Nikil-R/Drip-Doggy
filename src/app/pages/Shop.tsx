import { useSearchParams } from "react-router";
import { ProductFilters } from "../components/ProductFilters";
import { ProductGrid } from "../components/ProductGrid";
import { CuratedCollections } from "../components/CuratedCollections";
import { Newsletter } from "../components/Newsletter";

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categories = [
    {
      name: "ALL PRODUCTS",
      paramKey: "all",
      paramVal: "",
      img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=100"
    },
    {
      name: "NEW ARRIVALS",
      paramKey: "new",
      paramVal: "true",
      img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=100"
    },
    {
      name: "DRESSES",
      paramKey: "category",
      paramVal: "dresses",
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=100"
    },
    {
      name: "OUTERWEAR",
      paramKey: "category",
      paramVal: "outerwear",
      img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=100"
    },
    {
      name: "ACCESSORIES",
      paramKey: "gender",
      paramVal: "accessories",
      img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=100"
    }
  ];

  const handleCategoryClick = (key: string, val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === "all") {
      newParams.delete("category");
      newParams.delete("gender");
      newParams.delete("collection");
      newParams.delete("new");
    } else {
      newParams.delete("category");
      newParams.delete("gender");
      newParams.delete("collection");
      newParams.delete("new");
      newParams.set(key, val);
    }
    setSearchParams(newParams);
  };

  const checkIsActive = (key: string, val: string) => {
    if (key === "all") {
      return !searchParams.get("category") && !searchParams.get("gender") && !searchParams.get("collection") && !searchParams.get("new");
    }
    return searchParams.get(key) === val;
  };

  return (
    <main className="pt-8">

      {/* Visual Category Navigation */}
      <section className="max-w-7xl mx-auto px-8 mb-12">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none justify-start md:justify-center">
          {categories.map((cat) => {
            const isActive = checkIsActive(cat.paramKey, cat.paramVal);
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.paramKey, cat.paramVal)}
                className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer whitespace-nowrap select-none ${
                  isActive 
                    ? "bg-[#030213] text-white border-[#030213] shadow-sm" 
                    : "bg-white text-neutral-650 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                }`}
              >
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                />
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content */}
      <section id="products-section" className="max-w-7xl mx-auto px-8 pb-16">
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
