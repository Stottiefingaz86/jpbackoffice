import { jackpots } from "@/lib/backoffice-data"

export type CampaignLifecycleStatus =
  | "Draft"
  | "Scheduled"
  | "Running"
  | "Paused"
  | "Completed"
  | "Cancelled"

export type SegmentCondition = {
  op: "IN" | "NOT IN"
  seg: string
}

export type SegmentGroup = {
  join: "AND" | "OR"
  conds: SegmentCondition[]
}

export type SegmentExpr = {
  join: "AND" | "OR"
  groups: SegmentGroup[]
}

export type CampaignApplicability = "multiple" | "unique"

export type CampaignHistoryEntry = {
  status: CampaignLifecycleStatus
  actor: string
  date: string
  note: string
}

export type CampaignDetail = {
  id: string
  name: string
  jackpotId: string
  jackpot: string
  audience: "segment" | "all"
  segment: string
  segmentExpr: SegmentExpr
  start: string
  end: string
  status: CampaignLifecycleStatus
  tags: string[]
  applicability: CampaignApplicability
  autoApply: boolean
  history: CampaignHistoryEntry[]
}

export const segmentOptions = [
  "SEG-HVP-22",
  "SEG-BONUSABUSE-3",
  "SEG-LAPSE-90D",
  "SEG-NEW-7",
  "SEG-FESTIVE-25",
  "SEG-CTRY-DE",
  "SEG-CTRY-FR",
  "SEG-CTRY-UK",
  "SEG-CTRY-CA",
  "SEG-VIP-TIER1",
  "SEG-WEEKEND-ACTIVE",
  "SEG-SPORTS-CROSS",
]

export const lifecycleSteps: CampaignLifecycleStatus[] = [
  "Draft",
  "Scheduled",
  "Running",
  "Completed",
]

export function emptySegmentExpr(): SegmentExpr {
  return {
    join: "AND",
    groups: [{ join: "AND", conds: [{ op: "IN", seg: "" }] }],
  }
}

export function exprHasSegment(expr: SegmentExpr) {
  return expr.groups.some((group) => group.conds.some((cond) => cond.seg))
}

export function segmentSummary(expr: SegmentExpr) {
  const parts = expr.groups
    .map((group) => {
      const conditions = group.conds
        .filter((cond) => cond.seg)
        .map((cond) => `${cond.op} ${cond.seg}`)
      if (!conditions.length) return ""
      const inner = conditions.join(` ${group.join} `)
      return expr.groups.length > 1 ? `(${inner})` : inner
    })
    .filter(Boolean)

  return parts.length ? parts.join(` ${expr.join} `) : ""
}

export function campaignReadiness(campaign: CampaignDetail) {
  const missing: string[] = []
  if (!campaign.name.trim()) missing.push("Campaign name")
  if (!campaign.jackpotId) missing.push("Target jackpot")
  if (campaign.audience === "segment" && !exprHasSegment(campaign.segmentExpr)) {
    missing.push("Supplied segment targeting")
  }
  if (!campaign.start.trim()) missing.push("Start date")
  return { ok: missing.length === 0, missing }
}

export function jackpotOptions() {
  return jackpots.map((jackpot) => ({
    value: jackpot.id,
    label: `${jackpot.name} (${jackpot.id})`,
  }))
}

export function fundingLabel(jackpotId: string) {
  if (!jackpotId) return "Select a target jackpot first"
  if (jackpotId === "JP-1061") return "Extra on top"
  return "Part of transaction"
}

export function fundingIsExtra(jackpotId: string) {
  return fundingLabel(jackpotId) === "Extra on top"
}

