import { useState, useMemo } from "react";
import { Search, Star, Trash2, Check, X, AlertTriangle, ThumbsUp, MessageSquare } from "lucide-react";

const RS = "₹";

interface Review {
  id: number;
  productName: string;
  productSku: string;
  customer: string;
  location: string;
  rating: number;
  review: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  helpful: number;
  size?: string;
  color?: string;
}

const initialReviews: Review[] = [
  { id: 1, productName: "Structured Canvas Jacket", productSku: "DD-STR-001", customer: "Ananya Sharma", location: "Mumbai", rating: 5, review: "Incredible quality and fit. The canvas material is premium and the stitching is flawless. Worth every rupee.", date: "2026-06-15", status: "approved", helpful: 24, size: "M", color: "Black" },
  { id: 2, productName: "Sartorial Trench Coat", productSku: "DD-SAT-001", customer: "Rahul Verma", location: "Bangalore", rating: 4, review: "Beautiful coat, runs slightly large. Love the construction and the inner lining is exquisite.", date: "2026-06-14", status: "approved", helpful: 18, size: "L", color: "Camel" },
  { id: 3, productName: "Cashmere Blend Crew", productSku: "DD-CAS-001", customer: "Priya Kapoor", location: "Delhi", rating: 5, review: "Softest cashmere I've ever owned! Perfect for Delhi winters. Already ordered another in grey.", date: "2026-06-13", status: "approved", helpful: 31, size: "S", color: "Ivory" },
  { id: 4, productName: "French Terry Hoodie", productSku: "DD-FTH-001", customer: "Arjun Mehta", location: "Hyderabad", rating: 3, review: "Nice hoodie but the color is slightly different from the photos. The fabric is comfortable though.", date: "2026-06-10", status: "pending", helpful: 5, size: "XL", color: "Olive" },
  { id: 5, productName: "Signature Silk Blouse", productSku: "DD-SIL-001", customer: "Neha Gupta", location: "Chennai", rating: 2, review: "Expected better fabric quality for the price of " + RS + "6,999. The cut is flattering but the silk feels thin.", date: "2026-06-08", status: "pending", helpful: 8, size: "M", color: "Blush" },
  { id: 6, productName: "Structured Canvas Jacket", productSku: "DD-STR-001", customer: "Vikram Singh", location: "Pune", rating: 5, review: "My fifth Drip Doggy purchase and this jacket is by far the best. Gets compliments everywhere!", date: "2026-06-07", status: "approved", helpful: 42, size: "L", color: "Black" },
  { id: 7, productName: "Merino Wool Cardigan", productSku: "DD-MER-001", customer: "Ishita Patel", location: "Ahmedabad", rating: 4, review: "Elegant cardigan with beautiful stitch details. Perfect layering piece for evening events.", date: "2026-06-05", status: "approved", helpful: 12, size: "M", color: "Charcoal" },
  { id: 8, productName: "Handwoven Silk Scarf", productSku: "DD-SCF-001", customer: "Sanya Malhotra", location: "Jaipur", rating: 5, review: "Absolutely stunning scarf! The handwoven texture is incredible and the color is so vibrant.", date: "2026-06-03", status: "approved", helpful: 27, size: "One Size", color: "Indigo" },
  { id: 9, productName: "Relaxed Linen Shirt", productSku: "DD-LIN-001", customer: "Karan Desai", location: "Lucknow", rating: 1, review: "Spam review - fake account. Please remove.", date: "2026-06-02", status: "rejected", helpful: 0, size: "M", color: "White" },
  { id: 10, productName: "Pleated Wool Trousers", productSku: "DD-PLE-001", customer: "Riya Nair", location: "Kochi", rating: 4, review: "Great trousers with a perfect drape. The wool blend is warm but breathable — ideal for Kerala evenings.", date: "2026-05-28", status: "pending", helpful: 9, size: "S", color: "Navy" },
  { id: 11, productName: "Drip Doggy Varsity Jacket", productSku: "DD-VAR-001", customer: "Aditya Joshi", location: "Kolkata", rating: 5, review: "Iconic piece! The wool sleeves and leather body are top-notch. A true collector's item.", date: "2026-05-25", status: "approved", helpful: 36, size: "L", color: "Maroon & Cream" },
  { id: 12, productName: "French Terry Hoodie", productSku: "DD-FTH-001", customer: "Dhruv Agarwal", location: "Nagpur", rating: 1, review: "Received damaged item with a tear on the sleeve. Requesting a replacement.", date: "2026-05-22", status: "pending", helpful: 3, size: "XXL", color: "Grey" },
];

