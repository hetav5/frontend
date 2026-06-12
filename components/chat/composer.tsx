"use client";

import { useRef } from "react";
import { ArrowUp, Square } from "lucide-react";

export function Composer({
  onSend,
  busy,
  onStop,
}: {
  onSend: (text: string) => void;
  busy: boolean;
  onStop: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const v = ref.current?.value ?? "";
    if (!v.trim()) return;
    onSend(v);
    if (ref.current) {
      ref.current.value = "";
      ref.current.style.height = "auto";
    }
  }

  function autoGrow() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }

  return (
    <div className="surface rounded-2xl p-2 shadow-lg">
      <div className="flex items-end gap-2">
        <textarea
          ref={ref}
          rows={1}
          onInput={autoGrow}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Describe your goal — e.g. “win back lapsed coffee buyers”"
          className="max-h-[180px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-relaxed text-crema-100 outline-none placeholder:text-crema-300/35"
        />
        {busy ? (
          <button
            onClick={onStop}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-crema-200/15 text-crema-200 transition hover:bg-crema-200/5"
            aria-label="Stop"
          >
            <Square size={14} className="fill-current" />
          </button>
        ) : (
          <button
            onClick={submit}
            className="btn-caramel ring-focus grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            aria-label="Send"
          >
            <ArrowUp size={18} strokeWidth={2.6} />
          </button>
        )}
      </div>
    </div>
  );
}
