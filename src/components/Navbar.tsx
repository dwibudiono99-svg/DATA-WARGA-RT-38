import React, { useState } from 'react';
import { useRBAC } from '../context/RBACContext';
import {
  Home,
  Users,
  CreditCard,
  FileCheck2,
  AlertCircle,
  Bell,
  ChevronDown,
  Shield,
  RotateCcw,
  Sparkles,
  MapPin,
  FlaskConical,
  LogOut,
  Building2,
  FileText,
  Key,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAuthModal: () => void;
  onOpenScanKK: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenAuthModal,
  onOpenScanKK,
}) => {
  const {
    currentUser,
    users,
    infoPerumahan,
    loginAsUser,
    switchRolePersona,
    logout,
    suratList,
    pengumumanList,
    resetAllToDefault,
  } = useRBAC();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const isAdmin = currentUser.role === 'admin';
  const pendingSuratCount = suratList.filter((s) => s.status === 'Menunggu Validasi RT').length;
  const activeAnnouncementsCount = pengumumanList.filter((a) => a.aktif).length;
  const totalNotifications = (isAdmin ? pendingSuratCount : 0) + activeAnnouncementsCount;

  // Tabs for Admin (Pengurus RT)
  const adminTabs = [
    { id: 'dashboard', label: 'Ringkasan RT', icon: Building2 },
    { id: 'warga', label: 'Data Warga & Rumah', icon: Users },
    { id: 'iuran', label: 'Kas & Iuran Warga', icon: CreditCard },
    { id: 'surat', label: 'Layanan Surat RT', icon: FileCheck2 },
    { id: 'laporan', label: 'Lapor Tamu & Fasum', icon: AlertCircle },
    { id: 'matrix', label: 'Matriks RBAC', icon: Key },
    { id: 'audit', label: 'Log Audit', icon: Shield },
  ];

  // Tabs for Warga Penghuni
  const userTabs = [
    { id: 'user-dashboard', label: 'Dashboard Warga', icon: Home },
    { id: 'data-saya', label: 'Data Rumah Saya', icon: Users },
    { id: 'bayar-iuran', label: 'Iuran Bulanan', icon: CreditCard },
    { id: 'ajukan-surat', label: 'Surat Pengantar RT', icon: FileCheck2 },
    { id: 'lapor-tamu', label: 'Lapor Tamu / Fasum', icon: AlertCircle },
    { id: 'sandbox', label: 'Uji Akses RBAC (Lab)', icon: FlaskConical },
  ];

  const currentTabs = isAdmin ? adminTabs : userTabs;

  const handleReset = () => {
    if (confirm('Kembalikan seluruh data warga, iuran, surat, dan izin akses ke kondisi awal?')) {
      resetAllToDefault();
      setIsUserMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange(isAdmin ? 'dashboard' : 'user-dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    SIM-Warga
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {infoPerumahan.rtRw}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal leading-none hidden sm:block">
                  {infoPerumahan.namaPerumahan}
                </p>
              </div>
            </button>

            {/* Quick Role Toggle Pill */}
            <div className="hidden lg:flex items-center ml-3 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  if (!isAdmin) switchRolePersona('admin');
                  onTabChange('dashboard');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  isAdmin
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Pengurus RT</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAdmin) switchRolePersona('user');
                  onTabChange('user-dashboard');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  !isAdmin
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Warga Penghuni</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? isAdmin
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header: Notification & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Scan KK Quick Action Button */}
            <button
              type="button"
              onClick={onOpenScanKK}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-xs transition-all hover:scale-102 cursor-pointer"
              title="Pindai / Scan Foto Kartu Keluarga dengan AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span className="hidden sm:inline">Scan KK (AI)</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                aria-label="Pemberitahuan Warga"
              >
                <Bell className="w-5 h-5" />
                {totalNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                    {totalNotifications}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      <span>Warta & Pemberitahuan RT</span>
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {totalNotifications} Info
                    </span>
                  </div>

                  <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                    {isAdmin && pendingSuratCount > 0 && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between text-amber-900 font-bold">
                          <span>Permohonan Surat Masuk</span>
                          <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                            {pendingSuratCount}
                          </span>
                        </div>
                        <p className="text-amber-800 text-[11px]">
                          Ada warga yang mengajukan surat pengantar resmi RT.
                        </p>
                        <button
                          onClick={() => {
                            setIsNotifOpen(false);
                            onTabChange('surat');
                          }}
                          className="text-[11px] font-bold text-amber-900 underline mt-1 block"
                        >
                          Buka Layanan Surat RT &rarr;
                        </button>
                      </div>
                    )}

                    {pengumumanList.map((anc) => (
                      <div key={anc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{anc.judul}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                              anc.prioritas === 'penting'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {anc.kategori}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                          {anc.isi}
                        </p>
                        <span className="text-[10px] text-slate-400 block pt-0.5">
                          {anc.penulis} • {anc.tanggal}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => setIsNotifOpen(false)}
                      className="text-xs text-emerald-700 font-semibold hover:underline"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/20"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                    <span className="truncate max-w-[120px]">{currentUser.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {currentUser.blokRumah} No. {currentUser.nomorRumah}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isAdmin
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {currentUser.roleTitle}
                      </span>
                    </div>
                  </div>

                  {/* Switch Account List */}
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 px-1">
                      Pindah Akun Warga / RT:
                    </p>
                    <div className="space-y-1">
                      {users.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            loginAsUser(user.id);
                            setIsUserMenuOpen(false);
                            onTabChange(user.role === 'admin' ? 'dashboard' : 'user-dashboard');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            user.id === currentUser.id
                              ? 'bg-slate-100 font-bold text-slate-900'
                              : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={user.avatar}
                              className="w-5 h-5 rounded-full object-cover"
                              alt=""
                            />
                            <div className="truncate">
                              <p className="truncate leading-tight font-medium">{user.name}</p>
                              <p className="text-[10px] text-slate-400">{user.blokRumah}-{user.nomorRumah}</p>
                            </div>
                          </div>
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-extrabold ${
                              user.role === 'admin'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {user.role === 'admin' ? 'Pengurus' : 'Warga'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action items */}
                  <div className="p-1 space-y-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Daftar / Ganti Warga Lain</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-600" />
                      <span>Reset Seluruh Data ke Bawaan</span>
                    </button>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Keluar Sesi</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center overflow-x-auto space-x-1 py-2 border-t border-slate-100 no-scrollbar">
          {currentTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? isAdmin
                      ? 'bg-indigo-600 text-white'
                      : 'bg-emerald-600 text-white'
                    : 'text-slate-600 bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
