'use client'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import { ModalProvider } from '@/components/ui/ModalProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ModalProvider>
        {children}
      </ModalProvider>
    </Provider>
  )
}