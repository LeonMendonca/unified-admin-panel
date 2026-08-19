import { useState } from 'react';
import { Settings, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  creditPackages,
  creditBalances,
  creditLedger,
  agencyPools,
  discountCoupons,
  studentCreditDefaults,
  getCreditSummary,
} from '../../data/creditSettings';
import { Badge, Card, SectionTitle, Table, Button, EmptyState } from '../../components/ui';

const TABS = ['Student', 'HR', 'Discount Coupons'];

export default function CreditSettingsPage() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] w-full pb-12">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Settings size={28} className="text-[#003865]" />
          <h1 className="text-3xl font-black text-[#003865] tracking-tight">Credit Management</h1>
        </div>
        <p className="text-sm text-gray-500">Manage credit packs, user balances, and the credit ledger.</p>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        {tab === 'Student' && <StudentSection />}
        {tab === 'HR' && <HRSection />}
        {tab === 'Discount Coupons' && <DiscountCouponsTab />}
      </div>
    </div>
  );
}

function HRSection() {
  const [innerTab, setInnerTab] = useState<'Packages' | 'Balances' | 'Ledger' | 'Agencies'>('Packages');
  const summary = getCreditSummary();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-5 border border-gray-100 shadow-sm rounded-xl bg-white">
          <p className="text-sm text-gray-500 flex items-center gap-1.5"><span className="text-blue-500">👥</span> Users with credits</p>
          <p className="text-3xl font-black text-[#003865] mt-2">{summary.usersWithCredits.toLocaleString()}</p>
        </Card>
        <Card className="p-5 border border-gray-100 shadow-sm rounded-xl bg-white">
          <p className="text-sm text-gray-500 flex items-center gap-1.5"><span className="text-yellow-500">🪙</span> Total balance</p>
          <p className="text-3xl font-black text-[#003865] mt-2">{summary.totalBalance.toLocaleString()}</p>
        </Card>
        <Card className="p-5 border border-gray-100 shadow-sm rounded-xl bg-white">
          <p className="text-sm text-gray-500 flex items-center gap-1.5"><span className="text-emerald-500">↗</span> Total earned</p>
          <p className="text-3xl font-black text-[#003865] mt-2">{summary.totalEarned.toLocaleString()}</p>
        </Card>
        <Card className="p-5 border border-gray-100 shadow-sm rounded-xl bg-white">
          <p className="text-sm text-gray-500 flex items-center gap-1.5"><span className="text-purple-500">↗</span> Total spent</p>
          <p className="text-3xl font-black text-[#003865] mt-2">{summary.totalSpent.toLocaleString()}</p>
        </Card>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
        {['Packages', 'Balances', 'Ledger', 'Agencies'].map((t) => (
          <button
            key={t}
            onClick={() => setInnerTab(t as any)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              innerTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div>
        {innerTab === 'Packages' && <HRPackagesTab />}
        {innerTab === 'Balances' && <BalancesTab />}
        {innerTab === 'Ledger' && <LedgerTab />}
        {innerTab === 'Agencies' && <AgenciesTab />}
      </div>
    </div>
  );
}

function StudentSection() {
  const [innerTab, setInnerTab] = useState<'System Settings' | 'Credit Packages'>('System Settings');
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
        {['System Settings', 'Credit Packages'].map((t) => (
          <button
            key={t}
            onClick={() => setInnerTab(t as any)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              innerTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div>
        {innerTab === 'System Settings' && <SystemSettingsTab />}
        {innerTab === 'Credit Packages' && <CreditPackagesTab />}
      </div>
    </div>
  );
}

function SystemSettingsTab() {
  const [signupCredits, setSignupCredits] = useState(studentCreditDefaults.defaultSignupCredits);
  const [roomEntryCost, setRoomEntryCost] = useState(studentCreditDefaults.roomEntryCost);

  return (
    <Card className="p-8 border border-gray-100 shadow-sm rounded-xl bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[#003865]">Credit System Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Configure default values for the credit system</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Default Signup Credits</label>
          <div className="flex gap-4 items-center">
            <input 
              type="number" 
              value={signupCredits} 
              onChange={(e) => setSignupCredits(Number(e.target.value))} 
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" 
            />
            <button className="px-6 py-2.5 bg-[#003865] text-white font-bold rounded-md text-sm hover:bg-[#002848] transition-colors flex items-center gap-2">
              💾 Save
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Number of free credits given to new students on signup</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Room Entry Cost</label>
          <div className="flex gap-4 items-center">
            <input 
              type="number" 
              value={roomEntryCost} 
              onChange={(e) => setRoomEntryCost(Number(e.target.value))} 
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" 
            />
            <button className="px-6 py-2.5 bg-[#003865] text-white font-bold rounded-md text-sm hover:bg-[#002848] transition-colors flex items-center gap-2">
              💾 Save
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Credits required for additional room entries</p>
        </div>
      </div>
    </Card>
  );
}

function CreditPackagesTab() {
  const showArchived = false;
  const rows = creditPackages.filter((p) => showArchived || p.status === 'Active');

  return (
    <div className="flex flex-col gap-6">
      {/* Create Form */}
      <Card className="p-8 border border-gray-100 shadow-sm rounded-xl bg-white">
        <h2 className="text-2xl font-black text-[#003865] flex items-center gap-2 mb-6">
          <Plus size={24} className="text-[#003865]" />
          Create New Package
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Package Name</label>
            <input type="text" placeholder="Starter Pack" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Credit Amount</label>
            <input type="number" placeholder="25" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Price (INR)</label>
            <input type="number" placeholder="99.00" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Bonus Percentage</label>
            <input type="number" placeholder="20" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
            <textarea placeholder="Perfect for getting started" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 min-h-[100px] resize-y" />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2.5 bg-[#003865] text-white font-bold rounded-md text-sm hover:bg-[#002848] transition-colors flex items-center gap-2">
            <Plus size={16} /> Create Package
          </button>
        </div>
      </Card>

      {/* List */}
      <Card className="p-8 border border-gray-100 shadow-sm rounded-xl bg-white">
        <h2 className="text-xl font-black text-[#003865] flex items-center gap-2 mb-6">
          📦 Credit Packages
        </h2>
        
        <div className="flex flex-col gap-4">
          {rows.map((p) => (
            <div key={p.id} className="border border-gray-200 rounded-xl p-5 flex items-start justify-between bg-white shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-black text-[#003865]">{p.name}</h3>
                  <span className="bg-[#1f2937] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {p.status}
                  </span>
                  {p.name === 'Popular Pack' && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      +25% Bonus
                    </span>
                  )}
                  {p.name === 'Premium Pack' && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      +50% Bonus
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-3">{p.credits} credits perfect for getting started</p>
                <div className="flex items-center gap-4 text-sm">
                  <p><span className="font-bold text-gray-900">Credits:</span> {p.credits}</p>
                  <p><span className="font-bold text-gray-900">Price:</span> ₹{p.totalPrice || p.pricePerCredit}</p>
                  <p><span className="font-bold text-gray-900">Per Credit:</span> ₹{p.pricePerCredit || p.totalPrice}</p>
                </div>
                <p className="text-xs text-gray-400 mt-2">Created 22/09/2025</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
                  <Pencil size={16} />
                </button>
                <div className="w-12 h-6 bg-[#003865] rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
                <button className="p-2 border border-red-500 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function HRPackagesTab() {
  const showArchived = false;
  const rows = creditPackages.filter((p) => showArchived || p.status === 'Active');

  return (
    <Card className="p-5 border border-gray-100 shadow-sm rounded-xl bg-white overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">Edits here are live — they change /pricing and the price users get charged.</p>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-[#003865]" /> Show archived
          </label>
          <button className="px-5 py-2 bg-[#1f2937] text-white rounded-full text-sm font-bold hover:bg-black transition-colors flex items-center gap-2">
            <Plus size={16} /> New package
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 -mb-5">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-y border-gray-100 text-gray-500 bg-white">
              <th className="py-4 px-6 font-medium">Name</th>
              <th className="py-4 px-6 font-medium">Type</th>
              <th className="py-4 px-6 font-medium">Credits</th>
              <th className="py-4 px-6 font-medium">₹ / credit</th>
              <th className="py-4 px-6 font-medium">Total</th>
              <th className="py-4 px-6 font-medium">Period</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-900">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{p.name}</td>
                <td className="py-4 px-6 text-gray-600">{p.type}</td>
                <td className="py-4 px-6 font-bold">{p.credits.toLocaleString()}</td>
                <td className="py-4 px-6 text-gray-600">{p.pricePerCredit != null ? `₹${p.pricePerCredit}` : '—'}</td>
                <td className="py-4 px-6 font-medium">{p.totalPrice != null ? `₹${p.totalPrice.toLocaleString()}` : '—'}</td>
                <td className="py-4 px-6 text-gray-600">{p.periodDays != null ? `${p.periodDays} days` : '—'}</td>
                <td className="py-4 px-6">
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                    {p.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="px-4 py-1.5 border border-gray-200 rounded-full font-bold text-sm hover:bg-gray-50 flex items-center gap-1.5 inline-flex">
                    <Pencil size={14} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function BalancesTab() {
  const [search, setSearch] = useState('');
  const [adjustUser, setAdjustUser] = useState<any>(null);

  const rows = creditBalances.filter((b) => (b.name + b.email + (b.company ?? '')).toLowerCase().includes(search.toLowerCase()));

  return (
    <Card className="border border-gray-100 shadow-sm rounded-xl bg-white overflow-hidden p-5">
      <div className="mb-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search by name, email, or company" 
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" 
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 -mb-5">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-y border-gray-100 text-gray-500 bg-white">
              <th className="py-4 px-6 font-medium">User</th>
              <th className="py-4 px-6 font-medium">Email</th>
              <th className="py-4 px-6 font-medium">Company</th>
              <th className="py-4 px-6 font-medium">Balance</th>
              <th className="py-4 px-6 font-medium">Earned</th>
              <th className="py-4 px-6 font-medium">Spent</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-900">
            {rows.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">{b.name}</td>
                <td className="py-4 px-6 text-gray-600">{b.email}</td>
                <td className="py-4 px-6 text-gray-600">{b.company ?? '—'}</td>
                <td className="py-4 px-6 font-bold">{b.balance.toLocaleString()}</td>
                <td className="py-4 px-6 text-gray-600">{b.earned.toLocaleString()}</td>
                <td className="py-4 px-6 text-gray-600">{b.spent.toLocaleString()}</td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => setAdjustUser(b)} className="px-5 py-1.5 border border-gray-200 rounded-full font-bold text-sm hover:bg-gray-50 inline-flex">
                    Adjust
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adjustUser && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4" onClick={() => setAdjustUser(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setAdjustUser(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
            <div className="p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-1">Adjust credits</h2>
              <p className="text-gray-500 text-sm mb-6">· current balance {adjustUser.balance.toLocaleString()}</p>

              <div className="flex items-center gap-0 bg-gray-50 rounded-full w-fit p-1 mb-6 border border-gray-100">
                <button className="px-6 py-1.5 bg-black text-white rounded-full text-sm font-bold flex items-center gap-2">
                  <Plus size={14} /> Add
                </button>
                <button className="px-6 py-1.5 text-gray-900 font-bold text-sm flex items-center gap-2 hover:bg-gray-200 rounded-full transition-colors">
                  <span className="text-lg leading-none font-normal">-</span> Deduct
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">Amount</label>
                <input type="number" placeholder="100" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-900 mb-2">Reason</label>
                <input type="text" placeholder="Manual top-up by admin" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 py-3 bg-[#111] text-white font-bold rounded-full hover:bg-black transition-colors">
                  Add 100
                </button>
                <button onClick={() => setAdjustUser(null)} className="px-6 py-3 border border-gray-200 font-bold rounded-full hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function LedgerTab() {
  const rows = creditLedger;

  return (
    <Card className="border border-gray-100 shadow-sm rounded-xl bg-white overflow-hidden p-5">
      <div className="overflow-x-auto -mx-5 -mt-5 -mb-5">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 bg-white">
              <th className="py-4 px-6 font-medium">When</th>
              <th className="py-4 px-6 font-medium">Type</th>
              <th className="py-4 px-6 font-medium">Amount</th>
              <th className="py-4 px-6 font-medium">Balance after</th>
              <th className="py-4 px-6 font-medium">Description</th>
              <th className="py-4 px-6 font-medium">Ref</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-900">
            {rows.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{l.when}</td>
                <td className="py-4 px-6">
                  <span className={l.type === 'credit' ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                    {l.type}
                  </span>
                </td>
                <td className={`py-4 px-6 font-bold ${l.amount >= 0 ? 'text-emerald-500' : 'text-gray-900'}`}>
                  {l.amount >= 0 ? '+' : ''}{l.amount.toLocaleString()}
                </td>
                <td className="py-4 px-6 text-gray-600">{l.balanceAfter.toLocaleString()}</td>
                <td className="py-4 px-6 font-medium">{l.description}</td>
                <td className="py-4 px-6 text-gray-400">{l.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function AgenciesTab() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-1">
        <SectionTitle>Agency Pools</SectionTitle>
        <Button size="sm">+ Assign plan</Button>
      </div>
      <p className="text-xs text-gray-500 mb-4">Shared credit pools per owner — invite tracking lives on the owner's profile. HR-only; there is no Student equivalent.</p>
      {agencyPools.length === 0 ? <EmptyState label="No agency pools" /> : (
        <Table headers={['Owner', 'Plan', 'Members', 'Balance', 'Monthly grant', 'Renews', 'Status', '']}>
          {agencyPools.map((a) => (
            <tr key={a.id}>
              <td className="py-2 px-3">
                <p className="font-medium text-gray-800">{a.ownerName}</p>
                <p className="text-xs text-gray-500">{a.ownerEmail}</p>
              </td>
              <td className="py-2 px-3"><Badge>{a.plan}</Badge></td>
              <td className="py-2 px-3 text-gray-600">{a.members}</td>
              <td className="py-2 px-3 text-gray-600">{a.balance.toLocaleString()}</td>
              <td className="py-2 px-3 text-gray-600">{a.monthlyGrant.toLocaleString()}</td>
              <td className="py-2 px-3 text-gray-600">{a.renews}</td>
              <td className="py-2 px-3"><Badge tone={a.status === 'active' ? 'green' : 'gray'}>{a.status}</Badge></td>
              <td className="py-2 px-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">↻ Renew</Button>
                  <Button size="sm" variant="danger">Cancel</Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </Card>
  );
}

function DiscountCouponsTab() {
  const [showArchived, setShowArchived] = useState(false);
  const rows = discountCoupons.filter((c) => showArchived || c.status === 'Active');

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-1">
        <SectionTitle>Discount Coupons</SectionTitle>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-gray-600">
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Show archived
          </label>
          <Button size="sm">+ New coupon</Button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-4">Codes are validated server-side. Edits here are live and affect the next checkout. HR/company-purchase side only.</p>
      <Table headers={['Code', 'Discount', 'Applies to', 'Valid until', 'Used / Max', 'Status', '']}>
        {rows.map((c) => (
          <tr key={c.id}>
            <td className="py-2 px-3"><code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{c.code}</code></td>
            <td className="py-2 px-3 text-gray-600">{c.discountPct}%</td>
            <td className="py-2 px-3 text-gray-600">{c.appliesTo}</td>
            <td className="py-2 px-3 text-gray-600">{c.validUntil}</td>
            <td className="py-2 px-3 text-gray-600">{c.used} / {c.max}</td>
            <td className="py-2 px-3"><Badge tone={c.status === 'Active' ? 'green' : 'gray'}>{c.status}</Badge></td>
            <td className="py-2 px-3">
              <div className="flex gap-2">
                <button className="text-purple-600 text-xs">Edit</button>
                <button className="text-rose-600 text-xs">Archive</button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}
