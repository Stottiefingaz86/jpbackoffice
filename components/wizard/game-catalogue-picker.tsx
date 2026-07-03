"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import { ChipSelect } from "@/components/wizard/chip-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  gameCatalogue,
  gameInitials,
  gameTagFilters,
  gameTagsLabel,
  gameVendorFilters,
  type GameCatalogueEntry,
} from "@/lib/catalogue-data"
import { cn } from "@/lib/utils"

function GameRow({
  game,
  action,
}: {
  game: GameCatalogueEntry
  action: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3 last:border-b-0">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-surface-300 text-xs font-semibold">
        {gameInitials(game.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{game.name}</p>
        <p className="text-xs text-muted-foreground">
          {game.vendor} · RTP {game.rtp}% · {gameTagsLabel(game.tags)}
        </p>
      </div>
      {action}
    </div>
  )
}

export function GameCataloguePicker({
  selectedGames,
  onChange,
}: {
  selectedGames: string[]
  onChange: (games: string[]) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [vendorFilter, setVendorFilter] = React.useState("All vendors")
  const [tagFilter, setTagFilter] = React.useState("All tags")

  const selectedEntries = gameCatalogue.filter((game) =>
    selectedGames.includes(game.name)
  )

  const filtered = gameCatalogue.filter((game) => {
    const q = query.trim().toLowerCase()
    const matchesQuery =
      !q ||
      game.name.toLowerCase().includes(q) ||
      game.vendor.toLowerCase().includes(q) ||
      game.tags.some((tag) => tag.toLowerCase().includes(q))
    const matchesVendor =
      vendorFilter === "All vendors" || game.vendor === vendorFilter
    const matchesTag =
      tagFilter === "All tags" || game.tags.includes(tagFilter)
    return matchesQuery && matchesVendor && matchesTag
  })

  function toggleGame(name: string) {
    onChange(
      selectedGames.includes(name)
        ? selectedGames.filter((game) => game !== name)
        : [...selectedGames, name]
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {selectedEntries.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border/80">
          {selectedEntries.map((game) => (
            <GameRow
              key={game.name}
              game={game}
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-md border-destructive/40 text-destructive hover:bg-destructive/10"
                  onClick={() => toggleGame(game.name)}
                >
                  Remove
                </Button>
              }
            />
          ))}
        </div>
      ) : null}

      {!open ? (
        <Button
          type="button"
          variant="outline"
          className="w-fit rounded-md border-border/80"
          onClick={() => setOpen(true)}
        >
          + Add games from catalogue
        </Button>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/80">
          <div className="flex items-center justify-between border-b border-border/60 bg-surface-200/60 px-4 py-3">
            <p className="text-sm font-semibold">Supplied game catalogue</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-md"
              onClick={() => setOpen(false)}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
          <div className="space-y-3 border-b border-border/60 p-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, vendor, or tag…"
              className="rounded-md"
            />
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Vendor</p>
              <ChipSelect
                options={gameVendorFilters}
                selected={[vendorFilter]}
                single
                onChange={(next) => setVendorFilter(next[0] ?? "All vendors")}
              />
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Tag</p>
              <ChipSelect
                options={gameTagFilters}
                selected={[tagFilter]}
                single
                onChange={(next) => setTagFilter(next[0] ?? "All tags")}
              />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                No game in the supplied catalogue matches. The catalogue, RTP,
                tags and thumbnails are supplied per integration.
              </p>
            ) : (
              filtered.map((game) => {
                const added = selectedGames.includes(game.name)
                return (
                  <GameRow
                    key={game.name}
                    game={game}
                    action={
                      <Button
                        type="button"
                        size="sm"
                        variant={added ? "secondary" : "outline"}
                        className={cn(
                          "rounded-md",
                          !added && "border-border/80"
                        )}
                        onClick={() => toggleGame(game.name)}
                      >
                        {added ? "Added" : "Add"}
                      </Button>
                    }
                  />
                )
              })
            )}
          </div>
          <p className="border-t border-border/60 px-4 py-2 text-xs text-muted-foreground">
            {filtered.length} game(s) shown. Catalogue values are supplied /
            per-integration placeholders.
          </p>
        </div>
      )}
    </div>
  )
}
