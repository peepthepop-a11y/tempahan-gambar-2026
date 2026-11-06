export type YearGrade = 'Tahun 1' | 'Tahun 2' | 'Tahun 3' | 'Tahun 4' | 'Tahun 5' | 'Tahun 6' | 'Prasekolah' | 'Pendidikan Khas';

export interface ClassItem {
  id: string;
  year: YearGrade;
  name: string; // e.g. "1 Bestari", "2 Cemerlang"
  teacherName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Student {
  id: string;
  studentNumber?: string; // Optional student matric / ID
  fullName: string;
  classId: string;
  className: string;
  year: YearGrade;
  gender?: 'Lelaki' | 'Perempuan';
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  createdAt: string;
}

export interface PhotoPackage {
  id: string;
  code: string; // e.g. "PKG-A", "PKG-B", "PKG-C", "PKG-PREMIUM"
  name: string; // e.g. "Pakej A (Individu Asas)"
  price: number;
  originalPrice?: number; // e.g. 14 for Pakej C before discount to 12
  description: string;
  contents: string[]; // List of items included
  imageUrl?: string;
  isActive: boolean;
  isPopular?: boolean;
  createdAt: string;
}

export type OrderStatus =
  | 'Menunggu Pembayaran'
  | 'Menunggu Pengesahan Bayaran'
  | 'Bayaran Disahkan'
  | 'Dalam Proses Cetakan'
  | 'Sedia Diambil'
  | 'Telah Diserahkan'
  | 'Dibatalkan';

export type PaymentStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Refunded';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "STSP-2026-00001"
  studentId?: string;
  studentName: string;
  studentNumber?: string;
  classId: string;
  className: string;
  year: YearGrade;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  packageId: string;
  packageNameSnapshot: string;
  packagePriceSnapshot: number;
  quantity: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'Bank Transfer' | 'Tunai / Manual';
  paymentProofUrl?: string;
  paymentProofFileName?: string;
  paymentDate?: string;
  paymentReference?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentPhoto {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  photoUrl: string;
  thumbnailUrl?: string;
  photoType: 'Individu' | 'Kelas' | 'Graduasi';
  uploadedAt: string;
}

export interface ClassPhoto {
  id: string;
  classId: string;
  className: string;
  year: YearGrade;
  title: string;
  photoType: 'Formal' | 'Freestyle';
  photoUrl: string;
  teacherName?: string;
  uploadedAt: string;
}

export interface SystemSettings {
  schoolName: string;
  schoolEmblemText: string;
  schoolTagline: string;
  sessionYear: string;
  homepageTitle: string;
  announcementNotice: string;
  isBookingOpen: boolean;
  bookingStartDate: string;
  bookingEndDate: string;
  bankName: string;
  bankAccountHolder: string;
  bankAccountNumber: string;
  qrCodeUrl?: string; // Data URL or URL for payment DuitNow/Bank QR Code
  paymentInstructions: string;
  whatsappNumber: string;
  contactEmail: string;
  schoolAddress: string;
  schoolPhone: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'Super Admin' | 'Guru Pengiring' | 'Fotografer';
  lastLogin?: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  details: string;
}
