# 在庫管理アプリ

<p align="center"><img width="100%" height="auto" alt="HomeStock" src="https://github.com/user-attachments/assets/e1fe6d93-57a7-4d2b-a1e0-61c1f5c7e4bc" /></p>

このアプリは自宅用のシンプルな在庫管理アプリです。
フロントエンドに Next.js（TypeScript）、バックエンドに Go を使った構成になっており、ローカルでは Docker / docker-compose で起動するか、個別に開発サーバーを立ち上げて開発できます。

## アーキテクチャ

- フロントエンド: Next.js（`next-app/`）

  - クライアントコンポーネントとサーバーコンポーネントを組み合わせた構成
  - Tailwind CSS を使ったユーティリティベースのスタイリング
  - UI: モーダルはポータル化して親レイアウトの影響を受けない実装

- バックエンド: Go（`go-app/`）

  - 軽量な API サーバーのサンプルを配置

- インフラ / コンテナ: `docker/` と `docker-compose.yml`

  - Dockerfile がフロント・バック両方用に用意されているため、コンテナ起動で一括検証可能

- DB: `DB/init.sql` に初期データ/スキーマ（SQLite/Postgres 等のサンプル）

---

## フォルダ構成（主要）

- `next-app/` - Next.js フロントエンドアプリ

  - `src/components/` - UI コンポーネント（モーダル、items、home 等）
  - `src/app/` - Next App Router のページ・レイアウト
  - `src/lib/` - クライアント/サーバー共通のライブラリ（mockApi など）

- `go-app/` - Go バックエンド（サンプル）
- `docker/` - Dockerfile と関連ドキュメント
- `DB/` - 初期 SQL（`init.sql`）
- `docs/` - コンセプトや設計メモ
- `README.md` - （このファイル）

※ リポジトリ全体の細かいファイルはルートのツリー参照をしてください。

---

## 開発環境構築手順（ローカル）

以下は Windows (PowerShell) を想定した手順です。macOS / Linux でもコマンドを置き換えれば同様に実行できます。

前提

- Node.js（推奨: 16+）と pnpm がインストールされていること
- Go が必要な場合は Go をインストール
- Docker を利用する場合は Docker / docker-compose が利用可能であること

1. リポジトリをクローン

```powershell
git clone <repo-url>
cd stock-management_app
```

1. フロントエンド依存インストール（next-app）

```powershell
cd next-app
pnpm install
```

1. 開発サーバー起動（フロントエンド単体）

```powershell
pnpm run dev
```

ブラウザで <http://localhost:3000> を開いて確認します。

1. バックエンドを単独で起動する場合（go-app）

```powershell
cd ../go-app
go run ./src/app/main.go
```

（実装に合わせてポートや環境変数を設定してください）

1. Docker でまとめて起動する（オプション）

```powershell
# ルートに戻る
cd ..
docker-compose up --build
```

1. DB 初期化

Docker 構成や実際の DB に合わせて `DB/init.sql` を適用してください（例: psql や sqlite3 を利用）。

---

必要に応じて、環境変数やポート番号の設定方法、テストの実行方法などをこの README に追記できます。追記希望があれば教えてください。

# 注意点: 環境変数設定について

## `NEXT_PUBLIC_API_BASE_URL`と`API_BASE_URL`の役割

### 1. `NEXT_PUBLIC_API_BASE_URL`

- **役割**: クライアントサイド（ブラウザ）から API を呼び出す際に使用される URL。
- **設定例**: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`
  - ブラウザはローカル環境で動作しているため、Go サーバーに`http://localhost:8080`でアクセスします。
- **注意**: `NEXT_PUBLIC_`で始まる環境変数は、Next.js のビルド時にクライアントサイドに公開されます。

### 2. `API_BASE_URL`

- **役割**: サーバーサイド（Next.js の Server Component や API Routes）から API を呼び出す際に使用される URL。
- **設定例**: `API_BASE_URL=http://go-app:8080`
  - サーバーサイドは Docker コンテナ内で動作しているため、Go サーバーに`http://go-app:8080`（Docker Compose のサービス名）でアクセスします。

---

## 注意点

1. **クライアントサイドとサーバーサイドで異なる URL を使用する理由**

   - クライアントサイド（ブラウザ）はローカルホスト（`localhost`）を使用して Go サーバーにアクセスします。
   - サーバーサイド（Docker コンテナ内）は、Docker Compose のサービス名（`go-app`）を使用して Go サーバーにアクセスします。

2. **`NEXT_PUBLIC_API_BASE_URL`の公開性**

   - `NEXT_PUBLIC_`で始まる環境変数は、クライアントサイドに公開されるため、機密情報を含めないようにしてください。

3. **Docker 内での挙動**
   - Next.js のコンテナ内でクライアントサイドの挙動を確認したい場合、`NEXT_PUBLIC_API_BASE_URL`を`http://go-app:8080`に変更する必要があります。
   - ただし、通常はブラウザからのアクセスを考慮して`http://localhost:8080`のままで問題ありません。

---

## 推奨設定例

```env
# クライアントサイド（ブラウザ）用
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# サーバーサイド（Server Component）用
API_BASE_URL=http://go-app:8080
```
