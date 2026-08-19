import { useState, useEffect } from 'react';
import {
  Play,
  History,
  Mail,
  Activity,
  Search,
  RefreshCw,
  Database,
  User,
  Briefcase,
  FileText,
  CheckCircle,
  Download,
  Upload
} from 'lucide-react';
import {
  seedActiveJobs,
  seedPastRuns,
  seedOutreach,
  getStorage,
  setStorage
} from '../../data/jobMatchingData';
import type { ActiveJob, PastRun, OutreachHistory } from '../../data/jobMatchingData';

export default function JobMatchingPage() {
  const [activeTab, setActiveTab] = useState<'new_match' | 'past_runs' | 'outreach' | 'embeddings_health'>('new_match');

  // Persistence State
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [pastRuns, setPastRuns] = useState<PastRun[]>([]);
  const [outreachList, setOutreachList] = useState<OutreachHistory[]>([]);

  // Selection state
  const [selectedJob, setSelectedJob] = useState<ActiveJob | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Embeddings health state details
  const [embedProgress, setEmbedProgress] = useState({
    studentStale: 70,
    jobStale: 7,
    parsed: 5992,
    remaining: 230
  });

  // Action states
  const [isReembedding, setIsReembedding] = useState(false);
  const [isRefreshingOutreach, setIsRefreshingOutreach] = useState(false);
  const [outreachFilter, setOutreachFilter] = useState<'all' | 'sent' | 'failed' | 'skipped'>('all');
  const [showUnnamedRuns, setShowUnnamedRuns] = useState(false);

  // Load datasets on mount
  useEffect(() => {
    const jobs = getStorage<ActiveJob[]>('active_jobs', seedActiveJobs);
    const runs = getStorage<PastRun[]>('past_runs', seedPastRuns);
    const outreach = getStorage<OutreachHistory[]>('outreach', seedOutreach);
    
    setActiveJobs(jobs);
    setPastRuns(runs);
    setOutreachList(outreach);
    
    if (jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, []);

  // Simulator for Re-embed Job
  const handleReembedJob = () => {
    if (!selectedJob) return;
    setIsReembedding(true);

    setTimeout(() => {
      const now = new Date();
      const formatTime = (d: Date) => {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      const updatedJobs = activeJobs.map((j) => {
        if (j.id === selectedJob.id) {
          const updated = {
            ...j,
            lastEmbed: formatTime(now),
            vectorStatus: 'Present' as const,
          };
          setSelectedJob(updated);
          return updated;
        }
        return j;
      });

      setActiveJobs(updatedJobs);
      setStorage('active_jobs', updatedJobs);
      setIsReembedding(false);
    }, 1000);
  };

  // outreach filter
  const filteredOutreach = outreachList.filter((o) => {
    if (outreachFilter === 'all') return true;
    if (outreachFilter === 'sent') return o.status === 'sent';
    if (outreachFilter === 'failed') return o.status === 'failed';
    if (outreachFilter === 'skipped') return o.status.startsWith('skipped');
    return true;
  });

  // active jobs search filter
  const filteredActiveJobs = activeJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-2xl font-bold text-[#02759e]">Job Matching</h1>
        <p className="text-sm text-gray-500 mt-1">Vector + hybrid matching of candidates to a job. Admin-only.</p>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex gap-1.5 border-b border-gray-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('new_match')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'new_match'
              ? 'bg-[#0a3a60] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Play size={13} className={activeTab === 'new_match' ? 'fill-white' : ''} />
          New Match
        </button>

        <button
          onClick={() => setActiveTab('past_runs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'past_runs'
              ? 'bg-[#0a3a60] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <History size={13} />
          Past Runs
        </button>

        <button
          onClick={() => setActiveTab('outreach')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'outreach'
              ? 'bg-[#0a3a60] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Mail size={13} />
          Outreach
        </button>

        <button
          onClick={() => setActiveTab('embeddings_health')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'embeddings_health'
              ? 'bg-[#0a3a60] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Activity size={13} />
          Embeddings Health
        </button>
      </div>

      {/* Render Tab Contents */}
      {activeTab === 'new_match' && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-6">
          {/* Step Navigation Bar */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div className="flex items-center gap-4 text-xs font-bold select-none">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-full">
                <span className="bg-white/20 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px]">1</span>
                Pick job
              </span>
              <span className="text-gray-300">➔</span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-400 border border-gray-200 rounded-full">
                <span className="bg-gray-200 text-gray-500 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">2</span>
                Filters & weights
              </span>
              <span className="text-gray-300">➔</span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-400 border border-gray-200 rounded-full">
                <span className="bg-gray-200 text-gray-500 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">3</span>
                Matches & save
              </span>
            </div>
            <button
              onClick={() => {
                if (activeJobs.length > 0) setSelectedJob(activeJobs[0]);
                setSearchQuery('');
              }}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Start over
            </button>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-gray-800">1. Pick a job</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Only active, non-archived jobs are shown. Search by title, role, or company.</p>
          </div>

          {/* Search bar input */}
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search active jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:bg-white focus:border-[#029bcf] transition-all font-medium text-gray-700"
            />
          </div>

          {/* Selection Columns Panel */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Col: Jobs lists scroll (span 7) */}
            <div className="md:col-span-7 border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 max-h-[420px] overflow-y-auto pr-1">
              {filteredActiveJobs.length === 0 ? (
                <p className="p-8 text-center text-xs font-bold text-gray-400 italic">No matching active jobs found.</p>
              ) : (
                filteredActiveJobs.map((job) => {
                  const isSelected = selectedJob?.id === job.id;
                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-50/20 border-l-4 border-l-[#029bcf]' : 'hover:bg-gray-50/50'
                      }`}
                    >
                      <h4 className="text-sm font-bold text-gray-800">{job.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 font-medium">{job.company} · {job.location}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Col: Selected Job Details Card (span 5) */}
            <div className="md:col-span-5 bg-gray-50/50 border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
              {selectedJob ? (
                <>
                  <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-800">{selectedJob.title}</h3>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">{selectedJob.company}</p>
                    </div>

                    <button
                      onClick={handleReembedJob}
                      disabled={isReembedding}
                      className="flex items-center gap-1 bg-white border border-gray-200 hover:border-gray-300 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-gray-600 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw size={11} className={isReembedding ? 'animate-spin text-[#029bcf]' : ''} />
                      Re-embed
                    </button>
                  </div>

                  {/* Metadata fields grids */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Vector</span>
                      <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold mt-1 uppercase">
                        {selectedJob.vectorStatus === 'Present' ? 'Present' : 'Missing'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Last Embed</span>
                      <span className="font-bold text-gray-700 block mt-1">{selectedJob.lastEmbed}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Exp Band</span>
                      <span className="font-bold text-gray-700 block mt-1">{selectedJob.expBand}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Min Degree Rank</span>
                      <span className="font-bold text-gray-700 block mt-1">{selectedJob.minDegreeRank}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Location</span>
                      <span className="font-bold text-gray-700 block mt-1">{selectedJob.location}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Skills</span>
                      <span className="font-bold text-gray-700 block mt-1">{selectedJob.skillsCount}</span>
                    </div>
                  </div>

                  {/* Step 2 action button mockup */}
                  <button className="w-full bg-[#0a3a60] hover:bg-[#082d4b] text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer mt-2 flex items-center justify-center gap-1.5">
                    Proceed to Filters & Weights
                  </button>
                </>
              ) : (
                <p className="text-center py-10 text-xs font-bold text-gray-400 italic">Please select a job first.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'past_runs' && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-gray-800">Past match runs</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Saved (named) runs only. Toggle to see unnamed runs.</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="unnamedToggle"
                checked={showUnnamedRuns}
                onChange={(e) => setShowUnnamedRuns(e.target.checked)}
                className="rounded border-gray-200 text-[#029bcf] focus:ring-0 w-3.5 h-3.5"
              />
              <label htmlFor="unnamedToggle" className="text-xs font-bold text-gray-600 select-none cursor-pointer">
                Show unnamed runs
              </label>
            </div>
          </div>

          {/* Past runs Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Started</th>
                  <th className="py-2.5 px-3">Job ID</th>
                  <th className="py-2.5 px-3">Top N</th>
                  <th className="py-2.5 px-3">Found</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {pastRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3 font-bold text-gray-900">{run.name}</td>
                    <td className="py-3 px-3 text-gray-500">{run.started}</td>
                    <td className="py-3 px-3 text-gray-500">{run.jobId}</td>
                    <td className="py-3 px-3 font-semibold">{run.topN}</td>
                    <td className="py-3 px-3 font-semibold">{run.found}</td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase">
                        {run.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="text-sky-700 hover:text-sky-900 font-bold">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'outreach' && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-gray-800">Candidate outreach history</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Last 200 sends across all jobs.</p>
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <select
                value={outreachFilter}
                onChange={(e) => setOutreachFilter(e.target.value as any)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
              >
                <option value="all">All statuses</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
                <option value="skipped">Skipped</option>
              </select>

              <button
                onClick={() => {
                  setIsRefreshingOutreach(true);
                  setTimeout(() => setIsRefreshingOutreach(false), 500);
                }}
                className="p-2 border border-gray-200 hover:border-gray-300 text-gray-500 rounded-lg bg-white cursor-pointer shadow-sm"
              >
                <RefreshCw size={13} className={isRefreshingOutreach ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Outreach History Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  <th className="py-2.5 px-3">When</th>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">Job</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Note / Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {filteredOutreach.map((item) => {
                  let statusBadge = 'bg-slate-100 text-slate-800';
                  if (item.status === 'sent') statusBadge = 'bg-emerald-50 text-emerald-800 border border-emerald-100';
                  else if (item.status === 'failed') statusBadge = 'bg-rose-50 text-rose-800 border border-rose-100';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="py-3.5 px-3 text-gray-500 whitespace-nowrap">{item.when}</td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-gray-900">{item.candidateName}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{item.candidateEmail}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-gray-800">{item.jobTitle}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{item.companyName}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${statusBadge}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-gray-500 font-medium max-w-sm leading-relaxed">{item.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'embeddings_health' && (
        <div className="flex flex-col gap-6">
          {/* Top side: Students vs Jobs side card grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Students Embeddings Health Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#02759e] font-bold border-b border-gray-100 pb-2">
                <User size={16} />
                <h3 className="text-sm">Students</h3>
              </div>

              {/* Counts Stats Row */}
              <div className="grid grid-cols-3 gap-3 text-center py-2 bg-gray-50/30 rounded-xl border border-gray-100/50">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</span>
                  <p className="text-lg font-black text-gray-900 mt-1">32,143</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Embedded</span>
                  <p className="text-lg font-black text-gray-900 mt-1">32,073</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stale</span>
                  <p className="text-lg font-black text-red-500 mt-1">{embedProgress.studentStale}</p>
                </div>
              </div>

              {/* Vector Quality box */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/10 space-y-3.5">
                <span className="text-[9px] font-extrabold text-[#02759e] uppercase tracking-wider block">
                  Vector Quality (Of Embedded)
                </span>

                <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-xs">
                  <div>
                    <span className="text-[10px] font-medium text-gray-400 block">Usable</span>
                    <strong className="text-emerald-600 block mt-0.5">6,527</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-gray-400 block">Blank Text</span>
                    <strong className="text-gray-700 block mt-0.5">0</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-gray-400 block">With Skills</span>
                    <strong className="text-gray-700 block mt-0.5">6,527</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-gray-400 block">With Experience</span>
                    <strong className="text-gray-700 block mt-0.5">1,090</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-gray-400 block">With Degree</span>
                    <strong className="text-gray-700 block mt-0.5">2,257</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-gray-400 block">With Location</span>
                    <strong className="text-gray-700 block mt-0.5">6,527</strong>
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 font-medium leading-relaxed border-t border-gray-100 pt-2">
                  Only <strong>Usable</strong> vectors are returned by the matcher. Blank/weak vectors are excluded automatically and will be rebuilt by Backfill ALL.
                </p>
              </div>

              <div className="flex justify-between items-center text-xs mt-1 border-t border-gray-50 pt-3">
                <span className="text-gray-400 font-medium">Last Embed: <strong>19/08/2026 12:48</strong></span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEmbedProgress(prev => ({ ...prev, studentStale: 0 }))}
                    className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer"
                  >
                    Embed next 100
                  </button>
                  <button
                    onClick={() => setEmbedProgress(prev => ({ ...prev, studentStale: 0 }))}
                    className="bg-[#0a3a60] hover:bg-[#082d4b] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer"
                  >
                    Backfill ALL
                  </button>
                </div>
              </div>
            </div>

            {/* Jobs Embeddings Health Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#02759e] font-bold border-b border-gray-100 pb-2">
                  <Briefcase size={16} />
                  <h3 className="text-sm">Jobs</h3>
                </div>

                {/* Counts Stats Row */}
                <div className="grid grid-cols-3 gap-3 text-center py-2 bg-gray-50/30 rounded-xl border border-gray-100/50">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</span>
                    <p className="text-lg font-black text-gray-900 mt-1">591</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Embedded</span>
                    <p className="text-lg font-black text-gray-900 mt-1">584</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stale</span>
                    <p className="text-lg font-black text-red-500 mt-1">{embedProgress.jobStale}</p>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Last Embed</span>
                  <span className="font-bold text-gray-700 block mt-1.5">19/08/2026 03:30</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-end">
                <button
                  onClick={() => setEmbedProgress(prev => ({ ...prev, jobStale: 0 }))}
                  className="bg-[#0a3a60] hover:bg-[#082d4b] text-white text-[10px] font-bold px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
                >
                  Embed next 50 stale
                </button>
              </div>
            </div>
          </div>

          {/* Middle: Resume parsing (Gemini) */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#02759e] font-bold border-b border-gray-100 pb-2">
              <FileText size={16} />
              <h3 className="text-sm">Resume parsing (Gemini)</h3>
            </div>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed -mt-1">
              Every file uploaded via job applications or the document locker is parsed into a structured resume, then re-embedded automatically.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center py-2">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Files</span>
                <p className="text-lg font-black text-gray-900 mt-1">6,457</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Parsed</span>
                <p className="text-lg font-black text-gray-900 mt-1">{embedProgress.parsed}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending/Retry</span>
                <p className="text-lg font-black text-amber-500 mt-1">419</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Remaining</span>
                <p className="text-lg font-black text-red-500 mt-1">{embedProgress.remaining}</p>
              </div>
            </div>

            {/* Custom progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-[#f58220] h-2 rounded-full transition-all"
                style={{ width: `${(embedProgress.parsed / 6457) * 100}%` }}
              />
            </div>

            {/* Buttons & Subtext details */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-t border-gray-100 pt-4 mt-1">
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-lg">
                Edge runtime kills each background batch after ~2 min, so a single <strong>"Parse next batch"</strong> click only finishes ~10-20 files. Use <strong>Backfill ALL</strong> to loop until the queue is empty. New uploads auto-parse via DB trigger. Failed files retry up to 3 times.
              </p>

              <div className="flex gap-2.5 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => setEmbedProgress(prev => ({
                    ...prev,
                    parsed: Math.min(6457, prev.parsed + 20),
                    remaining: Math.max(0, prev.remaining - 20)
                  }))}
                  className="bg-[#f58220] hover:bg-[#d87016] text-white text-[11px] font-bold px-3.5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Parse next batch (~25 files)
                </button>
                <button
                  onClick={() => setEmbedProgress(prev => ({ ...prev, parsed: 6457, remaining: 0 }))}
                  className="bg-[#0a3a60] hover:bg-[#082d4b] text-white text-[11px] font-bold px-3.5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Backfill ALL (recommended)
                </button>
              </div>
            </div>
          </div>

          {/* Bottom: Local Parse Round-Trip */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#02759e] font-bold border-b border-gray-100 pb-2">
              <Database size={16} />
              <h3 className="text-sm">Local Parse Round-Trip</h3>
            </div>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed -mt-1">
              Export all unparsed resumes as a bundle, parse them locally with your own AI, then re-upload the structured data.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Step 1: Download */}
              <div className="border border-gray-100 bg-gray-50/20 rounded-xl p-4 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-gray-700">1. Download bundle</h4>
                <div className="flex gap-2.5">
                  <button className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 text-[10px] font-bold px-3.5 py-2 rounded-lg shadow-sm cursor-pointer transition-colors">
                    Check count
                  </button>
                  <button className="flex items-center gap-1.5 bg-[#0a3a60] hover:bg-[#082d4b] text-white text-[10px] font-bold px-3.5 py-2 rounded-lg shadow-sm cursor-pointer transition-colors">
                    <Download size={12} />
                    Download manifest + download.sh
                  </button>
                </div>
                <p className="text-[9px] text-gray-400 font-medium leading-relaxed mt-1">
                  Bundle contains <code>manifest.csv</code>, <code>download.sh</code> (run <code>bash download.sh</code> locally to pull every resume into <code>./resumes/</code>), and a <code>README.txt</code> with the JSON schema for each column.
                </p>
              </div>

              {/* Step 2: Upload */}
              <div className="border border-gray-100 bg-gray-50/20 rounded-xl p-4 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-gray-700">2. Upload parsed data</h4>
                <div className="flex gap-2.5">
                  <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 text-[10px] font-bold px-3.5 py-2 rounded-lg shadow-sm cursor-pointer transition-colors">
                    <Upload size={12} />
                    Upload filled CSV
                  </button>
                  <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 text-[10px] font-bold px-3.5 py-2 rounded-lg shadow-sm cursor-pointer transition-colors">
                    <Upload size={12} />
                    Upload parsed JSON
                  </button>
                </div>
                <p className="text-[9px] text-gray-400 font-medium leading-relaxed mt-1">
                  Posts rows in batches of 50. Embeddings refresh in the background per student.
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-50 pt-3 text-[10px] text-gray-400 font-semibold flex items-center gap-1">
              <CheckCircle size={11} className="text-emerald-500" />
              Re-runs are safe — already-parsed files and up-to-date embeddings are skipped.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
