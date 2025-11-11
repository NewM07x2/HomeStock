package repository

import (
	"database/sql"
	"go-hsm-app/internal/common"
	"go-hsm-app/internal/model"
	"log"
)

// FetchRecentItems はデータベースから直近のアイテムを取得します
// カテゴリと単位はマスタテーブルから結合して取得し、属性は別途取得します
func FetchRecentItems(limit int) ([]model.Item, error) {
	log.Printf("[Repository] FetchRecentItems - limit: %d", limit)

	rows, err := common.DB.Query(`
        SELECT 
					i.id, i.code, i.name, i.category_id, i.unit_id, i.quantity, i.unit_price, i.status, 
					i.created_at, i.updated_at,
					c.id, c.code, c.name,
					u.id, u.code, u.name
        FROM items i
        LEFT JOIN categories c ON i.category_id = c.id AND c.deleted_at IS NULL
        INNER JOIN units u ON i.unit_id = u.id AND u.deleted_at IS NULL
        WHERE i.deleted_at IS NULL
        ORDER BY i.created_at DESC
        LIMIT $1
    `, limit)
	if err != nil {
		log.Printf("[Repository] DB クエリエラー: %v", err)
		return nil, err
	}
	defer rows.Close()

	var items []model.Item
	for rows.Next() {
		var item model.Item
		var categoryID, categoryCode, categoryName sql.NullString
		var unitID, unitCode, unitName string

		// 必要なフィールドをスキャン
		if err := rows.Scan(
			&item.ID,
			&item.Code,
			&item.Name,
			&item.CategoryID,
			&item.UnitID,
			&item.Quantity,
			&item.UnitPrice,
			&item.Status,
			&item.CreatedAt,
			&item.UpdatedAt,
			&categoryID,
			&categoryCode,
			&categoryName,
			&unitID,
			&unitCode,
			&unitName,
		); err != nil {
			log.Printf("[Repository] スキャンエラー: %v", err)
			return nil, err
		}

		// カテゴリ情報をセット（NULLの場合はnilのまま）
		if categoryID.Valid {
			item.Category = &model.Category{
				ID:   categoryID.String,
				Code: categoryCode.String,
				Name: categoryName.String,
			}
		}

		// 単位情報をセット
		item.Unit = &model.Unit{
			ID:   unitID,
			Code: unitCode,
			Name: unitName,
		}

		// 属性情報を取得
		attributes, err := fetchItemAttributes(item.ID)
		if err != nil {
			log.Printf("[Repository] 属性取得エラー (item_id: %s): %v", item.ID, err)
			// エラーがあっても続行（属性は空配列）
		} else {
			item.Attributes = attributes
		}

		items = append(items, item)
	}

	// rows の反復中にエラーがないか確認
	if err = rows.Err(); err != nil {
		log.Printf("[Repository] rows.Err(): %v", err)
		return nil, err
	}

	log.Printf("[Repository] 取得成功: %d件のアイテム", len(items))
	return items, nil
}

// FetchItemByID はIDでアイテムを取得します
func FetchItemByID(id string) (*model.Item, error) {
	log.Printf("[Repository] FetchItemByID - id: %s", id)

	var item model.Item
	var categoryID, categoryCode, categoryName sql.NullString
	var unitID, unitCode, unitName string

	err := common.DB.QueryRow(`
        SELECT 
			i.id, i.code, i.name, i.category_id, i.unit_id, i.quantity, i.unit_price, i.status, 
			i.created_at, i.updated_at,
			c.id, c.code, c.name,
			u.id, u.code, u.name
        FROM items i
        LEFT JOIN categories c ON i.category_id = c.id AND c.deleted_at IS NULL
        INNER JOIN units u ON i.unit_id = u.id AND u.deleted_at IS NULL
        WHERE i.id = $1 AND i.deleted_at IS NULL
    `, id).Scan(
		&item.ID,
		&item.Code,
		&item.Name,
		&item.CategoryID,
		&item.UnitID,
		&item.Quantity,
		&item.UnitPrice,
		&item.Status,
		&item.CreatedAt,
		&item.UpdatedAt,
		&categoryID,
		&categoryCode,
		&categoryName,
		&unitID,
		&unitCode,
		&unitName,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("[Repository] アイテムが見つかりません: %s", id)
			return nil, sql.ErrNoRows
		}
		log.Printf("[Repository] DBクエリエラー: %v", err)
		return nil, err
	}

	// カテゴリ情報をセット（NULLの場合はnilのまま）
	if categoryID.Valid {
		item.Category = &model.Category{
			ID:   categoryID.String,
			Code: categoryCode.String,
			Name: categoryName.String,
		}
	}

	// 単位情報をセット
	item.Unit = &model.Unit{
		ID:   unitID,
		Code: unitCode,
		Name: unitName,
	}

	// 属性情報を取得
	attributes, err := fetchItemAttributes(item.ID)
	if err != nil {
		log.Printf("[Repository] 属性取得エラー (item_id: %s): %v", item.ID, err)
		// エラーがあっても続行（属性は空配列）
	} else {
		item.Attributes = attributes
	}

	log.Printf("[Repository] アイテム取得成功: %s", id)
	return &item, nil
}

