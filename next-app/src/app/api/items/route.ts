import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

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

    // GoバックエンドAPIからデータを取得
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/items?limit=${limit}&page=${page}`
    
    console.log('[API /api/items] Fetching from backend:', backendUrl);
    
    const response = await axios.get(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      // タイムアウト設定
      timeout: 10000,
    })

    console.log('[API /api/items] Backend response:', {
      itemsCount: response.data.items?.length || 0,
      total: response.data.total
    });

    // フロントエンド側でのフィルタリング（オプション）
    let filteredItems = response.data.items || []

    // コードで検索
    if (code) {
      filteredItems = filteredItems.filter((item: Item) => 
        item.code.toLowerCase().includes(code.toLowerCase())
      )
    }

    // 名前で検索
    if (name) {
      filteredItems = filteredItems.filter((item: Item) => 
        item.name.toLowerCase().includes(name.toLowerCase())
      )
    }

    // カテゴリで検索（カンマ区切りの複数選択対応）
    if (categories) {
      const categoryList = categories.split(',').map(c => c.trim())
      filteredItems = filteredItems.filter((item: Item) => 
        item.category && categoryList.includes(item.category.name)
      )
    }

    // 在庫数（最小）で検索
    if (minQty) {
      const min = parseInt(minQty)
      filteredItems = filteredItems.filter((item: Item) => 
        item.quantity !== undefined && item.quantity >= min
      )
    }

    // 在庫数（最大）で検索
    if (maxQty) {
      const max = parseInt(maxQty)
      filteredItems = filteredItems.filter((item: Item) => 
        item.quantity !== undefined && item.quantity <= max
      )
    }

    // 汎用検索（qパラメータ）
    if (q) {
      filteredItems = filteredItems.filter((item: Item) => 
        item.code.toLowerCase().includes(q.toLowerCase()) ||
        item.name.toLowerCase().includes(q.toLowerCase())
      )
    }

    console.log('[API /api/items] After filtering:', {
      itemsCount: filteredItems.length,
      filters: { code, name, categories, minQty, maxQty, q }
    });

    const responseData = {
      items: filteredItems,
      total: filteredItems.length,
      page,
      limit
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('[API /api/items] Error fetching items:', error)
    
    // Axiosエラーの詳細をログ出力
    if (axios.isAxiosError(error)) {
      console.error('[API /api/items] Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch items', 
        details: axios.isAxiosError(error) 
          ? `${error.message} (${error.response?.status || 'No response'})` 
          : error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('[API /api/items] POST request received:', body);

    // GoバックエンドAPIに保存
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/items`
    
    console.log('[API /api/items] Creating at backend:', backendUrl);

    const response = await axios.post(backendUrl, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    console.log('[API /api/items] Created item:', response.data);
    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    console.error('[API /api/items] Error creating item:', error)
    
    if (axios.isAxiosError(error)) {
      console.error('[API /api/items] Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create item',
        details: axios.isAxiosError(error) 
          ? `${error.message} (${error.response?.status || 'No response'})` 
          : error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
