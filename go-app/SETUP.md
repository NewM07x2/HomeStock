# Go バックエンド 再構築完了レポート

**作成日**: 2025年10月18日  
**プロジェクト**: HomeStock  
**バックエンド**: Go + GraphQL + PostgreSQL

---

## 📋 実施内容サマリー

エラーが解消できなかったため、`go-app`ディレクトリを完全に削除して、最初から正しく再構築しました。

### 実施した主な作業

1. ✅ 既存のgo-appディレクトリを完全削除
2. ✅ 新しいGoモジュールの初期化 (`go-hsm-app`)
3. ✅ 必要な依存関係のインストール
4. ✅ GraphQLスキーマとgqlgen設定の作成
5. ✅ gqlgenによるコード生成
6. ✅ データベース接続の実装
7. ✅ GraphQLリゾルバの実装（全CRUD操作）
8. ✅ メインサーバーファイルの作成
9. ✅ ビルド成功確認
10. ✅ データベーススキーマの更新

---

## 🏗️ プロジェクト構造

```
go-app/
├── main.go                    # エントリーポイント（Echoサーバー）
├── go.mod                     # Goモジュール定義
├── go.sum                     # 依存関係のチェックサム
├── gqlgen.yml                # gqlgen設定ファイル
├── schema.graphql            # GraphQLスキーマ定義
├── homestock-server.exe      # ビルド済み実行ファイル
├── .env.example              # 環境変数テンプレート
├── README.md                 # プロジェクトドキュメント
│
├── database/
│   └── db.go                 # PostgreSQL接続管理
│
└── graph/
    ├── resolver.go           # リゾルバルート（依存性注入）
    ├── schema.resolvers.go   # リゾルバ実装（自動生成+編集）
    ├── model/
    │   ├── model.go          # カスタムモデル
    │   └── models_gen.go     # 自動生成モデル
    └── generated/
        └── generated.go      # gqlgen自動生成コード
```

---

## 📦 インストール済み依存関係

### 主要パッケージ

```go
github.com/99designs/gqlgen v0.17.81     // GraphQLサーバー
github.com/labstack/echo/v4 v4.13.4      // Webフレームワーク
github.com/lib/pq v1.10.9                // PostgreSQLドライバ
```

### 補助パッケージ

- `github.com/vektah/gqlparser/v2` - GraphQLパーサー
- `github.com/labstack/echo/v4/middleware` - Echoミドルウェア
- その他、gqlgenが必要とする依存関係

---

## 🗄️ データベーススキーマ

### items テーブル

```sql
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
```

### サンプルデータ

```sql
INSERT INTO items (name, description, quantity) VALUES
    ('サンプル商品1', '最初のサンプル商品です', 10),
    ('サンプル商品2', '2番目のサンプル商品です', 5)
ON CONFLICT DO NOTHING;
```

---

## 🔌 GraphQL スキーマ

### Query

```graphql
type Query {
  items: [Item!]!           # 全アイテムを取得
  item(id: ID!): Item       # 特定のアイテムを取得
}
```

### Mutation

```graphql
type Mutation {
  createItem(input: NewItem!): Item!              # アイテム作成
  updateItem(id: ID!, input: UpdateItem!): Item!  # アイテム更新
  deleteItem(id: ID!): Boolean!                   # アイテム削除
}
```

### Type

```graphql
type Item {
  id: ID!
  name: String!
  description: String
  quantity: Int!
  createdAt: String!
  updatedAt: String!
}

input NewItem {
  name: String!
  description: String
  quantity: Int!
}

input UpdateItem {
  name: String
  description: String
  quantity: Int
}
```

---

## 💻 実装詳細

### 1. データベース接続 (`database/db.go`)

