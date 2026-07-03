import dynamic from "next/dynamic"

import { TablePageSkeleton } from "@/components/backoffice-loading"

const JackpotsTable = dynamic(
  () => import("@/components/jackpots-table").then((mod) => mod.JackpotsTable),
  { loading: () => <TablePageSkeleton /> }
)

export default function JackpotsPage() {
  return <JackpotsTable />
}
