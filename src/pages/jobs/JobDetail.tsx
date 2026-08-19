import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../../data/jobs';
import type { JobCandidate } from '../../data/types';
import { Badge, statusTone, Card, SectionTitle, Table, Tabs, Button, EmptyState } from '../../components/ui';

const HIRING_STEPS = ['JD Match', 'Shortlisting', 'Speed Interview', 'Interview', 'Job Offer'];

export default function JobDetail() {
  const { id } = useParams();
  const job = getJobById(id || '');
  const tabs = job?.isCampusJob
    ? ['Overview', 'Hiring Flow', 'Flow Management', 'Assessments', 'Candidates', 'Campus']
    : ['Overview', 'Hiring Flow', 'Flow Management', 'Assessments', 'Candidates'];
  const [tab, setTab] = useState(tabs[0]);
  const [flowStepFilter, setFlowStepFilter] = useState('All Candidates');
  const [journeyCandidate, setJourneyCandidate] = useState<JobCandidate | null>(null);

  if (!job) return <EmptyState label="Job not found" />;

  const flowFiltered = flowStepFilter === 'All Candidates'
    ? job.candidates
    : job.candidates.filter((c) => c.currentStep === flowStepFilter);

  return (
    <div>
      <Link to="/jobs" className="text-xs text-gray-500 hover:text-gray-700">← Back to Jobs</Link>
      <div className="flex items-center justify-between mt-3 mb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-semibold text-gray-900">{job.title}</h1>
            <Badge tone={statusTone(job.status)}>{job.status}</Badge>
            <Badge>{job.type}</Badge>
            <Badge>{job.mode}</Badge>
            {job.isCampusJob && <Badge tone="purple">Campus</Badge>}
          </div>
          <p className="text-sm text-gray-500">{job.companyName} · {job.location}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Run Job Matching</Button>
          <Button variant="secondary">Send Warning</Button>
          <Button variant={job.status === 'Archived' ? 'secondary' : 'danger'}>{job.status === 'Archived' ? 'Restore' : 'Archive'}</Button>
        </div>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="mt-5">
        {tab === 'Overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
              <StatTile label="Openings" value={job.openings} />
              <StatTile label="Experience" value={job.experienceRequired} />
              <StatTile label="Deadline" value={job.deadline} />
              <StatTile label="Total Candidates" value={job.candidatesCount} />
              <StatTile label="Interview Slots" value={job.interviewSlots} />
              <StatTile label="Booked Slots" value={job.bookedSlots} />
            </div>

            <Card className="p-4">
              <SectionTitle action={<button className="text-xs text-purple-600">Edit</button>}>Basic Information</SectionTitle>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-gray-500">Job Title</dt><dd className="font-medium text-gray-800">{job.title}</dd></div>
                <div><dt className="text-gray-500">Role</dt><dd className="font-medium text-gray-800">{job.role}</dd></div>
                <div><dt className="text-gray-500">Job Type</dt><dd className="font-medium text-gray-800">{job.type}</dd></div>
                <div><dt className="text-gray-500">Status</dt><dd><Badge tone={statusTone(job.status)}>{job.status}</Badge></dd></div>
                <div><dt className="text-gray-500">Created</dt><dd className="font-medium text-gray-800">{job.createdOn}</dd></div>
                <div><dt className="text-gray-500">Last Updated</dt><dd className="font-medium text-gray-800">{job.lastUpdated}</dd></div>
              </dl>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <SectionTitle action={<button className="text-xs text-purple-600">Edit JD</button>}>Job Description & Skills</SectionTitle>
                <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.keySkills.map((s) => <Badge key={s}>{s}</Badge>)}
                </div>
              </Card>
              <Card className="p-4">
                <SectionTitle action={<button className="text-xs text-purple-600">Edit</button>}>Compensation & Work Details</SectionTitle>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-gray-500">Salary</dt><dd className="font-medium text-gray-800">{job.salaryRange}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Location</dt><dd className="font-medium text-gray-800">{job.location}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Work Mode</dt><dd className="font-medium text-gray-800">{job.mode}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">Min Qualification</dt><dd className="font-medium text-gray-800">{job.minQualification}</dd></div>
                </dl>
              </Card>
            </div>

            {job.warnings.length > 0 && (
              <Card className="p-4">
                <SectionTitle>⚠ Warning History ({job.warnings.length})</SectionTitle>
                <div className="space-y-2">
                  {job.warnings.map((w) => (
                    <div key={w.id} className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-sm text-amber-800 flex justify-between gap-4">
                      <span>{w.message}</span>
                      <span className="text-xs text-amber-600 whitespace-nowrap">{w.date}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {tab === 'Hiring Flow' && (
          <div className="space-y-4">
            <Card className="p-4">
              <SectionTitle>Hiring Flow Steps</SectionTitle>
              <div className="space-y-2">
                {job.hiringFlowSteps.map((step, i) => (
                  <div key={step.name} className="flex items-center justify-between border border-gray-100 rounded-md px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold flex items-center justify-center">{i}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 text-sm">{step.name}</span>
                          <Badge>{step.tag}</Badge>
                          <Badge tone="green">active</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">In Progress: {step.inProgress} &nbsp; Completed: {step.completed}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-4">
              <SectionTitle>Candidates in Flow</SectionTitle>
              {job.candidates.length === 0 ? <EmptyState label="No candidates yet" /> : (
                <Table headers={['Candidate', 'Current Step', 'Status', 'Completed Steps', 'Actions']}>
                  {job.candidates.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2 px-3">
                        <p className="font-medium text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </td>
                      <td className="py-2 px-3 text-gray-600">{c.currentStep}</td>
                      <td className="py-2 px-3"><Badge tone={c.stepsCompleted >= c.stepsTotal ? 'green' : 'yellow'}>{c.stepsCompleted >= c.stepsTotal ? 'completed' : 'in progress'}</Badge></td>
                      <td className="py-2 px-3 text-gray-600">{c.stepsCompleted}/{c.stepsTotal}</td>
                      <td className="py-2 px-3">
                        <button onClick={() => setJourneyCandidate(c)} className="text-purple-600 text-xs font-medium">View Journey</button>
                      </td>
                    </tr>
                  ))}
                </Table>
              )}
            </Card>
          </div>
        )}

        {tab === 'Flow Management' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-2.5 text-sm text-amber-800">
              ⚠ Hiring Flow Management (Read-Only View) — action buttons are for demo purposes only in this admin preview.
            </div>
            <Card className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setFlowStepFilter('All Candidates')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium ${flowStepFilter === 'All Candidates' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  All Candidates ({job.candidates.length})
                </button>
                {HIRING_STEPS.map((step) => (
                  <button
                    key={step}
                    onClick={() => setFlowStepFilter(step)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium ${flowStepFilter === step ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {step} ({job.candidates.filter((c) => c.currentStep === step).length})
                  </button>
                ))}
              </div>

              {!job.isCampusJob && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center mb-4">
                  <p className="text-sm font-medium text-gray-700">Drag and drop resumes here</p>
                  <p className="text-xs text-gray-400 mt-1">Supports bulk upload of PDF, DOC, DOCX files</p>
                  <div className="flex justify-center gap-2 mt-3">
                    <Button size="sm" variant="secondary">Browse Files</Button>
                    <Button size="sm">+ Add Candidate</Button>
                  </div>
                </div>
              )}

              {flowFiltered.length === 0 ? <EmptyState label="No candidates in this step" /> : (
                <Table headers={['Name', 'Applied On', 'Current Step', 'JD Match', 'Source', '']}>
                  {flowFiltered.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2 px-3 font-medium text-gray-800">{c.name}</td>
                      <td className="py-2 px-3 text-gray-600">{c.appliedOn}</td>
                      <td className="py-2 px-3 text-gray-600">{c.currentStep}</td>
                      <td className="py-2 px-3"><Badge tone={c.jdMatchScore >= 50 ? 'green' : 'red'}>{c.jdMatchScore}%</Badge></td>
                      <td className="py-2 px-3">
                        {c.source === 'Campus' || c.source === 'Direct' ? <Badge tone="purple">Campus</Badge> : <span className="text-gray-600">{c.source}</span>}
                      </td>
                      <td className="py-2 px-3">
                        <button onClick={() => setJourneyCandidate(c)} className="text-purple-600 text-xs">View</button>
                      </td>
                    </tr>
                  ))}
                </Table>
              )}
            </Card>
          </div>
        )}

        {tab === 'Assessments' && (
          <div className="space-y-4">
            <Card className="p-4">
              <SectionTitle>Assigned Assessments</SectionTitle>
              {job.assessments.length === 0 ? <EmptyState label="No assessments assigned" /> : (
                <div className="grid grid-cols-2 gap-3">
                  {job.assessments.map((a) => (
                    <div key={a.id} className="border border-gray-100 rounded-md p-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-gray-800">{a.name}</p>
                        <span className="text-xs text-gray-500">Pass: {a.passPercent}%</span>
                      </div>
                      <div className="flex gap-1.5 mb-2">
                        <Badge>Assessment</Badge>
                        <Badge>{a.questionCount} Questions</Badge>
                        <Badge>{a.durationMins} min</Badge>
                      </div>
                      <p className="text-xs text-gray-500">Attempts: {a.attempts} &nbsp; Completed: {a.completed} &nbsp; Passed: {a.passed}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            <Card className="p-4">
              <SectionTitle>Assessment Results</SectionTitle>
              {job.assessments.length === 0 ? <EmptyState label="No results yet" /> : (
                <Table headers={['Candidate', 'Assessment', 'Status', 'Score', 'Result', 'Time Taken']}>
                  {job.candidates.slice(0, 4).map((c, i) => (
                    <tr key={c.id}>
                      <td className="py-2 px-3 text-gray-800">{c.name}</td>
                      <td className="py-2 px-3 text-gray-600">{job.assessments[0].name}</td>
                      <td className="py-2 px-3"><Badge tone="green">Completed</Badge></td>
                      <td className="py-2 px-3 text-gray-600">{50 + i * 10}%</td>
                      <td className="py-2 px-3">{50 + i * 10 >= job.assessments[0].passPercent ? <Badge tone="green">Pass</Badge> : <Badge tone="red">Fail</Badge>}</td>
                      <td className="py-2 px-3 text-gray-600">{12 + i * 3} min</td>
                    </tr>
                  ))}
                </Table>
              )}
            </Card>
          </div>
        )}

        {tab === 'Candidates' && (
          <Card className="p-4">
            {job.candidates.length === 0 ? <EmptyState label="No applied candidates" /> : (
              <Table headers={['Candidate', 'Contact', 'Profile', 'Source', 'Resume', 'JD Match', 'Hiring Progress', 'Interview', 'Applied']}>
                {job.candidates.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2 px-3 font-medium text-gray-800">{c.name}</td>
                    <td className="py-2 px-3 text-gray-600">{c.email}<br /><span className="text-xs text-gray-400">{c.phone}</span></td>
                    <td className="py-2 px-3 text-gray-600">{c.profile}</td>
                    <td className="py-2 px-3">
                      {c.source === 'Campus' || c.source === 'Direct' ? <Badge tone="purple">Campus</Badge> : <span className="text-gray-600">{c.source}</span>}
                      {c.campusCollege && <p className="text-xs text-gray-400 mt-0.5">{c.campusCollege}</p>}
                    </td>
                    <td className="py-2 px-3">{c.resumeAvailable ? <span className="text-purple-600 text-xs">Resume</span> : '—'}</td>
                    <td className="py-2 px-3"><Badge tone={c.jdMatchScore >= 50 ? 'green' : 'red'}>{c.jdMatchScore}%</Badge></td>
                    <td className="py-2 px-3 text-gray-600">{c.hiringProgress}</td>
                    <td className="py-2 px-3"><Badge tone={c.interviewStatus === 'Scheduled' ? 'blue' : 'gray'}>{c.interviewStatus}</Badge></td>
                    <td className="py-2 px-3 text-gray-600">{c.appliedOn}</td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        )}

        {tab === 'Campus' && job.isCampusJob && (
          <div className="space-y-4">
            <Card className="p-4">
              <SectionTitle>Campus Reach ({job.targetedColleges.length} Colleges)</SectionTitle>
              <Table headers={['College', 'Applications', 'Accepted']}>
                {job.targetedColleges.map((c) => (
                  <tr key={c.collegeId}>
                    <td className="py-2 px-3 font-medium text-gray-800">{c.collegeName}</td>
                    <td className="py-2 px-3 text-gray-600">{c.applications}</td>
                    <td className="py-2 px-3">{c.accepted ? <Badge tone="green">Accepted</Badge> : <Badge tone="yellow">Pending</Badge>}</td>
                  </tr>
                ))}
              </Table>
            </Card>
            <Card className="p-4">
              <SectionTitle>Campus Candidates</SectionTitle>
              {job.candidates.filter((c) => c.source === 'Campus').length === 0 ? <EmptyState label="No campus candidates yet" /> : (
                <Table headers={['Candidate', 'College', 'JD Match', 'Journey']}>
                  {job.candidates.filter((c) => c.source === 'Campus').map((c) => (
                    <tr key={c.id}>
                      <td className="py-2 px-3 font-medium text-gray-800">{c.name}</td>
                      <td className="py-2 px-3 text-gray-600">{c.campusCollege}</td>
                      <td className="py-2 px-3"><Badge tone={c.jdMatchScore >= 50 ? 'green' : 'red'}>{c.jdMatchScore}%</Badge></td>
                      <td className="py-2 px-3"><button onClick={() => setJourneyCandidate(c)} className="text-purple-600 text-xs">View Journey</button></td>
                    </tr>
                  ))}
                </Table>
              )}
            </Card>
          </div>
        )}
      </div>

      {journeyCandidate && <CandidateJourneyModal candidate={journeyCandidate} jobTitle={job.title} companyName={job.companyName} onClose={() => setJourneyCandidate(null)} />}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function CandidateJourneyModal({ candidate, jobTitle, companyName, onClose }: { candidate: JobCandidate; jobTitle: string; companyName: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-base font-semibold text-gray-900">Candidate Journey</h2>
        <p className="text-xs text-gray-500 mb-4">{jobTitle} at {companyName}</p>

        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <p className="font-medium text-gray-800">{candidate.name}</p>
          <p className="text-xs text-gray-500">{candidate.email} · {candidate.phone}</p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4 text-center">
          <div><p className="text-xs text-gray-500">Applied On</p><p className="text-sm font-semibold text-gray-800">{candidate.appliedOn}</p></div>
          <div><p className="text-xs text-gray-500">JD Match</p><p className="text-sm font-semibold text-gray-800">{candidate.jdMatchScore}%</p></div>
          <div><p className="text-xs text-gray-500">Progress</p><p className="text-sm font-semibold text-gray-800">{candidate.stepsCompleted}/{candidate.stepsTotal}</p></div>
          <div><p className="text-xs text-gray-500">Current Step</p><p className="text-sm font-semibold text-purple-700">{candidate.currentStep}</p></div>
        </div>

        <SectionTitle>Hiring Journey</SectionTitle>
        <div className="space-y-3">
          {HIRING_STEPS.map((step, i) => {
            const state = i < candidate.stepsCompleted ? 'done' : i === candidate.stepsCompleted ? 'active' : 'pending';
            return (
              <div key={step} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${state === 'done' ? 'bg-emerald-500 text-white' : state === 'active' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {state === 'done' ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-800">Step {i + 1}: {step}</p>
                    <Badge tone={state === 'done' ? 'green' : state === 'active' ? 'blue' : 'gray'}>{state === 'done' ? 'Completed' : state === 'active' ? 'In Progress' : 'Pending'}</Badge>
                  </div>
                  {state === 'pending' && <p className="text-xs text-gray-400 mt-0.5">Candidate has not reached this step yet</p>}
                </div>
              </div>
            );
          })}
        </div>

        <Button className="mt-5 w-full" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
