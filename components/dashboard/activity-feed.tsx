import { FileEdit, PackageCheck, Send, ShoppingBag, type LucideIcon } from "lucide-react";
import type { DashboardActivityItem } from "@/lib/types";

const KIND: Record<DashboardActivityItem["kind"], { Icon: LucideIcon; color: string }> = {
  launch: { Icon: Send, color: "var(--color-caramel-400)" },
  draft: { Icon: FileEdit, color: "var(--color-ch-rcs)" },
  delivered: { Icon: PackageCheck, color: "var(--color-ch-sms)" },
  order: { Icon: ShoppingBag, color: "var(--color-leaf-500)" },
};

export function ActivityFeed({ activity }: { activity: DashboardActivityItem[] }) {
  if (!activity.length) {
    return <p className="py-6 text-center text-[12px] text-crema-300/40">No campaign activity yet.</p>;
  }
  return (
    <ul className="flex flex-col">
      {activity.map((a, i) => {
        const { Icon, color } = KIND[a.kind];
        return (
          <li key={a.id} className="flex gap-3 py-2.5" style={{ borderTop: i ? "1px solid rgba(230,212,186,0.06)" : "none" }}>
            <span
              className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg"
              style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
            >
              <Icon size={14} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-crema-100">{a.title}</p>
              <p className="truncate text-[11.5px] text-crema-300/45">{a.meta}</p>
            </div>
            <span className="shrink-0 text-[11px] text-crema-300/35">{a.when}</span>
          </li>
        );
      })}
    </ul>
  );
}
