import React, { useState } from 'react';
import { useRBAC } from '../context/RBACContext';
import {
  ShieldCheck,
  Phone,
  MessageCircle,
  Plus,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  X,
  Save,
  Radio,
  ExternalLink,
  Flame,
  PhoneCall,
} from 'lucide-react';
import { PetugasKeamanan } from '../types/rbac';

export const PetugasKeamananView: React.FC = () => {
  const {
    petugasKeamananList,
    tambahPetugasKeamanan,
    updatePetugasKeamanan,
    hapusPetugasKeamanan,
    updateStatusJagaPetugas,
    currentUser,
    canExecute,
    infoPerumahan,
  } = useRBAC();

  const isAdmin = currentUser.role === 'admin';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPetugas, setEditingPetugas] = useState<PetugasKeamanan | null>(null);

  // Form states
  const [namaLengkap, setNamaLengkap] = useState('');
  const [jabatan, setJabatan] = useState<PetugasKeamanan['jabatan']>('Petugas Pos Gerbang Utama');
  const [noHp, setNoHp] = useState('');
  const [noWhatsapp, setNoWhatsapp] = useState('');
  const [posJaga, setPosJaga] = useState('');
  const [shift, setShift] = useState<PetugasKeamanan['shift']>('Shift Pagi (07.00 - 15.00)');
  const [statusJaga, setStatusJaga] = useState<PetugasKeamanan['statusJaga']>('Sedang Bertugas');
  const [foto, setFoto] = useState('');
  const [masaTugas, setMasaTugas] = useState('');
  const [catatanTugas, setCatatanTugas] = useState('');

  const handleOpenAdd = () => {
    if (!canExecute('keamanan:manage', 'Menambah Petugas Keamanan Baru', 'Keamanan & Pos Satpam')) return;
    setEditingPetugas(null);
    setNamaLengkap('');
    setJabatan('Petugas Pos Gerbang Utama');
    setNoHp('+62 812-');
    setNoWhatsapp('62812');
    setPosJaga('Pos Satpam Utama Gerbang Timur (Gate 1)');
    setShift('Shift Pagi (07.00 - 15.00)');
    setStatusJaga('Sedang Bertugas');
    setFoto('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80');
    setMasaTugas('Sejak 2024');
    setCatatanTugas('Piket pos satpam, pemeriksaan tamu, patroli berkala.');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (petugas: PetugasKeamanan) => {
    if (!canExecute('keamanan:manage', 'Mengubah Data Petugas Keamanan', 'Keamanan & Pos Satpam')) return;
    setEditingPetugas(petugas);
    setNamaLengkap(petugas.namaLengkap);
    setJabatan(petugas.jabatan);
    setNoHp(petugas.noHp);
    setNoWhatsapp(petugas.noWhatsapp);
    setPosJaga(petugas.posJaga);
    setShift(petugas.shift);
    setStatusJaga(petugas.statusJaga);
    setFoto(petugas.foto);
    setMasaTugas(petugas.masaTugas);
    setCatatanTugas(petugas.catatanTugas);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim() || !noHp.trim()) return;

    const cleanedWA = noWhatsapp.replace(/[^0-9]/g, '');

    if (editingPetugas) {
      updatePetugasKeamanan(editingPetugas.id, {
        namaLengkap,
        jabatan,
        noHp,
        noWhatsapp: cleanedWA,
        posJaga,
        shift,
        statusJaga,
        foto,
        masaTugas,
        catatanTugas,
      });
    } else {
      tambahPetugasKeamanan({
        namaLengkap,
        jabatan,
        noHp,
        noWhatsapp: cleanedWA,
        posJaga,
        shift,
        statusJaga,
        foto: foto || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        masaTugas: masaTugas || '2026',
        catatanTugas,
      });
    }

    setIsModalOpen(false);
    setEditingPetugas(null);
  };

  const handleDelete = (id: string, nama: string) => {
    if (!canExecute('keamanan:manage', 'Menghapus Data Petugas Keamanan', 'Keamanan & Pos Satpam')) return;
    if (confirm(`Yakin ingin menghapus data petugas keamanan "${nama}"?`)) {
      hapusPetugasKeamanan(id);
    }
  };

  const emergencyContacts = [
    { nama: 'Pos Satpam Utama (Gate 1)', nomor: '0812-8877-6601', wa: '6281288776601', desc: 'Siaga 24 Jam Kompleks' },
    { nama: 'Polsek Cilodong', nomor: '(021) 875-1234', desc: 'Sentra Pelayanan Kepolisian' },
    { nama: 'Bhabinkamtibmas Kelurahan', nomor: '0812-9988-7766', desc: 'Aiptu M. Ridwan' },
    { nama: 'Pemadam Kebakaran (Damkar)', nomor: '113 / (021) 7788-3322', desc: 'Pos Kembang Depok' },
    { nama: 'Ambulans & IGD RSUD', nomor: '118 / (021) 7788-4455', desc: 'Layanan Medis Darurat' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Keamanan Lingkungan Perumahan 24 Jam</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Direktori & Nomor Kontak Petugas Keamanan (Pos Satpam)
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Warga dapat langsung menghubungi satpam yang sedang bertugas via Telepon atau WhatsApp jika memerlukan bantuan keamanan, membukakan portal darurat, penerimaan kurir paket besar, atau lapor kecurigaan.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="relative z-10 flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-extrabold text-xs transition-all shadow-lg shadow-emerald-950/40 cursor-pointer self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Petugas</span>
          </button>
        )}
      </div>

      {/* Quick Emergency Hotlines Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Nomor Telepon & Kontak Darurat Instansi Terdekat
            </h4>
          </div>
          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            Respon Darurat 24 Jam
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {emergencyContacts.map((em, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 hover:border-slate-300 transition-colors"
            >
              <span className="text-[11px] font-bold text-slate-800 block truncate">{em.nama}</span>
              <p className="font-mono font-black text-xs text-rose-700 select-all">{em.nomor}</p>
              <span className="text-[10px] text-slate-500 block truncate">{em.desc}</span>
              <div className="pt-1 flex gap-1">
                <a
                  href={`tel:${em.nomor.replace(/[^0-9]/g, '')}`}
                  className="flex-1 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[10px] font-bold text-slate-700 text-center flex items-center justify-center gap-1"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Panggil</span>
                </a>
                {em.wa && (
                  <a
                    href={`https://wa.me/${em.wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded text-[10px] text-emerald-800 flex items-center justify-center"
                    title="Chat WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Officers Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Daftar Petugas Jaga Satpam {infoPerumahan.namaPerumahan} ({petugasKeamananList.length} Personel)</span>
          </h3>
          <span className="text-xs text-slate-500">
            Regu Satpam Lingkungan Siaga
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {petugasKeamananList.map((petugas) => {
            const isDuty = petugas.statusJaga === 'Sedang Bertugas';
            const isOnCall = petugas.statusJaga === 'Siaga (On-Call)';

            return (
              <div
                key={petugas.id}
                className={`bg-white rounded-3xl border p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                  isDuty
                    ? 'border-emerald-300 hover:border-emerald-500 ring-1 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Top info and status badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={petugas.foto}
                          alt={petugas.namaLengkap}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                        />
                        {isDuty && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-slate-900">{petugas.namaLengkap}</h4>
                        </div>
                        <p className="text-xs font-bold text-emerald-800">{petugas.jabatan}</p>
                        <span className="text-[10px] text-slate-400 block">{petugas.masaTugas}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          isDuty
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : isOnCall
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isDuty
                              ? 'bg-emerald-600 animate-pulse'
                              : isOnCall
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span>{petugas.statusJaga}</span>
                      </span>

                      {/* Admin Quick Status Dropdown */}
                      {isAdmin && (
                        <select
                          value={petugas.statusJaga}
                          onChange={(e) =>
                            updateStatusJagaPetugas(petugas.id, e.target.value as PetugasKeamanan['statusJaga'])
                          }
                          className="text-[10px] bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-slate-700 font-semibold focus:outline-hidden"
                          title="Ubah Status Jaga Cepat"
                        >
                          <option value="Sedang Bertugas">Sedang Bertugas</option>
                          <option value="Siaga (On-Call)">Siaga (On-Call)</option>
                          <option value="Libur">Libur</option>
                        </select>
                      )}
                    </div>
                  </div>

                  {/* Duty Location & Shift */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium truncate">{petugas.posJaga}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="font-semibold text-indigo-950">{petugas.shift}</span>
                    </div>

                    {petugas.catatanTugas && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60">
                        "{petugas.catatanTugas}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Direct Calling & WhatsApp Actions */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900 select-all">
                      {petugas.noHp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Call Button */}
                    <a
                      href={`tel:${petugas.noHp.replace(/[^0-9]/g, '')}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      title="Panggil langsung via telepon seluler"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Telepon</span>
                    </a>

                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/${petugas.noWhatsapp}?text=Halo%20Pak%20${encodeURIComponent(
                        petugas.namaLengkap
                      )},%20saya%20warga%20RT%2004...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      title="Hubungi melalui WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(petugas)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit data petugas"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(petugas.id, petugas.namaLengkap)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus data petugas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Add / Edit Petugas Keamanan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{editingPetugas ? 'Edit Data Petugas Keamanan' : 'Tambah Petugas Keamanan Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Petugas *</label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: Sutrisno Wibowo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan / Peran</label>
                  <select
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-hidden"
                  >
                    <option value="Komandan Regu (Danru)">Komandan Regu (Danru)</option>
                    <option value="Petugas Pos Gerbang Utama">Petugas Pos Gerbang Utama</option>
                    <option value="Petugas Patroli Keliling">Petugas Patroli Keliling</option>
                    <option value="Petugas Pos Pantau Barat">Petugas Pos Pantau Barat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Jaga</label>
                  <select
                    value={statusJaga}
                    onChange={(e) => setStatusJaga(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-900 focus:outline-hidden"
                  >
                    <option value="Sedang Bertugas">Sedang Bertugas</option>
                    <option value="Siaga (On-Call)">Siaga (On-Call)</option>
                    <option value="Libur">Libur</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Telepon HP *</label>
                  <input
                    type="text"
                    required
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    placeholder="+62 812-3456-7890"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp (Awali 62)</label>
                  <input
                    type="text"
                    required
                    value={noWhatsapp}
                    onChange={(e) => setNoWhatsapp(e.target.value)}
                    placeholder="6281234567890"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift Jam Kerja</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden"
                  >
                    <option value="Shift Pagi (07.00 - 15.00)">Shift Pagi (07.00 - 15.00)</option>
                    <option value="Shift Sore (15.00 - 23.00)">Shift Sore (15.00 - 23.00)</option>
                    <option value="Shift Malam (23.00 - 07.00)">Shift Malam (23.00 - 07.00)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Masa Tugas</label>
                  <input
                    type="text"
                    value={masaTugas}
                    onChange={(e) => setMasaTugas(e.target.value)}
                    placeholder="Contoh: Sejak 2021"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Pos Jaga</label>
                <input
                  type="text"
                  value={posJaga}
                  onChange={(e) => setPosJaga(e.target.value)}
                  placeholder="Contoh: Pos Satpam Utama Gerbang Timur (Gate 1)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Foto Profil Satpam</label>
                <input
                  type="text"
                  value={foto}
                  onChange={(e) => setFoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tugas Khusus</label>
                <textarea
                  rows={2}
                  value={catatanTugas}
                  onChange={(e) => setCatatanTugas(e.target.value)}
                  placeholder="Contoh: Pemegang kunci gembok portal utama dan radio HT darurat."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Data Petugas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
