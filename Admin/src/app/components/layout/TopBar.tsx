import { useAuthStore } from "@/app/store/auth-store";
import { useSidebarStore } from "@/app/store/sidebar-store";
import { useNavigate, useLocation } from "react-router";
import { Menu, LogOut, Bell, Search, Sun, Moon, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

export function TopBar() {
  const { logout } = useAuthStore();
  const { isCollapsed } = useSidebarStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  // Search input ref for keyboard shortcuts
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Notifications dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New order #DD-9014 received", time: "5 mins ago", read: false },
    { id: 2, text: "Stock alert: 'Structured Canvas Jacket' is low (5 left)", time: "1 hour ago", read: false },
    { id: 3, text: "Nikil updated Collections permissions matrix", time: "2 hours ago", read: true },
  ]);

  // Sync theme to DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Keyboard shortcut listener (Ctrl+K to focus search, Esc to blur)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        searchInputRef.current?.blur();
        setShowNotifications(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Perform a simulated routing search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    
    // Simple navigation search router
    if (query.includes("product") || query.includes("item") || query.includes("stock")) {
      navigate("/admin/products");
    } else if (query.includes("order") || query.includes("ship")) {
      navigate("/admin/orders");
    } else if (query.includes("customer") || query.includes("buyer")) {
      navigate("/admin/customers");
    } else if (query.includes("coupon") || query.includes("discount")) {
      navigate("/admin/coupons");
    } else if (query.includes("payment") || query.includes("ledger") || query.includes("transaction")) {
      navigate("/admin/transactions");
    } else if (query.includes("role") || query.includes("permission") || query.includes("authority")) {
      navigate("/admin/roles");
    } else {
      // Default to product search redirect
      navigate(`/admin/products?search=${encodeURIComponent(searchQuery)}`);
    }
    setSearchQuery("");
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Dynamically resolve page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/orders")) return "Order Management";
    if (path.includes("/admin/customers")) return "Customers";
    if (path.includes("/admin/categories")) return "Categories";
    if (path.includes("/admin/transactions")) return "Payments Ledger";
    if (path.includes("/admin/products/new")) return "Add Product";
    if (path.includes("/admin/products")) return "Product List";
    if (path.includes("/admin/roles")) return "Admin role";
    if (path.includes("/admin/authority")) return "Control Authority";
    if (path.includes("/admin/coupons")) return "Coupons & Promos";
    if (path.includes("/admin/brands")) return "Brands & Labels";
    if (path.includes("/admin/content")) return "Content Manager";
    if (path.includes("/admin/analytics")) return "Analytics";
    if (path.includes("/admin/settings")) return "Settings";
    return "Dealport";
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      className={cn(
        "h-16 bg-background/90 backdrop-blur-md border-b border-neutral-200/80 fixed top-0 right-0 z-20 flex items-center justify-between px-6 transition-all duration-300 ease-in-out font-sans text-foreground",
        isCollapsed ? "left-[68px]" : "left-[260px]"
      )}
    >
      {/* Left: Dynamic Page Title */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 text-neutral-400 hover:text-foreground rounded-none hover:bg-neutral-50 transition-colors cursor-pointer bg-transparent border-none"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <h2 className="hidden sm:block text-base font-bold tracking-tight uppercase">
          {getPageTitle()}
        </h2>
      </div>

      {/* Center & Right: Search, Notifications, Theme Toggle, Profile */}
      <div className="flex items-center gap-5">
        
        {/* Search bar matching mockup (Ctrl+K shortcut) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 bg-background/60 border border-neutral-200 rounded-none w-72">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search dashboard... (Ctrl+K)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-[11px] text-foreground placeholder-neutral-400 focus:outline-none w-full font-medium"
          />
          <button type="submit" className="bg-transparent border-none p-0 cursor-pointer text-neutral-400 hover:text-foreground">
            <Search className="w-3.5 h-3.5 shrink-0 transition-colors" />
          </button>
        </form>

        {/* Action icons */}
        <div className="flex items-center gap-2 relative">
          
          {/* Notifications bell */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-neutral-500 hover:text-foreground hover:bg-neutral-200/20 transition-all cursor-pointer bg-transparent border-none rounded-none"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-none" />
            )}
          </button>

          {/* Notifications dropdown popup */}
          {showNotifications && (
            <div className="absolute top-10 right-0 w-80 bg-background border border-neutral-300 z-30 shadow-2xl p-4 space-y-3 rounded-none uppercase text-[8px] tracking-widest text-foreground">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                <span className="font-bold">System Alerts ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button onClick={markAllNotificationsRead} className="text-neutral-400 hover:text-foreground bg-transparent border-none p-0 cursor-pointer font-bold">Mark all read</button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={cn("p-2 border border-neutral-200/50 bg-neutral-50/50 flex flex-col justify-between", !n.read && "border-l-2 border-l-[#030213]")}>
                    <p className="font-semibold leading-normal text-foreground">{n.text}</p>
                    <span className="text-[6.5px] text-neutral-400 mt-1 block font-mono">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-200 pt-2 text-center">
                <button onClick={() => setShowNotifications(false)} className="text-neutral-400 hover:text-foreground bg-transparent border-none p-0 cursor-pointer font-bold">Close Alerts</button>
              </div>
            </div>
          )}

        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-neutral-200" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-1.5 p-1 bg-card hover:bg-neutral-100/50 border border-neutral-200/80 rounded-full transition-all cursor-pointer text-[#1d1c16]"
            title="Profile Menu"
          >
            <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200/60 overflow-hidden">
              <User className="w-3.5 h-3.5 text-[#615e56]" />
            </div>
            <ChevronDown className="w-3 h-3 text-[#615e56] mr-0.5" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute top-10 right-0 w-44 bg-background border border-neutral-300 z-30 shadow-2xl p-3 rounded-sm uppercase text-[9px] tracking-widest text-foreground">
              <div className="pb-2 border-b border-neutral-200/60 mb-2">
                <p className="font-bold text-[#1d1c16]">Nikil</p>
                <p className="text-[7.5px] text-[#615e56] font-semibold mt-0.5">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 p-2 text-left text-neutral-500 hover:text-red-700 hover:bg-neutral-200/20 transition-all cursor-pointer bg-transparent border-none uppercase font-bold text-[8.5px] tracking-wider"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
