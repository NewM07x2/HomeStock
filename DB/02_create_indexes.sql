-- ======================================================
-- Index Definitions for HomeStock
-- ======================================================
-- このスクリプトは全テーブルのインデックスを作成します。
-- 実行順序: 01_create_tables.sql の後に実行してください
--
-- インデックス作成の目的:
--   - 検索クエリのパフォーマンス向上
--   - ソート処理の高速化
--   - 外部キー制約によるJOINの最適化
--
-- 注意:
--   - 実運用では実際のクエリパターンに基づいて追加・調整を推奨
--   - 複合インデックスが必要な場合は適宜追加してください
--   - インデックスの追加はDML性能に影響するため、慎重に設計してください
-- ======================================================

-- ======================================================
-- items テーブル関連インデックス
-- ======================================================

-- アイテムコード検索用（一意検索、高頻度）
CREATE INDEX IF NOT EXISTS idx_items_code ON items(code);

-- アイテム名検索用（部分一致検索、高頻度）
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);

-- カテゴリ別検索用（フィルタリング、集計）
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);

-- 単位別検索用（フィルタリング）
CREATE INDEX IF NOT EXISTS idx_items_unit_id ON items(unit_id);

-- ステータス別検索用（active/inactiveフィルタリング）
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);

-- ======================================================
-- item_attributes テーブル関連インデックス
-- ======================================================

-- アイテムIDによる属性検索用（アイテム詳細表示時）
CREATE INDEX IF NOT EXISTS idx_item_attributes_item ON item_attributes(item_id);

-- 属性IDによる検索用（特定属性を持つアイテム検索）
CREATE INDEX IF NOT EXISTS idx_item_attributes_attribute ON item_attributes(attribute_id);

-- ======================================================
-- stocks テーブル関連インデックス
-- ======================================================

-- アイテムIDによる在庫検索用（アイテム別在庫確認）
CREATE INDEX IF NOT EXISTS idx_stocks_item ON stocks(item_id);

-- ロケーションIDによる在庫検索用（ロケーション別在庫確認）
CREATE INDEX IF NOT EXISTS idx_stocks_location ON stocks(location_id);

-- ======================================================
-- stock_history テーブル関連インデックス
-- ======================================================

-- アイテムIDによる履歴検索用（アイテム別入出庫履歴）
CREATE INDEX IF NOT EXISTS idx_stock_history_item ON stock_history(item_id);

-- 作成日時による履歴検索用（期間指定、最新履歴取得）
CREATE INDEX IF NOT EXISTS idx_stock_history_created ON stock_history(created_at);

-- ======================================================
-- audit_logs テーブル関連インデックス
-- ======================================================

-- ユーザーIDによる監査ログ検索用（ユーザー操作履歴）
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);

-- 作成日時による監査ログ検索用（期間指定、最新ログ取得）
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- ======================================================
-- パフォーマンスチューニングのヒント
-- ======================================================

-- 複合インデックスの追加例:
-- アイテムの絞り込み検索が多い場合
-- CREATE INDEX IF NOT EXISTS idx_items_category_status ON items(category_id, status) WHERE deleted_at IS NULL;

-- 在庫履歴の期間×アイテム検索が多い場合
-- CREATE INDEX IF NOT EXISTS idx_stock_history_item_created ON stock_history(item_id, created_at DESC);

-- 部分インデックスの活用例:
-- 有効なアイテムのみを対象とする場合
-- CREATE INDEX IF NOT EXISTS idx_items_active_only ON items(code, name) WHERE deleted_at IS NULL AND status = 'active';

-- 全文検索が必要な場合:
-- PostgreSQLのto_tsvectorを使用したGINインデックス
-- CREATE INDEX IF NOT EXISTS idx_items_fulltext ON items USING GIN(to_tsvector('japanese', name || ' ' || COALESCE(code, '')));
