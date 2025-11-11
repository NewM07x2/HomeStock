# HomeStock データベース初期化スクリプト

このディレクトリには、HomeStock アプリケーションの PostgreSQL データベースを初期化するための SQL スクリプトが含まれています。

## 📁 ファイル構成

| ファイル名               | 説明                                       | 実行順序 |
| ------------------------ | ------------------------------------------ | -------- |
| `00_extensions.sql`      | PostgreSQL 拡張機能の有効化                | 1 番目   |
| `01_create_tables.sql`   | 全テーブルの定義を作成                     | 2 番目   |
| `02_create_indexes.sql`  | パフォーマンス向上のためのインデックス作成 | 3 番目   |
| `03_initial_data.sql`    | 初期マスタデータの投入                     | 4 番目   |
| `insert_sample_data.sql` | 開発・テスト用のサンプルデータ             | 任意     |

## 🚀 セットアップ手順

### 1. 前提条件

- PostgreSQL 12 以上がインストールされていること
- データベース作成権限を持つユーザーでアクセスできること
- Docker 環境を使用する場合は、docker-compose が利用可能であること

### 2. データベースの作成と初期化

#### Docker Compose を使用する場合

プロジェクトルートの`docker-compose.yml`を使用すると、これらのスクリプトが自動的に実行されます。

```bash
# プロジェクトルートで実行
docker-compose up -d
```

#### 手動で初期化する場合

```bash
# データベースに接続
psql -h localhost -U postgres -d homestock

# スクリプトを順番に実行
\i DB/00_extensions.sql
\i DB/01_create_tables.sql
\i DB/02_create_indexes.sql
\i DB/03_initial_data.sql

# サンプルデータが必要な場合
\i DB/insert_sample_data.sql
```

PowerShell から一括実行する場合:

```powershell
$env:PGPASSWORD="your_password"
Get-Content DB/00_extensions.sql, DB/01_create_tables.sql, DB/02_create_indexes.sql, DB/03_initial_data.sql | psql -h localhost -U postgres -d homestock
```

## 📊 データベーススキーマ

### テーブル一覧

#### マスタテーブル

| テーブル名   | 説明                               | プレフィックス |
| ------------ | ---------------------------------- | -------------- |
| `users`      | ユーザー情報（認証・権限管理）     | U              |
| `categories` | カテゴリマスタ（アイテム分類）     | C              |
| `units`      | 単位マスタ（個、kg、ml など）      | UN             |
| `attributes` | 属性マスタ（ブランド、サイズなど） | A              |
| `locations`  | ロケーションマスタ（倉庫・棚）     | L              |

#### トランザクションテーブル

| テーブル名        | 説明                       | プレフィックス |
| ----------------- | -------------------------- | -------------- |
| `items`           | アイテム情報（SKU）        | I              |
| `item_attributes` | アイテム属性の中間テーブル | -              |
| `stocks`          | 在庫数量                   | S              |
| `stock_history`   | 入出庫履歴                 | SH             |
| `bulk_jobs`       | 一括処理ジョブ             | BJ             |
| `audit_logs`      | 監査ログ                   | AL             |

### ID 体系

すべてのテーブルで自動採番される連番形式の ID を採用しています。

- フォーマット: `プレフィックス` + `8桁の連番（0埋め）`
- 例:
  - ユーザー: `U00000001`, `U00000002`, ...
  - カテゴリ: `C00000001`, `C00000002`, ...
  - アイテム: `I00000001`, `I00000002`, ...

## 🔧 拡張機能

### citext

大文字小文字を区別しないテキスト型を提供します。

- 用途: メールアドレスの格納と比較
- 利点: `email@example.com` と `EMAIL@EXAMPLE.COM` を同一として扱える

## 🔍 インデックス戦略

パフォーマンス向上のため、以下のカラムにインデックスを作成しています:

- **検索頻度が高いカラム**: `code`, `name`, `email`
- **外部キー**: `category_id`, `unit_id`, `item_id`, `location_id`
- **フィルタリング用**: `status`, `type`, `role`
- **日時範囲検索用**: `created_at`, `occurred_at`

## 📝 初期データ

### 03_initial_data.sql で投入されるデータ

- **管理者ユーザー**:

  - Email: `admin@homestock.local`
  - Password: `admin123` (本番環境では必ず変更してください)
  - Role: `admin`

- **基本マスタ**:
  - カテゴリ: 金具、消耗品、材料
  - 単位: 個(pc)、ミリリットル(ml)、枚(sheet)、キログラム(kg)、メートル(m)
  - 属性: ブランド、仕様、サイズ、タイプ、粒度、色
  - ロケーション: 第一倉庫、第二倉庫、棚 A-1、棚 A-2

