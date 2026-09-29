import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useRBAC } from '../context/RBACContext';
import {
  Printer,
  X,
  QrCode,
  Globe,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Download,
  Building2,
} from 'lucide-react';

interface WebHostingPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebHostingPosterModal: React.FC<WebHostingPosterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { infoPerumahan } = useRBAC();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const defaultHostingUrl =
    typeof window !== 'undefined'
      ? (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1'))
        ? 'https://ais-pre-77zpadwefwxzehalu26qkm-513616529310.asia-east1.run.app'
        : window.location.origin
      : 'https://ais-pre-77zpadwefwxzehalu26qkm-513616529310.asia-east1.run.app';

  useEffect(() => {
    QRCode.toDataURL(defaultHostingUrl, {
      width: 480,
      margin: 1,
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
        console.warn('Error generating poster QR code:', err);
      });
  }, [defaultHostingUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-Code-SIM-Warga-RT04.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden text-slate-800 my-auto">
        {/* Floating Top Controls (Hidden on Print) */}
        <div className="print:hidden px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-sm leading-tight">
                Cetak Lembar Pengumuman QR Code Warga
              </h3>
              <p className="text-[11px] text-slate-400">
                Format siap tempel untuk Pos Satpam, Mading RT, dan Balai Warga
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Poster Canvas */}
        <div className="p-8 sm:p-10 bg-white space-y-6 print:p-0 print:m-0" id="printable-poster">
          {/* Official RT Letterhead (KOP) */}
          <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300">
                PENGURUS RUKUN TETANGGA
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
              RUKUN TETANGGA 04 / RUKUN WARGA 09
            </h1>
            <h2 className="text-base font-extrabold text-emerald-800">
              {infoPerumahan.namaPerumahan.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Kelurahan {infoPerumahan.kelurahan}, Kecamatan {infoPerumahan.kecamatan}, {infoPerumahan.kota} 16413
            </p>
            <div className="pt-2 flex justify-center items-center gap-4 text-[11px] text-slate-500">
              <span>Posko Sekretariat: Balai Pertemuan & Pos Satpam</span>
              <span>•</span>
              <span>Hotline RT: 0812-3456-7890</span>
            </div>
          </div>

          {/* Double Line Divider */}
          <div className="space-y-0.5 -mt-3">
            <div className="h-[2px] bg-slate-950 w-full" />
            <div className="h-[0.75px] bg-slate-950 w-full" />
          </div>

          {/* Main Poster Announcement Banner */}
          <div className="text-center space-y-2 pt-2">
            <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-300">
              Pemberitahuan Warga Lingkungan
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              PORTAL DIGITAL LAYANAN & PENDATAAN WARGA
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Mempermudah warga dalam pemindaian KK otomatis dengan AI, verifikasi data keluarga, cek iuran lingkungan, dan permohonan surat pengantar RT secara mandiri online.
            </p>
          </div>

          {/* Big Center QR Code */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-emerald-500 rounded-3xl max-w-sm mx-auto shadow-sm">
            <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code Portal Warga"
                  className="w-52 h-52 sm:w-60 sm:h-60 mx-auto"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-slate-400">
                  Memuat QR Code...
                </div>
              )}
            </div>
            <span className="mt-3 text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Pindai dengan Kamera HP Anda</span>
            </span>
          </div>

          {/* Official Website URL Display */}
          <div className="bg-slate-100 p-4 rounded-2xl border border-slate-300 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Atau Akses Melalui Browser di Alamat Website:
            </span>
            <p className="font-mono text-sm sm:text-base font-black text-emerald-950 select-all tracking-tight break-all">
              {defaultHostingUrl}
            </p>
          </div>

          {/* 3 Easy Steps for Residents */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center mx-auto">
                1
              </span>
              <h5 className="font-bold text-xs text-slate-900">Buka Kamera HP</h5>
              <p className="text-[10px] text-slate-500 leading-tight">
                Arahkan kamera smartphone ke kode QR di atas
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center mx-auto">
                2
              </span>
              <h5 className="font-bold text-xs text-slate-900">Sentuh Tautan</h5>
              <p className="text-[10px] text-slate-500 leading-tight">
                Klik notifikasi web yang muncul di layar ponsel
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center mx-auto">
                3
              </span>
              <h5 className="font-bold text-xs text-slate-900">Gunakan Layanan</h5>
              <p className="text-[10px] text-slate-500 leading-tight">
                Scan KK, cek iuran, dan ajukan surat pengantar
              </p>
            </div>
          </div>

          {/* Footer Signature & Validation */}
          <div className="pt-4 flex justify-between items-end border-t border-slate-200 text-xs text-slate-600">
            <div>
              <p className="text-[11px] font-semibold">Diterbitkan oleh:</p>
              <p className="font-black text-slate-900">Pengurus RT 04 / RW 09</p>
              <p className="text-[10px] text-slate-500">{infoPerumahan.namaPerumahan}</p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 font-extrabold text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Portal Resmi & Sah</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden on Print) */}
        <div className="print:hidden px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-xl font-bold text-xs text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh QR Code Saja</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Poster (Ctrl + P)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
