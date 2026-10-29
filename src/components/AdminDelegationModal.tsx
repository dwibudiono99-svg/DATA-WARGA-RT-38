import React, { useState } from 'react';
import { useRBAC } from '../context/RBACContext';
import {
  Shield,
  ShieldCheck,
  UserCheck,
  UserMinus,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Crown,
  Home,
  Users,
  Edit3,
  Check,
  Sparkles,
  ArrowRight,
  UserCheck2,
  Shuffle,
  Trash2,
} from 'lucide-react';
import { WargaItem, User } from '../types/rbac';

interface AdminDelegationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedWargaId?: string | null;
}

const PRESET_ADMIN_ROLES = [
  'Ketua RT 38',
  'Wakil Ketua RT 38',
  'Sekretaris RT 38',
  'Bendahara RT 38',
  'Seksi Keamanan & Ketertiban',
  'Seksi Sarana & Prasarana Lingkungan',
  'Seksi Sosial & Pemberdayaan Warga',
  'Admin Pendamping IT / SIM-Warga',
  'Pengurus RT 38 / Admin Kompleks',
];

export const AdminDelegationModal: React.FC<AdminDelegationModalProps> = ({
  isOpen,
  onClose,
  preSelectedWargaId,
}) => {
  const {
    users,
    wargaList,
    currentUser,
    loginAsUser,
    tunjukWargaSebagaiAdmin,
    cabutHakAksesAdmin,
    ubahJabatanAdmin,
    operAdminKeRandomWarga,
    hapusSemuaDataDummyDanOperAdmin,
    infoPerumahan,
  } = useRBAC();

  const [searchWargaQuery, setSearchWargaQuery] = useState('');
  const [selectedWargaId, setSelectedWargaId] = useState<string>(preSelectedWargaId || '');
  const [selectedRoleTitle, setSelectedRoleTitle] = useState('Pengurus RT 38 / Admin Kompleks');
  const [customRoleTitle, setCustomRoleTitle] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    appointedUserId?: string;
    appointedUserName?: string;
  } | null>(null);

  React.useEffect(() => {
    if (preSelectedWargaId) {
      setSelectedWargaId(preSelectedWargaId);
    }
  }, [preSelectedWargaId]);

  if (!isOpen) return null;

  const adminUsers = users.filter((u) => u.role === 'admin');

  // Filter warga for appointment (exclude those already admin)
  const availableWarga = wargaList.filter((w) => {
    const isAlreadyAdmin = adminUsers.some(
      (u) =>
        u.name.toLowerCase().trim() === w.namaLengkap.toLowerCase().trim() ||
        (u.blokRumah === w.blokRumah && u.nomorRumah === w.nomorRumah && u.name.split(' ')[0] === w.namaLengkap.split(' ')[0])
    );

    const matchQuery =
      searchWargaQuery === '' ||
      w.namaLengkap.toLowerCase().includes(searchWargaQuery.toLowerCase()) ||
      w.blokRumah.toLowerCase().includes(searchWargaQuery.toLowerCase()) ||
      w.nomorRumah.toLowerCase().includes(searchWargaQuery.toLowerCase()) ||
      w.nik.includes(searchWargaQuery);

    return matchQuery && !isAlreadyAdmin;
  });

  const handleAppoint = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    if (!selectedWargaId) {
      setFeedbackMessage({ type: 'error', text: 'Silakan pilih warga yang ingin ditunjuk sebagai Admin.' });
      return;
    }

    const titleToUse = isCustomRole && customRoleTitle.trim() ? customRoleTitle.trim() : selectedRoleTitle;
    const appointedWarga = wargaList.find((w) => w.id === selectedWargaId);
    const success = tunjukWargaSebagaiAdmin(selectedWargaId, titleToUse);

    if (success) {
      // Find the appointed user account
      const matchedUser = users.find(
        (u) =>
          u.name.toLowerCase().trim() === appointedWarga?.namaLengkap.toLowerCase().trim() ||
          (appointedWarga && u.blokRumah === appointedWarga.blokRumah && u.nomorRumah === appointedWarga.nomorRumah)
      );

      setFeedbackMessage({
        type: 'success',
        text: `Berhasil! Warga "${appointedWarga?.namaLengkap || 'yang dipilih'}" resmi memiliki hak akses penuh Administrator sebagai "${titleToUse}".`,
        appointedUserId: matchedUser?.id,
        appointedUserName: appointedWarga?.namaLengkap,
      });
      setSelectedWargaId('');
      setCustomRoleTitle('');
      setIsCustomRole(false);
    } else {
      setFeedbackMessage({ type: 'error', text: 'Gagal menunjuk admin. Pastikan data warga valid.' });
    }
  };

  const handleRevoke = (user: User) => {
    if (confirm(`Apakah Anda yakin ingin mencabut hak akses Admin dari "${user.name}"? Pengguna akan dikembalikan statusnya menjadi Warga Penghuni biasa.`)) {
      setFeedbackMessage(null);
      const success = cabutHakAksesAdmin(user.id);
      if (success) {
        setFeedbackMessage({
          type: 'success',
          text: `Hak akses Admin untuk "${user.name}" telah dicabut dan dikembalikan ke Warga Penghuni.`,
        });
      }
    }
  };

  const handleStartEditTitle = (user: User) => {
    setEditingUserId(user.id);
    setEditTitleValue(user.roleTitle);
  };

  const handleSaveEditTitle = (userId: string) => {
    if (!editTitleValue.trim()) return;
    ubahJabatanAdmin(userId, editTitleValue.trim());
    setEditingUserId(null);
    setFeedbackMessage({
      type: 'success',
      text: `Jabatan pengurus berhasil diperbarui menjadi "${editTitleValue.trim()}".`,
    });
  };

  const handleOperRandomAdmin = () => {
    setFeedbackMessage(null);
    const result = operAdminKeRandomWarga(true);
    if (result.success && result.warga) {
      setFeedbackMessage({
        type: 'success',
        text: `🎲 Berhasil! Hak akses Admin RT 38 kini diserahkan kepada "${result.warga.namaLengkap}" (${result.warga.blokRumah} No. ${result.warga.nomorRumah}, NIK: ${result.warga.nik}). Sesi aktif langsung dialihkan.`,
        appointedUserId: result.user?.id,
        appointedUserName: result.warga.namaLengkap,
      });
    } else {
      setFeedbackMessage({
        type: 'error',
        text: result.message || 'Gagal mengalihkan admin ke warga acak.',
      });
    }
  };

  const handleHapusDummyDanOperRandom = () => {
    if (
      confirm(
        '⚠️ KONFIRMASI PEMBERSIHAN TOTAL:\n\nApakah Anda yakin ingin menghapus seluruh data dummy lama dan menyerahkan hak akses Admin RT 38 kepada salah satu warga sah yang terdata dalam database secara acak?\n\n• Seluruh data dummy akan dihapus bersih.\n• Sesi akun akan langsung berganti ke warga baru tersebut.\n• Nama Ketua RT di KOP surat resmi akan diperbarui.'
      )
    ) {
      setFeedbackMessage(null);
      const result = hapusSemuaDataDummyDanOperAdmin();
      if (result.success && result.warga) {
        setFeedbackMessage({
          type: 'success',
          text: `🗑️ Data dummy berhasil dibersihkan! Hak akses Admin RT 38 resmi diserahkan kepada warga acak: "${result.warga.namaLengkap}" (${result.warga.blokRumah} No. ${result.warga.nomorRumah}).`,
          appointedUserId: result.user?.id,
          appointedUserName: result.warga.namaLengkap,
        });
      } else {
        setFeedbackMessage({
          type: 'error',
          text: result.message || 'Gagal membersihkan dummy dan mengoper admin.',
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl shadow-sm">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  Kelola Penunjukan Hak Akses Admin RT
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase">
                  Hak Akses Fleksibel
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Hak akses Administrator / Pengurus dapat diberikan secara sah kepada siapa saja warga yang ditunjuk oleh RT {infoPerumahan.rtRw}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* QUICK ACTIONS BANNER: OPER ADMIN RANDOM & HAPUS DUMMY */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md border border-purple-800/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-500/30 rounded-xl border border-purple-400/40 text-amber-300 shrink-0">
                  <Shuffle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Pengalihan Hak Admin Otomatis</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-200 border border-purple-400/30 text-[10px] font-bold">
                      {wargaList.length} Warga Terdaftar
                    </span>
                  </h4>
                  <p className="text-[11px] text-purple-200/80">
                    Sistem dapat menyerahkan hak administrator secara acak kepada siapa saja warga sah di database RT 38.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleOperRandomAdmin}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:scale-102 transition-all cursor-pointer"
                  title="Pilih satu warga secara acak dari database dan jadikan Admin RT"
                >
                  <Shuffle className="w-4 h-4 text-slate-950" />
                  <span>🎲 Oper Admin ke Warga Acak</span>
                </button>

                <button
                  type="button"
                  onClick={handleHapusDummyDanOperRandom}
                  className="px-3 py-2 bg-rose-600/90 hover:bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md border border-rose-400/30 hover:scale-102 transition-all cursor-pointer"
                  title="Hapus seluruh data dummy lama dan oper admin ke warga acak"
                >
                  <Trash2 className="w-4 h-4 text-rose-200" />
                  <span>🗑️ Hapus Dummy & Oper Admin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedbackMessage && (
            <div
              className={`p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border animate-in zoom-in-95 ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-3">
                {feedbackMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <p className="text-xs font-semibold">{feedbackMessage.text}</p>
              </div>

              {feedbackMessage.appointedUserId && (
                <button
                  type="button"
                  onClick={() => {
                    loginAsUser(feedbackMessage.appointedUserId!);
                    setFeedbackMessage({
                      type: 'success',
                      text: `Sesi aktif dialihkan ke akun Admin "${feedbackMessage.appointedUserName}".`,
                    });
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>⚡ Masuk Sebagai Admin Ini</span>
                </button>
              )}
            </div>
          )}

          {/* SECTION 1: DAFTAR PENGURUS & ADMIN AKTIF SAAT INI */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Daftar Administrator & Pengurus RT Aktif ({adminUsers.length} Orang)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Seluruh akun berikut memiliki hak akses penuh ke modul Data Warga, Iuran, Surat, Keamanan, dan Sistem.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {adminUsers.map((admin, index) => {
                const isCurrentActive = admin.id === currentUser.id;
                const isEditing = editingUserId === admin.id;

                return (
                  <div
                    key={`${admin.id}_${index}`}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isCurrentActive
                        ? 'bg-indigo-50/70 border-indigo-300 shadow-xs ring-1 ring-indigo-400/40'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={admin.avatar}
                          alt={admin.name}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-slate-900">{admin.name}</span>
                            {isCurrentActive && (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-white font-bold text-[9px] uppercase">
                                Anda
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {admin.blokRumah} No. {admin.nomorRumah} • {admin.phone || admin.email}
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-600" />
                        Admin Sah
                      </span>
                    </div>

                    {/* Role Title / Position Display or In-place Editor */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Jabatan Pengurus:
                      </span>
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editTitleValue}
                            onChange={(e) => setEditTitleValue(e.target.value)}
                            className="flex-1 px-2.5 py-1 text-xs border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            placeholder="Contoh: Sekretaris RT 38"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEditTitle(admin.id)}
                            className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                            title="Simpan Jabatan"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingUserId(null)}
                            className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 cursor-pointer"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-indigo-950">
                            {admin.roleTitle}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStartEditTitle(admin)}
                            className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Ubah</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                      {!isCurrentActive ? (
                        <button
                          type="button"
                          onClick={() => {
                            loginAsUser(admin.id);
                            setFeedbackMessage({
                              type: 'success',
                              text: `Berhasil beralih ke sesi ${admin.name} (${admin.roleTitle}).`,
                            });
                          }}
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Login Sebagai Admin Ini</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-indigo-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sesi Sedang Aktif</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRevoke(admin)}
                        disabled={adminUsers.length <= 1}
                        className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title={adminUsers.length <= 1 ? 'Minimal 1 Admin harus aktif' : 'Cabut Hak Akses Admin'}
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        <span>Cabut Admin</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: FORM PENUNJUKAN WARGA MENJADI ADMIN BARU */}
          <div className="p-5 bg-gradient-to-r from-emerald-50/80 via-teal-50/70 to-indigo-50/80 border-2 border-emerald-300 rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-200">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <UserCheck2 className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-emerald-950">
                  Tunjuk Warga Menjadi Administrator / Pengurus Baru
                </h4>
                <p className="text-[11px] text-emerald-800">
                  Pilih warga siapa saja dari daftar warga RT 38 untuk langsung diberikan wewenang dan akun admin.
                </p>
              </div>
            </div>

            <form onSubmit={handleAppoint} className="space-y-4">
              {/* Step 1: Search & Select Resident */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-xs text-slate-800 flex items-center justify-between">
                  <span>1. Pilih Warga yang Ditunjuk:</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    Tersedia {availableWarga.length} Warga Penghuni
                  </span>
                </label>

                {/* Filter search bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchWargaQuery}
                    onChange={(e) => setSearchWargaQuery(e.target.value)}
                    placeholder="Ketik nama warga, blok, atau NIK untuk memfilter..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                </div>

                {/* Dropdown selector */}
                <select
                  value={selectedWargaId}
                  onChange={(e) => setSelectedWargaId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">-- Pilih Warga dari Database ({availableWarga.length} Pilihan) --</option>
                  {availableWarga.map((warga, index) => (
                    <option key={`${warga.id}_${index}`} value={warga.id}>
                      {warga.namaLengkap} ({warga.blokRumah} No. {warga.nomorRumah}) — {warga.pekerjaan || 'Warga'}
                    </option>
                  ))}
                </select>

                {selectedWargaId && (
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    {(() => {
                      const sel = wargaList.find((w) => w.id === selectedWargaId);
                      return sel ? (
                        <>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="font-extrabold text-slate-900">{sel.namaLengkap}</span>
                              <span className="text-slate-500 text-[11px] ml-2 font-mono">
                                {sel.blokRumah} No. {sel.nomorRumah} • NIK: {sel.nik}
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Siap Ditunjuk
                          </span>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Step 2: Choose Position / Title */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-xs text-slate-800 block">
                  2. Tentukan Jabatan / Tanggung Jawab Pengurus:
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_ADMIN_ROLES.map((roleTitle) => {
                    const isSelected = !isCustomRole && selectedRoleTitle === roleTitle;
                    return (
                      <button
                        key={roleTitle}
                        type="button"
                        onClick={() => {
                          setSelectedRoleTitle(roleTitle);
                          setIsCustomRole(false);
                        }}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium'
                        }`}
                      >
                        <span className="text-[11px] leading-tight block truncate">{roleTitle}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomRole(!isCustomRole)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      isCustomRole
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    ✏️ Tulis Jabatan Kustom Sendiri
                  </button>

                  {isCustomRole && (
                    <input
                      type="text"
                      value={customRoleTitle}
                      onChange={(e) => setCustomRoleTitle(e.target.value)}
                      placeholder="Ketik jabatan kustom, misal: Humas RT 38"
                      className="flex-1 px-3 py-1.5 bg-white border border-indigo-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between border-t border-emerald-200">
                <div className="text-[11px] text-slate-600">
                  Warga yang ditunjuk langsung dapat mengelola sistem secara real-time.
                </div>

                <button
                  type="submit"
                  disabled={!selectedWargaId}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 hover:from-emerald-500 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-102 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Beri Hak Akses Admin Sekarang</span>
                </button>
              </div>
            </form>
          </div>

          {/* Info Notes */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-slate-600">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-extrabold text-slate-900 block">
                Prinsip Fleksibilitas Hak Akses SIM-Warga:
              </span>
              <p className="leading-relaxed text-slate-600">
                Kini hak akses Administrator tidak terkunci pada 1 nama saja. Pengurus dapat membagi tugas administrasi kepada Wakil, Sekretaris, Bendahara, atau warga siapa saja yang dipercaya. Seluruh aktivitas penunjukan dicatat transparan di <strong>Audit Log Sistem</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors"
          >
            Selesai / Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
