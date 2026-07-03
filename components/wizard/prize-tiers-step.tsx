"use client"

import { PlusIcon, Trash2Icon } from "lucide-react"

import { PercentInput } from "@/components/wizard/percent-input"
import { RefTag } from "@/components/wizard/ref-tag"
import { Button } from "@/components/ui/button"
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
import { Switch } from "@/components/ui/switch"
import {
  createTier,
  depConditionOptions,
  depDirectionOptions,
  dependsOnOptions,
  growthOptions,
  offsetUnitOptions,
  poolSplitTotal,
  splitSourceOptions,
  splitUnitLabel,
  triggerTypeOptions,
  type PrizeTier,
  type WizardDraft,
} from "@/lib/wizard-data"
import { cn } from "@/lib/utils"

function updateTier(
  tiers: PrizeTier[],
  id: string,
  patch: Partial<PrizeTier>
) {
  return tiers.map((tier) => (tier.id === id ? { ...tier, ...patch } : tier))
}

export function PrizeTiersStep({
  draft,
  onChange,
}: {
  draft: WizardDraft
  onChange: (patch: Partial<WizardDraft>) => void
}) {
  const isPersonal = draft.poolType === "personal"
  const poolTotal = poolSplitTotal(draft.tiers)

  function setTiers(tiers: PrizeTier[]) {
    onChange({ tiers })
  }

  function updateTierField(id: string, patch: Partial<PrizeTier>) {
    setTiers(updateTier(draft.tiers, id, patch))
  }

  function addTier() {
    setTiers([...draft.tiers, createTier("New Tier", "0", "mystery")])
  }

  function removeTier(id: string) {
    if (draft.tiers.length <= 1) return
    setTiers(draft.tiers.filter((tier) => tier.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Prize tiers</h2>
        <RefTag>FR-002 · BR-003</RefTag>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Each tier draws a configurable share of the pooled contribution and carries
        its own trigger rule. A tier may depend on another through one explicit,
        acyclic relationship (DL-022).
      </p>

      {isPersonal ? (
        <div className="flex gap-3 rounded-lg border border-brand/30 bg-brand/10 p-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            This is a <strong className="text-foreground">personal progressive</strong>{" "}
            pool. Its award is governed by the guarantee rule in the Pool section, not
            by shared prize tiers. Prize tiers apply to shared progressive pools.
          </p>
          <RefTag className="shrink-0">FR-004</RefTag>
        </div>
      ) : (
        <>
          {draft.tiers.map((tier, index) => (
            <TierCard
              key={tier.id}
              tier={tier}
              index={index}
              tiers={draft.tiers}
              currency={draft.baseCurrency}
              onUpdate={(patch) => updateTierField(tier.id, patch)}
              onRemove={() => removeTier(tier.id)}
              canRemove={draft.tiers.length > 1}
            />
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg border-border/80"
              onClick={addTier}
            >
              <PlusIcon data-icon="inline-start" />
              Add prize tier
            </Button>
            <p className="text-sm text-muted-foreground">
              From-pool total:{" "}
              <span
                className={cn(
                  "font-medium tabular-nums",
                  poolTotal === 100 ? "text-brand" : "text-destructive"
                )}
              >
                {poolTotal.toFixed(1)}%
              </span>{" "}
              <span className="text-muted-foreground/60">/ 100%</span>
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function TierCard({
  tier,
  index,
  tiers,
  currency,
  onUpdate,
  onRemove,
  canRemove,
}: {
  tier: PrizeTier
  index: number
  tiers: PrizeTier[]
  currency: string
  onUpdate: (patch: Partial<PrizeTier>) => void
  onRemove: () => void
  canRemove: boolean
}) {
  const hasDep = Boolean(tier.dependsOn)
  const parentName = tier.dependsOn

  return (
    <div className="supabase-panel rounded-xl p-4 md:p-5">
      <div className="mb-4 flex items-center gap-3 border-b border-border/60 pb-4">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground text-xs font-semibold text-background">
          {index + 1}
        </div>
        <Input
          value={tier.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="max-w-xs rounded-lg font-semibold"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto rounded-lg border-destructive/40 text-destructive hover:bg-destructive/10"
          disabled={!canRemove}
          onClick={onRemove}
        >
          <Trash2Icon className="size-4" />
          Remove
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">
            Split — {splitUnitLabel(tier.splitSource)}
          </Label>
          <PercentInput
            value={tier.split}
            onChange={(value) => onUpdate({ split: value })}
            placeholder="0"
            className="max-w-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">Split source</Label>
          <Select
            value={tier.splitSource}
            onValueChange={(value) => value && onUpdate({ splitSource: value })}
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {splitSourceOptions(tiers, tier.id).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">Growth</Label>
          <Select
            value={tier.growth}
            onValueChange={(value) =>
              value && onUpdate({ growth: value as PrizeTier["growth"] })
            }
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {growthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-xs text-muted-foreground">Tier dependency</Label>
          <RefTag>BR-003 · DL-022</RefTag>
        </div>
        <Select
          value={tier.dependsOn || "__none__"}
          onValueChange={(value) =>
            onUpdate({ dependsOn: value === "__none__" ? "" : (value ?? "") })
          }
        >
          <SelectTrigger className="rounded-lg">
            <SelectValue placeholder="Independent (no dependency)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {dependsOnOptions(tiers, tier.id).map((option) => (
                <SelectItem
                  key={option.value || "__none__"}
                  value={option.value || "__none__"}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {hasDep ? (
          <div className="mt-2 rounded-lg border border-brand/30 bg-brand/5 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">Gate direction</Label>
                <Select
                  value={tier.depDirection}
                  onValueChange={(value) =>
                    value && onUpdate({ depDirection: value })
                  }
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {depDirectionOptions(parentName).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">When the parent…</Label>
                <Select
                  value={tier.depCondition}
                  onValueChange={(value) =>
                    value && onUpdate({ depCondition: value })
                  }
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {depConditionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {tier.depCondition === "won_n" || tier.depCondition === "activated_n" ? (
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">N (count)</Label>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="e.g. 3"
                    value={tier.depN}
                    onChange={(e) => onUpdate({ depN: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
              ) : null}
              {tier.depCondition === "value_x" ? (
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Value X</Label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border/80 bg-surface-200 px-2.5 text-xs text-muted-foreground">
                      {currency}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="e.g. 50000"
                      value={tier.depValue}
                      onChange={(e) => onUpdate({ depValue: e.target.value })}
                      className="rounded-l-none rounded-r-lg"
                    />
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label className="text-xs text-muted-foreground">
                  Offset / delay (optional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    placeholder="e.g. 24"
                    value={tier.depOffsetN}
                    onChange={(e) => onUpdate({ depOffsetN: e.target.value })}
                    className="rounded-lg"
                  />
                  <Select
                    value={tier.depOffsetUnit}
                    onValueChange={(value) =>
                      value && onUpdate({ depOffsetUnit: value })
                    }
                  >
                    <SelectTrigger className="w-32 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {offsetUnitOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Switch
                checked={tier.depReset}
                onCheckedChange={(checked) => onUpdate({ depReset: checked })}
              />
              <Label className="text-sm font-normal text-muted-foreground">
                Reset / reseed the dependent tier after it fires
              </Label>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              One explicit, acyclic relationship per tier. Conflicting settings are
              mutually exclusive; cycles are rejected at validation.
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Trigger type</Label>
        <Select
          value={tier.triggerType}
          onValueChange={(value) =>
            value && onUpdate({ triggerType: value as PrizeTier["triggerType"] })
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
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
