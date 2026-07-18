export default function LoadingSpinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-4 w-4 border-[2px]",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-2",
  };

  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <div
        className={`${sizes[size]} rounded-full border-muted/30 border-t-foreground animate-spin`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
