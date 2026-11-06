import React, { useState } from 'react';
import { AdminUser, AuditLog } from '../../types';
import { StorageService } from '../../lib/storage';
import { Shield, Users, Clock, Plus, CheckCircle, X, Key } from 'lucide-react';

interface UsersManagerProps {
  currentAdmin: AdminUser;
}

export const UsersManager: React.FC<UsersManagerProps> = ({ currentAdmin }) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'audit'>('users');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(StorageService.getAuditLogs());
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New admin form state
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'Super Admin' | 'Guru Pengiring' | 'Fotografer'>('Guru Pengiring');

  // Hardcoded known admin users + session user list
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: 'usr-admin-1',
      email: 'admin@sktsp.edu.my',
      fullName: 'Penyelaras Fotografi SKTSP',
      role: 'Super Admin',
      lastLogin: new Date().toISOString(),
      isActive: true,
    },
    {
      id: 'usr-admin-2',
      email: 'pibg@sktsp.edu.my',
      fullName: 'Bendahari PIBG SKTSP',
      role: 'Guru Pengiring',
      lastLogin: '2026-02-15T08:30:00Z',
      isActive: true,
    },
    {
      id: 'usr-admin-3',
      email: 'studio.fotografi@gmail.com',
      fullName: 'Jurufoto Utama Studio',
      role: 'Fotografer',
      lastLogin: '2026-02-18T10:00:00Z',
      isActive: true,
    },
  ]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      email: newEmail.trim().toLowerCase(),
      fullName: newName.trim(),
      role: newRole,
      isActive: true,
      lastLogin: undefined,
    };

    setAdminUsers([...adminUsers, newUser]);
    StorageService.addAuditLog(currentAdmin.email, 'Daftar Pentadbir', `Akaun pentadbir ${newUser.fullName} (${newUser.role}) didaftarkan.`);
    setAuditLogs(StorageService.getAuditLogs());
    setIsAddUserModalOpen(false);
    setNewEmail('');
    setNewName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#163B65]">Akaun Pentadbir & Log Audit Keselamatan</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kawalan capaian pengguna, peranan kebenaran dan jejak audit aktiviti sistem.
          </p>
        </div>

        {activeSubTab === 'users' && (
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#163B65] text-white text-xs font-bold hover:bg-[#102C4E] transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#E6B85C]" />
            <span>Tambah Akses Pentadbir</span>
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'users'
              ? 'border-[#163B65] text-[#163B65]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Senarai Pengguna ({adminUsers.length})
        </button>
        <button
          onClick={() => {
            setAuditLogs(StorageService.getAuditLogs());
            setActiveSubTab('audit');
          }}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'audit'
              ? 'border-[#163B65] text-[#163B65]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Log Audit Keselamatan ({auditLogs.length})
        </button>
      </div>

      {/* Users Tab */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#163B65] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">Nama Penuh</th>
                <th className="py-3 px-4 font-semibold">Emel Rasmi</th>
                <th className="py-3 px-4 font-semibold">Peranan</th>
                <th className="py-3 px-4 font-semibold">Log Masuk Terakhir</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {adminUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{user.fullName}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        user.role === 'Super Admin'
                          ? 'bg-blue-100 text-[#163B65]'
                          : user.role === 'Guru Pengiring'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString('ms-MY')
                      : 'Belum log masuk'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                      Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#163B65] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold w-40">Masa & Tarikh</th>
                <th className="py-3 px-4 font-semibold w-44">Pengguna</th>
                <th className="py-3 px-4 font-semibold w-40">Tindakan</th>
                <th className="py-3 px-4 font-semibold">Perincian Aktiviti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Tiada log audit direkodkan.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('ms-MY')}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{log.userEmail}</td>
                    <td className="py-2.5 px-4 font-bold text-[#163B65]">{log.action}</td>
                    <td className="py-2.5 px-4 text-slate-600">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Admin Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 bg-[#163B65] text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm">Tambah Akses Pentadbir</h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Nama Penuh Pegawai *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Puan Noraini binti Yusof"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Emel Pegawai *</label>
                <input
                  type="email"
                  required
                  placeholder="noraini@sktsp.edu.my"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Peranan Capaian *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded border border-slate-300 bg-white font-semibold"
                >
                  <option value="Guru Pengiring">Guru Pengiring / Penyelaras Kelas</option>
                  <option value="Fotografer">Jurufoto Studio (Capaian Cetakan & Foto)</option>
                  <option value="Super Admin">Super Admin (Kawalan Penuh)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600">
                Akaun ini akan didaftarkan ke dalam pangkalan data akses SK Taman Sri Pulai.
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#163B65] text-white rounded font-bold hover:bg-[#102C4E]"
                >
                  Daftar Pentadbir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
