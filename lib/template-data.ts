import type { TriggerType } from "@/lib/wizard-data"

export type TemplateTier = {
  name: string
  split: string
  triggerType: TriggerType
}

export type TemplateLocks = {
  poolType: boolean
  contribution: boolean
  tiers: boolean
  eligibility: boolean
  randomness: boolean
}

export type TemplateDetail = {
  id: string
  name: string
  desc: string
  version: number
  author: string
  updated: string
  tiers: number
  trigger: string
  locks: TemplateLocks
  config: {
    poolType: "shared" | "personal"
    contribution: {
      basis: "percentage" | "fixed"
      value: string
      funding: "in" | "extra"
    }
    tiers: TemplateTier[]
    eligibility: {
      jurisdiction: boolean
      kyc: boolean
      rg: boolean
      minStake: string
    }
  }
}

export const templateDetails: TemplateDetail[] = [
  {
    id: "TPL-01",
    name: "Three-Tier Progressive",
    desc: "Grand / Major / Minor with mixed mystery + must-drop triggers.",
    tiers: 3,
    trigger: "Mystery + Must-drop",
    version: 3,
    author: "M. Alvarez",
    updated: "2026-05-12",
    locks: {
      poolType: true,
      contribution: false,
      tiers: true,
      eligibility: false,
      randomness: true,
    },
    config: {
      poolType: "shared",
      contribution: { basis: "percentage", value: "1.5", funding: "in" },
      tiers: [
        { name: "Grand", split: "60", triggerType: "mystery" },
        { name: "Major", split: "30", triggerType: "mustdrop_value" },
        { name: "Minor", split: "10", triggerType: "mustdrop_time" },
      ],
      eligibility: {
        jurisdiction: true,
        kyc: true,
        rg: true,
        minStake: "0.20",
      },
    },
  },
  {
    id: "TPL-02",
    name: "Daily Must-Drop-by-Time",
    desc: "Single tier guaranteed to drop by a configured deadline.",
    tiers: 1,
    trigger: "Must-drop (time)",
    version: 2,
    author: "M. Alvarez",
    updated: "2026-04-30",
    locks: {
      poolType: true,
      contribution: false,
      tiers: true,
      eligibility: false,
      randomness: false,
    },
    config: {
      poolType: "shared",
      contribution: { basis: "percentage", value: "2.0", funding: "in" },
      tiers: [{ name: "Daily Drop", split: "100", triggerType: "mustdrop_time" }],
      eligibility: {
        jurisdiction: true,
        kyc: true,
        rg: false,
        minStake: "0.10",
      },
    },
  },
  {
    id: "TPL-03",
    name: "Single Mystery Jackpot",
    desc: "One random/mystery tier within a min/max value window.",
    tiers: 1,
    trigger: "Mystery",
    version: 1,
    author: "P. Lindqvist",
    updated: "2026-03-18",
    locks: {
      poolType: true,
      contribution: true,
      tiers: true,
      eligibility: false,
      randomness: true,
    },
    config: {
      poolType: "shared",
      contribution: { basis: "fixed", value: "0.05", funding: "extra" },
      tiers: [{ name: "Mystery Pot", split: "100", triggerType: "mystery" }],
      eligibility: {
        jurisdiction: true,
        kyc: false,
        rg: false,
        minStake: "",
      },
    },
  },
  {
    id: "TPL-04",
    name: "Personal Progressive",
    desc: "Player-funded pool, isolated per player, no cross-contamination.",
    tiers: 1,
    trigger: "Mystery",
    version: 2,
    author: "M. Alvarez",
    updated: "2026-05-01",
    locks: {
      poolType: true,
      contribution: false,
      tiers: true,
      eligibility: true,
      randomness: true,
    },
    config: {
      poolType: "personal",
      contribution: { basis: "percentage", value: "1.0", funding: "in" },
      tiers: [{ name: "Personal", split: "100", triggerType: "mystery" }],
      eligibility: {
        jurisdiction: true,
        kyc: true,
        rg: true,
        minStake: "0.10",
      },
    },
  },
]

export function getTemplateDetail(id: string) {
  return templateDetails.find((template) => template.id === id)
}

export function getTemplateSummaries() {
  return templateDetails.map(
    ({ id, name, desc, tiers, trigger, version, author }) => ({
      id,
      name,
      desc,
      tiers,
      trigger,
      version,
      author,
    })
  )
}
