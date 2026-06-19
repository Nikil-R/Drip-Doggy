import { ImageWithFallback } from "../ui/ImageWithFallback";
import { Link } from "react-router";

import menSuit from "../../../assets/men_suit.png";

const categories = [
  {
    title: "Women's Collection",
    image: "https://images.unsplash.com/photo-1542295669297-4d352b042bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHN1bW1lciUyMGRyZXNzfGVufDF8fHx8MTc4MDU5MzM0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Sleek apparel & structured outer layers",
    route: "/shop"
  },
  {
    title: "Men's Archive",
    image: menSuit,
    description: "Unreleased premium menswear (Soon)",
    route: "/coming-soon"
  },
  {
    title: "Gear & Accs",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
    description: "Capsule bags, caps & streetwear detail",
    route: "/coming-soon"
  }
];

export function Categories() {
  return (
    <section className="snap-start snap-always min-h-screen py-10 lg:py-14 flex flex-col justify-center bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl mb-3 font-extrabold tracking-tight">Shop by Category</h2>
          <p className="text-muted-foreground text-sm lg:text-base">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {categories.map((category) => (
            <Link
              key={category.title}
              to={category.route}
              className="group relative overflow-hidden rounded-lg h-[46vh] max-h-[380px] w-full block"
            >
              <ImageWithFallback
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl mb-1 font-bold tracking-wide">{category.title}</h3>
                <p className="text-white/80 text-sm">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}



