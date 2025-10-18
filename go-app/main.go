package main

import (
	"go-hsm-app/graph"
	"go-hsm-app/graph/generated"
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
)

func main() {
	// Initialize the database
	graph.InitDB()

	e := echo.New()

	e.GET("/test", func(c echo.Context) error {
		return c.String(http.StatusOK, "API is running")
	})

	// GraphQL endpoint
	e.POST("/graphql", echo.WrapHandler(handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))))
	e.GET("/playground", echo.WrapHandler(playground.Handler("GraphQL Playground", "/graphql")))

	log.Fatal(e.Start(":8080"))
}
