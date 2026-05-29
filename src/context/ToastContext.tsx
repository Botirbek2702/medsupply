"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const config: Record<ToastType, { icon: any; color: string; bg: string }> = {
  success: { icon: CheckCircle, color: "var(--success)", bg: "var(--success-light)" },
  error: { icon: XCircle, color: "var(--danger)", bg: "var(--danger-light)" },
  info: { icon: Info, color: "var(--primary)", bg: "var(--primary-light)" },
  warning: { icon: AlertTriangle, color: "var(--warning)", bg: "var(--warning-light)" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type: ToastType, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  const toast = {
    success: (m: string) => push("success", m),
    error: (m: string) => push("error", m),
    info: (m: string) => push("info", m),
    warning: (m: string) => push("warning", m),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => {
          const c = config[t.type];
          const Icon = c.icon;
          return (
            <div key={t.id} className="toast-item" style={{ borderLeft: `4px solid ${c.color}` }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: c.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={c.color} />
              </div>
              <p style={{ flex: 1, fontSize: "14px", color: "var(--text-main)", margin: 0, lineHeight: 1.4 }}>
                {t.message}
              </p>
              <button
                onClick={() => remove(t.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", flexShrink: 0 }}
                aria-label="Yopish"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}
