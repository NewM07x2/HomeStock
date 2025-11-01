# HomeStock - セットアップ & 実行ガイド

## 📋 前提条件

- Docker Desktop がインストールされていること
- Docker Compose が利用可能であること

## 🚀 起動手順

### 1. リポジトリのクローン（既に済んでいる場合はスキップ）

```bash
git clone <repository-url>
cd HomeStock
```

### 2. 環境変数の設定

#### Go バックエンド

```bash
cd go-app
cp .env.example .env
# 必要に応じて .env ファイルを編集
cd ..
```

#### Next.js フロントエンド

```bash
cd next-app
cp .env.example .env.local
# 必要に応じて .env.local ファイルを編集
cd ..
```

### 3. Docker コンテナの起動

プロジェクトルートで以下を実行：

```bash
docker-compose up -d
```

初回起動時は、イメージのビルドと DB の初期化が行われるため、数分かかる場合があります。

### 4. 起動確認

#### バックエンド（Go API）

- URL: http://localhost:8080
- ヘルスチェック: http://localhost:8080/health
- GraphQL Playground: http://localhost:8080/graphql

#### フロントエンド（Next.js）

- URL: http://localhost:3000

#### データベース

- ホスト: localhost
- ポート: 5432
- ユーザー: hsm
- パスワード: hsm
- データベース: hsm-db

### 5. ログの確認

```bash
# すべてのサービスのログを確認
docker-compose logs -f

# 特定のサービスのログのみ確認
docker-compose logs -f go-app
docker-compose logs -f next-app
docker-compose logs -f db
```

## 🛠️ 開発

### コンテナの停止

```bash
docker-compose down
```

### コンテナの再起動

```bash
docker-compose restart
```

### データベースのリセット

```bash
docker-compose down -v  # ボリュームも削除
docker-compose up -d    # 再起動（DBが初期化される）
```

## 📊 API エンドポイント

### アイテム取得

```bash
# 最新のアイテム10件を取得
curl http://localhost:8080/api/items?limit=10
```

### GraphQL

```bash
# GraphQL クエリの例
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ items { id code name } }"}'
```

## 🐛 トラブルシューティング

### ポートが既に使用されている

別のアプリケーションがポート 3000 や 8080 を使用している場合、`docker-compose.yml`でポート番号を変更してください。

### DB 接続エラー

1. DB コンテナが起動しているか確認：

   ```bash
   docker-compose ps
   ```

2. DB のログを確認：

   ```bash
   docker-compose logs db
   ```

3. 環境変数が正しく設定されているか確認

### コンテナのビルドエラー

```bash
# キャッシュをクリアして再ビルド
docker-compose build --no-cache
docker-compose up -d
```

## 📁 プロジェクト構成

```
HomeStock/
├── go-app/          # Go バックエンド
│   ├── internal/    # 内部パッケージ
│   ├── main.go      # エントリーポイント
│   └── .env         # 環境変数
├── next-app/        # Next.js フロントエンド
│   ├── src/         # ソースコード
│   └── .env.local   # 環境変数
├── DB/              # データベース初期化スクリプト
│   └── init.sql     # テーブル定義 & サンプルデータ
├── docker/          # Dockerfile
└── docker-compose.yml
```

## 🔐 デフォルト認証情報

- 管理者ユーザー: admin@homestock.local
- パスワード: admin123（本番環境では必ず変更してください）

## 📝 サンプルデータ

初期化時に以下のサンプルデータが登録されます：

- アイテム: 8 件（SKU-0001 〜 SKU-0008）
- ロケーション: 4 件（倉庫・棚）
- ユーザー: 1 件（管理者）

## 🌐 本番環境へのデプロイ

本番環境では以下を考慮してください：

- 環境変数の適切な設定（DB パスワード等）
- HTTPS/TLS の有効化
- CORS 設定の厳格化
- レート制限の実装
- ログ監視の設定

---

開発を楽しんでください！ 🎉
