import {
  type CampaignStatus,
  type JackpotStatus,
  campaignStatusLabel,
  statusLabel,
} from "@/lib/backoffice-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const jackpotVariants: Record<
  JackpotStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Draft: "secondary",
  Validated: "outline",
  Active: "default",
  Suspended: "destructive",
  Superseded: "secondary",
  Retired: "secondary",
}

const campaignVariants: Record<
  CampaignStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Running: "default",
  Scheduled: "outline",
  Paused: "destructive",
  Completed: "secondary",
}

export function StatusBadge({
  status,
  className,
}: {
  status: JackpotStatus
  className?: string
}) {
  return (
    <Badge variant={jackpotVariants[status]} className={cn("rounded-md", className)}>
      {statusLabel(status)}
    </Badge>
  )
}

export function CampaignStatusBadge({
  status,
  className,
}: {
  status: CampaignStatus
  className?: string
}) {
  return (
    <Badge
      variant={campaignVariants[status]}
      className={cn("rounded-md", className)}
    >
      {campaignStatusLabel(status)}
    </Badge>
  )
}
