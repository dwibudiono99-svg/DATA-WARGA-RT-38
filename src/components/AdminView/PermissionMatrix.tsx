import React from 'react';
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
} from 'lucide-react';
import { PERMISSION_DEFINITIONS } from '../../data/defaultData';
import { Role, PermissionKey } from '../../types/rbac';

export const PermissionMatrix: React.FC = () => {
  const { rolePermissions, toggleRolePermission, resetPermissionsToDefault } = useRBAC();

  const modules = [
    { key: 'warga', label: 'Modul 1: Pendataan & Kependudukan Warga Kompleks' },
    { key: 'iuran', label: 'Modul 2: Keuangan Kas & Iuran Warga (IPL)' },
    { key: 'surat', label: 'Modul 3: Penerbitan & Validasi Surat Pengantar RT' },
    { key: 'lingkungan', label: 'Modul 4: Ketertiban, Tamu Menginap & Warta RT' },
    { key: 'keamanan', label: 'Modul 5: Log Audit & Keamanan Sistem' },
  ];

  const handleToggle = (role: Role, permKey: PermissionKey) => {
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

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Matriks Hak Akses RBAC: Pengurus RT vs Warga Penghuni
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              Dinamis Real-Time
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi langsung kewenangan sistem antara <strong>Pengurus RT (Admin)</strong> dan <strong>Warga Penghuni</strong>. Mengubah izin di sini langsung berdampak tanpa perlu memuat ulang halaman.
          </p>
        </div>

        <button
          onClick={resetPermissionsToDefault}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Reset ke Bawaan Lingkungan</span>
        </button>
      </div>

      {/* Realtime Alert Banner */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-indigo-950">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Eksperimen Hak Akses Langsung:</p>
          <p className="text-indigo-800">
            Misalnya Anda ingin memberikan hak sementara kepada <strong>Warga</strong> untuk "Lihat Kas & Rekap Iuran Seluruh Warga", Anda cukup mencentang kolom Warga di bawah, lalu beralih ke Mode Warga.
          </p>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 w-2/5">Nama Izin & Keterangan Fungsi</th>
                <th className="px-6 py-4 w-1/5 font-mono text-[11px]">Kode Izin (RBAC Key)</th>
                <th className="px-6 py-4 text-center w-1/5 bg-indigo-950/70 border-l border-indigo-900">
                  <div className="flex items-center justify-center gap-1.5 text-indigo-200">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    <span>Pengurus RT</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-center w-1/5 bg-emerald-950/70 border-l border-emerald-900">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-200">
                    <Home className="w-4 h-4 text-emerald-400" />
                    <span>Warga Penghuni</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modules.map((mod) => {
                const permsInModule = PERMISSION_DEFINITIONS.filter((p) => p.module === mod.key);

                return (
                  <React.Fragment key={mod.key}>
                    <tr className="bg-slate-100/90 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      <td colSpan={4} className="px-6 py-2.5 bg-slate-100 border-y border-slate-200">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{mod.label}</span>
                        </div>
                      </td>
                    </tr>

                    {permsInModule.map((perm) => {
                      const adminHas = (rolePermissions.admin || []).includes(perm.key);
                      const userHas = (rolePermissions.user || []).includes(perm.key);

                      return (
                        <tr key={perm.key} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="font-bold text-slate-900 text-xs">{perm.name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {perm.description}
                            </div>
                          </td>

                          <td className="px-6 py-3.5">
                            <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              {perm.key}
                            </span>
                          </td>

                          {/* Admin */}
                          <td className="px-6 py-3.5 text-center bg-indigo-50/20 border-l border-slate-100">
                            <button
                              type="button"
                              onClick={() => handleToggle('admin', perm.key)}
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                                adminHas
                                  ? 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
                                  : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                              }`}
                              title={adminHas ? 'Izin Aktif' : 'Izin Nonaktif'}
                            >
                              {adminHas ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </button>
                          </td>

                          {/* Warga */}
                          <td className="px-6 py-3.5 text-center bg-emerald-50/20 border-l border-slate-100">
                            <button
                              type="button"
                              onClick={() => handleToggle('user', perm.key)}
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                                userHas
                                  ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                                  : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                              }`}
                              title={userHas ? 'Izin Aktif untuk Warga' : 'Izin Nonaktif untuk Warga'}
                            >
                              {userHas ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </button>
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