const campaignDetails: CampaignDetail[] = [
  {
    id: "CMP-301",
    name: "Weekend Warriors Boost",
    jackpotId: "JP-1042",
    jackpot: "Aztec Riches Progressive",
    audience: "segment",
    segment: "(IN SEG-HVP-22 AND NOT IN SEG-BONUSABUSE-3)",
    segmentExpr: {
      join: "AND",
      groups: [
        {
          join: "AND",
          conds: [
            { op: "IN", seg: "SEG-HVP-22" },
            { op: "NOT IN", seg: "SEG-BONUSABUSE-3" },
          ],
        },
      ],
    },
    start: "2026-06-20",
    end: "2026-06-23",
    status: "Running",
    tags: ["weekend-boost", "hvp-target"],
    applicability: "multiple",
    autoApply: false,
    history: [
      {
        status: "Running",
        actor: "M. Alvarez",
        date: "2026-06-20 08:00",
        note: "Launched",
      },
      {
        status: "Scheduled",
        actor: "M. Alvarez",
        date: "2026-06-18 14:30",
        note: "Scheduled for the weekend window",
      },
      {
        status: "Draft",
        actor: "M. Alvarez",
        date: "2026-06-18 14:02",
        note: "Campaign created",
      },
    ],
  },
  {
    id: "CMP-302",
    name: "Lapsed Reactivation",
    jackpotId: "JP-1057",
    jackpot: "Midnight Must-Drop",
    audience: "segment",
    segment: "IN SEG-LAPSE-90D",
    segmentExpr: {
      join: "AND",
      groups: [{ join: "AND", conds: [{ op: "IN", seg: "SEG-LAPSE-90D" }] }],
    },
    start: "2026-06-28",
    end: "2026-07-05",
    status: "Scheduled",
    tags: ["lapsed-reactivation"],
    applicability: "unique",
    autoApply: false,
    history: [
      {
        status: "Scheduled",
        actor: "M. Alvarez",
        date: "2026-06-21 10:10",
        note: "Scheduled for the supplied lapsed-player segment",
      },
      {
        status: "Draft",
        actor: "M. Alvarez",
        date: "2026-06-21 09:50",
        note: "Campaign created",
      },
    ],
  },
  {
    id: "CMP-289",
    name: "New Player Welcome",
    jackpotId: "JP-1009",
    jackpot: "Golden Hour Daily Drop",
    audience: "segment",
    segment: "IN SEG-NEW-7",
    segmentExpr: {
      join: "AND",
      groups: [{ join: "AND", conds: [{ op: "IN", seg: "SEG-NEW-7" }] }],
    },
    start: "2026-06-01",
    end: "",
    status: "Paused",
    tags: ["new-player"],
    applicability: "unique",
    autoApply: false,
    history: [
      {
        status: "Paused",
        actor: "D. Okoro",
        date: "2026-06-15 12:00",
        note: "Paused pending jurisdiction review",
      },
      {
        status: "Running",
        actor: "M. Alvarez",
        date: "2026-06-01 08:00",
        note: "Launched",
      },
      {
        status: "Draft",
        actor: "M. Alvarez",
        date: "2026-05-30 16:00",
        note: "Campaign created",
      },
    ],
  },
  {
    id: "CMP-270",
    name: "Festive Frenzy 2025",
    jackpotId: "JP-0988",
    jackpot: "Festive Frenzy 2025",
    audience: "segment",
    segment: "IN SEG-FESTIVE-25",
    segmentExpr: {
      join: "AND",
      groups: [{ join: "AND", conds: [{ op: "IN", seg: "SEG-FESTIVE-25" }] }],
    },
    start: "2025-12-01",
    end: "2026-01-05",
    status: "Completed",
    tags: ["festive-2025"],
    applicability: "multiple",
    autoApply: false,
    history: [
      {
        status: "Completed",
        actor: "D. Okoro",
        date: "2026-01-05 23:59",
        note: "Reached end of campaign window",
      },
      {
        status: "Running",
        actor: "M. Alvarez",
        date: "2025-12-01 00:00",
        note: "Launched",
      },
      {
        status: "Scheduled",
        actor: "M. Alvarez",
        date: "2025-11-22 09:30",
        note: "Scheduled for the festive window",
      },
      {
        status: "Draft",
        actor: "M. Alvarez",
        date: "2025-11-20 11:00",
        note: "Campaign created",
      },
    ],
  },
]

export function getCampaignDetail(id: string) {
  return campaignDetails.find((campaign) => campaign.id === id)
}

export function createBlankCampaign(id = "CMP-303"): CampaignDetail {
  return {
    id,
    name: "",
    jackpotId: "",
    jackpot: "",
    audience: "segment",
    segment: "",
    segmentExpr: emptySegmentExpr(),
    start: "",
    end: "",
    status: "Draft",
    tags: [],
    applicability: "multiple",
    autoApply: false,
    history: [
      {
        status: "Draft",
        actor: "M. Alvarez",
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        note: "Campaign created",
      },
    ],
  }
}

export function getCampaignSummaries() {
  return campaignDetails.map(
    ({ id, name, jackpot, segment, start, end, status }) => ({
      id,
      name,
      jackpot,
      segment: segment || segmentSummary(emptySegmentExpr()),
      windowLabel: end ? `${start} → ${end}` : `${start} → open`,
      status:
        status === "Draft"
          ? ("Scheduled" as const)
          : status === "Cancelled"
            ? ("Completed" as const)
            : (status as "Running" | "Scheduled" | "Paused" | "Completed"),
    })
  )
}
