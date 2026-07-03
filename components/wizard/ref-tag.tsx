import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function RefTag({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md border-border/80 bg-surface-200/50 font-mono text-[10px] font-normal text-muted-foreground",
        className
      )}
    >
      {children}
    </Badge>
  )
}
