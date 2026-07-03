"use client"

import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTemplateSummaries } from "@/lib/template-data"

const templates = getTemplateSummaries()

export function TemplatesGrid() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageHeader
        title="Templates"
        tag="FR-005"
        description="Reusable configurations for common jackpot setups. A template carries structure and default values; identity (name, brand, ID, schedule, amounts) stays per-jackpot. Apply one to start a new draft, or edit to create a new version."
        action={
          <Button className="rounded-md bg-brand text-brand-foreground hover:bg-brand/90">
            New template
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:px-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="supabase-panel flex flex-col gap-3 rounded-xl p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold">{template.name}</h2>
              <span className="font-mono text-xs text-muted-foreground">
                {template.id}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {template.desc}
            </p>
            <p className="font-mono text-xs text-muted-foreground/80">
              v{template.version} · {template.author}
            </p>
            <div className="mt-auto flex items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-md bg-surface-200 font-normal text-muted-foreground"
                >
                  {template.tiers} tier(s)
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-md bg-surface-200 font-normal text-muted-foreground"
                >
                  {template.trigger}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-md border-border/80"
                  render={
                    <Link href={`/templates/${template.id}/edit`} />
                  }
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="rounded-md bg-brand text-brand-foreground hover:bg-brand/90"
                  render={<Link href="/jackpots/new" />}
                >
                  Use template
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
