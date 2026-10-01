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
  Image as ImageIcon,
  Stamp,
  Layers,
  Shield,
  Upload,
  Sliders,
  Check,
  Globe,
  Settings,
  UserCheck,
} from 'lucide-react';
import { InfoPerumahan } from '../types/rbac';

interface EditKopRTModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditKopRTModal: React.FC<EditKopRTModalProps> = ({ isOpen, onClose }) => {
  const { infoPerumahan, updateInfoPerumahan, canExecute } = useRBAC();

  const [formData, setFormData] = useState<InfoPerumahan>(infoPerumahan);
  const [activeTab, setActiveTab] = useState<'text' | 'logo' | 'pejabat' | 'persuratan'>('text');
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
    if (!canExecute('kop:manage', 'Menyimpan Pengaturan KOP & Logo Resmi RT', 'Audit & Sistem')) return;

    const success = updateInfoPerumahan(formData);
    if (success) {
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1200);
    }
  };

  // Direct image upload (FileReader to Base64)
  const handleLogoUpload = (side: 'kiri' | 'kanan', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (side === 'kiri') {
        handleChange('logoResmiKiri', base64);
      } else {
        handleChange('logoResmiKanan', base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Logo preset selection with regional options
  const setPresetLogo = (type: 'garuda' | 'pemda_sidoarjo' | 'pemda_depok' | 'pemda_dki' | 'pemda_jabar' | 'kombinasi' | 'rt_custom') => {
    let logoKiri = formData.logoResmiKiri;
    let logoKanan = formData.logoResmiKanan;
    let tipeLogo: InfoPerumahan['tipeLogoResmi'] = 'garuda';

    if (type === 'garuda') {
      logoKiri = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Coat_of_arms_of_Indonesia.svg/300px-Coat_of_arms_of_Indonesia.svg.png';
      logoKanan = '';
      tipeLogo = 'garuda';
    } else if (type === 'pemda_sidoarjo') {
      logoKiri = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Lambang_Kabupaten_Sidoarjo.png/300px-Lambang_Kabupaten_Sidoarjo.png';
      logoKanan = '';
      tipeLogo = 'pemda';
    } else if (type === 'pemda_depok') {
      logoKiri = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Lambang_Kota_Depok.png/300px-Lambang_Kota_Depok.png';
      logoKanan = '';
      tipeLogo = 'pemda';
    } else if (type === 'pemda_dki') {
      logoKiri = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Coat_of_arms_of_Jakarta.svg/300px-Coat_of_arms_of_Jakarta.svg.png';
      logoKanan = '';
      tipeLogo = 'pemda';
    } else if (type === 'pemda_jabar') {
      logoKiri = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Coat_of_arms_of_West_Java.svg/300px-Coat_of_arms_of_West_Java.svg.png';
      logoKanan = '';
      tipeLogo = 'pemda';
    } else if (type === 'kombinasi') {
      logoKiri = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Coat_of_arms_of_Indonesia.svg/300px-Coat_of_arms_of_Indonesia.svg.png';
      logoKanan = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Lambang_Kabupaten_Sidoarjo.png/300px-Lambang_Kabupaten_Sidoarjo.png';
      tipeLogo = 'kombinasi';
    } else if (type === 'rt_custom') {
      tipeLogo = 'rt_custom';
    }

    setFormData((prev) => ({
      ...prev,
      tipeLogoResmi: tipeLogo,
      logoResmiKiri: logoKiri,
      logoResmiKanan: logoKanan,
    }));
  };

  // Determine logo styling based on shape & size
  const getLogoSizeClass = () => {
    if (formData.logoSize === 'large') return 'w-20 h-20 sm:w-24 sm:h-24';
    if (formData.logoSize === 'xl') return 'w-24 h-24 sm:w-28 sm:h-28';
    return 'w-16 h-16 sm:w-20 sm:h-20';
  };

  const getLogoShapeClass = () => {
    if (formData.logoShape === 'circle') return 'rounded-full border border-slate-200 p-1 bg-white shadow-2xs';
    if (formData.logoShape === 'rounded') return 'rounded-2xl border border-slate-200 p-1.5 bg-white shadow-2xs';
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Editor & Pengaturan Resmi KOP Surat RT (Tata Naskah Dinas)
              </h3>
              <p className="text-xs text-emerald-200">
                Atur format logo resmi, teks hierarki dinas kelurahan, dan aturan persuratan RT
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

        {/* Tab Sub-Nav */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-1 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-xl font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Teks KOP & Hierarki Dinas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logo')}
            className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'logo'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-xl font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            2. Pengaturan Logo Resmi & Unggah
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pejabat')}
            className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'pejabat'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-xl font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            3. Penandatangan & Stempel RT
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('persuratan')}
            className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'persuratan'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-xl font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            4. Aturan Persuratan & Format Naskah
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Success Banner */}
          {isSaved && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-950 animate-in zoom-in-95">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-black text-sm">Pengaturan KOP Resmi Berhasil Disimpan!</h4>
                <p className="text-xs text-emerald-800">
                  Format KOP surat dan aturan persuratan telah disinkronkan ke seluruh dokumen cetak dan laporan.
                </p>
              </div>
            </div>
          )}

          {/* Live Official Preview of the KOP Surat (Tata Naskah Dinas) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Pratinjau KOP Resmi Standar Tata Naskah Dinas (Live Preview)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                Sesuai Kertas Surat Resmi
              </span>
            </div>

            <div className="p-6 bg-white border-2 border-slate-300 rounded-2xl shadow-xs text-center font-serif text-slate-900 relative">
              <div className="flex items-center justify-between gap-4">
                {/* Logo Kiri */}
                <div className={`${getLogoSizeClass()} flex items-center justify-center shrink-0`}>
                  {formData.logoResmiKiri ? (
                    <img
                      src={formData.logoResmiKiri}
                      alt="Logo Resmi Kiri"
                      className={`max-h-full max-w-full object-contain ${getLogoShapeClass()}`}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-[9px] text-slate-400 font-sans">
                      Logo Kiri
                    </div>
                  )}
                </div>

                {/* Center Hierarchical Typography */}
                <div className="flex-1 space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                    {formData.headerBaris1 || `PEMERINTAH ${formData.kota.toUpperCase()}`}
                  </h4>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                    {formData.headerBaris2 || `KECAMATAN ${formData.kecamatan.toUpperCase()} - KELURAHAN ${formData.kelurahan.toUpperCase()}`}
                  </h4>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-950 font-sans">
                    {formData.headerBaris3 || `RUKUN TETANGGA ${formData.rtRw.split('/')[0]?.trim()} / RUKUN WARGA ${formData.rtRw.split('/')[1]?.trim()}`}
                  </h2>
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase text-emerald-900 font-sans">
                    {formData.headerBaris4 || formData.namaPerumahan.toUpperCase()}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-600 font-sans leading-tight pt-1">
                    Sekretariat: {formData.alamatSekretariat}, Kode Pos: {formData.kodePos}
                  </p>
                  <p className="text-[10px] text-slate-500 font-sans">
                    Telp / WhatsApp: {formData.hotlineRT} {formData.emailRT ? `• Email: ${formData.emailRT}` : ''}
                  </p>
                </div>

                {/* Logo Kanan */}
                <div className={`${getLogoSizeClass()} flex items-center justify-center shrink-0`}>
                  {formData.logoResmiKanan ? (
                    <img
                      src={formData.logoResmiKanan}
                      alt="Logo Resmi Kanan"
                      className={`max-h-full max-w-full object-contain ${getLogoShapeClass()}`}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-[9px] text-slate-400 font-sans">
                      Logo Kanan
                    </div>
                  )}
                </div>
              </div>

              {/* Border Divider */}
              {formData.kopBorderType === 'ornament' ? (
                <div className="pt-3 flex items-center justify-center gap-2 text-slate-700">
                  <div className="h-[2px] bg-slate-900 flex-1" />
                  <span className="text-xs font-bold">❖</span>
                  <div className="h-[2px] bg-slate-900 flex-1" />
                </div>
              ) : formData.kopBorderType === 'single' ? (
                <div className="pt-3">
                  <div className="h-[3px] bg-slate-900 w-full" />
                </div>
              ) : (
                <div className="pt-3 space-y-[2px]">
                  <div className="h-[2.5px] bg-slate-900 w-full" />
                  <div className="h-[1px] bg-slate-900 w-full" />
                </div>
              )}
            </div>
          </div>

          {/* TAB 1: TEKS HIERARKI KOP DINAS */}
          {activeTab === 'text' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Hierarki penulisan KOP surat dinas resmi dimulai dari Pemerintah Kota/Kabupaten &rarr; Kecamatan & Kelurahan &rarr; Rukun Tetangga (RT) / Rukun Warga (RW).
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Baris 1: Instansi Atasan (Pemerintah Kota/Kabupaten)
                  </label>
                  <input
                    type="text"
                    value={formData.headerBaris1 || `PEMERINTAH ${formData.kota.toUpperCase()}`}
                    onChange={(e) => handleChange('headerBaris1', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold uppercase text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                    placeholder="Contoh: PEMERINTAH KOTA DEPOK"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Baris 2: Kecamatan & Kelurahan
                  </label>
                  <input
                    type="text"
                    value={formData.headerBaris2 || `KECAMATAN ${formData.kecamatan.toUpperCase()} - KELURAHAN ${formData.kelurahan.toUpperCase()}`}
                    onChange={(e) => handleChange('headerBaris2', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold uppercase text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                    placeholder="Contoh: KECAMATAN TAMAN  - KELURAHAN SEPANJANG"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Baris 3: Rukun Tetangga (RT) & Rukun Warga (RW)
                  </label>
                  <input
                    type="text"
                    value={formData.headerBaris3 || `RUKUN TETANGGA ${formData.rtRw.split('/')[0]?.trim()} / RUKUN WARGA ${formData.rtRw.split('/')[1]?.trim()}`}
                    onChange={(e) => handleChange('headerBaris3', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold uppercase text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                    placeholder="Contoh: RUKUN TETANGGA 38 / RUKUN WARGA 09"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Baris 4: Nama Perumahan / Kompleks Lingkungan
                  </label>
                  <input
                    type="text"
                    value={formData.headerBaris4 || formData.namaPerumahan.toUpperCase()}
                    onChange={(e) => handleChange('headerBaris4', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold uppercase text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                    placeholder="Contoh: PERUMAHAN GRIYO TAMAN ASRI"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Lengkap Kantor Sekretariat RT
                  </label>
                  <input
                    type="text"
                    value={formData.alamatSekretariat}
                    onChange={(e) => handleChange('alamatSekretariat', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={formData.kodePos}
                    onChange={(e) => handleChange('kodePos', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hotline / Kontak WhatsApp Pengurus RT
                  </label>
                  <input
                    type="text"
                    value={formData.hotlineRT}
                    onChange={(e) => handleChange('hotlineRT', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Resmi RT (Opsional)
                  </label>
                  <input
                    type="email"
                    value={formData.emailRT || ''}
                    onChange={(e) => handleChange('emailRT', e.target.value)}
                    placeholder="rt38.rw09_gritas@gmail.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PENGATURAN LOGO RESMI & UNGGAH */}
          {activeTab === 'logo' && (
            <div className="space-y-5 animate-in fade-in">
              {/* Presets Grid */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block text-xs">
                  Pilih Preset Lambang Resmi Tata Naskah Dinas:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPresetLogo('garuda')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.tipeLogoResmi === 'garuda'
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Coat_of_arms_of_Indonesia.svg/150px-Coat_of_arms_of_Indonesia.svg.png"
                        alt="Garuda"
                        className="max-h-full object-contain"
                      />
                    </div>
                    <span className="font-bold text-[11px] text-slate-900 block">Garuda Emas</span>
                    <span className="text-[9px] text-slate-500">Nasional</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPresetLogo('pemda_sidoarjo')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.tipeLogoResmi === 'pemda' && formData.logoResmiKiri?.includes('Sidoarjo')
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Lambang_Kabupaten_Sidoarjo.png/150px-Lambang_Kabupaten_Sidoarjo.png"
                        alt="Pemkab Sidoarjo"
                        className="max-h-full object-contain"
                      />
                    </div>
                    <span className="font-bold text-[11px] text-slate-900 block">Pemkab Sidoarjo</span>
                    <span className="text-[9px] text-slate-500">Jawa Timur</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPresetLogo('pemda_depok')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.tipeLogoResmi === 'pemda' && formData.logoResmiKiri?.includes('Depok')
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Lambang_Kota_Depok.png/150px-Lambang_Kota_Depok.png"
                        alt="Pemda Depok"
                        className="max-h-full object-contain"
                      />
                    </div>
                    <span className="font-bold text-[11px] text-slate-900 block">Pemda Depok</span>
                    <span className="text-[9px] text-slate-500">Jawa Barat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPresetLogo('pemda_dki')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.logoResmiKiri?.includes('Surabaya')
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Coat_of_arms_of_Jakarta.svg/150px-Coat_of_arms_of_Jakarta.svg.png"
                        alt="Pemda DKI"
                        className="max-h-full object-contain"
                      />
                    </div>
                    <span className="font-bold text-[11px] text-slate-900 block">Pemprov DKI</span>
                    <span className="text-[9px] text-slate-500">Jakarta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPresetLogo('pemda_jabar')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.logoResmiKiri?.includes('West_Java')
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Coat_of_arms_of_West_Java.svg/150px-Coat_of_arms_of_West_Java.svg.png"
                        alt="Pemprov Jabar"
                        className="max-h-full object-contain"
                      />
                    </div>
                    <span className="font-bold text-[11px] text-slate-900 block">Pemprov Jabar</span>
                    <span className="text-[9px] text-slate-500">Kujang Emas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPresetLogo('kombinasi')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.tipeLogoResmi === 'kombinasi'
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center gap-1">
                      <Shield className="w-4 h-4 text-amber-600" />
                      <Building2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-bold text-[11px] text-slate-900 block">2 Logo Resmi</span>
                    <span className="text-[9px] text-slate-500">Kiri & Kanan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPresetLogo('rt_custom')}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.tipeLogoResmi === 'rt_custom'
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="font-bold text-[11px] text-slate-900 block">Kustom Mandiri</span>
                    <span className="text-[9px] text-slate-500">Upload Sendiri</span>
                  </button>
                </div>
              </div>

              {/* Direct Upload & Image Source Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Logo Kiri (Instansi / Lambang Daerah) */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Logo Resmi Kiri (Garuda / Pemda)</span>
                    </span>
                    {formData.logoResmiKiri && (
                      <button
                        type="button"
                        onClick={() => handleChange('logoResmiKiri', '')}
                        className="text-[10px] text-rose-600 hover:underline font-semibold"
                      >
                        Hapus Logo
                      </button>
                    )}
                  </div>

                  {/* Upload button */}
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer text-slate-700 hover:text-emerald-700 transition-colors">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-[11px]">Unggah File Gambar dari Komputer/HP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload('kiri', e)}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Atau Masukkan Tautan / URL Gambar:
                    </label>
                    <input
                      type="text"
                      value={formData.logoResmiKiri || ''}
                      onChange={(e) => handleChange('logoResmiKiri', e.target.value)}
                      placeholder="https://.../logo-kiri.png"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-[10px] text-slate-800 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Logo Kanan (Kompleks / RT) */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span>Logo Resmi Kanan (RT / Kompleks)</span>
                    </span>
                    {formData.logoResmiKanan && (
                      <button
                        type="button"
                        onClick={() => handleChange('logoResmiKanan', '')}
                        className="text-[10px] text-rose-600 hover:underline font-semibold"
                      >
                        Hapus Logo
                      </button>
                    )}
                  </div>

                  {/* Upload button */}
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-dashed border-slate-300 hover:border-indigo-500 rounded-xl cursor-pointer text-slate-700 hover:text-indigo-700 transition-colors">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-[11px]">Unggah File Gambar dari Komputer/HP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoUpload('kanan', e)}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      Atau Masukkan Tautan / URL Gambar:
                    </label>
                    <input
                      type="text"
                      value={formData.logoResmiKanan || ''}
                      onChange={(e) => handleChange('logoResmiKanan', e.target.value)}
                      placeholder="https://.../logo-rt.png"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-[10px] text-slate-800 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Styling Controls (Size, Shape, Border) */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-slate-600" />
                  <span>Pengaturan Tampilan & Format KOP Surat:</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Ukuran Lambang Logo:
                    </label>
                    <select
                      value={formData.logoSize || 'standard'}
                      onChange={(e) => handleChange('logoSize', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                    >
                      <option value="standard">Standar Naskah Dinas (64-72px)</option>
                      <option value="large">Besar Tegas (80-84px)</option>
                      <option value="xl">Ekstra Besar (96px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Bentuk Bingkai Logo:
                    </label>
                    <select
                      value={formData.logoShape || 'default'}
                      onChange={(e) => handleChange('logoShape', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                    >
                      <option value="default">Transparan Asli (Rekomendasi PNG)</option>
                      <option value="circle">Lingkaran Bulat Berbingkai</option>
                      <option value="rounded">Kotak Sudut Membulat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Model Garis Pembatas KOP:
                    </label>
                    <select
                      value={formData.kopBorderType || 'double'}
                      onChange={(e) => handleChange('kopBorderType', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                    >
                      <option value="double">Garis Ganda Resmi (Tebal-Tipis Standar Permendagri)</option>
                      <option value="single">Garis Tunggal Tebal</option>
                      <option value="ornament">Garis Hias Ornamen Dinas</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PEJABAT PENANDATANGAN & STEMPEL RT */}
          {activeTab === 'pejabat' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Ketua RT (Penandatangan Utama) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaKetuaRT}
                    onChange={(e) => handleChange('namaKetuaRT', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIK Ketua RT (Legalitas Naskah Dinas)
                  </label>
                  <input
                    type="text"
                    value={formData.nikKetuaRT || ''}
                    onChange={(e) => handleChange('nikKetuaRT', e.target.value)}
                    placeholder="327601..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Ketua RW (Mengetahui)
                  </label>
                  <input
                    type="text"
                    value={formData.namaKetuaRW || ''}
                    onChange={(e) => handleChange('namaKetuaRW', e.target.value)}
                    placeholder="Drs. H. Mulyadi Saputra, M.M."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Sekretaris RT (Buku Induk Warga)
                  </label>
                  <input
                    type="text"
                    value={formData.namaSekretarisRT || 'Ahmad Fauzi, S.T.'}
                    onChange={(e) => handleChange('namaSekretarisRT', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Bendahara RT (Laporan Keuangan)
                  </label>
                  <input
                    type="text"
                    value={formData.namaBendaharaRT || 'Dewi Sartika, S.E.'}
                    onChange={(e) => handleChange('namaBendaharaRT', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor SK Penetapan / Pengesahan RT dari Kelurahan
                  </label>
                  <input
                    type="text"
                    value={formData.nomorSK}
                    onChange={(e) => handleChange('nomorSK', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Slogan / Motto Lingkungan Rukun Warga
                  </label>
                  <input
                    type="text"
                    value={formData.slogan}
                    onChange={(e) => handleChange('slogan', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Stempel Setting */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-indigo-500/40 text-indigo-700 text-[8px] font-bold flex items-center justify-center rotate-6 shrink-0 bg-indigo-50">
                    STEMPEL RT
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">
                      Cap Stempel Digital Resmi RT pada Surat & Laporan Terbit
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Menyematkan stempel bulat keabsahan RT berwarna ungu/biru khas instansi RT pada lembar surat cetak dan laporan.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.stempelResmiAktif !== false}
                    onChange={(e) => handleChange('stempelResmiAktif', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: ATURAN PERSURATAN & FORMAT NASKAH */}
          {activeTab === 'persuratan' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Pengaturan ini mengatur format baku penerbitan surat pengantar RT, klasifikasi penomoran surat otomatis, dan instansi tujuan.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Format Template Penomoran Surat Resmi
                  </label>
                  <input
                    type="text"
                    value={formData.formatNomorSurat || '{kode}/{nomor}/RT.04-RW.09/{bulan_romawi}/{tahun}'}
                    onChange={(e) => handleChange('formatNomorSurat', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Variabel dinamis: <code>{'{kode}'}</code> (470/SKD), <code>{'{nomor}'}</code> (001), <code>{'{bulan_romawi}'}</code> (IX), <code>{'{tahun}'}</code> (2026).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Instansi Tujuan Default pada Surat Pengantar
                  </label>
                  <input
                    type="text"
                    value={formData.instansiTujuanDefault || `Yth. Bapak/Ibu Lurah ${formData.kelurahan}`}
                    onChange={(e) => handleChange('instansiTujuanDefault', e.target.value)}
                    placeholder="Yth. Bapak/Ibu Lurah Sukamaju Indah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Masa Berlaku Surat Pengantar
                  </label>
                  <select
                    value={formData.masaBerlakuHari || 30}
                    onChange={(e) => handleChange('masaBerlakuHari', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                  >
                    <option value={14}>14 Hari Kalender</option>
                    <option value={30}>30 Hari (1 Bulan Standar)</option>
                    <option value={60}>60 Hari (2 Bulan)</option>
                    <option value={90}>90 Hari (3 Bulan)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="block font-bold text-xs text-slate-800">Kolom Mengetahui Ketua RW</span>
                    <span className="text-[10px] text-slate-500">Tampilkan tanda tangan RW</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.tampilkanKetuaRW !== false}
                    onChange={(e) => handleChange('tampilkanKetuaRW', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="block font-bold text-xs text-slate-800">Kolom Tanda Tangan Pemohon</span>
                    <span className="text-[10px] text-slate-500">Warga pemohon tanda tangan</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.tampilkanTtdPemohon !== false}
                    onChange={(e) => handleChange('tampilkanTtdPemohon', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Kaki Resmi Dokumen (Footer Catatan Keabsahan)
                </label>
                <input
                  type="text"
                  value={formData.footerCatatanKaki || 'Surat keterangan ini sah dan berkekuatan hukum dengan stempel resmi RT dan QR Code validasi.'}
                  onChange={(e) => handleChange('footerCatatanKaki', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setFormData(infoPerumahan)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Kembalikan Awal</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan KOP & Logo</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
