import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function PageHeader({
  title,
  tag,
  description,
  action,
  className,
}: {
  title: string
  tag?: string
  description: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("px-4 lg:px-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-normal tracking-tight">{title}</h1>
            {tag ? (
              <Badge
                variant="outline"
                className="rounded-md border-border/80 bg-surface-200/50 font-mono text-xs font-normal text-muted-foreground"
              >
                {tag}
              </Badge>
            ) : null}
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  )
}
