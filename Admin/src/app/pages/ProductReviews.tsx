import { useState, useMemo } from "react";
import { Search, Star, Trash2, Check, X, AlertTriangle, ThumbsUp } from "lucide-react";

const RS = "\u20B9";

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
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#030213] uppercase tracking-widest">Product Reviews</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
            Drip Doggy customer feedback &amp; ratings
          </p>
        </div>
      </div>

      {/* ── Stats + Rating Distribution ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* 5 stat cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[{ label: "Total Reviews", value: stats.total, color: "text-[#030213]" },
            { label: "Approved", value: stats.approved, color: "text-green-700" },
            { label: "Pending", value: stats.pending, color: "text-amber-600" },
            { label: "Rejected", value: stats.rejected, color: "text-red-600" },
            { label: "Avg Rating", value: stats.avgRating, color: "text-[#030213]" },
            { label: "Helpful Votes", value: stats.totalHelpful, color: "text-amber-600" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-neutral-200/80 p-4">
              <p className="text-[7px] font-bold tracking-widest text-neutral-400 uppercase">{s.label}</p>
              <p className={`text-lg font-bold ${s.color} mt-1`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Rating distribution bar */}
        <div className="lg:col-span-5 bg-card border border-neutral-200/80 p-4">
          <p className="text-[7px] font-bold tracking-widest text-neutral-400 uppercase mb-3">Rating Distribution</p>
          <div className="space-y-1.5">
            {ratingDist.map((count, i) => {
              const stars = 5 - i;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-[9px] font-semibold text-neutral-500 w-5">{stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                  <div className="flex-1 h-3 bg-neutral-100">
                    <div className="h-full bg-amber-400 transition-all" style={{ width: pct + "%" }} />
                  </div>
                  <span className="text-[8px] font-bold text-neutral-500 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-card border border-neutral-200/80 p-4">
        <div className="flex gap-1.5">
          {(["all", "approved", "pending", "rejected"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-[9px] font-semibold tracking-widest uppercase cursor-pointer rounded-none border-none ${
                statusFilter === s ? "bg-[#030213] text-white" : "bg-card text-neutral-400 hover:text-[#030213]"
              }`}>{s} {s === "all" ? `(${stats.total})` : `(${stats[s]})`}</button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <input type="text" placeholder="Search name, product or city..." value={search} onChange={e => setSearch(e.target.value)}
            className="border border-neutral-200/80 pl-8 pr-3 py-2 text-[9px] font-semibold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-52 rounded-none" />
        </div>
      </div>

      {/* ── Reviews List ───────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-card border border-neutral-200/80 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  {/* Avatar with initials */}
                  <div className="w-9 h-9 bg-[#030213] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {r.customer.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-[#030213] uppercase tracking-wide">{r.customer}</h4>
                    <p className="text-[7px] text-neutral-400 font-bold">
                      <span className="text-neutral-500">{r.location}</span> &middot;{" "}
                      on <span className="text-[#030213]">{r.productName}</span> &middot; {r.date}
                    </p>
                  </div>
                </div>

                {/* Size & Color chips */}
                <div className="flex items-center gap-2 mt-2">
                  {r.size && <span className="text-[7px] font-semibold tracking-widest bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 uppercase">{r.size}</span>}
                  {r.color && <span className="text-[7px] font-semibold tracking-widest bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 uppercase">{r.color}</span>}
                  <span className="text-[7px] text-neutral-400 font-mono">{r.productSku}</span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mt-2">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} className={`w-3 h-3 ${n <= r.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                  ))}
                </div>

                <p className="text-[10px] text-neutral-600 mt-2 leading-relaxed">{r.review}</p>

                {/* Helpful count */}
                <div className="flex items-center gap-2 mt-2">
                  <ThumbsUp className="w-3 h-3 text-neutral-300" />
                  <span className="text-[7px] text-neutral-400 font-bold">{r.helpful} found helpful</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {r.status === "pending" && (
                  <>
                    <button onClick={() => updateStatus(r.id, "approved")} className="bg-green-50 hover:bg-green-100 text-green-700 p-2 cursor-pointer border-none" title="Approve"><Check className="w-4 h-4" /></button>
                    <button onClick={() => updateStatus(r.id, "rejected")} className="bg-red-50 hover:bg-red-100 text-red-600 p-2 cursor-pointer border-none" title="Reject"><X className="w-4 h-4" /></button>
                  </>
                )}
                <span className={`text-[7px] font-semibold tracking-widest px-2 py-1 ${
                  r.status === "approved" ? "bg-green-50 text-green-700" :
                  r.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                }`}>{r.status.toUpperCase()}</span>
                <button onClick={() => setDeleteId(r.id)} className="text-neutral-300 hover:text-[#b2533e] p-1.5 bg-transparent border-none cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Delete Confirmation ─────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
          <div className="bg-card border border-neutral-200 p-6 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-8 h-8 text-[#b2533e] mb-3" />
            <h3 className="text-sm font-bold text-[#030213] uppercase tracking-widest mb-2">Delete Review?</h3>
            <p className="text-[9px] text-neutral-500 mb-4">This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="border border-neutral-200 hover:border-[#030213] text-neutral-500 text-[9px] font-semibold tracking-widest px-4 py-2 uppercase bg-card cursor-pointer rounded-none">Cancel</button>
              <button onClick={() => { setReviews(reviews.filter(r => r.id !== deleteId)); setDeleteId(null); }} className="bg-[#b2533e] hover:bg-red-800 text-white text-[9px] font-semibold tracking-widest px-4 py-2 uppercase cursor-pointer rounded-none border-none">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
