import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * Amazon Product Advertising API検索
 * 参考: https://webservices.amazon.com/paapi5/documentation/
 */
async function searchAmazon(barcode: string) {
  try {
    const accessKey = process.env.AMAZON_ACCESS_KEY
    const secretKey = process.env.AMAZON_SECRET_KEY
    const associateTag = process.env.AMAZON_ASSOCIATE_TAG
    
    if (!accessKey || !secretKey || !associateTag) {
      console.log('Amazon PA-API未設定')
      return null
    }

    // Amazon PA-API 5.0のエンドポイント
    const host = 'webservices.amazon.co.jp'
    const region = 'us-west-2'
    const service = 'ProductAdvertisingAPI'
    const endpoint = `https://${host}/paapi5/searchitems`

    // リクエストボディ
    const requestBody = JSON.stringify({
      Keywords: barcode,
      Resources: [
        'ItemInfo.Title',
        'ItemInfo.ByLineInfo',
        'ItemInfo.ContentInfo',
        'ItemInfo.Features',
        'ItemInfo.ManufactureInfo',
        'ItemInfo.ProductInfo',
        'ItemInfo.TechnicalInfo',
        'ItemInfo.TradeInInfo',
        'Offers.Listings.Price'
      ],
      PartnerTag: associateTag,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.co.jp'
    })

    // AWS Signature V4認証（簡易版）
    // 本番環境ではaws-sdkまたは専用ライブラリの使用を推奨
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
    const date = timestamp.substring(0, 8)

    const headers = {
      'content-type': 'application/json; charset=utf-8',
      'host': host,
      'x-amz-date': timestamp,
      'x-amz-target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems'
    }

    // ※注意: 完全な署名実装が必要です。以下は簡易版のため実際には動作しません
    // 実際の実装にはAWS SDK for JavaScriptまたはPAAPI SDK推奨
    console.log('Amazon PA-API: 完全な署名実装が必要です')
    return null

  } catch (error) {
    console.error('Amazon検索エラー:', error)
    return null
  }
}

/**
 * 楽天商品検索API
 */
async function searchRakuten(barcode: string) {
  try {
    const applicationId = process.env.RAKUTEN_APPLICATION_ID
    
    if (!applicationId) {
      console.log('楽天API未設定')
      return null
    }

    const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&applicationId=${applicationId}&keyword=${barcode}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('楽天API エラー:', response.status)
      return null
    }

    const data = await response.json()
    
    if (data.Items && data.Items.length > 0) {
      const item = data.Items[0].Item
      return {
        code: barcode,
        name: item.itemName,
        unit_price: item.itemPrice,
        image_url: item.mediumImageUrls?.[0]?.imageUrl,
        shop_name: item.shopName,
        source: 'rakuten'
      }
    }
    
    return null
  } catch (error) {
    console.error('楽天検索エラー:', error)
    return null
  }
}

/**
 * Yahoo!ショッピングAPI検索
 */
async function searchYahoo(barcode: string) {
  try {
    const appId = process.env.YAHOO_CLIENT_ID
    
    if (!appId) {
      console.log('Yahoo! API未設定')
      return null
    }

    const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${appId}&jan_code=${barcode}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('Yahoo! API エラー:', response.status)
      return null
    }

    const data = await response.json()
    
    if (data.hits && data.hits.length > 0) {
      const item = data.hits[0]
      return {
        code: barcode,
        name: item.name,
        unit_price: item.price,
        image_url: item.image?.medium,
        shop_name: item.seller?.name,
        source: 'yahoo'
      }
    }
    
    return null
  } catch (error) {
    console.error('Yahoo!検索エラー:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const barcode = searchParams.get('barcode')

    if (!barcode) {
      return NextResponse.json(
        { error: 'バーコードが指定されていません' },
        { status: 400 }
      )
    }

    console.log('バーコード検索:', barcode)

    // 1. まずは既存のアイテムDBから検索
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
    const itemsResponse = await fetch(`${backendUrl}/api/items?code=${barcode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (itemsResponse.ok) {
      const data = await itemsResponse.json()
      if (data.items && data.items.length > 0) {
        // 既存のアイテムが見つかった場合
        const item = data.items[0]
        return NextResponse.json({
          found: true,
          source: 'database',
          data: {
            code: item.code,
            name: item.name,
            unit_price: item.unit_price,
            category: item.category?.name,
            category_id: item.category?.id,
            unit: item.unit?.name,
            unit_id: item.unit?.id,
          }
        })
      }
    }

    // 2. 既存DBに見つからない場合は外部API検索
    console.log('外部API検索を開始...')
    
    // 2-1. Amazon検索
    const amazonResult = await searchAmazon(barcode)
    if (amazonResult) {
      console.log('Amazon で商品が見つかりました')
      return NextResponse.json({
        found: true,
        source: 'amazon',
        data: amazonResult
      })
    }

    // 2-2. 楽天検索
    const rakutenResult = await searchRakuten(barcode)
    if (rakutenResult) {
      console.log('楽天 で商品が見つかりました')
      return NextResponse.json({
        found: true,
        source: 'rakuten',
        data: rakutenResult
      })
    }

    // 2-3. Yahoo!ショッピング検索
    const yahooResult = await searchYahoo(barcode)
    if (yahooResult) {
      console.log('Yahoo!ショッピング で商品が見つかりました')
      return NextResponse.json({
        found: true,
        source: 'yahoo',
        data: yahooResult
      })
    }

    // 3. どこにも見つからない場合
    return NextResponse.json({
      found: false,
      source: 'none',
      data: {
        code: barcode,
        name: '',
        unit_price: 0,
      },
      message: '商品情報が見つかりませんでした。手動で入力してください。'
    })

  } catch (error) {
    console.error('バーコード検索エラー:', error)
    return NextResponse.json(
      { error: '商品情報の取得に失敗しました', details: String(error) },
      { status: 500 }
    )
  }
}
