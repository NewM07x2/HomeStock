# HomeStock データベースガイド# HomeStock データベースセットアップガイド# HomeStock データベースセットアップガイド

HomeStock プロジェクトのデータベース初期化・管理の完全ガイドです。HomeStock プロジェクトのデータベース初期化・管理ガイドです。このディレクトリには、HomeStock プロジェクトのデータベース初期化スクリプトが含まれています。

## ファイル構成## ファイル構成## ファイル構成

````````

DB/

├── README.md                 # このファイルDB/DB/

├── 00_extensions.sql         # PostgreSQL拡張機能

├── 01_create_tables.sql      # テーブル定義（unit_price含む）├── README.md                 # このファイル├── README.md                 # このファイル

├── 02_create_indexes.sql     # インデックス定義

├── 03_initial_data.sql       # 初期サンプルデータ + 単価設定├── 00_extensions.sql         # PostgreSQL拡張機能├── 00_extensions.sql         # PostgreSQL拡張機能

└── insert_sample_data.sql    # 追加サンプルデータ（開発用）

```├── 01_create_tables.sql      # テーブル定義（unit_price含む）├── 01_create_tables.sql      # テーブル定義（unit_price含む）



### SQL実行順序├── 02_create_indexes.sql     # インデックス定義├── 02_create_indexes.sql     # インデックス定義



1. `00_extensions.sql` - PostgreSQL拡張機能（uuid-ossp, citext）├── 03_initial_data.sql       # 初期サンプルデータ + 単価設定├── 03_initial_data.sql       # 初期サンプルデータ + 単価設定

2. `01_create_tables.sql` - 全テーブル作成（unit_price, total_amountカラム含む）

3. `02_create_indexes.sql` - インデックス作成└── insert_sample_data.sql    # 追加サンプルデータ（開発用・大量）├── insert_sample_data.sql    # 追加サンプルデータ（開発用・大量）

4. `03_initial_data.sql` - 初期データ投入 + 単価設定

```└── MIGRATION.md              # マイグレーション手順書

---

```

## 初期セットアップ

### SQL実行順序

### Docker環境（推奨）

## セットアップ手順

**警告: 既存データは全て削除されます**

以下の順序で自動実行されます：

```powershell

# データベースを初期化### 1. 前提条件

docker-compose down -v

docker-compose up -d1. `00_extensions.sql` - PostgreSQL拡張機能（uuid-ossp, citext）



# Goバックエンドを再ビルド2. `01_create_tables.sql` - 全テーブル作成（unit_price, total_amountカラム含む）- PostgreSQL 12 以上がインストールされていること

docker-compose up -d --build go-app

3. `02_create_indexes.sql` - インデックス作成- データベース接続情報が設定されていること

# フロントエンドを再起動

docker-compose restart next-app4. `03_initial_data.sql` - 初期データ投入 + 単価設定- psql コマンドラインツールが利用可能であること

```



### 手動セットアップ（ローカルPostgreSQL）

## セットアップ手順### 2. データベース作成

```powershell

# データベース作成

createdb hsm-db

### Docker環境（推奨）```bash

# スクリプトを順番に実行

psql -U postgres -d hsm-db -f 00_extensions.sql# データベース作成（まだ存在しない場合）

psql -U postgres -d hsm-db -f 01_create_tables.sql

psql -U postgres -d hsm-db -f 02_create_indexes.sql**警告: 既存データは全て削除されます**createdb homestock

psql -U postgres -d hsm-db -f 03_initial_data.sql

```



---```powershell# または psql で



## データ確認# データベースを初期化psql -U postgres



### テーブル構造の確認docker-compose down -vCREATE DATABASE homestock;



```powershelldocker-compose up -d\q

# itemsテーブル（unit_priceカラムの確認）

docker-compose exec db psql -U hsm -d "hsm-db" -c "\d+ items"```



