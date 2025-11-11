"use client"
import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { fetchCategoryStats } from '@/lib/api'

type CategoryStat = {
  category: string
  count: number
  percentage: number
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1', // indigo
  '#84cc16', // lime
]

export default function CategoryChart() {
  const [data, setData] = useState<CategoryStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const stats = await fetchCategoryStats()
        if (!mounted) return
        setData(stats)
      } catch (err) {
        console.error('カテゴリ統計の取得に失敗しました:', err)
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

  // Rechartsで使用するデータ形式に変換
  const chartData = data.map(item => ({
    name: item.category,
    value: item.count,
    percentage: item.percentage
  }))

  // カスタムラベル表示
  const renderLabel = (entry: any) => {
    return `${entry.percentage.toFixed(1)}%`
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string, props: any) => [
              `${value}個 (${props.payload.percentage.toFixed(1)}%)`,
              name
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* データテーブル */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                カテゴリ
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                アイテム数
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                割合
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm text-gray-900 flex items-center">
                  <span 
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {item.category}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {item.count}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {item.percentage.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
