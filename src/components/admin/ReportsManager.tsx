import React, { useState } from 'react';
import { Order, ClassItem, PhotoPackage, SystemSettings } from '../../types';
import { exportOrdersToCsv } from '../../lib/exportUtils';
import { SchoolEmblem } from '../common/SchoolEmblem';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  CreditCard,
  TrendingUp,
  FileText,
  Filter,
} from 'lucide-react';

interface ReportsManagerProps {
  orders: Order[];
  classes: ClassItem[];
  packages: PhotoPackage[];
  settings: SystemSettings;
}

export const ReportsManager: React.FC<ReportsManagerProps> = ({
  orders,
  classes,
  packages,
  settings,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Date filtering
  const filteredOrders = orders.filter((o) => {
    if (o.orderStatus === 'Dibatalkan') return false;
    const orderDate = o.createdAt.split('T')[0];
    if (startDate && orderDate < startDate) return false;
    if (endDate && orderDate > endDate) return false;
    return true;
  });

  // Metrics
  const totalBookings = filteredOrders.length;
  const totalApprovedRevenue = filteredOrders
    .filter((o) => o.paymentStatus === 'Approved')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalUnpaidRevenue = filteredOrders
    .filter((o) => o.paymentStatus !== 'Approved')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOverallPotential = totalApprovedRevenue + totalUnpaidRevenue;

  // Breakdown by package
  const packageMetrics = packages.map((pkg) => {
    const pkgOrders = filteredOrders.filter((o) => o.packageId === pkg.id);
    const count = pkgOrders.reduce((sum, o) => sum + (o.quantity || 1), 0);
    const total = pkgOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const approved = pkgOrders
      .filter((o) => o.paymentStatus === 'Approved')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      id: pkg.id,
      code: pkg.code,
      name: pkg.name,
      price: pkg.price,
      count,
      total,
      approved,
    };
  });

  // Breakdown by class
  const classMetrics = classes
    .map((cls) => {
      const clsOrders = filteredOrders.filter((o) => o.classId === cls.id);
      const count = clsOrders.length;
      const total = clsOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const approved = clsOrders
        .filter((o) => o.paymentStatus === 'Approved')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      return {
        id: cls.id,
        name: cls.name,
        year: cls.year,
        teacher: cls.teacherName || '-',
        count,
        total,
        approved,
      };
    })
    .sort((a, b) => b.total - a.total);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#163B65]">Laporan Kewangan & Analisis Tempahan</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan rasmi hasil kutipan, taburan pakej dan prestasi tempahan mengikut kelas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportOrdersToCsv(filteredOrders, 'laporan_kewangan_fotografi_sktsp.csv')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Eksport CSV / Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#163B65] text-white rounded-lg text-xs font-bold hover:bg-[#102C4E] cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan Rasmi</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar (no-print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-4 text-xs">
        <span className="font-bold text-slate-700">Tapis Tarikh Tempahan:</span>
        <div className="flex items-center gap-2">
          <span>Dari:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2.5 py-1.5 rounded border border-slate-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <span>Hingga:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2.5 py-1.5 rounded border border-slate-300"
          />
        </div>
        {(startDate || endDate) && (
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="text-[#4A90D9] hover:underline font-semibold"
          >
            Padam Penapis
          </button>
        )}
      </div>

      {/* PRINTABLE OFFICIAL REPORT CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        {/* School Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <SchoolEmblem size="lg" />
            <div>
              <h2 className="font-black text-xl text-[#163B65]">{settings.schoolName}</h2>
              <p className="text-xs text-slate-600 font-medium">{settings.schoolAddress}</p>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mt-1">
                LAPORAN OPERASI & KUTIPAN TEMPAHAN GAMBAR SESI {settings.sessionYear}
              </h3>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold text-slate-900">Tarikh Dijana:</p>
            <p className="font-mono">{new Date().toLocaleString('ms-MY')}</p>
            <p className="text-slate-500 mt-1">PIBG SK Taman Sri Pulai</p>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Jumlah Tempahan
            </span>
            <span className="text-2xl font-black text-[#163B65] font-mono tabular-nums block mt-1">
              {totalBookings}
            </span>
            <span className="text-[10px] text-slate-500">Keping Pakej</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Bayaran Disahkan (Kutipan)
            </span>
            <span className="text-2xl font-black text-emerald-700 font-mono tabular-nums block mt-1">
              RM {totalApprovedRevenue.toFixed(2)}
            </span>
            <span className="text-[10px] text-emerald-800">Telah Diterima PIBG</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Belum Disahkan / Bayar
            </span>
            <span className="text-2xl font-black text-amber-600 font-mono tabular-nums block mt-1">
              RM {totalUnpaidRevenue.toFixed(2)}
            </span>
            <span className="text-[10px] text-amber-700">Dalam Proses Semakan</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Anggaran Nilai Keseluruhan
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono tabular-nums block mt-1">
              RM {totalOverallPotential.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500">Nilai Kasar Tempahan</span>
          </div>
        </div>

        {/* Section 1: Sales by Package */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-[#163B65] border-b border-slate-200 pb-2">
            1. Ringkasan Jualan Mengikut Pakej Fotografi
          </h4>
          <table className="w-full text-xs text-left border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Kod & Nama Pakej</th>
                <th className="py-2.5 px-3 text-right">Harga Seunit</th>
                <th className="py-2.5 px-3 text-center">Jumlah Tempahan</th>
                <th className="py-2.5 px-3 text-right">Nilai Diterima (RM)</th>
                <th className="py-2.5 px-3 text-right">Jumlah Keseluruhan (RM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {packageMetrics.map((p) => (
                <tr key={p.id}>
                  <td className="py-2 px-3 font-semibold text-slate-900">
                    {p.code} - {p.name}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums">RM {p.price.toFixed(2)}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold">{p.count}</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-700 font-semibold tabular-nums">
                    RM {p.approved.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    RM {p.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300">
              <tr>
                <td colSpan={2} className="py-2.5 px-3 text-right uppercase">
                  Jumlah:
                </td>
                <td className="py-2.5 px-3 text-center font-mono">
                  {packageMetrics.reduce((s, p) => s + p.count, 0)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                  RM {totalApprovedRevenue.toFixed(2)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-900">
                  RM {totalOverallPotential.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Section 2: Bookings by Class */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-[#163B65] border-b border-slate-200 pb-2">
            2. Prestasi Tempahan Mengikut Kelas
          </h4>
          <table className="w-full text-xs text-left border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Nama Kelas</th>
                <th className="py-2.5 px-3">Tahun</th>
                <th className="py-2.5 px-3">Guru Kelas</th>
                <th className="py-2.5 px-3 text-center">Tempahan</th>
                <th className="py-2.5 px-3 text-right">Kutipan Sah (RM)</th>
                <th className="py-2.5 px-3 text-right">Nilai Potensi (RM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {classMetrics.map((c) => (
                <tr key={c.id}>
                  <td className="py-2 px-3 font-bold text-slate-900">{c.name}</td>
                  <td className="py-2 px-3 text-slate-600">{c.year}</td>
                  <td className="py-2 px-3 text-slate-600">{c.teacher}</td>
                  <td className="py-2 px-3 text-center font-mono font-bold">{c.count}</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-700 tabular-nums">
                    RM {c.approved.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    RM {c.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures for Official Filing */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs text-slate-700">
          <div>
            <p className="font-bold">Disediakan Oleh:</p>
            <div className="h-16 border-b border-slate-400 mt-2" />
            <p className="mt-1 font-semibold">Penyelaras Fotografi Sekolah</p>
            <p className="text-[11px] text-slate-500">SK Taman Sri Pulai</p>
          </div>
          <div>
            <p className="font-bold">Disemak & Disahkan Oleh:</p>
            <div className="h-16 border-b border-slate-400 mt-2" />
            <p className="mt-1 font-semibold">Bendahari PIBG / Guru Besar</p>
            <p className="text-[11px] text-slate-500">SK Taman Sri Pulai</p>
          </div>
        </div>
      </div>
    </div>
  );
};
