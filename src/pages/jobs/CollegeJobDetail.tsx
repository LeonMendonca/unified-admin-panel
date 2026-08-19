import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCollegeJobById } from '../../data/jobs';
import type { CollegeJobApplicant } from '../../data/types';
import { Badge, statusTone, Card, SectionTitle, Table, Button, EmptyState, ProgressBar } from '../../components/ui';

export default function CollegeJobDetail() {
  const { id } = useParams();
  const job = getCollegeJobById(id || '');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CollegeJobApplicant | null>(null);

  if (!job) return <EmptyState label="College job not found" />;

  const applicants = job.applicants.filter((a) => (a.name + a.email).toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <Link to="/jobs" className="text-xs text-gray-500 hover:text-gray-700">← Back to Jobs</Link>

      <div className="flex items-center justify-between mt-3 mb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-semibold text-gray-900">{job.title}</h1>
            <Badge>{job.jobType}</Badge>
            <Badge tone={statusTone(job.status)}>{job.status}</Badge>
            <Badge tone={job.visibleOnZigme ? 'green' : 'red'}>{job.visibleOnZigme ? 'Visible on ZigMe' : 'Hidden on ZigMe'}</Badge>
          </div>
          <p className="text-sm text-gray-500">{job.collegeName} · {job.batch} · {job.location}</p>
        </div>
        <Button variant="secondary">{job.status === 'Active' ? 'Close Job' : 'Reopen Job'}</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card className="p-4"><p className="text-xs text-gray-500">Applications</p><p className="text-xl font-semibold mt-1">{job.applicantCount}</p></Card>
        <Card className="p-4"><p className="text-xs text-gray-500">Salary</p><p className="text-xl font-semibold mt-1">{job.salaryRange}</p></Card>
        <Card className="p-4"><p className="text-xs text-gray-500">Posted by</p><p className="text-xl font-semibold mt-1">{job.postedBy}</p></Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <SectionTitle>Job Details</SectionTitle>
            <dl className="grid grid-cols-3 gap-3 text-sm mb-4">
              <div><dt className="text-gray-500">Application Deadline</dt><dd className="font-medium text-gray-800">{job.deadline}</dd></div>
              <div><dt className="text-gray-500">Posted On</dt><dd className="font-medium text-gray-800">{job.postedDate}</dd></div>
              <div><dt className="text-gray-500">Last Edited On</dt><dd className="font-medium text-gray-800">{job.lastEdited}</dd></div>
            </dl>
            <p className="text-xs text-gray-500 mb-1">Mandatory documents</p>
            <div className="flex gap-1.5">
              {job.mandatoryDocs.map((d) => <Badge key={d} tone="blue">{d}</Badge>)}
            </div>
          </Card>

          <Card className="p-4">
            <SectionTitle>Candidate Expectations</SectionTitle>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-gray-100 rounded-md p-3"><p className="text-xs text-gray-500">Experience</p><p className="font-semibold text-gray-800">{job.experienceRequired}</p></div>
              <div className="border border-gray-100 rounded-md p-3"><p className="text-xs text-gray-500">Min Qualification</p><p className="font-semibold text-gray-800">{job.minQualification}</p></div>
            </div>
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-md p-3">{job.description}</p>
          </Card>

          <Card className="p-4">
            <SectionTitle>Skills</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((s) => <Badge key={s}>{s}</Badge>)}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <SectionTitle>College</SectionTitle>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">College</dt><dd className="font-medium text-gray-800">{job.collegeName}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Batch</dt><dd className="font-medium text-gray-800">{job.batch}</dd></div>
              <Link to={`/colleges/${job.collegeId}`} className="text-xs text-purple-600 block pt-1">View College →</Link>
            </dl>
          </Card>
        </div>
      </div>

      <div className="mt-5">
        <SectionTitle>Applicants ({applicants.length})</SectionTitle>
        <Card className="p-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full max-w-sm text-sm border border-gray-200 rounded-md px-3 py-2 mb-4"
          />
          {applicants.length === 0 ? <EmptyState label="No applicants yet" /> : (
            <Table headers={['Name', 'College', 'Batch', 'Experience', 'Status', 'Resume', '']}>
              {applicants.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(a)}>
                  <td className="py-2 px-3 font-medium text-gray-800">{a.name}</td>
                  <td className="py-2 px-3 text-gray-600">{a.college}</td>
                  <td className="py-2 px-3 text-gray-600">{a.batch}</td>
                  <td className="py-2 px-3 text-gray-600">{a.experience}</td>
                  <td className="py-2 px-3"><Badge tone={a.status === 'Placed' ? 'green' : 'gray'}>{a.status}</Badge></td>
                  <td className="py-2 px-3 text-purple-600 text-xs">Resume</td>
                  <td className="py-2 px-3 text-purple-600 text-xs font-medium">View</td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>

      {selected && <ApplicantModal applicant={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ApplicantModal({ applicant, onClose }: { applicant: CollegeJobApplicant; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{applicant.name}</h2>
            <p className="text-xs text-gray-500">{applicant.city}, {applicant.state}</p>
            <p className="text-xs text-gray-500">{applicant.degree} · {applicant.batch}</p>
          </div>
          {applicant.registeredStudent && <Badge tone="green">Registered Student</Badge>}
        </div>

        <SectionTitle>Contact Information</SectionTitle>
        <div className="bg-gray-50 rounded-md p-3 text-sm mb-4">
          <p className="text-gray-800">{applicant.email}</p>
          <p className="text-gray-600">{applicant.phone}</p>
        </div>

        <SectionTitle>Personal Information</SectionTitle>
        <dl className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div><dt className="text-gray-500">Gender</dt><dd className="font-medium text-gray-800">{applicant.gender}</dd></div>
          <div><dt className="text-gray-500">Date of Birth</dt><dd className="font-medium text-gray-800">{applicant.dob}</dd></div>
        </dl>

        <SectionTitle>Job Application Statistics</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-amber-50 rounded-md p-3"><p className="text-xs text-gray-500">Total Applications</p><p className="text-lg font-semibold text-gray-800">{applicant.totalApplications}</p></div>
          <div><p className="text-xs text-gray-500 mt-1">Active Applications</p><p className="text-lg font-semibold text-gray-800">{applicant.activeApplications}</p></div>
        </div>

        <SectionTitle>Account Status & Scores</SectionTitle>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Placement Status</span><span className="font-medium text-gray-800">{applicant.placementStatus}</span></div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Profile Completion</span><span>{applicant.profileCompletion}%</span></div>
            <ProgressBar value={applicant.profileCompletion} />
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Placement Readiness</span><span>{applicant.placementReadiness}%</span></div>
            <ProgressBar value={applicant.placementReadiness} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 text-center">View Smart Resume</Button>
          <Button variant="secondary" className="flex-1 text-center">View Student Profile</Button>
        </div>
      </div>
    </div>
  );
}
