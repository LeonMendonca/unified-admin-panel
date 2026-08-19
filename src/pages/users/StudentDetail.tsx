import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getStudentById,
  getJobApplications,
  getDocuments,
  getCareerDiscoverySessions,
  getRoomAttempts,
  getResumes,
  getTestAttempts,
  getCreditTransactions,
} from '../../data/students';
import { Avatar, Badge, statusTone, Card, SectionTitle, Table, Tabs, Button, EmptyState, ProgressBar } from '../../components/ui';

const TABS = ['Overview', 'Job Applications', 'Personal Info & Work Preferences', 'Activity & Records', 'Credits', 'Room Performance & Mastery', 'Resume Portfolio', 'Test Attempts'];

export default function StudentDetail() {
  const { id } = useParams();
  const student = getStudentById(id || '');
  const [tab, setTab] = useState(TABS[0]);
  const [roomTab, setRoomTab] = useState<'Room Performance' | 'Badges & Achievements' | 'Leaderboard History'>('Room Performance');

  if (!student) return <EmptyState label="Student not found" />;

  const applications = getJobApplications(student.id);
  const documents = getDocuments(student.id);
  const sessions = getCareerDiscoverySessions(student.id);
  const roomAttempts = getRoomAttempts(student.id);
  const resumes = getResumes(student.id);
  const testAttempts = getTestAttempts(student.id);
  const creditTransactions = getCreditTransactions(student.id);

  return (
    <div>
      <Link to="/users" className="text-xs text-gray-500 hover:text-gray-700">← Back to Users</Link>
      <div className="flex items-center justify-between mt-3 mb-5">
        <div className="flex items-center gap-4">
          <Avatar name={student.name} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">{student.name}</h1>
              <Badge tone={statusTone(student.status)}>{student.status}</Badge>
              <Badge tone={student.registrationSource === 'Invited' ? 'blue' : 'purple'}>{student.registrationSource}</Badge>
            </div>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Match Profile</Button>
          <Button variant="secondary">Export Attempts CSV</Button>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-5">
        {tab === 'Overview' && (
          <div className="space-y-4">
            <Card className="p-4">
              <SectionTitle>Student Information</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium text-gray-800 mt-1">{student.email}</p></div>
                <div><p className="text-xs text-gray-500">College</p><p className="text-sm font-medium text-gray-800 mt-1">{student.collegeName || 'No College Assigned'}</p></div>
                <div><p className="text-xs text-gray-500">Registered</p><p className="text-sm font-medium text-gray-800 mt-1">{student.registeredOn}</p></div>
                <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium text-gray-800 mt-1">{student.phone}</p></div>
                <div>
                  <p className="text-xs text-gray-500">Placement Readiness Score</p>
                  <p className={`text-2xl font-bold mt-1 ${student.placementReadinessScore >= 60 ? 'text-emerald-600' : 'text-rose-600'}`}>{student.placementReadinessScore}%</p>
                  <p className="text-xs text-gray-400">Based on completed test(s)</p>
                </div>
                <div className="flex items-end gap-2">
                  <Badge tone={student.status === 'Pending' ? 'yellow' : 'blue'}>{student.status === 'Pending' ? 'No Account' : 'Has Account'}</Badge>
                  <Badge tone={statusTone(student.status)}>{student.status === 'Registered' ? 'Active' : student.status}</Badge>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              {[
                ['Gender', student.gender],
                ['DOB', student.dob],
                ['Roll number', student.rollNumber],
                ['City', student.city],
                ['State', student.state],
                ['Pincode', student.pincode],
                ['Blocked', student.blocked ? 'Yes' : 'No'],
              ].map(([label, value]) => (
                <Card key={label} className="p-4">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">{value}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab === 'Job Applications' && (
          <Card className="p-4">
            {applications.length === 0 ? (
              <EmptyState label="No job applications" />
            ) : (
              <Table headers={['Job', 'Status', 'Stage', 'Source', 'Applied date', 'Resume used', 'Links']}>
                {applications.map((a) => (
                  <tr key={a.id}>
                    <td className="py-2.5 px-3 font-medium text-gray-800">{a.jobTitle}</td>
                    <td className="py-2.5 px-3"><Badge>{a.status}</Badge></td>
                    <td className="py-2.5 px-3 text-gray-600">{a.stage}</td>
                    <td className="py-2.5 px-3 text-gray-600">{a.source}{a.campusCollege ? ` · ${a.campusCollege}` : ''}</td>
                    <td className="py-2.5 px-3 text-gray-600">{a.appliedDate}</td>
                    <td className="py-2.5 px-3 text-gray-600">{a.resumeUsed}</td>
                    <td className="py-2.5 px-3 text-purple-600 text-xs">View</td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        )}

        {tab === 'Personal Info & Work Preferences' && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <SectionTitle>Personal Info</SectionTitle>
              <dl className="space-y-2 text-sm">
                {[
                  ['DOB', student.dob],
                  ['Gender', student.gender],
                  ['Batch', student.batch],
                  ['Location', student.location],
                  ['Roll number', student.rollNumber],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="text-gray-800 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
            <Card className="p-4">
              <SectionTitle>Work Preferences</SectionTitle>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Role types</dt><dd className="text-gray-800 font-medium">{student.roleTypes.join(', ')}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Company types</dt><dd className="text-gray-800 font-medium">{student.companyTypes.join(', ')}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Working times</dt><dd className="text-gray-800 font-medium">{student.workingTimes.join(', ')}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Preferred locations</dt><dd className="text-gray-800 font-medium">{student.preferredLocations.join(', ')}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Open to relocate</dt><dd className="text-gray-800 font-medium">{student.openToRelocate ? 'Yes' : 'No'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Open to travel</dt><dd className="text-gray-800 font-medium">{student.openToTravel ? 'Yes' : 'No'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Six-day week</dt><dd className="text-gray-800 font-medium">{student.sixDayWeek ? 'Yes' : 'No'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Unpaid internship</dt><dd className="text-gray-800 font-medium">{student.unpaidInternship ? 'Yes' : 'No'}</dd></div>
              </dl>
            </Card>
          </div>
        )}

        {tab === 'Activity & Records' && (
          <div className="space-y-4">
            <Card className="p-4">
              <SectionTitle>Extended Profile</SectionTitle>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Degree</dt><dd className="text-gray-800 font-medium">{student.degree}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Graduation year</dt><dd className="text-gray-800 font-medium">{student.graduationYear}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Skills</dt><dd className="text-gray-800 font-medium">{student.skills.join(', ')}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Interests</dt><dd className="text-gray-800 font-medium">{student.interests.join(', ')}</dd></div>
              </dl>
            </Card>
            <Card className="p-4">
              <SectionTitle>Documents</SectionTitle>
              {documents.length === 0 ? <EmptyState label="No documents uploaded" /> : (
                <Table headers={['Label', 'File', 'Size', 'Uploaded date', 'Campus synced']}>
                  {documents.map((d) => (
                    <tr key={d.id}>
                      <td className="py-2 px-3 text-gray-800">{d.label}</td>
                      <td className="py-2 px-3 text-gray-600">{d.file}</td>
                      <td className="py-2 px-3 text-gray-600">{d.size}</td>
                      <td className="py-2 px-3 text-gray-600">{d.uploadedDate}</td>
                      <td className="py-2 px-3">{d.campusSynced ? <Badge tone="green">Synced</Badge> : <Badge>—</Badge>}</td>
                    </tr>
                  ))}
                </Table>
              )}
            </Card>
            <Card className="p-4">
              <SectionTitle>Career Discovery Sessions</SectionTitle>
              {sessions.length === 0 ? <EmptyState label="No career discovery sessions" /> : (
                <Table headers={['Phase', 'Started', 'Completed', 'AI report status']}>
                  {sessions.map((s) => (
                    <tr key={s.id}>
                      <td className="py-2 px-3 text-gray-800">{s.phase}</td>
                      <td className="py-2 px-3 text-gray-600">{s.started}</td>
                      <td className="py-2 px-3 text-gray-600">{s.completed || '—'}</td>
                      <td className="py-2 px-3"><Badge tone={s.aiReportStatus === 'Generated' ? 'green' : 'yellow'}>{s.aiReportStatus}</Badge></td>
                    </tr>
                  ))}
                </Table>
              )}
            </Card>
            <Card className="p-4">
              <SectionTitle>Invitations Sent</SectionTitle>
              <EmptyState label="No invitations sent by this student" />
            </Card>
          </div>
        )}

        {tab === 'Credits' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4"><p className="text-xs text-gray-500">Balance</p><p className="text-xl font-semibold mt-1">{student.creditsBalance}</p></Card>
              <Card className="p-4"><p className="text-xs text-gray-500">Earned</p><p className="text-xl font-semibold mt-1">{student.creditsEarned}</p></Card>
              <Card className="p-4"><p className="text-xs text-gray-500">Spent</p><p className="text-xl font-semibold mt-1">{student.creditsSpent}</p></Card>
            </div>
            <div className="flex gap-2">
              <Button>Add credits</Button>
              <Button variant="secondary">Deduct credits</Button>
            </div>
            <Card className="p-4">
              <SectionTitle>Transaction History</SectionTitle>
              <Table headers={['Date', 'Type', 'Amount', 'Balance After', 'Description']}>
                {creditTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-2 px-3 text-gray-600">{tx.date}</td>
                    <td className="py-2 px-3"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{tx.type}</code></td>
                    <td className={`py-2 px-3 font-medium ${tx.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{tx.amount >= 0 ? '+' : ''}{tx.amount}</td>
                    <td className="py-2 px-3 text-gray-600">{tx.balanceAfter}</td>
                    <td className="py-2 px-3 text-gray-600">{tx.description}</td>
                  </tr>
                ))}
              </Table>
            </Card>
          </div>
        )}

        {tab === 'Room Performance & Mastery' && (
          <div>
            <Tabs
              tabs={['Room Performance', 'Badges & Achievements', 'Leaderboard History']}
              active={roomTab}
              onChange={(t) => setRoomTab(t as typeof roomTab)}
            />
            <div className="mt-4">
              {roomTab === 'Room Performance' && (
                <Card className="p-4">
                  {roomAttempts.length === 0 ? <EmptyState label="No room attempts yet" /> : (
                    <Table headers={['Room', 'Attempts', 'Avg score', 'Best score', '30-day points', 'Last attempt']}>
                      {roomAttempts.map((r) => (
                        <tr key={r.id}>
                          <td className="py-2 px-3 text-gray-800 font-medium">{r.roomName}</td>
                          <td className="py-2 px-3 text-gray-600">{r.attempts}</td>
                          <td className="py-2 px-3 text-gray-600">{r.averageScore}</td>
                          <td className="py-2 px-3 text-gray-600">{r.bestScore}</td>
                          <td className="py-2 px-3 text-gray-600">{r.points30d}</td>
                          <td className="py-2 px-3 text-gray-600">{r.lastAttempt}</td>
                        </tr>
                      ))}
                    </Table>
                  )}
                </Card>
              )}
              {roomTab === 'Badges & Achievements' && (
                <div className="grid grid-cols-4 gap-3">
                  {['DSA Novice', 'Quick Solver', 'Consistent Learner', 'Top 10%'].map((b) => (
                    <Card key={b} className="p-4 text-center">
                      <div className="w-10 h-10 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">🏅</div>
                      <p className="text-xs font-medium mt-2 text-gray-700">{b}</p>
                    </Card>
                  ))}
                </div>
              )}
              {roomTab === 'Leaderboard History' && (
                <Card className="p-4">
                  <Table headers={['Room', 'Rank', 'Period']}>
                    {roomAttempts.map((r, i) => (
                      <tr key={r.id}>
                        <td className="py-2 px-3 text-gray-800">{r.roomName}</td>
                        <td className="py-2 px-3 text-gray-600">#{(i + 1) * 3}</td>
                        <td className="py-2 px-3 text-gray-600">Nov 2025</td>
                      </tr>
                    ))}
                  </Table>
                </Card>
              )}
            </div>
          </div>
        )}

        {tab === 'Resume Portfolio' && (
          <div className="grid grid-cols-2 gap-4">
            {resumes.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">{r.name}</p>
                  <Badge tone={r.visibility === 'Public' ? 'green' : 'gray'}>{r.visibility}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">{r.origin}</p>
                <div className="mt-3"><ProgressBar value={r.completion} /><p className="text-xs text-gray-500 mt-1">{r.completion}% complete</p></div>
                <div className="flex justify-between text-xs text-gray-500 mt-3">
                  <span>{r.views} views</span>
                  <span>{r.contactReveals} contact reveals</span>
                  <Badge>{r.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'Test Attempts' && (
          <Card className="p-4">
            {testAttempts.length === 0 ? <EmptyState label="No test attempts" /> : (
              <Table headers={['Test', 'Type', 'Attempt #', 'Started', 'Completed', 'Status', 'Progress', 'Score']}>
                {testAttempts.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2 px-3 text-gray-800">{t.testName}</td>
                    <td className="py-2 px-3 text-gray-600">{t.type}</td>
                    <td className="py-2 px-3 text-gray-600">{t.attemptNumber}</td>
                    <td className="py-2 px-3 text-gray-600">{t.started}</td>
                    <td className="py-2 px-3 text-gray-600">{t.completed || '—'}</td>
                    <td className="py-2 px-3"><Badge tone={t.status === 'Completed' ? 'green' : 'yellow'}>{t.status}</Badge></td>
                    <td className="py-2 px-3 text-gray-600">{t.progress}%</td>
                    <td className="py-2 px-3 text-gray-600">{t.score ?? '—'}</td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
