import React, { useState } from 'react';
import { Order, SystemSettings, OrderStatus } from '../../types';
import { StorageService } from '../../lib/storage';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Upload,
  AlertCircle,
  FileCheck,
  Package,
  Calendar,
  CreditCard,
  ShieldCheck,
  Camera,
} from 'lucide-react';

interface CheckOrderPageProps {
  settings: SystemSettings;
  onNavigate: (route: string) => void;
}

export const CheckOrderPage: React.FC<CheckOrderPageProps> = ({ settings, onNavigate }) => {
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [parentPhone, setParentPhone] = useState<string>('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState<boolean>(false);

  // Late payment slip upload
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setUploadSuccess(false);

    if (!orderNumber.trim() || !parentPhone.trim()) {
      setErrorMsg('Sila masukkan No. Tempahan dan No. Telefon Penjaga.');
      return;
    }

    const order = StorageService.getOrderByNumberAndPhone(orderNumber, parentPhone);
    setHasSearched(true);

    if (order) {
      setSearchedOrder(order);
    } else {
      setSearchedOrder(null);
      setErrorMsg('Tiada tempahan ditemui dengan padanan No. Tempahan dan No. Telefon tersebut. Sila semak semula maklumat anda.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Saiz fail melebihi had 5MB.');
        return;
      }
      setProofFile(file);
      setProofFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProofPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProof = () => {
    if (!searchedOrder || !proofPreview) return;
    const updated = StorageService.updateOrder(searchedOrder.id, {
      paymentProofUrl: proofPreview,
      paymentProofFileName: proofFileName,
      paymentStatus: 'Under Review',
      orderStatus: 'Menunggu Pengesahan Bayaran',
      paymentDate: new Date().toISOString(),
    });
    if (updated) {
      setSearchedOrder(updated);
      setUploadSuccess(true);
      setProofFile(null);
      setProofPreview('');
    }
  };

  // Status step progression helper
  const statusSteps: OrderStatus[] = [
    'Menunggu Pembayaran',
    'Menunggu Pengesahan Bayaran',
    'Bayaran Disahkan',
    'Dalam Proses Cetakan',
    'Sedia Diambil',
    'Telah Diserahkan',
  ];

  const getStatusIndex = (current: OrderStatus) => {
    if (current === 'Dibatalkan') return -1;
    return statusSteps.indexOf(current);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4A90D9]">
          Portal Semakan Status
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#163B65] mt-1">
          Semakan Status Tempahan Gambar
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Masukkan No. Tempahan dan No. Telefon Penjaga yang didaftarkan semasa membuat tempahan.
        </p>
      </div>

      {/* Search Card Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Nombor Tempahan (Order ID) <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: STSP-2026-00001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 text-xs font-mono uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Nombor Telefon Penjaga <span className="text-rose-600">*</span>
              </label>
              <input
                type="tel"
                placeholder="Contoh: 012-7654321 atau 0198765432"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#4A90D9]" />
              <span>Pengesahan dua faktor bagi melindungi privasi maklumat murid.</span>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#163B65] hover:bg-[#102C4E] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>Semak Sekarang</span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Result Display */}
      {hasSearched && searchedOrder && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Order Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                NO. TEMPAHAN RASMI
              </span>
              <span className="text-xl font-black font-mono text-[#163B65]">
                {searchedOrder.orderNumber}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Tarikh Didaftar: {new Date(searchedOrder.createdAt).toLocaleDateString('ms-MY', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Status Semasa:</span>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  searchedOrder.orderStatus === 'Dibatalkan'
                    ? 'bg-rose-100 text-rose-800'
                    : searchedOrder.orderStatus === 'Telah Diserahkan'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#163B65] text-white'
                }`}
              >
                {searchedOrder.orderStatus}
              </span>
            </div>
          </div>

          {/* Progress Timeline */}
          {searchedOrder.orderStatus !== 'Dibatalkan' && (
            <div className="py-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">
                Kemajuan Tempahan:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[11px]">
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStatusIndex(searchedOrder.orderStatus);
                  const isPassed = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div
                      key={step}
                      className={`p-2.5 rounded-lg border flex flex-col items-center justify-center transition-colors ${
                        isCurrent
                          ? 'border-[#163B65] bg-[#F5F8FC] font-bold text-[#163B65] ring-1 ring-[#163B65]'
                          : isPassed
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold'
                          : 'border-slate-100 bg-slate-50 text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] mb-1 ${
                          isPassed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span className="leading-tight">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                MAKLUMAT MURID
              </span>
              <p className="font-bold text-slate-900 text-sm">{searchedOrder.studentName}</p>
              <p className="text-slate-700">
                Kelas: <span className="font-semibold">{searchedOrder.className}</span> ({searchedOrder.year})
              </p>
              {searchedOrder.studentNumber && (
                <p className="text-slate-500 font-mono">No. Murid: {searchedOrder.studentNumber}</p>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                PAKEJ & BAYARAN
              </span>
              <p className="font-bold text-[#163B65] text-sm">{searchedOrder.packageNameSnapshot}</p>
              <div className="flex justify-between items-center text-slate-700">
                <span>Jumlah Bayaran:</span>
                <span className="font-mono font-bold text-sm text-slate-900">
                  RM {searchedOrder.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span>Status Bayaran:</span>
                <span
                  className={`font-semibold ${
                    searchedOrder.paymentStatus === 'Approved'
                      ? 'text-emerald-700'
                      : searchedOrder.paymentStatus === 'Under Review'
                      ? 'text-amber-700'
                      : 'text-slate-600'
                  }`}
                >
                  {searchedOrder.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Note if any */}
          {searchedOrder.adminNotes && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
              <strong>Nota Pentadbir Sekolah:</strong> {searchedOrder.adminNotes}
            </div>
          )}

          {/* Late Proof Upload Module if Pending Payment */}
          {searchedOrder.paymentStatus === 'Pending' && (
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-3">
              <h4 className="font-bold text-xs uppercase text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#4A90D9]" />
                <span>Hantar Bukti Pembayaran</span>
              </h4>
              <p className="text-xs text-slate-600">
                Anda belum memuat naik bukti transaksi atau status masih menunggu bayaran. Buat pindahan ke{' '}
                <strong>{settings.bankName} ({settings.bankAccountNumber})</strong> dan muat naik slip transaksi di bawah:
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#163B65] file:text-white hover:file:bg-[#102C4E]"
                />
                {proofPreview && (
                  <button
                    onClick={handleUploadProof}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition-colors cursor-pointer"
                  >
                    Muat Naik Slip Sekarang
                  </button>
                )}
              </div>

              {uploadSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 text-xs rounded flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Resit bayaran berjaya dihantar untuk semakan pentadbir.</span>
                </div>
              )}
            </div>
          )}

          {/* Actions Strip */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setShowReceipt(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan Resit Rasmi</span>
            </button>

            <button
              onClick={() => {
                setHasSearched(false);
                setSearchedOrder(null);
                setOrderNumber('');
                setParentPhone('');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Buat Semakan Lain
            </button>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {showReceipt && searchedOrder && (
        <ReceiptModal
          order={searchedOrder}
          settings={settings}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};