export function ProductReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.productName.toLowerCase().includes(q) &&
            !r.customer.toLowerCase().includes(q) &&
            !r.location.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [reviews, search, statusFilter]);

  const updateStatus = (id: number, status: "approved" | "rejected") => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
  };

  const stats = useMemo(() => ({
    total: reviews.length,
    approved: reviews.filter(r => r.status === "approved").length,
    pending: reviews.filter(r => r.status === "pending").length,
    rejected: reviews.filter(r => r.status === "rejected").length,
    avgRating: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
    totalHelpful: reviews.reduce((s, r) => s + r.helpful, 0),
    fiveStar: reviews.filter(r => r.rating === 5).length,
  }), [reviews]);

  // Rating distribution for visual bar
  const ratingDist = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach(r => { if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++; });
    return dist.reverse(); // 5-star first
  }, [reviews]);

  return (
    <div className="space-y-8 font-sans text-[#382d24]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
        <div>
          <h1 className="text-xl font-[950] text-[#382d24] uppercase tracking-widest flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-[#224870]" /> Product Reviews
          </h1>
          <p className="text-[11px] text-[#382d24] font-[900] uppercase tracking-wider mt-1">
            Drip Doggy customer feedback &amp; ratings management
          </p>
        </div>
      </div>

      {/* Stats + Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* 5 stat cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Reviews", value: stats.total, color: "text-[#382d24]", desc: "Received customer feedbacks" },
            { label: "Approved", value: stats.approved, color: "text-green-700", desc: "Live on storefront" },
            { label: "Pending", value: stats.pending, color: "text-amber-600", desc: "Awaiting moderation" },
            { label: "Rejected", value: stats.rejected, color: "text-red-650", desc: "Spam / Hidden comments" },
            { label: "Avg Rating", value: stats.avgRating + " / 5.0", color: "text-[#382d24]", desc: "Overall catalog score" },
            { label: "Helpful Votes", value: stats.totalHelpful, color: "text-amber-600", desc: "User upvote reactions" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-neutral-200/80 p-4 flex flex-col justify-between min-h-[110px]">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase">{s.label}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className={`text-2xl font-bold tracking-tight ${s.color} whitespace-nowrap`}>{s.value}</span>
              </div>
              <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-1.5">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Rating distribution bar */}
        <div className="lg:col-span-5 bg-card border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[110px]">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[#615e56] uppercase mb-4">Rating Distribution</p>
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
          <p className="text-[9.5px] text-[#615e56]/80 font-normal mt-3">Distribution based on all moderation queues</p>
        </div>
      </div>

      {/* Unified Reviews Panel */}
      <div className="bg-card border border-neutral-200/80 p-6 space-y-6">
        
        {/* Header/Filters Row inside the Panel */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {(["all", "approved", "pending", "rejected"] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-2 text-[9.5px] font-bold tracking-widest uppercase cursor-pointer rounded-none border transition-all ${
                  statusFilter === s ? "bg-[#224870] border-[#224870] text-white" : "bg-[#faf8f5] border-neutral-300 text-[#615e56] hover:text-[#224870] hover:border-[#224870]"
                }`}>{s} {s === "all" ? `(${stats.total})` : `(${stats[s]})`}</button>
            ))}
          </div>
          
          {/* Search bar */}
          <div className="relative w-full lg:w-64">
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

        {/* Reviews List */}
        <div className="space-y-4">
          {filtered.map(r => (
            <div key={r.id} className="bg-[#faf8f5] border border-neutral-200/80 p-5 hover:shadow-xs transition-shadow">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    {/* Avatar with initials */}
                    <div className="w-10 h-10 bg-[#224870] text-white flex items-center justify-center text-[11px] font-bold shrink-0 rounded-none">
                      {r.customer.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-[#382d24] uppercase tracking-wide">{r.customer}</h4>
                      <p className="text-[9.5px] text-neutral-400 font-bold mt-0.5">
                        <span className="text-neutral-500">{r.location}</span> &middot;{" "}
                        on <span className="text-[#382d24]">{r.productName}</span> &middot; {r.date}
                      </p>
                      
                      {/* Size & Color chips */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {r.size && <span className="text-[8px] font-bold tracking-widest bg-card border border-neutral-200 px-2 py-0.5 uppercase">{r.size}</span>}
                        {r.color && <span className="text-[8px] font-bold tracking-widest bg-card border border-neutral-200 px-2 py-0.5 uppercase">{r.color}</span>}
                        <span className="text-[8px] text-neutral-400 font-mono">{r.productSku}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mt-3.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                    ))}
                  </div>

                  <p className="text-[11px] text-[#382d24] mt-2.5 leading-relaxed font-medium">{r.review}</p>

                  {/* Helpful count */}
                  <div className="flex items-center gap-2 mt-3.5 text-neutral-400">
                    <ThumbsUp className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[8.5px] font-bold">{r.helpful} customers found this helpful</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-start">
                  {r.status === "pending" && (
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => updateStatus(r.id, "approved")} 
                        className="bg-green-50 hover:bg-green-100 text-green-700 p-2 cursor-pointer border border-green-200 transition-colors" 
                        title="Approve Review"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => updateStatus(r.id, "rejected")} 
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 cursor-pointer border border-red-200 transition-colors" 
                        title="Reject Review"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <span className={`text-[8.5px] font-bold tracking-widest px-2.5 py-1 border uppercase ${
                    r.status === "approved" ? "bg-green-50 text-green-700 border-green-200" :
                    r.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-red-50 text-red-600 border-red-200"
                  }`}>{r.status}</span>
                  <button 
                    onClick={() => setDeleteId(r.id)} 
                    className="text-neutral-300 hover:text-[#b2533e] p-2 bg-transparent border border-transparent hover:border-neutral-200 transition-colors cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-neutral-450 font-bold uppercase tracking-widest">
              No product reviews match your filter parameters.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-[#382d24]/40 backdrop-blur-xs flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-card border border-neutral-200 p-6 max-w-sm mx-4 rounded-none animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2.5 text-[#b2533e] mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Delete Review?</h3>
            </div>
            <p className="text-[9.5px] text-[#615e56] font-semibold leading-relaxed mb-5">
              Are you sure you want to permanently delete this customer review? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2.5">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#382d24] text-[#615e56] hover:text-[#382d24] text-[9px] font-bold tracking-widest px-4 py-2 uppercase bg-transparent cursor-pointer rounded-none">Cancel</button>
              <button onClick={() => { setReviews(reviews.filter(r => r.id !== deleteId)); setDeleteId(null); }} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-bold tracking-widest px-4.5 py-2.5 uppercase cursor-pointer rounded-none border-none">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
