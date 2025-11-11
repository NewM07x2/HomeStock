import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// サーバーサイドでは NEXT_PUBLIC_ プレフィックスのない環境変数を使用
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080'

// 月別利用金額APIエンドポイント
export async function GET(request: NextRequest) {
  try {
    console.log('[monthly-usage] APIベースURL:', API_BASE_URL)
    
    // バックエンドAPIからアイテムを取得
    const itemsResponse = await axios.get(`${API_BASE_URL}/api/items`, {
      params: {
        page: 1,
        limit: 10000 // 全件取得
      },
      timeout: 5000 // 5秒のタイムアウト
    })

    const items = itemsResponse.data.items || []
    console.log('[monthly-usage] アイテムデータ取得成功:', items.length, '件')

    // 月別に集計
    const monthlyData: Record<string, number> = {}

    // 過去12ヶ月のデータを初期化
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[monthKey] = 0
    }

    console.log('[monthly-usage] 初期化された月:', Object.keys(monthlyData))

    // アイテムの登録日から金額を集計
    items.forEach((item: any) => {
      const createdAt = new Date(item.created_at)
      const monthKey = `${createdAt.getFullYear()}/${String(createdAt.getMonth() + 1).padStart(2, '0')}`
      
      if (monthlyData.hasOwnProperty(monthKey)) {
        // 単価 × 数量で金額を計算
        let amount = 0
        if (item.unit_price !== null && item.unit_price !== undefined) {
          const quantity = item.quantity !== null && item.quantity !== undefined ? item.quantity : 1
          amount = item.unit_price * quantity
        }
        monthlyData[monthKey] += amount
      }
    })

    console.log('[monthly-usage] 集計結果:', monthlyData)

    // 結果を配列に変換
    const result = Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount: Math.round(amount)
    }))

    // 月順にソート
    result.sort((a, b) => a.month.localeCompare(b.month))

    console.log('[monthly-usage] レスポンス:', result)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('月別利用金額の取得エラー:', error)
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      })
    }
    return NextResponse.json(
      { error: '月別利用金額の取得に失敗しました' },
      { status: 500 }
    )
  }
}
