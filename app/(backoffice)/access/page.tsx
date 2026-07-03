import dynamic from "next/dynamic"

import { TablePageSkeleton } from "@/components/backoffice-loading"

const AccessControlTable = dynamic(
  () =>
    import("@/components/access-control-table").then(
      (mod) => mod.AccessControlTable
    ),
  { loading: () => <TablePageSkeleton rows={6} /> }
)

export default function AccessPage() {
  return <AccessControlTable />
}
