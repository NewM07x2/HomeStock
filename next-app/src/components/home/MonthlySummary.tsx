"use client"
import React, { useEffect, useState } from 'react'
import { fetchMonthlySummary } from '@/lib/api'

interface DailyAmount {
  date: number
  amount: number
}

interface MonthlyData {
  totalAmount: number
  dailyAmounts: DailyAmount[]
}

export default function MonthlySummary() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({
    totalAmount: 0,
    dailyAmounts: []
  })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 選択された月のデータを取得
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        
        // APIからデータを取得
        const data = await fetchMonthlySummary(year, month)
        
        setMonthlyData({
          totalAmount: data.totalAmount,
          dailyAmounts: data.dailyAmounts
        })
      } catch (err) {
        console.error('Failed to fetch monthly summary:', err)
        setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : String(err)}`)
        
        // エラー時は空のデータをセット（モックデータは表示しない）
        setMonthlyData({
          totalAmount: 0,
          dailyAmounts: []
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [currentDate])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  
  // カレンダーのグリッド生成
  const calendarGrid: (number | null)[] = []
  
  // 月初の空白
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.push(null)
  }
  
  // 日付を追加
  for (let i = 1; i <= daysInMonth; i++) {
    calendarGrid.push(i)
  }

  const getDailyAmount = (date: number): number => {
    const dayData = monthlyData.dailyAmounts.find(d => d.date === date)
    return dayData?.amount || 0
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount)
  }

  const getColorClass = (amount: number): string => {
    if (amount === 0) return 'bg-gray-50 text-gray-400'
    if (amount < 1000) return 'bg-blue-50 text-blue-700'
    if (amount < 3000) return 'bg-green-50 text-green-700'
    if (amount < 5000) return 'bg-yellow-50 text-yellow-700'
    return 'bg-red-50 text-red-700'
  }

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const dayNames = ['日', '月', '火', '水', '木', '金', '土']

  // 前月・次月への移動
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToCurrentMonth = () => {
    setCurrentDate(new Date())
  }

  // 今月かどうかをチェック
  const isCurrentMonth = () => {
    const now = new Date()
    return year === now.getFullYear() && month === now.getMonth()
  }

  // 次月ボタンを無効にするかどうか（現在月以降は無効）
  const isNextMonthDisabled = () => {
    return isCurrentMonth()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">利用金額</h2>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {loading ? (
                <span className="text-gray-400">読込中...</span>
              ) : (
                formatCurrency(monthlyData.totalAmount)
              )}
            </div>
          </div>
        </div>
        
        {/* エラー表示 */}
        {error && (
          <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        
        <div className="">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousMonth}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="prev"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-700 min-w-[120px] text-center">
              {year}年 {monthNames[month]}
            </span>
            <button
              onClick={goToNextMonth}
              disabled={isNextMonthDisabled() || loading}
              className={`p-2 rounded-full transition-colors ${
                isNextMonthDisabled() || loading
                  ? 'cursor-not-allowed opacity-40'
                  : 'hover:bg-gray-100'
              }`}
              aria-label="next"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ローディング表示 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* カレンダー */}
          <div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className={`text-center text-xs font-semibold py-2 ${
                index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarGrid.map((date, index) => {
            if (date === null) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const amount = getDailyAmount(date)
            const isToday = 
              date === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear()

            return (
              <div
                key={date}
                className={`
                  aspect-square rounded-lg p-1 flex flex-col items-center justify-center
                  transition-all hover:scale-105 cursor-pointer
                  ${getColorClass(amount)}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                `}
                title={`${date}日: ${formatCurrency(amount)}`}
              >
                <div className="text-xs font-semibold">{date}</div>
                <div className="text-[10px] font-medium">
                  {amount > 0 ? `¥${amount.toLocaleString()}` : '-'}
                </div>
              </div>
            )
          })}
        </div>

        {/* 凡例 */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 mb-2">金額範囲:</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gray-50 border border-gray-200"></div>
              <span>¥0</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200"></div>
              <span>¥1-999</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-50 border border-green-200"></div>
              <span>¥1,000-2,999</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-50 border border-yellow-200"></div>
              <span>¥3,000-4,999</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-50 border border-red-200"></div>
              <span>¥5,000+</span>
            </div>
          </div>
        </div>
          </div>
        </>
      )}
    </div>
  )
}
