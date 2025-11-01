# 在庫管理アプリ 要件定義（v0.1）

更新日: 2025-10-15 05:10:17

## 1. 背景・目的

現場在庫の可視化と誤差削減、棚卸し効率化、入出庫履歴の追跡性向上を目的に、Web およびスマホアプリから利用できる在庫管理システムを構築する。初期スコープは単一テナント／複数倉庫対応、将来的にマルチテナント化を想定。

## 2. スコープ（このフェーズで提供）

- ログイン（メール＋パスワード、JWT）
- アイテム一覧（検索・絞り込み・並び替え・ページネーション）
- 在庫詳細（アイテム詳細・ロケーション別在庫・入出庫履歴）
- アイテム登録／更新／削除（単体）
- アイテム一括登録／更新／削除（CSV/TSV のインポート、検証 → 登録の 2 段階）
- CSV エクスポート（アイテム・在庫・履歴）
- 監査ログ（重要操作の記録）

※将来拡張（vNext）: バーコード/QR 対応、棚卸しワークフロー、ロット/有効期限、シリアル管理、発注点・自動発注、RFID、マルチテナント、SAML/SSO、Webhooks。

## 3. 用語定義

- **アイテム(Item)**: 管理対象の製品/部材。SKU 相当。
- **ロケーション(Location)**: 倉庫/棚/エリア等の保管場所。
- **在庫(Stock)**: アイテム × ロケーションの保有数量。
- **入出庫履歴(Stock History)**: 在庫の増減取引（入庫/出庫/調整）。
- **一括処理(Bulk Job)**: CSV 等を用いた複数レコードの登録/更新/削除。

## 4. 想定ユーザー/権限

- **管理者(Admin)**: ユーザー/権限管理、全データ参照・編集、一括処理。
- **担当者(Operator)**: アイテム/在庫の参照、入出庫、更新（削除は不可）。
- **閲覧者(Viewer)**: 参照のみ。

ロールは RBAC で実装。画面・API でアクセス制御を行う。

## 5. ユースケース（抜粋）

1. 担当者がログインし、アイテムを検索し在庫状況を確認する。
2. 管理者が新規アイテムを CSV で一括登録する（事前検証 → 実行）。
3. 担当者が在庫差異を調整（在庫移動、数量修正、備考記入）。
4. 管理者が削除操作や一括処理の履歴を監査ログで追跡する。
5. 閲覧者がスマホアプリから在庫を参照する。

## 6. 画面概要（Next.js App Router）

- **/login**: 認証フォーム、パスワード再設定リンク（vNext）。
- **/items**: 一覧（検索・フィルタ・ソート・ページネーション）。主要列：コード、名称、カテゴリ、在庫合計、最終更新。
- **/items/new**: 新規作成フォーム。
- **/items/[id]**: 詳細（基本情報、ロケーション別在庫、入出庫履歴、関連ファイル）。
- **/items/[id]/edit**: 編集フォーム。
- **/bulk**: 一括処理（アップロード → プレビュー → 実行 → 結果）。

UI 要件：

- アクセシビリティ（キーボード操作、コントラスト、aria 属性）
- レスポンシブ（スマホ/タブレット/PC）
- エラー/バリデーション表示の明確化
- ローディング状態の表示（スピナー/スケルトン）

## 7. 機能要件

### 7.1 認証/認可

- メール+パスワードでログイン。成功時に JWT 発行（Access+Refresh）。
- パスワードは PBKDF2/Argon2 等でハッシュ化（要設定）。
- Refresh トークンのローテーションと失効、トークン失効リスト管理。
- RBAC（Admin/Operator/Viewer）。API ごとにスコープ定義。

### 7.2 アイテム一覧

- 検索条件：コード、名称、カテゴリ、状態（有効/無効）、在庫有無。
- フィルタ：ロケーション、在庫閾値（0、在庫不足、過剰）。
- ソート：コード、名称、更新日、在庫数。
- ページネーション：limit/offset（デフォルト 20 件）。
- エクスポート：検索条件に基づく CSV 出力。

### 7.3 在庫詳細（アイテム詳細）

- 基本情報：コード、名称、説明、カテゴリ、単位、状態、メタ情報（任意属性）。
- ロケーション別在庫：ロケーション、数量、最終更新。
- 入出庫履歴：日時、種別（IN/OUT/ADJUST/TRANSFER）、数量、ロケーション From/To、担当者、備考。
- 在庫調整：数量増減、理由コード、備考。

