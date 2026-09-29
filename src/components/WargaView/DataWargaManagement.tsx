import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Home,
  FileText,
  Phone,
  Mail,
  UserCheck,
  X,
  CreditCard,
  Download,
  Eye,
  Shield,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { BlokRumah, StatusHunian, StatusKeluarga, WargaItem, StatusVerifikasiKK } from '../../types/rbac';
import { Sparkles } from 'lucide-react';

interface DataWargaManagementProps {
  onOpenScanKK?: () => void;
}

export const DataWargaManagement: React.FC<DataWargaManagementProps> = ({ onOpenScanKK }) => {
  const {
    wargaList,
    currentUser,
    tambahWarga,
    updateWarga,
    hapusWarga,
    canExecute,
    infoPerumahan,
  } = useRBAC();

  const [searchQuery, setSearchQuery] = useState('');
  const [blokFilter, setBlokFilter] = useState<'all' | BlokRumah>('all');
  const [statusHunianFilter, setStatusHunianFilter] = useState<'all' | StatusHunian>('all');
  const [verifikasiFilter, setVerifikasiFilter] = useState<'all' | StatusVerifikasiKK>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWarga, setEditingWarga] = useState<WargaItem | null>(null);
  const [viewingCard, setViewingCard] = useState<WargaItem | null>(null);

  // Form states
  const [formData, setFormData] = useState<Omit<WargaItem, 'id'>>({
    namaLengkap: '',
    nik: '',
    noKK: '',
    blokRumah: 'Blok A',
    nomorRumah: 'A-01',
    statusHunian: 'Tetap',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    pekerjaan: 'Karyawan Swasta',
    noHp: '+62 812-',
    email: '',
    jumlahAnggotaKeluarga: 3,
    tanggalMasuk: new Date().toISOString().split('T')[0],
    catatanKhusus: '',
    statusVerifikasiKK: 'Terverifikasi',
  });

  const isAdmin = currentUser.role === 'admin';

  // Quick toggle verification status
  const handleToggleVerifikasiKK = (warga: WargaItem) => {
    if (!canExecute('warga:edit_all', 'Mengubah Status Verifikasi Dokumen KK Warga', 'Data Warga')) return;
    const current = warga.statusVerifikasiKK || 'Terverifikasi';
    const nextStatus: StatusVerifikasiKK = current === 'Terverifikasi' ? 'Belum Lengkap' : 'Terverifikasi';
    updateWarga(warga.id, { statusVerifikasiKK: nextStatus });
  };

  // Filtered residents
  const filteredWarga = wargaList.filter((w) => {
    const matchesSearch =
      w.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.nik.includes(searchQuery) ||
      w.noKK.includes(searchQuery) ||
      w.nomorRumah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.pekerjaan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlok = blokFilter === 'all' || w.blokRumah === blokFilter;
    const matchesStatus = statusHunianFilter === 'all' || w.statusHunian === statusHunianFilter;
    const currentVerifikasi = w.statusVerifikasiKK || 'Terverifikasi';
    const matchesVerifikasi = verifikasiFilter === 'all' || currentVerifikasi === verifikasiFilter;
    return matchesSearch && matchesBlok && matchesStatus && matchesVerifikasi;
  });

  const handleOpenAddModal = () => {
    if (!canExecute('warga:create', 'Mendaftarkan Warga Baru ke Database RT', 'Data Warga')) return;
    setFormData({
      namaLengkap: '',
      nik: '3276' + Math.floor(100000000000 + Math.random() * 900000000000),
      noKK: '3276' + Math.floor(100000000000 + Math.random() * 900000000000),
      blokRumah: 'Blok A',
      nomorRumah: 'A-10',
      statusHunian: 'Tetap',
      statusKeluarga: 'Kepala Keluarga',
      jenisKelamin: 'Laki-laki',
      pekerjaan: 'Wiraswasta / Profesional',
      noHp: '+62 81' + Math.floor(10000000 + Math.random() * 90000000),
      email: '',
      jumlahAnggotaKeluarga: 3,
      tanggalMasuk: new Date().toISOString().split('T')[0],
      catatanKhusus: 'Penghuni baru perumahan.',
      statusVerifikasiKK: 'Terverifikasi',
    });
    setIsAddModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap || !formData.nik) {
      alert('Nama Lengkap dan NIK wajib diisi!');
      return;
    }
    tambahWarga(formData);
    setIsAddModalOpen(false);
  };

  const handleEditClick = (warga: WargaItem) => {
    const isOwner = warga.nomorRumah === currentUser.nomorRumah && warga.blokRumah === currentUser.blokRumah;
    if (isOwner) {
      if (!canExecute('warga:edit_own', 'Memperbarui Data Rumah Sendiri', 'Data Warga')) return;
    } else {
      if (!canExecute('warga:edit_all', `Mengubah Data Warga ${warga.namaLengkap}`, 'Data Warga')) return;
    }

    setEditingWarga(warga);
    setFormData({
      namaLengkap: warga.namaLengkap,
      nik: warga.nik,
      noKK: warga.noKK,
      blokRumah: warga.blokRumah,
      nomorRumah: warga.nomorRumah,
      statusHunian: warga.statusHunian,
      statusKeluarga: warga.statusKeluarga,
      jenisKelamin: warga.jenisKelamin,
      pekerjaan: warga.pekerjaan,
      noHp: warga.noHp,
      email: warga.email,
      jumlahAnggotaKeluarga: warga.jumlahAnggotaKeluarga,
      tanggalMasuk: warga.tanggalMasuk,
      catatanKhusus: warga.catatanKhusus || '',
      statusVerifikasiKK: warga.statusVerifikasiKK || 'Terverifikasi',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWarga) return;
    updateWarga(editingWarga.id, formData);
    setEditingWarga(null);
  };

  const handleDeleteClick = (warga: WargaItem) => {
    if (!canExecute('warga:delete', `Menghapus Warga: ${warga.namaLengkap}`, 'Data Warga')) return;

    if (confirm(`Apakah Anda yakin ingin menghapus data warga "${warga.namaLengkap}" (${warga.blokRumah}-${warga.nomorRumah}) karena pindah domisili?`)) {
      hapusWarga(warga.id);
    }
  };

  const handleExportJson = () => {
    if (!canExecute('warga:export', 'Mengekspor Rekap Kependudukan RT', 'Data Warga')) return;

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredWarga, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rekap_warga_${infoPerumahan.rtRw.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // NIK masking helper for privacy
  const formatNIK = (nik: string, isOwnerOrAdmin: boolean) => {
    if (isOwnerOrAdmin) return nik;
    return nik.substring(0, 6) + '******' + nik.substring(12);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Direktori & Pendataan Warga Perumahan
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {wargaList.length} Kepala Keluarga
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data terpadu penghuni {infoPerumahan.namaPerumahan} ({infoPerumahan.rtRw}). NIK dan data pribadi dilindungi aturan hak akses kependudukan.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 self-start md:self-auto">
          {onOpenScanKK && (
            <button
              onClick={onOpenScanKK}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl font-bold text-xs transition-all shadow-xs hover:scale-102 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Scan KK (AI)</span>
            </button>
          )}
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor Rekap RT</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Daftarkan Warga Baru</span>
          </button>
        </div>
      </div>

      {/* Verification Status Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Kepala Keluarga</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{wargaList.length} KK</p>
            <span className="text-[10px] text-slate-500">Terdata di komplek RT 04</span>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between bg-emerald-50/20">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase">KK Terverifikasi (Lengkap)</span>
            <p className="text-2xl font-black text-emerald-900 mt-0.5">
              {wargaList.filter((w) => (w.statusVerifikasiKK || 'Terverifikasi') === 'Terverifikasi').length} KK
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Berkas KK lengkap & valid</span>
            </span>
          </div>
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between bg-amber-50/20">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase">KK Belum Lengkap</span>
            <p className="text-2xl font-black text-amber-900 mt-0.5">
              {wargaList.filter((w) => w.statusVerifikasiKK === 'Belum Lengkap').length} KK
            </p>
            <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3 text-amber-600 animate-pulse" />
              <span>Belum lampirkan scan/foto KK</span>
            </span>
          </div>
          <div className="p-3 bg-amber-100 rounded-xl text-amber-700 border border-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-600 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama warga, nomor rumah (misal A-01), NIK, pekerjaan..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Blok Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={blokFilter}
            onChange={(e) => setBlokFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Semua Blok</option>
            <option value="Blok A">Blok A</option>
            <option value="Blok B">Blok B</option>
            <option value="Blok C">Blok C</option>
            <option value="Blok D">Blok D</option>
          </select>

          {/* Status Hunian Filter */}
          <select
            value={statusHunianFilter}
            onChange={(e) => setStatusHunianFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Semua Status Hunian</option>
            <option value="Tetap">Warga Tetap</option>
            <option value="Kontrak/Sewa">Kontrak / Sewa</option>
          </select>

          {/* Status Verifikasi KK Filter */}
          <select
            value={verifikasiFilter}
            onChange={(e) => setVerifikasiFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Semua Status KK</option>
            <option value="Terverifikasi">✓ KK Terverifikasi (Lengkap)</option>
            <option value="Belum Lengkap">⚠ KK Belum Lengkap</option>
          </select>
        </div>
      </div>

      {/* Residents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Lengkap & NIK</th>
                <th className="px-6 py-4">Blok & Rumah</th>
                <th className="px-6 py-4">Status Berkas KK</th>
                <th className="px-6 py-4">Status Hunian</th>
                <th className="px-6 py-4">Pekerjaan</th>
                <th className="px-6 py-4">Jumlah Jiwa</th>
                <th className="px-6 py-4">Kontak HP</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWarga.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    Tidak ditemukan data warga yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredWarga.map((warga) => {
                  const isOwner = warga.nomorRumah === currentUser.nomorRumah && warga.blokRumah === currentUser.blokRumah;
                  const canSeeFullNIK = isAdmin || isOwner;
                  const isVerified = (warga.statusVerifikasiKK || 'Terverifikasi') === 'Terverifikasi';

                  return (
                    <tr key={warga.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & NIK */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{warga.namaLengkap}</span>
                          {isOwner && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                              Rumah Anda
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>NIK: {formatNIK(warga.nik, canSeeFullNIK)}</span>
                          {!canSeeFullNIK && (
                            <span title="NIK disamarkan untuk privasi warga">
                              <Lock className="w-3 h-3 text-slate-400" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Block & House */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {warga.blokRumah} No. {warga.nomorRumah}
                        </span>
                      </td>

                      {/* Status Verifikasi KK with colored checklist icon */}
                      <td className="px-6 py-4">
                        {isVerified ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs"
                              title="Dokumen Kartu Keluarga (KK) lengkap & terverifikasi oleh RT"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>KK Terverifikasi</span>
                            </span>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleToggleVerifikasiKK(warga)}
                                className="text-[10px] text-slate-400 hover:text-amber-700 underline font-semibold transition-colors cursor-pointer"
                                title="Ubah status menjadi Belum Lengkap"
                              >
                                Ubah
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs"
                              title="Warga belum melengkapi fotokopi atau scan Kartu Keluarga (KK)"
                            >
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
                              <span>KK Belum Lengkap</span>
                            </span>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleToggleVerifikasiKK(warga)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-xs transition-colors cursor-pointer"
                                title="Klik untuk verifikasi kelengkapan berkas KK"
                              >
                                Verifikasi
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Occupancy Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            warga.statusHunian === 'Tetap'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <Home className="w-3 h-3" />
                          <span>{warga.statusHunian}</span>
                        </span>
                      </td>

                      {/* Occupation */}
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {warga.pekerjaan}
                      </td>

                      {/* Family members */}
                      <td className="px-6 py-4 text-slate-700 font-semibold">
                        {warga.jumlahAnggotaKeluarga} Jiwa
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-slate-600 font-mono text-[11px]">
                        {warga.noHp}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingCard(warga)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Lihat Kartu Pendataan Warga Digital"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditClick(warga)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title={isOwner ? 'Edit Data Rumah Sendiri' : isAdmin ? 'Edit Data Warga' : 'Edit (Coba klik untuk tes 403)'}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteClick(warga)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title={isAdmin ? 'Hapus Warga (Pindah)' : 'Hapus Warga (Khusus Pengurus RT - Tes 403)'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Daftarkan Warga Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Formulir Pendataan Warga Baru RT 04</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Kepala Keluarga</label>
                <input
                  type="text"
                  required
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  placeholder="Contoh: Ir. Bambang Sudarsono"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIK (16 Digit)</label>
                  <input
                    type="text"
                    required
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. Kartu Keluarga (KK)</label>
                  <input
                    type="text"
                    required
                    value={formData.noKK}
                    onChange={(e) => setFormData({ ...formData, noKK: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blok Perumahan</label>
                  <select
                    value={formData.blokRumah}
                    onChange={(e) => setFormData({ ...formData, blokRumah: e.target.value as BlokRumah })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="Blok A">Blok A</option>
                    <option value="Blok B">Blok B</option>
                    <option value="Blok C">Blok C</option>
                    <option value="Blok D">Blok D</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Rumah</label>
                  <input
                    type="text"
                    required
                    value={formData.nomorRumah}
                    onChange={(e) => setFormData({ ...formData, nomorRumah: e.target.value })}
                    placeholder="Contoh: A-15"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Hunian</label>
                  <select
                    value={formData.statusHunian}
                    onChange={(e) => setFormData({ ...formData, statusHunian: e.target.value as StatusHunian })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="Tetap">Rumah Milik Sendiri (Tetap)</option>
                    <option value="Kontrak/Sewa">Kontrak / Sewa</option>
                    <option value="Kost">Kost / Homestay</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Jiwa di Rumah</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={formData.jumlahAnggotaKeluarga}
                    onChange={(e) => setFormData({ ...formData, jumlahAnggotaKeluarga: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={formData.pekerjaan}
                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Status Verifikasi Dokumen KK
                </label>
                <select
                  value={formData.statusVerifikasiKK || 'Terverifikasi'}
                  onChange={(e) => setFormData({ ...formData, statusVerifikasiKK: e.target.value as StatusVerifikasiKK })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Terverifikasi">✓ KK Terverifikasi (Dokumen Lengkap)</option>
                  <option value="Belum Lengkap">⚠ Belum Lengkap (Perlu Lampiran)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  value={formData.catatanKhusus}
                  onChange={(e) => setFormData({ ...formData, catatanKhusus: e.target.value })}
                  placeholder="Keterangan kendaraan, kontak darurat, dsb..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Simpan Data Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Data Warga */}
      {editingWarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-600" />
                <span>Ubah Data: {editingWarga.namaLengkap}</span>
              </h3>
              <button
                onClick={() => setEditingWarga(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIK</label>
                  <input
                    type="text"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. KK</label>
                  <input
                    type="text"
                    value={formData.noKK}
                    onChange={(e) => setFormData({ ...formData, noKK: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Hunian</label>
                  <select
                    value={formData.statusHunian}
                    onChange={(e) => setFormData({ ...formData, statusHunian: e.target.value as StatusHunian })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="Tetap">Tetap</option>
                    <option value="Kontrak/Sewa">Kontrak/Sewa</option>
                    <option value="Kost">Kost</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={formData.pekerjaan}
                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. HP</label>
                  <input
                    type="text"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Anggota Keluarga</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.jumlahAnggotaKeluarga}
                    onChange={(e) => setFormData({ ...formData, jumlahAnggotaKeluarga: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Status Verifikasi Dokumen KK
                </label>
                <select
                  value={formData.statusVerifikasiKK || 'Terverifikasi'}
                  onChange={(e) => setFormData({ ...formData, statusVerifikasiKK: e.target.value as StatusVerifikasiKK })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-indigo-500 focus:outline-hidden"
                >
                  <option value="Terverifikasi">✓ KK Terverifikasi (Dokumen Lengkap)</option>
                  <option value="Belum Lengkap">⚠ Belum Lengkap (Perlu Lampiran)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingWarga(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Digital Resident ID Card (Kartu Pendataan Warga) */}
      {viewingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            {/* Card Header styling */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-900 p-6 text-white relative">
              <div className="flex items-center justify-between pb-3 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-emerald-300" />
                  <div>
                    <h3 className="font-extrabold text-sm leading-tight">KARTU PENDATAAN WARGA</h3>
                    <p className="text-[10px] text-emerald-200">{infoPerumahan.namaPerumahan}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingCard(null)}
                  className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                    Alamat / Kavling
                  </span>
                  <p className="text-xl font-black tracking-tight">
                    {viewingCard.blokRumah} No. {viewingCard.nomorRumah}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-xs text-white rounded-lg text-xs font-bold uppercase">
                  {viewingCard.statusHunian}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Nama Kepala Keluarga:</span>
                  <span className="font-bold text-slate-900">{viewingCard.namaLengkap}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Nomor Induk Kependudukan:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {formatNIK(viewingCard.nik, isAdmin || viewingCard.nomorRumah === currentUser.nomorRumah)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Nomor Kartu Keluarga:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {formatNIK(viewingCard.noKK, isAdmin || viewingCard.nomorRumah === currentUser.nomorRumah)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 items-center">
                  <span className="text-slate-500">Status Kelengkapan KK:</span>
                  {(viewingCard.statusVerifikasiKK || 'Terverifikasi') === 'Terverifikasi' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>KK Terverifikasi (Lengkap)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-50 text-amber-900 border border-amber-300">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Belum Lengkap</span>
                    </span>
                  )}
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Pekerjaan:</span>
                  <span className="font-medium text-slate-800">{viewingCard.pekerjaan}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Jumlah Anggota Keluarga:</span>
                  <span className="font-bold text-emerald-700">{viewingCard.jumlahAnggotaKeluarga} Orang</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Nomor Kontak WhatsApp:</span>
                  <span className="font-mono font-semibold text-slate-800">{viewingCard.noHp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Mulai Menetap:</span>
                  <span className="text-slate-700">{viewingCard.tanggalMasuk}</span>
                </div>
              </div>

              {viewingCard.catatanKhusus && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] italic">
                  "{viewingCard.catatanKhusus}"
                </div>
              )}

              <div className="pt-2 text-center">
                <button
                  onClick={() => setViewingCard(null)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Tutup Kartu Warga
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
