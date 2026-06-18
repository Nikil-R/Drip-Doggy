import { useEffect } from "react";
import { Hero } from "../components/Hero";
import { Categories } from "../components/Categories";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { Newsletter } from "../components/Newsletter";
import { Footer } from "../components/Footer";

export function Home() {
  useEffect(() => {
    // Initial scroll snap setup
    document.documentElement.style.scrollSnapType = "y mandatory";
    document.documentElement.style.scrollBehavior = "smooth";

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Temporarily disable scroll-snap to allow free-scrolling in the footer zone
          document.documentElement.style.scrollSnapType = "none";
        } else {
          // Re-enable scroll snap when the footer zone is out of view
          document.documentElement.style.scrollSnapType = "y mandatory";
        }
      },
      {
        threshold: 0.02, // Trigger early when the top of the footer zone enters the viewport
      }
    );

    const target = document.getElementById("non-snapping-footer-zone");
    if (target) {
      observer.observe(target);
    }

    return () => {
      document.documentElement.style.scrollSnapType = "";
      document.documentElement.style.scrollBehavior = "";
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <div id="non-snapping-footer-zone">
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
