export type TriggerType = "mystery" | "mustdrop_time" | "mustdrop_value"
export type GrowthType = "progressive" | "fixed"
export type PoolType = "shared" | "personal"

export type PrizeTier = {
  id: string
  name: string
  split: string
  splitSource: string
  growth: GrowthType
  dependsOn: string
  depDirection: string
  depCondition: string
  depN: string
  depValue: string
  depOffsetN: string
  depOffsetUnit: string
  depReset: boolean
  triggerType: TriggerType
  mysteryMin: string
  mysteryMax: string
  valueThreshold: string
  mdEvery: string
  mdUnit: string
}

export type WizardDraft = {
  name: string
  poolType: PoolType
  baseCurrency: string
  brands: string[]
  games: string[]
  providers: string[]
  contributionBasis: "percentage" | "fixed"
  contributionValue: string
  contributionFunding: "in" | "extra"
  seed: string
  personalTokenKey: string
  guaranteeModel: "time" | "value"
  guaranteeValue: string
  guaranteeEvery: string
  guaranteeUnit: string
  rngCertRef: string
  tiers: PrizeTier[]
  minStake: string
  maxStakeOn: boolean
  maxStake: string
  maxStakeMode: "absolute" | "relative"
  jurisdiction: boolean
  kyc: boolean
  rg: boolean
  segment: boolean
  staleAction: "block" | "allow"
  gateEnabled?: Record<string, boolean>
  gateAllow?: Record<string, string[]>
}

let tierCounter = 1

export function createTier(
  name: string,
  split: string,
  triggerType: TriggerType = "mystery"
): PrizeTier {
  tierCounter += 1
  return {
    id: `T${tierCounter}`,
    name,
    split,
    splitSource: "pool",
    growth: "progressive",
    dependsOn: "",
    depDirection: "parent_gates_child",
    depCondition: "won",
    depN: "",
    depValue: "",
    depOffsetN: "",
    depOffsetUnit: "hours",
    depReset: false,
    triggerType,
    mysteryMin: "",
    mysteryMax: "",
    valueThreshold: "",
    mdEvery: "",
    mdUnit: "hours",
  }
}

export function createBlankDraft(): WizardDraft {
  return {
    name: "",
    poolType: "shared",
    baseCurrency: "EUR",
    brands: [],
    games: [],
    providers: [],
    contributionBasis: "percentage",
    contributionValue: "",
    contributionFunding: "in",
    seed: "",
    personalTokenKey: "player_token",
    guaranteeModel: "time",
    guaranteeValue: "",
    guaranteeEvery: "",
    guaranteeUnit: "days",
    rngCertRef: "",
    tiers: [createTier("Grand", "100", "mystery")],
    minStake: "",
    maxStakeOn: false,
    maxStake: "",
    maxStakeMode: "absolute",
    jurisdiction: false,
    kyc: false,
    rg: false,
    segment: false,
    staleAction: "block",
    gateEnabled: {},
    gateAllow: {},
  }
}

export const triggerTypeOptions = [
  { value: "mystery" as const, label: "Mystery / random" },
  { value: "mustdrop_time" as const, label: "Must-drop by time" },
  { value: "mustdrop_value" as const, label: "Must-drop by value" },
]

export const growthOptions = [
  { value: "progressive" as const, label: "Progressive" },
  { value: "fixed" as const, label: "Fixed" },
]

export const depConditionOptions = [
  { value: "won", label: "Has been won" },
  { value: "won_n", label: "Has been won N times" },
  { value: "activated_n", label: "Has activated N times" },
  { value: "value_x", label: "Pool value reaches X" },
]

export const depDirectionOptions = (parent: string) => [
  { value: "parent_gates_child", label: `${parent} gates this tier` },
  { value: "children_gate_parent", label: `This tier gates ${parent}` },
]

export const offsetUnitOptions = [
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
  { value: "minutes", label: "Minutes" },
]

export const enforcePoints = [
  { label: "Contribution acceptance" },
  { label: "Trigger & win eligibility" },
]

export function poolSplitTotal(tiers: PrizeTier[]) {
  return tiers
    .filter((tier) => tier.splitSource === "pool")
    .reduce((sum, tier) => sum + (Number.parseFloat(tier.split) || 0), 0)
}

export function splitSourceOptions(tiers: PrizeTier[], currentId: string) {
  const others = tiers.filter((tier) => tier.id !== currentId)
  return [
    { value: "pool", label: "From pool (share of pooled contribution)" },
    ...others.map((tier) => ({
      value: tier.name,
      label: `From parent · ${tier.name}`,
    })),
  ]
}

export function dependsOnOptions(tiers: PrizeTier[], currentId: string) {
  const others = tiers.filter((tier) => tier.id !== currentId)
  return [
    { value: "", label: "Independent (no dependency)" },
    ...others.map((tier) => ({
      value: tier.name,
      label: `Linked to ${tier.name}`,
    })),
  ]
}

export function splitUnitLabel(splitSource: string) {
  return splitSource === "pool" ? "% of pool" : `% of ${splitSource}`
}
