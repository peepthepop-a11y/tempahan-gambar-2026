import React, { useState } from 'react';
import { SystemSettings } from '../../types';
import { SchoolEmblem } from '../common/SchoolEmblem';
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle, Send } from 'lucide-react';

interface ContactPageProps {
  settings: SystemSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4A90D9]">
          Pusat Bantuan & Hubungan
        </span>
        <h1 className="text-3xl font-black text-[#163B65] mt-1">
          Hubungi SK Taman Sri Pulai
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Sebarang pertanyaan berkaitan sesi fotografi, pakej atau status tempahan boleh diajukan kepada pihak kami.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* School Info Cards */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <SchoolEmblem size="md" />
              <div>
                <h3 className="font-extrabold text-[#163B65] text-base">{settings.schoolName}</h3>
                <p className="text-xs text-slate-500">Pejabat Pengurusan Sekolah & PIBG</p>
              </div>
            </div>

            <ul className="space-y-4 text-xs text-slate-700">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#163B65] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Alamat Sekolah:</strong>
                  <span>{settings.schoolAddress}</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#163B65] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">No. Telefon Pejabat:</strong>
                  <span className="font-mono">{settings.schoolPhone}</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#163B65] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Emel Rasmi:</strong>
                  <span>{settings.contactEmail}</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#163B65] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 mb-0.5">Waktu Operasi Pejabat:</strong>
                  <span>Ahad – Khamis: 7:30 Pagi – 2:00 Petang (Kecuali Cuti Umum Negeri Johor)</span>
                </div>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Salam, saya ingin bertanyakan tentang tempahan gambar murid SK Taman Sri Pulai.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hubungi Kami Melalui WhatsApp ({settings.whatsappNumber})</span>
              </a>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h3 className="font-bold text-base text-[#163B65] mb-1">Hantar Mesej Pertanyaan</h3>
          <p className="text-xs text-slate-500 mb-5">
            Tinggalkan mesej anda dan pihak pengurusan fotografi akan membalas secepat mungkin.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-900">Mesej Berjaya Dihantar!</h4>
              <p className="text-xs text-emerald-700">
                Terima kasih atas pertanyaan anda. Pihak sekolah akan menghubungi anda dalam masa terdekat.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs text-[#163B65] font-bold underline cursor-pointer"
              >
                Hantar pertanyaan lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Anda <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama penuh ibu bapa / penjaga"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  No. Telefon (WhatsApp)
                </label>
                <input
                  type="tel"
                  placeholder="012-3456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mesej / Soalan <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Sila nyatakan soalan berkenaan tempahan, ralat bayaran atau perkara berkaitan..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#163B65]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#163B65] hover:bg-[#102C4E] text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Mesej</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
