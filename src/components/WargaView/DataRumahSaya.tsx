import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  Home,
  Users,
  Edit2,
  CheckCircle2,
  Phone,
  Mail,
  Shield,
  Save,
  Plus,
  Trash2,
  Lock,
} from 'lucide-react';
import { WargaItem } from '../../types/rbac';

export const DataRumahSaya: React.FC = () => {
  const { currentUser, wargaList, updateWarga } = useRBAC();

  const myWarga = wargaList.find(
    (w) => w.blokRumah === currentUser.blokRumah && w.nomorRumah === currentUser.nomorRumah
  ) || wargaList[1];

  const [isEditing, setIsEditing] = useState(false);
  const [namaLengkap, setNamaLengkap] = useState(myWarga.namaLengkap);
  const [pekerjaan, setPekerjaan] = useState(myWarga.pekerjaan);
  const [noHp, setNoHp] = useState(myWarga.noHp);
  const [email, setEmail] = useState(myWarga.email);
  const [jumlahJiwa, setJumlahJiwa] = useState(myWarga.jumlahAnggotaKeluarga);
  const [catatan, setCatatan] = useState(myWarga.catatanKhusus || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWarga(myWarga.id, {
      namaLengkap,
      pekerjaan,
      noHp,
      email,
      jumlahAnggotaKeluarga: jumlahJiwa,
      catatanKhusus: catatan,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Data Kependudukan Rumah Anda
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Informasi keluarga, kontak darurat, dan data hunian kavling <strong>{currentUser.blokRumah} No. {currentUser.nomorRumah}</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto ${
            isEditing
              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
          }`}
        >
          <Edit2 className="w-4 h-4" />
          <span>{isEditing ? 'Batal Ubah' : 'Edit Data Keluarga'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Perubahan data keluarga berhasil disimpan dan disinkronkan ke database RT 04.</span>
        </div>
      )}

      {/* House Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* House Identifier Banner */}
        <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-600/20">
              {currentUser.nomorRumah}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Alamat Kavling Perumahan
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {currentUser.blokRumah} Nomor {currentUser.nomorRumah}
              </h3>
              <p className="text-xs text-slate-600">RT 04 / RW 09 Kelurahan Sukamaju Indah</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-800 font-bold uppercase text-xs rounded-xl shadow-2xs">
              Status: {myWarga.statusHunian}
            </span>
          </div>
        </div>

        {/* Content Details / Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kepala Keluarga</label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pekerjaan</label>
                <input
                  type="text"
                  value={pekerjaan}
                  onChange={(e) => setPekerjaan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="text"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jumlah Jiwa yang Tinggal di Rumah
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={jumlahJiwa}
                  onChange={(e) => setJumlahJiwa(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Tambahan / Kendaraan
                </label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Misal: Mobil B 1234 ABC, Motor B 5678 DEF"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">
                  Kepala Keluarga
                </span>
                <p className="font-bold text-slate-900 text-sm">{myWarga.namaLengkap}</p>
                <p className="text-slate-500">{myWarga.pekerjaan}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">
                  Nomor Induk Kependudukan (NIK)
                </span>
                <p className="font-mono font-bold text-slate-900 text-sm">{myWarga.nik}</p>
                <p className="text-slate-500 font-mono text-[11px]">No. KK: {myWarga.noKK}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">
                  Kontak WhatsApp
                </span>
                <p className="font-mono font-semibold text-slate-800">{myWarga.noHp}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">
                  Anggota Keluarga
                </span>
                <p className="font-bold text-emerald-700 text-sm">
                  {myWarga.jumlahAnggotaKeluarga} Jiwa Menetap
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">
                  Mulai Menempati
                </span>
                <p className="font-medium text-slate-800">{myWarga.tanggalMasuk}</p>
              </div>
            </div>

            {myWarga.catatanKhusus && (
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-emerald-950">
                <span className="font-bold text-[10px] uppercase text-emerald-800 block mb-0.5">
                  Catatan Kendaraan & Keterangan Rumah
                </span>
                <p className="text-slate-700">{myWarga.catatanKhusus}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
