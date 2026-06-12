import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { getCampaigns } from "@/lib/api";
import { CHANNEL_META } from "@/lib/channel";
import { dateShort } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import type { CampaignStatus } from "@/lib/types";

const STATUS_STYLE: Record<CampaignStatus, { label: string; cls: string }> = {
  DRAFT: { label: "Draft", cls: "border-crema-200/15 bg-crema-200/5 text-crema-300/60" },
  SENDING: { label: "Sending", cls: "border-caramel-400/30 bg-caramel-400/10 text-caramel-300" },
  SENT: { label: "Sent", cls: "border-leaf-500/30 bg-leaf-500/10 text-leaf-500" },
  FAILED: { label: "Failed", cls: "border-berry-500/30 bg-berry-500/10 text-berry-500" },
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <div className="flex flex-col">
      <PageHeader
        crumb={["Crema CRM", "Campaigns"]}
        title="Campaigns"
        subtitle="Everything the agent has staged or sent. Open one to watch its funnel fill live."
        actions={
          <Link
            href="/"
            className="btn-caramel ring-focus inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold"
          >
            <Plus size={15} strokeWidth={2.4} /> New campaign
          </Link>
        }
      />

      <div className="flex flex-col gap-2.5 p-5 sm:p-8">
        {campaigns.map((c) => {
          const meta = CHANNEL_META[c.channel];
          const Icon = meta.Icon;
          const status = STATUS_STYLE[c.status];
          return (
            <Link
              key={c.id}
              href={`/campaigns/${c.id}`}
              className="surface hover-lift group flex items-center gap-4 rounded-card p-4"
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                style={{ background: `color-mix(in srgb, ${meta.color} 14%, transparent)`, color: meta.color }}
              >
                <Icon size={18} strokeWidth={2.1} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[14.5px] font-medium text-crema-50">{c.name}</h2>
                <p className="text-[12px] text-crema-300/45">
                  {meta.label} · created {dateShort(c.createdAt)}
                </p>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${status.cls}`}>
                {status.label}
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-crema-300/25 transition group-hover:translate-x-0.5 group-hover:text-caramel-300"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
