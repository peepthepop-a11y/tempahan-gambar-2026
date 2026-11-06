import React, { useState, useMemo } from 'react';
import { ClassPhoto, ClassItem, YearGrade } from '../../types';
import { StorageService } from '../../lib/storage';
import {
  Camera,
  Upload,
  Plus,
  Search,
  Trash2,
  Eye,
  Download,
  X,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface PhotosManagerProps {
  classPhotos: ClassPhoto[];
  classes: ClassItem[];
}

export const PhotosManager: React.FC<PhotosManagerProps> = ({
  classPhotos,
  classes,
}) => {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | 'Formal' | 'Freestyle'>('ALL');
  const [viewMode, setViewMode] = useState<'all' | 'missing'>('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<ClassPhoto | null>(null);
  const [previewingPhoto, setPreviewingPhoto] = useState<ClassPhoto | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<ClassPhoto | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form states
  const [formClassId, setFormClassId] = useState<string>(classes[0]?.id || '');
  const [formPhotoType, setFormPhotoType] = useState<'Formal' | 'Freestyle'>('Formal');
  const [formTitle, setFormTitle] = useState('');
  const [formImage, setFormImage] = useState<string>('');
  const [formFileName, setFormFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const yearsList: YearGrade[] = [
    'Prasekolah',
    'Tahun 1',
    'Tahun 2',
    'Tahun 3',
    'Tahun 4',
    'Tahun 5',
    'Tahun 6',
    'Pendidikan Khas',
  ];

  // Helper to trigger notice toast
  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return classPhotos.filter((p) => {
      const matchSearch =
        p.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.teacherName && p.teacherName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.year.toLowerCase().includes(searchTerm.toLowerCase());

      const matchYear = selectedYearFilter === 'ALL' || p.year === selectedYearFilter;
      const matchType = selectedTypeFilter === 'ALL' || p.photoType === selectedTypeFilter;

      return matchSearch && matchYear && matchType;
    });
  }, [classPhotos, searchTerm, selectedYearFilter, selectedTypeFilter]);

  // Classes that are missing either formal or freestyle photo
  const missingCoverage = useMemo(() => {
    const list: Array<{ classItem: ClassItem; missingType: 'Formal' | 'Freestyle' | 'Both' }> = [];
    classes.forEach((c) => {
      const hasFormal = classPhotos.some((p) => p.classId === c.id && p.photoType === 'Formal');
      const hasFreestyle = classPhotos.some((p) => p.classId === c.id && p.photoType === 'Freestyle');

      if (!hasFormal && !hasFreestyle) {
        list.push({ classItem: c, missingType: 'Both' });
      } else if (!hasFormal) {
        list.push({ classItem: c, missingType: 'Formal' });
      } else if (!hasFreestyle) {
        list.push({ classItem: c, missingType: 'Freestyle' });
      }
    });
    return list;
  }, [classes, classPhotos]);

  // Open Add modal with defaults
  const handleOpenAdd = (targetClassId?: string, targetType?: 'Formal' | 'Freestyle') => {
    const defaultCls = targetClassId
      ? classes.find((c) => c.id === targetClassId) || classes[0]
      : classes[0];

    const type = targetType || 'Formal';
    setEditingPhoto(null);
    setFormClassId(defaultCls?.id || '');
    setFormPhotoType(type);
    setFormTitle(
      defaultCls
        ? `Gambar ${type} Kelas ${defaultCls.name}`
        : `Gambar ${type} Kelas`
    );
    setFormImage('');
    setFormFileName('');
    setIsModalOpen(true);
  };

  // Open Edit / Replace modal
  const handleOpenEdit = (photo: ClassPhoto) => {
    setEditingPhoto(photo);
    setFormClassId(photo.classId);
    setFormPhotoType(photo.photoType);
    setFormTitle(photo.title);
    setFormImage(photo.photoUrl);
    setFormFileName(photo.title);
    setIsModalOpen(true);
  };

  // Handle Class change in form -> auto update title suggestion
  const handleClassChangeInForm = (clsId: string) => {
    setFormClassId(clsId);
    const targetCls = classes.find((c) => c.id === clsId);
    if (targetCls) {
      setFormTitle(`Gambar ${formPhotoType} Kelas ${targetCls.name}`);
    }
  };

  // Handle Type change in form -> auto update title suggestion
  const handleTypeChangeInForm = (type: 'Formal' | 'Freestyle') => {
    setFormPhotoType(type);
    const targetCls = classes.find((c) => c.id === formClassId);
    if (targetCls) {
      setFormTitle(`Gambar ${type} Kelas ${targetCls.name}`);
    }
  };

  // Process file upload (image file)
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Sila pilih fail imej yang sah (JPG, PNG, atau WebP).');
      return;
    }
    setFormFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  // Save / Update Class Photo
  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCls = classes.find((c) => c.id === formClassId);
    if (!targetCls) {
      alert('Sila pilih kelas yang sah.');
      return;
    }
    if (!formImage) {
      alert('Sila muat naik fail gambar kelas terlebih dahulu.');
      return;
    }

    const titleToSave =
      formTitle.trim() || `Gambar ${formPhotoType} Kelas ${targetCls.name}`;

    StorageService.saveOrUpdateClassPhoto({
      id: editingPhoto ? editingPhoto.id : undefined,
      classId: targetCls.id,
      className: targetCls.name,
      year: targetCls.year,
      photoType: formPhotoType,
      title: titleToSave,
      photoUrl: formImage,
      teacherName: targetCls.teacherName,
    });

    setIsModalOpen(false);
    showNotice(
      editingPhoto
        ? `Gambar kelas ${targetCls.name} (${formPhotoType}) telah berjaya dikemaskini!`
        : `Gambar kelas ${targetCls.name} (${formPhotoType}) telah berjaya dimuat naik!`
    );
  };

  // Confirm delete photo
  const handleConfirmDelete = () => {
    if (!deletingPhoto) return;
    const name = deletingPhoto.className;
    const type = deletingPhoto.photoType;
    StorageService.deleteClassPhoto(deletingPhoto.id);
    setDeletingPhoto(null);
    showNotice(`Gambar ${type} kelas ${name} telah dipadam.`);
  };

  // Trigger download of image
  const handleDownload = (photo: ClassPhoto) => {
    const a = document.createElement('a');
    a.href = photo.photoUrl;
    const safeName = photo.className.replace(/\s+/g, '_').toLowerCase();
    a.download = `foto_${safeName}_${photo.photoType.toLowerCase()}_5R.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-[#163B65]">
              Pengurusan Gambar Kelas (Sesi 2026)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E6B85C]/20 text-[#966b0f] border border-[#E6B85C]/40">
              Cetakan 5R Rasmi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Muat naik foto formal dan gaya freestyle bagi setiap kelas (Prasekolah, Tahun 1–6 &amp; Pendidikan Khas) untuk dipaparkan pada Galeri Kelas ibu bapa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#163B65] hover:bg-[#102C4E] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#E6B85C]" />
            <span>Muat Naik Gambar Kelas</span>
          </button>
        </div>
      </div>

      {/* Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Jumlah Foto Kelas
          </span>
          <p className="text-xl font-black text-[#163B65] mt-1 font-mono">{classPhotos.length}</p>
          <span className="text-[10px] text-slate-500 font-medium">Dalam galeri sekolah</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Foto Formal (Pakej A)
          </span>
          <p className="text-xl font-black text-blue-700 mt-1 font-mono">
            {classPhotos.filter((p) => p.photoType === 'Formal').length}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Gaya rasmi kelas</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Foto Freestyle (Pakej B)
          </span>
          <p className="text-xl font-black text-amber-600 mt-1 font-mono">
            {classPhotos.filter((p) => p.photoType === 'Freestyle').length}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Aksi santai kelas</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Jumlah Kelas Terlibat
          </span>
          <p className="text-xl font-black text-emerald-700 mt-1 font-mono">{classes.length}</p>
          <span className="text-[10px] text-slate-500 font-medium">Prasekolah, Tahun 1-6, PPKI</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Cari nama kelas, guru kelas, atau tajuk gambar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3 pointer-events-none" />
          </div>

          {/* Quick toggle: Semua vs Kelas Belum Lengkap */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-bold text-xs transition-colors cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-white text-[#163B65] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Foto ({classPhotos.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('missing')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-bold text-xs transition-colors cursor-pointer ${
                viewMode === 'missing'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              Kelas Belum Lengkap ({missingCoverage.length})
            </button>
          </div>
        </div>

        {/* Filter Badges: Year & Photo Type */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          {/* Year filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Tahun:</span>
            <button
              type="button"
              onClick={() => setSelectedYearFilter('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer shrink-0 ${
                selectedYearFilter === 'ALL'
                  ? 'bg-[#163B65] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua
            </button>
            {yearsList.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setSelectedYearFilter(y)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer shrink-0 ${
                  selectedYearFilter === y
                    ? 'bg-[#163B65] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Type filter buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] font-bold text-slate-400">Jenis:</span>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('ALL')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                selectedTypeFilter === 'ALL'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('Formal')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                selectedTypeFilter === 'Formal'
                  ? 'bg-blue-700 text-white font-bold'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Formal Sahaja
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('Freestyle')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                selectedTypeFilter === 'Freestyle'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Freestyle Sahaja
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE: MISSING PHOTOS ALERT & QUICK ACTION */}
      {viewMode === 'missing' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Senarai Kelas Yang Belum Mempunyai Foto Lengkap</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Ibu bapa lebih yakin membuat tempahan apabila dapat melihat contoh foto kelas anak mereka di <strong>Galeri Kelas</strong>. Klik butang muat naik di bawah untuk memuat naik foto kelas yang masih belum ada:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {missingCoverage.map(({ classItem, missingType }) => (
              <div
                key={classItem.id}
                className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                      {classItem.year}
                    </span>
                    <h4 className="font-extrabold text-[#163B65]">{classItem.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    {missingType === 'Both'
                      ? 'Tiada 2 Foto'
                      : missingType === 'Formal'
                      ? 'Perlu Foto Formal'
                      : 'Perlu Foto Freestyle'}
                  </span>
                </div>

                {classItem.teacherName && (
                  <p className="text-[11px] text-slate-500">Guru: {classItem.teacherName}</p>
                )}

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                  {missingType === 'Both' || missingType === 'Formal' ? (
                    <button
                      type="button"
                      onClick={() => handleOpenAdd(classItem.id, 'Formal')}
                      className="flex-1 py-1 px-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[10px] text-center cursor-pointer"
                    >
                      + Foto Formal
                    </button>
                  ) : null}

                  {missingType === 'Both' || missingType === 'Freestyle' ? (
                    <button
                      type="button"
                      onClick={() => handleOpenAdd(classItem.id, 'Freestyle')}
                      className="flex-1 py-1 px-2 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[10px] text-center cursor-pointer"
                    >
                      + Foto Freestyle
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Class Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPhotos.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-slate-300 p-8 space-y-3">
            <Camera className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-800 text-sm">Tiada Gambar Kelas Ditemui</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {classPhotos.length === 0
                ? 'Belum ada gambar kelas dimuat naik ke dalam sistem. Anda boleh memuat naik foto kelas formal dan freestyle pertama anda sekarang.'
                : 'Tiada gambar padan dengan tapisan carian anda. Sila tukar pilihan tahun atau kata kunci.'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleOpenAdd()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#163B65] text-white text-xs font-bold rounded-lg hover:bg-[#102C4E] cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#E6B85C]" />
                <span>Muat Naik Gambar Kelas Sekarang</span>
              </button>
            </div>
          </div>
        ) : (
          filteredPhotos.map((photo) => {
            const isFormal = photo.photoType === 'Formal';
            return (
              <div
                key={photo.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col"
              >
                {/* Photo Thumbnail Container */}
                <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                  <img
                    src={photo.photoUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />

                  {/* Badges on Top */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        isFormal
                          ? 'bg-[#163B65] text-white border border-[#E6B85C]/60'
                          : 'bg-amber-600 text-white border border-amber-400'
                      }`}
                    >
                      {isFormal ? 'Foto Formal' : 'Foto Freestyle'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      5R
                    </span>
                  </div>

                  {/* Year Tag */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-white/90 text-[#163B65] shadow-xs">
                      {photo.year}
                    </span>
                  </div>

                  {/* Hover Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewingPhoto(photo)}
                      className="p-2.5 rounded-full bg-white text-[#163B65] hover:bg-slate-100 shadow-md cursor-pointer transition-transform hover:scale-110"
                      title="Lihat Saiz Penuh"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(photo)}
                      className="p-2.5 rounded-full bg-white text-slate-800 hover:bg-slate-100 shadow-md cursor-pointer transition-transform hover:scale-110"
                      title="Muat Turun Fail Gambar"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(photo)}
                      className="p-2.5 rounded-full bg-white text-blue-700 hover:bg-slate-100 shadow-md cursor-pointer transition-transform hover:scale-110"
                      title="Ganti / Tukar Gambar Ini"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-[#163B65] text-sm leading-tight">
                      {photo.className}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium line-clamp-1">
                      {photo.title}
                    </p>
                    {photo.teacherName ? (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Guru Kelas: <span className="font-semibold text-slate-700">{photo.teacherName}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic mt-1">Tiada guru dinyatakan</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      {new Date(photo.uploadedAt).toLocaleDateString('ms-MY', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(photo)}
                        className="px-2.5 py-1 text-[11px] font-bold text-[#163B65] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        title="Tukar fail gambar atau tajuk"
                      >
                        Ganti Gambar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingPhoto(photo)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Padam Gambar Kelas Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* UPLOAD / EDIT CLASS PHOTO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="p-5 bg-[#163B65] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#E6B85C]" />
                <h3 className="font-extrabold text-sm">
                  {editingPhoto ? 'Ganti / Kemaskini Gambar Kelas' : 'Muat Naik Gambar Kelas Baharu'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePhoto} className="p-6 space-y-4 text-xs">
              {/* Select Class */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Pilih Kelas *
                </label>
                <select
                  value={formClassId}
                  onChange={(e) => handleClassChangeInForm(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#163B65]"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.year}) {c.teacherName ? `· ${c.teacherName}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Photo Type */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Jenis Gambar Kelas *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    onClick={() => handleTypeChangeInForm('Formal')}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formPhotoType === 'Formal'
                        ? 'border-[#163B65] bg-blue-50/50 text-[#163B65] font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="photoType"
                      checked={formPhotoType === 'Formal'}
                      onChange={() => handleTypeChangeInForm('Formal')}
                      className="text-[#163B65]"
                    />
                    <div>
                      <span className="block text-xs">Foto Formal (5R)</span>
                      <span className="block text-[10px] text-slate-500 font-normal">
                        Gaya rasmi kelas (Pakej A)
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => handleTypeChangeInForm('Freestyle')}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formPhotoType === 'Freestyle'
                        ? 'border-amber-600 bg-amber-50/50 text-amber-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="photoType"
                      checked={formPhotoType === 'Freestyle'}
                      onChange={() => handleTypeChangeInForm('Freestyle')}
                      className="text-amber-600"
                    />
                    <div>
                      <span className="block text-xs">Foto Freestyle (5R)</span>
                      <span className="block text-[10px] text-slate-500 font-normal">
                        Aksi santai kelas (Pakej B)
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Title / Label */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Tajuk Gambar Kelas (Pilihan)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gambar Formal Kelas 1 Bestari"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
                />
              </div>

              {/* File Upload with Drag & Drop */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Fail Gambar (Format JPEG / PNG / WebP) *
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${
                    isDragging
                      ? 'border-[#163B65] bg-blue-50/50'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                  }`}
                >
                  {formImage ? (
                    <div className="space-y-3">
                      <div className="relative aspect-4/3 max-h-48 mx-auto rounded-lg overflow-hidden border border-slate-200 shadow-xs bg-slate-900">
                        <img
                          src={formImage}
                          alt="Pratonton"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[11px] text-slate-600 font-semibold truncate max-w-xs">
                          {formFileName || 'Imej dipilih'}
                        </span>
                        <label className="text-[11px] font-bold text-[#4A90D9] hover:underline cursor-pointer">
                          Tukar Imej
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <div>
                        <label className="inline-block px-3.5 py-1.5 bg-[#163B65] hover:bg-[#102C4E] text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs">
                          Pilih Fail Gambar
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[11px] text-slate-500 mt-1.5">
                          atau seret dan lepas fail imej ke dalam kotak ini
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Nisbah disyorkan: Landskap 5R (5:7 atau 4:3). Imej berkualiti studio.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!formImage}
                  className="px-5 py-2 bg-[#163B65] hover:bg-[#102C4E] disabled:opacity-50 text-white rounded-lg font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-[#E6B85C]" />
                  <span>{editingPhoto ? 'Simpan Perubahan' : 'Muat Naik Gambar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX PREVIEW MODAL */}
      {previewingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] font-bold text-[#E6B85C] uppercase tracking-wider">
                  {previewingPhoto.year} · {previewingPhoto.photoType}
                </span>
                <h3 className="font-extrabold text-sm">{previewingPhoto.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(previewingPhoto)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Muat Turun</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewingPhoto(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex items-center justify-center max-h-[75vh] overflow-hidden bg-black/50">
              <img
                src={previewingPhoto.photoUrl}
                alt={previewingPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Guru: {previewingPhoto.teacherName || 'Tiada maklumat guru'}</span>
              <span>Cetakan Saiz 5R SKTSP</span>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Padam Gambar Kelas Ini?
                </h3>
                <p className="text-xs text-rose-600 font-semibold">
                  {deletingPhoto.className} ({deletingPhoto.photoType})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Adakah anda pasti mahu memadam fail foto ini? Foto ini tidak lagi akan dipaparkan dalam Galeri Kelas untuk semakan ibu bapa.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPhoto(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer shadow-sm"
              >
                Ya, Padam Gambar Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Toast Alert */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xl flex items-center gap-3 animate-fade-in border border-emerald-500">
          <CheckCircle2 className="w-5 h-5" />
          <span>{actionNotice}</span>
        </div>
      )}
    </div>
  );
};
