import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// カテゴリ別統計APIエンドポイント
export async function GET(request: NextRequest) {
  try {
    // バックエンドAPIからアイテムとカテゴリ情報を取得
    const itemsResponse = await axios.get(`${API_BASE_URL}/api/items`, {
      params: {
        page: 1,
        limit: 10000 // 全件取得
      }
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