# stock_historyテーブル（unit_price, total_amountカラムの確認）# Goバックエンドを再ビルド（型定義の更新を反映）

docker-compose exec db psql -U hsm -d "hsm-db" -c "\d+ stock_history"

```docker-compose up -d --build go-app### 3. スクリプト実行



### データの確認



```powershell# フロントエンドを再起動**重要**: 以下の順序で実行してください。順序を間違えるとエラーになります。

# アイテムと単価を確認

docker-compose exec db psql -U hsm -d "hsm-db" -c "SELECT code, name, unit_price FROM items WHERE unit_price > 0 ORDER BY code;"docker-compose restart next-app

```

``````bash

**期待される出力:**

```# 1. 拡張機能の有効化

   code    |     name     | unit_price

-----------+--------------+------------### 手動実行（ローカルPostgreSQL）psql -U postgres -d homestock -f 00_extensions.sql

 HSM-0001  | ねじM5       |         50

 HSM-0002  | ナットM5     |         30

 HSM-0003  | ワッシャーM5 |         10

 ...```powershell# 2. テーブル作成（unit_priceカラム含む）

```

# データベース作成psql -U postgres -d homestock -f 01_create_tables.sql

---

createdb hsm-db

## スキーマ変更（カラム追加・テーブル変更）

# 3. インデックス作成

既存のデータベースにカラムを追加したり、テーブル構造を変更する手順です。

# スクリプトを順番に実行psql -U postgres -d homestock -f 02_create_indexes.sql

### 方法1: コンテナ内で直接実行（推奨）

psql -U postgres -d hsm-db -f 00_extensions.sql

```powershell

# PostgreSQLコンテナに接続psql -U postgres -d hsm-db -f 01_create_tables.sql# 4. 初期データ投入 + 単価設定

docker-compose exec db psql -U hsm -d "hsm-db"

```psql -U postgres -d hsm-db -f 02_create_indexes.sqlpsql -U postgres -d homestock -f 03_initial_data.sql



psql接続後：psql -U postgres -d hsm-db -f 03_initial_data.sql```



```sql```

-- カラム追加の例

ALTER TABLE items ADD COLUMN IF NOT EXISTS description TEXT;### 4. Docker 環境での実行

COMMENT ON COLUMN items.description IS 'アイテムの説明';

## データ確認

-- 確認

\d+ items`docker-compose.yml` を使用している場合、コンテナ起動時に自動実行されます。



-- 終了### テーブル構造の確認

\q

``````bash



### 方法2: SQLファイルを作成して実行```powershell# Dockerコンテナ起動（初回は自動的にスクリプトが実行されます）



1. **SQLファイルを作成** (`DB/04_add_description.sql`)# itemsテーブル（unit_priceカラムの確認）docker-compose up -d



```sqldocker-compose exec db psql -U hsm -d "hsm-db" -c "\d+ items"

ALTER TABLE items ADD COLUMN IF NOT EXISTS description TEXT;

COMMENT ON COLUMN items.description IS 'アイテムの説明';# 手動で実行する場合

```

# stock_historyテーブル（unit_price, total_amountカラムの確認）docker-compose exec db psql -U hsm -d hsm-db -f /docker-entrypoint-initdb.d/00_extensions.sql

2. **コンテナにコピーして実行**

docker-compose exec db psql -U hsm -d "hsm-db" -c "\d+ stock_history"docker-compose exec db psql -U hsm -d hsm-db -f /docker-entrypoint-initdb.d/01_create_tables.sql

```powershell

# ファイルをコンテナにコピー```docker-compose exec db psql -U hsm -d hsm-db -f /docker-entrypoint-initdb.d/02_create_indexes.sql

docker cp .\DB\04_add_description.sql hsm-db:/tmp/04_add_description.sql

docker-compose exec db psql -U hsm -d hsm-db -f /docker-entrypoint-initdb.d/03_initial_data.sql

# SQLファイルを実行

