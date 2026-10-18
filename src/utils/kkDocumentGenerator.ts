/**
 * Utility to generate high-resolution official-style Indonesian Kartu Keluarga
 * document image on Canvas for OCR testing and simultaneous scanning demonstration.
 */

export interface SampleKKDocumentSpec {
  nomorKK: string;
  namaKepalaKeluarga: string;
  alamat: string;
  rtRw: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  kodePos: string;
  provinsi: string;
  estimasiBlok: string;
  estimasiNomor: string;
  pekerjaan: string;
  anggota: Array<{
    nama: string;
    nik: string;
    jk: 'Laki-laki' | 'Perempuan';
    tempatLahir: string;
    tanggalLahir: string;
    agama: string;
    pendidikan: string;
    pekerjaan: string;
    statusHubungan: string;
    statusKawin: string;
  }>;
}

export const SAMPLE_KK_DOCUMENTS: SampleKKDocumentSpec[] = [
  {
    nomorKK: '3515141208080001',
    namaKepalaKeluarga: 'H. Suryadi Gunawan',
    alamat: 'Perumahan Griyo Taman Asri Blok AE No. 01',
    rtRw: '038/009',
    desaKelurahan: 'Sepanjang',
    kecamatan: 'Taman',
    kabupatenKota: 'Kabupaten Sidoarjo',
    kodePos: '61257',
    provinsi: 'Jawa Timur',
    estimasiBlok: 'Blok AE',
    estimasiNomor: 'AE-01',
    pekerjaan: 'Pengusaha Manufaktur',
    anggota: [
      {
        nama: 'H. Suryadi Gunawan',
        nik: '3515141506720001',
        jk: 'Laki-laki',
        tempatLahir: 'Sidoarjo',
        tanggalLahir: '1972-06-15',
        agama: 'Islam',
        pendidikan: 'Strata I',
        pekerjaan: 'Pengusaha Manufaktur',
        statusHubungan: 'Kepala Keluarga',
        statusKawin: 'Kawin Tercatat',
      },
      {
        nama: 'Hj. Endang Sulistiyowati',
        nik: '3515145809750002',
        jk: 'Perempuan',
        tempatLahir: 'Surabaya',
        tanggalLahir: '1975-09-18',
        agama: 'Islam',
        pendidikan: 'Diploma III',
        pekerjaan: 'Mengurus Rumah Tangga',
        statusHubungan: 'Istri',
        statusKawin: 'Kawin Tercatat',
      },
      {
        nama: 'Dimas Surya Gunawan',
        nik: '3515142104030003',
        jk: 'Laki-laki',
        tempatLahir: 'Sidoarjo',
        tanggalLahir: '2003-04-21',
        agama: 'Islam',
        pendidikan: 'Diploma IV / Strata I',
        pekerjaan: 'Pelajar / Mahasiswa',
        statusHubungan: 'Anak',
        statusKawin: 'Belum Kawin',
      },
      {
        nama: 'Nabila Putri Gunawan',
        nik: '3515146208090004',
        jk: 'Perempuan',
        tempatLahir: 'Sidoarjo',
        tanggalLahir: '2009-08-22',
        agama: 'Islam',
        pendidikan: 'SLTP / Sederajat',
        pekerjaan: 'Pelajar / Mahasiswa',
        statusHubungan: 'Anak',
        statusKawin: 'Belum Kawin',
      },
    ],
  },
  {
    nomorKK: '3515141804100002',
    namaKepalaKeluarga: 'Dr. Rahmat Hidayat, Sp.PD',
    alamat: 'Perumahan Griyo Taman Asri Blok AE No. 02',
    rtRw: '038/009',
    desaKelurahan: 'Sepanjang',
    kecamatan: 'Taman',
    kabupatenKota: 'Kabupaten Sidoarjo',
    kodePos: '61257',
    provinsi: 'Jawa Timur',
    estimasiBlok: 'Blok AE',
    estimasiNomor: 'AE-02',
    pekerjaan: 'Dokter Spesialis',
    anggota: [
      {
        nama: 'Dr. Rahmat Hidayat, Sp.PD',
        nik: '3515141003800002',
        jk: 'Laki-laki',
        tempatLahir: 'Malang',
        tanggalLahir: '1980-03-10',
        agama: 'Islam',
        pendidikan: 'Spesialis / Strata II',
        pekerjaan: 'Dokter Spesialis',
        statusHubungan: 'Kepala Keluarga',
        statusKawin: 'Kawin Tercatat',
      },
      {
        nama: 'drg. Maya Safitri',
        nik: '3515145507820003',
        jk: 'Perempuan',
        tempatLahir: 'Surabaya',
        tanggalLahir: '1982-07-15',
        agama: 'Islam',
        pendidikan: 'Profesi Dokter Gigi',
        pekerjaan: 'Dokter Gigi',
        statusHubungan: 'Istri',
        statusKawin: 'Kawin Tercatat',
      },
      {
        nama: 'Farhan Aditya Hidayat',
        nik: '3515141911120004',
        jk: 'Laki-laki',
        tempatLahir: 'Sidoarjo',
        tanggalLahir: '2012-11-19',
        agama: 'Islam',
        pendidikan: 'Tamat SD / Sederajat',
        pekerjaan: 'Pelajar / Mahasiswa',
        statusHubungan: 'Anak',
        statusKawin: 'Belum Kawin',
      },
    ],
  },
  {
    nomorKK: '3515142205120003',
    namaKepalaKeluarga: 'Ahmad Fauzi Rahman, S.T.',
    alamat: 'Perumahan Griyo Taman Asri Blok AE No. 03',
    rtRw: '038/009',
    desaKelurahan: 'Sepanjang',
    kecamatan: 'Taman',
    kabupatenKota: 'Kabupaten Sidoarjo',
    kodePos: '61257',
    provinsi: 'Jawa Timur',
    estimasiBlok: 'Blok AE',
    estimasiNomor: 'AE-03',
    pekerjaan: 'Insinyur Sipil & Pengembang',
    anggota: [
      {
        nama: 'Ahmad Fauzi Rahman, S.T.',
        nik: '3515141807830003',
        jk: 'Laki-laki',
        tempatLahir: 'Gresik',
        tanggalLahir: '1983-07-18',
        agama: 'Islam',
        pendidikan: 'Diploma IV / Strata I',
        pekerjaan: 'Insinyur Sipil',
        statusHubungan: 'Kepala Keluarga',
        statusKawin: 'Kawin Tercatat',
      },
      {
        nama: 'Anita Wulandari, S.Pd.',
        nik: '3515145203850005',
        jk: 'Perempuan',
        tempatLahir: 'Sidoarjo',
        tanggalLahir: '1985-03-12',
        agama: 'Islam',
        pendidikan: 'Diploma IV / Strata I',
        pekerjaan: 'Guru Sekolah Dasar',
        statusHubungan: 'Istri',
        statusKawin: 'Kawin Tercatat',
      },
      {
        nama: 'Rayhan Akbar Rahman',
        nik: '3515140810140006',
        jk: 'Laki-laki',
        tempatLahir: 'Sidoarjo',
        tanggalLahir: '2014-10-08',
        agama: 'Islam',
        pendidikan: 'Tamat SD / Sederajat',
        pekerjaan: 'Pelajar / Mahasiswa',
        statusHubungan: 'Anak',
        statusKawin: 'Belum Kawin',
      },
      {
        nama: 'Alya Shasikirana',
        nik: '3515146512190007',
        jk: 'Perempuan',
        tempatLahir: 'Sidoarjo',
        tanggalLahir: '2019-12-25',
        agama: 'Islam',
        pendidikan: 'Belum Tamat SD',
        pekerjaan: 'Belum / Tidak Bekerja',
        statusHubungan: 'Anak',
        statusKawin: 'Belum Kawin',
      },
    ],
  },
  {
    nomorKK: '3515140509060004',
    namaKepalaKeluarga: 'Drs. H. Bambang Trihatmodjo',
    alamat: 'Perumahan Griyo Taman Asri Blok DB No. 01',
    rtRw: '038/009',
    desaKelurahan: 'Sepanjang',
    kecamatan: 'Taman',
    kabupatenKota: 'Kabupaten Sidoarjo',
    kodePos: '61257',
    provinsi: 'Jawa Timur',
    estimasiBlok: 'Blok DB',
    estimasiNomor: 'DB-01',
    pekerjaan: 'Pensiunan BUMN',
    anggota: [
      {
        nama: 'Drs. H. Bambang Trihatmodjo',
        nik: '3515141209680004',
        jk: 'Laki-laki',
        tempatLahir: 'Solo',
        tanggalLahir: '1968-09-12',
        agama: 'Islam',
        pendidikan: 'Diploma IV / Strata I',
        pekerjaan: 'Pensiunan BUMN',
        statusHubungan: 'Kepala Keluarga',
        statusKawin: 'Kawin Tercatat',
      },
      {
        nama: 'Dra. Sri Rahayu',
        nik: '3515144811700008',
        jk: 'Perempuan',
        tempatLahir: 'Yogyakarta',
        tanggalLahir: '1970-11-08',
        agama: 'Islam',
        pendidikan: 'Diploma IV / Strata I',
        pekerjaan: 'Pegawai Negeri Sipil (PNS)',
        statusHubungan: 'Istri',
        statusKawin: 'Kawin Tercatat',
      },
      {
        nama: 'Bagus Satrio Wicaksono',
        nik: '3515141402980009',
        jk: 'Laki-laki',
        tempatLahir: 'Sidoarjo',
        tanggalLahir: '1998-02-14',
        agama: 'Islam',
        pendidikan: 'Strata I',
        pekerjaan: 'Karyawan Swasta',
        statusHubungan: 'Anak',
        statusKawin: 'Belum Kawin',
      },
    ],
  },
  {
    nomorKK: '3515143011150005',
    namaKepalaKeluarga: 'Hendra Setiawan',
    alamat: 'Perumahan Griyo Taman Asri Blok DC No. 01',
    rtRw: '038/009',
    desaKelurahan: 'Sepanjang',
    kecamatan: 'Taman',
    kabupatenKota: 'Kabupaten Sidoarjo',
    kodePos: '61257',
    provinsi: 'Jawa Timur',
    estimasiBlok: 'Blok DC',
    estimasiNomor: 'DC-01',
    pekerjaan: 'Manajer Keuangan',
    anggota: [
      {
        nama: 'Hendra Setiawan',
        nik: '3515142511870005',
        jk: 'Laki-laki',
        tempatLahir: 'Surabaya',
        tanggalLahir: '1987-11-25',
        agama: 'Kristen',
        pendidikan: 'Diploma IV / Strata I',
        pekerjaan: 'Manajer Keuangan',
        statusHubungan: 'Kepala Keluarga',
        statusKawin: 'Kawin Tercatat',
      },
      {
        nama: 'Linda Christina, S.E.',
        nik: '3515145906890006',
        jk: 'Perempuan',
        tempatLahir: 'Semarang',
        tanggalLahir: '1989-06-19',
        agama: 'Kristen',
        pendidikan: 'Diploma IV / Strata I',
        pekerjaan: 'Auditor Keuangan',
        statusHubungan: 'Istri',
        statusKawin: 'Kawin Tercatat',
      },
      {
        nama: 'Kevin Christian Setiawan',
        nik: '3515141508180007',
        jk: 'Laki-laki',
        tempatLahir: 'Sidoarjo',
        tanggalLahir: '2018-08-15',
        agama: 'Kristen',
        pendidikan: 'Belum Tamat SD',
        pekerjaan: 'Belum / Tidak Bekerja',
        statusHubungan: 'Anak',
        statusKawin: 'Belum Kawin',
      },
    ],
  },
];

