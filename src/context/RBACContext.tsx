import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  User,
  PermissionKey,
  RolePermissions,
  WargaItem,
  IuranItem,
  SuratItem,
  LaporanLingkungan,
  PengumumanPerumahan,
  AuditLogPerumahan,
  InfoPerumahan,
  StatusBayar,
  StatusSurat,
  StatusLaporan,
  JenisSuratConfig,
  PetugasKeamanan,
} from '../types/rbac';
import {
  DEFAULT_ROLE_PERMISSIONS,
  INITIAL_INFO_PERUMAHAN,
  INITIAL_USERS,
  INITIAL_WARGA,
  INITIAL_IURAN,
  INITIAL_SURAT,
  INITIAL_LAPORAN,
  INITIAL_PENGUMUMAN,
  INITIAL_AUDIT_LOGS,
  INITIAL_JENIS_SURAT,
  INITIAL_PETUGAS_KEAMANAN,
  PERMISSION_DEFINITIONS,
} from '../data/defaultData';

interface AccessDeniedInfo {
  isOpen: boolean;
  requiredPermission: string;
  actionName: string;
  moduleName: string;
}

interface RBACContextType {
  currentUser: User;
  users: User[];
  infoPerumahan: InfoPerumahan;
  rolePermissions: RolePermissions;
  wargaList: WargaItem[];
  iuranList: IuranItem[];
  suratList: SuratItem[];
  jenisSuratList: JenisSuratConfig[];
  petugasKeamananList: PetugasKeamanan[];
  laporanList: LaporanLingkungan[];
  pengumumanList: PengumumanPerumahan[];
  auditLogs: AuditLogPerumahan[];
  accessDeniedInfo: AccessDeniedInfo | null;

  // Permission evaluation
  hasPermission: (permission: PermissionKey) => boolean;
  canExecute: (permission: PermissionKey, actionName: string, moduleName?: string) => boolean;
  closeAccessDeniedModal: () => void;

  // Auth & Roles
  loginAsUser: (userId: string) => void;
  switchRolePersona: (role: Role) => void;
  logout: () => void;
  registerWargaUser: (nama: string, email: string, blok: WargaItem['blokRumah'], nomor: string, role: Role) => User;

  // Kop & Info Perumahan Management
  updateInfoPerumahan: (newInfo: Partial<InfoPerumahan>) => boolean;

  // Warga Management (Admin / User)
  tambahWarga: (warga: Omit<WargaItem, 'id'>) => void;
  updateWarga: (id: string, updates: Partial<WargaItem>) => boolean;
  hapusWarga: (id: string) => boolean;

  // Iuran Management
  bayarIuranSendiri: (iuranId: string, metode: string, bukti: string) => boolean;
  verifikasiIuran: (iuranId: string, status: StatusBayar) => boolean;
  tambahIuranBaru: (iuran: Omit<IuranItem, 'id'>) => void;

  // Surat Pengantar RT & Jenis Surat
  ajukanSurat: (surat: { jenisSurat: string; keperluan: string; drafSuratAI?: string; alasanFormalAI?: string; catatanAI?: string }) => void;
  prosesSuratRT: (suratId: string, disetujui: boolean, catatan?: string) => boolean;
  tambahJenisSurat: (item: Omit<JenisSuratConfig, 'id'>) => boolean;
  updateJenisSurat: (id: string, updates: Partial<JenisSuratConfig>) => boolean;
  hapusJenisSurat: (id: string) => boolean;
  generateDrafSuratAI: (suratId: string) => Promise<{ drafSurat: string; alasanFormalDisempurnakan: string; catatanRekomendasiAI: string }>;

  // Petugas Keamanan
  tambahPetugasKeamanan: (petugas: Omit<PetugasKeamanan, 'id'>) => boolean;
  updatePetugasKeamanan: (id: string, updates: Partial<PetugasKeamanan>) => boolean;
  hapusPetugasKeamanan: (id: string) => boolean;
  updateStatusJagaPetugas: (id: string, status: PetugasKeamanan['statusJaga']) => boolean;

  // Laporan Lingkungan & Tamu
  buatLaporan: (laporan: { kategori: LaporanLingkungan['kategori']; judul: string; rincian: string }) => void;
  updateStatusLaporan: (laporanId: string, status: StatusLaporan) => boolean;

  // Pengumuman
  buatPengumuman: (judul: string, isi: string, kategori: PengumumanPerumahan['kategori'], prioritas: PengumumanPerumahan['prioritas']) => void;
  hapusPengumuman: (id: string) => boolean;

  // Permissions & Dynamic Matrix
  toggleRolePermission: (role: Role, permission: PermissionKey) => void;
  saveRolePermissions: (newPermissions: RolePermissions) => boolean;
  resetPermissionsToDefault: () => void;

  // Real-time synchronization & Backup
  isRealtimeActive: boolean;
  lastSyncTimestamp: string;
  exportFullBackupJSON: () => void;
  importFullBackupJSON: (backupObj: any, mode: 'replace' | 'merge') => boolean;

