import { useState, useEffect } from 'react';
import {
  GitPullRequest,
  Search,
  ChevronRight,
  ChevronDown,
  Edit2,
  MapPin,
  Briefcase,
  LogOut,
  X
} from 'lucide-react';
import {
  seedJobFamilies,
  seedAllRawJobs,
  getStorage,
  setStorage
} from '../../data/jobMatchingData';
import type { JobFamily, JobVariant } from '../../data/jobMatchingData';

export default function JobFamiliesPage() {
  // Persistence State
  const [families, setFamilies] = useState<JobFamily[]>([]);
  
  // Accordion open states
  const [expandedFamilies, setExpandedFamilies] = useState<Record<string, boolean>>({
    'fam-2': true // default open senior software engineer as in mockup #2
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyMultipleVariants, setOnlyMultipleVariants] = useState(false);

  // Modal State
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [mergeSearch, setMergeSearch] = useState('tata'); // Pre-fill "tata" as in mockup #3
  const [selectedMergeIds, setSelectedMergeIds] = useState<string[]>([]);
  const [targetMergeId, setTargetMergeId] = useState<string | null>(null);

  // Load families
  useEffect(() => {
    const data = getStorage<JobFamily[]>('job_families', seedJobFamilies);
    setFamilies(data);
  }, []);

  const saveFamilies = (updated: JobFamily[]) => {
    setFamilies(updated);
    setStorage('job_families', updated);
  };

  // Toggle accordion expand
  const toggleExpand = (id: string) => {
    setExpandedFamilies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Remove a variant from a family
  const handleRemoveVariant = (familyId: string, variantId: string) => {
    const updated = families.map((fam) => {
      if (fam.id === familyId) {
        const filteredVariants = fam.variants.filter((v) => v.id !== variantId);
        const updatedLocations = Array.from(new Set(filteredVariants.map((v) => v.location)));
        return {
          ...fam,
          variants: filteredVariants,
          locations: updatedLocations,
        };
      }
      return fam;
    }).filter((fam) => fam.variants.length > 0); // remove family if empty

    saveFamilies(updated);
  };

  // Merge modal trigger search list
  const rawJobsList = seedAllRawJobs.filter((job) =>
    job.title.toLowerCase().includes(mergeSearch.toLowerCase()) ||
    job.company.toLowerCase().includes(mergeSearch.toLowerCase()) ||
    job.location.toLowerCase().includes(mergeSearch.toLowerCase())
  );

  // Toggle selection in Merge modal
  const handleToggleMergeSelection = (id: string) => {
    setSelectedMergeIds((prev) => {
      if (prev.includes(id)) {
        const filtered = prev.filter((item) => item !== id);
        if (targetMergeId === id) {
          setTargetMergeId(filtered.length > 0 ? filtered[0] : null);
        }
        return filtered;
      } else {
        const updated = [...prev, id];
        if (!targetMergeId) {
          setTargetMergeId(id);
        }
        return updated;
      }
    });
  };

  // Execute Merge
  const handleMergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMergeIds.length < 2 || !targetMergeId) {
      alert('Please select at least 2 jobs to merge.');
      return;
    }

    const targetJob = seedAllRawJobs.find((j) => j.id === targetMergeId);
    if (!targetJob) return;

    // Create new family
    const mergingJobs = seedAllRawJobs.filter((j) => selectedMergeIds.includes(j.id));
    
    // Convert merging jobs to variants
    const newVariants: JobVariant[] = mergingJobs.map((j, index) => ({
      id: `var-new-${Date.now()}-${index}`,
      title: j.title,
      location: j.location,
      isActive: true,
      isPublic: true,
      deadline: '31/12/2026',
    }));

    const newFamily: JobFamily = {
      id: `fam-new-${Date.now()}`,
      title: targetJob.title.replace(/ - .*/, ''), // clean title
      company: targetJob.company,
      locations: Array.from(new Set(mergingJobs.map((j) => j.location))),
      jobType: 'full_time',
      rawText: `raw: ${targetJob.title}`,
      variants: newVariants,
    };

    const updated = [...families, newFamily];
    saveFamilies(updated);

    // Reset and close
    setSelectedMergeIds([]);
    setTargetMergeId(null);
    setIsMergeModalOpen(false);
  };

  // Filter main families
  const filteredFamilies = families
    .filter((fam) => {
      if (onlyMultipleVariants && fam.variants.length < 2) return false;
      return (
        fam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fam.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header Row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#02759e]">Job Families</h1>
          <p className="text-sm text-gray-500 mt-1">
            Group duplicate postings (same role across cities) into one family card on the public jobs page.
          </p>
        </div>

        <button
          onClick={() => {
            setMergeSearch('tata');
            setSelectedMergeIds([]);
            setTargetMergeId(null);
            setIsMergeModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <GitPullRequest size={15} />
          Merge by search
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#02759e] border-b border-gray-50 pb-2">Filters</h3>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:bg-white focus:border-[#029bcf] transition-all font-medium text-gray-700"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Toggle switch */}
            <button
              onClick={() => setOnlyMultipleVariants((v) => !v)}
              className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                onlyMultipleVariants ? 'bg-[#1e2330]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  onlyMultipleVariants ? 'right-0.5 translate-x-0' : 'left-0.5'
                }`}
              />
            </button>
            <label className="text-xs font-bold text-gray-600 select-none cursor-pointer" onClick={() => setOnlyMultipleVariants((v) => !v)}>
              Only show families with 2+ variants
            </label>
          </div>
        </div>
      </div>

      {/* Families Accordion List Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
        <div className="border-b border-gray-100 pb-3 flex justify-between items-center bg-white shrink-0">
          <h3 className="text-sm font-bold text-[#02759e] uppercase tracking-wider">
            Families ({filteredFamilies.length})
          </h3>
        </div>

        {filteredFamilies.length === 0 ? (
          <p className="text-center py-10 text-xs font-bold text-gray-400 italic">No job families found.</p>
        ) : (
          <div className="space-y-4">
            {filteredFamilies.map((fam) => {
              const isExpanded = expandedFamilies[fam.id] || false;

              return (
                <div
                  key={fam.id}
                  className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 transition-all hover:border-gray-200 bg-white"
                >
                  {/* Card Header Row */}
                  <div
                    onClick={() => toggleExpand(fam.id)}
                    className="flex justify-between items-start gap-4 cursor-pointer select-none group"
                  >
                    <div className="flex items-start gap-2.5">
                      <button className="text-gray-400 mt-0.5 shrink-0">
                        {isExpanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#029bcf] transition-colors">
                            {fam.title}
                          </h4>
                          <span className="bg-sky-50 text-[#02759e] border border-sky-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {fam.variants.length} variants
                          </span>
                        </div>

                        {/* Company Details */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5 font-semibold">
                          <Briefcase size={13} className="text-gray-400" />
                          <span>{fam.company}</span>
                        </div>

                        {/* Locations */}
                        <div className="flex items-start gap-1.5 text-xs text-gray-400 mt-1 font-semibold leading-relaxed">
                          <MapPin size={13} className="text-gray-300 mt-0.5 shrink-0" />
                          <span className="text-gray-500">{fam.locations.join(', ')}</span>
                        </div>

                        {/* Job Type Tag */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className="bg-gray-100 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-gray-200/50">
                            {fam.jobType.replace('_', ' ')}
                          </span>
                          <span className="text-[9px] text-gray-400 font-medium">
                            {fam.rawText}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newTitle = prompt('Rename job family:', fam.title);
                        if (newTitle) {
                          const updated = families.map((f) =>
                            f.id === fam.id ? { ...f, title: newTitle } : f
                          );
                          saveFamilies(updated);
                        }
                      }}
                      className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded"
                      title="Edit family name"
                    >
                      <Edit2 size={13} />
                    </button>
                  </div>

                  {/* Accordion Expanded Child Details */}
                  {isExpanded && (
                    <div className="mt-2 border-t border-gray-50 pt-4 space-y-3 pl-7">
                      {fam.variants.map((v) => (
                        <div
                          key={v.id}
                          className="bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-3.5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded border-gray-200 text-[#029bcf] focus:ring-0 w-3.5 h-3.5 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-gray-900">{v.title}</span>
                                <span className="flex items-center gap-0.5 text-[10px] text-gray-400 font-semibold leading-none">
                                  <MapPin size={10} />
                                  {v.location}
                                </span>
                              </div>

                              {/* Badges details */}
                              <div className="flex items-center gap-1.5 mt-2">
                                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                  v.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {v.isActive ? 'active' : 'inactive'}
                                </span>
                                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                  v.isPublic ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {v.isPublic ? 'public' : 'internal'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium ml-1">
                                  Deadline: {v.deadline}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveVariant(fam.id, v.id)}
                            className="flex items-center gap-1 border border-gray-200 hover:border-red-500 hover:bg-rose-50/50 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 hover:text-red-500 transition-colors shrink-0 cursor-pointer shadow-sm self-end sm:self-auto"
                          >
                            <LogOut size={11} />
                            Remove from family
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Merge Modal Dialog Overlay */}
      {isMergeModalOpen && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-extrabold text-[#02759e]">Merge jobs into one family</h3>
              <button
                onClick={() => setIsMergeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Subtitle & search input */}
            <div className="p-5 border-b border-gray-50 space-y-3.5">
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Search for jobs by title or company. Pick one as the target family — others will be merged into it.
              </p>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={mergeSearch}
                  onChange={(e) => setMergeSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-[#029bcf] transition-all font-medium text-gray-700"
                />
              </div>
            </div>

            {/* Modal Candidates selection list */}
            <form onSubmit={handleMergeSubmit} className="flex flex-col">
              <div className="p-5 max-h-[280px] overflow-y-auto space-y-3 divide-y divide-gray-50">
                {rawJobsList.length === 0 ? (
                  <p className="text-center py-6 text-xs font-bold text-gray-400 italic">No search results found.</p>
                ) : (
                  rawJobsList.map((job) => {
                    const isSelected = selectedMergeIds.includes(job.id);
                    const isTarget = targetMergeId === job.id;

                    return (
                      <div
                        key={job.id}
                        onClick={() => handleToggleMergeSelection(job.id)}
                        className={`flex items-center gap-3.5 py-2.5 px-1 cursor-pointer transition-colors ${
                          isTarget ? 'bg-sky-50/10' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="rounded border-gray-300 text-[#029bcf] focus:ring-0 w-4 h-4 shrink-0"
                        />

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-gray-800">{job.title}</span>
                            {isTarget && (
                              <span className="bg-[#f0f9ff] text-[#029bcf] border border-[#d0effa] text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                Target Family
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                            {job.company} · {job.location}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal footer stats & action buttons */}
              <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-gray-50 shrink-0">
                <span className="text-xs text-gray-500 font-bold">
                  Target:{' '}
                  <strong className="text-gray-800">
                    {targetMergeId
                      ? seedAllRawJobs.find((j) => j.id === targetMergeId)?.title.replace(/ - .*/, '')
                      : 'none'}
                  </strong>{' '}
                  — Merging in:{' '}
                  <strong className="text-gray-800">
                    {selectedMergeIds.length > 0 ? selectedMergeIds.length - 1 : 0}
                  </strong>
                </span>

                <div className="flex gap-2.5 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsMergeModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={selectedMergeIds.length < 2}
                    className="px-4 py-2 bg-[#0a3a60] hover:bg-[#082d4b] text-white font-semibold text-xs rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    Merge
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
