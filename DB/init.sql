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

-- ======================================================
-- マスタテーブル（カテゴリ、単位、属性）
-- ======================================================

-- categories table: カテゴリマスタ
CREATE TABLE IF NOT EXISTS categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- categories テーブル:
--  アイテムのカテゴリを管理するマスタテーブルです。
--  - code: カテゴリコード（一意）
--  - name: カテゴリ名称
--  - description: カテゴリの説明（任意）

-- units table: 単位マスタ
CREATE TABLE IF NOT EXISTS units (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- units テーブル:
--  アイテムの単位を管理するマスタテーブルです。
--  - code: 単位コード（一意、例: pc, ml, kg）
--  - name: 単位名称（例: 個, ミリリットル, キログラム）
--  - description: 単位の説明（任意）

-- attributes table: 属性マスタ
CREATE TABLE IF NOT EXISTS attributes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  value_type    TEXT NOT NULL CHECK (value_type IN ('text','number','boolean','date')),
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- attributes テーブル:
--  アイテムに付与できる属性の定義を管理するマスタテーブルです。
--  - code: 属性コード（一意、例: brand, spec, color）
--  - name: 属性名称（例: ブランド, 仕様, 色）
--  - value_type: 属性値の型（text, number, boolean, date）
--  - description: 属性の説明（任意）

-- item_attributes table: アイテムと属性の中間テーブル
CREATE TABLE IF NOT EXISTS item_attributes (
  item_id       UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  attribute_id  UUID NOT NULL REFERENCES attributes(id),
  value         TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (item_id, attribute_id)
);

-- item_attributes テーブル:
--  アイテムに紐づく属性値を保持する中間テーブルです。
--  - item_id: アイテムID
--  - attribute_id: 属性ID
--  - value: 属性値（文字列として保存、型はattributes.value_typeで定義）
--  複数の属性をアイテムに紐づけることができます。

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
  category_id   UUID REFERENCES categories(id),
  unit_id       UUID NOT NULL REFERENCES units(id),
  quantity      INTEGER,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- items テーブル:
--  管理対象のアイテム（SKU相当）を保持します。
--  - code は業務で利用する一意キー（SKUコード）
--  - category_id はカテゴリマスタへの外部キー（任意）
--  - unit_id は単位マスタへの外部キー（必須）
--  - quantity は在庫数（任意、NULLの場合は在庫数未設定）
--  - 属性は item_attributes テーブルで管理（複数登録可能）
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
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_unit_id ON items(unit_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_item_attributes_item ON item_attributes(item_id);
CREATE INDEX IF NOT EXISTS idx_item_attributes_attribute ON item_attributes(attribute_id);
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

-- Sample categories
INSERT INTO categories (code, name, description) VALUES
    ('HARDWARE', '金具', '各種金具類'),
    ('CONSUMABLE', '消耗品', '使い捨てまたは消耗する資材'),
    ('MATERIAL', '材料', '加工用材料')
ON CONFLICT (code) DO NOTHING;

-- Sample units
INSERT INTO units (code, name, description) VALUES
    ('pc', '個', '個数単位'),
    ('ml', 'ミリリットル', '液体容量単位'),
    ('sheet', '枚', '薄いものの枚数単位'),
    ('kg', 'キログラム', '重量単位'),
    ('m', 'メートル', '長さ単位')
ON CONFLICT (code) DO NOTHING;

-- Sample attributes
INSERT INTO attributes (code, name, value_type, description) VALUES
    ('brand', 'ブランド', 'text', '製品のブランド名'),
    ('spec', '仕様', 'text', '製品の仕様'),
    ('size', 'サイズ', 'text', 'サイズ情報'),
    ('type', 'タイプ', 'text', '製品のタイプ'),
    ('grit', '粒度', 'text', '研磨材の粒度'),
    ('color', '色', 'text', '製品の色')
ON CONFLICT (code) DO NOTHING;

-- Sample locations
INSERT INTO locations (code, name) VALUES
    ('WH-001', '第一倉庫'),
    ('WH-002', '第二倉庫'),
    ('SHELF-A1', '棚A-1'),
    ('SHELF-A2', '棚A-2')
ON CONFLICT (code) DO NOTHING;

-- Sample items
-- カテゴリIDと単位IDを取得して挿入
INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0001',
    'ねじM5',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    120,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'SKU-0001');

INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0002',
    'ナットM5',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    240,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'SKU-0002');

INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0003',
    'ワッシャーM5',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    60,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'SKU-0003');

INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0004',
    'ボルトM8',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    85,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'SKU-0004');

INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0005',
    '木ネジ',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    150,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'SKU-0005');

INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0006',
    'L字金具',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    45,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'SKU-0006');

INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0007',
    '接着剤',
    (SELECT id FROM categories WHERE code = 'CONSUMABLE'),
    (SELECT id FROM units WHERE code = 'ml'),
    500,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'SKU-0007');

INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0008',
    'サンドペーパー',
    (SELECT id FROM categories WHERE code = 'CONSUMABLE'),
    (SELECT id FROM units WHERE code = 'sheet'),
    NULL,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'SKU-0008');

-- Sample item_attributes
-- SKU-0001のための属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0001'),
    (SELECT id FROM attributes WHERE code = 'brand'),
    'ABC'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0001')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'brand')
);

INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0001'),
    (SELECT id FROM attributes WHERE code = 'spec'),
    'M5x12'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0001')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'spec')
);

-- SKU-0002のための属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0002'),
    (SELECT id FROM attributes WHERE code = 'brand'),
    'ABC'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0002')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'brand')
);

INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0002'),
    (SELECT id FROM attributes WHERE code = 'spec'),
    'M5'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0002')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'spec')
);

-- SKU-0003のための属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0003'),
    (SELECT id FROM attributes WHERE code = 'brand'),
    'ABC'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0003')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'brand')
);

INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0003'),
    (SELECT id FROM attributes WHERE code = 'spec'),
    'M5'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0003')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'spec')
);

-- SKU-0004のための属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0004'),
    (SELECT id FROM attributes WHERE code = 'brand'),
    'XYZ'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0004')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'brand')
);

INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0004'),
    (SELECT id FROM attributes WHERE code = 'spec'),
    'M8x20'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0004')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'spec')
);

-- SKU-0005のための属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0005'),
    (SELECT id FROM attributes WHERE code = 'brand'),
    'DEF'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0005')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'brand')
);

INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0005'),
    (SELECT id FROM attributes WHERE code = 'spec'),
    '4x30'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0005')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'spec')
);

-- SKU-0006のための属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0006'),
    (SELECT id FROM attributes WHERE code = 'size'),
    '50mm'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0006')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'size')
);

-- SKU-0007のための属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0007'),
    (SELECT id FROM attributes WHERE code = 'type'),
    '瞬間接着剤'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0007')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'type')
);

-- SKU-0008のための属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0008'),
    (SELECT id FROM attributes WHERE code = 'grit'),
    '#240'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0008')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'grit')
);