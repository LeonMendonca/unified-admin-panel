import { useState, useMemo } from 'react';
import { 
  RefreshCw, Flag, FileText, Download
} from 'lucide-react';
import { whatsappIntakeEvents, type IntakeKind, type IntakeStatus } from '../../data/whatsappIntakeData';
import { Card } from '../../components/ui';

export default function WhatsAppIntakePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<'All kinds' | IntakeKind>('All kinds');
  const [statusFilter, setStatusFilter] = useState<'All statuses' | IntakeStatus>('All statuses');

  const filteredEvents = useMemo(() => {
    return whatsappIntakeEvents.filter(e => {
      const q = searchQuery.toLowerCase();
      const matchSearch = e.senderName.toLowerCase().includes(q) || 
                          e.senderWaId.includes(q) || 
                          e.documentName.toLowerCase().includes(q);
      const matchKind = kindFilter === 'All kinds' || e.kind === kindFilter;
      const matchStatus = statusFilter === 'All statuses' || e.status === statusFilter;
      return matchSearch && matchKind && matchStatus;
    });
  }, [searchQuery, kindFilter, statusFilter]);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] w-full pb-12">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flag className="text-[#f58220]" size={24} />
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">WhatsApp Intake</h1>
          </div>
          <p className="text-sm text-gray-500">Every document received via the WATI webhook and what happened next.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors bg-white">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <Card className="p-0 overflow-hidden shadow-sm border border-gray-200 rounded-2xl bg-white">
        {/* Filters */}
        <div className="p-4 bg-white border-b border-gray-100 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[300px]">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Search</label>
            <input 
              type="text" 
              placeholder="Sender, wa_id, filename, message id.."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-white"
            />
          </div>
          <div className="w-[180px]">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Kind</label>
            <select 
              value={kindFilter} 
              onChange={e => setKindFilter(e.target.value as any)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-400"
            >
              <option value="All kinds">All kinds</option>
              <option value="resume">Resume</option>
              <option value="jd">JD</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div className="w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Status</label>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-400"
            >
              <option value="All statuses">All statuses</option>
              <option value="Synced">Synced</option>
              <option value="Draft job created">Draft job created</option>
              <option value="Needs review">Needs review</option>
              <option value="Duplicate">Duplicate</option>
              <option value="Error">Error</option>
              <option value="Received">Received</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-4 px-6 font-medium">When</th>
                <th className="py-4 px-6 font-medium">Sender</th>
                <th className="py-4 px-6 font-medium">Document</th>
                <th className="py-4 px-6 font-medium">Kind</th>
                <th className="py-4 px-6 font-medium">Action taken</th>
                <th className="py-4 px-6 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEvents.map(e => (
                <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-900 whitespace-nowrap">{e.when}</td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{e.senderName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{e.senderWaId}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[200px]">{e.documentName}</p>
                        {e.documentType && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{e.documentType}</p>}
                      </div>
                      <button className="text-[#f58220] hover:text-orange-600 shrink-0 p-1">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        e.kind === 'resume' ? 'bg-[#e5f0f9] text-[#02759e]' : 
                        e.kind === 'jd' ? 'bg-purple-100 text-purple-700' : 
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {e.kind}
                      </span>
                      {e.kindScore && <span className="text-xs text-gray-500 font-medium">{e.kindScore}%</span>}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        ['Synced', 'Draft job created'].includes(e.status) 
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {e.status}
                      </span>
                      {e.statusSubtext && (
                        <span className={`text-[11px] font-semibold ${
                          e.statusSubtext.includes('View draft job') ? 'text-emerald-600 hover:underline cursor-pointer' :
                          e.statusSubtext.includes('Synced to') ? 'text-emerald-600' :
                          'text-red-500'
                        }`}>
                          {e.statusSubtext}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="font-bold text-gray-900 text-sm hover:underline">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                    No events found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
