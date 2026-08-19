import { useState, type ReactNode } from 'react';
import { RefreshCw, Users, Database, ShieldAlert, AlertTriangle } from 'lucide-react';
import {
  apolloStats,
  endpointUsage,
  clampedRequests30d,
  clampedPerPageRequested,
  failedCalls30d,
  perUserDailyLimits,
  apolloTopUsers,
  apolloTopColleges,
  apolloRecentCalls,
} from '../data/apollo';
import { Badge, Card, SectionTitle, Table, Button } from '../components/ui';

export default function ApolloUsagePage() {
  const [limits, setLimits] = useState(perUserDailyLimits);
  const [tab, setTab] = useState<'Top users' | 'Top colleges' | 'Recent calls'>('Top users');

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Apollo Usage</h1>
          <p className="text-sm text-gray-500">Monitor Apollo proxy calls (search, HR contacts, TPO outreach) and tighten per-user daily limits.</p>
        </div>
        <Button variant="secondary">
          <span className="inline-flex items-center gap-1.5"><RefreshCw size={14} /> Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatTile label="Calls today" value={apolloStats.callsToday} />
        <StatTile label="Calls 7d" value={apolloStats.calls7d} />
        <StatTile label="Calls 30d" value={apolloStats.calls30d} />
        <StatTile label="Unique users today" value={apolloStats.uniqueUsersToday} icon={<Users size={15} className="text-gray-400" />} />
        <StatTile label="Est. units today" value={apolloStats.estUnitsToday} icon={<Database size={15} className="text-gray-400" />} />
        <StatTile label="Cache hit (today)" value={`${apolloStats.cacheHitToday}%`} />
        <StatTile label="Clamped today" value={apolloStats.clampedToday} icon={<ShieldAlert size={15} className="text-gray-400" />} />
      </div>

      <Card className="p-5 mb-4">
        <SectionTitle>Calls by endpoint (30d)</SectionTitle>
        <div className="space-y-4">
          {endpointUsage.map((e) => (
            <div key={e.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-800">{e.name}</span>
                <span className="text-gray-500">{e.calls} ({e.percent}%)</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2">
                <div className="bg-gray-900 h-2 rounded-full" style={{ width: `${e.percent}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex items-center gap-2 text-amber-800 font-medium text-sm">
            <ShieldAlert size={16} /> {clampedRequests30d} over-budget requests were clamped (30d)
          </div>
          <p className="text-xs text-amber-700 mt-1">
            A request is clamped when it asks for more than one Apollo page, a larger page size than allowed, or enrichment. It is scaled down and still served.
          </p>
          <Badge tone="yellow">per page requested: {clampedPerPageRequested}</Badge>
        </div>

        <div className="flex items-center gap-2 text-amber-700 text-sm mt-3">
          <AlertTriangle size={15} /> {failedCalls30d} failed calls in last 30 days
        </div>
      </Card>

      <Card className="p-5 mb-4">
        <SectionTitle>Per-user daily limits</SectionTitle>
        <p className="text-xs text-gray-500 mb-3">Counts only successful, non-cached calls. Edit and save to apply immediately (no deploy needed).</p>
        <div className="grid grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500">Search (per day)</label>
            <input
              type="number"
              value={limits.search}
              onChange={(e) => setLimits({ ...limits, search: Number(e.target.value) })}
              className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">HR Contacts (per day)</label>
            <input
              type="number"
              value={limits.hrContacts}
              onChange={(e) => setLimits({ ...limits, hrContacts: Number(e.target.value) })}
              className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">TPO Outreach (per day)</label>
            <input
              type="number"
              value={limits.tpoOutreach}
              onChange={(e) => setLimits({ ...limits, tpoOutreach: Number(e.target.value) })}
              className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <Button>💾 Save limits</Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex bg-[#e8eef3] p-1 rounded-lg w-fit mb-4">
          <button
            onClick={() => setTab('Top users')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              tab === 'Top users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users size={16} /> Top users
          </button>
          <button
            onClick={() => setTab('Top colleges')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              tab === 'Top colleges' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> Top colleges
          </button>
          <button
            onClick={() => setTab('Recent calls')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              tab === 'Recent calls' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recent calls
          </button>
        </div>
        <div className="mt-4">
          {tab === 'Top users' && (
            <Table headers={['User', 'Type', 'College', 'Search', 'HR', 'Outreach', 'Total calls', 'Units', 'Last call']}>
              {apolloTopUsers.map((u) => (
                <tr key={u.id}>
                  <td className="py-2 px-3">
                    <p className="font-medium text-gray-800">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </td>
                  <td className="py-2 px-3"><Badge>{u.type}</Badge></td>
                  <td className="py-2 px-3 text-gray-600">{u.college ?? '—'}</td>
                  <td className="py-2 px-3 text-gray-600">{u.search}</td>
                  <td className="py-2 px-3 text-gray-600">{u.hr}</td>
                  <td className="py-2 px-3 text-gray-600">{u.outreach}</td>
                  <td className="py-2 px-3 font-medium text-gray-800">{u.totalCalls}</td>
                  <td className="py-2 px-3 text-gray-600">{u.units}</td>
                  <td className="py-2 px-3 text-gray-400 text-xs">{u.lastCall}</td>
                </tr>
              ))}
            </Table>
          )}
          {tab === 'Top colleges' && (
            <Table headers={['College', 'Calls', 'Est. units', 'Last call']}>
              {apolloTopColleges.map((c) => (
                <tr key={c.id}>
                  <td className="py-2 px-3 font-medium text-gray-800">{c.name}</td>
                  <td className="py-2 px-3 text-gray-600">{c.calls}</td>
                  <td className="py-2 px-3 text-gray-600">{c.estUnits}</td>
                  <td className="py-2 px-3 text-gray-400 text-xs">{c.lastCall}</td>
                </tr>
              ))}
            </Table>
          )}
          {tab === 'Recent calls' && <RecentCallsTable />}
        </div>
      </Card>
    </div>
  );
}

function RecentCallsTable() {
  const [range, setRange] = useState('Last 7d');
  const [endpoint, setEndpoint] = useState('All endpoints');
  const [actor, setActor] = useState('All actors');
  const [q, setQ] = useState('');

  const rows = apolloRecentCalls
    .filter((c) => endpoint === 'All endpoints' || c.endpoint === endpoint)
    .filter((c) => actor === 'All actors' || c.userName === actor)
    .filter((c) => (c.companyOrQuery + c.userName).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select value={range} onChange={(e) => setRange(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
          <option>Last 7d</option>
          <option>Last 30d</option>
          <option>Today</option>
        </select>
        <select value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
          <option>All endpoints</option>
          <option>Search</option>
          <option>HR Contacts</option>
          <option>TPO Outreach</option>
        </select>
        <select value={actor} onChange={(e) => setActor(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
          <option>All actors</option>
          {Array.from(new Set(apolloRecentCalls.map((c) => c.userName))).map((n) => <option key={n}>{n}</option>)}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company / query..." className="flex-1 min-w-[200px] text-sm border border-gray-200 rounded-md px-3 py-2 bg-white" />
      </div>
      <Table headers={['When', 'Endpoint', 'User', 'College', 'Company / Query', 'Results', 'Units', 'Status']}>
        {rows.map((c) => (
          <tr key={c.id}>
            <td className="py-2 px-3 text-gray-600 text-xs whitespace-nowrap">{c.when}</td>
            <td className="py-2 px-3"><Badge>{c.endpoint}</Badge></td>
            <td className="py-2 px-3">
              <p className="text-gray-800">{c.userName}</p>
              <p className="text-xs text-gray-400">{c.userEmail}</p>
            </td>
            <td className="py-2 px-3 text-gray-600">{c.college ?? '—'}</td>
            <td className="py-2 px-3 text-gray-600">{c.companyOrQuery}</td>
            <td className="py-2 px-3 text-gray-600">{c.results}</td>
            <td className="py-2 px-3 text-gray-600">{c.units}</td>
            <td className="py-2 px-3">
              <Badge tone={c.status === '200' ? 'green' : c.status === 'error' ? 'red' : 'blue'}>{c.status}</Badge>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function StatTile({ label, value, icon }: { label: string; value: string | number; icon?: ReactNode }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </Card>
  );
}
