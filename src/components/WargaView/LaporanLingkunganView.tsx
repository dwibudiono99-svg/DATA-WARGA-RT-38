import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  Shield,
  Home,
  Check,
  X,
  MessageSquare,
  Wrench,
  UserCheck,
} from 'lucide-react';
import { KategoriLaporan, LaporanLingkungan, StatusLaporan } from '../../types/rbac';

export const LaporanLingkunganView: React.FC = () => {
  const {
    laporanList,
    currentUser,
    buatLaporan,
    updateStatusLaporan,
    canExecute,
  } = useRBAC();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kategori, setKategori] = useState<KategoriLaporan>('Lapor Tamu Menginap > 24 Jam');
  const [judul, setJudul] = useState('');
  const [rincian, setRincian] = useState('');

  const isAdmin = currentUser.role === 'admin';

  const kategoriOptions: KategoriLaporan[] = [
    'Lapor Tamu Menginap > 24 Jam',
    'Gangguan Keamanan & Ketertiban',
    'Fasilitas Umum / Lampu Jalan Rusak',
    'Kebersihan & Pengangkutan Sampah',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !rincian.trim()) return;
    buatLaporan({ kategori, judul, rincian });
    setIsModalOpen(false);
    setJudul('');
    setRincian('');
  };

  const handleUpdateStatus = (laporanId: string, status: StatusLaporan) => {
    if (!canExecute('laporan:manage', 'Menindaklanjuti Laporan Warga', 'Keamanan & Lingkungan')) return;
    updateStatusLaporan(laporanId, status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Lapor Tamu Menginap & Pengaduan Lingkungan Perumahan
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              Ketertiban Lingkungan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Warga wajib melaporkan tamu yang menginap lebih dari 1x24 jam demi keamanan bersama, serta dapat mengadukan kerusakan lampu PJU atau fasilitas umum.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Laporan Baru</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {laporanList.map((lap) => {
          const isMyReport =
            lap.blokRumah === currentUser.blokRumah && lap.nomorRumah === currentUser.nomorRumah;

          return (
            <div
              key={lap.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {lap.kategori}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lap.status === 'Selesai'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lap.status === 'Sedang Ditindaklanjuti'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {lap.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{lap.judul}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{lap.rincian}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{lap.namaPelapor}</span>
                  <span className="text-[11px] text-slate-400 block">
                    {lap.blokRumah} No. {lap.nomorRumah} • {lap.tanggalLapor}
                  </span>
                </div>

                {/* Admin Status Toggles */}
                {isAdmin ? (
                  <div className="flex items-center gap-1">
                    {lap.status !== 'Sedang Ditindaklanjuti' && lap.status !== 'Selesai' && (
                      <button
                        onClick={() => handleUpdateStatus(lap.id, 'Sedang Ditindaklanjuti')}
                        className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-bold"
                      >
                        Tindak Lanjuti
                      </button>
                    )}
                    {lap.status !== 'Selesai' && (
                      <button
                        onClick={() => handleUpdateStatus(lap.id, 'Selesai')}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                      >
                        Selesaikan
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400">
                    Dipantau Pengurus RT
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Buat Laporan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Kirim Laporan Tamu / Aduan Warga</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Laporan</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as KategoriLaporan)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:border-amber-500 focus:outline-hidden"
                >
                  {kategoriOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Ringkas</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Misal: Tamu Menginap Keluarga dari Bandung 2 Hari"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rincian Informasi</label>
                <textarea
                  required
                  rows={3}
                  value={rincian}
                  onChange={(e) => setRincian(e.target.value)}
                  placeholder="Sebutkan nama tamu, perkiraan lama menginap, nomor polisi kendaraan, atau rincian kerusakan fasilitas umum..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
