import React from 'react'
import ItemsList from '@/components/items/ItemsList'

export const metadata = {
  title: 'アイテム一覧 - 在庫管理',
}

export default function ItemsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">アイテム管理</h1>
        <p className="text-sm text-gray-600 mt-1">
          アイテムの登録、編集、検索ができます
        </p>
      </div>

      <ItemsList />
    </div>
  )
}
