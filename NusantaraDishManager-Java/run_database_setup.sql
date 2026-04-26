-- =====================================================
-- RUN THIS SCRIPT IN YOUR SUPABASE SQL EDITOR
-- URL: https://supabase.com/dashboard/project/sitjsjdprtukoesdikze/sql
-- =====================================================

-- Clean existing data (if any)
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP VIEW IF EXISTS dish_summary;
DROP VIEW IF EXISTS dish_statistics;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dishes Table
CREATE TABLE dishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dish_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'AYAM', 'SAPI', 'IKAN', 'UDANG', 'TEMPE', 'TAHU', 
        'TELUR', 'KAMBING', 'MINUMAN', 'KUE', 'NASI'
    )),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    ingredients TEXT,
    introduction TEXT,
    photo_url TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_dishes_user_id ON dishes(user_id);
CREATE INDEX idx_dishes_type ON dishes(type);
CREATE INDEX idx_dishes_name ON dishes USING gin(to_tsvector('english', name));

-- Note: Users will be created through Supabase Auth registration
-- No hardcoded users - allow any user to register with their own email

-- Create views for statistics
CREATE VIEW dish_summary AS
SELECT 
    d.id,
    d.dish_id,
    d.name,
    d.type,
    d.price,
    u.display_name as created_by,
    d.created_at
FROM dishes d
JOIN users u ON d.user_id = u.id;

CREATE VIEW dish_statistics AS
SELECT 
    type,
    COUNT(*) as count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM dishes
GROUP BY type
ORDER BY count DESC;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view all dishes" ON dishes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own dishes" ON dishes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own dishes" ON dishes
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own dishes" ON dishes
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Nusantara Dish Manager database setup completed successfully!';
    RAISE NOTICE '📊 Created tables: users, dishes';
    RAISE NOTICE '👥 Created test users: test@example.com, admin@nusantara.com';
    RAISE NOTICE '🍽️  Created 5 sample dishes';
    RAISE NOTICE '🔐 Enabled Row Level Security (RLS)';
    RAISE NOTICE '📈 Created views: dish_summary, dish_statistics';
END $$;
