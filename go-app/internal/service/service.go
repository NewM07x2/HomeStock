package service

import (
	"go-hsm-app/internal/model"
	"go-hsm-app/internal/repository"
)

// GetRecentItems はリポジトリから最新のアイテムを取得して返します
func GetRecentItems(limit int) ([]model.Item, error) {
	return repository.FetchRecentItems(limit)
}

// GetCategories はリポジトリからカテゴリ一覧を取得して返します
func GetCategories() ([]model.Category, error) {
	return repository.FetchCategories()
}

// GetUnits はリポジトリから単位一覧を取得して返します
func GetUnits() ([]model.Unit, error) {
	return repository.FetchUnits()
}

// GetAttributes はリポジトリから属性一覧を取得して返します
func GetAttributes() ([]model.Attribute, error) {
	return repository.FetchAttributes()
}

// GetUsers はリポジトリからユーザー一覧を取得して返します
func GetUsers() ([]model.User, error) {
	return repository.FetchUsers()
}
