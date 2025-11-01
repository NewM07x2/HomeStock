package common

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

// DB はグローバルなデータベース接続プールを保持します。
var DB *sql.DB

// InitDB はデータベースへの接続を初期化します。
// 環境変数から接続情報を取得し、sql.Open でコネクションプールを作成します。
// 接続確認として Ping を実行します。
func InitDB() error {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "hsm")
	password := getEnv("DB_PASSWORD", "hsm")
	dbname := getEnv("DB_NAME", "hsm-db")

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	if err = DB.Ping(); err != nil {
		return fmt.Errorf("データベースへの ping に失敗しました: %w", err)
	}

	log.Println("✓ データベース接続が確立されました")
	return nil
}

// CloseDB はアプリケーション終了時にデータベース接続をクローズします。
func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}

// getEnv は環境変数を取得し、存在しない場合はデフォルト値を返します。
// 環境変数は .env や docker-compose の environment 経由で設定されます。
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
