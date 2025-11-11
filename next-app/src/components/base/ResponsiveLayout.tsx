'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'operator' | 'viewer';
  userPlan?: 'free' | 'basic' | 'premium' | 'enterprise';
}

export default function ResponsiveLayout({ 
  children, 
  userRole = 'admin', 
  userPlan = 'enterprise' 
}: ResponsiveLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // モバイルデバイスの判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // モバイルメニューが開いている時にスクロールを防ぐ
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="h-full flex">
      {/* デスクトップ用サイドバー */}
      <div className="hidden md:block">
        <Sidebar userRole={userRole} userPlan={userPlan} />
      </div>

      {/* モバイル用オーバーレイ */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* モバイル用スライドサイドバー */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar 
          userRole={userRole} 
          userPlan={userPlan} 
          onClose={() => setIsMobileMenuOpen(false)}
          isMobile={true}
        />
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* モバイル用ヘッダー（ハンバーガーメニュー） */}
        {isMobile && (
          <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="メニューを開く"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800">HomeStock</h1>
            <div className="w-10" /> {/* スペーサー */}
          </header>
        )}

        {/* メインページエリア */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>

        {/* フッター */}
        <Footer />
      </div>
    </div>
  );
}