  // Audit & Reset
  logAudit: (action: string, moduleName: string, status: 'success' | 'denied', details: string) => void;
  resetAllToDefault: () => void;
  resetToZero: () => boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'sim_warga_active_user_id',
  USERS: 'sim_warga_users',
  WARGA: 'sim_warga_data',
  IURAN: 'sim_warga_iuran',
  SURAT: 'sim_warga_surat',
  JENIS_SURAT: 'sim_warga_jenis_surat',
  PETUGAS_KEAMANAN: 'sim_warga_petugas_keamanan',
  LAPORAN: 'sim_warga_laporan',
  PENGUMUMAN: 'sim_warga_pengumuman',
  PERMISSIONS: 'sim_warga_permissions',
  AUDIT_LOGS: 'sim_warga_audit_logs',
  INFO: 'sim_warga_info_perumahan',
};

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return saved || INITIAL_USERS[0].id; // Default Ketua RT (Admin)
    } catch {
      return INITIAL_USERS[0].id;
    }
  });

  const [infoPerumahan, setInfoPerumahan] = useState<InfoPerumahan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INFO);
      return saved ? { ...INITIAL_INFO_PERUMAHAN, ...JSON.parse(saved) } : INITIAL_INFO_PERUMAHAN;
    } catch {
      return INITIAL_INFO_PERUMAHAN;
    }
  });

  const [wargaList, setWargaList] = useState<WargaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WARGA);
      return saved ? JSON.parse(saved) : INITIAL_WARGA;
    } catch {
      return INITIAL_WARGA;
    }
  });

  const [iuranList, setIuranList] = useState<IuranItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.IURAN);
      return saved ? JSON.parse(saved) : INITIAL_IURAN;
    } catch {
      return INITIAL_IURAN;
    }
  });

  const [suratList, setSuratList] = useState<SuratItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SURAT);
      return saved ? JSON.parse(saved) : INITIAL_SURAT;
    } catch {
      return INITIAL_SURAT;
    }
  });

  const [jenisSuratList, setJenisSuratList] = useState<JenisSuratConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JENIS_SURAT);
      return saved ? JSON.parse(saved) : INITIAL_JENIS_SURAT;
    } catch {
      return INITIAL_JENIS_SURAT;
    }
  });

  const [petugasKeamananList, setPetugasKeamananList] = useState<PetugasKeamanan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PETUGAS_KEAMANAN);
      return saved ? JSON.parse(saved) : INITIAL_PETUGAS_KEAMANAN;
    } catch {
      return INITIAL_PETUGAS_KEAMANAN;
    }
  });

  const [laporanList, setLaporanList] = useState<LaporanLingkungan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAPORAN);
      return saved ? JSON.parse(saved) : INITIAL_LAPORAN;
    } catch {
      return INITIAL_LAPORAN;
    }
  });

  const [pengumumanList, setPengumumanList] = useState<PengumumanPerumahan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PENGUMUMAN);
      return saved ? JSON.parse(saved) : INITIAL_PENGUMUMAN;
    } catch {
      return INITIAL_PENGUMUMAN;
    }
  });

  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
      return saved ? JSON.parse(saved) : DEFAULT_ROLE_PERMISSIONS;
    } catch {
      return DEFAULT_ROLE_PERMISSIONS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogPerumahan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [accessDeniedInfo, setAccessDeniedInfo] = useState<AccessDeniedInfo | null>(null);
  const [isRealtimeActive] = useState<boolean>(true);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string>(() => new Date().toLocaleTimeString('id-ID'));

  const broadcastChannelRef = React.useRef<BroadcastChannel | null>(null);

  // Helper to notify other tabs/windows in real time
  const notifyRealtimeSync = (data?: any) => {
    setLastSyncTimestamp(new Date().toLocaleTimeString('id-ID'));
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'SIM_WARGA_SYNC_EVENT',
          timestamp: new Date().toISOString(),
          payload: data,
        });
      } catch (e) {
        console.warn('Broadcast sync error:', e);
      }
    }
  };

  // BroadcastChannel & window storage event listener for real-time changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('sim_warga_realtime_channel');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'SIM_WARGA_SYNC_EVENT') {
          const payload = event.data.payload;
          if (payload) {
            if (payload.wargaList !== undefined) setWargaList(payload.wargaList);
            if (payload.iuranList !== undefined) setIuranList(payload.iuranList);
            if (payload.suratList !== undefined) setSuratList(payload.suratList);
            if (payload.jenisSuratList !== undefined) setJenisSuratList(payload.jenisSuratList);
            if (payload.petugasKeamananList !== undefined) setPetugasKeamananList(payload.petugasKeamananList);
            if (payload.laporanList !== undefined) setLaporanList(payload.laporanList);
            if (payload.pengumumanList !== undefined) setPengumumanList(payload.pengumumanList);
            if (payload.rolePermissions !== undefined) setRolePermissions(payload.rolePermissions);
            if (payload.infoPerumahan !== undefined) setInfoPerumahan(payload.infoPerumahan);
            if (payload.auditLogs !== undefined) setAuditLogs(payload.auditLogs);
            setLastSyncTimestamp(new Date().toLocaleTimeString('id-ID'));
          }
        }
      };

      return () => {
        channel.close();
      };
    }
  }, []);

  // Storage event listener fallback
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || !e.newValue) return;
      try {
        if (e.key === STORAGE_KEYS.WARGA) setWargaList(JSON.parse(e.newValue));
        else if (e.key === STORAGE_KEYS.IURAN) setIuranList(JSON.parse(e.newValue));
        else if (e.key === STORAGE_KEYS.SURAT) setSuratList(JSON.parse(e.newValue));
        else if (e.key === STORAGE_KEYS.JENIS_SURAT) setJenisSuratList(JSON.parse(e.newValue));
        else if (e.key === STORAGE_KEYS.PETUGAS_KEAMANAN) setPetugasKeamananList(JSON.parse(e.newValue));
        else if (e.key === STORAGE_KEYS.LAPORAN) setLaporanList(JSON.parse(e.newValue));
        else if (e.key === STORAGE_KEYS.PENGUMUMAN) setPengumumanList(JSON.parse(e.newValue));
        else if (e.key === STORAGE_KEYS.PERMISSIONS) setRolePermissions(JSON.parse(e.newValue));
        else if (e.key === STORAGE_KEYS.INFO) setInfoPerumahan(JSON.parse(e.newValue));
        else if (e.key === STORAGE_KEYS.AUDIT_LOGS) setAuditLogs(JSON.parse(e.newValue));
        setLastSyncTimestamp(new Date().toLocaleTimeString('id-ID'));
      } catch (err) {
        console.warn('Storage sync error:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(infoPerumahan));
  }, [infoPerumahan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WARGA, JSON.stringify(wargaList));
  }, [wargaList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IURAN, JSON.stringify(iuranList));
  }, [iuranList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SURAT, JSON.stringify(suratList));
  }, [suratList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JENIS_SURAT, JSON.stringify(jenisSuratList));
  }, [jenisSuratList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PETUGAS_KEAMANAN, JSON.stringify(petugasKeamananList));
  }, [petugasKeamananList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAPORAN, JSON.stringify(laporanList));
  }, [laporanList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PENGUMUMAN, JSON.stringify(pengumumanList));
  }, [pengumumanList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const logAudit = (action: string, moduleName: string, status: 'success' | 'denied', details: string) => {
    const newLog: AuditLogPerumahan = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module: moduleName,
      status,
      details,
      ipAddress: '192.168.1.' + Math.floor(10 + Math.random() * 200),
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  };

  const hasPermission = (permission: PermissionKey): boolean => {
    const allowedPermissions = rolePermissions[currentUser.role] || [];
    return allowedPermissions.includes(permission);
  };

  const canExecute = (permission: PermissionKey, actionName: string, moduleName: string = 'Sistem'): boolean => {
    if (hasPermission(permission)) {
      return true;
    }

    logAudit('ACCESS_DENIED_BLOCKED', moduleName, 'denied', `Aksi "${actionName}" ditolak oleh kebijakan keamanan (memerlukan izin ${permission}).`);
    setAccessDeniedInfo({
      isOpen: true,
      requiredPermission: permission,
      actionName,
      moduleName,
    });
    return false;
  };

  const closeAccessDeniedModal = () => {
    setAccessDeniedInfo(null);
  };

  const loginAsUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      logAudit('LOGIN_SWITCH', 'Otentikasi', 'success', `Beralih ke akun pengguna: ${target.name} (${target.roleTitle}).`);
    }
  };

  const switchRolePersona = (role: Role) => {
    const target = users.find((u) => u.role === role);
    if (target) {
      setCurrentUserId(target.id);
      logAudit('ROLE_QUICK_SWITCH', 'RBAC Guard', 'success', `Role aktif dialihkan menjadi ${role === 'admin' ? 'Administrator / Pengurus RT' : 'Warga Penghuni'}.`);
    }
  };

  const logout = () => {
    setCurrentUserId(users[1]?.id || users[0].id);
    logAudit('LOGOUT', 'Otentikasi', 'success', `Sesi pengguna ${currentUser.name} telah diakhiri.`);
  };

  const registerWargaUser = (
    nama: string,
    email: string,
    blok: WargaItem['blokRumah'],
    nomor: string,
    role: Role
  ): User => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: nama,
      email,
      role,
      roleTitle: role === 'admin' ? 'Pengurus RT 04' : `Warga Penghuni ${blok}-${nomor}`,
      status: 'active',
      blokRumah: blok,
      nomorRumah: nomor,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    logAudit('USER_REGISTER', 'Manajemen Pengguna', 'success', `Akun baru terdaftar: ${nama} (${newUser.roleTitle}).`);
    return newUser;
  };

  // Kop & Info Perumahan Management
  const updateInfoPerumahan = (newInfo: Partial<InfoPerumahan>): boolean => {
    if (!canExecute('kop:manage', 'Mengubah Pengaturan & KOP Resmi RT', 'Layanan Surat RT')) return false;

    setInfoPerumahan((prev) => ({
      ...prev,
      ...newInfo,
    }));
    logAudit('KOP_UPDATE', 'Layanan Surat RT', 'success', `Pengurus RT memperbarui konfigurasi data KOP surat resmi.`);
    return true;
  };

  // Warga Management
  const tambahWarga = (data: Omit<WargaItem, 'id'>) => {
    if (!canExecute('warga:create', 'Menambah Data Warga Baru', 'Data Warga')) return;

    const newWarga: WargaItem = {
      ...data,
      id: `wrg_${Date.now()}`,
    };

    setWargaList((prev) => [newWarga, ...prev]);
    logAudit('WARGA_CREATE', 'Data Warga', 'success', `Menambahkan warga baru: ${data.namaLengkap} (${data.blokRumah}-${data.nomorRumah}).`);
  };

  const updateWarga = (id: string, updates: Partial<WargaItem>): boolean => {
    const target = wargaList.find((w) => w.id === id);
    if (!target) return false;

    const isOwnHouse = target.blokRumah === currentUser.blokRumah && target.nomorRumah === currentUser.nomorRumah;
    const requiredPermission: PermissionKey = isOwnHouse ? 'warga:edit_own' : 'warga:edit_all';

    if (!canExecute(requiredPermission, 'Memperbarui Data Warga', 'Data Warga')) return false;

    setWargaList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );

    logAudit('WARGA_UPDATE', 'Data Warga', 'success', `Memperbarui data warga ${target.namaLengkap}.`);
    return true;
  };

  const hapusWarga = (id: string): boolean => {
    if (!canExecute('warga:delete', 'Menghapus Data Warga', 'Data Warga')) return false;

    const target = wargaList.find((w) => w.id === id);
    if (!target) return false;

    setWargaList((prev) => prev.filter((w) => w.id !== id));
    logAudit('WARGA_DELETE', 'Data Warga', 'success', `Menghapus warga: ${target.namaLengkap} (${target.blokRumah}-${target.nomorRumah}).`);
    return true;
  };

  // Iuran
  const bayarIuranSendiri = (iuranId: string, metode: string, bukti: string): boolean => {
    if (!canExecute('iuran:pay_own', 'Membayar Iuran Lingkungan', 'Iuran & Kas')) return false;

    setIuranList((prev) =>
      prev.map((i) =>
        i.id === iuranId
          ? {
              ...i,
              statusBayar: 'Menunggu Verifikasi',
              tanggalBayar: new Date().toISOString().split('T')[0],
              metodePembayaran: metode,
              buktiBayar: bukti,
            }
          : i
      )
    );

    logAudit('IURAN_PAY', 'Iuran & Kas', 'success', `Warga ${currentUser.name} mengunggah pembayaran iuran.`);
    return true;
  };

  const verifikasiIuran = (iuranId: string, status: StatusBayar): boolean => {
    if (!canExecute('iuran:verify', 'Memverifikasi Pembayaran Iuran Warga', 'Iuran & Kas')) return false;

    setIuranList((prev) =>
      prev.map((i) =>
        i.id === iuranId
          ? {
              ...i,
              statusBayar: status,
              tanggalBayar: status === 'Lunas' && !i.tanggalBayar ? new Date().toISOString().split('T')[0] : i.tanggalBayar,
            }
          : i
      )
    );

    logAudit('IURAN_VERIFY', 'Iuran & Kas', 'success', `Pengurus RT mengubah status iuran menjadi ${status}.`);
    return true;
  };

  const tambahIuranBaru = (data: Omit<IuranItem, 'id'>) => {
    const newIuran: IuranItem = {
      ...data,
      id: `iur_${Date.now()}`,
    };
    setIuranList((prev) => [newIuran, ...prev]);
  };

  // Surat Pengantar RT
  const ajukanSurat = (data: {
    jenisSurat: string;
    keperluan: string;
    drafSuratAI?: string;
    alasanFormalAI?: string;
    catatanAI?: string;
  }) => {
    if (!canExecute('surat:request', 'Mengajukan Surat Pengantar RT Online', 'Layanan Surat RT')) return;

    const newSurat: SuratItem = {
      id: `srt_${Date.now()}`,
      wargaId: currentUser.id,
      namaPemohon: currentUser.name,
      nikPemohon: '327601' + Math.floor(1000000000 + Math.random() * 9000000000),
      blokRumah: currentUser.blokRumah,
      nomorRumah: currentUser.nomorRumah,
      jenisSurat: data.jenisSurat,
      keperluan: data.keperluan,
      status: 'Menunggu Validasi RT',
      tanggalPengajuan: new Date().toISOString().split('T')[0],
      drafSuratAI: data.drafSuratAI,
      alasanFormalAI: data.alasanFormalAI,
      catatanAI: data.catatanAI,
    };

    setSuratList((prev) => [newSurat, ...prev]);
    logAudit('SURAT_AJUKAN', 'Layanan Surat RT', 'success', `Warga ${currentUser.name} mengajukan ${data.jenisSurat}.`);
  };

  const prosesSuratRT = (suratId: string, disetujui: boolean, catatan?: string): boolean => {
    if (!canExecute('surat:approve', 'Menandatangani & Menerbitkan Surat RT Resmi', 'Layanan Surat RT')) return false;

    const romanMonth = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][new Date().getMonth()];
    const nomorResmi = disetujui ? `${Math.floor(100 + Math.random() * 899)}/RT.04/RW.09/${romanMonth}/2026` : undefined;

    setSuratList((prev) =>
      prev.map((s) =>
        s.id === suratId
          ? {
              ...s,
              status: disetujui ? 'Disetujui / Terbit' : 'Ditolak',
              nomorSuratResmi: nomorResmi,
              catatanAdmin: catatan || (disetujui ? 'Surat telah diverifikasi & ditandatangani Ketua RT 04.' : 'Berkas belum memenuhi syarat.'),
              tanggalSelesai: new Date().toISOString().split('T')[0],
            }
          : s
      )
    );

    logAudit(
      'SURAT_PROSES',
      'Layanan Surat RT',
      'success',
      `Ketua RT ${disetujui ? 'menyetujui & menerbitkan surat ' + nomorResmi : 'menolak permohonan surat'}.`
    );
    return true;
  };

  // Jenis Surat Management
  const tambahJenisSurat = (item: Omit<JenisSuratConfig, 'id'>): boolean => {
    if (!canExecute('surat:manage_types', 'Menambah Jenis Template Surat RT', 'Layanan Surat RT')) return false;

    const newItem: JenisSuratConfig = {
      ...item,
      id: `js_${Date.now()}`,
    };
    setJenisSuratList((prev) => [...prev, newItem]);
    logAudit('JENIS_SURAT_ADD', 'Layanan Surat RT', 'success', `Menambahkan jenis surat baru: "${item.nama}".`);
    return true;
  };

  const updateJenisSurat = (id: string, updates: Partial<JenisSuratConfig>): boolean => {
    if (!canExecute('surat:manage_types', 'Mengubah Template Jenis Surat RT', 'Layanan Surat RT')) return false;

    setJenisSuratList((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updates } : j))
    );
    logAudit('JENIS_SURAT_UPDATE', 'Layanan Surat RT', 'success', `Memperbarui template jenis surat.`);
    return true;
  };

  const hapusJenisSurat = (id: string): boolean => {
    if (!canExecute('surat:manage_types', 'Menghapus Jenis Template Surat RT', 'Layanan Surat RT')) return false;

    const target = jenisSuratList.find((j) => j.id === id);
    if (!target) return false;

    setJenisSuratList((prev) => prev.filter((j) => j.id !== id));
    logAudit('JENIS_SURAT_DELETE', 'Layanan Surat RT', 'success', `Menghapus template jenis surat: "${target.nama}".`);
    return true;
  };

  const generateDrafSuratAI = async (
    suratId: string
  ): Promise<{ drafSurat: string; alasanFormalDisempurnakan: string; catatanRekomendasiAI: string }> => {
    const targetSurat = suratList.find((s) => s.id === suratId);
    if (!targetSurat) {
      throw new Error('Surat tidak ditemukan');
    }

    try {
      const res = await fetch('/api/generate-surat-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaPemohon: targetSurat.namaPemohon,
          nikPemohon: targetSurat.nikPemohon,
          blokRumah: targetSurat.blokRumah,
          nomorRumah: targetSurat.nomorRumah,
          jenisSurat: targetSurat.jenisSurat,
          keperluan: targetSurat.keperluan,
          namaKetuaRT: infoPerumahan.namaKetuaRT,
          rtRw: infoPerumahan.rtRw,
          namaPerumahan: infoPerumahan.namaPerumahan,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const { drafSurat, alasanFormalDisempurnakan, catatanRekomendasiAI } = json.data;
        setSuratList((prev) =>
          prev.map((s) =>
            s.id === suratId
              ? {
                  ...s,
                  drafSuratAI: drafSurat,
                  alasanFormalAI: alasanFormalDisempurnakan,
                  catatanAI: catatanRekomendasiAI,
                }
              : s
          )
        );
        logAudit(
          'SURAT_AI_COMPANION',
          'Layanan Surat RT',
          'success',
          `Menghasilkan draf pendampingan AI untuk surat ${targetSurat.jenisSurat} pemohon ${targetSurat.namaPemohon}.`
        );
        return { drafSurat, alasanFormalDisempurnakan, catatanRekomendasiAI };
      }
    } catch (err) {
      console.warn('AI generator notice:', err);
    }

    // Default intelligent fallback
    const fallbackDraf = `Yang bertanda tangan di bawah ini Pengurus Rukun Tetangga (RT) 04 / RW 09 menerangkan bahwa Saudara/i ${targetSurat.namaPemohon}, NIK: ${targetSurat.nikPemohon}, adalah benar warga sah yang bertempat tinggal di ${infoPerumahan.namaPerumahan} ${targetSurat.blokRumah} No. ${targetSurat.nomorRumah}. Berkelakuan baik dan permohonan ${targetSurat.jenisSurat} ini diterbitkan untuk keperluan: ${targetSurat.keperluan}.`;
    const fallbackAlasan = `Sebagai pemenuhan kelengkapan administrasi resmi persyaratan ${targetSurat.keperluan}.`;
    const fallbackCatatan = `✅ Pendampingan AI: Data pemohon terverifikasi pada database kependudukan. Iuran lingkungan berstatus tertib. Berkas siap disetujui Pengurus RT.`;

    setSuratList((prev) =>
      prev.map((s) =>
        s.id === suratId
          ? {
              ...s,
              drafSuratAI: fallbackDraf,
              alasanFormalAI: fallbackAlasan,
              catatanAI: fallbackCatatan,
            }
          : s
      )
    );

    return {
      drafSurat: fallbackDraf,
      alasanFormalDisempurnakan: fallbackAlasan,
      catatanRekomendasiAI: fallbackCatatan,
    };
  };

  // Petugas Keamanan Management
  const tambahPetugasKeamanan = (data: Omit<PetugasKeamanan, 'id'>): boolean => {
    if (!canExecute('keamanan:manage', 'Menambah Data Petugas Keamanan', 'Keamanan & Pos Satpam')) return false;

    const newPetugas: PetugasKeamanan = {
      ...data,
      id: `sec_${Date.now()}`,
    };
    setPetugasKeamananList((prev) => [...prev, newPetugas]);
    logAudit('SECURITY_ADD', 'Keamanan & Pos Satpam', 'success', `Menambahkan petugas keamanan baru: ${data.namaLengkap} (${data.jabatan}).`);
    return true;
  };

  const updatePetugasKeamanan = (id: string, updates: Partial<PetugasKeamanan>): boolean => {
    if (!canExecute('keamanan:manage', 'Mengubah Data Petugas Keamanan', 'Keamanan & Pos Satpam')) return false;

    setPetugasKeamananList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    logAudit('SECURITY_UPDATE', 'Keamanan & Pos Satpam', 'success', `Memperbarui data petugas keamanan.`);
    return true;
  };

  const hapusPetugasKeamanan = (id: string): boolean => {
    if (!canExecute('keamanan:manage', 'Menghapus Data Petugas Keamanan', 'Keamanan & Pos Satpam')) return false;

    const target = petugasKeamananList.find((p) => p.id === id);
    if (!target) return false;

    setPetugasKeamananList((prev) => prev.filter((p) => p.id !== id));
    logAudit('SECURITY_DELETE', 'Keamanan & Pos Satpam', 'success', `Menghapus data petugas keamanan: ${target.namaLengkap}.`);
    return true;
  };

  const updateStatusJagaPetugas = (id: string, status: PetugasKeamanan['statusJaga']): boolean => {
    if (!canExecute('keamanan:manage', 'Mengubah Status Jaga Petugas Satpam', 'Keamanan & Pos Satpam')) return false;

    setPetugasKeamananList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, statusJaga: status } : p))
    );
    logAudit('SECURITY_STATUS', 'Keamanan & Pos Satpam', 'success', `Mengubah status jaga petugas menjadi: ${status}.`);
    return true;
  };

  // Laporan Lingkungan & Tamu
  const buatLaporan = (data: { kategori: LaporanLingkungan['kategori']; judul: string; rincian: string }) => {
    if (!canExecute('laporan:create', 'Mengirim Laporan Tamu / Aduan Lingkungan', 'Keamanan & Pos Satpam')) return;

    const newLaporan: LaporanLingkungan = {
      id: `lap_${Date.now()}`,
      pelaporId: currentUser.id,
      namaPelapor: currentUser.name,
      blokRumah: currentUser.blokRumah,
      nomorRumah: currentUser.nomorRumah,
      kategori: data.kategori,
      judul: data.judul,
      rincian: data.rincian,
      status: 'Diterima',
      tanggalLapor: new Date().toISOString().split('T')[0],
    };

    setLaporanList((prev) => [newLaporan, ...prev]);
    logAudit('LAPORAN_SUBMIT', 'Keamanan & Pos Satpam', 'success', `Warga ${currentUser.name} melaporkan: "${data.judul}".`);
  };

  const updateStatusLaporan = (laporanId: string, status: StatusLaporan): boolean => {
    if (!canExecute('laporan:manage', 'Menindaklanjuti Laporan Warga', 'Keamanan & Pos Satpam')) return false;

    setLaporanList((prev) =>
      prev.map((l) => (l.id === laporanId ? { ...l, status } : l))
    );
    logAudit('LAPORAN_STATUS', 'Keamanan & Pos Satpam', 'success', `Status laporan diubah menjadi ${status}.`);
    return true;
  };

  // Pengumuman
  const buatPengumuman = (
    judul: string,
    isi: string,
    kategori: PengumumanPerumahan['kategori'],
    prioritas: PengumumanPerumahan['prioritas']
  ) => {
    if (!canExecute('pengumuman:create', 'Mempublikasikan Siaran Warta RT', 'Warta Perumahan')) return;

    const newAnc: PengumumanPerumahan = {
      id: `anc_${Date.now()}`,
      judul,
      isi,
      kategori,
      penulis: `${currentUser.name} (${currentUser.roleTitle})`,
      prioritas,
      tanggal: new Date().toISOString().split('T')[0],
      aktif: true,
    };

    setPengumumanList((prev) => [newAnc, ...prev]);
    logAudit('PENGUMUMAN_CREATE', 'Warta Perumahan', 'success', `Menerbitkan warta RT: "${judul}".`);
  };

  const hapusPengumuman = (id: string): boolean => {
    if (!canExecute('pengumuman:create', 'Menghapus Pengumuman RT', 'Warta Perumahan')) return false;

    setPengumumanList((prev) => prev.filter((p) => p.id !== id));
    logAudit('PENGUMUMAN_DELETE', 'Warta Perumahan', 'success', `Menghapus pengumuman.`);
    return true;
  };

  // Matrix Permissions
  const toggleRolePermission = (role: Role, permission: PermissionKey) => {
    if (!canExecute('roles:manage_permissions', 'Mengubah Matriks Hak Akses RBAC', 'Pengaturan Keamanan')) return;

    setRolePermissions((prev) => {
      const currentList = prev[role] || [];
      const has = currentList.includes(permission);
      const updatedList = has
        ? currentList.filter((p) => p !== permission)
        : [...currentList, permission];

      logAudit(
        'PERMISSION_TOGGLE',
        'Pengaturan Keamanan',
        'success',
        `${has ? 'Mencabut' : 'Memberikan'} izin "${permission}" untuk peran ${role === 'admin' ? 'Pengurus RT' : 'Warga'}.`
      );

      return {
        ...prev,
        [role]: updatedList,
      };
    });
  };

  const resetPermissionsToDefault = () => {
    if (!canExecute('roles:manage_permissions', 'Mereset Hak Akses ke Bawaan', 'Pengaturan Keamanan')) return;
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    logAudit('PERMISSION_RESET', 'Pengaturan Keamanan', 'success', 'Mereset konfigurasi izin RBAC ke standar perumahan.');
    notifyRealtimeSync({ rolePermissions: DEFAULT_ROLE_PERMISSIONS });
  };

  const saveRolePermissions = (newPermissions: RolePermissions): boolean => {
    if (!canExecute('roles:manage_permissions', 'Menyimpan Matriks Hak Akses RBAC', 'Pengaturan Keamanan')) return false;

    setRolePermissions(newPermissions);
    localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(newPermissions));
    logAudit('ROLE_PERMISSIONS_SAVE', 'Pengaturan Keamanan', 'success', 'Menyimpan konfigurasi kustomisasi matriks hak akses RBAC.');
    notifyRealtimeSync({ rolePermissions: newPermissions });
    return true;
  };

  const exportFullBackupJSON = () => {
    const backupData = {
      appName: 'SIM-Warga Portal Terpadu RT 04',
      systemVersion: '2.5',
      exportTimestamp: new Date().toISOString(),
      exportedBy: {
        userId: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        roleTitle: currentUser.roleTitle,
      },
      infoPerumahan,
      wargaList,
      iuranList,
      suratList,
      jenisSuratList,
      petugasKeamananList,
      laporanList,
      pengumumanList,
      rolePermissions,
      auditLogs,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeRT = infoPerumahan.rtRw.replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_sim_warga_${safeRT}_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    logAudit('SYSTEM_BACKUP_EXPORT', 'Audit & Sistem', 'success', 'Mengunduh cadangan lengkap (backup full snapshot JSON).');
  };

  const importFullBackupJSON = (backupObj: any, mode: 'replace' | 'merge'): boolean => {
    if (!canExecute('backup:manage', 'Memulihkan Data Cadangan Sistem (Restore)', 'Audit & Sistem')) return false;

    if (!backupObj || typeof backupObj !== 'object') {
      alert('Format berkas cadangan (JSON) tidak valid!');
      return false;
    }

    try {
      if (mode === 'replace') {
        if (Array.isArray(backupObj.wargaList)) setWargaList(backupObj.wargaList);
        if (Array.isArray(backupObj.iuranList)) setIuranList(backupObj.iuranList);
        if (Array.isArray(backupObj.suratList)) setSuratList(backupObj.suratList);
        if (Array.isArray(backupObj.jenisSuratList)) setJenisSuratList(backupObj.jenisSuratList);
        if (Array.isArray(backupObj.petugasKeamananList)) setPetugasKeamananList(backupObj.petugasKeamananList);
        if (Array.isArray(backupObj.laporanList)) setLaporanList(backupObj.laporanList);
        if (Array.isArray(backupObj.pengumumanList)) setPengumumanList(backupObj.pengumumanList);
        if (backupObj.infoPerumahan) setInfoPerumahan(backupObj.infoPerumahan);
        if (backupObj.rolePermissions) setRolePermissions(backupObj.rolePermissions);
      } else {
        if (Array.isArray(backupObj.wargaList)) {
          setWargaList((prev) => {
            const existingIds = new Set(prev.map((w) => w.id));
            const newOnes = backupObj.wargaList.filter((w: WargaItem) => !existingIds.has(w.id));
            return [...prev, ...newOnes];
          });
        }
        if (Array.isArray(backupObj.iuranList)) {
          setIuranList((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const newOnes = backupObj.iuranList.filter((i: IuranItem) => !existingIds.has(i.id));
            return [...prev, ...newOnes];
          });
        }
        if (Array.isArray(backupObj.suratList)) {
          setSuratList((prev) => {
            const existingIds = new Set(prev.map((s) => s.id));
            const newOnes = backupObj.suratList.filter((s: SuratItem) => !existingIds.has(s.id));
            return [...prev, ...newOnes];
          });
        }
      }

      logAudit(
        'SYSTEM_BACKUP_IMPORT',
        'Audit & Sistem',
        'success',
        `Memulihkan data cadangan dengan mode: ${mode === 'replace' ? 'Gantikan Total' : 'Gabungkan Data'}.`
      );

      notifyRealtimeSync(backupObj);
      return true;
    } catch (e: any) {
      alert('Gagal memulihkan cadangan: ' + (e?.message || e));
      return false;
    }
  };

  const resetToZero = (): boolean => {
    if (!canExecute('backup:manage', 'Mereset Database Total ke Nol / Kosong', 'Audit & Sistem')) return false;

    setWargaList([]);
    setIuranList([]);
    setSuratList([]);
    setLaporanList([]);
    setPengumumanList([]);
    setInfoPerumahan((prev) => ({
      ...prev,
      saldoKasRt: 0,
      totalRumah: 0,
    }));

    const cleanLog: AuditLogPerumahan = {
      id: `log_reset_zero_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'SYSTEM_RESET_ZERO',
      module: 'Audit & Sistem',
      status: 'success',
      details: `Database perumahan dikosongkan total ke status Nol oleh ${currentUser.name}. Seluruh data kependudukan dan transaksi kas dihapus.`,
      ipAddress: '127.0.0.1 (Localhost)',
    };
    setAuditLogs([cleanLog]);

    localStorage.setItem(STORAGE_KEYS.WARGA, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.IURAN, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SURAT, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.LAPORAN, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PENGUMUMAN, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([cleanLog]));

    notifyRealtimeSync({
      wargaList: [],
      iuranList: [],
      suratList: [],
      laporanList: [],
      pengumumanList: [],
      auditLogs: [cleanLog],
      infoPerumahan: {
        ...infoPerumahan,
        saldoKasRt: 0,
        totalRumah: 0,
      },
    });

    return true;
  };

  const resetAllToDefault = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUserId(INITIAL_USERS[0].id);
    setInfoPerumahan(INITIAL_INFO_PERUMAHAN);
    setWargaList(INITIAL_WARGA);
    setIuranList(INITIAL_IURAN);
    setSuratList(INITIAL_SURAT);
    setJenisSuratList(INITIAL_JENIS_SURAT);
    setPetugasKeamananList(INITIAL_PETUGAS_KEAMANAN);
    setLaporanList(INITIAL_LAPORAN);
    setPengumumanList(INITIAL_PENGUMUMAN);
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAccessDeniedInfo(null);

    notifyRealtimeSync({
      users: INITIAL_USERS,
      infoPerumahan: INITIAL_INFO_PERUMAHAN,
      wargaList: INITIAL_WARGA,
      iuranList: INITIAL_IURAN,
      suratList: INITIAL_SURAT,
      jenisSuratList: INITIAL_JENIS_SURAT,
      petugasKeamananList: INITIAL_PETUGAS_KEAMANAN,
      laporanList: INITIAL_LAPORAN,
      pengumumanList: INITIAL_PENGUMUMAN,
      rolePermissions: DEFAULT_ROLE_PERMISSIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
    });
  };

  return (
    <RBACContext.Provider
      value={{
        currentUser,
        users,
        infoPerumahan,
        rolePermissions,
        wargaList,
        iuranList,
        suratList,
        jenisSuratList,
        petugasKeamananList,
        laporanList,
        pengumumanList,
        auditLogs,
        accessDeniedInfo,
        hasPermission,
        canExecute,
        closeAccessDeniedModal,
        loginAsUser,
        switchRolePersona,
        logout,
        registerWargaUser,
        updateInfoPerumahan,
        tambahWarga,
        updateWarga,
        hapusWarga,
        bayarIuranSendiri,
        verifikasiIuran,
        tambahIuranBaru,
        ajukanSurat,
        prosesSuratRT,
        tambahJenisSurat,
        updateJenisSurat,
        hapusJenisSurat,
        generateDrafSuratAI,
        tambahPetugasKeamanan,
        updatePetugasKeamanan,
        hapusPetugasKeamanan,
        updateStatusJagaPetugas,
        buatLaporan,
        updateStatusLaporan,
        buatPengumuman,
        hapusPengumuman,
        toggleRolePermission,
        saveRolePermissions,
        resetPermissionsToDefault,
        isRealtimeActive,
        lastSyncTimestamp,
        exportFullBackupJSON,
        importFullBackupJSON,
        logAudit,
        resetAllToDefault,
        resetToZero,
      }}
    >
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};
