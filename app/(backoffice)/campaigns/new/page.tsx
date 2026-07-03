import dynamic from "next/dynamic"

import { FormPageSkeleton } from "@/components/backoffice-loading"
import { createBlankCampaign } from "@/lib/campaign-data"

const CampaignEditor = dynamic(
  () =>
    import("@/components/campaign-editor").then((mod) => mod.CampaignEditor),
  { loading: () => <FormPageSkeleton /> }
)

export default function NewCampaignPage() {
  return <CampaignEditor campaign={createBlankCampaign()} />
}
