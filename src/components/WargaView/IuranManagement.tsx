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
  Bell,
  Send,
  MessageSquare,
  AlertTriangle,
  History,
  Sparkles,
} from 'lucide-react';
import { IuranItem, StatusBayar, NotifikasiSimulasi } from '../../types/rbac';
import { ModalSimulasiNotifikasi } from '../ModalSimulasiNotifikasi';

export const IuranManagement: React.FC = () => {
  const {
    iuranList,
    currentUser,
    bayarIuranSendiri,
    verifikasiIuran,
    canExecute,
    infoPerumahan,
    notifikasiList,
    kirimPengingatIuranJatuhTempo,
    kirimPengingatIuranMassal,
  } = useRBAC();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StatusBayar>('all');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedIuranToPay, setSelectedIuranToPay] = useState<IuranItem | null>(null);

  const [metodeBayar, setMetodeBayar] = useState<'QRIS' | 'Transfer Bank' | 'Tunai'>('QRIS');
  const [buktiRef, setBuktiRef] = useState('');

  // Notification Simulation States
  const [activeSimulasiNotif, setActiveSimulasiNotif] = useState<NotifikasiSimulasi | null>(null);
  const [isSimulasiModalOpen, setIsSimulasiModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRiwayatNotifikasi, setShowRiwayatNotifikasi] = useState(false);

  const isAdmin = currentUser.role === 'admin';

  // Find user's own home dues
  const myDues = iuranList.filter(
    (i) => i.blokRumah === currentUser.blokRumah && i.nomorRumah === currentUser.nomorRumah
  );

  const unpaidDuesCount = iuranList.filter((i) => i.statusBayar !== 'Lunas').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendJatuhTempoNotification = (iuran: IuranItem) => {
    kirimPengingatIuranJatuhTempo(iuran.id);
    const generatedNotif = notifikasiList.find((n) => n.meta?.iuranId === iuran.id) || {
      id: `notif_${Date.now()}`,
      targetWargaNama: iuran.namaWarga,
      targetRumah: `${iuran.blokRumah} No. ${iuran.nomorRumah}`,
      targetNoHp: '+62 812-3456-7890',
      tipe: 'iuran_jatuh_tempo' as const,
      judul: `Pemberitahuan Jatuh Tempo: ${iuran.jenisIuran}`,
      pesan: `Pemberitahuan dari Pengurus RT 38 / RW 09 Griyo Taman Asri: Tagihan ${iuran.jenisIuran} periode ${iuran.periodeBulan} sebesar Rp ${iuran.nominal.toLocaleString('id-ID')} untuk kediaman ${iuran.blokRumah} No. ${iuran.nomorRumah} telah JATUH TEMPO. Mohon segera melakukan pembayaran via QRIS / Rekening Kas RT pada Portal SIM-Warga. Terima kasih atas partisipasi aktif Anda.`,
      timestamp: new Date().toISOString(),
      statusKirim: 'terkirim' as const,
      channel: 'WhatsApp Web Simulator' as const,
      meta: {
        iuranId: iuran.id,
        nominal: iuran.nominal,
        periode: iuran.periodeBulan,
      },
    };
    setActiveSimulasiNotif(generatedNotif);
    setIsSimulasiModalOpen(true);
    showToast(`✓ Simulasi pengingat jatuh tempo berhasil dikirim ke ${iuran.namaWarga}!`);
  };

  const handleSendMassalNotification = () => {
    const count = kirimPengingatIuranMassal();
    if (count > 0) {
      const latest = notifikasiList[0] || null;
      if (latest) {
        setActiveSimulasiNotif(latest);
        setIsSimulasiModalOpen(true);
      }
      showToast(`✓ Berhasil mengirim simulasi pengingat jatuh tempo ke ${count} warga!`);
    } else {
      showToast('Seluruh warga sudah lunas, tidak ada tagihan jatuh tempo!');
    }
  };

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
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

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

      {/* ADMIN: Sistem Pengiriman Notifikasi Jatuh Tempo Simulasi WhatsApp */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500 text-white shadow-2xs">
                <Bell className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-sm text-slate-900">
                Sistem Pengiriman Notifikasi Jatuh Tempo (Simulasi WhatsApp / SMS)
              </h3>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                {unpaidDuesCount} Tagihan Belum Lunas
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Kirimkan simulasi pemberitahuan resmi pengingat iuran jatuh tempo (jatuh tempo tgl 10 tiap bulan) ke WhatsApp/SMS warga.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSendMassalNotification}
              disabled={unpaidDuesCount === 0}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Pengingat ke {unpaidDuesCount} Warga Menunggak</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRiwayatNotifikasi(!showRiwayatNotifikasi)}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>{showRiwayatNotifikasi ? 'Tutup Riwayat' : 'Riwayat Notifikasi'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Riwayat Notifikasi Tagihan Drawer Panel */}
      {isAdmin && showRiwayatNotifikasi && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-emerald-600" />
              <span>Riwayat Pengiriman Notifikasi Tagihan & Jatuh Tempo (Simulasi)</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-semibold">
              Total {notifikasiList.filter((n) => n.tipe === 'iuran_jatuh_tempo').length} Log Notifikasi
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {notifikasiList
              .filter((n) => n.tipe === 'iuran_jatuh_tempo')
              .map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{notif.targetWargaNama}</span>
                      <span className="text-[10px] text-slate-500">({notif.targetRumah})</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                        {notif.channel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">{notif.pesan}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(notif.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSimulasiNotif(notif);
                        setIsSimulasiModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Buka Pratinjau
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* WARGA VIEW: Overdue Warning Alert if user has unpaid dues */}
      {!isAdmin && myDues.some((d) => d.statusBayar !== 'Lunas') && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-amber-950 text-sm">
                Peringatan: Tagihan Iuran Anda Telah Jatuh Tempo
              </p>
              <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
                Pengurus {infoPerumahan.rtRw} telah mengirimkan notifikasi simulasi ke nomor terdaftar Anda. Pembayaran jatuh tempo setiap tanggal 10. Mohon segera selesaikan iuran untuk kelancaran operasional kompleks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const latest = notifikasiList.find((n) => n.tipe === 'iuran_jatuh_tempo') || null;
                if (latest) {
                  setActiveSimulasiNotif(latest);
                  setIsSimulasiModalOpen(true);
                }
              }}
              className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
              <span>Lihat Pesan Notifikasi WA RT</span>
            </button>
          </div>
        </div>
      )}

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
                        <div className="space-y-0.5">
                          <span className="text-amber-800 font-bold block text-[10px]">
                            Jatuh tempo: 10 {item.periodeBulan.split(' ')[0]}
                          </span>
                          {item.terakhirNotifikasiJatuhTempo ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              <Bell className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Notif WA Terkirim</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[10px]">Belum bayar</span>
                          )}
                        </div>
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

                        {/* Send Notification Button (WhatsApp Simulation) */}
                        {item.statusBayar !== 'Lunas' && isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleSendJatuhTempoNotification(item)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="Kirim Simulasi Notifikasi Pengingat Jatuh Tempo ke Warga (WhatsApp)"
                          >
                            <Bell className="w-3 h-3 text-emerald-600 animate-pulse" />
                            <span className="hidden sm:inline">Ingatkan WA</span>
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
                    QRIS RT 38
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
                  <p className="text-[11px] font-bold text-slate-800">Scan QRIS Kas RT 38 Griyo Taman Asri</p>
                  <p className="text-[10px] text-slate-500">Mendukung GoPay, OVO, Dana, BCA, Mandiri, dsb.</p>
                </div>
              )}

              {metodeBayar === 'Transfer Bank' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-800">Rekening Kas Pengurus RT 38:</p>
                  <p className="font-mono text-indigo-700 font-bold text-sm">BCA: 8820-1944-01</p>
                  <p className="text-[11px] text-slate-500">a.n. Kas Paguyuban Warga RT 38 Sepanjang</p>
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

      {/* Modal Simulasi Notifikasi Warga */}
      <ModalSimulasiNotifikasi
        isOpen={isSimulasiModalOpen}
        onClose={() => setIsSimulasiModalOpen(false)}
        notifikasi={activeSimulasiNotif}
        onKirimUlang={() => {
          if (activeSimulasiNotif?.meta?.iuranId) {
            kirimPengingatIuranJatuhTempo(activeSimulasiNotif.meta.iuranId);
          }
        }}
      />
    </div>
  );
};
