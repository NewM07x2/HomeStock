{"time":"2025-11-09T14:18:49.954135385Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/categories","user_agent":"axios/1.12.2","status":200,"error":"","latency":413833,"latency_human":"413.833µs","bytes_in":0,"bytes_out":700}


2025/11/09 14:18:49 [Repository] 取得成功: 4件のカテゴリ


2025/11/09 14:18:49 [Controller] 成功: 4件のカテゴリを取得しました


2025/11/09 14:19:00 [Controller] DELETE /api/categories/C00000007 - リクエスト受信


2025/11/09 14:19:00 [Repository] DeleteCategory - id: C00000007


{"time":"2025-11-09T14:19:00.961631167Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"DELETE","uri":"/api/categories/C00000007","user_agent":"axios/1.12.2","status":200,"error":"","latency":5734083,"latency_human":"5.734083ms","bytes_in":0,"bytes_out":48}


2025/11/09 14:19:00 [Repository] カテゴリ削除成功: C00000007


2025/11/09 14:19:00 [Controller] 成功: カテゴリを削除しました (ID: C00000007)


2025/11/09 14:19:02 [Controller] GET /api/categories - リクエスト受信


2025/11/09 14:19:02 [Repository] FetchCategories


{"time":"2025-11-09T14:19:02.312548668Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/categories","user_agent":"axios/1.12.2","status":200,"error":"","latency":845209,"latency_human":"845.209µs","bytes_in":0,"bytes_out":545}


2025/11/09 14:19:02 [Repository] 取得成功: 3件のカテゴリ


2025/11/09 14:19:02 [Controller] 成功: 3件のカテゴリを取得しました


2025/11/09 14:19:09 [Controller] GET /api/units - リクエスト受信


2025/11/09 14:19:09 [Repository] FetchUnits


2025/11/09 14:19:09 [Repository] 取得成功: 5件の単位


2025/11/09 14:19:09 [Controller] 成功: 5件の単位を取得しました


{"time":"2025-11-09T14:19:09.094034588Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/units","user_agent":"axios/1.12.2","status":200,"error":"","latency":8503167,"latency_human":"8.503167ms","bytes_in":0,"bytes_out":861}


{"time":"2025-11-09T14:19:09.131563505Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/units","user_agent":"axios/1.12.2","status":200,"error":"","latency":521417,"latency_human":"521.417µs","bytes_in":0,"bytes_out":861}


2025/11/09 14:19:09 [Controller] GET /api/units - リクエスト受信


2025/11/09 14:19:09 [Repository] FetchUnits


2025/11/09 14:19:09 [Repository] 取得成功: 5件の単位


2025/11/09 14:19:09 [Controller] 成功: 5件の単位を取得しました


2025/11/09 14:19:13 [Controller] POST /api/units - リクエスト受信


2025/11/09 14:19:13 [Repository] CreateUnit - name: test


2025/11/09 14:19:13 [Repository] 単位作成成功: UN00000006


2025/11/09 14:19:13 [Controller] 成功: 単位を作成しました (ID: UN00000006)


{"time":"2025-11-09T14:19:13.517762423Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"POST","uri":"/api/units","user_agent":"axios/1.12.2","status":201,"error":"","latency":7615541,"latency_human":"7.615541ms","bytes_in":46,"bytes_out":157}


2025/11/09 14:19:13 [Controller] GET /api/units - リクエスト受信


2025/11/09 14:19:13 [Repository] FetchUnits


2025/11/09 14:19:13 [Repository] 取得成功: 6件の単位


2025/11/09 14:19:13 [Controller] 成功: 6件の単位を取得しました


{"time":"2025-11-09T14:19:13.54711059Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/units","user_agent":"axios/1.12.2","status":200,"error":"","latency":562000,"latency_human":"562µs","bytes_in":0,"bytes_out":1018}


2025/11/09 14:19:26 [Controller] PUT /api/units/UN00000006 - リクエスト受信


2025/11/09 14:19:26 [Repository] UpdateUnit - id: UN00000006, name: test


2025/11/09 14:19:26 [Repository] 単位更新成功: UN00000006


