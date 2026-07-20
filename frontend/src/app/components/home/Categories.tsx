import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { getHomeCategories } from "../../lib/content-store";
import { useAuth } from "../../context/AuthContext";

import axios from "axios";
import { API_CONFIG } from "@/app/utils/api-config";

const DEFAULT_CATEGORIES = [
  {
    title: "Women's Collection",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    description: "Utility layers & draped silhouettes",
    route: "/shop?gender=women",
    comingSoon: false,
    comingSeason: "",
    active: true
  },
  {
    title: "Men's Syndicate",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800",
    description: "Upcoming menswear capsule",
    route: "/coming-soon",
    comingSoon: true,
    comingSeason: "FW26",
    active: true,
    hideBadge: true // Custom flag to hide the tag badge
  },
];

export function Categories() {
  const { isAuthenticated } = useAuth();
  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    async function loadPublicCategories() {
      try {
        const url = `${API_CONFIG.BASE_URL}/dripdoggy/api/public/home-categories`;
        const res = await axios.get<any[]>(url);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((c: any) => {
            let sanitizedRoute = (c.route || "/shop").trim();
            if (!sanitizedRoute.startsWith("/") && !sanitizedRoute.startsWith("http")) {
              sanitizedRoute = `/${sanitizedRoute}`;
            }
            return {
              title: c.title,
              image: c.imageUrl,
              description: c.description || "",
              route: sanitizedRoute,
              comingSoon: !!c.comingSoon,
              comingSeason: c.comingSeason || "",
              active: c.isActive
            };
          });
          setCategoriesList(mapped);
        }
      } catch (err) {
        console.error("Failed to load public home categories:", err);
      }
    }
    loadPublicCategories();
  }, [isAuthenticated]);

  return (
    <section id="categories" className="pt-8 pb-8 lg:pt-20 lg:pb-10 bg-white">
      <div className="max-w-7xl mx-auto px-6 ">
        <div className="mb-10">
          <span className="text-[8px] font-extrabold tracking-[0.25em] text-[#b2533e] uppercase block mb-2">
            Shop by Category
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#030213] uppercase">
            Curatorial Categories
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {categoriesList.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={category.route}
                className="group relative overflow-hidden min-h-[220px] sm:min-h-[420px] lg:min-h-[500px] block"
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
                {category.comingSoon && !(category as any).hideBadge && (
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 border border-white/20 px-2 sm:px-3 py-1 sm:py-1.5 z-10 bg-[#382d24]/40 backdrop-blur-xs">
                    <span className="text-white text-[6px] sm:text-[8px] font-extrabold tracking-[0.25em] uppercase">
                      COMING SOON // {category.comingSeason || "FW26"}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white z-10">
                  <h3 className="text-xs sm:text-xl lg:text-2xl font-extrabold tracking-tight mb-1 uppercase">
                    {category.title}
                  </h3>
                  <p className="text-white/70 text-[9px] sm:text-xs font-medium tracking-wide">
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
