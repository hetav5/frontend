import { Radio } from "lucide-react";
import type { Channel, RecommendChannelPayload } from "@/lib/types";
import { CHANNEL_META, ChannelChip } from "@/lib/channel";
import { ToolCard } from "./tool-card";

const ALL: Channel[] = ["whatsapp", "sms", "email", "rcs"];

export function ChannelRecCard({ payload }: { payload: RecommendChannelPayload }) {
  const meta = CHANNEL_META[payload.channel];
  const Icon = meta.Icon;
  return (
    <ToolCard Icon={Radio} label="Recommended channel" accent={meta.color}>
      <div className="flex items-start gap-3.5">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
          style={{
            background: `color-mix(in srgb, ${meta.color} 15%, transparent)`,
            color: meta.color,
            boxShadow: `0 0 0 1px color-mix(in srgb, ${meta.color} 30%, transparent)`,
          }}
        >
          <Icon size={20} strokeWidth={2.1} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold text-crema-50">{meta.label}</span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: `color-mix(in srgb, ${meta.color} 16%, transparent)`, color: meta.color }}
            >
              Best fit
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-crema-200/75">{payload.rationale}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-crema-200/8 pt-3">
        <span className="self-center text-[11px] text-crema-300/40">Also considered:</span>
        {ALL.filter((c) => c !== payload.channel).map((c) => (
          <ChannelChip key={c} channel={c} active={false} size="sm" />
        ))}
      </div>
    </ToolCard>
  );
}
