import { notFound } from "next/navigation"

import { CampaignEditor } from "@/components/campaign-editor"
import { getCampaignDetail } from "@/lib/campaign-data"

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const campaign = getCampaignDetail(id)

  if (!campaign) {
    notFound()
  }

  return <CampaignEditor campaign={campaign} />
}
