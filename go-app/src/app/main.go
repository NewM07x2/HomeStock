package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	e.GET("/health", func(c echo.Context) error {
		return c.String(http.StatusOK, "API is running")
	})

	e.GET("/tasks", func(c echo.Context) error {
		tasks := []map[string]interface{}{
			{"id": 1, "title": "Buy milk"},
			{"id": 2, "title": "Write report"},
		}
		return c.JSON(http.StatusOK, tasks)
	})

	e.POST("/tasks", func(c echo.Context) error {
		var payload struct {
			Title string `json:"title"`
		}
		if err := c.Bind(&payload); err != nil {
			return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		}
		created := map[string]interface{}{"id": 3, "title": payload.Title}
		return c.JSON(http.StatusCreated, created)
	})

	e.Logger.Fatal(e.Start(":8080"))
}
