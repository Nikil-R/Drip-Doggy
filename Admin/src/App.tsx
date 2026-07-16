import { useState, useMemo } from 'react';
import {
  LayoutDashboard, ShoppingBag, Users, Ticket, FolderKanban, ArrowRightLeft,
  Crown, PlusSquare, Image as ImageIcon, ListCollapse, Star, UserCheck, ShieldAlert,
  Search, Bell, Sun, Moon, LogOut, ArrowUpRight, ArrowDownRight, Globe, ChevronRight,
  TrendingUp, ShoppingCart, DollarSign, Filter, MoreVertical, Plus, CheckCircle, AlertCircle
} from 'lucide-react';

// Mock initial data matching the design image
const INITIAL_TRANSACTIONS = [
  { no: "1.", id: "#6545", date: "01 Oct | 11:29 am", status: "Paid", amount: 64 },
  { no: "2.", id: "#5412", date: "01 Oct | 11:29 am", status: "Pending", amount: 557 },
  { no: "3.", id: "#6622", date: "01 Oct | 11:29 am", status: "Paid", amount: 156 },
  { no: "4.", id: "#6462", date: "01 Oct | 11:29 am", status: "Paid", amount: 265 },
  { no: "5.", id: "#6462", date: "01 Oct | 11:29 am", status: "Paid", amount: 265 }
];

