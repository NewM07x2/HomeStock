import React from 'react'

type Item = {
  id: string
  code: string
  name: string
  qty: number
}

const sample: Item[] = [
  { id: '1', code: 'SKU-0001', name: 'ねじM5', qty: 120 },
  { id: '2', code: 'SKU-0002', name: 'ナットM5', qty: 240 },
  { id: '3', code: 'SKU-0003', name: 'ワッシャー', qty: 60 }
]

export default function RecentItems() {
  return (
    <section className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium mb-3">最新アイテム</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">コード</th>
              <th className="py-2">名称</th>
              <th className="py-2">在庫</th>
            </tr>
          </thead>
          <tbody>
            {sample.map(item => (
              <tr key={item.id} className="border-b last:border-b-0">
                <td className="py-2">{item.code}</td>
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
