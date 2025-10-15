"use client"
import React, { useEffect, useState } from 'react'
import { fetchItemById } from '@/lib/mockApi'

export default function ItemDetail({ id }: { id: string }) {
  const [item, setItem] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchItemById(id).then(i => { if (mounted) setItem(i) }).catch(e => { if (mounted) setError(String(e)) }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  if (loading) return <div>読み込み中...</div>
  if (error) return <div className="text-red-600">エラー: {error}</div>
  if (!item) return <div>見つかりません</div>

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-2">{item.name} ({item.code})</h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><strong>カテゴリ</strong><div>{item.category}</div></div>
        <div><strong>在庫</strong><div>{item.qty}</div></div>
        <div><strong>価格</strong><div>{item.price}</div></div>
        <div><strong>購入店</strong><div>{item.purchase_store}</div></div>
        <div><strong>購入日</strong><div>{item.purchase_date}</div></div>
        <div className="col-span-2"><strong>備考</strong><div>{item.notes}</div></div>
      </div>
    </div>
  )
}
