import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCollegeById } from '../../data/colleges';
import { tpos as allTpos } from '../../data/tpos';
import type { Batch, TPO } from '../../data/types';
import { Badge, Card, SectionTitle, Button, EmptyState, Toggle, Tabs } from '../../components/ui';
import Accordion from '../../components/Accordion';
import AddTpoModal from '../users/AddTpoModal';
import AddStudentModal from '../users/AddStudentModal';

type View = 'overview' | 'batches' | { batch: Batch };

export default function CollegeDetail() {
  const { id } = useParams();
  const college = getCollegeById(id || '');
  const [view, setView] = useState<View>('overview');
  const [tpoModal, setTpoModal] = useState<{ open: boolean; tpo?: TPO }>({ open: false });
  const [addStudentsOpen, setAddStudentsOpen] = useState(false);
  const [batchOverrides, setBatchOverrides] = useState<Record<string, { deactivated?: boolean; deleted?: boolean }>>({});
  const [recognition, setRecognition] = useState(college?.officialRecognition);
  const [regTab, setRegTab] = useState<'Registered' | 'Not Registered'>('Registered');

  if (!college) return <EmptyState label="College not found" />;
  if (!recognition) return null;

  const collegeTpos = allTpos.filter((t) => t.collegeId === college.id);
  const visibleBatches = college.batches.filter((b) => !batchOverrides[b.id]?.deleted);

  return (
    <div>
      <Link to="/colleges" className="text-xs text-gray-500 hover:text-gray-700">← Back to Colleges</Link>

      {view !== 'overview' && (
        <button
          onClick={() => setView(typeof view === 'object' ? 'batches' : 'overview')}
          className="block text-xs text-gray-500 hover:text-gray-700 mt-1"
        >
          ← Back to {typeof view === 'object' ? 'Batches' : 'Overview'}
        </button>
      )}

      <div className="flex items-center justify-between mt-3 mb-5">
        <div className="flex items-center gap-4">
          <img src={college.logo} className="w-14 h-14 rounded-lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">{college.name}</h1>
              <Badge tone={college.status === 'Activated' ? 'green' : 'red'}>{college.status}</Badge>
            </div>
            <p className="text-sm text-gray-500">{college.city}, {college.state} · Last updated {college.lastUpdated}</p>
            <a href={college.websiteUrl} className="text-xs text-purple-600">{college.websiteUrl}</a>
          </div>
        </div>
        {view === 'overview' && <Button variant="danger">{college.status === 'Activated' ? 'Deactivate' : 'Activate'}</Button>}
      </div>

      {view === 'overview' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <Accordion title="Basic Information">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-gray-500">College Name</dt><dd className="font-medium text-gray-800">{college.name}</dd></div>
                <div><dt className="text-gray-500">College Code</dt><dd className="font-medium text-gray-800">{college.code}</dd></div>
                <div><dt className="text-gray-500">Official Website URL</dt><dd className="font-medium text-gray-800">{college.websiteUrl}</dd></div>
                <div><dt className="text-gray-500">Pin code</dt><dd className="font-medium text-gray-800">{college.pincode}</dd></div>
                <div><dt className="text-gray-500">City, State</dt><dd className="font-medium text-gray-800">{college.city}, {college.state}</dd></div>
                <div><dt className="text-gray-500">Address Line 1</dt><dd className="font-medium text-gray-800">{college.addressLine1}</dd></div>
              </dl>
            </Accordion>

            <Accordion title="Contact Information">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-gray-500">Contact No.</dt><dd className="font-medium text-gray-800">{college.contactPhone}</dd></div>
                <div><dt className="text-gray-500">Email</dt><dd className="font-medium text-gray-800">{college.contactEmail}</dd></div>
                <div><dt className="text-gray-500">Contact Person</dt><dd className="font-medium text-gray-800">{college.contactPerson}</dd></div>
                <div><dt className="text-gray-500">Alternate Contact No.</dt><dd className="font-medium text-gray-800">{college.alternateContactPhone || '—'}</dd></div>
              </dl>
            </Accordion>

            <Accordion title="Administrative Details">
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><dt className="text-gray-500">Type of Institution</dt><dd className="font-medium text-gray-800">{college.institutionType}</dd></div>
                <div><dt className="text-gray-500">Total Student Enrollment</dt><dd className="font-medium text-gray-800">{college.enrollment}</dd></div>
                <div><dt className="text-gray-500">Tier</dt><dd className="font-medium text-gray-800">{college.tier}</dd></div>
              </div>
              <p className="text-xs text-gray-500 mb-2">Official recognition</p>
              <div className="space-y-2">
                {([
                  ['nbaAccreditation', 'NBA Accreditation'],
                  ['ugcRecognition', 'UGC Recognition'],
                  ['aicteApproval', 'AICTE Approval'],
                  ['instituteOfEminence', 'Institute of Eminence'],
                ] as const).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between border border-gray-100 rounded-md px-3 py-2">
                    <span className="text-sm text-gray-700">{label}</span>
                    <Toggle checked={recognition[key]} onChange={(v) => setRecognition({ ...recognition, [key]: v })} />
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="Placement Details">
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div><dt className="text-gray-500">Average Package</dt><dd className="font-medium text-gray-800">{college.avgPackage}</dd></div>
                <div><dt className="text-gray-500">Highest Package</dt><dd className="font-medium text-gray-800">{college.highestPackage}</dd></div>
                <div><dt className="text-gray-500">Placement Rate</dt><dd className="font-medium text-gray-800">{college.placementRate}%</dd></div>
                <div><dt className="text-gray-500">Active Jobs</dt><dd className="font-medium text-gray-800">{college.activeJobs}</dd></div>
              </div>
            </Accordion>

            <Accordion title="Programs">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="py-2 font-medium">Program Name</th>
                    <th className="py-2 font-medium">Code</th>
                    <th className="py-2 font-medium">Type</th>
                    <th className="py-2 font-medium">Specialization</th>
                    <th className="py-2 font-medium">Intake</th>
                    <th className="py-2 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {college.programs.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2 text-gray-800">{p.name.toLowerCase()}</td>
                      <td className="py-2 text-gray-600">{p.code}</td>
                      <td className="py-2 text-gray-600">{p.programType.toLowerCase()}</td>
                      <td className="py-2 text-gray-600">{p.specialization}</td>
                      <td className="py-2 text-gray-600">{p.intake}</td>
                      <td className="py-2 text-gray-600">{p.durationYears} Years</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Accordion>
          </div>

          <div className="space-y-4">
            <Card className="p-3 space-y-2">
              <Button className="w-full text-center block">Edit College Details</Button>
              <Button variant="secondary" className="w-full text-center block">Autofill from Web</Button>
              <Button variant="secondary" className="w-full text-center block">Preview College Page</Button>
              <button
                onClick={() => setView('batches')}
                className="w-full flex items-center justify-between bg-teal-600 hover:bg-teal-700 text-white rounded-md px-3 py-2 text-sm font-medium"
              >
                Batches
                <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">{visibleBatches.length}</span>
              </button>
            </Card>

            <Card className="p-4">
              <SectionTitle>College Stats & Updates</SectionTitle>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-500">Total Batches</p><p className="font-semibold text-gray-800">{visibleBatches.length}</p></div>
                <div><p className="text-xs text-gray-500">Total Students</p><p className="font-semibold text-gray-800">{college.totalStudents}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-500">Placement status</p><p className="font-semibold text-gray-800">{visibleBatches.reduce((s, b) => s + b.placedCount, 0)} Placed</p></div>
              </div>
            </Card>

            <Card className="p-4">
              <SectionTitle>Overview (Talent)</SectionTitle>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div><p className="text-lg font-bold text-gray-900">{college.totalStudents}</p><p className="text-xs text-gray-500">Students</p></div>
                <div><p className="text-lg font-bold text-gray-900">{collegeTpos.length}</p><p className="text-xs text-gray-500">TPO Users</p></div>
                <div><p className="text-lg font-bold text-gray-900">{college.activeTests}</p><p className="text-xs text-gray-500">Active Tests</p></div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1 text-center">View Analytics</Button>
                <Button variant="secondary" size="sm" className="flex-1 text-center">Student List</Button>
              </div>
            </Card>

            <Card className="p-4">
              <SectionTitle action={<Button size="sm" onClick={() => setTpoModal({ open: true })}>+ Add TPO</Button>}>
                TPO Users ({collegeTpos.length})
              </SectionTitle>
              <div className="space-y-2">
                {collegeTpos.length === 0 ? <EmptyState label="No TPO users yet" /> : collegeTpos.map((t) => (
                  <div key={t.id} className="flex items-center justify-between border border-gray-100 rounded-md px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-purple-700">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.email}</p>
                      <p className="text-xs text-gray-500">{t.contact}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={t.status === 'Registered' ? 'green' : t.status === 'Pending' ? 'yellow' : 'red'}>{t.status === 'Registered' ? 'Active' : t.status}</Badge>
                      <button onClick={() => setTpoModal({ open: true, tpo: t })} className="text-xs text-purple-600">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {view === 'batches' && (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <select className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white">
              <option>Select Program Level</option>
              <option>UG</option>
              <option>PG</option>
            </select>
            <select className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white">
              <option>Select The Year</option>
              {['2024', '2025', '2026'].map((y) => <option key={y}>{y}</option>)}
            </select>
            <div className="ml-auto flex gap-2">
              <Button variant="secondary">Barred Candidates</Button>
              <Button variant="secondary">Export Data</Button>
              <Button>+ Add Batch</Button>
            </div>
          </div>

          <SectionTitle>All Batches ({visibleBatches.length})</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            {visibleBatches.map((b) => {
              const deactivated = batchOverrides[b.id]?.deactivated ?? b.deactivated;
              return (
                <Card key={b.id} className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-purple-700 text-sm">{b.code}</span>
                      <Badge tone="blue">{b.programLevel}</Badge>
                    </div>
                    <BatchMenu
                      onEdit={() => {}}
                      onDeactivate={() => setBatchOverrides((prev) => ({ ...prev, [b.id]: { ...prev[b.id], deactivated: !deactivated } }))}
                      onDelete={() => setBatchOverrides((prev) => ({ ...prev, [b.id]: { ...prev[b.id], deleted: true } }))}
                      deactivated={deactivated}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{b.programName}</p>
                  <p className="text-xs text-gray-500 mb-2">{b.startDate} – {b.endDate}</p>
                  <button onClick={() => setView({ batch: b })} className="w-full bg-gray-50 rounded-md px-3 py-2 flex items-center justify-between text-sm hover:bg-gray-100">
                    <span className="text-gray-600">Students placed: {b.placedCount}</span>
                    <Badge>{b.studentCount} Students</Badge>
                  </button>
                  <div className="flex items-center justify-between mt-2">
                    {b.studentAdmin ? (
                      <span className="text-xs text-gray-500">Student Admin: <span className="text-purple-600">{b.studentAdmin}</span></span>
                    ) : (
                      <button className="text-xs text-purple-600 underline">Assign Student Admin</button>
                    )}
                    {deactivated && <Badge tone="red">DEACTIVATED</Badge>}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {typeof view === 'object' && (
        <BatchDetail
          batch={view.batch}
          regTab={regTab}
          setRegTab={setRegTab}
          onAddStudents={() => setAddStudentsOpen(true)}
        />
      )}

      {tpoModal.open && <AddTpoModal tpo={tpoModal.tpo} onClose={() => setTpoModal({ open: false })} />}
      {addStudentsOpen && <AddStudentModal onClose={() => setAddStudentsOpen(false)} />}
    </div>
  );
}

function BatchMenu({
  onEdit,
  onDeactivate,
  onDelete,
  deactivated,
}: {
  onEdit: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  deactivated: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="text-gray-400 px-1">•••</button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1 text-sm">
          <button onClick={() => { setOpen(false); onEdit(); }} className="w-full text-left px-3 py-1.5 hover:bg-gray-50">Edit Batch</button>
          <button onClick={() => { setOpen(false); onDeactivate(); }} className="w-full text-left px-3 py-1.5 hover:bg-gray-50">{deactivated ? 'Activate Batch' : 'Deactivate Batch'}</button>
          <button onClick={() => { setOpen(false); onDelete(); }} className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-gray-50">Delete Batch</button>
        </div>
      )}
    </div>
  );
}

function BatchDetail({
  batch,
  regTab,
  setRegTab,
  onAddStudents,
}: {
  batch: Batch;
  regTab: 'Registered' | 'Not Registered';
  setRegTab: (t: 'Registered' | 'Not Registered') => void;
  onAddStudents: () => void;
}) {
  const students = batch.students.filter((s) => (regTab === 'Registered' ? s.registered : !s.registered));
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">Select Batch</p>
          <p className="font-semibold text-gray-800">{batch.code}</p>
          {batch.barredCount > 0 && <p className="text-xs text-amber-600 mt-1">⚠ Barred Candidates: {batch.barredCount}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Copy Signup Link</Button>
          <Button onClick={onAddStudents}>Add Students</Button>
        </div>
      </div>

      <Tabs
        tabs={['Registered', 'Not Registered']}
        active={regTab}
        onChange={(t) => setRegTab(t as typeof regTab)}
      />

      <div className="mt-4">
        {students.length === 0 ? <EmptyState label="No students in this list" /> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="py-2 font-medium">Students</th>
                <th className="py-2 font-medium">Role</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Roll No</th>
                <th className="py-2 font-medium">Placement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 text-gray-800 font-medium">{s.name}</td>
                  <td className="py-2 text-gray-600">{s.role}</td>
                  <td className="py-2 text-gray-600">{s.email}</td>
                  <td className="py-2 text-gray-600">{s.rollNumber}</td>
                  <td className="py-2"><Badge tone={s.placement === 'Placed' ? 'green' : 'yellow'}>{s.placement}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
