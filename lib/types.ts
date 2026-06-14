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

// ---- Campaign AI performance review ----
export interface CampaignMetrics {
  audience: number;
  sent: number;
  delivered: number;
  opened: number;
  read: number;
  clicked: number;
  failed: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  failureRate: number;
  conversionRate: number;
  attributedOrders: number;
  attributedRevenue: number;
}

export interface CampaignRecommendation {
  action: string;
  rationale: string;
  priority: "high" | "medium" | "low";
}

export interface CampaignAnalysis {
  headline: string;
  summary: string;
  assessment: "strong" | "moderate" | "weak";
  highlights: string[];
  concerns: string[];
  recommendations: CampaignRecommendation[];
}

export interface CampaignInsights {
  generatedAt: string;
  daysSinceLaunch: number;
  metrics: CampaignMetrics;
  analysis: CampaignAnalysis;
}

// ---- Dashboard ----
export type KpiFormat = "currency" | "number" | "percent";

export interface DashboardKpi {
  key: string;
  label: string;
  value: number;
  format: KpiFormat;
  delta: number;
  spark: number[];
}

export interface RevenuePoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface EngagementPoint {
  day: string;
  delivered: number;
  opened: number;
  clicked: number;
}

export interface SegmentSlice {
  name: string;
  value: number;
}

export interface ChannelPerfPoint {
  channel: string;
  key: Channel | string;
  sent: number;
  ctr: number;
}

export interface DashboardActivityItem {
  id: string;
  kind: "launch" | "draft" | "delivered" | "order";
  title: string;
  meta: string;
  when: string;
}

export interface DashboardData {
  kpis: DashboardKpi[];
  revenueSeries: RevenuePoint[];
  audienceSplit: SegmentSlice[];
  engagementSeries: EngagementPoint[];
  channelPerf: ChannelPerfPoint[];
  activity: DashboardActivityItem[];
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
