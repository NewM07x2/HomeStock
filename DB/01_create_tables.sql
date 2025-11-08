-- ======================================================
-- Table Definitions for HomeStock
-- ======================================================
-- このスクリプトは全テーブルの定義を作成します。
-- 実行順序: 00_extensions.sql の後に実行してください
--
-- テーブル一覧:
--   - users: ユーザー情報
--   - categories: カテゴリマスタ
--   - units: 単位マスタ
--   - attributes: 属性マスタ
--   - items: アイテム（SKU）
--   - item_attributes: アイテム属性中間テーブル
--   - locations: ロケーション（倉庫・棚）
--   - stocks: 在庫数量
--   - stock_history: 入出庫履歴
--   - bulk_jobs: 一括処理ジョブ
--   - audit_logs: 監査ログ
--
-- 注意:
--   - 外部キー制約により、テーブル作成順序が重要です
--   - 本番環境ではマイグレーションツール（golang-migrate等）の使用を推奨します
-- ======================================================

-- ======================================================
-- ユーザーテーブル
-- ======================================================

-- users table: ユーザー情報を管理
-- 認証とアクセス制御に使用します
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin','operator','viewer')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

COMMENT ON TABLE users IS 'ユーザー情報テーブル。認証とアクセス制御に使用';
COMMENT ON COLUMN users.id IS 'ユーザーID（UUID）';
COMMENT ON COLUMN users.email IS '大文字小文字を区別しないメールアドレス（一意）';
COMMENT ON COLUMN users.password_hash IS 'ハッシュ化されたパスワード（Argon2等を推奨）';
COMMENT ON COLUMN users.role IS 'ユーザー権限（admin: 管理者, operator: 担当者, viewer: 閲覧者）';
COMMENT ON COLUMN users.deleted_at IS '論理削除日時（NULL = 有効）';

-- ======================================================
-- マスタテーブル
-- ======================================================

-- categories table: カテゴリマスタ
-- アイテムの分類に使用します
CREATE TABLE IF NOT EXISTS categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

COMMENT ON TABLE categories IS 'カテゴリマスタテーブル。アイテムの分類に使用';
COMMENT ON COLUMN categories.code IS 'カテゴリコード（一意、業務キー）';
COMMENT ON COLUMN categories.name IS 'カテゴリ名称';
COMMENT ON COLUMN categories.description IS 'カテゴリの説明（任意）';

