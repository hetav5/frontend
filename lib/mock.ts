// ============================================================
// Mock layer — lets the whole app be demoed before the backend
// is live. Mirrors the contract shapes exactly. Seed vertical:
// a D2C coffee brand ("Crema Coffee Co.").
// ============================================================

import type {
  AgentEvent,
  CampaignAnalytics,
  CampaignDetail,
  CampaignSummary,
  Channel,
  Customer,
  CustomerPage,
} from "./types";

const FIRST = [
  "Maya", "Leo", "Priya", "Noah", "Aisha", "Diego", "Hana", "Omar",
  "Freya", "Kenji", "Lucia", "Ravi", "Stella", "Theo", "Ingrid", "Mateo",
  "Yuki", "Nadia", "Caleb", "Zoe", "Idris", "Camille", "Soren", "Anika",
];
const LAST = [
  "Okafor", "Bianchi", "Sharma", "Nguyen", "Khan", "Rossi", "Tanaka", "Haddad",
  "Lindqvist", "Mehta", "Castellano", "Park", "Dubois", "Andersson", "Reyes", "Costa",
];
const CITIES = [
  "Brooklyn", "Portland", "Austin", "Lisbon", "Melbourne", "Berlin",
  "Toronto", "Cape Town", "Seoul", "Mumbai", "Copenhagen", "Mexico City",
];

// Deterministic pseudo-random so SSR and client agree.
function seeded(n: number) {
  const x = Math.sin(n * 99.13) * 10000;
  return x - Math.floor(x);
}

function makeCustomer(i: number): Customer {
  const first = FIRST[Math.floor(seeded(i + 1) * FIRST.length)];
  const last = LAST[Math.floor(seeded(i + 7) * LAST.length)];
  const orderCount = 1 + Math.floor(seeded(i + 3) * 22);
  const ltv = Math.round((18 + seeded(i + 5) * 540) * orderCount * 0.42);
  const lastOrderDaysAgo = Math.floor(seeded(i + 11) * 180);
  return {
    id: `cus_${(1000 + i).toString(36)}`,
    name: `${first} ${last}`,
    email: `${first}.${last}`.toLowerCase() + "@example.com",
    city: CITIES[Math.floor(seeded(i + 13) * CITIES.length)],
    orderCount,
    lifetimeValue: ltv,
    lastOrderDaysAgo,
  };
}

export const MOCK_CUSTOMERS: Customer[] = Array.from({ length: 96 }, (_, i) =>
  makeCustomer(i)
);

export function mockCustomerPage(cursor: string | null, limit = 12): CustomerPage {
  const start = cursor ? parseInt(cursor, 10) : 0;
  const items = MOCK_CUSTOMERS.slice(start, start + limit);
  const next = start + limit;
  return {
    items,
    nextCursor: next < MOCK_CUSTOMERS.length ? String(next) : null,
  };
}

export const MOCK_CAMPAIGNS: CampaignSummary[] = [
  {
    id: "cmp_lapsed01",
    name: "Win back lapsed coffee buyers",
    channel: "whatsapp",
    status: "SENT",
    createdAt: "2026-06-09T09:30:00Z",
  },
  {
    id: "cmp_launch02",
    name: "Single-origin Ethiopia drop",
    channel: "email",
    status: "SENDING",
    createdAt: "2026-06-11T14:05:00Z",
  },
  {
    id: "cmp_vip03",
    name: "VIP early-access · cold brew season",
    channel: "sms",
    status: "DRAFT",
    createdAt: "2026-06-12T08:00:00Z",
  },
];

export function mockCampaignDetail(id: string): CampaignDetail {
  const found = MOCK_CAMPAIGNS.find((c) => c.id === id);
  return {
    id,
    name: found?.name ?? "Win back lapsed coffee buyers",
    goalText:
      "Win back customers who haven't ordered in 60+ days with a warm, personal nudge and a returning-customer perk.",
    channel: found?.channel ?? "whatsapp",
    status: found?.status ?? "SENDING",
    segmentCount: 412,
  };
}

// A funnel that "fills in" over time to fake live receipts landing.
export function mockAnalyticsAt(tick: number): CampaignAnalytics {
  const total = 412;
  const ramp = Math.min(1, tick / 14);
  const sent = Math.round(total * Math.min(1, ramp * 1.15));
  const delivered = Math.round(sent * 0.94);
  const opened = Math.round(delivered * 0.61 * ramp);
  const read = Math.round(opened * 0.86);
  const clicked = Math.round(read * 0.34);
  const failed = sent - delivered;
  return {
    funnel: { sent, delivered, opened, read, clicked, failed },
    attributedOrders: Math.round(clicked * 0.28),
    attributedRevenue: Math.round(clicked * 0.28 * 41.5),
  };
}

