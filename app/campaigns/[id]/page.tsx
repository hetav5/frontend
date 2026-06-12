import { CampaignView } from "@/components/analytics/campaign-view";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampaignView id={id} />;
}
