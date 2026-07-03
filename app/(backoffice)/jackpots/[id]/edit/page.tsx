import { notFound } from "next/navigation"
import dynamic from "next/dynamic"

import { FormPageSkeleton } from "@/components/backoffice-loading"
import { getJackpotConfig } from "@/lib/jackpot-config-data"

const JackpotEditor = dynamic(
  () => import("@/components/jackpot-editor").then((mod) => mod.JackpotEditor),
  { loading: () => <FormPageSkeleton /> }
)

export default async function EditJackpotPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const jackpot = getJackpotConfig(id)

  if (!jackpot) {
    notFound()
  }

  return <JackpotEditor jackpot={jackpot} />
}
