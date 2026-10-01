import React, { useState } from 'react';
import { useRBAC } from '../context/RBACContext';
import {
  Building2,
  Shield,
  Phone,
  Mail,
  MapPin,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Globe,
  Copy,
  Check,
  QrCode,
} from 'lucide-react';
import { EditKopRTModal } from './EditKopRTModal';

interface KopDanLogoRTProps {
  onOpenScanKK?: () => void;
  onOpenWebHosting?: () => void;
  onOpenEditKop?: () => void;
}

export const KopDanLogoRT: React.FC<KopDanLogoRTProps> = ({
  onOpenScanKK,
  onOpenWebHosting,
  onOpenEditKop,
}) => {
  const { infoPerumahan, currentUser } = useRBAC();
  const isAdmin = currentUser.role === 'admin';
  const [isCompact, setIsCompact] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isInternalEditKopOpen, setIsInternalEditKopOpen] = useState(false);

  const defaultHostingUrl =
    typeof window !== 'undefined'
      ? (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1'))
        ? 'https://ais-pre-77zpadwefwxzehalu26qkm-513616529310.asia-east1.run.app'
        : window.location.origin
      : 'https://ais-pre-77zpadwefwxzehalu26qkm-513616529310.asia-east1.run.app';

  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(defaultHostingUrl);
      } else {
        const t = document.createElement('textarea');
        t.value = defaultHostingUrl;
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-slate-800 transition-all">
      {/* Decorative Top Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600" />

      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Official Emblem & Typography */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
            {/* Authentic Indonesian RT/RW Seal or Official Logo Image */}
            <div className="relative shrink-0 group">
              {infoPerumahan.logoResmiKiri ? (
                <div
                  className={`rounded-2xl bg-white p-1.5 shadow-md border border-slate-200 flex items-center justify-center relative overflow-hidden ${
                    infoPerumahan.logoSize === 'large'
                      ? 'w-24 h-24 sm:w-28 sm:h-28'
                      : infoPerumahan.logoSize === 'xl'
                      ? 'w-28 h-28 sm:w-32 sm:h-32'
                      : 'w-20 h-20 sm:w-24 sm:h-24'
                  } ${
                    infoPerumahan.logoShape === 'circle'
                      ? 'rounded-full'
                      : infoPerumahan.logoShape === 'rounded'
                      ? 'rounded-2xl'
                      : 'rounded-xl'
                  }`}
                >
                  <img
                    src={infoPerumahan.logoResmiKiri}
                    alt="Logo Resmi KOP"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 p-2 shadow-lg shadow-emerald-900/20 flex items-center justify-center border-2 border-emerald-400/40 relative overflow-hidden">
                  {/* SVG Emblem */}
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-amber-300 drop-shadow-md"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                    <circle cx="50" cy="50" r="42" stroke="#10b981" strokeWidth="2" />
                    <polygon points="50,12 52,18 58,18 53,22 55,28 50,24 45,28 47,22 42,18 48,18" fill="#fbbf24" />
                    <path
                      d="M32 26 H68 C68 26 68 56 50 68 C32 56 32 26 32 26 Z"
                      fill="#065f46"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M50 32 L40 40 H44 V52 H56 V40 H60 L50 32 Z"
                      fill="#fef08a"
                      stroke="#78350f"
                      strokeWidth="0.8"
                    />
                    <path d="M26 74 Q50 82 74 74 L70 82 Q50 90 30 82 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1" />
                    <text
                      x="50"
                      y="80"
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="5.5"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      letterSpacing="0.5"
                    >
                      {infoPerumahan.rtRw || 'RT 38 / RW 09'}
                    </text>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>
              )}

              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-xs border border-white">
                RESMI
              </span>
            </div>

            {/* Typography of KOP RT */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-extrabold tracking-widest text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {infoPerumahan.headerBaris1 || 'PEMERINTAH KABUPATEN SIDOARJO'}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {infoPerumahan.nomorSK || 'SK Kelurahan No. 142/SK-RT/2024'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {infoPerumahan.headerBaris3 || `RUKUN TETANGGA ${infoPerumahan.rtRw.split('/')[0]?.trim()} / RUKUN WARGA ${infoPerumahan.rtRw.split('/')[1]?.trim()}`}
              </h1>
              
              <h2 className="text-sm sm:text-base font-extrabold text-emerald-800 tracking-normal">
                {infoPerumahan.headerBaris4 || infoPerumahan.namaPerumahan.toUpperCase()}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {infoPerumahan.headerBaris2 || `Kelurahan ${infoPerumahan.kelurahan}, Kecamatan ${infoPerumahan.kecamatan}, ${infoPerumahan.kota} ${infoPerumahan.kodePos}`}
              </p>

              {!isCompact && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sekretariat: {infoPerumahan.alamatSekretariat}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hotline RT: {infoPerumahan.hotlineRT}</span>
                  </span>
                </div>
              )}

              {/* Official Web Hosting Address on KOP */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-semibold">
                  <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[11px] text-emerald-700">Web Portal:</span>
                  <span className="font-mono font-bold text-xs text-emerald-900 select-all">
                    {defaultHostingUrl.replace(/^https?:\/\//, '')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-[11px] font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title="Salin alamat web portal ke papan klip"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-500" />}
                  <span>{copied ? 'Tersalin!' : 'Salin URL'}</span>
                </button>

                {onOpenWebHosting && (
                  <button
                    type="button"
                    onClick={onOpenWebHosting}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-[11px] font-bold text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Lihat QR Code & Cetak Poster Warga"
                  >
                    <QrCode className="w-3 h-3 text-indigo-600" />
                    <span>QR Code Warga</span>
                  </button>
                )}

                {/* Admin Quick Edit KOP Button */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenEditKop) onOpenEditKop();
                      else setIsInternalEditKopOpen(true);
                    }}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-[11px] font-bold text-amber-900 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    title="Edit KOP Surat Resmi RT"
                  >
                    <Building2 className="w-3 h-3 text-amber-700" />
                    <span>Edit KOP RT</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Action: Logo Resmi Kanan & AI Scan KK Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto shrink-0 justify-center sm:justify-end">
            {/* Logo Resmi Kanan (RT/Kompleks) */}
            {infoPerumahan.logoResmiKanan && (
              <div
                className={`hidden md:flex rounded-2xl bg-white p-1.5 shadow-md border border-slate-200 items-center justify-center relative overflow-hidden ${
                  infoPerumahan.logoSize === 'large'
                    ? 'w-20 h-20 sm:w-24 sm:h-24'
                    : infoPerumahan.logoSize === 'xl'
                    ? 'w-24 h-24 sm:w-28 sm:h-28'
                    : 'w-16 h-16 sm:w-20 sm:h-20'
                } ${
                  infoPerumahan.logoShape === 'circle'
                    ? 'rounded-full'
                    : infoPerumahan.logoShape === 'rounded'
                    ? 'rounded-2xl'
                    : 'rounded-xl'
                }`}
                title="Logo Resmi Kanan (RT / Lingkungan)"
              >
                <img
                  src={infoPerumahan.logoResmiKanan}
                  alt="Logo Resmi Kanan"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}

            {onOpenScanKK && (
              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
                <button
                  type="button"
                  onClick={onOpenScanKK}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/25 transition-all hover:scale-102 cursor-pointer group"
                >
                  <div className="p-1 rounded-lg bg-white/20">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] text-emerald-100 font-semibold tracking-wide uppercase">
                      Fitur Cerdas AI
                    </span>
                    <span className="text-xs font-black tracking-tight">
                      Scan / Foto Kartu Keluarga (KK)
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCompact(!isCompact)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl text-xs transition-colors hidden lg:flex items-center"
                  title={isCompact ? 'Tampilkan Kop Lengkap' : 'Kop Ringkas'}
                >
                  {isCompact ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Official Divider Line */}
        {infoPerumahan.kopBorderType === 'ornament' ? (
          <div className="pt-4 flex items-center justify-center gap-2 text-slate-700">
            <div className="h-[2px] bg-slate-900 flex-1" />
            <span className="text-xs font-bold">❖</span>
            <div className="h-[2px] bg-slate-900 flex-1" />
          </div>
        ) : infoPerumahan.kopBorderType === 'single' ? (
          <div className="pt-4">
            <div className="h-[3px] bg-slate-900 w-full" />
          </div>
        ) : (
          <div className="pt-4 space-y-0.5">
            <div className="h-[2.5px] bg-slate-900 w-full" />
            <div className="h-[0.75px] bg-slate-900 w-full" />
          </div>
        )}
      </div>

      {/* Internal Kop RT Editor Modal */}
      <EditKopRTModal
        isOpen={isInternalEditKopOpen}
        onClose={() => setIsInternalEditKopOpen(false)}
      />
    </div>
  );
};
