export type JackpotStatus =
  | "Draft"
  | "Validated"
  | "Active"
  | "Suspended"
  | "Superseded"
  | "Retired"

export type CampaignStatus = "Running" | "Scheduled" | "Paused" | "Completed"

export type Jackpot = {
  id: string
  name: string
  brandsLabel: string
  tiersLabel: string
  version: string
  status: JackpotStatus
  updated: string
  isPersonal?: boolean
}

export type Template = {
  id: string
  name: string
  desc: string
  tiers: number
  trigger: string
  version: number
  author: string
}

export type Campaign = {
  id: string
  name: string
  jackpot: string
  segment: string
  windowLabel: string
  status: CampaignStatus
}

export type AccessRole = {
  role: string
  configure: boolean
  validate: boolean
  activate: boolean
  campaigns: boolean
  reports: boolean
  manageRoles: boolean
  current: boolean
}

export type AuditEntry = {
  time: string
  actor: string
  action: string
  target: string
  tag: string
}

export const brandName = "LuckyStar Casino"
export const environment = "GLI · Production"

export type Brand = {
  id: string
  name: string
  initials: string
  color: string
}

export const brands: Brand[] = [
  {
    id: "royal-vegas",
    name: "Royal Vegas",
    initials: "RV",
    color: "hsl(38 92% 50%)",
  },
  {
    id: "spin-palace",
    name: "Spin Palace",
    initials: "SP",
    color: "hsl(270 60% 55%)",
  },
  {
    id: "jackpot-city",
    name: "Jackpot City",
    initials: "JC",
    color: "hsl(210 80% 55%)",
  },
  {
    id: "ruby-fortune",
    name: "Ruby Fortune",
    initials: "RF",
    color: "hsl(350 70% 55%)",
  },
  {
    id: "gala-casino",
    name: "Gala Casino",
    initials: "GC",
    color: "hsl(153 60% 45%)",
  },
]

export const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: "layout-dashboard" as const },
  { title: "Jackpots", url: "/jackpots", icon: "coins" as const },
  { title: "Templates", url: "/templates", icon: "layout-template" as const },
  { title: "Campaigns", url: "/campaigns", icon: "megaphone" as const },
  { title: "Access Control", url: "/access", icon: "shield" as const },
  { title: "Audit Log", url: "/audit", icon: "history" as const },
]

export const kpis = [
  {
    label: "Active pools",
    value: "2",
    sub: "live & contributing",
    tag: "FR-001",
    trend: "+1",
    up: true,
  },
  {
    label: "Pending validation",
    value: "2",
    sub: "drafts + validated",
    tag: "ST-001",
    trend: "2 open",
    up: false,
  },
  {
    label: "Triggers today",
    value: "37",
    sub: "across all pools",
    tag: "FR-003",
    trend: "+12",
    up: true,
  },
  {
    label: "Total pooled",
    value: "€2.41M",
    sub: "tenant base currency (EUR) · DL-038",
    tag: "FR-012",
    trend: "+3.2%",
    up: true,
  },
]

export const attentionItems = [
  {
    id: "JP-1061",
    name: "Lucky Streak Mystery",
    status: "Draft" as const,
    note: "Incomplete — needs configuration",
  },
  {
    id: "JP-1057",
    name: "Midnight Must-Drop",
    status: "Validated" as const,
    note: "Validated — ready to activate",
  },
  {
    id: "JP-1009",
    name: "Golden Hour Daily Drop",
    status: "Suspended" as const,
    note: "Suspended — needs review",
  },
]

export const lifecycleStats = [
  { label: "Draft", count: 1 },
  { label: "Validated", count: 1 },
  { label: "Active", count: 2 },
  { label: "Suspended", count: 1 },
  { label: "Superseded", count: 1 },
  { label: "Retired", count: 1 },
]

export const recentActivity = [
  {
    id: "ST-001",
    time: "2026-06-21 14:02",
    actor: "Maria Alvarez",
    action: "Activated",
    target: "JP-1042 v4",
  },
  {
    id: "FR-005",
    time: "2026-06-21 11:47",
    actor: "Maria Alvarez",
    action: "Validated",
    target: "JP-1057 v1",
  },
  {
    id: "UF-001",
    time: "2026-06-21 09:15",
    actor: "P. Lindqvist",
    action: "Created draft",
    target: "JP-1061 v0",
  },
  {
    id: "FR-014",
    time: "2026-06-20 16:30",
    actor: "D. Okoro",
    action: "Changed brand scope",
    target: "JP-1042",
  },
  {
    id: "FR-009",
    time: "2026-05-22 13:20",
    actor: "Maria Alvarez",
    action: "Launched campaign",
    target: "CMP-301",
  },
]

export const jackpots: Jackpot[] = [
  {
    id: "JP-1042",
    name: "Aztec Riches Progressive",
    brandsLabel: "Royal Vegas +1",
    tiersLabel: "3 tiers",
    version: "v4",
    status: "Active",
    updated: "2026-06-18",
  },
  {
    id: "JP-1057",
    name: "Midnight Must-Drop",
    brandsLabel: "Spin Palace",
    tiersLabel: "1 tier",
    version: "v1",
    status: "Validated",
    updated: "2026-06-20",
  },
  {
    id: "JP-1061",
    name: "Lucky Streak Mystery",
    brandsLabel: "Royal Vegas",
    tiersLabel: "1 tier",
    version: "v0",
    status: "Draft",
    updated: "2026-06-21",
  },
  {
    id: "JP-1066",
    name: "My Lucky Pot Personal",
    brandsLabel: "Royal Vegas",
    tiersLabel: "Per player",
    version: "v2",
    status: "Active",
    updated: "2026-06-15",
    isPersonal: true,
  },
  {
    id: "JP-1009",
    name: "Golden Hour Daily Drop",
    brandsLabel: "Spin Palace",
    tiersLabel: "1 tier",
    version: "v7",
    status: "Suspended",
    updated: "2026-05-30",
  },
  {
    id: "JP-1003",
    name: "Diamond Tier Classic",
    brandsLabel: "Royal Vegas",
    tiersLabel: "3 tiers",
    version: "v2",
    status: "Superseded",
    updated: "2026-04-12",
  },
  {
    id: "JP-0988",
    name: "Festive Frenzy 2025",
    brandsLabel: "All brands",
    tiersLabel: "2 tiers",
    version: "v3",
    status: "Retired",
    updated: "2026-01-05",
  },
]

