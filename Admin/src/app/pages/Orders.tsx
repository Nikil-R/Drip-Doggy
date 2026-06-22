import { useState, useMemo } from "react";
import {
  Search, Filter, MoreVertical, Clock, CheckCircle2, XCircle, Truck,
  ChevronLeft, ChevronRight, Plus, MoreHorizontal, Download, User, MapPin
} from "lucide-react";

const RS = "₹";

const orderKpis = [
  { label: "Total Orders", value: "1,842", change: "+14.4%", trend: "up", subtitle: "This period" },
  { label: "Delivered", value: "1,246", change: "+18.2%", trend: "up", subtitle: "67.6% completion rate" },
  { label: "Processing", value: "312", change: "+8.5%", trend: "up", subtitle: "16.9% in pipeline" },
  { label: "Cancelled / Returned", value: "94 / 37", change: "-5.2%", trend: "down", subtitle: "Return rate 2.1%" },
];

interface Order {
  no: number; id: string; customer: string; phone: string;
  product: string; sku: string; size: string; qty: number; price: number;
  date: string; payment: string; status: string; delivery: string; image: string; items: number;
}

const mockOrders: Order[] = [
  { no: 1, id: "#DD-6545", customer: "Ananya Sharma", phone: "+91 98765 43210", product: "Structured Canvas Jacket", sku: "DD-STR-001", size: "M", qty: 1, price: 5800, date: "22 Jun 2026", payment: "Paid", status: "Delivered", delivery: "Mumbai, MH", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=120&auto=format&fit=crop", items: 3 },
  { no: 2, id: "#DD-5412", customer: "Rahul Verma", phone: "+91 99887 66554", product: "French Terry Hoodie", sku: "DD-FTH-001", size: "L", qty: 2, price: 6400, date: "22 Jun 2026", payment: "Paid", status: "Shipped", delivery: "Delhi, DL", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=120&auto=format&fit=crop", items: 2 },
  { no: 3, id: "#DD-6622", customer: "Priya Kapoor", phone: "+91 77665 44332", product: "Parachute Cargo Skirt", sku: "DD-PCS-001", size: "S", qty: 1, price: 3400, date: "22 Jun 2026", payment: "Paid", status: "Processing", delivery: "Bangalore, KA", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=120&auto=format&fit=crop", items: 1 },
  { no: 4, id: "#DD-6462", customer: "Arjun Mehta", phone: "+91 88776 55443", product: "Sartorial Trench Coat", sku: "DD-SAR-001", size: "XL", qty: 1, price: 6900, date: "21 Jun 2026", payment: "Paid", status: "Delivered", delivery: "Hyderabad, TS", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=120&auto=format&fit=crop", items: 2 },
  { no: 5, id: "#DD-6710", customer: "Neha Gupta", phone: "+91 99880 01122", product: "Boxy Minimalist Maxi", sku: "DD-BMM-001", size: "M", qty: 1, price: 4200, date: "21 Jun 2026", payment: "Unpaid", status: "Pending", delivery: "Chennai, TN", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=120&auto=format&fit=crop", items: 1 },
  { no: 6, id: "#DD-6832", customer: "Vikram Singh", phone: "+91 77665 11223", product: "Drape Rib Maxi Dress", sku: "DD-DRM-001", size: "L", qty: 1, price: 3700, date: "21 Jun 2026", payment: "Paid", status: "Processing", delivery: "Pune, MH", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=120&auto=format&fit=crop", items: 3 },
  { no: 7, id: "#DD-6901", customer: "Isha Patel", phone: "+91 88770 09988", product: "Oversized Knit Cardigan", sku: "DD-OKC-001", size: "S", qty: 1, price: 4500, date: "20 Jun 2026", payment: "Paid", status: "Delivered", delivery: "Ahmedabad, GJ", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=120&auto=format&fit=crop", items: 2 },
  { no: 8, id: "#DD-7012", customer: "Aditya Kumar", phone: "+91 99876 54321", product: "Sartorial Trench Coat", sku: "DD-SAR-001", size: "M", qty: 1, price: 6900, date: "20 Jun 2026", payment: "Paid", status: "Delivered", delivery: "Kolkata, WB", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=120&auto=format&fit=crop", items: 1 },
  { no: 9, id: "#DD-7123", customer: "Sanya Khanna", phone: "+91 77665 99887", product: "Ribbed Panel Dress", sku: "DD-RPD-001", size: "XS", qty: 1, price: 3900, date: "19 Jun 2026", payment: "Unpaid", status: "Cancelled", delivery: "Jaipur, RJ", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=120&auto=format&fit=crop", items: 1 },
  { no: 10, id: "#DD-7234", customer: "Rohan Desai", phone: "+91 88765 44332", product: "Paneled Bomber Jacket", sku: "DD-PBJ-001", size: "L", qty: 1, price: 5200, date: "19 Jun 2026", payment: "Paid", status: "Shipped", delivery: "Surat, GJ", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=120&auto=format&fit=crop", items: 2 },
];

function PaymentBadge({ val }: { val: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[8px] font-black tracking-widest uppercase">
      <span className={`w-1 h-1 ${val === "Paid" ? "bg-green-600" : "bg-red-500"}`} />
      <span className={val === "Paid" ? "text-green-700" : "text-red-500"}>{val}</span>
    </span>
  );
}

function StatusBadge({ val }: { val: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-green-50 text-green-700 border-green-200",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-neutral-50 text-neutral-700 border-neutral-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  const icons: Record<string, React.ReactNode> = {
    Delivered: <CheckCircle2 className="w-2.5 h-2.5" />,
    Shipped: <Truck className="w-2.5 h-2.5" />,
    Processing: <Clock className="w-2.5 h-2.5" />,
    Pending: <Clock className="w-2.5 h-2.5" />,
    Cancelled: <XCircle className="w-2.5 h-2.5" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-black tracking-widest border uppercase ${styles[val] || "bg-neutral-50 text-neutral-700 border-neutral-200"}`}>
      {icons[val]}{val}
    </span>
  );
}

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedOrders(mockOrders.map(o => o.no));
    else setSelectedOrders([]);
  };
  const handleSelectOrder = (no: number, checked: boolean) => {
    if (checked) setSelectedOrders(prev => [...prev, no]);
    else setSelectedOrders(prev => prev.filter(n => n !== no));
  };

  const filteredOrders = useMemo(() => {
    return mockOrders.filter(o => {
      if (activeTab === "Completed" && o.status !== "Delivered") return false;
      if (activeTab === "Processing" && o.status !== "Processing" && o.status !== "Shipped") return false;
      if (activeTab === "Canceled" && o.status !== "Cancelled") return false;
      if (activeTab === "Pending" && o.status !== "Pending") return false;
      const q = searchQuery.toLowerCase();
      return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
    });
  }, [activeTab, searchQuery]);

  const stats = useMemo(() => ({
    total: mockOrders.reduce((s, o) => s + o.price, 0),
    delivered: mockOrders.filter(o => o.status === "Delivered").length,
    processing: mockOrders.filter(o => o.status === "Processing" || o.status === "Shipped").length,
    pending: mockOrders.filter(o => o.status === "Pending").length,
    cancelled: mockOrders.filter(o => o.status === "Cancelled").length,
  }), []);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Order Management</h1>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Process, inspect, and fulfill Drip Doggy store orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#030213] hover:bg-neutral-800 text-white text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase flex items-center gap-1.5 cursor-pointer border-none">
            <Plus className="w-3.5 h-3.5" /> Add Order
          </button>
          <button className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {orderKpis.map((stat, idx) => (
          <div key={idx} className="bg-white border border-neutral-200/80 p-5 flex flex-col justify-between min-h-[110px] hover:shadow-sm">
            <div>
              <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase block">{stat.label}</span>
              <p className="text-[7px] text-neutral-400 font-bold uppercase mt-0.5">{stat.subtitle}</p>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-[#030213]">{stat.value}</span>
              <span className={`text-[8px] font-black px-1.5 py-0.5 border tracking-wide ${stat.trend === "up" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-neutral-200/80 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-6 text-[8px] font-bold text-neutral-500 uppercase tracking-wider">
          <span>Revenue: <span className="font-black text-[#030213]">{RS}{stats.total.toLocaleString()}</span></span>
          <span className="text-neutral-300">|</span>
          <span>Orders: <span className="font-black text-[#030213]">{mockOrders.length}</span></span>
          <span className="text-neutral-300">|</span>
          <span>Delivered: <span className="font-black text-green-700">{stats.delivered}</span></span>
          <span className="text-neutral-300">|</span>
          <span>Pending: <span className="font-black text-amber-600">{stats.pending}</span></span>
        </div>
        <span className="text-[7px] text-neutral-400">Avg: {RS}{(stats.total / mockOrders.length).toLocaleString()}</span>
      </div>

      <div className="bg-white border border-neutral-200/80 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-[#faf8f5] border border-neutral-200/80 p-1 rounded-none">
            {[
              { id: "All", label: "All (" + mockOrders.length + ")" },
              { id: "Completed", label: "Delivered (" + stats.delivered + ")" },
              { id: "Processing", label: "Processing (" + stats.processing + ")" },
              { id: "Pending", label: "Pending (" + stats.pending + ")" },
              { id: "Canceled", label: "Cancelled (" + stats.cancelled + ")" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-[9px] font-extrabold tracking-widest uppercase border-none cursor-pointer ${activeTab === tab.id ? "bg-[#030213] text-white" : "bg-transparent text-neutral-400 hover:text-[#030213]"}`}>{tab.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input type="text" placeholder="Search orders..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="bg-white border border-neutral-200/80 pl-8 pr-3 py-2 text-[9px] font-extrabold uppercase tracking-widest focus:outline-none focus:border-[#030213] placeholder-neutral-300 w-48" />
            </div>
            <button className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 p-2 cursor-pointer"><Filter className="h-4 w-4" /></button>
            <button className="bg-white border border-neutral-200 hover:border-[#030213] text-neutral-600 p-2 cursor-pointer"><MoreHorizontal className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left uppercase text-[9px] font-bold tracking-wider">
            <thead>
              <tr className="border-b border-neutral-100 bg-[#faf8f5]/60 text-[8px] text-neutral-400 tracking-[0.2em]">
                <th className="p-3 w-10"><input type="checkbox" checked={selectedOrders.length === mockOrders.length} onChange={e => handleSelectAll(e.target.checked)} className="accent-[#030213] h-3.5 w-3.5 cursor-pointer" /></th>
                <th className="p-3 font-black">Order</th>
                <th className="p-3 font-black">Customer</th>
                <th className="p-3 font-black">Product</th>
                <th className="p-3 font-black">Size/Qty</th>
                <th className="p-3 font-black">Total</th>
                <th className="p-3 font-black">Payment</th>
                <th className="p-3 font-black">Status</th>
                <th className="p-3 font-black">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((order) => {
                const checked = selectedOrders.includes(order.no);
                return (
                  <tr key={order.no} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-3"><input type="checkbox" checked={checked} onChange={e => handleSelectOrder(order.no, e.target.checked)} className="accent-[#030213] h-3.5 w-3.5 cursor-pointer" /></td>
                    <td className="p-3">
                      <p className="font-black text-[#030213] text-[9px]">{order.id}</p>
                      <span className="text-[6px] text-neutral-400 font-bold">{order.items} item{order.items > 1 ? "s" : ""}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#030213]/10 flex items-center justify-center"><User className="w-3.5 h-3.5 text-[#030213]" /></div>
                        <div>
                          <p className="font-black text-[#030213] text-[8.5px] truncate max-w-[120px]">{order.customer}</p>
                          <span className="text-[6px] text-neutral-400">{order.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-neutral-100 overflow-hidden shrink-0"><img src={order.image} alt="" className="w-full h-full object-cover" /></div>
                        <div className="min-w-0">
                          <p className="font-black text-[#030213] text-[8px] truncate max-w-[140px]">{order.product}</p>
                          <span className="text-[6px] text-neutral-400 font-bold">{order.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-black text-[#030213]">{order.size}</span>
                      <span className="text-neutral-400 ml-1">x{order.qty}</span>
                    </td>
                    <td className="p-3 font-black text-[#030213]">{RS}{order.price.toLocaleString()}</td>
                    <td className="p-3"><PaymentBadge val={order.payment} /></td>
                    <td className="p-3"><StatusBadge val={order.status} /></td>
                    <td className="p-3">
                      <p className="text-[8px] font-bold text-neutral-600">{order.date}</p>
                      <span className="text-[6px] text-neutral-400 flex items-center gap-1 mt-0.5"><MapPin className="w-2 h-2" />{order.delivery}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <button className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] hover:text-[#030213] bg-white text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <div className="flex gap-1.5 items-center">
            {[1, 2, 3, 4, 5].map(p => (
              <button key={p} className={`w-8 h-8 flex items-center justify-center text-[9px] font-extrabold border cursor-pointer transition-all ${p === 1 ? "bg-[#030213] text-white border-[#030213]" : "bg-white border-neutral-200 text-neutral-500 hover:border-[#030213]"}`}>{p}</button>
            ))}
            <span className="text-[9px] text-neutral-400 tracking-wider">.....</span>
            <button className="w-8 h-8 flex items-center justify-center text-[9px] font-extrabold border border-neutral-200 text-neutral-500 hover:border-[#030213] cursor-pointer">24</button>
          </div>
          <button className="flex items-center gap-1 border border-neutral-200 hover:border-[#030213] hover:text-[#030213] bg-white text-neutral-500 text-[9px] font-extrabold tracking-widest px-4 py-2 uppercase cursor-pointer">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
