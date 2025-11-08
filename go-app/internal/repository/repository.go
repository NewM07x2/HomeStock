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
					i.id, i.code, i.name, i.category_id, i.unit_id, i.quantity, i.status, 
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
