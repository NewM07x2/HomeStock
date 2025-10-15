"use client"
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ItemDetail from './ItemDetail'

type Props = {
  item?: any
  id?: string
  editable?: boolean
  handleCloseClick: () => void
}

export default function ItemDetailModal({ id, item, editable = false, handleCloseClick }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); return () => setMounted(false) }, [])

  const modal = (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded shadow p-6 w-11/12 max-w-xl">
        <div className="flex justify-end">
          <button className="px-2 py-1 text-sm" onClick={handleCloseClick}>閉じる</button>
        </div>
  <ItemDetail id={id} item={item} editable={editable} />
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modal, document.body)
}
