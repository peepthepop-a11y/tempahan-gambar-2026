import React, { useState } from 'react';
import { ClassPhoto, ClassItem, SystemSettings, YearGrade } from '../../types';
import {
  Camera,
  Search,
  Filter,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Maximize2,
  ZoomIn,
} from 'lucide-react';

interface GalleryPageProps {
  classes: ClassItem[];
  photos: ClassPhoto[];
  settings: SystemSettings;
  onNavigate: (route: string) => void;
  onBookClass: (classId: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  classes,
  photos,
  settings,
  onNavigate,
  onBookClass,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Filter photos
  const filteredPhotos = photos.filter((photo) => {
    const matchYear = selectedYear === 'ALL' || photo.year === selectedYear;
    const matchType = selectedType === 'ALL' || photo.photoType === selectedType;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      term === '' ||
      photo.className.toLowerCase().includes(term) ||
      photo.title.toLowerCase().includes(term) ||
      (photo.teacherName && photo.teacherName.toLowerCase().includes(term));

    return matchYear && matchType && matchSearch;
  });

  const activePhoto =
    activePhotoIndex !== null && filteredPhotos[activePhotoIndex]
      ? filteredPhotos[activePhotoIndex]
      : null;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex(
        (activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4A90D9]">
          Pratonton Sesi Fotografi {settings.sessionYear}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#163B65] tracking-tight">
          Galeri Gambar Semua Kelas SK Taman Sri Pulai
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Ibu bapa dan penjaga boleh menyemak dan melihat terlebih dahulu foto rasmi kelas (Foto Formal & Foto Freestyle) sebelum membuat tempahan. Tekan mana-mana gambar untuk paparan saiz besar (Large View).
        </p>

        {/* Highlight Notices */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#163B65] font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-[#E6B85C]" />
            <span>Semua Gambar Dilengkapi Reka Bentuk Template SKTSP</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cetakan Gambar 5R · Harga Dari RM 7.00 Sahaja</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Year Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {['ALL', 'Prasekolah', 'Pendidikan Khas', 'Tahun 1', 'Tahun 2', 'Tahun 3', 'Tahun 4', 'Tahun 5', 'Tahun 6'].map(
              (year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedYear === year
                      ? 'bg-[#163B65] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {year === 'ALL' ? 'Semua Tahun' : year}
                </button>
              )
            )}
          </div>

          {/* Type Filter & Search input */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* Type selector */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
            >
              <option value="ALL">Semua Jenis Foto</option>
              <option value="Formal">Foto Formal Kelas (Pakej A/C)</option>
              <option value="Freestyle">Foto Freestyle Santai (Pakej B/C)</option>
            </select>

            {/* Search box */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kelas (cth: 1 Bestari)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65] bg-slate-50 focus:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Menunjukkan <strong>{filteredPhotos.length}</strong> foto kelas yang tersedia untuk semakan.
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Klik pada gambar untuk membuka pratonton resolusi tinggi (Large View).
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Camera className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-700 text-base">
            {photos.length === 0 ? 'Gambar Kelas Sedang Disediakan' : 'Tiada foto kelas ditemui'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {photos.length === 0
              ? 'Sesi fotografi kelas sedang dijalankan. Gambar rasmi kelas bertemplate (Formal & Freestyle) akan dimuat naik ke sini secara berperingkat oleh pihak pentadbir sekolah.'
              : `Tiada gambar kelas yang sepadan dengan penapis atau carian "${searchTerm}". Sila pilih kategori lain atau kosongkan carian.`}
          </p>
          {photos.length > 0 && (
            <button
              onClick={() => {
                setSelectedYear('ALL');
                setSelectedType('ALL');
                setSearchTerm('');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Tunjukkan Semua Gambar
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Photo Display Card with Large Click Trigger */}
              <div
                onClick={() => setActivePhotoIndex(index)}
                className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={photo.photoUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Badge Type Tag */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider ${
                      photo.photoType === 'Formal'
                        ? 'bg-[#163B65] text-[#E6B85C]'
                        : 'bg-[#0284c7] text-white'
                    }`}
                  >
                    {photo.photoType === 'Formal' ? 'Foto Formal' : 'Foto Freestyle'}
                  </span>
                </div>

                {/* Year Tag */}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  {photo.year}
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-[#163B65]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                  <div className="px-3.5 py-2 rounded-lg bg-black/60 backdrop-blur-xs text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-4 h-4 text-[#E6B85C]" />
                    <span>Tekan Untuk Lihat Saiz Besar</span>
                  </div>
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-[#163B65]">
                      {photo.className}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Saiz 5R
                    </span>
                  </div>
                  {photo.teacherName && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      Guru Kelas: <span className="font-semibold text-slate-700">{photo.teacherName}</span>
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setActivePhotoIndex(index)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200/90 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#163B65]" />
                    <span>Lihat Besar</span>
                  </button>

                  <button
                    onClick={() => onBookClass(photo.classId)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#163B65] hover:bg-[#102C4E] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#E6B85C]" />
                    <span>Tempah Kelas</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Large View Modal (Lightbox Preview) */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActivePhotoIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-[#163B65] text-white flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                    activePhoto.photoType === 'Formal'
                      ? 'bg-[#E6B85C] text-[#163B65]'
                      : 'bg-[#4A90D9] text-white'
                  }`}
                >
                  {activePhoto.photoType === 'Formal' ? 'Foto Formal' : 'Foto Freestyle'}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight truncate">
                  {activePhoto.title} ({activePhoto.year})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-300 font-mono hidden sm:inline">
                  {activePhotoIndex! + 1} / {filteredPhotos.length}
                </span>
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Area with Navigation Buttons */}
            <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden min-h-[320px] max-h-[65vh]">
              <img
                src={activePhoto.photoUrl}
                alt={activePhoto.title}
                className="max-w-full max-h-[65vh] object-contain select-none"
              />

              {/* Prev Button */}
              {filteredPhotos.length > 1 && (
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer shadow-lg"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {filteredPhotos.length > 1 && (
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer shadow-lg"
                  aria-label="Foto Seterusnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Modal Footer & Direct Booking CTA */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-[#163B65] text-base">
                    Kelas {activePhoto.className}
                  </h4>
                  <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                    {activePhoto.year}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Guru Kelas: <strong>{activePhoto.teacherName || 'Warga SKTSP'}</strong> · Sesi Fotografi {settings.sessionYear}
                </p>
                <p className="text-[11px] text-amber-700 font-medium">
                  * Paparan bertemplate untuk semakan ibu bapa. Cetakan sebenar bersaiz 5R pada kertas foto studio makmal anti-pudar.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Tutup Pratonton
                </button>

                <button
                  onClick={() => {
                    setActivePhotoIndex(null);
                    onBookClass(activePhoto.classId);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#163B65] hover:bg-[#102C4E] text-white text-xs font-black transition-all shadow-md cursor-pointer hover:shadow-lg"
                >
                  <Camera className="w-4 h-4 text-[#E6B85C]" />
                  <span>Tempah Gambar {activePhoto.className} (RM7 - RM12)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
