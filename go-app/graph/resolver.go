package graph

import (
	"context"
	"your_project/graph/model"
)

func (r *mutationResolver) CreateItem(ctx context.Context, input model.CreateItemInput) (*model.Item, error) {
	// データベースに登録するロジックを実装
	newItem := &model.Item{
		ID:            "1", // 実際にはDBから生成されたIDを使用
		Name:          input.Name,
		Category:      input.Category,
		Price:         input.Price,
		Qty:           input.Qty,
		PurchaseStore: input.PurchaseStore,
		PurchaseDate:  input.PurchaseDate,
		Notes:         input.Notes,
	}
	// DB登録処理をここに追加
	return newItem, nil
}
