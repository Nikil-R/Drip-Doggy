import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { getHeroSlides } from "../../lib/content-store";

import axios from "axios";
import { API_CONFIG } from "@/app/utils/api-config";

export function Hero() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  const { scrollY } = useScroll();
  const bgParallaxY = useTransform(scrollY, [0, 600], [0, 120]);
  const overlayParallax = useTransform(scrollY, [0, 600], [0.45, 0.6]);
  const contentParallaxY = useTransform(scrollY, [0, 600], [0, -60]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const bgOverlay = useTransform(overlayParallax, (v) => `rgba(0,0,0,${v})`);

  useEffect(() => {
    async function loadActiveBanners() {
      try {
        const url = `${API_CONFIG.BASE_URL}/dripdoggy/api/public/banners`;
        const res = await axios.get<any[]>(url);
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((b: any) => ({
            tagline: b.tagline || "NEW IN",
            title: b.title,
            description: b.description || "",
            image: b.imageUrl,
            ctaText: "Explore Collection",
            ctaLink: b.redirectTo || "/shop"
          }));
          setSlides(mapped);
        }
      } catch (err) {
        console.error("Failed to load public banners:", err);
      }
    }
    loadActiveBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 600);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const activeSlide = slides[currentSlide];

  return (
    <section
      id="hero"
      className="relative h-screen overflow-hidden"
    >
      {/* Background Slides with parallax */}
      {slides.map((slide, index) => (
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
        style={{ background: bgOverlay }}
      />

      {/* Content with parallax fade-out */}
      <motion.div
        className="relative container mx-auto px-6 h-full flex items-center justify-center sm:justify-start z-10"
        style={{ y: contentParallaxY, opacity: contentOpacity }}
      >
        <div className="max-w-xl text-white text-center sm:text-left">
          <div
            className={`transition-all duration-[600ms] ease-out transform ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.3em] text-white/70 uppercase block mb-3 sm:mb-4">
              {activeSlide.tagline}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl mb-3 sm:mb-4 font-extrabold tracking-tight uppercase leading-tight">
              {activeSlide.title}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-white/60 font-medium tracking-wide mb-6 sm:mb-8 max-w-md mx-auto sm:mx-0 leading-relaxed">
              {activeSlide.description}
            </p>
            <Link
              to={activeSlide.ctaLink || "/shop"}
              className="inline-block bg-white text-[#030213] hover:bg-white/90 px-6 sm:px-8 py-3 sm:py-3.5 text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase transition-colors"
            >
              {activeSlide.ctaText || "Explore Collection"}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-6 z-20 flex gap-2">
        {slides.map((_, i) => (
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
