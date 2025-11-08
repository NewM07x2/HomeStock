'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SubMenuItem {
  name: string;
  href: string;
  requiredRole?: 'admin' | 'operator' | 'viewer';
}

interface NavItem {
  name: string;
  href?: string;
  icon: string;
  subItems?: SubMenuItem[];
  requiredRole?: 'admin' | 'operator' | 'viewer'; // 必要な権限レベル
  requiredPlan?: 'free' | 'basic' | 'premium' | 'enterprise'; // 必要なプランレベル
}

// プランの階層レベル（数値が大きいほど上位プラン）
const planLevels = {
  free: 0,
  basic: 1,
  premium: 2,
  enterprise: 3,
};

// ロールの階層レベル（数値が大きいほど高権限）
const roleLevels = {
  viewer: 0,
  operator: 1,
  admin: 2,
};

const navigation: NavItem[] = [
  { 
    name: 'ホーム', 
    href: '/', 
    icon: '🏠',
    // デフォルト表示（権限・プラン制限なし）
  },
  { 
    name: 'アイテム管理', 
    href: '/items', 
    icon: '📦',
    // デフォルト表示（権限・プラン制限なし）
  },
  { 
    name: '在庫管理', 
    href: '/stocks', 
    icon: '📋',
    // デフォルト表示（権限・プラン制限なし）- フリープランでも利用可能
  },
  { 
    name: 'ロケーション', 
    href: '/locations', 
    icon: '📍',
    requiredPlan: 'basic', // Basicプラン以上で表示
  },
  { 
    name: 'レポート', 
    href: '/reports', 
    icon: '📈',
    requiredPlan: 'premium', // Premiumプラン以上で表示
  },
  { 
    name: '設定', 
    icon: '⚙️',
    requiredRole: 'admin', // 管理者のみ表示
    subItems: [
      { name: 'システム設定', href: '/settings/system', requiredRole: 'admin' },
      { name: 'カテゴリ設定', href: '/settings/categories', requiredRole: 'admin' },
      { name: '単位設定', href: '/settings/units', requiredRole: 'admin' },
      { name: '属性設定', href: '/settings/attributes', requiredRole: 'admin' },
      { name: 'ユーザー管理', href: '/settings/users', requiredRole: 'admin' },
    ]
  },
];

interface SidebarProps {
  userRole?: 'admin' | 'operator' | 'viewer';
  userPlan?: 'free' | 'basic' | 'premium' | 'enterprise';
}

export default function Sidebar({ 
  userRole = 'admin', // デフォルトは管理者（開発用）
  userPlan = 'enterprise', // デフォルトはエンタープライズ（開発用）
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]); // 初期状態は空配列で閉じた状態

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  // アイテムが表示可能かチェック
  const canShowItem = (item: NavItem): boolean => {
    // ロール制限のチェック
    if (item.requiredRole) {
      const userRoleLevel = roleLevels[userRole];
      const requiredRoleLevel = roleLevels[item.requiredRole];
      if (userRoleLevel < requiredRoleLevel) {
        return false;
      }
    }

    // プラン制限のチェック
    if (item.requiredPlan) {
      const userPlanLevel = planLevels[userPlan];
      const requiredPlanLevel = planLevels[item.requiredPlan];
      if (userPlanLevel < requiredPlanLevel) {
        return false;
      }
    }

    return true;
  };

  // サブアイテムが表示可能かチェック
  const canShowSubItem = (subItem: SubMenuItem): boolean => {
    // ロール制限のチェック
    if (subItem.requiredRole) {
      const userRoleLevel = roleLevels[userRole];
      const requiredRoleLevel = roleLevels[subItem.requiredRole];
      if (userRoleLevel < requiredRoleLevel) {
        return false;
      }
    }

    return true;
  };

  // 表示可能なナビゲーション項目をフィルタリング
  const visibleNavigation = navigation.filter(canShowItem);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* サイドバーヘッダー */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h2 className="text-lg font-semibold text-gray-800">HomeStock</h2>
          <p className="mt-1 text-xs text-gray-500">在庫管理システム</p>
        </div>
        {/* プラン表示（開発用） */}
        <div className="flex flex-col items-end justify-between mt-1 space-y-1">
          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">
            {userPlan.toUpperCase()}
          </span>
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
            {userRole}
          </span>
        </div>
      </div>

      {/* ナビゲーションメニュー */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleNavigation.map((item) => {
          const isExpanded = expandedItems.includes(item.name);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          
          // サブメニューがある場合
          if (hasSubItems) {
            // 表示可能なサブアイテムをフィルタリング
            const visibleSubItems = item.subItems!.filter(canShowSubItem);
            
            // 表示可能なサブアイテムがない場合は親も表示しない
            if (visibleSubItems.length === 0) {
              return null;
            }

            const isAnySubActive = visibleSubItems.some(sub => pathname === sub.href);
            
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
                    {visibleSubItems.map((subItem) => {
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
