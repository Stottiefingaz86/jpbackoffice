"use client"

import * as React from "react"

import { brands, type Brand } from "@/lib/backoffice-data"

type BrandContextValue = {
  activeBrand: Brand
  setActiveBrand: (brand: Brand) => void
}

const BrandContext = React.createContext<BrandContextValue | null>(null)

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [activeBrand, setActiveBrand] = React.useState<Brand>(brands[0])

  return (
    <BrandContext.Provider value={{ activeBrand, setActiveBrand }}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = React.useContext(BrandContext)
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider.")
  }
  return context
}
