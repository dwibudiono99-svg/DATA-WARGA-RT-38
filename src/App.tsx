/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RBACProvider, useRBAC } from './context/RBACContext';
import { Navbar } from './components/Navbar';
import { RoleGuardBanner } from './components/RoleGuardBanner';
import { AccessDeniedModal } from './components/AccessDeniedModal';
import { AuthModal } from './components/AuthModal';
import { ScanKKModal } from './components/ScanKKModal';
import { FormPendataanModelKK } from './components/FormPendataanModelKK';
import { WebHostingPosterModal } from './components/WebHostingPosterModal';

// Admin / Pengurus RT Views
import { RTDashboard } from './components/WargaView/RTDashboard';
import { DataWargaManagement } from './components/WargaView/DataWargaManagement';
import { IuranManagement } from './components/WargaView/IuranManagement';
import { LayananSuratRT } from './components/WargaView/LayananSuratRT';
import { LaporanLingkunganView } from './components/WargaView/LaporanLingkunganView';
import { PetugasKeamananView } from './components/PetugasKeamananView';
import { PermissionMatrix } from './components/AdminView/PermissionMatrix';
import { AuditLogViewer } from './components/AdminView/AuditLogViewer';
import { PelaporanDanBackupView } from './components/AdminView/PelaporanDanBackupView';

// Warga Penghuni Views
import { WargaDashboard } from './components/WargaView/WargaDashboard';
import { DataRumahSaya } from './components/WargaView/DataRumahSaya';
import { WargaSandbox } from './components/WargaView/WargaSandbox';

import { Home, Shield, RotateCcw, CheckCircle2, Globe, Copy, Check } from 'lucide-react';

