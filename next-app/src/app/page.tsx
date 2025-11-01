import React from 'react'
import HomeHero from '@/components/home/HomeHero'
import QuickLinks from '@/components/home/QuickLinks'
import RecentItems from '@/components/home/RecentItems'

export default function Home() {
  return (
    <div className="h-full p-6">
      {/* ページヘッダー */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-1 text-sm text-gray-600">
          在庫管理システムの概要を確認できます
        </p>
      </div>

      {/* コンテンツエリア */}
      <div className="space-y-6">
        {/* ヒーローセクション */}
        <div className="bg-white rounded-lg shadow p-6">
          <HomeHero />
        </div>

        {/* メインコンテンツグリッド */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 最近のアイテム（2/3幅） */}
          <div className="lg:col-span-2">
            <RecentItems />
          </div>
          
          {/* クイックリンク（1/3幅） */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <QuickLinks />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}