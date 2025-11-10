2025/11/10 05:32:08 [Controller] POST /api/users - リクエスト受信


2025/11/10 05:32:08 [Repository] CreateUser - email: test@gmail.com


2025/11/10 05:32:08 [Repository] ユーザー作成エラー: pq: new row for relation "users" violates check constraint "users_role_check"


2025/11/10 05:32:08 [Controller] エラー: ユーザー作成に失敗しました: pq: new row for relation "users" violates check constraint "users_role_check"


{"time":"2025-11-10T05:32:08.57508784Z","id":"","remote_ip":"172.18.0.4","host":"go-app:8080","method":"POST","uri":"/api/users","user_agent":"axios/1.12.2","status":500,"error":"","latency":5363041,"latency_human":"5.363041ms","bytes_in":66,"bytes_out":55}