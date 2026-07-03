import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { auditLog } from "@/lib/backoffice-data"

export function AuditLogTable() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageHeader
        title="Audit log"
        tag="FR-010 · ST-001"
        description="Every back-office configuration and lifecycle action is recorded with actor attribution."
      />

      <div className="px-4 lg:px-6">
        <div className="supabase-panel overflow-hidden rounded-xl">
          <div className="grid grid-cols-[150px_150px_1fr_1fr_80px] gap-3 border-b border-border/80 bg-surface-200 px-4 py-3 text-xs font-semibold">
            <div>Time</div>
            <div>Actor</div>
            <div>Action</div>
            <div>Target</div>
            <div>Trace</div>
          </div>
          {auditLog.map((entry) => (
            <div
              key={`${entry.time}-${entry.target}`}
              className="grid grid-cols-[150px_150px_1fr_1fr_80px] gap-3 border-b border-border/60 px-4 py-3 text-sm last:border-b-0 hover:bg-surface-200/40"
            >
              <div className="font-mono text-xs text-muted-foreground">
                {entry.time}
              </div>
              <div className="font-medium text-muted-foreground">
                {entry.actor}
              </div>
              <div>{entry.action}</div>
              <div className="font-mono text-xs text-muted-foreground">
                {entry.target}
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="rounded-md border-border/80 bg-surface-200/50 font-mono text-[10px] font-normal text-muted-foreground"
                >
                  {entry.tag}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
