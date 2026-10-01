export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-surface p-4 shadow-theme-xs ${className}`}>
      {children}
    </div>
  );
}
