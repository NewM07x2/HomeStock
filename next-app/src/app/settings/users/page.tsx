'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CreateUserModal from '@/components/settings/CreateUserModal'

interface User {
  id: string
  email: string
  role: 'admin' | 'operator' | 'viewer'
  created_at: string
  updated_at: string
}

const roleLabels: Record<string, string> = {
  admin: '管理者',
  operator: '担当者',
  viewer: '閲覧者'
}

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-800',
  operator: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-800'
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editData, setEditData] = useState<User | undefined>(undefined)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSuccess = () => {
    fetchUsers()
  }

  const handleEdit = (user: User) => {
    setEditData(user)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`「${email}」を削除してもよろしいですか？この操作は取り消せません。`)) {
      return
    }

    try {
      await axios.delete(`/api/users/${id}`)
      alert('削除しました')
      fetchUsers()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || '削除に失敗しました')
      } else {
        alert('削除に失敗しました')
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditData(undefined)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            システムを利用するユーザーを管理します
          </p>
        </div>
        <button
          onClick={() => {
            setEditData(undefined)
            setIsModalOpen(true)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 新規ユーザー
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">ユーザーが登録されていません</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メールアドレス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  権限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最終更新
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                      {roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.updated_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      編集
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id, user.email)}
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editData={editData}
      />
    </div>
  )
}
