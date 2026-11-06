# Sistem Tempahan Gambar Kelas Murid – SK Taman Sri Pulai

Aplikasi web pengurusan fotografi rasmi dan lengkap untuk **Sekolah Kebangsaan Taman Sri Pulai, Johor, Malaysia**.

> **Nota Rasmi Fotografi**: Sistem ini dikonfigurasikan dengan **3 Pakej Gambar Kelas**:
> - **PAKEJ A (RM7.00)**: Gambar Formal Kelas Saiz 5R (Template Rasmi)
> - **PAKEJ B (RM7.00)**: Gambar Freestyle Kelas Saiz 5R (Template Ceria)
> - **PAKEJ C (RM12.00)**: Gambar Formal + Freestyle Kombo Saiz 5R (Harga Asal RM14.00 ➔ Diskaun RM12.00)
> 
> *Semua gambar akan ada template rasmi SKTSP. Semua pakej hanya cetakan gambar sahaja (Saiz 5R).*

Dibina khas untuk menguruskan operasi fotografi gambar kelas murid secara teratur dan profesional:
- **Portal Ibu Bapa (Public Access)**: Membuat tempahan gambar, memilih pakej foto, memuat naik bukti pemindahan bank, dan menyemak status tempahan secara selamat tanpa pendaftaran akaun.
- **Panel Pentadbir (Admin Access)**: Pengurusan penuh tempahan (CRUD), pendaftaran murid (import/eksport CSV), pengurusan kelas (Tahun 1–6), penetapan pakej (snapshot pricing & diskaun kombo), pengesahan pembayaran dengan pratonton resit, modul makmal cetakan (print packing slip), laporan kewangan dan arkib gambar kelas.

---

## 1. Ciri-Ciri Utama Sistem

### A. Portal Awam – Ibu Bapa & Penjaga
1. **Laman Utama (`/`)**:
   - Logo lambang sekolah SKTSP, sesi tahun semasa (2026), tarikh tutup tempahan.
   - Pameran 3 pakej foto berserta harga tawaran dan diskaun kombo.
   - Maklumat akaun bank PIBG rasmi dengan fungsi salin nombor akaun segera.
   - Butang tindakan pantas ke borang tempahan dan semakan status.
2. **Borang Tempahan 5 Langkah (`/tempahan`)**:
   - **Langkah 1**: Pilih Tahun (Tahun 1 - Tahun 6) dan Kelas murid daripada database (bukan hardcoded).
   - **Langkah 2**: Masukkan nama penuh murid, no. murid (pilihan), nama penjaga dan nombor telefon WhatsApp.
   - **Langkah 3**: Pilih pakej fotografi (Pakej A RM7, Pakej B RM7, atau Pakej C RM12 [Jimat RM2]).
   - **Langkah 4**: Semak ringkasan tempahan dan jumlah bayaran (boleh kembali untuk edit).
   - **Langkah 5**: Jana Nombor Tempahan unik (`STSP-2026-XXXXX`), paparkan arahan bayaran bank, muat naik slip transaksi (resit bayaran) dan cetak salinan resit rasmi.
3. **Semakan Status Tempahan (`/semak-tempahan`)**:
   - Carian berasaskan dua faktor: **No. Tempahan (Order ID)** dan **No. Telefon Penjaga** (melindungi data peribadi murid daripada pencerobohan).
   - Penjejak kemajuan visual: *Menunggu Pembayaran* ➔ *Menunggu Pengesahan Bayaran* ➔ *Bayaran Disahkan* ➔ *Dalam Proses Cetakan* ➔ *Sedia Diambil* ➔ *Telah Diserahkan*.
   - Peluang memuat naik slip bayaran jika bayaran dibuat lewat.
   - Paparan dan cetakan semula resit rasmi berkomputer.
4. **Katalog Pakej (`/pakej`)**:
   - Perincian semua pakej aktif (Formal, Freestyle, Kombo), jadual perbandingan spesifikasi saiz 5R dan template.
5. **Hubungi Sekolah (`/hubungi`)**:
   - Alamat fizikal di Kangkar Pulai, no. telefon pejabat, emel rasmi KPM, borang pertanyaan dan butang WhatsApp hotline.

---

### B. Panel Pentadbir – Staf & Pengurusan
1. **Log Masuk Pentadbir (`/admin/login`)**:
   - Pengesahan selamat dengan integrasi Supabase Auth / Akaun Pentadbir Terjamin.
   - Kredensial lalai tersedia untuk akses pantas pihak pentadbir.