const INITIAL_TOP_PRODUCTS = [
  { id: 1, name: "Apple iPhone 13", sku: "#FXZ-4567", price: 999.00, image: "https://images.unsplash.com/photo-1610465299996-30f240a2b1ad?q=80&w=120&auto=format&fit=crop" },
  { id: 2, name: "Nike Air Jordan", sku: "#FXZ-4567", price: 72.40, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=120&auto=format&fit=crop" },
  { id: 3, name: "T-shirt", sku: "#FXZ-4567", price: 35.40, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=120&auto=format&fit=crop" },
  { id: 4, name: "Assorted Cross Bag", sku: "#FXZ-4567", price: 80.00, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=120&auto=format&fit=crop" }
];

const INITIAL_BEST_SELLERS = [
  { name: "Apple iPhone 13", orders: 104, status: "Stock", price: 999.00, image: "https://images.unsplash.com/photo-1610465299996-30f240a2b1ad?q=80&w=120&auto=format&fit=crop" },
  { name: "Nike Air Jordan", orders: 56, status: "Stock out", price: 999.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=120&auto=format&fit=crop" },
  { name: "T-shirt", orders: 266, status: "Stock", price: 999.00, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=120&auto=format&fit=crop" },
  { name: "Cross Bag", orders: 506, status: "Stock", price: 999.00, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=120&auto=format&fit=crop" }
];

const QUICK_ADD_PRODUCTS = [
  { name: "Smart Fitness Tracker", price: 39.99, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=120&auto=format&fit=crop" },
  { name: "Leather Wallet", price: 19.99, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=120&auto=format&fit=crop" },
  { name: "Electric Hair Trimmer", price: 34.99, image: "https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=120&auto=format&fit=crop" }
];

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [bestSellers, setBestSellers] = useState(INITIAL_BEST_SELLERS);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: string; label: string } | null>(null);

  // Dynamic Kpi Counter Increases
  const [salesIncrement, setSalesIncrement] = useState(0);
  const [ordersIncrement, setOrdersIncrement] = useState(0);

  // Quick Action Adding a new sale/order simulation
  const handleQuickAdd = (productName: string, price: number) => {
    setSalesIncrement(prev => prev + price);
    setOrdersIncrement(prev => prev + 1);

    // Add to transaction list
    const newTx = {
      no: `${transactions.length + 1}.`,
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      date: "Today | " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "Paid",
      amount: Math.round(price)
    };
    setTransactions(prev => [newTx, ...prev].slice(0, 5));

    // Update best sellers orders count if matching
    setBestSellers(prev => prev.map(item => {
      if (item.name.toLowerCase().includes(productName.toLowerCase()) || productName.toLowerCase().includes(item.name.toLowerCase())) {
        return { ...item, orders: item.orders + 1 };
      }
      return item;
    }));
  };

  const filteredTopProducts = useMemo(() => {
    return INITIAL_TOP_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const salesDataPoints = [
    { label: "Sun", val: 20000, x: 50, y: 150 },
    { label: "Mon", val: 28000, x: 130, y: 110 },
    { label: "Tue", val: 25000, x: 210, y: 125 },
    { label: "Wed", val: 45000, x: 290, y: 40 },
    { label: "Thu", val: 40000, x: 370, y: 60 },
    { label: "Fri", val: 25000, x: 450, y: 125 },
    { label: "Sat", val: 35000, x: 530, y: 85 }
  ];

  return (
    <div className={`min-h-screen font-sans flex antialiased transition-colors duration-200 ${isDarkMode ? 'dark bg-[#08060d] text-white' : 'bg-[#faf8f5] text-[#030213]'}`}>
      
      {/* ─── SIDEBAR NAVIGATION ─── */}
      <aside className="w-64 flex-shrink-0 border-r border-neutral-200/80 bg-white flex flex-col justify-between py-6">
        <div>
          {/* Logo */}
          <div className="px-6 mb-8 flex items-center justify-between">
            <span className="text-sm font-black tracking-[0.25em] text-[#030213] uppercase">DRIPDOGGY</span>
            <span className="text-[9px] font-black tracking-widest text-[#b2533e] bg-amber-50 border border-amber-200 px-2 py-0.5 uppercase">ADMIN</span>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <div>
              <span className="px-6 text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-2">Main menu</span>
              <nav className="space-y-0.5">
                {[
                  { name: 'Dashboard', icon: LayoutDashboard },
                  { name: 'Order Management', icon: ShoppingBag },
                  { name: 'Customers', icon: Users },
                  { name: 'Coupon Code', icon: Ticket },
                  { name: 'Categories', icon: FolderKanban },
                  { name: 'Transaction', icon: ArrowRightLeft },
                  { name: 'Brand', icon: Crown }
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-bold tracking-wide uppercase transition-all ${
                      activeTab === item.name
                        ? 'bg-[#030213] text-white'
                        : 'text-neutral-500 hover:text-[#030213] hover:bg-neutral-50/60'
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5 stroke-[2]" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <span className="px-6 text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-2">Product</span>
              <nav className="space-y-0.5">
                {[
                  { name: 'Add Products', icon: PlusSquare },
                  { name: 'Product Media', icon: ImageIcon },
                  { name: 'Product List', icon: ListCollapse },
                  { name: 'Product Reviews', icon: Star }
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-bold tracking-wide uppercase transition-all ${
                      activeTab === item.name
                        ? 'bg-[#030213] text-white'
                        : 'text-neutral-500 hover:text-[#030213] hover:bg-neutral-50/60'
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5 stroke-[2]" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <span className="px-6 text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase block mb-2">Admin</span>
              <nav className="space-y-0.5">
                {[
                  { name: 'Admin role', icon: UserCheck },
                  { name: 'Control Authority', icon: ShieldAlert }
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center gap-3 px-6 py-2.5 text-xs font-bold tracking-wide uppercase transition-all ${
                      activeTab === item.name
                        ? 'bg-[#030213] text-white'
                        : 'text-neutral-500 hover:text-[#030213] hover:bg-neutral-50/60'
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5 stroke-[2]" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Section of Sidebar */}
        <div className="px-6 space-y-4 pt-6 border-t border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none bg-neutral-900 text-white flex items-center justify-center font-extrabold text-[10px] tracking-wide">
              DD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider truncate text-[#030213]">DripDoggy</p>
              <p className="text-[8px] font-bold text-neutral-400 truncate">admin@dripdoggy.com</p>
            </div>
            <button className="text-neutral-400 hover:text-[#b2533e] transition-colors p-1">
              <LogOut className="h-3.5 w-3.5 stroke-[2]" />
            </button>
          </div>
          
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 py-2.5 text-[8px] font-black tracking-widest uppercase transition-colors text-neutral-600"
          >
            Your Shop <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
          </a>
        </div>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-neutral-200/80 bg-white flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black uppercase tracking-widest text-[#030213]">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 stroke-[2]" />
              <input
                type="text"
                placeholder="Search data, users, or reports"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200/80 pl-9 pr-4 py-1.5 text-[10px] font-bold tracking-wide uppercase focus:outline-none focus:border-[#030213] focus:bg-white placeholder-neutral-400"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-1 text-neutral-500 hover:text-[#030213] transition-colors">
              <Bell className="h-4 w-4 stroke-[2]" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#b2533e] rounded-full" />
            </button>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1 text-neutral-500 hover:text-[#030213] transition-colors"
            >
              {isDarkMode ? <Sun className="h-4 w-4 stroke-[2]" /> : <Moon className="h-4 w-4 stroke-[2]" />}
            </button>

            {/* User Profile Avatar */}
            <div className="w-8 h-8 rounded-none border border-neutral-200 overflow-hidden bg-neutral-100 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
                alt="Profile"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
        </header>

        {/* Inner Dashboard View */}
        <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">

          {/* Row A: Top 3 KPI Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* KPI 1: Total Sales */}
            <div className="bg-white border border-neutral-200 p-5 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">Total Sales</span>
                  <p className="text-[9px] text-neutral-500 mt-0.5">Last 7 days</p>
                </div>
                <button className="text-neutral-400 hover:text-[#030213] transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-[#030213]">
                  ${(350 + salesIncrement / 1000).toFixed(1)}K
                </span>
                <span className="text-[9px] font-extrabold text-green-600 bg-green-50 border border-green-200/60 px-1.5 py-0.5 uppercase tracking-wide flex items-center gap-0.5">
                  <TrendingUp className="h-2.5 w-2.5" /> +10.4%
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[8px] font-bold text-neutral-400 uppercase">Previous 7days: <span className="text-neutral-700 font-extrabold">$235</span></span>
                <button className="text-[8px] font-black tracking-widest uppercase text-[#b2533e] hover:underline">Details</button>
              </div>
            </div>

            {/* KPI 2: Total Orders */}
            <div className="bg-white border border-neutral-200 p-5 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">Total Orders</span>
                  <p className="text-[9px] text-neutral-500 mt-0.5">Last 7 days</p>
                </div>
                <button className="text-neutral-400 hover:text-[#030213] transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-[#030213]">
                  {(10.7 + ordersIncrement / 1000).toFixed(2)}K
                </span>
                <span className="text-[9px] font-extrabold text-green-600 bg-green-50 border border-green-200/60 px-1.5 py-0.5 uppercase tracking-wide flex items-center gap-0.5">
                  <TrendingUp className="h-2.5 w-2.5" /> +14.4%
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[8px] font-bold text-neutral-400 uppercase">Previous 7days: <span className="text-neutral-700 font-extrabold">7.6k</span></span>
                <button className="text-[8px] font-black tracking-widest uppercase text-[#b2533e] hover:underline">Details</button>
              </div>
            </div>

            {/* KPI 3: Pending & Canceled */}
            <div className="bg-white border border-neutral-200 p-5 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">Pending & Canceled</span>
                  <p className="text-[9px] text-neutral-500 mt-0.5">Last 7 days</p>
                </div>
                <button className="text-neutral-400 hover:text-[#030213] transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 divide-x divide-neutral-100">
                <div>
                  <span className="text-[8px] font-bold text-neutral-400 uppercase block">Pending</span>
                  <span className="text-lg font-black tracking-tight text-[#030213] block mt-0.5">509</span>
                  <span className="text-[7px] text-neutral-400 font-bold uppercase tracking-wider">user 204</span>
                </div>
                <div className="pl-4">
                  <span className="text-[8px] font-bold text-neutral-400 uppercase block">Canceled</span>
                  <span className="text-lg font-black tracking-tight text-[#b2533e] block mt-0.5">94</span>
                  <span className="text-[7px] text-red-600 font-bold uppercase tracking-wider">-14.4%</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-end">
                <button className="text-[8px] font-black tracking-widest uppercase text-[#b2533e] hover:underline">Details</button>
              </div>
            </div>

          </div>

          {/* Row B: Report chart + User stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Chart Card */}
            <div className="lg:col-span-8 bg-white border border-neutral-200 p-6 flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase block">Report for this week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] bg-neutral-100 border border-neutral-200 px-2 py-1 font-bold text-[#030213] uppercase tracking-wider cursor-pointer">This week</span>
                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider cursor-pointer hover:text-[#030213] px-2 py-1">Last week</span>
                    <button className="text-neutral-400 hover:text-[#030213] p-1">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Sub KPI Row */}
                <div className="grid grid-cols-5 gap-2 mb-6 text-center border border-neutral-100 bg-[#faf8f5]/60 p-3">
                  {[
                    { label: "Customers", val: "52k" },
                    { label: "Total Products", val: "3.5k" },
                    { label: "Stock Products", val: "2.5k" },
                    { label: "Out of Stock", val: "0.5k" },
                    { label: "Revenue", val: "250k" }
                  ].map((sub, i) => (
                    <div key={i} className="min-w-0">
                      <p className="text-[7px] font-black text-neutral-400 uppercase tracking-wider">{sub.label}</p>
                      <p className="text-xs font-black text-[#030213] mt-0.5 uppercase tracking-wide">{sub.val}</p>
                    </div>
                  ))}
                </div>

                {/* SVG Chart area */}
                <div className="relative h-44">
                  <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#b2533e" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#b2533e" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 45, 90, 135, 180].map((hVal, idx) => (
                      <line
                        key={idx}
                        x1="40"
                        y1={hVal}
                        x2="560"
                        y2={hVal}
                        stroke="#f0eff2"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Area under the line */}
                    <path
                      d="M 50 150 Q 90 130 130 110 Q 170 120 210 125 T 290 40 Q 330 50 370 60 T 450 125 T 530 85 L 530 180 L 50 180 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Line path */}
                    <path
                      d="M 50 150 Q 90 130 130 110 Q 170 120 210 125 T 290 40 Q 330 50 370 60 T 450 125 T 530 85"
                      fill="none"
                      stroke="#b2533e"
                      strokeWidth="2.5"
                    />

                    {/* Chart Dots & Hover Handlers */}
                    {salesDataPoints.map((pt, idx) => (
                      <g key={idx} className="cursor-pointer group">
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4"
                          fill={hoveredPoint?.label === pt.label ? "#030213" : "#b2533e"}
                          stroke="#ffffff"
                          strokeWidth="2"
                          onMouseEnter={() => setHoveredPoint({ x: pt.x, y: pt.y, val: pt.val.toLocaleString(), label: pt.label })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      </g>
                    ))}
                  </svg>

                  {/* SVG Tooltip */}
                  {hoveredPoint && (
                    <div
                      className="absolute bg-[#030213] text-white px-2 py-1 text-[8px] font-mono uppercase tracking-widest font-extrabold shadow-md pointer-events-none -translate-x-1/2 -translate-y-full"
                      style={{ left: `${(hoveredPoint.x / 600) * 100}%`, top: `${(hoveredPoint.y / 180) * 100 - 5}%` }}
                    >
                      {hoveredPoint.label}: ${hoveredPoint.val}
                    </div>
                  )}

                  {/* Hardcoded visual Wednesday tooltip matching design layout */}
                  {!hoveredPoint && (
                    <div className="absolute left-[44%] top-[10%] bg-[#b2533e]/10 border border-[#b2533e] px-2.5 py-1 text-[8px] font-extrabold uppercase text-[#b2533e] tracking-wider pointer-events-none">
                      Wednesday <span className="font-black text-[#030213] block">14k sales</span>
                    </div>
                  )}

                  {/* X Axis Labels */}
                  <div className="flex justify-between text-[8px] font-bold text-neutral-400 uppercase tracking-widest px-8 mt-2">
                    {salesDataPoints.map((pt, i) => (
                      <span key={i} className={pt.label === "Wed" ? "text-[#b2533e] font-black" : ""}>
                        {pt.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Users / Location Side Panel */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
              
              {/* Users Live Card */}
              <div className="bg-white border border-neutral-200 p-5 flex flex-col justify-between flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">Users in last 30 minutes</span>
                    <h3 className="text-2xl font-black tracking-tight text-[#030213] mt-2">21.5K</h3>
                    <p className="text-[8px] text-neutral-400 font-bold uppercase mt-0.5">Users per minute</p>
                  </div>
                  <button className="text-neutral-400 hover:text-[#030213]">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                {/* Micro Bar Chart */}
                <div className="h-10 flex items-end gap-1 mt-4">
                  {[20, 40, 30, 50, 70, 45, 60, 35, 80, 55, 65, 40, 75, 30, 50, 60, 85, 40, 70, 90, 50].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`flex-1 ${i === 18 ? 'bg-[#b2533e]' : 'bg-[#030213]/25'} hover:bg-[#030213] transition-colors`}
                    />
                  ))}
                </div>
              </div>

              {/* Sales by Country List */}
              <div className="bg-white border border-neutral-200 p-5 flex flex-col justify-between flex-1">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">Sales by Country</span>
                  <span className="text-[8px] font-black tracking-widest text-[#030213] uppercase">Sales</span>
                </div>
                
                <div className="space-y-3.5 mt-3">
                  {[
                    { country: "US", flag: "🇺🇸", val: "30k", change: "+25.8%", positive: true, pct: "70%" },
                    { country: "Brazil", flag: "🇧🇷", val: "30k", change: "-15.8%", positive: false, pct: "55%" },
                    { country: "Australia", flag: "🇦🇺", val: "25k", change: "+35.6%", positive: true, pct: "45%" }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-base flex-shrink-0">{row.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase text-neutral-800 tracking-wide mb-1">
                          <span>{row.country}</span>
                          <span className={row.positive ? 'text-green-600' : 'text-red-500'}>
                            {row.val} ({row.change})
                          </span>
                        </div>
                        {/* Custom visual progress bar */}
                        <div className="w-full h-1 bg-neutral-100">
                          <div
                            className="h-full bg-[#030213]"
                            style={{ width: row.pct }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full text-center border-t border-neutral-100 pt-3 text-[8px] font-black tracking-widest uppercase text-[#b2533e] hover:underline mt-4">
                  View Insights
                </button>
              </div>

            </div>

          </div>

          {/* Row C: Transactions Table & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Transactions Section */}
            <div className="lg:col-span-8 bg-white border border-neutral-200 p-6 flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">Transaction</span>
                  <button className="flex items-center gap-1 bg-[#faf8f5] border border-neutral-200 px-3 py-1 text-[8px] font-black tracking-widest uppercase text-neutral-600 hover:text-[#030213]">
                    <Filter className="h-3 w-3" /> Filter
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left uppercase font-bold tracking-wider divide-y divide-neutral-100">
                    <thead>
                      <tr className="text-[7px] text-neutral-400 tracking-[0.15em] border-b border-neutral-100">
                        <th className="py-2">No</th>
                        <th className="py-2">Id Customer</th>
                        <th className="py-2">Order Date</th>
                        <th className="py-2">Status</th>
                        <th className="py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {transactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/50">
                          <td className="py-3 text-neutral-400">{tx.no}</td>
                          <td className="py-3 text-[#030213] font-black">{tx.id}</td>
                          <td className="py-3 text-neutral-500 font-medium">{tx.date}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[7px] font-black tracking-widest border uppercase ${
                              tx.status === 'Paid'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${tx.status === 'Paid' ? 'bg-green-600' : 'bg-amber-500'}`} />
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-black text-neutral-900">${tx.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4 flex justify-end">
                <button className="text-[8px] font-black tracking-widest uppercase text-[#b2533e] hover:underline">Details</button>
              </div>
            </div>

            {/* Top Products section */}
            <div className="lg:col-span-4 bg-white border border-neutral-200 p-6 flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">Top Products</span>
                  <button className="text-[8px] font-black tracking-widest uppercase text-[#b2533e] hover:underline">All product</button>
                </div>

                {/* Inline filter search input */}
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search Products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-neutral-200 pl-8 pr-3 py-1.5 text-[8px] font-extrabold uppercase tracking-wider focus:outline-none placeholder-neutral-300"
                  />
                </div>

                <div className="space-y-3">
                  {filteredTopProducts.map(p => (
                    <div key={p.id} className="flex gap-3 items-center border border-neutral-100 p-2 hover:bg-neutral-50/50">
                      <div className="w-10 h-10 overflow-hidden bg-neutral-100 flex-shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[10px] font-black uppercase text-neutral-900 truncate leading-tight">{p.name}</h4>
                        <span className="text-[7px] font-bold text-[#b2533e] uppercase tracking-widest block mt-0.5">{p.sku}</span>
                      </div>
                      <span className="text-[10px] font-black text-neutral-950">${p.price.toFixed(2)}</span>
                    </div>
                  ))}
                  {filteredTopProducts.length === 0 && (
                    <div className="text-center py-6">
                      <AlertCircle className="h-6 w-6 text-neutral-300 mx-auto mb-1" />
                      <p className="text-[8px] text-neutral-400 font-extrabold uppercase">No products match search</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Row D: Best Sellers & Add New Product */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Best selling product Table */}
            <div className="lg:col-span-8 bg-white border border-neutral-200 p-6 flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">Best selling product</span>
                  <button className="flex items-center gap-1 bg-[#faf8f5] border border-neutral-200 px-3 py-1 text-[8px] font-black tracking-widest uppercase text-neutral-600 hover:text-[#030213]">
                    <Filter className="h-3 w-3" /> Filter
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] text-left uppercase font-bold tracking-wider divide-y divide-neutral-100">
                    <thead>
                      <tr className="text-[7px] text-neutral-400 tracking-[0.15em] border-b border-neutral-100">
                        <th className="py-2">Product</th>
                        <th className="py-2">Total Order</th>
                        <th className="py-2">Status</th>
                        <th className="py-2 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {bestSellers.map((item, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/50">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-neutral-100 overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-black text-[#030213]">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-neutral-500 font-medium">{item.orders}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[7px] font-black tracking-widest border uppercase ${
                              item.status === 'Stock'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${item.status === 'Stock' ? 'bg-green-600' : 'bg-red-600'}`} />
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-black text-neutral-900">${item.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4 flex justify-end">
                <button className="text-[8px] font-black tracking-widest uppercase text-[#b2533e] hover:underline">Details</button>
              </div>
            </div>

            {/* Quick Categories & Add Item Section */}
            <div className="lg:col-span-4 bg-white border border-neutral-200 p-6 flex flex-col justify-between min-h-[350px]">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[8px] font-black tracking-[0.2em] text-neutral-400 uppercase">Add New Product</span>
                    <button className="text-[8px] font-black tracking-widest uppercase text-[#b2533e] hover:underline flex items-center gap-0.5">
                      <Plus className="h-3 w-3" /> Add New
                    </button>
                  </div>
                  <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider mb-2.5">Categories</p>

                  <div className="space-y-2">
                    {[
                      { name: "Electronic", icon: Globe },
                      { name: "Fashion", icon: ShoppingCart },
                      { name: "Home", icon: DollarSign }
                    ].map(cat => (
                      <button
                        key={cat.name}
                        className="w-full flex items-center justify-between border border-neutral-200 hover:border-[#030213] p-2.5 bg-white transition-all text-left uppercase text-[9px] font-black tracking-wide"
                      >
                        <span className="flex items-center gap-2">
                          <cat.icon className="h-3.5 w-3.5 text-neutral-500" />
                          {cat.name}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                      </button>
                    ))}
                    <button className="w-full text-center text-[7px] font-black tracking-widest uppercase text-neutral-400 hover:text-[#030213] pt-1">
                      See more
                    </button>
                  </div>
                </div>

                {/* Quick Add products bottom list */}
                <div>
                  <p className="text-[7px] text-neutral-400 font-extrabold uppercase tracking-wider mb-2.5">Quick Add Product</p>
                  <div className="space-y-2">
                    {QUICK_ADD_PRODUCTS.map((qp, i) => (
                      <div key={i} className="flex gap-2.5 items-center border border-neutral-100 p-2">
                        <div className="w-8 h-8 overflow-hidden bg-neutral-100 flex-shrink-0">
                          <img src={qp.image} alt={qp.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[8px] font-black uppercase text-neutral-900 truncate leading-tight">{qp.name}</h5>
                          <span className="text-[9px] font-bold text-neutral-950 block mt-0.5">${qp.price}</span>
                        </div>
                        <button
                          onClick={() => handleQuickAdd(qp.name, qp.price)}
                          className="bg-[#030213] hover:bg-neutral-800 text-white text-[7px] font-extrabold tracking-widest px-2.5 py-1 uppercase flex-shrink-0 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                    <button className="w-full text-center text-[7px] font-black tracking-widest uppercase text-neutral-400 hover:text-[#030213] pt-1">
                      See more
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}

export default App;
