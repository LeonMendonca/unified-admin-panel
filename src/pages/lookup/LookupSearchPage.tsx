import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { apolloMockResults, getSavedCompanies, saveCompanies, type LookupCompany } from '../../data/lookupData';

export default function LookupSearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('test');

  const handleSaveCompany = (result: typeof apolloMockResults[0]) => {
    const existing = getSavedCompanies();
    
    // Check if already exists
    const alreadySaved = existing.find(c => c.domain === result.domain);
    if (alreadySaved) {
      navigate(`/lookup/company/${alreadySaved.id}`);
      return;
    }

    const newCompany: LookupCompany = {
      id: `c-${Date.now()}`,
      name: result.name,
      domain: result.domain,
      industry: '-',
      size: '-',
      savedPeopleCount: 0,
      dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    saveCompanies([newCompany, ...existing]);
    navigate(`/lookup/company/${newCompany.id}`);
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      <div>
        <button 
          onClick={() => navigate('/lookup')}
          className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-black mb-6"
        >
          <ArrowLeft size={16} /> Back to LookUp
        </button>

        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Company Search</h1>
        <p className="text-gray-500 mt-1">Search for companies using Apollo to build your org chart</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Search className="text-gray-900" size={20} />
          <h2 className="text-lg font-bold text-gray-900">Search Companies</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">Enter a company name to find organizations and their details</p>

        <div className="flex items-center gap-3">
          <input 
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-shadow"
            placeholder="e.g. Acme Corp"
          />
          <button className="flex items-center gap-2 bg-gray-900 text-white hover:bg-black px-6 py-3 rounded-full text-sm font-bold transition-colors">
            <Search size={16} /> Search
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-4">
          Found {apolloMockResults.length} companies <span className="text-gray-400">(click a company to save and view details)</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apolloMockResults.map(company => (
            <div 
              key={company.id}
              onClick={() => handleSaveCompany(company)}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg border border-gray-100 flex items-center justify-center bg-white shadow-sm overflow-hidden shrink-0">
                  <img 
                    src={`https://logo.clearbit.com/${company.domain}`} 
                    alt="" 
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-black transition-colors">{company.name}</h3>
                  <div className="flex items-center gap-1.5 text-[#f58220] font-medium text-xs mt-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    {company.domain}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-500">Founded: <span className="text-gray-900">{company.founded}</span></p>
                <div className="flex items-center gap-1.5 text-[#f58220] hover:underline cursor-pointer w-fit">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  LinkedIn <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
