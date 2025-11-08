import React from 'react'

export default function SystemSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">システム設定</h1>
        <p className="mt-1 text-sm text-gray-500">
          システム全体の設定を管理します
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* アプリケーション情報 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">アプリケーション情報</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="border-b border-gray-200 pb-4">
                <dt className="text-sm font-medium text-gray-500">アプリケーション名</dt>
                <dd className="mt-1 text-sm text-gray-900">HomeStock</dd>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <dt className="text-sm font-medium text-gray-500">バージョン</dt>
                <dd className="mt-1 text-sm text-gray-900">1.0.0</dd>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <dt className="text-sm font-medium text-gray-500">データベース</dt>
                <dd className="mt-1 text-sm text-gray-900">PostgreSQL 15</dd>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <dt className="text-sm font-medium text-gray-500">環境</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {process.env.NODE_ENV === 'production' ? '本番環境' : '開発環境'}
                </dd>
              </div>
            </dl>
          </div>

          {/* システム設定項目（将来の拡張用） */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">一般設定</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">メンテナンスモード</p>
                  <p className="text-sm text-gray-500">システムメンテナンス中は一般ユーザーのアクセスを制限します</p>
                </div>
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  無効
                </button>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">自動バックアップ</p>
                  <p className="text-sm text-gray-500">データベースの自動バックアップを有効にします</p>
                </div>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  有効
                </button>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">監査ログ</p>
                  <p className="text-sm text-gray-500">すべての重要な操作をログに記録します</p>
                </div>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  有効
                </button>
              </div>
            </div>
          </div>

          {/* データベース操作 */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">データベース管理</h2>
            <div className="space-y-3">
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                バックアップ実行
              </button>
              <button className="w-full sm:w-auto ml-0 sm:ml-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                データベース最適化
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
