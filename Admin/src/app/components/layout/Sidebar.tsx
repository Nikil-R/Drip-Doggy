import { NavLink, useNavigate } from "react-router";
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
  Image as ImageIcon,
  ListCollapse,
  Star,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Award,
  LayoutList,
  Zap,
  Sparkles,
  Shield,
} from "lucide-react";



interface SidebarItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarSection {
  title: string;
  accent: string;        // pill / dot color
  iconColor: string;     // icon color when section active
  items: SidebarItem[];
}

const menuSections: SidebarSection[] = [
  {
    title: "Main Menu",
    accent: "#224870",
    iconColor: "text-[#224870]",
    items: [
      { to: "/admin/dashboard",    label: "Dashboard",       icon: LayoutDashboard },
      { to: "/admin/categories",   label: "Categories",      icon: FolderKanban },
      { to: "/admin/customers",    label: "Customers",       icon: Users },
      { to: "/admin/roles",        label: "Members & Roles", icon: Shield },
      { to: "/admin/orders",       icon: ShoppingBag,        label: "Orders" },
      { to: "/admin/coupons",      label: "Coupon Code",     icon: Ticket },
      { to: "/admin/transactions", label: "Payment Ledger",  icon: ArrowRightLeft },
    ],
  },
  {
    title: "Product",
    accent: "#382d24",
    iconColor: "text-[#382d24]",
    items: [
      { to: "/admin/products",         label: "Products",        icon: ListCollapse },
      { to: "/admin/products/reviews", label: "Product Reviews", icon: Star },
    ],
  },
  {
    title: "Content",
    accent: "#2d5a27",
    iconColor: "text-[#2d5a27]",
    items: [
      { to: "/admin/content/hero-slides",       label: "Hero Slides",      icon: ImageIcon },
      { to: "/admin/content/home-categories",   label: "Home Categories",  icon: LayoutList },
      { to: "/admin/content/signature-pieces",  label: "Signature Pieces", icon: Award },
      { to: "/admin/content/featured-products", label: "New In",           icon: Sparkles },
      { to: "/admin/content/coming-soon",       label: "Coming Soon",      icon: Zap },
    ],
  },
];

// Section accent colours for the section header badge
const SECTION_META: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "Main Menu": {
    bg:     "bg-[#224870]/10",
    text:   "text-[#224870]",
    border: "border-[#224870]/20",
    dot:    "bg-[#224870]",
  },
  "Product": {
    bg:     "bg-[#382d24]/10",
    text:   "text-[#382d24]",
    border: "border-[#382d24]/20",
    dot:    "bg-[#382d24]",
  },
  "Content": {
    bg:     "bg-[#2d5a27]/10",
    text:   "text-[#2d5a27]",
    border: "border-[#2d5a27]/20",
    dot:    "bg-[#2d5a27]",
  },
};

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebarStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "h-screen bg-background fixed left-0 top-0 z-30 flex flex-col transition-all duration-300 ease-in-out font-sans select-none",
        "border-r border-neutral-200/80 shadow-[2px_0_20px_rgba(0,0,0,0.04)]",
        isCollapsed ? "w-[68px]" : "w-[256px]"
      )}
    >
      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div className={cn(
        "flex flex-col items-center justify-center border-b border-neutral-200/70 shrink-0 transition-all duration-300",
        isCollapsed ? "h-16 py-1" : "pt-1 pb-1"
      )}>
        {isCollapsed ? (
          <img src={logoIcon} alt="DD" className="w-9 h-9 object-contain mix-blend-multiply" />
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <img src={logoIcon} alt="Drip Doggy" className="w-14 h-14 object-contain mix-blend-multiply block" />
            <img src={logo} alt="Drip Doggy" className="h-22 w-auto max-w-[180px] object-contain mix-blend-multiply block -mt-10" />
          </div>
        )}
      </div>

      {/* ── Nav Sections ─────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 ">
        {menuSections.map((section, sIdx) => {
          const meta = SECTION_META[section.title];
          return (
            <div key={sIdx} className="px-3">
              {/* Section Header */}
              {!isCollapsed ? (
                <div className={cn(
                  "flex items-center gap-2 px-2 py-1.5 mb-1 rounded-md border",
                  meta.bg, meta.border
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", meta.dot)} />
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-[0.25em] whitespace-nowrap",
                    meta.text
                  )}>
                    {section.title}
                  </span>
                </div>
              ) : (
                /* Collapsed: divider line */
                <div className={cn("h-px w-6 mx-auto mb-2 mt-3 rounded-full", meta.dot, "opacity-40")} />
              )}

              {/* Items */}
              <div className="space-y-0.5 mb-3">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center rounded-lg transition-all duration-150 group relative",
                        isCollapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2 gap-3",
                        isActive
                          ? cn(
                              "text-white shadow-sm",
                              section.title === "Main Menu" && "bg-[#224870]",
                              section.title === "Product"   && "bg-[#382d24]",
                              section.title === "Admin"     && "bg-[#7c3a3a]",
                              section.title === "Content"   && "bg-[#2d5a27]",
                            )
                          : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive ? "text-white" : cn("text-neutral-400 group-hover:text-neutral-700", !isActive && section.iconColor && "group-[.active]:text-current")
                        )} />

                        {/* Label (hidden when collapsed) */}
                        <span className={cn(
                          "text-[10px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-300 overflow-hidden",
                          isCollapsed ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"
                        )}>
                          {item.label}
                        </span>

                        {/* Active left-bar indicator (expanded only) */}
                        {isActive && !isCollapsed && (
                          <span className="absolute right-2.5 w-1 h-1 rounded-full bg-white/60" />
                        )}

                        {/* Collapsed tooltip */}
                        {isCollapsed && (
                          <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-neutral-900 text-white text-[9px] font-semibold tracking-wider uppercase rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
                            {item.label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── Bottom: Sign Out ───────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-neutral-200/70 p-3">
        <button
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
          title="Sign Out"
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2.5 text-[#b2533e] hover:text-white hover:bg-[#b2533e] border border-[#b2533e]/30 hover:border-[#b2533e] transition-all duration-150 cursor-pointer bg-transparent rounded-none",
            isCollapsed ? "justify-center px-0" : ""
          )}
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          <span className={cn(
            "text-[9px] font-black tracking-widest uppercase whitespace-nowrap transition-all duration-300 overflow-hidden",
            isCollapsed ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
          )}>
            Sign Out
          </span>
        </button>
      </div>

      {/* ── Collapse Toggle ────────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -right-3 z-40",
          "w-6 h-6 rounded-full bg-white border border-neutral-200 shadow-md",
          "flex items-center justify-center text-neutral-400 hover:text-[#224870] hover:border-[#224870]/40",
          "transition-all duration-200 cursor-pointer"
        )}
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
