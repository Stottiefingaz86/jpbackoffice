import { RefTag } from "@/components/wizard/ref-tag"
import { poolSplitTotal, type WizardDraft } from "@/lib/wizard-data"

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-surface-100 p-4">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}

export function ReviewStep({ draft }: { draft: WizardDraft }) {
  const poolTotal = poolSplitTotal(draft.tiers)
  const guaranteeSummary =
    draft.poolType === "personal"
      ? draft.guaranteeModel === "time"
        ? `Every ${draft.guaranteeEvery || "—"} ${draft.guaranteeUnit}`
        : `${draft.baseCurrency} ${draft.guaranteeValue || "—"}`
      : `${draft.tiers.length} tier(s) · ${poolTotal.toFixed(1)}% pool split`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Review & activate</h2>
        <RefTag>UF-001 · ST-001</RefTag>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Validation checks required fields, tier independence, and scope boundaries before
        a configuration version can be activated.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <SummaryCell
          label="Pool type"
          value={`${draft.poolType === "shared" ? "Shared" : "Personal"} progressive`}
        />
        <SummaryCell label="Guarantee" value={guaranteeSummary} />
        <SummaryCell label="Pool name" value={draft.name || "Untitled"} />
        <SummaryCell
          label="Contribution"
          value={
            draft.contributionValue
              ? `${draft.contributionValue}${draft.contributionBasis === "percentage" ? "%" : ` ${draft.baseCurrency}`} · ${draft.contributionFunding === "in" ? "in transaction" : "extra"}`
              : "Not set"
          }
        />
        <SummaryCell
          label="Seed"
          value={
            draft.seed
              ? `${draft.baseCurrency} ${draft.seed}`
              : "Not set"
          }
        />
        <SummaryCell
          label="Min stake"
          value={
            draft.minStake
              ? `${draft.baseCurrency} ${draft.minStake}`
              : "Not set"
          }
        />
      </div>

      {draft.poolType === "shared" ? (
        <div className="supabase-panel rounded-xl p-4">
          <p className="mb-3 font-medium">Prize tiers</p>
          <div className="flex flex-col gap-2">
            {draft.tiers.map((tier, index) => (
              <div
                key={tier.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-surface-200/40 px-3 py-2 text-sm"
              >
                <span className="font-medium">
                  {index + 1}. {tier.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {tier.split}% · {tier.growth} · {tier.triggerType.replace("_", " ")}
                  {tier.dependsOn ? ` · depends on ${tier.dependsOn}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