docker-compose exec db psql -U hsm -d "hsm-db" -f /tmp/04_add_description.sql### データの確認```

```



3. **変更を確認**

```powershell### 5. Docker コンテナ内でデータ確認

```powershell

docker-compose exec db psql -U hsm -d "hsm-db" -c "\d+ items"# アイテムと単価を確認

```

docker-compose exec db psql -U hsm -d "hsm-db" -c "SELECT code, name, unit_price FROM items WHERE unit_price > 0 ORDER BY code;"```bash

### よく使うマイグレーションコマンド

```# PostgreSQLコンテナに接続

```sql

-- カラム追加docker-compose exec db psql -U hsm -d hsm-db

ALTER TABLE table_name ADD COLUMN column_name TYPE;

ALTER TABLE table_name ADD COLUMN IF NOT EXISTS column_name TYPE DEFAULT value;**期待される出力:**



-- カラム削除```# または

ALTER TABLE table_name DROP COLUMN IF EXISTS column_name;

   code    |     name     | unit_pricedocker exec -it hsm-db psql -U hsm -d hsm-db

-- カラム名変更

ALTER TABLE table_name RENAME COLUMN old_name TO new_name;-----------+--------------+------------```



-- カラム型変更 HSM-0001  | ねじM5       |         50

ALTER TABLE table_name ALTER COLUMN column_name TYPE new_type;

 HSM-0002  | ナットM5     |         30接続後、以下のコマンドでデータを確認できます：

-- NOT NULL制約追加

ALTER TABLE table_name ALTER COLUMN column_name SET NOT NULL; HSM-0003  | ワッシャーM5 |         10



-- デフォルト値設定 ...#### psql 基本コマンド

ALTER TABLE table_name ALTER COLUMN column_name SET DEFAULT value;

```

-- インデックス作成

CREATE INDEX IF NOT EXISTS idx_name ON table_name(column_name);```sql

```

## 動作確認-- データベース一覧表示

### アプリケーション側の対応

\l

スキーマ変更後は、コードも更新する必要があります。

ブラウザでアプリケーションにアクセスして動作確認:

#### 1. Goバックエンド（internal/model/model.go）

-- 現在のデータベースに接続

```go

type Item struct {1. http://localhost:3000/ - ホーム画面で最新アイテムに金額表示\c hsm-db

    // ...既存フィールド

    Description *string `json:"description" db:"description"`2. http://localhost:3000/items - アイテム一覧で金額表示

}

```3. アイテム登録・編集時に金額入力欄が表示され、整数値が入力可能-- テーブル一覧表示



#### 2. TypeScriptフロントエンド（src/lib/api.ts）\dt



```typescript## 初期ログイン情報

export interface Item {

  // ...既存フィールド-- テーブル一覧（詳細情報付き）

  description?: string;

}- **Email**: `admin@homestock.local`\dt+

```

- **Password**: `admin123`

#### 3. アプリケーション再起動

-- ビュー一覧表示

```powershell

# Goバックエンドを再ビルド**注意**: 本番環境では必ず初期パスワードを変更してください。\dv

docker-compose up -d --build go-app



# フロントエンドを再起動

docker-compose restart next-app## トラブルシューティング-- すべてのテーブル・ビュー・シーケンスを表示

```

\d

---

### データベースが起動しない

## 初期ログイン情報

-- 特定テーブルの構造確認（カラム、型、制約）

- **Email**: `admin@homestock.local`

- **Password**: `admin123````powershell\d items



**注意**: 本番環境では必ず初期パスワードを変更してください。# コンテナの状態確認\d users



---docker-compose ps\d categories



## 動作確認



ブラウザでアプリケーションにアクセス:# ログ確認-- 特定テーブルの詳細情報（サイズ、説明など）



1. http://localhost:3000/ - ホーム画面で最新アイテムに金額表示docker-compose logs db\d+ items

2. http://localhost:3000/items - アイテム一覧で金額表示

3. アイテム登録・編集時に金額入力欄が表示され、整数値が入力可能



---# 再起動-- インデックス一覧表示



## トラブルシューティングdocker-compose restart db\di



### データベースが起動しない```



