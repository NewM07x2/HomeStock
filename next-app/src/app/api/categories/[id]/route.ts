import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log('[API /api/categories/:id] PUT request received for id:', id);

    const body = await request.json()
    console.log('[API /api/categories/:id] Request body:', body);

    // GoバックエンドAPIにデータを送信
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/categories/${id}`
    
    console.log('[API /api/categories/:id] Putting to backend:', backendUrl);
    
    const response = await axios.put(backendUrl, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    console.log('[API /api/categories/:id] Backend response:', response.data);

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('[API /api/categories/:id] Error updating category:', error)
    
    if (axios.isAxiosError(error)) {
      console.error('[API /api/categories/:id] Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      
      return NextResponse.json(
        { 
          error: error.response?.data?.error || 'Failed to update category',
          details: error.response?.data?.details || error.message
        },
        { status: error.response?.status || 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to update category', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log('[API /api/categories/:id] DELETE request received for id:', id);

    // GoバックエンドAPIにデータを送信
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/categories/${id}`
    
    console.log('[API /api/categories/:id] Deleting from backend:', backendUrl);
    
    await axios.delete(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    console.log('[API /api/categories/:id] Category deleted successfully');

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('[API /api/categories/:id] Error deleting category:', error)
    
    if (axios.isAxiosError(error)) {
      console.error('[API /api/categories/:id] Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      
      return NextResponse.json(
        { 
          error: error.response?.data?.error || 'Failed to delete category',
          details: error.response?.data?.details || error.message
        },
        { status: error.response?.status || 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to delete category', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
