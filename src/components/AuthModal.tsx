import React, { useState } from 'react';
import { useRBAC } from '../context/RBACContext';
import { Home, Shield, Sparkles, X, UserPlus, MapPin, Check } from 'lucide-react';
import { BlokRumah, Role } from '../types/rbac';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { users, loginAsUser, registerWargaUser, infoPerumahan } = useRBAC();
  const [mode, setMode] = useState<'switch' | 'register'>('switch');

  // Register form
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [blok, setBlok] = useState<BlokRumah>('Blok A');
  const [nomor, setNomor] = useState('A-15');
  const [role, setRole] = useState<Role>('user');

  if (!isOpen) return null;

  const handleSelectUser = (userId: string) => {
    loginAsUser(userId);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !email) {
      alert('Nama dan Email wajib diisi!');
      return;
    }

    registerWargaUser(nama, email, blok, nomor, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">
              {mode === 'switch' ? 'Pilih Akun Penghuni / Pengurus RT' : 'Pendaftaran Warga Baru'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-100 px-6 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => setMode('switch')}
            className={`pb-2.5 transition-colors border-b-2 ${
              mode === 'switch'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Pilih Profil Demo
          </button>
          <button
            onClick={() => setMode('register')}
            className={`pb-2.5 transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Penghuni Baru
          </button>
        </div>

        {mode === 'switch' ? (
          <div className="p-6 space-y-4 text-xs">
            <p className="text-slate-500">
              Pilih salah satu profil untuk langsung menguji hak akses <strong>Pengurus RT</strong> atau <strong>Warga Penghuni</strong>:
            </p>

            <div className="space-y-2.5">
              {users.map((user) => {
                const isAdmin = user.role === 'admin';
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-slate-50/80 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{user.blokRumah} No. {user.nomorRumah}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md inline-block ${
                          isAdmin
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {isAdmin ? 'Pengurus RT' : 'Warga'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="p-6 space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Kepala Keluarga</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Misal: Hendra Wijaya, S.T."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Aktif</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Blok Rumah</label>
                <select
                  value={blok}
                  onChange={(e) => setBlok(e.target.value as BlokRumah)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:border-emerald-500 focus:outline-hidden"
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
                  value={nomor}
                  onChange={(e) => setNomor(e.target.value)}
                  placeholder="Misal: A-15"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Peran / Otoritas (RBAC)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-900 focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="user">🏡 Warga Penghuni (Akses Rumah Sendiri)</option>
                <option value="admin">🛡️ Pengurus RT / Admin (Otoritas Penuh Lingkungan)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftarkan & Masuk</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
