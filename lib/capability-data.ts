export type CapabilityEntry = {
  id: string
  attr: string
  name: string
  values: string[]
  desc: string
  tag: string
  core?: boolean
}

export const capabilityCatalogue: CapabilityEntry[] = [
  {
    id: "jurisdiction",
    attr: "jurisdiction_code",
    name: "Jurisdiction / market",
    values: ["DE", "FR", "UK", "CA", "SE"],
    desc: "Player jurisdiction supplied and on the permitted allow-list.",
    tag: "FR-006",
    core: true,
  },
  {
    id: "kyc",
    attr: "kyc_status",
    name: "KYC verification",
    values: ["verified", "enhanced"],
    desc: "Identity-verification outcome supplied by the operator KYC system.",
    tag: "BR-007",
    core: true,
  },
  {
    id: "rg",
    attr: "rg_status",
    name: "Responsible-gaming status",
    values: ["ok"],
    desc: "RG / self-exclusion status enforced from supplied context.",
    tag: "BR-007",
    core: true,
  },
  {
    id: "segment",
    attr: "segment_id",
    name: "Target supplied segment(s)",
    values: ["SEG-HVP-22", "SEG-NEW-7", "SEG-LAPSE-90D"],
    desc: "Run against one or more supplied segments, combined with set conditions.",
    tag: "FR-006",
    core: true,
  },
  {
    id: "risk_tier",
    attr: "risk_tier",
    name: "Risk tier",
    values: ["low", "medium", "high"],
    desc: "Risk grading supplied by the fraud system.",
    tag: "FR-006",
  },
  {
    id: "channel",
    attr: "channel",
    name: "Channel",
    values: ["web", "app", "retail"],
    desc: "Originating channel supplied on the session.",
    tag: "FR-006",
  },
]
