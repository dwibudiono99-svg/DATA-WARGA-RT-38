import React from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  Building2,
  Users,
  CreditCard,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Shield,
  ArrowUpRight,
  PlusCircle,
  Clock,
  Home,
  MapPin,
  TrendingUp,
  Sparkles,
  Camera,
  Scan,
} from 'lucide-react';
import { KopDanLogoRT } from '../KopDanLogoRT';
import { WebHostingBanner } from '../WebHostingBanner';

interface RTDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenTambahWarga: () => void;
  onOpenScanKK: () => void;
  onOpenPrintPoster?: () => void;
}

export const RTDashboard: React.FC<RTDashboardProps> = ({
  onNavigateTab,
  onOpenTambahWarga,
  onOpenScanKK,
  onOpenPrintPoster,
}) => {
  const {
    wargaList,
    iuranList,
    suratList,
    laporanList,
    infoPerumahan,
    currentUser,
  } = useRBAC();

  const totalWarga = wargaList.length;
  const totalKK = wargaList.filter((w) => w.statusKeluarga === 'Kepala Keluarga').length;
  const wargaTetap = wargaList.filter((w) => w.statusHunian === 'Tetap').length;
  const wargaKontrak = wargaList.filter((w) => w.statusHunian === 'Kontrak/Sewa').length;

  const totalIuranLunas = iuranList.filter((i) => i.statusBayar === 'Lunas').length;
  const totalIuranPending = iuranList.filter((i) => i.statusBayar === 'Menunggu Verifikasi').length;

  const pendingSurat = suratList.filter((s) => s.status === 'Menunggu Validasi RT');
  const pendingLaporan = laporanList.filter((l) => l.status === 'Diterima');

  const blokStats = [
    { name: 'Blok A', count: wargaList.filter((w) => w.blokRumah === 'Blok A').length },
    { name: 'Blok B', count: wargaList.filter((w) => w.blokRumah === 'Blok B').length },
    { name: 'Blok C', count: wargaList.filter((w) => w.blokRumah === 'Blok C').length },
    { name: 'Blok D', count: wargaList.filter((w) => w.blokRumah === 'Blok D').length },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Official Letterhead & Logo (KOP RESMI RT 04) */}
      <KopDanLogoRT onOpenScanKK={onOpenScanKK} onOpenWebHosting={onOpenPrintPoster} />

      {/* Web Hosting Portal Address & Scannable QR Code */}
      <WebHostingBanner onOpenPrintPoster={onOpenPrintPoster} />

      {/* 2. Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Dasbor Otoritas Pengurus Lingkungan RT 04</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Selamat Bertugas, {currentUser.name}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Anda mengelola data kependudukan <strong>{infoPerumahan.namaPerumahan}</strong> ({infoPerumahan.rtRw}, {infoPerumahan.kelurahan}). Anda berwenang memvalidasi NIK/KK, mengesahkan surat pengantar resmi, dan mengelola kas iuran warga.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={onOpenScanKK}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl font-extrabold text-xs transition-all shadow-lg shadow-emerald-900/30 hover:scale-102 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Pindai KK dengan AI</span>
            </button>
            <button
              onClick={onOpenTambahWarga}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Warga Manual</span>
            </button>
          </div>
        </div>

        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 3. AI Scan KK Interactive Highlight Feature Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 border border-emerald-700/50 shadow-md text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Fasilitas OCR Cerdas (Gemini AI Vision)</span>
          </div>
          <h3 className="text-xl font-black text-white">
            Foto / Unggah Kartu Keluarga & Ekstrak Data Otomatis
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tidak perlu mengetik satu per satu! Ambil foto fisik Kartu Keluarga (KK) warga atau unggah berkas gambar. Sistem AI membaca Nomor KK, nama kepala keluarga, NIK, dan semua anggota keluarga langsung ke direktori RT.
          </p>
        </div>

        <button
          onClick={onOpenScanKK}
          className="z-10 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2.5 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          <Camera className="w-4 h-4 text-slate-950" />
          <span>Buka Pemindai Kamera KK AI &rarr;</span>
        </button>

        {/* Background glow */}
        <div className="absolute -bottom-10 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Action alerts: Pending Surat & Iuran Verifications */}
      {(pendingSurat.length > 0 || totalIuranPending > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {pendingSurat.length > 0 && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 text-white rounded-xl">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-950">
                    {pendingSurat.length} Surat Menunggu Tanda Tangan RT
                  </h4>
                  <p className="text-amber-800 text-[11px]">
                    Warga membutuhkan surat pengantar resmi segera.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('surat')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shrink-0"
              >
                Proses &rarr;
              </button>
            </div>
          )}

          {totalIuranPending > 0 && (
            <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-950">
                    {totalIuranPending} Pembayaran Iuran Menunggu Verifikasi
                  </h4>
                  <p className="text-blue-800 text-[11px]">
                    Bukti transfer warga masuk ke sistem.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('iuran')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shrink-0"
              >
                Cek Iuran &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Residents */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Kepala Keluarga
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalKK}</span>
            <span className="text-xs text-slate-500">KK Terdata</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tetap: <strong className="text-indigo-600">{wargaTetap}</strong></span>
            <span>Kontrak: <strong className="text-amber-600">{wargaKontrak}</strong></span>
          </div>
        </div>

        {/* Total Cash RT */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Saldo Kas RT 04
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              Rp {infoPerumahan.saldoKasRt.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Iuran Lunas Bln Ini:</span>
            <span className="font-bold text-slate-800">{totalIuranLunas} Rumah</span>
          </div>
        </div>

        {/* Letters Issued */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Surat Pengantar RT
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{suratList.length}</span>
            <span className="text-xs text-slate-500">Pengajuan</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Terbit: <strong className="text-emerald-600">{suratList.filter(s => s.status === 'Disetujui / Terbit').length}</strong></span>
            <span>Menunggu: <strong className="text-amber-600">{pendingSurat.length}</strong></span>
          </div>
        </div>

        {/* Neighborhood Security & Guest reports */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lapor Tamu & Fasum
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{laporanList.length}</span>
            <span className="text-xs text-slate-500">Laporan</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Selesai: <strong className="text-emerald-600">{laporanList.filter(l => l.status === 'Selesai').length}</strong></span>
            <span>Diproses: <strong className="text-purple-600">{pendingLaporan.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Distribution by Blocks (Blok A, B, C, D) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Home className="w-5 h-5 text-indigo-600" />
              <span>Peta Distribusi Penghuni Per Blok Perumahan</span>
            </h3>
            <p className="text-xs text-slate-500">
              Cakupan data kepala keluarga di wilayah RT 04 / RW 09
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('warga')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Buka Direktori Warga</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {blokStats.map((b) => (
            <div
              key={b.name}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1 hover:border-indigo-300 transition-colors"
            >
              <div className="font-extrabold text-sm text-slate-900">{b.name}</div>
              <div className="text-2xl font-black text-indigo-600">{b.count}</div>
              <div className="text-[11px] text-slate-400">Kepala Keluarga</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column: Recent Pending Letters & Recent Residents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Letters Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              <span>Surat Pengantar RT Terbaru</span>
            </h4>
            <button
              onClick={() => onNavigateTab('surat')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Kelola Surat &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {suratList.slice(0, 4).map((srt) => (
              <div key={srt.id} className="py-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{srt.jenisSurat}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      srt.status === 'Disetujui / Terbit'
                        ? 'bg-emerald-100 text-emerald-800'
                        : srt.status === 'Menunggu Validasi RT'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {srt.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                  "{srt.keperluan}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Pemohon: {srt.namaPemohon} ({srt.blokRumah}-{srt.nomorRumah})</span>
                  <span>{srt.tanggalPengajuan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Residents Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Warga Terdaftar Terbaru</span>
            </h4>
            <button
              onClick={() => onNavigateTab('warga')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Lihat Semua &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {wargaList.slice(0, 4).map((w) => (
              <div key={w.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{w.namaLengkap}</p>
                  <p className="text-[11px] text-slate-500">
                    {w.blokRumah} No. {w.nomorRumah} • {w.pekerjaan}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      w.statusHunian === 'Tetap'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {w.statusHunian}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{w.jumlahAnggotaKeluarga} Anggota</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
