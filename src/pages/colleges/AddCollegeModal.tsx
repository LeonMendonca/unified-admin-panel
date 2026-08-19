import { useState } from 'react';
import { Button } from '../../components/ui';

export default function AddCollegeModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [website, setWebsite] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [done, setDone] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✓</div>
            <p className="mt-3 font-medium text-gray-800">{name || 'College'} created</p>
            <p className="text-sm text-gray-500 mt-1">You can now add programs, batches, and TPO users from the college page.</p>
            <Button onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-orange-600 text-center mb-4">Add College</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-gray-500">College Name*</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="Enter College Name" />
              </div>
              <div>
                <label className="text-xs text-gray-500">College Code*</label>
                <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="e.g. AZIP55" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Official Website URL</label>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="https://" />
              </div>
              <div>
                <label className="text-xs text-gray-500">City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="City" />
              </div>
              <div>
                <label className="text-xs text-gray-500">State</label>
                <input value={state} onChange={(e) => setState(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="State" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button onClick={() => setDone(true)}>Confirm</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
