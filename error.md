1. Unhandled Runtime Error
Error: (0 , _components_ui_ModalProvider__WEBPACK_IMPORTED_MODULE_3__.useModal) is not a function

Source
src/components/home/QuickLinks.tsx (6:24) @ useModal

  4 |
  5 | export default function QuickLinks() {
> 6 | const modal = useModal()
    |                      ^
  7 |
  8 | return (
  9 |   <div className="bg-white rounded-lg shadow p-4">

---
2. ./src/components/ui/ModalProvider.tsx:4:0
Module not found: Can't resolve '@/components/items/ItemDetailModal'
  2 | import React, { createContext, useContext, useState } from 'react'
  3 | import CreateItemModal from '@/components/items/CreateItemModal'
> 4 | import ItemDetailModal from '@/components/items/ItemDetailModal'
  5 |
  6 | type ModalContextType = {
  7 |   openCreateItem: () => void

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./src/app/providers.tsx
