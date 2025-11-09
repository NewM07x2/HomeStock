CreateCategoryModal.tsx:87 
 POST http://localhost:3000/api/categories 500 (Internal Server Error)
handleSubmit	@	CreateCategoryModal.tsx:87

カテゴリの作成に失敗しました



○ Compiling /settings/categories ...


✓ Compiled /settings/categories in 1802ms (710 modules)


GET /settings/categories 200 in 2202ms


○ Compiling /not-found ...


✓ Compiled /api/categories in 1196ms (713 modules)


✓ Compiled in 1ms (532 modules)


✓ Compiled in 1ms (532 modules)


✓ Compiled in 0ms (532 modules)


GET /.well-known/appspecific/com.chrome.devtools.json 404 in 1852ms


GET /settings/categories?_rsc=4aw54 200 in 1152ms


GET /api/categories 200 in 1489ms


GET /api/categories 200 in 39ms


POST /api/categories 500 in 82ms


POST /api/categories 500 in 45ms


✓ Compiled /api/categories/[id] in 183ms (534 modules)


PUT /api/categories/C00000002 200 in 575ms


GET /api/categories 200 in 25ms


PUT /api/categories/C00000002 200 in 67ms


GET /api/categories 200 in 15ms


PUT /api/categories/C00000002 200 in 39ms


GET /api/categories 200 in 15ms


PUT /api/categories/C00000002 200 in 49ms


GET /api/categories 200 in 16ms


POST /api/categories 500 in 50ms


{"time":"2025-11-09T14:05:13.866167299Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/categories","user_agent":"axios/1.12.2","status":200,"error":"","latency":338583,"latency_human":"338.583µs","bytes_in":0,"bytes_out":544}


2025/11/09 14:05:16 [Controller] PUT /api/categories/C00000002 - リクエスト受信


2025/11/09 14:05:16 [Repository] UpdateCategory - id: C00000002, name: 消耗品


2025/11/09 14:05:16 [Repository] カテゴリ更新成功: C00000002


2025/11/09 14:05:16 [Controller] 成功: カテゴリを更新しました (ID: C00000002)


{"time":"2025-11-09T14:05:16.857291883Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"PUT","uri":"/api/categories/C00000002","user_agent":"axios/1.12.2","status":200,"error":"","latency":1372709,"latency_human":"1.372709ms","bytes_in":96,"bytes_out":200}


{"time":"2025-11-09T14:05:16.883558508Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/categories","user_agent":"axios/1.12.2","status":200,"error":"","latency":324458,"latency_human":"324.458µs","bytes_in":0,"bytes_out":544}


2025/11/09 14:05:16 [Controller] GET /api/categories - リクエスト受信


2025/11/09 14:05:16 [Repository] FetchCategories


2025/11/09 14:05:16 [Repository] 取得成功: 3件のカテゴリ


2025/11/09 14:05:16 [Controller] 成功: 3件のカテゴリを取得しました


2025/11/09 14:05:22 [Controller] PUT /api/categories/C00000002 - リクエスト受信


2025/11/09 14:05:22 [Repository] UpdateCategory - id: C00000002, name: 消耗品


2025/11/09 14:05:22 [Repository] カテゴリ更新成功: C00000002


2025/11/09 14:05:22 [Controller] 成功: カテゴリを更新しました (ID: C00000002)


{"time":"2025-11-09T14:05:22.347152761Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"PUT","uri":"/api/categories/C00000002","user_agent":"axios/1.12.2","status":200,"error":"","latency":7944041,"latency_human":"7.944041ms","bytes_in":97,"bytes_out":201}


2025/11/09 14:05:22 [Controller] GET /api/categories - リクエスト受信


2025/11/09 14:05:22 [Repository] FetchCategories


{"time":"2025-11-09T14:05:22.369194844Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/categories","user_agent":"axios/1.12.2","status":200,"error":"","latency":626625,"latency_human":"626.625µs","bytes_in":0,"bytes_out":545}


2025/11/09 14:05:22 [Repository] 取得成功: 3件のカテゴリ


2025/11/09 14:05:22 [Controller] 成功: 3件のカテゴリを取得しました


2025/11/09 14:05:30 [Controller] POST /api/categories - リクエスト受信


2025/11/09 14:05:30 [Repository] CreateCategory - name: test


{"time":"2025-11-09T14:05:30.047814334Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"POST","uri":"/api/categories","user_agent":"axios/1.12.2","status":500,"error":"","latency":1833959,"latency_human":"1.833959ms","bytes_in":46,"bytes_out":55}


2025/11/09 14:05:30 [Repository] カテゴリ作成エラー: pq: null value in column "code" of relation "categories" violates not-null constraint


2025/11/09 14:05:30 [Controller] エラー: カテゴリ作成に失敗しました: pq: null value in column "code" of relation "categories" violates not-null constraint