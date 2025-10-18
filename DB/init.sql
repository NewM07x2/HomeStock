-- PostgreSQL Initialization Script
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items table for inventory management
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on items name for faster searches
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);

-- Insert sample data
INSERT INTO items (name, description, quantity) VALUES
    ('サンプル商品1', '最初のサンプル商品です', 10),
    ('サンプル商品2', '2番目のサンプル商品です', 5)
ON CONFLICT DO NOTHING;