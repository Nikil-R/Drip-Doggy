import { useState, useEffect } from "react";
import { Link } from "react-router";

interface CuratedCollectionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  order: number;
  active: boolean;
}

const STORAGE_KEY = "dd_content_collections";

const DEFAULT_COLLECTIONS: CuratedCollectionItem[] = [
  {
    id: "col-1",
    title: "SS26 New Arrivals",
    description: "Fresh drops from the latest capsule — precision cuts and architectural silhouettes.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop",
    link: "/shop",
    order: 0,
    active: true,
  },
  {
    id: "col-2",
    title: "DripDoggy Best Sellers",
    description: "Most-loved pieces by our community — season after season.",
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&h=400&fit=crop",
    link: "/shop",
    order: 1,
    active: true,
  },
  {
    id: "col-3",
    title: "Signature Outerwear",
    description: "Canvas jackets & moto coats — the cornerstone of the DripDoggy archive.",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=400&fit=crop",
    link: "/shop",
    order: 2,
    active: true,
  },
];

function loadCollections(): CuratedCollectionItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: CuratedCollectionItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_COLLECTIONS;
}

export function CuratedCollections() {
  const [collections, setCollections] = useState<CuratedCollectionItem[]>(loadCollections);

  useEffect(() => {
    const handleChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail?.key || detail.key === STORAGE_KEY) {
        setCollections(loadCollections());
      }
    };
    window.addEventListener("dd-content-changed", handleChange);
    window.addEventListener("storage", () => setCollections(loadCollections()));
    return () => {
      window.removeEventListener("dd-content-changed", handleChange);
      window.removeEventListener("storage", () => setCollections(loadCollections()));
    };
  }, []);

  const activeCollections = [...collections]
    .filter(c => c.active)
    .sort((a, b) => a.order - b.order);

  if (activeCollections.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-8 py-16">
      <h2 className="text-center mb-12">CURATED FOR YOU</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCollections.map((collection) => {
          const Inner = (
            <div
              className="relative aspect-[3/2] overflow-hidden group cursor-pointer"
            >
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="mb-1 text-white text-sm font-extrabold uppercase tracking-[0.15em]">
                  {collection.title}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed line-clamp-2">
                  {collection.description}
                </p>
              </div>
            </div>
          );

          return collection.link ? (
            <Link key={collection.id} to={collection.link} className="block">
              {Inner}
            </Link>
          ) : (
            <div key={collection.id}>
              {Inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
