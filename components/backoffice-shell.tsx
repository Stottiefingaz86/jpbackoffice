"use client"

import dynamic from "next/dynamic"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BrandProvider } from "@/contexts/brand-context"

const RealtimeCursors = dynamic(
  () =>
    import("@/components/realtime-cursors").then((mod) => mod.RealtimeCursors),
  { ssr: false }
)

export function BackofficeShell({ children }: { children: React.ReactNode }) {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

  return (
    <BrandProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "17rem",
            "--header-height": "48px",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="min-h-svh overflow-hidden">
          <SiteHeader />
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {children}
          </div>
        </SidebarInset>
        {hasSupabase ? (
          <RealtimeCursors roomName="jp-backoffice" username="Maria Alvarez" />
        ) : null}
      </SidebarProvider>
    </BrandProvider>
  )
}
