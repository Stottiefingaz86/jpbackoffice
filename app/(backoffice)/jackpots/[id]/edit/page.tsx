import { notFound } from "next/navigation"

import { JackpotEditor } from "@/components/jackpot-editor"
import { getJackpotConfig } from "@/lib/jackpot-config-data"

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
