package controller

import (
	"log"
	"net/http"
	"strconv"

	"go-hsm-app/internal/service"

	"github.com/labstack/echo/v4"
)

// GetRecentItems は GET /api/items リクエストを処理します
func GetRecentItems(c echo.Context) error {
	log.Printf("[Controller] GET /api/items - リクエスト受信")

	// クエリ文字列から limit パラメータを取得
	limitStr := c.QueryParam("limit")
	limit := 10
	if limitStr != "" {
		if limitNum, err := strconv.Atoi(limitStr); err == nil && limitNum > 0 {
			limit = limitNum
		}
	}

	log.Printf("[Controller] limit: %d", limit)

	// サービス層からアイテムを取得
	items, err := service.GetRecentItems(limit)
	if err != nil {
		log.Printf("[Controller] エラー: アイテム取得に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "internal_error",
			"message": "Failed to fetch items",
		})
	}

	log.Printf("[Controller] 成功: %d件のアイテムを取得しました", len(items))

	// Return JSON response
	return c.JSON(http.StatusOK, map[string]interface{}{
		"items": items,
		"total": len(items),
	})
}
