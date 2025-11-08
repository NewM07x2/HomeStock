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

// GetCategories は GET /api/categories リクエストを処理します
func GetCategories(c echo.Context) error {
	log.Printf("[Controller] GET /api/categories - リクエスト受信")

	categories, err := service.GetCategories()
	if err != nil {
		log.Printf("[Controller] エラー: カテゴリ取得に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "internal_error",
			"message": "Failed to fetch categories",
		})
	}

	log.Printf("[Controller] 成功: %d件のカテゴリを取得しました", len(categories))
	return c.JSON(http.StatusOK, categories)
}

// GetUnits は GET /api/units リクエストを処理します
func GetUnits(c echo.Context) error {
	log.Printf("[Controller] GET /api/units - リクエスト受信")

	units, err := service.GetUnits()
	if err != nil {
		log.Printf("[Controller] エラー: 単位取得に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "internal_error",
			"message": "Failed to fetch units",
		})
	}

	log.Printf("[Controller] 成功: %d件の単位を取得しました", len(units))
	return c.JSON(http.StatusOK, units)
}

// GetAttributes は GET /api/attributes リクエストを処理します
func GetAttributes(c echo.Context) error {
	log.Printf("[Controller] GET /api/attributes - リクエスト受信")

	attributes, err := service.GetAttributes()
	if err != nil {
		log.Printf("[Controller] エラー: 属性取得に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "internal_error",
			"message": "Failed to fetch attributes",
		})
	}

	log.Printf("[Controller] 成功: %d件の属性を取得しました", len(attributes))
	return c.JSON(http.StatusOK, attributes)
}

// GetUsers は GET /api/users リクエストを処理します
func GetUsers(c echo.Context) error {
	log.Printf("[Controller] GET /api/users - リクエスト受信")

	users, err := service.GetUsers()
	if err != nil {
		log.Printf("[Controller] エラー: ユーザー取得に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "internal_error",
			"message": "Failed to fetch users",
		})
	}

	log.Printf("[Controller] 成功: %d件のユーザーを取得しました", len(users))
	return c.JSON(http.StatusOK, users)
}
