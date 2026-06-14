"use client";

import { useState } from "react";
import { Sparkles, Loader2, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { getCampaignInsights } from "@/lib/api";
import type { CampaignInsights } from "@/lib/types";
import { Panel } from "@/components/ui/panel";

const ASSESSMENT: Record<
  CampaignInsights["analysis"]["assessment"],
  { label: string; cls: string }
> = {
  strong: { label: "Strong", cls: "border-leaf-500/30 bg-leaf-500/10 text-leaf-500" },
  moderate: { label: "Moderate", cls: "border-caramel-400/30 bg-caramel-400/10 text-caramel-300" },
  weak: { label: "Needs work", cls: "border-berry-500/30 bg-berry-500/10 text-berry-500" },
};

const PRIORITY: Record<string, string> = {
  high: "bg-berry-500/12 text-berry-500",
  medium: "bg-caramel-400/12 text-caramel-300",
  low: "bg-crema-200/8 text-crema-300/60",
};

export function PerformanceReview({ campaignId }: { campaignId: string }) {
  const [data, setData] = useState<CampaignInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      setData(await getCampaignInsights(campaignId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate review");
    } finally {
      setLoading(false);
    }
  }

  const assessment = data ? ASSESSMENT[data.analysis.assessment] : null;

  return (
    <Panel
      title="AI performance review"
      subtitle="Autonomous analysis of this campaign's real results"
      action={
        data && (
          <span className="text-[10.5px] uppercase tracking-wider text-crema-300/35">
            AI-generated
          </span>
        )
      }
    >
      {!data && !loading && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="max-w-sm text-[13px] text-crema-300/55">
            Generate an AI review of how this campaign performed and what to do next —
            grounded in the real funnel numbers above.
          </p>
          <button
            onClick={generate}
            className="btn-caramel ring-focus inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold"
          >
            <Sparkles size={15} strokeWidth={2.4} />
            Generate review
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-2 py-10 text-center text-[13px] text-crema-300/45">
          <Loader2 size={20} className="animate-spin text-caramel-300" />
          Analysing performance…
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-[12.5px] text-clay-400">{error}</p>
          <button
            onClick={generate}
            className="rounded-lg border border-crema-200/15 px-4 py-2 text-[12.5px] text-crema-200/80 hover:bg-crema-200/5"
          >
            Try again
          </button>
        </div>
      )}

      {data && !loading && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-[16px] font-semibold leading-snug text-crema-50">
                {data.analysis.headline}
              </p>
              <p className="mt-1 text-[11.5px] text-crema-300/40">
                Running {data.daysSinceLaunch} day{data.daysSinceLaunch === 1 ? "" : "s"}
              </p>
            </div>
            {assessment && (
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${assessment.cls}`}
              >
                {assessment.label}
              </span>
            )}
          </div>

          <p className="text-[13px] leading-relaxed text-crema-200/75">
            {data.analysis.summary}
          </p>

          {(data.analysis.highlights.length > 0 || data.analysis.concerns.length > 0) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {data.analysis.highlights.length > 0 && (
                <List
                  title="What worked"
                  Icon={TrendingUp}
                  color="text-leaf-500"
                  items={data.analysis.highlights}
                />
              )}
              {data.analysis.concerns.length > 0 && (
                <List
                  title="What to watch"
                  Icon={AlertTriangle}
                  color="text-clay-400"
                  items={data.analysis.concerns}
                />
              )}
            </div>
          )}

          {data.analysis.recommendations.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-crema-300/40">
                Recommended next steps
              </p>
              <ul className="flex flex-col gap-2">
                {data.analysis.recommendations.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-crema-200/8 px-3 py-2.5"
                  >
                    <ArrowRight size={15} className="mt-0.5 shrink-0 text-caramel-300" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-crema-100">{r.action}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                            PRIORITY[r.priority] ?? PRIORITY.low
                          }`}
                        >
                          {r.priority}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-crema-300/55">{r.rationale}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={generate}
            className="self-start text-[11.5px] text-crema-300/45 transition hover:text-caramel-300"
          >
            ↻ Regenerate
          </button>
        </div>
      )}
    </Panel>
  );
}

function List({
  title,
  Icon,
  color,
  items,
}: {
  title: string;
  Icon: typeof TrendingUp;
  color: string;
  items: string[];
}) {
  return (
    <div className="rounded-lg border border-crema-200/8 p-3">
      <p className={`mb-1.5 flex items-center gap-1.5 text-[12px] font-medium ${color}`}>
        <Icon size={13} /> {title}
      </p>
      <ul className="flex flex-col gap-1">
        {items.map((it, i) => (
          <li key={i} className="text-[12px] leading-relaxed text-crema-200/70">
            • {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
