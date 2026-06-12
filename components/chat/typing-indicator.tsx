import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-caramel-400 to-clay-500 text-espresso-975 shadow-sm">
        <Sparkles size={15} strokeWidth={2.4} />
      </span>
      <div className="flex items-center gap-1.5 rounded-xl bg-crema-200/[0.04] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-caramel-400/80"
            style={{ animation: `pulse-soft 1.2s ease-in-out ${i * 0.18}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
