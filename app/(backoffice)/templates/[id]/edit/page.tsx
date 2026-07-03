import { notFound } from "next/navigation"

import dynamic from "next/dynamic"

import { FormPageSkeleton } from "@/components/backoffice-loading"
import { getTemplateDetail } from "@/lib/template-data"

const TemplateEditor = dynamic(
  () =>
    import("@/components/template-editor").then((mod) => mod.TemplateEditor),
  { loading: () => <FormPageSkeleton /> }
)

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const template = getTemplateDetail(decodeURIComponent(id).toUpperCase())

  if (!template) {
    notFound()
  }

  return <TemplateEditor template={template} />
}
