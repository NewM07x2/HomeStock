package controller

import (
	"net/http"
	"strconv"

	"go-hsm-app/internal/service"

	"github.com/labstack/echo/v4"
)

// GetRecentItems は GET /api/items リクエストを処理します
func GetRecentItems(c echo.Context) error {
	// クエリ文字列から limit パラメータを取得
	limitStr := c.QueryParam("limit")
	limit := 10
	if limitStr != "" {
		if limitNum, err := strconv.Atoi(limitStr); err == nil && limitNum > 0 {
			limit = limitNum
		}
	}

	// サービス層からアイテムを取得
	items, err := service.GetRecentItems(limit)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "internal_error",
			"message": "Failed to fetch items",
		})
	}

	// Return JSON response
	return c.JSON(http.StatusOK, map[string]interface{}{
		"items": items,
		"total": len(items),
	})
}
