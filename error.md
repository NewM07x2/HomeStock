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

---
3.
ItemsList.tsx:41 Uncaught ReferenceError: CreateButton is not defined
    at ItemsList (ItemsList.tsx:41:12)
2
redirect-boundary.js:57 Uncaught ReferenceError: CreateButton is not defined
    at ItemsList (ItemsList.tsx:41:12)
not-found-boundary.js:37 Uncaught ReferenceError: CreateButton is not defined
    at ItemsList (ItemsList.tsx:41:12)
app-index.js:35 The above error occurred in the <NotFoundErrorBoundary> component:

    at NotFoundErrorBoundary (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/not-found-boundary.js:76:9)
    at NotFoundBoundary (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/not-found-boundary.js:84:11)
    at LoadingBoundary (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js:335:11)
    at ErrorBoundaryHandler (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js:114:9)
    at ErrorBoundary (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js:161:11)
    at InnerScrollAndFocusHandler (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js:152:9)
    at ScrollAndFocusHandler (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js:227:11)
    at RenderFromTemplateContext (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js:16:44)
    at OuterLayoutRouter (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js:354:11)
    at main
    at ModalProvider (webpack-internal:///(app-pages-browser)/./src/components/ui/ModalProvider.tsx:20:11)
    at RefreshProvider (webpack-internal:///(app-pages-browser)/./src/components/ui/RefreshContext.tsx:14:11)
    at Provider (webpack-internal:///(app-pages-browser)/./node_modules/react-redux/dist/react-redux.mjs:984:11)
    at Providers (webpack-internal:///(app-pages-browser)/./src/app/providers.tsx:16:11)
    at body
    at html
    at RedirectErrorBoundary (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/redirect-boundary.js:73:9)
    at RedirectBoundary (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/redirect-boundary.js:81:11)
    at NotFoundErrorBoundary (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/not-found-boundary.js:76:9)
    at NotFoundBoundary (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/not-found-boundary.js:84:11)
    at DevRootNotFoundBoundary (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/dev-root-not-found-boundary.js:33:11)
    at ReactDevOverlay (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/react-dev-overlay/internal/ReactDevOverlay.js:84:9)
    at HotReload (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/react-dev-overlay/hot-reloader-client.js:307:11)
    at Router (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/app-router.js:181:11)
    at ErrorBoundaryHandler (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js:114:9)
    at ErrorBoundary (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js:161:11)
    at AppRouter (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/components/app-router.js:536:13)
    at ServerRoot (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/app-index.js:129:11)
    at RSCComponent
    at Root (webpack-internal:///(app-pages-browser)/./node_modules/next/dist/client/app-index.js:145:11)

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundaryHandler.
error.tsx:13 ReferenceError: CreateButton is not defined
    at ItemsList (ItemsList.tsx:41:12)
error.tsx:13 ReferenceError: CreateButton is not defined
    at ItemsList (ItemsList.tsx:41:12)
