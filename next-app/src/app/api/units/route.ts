import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  try {
    console.log('[API /api/units] GET request received');

    // GoバックエンドAPIからデータを取得
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/units`
    
    console.log('[API /api/units] Fetching from backend:', backendUrl);
    
    const response = await axios.get(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    console.log('[API /api/units] Backend response:', {
      count: response.data?.length || 0
    });

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('[API /api/units] Error fetching units:', error)
    
    if (axios.isAxiosError(error)) {
      console.error('[API /api/units] Axios error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch units', 
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
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/units`
    
    const response = await axios.post(backendUrl, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || '単位の登録に失敗しました'
      
      return NextResponse.json(
        { error: errorMessage },
        { status: error.response?.status || 500 }
      )
    }
    return NextResponse.json({ error: '単位の登録に失敗しました' }, { status: 500 })
  }
}