function AppContent() {
  const { currentUser, resetAllToDefault, infoPerumahan } = useRBAC();
  const isAdmin = currentUser.role === 'admin';

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>(isAdmin ? 'dashboard' : 'user-dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScanKKOpen, setIsScanKKOpen] = useState(false);
  const [scanKKTab, setScanKKTab] = useState<'batch_5kk' | 'dukcapil_nik' | 'camera' | 'upload' | 'preset'>('batch_5kk');
  const [isGlobalKKFormOpen, setIsGlobalKKFormOpen] = useState(false);
  const [globalKKFormData, setGlobalKKFormData] = useState<any>(null);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [copiedFooter, setCopiedFooter] = useState(false);

  const handleOpenScanKK = (tab: 'batch_5kk' | 'dukcapil_nik' | 'camera' | 'upload' | 'preset' = 'batch_5kk') => {
    setScanKKTab(tab);
    setIsScanKKOpen(true);
  };

  const defaultHostingUrl =
    typeof window !== 'undefined'
      ? (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1'))
        ? 'https://ais-pre-77zpadwefwxzehalu26qkm-513616529310.asia-east1.run.app'
        : window.location.origin
      : 'https://ais-pre-77zpadwefwxzehalu26qkm-513616529310.asia-east1.run.app';

  const copyFooterUrl = async () => {
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
      setCopiedFooter(true);
      setTimeout(() => setCopiedFooter(false), 2000);
    } catch {
      setCopiedFooter(true);
      setTimeout(() => setCopiedFooter(false), 2000);
    }
  };

  // Sync tab if role switches
  React.useEffect(() => {
    if (isAdmin && (currentTab === 'user-dashboard' || currentTab === 'data-saya' || currentTab === 'sandbox')) {
      setCurrentTab('dashboard');
    } else if (!isAdmin && (currentTab === 'dashboard' || currentTab === 'warga' || currentTab === 'matrix' || currentTab === 'audit' || currentTab === 'pelaporan')) {
      setCurrentTab('user-dashboard');
    }
  }, [isAdmin]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Dynamic Role & Location Banner */}
      <RoleGuardBanner />

      {/* Main Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenScanKK={() => handleOpenScanKK('batch_5kk')}
        onOpenWebHosting={() => setIsPosterModalOpen(true)}
      />

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Render Tab Views according to Role & Active Tab */}
        {isAdmin ? (
          <>
            {currentTab === 'dashboard' && (
              <RTDashboard
                onNavigateTab={setCurrentTab}
                onOpenTambahWarga={() => setCurrentTab('warga')}
                onOpenScanKK={() => handleOpenScanKK('batch_5kk')}
                onOpenPrintPoster={() => setIsPosterModalOpen(true)}
              />
            )}
            {currentTab === 'warga' && (
              <DataWargaManagement onOpenScanKK={(tab) => handleOpenScanKK(tab || 'batch_5kk')} />
            )}
            {currentTab === 'iuran' && <IuranManagement />}
            {currentTab === 'surat' && <LayananSuratRT />}
            {currentTab === 'keamanan' && <PetugasKeamananView />}
            {currentTab === 'pelaporan' && <PelaporanDanBackupView />}
            {currentTab === 'laporan' && <LaporanLingkunganView />}
            {currentTab === 'matrix' && <PermissionMatrix />}
            {currentTab === 'audit' && <AuditLogViewer />}
          </>
        ) : (
          <>
            {currentTab === 'user-dashboard' && (
              <WargaDashboard
                onNavigateTab={setCurrentTab}
                onOpenScanKK={() => handleOpenScanKK('batch_5kk')}
                onOpenPrintPoster={() => setIsPosterModalOpen(true)}
              />
            )}
            {currentTab === 'data-saya' && <DataRumahSaya />}
            {currentTab === 'bayar-iuran' && <IuranManagement />}
            {currentTab === 'ajukan-surat' && <LayananSuratRT />}
            {currentTab === 'keamanan' && <PetugasKeamananView />}
            {currentTab === 'lapor-tamu' && <LaporanLingkunganView />}
            {currentTab === 'sandbox' && <WargaSandbox />}
          </>
        )}
      </main>

      {/* Global Modals */}
      <AccessDeniedModal />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <ScanKKModal
        isOpen={isScanKKOpen}
        onClose={() => setIsScanKKOpen(false)}
        initialTab={scanKKTab}
        onSuccessRegistered={() => {
          if (isAdmin) {
            setCurrentTab('warga');
          }
        }}
        onOpenFormModelKK={(extracted) => {
          setIsScanKKOpen(false);
          setGlobalKKFormData(extracted);
          setIsGlobalKKFormOpen(true);
        }}
      />
      <FormPendataanModelKK
        isOpen={isGlobalKKFormOpen}
        onClose={() => {
          setIsGlobalKKFormOpen(false);
          setGlobalKKFormData(null);
        }}
        initialData={globalKKFormData}
        onOpenScanner={() => setIsScanKKOpen(true)}
        onSuccessSaved={() => {
          if (isAdmin) {
            setCurrentTab('warga');
          }
        }}
      />
      <WebHostingPosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Quick Hosting Access Ribbon in Footer */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Alamat Web Hosting Portal Warga:</span>
              <span className="font-mono font-bold text-emerald-900 select-all">{defaultHostingUrl}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={copyFooterUrl}
                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-800 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedFooter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedFooter ? 'Tersalin!' : 'Salin URL'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(true)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <span>Cetak Poster QR</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white">
                <Home className="w-3 h-3" />
              </div>
              <span className="font-semibold text-slate-800">
                SIM-Warga {infoPerumahan.rtRw} • {infoPerumahan.namaPerumahan}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="hidden sm:inline">Kel. {infoPerumahan.kelurahan}, Kec. {infoPerumahan.kecamatan}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sistem RBAC Lingkungan Terenkapsulasi
              </span>
              <button
                onClick={() => {
                  if (confirm('Kembalikan semua data warga dan iuran ke kondisi awal bawaan?')) {
                    resetAllToDefault();
                  }
                }}
                className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Data Demo</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <RBACProvider>
      <AppContent />
    </RBACProvider>
  );
}
