"use client"

import { RefTag } from "@/components/wizard/ref-tag"
import { ChipSelect } from "@/components/wizard/chip-select"
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
import { capabilityCatalogue } from "@/lib/capability-data"
import { cn } from "@/lib/utils"
import { enforcePoints, type WizardDraft } from "@/lib/wizard-data"

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm transition-colors",
        active
          ? "border-brand bg-brand/10 text-foreground"
          : "border-border/80 bg-surface-100 text-muted-foreground hover:bg-surface-200"
      )}
    >
      {children}
    </button>
  )
}

export function EligibilityStep({
  draft,
  onChange,
}: {
  draft: WizardDraft
  onChange: (patch: Partial<WizardDraft>) => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Eligibility rules</h2>
        <RefTag>FR-006 · BR-007</RefTag>
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        The engine <strong className="text-foreground">enforces</strong> participation
        using eligibility, jurisdiction, KYC, responsible-gaming and segment context{" "}
        <strong className="text-foreground">supplied by operator systems</strong>. It
        is never the system of record for those decisions and does not compute or store
        them — it consumes the latest supplied status and applies it at each decision
        point.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs uppercase tracking-wide text-muted-foreground">
          Enforced at
        </span>
        {enforcePoints.map((point) => (
          <span
            key={point.label}
            className="inline-flex items-center rounded-md border border-brand/30 bg-brand/10 px-2.5 py-1 text-xs text-brand"
          >
            {point.label}
          </span>
        ))}
      </div>

      <div>
        <p className="mb-1 font-medium">Qualifying amount — engine-local</p>
        <p className="mb-4 text-sm text-muted-foreground">
          The only gate the engine evaluates on its own. Everything below is integration
          / system dependent.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-muted-foreground">
              Minimum qualifying stake
            </Label>
            <div className="flex max-w-xs">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border/80 bg-surface-200 px-2.5 text-xs text-muted-foreground">
                {draft.baseCurrency}
              </span>
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="e.g. 0.20"
                value={draft.minStake}
                onChange={(e) => onChange({ minStake: e.target.value })}
                className="rounded-l-none rounded-r-lg"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Switch
                checked={draft.maxStakeOn}
                onCheckedChange={(checked) => onChange({ maxStakeOn: checked })}
              />
              <Label className="text-sm font-normal text-muted-foreground">
                Maximum qualifying amount (optional)
              </Label>
              <RefTag>DL-026</RefTag>
            </div>
            {draft.maxStakeOn ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Maximum</Label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-border/80 bg-surface-200 px-2.5 text-xs text-muted-foreground">
                      {draft.baseCurrency}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="e.g. 500"
                      value={draft.maxStake}
                      onChange={(e) => onChange({ maxStake: e.target.value })}
                      className="rounded-l-none rounded-r-lg"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Mode</Label>
                  <div className="flex flex-wrap gap-2">
                    <ToggleButton
                      active={draft.maxStakeMode === "absolute"}
                      onClick={() => onChange({ maxStakeMode: "absolute" })}
                    >
                      Absolute
                    </ToggleButton>
                    <ToggleButton
                      active={draft.maxStakeMode === "relative"}
                      onClick={() => onChange({ maxStakeMode: "relative" })}
                    >
                      Relative
                    </ToggleButton>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="font-medium">Integration / system dependent</p>
          <RefTag>DL-026 · DL-031</RefTag>
        </div>
        <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Each gate is declared by the integration and enforced only when enabled.
          Allow-list only: an enabled gate qualifies only the supplied values selected
          here. These come from a <strong className="text-foreground">sample capability catalogue</strong>;
          the live source is the Integration Settings surface.
        </p>
        <div className="flex flex-col divide-y divide-border/60 rounded-lg border border-border/80">
          {capabilityCatalogue.map((cap) => {
            const gateKey = cap.id as keyof Pick<
              WizardDraft,
              "jurisdiction" | "kyc" | "rg" | "segment"
            >
            const enabled =
              gateKey in draft
                ? Boolean(draft[gateKey])
                : false
            const allowed = draft.gateAllow?.[cap.id] ?? []

            return (
              <div key={cap.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{cap.name}</p>
                      <span className="rounded border border-border/80 bg-surface-200 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {cap.attr}
                      </span>
                      <RefTag>{cap.tag}</RefTag>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {cap.desc}
                    </p>
                  </div>
                  {gateKey in draft ? (
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) =>
                        onChange({ [gateKey]: checked })
                      }
                    />
                  ) : (
                    <Switch
                      checked={draft.gateEnabled?.[cap.id] ?? false}
                      onCheckedChange={(checked) =>
                        onChange({
                          gateEnabled: {
                            ...draft.gateEnabled,
                            [cap.id]: checked,
                          },
                        })
                      }
                    />
                  )}
                </div>
                {enabled || draft.gateEnabled?.[cap.id] ? (
                  <div className="mt-3">
                    <p className="mb-2 text-xs text-muted-foreground">
                      Permitted values (allow-list)
                    </p>
                    <ChipSelect
                      options={cap.values}
                      selected={allowed}
                      onChange={(next) =>
                        onChange({
                          gateAllow: {
                            ...draft.gateAllow,
                            [cap.id]: next,
                          },
                        })
                      }
                    />
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm text-muted-foreground">
          Stale / missing context behaviour
        </Label>
        <Select
          value={draft.staleAction}
          onValueChange={(value) =>
            value && onChange({ staleAction: value as WizardDraft["staleAction"] })
          }
        >
          <SelectTrigger className="max-w-xl rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="block">
                Block participation (fail closed)
              </SelectItem>
              <SelectItem value="allow">
                Allow with last-known context
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Contribution and win participation are refused until current context is supplied
          when fail closed is selected.
        </p>
      </div>
    </div>
  )
}
