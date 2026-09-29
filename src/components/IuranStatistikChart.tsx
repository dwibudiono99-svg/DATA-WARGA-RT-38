import React, { useState, useMemo } from 'react';
import { useRBAC } from '../context/RBACContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  Calendar,
  Layers,
  ChevronDown,
  Info,
} from 'lucide-react';

interface IuranStatistikChartProps {
  variant?: 'admin' | 'warga';
  onNavigateIuran?: () => void;
}

export const IuranStatistikChart: React.FC<IuranStatistikChartProps> = ({
  variant = 'admin',
  onNavigateIuran,
}) => {
  const { iuranList, wargaList, currentUser, infoPerumahan } = useRBAC();

  // Extract available periods
  const availablePeriods = useMemo(() => {
    const periods = Array.from(new Set(iuranList.map((i) => i.periodeBulan)));
    if (periods.length === 0) return ['September 2026'];
    return periods;
  }, [iuranList]);

  // Default to first period or September 2026
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    availablePeriods[0] || 'September 2026'
  );

  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');

  // Filter dues for selected period
  const duesForPeriod = useMemo(() => {
    return iuranList.filter((i) => i.periodeBulan === selectedPeriod);
  }, [iuranList, selectedPeriod]);

  // Calculate stats
  const stats = useMemo(() => {
    const lunasList = duesForPeriod.filter((i) => i.statusBayar === 'Lunas');
    const pendingList = duesForPeriod.filter((i) => i.statusBayar === 'Menunggu Verifikasi');
    const belumList = duesForPeriod.filter((i) => i.statusBayar === 'Belum Bayar');

    // Total registered houses / residents
    const totalKK = wargaList.length > 0 ? wargaList.length : duesForPeriod.length;

    const countLunas = lunasList.length;
    const countPending = pendingList.length;
    // Anyone in wargaList who is not in lunas or pending is unpaid
    const countBelum = Math.max(totalKK - countLunas - countPending, belumList.length);

    const nominalTerkumpul = lunasList.reduce((acc, curr) => acc + curr.nominal, 0);
    const nominalPending = pendingList.reduce((acc, curr) => acc + curr.nominal, 0);
    const targetNominal = totalKK * 150000;

    const percentageLunas = totalKK > 0 ? Math.round((countLunas / totalKK) * 100) : 0;

    return {
      totalKK,
      countLunas,
      countPending,
      countBelum,
      nominalTerkumpul,
      nominalPending,
      targetNominal,
      percentageLunas,
    };
  }, [duesForPeriod, wargaList]);

  // Data for Donut / Pie Chart
  const pieData = useMemo(() => {
    return [
      { name: 'Sudah Membayar (Lunas)', value: stats.countLunas, color: '#10B981' },
      { name: 'Menunggu Verifikasi', value: stats.countPending, color: '#F59E0B' },
      { name: 'Belum Membayar', value: stats.countBelum, color: '#EF4444' },
    ].filter((item) => item.value > 0);
  }, [stats]);

  // Data for Bar Chart breakdown by Block
  const blockData = useMemo(() => {
    const blocks = ['Blok A', 'Blok B', 'Blok C', 'Blok D'];
    return blocks.map((blk) => {
      const wargaInBlk = wargaList.filter((w) => w.blokRumah === blk);
      const duesInBlk = duesForPeriod.filter((i) => i.blokRumah === blk);

      const lunasCount = duesInBlk.filter((i) => i.statusBayar === 'Lunas').length;
      const totalInBlk = wargaInBlk.length;
      const belumCount = Math.max(totalInBlk - lunasCount, 0);

      return {
        blok: blk,
        'Sudah Lunas': lunasCount,
        'Belum Bayar': belumCount,
        total: totalInBlk,
      };
    });
  }, [duesForPeriod, wargaList]);

  // Check current user payment status for this period
  const myDueThisMonth = duesForPeriod.find(
    (i) => i.blokRumah === currentUser.blokRumah && i.nomorRumah === currentUser.nomorRumah
  );
  const isMyDueLunas = myDueThisMonth?.statusBayar === 'Lunas';

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
              Statistik & Partisipasi Iuran Warga
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              IPL Lingkungan
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {variant === 'admin'
              ? 'Monitoring real-time rekapitulasi pelunasan iuran keamanan & kebersihan seluruh warga perumahan.'
              : 'Transparansi kas dan persentase partisipasi iuran lingkungan warga RT 04 bulan ini.'}
          </p>
        </div>

        {/* Filters and View Switcher */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Period Selector */}
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              {availablePeriods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setChartType('donut')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === 'donut'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Donat
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Per Blok
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Sudah Bayar */}
        <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
              Sudah Membayar
            </span>
            <p className="text-2xl font-black text-emerald-950">
              {stats.countLunas}{' '}
              <span className="text-xs font-bold text-emerald-700">/ {stats.totalKK} KK</span>
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              Rp {stats.nominalTerkumpul.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Belum Bayar */}
        <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">
              Belum Membayar
            </span>
            <p className="text-2xl font-black text-rose-950">
              {stats.countBelum}{' '}
              <span className="text-xs font-bold text-rose-700">KK</span>
            </p>
            <span className="text-[10px] text-rose-700 font-semibold block">
              Perlu penyelesaian
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
            <AlertCircle className="w-5 h-5 text-rose-600 animate-pulse" />
          </div>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
              Menunggu Cek
            </span>
            <p className="text-2xl font-black text-amber-950">
              {stats.countPending}{' '}
              <span className="text-xs font-bold text-amber-700">Bukti</span>
            </p>
            <span className="text-[10px] text-amber-700 font-semibold block">
              Bukti transfer masuk
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Persentase Pelunasan */}
        <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wide">
              Tingkat Kepatuhan
            </span>
            <p className="text-2xl font-black text-indigo-950">
              {stats.percentageLunas}%
            </p>
            <span className="text-[10px] text-indigo-700 font-semibold block">
              Target Rp {stats.targetNominal.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Main Chart Area with Progress & Side Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Recharts Visualization (7 Cols) */}
        <div className="lg:col-span-7 h-64 sm:h-72 w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'donut' ? (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Kepala Keluarga`, name]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-[11px] font-bold text-slate-700">{value}</span>
                  )}
                />
              </PieChart>
            ) : (
              <BarChart
                data={blockData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="blok" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-[11px] font-bold text-slate-700">{value}</span>
                  )}
                />
                <Bar dataKey="Sudah Lunas" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Belum Bayar" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>

          {/* Centered Donut Label */}
          {chartType === 'donut' && (
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 leading-none">
                {stats.percentageLunas}%
              </span>
              <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider block mt-0.5">
                Lunas
              </span>
            </div>
          )}
        </div>

        {/* Right: Informational Breakdown & Action (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Progres Pelunasan Warga</span>
              <span className="text-emerald-700">
                {stats.countLunas} dari {stats.totalKK} Rumah ({stats.percentageLunas}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${stats.percentageLunas}%` }}
                className="bg-emerald-500 transition-all duration-500 rounded-l-full"
              />
              <div
                style={{
                  width: `${
                    stats.totalKK > 0 ? (stats.countPending / stats.totalKK) * 100 : 0
                  }%`,
                }}
                className="bg-amber-400 transition-all duration-500"
              />
              <div
                style={{
                  width: `${
                    stats.totalKK > 0 ? (stats.countBelum / stats.totalKK) * 100 : 0
                  }%`,
                }}
                className="bg-rose-400 transition-all duration-500 rounded-r-full"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Sudah Bayar
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Belum Bayar
              </span>
            </div>
          </div>

          {/* Personalized or Admin Specific Notice */}
          {variant === 'warga' ? (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isMyDueLunas
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Status Iuran Rumah Anda ({currentUser.blokRumah} No. {currentUser.nomorRumah}):
                </span>
                <div className="flex items-center gap-1.5">
                  {isMyDueLunas ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-extrabold text-sm text-emerald-900">
                        Lunas untuk {selectedPeriod}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="font-extrabold text-sm text-amber-900">
                        Belum Lunas ({selectedPeriod})
                      </span>
                    </>
                  )}
                </div>
              </div>

              {onNavigateIuran && !isMyDueLunas && (
                <button
                  type="button"
                  onClick={onNavigateIuran}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
                >
                  Bayar Sekarang
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 block">
                  Total Kas Terkumpul Bulan Ini:
                </span>
                <p className="text-xl font-black mt-0.5">
                  Rp {stats.nominalTerkumpul.toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-slate-400">
                  Dari total potensi Rp {stats.targetNominal.toLocaleString('id-ID')}
                </span>
              </div>

              {onNavigateIuran && (
                <button
                  type="button"
                  onClick={onNavigateIuran}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Kelola Iuran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
