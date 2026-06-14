"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCampaign, getCampaignAnalytics, IS_MOCK } from "@/lib/api";
import type { CampaignAnalytics, CampaignDetail } from "@/lib/types";
import { CHANNEL_META, ChannelChip } from "@/lib/channel";
import { HEX } from "@/lib/colors";
import { money, num } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { MultiLine } from "@/components/charts/chart-kit";
import { FunnelChart } from "./funnel-chart";
import { Stat } from "./stat";
import { PerformanceReview } from "./performance-review";

const POLL_MS = 2000;

interface HistoryPoint {
  t: string;
  delivered: number;
  opened: number;
  clicked: number;
}

export function CampaignView({ id }: { id: string }) {
  const [detail, setDetail] = useState<CampaignDetail | null>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [live, setLive] = useState(true);
  const tick = useRef(IS_MOCK ? 1 : 14);
  const step = useRef(0);

  useEffect(() => {
    let mounted = true;
    getCampaign(id).then((d) => mounted && setDetail(d));
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const a = await getCampaignAnalytics(id, tick.current);
        if (!mounted) return;
        setAnalytics(a);
        step.current += 1;
        setHistory((h) =>
          [
            ...h,
            {
              t: `${step.current * 2}s`,
              delivered: a.funnel.delivered,
              opened: a.funnel.opened,
              clicked: a.funnel.clicked,
            },
          ].slice(-20)
        );
        const full = IS_MOCK && tick.current >= 16;
        if (IS_MOCK) tick.current += 1;
        if (full) {
          setLive(false);
          return;
        }
      } catch {
        /* keep last good value */
      }
      timer = setTimeout(poll, POLL_MS);
    }

    poll();
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [id]);

  const meta = detail ? CHANNEL_META[detail.channel] : null;
  const ctr =
    analytics && analytics.funnel.delivered > 0
      ? Math.round((analytics.funnel.clicked / analytics.funnel.delivered) * 100)
      : null;

  return (
    <div className="flex flex-col">
      <PageHeader
        crumb={["Crema CRM", "Campaigns", detail?.name ?? "…"]}
        title={detail?.name ?? "Loading…"}
        subtitle={detail?.goalText}
        actions={<LiveBadge live={live} />}
      />

      <div className="flex flex-col gap-4 p-5 sm:p-8">
        <Link
          href="/campaigns"
          className="inline-flex w-fit items-center gap-1.5 text-[12.5px] text-crema-300/50 transition hover:text-caramel-300"
        >
          <ArrowLeft size={14} /> All campaigns
        </Link>

        {detail && (
          <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-crema-300/50">
            <ChannelChip channel={detail.channel} size="sm" />
            <span>·</span>
            <span>{num(detail.segmentCount)} customers in segment</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat
            label="Attributed revenue"
            value={analytics ? money(analytics.attributedRevenue) : "—"}
            sub="closed within 7 days"
            accent={meta?.color}
          />
          <Stat
            label="Attributed orders"
            value={analytics ? num(analytics.attributedOrders) : "—"}
            sub="after this send"
          />
          <Stat
            label="Click-through"
            value={ctr !== null ? `${ctr}%` : "—"}
            sub="of delivered"
          />
        </div>

        {/* Funnel + live trend */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Delivery funnel" subtitle="Sent → delivered → opened → read → clicked">
            {analytics ? (
              <FunnelChart funnel={analytics.funnel} />
            ) : (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-7 rounded-lg" />
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Receipts over time"
            subtitle="Live as callbacks land"
            action={<span className="text-[11.5px] text-crema-300/40">{live ? "every 2s" : "final"}</span>}
          >
            {history.length > 1 ? (
              <MultiLine
                data={history}
                xKey="t"
                series={[
                  { key: "delivered", label: "Delivered", color: HEX.caramel400 },
                  { key: "opened", label: "Opened", color: HEX.clay400 },
                  { key: "clicked", label: "Clicked", color: HEX.leaf },
                ]}
                height={236}
              />
            ) : (
              <div className="flex h-[236px] items-center justify-center text-[12.5px] text-crema-300/40">
                Waiting for the first receipts…
              </div>
            )}
          </Panel>
        </div>

        {/* Autonomous AI performance review */}
        <PerformanceReview campaignId={id} />
      </div>
    </div>
  );
}

function LiveBadge({ live }: { live: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
        live
          ? "border-leaf-500/30 bg-leaf-500/10 text-leaf-500"
          : "border-crema-200/15 bg-crema-200/5 text-crema-300/60"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${live ? "animate-pulse-soft bg-leaf-500" : "bg-crema-300/50"}`} />
      {live ? "Live" : "Complete"}
    </span>
  );
}
