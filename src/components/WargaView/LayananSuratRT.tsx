import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  FileCheck2,
  Plus,
  Check,
  X,
  Printer,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Stamp,
  Download,
  Lock,
} from 'lucide-react';
import { SuratItem, JenisSuratPengantar } from '../../types/rbac';

export const LayananSuratRT: React.FC = () => {
  const {
    suratList,
    currentUser,
    ajukanSurat,
    prosesSuratRT,
    canExecute,
    infoPerumahan,
  } = useRBAC();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [viewingLetter, setViewingLetter] = useState<SuratItem | null>(null);

  // Form states
  const [jenisSurat, setJenisSurat] = useState<JenisSuratPengantar>('Surat Keterangan Domisili');
  const [keperluan, setKeperluan] = useState('');

  const isAdmin = currentUser.role === 'admin';

  const jenisSuratOptions: JenisSuratPengantar[] = [
    'Surat Keterangan Domisili',
    'Surat Pengantar SKCK',
    'Surat Pengantar Pembuatan KTP/KK',
    'Surat Keterangan Usaha (SKU)',
    'Surat Izin Acara / Keramaian',
  ];

  const handleOpenApplyModal = () => {
    if (!canExecute('surat:request', 'Mengajukan Surat Pengantar RT Online', 'Layanan Surat RT')) return;
    setJenisSurat('Surat Keterangan Domisili');
    setKeperluan('');
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keperluan.trim()) {
      alert('Mohon cantumkan keperluan pengajuan surat!');
      return;
    }
    ajukanSurat({ jenisSurat, keperluan });
    setIsApplyModalOpen(false);
  };

  const handleApprove = (surat: SuratItem) => {
    if (!canExecute('surat:approve', 'Menandatangani & Menerbitkan Surat Resmi RT', 'Layanan Surat RT')) return;
    prosesSuratRT(surat.id, true);
  };

  const handleReject = (surat: SuratItem) => {
    if (!canExecute('surat:approve', 'Menolak Permohonan Surat RT', 'Layanan Surat RT')) return;
    const alasan = prompt('Alasan penolakan permohonan surat:');
    if (alasan) {
      prosesSuratRT(surat.id, false, alasan);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Layanan Surat Pengantar Resmi Rukun Tetangga (RT)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              Pelayanan Online
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Warga dapat mengajukan Surat Keterangan Domisili, Pengantar SKCK, KTP, atau Usaha secara digital tanpa antre. Pengesahan nomor resmi dilakukan oleh Ketua RT.
          </p>
        </div>

        <button
          onClick={handleOpenApplyModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajukan Surat Pengantar Baru</span>
        </button>
      </div>

      {/* Letters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suratList.map((surat) => {
          const isMyRequest =
            surat.blokRumah === currentUser.blokRumah && surat.nomorRumah === currentUser.nomorRumah;
          const isApproved = surat.status === 'Disetujui / Terbit';
          const isPending = surat.status === 'Menunggu Validasi RT';

          return (
            <div
              key={surat.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-2.5">
                {/* Status & Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : isPending
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {isApproved ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : isPending ? (
                      <Clock className="w-3 h-3 text-amber-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-rose-600" />
                    )}
                    <span>{surat.status}</span>
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">
                    Diajukan: {surat.tanggalPengajuan}
                  </span>
                </div>

                {/* Title & Official No */}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {surat.jenisSurat}
                  </h3>
                  {surat.nomorSuratResmi ? (
                    <div className="inline-block mt-1 font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      No: {surat.nomorSuratResmi}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic block mt-1">
                      Nomor resmi akan diterbitkan Ketua RT saat disetujui.
                    </span>
                  )}
                </div>

                {/* Purpose */}
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  "{surat.keperluan}"
                </p>

                {surat.catatanAdmin && (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                    Catatan RT: {surat.catatanAdmin}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{surat.namaPemohon}</span>
                  <span className="text-[11px] text-slate-500 block">
                    {surat.blokRumah} No. {surat.nomorRumah}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* View / Print letterhead button */}
                  {isApproved && (
                    <button
                      onClick={() => setViewingLetter(surat)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      title="Lihat Format Kertas Kop Surat Resmi RT"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Cetak Surat</span>
                    </button>
                  )}

                  {/* Admin Approval Buttons */}
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleReject(surat)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isAdmin
                            ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                            : 'text-slate-300 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title={isAdmin ? 'Tolak Pengajuan' : 'Tolak (Khusus Pengurus RT - Tes 403)'}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleApprove(surat)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                          isAdmin
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-400 hover:bg-rose-100 hover:text-rose-700'
                        }`}
                        title={
                          isAdmin
                            ? 'Terbitkan & Tanda Tangani Surat Resmi RT'
                            : 'Terbitkan Surat (Khusus Pengurus RT - Coba klik untuk tes 403)'
                        }
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isAdmin ? 'Sahkan Surat' : 'Sahkan (Tes 403)'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Ajukan Surat Pengantar */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <span>Formulir Pengajuan Surat Pengantar RT</span>
              </h3>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-950 space-y-1">
                <span className="font-bold">Data Pemohon Terisi Otomatis:</span>
                <p className="text-[11px] text-indigo-800">
                  {currentUser.name} ({currentUser.blokRumah} No. {currentUser.nomorRumah})
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Jenis Surat</label>
                <select
                  value={jenisSurat}
                  onChange={(e) => setJenisSurat(e.target.value as JenisSuratPengantar)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:border-indigo-500 focus:outline-hidden"
                >
                  {jenisSuratOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keperluan / Maksud Pembuatan Surat
                </label>
                <textarea
                  required
                  rows={3}
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  placeholder="Jelaskan untuk instansi apa surat ini ditujukan, misalnya perpanjangan SKCK di Polsek, pembuatan rekening bank, izin domisili usaha..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Kirim Permohonan ke RT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Printable Official Letterhead (KOP SURAT RT) */}
      {viewingLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Pratinjau Surat Resmi RT 04 (Format Cetak)</h3>
              </div>
              <button
                onClick={() => setViewingLetter(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Letter Document Content */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-900 font-serif leading-relaxed">
              {/* Kop Surat */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h2 className="text-lg font-black tracking-wider uppercase font-sans">
                  PENGURUS RUKUN TETANGGA 04 / RUKUN WARGA 09
                </h2>
                <h3 className="text-base font-extrabold uppercase font-sans text-slate-800">
                  {infoPerumahan.namaPerumahan.toUpperCase()}
                </h3>
                <p className="text-xs text-slate-600 font-sans">
                  Kelurahan {infoPerumahan.kelurahan}, Kecamatan {infoPerumahan.kecamatan}, {infoPerumahan.kota}
                </p>
              </div>

              {/* Title & Nomor */}
              <div className="text-center space-y-1 pt-2">
                <h4 className="font-extrabold text-base uppercase underline font-sans">
                  {viewingLetter.jenisSurat}
                </h4>
                <p className="text-xs font-mono font-bold text-slate-700">
                  Nomor: {viewingLetter.nomorSuratResmi}
                </p>
              </div>

              {/* Body */}
              <p className="text-xs">
                Yang bertanda tangan di bawah ini, Ketua Rukun Tetangga (RT) 04 / RW 09 Kelurahan {infoPerumahan.kelurahan}, dengan ini menerangkan bahwa:
              </p>

              <div className="px-6 space-y-1.5 text-xs">
                <div className="grid grid-cols-3">
                  <span className="text-slate-600">Nama Lengkap</span>
                  <span className="col-span-2 font-bold">: {viewingLetter.namaPemohon}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-600">NIK Kependudukan</span>
                  <span className="col-span-2 font-mono font-semibold">: {viewingLetter.nikPemohon}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-600">Alamat Rumah</span>
                  <span className="col-span-2 font-medium">
                    : {viewingLetter.blokRumah} No. {viewingLetter.nomorRumah}, {infoPerumahan.namaPerumahan}
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-600">Maksud / Keperluan</span>
                  <span className="col-span-2 font-medium">: {viewingLetter.keperluan}</span>
                </div>
              </div>

              <p className="text-xs">
                Adalah benar yang bersangkutan merupakan warga sah yang berdomisili di lingkungan perumahan kami dan berkelakuan baik. Surat pengantar ini diterbitkan untuk dipergunakan sebagaimana mestinya.
              </p>

              {/* Signature section */}
              <div className="pt-6 flex justify-between text-xs font-sans">
                <div className="text-center space-y-16">
                  <p>Pemohon,</p>
                  <p className="font-bold underline">{viewingLetter.namaPemohon}</p>
                </div>
                <div className="text-center space-y-16">
                  <p>Depok, {viewingLetter.tanggalSelesai || viewingLetter.tanggalPengajuan}<br />Ketua RT 04 / RW 09,</p>
                  <div className="relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-emerald-600/40 text-emerald-800 text-[9px] font-bold flex items-center justify-center rotate-12 pointer-events-none">
                      STEMPEL RT 04
                    </div>
                    <p className="font-bold underline">Ir. Budi Santoso, M.Sc.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setViewingLetter(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 text-xs font-semibold hover:bg-white"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Dokumen</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
