import {
  ClassItem,
  Student,
  PhotoPackage,
  Order,
  StudentPhoto,
  ClassPhoto,
  SystemSettings,
  AdminUser,
  AuditLog,
  OrderStatus,
  PaymentStatus,
  YearGrade,
} from '../types';

const STORAGE_KEYS = {
  CLASSES: 'stsp_classes',
  STUDENTS: 'stsp_students',
  PACKAGES: 'stsp_packages',
  ORDERS: 'stsp_orders',
  PHOTOS: 'stsp_photos',
  CLASS_PHOTOS: 'stsp_class_photos',
  SETTINGS: 'stsp_settings',
  ADMIN_USER: 'stsp_admin_session',
  ADMIN_CREDENTIALS: 'stsp_admin_credentials',
  AUDIT_LOGS: 'stsp_audit_logs',
  ORDER_COUNTER: 'stsp_order_counter',
};

// Official DuitNow QR for PIBG SK TAMAN SRI PULAI
export const DEFAULT_DUITNOW_QR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="420" viewBox="0 0 360 420"><rect width="360" height="420" rx="16" fill="%23ffffff"/><rect x="12" y="12" width="336" height="60" rx="10" fill="%23ed1c24"/><text x="180" y="42" font-family="sans-serif" font-size="20" font-weight="900" fill="%23ffffff" text-anchor="middle" letter-spacing="1">DuitNow</text><text x="180" y="60" font-family="sans-serif" font-size="11" font-weight="600" fill="%23ffffff" text-anchor="middle">QR PAY RASMI · MALAYSIA</text><rect x="40" y="85" width="280" height="255" rx="12" fill="%23f8fafc" stroke="%23e2e8f0" stroke-width="2"/><g fill="%231e293b"><rect x="65" y="110" width="55" height="55" rx="4"/><rect x="73" y="118" width="39" height="39" rx="2" fill="%23ffffff"/><rect x="80" y="125" width="25" height="25" rx="2"/><rect x="240" y="110" width="55" height="55" rx="4"/><rect x="248" y="118" width="39" height="39" rx="2" fill="%23ffffff"/><rect x="255" y="125" width="25" height="25" rx="2"/><rect x="65" y="255" width="55" height="55" rx="4"/><rect x="73" y="263" width="39" height="39" rx="2" fill="%23ffffff"/><rect x="80" y="270" width="25" height="25" rx="2"/><rect x="135" y="115" width="12" height="12"/><rect x="155" y="115" width="12" height="12"/><rect x="175" y="115" width="20" height="12"/><rect x="140" y="135" width="25" height="12"/><rect x="180" y="135" width="15" height="12"/><rect x="135" y="155" width="18" height="18"/><rect x="165" y="155" width="15" height="12"/><rect x="190" y="155" width="22" height="12"/><rect x="135" y="185" width="90" height="12"/><rect x="65" y="185" width="55" height="12"/><rect x="240" y="185" width="55" height="12"/><rect x="140" y="210" width="25" height="25"/><rect x="180" y="210" width="30" height="12"/><rect x="175" y="230" width="45" height="25"/><rect x="235" y="210" width="20" height="15"/><rect x="265" y="210" width="30" height="25"/><rect x="240" y="245" width="18" height="18"/><rect x="270" y="245" width="25" height="30"/><rect x="135" y="270" width="35" height="20"/><rect x="185" y="280" width="40" height="25"/><rect x="240" y="290" width="55" height="15"/></g><circle cx="180" cy="210" r="22" fill="%23ffc72c"/><text x="180" y="216" font-family="sans-serif" font-size="12" font-weight="900" fill="%231e293b" text-anchor="middle">MBB</text><text x="180" y="360" font-family="sans-serif" font-size="13" font-weight="800" fill="%23163b65" text-anchor="middle">PIBG SK TAMAN SRI PULAI</text><text x="180" y="380" font-family="sans-serif" font-size="12" font-weight="700" fill="%23475569" text-anchor="middle" letter-spacing="1">5512 8901 4432 (MAYBANK)</text><text x="180" y="398" font-family="sans-serif" font-size="10" font-weight="600" fill="%2316a34a" text-anchor="middle">✓ DIJAMIN SAH OLEH PIBG SEKOLAH</text></svg>`;

// Initial Seed Data for SK TAMAN SRI PULAI
const INITIAL_SETTINGS: SystemSettings = {
  schoolName: 'SEKOLAH KEBANGSAAN TAMAN SRI PULAI',
  schoolEmblemText: 'BERILMU BERAMAL BERBAKTI',
  schoolTagline: 'Mencapai Kecemerlangan Akademik & Sahsiah Terpuji',
  sessionYear: '2026',
  homepageTitle: 'Tempahan Gambar Kelas Sesi 2026',
  announcementNotice: 'Sesi fotografi gambar kelas murid bagi tahun 2026 sedang berlangsung. Ibu bapa dan penjaga dinasihatkan membuat tempahan gambar kelas anak masing-masing sebelum tarikh tutup rasmi.',
  isBookingOpen: true,
  bookingStartDate: '2026-03-01',
  bookingEndDate: '2026-11-30',
  bankName: 'MAYBANK (MALAYAN BANKING BERHAD)',
  bankAccountHolder: 'PIBG SK TAMAN SRI PULAI',
  bankAccountNumber: '5512 8901 4432',
  qrCodeUrl: DEFAULT_DUITNOW_QR,
  paymentInstructions: 'Sila buat bayaran secara pemindahan bank (Online Transfer / DuitNow QR) ke akaun PIBG SK Taman Sri Pulai di atas. Nyatakan Nama Murid & Kelas pada ruangan rujukan bayaran. Kemudian muat naik resit/bukti bayaran pada borang tempahan.',
  whatsappNumber: '60197824150',
  contactEmail: 'sktamansripulai@moe.edu.my',
  schoolAddress: 'Jalan Batai 4, Taman Sri Pulai, 81110 Kangkar Pulai, Johor Bahru, Johor',
  schoolPhone: '07-527 2188',
};

const INITIAL_CLASSES: ClassItem[] = [
  { id: 'cls-pra-1', year: 'Prasekolah', name: 'Prasekolah Mawaddah', teacherName: 'Cikgu Nurul Huda binti Ismail', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-pra-2', year: 'Prasekolah', name: 'Prasekolah Sakinah', teacherName: 'Cikgu Siti Zaleha binti Mansur', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-ppki-1', year: 'Pendidikan Khas', name: 'PPKI Al-Fateh', teacherName: 'Cikgu Mohd Hafiz bin Zakaria', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-ppki-2', year: 'Pendidikan Khas', name: 'PPKI An-Nur', teacherName: 'Cikgu Faizah binti Abdul Rahman', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-1b', year: 'Tahun 1', name: '1 Bestari', teacherName: 'Cikgu Noraini binti Yusof', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-1c', year: 'Tahun 1', name: '1 Cemerlang', teacherName: 'Cikgu Ahmad Ridzwan', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-1a', year: 'Tahun 1', name: '1 Amanah', teacherName: 'Ustazah Siti Hajar', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-2b', year: 'Tahun 2', name: '2 Bestari', teacherName: 'Cikgu Fauziah binti Hamid', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-2c', year: 'Tahun 2', name: '2 Cemerlang', teacherName: 'Cikgu Roslan bin Daud', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-3b', year: 'Tahun 3', name: '3 Bestari', teacherName: 'Cikgu Maryam binti Omar', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-3c', year: 'Tahun 3', name: '3 Cemerlang', teacherName: 'Cikgu Zulkifli bin Kassim', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-4b', year: 'Tahun 4', name: '4 Bestari', teacherName: 'Cikgu Hasnah binti Idris', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-5b', year: 'Tahun 5', name: '5 Bestari', teacherName: 'Cikgu Khairul Nizam', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-6b', year: 'Tahun 6', name: '6 Bestari', teacherName: 'Cikgu Azman bin Sulaiman', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
  { id: 'cls-6c', year: 'Tahun 6', name: '6 Cemerlang', teacherName: 'Cikgu Suraya binti Mansor', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
];

const INITIAL_PACKAGES: PhotoPackage[] = [
  {
    id: 'pkg-a',
    code: 'PAKEJ A',
    name: 'Gambar Formal Kelas Saiz 5R',
    price: 7,
    description: '1 keping cetakan foto rasmi gaya formal bersama guru kelas dan murid-murid bersaiz 5R (5x7 inci). Lengkap dengan reka bentuk template rasmi SKTSP.',
    contents: [
      '1x Cetakan Gambar Formal Kelas Saiz 5R (5x7 inci)',
      'Reka Bentuk Template Rasmi Sekolah SKTSP',
      'Kemasan Kertas Foto Studio Berkualiti Makmal',
      'Hanya Cetakan Gambar Sahaja',
    ],
    isActive: true,
    isPopular: false,
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'pkg-b',
    code: 'PAKEJ B',
    name: 'Gambar Freestyle Kelas Saiz 5R',
    price: 7,
    description: '1 keping cetakan foto gaya santai / freestyle bersama rakan sekelas dan guru kelas bersaiz 5R (5x7 inci). Lengkap dengan reka bentuk template ceria SKTSP.',
    contents: [
      '1x Cetakan Gambar Freestyle Kelas Saiz 5R (5x7 inci)',
      'Reka Bentuk Template Eksklusif & Ceria SKTSP',
      'Kemasan Kertas Foto Studio Berkualiti Makmal',
      'Hanya Cetakan Gambar Sahaja',
    ],
    isActive: true,
    isPopular: false,
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'pkg-c',
    code: 'PAKEJ C',
    name: 'Gambar Formal + Freestyle (Kombo 5R)',
    price: 12,
    originalPrice: 14,
    description: 'Set kombo lengkap 2 keping: 1x Gambar Formal Kelas Saiz 5R dan 1x Gambar Freestyle Kelas Saiz 5R. Kedua-dua gambar dilengkapi template rasmi sekolah SKTSP dengan penjimatan harga istimewa.',
    contents: [
      '1x Cetakan Gambar Formal Kelas Saiz 5R (Template Rasmi)',
      '1x Cetakan Gambar Freestyle Kelas Saiz 5R (Template Ceria)',
      'Diskaun Jimat RM2.00 (Harga Asal RM14.00 ➔ Tawaran RM12.00)',
      'Hanya Cetakan Gambar Sahaja (2 Keping Foto 5R)',
    ],
    isActive: true,
    isPopular: true,
    createdAt: '2026-01-05T08:00:00Z',
  },
];

const INITIAL_STUDENTS: Student[] = [];

// Sample students reserved strictly for demo when admin explicitly resets sample data
export const SAMPLE_STUDENTS: Student[] = [
  {
    id: 'std-001',
    studentNumber: 'TSP26001',
    fullName: 'NUR AISYAH BINTI MUHAMMAD',
    classId: 'cls-1b',
    className: '1 Bestari',
    year: 'Tahun 1',
    gender: 'Perempuan',
    parentName: 'Muhammad bin Abdullah',
    parentPhone: '012-7654321',
    parentEmail: 'muhammad.abd@gmail.com',
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'std-002',
    studentNumber: 'TSP26002',
    fullName: 'ADAM RAYYAN BIN KHAIRUL',
    classId: 'cls-1b',
    className: '1 Bestari',
    year: 'Tahun 1',
    gender: 'Lelaki',
    parentName: 'Khairul Nizam bin Othman',
    parentPhone: '019-8765432',
    parentEmail: 'khairul.n@yahoo.com',
    createdAt: '2026-02-01T10:15:00Z',
  },
  {
    id: 'std-003',
    studentNumber: 'TSP26003',
    fullName: 'FARIS HAZIQ BIN AZLAN',
    classId: 'cls-2b',
    className: '2 Bestari',
    year: 'Tahun 2',
    gender: 'Lelaki',
    parentName: 'Azlan bin Sulaiman',
    parentPhone: '013-7123456',
    createdAt: '2026-02-02T09:30:00Z',
  },
  {
    id: 'std-004',
    studentNumber: 'TSP26004',
    fullName: 'QISTINA ZAHRA BINTI SHAHROL',
    classId: 'cls-2c',
    className: '2 Cemerlang',
    year: 'Tahun 2',
    gender: 'Perempuan',
    parentName: 'Shahrol bin Ramli',
    parentPhone: '017-6549870',
    parentEmail: 'shahrol.ramli@gmail.com',
    createdAt: '2026-02-02T11:00:00Z',
  },
  {
    id: 'std-005',
    studentNumber: 'TSP26005',
    fullName: 'MUHAMMAD DANISH BIN IMRAN',
    classId: 'cls-3b',
    className: '3 Bestari',
    year: 'Tahun 3',
    gender: 'Lelaki',
    parentName: 'Imran bin Jaafar',
    parentPhone: '018-9988776',
    createdAt: '2026-02-03T14:20:00Z',
  },
  {
    id: 'std-006',
    studentNumber: 'TSP26006',
    fullName: 'SITI SARAH BINTI HISHAMUDDIN',
    classId: 'cls-4b',
    className: '4 Bestari',
    year: 'Tahun 4',
    gender: 'Perempuan',
    parentName: 'Hishamuddin bin Saleh',
    parentPhone: '011-23456789',
    createdAt: '2026-02-04T08:45:00Z',
  },
  {
    id: 'std-007',
    studentNumber: 'TSP26007',
    fullName: 'AMIRUL ZAFRAN BIN ZULKIFLI',
    classId: 'cls-5b',
    className: '5 Bestari',
    year: 'Tahun 5',
    gender: 'Lelaki',
    parentName: 'Zulkifli bin Hashim',
    parentPhone: '012-3344556',
    createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'std-008',
    studentNumber: 'TSP26008',
    fullName: 'NUR INSYIRAH BINTI FARID',
    classId: 'cls-6b',
    className: '6 Bestari',
    year: 'Tahun 6',
    gender: 'Perempuan',
    parentName: 'Farid bin Kamaruddin',
    parentPhone: '016-7890123',
    parentEmail: 'farid.k@hotmail.com',
    createdAt: '2026-02-06T15:10:00Z',
  },
  {
    id: 'std-009',
    studentNumber: 'TSP26009',
    fullName: 'HARITH ISKANDAR BIN SHAHRUL',
    classId: 'cls-6b',
    className: '6 Bestari',
    year: 'Tahun 6',
    gender: 'Lelaki',
    parentName: 'Shahrul bin Latif',
    parentPhone: '019-3214567',
    createdAt: '2026-02-06T16:00:00Z',
  },
  {
    id: 'std-010',
    studentNumber: 'TSP26010',
    fullName: 'NUR DAMIA BATRISYIA BINTI RAZAK',
    classId: 'cls-6c',
    className: '6 Cemerlang',
    year: 'Tahun 6',
    gender: 'Perempuan',
    parentName: 'Abdul Razak bin Bakar',
    parentPhone: '014-5566778',
    createdAt: '2026-02-07T09:00:00Z',
  },
];

const INITIAL_ORDERS: Order[] = [];

// Sample orders reserved strictly for demo when admin explicitly resets sample data
export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'STSP-2026-00001',
    studentId: 'std-001',
    studentName: 'NUR AISYAH BINTI MUHAMMAD',
    studentNumber: 'TSP26001',
    classId: 'cls-1b',
    className: '1 Bestari',
    year: 'Tahun 1',
    parentName: 'Muhammad bin Abdullah',
    parentPhone: '012-7654321',
    parentEmail: 'muhammad.abd@gmail.com',
    packageId: 'pkg-c',
    packageNameSnapshot: 'PAKEJ C (Gambar Formal + Freestyle - Kombo 5R)',
    packagePriceSnapshot: 12,
    quantity: 1,
    totalAmount: 12,
    orderStatus: 'Dalam Proses Cetakan',
    paymentStatus: 'Approved',
    paymentMethod: 'Bank Transfer',
    paymentProofUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f1f5f9"/><text x="200" y="90" font-family="sans-serif" font-size="16" font-weight="bold" fill="%231e293b" text-anchor="middle">RESIT BAYARAN MAYBANK2U</text><text x="200" y="120" font-family="sans-serif" font-size="14" fill="%23475569" text-anchor="middle">RM 12.00 - LULUS (MBB782910)</text></svg>',
    paymentProofFileName: 'resit_maybank_nuraisyah.png',
    paymentDate: '2026-02-15T11:30:00Z',
    paymentReference: 'MBB782910',
    adminNotes: 'Resit disahkan oleh Puan Noraini. Pakej Kombo Formal + Freestyle.',
    createdAt: '2026-02-15T11:00:00Z',
    updatedAt: '2026-02-15T14:00:00Z',
  },
  {
    id: 'ord-002',
    orderNumber: 'STSP-2026-00002',
    studentId: 'std-002',
    studentName: 'ADAM RAYYAN BIN KHAIRUL',
    studentNumber: 'TSP26002',
    classId: 'cls-1b',
    className: '1 Bestari',
    year: 'Tahun 1',
    parentName: 'Khairul Nizam bin Othman',
    parentPhone: '019-8765432',
    parentEmail: 'khairul.n@yahoo.com',
    packageId: 'pkg-c',
    packageNameSnapshot: 'PAKEJ C (Gambar Formal + Freestyle - Kombo 5R)',
    packagePriceSnapshot: 12,
    quantity: 1,
    totalAmount: 12,
    orderStatus: 'Bayaran Disahkan',
    paymentStatus: 'Approved',
    paymentMethod: 'Bank Transfer',
    paymentProofUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23f8fafc"/><text x="200" y="90" font-family="sans-serif" font-size="16" font-weight="bold" fill="%231e293b" text-anchor="middle">RESIT DUITNOW TRANSFER</text><text x="200" y="120" font-family="sans-serif" font-size="14" fill="%23475569" text-anchor="middle">RM 12.00 - REF: DN99238102</text></svg>',
    paymentProofFileName: 'duitnow_adam.png',
    paymentDate: '2026-02-16T09:12:00Z',
    paymentReference: 'DN99238102',
    createdAt: '2026-02-16T09:00:00Z',
    updatedAt: '2026-02-16T09:30:00Z',
  },
  {
    id: 'ord-003',
    orderNumber: 'STSP-2026-00003',
    studentId: 'std-003',
    studentName: 'FARIS HAZIQ BIN AZLAN',
    classId: 'cls-2b',
    className: '2 Bestari',
    year: 'Tahun 2',
    parentName: 'Azlan bin Sulaiman',
    parentPhone: '013-7123456',
    packageId: 'pkg-a',
    packageNameSnapshot: 'PAKEJ A (Gambar Formal Kelas Saiz 5R)',
    packagePriceSnapshot: 7,
    quantity: 1,
    totalAmount: 7,
    orderStatus: 'Menunggu Pengesahan Bayaran',
    paymentStatus: 'Under Review',
    paymentMethod: 'Bank Transfer',
    paymentProofUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23fffbeb"/><text x="200" y="90" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23b45309" text-anchor="middle">SLIP TRANSAKSI PERBANKAN</text><text x="200" y="120" font-family="sans-serif" font-size="14" fill="%2378350f" text-anchor="middle">RM 7.00 - CIMB CLICKS REF 330192</text></svg>',
    paymentProofFileName: 'cimb_resit_faris.png',
    paymentDate: '2026-02-18T16:45:00Z',
    paymentReference: '330192',
    createdAt: '2026-02-18T16:40:00Z',
    updatedAt: '2026-02-18T16:45:00Z',
  },
  {
    id: 'ord-004',
    orderNumber: 'STSP-2026-00004',
    studentId: 'std-008',
    studentName: 'NUR INSYIRAH BINTI FARID',
    studentNumber: 'TSP26008',
    classId: 'cls-6b',
    className: '6 Bestari',
    year: 'Tahun 6',
    parentName: 'Farid bin Kamaruddin',
    parentPhone: '016-7890123',
    parentEmail: 'farid.k@hotmail.com',
    packageId: 'pkg-c',
    packageNameSnapshot: 'PAKEJ C (Gambar Formal + Freestyle - Kombo 5R)',
    packagePriceSnapshot: 12,
    quantity: 1,
    totalAmount: 12,
    orderStatus: 'Sedia Diambil',
    paymentStatus: 'Approved',
    paymentMethod: 'Bank Transfer',
    paymentProofFileName: 'resit_bank_islam_insyirah.jpg',
    paymentDate: '2026-02-10T14:00:00Z',
    paymentReference: 'BIMB88201',
    createdAt: '2026-02-10T13:30:00Z',
    updatedAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'ord-005',
    orderNumber: 'STSP-2026-00005',
    studentId: 'std-005',
    studentName: 'MUHAMMAD DANISH BIN IMRAN',
    classId: 'cls-3b',
    className: '3 Bestari',
    year: 'Tahun 3',
    parentName: 'Imran bin Jaafar',
    parentPhone: '018-9988776',
    packageId: 'pkg-b',
    packageNameSnapshot: 'PAKEJ B (Gambar Freestyle Kelas Saiz 5R)',
    packagePriceSnapshot: 7,
    quantity: 1,
    totalAmount: 7,
    orderStatus: 'Menunggu Pembayaran',
    paymentStatus: 'Pending',
    paymentMethod: 'Bank Transfer',
    createdAt: '2026-02-22T08:00:00Z',
    updatedAt: '2026-02-22T08:00:00Z',
  },
];

const INITIAL_PHOTOS: StudentPhoto[] = [];

// Sample photos reserved strictly for demo when admin explicitly resets sample data
export const SAMPLE_PHOTOS: StudentPhoto[] = [
  {
    id: 'pho-001',
    studentId: 'std-001',
    studentName: 'NUR AISYAH BINTI MUHAMMAD',
    classId: 'cls-1b',
    className: '1 Bestari',
    photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23163B65"/><rect x="20" y="20" width="360" height="260" fill="%23e2e8f0" rx="6"/><circle cx="120" cy="110" r="28" fill="%2394a3b8"/><circle cx="200" cy="100" r="32" fill="%23E6B85C"/><circle cx="280" cy="110" r="28" fill="%2394a3b8"/><rect x="60" y="160" width="280" height="70" fill="%23163B65" rx="8"/><text x="200" y="260" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23163B65" text-anchor="middle">FOTO KELAS 1 BESTARI - SESI 2026</text></svg>',
    photoType: 'Kelas',
    uploadedAt: '2026-02-14T09:00:00Z',
  },
  {
    id: 'pho-002',
    studentId: 'std-002',
    studentName: 'ADAM RAYYAN BIN KHAIRUL',
    classId: 'cls-1b',
    className: '1 Bestari',
    photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23163B65"/><rect x="20" y="20" width="360" height="260" fill="%23e2e8f0" rx="6"/><circle cx="120" cy="110" r="28" fill="%2394a3b8"/><circle cx="200" cy="100" r="32" fill="%23E6B85C"/><circle cx="280" cy="110" r="28" fill="%2394a3b8"/><rect x="60" y="160" width="280" height="70" fill="%23163B65" rx="8"/><text x="200" y="260" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23163B65" text-anchor="middle">FOTO KELAS 1 BESTARI (BINAAN RASMI)</text></svg>',
    photoType: 'Kelas',
    uploadedAt: '2026-02-14T09:15:00Z',
  },
];

export function generateClassPhotoSvg(
  className: string,
  year: string,
  type: 'Formal' | 'Freestyle',
  teacherName: string
): string {
  const isFormal = type === 'Formal';
  const primaryBg = isFormal ? '%23163B65' : '%230284c7';
  const secondaryBg = isFormal ? '%230A1D33' : '%230369a1';
  const accentGold = '%23E6B85C';
  const typeBadgeText = isFormal ? 'FOTO FORMAL KELAS' : 'FOTO FREESTYLE / AKSI SANTAI';
  const typeBadgeBg = isFormal ? '%23E6B85C' : '%23f59e0b';
  const typeBadgeTextColor = '%23163B65';

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${primaryBg}"/><stop offset="100%" stop-color="${secondaryBg}"/></linearGradient><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23ffffff" stroke-width="0.5" stroke-opacity="0.08"/></pattern></defs><rect width="800" height="600" fill="url(%23bg)"/><rect width="800" height="600" fill="url(%23grid)"/><rect x="24" y="24" width="752" height="552" fill="none" stroke="${accentGold}" stroke-width="3" rx="8"/><rect x="32" y="32" width="736" height="536" fill="none" stroke="%23ffffff" stroke-width="1" stroke-opacity="0.3" rx="6"/><rect x="44" y="44" width="712" height="68" rx="8" fill="%23ffffff" fill-opacity="0.08"/><text x="400" y="72" font-family="sans-serif" font-size="14" font-weight="900" fill="${accentGold}" text-anchor="middle" letter-spacing="2">SK TAMAN SRI PULAI · KANGKAR PULAI, JOHOR</text><text x="400" y="96" font-family="sans-serif" font-size="20" font-weight="900" fill="%23ffffff" text-anchor="middle">SESI FOTOGRAFI KELAS 2026</text><rect x="60" y="130" width="680" height="340" rx="12" fill="%23ffffff" fill-opacity="0.04" stroke="%23ffffff" stroke-width="1" stroke-opacity="0.15"/><g transform="translate(400, 240)"><circle cx="0" cy="-20" r="38" fill="${accentGold}"/><path d="M -45 50 C -45 0, 45 0, 45 50 Z" fill="${accentGold}" fill-opacity="0.9"/><text x="0" y="70" font-family="sans-serif" font-size="12" font-weight="800" fill="%23ffffff" text-anchor="middle">GURU KELAS</text><text x="0" y="86" font-family="sans-serif" font-size="11" font-weight="500" fill="%23cbd5e1" text-anchor="middle">${teacherName}</text></g><g fill="%2394a3b8" fill-opacity="0.85"><circle cx="160" cy="220" r="26"/><path d="M 125 270 C 125 235, 195 235, 195 270 Z"/><circle cx="260" cy="220" r="26"/><path d="M 225 270 C 225 235, 295 235, 295 270 Z"/><circle cx="540" cy="220" r="26"/><path d="M 505 270 C 505 235, 575 235, 575 270 Z"/><circle cx="640" cy="220" r="26"/><path d="M 605 270 C 605 235, 675 235, 675 270 Z"/><circle cx="110" cy="340" r="24"/><path d="M 80 385 C 80 350, 140 350, 140 385 Z"/><circle cx="200" cy="340" r="24"/><path d="M 170 385 C 170 350, 230 350, 230 385 Z"/><circle cx="290" cy="340" r="24"/><path d="M 260 385 C 260 350, 320 350, 320 385 Z"/><circle cx="380" cy="360" r="24"/><path d="M 350 405 C 350 370, 410 370, 410 405 Z"/><circle cx="470" cy="360" r="24"/><path d="M 440 405 C 440 370, 500 370, 500 405 Z"/><circle cx="560" cy="340" r="24"/><path d="M 530 385 C 530 350, 590 350, 590 385 Z"/><circle cx="650" cy="340" r="24"/><path d="M 620 385 C 620 350, 680 350, 680 385 Z"/></g><g transform="translate(400, 300) rotate(-18)"><rect x="-260" y="-30" width="520" height="60" rx="8" fill="%230f172a" fill-opacity="0.3" stroke="%23ffffff" stroke-width="1.5" stroke-opacity="0.3"/><text x="0" y="9" font-family="sans-serif" font-size="22" font-weight="900" fill="%23ffffff" fill-opacity="0.65" text-anchor="middle" letter-spacing="4">CONTOH WATERMARK PREVIEW</text></g><rect x="44" y="490" width="712" height="74" rx="8" fill="%23ffffff" fill-opacity="0.95"/><text x="64" y="522" font-family="sans-serif" font-size="20" font-weight="900" fill="%23163B65">KELAS ${className.toUpperCase()}</text><text x="64" y="544" font-family="sans-serif" font-size="12" font-weight="700" fill="%23475569">${year.toUpperCase()} · GURU KELAS: ${teacherName.toUpperCase()}</text><rect x="580" y="508" width="160" height="38" rx="6" fill="${typeBadgeBg}"/><text x="660" y="532" font-family="sans-serif" font-size="11" font-weight="900" fill="${typeBadgeTextColor}" text-anchor="middle">${typeBadgeText}</text></svg>`;
}

