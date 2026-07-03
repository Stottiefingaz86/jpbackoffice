"use client"

import Link from "next/link"
import { AlertTriangleIcon, ArrowRightIcon, TrendingUpIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { StatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import {
  attentionItems,
  contributionTrend,
  kpis,
  lifecycleStats,
  recentActivity,
} from "@/lib/backoffice-data"

const chartConfig = {
  amount: {
    label: "Contributions",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-normal tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Jackpot configuration & live operations overview
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 xl:grid-cols-4 lg:px-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="supabase-panel">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardDescription className="text-xs uppercase tracking-wide">
                  {kpi.label}
                </CardDescription>
                <Badge
                  variant="outline"
                  className="border-border/60 font-normal text-muted-foreground"
                >
                  {kpi.tag}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {kpi.value}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p className="text-muted-foreground">{kpi.sub}</p>
              <div className="flex items-center gap-1 font-medium text-brand">
                {kpi.up ? <TrendingUpIcon className="size-4" /> : null}
                {kpi.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <Card className="supabase-panel lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangleIcon className="text-destructive" />
              Needs attention
            </CardTitle>
            <CardDescription>
              Jackpots requiring operator review
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {attentionItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-lg border border-border/80 bg-surface-200/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.note}</p>
                  <span className="font-mono text-xs text-muted-foreground">
                    {item.id}
                  </span>
                </div>
                <Button variant="outline" size="sm" render={<Link href="/jackpots" />}>
                  Review
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="supabase-panel">
          <CardHeader>
            <CardTitle>Lifecycle</CardTitle>
            <CardDescription>Jackpots by state</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {lifecycleStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between rounded-lg border border-border/80 bg-surface-200/40 px-3 py-2"
              >
                <span className="text-sm">{stat.label}</span>
                <span className="font-mono text-sm font-medium tabular-nums">
                  {stat.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card className="supabase-panel">
          <CardHeader>
            <CardTitle>Contributions (7 days)</CardTitle>
            <CardDescription>Daily contribution volume across all pools</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
              <AreaChart data={contributionTrend}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area
                  dataKey="amount"
                  type="natural"
                  fill="var(--color-amount)"
                  fillOpacity={0.2}
                  stroke="var(--color-amount)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <Card className="supabase-panel">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest configuration changes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-0 p-0">
            {recentActivity.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex flex-col gap-1 px-6 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {activity.id}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.actor}</span>{" "}
                    {activity.action}{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                </div>
                {index < recentActivity.length - 1 ? (
                  <Separator className="mx-6" />
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