// ---- Mock agent stream ----
// Yields contract-shaped SSE events with realistic pacing so the
// chat UI streams tokens, then renders tool cards in thread order.

const CHANNEL_FOR_GOAL = (goal: string): Channel => {
  const g = goal.toLowerCase();
  if (g.includes("email") || g.includes("newsletter")) return "email";
  if (g.includes("sms") || g.includes("text")) return "sms";
  if (g.includes("rcs")) return "rcs";
  return "whatsapp";
};

export async function* mockAgentStream(
  message: string,
  conversationId: string
): AsyncGenerator<AgentEvent> {
  const channel = CHANNEL_FOR_GOAL(message);
  const sample = MOCK_CUSTOMERS.filter((c) => c.lastOrderDaysAgo >= 60).slice(0, 4);
  const count = 412;

  const intro =
    `Got it — let's **win back lapsed buyers**. I'll find everyone who hasn't ` +
    `ordered in a while, sketch a warm message, and recommend the best channel. ` +
    `Here's the audience I'd target:`;

  for (const chunk of tokenize(intro)) {
    yield { event: "token", data: { text: chunk } };
    await delay(18);
  }

  await delay(280);
  yield {
    event: "tool_result",
    data: {
      tool: "preview_audience",
      payload: {
        ruleTreeId: "rt_lapsed_60d",
        count,
        sample: sample.map((c) => ({
          id: c.id,
          name: c.name,
          lastOrderDaysAgo: c.lastOrderDaysAgo,
          lifetimeValue: c.lifetimeValue,
        })),
      },
    },
  };

  await delay(420);
  const mid =
    `\n\nThat's **${count} customers** who've gone quiet — but they've spent ` +
    `real money before, so they're worth a personal nudge. Here's a draft:`;
  for (const chunk of tokenize(mid)) {
    yield { event: "token", data: { text: chunk } };
    await delay(18);
  }

  await delay(280);
  yield {
    event: "tool_result",
    data: {
      tool: "draft_message",
      payload: {
        channel,
        message:
          "Hi {{first_name}}, we miss you at Crema ☕ It's been a while since your last bag. " +
          "Your favourite single-origin just got a fresh roast — here's 15% off to welcome you back: CREMA15. " +
          "Brew something good this week.",
        tokens: ["first_name"],
      },
    },
  };

  await delay(360);
  for (const chunk of tokenize(
    `\n\nI'd reach them on **${channelLabel(channel)}** — here's why:`
  )) {
    yield { event: "token", data: { text: chunk } };
    await delay(18);
  }

  await delay(240);
  yield {
    event: "tool_result",
    data: {
      tool: "recommend_channel",
      payload: {
        channel,
        rationale:
          "Lapsed buyers skew toward high open-rates on WhatsApp (avg 84% vs 22% email for this segment), " +
          "and the conversational format suits a personal win-back nudge. Cost per delivered message stays low.",
      },
    },
  };

  await delay(360);
  for (const chunk of tokenize(
    `\n\nEverything's staged. Review it below — **nothing sends until you approve.**`
  )) {
    yield { event: "token", data: { text: chunk } };
    await delay(18);
  }

  await delay(260);
  yield {
    event: "tool_result",
    data: {
      tool: "launch_campaign",
      payload: {
        requiresApproval: true,
        campaignId: "cmp_lapsed01",
        name: "Win back lapsed coffee buyers",
        channel,
        recipientCount: count,
        sampleMessage:
          "Hi Maya, we miss you at Crema ☕ Your favourite single-origin just got a fresh roast — here's 15% off to welcome you back: CREMA15.",
      },
    },
  };

  yield {
    event: "message_done",
    data: { conversationId, messageId: "msg_" + conversationId.slice(-6) },
  };
}

function channelLabel(c: Channel) {
  return { whatsapp: "WhatsApp", sms: "SMS", email: "Email", rcs: "RCS" }[c];
}

function tokenize(text: string): string[] {
  // split into word-ish chunks to mimic token streaming
  return text.match(/\S+\s*|\s+/g) ?? [text];
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
