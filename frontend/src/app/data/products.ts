// ─── Shared Product Catalog ────────────────────────────────────────────────
// This is the single source of truth for all product data across the frontend.
// Grid components use the base fields; PDP uses the extended detail fields.

export interface ProductColorVariant {
  name: string;
  thumbnail: string;
  images: string[];
}

export interface ProductReview {
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductFeature {
  title: string;
  content: string;
}

export interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  images: string[];
  badge?: string;
  colors?: string[];
  favorite?: boolean;

  // PDP detail (optional — only products with rich detail include these)
  description?: string;
  variants?: ProductColorVariant[];
  sizes?: string[];
  specs?: ProductSpec[];
  designDetails?: string[];
  shippingInfo?: { title: string; content: string }[];
  reviews?: ProductReview[];
  features?: ProductFeature[];
}

// ─── Utility ────────────────────────────────────────────────────────────────

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRecommendations(
  excludeId: number,
  count: number = 4
): Product[] {
  const others = products.filter((p) => p.id !== excludeId);
  // Simple shuffle
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// ─── Catalog ────────────────────────────────────────────────────────────────

export const products: Product[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 1 — Sartorial Pleated Trench Dress
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 1,
    brand: "DRIP DOGGY COLLECTION",
    name: "Sartorial Pleated Trench Dress",
    price: 245.0,
    originalPrice: 499.0,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.25&fp-z=1.5",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.6&fp-z=1.3",
    ],
    colors: ["#FAF8F5", "#1A1A1A"],
    rating: 4.8,
    reviewCount: 18,
    sizes: DEFAULT_SIZES,
    description:
      "A sartorial masterpiece blending trench coat utilitarianism with feminine dress construction. The pleated silhouette offers fluid movement while maintaining structural integrity through reinforced waist detailing and double-faced seam construction.",
    specs: [
      { label: "FABRIC", value: "Premium Cotton-Twill Blend with Lightweight Lining" },
      { label: "FIT", value: "Tailored Fit — Defined Waist with A-Line Skirt" },
      { label: "CLOSURE", value: "Double-Breasted Button Placket with Self-Tie Belt" },
      { label: "LENGTH", value: "Mid-Calf Length — Approx. 125 cm" },
      { label: "WASH CARE", value: "Dry Clean Only / Cool Iron" },
    ],
    designDetails: [
      "Double-Breasted Front",
      "Self-Tie Waist Belt",
      "Pleated A-Line Skirt",
      "Reinforced Shoulder Epaulettes",
    ],
    variants: [
      {
        name: "IVORY CREAM",
        thumbnail:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=150",
        images: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.3&z=2",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.6&z=1.8",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.48&fp-y=0.45&z=2.5",
        ],
      },
      {
        name: "JET BLACK",
        thumbnail:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=150",
        images: [
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.3&z=2",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.6&z=1.8",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.48&fp-y=0.45&z=2.5",
        ],
      },
    ],
    reviews: [
      {
        author: "Priya M.",
        rating: 5,
        title: "Stunning silhouette",
        content:
          "The pleating is immaculate. Fits true to size and the fabric has a beautiful weight to it.",
        date: "1 WEEK AGO",
        verified: true,
      },
      {
        author: "Ananya K.",
        rating: 4,
        title: "Perfect for events",
        content:
          "Received so many compliments. The belt really cinches the waist nicely.",
        date: "2 WEEKS AGO",
        verified: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 2 — Oversized Knit Sweater Dress
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 2,
    brand: "CORE COLLECTION",
    name: "Oversized Knit Sweater Dress",
    price: 185.0,
    originalPrice: 399.0,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.6",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.7&fp-z=1.4",
    ],
    colors: ["#9CA3AF", "#D2C9BD"],
    rating: 4.6,
    reviewCount: 12,
    sizes: DEFAULT_SIZES,
    description:
      "An oversized knit sweater dress designed for maximum comfort without compromising on style. The heavyweight ribbed knit creates a cocoon-like silhouette that drapes effortlessly, making it the perfect transitional piece for cooler months.",
    specs: [
      { label: "FABRIC", value: "Heavyweight Ribbed Cotton-Polyester Knit" },
      { label: "FIT", value: "Oversized / Relaxed — Intentionally Boxy" },
      { label: "NECKLINE", value: "Crew Neck with Ribbed Cuffs & Hem" },
      { label: "LENGTH", value: "Above Knee — Approx. 88 cm" },
      { label: "WASH CARE", value: "Machine Wash Cold / Lay Flat to Dry" },
    ],
    designDetails: [
      "Oversized Silhouette",
      "Ribbed Crew Neckline",
      "Dropped Shoulders",
      "Heavyweight Knit Construction",
    ],
    variants: [
      {
        name: "HEATHER GRAY",
        thumbnail:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=150",
        images: [
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.3&z=2",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.6&z=1.8",
        ],
      },
      {
        name: "SAND BEIGE",
        thumbnail:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=150",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.3&z=2",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.6&z=1.8",
        ],
      },
    ],
    reviews: [
      {
        author: "Sarah J.",
        rating: 5,
        title: "Coziest dress ever",
        content:
          "So warm and comfortable. The oversized fit is perfect for layering with tights and boots.",
        date: "3 DAYS AGO",
        verified: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 3 — Boxy Minimalist Maxi Dress  (was "Structure Tactical Layer" in old PDP)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 3,
    brand: "ESSENTIALS",
    name: "Boxy Minimalist Maxi Dress",
    price: 135.0,
    originalPrice: 299.0,
    image:
      "https://images.unsplash.com/photo-1539008885128-403bb34856b8?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1539008885128-403bb34856b8?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1539008885128-403bb34856b8?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.2&fp-z=1.5",
      "https://images.unsplash.com/photo-1539008885128-403bb34856b8?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.6&fp-z=1.3",
    ],
    badge: "NEW",
    sizes: DEFAULT_SIZES,
    description:
      "A boxy, minimalist maxi dress that embodies effortless sophistication. Cut from a lightweight cotton-blend fabric, it features clean lines and an architectural drape that moves with you. The simple silhouette makes it a versatile canvas for accessories and layering.",
    specs: [
      { label: "FABRIC", value: "Lightweight Cotton-Blend with Soft Drape" },
      { label: "FIT", value: "Boxy / Relaxed — Straight Silhouette" },
      { label: "NECKLINE", value: "Scoop Neck with Cap Sleeves" },
      { label: "LENGTH", value: "Floor-Length Maxi — Approx. 135 cm" },
      { label: "WASH CARE", value: "Machine Wash Cold / Tumble Dry Low" },
    ],
    designDetails: [
      "Boxy Minimalist Cut",
      "Scoop Neckline",
      "Cap Sleeves",
      "Floor-Length Hem",
    ],
    reviews: [
      {
        author: "Riya T.",
        rating: 5,
        title: "Perfect summer staple",
        content:
          "Light, breathable, and looks expensive. True to size and the length is perfect.",
        date: "1 WEEK AGO",
        verified: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 4 — Structured Canvas Utility Dress
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 4,
    brand: "ARCHIVE COLLECTION",
    name: "Structured Canvas Utility Dress",
    price: 295.0,
    originalPrice: 599.0,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.35&fp-z=1.5",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.7&fp-z=1.3",
    ],
    colors: ["#1A1A1A"],
    rating: 5,
    reviewCount: 8,
    sizes: DEFAULT_SIZES,
    description:
      "A structured canvas utility dress engineered for the modern wardrobe. Featuring multiple utility pockets, reinforced topstitching, and an adjustable waist cinch, this piece bridges the gap between rugged workwear and high-fashion tailoring.",
    specs: [
      { label: "FABRIC", value: "Heavyweight Cotton Canvas with Garment Wash" },
      { label: "FIT", value: "Structured Fit — Adjustable Waist Cinch" },
      { label: "POCKETS", value: "6 Utility Pockets with Flap Closure" },
      { label: "HARDWARE", value: "Matte Black Metal Buckles & Zippers" },
      { label: "WASH CARE", value: "Machine Wash Cold / Hang Dry" },
    ],
    designDetails: [
      "Utility Pocket Configuration",
      "Adjustable Waist Cinch",
      "Reinforced Topstitching",
      "Matte Black Hardware",
    ],
    reviews: [
      {
        author: "Vikram S.",
        rating: 5,
        title: "Built like a tank",
        content:
          "The canvas is thick and durable. Pockets are actually functional. Worth every penny.",
        date: "2 WEEKS AGO",
        verified: true,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 5 — Tiered Organza Street Slip
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 5,
    brand: "DRIP LUXE",
    name: "Tiered Organza Street Slip",
    price: 320.0,
    originalPrice: 699.0,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.6",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.6&fp-z=1.3",
    ],
    sizes: DEFAULT_SIZES,
    description:
      "An ethereal tiered organza slip dress that layers streetwear edge with romantic volume. The sheer organza tiers create movement and depth, while the silk-lined bodice ensures a luxe feel against the skin.",
    specs: [
      { label: "FABRIC", value: "Sheer Organza with Silk-Lined Bodice" },
      { label: "FIT", value: "Relaxed Fit — Adjustable Spaghetti Straps" },
      { label: "LAYERS", value: "3-Tiered Ruffle Construction" },
      { label: "LENGTH", value: "Mini Length — Approx. 82 cm" },
      { label: "WASH CARE", value: "Hand Wash Cold / Dry Clean Recommended" },
    ],
    designDetails: [
      "Tiered Ruffle Construction",
      "Adjustable Spaghetti Straps",
      "Silk-Lined Bodice",
      "Sheer Organza Fabrication",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 6 — Architectural Drape Rib Dress
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 6,
    brand: "ESSENTIALS",
    name: "Architectural Drape Rib Dress",
    price: 165.0,
    originalPrice: 349.0,
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.25&fp-z=1.5",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.65&fp-z=1.3",
    ],
    colors: ["#D2C9BD"],
    sizes: DEFAULT_SIZES,
    description:
      "An architectural ribbed dress that sculpts the body with precision-molded panels. The drape effect is achieved through differential ribbing techniques, creating a piece that feels like a second skin while maintaining visual structure.",
    specs: [
      { label: "FABRIC", value: "Premium Ribbed Cotton-Spandex Blend" },
      { label: "FIT", value: "Bodycon Fit — Second-Skin Silhouette" },
      { label: "CONSTRUCTION", value: "Differential Rib Panels for Drape Effect" },
      { label: "LENGTH", value: "Mid-Length — Approx. 95 cm" },
      { label: "WASH CARE", value: "Machine Wash Cold / Lay Flat to Dry" },
    ],
    designDetails: [
      "Differential Rib Panels",
      "Bodycon Silhouette",
      "Precision-Molded Fit",
      "Drape Effect Construction",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 7 — Parachute Cotton Cargo Skirt
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 7,
    brand: "TACTICAL APPAREL",
    name: "Parachute Cotton Cargo Skirt",
    price: 195.0,
    originalPrice: 399.0,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.4&fp-z=1.5",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.7&fp-z=1.3",
    ],
    badge: "NEW",
    sizes: DEFAULT_SIZES,
    description:
      "A parachute-inspired cargo skirt crafted from lightweight technical cotton. The elasticated waist with drawcord and oversized cargo pockets bring utilitarian function to a feminine silhouette.",
    specs: [
      { label: "FABRIC", value: "Lightweight Technical Cotton with Water-Repellent Finish" },
      { label: "FIT", value: "Relaxed Fit with Elasticated Drawcord Waist" },
      { label: "POCKETS", value: "4 Cargo Pockets with Flap & Snap Closure" },
      { label: "LENGTH", value: "Above Knee — Approx. 48 cm" },
      { label: "WASH CARE", value: "Machine Wash Cold / Tumble Dry Low" },
    ],
    designDetails: [
      "Elasticated Drawcord Waist",
      "Oversized Cargo Pockets",
      "Parachute-Inspired Silhouette",
      "Technical Cotton Fabric",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 8 — Asymmetrical Linen Slip Dress
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 8,
    brand: "DRIP LUXE",
    name: "Asymmetrical Linen Slip Dress",
    price: 210.0,
    originalPrice: 449.0,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.5",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.65&fp-z=1.3",
    ],
    rating: 5,
    reviewCount: 6,
    sizes: DEFAULT_SIZES,
    description:
      "An asymmetrical linen slip dress that captures the essence of undone luxury. The one-shoulder silhouette drapes elegantly, with a side slit adding movement. Crafted from premium European linen.",
    specs: [
      { label: "FABRIC", value: "Premium European Linen — Stone Washed" },
      { label: "FIT", value: "Relaxed Fit — One-Shoulder Silhouette" },
      { label: "DETAIL", value: "Side Slit with Self-Tie Detail" },
      { label: "LENGTH", value: "Mini Length — Approx. 85 cm" },
      { label: "WASH CARE", value: "Machine Wash Cold / Iron on Medium" },
    ],
    designDetails: [
      "Asymmetrical One-Shoulder",
      "Side Slit with Tie Detail",
      "European Linen Fabric",
      "Stone-Washed Finish",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 9 — Oversized French Terry Dress Hoodie
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 9,
    brand: "CORE COLLECTION",
    name: "Oversized French Terry Dress Hoodie",
    price: 220.0,
    originalPrice: 449.0,
    image:
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.5",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.7&fp-z=1.3",
    ],
    sizes: DEFAULT_SIZES,
    description:
      "The ultimate lounger-meets-streetwear piece. This oversized French terry dress hoodie features a kangaroo pocket, adjustable drawcord hood, and ribbed cuffs for a relaxed yet put-together look.",
    specs: [
      { label: "FABRIC", value: "Heavyweight French Terry — 380 GSM" },
      { label: "FIT", value: "Oversized / Boxy — Intentionally Relaxed" },
      { label: "HOOD", value: "Adjustable Drawcord Hood" },
      { label: "POCKET", value: "Kangaroo Pocket with Hidden Media Slot" },
      { label: "WASH CARE", value: "Machine Wash Cold / Tumble Dry Low" },
    ],
    designDetails: [
      "Oversized Boxy Fit",
      "Adjustable Drawcord Hood",
      "Kangaroo Pocket",
      "Ribbed Cuffs & Hem",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 10 — Tactical Ripstop Sling Bag
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 10,
    brand: "ACCESSORIES",
    name: "Tactical Ripstop Sling Bag",
    price: 95.0,
    originalPrice: 199.0,
    image:
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.4&fp-z=1.5",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.6&fp-z=1.3",
    ],
    colors: ["#000000", "#9CA3AF"],
    sizes: ["ONE SIZE"],
    description:
      "A tactical-inspired ripstop sling bag built for urban mobility. Multiple organized compartments, MOLLE webbing for modular attachments, and a padded tablet sleeve make this the ultimate everyday carry.",
    specs: [
      { label: "MATERIAL", value: "Ripstop Nylon with Water-Resistant Coating" },
      { label: "CAPACITY", value: "8L — Padded Tablet Sleeve (Fits 11\")" },
      { label: "COMPARTMENTS", value: "5 Organizer Pockets + Hidden Back Pocket" },
      { label: "STRAP", value: "Adjustable Crossbody Strap with Quick-Release Buckle" },
      { label: "CARE", value: "Spot Clean with Damp Cloth" },
    ],
    designDetails: [
      "Ripstop Nylon Construction",
      "MOLLE Webbing System",
      "Padded Tablet Sleeve",
      "Quick-Release Buckle",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 11 — Signature Webbing Collar & Lead Set
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 11,
    brand: "ACCESSORIES",
    name: "Signature Webbing Collar & Lead Set",
    price: 65.0,
    originalPrice: 149.0,
    image:
      "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.5",
      "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.7&fp-z=1.3",
    ],
    colors: ["#000000", "#D4C5B9"],
    sizes: ["S", "M", "L"],
    description:
      "A premium webbing collar and lead set designed for the style-conscious pet. Heavy-duty nylon webbing with reflective stitching, secure quick-release buckle, and padded comfort lining.",
    specs: [
      { label: "MATERIAL", value: "Heavy-Duty Nylon Webbing with Reflective Thread" },
      { label: "HARDWARE", value: "Zinc Alloy Quick-Release Buckle — Rust-Proof" },
      { label: "COLLAR WIDTH", value: "2.5 cm / 1 Inch" },
      { label: "LEAD LENGTH", value: "120 cm / 47 Inches" },
      { label: "CARE", value: "Hand Wash Mild Soap / Air Dry" },
    ],
    designDetails: [
      "Reflective Stitching",
      "Quick-Release Buckle",
      "Padded Comfort Lining",
      "Matching Collar & Lead Set",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 12 — Streetwear Ripstop Camp Cap
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 12,
    brand: "ACCESSORIES",
    name: "Streetwear Ripstop Camp Cap",
    price: 45.0,
    originalPrice: 99.0,
    image:
      "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.3&fp-z=1.5",
      "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&q=80&w=600&crop=focalpoint&fp-y=0.6&fp-z=1.3",
    ],
    colors: ["#000000", "#D2C9BD"],
    sizes: ["ONE SIZE"],
    description:
      "A streetwear-inspired ripstop camp cap with an unstructured silhouette. Features a curved brim, adjustable snapback closure, and breathable mesh lining for all-day wear.",
    specs: [
      { label: "MATERIAL", value: "Ripstop Nylon with Breathable Mesh Lining" },
      { label: "CLOSURE", value: "Adjustable Snapback — One Size Fits Most" },
      { label: "BRIM", value: "Pre-Curved Brim" },
      { label: "DETAILS", value: "Embroidered Eyelets for Ventilation" },
      { label: "CARE", value: "Spot Clean / Hand Wash Cold" },
    ],
    designDetails: [
      "Ripstop Nylon Fabric",
      "Adjustable Snapback",
      "Pre-Curved Brim",
      "Breathable Mesh Lining",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ID: 100 — Structure Tactical Layer  (preserved from original PDP)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 100,
    brand: "ARCHITECTURAL PRECISION SERIES",
    name: "Structure Tactical Layer",
    price: 485.0,
    originalPrice: 999.0,
    rating: 4.9,
    reviewCount: 24,
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.3&z=2",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.6&z=1.8",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.48&fp-y=0.45&z=2.5",
    ],
    sizes: DEFAULT_SIZES,
    description:
      "A monolithic aesthetic defined by a precision-engineered silhouette. The Structure Tactical Layer is designed as a foundational piece for the modern wardrobe, balancing technical rigidity with refined comfort.",
    variants: [
      {
        name: "JET BLACK",
        thumbnail:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=150",
        images: [
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.3&z=2",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.6&z=1.8",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.48&fp-y=0.45&z=2.5",
        ],
      },
      {
        name: "COFFEE BROWN",
        thumbnail:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=150",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.3&z=2",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.6&z=1.8",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.48&fp-y=0.45&z=2.5",
        ],
      },
      {
        name: "SAND BEIGE",
        thumbnail:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=150",
        images: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.3&z=2",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.6&z=1.8",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.48&fp-y=0.45&z=2.5",
        ],
      },
      {
        name: "IVORY WHITE",
        thumbnail:
          "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=150",
        images: [
          "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.3&z=2",
          "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.5&fp-y=0.6&z=1.8",
          "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=800&crop=focalpoint&fp-x=0.48&fp-y=0.45&z=2.5",
        ],
      },
    ],
    designDetails: [
      "Double-Stitched Seams",
      "Modular System",
      "Breathable Lining",
      "Premium Zipper Details",
    ],
    specs: [
      { label: "FABRIC", value: "Premium Breathable Cotton-Nylon Blend" },
      { label: "FIT", value: "Oversized Fit / Relaxed Drop-Shoulder Style" },
      { label: "CLIMATE SUITABILITY", value: "Lightweight & Airy — Perfect for Summers, Monsoons & Layering" },
      { label: "ZIPPER & DETAILS", value: "Premium Rust-Free Metallic Zippers & Heavy-Duty Stitching" },
      { label: "WASH CARE", value: "Easy Machine Wash Cold / Dry in Shade (Do Not Bleach)" },
    ],
    shippingInfo: [
      {
        title: "DELIVERY TIMES",
        content:
          "• Express Shipping: 2-3 working days (Free on order above ₹2,000)\n• Standard Shipping: 5-7 working days (Free on all orders)",
      },
      {
        title: "EASY EXCHANGES",
        content:
          "Enjoy a 7-day return window. Size exchanges are processed with complimentary home pickup across India.",
      },
    ],
    reviews: [
      {
        author: "Deepak R.",
        rating: 5,
        title: "Exceptional technical vest",
        content:
          "The fabric quality and modular pocket placement is top tier. Fits nicely on top of hoodies.",
        date: "2 DAYS AGO",
        verified: true,
      },
      {
        author: "Aditya S.",
        rating: 5,
        title: "Gore-tex protection is real",
        content:
          "Took this out in heavy rains, and the water drops just rolled off. Cobra buckles feel extremely premium.",
        date: "1 WEEK AGO",
        verified: true,
      },
    ],
    features: [
      {
        title: "CONSTRUCTION",
        content: "Reinforced structural seams. Anodized hardware components.",
      },
      {
        title: "DIMENSIONS",
        content:
          "20,000mm Hydrostatic head. Precision-molded modular attachment points.",
      },
    ],
  },
];
