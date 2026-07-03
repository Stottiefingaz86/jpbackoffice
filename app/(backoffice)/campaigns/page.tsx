import dynamic from "next/dynamic"

import { TablePageSkeleton } from "@/components/backoffice-loading"

const CampaignsTable = dynamic(
  () =>
    import("@/components/campaigns-table").then((mod) => mod.CampaignsTable),
  { loading: () => <TablePageSkeleton /> }
)

export default function CampaignsPage() {
  return <CampaignsTable />
}
