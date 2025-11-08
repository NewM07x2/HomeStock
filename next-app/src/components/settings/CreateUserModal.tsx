'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface UserData {
  id?: string
  email: string
  role: 'admin' | 'operator' | 'viewer'
}

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editData?: UserData
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
  editData
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'operator' as 'admin' | 'operator' | 'viewer'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editData) {
      setFormData({
        email: editData.email,
        password: '',
        confirmPassword: '',
        role: editData.role
      })
    } else {
      setFormData({ email: '', password: '', confirmPassword: '', role: 'operator' })
    }
  }, [editData, isOpen])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    // 編集時はパスワード変更が任意
    if (!editData) {
      if (!formData.password) {
        newErrors.password = 'パスワードは必須です'
      } else if (formData.password.length < 8) {
        newErrors.password = 'パスワードは8文字以上である必要があります'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'パスワード（確認）は必須です'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'パスワードが一致しません'
      }
    } else {
      // 編集時、パスワードが入力された場合のみバリデーション
      if (formData.password || formData.confirmPassword) {
        if (formData.password.length < 8) {
          newErrors.password = 'パスワードは8文字以上である必要があります'
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'パスワードが一致しません'
        }
      }
    }

    if (!formData.role) {
      newErrors.role = '権限は必須です'
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
      // リクエストボディ作成（編集時はパスワード空なら除外）
      const body: any = {
        email: formData.email,
        role: formData.role
      }
      if (!editData || formData.password) {
        body.password = formData.password
      }

      if (editData) {
        await axios.put(`/api/users/${editData.id}`, body)
      } else {
        await axios.post('/api/users', body)
      }

      // 成功時
      setFormData({ email: '', password: '', confirmPassword: '', role: 'operator' })
      setErrors({})
      onSuccess()
      onClose()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors({
          submit: error.response?.data?.error || `${editData ? '更新' : '登録'}に失敗しました`
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
    setFormData({ email: '', password: '', confirmPassword: '', role: 'operator' })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? 'ユーザー編集' : '新規ユーザー登録'}
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
          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example@homestock.local"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* パスワード */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード {editData ? '（変更する場合のみ入力）' : <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={editData ? '変更しない場合は空欄' : '8文字以上'}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* パスワード（確認） */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード（確認） {editData ? '' : <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={editData ? '変更する場合は再入力' : 'パスワードを再入力'}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 権限 */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              権限 <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="admin">管理者</option>
              <option value="operator">担当者</option>
              <option value="viewer">閲覧者</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role}</p>
            )}
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
