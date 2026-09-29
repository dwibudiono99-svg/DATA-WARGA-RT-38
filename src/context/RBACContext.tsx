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
  StatusSurat,
  StatusBayar,
  StatusLaporan,
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

  // Warga Management (Admin / User)
  tambahWarga: (warga: Omit<WargaItem, 'id'>) => void;
  updateWarga: (id: string, updates: Partial<WargaItem>) => boolean;
  hapusWarga: (id: string) => boolean;

  // Iuran Management
  bayarIuranSendiri: (iuranId: string, metode: string, bukti: string) => boolean;
  verifikasiIuran: (iuranId: string, status: StatusBayar) => boolean;
  tambahIuranBaru: (iuran: Omit<IuranItem, 'id'>) => void;

  // Surat Pengantar RT
  ajukanSurat: (surat: { jenisSurat: SuratItem['jenisSurat']; keperluan: string }) => void;
  prosesSuratRT: (suratId: string, disetujui: boolean, catatan?: string) => boolean;

  // Laporan Lingkungan & Tamu
  buatLaporan: (laporan: { kategori: LaporanLingkungan['kategori']; judul: string; rincian: string }) => void;
  updateStatusLaporan: (laporanId: string, status: StatusLaporan) => boolean;

  // Pengumuman
  buatPengumuman: (judul: string, isi: string, kategori: PengumumanPerumahan['kategori'], prioritas: PengumumanPerumahan['prioritas']) => void;
  hapusPengumuman: (id: string) => boolean;

  // Permissions & Dynamic Matrix
  toggleRolePermission: (role: Role, permission: PermissionKey) => void;
  resetPermissionsToDefault: () => void;

  // Audit & Reset
  logAudit: (action: string, moduleName: string, status: 'success' | 'denied', details: string) => void;
  resetAllToDefault: () => void;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'sim_warga_active_user_id',
  USERS: 'sim_warga_users',
  WARGA: 'sim_warga_data',
  IURAN: 'sim_warga_iuran',
  SURAT: 'sim_warga_surat',
  LAPORAN: 'sim_warga_laporan',
  PENGUMUMAN: 'sim_warga_pengumuman',
  PERMISSIONS: 'sim_warga_permissions',
  AUDIT_LOGS: 'sim_warga_audit_logs',
  INFO: 'sim_warga_info',
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

  const [infoPerumahan] = useState<InfoPerumahan>(INITIAL_INFO_PERUMAHAN);

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

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);
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

  // Derived current user
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  // Audit logger
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
      ipAddress: '192.168.10.' + Math.floor(Math.random() * 80 + 10),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const hasPermission = (permission: PermissionKey): boolean => {
    const permissionsForRole = rolePermissions[currentUser.role] || [];
    return permissionsForRole.includes(permission);
  };

  const canExecute = (permission: PermissionKey, actionName: string, moduleName: string = 'Sistem'): boolean => {
    const allowed = hasPermission(permission);
    if (!allowed) {
      const permDef = PERMISSION_DEFINITIONS.find((p) => p.key === permission);
      const permDescription = permDef ? `${permDef.name} (${permission})` : permission;

      logAudit(
        'AKSES_DITOLAK_RBAC',
        moduleName,
        'denied',
        `Aksi "${actionName}" dicegat. Akun ${currentUser.name} (${currentUser.role === 'admin' ? 'Pengurus RT' : 'Warga'}) tidak berhak memiliki izin "${permDescription}".`
      );

      setAccessDeniedInfo({
        isOpen: true,
        requiredPermission: permDescription,
        actionName,
        moduleName,
      });
      return false;
    }
    return true;
  };

  const closeAccessDeniedModal = () => {
    setAccessDeniedInfo(null);
  };

  // Auth actions
  const loginAsUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, lastLogin: new Date().toISOString() } : u))
      );
      logAudit(
        'LOGIN_SUCCESS',
        'Otentikasi',
        'success',
        `Login sebagai ${target.name} (${target.roleTitle}).`
      );
    }
  };

  const switchRolePersona = (targetRole: Role) => {
    const matched = users.find((u) => u.role === targetRole && u.status === 'active');
    if (matched) {
      setCurrentUserId(matched.id);
      logAudit(
        'SWITCH_PERSONA',
        'Otentikasi',
        'success',
        `Beralih ke akun ${matched.name} (${targetRole === 'admin' ? 'Pengurus RT' : 'Warga Penghuni'}).`
      );
    }
  };

  const logout = () => {
    logAudit('LOGOUT', 'Otentikasi', 'success', `Pengguna ${currentUser.name} keluar.`);
    setCurrentUserId(INITIAL_USERS[1].id); // Siti Rahmawati
  };

  const registerWargaUser = (nama: string, email: string, blok: WargaItem['blokRumah'], nomor: string, role: Role): User => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: nama,
      email,
      role,
      roleTitle: role === 'admin' ? `Pengurus RT / Admin` : `Warga ${blok} No. ${nomor}`,
      status: 'active',
      blokRumah: blok,
      nomorRumah: nomor,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 500000)}?w=150&auto=format&fit=crop&q=80`,
      phone: '+62 8' + Math.floor(100000000 + Math.random() * 900000000),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    logAudit('REGISTER_WARGA', 'Otentikasi', 'success', `Pendaftaran akun warga baru: ${newUser.name} di ${blok} ${nomor}.`);
    return newUser;
  };

  // Warga Management
  const tambahWarga = (warga: Omit<WargaItem, 'id'>) => {
    if (!canExecute('warga:create', 'Mendaftarkan Data Warga Baru', 'Data Warga')) return;

    const newWarga: WargaItem = {
      ...warga,
      id: `wrg_${Date.now()}`,
    };
    setWargaList((prev) => [newWarga, ...prev]);
    logAudit('WARGA_TAMBAH', 'Data Warga', 'success', `Mendaftarkan warga baru: ${newWarga.namaLengkap} (${newWarga.blokRumah}-${newWarga.nomorRumah}).`);
  };

  const updateWarga = (id: string, updates: Partial<WargaItem>): boolean => {
    const targetWarga = wargaList.find((w) => w.id === id);
    if (!targetWarga) return false;

    // Check if updating own home or someone else's
    const isOwner = targetWarga.nomorRumah === currentUser.nomorRumah && targetWarga.blokRumah === currentUser.blokRumah;
    if (isOwner) {
      if (!canExecute('warga:edit_own', 'Memperbarui Data Rumah Sendiri', 'Data Warga')) return false;
    } else {
      if (!canExecute('warga:edit_all', `Mengubah Data Warga Rumah ${targetWarga.blokRumah}-${targetWarga.nomorRumah}`, 'Data Warga')) return false;
    }

    setWargaList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );
    logAudit('WARGA_UPDATE', 'Data Warga', 'success', `Memperbarui data kependudukan ${targetWarga.namaLengkap}.`);
    return true;
  };

  const hapusWarga = (id: string): boolean => {
    if (!canExecute('warga:delete', 'Menghapus Data Kependudukan Warga', 'Data Warga')) return false;

    const targetWarga = wargaList.find((w) => w.id === id);
    setWargaList((prev) => prev.filter((w) => w.id !== id));
    logAudit('WARGA_HAPUS', 'Data Warga', 'success', `Menghapus warga: ${targetWarga?.namaLengkap || id} (Pindah domisili).`);
    return true;
  };

  // Iuran
  const bayarIuranSendiri = (iuranId: string, metode: string, bukti: string): boolean => {
    if (!canExecute('iuran:pay_own', 'Melakukan Pembayaran Iuran Warga', 'Iuran & Kas')) return false;

    setIuranList((prev) =>
      prev.map((i) =>
        i.id === iuranId
          ? {
              ...i,
              statusBayar: 'Menunggu Verifikasi',
              tanggalBayar: new Date().toISOString().split('T')[0],
              metodePembayaran: metode,
              buktiBayar: bukti || 'TRF-' + Math.floor(100000 + Math.random() * 900000),
            }
          : i
      )
    );
    logAudit('IURAN_BAYAR', 'Iuran & Kas', 'success', `Warga mengunggah bukti bayar iuran bulanan.`);
    return true;
  };

  const verifikasiIuran = (iuranId: string, status: StatusBayar): boolean => {
    if (!canExecute('iuran:verify', 'Memverifikasi Pembayaran Iuran Warga', 'Iuran & Kas')) return false;

    setIuranList((prev) =>
      prev.map((i) => (i.id === iuranId ? { ...i, statusBayar: status } : i))
    );
    logAudit('IURAN_VERIFIKASI', 'Iuran & Kas', 'success', `Pengurus RT mengubah status iuran ID ${iuranId} menjadi ${status.toUpperCase()}.`);
    return true;
  };

  const tambahIuranBaru = (iuran: Omit<IuranItem, 'id'>) => {
    if (!canExecute('iuran:view_all', 'Membuat Tagihan Iuran Bulanan', 'Iuran & Kas')) return;
    const newItem: IuranItem = {
      ...iuran,
      id: `iur_${Date.now()}`,
    };
    setIuranList((prev) => [newItem, ...prev]);
    logAudit('IURAN_TAGIHAN_BARU', 'Iuran & Kas', 'success', `Menerbitkan tagihan iuran baru untuk ${iuran.namaWarga}.`);
  };

  // Surat Pengantar RT
  const ajukanSurat = (data: { jenisSurat: SuratItem['jenisSurat']; keperluan: string }) => {
    if (!canExecute('surat:request', 'Mengajukan Surat Pengantar RT Online', 'Layanan Surat RT')) return;

    const matchedWarga = wargaList.find((w) => w.blokRumah === currentUser.blokRumah && w.nomorRumah === currentUser.nomorRumah) || wargaList[1];

    const newSurat: SuratItem = {
      id: `srt_${Date.now()}`,
      wargaId: matchedWarga.id,
      namaPemohon: currentUser.name,
      nikPemohon: matchedWarga.nik,
      blokRumah: currentUser.blokRumah,
      nomorRumah: currentUser.nomorRumah,
      jenisSurat: data.jenisSurat,
      keperluan: data.keperluan,
      status: 'Menunggu Validasi RT',
      tanggalPengajuan: new Date().toISOString().split('T')[0],
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

  // Laporan
  const buatLaporan = (data: { kategori: LaporanLingkungan['kategori']; judul: string; rincian: string }) => {
    if (!canExecute('laporan:create', 'Mengirim Laporan Tamu / Aduan Lingkungan', 'Keamanan & Lingkungan')) return;

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
    logAudit('LAPORAN_SUBMIT', 'Keamanan & Lingkungan', 'success', `Warga ${currentUser.name} melaporkan: "${data.judul}".`);
  };

  const updateStatusLaporan = (laporanId: string, status: StatusLaporan): boolean => {
    if (!canExecute('laporan:manage', 'Menindaklanjuti Laporan Warga', 'Keamanan & Lingkungan')) return false;

    setLaporanList((prev) =>
      prev.map((l) => (l.id === laporanId ? { ...l, status } : l))
    );
    logAudit('LAPORAN_STATUS', 'Keamanan & Lingkungan', 'success', `Status laporan diubah menjadi ${status}.`);
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
    if (!canExecute('pengumuman:create', 'Menghapus Pengumuman', 'Warta Perumahan')) return false;
    setPengumumanList((prev) => prev.filter((a) => a.id !== id));
    logAudit('PENGUMUMAN_DELETE', 'Warta Perumahan', 'success', `Menghapus pengumuman.`);
    return true;
  };

  // Matrix
  const toggleRolePermission = (role: Role, permission: PermissionKey) => {
    if (!canExecute('roles:manage_permissions', 'Mengubah Matriks Hak Akses RT', 'Pengaturan Keamanan')) return;

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
  };

  const resetAllToDefault = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUserId(INITIAL_USERS[0].id);
    setWargaList(INITIAL_WARGA);
    setIuranList(INITIAL_IURAN);
    setSuratList(INITIAL_SURAT);
    setLaporanList(INITIAL_LAPORAN);
    setPengumumanList(INITIAL_PENGUMUMAN);
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAccessDeniedInfo(null);
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
        tambahWarga,
        updateWarga,
        hapusWarga,
        bayarIuranSendiri,
        verifikasiIuran,
        tambahIuranBaru,
        ajukanSurat,
        prosesSuratRT,
        buatLaporan,
        updateStatusLaporan,
        buatPengumuman,
        hapusPengumuman,
        toggleRolePermission,
        resetPermissionsToDefault,
        logAudit,
        resetAllToDefault,
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
