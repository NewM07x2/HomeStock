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
