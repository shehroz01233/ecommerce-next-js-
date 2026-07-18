export default function ProductCardSkeleton() {
  return (
    <div className="p-3 border border-border rounded-2xl bg-card">
      <div className="aspect-[4/3] skeleton rounded-xl mb-3" />
      <div className="h-3.5 skeleton rounded-md w-3/4 mb-2" />
      <div className="h-3 skeleton rounded-md w-1/4 mb-3" />
      <div className="flex items-center justify-between">
        <div className="h-4 skeleton rounded-md w-16" />
        <div className="h-8 skeleton rounded-lg w-20" />
      </div>
    </div>
  );
}
