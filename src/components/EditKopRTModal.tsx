import React, { useState, useEffect } from 'react';
import { useRBAC } from '../context/RBACContext';
import {
  X,
  Save,
  RotateCcw,
  Building2,
  Phone,
  MapPin,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { InfoPerumahan } from '../types/rbac';

interface EditKopRTModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditKopRTModal: React.FC<EditKopRTModalProps> = ({ isOpen, onClose }) => {
  const { infoPerumahan, updateInfoPerumahan } = useRBAC();

  const [formData, setFormData] = useState<InfoPerumahan>(infoPerumahan);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(infoPerumahan);
  }, [infoPerumahan, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof InfoPerumahan, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const success = updateInfoPerumahan(formData);
    if (success) {
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Editor & Pengaturan KOP Surat Resmi RT
              </h3>
              <p className="text-xs text-emerald-200">
                Kelola identitas KOP yang tampil pada kop website dan dokumen surat resmi warga
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Success Banner */}
          {isSaved && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-950 animate-in zoom-in-95">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-black text-sm">Perubahan KOP Berhasil Disimpan!</h4>
                <p className="text-xs text-emerald-800">
                  Data KOP terbaru telah diterapkan di seluruh kop surat dan modul website.
                </p>
              </div>
            </div>
          )}

          {/* Live Preview of the KOP */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Pratinjau Langsung (Live Preview KOP RT)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Tampilan otomatis terbarui</span>
            </div>

            <div className="p-5 bg-white border border-slate-300 rounded-2xl shadow-xs text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                PENGURUS RUKUN TETANGGA
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                RUKUN TETANGGA {formData.rtRw.split('/')[0]?.trim() || '04'} / RUKUN WARGA {formData.rtRw.split('/')[1]?.trim() || '09'}
              </h2>
              <h3 className="text-xs sm:text-sm font-extrabold text-emerald-800">
                {formData.namaPerumahan.toUpperCase()}
              </h3>
              <p className="text-[11px] text-slate-600">
                Kelurahan {formData.kelurahan}, Kecamatan {formData.kecamatan}, {formData.kota} {formData.kodePos}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-500 pt-1">
                <span>{formData.alamatSekretariat}</span>
                <span>•</span>
                <span>Hotline: {formData.hotlineRT}</span>
                <span>•</span>
                <span>{formData.nomorSK}</span>
              </div>
              <div className="pt-2 space-y-0.5">
                <div className="h-[2px] bg-slate-900 w-full" />
                <div className="h-[0.75px] bg-slate-900 w-full" />
              </div>
            </div>
          </div>

          {/* Input Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Perumahan / Kompleks *
              </label>
              <input
                type="text"
                required
                value={formData.namaPerumahan}
                onChange={(e) => handleChange('namaPerumahan', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Contoh: Perumahan Griya Asri Pratama"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Wilayah RT / RW *
              </label>
              <input
                type="text"
                required
                value={formData.rtRw}
                onChange={(e) => handleChange('rtRw', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Contoh: RT 04 / RW 09"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kelurahan / Desa *
              </label>
              <input
                type="text"
                required
                value={formData.kelurahan}
                onChange={(e) => handleChange('kelurahan', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Contoh: Sukamaju Indah"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kecamatan *
              </label>
              <input
                type="text"
                required
                value={formData.kecamatan}
                onChange={(e) => handleChange('kecamatan', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Contoh: Cilodong"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kabupaten / Kota *
              </label>
              <input
                type="text"
                required
                value={formData.kota}
                onChange={(e) => handleChange('kota', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Contoh: Kota Depok"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kode Pos
              </label>
              <input
                type="text"
                value={formData.kodePos || ''}
                onChange={(e) => handleChange('kodePos', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Contoh: 16413"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Surat Keputusan (SK) Kelurahan
              </label>
              <input
                type="text"
                value={formData.nomorSK || ''}
                onChange={(e) => handleChange('nomorSK', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Contoh: SK Kelurahan No. 142/SK-RT/2024"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Ketua RT *
              </label>
              <input
                type="text"
                required
                value={formData.namaKetuaRT || ''}
                onChange={(e) => handleChange('namaKetuaRT', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Contoh: Ir. Budi Santoso, M.Sc."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Posko / Sekretariat RT
              </label>
              <input
                type="text"
                value={formData.alamatSekretariat || ''}
                onChange={(e) => handleChange('alamatSekretariat', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Contoh: Balai Pertemuan & Pos Satpam Utama Blok A-01"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Hotline / Telepon RT & WhatsApp
              </label>
              <input
                type="text"
                value={formData.hotlineRT || ''}
                onChange={(e) => handleChange('hotlineRT', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Contoh: (021) 7788-9900 / 0812-3456-7890"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Slogan / Motto Lingkungan
              </label>
              <input
                type="text"
                value={formData.slogan || ''}
                onChange={(e) => handleChange('slogan', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                placeholder="Contoh: Rukun, Guyub, Aman, dan Nyaman"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan KOP RT</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
