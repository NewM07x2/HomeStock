# 外部商品検索 API 連携ガイド

このドキュメントでは、バーコード（JAN コード）から商品情報を検索するための外部 API 連携について説明します。

## 概要

バーコードスキャン機能により、以下の順序で商品情報を検索します：

1. **既存データベース** - 自社の商品マスタ
2. **Amazon Product Advertising API** - Amazon 商品データベース
3. **楽天市場 API** - 楽天商品データベース
4. **Yahoo!ショッピング API** - Yahoo!商品データベース

いずれかで商品が見つかった時点で検索を終了し、情報を返します。

## API 設定

### 1. 楽天市場 API

#### 取得方法

1. [楽天ウェブサービス](https://webservice.rakuten.co.jp/)にアクセス
2. 楽天会員でログイン
3. 「アプリ ID 発行」からアプリケーションを登録
4. アプリケーション ID を取得

#### 設定

```bash
# .env.local
RAKUTEN_APPLICATION_ID=your_rakuten_application_id_here
```

#### 特徴

- **無料枠**: 1 日 10,000 リクエスト
- **商品情報**: 商品名、価格、画像 URL、ショップ名など
- **JAN コード検索**: キーワード検索で JAN コードを指定

#### 参考リンク

- [楽天市場商品検索 API](https://webservice.rakuten.co.jp/documentation/ichiba-item-search)

---

### 2. Yahoo!ショッピング API

#### 取得方法

1. [Yahoo!デベロッパーネットワーク](https://e.developer.yahoo.co.jp/)にアクセス
2. Yahoo! JAPAN ID でログイン
3. 「アプリケーションの管理」から新規アプリケーションを登録
4. Client ID を取得

#### 設定

```bash
# .env.local
YAHOO_CLIENT_ID=your_yahoo_client_id_here
```

#### 特徴

- **無料枠**: 1 日 50,000 リクエスト
- **商品情報**: 商品名、価格、画像 URL、ショップ名など
- **JAN コード検索**: jan_code パラメータで直接検索可能

#### 参考リンク

- [Yahoo!ショッピング商品検索 API](https://developer.yahoo.co.jp/webapi/shopping/shopping/v3/itemsearch.html)

---

### 3. Amazon Product Advertising API (PA-API)

#### 取得方法

1. [Amazon アソシエイト・プログラム](https://affiliate.amazon.co.jp/)に参加
2. アソシエイトアカウントを作成（審査あり）
3. [Product Advertising API](https://affiliate.amazon.co.jp/assoc_credentials/home)にアクセス
4. アクセスキー、シークレットキー、アソシエイトタグを取得

#### 設定

```bash
# .env.local
AMAZON_ACCESS_KEY=your_amazon_access_key_here
AMAZON_SECRET_KEY=your_amazon_secret_key_here
AMAZON_ASSOCIATE_TAG=your_amazon_associate_tag_here
```

#### 特徴

- **要審査**: アソシエイトプログラムの承認が必要
- **署名認証**: AWS Signature V4 による認証が必要
- **商品情報**: 商品名、価格、画像 URL、詳細情報など
- **複雑な実装**: SDK 使用を強く推奨

#### 注意事項

- 現在の実装は**スタブ**です
- 完全な実装には[PA-API SDK](https://github.com/thewisenerd/paapi5-nodejs-sdk)の使用を推奨
- AWS Signature V4 認証の実装が必要

#### 参考リンク

- [PA-API 5.0 ドキュメント](https://webservices.amazon.com/paapi5/documentation/)
- [PA-API Node.js SDK](https://github.com/thewisenerd/paapi5-nodejs-sdk)

---

## 実装詳細

### エンドポイント

```
GET /api/products/search-by-barcode?barcode={JAN_CODE}
```

### レスポンス例

#### 商品が見つかった場合

```json
{
  "found": true,
  "source": "rakuten",
  "data": {
    "code": "4901234567890",
    "name": "サンプル商品",
    "unit_price": 1280,
    "image_url": "https://example.com/image.jpg",
    "shop_name": "サンプルショップ"
  }
}
```

#### 商品が見つからなかった場合

```json
{
  "found": false,
  "source": "none",
  "data": {
    "code": "4901234567890",
    "name": "",
    "unit_price": 0
  },
  "message": "商品情報が見つかりませんでした。手動で入力してください。"
}
```

### 検索フロー

```
バーコードスキャン
    ↓
1. 既存DB検索
    ↓ (見つからない)
2. Amazon検索
    ↓ (見つからない)
3. 楽天検索
    ↓ (見つからない)
4. Yahoo!検索
    ↓ (見つからない)
手動入力を促す
```

---

## 使用方法

### 1. 環境変数の設定

`.env.local`ファイルを作成し、必要な API キーを設定：

```bash
# .env.exampleをコピー
cp .env.example .env.local

# .env.localを編集して実際のAPIキーを設定
```

### 2. アプリケーションの起動

```bash
npm run dev
```

### 3. バーコードスキャン

1. アイテム一覧ページで「一括 JIS 登録」ボタンをクリック
2. カメラでバーコードをスキャン
3. 自動的に商品情報が検索され、フォームに入力される

---

## トラブルシューティング

### API エラーが発生する

#### 楽天 API

- アプリケーション ID が正しく設定されているか確認
- リクエスト制限（1 日 10,000 件）を超えていないか確認

#### Yahoo! API

- Client ID が正しく設定されているか確認
- リクエスト制限（1 日 50,000 件）を超えていないか確認

#### Amazon PA-API

- 現在の実装はスタブのため動作しません
- 完全な実装には SDK の導入が必要

### 商品が見つからない

1. JAN コードが正しいか確認
2. 各 API の商品データベースに存在するか確認
3. ブラウザの開発者ツールでネットワークログを確認

### コンソールログの確認

```bash
# サーバーサイドログを確認
# ターミナルに以下のようなログが表示されます
バーコード検索: 4901234567890
外部API検索を開始...
Amazon検索をスキップ（API未設定）
楽天 で商品が見つかりました
```

---

## 今後の拡張

### Amazon PA-API の完全実装

```bash
# PA-API SDKのインストール
npm install paapi5-nodejs-sdk
```

```typescript
import ProductAdvertisingAPIv1 from 'paapi5-nodejs-sdk'

async function searchAmazon(barcode: string) {
  const client = ProductAdvertisingAPIv1.ApiClient.instance
  client.accessKey = process.env.AMAZON_ACCESS_KEY
  client.secretKey = process.env.AMAZON_SECRET_KEY
  client.host = 'webservices.amazon.co.jp'
  client.region = 'us-west-2'

  const api = new ProductAdvertisingAPIv1.DefaultApi()
  const searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest()

  searchItemsRequest.Keywords = barcode
  searchItemsRequest.PartnerTag = process.env.AMAZON_ASSOCIATE_TAG
  searchItemsRequest.PartnerType = 'Associates'
  searchItemsRequest.Marketplace = 'www.amazon.co.jp'

  // ... 実装続く
}
```

### その他の外部 API

- **JAN 検索サービス**: https://www.janken.jp/
- **商品マスター API**: 自社の商品マスタ API との連携

---

## まとめ

外部 API 連携により、バーコードスキャンから自動的に商品情報を取得できるようになりました。

- ✅ 楽天市場 API（実装済み）
- ✅ Yahoo!ショッピング API（実装済み）
- ⚠️ Amazon PA-API（スタブ実装、SDK 導入推奨）

実際の運用では、各 API の利用規約とリクエスト制限を遵守してください。
