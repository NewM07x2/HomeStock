import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// サーバーサイドでは NEXT_PUBLIC_ プレフィックスのない環境変数を使用
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080'

// 年別利用金額APIエンドポイント
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const baseYear = parseInt(searchParams.get('year') || String(new Date().getFullYear()))

    console.log('[yearly-usage] APIベースURL:', API_BASE_URL)
    console.log('[yearly-usage] 基準年:', baseYear)
    
    // バックエンドAPIからアイテムを取得
    const itemsResponse = await axios.get(`${API_BASE_URL}/api/items`, {
      params: {
        page: 1,
        limit: 10000 // 全件取得
      },
      timeout: 5000
    })

    const items = itemsResponse.data.items || []
    console.log('[yearly-usage] アイテムデータ取得成功:', items.length, '件')

    // 年別に集計（基準年から前後10年分）
    const yearlyData: Record<number, number> = {}
    const startYear = baseYear - 10
    const endYear = baseYear + 10

    for (let year = startYear; year <= endYear; year++) {
      yearlyData[year] = 0
    }

    // アイテムの登録日から金額を集計
    items.forEach((item: any) => {
      const createdAt = new Date(item.created_at)
      const year = createdAt.getFullYear()
      
      // 対象範囲内の年のみ集計
      if (year >= startYear && year <= endYear) {
        // 単価 × 数量で金額を計算
        let amount = 0
        if (item.unit_price !== null && item.unit_price !== undefined) {
          const quantity = item.quantity !== null && item.quantity !== undefined ? item.quantity : 1
          amount = item.unit_price * quantity
        }
        
        yearlyData[year] += amount
      }
    })

    console.log('[yearly-usage] 集計結果:', Object.entries(yearlyData).filter(([_, amount]) => amount > 0).length, '年分のデータ')

    // 結果を配列に変換
    const result = Object.entries(yearlyData).map(([year, amount]) => ({
      year,
      amount: Math.round(amount)
    }))

    // 年順にソート（降順）
    result.sort((a, b) => parseInt(b.year) - parseInt(a.year))

    console.log('[yearly-usage] レスポンス:', result.length, '年分')
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('年別利用金額の取得エラー:', error)
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      })
    }
    return NextResponse.json(
      { error: '年別利用金額の取得に失敗しました' },
      { status: 500 }
    )
  }
}
