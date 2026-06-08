import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router";
import heroRack from "../../imports/hero_rack.jpg";

export function Hero() {
  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      <ImageWithFallback
        src={heroRack}
        alt="High-end premium fashion streetwear boutique rack"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#FAF8F5]/85 uppercase block mb-3">
            DRIP DOGGY APPAREL
          </span>
          <h1 className="text-5xl lg:text-7xl mb-6 font-extrabold tracking-tight">
            High-End Drip For Modern Women
          </h1>
          <p className="text-lg lg:text-xl mb-8 text-white/90 leading-relaxed font-light">
            Discover avant-garde women's streetwear designed to make a statement. Unmatched comfort, structured silhouettes, and premium fabrics.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link to="/shop">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold tracking-wider px-8 py-3.5 uppercase text-xs">
                Explore Women's Drop
              </Button>
            </Link>
            <Link to="/coming-soon">
              <Button size="lg" className="border border-white text-white bg-transparent hover:bg-white hover:text-black font-bold tracking-wider px-8 py-3.5 uppercase text-xs">
                Men's Syndicate (Soon)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
