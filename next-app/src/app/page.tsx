import React from 'react'
import SubHeader from '@/components/base/SubHeader'
import HomeHero from '@/components/home/HomeHero'
import QuickLinks from '@/components/home/QuickLinks'
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
      <div className="p-6">
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
    </>
  )
}