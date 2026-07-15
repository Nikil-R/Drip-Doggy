import { useState, useMemo, useEffect } from "react";
import { Search, Star, AlertTriangle, MessageSquare, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { adminReviewApi, BackendReview } from "../lib/review-api";
import { useAuthStore } from "../store/auth-store";

interface Review {
  id: number;
  productName: string;
  productSku: string;
  customer: string;
  location: string;
  rating: number;
  review: string;
  date: string;
  status: "approved" | "rejected";
  size?: string;
  color?: string;
  image?: string;
}

interface ProductAggregate {
  productName: string;
  totalReviews: number;
  avgRating: number;
  approvedCount: number;
  rejectedCount: number;
  reviews: Review[];
}

export function ProductReviewsPage() {
  const { token } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductAggregate | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "rejected">("all");

  useEffect(() => {
    if (!token) return;
    async function loadReviews() {
      try {
        const data = await adminReviewApi.getAllReviews(token!);
        const mapped = data.map((r: any): Review => {
          let status: "approved" | "rejected" = "rejected";
          if (r.isActive === true) {
            status = "approved";
          }
          
          let reviewImage = "";
          if (r.imageUrls && r.imageUrls.length > 0) {
            reviewImage = r.imageUrls[0];
          } else if (r.images && r.images.length > 0) {
            reviewImage = typeof r.images[0] === "string" ? r.images[0] : (r.images[0].imageUrl || "");
          }

          return {
            id: r.id,
            productName: r.productName || "Product",
            productSku: r.productSku || r.productVariantName || "",
            customer: r.customerName || "Customer",
            location: r.location || "Online",
            rating: r.rating || 5,
            review: r.comment || r.reviewContent || "",
            date: r.createdAt?.split("T")[0] || "Recent",
            status: status,
            size: r.productSize,
            color: r.productColor,
            image: reviewImage
          };
        });
        setReviews(mapped);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    }
    loadReviews();
  }, [token]);

  // Aggregate reviews product-wise
  const aggregatedProducts = useMemo(() => {
    const map: Record<string, Review[]> = {};
    reviews.forEach(r => {
      if (!map[r.productName]) {
        map[r.productName] = [];
      }
      map[r.productName].push(r);
    });

    return Object.keys(map).map((name): ProductAggregate => {
      const prodReviews = map[name];
      const approvedCount = prodReviews.filter(r => r.status === "approved").length;
      const rejectedCount = prodReviews.filter(r => r.status === "rejected").length;
      const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
      const avg = prodReviews.length > 0 ? Number((totalRating / prodReviews.length).toFixed(1)) : 5.0;

      return {
        productName: name,
        totalReviews: prodReviews.length,
        avgRating: avg,
        approvedCount,
        rejectedCount,
        reviews: prodReviews
      };
    });
  }, [reviews]);

  // Sync selected product's latest state when reviews refresh
  const activeProductDetail = useMemo(() => {
    if (!selectedProduct) return null;
    return aggregatedProducts.find(p => p.productName === selectedProduct.productName) || null;
  }, [aggregatedProducts, selectedProduct]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    return aggregatedProducts.filter(p => 
      p.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [aggregatedProducts, searchQuery]);

  const toggleStatus = async (id: number) => {
    if (!token) return;
    try {
      await adminReviewApi.toggleReviewActive(id, token!);
      setReviews(prev => prev.map(r => {
        if (r.id === id) {
          const nextStatus = r.status === "approved" ? "rejected" as const : "approved" as const;
          return { ...r, status: nextStatus };
        }
        return r;
      }));
    } catch (err) {
      console.error("Failed to toggle review status:", err);
    }
  };

  // Filter individual reviews inside a selected product detail view
  const filteredReviews = useMemo(() => {
    if (!activeProductDetail) return [];
    return activeProductDetail.reviews.filter(r => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      return true;
    });
  }, [activeProductDetail, statusFilter]);

  return (
    <div className="space-y-6 font-sans text-[#382d24]">
      {activeProductDetail ? (
        // ─── PRODUCT DETAIL REVIEW LIST VIEW ───
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200/85 p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-10 h-10 border border-neutral-200 flex items-center justify-center bg-card hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-600" />
              </button>
              <div>
                <span className="text-[9px] font-black tracking-widest text-[#224870] uppercase">PRODUCT REVIEWS</span>
                <h1 className="text-base font-black uppercase text-[#382d24] mt-0.5">{activeProductDetail.productName}</h1>
              </div>
            </div>

            {/* Micro Stats */}
            <div className="flex items-center gap-6 divide-x divide-neutral-200 pt-2 sm:pt-0">
              <div className="text-center px-4 first:pl-0">
                <span className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase block">Rating</span>
                <div className="flex items-center gap-1.5 justify-center mt-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-extrabold text-[#382d24]">{activeProductDetail.avgRating}</span>
                </div>
              </div>
              <div className="text-center px-4">
                <span className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase block">Total</span>
                <span className="text-sm font-extrabold text-[#382d24] block mt-1">{activeProductDetail.totalReviews}</span>
              </div>
              <div className="text-center px-4">
                <span className="text-[8px] font-bold tracking-widest text-neutral-400 uppercase block">Visible</span>
                <span className="text-sm font-extrabold text-[#224870] block mt-1">{activeProductDetail.approvedCount}</span>
              </div>
            </div>
          </div>

          {/* Filter and Content Row */}
          <div className="bg-card border border-neutral-200/80 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-5">
              <div className="flex gap-1.5">
                {[
                  { value: "all", label: "All", count: activeProductDetail.totalReviews },
                  { value: "approved", label: "Visible", count: activeProductDetail.approvedCount },
                  { value: "rejected", label: "Hidden", count: activeProductDetail.rejectedCount }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setStatusFilter(opt.value as any)}
                    className={`px-3.5 py-1.5 text-[8.5px] font-bold tracking-widest uppercase cursor-pointer rounded-full border transition-all ${
                      statusFilter === opt.value
                        ? "bg-[#224870] border-[#224870] text-white shadow-sm"
                        : "bg-[#faf8f5] border-neutral-300 text-[#615e56] hover:text-[#224870]"
                    }`}
                  >
                    {opt.label} ({opt.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Reviews Grid/List */}
            <div className="divide-y divide-neutral-200/60 space-y-6">
              {filteredReviews.map((r, i) => (
                <div key={r.id} className="pt-6 first:pt-0 flex flex-col sm:flex-row items-start justify-between gap-6">
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-neutral-200 text-[#382d24] flex items-center justify-center text-[11px] font-black tracking-wide shrink-0">
                        {r.customer.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-[#382d24] uppercase tracking-wide">{r.customer}</h4>
                        <p className="text-[9px] text-neutral-400 font-bold mt-0.5 uppercase tracking-wide">
                          <span className="text-neutral-500">{r.location}</span> &middot; {r.date}
                        </p>
                        {/* Variant parameters */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {r.size && <span className="text-[7.5px] font-bold tracking-widest bg-white border border-neutral-200 px-1.5 py-0.5 uppercase">{r.size}</span>}
                          {r.color && <span className="text-[7.5px] font-bold tracking-widest bg-white border border-neutral-200 px-1.5 py-0.5 uppercase">{r.color}</span>}
                          <span className="text-[7.5px] text-neutral-400 font-mono tracking-wider">{r.productSku}</span>
                        </div>
                      </div>
                    </div>

                    {/* Star feedback */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                      ))}
                    </div>

                    <p className="text-xs text-neutral-700 leading-relaxed font-semibold">{r.review}</p>

                    {/* Attachment attachment file */}
                    {r.image && (
                      <div className="max-w-[120px] border border-neutral-200 p-0.5 bg-white shadow-sm mt-3">
                        <img src={r.image} alt="Customer upload Attachment" className="w-full h-[150px] object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => toggleStatus(r.id)}
                      className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all border cursor-pointer flex items-center gap-1.5 ${
                        r.status === "approved"
                          ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      }`}
                    >
                      {r.status === "approved" ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Show
                        </>
                      )}
                    </button>
                    <span className={`text-[9px] font-black tracking-widest px-2.5 py-1 border uppercase ${
                      r.status === "approved" ? "bg-green-50 text-green-700 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                    }`}>
                      {r.status === "approved" ? "Visible" : "Hidden"}
                    </span>
                  </div>
                </div>
              ))}
              {filteredReviews.length === 0 && (
                <div className="py-16 text-center text-neutral-400 font-bold uppercase tracking-widest text-[10px]">
                  No reviews match your status filter.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // ─── PRODUCT CATALOG GRID VIEW ───
        <div className="space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200/80 p-6">
            <div>
              <span className="text-[9px] font-black tracking-widest text-[#224870] uppercase">CATALOG FEEDBACK</span>
              <h1 className="text-base font-black uppercase text-[#382d24] mt-0.5">Product Reviews</h1>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#faf8f5] border border-neutral-300 focus:border-[#224870] pl-10.5 pr-4 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none text-[#382d24] placeholder-neutral-450 rounded-none"
              />
            </div>
          </div>

          {/* Catalog grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(p => (
              <div
                key={p.productName}
                onClick={() => {
                  setSelectedProduct(p);
                  setStatusFilter("all");
                }}
                className="bg-card border border-neutral-200/80 hover:border-[#224870]/60 p-6 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wide text-[#382d24] group-hover:text-[#224870] transition-colors leading-tight">
                      {p.productName}
                    </h3>
                  </div>

                  {/* Rating Stars Summary */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star
                          key={n}
                          className={`w-3.5 h-3.5 ${
                            n <= Math.round(p.avgRating) ? "text-amber-400 fill-amber-400" : "text-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-extrabold text-[#382d24]">{p.avgRating} / 5.0</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between mt-6">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
                      {p.totalReviews} {p.totalReviews === 1 ? "Review" : "Reviews"}
                    </span>
                  </div>

                  <span className="text-[8px] font-black tracking-widest text-[#224870] uppercase group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
                    Manage &rarr;
                  </span>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-16 text-center text-neutral-400 font-bold uppercase tracking-widest text-[10px] bg-card border border-neutral-200/60">
                No products found with active customer reviews.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
