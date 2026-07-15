import { Suspense } from "react";
import { Outlet, Navigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuthStore } from "@/app/store/auth-store";
import { useSidebarStore } from "@/app/store/sidebar-store";
import { cn } from "@/lib/utils";

export function AdminPageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="space-y-1">
          <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
          <div className="h-3 w-64 bg-neutral-150 dark:bg-neutral-850/50 rounded-md"></div>
        </div>
        <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
      </div>

      {/* Stats Cards Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg space-y-2 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-neutral-150 dark:bg-neutral-850/50 rounded-md"></div>
              <div className="h-6 w-6 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
            </div>
            <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
            <div className="h-3 w-32 bg-neutral-100 dark:bg-neutral-800 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-lg p-4 space-y-3 shadow-xs">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
          <div className="h-6 w-24 bg-neutral-150 dark:bg-neutral-850/50 rounded-md"></div>
        </div>
        
        {/* Table Rows */}
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-50 dark:border-neutral-850/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
                <div className="space-y-1">
                  <div className="h-3 w-32 bg-neutral-150 dark:bg-neutral-850/50 rounded-md"></div>
                  <div className="h-2.5 w-20 bg-neutral-100 dark:bg-neutral-800 rounded-md"></div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-3 w-16 bg-neutral-150 dark:bg-neutral-850/50 rounded-md"></div>
                <div className="h-3 w-12 bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { isAuthenticated } = useAuthStore();
  const { isCollapsed } = useSidebarStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <TopBar />

      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-[68px]" : "ml-[260px]"
        )}
      >
        <div className="pt-2 px-6 pb-6">
          <Suspense fallback={<AdminPageSkeleton />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
