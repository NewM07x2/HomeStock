GET /api/items?page=1&limit=10 200 in 16ms


GET /?_rsc=1bbjy 200 in 72ms


[API /api/monthly-summary] GET request received: { year: 2025, month: 11, API_BASE_URL: 'http://go-app:8080' }


[API /api/monthly-summary] 履歴データ取得成功: 0 件


[API /api/monthly-summary] レスポンス: { totalAmount: 0, days: 30 }


GET /api/monthly-summary?year=2025&month=11 200 in 23ms


[API /api/monthly-summary] GET request received: { year: 2025, month: 11, API_BASE_URL: 'http://go-app:8080' }


[API /api/monthly-summary] 履歴データ取得成功: 0 件


[API /api/monthly-summary] レスポンス: { totalAmount: 0, days: 30 }


GET /api/monthly-summary?year=2025&month=11 200 in 16ms


[fetchRecentItems] Failed to fetch recent items: TypeError: Invalid URL


at new URL (node:internal/url:806:29)


at dispatchHttpRequest (webpack-internal:///(rsc)/./node_modules/axios/lib/adapters/http.js:228:24)


at eval (webpack-internal:///(rsc)/./node_modules/axios/lib/adapters/http.js:157:9)


at new Promise (<anonymous>)


at wrapAsync (webpack-internal:///(rsc)/./node_modules/axios/lib/adapters/http.js:141:12)


at http (webpack-internal:///(rsc)/./node_modules/axios/lib/adapters/http.js:174:12)


at Axios.dispatchRequest (webpack-internal:///(rsc)/./node_modules/axios/lib/core/dispatchRequest.js:51:12)


at Axios._request (webpack-internal:///(rsc)/./node_modules/axios/lib/core/Axios.js:168:83)


at Axios.request (webpack-internal:///(rsc)/./node_modules/axios/lib/core/Axios.js:46:31)


at Axios.<computed> [as get] (webpack-internal:///(rsc)/./node_modules/axios/lib/core/Axios.js:193:21)


at Function.wrap [as get] (webpack-internal:///(rsc)/./node_modules/axios/lib/helpers/bind.js:8:19)


at fetchRecentItems (webpack-internal:///(rsc)/./src/lib/api.ts:34:78)


at RecentItems (webpack-internal:///(rsc)/./src/components/home/RecentItems.tsx:17:81)


at ej (/app/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:264151)


at /app/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:276953


at Object.toJSON (/app/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:281723)


at stringify (<anonymous>)


at /app/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:268079


at ez (/app/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:268158)


at eH (/app/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:268559)


at Timeout._onTimeout (/app/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:265057)


at listOnTimeout (node:internal/timers:581:17)


at process.processTimers (node:internal/timers:519:7)


at Axios.request (webpack-internal:///(rsc)/./node_modules/axios/lib/core/Axios.js:50:49)


at async fetchRecentItems (webpack-internal:///(rsc)/./src/lib/api.ts:34:26)


at async RecentItems (webpack-internal:///(rsc)/./src/components/home/RecentItems.tsx:17:17) {


code: 'ERR_INVALID_URL',


input: '/api/items'


}


Failed to load items: Error: Failed to fetch items. Please try again later.


at fetchRecentItems (webpack-internal:///(rsc)/./src/lib/api.ts:47:15)


at async RecentItems (webpack-internal:///(rsc)/./src/components/home/RecentItems.tsx:17:17)