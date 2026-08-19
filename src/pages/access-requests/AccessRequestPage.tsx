import { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, Search, Download, Filter
} from 'lucide-react';
import { getAccessRequests, updateRequestStatus, type AccessRequest, type AccessRequestType } from '../../data/accessRequestData';
import AccessRequestModal from '../../components/access-requests/AccessRequestModal';
import { Badge } from '../../components/ui';

export default function AccessRequestPage() {
  const [activeTab, setActiveTab] = useState<AccessRequestType>('Campus');
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);

  useEffect(() => {
    setRequests(getAccessRequests());
  }, []);

  const handleApprove = (id: string) => {
    updateRequestStatus(id, 'Approved');
    setRequests(getAccessRequests());
  };

  const handleReject = (id: string) => {
    updateRequestStatus(id, 'Rejected');
    setRequests(getAccessRequests());
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchSearch = r.name.toLowerCase().includes(q) || 
                          r.email.toLowerCase().includes(q) || 
                          r.organization.toLowerCase().includes(q);
      const matchTab = r.requestType === activeTab;
      return matchSearch && matchTab;
    });
  }, [searchQuery, activeTab, requests]);

  const tabs: AccessRequestType[] = ['Campus', 'Company', 'User Requests'];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] w-full pb-12 mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ChevronLeft size={20} className="text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Access Request Form</h1>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#003865] tracking-tight">Access Request Form</h2>
          <p className="text-sm text-gray-500 mt-1">Manage platform access requests from companies and institutions</p>
        </div>
        <button className="px-5 py-2 bg-[#3b82f6] text-white rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors">
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-t-lg text-sm font-bold transition-colors ${
                activeTab === tab 
                  ? 'bg-[#003865] text-white' 
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md mb-2">
          <Filter size={18} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, company, or institute..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#10b981] text-white rounded-lg text-sm font-bold hover:bg-[#059669] transition-colors shrink-0">
          <Download size={18} /> Download ALL
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-white text-gray-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-4 px-4 w-12 text-center">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                </th>
                <th className="py-4 px-2 w-16">SR. NO.</th>
                <th className="py-4 px-4">NAME</th>
                <th className="py-4 px-4 text-center">STATUS</th>
                <th className="py-4 px-4">EMAIL</th>
                <th className="py-4 px-4">ORGANIZATION</th>
                <th className="py-4 px-4">LOCATION</th>
                <th className="py-4 px-4">PINCODE</th>
                <th className="py-4 px-4">WEBSITE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredRequests.map(r => (
                <tr 
                  key={r.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRequest(r)}
                >
                  <td className="py-3 px-4 text-center" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  </td>
                  <td className="py-3 px-2 font-medium text-gray-900">{r.serialNumber}</td>
                  <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">{r.name}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge tone={r.status === 'Approved' ? 'green' : r.status === 'Rejected' ? 'red' : 'yellow'}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600 truncate max-w-[200px]" title={r.email}>{r.email}</td>
                  <td className="py-3 px-4 text-gray-900 truncate max-w-[200px]" title={r.organization}>{r.organization}</td>
                  <td className="py-3 px-4 text-gray-600 truncate max-w-[200px]" title={r.location}>{r.location}</td>
                  <td className="py-3 px-4 text-gray-600">{r.pincode}</td>
                  <td className="py-3 px-4 text-blue-600 hover:underline truncate max-w-[200px]" title={r.website} onClick={e => e.stopPropagation()}>
                    <a href={r.website} target="_blank" rel="noreferrer">{r.website}</a>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-500 font-medium">
                    No requests found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">Page <span className="text-gray-900 font-bold">1 of 33</span> (823 total)</p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-400 bg-gray-50 cursor-not-allowed">Previous</button>
            <button className="w-8 h-8 rounded bg-[#3b82f6] text-white font-bold text-sm flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded border border-gray-200 text-gray-600 font-medium text-sm flex items-center justify-center hover:bg-gray-50">2</button>
            <button className="w-8 h-8 rounded border border-gray-200 text-gray-600 font-medium text-sm flex items-center justify-center hover:bg-gray-50">3</button>
            <button className="w-8 h-8 rounded border border-gray-200 text-gray-600 font-medium text-sm flex items-center justify-center hover:bg-gray-50">4</button>
            <button className="w-8 h-8 rounded border border-gray-200 text-gray-600 font-medium text-sm flex items-center justify-center hover:bg-gray-50">5</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded text-sm font-bold text-gray-900 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {selectedRequest && (
        <AccessRequestModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
