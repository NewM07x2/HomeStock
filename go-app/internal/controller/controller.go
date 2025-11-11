package controller

import (
	"log"
	"net/http"
	"strconv"
	"strings"

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

// GetItemByID は GET /api/items/:id リクエストを処理します
func GetItemByID(c echo.Context) error {
	id := c.Param("id")
	log.Printf("[Controller] GET /api/items/%s - リクエスト受信", id)

	// サービス層からアイテムを取得
	item, err := service.GetItemByID(id)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			log.Printf("[Controller] アイテムが見つかりません: %s", id)
			return c.JSON(http.StatusNotFound, map[string]string{
				"error":   "not_found",
				"message": "Item not found",
			})
		}
		log.Printf("[Controller] エラー: アイテム取得に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "internal_error",
			"message": "Failed to fetch item",
		})
	}

	log.Printf("[Controller] 成功: アイテムを取得しました (ID: %s)", id)
	return c.JSON(http.StatusOK, item)
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
		Code        string `json:"code"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	category, err := service.CreateCategory(req.Code, req.Name, req.Description)
	if err != nil {
		log.Printf("[Controller] エラー: カテゴリ作成に失敗しました: %v", err)
		errorMsg := "カテゴリの作成に失敗しました"
		if strings.Contains(err.Error(), "duplicate key") {
			errorMsg = "このカテゴリコードは既に使用されています"
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": errorMsg,
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
		Code        string `json:"code"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	category, err := service.UpdateCategory(id, req.Code, req.Name, req.Description)
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
		Code        string `json:"code"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	unit, err := service.CreateUnit(req.Code, req.Name, req.Description)
	if err != nil {
		log.Printf("[Controller] エラー: 単位作成に失敗しました: %v", err)
		errorMsg := "単位の作成に失敗しました"
		if strings.Contains(err.Error(), "duplicate key") {
			errorMsg = "この単位コードは既に使用されています"
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": errorMsg,
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
		Code        string `json:"code"`
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	unit, err := service.UpdateUnit(id, req.Code, req.Name, req.Description)
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
		Code        string `json:"code"`
		Name        string `json:"name"`
		ValueType   string `json:"value_type"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	// リクエストの内容をログ出力
	log.Printf("[Controller] リクエスト内容 - code: %s, name: %s, value_type: %s, description: %s",
		req.Code, req.Name, req.ValueType, req.Description)

	// value_typeのバリデーション
	if req.ValueType == "" {
		req.ValueType = "text" // デフォルト値
		log.Printf("[Controller] value_typeが空のため、デフォルト値'text'を設定")
	}
	validTypes := map[string]bool{"text": true, "number": true, "boolean": true, "date": true}
	if !validTypes[req.ValueType] {
		log.Printf("[Controller] エラー: 無効なvalue_type: %s", req.ValueType)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "value_typeは text, number, boolean, date のいずれかである必要があります",
		})
	}

	attribute, err := service.CreateAttribute(req.Code, req.Name, req.ValueType, req.Description)
	if err != nil {
		log.Printf("[Controller] エラー: 属性作成に失敗しました: %v", err)
		errorMsg := "属性の作成に失敗しました"
		if strings.Contains(err.Error(), "duplicate key") {
			errorMsg = "この属性コードは既に使用されています"
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": errorMsg,
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
		Code        string `json:"code"`
		Name        string `json:"name"`
		ValueType   string `json:"value_type"`
		Description string `json:"description"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	// リクエストの内容をログ出力
	log.Printf("[Controller] リクエスト内容 - code: %s, name: %s, value_type: %s, description: %s",
		req.Code, req.Name, req.ValueType, req.Description)

	// value_typeのバリデーション
	if req.ValueType == "" {
		req.ValueType = "text" // デフォルト値
		log.Printf("[Controller] value_typeが空のため、デフォルト値'text'を設定")
	}
	validTypes := map[string]bool{"text": true, "number": true, "boolean": true, "date": true}
	if !validTypes[req.ValueType] {
		log.Printf("[Controller] エラー: 無効なvalue_type: %s", req.ValueType)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "value_typeは text, number, boolean, date のいずれかである必要があります",
		})
	}

	attribute, err := service.UpdateAttribute(id, req.Code, req.Name, req.ValueType, req.Description)
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
		Email string `json:"email"`
		Role  string `json:"role"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	// リクエストの内容をログ出力
	log.Printf("[Controller] リクエスト内容 - email: %s, role: %s", req.Email, req.Role)

	// roleのバリデーション
	if req.Role == "" {
		req.Role = "viewer" // デフォルト値
		log.Printf("[Controller] roleが空のため、デフォルト値'viewer'を設定")
	}
	validRoles := map[string]bool{"admin": true, "operator": true, "viewer": true}
	if !validRoles[req.Role] {
		log.Printf("[Controller] エラー: 無効なrole: %s", req.Role)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "roleは admin, operator, viewer のいずれかである必要があります",
		})
	}

	user, err := service.CreateUser(req.Email, req.Role)
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
		Email string `json:"email"`
		Role  string `json:"role"`
	}

	if err := c.Bind(&req); err != nil {
		log.Printf("[Controller] エラー: リクエストのバインドに失敗しました: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "リクエストが不正です",
		})
	}

	// リクエストの内容をログ出力
	log.Printf("[Controller] リクエスト内容 - email: %s, role: %s", req.Email, req.Role)

	// roleのバリデーション
	if req.Role == "" {
		req.Role = "viewer" // デフォルト値
		log.Printf("[Controller] roleが空のため、デフォルト値'viewer'を設定")
	}
	validRoles := map[string]bool{"admin": true, "operator": true, "viewer": true}
	if !validRoles[req.Role] {
		log.Printf("[Controller] エラー: 無効なrole: %s", req.Role)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "roleは admin, operator, viewer のいずれかである必要があります",
		})
	}

	user, err := service.UpdateUser(id, req.Email, req.Role)
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

