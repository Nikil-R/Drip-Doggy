import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/app/store/sidebar-store";
import { useAuthStore } from "@/app/store/auth-store";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Ticket,
  FolderKanban,
  ArrowRightLeft,
  Crown,
  PlusSquare,
  Image as ImageIcon,
  ListCollapse,
  Star,
  UserCheck,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  Award,
  BookOpen,
  LayoutList,
  Mail,
  Copyright,
  Menu,
  FileText,
  Grid3X3
} from "lucide-react";

interface SidebarItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const menuSections: SidebarSection[] = [
  {
    title: "Main menu",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/orders", label: "Order Management", icon: ShoppingBag },
      { to: "/admin/customers", label: "Customers", icon: Users },
      { to: "/admin/coupons", label: "Coupon Code", icon: Ticket },
      { to: "/admin/categories", label: "Categories", icon: FolderKanban },
      { to: "/admin/transactions", label: "Transaction", icon: ArrowRightLeft },
      { to: "/admin/brands", label: "Brand", icon: Crown },
    ]
  },
  {
    title: "Product",
    items: [
      { to: "/admin/products/new", label: "Add Products", icon: PlusSquare },
      { to: "/admin/products/media", label: "Product Media", icon: ImageIcon },
      { to: "/admin/products", label: "Product List", icon: ListCollapse },
      { to: "/admin/products/reviews", label: "Product Reviews", icon: Star },
    ]
  },
  {
    title: "Admin",
    items: [
      { to: "/admin/roles", label: "Admin role", icon: UserCheck },
      { to: "/admin/authority", label: "Control Authority", icon: ShieldAlert },
    ]
  },
  {
    title: "Content",
    items: [
      { to: "/admin/content/hero-slides", label: "Hero Slides", icon: ImageIcon },
      { to: "/admin/content/featured-products", label: "Featured Products", icon: Star },
      { to: "/admin/content/signature-pieces", label: "Signature Pieces", icon: Award },
      { to: "/admin/content/collection-story", label: "Collection Story", icon: BookOpen },
      { to: "/admin/content/home-categories", label: "Home Categories", icon: LayoutList },
      { to: "/admin/content/newsletter", label: "Newsletter Config", icon: Mail },
      { to: "/admin/content/footer", label: "Footer Settings", icon: Copyright },
      { to: "/admin/content/navigation", label: "Navigation Menu", icon: Menu },
      { to: "/admin/content/site-pages", label: "Site Pages", icon: FileText },
      { to: "/admin/content/collections", label: "Curated Collections", icon: Grid3X3 },
    ]
  },
];


export function Sidebar() {
  const { isCollapsed, toggle } = useSidebarStore();
  const { logout } = useAuthStore();

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-neutral-200/80 fixed left-0 top-0 z-30 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo area */}
      <div className="flex items-center h-16 px-5 border-b border-neutral-200/80 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 bg-[#030213] rounded-none flex items-center justify-center shrink-0">
            <span className="text-white font-extrabold text-xs">DD</span>
          </div>
          <span
            className={cn(
              "font-black text-xs uppercase tracking-[0.2em] text-[#030213] whitespace-nowrap transition-opacity duration-200",
              isCollapsed && "opacity-0 w-0 overflow-hidden"
            )}
          >
            Drip Doggy
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <span
              className={cn(
                "px-3 text-[8px] font-black tracking-[0.25em] text-neutral-400 uppercase block mb-1.5 transition-opacity duration-200",
                isCollapsed && "opacity-0 w-0 overflow-hidden"
              )}
            >
              {section.title}
            </span>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-150 group",
                      isActive
                        ? "bg-[#030213] text-white"
                        : "text-neutral-500 hover:text-[#030213] hover:bg-neutral-50"
                    )
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-opacity duration-200",
                      isCollapsed && "opacity-0 w-0 overflow-hidden"
                    )}
                  >
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Profile Area & External Link */}
      <div className="p-3 border-t border-neutral-200/80 shrink-0 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-none border border-neutral-200 overflow-hidden bg-neutral-100 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
              alt="Profile"
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div
            className={cn(
              "min-w-0 flex-1 transition-opacity duration-200",
              isCollapsed && "opacity-0 w-0 overflow-hidden"
            )}
          >
            <p className="text-[10px] font-black uppercase tracking-wider truncate text-[#030213]">Drip Doggy</p>
            <p className="text-[8px] font-bold text-neutral-400 truncate">admin@dripdoggy.com</p>
          </div>
          <button
            onClick={() => logout()}
            className="text-neutral-400 hover:text-[#b2533e] transition-colors p-1 bg-transparent border-none cursor-pointer"
            aria-label="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 py-2.5 text-[8px] font-black tracking-widest uppercase transition-colors text-neutral-600"
        >
          {isCollapsed ? <ExternalLink className="h-3 w-3" /> : (
            <>
              Your Shop <ArrowRightLeft className="h-3 w-3 rotate-45" />
            </>
          )}
        </a>

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className="flex items-center justify-center w-full p-2 text-neutral-500 hover:text-[#030213] hover:bg-neutral-50 rounded-none transition-colors cursor-pointer bg-transparent border-none"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