```powershell-- 特定テーブルのインデックス確認

# コンテナの状態確認

docker-compose ps### API エラー (500 Internal Server Error)\d items_pkey



# ログ確認\d idx_items_code

docker-compose logs db

```powershell

# 再起動

docker-compose restart db# Goアプリのログ確認-- 外部キー制約の確認

```

docker-compose logs go-app\d item_attributes

### API エラー (500 Internal Server Error)



```powershell

# Goアプリのログ確認# 再ビルド-- シーケンス一覧表示

docker-compose logs go-app

docker-compose up -d --build go-app\ds

# 再ビルド

docker-compose up -d --build go-app```

```

-- 拡張機能一覧表示

### 金額が表示されない

### 金額が表示されない\dx

```powershell

# データを確認

docker-compose exec db psql -U hsm -d "hsm-db" -c "SELECT code, name, unit_price FROM items ORDER BY code LIMIT 10;"

``````powershell-- 現在のユーザー表示



データがない場合は、データベースを再初期化してください（`docker-compose down -v && docker-compose up -d`）。# データを確認\conninfo



### ブラウザで古い表示が残るdocker-compose exec db psql -U hsm -d "hsm-db" -c "SELECT code, name, unit_price FROM items ORDER BY code LIMIT 10;"



```powershell```-- SQL実行時間を表示

# Next.jsを再起動

docker-compose restart next-app\timing on

```

データがない場合は、`03_initial_data.sql`が正しく実行されていません。データベースを再初期化してください。

ブラウザのキャッシュをクリアして、強制リロード（Ctrl+Shift+R）してください。

-- 接続終了

---

### ブラウザで古い表示が残る\q

## psqlコマンド参考

```

```powershell

# PostgreSQLコンテナに接続```powershell

docker-compose exec db psql -U hsm -d hsm-db

```# Next.jsを再起動#### データ確認用 SQL



### 基本コマンドdocker-compose restart next-app



```sql``````sql

\l              -- データベース一覧

\dt             -- テーブル一覧-- 全テーブルのデータ件数を一括確認

\d items        -- itemsテーブルの構造

\d+ items       -- itemsテーブルの詳細情報ブラウザのキャッシュをクリアして、強制リロード（Ctrl+Shift+R）してください。SELECT

\di             -- インデックス一覧

\q              -- 終了    schemaname,

```

## psqlコマンド（参考）    tablename,

### データ確認SQL

    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,

```sql

-- 全テーブルのレコード数```powershell    n_tup_ins AS inserts,

SELECT COUNT(*) FROM users;

SELECT COUNT(*) FROM categories;# PostgreSQLコンテナに接続    n_tup_upd AS updates,

SELECT COUNT(*) FROM items;

docker-compose exec db psql -U hsm -d hsm-db    n_tup_del AS deletes

-- アイテム一覧（最初の10件）

SELECT code, name, quantity, unit_price FROM items LIMIT 10;```FROM pg_stat_user_tables



-- カテゴリ別アイテム数ORDER BY tablename;

SELECT c.name AS category, COUNT(i.id) AS item_count

FROM categories c### 基本コマンド

LEFT JOIN items i ON c.id = i.category_id

WHERE i.deleted_at IS NULL-- テーブル別データ件数

GROUP BY c.name;

```sqlSELECT COUNT(*) FROM users;

-- 在庫履歴（最新10件）

SELECT sh.created_at, i.code, i.name, sh.qty_delta, sh.unit_price, sh.total_amount\l              -- データベース一覧SELECT COUNT(*) FROM categories;

FROM stock_history sh

JOIN items i ON sh.item_id = i.id\dt             -- テーブル一覧SELECT COUNT(*) FROM units;

ORDER BY sh.created_at DESC

LIMIT 10;\d items        -- itemsテーブルの構造SELECT COUNT(*) FROM attributes;

```

