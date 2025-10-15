'use client'

import { Provider } from 'react-redux'
import { store } from '../store/store'
import { ModalProvider } from '@/components/ui/ModalProvider'
import { RefreshProvider } from '@/components/ui/RefreshContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <RefreshProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </RefreshProvider>
    </Provider>
  )
}