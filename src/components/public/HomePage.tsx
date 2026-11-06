import React from 'react';
import { SystemSettings, PhotoPackage } from '../../types';
import { SchoolEmblem } from '../common/SchoolEmblem';
import {
  Camera,
  Search,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Copy,
  Check,
  Phone,
  Layers,
} from 'lucide-react';

interface HomePageProps {
  settings: SystemSettings;
  packages: PhotoPackage[];
  onNavigate: (route: string) => void;
  onSelectPackageForBooking?: (packageId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  packages,
  onNavigate,
  onSelectPackageForBooking,
}) => {
  const [copiedAccount, setCopiedAccount] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const activePackages = packages.filter((p) => p.isActive);

  return (
    <div className="space-y-16 pb-16">
      {/* Announcement Notification if any */}
      {settings.announcementNotice && (
        <div className="bg-[#163B65] text-white py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-[#E6B85C] text-[#163B65] font-extrabold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
                Makluman
              </span>
              <span className="font-medium text-slate-100">{settings.announcementNotice}</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 shrink-0 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#E6B85C]" />
              <span>Tutup: {new Date(settings.bookingEndDate).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-2xl bg-gradient-to-br from-[#163B65] via-[#102C4E] to-[#0A1D33] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl border border-slate-700/40">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4A90D9_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/90">
              <SchoolEmblem size="sm" />
              <span className="tracking-wide uppercase text-[#E6B85C] font-bold">
                {settings.schoolName} · SESI FOTOGRAFI {settings.sessionYear}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white text-balance">
              Rakaman Memori & Gambar Kelas SK Taman Sri Pulai
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
              Abadikan kenangan persekolahan anak anda bersama rakan sekelas dan guru kelas tercinta dalam kualiti cetakan gambar kelas studio profesional. Tempah pakej cetakan foto kelas secara mudah, pantas dan selamat.
            </p>

            {/* Quick Action Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {settings.isBookingOpen ? (
                <button
                  onClick={() => onNavigate('booking')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#E6B85C] text-[#163B65] font-extrabold text-sm hover:bg-[#d4a547] transition-all shadow-md cursor-pointer hover:shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                  <span>TEMPAH GAMBAR KELAS SEKARANG</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/40 text-sm font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Tempahan Fotografi Telah Ditutup Bagi Sesi Ini</span>
                </div>
              )}

              <button
                onClick={() => onNavigate('gallery')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs transition-colors border border-white/20 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#E6B85C]" />
                <span>Lihat Galeri Foto Kelas</span>
              </button>

              <button
                onClick={() => onNavigate('check-order')}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-lg text-slate-300 hover:text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#4A90D9]" />
                <span>Semak Status</span>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E6B85C]" />
                <span>Cetakan Gambar Kelas 5R Bertemplate Rasmi</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4A90D9]" />
                <span>Pengurusan Rasmi Sekolah & PIBG</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Tarikh Tutup: {new Date(settings.bookingEndDate).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Packages Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A90D9]">
            Pilihan Rasmi Sekolah
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163B65]">
            Pakej Gambar Kelas Murid {settings.sessionYear}
          </h2>
          <p className="text-sm text-slate-600">
            Semua gambar akan ada template rasmi SKTSP. Semua pakej adalah cetakan gambar sahaja bersaiz 5R pada harga berpatutan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {activePackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-xl border flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${
                pkg.isPopular
                  ? 'border-[#163B65] ring-2 ring-[#163B65]/15 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#163B65] text-[#E6B85C] text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Paling Berbaloi · Pilihan Ramai</span>
                </div>
              )}

              <div className="p-6">
                {/* Visual Header Badge */}
                <div className="w-12 h-12 rounded-lg bg-[#F5F8FC] border border-slate-200 flex items-center justify-center text-[#163B65] mb-4">
                  <Camera className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase text-[#4A90D9] tracking-wider">
                    {pkg.code}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {pkg.name}
                  </h3>
                </div>

                <div className="my-5 pb-5 border-b border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-semibold text-slate-500">RM</span>
                    <span className="text-3xl font-black text-[#163B65] font-mono tabular-nums">
                      {pkg.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500">/ murid</span>
                  </div>

                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-slate-400 line-through font-mono">
                        RM {pkg.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                        DISKAUN JIMAT RM {(pkg.originalPrice - pkg.price).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                    Kandungan Pakej:
                  </span>
                  <ul className="space-y-2">
                    {pkg.contents.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0 mt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (onSelectPackageForBooking) {
                      onSelectPackageForBooking(pkg.id);
                    } else {
                      onNavigate('booking');
                    }
                  }}
                  disabled={!settings.isBookingOpen}
                  className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    !settings.isBookingOpen
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : pkg.isPopular
                      ? 'bg-[#163B65] text-white hover:bg-[#102C4E]'
                      : 'bg-slate-100 text-slate-800 hover:bg-[#163B65] hover:text-white'
                  }`}
                >
                  <span>Pilih {pkg.code}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works / 3 Simple Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A90D9]">
              Langkah Mudah
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#163B65] mt-1">
              Cara Membuat Tempahan Gambar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-[#163B65] text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Pilih Kelas & Maklumat Murid</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilih kelas anak anda (Tahun 1 hingga Tahun 6) dan masukkan nama murid serta maklumat penjaga untuk rekod rasmi.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-[#163B65] text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Pilih Pakej Gambar</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilih antara Pakej A, B, C atau Premium mengikut keperluan cetakan individu, gambar kelas atau pakej bingkai.
              </p>
            </div>

            <div className="space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-[#163B65] text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Bayaran & Muat Naik Resit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lakukan pindahan bank ke akaun PIBG SK Taman Sri Pulai, muat naik slip transaksi dan simpan No. Tempahan (Order ID).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bank & Payment Information Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#163B65]" />
                <h3 className="text-base font-extrabold text-[#163B65]">
                  Maklumat Pembayaran Akaun Rasmi PIBG
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {settings.paymentInstructions}
              </p>
            </div>

            {/* Bank Card Widget */}
            <div className="w-full lg:w-auto bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Bank Penerima
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {settings.bankName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Nama Pemegang Akaun
                  </span>
                  <span className="font-bold text-xs text-slate-800">
                    {settings.bankAccountHolder}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Nombor Akaun
                  </span>
                  <span className="font-mono font-black text-base text-[#163B65] tracking-wider">
                    {settings.bankAccountNumber}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.bankAccountNumber.replace(/\s+/g, ''))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                >
                  {copiedAccount ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin No.</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Quick Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-200 bg-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#F5F8FC] flex items-center justify-center text-[#163B65] shrink-0 border border-slate-200">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Perlukan Bantuan Tempahan?</h4>
              <p className="text-xs text-slate-500">
                Hubungi talian hotline WhatsApp atau pihak pengurusan sekolah untuk sebarang pertanyaan fotografi.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Salam sejahtera SK Taman Sri Pulai, saya ingin bertanya berkenaan tempahan gambar murid.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Kami</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>Maklumat Hubungan</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