\d+ items       -- itemsテーブルの詳細情報SELECT COUNT(*) FROM items;

---

\di             -- インデックス一覧SELECT COUNT(*) FROM item_attributes;

## データベースリセット

\q              -- 終了SELECT COUNT(*) FROM locations;

```powershell

# Docker環境（推奨）```SELECT COUNT(*) FROM stocks;

docker-compose down -v

docker-compose up -dSELECT COUNT(*) FROM stock_history;



# ローカルPostgreSQL### データ確認SQL

dropdb hsm-db

createdb hsm-db-- アイテム一覧表示（最初の10件）

psql -U postgres -d hsm-db -f 00_extensions.sql

psql -U postgres -d hsm-db -f 01_create_tables.sql```sqlSELECT id, code, name, quantity, status, created_at FROM items LIMIT 10;

psql -U postgres -d hsm-db -f 02_create_indexes.sql

psql -U postgres -d hsm-db -f 03_initial_data.sql-- 全テーブルのレコード数

```

SELECT COUNT(*) FROM users;-- カテゴリマスタ全件表示

---

SELECT COUNT(*) FROM categories;SELECT code, name, description FROM categories ORDER BY code;

## 関連ドキュメント

SELECT COUNT(*) FROM items;

- [プロジェクト概要](../README.md)

- [セットアップガイド](../SETUP.md)-- 単位マスタ全件表示

- [トラブルシューティング](../TROUBLESHOOTING.md)

-- アイテム一覧（最初の10件）SELECT code, name, description FROM units ORDER BY code;

SELECT code, name, quantity, unit_price FROM items LIMIT 10;

-- カテゴリ別アイテム数

-- カテゴリ別アイテム数SELECT

SELECT c.name AS category, COUNT(i.id) AS item_count    c.name AS category,

FROM categories c    COUNT(i.id) AS item_count

LEFT JOIN items i ON c.id = i.category_idFROM categories c

WHERE i.deleted_at IS NULLLEFT JOIN items i ON c.id = i.category_id

GROUP BY c.name;WHERE i.deleted_at IS NULL

GROUP BY c.name

-- 在庫履歴（最新10件）ORDER BY item_count DESC;

SELECT sh.created_at, i.code, i.name, sh.qty_delta, sh.unit_price, sh.total_amount

FROM stock_history sh-- ステータス別アイテム数

JOIN items i ON sh.item_id = i.idSELECT

ORDER BY sh.created_at DESC    status,

LIMIT 10;    COUNT(*) AS count

```FROM items

WHERE deleted_at IS NULL

## 関連ドキュメントGROUP BY status;



- [プロジェクト概要](../README.md)-- 在庫数量が設定されているアイテム

- [セットアップガイド](../SETUP.md)SELECT

- [トラブルシューティング](../TROUBLESHOOTING.md)    i.code,

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

## スキーマ変更（カラム追加・テーブル変更）

既存のデータベースにカラムを追加したり、テーブル構造を変更する場合の手順です。

### 1. マイグレーションファイルの作成

新しいSQLファイルを作成します（例: `04_add_new_column.sql`）：

```sql
-- 例: itemsテーブルにdescriptionカラムを追加
ALTER TABLE items ADD COLUMN IF NOT EXISTS description TEXT;
COMMENT ON COLUMN items.description IS 'アイテムの説明';

-- 例: デフォルト値を設定
ALTER TABLE items ALTER COLUMN description SET DEFAULT '';

-- 例: NOT NULL制約を追加（既存データに影響がないか確認後）
-- ALTER TABLE items ALTER COLUMN description SET NOT NULL;
```

### 2. Docker環境での適用

#### 方法1: コンテナに接続して直接実行（推奨）

```powershell
# SQLファイルをコンテナ内から実行
docker-compose exec db psql -U hsm -d "hsm-db" -f /docker-entrypoint-initdb.d/04_add_new_column.sql

