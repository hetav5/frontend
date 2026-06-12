"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Lock, type LucideIcon } from "lucide-react";
import type { LaunchCampaignPayload } from "@/lib/types";
import { CHANNEL_META } from "@/lib/channel";
import { launchCampaign } from "@/lib/api";
import { num } from "@/lib/format";

type State = "idle" | "confirming" | "sending" | "sent" | "error";

export function ApproveSendCard({ payload }: { payload: LaunchCampaignPayload }) {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string>("");
  const meta = CHANNEL_META[payload.channel];

  async function approve() {
    setState("sending");
    setError("");
    try {
      await launchCampaign(payload.campaignId);
      setState("sent");
      setTimeout(() => router.push(`/campaigns/${payload.campaignId}`), 750);
    } catch (e) {
      setError(String(e));
      setState("error");
    }
  }

  return (
    <div
      className="animate-rise relative overflow-hidden rounded-card p-[1.5px]"
      style={{ background: "linear-gradient(135deg, var(--color-caramel-400), var(--color-clay-500))" }}
    >
      {/* glow */}
      <div className="pointer-events-none absolute -inset-10 opacity-40 blur-3xl" style={{ background: "radial-gradient(circle at 30% 0%, rgba(227,168,95,0.5), transparent 70%)" }} />
      <div className="relative rounded-[calc(var(--radius-card)-1px)] bg-espresso-900/95 p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-caramel-400/20 text-caramel-300">
            <Lock size={13} strokeWidth={2.4} />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-caramel-300">
            Approval required to send
          </span>
        </div>

        <h3 className="font-display text-xl font-semibold tracking-tight text-crema-50">
          {payload.name}
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Recipients" value={num(payload.recipientCount)} hint="will receive this" />
          <Stat
            label="Channel"
            value={meta.label}
            hint="delivery channel"
            color={meta.color}
            Icon={meta.Icon}
          />
        </div>

        <div className="mt-4 rounded-xl border border-crema-200/10 bg-espresso-950/50 p-3.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-crema-300/40">
            Sample message
          </span>
          <p className="mt-1.5 text-sm leading-relaxed text-crema-100">
            {payload.sampleMessage}
          </p>
        </div>

        {state === "error" && (
          <p className="mt-3 rounded-lg bg-berry-500/15 px-3 py-2 text-xs text-berry-500">
            Couldn&apos;t launch: {error}
          </p>
        )}

        <div className="mt-5">
          {state === "idle" && (
            <button
              onClick={() => setState("confirming")}
              className="btn-caramel w-full rounded-2xl py-3.5 text-[15px] font-semibold"
            >
              Approve &amp; Send to {num(payload.recipientCount)} customers
            </button>
          )}

          {state === "confirming" && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={approve}
                className="btn-caramel flex-1 rounded-2xl py-3.5 text-[15px] font-semibold"
              >
                Yes — send it now
              </button>
              <button
                onClick={() => setState("idle")}
                className="rounded-2xl border border-crema-200/15 px-5 py-3.5 text-sm font-medium text-crema-200/70 transition hover:bg-crema-200/5"
              >
                Cancel
              </button>
            </div>
          )}

          {state === "sending" && (
            <button
              disabled
              className="btn-caramel flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold opacity-90"
            >
              <Loader2 size={17} className="animate-spin" /> Launching campaign…
            </button>
          )}

          {state === "sent" && (
            <button
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-leaf-500/20 py-3.5 text-[15px] font-semibold text-leaf-500"
            >
              <Check size={17} strokeWidth={2.6} /> Sent — opening live funnel…
            </button>
          )}
        </div>

        <p className="mt-3 text-center text-[11px] text-crema-300/35">
          Nothing was sent until you clicked. This is the only path that commits.
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  color,
  Icon,
}: {
  label: string;
  value: string;
  hint: string;
  color?: string;
  Icon?: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-crema-200/10 bg-espresso-950/40 p-3">
      <span className="text-[10px] font-medium uppercase tracking-wider text-crema-300/40">
        {label}
      </span>
      <div className="mt-0.5 flex items-center gap-1.5">
        {Icon && <Icon size={16} strokeWidth={2.2} style={{ color }} />}
        <span className="font-display text-xl font-semibold text-crema-50" style={color ? { color } : undefined}>
          {value}
        </span>
      </div>
      <span className="text-[11px] text-crema-300/40">{hint}</span>
    </div>
  );
}
