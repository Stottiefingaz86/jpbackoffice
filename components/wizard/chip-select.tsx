"use client"

import { cn } from "@/lib/utils"

export function ChipSelect({
  options,
  selected,
  onChange,
  single = false,
}: {
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  single?: boolean
}) {
  function toggle(option: string) {
    if (single) {
      onChange([option])
      return
    }
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option]
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-brand/40 bg-brand/15 text-foreground"
                : "border-border/80 bg-surface-100 text-muted-foreground hover:bg-surface-200 hover:text-foreground"
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
