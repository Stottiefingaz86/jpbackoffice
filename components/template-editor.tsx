"use client"

import * as React from "react"
import Link from "next/link"
import { InfoIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

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
import type { TemplateDetail, TemplateLocks, TemplateTier } from "@/lib/template-data"
import { triggerTypeOptions } from "@/lib/wizard-data"
import { cn } from "@/lib/utils"

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

function LockBadge({
  locked,
  onToggle,
}: {
  locked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
        locked
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-brand/30 bg-brand/10 text-brand"
      )}
    >
      {locked ? "Locked" : "Overridable"}
    </button>
  )
}

function ConfigSection({
  title,
  locked,
  onToggleLock,
  children,
}: {
  title: string
  locked: boolean
  onToggleLock: () => void
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/80">
      <div className="flex items-center justify-between border-b border-border/60 bg-surface-200/60 px-4 py-3">
        <p className="text-sm font-semibold">{title}</p>
        <LockBadge locked={locked} onToggle={onToggleLock} />
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export function TemplateEditor({ template }: { template: TemplateDetail }) {
  const [draft, setDraft] = React.useState(() =>
    structuredClone(template)
  )

  function patch(patch: Partial<TemplateDetail>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function patchConfig(
    patch: Partial<TemplateDetail["config"]>
  ) {
    setDraft((current) => ({
      ...current,
      config: { ...current.config, ...patch },
    }))
  }

  function toggleLock(key: keyof TemplateLocks) {
    setDraft((current) => ({
      ...current,
      locks: { ...current.locks, [key]: !current.locks[key] },
    }))
  }

  function updateTier(index: number, patch: Partial<TemplateTier>) {
    setDraft((current) => ({
      ...current,
      config: {
        ...current.config,
        tiers: current.config.tiers.map((tier, i) =>
          i === index ? { ...tier, ...patch } : tier
        ),
      },
    }))
  }

  function addTier() {
    setDraft((current) => ({
      ...current,
      config: {
        ...current.config,
        tiers: [
          ...current.config.tiers,
          { name: "New Tier", split: "0", triggerType: "mystery" },
        ],
      },
    }))
  }

  function removeTier(index: number) {
    if (draft.config.tiers.length <= 1) return
    setDraft((current) => ({
      ...current,
      config: {
        ...current.config,
        tiers: current.config.tiers.filter((_, i) => i !== index),
      },
    }))
  }

  function save() {
    toast.success("Template saved as new version", {
      description: `${draft.id} · v${draft.version + 1}`,
    })
  }

  const contribLabel =
    draft.config.contribution.basis === "percentage"
      ? "Percentage (%)"
      : "Fixed amount"

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/templates" className="text-brand hover:underline">
            Templates
          </Link>
          <span>/</span>
          <span>{draft.name}</span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-normal tracking-tight">Edit template</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {draft.id} · v{draft.version} — saving creates v{draft.version + 1}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="outline"
              className="rounded-md border-border/80"
              render={<Link href="/templates" />}
            >
              Cancel
            </Button>
            <Button
              className="rounded-md bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={save}
            >
              Save as new version
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <div className="flex gap-3 rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm leading-relaxed text-muted-foreground">
          <InfoIcon className="mt-0.5 size-4 shrink-0 text-brand" />
          <p className="flex-1">
            A template holds <strong className="text-foreground">structure + default values</strong>.
            Identity (name, brand scope, ID, schedule, concrete amounts) is always set
            per-jackpot. Mark each group <strong className="text-foreground">Overridable</strong> or{" "}
            <strong className="text-foreground">Locked</strong>; locked groups are inherited
            read-only on the new jackpot. Templates carry no campaigns. Editing creates a
            new version; jackpots record their source template + version.
          </p>
          <RefTag className="shrink-0 self-start">FR-005 · DL-029 · DL-034</RefTag>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="supabase-panel rounded-xl p-5">
          <h2 className="mb-4 text-base font-semibold">Template identity</h2>
          <div className="flex flex-col gap-4">
            <div className="max-w-lg flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">
                Template name <span className="text-muted-foreground/70">(required)</span>
              </Label>
              <Input
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="e.g. Three-Tier Progressive"
                className="rounded-md"
              />
            </div>
            <div className="max-w-2xl flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Description</Label>
              <Input
                value={draft.desc}
                onChange={(e) => patch({ desc: e.target.value })}
                placeholder="What this template sets up"
                className="rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="supabase-panel rounded-xl p-5">
          <h2 className="text-base font-semibold">Structure & default values</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Each group&apos;s lock decides whether the new jackpot can override it.
          </p>

          <div className="flex flex-col gap-3">
            <ConfigSection
              title="Pool type"
              locked={draft.locks.poolType}
              onToggleLock={() => toggleLock("poolType")}
            >
              <div className="flex max-w-md gap-2">
                <ToggleButton
                  active={draft.config.poolType === "shared"}
                  onClick={() => patchConfig({ poolType: "shared" })}
                  className="flex-1"
                >
                  Shared progressive
                </ToggleButton>
                <ToggleButton
                  active={draft.config.poolType === "personal"}
                  onClick={() => patchConfig({ poolType: "personal" })}
                  className="flex-1"
                >
                  Personal progressive
                </ToggleButton>
              </div>
            </ConfigSection>

            <ConfigSection
              title="Contribution model"
              locked={draft.locks.contribution}
              onToggleLock={() => toggleLock("contribution")}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">Basis</Label>
                  <div className="flex gap-2">
                    <ToggleButton
                      active={draft.config.contribution.basis === "percentage"}
                      onClick={() =>
                        patchConfig({
                          contribution: {
                            ...draft.config.contribution,
                            basis: "percentage",
                          },
                        })
                      }
                    >
                      Percentage
                    </ToggleButton>
                    <ToggleButton
                      active={draft.config.contribution.basis === "fixed"}
                      onClick={() =>
                        patchConfig({
                          contribution: {
                            ...draft.config.contribution,
                            basis: "fixed",
                          },
                        })
                      }
                    >
                      Fixed amount
                    </ToggleButton>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">{contribLabel}</Label>
                  <Input
                    value={draft.config.contribution.value}
                    onChange={(e) =>
                      patchConfig({
                        contribution: {
                          ...draft.config.contribution,
                          value: e.target.value,
                        },
                      })
                    }
                    placeholder="default value"
                    className="rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">Funding source</Label>
                <div className="flex max-w-lg gap-2">
                  <ToggleButton
                    active={draft.config.contribution.funding === "in"}
                    onClick={() =>
                      patchConfig({
                        contribution: {
                          ...draft.config.contribution,
                          funding: "in",
                        },
                      })
                    }
                  >
                    Part of transaction
                  </ToggleButton>
                  <ToggleButton
                    active={draft.config.contribution.funding === "extra"}
                    onClick={() =>
                      patchConfig({
                        contribution: {
                          ...draft.config.contribution,
                          funding: "extra",
                        },
                      })
                    }
                  >
                    Extra on top
                  </ToggleButton>
                </div>
              </div>
            </ConfigSection>

            <ConfigSection
              title="Prize-tier structure"
              locked={draft.locks.tiers}
              onToggleLock={() => toggleLock("tiers")}
            >
              <div className="flex flex-col gap-3">
                {draft.config.tiers.map((tier, index) => (
                    <div
                      key={`${tier.name}-${index}`}
                      className="grid gap-3 rounded-lg border border-border/60 bg-surface-200/30 p-3 md:grid-cols-[24px_1.4fr_0.8fr_1.1fr_auto] md:items-center"
                    >
                      <div className="flex size-6 items-center justify-center rounded-md bg-foreground text-xs font-semibold text-background">
                        {index + 1}
                      </div>
                      <Input
                        value={tier.name}
                        onChange={(e) =>
                          updateTier(index, { name: e.target.value })
                        }
                        placeholder="Tier name"
                        className="rounded-md"
                      />
                      <PercentInput
                        value={tier.split}
                        onChange={(value) => updateTier(index, { split: value })}
                        placeholder="0"
                      />
                      <Select
                        value={tier.triggerType}
                        onValueChange={(value) =>
                          value &&
                          updateTier(index, {
                            triggerType: value as TemplateTier["triggerType"],
                          })
                        }
                      >
                        <SelectTrigger className="rounded-md">
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
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-md border-destructive/40 text-destructive hover:bg-destructive/10"
                        disabled={draft.config.tiers.length <= 1}
                        onClick={() => removeTier(index)}
                      >
                        <Trash2Icon className="size-4" />
                        Remove
                      </Button>
                    </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-3 rounded-md"
                onClick={addTier}
              >
                <PlusIcon data-icon="inline-start" />
                Add tier
              </Button>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Trigger mechanics & randomness detail are configured on the jackpot; the
                template fixes the tier shape + suggested split.
              </p>
            </ConfigSection>

            <ConfigSection
              title="Eligibility policy"
              locked={draft.locks.eligibility}
              onToggleLock={() => toggleLock("eligibility")}
            >
              <div className="flex flex-col divide-y divide-border/60">
                {(
                  [
                    { key: "jurisdiction", label: "Jurisdiction / market" },
                    { key: "kyc", label: "KYC verification" },
                    { key: "rg", label: "Responsible-gaming" },
                  ] as const
                ).map((row) => (
                  <div
                    key={row.key}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm">{row.label}</span>
                    <Switch
                      checked={draft.config.eligibility[row.key]}
                      onCheckedChange={(checked) =>
                        patchConfig({
                          eligibility: {
                            ...draft.config.eligibility,
                            [row.key]: checked,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 max-w-xs flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">
                  Default minimum qualifying stake
                </Label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="e.g. 0.20"
                  value={draft.config.eligibility.minStake}
                  onChange={(e) =>
                    patchConfig({
                      eligibility: {
                        ...draft.config.eligibility,
                        minStake: e.target.value,
                      },
                    })
                  }
                  className="rounded-md"
                />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Denominated in the jackpot base currency chosen at apply time — the
                  template carries the number only (open question OQ-P1-r, DL-038).
                </p>
              </div>
            </ConfigSection>

            <ConfigSection
              title="Randomness policy"
              locked={draft.locks.randomness}
              onToggleLock={() => toggleLock("randomness")}
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                Certified-RNG enforcement is always on. Certificate references, the
                randomness provider, and provably-fair settings are set per jackpot (they
                are jackpot-specific references). This lock controls whether a new jackpot
                may change the randomness policy defaults inherited from the template.
              </p>
            </ConfigSection>
          </div>
        </div>
      </div>
    </div>
  )
}
