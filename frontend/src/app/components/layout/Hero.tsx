import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { Link } from "react-router";


const SLIDES = [
  {
    tagline: "DRIP DOGGY APPAREL",
    title: "High-End Drip For The Bold",
    description: "Discover avant-garde streetwear designed to make a statement. Unmatched comfort, structured silhouettes, and premium fabrics.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
  },
  {
    tagline: "AVANT-GARDE STREETWEAR",
    title: "Sculpted Outerwear & Utility Designs",
    description: "Explore our latest capsule featuring technical fabrications, oversized drop shoulders, and monochromatic layering.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop",
  },
  {
    tagline: "THE ARCHIVE SERIES",
    title: "Uncompromised Luxury For The Bold",
    description: "Crafted from heavyweight French terry and custom-milled organic cotton. Engineered for comfort, designed for the street.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    tagline: "NEW DROP / SEASON 01",
    title: "Minimalist Aesthetics, Maximal Impact",
    description: "Draping details, premium knitwear, and architectural tailoring defining the new era of luxury streetwear.",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1600&auto=format&fit=crop",
  },
  {
    tagline: "EDITORIAL EXCLUSIVE",
    title: "Reimagined Tailoring & Modern Silhouettes",
    description: "Bold cuts meet ultimate refinement. Stand out in custom silhouettes curated for fashion-forward wardrobes.",
    image: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1600&auto=format&fit=crop",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        setFade(true);
      }, 500); // Match fade-out duration
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen lg:h-screen overflow-hidden snap-start snap-always pt-[73px] lg:pt-[81px]">
      {/* Background Slides with Crossfade */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <ImageWithFallback
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45 z-0" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center z-10">
        <div className="max-w-2xl text-white">
          <div
            className={`transition-all duration-500 ease-out transform ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#FAF8F5]/85 uppercase block mb-3">
              {SLIDES[currentSlide].tagline}
            </span>
            <h1 className="text-5xl lg:text-7xl mb-6 font-extrabold tracking-tight">
              {SLIDES[currentSlide].title}
            </h1>
            <p className="text-lg lg:text-xl mb-8 text-white/90 leading-relaxed font-light">
              {SLIDES[currentSlide].description}
            </p>
          </div>

          {/* Static Buttons */}
          <div className="flex flex-wrap gap-4 items-center">
            <Link to="/shop">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold tracking-wider px-8 py-3.5 uppercase text-xs">
                Explore Collection
              </Button>
            </Link>
            <Link to="/coming-soon">
              <Button size="lg" className="border border-white text-white bg-transparent hover:bg-white hover:text-black font-bold tracking-wider px-8 py-3.5 uppercase text-xs">
                Accessories (Soon)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}



