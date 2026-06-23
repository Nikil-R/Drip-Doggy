import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/app/store/sidebar-store";
import { useAuthStore } from "@/app/store/auth-store";
import logo from "@/assets/logo.png";
import logoIcon from "@/assets/new_logo_icon.png";
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
      { to: "/admin/transactions", label: "Payments Ledger", icon: ArrowRightLeft },
      { to: "/admin/brands", label: "Brand", icon: Crown },
    ]
  },
  {
    title: "Product",
    items: [
      { to: "/admin/products", label: "Product List", icon: ListCollapse },
      { to: "/admin/products/media", label: "Product Media", icon: ImageIcon },
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
        "h-screen bg-background font-sans text-foreground border-r border-neutral-200/80 fixed left-0 top-0 z-30 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo area */}
      <div className="flex items-center h-16 px-4 border-b border-neutral-200/80 shrink-0">
        <div className="flex items-center w-full overflow-hidden">
          <div className="flex items-center w-full">
            <img src={logoIcon} alt="DD" className="w-18 h-20 object-contain mix-blend-multiply shrink-0" />
            <div className={cn(
              "transition-all duration-300 ease-in-out overflow-hidden flex items-center",
              isCollapsed ? "max-w-0 opacity-0 pointer-events-none ml-0" : "max-w-[180px] opacity-100 ml-2"
            )}>
              <img src={logo} alt="Drip Doggy" className="h-26 w-auto object-contain mix-blend-multiply shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <span
              className={cn(
                "text-[8px] font-medium tracking-[0.25em] text-neutral-400 uppercase block transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap",
                isCollapsed ? "max-w-0 opacity-0 px-0 mb-0 mt-0" : "max-w-[200px] opacity-100 px-3 mb-1.5 mt-1"
              )}
            >
              {section.title}
            </span>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 text-[10px] font-medium uppercase tracking-widest transition-all duration-300 group rounded-md",
                      isActive
                        ? "bg-accent text-foreground font-semibold"
                        : "text-neutral-500 hover:text-primary hover:bg-muted"
                    )
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden inline-block",
                      isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
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
        <div className="flex items-center px-2">
          <div className="w-8 h-8 rounded-full border border-neutral-200 overflow-hidden bg-background flex-shrink-0 flex items-center justify-center p-0.5">
            <img
              src={logoIcon}
              alt="Profile"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
          <div
            className={cn(
              "min-w-0 flex-1 transition-all duration-300 ease-in-out overflow-hidden",
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider truncate text-foreground">Nikil</p>
            <p className="text-[8px] font-medium text-neutral-400 truncate">nikil@dripdoggy.com</p>
          </div>
          <button
            onClick={() => logout()}
            className={cn(
              "text-neutral-400 hover:text-destructive transition-all duration-300 p-1 bg-transparent border-none cursor-pointer overflow-hidden",
              isCollapsed ? "max-w-0 opacity-0 pointer-events-none ml-0" : "max-w-[30px] opacity-100 ml-auto"
            )}
            aria-label="Logout"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 py-2.5 text-[8px] font-medium tracking-widest uppercase transition-colors text-neutral-600 rounded-md overflow-hidden px-2"
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden text-center",
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[120px] opacity-100 ml-1.5"
            )}
          >
            Drip Doggy Shop
          </span>
        </a>
      </div>

      {/* Floating Middle Right Collapse toggle */}
      <button
        onClick={toggle}
        className="absolute top-1/2 -translate-y-1/2 -right-3 z-40 bg-background border border-neutral-300 w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-primary hover:bg-muted transition-colors cursor-pointer rounded-full shadow-sm"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
}
