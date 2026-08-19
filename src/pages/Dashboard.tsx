import { useState } from 'react';
import { Link } from 'react-router-dom';
import { students } from '../data/students';
import { tpos } from '../data/tpos';
import { hrs } from '../data/hrs';
import { companies } from '../data/companies';
import { colleges } from '../data/colleges';
import { jobs, collegeJobs } from '../data/jobs';
import {
  RANGE_OPTIONS,
  rangeToDays,
  getGrowthStripMetrics,
  getActivityBreakdown,
  getNeedsAttention,
  getFunnelData,
  getRevenueCredits,
  getAgencyStats,
  getTopPerformers,
  getTrendsAnalytics,
  getRecentActivity,
  getPlatformStatus,
  type RangeOption,
  type FunnelScope,
} from '../data/dashboardMetrics';
import { Card, SectionTitle, Badge } from '../components/ui';

export default function Dashboard() {
  const [range, setRange] = useState<RangeOption>('30 Days');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [funnelScope, setFunnelScope] = useState<FunnelScope>('All');
  const [activityOpen, setActivityOpen] = useState(false);

  const customDays = customFrom && customTo ? Math.max(1, Math.round((new Date(customTo).getTime() - new Date(customFrom).getTime()) / 86400000)) : 30;
  const days = rangeToDays(range, customDays);

  const growth = getGrowthStripMetrics(days);
  const activityRows = getActivityBreakdown();
  const attention = getNeedsAttention();
  const funnel = getFunnelData(days, funnelScope);
  const revenue = getRevenueCredits(days);
  const agencies = getAgencyStats(days);
  const performers = getTopPerformers();
  const trends = getTrendsAnalytics();
  const activity = getRecentActivity(8);
  const platformStatus = getPlatformStatus();

  const totalJobs = jobs.length + collegeJobs.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white border border-gray-200 rounded-md p-1">
            {RANGE_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${range === r ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {r}
              </button>
            ))}
          </div>
          {range === 'Custom' && (
            <div className="flex items-center gap-1.5">
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="text-xs border border-gray-200 rounded-md px-2 py-1.5" />
              <span className="text-xs text-gray-400">to</span>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="text-xs border border-gray-200 rounded-md px-2 py-1.5" />
            </div>
          )}
        </div>
      </div>

      {/* 2. Platform Totals — all-time, not affected by the range selector */}
      <SectionTitle>Platform Totals</SectionTitle>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <TotalCard label="Students" value={students.length} to="/users?tab=Students" />
        <TotalCard label="Colleges" value={colleges.length} to="/colleges" />
        <TotalCard label="TPOs" value={tpos.length} to="/users?tab=TPOs" />
        <TotalCard label="HRs" value={hrs.length} to="/users?tab=HRs" />
        <TotalCard label="Companies" value={companies.length} to="/companies" />
        <TotalCard label="Candidates" value={students.filter((s) => s.status === 'Registered').length} to="/users?tab=Students" />
        <TotalCard label="Jobs" value={totalJobs} to="/jobs" hint={`${jobs.length} platform · ${collegeJobs.length} college`} />
        <TotalCard label="Resumes" value={students.length + 6} to="/users?tab=Students" />
      </div>

      {/* 3. Growth strip + Activity breakdown */}
      <SectionTitle>Growth ({range === 'Custom' ? `${customDays}d custom` : range})</SectionTitle>
      <div className="grid grid-cols-3 gap-4 mb-3">
        <GrowthCard label="New Signups" m={growth.newSignups} sub={`Students ${growth.newSignups.breakdown.students} · TPOs ${growth.newSignups.breakdown.tpos} · HRs ${growth.newSignups.breakdown.hrs}`} />
        <GrowthCard label="New Jobs" m={growth.newJobs} />
        <GrowthCard label="New Companies" m={growth.newCompanies} />
        <GrowthCard label="New Candidates" m={growth.newCandidates} />
        <GrowthCard label="Interviews Booked" m={growth.interviewsBooked} />
        <GrowthCard label="Offers Made" m={growth.offersMade} />
      </div>

      <Card className="p-4 mb-6">
        <button onClick={() => setActivityOpen((v) => !v)} className="flex items-center justify-between w-full text-sm font-semibold text-gray-800">
          <span>Activity Breakdown <span className="text-xs font-normal text-gray-400">(always shows 24h / 7 Days / All Time, regardless of the range above)</span></span>
          <span className="text-gray-400">{activityOpen ? '▲' : '▼'}</span>
        </button>
        {activityOpen && (
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="py-2 font-medium">Metric</th>
                <th className="py-2 font-medium text-right">Last 24 Hours</th>
                <th className="py-2 font-medium text-right">Last 7 Days</th>
                <th className="py-2 font-medium text-right">All Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activityRows.map((row) => (
                <tr key={row.label}>
                  <td className="py-2 text-gray-800">{row.label}</td>
                  <td className="py-2 text-right text-gray-600">{row.last24h.toLocaleString()}</td>
                  <td className="py-2 text-right text-gray-600">{row.last7d.toLocaleString()}</td>
                  <td className="py-2 text-right text-gray-600">{row.allTime.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* 4. Needs Your Attention */}
      <Card className="p-4 mb-6">
        <SectionTitle>Needs Your Attention</SectionTitle>
        <div className="grid grid-cols-5 gap-3">
          <AttentionItem label="Pending Students" value={attention.pendingStudents} to="/users?tab=Students&status=Pending" />
          <AttentionItem label="Pending TPOs" value={attention.pendingTpos} to="/users?tab=TPOs&status=Pending" />
          <AttentionItem label="Pending HRs" value={attention.pendingHrs} to="/users?tab=HRs" />
          <AttentionItem label="Platform Access Requests" value={attention.platformAccessRequests} to="/companies" />
          <AttentionItem label="Campus Access Requests" value={attention.campusAccessRequests} to="/companies" />
        </div>
      </Card>

      {/* 5. Hiring Pipeline Funnel */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>Hiring Pipeline Funnel</SectionTitle>
          <div className="flex gap-1 bg-gray-50 border border-gray-200 rounded-md p-1">
            {(['All', 'Platform-sourced', 'Campus-sourced'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFunnelScope(s)}
                className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${funnelScope === s ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-2">
            {funnel.stages.map((s, i) => (
              <div key={s.name}>
                <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                  <span>{s.name}</span>
                  <span>{s.count.toLocaleString()} {i > 0 && <span className="text-gray-400">· {s.conversionFromPrev}% from prev</span>}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${funnel.stages[0].count > 0 ? (s.count / funnel.stages[0].count) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Velocity (avg days)</p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">To Shortlist</dt><dd className="font-medium text-gray-800">{funnel.velocity.toShortlist}d</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">To Interview</dt><dd className="font-medium text-gray-800">{funnel.velocity.toInterview}d</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">To Offer</dt><dd className="font-medium text-gray-800">{funnel.velocity.toOffer}d</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">To Hire</dt><dd className="font-medium text-gray-800">{funnel.velocity.toHire}d</dd></div>
            </dl>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* 6. Revenue & Credits */}
        <Card className="p-4 col-span-2">
          <SectionTitle>Revenue & Credits</SectionTitle>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div><p className="text-xs text-gray-500">Revenue</p><p className="text-lg font-semibold text-gray-900">₹{(revenue.revenueTotal / 100000).toFixed(1)}L</p><p className="text-xs text-emerald-600">+{revenue.revenueDeltaPct}% · {revenue.paidOrders} orders</p></div>
            <div><p className="text-xs text-gray-500">Credits sold</p><p className="text-lg font-semibold text-gray-900">{revenue.creditsSold.toLocaleString()}</p></div>
            <div><p className="text-xs text-gray-500">Credits spent</p><p className="text-lg font-semibold text-gray-900">{revenue.creditsSpent.toLocaleString()}</p></div>
            <div><p className="text-xs text-gray-500">Net change</p><p className={`text-lg font-semibold ${revenue.netChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{revenue.netChange >= 0 ? '+' : ''}{revenue.netChange.toLocaleString()}</p></div>
          </div>
          <div className="flex items-end gap-0.5 h-20 mb-4">
            {revenue.dailySeries.map((d) => {
              const max = Math.max(...revenue.dailySeries.map((x) => x.value));
              return <div key={d.day} title={`Day ${d.day}: ₹${d.value.toLocaleString()}`} className="flex-1 bg-purple-400 rounded-t hover:bg-purple-600 transition-colors" style={{ height: `${(d.value / max) * 100}%` }} />;
            })}
          </div>
          <p className="text-xs font-semibold text-gray-500 mb-2">Top Spenders</p>
          <div className="space-y-1.5">
            {revenue.topSpenders.map((s) => (
              <div key={s.name} className="flex justify-between text-sm">
                <span className="text-gray-700">{s.name} <span className="text-gray-400 text-xs">· {s.company}</span></span>
                <span className="font-medium text-gray-800">{s.amount.toLocaleString()} cr</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 7. Agencies — standalone widget */}
        <Card className="p-4">
          <SectionTitle>Agencies</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-xs text-gray-500">Active subscriptions</p><p className="text-xl font-semibold text-gray-900">{agencies.activeSubscriptions}</p></div>
            <div><p className="text-xs text-gray-500">Pool members (active)</p><p className="text-xl font-semibold text-gray-900">{agencies.poolMembersActive}</p></div>
            <div><p className="text-xs text-gray-500">Monthly credits granted</p><p className="text-xl font-semibold text-gray-900">{agencies.monthlyCreditsGranted.toLocaleString()}</p></div>
            <div><p className="text-xs text-gray-500">Agency revenue</p><p className="text-xl font-semibold text-gray-900">₹{(agencies.agencyRevenue / 1000).toFixed(1)}k</p></div>
          </div>
        </Card>
      </div>

      {/* 8. Top Performers */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <SectionTitle>Top Colleges</SectionTitle>
          <ul className="text-sm space-y-2">
            {performers.topColleges.map((c) => (
              <li key={c.id} className="flex justify-between"><Link to={`/colleges/${c.id}`} className="text-gray-700 hover:text-purple-600">{c.name}</Link><span className="text-gray-500">{c.placementRate}%</span></li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <SectionTitle>Top Companies</SectionTitle>
          <ul className="text-sm space-y-2">
            {performers.topCompanies.map((c) => (
              <li key={c.id} className="flex justify-between"><Link to={`/companies/${c.id}`} className="text-gray-700 hover:text-purple-600">{c.name}</Link><span className="text-gray-500">{c.totalApplications} hired</span></li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <SectionTitle>Top Placements</SectionTitle>
          <ul className="text-sm space-y-2">
            {performers.topPlacements.map((p) => (
              <li key={p.student.id} className="flex justify-between"><span className="text-gray-700">{p.student.name} <span className="text-gray-400 text-xs">· {p.company.name}</span></span><span className="text-gray-500">{p.package}</span></li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 9. Trends & Analytics */}
      <Card className="p-4 mb-6">
        <SectionTitle>Trends & Analytics</SectionTitle>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-xs text-gray-500">Placements Growth</p>
            <p className="text-lg font-semibold text-emerald-600">+{trends.placementsGrowthPct}%</p>
            <p className="text-xs text-gray-400">Peak: {trends.peakPlacementMonth}</p>
          </div>
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-xs text-gray-500">Jobs Growth</p>
            <p className="text-lg font-semibold text-emerald-600">+{trends.jobsGrowthPct}%</p>
            <p className="text-xs text-gray-400">Peak: {trends.peakJobMonth}</p>
          </div>
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-xs text-gray-500">Registrations Growth</p>
            <p className="text-lg font-semibold text-emerald-600">+{trends.registrationsGrowthPct}%</p>
            <p className="text-xs text-gray-400">Peak: {trends.peakRegistrationMonth}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Placement Trends</p>
            <div className="flex items-end gap-1 h-24">
              {trends.placementTrends.map((m) => {
                const max = Math.max(...trends.placementTrends.map((x) => x.value));
                return <div key={m.month} title={`${m.month}: ${m.value}`} className="flex-1 bg-emerald-400 rounded-t hover:bg-emerald-600" style={{ height: `${(m.value / max) * 100}%` }} />;
              })}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>{trends.placementTrends[0].month}</span>
              <span>{trends.placementTrends[trends.placementTrends.length - 1].month}</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Job Trends</p>
            <div className="flex items-end gap-1 h-24">
              {trends.jobTrends.map((m) => {
                const max = Math.max(...trends.jobTrends.map((x) => x.value));
                return <div key={m.month} title={`${m.month}: ${m.value}`} className="flex-1 bg-blue-400 rounded-t hover:bg-blue-600" style={{ height: `${(m.value / max) * 100}%` }} />;
              })}
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>{trends.jobTrends[0].month}</span>
              <span>{trends.jobTrends[trends.jobTrends.length - 1].month}</span>
            </div>
          </div>
        </div>

        <p className="text-xs font-semibold text-gray-500 mb-2">Registration Trends</p>
        <div className="grid grid-cols-4 gap-2">
          {trends.registrationTrends.map((m) => (
            <div key={m.label} className="border border-gray-100 rounded-md p-2.5">
              <p className="text-xs font-medium text-gray-700 mb-1">{m.label}</p>
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>Stu {m.students}</span>
                <span>TPO {m.tpos}</span>
                <span>HR {m.hrs}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* 10. Recent Activity — single shared feed */}
        <Card className="p-4">
          <SectionTitle>Recent Activity</SectionTitle>
          <ul className="text-sm space-y-2.5">
            {activity.map((a) => (
              <li key={a.id} className="flex justify-between gap-3">
                <span className="text-gray-600">{a.text}</span>
                <span className="text-gray-400 text-xs whitespace-nowrap">{a.when}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* 11. Platform Status — single shared widget */}
        <Card className="p-4">
          <SectionTitle>Platform Status</SectionTitle>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><p className="text-xs text-gray-500">Active Users</p><p className="text-xl font-semibold text-gray-900">{platformStatus.activeUsers}</p></div>
            <div><p className="text-xs text-gray-500">Disabled Users</p><p className="text-xl font-semibold text-gray-900">{platformStatus.disabledUsers}</p></div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-emerald-700 font-medium">{platformStatus.operational ? 'All systems operational' : 'Degraded performance'}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function TotalCard({ label, value, to, hint }: { label: string; value: number; to: string; hint?: string }) {
  return (
    <Link to={to} className="block">
      <Card className="p-4 hover:border-purple-300 transition-colors">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-900 mt-1">{value.toLocaleString()}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </Card>
    </Link>
  );
}

function GrowthCard({ label, m, sub }: { label: string; m: { value: number; deltaPct: number }; sub?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-semibold mt-1">
        {m.value.toLocaleString()} <span className={`text-xs font-normal ${m.deltaPct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{m.deltaPct >= 0 ? '+' : ''}{m.deltaPct}%</span>
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </Card>
  );
}

function AttentionItem({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link to={to} className="block border border-gray-100 rounded-md p-3 hover:border-purple-300 transition-colors">
      <p className="text-xs text-gray-500 mb-1.5">{label}</p>
      <Badge tone={value > 0 ? 'yellow' : 'gray'}>{value}</Badge>
    </Link>
  );
}
