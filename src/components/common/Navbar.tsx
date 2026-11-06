import React, { useState } from 'react';
import { SchoolEmblem } from './SchoolEmblem';
import { Camera, CheckCircle2, ShieldCheck, Menu, X, PhoneCall } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, isAdminLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Laman Utama', route: 'home' },
    { label: 'Galeri Kelas', route: 'gallery' },
    { label: 'Pakej Gambar Kelas', route: 'packages' },
    { label: 'Buat Tempahan', route: 'booking' },
    { label: 'Semak Status', route: 'check-order' },
    { label: 'Hubungi Kami', route: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark with single text anchor */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left shrink-0 cursor-pointer group"
          >
            <SchoolEmblem size="md" />
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[#163B65] group-hover:text-[#4A90D9] transition-colors whitespace-nowrap">
                SK TAMAN SRI PULAI
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase whitespace-nowrap">
                Sistem Tempahan Gambar Kelas
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (single-line, clean hover states) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            {navLinks.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => onNavigate(item.route)}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-[#163B65] font-bold border-b-2 border-[#163B65] pb-1'
                      : 'hover:text-[#163B65] pb-1'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {isAdminLoggedIn ? (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#163B65] hover:bg-[#102C4E] rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-[#E6B85C]" />
                <span>Panel Pentadbir</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('check-order')}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#163B65] bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Semak Tempahan</span>
                </button>
                <button
                  onClick={() => onNavigate('booking')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#163B65] hover:bg-[#102C4E] rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5 text-[#E6B85C]" />
                  <span>Tempah Sekarang</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((item) => (
            <button
              key={item.route}
              onClick={() => {
                onNavigate(item.route);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                currentRoute === item.route
                  ? 'bg-slate-100 text-[#163B65] font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('booking');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 px-4 text-sm font-bold text-white bg-[#163B65] rounded-lg"
            >
              Buat Tempahan Sekarang
            </button>
            <button
              onClick={() => {
                onNavigate(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2 px-4 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg"
            >
              {isAdminLoggedIn ? 'Panel Pentadbir' : 'Log Masuk Pentadbir'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
