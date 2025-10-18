package main

import (
	"log"
	"net/http"

	"go-hsm-app/database"
	"go-hsm-app/graph"
	"go-hsm-app/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer database.CloseDB()

	// Create Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Health check endpoint
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{
			"status":  "ok",
			"message": "API is running",
		})
	})

	// GraphQL handler
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{
		Resolvers: &graph.Resolver{
			DB: database.DB,
		},
	}))

	// GraphQL endpoints
	e.POST("/graphql", echo.WrapHandler(srv))
	e.GET("/graphql", echo.WrapHandler(playground.Handler("GraphQL Playground", "/graphql")))

	// Start server
	port := ":8080"
	log.Printf("🚀 Server ready at http://localhost%s", port)
	log.Printf("📊 GraphQL Playground at http://localhost%s/graphql", port)

	if err := e.Start(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
