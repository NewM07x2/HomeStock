2025/11/10 05:26:01 [Controller] POST /api/attributes - リクエスト受信


2025/11/10 05:26:01 [Repository] CreateAttribute - code: test, name: test


2025/11/10 05:26:01 [Repository] 属性作成エラー: pq: new row for relation "attributes" violates check constraint "attributes_value_type_check"


2025/11/10 05:26:01 [Controller] エラー: 属性作成に失敗しました: pq: new row for relation "attributes" violates check constraint "attributes_value_type_check"


{"time":"2025-11-10T05:26:01.889739837Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"POST","uri":"/api/attributes","user_agent":"axios/1.12.2","status":500,"error":"","latency":12479916,"latency_human":"12.479916ms","bytes_in":66,"bytes_out":49}