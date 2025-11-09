import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/categories`
    
    const response = await axios.get(backendUrl, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('[API /api/categories] GET error:', error)
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: 'カテゴリの取得に失敗しました' },
        { status: error.response?.status || 500 }
      )
    }
    return NextResponse.json({ error: 'カテゴリの取得に失敗しました' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/categories`
    
    const response = await axios.post(backendUrl, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || 'カテゴリの登録に失敗しました'
      
      return NextResponse.json(
        { error: errorMessage },
        { status: error.response?.status || 500 }
      )
    }
    return NextResponse.json({ error: 'カテゴリの登録に失敗しました' }, { status: 500 })
  }
}
