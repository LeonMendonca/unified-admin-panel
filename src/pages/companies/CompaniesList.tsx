import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companies } from '../../data/companies';
import { Badge, statusTone, Table, Tabs, Button } from '../../components/ui';
import AddCompanyModal from './AddCompanyModal';

export default function CompaniesList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'All Companies' | 'Campus Companies'>('All Companies');
  const [search, setSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState('Company admin');
  const [verifiedFilter, setVerifiedFilter] = useState('Verified');
  const [showAdd, setShowAdd] = useState(false);

  const verifiedCount = companies.filter((c) => c.verified).length;

  const rows = companies
    .filter((c) => (tab === 'Campus Companies' ? c.campusLinked : true))
    .filter((c) => (c.name + c.domain + c.industry).toLowerCase().includes(search.toLowerCase()))
    .filter((c) => {
      if (adminFilter === 'Assigned' && !c.companyAdminAssigned) return false;
      if (adminFilter === 'Missing' && c.companyAdminAssigned) return false;
      return true;
    })
    .filter((c) => {
      if (verifiedFilter === 'Verified' && !c.verified) return false;
      if (verifiedFilter === 'Not verified' && c.verified) return false;
      return true;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-semibold text-gray-900">Companies</h1>
        <Button onClick={() => setShowAdd(true)}>+ Add Company</Button>
      </div>
      <p className="text-sm text-gray-500 mb-4">{companies.length} total · {verifiedCount} verified — one record shared across Hiring and Campus.</p>

      <Tabs tabs={['All Companies', 'Campus Companies']} active={tab} onChange={(t) => setTab(t as typeof tab)} />

      <div className="my-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, domain, industry..."
          className="w-full max-w-md text-sm border border-gray-200 rounded-md px-3 py-2 bg-white"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select value={adminFilter} onChange={(e) => setAdminFilter(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white">
          <option>Company admin</option>
          <option>Assigned</option>
          <option>Missing</option>
        </select>
        <select value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)} className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white">
          <option>Verified</option>
          <option>Verified</option>
          <option>Not verified</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{rows.length} companies</span>
      </div>
      <Table headers={['Company', 'Domain', 'Industry', 'Members', 'Company admin', 'Verified', 'Campus access']}>
        {rows.map((c) => (
          <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/companies/${c.id}`)}>
            <td className="py-2.5 px-3">
              <div className="flex items-center gap-2">
                <img src={c.logo} className="w-7 h-7 rounded-md" />
                <span className="font-medium text-gray-800">{c.name}</span>
              </div>
            </td>
            <td className="py-2.5 px-3 text-gray-600">{c.domain || '—'}</td>
            <td className="py-2.5 px-3 text-gray-600">{c.industry}</td>
            <td className="py-2.5 px-3 text-gray-600">{c.members.length}</td>
            <td className="py-2.5 px-3">{c.companyAdminAssigned ? <Badge tone="green">Assigned</Badge> : <Badge tone="red">No company admin</Badge>}</td>
            <td className="py-2.5 px-3">{c.verified ? <Badge tone="green">Verified</Badge> : <Badge tone="gray">Not verified</Badge>}</td>
            <td className="py-2.5 px-3">{c.campusLinked ? <Badge tone={statusTone(c.campusAccessStatus)}>{c.campusAccessStatus}</Badge> : <Badge>—</Badge>}</td>
          </tr>
        ))}
      </Table>

      {showAdd && <AddCompanyModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
