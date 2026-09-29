import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  Home,
  CreditCard,
  FileCheck2,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  QrCode,
  MapPin,
  FlaskConical,
  Sparkles,
  Camera,
} from 'lucide-react';
import { KopDanLogoRT } from '../KopDanLogoRT';

interface WargaDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenScanKK: () => void;
}

export const WargaDashboard: React.FC<WargaDashboardProps> = ({ onNavigateTab, onOpenScanKK }) => {
  const {
    currentUser,
    wargaList,
    iuranList,
    suratList,
    pengumumanList,
    infoPerumahan,
  } = useRBAC();

  // Current resident data
  const myWargaData = wargaList.find(
    (w) => w.blokRumah === currentUser.blokRumah && w.nomorRumah === currentUser.nomorRumah
  );

  // Current resident dues
  const myDues = iuranList.filter(
    (i) => i.blokRumah === currentUser.blokRumah && i.nomorRumah === currentUser.nomorRumah
  );

  // Current resident letters
  const myLetters = suratList.filter(
    (s) => s.blokRumah === currentUser.blokRumah && s.nomorRumah === currentUser.nomorRumah
  );

  const activePengumuman = pengumumanList.filter((p) => p.aktif);

  return (
    <div className="space-y-6">
      {/* 1. Official Letterhead & Logo (KOP RESMI RT 04) */}
      <KopDanLogoRT onOpenScanKK={onOpenScanKK} />

      {/* 2. Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
              <Home className="w-3.5 h-3.5" />
              <span>Portal Mandiri Penghuni Rumah</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Selamat Datang, {currentUser.name}!
            </h1>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Anda berdomisili di <strong>{currentUser.blokRumah} No. {currentUser.nomorRumah}</strong> ({infoPerumahan.namaPerumahan}, {infoPerumahan.rtRw}). Gunakan portal ini untuk pembayaran iuran bulanan, pengajuan surat pengantar resmi RT, dan lapor tamu menginap.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={onOpenScanKK}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 rounded-2xl font-black text-xs transition-all shadow-md shadow-amber-500/20 hover:scale-102 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
              <span>Pindai KK Saya (AI)</span>
            </button>
            <button
              onClick={() => onNavigateTab('ajukan-surat')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-semibold text-xs transition-all shadow-md shadow-emerald-600/30 hover:scale-102"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Ajukan Surat Pengantar</span>
            </button>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Announcements */}
      {activePengumuman.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-600" />
              <span>Warta & Pengumuman Pengurus RT 04</span>
            </h3>
            <span className="text-xs text-slate-400">Pemberitahuan Warga</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {activePengumuman.map((anc) => (
              <div
                key={anc.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{anc.judul}</span>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      anc.prioritas === 'penting'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {anc.kategori}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">{anc.isi}</p>
                <div className="pt-1 text-[10px] text-slate-400">
                  {anc.penulis} • {anc.tanggal}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resident Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* House Info Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rumah Saya
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {currentUser.blokRumah} No. {currentUser.nomorRumah}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Status: <strong className="text-emerald-700">{myWargaData?.statusHunian || 'Tetap'}</strong></span>
            <span>Jiwa: <strong className="text-slate-800">{myWargaData?.jumlahAnggotaKeluarga || 3} Orang</strong></span>
          </div>
        </div>

        {/* Monthly Dues Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Iuran Bulan Berjalan
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-xl font-black uppercase ${
                myDues[0]?.statusBayar === 'Lunas'
                  ? 'text-emerald-600'
                  : 'text-amber-600'
              }`}
            >
              {myDues[0]?.statusBayar || 'Lunas'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Nominal: <strong>Rp 150.000</strong></span>
            <button
              onClick={() => onNavigateTab('bayar-iuran')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Detail &rarr;
            </button>
          </div>
        </div>

        {/* My Letters Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Surat Pengantar RT
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{myLetters.length}</span>
            <span className="text-xs text-slate-500">Berkas Diajukan</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Terbit Resmi: <strong className="text-emerald-600">{myLetters.filter(l => l.status === 'Disetujui / Terbit').length}</strong></span>
            <span>Diproses: <strong className="text-amber-600">{myLetters.filter(l => l.status === 'Menunggu Validasi RT').length}</strong></span>
          </div>
        </div>

        {/* Security / RBAC Lab Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Privasi Kependudukan
              </span>
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-[11px] text-indigo-800 mt-2 leading-relaxed">
              Data NIK keluarga dan kas RT dilindungi oleh aturan otorisasi RBAC sistem.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('sandbox')}
            className="mt-3 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Uji Hak Akses RBAC &rarr;</span>
          </button>
        </div>
      </div>

      {/* Two Columns: My Letters & My House Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Letters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Surat Pengantar RT Saya</span>
            </h4>
            <button
              onClick={() => onNavigateTab('ajukan-surat')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Ajukan Surat &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myLetters.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Anda belum pernah mengajukan surat pengantar RT.
              </div>
            ) : (
              myLetters.map((l) => (
                <div key={l.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{l.jenisSurat}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.status === 'Disetujui / Terbit'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>
                  {l.nomorSuratResmi && (
                    <span className="font-mono text-[10px] font-bold text-indigo-700 block">
                      No: {l.nomorSuratResmi}
                    </span>
                  )}
                  <p className="text-[11px] text-slate-500 italic">"{l.keperluan}"</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick RBAC Protection Demonstration for Residents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Proteksi RBAC Data Warga Perumahan</span>
            </h4>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-600">
              Role Protection
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Sistem memastikan data sensitif seperti nomor Kartu Keluarga (KK) dan NIK warga rumah lain tidak dapat disalahgunakan:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Mengubah Data Rumah Sendiri ({currentUser.blokRumah}-{currentUser.nomorRumah})
                </span>
                <span className="text-[11px] text-emerald-800 block">
                  Izin: warga:edit_own (DIIZINKAN untuk Warga)
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-200/50 px-2 py-0.5 rounded">
                Bisa Akses
              </span>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  Membuka & Mengunduh NIK Warga Lain / Rekap Kas RT
                </span>
                <span className="text-[11px] text-rose-800 block">
                  Izin: warga:view_all & warga:export (DITOLAK - Khusus RT)
                </span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 uppercase bg-rose-200/50 px-2 py-0.5 rounded">
                Dilarang (403)
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('sandbox')}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>Uji Coba Skenario Hak Akses di Laboratorium RBAC</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
