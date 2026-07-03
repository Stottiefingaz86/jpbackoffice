"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"

import { EligibilityStep } from "@/components/wizard/eligibility-step"
import { PoolStep } from "@/components/wizard/pool-step"
import { PrizeTiersStep } from "@/components/wizard/prize-tiers-step"
import { ReviewStep } from "@/components/wizard/review-step"
import { TriggersStep } from "@/components/wizard/triggers-step"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { wizardSteps } from "@/lib/backoffice-data"
import { createBlankDraft, type WizardDraft } from "@/lib/wizard-data"
import { cn } from "@/lib/utils"

export function CreateJackpotWizard() {
  const [step, setStep] = React.useState(0)
  const [draft, setDraft] = React.useState<WizardDraft>(() => createBlankDraft())

  function patchDraft(patch: Partial<WizardDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function saveDraft() {
    toast.success("Draft saved", {
      description: draft.name || "Untitled jackpot pool",
    })
  }

  function nextStep() {
    if (step < wizardSteps.length - 1) setStep(step + 1)
  }

  function prevStep() {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-normal tracking-tight">Create jackpot</h1>
        <p className="text-muted-foreground">
          Configure a new jackpot pool across five setup steps
        </p>
      </div>

      <div className="px-4 lg:px-6">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-surface-100 p-4">
          {wizardSteps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface-200"
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                  index === step
                    ? "bg-brand text-brand-foreground"
                    : index < step
                      ? "bg-surface-300 text-foreground"
                      : "border border-border/80 text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  index === step ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <Card className="supabase-panel rounded-xl">
          <CardHeader>
            <CardTitle>{wizardSteps[step]}</CardTitle>
            <CardDescription>
              Step {step + 1} of {wizardSteps.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {step === 0 ? (
              <PoolStep draft={draft} onChange={patchDraft} />
            ) : null}
            {step === 1 ? (
              <PrizeTiersStep draft={draft} onChange={patchDraft} />
            ) : null}
            {step === 2 ? (
              <TriggersStep draft={draft} onChange={patchDraft} />
            ) : null}
            {step === 3 ? (
              <EligibilityStep draft={draft} onChange={patchDraft} />
            ) : null}
            {step === 4 ? <ReviewStep draft={draft} /> : null}

            <Separator />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button
                variant="outline"
                className="rounded-lg border-border/80"
                onClick={saveDraft}
              >
                Save draft
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-lg border-border/80"
                  disabled={step === 0}
                  onClick={prevStep}
                >
                  Back
                </Button>
                {step < wizardSteps.length - 1 ? (
                  <Button
                    className="rounded-lg bg-brand text-brand-foreground hover:bg-brand/90"
                    onClick={nextStep}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    className="rounded-lg bg-brand text-brand-foreground hover:bg-brand/90"
                    onClick={() =>
                      toast.success("Jackpot validated", {
                        description: draft.name || "New jackpot pool",
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

      <div className="px-4 lg:px-6">
        <Button variant="ghost" render={<Link href="/jackpots" />}>
          Cancel and return to jackpots
        </Button>
      </div>
    </div>
  )
}
