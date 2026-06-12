// Deterministic demo data for the admin dashboard charts.
// Replace with real API reads once the backend exposes aggregates.

import { HEX } from "./colors";

function seeded(n: number) {
  const x = Math.sin(n * 51.27) * 10000;
  return x - Math.floor(x);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export interface RevenuePoint {
  label: string;
  revenue: number;
  campaigns: number;
}

export const revenueSeries: RevenuePoint[] = MONTHS.map((label, i) => ({
  label,
  revenue: Math.round(4200 + i * 1350 + seeded(i + 2) * 2600),
  campaigns: 1 + Math.round(seeded(i + 9) * 3) + i,
}));

export interface SendPoint {
  day: string;
  delivered: number;
  opened: number;
  clicked: number;
}

export const engagementSeries: SendPoint[] = Array.from({ length: 14 }, (_, i) => {
  const base = 180 + seeded(i + 4) * 220;
  const delivered = Math.round(base);
  const opened = Math.round(delivered * (0.5 + seeded(i + 5) * 0.18));
  const clicked = Math.round(opened * (0.22 + seeded(i + 6) * 0.12));
  return { day: `${i + 1}`, delivered, opened, clicked };
});

export interface ChannelPerf {
  channel: string;
  key: "whatsapp" | "sms" | "email" | "rcs";
  sent: number;
  ctr: number;
  color: string;
}

export const channelPerf: ChannelPerf[] = [
  { channel: "WhatsApp", key: "whatsapp", sent: 3820, ctr: 34, color: HEX.whatsapp },
  { channel: "Email", key: "email", sent: 5210, ctr: 19, color: HEX.email },
  { channel: "SMS", key: "sms", sent: 2140, ctr: 27, color: HEX.sms },
  { channel: "RCS", key: "rcs", sent: 980, ctr: 31, color: HEX.rcs },
];

export interface SegmentSlice {
  name: string;
  value: number;
  color: string;
}

export const audienceSplit: SegmentSlice[] = [
  { name: "Active", value: 1840, color: HEX.viz[4] },
  { name: "Lapsed", value: 412, color: HEX.viz[1] },
  { name: "VIP", value: 268, color: HEX.viz[0] },
  { name: "New", value: 736, color: HEX.viz[3] },
];

export interface Kpi {
  label: string;
  value: string;
  delta: number; // percentage change
  spark: number[];
}

export const kpis: Kpi[] = [
  {
    label: "Attributed revenue",
    value: "$48.2k",
    delta: 12.4,
    spark: [12, 14, 13, 18, 17, 22, 26, 25, 29, 33],
  },
  {
    label: "Messages delivered",
    value: "12,150",
    delta: 8.1,
    spark: [40, 38, 46, 44, 52, 58, 55, 61, 64, 70],
  },
  {
    label: "Avg. click-through",
    value: "26.8%",
    delta: 3.2,
    spark: [20, 22, 21, 24, 23, 25, 27, 26, 28, 27],
  },
  {
    label: "Active campaigns",
    value: "7",
    delta: -2.0,
    spark: [9, 8, 8, 7, 7, 6, 7, 8, 7, 7],
  },
];

export interface ActivityItem {
  id: string;
  kind: "launch" | "draft" | "delivered" | "order";
  title: string;
  meta: string;
  when: string;
}

export const activity: ActivityItem[] = [
  { id: "a1", kind: "order", title: "12 orders attributed", meta: "Win back lapsed buyers", when: "2m ago" },
  { id: "a2", kind: "launch", title: "Campaign launched", meta: "Single-origin Ethiopia drop · Email", when: "1h ago" },
  { id: "a3", kind: "delivered", title: "5,210 messages delivered", meta: "Ethiopia drop", when: "1h ago" },
  { id: "a4", kind: "draft", title: "Draft staged by agent", meta: "VIP early-access · SMS", when: "3h ago" },
  { id: "a5", kind: "order", title: "8 orders attributed", meta: "Cold brew season teaser", when: "Yesterday" },
];
