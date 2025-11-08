package main

import (
	"log"
	"net/http"

	"go-hsm-app/internal/common"
	"go-hsm-app/internal/controller"
	"go-hsm-app/internal/lib/graph/generated"
	graph "go-hsm-app/internal/lib/graph/resolver"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// データベースを初期化
	if err := common.InitDB(); err != nil {
		log.Fatalf("データベースの初期化に失敗しました: %v", err)
	}
	defer common.CloseDB()

	// Echoインスタンスを作成
	e := echo.New()

	// ミドルウェア設定
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// ヘルスチェック用エンドポイント
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status":  "ok",
			"message": "API is running",
		})
	})

	// GraphQL ハンドラ
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{
		Resolvers: &graph.Resolver{
			DB: common.DB,
		},
	}))

	// GraphQL エンドポイント
	e.POST("/graphql", echo.WrapHandler(srv))
	e.GET("/graphql", echo.WrapHandler(playground.Handler("GraphQL Playground", "/graphql")))

	// REST API エンドポイント
	e.GET("/api/items", controller.GetRecentItems)
	e.GET("/api/categories", controller.GetCategories)
	e.GET("/api/units", controller.GetUnits)
	e.GET("/api/attributes", controller.GetAttributes)
	e.GET("/api/users", controller.GetUsers)

	// サーバー起動
	port := ":8080"
	log.Printf("🚀 Server ready at http://localhost%s", port)
	log.Printf("📊 GraphQL Playground at http://localhost%s/graphql", port)

	if err := e.Start(port); err != nil {
		log.Fatalf("サーバーの起動に失敗しました: %v", err)
	}
}
