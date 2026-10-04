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
  AlertTriangle,
  Clock,
  Printer,
  Sparkles,
  Calendar,
  Layers,
  Heart,
  Briefcase,
  GraduationCap,
  Baby,
} from 'lucide-react';
import {
  BlokRumah,
  StatusHunian,
  StatusKeluarga,
  WargaItem,
  StatusVerifikasiKK,
  Agama,
  PendidikanTerakhir,
  GolonganDarah,
  StatusPernikahan,
  HubunganKeluarga,
  AnggotaKeluargaKK,
} from '../../types/rbac';

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
  const [deletingWarga, setDeletingWarga] = useState<WargaItem | null>(null);
  const [deleteToastMessage, setDeleteToastMessage] = useState<string | null>(null);

  // Active Tab inside Add/Edit Modal
  const [formActiveTab, setFormActiveTab] = useState<'pokok' | 'identitas' | 'sipil' | 'anggota'>('pokok');

  // New Anggota Temp State for Form
  const [tempAnggota, setTempAnggota] = useState<AnggotaKeluargaKK>({
    id: '',
    namaLengkap: '',
    nik: '',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Depok',
    tanggalLahir: '2010-01-01',
    agama: 'Islam',
    pendidikan: 'SLTP / Sederajat',
    pekerjaan: 'Pelajar / Mahasiswa',
    golonganDarah: 'O',
    statusPernikahan: 'Belum Kawin',
    hubunganKeluarga: 'Anak',
    kewarganegaraan: 'WNI',
    namaAyah: '',
    namaIbu: '',
  });

  // Form states with all official KK items
  const [formData, setFormData] = useState<Omit<WargaItem, 'id'>>({
    namaLengkap: '',
    nik: '',
    noKK: '',
    blokRumah: 'Blok AE',
    nomorRumah: 'AE-01',
    statusHunian: 'Tetap',
    statusKeluarga: 'Kepala Keluarga',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Sidoarjo',
    tanggalLahir: '1985-01-01',
    agama: 'Islam',
    pendidikan: 'Diploma IV / Strata I',
    pekerjaan: 'Karyawan Swasta',
    golonganDarah: 'O',
    statusPernikahan: 'Kawin Tercatat',
    tanggalPerkawinan: '2010-06-12',
    hubunganKeluarga: 'Kepala Keluarga',
    kewarganegaraan: 'WNI',
    noPaspor: '',
    noKitasKitap: '',
    namaAyah: '',
    namaIbu: '',
    alamatKtp: '',
    noHp: '+62 812-',
    email: '',
    jumlahAnggotaKeluarga: 3,
    tanggalMasuk: new Date().toISOString().split('T')[0],
    catatanKhusus: '',
    statusVerifikasiKK: 'Terverifikasi',
    anggotaKeluarga: [],
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
    const randomNik = '3276' + Math.floor(100000000000 + Math.random() * 900000000000);
    const randomKK = '3276' + Math.floor(100000000000 + Math.random() * 900000000000);

    setFormData({
      namaLengkap: '',
      nik: randomNik,
      noKK: randomKK,
      blokRumah: 'Blok AE',
      nomorRumah: 'AE-10',
      statusHunian: 'Tetap',
      statusKeluarga: 'Kepala Keluarga',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Sidoarjo',
      tanggalLahir: '1985-05-12',
      agama: 'Islam',
      pendidikan: 'Diploma IV / Strata I',
      pekerjaan: 'Karyawan Swasta',
      golonganDarah: 'O',
      statusPernikahan: 'Kawin Tercatat',
      tanggalPerkawinan: '2012-08-18',
      hubunganKeluarga: 'Kepala Keluarga',
      kewarganegaraan: 'WNI',
      noPaspor: '',
      noKitasKitap: '',
      namaAyah: '',
      namaIbu: '',
      alamatKtp: `${infoPerumahan.namaPerumahan} Blok AE No. 01, ${infoPerumahan.rtRw} Kel. ${infoPerumahan.kelurahan}`,
      noHp: '+62 81' + Math.floor(10000000 + Math.random() * 90000000),
      email: '',
      jumlahAnggotaKeluarga: 3,
      tanggalMasuk: new Date().toISOString().split('T')[0],
      catatanKhusus: 'Penghuni baru terdata resmi.',
      statusVerifikasiKK: 'Terverifikasi',
      anggotaKeluarga: [
        {
          id: 'ak_auto_1',
          namaLengkap: 'Nama Kepala Keluarga',
          nik: randomNik,
          jenisKelamin: 'Laki-laki',
          tempatLahir: 'Depok',
          tanggalLahir: '1985-05-12',
          agama: 'Islam',
          pendidikan: 'Diploma IV / Strata I',
          pekerjaan: 'Karyawan Swasta',
          golonganDarah: 'O',
          statusPernikahan: 'Kawin Tercatat',
          hubunganKeluarga: 'Kepala Keluarga',
          kewarganegaraan: 'WNI',
          namaAyah: 'Ayah Kandung',
          namaIbu: 'Ibu Kandung',
        },
      ],
    });
    setFormActiveTab('pokok');
    setIsAddModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap || !formData.nik || !formData.noKK) {
      alert('Nama Lengkap, NIK, dan Nomor KK wajib diisi lengkap!');
      return;
    }

    // Auto-sync Kepala Keluarga name in anggotaKeluarga[0]
    let updatedAnggota = [...(formData.anggotaKeluarga || [])];
    if (updatedAnggota.length > 0 && updatedAnggota[0].hubunganKeluarga === 'Kepala Keluarga') {
      updatedAnggota[0] = {
        ...updatedAnggota[0],
        namaLengkap: formData.namaLengkap,
        nik: formData.nik,
        tempatLahir: formData.tempatLahir || 'Depok',
        tanggalLahir: formData.tanggalLahir || '1985-01-01',
        agama: formData.agama || 'Islam',
        pekerjaan: formData.pekerjaan || 'Karyawan Swasta',
      };
    } else if (updatedAnggota.length === 0) {
      updatedAnggota.push({
        id: 'ak_' + Date.now(),
        namaLengkap: formData.namaLengkap,
        nik: formData.nik,
        jenisKelamin: formData.jenisKelamin,
        tempatLahir: formData.tempatLahir || 'Depok',
        tanggalLahir: formData.tanggalLahir || '1985-01-01',
        agama: formData.agama || 'Islam',
        pendidikan: formData.pendidikan || 'Diploma IV / Strata I',
        pekerjaan: formData.pekerjaan,
        golonganDarah: formData.golonganDarah || 'O',
        statusPernikahan: formData.statusPernikahan || 'Kawin Tercatat',
        hubunganKeluarga: 'Kepala Keluarga',
        kewarganegaraan: formData.kewarganegaraan || 'WNI',
        namaAyah: formData.namaAyah || '-',
        namaIbu: formData.namaIbu || '-',
      });
    }

    tambahWarga({
      ...formData,
      anggotaKeluarga: updatedAnggota,
      jumlahAnggotaKeluarga: updatedAnggota.length,
    });
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
      tempatLahir: warga.tempatLahir || 'Depok',
      tanggalLahir: warga.tanggalLahir || '1985-01-01',
      agama: warga.agama || 'Islam',
      pendidikan: warga.pendidikan || 'Diploma IV / Strata I',
      pekerjaan: warga.pekerjaan,
      golonganDarah: warga.golonganDarah || 'O',
      statusPernikahan: warga.statusPernikahan || 'Kawin Tercatat',
      tanggalPerkawinan: warga.tanggalPerkawinan || '',
      hubunganKeluarga: warga.hubunganKeluarga || 'Kepala Keluarga',
      kewarganegaraan: warga.kewarganegaraan || 'WNI',
      noPaspor: warga.noPaspor || '',
      noKitasKitap: warga.noKitasKitap || '',
      namaAyah: warga.namaAyah || '',
      namaIbu: warga.namaIbu || '',
      alamatKtp: warga.alamatKtp || `${infoPerumahan.namaPerumahan} ${warga.blokRumah} No. ${warga.nomorRumah}`,
      noHp: warga.noHp,
      email: warga.email,
      jumlahAnggotaKeluarga: warga.jumlahAnggotaKeluarga,
      tanggalMasuk: warga.tanggalMasuk,
      catatanKhusus: warga.catatanKhusus || '',
      statusVerifikasiKK: warga.statusVerifikasiKK || 'Terverifikasi',
      anggotaKeluarga: warga.anggotaKeluarga || [],
    });
    setFormActiveTab('pokok');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWarga) return;

    const count = formData.anggotaKeluarga && formData.anggotaKeluarga.length > 0
      ? formData.anggotaKeluarga.length
      : formData.jumlahAnggotaKeluarga;

    updateWarga(editingWarga.id, {
      ...formData,
      jumlahAnggotaKeluarga: count,
    });
    setEditingWarga(null);
  };

  const handleDeleteClick = (warga: WargaItem) => {
    if (!canExecute('warga:delete', `Menghapus Warga: ${warga.namaLengkap}`, 'Data Warga')) return;
    setDeletingWarga(warga);
  };

  const handleConfirmDelete = () => {
    if (!deletingWarga) return;
    const targetName = deletingWarga.namaLengkap;
    const targetHouse = `${deletingWarga.blokRumah}-${deletingWarga.nomorRumah}`;
    hapusWarga(deletingWarga.id);
    setDeletingWarga(null);
    setDeleteToastMessage(`✓ Data warga "${targetName}" (${targetHouse}) berhasil dihapus dari direktori kependudukan RT.`);
    setTimeout(() => setDeleteToastMessage(null), 4000);
  };

  // Add anggota keluarga helper
  const handleAddAnggotaToForm = () => {
    if (!tempAnggota.namaLengkap || !tempAnggota.nik) {
      alert('Nama anggota dan NIK wajib diisi!');
      return;
    }
    const newAnggota: AnggotaKeluargaKK = {
      ...tempAnggota,
      id: 'ak_' + Date.now(),
    };
    const updated = [...(formData.anggotaKeluarga || []), newAnggota];
    setFormData({
      ...formData,
      anggotaKeluarga: updated,
      jumlahAnggotaKeluarga: updated.length,
    });
    // Reset temp
    setTempAnggota({
      id: '',
      namaLengkap: '',
      nik: '3276' + Math.floor(100000000000 + Math.random() * 900000000000),
      jenisKelamin: 'Perempuan',
      tempatLahir: 'Depok',
      tanggalLahir: '2012-05-15',
      agama: formData.agama || 'Islam',
      pendidikan: 'SLTP / Sederajat',
      pekerjaan: 'Pelajar / Mahasiswa',
      golonganDarah: 'O',
      statusPernikahan: 'Belum Kawin',
      hubunganKeluarga: 'Anak',
      kewarganegaraan: 'WNI',
      namaAyah: formData.namaLengkap,
      namaIbu: '-',
    });
  };

  const handleRemoveAnggotaFromForm = (id: string) => {
    const updated = (formData.anggotaKeluarga || []).filter((a) => a.id !== id);
    setFormData({
      ...formData,
      anggotaKeluarga: updated,
      jumlahAnggotaKeluarga: updated.length,
    });
  };

  const handleExportJson = () => {
    if (!canExecute('warga:export', 'Mengekspor Rekap Kependudukan RT', 'Data Warga')) return;

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredWarga, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `rekap_warga_kk_${infoPerumahan.rtRw.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // NIK masking helper for privacy
  const formatNIK = (nik: string, isOwnerOrAdmin: boolean) => {
    if (isOwnerOrAdmin) return nik;
    return nik.substring(0, 6) + '******' + nik.substring(12);
  };

  // Quick stats
  const totalVerified = wargaList.filter((w) => w.statusVerifikasiKK === 'Terverifikasi').length;
  const totalUnverified = wargaList.filter((w) => w.statusVerifikasiKK === 'Belum Lengkap').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {deleteToastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-3">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
          <span>{deleteToastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Buku Registrasi & Pendataan Warga Sesuai Kartu Keluarga (KK)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {wargaList.length} Kepala Keluarga
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data kependudukan lengkap sesuai model blangko resmi Kartu Keluarga (Kemendagri / Disdukcapil). NIK dan data pribadi tersinkronisasi aman.
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
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            title="Ekspor seluruh data warga ke format JSON"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor JSON</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-indigo-600/20 hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah KK Warga</span>
          </button>
        </div>
      </div>

      {/* RBAC Authority Notice for Pengurus RT */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-rose-50/40 border border-indigo-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900">
                  Otoritas RBAC Pengurus RT: Pengelolaan & Penghapusan Data Warga
                </span>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  warga:delete Aktif
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pengurus RT berwenang penuh menambah, mengedit, memvalidasi KK, serta <strong>menghapus data warga</strong> (mutasi pindah domisili) melalui tombol hapus (<Trash2 className="w-3.5 h-3.5 inline text-rose-600 mx-0.5" />) di kolom aksi tabel, formulir edit, maupun salinan KK.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards: Verification Status & Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Kepala Keluarga</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{wargaList.length} KK</p>
          <span className="text-[10px] text-indigo-700 font-semibold">Tercatat di {infoPerumahan.rtRw}</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-900 uppercase">KK Terverifikasi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-950 mt-1">{totalVerified} KK</p>
          <span className="text-[10px] text-emerald-700 font-semibold">✓ Dokumen KK Lengkap</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-900 uppercase">KK Belum Lengkap</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-950 mt-1">{totalUnverified} KK</p>
          <span className="text-[10px] text-amber-800 font-semibold">⚠ Perlu Melengkapi Berkas</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Jiwa Penduduk</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {wargaList.reduce((acc, curr) => acc + (curr.jumlahAnggotaKeluarga || 1), 0)} Jiwa
          </p>
          <span className="text-[10px] text-slate-600 font-semibold">Penghuni Tetap & Sewa</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NIK, No. KK, rumah..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Verifikasi KK Filter */}
          <select
            value={verifikasiFilter}
            onChange={(e) => setVerifikasiFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">Semua Status Verifikasi KK</option>
            <option value="Terverifikasi">✓ KK Terverifikasi (Lengkap)</option>
            <option value="Belum Lengkap">⚠ Belum Lengkap</option>
          </select>

          {/* Blok Filter */}
          <select
            value={blokFilter}
            onChange={(e) => setBlokFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">Semua Blok</option>
            <option value="Blok AE">Blok AE</option>
            <option value="Blok DB">Blok DB</option>
            <option value="Blok DC">Blok DC</option>
            <option value="Blok DE">Blok DE</option>
            <option value="Blok DF">Blok DF</option>
            <option value="Blok DG">Blok DG</option>
          </select>

          {/* Status Hunian Filter */}
          <select
            value={statusHunianFilter}
            onChange={(e) => setStatusHunianFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">Semua Status Hunian</option>
            <option value="Tetap">Rumah Tetap (Milik)</option>
            <option value="Kontrak/Sewa">Kontrak / Sewa</option>
            <option value="Kost">Kost / Homestay</option>
          </select>
        </div>
      </div>

      {/* Main Table: Data Kependudukan Sesuai KK */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Nama Kepala Keluarga & NIK</th>
                <th className="px-6 py-3.5">No. Kartu Keluarga (KK)</th>
                <th className="px-6 py-3.5">Alamat / Kavling</th>
                <th className="px-6 py-3.5">Status Verifikasi KK</th>
                <th className="px-6 py-3.5">Pekerjaan</th>
                <th className="px-6 py-3.5">Jumlah Jiwa</th>
                <th className="px-6 py-3.5">Kontak WA</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWarga.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400">
                    Tidak ditemukan data warga yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredWarga.map((warga) => {
                  const isOwner =
                    warga.nomorRumah === currentUser.nomorRumah && warga.blokRumah === currentUser.blokRumah;
                  const isVerified = (warga.statusVerifikasiKK || 'Terverifikasi') === 'Terverifikasi';

                  return (
                    <tr key={warga.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & NIK */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {warga.namaLengkap.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{warga.namaLengkap}</span>
                              {isOwner && (
                                <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase">
                                  Saya
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                              <span>NIK:</span>
                              <span className="font-semibold text-slate-600">
                                {formatNIK(warga.nik, isAdmin || isOwner)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* No. KK */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {formatNIK(warga.noKK, isAdmin || isOwner)}
                        </span>
                      </td>

                      {/* House Address */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {warga.blokRumah} No. {warga.nomorRumah}
                        </div>
                        <span
                          className={`inline-block text-[10px] px-2 py-0.2 rounded-md font-bold ${
                            warga.statusHunian === 'Tetap'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {warga.statusHunian}
                        </span>
                      </td>

                      {/* Verification Status with Colored Checklist Badge */}
                      <td className="px-6 py-4">
                        {isVerified ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>✓ KK Terverifikasi</span>
                            </span>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleToggleVerifikasiKK(warga)}
                                className="text-[10px] text-slate-400 hover:text-amber-600 underline cursor-pointer"
                                title="Ubah status menjadi Belum Lengkap"
                              >
                                Ubah
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
                              <span>⚠ Belum Lengkap</span>
                            </span>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleToggleVerifikasiKK(warga)}
                                className="text-[10px] text-emerald-600 hover:text-emerald-800 font-bold underline cursor-pointer"
                                title="Verifikasi dokumen KK sekarang"
                              >
                                Verifikasi
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Occupation */}
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {warga.pekerjaan}
                      </td>

                      {/* Family members */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded-md border border-indigo-200">
                          {warga.jumlahAnggotaKeluarga || 1} Jiwa
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-slate-600 font-mono text-[11px]">
                        {warga.noHp}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingCard(warga)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                            title="Buka Dokumen Kartu Keluarga (KK) Resmi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditClick(warga)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                            title="Edit Data KK Warga"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteClick(warga)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Hapus Data (Warga Pindah)"
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

      {/* MODAL: Tambah Warga Baru Sesuai Model KK Kemendagri */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <FileText className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    Formulir Registrasi Warga Baru (Sesuai Isian Kartu Keluarga)
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Entri data kependudukan lengkap standar Dinas Kependudukan & Pencatatan Sipil
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Section Tabs */}
            <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-1 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setFormActiveTab('pokok')}
                className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                  formActiveTab === 'pokok'
                    ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-xl font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                1. Data Pokok KK & Domisili
              </button>
              <button
                type="button"
                onClick={() => setFormActiveTab('identitas')}
                className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                  formActiveTab === 'identitas'
                    ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-xl font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                2. Kelahiran & Pekerjaan
              </button>
              <button
                type="button"
                onClick={() => setFormActiveTab('sipil')}
                className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                  formActiveTab === 'sipil'
                    ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-xl font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                3. Status Sipil & Orang Tua
              </button>
              <button
                type="button"
                onClick={() => setFormActiveTab('anggota')}
                className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                  formActiveTab === 'anggota'
                    ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-xl font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                4. Anggota Keluarga KK ({formData.anggotaKeluarga?.length || 0})
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* TAB 1: DATA POKOK KK */}
              {formActiveTab === 'pokok' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nomor Kartu Keluarga (No. KK - 16 Digit) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        value={formData.noKK}
                        onChange={(e) => setFormData({ ...formData, noKK: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                        placeholder="3276..."
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        NIK Kepala Keluarga (16 Digit) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        value={formData.nik}
                        onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                        placeholder="3276..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nama Lengkap Kepala Keluarga (Sesuai KTP/KK) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.namaLengkap}
                      onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                      placeholder="Contoh: Ir. Budi Santoso, M.Sc."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Blok Rumah</label>
                      <select
                        value={formData.blokRumah}
                        onChange={(e) => setFormData({ ...formData, blokRumah: e.target.value as BlokRumah })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Blok AE">Blok AE</option>
                        <option value="Blok DB">Blok DB</option>
                        <option value="Blok DC">Blok DC</option>
                        <option value="Blok DE">Blok DE</option>
                        <option value="Blok DF">Blok DF</option>
                        <option value="Blok DG">Blok DG</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor Rumah *</label>
                      <input
                        type="text"
                        required
                        value={formData.nomorRumah}
                        onChange={(e) => setFormData({ ...formData, nomorRumah: e.target.value })}
                        placeholder="Contoh: A-05"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Kepemilikan Hunian</label>
                      <select
                        value={formData.statusHunian}
                        onChange={(e) => setFormData({ ...formData, statusHunian: e.target.value as StatusHunian })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Tetap">Milik Pribadi (Warga Tetap)</option>
                        <option value="Kontrak/Sewa">Kontrak / Sewa</option>
                        <option value="Kost">Kost / Homestay</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Status Verifikasi Kelengkapan Dokumen KK
                      </label>
                      <select
                        value={formData.statusVerifikasiKK || 'Terverifikasi'}
                        onChange={(e) => setFormData({ ...formData, statusVerifikasiKK: e.target.value as StatusVerifikasiKK })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                      >
                        <option value="Terverifikasi">✓ Terverifikasi (Berkas KK Lengkap & Sesuai)</option>
                        <option value="Belum Lengkap">⚠ Belum Lengkap (Perlu Lampiran Fisik/Foto)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai Menetap</label>
                      <input
                        type="date"
                        value={formData.tanggalMasuk}
                        onChange={(e) => setFormData({ ...formData, tanggalMasuk: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: IDENTITAS, KELAHIRAN & PENDIDIKAN */}
              {formActiveTab === 'identitas' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin *</label>
                      <select
                        value={formData.jenisKelamin}
                        onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                      <input
                        type="text"
                        value={formData.tempatLahir || ''}
                        onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                        placeholder="Contoh: Depok / Jakarta"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={formData.tanggalLahir || ''}
                        onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Agama</label>
                      <select
                        value={formData.agama || 'Islam'}
                        onChange={(e) => setFormData({ ...formData, agama: e.target.value as Agama })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Islam">Islam</option>
                        <option value="Kristen Protestan">Kristen Protestan</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Khonghucu">Khonghucu</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Golongan Darah</label>
                      <select
                        value={formData.golonganDarah || 'O'}
                        onChange={(e) => setFormData({ ...formData, golonganDarah: e.target.value as GolonganDarah })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                        <option value="Tidak Tahu">Tidak Tahu / -</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pendidikan Terakhir</label>
                      <select
                        value={formData.pendidikan || 'Diploma IV / Strata I'}
                        onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value as PendidikanTerakhir })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Tidak / Belum Sekolah">Tidak / Belum Sekolah</option>
                        <option value="Tamat SD / Sederajat">Tamat SD / Sederajat</option>
                        <option value="SLTP / Sederajat">SLTP / Sederajat (SMP)</option>
                        <option value="SLTA / Sederajat">SLTA / Sederajat (SMA/SMK)</option>
                        <option value="Diploma I / II">Diploma I / II</option>
                        <option value="Akademi / Diploma III / S. Muda">Akademi / Diploma III (D3)</option>
                        <option value="Diploma IV / Strata I">Diploma IV / Strata I (S1)</option>
                        <option value="Strata II">Strata II (S2)</option>
                        <option value="Strata III">Strata III (S3 / Doktor)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jenis Pekerjaan Sesuai KK</label>
                    <input
                      type="text"
                      value={formData.pekerjaan}
                      onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                      placeholder="Contoh: Pegawai Negeri Sipil / Karyawan Swasta / Wiraswasta"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: STATUS SIPIL, DOKUMEN & ORANG TUA */}
              {formActiveTab === 'sipil' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Perkawinan</label>
                      <select
                        value={formData.statusPernikahan || 'Kawin Tercatat'}
                        onChange={(e) => setFormData({ ...formData, statusPernikahan: e.target.value as StatusPernikahan })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Belum Kawin">Belum Kawin</option>
                        <option value="Kawin Tercatat">Kawin Tercatat (Buku Nikah)</option>
                        <option value="Kawin Belum Tercatat">Kawin Belum Tercatat</option>
                        <option value="Cerai Hidup">Cerai Hidup</option>
                        <option value="Cerai Mati">Cerai Mati</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tanggal Perkawinan</label>
                      <input
                        type="date"
                        value={formData.tanggalPerkawinan || ''}
                        onChange={(e) => setFormData({ ...formData, tanggalPerkawinan: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kewarganegaraan</label>
                      <select
                        value={formData.kewarganegaraan || 'WNI'}
                        onChange={(e) => setFormData({ ...formData, kewarganegaraan: e.target.value as 'WNI' | 'WNA' })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="WNI">Warga Negara Indonesia (WNI)</option>
                        <option value="WNA">Warga Negara Asing (WNA)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Ayah Kandung</label>
                      <input
                        type="text"
                        value={formData.namaAyah || ''}
                        onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })}
                        placeholder="Nama Ayah Sesuai KK"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Ibu Kandung</label>
                      <input
                        type="text"
                        value={formData.namaIbu || ''}
                        onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value })}
                        placeholder="Nama Ibu Sesuai KK"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP Aktif *</label>
                      <input
                        type="text"
                        required
                        value={formData.noHp}
                        onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                        placeholder="+62 812-..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email (Opsional)</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="warga@gmail.com"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Alamat Asal KTP (Bila Berbeda)</label>
                    <input
                      type="text"
                      value={formData.alamatKtp || ''}
                      onChange={(e) => setFormData({ ...formData, alamatKtp: e.target.value })}
                      placeholder="Alamat domisili asal sesuai KTP..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: ANGGOTA KELUARGA DALAM 1 KK */}
              {formActiveTab === 'anggota' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Tabel Anggota Keluarga Sesuai Blanko KK:</span>
                      <span className="text-[11px] text-indigo-800">
                        Tambahkan istri, anak, orang tua, atau kerabat yang tercantum dalam Kartu Keluarga ini.
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-white font-black text-indigo-700 rounded-lg text-xs border border-indigo-300">
                      {formData.anggotaKeluarga?.length || 0} Jiwa Terdaftar
                    </span>
                  </div>

                  {/* Existing Members List */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {formData.anggotaKeluarga && formData.anggotaKeluarga.length > 0 ? (
                      formData.anggotaKeluarga.map((ak, idx) => (
                        <div
                          key={ak.id || idx}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{ak.namaLengkap}</span>
                                <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[9px] font-bold rounded">
                                  {ak.hubunganKeluarga}
                                </span>
                                <span className="text-[10px] text-slate-500">({ak.jenisKelamin})</span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                NIK: {ak.nik} • TTL: {ak.tempatLahir}, {ak.tanggalLahir} • Pekerjaan: {ak.pekerjaan}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveAnggotaFromForm(ak.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus anggota keluarga ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        Belum ada anggota keluarga tambahan. Gunakan formulir input di bawah untuk menambahkan.
                      </div>
                    )}
                  </div>

                  {/* Add Anggota Form Panel */}
                  <div className="p-4 bg-slate-100/70 border border-slate-300 rounded-2xl space-y-3">
                    <span className="font-bold text-xs text-slate-900 block">
                      + Tambah Anggota Keluarga Baru ke Lembar KK:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Lengkap</label>
                        <input
                          type="text"
                          value={tempAnggota.namaLengkap}
                          onChange={(e) => setTempAnggota({ ...tempAnggota, namaLengkap: e.target.value })}
                          placeholder="Nama anggota..."
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Hubungan (SHDK)</label>
                        <select
                          value={tempAnggota.hubunganKeluarga}
                          onChange={(e) => setTempAnggota({ ...tempAnggota, hubunganKeluarga: e.target.value as HubunganKeluarga })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        >
                          <option value="Istri">Istri</option>
                          <option value="Anak">Anak</option>
                          <option value="Suami">Suami</option>
                          <option value="Orang Tua">Orang Tua</option>
                          <option value="Mertua">Mertua</option>
                          <option value="Menantu">Menantu</option>
                          <option value="Cucu">Cucu</option>
                          <option value="Famili Lain">Famili Lain</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIK (16 Digit)</label>
                        <input
                          type="text"
                          value={tempAnggota.nik}
                          onChange={(e) => setTempAnggota({ ...tempAnggota, nik: e.target.value })}
                          placeholder="3276..."
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Jenis Kelamin</label>
                        <select
                          value={tempAnggota.jenisKelamin}
                          onChange={(e) => setTempAnggota({ ...tempAnggota, jenisKelamin: e.target.value as any })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="Perempuan">Perempuan</option>
                          <option value="Laki-laki">Laki-laki</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Pekerjaan</label>
                        <input
                          type="text"
                          value={tempAnggota.pekerjaan}
                          onChange={(e) => setTempAnggota({ ...tempAnggota, pekerjaan: e.target.value })}
                          placeholder="Pekerjaan..."
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAnggotaToForm}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Masukkan ke Daftar Anggota KK</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Submit / Cancel Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-teal-700 hover:from-indigo-500 hover:to-teal-600 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan Dokumen Kartu Keluarga</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Data Warga (Full KK Editor) */}
      {editingWarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Edit2 className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    Edit Data Kartu Keluarga: {editingWarga.namaLengkap}
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Kavling: {editingWarga.blokRumah} No. {editingWarga.nomorRumah} • No. KK: {editingWarga.noKK}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingWarga(null)}
                className="text-white/80 hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Tabs */}
            <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-1 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setFormActiveTab('pokok')}
                className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                  formActiveTab === 'pokok'
                    ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-xl font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                1. Data Pokok KK & Domisili
              </button>
              <button
                type="button"
                onClick={() => setFormActiveTab('identitas')}
                className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                  formActiveTab === 'identitas'
                    ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-xl font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                2. Kelahiran & Pekerjaan
              </button>
              <button
                type="button"
                onClick={() => setFormActiveTab('sipil')}
                className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                  formActiveTab === 'sipil'
                    ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-xl font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                3. Status Sipil & Orang Tua
              </button>
              <button
                type="button"
                onClick={() => setFormActiveTab('anggota')}
                className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                  formActiveTab === 'anggota'
                    ? 'border-indigo-600 text-indigo-900 bg-white rounded-t-xl font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                4. Anggota Keluarga KK ({formData.anggotaKeluarga?.length || 0})
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {/* TAB 1 */}
              {formActiveTab === 'pokok' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">No. Kartu Keluarga (KK)</label>
                      <input
                        type="text"
                        required
                        value={formData.noKK}
                        onChange={(e) => setFormData({ ...formData, noKK: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIK Kepala Keluarga</label>
                      <input
                        type="text"
                        required
                        value={formData.nik}
                        onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Kepala Keluarga</label>
                    <input
                      type="text"
                      required
                      value={formData.namaLengkap}
                      onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Blok Rumah</label>
                      <select
                        value={formData.blokRumah}
                        onChange={(e) => setFormData({ ...formData, blokRumah: e.target.value as BlokRumah })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Blok AE">Blok AE</option>
                        <option value="Blok DB">Blok DB</option>
                        <option value="Blok DC">Blok DC</option>
                        <option value="Blok DE">Blok DE</option>
                        <option value="Blok DF">Blok DF</option>
                        <option value="Blok DG">Blok DG</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor Rumah</label>
                      <input
                        type="text"
                        required
                        value={formData.nomorRumah}
                        onChange={(e) => setFormData({ ...formData, nomorRumah: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Hunian</label>
                      <select
                        value={formData.statusHunian}
                        onChange={(e) => setFormData({ ...formData, statusHunian: e.target.value as StatusHunian })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Tetap">Milik Pribadi (Warga Tetap)</option>
                        <option value="Kontrak/Sewa">Kontrak / Sewa</option>
                        <option value="Kost">Kost</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Status Verifikasi Kelengkapan Dokumen KK
                      </label>
                      <select
                        value={formData.statusVerifikasiKK || 'Terverifikasi'}
                        onChange={(e) => setFormData({ ...formData, statusVerifikasiKK: e.target.value as StatusVerifikasiKK })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                      >
                        <option value="Terverifikasi">✓ Terverifikasi (Lengkap)</option>
                        <option value="Belum Lengkap">⚠ Belum Lengkap (Perlu Lampiran)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai Menetap</label>
                      <input
                        type="date"
                        value={formData.tanggalMasuk}
                        onChange={(e) => setFormData({ ...formData, tanggalMasuk: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2 */}
              {formActiveTab === 'identitas' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                      <select
                        value={formData.jenisKelamin}
                        onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                      <input
                        type="text"
                        value={formData.tempatLahir || ''}
                        onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={formData.tanggalLahir || ''}
                        onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Agama</label>
                      <select
                        value={formData.agama || 'Islam'}
                        onChange={(e) => setFormData({ ...formData, agama: e.target.value as Agama })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Islam">Islam</option>
                        <option value="Kristen Protestan">Kristen Protestan</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Buddha">Buddha</option>
                        <option value="Khonghucu">Khonghucu</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Golongan Darah</label>
                      <select
                        value={formData.golonganDarah || 'O'}
                        onChange={(e) => setFormData({ ...formData, golonganDarah: e.target.value as GolonganDarah })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                        <option value="Tidak Tahu">Tidak Tahu / -</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pendidikan Terakhir</label>
                      <select
                        value={formData.pendidikan || 'Diploma IV / Strata I'}
                        onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value as PendidikanTerakhir })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Tidak / Belum Sekolah">Tidak / Belum Sekolah</option>
                        <option value="Tamat SD / Sederajat">Tamat SD / Sederajat</option>
                        <option value="SLTP / Sederajat">SLTP / Sederajat (SMP)</option>
                        <option value="SLTA / Sederajat">SLTA / Sederajat (SMA/SMK)</option>
                        <option value="Diploma I / II">Diploma I / II</option>
                        <option value="Akademi / Diploma III / S. Muda">Akademi / Diploma III (D3)</option>
                        <option value="Diploma IV / Strata I">Diploma IV / Strata I (S1)</option>
                        <option value="Strata II">Strata II (S2)</option>
                        <option value="Strata III">Strata III (S3 / Doktor)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jenis Pekerjaan</label>
                    <input
                      type="text"
                      value={formData.pekerjaan}
                      onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3 */}
              {formActiveTab === 'sipil' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Perkawinan</label>
                      <select
                        value={formData.statusPernikahan || 'Kawin Tercatat'}
                        onChange={(e) => setFormData({ ...formData, statusPernikahan: e.target.value as StatusPernikahan })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="Belum Kawin">Belum Kawin</option>
                        <option value="Kawin Tercatat">Kawin Tercatat (Buku Nikah)</option>
                        <option value="Kawin Belum Tercatat">Kawin Belum Tercatat</option>
                        <option value="Cerai Hidup">Cerai Hidup</option>
                        <option value="Cerai Mati">Cerai Mati</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tanggal Perkawinan</label>
                      <input
                        type="date"
                        value={formData.tanggalPerkawinan || ''}
                        onChange={(e) => setFormData({ ...formData, tanggalPerkawinan: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kewarganegaraan</label>
                      <select
                        value={formData.kewarganegaraan || 'WNI'}
                        onChange={(e) => setFormData({ ...formData, kewarganegaraan: e.target.value as 'WNI' | 'WNA' })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                      >
                        <option value="WNI">Warga Negara Indonesia (WNI)</option>
                        <option value="WNA">Warga Negara Asing (WNA)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Ayah Kandung</label>
                      <input
                        type="text"
                        value={formData.namaAyah || ''}
                        onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Ibu Kandung</label>
                      <input
                        type="text"
                        value={formData.namaIbu || ''}
                        onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
                      <input
                        type="text"
                        value={formData.noHp}
                        onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ANGGOTA KELUARGA */}
              {formActiveTab === 'anggota' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Anggota Keluarga dalam Kartu Keluarga:</span>
                      <span className="text-[11px] text-indigo-800">
                        Kelola data seluruh jiwa yang tinggal di rumah ini.
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-white font-black text-indigo-700 rounded-lg text-xs border border-indigo-300">
                      {formData.anggotaKeluarga?.length || 0} Jiwa
                    </span>
                  </div>

                  {/* List */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {formData.anggotaKeluarga && formData.anggotaKeluarga.length > 0 ? (
                      formData.anggotaKeluarga.map((ak, idx) => (
                        <div
                          key={ak.id || idx}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{ak.namaLengkap}</span>
                                <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[9px] font-bold rounded">
                                  {ak.hubunganKeluarga}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                NIK: {ak.nik} • {ak.jenisKelamin} • {ak.pekerjaan}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveAnggotaFromForm(ak.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        Belum ada anggota keluarga tambahan.
                      </div>
                    )}
                  </div>

                  {/* Add Panel */}
                  <div className="p-4 bg-slate-100/70 border border-slate-300 rounded-2xl space-y-3">
                    <span className="font-bold text-xs text-slate-900 block">
                      + Tambah Anggota Keluarga:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nama Lengkap</label>
                        <input
                          type="text"
                          value={tempAnggota.namaLengkap}
                          onChange={(e) => setTempAnggota({ ...tempAnggota, namaLengkap: e.target.value })}
                          placeholder="Nama anggota..."
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Hubungan</label>
                        <select
                          value={tempAnggota.hubunganKeluarga}
                          onChange={(e) => setTempAnggota({ ...tempAnggota, hubunganKeluarga: e.target.value as HubunganKeluarga })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        >
                          <option value="Istri">Istri</option>
                          <option value="Anak">Anak</option>
                          <option value="Suami">Suami</option>
                          <option value="Orang Tua">Orang Tua</option>
                          <option value="Mertua">Mertua</option>
                          <option value="Menantu">Menantu</option>
                          <option value="Cucu">Cucu</option>
                          <option value="Famili Lain">Famili Lain</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">NIK</label>
                        <input
                          type="text"
                          value={tempAnggota.nik}
                          onChange={(e) => setTempAnggota({ ...tempAnggota, nik: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Jenis Kelamin</label>
                        <select
                          value={tempAnggota.jenisKelamin}
                          onChange={(e) => setTempAnggota({ ...tempAnggota, jenisKelamin: e.target.value as any })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="Perempuan">Perempuan</option>
                          <option value="Laki-laki">Laki-laki</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Pekerjaan</label>
                        <input
                          type="text"
                          value={tempAnggota.pekerjaan}
                          onChange={(e) => setTempAnggota({ ...tempAnggota, pekerjaan: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAnggotaToForm}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Masukkan ke Daftar Anggota KK</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingWarga(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = editingWarga;
                        setEditingWarga(null);
                        handleDeleteClick(target);
                      }}
                      className="px-3.5 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Hapus data warga ini dari buku induk RT (mutasi keluar kompleks)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Data Warga (Pindah)</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-teal-700 hover:from-indigo-500 hover:to-teal-600 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Perubahan Data KK</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SALINAN RESMI KARTU KELUARGA (MODEL KK STANDAR KEMENDAGRI) */}
      {viewingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 my-auto flex flex-col max-h-[94vh]">
            {/* Modal Top Bar */}
            <div className="print:hidden px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-sm">
                    Salinan Resmi Kartu Keluarga (Model KK - Kemendagri / Disdukcapil)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    No. KK: {viewingCard.noKK} • Kepala Keluarga: {viewingCard.namaLengkap}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak KK</span>
                </button>
                <button
                  onClick={() => setViewingCard(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Indonesian Kartu Keluarga Document Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-white font-sans text-xs">
              {/* KK Header with Garuda */}
              <div className="text-center space-y-1 relative pb-2 border-b-2 border-slate-900">
                <div className="w-16 h-16 mx-auto mb-1 flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Coat_of_arms_of_Indonesia.svg/300px-Coat_of_arms_of_Indonesia.svg.png"
                    alt="Garuda Pancasila"
                    className="max-h-full object-contain"
                  />
                </div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-950 font-serif">
                  KARTU KELUARGA
                </h1>
                <p className="text-sm sm:text-base font-black font-mono tracking-widest text-slate-900">
                  No. {viewingCard.noKK}
                </p>
              </div>

              {/* KK Metadata Grid (Alamat & RT/RW) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-slate-600">Nama Kepala Keluarga</span>
                    <span className="col-span-2 font-bold uppercase">: {viewingCard.namaLengkap}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-slate-600">Alamat</span>
                    <span className="col-span-2 font-medium">
                      : {infoPerumahan.namaPerumahan} {viewingCard.blokRumah} No. {viewingCard.nomorRumah}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-slate-600">RT / RW</span>
                    <span className="col-span-2 font-bold">: {infoPerumahan.rtRw}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-slate-600">Kode Pos</span>
                    <span className="col-span-2 font-mono">: {infoPerumahan.kodePos}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-slate-600">Desa / Kelurahan</span>
                    <span className="col-span-2 font-medium uppercase">: {infoPerumahan.kelurahan}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-slate-600">Kecamatan</span>
                    <span className="col-span-2 font-medium uppercase">: {infoPerumahan.kecamatan}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-slate-600">Kabupaten / Kota</span>
                    <span className="col-span-2 font-medium uppercase">: {infoPerumahan.kota}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-slate-600">Provinsi</span>
                    <span className="col-span-2 font-medium uppercase">: {infoPerumahan.provinsi || 'Jawa Barat'}</span>
                  </div>
                </div>
              </div>

              {/* Status Verification Badge */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Status Dokumen KK:</span>
                  {(viewingCard.statusVerifikasiKK || 'Terverifikasi') === 'Terverifikasi' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs bg-emerald-100 text-emerald-900 border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>✓ Dokumen KK Terverifikasi Lengkap (Sah)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs bg-amber-100 text-amber-950 border border-amber-300">
                      <AlertCircle className="w-4 h-4 text-amber-600 animate-pulse" />
                      <span>⚠ Berkas Belum Lengkap (Perlu Verifikasi Fisik)</span>
                    </span>
                  )}
                </div>
                <span className="font-bold text-indigo-900">
                  Total Anggota: {viewingCard.anggotaKeluarga?.length || viewingCard.jumlahAnggotaKeluarga || 1} Jiwa
                </span>
              </div>

              {/* TABEL 1: DATA IDENTITAS PRIBADI KELUARGA (MODEL RESMI KK) */}
              <div className="space-y-1">
                <h4 className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                  I. Data Anggota Keluarga (Identitas, Kelahiran, Agama & Pendidikan)
                </h4>
                <div className="overflow-x-auto border border-slate-300 rounded-xl">
                  <table className="w-full text-left text-[11px] text-slate-900">
                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[9px]">
                      <tr>
                        <th className="px-2.5 py-2 text-center w-8">No</th>
                        <th className="px-3 py-2">Nama Lengkap</th>
                        <th className="px-3 py-2">NIK</th>
                        <th className="px-2 py-2">JK</th>
                        <th className="px-3 py-2">Tempat Lahir</th>
                        <th className="px-3 py-2">Tgl Lahir</th>
                        <th className="px-3 py-2">Agama</th>
                        <th className="px-3 py-2">Pendidikan</th>
                        <th className="px-3 py-2">Jenis Pekerjaan</th>
                        <th className="px-2 py-2 text-center">Gol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {/* Rows: either anggotaKeluarga or viewingCard fallback */}
                      {viewingCard.anggotaKeluarga && viewingCard.anggotaKeluarga.length > 0 ? (
                        viewingCard.anggotaKeluarga.map((ak, idx) => (
                          <tr key={ak.id || idx} className="hover:bg-slate-50">
                            <td className="px-2.5 py-2 text-center font-bold">{idx + 1}</td>
                            <td className="px-3 py-2 font-bold text-slate-950 uppercase">{ak.namaLengkap}</td>
                            <td className="px-3 py-2 font-mono font-semibold text-slate-800">{ak.nik}</td>
                            <td className="px-2 py-2">{ak.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                            <td className="px-3 py-2">{ak.tempatLahir}</td>
                            <td className="px-3 py-2 font-mono">{ak.tanggalLahir}</td>
                            <td className="px-3 py-2">{ak.agama}</td>
                            <td className="px-3 py-2">{ak.pendidikan}</td>
                            <td className="px-3 py-2">{ak.pekerjaan}</td>
                            <td className="px-2 py-2 text-center font-bold">{ak.golonganDarah || 'O'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="hover:bg-slate-50">
                          <td className="px-2.5 py-2 text-center font-bold">1</td>
                          <td className="px-3 py-2 font-bold text-slate-950 uppercase">{viewingCard.namaLengkap}</td>
                          <td className="px-3 py-2 font-mono font-semibold text-slate-800">{viewingCard.nik}</td>
                          <td className="px-2 py-2">{viewingCard.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                          <td className="px-3 py-2">{viewingCard.tempatLahir || 'Depok'}</td>
                          <td className="px-3 py-2 font-mono">{viewingCard.tanggalLahir || '1985-05-12'}</td>
                          <td className="px-3 py-2">{viewingCard.agama || 'Islam'}</td>
                          <td className="px-3 py-2">{viewingCard.pendidikan || 'Diploma IV / Strata I'}</td>
                          <td className="px-3 py-2">{viewingCard.pekerjaan}</td>
                          <td className="px-2 py-2 text-center font-bold">{viewingCard.golonganDarah || 'O'}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABEL 2: DATA STATUS, KEWARGANEGARAAN & NAMA ORANG TUA */}
              <div className="space-y-1">
                <h4 className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                  II. Data Status Perkawinan, Kedudukan Dalam Keluarga & Orang Tua
                </h4>
                <div className="overflow-x-auto border border-slate-300 rounded-xl">
                  <table className="w-full text-left text-[11px] text-slate-900">
                    <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[9px]">
                      <tr>
                        <th className="px-2.5 py-2 text-center w-8">No</th>
                        <th className="px-3 py-2">Status Perkawinan</th>
                        <th className="px-3 py-2">Tgl Perkawinan</th>
                        <th className="px-3 py-2">Status Hubungan (SHDK)</th>
                        <th className="px-3 py-2">Kewarganegaraan</th>
                        <th className="px-3 py-2">No. Paspor / KITAS</th>
                        <th className="px-3 py-2">Nama Ayah</th>
                        <th className="px-3 py-2">Nama Ibu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {viewingCard.anggotaKeluarga && viewingCard.anggotaKeluarga.length > 0 ? (
                        viewingCard.anggotaKeluarga.map((ak, idx) => (
                          <tr key={ak.id || idx} className="hover:bg-slate-50">
                            <td className="px-2.5 py-2 text-center font-bold">{idx + 1}</td>
                            <td className="px-3 py-2">{ak.statusPernikahan || 'Kawin Tercatat'}</td>
                            <td className="px-3 py-2 font-mono">{idx === 0 ? viewingCard.tanggalPerkawinan || '-' : '-'}</td>
                            <td className="px-3 py-2 font-bold text-indigo-900">{ak.hubunganKeluarga}</td>
                            <td className="px-3 py-2">{ak.kewarganegaraan || 'WNI'}</td>
                            <td className="px-3 py-2 font-mono text-slate-500">{ak.noPaspor || '-'}</td>
                            <td className="px-3 py-2">{ak.namaAyah || '-'}</td>
                            <td className="px-3 py-2">{ak.namaIbu || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="hover:bg-slate-50">
                          <td className="px-2.5 py-2 text-center font-bold">1</td>
                          <td className="px-3 py-2">{viewingCard.statusPernikahan || 'Kawin Tercatat'}</td>
                          <td className="px-3 py-2 font-mono">{viewingCard.tanggalPerkawinan || '-'}</td>
                          <td className="px-3 py-2 font-bold text-indigo-900">{viewingCard.statusKeluarga}</td>
                          <td className="px-3 py-2">{viewingCard.kewarganegaraan || 'WNI'}</td>
                          <td className="px-3 py-2 font-mono text-slate-500">{viewingCard.noPaspor || '-'}</td>
                          <td className="px-3 py-2">{viewingCard.namaAyah || '-'}</td>
                          <td className="px-3 py-2">{viewingCard.namaIbu || '-'}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Signatures & Digital Seal */}
              <div className="pt-6 grid grid-cols-2 text-center text-xs font-sans">
                <div className="space-y-16">
                  <p>Kepala Keluarga,</p>
                  <p className="font-bold underline uppercase">{viewingCard.namaLengkap}</p>
                </div>

                <div className="space-y-16 relative">
                  <div>
                    <p>{infoPerumahan.kota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold">Ketua Rukun Tetangga ({infoPerumahan.rtRw.split('/')[0]?.trim() || 'RT 38'}),</p>
                  </div>

                  <div className="relative">
                    {/* Official Stamp */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-indigo-600/40 text-indigo-800 text-[8px] font-bold flex items-center justify-center rotate-12 pointer-events-none bg-indigo-50/20">
                      STEMPEL {infoPerumahan.rtRw.split('/')[0]?.trim() || 'RT 38'}
                    </div>
                    <p className="font-bold underline">{infoPerumahan.namaKetuaRT}</p>
                    <p className="text-[10px] text-slate-500 font-mono">NIK: {infoPerumahan.nikKetuaRT || '3276011504780001'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="print:hidden p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingCard(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 text-xs font-semibold hover:bg-white cursor-pointer"
                >
                  Tutup
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = viewingCard;
                      setViewingCard(null);
                      handleDeleteClick(target);
                    }}
                    className="px-3.5 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Hapus data warga ini karena pindah domisili"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Warga Ini (Pindah)</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Salinan Kartu Keluarga</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI PENGHAPUSAN DATA WARGA (RBAC PERMISSION warga:delete) */}
      {deletingWarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-rose-700 to-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">
                    Konfirmasi Hapus Data Warga
                  </h3>
                  <p className="text-[11px] text-rose-200">
                    Otoritas RBAC Pengurus RT (Izin: warga:delete)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeletingWarga(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Resident Card to Delete */}
              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 flex items-center justify-center font-bold text-sm shrink-0">
                    {deletingWarga.namaLengkap.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {deletingWarga.namaLengkap}
                    </h4>
                    <p className="text-slate-500 font-mono text-[11px]">
                      NIK: {deletingWarga.nik}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-200/80 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Alamat / Kavling:</span>
                    <span className="font-bold text-slate-800">
                      {deletingWarga.blokRumah} No. {deletingWarga.nomorRumah}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Nomor KK:</span>
                    <span className="font-bold font-mono text-slate-800">
                      {deletingWarga.noKK}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Status Hunian:</span>
                    <span className="font-bold text-slate-800">
                      {deletingWarga.statusHunian} ({deletingWarga.jumlahAnggotaKeluarga || 1} Jiwa)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Status Hubungan:</span>
                    <span className="font-bold text-slate-800">
                      {deletingWarga.statusKeluarga}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning Text */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Data kependudukan ini akan dihapus dari buku induk warga RT karena alasan mutasi/pindah domisili. Tindakan ini tercatat di Log Audit Keamanan Sistem.
                </p>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeletingWarga(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Ya, Hapus Data Warga</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
