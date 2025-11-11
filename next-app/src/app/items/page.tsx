import React from 'react'
import ItemsList from '@/components/items/ItemsList'

export const metadata = {
  title: 'アイテム一覧 - 在庫管理',
}

export default function ItemsPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">アイテム管理</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          アイテムの登録、編集、検索ができます
        </p>
      </div>

      <ItemsList />
    </div>
  )
}
