import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useRBAC } from '../context/RBACContext';
import {
  Globe,
  Copy,
  Check,
  QrCode,
  Share2,
  Printer,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  Download,
  X,
  MessageCircle,
} from 'lucide-react';

interface WebHostingBannerProps {
  onOpenPrintPoster?: () => void;
}

export const WebHostingBanner: React.FC<WebHostingBannerProps> = ({ onOpenPrintPoster }) => {
  const { infoPerumahan } = useRBAC();
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Default canonical hosting URL from environment metadata, fallback to current origin
  const defaultHostingUrl =
    typeof window !== 'undefined'
      ? (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1'))
        ? 'https://ais-pre-77zpadwefwxzehalu26qkm-513616529310.asia-east1.run.app'
        : window.location.origin
      : 'https://ais-pre-77zpadwefwxzehalu26qkm-513616529310.asia-east1.run.app';

  const [portalUrl, setPortalUrl] = useState<string>(defaultHostingUrl);

  // Generate QR Code whenever portalUrl changes
  useEffect(() => {
    if (!portalUrl) return;

    QRCode.toDataURL(portalUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#064e3b', // Deep emerald
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.warn('QR Code generation notice:', err);
      });

    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, portalUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#064e3b',
          light: '#ffffff',
        },
      }).catch(() => {
        // ignore
      });
    }
  }, [portalUrl]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(portalUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = portalUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*Yth. Bapak/Ibu Warga RT 04 / RW 09 ${infoPerumahan.namaPerumahan}*\n\n` +
        `Berikut adalah alamat tautan resmi Portal Web Pendataan Warga Lingkungan kita:\n` +
        `🌐 *${portalUrl}*\n\n` +
        `Melalui website ini, seluruh warga dapat:\n` +
        `✅ Memindai / Upload Kartu Keluarga (KK) otomatis dengan AI\n` +
        `✅ Mengecek data keluarga & rumah (Blok A, B, C, D)\n` +
        `✅ Cek status & bayar Iuran Lingkungan RT\n` +
        `✅ Pengajuan Surat Pengantar RT 100% online\n` +
        `✅ Lapor tamu menginap & aduan lingkungan 24 jam\n\n` +
        `_Dapat dibuka langsung melalui browser HP (Chrome/Safari) tanpa perlu install aplikasi._\n\n` +
        `Salam hormat,\n*Pengurus RT 04 / RW 09*`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QRCode-Portal-SIM-Warga-RT04.png`;
    a.click();
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Info & URL Box */}
        <div className="space-y-3.5 w-full lg:max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Alamat Web Hosting & Portal Warga</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-200/90 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Online 24 Jam • SSL Terenkripsi (HTTPS)</span>
            </span>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Akses Mudah untuk Warga {infoPerumahan.namaPerumahan}</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
              Bagikan tautan web ini kepada seluruh warga RT melalui WhatsApp atau cetak QR Code untuk ditempel di Pos Satpam agar warga bisa langsung memindai KK, cek data keluarga, bayar iuran, dan ajukan surat pengantar secara mandiri.
            </p>
          </div>

          {/* Interactive URL Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-emerald-500/40 backdrop-blur-md">
            <div className="flex items-center gap-2 px-3 py-2 flex-1 min-w-0">
              <span className="text-[11px] font-mono font-bold text-emerald-400 select-none shrink-0 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                https://
              </span>
              <input
                type="text"
                readOnly
                value={portalUrl.replace(/^https?:\/\//, '')}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="w-full bg-transparent font-mono text-xs sm:text-sm text-slate-100 font-semibold focus:outline-hidden truncate cursor-pointer"
                title="Klik untuk memilih alamat web"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0 px-1">
              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
                title="Salin tautan ke clipboard"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
              </button>

              {/* Share to WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Bagikan ke WhatsApp Grup RT"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              {/* Open in new tab */}
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
                title="Buka website di jendela baru"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick instructions for residents */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-emerald-200/90 pt-0.5">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kompatibel HP Android & iPhone (PWA Ready)</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <span>Tanpa instalasi PlayStore/AppStore</span>
            </span>
          </div>
        </div>

        {/* Right: Interactive Scannable QR Code Card */}
        <div className="shrink-0 flex flex-col items-center bg-white rounded-2xl p-4 shadow-xl border border-emerald-300 text-slate-800 w-full sm:w-auto">
          <div className="text-center pb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Pindai dengan Kamera HP
            </span>
            <h4 className="font-extrabold text-xs text-slate-900 mt-1">
              QR Code Akses Warga
            </h4>
          </div>

          {/* QR Code Canvas */}
          <div
            onClick={() => setShowQRModal(true)}
            className="p-2 bg-slate-50 rounded-xl border border-slate-200 shadow-inner cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group relative"
            title="Klik untuk memperbesar QR Code"
          >
            <canvas ref={qrCanvasRef} className="w-28 h-28 sm:w-32 sm:h-32 block mx-auto" />
            <div className="absolute inset-0 bg-emerald-950/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] font-bold bg-white text-emerald-900 px-2 py-1 rounded-md shadow-xs flex items-center gap-1">
                <QrCode className="w-3 h-3" />
                Perbesar
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 text-center mt-2 max-w-[140px] leading-tight">
            Arahkan kamera HP ke kotak ini untuk membuka portal
          </p>

          <div className="flex gap-2 w-full pt-3">
            <button
              type="button"
              onClick={() => setShowQRModal(true)}
              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-700" />
              <span>Detail QR</span>
            </button>

            {onOpenPrintPoster && (
              <button
                type="button"
                onClick={onOpenPrintPoster}
                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                title="Cetak poster untuk ditempel di Pos Satpam & Mading"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Poster</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enlarged QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in text-slate-800">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 relative animate-in zoom-in-95">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                {infoPerumahan.namaPerumahan}
              </span>
              <h3 className="font-black text-base text-slate-900">
                QR Code Portal Web Warga {infoPerumahan.rtRw}
              </h3>
              <p className="text-xs text-slate-500">
                Pindai menggunakan aplikasi kamera smartphone apapun
              </p>
            </div>

            {/* QR Code Big Image */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-emerald-200 inline-block shadow-inner">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code Portal Warga"
                  className="w-56 h-56 mx-auto rounded-lg"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                  Memuat QR Code...
                </div>
              )}
            </div>

            <div className="bg-slate-100 p-2.5 rounded-xl text-left space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">
                Target URL:
              </span>
              <p className="font-mono text-xs text-emerald-900 font-bold truncate">
                {portalUrl}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownloadQR}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Gambar QR</span>
              </button>

              {onOpenPrintPoster && (
                <button
                  type="button"
                  onClick={() => {
                    setShowQRModal(false);
                    onOpenPrintPoster();
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Poster A4</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
