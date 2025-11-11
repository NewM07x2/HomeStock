"use client"
import React from 'react'
import CategoryChart from '@/components/reports/CategoryChart'
import MonthlyUsageChart from '@/components/reports/MonthlyUsageChart'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">レポート</h1>
          <p className="mt-2 text-sm text-gray-600">
            在庫アイテムの統計情報と利用金額の推移を確認できます
          </p>
        </div>

        {/* レポートコンテンツ */}
        <div className="space-y-8">
          {/* カテゴリ別割合 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">カテゴリ別アイテム割合</h2>
              <p className="mt-1 text-sm text-gray-600">
                各カテゴリごとのアイテム数の割合を表示します
              </p>
            </div>
            <div className="p-6">
              <CategoryChart />
            </div>
          </div>

          {/* 月別利用金額推移 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">月別利用金額推移</h2>
              <p className="mt-1 text-sm text-gray-600">
                過去12ヶ月間の月別利用金額の推移を表示します
              </p>
            </div>
            <div className="p-6">
              <MonthlyUsageChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
