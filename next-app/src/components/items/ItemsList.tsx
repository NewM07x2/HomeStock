"use client"
import React, { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import CreateButton from './CreateButton'
import Pagination from './Pagination'
import BulkJISRegisterModal from './BulkJISRegisterModal'
import { fetchItemsWithSearch, fetchCategories, type Category } from '@/lib/api'
import { useRefresh } from '@/components/ui/RefreshContext'
import { useModal } from '@/components/ui/ModalProvider'
import Select, { MultiValue } from 'react-select'

type Item = {
  id: string
  code: string
  name: string
  category?: string
  qty: number
  unit_price?: number
}

type SearchConditions = {
  code: string
  name: string
  categories: string[]
  minQty: string
  maxQty: string
}

type CategoryOption = {
  value: string
  label: string
}

export default function ItemsList() {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const limit = 10

  // 検索条件（即座に検索が実行される）
  const [searchConditions, setSearchConditions] = useState<SearchConditions>({
    code: '',
    name: '',
    categories: [],
    minQty: '',
    maxQty: '',
  })

  const { refreshCount } = useRefresh()

  // モバイルデバイスの判定
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
    // リサイズ時にも再チェック（念のため）
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // カテゴリマスタをAPIから取得
  useEffect(() => {
    let mounted = true
    
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        if (!mounted) return
        setCategories(data)
        // react-select用のオプションを作成
        const options = data.map(cat => ({
          value: cat.code,
          label: cat.name
        }))
        setCategoryOptions(options)
      } catch (err) {
        console.error('カテゴリの取得に失敗しました:', err)
      }
    }
    
    loadCategories()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    // 検索条件をクエリパラメータに変換
    const params: any = { page, limit }
    if (searchConditions.code) params.code = searchConditions.code
    if (searchConditions.name) params.name = searchConditions.name
    if (searchConditions.categories.length > 0) params.categories = searchConditions.categories.join(',')
    if (searchConditions.minQty) params.minQty = searchConditions.minQty
    if (searchConditions.maxQty) params.maxQty = searchConditions.maxQty

    fetchItemsWithSearch(params).then(res => {
      if (!mounted) return
      setItems(res.items.map((item: any) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        category: item.category?.name,
        qty: item.quantity || 0,
        unit_price: item.unit_price
      })))
      setTotal(res.total)
    }).catch(err => {
      console.error('アイテムの取得に失敗しました:', err)
      if (mounted) {
        setItems([])
        setTotal(0)
      }
    })
    return () => { mounted = false }
  }, [searchConditions, page, limit, refreshCount])

  // バーコード読み取り後の処理
  const handleBulkScan = (decodedText: string) => {
    console.log('読み取ったコード:', decodedText)
    // 新規登録モーダルを開き、コードを設定
    window.dispatchEvent(new CustomEvent('open-item-detail', { 
      detail: { 
        id: null, 
        editable: true,
        initialCode: decodedText 
      } 
    }))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 検索エリア */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">検索条件</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                onBlur={() => setPage(1)}
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
                onBlur={() => setPage(1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* カテゴリ選択 */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ（複数選択可）
              </label>
              <Select<CategoryOption, true>
                instanceId="category-select"
                isMulti
                options={categoryOptions}
                value={categoryOptions.filter(option => 
                  searchConditions.categories.includes(option.value)
                )}
                onChange={(selectedOptions: MultiValue<CategoryOption>) => {
                  const codes = selectedOptions ? selectedOptions.map((option: CategoryOption) => option.value) : []
                  setSearchConditions(prev => ({ ...prev, categories: codes }))
                  setPage(1)
                }}
                placeholder="カテゴリを選択してください"
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() => 'カテゴリがありません'}
                isClearable
                styles={{
                  control: (base: any, state: any) => ({
                    ...base,
                    minHeight: '42px',
                    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
                    '&:hover': {
                      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db'
                    },
                    borderRadius: '0.5rem',
                    paddingLeft: '0.5rem',
                    paddingRight: '0.5rem'
                  }),
                  menu: (base: any) => ({
                    ...base,
                    backgroundColor: '#ffffff'
                  }),
                  option: (base: any, state: any) => ({
                    ...base,
                    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#dbeafe' : '#ffffff',
                    color: state.isSelected ? '#ffffff' : '#1e40af',
                    ':active': {
                      backgroundColor: '#93c5fd'
                    }
                  }),
                  multiValue: (base: any) => ({
                    ...base,
                    backgroundColor: '#dbeafe',
                    borderRadius: '0.375rem'
                  }),
                  multiValueLabel: (base: any) => ({
                    ...base,
                    color: '#1e40af',
                    paddingLeft: '0.5rem',
                    paddingRight: '0.5rem'
                  }),
                  multiValueRemove: (base: any) => ({
                    ...base,
                    color: '#1e40af',
                    ':hover': {
                      backgroundColor: '#93c5fd',
                      color: '#1e3a8a'
                    }
                  })
                }}
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
                onBlur={() => setPage(1)}
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
                onBlur={() => setPage(1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 検索結果エリア */}
      <div className="bg-white rounded-lg shadow">
        {/* ヘッダー */}
        <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">検索結果</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            {isMobile && (
              <button
                onClick={() => setBulkModalOpen(true)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                一括JIS登録
              </button>
            )}
            <div className="flex-1 sm:flex-none">
              <CreateButton />
            </div>
          </div>
        </div>

      {/* アイテムリスト - スマホではカード表示、デスクトップはテーブル */}
      
      {/* カード表示（スマホ） */}
      <div className="md:hidden divide-y divide-gray-200">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            データがありません
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="px-4 py-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-item-detail', { detail: { id: item.id, editable: true } }))} 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  {item.code}
                </button>
                <span className="text-xs text-gray-500">{item.category ?? '-'}</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-gray-500">在庫: </span>
                  <span className="font-medium text-gray-900">{item.qty}</span>
                </div>
                <div>
                  <span className="text-gray-500">金額: </span>
                  <span className="font-medium text-gray-900">
                    {item.unit_price ? `¥${Math.floor(item.unit_price)}` : '-'}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-item-detail', { detail: { id: item.id, editable: true } }))}
                  className="flex-1 text-blue-600 hover:text-blue-800 text-sm py-1 px-3 border border-blue-600 rounded hover:bg-blue-50"
                >
                  詳細
                </button>
                <button className="flex-1 text-red-600 hover:text-red-800 text-sm py-1 px-3 border border-red-600 rounded hover:bg-red-50">
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* テーブル表示（中画面以上） */}
      <div className="hidden md:block overflow-x-auto">
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
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                金額
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
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
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                    {item.unit_price ? `¥${Math.floor(item.unit_price)}` : '-'}
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
      <div className="px-3 sm:px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-700">
            <span className="font-medium">{total}</span> 件のアイテム
          </div>
          <Pagination page={page} total={total} limit={limit} onChange={p => setPage(p)} />
        </div>
      </div>
      </div>

      {/* バーコード/QR読み取りモーダル */}
      <BulkJISRegisterModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onScan={handleBulkScan}
      />
    </div>
  )
}
