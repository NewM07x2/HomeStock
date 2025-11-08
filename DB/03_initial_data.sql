-- ======================================================
-- Initial Sample Data for HomeStock
-- ======================================================
-- このスクリプトは初期動作確認用のサンプルデータを投入します。
-- 実行順序: 02_create_indexes.sql の後に実行してください
--
-- 投入されるデータ:
--   - 管理者ユーザー 1件
--   - カテゴリ 3件（金具、消耗品、材料）
--   - 単位 5件（個、ml、枚、kg、m）
--   - 属性 6件（ブランド、仕様、サイズ等）
--   - ロケーション 4件（倉庫、棚）
--   - アイテム 8件（ねじ、接着剤等）
--   - アイテム属性の紐付け
--
-- 注意:
--   - ON CONFLICT句により重複時は無視されます（冪等性あり）
--   - パスワードハッシュはデモ用です（本番環境では変更必須）
--   - より多くのサンプルデータは insert_sample_data.sql を参照
-- ======================================================

-- ======================================================
-- ユーザーデータ
-- ======================================================

-- 管理者ユーザー（email: admin@homestock.local, password: admin123）
-- パスワードハッシュはデモ用です。実際の環境では必ず安全なハッシュを使用し、初期パスワードを変更してください。
INSERT INTO users (email, password_hash, role) VALUES
    ('admin@homestock.local', '$2a$10$X7ZQKZjxkZ5y5Zw5xZXZxeXZxZxZxZxZxZxZxZxZxZxZxZxZxZxZx', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ======================================================
-- マスタデータ
-- ======================================================

-- カテゴリマスタ
INSERT INTO categories (code, name, description) VALUES
    ('HARDWARE', '金具', '各種金具類'),
    ('CONSUMABLE', '消耗品', '使い捨てまたは消耗する資材'),
    ('MATERIAL', '材料', '加工用材料')
ON CONFLICT (code) DO NOTHING;

-- 単位マスタ
INSERT INTO units (code, name, description) VALUES
    ('pc', '個', '個数単位'),
    ('ml', 'ミリリットル', '液体容量単位'),
    ('sheet', '枚', '薄いものの枚数単位'),
    ('kg', 'キログラム', '重量単位'),
    ('m', 'メートル', '長さ単位')
ON CONFLICT (code) DO NOTHING;

-- 属性マスタ
INSERT INTO attributes (code, name, value_type, description) VALUES
    ('brand', 'ブランド', 'text', '製品のブランド名'),
    ('spec', '仕様', 'text', '製品の仕様'),
    ('size', 'サイズ', 'text', 'サイズ情報'),
    ('type', 'タイプ', 'text', '製品のタイプ'),
    ('grit', '粒度', 'text', '研磨材の粒度'),
    ('color', '色', 'text', '製品の色')
ON CONFLICT (code) DO NOTHING;

-- ロケーションマスタ
INSERT INTO locations (code, name) VALUES
    ('WH-001', '第一倉庫'),
    ('WH-002', '第二倉庫'),
    ('SHELF-A1', '棚A-1'),
    ('SHELF-A2', '棚A-2')
ON CONFLICT (code) DO NOTHING;

-- ======================================================
-- アイテムデータ
-- ======================================================

-- アイテム: ねじM5
INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0001',
    'ねじM5',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    120,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'HSM-0001');

-- アイテム: ナットM5
INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0002',
    'ナットM5',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    240,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'HSM-0002');

-- アイテム: ワッシャーM5
INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0003',
    'ワッシャーM5',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    60,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'HSM-0003');

-- アイテム: ボルトM8
INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0004',
    'ボルトM8',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    85,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'HSM-0004');

-- アイテム: 木ネジ
INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0005',
    '木ネジ',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    150,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'HSM-0005');

-- アイテム: L字金具
INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0006',
    'L字金具',
    (SELECT id FROM categories WHERE code = 'HARDWARE'),
    (SELECT id FROM units WHERE code = 'pc'),
    45,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'HSM-0006');

-- アイテム: 接着剤
INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0007',
    '接着剤',
    (SELECT id FROM categories WHERE code = 'CONSUMABLE'),
    (SELECT id FROM units WHERE code = 'ml'),
    500,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'HSM-0007');

-- アイテム: サンドペーパー（在庫数量未設定）
INSERT INTO items (code, name, category_id, unit_id, quantity, status)
SELECT 
    'HSM-0008',
    'サンドペーパー',
    (SELECT id FROM categories WHERE code = 'CONSUMABLE'),
    (SELECT id FROM units WHERE code = 'sheet'),
    NULL,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM items WHERE code = 'HSM-0008');

-- ======================================================
-- アイテム属性データ
-- ======================================================

-- HSM-0001（ねじM5）の属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0001'),
    (SELECT id FROM attributes WHERE code = 'brand'),
    'ABC'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0001')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'brand')
);

INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0001'),
    (SELECT id FROM attributes WHERE code = 'spec'),
    'M5x12'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0001')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'spec')
);

-- HSM-0002（ナットM5）の属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0002'),
    (SELECT id FROM attributes WHERE code = 'brand'),
    'ABC'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0002')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'brand')
);

INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0002'),
    (SELECT id FROM attributes WHERE code = 'spec'),
    'M5'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0002')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'spec')
);

-- HSM-0003（ワッシャーM5）の属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0003'),
    (SELECT id FROM attributes WHERE code = 'brand'),
    'ABC'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0003')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'brand')
);

INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0003'),
    (SELECT id FROM attributes WHERE code = 'spec'),
    'M5'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0003')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'spec')
);

-- HSM-0004（ボルトM8）の属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0004'),
    (SELECT id FROM attributes WHERE code = 'brand'),
    'XYZ'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0004')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'brand')
);

INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0004'),
    (SELECT id FROM attributes WHERE code = 'spec'),
    'M8x20'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0004')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'spec')
);

-- HSM-0005（木ネジ）の属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0005'),
    (SELECT id FROM attributes WHERE code = 'brand'),
    'DEF'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0005')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'brand')
);

INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0005'),
    (SELECT id FROM attributes WHERE code = 'spec'),
    '4x30'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0005')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'spec')
);

-- HSM-0006（L字金具）の属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0006'),
    (SELECT id FROM attributes WHERE code = 'size'),
    '50mm'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0006')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'size')
);

-- HSM-0007（接着剤）の属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0007'),
    (SELECT id FROM attributes WHERE code = 'type'),
    '瞬間接着剤'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0007')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'type')
);

-- HSM-0008（サンドペーパー）の属性
INSERT INTO item_attributes (item_id, attribute_id, value)
SELECT 
    (SELECT id FROM items WHERE code = 'HSM-0008'),
    (SELECT id FROM attributes WHERE code = 'grit'),
    '#240'
WHERE NOT EXISTS (
    SELECT 1 FROM item_attributes 
    WHERE item_id = (SELECT id FROM items WHERE code = 'HSM-0008')
    AND attribute_id = (SELECT id FROM attributes WHERE code = 'grit')
);

-- ======================================================
-- データ投入完了
-- ======================================================
-- 上記のサンプルデータで基本的な動作確認が可能です。
-- より多くのテストデータが必要な場合は insert_sample_data.sql を実行してください。
