"use client"
import React, { createContext, useContext, useState } from 'react'

type RefreshContextType = { refreshCount: number; bump: () => void }
const RefreshContext = createContext<RefreshContextType | null>(null)

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)
  const bump = () => setCount(c => c + 1)
  return <RefreshContext.Provider value={{ refreshCount: count, bump }}>{children}</RefreshContext.Provider>
}

export function useRefresh() {
  const ctx = useContext(RefreshContext)
  if (!ctx) throw new Error('useRefresh must be used within RefreshProvider')
  return ctx
}
