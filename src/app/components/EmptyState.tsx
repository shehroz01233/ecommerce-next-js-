import { ReactNode } from "react";

export default function EmptyState({
  icon = "📦",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted/20 flex items-center justify-center mb-6">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-muted mb-6 max-w-sm leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}
