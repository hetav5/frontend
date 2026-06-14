"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Coffee, Plus, Sparkles } from "lucide-react";
import { useAgentChat } from "./use-agent-chat";
import { Message } from "./message";
import { Composer } from "./composer";
import { TypingIndicator } from "./typing-indicator";
import { AdvisorPanel } from "./advisor-panel";

const SUGGESTIONS = [
  { title: "Win back lapsed buyers", sub: "haven’t ordered in 60+ days" },
  { title: "Promote the Ethiopia drop", sub: "to single-origin lovers via email" },
  { title: "Reward VIP regulars", sub: "early access by SMS" },
  { title: "Nudge abandoned carts", sub: "with a gentle reminder" },
];

export function ChatView() {
  const { messages, busy, send, stop, reset } = useAgentChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const empty = messages.length === 0;
  const last = messages[messages.length - 1];
  const showTyping =
    busy &&
    last?.role === "assistant" &&
    last.parts.every((p) => p.type === "text" && p.text === "");

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-crema-200/8 bg-espresso-950/40 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-caramel-400/12 text-caramel-300">
            <Sparkles size={16} strokeWidth={2.3} />
          </span>
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight text-crema-50">
              Campaign Agent
            </h1>
            <p className="text-[11.5px] text-crema-300/45">
              Goal in, campaign out — nothing sends without your approval.
            </p>
          </div>
        </div>
        {!empty && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-crema-200/12 px-3 py-1.5 text-[12.5px] font-medium text-crema-200/70 transition hover:bg-crema-200/5"
          >
            <Plus size={14} /> New campaign
          </button>
        )}
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-8">
        <div className="mx-auto w-full max-w-2xl pb-6">
          {empty ? (
            <EmptyState onPick={(t) => send(t)}>
              <AdvisorPanel onPick={(t) => send(t)} />
            </EmptyState>
          ) : (
            <div className="flex flex-col gap-6 pt-4">
              {messages.map((m) => (
                <Message key={m.id} message={m} />
              ))}
              {showTyping && <TypingIndicator />}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="px-5 pb-6 pt-2 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <Composer onSend={send} busy={busy} onStop={stop} />
          <p className="mt-2 text-center text-[11px] text-crema-300/30">
            The agent stages audience, copy and channel — you approve before anything sends.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  onPick,
  children,
}: {
  onPick: (text: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center pt-12 text-center sm:pt-20">
      <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-caramel-400 to-clay-500 text-espresso-975 shadow-sm">
        <Coffee size={22} strokeWidth={2.2} />
      </span>
      <h2 className="font-display text-[28px] font-semibold leading-tight tracking-tight text-crema-50 sm:text-[34px]">
        What should we brew today?
      </h2>
      <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-crema-200/55">
        Describe a goal in plain language. The agent proposes the audience, drafts the
        copy, picks the channel — and sends only when you say go.
      </p>

      <div className="mt-8 grid w-full gap-2.5 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            onClick={() => onPick(`${s.title} — ${s.sub}`)}
            className="surface hover-lift group flex items-center gap-3 rounded-xl p-3.5 text-left"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-caramel-400/10 text-caramel-300">
              <Sparkles size={15} strokeWidth={2.2} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[13.5px] font-medium text-crema-50">{s.title}</span>
              <span className="truncate text-[12px] text-crema-300/45">{s.sub}</span>
            </span>
            <ArrowRight
              size={15}
              className="ml-auto shrink-0 text-crema-300/25 transition group-hover:translate-x-0.5 group-hover:text-caramel-300"
            />
          </button>
        ))}
      </div>

      {children}
    </div>
  );
}
