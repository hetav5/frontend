"use client";

import { useCallback, useRef, useState } from "react";
import { streamAgent } from "@/lib/api";
import type { MessagePart, ToolResult } from "@/lib/types";

export interface ThreadMessage {
  id: string;
  role: "user" | "assistant";
  parts: MessagePart[];
  streaming?: boolean;
}

let _id = 0;
const nextId = () => `m${++_id}_${Date.now().toString(36)}`;

export function useAgentChat() {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const conversationId = useRef<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      const userMsg: ThreadMessage = {
        id: nextId(),
        role: "user",
        parts: [{ type: "text", text: trimmed }],
      };
      const assistantId = nextId();
      const assistantMsg: ThreadMessage = {
        id: assistantId,
        role: "assistant",
        parts: [{ type: "text", text: "" }],
        streaming: true,
      };

      setMessages((m) => [...m, userMsg, assistantMsg]);
      setBusy(true);

      const ac = new AbortController();
      abortRef.current = ac;

      const appendToken = (token: string) => {
        setMessages((m) =>
          m.map((msg) => {
            if (msg.id !== assistantId) return msg;
            const parts = [...msg.parts];
            const last = parts[parts.length - 1];
            if (last && last.type === "text") {
              parts[parts.length - 1] = { type: "text", text: last.text + token };
            } else {
              parts.push({ type: "text", text: token });
            }
            return { ...msg, parts };
          })
        );
      };

      const appendTool = (result: ToolResult) => {
        setMessages((m) =>
          m.map((msg) => {
            if (msg.id !== assistantId) return msg;
            const parts: MessagePart[] = [...msg.parts, { type: "tool", result }];
            // start a fresh text part so subsequent tokens land after the card
            parts.push({ type: "text", text: "" });
            return { ...msg, parts };
          })
        );
      };

      const finish = () => {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  streaming: false,
                  parts: msg.parts.filter(
                    (p) => !(p.type === "text" && p.text.trim() === "")
                  ),
                }
              : msg
          )
        );
        setBusy(false);
        abortRef.current = null;
      };

      await streamAgent(
        { conversationId: conversationId.current, message: trimmed },
        {
          onToken: appendToken,
          onTool: (e) => appendTool(e),
          onDone: (e) => {
            conversationId.current = e.conversationId;
            finish();
          },
          onError: (message) => {
            setMessages((m) =>
              m.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, parts: [...msg.parts, { type: "error", text: message }] }
                  : msg
              )
            );
            finish();
          },
        },
        ac.signal
      );
    },
    [busy]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setBusy(false);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    conversationId.current = undefined;
    setMessages([]);
    setBusy(false);
  }, []);

  return { messages, busy, send, stop, reset };
}
