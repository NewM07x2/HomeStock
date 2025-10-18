# 🚀 Go Backend First Guide - 初心者向け完全ガイド

**対象者**: Go言語初心者、GraphQL初学者  
**作成日**: 2025年10月18日  
**プロジェクト**: HomeStock Backend API

---

## 📚 目次

1. [はじめに](#はじめに)
2. [プロジェクト全体像](#プロジェクト全体像)
3. [各ファイルの役割](#各ファイルの役割)
4. [コードの流れを追う](#コードの流れを追う)
5. [GraphQLの基礎](#graphqlの基礎)
6. [実践：APIを呼び出してみる](#実践apiを呼び出してみる)
7. [よくある質問](#よくある質問)
8. [トラブルシューティング](#トラブルシューティング)

---

## はじめに

### このガイドで学べること

- ✅ Goバックエンドの基本構造
- ✅ GraphQL APIの仕組み
- ✅ データベース連携の方法
- ✅ コードがどのように動いているか
- ✅ 実際にAPIを使う方法

### 前提知識

最低限、以下を知っていると理解しやすいです：

- Go言語の基本文法（変数、関数、構造体）
- HTTPの基礎（GET、POSTなど）
- データベースの基本概念（テーブル、行、列）

---

## プロジェクト全体像

### 🏗️ アーキテクチャ図

```
┌─────────────────────────────────────────────────────────┐
│                     クライアント                          │
│              (ブラウザ、Next.jsアプリなど)                 │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP Request (GraphQL)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    main.go (サーバー)                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Echo Web Framework                       │   │
│  │  - ルーティング                                    │   │
│  │  - ミドルウェア                                    │   │
│  │  - リクエスト/レスポンス処理                        │   │
│  └─────────────────┬───────────────────────────────┘   │
└────────────────────┼────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            GraphQL Layer (gqlgen)                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  schema.graphql                                   │  │
│  │  - Query定義                                       │  │
│  │  - Mutation定義                                    │  │
│  │  - Type定義                                        │  │
│  └──────────────┬───────────────────────────────────┘  │
│                 │                                        │
│  ┌──────────────▼───────────────────────────────────┐  │
│  │  graph/resolver.go & schema.resolvers.go         │  │
│  │  - クエリの実装                                     │  │
│  │  - ミューテーションの実装                            │  │
│  └──────────────┬───────────────────────────────────┘  │
└─────────────────┼──────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              database/db.go                              │
│  - PostgreSQL接続管理                                     │
│  - SQL実行                                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                PostgreSQL Database                       │
│  - itemsテーブル                                          │
│  - tasksテーブル                                          │
└─────────────────────────────────────────────────────────┘
```

### 📁 ディレクトリ構造（詳細）

```
go-app/
│
├── main.go                      # 🎯 エントリーポイント（ここから実行開始）
│                                #    サーバーの起動とルーティング設定
│
├── schema.graphql               # 📝 GraphQLスキーマ定義
│                                #    APIの仕様書のようなもの
│
├── gqlgen.yml                   # ⚙️ gqlgenの設定ファイル
│                                #    コード生成の設定
│
├── go.mod                       # 📦 依存関係管理
├── go.sum                       # 🔒 依存関係のチェックサム
│
├── database/                    # 🗄️ データベース関連
│   └── db.go                   #    PostgreSQL接続管理
│
├── graph/                       # 🔷 GraphQL関連
│   ├── resolver.go             #    リゾルバのルート構造体
│   ├── schema.resolvers.go     #    リゾルバの実装（Query/Mutation）
│   │
│   ├── model/                  #    モデル定義
│   │   ├── model.go           #    カスタムモデル
│   │   └── models_gen.go      #    自動生成されたモデル
│   │
│   └── generated/              #    gqlgen自動生成コード
│       └── generated.go       #    実行スキーマ
│
├── .env.example                # 🔐 環境変数のテンプレート
├── README.md                   # 📖 プロジェクト説明
└── SETUP.md                    # 🛠️ セットアップガイド
```

---

## 各ファイルの役割

### 1️⃣ `main.go` - サーバーのエントリーポイント

**役割**: プログラムの開始地点。サーバーを起動する。

```go
package main

import (
    "log"
    "net/http"
    
    "go-hsm-app/database"
    "go-hsm-app/graph"
    "go-hsm-app/graph/generated"
    
    "github.com/99designs/gqlgen/graphql/handler"
    "github.com/99designs/gqlgen/graphql/playground"
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
)

func main() {
    // 💡 ポイント1: データベースに接続
    if err := database.InitDB(); err != nil {
        log.Fatalf("Failed to initialize database: %v", err)
    }
    defer database.CloseDB()  // プログラム終了時に接続を閉じる

    // 💡 ポイント2: Echoのインスタンスを作成
    e := echo.New()

    // 💡 ポイント3: ミドルウェアの設定
    e.Use(middleware.Logger())   // リクエストログを出力
    e.Use(middleware.Recover())  // パニック時の復旧
    e.Use(middleware.CORS())     // CORS設定

    // 💡 ポイント4: ヘルスチェックエンドポイント
    e.GET("/health", func(c echo.Context) error {
        return c.JSON(http.StatusOK, map[string]string{
            "status": "ok",
            "message": "API is running",
        })
    })

    // 💡 ポイント5: GraphQLサーバーの作成
    srv := handler.NewDefaultServer(
        generated.NewExecutableSchema(
            generated.Config{
                Resolvers: &graph.Resolver{
                    DB: database.DB,  // リゾルバにDBを注入
                },
            },
        ),
    )

    // 💡 ポイント6: GraphQLエンドポイントの設定
    e.POST("/graphql", echo.WrapHandler(srv))
    e.GET("/graphql", echo.WrapHandler(
        playground.Handler("GraphQL Playground", "/graphql"),
    ))

    // 💡 ポイント7: サーバー起動
    port := ":8080"
    log.Printf("🚀 Server ready at http://localhost%s", port)
    log.Printf("📊 GraphQL Playground at http://localhost%s/graphql", port)
    
    if err := e.Start(port); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
```

#### 🔍 コードの詳細解説

1. **データベース初期化**
   ```go
   if err := database.InitDB(); err != nil {
       log.Fatalf("Failed to initialize database: %v", err)
   }
   ```
   - `database.InitDB()`を呼び出してPostgreSQLに接続
   - エラーが発生したら`log.Fatalf`でプログラムを終了

2. **Echoインスタンス作成**
   ```go
   e := echo.New()
   ```
   - Echoは軽量で高速なWebフレームワーク
   - HTTPサーバーの機能を提供

3. **ミドルウェア**
   - `Logger()`: リクエストをログに記録
   - `Recover()`: パニックが起きても復旧
   - `CORS()`: クロスオリジンリクエストを許可

4. **GraphQLサーバー**
   ```go
   srv := handler.NewDefaultServer(...)
   ```
   - gqlgenが提供するGraphQLサーバー
   - リゾルバ（後述）と連携

5. **エンドポイント**
   - `POST /graphql`: GraphQL APIのエンドポイント
   - `GET /graphql`: GraphQL Playground（開発用UI）
   - `GET /health`: サーバーの稼働確認

---

### 2️⃣ `database/db.go` - データベース接続管理

**役割**: PostgreSQLとの接続を管理する。

```go
package database

import (
    "database/sql"
    "fmt"
    "log"
    "os"
    
    _ "github.com/lib/pq"  // PostgreSQLドライバ
)

var DB *sql.DB  // グローバル変数としてDB接続を保持

// InitDB はデータベース接続を初期化します
func InitDB() error {
    // 💡 ポイント1: 環境変数から接続情報を取得
    host := getEnv("DB_HOST", "localhost")
    port := getEnv("DB_PORT", "5432")
    user := getEnv("DB_USER", "postgres")
    password := getEnv("DB_PASSWORD", "postgres")
    dbname := getEnv("DB_NAME", "homestock")

    // 💡 ポイント2: 接続文字列を作成
    connStr := fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        host, port, user, password, dbname,
    )

    // 💡 ポイント3: データベースに接続
    var err error
    DB, err = sql.Open("postgres", connStr)
    if err != nil {
        return fmt.Errorf("failed to open database: %w", err)
    }

    // 💡 ポイント4: 接続確認（Ping）
    if err = DB.Ping(); err != nil {
        return fmt.Errorf("failed to ping database: %w", err)
    }

    log.Println("✓ Database connection established")
    return nil
}

// CloseDB はデータベース接続を閉じます
func CloseDB() {
    if DB != nil {
        DB.Close()
    }
}

// getEnv は環境変数を取得、なければデフォルト値を返す
func getEnv(key, defaultValue string) string {
    value := os.Getenv(key)
    if value == "" {
        return defaultValue
    }
    return value
}
```

#### 🔍 コードの詳細解説

1. **グローバル変数 `DB`**
   ```go
   var DB *sql.DB
   ```
   - プログラム全体で共有するデータベース接続
   - ポインタ型なので、nilチェックが必要

2. **環境変数の取得**
   ```go
   host := getEnv("DB_HOST", "localhost")
   ```
   - 環境変数があればそれを使用
   - なければデフォルト値を使用

3. **接続文字列**
   ```go
   "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable"
   ```
   - PostgreSQLに接続するための情報
   - `sslmode=disable`は開発環境用（本番ではSSLを有効にすべき）

4. **Ping**
   ```go
   if err = DB.Ping(); err != nil { ... }
   ```
   - 実際に接続できるか確認
   - エラーがあれば早期に検出

---

### 3️⃣ `schema.graphql` - GraphQLスキーマ定義

**役割**: APIの仕様を定義する。どんなデータを取得・操作できるか決める。

```graphql
# 💡 Query: データの取得（読み取り専用）
type Query {
  items: [Item!]!           # すべてのアイテムを取得
  item(id: ID!): Item       # 特定のアイテムを取得
}

# 💡 Mutation: データの変更（作成・更新・削除）
type Mutation {
  createItem(input: NewItem!): Item!              # アイテムを作成
  updateItem(id: ID!, input: UpdateItem!): Item!  # アイテムを更新
  deleteItem(id: ID!): Boolean!                   # アイテムを削除
}

# 💡 Type: データの形を定義
type Item {
  id: ID!              # ! は必須を意味する
  name: String!
  description: String  # ! がないのでオプショナル（nullでもOK）
  quantity: Int!
  createdAt: String!
  updatedAt: String!
}

# 💡 Input: ミューテーションの入力データ
input NewItem {
  name: String!
  description: String
  quantity: Int!
}

input UpdateItem {
  name: String         # すべてオプショナル
  description: String  # 更新したいフィールドだけ指定
  quantity: Int
}
```

#### 🔍 GraphQL用語解説

| 用語 | 説明 | 例 |
|------|------|-----|
| **Query** | データの取得 | `items`、`item(id: "1")` |
| **Mutation** | データの変更 | `createItem`、`deleteItem` |
| **Type** | データの型定義 | `Item`、`String`、`Int` |
| **Input** | 入力データの型 | `NewItem`、`UpdateItem` |
| **!** | 必須フィールド | `String!`は必ずStringが必要 |
| **[Type]** | 配列 | `[Item!]!`はItemの配列 |

---

### 4️⃣ `graph/resolver.go` - リゾルバのルート

**役割**: リゾルバの基礎となる構造体を定義。依存性を管理。

```go
package graph

import "database/sql"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, 
// add any dependencies you require here.

// 💡 Resolver構造体: リゾルバの「土台」
type Resolver struct {
    DB *sql.DB  // データベース接続を保持
}
```

#### 🔍 コードの詳細解説

- **Resolver構造体**
  - すべてのリゾルバで共有される構造体
  - `DB`フィールドにデータベース接続を保存
  - 他の依存関係（キャッシュ、認証など）も追加可能

- **依存性注入（Dependency Injection）**
  ```go
  &graph.Resolver{
      DB: database.DB,  // main.goでDBを注入
  }
  ```
  - リゾルバが外部から依存するものを受け取る仕組み
  - テストしやすくなる

---

### 5️⃣ `graph/schema.resolvers.go` - リゾルバの実装

**役割**: GraphQLのQuery/Mutationの実際の処理を実装。

#### 📖 Items Query - すべてのアイテムを取得

```go
func (r *queryResolver) Items(ctx context.Context) ([]*model.Item, error) {
    // 💡 ステップ1: SQLクエリを定義
    query := `
        SELECT id, name, description, quantity, created_at, updated_at 
        FROM items 
        ORDER BY created_at DESC
    `
    
    // 💡 ステップ2: データベースにクエリを実行
    rows, err := r.DB.QueryContext(ctx, query)
    if err != nil {
        return nil, fmt.Errorf("failed to query items: %w", err)
    }
    defer rows.Close()  // 必ず閉じる
    
    // 💡 ステップ3: 結果を格納する配列を準備
    var items []*model.Item
    
    // 💡 ステップ4: 行ごとにデータを取得
    for rows.Next() {
        item := &model.Item{}
        var createdAt, updatedAt string
        var description *string  // nullの可能性があるのでポインタ
        
        // 💡 ステップ5: 各カラムをGoの変数にスキャン
        if err := rows.Scan(
            &item.ID, 
            &item.Name, 
            &description, 
            &item.Quantity, 
            &createdAt, 
            &updatedAt,
        ); err != nil {
            return nil, fmt.Errorf("failed to scan item: %w", err)
        }
        
        // 💡 ステップ6: null対応とデータ整形
        if description != nil {
            item.Description = description
        }
        item.CreatedAt = createdAt
        item.UpdatedAt = updatedAt
        
        // 💡 ステップ7: 配列に追加
        items = append(items, item)
    }
    
    // 💡 ステップ8: エラーチェック
    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("error iterating items: %w", err)
    }
    
    // 💡 ステップ9: 結果を返す
    return items, nil
}
```

#### 📝 CreateItem Mutation - アイテムを作成

```go
func (r *mutationResolver) CreateItem(
    ctx context.Context, 
    input model.NewItem,
) (*model.Item, error) {
    // 💡 ステップ1: INSERT文を定義（RETURNINGで挿入結果を取得）
    query := `
        INSERT INTO items (name, description, quantity, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING id, name, description, quantity, created_at, updated_at
    `
    
    // 💡 ステップ2: 結果を格納する変数を準備
    item := &model.Item{}
    var createdAt, updatedAt string
    var description *string
    
    // 💡 ステップ3: QueryRowContextで1行だけ取得
    err := r.DB.QueryRowContext(
        ctx, 
        query, 
        input.Name,        // $1
        input.Description, // $2
        input.Quantity,    // $3
    ).Scan(
        &item.ID, 
        &item.Name, 
        &description, 
        &item.Quantity, 
        &createdAt, 
        &updatedAt,
    )
    
    // 💡 ステップ4: エラーチェック
    if err != nil {
        return nil, fmt.Errorf("failed to create item: %w", err)
    }
    
    // 💡 ステップ5: null対応とデータ整形
    if description != nil {
        item.Description = description
    }
    item.CreatedAt = createdAt
    item.UpdatedAt = updatedAt
    
    // 💡 ステップ6: 作成されたアイテムを返す
    return item, nil
}
```

#### 🔄 UpdateItem Mutation - アイテムを更新

```go
func (r *mutationResolver) UpdateItem(
    ctx context.Context, 
    id string, 
    input model.UpdateItem,
) (*model.Item, error) {
    // 💡 COALESCE関数: 値がnullなら既存値を使う
    query := `
        UPDATE items
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            quantity = COALESCE($3, quantity),
            updated_at = NOW()
        WHERE id = $4
        RETURNING id, name, description, quantity, created_at, updated_at
    `
    
    item := &model.Item{}
    var createdAt, updatedAt string
    var description *string
    
    err := r.DB.QueryRowContext(
        ctx, 
        query, 
        input.Name,        // $1
        input.Description, // $2
        input.Quantity,    // $3
        id,                // $4
    ).Scan(
        &item.ID, 
        &item.Name, 
        &description, 
        &item.Quantity, 
        &createdAt, 
        &updatedAt,
    )
    
    if err != nil {
        return nil, fmt.Errorf("failed to update item: %w", err)
    }
    
    if description != nil {
        item.Description = description
    }
    item.CreatedAt = createdAt
    item.UpdatedAt = updatedAt
    
    return item, nil
}
```

#### 🗑️ DeleteItem Mutation - アイテムを削除

```go
func (r *mutationResolver) DeleteItem(
    ctx context.Context, 
    id string,
) (bool, error) {
    // 💡 ステップ1: DELETE文を実行
    query := `DELETE FROM items WHERE id = $1`
    
    result, err := r.DB.ExecContext(ctx, query, id)
    if err != nil {
        return false, fmt.Errorf("failed to delete item: %w", err)
    }
    
    // 💡 ステップ2: 削除された行数を取得
    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return false, fmt.Errorf("failed to get rows affected: %w", err)
    }
    
    // 💡 ステップ3: 1行以上削除されたらtrue
    return rowsAffected > 0, nil
}
```

---

## コードの流れを追う

### 🔄 リクエストからレスポンスまでの完全な流れ

#### シナリオ: 「すべてのアイテムを取得する」

```
1. クライアントがリクエストを送信
   ↓
   POST http://localhost:8080/graphql
   Body: { "query": "{ items { id name quantity } }" }

2. main.go - Echoがリクエストを受信
   ↓
   e.POST("/graphql", echo.WrapHandler(srv))

3. gqlgen - GraphQLリクエストを解析
   ↓
   "items"クエリを検出

4. schema.resolvers.go - Itemsリゾルバが呼ばれる
   ↓
   func (r *queryResolver) Items(ctx context.Context) ...

5. database/db.go - SQLを実行
   ↓
   rows, err := r.DB.QueryContext(ctx, query)

6. PostgreSQL - データベースがクエリを実行
   ↓
   SELECT id, name, description, quantity, created_at, updated_at 
   FROM items ORDER BY created_at DESC

7. schema.resolvers.go - 結果をスキャン
   ↓
   for rows.Next() { rows.Scan(...) }

8. gqlgen - 結果をJSON形式に変換
   ↓
   { "data": { "items": [...] } }

9. Echoがレスポンスを返す
   ↓
   クライアントが結果を受信
```

### 🎯 コードの実行順序（詳細版）

```go
// ========== プログラム起動時 ==========

1. main()関数が実行開始
   ↓
2. database.InitDB() でDB接続
   ↓
3. echo.New() でWebサーバー作成
   ↓
4. ミドルウェア設定
   ↓
5. GraphQLサーバー初期化
   ↓
6. エンドポイント登録
   ↓
7. e.Start(":8080") でサーバー起動
   [待機状態]

// ========== リクエスト受信時 ==========

8. クライアントからリクエスト受信
   ↓
9. ミドルウェア実行（Logger, CORS, Recover）
   ↓
10. ルーティング判定
    ↓ "/graphql"へのPOSTリクエスト
11. GraphQLハンドラーが起動
    ↓
12. クエリ/ミューテーション判定
    ↓ "items"クエリの場合
13. queryResolver.Items() 実行
    ↓
14. r.DB.QueryContext() でSQL実行
    ↓
15. rows.Scan() で結果を読み込み
    ↓
16. []*model.Item を返却
    ↓
17. gqlgenがJSONに変換
    ↓
18. Echoがレスポンス送信
```

---

## GraphQLの基礎

### 🤔 GraphQLとは？

- **REST APIの進化版**
  - 1つのエンドポイントで複数の操作が可能
  - 必要なデータだけを取得できる
  - 型安全

### 📊 RESTとGraphQLの比較

#### REST API

```http
GET /api/items          # すべてのアイテム
GET /api/items/1        # ID=1のアイテム
POST /api/items         # アイテム作成
PUT /api/items/1        # アイテム更新
DELETE /api/items/1     # アイテム削除
```

**問題点:**
- エンドポイントが多い
- 必要ないデータも取得してしまう（Over-fetching）
- 複数のリソースを取得するには複数回リクエストが必要

#### GraphQL API

```graphql
# すべて POST /graphql に送る

# 取得
query { items { id name } }

# 作成
mutation { createItem(input: {...}) { id name } }

# 更新
mutation { updateItem(id: "1", input: {...}) { id name } }

# 削除
mutation { deleteItem(id: "1") }
```

**メリット:**
- 1つのエンドポイント
- 必要なフィールドだけ指定
- 複数のクエリを1回で実行可能

### 📝 GraphQLの基本構文

#### 1. Query（データ取得）

```graphql
# 基本形
query {
  items {
    id
    name
  }
}

# 引数付き
query {
  item(id: "1") {
    id
    name
    description
    quantity
  }
}

# 複数のクエリ
query {
  allItems: items {
    id
    name
  }
  specificItem: item(id: "1") {
    name
  }
}
```

#### 2. Mutation（データ変更）

```graphql
# 作成
mutation {
  createItem(input: {
    name: "新商品"
    description: "説明"
    quantity: 10
  }) {
    id
    name
    createdAt
  }
}

# 更新（変更したいフィールドだけ指定）
mutation {
  updateItem(id: "1", input: {
    quantity: 20
  }) {
    id
    quantity
    updatedAt
  }
}

# 削除
mutation {
  deleteItem(id: "1")
}
```

#### 3. Variables（変数使用）

```graphql
# クエリ定義
mutation CreateItem($input: NewItem!) {
  createItem(input: $input) {
    id
    name
  }
}

# 変数（別で送る）
{
  "input": {
    "name": "商品名",
    "description": "説明",
    "quantity": 5
  }
}
```

---

## 実践：APIを呼び出してみる

### 🚀 ステップ1: サーバーを起動

```bash
# ターミナルで実行
cd go-app
go run main.go
```

起動成功すると以下が表示されます：

```
✓ Database connection established
🚀 Server ready at http://localhost:8080
📊 GraphQL Playground at http://localhost:8080/graphql
```

### 🌐 ステップ2: GraphQL Playgroundを開く

ブラウザで以下にアクセス：
```
http://localhost:8080/graphql
```

### 📝 ステップ3: クエリを実行してみる

#### 例1: すべてのアイテムを取得

**左側のエディタに入力:**
```graphql
query GetAllItems {
  items {
    id
    name
    description
    quantity
    createdAt
  }
}
```

**▶ボタンを押すと右側に結果が表示:**
```json
{
  "data": {
    "items": [
      {
        "id": "1",
        "name": "サンプル商品1",
        "description": "最初のサンプル商品です",
        "quantity": 10,
        "createdAt": "2025-10-18T12:00:00Z"
      },
      {
        "id": "2",
        "name": "サンプル商品2",
        "description": "2番目のサンプル商品です",
        "quantity": 5,
        "createdAt": "2025-10-18T12:01:00Z"
      }
    ]
  }
}
```

#### 例2: 特定のアイテムを取得

```graphql
query GetOneItem {
  item(id: "1") {
    id
    name
    quantity
  }
}
```

**結果:**
```json
{
  "data": {
    "item": {
      "id": "1",
      "name": "サンプル商品1",
      "quantity": 10
    }
  }
}
```

#### 例3: アイテムを作成

```graphql
mutation CreateNewItem {
  createItem(input: {
    name: "新しい商品"
    description: "GraphQL Playgroundから作成"
    quantity: 15
  }) {
    id
    name
    quantity
    createdAt
  }
}
```

**結果:**
```json
{
  "data": {
    "createItem": {
      "id": "3",
      "name": "新しい商品",
      "quantity": 15,
      "createdAt": "2025-10-18T14:30:00Z"
    }
  }
}
```

#### 例4: アイテムを更新

```graphql
mutation UpdateItemQuantity {
  updateItem(id: "3", input: {
    quantity: 25
  }) {
    id
    name
    quantity
    updatedAt
  }
}
```

#### 例5: アイテムを削除

```graphql
mutation DeleteItem {
  deleteItem(id: "3")
}
```

**結果:**
```json
{
  "data": {
    "deleteItem": true
  }
}
```

### 💻 ステップ4: curlで呼び出す

GraphQL PlaygroundではなくコマンドラインからもAPI呼び出しができます：

```bash
# Queryの例
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ items { id name quantity } }"}'

# Mutationの例
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query":"mutation { createItem(input: {name: \"テスト\", quantity: 10}) { id name } }"
  }'
```

---

## よくある質問

### ❓ Q1: `*sql.DB`の`*`は何を意味する？

**A:** ポインタを表します。

```go
var DB *sql.DB  // DBはポインタ型

// ポインタとは？
// メモリのアドレスを保持する変数
// 値のコピーではなく参照を渡す
```

**なぜポインタ？**
- データベース接続は大きなデータ
- コピーすると無駄なメモリを使う
- 参照（アドレス）だけを渡すと効率的

### ❓ Q2: `defer`は何をする？

**A:** 関数終了時に実行される処理を予約します。

```go
func example() {
    rows, _ := db.Query("SELECT ...")
    defer rows.Close()  // 関数終了時に必ず実行される
    
    // ここで処理...
    
    // returnする前に自動的に rows.Close() が呼ばれる
}
```

**使い所:**
- ファイルやDB接続を閉じる
- ロックを解放する
- リソースのクリーンアップ

### ❓ Q3: `context.Context`とは？

**A:** リクエストのメタ情報やキャンセル処理を管理します。

```go
func (r *queryResolver) Items(ctx context.Context) ...
```

**用途:**
- タイムアウト設定
- リクエストのキャンセル
- リクエストIDなどの追跡情報

**例:**
```go
// 5秒でタイムアウト
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

// このクエリは5秒以内に完了しないとキャンセルされる
rows, err := db.QueryContext(ctx, "SELECT ...")
```

### ❓ Q4: `$1`, `$2`は何？

**A:** PostgreSQLのプレースホルダーです。

```go
query := `INSERT INTO items (name, quantity) VALUES ($1, $2)`
db.QueryRow(query, "商品名", 10)  // $1="商品名", $2=10
```

**なぜ使う？**
- **SQLインジェクション対策**
- 値を安全にエスケープ
- 実行計画のキャッシュ

**悪い例（危険）:**
```go
// これはダメ！SQLインジェクションの危険性
query := fmt.Sprintf("INSERT INTO items (name) VALUES ('%s')", userInput)
```

### ❓ Q5: `rows.Next()`の仕組みは？

**A:** カーソルを次の行に進めます。

```go
rows, _ := db.Query("SELECT * FROM items")

// 最初はカーソルが最初の行の前にいる
// ┌───────────────┐
// │  カーソル      │ ← ここ
// ├───────────────┤
// │  行1          │
// │  行2          │
// │  行3          │
// └───────────────┘

for rows.Next() {  // カーソルを次の行に進める
    // 行1でScan()
    // 行2でScan()
    // 行3でScan()
    // 行がなくなるとfalseを返しループ終了
}
```

### ❓ Q6: なぜ`nil`チェックが必要？

**A:** nullデータベースの値に対応するためです。

```go
var description *string  // ポインタ型

// descriptionがnullの場合
if description != nil {
    item.Description = description  // 値がある時だけ代入
}
```

**データベースのnull:**
- SQLで`null`は「値が存在しない」を表す
- Goで`nil`は「ポインタが何も指していない」
- `*string`ならnullを表現できる

### ❓ Q7: `generated.NewExecutableSchema`は何をしている？

**A:** gqlgenが生成したコードでGraphQLスキーマを実行可能にします。

```go
generated.NewExecutableSchema(generated.Config{
    Resolvers: &graph.Resolver{DB: database.DB},
})
```

**内部では:**
1. `schema.graphql`の定義を読み込み
2. リゾルバと関連付け
3. GraphQLクエリを実行できる形に変換

### ❓ Q8: エラーハンドリングの`%w`とは？

**A:** エラーをラップ（包む）します。

```go
return fmt.Errorf("failed to query: %w", err)
```

**メリット:**
- エラーの原因を追跡できる
- `errors.Is()`や`errors.As()`が使える

**例:**
```go
// データベースエラー
dbErr := errors.New("connection failed")

// ラップして詳細を追加
appErr := fmt.Errorf("database operation failed: %w", dbErr)

// 元のエラーを確認できる
if errors.Is(appErr, dbErr) {
    // true
}
```

---

## トラブルシューティング

### 🔧 問題1: サーバーが起動しない

#### エラー: `Failed to initialize database`

**原因:**
- PostgreSQLが起動していない
- 接続情報が間違っている

**解決方法:**
```bash
# Dockerでデータベース起動
docker-compose up -d

# 接続確認
psql -h localhost -U postgres -d homestock
```

#### エラー: `address already in use`

**原因:**
- ポート8080が既に使われている

**解決方法:**
```bash
# Windowsでポートを使っているプロセスを確認
netstat -ano | findstr :8080

# プロセスを終了
taskkill /PID <プロセスID> /F

# または main.go のポート番号を変更
port := ":8081"  // 8081に変更
```

### 🔧 問題2: GraphQL Playgroundでエラー

#### エラー: `Cannot query field "items" on type "Query"`

**原因:**
- スキーマとリゾルバの不一致
- コード生成が古い

**解決方法:**
```bash
# gqlgenで再生成
go run github.com/99designs/gqlgen generate

# サーバー再起動
go run main.go
```

#### エラー: `failed to query items: pq: relation "items" does not exist`

**原因:**
- itemsテーブルが作成されていない

**解決方法:**
```bash
# init.sqlを実行
psql -h localhost -U postgres -d homestock -f ../DB/init.sql

# または docker-composeで再作成
docker-compose down
docker-compose up -d
```

### 🔧 問題3: ビルドエラー

#### エラー: `package go-hsm-app/graph/generated is not in std`

**原因:**
- モジュール名が間違っている
- 依存関係が不足

**解決方法:**
```bash
# go.modを確認
cat go.mod

# モジュール名が "go-hsm-app" であることを確認

# 依存関係を整理
go mod tidy

# 再ビルド
go build .
```

#### エラー: `import cycle not allowed`

**原因:**
- パッケージ間で循環参照が発生

**解決方法:**
- パッケージ構造を見直す
- 共通の機能を別パッケージに分離

### 🔧 問題4: データが取得できない

#### GraphQLクエリは成功するがデータが空

**確認事項:**
```sql
-- データベースに接続
psql -h localhost -U postgres -d homestock

-- データを確認
SELECT * FROM items;

-- データがなければ挿入
INSERT INTO items (name, description, quantity) 
VALUES ('テスト商品', 'テスト', 5);
```

### 🔧 問題5: パフォーマンスが遅い

**チェックリスト:**
1. データベースのインデックスを確認
2. N+1問題がないか確認
3. 不要なフィールドを取得していないか

**改善例:**
```sql
-- インデックスを追加
CREATE INDEX idx_items_name ON items(name);

-- 実行計画を確認
EXPLAIN ANALYZE SELECT * FROM items;
```

---

## 🎓 学習の次のステップ

### 📚 初級者向け

1. **GraphQLの基礎を深める**
   - [GraphQL公式チュートリアル](https://graphql.org/learn/)
   - Playgroundでいろいろなクエリを試す

2. **Go言語の基礎**
   - [A Tour of Go](https://go.dev/tour/)
   - ポインタ、構造体、メソッドを理解

3. **SQLの基礎**
   - SELECT、INSERT、UPDATE、DELETEの使い方
   - JOINの理解

### 📚 中級者向け

4. **認証・認可の実装**
   - JWTトークン
   - ミドルウェアでの認証チェック

5. **バリデーション**
   - 入力値の検証
   - カスタムバリデータ

6. **テストの作成**
   - ユニットテスト
   - テーブル駆動テスト

### 📚 上級者向け

7. **DataLoaderでN+1問題解決**
   - バッチ処理
   - キャッシング

8. **サブスクリプション**
   - WebSocketによるリアルタイム通信

9. **マイクロサービス化**
   - gRPC統合
   - サービス分割

---

## 📖 参考資料

### 公式ドキュメント

- [gqlgen Documentation](https://gqlgen.com/)
- [Echo Guide](https://echo.labstack.com/guide/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Go Official Documentation](https://go.dev/doc/)

### おすすめ記事

- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Go Database/SQL Tutorial](http://go-database-sql.org/)

---

## 📝 まとめ

### ✅ このガイドで学んだこと

1. **プロジェクト構造**
   - 各ファイルの役割
   - ディレクトリの意味

2. **コードの流れ**
   - リクエストからレスポンスまで
   - 各層の責任

3. **GraphQLの基礎**
   - Query、Mutation、Type
   - スキーマの書き方

4. **実装の詳細**
   - データベース接続
   - リゾルバの実装
   - エラーハンドリング

5. **実践的な使い方**
   - APIの呼び出し
   - デバッグ方法

### 🎯 次にやること

1. GraphQL Playgroundで色々試す
2. 新しいフィールドを追加してみる
3. 別のテーブルを作成してみる
4. 認証機能を追加してみる

---

**Happy Coding! 🚀**

ご質問があれば、issueやドキュメントを参照してください！
