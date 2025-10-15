"use client"
import React, { useState } from 'react'
import CreateItemModal from '@/components/items/CreateItemModal'
import { useRouter } from 'next/navigation'

export default function NewItemPage() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  return (
    <div>
      {open && <CreateItemModal onClose={() => { setOpen(false); router.push('/items') }} />}
    </div>
  )
}
