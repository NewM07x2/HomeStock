"use client"
import React, { createContext, useContext, useState } from 'react'
import CreateItemModal from '@/components/items/CreateItemModal'
import ItemDetailModal from '@/components/items/ItemDetailModal'

type ModalContextType = {
  openCreateItem: () => void
  closeCreateItem: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)

  const openCreateItem = () => setCreateOpen(true)
  const closeCreateItem = () => setCreateOpen(false)

  React.useEffect(() => {
    const handler = () => setCreateOpen(true)
    window.addEventListener('open-create-item', handler as EventListener)
    const detailHandler = (e: Event) => {
      const ce = e as CustomEvent<string>
      setDetailId(ce.detail)
    }
    window.addEventListener('open-item-detail', detailHandler as EventListener)
    return () => {
      window.removeEventListener('open-create-item', handler as EventListener)
      window.removeEventListener('open-item-detail', detailHandler as EventListener)
    }
  }, [])

  return (
    <ModalContext.Provider value={{ openCreateItem, closeCreateItem }}>
      {children}
  {isCreateOpen && <CreateItemModal handleCloseClick={closeCreateItem} />}
  {detailId && <ItemDetailModal handleCloseClick={() => setDetailId(null)} id={detailId} />}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}
