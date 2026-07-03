import { CampaignEditor } from "@/components/campaign-editor"
import { createBlankCampaign } from "@/lib/campaign-data"

export default function NewCampaignPage() {
  return <CampaignEditor campaign={createBlankCampaign()} />
}
