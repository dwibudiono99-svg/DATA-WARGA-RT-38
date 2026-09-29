import React, { useState } from 'react';
import { useRBAC } from '../context/RBACContext';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  FileCheck2,
  CheckCircle2,
  Clock,
  Check,
  AlertCircle,
  FileText,
  Tag,
  Save,
} from 'lucide-react';
import { JenisSuratConfig } from '../types/rbac';

interface JenisSuratManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JenisSuratManagerModal: React.FC<JenisSuratManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { jenisSuratList, tambahJenisSurat, updateJenisSurat, hapusJenisSurat, currentUser } = useRBAC();

  const [editingItem, setEditingItem] = useState<JenisSuratConfig | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states
  const [nama, setNama] = useState('');
  const [kode, setKode] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [persyaratanText, setPersyaratanText] = useState('');
  const [templatePembuka, setTemplatePembuka] = useState('');
  const [templatePenutup, setTemplatePenutup] = useState('');
  const [estimasiProses, setEstimasiProses] = useState('1x24 Jam');
  const [aktif, setAktif] = useState(true);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingItem(null);
    setNama('');
    setKode('');
    setDeskripsi('');
    setPersyaratanText('KTP Pemohon, Kartu Keluarga (KK), Bukti Lunas Iuran');
    setTemplatePembuka('Yang bertanda tangan di bawah ini Pengurus Rukun Tetangga (RT) menerangkan dengan sebenarnya bahwa warga atas nama tersebut adalah benar warga penghuni berdomisili di lingkungan kami.');
    setTemplatePenutup('Demikian surat pengantar ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.');
    setEstimasiProses('1x24 Jam');
    setAktif(true);
  };

  const handleStartEdit = (item: JenisSuratConfig) => {
    setIsCreatingNew(false);
    setEditingItem(item);
    setNama(item.nama);
    setKode(item.kode);
    setDeskripsi(item.deskripsi);
    setPersyaratanText(item.persyaratan.join(', '));
    setTemplatePembuka(item.templatePembuka);
    setTemplatePenutup(item.templatePenutup);
    setEstimasiProses(item.estimasiProses);
    setAktif(item.aktif);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !kode.trim()) return;

    const persyaratan = persyaratanText
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    if (isCreatingNew) {
      tambahJenisSurat({
        nama,
        kode: kode.toUpperCase(),
        deskripsi,
        persyaratan,
        templatePembuka,
        templatePenutup,
        estimasiProses,
        aktif,
      });
    } else if (editingItem) {
      updateJenisSurat(editingItem.id, {
        nama,
        kode: kode.toUpperCase(),
        deskripsi,
        persyaratan,
        templatePembuka,
        templatePenutup,
        estimasiProses,
        aktif,
      });
    }

    setIsCreatingNew(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string, namaSurat: string) => {
    if (confirm(`Yakin ingin menghapus jenis surat "${namaSurat}"? Template ini tidak akan bisa dipilih lagi oleh warga.`)) {
      hapusJenisSurat(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <FileCheck2 className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Kelola Template & Jenis Surat Pengantar RT
              </h3>
              <p className="text-xs text-indigo-200">
                Atur jenis-jenis surat yang dapat diajukan oleh warga, syarat berkas, dan template redaksi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Daftar Jenis Surat Layanan ({jenisSuratList.length} Jenis)
              </h4>
              <p className="text-slate-500 text-[11px]">
                Surat yang aktif akan langsung muncul di formulir pengajuan online warga
              </p>
            </div>

            {!isCreatingNew && !editingItem && (
              <button
                type="button"
                onClick={handleStartCreate}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Jenis Surat Baru</span>
              </button>
            )}
          </div>

          {/* Form for Create / Edit */}
          {(isCreatingNew || editingItem) && (
            <form onSubmit={handleSaveForm} className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-200">
                <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>{isCreatingNew ? 'Form Tambah Jenis Surat Baru' : `Edit Jenis Surat: ${editingItem?.nama}`}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingItem(null);
                  }}
                  className="text-slate-500 hover:text-slate-700 text-xs font-semibold"
                >
                  Tutup Form
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Surat Pengantar *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Surat Keterangan Kematian"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kode Surat *
                  </label>
                  <input
                    type="text"
                    required
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    placeholder="Contoh: SKK"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-indigo-900 focus:outline-hidden uppercase"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Deskripsi / Kegunaan Surat
                  </label>
                  <input
                    type="text"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Menerangkan keperluan pengurusan akta kematian..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Estimasi Proses
                  </label>
                  <input
                    type="text"
                    value={estimasiProses}
                    onChange={(e) => setEstimasiProses(e.target.value)}
                    placeholder="1x24 Jam"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Persyaratan Dokumen (Pisahkan dengan tanda koma)
                  </label>
                  <input
                    type="text"
                    value={persyaratanText}
                    onChange={(e) => setPersyaratanText(e.target.value)}
                    placeholder="KTP Pemohon, Kartu Keluarga (KK), Surat Kematian RS"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Template Paragraf Pembuka Surat
                  </label>
                  <textarea
                    rows={2}
                    value={templatePembuka}
                    onChange={(e) => setTemplatePembuka(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden text-xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Template Paragraf Penutup Surat
                  </label>
                  <textarea
                    rows={2}
                    value={templatePenutup}
                    onChange={(e) => setTemplatePenutup(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden text-xs"
                  />
                </div>

                <div className="sm:col-span-3 flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aktif}
                      onChange={(e) => setAktif(e.target.checked)}
                      className="rounded text-indigo-600 w-4 h-4"
                    />
                    <span className="font-bold text-xs text-slate-800">
                      Aktifkan jenis surat ini agar dapat dipilih oleh warga
                    </span>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNew(false);
                        setEditingItem(null);
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isCreatingNew ? 'Simpan Surat Baru' : 'Simpan Perubahan'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Cards List of Jenis Surat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jenisSuratList.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-indigo-400 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200">
                      {item.kode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.aktif
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.aktif ? '● Aktif' : '○ Non-Aktif'}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900">{item.nama}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>

                  {/* Requirements Tags */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Syarat Dokumen:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.persyaratan.map((req, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Estimasi: <strong>{item.estimasiProses}</strong></span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit template surat"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.nama)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus template surat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
