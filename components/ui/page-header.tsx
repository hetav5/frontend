import { ChevronRight } from "lucide-react";

export function PageHeader({
  crumb,
  title,
  subtitle,
  actions,
}: {
  crumb?: string[];
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b border-crema-200/8 bg-espresso-950/70 px-5 py-4 backdrop-blur-xl sm:px-8 sm:py-5 lg:sticky lg:top-0 lg:z-20">
      {crumb && crumb.length > 0 && (
        <nav className="mb-1.5 flex items-center gap-1 text-[11.5px] text-crema-300/40">
          {crumb.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={12} className="text-crema-300/25" />}
              <span className={i === crumb.length - 1 ? "text-crema-200/70" : ""}>{c}</span>
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-crema-50">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-[13.5px] text-crema-300/50">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
