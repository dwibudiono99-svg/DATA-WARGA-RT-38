import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  CheckCheck,
  Send,
  Copy,
  Check,
  Smartphone,
  Share2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Volume2,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { NotifikasiSimulasi } from '../types/rbac';

interface ModalSimulasiNotifikasiProps {
  isOpen: boolean;
  onClose: () => void;
  notifikasi: NotifikasiSimulasi | null;
  onKirimUlang?: () => void;
}

export const ModalSimulasiNotifikasi: React.FC<ModalSimulasiNotifikasiProps> = ({
  isOpen,
  onClose,
  notifikasi,
  onKirimUlang,
}) => {
  const [copied, setCopied] = useState(false);
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!isOpen || !notifikasi) return null;

  const playNotificationSound = () => {
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch {
      // Audio fallback silent
    }
  };

  const handleCopyText = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(notifikasi.pesan);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = notifikasi.pesan;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResend = () => {
    setIsResending(true);
    playNotificationSound();
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      if (onKirimUlang) onKirimUlang();
      setTimeout(() => setResendSuccess(false), 2500);
    }, 1000);
  };

  const cleanPhone = notifikasi.targetNoHp ? notifikasi.targetNoHp.replace(/[^0-9]/g, '') : '';
  const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(notifikasi.pesan)}`;

  const formattedTime = new Date(notifikasi.timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>Simulasi Notifikasi Pengiriman Warga</span>
                <span className="bg-emerald-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                  Live Sim
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Pemberitahuan otomatis saat surat disetujui atau iuran jatuh tempo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channel Selector: WhatsApp vs SMS */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-slate-600 mr-1">Simulasi Kanal:</span>
            <button
              type="button"
              onClick={() => setChannel('whatsapp')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                channel === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              WhatsApp Gateway
            </button>
            <button
              type="button"
              onClick={() => setChannel('sms')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                channel === 'sms'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              SMS GSM Sim
            </button>
          </div>

          <button
            type="button"
            onClick={playNotificationSound}
            className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            title="Tes Nada Notifikasi"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Tes Suara</span>
          </button>
        </div>

        {/* Body Content: Smartphone Mockup Container */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {/* Recipient Details Pill */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {notifikasi.targetWargaNama.charAt(0)}
              </div>
              <div>
                <p className="font-extrabold text-slate-900 leading-tight">
                  {notifikasi.targetWargaNama}
                </p>
                <p className="text-[11px] text-slate-500">
                  {notifikasi.targetRumah} • {notifikasi.targetNoHp || '+62 812-3456-7890'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  notifikasi.tipe === 'surat_disetujui'
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {notifikasi.tipe === 'surat_disetujui' ? 'Surat Disetujui' : 'Jatuh Tempo Iuran'}
              </span>
            </div>
          </div>

          {/* WhatsApp / SMS Smartphone Mockup */}
          {channel === 'whatsapp' ? (
            <div className="rounded-3xl border-2 border-emerald-700/30 overflow-hidden shadow-md bg-[#efeae2]">
              {/* WhatsApp App Header Bar */}
              <div className="px-4 py-2.5 bg-emerald-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-900 border border-emerald-400/50 flex items-center justify-center font-bold text-[11px] text-amber-300">
                    RT
                  </div>
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1">
                      <span>Pengurus RT 38 / RW 09 Sepanjang</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                    <span className="text-[10px] text-emerald-200 block -mt-0.5">
                      Akun Resmi Terverifikasi RT 38 Griyo Taman Asri
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-200 font-mono">WA Gateway</div>
              </div>

              {/* Chat Message Bubble */}
              <div className="p-4 space-y-3">
                <div className="text-center">
                  <span className="text-[10px] bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-bold text-slate-500 shadow-2xs">
                    HARI INI
                  </span>
                </div>

                <div className="max-w-[92%] bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm border border-emerald-100/60 text-xs text-slate-800 space-y-2 relative">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-extrabold text-[11px] text-emerald-900 uppercase tracking-tight flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {notifikasi.judul}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-400">SIM-WARGA</span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                    {notifikasi.pesan}
                  </p>

                  {/* Metadata link preview if applicable */}
                  {notifikasi.meta?.nomorSuratResmi && (
                    <div className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-medium">
                      <span className="block font-bold">📄 Nomor Surat Resmi:</span>
                      <span className="font-mono">{notifikasi.meta.nomorSuratResmi}</span>
                    </div>
                  )}

                  {notifikasi.meta?.nominal && (
                    <div className="p-2 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium">
                      <span className="block font-bold">💳 Jumlah Tagihan Jatuh Tempo:</span>
                      <span className="font-mono font-extrabold">
                        Rp {notifikasi.meta.nominal.toLocaleString('id-ID')}
                      </span>{' '}
                      ({notifikasi.meta.periode})
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 pt-1 text-[10px] text-slate-400">
                    <span>{formattedTime}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-indigo-700/30 overflow-hidden shadow-md bg-slate-900 text-white">
              {/* SMS Header */}
              <div className="px-4 py-2.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs">
                <div className="font-bold flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>SMS Pesan Masuk • RT38-SEPANJANG</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">SIM-Card 1</span>
              </div>

              {/* SMS Bubble */}
              <div className="p-4 space-y-2">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3.5 text-xs text-slate-200 space-y-2">
                  <p className="font-bold text-indigo-300 text-[11px] uppercase">
                    [RT 38 / RW 09 GRIYO TAMAN ASRI]
                  </p>
                  <p className="text-xs leading-relaxed whitespace-pre-line text-slate-300">
                    {notifikasi.pesan}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/50 text-[10px] text-slate-400">
                    <span>Kirim via SMS Gateway SIM-Warga</span>
                    <span>{formattedTime} ✓ Terkirim</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Status Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-full bg-emerald-600 text-white">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">Status: Simulasi Terkirim</span>
                <span className="text-[10px] text-emerald-700">
                  Warga dapat melihat pemberitahuan ini di akun warga & notifikasi banner.
                </span>
              </div>
            </div>

            {resendSuccess && (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full animate-pulse">
                ✓ Terkirim Ulang!
              </span>
            )}
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyText}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Teks Tersalin!' : 'Salin Pesan'}</span>
            </button>

            <button
              type="button"
              disabled={isResending}
              onClick={handleResend}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Mengirim...' : 'Kirim Ulang Sim'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka WA Web Asli</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
