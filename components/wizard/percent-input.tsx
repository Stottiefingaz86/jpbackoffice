"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function PercentInput({
  value,
  onChange,
  className,
  placeholder = "0",
}: {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}) {
  return (
    <div className={cn("relative max-w-[120px]", className)}>
      <Input
        type="number"
        min={0}
        max={100}
        step={0.1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-md pr-7 tabular-nums"
      />
      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
        %
      </span>
    </div>
  )
}
