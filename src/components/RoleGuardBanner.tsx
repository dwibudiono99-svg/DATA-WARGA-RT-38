import React from 'react';
import { useRBAC } from '../context/RBACContext';
import { Home, ShieldCheck, UserCheck, RefreshCw, Lock, Unlock, MapPin } from 'lucide-react';
import { PERMISSION_DEFINITIONS } from '../data/defaultData';

export const RoleGuardBanner: React.FC = () => {
  const { currentUser, switchRolePersona, rolePermissions, infoPerumahan } = useRBAC();

  const totalPossiblePermissions = PERMISSION_DEFINITIONS.length;
  const currentPermissionsCount = (rolePermissions[currentUser.role] || []).length;
  const isAdmin = currentUser.role === 'admin';

  const handleToggle = () => {
    switchRolePersona(isAdmin ? 'user' : 'admin');
  };

  return (
    <aside
      aria-label="Status role dan lokasi warga"
      className={`w-full border-b transition-colors duration-300 ${
        isAdmin
          ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-indigo-100 border-indigo-800/60'
          : 'bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-emerald-100 border-emerald-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Role indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`p-1.5 rounded-lg flex items-center justify-center ${
              isAdmin ? 'bg-indigo-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs'
            }`}
          >
            {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <Home className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-bold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {infoPerumahan.namaPerumahan} ({infoPerumahan.rtRw}):
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  isAdmin
                    ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/40'
                    : 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'
                }`}
              >
                {isAdmin ? '🛡️ Pengurus RT / Admin' : '🏡 Warga Penghuni'}
              </span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-slate-300 hidden sm:inline">
                Login: <strong className="text-white font-semibold">{currentUser.name}</strong> ({currentUser.blokRumah} No. {currentUser.nomorRumah})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Permission counter & Quick Role Switch */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            {isAdmin ? (
              <Unlock className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Otoritas:</span>
            <span className="font-mono font-bold text-white">
              {currentPermissionsCount} / {totalPossiblePermissions} Izin
            </span>
          </div>

          {/* Quick Toggle Button */}
          <button
            type="button"
            onClick={handleToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all shadow-xs ${
              isAdmin
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
            title="Klik untuk beralih mode akses Pengurus RT dan Warga"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Ganti ke Mode {isAdmin ? 'Warga Penghuni' : 'Pengurus RT'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
