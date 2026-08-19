import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHrById } from '../../data/hrs';
import { getCompanyById } from '../../data/companies';
import { jobs } from '../../data/jobs';
import { getCampusAccessPackage } from '../../data/creditSettings';
import { Avatar, Badge, statusTone, Card, SectionTitle, Table, Tabs, Button, EmptyState, StatTile } from '../../components/ui';

const TABS = ['Overview', 'Company', 'Jobs', 'Interview Notes', 'Activity Log', 'Credits'];

export default function HRDetail() {
  const { id } = useParams();
  const hr = getHrById(id || '');
  const [tab, setTab] = useState(TABS[0]);
  if (!hr) return <EmptyState label="HR not found" />;

  const company = getCompanyById(hr.companyId);
  const hrJobs = jobs.filter((j) => j.companyId === hr.companyId);
  const campusAccessPackage = getCampusAccessPackage();

  return (
    <div>
      <Link to="/users" className="text-xs text-gray-500 hover:text-gray-700">← Back to Users</Link>
      <div className="flex items-center gap-4 mt-3 mb-5">
        <Avatar name={hr.name} />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">{hr.name}</h1>
            <Badge tone={statusTone(hr.status)}>{hr.status}</Badge>
          </div>
          <p className="text-sm text-gray-500">{hr.email} · {hr.phone}</p>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-5">
        {tab === 'Overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <StatTile label="Total Jobs" value={hr.jobsCount} />
              <StatTile label="Total Candidates" value={hr.totalCandidates} />
              <StatTile label="Interviews Conducted" value={hr.interviewsConducted} />
            </div>
            <Card className="p-4">
              <SectionTitle>Personal Information</SectionTitle>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Name</dt><dd className="font-medium text-gray-800">{hr.name}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd className="font-medium text-gray-800">{hr.email}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Phone</dt><dd className="font-medium text-gray-800">{hr.phone}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Company</dt><dd className="font-medium text-gray-800">{hr.companyName}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Timezone</dt><dd className="font-medium text-gray-800">{hr.timezone}</dd></div>
              </dl>
            </Card>
            <Card className="p-4">
              <SectionTitle>Account Information</SectionTitle>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Member since</dt><dd className="font-medium text-gray-800">{hr.memberSince}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Last updated</dt><dd className="font-medium text-gray-800">{hr.lastUpdated}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">WhatsApp enabled</dt><dd className="font-medium text-gray-800">{hr.whatsappEnabled ? 'Yes' : 'No'}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">Country code</dt><dd className="font-medium text-gray-800">{hr.countryCode}</dd></div>
              </dl>
            </Card>
          </div>
        )}

        {tab === 'Company' && company && (
          <div className="space-y-4">
            <Card className="p-4">
              <SectionTitle action={<Link to={`/companies/${company.id}`} className="text-xs text-purple-600">View Company →</Link>}>
                Company
              </SectionTitle>
              <div className="flex items-center gap-3">
                <img src={company.logo} className="w-10 h-10 rounded-md" />
                <div>
                  <p className="font-medium text-gray-800">{company.name}</p>
                  <p className="text-xs text-gray-500">{company.industry}</p>
                </div>
              </div>
              <dl className="grid grid-cols-4 gap-3 text-sm mt-4">
                <div><dt className="text-gray-500">Location</dt><dd className="font-medium text-gray-800">{company.locations[0]}</dd></div>
                <div><dt className="text-gray-500">Company size</dt><dd className="font-medium text-gray-800">{company.employeeCount}</dd></div>
                <div><dt className="text-gray-500">Founded</dt><dd className="font-medium text-gray-800">{company.foundedYear}</dd></div>
                <div><dt className="text-gray-500">Active jobs</dt><dd className="font-medium text-gray-800">{company.activeJobs}</dd></div>
                <div><dt className="text-gray-500">Total applications</dt><dd className="font-medium text-gray-800">{company.totalApplications}</dd></div>
              </dl>
            </Card>
            <Card className="p-4">
              <SectionTitle>Campus Access</SectionTitle>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-600">Company's campus access status:</span>
                <Badge tone={statusTone(company.campusAccessStatus)}>{company.campusAccessStatus}</Badge>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-sm text-gray-600 mb-2">Campus Access Grant (this HR's individual override)</p>
                <div className="flex items-center gap-3">
                  <Badge tone={hr.campusAccessGrant.state === 'Active' ? 'green' : hr.campusAccessGrant.state === 'Off' ? 'gray' : 'yellow'}>
                    {hr.campusAccessGrant.state}
                  </Badge>
                  {hr.campusAccessGrant.activeUntil && <span className="text-xs text-gray-500">until {hr.campusAccessGrant.activeUntil}</span>}
                </div>
                {hr.campusAccessGrant.reason && <p className="text-xs text-gray-500 mt-2">Reason: {hr.campusAccessGrant.reason}</p>}
                <div className="flex gap-2 mt-3">
                  <Button size="sm">Grant</Button>
                  <Button size="sm" variant="secondary">Revoke</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {tab === 'Jobs' && (
          <Card className="p-4">
            {hrJobs.length === 0 ? <EmptyState label="No jobs" /> : (
              <Table headers={['Job title', 'Role', 'Type', 'Status', 'Candidates', 'Slots', 'Created', '']}>
                {hrJobs.map((j) => (
                  <tr key={j.id}>
                    <td className="py-2 px-3 font-medium text-gray-800">{j.title}</td>
                    <td className="py-2 px-3 text-gray-600">{j.role}</td>
                    <td className="py-2 px-3 text-gray-600">{j.type}</td>
                    <td className="py-2 px-3"><Badge tone={statusTone(j.status)}>{j.status}</Badge></td>
                    <td className="py-2 px-3 text-gray-600">{j.candidatesCount}</td>
                    <td className="py-2 px-3 text-gray-600">{j.slots}</td>
                    <td className="py-2 px-3 text-gray-600">{j.createdOn}</td>
                    <td className="py-2 px-3"><Link to={`/jobs/${j.id}`} className="text-purple-600 text-xs">View Details</Link></td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        )}

        {tab === 'Interview Notes' && <Card className="p-4"><EmptyState label="No interview notes recorded yet" /></Card>}
        {tab === 'Activity Log' && <Card className="p-4"><EmptyState label="No activity recorded yet" /></Card>}

        {tab === 'Credits' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button>+ Add credits</Button>
              <Button variant="secondary">− Deduct credits</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatTile label="Current balance" value={hr.creditBalance} />
              <StatTile label="Total earned" value={hr.creditBalance + 55} />
              <StatTile label="Total spent" value={5} />
            </div>
            <Card className="p-4">
              <SectionTitle>Recent Credit Transactions</SectionTitle>
              <Table headers={['When', 'Type', 'Amount', 'Balance after', 'Description']}>
                {[
                  { when: hr.lastUpdated, type: 'debit', amount: -5, balance: hr.creditBalance, desc: `Job post: ${hrJobs[0]?.title ?? 'Job posting'}` },
                  { when: hr.memberSince, type: 'bonus', amount: 50, balance: hr.creditBalance + 5, desc: 'Welcome bonus credits' },
                ].map((tx, i) => (
                  <tr key={i}>
                    <td className="py-2 px-3 text-gray-600">{tx.when}</td>
                    <td className="py-2 px-3"><Badge tone={tx.amount >= 0 ? 'green' : 'red'}>{tx.type}</Badge></td>
                    <td className={`py-2 px-3 font-medium ${tx.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{tx.amount >= 0 ? '+' : ''}{tx.amount}</td>
                    <td className="py-2 px-3 text-gray-600">{tx.balance}</td>
                    <td className="py-2 px-3 text-gray-600">{tx.desc}</td>
                  </tr>
                ))}
              </Table>
            </Card>

            <Card className="p-4">
              <SectionTitle action={<Button size="sm">+ Assign plan</Button>}>Agency Plan</SectionTitle>
              {hr.agency === 'None' ? (
                <p className="text-sm text-gray-500">No agency plan. Assign one to unlock shared credit pooling.</p>
              ) : (
                <p className="text-sm text-gray-700">This HR is a <span className="font-medium">{hr.agency}</span>.</p>
              )}
            </Card>

            <Card className="p-4">
              <SectionTitle>Campus Access (admin override)</SectionTitle>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500">Status:</span>
                {hr.campusAccessGrant.state === 'Active' ? (
                  <Badge tone="green">Active until {hr.campusAccessGrant.activeUntil}</Badge>
                ) : (
                  <>
                    <Badge>{hr.campusAccessGrant.state === 'Off' ? 'Off' : 'Not company-approved'}</Badge>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Comp toggle bypasses the {campusAccessPackage.credits}-credit "{campusAccessPackage.name}" package charge. Use for support, trials, or partner accounts. Every action requires a reason and is recorded in the activity log.
              </p>
              {hr.campusAccessGrant.state === 'Active' ? (
                <Button variant="danger">Revoke access</Button>
              ) : (
                <Button>Grant comp access ({campusAccessPackage.periodDays} days)</Button>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
