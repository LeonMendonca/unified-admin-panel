import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Eye } from 'lucide-react';
import type { LookupCompany } from '../../data/lookupData';
import { getSavedCompanies } from '../../data/lookupData';

export default function LookupPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<LookupCompany[]>([]);

  useEffect(() => {
    setCompanies(getSavedCompanies());
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">LookUp</h1>
          <p className="text-sm text-gray-500 mt-1">Org chart builder and company data finder tool</p>
        </div>
        
        <button 
          onClick={() => navigate('/lookup/search')}
          className="flex items-center gap-2 bg-gray-900 text-white hover:bg-black px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm"
        >
          <Plus size={16} /> Start New Lookup
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
          <Building2 className="text-gray-400" size={20} />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Saved Companies</h2>
            <p className="text-xs text-gray-500 mt-0.5">View and manage your saved company lookups</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-medium">
                <th className="py-4 px-6">Company</th>
                <th className="py-4 px-6">Domain</th>
                <th className="py-4 px-6 text-center">Industry</th>
                <th className="py-4 px-6 text-center">Size</th>
                <th className="py-4 px-6 text-center">Saved People</th>
                <th className="py-4 px-6">Date Added</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {companies.map(company => (
                <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center bg-white shadow-sm overflow-hidden shrink-0">
                        <img 
                          src={`https://logo.clearbit.com/${company.domain !== '-' ? company.domain : 'example.com'}`} 
                          alt="" 
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>';
                          }}
                        />
                      </div>
                      <span className="font-semibold text-gray-800">{company.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {company.domain !== '-' ? (
                      <a href={`https://${company.domain}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#f58220] hover:underline font-medium text-xs">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        {company.domain}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center text-gray-400">{company.industry}</td>
                  <td className="py-4 px-6 text-center text-gray-400">{company.size}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-bold text-gray-900">{company.savedPeopleCount}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-medium">{company.dateAdded}</td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => navigate(`/lookup/company/${company.id}`)}
                      className="text-gray-400 hover:text-gray-900 transition-colors p-1.5 rounded hover:bg-gray-100 inline-flex"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {companies.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 font-medium">
                    No companies saved yet. Click "Start New Lookup" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
