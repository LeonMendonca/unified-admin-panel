import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hrs } from '../../data/hrs';
import { Badge, statusTone, Table } from '../../components/ui';

export default function HRsList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('Status');
  const [agencyFilter, setAgencyFilter] = useState('Agency');
  const [campusFilter, setCampusFilter] = useState('Campus access');

  const filtered = hrs.filter((h) => {
    if (statusFilter !== 'Status' && h.status !== statusFilter) return false;
    if (agencyFilter !== 'Agency' && h.agency !== agencyFilter) return false;
    if (campusFilter !== 'Campus access' && h.campusAccessStatus !== campusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white">
          <option>Status</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
        <select value={agencyFilter} onChange={(e) => setAgencyFilter(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white">
          <option>Agency</option>
          <option>Pool owner</option>
          <option>Pool member</option>
        </select>
        <select value={campusFilter} onChange={(e) => setCampusFilter(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white">
          <option>Campus access</option>
          <option>Not requested</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} HRs</span>
      </div>
      <Table headers={['Name', 'Email', 'Company', 'Jobs', 'Credit balance', 'Agency', 'Status', 'Campus access', 'Joined']}>
        {filtered.map((h) => (
          <tr key={h.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/users/hrs/${h.id}`)}>
            <td className="py-2.5 px-3 font-medium text-gray-800">{h.name}</td>
            <td className="py-2.5 px-3 text-gray-600">{h.email}</td>
            <td className="py-2.5 px-3 text-gray-600">{h.companyName}</td>
            <td className="py-2.5 px-3 text-gray-600">{h.jobsCount}</td>
            <td className="py-2.5 px-3 text-gray-600">{h.creditBalance}</td>
            <td className="py-2.5 px-3 text-gray-600">{h.agency}</td>
            <td className="py-2.5 px-3"><Badge tone={statusTone(h.status)}>{h.status}</Badge></td>
            <td className="py-2.5 px-3"><Badge tone={statusTone(h.campusAccessStatus)}>{h.campusAccessStatus}</Badge></td>
            <td className="py-2.5 px-3 text-gray-600">{h.joined}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
