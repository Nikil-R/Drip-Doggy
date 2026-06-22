import { useState } from "react";
import { TrendingUp, Users, ShoppingCart, DollarSign, Shirt, ArrowUp, ArrowDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const RS = "\u20B9";

// ─── Drip Doggy Metrics ──────────────────────────────────────────────────

const metrics = [
  { label: "Total Revenue", value: RS + "6,39,76,747", change: "+18.7%", trend: "up", icon: DollarSign, subtitle: "Lifetime sales" },
  { label: "Total Orders", value: "3,617", change: "+12.3%", trend: "up", icon: ShoppingCart, subtitle: "All time" },
  { label: "Avg. Order Value", value: RS + "2,045", change: "+5.4%", trend: "up", icon: TrendingUp, subtitle: "Per transaction" },
  { label: "Conversion Rate", value: "3.8%", change: "+0.6%", trend: "up", icon: Users, subtitle: "Store average" },
  { label: "Active Customers", value: "3,280", change: "+15.2%", trend: "up", icon: Users, subtitle: "Last 30 days" },
  { label: "Top Category", value: "Outerwear", change: "35% of sales", trend: "up", icon: Shirt, subtitle: "Best performing" },
];

// ─── Weekly Revenue Data ──────────────────────────────────────────────────

const weeklyRevenue = [
  { day: "Mon", revenue: 428000, orders: 185, returns: 12 },
  { day: "Tue", revenue: 512000, orders: 212, returns: 8 },
  { day: "Wed", revenue: 598000, orders: 248, returns: 15 },
  { day: "Thu", revenue: 485000, orders: 201, returns: 10 },
  { day: "Fri", revenue: 725000, orders: 298, returns: 18 },
  { day: "Sat", revenue: 662000, orders: 275, returns: 14 },
  { day: "Sun", revenue: 398000, orders: 162, returns: 6 },
];

// ─── Product Category Performance ────────────────────────────────────────

const categoryData = [
  { name: "Outerwear", value: 35, revenue: 22400000, color: "#030213" },
  { name: "Knitwear", value: 25, revenue: 16000000, color: "#b2533e" },
  { name: "Tops", value: 20, revenue: 12800000, color: "#717182" },
  { name: "Bottoms", value: 12, revenue: 7680000, color: "#c49a6c" },
  { name: "Accessories", value: 8, revenue: 5120000, color: "#556b2f" },
];

// ─── Top Products by Revenue ──────────────────────────────────────────────

const topProducts = [
  { name: "Structured Canvas Jacket", sku: "DD-STR-001", revenue: 4445658, orders: 342, growth: "+22%" },
  { name: "French Terry Hoodie", sku: "DD-FTH-001", revenue: 1894079, orders: 421, growth: "+18%" },
  { name: "Signature Silk Blouse", sku: "DD-SIL-001", revenue: 2183688, orders: 312, growth: "+31%" },
  { name: "Handwoven Silk Scarf", sku: "DD-SCF-001", revenue: 2135466, orders: 534, growth: "+45%" },
  { name: "Sartorial Trench Coat", sku: "DD-SAT-001", revenue: 4949802, orders: 198, growth: "+12%" },
];

// ─── Monthly Trend ────────────────────────────────────────────────────────

const monthlyTrend = [
  { month: "Jan", revenue: 4520000, orders: 284 },
  { month: "Feb", revenue: 4980000, orders: 312 },
  { month: "Mar", revenue: 5240000, orders: 328 },
  { month: "Apr", revenue: 5610000, orders: 345 },
  { month: "May", revenue: 6120000, orders: 378 },
  { month: "Jun", revenue: 6480000, orders: 401 },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-neutral-200 shadow-md px-3.5 py-2.5 text-[9px] font-sans uppercase font-bold tracking-wider">
      <p className="font-extrabold text-[#030213] mb-1">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-1.5 text-neutral-500 leading-5">
          <span className="w-1.5 h-1.5" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}:</span>
          <span className="text-[#030213] font-black">{typeof entry.value === "number" ? entry.value.toLocaleString("en-IN") : entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsPage() {
  return (
    <div className="space-y-8 font-sans">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-black text-[#030213] uppercase tracking-widest">Analytics</h1>
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
          Drip Doggy performance dashboard &amp; insights
        </p>
      </div>

      {/* ── Metrics Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white border border-neutral-200/80 p-4">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className="h-4 w-4 text-neutral-400" />
              <span className={`inline-flex items-center gap-0.5 text-[7px] font-extrabold px-1.5 py-0.5 border ${
                metric.trend === "up" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
              }`}>
                {metric.trend === "up" ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                {metric.change}
              </span>
            </div>
            <p className="text-[7px] font-extrabold tracking-wider text-neutral-400 uppercase mb-0.5">{metric.label}</p>
            <p className="text-sm font-black text-[#030213] tracking-tight">{metric.value}</p>
            <p className="text-[6.5px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{metric.subtitle}</p>
          </div>
        ))}
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Revenue Area Chart */}
        <div className="bg-white border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[9px] font-black tracking-[0.2em] text-neutral-400 uppercase">Weekly Revenue</h2>
              <p className="text-lg font-black text-[#030213] mt-0.5">{RS}38,08,000</p>
            </div>
            <div className="flex items-center gap-3 text-[7px] font-extrabold text-neutral-400 uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#030213]" /> Revenue</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#b2533e]" /> Orders</span>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyRevenue} margin={{ left: -20, right: 10, top: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#030213" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#030213" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "#717182", fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "#717182", fontWeight: 700 }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#030213" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Donut Chart */}
        <div className="bg-white border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[9px] font-black tracking-[0.2em] text-neutral-400 uppercase">Sales by Category</h2>
              <p className="text-lg font-black text-[#030213] mt-0.5">Outerwear Leads</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={2}>
                    {categoryData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-[8px] font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5" style={{ backgroundColor: cat.color }} />
                    <span className="text-neutral-600 uppercase tracking-wider">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#030213]">{cat.value}%</span>
                    <span className="text-neutral-400 ml-2">{RS}{(cat.revenue / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trend Line Chart */}
        <div className="bg-white border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[9px] font-black tracking-[0.2em] text-neutral-400 uppercase">Monthly Trend</h2>
              <p className="text-lg font-black text-[#030213] mt-0.5">+43.4% growth</p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ left: -20, right: 10, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "#717182", fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "#717182", fontWeight: 700 }} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#030213" strokeWidth={2.5} dot={{ r: 3, fill: "#030213" }} name="Revenue" />
                <Line type="monotone" dataKey="orders" stroke="#b2533e" strokeWidth={2} dot={{ r: 3, fill: "#b2533e" }} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white border border-neutral-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[9px] font-black tracking-[0.2em] text-neutral-400 uppercase">Top Products</h2>
              <p className="text-lg font-black text-[#030213] mt-0.5">By Revenue</p>
            </div>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[8px] font-black text-neutral-300 w-4">{idx + 1}</span>
                  <div>
                    <p className="text-[9px] font-extrabold text-[#030213] truncate max-w-[180px]">{p.name}</p>
                    <p className="text-[7px] text-neutral-400 font-mono">{p.sku} &middot; {p.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-[#030213]">{RS}{p.revenue.toLocaleString("en-IN")}</p>
                  <p className="text-[7px] font-extrabold text-green-700">{p.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Weekly Summary Bar ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue (Week)", value: RS + "38,08,000", sub: "vs last week +12.4%" },
          { label: "Total Orders", value: "1,581", sub: "vs last week +8.2%" },
          { label: "Avg. Order Value", value: RS + "2,408", sub: "vs last week +3.7%" },
          { label: "Return Rate", value: "6.6%", sub: "vs last week -1.2%" },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-neutral-200/80 p-4 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[7px] font-extrabold tracking-wider text-neutral-400 uppercase">{item.label}</p>
              <p className="text-sm font-black text-[#030213] mt-0.5">{item.value}</p>
              <p className="text-[7px] text-green-700 font-bold mt-0.5">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
