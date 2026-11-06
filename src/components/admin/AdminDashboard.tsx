import React from 'react';
import { Order, Student, ClassItem, PhotoPackage } from '../../types';
import {
  ShoppingCart,
  Users,
  GraduationCap,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Package,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  students: Student[];
  classes: ClassItem[];
  packages: PhotoPackage[];
  onSelectTab: (tab: string) => void;
  onViewOrder: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  students,
  classes,
  packages,
  onSelectTab,
  onViewOrder,
}) => {
  // Calculations
  const totalOrders = orders.length;
  const totalStudents = students.length;
  const totalClasses = classes.filter((c) => c.isActive).length;

  // Kutipan: Approved payments sum
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'Approved')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const pendingPaymentOrders = orders.filter((o) => o.paymentStatus === 'Pending').length;
  const underReviewOrders = orders.filter((o) => o.paymentStatus === 'Under Review').length;
  const completedOrders = orders.filter(
    (o) => o.orderStatus === 'Telah Diserahkan' || o.orderStatus === 'Sedia Diambil'
  ).length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'Dibatalkan').length;

  // Breakdown by package
  const packageSales: Record<string, { count: number; total: number; name: string }> = {};
  packages.forEach((p) => {
    packageSales[p.id] = { count: 0, total: 0, name: p.name };
  });

  orders.forEach((o) => {
    if (o.orderStatus !== 'Dibatalkan') {
      if (!packageSales[o.packageId]) {
        packageSales[o.packageId] = { count: 0, total: 0, name: o.packageNameSnapshot };
      }
      packageSales[o.packageId].count += o.quantity || 1;
      packageSales[o.packageId].total += o.totalAmount;
    }
  });

  // Breakdown by year
  const yearOrders: Record<string, number> = {
    'Tahun 1': 0,
    'Tahun 2': 0,
    'Tahun 3': 0,
    'Tahun 4': 0,
    'Tahun 5': 0,
    'Tahun 6': 0,
  };
  orders.forEach((o) => {
    if (o.year && yearOrders[o.year] !== undefined) {
      yearOrders[o.year]++;
    }
  });

  // Recent 6 orders
  const recentOrders = [...orders].slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-black text-[#163B65]">Dashboard Pengurusan Fotografi</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Ringkasan operasi tempahan, kutipan bayaran dan status cetakan murid semasa.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Jumlah Tempahan
            </span>
            <span className="text-2xl font-black text-[#163B65] font-mono tabular-nums">
              {totalOrders}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Semua rekod murid</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#163B65] flex items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Kutipan Disahkan
            </span>
            <span className="text-2xl font-black text-emerald-700 font-mono tabular-nums">
              RM {totalRevenue.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Bayaran telah diluluskan</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Menunggu Pengesahan
            </span>
            <span className="text-2xl font-black text-amber-600 font-mono tabular-nums">
              {underReviewOrders}
            </span>
            <span className="text-[10px] text-amber-700/80 block mt-0.5">Perlu semakan resit</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Payment */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Belum Bayar
            </span>
            <span className="text-2xl font-black text-slate-700 font-mono tabular-nums">
              {pendingPaymentOrders}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Menunggu transaksi</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Secondary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
          <span className="text-slate-500">Jumlah Murid Berdaftar:</span>
          <span className="font-bold text-slate-900 font-mono">{totalStudents}</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
          <span className="text-slate-500">Jumlah Kelas Aktif:</span>
          <span className="font-bold text-slate-900 font-mono">{totalClasses}</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
          <span className="text-slate-500">Tempahan Telah Selesai:</span>
          <span className="font-bold text-emerald-700 font-mono">{completedOrders}</span>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
          <span className="text-slate-500">Tempahan Dibatalkan:</span>
          <span className="font-bold text-rose-600 font-mono">{cancelledOrders}</span>
        </div>
      </div>

      {/* Visual Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package Sales Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#163B65]">Jualan Mengikut Pakej</h3>
            <button
              onClick={() => onSelectTab('packages')}
              className="text-xs text-[#4A90D9] hover:underline font-semibold"
            >
              Urus Pakej
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {packages.map((pkg) => {
              const data = packageSales[pkg.id] || { count: 0, total: 0 };
              const percent = totalOrders > 0 ? Math.round((data.count / totalOrders) * 100) : 0;
              return (
                <div key={pkg.id} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-semibold">{pkg.code} ({pkg.name})</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500">{data.count} tempahan</span>
                      <span className="font-bold text-slate-900">RM {data.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#163B65] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(percent, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders by School Year */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#163B65]">Pecahan Mengikut Tahun</h3>
            <button
              onClick={() => onSelectTab('classes')}
              className="text-xs text-[#4A90D9] hover:underline font-semibold"
            >
              Urus Kelas
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
            {Object.entries(yearOrders).map(([year, count]) => (
              <div
                key={year}
                className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center flex flex-col justify-center items-center"
              >
                <span className="text-[10px] font-bold text-slate-500 block uppercase">{year}</span>
                <span className="text-xl font-black text-[#163B65] font-mono tabular-nums mt-1">
                  {count}
                </span>
                <span className="text-[9px] text-slate-400">murid</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Perlukan cetakan senarai batch fotografi mengikut kelas?</span>
            <button
              onClick={() => onSelectTab('printing')}
              className="px-3 py-1 bg-[#163B65] text-white font-bold text-xs rounded hover:bg-[#102C4E] transition-colors cursor-pointer"
            >
              Modul Cetakan
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-[#163B65]">Tempahan Terkini</h3>
            <p className="text-xs text-slate-500">6 rekod tempahan paling baharu diterima.</p>
          </div>
          <button
            onClick={() => onSelectTab('orders')}
            className="inline-flex items-center gap-1.5 text-xs text-[#163B65] font-bold hover:underline cursor-pointer"
          >
            <span>Lihat Semua Tempahan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-bold">No. Tempahan</th>
                <th className="py-2.5 px-4 font-bold">Nama Murid</th>
                <th className="py-2.5 px-4 font-bold">Kelas</th>
                <th className="py-2.5 px-4 font-bold">Pakej</th>
                <th className="py-2.5 px-4 font-bold text-right">Jumlah</th>
                <th className="py-2.5 px-4 font-bold text-center">Bayaran</th>
                <th className="py-2.5 px-4 font-bold text-center">Status</th>
                <th className="py-2.5 px-4 font-bold text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tiada tempahan didaftarkan setakat ini.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#163B65]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 truncate max-w-[160px]">
                      {ord.studentName}
                    </td>
                    <td className="py-3 px-4 font-medium">{ord.className}</td>
                    <td className="py-3 px-4 truncate max-w-[140px] text-slate-600">
                      {ord.packageNameSnapshot}
                    </td>
                    <td className="py-3 px-4 font-mono text-right tabular-nums font-bold text-slate-900">
                      RM {ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.paymentStatus === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.paymentStatus === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[11px] font-medium text-slate-800">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewOrder(ord)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#163B65] bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Papar</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
