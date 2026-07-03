"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"

import { StatusBadge } from "@/components/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { jackpots, type JackpotStatus } from "@/lib/backoffice-data"
import { cn } from "@/lib/utils"

const filters: Array<{ label: string; value: "all" | JackpotStatus }> = [
  { label: "All", value: "all" },
  { label: "Draft", value: "Draft" },
  { label: "Validated", value: "Validated" },
  { label: "Active", value: "Active" },
  { label: "Suspended", value: "Suspended" },
  { label: "Superseded", value: "Superseded" },
  { label: "Retired", value: "Retired" },
]

export function JackpotsTable() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | JackpotStatus>(
    "all"
  )

  const filtered = jackpots.filter((jackpot) => {
    const matchesQuery =
      query.trim().length === 0 ||
      jackpot.name.toLowerCase().includes(query.toLowerCase()) ||
      jackpot.id.toLowerCase().includes(query.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || jackpot.status === statusFilter
    return matchesQuery && matchesStatus
  })

  function openJackpot(id: string) {
    router.push(`/jackpots/${id}/edit`)
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-normal tracking-tight">Jackpots</h1>
        <p className="text-muted-foreground">
          Jackpot configuration pools — filter by lifecycle status (ST-001)
        </p>
      </div>

      <div className="px-4 lg:px-6">
        <Card className="supabase-panel">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle>Jackpot pools</CardTitle>
              <CardDescription>
                {filtered.length} of {jackpots.length} jackpots shown
              </CardDescription>
            </div>
            <Input
              placeholder="Search by name or ID..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="max-w-sm"
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Tabs
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | JackpotStatus)
              }
            >
              <TabsList>
                {filters.map((filter) => (
                  <TabsTrigger key={filter.value} value={filter.value}>
                    {filter.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="overflow-hidden rounded-xl border border-border/80 bg-surface-100">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-24 first:pl-6 lg:first:pl-8">
                      ID
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand scope</TableHead>
                    <TableHead>Tiers</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10 last:pr-6 lg:last:pr-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No jackpots match the selected filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((jackpot) => (
                      <TableRow
                        key={jackpot.id}
                        tabIndex={0}
                        role="link"
                        aria-label={`Open ${jackpot.name}`}
                        className="cursor-pointer hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
                        onClick={() => openJackpot(jackpot.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            openJackpot(jackpot.id)
                          }
                        }}
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground first:pl-6 lg:first:pl-8">
                          {jackpot.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/jackpots/${jackpot.id}/edit`}
                              className="font-medium text-foreground hover:text-brand"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {jackpot.name}
                            </Link>
                            {jackpot.isPersonal ? (
                              <span className="rounded-full bg-brand/15 px-2 py-0.5 text-xs text-brand">
                                Personal
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {jackpot.brandsLabel}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {jackpot.tiersLabel}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {jackpot.version}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={jackpot.status} />
                        </TableCell>
                        <TableCell className="last:pr-6 lg:last:pr-8">
                          <ChevronRightIcon
                            className={cn(
                              "size-4 text-muted-foreground",
                              "group-hover:text-foreground"
                            )}
                            aria-hidden
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
