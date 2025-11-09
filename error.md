{"time":"2025-11-09T14:27:45.579824549Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/units","user_agent":"axios/1.12.2","status":200,"error":"","latency":1733833,"latency_human":"1.733833ms","bytes_in":0,"bytes_out":1018}


2025/11/09 14:27:47 [Controller] DELETE /api/units/UN00000007 - リクエスト受信


2025/11/09 14:27:47 [Repository] DeleteUnit - id: UN00000007


2025/11/09 14:27:47 [Repository] 単位削除成功: UN00000007


2025/11/09 14:27:47 [Controller] 成功: 単位を削除しました (ID: UN00000007)


{"time":"2025-11-09T14:27:47.816907675Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"DELETE","uri":"/api/units/UN00000007","user_agent":"axios/1.12.2","status":200,"error":"","latency":1097125,"latency_human":"1.097125ms","bytes_in":0,"bytes_out":42}


2025/11/09 14:27:48 [Controller] GET /api/units - リクエスト受信


2025/11/09 14:27:48 [Repository] FetchUnits


2025/11/09 14:27:48 [Repository] 取得成功: 5件の単位


2025/11/09 14:27:48 [Controller] 成功: 5件の単位を取得しました


{"time":"2025-11-09T14:27:48.676234426Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/units","user_agent":"axios/1.12.2","status":200,"error":"","latency":777792,"latency_human":"777.792µs","bytes_in":0,"bytes_out":861}


2025/11/09 14:27:53 [Controller] POST /api/units - リクエスト受信


2025/11/09 14:27:53 [Repository] CreateUnit - code: test, name: test


{"time":"2025-11-09T14:27:53.495355761Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"POST","uri":"/api/units","user_agent":"axios/1.12.2","status":500,"error":"","latency":3539125,"latency_human":"3.539125ms","bytes_in":46,"bytes_out":49}


2025/11/09 14:27:53 [Repository] 単位作成エラー: pq: duplicate key value violates unique constraint "units_code_key"


2025/11/09 14:27:53 [Controller] エラー: 単位作成に失敗しました: pq: duplicate key value violates unique constraint "units_code_key"


2025/11/09 14:27:55 [Controller] POST /api/units - リクエスト受信


2025/11/09 14:27:55 [Repository] CreateUnit - code: test, name: test


{"time":"2025-11-09T14:27:55.017094554Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"POST","uri":"/api/units","user_agent":"axios/1.12.2","status":500,"error":"","latency":1350833,"latency_human":"1.350833ms","bytes_in":46,"bytes_out":49}


2025/11/09 14:27:55 [Repository] 単位作成エラー: pq: duplicate key value violates unique constraint "units_code_key"


2025/11/09 14:27:55 [Controller] エラー: 単位作成に失敗しました: pq: duplicate key value violates unique constraint "units_code_key"


2025/11/09 14:27:55 [Controller] POST /api/units - リクエスト受信


2025/11/09 14:27:55 [Repository] CreateUnit - code: test, name: test


{"time":"2025-11-09T14:27:55.336984554Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"POST","uri":"/api/units","user_agent":"axios/1.12.2","status":500,"error":"","latency":1795042,"latency_human":"1.795042ms","bytes_in":46,"bytes_out":49}


2025/11/09 14:27:55 [Repository] 単位作成エラー: pq: duplicate key value violates unique constraint "units_code_key"


2025/11/09 14:27:55 [Controller] エラー: 単位作成に失敗しました: pq: duplicate key value violates unique constraint "units_code_key"


2025/11/09 14:27:55 [Controller] POST /api/units - リクエスト受信


2025/11/09 14:27:55 [Repository] CreateUnit - code: test, name: test


{"time":"2025-11-09T14:27:55.522263804Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"POST","uri":"/api/units","user_agent":"axios/1.12.2","status":500,"error":"","latency":891500,"latency_human":"891.5µs","bytes_in":46,"bytes_out":49}


2025/11/09 14:27:55 [Repository] 単位作成エラー: pq: duplicate key value violates unique constraint "units_code_key"


2025/11/09 14:27:55 [Controller] エラー: 単位作成に失敗しました: pq: duplicate key value violates unique constraint "units_code_key"


2025/11/09 14:27:55 [Controller] POST /api/units - リクエスト受信


2025/11/09 14:27:55 [Repository] CreateUnit - code: test, name: test


{"time":"2025-11-09T14:27:55.728092387Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"POST","uri":"/api/units","user_agent":"axios/1.12.2","status":500,"error":"","latency":1159041,"latency_human":"1.159041ms","bytes_in":46,"bytes_out":49}


2025/11/09 14:27:55 [Repository] 単位作成エラー: pq: duplicate key value violates unique constraint "units_code_key"


2025/11/09 14:27:55 [Controller] エラー: 単位作成に失敗しました: pq: duplicate key value violates unique constraint "units_code_key"


2025/11/09 14:27:58 [Controller] GET /api/attributes - リクエスト受信


2025/11/09 14:27:58 [Repository] FetchAttributes


2025/11/09 14:27:58 [Repository] 取得成功: 6件の属性


2025/11/09 14:27:58 [Controller] 成功: 6件の属性を取得しました


{"time":"2025-11-09T14:27:58.455697014Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"GET","uri":"/api/attributes","user_agent":"axios/1.12.2","status":200,"error":"","latency":1112417,"latency_human":"1.112417ms","bytes_in":0,"bytes_out":1147}


2025/11/09 14:27:58 [Controller] GET /api/attributes - リクエスト受信