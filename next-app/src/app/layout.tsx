import type { Metadata } from "next";
import "@/styles/globals.css";

import React from 'react';

import { Providers } from './providers'
import Header from '@/components/base/Header'
import Sidebar from '@/components/base/Sidebar'
import Footer from '@/components/base/Footer'

export const metadata: Metadata = {
  title: "HomeStock - 在庫管理システム",
  description: "在庫管理システム HomeStock",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full overflow-hidden">
        <Providers>
          {/* 全体コンテナ */}
          <div className="h-full flex flex-col">
            {/* ヘッダー */}
            <Header />
            
            {/* メインコンテンツエリア（サイドバー + メインページ） */}
            <div className="flex-1 flex overflow-hidden">
              {/* サイドバー */}
              <Sidebar />
              
              {/* メインページエリア */}
              <main className="flex-1 overflow-y-auto bg-gray-50">
                <div className="h-full">
                  {children}
                </div>
              </main>
            </div>
            
            {/* フッター */}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
