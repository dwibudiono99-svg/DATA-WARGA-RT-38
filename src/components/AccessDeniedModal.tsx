import React from 'react';
import { useRBAC } from '../context/RBACContext';
import { ShieldAlert, X, AlertTriangle, KeyRound, UserCheck, Lock } from 'lucide-react';

interface AccessDeniedModalProps {
  onRequestUpgrade?: () => void;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({ onRequestUpgrade }) => {
  const { accessDeniedInfo, closeAccessDeniedModal, currentUser, switchRolePersona } = useRBAC();

  if (!accessDeniedInfo || !accessDeniedInfo.isOpen) return null;

  const handleSwitchToAdmin = () => {
    switchRolePersona('admin');
    closeAccessDeniedModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Danger Bar */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-red-200">
                HTTP 403 - Akses Ditolak (Privasi Kependudukan)
              </span>
              <h3 className="text-lg font-bold leading-tight">Otoritas Tidak Memadai</h3>
            </div>
          </div>
          <button
            onClick={closeAccessDeniedModal}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-red-50/70 border border-red-200/70 rounded-xl space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">
                  Aksi "{accessDeniedInfo.actionName}" dibatasi oleh kebijakan RBAC Lingkungan RT
                </p>
                <p className="text-xs text-red-700 mt-1 leading-relaxed">
                  Data NIK, No. Kartu Keluarga, dan rekap keuangan warga dilindungi oleh regulasi privasi data. Sebagai <strong>Warga Penghuni</strong>, Anda hanya berhak mengelola data rumah dan keluarga Anda sendiri.
                </p>
              </div>
            </div>
          </div>

          {/* Details Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-slate-500">Akun Aktif:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {currentUser.name} ({currentUser.blokRumah} No. {currentUser.nomorRumah})
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-slate-500">Peran Sistem:</span>
              <span
                className={`px-2 py-0.5 rounded-md font-bold uppercase text-[11px] ${
                  currentUser.role === 'admin'
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {currentUser.roleTitle}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Izin yang Dibutuhkan:</span>
              <span className="font-mono font-medium text-red-700 bg-red-100/60 px-2 py-0.5 rounded text-[11px]">
                {accessDeniedInfo.requiredPermission}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Peristiwa penolakan akses ini telah dicatat secara otomatis dalam <strong>Log Keamanan Sistem Pendataan Warga</strong> untuk menjaga privasi seluruh penghuni.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {currentUser.role === 'user' && (
              <button
                type="button"
                onClick={handleSwitchToAdmin}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>Beralih ke Akun Pengurus RT (Demo)</span>
              </button>
            )}

            <button
              type="button"
              onClick={closeAccessDeniedModal}
              className={`px-4 py-2.5 text-xs font-medium rounded-xl transition-colors ${
                currentUser.role === 'admin'
                  ? 'flex-1 bg-slate-800 hover:bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Saya Mengerti (Tutup)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
