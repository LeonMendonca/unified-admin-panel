import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobs, collegeJobs } from '../../data/jobs';
import { companies } from '../../data/companies';
import { Badge, statusTone, Table, Tabs } from '../../components/ui';

const CANDIDATE_BUCKETS: [string, (n: number) => boolean][] = [
  ['0-10', (n) => n <= 10],
  ['10-30', (n) => n > 10 && n <= 30],
  ['30-60', (n) => n > 30 && n <= 60],
  ['60+', (n) => n > 60],
];

export default function JobsPage() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<'Platform Jobs' | 'College Jobs'>('Platform Jobs');
  const [view, setView] = useState<'All jobs' | 'Student-visible' | 'Campus-targeted'>('All jobs');
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('All Companies');
  const [type, setType] = useState('All Types');
  const [mode, setMode] = useState('All Modes');
  const [status, setStatus] = useState('All Status');
  const [deadline, setDeadline] = useState('All Deadlines');
  const [candidateBucket, setCandidateBucket] = useState('Any Count');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [cStatus, setCStatus] = useState('Status');
  const [cSearch, setCSearch] = useState('');
  const [cSort, setCSort] = useState<'posted' | 'applicants'>('posted');

  const filtered = jobs
    .filter((j) => {
      if (view === 'Student-visible' && (j.status === 'Draft' || j.status === 'Pending review')) return false;
      if (view === 'Campus-targeted' && !j.isCampusJob) return false;
      return true;
    })
    .filter((j) => (j.title + j.companyName).toLowerCase().includes(search.toLowerCase()))
    .filter((j) => company === 'All Companies' || j.companyId === company)
    .filter((j) => type === 'All Types' || j.type === type)
    .filter((j) => mode === 'All Modes' || j.mode === mode)
    .filter((j) => status === 'All Status' || j.status === status)
    .filter((j) => {
      if (deadline === 'Upcoming') return new Date(j.deadline) >= new Date();
      if (deadline === 'Expired') return new Date(j.deadline) < new Date();
      return true;
    })
    .filter((j) => {
      if (candidateBucket === 'Any Count') return true;
      const bucket = CANDIDATE_BUCKETS.find(([label]) => label === candidateBucket);
      return bucket ? bucket[1](j.candidatesCount) : true;
    })
    .filter((j) => !fromDate || j.createdOn >= fromDate)
    .filter((j) => !toDate || j.createdOn <= toDate);

  const collegeFiltered = collegeJobs
    .filter((j) => cStatus === 'Status' || j.status === cStatus)
    .filter((j) => (j.title + j.collegeName + j.batch).toLowerCase().includes(cSearch.toLowerCase()))
    .sort((a, b) => (cSort === 'posted' ? b.postedDate.localeCompare(a.postedDate) : b.applicantCount - a.applicantCount));

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-1">Jobs</h1>
      <p className="text-sm text-gray-500 mb-4">HR-created platform jobs and TPO-created college jobs, in one view.</p>
      <Tabs tabs={['Platform Jobs', 'College Jobs']} active={mainTab} onChange={(t) => setMainTab(t as typeof mainTab)} />

      {mainTab === 'Platform Jobs' && (
        <div className="mt-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or company..."
                className="flex-1 min-w-[220px] text-sm border border-gray-200 rounded-md px-3 py-2 bg-white"
              />
              <select value={view} onChange={(e) => setView(e.target.value as typeof view)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
                <option>All jobs</option>
                <option>Student-visible</option>
                <option>Campus-targeted</option>
              </select>
              <select value={company} onChange={(e) => setCompany(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
                <option>All Companies</option>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select value={type} onChange={(e) => setType(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
                <option>All Types</option>
                <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
              </select>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
                <option>All Modes</option>
                <option>Office</option><option>Hybrid</option><option>Remote</option>
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
                <option>All Status</option>
                <option>Draft</option><option>Internal</option><option>Public</option><option>Pending review</option><option>Archived</option>
              </select>
              <select value={deadline} onChange={(e) => setDeadline(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
                <option>All Deadlines</option>
                <option>Upcoming</option><option>Expired</option>
              </select>
              <select value={candidateBucket} onChange={(e) => setCandidateBucket(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
                <option>Any Count</option>
                {CANDIDATE_BUCKETS.map(([label]) => <option key={label}>{label}</option>)}
              </select>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-gray-200 rounded-md px-2 py-1.5 text-xs" />
                <span>to</span>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-gray-200 rounded-md px-2 py-1.5 text-xs" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-800">Jobs List ({filtered.length} total)</h2>
          </div>
          <Table headers={['Job Details', 'Type', 'Work Mode', 'Candidates', 'Deadline', 'Status', 'Posted', 'Campus', 'Actions']}>
            {filtered.map((j) => (
              <tr key={j.id} className="hover:bg-gray-50">
                <td className="py-2.5 px-3">
                  <p className="font-medium text-gray-800">{j.title}</p>
                  <p className="text-xs text-gray-500">{j.companyName} · {j.location}</p>
                </td>
                <td className="py-2.5 px-3 text-gray-600">{j.type}</td>
                <td className="py-2.5 px-3 text-gray-600">{j.mode}</td>
                <td className="py-2.5 px-3 text-gray-600">{j.candidatesCount}</td>
                <td className="py-2.5 px-3 text-gray-600">{j.deadline}</td>
                <td className="py-2.5 px-3"><Badge tone={statusTone(j.status)}>{j.status}</Badge></td>
                <td className="py-2.5 px-3 text-gray-600">{j.createdOn}</td>
                <td className="py-2.5 px-3">{j.isCampusJob ? <Badge tone="purple">Campus</Badge> : <Badge>—</Badge>}</td>
                <td className="py-2.5 px-3">
                  <button onClick={() => navigate(`/jobs/${j.id}`)} className="text-purple-600 text-xs font-medium">View Details</button>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      {mainTab === 'College Jobs' && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <select value={cStatus} onChange={(e) => setCStatus(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white">
              <option>Status</option>
              <option>Active</option><option>Past</option>
            </select>
            <input value={cSearch} onChange={(e) => setCSearch(e.target.value)} placeholder="Search by title, college, or batch" className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white w-64" />
            <select value={cSort} onChange={(e) => setCSort(e.target.value as typeof cSort)} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white">
              <option value="posted">Sort: Posted date</option>
              <option value="applicants">Sort: Applicant count</option>
            </select>
            <span className="text-xs text-gray-400 ml-auto">{collegeFiltered.length} jobs</span>
          </div>
          <p className="text-xs text-gray-400 mb-2">Posted by TPOs for their own college — no relation to Hiring or Talent.</p>
          <Table headers={['Title', 'College', 'Batch', 'Posted date', 'Status', 'Applicants', '']}>
            {collegeFiltered.map((j) => (
              <tr key={j.id} className="hover:bg-gray-50">
                <td className="py-2.5 px-3 font-medium text-gray-800">{j.title}</td>
                <td className="py-2.5 px-3 text-gray-600">{j.collegeName}</td>
                <td className="py-2.5 px-3 text-gray-600">{j.batch}</td>
                <td className="py-2.5 px-3 text-gray-600">{j.postedDate}</td>
                <td className="py-2.5 px-3"><Badge tone={statusTone(j.status)}>{j.status}</Badge></td>
                <td className="py-2.5 px-3 text-gray-600">{j.applicantCount}</td>
                <td className="py-2.5 px-3">
                  <button onClick={() => navigate(`/jobs/college/${j.id}`)} className="text-purple-600 text-xs font-medium">View Details</button>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}
    </div>
  );
}
