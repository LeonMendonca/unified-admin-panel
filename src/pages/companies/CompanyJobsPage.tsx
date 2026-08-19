import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, X } from 'lucide-react';
import { mockCompanies, mockCompanyJobs } from '../../data/companyData';

export default function CompanyJobsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = mockCompanies.find(c => c.id === id) || mockCompanies[0];

  const [activeTab, setActiveTab] = useState<'Jobs' | 'Active' | 'Past' | 'Drafts'>('Past');
  const [search, setSearch] = useState('');

  const rows = activeTab === 'Past' ? mockCompanyJobs : [];

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] w-full pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 bg-[#f0f4f8] p-4 rounded-xl border border-gray-200">
        <button onClick={() => navigate(`/companies/${company.id}`)} className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full text-gray-900 shadow-sm transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 leading-tight">Company Jobs</h1>
          <p className="text-sm text-gray-500 font-medium">{company.name}</p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#f0f4f8] rounded-xl p-8 flex flex-col justify-center border border-gray-200 h-32">
        <h2 className="text-2xl font-black text-[#003865] mb-1">All Jobs</h2>
        <p className="text-sm text-gray-500 font-medium">{company.name}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mt-2">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveTab('Jobs')}
            className={`flex items-center gap-2 font-bold text-sm transition-colors ${activeTab === 'Jobs' ? 'text-gray-900 border-b-2 border-[#003865] pb-4 -mb-[18px]' : 'text-gray-500'}`}
          >
            Jobs <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">3</span>
          </button>
          <button 
            onClick={() => setActiveTab('Active')}
            className={`flex items-center gap-2 font-bold text-sm transition-colors ${activeTab === 'Active' ? 'text-gray-900 border-b-2 border-[#003865] pb-4 -mb-[18px]' : 'text-gray-500'}`}
          >
            Active <span className="bg-sky-50 text-sky-600 border border-sky-100 px-2 py-0.5 rounded-full text-xs">0</span>
          </button>
          <button 
            onClick={() => setActiveTab('Past')}
            className={`flex items-center gap-2 font-bold text-sm transition-colors ${activeTab === 'Past' ? 'text-gray-900 border-b-2 border-[#003865] pb-4 -mb-[18px]' : 'text-gray-500'}`}
          >
            Past <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">3</span>
          </button>
          <button 
            onClick={() => setActiveTab('Drafts')}
            className={`flex items-center gap-2 font-bold text-sm transition-colors ${activeTab === 'Drafts' ? 'text-gray-900 border-b-2 border-[#003865] pb-4 -mb-[18px]' : 'text-gray-500'}`}
          >
            Drafts <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">0</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-[250px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 bg-white focus:outline-none min-w-[150px]">
            <option>Sort By</option>
            <option>Last Modified</option>
          </select>
          <button className="w-9 h-9 flex items-center justify-center bg-[#003865] text-white rounded-lg hover:bg-[#002848] transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-sm font-semibold border border-orange-100">
          = Sort: Last Modified
          <button className="hover:bg-orange-100 rounded-full p-0.5 transition-colors"><X size={14} /></button>
        </div>
        <button className="flex items-center gap-2 bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-sm font-semibold border border-red-100 hover:bg-red-100 transition-colors">
          <X size={14} /> Clear All
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {rows.length > 0 ? (
          <div className="flex flex-col h-full">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 bg-white">
                    <th className="py-4 px-6 font-medium">Job Title</th>
                    <th className="py-4 px-6 font-medium">Vertical</th>
                    <th className="py-4 px-6 font-medium">Locations</th>
                    <th className="py-4 px-6 font-medium text-center">Applications</th>
                    <th className="py-4 px-6 font-medium text-center">Hired</th>
                    <th className="py-4 px-6 font-medium">Posted On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-semibold text-gray-900">{job.title}</td>
                      <td className="py-4 px-6 text-gray-600">{job.vertical}</td>
                      <td className="py-4 px-6 text-gray-600">{job.locations}</td>
                      <td className="py-4 px-6 text-center font-medium text-gray-900">{job.applications}</td>
                      <td className="py-4 px-6 text-center font-medium text-gray-900">{job.hired}</td>
                      <td className="py-4 px-6 text-gray-600">{job.postedOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-auto border-t border-gray-100 p-4 flex items-center justify-between text-sm text-gray-500">
              <span>Page 1 of 1</span>
              <div className="flex items-center gap-4">
                <button className="text-gray-400 cursor-not-allowed">{'<'}</button>
                <span className="font-medium text-gray-900">1 / 1</span>
                <button className="text-gray-400 cursor-not-allowed">{'>'}</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
              <Search size={24} className="text-[#003865]" />
            </div>
            <h3 className="text-[#003865] font-black text-xl mb-2">No Data Available</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              There's no data to display at the moment. Check back later or contact support if this seems incorrect.
            </p>
            <p className="text-gray-300 text-xs mt-6">No data is currently available</p>
            <div className="flex items-center gap-1.5 mt-8">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
