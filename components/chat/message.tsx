import { Fragment } from "react";
import { Sparkles } from "lucide-react";
import type { ThreadMessage } from "./use-agent-chat";
import { ToolResultCard } from "@/components/cards/tool-result-card";

// Minimal, safe inline markdown: **bold**, `code`, and paragraph/lists.
function renderInline(text: string, keyBase: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return tokens.map((t, i) => {
    if (t.startsWith("**") && t.endsWith("**")) {
      return <strong key={`${keyBase}-${i}`}>{t.slice(2, -2)}</strong>;
    }
    if (t.startsWith("`") && t.endsWith("`")) {
      return <code key={`${keyBase}-${i}`}>{t.slice(1, -1)}</code>;
    }
    return <Fragment key={`${keyBase}-${i}`}>{t}</Fragment>;
  });
}

function Prose({ text, streaming }: { text: string; streaming?: boolean }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="chat-prose text-[15px] leading-relaxed text-crema-100">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => /^[-*]\s/.test(l.trim()));
        if (isList && lines.length > 0) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^[-*]\s/, ""), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi}>
            {renderInline(block, String(bi))}
            {streaming && bi === blocks.length - 1 && (
              <span className="ml-0.5 inline-block h-[1.05em] w-[2px] -translate-y-[1px] animate-blink bg-caramel-400 align-middle" />
            )}
          </p>
        );
      })}
    </div>
  );
}

export function Message({ message }: { message: ThreadMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-2xl rounded-br-md bg-gradient-to-br from-caramel-500 to-clay-500 px-4 py-2.5 text-[15px] font-medium leading-relaxed text-espresso-950 shadow-[0_10px_30px_-14px_rgba(227,168,95,0.6)]">
          {message.parts.map((p, i) =>
            p.type === "text" ? <span key={i}>{p.text}</span> : null
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-caramel-400 to-clay-500 text-espresso-975 shadow-sm">
        <Sparkles size={15} strokeWidth={2.4} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            if (!part.text && !message.streaming) return null;
            return (
              <Prose
                key={i}
                text={part.text}
                streaming={message.streaming && i === message.parts.length - 1}
              />
            );
          }
          return <ToolResultCard key={i} result={part.result} />;
        })}
      </div>
    </div>
  );
}
