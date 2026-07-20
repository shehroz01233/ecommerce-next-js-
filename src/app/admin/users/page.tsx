"use client";

export default function AdminUsersContent() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
      </div>
      <div className="bg-muted/10 border border-border rounded-xl p-8 text-center">
        <p className="text-muted text-sm">
          User management is not supported by this backend.
          User count is available on the admin dashboard.
        </p>
      </div>
    </div>
  );
}
