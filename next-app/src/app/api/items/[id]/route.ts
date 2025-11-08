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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log(`[API /api/items/${id}] GET request received`);

    // GoバックエンドAPIからデータを取得
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/items/${id}`
    
    console.log(`[API /api/items/${id}] Fetching from backend:`, backendUrl);

    const response = await axios.get(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    console.log(`[API /api/items/${id}] Backend response:`, response.data);

    return NextResponse.json(response.data)
  } catch (error) {
    console.error(`[API /api/items] Error fetching item:`, error)
    
    if (axios.isAxiosError(error)) {
      console.error('[API /api/items] Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // 404の場合は適切なステータスコードを返す
      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    console.log(`[API /api/items/${id}] PUT request received:`, body);

    // GoバックエンドAPIを更新
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/items/${id}`
    
    console.log(`[API /api/items/${id}] Updating at backend:`, backendUrl);

    const response = await axios.put(backendUrl, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    console.log(`[API /api/items/${id}] Backend response:`, response.data);

    return NextResponse.json(response.data)
  } catch (error) {
    console.error(`[API /api/items] Error updating item:`, error)
    
    if (axios.isAxiosError(error)) {
      console.error('[API /api/items] Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    console.log(`[API /api/items/${id}] DELETE request received`);

    // GoバックエンドAPIから削除
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/items/${id}`
    
    console.log(`[API /api/items/${id}] Deleting at backend:`, backendUrl);

    await axios.delete(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    console.log(`[API /api/items/${id}] Successfully deleted`);

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error(`[API /api/items] Error deleting item:`, error)
    
    if (axios.isAxiosError(error)) {
      console.error('[API /api/items] Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
