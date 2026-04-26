-- =====================================================
-- NUSANTARA DISH MANAGER - COMPLETE SUPABASE SETUP
-- =====================================================
-- Run this entire script in your Supabase SQL Editor
-- This will: 1) Clean existing data, 2) Create schema, 3) Insert sample data

-- =====================================================
-- STEP 1: CLEAN EXISTING DATA (if any)
-- =====================================================
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP VIEW IF EXISTS dish_summary;
DROP VIEW IF EXISTS dish_statistics;

-- =====================================================
-- STEP 2: CREATE SCHEMA
-- =====================================================
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
        'Ayam', 'Sapi', 'Ikan', 'Udang', 'Tempe', 'Tahu', 
        'Telur', 'Kambing', 'Minuman', 'Kue', 'Nasi'
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
CREATE INDEX idx_dishes_price ON dishes(price);
CREATE INDEX idx_dishes_dish_id ON dishes(dish_id);
CREATE INDEX idx_dishes_name ON dishes USING gin(to_tsvector('english', name));

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own dishes" ON dishes
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own dishes" ON dishes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own dishes" ON dishes
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own dishes" ON dishes
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Timestamp Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dishes_updated_at 
    BEFORE UPDATE ON dishes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views
CREATE VIEW dish_summary AS
SELECT 
    d.id,
    d.dish_id,
    d.name,
    d.type,
    d.price,
    d.user_id,
    u.email as user_email,
    d.created_at,
    d.updated_at
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

-- =====================================================
-- STEP 3: INSERT USER AND SAMPLE DATA
-- =====================================================
-- Create test user
INSERT INTO users (email, display_name) 
VALUES ('test@example.com', 'Test User')
ON CONFLICT (email) DO NOTHING;

