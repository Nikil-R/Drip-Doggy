import { Slider } from "../ui/slider";
import { useSearchParams } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { categoryApi, Category } from "../../lib/category-api";
import { Plus, Minus, RotateCcw } from "lucide-react";

export function ProductFilters({ isMobile = false }: { isMobile?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const genderParam = searchParams.get("gender") || "women";
  const isAccessories = genderParam === "accessories";

  const selectedCategory =
    searchParams.get("category")?.toUpperCase() ||
    (isAccessories ? "ALL ACCESSORIES" : "ALL WOMEN'S");
  const selectedSize = searchParams.get("size")?.toUpperCase() || "";

  const priceRangeParam = searchParams.get("price");
  const priceRange = priceRangeParam
    ? priceRangeParam.split("-").map(Number)
    : [0, 10000];

  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [openSections, setOpenSections] = useState({
    categories: true,
    sizes: true,
    price: true,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const list = await categoryApi.fetchCategories();
        setDbCategories(list.filter(c => c.isActive !== false));
      } catch (err) {
        console.error("Error loading categories", err);
      }
    }
    loadCategories();
  }, []);

  const activeSubcategories = useMemo(() => {
    const subs = new Set<string>();
    subs.add(isAccessories ? "ALL ACCESSORIES" : "ALL WOMEN'S");
    dbCategories.forEach(cat => {
      if (cat.subCategories) {
        cat.subCategories.forEach(sub => {
          if (sub.isActive !== false) {
            subs.add(sub.subcategoryName.toUpperCase());
          }
        });
      }
    });
    return Array.from(subs);
  }, [dbCategories, isAccessories]);

  const categories = activeSubcategories;
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleCategoryClick = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category.startsWith("ALL ")) {
      newParams.delete("category");
    } else {
      newParams.set("category", category.toLowerCase());
    }
    newParams.delete("collection");
    newParams.delete("new");
    setSearchParams(newParams);
  };

  const handleSizeClick = (size: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedSize === size) {
      newParams.delete("size");
    } else {
      newParams.set("size", size.toLowerCase());
    }
    setSearchParams(newParams);
  };

  const handlePriceChange = (val: number[]) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("price", `${val[0]}-${val[1]}`);
    setSearchParams(newParams);
  };

  const toggleSection = (section: "categories" | "sizes" | "price") => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedSize ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000 ||
    searchParams.get("category");

  const content = (
    <div className={isMobile ? "" : "w-64 pr-10 border-r border-neutral-100 font-sans"}>
      {/* Header for Desktop or Mobile */}
      <div className="flex items-center justify-between mb-8 pb-3.5 border-b border-neutral-150">
        <h2 className="text-[11px] font-black tracking-[0.25em] text-[#030213] uppercase">
          Filter By
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-[9px] font-extrabold tracking-[0.15em] text-[#b2533e] hover:text-black transition-colors bg-transparent border-none cursor-pointer uppercase"
          >
            <RotateCcw className="h-3 w-3 stroke-[2.5]" />
            Reset
          </button>
        )}
      </div>

      {/* Categories Section */}
      <div className="border-b border-neutral-100 pb-6 mb-6">
        <button
          onClick={() => toggleSection("categories")}
          className="flex items-center justify-between w-full text-left py-1.5 bg-transparent border-none cursor-pointer select-none"
        >
          <span className="text-[10px] font-black tracking-[0.2em] text-neutral-900 uppercase">
            Sub Categories
          </span>
          {openSections.categories ? (
            <Minus className="h-3 w-3 text-neutral-400 stroke-[2.5]" />
          ) : (
            <Plus className="h-3 w-3 text-neutral-400 stroke-[2.5]" />
          )}
        </button>

        {openSections.categories && (
          <div className="mt-4 space-y-3 pl-0.5">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`flex items-center w-full text-left py-1 text-[11px] tracking-wider transition-all duration-300 uppercase bg-transparent border-none cursor-pointer ${
                    isSelected
                      ? "text-[#030213] font-black font-extrabold pl-2.5 border-l-2 border-[#030213]"
                      : "text-neutral-500 hover:text-neutral-900 pl-0 border-l-2 border-transparent hover:pl-2"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sizes Section */}
      <div className="border-b border-neutral-100 pb-6 mb-6">
        <button
          onClick={() => toggleSection("sizes")}
          className="flex items-center justify-between w-full text-left py-1.5 bg-transparent border-none cursor-pointer select-none"
        >
          <span className="text-[10px] font-black tracking-[0.2em] text-neutral-900 uppercase">
            Size
          </span>
          {openSections.sizes ? (
            <Minus className="h-3 w-3 text-neutral-400 stroke-[2.5]" />
          ) : (
            <Plus className="h-3 w-3 text-neutral-400 stroke-[2.5]" />
          )}
        </button>

        {openSections.sizes && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    className={`w-10 h-10 flex items-center justify-center text-[10px] font-bold tracking-wider transition-all duration-300 border rounded-none cursor-pointer uppercase ${
                      isSelected
                        ? "bg-[#030213] text-white border-[#030213] shadow-[0_2px_8px_rgba(0,0,0,0.15)] font-black"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-800 hover:text-neutral-900"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left py-1.5 bg-transparent border-none cursor-pointer select-none"
        >
          <span className="text-[10px] font-black tracking-[0.2em] text-neutral-900 uppercase">
            Price Range
          </span>
          {openSections.price ? (
            <Minus className="h-3 w-3 text-neutral-400 stroke-[2.5]" />
          ) : (
            <Plus className="h-3 w-3 text-neutral-400 stroke-[2.5]" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-5 px-1.5">
            <Slider
              min={0}
              max={10000}
              step={100}
              defaultValue={[0, 10000]}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="w-full cursor-pointer accent-[#030213] h-1.5"
            />
            <div className="flex justify-between items-baseline mt-4 text-[10px] font-extrabold tracking-widest text-neutral-700 uppercase">
              <span className="bg-neutral-50 px-2 py-1 border border-neutral-200/50">₹{priceRange[0]}</span>
              <span className="text-neutral-300">—</span>
              <span className="bg-neutral-50 px-2 py-1 border border-neutral-200/50">₹{priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return content;
}
