import dynamic from "next/dynamic"

import { DashboardSkeleton } from "@/components/backoffice-loading"

const DashboardOverview = dynamic(
  () =>
    import("@/components/dashboard-overview").then(
      (mod) => mod.DashboardOverview
    ),
  { loading: () => <DashboardSkeleton /> }
)

export default function DashboardPage() {
  return <DashboardOverview />
}
