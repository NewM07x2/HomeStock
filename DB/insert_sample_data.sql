-- サンプルデータ挿入スクリプト
-- 既存のinit.sqlで作成されたテーブルにデータを追加

-- ======================================================
-- マスタデータの挿入
-- ======================================================

-- カテゴリマスタ
INSERT INTO categories (code, name, description) VALUES
  ('HW', '金具', '金属製の部品や金具類'),
  ('EC', '電子部品', '電子回路に使用する部品'),
  ('CS', '消耗品', '日常的に消耗する物品')
ON CONFLICT (code) DO NOTHING;

-- 単位マスタ
INSERT INTO units (code, name, description) VALUES
  ('pc', '個', '個数単位'),
  ('box', '箱', '箱単位'),
  ('kg', 'キログラム', '重量単位'),
  ('m', 'メートル', '長さ単位')
ON CONFLICT (code) DO NOTHING;

-- ユーザー（テスト用）
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@example.com', '$2a$10$dummyhashforthisexample12345678901234567890', 'admin'),
  ('operator@example.com', '$2a$10$dummyhashforthisexample12345678901234567890', 'operator'),
  ('viewer@example.com', '$2a$10$dummyhashforthisexample12345678901234567890', 'viewer')
ON CONFLICT (email) DO NOTHING;

-- ======================================================
-- アイテムデータの挿入
-- ======================================================

-- カテゴリと単位のIDを取得
DO $$
DECLARE
  cat_hw_id UUID;
  cat_ec_id UUID;
  cat_cs_id UUID;
  unit_pc_id UUID;
  unit_box_id UUID;
  i INTEGER;
BEGIN
  -- カテゴリIDを取得
  SELECT id INTO cat_hw_id FROM categories WHERE code = 'HW';
  SELECT id INTO cat_ec_id FROM categories WHERE code = 'EC';
  SELECT id INTO cat_cs_id FROM categories WHERE code = 'CS';
  
  -- 単位IDを取得
  SELECT id INTO unit_pc_id FROM units WHERE code = 'pc';
  SELECT id INTO unit_box_id FROM units WHERE code = 'box';

  -- 57件のサンプルアイテムを挿入
  FOR i IN 1..57 LOOP
    INSERT INTO items (code, name, category_id, unit_id, quantity, status, created_at, updated_at)
    VALUES (
      'SKU-' || LPAD(i::TEXT, 4, '0'),
      'サンプル品目 ' || i,
      CASE 
        WHEN i % 3 = 0 THEN cat_hw_id
        WHEN i % 3 = 1 THEN cat_ec_id
        ELSE cat_cs_id
      END,
      CASE 
        WHEN i % 2 = 0 THEN unit_pc_id
        ELSE unit_box_id
      END,
      FLOOR(RANDOM() * 500)::INTEGER,
      CASE 
        WHEN i % 10 = 0 THEN 'inactive'
        ELSE 'active'
      END,
      NOW() - (i || ' days')::INTERVAL,
      NOW() - (i * 0.5 || ' days')::INTERVAL
    )
    ON CONFLICT (code) DO NOTHING;
  END LOOP;
END $$;

-- ======================================================
-- ロケーションデータの挿入
-- ======================================================

INSERT INTO locations (code, name) VALUES
  ('WH-A', '倉庫A'),
  ('WH-B', '倉庫B'),
  ('WH-C', '倉庫C')
ON CONFLICT (code) DO NOTHING;

-- ======================================================
-- 在庫データの挿入
-- ======================================================

DO $$
DECLARE
  item_rec RECORD;
  loc_rec RECORD;
BEGIN
  -- 各アイテムに対してランダムなロケーションに在庫を配置
  FOR item_rec IN SELECT id FROM items LIMIT 20 LOOP
    FOR loc_rec IN SELECT id FROM locations ORDER BY RANDOM() LIMIT 1 LOOP
      INSERT INTO stocks (item_id, location_id, qty)
      VALUES (
        item_rec.id,
        loc_rec.id,
        FLOOR(RANDOM() * 100)::NUMERIC
      )
      ON CONFLICT (item_id, location_id) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- ======================================================
-- 確認用クエリ
-- ======================================================

-- 挿入されたデータ件数を確認
SELECT 
  (SELECT COUNT(*) FROM categories) AS categories_count,
  (SELECT COUNT(*) FROM units) AS units_count,
  (SELECT COUNT(*) FROM users) AS users_count,
  (SELECT COUNT(*) FROM items) AS items_count,
  (SELECT COUNT(*) FROM locations) AS locations_count,
  (SELECT COUNT(*) FROM stocks) AS stocks_count;

-- サンプルアイテムを確認
SELECT 
  i.code,
  i.name,
  c.name AS category,
  u.name AS unit,
  i.quantity,
  i.status
FROM items i
LEFT JOIN categories c ON i.category_id = c.id
LEFT JOIN units u ON i.unit_id = u.id
ORDER BY i.created_at DESC
LIMIT 10;
