package service

import (
	"go-hsm-app/internal/model"
	"go-hsm-app/internal/repository"
)

// GetRecentItems はリポジトリから最新のアイテムを取得して返します
func GetRecentItems(limit int) ([]model.Item, error) {
	return repository.FetchRecentItems(limit)
}
