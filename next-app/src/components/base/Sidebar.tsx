'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SubMenuItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  icon: string;
  subItems?: SubMenuItem[];
}

const navigation: NavItem[] = [
  { name: 'ホーム', href: '/', icon: '🏠' },
  { name: 'アイテム管理', href: '/items', icon: '📦' },
  { name: 'ロケーション', href: '/locations', icon: '📍' },
  { name: '在庫管理', href: '/stocks', icon: '📊' },
  { name: 'レポート', href: '/reports', icon: '📈' },
  { 
    name: '設定', 
    icon: '⚙️',
    subItems: [
      { name: 'ユーザー管理', href: '/settings/users' },
      { name: 'カテゴリ設定', href: '/settings/categories' },
      { name: '単位設定', href: '/settings/units' },
      { name: '属性設定', href: '/settings/attributes' },
      { name: 'システム設定', href: '/settings/system' },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['設定']);

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* サイドバーヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">HomeStock</h2>
        <p className="text-xs text-gray-500 mt-1">在庫管理システム</p>
      </div>

      {/* ナビゲーションメニュー */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isExpanded = expandedItems.includes(item.name);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          
          // サブメニューがある場合
          if (hasSubItems) {
            const isAnySubActive = item.subItems!.some(sub => pathname === sub.href);
            
            return (
              <div key={item.name}>
                {/* 親メニュー項目 */}
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg
                    transition-colors duration-150 ease-in-out
                    ${isAnySubActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-lg" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.name}
                  </div>
                  {/* 矢印アイコン */}
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* サブメニュー */}
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`
                            flex items-center px-4 py-2 text-sm rounded-lg
                            transition-colors duration-150 ease-in-out
                            ${isSubActive 
                              ? 'bg-blue-100 text-blue-700 font-medium' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <span className="mr-2">•</span>
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          
          // 通常のメニュー項目（サブメニューなし）
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href!}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg
                transition-colors duration-150 ease-in-out
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <span className="mr-3 text-lg" aria-hidden="true">
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* サイドバーフッター */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">管理</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">管理者</p>
            <p className="text-xs text-gray-500">admin@homestock.local</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
