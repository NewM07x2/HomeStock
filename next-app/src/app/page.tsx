import React from 'react'
import SubHeader from '@/components/base/SubHeader'
import HomeHero from '@/components/home/HomeHero'
import MonthlySummary from '@/components/home/MonthlySummary'
import RecentItems from '@/components/home/RecentItems'

export default function Home() {
  return (
    <>
      {/* サブヘッダー */}
      <SubHeader
        title="ダッシュボード"
        searchPlaceholder="アイテムを検索..."
        userName="管理者"
      />

      {/* メインコンテンツ */}
      <div className="ml-6 mr-6">
        {/* コンテンツエリア */}
        <div className="space-y-6">
          {/* ヒーローセクション */}
          <div className="bg-white rounded-lg shadow">
            <HomeHero />
          </div>

          {/* メインコンテンツグリッド */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 最近のアイテム（2/3幅） */}
            <div className="lg:col-span-2">
              <RecentItems />
            </div>
            
            {/* 今月の利用金額（1/3幅） */}
            <aside className="lg:col-span-1">
              <MonthlySummary />
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}