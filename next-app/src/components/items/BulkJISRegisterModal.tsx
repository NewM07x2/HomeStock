"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

type BulkJISRegisterModalProps = {
  open: boolean
  onClose: () => void
  onScan: (decodedText: string) => void
}

export default function BulkJISRegisterModal({ open, onClose, onScan }: BulkJISRegisterModalProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    if (open && !isScanning) {
      setIsScanning(true)
      
      // スキャナーを初期化
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
          // supportedScanTypesは削除 - デフォルトでカメラとファイルの両方がサポートされる
        },
        false
      )

      scannerRef.current = scanner

      scanner.render(
        (decodedText: string) => {
          console.log('読み取り成功:', decodedText)
          onScan(decodedText)
          handleClose()
        },
        (errorMessage: string) => {
          // エラーは無視（スキャン中の通常のエラーメッセージ）
          // console.log('スキャン中:', errorMessage)
        }
      )
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear()
        } catch (error) {
          console.error('スキャナーのクリアに失敗:', error)
        }
        scannerRef.current = null
      }
    }
  }, [open])

  const handleClose = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear()
      } catch (error) {
        console.error('スキャナーのクリアに失敗:', error)
      }
      scannerRef.current = null
    }
    setIsScanning(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* オーバーレイ */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* モーダルコンテンツ */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">バーコード/QRコード読み取り</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 説明 */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              カメラでバーコードまたはQRコードをスキャンしてください。
            </p>
            <p className="text-xs text-gray-500 mt-1">
              対応形式: QRコード、JAN/EAN、UPC、CODE-128など
            </p>
          </div>

          {/* スキャナー表示エリア */}
          <div id="qr-reader" className="w-full"></div>

          {/* 閉じるボタン */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
