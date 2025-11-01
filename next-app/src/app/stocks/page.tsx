import StockHistoryList from '@/components/stocks/StockHistoryList';

export default function StocksPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">在庫管理</h1>
        <p className="text-sm text-gray-600 mt-1">
          アイテムの入庫、出庫、移動、調整の履歴を確認できます
        </p>
      </div>

      <StockHistoryList />
    </div>
  );
}
