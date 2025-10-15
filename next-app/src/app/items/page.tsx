import React from 'react'
import ItemsList from '@/components/items/ItemsList'

export const metadata = {
  title: 'アイテム一覧 - 在庫管理',
}

export default function ItemsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">アイテム一覧</h1>
      <ItemsList />
    </div>
  )
}
