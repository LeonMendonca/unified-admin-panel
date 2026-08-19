import { useEffect, useRef, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { platformTests } from '../data/platformTests';
import type { PlatformTest } from '../data/platformTests';
import { Badge, Card, Button } from '../components/ui';

export default function TestsPage() {
  const [tests, setTests] = useState(platformTests);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  function toggleStatus(id: string) {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' } : t)));
  }

  function removeTest(id: string) {
    setTests((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-900">Tests</h1>
        <div className="relative" ref={menuRef}>
          <Button onClick={() => setMenuOpen((v) => !v)}>+ Create Test</Button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1 text-sm">
              <button onClick={() => setMenuOpen(false)} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700">
                📄 Personality Test
              </button>
              <button onClick={() => setMenuOpen(false)} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-gray-700">
                📄 General Test
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {tests.map((t) => (
          <TestCard key={t.id} test={t} onToggleStatus={() => toggleStatus(t.id)} onDelete={() => removeTest(t.id)} />
        ))}
      </div>
    </div>
  );
}

function TestCard({ test, onToggleStatus, onDelete }: { test: PlatformTest; onToggleStatus: () => void; onDelete: () => void }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-bold text-purple-700">{test.name}</h2>
          <Badge tone={test.status === 'Active' ? 'green' : 'gray'}>{test.status}</Badge>
          <Badge tone="blue">{test.type}</Badge>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={onToggleStatus} className="p-2 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50">
            <Pencil size={15} />
          </button>
          <button onClick={onDelete} className="p-2 rounded-md border border-gray-200 text-rose-500 hover:bg-rose-50">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{test.description}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
        <span>⏱ {test.durationMins} minutes</span>
        <span>📄 Max {test.maxQuestions} questions</span>
        <span>👥 Created {new Date(test.createdOn).toLocaleDateString('en-GB')}</span>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant={test.status === 'Active' ? 'primary' : 'secondary'} onClick={onToggleStatus}>
          {test.status === 'Active' ? 'Deactivate' : 'Activate'}
        </Button>
        <Button variant="secondary">Preview Test</Button>
      </div>
    </Card>
  );
}
