import type { Funnel } from "@/lib/types";
import { num } from "@/lib/format";

const STAGES: { key: keyof Funnel; label: string; color: string }[] = [
  { key: "sent", label: "Sent", color: "var(--color-caramel-400)" },
  { key: "delivered", label: "Delivered", color: "var(--color-caramel-300)" },
  { key: "opened", label: "Opened", color: "var(--color-clay-400)" },
  { key: "read", label: "Read", color: "var(--color-ch-rcs)" },
  { key: "clicked", label: "Clicked", color: "var(--color-leaf-500)" },
];

export function FunnelChart({ funnel }: { funnel: Funnel }) {
  const max = Math.max(funnel.sent, 1);
  return (
    <div className="flex flex-col gap-3">
      {STAGES.map((stage, i) => {
        const value = funnel[stage.key];
        const pct = Math.round((value / max) * 100);
        const prev = i === 0 ? value : funnel[STAGES[i - 1].key];
        const stepPct = prev > 0 ? Math.round((value / prev) * 100) : 0;
        return (
          <div key={stage.key}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="flex items-center gap-2 text-crema-200/80">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: stage.color }} />
                {stage.label}
              </span>
              <span className="flex items-baseline gap-2">
                <span className="font-display text-base font-semibold text-crema-50">
                  {num(value)}
                </span>
                {i > 0 && (
                  <span className="text-[11px] text-crema-300/40">{stepPct}%</span>
                )}
              </span>
            </div>
            <div className="h-7 overflow-hidden rounded-lg bg-crema-200/[0.04]">
              <div
                className="flex h-full origin-left items-center rounded-lg transition-all duration-700 ease-out"
                style={{
                  width: `${Math.max(pct, value > 0 ? 4 : 0)}%`,
                  background: `linear-gradient(90deg, ${stage.color}, color-mix(in srgb, ${stage.color} 55%, transparent))`,
                  boxShadow: `0 0 24px -6px ${stage.color}`,
                }}
              />
            </div>
          </div>
        );
      })}

      {funnel.failed > 0 && (
        <div className="mt-1 flex items-center justify-between rounded-lg border border-berry-500/20 bg-berry-500/5 px-3 py-2 text-sm">
          <span className="flex items-center gap-2 text-berry-500">
            <span className="h-2.5 w-2.5 rounded-full bg-berry-500" />
            Failed
          </span>
          <span className="font-medium text-berry-500">{num(funnel.failed)}</span>
        </div>
      )}
    </div>
  );
}
