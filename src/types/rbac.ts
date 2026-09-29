export type Role = 'admin' | 'user';

export type UserStatus = 'active' | 'inactive' | 'suspended';

export type BlokRumah = 'Blok A' | 'Blok B' | 'Blok C' | 'Blok D';

export type StatusHunian = 'Tetap' | 'Kontrak/Sewa' | 'Kost';

export type StatusKeluarga = 'Kepala Keluarga' | 'Istri' | 'Anak' | 'Kerabat/Lainnya';

export type JenisIuran = 'Iuran Kebersihan & Keamanan' | 'Iuran Kas Sosial' | 'Iuran THR Satpam Lingkungan';

export type StatusBayar = 'Lunas' | 'Menunggu Verifikasi' | 'Belum Bayar';

export type JenisSuratPengantar =
  | 'Surat Keterangan Domisili'
  | 'Surat Pengantar SKCK'
  | 'Surat Pengantar Pembuatan KTP/KK'
  | 'Surat Keterangan Usaha (SKU)'
  | 'Surat Izin Acara / Keramaian';

export type StatusSurat = 'Menunggu Validasi RT' | 'Disetujui / Terbit' | 'Ditolak';

export type KategoriLaporan =
  | 'Lapor Tamu Menginap > 24 Jam'
  | 'Gangguan Keamanan & Ketertiban'
  | 'Fasilitas Umum / Lampu Jalan Rusak'
  | 'Kebersihan & Pengangkutan Sampah';

export type StatusLaporan = 'Diterima' | 'Sedang Ditindaklanjuti' | 'Selesai';

export type PermissionKey =
  | 'dashboard:view'
  | 'warga:view_all'
  | 'warga:create'
  | 'warga:edit_all'
  | 'warga:edit_own'
  | 'warga:delete'
  | 'warga:export'
  | 'iuran:view_all'
  | 'iuran:verify'
  | 'iuran:pay_own'
  | 'surat:request'
  | 'surat:approve'
  | 'surat:view_all'
  | 'laporan:create'
  | 'laporan:manage'
  | 'pengumuman:create'
  | 'audit:view'
  | 'roles:manage_permissions';

export interface PermissionDefinition {
  key: PermissionKey;
  name: string;
  description: string;
  module: 'warga' | 'iuran' | 'surat' | 'lingkungan' | 'keamanan';
}

export type RolePermissions = Record<Role, PermissionKey[]>;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleTitle: string; // e.g. "Ketua RT 04 / Admin Perumahan", "Warga Blok B-05"
  status: UserStatus;
  blokRumah: BlokRumah;
  nomorRumah: string;
  avatar: string;
  phone: string;
  createdAt: string;
  lastLogin: string;
}

export interface WargaItem {
  id: string;
  userId?: string;
  namaLengkap: string;
  nik: string;
  noKK: string;
  blokRumah: BlokRumah;
  nomorRumah: string;
  statusHunian: StatusHunian;
  statusKeluarga: StatusKeluarga;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  pekerjaan: string;
  noHp: string;
  email: string;
  jumlahAnggotaKeluarga: number;
  tanggalMasuk: string;
  catatanKhusus?: string;
}

export interface IuranItem {
  id: string;
  wargaId: string;
  namaWarga: string;
  blokRumah: BlokRumah;
  nomorRumah: string;
  periodeBulan: string;
  nominal: number;
  jenisIuran: JenisIuran;
  statusBayar: StatusBayar;
  tanggalBayar?: string;
  metodePembayaran?: string;
  buktiBayar?: string;
}

export interface SuratItem {
  id: string;
  wargaId: string;
  namaPemohon: string;
  nikPemohon: string;
  blokRumah: BlokRumah;
  nomorRumah: string;
  jenisSurat: JenisSuratPengantar;
  keperluan: string;
  status: StatusSurat;
  nomorSuratResmi?: string;
  catatanAdmin?: string;
  tanggalPengajuan: string;
  tanggalSelesai?: string;
}

export interface LaporanLingkungan {
  id: string;
  pelaporId: string;
  namaPelapor: string;
  blokRumah: BlokRumah;
  nomorRumah: string;
  kategori: KategoriLaporan;
  judul: string;
  rincian: string;
  status: StatusLaporan;
  tanggalLapor: string;
}

export interface PengumumanPerumahan {
  id: string;
  judul: string;
  kategori: 'Kerja Bakti' | 'Rapat RT' | 'Jadwal Ronda' | 'Informasi Kas' | 'Darurat';
  isi: string;
  penulis: string;
  prioritas: 'biasa' | 'penting' | 'darurat';
  tanggal: string;
  aktif: boolean;
}

export interface AuditLogPerumahan {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: string;
  module: string;
  status: 'success' | 'denied';
  details: string;
  ipAddress: string;
}

export type AuditLog = AuditLogPerumahan;

export interface InfoPerumahan {
  namaPerumahan: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  totalRumah: number;
  saldoKasRt: number;
}
