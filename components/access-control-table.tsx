import { CheckIcon } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { accessRoles } from "@/lib/backoffice-data"
import { cn } from "@/lib/utils"

function PermissionMark({ allowed }: { allowed: boolean }) {
  return (
    <div className="flex justify-center">
      {allowed ? (
        <CheckIcon className="size-4 text-brand" />
      ) : (
        <span className="text-muted-foreground/40">—</span>
      )}
    </div>
  )
}

export function AccessControlTable() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageHeader
        title="Access control"
        tag="FR-010 · NFR-004"
        description="Role-based permissions for back-office actions. Your current role is highlighted."
      />

      <div className="px-4 lg:px-6">
        <div className="supabase-panel overflow-hidden rounded-xl">
          <div className="grid grid-cols-[1.4fr_repeat(6,1fr)] gap-2 border-b border-border/80 bg-surface-200 px-4 py-3 text-xs font-semibold">
            <div>Role</div>
            <div className="text-center">Configure</div>
            <div className="text-center">Validate</div>
            <div className="text-center">Activate</div>
            <div className="text-center">Campaigns</div>
            <div className="text-center">Reports</div>
            <div className="text-center">Manage roles</div>
          </div>
          {accessRoles.map((role) => (
            <div
              key={role.role}
              className={cn(
                "grid grid-cols-[1.4fr_repeat(6,1fr)] gap-2 border-b border-border/60 px-4 py-3 text-sm last:border-b-0",
                role.current && "bg-brand/10"
              )}
            >
              <div className="font-medium">
                {role.role}
                {role.current ? (
                  <span className="ml-2 text-xs font-normal text-brand">
                    (current)
                  </span>
                ) : null}
              </div>
              <PermissionMark allowed={role.configure} />
              <PermissionMark allowed={role.validate} />
              <PermissionMark allowed={role.activate} />
              <PermissionMark allowed={role.campaigns} />
              <PermissionMark allowed={role.reports} />
              <PermissionMark allowed={role.manageRoles} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
