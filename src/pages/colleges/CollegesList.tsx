import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colleges } from '../../data/colleges';
import { tpos } from '../../data/tpos';
import { Badge, Button, Table } from '../../components/ui';
import AddCollegeModal from './AddCollegeModal';

type SortKey = 'name' | 'students' | 'tpos' | 'lastUpdated';

export default function CollegesList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('lastUpdated');
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const tpoCountByCollege = useMemo(() => {
    const map: Record<string, number> = {};
    tpos.forEach((t) => { map[t.collegeId] = (map[t.collegeId] ?? 0) + 1; });
    return map;
  }, []);

  const rows = colleges
    .filter((c) => (c.name + c.code + c.city).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'students') return b.totalStudents - a.totalStudents;
      if (sortKey === 'tpos') return (tpoCountByCollege[b.id] ?? 0) - (tpoCountByCollege[a.id] ?? 0);
      return b.lastUpdated.localeCompare(a.lastUpdated);
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-semibold text-gray-900">Colleges</h1>
        <div className="flex gap-2">
          <Button variant="secondary">Export Colleges</Button>
          <Button variant="secondary">Export TPO</Button>
          <Button onClick={() => setShowAdd(true)}>+ Add College</Button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">All Colleges ({colleges.length}) — full record, programs, and batches from Campus; overview analytics from Talent.</p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, code, or city..."
          className="flex-1 min-w-[240px] text-sm border border-gray-200 rounded-md px-3 py-2 bg-white"
        />
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="text-sm border border-gray-200 rounded-md px-2.5 py-2 bg-white">
          <option value="lastUpdated">Sort: Last updated</option>
          <option value="name">Sort: College name</option>
          <option value="students">Sort: No of Students</option>
          <option value="tpos">Sort: No of TPOs</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{rows.length} colleges</span>
      </div>

      <Table headers={['', 'College Name', 'No of Students', 'Status', 'Tier', 'No of TPOs', 'Contact', 'Last Updated']}>
        {rows.map((c) => (
          <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/colleges/${c.id}`)}>
            <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={!!selected[c.id]}
                onChange={(e) => setSelected((prev) => ({ ...prev, [c.id]: e.target.checked }))}
              />
            </td>
            <td className="py-2.5 px-3">
              <div className="flex items-center gap-2">
                <img src={c.logo} className="w-7 h-7 rounded-md" />
                <div>
                  <p className="font-medium text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.code}</p>
                </div>
              </div>
            </td>
            <td className="py-2.5 px-3 text-gray-600">{c.totalStudents}</td>
            <td className="py-2.5 px-3"><Badge tone={c.status === 'Activated' ? 'green' : 'red'}>{c.status}</Badge></td>
            <td className="py-2.5 px-3"><Badge tone="blue">{c.tier}</Badge></td>
            <td className="py-2.5 px-3 text-gray-600">{tpoCountByCollege[c.id] ?? 0}</td>
            <td className="py-2.5 px-3 text-gray-600">
              <p>{c.contactPhone}</p>
              <p className="text-xs text-gray-400">{c.contactEmail}</p>
            </td>
            <td className="py-2.5 px-3 text-gray-600">{c.lastUpdated}</td>
          </tr>
        ))}
      </Table>

      {showAdd && <AddCollegeModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
