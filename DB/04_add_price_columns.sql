-- ======================================================
-- マイグレーション: itemsテーブルに単価情報を追加
-- ======================================================
-- 実行日: 2025-11-11
-- 目的: レポート機能で月別利用金額を計算するため、
--       アイテムごとの単価情報を保持するカラムを追加します
-- ======================================================

-- itemsテーブルにunit_priceカラムを追加
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS unit_price INTEGER DEFAULT 0;

COMMENT ON COLUMN items.unit_price IS 'アイテムの単価（円）';

-- stock_historyテーブルにunit_priceとtotal_amountカラムを追加
-- 履歴作成時点の単価と合計金額を記録します
ALTER TABLE stock_history 
ADD COLUMN IF NOT EXISTS unit_price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_amount INTEGER DEFAULT 0;

COMMENT ON COLUMN stock_history.unit_price IS '取引時のアイテム単価（円）';
COMMENT ON COLUMN stock_history.total_amount IS '取引金額（qty_delta × unit_price）';

-- 既存データに対して、デフォルト値を設定（必要に応じて更新）
-- 例: 全アイテムに仮の単価1000円を設定
-- UPDATE items SET unit_price = 1000 WHERE unit_price = 0;

-- 既存の履歴データに対しても同様
-- UPDATE stock_history SET unit_price = 1000, total_amount = ABS(qty_delta) * 1000 WHERE unit_price = 0;
