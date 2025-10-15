"use client"
import React, { useEffect, useState } from 'react'
import { fetchItemById, updateItem } from '@/lib/mockApi'
import { useRefresh } from '@/components/ui/RefreshContext'

export default function ItemDetail({ id, item: initialItem, editable = false }: { id?: string, item?: any, editable?: boolean }) {
  const [item, setItem] = useState<any | null>(initialItem ?? null)
  const [loading, setLoading] = useState(!initialItem)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<any>(initialItem ?? null)
  const { bump } = useRefresh()

  useEffect(() => {
    let mounted = true
    if (!initialItem && id) {
      setLoading(true)
      fetchItemById(id)
        .then(i => { if (mounted) { setItem(i); setForm(i) } })
        .catch(e => { if (mounted) setError(String(e)) })
        .finally(() => { if (mounted) setLoading(false) })
    } else {
      setForm(initialItem ?? null)
    }
    return () => { mounted = false }
  }, [id, initialItem])

  if (loading) return <div>読み込み中...</div>
  if (error) return <div className="text-red-600">エラー: {error}</div>
  if (!item) return <div>見つかりません</div>

  const save = async () => {
    try {
      await updateItem(item.id, form)
      bump()
      alert('保存しました')
    } catch (e) {
      console.error(e)
      alert('更新に失敗しました')
    }
  }

  return (
    <div className="bg-white rounded shadow p-4">
      {editable ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">編集: {form?.name} ({form?.code})</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <label className="block">カテゴリ</label>
              <input className="border rounded w-full px-2 py-1" value={form?.category ?? ''} onChange={e => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="block">在庫</label>
              <input className="border rounded w-full px-2 py-1" value={form?.qty ?? ''} onChange={e => setForm({ ...form, qty: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block">価格</label>
              <input className="border rounded w-full px-2 py-1" value={form?.price ?? ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block">購入店</label>
              <input className="border rounded w-full px-2 py-1" value={form?.purchase_store ?? ''} onChange={e => setForm({ ...form, purchase_store: e.target.value })} />
            </div>
            <div>
              <label className="block">購入日</label>
              <input type="date" className="border rounded w-full px-2 py-1" value={form?.purchase_date ?? ''} onChange={e => setForm({ ...form, purchase_date: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="block">備考</label>
              <textarea className="border rounded w-full px-2 py-1" value={form?.notes ?? ''} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button className="px-3 py-1 border rounded" onClick={save}>保存</button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">{item.name} ({item.code})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div><strong>カテゴリ</strong><div>{item.category}</div></div>
            <div><strong>在庫</strong><div>{item.qty}</div></div>
            <div><strong>価格</strong><div>{item.price}</div></div>
            <div><strong>購入店</strong><div>{item.purchase_store}</div></div>
            <div><strong>購入日</strong><div>{item.purchase_date}</div></div>
            <div className="sm:col-span-2"><strong>備考</strong><div>{item.notes}</div></div>
          </div>
        </>
      )}
    </div>
  )
}
