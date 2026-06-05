import { useState } from "react";
import { Star, ShieldCheck, Truck, RefreshCw, Lock, ArrowRight, Layers, Eye, Shield, ChevronLeft, ChevronRight } from "lucide-react";

interface ColorOption {
  name: string;
  value: string;
  class: string;
}

export function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState("MONOLITH BLACK");
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "shipping" | "reviews">("description");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productImages = [
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.3&fp-y=0.35&z=2.2", // Beanie & Collar Detail
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.3&fp-y=0.65&z=2.0", // Chest & Utility Pockets Detail
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.35&fp-y=0.78&z=1.8" // Reinforced Seams Detail
  ];

  const colors: ColorOption[] = [
    { name: "MONOLITH BLACK", value: "#1A1A1A", class: "bg-[#1A1A1A]" },
    { name: "STEALTH GRAY", value: "#4A4D50", class: "bg-[#4A4D50]" },
    { name: "SANDSTONE", value: "#D2C9BD", class: "bg-[#D2C9BD]" },
  ];

  const sizes = ["S", "M", "L", "XL"];

  const handleAddToBag = () => {
    alert("Added Structure Tactical Layer to bag!");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200">
      
      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Product Image Column (Left) */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails list */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-none">
              {productImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-20 md:w-20 md:h-24 bg-neutral-100 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    currentImageIndex === index
                      ? "border-[#030213] scale-[1.02] shadow-sm"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image Viewport with Nav Arrows */}
            <div className="relative flex-1 bg-neutral-100 rounded-xl overflow-hidden aspect-[3/4] group">
              <img
                src={productImages[currentImageIndex]}
                alt="Structure Tactical Layer"
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Prev Button */}
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? productImages.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#030213] flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === productImages.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-[#030213] flex items-center justify-center shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
              </button>

              {/* Dots indicator for mobile */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      currentImageIndex === index ? "bg-[#030213] w-3" : "bg-neutral-450/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Actions Column (Right) */}
          <div className="lg:col-span-6 space-y-8 lg:pl-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#b2533e] uppercase">
                ARCHITECTURAL PRECISION SERIES
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mt-2 mb-4 leading-none">
                STRUCTURE<br />TACTICAL LAYER
              </h1>
              
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold">£485.00</span>
                <div className="flex items-center gap-1 text-neutral-800">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current stroke-current" />
                  ))}
                  <span className="text-[10px] font-bold tracking-wider text-neutral-450 ml-1">(24 REVIEWS)</span>
                </div>
              </div>
            </div>

            <p className="text-neutral-500 text-sm leading-relaxed max-w-lg">
              A monolithic aesthetic defined by a precision-engineered silhouette. The Structure Tactical Layer is designed as a foundational piece for the modern architectural wardrobe, balancing technical rigidity with refined comfort.
            </p>

            {/* Color Selector */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 mb-3">
                COLOR: {selectedColor}
              </p>
              <div className="flex gap-3">
                {colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border border-neutral-200 p-0.5 transition-transform ${
                      selectedColor === color.name ? "ring-2 ring-neutral-900 ring-offset-2 scale-105" : ""
                    }`}
                  >
                    <div className={`w-full h-full rounded-full ${color.class}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-baseline mb-3 max-w-sm">
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400">SIZE</span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[9px] font-bold tracking-[0.15em] text-neutral-450 border-b border-neutral-300 pb-0.5 hover:text-neutral-950 transition-colors"
                >
                  SIZE GUIDE
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 max-w-sm">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border text-[10px] font-bold py-3.5 rounded-sm transition-colors text-center ${
                      selectedSize === size
                        ? "bg-[#030213] text-white border-neutral-900"
                        : "bg-white text-neutral-700 border-neutral-200/60 hover:border-neutral-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 max-w-md">
              <button
                onClick={handleAddToBag}
                className="w-full bg-[#030213] text-white py-4 rounded-md text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg"
              >
                ADD TO BAG
              </button>
              <button className="w-full text-center text-xs font-bold tracking-[0.2em] py-3.5 hover:opacity-75 transition-opacity border-b border-neutral-900 max-w-max mx-auto block">
                Buy Now
              </button>
            </div>

            {/* Bullet Highlights */}
            <div className="space-y-4 pt-6 border-t border-neutral-200/60 text-[10px] font-bold tracking-[0.15em] text-neutral-700 uppercase">
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 stroke-[1.5] text-neutral-500" />
                <span>REINFORCED STRUCTURAL SEAMS</span>
              </div>
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 stroke-[1.5] text-neutral-500" />
                <span>ANODIZED HARDWARE</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 stroke-[1.5] text-neutral-500" />
                <span>MODULAR LOAD-BEARING SYSTEM</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Breakdown and Specs Section */}
      <section className="bg-white border-y border-neutral-200/60 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 border-b border-neutral-150 pb-4 mb-8 text-[10px] font-bold tracking-[0.2em] text-neutral-400">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-2 ${activeTab === "description" ? "text-neutral-900 border-b-2 border-neutral-900" : ""}`}
            >
              DESCRIPTION
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`pb-2 ${activeTab === "specifications" ? "text-neutral-900 border-b-2 border-neutral-900" : ""}`}
            >
              SPECIFICATIONS
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-2 ${activeTab === "shipping" ? "text-neutral-900 border-b-2 border-neutral-900" : ""}`}
            >
              SHIPPING & RETURNS
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Description/Tab content */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-xl font-extrabold tracking-[0.1em] uppercase">
                ARCHITECTURAL BREAKDOWN
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-2xl">
                The Structure Tactical Layer represents a shift toward pure architectural form in apparel. Constructed from a triple-layered GORE-TEX nylon blend, it offers a monolithic aesthetic that provides absolute protection from the elements while maintaining a sleek, structured profile.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <h4 className="text-[10px] font-bold tracking-widest text-[#b2533e] mb-2 uppercase">CONSTRUCTION</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">Reinforced structural seams. Anodized hardware components.</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-widest text-[#b2533e] mb-2 uppercase">DIMENSIONS</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">20,000mm Hydrostatic head. Precision-molded modular attachment points.</p>
                </div>
              </div>
            </div>

            {/* In the box card */}
            <div className="lg:col-span-4 bg-[#FAF8F5] border border-neutral-200/60 rounded-xl p-6">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 mb-4 uppercase">
                IN THE BOX
              </h3>
              <ul className="space-y-3 text-xs font-semibold text-neutral-800">
                <li className="flex justify-between">
                  <span>Vanguard Vest</span>
                  <span className="text-neutral-400">x1</span>
                </li>
                <li className="flex justify-between">
                  <span>Standard Pouches</span>
                  <span className="text-neutral-400">x4</span>
                </li>
                <li className="flex justify-between">
                  <span>Large Utility Pouch</span>
                  <span className="text-neutral-400">x2</span>
                </li>
                <li className="flex justify-between">
                  <span>Carry Tote</span>
                  <span className="text-neutral-400">x1</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Bought Together */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-b border-neutral-200/60">
        <h2 className="text-center text-sm font-extrabold tracking-[0.25em] mb-12 uppercase">
          FREQUENTLY BOUGHT TOGETHER
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 max-w-4xl mx-auto bg-white border border-neutral-100 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
          {/* Images assembly */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-24 bg-neutral-100 rounded overflow-hidden">
              <img src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=150" alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-neutral-400 font-bold text-sm">+</span>
            <div className="w-20 h-24 bg-neutral-100 rounded overflow-hidden">
              <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=150" alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-neutral-400 font-bold text-sm">+</span>
            <div className="w-20 h-24 bg-neutral-100 rounded overflow-hidden">
              <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=150" alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Pricing Info */}
          <div className="text-center md:text-left flex flex-col md:flex-row items-center gap-6">
            <div>
              <p className="text-[9px] font-bold tracking-widest text-neutral-400">BUNDLE PRICE</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">£820.00</span>
                <span className="text-xs text-neutral-400 line-through">£916.00</span>
              </div>
            </div>
            <button className="bg-[#030213] text-white px-8 py-3.5 rounded text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors uppercase">
              ADD BUNDLE TO BAG
            </button>
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-center text-sm font-extrabold tracking-[0.25em] mb-12 uppercase">
          YOU MAY ALSO LIKE
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=400" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-xs font-bold tracking-tight mb-1 text-neutral-900 uppercase">APEX SHELL JACKET</h3>
            <p className="text-xs text-neutral-500">£320</p>
          </div>
          {/* Card 2 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=400" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-xs font-bold tracking-tight mb-1 text-neutral-900 uppercase">URBAN COMBAT BOOT</h3>
            <p className="text-xs text-neutral-500">£350</p>
          </div>
          {/* Card 3 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-xs font-bold tracking-tight mb-1 text-neutral-900 uppercase">CORE HEAVYWEIGHT HOODIE</h3>
            <p className="text-xs text-neutral-500">£180</p>
          </div>
          {/* Card 4 */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden mb-4">
              <img src="https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=400" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="text-xs font-bold tracking-tight mb-1 text-neutral-900 uppercase">MODULAR SLING BAG</h3>
            <p className="text-xs text-neutral-500">£210</p>
          </div>
        </div>
      </section>

      {/* Trust Badges Grid */}
      <section className="bg-white border-y border-neutral-200/60 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-xs font-bold tracking-[0.2em] text-neutral-700">
            <div className="space-y-3">
              <Star className="mx-auto h-6 w-6 stroke-[1.5] text-neutral-800" />
              <p>PREMIUM QUALITY</p>
            </div>
            <div className="space-y-3">
              <Truck className="mx-auto h-6 w-6 stroke-[1.5] text-neutral-800" />
              <p>FAST DELIVERY</p>
            </div>
            <div className="space-y-3">
              <RefreshCw className="mx-auto h-6 w-6 stroke-[1.5] text-neutral-800" />
              <p>EASY RETURNS</p>
            </div>
            <div className="space-y-3">
              <Lock className="mx-auto h-6 w-6 stroke-[1.5] text-neutral-800" />
              <p>SECURE PAYMENTS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Community */}
      <section className="bg-black text-white py-24 text-center">
        <div className="max-w-xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-extrabold tracking-[0.1em] uppercase text-white font-sans">
            JOIN THE DRIP COMMUNITY
          </h2>
          <p className="text-xs text-neutral-450 tracking-widest uppercase">
            Early access, exclusive drops, and culture updates.
          </p>
          <div className="flex gap-4 max-w-md mx-auto items-center border-b border-neutral-700 pb-2 pt-4">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="bg-transparent border-none text-xs tracking-wider focus:outline-none flex-1 placeholder-neutral-500 uppercase"
            />
            <button className="text-xs font-bold tracking-[0.2em] text-white hover:opacity-75 transition-opacity">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
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
              Find the perfect fit for your companion with our measurements breakdown.
            </p>

            <div className="overflow-x-auto border border-neutral-200/60 rounded-lg bg-white">
              <table className="w-full text-left border-collapse text-xs font-semibold text-neutral-800">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold tracking-widest text-neutral-400">
                    <th className="py-4 px-6">SIZE</th>
                    <th className="py-4 px-6">CHEST (INCHES)</th>
                    <th className="py-4 px-6">LENGTH (INCHES)</th>
                    <th className="py-4 px-6">NECK (INCHES)</th>
                    <th className="py-4 px-6">SUGGESTED WEIGHT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr className="hover:bg-neutral-50/50">
                    <td className="py-4 px-6 font-bold">S</td>
                    <td className="py-4 px-6">16" - 20"</td>
                    <td className="py-4 px-6">12"</td>
                    <td className="py-4 px-6">10" - 12"</td>
                    <td className="py-4 px-6 text-[#b2533e]">10 - 18 lbs</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/50">
                    <td className="py-4 px-6 font-bold">M</td>
                    <td className="py-4 px-6">20" - 24"</td>
                    <td className="py-4 px-6">16"</td>
                    <td className="py-4 px-6">12" - 14"</td>
                    <td className="py-4 px-6 text-[#b2533e]">18 - 28 lbs</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/50">
                    <td className="py-4 px-6 font-bold">L</td>
                    <td className="py-4 px-6">24" - 28"</td>
                    <td className="py-4 px-6">20"</td>
                    <td className="py-4 px-6">14" - 16"</td>
                    <td className="py-4 px-6 text-[#b2533e]">28 - 45 lbs</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/50">
                    <td className="py-4 px-6 font-bold">XL</td>
                    <td className="py-4 px-6">28" - 34"</td>
                    <td className="py-4 px-6">24"</td>
                    <td className="py-4 px-6">16" - 19"</td>
                    <td className="py-4 px-6 text-[#b2533e]">45 - 75 lbs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-neutral-50 rounded-lg p-4 text-[10px] font-bold tracking-wide text-neutral-500 uppercase leading-relaxed">
              * Note: For the most accurate fit, we recommend measuring your dog's chest at the widest point behind the front legs. If between sizes, choose the larger option.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
