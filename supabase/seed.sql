-- ==============================================================================
-- SISTEM TEMPAHAN GAMBAR MURID - SK TAMAN SRI PULAI
-- Seed Data: seed.sql
-- ==============================================================================

-- 1. SEED SYSTEM SETTINGS
INSERT INTO public.system_settings (
    id, school_name, school_emblem_text, school_tagline, session_year,
    homepage_title, announcement_notice, is_booking_open,
    booking_start_date, booking_end_date,
    bank_name, bank_account_holder, bank_account_number,
    payment_instructions, whatsapp_number, contact_email,
    school_address, school_phone
) VALUES (
    'stsp-config',
    'SK TAMAN SRI PULAI',
    'SKTSP BERILMU BERBAKTI',
    'Mencapai Kecemerlangan Akademik & Sahsiah Terpuji',
    '2026',
    'Tempahan Gambar Murid Sesi 2026',
    'Sesi fotografi murid bagi tahun 2026 sedang berlangsung. Ibu bapa dan penjaga dinasihatkan membuat tempahan dan pengesahan bayaran sebelum tarikh tutup rasmi.',
    true,
    '2026-03-01',
    '2026-11-30',
    'MAYBANK (MALAYAN BANKING BERHAD)',
    'PIBG SK TAMAN SRI PULAI',
    '5512 8901 4432',
    'Sila buat bayaran secara pemindahan bank (Online Transfer / DuitNow) ke akaun PIBG SK Taman Sri Pulai di atas. Nyatakan Nama Murid & Kelas pada ruangan rujukan bayaran. Kemudian muat naik resit/bukti bayaran pada borang tempahan.',
    '60197824150',
    'sktamansripulai@moe.edu.my',
    'Jalan Batai 4, Taman Sri Pulai, 81110 Kangkar Pulai, Johor Bahru, Johor',
    '07-527 2188'
) ON CONFLICT (id) DO NOTHING;

-- 2. SEED CLASSES
INSERT INTO public.classes (id, year, name, teacher_name, is_active) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Tahun 1', '1 Bestari', 'Cikgu Noraini binti Yusof', true),
    ('00000000-0000-0000-0000-000000000002', 'Tahun 1', '1 Cemerlang', 'Cikgu Ahmad Ridzwan', true),
    ('00000000-0000-0000-0000-000000000003', 'Tahun 1', '1 Amanah', 'Ustazah Siti Hajar', true),
    ('00000000-0000-0000-0000-000000000004', 'Tahun 2', '2 Bestari', 'Cikgu Fauziah binti Hamid', true),
    ('00000000-0000-0000-0000-000000000005', 'Tahun 2', '2 Cemerlang', 'Cikgu Roslan bin Daud', true),
    ('00000000-0000-0000-0000-000000000006', 'Tahun 3', '3 Bestari', 'Cikgu Maryam binti Omar', true),
    ('00000000-0000-0000-0000-000000000007', 'Tahun 4', '4 Bestari', 'Cikgu Hasnah binti Idris', true),
    ('00000000-0000-0000-0000-000000000008', 'Tahun 5', '5 Bestari', 'Cikgu Khairul Nizam', true),
    ('00000000-0000-0000-0000-000000000009', 'Tahun 6', '6 Bestari', 'Cikgu Azman bin Sulaiman', true),
    ('00000000-0000-0000-0000-000000000010', 'Tahun 6', '6 Cemerlang', 'Cikgu Suraya binti Mansor', true)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED PACKAGES (3 PAKEJ GAMBAR KELAS - SEMUA GAMBAR ADA TEMPLATE & CETAKAN GAMBAR SAHAJA)