export const templates: Template[] = [
  {
    id: "TPL-01",
    name: "Three-Tier Progressive",
    desc: "Grand / Major / Minor with mixed mystery + must-drop triggers.",
    tiers: 3,
    trigger: "Mystery + Must-drop",
    version: 3,
    author: "M. Alvarez",
  },
  {
    id: "TPL-02",
    name: "Daily Must-Drop-by-Time",
    desc: "Single tier guaranteed to drop by a configured deadline.",
    tiers: 1,
    trigger: "Must-drop (time)",
    version: 2,
    author: "M. Alvarez",
  },
  {
    id: "TPL-03",
    name: "Single Mystery Jackpot",
    desc: "One random/mystery tier within a min/max value window.",
    tiers: 1,
    trigger: "Mystery",
    version: 1,
    author: "P. Lindqvist",
  },
  {
    id: "TPL-04",
    name: "Personal Progressive",
    desc: "Player-funded pool, isolated per player, no cross-contamination.",
    tiers: 1,
    trigger: "Mystery",
    version: 2,
    author: "M. Alvarez",
  },
]

export const campaigns: Campaign[] = [
  {
    id: "CMP-301",
    name: "Weekend Warriors Boost",
    jackpot: "Aztec Riches Progressive",
    segment: "(IN SEG-HVP-22 AND NOT IN SEG-BONUSABUSE-3)",
    windowLabel: "2026-06-20 → 2026-06-23",
    status: "Running",
  },
  {
    id: "CMP-302",
    name: "Lapsed Reactivation",
    jackpot: "Midnight Must-Drop",
    segment: "IN SEG-LAPSE-90D",
    windowLabel: "2026-06-28 → 2026-07-05",
    status: "Scheduled",
  },
  {
    id: "CMP-289",
    name: "New Player Welcome",
    jackpot: "Golden Hour Daily Drop",
    segment: "IN SEG-NEW-7",
    windowLabel: "2026-06-01 → open",
    status: "Paused",
  },
  {
    id: "CMP-270",
    name: "Festive Frenzy 2025",
    jackpot: "Festive Frenzy 2025",
    segment: "IN SEG-FESTIVE-25",
    windowLabel: "2025-12-01 → 2026-01-05",
    status: "Completed",
  },
]

export const accessRoles: AccessRole[] = [
  {
    role: "Casino Ops Manager",
    configure: true,
    validate: true,
    activate: true,
    campaigns: true,
    reports: true,
    manageRoles: false,
    current: true,
  },
  {
    role: "Config Editor",
    configure: true,
    validate: true,
    activate: false,
    campaigns: true,
    reports: true,
    manageRoles: false,
    current: false,
  },
  {
    role: "Approver",
    configure: false,
    validate: true,
    activate: true,
    campaigns: false,
    reports: true,
    manageRoles: false,
    current: false,
  },
  {
    role: "Finance Auditor",
    configure: false,
    validate: false,
    activate: false,
    campaigns: false,
    reports: true,
    manageRoles: false,
    current: false,
  },
  {
    role: "Security Admin",
    configure: false,
    validate: false,
    activate: false,
    campaigns: false,
    reports: true,
    manageRoles: true,
    current: false,
  },
  {
    role: "Viewer",
    configure: false,
    validate: false,
    activate: false,
    campaigns: false,
    reports: true,
    manageRoles: false,
    current: false,
  },
]

export const auditLog: AuditEntry[] = [
  {
    time: "2026-06-21 14:02",
    actor: "M. Alvarez",
    action: "Activated",
    target: "JP-1042 v4",
    tag: "ST-001",
  },
  {
    time: "2026-06-21 11:47",
    actor: "M. Alvarez",
    action: "Validated",
    target: "JP-1057 v1",
    tag: "FR-005",
  },
  {
    time: "2026-06-21 09:15",
    actor: "P. Lindqvist",
    action: "Created draft",
    target: "JP-1061 v0",
    tag: "UF-001",
  },
  {
    time: "2026-06-20 16:30",
    actor: "D. Okoro",
    action: "Changed brand scope",
    target: "JP-1042",
    tag: "FR-014",
  },
  {
    time: "2026-05-30 10:05",
    actor: "D. Okoro",
    action: "Suspended",
    target: "JP-1009 v7",
    tag: "ST-001",
  },
  {
    time: "2026-05-22 13:20",
    actor: "M. Alvarez",
    action: "Launched campaign",
    target: "CMP-301",
    tag: "FR-009",
  },
]

export const contributionTrend = [
  { date: "Mon", amount: 142 },
  { date: "Tue", amount: 158 },
  { date: "Wed", amount: 131 },
  { date: "Thu", amount: 176 },
  { date: "Fri", amount: 198 },
  { date: "Sat", amount: 224 },
  { date: "Sun", amount: 184 },
]

export function statusLabel(status: JackpotStatus) {
  return status
}

export function campaignStatusLabel(status: CampaignStatus) {
  return status
}

export const wizardSteps = [
  "Pool",
  "Prize Tiers",
  "Triggers",
  "Eligibility",
  "Review",
]
