"use client"

import { InfoIcon } from "lucide-react"

import { ChipSelect } from "@/components/wizard/chip-select"
import { GameCataloguePicker } from "@/components/wizard/game-catalogue-picker"
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
import { brandOptions, providerOptions } from "@/lib/catalogue-data"
import { cn } from "@/lib/utils"
import type { PoolType, WizardDraft } from "@/lib/wizard-data"

function ToggleButton({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-2 text-sm transition-colors",
        active
          ? "border-brand/40 bg-brand/10 text-foreground"
          : "border-border/80 bg-surface-100 text-muted-foreground hover:bg-surface-200",
        className
      )}
    >
      {children}
    </button>
  )
}

function contributionSummary(draft: WizardDraft) {
  if (!draft.contributionValue) return null
  const funding =
    draft.contributionFunding === "in"
      ? "taken from the transaction amount"
      : "added on top of the transaction amount"
  if (draft.contributionBasis === "percentage") {
    return `${draft.contributionValue}% of transaction · ${funding}`
  }
  return `${draft.baseCurrency} ${draft.contributionValue} per transaction · ${funding}`
}

export function PoolStep({
  draft,
  onChange,
  currencyLocked = false,
}: {
  draft: WizardDraft
  onChange: (patch: Partial<WizardDraft>) => void
  currencyLocked?: boolean
}) {
  const summary = contributionSummary(draft)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Pool setup</h2>
        <RefTag>FR-001 · FR-014</RefTag>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm text-muted-foreground">Pool type</Label>
          <RefTag>FR-004 · BR-006</RefTag>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              {
                value: "shared" as PoolType,
                title: "Shared progressive",
                desc: "One pool aggregating eligible contributions across all players in scope.",
              },
              {
                value: "personal" as PoolType,
                title: "Personal progressive",
                desc: "Player-funded pool, isolated per player, no cross-contamination.",
              },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ poolType: option.value })}
              className={cn(
                "rounded-lg border p-4 text-left transition-colors",
                draft.poolType === option.value
                  ? "border-brand/40 bg-brand/10"
                  : "border-border/80 bg-surface-100 hover:bg-surface-200"
              )}
            >
              <p className="font-semibold">{option.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {option.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="pool-name">Pool name</Label>
        <Input
          id="pool-name"
          placeholder="e.g. Aztec Riches Progressive"
          value={draft.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="max-w-lg rounded-md"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label>
            Base currency{" "}
            <span className="font-normal text-muted-foreground">(required)</span>
          </Label>
          <RefTag>DL-038 · FR-008</RefTag>
        </div>
        <Select
          value={draft.baseCurrency}
          onValueChange={(value) => value && onChange({ baseCurrency: value })}
          disabled={currencyLocked}
        >
          <SelectTrigger className="max-w-xs rounded-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {currencyLocked ? (
          <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Fixed — chosen once per jackpot; locked after first activation.
          </p>
        ) : null}
        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Every money setting on this jackpot — seed, tier values, qualifying stakes,
          thresholds — is entered in this currency. Defaults to the tenant base
          currency (EUR); brand overrides per DL-038.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm text-muted-foreground">Internal brand scope</Label>
          <RefTag>FR-014</RefTag>
        </div>
        <ChipSelect
          options={brandOptions}
          selected={draft.brands}
          onChange={(brands) => onChange({ brands })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm text-muted-foreground">Contributing games</Label>
          <RefTag>FR-001 · DL-021</RefTag>
        </div>
        <GameCataloguePicker
          selectedGames={draft.games}
          onChange={(games) => onChange({ games })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm text-muted-foreground">Game providers</Label>
        <ChipSelect
          options={providerOptions}
          selected={draft.providers}
          onChange={(providers) => onChange({ providers })}
        />
      </div>

      <div className="border-t border-border/60 pt-6">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="font-semibold">Contribution</p>
          <RefTag>FR-001 · ST-002 · DL-018</RefTag>
        </div>
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          How each qualifying transaction funds the pool. Choose the calculation basis
          and whether the money is taken from within the transaction amount or added as
          an extra on top.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">Calculation basis</Label>
            <div className="flex gap-2">
              <ToggleButton
                active={draft.contributionBasis === "percentage"}
                onClick={() => onChange({ contributionBasis: "percentage" })}
              >
                Percentage
              </ToggleButton>
              <ToggleButton
                active={draft.contributionBasis === "fixed"}
                onClick={() => onChange({ contributionBasis: "fixed" })}
              >
                Fixed amount
              </ToggleButton>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              {draft.contributionBasis === "percentage"
                ? "Percentage of transaction amount"
                : "Fixed amount"}
            </Label>
            <div className="flex max-w-xs">
              {draft.contributionBasis === "percentage" ? (
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-border/80 bg-surface-200 px-2.5 text-xs text-muted-foreground">
                  %
                </span>
              ) : (
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-border/80 bg-surface-200 px-2.5 text-xs text-muted-foreground">
                  {draft.baseCurrency}
                </span>
              )}
              <Input
                type="number"
                min={0}
                step={0.01}
                value={draft.contributionValue}
                onChange={(e) => onChange({ contributionValue: e.target.value })}
                placeholder={draft.contributionBasis === "percentage" ? "1.5" : "0.05"}
                className="rounded-l-none rounded-r-md"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">Funding source</Label>
          <div className="flex max-w-lg gap-2">
            <ToggleButton
              active={draft.contributionFunding === "in"}
              onClick={() => onChange({ contributionFunding: "in" })}
              className="flex-1"
            >
              Part of transaction amount
            </ToggleButton>
            <ToggleButton
              active={draft.contributionFunding === "extra"}
              onClick={() => onChange({ contributionFunding: "extra" })}
              className="flex-1"
            >
              Extra on top
            </ToggleButton>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {draft.contributionFunding === "in"
              ? "Taken from within the transaction amount — the contribution is a share of what the player already wagered."
              : "Added on top of the transaction — not part of the transaction amount (e.g. house-funded top-up)."}
          </p>
        </div>
        {summary ? (
          <div className="mt-4 rounded-md border-l-2 border-brand bg-surface-200/60 px-4 py-3 text-sm leading-relaxed">
            Each qualifying transaction contributes <strong>{summary}</strong>.
          </div>
        ) : null}
        <div className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground">
          <InfoIcon className="mt-0.5 size-3.5 shrink-0 text-brand" />
          <p>
            Foreign-currency contributions convert to{" "}
            <strong className="text-foreground">{draft.baseCurrency}</strong> on intake
            using the integration-supplied FX rate. The engine never computes its own
            rate. Hierarchy: tenant → brand → jackpot. Rounding: half-even to minor
            units.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="seed">Seed / base value</Label>
        <div className="flex max-w-xs">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-border/80 bg-surface-200 px-2.5 text-xs text-muted-foreground">
            {draft.baseCurrency}
          </span>
          <Input
            id="seed"
            type="number"
            min={0}
            value={draft.seed}
            onChange={(e) => onChange({ seed: e.target.value })}
            placeholder="10000"
            className="rounded-l-none rounded-r-md"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold">Contribution matching</p>
          <RefTag>FR-001 · BR-002</RefTag>
        </div>
        <p className="text-sm text-muted-foreground">
          Source attribution uses properties supplied on the inbound transaction — the
          engine matches and attributes, never authoring tags or computing membership.
        </p>
        <div className="overflow-hidden rounded-lg border border-border/80">
          <div className="flex gap-3 border-b border-border/60 bg-surface-200/60 px-4 py-3">
            <InfoIcon className="mt-0.5 size-4 shrink-0 text-brand" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Source attribution — primary</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                A transaction matches when its supplied game, provider, and internal
                brand fall within the pool scope set above. Activity outside the
                configured scope does not contribute.
              </p>
            </div>
            <RefTag className="shrink-0 self-start">FR-014 · BR-002</RefTag>
          </div>
          <div className="px-4 py-3">
            <p className="text-sm font-semibold">Base accrual — scope-based</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              The pool accrues automatically for every in-scope, eligible transaction —
              a campaign is never required to collect. Operator targeting plus base
              eligibility is the single engine-side gate.
            </p>
          </div>
        </div>
        <div className="flex gap-3 rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm leading-relaxed text-muted-foreground">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-brand" />
          <p>
            <strong className="text-foreground">Campaign tags moved to the campaign.</strong>{" "}
            Tag-like matching and unique Campaign Identifiers are now configured at the
            campaign level (as an overlay) rather than on the jackpot itself. One
            transaction can contribute to several jackpots (many-to-many).
          </p>
        </div>
      </div>

      {draft.poolType === "personal" ? (
        <div className="supabase-panel rounded-lg p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="font-medium">Guaranteed award rule</p>
            <RefTag>FR-004 · BR-004</RefTag>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Player token key</Label>
              <Input
                value={draft.personalTokenKey}
                onChange={(e) => onChange({ personalTokenKey: e.target.value })}
                className="rounded-md font-mono text-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Guarantee model</Label>
              <div className="flex gap-2">
                <ToggleButton
                  active={draft.guaranteeModel === "time"}
                  onClick={() => onChange({ guaranteeModel: "time" })}
                >
                  By time
                </ToggleButton>
                <ToggleButton
                  active={draft.guaranteeModel === "value"}
                  onClick={() => onChange({ guaranteeModel: "value" })}
                >
                  By value
                </ToggleButton>
              </div>
            </div>
            {draft.guaranteeModel === "time" ? (
              <>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Every</Label>
                  <Input
                    value={draft.guaranteeEvery}
                    onChange={(e) => onChange({ guaranteeEvery: e.target.value })}
                    placeholder="e.g. 7"
                    className="rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Unit</Label>
                  <Select
                    value={draft.guaranteeUnit}
                    onValueChange={(value) =>
                      value && onChange({ guaranteeUnit: value })
                    }
                  >
                    <SelectTrigger className="rounded-md">
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
              </>
            ) : (
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label className="text-xs text-muted-foreground">
                  Award guaranteed when personal balance reaches
                </Label>
                <div className="flex max-w-xs">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-border/80 bg-surface-200 px-2.5 text-xs text-muted-foreground">
                    {draft.baseCurrency}
                  </span>
                  <Input
                    value={draft.guaranteeValue}
                    onChange={(e) => onChange({ guaranteeValue: e.target.value })}
                    placeholder="e.g. 5000"
                    className="rounded-l-none rounded-r-md"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="rng-cert">RNG certification ref</Label>
        <Input
          id="rng-cert"
          value={draft.rngCertRef}
          onChange={(e) => onChange({ rngCertRef: e.target.value })}
          placeholder="e.g. GLI-RNG-2026-04812"
          className="max-w-md rounded-md font-mono text-sm"
        />
      </div>
    </div>
  )
}
