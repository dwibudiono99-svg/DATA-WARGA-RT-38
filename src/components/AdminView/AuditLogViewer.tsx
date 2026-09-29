import React, { useState } from 'react';
import { useRBAC } from '../../context/RBACContext';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Laptop,
  Download,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { AuditLog } from '../../types/rbac';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useRBAC();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'denied'>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  const modules = Array.from(new Set(auditLogs.map((l) => l.module)));

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;

    return matchesSearch && matchesStatus && matchesModule;
  });

  const exportLogsAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rbac_audit_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const deniedCount = auditLogs.filter((l) => l.status === 'denied').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              <span>Log Audit Keamanan & Jejak Aktivitas</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {auditLogs.length} Catatan
            </span>
            {deniedCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                {deniedCount} Akses Ditolak
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekaman digital seluruh peristiwa sistem termasuk login, perubahan role, pengeditan dokumen, dan percobaan akses terlarang (HTTP 403).
          </p>
        </div>

        <button
          onClick={exportLogsAsJson}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs transition-colors self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor JSON</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aksi, nama pengguna, detail, atau alamat IP..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Semua Status</option>
            <option value="success">Berhasil (Success)</option>
            <option value="denied">Akses Ditolak (Denied 403)</option>
          </select>

          {/* Module Filter */}
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">Semua Modul</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Pengguna & Peran</th>
                <th className="px-6 py-4">Aksi / Event</th>
                <th className="px-6 py-4">Modul</th>
                <th className="px-6 py-4">Hasil RBAC</th>
                <th className="px-6 py-4">Rincian Peristiwa</th>
                <th className="px-6 py-4">Alamat IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    Tidak ada rekam jejak aktivitas yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isDenied = log.status === 'denied';

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isDenied ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="px-6 py-3.5 text-slate-500 whitespace-nowrap text-[11px] font-mono">
                        {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                        <span className="block text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </td>

                      {/* User & Role */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-800">{log.userName}</div>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                            log.userRole === 'admin'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {log.userRole}
                        </span>
                      </td>

                      {/* Action Code */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-bold">
                          {log.action}
                        </span>
                      </td>

                      {/* Module */}
                      <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-600">
                        {log.module}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        {isDenied ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>DITOLAK (403)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>DIIZINKAN</span>
                          </span>
                        )}
                      </td>

                      {/* Details */}
                      <td className="px-6 py-3.5 text-slate-600 max-w-xs text-[11px] leading-relaxed">
                        {log.details}
                      </td>

                      {/* IP Address */}
                      <td className="px-6 py-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {log.ipAddress}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
