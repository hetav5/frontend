import type { LucideIcon } from "lucide-react";

export function ToolCard({
  Icon,
  label,
  accent,
  children,
}: {
  Icon: LucideIcon;
  label: string;
  accent?: string;
  children: React.ReactNode;
}) {
  const a = accent ?? "var(--color-caramel-400)";
  return (
    <div className="surface animate-rise overflow-hidden rounded-card">
      <div className="flex items-center gap-2.5 border-b border-crema-200/8 px-4 py-2.5">
        <span
          className="grid h-6 w-6 place-items-center rounded-md"
          style={{ background: `color-mix(in srgb, ${a} 16%, transparent)`, color: a }}
        >
          <Icon size={13} strokeWidth={2.4} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.13em]" style={{ color: a }}>
          {label}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
