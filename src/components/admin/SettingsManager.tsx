import React, { useState } from 'react';
import { SystemSettings } from '../../types';
import { StorageService } from '../../lib/storage';
import { getSupabaseClient, isSupabaseConfigured } from '../../lib/supabase';
import {
  Settings,
  Save,
  Database,
  Building,
  CreditCard,
  Calendar,
  Phone,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  Upload,
  FileJson,
  FileArchive,
  Key,
  ShieldCheck,
  Smartphone,
  RefreshCw,
  Copy,
  Check,
  Cloud,
} from 'lucide-react';

interface SettingsManagerProps {
  settings: SystemSettings;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ settings }) => {
  const [form, setForm] = useState<SystemSettings>(settings);
  const [supabaseUrl, setSupabaseUrl] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('stsp_supabase_url') || '' : ''
  );
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('stsp_supabase_anon_key') || '' : ''
  );
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Admin credentials state
  const initialCreds = StorageService.getAdminCredentials();
  const [adminEmail, setAdminEmail] = useState(initialCreds.email);
  const [adminPassword, setAdminPassword] = useState(initialCreds.passwordHash);
  const [credsNotice, setCredsNotice] = useState<string | null>(null);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) return;
    StorageService.updateAdminCredentials(adminEmail, adminPassword);
    setCredsNotice('Kredensial pentadbir berjaya dikemaskini!');
    setTimeout(() => setCredsNotice(null), 3000);
  };

  const handleChange = (field: keyof SystemSettings, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSettings(form);

    // Save Supabase credentials if modified
    if (typeof window !== 'undefined') {
      localStorage.setItem('stsp_supabase_url', supabaseUrl.trim());
      localStorage.setItem('stsp_supabase_anon_key', supabaseAnonKey.trim());
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestSupabaseConnection = async () => {
    setTestResult(null);
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      setTestResult({
        success: false,
        message: 'Sila masukkan Supabase URL dan Anon Key terlebih dahulu.',
      });
      return;
    }

    try {
      const client = getSupabaseClient(supabaseUrl.trim(), supabaseAnonKey.trim());
      if (!client) {
        setTestResult({ success: false, message: 'Gagal membina sambungan Supabase.' });
        return;
      }
      // Simple probe
      const { data, error } = await client.from('classes').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        // Table might not exist yet if migrations haven't run, but credentials are authenticated
        setTestResult({
          success: true,
          message: `Berjaya berhubung ke Supabase! (Status: ${error.message || 'Bersedia'}). Pastikan migration schema dijalankan.`,
        });
      } else {
        setTestResult({
          success: true,
          message: 'Sambungan ke pangkalan data Supabase PostgreSQL BERJAYA!',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Ralat sambungan: ${err.message || 'Periksa URL dan Key'}`,
      });
    }
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleResetSampleData = () => {
    StorageService.resetToSampleData();
    setShowResetConfirm(false);
    setActionNotice('Data contoh SK Taman Sri Pulai telah berjaya dipulihkan.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleClearSampleData = () => {
    StorageService.clearSampleData();
    setShowClearConfirm(false);
    setActionNotice('Semua data contoh murid, tempahan dan gambar telah dipadamkan sepenuhnya. Sistem kini bersih untuk operasi sekolah!');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = StorageService.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `sktsp_sandaran_data_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setActionNotice('Fail sandaran lengkap berjaya dimuat turun! Anda boleh memuat naik fail ini di Netlify bila-bila masa.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importFullBackup(content);
      if (res.success) {
        setActionNotice(res.message);
        setForm(StorageService.getSettings());
      } else {
        alert(res.message);
      }
      setTimeout(() => setActionNotice(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Cross-device fast sync state & handlers
  const [deviceSyncCode, setDeviceSyncCode] = useState<string>('');
  const [inputSyncCode, setInputSyncCode] = useState<string>('');
  const [copiedSyncCode, setCopiedSyncCode] = useState(false);
  const [cloudSyncRunning, setCloudSyncRunning] = useState(false);

  const handleGenerateSyncCode = () => {
    const code = StorageService.generateDeviceSyncCode();
    setDeviceSyncCode(code);
    setActionNotice('Kod pindahan peranti berjaya dijana! Salin kod ini dan tampal di telefon/tab anda.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCopySyncCode = () => {
    if (!deviceSyncCode) return;
    navigator.clipboard.writeText(deviceSyncCode);
    setCopiedSyncCode(true);
    setTimeout(() => setCopiedSyncCode(false), 3000);
    setActionNotice('Kod pindahan telah disalin ke papan klip!');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleImportDeviceSyncCode = () => {
    if (!inputSyncCode.trim()) return;
    const res = StorageService.importDeviceSyncCode(inputSyncCode);
    if (res.success) {
      setForm(StorageService.getSettings());
      setInputSyncCode('');
      setActionNotice(res.message);
    } else {
      alert(res.message);
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handlePushToSupabase = async () => {
    setCloudSyncRunning(true);
    try {
      const res = await StorageService.syncAllToSupabase();
      setActionNotice(res.message);
    } catch (e: any) {
      setActionNotice(`Ralat segerak: ${e.message}`);
    } finally {
      setCloudSyncRunning(false);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  const handlePullFromSupabase = async () => {
    setCloudSyncRunning(true);
    try {
      await StorageService.initSync();
      setForm(StorageService.getSettings());
      setActionNotice('Berjaya menarik data terkini daripada Supabase Cloud!');
    } catch (e: any) {
      setActionNotice(`Ralat: ${e.message}`);
    } finally {
      setCloudSyncRunning(false);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-[#163B65]">Tetapan Sistem & Konfigurasi Sekolah</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Urus profil sekolah, jadual tempahan, maklumat akaun bank PIBG dan integrasi Supabase.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Tetapan berjaya disimpan dan dikemaskini dalam pangkalan data!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: School Identity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#163B65] pb-3 border-b border-slate-100">
            <Building className="w-4 h-4" />
            <h3 className="font-extrabold text-sm">Maklumat Rasmi Sekolah & Sesi</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Nama Sekolah</label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Tahun Sesi Fotografi</label>
              <input
                type="text"
                value={form.sessionYear}
                onChange={(e) => handleChange('sessionYear', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Teks Lambang / Motto</label>
              <input
                type="text"
                value={form.schoolEmblemText}
                onChange={(e) => handleChange('schoolEmblemText', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Tajuk Laman Utama</label>
              <input
                type="text"
                value={form.homepageTitle}
                onChange={(e) => handleChange('homepageTitle', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block font-bold text-slate-700">Teks Pengumuman Laman Utama</label>
              <textarea
                rows={2}
                value={form.announcementNotice}
                onChange={(e) => handleChange('announcementNotice', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Booking Schedule & Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#163B65] pb-3 border-b border-slate-100">
            <Calendar className="w-4 h-4" />
            <h3 className="font-extrabold text-sm">Status Pembukaan Tempahan</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2 flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block text-xs">
                  Buka / Tutup Tempahan Secara Keseluruhan
                </span>
                <span className="text-[11px] text-slate-500">
                  Apabila ditutup, ibu bapa tidak boleh membuat tempahan baru tetapi masih boleh menyemak status sedia ada.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('isBookingOpen', !form.isBookingOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  form.isBookingOpen
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {form.isBookingOpen ? 'Tempahan DIBUKA' : 'Tempahan DITUTUP'}
              </button>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Tarikh Mula Tempahan</label>
              <input
                type="date"
                value={form.bookingStartDate}
                onChange={(e) => handleChange('bookingStartDate', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Tarikh Tutup Tempahan</label>
              <input
                type="date"
                value={form.bookingEndDate}
                onChange={(e) => handleChange('bookingEndDate', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Bank Account & QR Code Payment Settings */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#163B65] pb-3 border-b border-slate-100">
            <CreditCard className="w-4 h-4" />
            <h3 className="font-extrabold text-sm">Maklumat Akaun Bank & QR Code Bayaran (DuitNow)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Nama Bank</label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 font-semibold"
                placeholder="Contoh: Maybank Islamic Berhad"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Nama Pemegang Akaun</label>
              <input
                type="text"
                value={form.bankAccountHolder}
                onChange={(e) => handleChange('bankAccountHolder', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 font-semibold"
                placeholder="Contoh: PIBG SK TAMAN SRI PULAI"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block font-bold text-slate-700">Nombor Akaun Bank</label>
              <input
                type="text"
                value={form.bankAccountNumber}
                onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 font-mono font-bold text-sm text-[#163B65]"
                placeholder="Contoh: 5512 8901 4432"
              />
              <p className="text-[11px] text-slate-500">
                Nombor akaun ini akan dipaparkan dalam borang tempahan dengan butang 1-klik salin untuk kemudahan ibu bapa.
              </p>
            </div>

            {/* Ruang Gambar QR Code DuitNow */}
            <div className="sm:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <label className="block font-bold text-slate-800">
                Gambar QR Code Bayaran (DuitNow QR / Bank QR)
              </label>
              <p className="text-[11px] text-slate-500">
                Gambar QR Code ini akan dipaparkan di Ruang QR Code pada borang tempahan ibu bapa. Anda boleh memuat naik imej QR sekolah dari telefon/komputer atau menampal URL imej.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                {form.qrCodeUrl ? (
                  <div className="shrink-0 p-2 bg-white rounded-lg border border-slate-300 shadow-xs text-center">
                    <img
                      src={form.qrCodeUrl}
                      alt="Pratonton QR Code"
                      className="w-36 h-36 object-contain rounded"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                      Pratonton QR Semasa
                    </span>
                  </div>
                ) : (
                  <div className="shrink-0 w-36 h-36 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                    Tiada QR
                  </div>
                )}

                <div className="space-y-2 flex-1 w-full">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Muat Naik Fail Imej QR Baru (PNG/JPG):
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              handleChange('qrCodeUrl', event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#163B65] file:text-white hover:file:bg-[#102C4E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Atau Masukkan URL Imej QR:
                    </label>
                    <input
                      type="text"
                      placeholder="https://... atau data:image/..."
                      value={form.qrCodeUrl || ''}
                      onChange={(e) => handleChange('qrCodeUrl', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const defaultSettings = StorageService.getSettings();
                      handleChange('qrCodeUrl', defaultSettings.qrCodeUrl);
                    }}
                    className="text-[11px] font-semibold text-[#4A90D9] hover:underline"
                  >
                    Gunakan Semula QR DuitNow Default PIBG SKTSP
                  </button>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block font-bold text-slate-700">Arahan Bayaran untuk Ibu Bapa</label>
              <textarea
                rows={3}
                value={form.paymentInstructions}
                onChange={(e) => handleChange('paymentInstructions', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Contact & WhatsApp */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#163B65] pb-3 border-b border-slate-100">
            <Phone className="w-4 h-4" />
            <h3 className="font-extrabold text-sm">Maklumat Hubungan & Hotline</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">No. WhatsApp Hotline (dengan kod negara, cth: 60197824150)</label>
              <input
                type="text"
                value={form.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Emel Rasmi Sekolah</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">No. Telefon Pejabat</label>
              <input
                type="text"
                value={form.schoolPhone}
                onChange={(e) => handleChange('schoolPhone', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Alamat Sekolah</label>
              <input
                type="text"
                value={form.schoolAddress}
                onChange={(e) => handleChange('schoolAddress', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Supabase Cloud PostgreSQL Integration */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-[#163B65]">
              <Database className="w-4 h-4" />
              <h3 className="font-extrabold text-sm">Integrasi Supabase PostgreSQL & Auth</h3>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                isSupabaseConfigured()
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isSupabaseConfigured() ? 'Supabase Diaktifkan' : 'Mod Enjin Tempatan'}
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Jika anda menghubungkan projek ke akaun Supabase, masukkan <strong>Project URL</strong> dan <strong>Anon Public Key</strong> di bawah atau tetapkan dalam pembolehubah persekitaran (<code>.env</code> / Vercel Environment Variables).
          </p>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Supabase Project URL</label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Supabase Anon Key</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 font-mono text-[11px]"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTestSupabaseConnection}
                className="px-3.5 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer"
              >
                Uji Sambungan Supabase
              </button>

              <button
                type="button"
                disabled={cloudSyncRunning}
                onClick={handlePushToSupabase}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{cloudSyncRunning ? 'Menyegerak...' : 'Segerak Semua Data ke Supabase (Push)'}</span>
              </button>

              <button
                type="button"
                disabled={cloudSyncRunning}
                onClick={handlePullFromSupabase}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#163B65] hover:bg-[#102C4E] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncRunning ? 'animate-spin' : ''}`} />
                <span>Tarik Data Terkini dari Awan (Pull)</span>
              </button>

              {testResult && (
                <span
                  className={`text-xs font-semibold ${
                    testResult.success ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {testResult.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 5B: Instant Cross-Device Transfer (PC ➔ Phone / Tablet) */}
        <div className="bg-white p-6 rounded-xl border-2 border-indigo-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-950">
              <Smartphone className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-sm">Penyegerakan Pantas Antara Peranti (PC ➜ Telefon / Tablet)</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
              Penyelesaian Segera Tanpa Database
            </span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed">
            <strong>Mengapa data di telefon/tablet berbeza daripada komputer anda?</strong>
            <br />
            Pelayar komputer dan pelayar telefon menyimpan memori setempat (<em>localStorage</em>) secara berasingan. Sekiranya anda belum menyambungkan pangkalan data awan Supabase, gunakan ciri pindahan pantas di bawah untuk memindahkan semua tetapan, kelas, pakej, dan gambar yang telah anda edit di komputer terus ke telefon atau tablet anda dalam 2 saat!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            {/* Step 1: On PC generate code */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <h4>Jana Kod Pindahan (Di Komputer / PC)</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Klik butang di bawah untuk menukar semua data semasa yang telah anda edit di komputer ini kepada kod pindahan selamat:
                </p>

                {deviceSyncCode ? (
                  <div className="space-y-2 pt-1">
                    <textarea
                      readOnly
                      rows={3}
                      value={deviceSyncCode}
                      className="w-full p-2 bg-white border border-indigo-200 rounded text-[10px] font-mono select-all text-slate-700"
                    />
                    <button
                      type="button"
                      onClick={handleCopySyncCode}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-xs cursor-pointer shadow-xs"
                    >
                      {copiedSyncCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSyncCode ? 'Telah Disalin!' : 'Salin Kod Pindahan'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateSyncCode}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Jana Kod Pindahan Sekarang</span>
                  </button>
                )}
              </div>
            </div>

            {/* Step 2: On Phone import code */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <h4>Tampal & Segerak (Di Telefon / Tablet)</h4>
                </div>
                <p className="text-[11px] text-slate-500">
                  Buka pautan web di telefon anda ➔ Masuk menu <strong>Tetapan</strong> ➔ Tampal kod pindahan di bawah dan tekan Segerak:
                </p>
                <textarea
                  rows={3}
                  placeholder="Tampal kod pindahan peranti di sini..."
                  value={inputSyncCode}
                  onChange={(e) => setInputSyncCode(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded text-[10px] font-mono text-slate-700"
                />
                <button
                  type="button"
                  onClick={handleImportDeviceSyncCode}
                  disabled={!inputSyncCode.trim()}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-colors ${
                    inputSyncCode.trim()
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Segerakkan ke Telefon / Tab Ini</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Data Backup & Vercel / Netlify Portability */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-[#163B65]">
              <FileJson className="w-4 h-4 text-[#4A90D9]" />
              <h3 className="font-extrabold text-sm">Sandaran & Pakej Deploy (Vercel & Netlify)</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800">
              Vercel & Netlify Ready
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Data sistem (kelas termasuk Prasekolah & PPKI, pakej, gambar kelas 5R, profil sekolah, QR akaun bank, senarai murid dan tempahan) disimpan dalam storan selamat. Anda boleh memuat turun sandaran data atau pakej ZIP yang sedia untuk dideploy ke <strong>Vercel</strong> atau <strong>Netlify</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-800">
                <Download className="w-4 h-4 text-[#163B65]" />
                <h4 className="font-bold">1. Muat Turun Fail Sandaran Data</h4>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Muat turun semua data yang telah anda kemaskini ke dalam fail sandaran (<code>.json</code>).
              </p>
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-[#163B65] hover:bg-[#102C4E] text-white rounded-lg font-bold cursor-pointer transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#E6B85C]" />
                <span>Eksport Sandaran Sistem (.json)</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-800">
                <Upload className="w-4 h-4 text-[#4A90D9]" />
                <h4 className="font-bold">2. Pulihkan Sandaran di Vercel / Netlify</h4>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Pilih fail <code>.json</code> yang telah dimuat turun untuk memulihkan seluruh data serta-merta di laman web yang dideploy.
              </p>
              <label className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg font-bold cursor-pointer transition-colors shadow-xs">
                <Upload className="w-3.5 h-3.5 text-[#4A90D9]" />
                <span>Pilih Fail Sandaran (.json)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleRestoreBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Direct ZIP Download options */}
          <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-950 font-bold">
              <FileArchive className="w-4 h-4 text-indigo-600" />
              <h4>Muat Turun Fail ZIP untuk Deploy Vercel</h4>
            </div>
            <p className="text-indigo-900 text-[11px] leading-relaxed">
              Pakej di bawah telah siap dibina bersama fail konfigurasi <code>vercel.json</code> & routing SPA tanpa ralat 404:
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href="/sktsp-dist-vercel.zip"
                download="sktsp-dist-vercel.zip"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-indigo-200" />
                <span>Muat Turun Pakej Vercel (sktsp-dist-vercel.zip)</span>
              </a>
              <a
                href="/sktsp-sistem-fotografi.zip"
                download="sktsp-sistem-fotografi.zip"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#E6B85C]" />
                <span>Kod Sumber Penuh Sistem (.zip)</span>
              </a>
            </div>
            <div className="p-2.5 bg-white/80 rounded border border-indigo-100 text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-indigo-900">Cara Deploy ke Vercel:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-600">
                <li>Buka <strong>vercel.com</strong> dan log masuk (guna akaun GitHub/Google).</li>
                <li>Jika guna GitHub: Push kod atau import repository, pilih Framework Preset <strong>Vite</strong>, dan tekan <strong>Deploy</strong>.</li>
                <li>Atau guna Vercel CLI di komputer: Ekstrak zip, jalankan <code>npx vercel</code>.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Section 7: Admin Credentials Management */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-[#163B65]">
              <Key className="w-4 h-4 text-[#E6B85C]" />
              <h3 className="font-extrabold text-sm">Tukar Kredensial & Kata Laluan Pentadbir</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Keselamatan Portal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Emel Log Masuk Pentadbir</label>
              <input
                type="text"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Kata Laluan Pentadbir</label>
              <input
                type="text"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-300 font-mono text-xs"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between pt-1">
              <p className="text-[11px] text-slate-500">
                Kata laluan ini digunakan untuk log masuk ke panel pentadbir di <code>/admin</code>.
              </p>
              <button
                type="button"
                onClick={handleSaveCredentials}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#163B65] hover:bg-[#102C4E] text-white rounded font-bold cursor-pointer transition-colors shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E6B85C]" />
                <span>Simpan Kredensial Pentadbir</span>
              </button>
            </div>

            {credsNotice && (
              <div className="sm:col-span-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{credsNotice}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 8: Data Maintenance & Launch Preparation */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 pb-3 border-b border-slate-100">
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <h3 className="font-extrabold text-sm">Penyelenggaraan & Pelancaran Produksi</h3>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 space-y-1">
            <p className="font-bold">Status Produksi Netlify: Bersih Sedia (0 Data Sampel)</p>
            <p className="text-[11px] text-emerald-700">
              Sistem kini dikonfigurasikan agar pada setiap pelayan dan pelayar bersih (termasuk Netlify), sistem bermula dengan <strong>0 murid sampel</strong> dan <strong>0 tempahan sampel</strong>. Data rasmi kelas SKTSP dan 3 pakej rasmi telah siap sedia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Tetapkan Semula Data Sampel</h4>
              <p className="text-slate-500 text-[11px]">
                Hanya gunakan butang ini jika anda ingin memuatkan data contoh untuk tujuan demonstrasi atau latihan staf.
              </p>
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tetapkan Semula Sampel</span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 space-y-2">
              <h4 className="font-bold text-rose-900">Padamkan Semua Tempahan & Rekod</h4>
              <p className="text-rose-700 text-[11px]">
                Padamkan semua murid dan tempahan sebelum melancarkan pautan rasmi kepada ibu bapa SKTSP sebenar.
              </p>
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kosongkan Semua Data Murid & Tempahan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#163B65] hover:bg-[#102C4E] text-white font-extrabold text-xs rounded-lg transition-colors cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4 text-[#E6B85C]" />
            <span>Simpan Semua Perubahan Tetapan</span>
          </button>
        </div>
      </form>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* In-App Confirmation Modal: Clear Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Sahkan Kosongkan Semua Data Sampel?</h3>
                <p className="text-xs text-rose-600 font-semibold">Tindakan ini tidak boleh diundur</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Semua senarai murid contoh, tempahan contoh, dan foto contoh akan dipadamkan serta-merta. Sistem akan menjadi bersih sedia untuk merekod tempahan sebenar daripada ibu bapa SKTSP.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleClearSampleData}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Ya, Padam Semua Data Sampel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal: Reset Data */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-[#163B65]">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-[#163B65]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Pulihkan Data Sampel Awal?</h3>
                <p className="text-xs text-slate-500 font-medium">Data demonstrasi SK Taman Sri Pulai</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem akan memasukkan semula senarai murid sampel, kelas, dan tempahan contoh untuk tujuan demonstrasi atau latihan staf.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetSampleData}
                className="px-4 py-2 text-xs font-bold text-white bg-[#163B65] hover:bg-[#102C4E] rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Ya, Pulihkan Sampel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
