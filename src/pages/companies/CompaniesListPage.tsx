import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Filter } from 'lucide-react';
import { mockCompanies } from '../../data/companyData';

export default function CompaniesListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState<'All' | 'Assigned' | 'Missing'>('All');
  const [verifiedFilter, setVerifiedFilter] = useState<'All' | 'Verified' | 'Not verified'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Campus'>('All');

  const filteredCompanies = mockCompanies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.domain.toLowerCase().includes(search.toLowerCase()) || 
                          c.industry.toLowerCase().includes(search.toLowerCase());
                          
    const matchesAdmin = adminFilter === 'All' ? true : 
                         adminFilter === 'Missing' ? c.status === 'No company admin' : 
                         c.status !== 'No company admin';
                         
    const matchesVerified = verifiedFilter === 'All' ? true : 
                            verifiedFilter === 'Verified' ? c.verified : 
                            !c.verified;

    const matchesType = typeFilter === 'All' ? true : c.hasCampusAccess;

    return matchesSearch && matchesAdmin && matchesVerified && matchesType;
  });

  const totalVerified = mockCompanies.filter(c => c.verified).length;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] w-full pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={28} className="text-[#f97316]" />
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Companies</h1>
          </div>
          <p className="text-sm text-gray-500">{mockCompanies.length} total • {totalVerified} verified</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#003865] text-white px-5 py-2 rounded-md font-bold text-sm hover:bg-[#002848] transition-colors"
          >
            + Add Company
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1 min-w-[300px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, domain, Industry.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border-none focus:outline-none focus:ring-0 bg-transparent"
          />
        </div>
        <div className="w-px h-6 bg-gray-200"></div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className="text-sm border-none bg-transparent focus:ring-0 text-gray-600 cursor-pointer">
          <option value="All">All Companies</option>
          <option value="Campus">Campus Linked</option>
        </select>
        <div className="w-px h-6 bg-gray-200"></div>
        <select value={adminFilter} onChange={e => setAdminFilter(e.target.value as any)} className="text-sm border-none bg-transparent focus:ring-0 text-gray-600 cursor-pointer">
          <option value="All">Sort By (Company Admin)</option>
          <option value="Assigned">Assigned</option>
          <option value="Missing">Missing Admin</option>
        </select>
        <div className="w-px h-6 bg-gray-200"></div>
        <select value={verifiedFilter} onChange={e => setVerifiedFilter(e.target.value as any)} className="text-sm border-none bg-transparent focus:ring-0 text-gray-600 cursor-pointer">
          <option value="All">All Statuses</option>
          <option value="Verified">Verified</option>
          <option value="Not verified">Not verified</option>
        </select>
        <button className="w-9 h-9 flex items-center justify-center bg-[#003865] text-white rounded-lg ml-auto hover:bg-[#002848] transition-colors">
          <Filter size={16} />
        </button>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-white text-gray-500">
                <th className="py-4 px-6 font-medium">Company</th>
                <th className="py-4 px-6 font-medium">Domain</th>
                <th className="py-4 px-6 font-medium">Industry</th>
                <th className="py-4 px-6 font-medium text-center">Members</th>
                <th className="py-4 px-6 font-medium text-center">Campus</th>
                <th className="py-4 px-6 font-medium text-center">Status</th>
                <th className="py-4 px-6 font-medium text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-900">
              {filteredCompanies.map(c => (
                <tr key={c.id} onClick={() => navigate(`/companies/${c.id}`)} className="hover:bg-gray-50 cursor-pointer group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.name} className="w-8 h-8 rounded-md bg-gray-100 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                          <Building2 size={16} />
                        </div>
                      )}
                      <span className="font-semibold text-gray-900 group-hover:text-[#f97316] transition-colors">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{c.domain || '—'}</td>
                  <td className="py-4 px-6 text-gray-600">{c.industry || '—'}</td>
                  <td className="py-4 px-6 text-center font-medium">{c.membersCount}</td>
                  <td className="py-4 px-6 text-center">
                    {c.hasCampusAccess ? (
                      <span className="bg-sky-50 text-sky-600 px-2 py-1 rounded text-xs font-bold border border-sky-100">Yes</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {c.status === 'No company admin' ? (
                      <span className="inline-block px-3 py-1 rounded-full border border-orange-200 text-orange-600 text-xs font-bold">
                        No company admin
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right text-gray-500">{c.createdDate}</td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">No companies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-[#f97316] text-3xl font-black mb-2">Add Company</h2>
              <p className="text-gray-400 font-medium">Register a new company to start posting jobs and managing recruitment</p>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              {/* Basic Information */}
              <div className="bg-[#f8f9fa] rounded-xl p-6 border border-gray-100">
                <h3 className="text-[#f97316] font-bold mb-6 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-[#f97316] flex items-center justify-center text-xs">i</span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Company Name<span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter Company Name" className="w-full bg-white border border-[#f97316]/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#f97316]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Official Website URL<span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter website URL" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Pin code (Headquarters)<span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter Pin Code" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">City, State<span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Will be auto-filled from pincode" disabled className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Address Line 1<span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Building Name, Street Name" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Address Line 2</label>
                    <input type="text" placeholder="Landmark, Locality, Area" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-[#f8f9fa] rounded-xl p-6 border border-gray-100">
                <h3 className="text-[#f97316] font-bold mb-6">Contact Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Contact No.<span className="text-red-500">*</span></label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 bg-white border border-r-0 border-gray-200 rounded-l-lg text-[#f97316] text-sm">+91</span>
                      <input type="text" placeholder="Enter Number" className="w-full bg-white border border-gray-200 rounded-r-lg px-4 py-2.5 text-sm focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Email<span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter Email" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Contact Person<span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter Name" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Alternate Contact No.</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 bg-white border border-r-0 border-gray-200 rounded-l-lg text-[#f97316] text-sm">+91</span>
                      <input type="text" placeholder="Enter Number" className="w-full bg-white border border-gray-200 rounded-r-lg px-4 py-2.5 text-sm focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrative Details */}
              <div className="bg-[#f8f9fa] rounded-xl p-6 border border-gray-100 mb-4">
                <h3 className="text-[#f97316] font-bold mb-6">Administrative Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Type of Company<span className="text-red-500">*</span></label>
                    <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-500">
                      <option>Select Type</option>
                      <option>Private</option>
                      <option>Public</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Total No. of Employees<span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Eg 20,000" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-4 bg-white flex-shrink-0">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-8 py-2.5 rounded-lg border border-[#003865] text-[#003865] font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="bg-[#003865] text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-[#002848] transition-colors"
              >
                Add Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
