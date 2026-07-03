"use client"

import { RefTag } from "@/components/wizard/ref-tag"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { triggerTypeOptions, type PrizeTier, type WizardDraft } from "@/lib/wizard-data"

function updateTier(
  tiers: PrizeTier[],
  id: string,
  patch: Partial<PrizeTier>
) {
  return tiers.map((tier) => (tier.id === id ? { ...tier, ...patch } : tier))
}

export function TriggersStep({
  draft,
  onChange,
}: {
  draft: WizardDraft
  onChange: (patch: Partial<WizardDraft>) => void
}) {
  const isPersonal = draft.poolType === "personal"

  function updateTierField(id: string, patch: Partial<PrizeTier>) {
    onChange({ tiers: updateTier(draft.tiers, id, patch) })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Triggers</h2>
        <RefTag>FR-003 · BR-005 · BR-009</RefTag>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Configure how each tier pays out. Mystery uses certified randomness;
        must-drop guarantees a payout by time or value.
      </p>

      {isPersonal ? (
        <div className="flex gap-3 rounded-lg border border-brand/30 bg-brand/10 p-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            This is a <strong className="text-foreground">personal progressive</strong>{" "}
            pool. Its award follows the guarantee rule (by time or by value) set in the
            Pool section. Per-tier triggers apply to shared progressive pools.
          </p>
          <RefTag className="shrink-0">FR-004</RefTag>
        </div>
      ) : (
        draft.tiers.map((tier, index) => (
          <div key={tier.id} className="supabase-panel rounded-xl p-4 md:p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground text-xs font-semibold text-background">
                {index + 1}
              </div>
              <p className="font-semibold">{tier.name}</p>
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Trigger type</Label>
              <Select
                value={tier.triggerType}
                onValueChange={(value) =>
                  value && updateTierField(tier.id, { triggerType: value as PrizeTier["triggerType"] })
                }
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {triggerTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                        {option.value === "mystery" ? " (certified RNG)" : ""}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {tier.triggerType === "mystery" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Min value window</Label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border/80 bg-surface-200 px-2.5 text-xs text-muted-foreground">
                      {draft.baseCurrency}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="e.g. 250000"
                      value={tier.mysteryMin}
                      onChange={(e) =>
                        updateTierField(tier.id, { mysteryMin: e.target.value })
                      }
                      className="rounded-l-none rounded-r-lg"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Max value window</Label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border/80 bg-surface-200 px-2.5 text-xs text-muted-foreground">
                      {draft.baseCurrency}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="e.g. 1000000"
                      value={tier.mysteryMax}
                      onChange={(e) =>
                        updateTierField(tier.id, { mysteryMax: e.target.value })
                      }
                      className="rounded-l-none rounded-r-lg"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {tier.triggerType === "mustdrop_value" ? (
              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">
                  Value threshold (BR-004 ceiling)
                </Label>
                <div className="flex max-w-sm">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border/80 bg-surface-200 px-2.5 text-xs text-muted-foreground">
                    {draft.baseCurrency}
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    placeholder="e.g. 25000"
                    value={tier.valueThreshold}
                    onChange={(e) =>
                      updateTierField(tier.id, { valueThreshold: e.target.value })
                    }
                    className="rounded-l-none rounded-r-lg"
                  />
                </div>
              </div>
            ) : null}

            {tier.triggerType === "mustdrop_time" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Drop every</Label>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="e.g. 24"
                    value={tier.mdEvery}
                    onChange={(e) =>
                      updateTierField(tier.id, { mdEvery: e.target.value })
                    }
                    className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Unit</Label>
                  <Select
                    value={tier.mdUnit}
                    onValueChange={(value) =>
                      value && updateTierField(tier.id, { mdUnit: value })
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}
          </div>
        ))
      )}
    </div>
  )
}