const INITIAL_CLASS_PHOTOS: ClassPhoto[] = [
  {
    id: 'cpho-pra-1-formal',
    classId: 'cls-pra-1',
    className: 'Prasekolah Mawaddah',
    year: 'Prasekolah',
    title: 'Gambar Formal Prasekolah Mawaddah',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('Prasekolah Mawaddah', 'Prasekolah', 'Formal', 'Cikgu Nurul Huda binti Ismail'),
    teacherName: 'Cikgu Nurul Huda binti Ismail',
    uploadedAt: '2026-02-14T07:30:00Z',
  },
  {
    id: 'cpho-pra-1-freestyle',
    classId: 'cls-pra-1',
    className: 'Prasekolah Mawaddah',
    year: 'Prasekolah',
    title: 'Gambar Freestyle Prasekolah Mawaddah',
    photoType: 'Freestyle',
    photoUrl: generateClassPhotoSvg('Prasekolah Mawaddah', 'Prasekolah', 'Freestyle', 'Cikgu Nurul Huda binti Ismail'),
    teacherName: 'Cikgu Nurul Huda binti Ismail',
    uploadedAt: '2026-02-14T07:45:00Z',
  },
  {
    id: 'cpho-ppki-1-formal',
    classId: 'cls-ppki-1',
    className: 'PPKI Al-Fateh',
    year: 'Pendidikan Khas',
    title: 'Gambar Formal PPKI Al-Fateh',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('PPKI Al-Fateh', 'Pendidikan Khas', 'Formal', 'Cikgu Mohd Hafiz bin Zakaria'),
    teacherName: 'Cikgu Mohd Hafiz bin Zakaria',
    uploadedAt: '2026-02-14T07:50:00Z',
  },
  {
    id: 'cpho-ppki-1-freestyle',
    classId: 'cls-ppki-1',
    className: 'PPKI Al-Fateh',
    year: 'Pendidikan Khas',
    title: 'Gambar Freestyle PPKI Al-Fateh',
    photoType: 'Freestyle',
    photoUrl: generateClassPhotoSvg('PPKI Al-Fateh', 'Pendidikan Khas', 'Freestyle', 'Cikgu Mohd Hafiz bin Zakaria'),
    teacherName: 'Cikgu Mohd Hafiz bin Zakaria',
    uploadedAt: '2026-02-14T07:55:00Z',
  },
  {
    id: 'cpho-1b-formal',
    classId: 'cls-1b',
    className: '1 Bestari',
    year: 'Tahun 1',
    title: 'Gambar Formal Kelas 1 Bestari',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('1 Bestari', 'Tahun 1', 'Formal', 'Cikgu Noraini binti Yusof'),
    teacherName: 'Cikgu Noraini binti Yusof',
    uploadedAt: '2026-02-14T08:00:00Z',
  },
  {
    id: 'cpho-1b-freestyle',
    classId: 'cls-1b',
    className: '1 Bestari',
    year: 'Tahun 1',
    title: 'Gambar Freestyle Kelas 1 Bestari',
    photoType: 'Freestyle',
    photoUrl: generateClassPhotoSvg('1 Bestari', 'Tahun 1', 'Freestyle', 'Cikgu Noraini binti Yusof'),
    teacherName: 'Cikgu Noraini binti Yusof',
    uploadedAt: '2026-02-14T08:15:00Z',
  },
  {
    id: 'cpho-1c-formal',
    classId: 'cls-1c',
    className: '1 Cemerlang',
    year: 'Tahun 1',
    title: 'Gambar Formal Kelas 1 Cemerlang',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('1 Cemerlang', 'Tahun 1', 'Formal', 'Cikgu Ahmad Ridzwan'),
    teacherName: 'Cikgu Ahmad Ridzwan',
    uploadedAt: '2026-02-14T08:30:00Z',
  },
  {
    id: 'cpho-1c-freestyle',
    classId: 'cls-1c',
    className: '1 Cemerlang',
    year: 'Tahun 1',
    title: 'Gambar Freestyle Kelas 1 Cemerlang',
    photoType: 'Freestyle',
    photoUrl: generateClassPhotoSvg('1 Cemerlang', 'Tahun 1', 'Freestyle', 'Cikgu Ahmad Ridzwan'),
    teacherName: 'Cikgu Ahmad Ridzwan',
    uploadedAt: '2026-02-14T08:45:00Z',
  },
  {
    id: 'cpho-1a-formal',
    classId: 'cls-1a',
    className: '1 Amanah',
    year: 'Tahun 1',
    title: 'Gambar Formal Kelas 1 Amanah',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('1 Amanah', 'Tahun 1', 'Formal', 'Ustazah Siti Hajar'),
    teacherName: 'Ustazah Siti Hajar',
    uploadedAt: '2026-02-14T09:00:00Z',
  },
  {
    id: 'cpho-2b-formal',
    classId: 'cls-2b',
    className: '2 Bestari',
    year: 'Tahun 2',
    title: 'Gambar Formal Kelas 2 Bestari',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('2 Bestari', 'Tahun 2', 'Formal', 'Cikgu Fauziah binti Hamid'),
    teacherName: 'Cikgu Fauziah binti Hamid',
    uploadedAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'cpho-2b-freestyle',
    classId: 'cls-2b',
    className: '2 Bestari',
    year: 'Tahun 2',
    title: 'Gambar Freestyle Kelas 2 Bestari',
    photoType: 'Freestyle',
    photoUrl: generateClassPhotoSvg('2 Bestari', 'Tahun 2', 'Freestyle', 'Cikgu Fauziah binti Hamid'),
    teacherName: 'Cikgu Fauziah binti Hamid',
    uploadedAt: '2026-02-15T09:15:00Z',
  },
  {
    id: 'cpho-2c-formal',
    classId: 'cls-2c',
    className: '2 Cemerlang',
    year: 'Tahun 2',
    title: 'Gambar Formal Kelas 2 Cemerlang',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('2 Cemerlang', 'Tahun 2', 'Formal', 'Cikgu Roslan bin Daud'),
    teacherName: 'Cikgu Roslan bin Daud',
    uploadedAt: '2026-02-15T09:30:00Z',
  },
  {
    id: 'cpho-3b-formal',
    classId: 'cls-3b',
    className: '3 Bestari',
    year: 'Tahun 3',
    title: 'Gambar Formal Kelas 3 Bestari',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('3 Bestari', 'Tahun 3', 'Formal', 'Cikgu Maryam binti Omar'),
    teacherName: 'Cikgu Maryam binti Omar',
    uploadedAt: '2026-02-16T10:00:00Z',
  },
  {
    id: 'cpho-3b-freestyle',
    classId: 'cls-3b',
    className: '3 Bestari',
    year: 'Tahun 3',
    title: 'Gambar Freestyle Kelas 3 Bestari',
    photoType: 'Freestyle',
    photoUrl: generateClassPhotoSvg('3 Bestari', 'Tahun 3', 'Freestyle', 'Cikgu Maryam binti Omar'),
    teacherName: 'Cikgu Maryam binti Omar',
    uploadedAt: '2026-02-16T10:15:00Z',
  },
  {
    id: 'cpho-4b-formal',
    classId: 'cls-4b',
    className: '4 Bestari',
    year: 'Tahun 4',
    title: 'Gambar Formal Kelas 4 Bestari',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('4 Bestari', 'Tahun 4', 'Formal', 'Cikgu Hasnah binti Idris'),
    teacherName: 'Cikgu Hasnah binti Idris',
    uploadedAt: '2026-02-17T11:00:00Z',
  },
  {
    id: 'cpho-5b-formal',
    classId: 'cls-5b',
    className: '5 Bestari',
    year: 'Tahun 5',
    title: 'Gambar Formal Kelas 5 Bestari',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('5 Bestari', 'Tahun 5', 'Formal', 'Cikgu Khairul Nizam'),
    teacherName: 'Cikgu Khairul Nizam',
    uploadedAt: '2026-02-18T09:00:00Z',
  },
  {
    id: 'cpho-5b-freestyle',
    classId: 'cls-5b',
    className: '5 Bestari',
    year: 'Tahun 5',
    title: 'Gambar Freestyle Kelas 5 Bestari',
    photoType: 'Freestyle',
    photoUrl: generateClassPhotoSvg('5 Bestari', 'Tahun 5', 'Freestyle', 'Cikgu Khairul Nizam'),
    teacherName: 'Cikgu Khairul Nizam',
    uploadedAt: '2026-02-18T09:20:00Z',
  },
  {
    id: 'cpho-6b-formal',
    classId: 'cls-6b',
    className: '6 Bestari',
    year: 'Tahun 6',
    title: 'Gambar Formal Kelas 6 Bestari',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('6 Bestari', 'Tahun 6', 'Formal', 'Cikgu Azman bin Sulaiman'),
    teacherName: 'Cikgu Azman bin Sulaiman',
    uploadedAt: '2026-02-19T10:00:00Z',
  },
  {
    id: 'cpho-6b-freestyle',
    classId: 'cls-6b',
    className: '6 Bestari',
    year: 'Tahun 6',
    title: 'Gambar Freestyle Kelas 6 Bestari',
    photoType: 'Freestyle',
    photoUrl: generateClassPhotoSvg('6 Bestari', 'Tahun 6', 'Freestyle', 'Cikgu Azman bin Sulaiman'),
    teacherName: 'Cikgu Azman bin Sulaiman',
    uploadedAt: '2026-02-19T10:20:00Z',
  },
  {
    id: 'cpho-6c-formal',
    classId: 'cls-6c',
    className: '6 Cemerlang',
    year: 'Tahun 6',
    title: 'Gambar Formal Kelas 6 Cemerlang',
    photoType: 'Formal',
    photoUrl: generateClassPhotoSvg('6 Cemerlang', 'Tahun 6', 'Formal', 'Cikgu Suraya binti Mansor'),
    teacherName: 'Cikgu Suraya binti Mansor',
    uploadedAt: '2026-02-19T11:00:00Z',
  },
  {
    id: 'cpho-6c-freestyle',
    classId: 'cls-6c',
    className: '6 Cemerlang',
    year: 'Tahun 6',
    title: 'Gambar Freestyle Kelas 6 Cemerlang',
    photoType: 'Freestyle',
    photoUrl: generateClassPhotoSvg('6 Cemerlang', 'Tahun 6', 'Freestyle', 'Cikgu Suraya binti Mansor'),
    teacherName: 'Cikgu Suraya binti Mansor',
    uploadedAt: '2026-02-19T11:20:00Z',
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-02-01T08:00:00Z',
    userEmail: 'admin@sktsp.edu.my',
    action: 'Inisialisasi Sistem',
    details: 'Sistem Tempahan Gambar Murid SK Taman Sri Pulai diaktifkan untuk Sesi 2026.',
  },
  {
    id: 'log-2',
    timestamp: '2026-02-15T14:00:00Z',
    userEmail: 'admin@sktsp.edu.my',
    action: 'Pengesahan Bayaran',
    details: 'Pengesahan bayaran bagi Tempahan STSP-2026-00001 (RM25.00).',
  },
];

