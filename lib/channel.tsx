import { Mail, MessageCircle, MessageSquare, MessagesSquare, type LucideIcon } from "lucide-react";
import type { Channel } from "./types";

export const CHANNEL_META: Record<
  Channel,
  { label: string; color: string; Icon: LucideIcon; bubble: string }
> = {
  whatsapp: { label: "WhatsApp", color: "var(--color-ch-whatsapp)", Icon: MessageCircle, bubble: "#0b6b5e" },
  sms: { label: "SMS", color: "var(--color-ch-sms)", Icon: MessageSquare, bubble: "#1f5fb8" },
  email: { label: "Email", color: "var(--color-ch-email)", Icon: Mail, bubble: "#7a4d12" },
  rcs: { label: "RCS", color: "var(--color-ch-rcs)", Icon: MessagesSquare, bubble: "#5b3a86" },
};

export function ChannelChip({
  channel,
  active = true,
  size = "md",
}: {
  channel: Channel;
  active?: boolean;
  size?: "sm" | "md";
}) {
  const meta = CHANNEL_META[channel];
  const Icon = meta.Icon;
  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  const iconSize = size === "sm" ? 11 : 13;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium ${pad}`}
      style={{
        color: active ? meta.color : "rgba(203,178,137,0.5)",
        background: active ? `color-mix(in srgb, ${meta.color} 14%, transparent)` : "transparent",
        border: `1px solid ${active ? `color-mix(in srgb, ${meta.color} 32%, transparent)` : "rgba(203,178,137,0.14)"}`,
      }}
    >
      <Icon size={iconSize} strokeWidth={2.25} />
      {meta.label}
    </span>
  );
}
