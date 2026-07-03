"use client"

import * as React from "react"

import SupabaseManagerDialog from "@/components/supabase-manager"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

const projectRef = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF ?? "local-dev"

export function PlatformManagerTrigger() {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Open platform kit
      </Button>
      <SupabaseManagerDialog
        projectRef={projectRef}
        open={open}
        onOpenChange={setOpen}
        isMobile={isMobile}
      />
    </>
  )
}
