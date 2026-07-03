import { notFound } from "next/navigation"

import { TemplateEditor } from "@/components/template-editor"
import { getTemplateDetail } from "@/lib/template-data"

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
