import React, { useState } from 'react';
import { Student, ClassItem, Order } from '../../types';
import { StorageService } from '../../lib/storage';
import { exportStudentsToCsv, parseStudentsCsv } from '../../lib/exportUtils';
import {
  Users,
  Search,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit2,
  Eye,
  AlertCircle,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface StudentsManagerProps {
  students: Student[];
  classes: ClassItem[];
  orders: Order[];
}

export const StudentsManager: React.FC<StudentsManagerProps> = ({
  students,
  classes,
  orders,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Import Modal & Status
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importResult, setImportResult] = useState<{ count: number; errors: string[] } | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formNumber, setFormNumber] = useState('');
  const [formClassId, setFormClassId] = useState(classes[0]?.id || '');
  const [formGender, setFormGender] = useState<'Lelaki' | 'Perempuan'>('Lelaki');
  const [formParentName, setFormParentName] = useState('');
  const [formParentPhone, setFormParentPhone] = useState('');
  const [formParentEmail, setFormParentEmail] = useState('');

  const activeClasses = classes.filter((c) => c.isActive);

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      s.fullName.toLowerCase().includes(term) ||
      (s.studentNumber && s.studentNumber.toLowerCase().includes(term)) ||
      s.parentName.toLowerCase().includes(term) ||
      s.parentPhone.includes(term);

    const matchClass = filterClass === 'ALL' || s.classId === filterClass;
    return matchSearch && matchClass;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormName('');
    setFormNumber('');
    setFormClassId(classes[0]?.id || '');
    setFormGender('Lelaki');
    setFormParentName('');
    setFormParentPhone('');
    setFormParentEmail('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormName(student.fullName);
    setFormNumber(student.studentNumber || '');
    setFormClassId(student.classId);
    setFormGender(student.gender || 'Lelaki');
    setFormParentName(student.parentName);
    setFormParentPhone(student.parentPhone);
    setFormParentEmail(student.parentEmail || '');
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const cls = classes.find((c) => c.id === formClassId);
    if (!cls || !formName || !formParentName || !formParentPhone) return;

    if (editingStudent) {
      StorageService.updateStudent(editingStudent.id, {
        fullName: formName.toUpperCase(),
        studentNumber: formNumber.trim() || undefined,
        classId: cls.id,
        className: cls.name,
        year: cls.year,
        gender: formGender,
        parentName: formParentName,
        parentPhone: formParentPhone,
        parentEmail: formParentEmail.trim() || undefined,
      });
    } else {
      StorageService.addStudent({
        fullName: formName.toUpperCase(),
        studentNumber: formNumber.trim() || undefined,
        classId: cls.id,
        className: cls.name,
        year: cls.year,
        gender: formGender,
        parentName: formParentName,
        parentPhone: formParentPhone,
        parentEmail: formParentEmail.trim() || undefined,
      });
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    StorageService.deleteStudent(id);
    setDeleteConfirmId(null);
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseStudentsCsv(text, classes);

      if (parsed.validRows.length > 0) {
        const toAdd = parsed.validRows.map((r) => {
          const matchCls = classes.find((c) => c.name.toLowerCase() === r.className.toLowerCase()) || classes[0];
          return {
            fullName: r.fullName,
            studentNumber: r.studentNumber,
            classId: matchCls.id,
            className: matchCls.name,
            year: matchCls.year,
            gender: r.gender,
            parentName: r.parentName,
            parentPhone: r.parentPhone,
            parentEmail: r.parentEmail,
          };
        });
        const res = StorageService.bulkAddStudents(toAdd);
        setImportResult({ count: res.count, errors: [...parsed.errors, ...res.errors] });
      } else {
        setImportResult({ count: 0, errors: parsed.errors });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#163B65]">Pengurusan Murid & Pangkalan Data</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar murid, kemaskini profil dan import senarai murid mengikut kelas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportStudentsToCsv(filteredStudents)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Eksport CSV</span>
          </button>

          <button
            onClick={() => {
              setImportResult(null);
              setIsImportModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#4A90D9]" />
            <span>Import Excel/CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#163B65] text-white text-xs font-bold hover:bg-[#102C4E] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#E6B85C]" />
            <span>Daftar Murid Baharu</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Cari nama murid, no. telefon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
          </div>

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
        </div>

        <span className="text-[11px] text-slate-500 whitespace-nowrap">
          Menunjukkan <strong>{filteredStudents.length}</strong> murid
        </span>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#163B65] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">Nama Murid</th>
                <th className="py-3 px-4 font-semibold">Kelas & Tahun</th>
                <th className="py-3 px-4 font-semibold">Jantina</th>
                <th className="py-3 px-4 font-semibold">Nama Penjaga</th>
                <th className="py-3 px-4 font-semibold">No. Telefon</th>
                <th className="py-3 px-4 font-semibold text-center">Tempahan</th>
                <th className="py-3 px-4 font-semibold text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Tiada rekod murid ditemui.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const studentOrders = orders.filter(
                    (o) =>
                      o.studentId === st.id ||
                      o.studentName.toUpperCase() === st.fullName.toUpperCase()
                  );
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{st.fullName}</p>
                        {st.studentNumber && (
                          <p className="text-[10px] text-slate-400 font-mono">ID: {st.studentNumber}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{st.className}</span>
                        <span className="text-slate-400 text-[11px] block">{st.year}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{st.gender || '-'}</td>
                      <td className="py-3 px-4">{st.parentName}</td>
                      <td className="py-3 px-4 font-mono">{st.parentPhone}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            studentOrders.length > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {studentOrders.length} Tempahan
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setHistoryStudent(st)}
                            className="p-1.5 text-slate-600 hover:text-[#163B65] hover:bg-slate-100 rounded cursor-pointer"
                            title="Sejarah Tempahan"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(st)}
                            className="p-1.5 text-slate-600 hover:text-[#163B65] hover:bg-slate-100 rounded cursor-pointer"
                            title="Kemaskini"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(st.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Padam Murid"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 bg-[#163B65] text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm">
                {editingStudent ? 'Kemaskini Data Murid' : 'Daftar Murid Baharu'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Nama Penuh Murid *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama murid penuh mengikut sijil lahir"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded border border-slate-300 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Kelas *</label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-white"
                  >
                    {activeClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.year})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">No. Murid / MyKid</label>
                  <input
                    type="text"
                    placeholder="Contoh: TSP26011"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Jantina</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={formGender === 'Lelaki'}
                      onChange={() => setFormGender('Lelaki')}
                    />
                    <span>Lelaki</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={formGender === 'Perempuan'}
                      onChange={() => setFormGender('Perempuan')}
                    />
                    <span>Perempuan</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Nama Penjaga *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama ibu / bapa"
                    value={formParentName}
                    onChange={(e) => setFormParentName(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">No. Telefon *</label>
                  <input
                    type="tel"
                    required
                    placeholder="012-3456789"
                    value={formParentPhone}
                    onChange={(e) => setFormParentPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Emel Penjaga (Pilihan)</label>
                <input
                  type="email"
                  placeholder="penjaga@gmail.com"
                  value={formParentEmail}
                  onChange={(e) => setFormParentEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 bg-[#163B65] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#E6B85C]" />
                <h3 className="font-extrabold text-sm">Import Senarai Murid Pukal (CSV)</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                Muat naik fail CSV yang mengandungi senarai murid dengan <strong>2 lajur sahaja</strong> (Nama dan Kelas):
              </p>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                <div className="font-bold text-[#163B65]">Format Lajur:</div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  Nama Penuh Murid, Kelas
                </div>
                <div className="text-[10px] text-slate-500 pt-1">
                  Contoh: <code>MUHAMMAD RAYYAN BIN KHAIRUL, 1 Bestari</code>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Tiada templat?</span>
                <button
                  type="button"
                  onClick={() => {
                    const sampleCsv = '\uFEFFNama Penuh Murid,Kelas\r\nMUHAMMAD RAYYAN BIN KHAIRUL,1 Bestari\r\nNUR AISYAH BINTI AZMAN,1 Bestari\r\nAHMAD DANIEL BIN ROSLI,1 Cemerlang\r\nSITI NURHALIZA BINTI KAMAL,2 Bestari';
                    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'templat_murid_nama_kelas.csv';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="font-bold text-[#4A90D9] hover:underline cursor-pointer"
                >
                  Muat Turun Contoh Templat CSV (Nama & Kelas)
                </button>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center space-y-2">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <label className="block font-bold text-slate-800 cursor-pointer">
                  <span className="px-3.5 py-1.5 bg-[#163B65] text-white rounded text-xs inline-block hover:bg-[#102C4E]">Pilih Fail CSV</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleCsvFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-500">Format yang disokong: .csv (UTF-8 / Excel CSV)</p>
              </div>

              {/* Import Report */}
              {importResult && (
                <div
                  className={`p-4 rounded-lg border space-y-2 ${
                    importResult.count > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {importResult.count > 0 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-900">
                          Berjaya mengimport {importResult.count} rekod murid!
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span className="text-rose-900">Tiada rekod berjaya diimport.</span>
                      </>
                    )}
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="space-y-1 pt-1 text-[11px] text-rose-700">
                      <p className="font-bold">Laporan Ralat Data:</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {importResult.errors.slice(0, 5).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-800"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-[#163B65]">Sejarah Tempahan Murid</h3>
                <p className="font-semibold text-slate-800 mt-0.5">{historyStudent.fullName}</p>
                <p className="text-slate-500 text-[11px]">{historyStudent.className} ({historyStudent.year})</p>
              </div>
              <button
                onClick={() => setHistoryStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const studentOrders = orders.filter(
                (o) =>
                  o.studentId === historyStudent.id ||
                  o.studentName.toUpperCase() === historyStudent.fullName.toUpperCase()
              );
              if (studentOrders.length === 0) {
                return (
                  <p className="text-center py-6 text-slate-400">
                    Murid ini belum mempunyai sebarang rekod tempahan gambar.
                  </p>
                );
              }
              return (
                <div className="space-y-2">
                  {studentOrders.map((o) => (
                    <div key={o.id} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                      <div className="flex justify-between font-mono font-bold text-[#163B65]">
                        <span>{o.orderNumber}</span>
                        <span>RM {o.totalAmount.toFixed(2)}</span>
                      </div>
                      <p className="font-medium text-slate-800">{o.packageNameSnapshot}</p>
                      <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                        <span>Status: {o.orderStatus}</span>
                        <span>Bayaran: {o.paymentStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setHistoryStudent(null)}
                className="px-4 py-2 bg-[#163B65] text-white rounded font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 text-center border border-slate-200">
            <h3 className="font-extrabold text-base text-slate-900">Padam Murid Ini?</h3>
            <p className="text-xs text-slate-600">
              Rekod murid ini akan dipadamkan daripada pangkalan data.
            </p>
            <div className="flex gap-2 pt-2 text-xs">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-lg border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700"
              >
                Ya, Padam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