// Helper to safely read from localStorage with fallback
function getJson<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom event for cross-component re-render
    window.dispatchEvent(new CustomEvent('stsp_storage_updated', { detail: { key } }));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// Data Store API
export const StorageService = {
  // --- SETTINGS ---
  getSettings(): SystemSettings {
    const sett = getJson<SystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    let changed = false;
    let updated = { ...sett };

    if (sett.homepageTitle && sett.homepageTitle.includes('Gambar Murid')) {
      updated.homepageTitle = 'Tempahan Gambar Kelas Sesi 2026';
      updated.announcementNotice =
        'Sesi fotografi gambar kelas murid bagi tahun 2026 sedang berlangsung. Ibu bapa dan penjaga dinasihatkan membuat tempahan gambar kelas anak masing-masing sebelum tarikh tutup rasmi.';
      changed = true;
    }

    if (!updated.qrCodeUrl) {
      updated.qrCodeUrl = DEFAULT_DUITNOW_QR;
      changed = true;
    }

    if (changed) {
      setJson(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    }
    return sett;
  },
  updateSettings(settings: Partial<SystemSettings>): SystemSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    setJson(STORAGE_KEYS.SETTINGS, updated);
    this.addAuditLog('admin@sktsp.edu.my', 'Kemaskini Tetapan', 'Tetapan sistem sekolah dikemaskini.');
    return updated;
  },

  // --- CLASSES ---
  getClasses(): ClassItem[] {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CLASSES) : null;
    if (raw === null) return INITIAL_CLASSES;
    try {
      const parsed = JSON.parse(raw) as ClassItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        const hasPra = parsed.some((c) => c.year === 'Prasekolah');
        const hasPPKI = parsed.some((c) => c.year === 'Pendidikan Khas');
        if (!hasPra || !hasPPKI) {
          const additions: ClassItem[] = [];
          if (!hasPra) {
            additions.push(
              { id: 'cls-pra-1', year: 'Prasekolah', name: 'Prasekolah Mawaddah', teacherName: 'Cikgu Nurul Huda binti Ismail', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
              { id: 'cls-pra-2', year: 'Prasekolah', name: 'Prasekolah Sakinah', teacherName: 'Cikgu Siti Zaleha binti Mansur', isActive: true, createdAt: '2026-01-10T08:00:00Z' }
            );
          }
          if (!hasPPKI) {
            additions.push(
              { id: 'cls-ppki-1', year: 'Pendidikan Khas', name: 'PPKI Al-Fateh', teacherName: 'Cikgu Mohd Hafiz bin Zakaria', isActive: true, createdAt: '2026-01-10T08:00:00Z' },
              { id: 'cls-ppki-2', year: 'Pendidikan Khas', name: 'PPKI An-Nur', teacherName: 'Cikgu Faizah binti Abdul Rahman', isActive: true, createdAt: '2026-01-10T08:00:00Z' }
            );
          }
          const merged = [...additions, ...parsed];
          setJson(STORAGE_KEYS.CLASSES, merged);
          return merged;
        }
      }
      return parsed;
    } catch {
      return INITIAL_CLASSES;
    }
  },
  getActiveClasses(): ClassItem[] {
    return this.getClasses().filter((c) => c.isActive);
  },
  addClass(classItem: Omit<ClassItem, 'id' | 'createdAt'>): ClassItem {
    const classes = this.getClasses();
    const newClass: ClassItem = {
      ...classItem,
      id: `cls-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    classes.push(newClass);
    setJson(STORAGE_KEYS.CLASSES, classes);
    this.addAuditLog('admin@sktsp.edu.my', 'Tambah Kelas', `Kelas baharu ditambah: ${newClass.name}`);
    return newClass;
  },
  updateClass(id: string, updates: Partial<ClassItem>): ClassItem | null {
    const classes = this.getClasses();
    const index = classes.findIndex((c) => c.id === id);
    if (index === -1) return null;
    classes[index] = { ...classes[index], ...updates };
    setJson(STORAGE_KEYS.CLASSES, classes);
    this.addAuditLog('admin@sktsp.edu.my', 'Kemaskini Kelas', `Kelas ${classes[index].name} dikemaskini.`);
    return classes[index];
  },
  deleteClass(id: string): boolean {
    const classes = this.getClasses();
    const target = classes.find((c) => c.id === id);
    if (!target) return false;
    const filtered = classes.filter((c) => c.id !== id);
    setJson(STORAGE_KEYS.CLASSES, filtered);
    this.addAuditLog('admin@sktsp.edu.my', 'Padam Kelas', `Kelas dipadam: ${target.name}`);
    return true;
  },
  bulkDeleteClasses(ids: string[]): number {
    const classes = this.getClasses();
    const idSet = new Set(ids);
    const remaining = classes.filter((c) => !idSet.has(c.id));
    const deletedCount = classes.length - remaining.length;
    if (deletedCount > 0) {
      setJson(STORAGE_KEYS.CLASSES, remaining);
      this.addAuditLog('admin@sktsp.edu.my', 'Padam Kelas Pukal', `${deletedCount} kelas telah dipadam secara pilihan.`);
    }
    return deletedCount;
  },
  deleteAllClasses(): boolean {
    const classes = this.getClasses();
    const count = classes.length;
    setJson(STORAGE_KEYS.CLASSES, []);
    this.addAuditLog('admin@sktsp.edu.my', 'Padam Semua Kelas', `Semua ${count} kelas telah dipadam serentak.`);
    return true;
  },
  bulkAddClasses(newClasses: Array<Omit<ClassItem, 'id' | 'createdAt'>>): { count: number; updated: number; errors: string[] } {
    const errors: string[] = [];
    const classes = this.getClasses();
    let count = 0;
    let updated = 0;

    newClasses.forEach((cls, idx) => {
      const cleanName = cls.name.trim();
      if (!cleanName) {
        errors.push(`Baris ${idx + 1}: Nama kelas tidak sah.`);
        return;
      }

      const existingIndex = classes.findIndex(
        (c) => c.name.toLowerCase() === cleanName.toLowerCase()
      );

      if (existingIndex !== -1) {
        // Update existing class teacher / year / status if provided
        classes[existingIndex] = {
          ...classes[existingIndex],
          year: cls.year || classes[existingIndex].year,
          teacherName: cls.teacherName || classes[existingIndex].teacherName,
          isActive: cls.isActive !== undefined ? cls.isActive : classes[existingIndex].isActive,
        };
        updated++;
      } else {
        // Add new class
        const created: ClassItem = {
          ...cls,
          id: `cls-${Date.now()}-${idx}`,
          createdAt: new Date().toISOString(),
        };
        classes.push(created);
        count++;
      }
    });

    if (count > 0 || updated > 0) {
      setJson(STORAGE_KEYS.CLASSES, classes);
      this.addAuditLog(
        'admin@sktsp.edu.my',
        'Import Kelas Pukal',
        `Import CSV kelas: ${count} ditambah baharu, ${updated} dikemaskini.`
      );
    }

    return { count, updated, errors };
  },

  // --- PACKAGES ---
  getPackages(): PhotoPackage[] {
    const pkgs = getJson<PhotoPackage[]>(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
    // Auto-migrate if stored packages are not the 3 new packages (Pakej A RM7, Pakej B RM7, Pakej C RM12)
    const needsMigration =
      pkgs.length !== 3 ||
      pkgs.some((p) => p.price > 12 || p.code === 'PAKEJ PREMIUM' || (!p.name.toLowerCase().includes('freestyle') && !p.name.toLowerCase().includes('formal')));
    if (needsMigration) {
      setJson(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
      return INITIAL_PACKAGES;
    }
    return pkgs;
  },
  getActivePackages(): PhotoPackage[] {
    return this.getPackages().filter((p) => p.isActive);
  },
  addPackage(pkg: Omit<PhotoPackage, 'id' | 'createdAt'>): PhotoPackage {
    const packages = this.getPackages();
    const newPkg: PhotoPackage = {
      ...pkg,
      id: `pkg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    packages.push(newPkg);
    setJson(STORAGE_KEYS.PACKAGES, packages);
    this.addAuditLog('admin@sktsp.edu.my', 'Tambah Pakej', `Pakej ditambah: ${newPkg.name} (RM${newPkg.price})`);
    return newPkg;
  },
  updatePackage(id: string, updates: Partial<PhotoPackage>): PhotoPackage | null {
    const packages = this.getPackages();
    const index = packages.findIndex((p) => p.id === id);
    if (index === -1) return null;
    packages[index] = { ...packages[index], ...updates };
    setJson(STORAGE_KEYS.PACKAGES, packages);
    this.addAuditLog('admin@sktsp.edu.my', 'Kemaskini Pakej', `Pakej ${packages[index].name} dikemaskini.`);
    return packages[index];
  },
  deletePackage(id: string): boolean {
    const packages = this.getPackages();
    const target = packages.find((p) => p.id === id);
    if (!target) return false;
    const filtered = packages.filter((p) => p.id !== id);
    setJson(STORAGE_KEYS.PACKAGES, filtered);
    this.addAuditLog('admin@sktsp.edu.my', 'Padam Pakej', `Pakej dipadam: ${target.name}`);
    return true;
  },

  // --- STUDENTS ---
  getStudents(): Student[] {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.STUDENTS) : null;
    if (raw === null) return INITIAL_STUDENTS;
    try {
      return JSON.parse(raw) as Student[];
    } catch {
      return INITIAL_STUDENTS;
    }
  },
  getStudentById(id: string): Student | undefined {
    return this.getStudents().find((s) => s.id === id);
  },
  addStudent(student: Omit<Student, 'id' | 'createdAt'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...student,
      id: `std-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    students.push(newStudent);
    setJson(STORAGE_KEYS.STUDENTS, students);
    this.addAuditLog('admin@sktsp.edu.my', 'Tambah Murid', `Rekod murid ditambah: ${newStudent.fullName}`);
    return newStudent;
  },
  bulkAddStudents(newStudents: Array<Omit<Student, 'id' | 'createdAt'>>): { count: number; errors: string[] } {
    const errors: string[] = [];
    const students = this.getStudents();
    let count = 0;

    newStudents.forEach((st, idx) => {
      if (!st.fullName || !st.className) {
        errors.push(`Baris ${idx + 1}: Nama atau kelas murid tidak sah.`);
        return;
      }
      const created: Student = {
        ...st,
        id: `std-${Date.now()}-${idx}`,
        createdAt: new Date().toISOString(),
      };
      students.push(created);
      count++;
    });

    if (count > 0) {
      setJson(STORAGE_KEYS.STUDENTS, students);
      this.addAuditLog('admin@sktsp.edu.my', 'Import Murid Pukal', `Berjaya mengimport ${count} rekod murid.`);
    }

    return { count, errors };
  },
  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const students = this.getStudents();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) return null;
    students[index] = { ...students[index], ...updates };
    setJson(STORAGE_KEYS.STUDENTS, students);
    this.addAuditLog('admin@sktsp.edu.my', 'Kemaskini Murid', `Data murid ${students[index].fullName} dikemaskini.`);
    return students[index];
  },
  deleteStudent(id: string): boolean {
    const students = this.getStudents();
    const target = students.find((s) => s.id === id);
    if (!target) return false;
    const filtered = students.filter((s) => s.id !== id);
    setJson(STORAGE_KEYS.STUDENTS, filtered);
    this.addAuditLog('admin@sktsp.edu.my', 'Padam Murid', `Murid dipadam: ${target.fullName}`);
    return true;
  },

  // --- ORDERS ---
  getOrders(): Order[] {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ORDERS) : null;
    if (raw === null) return INITIAL_ORDERS;
    try {
      const ords = JSON.parse(raw) as Order[];
      return ords;
    } catch {
      return INITIAL_ORDERS;
    }
  },
  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  },
  getOrderByNumberAndPhone(orderNumber: string, phone: string): Order | undefined {
    const orders = this.getOrders();
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.replace(/[-+\s]/g, '');

    return orders.find((o) => {
      const matchNum = o.orderNumber.toUpperCase() === cleanNum;
      const orderCleanPhone = o.parentPhone.replace(/[-+\s]/g, '');
      const matchPhone = orderCleanPhone.endsWith(cleanPhone) || cleanPhone.endsWith(orderCleanPhone);
      return matchNum && matchPhone;
    });
  },
  generateOrderNumber(): string {
    const settings = this.getSettings();
    const year = settings.sessionYear || '2026';
    const counter = getJson<number>(STORAGE_KEYS.ORDER_COUNTER, 5) + 1;
    setJson(STORAGE_KEYS.ORDER_COUNTER, counter);
    const padded = String(counter).padStart(5, '0');
    return `STSP-${year}-${padded}`;
  },
  createOrder(data: {
    studentName: string;
    studentNumber?: string;
    classId: string;
    className: string;
    year: YearGrade;
    parentName: string;
    parentPhone: string;
    parentEmail?: string;
    packageId: string;
    packageName: string;
    packagePrice: number;
    paymentMethod: 'Bank Transfer' | 'Tunai / Manual';
    paymentProofUrl?: string;
    paymentProofFileName?: string;
  }): Order {
    const orders = this.getOrders();
    const orderNumber = this.generateOrderNumber();
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      studentName: data.studentName.trim().toUpperCase(),
      studentNumber: data.studentNumber?.trim(),
      classId: data.classId,
      className: data.className,
      year: data.year,
      parentName: data.parentName.trim(),
      parentPhone: data.parentPhone.trim(),
      parentEmail: data.parentEmail?.trim(),
      packageId: data.packageId,
      packageNameSnapshot: data.packageName,
      packagePriceSnapshot: data.packagePrice,
      quantity: 1,
      totalAmount: data.packagePrice,
      orderStatus: data.paymentProofUrl ? 'Menunggu Pengesahan Bayaran' : 'Menunggu Pembayaran',
      paymentStatus: data.paymentProofUrl ? 'Under Review' : 'Pending',
      paymentMethod: data.paymentMethod,
      paymentProofUrl: data.paymentProofUrl,
      paymentProofFileName: data.paymentProofFileName,
      paymentDate: data.paymentProofUrl ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    orders.unshift(newOrder);
    setJson(STORAGE_KEYS.ORDERS, orders);

    // Also auto-record student if not existing
    const students = this.getStudents();
    const cleanStdName = data.studentName.trim().toUpperCase();
    const existing = students.find((s) => s.fullName.toUpperCase() === cleanStdName && s.classId === data.classId);
    if (!existing) {
      this.addStudent({
        fullName: cleanStdName,
        studentNumber: data.studentNumber,
        classId: data.classId,
        className: data.className,
        year: data.year,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail,
      });
    }

    return newOrder;
  },
  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setJson(STORAGE_KEYS.ORDERS, orders);
    return orders[index];
  },
  updateOrderStatus(id: string, orderStatus: OrderStatus, notes?: string): Order | null {
    const order = this.getOrderById(id);
    if (!order) return null;
    const updates: Partial<Order> = { orderStatus };
    if (notes) updates.adminNotes = notes;
    const updated = this.updateOrder(id, updates);
    this.addAuditLog('admin@sktsp.edu.my', 'Tukar Status Tempahan', `Status ${order.orderNumber} ditukar kepada "${orderStatus}".`);
    return updated;
  },
  updatePaymentStatus(id: string, paymentStatus: PaymentStatus, reasonNotes?: string): Order | null {
    const order = this.getOrderById(id);
    if (!order) return null;

    let orderStatus: OrderStatus = order.orderStatus;
    if (paymentStatus === 'Approved') {
      orderStatus = 'Bayaran Disahkan';
    } else if (paymentStatus === 'Rejected') {
      orderStatus = 'Menunggu Pembayaran';
    }

    const updates: Partial<Order> = {
      paymentStatus,
      orderStatus,
      adminNotes: reasonNotes || order.adminNotes,
      paymentDate: paymentStatus === 'Approved' ? new Date().toISOString() : order.paymentDate,
    };

    const updated = this.updateOrder(id, updates);
    this.addAuditLog('admin@sktsp.edu.my', 'Pengesahan Pembayaran', `Pembayaran ${order.orderNumber} ditukar kepada status ${paymentStatus}.`);
    return updated;
  },
  deleteOrder(id: string): boolean {
    const orders = this.getOrders();
    const target = orders.find((o) => o.id === id);
    if (!target) return false;
    const filtered = orders.filter((o) => o.id !== id);
    setJson(STORAGE_KEYS.ORDERS, filtered);
    this.addAuditLog('admin@sktsp.edu.my', 'Padam Tempahan', `Tempahan ${target.orderNumber} telah dipadam.`);
    return true;
  },

  // --- PHOTOS ---
  getPhotos(): StudentPhoto[] {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.PHOTOS) : null;
    if (raw === null) return INITIAL_PHOTOS;
    try {
      return JSON.parse(raw) as StudentPhoto[];
    } catch {
      return INITIAL_PHOTOS;
    }
  },
  addPhoto(photo: Omit<StudentPhoto, 'id' | 'uploadedAt'>): StudentPhoto {
    const photos = this.getPhotos();
    const newPhoto: StudentPhoto = {
      ...photo,
      id: `pho-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    photos.push(newPhoto);
    setJson(STORAGE_KEYS.PHOTOS, photos);
    this.addAuditLog('admin@sktsp.edu.my', 'Muat Naik Gambar', `Gambar dimuat naik untuk ${newPhoto.studentName} (${newPhoto.className})`);
    return newPhoto;
  },
  deletePhoto(id: string): boolean {
    const photos = this.getPhotos();
    const filtered = photos.filter((p) => p.id !== id);
    setJson(STORAGE_KEYS.PHOTOS, filtered);
    return true;
  },

  // --- CLASS GALLERY PHOTOS (PUBLIC REVIEW) ---
  getClassPhotos(): ClassPhoto[] {
    const photos = getJson<ClassPhoto[]>(STORAGE_KEYS.CLASS_PHOTOS, INITIAL_CLASS_PHOTOS);
    if (!photos || photos.length === 0) {
      setJson(STORAGE_KEYS.CLASS_PHOTOS, INITIAL_CLASS_PHOTOS);
      return INITIAL_CLASS_PHOTOS;
    }
    return photos;
  },
  addClassPhoto(photo: Omit<ClassPhoto, 'id' | 'uploadedAt'>): ClassPhoto {
    const photos = this.getClassPhotos();
    const newPhoto: ClassPhoto = {
      ...photo,
      id: `cpho-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    photos.unshift(newPhoto);
    setJson(STORAGE_KEYS.CLASS_PHOTOS, photos);
    this.addAuditLog('admin@sktsp.edu.my', 'Muat Naik Gambar Galeri Kelas', `Foto dimuat naik untuk kelas ${newPhoto.className} (${newPhoto.photoType})`);
    return newPhoto;
  },
  updateClassPhoto(id: string, updates: Partial<ClassPhoto>): ClassPhoto | null {
    const photos = this.getClassPhotos();
    const index = photos.findIndex((p) => p.id === id);
    if (index === -1) return null;
    photos[index] = { ...photos[index], ...updates };
    setJson(STORAGE_KEYS.CLASS_PHOTOS, photos);
    this.addAuditLog('admin@sktsp.edu.my', 'Kemaskini Gambar Galeri Kelas', `Foto kelas ${photos[index].className} (${photos[index].photoType}) dikemaskini.`);
    return photos[index];
  },
  saveOrUpdateClassPhoto(photoData: Omit<ClassPhoto, 'id' | 'uploadedAt'> & { id?: string }): ClassPhoto {
    const photos = this.getClassPhotos();
    if (photoData.id) {
      const idx = photos.findIndex((p) => p.id === photoData.id);
      if (idx !== -1) {
        photos[idx] = {
          ...photos[idx],
          ...photoData,
          uploadedAt: new Date().toISOString(),
        };
        setJson(STORAGE_KEYS.CLASS_PHOTOS, photos);
        this.addAuditLog('admin@sktsp.edu.my', 'Kemaskini Gambar Kelas', `Foto kelas ${photoData.className} (${photoData.photoType}) dikemaskini.`);
        return photos[idx];
      }
    }
    // Check if duplicate for same class & type
    const dupIdx = photos.findIndex((p) => p.classId === photoData.classId && p.photoType === photoData.photoType);
    if (dupIdx !== -1) {
      photos[dupIdx] = {
        ...photos[dupIdx],
        ...photoData,
        uploadedAt: new Date().toISOString(),
      };
      setJson(STORAGE_KEYS.CLASS_PHOTOS, photos);
      this.addAuditLog('admin@sktsp.edu.my', 'Ganti Gambar Kelas', `Foto kelas ${photoData.className} (${photoData.photoType}) digantikan dengan imej baharu.`);
      return photos[dupIdx];
    }
    const newPhoto: ClassPhoto = {
      ...photoData,
      id: `cpho-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    photos.unshift(newPhoto);
    setJson(STORAGE_KEYS.CLASS_PHOTOS, photos);
    this.addAuditLog('admin@sktsp.edu.my', 'Muat Naik Gambar Galeri Kelas', `Foto baharu dimuat naik untuk kelas ${newPhoto.className} (${newPhoto.photoType})`);
    return newPhoto;
  },
  deleteClassPhoto(id: string): boolean {
    const photos = this.getClassPhotos();
    const target = photos.find((p) => p.id === id);
    if (!target) return false;
    const filtered = photos.filter((p) => p.id !== id);
    setJson(STORAGE_KEYS.CLASS_PHOTOS, filtered);
    this.addAuditLog('admin@sktsp.edu.my', 'Padam Gambar Galeri Kelas', `Foto kelas dipadam: ${target.className} (${target.photoType})`);
    return true;
  },

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLog[] {
    return getJson<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  addAuditLog(userEmail: string, action: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userEmail,
      action,
      details,
    };
    logs.unshift(newLog);
    // Keep max 100 logs
    if (logs.length > 100) logs.pop();
    setJson(STORAGE_KEYS.AUDIT_LOGS, logs);
  },

  // --- ADMIN AUTH ---
  getAdminSession(): AdminUser | null {
    return getJson<AdminUser | null>(STORAGE_KEYS.ADMIN_USER, null);
  },
  setAdminSession(user: AdminUser | null): void {
    setJson(STORAGE_KEYS.ADMIN_USER, user);
  },
  logout(): void {
    const current = this.getAdminSession();
    if (current) {
      this.addAuditLog(current.email, 'Admin Log Keluar', 'Pengguna telah log keluar dari sistem.');
    }
    this.setAdminSession(null);
  },

  // --- ADMIN CREDENTIALS ---
  getAdminCredentials(): { email: string; passwordHash: string } {
    return getJson(STORAGE_KEYS.ADMIN_CREDENTIALS, {
      email: 'admin@sktsp.edu.my',
      passwordHash: 'admin1234',
    });
  },
  updateAdminCredentials(email: string, passwordHash: string): void {
    setJson(STORAGE_KEYS.ADMIN_CREDENTIALS, {
      email: email.trim().toLowerCase(),
      passwordHash: passwordHash.trim(),
    });
    this.addAuditLog('admin@sktsp.edu.my', 'Tukar Kredensial Pentadbir', `Kredensial pentadbir dikemaskini (${email}).`);
  },

  // --- SYSTEM MAINTENANCE & PORTABILITY (NETLIFY / PRODUCTION) ---
  resetToSampleData(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_PACKAGES));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SAMPLE_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SAMPLE_ORDERS));
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(SAMPLE_PHOTOS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.ORDER_COUNTER, '5');
    window.dispatchEvent(new CustomEvent('stsp_storage_updated', { detail: { key: 'all' } }));
  },
  clearSampleData(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ORDER_COUNTER, '0');
    window.dispatchEvent(new CustomEvent('stsp_storage_updated', { detail: { key: 'cleared' } }));
    this.addAuditLog('admin@sktsp.edu.my', 'Pembersihan Data', 'Semua data contoh murid, tempahan dan gambar telah dipadamkan untuk kegunaan produksi sebenar.');
  },
  exportFullBackup(): string {
    const backupData = {
      version: '1.0',
      system: 'Sistem Tempahan Gambar Kelas SKTSP 2026',
      exportedAt: new Date().toISOString(),
      schoolName: 'SEKOLAH KEBANGSAAN TAMAN SRI PULAI',
      settings: this.getSettings(),
      classes: this.getClasses(),
      packages: this.getPackages(),
      students: this.getStudents(),
      orders: this.getOrders(),
      classPhotos: this.getClassPhotos(),
      photos: this.getPhotos(),
      adminCredentials: this.getAdminCredentials(),
    };
    return JSON.stringify(backupData, null, 2);
  },
  importFullBackup(jsonContent: string): { success: boolean; message: string; counts?: { classes: number; students: number; orders: number } } {
    try {
      const data = JSON.parse(jsonContent);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Format fail sandaran tidak sah atau rosak.' };
      }
      if (data.settings && typeof data.settings === 'object') setJson(STORAGE_KEYS.SETTINGS, data.settings);
      if (Array.isArray(data.classes)) setJson(STORAGE_KEYS.CLASSES, data.classes);
      if (Array.isArray(data.packages)) setJson(STORAGE_KEYS.PACKAGES, data.packages);
      if (Array.isArray(data.students)) setJson(STORAGE_KEYS.STUDENTS, data.students);
      if (Array.isArray(data.orders)) setJson(STORAGE_KEYS.ORDERS, data.orders);
      if (Array.isArray(data.classPhotos)) setJson(STORAGE_KEYS.CLASS_PHOTOS, data.classPhotos);
      if (Array.isArray(data.photos)) setJson(STORAGE_KEYS.PHOTOS, data.photos);
      if (data.adminCredentials && data.adminCredentials.email) setJson(STORAGE_KEYS.ADMIN_CREDENTIALS, data.adminCredentials);

      window.dispatchEvent(new CustomEvent('stsp_storage_updated', { detail: { key: 'all' } }));
      this.addAuditLog('admin@sktsp.edu.my', 'Pulihkan Sandaran Penuh', `Data sistem berjaya dipulihkan sepenuhnya daripada fail sandaran.`);
      return {
        success: true,
        message: 'Data sandaran berjaya dipulihkan sepenuhnya ke dalam sistem!',
        counts: {
          classes: Array.isArray(data.classes) ? data.classes.length : 0,
          students: Array.isArray(data.students) ? data.students.length : 0,
          orders: Array.isArray(data.orders) ? data.orders.length : 0,
        },
      };
    } catch (e: any) {
      return { success: false, message: `Ralat memproses fail sandaran: ${e.message}` };
    }
  },
};
