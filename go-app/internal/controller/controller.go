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

// CreateCategory は POST /api/categories リクエストを処理します
func CreateCategory(c echo.Context) error {
	log.Printf("[Controller] POST /api/categories - リクエスト受信")

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	category, err := service.CreateCategory(req.Name, req.Description)
	if err != nil {
		log.Printf("[Controller] エラー: カテゴリ作成に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "カテゴリの作成に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: カテゴリを作成しました (ID: %s)", category.ID)
	return c.JSON(http.StatusCreated, category)
}

// UpdateCategory は PUT /api/categories/:id リクエストを処理します
func UpdateCategory(c echo.Context) error {
	id := c.Param("id")
	log.Printf("[Controller] PUT /api/categories/%s - リクエスト受信", id)

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	category, err := service.UpdateCategory(id, req.Name, req.Description)
	if err != nil {
		log.Printf("[Controller] エラー: カテゴリ更新に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "カテゴリの更新に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: カテゴリを更新しました (ID: %s)", id)
	return c.JSON(http.StatusOK, category)
}

// DeleteCategory は DELETE /api/categories/:id リクエストを処理します
func DeleteCategory(c echo.Context) error {
	id := c.Param("id")
	log.Printf("[Controller] DELETE /api/categories/%s - リクエスト受信", id)

	if err := service.DeleteCategory(id); err != nil {
		log.Printf("[Controller] エラー: カテゴリ削除に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "カテゴリの削除に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: カテゴリを削除しました (ID: %s)", id)
	return c.JSON(http.StatusOK, map[string]string{
		"message": "カテゴリを削除しました",
	})
}

// CreateUnit は POST /api/units リクエストを処理します
func CreateUnit(c echo.Context) error {
	log.Printf("[Controller] POST /api/units - リクエスト受信")

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	unit, err := service.CreateUnit(req.Name, req.Description)
	if err != nil {
		log.Printf("[Controller] エラー: 単位作成に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "単位の作成に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: 単位を作成しました (ID: %s)", unit.ID)
	return c.JSON(http.StatusCreated, unit)
}

// UpdateUnit は PUT /api/units/:id リクエストを処理します
func UpdateUnit(c echo.Context) error {
	id := c.Param("id")
	log.Printf("[Controller] PUT /api/units/%s - リクエスト受信", id)

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	unit, err := service.UpdateUnit(id, req.Name, req.Description)
	if err != nil {
		log.Printf("[Controller] エラー: 単位更新に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "単位の更新に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: 単位を更新しました (ID: %s)", id)
	return c.JSON(http.StatusOK, unit)
}

// DeleteUnit は DELETE /api/units/:id リクエストを処理します
func DeleteUnit(c echo.Context) error {
	id := c.Param("id")
	log.Printf("[Controller] DELETE /api/units/%s - リクエスト受信", id)

	if err := service.DeleteUnit(id); err != nil {
		log.Printf("[Controller] エラー: 単位削除に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "単位の削除に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: 単位を削除しました (ID: %s)", id)
	return c.JSON(http.StatusOK, map[string]string{
		"message": "単位を削除しました",
	})
}

// CreateAttribute は POST /api/attributes リクエストを処理します
func CreateAttribute(c echo.Context) error {
	log.Printf("[Controller] POST /api/attributes - リクエスト受信")

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	attribute, err := service.CreateAttribute(req.Name, req.Description)
	if err != nil {
		log.Printf("[Controller] エラー: 属性作成に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "属性の作成に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: 属性を作成しました (ID: %s)", attribute.ID)
	return c.JSON(http.StatusCreated, attribute)
}

// UpdateAttribute は PUT /api/attributes/:id リクエストを処理します
func UpdateAttribute(c echo.Context) error {
	id := c.Param("id")
	log.Printf("[Controller] PUT /api/attributes/%s - リクエスト受信", id)

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	attribute, err := service.UpdateAttribute(id, req.Name, req.Description)
	if err != nil {
		log.Printf("[Controller] エラー: 属性更新に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "属性の更新に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: 属性を更新しました (ID: %s)", id)
	return c.JSON(http.StatusOK, attribute)
}

// DeleteAttribute は DELETE /api/attributes/:id リクエストを処理します
func DeleteAttribute(c echo.Context) error {
	id := c.Param("id")
	log.Printf("[Controller] DELETE /api/attributes/%s - リクエスト受信", id)

	if err := service.DeleteAttribute(id); err != nil {
		log.Printf("[Controller] エラー: 属性削除に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "属性の削除に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: 属性を削除しました (ID: %s)", id)
	return c.JSON(http.StatusOK, map[string]string{
		"message": "属性を削除しました",
	})
}

// CreateUser は POST /api/users リクエストを処理します
func CreateUser(c echo.Context) error {
	log.Printf("[Controller] POST /api/users - リクエスト受信")

	var req struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	user, err := service.CreateUser(req.Name, req.Email)
	if err != nil {
		log.Printf("[Controller] エラー: ユーザー作成に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "ユーザーの作成に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: ユーザーを作成しました (ID: %s)", user.ID)
	return c.JSON(http.StatusCreated, user)
}

// UpdateUser は PUT /api/users/:id リクエストを処理します
func UpdateUser(c echo.Context) error {
	id := c.Param("id")
	log.Printf("[Controller] PUT /api/users/%s - リクエスト受信", id)

	var req struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	user, err := service.UpdateUser(id, req.Name, req.Email)
	if err != nil {
		log.Printf("[Controller] エラー: ユーザー更新に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "ユーザーの更新に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: ユーザーを更新しました (ID: %s)", id)
	return c.JSON(http.StatusOK, user)
}

// DeleteUser は DELETE /api/users/:id リクエストを処理します
func DeleteUser(c echo.Context) error {
	id := c.Param("id")
	log.Printf("[Controller] DELETE /api/users/%s - リクエスト受信", id)

	if err := service.DeleteUser(id); err != nil {
		log.Printf("[Controller] エラー: ユーザー削除に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "ユーザーの削除に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: ユーザーを削除しました (ID: %s)", id)
	return c.JSON(http.StatusOK, map[string]string{
		"message": "ユーザーを削除しました",
	})
}
