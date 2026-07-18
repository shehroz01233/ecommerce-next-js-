import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight">
              E-Shop
            </Link>
            <p className="text-sm text-muted mt-3 max-w-xs leading-relaxed">
              Quality products, honest prices, fast delivery.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-sm text-muted hover:text-foreground transition-colors duration-150">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-muted hover:text-foreground transition-colors duration-150">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-sm text-muted hover:text-foreground transition-colors duration-150">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Account</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/orders" className="text-sm text-muted hover:text-foreground transition-colors duration-150">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-muted hover:text-foreground transition-colors duration-150">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted hover:text-foreground transition-colors duration-150">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-muted">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-muted">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} E-Shop
          </p>
          <p className="text-xs text-muted/60">
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