```go
var DB *sql.DB

func InitDB() error {
    // 環境変数から接続情報を取得
    host := getEnv("DB_HOST", "localhost")
    port := getEnv("DB_PORT", "5432")
    user := getEnv("DB_USER", "postgres")
    password := getEnv("DB_PASSWORD", "postgres")
    dbname := getEnv("DB_NAME", "homestock")
    
    // PostgreSQLに接続
    connStr := fmt.Sprintf(...)
    DB, err = sql.Open("postgres", connStr)
    
    // 接続確認
    if err = DB.Ping(); err != nil {
        return fmt.Errorf("failed to ping database: %w", err)
    }
    
    return nil
}
```

### 2. リゾルバ実装 (`graph/schema.resolvers.go`)

#### Items Query - 全アイテム取得

```go
func (r *queryResolver) Items(ctx context.Context) ([]*model.Item, error) {
    query := `SELECT id, name, description, quantity, created_at, updated_at 
              FROM items ORDER BY created_at DESC`
    
    rows, err := r.DB.QueryContext(ctx, query)
    // ... 結果をスキャンしてItemスライスを返す
}
```

#### Item Query - 単一アイテム取得

```go
func (r *queryResolver) Item(ctx context.Context, id string) (*model.Item, error) {
    query := `SELECT id, name, description, quantity, created_at, updated_at 
              FROM items WHERE id = $1`
    
    err := r.DB.QueryRowContext(ctx, query, id).Scan(...)
    // ... 結果を返す
}
```

#### CreateItem Mutation - アイテム作成

```go
func (r *mutationResolver) CreateItem(ctx context.Context, input model.NewItem) (*model.Item, error) {
    query := `INSERT INTO items (name, description, quantity, created_at, updated_at)
              VALUES ($1, $2, $3, NOW(), NOW())
              RETURNING id, name, description, quantity, created_at, updated_at`
    
    err := r.DB.QueryRowContext(ctx, query, input.Name, input.Description, input.Quantity).Scan(...)
    // ... 作成されたアイテムを返す
}
```

#### UpdateItem Mutation - アイテム更新

```go
func (r *mutationResolver) UpdateItem(ctx context.Context, id string, input model.UpdateItem) (*model.Item, error) {
    query := `UPDATE items
              SET name = COALESCE($1, name),
                  description = COALESCE($2, description),
                  quantity = COALESCE($3, quantity),
                  updated_at = NOW()
              WHERE id = $4
              RETURNING id, name, description, quantity, created_at, updated_at`
    
    err := r.DB.QueryRowContext(ctx, query, input.Name, input.Description, input.Quantity, id).Scan(...)
    // ... 更新されたアイテムを返す
}
```

#### DeleteItem Mutation - アイテム削除

```go
func (r *mutationResolver) DeleteItem(ctx context.Context, id string) (bool, error) {
    query := `DELETE FROM items WHERE id = $1`
    
    result, err := r.DB.ExecContext(ctx, query, id)
    rowsAffected, _ := result.RowsAffected()
    
    return rowsAffected > 0, nil
}
```

### 3. メインサーバー (`main.go`)

```go
func main() {
    // データベース初期化
    if err := database.InitDB(); err != nil {
        log.Fatalf("Failed to initialize database: %v", err)
    }
    defer database.CloseDB()

    // Echoインスタンス作成
    e := echo.New()
    
    // ミドルウェア設定
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())
    e.Use(middleware.CORS())

    // GraphQLハンドラー
    srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{
        Resolvers: &graph.Resolver{
            DB: database.DB,
        },
    }))

    // エンドポイント設定
    e.GET("/health", healthCheckHandler)
    e.POST("/graphql", echo.WrapHandler(srv))
    e.GET("/graphql", echo.WrapHandler(playground.Handler("GraphQL Playground", "/graphql")))

    // サーバー起動
    e.Start(":8080")
}
```

---

## 🚀 起動方法

### 1. データベースを起動（Docker使用）

```bash
# プロジェクトルートから実行
cd c:\Users\masato.nitta\mnitta\my-devlop\HomeStock
docker-compose up -d
```

### 2. Goサーバーを起動

#### 方法A: `go run`で直接実行

```bash
cd go-app
go run main.go
```

#### 方法B: ビルド済みバイナリを実行

