"use client"
import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import Pagination from './Pagination'
import { fetchItems } from '@/lib/mockApi'

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

  useEffect(() => {
    let mounted = true
    fetchItems({ q: query, page, limit }).then(res => {
      if (!mounted) return
      setItems(res.items)
      setTotal(res.total)
    })
    return () => { mounted = false }
  }, [query, page])

  return (
    <div className="space-y-4">
      <SearchBar value={query} onChange={val => { setQuery(val); setPage(1) }} />

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 px-3">コード</th>
              <th className="py-2 px-3">名称</th>
              <th className="py-2 px-3">カテゴリ</th>
              <th className="py-2 px-3">在庫</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-2 px-3">{item.code}</td>
                <td className="py-2 px-3">{item.name}</td>
                <td className="py-2 px-3">{item.category ?? '-'}</td>
                <td className="py-2 px-3">{item.qty}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">データがありません</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} total={total} limit={limit} onChange={p => setPage(p)} />
    </div>
  )
}
