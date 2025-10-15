"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewItemPage() {
  const router = useRouter()

  // /items/new へ直接アクセスしたときはモーダルを自動で開かないよう
  // 単に一覧にリダイレクトします。モーダルはホームや一覧画面からの
  // イベント発火で開く実装を使ってください。
  useEffect(() => {
    router.replace('/items')
  }, [router])

  return null
}
