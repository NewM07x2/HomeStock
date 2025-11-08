import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/attributes/${params.id}`
    
    const response = await axios.put(backendUrl, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    })

    return NextResponse.json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || 'Failed to update attribute' },
        { status: error.response?.status || 500 }
      )
    }
    return NextResponse.json({ error: 'Failed to update attribute' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/attributes/${params.id}`
    
    const response = await axios.delete(backendUrl, {
      timeout: 10000,
    })

    return NextResponse.json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || 'Failed to delete attribute' },
        { status: error.response?.status || 500 }
      )
    }
    return NextResponse.json({ error: 'Failed to delete attribute' }, { status: 500 })
  }
}
