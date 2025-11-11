import type { Metadata } from "next";
import "@/styles/globals.css";

import React from 'react';

import { Providers } from './providers'
import ResponsiveLayout from '@/components/base/ResponsiveLayout'
import Footer from '@/components/base/Footer'

export const metadata: Metadata = {
  title: "HomeStock - 在庫管理システム",
  description: "在庫管理システム HomeStock",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // TODO: 実際の実装では、セッションやJWTからユーザー情報を取得
  // 現在は開発用のデフォルト値を使用
  const userRole: 'admin' | 'operator' | 'viewer' = 'admin';
  const userPlan: 'free' | 'basic' | 'premium' | 'enterprise' = 'enterprise';

  return (
    <html lang="ja" className="h-full">
      <body className="h-full overflow-hidden">
        <Providers>
          <ResponsiveLayout userRole={userRole} userPlan={userPlan}>
            {children}
          </ResponsiveLayout>
        </Providers>
      </body>
    </html>
  );
}
