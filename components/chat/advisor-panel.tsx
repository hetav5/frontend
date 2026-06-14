"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Loader2,
  TrendingUp,
  Swords,
  Lightbulb,
  ArrowRight,
  History,
} from "lucide-react";
import { getAdvisorBriefing, getCampaigns } from "@/lib/api";
import type { AdvisorBriefing, CampaignSummary } from "@/lib/types";
import { CHANNEL_META } from "@/lib/channel";

const STATUS_CLS: Record<string, string> = {
  SENT: "text-leaf-500",
  SENDING: "text-caramel-300",
  DRAFT: "text-crema-300/50",
  FAILED: "text-berry-500",
};

const PRIORITY: Record<string, string> = {
  high: "bg-berry-500/12 text-berry-500",
  medium: "bg-caramel-400/12 text-caramel-300",
  low: "bg-crema-200/8 text-crema-300/60",
};

export function AdvisorPanel({ onPick }: { onPick: (text: string) => void }) {
  const [recent, setRecent] = useState<CampaignSummary[]>([]);
  const [data, setData] = useState<AdvisorBriefing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History loads automatically (cheap); the AI briefing is on-demand.
  useEffect(() => {
    getCampaigns()
      .then((c) => setRecent(c.slice(0, 4)))
      .catch(() => setRecent([]));
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      setData(await getAdvisorBriefing());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate briefing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 flex w-full flex-col gap-4 text-left">
      {/* Pick up where you left off */}
      {recent.length > 0 && (
        <section>
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-crema-300/40">
            <History size={12} /> Pick up where you left off
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {recent.map((c) => {
              const meta = CHANNEL_META[c.channel];
              const Icon = meta.Icon;
              return (
                <Link
                  key={c.id}
                  href={`/campaigns/${c.id}`}
                  className="surface hover-lift flex items-center gap-2.5 rounded-xl p-3"
                >
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                    style={{ background: `color-mix(in srgb, ${meta.color} 14%, transparent)`, color: meta.color }}
                  >
                    <Icon size={14} strokeWidth={2.2} />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[13px] font-medium text-crema-50">{c.name}</span>
                    <span className={`text-[11px] font-medium ${STATUS_CLS[c.status] ?? "text-crema-300/50"}`}>
                      {c.status}
                    </span>
                  </span>
                  <ArrowRight size={14} className="ml-auto shrink-0 text-crema-300/25" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* AI strategy briefing */}
      <section className="surface rounded-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-caramel-400/12 text-caramel-300">
              <Sparkles size={16} strokeWidth={2.3} />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-crema-50">Strategy briefing</p>
              <p className="text-[11.5px] text-crema-300/45">
                Trends, competitor plays & opportunities from your data
              </p>
            </div>
          </div>
          {data && (
            <span className="shrink-0 text-[10.5px] uppercase tracking-wider text-crema-300/35">
              AI advisory
            </span>
          )}
        </div>

        {!data && !loading && (
          <button
            onClick={generate}
            className="btn-caramel ring-focus mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold"
          >
            <Sparkles size={15} strokeWidth={2.4} />
            Generate briefing
          </button>
        )}

        {loading && (
          <div className="mt-5 flex items-center gap-2 text-[13px] text-crema-300/45">
            <Loader2 size={18} className="animate-spin text-caramel-300" />
            Thinking through your audience and the market…
          </div>
        )}

        {error && !loading && (
          <p className="mt-4 text-[12.5px] text-clay-400">{error}</p>
        )}

        {data && !loading && (
          <div className="mt-4 flex flex-col gap-4">
            <Group title="Current trends" Icon={TrendingUp} color="text-leaf-500" items={data.briefing.trends} />
            <Group title="What competitors are doing" Icon={Swords} color="text-clay-400" items={data.briefing.competitorMoves} />

            {data.briefing.opportunities.length > 0 && (
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-caramel-300">
                  <Lightbulb size={13} /> Opportunities for you
                </p>
                <ul className="flex flex-col gap-2">
                  {data.briefing.opportunities.map((o, i) => (
                    <li key={i}>
                      <button
                        onClick={() => onPick(o.title)}
                        className="group flex w-full items-start gap-3 rounded-lg border border-crema-200/8 px-3 py-2.5 text-left transition hover:border-caramel-400/30 hover:bg-caramel-400/[0.04]"
                      >
                        <Sparkles size={14} className="mt-0.5 shrink-0 text-caramel-300" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-crema-100">{o.title}</span>
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${PRIORITY[o.priority] ?? PRIORITY.low}`}>
                              {o.priority}
                            </span>
                          </span>
                          <span className="mt-0.5 block text-[12px] text-crema-300/55">{o.detail}</span>
                        </span>
                        <ArrowRight size={14} className="ml-auto mt-0.5 shrink-0 text-crema-300/25 transition group-hover:translate-x-0.5 group-hover:text-caramel-300" />
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-crema-300/30">
                  Tip: click an opportunity to start it with the agent.
                </p>
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
      </section>
    </div>
  );
}

function Group({
  title,
  Icon,
  color,
  items,
}: {
  title: string;
  Icon: typeof TrendingUp;
  color: string;
  items: { title: string; detail: string }[];
}) {
  if (!items.length) return null;
  return (
    <div>
      <p className={`mb-1.5 flex items-center gap-1.5 text-[12px] font-medium ${color}`}>
        <Icon size={13} /> {title}
      </p>
      <ul className="flex flex-col gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="text-[12.5px] leading-relaxed">
            <span className="font-medium text-crema-100">{it.title}.</span>{" "}
            <span className="text-crema-300/55">{it.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