### insert_sample_data.sql（オプション）

開発・テスト用のサンプルデータが含まれています。本番環境では実行不要です。

## ⚠️ 注意事項

### セキュリティ

- 初期管理者アカウントのパスワードは必ず変更してください
- パスワードハッシュには強力なアルゴリズム（Argon2、bcrypt など）を使用してください
- 本番環境では適切なデータベースユーザー権限を設定してください

### データ整合性

- 外部キー制約により、テーブル作成順序が重要です
- 削除は論理削除（`deleted_at`）を使用しています
- 参照整合性が保たれるよう、削除時は関連レコードを確認してください

### パフォーマンス

- 本番運用時は実際のクエリパターンに基づいてインデックスを調整してください
- 大量データ投入時は一時的にインデックスを無効化することを検討してください
- 定期的に`VACUUM ANALYZE`を実行してください

## 🔄 スキーマ変更・マイグレーション

### カラム追加手順

既存のテーブルにカラムを追加する場合は、以下の手順に従ってください。

#### 1. マイグレーションスクリプトの作成

新しいマイグレーションファイルを作成します（例: `04_add_column_example.sql`）

```sql
-- ======================================================
-- Migration: テーブルにカラムを追加
-- ======================================================
-- 作成日: 2025-11-11
-- 説明: items テーブルに仕入先情報を追加
-- ======================================================

-- カラム追加
ALTER TABLE items
ADD COLUMN supplier_name TEXT,
ADD COLUMN supplier_code TEXT,
ADD COLUMN supplier_id TEXT REFERENCES suppliers(id);

-- コメント追加（ドキュメント化）
COMMENT ON COLUMN items.supplier_name IS '仕入先名称';
COMMENT ON COLUMN items.supplier_code IS '仕入先コード';
COMMENT ON COLUMN items.supplier_id IS '仕入先ID（外部キー）';

-- 必要に応じてインデックス作成
CREATE INDEX IF NOT EXISTS idx_items_supplier_id ON items(supplier_id);

-- デフォルト値の設定（既存データ用）
UPDATE items SET supplier_name = '未設定' WHERE supplier_name IS NULL;
```

#### 2. ロールバックスクリプトの作成（推奨）

万が一のために、変更を元に戻すスクリプトも用意します（例: `04_add_column_example_rollback.sql`）

```sql
-- ======================================================
-- Rollback: カラム追加を取り消し
-- ======================================================

-- インデックス削除
DROP INDEX IF EXISTS idx_items_supplier_id;

-- カラム削除
ALTER TABLE items
DROP COLUMN IF EXISTS supplier_id,
DROP COLUMN IF EXISTS supplier_code,
DROP COLUMN IF EXISTS supplier_name;
```

#### 3. テスト環境での検証

##### Docker 環境の場合

```powershell
# Dockerコンテナ内でマイグレーションを実行
docker-compose exec db psql -U postgres -d homestock -f /docker-entrypoint-initdb.d/04_add_column_example.sql

# または、ホストからファイルをコピーして実行
docker cp DB/04_add_column_example.sql homestock-db-1:/tmp/
docker-compose exec db psql -U postgres -d homestock -f /tmp/04_add_column_example.sql

# カラムが追加されたことを確認
docker-compose exec db psql -U postgres -d homestock -c "\d items"

# 特定のカラム情報のみ確認
docker-compose exec db psql -U postgres -d homestock -c "SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name='items' AND column_name IN ('supplier_name', 'supplier_code', 'supplier_id');"
```

##### ローカル PostgreSQL の場合

```powershell
# テスト環境で実行
$env:PGPASSWORD="test_password"
psql -h localhost -U postgres -d homestock_test -f DB/04_add_column_example.sql

# 確認
psql -h localhost -U postgres -d homestock_test -c "\d items"
```

#### 4. 本番環境への適用

##### Docker 環境の場合

```powershell
# 1. バックアップを取得
docker-compose exec db pg_dump -U postgres homestock > backup_before_migration_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql

# 2. マイグレーションスクリプトをコンテナにコピー
docker cp DB/04_add_column_example.sql homestock-db-1:/tmp/

# 3. マイグレーション実行
docker-compose exec db psql -U postgres -d homestock -f /tmp/04_add_column_example.sql

# 4. 適用確認
docker-compose exec db psql -U postgres -d homestock -c "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='items' AND column_name IN ('supplier_name', 'supplier_code', 'supplier_id');"

# 5. 実際のデータを確認
docker-compose exec db psql -U postgres -d homestock -c "SELECT id, name, supplier_name, supplier_code FROM items LIMIT 5;"
```

