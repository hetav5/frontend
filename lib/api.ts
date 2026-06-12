// ============================================================
// Typed API client for the CRM API contract.
//
// Works in two modes:
//  - LIVE: talks to NEXT_PUBLIC_API_BASE_URL (REST + SSE).
//  - MOCK: when no base URL is set, serves the mock layer so the
//    whole UI is demoable before the backend is live.
// ============================================================

import {
  MOCK_CAMPAIGNS,
  mockAgentStream,
  mockAnalyticsAt,
  mockCampaignDetail,
  mockCustomerPage,
} from "./mock";
import type {
  AgentEvent,
  CampaignAnalytics,
  CampaignDetail,
  CampaignSummary,
  CustomerPage,
  LaunchResult,
} from "./types";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
export const IS_MOCK = API_BASE.length === 0;

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`);
  return res.json() as Promise<T>;
}

// ---- Agent chat stream ----
export interface StreamHandlers {
  onToken: (text: string) => void;
  onTool: (e: Extract<AgentEvent, { event: "tool_result" }>["data"]) => void;
  onDone: (e: { conversationId: string; messageId: string }) => void;
  onError: (message: string) => void;
}

export async function streamAgent(
  body: { conversationId?: string; message: string },
  handlers: StreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  const conversationId = body.conversationId ?? `conv_${Date.now().toString(36)}`;

  if (IS_MOCK) {
    try {
      for await (const evt of mockAgentStream(body.message, conversationId)) {
        if (signal?.aborted) return;
        dispatch(evt, handlers);
      }
    } catch (err) {
      if (!signal?.aborted) handlers.onError(String(err));
    }
    return;
  }

  const res = await fetch(`${API_BASE}/agent/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ ...body, conversationId }),
    signal,
  });

  if (!res.ok || !res.body) {
    handlers.onError(`Stream failed: ${res.status} ${res.statusText}`);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE frames are separated by a blank line.
      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        const evt = parseFrame(frame);
        if (evt) dispatch(evt, handlers);
      }
    }
  } catch (err) {
    if (!signal?.aborted) handlers.onError(String(err));
  }
}

function parseFrame(frame: string): AgentEvent | null {
  let event = "";
  const dataLines: string[] = [];
  for (const line of frame.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
  }
  if (!event || dataLines.length === 0) return null;
  try {
    const data = JSON.parse(dataLines.join("\n"));
    return { event, data } as AgentEvent;
  } catch {
    return null;
  }
}

function dispatch(evt: AgentEvent, h: StreamHandlers) {
  switch (evt.event) {
    case "token":
      h.onToken(evt.data.text);
      break;
    case "tool_result":
      h.onTool(evt.data);
      break;
    case "message_done":
      h.onDone(evt.data);
      break;
    case "error":
      h.onError(evt.data.message);
      break;
  }
}

// ---- Campaigns ----
export async function getCampaigns(): Promise<CampaignSummary[]> {
  if (IS_MOCK) return MOCK_CAMPAIGNS;
  return getJSON<CampaignSummary[]>("/campaigns");
}

export async function getCampaign(id: string): Promise<CampaignDetail> {
  if (IS_MOCK) return mockCampaignDetail(id);
  return getJSON<CampaignDetail>(`/campaigns/${id}`);
}

export async function getCampaignAnalytics(
  id: string,
  tick = 14
): Promise<CampaignAnalytics> {
  if (IS_MOCK) return mockAnalyticsAt(tick);
  return getJSON<CampaignAnalytics>(`/campaigns/${id}/analytics`);
}

export async function launchCampaign(id: string): Promise<LaunchResult> {
  if (IS_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    return { status: "SENDING", recipientCount: 412 };
  }
  const res = await fetch(`${API_BASE}/campaigns/${id}/launch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Launch failed: ${res.status}`);
  return res.json() as Promise<LaunchResult>;
}

// ---- Customers ----
export async function getCustomers(cursor: string | null, limit = 12): Promise<CustomerPage> {
  if (IS_MOCK) {
    await new Promise((r) => setTimeout(r, 250));
    return mockCustomerPage(cursor, limit);
  }
  const qs = new URLSearchParams();
  if (cursor) qs.set("cursor", cursor);
  qs.set("limit", String(limit));
  return getJSON<CustomerPage>(`/customers?${qs.toString()}`);
}
