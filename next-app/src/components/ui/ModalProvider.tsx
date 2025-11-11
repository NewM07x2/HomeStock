"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'
import CreateItemModal from '@/components/items/CreateItemModal'
import ItemDetailModal from '@/components/items/ItemDetailModal'
import { fetchItemById } from '@/lib/api'

type ModalContextType = {
  openCreateItem: () => void
  closeCreateItem: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detailItem, setDetailItem] = useState<any | null>(null)
  const [detailEditable, setDetailEditable] = useState<boolean>(false)
  const [initialCode, setInitialCode] = useState<string | null>(null)
  const [initialData, setInitialData] = useState<any>(null)

  const openCreateItem = () => setCreateOpen(true)
  const closeCreateItem = () => {
    setCreateOpen(false)
    setInitialCode(null)
    setInitialData(null)
  }

  React.useEffect(() => {
    const handler = () => setCreateOpen(true)
    window.addEventListener('open-create-item', handler as EventListener)
    const detailHandler = (e: Event) => {
      const ce = e as CustomEvent<any>
      const payload = ce.detail
      const id = typeof payload === 'string' ? payload : payload?.id
      const editable = typeof payload === 'object' && payload?.editable === true
      const initialCodeValue = typeof payload === 'object' && payload?.initialCode ? payload.initialCode : null
      
      // initialCodeがある場合は新規登録モード（商品情報も含む）
      if (initialCodeValue && !id) {
        setInitialCode(initialCodeValue)
        setInitialData({
          name: payload?.initialName || '',
          unit_price: payload?.initialUnitPrice || '',
          category_id: payload?.initialCategoryId || '',
          unit_id: payload?.initialUnitId || ''
        })
        setCreateOpen(true)
        return
      }
      
      // fetch data first, then set detail to open modal with data ready
      fetchItemById(id).then(i => {
        setDetailItem(i)
        setDetailId(id)
        setDetailEditable(!!editable)
      }).catch(err => {
        console.error('failed to fetch item for detail modal', err)
      })
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
  {isCreateOpen && <CreateItemModal handleCloseClick={closeCreateItem} initialCode={initialCode} initialData={initialData} />}
  {detailId && detailEditable && (
    <CreateItemModal handleCloseClick={() => { setDetailId(null); setDetailItem(null); setDetailEditable(false) }} item={detailItem} isEdit={true} />
  )}
  {detailId && !detailEditable && (
    <ItemDetailModal handleCloseClick={() => { setDetailId(null); setDetailItem(null); setDetailEditable(false) }} id={detailId} item={detailItem} editable={detailEditable} />
  )}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}
