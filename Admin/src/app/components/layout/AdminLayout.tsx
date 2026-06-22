import { Outlet, Navigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuthStore } from "@/app/store/auth-store";
import { useSidebarStore } from "@/app/store/sidebar-store";
import { cn } from "@/lib/utils";

export function AdminLayout() {
  const { isAuthenticated } = useAuthStore();
  const { isCollapsed } = useSidebarStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Sidebar />
      <TopBar />

      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          isCollapsed ? "ml-[68px]" : "ml-[260px]"
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
