package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
)

func setup() *echo.Echo {
	e := echo.New()
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
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
	return e
}

func TestHealth(t *testing.T) {
	e := setup()
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	var body map[string]string
	json.Unmarshal(rec.Body.Bytes(), &body)
	assert.Equal(t, "ok", body["status"])
}

func TestGetTasks(t *testing.T) {
	e := setup()
	req := httptest.NewRequest(http.MethodGet, "/tasks", nil)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusOK, rec.Code)
	var tasks []map[string]interface{}
	json.Unmarshal(rec.Body.Bytes(), &tasks)
	assert.Len(t, tasks, 2)
}

func TestCreateTask(t *testing.T) {
	e := setup()
	payload := `{"title":"New Task"}`
	req := httptest.NewRequest(http.MethodPost, "/tasks", nil)
	req.Header.Set("Content-Type", "application/json")
	req.Body = httptest.NewBodyString(payload)
	rec := httptest.NewRecorder()
	e.ServeHTTP(rec, req)

	assert.Equal(t, http.StatusCreated, rec.Code)
	var created map[string]interface{}
	json.Unmarshal(rec.Body.Bytes(), &created)
	assert.Equal(t, "New Task", created["title"])
}
