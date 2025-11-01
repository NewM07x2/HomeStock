"use client"
import React from 'react'
import { useModal } from '@/components/ui/ModalProvider'

export default function CreateButton() {
  const { openCreateItem } = useModal()
  return (
    <button 
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap" 
      onClick={openCreateItem}
    >
      + 新規登録
    </button>
  )
}
