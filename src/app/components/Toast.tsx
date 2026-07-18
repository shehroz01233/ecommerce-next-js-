"use client";

import { useState, useEffect, useRef } from "react";

type ToastType = "success" | "error" | "info" | "warning";

export default function Toast({
  type = "info",
  message,
  onClose,
}: {
  type?: ToastType;
  message: string;
  onClose: () => void;
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

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 border rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 max-w-sm transition-all duration-200 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      } ${colors[type]}`}
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
