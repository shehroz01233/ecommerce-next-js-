import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <p className="text-8xl font-bold text-muted/20 mb-4">404</p>
      <h2 className="text-xl font-semibold mb-2">Page not found</h2>
      <p className="text-sm text-muted mb-6 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}
