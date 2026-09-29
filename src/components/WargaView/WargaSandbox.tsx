import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  FlaskConical,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Play,
  Terminal,
  Lock,
  Home,
  Users,
  CreditCard,
  FileCheck2,
  AlertTriangle,
} from 'lucide-react';
import { PermissionKey } from '../../types/rbac';

interface TestScenario {
  id: string;
  name: string;
  category: 'Diizinkan untuk Warga' | 'Khusus Pengurus RT (Dibatasi)';
  requiredPermission: PermissionKey;
  moduleName: string;
  description: string;
}

export const WargaSandbox: React.FC = () => {
  const { currentUser, switchRolePersona, canExecute, hasPermission } = useRBAC();
  const [lastTestResult, setLastTestResult] = useState<{
    scenarioName: string;
    permission: string;
    verdict: 'allowed' | 'denied';
    timestamp: string;
    message: string;
  } | null>(null);

  const isAdmin = currentUser.role === 'admin';

  const scenarios: TestScenario[] = [
    // Allowed for Warga
    {
      id: 'sc_01',
      name: 'Melihat & Mengubah Data Rumah Sendiri',
      category: 'Diizinkan untuk Warga',
      requiredPermission: 'warga:edit_own',
      moduleName: 'Data Warga',
      description: 'Memperbarui nomor kontak, data anak, dan biodata keluarga di rumah sendiri.',
    },
    {
      id: 'sc_02',
      name: 'Membayar Iuran Kas & Sampah Rumah Sendiri',
      category: 'Diizinkan untuk Warga',
      requiredPermission: 'iuran:pay_own',
      moduleName: 'Iuran & Kas',
      description: 'Mengunggah bukti transfer iuran kebersihan dan keamanan bulanan.',
    },
    {
      id: 'sc_03',
      name: 'Mengajukan Surat Pengantar RT Online',
      category: 'Diizinkan untuk Warga',
      requiredPermission: 'surat:request',
      moduleName: 'Layanan Surat RT',
      description: 'Membuat permohonan surat keterangan domisili atau pengantar SKCK.',
    },
    {
      id: 'sc_04',
      name: 'Melaporkan Tamu Menginap > 24 Jam',
      category: 'Diizinkan untuk Warga',
      requiredPermission: 'laporan:create',
      moduleName: 'Keamanan Lingkungan',
      description: 'Memberikan informasi ke pos satpam mengenai tamu keluarga yang menginap.',
    },

    // Restricted for Pengurus RT
    {
      id: 'sc_05',
      name: 'Melihat NIK & Kartu Keluarga Seluruh Warga Kompleks',
      category: 'Khusus Pengurus RT (Dibatasi)',
      requiredPermission: 'warga:view_all',
      moduleName: 'Data Warga',
      description: 'Membuka basis data kependudukan seluruh blok perumahan tanpa sensor NIK.',
    },
    {
      id: 'sc_06',
      name: 'Mengesahkan & Menandatangani Surat RT Resmi',
      category: 'Khusus Pengurus RT (Dibatasi)',
      requiredPermission: 'surat:approve',
      moduleName: 'Layanan Surat RT',
      description: 'Menerbitkan nomor register surat dan stempel resmi ketua RT.',
    },
    {
      id: 'sc_07',
      name: 'Memverifikasi Kas & Bukti Transfer Iuran Warga',
      category: 'Khusus Pengurus RT (Dibatasi)',
      requiredPermission: 'iuran:verify',
      moduleName: 'Iuran & Kas',
      description: 'Mengubah status pembayaran tagihan iuran rumah lain menjadi Lunas.',
    },
    {
      id: 'sc_08',
      name: 'Menghapus Data Warga (Pindah Domisili)',
      category: 'Khusus Pengurus RT (Dibatasi)',
      requiredPermission: 'warga:delete',
      moduleName: 'Data Warga',
      description: 'Menghapus catatan kependudukan rumah dari arsip perumahan.',
    },
  ];

  const runTest = (scenario: TestScenario) => {
    const isAllowed = canExecute(
      scenario.requiredPermission,
      scenario.name,
      scenario.moduleName
    );

    if (isAllowed) {
      setLastTestResult({
        scenarioName: scenario.name,
        permission: scenario.requiredPermission,
        verdict: 'allowed',
        timestamp: new Date().toLocaleTimeString('id-ID'),
        message: `HTTP 200 OK: Otoritas sah. Akun ${currentUser.name} (${currentUser.roleTitle}) berhak mengeksekusi operasi ini.`,
      });
    } else {
      setLastTestResult({
        scenarioName: scenario.name,
        permission: scenario.requiredPermission,
        verdict: 'denied',
        timestamp: new Date().toLocaleTimeString('id-ID'),
        message: `HTTP 403 FORBIDDEN: Akses diblokir oleh RBAC Kependudukan RT. Izin "${scenario.requiredPermission}" tidak dimiliki oleh akun Warga Penghuni untuk menjaga privasi lingkungan.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Laboratorium Interaktif Hak Akses: Pengurus RT vs Warga
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              Live Test RBAC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Uji proteksi data kependudukan dan hak akses administrasi RT dengan menekan tombol uji coba di bawah.
          </p>
        </div>

        <button
          type="button"
          onClick={() => switchRolePersona(isAdmin ? 'user' : 'admin')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-xs self-start md:self-auto ${
            isAdmin
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ganti Peran ke {isAdmin ? 'Warga Penghuni' : 'Pengurus RT'}</span>
        </button>
      </div>

      {/* State banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          isAdmin
            ? 'bg-indigo-50 border-indigo-200 text-indigo-950'
            : 'bg-emerald-50 border-emerald-200 text-emerald-950'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl text-white ${
              isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'
            }`}
          >
            {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Home className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sedang Menguji Sebagai:
            </div>
            <div className="text-base font-extrabold flex items-center gap-2">
              <span>{currentUser.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${
                  isAdmin
                    ? 'bg-indigo-200 text-indigo-900'
                    : 'bg-emerald-200 text-emerald-900'
                }`}
              >
                {currentUser.roleTitle}
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-right hidden sm:block">
          <span className="text-slate-500">Hasil uji simulasi:</span>
          <p className="font-semibold">
            {isAdmin
              ? '✅ Seluruh 8 operasi diizinkan untuk Pengurus RT'
              : '🛡️ 4 operasi diblokir oleh filter privasi (403 Forbidden)'}
          </p>
        </div>
      </div>

      {/* Terminal log output */}
      {lastTestResult && (
        <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 text-white space-y-2 shadow-lg animate-in fade-in">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="font-mono text-slate-400 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Log Mesin Kebijakan RBAC Pendataan Warga</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {lastTestResult.timestamp}
            </span>
          </div>

          <div className="flex items-start gap-3 pt-1">
            {lastTestResult.verdict === 'allowed' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-xs">
              <div className="font-bold flex items-center gap-2">
                <span>{lastTestResult.scenarioName}</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  [{lastTestResult.permission}]
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-extrabold ${
                    lastTestResult.verdict === 'allowed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {lastTestResult.verdict.toUpperCase()}
                </span>
              </div>
              <p
                className={`font-mono text-[11px] ${
                  lastTestResult.verdict === 'allowed' ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {lastTestResult.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scenarios */}
      <div className="space-y-6">
        {/* Section 1: Allowed for Warga */}
        <div>
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Operasi Mandiri Warga Penghuni (Terbuka untuk Semua Warga)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scenarios
              .filter((s) => s.category === 'Diizinkan untuk Warga')
              .map((sc) => {
                const has = hasPermission(sc.requiredPermission);
                return (
                  <div
                    key={sc.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {sc.moduleName}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                          {sc.requiredPermission}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">{sc.name}</h4>
                      <p className="text-[11px] text-slate-500">{sc.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => runTest(sc)}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-emerald-600" />
                      <span>Uji Eksekusi (Diizinkan)</span>
                    </button>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Section 2: Restricted to RT Committee */}
        <div>
          <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-600" />
            <span>Operasi Istimewa Administrasi RT (Dibatasi untuk Warga Biasa)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scenarios
              .filter((s) => s.category === 'Khusus Pengurus RT (Dibatasi)')
              .map((sc) => {
                const has = hasPermission(sc.requiredPermission);
                return (
                  <div
                    key={sc.id}
                    className={`rounded-2xl border p-4 shadow-2xs transition-all flex flex-col justify-between space-y-3 ${
                      has
                        ? 'bg-white border-slate-200 hover:border-slate-300'
                        : 'bg-rose-50/20 border-rose-200/60 hover:border-rose-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-rose-700/80">
                          {sc.moduleName}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-rose-100/70 rounded text-rose-800">
                          {sc.requiredPermission}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">{sc.name}</h4>
                      <p className="text-[11px] text-slate-500">{sc.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => runTest(sc)}
                      className={`w-full py-2 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
                        isAdmin
                          ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isAdmin ? 'Uji Akses Pengurus RT (Diizinkan)' : 'Coba Akses Terlarang (Tes 403)'}</span>
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
