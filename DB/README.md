# HomeStock データベースセットアップガイド

このディレクトリには、HomeStock プロジェクトのデータベース初期化スクリプトが含まれています。

## ファイル構成

```
DB/
├── README.md                 # このファイル
├── 00_extensions.sql         # PostgreSQL拡張機能
├── 01_create_tables.sql      # テーブル定義
├── 02_create_indexes.sql     # インデックス定義
├── 03_initial_data.sql       # 初期サンプルデータ（最小限）
└── insert_sample_data.sql    # 追加サンプルデータ（開発用・大量）
```

## セットアップ手順

### 1. 前提条件

- PostgreSQL 12 以上がインストールされていること
- データベース接続情報が設定されていること
- psql コマンドラインツールが利用可能であること

### 2. データベース作成

```bash
# データベース作成（まだ存在しない場合）
createdb homestock

# または psql で
psql -U postgres
CREATE DATABASE homestock;
\q
```

### 3. スクリプト実行

**重要**: 以下の順序で実行してください。順序を間違えるとエラーになります。

```bash
# 1. 拡張機能の有効化
psql -U postgres -d homestock -f 00_extensions.sql

# 2. テーブル作成
psql -U postgres -d homestock -f 01_create_tables.sql

# 3. インデックス作成
psql -U postgres -d homestock -f 02_create_indexes.sql

# 4. 初期データ投入（最小限のサンプルデータ）
psql -U postgres -d homestock -f 03_initial_data.sql

# 5. （オプション）追加サンプルデータ投入（開発用）
psql -U postgres -d homestock -f insert_sample_data.sql
```

### 4. Docker 環境での実行

`docker-compose.yml` を使用している場合、コンテナ起動時に自動実行されます。

```bash
# Dockerコンテナ起動（初回は自動的にスクリプトが実行されます）
docker-compose up -d

# 手動で実行する場合
docker-compose exec db psql -U hsm -d hsm-db -f /docker-entrypoint-initdb.d/00_extensions.sql
docker-compose exec db psql -U hsm -d hsm-db -f /docker-entrypoint-initdb.d/01_create_tables.sql
docker-compose exec db psql -U hsm -d hsm-db -f /docker-entrypoint-initdb.d/02_create_indexes.sql
docker-compose exec db psql -U hsm -d hsm-db -f /docker-entrypoint-initdb.d/03_initial_data.sql
```

### 5. Docker コンテナ内でデータ確認

```bash
# PostgreSQLコンテナに接続
docker-compose exec db psql -U hsm -d hsm-db

# または
docker exec -it hsm-db psql -U hsm -d hsm-db
```

接続後、以下のコマンドでデータを確認できます：

#### psql 基本コマンド

```sql
-- データベース一覧表示
\l

-- 現在のデータベースに接続
\c hsm-db

-- テーブル一覧表示
\dt

-- テーブル一覧（詳細情報付き）
\dt+

-- ビュー一覧表示
\dv

-- すべてのテーブル・ビュー・シーケンスを表示
\d

-- 特定テーブルの構造確認（カラム、型、制約）
\d items
\d users
\d categories

-- 特定テーブルの詳細情報（サイズ、説明など）
\d+ items

-- インデックス一覧表示
\di

-- 特定テーブルのインデックス確認
\d items_pkey
\d idx_items_code

-- 外部キー制約の確認
\d item_attributes

-- シーケンス一覧表示
\ds

-- 拡張機能一覧表示
\dx

-- 現在のユーザー表示
\conninfo

-- SQL実行時間を表示
\timing on

-- 接続終了
\q
```

#### データ確認用 SQL

```sql
-- 全テーブルのデータ件数を一括確認
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_tup_ins AS inserts,
    n_tup_upd AS updates,
    n_tup_del AS deletes
FROM pg_stat_user_tables
ORDER BY tablename;

-- テーブル別データ件数
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM units;
SELECT COUNT(*) FROM attributes;
SELECT COUNT(*) FROM items;
SELECT COUNT(*) FROM item_attributes;
SELECT COUNT(*) FROM locations;
SELECT COUNT(*) FROM stocks;
SELECT COUNT(*) FROM stock_history;

-- アイテム一覧表示（最初の10件）
SELECT id, code, name, quantity, status, created_at FROM items LIMIT 10;

-- カテゴリマスタ全件表示
SELECT code, name, description FROM categories ORDER BY code;

-- 単位マスタ全件表示
SELECT code, name, description FROM units ORDER BY code;

-- カテゴリ別アイテム数
SELECT
    c.name AS category,
    COUNT(i.id) AS item_count
FROM categories c
LEFT JOIN items i ON c.id = i.category_id
WHERE i.deleted_at IS NULL
GROUP BY c.name
ORDER BY item_count DESC;

-- ステータス別アイテム数
SELECT
    status,
    COUNT(*) AS count
FROM items
WHERE deleted_at IS NULL
GROUP BY status;

-- 在庫数量が設定されているアイテム
SELECT
    i.code,
    i.name,
    i.quantity,
    u.name AS unit,
    c.name AS category
FROM items i
LEFT JOIN units u ON i.unit_id = u.id
LEFT JOIN categories c ON i.category_id = c.id
WHERE i.quantity IS NOT NULL
ORDER BY i.code;

-- 在庫履歴（最新10件）
SELECT
    sh.created_at,
    i.code AS item_code,
    i.name AS item_name,
    sh.qty_delta,
    sh.kind,
    sh.reason
FROM stock_history sh
JOIN items i ON sh.item_id = i.id
ORDER BY sh.created_at DESC
LIMIT 10;

-- アイテムと属性の関連
SELECT
    i.code AS item_code,
    i.name AS item_name,
    a.name AS attribute_name,
    ia.value AS attribute_value
FROM items i
JOIN item_attributes ia ON i.id = ia.item_id
JOIN attributes a ON ia.attribute_id = a.id
ORDER BY i.code, a.name;

-- ロケーション一覧
SELECT code, name, parent_id FROM locations ORDER BY code;

-- データベースサイズ確認
SELECT
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'hsm-db';
```

