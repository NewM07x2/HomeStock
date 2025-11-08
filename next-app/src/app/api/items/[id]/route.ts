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

// 簡易的なインメモリストレージ（実際はDBから取得）
const generateMockItem = (id: string): Item => {
  const itemIndex = parseInt(id.replace('item-', ''))
  return {
    id,
    code: `SKU-${String(itemIndex).padStart(4, '0')}`,
    name: `サンプル品目 ${itemIndex}`,
    category_id: `cat-${(itemIndex % 3) + 1}`,
    unit_id: `unit-${(itemIndex % 2) + 1}`,
    quantity: Math.floor(Math.random() * 500),
    status: itemIndex % 10 === 0 ? 'inactive' : 'active',
    created_at: new Date(Date.now() - itemIndex * 86400000).toISOString(),
    updated_at: new Date(Date.now() - itemIndex * 43200000).toISOString(),
    category: {
      id: `cat-${(itemIndex % 3) + 1}`,
      code: ['HW', 'EC', 'CS'][(itemIndex % 3)],
      name: ['金具', '電子部品', '消耗品'][(itemIndex % 3)]
    },
    unit: {
      id: `unit-${(itemIndex % 2) + 1}`,
      code: ['pc', 'box'][(itemIndex % 2)],
      name: ['個', '箱'][(itemIndex % 2)]
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // TODO: 実際のバックエンドAPIまたはデータベースから取得
    // const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    // const response = await fetch(`${apiBaseUrl}/api/items/${id}`)
    // const data = await response.json()

    // モックデータを返す
    const item = generateMockItem(id)

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching item:', error)
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

    // TODO: 実際のバックエンドAPIまたはデータベースを更新
    // const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    // const response = await fetch(`${apiBaseUrl}/api/items/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body)
    // })

    // モックレスポンス（更新されたデータを返す）
    const updatedItem = {
      ...generateMockItem(id),
      ...body,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating item:', error)
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

    // TODO: 実際のバックエンドAPIまたはデータベースから削除
    // const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    // const response = await fetch(`${apiBaseUrl}/api/items/${id}`, {
    //   method: 'DELETE'
    // })

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
