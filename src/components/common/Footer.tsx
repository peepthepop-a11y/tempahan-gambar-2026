import React from 'react';
import { SchoolEmblem } from './SchoolEmblem';
import { Phone, Mail, MapPin, Shield, Lock, FileText } from 'lucide-react';
import { SystemSettings } from '../../types';

interface FooterProps {
  settings: SystemSettings;
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="bg-[#102C4E] text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: School Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <SchoolEmblem size="md" />
              <div>
                <h3 className="font-extrabold text-white text-base tracking-wide">
                  {settings.schoolName}
                </h3>
                <p className="text-xs text-[#E6B85C] font-medium tracking-wide">
                  {settings.schoolEmblemText}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              Sistem rasmi pengurusan fotografi murid dan cenderahati tahunan SK Taman Sri Pulai, Johor. Memudahkan urusan tempahan, pengesahan pembayaran dan pemantauan cetakan berkualiti tinggi untuk semua ibu bapa.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-[#4A90D9] shrink-0" />
              <span>Privasi data murid dilindungi di bawah garis panduan keselamatan Kementerian Pendidikan Malaysia.</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-slate-700/60 pb-2">
              Pautan Pantas
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Laman Utama
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('packages')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pilihan Pakej Fotografi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Borang Tempahan Baru
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('check-order')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Semak Status Tempahan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Maklumat Hubungan Sekolah
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-b border-slate-700/60 pb-2">
              Hubungi Sekolah
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#4A90D9] shrink-0 mt-0.5" />
                <span className="leading-tight">{settings.schoolAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#4A90D9] shrink-0" />
                <span>{settings.schoolPhone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#4A90D9] shrink-0" />
                <span>{settings.contactEmail}</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer border border-slate-700/50"
                >
                  <Lock className="w-3 h-3 text-[#E6B85C]" />
                  <span>Portal Staf Pentadbir</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {settings.schoolName}. Hak cipta terpelihara.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Sesi Fotografi {settings.sessionYear}</span>
            <span aria-hidden="true">·</span>
            <span>PIBG SKTSP</span>
            <span aria-hidden="true">·</span>
            <span>Johor Bahru</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
