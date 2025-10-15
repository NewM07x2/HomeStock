"use client"
import React from 'react'

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <input
        className="border rounded px-3 py-2 flex-1"
        placeholder="コードまたは名称で検索"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-3 py-2 rounded">検索</button>
    </div>
  )
}
