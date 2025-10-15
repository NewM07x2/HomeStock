import React from 'react'

export default function HomeHero() {
  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold mb-2">在庫管理アプリ</h1>
      <p className="text-gray-600">現場在庫の可視化と棚卸し効率化を目的としたシンプルな管理ダッシュボードです。</p>
      <div className="mt-4">
        <p className="text-sm text-gray-500">機能: アイテム一覧、在庫詳細、CSV一括登録、監査ログ</p>
      </div>
    </section>
  )
}