INSERT INTO public.packages (id, code, name, price, description, contents, is_active, is_popular) VALUES
    ('10000000-0000-0000-0000-000000000001', 'PAKEJ A', 'Gambar Formal Kelas Saiz 5R', 7.00,
     '1 keping cetakan foto rasmi gaya formal bersama guru kelas dan rakan sekelas bersaiz 5R (5x7 inci). Dilengkapi reka bentuk template rasmi SKTSP.',
     '["1x Cetakan Gambar Formal Kelas Saiz 5R (5x7 inci)", "Reka Bentuk Template Rasmi Sekolah SKTSP", "Kemasan Kertas Foto Studio Berkualiti Makmal", "Hanya Cetakan Gambar Sahaja"]'::jsonb,
     true, false),
    ('10000000-0000-0000-0000-000000000002', 'PAKEJ B', 'Gambar Freestyle Kelas Saiz 5R', 7.00,
     '1 keping cetakan foto gaya santai / freestyle bersama rakan sekelas dan guru bersaiz 5R (5x7 inci). Dilengkapi reka bentuk template ceria SKTSP.',
     '["1x Cetakan Gambar Freestyle Kelas Saiz 5R (5x7 inci)", "Reka Bentuk Template Eksklusif & Ceria SKTSP", "Kemasan Kertas Foto Studio Berkualiti Makmal", "Hanya Cetakan Gambar Sahaja"]'::jsonb,
     true, false),
    ('10000000-0000-0000-0000-000000000003', 'PAKEJ C', 'Gambar Formal + Freestyle (Kombo 5R)', 12.00,
     'Set kombo lengkap 2 keping: 1x Gambar Formal Kelas Saiz 5R dan 1x Gambar Freestyle Kelas Saiz 5R. Kedua-dua gambar ada template rasmi SKTSP dengan tawaran harga diskaun.',
     '["1x Cetakan Gambar Formal Kelas Saiz 5R (Template Rasmi)", "1x Cetakan Gambar Freestyle Kelas Saiz 5R (Template Ceria)", "Diskaun Jimat RM2.00 (Harga Asal RM14.00 ➔ Tawaran RM12.00)", "Hanya Cetakan Gambar Sahaja (2 Keping Foto 5R)"]'::jsonb,
     true, true)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED SAMPLE STUDENTS
INSERT INTO public.students (id, student_number, full_name, class_id, class_name, year, gender, parent_name, parent_phone, parent_email) VALUES
    ('20000000-0000-0000-0000-000000000001', 'TSP26001', 'NUR AISYAH BINTI MUHAMMAD', '00000000-0000-0000-0000-000000000001', '1 Bestari', 'Tahun 1', 'Perempuan', 'Muhammad bin Abdullah', '012-7654321', 'muhammad.abd@gmail.com'),
    ('20000000-0000-0000-0000-000000000002', 'TSP26002', 'ADAM RAYYAN BIN KHAIRUL', '00000000-0000-0000-0000-000000000001', '1 Bestari', 'Tahun 1', 'Lelaki', 'Khairul Nizam bin Othman', '019-8765432', 'khairul.n@yahoo.com'),
    ('20000000-0000-0000-0000-000000000003', 'TSP26003', 'FARIS HAZIQ BIN AZLAN', '00000000-0000-0000-0000-000000000004', '2 Bestari', 'Tahun 2', 'Lelaki', 'Azlan bin Sulaiman', '013-7123456', NULL),
    ('20000000-0000-0000-0000-000000000004', 'TSP26008', 'NUR INSYIRAH BINTI FARID', '00000000-0000-0000-0000-000000000009', '6 Bestari', 'Tahun 6', 'Perempuan', 'Farid bin Kamaruddin', '016-7890123', 'farid.k@hotmail.com')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED SAMPLE ORDERS
INSERT INTO public.orders (
    id, order_number, student_id, student_name, student_number,
    class_id, class_name, year, parent_name, parent_phone,
    package_id, package_name_snapshot, package_price_snapshot,
    quantity, total_amount, order_status, payment_status,
    payment_method, payment_reference
) VALUES
    ('30000000-0000-0000-0000-000000000001', 'STSP-2026-00001', '20000000-0000-0000-0000-000000000001', 'NUR AISYAH BINTI MUHAMMAD', 'TSP26001',
     '00000000-0000-0000-0000-000000000001', '1 Bestari', 'Tahun 1', 'Muhammad bin Abdullah', '012-7654321',
     '10000000-0000-0000-0000-000000000003', 'PAKEJ C (Gambar Formal + Freestyle - Kombo 5R)', 12.00,
     1, 12.00, 'Dalam Proses Cetakan', 'Approved', 'Bank Transfer', 'MBB782910'),
    ('30000000-0000-0000-0000-000000000002', 'STSP-2026-00002', '20000000-0000-0000-0000-000000000002', 'ADAM RAYYAN BIN KHAIRUL', 'TSP26002',
     '00000000-0000-0000-0000-000000000001', '1 Bestari', 'Tahun 1', 'Khairul Nizam bin Othman', '019-8765432',
     '10000000-0000-0000-0000-000000000003', 'PAKEJ C (Gambar Formal + Freestyle - Kombo 5R)', 12.00,
     1, 12.00, 'Bayaran Disahkan', 'Approved', 'Bank Transfer', 'DN99238102')
ON CONFLICT (id) DO NOTHING;
