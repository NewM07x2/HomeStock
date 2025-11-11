# 接続エラー修正ガイド（ECONNREFUSED 対応）

## 問題の原因

Next.js の Server Component（サーバーサイドレンダリング）から`http://localhost:8080`で API を呼び出していましたが、Docker 環境ではこれが機能しません。

### なぜ問題が発生したか

1. **Server Component は Docker 内の Next.js コンテナで実行される**
   - `localhost`はコンテナ自身を指すため、go-app コンテナにアクセスできない
2. **Docker 内ではサービス名でアクセスする必要がある**

   - 正しい URL: `http://go-app:8080`（サービス名を使用）

3. **クライアントサイドとサーバーサイドで異なる URL が必要**
   - ブラウザ（クライアント）: `http://localhost:8080` ✓
   - Next.js サーバー（Docker 内）: `http://go-app:8080` ✓

## 修正内容

### 1. 環境変数の追加（`.env.local`）

```bash
# クライアントサイド用（ブラウザから）
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# サーバーサイド用（Server Component）
API_BASE_URL=http://go-app:8080
```

### 2. API 呼び出しの修正（`src/lib/api.ts`）

```typescript
// サーバーサイドかクライアントサイドかを判定
const apiBaseUrl =
  typeof window === 'undefined'
    ? process.env.API_BASE_URL || 'http://localhost:8080' // サーバー側
    : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080' // クライアント側
```

### 3. docker-compose.yml の更新

```yaml
environment:
  # クライアントサイド用
  - NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
  # サーバーサイド用
  - API_BASE_URL=http://go-app:8080
```

## 動作確認手順

### 1. コンテナの再起動

```bash
# 既存のコンテナを停止・削除
docker-compose down

# 再ビルド＆起動
docker-compose up --build -d

# ログを確認
docker-compose logs -f
```

### 2. 接続確認

```bash
# Goサーバーが起動しているか確認
docker-compose logs go-app

# 期待されるログ:
# ✓ データベース接続が確立されました
# 🚀 Server ready at http://localhost:8080
```

```bash
# Next.jsサーバーのログ確認
docker-compose logs next-app

# 期待されるログ:
# Fetching from: http://go-app:8080
# （エラーが出ていないこと）
```

### 3. ブラウザで確認

1. ブラウザで `http://localhost:3000` を開く
2. ホームページに「最新アイテム」が表示されることを確認
3. ブラウザのコンソールにエラーがないことを確認

### 4. API の直接確認

```bash
# ホストからGoサーバーに直接アクセス
curl http://localhost:8080/api/items?limit=10

# 期待されるレスポンス:
# {"items":[...],"total":...}
```

## トラブルシューティング

### エラー: ECONNREFUSED が継続する場合

1. **Go サーバーが起動しているか確認**

   ```bash
   docker-compose ps
   # go-hsm-app が Up 状態であることを確認
   ```

2. **ポートが正しくマップされているか確認**

   ```bash
   docker-compose port go-app 8080
   # 0.0.0.0:8080 と表示されることを確認
   ```

3. **環境変数が正しく設定されているか確認**
   ```bash
   docker-compose exec next-app printenv | grep API
   # API_BASE_URL=http://go-app:8080
   # NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

### エラー: Database connection failed

```bash
# DBコンテナが起動しているか確認
docker-compose ps db

# DBログを確認
docker-compose logs db

# DBに接続できるか確認（go-appコンテナから）
docker-compose exec go-app nc -zv db 5432
```

### ローカル開発（Docker 外）で実行する場合

`.env.local`を以下のように変更:

```bash
# 両方localhostを使用
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
API_BASE_URL=http://localhost:8080
```

## 参考情報

- Server Component: サーバーサイドで実行される React コンポーネント
- `typeof window === 'undefined'`: サーバーサイドかどうかを判定
- Docker 内のサービス名: `docker-compose.yml`の`services`で定義した名前