// GetStockHistory は GET /api/stock-history リクエストを処理します
func GetStockHistory(c echo.Context) error {
	log.Printf("[Controller] GET /api/stock-history - リクエスト受信")

	// ページネーションパラメータを取得
	pageStr := c.QueryParam("page")
	limitStr := c.QueryParam("limit")

	page := 1
	if pageStr != "" {
		if pageNum, err := strconv.Atoi(pageStr); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	limit := 100
	if limitStr != "" {
		if limitNum, err := strconv.Atoi(limitStr); err == nil && limitNum > 0 {
			limit = limitNum
		}
	}

	offset := (page - 1) * limit

	log.Printf("[Controller] page: %d, limit: %d, offset: %d", page, limit, offset)

	// サービス層から在庫履歴を取得
	histories, total, err := service.GetStockHistory(limit, offset)
	if err != nil {
		log.Printf("[Controller] エラー: 在庫履歴取得に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error":   "internal_error",
			"message": "Failed to fetch stock history",
		})
	}

	log.Printf("[Controller] 成功: %d件の在庫履歴を取得しました (total: %d)", len(histories), total)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"items": histories,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

// CreateItem は POST /api/items リクエストを処理します
func CreateItem(c echo.Context) error {
	log.Printf("[Controller] POST /api/items - リクエスト受信")

	var payload struct {
		Code       string   `json:"code"`
		Name       string   `json:"name"`
		CategoryID *string  `json:"category_id"`
		UnitID     string   `json:"unit_id"`
		Quantity   *int     `json:"quantity"`
		UnitPrice  *float64 `json:"unit_price"`
	}

	if err := c.Bind(&payload); err != nil {
		log.Printf("[Controller] リクエストボディのパースエラー: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "invalid_request",
		})
	}

	item, err := service.CreateItem(payload.Code, payload.Name, payload.UnitID, payload.CategoryID, payload.Quantity, payload.UnitPrice)
	if err != nil {
		log.Printf("[Controller] エラー: アイテム作成に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "アイテムの作成に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: アイテムを作成しました (ID: %s)", item.ID)
	return c.JSON(http.StatusCreated, item)
}

// UpdateItem は PUT /api/items/:id リクエストを処理します
func UpdateItem(c echo.Context) error {
	id := c.Param("id")
	log.Printf("[Controller] PUT /api/items/%s - リクエスト受信", id)

	var payload struct {
		Code       string   `json:"code"`
		Name       string   `json:"name"`
		CategoryID *string  `json:"category_id"`
		UnitID     string   `json:"unit_id"`
		Quantity   *int     `json:"quantity"`
		UnitPrice  *float64 `json:"unit_price"`
		Status     string   `json:"status"`
	}

	if err := c.Bind(&payload); err != nil {
		log.Printf("[Controller] リクエストボディのパースエラー: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "invalid_request",
		})
	}

	item, err := service.UpdateItem(id, payload.Code, payload.Name, payload.UnitID, payload.CategoryID, payload.Quantity, payload.UnitPrice, payload.Status)
	if err != nil {
		log.Printf("[Controller] エラー: アイテム更新に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "アイテムの更新に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: アイテムを更新しました (ID: %s)", id)
	return c.JSON(http.StatusOK, item)
}

// DeleteItem は DELETE /api/items/:id リクエストを処理します
func DeleteItem(c echo.Context) error {
	id := c.Param("id")
	log.Printf("[Controller] DELETE /api/items/%s - リクエスト受信", id)

	if err := service.DeleteItem(id); err != nil {
		log.Printf("[Controller] エラー: アイテム削除に失敗しました: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "アイテムの削除に失敗しました",
		})
	}

	log.Printf("[Controller] 成功: アイテムを削除しました (ID: %s)", id)
	return c.JSON(http.StatusOK, map[string]string{
		"message": "アイテムを削除しました",
	})
}
