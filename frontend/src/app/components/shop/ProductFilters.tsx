import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { useSearchParams } from "react-router";

// ─── Helper to map hex → color name ────────────────────────────────────────
function hexToColorName(hex: string): string | undefined {
  const map: Record<string, string> = {
    "#1A1A1A": "black",
    "#000000": "black",
    "#FAF8F5": "white",
    "#FFFFFF": "white",
    "#9CA3AF": "gray",
    "#D2C9BD": "beige",
    "#D4C5B9": "beige",
    "#92400E": "brown",
  };
  return map[hex.toUpperCase()];
}

export function ProductFilters({ isMobile = false }: { isMobile?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const genderParam = searchParams.get("gender") || "women";
  const isAccessories = genderParam === "accessories";

  const selectedCategory =
    searchParams.get("category")?.toUpperCase() ||
    (isAccessories ? "ALL ACCESSORIES" : "ALL WOMEN'S");
  const selectedSize = searchParams.get("size")?.toUpperCase() || "";
  const selectedColor = searchParams.get("color") || "";

  const priceRangeParam = searchParams.get("price");
  const priceRange = priceRangeParam
    ? priceRangeParam.split("-").map(Number)
    : [0, 500];

  const categories = isAccessories
    ? ["ALL ACCESSORIES", "BAGS", "CAPS", "BELTS"]
    : ["ALL WOMEN'S", "DRESSES", "OUTERWEAR", "TOPS", "SKIRTS"];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Gray", value: "#9CA3AF" },
    { name: "Brown", value: "#92400E" },
    { name: "Beige", value: "#D4C5B9" },
  ];

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

  const handleColorClick = (colorName: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedColor.toLowerCase() === colorName.toLowerCase()) {
      newParams.delete("color");
    } else {
      newParams.set("color", colorName.toLowerCase());
    }
    setSearchParams(newParams);
  };

  const handlePriceChange = (val: number[]) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("price", `${val[0]}-${val[1]}`);
    setSearchParams(newParams);
  };

  const handleGenderToggle = () => {
    const newParams = new URLSearchParams(searchParams);
    if (isAccessories) {
      newParams.set("gender", "women");
      newParams.delete("category");
    } else {
      newParams.set("gender", "accessories");
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedSize ||
    selectedColor ||
    priceRange[0] > 0 ||
    priceRange[1] < 500 ||
    selectedCategory;

  const content = (
    <div className={isMobile ? "" : "w-64 pr-8 border-r border-neutral-200/60"}>
      {/* Mobile: Header + Clear */}
      {isMobile && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200/60">
          <h2 className="text-sm font-extrabold tracking-[0.2em] uppercase">
            FILTERS
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[9px] font-bold tracking-[0.15em] text-neutral-400 border-b border-neutral-300 pb-0.5 hover:text-neutral-900 transition-colors bg-transparent border-none cursor-pointer"
            >
              RESET ALL
            </button>
          )}
        </div>
      )}


      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-xs font-extrabold tracking-[0.15em] text-neutral-800 mb-4 uppercase">
          SUB CATEGORIES
        </h3>
        <div className="space-y-2.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`block w-full text-left py-1 text-xs font-bold tracking-wider transition-colors uppercase bg-transparent border-none cursor-pointer ${
                selectedCategory === category
                  ? "text-[#030213] font-extrabold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <Separator className="my-6 bg-neutral-200/60 h-px" />

      {/* Sizes */}
      <div className="mb-8">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 mb-4 uppercase">
          SIZE
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeClick(size)}
              className={`border text-[10px] font-bold py-2.5 rounded-sm transition-all text-center uppercase cursor-pointer ${
                selectedSize === size
                  ? "bg-[#030213] text-white border-neutral-900"
                  : "bg-white text-neutral-750 border-neutral-200/60 hover:border-neutral-900"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Separator className="my-6 bg-neutral-200/60 h-px" />

      {/* Colors */}
      <div className="mb-8">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 mb-4 uppercase">
          COLOR
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorClick(color.name)}
              className={`w-8 h-8 rounded-full border border-neutral-200 p-0.5 transition-all hover:scale-105 bg-transparent cursor-pointer ${
                selectedColor.toLowerCase() === color.name.toLowerCase()
                  ? "ring-2 ring-neutral-900 ring-offset-2 scale-105"
                  : ""
              }`}
              title={color.name}
            >
              <div
                className="w-full h-full rounded-full border border-neutral-200/20"
                style={{ backgroundColor: color.value }}
              />
            </button>
          ))}
        </div>
      </div>

      <Separator className="my-6 bg-neutral-200/60 h-px" />

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 mb-4 uppercase">
          PRICE RANGE
        </h3>
        <div className="px-1 py-3">
          <Slider
            min={0}
            max={500}
            step={10}
            defaultValue={[0, 500]}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="w-full cursor-pointer accent-[#030213]"
          />
        </div>
        <div className="flex justify-between items-baseline mt-3 text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  return content;
}