### 7.4 アイテム単体 CRUD

- 登録：必須入力（コード、名称、単位）。コードは一意。
- 更新：楽観的ロック（updated_at/バージョン）で競合対策。
- 削除：ソフトデリート（deleted_at）。在庫/履歴がある場合は原則禁止（ポリシー設定）。

### 7.5 一括登録/更新/削除（Bulk）

- 入力：CSV/TSV、UTF-8、ヘッダ必須。
- フロー：アップロード → 形式/値検証 → プレビュー（差分/エラー） → 実行。
- エラー: 行別にコード・メッセージ・対象列を保持、再実行可能。
- 冪等性: 同一ジョブ ID の再実行は二重反映しない。
- サンプル列：`code,name,category,unit,status,attributes(json)`
- 削除一括は `code` を主キーに論理削除。

### 7.6 監査ログ

- 重要操作（ログイン、アイテム CRUD、在庫調整、一括実行）を記録。
- 追跡情報：ユーザー ID、日時、操作、対象、リクエスト ID、差分（before/after の要約）。

## 8. 非機能要件

- 可用性: 目標稼働率 99.9%（将来）。初期はステートレス API +DB 単一 AZ。
- 性能: 一覧 API P95 < 300ms（100 件）、一括処理 10 万行/実行を許容（バッチ/非同期）。
- セキュリティ: OWASP ASVS に準拠、CSRF 対策（Cookie+SameSite/Lax or Header ベース）。
- ログ/監視: 構造化ログ、APM、メトリクス（リクエスト数/レイテンシ/エラー率/ジョブ状態）。
- バックアップ: DB 日次スナップショット、Point-In-Time-Recovery 有効化（本番）。
- 国際化: 日本語/英語（リソース分離）。

## 9. データモデル（PostgreSQL 概要）

```sql
-- users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin','operator','viewer')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- items
CREATE TABLE items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  category      TEXT,
  unit          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  attributes    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- locations
CREATE TABLE locations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  parent_id     UUID REFERENCES locations(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

-- stocks: item x location の現在量
CREATE TABLE stocks (
  item_id     UUID NOT NULL REFERENCES items(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  qty         NUMERIC(20,4) NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (item_id, location_id)
);

-- stock_movements: 入出庫/移動/調整の履歴（イベントソーシングの基礎）
CREATE TABLE stock_movements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id       UUID NOT NULL REFERENCES items(id),
  qty_delta     NUMERIC(20,4) NOT NULL,
  kind          TEXT NOT NULL CHECK (kind IN ('IN','OUT','ADJUST','TRANSFER')),
  location_from UUID REFERENCES locations(id),
  location_to   UUID REFERENCES locations(id),
  reason        TEXT,
  meta          JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- bulk_jobs
CREATE TABLE bulk_jobs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type      TEXT NOT NULL CHECK (job_type IN ('item_import','item_update','item_delete')),
  status        TEXT NOT NULL CHECK (status IN ('queued','validating','ready','running','failed','completed')),
  file_path     TEXT NOT NULL,
  summary       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- audit_logs
CREATE TABLE audit_logs (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID REFERENCES users(id),
  action      TEXT NOT NULL,
  resource    TEXT NOT NULL,
  resource_id TEXT,
  diff        JSONB,
  request_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_items_code ON items(code);
CREATE INDEX idx_items_name ON items(name);
CREATE INDEX idx_stocks_item ON stocks(item_id);
CREATE INDEX idx_stock_movements_item ON stock_movements(item_id);
```

整合性:

- 在庫の現在量は `stocks`、履歴は `stock_movements` に記録。
- 取引（movement）発生時はトランザクション内で `stocks` を加算/減算し、負在庫はポリシーで禁止/許可を選択。

## 10. API 設計（Go, REST 想定）

### 認証

- `POST /api/auth/login` （email, password）→ access_token, refresh_token
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### アイテム

- `GET /api/items?query=&category=&status=&sort=&limit=&offset=`
- `POST /api/items`
- `GET /api/items/<built-in function id>`
- `PUT /api/items/<built-in function id>`
- `DELETE /api/items/<built-in function id>`

### 在庫/履歴

