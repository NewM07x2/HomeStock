import React from 'react'
import Link from 'next/link'

export default function QuickLinks() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium mb-3">クイックリンク</h2>
      <ul className="space-y-2 text-sm">
        <li>
          <Link href="/items" className="text-blue-600">アイテム一覧</Link>
        </li>
        <li>
          <Link href="/bulk" className="text-blue-600">一括処理（CSV）</Link>
        </li>
        <li>
          <Link href="/items/new" className="text-blue-600">アイテム作成</Link>
        </li>
        <li>
          <Link href="/audit" className="text-blue-600">監査ログ</Link>
        </li>
      </ul>
    </div>
  )
}
