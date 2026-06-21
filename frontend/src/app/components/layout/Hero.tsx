import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";

const SLIDES = [
  {
    tagline: "TACTICAL SILHOUETTES",
    title: "SS26 WOMEN'S COLLECTION",
    description: "Engineered for the urban frontier. Utility meets attitude.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop",
  },
  {
    tagline: "DRIP DOGGY APPAREL",
    title: "HIGH-END DRIP FOR THE BOLD",
    description: "Precision-crafted streetwear for those who demand more. Every stitch, a statement.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
  },
  {
    tagline: "THE ARCHIVE SERIES",
    title: "UNCOMPROMISED LUXURY",
    description: "Rebels make the rules. Redefining luxury, one drop at a time.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  const { scrollY } = useScroll();
  const bgParallaxY = useTransform(scrollY, [0, 600], [0, 120]);
  const overlayParallax = useTransform(scrollY, [0, 600], [0.45, 0.6]);
  const contentParallaxY = useTransform(scrollY, [0, 600], [0, -60]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        setFade(true);
      }, 600);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen lg:h-screen overflow-hidden pt-[73px] lg:pt-[81px]"
    >
      {/* Background Slides with parallax */}
      {SLIDES.map((slide, index) => (
        <motion.div
          key={index}
          style={{ y: index === currentSlide ? bgParallaxY : undefined }}
          className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${
            index === currentSlide ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover scale-110"
          />
        </motion.div>
      ))}

      {/* Overlay with parallax darken */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ background: useTransform(overlayParallax, (v) => `rgba(0,0,0,${v})`) }}
      />

      {/* Content with parallax fade-out */}
      <motion.div
        className="relative container mx-auto px-6 h-full flex items-center z-10"
        style={{ y: contentParallaxY, opacity: contentOpacity }}
      >
        <div className="max-w-xl text-white">
          <div
            className={`transition-all duration-[600ms] ease-out transform ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/70 uppercase block mb-4">
              {SLIDES[currentSlide].tagline}
            </span>
            <h1 className="text-5xl lg:text-7xl mb-4 font-extrabold tracking-tight">
              {SLIDES[currentSlide].title}
            </h1>
            <p className="text-sm lg:text-base text-white/60 font-medium tracking-wide mb-8 max-w-md leading-relaxed">
              {SLIDES[currentSlide].description}
            </p>
            <Link
              to="/shop"
              className="inline-block bg-white text-[#030213] hover:bg-white/90 px-8 py-3.5 text-xs font-extrabold tracking-[0.2em] uppercase transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-6 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setFade(false);
              setTimeout(() => {
                setCurrentSlide(i);
                setFade(true);
              }, 600);
            }}
            className={`w-6 h-[2px] transition-all duration-300 cursor-pointer bg-transparent border-none ${
              i === currentSlide ? "bg-white" : "bg-white/25 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
