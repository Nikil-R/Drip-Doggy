import { useState, useMemo, useEffect } from "react";
import { Search, Star, AlertTriangle, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
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

export function ProductReviewsPage() {
  const { token } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "rejected">("all");
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>("All Products");

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

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.productName.toLowerCase().includes(q) &&
            !r.customer.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [reviews, search, statusFilter]);

  // Group filtered reviews by Product Name
  const reviewsByProduct = useMemo(() => {
    const groups: Record<string, Review[]> = {};
    filteredReviews.forEach(r => {
      const prodName = r.productName;
      if (!groups[prodName]) {
        groups[prodName] = [];
      }
      groups[prodName].push(r);
    });
    return groups;
  }, [filteredReviews]);

  // Calculate stats based on whether "All Products" is selected, or a specific product is filtered
  const targetStatsReviews = useMemo(() => {
    if (selectedProductFilter === "All Products") {
      return filteredReviews;
    }
    return filteredReviews.filter(r => r.productName === selectedProductFilter);
  }, [filteredReviews, selectedProductFilter]);

  const stats = useMemo(() => {
    const total = targetStatsReviews.length;
    const approved = targetStatsReviews.filter(r => r.status === "approved").length;
    const hidden = targetStatsReviews.filter(r => r.status === "rejected").length;
    const avgRating = total > 0 
      ? (targetStatsReviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
      : "0.0";
    return {
      total,
      approved,
      hidden,
      avgRating
    };
  }, [targetStatsReviews]);

  // Rating distribution calculation
  const ratingDist = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    targetStatsReviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++;
    });
    return dist.reverse(); // 5-star first
  }, [targetStatsReviews]);

  const productOptionsList = useMemo(() => {
    const setOfNames = new Set(reviews.map(r => r.productName));
    return ["All Products", ...Array.from(setOfNames)];
  }, [reviews]);

  const toggleProductExpand = (productName: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productName]: !prev[productName]
    }));
  };

  return (
    <div className="space-y-6 font-sans text-[#382d24]">
      {/* Product Filter Selector bar */}
      <div className="bg-card border border-neutral-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Filter Analytics Profile</span>
          <h2 className="text-sm font-black uppercase text-[#382d24] mt-0.5">{selectedProductFilter}</h2>
        </div>
        <select
          value={selectedProductFilter}
          onChange={e => setSelectedProductFilter(e.target.value)}
          className="bg-[#faf8f5] border border-neutral-300 px-3 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none text-[#382d24] rounded-none focus:border-[#224870]"
        >
          {productOptionsList.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards + Rating Distribution Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Metric Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[110px]">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Total Reviews</span>
            <span className="text-3xl font-bold tracking-tight text-[#382d24] mt-2">{stats.total}</span>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1">Review feedback count in active view</p>
          </div>
          <div className="bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[110px]">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">Average Rating</span>
            <span className="text-3xl font-bold tracking-tight text-[#382d24] mt-2">{stats.avgRating} / 5.0</span>
            <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1">Average rating for filtered view</p>
          </div>
        </div>

        {/* Rating Distribution visual bar graph */}
        <div className="lg:col-span-6 bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase mb-4 block">Rating Distribution</span>
            <div className="space-y-2">
              {ratingDist.map((count, i) => {
                const stars = 5 - i;
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-[9.5px] font-semibold text-[#615e56] w-5">{stars} ★</span>
                    <div className="flex-1 h-2.5 bg-[#faf8f5] border border-neutral-200">
                      <div className="h-full bg-amber-400 transition-all" style={{ width: pct + "%" }} />
                    </div>
                    <span className="text-[9px] font-bold text-[#615e56] w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Unified Reviews Panel */}
      <div className="bg-card border border-neutral-200/80 p-6 space-y-6">
        
        {/* Header/Filters Row inside the Panel */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button key="all" onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-2 text-[9.5px] font-bold tracking-widest uppercase cursor-pointer rounded-none border transition-all ${
                statusFilter === "all" ? "bg-[#224870] border-[#224870] text-white" : "bg-[#faf8f5] border-neutral-300 text-[#615e56] hover:text-[#224870] hover:border-[#224870]"
              }`}>All ({stats.total})</button>
            <button key="approved" onClick={() => setStatusFilter("approved")}
              className={`px-3.5 py-2 text-[9.5px] font-bold tracking-widest uppercase cursor-pointer rounded-none border transition-all ${
                statusFilter === "approved" ? "bg-[#224870] border-[#224870] text-white" : "bg-[#faf8f5] border-neutral-300 text-[#615e56] hover:text-[#224870] hover:border-[#224870]"
              }`}>Visible ({stats.approved})</button>
            <button key="rejected" onClick={() => setStatusFilter("rejected")}
              className={`px-3.5 py-2 text-[9.5px] font-bold tracking-widest uppercase cursor-pointer rounded-none border transition-all ${
                statusFilter === "rejected" ? "bg-[#224870] border-[#224870] text-white" : "bg-[#faf8f5] border-neutral-300 text-[#615e56] hover:text-[#224870] hover:border-[#224870]"
              }`}>Hidden ({stats.hidden})</button>
          </div>
          
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#615e56]" />
            <input 
              type="text" 
              placeholder="Search reviewer or product..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#faf8f5] border border-neutral-300 focus:border-[#224870] pl-9.5 pr-4 py-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none text-[#382d24] placeholder-neutral-400 rounded-none" 
            />
          </div>
        </div>

        {/* Grouped Reviews List */}
        <div className="space-y-4">
          {Object.keys(reviewsByProduct).map(productName => {
            const productReviewsList = reviewsByProduct[productName];
            const isExpanded = expandedProducts[productName] ?? true;
            return (
              <div key={productName} className="border border-neutral-200 bg-white">
                <button
                  onClick={() => toggleProductExpand(productName)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-[#faf8f5] border-b border-neutral-100 hover:bg-neutral-100/50 transition-colors text-left"
                >
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#382d24]">{productName}</h3>
                    <p className="text-[9px] text-[#615e56] font-bold mt-0.5 uppercase tracking-widest">
                      {productReviewsList.length} {productReviewsList.length === 1 ? "Review" : "Reviews"}
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                </button>

                {isExpanded && (
                  <div className="divide-y divide-neutral-100 p-5 space-y-4">
                    {productReviewsList.map(r => (
                      <div key={r.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-[#224870] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                              {r.customer.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold text-[#382d24] uppercase tracking-wide">{r.customer}</h4>
                              <p className="text-[8.5px] text-neutral-400 font-bold mt-0.5">
                                <span className="text-neutral-500">{r.location}</span> &middot; {r.date}
                              </p>
                              {/* Size & Color chips */}
                              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                {r.size && <span className="text-[7.5px] font-bold tracking-widest bg-[#faf8f5] border border-neutral-200 px-1.5 py-0.5 uppercase">{r.size}</span>}
                                {r.color && <span className="text-[7.5px] font-bold tracking-widest bg-[#faf8f5] border border-neutral-200 px-1.5 py-0.5 uppercase">{r.color}</span>}
                                <span className="text-[7.5px] text-neutral-400 font-mono">{r.productSku}</span>
                              </div>
                            </div>
                          </div>

                          {/* Stars */}
                          <div className="flex items-center gap-0.5 mt-2.5">
                            {[1, 2, 3, 4, 5].map(n => (
                              <Star key={n} className={`w-3 h-3 ${n <= r.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                            ))}
                          </div>

                          <p className="text-xs text-[#382d24] mt-2 leading-relaxed font-semibold">{r.review}</p>

                          {/* Review Image Attachment */}
                          {r.image && (
                            <div className="mt-3 max-w-[100px] border border-neutral-200 bg-white p-0.5 hover:shadow-xs transition-shadow">
                              <img src={r.image} alt="User Uploaded Attachment" className="w-full h-[120px] object-cover" />
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                          <button 
                            onClick={() => toggleStatus(r.id)} 
                            className={`px-3 py-1 text-[8.5px] font-black uppercase tracking-wider transition-all border rounded-none cursor-pointer ${
                              r.status === "approved"
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-green-55 hover:bg-green-100 text-green-700 border-green-200"
                            }`}
                            title={r.status === "approved" ? "Hide review on storefront" : "Make review visible on storefront"}
                          >
                            {r.status === "approved" ? "Hide" : "Show"}
                          </button>
                          <span className={`text-[8.5px] font-bold tracking-widest px-2 py-0.5 border uppercase ${
                            r.status === "approved" ? "bg-green-50 text-green-700 border-green-200" : "bg-neutral-50 text-neutral-500 border-neutral-200"
                          }`}>{r.status === "approved" ? "Visible" : "Hidden"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {Object.keys(reviewsByProduct).length === 0 && (
            <div className="py-12 text-center text-neutral-450 font-bold uppercase tracking-widest">
              No product reviews match your filter parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
