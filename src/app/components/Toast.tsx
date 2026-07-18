"use client";

import { useState, useEffect, useRef, useCallback, createContext, useContext, ReactNode } from "react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  addToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let globalId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, duration = 3000) => {
      const id = ++globalId;
      setToasts((prev) => [...prev.slice(-4), { id, type, message }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 max-w-sm" aria-label="Notifications">
          {toasts.map((toast, i) => (
            <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} offset={i} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

function Toast({
  id: _id,
  type = "info",
  message,
  onClose,
  offset,
}: {
  id: number;
  type?: ToastType;
  message: string;
  onClose: () => void;
  offset: number;
}) {
  const [visible, setVisible] = useState(true);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    let innerTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      setVisible(false);
      innerTimer = setTimeout(() => onCloseRef.current(), 200);
    }, 2800);
    return () => {
      clearTimeout(timer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, []);

  const colors: Record<ToastType, string> = {
    success: "border-success/30 bg-success/5 text-success",
    error: "border-destructive/30 bg-destructive/5 text-destructive",
    info: "border-border bg-card text-foreground",
    warning: "border-warning/30 bg-warning/5 text-yellow-700",
  };

  const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    info: "i",
    warning: "!",
  };

  const role = type === "error" || type === "warning" ? "alert" : "status";

  return (
    <div
      role={role}
      className={`border rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 transition-all duration-200 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      } ${colors[type]}`}
      style={{ transform: `translateY(-${offset * 60}px)` }}
    >
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-current/10 flex-shrink-0">
        {icons[type]}
      </span>
      <span className="text-sm flex-1">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 200);
        }}
        className="text-current/40 hover:text-current transition-colors ml-1"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
