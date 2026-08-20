import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Filter, Search, X } from 'lucide-react';
import { mockCompanies, mockCompanyJobs } from '../../data/companyData';
import { Card, Badge } from '../../components/ui';

const PAGE_SIZE = 10;

type StatusTab = 'Jobs' | 'Active' | 'Past' | 'Drafts';

export default function CompanyJobsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = mockCompanies.find((c) => c.id === id) || mockCompanies[0];
  const allJobs = mockCompanyJobs.filter((j) => j.companyId === company.id);

  const [statusTab, setStatusTab] = useState<StatusTab>('Jobs');
  const [sourceFilter, setSourceFilter] = useState<'All' | 'Campus' | 'General'>('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'Last Modified' | 'Applications' | 'Hired'>('Last Modified');
  const [page, setPage] = useState(1);

  const counts = {
    Jobs: allJobs.length,
    Active: allJobs.filter((j) => j.status === 'Active').length,
    Past: allJobs.filter((j) => j.status === 'Past').length,
    Drafts: allJobs.filter((j) => j.status === 'Draft').length,
  };

  const filtered = useMemo(() => {
    let rows = allJobs;
    if (statusTab === 'Active') rows = rows.filter((j) => j.status === 'Active');
    if (statusTab === 'Past') rows = rows.filter((j) => j.status === 'Past');
    if (statusTab === 'Drafts') rows = rows.filter((j) => j.status === 'Draft');
    if (sourceFilter !== 'All') rows = rows.filter((j) => j.source === sourceFilter);
    if (search) rows = rows.filter((j) => (j.title + j.vertical + j.locations).toLowerCase().includes(search.toLowerCase()));
    rows = [...rows].sort((a, b) => {
      if (sortBy === 'Applications') return b.applications - a.applications;
      if (sortBy === 'Hired') return b.hired - a.hired;
      return b.postedOn.localeCompare(a.postedOn);
    });
    return rows;
  }, [allJobs, statusTab, sourceFilter, search, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeTab(t: StatusTab) {
    setStatusTab(t);
    setPage(1);
  }

  const hasActiveFilters = sortBy !== 'Last Modified' || sourceFilter !== 'All';

  return (
    <div className="max-w-[1200px] w-full">
      <div className="flex items-center justify-between bg-[#f0f4f8] p-4 rounded-xl border border-gray-200 mb-5">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/companies/${company.id}`)} className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full text-gray-900 shadow-sm transition-all">
            <ArrowLeft size={20} />
          </button>
          <img src={company.logoUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(company.name)}`} className="w-12 h-12 rounded-full bg-white" />
          <div>
            <h1 className="text-xl font-black text-[#003865]">All Jobs</h1>
            <p className="text-sm text-gray-500">{company.name}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-6">
          {(['Jobs', 'Active', 'Past', 'Drafts'] as StatusTab[]).map((t) => (
            <button
              key={t}
              onClick={() => changeTab(t)}
              className={`flex items-center gap-2 pb-1 border-b-2 text-lg font-bold transition-colors ${
                statusTab === t ? 'border-[#f97316] text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t}
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold rounded-full px-2 py-0.5">{counts[t]}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="search..."
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white w-48"
            />
          </div>
          <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value as typeof sourceFilter); setPage(1); }} className="text-sm border border-gray-200 rounded-lg px-2.5 py-2 bg-white">
            <option value="All">All sources</option>
            <option value="Campus">Campus</option>
            <option value="General">General</option>
          </select>
          <div className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
            <span className="text-gray-500">Sorted By</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="font-semibold text-[#f97316] bg-transparent outline-none">
              <option>Last Modified</option>
              <option>Applications</option>
              <option>Hired</option>
            </select>
          </div>
          <button className="w-10 h-10 flex items-center justify-center bg-[#003865] text-white rounded-lg">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 mb-4">
          {sortBy !== 'Last Modified' && (
            <span className="flex items-center gap-1.5 bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              Sort: {sortBy} <button onClick={() => setSortBy('Last Modified')}><X size={12} /></button>
            </span>
          )}
          {sourceFilter !== 'All' && (
            <span className="flex items-center gap-1.5 bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              Source: {sourceFilter} <button onClick={() => setSourceFilter('All')}><X size={12} /></button>
            </span>
          )}
          <button
            onClick={() => { setSortBy('Last Modified'); setSourceFilter('All'); }}
            className="flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-semibold px-3 py-1.5 rounded-full"
          >
            <X size={12} /> Clear All
          </button>
        </div>
      )}

      <Card className="overflow-hidden">
        {pageRows.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No jobs match these filters.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="py-3 px-4 font-medium">Job Title</th>
                <th className="py-3 px-4 font-medium">Vertical</th>
                <th className="py-3 px-4 font-medium">Locations</th>
                <th className="py-3 px-4 font-medium">Source</th>
                <th className="py-3 px-4 font-medium">Applications</th>
                <th className="py-3 px-4 font-medium">Hired</th>
                <th className="py-3 px-4 font-medium">Posted On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageRows.map((j) => (
                <tr key={j.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{j.title}</td>
                  <td className="py-3 px-4 text-gray-600">{j.vertical}</td>
                  <td className="py-3 px-4 text-gray-600">{j.locations}</td>
                  <td className="py-3 px-4"><Badge tone={j.source === 'Campus' ? 'purple' : 'blue'}>{j.source}</Badge></td>
                  <td className="py-3 px-4 text-gray-600">{j.applications}</td>
                  <td className="py-3 px-4 text-gray-600">{j.hired}</td>
                  <td className="py-3 px-4 text-gray-600">{j.postedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Page {page} of {pageCount}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-700">{page} / {pageCount}</span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
