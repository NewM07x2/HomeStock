"use client"
import React, { useEffect, useState } from 'react'

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

  useEffect(() => {
    // 選択された月のデータを取得（モックデータ）
    const fetchMonthlyData = async () => {
      // TODO: 実際のAPIから取得する
      // const response = await fetch(`/api/monthly-summary?year=${year}&month=${month}`)
      // const data = await response.json()
      
      // モックデータ生成
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      
      const dailyAmounts: DailyAmount[] = []
      let total = 0
      
      // 月ごとに異なるシード値を使って再現性のあるランダムデータを生成
      const seed = year * 12 + month
      for (let i = 1; i <= daysInMonth; i++) {
        const amount = Math.floor((Math.sin(seed * 100 + i) * 10000 + 10000) / 4)
        dailyAmounts.push({ date: i, amount })
        total += amount
      }
      
      setMonthlyData({
        totalAmount: total,
        dailyAmounts
      })
    }
    
    fetchMonthlyData()
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


  // 今月かどうかをチェック
  const isCurrentMonth = () => {
    const now = new Date()
    return year === now.getFullYear() && month === now.getMonth()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">利用金額</h2>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(monthlyData.totalAmount)}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="next"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

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
    </div>
  )
}