-- units table: 単位マスタ
-- 在庫数量の単位を管理します
CREATE TABLE IF NOT EXISTS units (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

COMMENT ON TABLE units IS '単位マスタテーブル。在庫数量の単位を管理';
COMMENT ON COLUMN units.code IS '単位コード（一意、例: pc, kg, ml）';
COMMENT ON COLUMN units.name IS '単位名称（例: 個, キログラム, ミリリットル）';
COMMENT ON COLUMN units.description IS '単位の説明（任意）';

-- attributes table: 属性マスタ
-- アイテムに付与できる属性の定義を管理します
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

COMMENT ON TABLE attributes IS '属性マスタテーブル。アイテムに付与可能な属性の定義';
COMMENT ON COLUMN attributes.code IS '属性コード（一意、例: brand, color, size）';
COMMENT ON COLUMN attributes.name IS '属性名称（例: ブランド, 色, サイズ）';
COMMENT ON COLUMN attributes.value_type IS '属性値の型（text, number, boolean, date）';

-- ======================================================
-- アイテムテーブル
-- ======================================================

-- items table: 管理対象のアイテム（SKU）
-- 在庫管理の中心となるテーブルです
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

COMMENT ON TABLE items IS 'アイテムテーブル。管理対象のSKUを保持';
COMMENT ON COLUMN items.code IS 'アイテムコード（一意、業務キー）';
COMMENT ON COLUMN items.name IS 'アイテム名称';
COMMENT ON COLUMN items.category_id IS 'カテゴリID（任意、categories.id への外部キー）';
COMMENT ON COLUMN items.unit_id IS '単位ID（必須、units.id への外部キー）';
COMMENT ON COLUMN items.quantity IS '在庫数量（任意、NULL = 未設定）';
COMMENT ON COLUMN items.status IS 'ステータス（active: 有効, inactive: 無効）';
COMMENT ON COLUMN items.created_by IS '作成者（users.id への外部キー）';

-- item_attributes table: アイテムと属性の中間テーブル
-- アイテムに複数の属性を紐づけます
CREATE TABLE IF NOT EXISTS item_attributes (
  item_id       UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  attribute_id  UUID NOT NULL REFERENCES attributes(id),
  value         TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (item_id, attribute_id)
);

COMMENT ON TABLE item_attributes IS 'アイテム属性中間テーブル。アイテムに複数の属性を紐づける';
COMMENT ON COLUMN item_attributes.item_id IS 'アイテムID';
COMMENT ON COLUMN item_attributes.attribute_id IS '属性ID';
COMMENT ON COLUMN item_attributes.value IS '属性値（文字列として保存、型は attributes.value_type で定義）';

-- ======================================================
-- ロケーションと在庫テーブル
-- ======================================================

-- locations table: 保管場所
-- 階層構造をサポートします（parent_id）
CREATE TABLE IF NOT EXISTS locations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  parent_id     UUID REFERENCES locations(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

COMMENT ON TABLE locations IS 'ロケーションテーブル。倉庫や棚などの保管場所を管理';
COMMENT ON COLUMN locations.code IS 'ロケーションコード（一意、業務キー）';
COMMENT ON COLUMN locations.name IS 'ロケーション名称';
COMMENT ON COLUMN locations.parent_id IS '親ロケーションID（階層構造をサポート）';

-- stocks table: アイテム × ロケーションの現在量
-- 在庫の現在値を保持します
CREATE TABLE IF NOT EXISTS stocks (
  item_id     UUID NOT NULL REFERENCES items(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  qty         NUMERIC(20,4) NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (item_id, location_id)
);

COMMENT ON TABLE stocks IS '在庫テーブル。アイテム × ロケーションの現在保有数量';
COMMENT ON COLUMN stocks.item_id IS 'アイテムID';
COMMENT ON COLUMN stocks.location_id IS 'ロケーションID';
COMMENT ON COLUMN stocks.qty IS '在庫数量（小数対応、NUMERIC(20,4)）';
COMMENT ON COLUMN stocks.updated_at IS '最終更新日時';

-- ======================================================
-- 履歴・ジョブ・ログテーブル
-- ======================================================

-- stock_history table: 入出庫履歴
-- 在庫の増減イベントを時系列で記録します
CREATE TABLE IF NOT EXISTS stock_history (
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

COMMENT ON TABLE stock_history IS '在庫履歴テーブル。入出庫や調整の履歴を記録';
COMMENT ON COLUMN stock_history.item_id IS 'アイテムID';
COMMENT ON COLUMN stock_history.qty_delta IS '増減量（正: 増加, 負: 減少）';
COMMENT ON COLUMN stock_history.kind IS '履歴種別（IN: 入庫, OUT: 出庫, ADJUST: 調整, TRANSFER: 移動）';
COMMENT ON COLUMN stock_history.location_from IS '移動元ロケーション（TRANSFER時に使用）';
COMMENT ON COLUMN stock_history.location_to IS '移動先ロケーション（TRANSFER時に使用）';
COMMENT ON COLUMN stock_history.reason IS '理由・備考';
COMMENT ON COLUMN stock_history.meta IS '補足情報（JSON形式、参照番号など）';
COMMENT ON COLUMN stock_history.created_by IS '実行者（users.id への外部キー）';

-- bulk_jobs table: 一括処理ジョブ
-- CSV等の一括処理の状態管理
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

COMMENT ON TABLE bulk_jobs IS '一括処理ジョブテーブル。CSV等の一括処理の状態を管理';
COMMENT ON COLUMN bulk_jobs.job_type IS 'ジョブ種別（item_import, item_update, item_delete）';
COMMENT ON COLUMN bulk_jobs.status IS 'ジョブステータス（queued → validating → ready → running → completed/failed）';
COMMENT ON COLUMN bulk_jobs.file_path IS 'アップロードファイルのパス';
COMMENT ON COLUMN bulk_jobs.summary IS 'ジョブ結果サマリ（JSON形式、エラー件数など）';
COMMENT ON COLUMN bulk_jobs.created_by IS '実行者（users.id への外部キー）';

-- audit_logs table: 監査ログ
-- 重要操作の記録
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

COMMENT ON TABLE audit_logs IS '監査ログテーブル。重要操作の記録';
COMMENT ON COLUMN audit_logs.user_id IS '実行ユーザーID';
COMMENT ON COLUMN audit_logs.action IS '操作内容（create, update, delete等）';
COMMENT ON COLUMN audit_logs.resource IS 'リソース種別（items, users等）';
COMMENT ON COLUMN audit_logs.resource_id IS 'リソースID';
COMMENT ON COLUMN audit_logs.diff IS '変更差分（JSON形式、before/after）';
COMMENT ON COLUMN audit_logs.request_id IS 'リクエストID（相関関係の追跡用）';
