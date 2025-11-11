package model

import "time"

// Category はカテゴリマスタのモデル
type Category struct {
	ID          string     `json:"id" db:"id"`                             // カテゴリID（UUID）
	Code        string     `json:"code" db:"code"`                         // カテゴリコード（一意）
	Name        string     `json:"name" db:"name"`                         // カテゴリ名称
	Description *string    `json:"description,omitempty" db:"description"` // カテゴリの説明（任意）
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`             // 作成日時
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`             // 更新日時
	DeletedAt   *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`   // 削除日時（論理削除、任意）
}

// Unit は単位マスタのモデル
type Unit struct {
	ID          string     `json:"id" db:"id"`                             // 単位ID（UUID）
	Code        string     `json:"code" db:"code"`                         // 単位コード（一意）
	Name        string     `json:"name" db:"name"`                         // 単位名称
	Description *string    `json:"description,omitempty" db:"description"` // 単位の説明（任意）
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`             // 作成日時
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`             // 更新日時
	DeletedAt   *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`   // 削除日時（論理削除、任意）
}

// Attribute は属性マスタのモデル
type Attribute struct {
	ID          string     `json:"id" db:"id"`                             // 属性ID（UUID）
	Code        string     `json:"code" db:"code"`                         // 属性コード（一意）
	Name        string     `json:"name" db:"name"`                         // 属性名称
	ValueType   string     `json:"value_type" db:"value_type"`             // 属性値の型（text, number, boolean, date）
	Description *string    `json:"description,omitempty" db:"description"` // 属性の説明（任意）
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`             // 作成日時
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`             // 更新日時
	DeletedAt   *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`   // 削除日時（論理削除、任意）
}

// ItemAttribute はアイテムと属性の中間テーブルのモデル
type ItemAttribute struct {
	ItemID      string    `json:"item_id" db:"item_id"`           // アイテムID（UUID）
	AttributeID string    `json:"attribute_id" db:"attribute_id"` // 属性ID（UUID）
	Value       string    `json:"value" db:"value"`               // 属性値
	CreatedAt   time.Time `json:"created_at" db:"created_at"`     // 作成日時
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`     // 更新日時
}

// ItemAttributeDetail はアイテムの属性情報を属性マスタの情報と共に返すモデル
type ItemAttributeDetail struct {
	Code      string `json:"code"`       // 属性コード
	Name      string `json:"name"`       // 属性名称
	Value     string `json:"value"`      // 属性値
	ValueType string `json:"value_type"` // 属性値の型
}

// User はシステムを利用するユーザーを表すモデル
type User struct {
	ID        string     `json:"id" db:"id"`                           // ユーザーID（UUID）
	Email     string     `json:"email" db:"email"`                     // メールアドレス（一意）
	Role      string     `json:"role" db:"role"`                       // 権限（admin: 管理者、operator: 担当者、viewer: 閲覧者）
	CreatedAt time.Time  `json:"created_at" db:"created_at"`           // 作成日時
	UpdatedAt time.Time  `json:"updated_at" db:"updated_at"`           // 更新日時
	DeletedAt *time.Time `json:"deleted_at,omitempty" db:"deleted_at"` // 削除日時（論理削除、任意）
}

// Item は在庫管理のアイテム（製品/部材）を表すモデル
type Item struct {
	ID         string     `json:"id" db:"id"`                             // アイテムの一意識別子（UUID）
	Code       string     `json:"code" db:"code"`                         // アイテムコード（SKU相当、一意）
	Name       string     `json:"name" db:"name"`                         // アイテム名称
	CategoryID *string    `json:"category_id,omitempty" db:"category_id"` // カテゴリID（任意、外部キー）
	UnitID     string     `json:"unit_id" db:"unit_id"`                   // 単位ID（必須、外部キー）
	Quantity   *int       `json:"quantity,omitempty" db:"quantity"`       // 在庫数（任意）
	UnitPrice  *int       `json:"unit_price,omitempty" db:"unit_price"`   // 単価（円）
	Status     string     `json:"status" db:"status"`                     // ステータス（active: 有効、inactive: 無効）
	CreatedBy  *string    `json:"created_by,omitempty" db:"created_by"`   // 作成者のユーザーID（UUID、任意）
	CreatedAt  time.Time  `json:"created_at" db:"created_at"`             // 作成日時
	UpdatedAt  time.Time  `json:"updated_at" db:"updated_at"`             // 更新日時
	DeletedAt  *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`   // 削除日時（論理削除、任意）

	// 結合して取得するマスタ情報（レスポンス用、DBには存在しない）
	Category   *Category             `json:"category,omitempty" db:"-"`   // カテゴリ情報（結合取得）
	Unit       *Unit                 `json:"unit,omitempty" db:"-"`       // 単位情報（結合取得）
	Attributes []ItemAttributeDetail `json:"attributes,omitempty" db:"-"` // 属性情報（結合取得）
}

// StockHistory は在庫の入出庫履歴を表すモデル
type StockHistory struct {
	ID           string    `json:"id" db:"id"`                                 // 履歴ID
	ItemID       string    `json:"item_id" db:"item_id"`                       // アイテムID
	QtyDelta     float64   `json:"qty_delta" db:"qty_delta"`                   // 増減量（正: 増加、負: 減少）
	Kind         string    `json:"kind" db:"kind"`                             // 履歴種別（IN, OUT, ADJUST, TRANSFER）
	LocationFrom *string   `json:"location_from,omitempty" db:"location_from"` // 移動元ロケーション（任意）
	LocationTo   *string   `json:"location_to,omitempty" db:"location_to"`     // 移動先ロケーション（任意）
	Reason       *string   `json:"reason,omitempty" db:"reason"`               // 理由・備考（任意）
	Meta         string    `json:"meta" db:"meta"`                             // 補足情報（JSON形式）
	UnitPrice    *int      `json:"unit_price,omitempty" db:"unit_price"`       // 取引時の単価（円）
	TotalAmount  *int      `json:"total_amount,omitempty" db:"total_amount"`   // 取引金額（qty_delta × unit_price）
	CreatedBy    *string   `json:"created_by,omitempty" db:"created_by"`       // 実行者のユーザーID（任意）
	CreatedAt    time.Time `json:"created_at" db:"created_at"`                 // 作成日時
}
