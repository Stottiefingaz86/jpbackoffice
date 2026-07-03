import { Skeleton } from "@/components/ui/skeleton"

function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4 lg:px-6">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
  )
}

function TableRowsSkeleton({ rows = 8 }: { rows?: number }) {
  const widths = ["w-24", "w-32", "w-20", "w-28", "w-16", "w-36"]

  return (
    <div className="divide-y divide-border/50">
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex items-center gap-6 px-4 py-3.5 lg:px-6"
        >
          {widths.map((width, col) => (
            <Skeleton
              key={col}
              className={`h-4 ${width} ${col > 3 ? "ml-auto hidden sm:block" : ""}`}
            />
          ))}
          <Skeleton className="ml-auto h-4 w-4 shrink-0 rounded-sm sm:hidden" />
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 xl:grid-cols-4 lg:px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="supabase-panel flex flex-col gap-3 rounded-2xl border border-border/60 p-5"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <div className="supabase-panel rounded-2xl border border-border/60 p-5 lg:col-span-2">
          <Skeleton className="mb-4 h-4 w-36" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
        <div className="supabase-panel rounded-2xl border border-border/60 p-5">
          <Skeleton className="mb-4 h-4 w-28" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TablePageSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageHeaderSkeleton />
      <div className="px-4 lg:px-6">
        <div className="supabase-panel overflow-hidden rounded-2xl border border-border/60">
          <div className="flex flex-col gap-4 border-b border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-8 w-full max-w-xs rounded-md" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-16 rounded-md" />
              ))}
            </div>
          </div>
          <div className="hidden border-b border-border/50 px-4 py-3 lg:flex lg:px-6">
            <div className="flex w-full gap-6">
              {["w-28", "w-36", "w-24", "w-20", "w-16", "w-24"].map((w) => (
                <Skeleton key={w} className={`h-3 ${w}`} />
              ))}
            </div>
          </div>
          <TableRowsSkeleton rows={rows} />
        </div>
      </div>
    </div>
  )
}

export function FormPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageHeaderSkeleton />
      <div className="px-4 lg:px-6">
        <div className="supabase-panel rounded-2xl border border-border/60 p-6">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
          <div className="grid max-w-3xl gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            ))}
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BackofficeLoadingSkeleton() {
  return <TablePageSkeleton />
}
