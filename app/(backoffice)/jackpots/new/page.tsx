import dynamic from "next/dynamic"

import { FormPageSkeleton } from "@/components/backoffice-loading"

const CreateJackpotWizard = dynamic(
  () =>
    import("@/components/create-jackpot-wizard").then(
      (mod) => mod.CreateJackpotWizard
    ),
  { loading: () => <FormPageSkeleton /> }
)

export default function NewJackpotPage() {
  return <CreateJackpotWizard />
}
