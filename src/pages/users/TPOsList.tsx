import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tpos } from '../../data/tpos';
import { Table, Button } from '../../components/ui';
import StatusTabs from '../../components/StatusTabs';
import RowActionsMenu from '../../components/RowActionsMenu';
import type { TPO, Status } from '../../data/types';

const VALID_STATUSES = ['Registered', 'Pending', 'Disabled'] as const;

export default function TPOsList({
  onAddTpo,
  onEditTpo,
}: {
  onAddTpo: () => void;
  onEditTpo: (t: TPO) => void;
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');
  const initialStatus = (VALID_STATUSES as readonly string[]).includes(statusParam ?? '') ? (statusParam as typeof VALID_STATUSES[number]) : 'Registered';
  const [statusTab, setStatusTab] = useState<'Registered' | 'Pending' | 'Disabled'>(initialStatus);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [overrides, setOverrides] = useState<Partial<Record<string, Status>>>({});

  const withEffectiveStatus = tpos.map((t) => ({ ...t, status: overrides[t.id] ?? t.status }));

  const counts = {
    Registered: withEffectiveStatus.filter((t) => t.status === 'Registered').length,
    Pending: withEffectiveStatus.filter((t) => t.status === 'Pending').length,
    Disabled: withEffectiveStatus.filter((t) => t.status === 'Disabled').length,
  };

  const filtered = withEffectiveStatus
    .filter((t) => t.status === statusTab)
    .filter((t) => (t.name + t.collegeName + t.email).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sort === 'newest' ? b.registeredOn.localeCompare(a.registeredOn) : a.registeredOn.localeCompare(b.registeredOn)));

  function toggleDisabled(t: TPO) {
    setOverrides((prev) => ({ ...prev, [t.id]: (overrides[t.id] ?? t.status) === 'Disabled' ? 'Registered' : 'Disabled' }));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <StatusTabs active={statusTab} onChange={setStatusTab} counts={counts} />
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary">Export All TPO</Button>
          <Button onClick={onAddTpo}>+ Add TPO</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 my-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search TPOs..."
          className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white w-56"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white">
          <option value="newest">Registered on (newest)</option>
          <option value="oldest">Registered on (oldest)</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} TPOs</span>
      </div>
      <Table headers={['TPO', 'College', 'City', 'State', 'Email', 'Contact', 'Registered on', '']}>
        {filtered.map((t) => (
          <tr key={t.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/users/tpos/${t.id}`)}>
            <td className="py-2.5 px-3 font-medium text-gray-800">{t.name}</td>
            <td className="py-2.5 px-3 text-gray-600">{t.collegeName}</td>
            <td className="py-2.5 px-3 text-gray-600">{t.city}</td>
            <td className="py-2.5 px-3 text-gray-600">{t.state}</td>
            <td className="py-2.5 px-3 text-gray-600">{t.email}</td>
            <td className="py-2.5 px-3 text-gray-600">{t.contact}</td>
            <td className="py-2.5 px-3 text-gray-600">{t.registeredOn}</td>
            <td className="py-2.5 px-3 text-right">
              <RowActionsMenu
                onEdit={() => onEditTpo(t)}
                onToggleDisabled={() => toggleDisabled(t)}
                disabled={t.status === 'Disabled'}
              />
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
