import { useState } from "react";
import { Link } from "react-router";
import { Search, ShoppingBag, ShieldCheck, Share2, HelpCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface CartItem {
  id: number;
  brand: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export function Checkout() {
  const [cartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });


  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United Kingdom",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: ""
  });
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === "express" ? 15.00 : 0;
  const total = subtotal + shippingCost;
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    // Trigger celebratory confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased ">
        {/* Header */}
        

        {/* Success Content */}
        <div className="max-w-md mx-auto px-6 py-24 text-center flex-1 flex flex-col justify-center items-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mb-6 stroke-[1.2]" />
          <h1 className="text-3xl font-extrabold tracking-[0.05em] mb-4">
            THANK YOU FOR YOUR ORDER
          </h1>
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            Your order has been placed successfully. We have sent a confirmation email to <span className="font-semibold text-neutral-900">{formData.email}</span> with details and tracking.
          </p>
          <div className="w-full space-y-4">
            <Link
              to="/"
              className="block w-full bg-[#030213] text-white py-4 rounded-md text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>

        {/* Footer */}
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#030213] font-sans antialiased selection:bg-neutral-200">
      {/* Custom Header for checkout */}
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form Info */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-12">
            
            {/* Step 1: Customer Contact */}
            <section className="space-y-6">
              <h2 className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase pb-2 border-b border-neutral-200">
                01. CONTACT DETAILS
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="email" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full bg-white border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Shipping Info */}
            <section className="space-y-6">
              <h2 className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase pb-2 border-b border-neutral-200">
                02. SHIPPING ADDRESS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">FIRST NAME</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="w-full bg-white border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">LAST NAME</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="w-full bg-white border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">ADDRESS</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Street Rd"
                    className="w-full bg-white border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">CITY</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="London"
                    className="w-full bg-white border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">POSTAL CODE</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="SW1A 1AA"
                    className="w-full bg-white border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Step 3: Shipping Method */}
            <section className="space-y-6">
              <h2 className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase pb-2 border-b border-neutral-200">
                03. SHIPPING METHOD
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer transition-all ${
                    shippingMethod === "standard"
                      ? "border-neutral-950 bg-white"
                      : "border-neutral-200 bg-white/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === "standard"}
                      onChange={() => setShippingMethod("standard")}
                      className="accent-[#030213]"
                    />
                    <div>
                      <p className="text-xs font-bold tracking-wide">STANDARD DELIVERY</p>
                      <p className="text-[10px] text-neutral-500">3-5 Working Days</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#b2533e]">FREE</span>
                </label>

                <label
                  className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer transition-all ${
                    shippingMethod === "express"
                      ? "border-neutral-950 bg-white"
                      : "border-neutral-200 bg-white/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === "express"}
                      onChange={() => setShippingMethod("express")}
                      className="accent-[#030213]"
                    />
                    <div>
                      <p className="text-xs font-bold tracking-wide">EXPRESS SHIPPING</p>
                      <p className="text-[10px] text-neutral-500">Next Working Day</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold">₹15.00</span>
                </label>
              </div>
            </section>

            {/* Step 4: Payment details */}
            <section className="space-y-6">
              <h2 className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase pb-2 border-b border-neutral-200">
                04. CARD PAYMENT
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 border border-neutral-200/50 p-6 rounded-lg">
                <div className="sm:col-span-2">
                  <label htmlFor="cardName" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">CARDHOLDER NAME</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    required
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full bg-white border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="cardNumber" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">CARD NUMBER</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    required
                    maxLength={19}
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full bg-white border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="cardExpiry" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">EXPIRATION DATE</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    required
                    placeholder="MM/YY"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="cardCvv" className="block text-[10px] font-bold tracking-wider mb-2 text-neutral-500">CVV</label>
                  <input
                    type="text"
                    id="cardCvv"
                    name="cardCvv"
                    required
                    maxLength={4}
                    placeholder="xxx"
                    value={formData.cardCvv}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-neutral-200 px-4 py-3 rounded-md text-sm focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>
            </section>

            <button
              type="submit"
              className="w-full bg-[#030213] text-white py-4 rounded-md text-xs font-bold tracking-[0.2em] hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-950/15"
            >
              CONFIRM AND PAY ₹{total.toFixed(2)}
            </button>
          </form>

          {/* Right Column: Order Items Summary */}
          <div className="lg:col-span-5 bg-white border border-neutral-100 rounded-xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.01)] sticky top-32">
            <h2 className="text-sm font-bold tracking-[0.2em] mb-6 pb-4 border-b border-neutral-200/60">
              YOUR ORDER
            </h2>

            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded bg-neutral-100 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-wider text-neutral-400">{item.brand}</p>
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{item.name}</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Qty: {item.quantity} | {item.size}</p>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-neutral-100 text-xs font-medium tracking-wider mb-8">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-950">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span>{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : "FREE"}</span>
              </div>
              <div className="border-t border-neutral-100 pt-4 flex justify-between text-sm font-bold">
                <span>Total</span>
                <span className="text-base font-bold text-neutral-950">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-neutral-50 rounded p-4 flex gap-3">
              <ShieldCheck className="h-5 w-5 text-neutral-600 flex-shrink-0 stroke-[1.5]" />
              <div>
                <h5 className="text-[10px] font-bold tracking-wide">SECURE CHECKOUT</h5>
                <p className="text-[9px] text-neutral-500 mt-0.5 leading-relaxed">
                  Your credentials and private data are encrypted under TLS standards during processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      
    </div>
  );
}

