"use client";

import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export default function ErrorFallback({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="text-6xl mb-4">!</div>
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted mb-6 max-w-md">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={reset}
        className="btn-primary px-6"
      >
        Try Again
      </button>
    </div>
  );
}
