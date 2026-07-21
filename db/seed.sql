-- Seed Data Awal Ivet Mart (Universitas Ivet Semarang)

INSERT INTO stores (id, name, description, logo_url, favicon_url, announcement)
VALUES (
    'store-ivetmart',
    'Ivet Mart',
    'Marketplace resmi civitas Universitas Ivet Semarang — Menghadirkan produk khas Semarang dan merchandise eksklusif kampus UNISVET.',
    '/logo.png',
    '/logo.png',
    'Selamat Datang di Ivet Mart — Pusat Produk Khas Semarang & Merchandise Resmi UNISVET'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name, slug, description) VALUES
('cat-kuliner', 'Kuliner Khas Semarang', 'kuliner-semarang', 'Makanan dan oleh-oleh otentik khas Kota Semarang'),
('cat-fashion', 'Fashion & Batik', 'fashion-batik', 'Kain batik Semarangan dan produk kerajinan fashion etnik'),
('cat-merch', 'Merchandise UNISVET', 'merchandise-unisvet', 'Produk dan aksesoris resmi edisi Universitas Ivet Semarang')
ON CONFLICT (id) DO NOTHING;

INSERT INTO collections (id, name, slug, description) VALUES
('col-bestsellers', 'Produk Terlaris', 'bestsellers', 'Pilihan produk paling diminati civitas UNISVET dan pengunjung'),
('col-featured', 'Koleksi Spesial UNISVET', 'featured', 'Merchandise eksklusif dan kerajinan pilihan UNISVET')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, name, slug, description, category_id, images, active) VALUES
('p-lumpia', 'Lumpia Semarang Rebung Original', 'lumpia-semarang', 'Lumpia Semarang khas dengan isian rebung segar, daging ayam, dan telur gurih. Disajikan hangat lengkap dengan saus tauco khas dan kucai segar.', 'cat-kuliner', '["/products/lumpia-semarang.png"]'::jsonb, true),
('p-batik', 'Kemeja Batik Semarangan Motif Sekar Jagad', 'batik-semarangan', 'Kemeja batik pria berkualitas tinggi dengan motif Sekar Jagad berornamen khas warna Merah Maroon & Emas UNISVET.', 'cat-fashion', '["/products/batik-semarang.png"]'::jsonb, true),
('p-bandeng', 'Bandeng Presto Juwana Premium', 'bandeng-presto', 'Bandeng presto duri lunak olahan khas Juwana Semarang. Daging lembut gurih dilengkapi sambal terasi spesial.', 'cat-kuliner', '["/products/bandeng-presto.png"]'::jsonb, true),
('p-tumbler', 'Tumbler & Mug Eksklusif UNISVET', 'tumbler-unisvet', 'Set tumbler stainless steel dan mug keramik edisi spesial Universitas Ivet Semarang berwarna Maroon & Emas.', 'cat-merch', '["/products/tumbler-unisvet.png"]'::jsonb, true),
('p-polo', 'Kaos Polo Civitas UNISVET', 'polo-unisvet', 'Kaos polo bahan cotton lacoste premium dengan bordir logo Universitas Ivet Semarang. Nyaman untuk aktivitas harian.', 'cat-merch', '["/products/polo-unisvet.png"]'::jsonb, true),
('p-wingko', 'Wingko Babat Semarang Cap Kereta Api', 'wingko-babat', 'Kue tradisional khas Semarang dengan perpaduan gurihnya kelapa sangrai muda dan ketan manis harum bakar.', 'cat-kuliner', '["/products/wingko-babat.png"]'::jsonb, true),
('p-tahu', 'Tahu Bakso Semarang Spesial Daging Sapi', 'tahu-bakso', 'Tahu goreng berkualitas berisikan olahan daging sapi cincang padat dan gurih khas Semarang.', 'cat-kuliner', '["/products/tahu-bakso.png"]'::jsonb, true),
('p-tastenun', 'Tas Laptop Tenun Etnik Semarang', 'tas-tenun', 'Tas laptop buatan perajin lokal Semarang dari kombinasi kain tenun etnik dan kulit sintetis premium.', 'cat-fashion', '["/products/tas-tenun.png"]'::jsonb, true)
ON CONFLICT (id) DO NOTHING;

-- Variants
INSERT INTO variants (id, product_id, name, price, stock, images, attributes) VALUES
('v-lumpia-1', 'p-lumpia', 'Kemasan Isi 5 Pcs', 45000, 50, '["/products/lumpia-semarang.png"]'::jsonb, '{"porsi": "Isi 5 Pcs"}'::jsonb),
('v-batik-m', 'p-batik', 'Ukuran M', 185000, 20, '["/products/batik-semarang.png"]'::jsonb, '{"ukuran": "M"}'::jsonb),
('v-batik-l', 'p-batik', 'Ukuran L', 185000, 25, '["/products/batik-semarang.png"]'::jsonb, '{"ukuran": "L"}'::jsonb),
('v-bandeng-1', 'p-bandeng', 'Kotak 2 Ekor', 65000, 40, '["/products/bandeng-presto.png"]'::jsonb, '{"kemasan": "Box 2 Ekor"}'::jsonb),
('v-tumbler-1', 'p-tumbler', 'Set Maroon Emas', 120000, 100, '["/products/tumbler-unisvet.png"]'::jsonb, '{"warna": "Maroon & Emas"}'::jsonb),
('v-polo-m', 'p-polo', 'Ukuran M', 110000, 45, '["/products/polo-unisvet.png"]'::jsonb, '{"ukuran": "M"}'::jsonb),
('v-polo-l', 'p-polo', 'Ukuran L', 110000, 50, '["/products/polo-unisvet.png"]'::jsonb, '{"ukuran": "L"}'::jsonb),
('v-wingko-1', 'p-wingko', 'Box Isi 10 Pcs', 38000, 60, '["/products/wingko-babat.png"]'::jsonb, '{"isi": "10 Pcs"}'::jsonb),
('v-tahu-1', 'p-tahu', 'Box Isi 10 Pcs', 42000, 35, '["/products/tahu-bakso.png"]'::jsonb, '{"isi": "10 Pcs"}'::jsonb),
('v-tastenun-1', 'p-tastenun', 'Standard 14-15 Inch', 215000, 15, '["/products/tas-tenun.png"]'::jsonb, '{"ukuran": "14-15 Inch"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Product Collections
INSERT INTO product_collections (product_id, collection_id) VALUES
('p-lumpia', 'col-bestsellers'),
('p-batik', 'col-bestsellers'),
('p-bandeng', 'col-bestsellers'),
('p-tumbler', 'col-bestsellers'),
('p-polo', 'col-bestsellers'),
('p-wingko', 'col-bestsellers'),
('p-tahu', 'col-bestsellers'),
('p-tastenun', 'col-bestsellers'),
('p-tumbler', 'col-featured'),
('p-polo', 'col-featured'),
('p-batik', 'col-featured'),
('p-tastenun', 'col-featured')
ON CONFLICT DO NOTHING;
