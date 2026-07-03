"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangleIcon, InfoIcon } from "lucide-react"
import { toast } from "sonner"

import { RefTag } from "@/components/wizard/ref-tag"
import { SegmentTargetingBuilder } from "@/components/segment-targeting-builder"
import { Badge } from "@/components/ui/badge"
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
  campaignReadiness,
  fundingIsExtra,
  fundingLabel,
  jackpotOptions,
  lifecycleSteps,
  segmentSummary,
  type CampaignDetail,
  type CampaignLifecycleStatus,
} from "@/lib/campaign-data"
import { jackpots } from "@/lib/backoffice-data"
import { cn } from "@/lib/utils"

function lifecycleIndex(status: CampaignLifecycleStatus) {
  if (status === "Draft") return 0
  if (status === "Scheduled") return 1
  if (status === "Running" || status === "Paused") return 2
  return 3
}

function statusBadgeClass(status: CampaignLifecycleStatus) {
  switch (status) {
    case "Draft":
      return "bg-surface-300 text-muted-foreground"
    case "Scheduled":
      return "bg-brand/15 text-brand"
    case "Running":
      return "bg-brand text-brand-foreground"
    case "Paused":
      return "bg-destructive/15 text-destructive"
    case "Completed":
      return "bg-surface-300 text-muted-foreground"
    case "Cancelled":
      return "bg-destructive/15 text-destructive"
  }
}

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

function AudienceOption({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full gap-3 rounded-lg border p-4 text-left transition-colors",
        active
          ? "border-brand/40 bg-brand/5"
          : "border-border/80 bg-surface-100 hover:bg-surface-200/60"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
          active ? "border-foreground" : "border-muted-foreground"
        )}
      >
        {active ? <span className="size-2 rounded-full bg-foreground" /> : null}
      </span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
  )
}

function Panel({
  title,
  tag,
  children,
}: {
  title: string
  tag?: string
  children: React.ReactNode
}) {
  return (
    <div className="supabase-panel rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold">{title}</h2>
        {tag ? <RefTag>{tag}</RefTag> : null}
      </div>
      {children}
    </div>
  )
}

