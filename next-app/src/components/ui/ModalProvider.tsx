"use client"
import React, { createContext, useContext, useState } from 'react'
import CreateItemModal from '@/components/items/CreateItemModal'

type ModalContextType = {
  openCreateItem: () => void
  closeCreateItem: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isCreateOpen, setCreateOpen] = useState(false)

  const openCreateItem = () => setCreateOpen(true)
  const closeCreateItem = () => setCreateOpen(false)

  React.useEffect(() => {
    const handler = () => setCreateOpen(true)
    window.addEventListener('open-create-item', handler as EventListener)
    return () => window.removeEventListener('open-create-item', handler as EventListener)
  }, [])

  return (
    <ModalContext.Provider value={{ openCreateItem, closeCreateItem }}>
      {children}
      {isCreateOpen && <CreateItemModal handleCloseClick={closeCreateItem} />}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}
