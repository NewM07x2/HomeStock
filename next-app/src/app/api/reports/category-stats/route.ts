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
    console.log('[category-stats] 取得したアイテム数:', items.length)

    if (items.length === 0) {
      console.log('[category-stats] アイテムが0件のため、空配列を返します')
      return NextResponse.json([], { status: 200 })
    }

    // カテゴリ別にアイテムをカウント
    const categoryCount: Record<string, number> = {}
    let totalCount = 0

    items.forEach((item: any) => {
      // categoryオブジェクトが存在する場合はその名前を、なければ「未分類」
      const categoryName = item.category?.name || '未分類'
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1
      totalCount++
    })

    console.log('[category-stats] カテゴリ別集計:', categoryCount)

    // パーセンテージを計算して結果を作成
    const stats = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0
    }))

    // カウント数で降順ソート
    stats.sort((a, b) => b.count - a.count)

    console.log('[category-stats] レスポンス:', stats)
    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    console.error('カテゴリ統計の取得エラー:', error)
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      })
    }
    return NextResponse.json(
      { error: 'カテゴリ統計の取得に失敗しました' },
      { status: 500 }
    )
  }
}
