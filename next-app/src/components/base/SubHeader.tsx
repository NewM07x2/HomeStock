'use client';

import { useState } from 'react';

interface SubHeaderProps {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  userName?: string;
  userAvatar?: string;
}

export default function SubHeader({ 
  title, 
  searchPlaceholder = "検索...",
  onSearch,
  userName = "管理者",
  userAvatar 
}: SubHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 左側: メニューボタンと検索 */}
        <div className="flex items-center space-x-4 flex-1">
          {/* メニューボタン（モバイル用） */}
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
            aria-label="メニューを開く"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* 検索バー */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* 中央: ページタイトル */}
        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* 右側: テーマ切り替え、通知、ユーザー */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          {/* ライト/ダークモード切り替え */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">LIGHT</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
            <span className="text-xs text-gray-500">DARK</span>
          </div>

          {/* 通知アイコン */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* メッセージアイコン */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span>
          </button>

          {/* ユーザープロフィール */}
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {userAvatar ? (
                <img className="h-8 w-8 rounded-full" src={userAvatar} alt={userName} />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {userName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