export function CampaignEditor({
  campaign: initial,
}: {
  campaign: CampaignDetail
}) {
  const [campaign, setCampaign] = React.useState(() => structuredClone(initial))
  const [tagInput, setTagInput] = React.useState("")
  const [blockedMsg, setBlockedMsg] = React.useState("")

  const editable = ["Draft", "Scheduled"].includes(campaign.status)
  const readiness = campaignReadiness(campaign)
  const displayName = campaign.name.trim() || "Untitled campaign"
  const currentStep = lifecycleIndex(campaign.status)

  function patch(patch: Partial<CampaignDetail>) {
    setCampaign((current) => ({ ...current, ...patch }))
    setBlockedMsg("")
  }

  function transition(
    status: CampaignLifecycleStatus,
    note: string
  ) {
    if (status === "Scheduled" || status === "Running") {
      const check = campaignReadiness(campaign)
      if (!check.ok) {
        setBlockedMsg(
          `Cannot ${status === "Scheduled" ? "schedule" : "launch"} — supplied targeting context is incomplete.`
        )
        return
      }
    }

    patch({
      status,
      segment: segmentSummary(campaign.segmentExpr),
      history: [
        {
          status,
          actor: "M. Alvarez",
          date: new Date().toISOString().slice(0, 16).replace("T", " "),
          note,
        },
        ...campaign.history,
      ],
    })

    toast.success(`Campaign ${status.toLowerCase()}`, {
      description: displayName,
    })
  }

  function addTag() {
    const tag = tagInput.trim()
    if (!tag || campaign.tags.includes(tag)) return
    patch({ tags: [...campaign.tags, tag] })
    setTagInput("")
  }

  const actions =
    campaign.status === "Draft"
      ? [{ label: "Schedule", primary: true, onClick: () => transition("Scheduled", "Scheduled for the configured window") }]
      : campaign.status === "Scheduled"
        ? [
            { label: "Launch", primary: true, onClick: () => transition("Running", "Launched") },
            { label: "Back to draft", primary: false, onClick: () => transition("Draft", "Returned to draft for edits") },
          ]
        : campaign.status === "Running"
          ? [
              { label: "Pause", primary: false, onClick: () => transition("Paused", "Paused") },
              { label: "End campaign", primary: false, onClick: () => transition("Completed", "Ended by operator") },
            ]
          : campaign.status === "Paused"
            ? [
                { label: "Resume", primary: true, onClick: () => transition("Running", "Resumed") },
                { label: "End campaign", primary: false, onClick: () => transition("Completed", "Ended by operator") },
              ]
            : []

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-5 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/campaigns" className="text-brand hover:underline">
            Campaigns
          </Link>
          <span>/</span>
          <span>{displayName}</span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-normal tracking-tight">{displayName}</h1>
              <Badge className={cn("rounded-md border-0", statusBadgeClass(campaign.status))}>
                {campaign.status}
              </Badge>
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{campaign.id}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.primary ? "default" : "outline"}
                className={cn(
                  "rounded-md",
                  action.primary && "bg-brand text-brand-foreground hover:bg-brand/90",
                  !action.primary && "border-border/80"
                )}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <Panel title="Lifecycle" tag="ST-005">
          <div className="flex flex-wrap items-center gap-3">
            {lifecycleSteps.map((step, index) => {
              const active = index === currentStep
              const complete = index < currentStep
              return (
                <React.Fragment key={step}>
                  {index > 0 ? (
                    <div
                      className={cn(
                        "hidden h-px w-8 sm:block",
                        complete ? "bg-brand" : "bg-border"
                      )}
                    />
                  ) : null}
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2.5 rounded-full",
                        active || complete ? "bg-brand" : "bg-muted-foreground/40"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        active ? "font-medium text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step}
                    </span>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
          {campaign.status === "Scheduled" ? (
            <div className="mt-4 flex gap-3 rounded-lg border border-brand/30 bg-brand/5 p-4 text-sm leading-relaxed text-muted-foreground">
              <InfoIcon className="mt-0.5 size-4 shrink-0 text-brand" />
              <p>
                Scheduled for <strong className="text-foreground">{campaign.start}</strong> — set up
                and waiting, not live yet. Use <strong className="text-foreground">Launch</strong> to
                start it now.
              </p>
            </div>
          ) : null}
          {campaign.status === "Paused" ? (
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-muted-foreground">
              Currently paused — resume to continue running, or end the campaign.
            </div>
          ) : null}
        </Panel>

        {blockedMsg ? (
          <div className="flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm leading-relaxed text-muted-foreground">
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p>{blockedMsg}</p>
            <RefTag className="shrink-0 self-start">ST-005 · ST-006</RefTag>
          </div>
        ) : null}

        {!readiness.ok && campaign.status === "Draft" ? (
          <div className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-muted-foreground">
            <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <p>
              Supplied targeting context required before this campaign can be scheduled:{" "}
              <strong className="text-foreground">{readiness.missing.join(", ")}</strong>.
              Targeting context is supplied to the engine, not computed here.
            </p>
            <RefTag className="shrink-0 self-start">FR-009 · ST-005</RefTag>
          </div>
        ) : null}

        <Panel title="Campaign details" tag="FR-009 · BR-008">
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            {editable
              ? "Set the target jackpot, the supplied-segment targeting, and the schedule window."
              : "Targeting is locked once a campaign is launched. Pause or end it to change the live audience."}
          </p>

          <div className="flex flex-col gap-5">
            <div className="max-w-lg flex flex-col gap-2">
              <Label>
                Campaign name{" "}
                {editable ? (
                  <span className="font-normal text-muted-foreground">(required)</span>
                ) : null}
              </Label>
              {editable ? (
                <Input
                  value={campaign.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="e.g. Weekend Warriors Boost"
                  className="rounded-md"
                />
              ) : (
                <p className="text-sm">{displayName}</p>
              )}
            </div>

            <div className="max-w-lg flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label>
                  Target jackpot{" "}
                  {editable ? (
                    <span className="font-normal text-muted-foreground">(required)</span>
                  ) : null}
                </Label>
                <RefTag>FR-009</RefTag>
              </div>
              {editable ? (
                <Select
                  value={campaign.jackpotId || undefined}
                  onValueChange={(value) => {
                    const jackpot = jackpots.find((item) => item.id === value)
                    patch({
                      jackpotId: value ?? "",
                      jackpot: jackpot?.name ?? "",
                    })
                  }}
                >
                  <SelectTrigger className="rounded-md">
                    <SelectValue placeholder="Select jackpot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {jackpotOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm">{campaign.jackpot}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <Label>Audience & targeting</Label>
                <RefTag>FR-009 · BR-008</RefTag>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Choose who the campaign runs for. Targeting is optional — a campaign can run for all
                eligible players, or against one or more supplied segments. Segment membership is
                computed externally; the engine evaluates conditions against supplied membership and
                never defines, previews, or computes a segment.
              </p>

              {editable ? (
                <div className="flex max-w-2xl flex-col gap-2">
                  <AudienceOption
                    active={campaign.audience === "segment"}
                    title="Target supplied segment(s)"
                    description="Run against one or more supplied segments, combined with set conditions."
                    onClick={() => patch({ audience: "segment" })}
                  />
                  <AudienceOption
                    active={campaign.audience === "all"}
                    title="All eligible players"
                    description="No segment restriction. Still time-boxed by the schedule and eligibility-enforced (jurisdiction, KYC, responsible-gaming)."
                    onClick={() => patch({ audience: "all" })}
                  />
                </div>
              ) : null}

              {campaign.audience === "all" ? (
                <div className="flex gap-3 rounded-lg border border-border/80 bg-surface-200/50 p-4 text-sm leading-relaxed text-muted-foreground">
                  <InfoIcon className="mt-0.5 size-4 shrink-0 text-brand" />
                  <p>
                    Runs for <strong className="text-foreground">all eligible players</strong> — no
                    segment restriction.
                  </p>
                </div>
              ) : (
                <SegmentTargetingBuilder
                  expr={campaign.segmentExpr}
                  editable={editable}
                  onChange={(segmentExpr) =>
                    patch({
                      segmentExpr,
                      segment: segmentSummary(segmentExpr),
                    })
                  }
                />
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>
                  Start{" "}
                  {editable ? (
                    <span className="font-normal text-muted-foreground">(required)</span>
                  ) : null}
                </Label>
                {editable ? (
                  <Input
                    type="date"
                    value={campaign.start}
                    onChange={(e) => patch({ start: e.target.value })}
                    className="rounded-md"
                  />
                ) : (
                  <p className="text-sm">{campaign.start || "—"}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  End{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                {editable ? (
                  <Input
                    type="date"
                    value={campaign.end}
                    onChange={(e) => patch({ end: e.target.value })}
                    className="rounded-md"
                  />
                ) : (
                  <p className="text-sm">{campaign.end || "open"}</p>
                )}
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Tagging & application rules" tag="FR-001 · ST-002 · DL-020">
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Tagging lives on the campaign (an overlay on the jackpot&apos;s base accrual). A
            transaction may carry several campaign identifiers and contribute to several jackpots
            (many-to-many). Tags are supplied on the transaction — the engine matches, it never
            authors them.
          </p>

          <div className="mb-5 flex flex-wrap gap-8">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Unique Campaign Identifier</p>
              <p className="font-mono text-sm">{campaign.id}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Target funding type</p>
              <p className="text-sm">{fundingLabel(campaign.jackpotId)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Campaign tags</Label>
            {campaign.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {campaign.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-md bg-surface-300 px-2.5 py-1 font-mono text-xs"
                  >
                    {tag}
                    {editable ? (
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          patch({ tags: campaign.tags.filter((item) => item !== tag) })
                        }
                      >
                        ×
                      </button>
                    ) : null}
                  </span>
                ))}
              </div>
            ) : null}
            {editable ? (
              <div className="flex max-w-md gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="Add a campaign tag, e.g. weekend-boost"
                  className="rounded-md font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-md border-border/80"
                  onClick={addTag}
                >
                  Add tag
                </Button>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Label>Applicability</Label>
            <div className="flex max-w-md">
              <ToggleButton
                active={campaign.applicability === "multiple"}
                onClick={() => editable && patch({ applicability: "multiple" })}
                className="flex-1 rounded-r-none"
              >
                Multiple selection
              </ToggleButton>
              <ToggleButton
                active={campaign.applicability === "unique"}
                onClick={() => editable && patch({ applicability: "unique" })}
                className="flex-1 rounded-l-none"
              >
                Unique / exclusive
              </ToggleButton>
            </div>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
              {fundingIsExtra(campaign.jackpotId)
                ? "Extra-on-top jackpots can stack in a multiple-campaign selection."
                : campaign.jackpotId
                  ? "Part-of-transaction jackpots are single-selection (one per transaction) — locked to unique. Extra-on-top campaigns may still apply alongside."
                  : "Select a target jackpot to see the funding-type constraints."}
            </p>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <Switch
              checked={campaign.autoApply}
              disabled={!editable || fundingIsExtra(campaign.jackpotId)}
              onCheckedChange={(checked) => patch({ autoApply: checked })}
            />
            <div>
              <p className="text-sm font-semibold">Auto-apply to game</p>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
                {fundingIsExtra(campaign.jackpotId)
                  ? "Only part-of-transaction jackpots may be auto-applied to a game."
                  : "Auto-applied to the game rather than player-selected. Only one part-of-transaction jackpot may auto-applied per game."}
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
