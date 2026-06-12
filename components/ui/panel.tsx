export function Panel({
  title,
  subtitle,
  action,
  className = "",
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`surface rounded-card ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-crema-200/8 px-5 py-3.5">
          <div>
            {title && <h2 className="text-sm font-semibold text-crema-50">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[11.5px] text-crema-300/45">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