**重要**: コンテナを再起動するとデータが失われる可能性があるため、ボリュームマウントの設定を確認してください。

##### ローカル PostgreSQL の場合

```powershell
# バックアップを取得
pg_dump -h localhost -U postgres -d homestock > backup_before_migration.sql

# マイグレーション実行
$env:PGPASSWORD="production_password"
psql -h localhost -U postgres -d homestock -f DB/04_add_column_example.sql

# 適用確認
psql -h localhost -U postgres -d homestock -c "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='items' AND column_name IN ('supplier_name', 'supplier_code', 'supplier_id');"
```

#### 5. アプリケーションコードの更新

カラム追加後は、以下のコードも更新してください:

- **Go バックエンド**:
  - `go-app/internal/model/model.go`: 構造体にフィールド追加
  - `go-app/internal/repository/repository.go`: SQL クエリ更新
  - GraphQL スキーマ: `go-app/internal/lib/graph/schema/*.graphqls`
- **Next.js フロントエンド**:
  - 型定義ファイル
  - API クライアント
  - フォームコンポーネント

### カラム追加時の注意事項

#### NOT NULL 制約を追加する場合

既存データがある場合、段階的に追加します:

```sql
-- ステップ1: NULL許可でカラム追加
ALTER TABLE items ADD COLUMN new_column TEXT;

-- ステップ2: デフォルト値を設定
UPDATE items SET new_column = 'default_value' WHERE new_column IS NULL;

-- ステップ3: NOT NULL制約を追加
ALTER TABLE items ALTER COLUMN new_column SET NOT NULL;
```

#### 外部キー制約を追加する場合

参照先テーブルが存在することを確認:

```sql
-- 参照先テーブルの存在確認
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'suppliers'
);

-- 外部キー追加
ALTER TABLE items
ADD COLUMN supplier_id TEXT REFERENCES suppliers(id) ON DELETE SET NULL;
```

#### パフォーマンスへの影響

- 大量データがある場合、`ALTER TABLE`は時間がかかります
- 本番環境では業務時間外に実行することを推奨
- デフォルト値を設定する`UPDATE`文は、バッチ処理で分割実行を検討

```sql
-- バッチ更新の例（10000件ずつ）
DO $$
DECLARE
    batch_size INTEGER := 10000;
    rows_updated INTEGER;
BEGIN
    LOOP
        UPDATE items
        SET new_column = 'default_value'
        WHERE id IN (
            SELECT id FROM items
            WHERE new_column IS NULL
            LIMIT batch_size
        );
        GET DIAGNOSTICS rows_updated = ROW_COUNT;
        COMMIT;
        EXIT WHEN rows_updated < batch_size;
    END LOOP;
END $$;
```

### マイグレーションツールの使用

本番環境では、これらのスクリプトを直接実行するのではなく、マイグレーションツールの使用を推奨します:

- [golang-migrate](https://github.com/golang-migrate/migrate)
- [Flyway](https://flywaydb.org/)
- [Liquibase](https://www.liquibase.org/)

#### golang-migrate の使用例

```bash
# インストール
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# マイグレーション作成
migrate create -ext sql -dir DB/migrations -seq add_supplier_columns

# マイグレーション実行
migrate -path DB/migrations -database "postgres://user:pass@localhost:5432/homestock?sslmode=disable" up

# ロールバック
migrate -path DB/migrations -database "postgres://user:pass@localhost:5432/homestock?sslmode=disable" down 1
```

## 🆘 トラブルシューティング

### エラー: "permission denied for schema public"

```sql
GRANT ALL ON SCHEMA public TO your_user;
```

### エラー: "extension citext does not exist"

スーパーユーザー権限で以下を実行:

```sql
CREATE EXTENSION citext;
```

### スクリプト実行がロールバックされる

トランザクションブロック内でエラーが発生している可能性があります。各スクリプトを個別に実行して原因を特定してください。

## 📚 関連ドキュメント

- [PostgreSQL 公式ドキュメント](https://www.postgresql.org/docs/)
- [citext 拡張機能](https://www.postgresql.org/docs/current/citext.html)
- プロジェクトルートの`docs/`ディレクトリ

## 🤝 貢献

データベーススキーマの変更を提案する場合:

1. 新しいマイグレーションスクリプトを作成
2. `README.md`を更新
3. プルリクエストを作成

---

**Last Updated**: 2025 年 11 月 11 日
