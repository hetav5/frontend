import { BarChart3, Megaphone } from "lucide-react";
import type { ToolResult } from "@/lib/types";
import { AudiencePreviewCard } from "./audience-preview-card";
import { DraftMessageCard } from "./draft-message-card";
import { ChannelRecCard } from "./channel-rec-card";
import { ApproveSendCard } from "./approve-send-card";
import { ToolCard } from "./tool-card";
import { money, num } from "@/lib/format";

export function ToolResultCard({ result }: { result: ToolResult }) {
  switch (result.tool) {
    case "preview_audience":
      return <AudiencePreviewCard payload={result.payload} />;
    case "draft_message":
      return <DraftMessageCard payload={result.payload} />;
    case "recommend_channel":
      return <ChannelRecCard payload={result.payload} />;
    case "launch_campaign":
      return <ApproveSendCard payload={result.payload} />;
    case "create_campaign":
      return (
        <ToolCard Icon={Megaphone} label="Campaign created">
          <p className="text-sm text-crema-100">
            <span className="font-medium">{result.payload.name}</span> is staged as a draft
            for {num(result.payload.segmentCount)} customers.
          </p>
        </ToolCard>
      );
    case "get_campaign_analytics":
      return (
        <ToolCard Icon={BarChart3} label="Campaign analytics">
          <div className="flex gap-6 text-sm">
            <span>
              <span className="block text-xs text-crema-300/50">Delivered</span>
              <span className="font-display text-lg text-crema-50">
                {num(result.payload.funnel.delivered)}
              </span>
            </span>
            <span>
              <span className="block text-xs text-crema-300/50">Attributed revenue</span>
              <span className="font-display text-lg text-caramel-300">
                {money(result.payload.attributedRevenue)}
              </span>
            </span>
          </div>
        </ToolCard>
      );
    default:
      return null;
  }
}
