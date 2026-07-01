import { Hero } from "../components/layout/Hero";
import { Categories } from "../components/home/Categories";
import { SignaturePieces } from "../components/home/SignaturePieces";
import { FeaturedProducts } from "../components/home/FeaturedProducts";
import { Footer } from "../components/layout/Footer";

export function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <SignaturePieces />
      <FeaturedProducts />
      <Footer />
    </main>
  );
}
