import { useState, useEffect } from 'react';
import { Search, Eye, Download, X, CheckCircle, Ban, Mail, Phone, Calendar } from 'lucide-react';
import {
  seedCandidates,
  seedApplications,
  getStorage,
  setStorage,
  GLOBAL_HIRING_STEPS
} from '../../data/candidatesData';
import type {
  GlobalCandidate,
  CandidateJobApplication,
  CandidateSource,
  CandidateStatus
} from '../../data/candidatesData';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<GlobalCandidate[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<CandidateSource | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'All'>('All');

  // Modals state
  const [viewedCandidate, setViewedCandidate] = useState<GlobalCandidate | null>(null);
  const [journeyApplication, setJourneyApplication] = useState<CandidateJobApplication | null>(null);

  useEffect(() => {
    const data = getStorage<GlobalCandidate[]>('list', seedCandidates);
    setCandidates(data);
  }, []);

  const saveCandidates = (updated: GlobalCandidate[]) => {
    setCandidates(updated);
    setStorage('list', updated);
  };

  const handleToggleStatus = (id: string) => {
    const updated = candidates.map(c => 
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Suspended' : 'Active' } as GlobalCandidate : c
    );
    saveCandidates(updated);
  };

  const filtered = candidates.filter(c => {
    if (sourceFilter !== 'All' && c.source !== sourceFilter) return false;
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <UserIcon className="text-gray-800" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Manage all candidates and view their job application progress</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-gray-800">Candidates ({filtered.length})</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors w-64"
              />
            </div>
            
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none"
            >
              <option value="All">All Sources</option>
              <option value="Manual">Manual</option>
              <option value="Resume Upload">Resume Upload</option>
              <option value="ZigMe">ZigMe</option>
              <option value="Campus">Campus</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 bg-white">
                <th className="py-3 px-5 font-medium whitespace-nowrap">Name ↑↓</th>
                <th className="py-3 px-5 font-medium">Contact</th>
                <th className="py-3 px-5 font-medium">Source</th>
                <th className="py-3 px-5 font-medium">Applications</th>
                <th className="py-3 px-5 font-medium text-center">Status</th>
                <th className="py-3 px-5 font-medium">Created At</th>
                <th className="py-3 px-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-5 font-semibold text-gray-800">{c.name}</td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Mail size={12} /> {c.email}
                    </div>
                    {c.phone && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                        <Phone size={12} /> {c.phone}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    {c.source === 'Resume Upload' && <span className="bg-black text-white px-2.5 py-1 rounded-full text-xs font-bold">Upload</span>}
                    {c.source === 'ZigMe' && <span className="bg-white border border-gray-200 text-gray-800 px-2.5 py-1 rounded-full text-xs font-bold">ZigMe</span>}
                    {c.source === 'Campus' && <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-bold">Campus</span>}
                    {c.source === 'Manual' && <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">Manual</span>}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-800">{c.applicationsCount} application{c.applicationsCount !== 1 ? 's' : ''}</span>
                      <button 
                        onClick={() => setViewedCandidate(c)}
                        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                      >
                        <Eye size={12} /> View Jobs
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-center">
                    {c.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold">
                        <Ban size={12} /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-gray-500 text-sm whitespace-nowrap">
                    {c.createdAt}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button 
                      onClick={() => handleToggleStatus(c.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        c.status === 'Active' 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      <Ban size={12} /> {c.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">No candidates found matching the filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewedCandidate && (
        <JobApplicationsModal 
          candidate={viewedCandidate} 
          onClose={() => setViewedCandidate(null)} 
          onViewJourney={(app) => setJourneyApplication(app)}
        />
      )}

      {journeyApplication && viewedCandidate && (
        <CandidateJourneyModal
          candidate={viewedCandidate}
          application={journeyApplication}
          onClose={() => setJourneyApplication(null)}
        />
      )}
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

function JobApplicationsModal({ candidate, onClose, onViewJourney }: { candidate: GlobalCandidate, onClose: () => void, onViewJourney: (app: CandidateJobApplication) => void }) {
  const [apps, setApps] = useState<CandidateJobApplication[]>([]);
  
  useEffect(() => {
    // Check if we have mock applications for this candidate
    const data = getStorage<Record<string, CandidateJobApplication[]>>('apps', seedApplications);
    if (data[candidate.id]) {
      setApps(data[candidate.id]);
    } else {
      // Mock generate one if none exists for demo purposes
      setApps([{
        id: `mock-${Date.now()}`,
        candidateId: candidate.id,
        jobTitle: 'Frontend Developer',
        department: 'Engineering',
        company: 'ZigMe Mock Corp',
        jdMatchScore: 78,
        flowStatus: 'Not started',
        appliedDate: '19/8/2026',
        stepsTotal: 4,
        stepsCompleted: 1,
        currentStep: 'Speed Interview',
      }]);
    }
  }, [candidate.id]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-900">Job Applications for {candidate.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="border border-gray-200 rounded-xl p-4 flex gap-4 text-sm font-medium text-gray-600 bg-gray-50/50 mb-6">
            <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400"/> {candidate.email}</span>
            <span className="flex items-center gap-1.5"><Phone size={14} className="text-gray-400"/> {candidate.phone || 'N/A'}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="pb-3 px-2 font-medium">Job Details</th>
                  <th className="pb-3 px-2 font-medium">Resume</th>
                  <th className="pb-3 px-2 font-medium text-center">JD Match</th>
                  <th className="pb-3 px-2 font-medium">Flow Status</th>
                  <th className="pb-3 px-2 font-medium">Progress</th>
                  <th className="pb-3 px-2 font-medium">Applied Date</th>
                  <th className="pb-3 px-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {apps.map(app => (
                  <tr key={app.id}>
                    <td className="py-4 px-2">
                      <p className="font-bold text-gray-900">{app.jobTitle}</p>
                      <p className="text-xs text-gray-500">{app.department}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{app.company}</p>
                    </td>
                    <td className="py-4 px-2">
                      <button className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50">
                        <Download size={12} /> Resume
                      </button>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="bg-gray-900 text-white font-bold px-3 py-1 rounded-full text-xs">
                        {app.jdMatchScore}%
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <span className="border border-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                        {app.flowStatus}
                      </span>
                    </td>
                    <td className="py-4 px-2"></td>
                    <td className="py-4 px-2 text-gray-500 text-xs">
                      <div className="flex items-center gap-1.5"><Calendar size={12} /> {app.appliedDate}</div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button 
                        onClick={() => onViewJourney(app)}
                        className="inline-flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-800 px-4 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm"
                      >
                        <Eye size={12} /> View Journey
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateJourneyModal({ candidate, application, onClose }: { candidate: GlobalCandidate, application: CandidateJobApplication, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-[60] animate-fade-in" onClick={onClose}>
      <div className="bg-[#fcfaf7] border border-orange-100 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-orange-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Candidate Journey - {candidate.name}</h2>
          </div>
          <button onClick={onClose} className="text-orange-400 hover:text-orange-600 transition-colors border border-orange-200 rounded-full p-1 bg-white">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-8">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {GLOBAL_HIRING_STEPS.map((step, i) => {
              const isPast = i < application.stepsCompleted;
              const isCurrent = i === application.stepsCompleted;
              
              return (
                <div key={step} className="relative flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 bg-[#fcfaf7] flex items-center justify-center z-10 shrink-0 ${
                    isPast || isCurrent ? 'border-orange-500' : 'border-gray-400'
                  }`}>
                    {isPast || isCurrent ? <div className="w-2.5 h-2.5 rounded-full bg-orange-500" /> : <div className="w-2.5 h-2.5 rounded-full bg-transparent" />}
                  </div>
                  
                  <div className="pt-1 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-bold text-gray-900 text-base">{i + 1}. {step}</h4>
                      <span className="bg-white border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-semibold">{step}</span>
                      {isCurrent && <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">Current</span>}
                    </div>
                    
                    <div className="mt-2 border-l border-gray-200 ml-1 pl-4 pb-4">
                      {step === 'JD Match' && (
                        <p className="text-sm font-medium text-gray-500">
                          JD Match Score: <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">{application.jdMatchScore}%</span>
                        </p>
                      )}
                      {step !== 'JD Match' && (
                        <p className="text-sm text-gray-400 font-medium">Step not reached yet</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
