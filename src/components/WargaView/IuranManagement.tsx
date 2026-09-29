import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  Upload,
  QrCode,
  Shield,
  Building2,
  Lock,
} from 'lucide-react';
import { IuranItem, StatusBayar } from '../../types/rbac';

export const IuranManagement: React.FC = () => {
  const {
    iuranList,
    currentUser,
    bayarIuranSendiri,
    verifikasiIuran,
    canExecute,
    infoPerumahan,
  } = useRBAC();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StatusBayar>('all');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedIuranToPay, setSelectedIuranToPay] = useState<IuranItem | null>(null);

  const [metodeBayar, setMetodeBayar] = useState<'QRIS' | 'Transfer Bank' | 'Tunai'>('QRIS');
  const [buktiRef, setBuktiRef] = useState('');

  const isAdmin = currentUser.role === 'admin';

  // Find user's own home dues
  const myDues = iuranList.filter(
    (i) => i.blokRumah === currentUser.blokRumah && i.nomorRumah === currentUser.nomorRumah
  );

  const filteredIuran = iuranList.filter((i) => {
    const matchesSearch =
      i.namaWarga.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.nomorRumah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.blokRumah.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.statusBayar === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalNominalTerkumpul = iuranList
    .filter((i) => i.statusBayar === 'Lunas')
    .reduce((sum, curr) => sum + curr.nominal, 0);

  const handleOpenPayModal = (iuran: IuranItem) => {
    setSelectedIuranToPay(iuran);
    setBuktiRef('TRF-' + Math.floor(100000 + Math.random() * 900000));
    setIsPayModalOpen(true);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIuranToPay) return;
    bayarIuranSendiri(selectedIuranToPay.id, metodeBayar, buktiRef);
    setIsPayModalOpen(false);
  };

  const handleVerifyClick = (iuran: IuranItem, status: StatusBayar) => {
    if (!canExecute('iuran:verify', 'Memverifikasi Status Pembayaran Iuran', 'Iuran & Kas')) return;
    verifikasiIuran(iuran.id, status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Iuran Kebersihan, Keamanan & Kas Lingkungan RT
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tarif iuran wajib Rp 150.000 / bulan untuk operasional pos satpam 24 jam, pengangkutan sampah 3x seminggu, dan pemeliharaan fasum {infoPerumahan.namaPerumahan}.
          </p>
        </div>

        {/* Total Collected */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2 bg-emerald-600 text-white rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Total Iuran Terkumpul (Bln Ini)
            </span>
            <p className="text-xl font-black text-emerald-950">
              Rp {totalNominalTerkumpul.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* For Regular User: My House Dues Banner */}
      {!isAdmin && myDues.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-bold uppercase rounded">
                Tagihan Rumah Anda
              </span>
              <span className="font-bold text-xs text-slate-900">
                {currentUser.blokRumah} No. {currentUser.nomorRumah} ({currentUser.name})
              </span>
            </div>
            <p className="text-xs text-slate-700">
              Periode: <strong>{myDues[0].periodeBulan}</strong> • Nominal: <strong>Rp {myDues[0].nominal.toLocaleString('id-ID')}</strong>
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-500">Status Pembayaran:</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                  myDues[0].statusBayar === 'Lunas'
                    ? 'bg-emerald-100 text-emerald-800'
                    : myDues[0].statusBayar === 'Menunggu Verifikasi'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {myDues[0].statusBayar}
              </span>
            </div>
          </div>

          {myDues[0].statusBayar !== 'Lunas' && (
            <button
              onClick={() => handleOpenPayModal(myDues[0])}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <QrCode className="w-4 h-4" />
              <span>Bayar Iuran Sekarang (QRIS / Transfer)</span>
            </button>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama warga atau nomor rumah..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:border-emerald-500"
          >
            <option value="all">Semua Status Bayar</option>
            <option value="Lunas">Lunas</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Belum Bayar">Belum Bayar (Menunggak)</option>
          </select>
        </div>
      </div>

      {/* Dues List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Warga & Rumah</th>
                <th className="px-6 py-4">Periode</th>
                <th className="px-6 py-4">Jenis Tagihan</th>
                <th className="px-6 py-4">Nominal</th>
                <th className="px-6 py-4">Status Bayar</th>
                <th className="px-6 py-4">Rincian Pembayaran</th>
                <th className="px-6 py-4 text-right">Aksi & Otoritas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIuran.map((item) => {
                const isMyHome = item.blokRumah === currentUser.blokRumah && item.nomorRumah === currentUser.nomorRumah;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Warga */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{item.namaWarga}</span>
                        {isMyHome && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded">
                            Anda
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.blokRumah} No. {item.nomorRumah}
                      </div>
                    </td>

                    {/* Period */}
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {item.periodeBulan}
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 text-slate-600">
                      {item.jenisIuran}
                    </td>

                    {/* Nominal */}
                    <td className="px-6 py-4 font-bold text-slate-900">
                      Rp {item.nominal.toLocaleString('id-ID')}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          item.statusBayar === 'Lunas'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : item.statusBayar === 'Menunggu Verifikasi'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {item.statusBayar === 'Lunas' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : item.statusBayar === 'Menunggu Verifikasi' ? (
                          <Clock className="w-3 h-3 text-amber-600" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                        )}
                        <span>{item.statusBayar}</span>
                      </span>
                    </td>

                    {/* Details */}
                    <td className="px-6 py-4 text-slate-500 text-[11px]">
                      {item.tanggalBayar ? (
                        <div>
                          <span>{item.metodePembayaran}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">
                            Ref: {item.buktiBayar || item.tanggalBayar}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Belum ada transaksi</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Warga Bayar Button */}
                        {isMyHome && item.statusBayar !== 'Lunas' && (
                          <button
                            type="button"
                            onClick={() => handleOpenPayModal(item)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                          >
                            Bayar
                          </button>
                        )}

                        {/* Admin Verification Controls */}
                        {item.statusBayar !== 'Lunas' && (
                          <button
                            type="button"
                            onClick={() => handleVerifyClick(item, 'Lunas')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isAdmin
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-slate-300 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title={
                              isAdmin
                                ? 'Konfirmasi Lunas (Bendahara/Admin RT)'
                                : 'Konfirmasi Lunas (Khusus Pengurus RT - Coba klik untuk tes 403)'
                            }
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}

                        {item.statusBayar === 'Lunas' && (
                          <button
                            type="button"
                            onClick={() => handleVerifyClick(item, 'Belum Bayar')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isAdmin
                                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-slate-300 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title={isAdmin ? 'Ubah ke Belum Bayar' : 'Ubah Status (Khusus RT - Tes 403)'}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Bayar Iuran Online */}
      {isPayModalOpen && selectedIuranToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Pembayaran Iuran: {selectedIuranToPay.periodeBulan}</span>
              </h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Total Tagihan</span>
                  <p className="text-xl font-black text-emerald-950">
                    Rp {selectedIuranToPay.nominal.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-right text-[11px] text-emerald-800">
                  <span className="font-bold">{selectedIuranToPay.blokRumah} No. {selectedIuranToPay.nomorRumah}</span>
                  <span className="block text-[10px] text-emerald-700">{selectedIuranToPay.namaWarga}</span>
                </div>
              </div>

              {/* Method choice */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Pilih Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMetodeBayar('QRIS')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      metodeBayar === 'QRIS'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    QRIS RT 04
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetodeBayar('Transfer Bank')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      metodeBayar === 'Transfer Bank'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Transfer Bank
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetodeBayar('Tunai')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      metodeBayar === 'Tunai'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Tunai ke RT
                  </button>
                </div>
              </div>

              {/* QRIS Display simulation */}
              {metodeBayar === 'QRIS' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                  <div className="w-36 h-36 bg-white p-2 border-2 border-slate-800 rounded-xl mx-auto flex items-center justify-center shadow-xs">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-800">Scan QRIS Kas RT 04 Griya Asri</p>
                  <p className="text-[10px] text-slate-500">Mendukung GoPay, OVO, Dana, BCA, Mandiri, dsb.</p>
                </div>
              )}

              {metodeBayar === 'Transfer Bank' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-800">Rekening Kas Pengurus RT 04:</p>
                  <p className="font-mono text-indigo-700 font-bold text-sm">BCA: 8820-1944-01</p>
                  <p className="text-[11px] text-slate-500">a.n. Kas Paguyuban Warga RT 04</p>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor Referensi / Catatan Bukti Transfer
                </label>
                <input
                  type="text"
                  required
                  value={buktiRef}
                  onChange={(e) => setBuktiRef(e.target.value)}
                  placeholder="Misal: TRF-BCA-98214"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Konfirmasi Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