// fetchItemAttributes は指定されたアイテムIDの属性情報を取得します
func fetchItemAttributes(itemID string) ([]model.ItemAttributeDetail, error) {
	rows, err := common.DB.Query(`
        SELECT a.code, a.name, a.value_type, ia.value
        FROM item_attributes ia
        INNER JOIN attributes a ON ia.attribute_id = a.id AND a.deleted_at IS NULL
        WHERE ia.item_id = $1
        ORDER BY a.code
    `, itemID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var attributes []model.ItemAttributeDetail
	for rows.Next() {
		var attr model.ItemAttributeDetail
		if err := rows.Scan(&attr.Code, &attr.Name, &attr.ValueType, &attr.Value); err != nil {
			return nil, err
		}
		attributes = append(attributes, attr)
	}

	return attributes, rows.Err()
}

// FetchCategories はデータベースから全カテゴリを取得します
func FetchCategories() ([]model.Category, error) {
	log.Printf("[Repository] FetchCategories")

	rows, err := common.DB.Query(`
        SELECT id, code, name, description, created_at, updated_at
        FROM categories
        WHERE deleted_at IS NULL
        ORDER BY code
    `)
	if err != nil {
		log.Printf("[Repository] DB クエリエラー: %v", err)
		return nil, err
	}
	defer rows.Close()

	var categories []model.Category
	for rows.Next() {
		var category model.Category
		if err := rows.Scan(
			&category.ID,
			&category.Code,
			&category.Name,
			&category.Description,
			&category.CreatedAt,
			&category.UpdatedAt,
		); err != nil {
			log.Printf("[Repository] スキャンエラー: %v", err)
			return nil, err
		}
		categories = append(categories, category)
	}

	log.Printf("[Repository] 取得成功: %d件のカテゴリ", len(categories))
	return categories, rows.Err()
}

// FetchUnits はデータベースから全単位を取得します
func FetchUnits() ([]model.Unit, error) {
	log.Printf("[Repository] FetchUnits")

	rows, err := common.DB.Query(`
        SELECT id, code, name, description, created_at, updated_at
        FROM units
        WHERE deleted_at IS NULL
        ORDER BY code
    `)
	if err != nil {
		log.Printf("[Repository] DB クエリエラー: %v", err)
		return nil, err
	}
	defer rows.Close()

	var units []model.Unit
	for rows.Next() {
		var unit model.Unit
		if err := rows.Scan(
			&unit.ID,
			&unit.Code,
			&unit.Name,
			&unit.Description,
			&unit.CreatedAt,
			&unit.UpdatedAt,
		); err != nil {
			log.Printf("[Repository] スキャンエラー: %v", err)
			return nil, err
		}
		units = append(units, unit)
	}

	log.Printf("[Repository] 取得成功: %d件の単位", len(units))
	return units, rows.Err()
}

// FetchAttributes はデータベースから全属性を取得します
func FetchAttributes() ([]model.Attribute, error) {
	log.Printf("[Repository] FetchAttributes")

	rows, err := common.DB.Query(`
        SELECT id, code, name, value_type, description, created_at, updated_at
        FROM attributes
        WHERE deleted_at IS NULL
        ORDER BY code
    `)
	if err != nil {
		log.Printf("[Repository] DB クエリエラー: %v", err)
		return nil, err
	}
	defer rows.Close()

	var attributes []model.Attribute
	for rows.Next() {
		var attribute model.Attribute
		if err := rows.Scan(
			&attribute.ID,
			&attribute.Code,
			&attribute.Name,
			&attribute.ValueType,
			&attribute.Description,
			&attribute.CreatedAt,
			&attribute.UpdatedAt,
		); err != nil {
			log.Printf("[Repository] スキャンエラー: %v", err)
			return nil, err
		}
		attributes = append(attributes, attribute)
	}

	log.Printf("[Repository] 取得成功: %d件の属性", len(attributes))
	return attributes, rows.Err()
}

// FetchUsers はデータベースから全ユーザーを取得します
func FetchUsers() ([]model.User, error) {
	log.Printf("[Repository] FetchUsers")

	rows, err := common.DB.Query(`
        SELECT id, email, role, created_at, updated_at
        FROM users
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
    `)
	if err != nil {
		log.Printf("[Repository] DB クエリエラー: %v", err)
		return nil, err
	}
	defer rows.Close()

	var users []model.User
	for rows.Next() {
		var user model.User
		if err := rows.Scan(
			&user.ID,
			&user.Email,
			&user.Role,
			&user.CreatedAt,
			&user.UpdatedAt,
		); err != nil {
			log.Printf("[Repository] スキャンエラー: %v", err)
			return nil, err
		}
		users = append(users, user)
	}

	log.Printf("[Repository] 取得成功: %d件のユーザー", len(users))
	return users, rows.Err()
}

// CreateCategory はカテゴリを作成します
func CreateCategory(code, name, description string) (*model.Category, error) {
	log.Printf("[Repository] CreateCategory - code: %s, name: %s", code, name)

	var category model.Category
	err := common.DB.QueryRow(`
		WITH new_id AS (
			SELECT 'C' || LPAD(nextval('categories_id_seq')::TEXT, 8, '0') as id
		)
		INSERT INTO categories (id, code, name, description)
		SELECT id, $1, $2, $3 FROM new_id
		RETURNING id, code, name, description, created_at, updated_at
	`, code, name, description).Scan(
		&category.ID,
		&category.Code,
		&category.Name,
		&category.Description,
		&category.CreatedAt,
		&category.UpdatedAt,
	)

	if err != nil {
		log.Printf("[Repository] カテゴリ作成エラー: %v", err)
		return nil, err
	}

	log.Printf("[Repository] カテゴリ作成成功: %s (code: %s)", category.ID, category.Code)
	return &category, nil
}

// UpdateCategory はカテゴリを更新します
func UpdateCategory(id, code, name, description string) (*model.Category, error) {
	log.Printf("[Repository] UpdateCategory - id: %s, code: %s, name: %s", id, code, name)

	var category model.Category
	err := common.DB.QueryRow(`
		UPDATE categories
		SET code = $2, name = $3, description = $4, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, code, name, description, created_at, updated_at
	`, id, code, name, description).Scan(
		&category.ID,
		&category.Code,
		&category.Name,
		&category.Description,
		&category.CreatedAt,
		&category.UpdatedAt,
	)

	if err != nil {
		log.Printf("[Repository] カテゴリ更新エラー: %v", err)
		return nil, err
	}

	log.Printf("[Repository] カテゴリ更新成功: %s", category.ID)
	return &category, nil
}

// DeleteCategory はカテゴリを削除します（論理削除）
func DeleteCategory(id string) error {
	log.Printf("[Repository] DeleteCategory - id: %s", id)

	result, err := common.DB.Exec(`
		UPDATE categories
		SET deleted_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND deleted_at IS NULL
	`, id)

	if err != nil {
		log.Printf("[Repository] カテゴリ削除エラー: %v", err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("[Repository] RowsAffected取得エラー: %v", err)
		return err
	}

	if rowsAffected == 0 {
		log.Printf("[Repository] カテゴリが見つかりません: %s", id)
		return sql.ErrNoRows
	}

	log.Printf("[Repository] カテゴリ削除成功: %s", id)
	return nil
}

// CreateUnit は単位を作成します
func CreateUnit(code, name, description string) (*model.Unit, error) {
	log.Printf("[Repository] CreateUnit - code: %s, name: %s", code, name)

	var unit model.Unit
	err := common.DB.QueryRow(`
		WITH new_id AS (
			SELECT 'UN' || LPAD(nextval('units_id_seq')::TEXT, 8, '0') as id
		)
		INSERT INTO units (id, code, name, description)
		SELECT id, $1, $2, $3 FROM new_id
		RETURNING id, code, name, description, created_at, updated_at
	`, code, name, description).Scan(
		&unit.ID,
		&unit.Code,
		&unit.Name,
		&unit.Description,
		&unit.CreatedAt,
		&unit.UpdatedAt,
	)

	if err != nil {
		log.Printf("[Repository] 単位作成エラー: %v", err)
		return nil, err
	}

	log.Printf("[Repository] 単位作成成功: %s (code: %s)", unit.ID, unit.Code)
	return &unit, nil
}

// UpdateUnit は単位を更新します
func UpdateUnit(id, code, name, description string) (*model.Unit, error) {
	log.Printf("[Repository] UpdateUnit - id: %s, code: %s, name: %s", id, code, name)

	var unit model.Unit
	err := common.DB.QueryRow(`
		UPDATE units
		SET code = $2, name = $3, description = $4, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, code, name, description, created_at, updated_at
	`, id, code, name, description).Scan(
		&unit.ID,
		&unit.Code,
		&unit.Name,
		&unit.Description,
		&unit.CreatedAt,
		&unit.UpdatedAt,
	)

	if err != nil {
		log.Printf("[Repository] 単位更新エラー: %v", err)
		return nil, err
	}

	log.Printf("[Repository] 単位更新成功: %s", unit.ID)
	return &unit, nil
}

// DeleteUnit は単位を削除します（論理削除）
func DeleteUnit(id string) error {
	log.Printf("[Repository] DeleteUnit - id: %s", id)

	result, err := common.DB.Exec(`
		UPDATE units
		SET deleted_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND deleted_at IS NULL
	`, id)

	if err != nil {
		log.Printf("[Repository] 単位削除エラー: %v", err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("[Repository] RowsAffected取得エラー: %v", err)
		return err
	}

	if rowsAffected == 0 {
		log.Printf("[Repository] 単位が見つかりません: %s", id)
		return sql.ErrNoRows
	}

	log.Printf("[Repository] 単位削除成功: %s", id)
	return nil
}

// CreateAttribute は属性を作成します
func CreateAttribute(code, name, valueType, description string) (*model.Attribute, error) {
	log.Printf("[Repository] CreateAttribute - code: %s, name: %s, valueType: %s", code, name, valueType)

	var attribute model.Attribute
	err := common.DB.QueryRow(`
		WITH new_id AS (
			SELECT 'A' || LPAD(nextval('attributes_id_seq')::TEXT, 8, '0') as id
		)
		INSERT INTO attributes (id, code, name, value_type, description)
		SELECT id, $1, $2, $3, $4 FROM new_id
		RETURNING id, code, name, value_type, description, created_at, updated_at
	`, code, name, valueType, description).Scan(
		&attribute.ID,
		&attribute.Code,
		&attribute.Name,
		&attribute.ValueType,
		&attribute.Description,
		&attribute.CreatedAt,
		&attribute.UpdatedAt,
	)

	if err != nil {
		log.Printf("[Repository] 属性作成エラー: %v", err)
		return nil, err
	}

	log.Printf("[Repository] 属性作成成功: %s (code: %s)", attribute.ID, attribute.Code)
	return &attribute, nil
}

// UpdateAttribute は属性を更新します
func UpdateAttribute(id, code, name, valueType, description string) (*model.Attribute, error) {
	log.Printf("[Repository] UpdateAttribute - id: %s, code: %s, name: %s, valueType: %s", id, code, name, valueType)

	var attribute model.Attribute
	err := common.DB.QueryRow(`
		UPDATE attributes
		SET code = $2, name = $3, value_type = $4, description = $5, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, code, name, value_type, description, created_at, updated_at
	`, id, code, name, valueType, description).Scan(
		&attribute.ID,
		&attribute.Code,
		&attribute.Name,
		&attribute.ValueType,
		&attribute.Description,
		&attribute.CreatedAt,
		&attribute.UpdatedAt,
	)

	if err != nil {
		log.Printf("[Repository] 属性更新エラー: %v", err)
		return nil, err
	}

	log.Printf("[Repository] 属性更新成功: %s", attribute.ID)
	return &attribute, nil
}

// DeleteAttribute は属性を削除します（論理削除）
func DeleteAttribute(id string) error {
	log.Printf("[Repository] DeleteAttribute - id: %s", id)

	result, err := common.DB.Exec(`
		UPDATE attributes
		SET deleted_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND deleted_at IS NULL
	`, id)

	if err != nil {
		log.Printf("[Repository] 属性削除エラー: %v", err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("[Repository] RowsAffected取得エラー: %v", err)
		return err
	}

	if rowsAffected == 0 {
		log.Printf("[Repository] 属性が見つかりません: %s", id)
		return sql.ErrNoRows
	}

	log.Printf("[Repository] 属性削除成功: %s", id)
	return nil
}

// CreateUser はユーザーを作成します
func CreateUser(email, role string) (*model.User, error) {
	log.Printf("[Repository] CreateUser - email: %s, role: %s", email, role)

	var user model.User
	err := common.DB.QueryRow(`
		WITH new_id AS (
			SELECT 'U' || LPAD(nextval('users_id_seq')::TEXT, 8, '0') as id
		)
		INSERT INTO users (id, email, password_hash, role)
		SELECT id, $1, 'temp_hash', $2 FROM new_id
		RETURNING id, email, role, created_at, updated_at
	`, email, role).Scan(
		&user.ID,
		&user.Email,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		log.Printf("[Repository] ユーザー作成エラー: %v", err)
		return nil, err
	}

	log.Printf("[Repository] ユーザー作成成功: %s", user.ID)
	return &user, nil
}

// UpdateUser はユーザーを更新します
func UpdateUser(id, email, role string) (*model.User, error) {
	log.Printf("[Repository] UpdateUser - id: %s, email: %s, role: %s", id, email, role)

	var user model.User
	err := common.DB.QueryRow(`
		UPDATE users
		SET email = $2, role = $3, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, email, role, created_at, updated_at
	`, id, email, role).Scan(
		&user.ID,
		&user.Email,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		log.Printf("[Repository] ユーザー更新エラー: %v", err)
		return nil, err
	}

	log.Printf("[Repository] ユーザー更新成功: %s", user.ID)
	return &user, nil
}

// DeleteUser はユーザーを削除します（論理削除）
func DeleteUser(id string) error {
	log.Printf("[Repository] DeleteUser - id: %s", id)

	result, err := common.DB.Exec(`
		UPDATE users
		SET deleted_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND deleted_at IS NULL
	`, id)

	if err != nil {
		log.Printf("[Repository] ユーザー削除エラー: %v", err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("[Repository] RowsAffected取得エラー: %v", err)
		return err
	}

	if rowsAffected == 0 {
		log.Printf("[Repository] ユーザーが見つかりません: %s", id)
		return sql.ErrNoRows
	}

	log.Printf("[Repository] ユーザー削除成功: %s", id)
	return nil
}

// FetchStockHistory は在庫履歴を取得します
func FetchStockHistory(limit, offset int) ([]model.StockHistory, int, error) {
	log.Printf("[Repository] FetchStockHistory - limit: %d, offset: %d", limit, offset)

	// 総件数を取得
	var total int
	err := common.DB.QueryRow(`
		SELECT COUNT(*) FROM stock_history
	`).Scan(&total)
	if err != nil {
		log.Printf("[Repository] 在庫履歴の総件数取得エラー: %v", err)
		return nil, 0, err
	}

	// 履歴データを取得
	rows, err := common.DB.Query(`
		SELECT 
			id, item_id, qty_delta, kind, location_from, location_to, 
			reason, meta, unit_price, total_amount, created_by, created_at
		FROM stock_history
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`, limit, offset)
	if err != nil {
		log.Printf("[Repository] 在庫履歴取得エラー: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	var histories []model.StockHistory
	for rows.Next() {
		var history model.StockHistory
		if err := rows.Scan(
			&history.ID,
			&history.ItemID,
			&history.QtyDelta,
			&history.Kind,
			&history.LocationFrom,
			&history.LocationTo,
			&history.Reason,
			&history.Meta,
			&history.UnitPrice,
			&history.TotalAmount,
			&history.CreatedBy,
			&history.CreatedAt,
		); err != nil {
			log.Printf("[Repository] 在庫履歴のスキャンエラー: %v", err)
			return nil, 0, err
		}
		histories = append(histories, history)
	}

	if err = rows.Err(); err != nil {
		log.Printf("[Repository] 在庫履歴の行エラー: %v", err)
		return nil, 0, err
	}

	log.Printf("[Repository] 在庫履歴取得成功: %d件", len(histories))
	return histories, total, nil
}

// CreateItem はアイテムを作成します
func CreateItem(code, name, unitID string, categoryID *string, quantity *int, unitPrice *int) (*model.Item, error) {
	log.Printf("[Repository] CreateItem - code: %s, name: %s", code, name)

	var item model.Item
	err := common.DB.QueryRow(`
		INSERT INTO items (code, name, category_id, unit_id, quantity, unit_price, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		RETURNING id, code, name, category_id, unit_id, quantity, unit_price, status, created_at, updated_at
	`, code, name, categoryID, unitID, quantity, unitPrice).Scan(
		&item.ID,
		&item.Code,
		&item.Name,
		&item.CategoryID,
		&item.UnitID,
		&item.Quantity,
		&item.UnitPrice,
		&item.Status,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if err != nil {
		log.Printf("[Repository] アイテム作成エラー: %v", err)
		return nil, err
	}

	log.Printf("[Repository] アイテム作成成功: %s", item.ID)
	return &item, nil
}

// UpdateItem はアイテムを更新します
func UpdateItem(id, code, name, unitID string, categoryID *string, quantity *int, unitPrice *int, status string) (*model.Item, error) {
	log.Printf("[Repository] UpdateItem - id: %s", id)

	var item model.Item
	err := common.DB.QueryRow(`
		UPDATE items
		SET code = $2, name = $3, category_id = $4, unit_id = $5, quantity = $6, unit_price = $7, status = $8, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND deleted_at IS NULL
		RETURNING id, code, name, category_id, unit_id, quantity, unit_price, status, created_at, updated_at
	`, id, code, name, categoryID, unitID, quantity, unitPrice, status).Scan(
		&item.ID,
		&item.Code,
		&item.Name,
		&item.CategoryID,
		&item.UnitID,
		&item.Quantity,
		&item.UnitPrice,
		&item.Status,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if err != nil {
		log.Printf("[Repository] アイテム更新エラー: %v", err)
		return nil, err
	}

	log.Printf("[Repository] アイテム更新成功: %s", item.ID)
	return &item, nil
}

// DeleteItem はアイテムを削除します（論理削除）
func DeleteItem(id string) error {
	log.Printf("[Repository] DeleteItem - id: %s", id)

	result, err := common.DB.Exec(`
		UPDATE items
		SET deleted_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND deleted_at IS NULL
	`, id)

	if err != nil {
		log.Printf("[Repository] アイテム削除エラー: %v", err)
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("[Repository] RowsAffected取得エラー: %v", err)
		return err
	}

	if rowsAffected == 0 {
		log.Printf("[Repository] アイテムが見つかりません: %s", id)
		return sql.ErrNoRows
	}

	log.Printf("[Repository] アイテム削除成功: %s", id)
	return nil
}