```bash
cd go-app
.\homestock-server.exe
```

### 3. 起動確認

サーバーが起動すると以下のログが表示されます：

```
✓ Database connection established
🚀 Server ready at http://localhost:8080
📊 GraphQL Playground at http://localhost:8080/graphql
```

---

## 🧪 動作確認方法

### 1. ヘルスチェック

```bash
curl http://localhost:8080/health
```

**期待される応答:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

### 2. GraphQL Playground

ブラウザで以下のURLを開く：
```
http://localhost:8080/graphql
```

### 3. GraphQLクエリのサンプル

#### 全アイテム取得

```graphql
query GetAllItems {
  items {
    id
    name
    description
    quantity
    createdAt
    updatedAt
  }
}
```

#### 特定アイテム取得

```graphql
query GetItem {
  item(id: "1") {
    id
    name
    description
    quantity
  }
}
```

#### アイテム作成

```graphql
mutation CreateNewItem {
  createItem(input: {
    name: "テスト商品"
    description: "これはテスト商品です"
    quantity: 15
  }) {
    id
    name
    quantity
    createdAt
  }
}
```

#### アイテム更新

```graphql
mutation UpdateExistingItem {
  updateItem(id: "1", input: {
    quantity: 20
  }) {
    id
    name
    quantity
    updatedAt
  }
}
```

#### アイテム削除

```graphql
mutation DeleteExistingItem {
  deleteItem(id: "1")
}
```

---

## 🔧 環境変数

`.env.example`をコピーして`.env`を作成し、必要に応じて設定を変更：

```env
# データベース設定
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=homestock

# サーバー設定
PORT=8080
```

---

## ✅ 解決した問題

### 以前の問題点

1. ❌ インポートサイクルエラー
2. ❌ gqlgenコード生成失敗
3. ❌ パッケージ構造の不適切な設定
4. ❌ 依存関係の未解決

### 解決方法

1. ✅ 適切なディレクトリ構造を設計
   - `graph/model/` - モデル定義
   - `graph/generated/` - 自動生成コード
   - `database/` - データベースロジック
   
2. ✅ `gqlgen.yml`の正しい設定
   - 適切なパッケージパスの指定
   - ファイル生成先の明示的な設定
   
3. ✅ `Resolver`構造体にDB依存性注入
   ```go
   type Resolver struct {
       DB *sql.DB
   }
   ```

4. ✅ すべてのリゾルバでデータベース操作を実装
   - エラーハンドリングの追加
   - NULL値の適切な処理

---

## 📚 参考情報

### 使用技術

- **Go**: 1.21+
- **gqlgen**: v0.17.81
- **Echo**: v4.13.4
- **PostgreSQL**: 14+

### 関連ドキュメント

- [gqlgen公式ドキュメント](https://gqlgen.com/)
- [Echo公式ドキュメント](https://echo.labstack.com/)
- [GraphQL仕様](https://graphql.org/learn/)

---

## 🎯 次のステップ

### 推奨される追加実装

1. **認証・認可**
   - JWTトークンによる認証
   - ユーザーロール管理

2. **バリデーション**
   - 入力値の検証
   - カスタムバリデータ

3. **エラーハンドリング**
   - カスタムエラー型
   - エラーコードの標準化

4. **テスト**
   - ユニットテスト
   - 統合テスト

5. **パフォーマンス最適化**
   - DataLoaderの実装
   - キャッシング戦略

6. **ログ管理**
   - 構造化ログ
   - ログレベルの設定

7. **モニタリング**
   - メトリクス収集
   - APM統合

---

## 📝 メモ

- ビルドは成功しており、実行可能ファイル(`homestock-server.exe`)が生成されています
- データベーススキーマは`DB/init.sql`に定義されています
- GraphQL Playgroundは開発環境でのみ有効にすることを推奨します
- 本番環境では環境変数を適切に設定してください

---

**構築完了日時**: 2025年10月18日  
**ステータス**: ✅ 構築完了・ビルド成功
