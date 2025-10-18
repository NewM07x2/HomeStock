# HomeStock Go Backend# Go 環境セットアップと動作確認手順



GraphQLベースのホーム在庫管理システムのバックエンドAPIこのドキュメントでは、`go-app` ディレクトリ内での Go 環境セットアップと、Echo を用いた API サーバーの動作確認手順を説明します。



## 機能---



- GraphQL API（Query、Mutation）## 必要なツール

- PostgreSQL統合

- Echo Webフレームワーク以下のツールがインストールされていることを確認してください：

- GraphQL Playground（開発用）

- [Go](https://go.dev/dl/)（バージョン 1.20 以上推奨）

## 必要な環境- ターミナル（PowerShell, bash など）



- Go 1.21以上---

- PostgreSQL 14以上

- Docker & Docker Compose（推奨）## 環境セットアップ



## セットアップ1. **リポジトリのクローン**



### 1. 依存関係のインストール   ```bash

   git clone <リポジトリのURL>

```bash   cd next-go/go-app

go mod download   ```

```

2. **Go モジュールの初期化**

### 2. 環境変数の設定

   プロジェクトがすでに初期化されている場合はスキップしてください。

`.env.example`をコピーして`.env`を作成し、必要に応じて設定を変更：

   ```bash

```bash   go mod init go-hsm-app

cp .env.example .env   ```

```

3. **依存関係のインストール**

### 3. データベースのセットアップ

   必要なパッケージをインストールします。

Dockerを使用する場合（推奨）：

   ```bash

```bash   go get github.com/labstack/echo/v4

# プロジェクトルートから実行   go mod tidy

cd ..   ```

docker-compose up -d postgres

```---



### 4. サーバーの起動## サーバーの起動と動作確認



```bash1. **サーバーの起動**

go run main.go

```   以下のコマンドを実行してサーバーを起動します。



または、ビルドしてから実行：   ```bash

   go run main.go

```bash   ```

go build -o homestock-server.exe .

./homestock-server.exe2. **動作確認**

```

   ブラウザまたは API クライアント（Postman, curl など）を使用して、以下のエンドポイントにアクセスしてください。

## API エンドポイント

   - **URL**: `http://localhost:8080/health`

- **GraphQL API**: `http://localhost:8080/graphql`   - **HTTP メソッド**: GET

- **GraphQL Playground**: `http://localhost:8080/graphql`（ブラウザでアクセス）

- **ヘルスチェック**: `http://localhost:8080/health`   **期待されるレスポンス**:



## GraphQL スキーマ   ```text

   API is running

### Query   ```



```graphql---

# すべてのアイテムを取得

query {## 環境セットアップ（Docker コンテナ）

  items {

    id1. **Dockerfile と docker-compose.yml の確認**

    name

    description   - `docker/Dockerfile.backend` を使用して Go アプリケーションをビルドします。

    quantity   - `docker-compose.yml` を使用してコンテナを管理します。

    createdAt

    updatedAt2. **コンテナのビルドと起動**

  }

}   以下のコマンドを実行してコンテナをビルドし、起動します：



# 特定のアイテムを取得   ```bash

query {   docker-compose up --build

  item(id: "1") {   ```

    id

    name3. **動作確認**

    description

    quantity   ブラウザまたは API クライアント（Postman, curl など）を使用して、以下のエンドポイントにアクセスしてください。

  }

}   - **URL**: `http://localhost:8080/health`

```   - **HTTP メソッド**: GET



### Mutation   **期待されるレスポンス**:



```graphql   ```text

# アイテムを作成   API is running

mutation {   ```

  createItem(input: {

    name: "新商品"---

    description: "商品の説明"

    quantity: 10## トラブルシューティング

  }) {

    id- **ポート競合エラー**:

    name  - 他のプロセスがポート `8080` を使用している場合、`docker-compose.yml` 内の `ports` セクションを変更してください（例: `- "3000:8080"`）。

    quantity

  }- **依存関係のエラー**:

}  - `go.mod` や `go.sum` が正しく設定されているか確認してください。

  - 必要に応じて `docker-compose build` を再実行してください。

# アイテムを更新

mutation {---

  updateItem(id: "1", input: {

    quantity: 15これで Docker コンテナ上での Go 環境のセットアップと API サーバーの動作確認が完了します。

  }) {
    id
    name
    quantity
  }
}

# アイテムを削除
mutation {
  deleteItem(id: "1")
}
```

## プロジェクト構造

```
go-app/
├── main.go              # エントリーポイント
├── schema.graphql       # GraphQLスキーマ定義
├── gqlgen.yml          # gqlgen設定ファイル
├── database/           # データベース接続
│   └── db.go
├── graph/              # GraphQL関連
│   ├── resolver.go     # リゾルバルート
│   ├── schema.resolvers.go  # リゾルバ実装
│   ├── model/          # モデル定義
│   └── generated/      # gqlgen自動生成コード
└── README.md
```

## 開発

### GraphQLコードの再生成

スキーマを変更した場合：

```bash
go run github.com/99designs/gqlgen generate
```

### テスト

```bash
go test ./...
```

## トラブルシューティング

### データベース接続エラー

- PostgreSQLが起動しているか確認
- 環境変数の設定を確認
- データベース名とユーザー権限を確認

### ポート衝突

別のアプリケーションが8080ポートを使用している場合、`.env`でポート番号を変更してください。

## ライセンス

MIT