# または、コンテナに接続してSQLを直接実行
docker-compose exec db psql -U hsm -d "hsm-db"
```

psqlに接続後：

```sql
-- カラム追加
ALTER TABLE items ADD COLUMN IF NOT EXISTS description TEXT;

-- 変更確認
\d+ items

-- 終了
\q
```

#### 方法2: ホストからファイルをコピーして実行

```powershell
# SQLファイルをコンテナにコピー
docker cp .\DB\04_add_new_column.sql hsm-db:/tmp/04_add_new_column.sql

# コピーしたファイルを実行
docker-compose exec db psql -U hsm -d "hsm-db" -f /tmp/04_add_new_column.sql
```

#### 方法3: docker-compose.ymlに追加して再初期化

**警告: この方法は全てのデータを削除します**

1. `docker-compose.yml`のvolumesセクションに追加：

```yaml
volumes:
  - ./DB/04_add_new_column.sql:/docker-entrypoint-initdb.d/04_add_new_column.sql
```

2. データベースを再初期化：

```powershell
docker-compose down -v
docker-compose up -d
```

### 3. 手動実行（ローカルPostgreSQL）

```powershell
# SQLファイルを実行
psql -U postgres -d hsm-db -f DB/04_add_new_column.sql

# または対話的に実行
psql -U postgres -d hsm-db
```

### 4. 変更確認

```powershell
# テーブル構造を確認
docker-compose exec db psql -U hsm -d "hsm-db" -c "\d+ items"

# データを確認
docker-compose exec db psql -U hsm -d "hsm-db" -c "SELECT code, name, description FROM items LIMIT 5;"
```

### 5. アプリケーション側の対応

スキーマ変更後は、以下の対応が必要です：

1. **Goバックエンド**: モデル定義を更新

```go
// internal/model/model.go
type Item struct {
    // ...
    Description *string `json:"description" db:"description"`
}
```

2. **フロントエンド**: TypeScript型定義を更新

```typescript
// src/lib/api.ts
export interface Item {
  // ...
  description?: string;
}
```

3. **アプリケーションを再起動**

```powershell
# Goバックエンドを再ビルド
docker-compose up -d --build go-app

# フロントエンドを再起動
docker-compose restart next-app
```

### よくあるスキーマ変更のパターン

#### カラム追加

```sql
ALTER TABLE table_name ADD COLUMN column_name DATA_TYPE;
ALTER TABLE table_name ADD COLUMN IF NOT EXISTS column_name DATA_TYPE DEFAULT default_value;
```

#### カラム削除

```sql
ALTER TABLE table_name DROP COLUMN IF EXISTS column_name;
```

#### カラム名変更

```sql
ALTER TABLE table_name RENAME COLUMN old_name TO new_name;
```

#### カラム型変更

```sql
ALTER TABLE table_name ALTER COLUMN column_name TYPE new_type;
-- 型変換が必要な場合
ALTER TABLE table_name ALTER COLUMN column_name TYPE new_type USING column_name::new_type;
```

#### NOT NULL制約追加

```sql
-- 既存データにNULLがないことを確認後
ALTER TABLE table_name ALTER COLUMN column_name SET NOT NULL;
```

#### デフォルト値設定

```sql
ALTER TABLE table_name ALTER COLUMN column_name SET DEFAULT default_value;
```

#### インデックス追加

```sql
CREATE INDEX IF NOT EXISTS idx_table_column ON table_name(column_name);
```

### マイグレーション管理ツール

本番環境では、以下のマイグレーションツールの使用を推奨します：

- [golang-migrate](https://github.com/golang-migrate/migrate) - Go製、シンプルで軽量
- [Flyway](https://flywaydb.org/) - Java製、エンタープライズ向け
- [Liquibase](https://www.liquibase.org/) - XML/YAML形式、複雑な変更に対応

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
```````
````````