/**
 * Renders a crisp Indonesian Kartu Keluarga document image on an HTML5 canvas.
 * Returns JPEG data URL suitable for Gemini Vision OCR processing.
 */
export function renderKKDocumentToDataUrl(spec: SampleKKDocumentSpec): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background: Official parchment tint
  ctx.fillStyle = '#faf8f2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative border
  ctx.strokeStyle = '#1e3a8a';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  ctx.lineWidth = 1;
  ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50);

  // Header Title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px serif';
  ctx.textAlign = 'center';
  ctx.fillText('REPUBLIK INDONESIA', canvas.width / 2, 65);

  ctx.font = '900 36px sans-serif';
  ctx.fillText('KARTU KELUARGA', canvas.width / 2, 105);

  ctx.font = 'bold 22px monospace';
  ctx.fillText(`No. ${spec.nomorKK}`, canvas.width / 2, 140);

  // Subheader Details (2 Columns)
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';

  // Left Column
  const leftX = 50;
  ctx.fillText(`Nama Kepala Keluarga  : ${spec.namaKepalaKeluarga}`, leftX, 180);
  ctx.fillText(`Alamat                : ${spec.alamat}`, leftX, 205);
  ctx.fillText(`RT/RW                 : ${spec.rtRw}`, leftX, 230);
  ctx.fillText(`Desa/Kelurahan        : ${spec.desaKelurahan}`, leftX, 255);

  // Right Column
  const rightX = 650;
  ctx.fillText(`Kecamatan             : ${spec.kecamatan}`, rightX, 180);
  ctx.fillText(`Kabupaten/Kota        : ${spec.kabupatenKota}`, rightX, 205);
  ctx.fillText(`Kode Pos              : ${spec.kodePos}`, rightX, 230);
  ctx.fillText(`Provinsi              : ${spec.provinsi}`, rightX, 255);

  // Main Members Table 1 (Demographics)
  const tableY = 280;
  const colWidths = [40, 260, 200, 100, 140, 110, 90, 160];
  const headers = ['No', 'Nama Lengkap', 'NIK', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'Agama', 'Pendidikan'];

  // Table header background
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(leftX, tableY, canvas.width - 100, 30);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.strokeRect(leftX, tableY, canvas.width - 100, 30);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px sans-serif';
  let curX = leftX;
  headers.forEach((h, i) => {
    ctx.fillText(h, curX + 6, tableY + 20);
    curX += colWidths[i];
    if (i < headers.length - 1) {
      ctx.beginPath();
      ctx.moveTo(curX, tableY);
      ctx.lineTo(curX, tableY + 30);
      ctx.stroke();
    }
  });

  // Table rows
  ctx.font = '12px sans-serif';
  let rowY = tableY + 30;
  spec.anggota.forEach((m, idx) => {
    const rowH = 28;
    ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    ctx.fillRect(leftX, rowY, canvas.width - 100, rowH);
    ctx.strokeRect(leftX, rowY, canvas.width - 100, rowH);

    ctx.fillStyle = '#0f172a';
    let cellX = leftX;
    const values = [
      String(idx + 1),
      m.nama,
      m.nik,
      m.jk,
      m.tempatLahir,
      m.tanggalLahir,
      m.agama,
      m.pendidikan,
    ];

    values.forEach((v, vi) => {
      ctx.fillText(v, cellX + 6, rowY + 19);
      cellX += colWidths[vi];
      if (vi < values.length - 1) {
        ctx.beginPath();
        ctx.moveTo(cellX, rowY);
        ctx.lineTo(cellX, rowY + rowH);
        ctx.stroke();
      }
    });

    rowY += rowH;
  });

  // Table 2: Status & Relationships
  const table2Y = rowY + 20;
  const col2Widths = [40, 200, 180, 220, 240, 220];
  const headers2 = ['No', 'Status Hubungan', 'Status Kawin', 'Pekerjaan', 'Kewarganegaraan', 'No. Registrasi SIAK'];

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(leftX, table2Y, canvas.width - 100, 30);
  ctx.strokeRect(leftX, table2Y, canvas.width - 100, 30);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px sans-serif';
  let cur2X = leftX;
  headers2.forEach((h, i) => {
    ctx.fillText(h, cur2X + 6, table2Y + 20);
    cur2X += col2Widths[i];
    if (i < headers2.length - 1) {
      ctx.beginPath();
      ctx.moveTo(cur2X, table2Y);
      ctx.lineTo(cur2X, table2Y + 30);
      ctx.stroke();
    }
  });

  let row2Y = table2Y + 30;
  spec.anggota.forEach((m, idx) => {
    const rowH = 26;
    ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    ctx.fillRect(leftX, row2Y, canvas.width - 100, rowH);
    ctx.strokeRect(leftX, row2Y, canvas.width - 100, rowH);

    ctx.fillStyle = '#0f172a';
    ctx.font = '12px sans-serif';
    let cellX = leftX;
    const values2 = [
      String(idx + 1),
      m.statusHubungan,
      m.statusKawin,
      m.pekerjaan,
      'WNI',
      `SIAK-${spec.nomorKK.slice(0, 6)}-0${idx + 1}`,
    ];

    values2.forEach((v, vi) => {
      ctx.fillText(v, cellX + 6, row2Y + 18);
      cellX += col2Widths[vi];
      if (vi < values2.length - 1) {
        ctx.beginPath();
        ctx.moveTo(cellX, row2Y);
        ctx.lineTo(cellX, row2Y + rowH);
        ctx.stroke();
      }
    });

    row2Y += rowH;
  });

  // Footer: Signatures, Stamp & QR Barcode
  const footY = canvas.height - 130;
  ctx.font = '12px sans-serif';
  ctx.fillText('KEPALA KELUARGA,', 120, footY);
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(spec.namaKepalaKeluarga, 120, footY + 70);

  ctx.font = '12px sans-serif';
  ctx.fillText(`Dikeluarkan di: Sidoarjo`, 750, footY - 15);
  ctx.fillText(`Pada Tanggal: 14 Februari 2026`, 750, footY);
  ctx.fillText('KEPALA DINAS KEPENDUDUKAN DAN PENCATATAN SIPIL,', 750, footY + 15);

  // Draw simulated official Dukcapil QR Code box
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.strokeRect(980, footY + 25, 60, 60);
  ctx.fillStyle = '#0369a1';
  ctx.font = '9px monospace';
  ctx.fillText('SIAK QR', 990, footY + 58);

  // Return crisp data URL
  return canvas.toDataURL('image/jpeg', 0.92);
}
