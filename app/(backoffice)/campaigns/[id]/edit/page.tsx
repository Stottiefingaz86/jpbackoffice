import { notFound } from "next/navigation"

import dynamic from "next/dynamic"

import { FormPageSkeleton } from "@/components/backoffice-loading"
import { getCampaignDetail } from "@/lib/campaign-data"

const CampaignEditor = dynamic(
  () =>
    import("@/components/campaign-editor").then((mod) => mod.CampaignEditor),
  { loading: () => <FormPageSkeleton /> }
)

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
