package graph

import "database/sql"

// このファイルは自動生成で上書きされないファイルです。
// アプリケーションの依存性注入ポイントとして機能します。
// 必要な依存関係（DBクライアントなど）をここに追加してください。

type Resolver struct {
	DB *sql.DB
}
