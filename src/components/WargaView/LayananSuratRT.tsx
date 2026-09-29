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
  Sparkles,
  Sliders,
  FileText,
  Copy,
  Wand2,
  RefreshCw,
  QrCode,
  CheckCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { SuratItem } from '../../types/rbac';
import { EditKopRTModal } from '../EditKopRTModal';
import { JenisSuratManagerModal } from '../JenisSuratManagerModal';

export const LayananSuratRT: React.FC = () => {
  const {
    suratList,
    wargaList,
    jenisSuratList,
    currentUser,
    ajukanSurat,
    prosesSuratRT,
    generateDrafSuratAI,
    canExecute,
    infoPerumahan,
  } = useRBAC();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isKopModalOpen, setIsKopModalOpen] = useState(false);
  const [isJenisSuratModalOpen, setIsJenisSuratModalOpen] = useState(false);
  const [viewingLetter, setViewingLetter] = useState<SuratItem | null>(null);
  const [selectedAIReviewSurat, setSelectedAIReviewSurat] = useState<SuratItem | null>(null);

  // Form states for new application
  const [selectedJenisSuratId, setSelectedJenisSuratId] = useState(jenisSuratList[0]?.nama || 'Surat Keterangan Domisili');
  const [keperluan, setKeperluan] = useState('');
  const [isGeneratingAIDraft, setIsGeneratingAIDraft] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const isAdmin = currentUser.role === 'admin';

  const activeJenisSurat = jenisSuratList.filter((j) => j.aktif);
  const currentJenisConfig = jenisSuratList.find((j) => j.nama === selectedJenisSuratId);

  const handleOpenApplyModal = () => {
    if (!canExecute('surat:request', 'Mengajukan Surat Pengantar RT Online', 'Layanan Surat RT')) return;
    setSelectedJenisSuratId(activeJenisSurat[0]?.nama || 'Surat Keterangan Domisili');
    setKeperluan('');
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keperluan.trim()) {
      alert('Mohon cantumkan keperluan pengajuan surat!');
      return;
    }

    ajukanSurat({
      jenisSurat: selectedJenisSuratId,
      keperluan,
    });
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

  const handleRunAICounsel = async (surat: SuratItem) => {
    setIsGeneratingAIDraft(true);
    try {
      await generateDrafSuratAI(surat.id);
    } catch (err) {
      console.warn('AI assistance notice:', err);
    } finally {
      setIsGeneratingAIDraft(false);
    }
  };

  const handleCopyAIDraft = (text?: string) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  // Filter letters
  const filteredSurat = suratList.filter((s) => {
    const matchesSearch =
      s.namaPemohon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.jenisSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.keperluan.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'pending') return s.status === 'Menunggu Validasi RT';
    if (filterStatus === 'approved') return s.status === 'Disetujui / Terbit';
    if (filterStatus === 'rejected') return s.status === 'Ditolak';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Admin Management Shortcuts */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Layanan Surat Pengantar Resmi Rukun Tetangga (RT)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              Pelayanan Digital
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Pengajuan dan penerbitan Surat Pengantar KTP, KK, Domisili, SKCK, dan Usaha secara terintegrasi dengan pendampingan kecerdasan buatan (Gemini AI) untuk draf birokrasi baku dan pengecekan kelayakan berkas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Admin Tools: Edit KOP RT */}
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setIsKopModalOpen(true)}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                title="Edit KOP Surat Resmi RT"
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Edit KOP RT</span>
              </button>

              <button
                type="button"
                onClick={() => setIsJenisSuratModalOpen(true)}
                className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-200"
                title="Kelola Jenis & Syarat Template Surat"
              >
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Kelola Jenis Surat</span>
              </button>

              <button
                type="button"
                onClick={() => setIsKopModalOpen(true)}
                className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-200"
                title="Atur Tata Naskah & Format Aturan Persuratan RT"
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Atur Format Surat</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleOpenApplyModal}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-700/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajukan Surat Baru</span>
          </button>
        </div>
      </div>

      {/* AI COMPANION SHOWCASE: Contoh Pendampingan AI pada Surat yang Dikerjakan */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-5 sm:p-6 text-white border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Contoh Pendampingan AI pada Surat yang Dikerjakan
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Fitur Cerdas Gemini AI
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                AI secara otomatis menyusun naskah surat resmi berbahasa birokrasi baku, menyempurnakan keperluan warga, dan memverifikasi kelayakan kependudukan.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Interactive Cards Demonstrating AI Companion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
          {suratList.slice(0, 3).map((sampleSurat, idx) => (
            <div
              key={sampleSurat.id}
              onClick={() => setSelectedAIReviewSurat(sampleSurat)}
              className="bg-slate-900/80 hover:bg-slate-900 border border-indigo-500/30 hover:border-amber-400/60 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-indigo-300 font-bold bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                    Contoh #{idx + 1}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Didampingi AI</span>
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                    {sampleSurat.jenisSurat}
                  </h4>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Pemohon: <strong>{sampleSurat.namaPemohon}</strong> ({sampleSurat.blokRumah}-{sampleSurat.nomorRumah})
                  </p>
                </div>

                {/* AI Polish Snippet */}
                <div className="p-2.5 bg-indigo-950/60 rounded-xl border border-indigo-800/50 space-y-1 text-[11px]">
                  <span className="text-[10px] font-bold text-amber-300 block uppercase">
                    Hasil Penyempurnaan AI:
                  </span>
                  <p className="text-slate-200 line-clamp-2 leading-relaxed">
                    {sampleSurat.alasanFormalAI || sampleSurat.keperluan}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-800/40 flex items-center justify-between text-[11px]">
                <span className="text-indigo-300 flex items-center gap-1 font-semibold group-hover:text-white">
                  <span>Buka Draf & Evaluasi AI</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {sampleSurat.nomorSuratResmi || 'Siap Draf'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-slate-100 rounded-2xl">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({suratList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-white text-amber-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menunggu RT ({suratList.filter((s) => s.status === 'Menunggu Validasi RT').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              filterStatus === 'approved'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Disetujui ({suratList.filter((s) => s.status === 'Disetujui / Terbit').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pemohon atau jenis surat..."
            className="w-full sm:w-64 pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
          />
        </div>
      </div>

      {/* Letters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSurat.map((surat) => {
          const isApproved = surat.status === 'Disetujui / Terbit';
          const isPending = surat.status === 'Menunggu Validasi RT';

          return (
            <div
              key={surat.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all"
            >
              <div className="space-y-3">
                {/* Status & Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isPending
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {isApproved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isPending ? (
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span>{surat.status}</span>
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">
                    Diajukan: {surat.tanggalPengajuan}
                  </span>
                </div>

                {/* Title & Official No */}
                <div>
                  <h3 className="font-black text-sm text-slate-900 leading-snug">
                    {surat.jenisSurat}
                  </h3>
                  {surat.nomorSuratResmi ? (
                    <div className="inline-block mt-1 font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                      No: {surat.nomorSuratResmi}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic block mt-1">
                      Nomor resmi akan diterbitkan Ketua RT saat disahkan.
                    </span>
                  )}
                </div>

                {/* Purpose */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Keperluan Pemohon:
                  </span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                    "{surat.keperluan}"
                  </p>
                </div>

                {/* AI Companion Preview Snippet */}
                {surat.alasanFormalAI && (
                  <div className="p-2.5 bg-indigo-50/70 border border-indigo-200/80 rounded-xl space-y-1">
                    <span className="text-[10px] font-extrabold text-indigo-900 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Pendampingan Redaksi Formal AI:</span>
                    </span>
                    <p className="text-[11px] text-indigo-950 font-medium leading-relaxed">
                      "{surat.alasanFormalAI}"
                    </p>
                  </div>
                )}

                {surat.catatanAdmin && (
                  <p className="text-[11px] text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <strong>Catatan RT:</strong> {surat.catatanAdmin}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-slate-900">{surat.namaPemohon}</span>
                  <span className="text-[11px] text-slate-500 block">
                    {surat.blokRumah} No. {surat.nomorRumah}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* AI Assistant Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedAIReviewSurat(surat)}
                    className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Buka Pendampingan & Draf AI"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Draf AI</span>
                  </button>

                  {/* View / Print letterhead button */}
                  {isApproved && (
                    <button
                      type="button"
                      onClick={() => setViewingLetter(surat)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                      title="Lihat Format Kertas Kop Surat Resmi RT"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Surat</span>
                    </button>
                  )}

                  {/* Admin Approval Buttons */}
                  {isPending && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleReject(surat)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title={isAdmin ? 'Tolak Pengajuan' : 'Tolak (Khusus Pengurus RT)'}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApprove(surat)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isAdmin
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-500 hover:bg-rose-100 hover:text-rose-700'
                        }`}
                        title={
                          isAdmin
                            ? 'Terbitkan & Tanda Tangani Surat Resmi RT'
                            : 'Terbitkan Surat (Khusus Pengurus RT)'
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

      {/* MODAL: Ajukan Surat Pengantar Baru */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-slate-800 my-auto">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-300" />
                <span>Formulir Pengajuan Surat Pengantar RT Online</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-indigo-950 space-y-1">
                <span className="font-bold">Identitas Pemohon (Otomatis):</span>
                <p className="text-[11px] text-indigo-800">
                  {currentUser.name} • {currentUser.blokRumah} No. {currentUser.nomorRumah} ({infoPerumahan.namaPerumahan})
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Jenis Surat Pengantar *</label>
                <select
                  value={selectedJenisSuratId}
                  onChange={(e) => setSelectedJenisSuratId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                >
                  {activeJenisSurat.map((opt) => (
                    <option key={opt.id} value={opt.nama}>
                      {opt.nama} ({opt.kode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Requirements Helper */}
              {currentJenisConfig && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      Syarat Dokumen Diperlukan:
                    </span>
                    <span className="text-[10px] text-indigo-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Estimasi: {currentJenisConfig.estimasiProses}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentJenisConfig.persyaratan.map((req, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{req}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    Maksud / Keperluan Pengajuan *
                  </label>
                  <span className="text-[10px] text-slate-400">Jelaskan instansi tujuan</span>
                </div>
                <textarea
                  required
                  rows={3}
                  value={keperluan}
                  onChange={(e) => setKeperluan(e.target.value)}
                  placeholder="Contoh: Kelengkapan berkas administrasi melamar pekerjaan BUMN di Polsek..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-500 focus:outline-hidden text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Kirim Permohonan ke Pengurus RT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AI COMPANION & DRAFT DETAIL */}
      {selectedAIReviewSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-teal-950 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-sm">
                    Asisten & Pendampingan AI: {selectedAIReviewSurat.jenisSurat}
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    Pemohon: {selectedAIReviewSurat.namaPemohon} ({selectedAIReviewSurat.blokRumah}-{selectedAIReviewSurat.nomorRumah})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAIReviewSurat(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Resident Original Text vs AI Formal Polish */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Keperluan yang Ditulis Warga:
                  </span>
                  <p className="text-xs text-slate-700 italic">
                    "{selectedAIReviewSurat.keperluan}"
                  </p>
                </div>

                <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Bahasa Baku Birokrasi (Polesan AI):</span>
                    </span>
                  </div>
                  <p className="text-xs text-indigo-950 font-semibold leading-relaxed">
                    "{selectedAIReviewSurat.alasanFormalAI || selectedAIReviewSurat.keperluan}"
                  </p>
                </div>
              </div>

              {/* Full Official Draft generated by AI */}
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Draf Naskah Surat Resmi Hasil Pendampingan AI:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyAIDraft(selectedAIReviewSurat.drafSuratAI)}
                    className="text-[11px] text-slate-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedDraft ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDraft ? 'Tersalin!' : 'Salin Naskah'}</span>
                  </button>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl font-serif text-xs text-slate-800 leading-relaxed shadow-inner">
                  {selectedAIReviewSurat.drafSuratAI || (
                    <span className="text-slate-400 italic font-sans">
                      Draf AI belum digenerate untuk permohonan ini. Klik tombol di bawah untuk meminta Gemini AI menyusun naskah surat otomatis.
                    </span>
                  )}
                </div>
              </div>

              {/* AI Verification & Audit Note for Admin */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-1.5">
                <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Catatan Pendampingan & Rekomendasi Verifikasi AI:</span>
                </span>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {selectedAIReviewSurat.catatanAI ||
                    '✅ Analisis AI: Berkas permohonan warga telah dicocokkan dengan data registrasi KK RT 04. Tidak ditemukan catatan penolakan sebelumnya.'}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                <button
                  type="button"
                  disabled={isGeneratingAIDraft}
                  onClick={() => handleRunAICounsel(selectedAIReviewSurat)}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAIDraft ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingAIDraft ? 'Gemini AI Sedang Menulis...' : 'Generate Ulang dengan AI'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAIReviewSurat(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                  >
                    Tutup
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewingLetter(selectedAIReviewSurat);
                      setSelectedAIReviewSurat(null);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Format KOP Resmi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Printable Official Letterhead (TATA NASKAH DINAS SURAT RESMI RT) */}
      {viewingLetter && (() => {
        const pemohonWarga = wargaList.find(
          (w) => w.id === viewingLetter.wargaId || w.nik === viewingLetter.nikPemohon
        );

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto max-h-[94vh] flex flex-col">
              <div className="print:hidden px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-sm">Pratinjau Surat Resmi RT (Standar Tata Naskah Dinas)</h3>
                    <p className="text-[11px] text-slate-300">
                      Format sesuai Permendagri & Administrasi Persuratan RT/RW
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Surat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingLetter(null)}
                    className="p-1 rounded-lg text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Letter Document Content - Authentic Indonesian Official Paper Layout */}
              <div className="p-8 sm:p-12 overflow-y-auto space-y-5 text-slate-900 font-serif leading-relaxed bg-white text-xs">
                {/* 1. Official Header (KOP RESMI RT Standar Tata Naskah Dinas) */}
                <div className="relative pb-3 text-center">
                  <div className="flex items-center justify-between gap-4">
                    {/* Logo Kiri (Garuda / Pemda) */}
                    <div className="w-20 h-20 flex items-center justify-center shrink-0">
                      {infoPerumahan.logoResmiKiri ? (
                        <img
                          src={infoPerumahan.logoResmiKiri}
                          alt="Logo Resmi Kiri"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full border border-slate-300 flex items-center justify-center text-[8px] font-sans">
                          LOGO
                        </div>
                      )}
                    </div>

                    {/* Center Typography */}
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                        {infoPerumahan.headerBaris1 || `PEMERINTAH ${infoPerumahan.kota.toUpperCase()}`}
                      </h4>
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                        {infoPerumahan.headerBaris2 || `KECAMATAN ${infoPerumahan.kecamatan.toUpperCase()} - KELURAHAN ${infoPerumahan.kelurahan.toUpperCase()}`}
                      </h4>
                      <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-950 font-sans">
                        {infoPerumahan.headerBaris3 || `RUKUN TETANGGA ${infoPerumahan.rtRw.split('/')[0]?.trim()} / RUKUN WARGA ${infoPerumahan.rtRw.split('/')[1]?.trim()}`}
                      </h2>
                      <h3 className="text-xs sm:text-sm font-extrabold uppercase text-emerald-900 font-sans">
                        {infoPerumahan.headerBaris4 || infoPerumahan.namaPerumahan.toUpperCase()}
                      </h3>
                      <p className="text-[10px] text-slate-600 font-sans leading-tight pt-0.5">
                        Sekretariat: {infoPerumahan.alamatSekretariat}, Kode Pos: {infoPerumahan.kodePos}
                      </p>
                      <p className="text-[10px] text-slate-500 font-sans">
                        Telp / WhatsApp: {infoPerumahan.hotlineRT} {infoPerumahan.emailRT ? `• Email: ${infoPerumahan.emailRT}` : ''}
                      </p>
                    </div>

                    {/* Logo Kanan (Kompleks / RT) */}
                    <div className="w-20 h-20 flex items-center justify-center shrink-0">
                      {infoPerumahan.logoResmiKanan ? (
                        <img
                          src={infoPerumahan.logoResmiKanan}
                          alt="Logo Resmi Kanan"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="w-20 h-20" />
                      )}
                    </div>
                  </div>

                  {/* Garis Pembatas Sesuai Setting Resmi Kop */}
                  <div className="pt-3">
                    {infoPerumahan.kopBorderType === 'single' ? (
                      <div className="h-[2px] bg-slate-900 w-full" />
                    ) : infoPerumahan.kopBorderType === 'ornament' ? (
                      <div className="flex items-center gap-2 py-1">
                        <div className="h-[1.5px] bg-slate-900 flex-1" />
                        <span className="text-[10px] text-slate-800 font-serif">❖ ❖ ❖</span>
                        <div className="h-[1.5px] bg-slate-900 flex-1" />
                      </div>
                    ) : (
                      <div className="space-y-[2px]">
                        <div className="h-[2.5px] bg-slate-900 w-full" />
                        <div className="h-[1px] bg-slate-900 w-full" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Metadata Surat (Nomor, Sifat, Lampiran, Perihal, & Tujuan) */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-start justify-between gap-4 font-sans text-xs">
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-semibold text-slate-600">Nomor</span>
                      <span className="col-span-2 font-mono font-bold text-slate-950">
                        : {viewingLetter.nomorSuratResmi || '470 / 024 / RT.04-RW.09 / IX / 2026'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-semibold text-slate-600">Sifat</span>
                      <span className="col-span-2 font-medium text-slate-800">
                        : {viewingLetter.sifatSurat || 'Biasa'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-semibold text-slate-600">Lampiran</span>
                      <span className="col-span-2 text-slate-800">
                        : {viewingLetter.lampiran || '-'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="font-semibold text-slate-600">Perihal</span>
                      <span className="col-span-2 font-bold text-slate-950 underline">
                        : {viewingLetter.jenisSurat}
                      </span>
                    </div>
                  </div>

                  {/* Alamat Tujuan Instansi */}
                  <div className="text-left sm:text-right font-sans space-y-0.5">
                    <p className="font-semibold text-slate-500 text-[11px]">Kepada Yang Terhormat:</p>
                    <p className="font-extrabold text-slate-900 text-xs">
                      {infoPerumahan.instansiTujuanDefault || `Bapak / Ibu Lurah ${infoPerumahan.kelurahan}`}
                    </p>
                    <p className="text-slate-600 text-[11px]">Kecamatan {infoPerumahan.kecamatan}</p>
                    <p className="text-slate-600 text-[11px]">di - Tempat</p>
                  </div>
                </div>

                {/* 3. Judul Tengah Naskah Dinas */}
                <div className="text-center space-y-1 pt-2">
                  <h3 className="font-black text-sm uppercase underline tracking-wider font-sans">
                    {viewingLetter.jenisSurat}
                  </h3>
                  <p className="text-[11px] font-mono font-bold text-slate-700">
                    Nomor: {viewingLetter.nomorSuratResmi || '470 / 024 / RT.04-RW.09 / IX / 2026'}
                  </p>
                </div>

                {/* 4. Kalimat Pembuka Resmi */}
                <p className="text-xs leading-relaxed text-justify indent-8">
                  Yang bertanda tangan di bawah ini, Ketua Rukun Tetangga (RT) {infoPerumahan.rtRw} Kelurahan {infoPerumahan.kelurahan}, Kecamatan {infoPerumahan.kecamatan}, {infoPerumahan.kota}, Provinsi {infoPerumahan.provinsi || 'Jawa Barat'}, dengan ini menerangkan bahwa:
                </p>

                {/* 5. Tabel Identitas Pemohon Sesuai Isian Kartu Keluarga (KK) */}
                <div className="px-3 sm:px-6 space-y-1.5 text-xs font-sans">
                  <div className="grid grid-cols-3 py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">1. Nama Lengkap</span>
                    <span className="col-span-2 font-bold uppercase text-slate-950">
                      : {viewingLetter.namaPemohon}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">2. NIK (Kependudukan)</span>
                    <span className="col-span-2 font-mono font-bold text-slate-900">
                      : {viewingLetter.nikPemohon}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">3. Nomor Kartu Keluarga (No. KK)</span>
                    <span className="col-span-2 font-mono font-semibold text-slate-900">
                      : {pemohonWarga?.noKK || viewingLetter.noKKPemohon || '3276012809050001'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">4. Tempat, Tanggal Lahir</span>
                    <span className="col-span-2 text-slate-900">
                      : {pemohonWarga?.tempatLahir || 'Depok'}, {pemohonWarga?.tanggalLahir || '1985-05-12'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">5. Jenis Kelamin</span>
                    <span className="col-span-2 text-slate-900">
                      : {pemohonWarga?.jenisKelamin || viewingLetter.jenisKelaminPemohon || 'Laki-laki'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">6. Kewarganegaraan / Agama</span>
                    <span className="col-span-2 text-slate-900">
                      : {pemohonWarga?.kewarganegaraan || 'WNI'} / {pemohonWarga?.agama || 'Islam'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">7. Pekerjaan / Pendidikan</span>
                    <span className="col-span-2 text-slate-900">
                      : {pemohonWarga?.pekerjaan || viewingLetter.pekerjaanPemohon || 'Karyawan Swasta'} ({pemohonWarga?.pendidikan || 'Diploma IV / Strata I'})
                    </span>
                  </div>

                  <div className="grid grid-cols-3 py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">8. Status Perkawinan</span>
                    <span className="col-span-2 text-slate-900">
                      : {pemohonWarga?.statusPernikahan || 'Kawin Tercatat'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 py-0.5 border-b border-slate-100">
                    <span className="text-slate-600">9. Alamat KTP</span>
                    <span className="col-span-2 text-slate-800">
                      : {pemohonWarga?.alamatKtp || `${infoPerumahan.namaPerumahan} ${viewingLetter.blokRumah} No. ${viewingLetter.nomorRumah}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 py-0.5">
                    <span className="text-slate-600">10. Alamat Domisili Sekarang</span>
                    <span className="col-span-2 font-medium text-slate-950">
                      : {infoPerumahan.namaPerumahan} {viewingLetter.blokRumah} No. {viewingLetter.nomorRumah}, {infoPerumahan.rtRw}, Kel. {infoPerumahan.kelurahan}
                    </span>
                  </div>
                </div>

                {/* 6. Isi / Maksud Permohonan */}
                <p className="text-xs leading-relaxed text-justify indent-8">
                  Berdasarkan catatan buku induk kependudukan RT kami dan pengamatan lingkungan, nama tersebut di atas adalah benar warga penghuni sah yang berdomisili di alamat kami, berkelakuan baik, aktif bermasyarakat, serta tidak sedang tersangkut permasalahan hukum perdata maupun pidana. Surat pengantar ini diberikan untuk keperluan:
                </p>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs font-semibold text-slate-900">
                  "{viewingLetter.alasanFormalAI || viewingLetter.keperluan}"
                </div>

                {/* 7. Klausul Masa Berlaku & Penutup Baku */}
                <p className="text-xs leading-relaxed text-justify">
                  Surat pengantar ini berlaku selama <strong>{infoPerumahan.masaBerlakuHari || 30} (tiga puluh) hari kalender</strong> terhitung sejak tanggal diterbitkan. Demikian surat pengantar ini dibuat dengan sebenarnya dan penuh rasa tanggung jawab agar dapat dipergunakan sebagaimana mestinya oleh instansi yang bersangkutan.
                </p>

                {/* 8. Kolom Pengesahan Tanda Tangan Sesuai Aturan Persuratan */}
                <div className="pt-6 font-sans text-xs">
                  <div className="flex justify-end text-right pb-4">
                    <p className="text-xs font-medium">
                      {infoPerumahan.kota}, {viewingLetter.tanggalSelesai || viewingLetter.tanggalPengajuan || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Dynamic Signature Grid */}
                  <div className="flex items-start justify-between gap-6 text-center">
                    {/* Ttd Pemohon */}
                    {infoPerumahan.tampilkanTtdPemohon !== false && (
                      <div className="flex-1 space-y-16">
                        <p>Warga Pemohon,</p>
                        <p className="font-bold underline uppercase">{viewingLetter.namaPemohon}</p>
                      </div>
                    )}

                    {/* Mengetahui RW */}
                    {infoPerumahan.tampilkanKetuaRW !== false && (
                      <div className="flex-1 space-y-16">
                        <p>
                          Mengetahui,<br />
                          Ketua Rukun Warga {infoPerumahan.rtRw.split('/')[1]?.trim() || 'RW 09'},
                        </p>
                        <p className="font-bold underline">{infoPerumahan.namaKetuaRW || 'Drs. H. Mulyadi Saputra, M.M.'}</p>
                      </div>
                    )}

                    {/* Pengesahan Ketua RT */}
                    <div className="flex-1 space-y-16 relative">
                      <p>
                        Ketua Rukun Tetangga {infoPerumahan.rtRw.split('/')[0]?.trim() || 'RT 04'},
                      </p>

                      <div className="relative">
                        {/* Stempel Digital Bulat RT */}
                        {infoPerumahan.stempelResmiAktif !== false && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-indigo-600/40 text-indigo-800 text-[8px] font-bold flex items-center justify-center rotate-12 pointer-events-none bg-indigo-50/15">
                            STEMPEL RT 04
                          </div>
                        )}

                        <p className="font-bold underline text-slate-950">{infoPerumahan.namaKetuaRT}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          NIK: {infoPerumahan.nikKetuaRT || '3276011504780001'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Legal Footer Note */}
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                    <p>
                      {infoPerumahan.footerCatatanKaki || 'Surat pengantar ini sah dengan stempel digital resmi RT dan QR Code validasi keabsahan naskah dinas.'}
                    </p>
                    <div className="flex items-center gap-1 font-mono text-[9px] text-slate-400">
                      <QrCode className="w-3.5 h-3.5 text-slate-500" />
                      <span>VALID-{viewingLetter.id.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="print:hidden p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewingLetter(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 text-xs font-semibold hover:bg-white cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Surat Pengantar Resmi</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Global Modals for KOP & Jenis Surat */}
      <EditKopRTModal isOpen={isKopModalOpen} onClose={() => setIsKopModalOpen(false)} />
      <JenisSuratManagerModal isOpen={isJenisSuratModalOpen} onClose={() => setIsJenisSuratModalOpen(false)} />
    </div>
  );
};
