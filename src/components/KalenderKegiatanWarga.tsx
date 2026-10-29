import React, { useState, useMemo } from 'react';
import { useRBAC } from '../context/RBACContext';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Phone,
  MessageCircle,
  Download,
  Share2,
  CalendarCheck,
  CalendarX,
  Info,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Briefcase,
  Layers,
} from 'lucide-react';
import {
  KegiatanWarga,
  KategoriKegiatan,
  StatusKegiatan,
  RsvpKegiatan,
} from '../types/rbac';

interface KalenderKegiatanWargaProps {
  isAdmin?: boolean;
}

const KATEGORI_COLORS: Record<
  KategoriKegiatan,
  { bg: string; text: string; border: string; badge: string; dot: string }
> = {
  'Kerja Bakti': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dot: 'bg-emerald-500',
  },
  'Rapat RT': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    dot: 'bg-indigo-500',
  },
  Posyandu: {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    dot: 'bg-rose-500',
  },
  'Keamanan & Ronda': {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    dot: 'bg-amber-500',
  },
  'Olahraga & Kesehatan': {
    bg: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-800 border-teal-300',
    dot: 'bg-teal-500',
  },
  'Sosial & Keagamaan': {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    dot: 'bg-purple-500',
  },
  Lainnya: {
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    border: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    dot: 'bg-slate-500',
  },
};

const KATEGORI_OPTIONS: KategoriKegiatan[] = [
  'Kerja Bakti',
  'Rapat RT',
  'Posyandu',
  'Keamanan & Ronda',
  'Olahraga & Kesehatan',
  'Sosial & Keagamaan',
  'Lainnya',
];

