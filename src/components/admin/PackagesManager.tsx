import React, { useState } from 'react';
import { PhotoPackage } from '../../types';
import { StorageService } from '../../lib/storage';
import { Package, Plus, Edit2, Trash2, Check, Sparkles, X, ShieldAlert } from 'lucide-react';

interface PackagesManagerProps {
  packages: PhotoPackage[];
}

export const PackagesManager: React.FC<PackagesManagerProps> = ({ packages }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PhotoPackage | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(7);
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [contentsText, setContentsText] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPopular, setIsPopular] = useState(false);

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setCode('PAKEJ ');
    setName('');
    setPrice(7);
    setOriginalPrice('');
    setDescription('');
    setContentsText('1x Cetakan Gambar Kelas Saiz 5R\nReka Bentuk Template Rasmi SKTSP\nKemasan Kertas Foto Studio Makmal\nHanya Cetakan Gambar Sahaja');
    setIsActive(true);
    setIsPopular(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: PhotoPackage) => {
    setEditingPkg(pkg);
    setCode(pkg.code);
    setName(pkg.name);
    setPrice(pkg.price);
    setOriginalPrice(pkg.originalPrice ?? '');
    setDescription(pkg.description);
    setContentsText(pkg.contents.join('\n'));
    setIsActive(pkg.isActive);
    setIsPopular(Boolean(pkg.isPopular));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const contents = contentsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const origPriceVal = originalPrice !== '' && Number(originalPrice) > 0 ? Number(originalPrice) : undefined;

    if (editingPkg) {
      StorageService.updatePackage(editingPkg.id, {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        price: Number(price),
        originalPrice: origPriceVal,
        description: description.trim(),
        contents,
        isActive,
        isPopular,
      });
    } else {
      StorageService.addPackage({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        price: Number(price),
        originalPrice: origPriceVal,
        description: description.trim(),
        contents,
        isActive,
        isPopular,
      });
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = (pkg: PhotoPackage) => {
    StorageService.updatePackage(pkg.id, { isActive: !pkg.isActive });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Adakah anda pasti mahu memadam pakej "${name}"?`)) {
      StorageService.deletePackage(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#163B65]">Pengurusan Pakej Fotografi</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tetapkan senarai pakej, harga jualan dan butiran item cetakan bagi sesi fotografi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#163B65] text-white text-xs font-bold hover:bg-[#102C4E] transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#E6B85C]" />
          <span>Tambah Pakej Baharu</span>
        </button>
      </div>

      {/* Snapshot guarantee notice */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-[#163B65] shrink-0" />
        <span>
          <strong>Integriti Data Terjamin:</strong> Perubahan harga pakej di sini hanya terpakai untuk tempahan baharu. Tempahan sedia ada mengekalkan snapshot harga asal dalam rekod invois masing-masing.
        </span>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-xl border p-6 space-y-4 shadow-xs transition-all relative ${
              pkg.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-[#4A90D9]">{pkg.code}</span>
                  {pkg.isPopular && (
                    <span className="text-[10px] bg-[#163B65] text-[#E6B85C] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Popular</span>
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-[#163B65] mt-1">{pkg.name}</h3>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-[#163B65] font-mono tabular-nums block">
                  RM {pkg.price.toFixed(2)}
                </span>
                {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-[11px] text-slate-400 line-through font-mono">
                      RM {pkg.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">
                      Jimat RM {(pkg.originalPrice - pkg.price).toFixed(2)}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => handleToggleActive(pkg)}
                  className={`block ml-auto mt-1 px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    pkg.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {pkg.isActive ? 'Aktif' : 'Nyahaktif'}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600">{pkg.description}</p>

            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Kandungan Item:</span>
              <ul className="space-y-1 text-xs text-slate-700">
                {pkg.contents.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(pkg)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Pakej</span>
              </button>
              <button
                onClick={() => handleDelete(pkg.id, pkg.name)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                title="Padam"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 bg-[#163B65] text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm">
                {editingPkg ? 'Kemaskini Pakej Gambar' : 'Tambah Pakej Baharu'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Kod Pakej *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PAKEJ A"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300 uppercase font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Harga Jualan (RM) *</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded border border-slate-300 font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Harga Asal (RM) (Pilihan)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    placeholder="Contoh: 14.00"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Nama Pakej *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gambar Formal Kelas Saiz 5R"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Penerangan Ringkas</label>
                <textarea
                  rows={2}
                  placeholder="Penerangan ringkas untuk paparan ibu bapa"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Kandungan Item Cetakan (1 item setiap baris) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="1x Cetakan Foto Individu 8R&#10;1x Foto Kelas 8R&#10;4x Foto Saiz Pasport"
                  value={contentsText}
                  onChange={(e) => setContentsText(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#163B65]"
                  />
                  <span className="font-semibold text-slate-700">Aktifkan Pakej Ini</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-[#163B65]"
                  />
                  <span className="font-semibold text-slate-700">Lencana Paling Popular</span>
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
                  Simpan Pakej
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
