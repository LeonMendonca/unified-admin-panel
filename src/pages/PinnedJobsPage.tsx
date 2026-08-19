import { useState } from 'react';
import { Pin, RefreshCw, Trash2, X, Search } from 'lucide-react';
import { pinnedJobs as initialPins } from '../data/pinnedJobs';
import type { PinnedJob } from '../data/pinnedJobs';
import { Badge, Card, Button } from '../components/ui';

export default function PinnedJobsPage() {
  const [pins, setPins] = useState<PinnedJob[]>(initialPins);
  const [modalOpen, setModalOpen] = useState(false);

  function extend(id: string, days: number) {
    setPins((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, daysUntilExpiry: p.daysUntilExpiry + days, expiresOn: shiftDate(p.expiresOn, days) }
          : p
      )
    );
  }

  function unpin(id: string) {
    setPins((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Pin size={20} className="text-gray-800" />
            <h1 className="text-lg font-semibold text-gray-900">Pinned Jobs</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Pin a job or job family to the top of public & student job listings. Auto-expires after 7 or 14 days.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ New Pin</Button>
      </div>

      <Card className="p-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">Active Pins ({pins.length})</h2>
        {pins.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No active pins</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {pins.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <img src={p.logo} className="w-10 h-10 rounded-md shrink-0 bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{p.jobTitle}</span>
                      <Badge>{p.pinType}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{p.companyName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">⏱ Expires {formatDate(p.expiresOn)} (in {p.daysUntilExpiry} days)</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                  <button onClick={() => extend(p.id, 7)} className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-md px-2.5 py-1.5 text-gray-700 hover:bg-gray-50">
                    <RefreshCw size={12} /> +7d
                  </button>
                  <button onClick={() => extend(p.id, 14)} className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-md px-2.5 py-1.5 text-gray-700 hover:bg-gray-50">
                    <RefreshCw size={12} /> +14d
                  </button>
                  <button onClick={() => unpin(p.id)} className="flex items-center gap-1.5 text-xs text-rose-600 px-2.5 py-1.5 hover:bg-rose-50 rounded-md">
                    <Trash2 size={12} /> Unpin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {modalOpen && <PinModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

function shiftDate(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function PinModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'Job Family' | 'Single Job'>('Job Family');
  const [duration, setDuration] = useState<7 | 14>(7);
  const [search, setSearch] = useState('');
  const [note, setNote] = useState('');

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Pin a job or family</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="flex bg-blue-50 rounded-md p-1 mb-4">
          {(['Job Family', 'Single Job'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-md text-sm font-semibold ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <label className="text-sm font-medium text-gray-700">Search</label>
        <div className="relative mt-1 mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === 'Job Family' ? 'Search families by title or company...' : 'Search jobs by title or company...'}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm"
          />
        </div>

        <label className="text-sm font-medium text-gray-700">Duration</label>
        <div className="flex gap-4 mt-1 mb-4">
          {([7, 14] as const).map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm text-gray-700">
              <input type="radio" name="duration" checked={duration === d} onChange={() => setDuration(d)} />
              {d} days
            </label>
          ))}
        </div>

        <label className="text-sm font-medium text-gray-700">Internal note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Why is this pinned?"
          rows={3}
          className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
        />

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={onClose}>✕ Cancel</Button>
          <Button onClick={onClose}>📌 Create pin</Button>
        </div>
      </div>
    </div>
  );
}
