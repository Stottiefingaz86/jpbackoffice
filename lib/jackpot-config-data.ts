import {
  createBlankDraft,
  createTier,
  type PrizeTier,
  type WizardDraft,
} from "@/lib/wizard-data"
import { jackpots, type Jackpot } from "@/lib/backoffice-data"

export type JackpotConfigRecord = {
  id: string
  name: string
  status: string
  version: number
  updated: string
  draft: WizardDraft
}

function tierFromLegacy(tier: {
  id: string
  name: string
  split: string
  growth: string
  triggerType: string
  mysteryMin?: string
  mysteryMax?: string
  valueThreshold?: string
  mdEvery?: string
  mdUnit?: string
  dependsOn?: string
}): PrizeTier {
  return {
    id: tier.id,
    name: tier.name,
    split: tier.split,
    splitSource: "pool",
    growth: tier.growth === "fixed" ? "fixed" : "progressive",
    dependsOn: tier.dependsOn || "",
    depDirection: "parent_gates_child",
    depCondition: "won",
    depN: "",
    depValue: "",
    depOffsetN: "",
    depOffsetUnit: "hours",
    depReset: false,
    triggerType:
      tier.triggerType === "mustdrop_time"
        ? "mustdrop_time"
        : tier.triggerType === "mustdrop_value"
          ? "mustdrop_value"
          : "mystery",
    mysteryMin: tier.mysteryMin || "",
    mysteryMax: tier.mysteryMax || "",
    valueThreshold: tier.valueThreshold || "",
    mdEvery: tier.mdEvery || "",
    mdUnit: tier.mdUnit || "hours",
  }
}

const jackpotConfigs: JackpotConfigRecord[] = [
  {
    id: "JP-1042",
    name: "Aztec Riches Progressive",
    status: "Active",
    version: 4,
    updated: "2026-06-18",
    draft: {
      name: "Aztec Riches Progressive",
      poolType: "shared",
      baseCurrency: "EUR",
      brands: ["Royal Vegas", "Spin Palace"],
      games: ["Aztec Gold", "Temple Quest", "Sun Stone"],
      providers: ["NetEnt", "Pragmatic Play"],
      contributionBasis: "percentage",
      contributionValue: "1.5",
      contributionFunding: "in",
      seed: "10000",
      personalTokenKey: "player_token",
      guaranteeModel: "time",
      guaranteeValue: "",
      guaranteeEvery: "",
      guaranteeUnit: "days",
      rngCertRef: "GLI-RNG-2026-04812",
      tiers: [
        tierFromLegacy({
          id: "Ta1",
          name: "Grand",
          split: "60",
          growth: "progressive",
          triggerType: "mystery",
          mysteryMin: "250000",
          mysteryMax: "1000000",
        }),
        tierFromLegacy({
          id: "Ta2",
          name: "Major",
          split: "30",
          growth: "progressive",
          triggerType: "mustdrop_value",
          valueThreshold: "25000",
        }),
        tierFromLegacy({
          id: "Ta3",
          name: "Minor",
          split: "10",
          growth: "progressive",
          triggerType: "mustdrop_time",
          mdEvery: "24",
          mdUnit: "hours",
        }),
      ],
      minStake: "0.20",
      maxStakeOn: false,
      maxStake: "",
      maxStakeMode: "absolute",
      jurisdiction: true,
      kyc: true,
      rg: true,
      segment: false,
      staleAction: "block",
    },
  },
]

export function getJackpotConfig(id: string): JackpotConfigRecord | undefined {
  const detailed = jackpotConfigs.find((jackpot) => jackpot.id === id)
  if (detailed) return detailed

  const summary = jackpots.find((jackpot) => jackpot.id === id)
  if (!summary) return undefined

  return buildJackpotConfigFromSummary(summary)
}

function buildJackpotConfigFromSummary(summary: Jackpot): JackpotConfigRecord {
  const draft = createBlankDraft()
  draft.name = summary.name
  draft.poolType = summary.isPersonal ? "personal" : "shared"

  if (summary.isPersonal) {
    draft.tiers = [createTier("Personal", "100", "mystery")]
  } else if (summary.tiersLabel.includes("3")) {
    draft.tiers = [
      createTier("Grand", "60", "mystery"),
      createTier("Major", "30", "mustdrop_value"),
      createTier("Minor", "10", "mustdrop_time"),
    ]
  } else {
    draft.tiers = [createTier("Daily Drop", "100", "mustdrop_time")]
  }

  const versionNumber = Number.parseInt(summary.version.replace(/^v/, ""), 10)

  return {
    id: summary.id,
    name: summary.name,
    status: summary.status,
    version: Number.isFinite(versionNumber) ? versionNumber : 0,
    updated: summary.updated,
    draft,
  }
}

export function getJackpotDraft(id: string): WizardDraft | undefined {
  const record = getJackpotConfig(id)
  if (!record) return undefined
  return structuredClone(record.draft)
}
