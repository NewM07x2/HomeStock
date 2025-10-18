"use client"
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createItem, updateItem } from '@/lib/mockApi'
import { handleCloseClickModel } from '@/model/modal'
import { useRefresh } from '@/components/ui/RefreshContext'

export default function CreateItemModal({ handleCloseClick, item, isEdit }: handleCloseClickModel & { item?: any; isEdit?: boolean }) {
  const [form, setForm] = useState<any>({ name: '', category: '', price: '', qty: '', purchase_store: '', purchase_date: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const { bump } = useRefresh()
  const [mounted, setMounted] = useState(false)
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (item) {
      // initialize form with existing item when editing
      setForm({ ...item })
    }
  }, [item])

  const validateForm = () => {
    const newErrors: any = {}
    if (!form.name) newErrors.name = '名称は必須です'
    if (!form.category) newErrors.category = 'カテゴリは必須です'
    if (form.price && isNaN(Number(form.price))) newErrors.price = '価格は数字で入力してください'
    if (form.qty && isNaN(Number(form.qty))) newErrors.qty = '在庫は数字で入力してください'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      if (isEdit && form?.id) {
        await updateItem(form.id, form)
      } else {
        await createItem(form)
      }
      bump()
      handleCloseClick()
    } catch (e) {
      console.error(e)
      alert(isEdit ? '更新に失敗しました' : '登録に失敗しました')
    } finally { setLoading(false) }
  }

  const modal = (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-2">
      <div className="bg-white rounded shadow p-4 sm:p-6 w-full max-w-xl mx-auto max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-3">{isEdit ? 'アイテム編集' : 'アイテム作成'}</h3>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-row gap-2">
            <label className="">名称<span className="text-red-500">※</span></label>
            <input className="border rounded w-full px-2 py-1" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
          </div>
          <div className="flex flex-row gap-2">
            <label className="">カテゴリ<span className="text-red-500">※</span></label>
            <input className="border rounded w-full px-2 py-1" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            {errors.category && <span className="text-red-500 text-xs">{errors.category}</span>}
          </div>
          <div className="flex flex-row gap-2">
            <label className="">価格</label>
            <input className="border rounded w-full px-2 py-1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
          </div>
          <div className="flex flex-row gap-2">
            <label className="">在庫</label>
            <input className="border rounded w-full px-2 py-1" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
            {errors.qty && <span className="text-red-500 text-xs">{errors.qty}</span>}
          </div>
          <div className="flex flex-row gap-2">
            <label className="">購入店舗</label>
            <input className="border rounded w-full px-2 py-1" value={form.purchase_store} onChange={e => setForm({ ...form, purchase_store: e.target.value })} />
          </div>
          <div className="flex flex-row gap-2">
            <label className="">購入日</label>
            <input type="date" className="border rounded w-full px-2 py-1" value={form.purchase_date} onChange={e => setForm({ ...form, purchase_date: e.target.value })} />
          </div>
          <div className="sm:col-span-2 flex flex-row gap-2">
            <label className="">備考</label>
            <textarea className="border rounded w-full px-2 py-1" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1 border rounded" onClick={() => handleCloseClick()} disabled={loading}>キャンセル</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit} disabled={loading}>{loading ? (isEdit ? '更新中...' : '登録中...') : (isEdit ? '更新' : '登録')}</button>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modal, document.body)
}
