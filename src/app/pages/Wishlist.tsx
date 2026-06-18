import { useState } from "react";
import { Link } from "react-router";
import { Search, ShoppingBag, Heart, Trash2, Share2, HelpCircle } from "lucide-react";

interface WishlistItem {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: string;
}

export function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 1,
        brand: "CONCRETE CULTURE",
        name: "Reflective Utility Sling",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: 2,
        brand: "CONCRETE CULTURE",
        name: "Italian Leather Cardholder",
        price: 75.00,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600"
      }
    ];
  });

  const removeItem = (id: number) => {
    setWishlistItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem("wishlist", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const addToCart = (item: WishlistItem) => {
    alert(`Added "${item.name}" to cart!`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 ">
      {/* Header */}
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-200">
          <Heart className="h-6 w-6 stroke-[1.5] fill-neutral-900" />
          <h1 className="text-2xl font-extrabold tracking-[0.1em] uppercase">
            MY WISHLIST
          </h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-100 p-16 text-center shadow-[0_4px_24px_rgba(0,0,0,0.01)] max-w-lg mx-auto mt-12">
            <Heart className="h-12 w-12 mx-auto text-neutral-300 stroke-[1.2] mb-4" />
            <h2 className="text-base font-bold mb-2">YOUR WISHLIST IS EMPTY</h2>
            <p className="text-xs text-neutral-450 leading-relaxed mb-8">
              Explore our boutique collection and save your favorite items for later.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#030213] text-white px-8 py-3.5 rounded-md text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg"
            >
              GO SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map(item => (
              <div key={item.id} className="group cursor-pointer bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] p-4 ">
                <div>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 mb-4 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-4 right-4 bg-white/95 text-neutral-800 p-2 rounded-full hover:bg-red-50 hover:text-red-500 shadow-sm transition-colors"
                    >
                      <Trash2 className="h-4 w-4 stroke-[1.5]" />
                    </button>
                  </div>
                  <span className="text-[9px] font-bold tracking-widest text-[#b2533e] uppercase">{item.brand}</span>
                  <h3 className="text-sm font-bold tracking-tight mb-1 mt-0.5 text-neutral-900 line-clamp-1">{item.name}</h3>
                  <p className="text-xs font-semibold text-neutral-500 mb-4">₹{item.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-[#030213] text-white py-3 rounded-md text-[10px] font-bold tracking-[0.15em] hover:bg-neutral-800 transition-colors shadow-md uppercase"
                >
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      
    </div>
  );
}
