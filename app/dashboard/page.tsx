"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AreaTrend, BarGroups, Donut, MultiLine } from "@/components/charts/chart-kit";
import { HEX } from "@/lib/colors";
import { num } from "@/lib/format";
import {
  audienceSplit,
  channelPerf,
  engagementSeries,
  kpis,
  revenueSeries,
} from "@/lib/mock-dashboard";

const totalAudience = audienceSplit.reduce((s, x) => s + x.value, 0);

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        crumb={["Crema CRM", "Dashboard"]}
        title="Overview"
        subtitle="Performance across every campaign the agent has run."
        actions={
          <Link
            href="/"
            className="btn-caramel ring-focus inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold"
          >
            <Sparkles size={15} strokeWidth={2.4} />
            New campaign
          </Link>
        }
      />

      <div className="flex flex-col gap-4 p-5 sm:p-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => (
            <KpiCard key={k.label} kpi={k} />
          ))}
        </div>

        {/* Revenue + audience split */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel
            className="lg:col-span-2"
            title="Attributed revenue"
            subtitle="Revenue closed within 7 days of a send"
            action={<span className="text-[11.5px] text-crema-300/40">Last 6 months</span>}
          >
            <AreaTrend
              data={revenueSeries}
              dataKey="revenue"
              xKey="label"
              formatter={(v) => `$${num(Number(v))}`}
            />
          </Panel>

          <Panel title="Audience split" subtitle={`${num(totalAudience)} total customers`}>
            <div className="relative">
              <Donut data={audienceSplit} />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-semibold text-crema-50">
                  {num(totalAudience)}
                </span>
                <span className="text-[11px] text-crema-300/45">customers</span>
              </div>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {audienceSplit.map((s) => (
                <li key={s.name} className="flex items-center gap-2 text-[12px]">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                  <span className="text-crema-200/70">{s.name}</span>
                  <span className="ml-auto font-medium text-crema-100">{num(s.value)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Engagement + activity */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel
            className="lg:col-span-2"
            title="Engagement over time"
            subtitle="Delivered, opened and clicked per day"
            action={
              <div className="flex items-center gap-3 text-[11px]">
                {[
                  { l: "Delivered", c: HEX.caramel400 },
                  { l: "Opened", c: HEX.clay400 },
                  { l: "Clicked", c: HEX.leaf },
                ].map((x) => (
                  <span key={x.l} className="flex items-center gap-1.5 text-crema-300/55">
                    <span className="h-2 w-2 rounded-full" style={{ background: x.c }} />
                    {x.l}
                  </span>
                ))}
              </div>
            }
          >
            <MultiLine
              data={engagementSeries}
              xKey="day"
              series={[
                { key: "delivered", label: "Delivered", color: HEX.caramel400 },
                { key: "opened", label: "Opened", color: HEX.clay400 },
                { key: "clicked", label: "Clicked", color: HEX.leaf },
              ]}
            />
          </Panel>

          <Panel title="Recent activity">
            <ActivityFeed />
          </Panel>
        </div>

        {/* Channel performance */}
        <Panel
          title="Channel performance"
          subtitle="Messages sent by channel, with click-through rate"
        >
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <BarGroups
              data={channelPerf}
              xKey="channel"
              dataKey="sent"
              formatter={(v) => num(Number(v))}
              height={210}
            />
            <ul className="flex flex-col gap-2.5">
              {channelPerf.map((c) => (
                <li
                  key={c.key}
                  className="flex items-center justify-between rounded-lg border border-crema-200/8 px-3 py-2.5"
                >
                  <span className="flex items-center gap-2 text-[13px] text-crema-100">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                    {c.channel}
                  </span>
                  <span className="flex items-baseline gap-3 text-[12px]">
                    <span className="text-crema-300/50">{num(c.sent)} sent</span>
                    <span className="font-semibold" style={{ color: c.color }}>
                      {c.ctr}% CTR
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>
    </div>
  );
}
