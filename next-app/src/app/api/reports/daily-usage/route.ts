import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// サーバーサイドでは NEXT_PUBLIC_ プレフィックスのない環境変数を使用
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080'

// 日付別利用金額APIエンドポイント
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1))

    console.log('[daily-usage] APIベースURL:', API_BASE_URL)
    console.log('[daily-usage] リクエストパラメータ:', { year, month })
    
    // バックエンドAPIからアイテムを取得
    const itemsResponse = await axios.get(`${API_BASE_URL}/api/items`, {
      params: {
        page: 1,
        limit: 10000 // 全件取得
      },
      timeout: 5000
    })

    const items = itemsResponse.data.items || []
    console.log('[daily-usage] アイテムデータ取得成功:', items.length, '件')

    // 指定された年月の日付範囲を計算
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)
    const daysInMonth = endDate.getDate()

    // 日別に集計（1日から月末まで）
    const dailyData: Record<number, number> = {}
    for (let i = 1; i <= daysInMonth; i++) {
      dailyData[i] = 0
    }

    // アイテムの登録日から金額を集計
    items.forEach((item: any) => {
      const createdAt = new Date(item.created_at)
      
      // 指定された年月の範囲内かチェック
      if (createdAt >= startDate && createdAt <= endDate) {
        const day = createdAt.getDate()
        
        // 単価 × 数量で金額を計算
        let amount = 0
        if (item.unit_price !== null && item.unit_price !== undefined) {
          const quantity = item.quantity !== null && item.quantity !== undefined ? item.quantity : 1
          amount = item.unit_price * quantity
        }
        
        dailyData[day] += amount
      }
    })

    console.log('[daily-usage] 集計結果:', Object.entries(dailyData).filter(([_, amount]) => amount > 0).length, '日分のデータ')

    // 結果を配列に変換
    const result = Object.entries(dailyData).map(([date, amount]) => ({
      date,
      amount: Math.round(amount)
    }))

    // 日付順にソート
    result.sort((a, b) => parseInt(a.date) - parseInt(b.date))

    console.log('[daily-usage] レスポンス:', result.length, '日分')
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('日付別利用金額の取得エラー:', error)
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      })
    }
    return NextResponse.json(
      { error: '日付別利用金額の取得に失敗しました' },
      { status: 500 }
    )
  }
}
