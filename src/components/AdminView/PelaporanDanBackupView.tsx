import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  FileSpreadsheet,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Shield,
  CreditCard,
  Users,
  Building2,
  Calendar,
  RefreshCw,
  Printer,
  Copy,
  Radio,
  FileCheck2,
  ShieldAlert,
  Sliders,
  Check,
  X,
  FileUp,
  Database,
  Lock,
  Unlock,
} from 'lucide-react';
import { KopDanLogoRT } from '../KopDanLogoRT';

export const PelaporanDanBackupView: React.FC = () => {
  const {
    wargaList,
    iuranList,
    suratList,
    petugasKeamananList,
    laporanList,
    pengumumanList,
    auditLogs,
    infoPerumahan,
    currentUser,
    canExecute,
    exportFullBackupJSON,
    importFullBackupJSON,
    resetAllToDefault,
    resetToZero,
    isRealtimeActive,
    lastSyncTimestamp,
  } = useRBAC();

  const [activeSubTab, setActiveSubTab] = useState<'export' | 'backup' | 'reset'>('export');

  // Import State
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importFileName, setImportFileName] = useState<string>('');
  const [parsedBackupPreview, setParsedBackupPreview] = useState<any | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [importStatusMessage, setImportStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Reset Modal State
  const [isZeroModalOpen, setIsZeroModalOpen] = useState(false);
  const [zeroConfirmText, setZeroConfirmText] = useState('');
  const [isZeroSuccess, setIsZeroSuccess] = useState(false);

  // Helper for CSV Download
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    if (!canExecute('pelaporan:view', 'Mengunduh Laporan Format CSV', 'Audit & Sistem')) return;

    const escapeField = (val: string | number) => {
      const stringVal = String(val ?? '');
      if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
        return `"${stringVal.replace(/"/g, '""')}"`;
      }
      return stringVal;
    };

    const csvContent =
      '\uFEFF' +
      [headers.map(escapeField).join(','), ...rows.map((row) => row.map(escapeField).join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Handlers
  const handleExportWarga = () => {
    const headers = [
      'No',
      'Nama Lengkap',
      'NIK',
      'No KK',
      'Blok',
      'Nomor Rumah',
      'Status Keluarga',
      'Status Hunian',
      'Jenis Kelamin',
      'Pekerjaan',
      'No Telepon/WA',
      'Email',
      'Jumlah Anggota Keluarga',
      'Tanggal Masuk',
    ];

    const rows = wargaList.map((w, idx) => [
      idx + 1,
      w.namaLengkap,
      w.nik,
      w.noKK,
      w.blokRumah,
      w.nomorRumah,
      w.statusKeluarga,
      w.statusHunian,
      w.jenisKelamin,
      w.pekerjaan,
      w.noHp,
      w.email,
      w.jumlahAnggotaKeluarga,
      w.tanggalMasuk,
    ]);

    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSV(`Laporan_Data_Kependudukan_Warga_${infoPerumahan.rtRw.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}`, headers, rows);
  };

  const handleExportIuran = () => {
    const headers = [
      'No',
      'Nama Warga',
      'Blok',
      'Nomor Rumah',
      'Periode Bulan',
      'Jenis Iuran',
      'Nominal (Rp)',
      'Status Pembayaran',
      'Tanggal Bayar',
      'Metode Pembayaran',
    ];

    const rows = iuranList.map((i, idx) => [
      idx + 1,
      i.namaWarga,
      i.blokRumah,
      i.nomorRumah,
      i.periodeBulan,
      i.jenisIuran,
      i.nominal,
      i.statusBayar,
      i.tanggalBayar || '-',
      i.metodePembayaran || '-',
    ]);

    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSV(`Laporan_Keuangan_Iuran_Warga_${infoPerumahan.rtRw.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}`, headers, rows);
  };

  const handleExportSurat = () => {
    const headers = [
      'No',
      'Nomor Surat Resmi',
      'Nama Pemohon',
      'NIK',
      'Alamat Rumah',
      'Jenis Surat Pengantar',
      'Keperluan Permohonan',
      'Status Validasi',
      'Tanggal Pengajuan',
      'Tanggal Selesai',
    ];

    const rows = suratList.map((s, idx) => [
      idx + 1,
      s.nomorSuratResmi || 'Belum Terbit',
      s.namaPemohon,
      s.nikPemohon,
      `${s.blokRumah} No. ${s.nomorRumah}`,
      s.jenisSurat,
      s.keperluan,
      s.status,
      s.tanggalPengajuan,
      s.tanggalSelesai || '-',
    ]);

    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSV(`Laporan_Buku_Register_Surat_RT_${infoPerumahan.rtRw.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}`, headers, rows);
  };

  const handleExportKeamanan = () => {
    const headers = [
      'No',
      'Nama Petugas Satpam',
      'Jabatan Regu',
      'Nomor Telepon',
      'Nomor WhatsApp',
      'Pos Jaga',
      'Jadwal Shift',
      'Status Jaga Saat Ini',
      'Masa Tugas',
    ];

    const rows = petugasKeamananList.map((p, idx) => [
      idx + 1,
      p.namaLengkap,
      p.jabatan,
      p.noHp,
      p.noWhatsapp,
      p.posJaga,
      p.shift,
      p.statusJaga,
      p.masaTugas,
    ]);

    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSV(`Laporan_Daftar_Petugas_Keamanan_${infoPerumahan.rtRw.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}`, headers, rows);
  };

  const handleExportAudit = () => {
    const headers = [
      'No',
      'Waktu Timestamp',
      'Pengguna (User)',
      'Peran (Role)',
      'Aksi (Action)',
      'Modul Sistem',
      'Status Eksekusi',
      'Rincian Aktivitas',
    ];

    const rows = auditLogs.map((a, idx) => [
      idx + 1,
      a.timestamp,
      a.userName,
      a.userRole === 'admin' ? 'Pengurus RT' : 'Warga',
      a.action,
      a.module,
      a.status === 'success' ? 'Berhasil' : 'Ditolak (403)',
      a.details,
    ]);

    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSV(`Laporan_Log_Audit_Sistem_RBAC_${dateStr}`, headers, rows);
  };

  // File Upload Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setImportStatusMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setImportJsonText(content);
        const parsed = JSON.parse(content);
        setParsedBackupPreview(parsed);
      } catch (err: any) {
        setImportStatusMessage({
          type: 'error',
          text: 'File tidak dapat dibaca sebagai format JSON yang valid: ' + (err?.message || err),
        });
        setParsedBackupPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!parsedBackupPreview) {
      alert('Pilih file backup JSON terlebih dahulu!');
      return;
    }

    const confirmMsg =
      importMode === 'replace'
        ? 'PERINGATAN: Mode "Gantikan Total" akan mengganti database kependudukan, iuran, dan surat saat ini dengan data dari file backup. Lanjutkan?'
        : 'Mode "Gabungkan Data" akan menambahkan data baru tanpa menghapus data saat ini. Lanjutkan?';

    if (!confirm(confirmMsg)) return;

    const ok = importFullBackupJSON(parsedBackupPreview, importMode);
    if (ok) {
      setImportStatusMessage({
        type: 'success',
        text: `Database berhasil dipulihkan dengan mode ${importMode === 'replace' ? 'Gantikan Total' : 'Gabungkan Data'}. Seluruh tab diperbarui secara real-time!`,
      });
      setParsedBackupPreview(null);
      setImportFileName('');
      setImportJsonText('');
    }
  };

  const handleExecuteResetToZero = () => {
    if (zeroConfirmText.trim().toUpperCase() !== 'KOSONGKAN') {
      alert('Kata konfirmasi salah. Ketik "KOSONGKAN" dengan huruf kapital.');
      return;
    }

    const ok = resetToZero();
    if (ok) {
      setIsZeroSuccess(true);
      setTimeout(() => {
        setIsZeroSuccess(false);
        setIsZeroModalOpen(false);
        setZeroConfirmText('');
      }, 1500);
    }
  };

  const handleResetToDefault = () => {
    if (
      confirm(
        'Kembalikan seluruh database ke data bawaan demo lingkungan RT 04 (4 KK warga contoh, iuran contoh, petugas keamanan bawaan)? Data input manual saat ini akan digantikan.'
      )
    ) {
      resetAllToDefault();
      alert('Database berhasil dikembalikan ke data bawaan perumahan contoh awal!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Header Letterhead */}
      <KopDanLogoRT />

      {/* Main Feature Header Card with Realtime Badge */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200">
              <FileSpreadsheet className="w-5 h-5 text-indigo-700" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pusat Pelaporan, Rekap Ekspor & Cadangan Sistem
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              Administrasi RT
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Kelola pencetakan laporan resmi kependudukan dan keuangan, buat cadangan data (backup snapshot .json), pulihkan data (import restore), dan sinkronisasi real-time antar perangkat.
          </p>
        </div>

        {/* Real-time Indicator Pill */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl shrink-0 flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute" />
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full relative" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wide">
                Real-Time Sync Aktif
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-200 text-emerald-800 rounded">
                Live
              </span>
            </div>
            <p className="text-[10px] text-emerald-700 font-medium">
              Broadcast inter-tab & storage sync ({lastSyncTimestamp})
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab('export')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'export'
              ? 'bg-white text-indigo-900 shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          <span>1. Unduh Laporan & Ekspor Data</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('backup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'backup'
              ? 'bg-white text-indigo-900 shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-600" />
          <span>2. Cadangan & Restore (Backup/Import)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('reset')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'reset'
              ? 'bg-white text-rose-900 shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>3. Manajemen Reset & Kosongkan Data</span>
        </button>
      </div>

      {/* SUB-TAB 1: EKSPOR & PELAPORAN */}
      {activeSubTab === 'export' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Data Warga</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{wargaList.length} Jiwa</p>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {wargaList.filter((w) => w.statusKeluarga === 'Kepala Keluarga').length} Kepala Keluarga (KK)
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Rekap Iuran</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{iuranList.length} Tagihan</p>
              <span className="text-[10px] text-blue-700 font-semibold">
                {iuranList.filter((i) => i.statusBayar === 'Lunas').length} Lunas Bulan Ini
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Surat Pengantar</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{suratList.length} Berkas</p>
              <span className="text-[10px] text-indigo-700 font-semibold">
                {suratList.filter((s) => s.status === 'Disetujui / Terbit').length} Disahkan RT
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Petugas Keamanan</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{petugasKeamananList.length} Personel</p>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {petugasKeamananList.filter((p) => p.statusJaga === 'Sedang Bertugas').length} Sedang Bertugas
              </span>
            </div>
          </div>

          {/* Export Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Laporan Data Kependudukan */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Laporan Kependudukan Warga
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Daftar seluruh kepala keluarga dan penghuni, NIK, nomor KK, status kepemilikan rumah, dan kontak warga.
                </p>
                <div className="text-[11px] text-slate-600 font-semibold pt-1">
                  Format: <strong>CSV / Excel Dinas</strong> ({wargaList.length} data baris)
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleExportWarga}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Rekap Warga (CSV)</span>
                </button>
              </div>
            </div>

            {/* 2. Laporan Keuangan & Kas Iuran */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Laporan Keuangan & Kas Iuran
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Laporan penerimaan iuran keamanan & kebersihan perumahan, status verifikasi transfer warga, dan saldo kas RT.
                </p>
                <div className="text-[11px] text-emerald-800 font-semibold pt-1">
                  Saldo Kas RT: <strong>Rp {infoPerumahan.saldoKasRt.toLocaleString('id-ID')}</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleExportIuran}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Rekap Iuran & Kas (CSV)</span>
                </button>
              </div>
            </div>

            {/* 3. Laporan Surat Pengantar RT */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <FileCheck2 className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Buku Register Surat Pengantar
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Buku register penomoran surat keluar, permohonan SKCK, domisili, SKU, dan status validasi tanda tangan Ketua RT.
                </p>
                <div className="text-[11px] text-slate-600 font-semibold pt-1">
                  Total Registrasi: <strong>{suratList.length} Permohonan</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleExportSurat}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Register Surat (CSV)</span>
                </button>
              </div>
            </div>

            {/* 4. Laporan Petugas Keamanan */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Direktori Petugas Keamanan (Satpam)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Daftar regu satpam, nomor telepon darurat, nomor WhatsApp, pos jaga, dan jadwal shift piket lingkungan.
                </p>
                <div className="text-[11px] text-slate-600 font-semibold pt-1">
                  Total Petugas: <strong>{petugasKeamananList.length} Personel Satpam</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleExportKeamanan}
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-amber-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Kontak Keamanan (CSV)</span>
                </button>
              </div>
            </div>

            {/* 5. Laporan Log Audit & RBAC */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-400 transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <ShieldAlert className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Log Audit & Rekam Jejak Sistem
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Rekapitulasi riwayat aktivitas login pengguna, aksi penerbitan surat, persetujuan iuran, dan akses izin sistem RBAC.
                </p>
                <div className="text-[11px] text-slate-600 font-semibold pt-1">
                  Log Terdata: <strong>{auditLogs.length} Baris Aktivitas</strong>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleExportAudit}
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-purple-600/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Log Audit (CSV)</span>
                </button>
              </div>
            </div>

            {/* 6. Cetak Dokumen Rekap Resmi */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 border border-indigo-800">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center border border-white/20">
                  <Printer className="w-5 h-5 text-amber-300" />
                </div>
                <h4 className="font-extrabold text-base text-white">
                  Cetak Lembar Rekap Resmi RT
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cetak langsung format dokumen cetak resmi lengkap dengan KOP surat perumahan dan tanda tangan pengurus.
                </p>
                <div className="text-[11px] text-amber-300 font-semibold pt-1">
                  Format Siap Cetak Kertas A4
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-indigo-800/60">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4 text-indigo-700" />
                  <span>Buka Dialog Cetak / Simpan PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CADANGAN (BACKUP) & RESTORE (IMPORT) */}
      {activeSubTab === 'backup' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Export Full Snapshot */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-700">
                    <Database className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Cadangan Lengkap Sistem (Full Backup JSON)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Unduh satu berkas snapshot utuh berisi seluruh database aplikasi
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Berkas cadangan ini mencakup seluruh data:
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{wargaList.length} Data Warga & NIK</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{iuranList.length} Rekap Tagihan Kas</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{suratList.length} Arsip Surat Pengantar</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{petugasKeamananList.length} Petugas Keamanan</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Identitas KOP & SK RT</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Matriks Hak Akses RBAC</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={exportFullBackupJSON}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File Snapshot Cadangan (.json)</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Disimpan langsung ke komputer Anda tanpa melalui pihak ketiga.
                </p>
              </div>
            </div>

            {/* Right: Import & Restore Database */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-700">
                    <Upload className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Pemulihan Data (Import / Restore)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Unggah berkas JSON cadangan untuk memulihkan seluruh data perumahan
                    </p>
                  </div>
                </div>

                {/* Upload Box */}
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-5 text-center transition-colors bg-slate-50/50">
                  <FileUp className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <label className="cursor-pointer block">
                    <span className="font-bold text-xs text-indigo-700 hover:underline">
                      Pilih berkas backup (.json)
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      atau seret berkas ke area ini
                    </span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {importFileName && (
                    <span className="inline-block mt-2 font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                      Berkas terpilih: {importFileName}
                    </span>
                  )}
                </div>

                {/* Status Message */}
                {importStatusMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      importStatusMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                        : 'bg-rose-50 text-rose-950 border border-rose-200'
                    }`}
                  >
                    {importStatusMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{importStatusMessage.text}</span>
                  </div>
                )}

                {/* Preview of Parsed Data */}
                {parsedBackupPreview && (
                  <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-indigo-950">
                      <span>Pratinjau Data Terdeteksi:</span>
                      <span className="text-[10px] bg-indigo-200 px-2 py-0.5 rounded text-indigo-900 font-mono">
                        Valid Snapshot
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-indigo-900">
                      <span>• Warga: {parsedBackupPreview.wargaList?.length ?? 0} data</span>
                      <span>• Iuran: {parsedBackupPreview.iuranList?.length ?? 0} data</span>
                      <span>• Surat: {parsedBackupPreview.suratList?.length ?? 0} data</span>
                      <span>• Satpam: {parsedBackupPreview.petugasKeamananList?.length ?? 0} data</span>
                    </div>

                    {/* Mode Selection */}
                    <div className="pt-2 border-t border-indigo-200/80 space-y-1.5">
                      <span className="font-bold text-indigo-950 block">Pilih Mode Pemulihan:</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-indigo-200 cursor-pointer">
                          <input
                            type="radio"
                            name="importMode"
                            checked={importMode === 'replace'}
                            onChange={() => setImportMode('replace')}
                          />
                          <span className="font-semibold text-slate-800 text-[11px]">
                            Gantikan Total
                          </span>
                        </label>
                        <label className="flex items-center gap-2 p-2 rounded-xl bg-white border border-indigo-200 cursor-pointer">
                          <input
                            type="radio"
                            name="importMode"
                            checked={importMode === 'merge'}
                            onChange={() => setImportMode('merge')}
                          />
                          <span className="font-semibold text-slate-800 text-[11px]">
                            Gabungkan Data
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={!parsedBackupPreview}
                  onClick={handleExecuteImport}
                  className={`w-full py-3.5 px-5 rounded-2xl font-black text-xs flex items-center justify-center gap-2.5 transition-all ${
                    parsedBackupPreview
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Terapkan Pemulihan Cadangan Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MANAJEMEN RESET (RESET BAWAAN vs KOSONG / NOL) */}
      {activeSubTab === 'reset' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Perhatikan Sebelum Melakukan Reset:</p>
              <p className="text-amber-900 leading-relaxed">
                Tindakan reset akan mempengaruhi penyimpanan lokal dan langsung ter-sinkronisasi secara real-time ke semua tab dan perangkat. Pastikan Anda telah mengunduh berkas cadangan (backup JSON) terlebih dahulu jika ingin menyimpan salinan data saat ini.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Reset ke Data Bawaan (Default Sample Data) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                  <RotateCcw className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Opsi A: Reset ke Data Bawaan (Default Demo)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mengembalikan seluruh sistem ke data awal simulasi RT 04 (4 Kepala Keluarga contoh, rekapitulasi iuran contoh, 3 petugas keamanan awal, dan template surat standar).
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <span className="font-bold block text-slate-800">Kapan menggunakan opsi ini?</span>
                  <p>
                    Sangat cocok untuk demonstrasi aplikasi, pengujian fitur kependudukan, atau latihan administrasi pengurus RT baru.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-300"
                >
                  <RotateCcw className="w-4 h-4 text-slate-600" />
                  <span>Pulihkan ke Data Bawaan Demo Awal</span>
                </button>
              </div>
            </div>

            {/* Card 2: Reset Bersih / Kembali ke Nol (Kosongkan Data Total) */}
            <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-xs flex flex-col justify-between space-y-5 relative overflow-hidden">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
                  <Trash2 className="w-6 h-6 text-rose-600" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-rose-950">
                    Opsi B: Reset Bersih / Kembali ke Nol (Kosongkan)
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                    Nol-kan Data
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mengosongkan seluruh data: <strong>0 data warga</strong>, <strong>0 iuran</strong>, <strong>saldo kas Rp 0</strong>, <strong>0 surat pengantar</strong>, dan <strong>0 aduan tamu</strong>.
                </p>
                <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                  <span className="font-bold block text-rose-950">Hasil setelah dikosongkan:</span>
                  <p>
                    Database bersih total (Blank Sheet). Akun pengurus admin dan konfigurasi dasar perumahan tetap aktif agar pengurus dapat langsung mulai mendaftarkan warga asli perumahan dari nol.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setZeroConfirmText('');
                    setIsZeroModalOpen(true);
                  }}
                  className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-rose-600/25"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Buka Dialog Konfirmasi Reset Nol / Kosong</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI RESET NOL / KOSONGKAN TOTAL */}
      {isZeroModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6 text-rose-600 animate-bounce" />
            </div>

            <div className="text-center space-y-1.5">
              <h4 className="text-lg font-black text-slate-900">
                Konfirmasi Kosongkan Seluruh Data (Nol)
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tindakan ini akan menghapus <strong>seluruh data kependudukan ({wargaList.length} warga)</strong>, riwayat iuran, dan surat resmi menjadi kosong (0).
              </p>
            </div>

            {isZeroSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1 text-emerald-950 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <span className="font-bold text-sm block">Database Berhasil Dikosongkan!</span>
                <p className="text-xs text-emerald-800">
                  Data kini kembali ke status Nol dan siap digunakan untuk perumahan baru.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900">
                  Untuk melanjutkan, ketik kata <strong>KOSONGKAN</strong> di bawah ini:
                </div>

                <input
                  type="text"
                  value={zeroConfirmText}
                  onChange={(e) => setZeroConfirmText(e.target.value)}
                  placeholder="Ketik KOSONGKAN"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 focus:border-rose-500 focus:outline-hidden text-center font-mono font-bold text-sm uppercase tracking-wider"
                />

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsZeroModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={zeroConfirmText.trim().toUpperCase() !== 'KOSONGKAN'}
                    onClick={handleExecuteResetToZero}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                      zeroConfirmText.trim().toUpperCase() === 'KOSONGKAN'
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus & Nol-kan Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
