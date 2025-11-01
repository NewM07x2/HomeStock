'use client';

import { useState } from 'react';

// 在庫履歴のデータ型定義
interface StockMovement {
  id: string;
  itemCode: string;
  itemName: string;
  kind: 'IN' | 'OUT' | 'ADJUST' | 'TRANSFER';
  qtyDelta: number;
  locationFrom?: string;
  locationTo?: string;
  reason?: string;
  createdBy: string;
  createdAt: string;
}

// ダミーデータ
const dummyStockMovements: StockMovement[] = [
  {
    id: '1',
    itemCode: 'HSM-0001',
    itemName: 'ねじM5',
    kind: 'IN',
    qtyDelta: 100,
    locationTo: '第一倉庫',
    reason: '新規入庫',
    createdBy: '管理者',
    createdAt: '2025-11-01 10:30:00',
  },
  {
    id: '2',
    itemCode: 'HSM-0002',
    itemName: 'ナットM5',
    kind: 'OUT',
    qtyDelta: -50,
    locationFrom: '第一倉庫',
    reason: '出荷',
    createdBy: '作業者A',
    createdAt: '2025-11-01 11:15:00',
  },
  {
    id: '3',
    itemCode: 'HSM-0001',
    itemName: 'ねじM5',
    kind: 'TRANSFER',
    qtyDelta: 20,
    locationFrom: '第一倉庫',
    locationTo: '棚A-1',
    reason: '棚移動',
    createdBy: '作業者B',
    createdAt: '2025-11-01 13:45:00',
  },
  {
    id: '4',
    itemCode: 'HSM-0003',
    itemName: 'ワッシャーM5',
    kind: 'ADJUST',
    qtyDelta: -5,
    locationFrom: '第一倉庫',
    reason: '棚卸調整',
    createdBy: '管理者',
    createdAt: '2025-11-01 14:20:00',
  },
  {
    id: '5',
    itemCode: 'HSM-0004',
    itemName: 'ボルトM8',
    kind: 'IN',
    qtyDelta: 200,
    locationTo: '第二倉庫',
    reason: '新規入庫',
    createdBy: '管理者',
    createdAt: '2025-11-01 15:00:00',
  },
];

export default function StockHistoryList() {
  const [movements, setMovements] = useState<StockMovement[]>(dummyStockMovements);
  const [filterKind, setFilterKind] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 種別のラベルと色を取得
  const getKindLabel = (kind: string) => {
    switch (kind) {
      case 'IN':
        return '入庫';
      case 'OUT':
        return '出庫';
      case 'ADJUST':
        return '調整';
      case 'TRANSFER':
        return '移動';
      default:
        return kind;
    }
  };

  const getKindColor = (kind: string) => {
    switch (kind) {
      case 'IN':
        return 'bg-green-100 text-green-800';
      case 'OUT':
        return 'bg-red-100 text-red-800';
      case 'ADJUST':
        return 'bg-yellow-100 text-yellow-800';
      case 'TRANSFER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // フィルタリング処理
  const filteredMovements = movements.filter((movement) => {
    const matchesKind = filterKind === 'ALL' || movement.kind === filterKind;
    const matchesSearch =
      movement.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesKind && matchesSearch;
  });

  return (
    <div className="bg-white rounded-lg shadow">
      {/* 検索・フィルタエリア */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 検索ボックス */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="アイテムコードまたは名前で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 種別フィルタ */}
          <div className="w-full md:w-48">
            <select
              value={filterKind}
              onChange={(e) => setFilterKind(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">すべての種別</option>
              <option value="IN">入庫</option>
              <option value="OUT">出庫</option>
              <option value="ADJUST">調整</option>
              <option value="TRANSFER">移動</option>
            </select>
          </div>

          {/* 新規登録ボタン */}
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
            + 新規登録
          </button>
        </div>
      </div>

      {/* 履歴リスト */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日時
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                種別
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アイテムコード
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                アイテム名
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                数量
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                移動元
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                移動先
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                理由
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                登録者
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMovements.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  履歴データがありません
                </td>
              </tr>
            ) : (
              filteredMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {movement.createdAt}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getKindColor(
                        movement.kind
                      )}`}
                    >
                      {getKindLabel(movement.kind)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {movement.itemCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {movement.itemName}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-right font-medium whitespace-nowrap ${
                      movement.qtyDelta > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {movement.qtyDelta > 0 ? '+' : ''}
                    {movement.qtyDelta}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {movement.locationFrom || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {movement.locationTo || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {movement.reason || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {movement.createdBy}
                  </td>
                  <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      詳細
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      削除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション（将来的に実装） */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{filteredMovements.length}</span> 件の履歴
          </div>
          <div className="text-sm text-gray-500">
            {/* ページネーションは今後実装 */}
          </div>
        </div>
      </div>
    </div>
  );
}
