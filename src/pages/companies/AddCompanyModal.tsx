import { useState } from 'react';
import { Button } from '../../components/ui';

export default function AddCompanyModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [industry, setIndustry] = useState('');
  const [created, setCreated] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-5" onClick={(e) => e.stopPropagation()}>
        {created ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✓</div>
            <p className="mt-3 font-medium text-gray-800">{name || 'Company'} created</p>
            <p className="text-sm text-gray-500 mt-1">No company admin is assigned yet — add one from the Members section on the company page.</p>
            <Button onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Add Company</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-gray-500">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="e.g. Acme Technologies" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Domain</label>
                <input value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="acme.com" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Industry</label>
                <input value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="e.g. Information Technology" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button onClick={() => setCreated(true)}>Create Company</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
