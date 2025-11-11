'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CreateCategoryModal from '@/components/settings/CreateCategoryModal'
import CreateUnitModal from '@/components/settings/CreateUnitModal'
import CreateAttributeModal from '@/components/settings/CreateAttributeModal'

type TabType = 'categories' | 'units' | 'attributes'

interface Category {
  id: string
  code: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

interface Unit {
  id: string
  code: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

interface Attribute {
  id: string
  code: string
  name: string
  value_type: 'text' | 'number' | 'boolean' | 'date'
  description?: string
  created_at: string
  updated_at: string
}

const valueTypeLabels: Record<string, string> = {
  text: 'テキスト',
  number: '数値',
  boolean: '真偽値',
  date: '日付'
}

const tabs = [
  { id: 'categories' as TabType, label: 'カテゴリ', icon: '📂' },
  { id: 'units' as TabType, label: '単位', icon: '📏' },
  { id: 'attributes' as TabType, label: '属性', icon: '🏷️' },
]

export default function MastersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('categories')
  
  // Categories
  const [categories, setCategories] = useState<Category[]>([])
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | undefined>(undefined)

  // Units
  const [units, setUnits] = useState<Unit[]>([])
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false)
  const [editUnit, setEditUnit] = useState<Unit | undefined>(undefined)

  // Attributes
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false)
  const [editAttribute, setEditAttribute] = useState<Attribute | undefined>(undefined)

  const [isLoading, setIsLoading] = useState(true)

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch Units
  const fetchUnits = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/units')
      setUnits(response.data)
    } catch (error) {
      console.error('Failed to fetch units:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch Attributes
  const fetchAttributes = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/attributes')
      setAttributes(response.data)
    } catch (error) {
      console.error('Failed to fetch attributes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories()
    } else if (activeTab === 'units') {
      fetchUnits()
    } else if (activeTab === 'attributes') {
      fetchAttributes()
    }
  }, [activeTab])

  // Category handlers
  const handleEditCategory = (category: Category) => {
    setEditCategory(category)
    setIsCategoryModalOpen(true)
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？この操作は取り消せません。`)) {
      return
    }
    try {
      await axios.delete(`/api/categories/${id}`)
      alert('削除しました')
      fetchCategories()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || '削除に失敗しました')
      } else {
        alert('削除に失敗しました')
      }
    }
  }

  // Unit handlers
  const handleEditUnit = (unit: Unit) => {
    setEditUnit(unit)
    setIsUnitModalOpen(true)
  }

  const handleDeleteUnit = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？この操作は取り消せません。`)) {
      return
    }
    try {
      await axios.delete(`/api/units/${id}`)
      alert('削除しました')
      fetchUnits()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || '削除に失敗しました')
      } else {
        alert('削除に失敗しました')
      }
    }
  }

  // Attribute handlers
  const handleEditAttribute = (attribute: Attribute) => {
    setEditAttribute(attribute)
    setIsAttributeModalOpen(true)
  }

  const handleDeleteAttribute = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？この操作は取り消せません。`)) {
      return
    }
    try {
      await axios.delete(`/api/attributes/${id}`)
      alert('削除しました')
      fetchAttributes()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || '削除に失敗しました')
      } else {
        alert('削除に失敗しました')
      }
    }
  }

  const handleCreateNew = () => {
    if (activeTab === 'categories') {
      setEditCategory(undefined)
      setIsCategoryModalOpen(true)
    } else if (activeTab === 'units') {
      setEditUnit(undefined)
      setIsUnitModalOpen(true)
    } else if (activeTab === 'attributes') {
      setEditAttribute(undefined)
      setIsAttributeModalOpen(true)
    }
  }

  const getButtonLabel = () => {
    switch (activeTab) {
      case 'categories': return '+ 新規カテゴリ'
      case 'units': return '+ 新規単位'
      case 'attributes': return '+ 新規属性'
    }
  }

  const getDescription = () => {
    switch (activeTab) {
      case 'categories': return 'アイテムのカテゴリマスタを管理します'
      case 'units': return '在庫数量の単位マスタを管理します'
      case 'attributes': return 'アイテムに付与できる属性マスタを管理します'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">マスタ管理</h1>
          <p className="mt-1 text-sm text-gray-500">{getDescription()}</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {getButtonLabel()}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      ) : (
        <>
          {/* Categories Table */}
          {activeTab === 'categories' && (
            <>
              {categories.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">カテゴリが登録されていません</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コード</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">説明</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日時</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{category.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{category.description || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(category.created_at).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEditCategory(category)} className="text-blue-600 hover:text-blue-900 mr-4">編集</button>
                            <button onClick={() => handleDeleteCategory(category.id, category.name)} className="text-red-600 hover:text-red-900">削除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Units Table */}
          {activeTab === 'units' && (
            <>
              {units.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">単位が登録されていません</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コード</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">説明</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日時</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {units.map((unit) => (
                        <tr key={unit.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{unit.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{unit.description || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(unit.created_at).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEditUnit(unit)} className="text-blue-600 hover:text-blue-900 mr-4">編集</button>
                            <button onClick={() => handleDeleteUnit(unit.id, unit.name)} className="text-red-600 hover:text-red-900">削除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Attributes Table */}
          {activeTab === 'attributes' && (
            <>
              {attributes.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">属性が登録されていません</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コード</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">値タイプ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">説明</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日時</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attributes.map((attribute) => (
                        <tr key={attribute.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{attribute.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attribute.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {valueTypeLabels[attribute.value_type]}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{attribute.description || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(attribute.created_at).toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEditAttribute(attribute)} className="text-blue-600 hover:text-blue-900 mr-4">編集</button>
                            <button onClick={() => handleDeleteAttribute(attribute.id, attribute.name)} className="text-red-600 hover:text-red-900">削除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Modals */}
      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false)
          setEditCategory(undefined)
        }}
        onSuccess={() => {
          fetchCategories()
        }}
        editData={editCategory}
      />

      <CreateUnitModal
        isOpen={isUnitModalOpen}
        onClose={() => {
          setIsUnitModalOpen(false)
          setEditUnit(undefined)
        }}
        onSuccess={() => {
          fetchUnits()
        }}
        editData={editUnit}
      />

      <CreateAttributeModal
        isOpen={isAttributeModalOpen}
        onClose={() => {
          setIsAttributeModalOpen(false)
          setEditAttribute(undefined)
        }}
        onSuccess={() => {
          fetchAttributes()
        }}
        editData={editAttribute}
      />
    </div>
  )
}
