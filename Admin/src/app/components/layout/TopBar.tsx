import { useAuthStore } from "@/app/store/auth-store";
import { useSidebarStore } from "@/app/store/sidebar-store";
import { useNavigate } from "react-router";
import { Menu, LogOut, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { user, logout } = useAuthStore();
  const { isCollapsed } = useSidebarStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header
      className={cn(
        "h-16 bg-white border-b border-border fixed top-0 right-0 z-20 flex items-center justify-between px-6 transition-all duration-300",
        isCollapsed ? "left-[68px]" : "left-[260px]"
      )}
    >
      {/* Left: Mobile menu + page title area */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 text-muted hover:text-accent rounded-lg hover:bg-muted transition-colors cursor-pointer bg-transparent border-none"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 border border-border rounded-lg w-72">
          <Search className="w-4 h-4 text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none text-sm text-gray-700 placeholder-muted focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 text-muted hover:text-accent rounded-lg hover:bg-muted transition-colors cursor-pointer bg-transparent border-none">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* User profile */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-muted leading-tight">
              {user?.email || "admin@dripdoggy.com"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 text-muted hover:text-danger rounded-lg hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none ml-1"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
