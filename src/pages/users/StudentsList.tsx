import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { students } from '../../data/students';
import { Table, Button } from '../../components/ui';
import StatusTabs from '../../components/StatusTabs';
import RowActionsMenu from '../../components/RowActionsMenu';
import type { Student, Status } from '../../data/types';

const VALID_STATUSES = ['Registered', 'Pending', 'Disabled'] as const;

export default function StudentsList({
  onAddStudent,
  onEditStudent,
}: {
  onAddStudent: () => void;
  onEditStudent: (s: Student) => void;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');
  const initialStatus = (VALID_STATUSES as readonly string[]).includes(statusParam ?? '') ? (statusParam as typeof VALID_STATUSES[number]) : 'Registered';
  const [statusTab, setStatusTab] = useState<'Registered' | 'Pending' | 'Disabled'>(initialStatus);
  const [search, setSearch] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('All colleges');
  const [testFilter, setTestFilter] = useState('Test status');
  const [overrides, setOverrides] = useState<Partial<Record<string, Status>>>({});

  const colleges = useMemo(() => Array.from(new Set(students.map((s) => s.collegeName || 'No college assigned'))), []);

  const withEffectiveStatus = students.map((s) => ({ ...s, status: overrides[s.id] ?? s.status }));

  const counts = {
    Registered: withEffectiveStatus.filter((s) => s.status === 'Registered').length,
    Pending: withEffectiveStatus.filter((s) => s.status === 'Pending').length,
    Disabled: withEffectiveStatus.filter((s) => s.status === 'Disabled').length,
  };

  const filtered = withEffectiveStatus
    .filter((s) => s.status === statusTab)
    .filter((s) => (s.name + s.email + s.phone + (s.collegeName ?? '')).toLowerCase().includes(search.toLowerCase()))
    .filter((s) => collegeFilter === 'All colleges' || (s.collegeName || 'No college assigned') === collegeFilter)
    .filter((s) => {
      if (testFilter === 'Has test attempt' && !s.hasTestAttempt) return false;
      if (testFilter === 'No test attempt' && s.hasTestAttempt) return false;
      if (testFilter === 'Has completed test' && !s.hasCompletedTest) return false;
      return true;
    });

  function toggleDisabled(s: Student) {
    setOverrides((prev) => ({ ...prev, [s.id]: (overrides[s.id] ?? s.status) === 'Disabled' ? 'Registered' : 'Disabled' }));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <StatusTabs active={statusTab} onChange={setStatusTab} counts={counts} />
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary">Import CSV</Button>
          <Button variant="secondary">Export CSV</Button>
          <Button onClick={onAddStudent}>+ Add Student</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 my-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, or college..."
          className="flex-1 min-w-[240px] text-sm border border-gray-200 rounded-md px-3 py-2 bg-white"
        />
        <select value={collegeFilter} onChange={(e) => setCollegeFilter(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
          <option>All colleges</option>
          {colleges.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={testFilter} onChange={(e) => setTestFilter(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
          <option>Test status</option>
          <option>Has test attempt</option>
          <option>No test attempt</option>
          <option>Has completed test</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} students</span>
      </div>
      <Table headers={['Student', 'College', 'Email', 'Registered on', '']}>
        {filtered.map((s) => (
          <tr key={s.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/users/students/${s.id}`)}>
            <td className="py-2.5 px-3 font-medium text-gray-800">{s.name}</td>
            <td className="py-2.5 px-3 text-gray-600">{s.collegeName || 'No college assigned'}</td>
            <td className="py-2.5 px-3 text-gray-600">{s.email}</td>
            <td className="py-2.5 px-3 text-gray-600">{s.registeredOn}</td>
            <td className="py-2.5 px-3 text-right">
              <RowActionsMenu
                onEdit={() => onEditStudent(s)}
                onToggleDisabled={() => toggleDisabled(s)}
                disabled={s.status === 'Disabled'}
              />
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
