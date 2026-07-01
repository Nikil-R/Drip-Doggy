import { Link } from "react-router";

export function CollectionStory() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="aspect-[4/3] lg:aspect-auto lg:h-[520px] overflow-hidden bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop"
              alt="SS26 Collection"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Copy */}
          <div className="max-w-md">
            <span className="text-[8px] font-extrabold tracking-[0.25em] text-[#b2533e] uppercase block mb-3">
              The Current Drop
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#030213] uppercase mb-5 leading-tight">
              SS26 Women&apos;s Capsule
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-8 font-medium">
              Architectural silhouettes meet utility-driven design. The new season explores precision-molded
              panels, differential ribbing, and reinforced structural seams — redefining luxury streetwear
              through the lens of womenswear.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#030213] hover:bg-neutral-800 text-white px-8 py-3.5 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-colors"
            >
              Explore the Capsule
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
