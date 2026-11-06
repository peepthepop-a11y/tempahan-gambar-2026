import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  SystemSettings,
  ClassItem,
  PhotoPackage,
  Order,
  Student,
  ClassPhoto,
} from '../types';

// Default environment variables if configured
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(customUrl?: string, customKey?: string): SupabaseClient | null {
  const url = customUrl || envUrl || (typeof window !== 'undefined' ? localStorage.getItem('stsp_supabase_url') || '' : '');
  const key = customKey || envAnonKey || (typeof window !== 'undefined' ? localStorage.getItem('stsp_supabase_anon_key') || '' : '');

  if (!url || !key) {
    return null;
  }

  try {
    if (!clientInstance || customUrl || customKey) {
      clientInstance = createClient(url, key);
    }
    return clientInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const url = envUrl || (typeof window !== 'undefined' ? localStorage.getItem('stsp_supabase_url') || '' : '');
  const key = envAnonKey || (typeof window !== 'undefined' ? localStorage.getItem('stsp_supabase_anon_key') || '' : '');
  return Boolean(url && key);
}

// ==========================================
// SUPABASE CLOUD DATA ACCESS LAYER
// ==========================================

export const SupabaseCloud = {
  // --- FETCH ALL CLOUD DATA ---
  async fetchAll(): Promise<{
    settings?: SystemSettings;
    classes?: ClassItem[];
    packages?: PhotoPackage[];
    students?: Student[];
    orders?: Order[];
    classPhotos?: ClassPhoto[];
  } | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const results: any = {};

      // 1. Settings
      const { data: settData, error: settErr } = await supabase
        .from('system_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!settErr && settData) {
        results.settings = {
          schoolName: settData.school_name || 'SEKOLAH KEBANGSAAN TAMAN SRI PULAI',
          schoolEmblemText: settData.school_emblem_text || 'BERILMU BERAMAL BERBAKTI',
          schoolTagline: settData.school_tagline || '',
          sessionYear: settData.session_year || '2026',
          homepageTitle: settData.homepage_title || 'Tempahan Gambar Kelas Sesi 2026',
          announcementNotice: settData.announcement_notice || '',
          isBookingOpen: settData.is_booking_open ?? true,
          bookingStartDate: settData.booking_start_date || '2026-03-01',
          bookingEndDate: settData.booking_end_date || '2026-11-30',
          bankName: settData.bank_name || 'MAYBANK',
          bankAccountHolder: settData.bank_account_holder || 'PIBG SK TAMAN SRI PULAI',
          bankAccountNumber: settData.bank_account_number || '',
          qrCodeUrl: settData.qr_code_url || undefined,
          paymentInstructions: settData.payment_instructions || '',
          whatsappNumber: settData.whatsapp_number || '60197824150',
          contactEmail: settData.contact_email || 'sktamansripulai@moe.edu.my',
          schoolAddress: settData.school_address || '',
          schoolPhone: settData.school_phone || '',
        };
      }

      // 2. Classes
      const { data: clsData, error: clsErr } = await supabase
        .from('classes')
        .select('*')
        .order('name');

      if (!clsErr && Array.isArray(clsData) && clsData.length > 0) {
        results.classes = clsData.map((c: any) => ({
          id: c.id,
          year: c.year,
          name: c.name,
          teacherName: c.teacher_name || '',
          isActive: c.is_active ?? true,
          createdAt: c.created_at,
        }));
      }

      // 3. Packages
      const { data: pkgData, error: pkgErr } = await supabase
        .from('packages')
        .select('*')
        .order('price');

      if (!pkgErr && Array.isArray(pkgData) && pkgData.length > 0) {
        results.packages = pkgData.map((p: any) => ({
          id: p.id,
          code: p.code,
          name: p.name,
          price: Number(p.price),
          description: p.description || '',
          contents: Array.isArray(p.contents) ? p.contents : [],
          isActive: p.is_active ?? true,
          isPopular: p.is_popular ?? false,
          createdAt: p.created_at,
        }));
      }

      // 4. Students
      const { data: stdData, error: stdErr } = await supabase
        .from('students')
        .select('*')
        .order('full_name');

      if (!stdErr && Array.isArray(stdData)) {
        results.students = stdData.map((s: any) => ({
          id: s.id,
          studentNumber: s.student_number || undefined,
          fullName: s.full_name,
          classId: s.class_id || '',
          className: s.class_name,
          year: s.year,
          gender: s.gender || undefined,
          parentName: s.parent_name,
          parentPhone: s.parent_phone,
          parentEmail: s.parent_email || undefined,
          createdAt: s.created_at,
        }));
      }

      // 5. Orders
      const { data: ordData, error: ordErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!ordErr && Array.isArray(ordData)) {
        results.orders = ordData.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          studentId: o.student_id || undefined,
          studentName: o.student_name,
          studentNumber: o.student_number || undefined,
          classId: o.class_id || '',
          className: o.class_name,
          year: o.year,
          parentName: o.parent_name,
          parentPhone: o.parent_phone,
          parentEmail: o.parent_email || undefined,
          packageId: o.package_id,
          packageNameSnapshot: o.package_name_snapshot,
          packagePriceSnapshot: Number(o.package_price_snapshot),
          quantity: o.quantity || 1,
          totalAmount: Number(o.total_amount),
          orderStatus: o.order_status,
          paymentStatus: o.payment_status,
          paymentMethod: o.payment_method,
          paymentProofUrl: o.payment_proof_url || undefined,
          paymentProofFileName: o.payment_proof_filename || undefined,
          paymentDate: o.payment_date || undefined,
          paymentReference: o.payment_reference || undefined,
          adminNotes: o.admin_notes || undefined,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
        }));
      }

      // 6. Class Photos (stored in class_photos or student_photos table)
      const { data: cphoData, error: cphoErr } = await supabase
        .from('student_photos')
        .select('*')
        .eq('photo_type', 'Kelas');

      if (!cphoErr && Array.isArray(cphoData) && cphoData.length > 0) {
        results.classPhotos = cphoData.map((p: any) => ({
          id: p.id,
          classId: p.class_id,
          className: p.class_name,
          year: p.year || 'Tahun 1',
          title: `Gambar Kelas ${p.class_name}`,
          photoType: p.photo_type_detail === 'Freestyle' ? 'Freestyle' : 'Formal',
          photoUrl: p.photo_url,
          teacherName: p.teacher_name || '',
          uploadedAt: p.uploaded_at,
        }));
      }

      return results;
    } catch (err) {
      console.error('Supabase fetch error:', err);
      return null;
    }
  },

  // --- SAVE SINGLE ORDER TO SUPABASE ---
  async saveOrder(order: Order): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const payload: any = {
        order_number: order.orderNumber,
        student_name: order.studentName,
        student_number: order.studentNumber || null,
        class_name: order.className,
        year: order.year,
        parent_name: order.parentName,
        parent_phone: order.parentPhone,
        parent_email: order.parentEmail || null,
        package_name_snapshot: order.packageNameSnapshot,
        package_price_snapshot: order.packagePriceSnapshot,
        quantity: order.quantity,
        total_amount: order.totalAmount,
        order_status: order.orderStatus,
        payment_status: order.paymentStatus,
        payment_method: order.paymentMethod,
        payment_proof_url: order.paymentProofUrl || null,
        payment_proof_filename: order.paymentProofFileName || null,
        payment_reference: order.paymentReference || null,
        admin_notes: order.adminNotes || null,
      };

      const { error } = await supabase.from('orders').upsert(payload, { onConflict: 'order_number' });
      if (error) {
        console.warn('Could not save order to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Supabase saveOrder exception:', e);
      return false;
    }
  },

  // --- SAVE SETTINGS TO SUPABASE ---
  async saveSettings(settings: SystemSettings): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const payload = {
        id: 'stsp-config',
        school_name: settings.schoolName,
        school_emblem_text: settings.schoolEmblemText,
        school_tagline: settings.schoolTagline,
        session_year: settings.sessionYear,
        homepage_title: settings.homepageTitle,
        announcement_notice: settings.announcementNotice,
        is_booking_open: settings.isBookingOpen,
        booking_start_date: settings.bookingStartDate,
        booking_end_date: settings.bookingEndDate,
        bank_name: settings.bankName,
        bank_account_holder: settings.bankAccountHolder,
        bank_account_number: settings.bankAccountNumber,
        payment_instructions: settings.paymentInstructions,
        whatsapp_number: settings.whatsappNumber,
        contact_email: settings.contactEmail,
        school_address: settings.schoolAddress,
        school_phone: settings.schoolPhone,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('system_settings').upsert(payload, { onConflict: 'id' });
      return !error;
    } catch (e) {
      return false;
    }
  },

  // --- SYNC ALL LOCAL DATA TO SUPABASE (ONE-CLICK PUSH) ---
  async syncAllToCloud(data: {
    settings: SystemSettings;
    classes: ClassItem[];
    packages: PhotoPackage[];
    students: Student[];
    orders: Order[];
  }): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, message: 'Supabase URL dan Anon Key belum dikonfigurasikan.' };
    }

    try {
      // 1. Settings
      await this.saveSettings(data.settings);

      // 2. Classes
      if (data.classes.length > 0) {
        const clsPayload = data.classes.map((c) => ({
          name: c.name,
          year: c.year,
          teacher_name: c.teacherName || null,
          is_active: c.isActive,
        }));
        await supabase.from('classes').upsert(clsPayload, { onConflict: 'name' });
      }

      // 3. Orders
      for (const ord of data.orders) {
        await this.saveOrder(ord);
      }

      return {
        success: true,
        message: `Berjaya memindahkan dan menyegerakkan data ke Supabase Cloud! Semua peranti kini disambungkan.`,
      };
    } catch (err: any) {
      return { success: false, message: `Ralat segerak ke awan: ${err.message}` };
    }
  },
};
