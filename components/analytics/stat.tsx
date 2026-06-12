export function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="surface rounded-2xl p-5">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-crema-300/45">
        {label}
      </span>
      <div
        className="mt-1 font-display text-3xl font-semibold tracking-tight"
        style={{ color: accent ?? "var(--color-crema-50)" }}
      >
        {value}
      </div>
      {sub && <p className="mt-0.5 text-xs text-crema-300/50">{sub}</p>}
    </div>
  );
}
