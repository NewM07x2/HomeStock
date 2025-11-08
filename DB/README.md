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
docker-compose exec db psql -U postgres -d homestock -f /docker-entrypoint-initdb.d/00_extensions.sql
docker-compose exec db psql -U postgres -d homestock -f /docker-entrypoint-initdb.d/01_create_tables.sql
docker-compose exec db psql -U postgres -d homestock -f /docker-entrypoint-initdb.d/02_create_indexes.sql
docker-compose exec db psql -U postgres -d homestock -f /docker-entrypoint-initdb.d/03_initial_data.sql
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
# 1. データベース削除
dropdb homestock

# 2. データベース再作成
createdb homestock

# 3. セットアップ手順を最初から実行
psql -U postgres -d homestock -f 00_extensions.sql
psql -U postgres -d homestock -f 01_create_tables.sql
psql -U postgres -d homestock -f 02_create_indexes.sql
psql -U postgres -d homestock -f 03_initial_data.sql
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
