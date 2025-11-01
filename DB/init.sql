-- PostgreSQL Initialization Script for HomeStock
-- Based on concept.md specifications

-- ======================================================
-- 初期化スクリプトについて（日本語コメント）
--
-- このスクリプトはローカル開発およびテスト環境向けの初期スキーマ定義とサンプルデータを含みます。
-- 本番環境ではマイグレーションツール（例: golang-migrate）を使って段階的に適用してください。
-- ここでは以下を行います:
--  1) 必要な拡張機能の有効化（UUID, citext）
--  2) ユーザー、アイテム、ロケーション、在庫、履歴、バルクジョブ、監査ログ等のテーブル作成
--  3) インデックス作成
--  4) テスト用のサンプルデータ挿入
--
-- 注意:
--  - パスワードハッシュはダミーです。実際のパスワードは安全にハッシュ化して登録してください。
--  - 拡張機能 uuid-ossp を利用するため、権限が必要です。ホスティング環境によっては gen_random_uuid() (pgcrypto) を推奨する場合があります。
-- ======================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- uuid-ossp:
--   UUID の生成関数 (uuid_generate_v4) を提供します。
-- citext:
--   大文字小文字を区別しないテキスト型を提供します。メールアドレス等の比較に便利です。

-- users table
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin','operator','viewer')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- users テーブル:
--  ユーザー情報を保持します。
--  - id: UUID (主キー)
--  - email: 大文字小文字を区別しない一意のメールアドレス
--  - password_hash: ハッシュ化したパスワード（実運用では Argon2 など堅牢な方式を利用してください）
--  - role: 権限（admin/operator/viewer）
--  - deleted_at: 論理削除用

-- items table
CREATE TABLE IF NOT EXISTS items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  category      TEXT,
  unit          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  attributes    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- items テーブル:
--  管理対象のアイテム（SKU相当）を保持します。
--  - code は業務で利用する一意キー（SKUコード）
--  - attributes は任意属性を JSONB で保存（例: ブランド、寸法など）
--  - created_by は作成者ユーザーの参照
--  - deleted_at に値が入ると論理削除扱いになります

-- locations table
CREATE TABLE IF NOT EXISTS locations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  parent_id     UUID REFERENCES locations(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- locations テーブル:
--  倉庫や棚などの保管場所を表します。階層構造（parent_id）に対応しています。

-- stocks table: item x location の現在量
CREATE TABLE IF NOT EXISTS stocks (
  item_id     UUID NOT NULL REFERENCES items(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  qty         NUMERIC(20,4) NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (item_id, location_id)
);

-- stocks テーブル:
--  各アイテム×ロケーションの現在保有数量を保持します。
--  qty は小数を許容（NUMERIC(20,4)）し、トランザクション内で更新することを想定します。

-- stock_movements table: 入出庫/移動/調整の履歴
CREATE TABLE IF NOT EXISTS stock_movements (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id       UUID NOT NULL REFERENCES items(id),
  qty_delta     NUMERIC(20,4) NOT NULL,
  kind          TEXT NOT NULL CHECK (kind IN ('IN','OUT','ADJUST','TRANSFER')),
  location_from UUID REFERENCES locations(id),
  location_to   UUID REFERENCES locations(id),
  reason        TEXT,
  meta          JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- stock_movements テーブル:
--  在庫の増減イベント（入庫、出庫、調整、移動）を時系列で記録します。
--  - qty_delta は増減量（正負で表現）
--  - transfer の場合は location_from と location_to を両方利用します
--  - meta に補足情報（例: 参照番号、外部システム情報など）を保存可能

-- bulk_jobs table
CREATE TABLE IF NOT EXISTS bulk_jobs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type      TEXT NOT NULL CHECK (job_type IN ('item_import','item_update','item_delete')),
  status        TEXT NOT NULL CHECK (status IN ('queued','validating','ready','running','failed','completed')),
  file_path     TEXT NOT NULL,
  summary       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- bulk_jobs テーブル:
--  CSV 等の一括処理ジョブの状態管理を行います。
--  job_type: ジョブ種別、status: ワークフローの状態
--  summary: ジョブ結果のサマリ（エラー件数など）を JSONB で格納

-- audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID REFERENCES users(id),
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id TEXT,
  diff        JSONB,
  request_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- audit_logs テーブル:
--  重要操作の監査ログを記録します。
--  - diff に before/after の差分要約を格納することを想定
--  - request_id でリクエストを相関付けられるように設計

-- Indexes
CREATE INDEX IF NOT EXISTS idx_items_code ON items(code);
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_stocks_item ON stocks(item_id);
CREATE INDEX IF NOT EXISTS idx_stocks_location ON stocks(location_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_item ON stock_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- インデックスについて:
-- 主要検索キー（code, name, item_id など）に対してインデックスを作成し、一覧系や集計のパフォーマンスを改善します。
-- 実運用では実際のクエリパターンに合わせて追加・調整してください。

-- Insert sample data for testing
-- Admin user (password: admin123)
INSERT INTO users (email, password_hash, role) VALUES
    ('admin@homestock.local', '$2a$10$X7ZQKZjxkZ5y5Zw5xZXZxeXZxZxZxZxZxZxZxZxZxZxZxZxZxZxZx', 'admin')
ON CONFLICT (email) DO NOTHING;

-- サンプルデータについて:
-- ここで挿入しているパスワードハッシュはデモ用です。実際の環境では必ず安全なハッシュを使用し、初期パスワードを変更してください。

-- Sample locations
INSERT INTO locations (code, name) VALUES
    ('WH-001', '第一倉庫'),
    ('WH-002', '第二倉庫'),
    ('SHELF-A1', '棚A-1'),
    ('SHELF-A2', '棚A-2')
ON CONFLICT (code) DO NOTHING;

-- Sample items
INSERT INTO items (code, name, category, unit, status, attributes) VALUES
    ('SKU-0001', 'ねじM5', '金具', '個', 'active', '{"brand":"ABC","spec":"M5x12"}'::jsonb),
    ('SKU-0002', 'ナットM5', '金具', '個', 'active', '{"brand":"ABC","spec":"M5"}'::jsonb),
    ('SKU-0003', 'ワッシャーM5', '金具', '個', 'active', '{"brand":"ABC","spec":"M5"}'::jsonb),
    ('SKU-0004', 'ボルトM8', '金具', '個', 'active', '{"brand":"XYZ","spec":"M8x20"}'::jsonb),
    ('SKU-0005', '木ネジ', '金具', '個', 'active', '{"brand":"DEF","spec":"4x30"}'::jsonb),
    ('SKU-0006', 'L字金具', '金具', '個', 'active', '{"size":"50mm"}'::jsonb),
    ('SKU-0007', '接着剤', '消耗品', 'ml', 'active', '{"type":"瞬間接着剤"}'::jsonb),
    ('SKU-0008', 'サンドペーパー', '消耗品', '枚', 'active', '{"grit":"#240"}'::jsonb)
ON CONFLICT (code) DO NOTHING;