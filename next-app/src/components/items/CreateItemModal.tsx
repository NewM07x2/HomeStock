"use client"
import React, { useState } from 'react'
import { createItem } from '@/lib/mockApi'

export default function CreateItemModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<any>({ name: '', category: '', price: '', qty: '', purchase_store: '', purchase_date: '', notes: '' })
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      await createItem(form)
      onClose()
    } catch (e) {
      console.error(e)
      alert('登録に失敗しました')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded shadow p-6 w-11/12 max-w-xl">
        <h3 className="text-lg font-medium mb-3">アイテム作成</h3>
        <div className="space-y-2 text-sm">
          <div>
            <label className="block">名称</label>
            <input className="border rounded w-full px-2 py-1" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block">カテゴリ</label>
            <input className="border rounded w-full px-2 py-1" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label className="block">価格</label>
            <input className="border rounded w-full px-2 py-1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label className="block">在庫</label>
            <input className="border rounded w-full px-2 py-1" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
          </div>
          <div>
            <label className="block">購入店舗</label>
            <input className="border rounded w-full px-2 py-1" value={form.purchase_store} onChange={e => setForm({ ...form, purchase_store: e.target.value })} />
          </div>
          <div>
            <label className="block">購入日</label>
            <input type="date" className="border rounded w-full px-2 py-1" value={form.purchase_date} onChange={e => setForm({ ...form, purchase_date: e.target.value })} />
          </div>
          <div>
            <label className="block">備考</label>
            <textarea className="border rounded w-full px-2 py-1" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1 border rounded" onClick={onClose} disabled={loading}>キャンセル</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit} disabled={loading}>{loading ? '登録中...' : '登録'}</button>
        </div>
      </div>
    </div>
  )
}
