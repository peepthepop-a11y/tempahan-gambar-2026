import React, { useState } from 'react';
import { ClassItem, YearGrade, Student, Order } from '../../types';
import { StorageService } from '../../lib/storage';
import { exportClassesToCsv, parseClassesCsv } from '../../lib/exportUtils';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckSquare,
  Square,
  AlertTriangle,
} from 'lucide-react';

interface ClassesManagerProps {
  classes: ClassItem[];
  students: Student[];
  orders: Order[];
}

export const ClassesManager: React.FC<ClassesManagerProps> = ({
  classes,
  students,
  orders,
}) => {
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  // Selection & Deletion States
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [deletingSingleClass, setDeletingSingleClass] = useState<ClassItem | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // CSV Import Modal & Result
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importResult, setImportResult] = useState<{
    count: number;
    updated: number;
    errors: string[];
  } | null>(null);

  // Form states
  const [className, setClassName] = useState('');
  const [classYear, setClassYear] = useState<YearGrade>('Tahun 1');
  const [teacherName, setTeacherName] = useState('');
  const [isActive, setIsActive] = useState(true);

  const yearsList: YearGrade[] = [
    'Tahun 1',
    'Tahun 2',
    'Tahun 3',
    'Tahun 4',
    'Tahun 5',
    'Tahun 6',
    'Prasekolah',
    'Pendidikan Khas',
  ];

  const filteredClasses = classes.filter(
    (c) => selectedYearFilter === 'ALL' || c.year === selectedYearFilter
  );

  const handleOpenAdd = () => {
    setEditingClass(null);
    setClassName('');
    setClassYear('Tahun 1');
    setTeacherName('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: ClassItem) => {
    setEditingClass(c);
    setClassName(c.name);
    setClassYear(c.year);
    setTeacherName(c.teacherName || '');
    setIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    if (editingClass) {
      StorageService.updateClass(editingClass.id, {
        name: className.trim(),
        year: classYear,
        teacherName: teacherName.trim() || undefined,
        isActive,
      });
    } else {
      StorageService.addClass({
        name: className.trim(),
        year: classYear,
        teacherName: teacherName.trim() || undefined,
        isActive,
      });
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = (c: ClassItem) => {
    StorageService.updateClass(c.id, { isActive: !c.isActive });
  };

  // Toggle single class selection checkbox
  const toggleSelectClass = (id: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all or deselect all in current filter
  const isAllFilteredSelected =
    filteredClasses.length > 0 &&
    filteredClasses.every((c) => selectedClassIds.includes(c.id));

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      const filteredIdSet = new Set(filteredClasses.map((c) => c.id));
      setSelectedClassIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      const newIds = new Set([...selectedClassIds, ...filteredClasses.map((c) => c.id)]);
      setSelectedClassIds(Array.from(newIds));
    }
  };

  const handleClearSelection = () => {
    setSelectedClassIds([]);
  };

  // Open modal for single class delete
  const handleOpenDeleteSingle = (cls: ClassItem) => {
    setDeletingSingleClass(cls);
  };

  // Confirm single class delete
  const handleConfirmDeleteSingle = () => {
    if (!deletingSingleClass) return;
    const name = deletingSingleClass.name;
    StorageService.deleteClass(deletingSingleClass.id);
    setSelectedClassIds((prev) => prev.filter((id) => id !== deletingSingleClass.id));
    setDeletingSingleClass(null);
    setActionNotice(`Kelas "${name}" telah berjaya dipadam.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Confirm bulk delete selected classes
  const handleConfirmBulkDelete = () => {
    if (selectedClassIds.length === 0) return;
    const count = StorageService.bulkDeleteClasses(selectedClassIds);
    setSelectedClassIds([]);
    setIsBulkDeleteModalOpen(false);
    setActionNotice(`Sebanyak ${count} kelas pilihan telah berjaya dipadamkan.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Confirm delete all classes
  const handleConfirmDeleteAll = () => {
    StorageService.deleteAllClasses();
    setSelectedClassIds([]);
    setIsDeleteAllModalOpen(false);
    setActionNotice('Semua kelas dalam sistem telah berjaya dipadamkan serentak.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleCsvClassesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseClassesCsv(text);

      if (parsed.validRows.length > 0) {
        const toAdd = parsed.validRows.map((r) => ({
          name: r.name,
          year: r.year as YearGrade,
          teacherName: r.teacherName,
          isActive: r.isActive,
        }));
        const res = StorageService.bulkAddClasses(toAdd);
        setImportResult({
          count: res.count,
          updated: res.updated,
          errors: [...parsed.errors, ...res.errors],
        });
      } else {
        setImportResult({ count: 0, updated: 0, errors: parsed.errors });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#163B65]">Pengurusan Kelas & Tahap Murid</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar kelas aktif, guru kelas dan pantau bilangan murid serta tempahan gambar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportClassesToCsv(filteredClasses)}
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
            <span>Import CSV Kelas</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#163B65] text-white text-xs font-bold hover:bg-[#102C4E] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#E6B85C]" />
            <span>Tambah Kelas Baharu</span>
          </button>

          {/* Delete All Classes Button */}
          <button
            type="button"
            onClick={() => setIsDeleteAllModalOpen(true)}
            disabled={classes.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-50 border border-rose-300 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            title="Padam semua rekod kelas dalam sistem serentak"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Padam Semua Kelas</span>
          </button>
        </div>
      </div>

      {/* Year Filter Tabs */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setSelectedYearFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
            selectedYearFilter === 'ALL'
              ? 'bg-[#163B65] text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Semua Tahun ({classes.length})
        </button>
        {yearsList.map((y) => {
          const count = classes.filter((c) => c.year === y).length;
          return (
            <button
              key={y}
              onClick={() => setSelectedYearFilter(y)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                selectedYearFilter === y
                  ? 'bg-[#163B65] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {y} ({count})
            </button>
          );
        })}
      </div>

      {/* Selection & Batch Action Toolbar */}
      {classes.length > 0 && (
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 transition-colors cursor-pointer"
            >
              {isAllFilteredSelected ? (
                <CheckSquare className="w-4 h-4 text-rose-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {isAllFilteredSelected ? 'Nyahpilih Semua' : `Pilih Semua (${filteredClasses.length})`}
              </span>
            </button>

            {selectedClassIds.length > 0 && (
              <span className="font-bold text-slate-900 bg-rose-50 text-rose-800 px-3 py-1 rounded-full border border-rose-200 text-xs">
                {selectedClassIds.length} kelas dipilih
              </span>
            )}
          </div>

          {selectedClassIds.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearSelection}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Batal Pilihan
              </button>

              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer shadow-sm animate-pulse"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Padam Kelas Dipilih ({selectedClassIds.length})</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Classes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300 p-8 space-y-3">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-800 text-sm">Tiada Rekod Kelas Dijumpai</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {classes.length === 0
                ? 'Semua kelas telah dipadamkan daripada pangkalan data. Anda boleh mula memasukkan senarai kelas baharu dengan menambah satu persatu atau import fail CSV.'
                : `Tiada kelas ditemui bagi kategori "${selectedYearFilter}".`}
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-[#163B65] text-white text-xs font-bold rounded-lg hover:bg-[#102C4E] cursor-pointer"
              >
                + Tambah Kelas Baharu
              </button>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                Import CSV Kelas
              </button>
            </div>
          </div>
        ) : (
          filteredClasses.map((cls) => {
            const studentCount = students.filter((s) => s.classId === cls.id).length;
            const orderCount = orders.filter((o) => o.classId === cls.id && o.orderStatus !== 'Dibatalkan').length;
            const isSelected = selectedClassIds.includes(cls.id);

            return (
              <div
                key={cls.id}
                className={`bg-white rounded-xl border p-5 space-y-4 shadow-xs transition-all relative ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/20 ring-2 ring-rose-400'
                    : cls.isActive
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {/* Checkbox for selective deletion */}
                    <button
                      type="button"
                      onClick={() => toggleSelectClass(cls.id)}
                      className="mt-0.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title={isSelected ? 'Nyahpilih kelas ini' : 'Pilih kelas ini untuk dipadam'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-rose-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A90D9]">
                        {cls.year}
                      </span>
                      <h3 className="text-base font-extrabold text-[#163B65] mt-0.5">{cls.name}</h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(cls)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      cls.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                    title="Klik untuk aktifkan / nyahaktifkan"
                  >
                    {cls.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </button>
                </div>

                {cls.teacherName ? (
                  <p className="text-xs text-slate-600 truncate pl-6.5">Guru: {cls.teacherName}</p>
                ) : (
                  <p className="text-xs text-slate-400 italic pl-6.5">Tiada guru ditetapkan</p>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded text-center">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Murid</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">{studentCount}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded text-center">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Tempahan</span>
                    <span className="font-bold text-[#163B65] font-mono text-sm">{orderCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => toggleSelectClass(cls.id)}
                    className={`text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      isSelected ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ Dipilih untuk Padam' : '+ Pilih untuk Padam'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cls)}
                      className="p-1.5 text-slate-600 hover:text-[#163B65] hover:bg-slate-100 rounded cursor-pointer"
                      title="Edit Kelas"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteSingle(cls)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                      title="Padam Kelas Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 bg-[#163B65] text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm">
                {editingClass ? 'Kemaskini Maklumat Kelas' : 'Tambah Kelas Baharu'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Tahun Persekolahan *</label>
                <select
                  value={classYear}
                  onChange={(e) => setClassYear(e.target.value as YearGrade)}
                  className="w-full px-3 py-2 rounded border border-slate-300 bg-white"
                >
                  {yearsList.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Nama Kelas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 1 Bestari, 2 Cemerlang, dll"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Nama Guru Kelas (Pilihan)</label>
                <input
                  type="text"
                  placeholder="Contoh: Cikgu Noraini binti Yusof"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveClass"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#163B65] rounded"
                />
                <label htmlFor="isActiveClass" className="font-semibold text-slate-700 cursor-pointer">
                  Aktifkan kelas ini untuk tempahan ibu bapa
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#163B65] text-white rounded font-bold hover:bg-[#102C4E]"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal for Classes */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 bg-[#163B65] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#E6B85C]" />
                <h3 className="font-extrabold text-sm">Import Senarai Kelas Pukal (CSV)</h3>
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
                Muat naik fail CSV yang mengandungi senarai nama kelas dan nama guru kelas (sama ada 2 lajur atau 3 lajur):
              </p>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                <div className="font-bold text-[#163B65]">Pilihan Format Lajur CSV:</div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  Nama Kelas, Nama Guru Kelas
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5">
                  Contoh: <code>1 Bestari, Cikgu Noraini binti Yusof</code>
                </div>
                <div className="text-[10px] text-slate-400">
                  (Tahun akan dikesan secara automatik daripada nombor pangkal nama kelas, contoh: 1 Bestari ➔ Tahun 1)
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Perlukan templat?</span>
                <button
                  type="button"
                  onClick={() => {
                    const sampleCsv =
                      '\uFEFFNama Kelas,Nama Guru Kelas\r\n1 Bestari,Cikgu Noraini binti Yusof\r\n1 Cemerlang,Cikgu Ahmad Ridzwan\r\n1 Amanah,Ustazah Siti Hajar\r\n2 Bestari,Cikgu Fauziah binti Hamid\r\n2 Cemerlang,Cikgu Roslan bin Daud\r\n3 Bestari,Cikgu Maryam binti Omar\r\n4 Bestari,Ustaz Hishamuddin bin Saleh\r\n5 Bestari,Cikgu Khairul Nizam\r\n6 Bestari,Cikgu Azman bin Sulaiman\r\n6 Cemerlang,Cikgu Suraya binti Mansor';
                    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'templat_senarai_kelas_sktsp.csv';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="font-bold text-[#4A90D9] hover:underline cursor-pointer"
                >
                  Muat Turun Contoh Templat CSV Kelas
                </button>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center space-y-2">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <label className="block font-bold text-slate-800 cursor-pointer">
                  <span className="px-3.5 py-1.5 bg-[#163B65] text-white rounded text-xs inline-block hover:bg-[#102C4E]">
                    Pilih Fail CSV Kelas
                  </span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleCsvClassesUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-500">Format disokong: .csv (UTF-8 / Excel CSV)</p>
              </div>

              {/* Import Report */}
              {importResult && (
                <div
                  className={`p-4 rounded-lg border space-y-2 ${
                    importResult.count > 0 || importResult.updated > 0
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {importResult.count > 0 || importResult.updated > 0 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-900">
                          Berjaya mengimport kelas! ({importResult.count} ditambah baharu, {importResult.updated} dikemaskini)
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span className="text-rose-900">Tiada kelas berjaya diimport.</span>
                      </>
                    )}
                  </div>

                  {importResult.errors.length > 0 && (
                    <div className="space-y-1 pt-1 text-[11px] text-rose-700">
                      <p className="font-bold">Laporan Ralat Data:</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {importResult.errors.slice(0, 5).map((err: string, i: number) => (
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
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-800 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal: Padam 1 Kelas Pilihan */}
      {deletingSingleClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Padam Kelas "{deletingSingleClass.name}"?
                </h3>
                <p className="text-xs text-rose-600 font-semibold">
                  {deletingSingleClass.year} · {deletingSingleClass.teacherName || 'Tiada guru ditetapkan'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Adakah anda pasti mahu memadamkan rekod kelas ini daripada pangkalan data sekolah?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingSingleClass(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSingle}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Ya, Padam Kelas Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal: Padam Kelas Pilihan (Bulk) */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Padam {selectedClassIds.length} Kelas Dipilih?
                </h3>
                <p className="text-xs text-rose-600 font-semibold">Tindakan pemadaman pukal</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Anda telah memilih <strong>{selectedClassIds.length} kelas</strong> untuk dipadamkan daripada sistem sekolah:
            </p>

            <div className="max-h-36 overflow-y-auto bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs divide-y divide-slate-100">
              {classes
                .filter((c) => selectedClassIds.includes(c.id))
                .map((c) => (
                  <div key={c.id} className="py-1.5 flex justify-between items-center text-slate-800">
                    <span className="font-bold">{c.name}</span>
                    <span className="text-slate-500 text-[11px] font-medium">{c.year}</span>
                  </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Ya, Padam {selectedClassIds.length} Kelas Pilihan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal: Padam SEMUA Kelas Serentak */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-200 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Padam SEMUA Kelas Serentak?
                </h3>
                <p className="text-xs text-rose-600 font-bold">
                  Amaran: Keseluruhan {classes.length} kelas akan dikosongkan
                </p>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
              <p className="font-bold">Perhatian Pentadbir:</p>
              <p className="text-[11px] leading-relaxed">
                Tindakan ini akan mengosongkan semua kelas yang sedang didaftarkan dalam sistem. Anda boleh memasukkan semula senarai kelas baru melalui fail CSV selepas ini.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAll}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Ya, Kosongkan Semua {classes.length} Kelas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Notice Alert Toast */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xl flex items-center gap-3 animate-fade-in border border-emerald-500">
          <CheckCircle2 className="w-5 h-5" />
          <span>{actionNotice}</span>
        </div>
      )}
    </div>
  );
};
