import React from 'react'
import ItemDetail from '@/components/items/ItemDetail'

type Props = { params: { id: string } }

export default function ItemDetailPage({ params }: Props) {
  const { id } = params
  return (
    <div className="container mx-auto px-4 py-6">
      <a href="/items" className="text-sm text-blue-600">← 一覧に戻る</a>
      <div className="mt-4">
        <ItemDetail id={id} />
      </div>
    </div>
  )
}
