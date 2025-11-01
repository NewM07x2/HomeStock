"use client"
import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import CreateButton from './CreateButton'
import Pagination from './Pagination'
import { fetchItems as mockFetchItems } from '@/lib/mockApi'
import { fetchCategories } from '@/lib/api'
import { useRefresh } from '@/components/ui/RefreshContext'
import { useModal } from '@/components/ui/ModalProvider'

type Item = {
  id: string
  code: string
  name: string
  category?: string
  qty: number
}

type SearchConditions = {
  code: string
  name: string
  categories: string[]
  minQty: string
  maxQty: string
}

export default function ItemsList() {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  // 検索条件
  const [searchConditions, setSearchConditions] = useState<SearchConditions>({
    code: '',
    name: '',
    categories: [],
    minQty: '',
    maxQty: '',
  })

  // 検索実行用の条件（検索ボタンを押したときに更新）
  const [appliedConditions, setAppliedConditions] = useState<SearchConditions>({
    code: '',
    name: '',
    categories: [],
    minQty: '',
    maxQty: '',
  })

  const { refreshCount } = useRefresh()

  // カテゴリマスタをAPIから取得
  useEffect(() => {
    let mounted = true
    
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        if (!mounted) return
        setCategories(data)
      } catch (err) {
        console.error('カテゴリの取得に失敗しました:', err)
      }
    }
    
    loadCategories()
    return () => { mounted = false }
  }, [])

  // 検索実行
  const handleSearch = () => {
    setAppliedConditions({ ...searchConditions })
    setPage(1)
  }

  // 検索条件クリア
  const handleClearSearch = () => {
    const emptyConditions = {
      code: '',
      name: '',
      categories: [],
      minQty: '',
      maxQty: '',
    }
    setSearchConditions(emptyConditions)
    setAppliedConditions(emptyConditions)
    setPage(1)
  }

  // カテゴリ選択のトグル
  const toggleCategory = (category: string) => {
    setSearchConditions(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  useEffect(() => {
    let mounted = true
    // 検索条件をクエリパラメータに変換
    const params: any = { page, limit }
    if (appliedConditions.code) params.code = appliedConditions.code
    if (appliedConditions.name) params.name = appliedConditions.name
    if (appliedConditions.categories.length > 0) params.categories = appliedConditions.categories.join(',')
    if (appliedConditions.minQty) params.minQty = appliedConditions.minQty
    if (appliedConditions.maxQty) params.maxQty = appliedConditions.maxQty

    mockFetchItems(params).then(res => {
      if (!mounted) return
      setItems(res.items)
      setTotal(res.total)
    })
    return () => { mounted = false }
  }, [appliedConditions, page, refreshCount])

  return (
    <div className="space-y-6">
      {/* 検索エリア */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">検索条件</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* アイテムコード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                アイテムコード
              </label>
              <input
                type="text"
                placeholder="コードで検索..."
                value={searchConditions.code}
                onChange={(e) => setSearchConditions(prev => ({ ...prev, code: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* アイテム名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                アイテム名
              </label>
              <input
                type="text"
                placeholder="名前で検索..."
                value={searchConditions.name}
                onChange={(e) => setSearchConditions(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 在庫数（最小） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                在庫数（最小）
              </label>
              <input
                type="number"
                placeholder="0"
                value={searchConditions.minQty}
                onChange={(e) => setSearchConditions(prev => ({ ...prev, minQty: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 在庫数（最大） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                在庫数（最大）
              </label>
              <input
                type="number"
                placeholder="999999"
                value={searchConditions.maxQty}
                onChange={(e) => setSearchConditions(prev => ({ ...prev, maxQty: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* カテゴリ選択 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリ（複数選択可）
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    searchConditions.categories.includes(category)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 検索ボタン */}
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              検索
            </button>
            <button
              onClick={handleClearSearch}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              クリア
            </button>
          </div>
        </div>
      </div>

      {/* 検索結果エリア */}
      <div className="bg-white rounded-lg shadow">
        {/* ヘッダー */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">検索結果</h2>
          <CreateButton />
        </div>

      {/* アイテムリスト */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                コード
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                カテゴリ
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                在庫数
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  データがありません
                </td>
              </tr>
            ) : (
              items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('open-item-detail', { detail: { id: item.id, editable: true } }))} 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {item.code}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.category ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                    {item.qty}
                  </td>
                  <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('open-item-detail', { detail: { id: item.id, editable: true } }))}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      詳細
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      削除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{total}</span> 件のアイテム
          </div>
          <Pagination page={page} total={total} limit={limit} onChange={p => setPage(p)} />
        </div>
      </div>
      </div>
    </div>
  )
}