PowerShell 環境の場合：

```powershell
# コンテナに接続
docker-compose exec db psql -U hsm -d hsm-db

# ワンライナーでクエリ実行
docker-compose exec db psql -U hsm -d hsm-db -c "SELECT COUNT(*) FROM items;"
docker-compose exec db psql -U hsm -d hsm-db -c "\dt"
```

## ファイル詳細

### 00_extensions.sql

PostgreSQL の拡張機能を有効化します。

- **uuid-ossp**: UUID（Universally Unique Identifier）の生成機能
- **citext**: 大文字小文字を区別しない文字列型（メールアドレス等に使用）

### 01_create_tables.sql

全テーブルを作成します。以下のテーブルが含まれます：

| テーブル名        | 説明                                |
| ----------------- | ----------------------------------- |
| `users`           | ユーザー情報（認証・権限管理）      |
| `categories`      | カテゴリマスタ                      |
| `units`           | 単位マスタ（個、kg、ml 等）         |
| `attributes`      | 属性マスタ（ブランド、サイズ等）    |
| `items`           | アイテム（SKU）本体                 |
| `item_attributes` | アイテム × 属性の中間テーブル       |
| `locations`       | ロケーション（倉庫・棚）            |
| `stocks`          | 在庫数量（アイテム × ロケーション） |
| `stock_history`   | 入出庫履歴                          |
| `bulk_jobs`       | 一括処理ジョブ                      |
| `audit_logs`      | 監査ログ                            |

### 02_create_indexes.sql

パフォーマンス向上のためのインデックスを作成します。

- アイテム検索用（code, name, category_id 等）
- 在庫検索用（item_id, location_id）
- 履歴検索用（item_id, created_at）
- 監査ログ検索用（user_id, created_at）

### 03_initial_data.sql

動作確認用の最小限のサンプルデータを投入します。

- 管理者ユーザー 1 件（email: `admin@homestock.local`, password: `admin123`）
- カテゴリ 3 件（金具、消耗品、材料）
- 単位 5 件（個、ml、枚、kg、m）
- 属性 6 件（ブランド、仕様、サイズ等）
- ロケーション 4 件
- アイテム 8 件（ねじ、接着剤等）

### insert_sample_data.sql

開発・テスト用の追加サンプルデータを投入します。

- アイテム 57 件（多様なカテゴリ・属性）
- 在庫データ
- 入出庫履歴

**注意**: このファイルは開発環境専用です。本番環境では実行しないでください。

## 初期ログイン情報

`03_initial_data.sql` 実行後、以下の管理者アカウントでログイン可能です：

- **Email**: `admin@homestock.local`
- **Password**: `admin123`

**セキュリティ警告**: 本番環境では必ず初期パスワードを変更してください。

## データベースリセット

データベースを完全にリセットする場合：

```bash
# Docker環境の場合（推奨）
# ボリュームも含めて完全削除して再構築
docker-compose down -v
docker-compose up -d db

# ローカルPostgreSQLの場合
# 1. データベース削除
dropdb hsm-db

# 2. データベース再作成
createdb hsm-db

# 3. セットアップ手順を最初から実行
psql -U hsm -d hsm-db -f 00_extensions.sql
psql -U hsm -d hsm-db -f 01_create_tables.sql
psql -U hsm -d hsm-db -f 02_create_indexes.sql
psql -U hsm -d hsm-db -f 03_initial_data.sql
```

## マイグレーション管理

本番環境では、以下のマイグレーションツールの使用を推奨します：

- [golang-migrate](https://github.com/golang-migrate/migrate)
- [Flyway](https://flywaydb.org/)
- [Liquibase](https://www.liquibase.org/)

## トラブルシューティング

### エラー: 「relation already exists」

すでにテーブルが存在しています。`CREATE TABLE IF NOT EXISTS` を使用しているため通常は無視されますが、
スキーマを変更したい場合はデータベースをリセットしてください。

### エラー: 「foreign key constraint」

テーブル作成順序が正しくありません。必ず `00_extensions.sql` → `01_create_tables.sql` → `02_create_indexes.sql` の順序で実行してください。

### エラー: 「extension does not exist」

PostgreSQL に必要な拡張機能がインストールされていません。管理者権限で以下を実行：

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
```

### Docker 環境で初期化スクリプトが実行されない

Docker ボリュームに古いデータが残っている可能性があります：

```bash
# ボリューム削除（データが消えます！）
docker-compose down -v

# 再起動
docker-compose up -d
```

## 関連ドキュメント

- [プロジェクト概要](../README.md)
- [セットアップガイド](../SETUP.md)
- [トラブルシューティング](../TROUBLESHOOTING.md)
- [データベース設計書](../docs/setting.md)

## ライセンス

このプロジェクトのライセンスに従います。
