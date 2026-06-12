// ============================================================
// Contract types — the single source of truth shared with the
// backend (see FRONTEND_PLAN.md → "API & SSE Contract").
// ============================================================

export type Channel = "whatsapp" | "sms" | "email" | "rcs";

export type CampaignStatus = "DRAFT" | "SENDING" | "SENT" | "FAILED";

// ---- SSE events from POST /agent/stream ----
export type AgentEvent =
  | { event: "token"; data: { text: string } }
  | { event: "tool_result"; data: ToolResult }
  | { event: "message_done"; data: { conversationId: string; messageId: string } }
  | { event: "error"; data: { message: string } };

// ---- Tool-result payloads (rendered as cards) ----
export interface AudienceSample {
  id: string;
  name: string;
  lastOrderDaysAgo: number;
  lifetimeValue: number;
}

export interface PreviewAudiencePayload {
  ruleTreeId?: string;
  count: number;
  sample: AudienceSample[];
}

export interface DraftMessagePayload {
  channel: Channel;
  message: string;
  tokens: string[];
}

export interface RecommendChannelPayload {
  channel: Channel;
  rationale: string;
}

export interface CreateCampaignPayload {
  campaignId: string;
  name: string;
  channel: Channel;
  segmentCount: number;
}

export interface LaunchCampaignPayload {
  requiresApproval: true;
  campaignId: string;
  name: string;
  channel: Channel;
  recipientCount: number;
  sampleMessage: string;
}

export type ToolResult =
  | { tool: "preview_audience"; payload: PreviewAudiencePayload }
  | { tool: "draft_message"; payload: DraftMessagePayload }
  | { tool: "recommend_channel"; payload: RecommendChannelPayload }
  | { tool: "create_campaign"; payload: CreateCampaignPayload }
  | { tool: "launch_campaign"; payload: LaunchCampaignPayload }
  | { tool: "get_campaign_analytics"; payload: CampaignAnalytics };

export type ToolName = ToolResult["tool"];

// ---- Campaigns ----
export interface CampaignSummary {
  id: string;
  name: string;
  channel: Channel;
  status: CampaignStatus;
  createdAt: string;
}

export interface CampaignDetail {
  id: string;
  name: string;
  goalText: string;
  channel: Channel;
  status: CampaignStatus;
  segmentCount: number;
}

export interface Funnel {
  sent: number;
  delivered: number;
  opened: number;
  read: number;
  clicked: number;
  failed: number;
}

export interface CampaignAnalytics {
  funnel: Funnel;
  attributedOrders: number;
  attributedRevenue: number;
}

export interface LaunchResult {
  status: "SENDING";
  recipientCount: number;
}

// ---- Customers ----
export interface Customer {
  id: string;
  name: string;
  email: string;
  city: string;
  orderCount: number;
  lifetimeValue: number;
  lastOrderDaysAgo: number;
}

export interface CustomerPage {
  items: Customer[];
  nextCursor: string | null;
}

// ---- Conversation reload ----
export type MessagePart =
  | { type: "text"; text: string }
  | { type: "tool"; result: ToolResult };

export interface ConversationMessage {
  role: "user" | "assistant";
  parts: MessagePart[];
}

export interface Conversation {
  id: string;
  messages: ConversationMessage[];
}
