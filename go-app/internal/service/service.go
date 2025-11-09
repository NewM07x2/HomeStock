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
func CreateCategory(name, description string) (*model.Category, error) {
	return repository.CreateCategory(name, description)
}

// UpdateCategory はカテゴリを更新します
func UpdateCategory(id, name, description string) (*model.Category, error) {
	return repository.UpdateCategory(id, name, description)
}

// DeleteCategory はカテゴリを削除します
func DeleteCategory(id string) error {
	return repository.DeleteCategory(id)
}

// CreateUnit は単位を作成します
func CreateUnit(name, description string) (*model.Unit, error) {
	return repository.CreateUnit(name, description)
}

// UpdateUnit は単位を更新します
func UpdateUnit(id, name, description string) (*model.Unit, error) {
	return repository.UpdateUnit(id, name, description)
}

// DeleteUnit は単位を削除します
func DeleteUnit(id string) error {
	return repository.DeleteUnit(id)
}

// CreateAttribute は属性を作成します
func CreateAttribute(name, description string) (*model.Attribute, error) {
	return repository.CreateAttribute(name, description)
}

// UpdateAttribute は属性を更新します
func UpdateAttribute(id, name, description string) (*model.Attribute, error) {
	return repository.UpdateAttribute(id, name, description)
}

// DeleteAttribute は属性を削除します
func DeleteAttribute(id string) error {
	return repository.DeleteAttribute(id)
}

// CreateUser はユーザーを作成します
func CreateUser(name, email string) (*model.User, error) {
	return repository.CreateUser(name, email)
}

// UpdateUser はユーザーを更新します
func UpdateUser(id, name, email string) (*model.User, error) {
	return repository.UpdateUser(id, name, email)
}

// DeleteUser はユーザーを削除します
func DeleteUser(id string) error {
	return repository.DeleteUser(id)
}
