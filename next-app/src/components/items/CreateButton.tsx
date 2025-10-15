"use client"
import React from 'react'
import { useModal } from '@/components/ui/ModalProvider'

export default function CreateButton() {
  const { openCreateItem } = useModal()
  return (
    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={openCreateItem}>新規作成</button>
  )
}
