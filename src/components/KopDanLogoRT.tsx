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
} from 'lucide-react';

interface KopDanLogoRTProps {
  onOpenScanKK?: () => void;
}

export const KopDanLogoRT: React.FC<KopDanLogoRTProps> = ({ onOpenScanKK }) => {
  const { infoPerumahan, currentUser } = useRBAC();
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-slate-800 transition-all">
      {/* Decorative Top Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600" />

      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Official Emblem & Typography */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
            {/* Authentic Indonesian RT/RW Seal (SVG) */}
            <div className="relative shrink-0 group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 p-2 shadow-lg shadow-emerald-900/20 flex items-center justify-center border-2 border-emerald-400/40 relative overflow-hidden">
                {/* SVG Emblem */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-amber-300 drop-shadow-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Laurel Garland */}
                  <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="50" cy="50" r="42" stroke="#10b981" strokeWidth="2" />
                  
                  {/* Star at top */}
                  <polygon points="50,12 52,18 58,18 53,22 55,28 50,24 45,28 47,22 42,18 48,18" fill="#fbbf24" />
                  
                  {/* Shield center */}
                  <path
                    d="M32 26 H68 C68 26 68 56 50 68 C32 56 32 26 32 26 Z"
                    fill="#065f46"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                  />
                  
                  {/* Center Community Icon / Banyan & Houses */}
                  <path
                    d="M50 32 L40 40 H44 V52 H56 V40 H60 L50 32 Z"
                    fill="#fef08a"
                    stroke="#78350f"
                    strokeWidth="0.8"
                  />
                  
                  {/* Inner Banner */}
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
                    RT 04 / RW 09
                  </text>
                </svg>

                {/* Subtle shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
              </div>

              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-xs border border-white">
                RESMI
              </span>
            </div>

            {/* Typography of KOP RT */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-extrabold tracking-widest text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  PENGURUS RUKUN TETANGGA
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  SK Kelurahan No. 142/SK-RT/2024
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                RUKUN TETANGGA 04 / RUKUN WARGA 09
              </h1>
              
              <h2 className="text-sm sm:text-base font-extrabold text-emerald-800 tracking-normal">
                {infoPerumahan.namaPerumahan.toUpperCase()}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Kelurahan {infoPerumahan.kelurahan}, Kecamatan {infoPerumahan.kecamatan}, {infoPerumahan.kota} 16413
              </p>

              {!isCompact && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sekretariat: Balai Pertemuan & Pos Satpam Utama</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hotline RT: (021) 7788-9900 / 0812-3456-7890</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Action: AI Scan KK Button */}
          {onOpenScanKK && (
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={onOpenScanKK}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/25 transition-all hover:scale-102 cursor-pointer group"
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

        {/* Double Official Indonesian Divider Line (Garis Kop Surat Resmi) */}
        <div className="pt-4 space-y-0.5">
          <div className="h-[2.5px] bg-slate-900 w-full" />
          <div className="h-[0.75px] bg-slate-900 w-full" />
        </div>
      </div>
    </div>
  );
};
