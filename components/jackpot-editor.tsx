"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"

import { EligibilityStep } from "@/components/wizard/eligibility-step"
import { PoolStep } from "@/components/wizard/pool-step"
import { PrizeTiersStep } from "@/components/wizard/prize-tiers-step"
import { ReviewStep } from "@/components/wizard/review-step"
import { TriggersStep } from "@/components/wizard/triggers-step"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { JackpotConfigRecord } from "@/lib/jackpot-config-data"
import { wizardSteps } from "@/lib/backoffice-data"
import type { WizardDraft } from "@/lib/wizard-data"
import { cn } from "@/lib/utils"

export function JackpotEditor({ jackpot }: { jackpot: JackpotConfigRecord }) {
  const [section, setSection] = React.useState(0)
  const [draft, setDraft] = React.useState<WizardDraft>(() =>
    structuredClone(jackpot.draft)
  )

  function patchDraft(patch: Partial<WizardDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function saveDraft() {
    toast.success("Configuration saved", {
      description: `${jackpot.id} · ${draft.name}`,
    })
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/jackpots" className="text-brand hover:underline">
            Jackpots
          </Link>
          <span>/</span>
          <span>{jackpot.name}</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-normal tracking-tight">{jackpot.name}</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {jackpot.id} · {jackpot.version} · updated {jackpot.updated}
            </p>
          </div>
          <StatusBadge status={jackpot.status as "Active"} />
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-surface-100 p-4">
          {wizardSteps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setSection(index)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface-200",
                section === index && "bg-surface-200 font-medium text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <Card className="supabase-panel rounded-xl">
          <CardHeader>
            <CardTitle>{wizardSteps[section]}</CardTitle>
            <CardDescription>
              Configure {jackpot.id} — section {section + 1} of {wizardSteps.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {section === 0 ? (
              <PoolStep
                draft={draft}
                onChange={patchDraft}
                currencyLocked={["Active", "Suspended", "Superseded", "Retired"].includes(
                  jackpot.status
                )}
              />
            ) : null}
            {section === 1 ? (
              <PrizeTiersStep draft={draft} onChange={patchDraft} />
            ) : null}
            {section === 2 ? (
              <TriggersStep draft={draft} onChange={patchDraft} />
            ) : null}
            {section === 3 ? (
              <EligibilityStep draft={draft} onChange={patchDraft} />
            ) : null}
            {section === 4 ? <ReviewStep draft={draft} /> : null}

            <Separator />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button
                variant="outline"
                className="rounded-lg border-border/80"
                onClick={saveDraft}
              >
                Save changes
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-lg border-border/80"
                  disabled={section === 0}
                  onClick={() => setSection(section - 1)}
                >
                  Previous section
                </Button>
                {section < wizardSteps.length - 1 ? (
                  <Button
                    className="rounded-lg bg-brand text-brand-foreground hover:bg-brand/90"
                    onClick={() => setSection(section + 1)}
                  >
                    Next section
                  </Button>
                ) : (
                  <Button
                    className="rounded-lg bg-brand text-brand-foreground hover:bg-brand/90"
                    onClick={() =>
                      toast.success("Jackpot validated", {
                        description: draft.name,
                      })
                    }
                  >
                    Validate
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
