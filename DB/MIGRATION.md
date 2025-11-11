# データベースマイグレーション手順

## Docker 環境での適用

### 新規構築時

`04_add_price_columns.sql`は`docker-compose.yml`に含まれているため、初回起動時に自動実行されます。

```bash
docker-compose up -d
```

### 既存の DB コンテナがある場合

既存のコンテナとボリュームを削除して、再作成します。

```bash
# コンテナとボリュームを停止・削除
docker-compose down -v

# 再起動（マイグレーションSQLが自動実行されます）
docker-compose up -d
```

**注意**: `-v`オプションを使用すると、既存のデータがすべて削除されます。

## ローカル開発環境での適用

Docker を使わずにローカルの PostgreSQL を使用している場合、以下のコマンドでマイグレーションを手動実行してください。

```bash
# PostgreSQLに接続してマイグレーションを実行
psql -U hsm -d hsm-db -f DB/04_add_price_columns.sql

# または、ユーザー名が異なる場合
psql -U postgres -d homestock -f DB/04_add_price_columns.sql
```

## マイグレーション内容

`04_add_price_columns.sql`は以下のカラムを追加します：

- `items`テーブル:
  - `unit_price`: アイテムの単価（円）
- `stock_history`テーブル:
  - `unit_price`: 取引時のアイテム単価（円）
  - `total_amount`: 取引金額（qty_delta × unit_price）

## 既存データへの対応

マイグレーション実行後、既存データに単価情報を設定する場合：

```sql
-- 既存アイテムに仮の単価を設定（例: 1000円）
UPDATE items SET unit_price = 1000 WHERE unit_price IS NULL OR unit_price = 0;

-- 既存履歴に金額を設定
UPDATE stock_history
SET unit_price = 1000,
    total_amount = ABS(qty_delta) * 1000
WHERE unit_price IS NULL OR unit_price = 0;
```

1. docker exec を使用して直接実行
SQL ファイルがコンテナ内に存在する場合、以下のコマンドで実行できます：

docker exec -it hsm-db psql -U hsm -d "hsm-db" -f /docker-entrypoint-initdb.d/04_add_price_columns.sql


2. docker cp を使用してファイルをコピーしてから実行
SQL ファイルがコンテナ内に存在しない場合、ホストからコンテナにコピーして実行します：
docker cp .\DB\04_add_price_columns.sql hsm-db:/tmp/04_add_price_columns.sql
docker exec -it hsm-db psql -U hsm -d "hsm-db" -f /tmp/04_add_price_columns.sql