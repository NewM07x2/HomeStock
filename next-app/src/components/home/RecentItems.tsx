import React from 'react'
import { fetchRecentItems, type Item } from '@/lib/api'

export default async function RecentItems() {
  let items: Item[] = []
  let error: string | null = null

  try {
    items = await fetchRecentItems(10)
    console.log('Fetched recent items:', items)
  } catch (e) {
    error = e instanceof Error ? e.message : '不明なエラーが発生しました'
    console.error('Failed to load items:', e)
  }

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">最新アイテム</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!error && items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>アイテムが登録されていません</p>
        </div>
      )}

      {!error && items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-3 px-2 font-medium text-gray-700">コード</th>
                <th className="py-3 px-2 font-medium text-gray-700">名称</th>
                <th className="py-3 px-2 font-medium text-gray-700">カテゴリ</th>
                <th className="py-3 px-2 font-medium text-gray-700">在庫数</th>
                <th className="py-3 px-2 font-medium text-gray-700">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2 font-mono text-xs text-gray-900">{item.code}</td>
                  <td className="py-3 px-2 text-gray-900">{item.name}</td>
                  <td className="py-3 px-2 text-gray-600">{item.category?.name || '-'}</td>
                  <td className="py-3 px-2 text-gray-900">
                    {item.quantity !== null && item.quantity !== undefined 
                      ? `${item.quantity} ${item.unit?.name || ''}` 
                      : '-'}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status === 'active' ? '有効' : '無効'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
