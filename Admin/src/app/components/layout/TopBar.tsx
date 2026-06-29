import { useAuthStore } from "@/app/store/auth-store";
import { useSidebarStore } from "@/app/store/sidebar-store";
import { useNavigate, useLocation } from "react-router";
import { Menu, LogOut, ExternalLink, User, KeyRound, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export function TopBar() {
  const { logout } = useAuthStore();
  const { isCollapsed } = useSidebarStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Dynamically resolve page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/orders")) return "Order Management";
    if (path.includes("/admin/customers")) return "Customers";
    if (path.includes("/admin/categories")) return "Categories";
    if (path.includes("/admin/transactions")) return "Payments Ledger";
    if (path.includes("/admin/products/new")) return "Add Product";
    if (path.includes("/admin/products/reviews")) return "Product Reviews";
    if (path.includes("/admin/products")) return "Products";
    if (path.includes("/admin/roles")) return "Members & Roles";
    if (path.includes("/admin/authority")) return "Control Authority";
    if (path.includes("/admin/coupons")) return "Coupons & Promos";
    if (path.includes("/admin/brands")) return "Brands & Labels";
    if (path.includes("/admin/content")) return "Content Manager";
    if (path.includes("/admin/analytics")) return "Analytics";
    if (path.includes("/admin/settings")) return "Settings";
    return "Drip Doggy";
  };

  return (
    <header
      className={cn(
        "h-16 bg-background/90 backdrop-blur-md border-b border-neutral-200/80 fixed top-0 right-0 z-20 flex items-center justify-between px-6 transition-all duration-300 ease-in-out font-sans text-foreground",
        isCollapsed ? "left-[68px]" : "left-[260px]"
      )}
    >
      {/* Left: Mobile menu + Page Title */}
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

      {/* Right: View Storefront + Profile */}
      <div className="flex items-center gap-3">

        {/* View Storefront */}
        <a
          href="https://dripdoggy.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 border border-neutral-200 bg-white/60 hover:bg-white hover:border-[#224870]/40 text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:text-[#224870] transition-all duration-150 group rounded-none"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:text-[#224870] transition-colors" />
          View Storefront
        </a>

        {/* Divider */}
        <div className="w-px h-6 bg-neutral-200" />

        {/* Profile Icon + Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="flex items-center gap-1.5 p-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300 transition-all duration-150 cursor-pointer rounded-none group"
            title="Profile"
          >
            <div className="w-7 h-7 rounded-full bg-[#224870]/10 border border-[#224870]/20 flex items-center justify-center overflow-hidden">
              <User className="w-3.5 h-3.5 text-[#224870]" />
            </div>
            <ChevronDown className={cn(
              "w-3 h-3 text-neutral-400 transition-transform duration-200",
              showProfileMenu && "rotate-180"
            )} />
          </button>

          {/* Dropdown */}
          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-neutral-200 shadow-xl z-50 py-1">
              {/* Header */}
              <div className="px-4 py-2.5 border-b border-neutral-100">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#382d24]">Nikil</p>
                <p className="text-[9px] text-neutral-400 font-medium mt-0.5">nikil@dripdoggy.com</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => { setShowProfileMenu(false); navigate("/admin/profile"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600 hover:text-[#224870] hover:bg-[#224870]/5 transition-all cursor-pointer bg-transparent border-none text-left"
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  Profile
                </button>

                <button
                  onClick={() => { setShowProfileMenu(false); navigate("/admin/change-password"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600 hover:text-[#224870] hover:bg-[#224870]/5 transition-all cursor-pointer bg-transparent border-none text-left"
                >
                  <KeyRound className="w-3.5 h-3.5 shrink-0" />
                  Change Password
                </button>

                <div className="my-1 border-t border-neutral-100" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#b2533e] hover:text-white hover:bg-[#b2533e] transition-all cursor-pointer bg-transparent border-none text-left"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
