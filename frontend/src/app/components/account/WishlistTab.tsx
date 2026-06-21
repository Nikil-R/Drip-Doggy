import { Link } from "react-router";
import { Heart, Trash2 } from "lucide-react";
import type { WishlistItem } from "../../types/account";

interface WishlistTabProps {
  wishlistItems: WishlistItem[];
  onRemove: (id: number) => void;
  onAddToCart: (item: WishlistItem, e: React.MouseEvent) => void;
}

export function WishlistTab({ wishlistItems, onRemove, onAddToCart }: WishlistTabProps) {
  return (
    <div className="bg-white border border-neutral-200/80 p-8">
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-200 mb-8">
        <Heart className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
        <h1 className="text-lg font-extrabold tracking-[0.1em] uppercase">Wishlist</h1>
        {wishlistItems.length > 0 && (
          <span className="text-[8px] font-extrabold tracking-widest text-neutral-400 uppercase ml-auto">
            {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
          </span>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="py-16 text-center">
          <Heart className="h-12 w-12 mx-auto text-neutral-300 stroke-[1.2] mb-4" />
          <h2 className="text-sm font-extrabold tracking-[0.15em] uppercase mb-2">Your Wishlist is Empty</h2>
          <p className="text-[11px] text-neutral-500 font-medium mb-6">Save your favorite items for later.</p>
          <Link to="/shop"
            className="inline-block bg-[#030213] hover:bg-neutral-800 text-white px-8 py-3 text-[10px] font-extrabold tracking-[0.2em] uppercase transition-colors">
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {wishlistItems.map((item) => {
            const isOutOfStock = item.outOfStock;
            return (
              <Link key={item.id} to={`/product/${item.id}`}
                className="flex gap-4 border border-neutral-200 p-4 hover:border-[#030213]/40 transition-all duration-200 group relative cursor-pointer no-underline">
                {/* Image */}
                <div className="w-20 h-24 bg-neutral-100 border border-neutral-200/60 overflow-hidden flex-shrink-0 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-[7px] font-extrabold tracking-[0.15em] uppercase -rotate-12 border border-white/60 px-2 py-1">Out of Stock</span>
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                  <div>
                    <span className="text-[8px] font-extrabold tracking-widest text-[#b2533e] uppercase block">{item.brand}</span>
                    <h4 className="text-[12px] font-extrabold text-[#030213] uppercase mt-1 leading-tight truncate group-hover:underline">{item.name}</h4>
                    <p className="text-[12px] font-extrabold text-neutral-900 mt-1.5">₹{item.price.toFixed(2)}</p>
                  </div>
                  {isOutOfStock ? (
                    <span className="inline-block text-[8px] font-extrabold tracking-widest text-red-500 uppercase">Currently Unavailable</span>
                  ) : (
                    <button onClick={(e) => onAddToCart(item, e)}
                      className="bg-[#030213] hover:bg-neutral-800 text-white py-2 px-4 text-[8px] font-extrabold tracking-widest uppercase transition-all max-w-max border-none cursor-pointer">
                      Add to Bag
                    </button>
                  )}
                </div>
                {/* Remove */}
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(item.id); }}
                  className="absolute top-3 right-3 text-neutral-300 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                  aria-label="Remove from wishlist">
                  <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
