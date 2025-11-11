-- ======================================================
-- サンプル在庫履歴データの挿入
-- ======================================================
-- このスクリプトは、テストやデモ用の在庫履歴データを挿入します。
-- 実行前に 03_initial_data.sql または insert_sample_data.sql が
-- 実行されていることを確認してください。
-- ======================================================

-- 過去12ヶ月分の在庫履歴を生成
DO $$
DECLARE
  item_record RECORD;
  hist_date TIMESTAMPTZ;
  month_offset INTEGER;
  day_num INTEGER;
  qty_value FLOAT;
  price_value INTEGER;
  total_value INTEGER;
  hist_kind TEXT;
BEGIN
  -- 各アイテムに対して履歴を作成
  FOR item_record IN 
    SELECT id, unit_price FROM items WHERE deleted_at IS NULL LIMIT 50
  LOOP
    -- 過去12ヶ月分のデータを作成
    FOR month_offset IN 0..11 LOOP
      -- 月に3-8回のランダムな履歴を作成
      FOR day_num IN 1..(3 + floor(random() * 6)::int) LOOP
        -- ランダムな日付を生成（現在から month_offset ヶ月前）
        hist_date := CURRENT_TIMESTAMP - (month_offset || ' months')::INTERVAL 
                     - (floor(random() * 28) || ' days')::INTERVAL 
                     - (floor(random() * 24) || ' hours')::INTERVAL;
        
        -- ランダムな数量（-10 ~ 50の範囲）
        qty_value := (random() * 60 - 10)::FLOAT;
        
        -- 単価を設定（アイテムの単価または100-10000円のランダム）
        IF item_record.unit_price IS NOT NULL THEN
          price_value := item_record.unit_price;
        ELSE
          price_value := (100 + floor(random() * 9900))::INTEGER;
        END IF;
        
        -- 合計金額を計算
        total_value := (abs(qty_value) * price_value)::INTEGER;
        
        -- 履歴種別をランダムに決定
        CASE floor(random() * 4)::INTEGER
          WHEN 0 THEN hist_kind := 'IN';      -- 入庫
          WHEN 1 THEN hist_kind := 'OUT';     -- 出庫
          WHEN 2 THEN hist_kind := 'ADJUST';  -- 調整
          ELSE hist_kind := 'TRANSFER';       -- 移動
        END CASE;
        
        -- 履歴レコードを挿入
        INSERT INTO stock_history (
          item_id, 
          qty_delta, 
          kind, 
          reason, 
          meta, 
          unit_price, 
          total_amount, 
          created_at
        ) VALUES (
          item_record.id,
          qty_value,
          hist_kind,
          CASE hist_kind
            WHEN 'IN' THEN '入庫処理'
            WHEN 'OUT' THEN '出庫処理'
            WHEN 'ADJUST' THEN '在庫調整'
            ELSE '倉庫間移動'
          END,
          '{}',
          price_value,
          total_value,
          hist_date
        );
      END LOOP;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'サンプル在庫履歴データの挿入が完了しました';
END $$;

-- 挿入されたデータの確認
SELECT 
  TO_CHAR(created_at, 'YYYY-MM') as month,
  kind,
  COUNT(*) as count,
  SUM(total_amount) as total_amount
FROM stock_history
GROUP BY TO_CHAR(created_at, 'YYYY-MM'), kind
ORDER BY month DESC, kind;

-- 月別の合計金額を確認
SELECT 
  TO_CHAR(created_at, 'YYYY-MM') as month,
  COUNT(*) as transaction_count,
  ROUND(SUM(ABS(total_amount))::NUMERIC, 0) as total_amount
FROM stock_history
GROUP BY TO_CHAR(created_at, 'YYYY-MM')
ORDER BY month DESC;
