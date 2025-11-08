import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/units/${id}`
    
    const response = await axios.put(backendUrl, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('[API /api/units/:id] Error updating unit:', error)
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: error.response?.data?.error || 'Failed to update unit',
          details: error.response?.data?.details || error.message
        },
        { status: error.response?.status || 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update unit' },
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

    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const backendUrl = `${apiBaseUrl}/api/units/${id}`
    
    await axios.delete(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    return NextResponse.json({ message: 'Unit deleted successfully' })
  } catch (error) {
    console.error('[API /api/units/:id] Error deleting unit:', error)
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { 
          error: error.response?.data?.error || 'Failed to delete unit',
          details: error.response?.data?.details || error.message
        },
        { status: error.response?.status || 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete unit' },
      { status: 500 }
    )
  }
}
