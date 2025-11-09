import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/users/${id}`
    
    const response = await axios.put(backendUrl, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })

    return NextResponse.json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || 'ユーザーの更新に失敗しました'
      
      return NextResponse.json(
        { error: errorMessage },
        { status: error.response?.status || 500 }
      )
    }
    return NextResponse.json({ error: 'ユーザーの更新に失敗しました' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/users/${id}`
    
    await axios.delete(backendUrl, {
      timeout: 10000,
    })

    return NextResponse.json({ message: 'ユーザーを削除しました' })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || 'ユーザーの削除に失敗しました'
      
      return NextResponse.json(
        { error: errorMessage },
        { status: error.response?.status || 500 }
      )
    }
    return NextResponse.json({ error: 'ユーザーの削除に失敗しました' }, { status: 500 })
  }
}