2. **Dashboard Statistik (`/admin/dashboard`)**:
   - Ringkasan KPI masa nyata: Jumlah tempahan, jumlah murid, jumlah kelas, jumlah kutipan disahkan (RM), bayaran menunggu semakan, tempahan selesai.
   - Carta taburan jualan mengikut pakej dan pecahan tempahan mengikut tahun persekolahan.
   - Jadual tempahan terkini dengan tindakan segera.
3. **Pengurusan Tempahan (`/admin/tempahan`)**:
   - CRUD penuh: lihat semua tempahan, carian pantas mengikut nama/Order ID, penapis mengikut kelas, pakej dan status.
   - Tambah tempahan secara manual bagi bayaran tunai kaunter.
   - Kemaskini status tempahan dan status bayaran secara fleksibel.
   - Cetak resit individu dan slip pesanan.
4. **Pengurusan Murid (`/admin/murid`)**:
   - Tambah, edit, dan padam rekod murid.
   - Import pukal senarai murid melalui CSV dengan pengesanan ralat baris data.
   - Eksport senarai murid ke CSV/Excel.
   - Paparan sejarah tempahan bagi setiap murid.
5. **Pengurusan Kelas (`/admin/kelas`)**:
   - Urus kelas mengikut Tahun 1 hingga 6 (serta Prasekolah / PPKI).
   - Tetapkan guru kelas dan pantau bilangan murid serta tempahan.
   - Aktifkan atau nyahaktifkan kelas tertentu mengikut sesi.
6. **Pengurusan Pakej (`/admin/pakej`)**:
   - Tetapkan kod, nama, harga, dan senarai item bagi setiap pakej.
   - Perlindungan Snapshot: perubahan harga tidak mengubah harga rekod lama.
7. **Pengesahan Pembayaran (`/admin/bayaran`)**:
   - Paparan resit/slip transaksi ibu bapa dalam tetingkap Lightbox.
   - Luluskan (Approve) bayaran dengan satu klik atau tolak (Reject) berserta catatan sebab.
8. **Pengurusan Gambar Kelas (`/admin/gambar`)**:
   - Muat naik fail gambar kelas rasmi beresolusi tinggi mengikut kelas dan sesi.
   - Repositori terkawal (Private Storage bucket) bagi mematuhi privasi data murid sekolah.
9. **Pengurusan Cetakan & Agihan (`/admin/cetakan`)**:
   - Membantu jurufoto & makmal cetakan menjejak status pengeluaran.
   - Jana **Senarai Semak Agihan Kelas (Print Packing Slip)** berformat rasmi berserta kotak tandatangan penerimaan bagi setiap murid.
10. **Laporan & Analitik Kewangan (`/admin/laporan`)**:
    - Laporan jumlah kutipan disahkan, belum bayar dan anggaran nilai kasar.
    - Penapis mengikut julat tarikh.
    - Cetak format rasmi lengkap dengan ruangan tandatangan Guru Besar / Bendahari PIBG.
11. **Tetapan Sistem (`/admin/tetapan`)**:
    - Urus nama sekolah, sesi tahun, pengumuman, jadual buka/tutup tempahan, akaun bank PIBG dan WhatsApp hotline.
    - Konfigurasi penyambungan Supabase URL & Anon Key dengan fungsi ujian sambungan segera.
    - Fungsi pembersihan data sampel untuk pelancaran rasmi.

---

## 2. Kredensial Pentadbir (Default Admin Credentials)

Sistem telah dikonfigurasikan dengan akaun pentadbir lalai:

- **URL Log Masuk**: `https://<APP_URL>/` ➔ Klik butang **Portal Pentadbir** atau buka navigasi footer
- **Emel Pentadbir**: `admin@sktsp.edu.my`
- **Kata Laluan**: `admin1234`
- **Peranan**: Super Admin

*(Anda boleh menambah akaun Guru Pengiring atau Fotografer lain di menu Pengguna & Audit).*

---

## 3. Struktur Pangkalan Data Supabase PostgreSQL

Skrip skema database lengkap dan seed data telah disediakan di dalam folder `/supabase`:

1. **Skema & Migrasi**: `/supabase/migrations/20261104_init_schema.sql`
2. **Data Sampel Awal**: `/supabase/seed.sql`

