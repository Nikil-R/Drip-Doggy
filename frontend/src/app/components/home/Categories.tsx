import { Link } from "react-router";
import { motion } from "motion/react";

const categories = [
  {
    title: "Women's Collection",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    description: "Utility layers & draped silhouettes",
    route: "/shop?gender=women",
    comingSoon: false,
  },
  {
    title: "Men's Syndicate",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800",
    description: "Upcoming menswear capsule",
    route: "/coming-soon",
    comingSoon: true,
    comingSeason: "FW26",
  },
];

export function Categories() {
  return (
    <section id="categories" className="pt-16 pb-8 lg:pt-20 lg:pb-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <span className="text-[8px] font-extrabold tracking-[0.25em] text-[#b2533e] uppercase block mb-2">
            Shop by Category
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#030213] uppercase">
            Curatorial Categories
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
            <Link
              to={category.route}
              className="group relative overflow-hidden min-h-[420px] lg:min-h-[500px] block"
            >
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  category.comingSoon
                    ? "bg-black/50 group-hover:bg-black/60"
                    : "bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                }`}
              />

              {/* Coming Soon Badge */}
              {category.comingSoon && (
                <div className="absolute top-6 right-6 border border-white/20 px-3 py-1.5">
                  <span className="text-white/60 text-[8px] font-extrabold tracking-[0.25em] uppercase">
                    COMING SOON // {category.comingSeason}
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl lg:text-2xl font-extrabold tracking-tight mb-1 uppercase">
                  {category.title}
                </h3>
                <p className="text-white/70 text-xs font-medium tracking-wide">
                  {category.description}
                </p>
              </div>
            </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
