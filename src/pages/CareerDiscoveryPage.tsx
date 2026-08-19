import { useState } from 'react';
import { Compass, Pencil, Trash2 } from 'lucide-react';
import { careerQuestions, getGroups } from '../data/careerQuestions';
import { Badge, Card, Button, Toggle, EmptyState } from '../components/ui';

export default function CareerDiscoveryPage() {
  const [phase, setPhase] = useState<1 | 2>(1);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('All');
  const [questions, setQuestions] = useState(careerQuestions);

  const groups = getGroups(phase);
  const groupLabel = phase === 1 ? 'dimensions' : 'tracks';

  const rows = questions
    .filter((q) => q.phase === phase)
    .filter((q) => (q.question + q.group).toLowerCase().includes(search.toLowerCase()))
    .filter((q) => groupFilter === 'All' || q.group === groupFilter);

  function toggleActive(id: string) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, active: !q.active } : q)));
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass size={22} className="text-gray-800" />
            <h1 className="text-lg font-semibold text-gray-900">Career Discovery Questions</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage scenario prompts for Phase 1 (personality) and Phase 2 (track deep-dive).</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex bg-blue-50 rounded-md p-1">
          {([1, 2] as const).map((p) => (
            <button
              key={p}
              onClick={() => { setPhase(p); setGroupFilter('All'); }}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${phase === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              {p === 1 ? 'Phase 1 — Personality' : 'Phase 2 — Track Drill-down'}
            </button>
          ))}
        </div>
        <Button>+ New {phase === 2 ? 'Phase 2 ' : ''}Question</Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={phase === 1 ? 'Search prompts or dimensions...' : 'Search Phase 2 prompts...'}
            className="flex-1 min-w-[240px] text-sm border border-gray-200 rounded-md px-3 py-2 bg-white"
          />
          <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
            <option>All {groupLabel}</option>
            {groups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {rows.length === 0 ? <EmptyState label="No questions match" /> : (
          <div className="space-y-4">
            {rows.map((q, i) => (
              <Card key={q.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge>#{i + 1}</Badge>
                    <Badge tone="blue">{q.group}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Toggle checked={q.active} onChange={() => toggleActive(q.id)} />
                    <button className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => removeQuestion(q.id)} className="p-1.5 rounded-md border border-gray-200 text-rose-500 hover:bg-rose-50">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-base font-semibold text-gray-900 mb-3">{q.question}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-md p-3">
                    <p className="text-xs text-gray-500 mb-1">Option A</p>
                    <p className="text-sm text-gray-800">{q.optionA}</p>
                  </div>
                  <div className="bg-purple-50 rounded-md p-3">
                    <p className="text-xs text-gray-500 mb-1">Option B</p>
                    <p className="text-sm text-gray-800">{q.optionB}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
