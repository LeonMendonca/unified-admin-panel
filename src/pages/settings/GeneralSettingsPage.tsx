import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { getApolloUsageSummary } from '../../data/apollo';
import { Card, SectionTitle, Toggle } from '../../components/ui';

export default function GeneralSettingsPage() {
  const [dailyReport, setDailyReport] = useState(false);
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');

  const usage = getApolloUsageSummary(range);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <SettingsIcon size={20} className="text-gray-800" />
        <h1 className="text-lg font-semibold text-gray-900">General Settings</h1>
      </div>
      <p className="text-sm text-gray-500 mb-5">Platform-wide settings unrelated to credits — configured once, not per legacy panel.</p>

      <Card className="p-5 mb-4">
        <SectionTitle>Email Notifications</SectionTitle>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-800">Daily Activity Report</p>
            <p className="text-xs text-gray-500 mt-1">Receive a daily email with platform activity summary (sent at 8 AM IST).</p>
          </div>
          <Toggle checked={dailyReport} onChange={setDailyReport} />
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <SectionTitle>Apollo Usage</SectionTitle>
          <div className="flex gap-1 bg-gray-50 border border-gray-200 rounded-md p-1">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-xs rounded ${range === r ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-4">Every Apollo call is logged. Apollo bills per record returned, so billed records is the number that matters.</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-md p-3"><p className="text-xs text-gray-500">Calls logged</p><p className="text-xl font-semibold text-gray-900">{usage.callsLogged.toLocaleString()}</p></div>
          <div className="bg-gray-50 rounded-md p-3"><p className="text-xs text-gray-500">Billed records</p><p className="text-xl font-semibold text-gray-900">{usage.billedRecords.toLocaleString()}</p></div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Single shared log — every Apollo call, from any surface (e.g. a company's "Enrich from Apollo" action), writes here.</p>
      </Card>
    </div>
  );
}
