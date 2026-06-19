import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../ui/ImageWithFallback";
import { Link } from "react-router";
import { Heart, ShoppingCart } from "lucide-react";



const products = [
  {
    id: 1,
    name: "Elegant Summer Dress",
    price: 129.99,
    originalPrice: 179.99,
    images: [
      "https://images.unsplash.com/photo-1542295669297-4d352b042bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHN1bW1lciUyMGRyZXNzfGVufDF8fHx8MTc4MDU5MzM0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600"
    ],
    badge: "Sale",
    rating: 4.5
  },
  {
    id: 2,
    name: "Classic Formal Suit",
    price: 349.99,
    images: [
      "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBmb3JtYWwlMjBjbG90aGluZ3xlbnwxfHx8fDE3ODA1OTMzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600"
    ],
    badge: "New",
    rating: 5
  },
  {
    id: 3,
    name: "Designer Handbag",
    price: 199.99,
    images: [
      "https://images.unsplash.com/photo-1705909237050-7a7625b47fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZHklMjBhY2Nlc3NvcmllcyUyMGhhbmRiYWd8ZW58MXx8fHwxNzgwNTkzMzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600"
    ],
    badge: "Trending",
    rating: 4.8
  },
  {
    id: 4,
    name: "Streetwear Collection",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1624353656309-8be1a6c457be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzdHJlZXR3ZWFyJTIwZmFzaGlvbnxlbnwxfHx8fDE3ODA1OTMzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=600"
    ],
    rating: 4.2
  }
];

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  badge?: string;
  rating: number;
}

function ProductCard({ product }: { product: Product }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && product.images.length > 1) {
      interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentImgIndex((prev) => (prev + 1) % product.images.length);
          setFade(true);
        }, 250); // Fade duration
      }, 3000); // Cycle every 3 seconds
    } else {
      setCurrentImgIndex(0);
      setFade(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, product.images]);

  return (
    <Link
      to={`/product/${product.id}`}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden border border-neutral-100 hover:shadow-lg transition-all duration-300 rounded-lg bg-white">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <ImageWithFallback
            src={product.images[currentImgIndex]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 transform ${
              isHovered ? "scale-105" : "scale-100"
            } ${fade ? "opacity-100" : "opacity-0"}`}
          />
          {product.badge && (
            <Badge
              className="absolute top-3 left-3 bg-black text-white hover:bg-black font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5"
              variant={product.badge === "Sale" ? "destructive" : "default"}
            >
              {product.badge}
            </Badge>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm"
          >
            <Heart className="h-4 w-4 text-neutral-600 hover:text-black" />
          </Button>
        </div>

        <div className="p-3.5">
          <h3 className="text-sm font-semibold tracking-wide mb-1 text-neutral-900 group-hover:text-black line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-amber-500 text-xs">
                {i < Math.floor(product.rating) ? "★" : "☆"}
              </span>
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">
              ({product.rating})
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-base font-bold text-neutral-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through ml-2">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <Button size="sm" className="h-8 text-xs px-3 bg-black text-white hover:bg-neutral-850 font-medium">
              <ShoppingCart className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function FeaturedProducts() {
  return (
    <section className="snap-start snap-always min-h-screen pt-6 pb-16 lg:pt-8 lg:pb-20 flex flex-col justify-center bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-3xl lg:text-4xl mb-2 font-extrabold tracking-tight">Featured Products</h2>
          <p className="text-muted-foreground text-sm lg:text-base">
            Handpicked items just for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-6 lg:mt-8 pb-6 lg:pb-12">
          <Link to="/shop">
            <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-bold uppercase tracking-wider text-xs px-8">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}










