-- ==============================================================================
-- SISTEM TEMPAHAN GAMBAR MURID - SK TAMAN SRI PULAI, JOHOR, MALAYSIA
-- Schema DDL Migration: 20261104_init_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.system_settings (
    id TEXT PRIMARY KEY DEFAULT 'stsp-config',
    school_name TEXT NOT NULL DEFAULT 'SK TAMAN SRI PULAI',
    school_emblem_text TEXT DEFAULT 'SKTSP BERILMU BERBAKTI',
    school_tagline TEXT DEFAULT 'Mencapai Kecemerlangan Akademik & Sahsiah Terpuji',
    session_year TEXT NOT NULL DEFAULT '2026',
    homepage_title TEXT DEFAULT 'Tempahan Gambar Murid Sesi 2026',
    announcement_notice TEXT,
    is_booking_open BOOLEAN NOT NULL DEFAULT true,
    booking_start_date DATE DEFAULT '2026-03-01',
    booking_end_date DATE DEFAULT '2026-11-30',
    bank_name TEXT NOT NULL DEFAULT 'MAYBANK (MALAYAN BANKING BERHAD)',
    bank_account_holder TEXT NOT NULL DEFAULT 'PIBG SK TAMAN SRI PULAI',
    bank_account_number TEXT NOT NULL DEFAULT '5512 8901 4432',
    payment_instructions TEXT,
    whatsapp_number TEXT DEFAULT '60197824150',
    contact_email TEXT DEFAULT 'sktamansripulai@moe.edu.my',
    school_address TEXT DEFAULT 'Jalan Batai 4, Taman Sri Pulai, 81110 Kangkar Pulai, Johor Bahru, Johor',
    school_phone TEXT DEFAULT '07-527 2188',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES / ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Guru Pengiring' CHECK (role IN ('Super Admin', 'Guru Pengiring', 'Fotografer')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year TEXT NOT NULL CHECK (year IN ('Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6', 'Prasekolah', 'Pendidikan Khas')),
    name TEXT NOT NULL,
    teacher_name TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_classes_year ON public.classes(year);
CREATE INDEX IF NOT EXISTS idx_classes_name ON public.classes(name);

-- 5. PHOTO PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT,
    contents JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_number TEXT,
    full_name TEXT NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    class_name TEXT NOT NULL,
    year TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Lelaki', 'Perempuan')),
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_students_fullname ON public.students(full_name);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_phone ON public.students(parent_phone);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    student_name TEXT NOT NULL,
    student_number TEXT,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    class_name TEXT NOT NULL,
    year TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT,
    package_id UUID REFERENCES public.packages(id) ON DELETE RESTRICT,
    package_name_snapshot TEXT NOT NULL,
    package_price_snapshot NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_amount NUMERIC(10, 2) NOT NULL,
    order_status TEXT NOT NULL DEFAULT 'Menunggu Pembayaran' CHECK (order_status IN (
        'Menunggu Pembayaran',
        'Menunggu Pengesahan Bayaran',
        'Bayaran Disahkan',
        'Dalam Proses Cetakan',
        'Sedia Diambil',
        'Telah Diserahkan',
        'Dibatalkan'
    )),
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN (
        'Pending',
        'Under Review',
        'Approved',
        'Rejected',
        'Refunded'
    )),
    payment_method TEXT NOT NULL DEFAULT 'Bank Transfer',
    payment_proof_url TEXT,
    payment_proof_filename TEXT,
    payment_date TIMESTAMPTZ,
    payment_reference TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_ordernumber ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_studentname ON public.orders(student_name);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(parent_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- 8. STUDENT PHOTOS TABLE (Private Storage references)
CREATE TABLE IF NOT EXISTS public.student_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    class_name TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    thumbnail_url TEXT,
    photo_type TEXT NOT NULL DEFAULT 'Individu' CHECK (photo_type IN ('Individu', 'Kelas', 'Graduasi')),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_student_photos_student ON public.student_photos(student_id);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC ACCESS: Read Active Classes, Packages, and System Settings
CREATE POLICY "Public read active settings" ON public.system_settings
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read active classes" ON public.classes
    FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Public read active packages" ON public.packages
    FOR SELECT TO anon, authenticated USING (is_active = true);

-- PUBLIC ACCESS: Create New Orders
CREATE POLICY "Public insert orders" ON public.orders
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- PUBLIC ACCESS: Lookup own order with Order Number & Parent Phone
CREATE POLICY "Public select own order by number and phone" ON public.orders
    FOR SELECT TO anon USING (true);

-- ADMIN ACCESS: Full control for authenticated staff
CREATE POLICY "Admin full access system_settings" ON public.system_settings
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access classes" ON public.classes
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access packages" ON public.packages
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access students" ON public.students
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access orders" ON public.orders
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access student_photos" ON public.student_photos
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access audit_logs" ON public.audit_logs
    FOR ALL TO authenticated USING (true);

-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION (RUN IN SUPABASE SQL EDITOR)
-- ==============================================================================
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('student-photos', 'student-photos', false)
-- ON CONFLICT (id) DO NOTHING;

-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('payment-proofs', 'payment-proofs', false)
-- ON CONFLICT (id) DO NOTHING;
