"use client";

import { useState } from "react";
import { Check, Pencil, PenLine } from "lucide-react";
import type { DraftMessagePayload } from "@/lib/types";
import { CHANNEL_META, ChannelChip } from "@/lib/channel";
import { ToolCard } from "./tool-card";

const SAMPLE_VALUES: Record<string, string> = {
  first_name: "Maya",
  last_name: "Okafor",
  city: "Brooklyn",
};

// Render {{token}} → highlighted sample value
function renderPreview(message: string) {
  const parts = message.split(/(\{\{\s*\w+\s*\}\})/g);
  return parts.map((part, i) => {
    const m = part.match(/\{\{\s*(\w+)\s*\}\}/);
    if (m) {
      const val = SAMPLE_VALUES[m[1]] ?? m[1];
      return (
        <span
          key={i}
          className="rounded bg-caramel-400/25 px-1 font-medium text-caramel-200"
          title={`Personalization: ${m[1]}`}
        >
          {val}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function DraftMessageCard({ payload }: { payload: DraftMessagePayload }) {
  const [message, setMessage] = useState(payload.message);
  const [editing, setEditing] = useState(false);
  const meta = CHANNEL_META[payload.channel];
  const isEmail = payload.channel === "email";

  return (
    <ToolCard Icon={PenLine} label="Message draft" accent={meta.color}>
      <div className="mb-3 flex items-center justify-between">
        <ChannelChip channel={payload.channel} />
        <button
          onClick={() => setEditing((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-crema-300/60 transition hover:bg-crema-200/5 hover:text-caramel-300"
        >
          {editing ? <Check size={13} /> : <Pencil size={13} />}
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      {editing ? (
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full resize-none rounded-xl border border-crema-200/15 bg-espresso-950/60 p-3 text-sm leading-relaxed text-crema-100 outline-none transition focus:border-caramel-400/50"
        />
      ) : (
        <div
          className={isEmail ? "rounded-xl border border-crema-200/10 bg-espresso-950/40 p-4" : "flex"}
        >
          {isEmail ? (
            <div>
              <div className="mb-2 flex items-center gap-2 border-b border-crema-200/10 pb-2 text-[11px] text-crema-300/50">
                <span className="font-semibold text-crema-200">Crema Coffee Co.</span>
                <span>·</span>
                <span>to you</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-crema-100">
                {renderPreview(message)}
              </p>
            </div>
          ) : (
            <div
              className="relative max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm leading-relaxed text-crema-50 shadow-lg"
              style={{ background: meta.bubble }}
            >
              <p className="whitespace-pre-wrap">{renderPreview(message)}</p>
              <span className="mt-1 block text-right text-[10px] text-crema-50/50">
                9:41 ✓✓
              </span>
            </div>
          )}
        </div>
      )}

      {payload.tokens.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-crema-300/40">Personalizes:</span>
          {payload.tokens.map((t) => (
            <code
              key={t}
              className="rounded-md bg-caramel-400/12 px-1.5 py-0.5 font-mono text-[11px] text-caramel-300"
            >
              {`{{${t}}}`}
            </code>
          ))}
        </div>
      )}
    </ToolCard>
  );
}
