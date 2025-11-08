import { NextRequest, NextResponse } from 'next/server'

// アイテムの型定義
interface Item {
  id: string
  code: string
  name: string
  category_id?: string
  unit_id: string
  quantity?: number
  status: string
  created_at: string
  updated_at: string
  category?: {
    id: string
    code: string
    name: string
    description?: string
  }
  unit?: {
    id: string
    code: string
    name: string
    description?: string
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('[API /api/items] GET request received');
    
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const q = searchParams.get('q') || ''
    const code = searchParams.get('code') || ''
    const name = searchParams.get('name') || ''
    const categories = searchParams.get('categories') || ''
    const minQty = searchParams.get('minQty') || ''
    const maxQty = searchParams.get('maxQty') || ''

    console.log('[API /api/items] Query params:', {
      limit, page, q, code, name, categories, minQty, maxQty
    });

    // TODO: 実際のバックエンドAPIまたはデータベースから取得
    // const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    // const response = await fetch(`${apiBaseUrl}/api/items?limit=${limit}&page=${page}`)
    // const data = await response.json()
    
    // 全モックデータを生成
    const totalItems = 57
    const allMockItems: Item[] = []

    for (let i = 1; i <= totalItems; i++) {
      allMockItems.push({
        id: `item-${i}`,
        code: `SKU-${String(i).padStart(4, '0')}`,
        name: `サンプル品目 ${i}`,
        category_id: `cat-${(i % 3) + 1}`,
        unit_id: `unit-${(i % 2) + 1}`,
        quantity: Math.floor(Math.random() * 500),
        status: i % 10 === 0 ? 'inactive' : 'active',
        created_at: new Date(Date.now() - i * 86400000).toISOString(),
        updated_at: new Date(Date.now() - i * 43200000).toISOString(),
        category: {
          id: `cat-${(i % 3) + 1}`,
          code: ['HW', 'EC', 'CS'][(i % 3)],
          name: ['金具', '電子部品', '消耗品'][(i % 3)]
        },
        unit: {
          id: `unit-${(i % 2) + 1}`,
          code: ['pc', 'box'][(i % 2)],
          name: ['個', '箱'][(i % 2)]
        }
      })
    }

    // 検索フィルタリング
    let filteredItems = allMockItems

    // コードで検索
    if (code) {
      filteredItems = filteredItems.filter(item => 
        item.code.toLowerCase().includes(code.toLowerCase())
      )
    }

    // 名前で検索
    if (name) {
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(name.toLowerCase())
      )
    }

    // カテゴリで検索（カンマ区切りの複数選択対応）
    if (categories) {
      const categoryList = categories.split(',').map(c => c.trim())
      filteredItems = filteredItems.filter(item => 
        item.category && categoryList.includes(item.category.name)
      )
    }

    // 在庫数（最小）で検索
    if (minQty) {
      const min = parseInt(minQty)
      filteredItems = filteredItems.filter(item => 
        item.quantity !== undefined && item.quantity >= min
      )
    }

    // 在庫数（最大）で検索
    if (maxQty) {
      const max = parseInt(maxQty)
      filteredItems = filteredItems.filter(item => 
        item.quantity !== undefined && item.quantity <= max
      )
    }

    // 汎用検索（qパラメータ）
    if (q) {
      filteredItems = filteredItems.filter(item => 
        item.code.toLowerCase().includes(q.toLowerCase()) ||
        item.name.toLowerCase().includes(q.toLowerCase())
      )
    }

    // ページネーション
    const totalFiltered = filteredItems.length
    const start = (page - 1) * limit
    const paginatedItems = filteredItems.slice(start, start + limit)

    console.log('[API /api/items] Returning:', {
      itemsCount: paginatedItems.length,
      total: totalFiltered,
      page,
      limit
    });

    const response = {
      items: paginatedItems,
      total: totalFiltered,
      page,
      limit
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[API /api/items] Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // TODO: 実際のバックエンドAPIまたはデータベースに保存
    // const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    // const response = await fetch(`${apiBaseUrl}/api/items`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body)
    // })
    
    // モックレスポンス
    const newItem: Item = {
      id: `item-${Date.now()}`,
      code: body.code || `SKU-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      name: body.name || '無名アイテム',
      category_id: body.category_id,
      unit_id: body.unit_id || 'unit-1',
      quantity: body.quantity || 0,
      status: body.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}
