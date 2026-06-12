import { Users } from "lucide-react";
import type { PreviewAudiencePayload } from "@/lib/types";
import { compact, daysAgo, initials, money, nameHue, num } from "@/lib/format";
import { ToolCard } from "./tool-card";

export function AudiencePreviewCard({ payload }: { payload: PreviewAudiencePayload }) {
  const { count, sample } = payload;
  return (
    <ToolCard Icon={Users} label="Audience preview">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-semibold tracking-tight text-crema-50">
              {num(count)}
            </span>
            <span className="text-sm text-crema-300/60">customers</span>
          </div>
          <p className="mt-1 text-xs text-crema-300/50">
            Matched the proposed segment rules
          </p>
        </div>
        {payload.ruleTreeId && (
          <code className="rounded-lg bg-crema-200/5 px-2 py-1 font-mono text-[10px] text-crema-300/50">
            {payload.ruleTreeId}
          </code>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-crema-200/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-crema-200/[0.03] text-[10px] uppercase tracking-wider text-crema-300/45">
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 text-right font-medium">Last order</th>
              <th className="px-3 py-2 text-right font-medium">LTV</th>
            </tr>
          </thead>
          <tbody>
            {sample.map((c) => (
              <tr key={c.id} className="border-t border-crema-200/[0.06]">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold text-espresso-950"
                      style={{ background: `hsl(${nameHue(c.name)} 70% 62%)` }}
                    >
                      {initials(c.name)}
                    </span>
                    <span className="font-medium text-crema-100">{c.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right text-crema-300/70">
                  {daysAgo(c.lastOrderDaysAgo)}
                </td>
                <td className="px-3 py-2.5 text-right font-medium text-caramel-300">
                  {money(c.lifetimeValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {count > sample.length && (
        <p className="mt-2.5 text-center text-xs text-crema-300/40">
          + {compact(count - sample.length)} more in this segment
        </p>
      )}
    </ToolCard>
  );
}
