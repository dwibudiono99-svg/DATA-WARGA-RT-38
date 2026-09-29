import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  Key,
  Shield,
  Home,
  RotateCcw,
  Check,
  X,
  Info,
  Sliders,
  Lock,
  Unlock,
  Save,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  CreditCard,
  FileCheck2,
  Megaphone,
  Radio,
  Sparkles,
} from 'lucide-react';
import { PERMISSION_DEFINITIONS, DEFAULT_ROLE_PERMISSIONS } from '../../data/defaultData';
import { Role, PermissionKey, PermissionDefinition, RolePermissions } from '../../types/rbac';

export const PermissionMatrix: React.FC = () => {
  const {
    rolePermissions,
    toggleRolePermission,
    saveRolePermissions,
    resetPermissionsToDefault,
    canExecute,
    currentUser,
    isRealtimeActive,
    lastSyncTimestamp,
  } = useRBAC();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const modules: { key: PermissionDefinition['module']; label: string; icon: any }[] = [
    { key: 'Data Warga', label: 'Modul 1: Pendataan & Kependudukan Warga Kompleks', icon: Users },
    { key: 'Iuran & Kas', label: 'Modul 2: Keuangan Kas & Iuran Warga (IPL & Keamanan)', icon: CreditCard },
    { key: 'Layanan Surat', label: 'Modul 3: Penerbitan & Validasi Surat Pengantar RT', icon: FileCheck2 },
    { key: 'Keamanan & Pos Satpam', label: 'Modul 4: Petugas Keamanan, Tamu & Aduan Fasum', icon: Shield },
    { key: 'Pengumuman', label: 'Modul 5: Warta & Pengumuman Pengurus RT', icon: Megaphone },
    { key: 'Audit & Sistem', label: 'Modul 6: Log Audit, Pelaporan & Pengaturan Sistem RBAC', icon: Key },
  ];

  const handleToggle = (role: Role, permKey: PermissionKey) => {
    if (!isEditMode) {
      alert('Mode edit izin sedang terkunci. Klik tombol "Buka Mode Izin Edit Admin" di bagian atas untuk mengubah hak akses.');
      return;
    }

    if (role === 'admin' && permKey === 'roles:manage_permissions') {
      const hasIt = (rolePermissions.admin || []).includes('roles:manage_permissions');
      if (hasIt) {
        if (!confirm('Peringatan: Mencabut izin ini dari Pengurus RT dapat mencegah Anda mengubah matriks ini lagi! Lanjutkan?')) {
          return;
        }
      }
    }

    toggleRolePermission(role, permKey);
  };

  const handleToggleEditMode = () => {
    if (!isEditMode) {
      if (!canExecute('roles:manage_permissions', 'Mengaktifkan Mode Edit Matriks RBAC', 'Audit & Sistem')) {
        return;
      }
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  };

  const handleSaveMatrix = () => {
    const ok = saveRolePermissions(rolePermissions);
    if (ok) {
      setSaveSuccessMessage('Konfigurasi Matriks RBAC berhasil disimpan dan disinkronkan real-time!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    }
  };

  const handlePresetCitizenFull = () => {
    if (!isEditMode) return;
    if (!confirm('Berikan seluruh izin hak akses kepada Warga Penghuni untuk skenario uji coba?')) return;

    const allKeys = PERMISSION_DEFINITIONS.map((p) => p.key);
    saveRolePermissions({
      ...rolePermissions,
      user: allKeys,
    });
    setSaveSuccessMessage('Preset Uji Coba: Warga diberikan hak akses penuh!');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const handlePresetCitizenStrict = () => {
    if (!isEditMode) return;
    if (!confirm('Kunci akses sensitif warga (hanya data rumah sendiri, bayar iuran, dan surat)?')) return;

    saveRolePermissions({
      ...rolePermissions,
      user: ['dashboard:view', 'warga:edit_own', 'iuran:pay_own', 'surat:request', 'laporan:create'],
    });
    setSaveSuccessMessage('Preset Privasi Ketat berhasil diterapkan!');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const handleResetDefault = () => {
    if (!canExecute('roles:manage_permissions', 'Mereset Matriks Hak Akses', 'Audit & Sistem')) return;
    if (confirm('Kembalikan konfigurasi seluruh izin RBAC ke standar baku perumahan?')) {
      resetPermissionsToDefault();
      setSaveSuccessMessage('Matriks RBAC telah dikembalikan ke konfigurasi standar!');
      setTimeout(() => setSaveSuccessMessage(null), 3000);
    }
  };

  // Filter permissions
  const filteredPermissions = PERMISSION_DEFINITIONS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.key.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule = selectedModuleFilter === 'all' || p.module === selectedModuleFilter;
    return matchesSearch && matchesModule;
  });

  const totalAdminPerms = (rolePermissions.admin || []).length;
  const totalUserPerms = (rolePermissions.user || []).length;

  return (
    <div className="space-y-6">
      {/* Header Info & Mode Switch */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200">
              <Key className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Matriks Hak Akses RBAC (Role-Based Access Control)
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isEditMode
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              {isEditMode ? 'Mode Izin Edit Admin: AKTIF' : 'Mode Baca Saja (Terkunci)'}
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Konfigurasi langsung kewenangan sistem antara <strong>Pengurus RT (Admin)</strong> dan <strong>Warga Penghuni</strong>. Mengubah izin di sini langsung berdampak secara real-time tanpa perlu memuat ulang halaman.
          </p>
        </div>

        {/* Edit Mode Master Toggle & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleEditMode}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isEditMode
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
            }`}
          >
            {isEditMode ? <Unlock className="w-4 h-4 text-slate-950" /> : <Lock className="w-4 h-4 text-amber-300" />}
            <span>{isEditMode ? 'Kunci Mode Baca Saja' : 'Buka Mode Izin Edit Admin'}</span>
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleSaveMatrix}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-600/25"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Konfigurasi</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            title="Kembalikan ke Izin Standar Bawaan"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Standar</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-950 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{saveSuccessMessage}</span>
        </div>
      )}

      {/* Realtime Alert & Edit Mode Context Banner */}
      <div
        className={`rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-all border ${
          isEditMode
            ? 'bg-amber-50/90 border-amber-300 text-amber-950'
            : 'bg-indigo-50/70 border-indigo-200/80 text-indigo-950'
        }`}
      >
        <div className="flex items-start gap-3">
          {isEditMode ? (
            <Unlock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <p className="font-bold">
              {isEditMode
                ? 'Mode Izin Edit Admin Sedang Terbuka:'
                : 'Status Mode Tampilan RBAC (Read-Only):'}
            </p>
            <p className={isEditMode ? 'text-amber-900' : 'text-indigo-800'}>
              {isEditMode
                ? 'Klik langsung tombol centang / silang di bawah untuk mengaktifkan atau menonaktifkan izin. Perubahan langsung ter-broadcast ke semua tab dan sesi warga.'
                : 'Matriks saat ini dalam mode terkunci untuk keamanan. Klik tombol "Buka Mode Izin Edit Admin" jika ingin mengubah hak akses peran.'}
            </p>
          </div>
        </div>

        {/* Presets in Edit Mode */}
        {isEditMode && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-amber-900">Preset Cepat:</span>
            <button
              type="button"
              onClick={handlePresetCitizenStrict}
              className="px-2.5 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
            >
              Privasi Ketat Warga
            </button>
            <button
              type="button"
              onClick={handlePresetCitizenFull}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
            >
              Akses Penuh Warga (Uji Coba)
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Hak Akses Sistem</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{PERMISSION_DEFINITIONS.length} Izin</p>
            <span className="text-[10px] text-slate-500">Tersebar di 6 modul operasional</span>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
            <Key className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-indigo-700 uppercase">Izin Aktif Pengurus RT</span>
            <p className="text-2xl font-black text-indigo-900 mt-0.5">{totalAdminPerms} dari {PERMISSION_DEFINITIONS.length}</p>
            <span className="text-[10px] text-indigo-600 font-medium">Otoritas Administratif Penuh</span>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Izin Aktif Warga Penghuni</span>
            <p className="text-2xl font-black text-emerald-900 mt-0.5">{totalUserPerms} dari {PERMISSION_DEFINITIONS.length}</p>
            <span className="text-[10px] text-emerald-600 font-medium">Layanan Mandiri Terproteksi</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
            <Home className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari izin, nama, atau deskripsi..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
              selectedModuleFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Modul
          </button>
          {modules.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setSelectedModuleFilter(m.key)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                selectedModuleFilter === m.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {m.key}
            </button>
          ))}
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 w-5/12">Nama Izin & Keterangan Fungsi</th>
                <th className="px-6 py-4 w-3/12 font-mono text-[11px]">Kode Izin (RBAC Key)</th>
                <th className="px-6 py-4 text-center w-2/12 bg-indigo-950/80 border-l border-indigo-900">
                  <div className="flex items-center justify-center gap-1.5 text-indigo-200">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    <span>Pengurus RT</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center w-2/12 bg-emerald-950/80 border-l border-emerald-900">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-200">
                    <Home className="w-4 h-4 text-emerald-400" />
                    <span>Warga Penghuni</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modules.map((mod) => {
                const permsInModule = filteredPermissions.filter((p) => p.module === mod.key);
                if (permsInModule.length === 0) return null;

                const ModIcon = mod.icon;

                return (
                  <React.Fragment key={mod.key}>
                    <tr className="bg-slate-100/90 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      <td colSpan={4} className="px-6 py-3 bg-slate-100 border-y border-slate-200">
                        <div className="flex items-center gap-2 text-indigo-900">
                          <ModIcon className="w-4 h-4 text-indigo-600" />
                          <span>{mod.label}</span>
                          <span className="text-[10px] text-slate-500 font-semibold lowercase">
                            ({permsInModule.length} hak akses)
                          </span>
                        </div>
                      </td>
                    </tr>

                    {permsInModule.map((perm) => {
                      const adminHas = (rolePermissions.admin || []).includes(perm.key);
                      const userHas = (rolePermissions.user || []).includes(perm.key);

                      return (
                        <tr
                          key={perm.key}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isEditMode ? 'cursor-pointer' : ''
                          }`}
                        >
                          <td className="px-6 py-3.5">
                            <div className="font-extrabold text-slate-900 text-xs">{perm.name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {perm.description}
                            </div>
                          </td>

                          <td className="px-6 py-3.5">
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                              {perm.key}
                            </span>
                          </td>

                          {/* Admin Column */}
                          <td className="px-6 py-3.5 text-center bg-indigo-50/15 border-l border-slate-100">
                            {isEditMode ? (
                              <button
                                type="button"
                                onClick={() => handleToggle('admin', perm.key)}
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all cursor-pointer ${
                                  adminHas
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:scale-110 hover:bg-indigo-700'
                                    : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                                }`}
                                title={adminHas ? 'Klik untuk mencabut izin' : 'Klik untuk mengaktifkan izin'}
                              >
                                {adminHas ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                              </button>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  adminHas
                                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                                }`}
                              >
                                {adminHas ? <Check className="w-3 h-3 text-indigo-600" /> : <X className="w-3 h-3 text-slate-400" />}
                                <span>{adminHas ? 'Diizinkan' : 'Dibatasi'}</span>
                              </span>
                            )}
                          </td>

                          {/* Warga Column */}
                          <td className="px-6 py-3.5 text-center bg-emerald-50/15 border-l border-slate-100">
                            {isEditMode ? (
                              <button
                                type="button"
                                onClick={() => handleToggle('user', perm.key)}
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all cursor-pointer ${
                                  userHas
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 hover:scale-110 hover:bg-emerald-700'
                                    : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                                }`}
                                title={userHas ? 'Klik untuk mencabut izin warga' : 'Klik untuk mengaktifkan izin warga'}
                              >
                                {userHas ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                              </button>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  userHas
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                                }`}
                              >
                                {userHas ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-400" />}
                                <span>{userHas ? 'Diizinkan' : 'Dibatasi'}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