Jadual-jadual yang dicipta:
- `system_settings`: Tetapan rasmi sekolah, tahun sesi, jadual tempahan, maklumat akaun bank PIBG.
- `profiles`: Akaun pentadbir sekolah dan peranan kebenaran.
- `classes`: Senarai kelas aktif mengikut tahun (Tahun 1–6).
- `packages`: Pakej fotografi, harga dan senarai kandungan item.
- `students`: Data murid SK Taman Sri Pulai dan maklumat penjaga.
- `orders`: Rekod tempahan rasmi, Order ID unik, snapshot harga dan status.
- `student_photos`: Pautan fail gambar murid dengan kebenaran storan peribadi.
- `audit_logs`: Rekod jejak audit setiap aktiviti pentadbir.

### Polisi Row Level Security (RLS)
- Akses Awam (Anon): Hanya boleh membaca kelas dan pakej aktif, membuat tempahan baharu, dan menyemak rekod tempahan sendiri dengan padanan Order ID dan no. telefon penjaga.
- Akses Pentadbir (Authenticated): Akses penuh CRUD ke atas semua rekod.
- Storage: Bucket `student-photos` dan `payment-proofs` ditetapkan sebagai storan peribadi (Private Bucket).

---

## 4. Panduan Pemasangan & Pembangunan Tempatan

### Keperluan:
- Node.js versi 18 ke atas
- Pengurus pakej `npm`

### Langkah Menjalankan Aplikasi:
```bash
# 1. Pasang semua dependencies
npm install

# 2. Jalankan server pembangunan
npm run dev

# 3. Bina fail produksi
npm run build

# 4. Semak type checking & lint
npm run lint
```

Dev server akan aktif pada: `http://localhost:3000`

---

## 5. Cara Menyambungkan ke Supabase Sebenar

1. Cipta projek baru di [Supabase Dashboard](https://supabase.com).
2. Buka menu **SQL Editor** di Supabase dan jalankan keseluruhan fail `/supabase/migrations/20261104_init_schema.sql`.
3. (Pilihan) Jalankan fail `/supabase/seed.sql` jika mahu memasukkan data awal.
4. Dapatkan **Project URL** dan **anon public API Key** dari *Project Settings > API*.
5. Buka **Tetapan Sistem** dalam Panel Pentadbir SKTSP (`/admin/tetapan`) dan masukkan Supabase URL dan Key, kemudian klik **Uji Sambungan Supabase**.
6. Atau simpan pembolehubah persekitaran dalam fail `.env`:
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-public-key"
   ```

---

## 6. Cara Deploy ke Vercel

1. Tolak kod ini ke repositori GitHub anda.
2. Log masuk ke akaun [Vercel](https://vercel.com) dan pilih **Add New Project**.
3. Import repositori GitHub tersebut.
4. Pada bahagian **Environment Variables**, masukkan:
   - `VITE_SUPABASE_URL` = (URL Supabase anda)
   - `VITE_SUPABASE_ANON_KEY` = (Anon Key Supabase anda)
5. Klik **Deploy**. Vercel akan membina aplikasi dengan arahan `npm run build` dan memaparkan aplikasi secara langsung di domain sekolah anda.

---

## 7. Senarai Semak Ujian & Kawalan Kualiti (Quality Control)

- [x] Laman utama dibuka dengan paparan identiti rasmi SK Taman Sri Pulai, Johor.
- [x] Pakej gambar dipaparkan secara dinamik dengan perincian item.
- [x] Pemilihan kelas dinamik mengikut Tahun 1 hingga 6.
- [x] Borang 5 langkah tempahan berfungsi dengan validasi medan wajib.
- [x] Penjanaan automatik Order ID unik (`STSP-2026-XXXXX`).
- [x] Muat naik bukti/slip bayaran disokong dan dipratonton.
- [x] Log masuk pentadbir selamat dengan session guard.
- [x] Pengurusan tempahan dengan penapis kelas, pakej, dan status.
- [x] Pengesahan bukti bayaran dengan Lightbox dan tindakan kelulusan 1 klik.
- [x] Import senarai murid pukal melalui CSV berserta pengesanan ralat.
- [x] Eksport data tempahan dan murid ke format CSV/Excel.
- [x] Cetakan resit rasmi berkomputer dan Senarai Semak Agihan Kelas.
- [x] Responsif sepenuhnya pada telefon pintar, tablet, dan desktop.
