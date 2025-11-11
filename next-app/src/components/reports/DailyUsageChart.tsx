"use client"
import React, { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchDailyUsage } from '@/lib/api'

type DailyUsage = {
  date: string
  amount: number
}

export default function DailyUsageChart() {
  const [data, setData] = useState<DailyUsage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const [visibleCount, setVisibleCount] = useState(5) // ページング用の表示件数
  
  // 現在の年月を初期値として設定
  const now = new Date()
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1) // 1-12

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const usage = await fetchDailyUsage(selectedYear, selectedMonth)
        if (!mounted) return
        setData(usage)
        setVisibleCount(5) // データ変更時にページングをリセット
      } catch (err) {
        console.error('日付別利用金額の取得に失敗しました:', err)
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
  }, [selectedYear, selectedMonth])

  // Moreボタンのハンドラー
  const handleShowMore = () => {
    setVisibleCount(prev => prev + 5)
  }

  // 年の選択肢を生成（過去5年分）
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i)
    }
    return years
  }

  // 月の選択肢
  const months = [
    { value: 1, label: '1月' },
    { value: 2, label: '2月' },
    { value: 3, label: '3月' },
    { value: 4, label: '4月' },
    { value: 5, label: '5月' },
    { value: 6, label: '6月' },
    { value: 7, label: '7月' },
    { value: 8, label: '8月' },
    { value: 9, label: '9月' },
    { value: 10, label: '10月' },
    { value: 11, label: '11月' },
    { value: 12, label: '12月' },
  ]

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
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-gray-500 mb-4">データがありません</div>
        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {generateYearOptions().map(year => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  // 金額をフォーマット
  const formatAmount = (value: number) => {
    return `¥${value.toLocaleString()}`
  }

  // 表示用データと残りデータの計算
  const visibleData = data.slice(0, visibleCount)
  const hasMore = visibleCount < data.length

  return (
    <div className="w-full">
      {/* 年月選択とグラフタイプ切り替え */}
      <div className="flex justify-between items-center mb-4">
        {/* 年月選択 */}
        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {generateYearOptions().map(year => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>

        {/* グラフタイプ切り替え */}
        <div className="inline-flex rounded-lg border border-gray-300 bg-white">
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
              chartType === 'line'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            折れ線グラフ
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
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
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              label={{ value: '日', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatAmount}
            />
            <Tooltip 
              formatter={(value: number) => formatAmount(value)}
              labelStyle={{ color: '#374151' }}
              labelFormatter={(label: string) => `${label}日`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="利用金額"
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              label={{ value: '日', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatAmount}
            />
            <Tooltip 
              formatter={(value: number) => formatAmount(value)}
              labelStyle={{ color: '#374151' }}
              labelFormatter={(label: string) => `${label}日`}
            />
            <Legend />
            <Bar 
              dataKey="amount" 
              fill="#3b82f6" 
              name="利用金額"
              radius={[4, 4, 0, 0]}
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
                日付
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                利用金額
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visibleData.map((item, index) => (
              <tr key={index} className={item.amount > 0 ? '' : 'opacity-50'}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {selectedYear}年{selectedMonth}月{item.date}日
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