-- Get user UUID for dish insertion
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    SELECT id INTO user_uuid FROM users WHERE email = 'test@example.com';
    
    -- Insert all 33 dishes
    INSERT INTO dishes (dish_id, name, type, price, ingredients, introduction, user_id) VALUES
    ('D001', 'Ayam Woku Manado', 'Ayam', 28000.00, 'ayam kampung, jeruk nipis, garam, kunyit, bawang merah, bawang putih, cabe merah, cabe rawit, kemiri, serai, daun salam, daun kemangi', 'Ayam kampung dimasak dengan bumbu rempah khas Manado yang kaya akan daun kemangi dan cabe.', user_uuid),
    ('D002', 'Ayam Goreng Tulang Lunak', 'Ayam', 32000.00, 'ayam, serai, daun jeruk, bawang putih, biji ketumbar, laos, kunyit, kemiri, garam, air, minyak goreng', 'Ayam goreng presto yang tulangnya lunak, digoreng hingga kecoklatan renyah di luar.', user_uuid),
    ('D003', 'Ayam Cabai Kawin', 'Ayam', 38000.00, 'ayam, cabai hijau, cabai merah rawit, bawang putih, bawang merah, gula, garam, tomat merah, air, minyak goreng', 'Ayam goreng dengan tumisan bumbu cabe merah dan hijau yang pedas dan menggugah selera.', user_uuid),
    
    ('D004', 'Beef Teriyaki', 'Sapi', 48000.00, 'daging sapi, bawang bombai, bawang putih, saus teriyaki, kecap manis, garam, lada, gula, penyedap', 'Daging sapi iris dengan saus teriyaki manis gurih, disajikan dengan nasi putih hangat.', user_uuid),
    ('D005', 'Rendang Sapi', 'Sapi', 55000.00, 'daging sapi, santan kental, cabe merah, jahe, ketumbar, kapulaga, cengkeh, bunga lawang, pala, bawang merah, bawang putih, lengkuas, serai, daun jeruk, daun kunyit, garam', 'Rendang daging sapi dengan santan kental dan bumbu rempah yang kaya, dimasak hingga kering berwarna kecoklatan.', user_uuid),
    ('D006', 'Tongseng Daging Sapi', 'Sapi', 62000.00, 'daging sapi, bawang merah, bawang putih, jahe, kunyit, kemiri, cabe merah, serai, daun salam, daun jeruk, cabe rawit, tomat, kol, santan, kecap manis', 'Tongseng sapi pedas dengan kuah santan ringan, dilengkapi dengan kol dan tomat segar.', user_uuid),
    
    ('D007', 'Gurame Saus Padang', 'Ikan', 35000.00, 'ikan gurame, bawang putih, bawang merah, cabai merah, cabai rawit, bawang bombai, saus tiram, saus tomat, garam, gula, lada, wortel, tomat', 'Ikan gurame goreng garing disiram dengan saus padang yang pedas dan kaya rempah.', user_uuid),
    ('D008', 'Ikan Kembung Bakar', 'Ikan', 42000.00, 'ikan kembung, jeruk nipis, garam halus, lada, biji ketumbar, mentega', 'Ikan kembung segar dibakar di atas teflon dengan bumbu sederhana, disajikan dengan sambal kecap.', user_uuid),
    ('D009', 'Mujaer Asam Pedas Manis', 'Ikan', 48000.00, 'ikan mujaer, wortel, bawang bombai, bawang putih, cabai rawit, bawang merah, saus tomat, saus tiram, garam, merica, air, jahe, jeruk nipis', 'Ikan mujaer goreng dengan saus asam pedas manis yang segar dan menggugah selera.', user_uuid),
    
    ('D010', 'Lumpia Udang Kulit Tahu', 'Udang', 42000.00, 'ayam, udang, daun bawang, garam, gula, merica, kecap ikan, saus tiram, minyak wijen, tepung sagu, tepung terigu, telur, kembang tahu', 'Lumpia berisi campuran udang dan ayam yang dibungkus kulit tahu, digoreng renyah.', user_uuid),
    ('D011', 'Bakso Ayam Udang', 'Udang', 50000.00, 'ayam giling, udang kupas, telur ayam, minyak goreng, baking powder, garam, lada, bawang goreng, bawang merah, bawang putih, minyak wijen', 'Bakso kenyal dan gurih dari campuran ayam giling dan udang, cocok untuk semua kalangan.', user_uuid),
    ('D012', 'Udang Pop Corn Crispy', 'Udang', 55000.00, 'udang basah, tepung ayam super crispy, air matang, minyak goreng', 'Udang dibalut tepung krispy dan digoreng hingga renyah seperti popcorn, cocok sebagai cemilan.', user_uuid),
    
    ('D013', 'Orek Tempe Manis Pedas', 'Tempe', 12000.00, 'tempe, cabe gendot, cabe keriting, cabe rawit merah, bawang merah, bawang putih, kecap, saus tiram, saus tomat, kaldu bubuk, garam, gula', 'Tempe goreng dioseng dengan bumbu kecap manis pedas, cocok sebagai lauk pendamping nasi.', user_uuid),
    ('D014', 'Terik Ayam Tempe Telor', 'Tempe', 15000.00, 'sayap ayam, telur, tempe, bawang merah, bawang putih, kemiri, ketumbar, garam, lengkuas, daun salam, serai, gula jawa, santan, air, cabe rawit', 'Masakan berkuah santan dengan perpaduan ayam, tempe, dan telur yang kaya bumbu rempah.', user_uuid),
    ('D015', 'Penyet Tempe Sambel Korek', 'Tempe', 18000.00, 'tempe, daun kemangi, cabe rawit, bawang putih, gula, garam, minyak goreng', 'Tempe goreng kering dipencet di atas sambal korek yang pedas, dilengkapi daun kemangi segar.', user_uuid),
    
    ('D016', 'Martabak Tahu Pedas', 'Tahu', 10000.00, 'kulit lumpia, tahu putih, daun bawang, daun seledri, telur, tepung terigu, bawang putih, lada, garam, gula, cabe merah', 'Martabak isi tahu yang pedas dan gurih dibungkus kulit lumpia renyah, cocok untuk camilan.', user_uuid),
    ('D017', 'Batagor Ala Rumahan', 'Tahu', 13000.00, 'tahu kuning, tepung terigu, mentega, bawang putih, garam, merica, air, saus cabe, cabe rawit, kecap', 'Bakso tahu goreng rumahan anti gagal, disajikan dengan saus kacang dan kecap manis.', user_uuid),
    ('D018', 'Sop Tahu Ceker', 'Tahu', 16000.00, 'ceker ayam, wortel, kol, daun bawang, seledri, tahu kuning, garam, gula, penyedap, lada, jeruk nipis, bawang putih, bawang merah', 'Sup hangat dengan ceker ayam, tahu kuning goreng, dan aneka sayuran dalam kuah bening yang gurih.', user_uuid),
    
    ('D019', 'Orak Arik Telur Buncis', 'Telur', 12000.00, 'telur, buncis, bawang merah, bawang putih, cabe rawit, kecap manis, garam, gula, penyedap', 'Tumisan telur orak arik dengan buncis segar, dimasak dengan bumbu sederhana dan kecap manis.', user_uuid),
    ('D020', 'Telur Kornet Goreng', 'Telur', 15000.00, 'kornet kaleng, bawang prei, telur, tepung terigu, cabe rawit, garam, merica, saus tiram', 'Perpaduan kornet kaleng dengan telur, digoreng menjadi lauk sederhana yang lezat dan mudah dibuat.', user_uuid),
    ('D021', 'Tahu Telur Surabaya', 'Telur', 20000.00, 'telur, tahu putih goreng, bawang putih goreng, petis udang, kacang tanah, gula merah, kucai, bawang goreng, kecap manis, cabai rawit, tauge', 'Tahu dan telur goreng khas Surabaya dengan saus petis kacang yang gurih dan lezat.', user_uuid),
    
    ('D022', 'Sate Kambing', 'Kambing', 52000.00, 'daging kambing, daun pepaya, bawang merah, bawang putih, jahe, ketumbar, lada, garam, asam jawa, kecap manis, cabe rawit, tomat, jeruk limau', 'Sate kambing muda yang empuk dibakar dengan arang, disajikan dengan sambal kecap dan lalapan.', user_uuid),
    ('D023', 'Rabeg Kambing', 'Kambing', 58000.00, 'daging kambing paha, cabe, bawang putih, bawang merah, kemiri, jahe, kunyit, klabet, jinten, serai, daun salam, kayu manis, cengkeh, kapulaga, kecap manis, garam, gula', 'Masakan khas Banten dari daging kambing dengan bumbu rempah lengkap dan kecap manis.', user_uuid),
    ('D024', 'Gulai Kambing', 'Kambing', 65000.00, 'daging kambing, santan, serai, daun salam, daun jeruk, cabe, cengkeh, bawang merah, bawang putih, kemiri, kunyit, jahe, lengkuas, ketumbar, merica, pala, garam, gula', 'Gulai kambing berkuah santan kuning yang kaya rempah, khas masakan Padang yang lezat dan harum.', user_uuid),
    
    ('D025', 'Es Teh Manis', 'Minuman', 5000.00, 'teh celup, gula pasir, es batu, air matang', 'Teh manis segar dengan es batu, minuman wajib pelengkap makan yang menyegarkan.', user_uuid),
    ('D026', 'Es Jeruk Segar', 'Minuman', 8000.00, 'jeruk nipis, gula pasir, es batu, air mineral', 'Perasan jeruk nipis segar dicampur gula dan es batu, minuman segar yang menyehatkan.', user_uuid),
    ('D027', 'Jus Alpukat', 'Minuman', 15000.00, 'alpukat matang, susu kental manis, es batu, gula pasir', 'Jus alpukat lembut dan creamy dengan susu kental manis, minuman favorit yang mengenyangkan.', user_uuid),
    
    ('D028', 'Klepon Pandan', 'Kue', 8000.00, 'tepung ketan, gula merah, kelapa parut, pewarna pandan, garam, air', 'Kue tradisional bulat dari tepung ketan isi gula merah cair, dibalut kelapa parut harum.', user_uuid),
    ('D029', 'Martabak Manis Spesial', 'Kue', 35000.00, 'tepung terigu, telur, gula, ragi, susu, mentega, coklat meises, keju parut, butter', 'Martabak tebal dan lembut dengan isi coklat, keju, dan topping pilihan yang melimpah.', user_uuid),
    ('D030', 'Pisang Goreng Crispy', 'Kue', 10000.00, 'pisang kepok, tepung terigu, tepung beras, gula pasir, vanili, minyak goreng', 'Pisang kepok dibalut adonan tepung renyah dan digoreng keemasan, cocok untuk cemilan sore.', user_uuid),
    
    ('D031', 'Nasi Putih', 'Nasi', 5000.00, 'beras pulen, air, garam sedikit', 'Nasi putih pulen matang yang menjadi pendamping wajib dari setiap lauk masakan.', user_uuid),
    ('D032', 'Nasi Goreng Spesial', 'Nasi', 25000.00, 'nasi putih, telur, bawang merah, bawang putih, kecap manis, cabe rawit, garam, penyedap, minyak goreng, bawang goreng, kerupuk', 'Nasi goreng dengan telur, bumbu lengkap, dan kecap manis, sajian sarapan atau makan malam andalan.', user_uuid),
    ('D033', 'Nasi Uduk Betawi', 'Nasi', 18000.00, 'beras, santan, serai, daun salam, daun pandan, garam, bawang goreng', 'Nasi dimasak dengan santan dan rempah khas Betawi, harum dan gurih, disajikan dengan lauk pelengkap.', user_uuid);
END $$;

-- =====================================================
-- STEP 4: VERIFICATION
-- =====================================================
-- Check if everything was created successfully
SELECT 'Setup Complete!' as status;

-- Show user info
SELECT id, email, display_name FROM users WHERE email = 'test@example.com';

-- Show dish statistics
SELECT COUNT(*) as total_dishes, 
       COUNT(DISTINCT type) as unique_types,
       MIN(price) as min_price,
       MAX(price) as max_price,
       AVG(price) as avg_price
FROM dishes;

-- Show dishes by type
SELECT type, COUNT(*) as count, ROUND(AVG(price), 2) as avg_price
FROM dishes 
GROUP BY type 
ORDER BY count DESC;

-- =====================================================
-- SETUP COMPLETE! 
-- =====================================================
-- Your Supabase database is now ready for Java development
-- 
-- Next steps:
-- 1. Copy your Supabase URL and API keys
-- 2. Set up your Java Spring Boot project
-- 3. Configure application.properties with Supabase credentials
-- 4. Start building your REST API endpoints
