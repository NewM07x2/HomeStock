import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1))

    // TODO: 実際のデータベースからデータを取得
    // 現在は、stock_history テーブルの meta フィールドに price 情報があると仮定するか、
    // 別途価格テーブルを作成する必要があります
    
    // モックデータを生成（実際のDB実装まで）
    const daysInMonth = new Date(year, month, 0).getDate()
    const dailyAmounts: { date: number; amount: number }[] = []
    let totalAmount = 0

    // 月ごとに再現性のあるデータを生成
    const seed = year * 12 + (month - 1)
    for (let i = 1; i <= daysInMonth; i++) {
      const amount = Math.floor((Math.sin(seed * 100 + i) * 10000 + 10000) / 4)
      dailyAmounts.push({ date: i, amount })
      totalAmount += amount
    }

    const response = {
      year,
      month: month - 1, // JavaScriptの月は0-11なので調整
      totalAmount,
      dailyAmounts
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching monthly summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monthly summary' },
      { status: 500 }
    )
  }
}
