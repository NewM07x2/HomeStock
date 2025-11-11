import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// サーバーサイドでは NEXT_PUBLIC_ プレフィックスのない環境変数を使用
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080'

// カテゴリ別統計APIエンドポイント
export async function GET(request: NextRequest) {
  try {
    console.log('[category-stats] APIベースURL:', API_BASE_URL)
    
    // バックエンドAPIからアイテムとカテゴリ情報を取得
    const itemsResponse = await axios.get(`${API_BASE_URL}/api/items`, {
      params: {
        page: 1,
        limit: 10000 // 全件取得
      },
      timeout: 5000
    })

    const items = itemsResponse.data.items || []

    // カテゴリ別にアイテムをカウント
    const categoryCount: Record<string, number> = {}
    let totalCount = 0

    items.forEach((item: any) => {
      const categoryName = item.category?.name || '未分類'
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1
      totalCount++
    })

    // パーセンテージを計算して結果を作成
    const stats = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0
    }))

    // カウント数で降順ソート
    stats.sort((a, b) => b.count - a.count)

    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    console.error('カテゴリ統計の取得エラー:', error)
    return NextResponse.json(
      { error: 'カテゴリ統計の取得に失敗しました' },
      { status: 500 }
    )
  }
}
