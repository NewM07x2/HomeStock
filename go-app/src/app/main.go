package main

import (
	"net/http"

	"your_project/graph"
	"your_project/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	e.GET("/test", func(c echo.Context) error {
		return c.String(http.StatusOK, "API is running")
	})

	// GraphQL endpoint
	e.POST("/graphql", echo.WrapHandler(handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))))
	e.GET("/playground", echo.WrapHandler(playground.Handler("GraphQL Playground", "/graphql")))

	e.Logger.Fatal(e.Start(":8080"))
}
