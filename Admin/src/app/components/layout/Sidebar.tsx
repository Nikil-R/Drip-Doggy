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
  Grid3X3,
  Zap,
  Package,
  Settings2,
  Palette,
  Sparkles,
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
      { to: "/admin/orders",       label: "Orders",          icon: ShoppingBag },
      { to: "/admin/customers",    label: "Customers",       icon: Users },
      { to: "/admin/coupons",      label: "Coupon Code",     icon: Ticket },
      { to: "/admin/categories",   label: "Categories",      icon: FolderKanban },
      { to: "/admin/transactions", label: "Payments Ledger", icon: ArrowRightLeft },
      { to: "/admin/brands",       label: "Brand",           icon: Crown },
    ],
  },
  {
    title: "Product",
    accent: "#382d24",
    iconColor: "text-[#382d24]",
    items: [
      { to: "/admin/products",         label: "Product List",    icon: ListCollapse },
      { to: "/admin/products/media",   label: "Product Media",   icon: ImageIcon },
      { to: "/admin/products/reviews", label: "Product Reviews", icon: Star },
    ],
  },
  {
    title: "Admin",
    accent: "#7c3a3a",
    iconColor: "text-[#7c3a3a]",
    items: [
      { to: "/admin/roles",     label: "Admin Roles",      icon: UserCheck },
      { to: "/admin/authority", label: "Control Authority", icon: ShieldAlert },
    ],
  },
  {
    title: "Content",
    accent: "#2d5a27",
    iconColor: "text-[#2d5a27]",
    items: [
      { to: "/admin/content/hero-slides",      label: "Hero Slides",         icon: ImageIcon },
      { to: "/admin/content/featured-products",label: "New In",              icon: Sparkles },
      { to: "/admin/content/signature-pieces", label: "Signature Pieces",    icon: Award },
      { to: "/admin/content/home-categories",  label: "Home Categories",     icon: LayoutList },
      { to: "/admin/content/footer",           label: "Footer Settings",     icon: Copyright },
      { to: "/admin/content/navigation",       label: "Navigation Menu",     icon: Menu },
      { to: "/admin/content/site-pages",       label: "Site Pages",          icon: FileText },
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
  "Admin": {
    bg:     "bg-[#7c3a3a]/10",
    text:   "text-[#7c3a3a]",
    border: "border-[#7c3a3a]/20",
    dot:    "bg-[#7c3a3a]",
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
        "flex items-center border-b border-neutral-200/70 shrink-0 overflow-hidden transition-all duration-300",
        isCollapsed ? "h-16 px-3 justify-center" : "h-16 px-4"
      )}>
        {isCollapsed ? (
          <img src={logoIcon} alt="DD" className="w-10 h-20 object-contain mix-blend-multiply" />
        ) : (
          <div className="flex items-center gap-2.5 w-full">
            <img src={logoIcon} alt="DD" className="w-15 h-20 object-contain mix-blend-multiply shrink-0" />
            <div className="overflow-hidden">
              <img src={logo} alt="Drip Doggy" className="h-24 w-auto object-contain mix-blend-multiply" />
              <p className="text-[7px] font-black tracking-[0.3em] text-neutral-400 uppercase mt-0.5">Admin Console</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Nav Sections ─────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200">
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

      {/* ── Bottom: Profile + View Store ──────────────────────────────────── */}
      <div className="shrink-0 border-t border-neutral-200/70 bg-[#fef3df]">

        {/* View Store Link */}
        <div className="px-3 pt-3">
          <a
            href="https://dripdoggy.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            title={isCollapsed ? "View Storefront" : undefined}
            className={cn(
              "flex items-center gap-2 w-full rounded-lg border border-neutral-200 bg-white/60 hover:bg-white hover:border-[#224870]/40 transition-all duration-150 group",
              isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5"
            )}
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
            <span className={cn(
              "text-[9px] font-bold tracking-widest uppercase text-neutral-500 group-hover:text-neutral-800 whitespace-nowrap transition-all duration-300 overflow-hidden",
              isCollapsed ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
            )}>
              View Storefront
            </span>
          </a>
        </div>

        {/* Profile Row */}
        <div className={cn(
          "flex items-center gap-3 p-3 mt-2",
          isCollapsed ? "justify-center flex-col gap-2" : ""
        )}>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#224870]/10 border-2 border-[#224870]/20 flex items-center justify-center shrink-0 overflow-hidden">
            <img src={logoIcon} alt="Profile" className="w-6 h-6 object-contain mix-blend-multiply" />
          </div>

          {/* Name + Email */}
          <div className={cn(
            "flex-1 min-w-0 transition-all duration-300 overflow-hidden",
            isCollapsed ? "max-w-0 opacity-0" : "max-w-[140px] opacity-100"
          )}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 truncate">Nikil</p>
            <p className="text-[8px] text-neutral-400 truncate font-medium">nikil@dripdoggy.com</p>
          </div>

          {/* Logout */}
          <button
            onClick={() => logout()}
            title="Sign Out"
            className={cn(
              "p-1.5 rounded-md text-neutral-400 hover:text-[#b2533e] hover:bg-red-50 transition-all duration-150 bg-transparent border-none cursor-pointer shrink-0",
              isCollapsed ? "" : "ml-auto"
            )}
            aria-label="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
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
