import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// サーバーサイドでは NEXT_PUBLIC_ プレフィックスのない環境変数を使用
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080'

// 月別利用金額APIエンドポイント
export async function GET(request: NextRequest) {
  try {
    console.log('[monthly-usage] APIベースURL:', API_BASE_URL)
    
    // バックエンドAPIから在庫履歴を取得
    const stockHistoryResponse = await axios.get(`${API_BASE_URL}/api/stock-history`, {
      params: {
        page: 1,
        limit: 10000 // 全件取得
      },
      timeout: 5000 // 5秒のタイムアウト
    })

    const histories = stockHistoryResponse.data.items || []
    console.log('[monthly-usage] 履歴データ取得成功:', histories.length, '件')

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

    // 履歴データから金額を集計
    histories.forEach((history: any) => {
      const createdAt = new Date(history.created_at)
      const monthKey = `${createdAt.getFullYear()}/${String(createdAt.getMonth() + 1).padStart(2, '0')}`
      
      if (monthlyData.hasOwnProperty(monthKey)) {
        // total_amountがある場合はそれを使用、なければ計算
        let amount = 0
        if (history.total_amount !== null && history.total_amount !== undefined) {
          amount = Math.abs(history.total_amount)
        } else if (history.unit_price !== null && history.unit_price !== undefined) {
          amount = Math.abs(history.qty_delta || 0) * (history.unit_price || 0)
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
