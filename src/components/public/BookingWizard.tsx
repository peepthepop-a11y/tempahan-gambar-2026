import React, { useState, useEffect } from 'react';
import {
  ClassItem,
  PhotoPackage,
  SystemSettings,
  YearGrade,
  Order,
} from '../../types';
import { StorageService } from '../../lib/storage';
import { getAccessToken, syncOrdersToGoogleDrive } from '../../lib/googleDrive';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  Camera,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Users,
  CreditCard,
  Upload,
  AlertCircle,
  Check,
  Copy,
  Printer,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface BookingWizardProps {
  classes: ClassItem[];
  packages: PhotoPackage[];
  settings: SystemSettings;
  initialPackageId?: string;
  initialClassId?: string;
  onNavigate: (route: string) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  classes,
  packages,
  settings,
  initialPackageId,
  initialClassId,
  onNavigate,
}) => {
  // Wizard steps: 1: Class, 2: Student, 3: Package, 4: Review, 5: Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedYear, setSelectedYear] = useState<YearGrade>('Tahun 1');
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId || '');
  const [studentName, setStudentName] = useState<string>('');
  const [parentName, setParentName] = useState<string>('');
  const [parentPhone, setParentPhone] = useState<string>('');
  const [parentEmail, setParentEmail] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId || '');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'Tunai / Manual'>('Bank Transfer');

  // Payment proof upload state
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string>('');
  const [proofFileName, setProofFileName] = useState<string>('');

  // Confirmation order result
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeClasses = classes.filter((c) => c.isActive);
  const activePackages = packages.filter((p) => p.isActive);

  // Years list from active classes
  const availableYears = Array.from(new Set(activeClasses.map((c) => c.year))).sort();

  // Filter classes by selected year
  const classesForYear = activeClasses.filter((c) => c.year === selectedYear);

  // Auto-select initial package or class if passed
  useEffect(() => {
    if (initialPackageId) {
      setSelectedPackageId(initialPackageId);
    }
  }, [initialPackageId]);

  useEffect(() => {
    if (initialClassId) {
      const cls = classes.find((c) => c.id === initialClassId);
      if (cls) {
        setSelectedClassId(cls.id);
        setSelectedYear(cls.year);
      }
    }
  }, [initialClassId, classes]);

  // Set default class if available and not yet set
  useEffect(() => {
    if (classesForYear.length > 0 && !classesForYear.some((c) => c.id === selectedClassId)) {
      setSelectedClassId(classesForYear[0].id);
    }
  }, [selectedYear, classesForYear, selectedClassId]);

  // Selected Class and Package objects
  const selectedClass = activeClasses.find((c) => c.id === selectedClassId);
  const selectedPackage = activePackages.find((p) => p.id === selectedPackageId);

  // Handle Proof File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, proof: 'Saiz fail melebihi 5MB.' }));
        return;
      }
      setProofFile(file);
      setProofFileName(file.name);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.proof;
        return copy;
      });

      const reader = new FileReader();
      reader.onload = (event) => {
        setProofPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1 Validation -> Next
  const handleStep1Next = () => {
    if (!selectedClassId) {
      setErrors({ class: 'Sila pilih kelas murid.' });
      return;
    }
    setErrors({});
    setCurrentStep(2);
  };

  // Step 2 Validation -> Next
  const handleStep2Next = () => {
    const errs: Record<string, string> = {};
    if (!studentName.trim() || studentName.trim().length < 3) {
      errs.studentName = 'Nama penuh murid wajib diisi (minimum 3 huruf).';
    }
    if (!parentName.trim() || parentName.trim().length < 3) {
      errs.parentName = 'Nama ibu bapa / penjaga wajib diisi.';
    }
    if (!parentPhone.trim() || parentPhone.trim().length < 8) {
      errs.parentPhone = 'Nombor telefon penjaga wajib diisi dengan sah (cth: 012-3456789).';
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setCurrentStep(3);
  };

  // Step 3 Validation -> Next
  const handleStep3Next = () => {
    if (!selectedPackageId) {
      setErrors({ package: 'Sila pilih satu pakej gambar.' });
      return;
    }
    setErrors({});
    setCurrentStep(4);
  };

  // Step 4 -> Submit Order (creates order in Step 5)
  const handleConfirmOrder = () => {
    if (!selectedClass || !selectedPackage) return;

    try {
      const order = StorageService.createOrder({
        studentName,
        classId: selectedClass.id,
        className: selectedClass.name,
        year: selectedClass.year,
        parentName,
        parentPhone,
        parentEmail: parentEmail.trim() || undefined,
        packageId: selectedPackage.id,
        packageName: `${selectedPackage.code} (${selectedPackage.name})`,
        packagePrice: selectedPackage.price,
        paymentMethod,
        paymentProofUrl: proofPreview || undefined,
        paymentProofFileName: proofFileName || undefined,
      });

      setConfirmedOrder(order);
      setCurrentStep(5);

      // Automatic background sync to Google Drive if connected
      getAccessToken().then((token) => {
        if (token) {
          const allOrders = StorageService.getOrders();
          syncOrdersToGoogleDrive(allOrders, token).catch((e) =>
            console.log('Background drive sync status:', e)
          );
        }
      });
    } catch (err) {
      console.error('Failed to create order:', err);
      setErrors({ submit: 'Ralat semasa menyimpan tempahan. Sila cuba lagi.' });
    }
  };

  // Upload proof on Step 5 if not yet uploaded
  const handleUploadProofOnStep5 = () => {
    if (!confirmedOrder || !proofPreview) return;
    const updated = StorageService.updateOrder(confirmedOrder.id, {
      paymentProofUrl: proofPreview,
      paymentProofFileName: proofFileName,
      paymentStatus: 'Under Review',
      orderStatus: 'Menunggu Pengesahan Bayaran',
      paymentDate: new Date().toISOString(),
    });
    if (updated) {
      setConfirmedOrder(updated);
    }
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Wizard Step Indicator Header */}
      <div className="mb-10">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A90D9]">
            Borang Rasmi Sekolah
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#163B65] mt-1">
            Tempahan Gambar Kelas {settings.sessionYear}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lengkapkan 5 langkah mudah di bawah untuk mendaftarkan tempahan gambar kelas anak anda.
          </p>
        </div>

        {/* Step Indicator Progress */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-2xl mx-auto text-center text-xs">
          {[
            { num: 1, label: 'Pilih Kelas' },
            { num: 2, label: 'Maklumat' },
            { num: 3, label: 'Pakej' },
            { num: 4, label: 'Semakan' },
            { num: 5, label: 'Bayaran' },
          ].map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-1.5 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#163B65] text-white ring-4 ring-[#163B65]/10'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`hidden sm:inline font-semibold text-[11px] whitespace-nowrap ${
                    isCurrent ? 'text-[#163B65] font-bold' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-10">
        {/* STEP 1: PILIH KELAS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#163B65]">Langkah 1: Pilih Kelas Murid</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih tahap tahun dan nama kelas anak anda bagi sesi fotografi {settings.sessionYear}.
              </p>
            </div>

            {/* Year Selector Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Pilih Tahun Persekolahan:
              </label>
              <div className="flex flex-wrap gap-2">
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(yr as YearGrade)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-[#163B65] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Class Cards Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Senarai Kelas Aktif ({selectedYear}):
              </label>
              {classesForYear.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
                  Tiada kelas didaftarkan untuk {selectedYear}. Sila hubungi pihak pentadbir sekolah.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {classesForYear.map((c) => {
                    const isSelected = selectedClassId === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedClassId(c.id)}
                        className={`p-4 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#163B65] bg-[#F5F8FC] ring-2 ring-[#163B65]/10'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-[#163B65]">{c.name}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#163B65] bg-[#163B65]' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        {c.teacherName && (
                          <p className="text-[11px] text-slate-500 mt-2 truncate">
                            Guru: {c.teacherName}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {errors.class && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.class}</span>
              </p>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleStep1Next}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#163B65] hover:bg-[#102C4E] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <span>Seterusnya: Maklumat Murid</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MAKLUMAT MURID */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#163B65]">Langkah 2: Maklumat Murid & Penjaga</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pastikan ejaan nama murid adalah tepat mengikut MyKid/Surat Beranak untuk cetakan senarai nama foto kelas.
              </p>
            </div>

            {/* Selected class recap banner */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Kelas Terpilih: </span>
                <strong className="text-[#163B65]">{selectedClass?.name}</strong> ({selectedClass?.year})
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-[#4A90D9] hover:underline font-semibold"
              >
                Tukar Kelas
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Nama Penuh Murid <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: MUHAMMAD RAYYAN BIN KHAIRUL"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65] uppercase font-semibold"
                />
                {errors.studentName && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.studentName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Nama Ibu / Bapa / Penjaga <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Khairul Nizam bin Othman"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
                />
                {errors.parentName && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.parentName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  No. Telefon Penjaga (WhatsApp) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 019-8765432"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65] font-mono"
                />
                {errors.parentPhone && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.parentPhone}</p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Alamat Emel Penjaga (Pilihan)
                </label>
                <input
                  type="email"
                  placeholder="Contoh: khairul.n@gmail.com (pilihan untuk salinan resit)"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={handleStep2Next}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#163B65] hover:bg-[#102C4E] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <span>Seterusnya: Pilih Pakej</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PILIH PAKEJ */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#163B65]">Langkah 3: Pilih Pakej Gambar Kelas (Saiz 5R)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih pakej cetakan gambar kelas yang diingini. Semua gambar mempunyai template rasmi SKTSP dan merupakan cetakan gambar sahaja.
              </p>
            </div>

            {/* Template & Print Notice Banner */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-xs text-[#163B65]">
              <Sparkles className="w-4 h-4 text-[#E6B85C] shrink-0" />
              <span>
                <strong>Makluman Fotografi:</strong> Semua gambar kelas akan dicetak bersama template rasmi / ceria SKTSP. Semua pakej adalah <strong>cetakan gambar sahaja bersaiz 5R</strong>.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activePackages.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#163B65] bg-[#F5F8FC] ring-2 ring-[#163B65]/15 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase text-[#4A90D9]">{pkg.code}</span>
                        <div className="flex items-center gap-2">
                          {pkg.isPopular && (
                            <span className="text-[10px] bg-[#163B65] text-[#E6B85C] font-bold px-2 py-0.5 rounded">
                              Diskaun
                            </span>
                          )}
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#163B65] bg-[#163B65]' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{pkg.name}</h3>
                      
                      <div className="my-2.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-semibold text-slate-500">RM</span>
                          <span className="text-2xl font-black text-[#163B65] font-mono tabular-nums">
                            {pkg.price.toFixed(2)}
                          </span>
                        </div>
                        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-slate-400 line-through font-mono">
                              RM {pkg.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full">
                              JIMAT RM {(pkg.originalPrice - pkg.price).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mb-3 leading-relaxed">{pkg.description}</p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {pkg.contents.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.package && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.package}</span>
              </p>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={handleStep3Next}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#163B65] hover:bg-[#102C4E] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <span>Seterusnya: Semak Tempahan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SEMAK TEMPAHAN */}
        {currentStep === 4 && selectedClass && selectedPackage && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#163B65]">Langkah 4: Semak Maklumat Tempahan</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sila pastikan semua maklumat di bawah adalah tepat sebelum mengesahkan tempahan.
              </p>
            </div>

            {/* Review Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    MAKLUMAT MURID
                  </span>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-[#4A90D9] hover:underline font-semibold"
                  >
                    Ubah
                  </button>
                </div>
                <p className="font-bold text-slate-900 text-sm">{studentName}</p>
                <p className="text-slate-700">Kelas: <span className="font-semibold">{selectedClass.name}</span> ({selectedClass.year})</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    MAKLUMAT PENJAGA
                  </span>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-[#4A90D9] hover:underline font-semibold"
                  >
                    Ubah
                  </button>
                </div>
                <p className="font-bold text-slate-900 text-sm">{parentName}</p>
                <p className="text-slate-700">Telefon: <span className="font-semibold font-mono">{parentPhone}</span></p>
                {parentEmail && <p className="text-slate-500">Emel: {parentEmail}</p>}
              </div>
            </div>

            {/* Package Review Details */}
            <div className="border border-slate-200 rounded-lg p-5 bg-white">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pakej Terpilih
                </span>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-[#4A90D9] hover:underline font-semibold"
                >
                  Tukar Pakej
                </button>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-extrabold text-[#163B65] text-sm">
                    {selectedPackage.code} · {selectedPackage.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedPackage.description}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-base text-slate-900 tabular-nums">
                    RM {selectedPackage.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-700">Jumlah Bayaran (RM)</span>
                <span className="font-mono text-xl text-[#163B65] tabular-nums font-black">
                  RM {selectedPackage.price.toFixed(2)}
                </span>
              </div>
            </div>

            {errors.submit && (
              <p className="text-xs text-rose-600">{errors.submit}</p>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#163B65] hover:bg-[#102C4E] text-white font-extrabold text-xs rounded-lg transition-colors cursor-pointer shadow-md"
              >
                <span>Sahkan & Jana Tempahan</span>
                <Check className="w-4 h-4 text-[#E6B85C]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PENGESAHAN DAN PEMBAYARAN */}
        {currentStep === 5 && confirmedOrder && (
          <div className="space-y-6">
            {/* Success Banner */}
            <div className="text-center p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h2 className="text-xl font-black text-emerald-950">
                Tempahan Berjaya Didaftarkan!
              </h2>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Rekod tempahan anda telah disimpan ke dalam sistem pengurusan rasmi SK Taman Sri Pulai.
              </p>

              {/* Order ID Display */}
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  NOMBOR TEMPAHAN (ORDER ID)
                </span>
                <div className="inline-flex items-center gap-2 mt-1 px-4 py-2 bg-white rounded-lg border border-emerald-300 shadow-xs">
                  <span className="font-mono font-black text-lg text-[#163B65] tracking-wider">
                    {confirmedOrder.orderNumber}
                  </span>
                  <button
                    onClick={() => copyOrderId(confirmedOrder.orderNumber)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Salin Nombor Tempahan"
                  >
                    {copiedOrderId ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Sila simpan nombor tempahan ini untuk tujuan semakan status atau pertanyaan.
                </p>
              </div>
            </div>

            {/* DEDICATED RUANG QR CODE DAN RUANG NO AKAUN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ruang 1: DuitNow QR Code */}
              <div className="bg-white border-2 border-[#163B65]/20 rounded-xl p-5 flex flex-col items-center justify-between text-center shadow-xs">
                <div className="w-full">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className="text-xs font-black uppercase text-[#163B65] tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E6B85C]" />
                      <span>Ruang DuitNow QR Code</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
                      Imbas & Bayar
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">
                    Imbas kod QR menggunakan mana-mana aplikasi bank (Maybank, CIMB, Bank Islam, TnG eWallet, dsb.)
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block shadow-inner">
                    <img
                      src={settings.qrCodeUrl || '/favicon.ico'}
                      alt="DuitNow QR SK Taman Sri Pulai"
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg shadow-xs mx-auto bg-white p-1"
                    />
                  </div>
                </div>

                <div className="mt-4 w-full pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    Penerima: <strong className="text-[#163B65]">{settings.bankAccountHolder}</strong>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Sokongan DuitNow QR Rasmi Sekolah
                  </span>
                </div>
              </div>

              {/* Ruang 2: Maklumat & No. Akaun Bank */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#4A90D9]" />
                      <span>Ruang No. Akaun Bank</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                      Pemindahan Online
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Bank Name */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                        Nama Bank Penerima
                      </span>
                      <span className="text-sm font-black text-slate-900">{settings.bankName}</span>
                    </div>

                    {/* Account Number with 1-click Copy */}
                    <div className="p-3.5 bg-blue-50/70 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-blue-800 font-bold uppercase block tracking-wider">
                            Nombor Akaun Bank
                          </span>
                          <span className="font-mono text-base sm:text-lg font-black text-[#163B65] tracking-wider">
                            {settings.bankAccountNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(settings.bankAccountNumber.replace(/\s+/g, ''));
                            alert('Nombor akaun bank berjaya disalin!');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-300 hover:bg-blue-100 text-[#163B65] text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#4A90D9]" />
                          <span>Salin</span>
                        </button>
                      </div>
                    </div>

                    {/* Account Holder */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                        Nama Pemegang Akaun
                      </span>
                      <span className="text-xs font-extrabold text-slate-800 uppercase">
                        {settings.bankAccountHolder}
                      </span>
                    </div>

                    {/* Amount to pay */}
                    <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-800 font-bold uppercase block tracking-wider">
                          Jumlah Perlu Dibayar
                        </span>
                        <span className="text-xs text-emerald-700">Pakej: {confirmedOrder.packageNameSnapshot}</span>
                      </div>
                      <span className="font-mono text-xl font-black text-emerald-900 tabular-nums">
                        RM {confirmedOrder.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[11px] text-slate-600 leading-relaxed bg-amber-50/80 p-2.5 rounded border border-amber-200">
                    <strong>Rujukan Bayaran (Payment Reference):</strong> Sila letakkan No. Tempahan <span className="font-mono font-bold text-[#163B65]">{confirmedOrder.orderNumber}</span> atau Nama Murid ({confirmedOrder.studentName}) pada rujukan transaksi perbankan anda.
                  </p>
                </div>
              </div>
            </div>

            {/* Proof Upload Module if not uploaded or upload update */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#4A90D9]" />
                <span>Bukti / Slip Bayaran (Muat Naik Resit)</span>
              </h4>

              {confirmedOrder.paymentProofUrl ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Resit bayaran telah dimuat naik ({confirmedOrder.paymentProofFileName || 'resit.png'}). Pihak admin akan menyemak slip bayaran anda.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Selepas anda membuat bayaran melalui QR atau pemindahan akaun di atas, muat naik slip transaksi di sini untuk mempercepatkan pengesahan pihak sekolah.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                    {proofPreview && (
                      <button
                        onClick={handleUploadProofOnStep5}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition-colors cursor-pointer"
                      >
                        Hantar Slip Bayaran
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <button
                onClick={() => setShowReceiptModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Papar & Cetak Resit Rasmi</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('check-order')}
                  className="px-4 py-2.5 bg-[#163B65] hover:bg-[#102C4E] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Semak Status Tempahan
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setConfirmedOrder(null);
                    setStudentName('');
                    setProofFile(null);
                    setProofPreview('');
                  }}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Buat Tempahan Murid Lain
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Receipt Modal */}
      {showReceiptModal && confirmedOrder && (
        <ReceiptModal
          order={confirmedOrder}
          settings={settings}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
