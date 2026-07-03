export type GameCatalogueEntry = {
  name: string
  vendor: string
  rtp: string
  tags: string[]
}

export const brandOptions = [
  "Royal Vegas",
  "Spin Palace",
  "Jackpot City",
  "Ruby Fortune",
  "Gala Casino",
]

export const providerOptions = [
  "NetEnt",
  "Pragmatic Play",
  "Play'n GO",
  "Evolution",
  "Red Tiger",
]

export const gameCatalogue: GameCatalogueEntry[] = [
  {
    name: "Aztec Gold",
    vendor: "NetEnt",
    rtp: "96.4",
    tags: ["slots", "adventure", "high-volatility"],
  },
  {
    name: "Temple Quest",
    vendor: "Pragmatic Play",
    rtp: "95.8",
    tags: ["slots", "adventure"],
  },
  {
    name: "Sun Stone",
    vendor: "NetEnt",
    rtp: "96.1",
    tags: ["slots", "classic"],
  },
  {
    name: "Mega Reels",
    vendor: "Red Tiger",
    rtp: "95.2",
    tags: ["slots", "megaways", "high-volatility"],
  },
  {
    name: "Fortune Spins",
    vendor: "Pragmatic Play",
    rtp: "96.7",
    tags: ["slots", "classic"],
  },
  {
    name: "Wild Pyramids",
    vendor: "Play'n GO",
    rtp: "94.9",
    tags: ["slots", "adventure", "jackpot"],
  },
  {
    name: "Lucky Sevens",
    vendor: "NetEnt",
    rtp: "95.5",
    tags: ["slots", "classic"],
  },
  {
    name: "Dragon Riches",
    vendor: "Red Tiger",
    rtp: "96.0",
    tags: ["slots", "asian", "jackpot"],
  },
  {
    name: "Ocean Treasure",
    vendor: "Evolution",
    rtp: "97.0",
    tags: ["live", "table"],
  },
  {
    name: "Neon Nights",
    vendor: "Pragmatic Play",
    rtp: "95.9",
    tags: ["slots", "retro"],
  },
  {
    name: "Gold Rush Live",
    vendor: "Evolution",
    rtp: "97.3",
    tags: ["live", "gameshow"],
  },
  {
    name: "Cleo's Vault",
    vendor: "Play'n GO",
    rtp: "95.1",
    tags: ["slots", "egyptian"],
  },
]

export const gameVendorFilters = ["All vendors", "NetEnt", "Pragmatic Play", "Red Tiger"]
export const gameTagFilters = ["All tags", "slots", "adventure", "classic", "live", "jackpot"]

export function gameInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function gameTagsLabel(tags: string[]) {
  return tags.join(", ")
}
