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

// CreateCategory はカテゴリを作成します
func CreateCategory(code, name, description string) (*model.Category, error) {
	return repository.CreateCategory(code, name, description)
}

// UpdateCategory はカテゴリを更新します
func UpdateCategory(id, code, name, description string) (*model.Category, error) {
	return repository.UpdateCategory(id, code, name, description)
}

// DeleteCategory はカテゴリを削除します
func DeleteCategory(id string) error {
	return repository.DeleteCategory(id)
}

// CreateUnit は単位を作成します
func CreateUnit(code, name, description string) (*model.Unit, error) {
	return repository.CreateUnit(code, name, description)
}

// UpdateUnit は単位を更新します
func UpdateUnit(id, code, name, description string) (*model.Unit, error) {
	return repository.UpdateUnit(id, code, name, description)
}

// DeleteUnit は単位を削除します
func DeleteUnit(id string) error {
	return repository.DeleteUnit(id)
}

// CreateAttribute は属性を作成します
func CreateAttribute(code, name, valueType, description string) (*model.Attribute, error) {
	return repository.CreateAttribute(code, name, valueType, description)
}

// UpdateAttribute は属性を更新します
func UpdateAttribute(id, code, name, valueType, description string) (*model.Attribute, error) {
	return repository.UpdateAttribute(id, code, name, valueType, description)
}

// DeleteAttribute は属性を削除します
func DeleteAttribute(id string) error {
	return repository.DeleteAttribute(id)
}

// CreateUser はユーザーを作成します
func CreateUser(email, role string) (*model.User, error) {
	return repository.CreateUser(email, role)
}

// UpdateUser はユーザーを更新します
func UpdateUser(id, email, role string) (*model.User, error) {
	return repository.UpdateUser(id, email, role)
}

// DeleteUser はユーザーを削除します
func DeleteUser(id string) error {
	return repository.DeleteUser(id)
}

// GetStockHistory は在庫履歴を取得します
func GetStockHistory(limit, offset int) ([]model.StockHistory, int, error) {
	return repository.FetchStockHistory(limit, offset)
}
