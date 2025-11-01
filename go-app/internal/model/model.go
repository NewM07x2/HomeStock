package model

import "time"

// Item は在庫管理のアイテム（製品/部材）を表すモデル
type Item struct {
	ID         string     `json:"id" db:"id"`                           // アイテムの一意識別子（UUID）
	Code       string     `json:"code" db:"code"`                       // アイテムコード（SKU相当、一意）
	Name       string     `json:"name" db:"name"`                       // アイテム名称
	Category   *string    `json:"category,omitempty" db:"category"`     // カテゴリ
	Unit       string     `json:"unit" db:"unit"`                       // 単位
	Status     string     `json:"status" db:"status"`                   // ステータス（active: 有効、inactive: 無効）
	Attributes string     `json:"attributes,omitempty" db:"attributes"` // 追加属性
	CreatedBy  *string    `json:"created_by,omitempty" db:"created_by"` // 作成者のユーザーID（UUID、任意）
	CreatedAt  time.Time  `json:"created_at" db:"created_at"`           // 作成日時
	UpdatedAt  time.Time  `json:"updated_at" db:"updated_at"`           // 更新日時
	DeletedAt  *time.Time `json:"deleted_at,omitempty" db:"deleted_at"` // 削除日時（論理削除、任意）
}
