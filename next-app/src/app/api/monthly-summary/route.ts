import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// サーバーサイドでは NEXT_PUBLIC_ プレフィックスのない環境変数を使用
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1))

    console.log('[API /api/monthly-summary] GET request received:', { year, month, API_BASE_URL });

    // バックエンドAPIからアイテムを取得
    const itemsResponse = await axios.get(`${API_BASE_URL}/api/items`, {
      params: {
        page: 1,
        limit: 10000
      },
      timeout: 5000
    })

    const items = itemsResponse.data.items || []
    console.log('[API /api/monthly-summary] アイテムデータ取得成功:', items.length, '件')

    // 指定された年月の日付範囲を計算
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)
    const daysInMonth = endDate.getDate()

    // 日別の金額を初期化
    const dailyAmounts: Record<number, number> = {}
    for (let i = 1; i <= daysInMonth; i++) {
      dailyAmounts[i] = 0
    }

    let totalAmount = 0

    // アイテムの登録日と単価から金額を集計
    items.forEach((item: any) => {
      const createdAt = new Date(item.created_at)
      
      // 指定された年月の範囲内かチェック
      if (createdAt >= startDate && createdAt <= endDate) {
        const day = createdAt.getDate()
        
        // 金額を計算（単価 × 数量）
        let amount = 0
        if (item.unit_price !== null && item.unit_price !== undefined) {
          const quantity = item.quantity !== null && item.quantity !== undefined ? item.quantity : 1
          amount = item.unit_price * quantity
        }
        
        dailyAmounts[day] += amount
        totalAmount += amount
      }
    })

    // レスポンス形式に変換
    const response = {
      year,
      month, // パラメータで受け取った月をそのまま返す（1-12）
      totalAmount: Math.round(totalAmount),
      dailyAmounts: Object.entries(dailyAmounts).map(([date, amount]) => ({
        date: parseInt(date),
        amount: Math.round(amount)
      }))
    }

    console.log('[API /api/monthly-summary] レスポンス:', { 
      totalAmount: response.totalAmount, 
      days: response.dailyAmounts.length,
      itemsInMonth: items.filter((item: any) => {
        const createdAt = new Date(item.created_at)
        return createdAt >= startDate && createdAt <= endDate
      }).length
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('[API /api/monthly-summary] Error fetching monthly summary:', error)
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      })
    }
    return NextResponse.json(
      { error: 'Failed to fetch monthly summary' },
      { status: 500 }
    )
  }
}