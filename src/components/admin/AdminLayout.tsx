import React, { useState } from 'react';
import { SchoolEmblem } from '../common/SchoolEmblem';
import { AdminUser, SystemSettings } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  GraduationCap,
  Package,
  CreditCard,
  Camera,
  Printer,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
  Share2,
  Check,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  adminUser: AdminUser;
  settings: SystemSettings;
  onLogout: () => void;
  onViewPublicSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  adminUser,
  settings,
  onLogout,
  onViewPublicSite,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const isSupabase = isSupabaseConfigured();

  const handleCopyBookingLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/#booking` : '';
    if (url && navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'orders', label: 'Pengurusan Tempahan', icon: ShoppingCart },
    { id: 'students', label: 'Pengurusan Murid', icon: Users },
    { id: 'classes', label: 'Pengurusan Kelas', icon: GraduationCap },
    { id: 'packages', label: 'Pengurusan Pakej', icon: Package },
    { id: 'payments', label: 'Pengesahan Bayaran', icon: CreditCard },
    { id: 'photos', label: 'Pengurusan Gambar Kelas', icon: Camera },
    { id: 'printing', label: 'Pengurusan Cetakan', icon: Printer },
    { id: 'reports', label: 'Laporan & Analitik', icon: BarChart3 },
    { id: 'settings', label: 'Tetapan Sistem', icon: Settings },
    { id: 'users', label: 'Pengguna & Audit', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#163B65] text-white shrink-0 border-r border-slate-800">
        {/* School Branding in Sidebar */}
        <div className="p-5 border-b border-slate-700/60 flex items-center gap-3">
          <SchoolEmblem size="md" />
          <div className="truncate">
            <h2 className="font-extrabold text-xs tracking-wide text-white truncate">
              {settings.schoolName}
            </h2>
            <p className="text-[10px] text-[#E6B85C] font-semibold uppercase tracking-wider">
              Portal Pentadbir · {settings.sessionYear}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/15 text-white font-bold shadow-xs border-l-2 border-[#E6B85C]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E6B85C]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Database Status indicator */}
        <div className="p-3 mx-3 mb-2 rounded bg-slate-900/40 border border-slate-700/50 text-[11px] text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#4A90D9]" />
            <span>Pangkalan Data:</span>
          </div>
          <span className="font-mono font-bold text-[10px] text-emerald-400">
            {isSupabase ? 'Supabase' : 'Aktif (Local/DB)'}
          </span>
        </div>

        {/* Sidebar Footer with user info & logout */}
        <div className="p-4 border-t border-slate-700/60 bg-[#102C4E]/60">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate pr-2">
              <p className="text-xs font-bold text-white truncate">{adminUser.fullName}</p>
              <p className="text-[10px] text-slate-400 truncate">{adminUser.role}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Log Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onViewPublicSite}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E6B85C]" />
            <span>Lihat Laman Awam</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-[#163B65] text-white flex flex-col z-10">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SchoolEmblem size="sm" />
                <span className="font-bold text-xs">SK TAMAN SRI PULAI</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive ? 'bg-white/15 text-white font-bold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-700 space-y-2">
              <button
                onClick={onViewPublicSite}
                className="w-full py-2 px-3 bg-white/10 text-white text-xs font-semibold rounded-lg text-center"
              >
                Lihat Laman Awam
              </button>
              <button
                onClick={onLogout}
                className="w-full py-2 px-3 bg-rose-600/80 text-white text-xs font-semibold rounded-lg text-center"
              >
                Log Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Panel Pentadbir</span>
              <span className="text-slate-300">/</span>
              <span className="font-extrabold text-[#163B65]">
                {menuItems.find((m) => m.id === currentTab)?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyBookingLink}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
              title="Salin pautan tempahan rasmi untuk diedarkan kepada ibu bapa di WhatsApp"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{copiedLink ? 'Pautan Disalin!' : 'Salin Pautan Tempahan'}</span>
            </button>

            <button
              onClick={onViewPublicSite}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#163B65] bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Laman Ibu Bapa</span>
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#163B65] text-white flex items-center justify-center font-bold text-xs">
                {adminUser.fullName.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden md:inline">
                {adminUser.fullName}
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
