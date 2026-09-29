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
  | 'Surat Izin Acara / Keramaian'
  | string;

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
  | 'surat:manage_types'
  | 'kop:manage'
  | 'keamanan:manage'
  | 'laporan:create'
  | 'laporan:manage'
  | 'pengumuman:create'
  | 'audit:view'
  | 'roles:manage_permissions'
  | 'pelaporan:view'
  | 'backup:manage';

export interface PermissionDefinition {
  key: PermissionKey;
  name: string;
  description: string;
  module: 'Data Warga' | 'Iuran & Kas' | 'Layanan Surat' | 'Keamanan & Pos Satpam' | 'Pengumuman' | 'Audit & Sistem';
}

export interface RolePermissions {
  admin: PermissionKey[];
  user: PermissionKey[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  roleTitle: string;
  status: UserStatus;
  blokRumah: BlokRumah;
  nomorRumah: string;
  avatar: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

export type StatusVerifikasiKK = 'Terverifikasi' | 'Belum Lengkap';

export interface WargaItem {
  id: string;
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
  statusVerifikasiKK?: StatusVerifikasiKK;
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

export interface JenisSuratConfig {
  id: string;
  nama: string;
  kode: string;
  deskripsi: string;
  persyaratan: string[];
  templatePembuka: string;
  templatePenutup: string;
  estimasiProses: string;
  aktif: boolean;
}

export interface SuratItem {
  id: string;
  wargaId: string;
  namaPemohon: string;
  nikPemohon: string;
  blokRumah: BlokRumah;
  nomorRumah: string;
  jenisSurat: string;
  keperluan: string;
  status: StatusSurat;
  nomorSuratResmi?: string;
  catatanAdmin?: string;
  tanggalPengajuan: string;
  tanggalSelesai?: string;
  // AI Companion fields
  drafSuratAI?: string;
  alasanFormalAI?: string;
  catatanAI?: string;
}

export interface PetugasKeamanan {
  id: string;
  namaLengkap: string;
  jabatan: 'Komandan Regu (Danru)' | 'Petugas Pos Gerbang Utama' | 'Petugas Patroli Keliling' | 'Petugas Pos Pantau Barat';
  noHp: string;
  noWhatsapp: string;
  posJaga: string;
  shift: 'Shift Pagi (07.00 - 15.00)' | 'Shift Sore (15.00 - 23.00)' | 'Shift Malam (23.00 - 07.00)';
  statusJaga: 'Sedang Bertugas' | 'Siaga (On-Call)' | 'Libur';
  foto: string;
  masaTugas: string;
  catatanTugas: string;
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
  kategori: 'Kerja Bakti' | 'Rapat RT' | 'Pengamanan Lingkungan' | 'Informasi Kas' | 'Darurat';
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
  kodePos: string;
  nomorSK: string;
  alamatSekretariat: string;
  hotlineRT: string;
  namaKetuaRT: string;
  slogan: string;
  totalRumah: number;
  saldoKasRt: number;
}
