import { useState } from 'react';
import { colleges } from '../../data/colleges';
import type { TPO } from '../../data/types';
import { Button } from '../../components/ui';

export default function AddTpoModal({ tpo, onClose }: { tpo?: TPO; onClose: () => void }) {
  const isEdit = !!tpo;
  const [name, setName] = useState(tpo?.name ?? '');
  const [email, setEmail] = useState(tpo?.email ?? '');
  const [phone, setPhone] = useState(tpo?.contact ?? '');
  const [collegeId, setCollegeId] = useState(tpo?.collegeId ?? '');
  const [done, setDone] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✓</div>
            <p className="mt-3 font-medium text-gray-800">{isEdit ? `${name} updated` : `Invite sent to ${email}`}</p>
            {!isEdit && <p className="text-sm text-gray-500 mt-1">A Pending record has been created. It becomes Registered once they complete registration.</p>}
            <Button onClick={onClose}>Done</Button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-orange-600 text-center mb-4">{isEdit ? 'Update TPO' : 'Add TPO'}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">TPO Name*</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="Enter TPO Name" />
              </div>
              <div>
                <label className="text-xs text-gray-500">College</label>
                <select value={collegeId} onChange={(e) => setCollegeId(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
                  <option value="">None</option>
                  {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Email Id*</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="Enter Email Id" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone No*</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="Enter Contact Number" />
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
