'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navigation: NavItem[] = [
  { name: 'ホーム', href: '/', icon: '🏠' },
  { name: 'アイテム管理', href: '/items', icon: '📦' },
  { name: 'ロケーション', href: '/locations', icon: '📍' },
  { name: '在庫管理', href: '/stocks', icon: '📊' },
  { name: 'レポート', href: '/reports', icon: '📈' },
  { name: '設定', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

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
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
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
