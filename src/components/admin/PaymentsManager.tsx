import React, { useState } from 'react';
import { Order, PaymentStatus, SystemSettings } from '../../types';
import { StorageService } from '../../lib/storage';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Printer,
  Search,
  Filter,
  AlertCircle,
  X,
  FileCheck,
  Check,
} from 'lucide-react';

interface PaymentsManagerProps {
  orders: Order[];
  settings: SystemSettings;
}

export const PaymentsManager: React.FC<PaymentsManagerProps> = ({ orders, settings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [previewProofOrder, setPreviewProofOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Total collected approved
  const totalApproved = orders
    .filter((o) => o.paymentStatus === 'Approved')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const underReviewCount = orders.filter((o) => o.paymentStatus === 'Under Review').length;

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      o.orderNumber.toLowerCase().includes(term) ||
      o.studentName.toLowerCase().includes(term) ||
      o.parentName.toLowerCase().includes(term) ||
      (o.paymentReference && o.paymentReference.toLowerCase().includes(term));

    const matchStatus = statusFilter === 'ALL' || o.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = (order: Order) => {
    StorageService.updatePaymentStatus(order.id, 'Approved');
  };

  const handleConfirmReject = () => {
    if (!rejectModalOrder) return;
    StorageService.updatePaymentStatus(rejectModalOrder.id, 'Rejected', rejectReason || 'Resit tidak sah atau bayaran belum diterima');
    setRejectModalOrder(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#163B65]">Pengurusan Pembayaran & Resit</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Semak bukti pindahan bank, luluskan transaksi dan pantau kutipan bayaran.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-right">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block">Jumlah Kutipan Sah</span>
            <span className="text-lg font-black text-emerald-900 font-mono tabular-nums">
              RM {totalApproved.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and stats row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Cari No. Tempahan, nama murid, rujukan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65] bg-white"
          >
            <option value="ALL">Semua Status Bayaran</option>
            <option value="Under Review">Under Review ({underReviewCount})</option>
            <option value="Approved">Approved (Sah)</option>
            <option value="Pending">Pending (Belum Bayar)</option>
            <option value="Rejected">Rejected (Ditolak)</option>
            <option value="Refunded">Refunded (Dipulangkan)</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-500 whitespace-nowrap">
          Menunjukkan <strong>{filteredOrders.length}</strong> transaksi
        </span>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#163B65] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">No. Tempahan</th>
                <th className="py-3 px-4 font-semibold">Nama Murid & Kelas</th>
                <th className="py-3 px-4 font-semibold">Kaedah</th>
                <th className="py-3 px-4 font-semibold text-right">Jumlah (RM)</th>
                <th className="py-3 px-4 font-semibold text-center">Bukti Bayaran</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Tindakan Kelulusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tiada rekod pembayaran dijumpai.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#163B65] whitespace-nowrap">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{ord.studentName}</p>
                      <p className="text-[11px] text-slate-500">{ord.className} · {ord.packageNameSnapshot}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-700">{ord.paymentMethod}</span>
                      {ord.paymentReference && (
                        <span className="block text-[10px] font-mono text-slate-400">Ref: {ord.paymentReference}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900 whitespace-nowrap">
                      RM {ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {ord.paymentProofUrl || ord.paymentProofFileName ? (
                        <button
                          onClick={() => setPreviewProofOrder(ord)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-[#163B65] font-semibold text-[11px] hover:bg-blue-100 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Papar Resit</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Tiada Resit</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          ord.paymentStatus === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.paymentStatus === 'Under Review'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : ord.paymentStatus === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {ord.paymentStatus !== 'Approved' && (
                          <button
                            onClick={() => handleApprove(ord)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] cursor-pointer"
                            title="Luluskan Pembayaran"
                          >
                            <Check className="w-3 h-3" />
                            <span>Sahkan</span>
                          </button>
                        )}
                        {ord.paymentStatus !== 'Rejected' && ord.paymentStatus !== 'Approved' && (
                          <button
                            onClick={() => {
                              setRejectModalOrder(ord);
                              setRejectReason('');
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded text-[11px] cursor-pointer"
                            title="Tolak Pembayaran"
                          >
                            <X className="w-3 h-3" />
                            <span>Tolak</span>
                          </button>
                        )}
                        <button
                          onClick={() => setReceiptOrder(ord)}
                          className="p-1 text-slate-500 hover:text-[#163B65] hover:bg-slate-100 rounded cursor-pointer"
                          title="Cetak Resit"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lightbox Modal for Payment Proof Slip */}
      {previewProofOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 bg-[#163B65] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider">
                  Bukti Bayaran: {previewProofOrder.orderNumber}
                </h3>
                <p className="text-[11px] text-slate-300">
                  {previewProofOrder.studentName} (RM {previewProofOrder.totalAmount.toFixed(2)})
                </p>
              </div>
              <button
                onClick={() => setPreviewProofOrder(null)}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex flex-col items-center justify-center max-h-[70vh] overflow-y-auto bg-slate-100">
              {previewProofOrder.paymentProofUrl ? (
                <img
                  src={previewProofOrder.paymentProofUrl}
                  alt="Bukti Bayaran"
                  className="max-w-full max-h-[60vh] object-contain rounded border border-slate-300 shadow-xs"
                />
              ) : (
                <div className="p-12 text-center text-slate-400 text-xs">
                  Fail slip bayaran: {previewProofOrder.paymentProofFileName || 'Tiada imej'}
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500">{previewProofOrder.paymentProofFileName}</span>
              <div className="flex gap-2">
                {previewProofOrder.paymentStatus !== 'Approved' && (
                  <button
                    onClick={() => {
                      handleApprove(previewProofOrder);
                      setPreviewProofOrder(null);
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                  >
                    Luluskan Bayaran Ini
                  </button>
                )}
                <button
                  onClick={() => setPreviewProofOrder(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Modal with Reason */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 border border-slate-200 text-xs">
            <h3 className="font-extrabold text-base text-slate-900">Tolak Bukti Pembayaran?</h3>
            <p className="text-slate-600">
              Sila nyatakan sebab penolakan resit bagi tempahan <strong>{rejectModalOrder.orderNumber}</strong>:
            </p>

            <textarea
              rows={3}
              placeholder="Contoh: Resit kabur / Jumlah transaksi tidak mencukupi / Nama penerima salah"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2.5 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRejectModalOrder(null)}
                className="flex-1 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 cursor-pointer"
              >
                Tolak Bayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {receiptOrder && (
        <ReceiptModal
          order={receiptOrder}
          settings={settings}
          onClose={() => setReceiptOrder(null)}
        />
      )}
    </div>
  );
};
