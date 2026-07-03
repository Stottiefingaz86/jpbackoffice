"use client"

import { PlusIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  segmentOptions,
  segmentSummary,
  type SegmentExpr,
  type SegmentGroup,
} from "@/lib/campaign-data"
import { cn } from "@/lib/utils"

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
        "rounded-md border px-3 py-1.5 text-xs transition-colors",
        active
          ? "border-brand/40 bg-brand/10 text-foreground"
          : "border-border/80 bg-surface-100 text-muted-foreground hover:bg-surface-200"
      )}
    >
      {children}
    </button>
  )
}

export function SegmentTargetingBuilder({
  expr,
  editable,
  onChange,
}: {
  expr: SegmentExpr
  editable: boolean
  onChange: (expr: SegmentExpr) => void
}) {
  const preview = segmentSummary(expr)
  const multiGroup = expr.groups.length > 1

  function updateExpr(next: SegmentExpr) {
    onChange(next)
  }

  function updateGroup(index: number, patch: Partial<SegmentGroup>) {
    updateExpr({
      ...expr,
      groups: expr.groups.map((group, i) =>
        i === index ? { ...group, ...patch } : group
      ),
    })
  }

  function updateCondition(
    groupIndex: number,
    condIndex: number,
    patch: Partial<SegmentGroup["conds"][number]>
  ) {
    updateExpr({
      ...expr,
      groups: expr.groups.map((group, gi) =>
        gi === groupIndex
          ? {
              ...group,
              conds: group.conds.map((cond, ci) =>
                ci === condIndex ? { ...cond, ...patch } : cond
              ),
            }
          : group
      ),
    })
  }

  function addGroup() {
    updateExpr({
      ...expr,
      groups: [...expr.groups, { join: "AND", conds: [{ op: "IN", seg: "" }] }],
    })
  }

  function removeGroup(index: number) {
    if (expr.groups.length <= 1) return
    updateExpr({
      ...expr,
      groups: expr.groups.filter((_, i) => i !== index),
    })
  }

  function addCondition(groupIndex: number) {
    updateExpr({
      ...expr,
      groups: expr.groups.map((group, gi) =>
        gi === groupIndex
          ? {
              ...group,
              conds: [...group.conds, { op: "IN", seg: "" }],
            }
          : group
      ),
    })
  }

  function removeCondition(groupIndex: number, condIndex: number) {
    const group = expr.groups[groupIndex]
    if (!group || group.conds.length <= 1) return
    updateExpr({
      ...expr,
      groups: expr.groups.map((g, gi) =>
        gi === groupIndex
          ? { ...g, conds: g.conds.filter((_, ci) => ci !== condIndex) }
          : g
      ),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border/80 bg-surface-200/50 p-4">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
          Resulting expression
        </p>
        <p className="font-mono text-sm leading-relaxed">
          {preview || "—"}
        </p>
        {multiGroup ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Groups are evaluated first, then combined by the top-level connector.
          </p>
        ) : null}
      </div>

      {multiGroup ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Combine groups with</span>
          <ToggleButton
            active={expr.join === "AND"}
            onClick={() => editable && updateExpr({ ...expr, join: "AND" })}
          >
            AND
          </ToggleButton>
          <ToggleButton
            active={expr.join === "OR"}
            onClick={() => editable && updateExpr({ ...expr, join: "OR" })}
          >
            OR
          </ToggleButton>
        </div>
      ) : null}

      {expr.groups.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="flex flex-col gap-3">
          {groupIndex > 0 ? (
            <p className="text-center text-xs font-medium text-muted-foreground">
              {expr.join}
            </p>
          ) : null}
          <div className="rounded-lg border border-border/80 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Group {groupIndex + 1}</p>
              {editable && expr.groups.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeGroup(groupIndex)}
                >
                  Remove group
                </Button>
              ) : null}
            </div>

            {group.conds.map((cond, condIndex) => (
              <div
                key={`cond-${groupIndex}-${condIndex}`}
                className="mb-3 flex flex-wrap items-center gap-2 last:mb-0"
              >
                <div className="flex gap-1">
                  <ToggleButton
                    active={cond.op === "IN"}
                    onClick={() =>
                      editable && updateCondition(groupIndex, condIndex, { op: "IN" })
                    }
                  >
                    IN
                  </ToggleButton>
                  <ToggleButton
                    active={cond.op === "NOT IN"}
                    onClick={() =>
                      editable &&
                      updateCondition(groupIndex, condIndex, { op: "NOT IN" })
                    }
                  >
                    NOT IN
                  </ToggleButton>
                </div>
                {editable ? (
                  <Select
                    value={cond.seg || undefined}
                    onValueChange={(value) =>
                      value &&
                      updateCondition(groupIndex, condIndex, { seg: value })
                    }
                  >
                    <SelectTrigger className="min-w-[220px] rounded-md">
                      <SelectValue placeholder="Search supplied segments…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {segmentOptions.map((segment) => (
                          <SelectItem key={segment} value={segment}>
                            {segment}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="font-mono text-sm">{cond.seg || "—"}</span>
                )}
                {editable && group.conds.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeCondition(groupIndex, condIndex)}
                  >
                    <XIcon className="size-4" />
                  </Button>
                ) : null}
              </div>
            ))}

            {editable ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 rounded-md"
                onClick={() => addCondition(groupIndex)}
              >
                <PlusIcon data-icon="inline-start" />
                Add condition
              </Button>
            ) : null}
          </div>
        </div>
      ))}

      {editable ? (
        <Button
          type="button"
          variant="outline"
          className="w-fit rounded-md border-dashed border-border/80"
          onClick={addGroup}
        >
          <PlusIcon data-icon="inline-start" />
          Add group
        </Button>
      ) : null}
    </div>
  )
}