- `GET /api/items/<built-in function id>/stocks`（ロケーション別現在量）
- `GET /api/items/<built-in function id>/movements?limit=&offset=`
- `POST /api/stock-movements`（在庫調整/入出庫/移動）
  - body: `item_id, kind, qty_delta (>0), location_from, location_to, reason`

### 一括処理

- `POST /api/bulk/items/import`（CSV アップロード, Content-Type: multipart/form-data）
- `POST /api/bulk/items/update`
- `POST /api/bulk/items/delete`
- `GET  /api/bulk/jobs/<built-in function id>`（ステータス/結果）

### エクスポート

- `GET /api/export/items.csv`
- `GET /api/export/stocks.csv`
- `GET /api/export/movements.csv`

### エラーレスポンス（例）

```json
{
  "error": "validation_error",
  "details": [{ "field": "code", "message": "duplicate" }]
}
```

## 11. フロントエンド（Next.js App Router）

- ルーティング: app ディレクトリ（Server Components 前提）、保護ルートでガード。
- データ取得: React Query(TanStack) + fetch。SWR も可。
- 認証: Cookie に Refresh、Memory/Storage に Access（または HttpOnly Cookie 運用）。
- 状態管理: 軽量（フォームは React Hook Form）。
- UI: shadcn/ui 採用（Table、Dialog、Toast）、フォームバリデーションは Zod。

## 12. バックエンド（Go）

- 推奨スタック: chi or echo、GORM/SQLC（厳格性重視なら sqlc）。
- レイヤリング: handler → service → repository → db（トランザクション境界を service）。
- 認証: JWT、ミドルウェアで検証、RBAC ミドルウェア。
- マイグレーション: golang-migrate、初期データ投入（管理者）。
- バッチ: 一括処理はワーカー/キュー（Postgres + LISTEN/NOTIFY、将来は SQS 等）。
- 監査: middleware で request_id 付与、差分はアプリ層で生成。

## 13. スマホアプリ（Flutter）

- 主要画面: ログイン、アイテム一覧、詳細、検索、（vNext: スキャン）。
- データ: REST API 連携、HTTP クライアント(Dio 等)、認証（JWT 保持は Secure Storage）。
- オフライン（任意）: 参照キャッシュ、一時キュー → 再送。

## 14. セキュリティ/コンプライアンス

- 入力検証（サーバ/クライアント両方）。
- レート制限、Brute-force 対策（アカウントロック/遅延）。
- CORS 適切化、HTTPS 前提、機密値は ENV で管理（.env は Git に含めない）。
- 監査ログ保全・改竄検知（WORM ストレージは将来）。

## 15. 運用・監視

- メトリクス: RPS、レイテンシ、5xx、DB 接続、ジョブの成功/失敗。
- アラート: SLA 違反/エラー率/キュー滞留。
- ログ: JSON 構造化、相関 ID。

## 16. バックアップ・リストア

- PostgreSQL: 日次フル+WAL。検証用の定期リストア演習。

## 17. Docker/ローカル開発

- `docker-compose.yml`（例）
  - services: `api(go)`, `web(next)`, `db(postgres)`, `pgadmin`（任意）
- ローカル.env（例）
  - `DATABASE_URL=postgres://user:pass@db:5432/app?sslmode=disable`
  - `JWT_SECRET=...` `ACCESS_TOKEN_TTL=15m` `REFRESH_TOKEN_TTL=7d`

## 18. 受け入れ条件（抜粋）

- ログイン: 正常/異常（誤パス/ロック/失効）ケースを網羅。
- 一覧: 検索・フィルタ・ソートが仕様通り、P95<300ms/100 件。
- 詳細: 在庫と履歴が一致（movement 集計=stocks）。
- CRUD: 検証/一意制約/楽観ロック/監査ログ記録。
- Bulk: 10 万行のバリデーションと部分エラーの再実行。
- セキュリティ: 主要脆弱性スキャンをパス。

## 19. リスクと未決事項

- CSV 仕様の確定（必須列/型/サイズ制約）
- 認証方式（Cookie vs Bearer）最終決定
- 同時編集ポリシー（最終勝ち/ロック）
- 负在庫許可方針、理由コードマスタの設計
- マルチテナント有無とキー設計（tenant_id）

---

### 付録 A. CSV フォーマット例（アイテム）

```csv
code,name,category,unit,status,attributes
SKU-0001,ねじM5,金具,個,active,"{""brand"":""ABC"",""spec"":""M5x12""}"
```
