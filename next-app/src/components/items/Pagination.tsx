"use client"
import React from 'react'

export default function Pagination({ page, total, limit, onChange }: { page: number; total: number; limit: number; onChange: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  return (
    <div className="flex items-center justify-between py-3">
      <div className="text-sm text-gray-600">全 {total} 件</div>
      <div className="space-x-2">
        <button className="px-3 py-1 border rounded" onClick={() => onChange(Math.max(1, page - 1))} disabled={page <= 1}>前</button>
        <span className="px-2">{page} / {totalPages}</span>
        <button className="px-3 py-1 border rounded" onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>次</button>
      </div>
    </div>
  )
}
