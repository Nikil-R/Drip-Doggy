import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

const ICONS: Record<ToastType, any> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const COLORS: Record<ToastType, { border: string; bg: string; icon: string; text: string }> = {
  success: { border: "border-green-200", bg: "bg-green-50", icon: "text-green-600", text: "text-green-800" },
  error: { border: "border-red-200", bg: "bg-red-50", icon: "text-red-600", text: "text-red-800" },
  warning: { border: "border-amber-200", bg: "bg-amber-50", icon: "text-amber-600", text: "text-amber-800" },
  info: { border: "border-blue-200", bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-800" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          const c = COLORS[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto border ${c.border} ${c.bg} p-3.5 flex items-start gap-3 shadow-lg animate-slide-up`}
              style={{ animation: "slideUp 0.3s ease-out" }}
            >
              <Icon className={`h-4 w-4 ${c.icon} flex-shrink-0 mt-0.5 stroke-[1.5]`} />
              <div className="flex-1 min-w-0">
                <p className={`text-[9px] font-extrabold tracking-wider uppercase ${c.text}`}>{toast.title}</p>
                {toast.message && (
                  <p className="text-[8px] text-neutral-500 font-medium mt-0.5">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 bg-transparent border-none cursor-pointer"
              >
                <X className="h-3 w-3 stroke-[2]" />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
