"use client";

import Link from "next/link";

function sanitize(message: string): string {
  return message
    .replace(/\s*at\s+.*?\n?/g, "")
    .replace(/\s*\(.*?\)/g, "")
    .replace(/\s*https?:\/\/\S+/g, "")
    .replace(/^\s*$/gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const safeMessage = sanitize(error.message || "An unexpected error occurred.");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-sm text-muted mb-6 max-w-md">{safeMessage}</p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
        <Link href="/" className="btn-secondary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
