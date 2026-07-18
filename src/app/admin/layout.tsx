import ProtectedRoute from "../components/ProtectedRoute";

export const metadata = {
  title: "Admin",
  robots: { noindex: true, nofollow: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute adminOnly>{children}</ProtectedRoute>;
}
