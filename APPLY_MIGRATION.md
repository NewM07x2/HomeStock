# DB マイグレーション適用手順

## 概要

アイテムテーブルに `unit_price` カラムを追加し、在庫履歴テーブルに `unit_price` と `total_amount` カラムを追加するマイグレーションを適用します。

## 前提条件

- Docker コンテナが起動していること
- PostgreSQL コンテナ名: `hsm-db`
- データベース名: `hsm-db`
- ユーザー名: `hsm`

## 手順

### 方法 1: コンテナ内で直接 SQL ファイルを実行（推奨）

```powershell
# Docker内にマウント済みのSQLファイルを実行
docker-compose exec db psql -U hsm -d "hsm-db" -f /docker-entrypoint-initdb.d/04_add_price_columns.sql
```

**期待される出力:**

```
ALTER TABLE
ALTER TABLE
ALTER TABLE
```

### 方法 2: ホストからファイルをコピーして実行

```powershell
# SQLファイルをコンテナにコピー
docker cp .\DB\04_add_price_columns.sql hsm-db:/tmp/04_add_price_columns.sql

# コピーしたファイルを実行
docker exec -it hsm-db psql -U hsm -d "hsm-db" -f /tmp/04_add_price_columns.sql
```

### 方法 3: DB 初期化スクリプトを使用（データ消失に注意）

**警告: この方法は全てのデータを削除します！**

```powershell
# DBボリュームを削除して再作成（全データ消失）
docker-compose down -v
docker-compose up -d
```

## マイグレーション確認

### カラムが追加されたことを確認

```powershell
# itemsテーブルの構造を確認
docker-compose exec db psql -U hsm -d "hsm-db" -c "\d+ items"

# stock_historyテーブルの構造を確認
docker-compose exec db psql -U hsm -d "hsm-db" -c "\d+ stock_history"
```

### サンプルデータに金額を追加

```powershell
# 03_initial_data.sqlに追加されたUPDATE文を実行
docker-compose exec db psql -U hsm -d "hsm-db" -c "UPDATE items SET unit_price = 50 WHERE code = 'HSM-0001';"
docker-compose exec db psql -U hsm -d "hsm-db" -c "UPDATE items SET unit_price = 30 WHERE code = 'HSM-0002';"
docker-compose exec db psql -U hsm -d "hsm-db" -c "UPDATE items SET unit_price = 10 WHERE code = 'HSM-0003';"
docker-compose exec db psql -U hsm -d "hsm-db" -c "UPDATE items SET unit_price = 100 WHERE code = 'HSM-0004';"
```

### データを確認

```powershell
docker-compose exec db psql -U hsm -d "hsm-db" -c "SELECT code, name, unit_price FROM items WHERE unit_price IS NOT NULL;"
```

## Go アプリケーションの再起動

マイグレーション適用後、Go バックエンドを再起動します。

```powershell
docker-compose restart go-app
```

## Next.js アプリケーションの確認

ブラウザで以下を確認:

1. http://localhost:3000 - ホーム画面の最新アイテムに金額が表示されること
2. http://localhost:3000/items - アイテム管理画面のテーブルに金額列が表示されること
3. アイテム登録・編集時に金額入力欄が表示されること
4. http://localhost:3000/reports - レポート画面が正常に表示されること

## トラブルシューティング

### エラー: column "unit_price" does not exist

マイグレーションが適用されていません。上記の手順 1 または 2 を実行してください。

### エラー: Connection refused

1. Docker コンテナが起動しているか確認:

   ```powershell
   docker-compose ps
   ```

2. Go アプリケーションのログを確認:
   ```powershell
   docker-compose logs go-app
   ```

### 金額が表示されない

1. DB にデータが入っているか確認:

   ```powershell
   docker-compose exec db psql -U hsm -d "hsm-db" -c "SELECT code, name, unit_price FROM items LIMIT 5;"
   ```

2. ブラウザのキャッシュをクリアして再読み込み

## 完了

マイグレーション適用が完了したら、アプリケーション全体をテストしてください。
