import dynamic from "next/dynamic"

import { TablePageSkeleton } from "@/components/backoffice-loading"

const TemplatesGrid = dynamic(
  () => import("@/components/templates-grid").then((mod) => mod.TemplatesGrid),
  { loading: () => <TablePageSkeleton rows={6} /> }
)

export default function TemplatesPage() {
  return <TemplatesGrid />
}
