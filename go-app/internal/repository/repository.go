package repository

import (
	"go-hsm-app/internal/common"
	"go-hsm-app/internal/model"
	"log"
)

// FetchRecentItems はデータベースから直近のアイテムを取得します
func FetchRecentItems(limit int) ([]model.Item, error) {
	log.Printf("FetchRecentItems")
	rows, err := common.DB.Query(`
        SELECT id, code, name, category, unit, status, created_at, updated_at
        FROM items
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT $1
    `, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []model.Item
	for rows.Next() {
		var item model.Item
		// 必要なフィールドをスキャン
		if err := rows.Scan(
			&item.ID,
			&item.Code,
			&item.Name,
			&item.Category,
			&item.Unit,
			&item.Status,
			&item.CreatedAt,
			&item.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	// rows の反復中にエラーがないか確認
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return items, nil
}
