import React, { useState } from 'react';
import {
  Order,
  ClassItem,
  PhotoPackage,
  OrderStatus,
  PaymentStatus,
  SystemSettings,
} from '../../types';
import { StorageService } from '../../lib/storage';
import { exportOrdersToCsv } from '../../lib/exportUtils';
import {
  googleSignIn,
  googleLogout,
  getAccessToken,
  syncOrdersToGoogleDrive,
} from '../../lib/googleDrive';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  AlertTriangle,
  X,
  Cloud,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface OrdersManagerProps {
  orders: Order[];
  classes: ClassItem[];
  packages: PhotoPackage[];
  settings: SystemSettings;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({
  orders,
  classes,
  packages,
  settings,
}) => {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterPackage, setFilterPackage] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPayment, setFilterPayment] = useState('ALL');

  // Google Drive Sync State
  const [isSyncingDrive, setIsSyncingDrive] = useState(false);
  const [driveSyncResult, setDriveSyncResult] = useState<{
    success: boolean;
    message: string;
    webViewLink?: string;
  } | null>(null);
  const [driveUserEmail, setDriveUserEmail] = useState<string | null>(null);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState<Order | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Manual Add Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNumber, setNewStudentNumber] = useState('');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || '');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newPackageId, setNewPackageId] = useState(packages[0]?.id || '');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'Bank Transfer' | 'Tunai / Manual'>('Tunai / Manual');

  const activeClasses = classes.filter((c) => c.isActive);
  const activePackages = packages.filter((p) => p.isActive);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      o.orderNumber.toLowerCase().includes(term) ||
      o.studentName.toLowerCase().includes(term) ||
      o.parentName.toLowerCase().includes(term) ||
      o.parentPhone.includes(term);

    const matchClass = filterClass === 'ALL' || o.classId === filterClass;
    const matchPkg = filterPackage === 'ALL' || o.packageId === filterPackage;
    const matchStatus = filterStatus === 'ALL' || o.orderStatus === filterStatus;
    const matchPayment = filterPayment === 'ALL' || o.paymentStatus === filterPayment;

    return matchSearch && matchClass && matchPkg && matchStatus && matchPayment;
  });

  // Handle Manual Add
  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const cls = classes.find((c) => c.id === newClassId);
    const pkg = packages.find((p) => p.id === newPackageId);
    if (!cls || !pkg || !newStudentName || !newParentName || !newParentPhone) return;

    StorageService.createOrder({
      studentName: newStudentName,
      studentNumber: newStudentNumber || undefined,
      classId: cls.id,
      className: cls.name,
      year: cls.year,
      parentName: newParentName,
      parentPhone: newParentPhone,
      packageId: pkg.id,
      packageName: `${pkg.code} (${pkg.name})`,
      packagePrice: pkg.price,
      paymentMethod: newPaymentMethod,
    });

    setIsAddModalOpen(false);
    setNewStudentName('');
    setNewStudentNumber('');
    setNewParentName('');
    setNewParentPhone('');
  };

  // Handle Status Update
  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    StorageService.updateOrderStatus(id, newStatus);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  // Handle Payment Update
  const handleUpdatePayment = (id: string, newPaymentStatus: PaymentStatus) => {
    StorageService.updatePaymentStatus(id, newPaymentStatus);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus });
    }
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    StorageService.deleteOrder(id);
    setDeleteConfirmId(null);
    if (selectedOrder?.id === id) setSelectedOrder(null);
  };

  // Handle Google Drive Sync
  const handleSyncGoogleDrive = async () => {
    setIsSyncingDrive(true);
    setDriveSyncResult(null);

    try {
      let token = await getAccessToken();
      if (!token) {
        const signin = await googleSignIn();
        if (signin) {
          token = signin.accessToken;
          setDriveUserEmail(signin.user.email);
        }
      }

      if (!token) {
        setIsSyncingDrive(false);
        setDriveSyncResult({
          success: false,
          message: 'Sila log masuk akaun Google untuk menyegerakkan data ke Google Drive.',
        });
        return;
      }

      const res = await syncOrdersToGoogleDrive(orders, token);
      if (res.success) {
        setDriveSyncResult({
          success: true,
          message: `Berjaya disegerakkan ke Google Drive! Fail "${res.fileName}" dalam folder SKTSP_FOTOGRAFI_2026.`,
          webViewLink: res.webViewLink,
        });
      } else {
        setDriveSyncResult({
          success: false,
          message: res.error || 'Gagal menyegerakkan ke Google Drive.',
        });
      }
    } catch (err: any) {
      setDriveSyncResult({
        success: false,
        message: err.message || 'Ralat semasa sambungan Google Drive.',
      });
    } finally {
      setIsSyncingDrive(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#163B65]">Pengurusan Tempahan Murid</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lihat, kemaskini status bayaran dan uruskan keseluruhan tempahan fotografi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sync to Google Drive Button */}
          <button
            onClick={handleSyncGoogleDrive}
            disabled={isSyncingDrive}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isSyncingDrive
                ? 'bg-emerald-100 text-emerald-800 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isSyncingDrive ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Cloud className="w-3.5 h-3.5" />
            )}
            <span>{isSyncingDrive ? 'Sedang Sync...' : 'Sync ke Google Drive'}</span>
          </button>

          <button
            onClick={() => exportOrdersToCsv(filteredOrders)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Eksport CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#163B65] text-white text-xs font-bold hover:bg-[#102C4E] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#E6B85C]" />
            <span>Tambah Tempahan Manual</span>
          </button>
        </div>
      </div>

      {/* Google Drive Sync Result Banner */}
      {driveSyncResult && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            driveSyncResult.success
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {driveSyncResult.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{driveSyncResult.message}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {driveSyncResult.webViewLink && (
              <a
                href={driveSyncResult.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-emerald-300 rounded text-emerald-800 font-bold hover:bg-emerald-100"
              >
                <span>Buka Google Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={() => setDriveSyncResult(null)}
              className="p-1 hover:bg-black/5 rounded text-slate-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari Order ID, nama murid..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
          </div>

          {/* Class Filter */}
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65] bg-white"
          >
            <option value="ALL">Semua Kelas</option>
            {activeClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.year})
              </option>
            ))}
          </select>

          {/* Package Filter */}
          <select
            value={filterPackage}
            onChange={(e) => setFilterPackage(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65] bg-white"
          >
            <option value="ALL">Semua Pakej</option>
            {activePackages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - RM{p.price}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65] bg-white"
          >
            <option value="ALL">Semua Status Tempahan</option>
            <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
            <option value="Menunggu Pengesahan Bayaran">Menunggu Pengesahan Bayaran</option>
            <option value="Bayaran Disahkan">Bayaran Disahkan</option>
            <option value="Dalam Proses Cetakan">Dalam Proses Cetakan</option>
            <option value="Sedia Diambil">Sedia Diambil</option>
            <option value="Telah Diserahkan">Telah Diserahkan</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>

          {/* Payment Filter */}
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65] bg-white"
          >
            <option value="ALL">Semua Status Bayaran</option>
            <option value="Pending">Pending (Belum Bayar)</option>
            <option value="Under Review">Under Review (Semak Resit)</option>
            <option value="Approved">Approved (Sah)</option>
            <option value="Rejected">Rejected (Ditolak)</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>Menunjukkan <strong>{filteredOrders.length}</strong> daripada {orders.length} tempahan</span>
          {(searchTerm || filterClass !== 'ALL' || filterPackage !== 'ALL' || filterStatus !== 'ALL' || filterPayment !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterClass('ALL');
                setFilterPackage('ALL');
                setFilterStatus('ALL');
                setFilterPayment('ALL');
              }}
              className="text-[#4A90D9] hover:underline font-semibold"
            >
              Set Semula Penapis
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#163B65] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">No. Tempahan</th>
                <th className="py-3 px-4 font-semibold">Nama Murid</th>
                <th className="py-3 px-4 font-semibold">Kelas</th>
                <th className="py-3 px-4 font-semibold">Penjaga & Telefon</th>
                <th className="py-3 px-4 font-semibold">Pakej</th>
                <th className="py-3 px-4 font-semibold text-right">Jumlah</th>
                <th className="py-3 px-4 font-semibold text-center">Status Bayaran</th>
                <th className="py-3 px-4 font-semibold text-center">Status Tempahan</th>
                <th className="py-3 px-4 font-semibold text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tiada rekod tempahan dijumpai berdasarkan carian/penapis.
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
                      {ord.studentNumber && (
                        <p className="text-[10px] text-slate-400 font-mono">{ord.studentNumber}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{ord.className}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{ord.parentName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{ord.parentPhone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{ord.packageNameSnapshot}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900 whitespace-nowrap">
                      RM {ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          ord.paymentStatus === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.paymentStatus === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.paymentStatus === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-800">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 text-slate-600 hover:text-[#163B65] hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Lihat Butiran Penuh"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowReceiptModal(ord)}
                          className="p-1.5 text-slate-600 hover:text-[#163B65] hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Cetak Resit"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(ord.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Padam Tempahan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 bg-[#163B65] text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm">Butiran Penuh Tempahan</h3>
                <p className="text-xs text-[#E6B85C] font-mono">{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block">Maklumat Murid</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedOrder.studentName}</p>
                  <p className="text-slate-700">Kelas: {selectedOrder.className} ({selectedOrder.year})</p>
                  {selectedOrder.studentNumber && <p className="font-mono text-slate-500">ID: {selectedOrder.studentNumber}</p>}
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block">Maklumat Penjaga</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedOrder.parentName}</p>
                  <p className="font-mono text-slate-700">Telefon: {selectedOrder.parentPhone}</p>
                  {selectedOrder.parentEmail && <p className="text-slate-500">Emel: {selectedOrder.parentEmail}</p>}
                </div>
              </div>

              {/* Status Manager Controls */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Tukar Status Tempahan & Bayaran
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status Tempahan:</label>
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                      className="w-full p-2 bg-white rounded border border-slate-300 font-semibold text-slate-800"
                    >
                      <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                      <option value="Menunggu Pengesahan Bayaran">Menunggu Pengesahan Bayaran</option>
                      <option value="Bayaran Disahkan">Bayaran Disahkan</option>
                      <option value="Dalam Proses Cetakan">Dalam Proses Cetakan</option>
                      <option value="Sedia Diambil">Sedia Diambil</option>
                      <option value="Telah Diserahkan">Telah Diserahkan</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status Pembayaran:</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handleUpdatePayment(selectedOrder.id, e.target.value as PaymentStatus)}
                      className="w-full p-2 bg-white rounded border border-slate-300 font-semibold text-slate-800"
                    >
                      <option value="Pending">Pending (Belum Bayar)</option>
                      <option value="Under Review">Under Review (Semak Resit)</option>
                      <option value="Approved">Approved (Sah)</option>
                      <option value="Rejected">Rejected (Tolak)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Proof Preview if present */}
              {selectedOrder.paymentProofUrl && (
                <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                  <span className="font-bold text-slate-700 block">Bukti Pembayaran Dilampirkan:</span>
                  <div className="max-h-48 overflow-hidden rounded border border-slate-200 bg-slate-100 flex items-center justify-center">
                    <img
                      src={selectedOrder.paymentProofUrl}
                      alt="Bukti Bayaran"
                      className="max-h-48 object-contain"
                    />
                  </div>
                  {selectedOrder.paymentProofFileName && (
                    <p className="text-[11px] text-slate-500 font-mono">
                      Nama Fail: {selectedOrder.paymentProofFileName}
                    </p>
                  )}
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => setShowReceiptModal(selectedOrder)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Resit</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-[#163B65] text-white rounded font-bold hover:bg-[#102C4E]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 bg-[#163B65] text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm">Tambah Tempahan Murid Secara Manual</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrder} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Nama Penuh Murid *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama murid mengikut surat beranak"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded border border-slate-300 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Kelas *</label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-white"
                  >
                    {activeClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">No. Murid (Pilihan)</label>
                  <input
                    type="text"
                    placeholder="Contoh: TSP26011"
                    value={newStudentNumber}
                    onChange={(e) => setNewStudentNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Nama Penjaga *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama ibu/bapa"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">No. Tel Penjaga *</label>
                  <input
                    type="tel"
                    required
                    placeholder="012-3456789"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Pakej Gambar *</label>
                  <select
                    value={newPackageId}
                    onChange={(e) => setNewPackageId(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-white"
                  >
                    {activePackages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} - RM{p.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Kaedah Bayaran</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-white"
                  >
                    <option value="Tunai / Manual">Tunai / Bayaran Kaunter</option>
                    <option value="Bank Transfer">Bank Transfer / DuitNow</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#163B65] text-white rounded font-bold hover:bg-[#102C4E] cursor-pointer"
                >
                  Simpan Tempahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 text-center border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">Padam Tempahan?</h3>
            <p className="text-xs text-slate-600">
              Adakah anda pasti mahu memadam rekod tempahan ini? Tindakan ini tidak boleh diundur.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-lg border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer"
              >
                Ya, Padam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {showReceiptModal && (
        <ReceiptModal
          order={showReceiptModal}
          settings={settings}
          onClose={() => setShowReceiptModal(null)}
        />
      )}
    </div>
  );
};
