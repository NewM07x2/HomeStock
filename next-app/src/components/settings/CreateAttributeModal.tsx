'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface AttributeData {
  id?: string
  code: string
  name: string
  value_type: 'text' | 'number' | 'boolean' | 'date'
  description?: string
}

interface CreateAttributeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editData?: AttributeData
}

export default function CreateAttributeModal({
  isOpen,
  onClose,
  onSuccess,
  editData
}: CreateAttributeModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    value_type: 'text' as 'text' | 'number' | 'boolean' | 'date',
    description: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editData) {
      setFormData({
        code: editData.code,
        name: editData.name,
        value_type: editData.value_type,
        description: editData.description || ''
      })
    } else {
      setFormData({ code: '', name: '', value_type: 'text', description: '' })
    }
  }, [editData, isOpen])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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

    if (!formData.code.trim()) {
      newErrors.code = '属性コードは必須です'
    }
    if (!formData.name.trim()) {
      newErrors.name = '属性名称は必須です'
    }
    if (!formData.value_type) {
      newErrors.value_type = '属性値の型は必須です'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (editData) {
        await axios.put(`/api/attributes/${editData.id}`, formData)
      } else {
        await axios.post('/api/attributes', formData)
      }

      // 成功時
      setFormData({ code: '', name: '', value_type: 'text', description: '' })
      setErrors({})
      onSuccess()
      onClose()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || `${editData ? '更新' : '登録'}に失敗しました`
        setErrors({
          submit: errorMessage
        })
      } else {
        setErrors({
          submit: `${editData ? '更新' : '登録'}に失敗しました`
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ code: '', name: '', value_type: 'text', description: '' })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? '属性編集' : '新規属性登録'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* 属性コード */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              属性コード <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: brand, color, size"
              disabled={isSubmitting}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-500">{errors.code}</p>
            )}
          </div>

          {/* 属性名称 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              属性名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="例: ブランド, 色, サイズ"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* 属性値の型 */}
          <div>
            <label htmlFor="value_type" className="block text-sm font-medium text-gray-700 mb-1">
              属性値の型 <span className="text-red-500">*</span>
            </label>
            <select
              id="value_type"
              name="value_type"
              value={formData.value_type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.value_type ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="text">テキスト</option>
              <option value="number">数値</option>
              <option value="boolean">真偽値</option>
              <option value="date">日付</option>
            </select>
            {errors.value_type && (
              <p className="mt-1 text-sm text-red-500">{errors.value_type}</p>
            )}
          </div>

          {/* 説明 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="属性の説明（任意）"
              disabled={isSubmitting}
            />
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
            disabled={isSubmitting}
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? `${editData ? '更新中...' : '登録中...'}` : `${editData ? '更新' : '登録'}`}
          </button>
        </div>
      </div>
    </div>
  )
}
