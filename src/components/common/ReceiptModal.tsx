import React from 'react';
import { Order, SystemSettings } from '../../types';
import { SchoolEmblem } from './SchoolEmblem';
import { Printer, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  settings: SystemSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, settings, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header Actions (hidden in print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Salinan Resit Rasmi
            </span>
            <span className="text-xs font-mono font-bold text-[#163B65] bg-slate-200/80 px-2 py-0.5 rounded">
              {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#163B65] text-white text-xs font-semibold rounded hover:bg-[#102C4E] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Resit</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-800">
          {/* School Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div className="flex items-center gap-4">
              <SchoolEmblem size="lg" />
              <div>
                <h1 className="text-lg font-black tracking-tight text-[#163B65]">
                  {settings.schoolName}
                </h1>
                <p className="text-xs text-slate-600 font-medium">{settings.schoolAddress}</p>
                <p className="text-xs text-slate-500">Tel: {settings.schoolPhone} · Email: {settings.contactEmail}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
                RESIT TEMPAHAN
              </span>
              <span className="text-base font-black font-mono text-[#163B65]">
                {order.orderNumber}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Tarikh: {new Date(order.createdAt).toLocaleDateString('ms-MY', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Status Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              {order.paymentStatus === 'Approved' ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>PEMBAYARAN DISAHKAN</span>
                </div>
              ) : order.paymentStatus === 'Under Review' ? (
                <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>MENUNGGU PENGESAHAN BAYARAN</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-600 font-bold text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>MENUNGGU PEMBAYARAN</span>
                </div>
              )}
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-500">Status Tempahan: </span>
              <span className="font-bold text-[#163B65]">{order.orderStatus}</span>
            </div>
          </div>

          {/* Student & Parent Info Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5 bg-slate-50/60 p-4 rounded border border-slate-100">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                MAKLUMAT MURID
              </span>
              <p className="font-bold text-slate-900 text-sm">{order.studentName}</p>
              <p className="text-slate-700">Kelas: <span className="font-semibold">{order.className}</span> ({order.year})</p>
              {order.studentNumber && (
                <p className="text-slate-500 font-mono">No. Murid: {order.studentNumber}</p>
              )}
            </div>

            <div className="space-y-1.5 bg-slate-50/60 p-4 rounded border border-slate-100">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                MAKLUMAT IBU BAPA / PENJAGA
              </span>
              <p className="font-bold text-slate-900 text-sm">{order.parentName}</p>
              <p className="text-slate-700">No. Telefon: <span className="font-semibold font-mono">{order.parentPhone}</span></p>
              {order.parentEmail && (
                <p className="text-slate-500">{order.parentEmail}</p>
              )}
            </div>
          </div>

          {/* Order Item Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#163B65] text-white">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Perkara / Pakej Fotografi</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-20">Kuantiti</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-28">Harga (RM)</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-28">Jumlah (RM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{order.packageNameSnapshot}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Sesi Fotografi Rasmi Sekolah {settings.sessionYear}</p>
                  </td>
                  <td className="py-3 px-4 text-center font-mono">{order.quantity}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">{order.packagePriceSnapshot.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right text-slate-700 uppercase tracking-wider text-[11px]">
                    JUMLAH KESELURUHAN (RM)
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-[#163B65]">
                    RM {order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Reference & Bank Details */}
          <div className="p-4 rounded-lg bg-slate-50 text-xs space-y-2 border border-slate-200">
            <div className="flex justify-between items-center text-slate-600">
              <span>Kaedah Bayaran: <strong className="text-slate-900">{order.paymentMethod}</strong></span>
              {order.paymentReference && (
                <span>Rujukan: <strong className="font-mono text-slate-900">{order.paymentReference}</strong></span>
              )}
            </div>
            {order.paymentProofFileName && (
              <p className="text-slate-500 text-[11px]">
                Fail Resit: <span className="font-mono text-slate-700">{order.paymentProofFileName}</span>
              </p>
            )}
            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
              Akaun Penerima: {settings.bankName} - {settings.bankAccountNumber} ({settings.bankAccountHolder})
            </div>
          </div>

          {/* Footer Notes & Verification Notice */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <p>Resit ini dijana secara berkomputer dan sah tanpa tandatangan fizikal.</p>
              <p>Sebarang pertanyaan sila hubungi pihak sekolah atau guru kelas.</p>
            </div>
            <div className="text-right font-mono text-[10px] text-slate-400">
              Dicetak: {new Date().toLocaleString('ms-MY')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