export const KalenderKegiatanWarga: React.FC<KalenderKegiatanWargaProps> = ({
  isAdmin = false,
}) => {
  const {
    kegiatanList,
    currentUser,
    tambahKegiatan,
    updateKegiatan,
    hapusKegiatan,
    rsvpKegiatan,
    infoPerumahan,
  } = useRBAC();

  // View state
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('calendar');
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calendar month/year navigation (Default October 2026 based on app current timeline)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 24)); // 2026-10-24

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingKegiatan, setEditingKegiatan] = useState<KegiatanWarga | null>(null);
  const [detailKegiatan, setDetailKegiatan] = useState<KegiatanWarga | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState<Omit<KegiatanWarga, 'id' | 'createdAt' | 'rsvpList'>>({
    judul: '',
    kategori: 'Kerja Bakti',
    tanggal: '2026-10-25',
    waktuMulai: '06:30',
    waktuSelesai: '09:30',
    lokasi: 'Balai Pertemuan Warga RT 38',
    deskripsi: '',
    penanggungJawab: currentUser.name,
    noKontakPj: currentUser.phone || '',
    perlengkapan: '',
    sasaranPeserta: 'Seluruh warga RT 38 / 1 orang per KK',
    status: 'Akan Datang',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 24));
  };

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  // Filtered Kegiatan
  const filteredKegiatan = useMemo(() => {
    return kegiatanList.filter((item) => {
      const matchKategori = selectedKategori === 'all' || item.kategori === selectedKategori;
      const matchSearch =
        searchQuery === '' ||
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase());
      return matchKategori && matchSearch;
    });
  }, [kegiatanList, selectedKategori, searchQuery]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isToday = dateStr === '2026-10-24';
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Next month padding to fill complete grid of 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const dateStr = `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  }, [year, month]);

  // Quick stats
  const totalBulanIni = useMemo(() => {
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    return kegiatanList.filter((k) => k.tanggal.startsWith(monthPrefix)).length;
  }, [kegiatanList, year, month]);

  const upcomingKerjaBakti = useMemo(() => {
    return kegiatanList.filter(
      (k) => k.kategori === 'Kerja Bakti' && k.status === 'Akan Datang'
    ).length;
  }, [kegiatanList]);

  const upcomingRapat = useMemo(() => {
    return kegiatanList.filter(
      (k) => k.kategori === 'Rapat RT' && k.status === 'Akan Datang'
    ).length;
  }, [kegiatanList]);

  // Open Add modal
  const handleOpenAdd = (defaultDate?: string) => {
    setEditingKegiatan(null);
    setFormData({
      judul: '',
      kategori: 'Kerja Bakti',
      tanggal: defaultDate || '2026-10-25',
      waktuMulai: '06:30',
      waktuSelesai: '09:30',
      lokasi: 'Fasum Lapangan / Balai RT 38',
      deskripsi: '',
      penanggungJawab: currentUser.name,
      noKontakPj: currentUser.phone || '',
      perlengkapan: '',
      sasaranPeserta: 'Perwakilan 1 orang per KK',
      status: 'Akan Datang',
    });
    setIsFormModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (kegiatan: KegiatanWarga) => {
    setEditingKegiatan(kegiatan);
    setFormData({
      judul: kegiatan.judul,
      kategori: kegiatan.kategori,
      tanggal: kegiatan.tanggal,
      waktuMulai: kegiatan.waktuMulai,
      waktuSelesai: kegiatan.waktuSelesai,
      lokasi: kegiatan.lokasi,
      deskripsi: kegiatan.deskripsi,
      penanggungJawab: kegiatan.penanggungJawab,
      noKontakPj: kegiatan.noKontakPj || '',
      perlengkapan: kegiatan.perlengkapan || '',
      sasaranPeserta: kegiatan.sasaranPeserta || '',
      status: kegiatan.status,
    });
    setIsFormModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim()) {
      alert('Mohon isi judul kegiatan.');
      return;
    }
    if (!formData.tanggal) {
      alert('Mohon tentukan tanggal kegiatan.');
      return;
    }

    if (editingKegiatan) {
      updateKegiatan(editingKegiatan.id, formData);
      setFeedbackToast(`Jadwal "${formData.judul}" berhasil diperbarui.`);
    } else {
      tambahKegiatan(formData);
      setFeedbackToast(`Agenda baru "${formData.judul}" berhasil ditambahkan.`);
    }

    setIsFormModalOpen(false);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Delete
  const handleDelete = (id: string, judul: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus agenda "${judul}" dari kalender kegiatan RT?`)) {
      hapusKegiatan(id);
      if (detailKegiatan?.id === id) {
        setDetailKegiatan(null);
      }
      setFeedbackToast(`Agenda "${judul}" telah dihapus.`);
      setTimeout(() => setFeedbackToast(null), 3000);
    }
  };

  // RSVP toggle
  const handleRsvp = (kegiatanId: string, status: 'Hadir' | 'Izin') => {
    rsvpKegiatan(kegiatanId, status);
    setFeedbackToast(
      status === 'Hadir'
        ? 'Terima kasih! Kehadiran Anda pada agenda ini telah dikonfirmasi.'
        : 'Status izin berhalangan Anda telah dicatat.'
    );
    setTimeout(() => setFeedbackToast(null), 3000);

    // Update opened detail modal if active
    if (detailKegiatan && detailKegiatan.id === kegiatanId) {
      const updated = kegiatanList.find((k) => k.id === kegiatanId);
      if (updated) setDetailKegiatan(updated);
    }
  };

  // ICS Export generator
  const handleDownloadICS = (item: KegiatanWarga) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const [y, m, d] = item.tanggal.split('-').map(Number);
    const [startH, startM] = item.waktuMulai.split(':').map(Number);
    const [endH, endM] = item.waktuSelesai.split(':').map(Number);

    const dtStart = `${y}${pad(m)}${pad(d)}T${pad(startH || 8)}${pad(startM || 0)}00`;
    const dtEnd = `${y}${pad(m)}${pad(d)}T${pad(endH || 10)}${pad(endM || 0)}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SIM-Warga RT 38 Sepanjang//ID',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${item.judul}`,
      `DESCRIPTION:${item.deskripsi.replace(/\n/g, '\\n')}\\n\\nPenanggung Jawab: ${item.penanggungJawab}`,
      `LOCATION:${item.lokasi}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Agenda_${item.kategori.replace(/\s+/g, '_')}_${item.tanggal}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // WhatsApp share generator
  const handleShareWA = (item: KegiatanWarga) => {
    const text = `*PENGUMUMAN JADWAL KEGIATAN RT 38*\n\n📌 *${item.judul}*\n🗓️ Tanggal: ${item.tanggal}\n⏰ Pukul: ${item.waktuMulai} - ${item.waktuSelesai} WIB\n📍 Lokasi: ${item.lokasi}\n👤 PJ: ${item.penanggungJawab} (${item.noKontakPj || '-'})\n\n📝 *Deskripsi:*\n${item.deskripsi}\n\n${item.perlengkapan ? `🔧 *Perlengkapan:* ${item.perlengkapan}\n` : ''}👥 *Peserta:* ${item.sasaranPeserta || 'Warga RT 38'}\n\n_Disampaikan melalui Portal SIM-Warga RT 38 Griyo Taman Asri Sepanjang._`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShareId(item.id);
      setTimeout(() => setCopiedShareId(null), 2500);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-6 p-5 sm:p-6 text-slate-800">
      {/* Top Banner / Toast */}
      {feedbackToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackToast}</span>
          </div>
          <button
            onClick={() => setFeedbackToast(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header section with Title & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl shadow-sm">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  Kalender & Jadwal Kegiatan Warga
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-black uppercase">
                  {infoPerumahan.rtRw}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Agenda kerja bakti, rapat musyawarah RT, jadwal posyandu balita & lansia, serta ronda siskamling lingkungan.
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle, Today button & Admin Action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Kalender</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'agenda'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Daftar Agenda ({kegiatanList.length})</span>
            </button>
          </div>

          {/* Quick jump to Today */}
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Kembali ke Hari Ini (24 Oktober 2026)"
          >
            Hari Ini
          </button>

          {/* Admin Add Agenda Button */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 hover:scale-102 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Agenda</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-indigo-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
              Agenda {monthNames[month]}
            </span>
            <span className="text-xl font-black">{totalBulanIni} Kegiatan</span>
          </div>
          <CalendarIcon className="w-6 h-6 text-indigo-400 shrink-0" />
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-emerald-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
              Kerja Bakti
            </span>
            <span className="text-xl font-black">{upcomingKerjaBakti} Terjadwal</span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-amber-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
              Rapat RT 38
            </span>
            <span className="text-xl font-black">{upcomingRapat} Pertemuan</span>
          </div>
          <Users className="w-6 h-6 text-amber-400 shrink-0" />
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 text-purple-950 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
              Agenda Terdekat
            </span>
            <span className="text-xs font-bold line-clamp-1">25 Okt: Kerja Bakti</span>
          </div>
          <Sparkles className="w-6 h-6 text-purple-400 shrink-0" />
        </div>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setSelectedKategori('all')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedKategori === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua ({kegiatanList.length})
          </button>
          {KATEGORI_OPTIONS.map((cat) => {
            const count = kegiatanList.filter((k) => k.kategori === cat).length;
            const isSelected = selectedKategori === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedKategori(cat)}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${KATEGORI_COLORS[cat]?.dot || 'bg-slate-400'}`} />
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative shrink-0 sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kegiatan, lokasi, atau PJ..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: MONTHLY INTERACTIVE CALENDAR GRID */}
      {viewMode === 'calendar' && (
        <div className="space-y-4">
          {/* Month & Year Bar */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <h4 className="font-black text-lg text-slate-900 tracking-tight">
                {monthNames[month]} {year}
              </h4>
              <span className="text-xs text-slate-400 font-medium">
                Pilih tanggal untuk melihat atau menambah agenda
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[11px] font-black uppercase text-slate-500 tracking-wider py-1 border-b border-slate-100">
            <span className="text-rose-600">Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span className="text-indigo-600">Sab</span>
          </div>

          {/* Calendar Grid Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((cd, index) => {
              // Find events on this date
              const dayEvents = filteredKegiatan.filter((k) => k.tanggal === cd.dateStr);

              return (
                <div
                  key={`${cd.dateStr}_${index}`}
                  onClick={() => {
                    if (dayEvents.length === 1) {
                      setDetailKegiatan(dayEvents[0]);
                    } else if (dayEvents.length > 1) {
                      // switch to agenda or open first
                      setDetailKegiatan(dayEvents[0]);
                    } else if (isAdmin && cd.isCurrentMonth) {
                      handleOpenAdd(cd.dateStr);
                    }
                  }}
                  className={`min-h-[90px] sm:min-h-[115px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer group ${
                    cd.isToday
                      ? 'bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-400/40 shadow-xs'
                      : cd.isCurrentMonth
                      ? 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                      : 'bg-slate-50/60 border-slate-100 text-slate-400'
                  }`}
                >
                  {/* Top Bar: Date Number & Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-extrabold flex items-center justify-center w-6 h-6 rounded-full ${
                        cd.isToday
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : cd.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {cd.dayNumber}
                    </span>

                    {cd.isToday && (
                      <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded-md">
                        Hari Ini
                      </span>
                    )}
                  </div>

                  {/* Day Events Stack */}
                  <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev, evIdx) => {
                      const colorStyle = KATEGORI_COLORS[ev.kategori] || KATEGORI_COLORS.Lainnya;
                      return (
                        <div
                          key={`${ev.id}_${evIdx}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailKegiatan(ev);
                          }}
                          className={`px-1.5 py-0.5 rounded-lg border text-[10px] leading-tight font-bold truncate transition-all hover:scale-102 ${colorStyle.bg} ${colorStyle.text} ${colorStyle.border}`}
                          title={`${ev.waktuMulai} - ${ev.judul}`}
                        >
                          <span className="font-extrabold mr-1">{ev.waktuMulai}</span>
                          <span>{ev.judul}</span>
                        </div>
                      );
                    })}

                    {dayEvents.length > 2 && (
                      <span className="text-[9px] font-bold text-slate-500 pl-1 block">
                        +{dayEvents.length - 2} kegiatan lagi
                      </span>
                    )}

                    {dayEvents.length === 0 && isAdmin && cd.isCurrentMonth && (
                      <div className="hidden group-hover:flex items-center justify-center h-full text-[10px] text-slate-400 font-semibold">
                        + Tambah
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: AGENDA / TIMELINE LIST VIEW */}
      {viewMode === 'agenda' && (
        <div className="space-y-3">
          {filteredKegiatan.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
              <CalendarX className="w-10 h-10 text-slate-400 mx-auto" />
              <div>
                <p className="text-sm font-bold text-slate-700">Tidak ada agenda kegiatan yang cocok</p>
                <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau filter kategori.</p>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleOpenAdd()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  + Tambah Agenda Sekarang
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKegiatan.map((item, itemIdx) => {
                const color = KATEGORI_COLORS[item.kategori] || KATEGORI_COLORS.Lainnya;
                const rsvpCount = (item.rsvpList || []).filter((r) => r.status === 'Hadir').length;
                const myRsvp = (item.rsvpList || []).find((r) => r.userId === currentUser.id);

                return (
                  <div
                    key={`${item.id}_${itemIdx}`}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
                  >
                    {/* Header: Date Block, Category & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Date badge */}
                        <div className="p-2.5 rounded-2xl bg-slate-900 text-white text-center shrink-0 min-w-[56px] shadow-xs">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">
                            {monthNames[new Date(item.tanggal).getMonth()].substring(0, 3)}
                          </span>
                          <span className="block text-xl font-black leading-none mt-0.5">
                            {item.tanggal.split('-')[2]}
                          </span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${color.badge}`}>
                              {item.kategori}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.status === 'Akan Datang'
                                  ? 'bg-blue-100 text-blue-800'
                                  : item.status === 'Sedang Berlangsung'
                                  ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                                  : item.status === 'Selesai'
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <h4
                            onClick={() => setDetailKegiatan(item)}
                            className="font-extrabold text-sm sm:text-base text-slate-900 hover:text-indigo-600 cursor-pointer leading-snug line-clamp-2"
                          >
                            {item.judul}
                          </h4>
                        </div>
                      </div>

                      {/* Admin edit/delete buttons */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Agenda"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.judul)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Agenda"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Metadata: Time, Location, Penanggung Jawab */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Pukul <strong>{item.waktuMulai} - {item.waktuSelesai} WIB</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate"><strong>Lokasi:</strong> {item.lokasi}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate"><strong>PJ:</strong> {item.penanggungJawab}</span>
                      </div>
                      {item.perlengkapan && (
                        <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1"><strong>Perlengkapan:</strong> {item.perlengkapan}</span>
                        </div>
                      )}
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.deskripsi}
                    </p>

                    {/* Footer: RSVP info & action buttons */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                          👥 {rsvpCount} Warga Konfirmasi Hadir
                        </span>
                        {myRsvp && (
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                              myRsvp.status === 'Hadir'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            Anda: {myRsvp.status}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* RSVP buttons for resident */}
                        <button
                          type="button"
                          onClick={() => handleRsvp(item.id, 'Hadir')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                            myRsvp?.status === 'Hadir'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                          title="Konfirmasi Kehadiran Rumah Anda"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Hadir</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRsvp(item.id, 'Izin')}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            myRsvp?.status === 'Izin'
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                          title="Izin Berhalangan"
                        >
                          <span>Izin</span>
                        </button>

                        {/* Detail button */}
                        <button
                          type="button"
                          onClick={() => setDetailKegiatan(item)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Rincian &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: DETAIL KEGIATAN & RSVP TRACKER */}
      {detailKegiatan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-indigo-500/30 rounded-xl text-amber-300 border border-indigo-400/30">
                  <CalendarCheck className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider">
                    {detailKegiatan.kategori}
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                    {detailKegiatan.judul}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDetailKegiatan(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Date, Time, Venue Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Waktu & Tanggal
                  </span>
                  <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{detailKegiatan.tanggal}</span>
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Pukul {detailKegiatan.waktuMulai} - {detailKegiatan.waktuSelesai} WIB</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Lokasi / Tempat
                  </span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{detailKegiatan.lokasi}</span>
                  </p>
                  <p className="text-slate-500">
                    Koordinator: <strong>{detailKegiatan.penanggungJawab}</strong>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-xs uppercase text-slate-400 tracking-wider">
                  Deskripsi & Maksud Kegiatan
                </h4>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line">
                  {detailKegiatan.deskripsi}
                </div>
              </div>

              {/* Equipment & Expected Participants */}
              {(detailKegiatan.perlengkapan || detailKegiatan.sasaranPeserta) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {detailKegiatan.perlengkapan && (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                      <span className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                        <Info className="w-3.5 h-3.5 text-amber-600" />
                        <span>Perlengkapan yang Disarankan:</span>
                      </span>
                      <p className="text-amber-800">{detailKegiatan.perlengkapan}</p>
                    </div>
                  )}

                  {detailKegiatan.sasaranPeserta && (
                    <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                      <span className="font-bold text-indigo-900 flex items-center gap-1 text-[11px]">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Sasaran Peserta / Undangan:</span>
                      </span>
                      <p className="text-indigo-800">{detailKegiatan.sasaranPeserta}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Attendance / RSVP Tracker */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-emerald-600" />
                    <span>Daftar Konfirmasi Kehadiran Warga</span>
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {(detailKegiatan.rsvpList || []).filter((r) => r.status === 'Hadir').length} Hadir
                  </span>
                </div>

                {/* RSVP Controls for Current User */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-extrabold text-slate-900 block">
                      Konfirmasi Kehadiran Rumah {currentUser.blokRumah}-{currentUser.nomorRumah}:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Bantu pengurus RT menyiapkan konsumsi dan peralatan dengan mengonfirmasi kehadiran.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRsvp(detailKegiatan.id, 'Hadir')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Saya Akan Hadir</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRsvp(detailKegiatan.id, 'Izin')}
                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                    >
                      <span>Izin Berhalangan</span>
                    </button>
                  </div>
                </div>

                {/* Attendees list */}
                <div className="max-h-48 overflow-y-auto space-y-1.5">
                  {(detailKegiatan.rsvpList || []).length === 0 ? (
                    <p className="text-center py-4 text-slate-400 italic">
                      Belum ada warga yang mengonfirmasi kehadiran. Jadilah yang pertama!
                    </p>
                  ) : (
                    detailKegiatan.rsvpList?.map((r, idx) => (
                      <div
                        key={`${r.userId}_${idx}`}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              r.status === 'Hadir' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          <span className="font-bold text-slate-800">{r.userName}</span>
                          <span className="text-slate-400 text-[11px]">({r.blokNomor})</span>
                          {r.catatan && (
                            <span className="text-[11px] text-slate-500 italic">
                              - "{r.catatan}"
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            r.status === 'Hadir'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadICS(detailKegiatan)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Unduh file kalender .ics untuk disimpan di Google Calendar / iPhone"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Simpan ke Kalender (.ics)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareWA(detailKegiatan)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Salin format siaran WhatsApp untuk dibagikan ke grup warga"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedShareId === detailKegiatan.id ? 'Tersalin!' : 'Bagikan ke WA Grup'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      const item = detailKegiatan;
                      setDetailKegiatan(null);
                      handleOpenEdit(item);
                    }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setDetailKegiatan(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FORM TAMBAH / EDIT KEGIATAN (ADMIN) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-indigo-500/30 rounded-xl text-amber-300 border border-indigo-400/30">
                  <CalendarIcon className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    {editingKegiatan ? 'Edit Jadwal Kegiatan Warga' : 'Tambah Agenda Kegiatan Warga'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Jadwal akan tampil di kalender dashboard seluruh warga RT {infoPerumahan.rtRw}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveKegiatan} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* Judul Kegiatan */}
              <div className="space-y-1">
                <label className="font-extrabold text-slate-700">Judul Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Contoh: Kerja Bakti Massal Pembersihan Selokan Blok AE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs font-semibold"
                />
              </div>

              {/* Kategori & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Kategori Kegiatan *</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) =>
                      setFormData({ ...formData, kategori: e.target.value as KategoriKegiatan })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs bg-white font-medium"
                  >
                    {KATEGORI_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Status Kegiatan</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as StatusKegiatan })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs bg-white font-medium"
                  >
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>

              {/* Tanggal, Waktu Mulai, Waktu Selesai */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Waktu Mulai</label>
                  <input
                    type="time"
                    value={formData.waktuMulai}
                    onChange={(e) => setFormData({ ...formData, waktuMulai: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Waktu Selesai</label>
                  <input
                    type="time"
                    value={formData.waktuSelesai}
                    onChange={(e) => setFormData({ ...formData, waktuSelesai: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div className="space-y-1">
                <label className="font-extrabold text-slate-700">Lokasi / Tempat *</label>
                <input
                  type="text"
                  required
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  placeholder="Contoh: Balai Pertemuan RT 38 / Lapangan Terbuka Blok AE"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs"
                />
              </div>

              {/* PJ & No Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Penanggung Jawab (PJ)</label>
                  <input
                    type="text"
                    value={formData.penanggungJawab}
                    onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                    placeholder="Nama Pengurus atau Seksi RT"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">No. WhatsApp / HP PJ</label>
                  <input
                    type="text"
                    value={formData.noKontakPj}
                    onChange={(e) => setFormData({ ...formData, noKontakPj: e.target.value })}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              {/* Perlengkapan & Sasaran Peserta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Perlengkapan yang Disarankan</label>
                  <input
                    type="text"
                    value={formData.perlengkapan}
                    onChange={(e) => setFormData({ ...formData, perlengkapan: e.target.value })}
                    placeholder="Misal: Cangkul, sapu lidi, buku KIA, dll."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Sasaran Peserta / Undangan</label>
                  <input
                    type="text"
                    value={formData.sasaranPeserta}
                    onChange={(e) => setFormData({ ...formData, sasaranPeserta: e.target.value })}
                    placeholder="Misal: Perwakilan 1 orang per KK"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1">
                <label className="font-extrabold text-slate-700">Rincian & Keterangan Agenda *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Jelaskan agenda musyawarah, rute kerja bakti, atau rundown acara..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-indigo-600/20 hover:scale-102 transition-all cursor-pointer"
                >
                  {editingKegiatan ? 'Simpan Pembaruan' : 'Terbitkan Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
