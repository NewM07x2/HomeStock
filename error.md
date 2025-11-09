以下のエラーにより、DB操作ができない。
新規登録時
CreateCategoryModal.tsx:87 
 POST http://localhost:3000/api/categories 405 (Method Not Allowed)

更新時
CreateCategoryModal.tsx:85 
 PUT http://localhost:3000/api/categories/C00000002 404 (Not Found)
handleSubmit	@	CreateCategoryModal.tsx:85


削除時
page.tsx:53 
 DELETE http://localhost:3000/api/categories/C00000002 404 (Not Found)
handleDelete	@	page.tsx:53
onClick	@	page.tsx:143



ーーーー

▲ Next.js 14.1.0


- Local: http://localhost:3000⁠




✓ Ready in 1397ms


○ Compiling /settings/categories ...


✓ Compiled /settings/categories in 3.4s (710 modules)


✓ Compiled in 322ms (322 modules)


GET /settings/categories 200 in 3784ms


○ Compiling /not-found ...


✓ Compiled /not-found in 759ms (391 modules)


GET /.well-known/appspecific/com.chrome.devtools.json 404 in 1270ms


○ Compiling /api/categories ...


✓ Compiled /api/categories in 1027ms (532 modules)


GET /api/categories 200 in 1443ms


GET /api/categories 200 in 30ms


POST /api/categories 405 in 44ms


✓ Compiled /api/categories/[id] in 251ms (534 modules)


PUT /api/categories/C00000002 404 in 624ms


DELETE /api/categories/C00000002 404 in 50ms

ーーーー
⇨ http server started on [::]:8080


2025/11/09 13:57:17 [Controller] GET /api/categories - リクエスト受信


2025/11/09 13:57:17 [Repository] FetchCategories


2025/11/09 13:57:17 [Repository] 取得成功: 3件のカテゴリ


2025/11/09 13:57:17 [Controller] 成功: 3件のカテゴリを取得しました


{"time":"2025-11-09T13:57:17.295866925Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/categories","user_agent":"axios/1.12.2","status":200,"error":"","latency":12432750,"latency_human":"12.43275ms","bytes_in":0,"bytes_out":544}


{"time":"2025-11-09T13:57:17.335644217Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/categories","user_agent":"axios/1.12.2","status":200,"error":"","latency":370250,"latency_human":"370.25µs","bytes_in":0,"bytes_out":544}


2025/11/09 13:57:17 [Controller] GET /api/categories - リクエスト受信


2025/11/09 13:57:17 [Repository] FetchCategories


2025/11/09 13:57:17 [Repository] 取得成功: 3件のカテゴリ


2025/11/09 13:57:17 [Controller] 成功: 3件のカテゴリを取得しました


{"time":"2025-11-09T13:57:22.56007097Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"POST","uri":"/api/categories","user_agent":"axios/1.12.2","status":405,"error":"code=405, message=Method Not Allowed","latency":473666,"latency_human":"473.666µs","bytes_in":46,"bytes_out":33}


{"time":"2025-11-09T13:57:28.573107Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"PUT","uri":"/api/categories/C00000002","user_agent":"axios/1.12.2","status":404,"error":"code=404, message=Not Found","latency":62958,"latency_human":"62.958µs","bytes_in":96,"bytes_out":24}


{"time":"2025-11-09T13:57:31.857214418Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"DELETE","uri":"/api/categories/C00000002","user_agent":"axios/1.12.2","status":404,"error":"code=404, message=Not Found","latency":239584,"latency_human":"239.584µs","bytes_in":0,"bytes_out":24}


# すべてのコンテナを停止
docker-compose down

# 再ビルドして起動
docker-compose up -d --build

# コンテナ内の.nextフォルダを削除してから再起動
docker-compose exec next-app rm -rf .next
docker-compose restart next-app