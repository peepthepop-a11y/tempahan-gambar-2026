import React, { useState } from 'react';
import { Order, ClassItem, PhotoPackage, SystemSettings } from '../../types';
import { StorageService } from '../../lib/storage';
import { SchoolEmblem } from '../common/SchoolEmblem';
import {
  Printer,
  CheckCircle2,
  Clock,
  Filter,
  Check,
  Send,
  PackageCheck,
  ArrowRight,
} from 'lucide-react';

interface PrintingManagerProps {
  orders: Order[];
  classes: ClassItem[];
  packages: PhotoPackage[];
  settings: SystemSettings;
}

export const PrintingManager: React.FC<PrintingManagerProps> = ({
  orders,
  classes,
  packages,
  settings,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('ALL');
  const [isPrintListMode, setIsPrintListMode] = useState(false);

  // Filter only orders that are verified/confirmed for printing (or already in printing stages)
  const confirmedOrders = orders.filter((o) => {
    const isPaid = o.paymentStatus === 'Approved';
    const matchClass = selectedClassId === 'ALL' || o.classId === selectedClassId;
    const matchPkg = selectedPackageId === 'ALL' || o.packageId === selectedPackageId;
    return isPaid && matchClass && matchPkg && o.orderStatus !== 'Dibatalkan';
  });

  const handleUpdateStatus = (orderId: string, nextStatus: any) => {
    StorageService.updateOrderStatus(orderId, nextStatus);
  };

  const handlePrintBatch = () => {
    window.print();
  };

  const selectedClassObj = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#163B65]">Modul Cetakan & Agihan Gambar</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau status proses makmal cetakan foto dan jana senarai serahan mengikut kelas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPrintListMode(!isPrintListMode)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              isPrintListMode
                ? 'bg-[#163B65] text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>{isPrintListMode ? 'Tutup Senarai Cetakan' : 'Papar Senarai Cetakan Kelas'}</span>
          </button>
        </div>
      </div>

      {/* Filters (Hidden in print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Tapis Kelas:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">Semua Kelas ({orders.filter((o) => o.paymentStatus === 'Approved').length})</option>
            {classes.map((c) => {
              const count = orders.filter((o) => o.classId === c.id && o.paymentStatus === 'Approved').length;
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({count} disahkan)
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Pakej:</span>
          <select
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">Semua Pakej</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code}
              </option>
            ))}
          </select>
        </div>

        <span className="text-[11px] text-slate-500 ml-auto">
          <strong>{confirmedOrders.length}</strong> tempahan disahkan sedia untuk cetakan/agihan
        </span>
      </div>

      {/* PRINT LIST VIEW (Formatted for A4 Printing & Class Checkoff) */}
      {isPrintListMode ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="no-print flex items-center justify-between pb-4 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-600">
              Format cetakan rasmi senarai semak agihan gambar kelas.
            </span>
            <button
              onClick={handlePrintBatch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#163B65] text-white font-bold text-xs rounded-lg hover:bg-[#102C4E] cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Senarai Ini Sekarang</span>
            </button>
          </div>

          {/* Printable Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SchoolEmblem size="lg" />
              <div>
                <h2 className="font-black text-lg text-[#163B65]">{settings.schoolName}</h2>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  SENARAI SEMAK AGIHAN GAMBAR MURID · SESI {settings.sessionYear}
                </h3>
                <p className="text-xs text-slate-500">
                  Kelas: <strong>{selectedClassObj ? selectedClassObj.name : 'Semua Kelas'}</strong>
                  {selectedClassObj?.teacherName && ` · Guru Kelas: ${selectedClassObj.teacherName}`}
                </p>
              </div>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-900">Tarikh Cetakan:</p>
              <p className="font-mono">{new Date().toLocaleDateString('ms-MY')}</p>
              <p className="text-slate-500 mt-1">Jumlah: {confirmedOrders.length} Murid</p>
            </div>
          </div>

          {/* Checklist Table */}
          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 border-b border-slate-300">
              <tr>
                <th className="py-2 px-3 border-r border-slate-300 w-10 text-center">Bil</th>
                <th className="py-2 px-3 border-r border-slate-300">Nama Penuh Murid</th>
                <th className="py-2 px-3 border-r border-slate-300 w-24">Kelas</th>
                <th className="py-2 px-3 border-r border-slate-300">Pakej Gambar</th>
                <th className="py-2 px-3 border-r border-slate-300 w-28 text-center">No. Tempahan</th>
                <th className="py-2 px-3 border-r border-slate-300 w-20 text-center">Status Makmal</th>
                <th className="py-2 px-3 w-28 text-center">Tandatangan Serahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {confirmedOrders.map((ord, idx) => (
                <tr key={ord.id} className="h-10">
                  <td className="py-1 px-3 border-r border-slate-300 text-center font-mono">{idx + 1}</td>
                  <td className="py-1 px-3 border-r border-slate-300 font-bold text-slate-900">
                    {ord.studentName}
                  </td>
                  <td className="py-1 px-3 border-r border-slate-300 font-medium">{ord.className}</td>
                  <td className="py-1 px-3 border-r border-slate-300">{ord.packageNameSnapshot}</td>
                  <td className="py-1 px-3 border-r border-slate-300 font-mono text-center text-[11px]">
                    {ord.orderNumber}
                  </td>
                  <td className="py-1 px-3 border-r border-slate-300 text-center text-[10px] font-semibold">
                    {ord.orderStatus}
                  </td>
                  <td className="py-1 px-3 text-center border-b border-slate-200">
                    <div className="w-5 h-5 border border-slate-400 mx-auto rounded-xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signoff Footer */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-slate-700">
            <div>
              <p className="font-bold">Disahkan oleh Fotografer / Makmal Cetakan:</p>
              <div className="h-14 border-b border-slate-400 mt-2" />
              <p className="mt-1 text-[11px] text-slate-500">Nama & Tandatangan Jurufoto</p>
            </div>
            <div>
              <p className="font-bold">Diterima oleh Guru Kelas / Penyelaras:</p>
              <div className="h-14 border-b border-slate-400 mt-2" />
              <p className="mt-1 text-[11px] text-slate-500">Nama & Tandatangan Guru</p>
            </div>
          </div>
        </div>
      ) : (
        /* INTERACTIVE BATCH MANAGEMENT TABLE */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#163B65] text-white">
                <tr>
                  <th className="py-3 px-4 font-semibold">No. Tempahan</th>
                  <th className="py-3 px-4 font-semibold">Nama Murid</th>
                  <th className="py-3 px-4 font-semibold">Kelas</th>
                  <th className="py-3 px-4 font-semibold">Pakej</th>
                  <th className="py-3 px-4 font-semibold text-center">Status Semasa</th>
                  <th className="py-3 px-4 font-semibold text-center">Tindakan Workflow Cetakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {confirmedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Tiada tempahan disahkan untuk cetakan mengikut pilihan kelas ini.
                    </td>
                  </tr>
                ) : (
                  confirmedOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#163B65]">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{ord.studentName}</td>
                      <td className="py-3 px-4 font-medium">{ord.className}</td>
                      <td className="py-3 px-4">{ord.packageNameSnapshot}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            ord.orderStatus === 'Telah Diserahkan'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.orderStatus === 'Sedia Diambil'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.orderStatus === 'Dalam Proses Cetakan'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {ord.orderStatus !== 'Dalam Proses Cetakan' && ord.orderStatus !== 'Sedia Diambil' && ord.orderStatus !== 'Telah Diserahkan' && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'Dalam Proses Cetakan')}
                              className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded text-[11px] font-semibold cursor-pointer"
                            >
                              Mula Cetak
                            </button>
                          )}
                          {ord.orderStatus === 'Dalam Proses Cetakan' && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'Sedia Diambil')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold cursor-pointer"
                            >
                              Sedia Diambil
                            </button>
                          )}
                          {ord.orderStatus === 'Sedia Diambil' && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'Telah Diserahkan')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer"
                            >
                              Tandakan Diserah
                            </button>
                          )}
                          {ord.orderStatus === 'Telah Diserahkan' && (
                            <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Selesai</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
