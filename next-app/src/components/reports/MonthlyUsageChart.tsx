"use client"
import React, { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchMonthlyUsage } from '@/lib/api'

type MonthlyUsage = {
  month: string
  amount: number
}

export default function MonthlyUsageChart() {
  const [data, setData] = useState<MonthlyUsage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const [visibleCount, setVisibleCount] = useState(5) // 表示する行数

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const usage = await fetchMonthlyUsage()
        if (!mounted) return
        setData(usage)
        setVisibleCount(5) // データ更新時に表示件数をリセット
      } catch (err) {
        console.error('月別利用金額の取得に失敗しました:', err)
        if (mounted) {
          setError('データの取得に失敗しました')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadData()
    return () => { mounted = false }
  }, [])

  // さらに表示
  const handleShowMore = () => {
    setVisibleCount(prev => prev + 5)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">データがありません</div>
      </div>
    )
  }

  // 金額をフォーマット
  const formatAmount = (value: number) => {
    return `¥${value.toLocaleString()}`
  }

  // 表示するデータ（ページネーション適用）
  const visibleData = data.slice(0, visibleCount)
  const hasMore = visibleCount < data.length

  return (
    <div className="w-full">
      {/* グラフタイプ切り替え */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-l-lg transition-colors ${
              chartType === 'line'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            折れ線
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-r-lg transition-colors ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            棒グラフ
          </button>
        </div>
      </div>

      {/* グラフ */}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatAmount}
            />
            <Tooltip 
              formatter={(value: number) => formatAmount(value)}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="利用金額"
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatAmount}
            />
            <Tooltip 
              formatter={(value: number) => formatAmount(value)}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
            <Bar 
              dataKey="amount" 
              fill="#3b82f6" 
              name="利用金額"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>

      {/* データテーブル */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                月
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                利用金額
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visibleData.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.month}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                  {formatAmount(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t-2 border-gray-300">
            <tr>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                合計（表示分）
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                {formatAmount(visibleData.reduce((sum, item) => sum + item.amount, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
        
        {/* More ボタン */}
        {hasMore && (
          <div className="mt-4 text-center">
            <button
              onClick={handleShowMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              More...
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
