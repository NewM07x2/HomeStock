"use client"
import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import CreateButton from './CreateButton'
import Pagination from './Pagination'
import { fetchItems } from '@/lib/mockApi'
import { useRefresh } from '@/components/ui/RefreshContext'
import { useModal } from '@/components/ui/ModalProvider'

type Item = {
  id: string
  code: string
  name: string
  category?: string
  qty: number
}

export default function ItemsList() {
  const [items, setItems] = useState<Item[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  const { refreshCount } = useRefresh()

  useEffect(() => {
    let mounted = true
    fetchItems({ q: query, page, limit }).then(res => {
      if (!mounted) return
      setItems(res.items)
      setTotal(res.total)
    })
    return () => { mounted = false }
  }, [query, page, refreshCount])

  return (
    <div className="bg-white rounded-lg shadow">
      {/* 検索・フィルタエリア */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* 検索ボックス */}
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="アイテムコードまたは名前で検索..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 新規登録ボタン */}
          <div className="w-full md:w-auto">
            <CreateButton />
          </div>
        </div>
      </div>

      {/* アイテムリスト */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                コード
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                カテゴリ
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                在庫数
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  データがありません
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('open-item-detail', { detail: { id: item.id, editable: true } }))} 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {item.code}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.category ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                    {item.qty}
                  </td>
                  <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('open-item-detail', { detail: { id: item.id, editable: true } }))}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      詳細
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      削除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{total}</span> 件のアイテム
          </div>
          <Pagination page={page} total={total} limit={limit} onChange={p => setPage(p)} />
        </div>
      </div>
    </div>
  )
}
