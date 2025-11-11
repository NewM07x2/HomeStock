"use client"
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createItem, updateItem } from '@/lib/api'
import { handleCloseClickModel } from '@/model/modal'
import { useRefresh } from '@/components/ui/RefreshContext'

export default function CreateItemModal({ handleCloseClick, item, isEdit, initialCode }: handleCloseClickModel & { item?: any; isEdit?: boolean; initialCode?: string | null }) {
  const [form, setForm] = useState<any>({ 
    code: '',
    name: '', 
    category: '', 
    unit: '',
    quantity: '',
    unit_price: '',
    status: 'active'
  })
  const [loading, setLoading] = useState(false)
  const { bump } = useRefresh()
  const [mounted, setMounted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (item) {
      setForm({
        code: item.code || '',
        name: item.name || '',
        category: item.category_id || item.category?.id || '',
        unit: item.unit_id || item.unit?.id || '',
        quantity: item.quantity !== undefined ? String(item.quantity) : '',
        unit_price: item.unit_price !== undefined ? String(item.unit_price) : '',
        status: item.status || 'active'
      })
    } else if (initialCode) {
      // バーコード読み取りから来た場合
      setForm({ 
        code: initialCode,
        name: '', 
        category: '', 
        unit: '',
        quantity: '',
        unit_price: '',
        status: 'active'
      })
    } else {
      setForm({ 
        code: '',
        name: '', 
        category: '', 
        unit: '',
        quantity: '',
        unit_price: '',
        status: 'active'
      })
    }
  }, [item, isEdit, initialCode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: value }))
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!form.code || !form.code.trim()) {
      newErrors.code = 'アイテムコードは必須です'
    }
    if (!form.name || !form.name.trim()) {
      newErrors.name = 'アイテム名称は必須です'
    }
    // unitは文字列またはオブジェクトの可能性があるため、適切にチェック
    const unitValue = typeof form.unit === 'string' ? form.unit : form.unit?.id || ''
    if (!unitValue || !unitValue.trim()) {
      newErrors.unit = '単位は必須です'
    }
    if (form.quantity && isNaN(Number(form.quantity))) {
      newErrors.quantity = '在庫数は数値で入力してください'
    }
    if (form.unit_price && isNaN(Number(form.unit_price))) {
      newErrors.unit_price = '金額は数値で入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const submitData = {
        code: form.code,
        name: form.name,
        unit_id: form.unit,
        category_id: form.category || undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        unit_price: form.unit_price ? Number(form.unit_price) : undefined,
        status: form.status
      }

      if (isEdit && item) {
        await updateItem(item.id, submitData)
      } else {
        await createItem(submitData)
      }

      // 成功時
      setForm({ 
        code: '',
        name: '', 
        category: '', 
        unit: '',
        quantity: '',
        unit_price: '',
        status: 'active'
      })
      setErrors({})
      bump()
      handleCloseClick()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || `${isEdit ? '更新' : '登録'}に失敗しました`
      setErrors({
        submit: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setForm({ 
      code: '',
      name: '', 
      category: '', 
      unit: '',
      quantity: '',
      unit_price: '',
      status: 'active'
    })
    setErrors({})
    handleCloseClick()
  }

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'アイテム編集' : '新規アイテム登録'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* アイテムコード */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              アイテムコード <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={form.code}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: ITEM001"
              disabled={loading}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-500">{errors.code}</p>
            )}
          </div>

          {/* アイテム名称 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              アイテム名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: ネジセット"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* カテゴリ */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリ
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 金具"
              disabled={loading}
            />
          </div>

          {/* 単位 */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              単位 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.unit ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: 個、箱、kg"
              disabled={loading}
            />
            {errors.unit && (
              <p className="mt-1 text-sm text-red-500">{errors.unit}</p>
            )}
          </div>

          {/* 在庫数 */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              在庫数
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: 100"
              disabled={loading}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
            )}
          </div>

          {/* 金額 */}
          <div>
            <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700 mb-1">
              金額（円）
            </label>
            <input
              type="number"
              id="unit_price"
              name="unit_price"
              value={form.unit_price}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.unit_price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: 1500"
              disabled={loading}
              step="1"
            />
            {errors.unit_price && (
              <p className="mt-1 text-sm text-red-500">{errors.unit_price}</p>
            )}
          </div>

          {/* ステータス */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="active">有効</option>
              <option value="inactive">無効</option>
            </select>
          </div>

          {/* 送信エラー */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? `${isEdit ? '更新中...' : '登録中...'}` : `${isEdit ? '更新' : '登録'}`}
          </button>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null
  return createPortal(modal, document.body)
}
