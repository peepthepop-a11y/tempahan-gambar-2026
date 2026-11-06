import React from 'react';
import { PhotoPackage, SystemSettings } from '../../types';
import { Camera, Check, Sparkles, ArrowRight, Layers, Tag, ShieldCheck } from 'lucide-react';

interface PackagesPageProps {
  packages: PhotoPackage[];
  settings: SystemSettings;
  onNavigate: (route: string) => void;
  onSelectPackage: (packageId: string) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({
  packages,
  settings,
  onNavigate,
  onSelectPackage,
}) => {
  const activePackages = packages.filter((p) => p.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4A90D9]">
          Sesi Fotografi Gambar Kelas {settings.sessionYear}
        </span>
        <h1 className="text-3xl font-black text-[#163B65]">
          Pakej Cetakan Gambar Kelas (Saiz 5R)
        </h1>
        <p className="text-sm text-slate-600">
          Abadikan kenangan berharga bersama rakan sekelas dan guru kelas. Pilihan foto formal, aksi santai freestyle atau kombo lengkap jimat.
        </p>

        {/* Highlight Notices */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#163B65] font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-[#E6B85C]" />
            <span>Semua Gambar Dilengkapi Reka Bentuk Template</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200">
            <Tag className="w-3.5 h-3.5 text-[#E6B85C]" />
            <span>Semua Pakej Hanya Cetakan Gambar Sahaja (Saiz 5R)</span>
          </span>
        </div>
      </div>

      {/* Package Grid (3 Packages) */}
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

              {/* Pricing section with original price strikethrough if discounted */}
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
                onClick={() => onSelectPackage(pkg.id)}
                disabled={!settings.isBookingOpen}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  !settings.isBookingOpen
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : pkg.isPopular
                    ? 'bg-[#163B65] text-white hover:bg-[#102C4E]'
                    : 'bg-slate-100 text-slate-800 hover:bg-[#163B65] hover:text-white'
                }`}
              >
                <span>Tempah {pkg.code}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Specifications Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs max-w-5xl mx-auto">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h3 className="font-extrabold text-[#163B65] text-base">Jadual Perbandingan Pakej Gambar Kelas</h3>
          <p className="text-xs text-slate-500">Perincian ciri cetakan foto formal, foto freestyle dan tawaran kombo jimat.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Ciri & Spesifikasi Cetakan</th>
                <th className="py-3 px-4 font-bold text-center">Pakej A (RM7.00)</th>
                <th className="py-3 px-4 font-bold text-center">Pakej B (RM7.00)</th>
                <th className="py-3 px-4 font-bold text-center bg-blue-50 text-[#163B65]">Pakej C Kombo (RM12.00)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Jenis Fotografi Kelas</td>
                <td className="py-3 px-4 text-center font-bold text-[#163B65]">Foto Formal Kelas</td>
                <td className="py-3 px-4 text-center font-bold text-[#4A90D9]">Foto Freestyle / Santai</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-blue-50/50">Formal + Freestyle (Lengkap)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Saiz Cetakan Foto</td>
                <td className="py-3 px-4 text-center">5R (5 x 7 inci)</td>
                <td className="py-3 px-4 text-center">5R (5 x 7 inci)</td>
                <td className="py-3 px-4 text-center font-bold text-[#163B65] bg-blue-50/50">5R (5 x 7 inci)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Reka Bentuk Template Sekolah</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700">Template Rasmi SKTSP</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700">Template Ceria SKTSP</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-blue-50/50">Kedua-dua Template</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Bilangan Keping Cetakan</td>
                <td className="py-3 px-4 text-center font-bold text-slate-900">1 Keping</td>
                <td className="py-3 px-4 text-center font-bold text-slate-900">1 Keping</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-blue-50/50">2 Keping (Set Penuh)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Jenis Cetakan</td>
                <td className="py-3 px-4 text-center text-slate-600">Hanya Cetakan Gambar</td>
                <td className="py-3 px-4 text-center text-slate-600">Hanya Cetakan Gambar</td>
                <td className="py-3 px-4 text-center text-slate-600 bg-blue-50/50">Hanya Cetakan Gambar</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Kualiti Kertas Foto</td>
                <td className="py-3 px-4 text-center">Studio Makmal Anti-Pudar</td>
                <td className="py-3 px-4 text-center">Studio Makmal Anti-Pudar</td>
                <td className="py-3 px-4 text-center font-semibold bg-blue-50/50">Studio Makmal Anti-Pudar</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td className="py-3 px-4 text-slate-900">Harga & Penjimatan</td>
                <td className="py-3 px-4 text-center font-mono text-[#163B65]">RM 7.00</td>
                <td className="py-3 px-4 text-center font-mono text-[#163B65]">RM 7.00</td>
                <td className="py-3 px-4 text-center font-mono text-emerald-700 bg-blue-100/60">
                  <span>RM 12.00</span>
                  <span className="block text-[10px] text-emerald-800 font-sans font-extrabold">(Diskaun dari RM14.00)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
