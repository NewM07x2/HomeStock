"use client"
import React from 'react'
import ItemDetail from './ItemDetail'

type Props = {
  id: string
  handleCloseClick: () => void
}

export default function ItemDetailModal({ id, handleCloseClick }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded shadow p-6 w-11/12 max-w-xl">
        <div className="flex justify-end">
          <button className="px-2 py-1 text-sm" onClick={handleCloseClick}>閉じる</button>
        </div>
        <ItemDetail id={id} />
      </div>
    </div>
  )
}
