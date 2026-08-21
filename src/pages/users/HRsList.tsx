import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hrs } from '../../data/hrs';
import { Badge, statusTone, Table } from '../../components/ui';

export default function HRsList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('Status');
  const [agencyFilter, setAgencyFilter] = useState('Agency');
  const [campusFilter, setCampusFilter] = useState('Campus access');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="ml-2 bg-[#022A40] text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-[#021d2d] transition-colors"
        >
          Add HR
        </button>
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-center text-[#E87A40] mb-8">Add HR</h2>
              
              <div className="bg-[#f3f6f8] rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    HR Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter HR Name"
                    className="w-full px-3 py-2 bg-white border border-[#E87A40] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#E87A40] shadow-sm text-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    Company<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full px-3 py-2 bg-[#e8eef3] border border-transparent rounded-lg focus:outline-none text-gray-500 appearance-none">
                      <option>None</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    Email Id<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Email Id"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 shadow-sm text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    Phone No<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter Contact Number"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 shadow-sm text-gray-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-8 py-2.5 bg-white border border-[#022A40] text-[#022A40] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-8 py-2.5 bg-[#022A40] text-white rounded-lg font-semibold hover:bg-[#021d2d] transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
