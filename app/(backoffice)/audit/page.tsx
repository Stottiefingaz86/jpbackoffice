import dynamic from "next/dynamic"

import { TablePageSkeleton } from "@/components/backoffice-loading"

const AuditLogTable = dynamic(
  () => import("@/components/audit-log-table").then((mod) => mod.AuditLogTable),
  { loading: () => <TablePageSkeleton rows={10} /> }
)

export default function AuditPage() {
  return <AuditLogTable />
}
