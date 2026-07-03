"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"

import { CampaignStatusBadge } from "@/components/status-badge"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { campaigns, type CampaignStatus } from "@/lib/backoffice-data"

export function CampaignsTable() {
  const router = useRouter()

  function openCampaign(id: string) {
    router.push(`/campaigns/${id}/edit`)
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <PageHeader
        title="Campaigns"
        tag="FR-009 · UF-005 · ST-005"
        description="Jackpot campaigns run against player segments supplied by external systems — the engine targets a supplied segment ID and never computes or builds segments. Select a campaign to manage its schedule and lifecycle."
        action={
          <Button
            className="rounded-md bg-brand text-brand-foreground hover:bg-brand/90"
            render={<Link href="/campaigns/new" />}
          >
            New campaign
          </Button>
        }
      />

      <div className="px-4 lg:px-6">
        <div className="supabase-panel overflow-hidden rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-24 first:pl-6 lg:first:pl-8">ID</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Jackpot</TableHead>
                <TableHead>Segment targeting</TableHead>
                <TableHead>Window</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10 last:pr-6 lg:last:pr-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  tabIndex={0}
                  role="link"
                  aria-label={`Open ${campaign.name}`}
                  className="cursor-pointer hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
                  onClick={() => openCampaign(campaign.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      openCampaign(campaign.id)
                    }
                  }}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground first:pl-6 lg:first:pl-8">
                    {campaign.id}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/campaigns/${campaign.id}/edit`}
                      className="font-medium hover:text-brand"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {campaign.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {campaign.jackpot}
                  </TableCell>
                  <TableCell className="max-w-xs font-mono text-xs leading-relaxed text-muted-foreground">
                    {campaign.segment}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {campaign.windowLabel}
                  </TableCell>
                  <TableCell>
                    <CampaignStatusBadge status={campaign.status as CampaignStatus} />
                  </TableCell>
                  <TableCell className="last:pr-6 lg:last:pr-8">
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
