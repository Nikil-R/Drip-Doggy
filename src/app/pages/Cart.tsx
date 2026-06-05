import { useState } from "react";
import { Link } from "react-router";
import { Heart, Search, ShoppingBag, ShieldCheck, RefreshCw, Truck, Share2, HelpCircle } from "lucide-react";

interface CartItem {
  id: number;
  brand: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
  favorite: boolean;
}

export function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      brand: "CONCRETE CULTURE",
      name: "Vanguard Tactical Vest",
      size: "Medium",
      color: "Stealth Black",
      price: 185.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-x=0.3&fp-y=0.65&z=2.0",
      favorite: false
    },
    {
      id: 2,
      brand: "CONCRETE CULTURE",
      name: "Heavyweight Hoodie",
      size: "Small",
      color: "Sandstone",
      price: 300.00,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600",
      favorite: false
    }
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const toggleFavorite = (id: number) => {
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200 py-12">
      {/* Main Cart Content */}
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold tracking-[0.1em] mb-2 font-sans">
          SHOPPING CART
        </h1>
        <p className="text-neutral-500 text-sm tracking-wide mb-12">
          You have {totalItemCount} items in your cart
        </p>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Items and Promo */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-neutral-100 p-6 flex flex-col sm:flex-row gap-6 relative shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]"
              >
                {/* Item Image */}
                <div className="w-full sm:w-32 aspect-square rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Item Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#b2533e]">
                          {item.brand}
                        </span>
                        <h2 className="text-lg font-bold tracking-tight mt-1 mb-2">
                          {item.name}
                        </h2>
                        <p className="text-xs text-neutral-400 font-medium">
                          Size: {item.size} | Color: {item.color}
                        </p>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="p-1.5 hover:bg-neutral-50 rounded-full transition-colors text-neutral-400 hover:text-red-500"
                      >
                        <Heart
                          className={`h-5 w-5 stroke-[1.5] ${
                            item.favorite ? "fill-red-500 stroke-red-500" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Quantity Selector & Price */}
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center border border-neutral-200 rounded-full px-4 py-1.5 bg-neutral-50/50">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-neutral-400 hover:text-neutral-900 px-2 font-medium"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-neutral-400 hover:text-neutral-900 px-2 font-medium"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-semibold text-neutral-900">
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code Entry */}
            <div className="pt-8">
              <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-500 mb-3">
                HAVE A PROMO CODE?
              </p>
              <div className="flex max-w-md gap-4 items-center">
                <input
                  type="text"
                  placeholder="ENTER CODE"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-transparent border-b border-neutral-300 py-2 text-xs tracking-widest focus:outline-none focus:border-neutral-900 flex-1 uppercase font-semibold"
                />
                <button
                  onClick={() => setAppliedPromo(true)}
                  className="text-xs font-bold tracking-[0.2em] border-b border-neutral-900 pb-1 hover:opacity-75 transition-opacity"
                >
                  APPLY
                </button>
              </div>
              {appliedPromo && (
                <p className="text-green-600 text-xs mt-2 font-medium">Promo code applied successfully!</p>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 bg-[#FAF7F0] rounded-xl border border-neutral-200/60 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
            <h2 className="text-sm font-bold tracking-[0.2em] mb-8 pb-4 border-b border-neutral-200/60">
              ORDER SUMMARY
            </h2>

            <div className="space-y-4 text-xs font-medium tracking-wider mb-8">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-950">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span className="text-[#b2533e] font-semibold tracking-widest text-[10px]">FREE</span>
              </div>
              <div className="border-t border-neutral-200/60 pt-4 flex justify-between text-sm font-bold">
                <span>Total</span>
                <span className="text-lg font-bold">£{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout">
              <button className="w-full bg-[#030213] text-white py-4 rounded-md text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-950/10">
                PROCEED TO CHECKOUT
              </button>
            </Link>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mt-8 pt-8 border-t border-neutral-200/60 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="h-5 w-5 mb-2 stroke-[1.5] text-neutral-800" />
                <span className="text-[9px] font-bold tracking-[0.15em] text-neutral-700">SECURE</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="h-5 w-5 mb-2 stroke-[1.5] text-neutral-800" />
                <span className="text-[9px] font-bold tracking-[0.15em] text-neutral-700">RETURNS</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="h-5 w-5 mb-2 stroke-[1.5] text-neutral-800" />
                <span className="text-[9px] font-bold tracking-[0.15em] text-neutral-700">EXPRESS</span>
              </div>
            </div>

            {/* Payment Logos */}
            <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-neutral-200/40 opacity-40 grayscale">
              <span className="text-[10px] font-bold tracking-[0.25em]">VISA</span>
              <span className="text-[10px] font-bold tracking-[0.25em]">MC</span>
              <span className="text-[10px] font-bold tracking-[0.25em]">AMEX</span>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        <section className="mt-24 pt-16 border-t border-neutral-200">
          <div className="flex justify-between items-baseline mb-10">
            <h2 className="text-xl font-bold tracking-[0.1em]">
              YOU MAY ALSO LIKE
            </h2>
            <Link
              to="/shop"
              className="text-[10px] font-bold tracking-[0.2em] border-b border-neutral-900 pb-0.5 hover:opacity-75 transition-opacity"
            >
              VIEW ALL
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Recommendation 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 mb-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600"
                  alt="Reflective Utility Sling"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-4 left-4 bg-white text-[#030213] text-[9px] font-bold tracking-[0.15em] px-3 py-1.5 rounded-sm">
                  NEW ARRIVAL
                </span>
              </div>
              <h3 className="text-sm font-bold tracking-tight mb-1">Reflective Utility Sling</h3>
              <p className="text-xs text-neutral-500">£45.00</p>
            </div>

            {/* Recommendation 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=600"
                  alt="Heritage Knit Sweater"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-bold tracking-tight mb-1">Heritage Knit Sweater</h3>
              <p className="text-xs text-neutral-500">£95.00</p>
            </div>

            {/* Recommendation 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600"
                  alt="Italian Leather Cardholder"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-bold tracking-tight mb-1">Italian Leather Cardholder</h3>
              <p className="text-xs text-neutral-500">£75.00</p>
            </div>

            {/* Recommendation 4 */}
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600"
                  alt="Technical Rain Shell"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-bold tracking-tight mb-1">Technical Rain Shell</h3>
              <p className="text-xs text-neutral-500">£120.00</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
