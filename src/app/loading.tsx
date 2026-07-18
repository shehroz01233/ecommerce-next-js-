export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-muted/30 border-t-foreground animate-spin" />
      <p className="text-sm text-muted">Loading...</p>
    </div>
  );
}
