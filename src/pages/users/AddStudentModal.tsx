import { useState } from 'react';
import { colleges } from '../../data/colleges';
import type { Student } from '../../data/types';
import { Button } from '../../components/ui';

export default function AddStudentModal({ student, onClose }: { student?: Student; onClose: () => void }) {
  const isEdit = !!student;
  const [mode, setMode] = useState<'Add Manually' | 'Add In Bulk'>('Add Manually');
  const [name, setName] = useState(student?.name ?? '');
  const [email, setEmail] = useState(student?.email ?? '');
  const [phone, setPhone] = useState(student?.phone ?? '');
  const [rollNumber, setRollNumber] = useState(student?.rollNumber ?? '');
  const [collegeId, setCollegeId] = useState(student?.collegeId ?? '');
  const [batch, setBatch] = useState(student?.batch ?? '');
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
            <h2 className="text-lg font-semibold text-orange-600 text-center mb-4">{isEdit ? 'Update Student' : 'Add Student'}</h2>

            {!isEdit && (
              <div className="flex justify-center gap-6 border-b border-gray-200 mb-4">
                {(['Add Manually', 'Add In Bulk'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`pb-2 text-sm font-medium border-b-2 ${mode === m ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-400'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {mode === 'Add Manually' || isEdit ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">Enter individual student details one by one.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Student Name*</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="Enter Student Name" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Email Id*</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="Enter Email Id" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Phone No*</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="Enter Contact Number" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Roll No</label>
                    <input value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm" placeholder="Enter Roll Number" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Select College*</label>
                    <select value={collegeId} onChange={(e) => setCollegeId(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
                      <option value="">None</option>
                      {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Select Batch*</label>
                    <select value={batch} onChange={(e) => setBatch(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
                      <option value="">None</option>
                      {['Batch of 2024', 'Batch of 2025', 'Batch of 2026'].map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">Upload your completed CSV or Excel file to add multiple students at once.</p>
                <label className="text-xs text-gray-500">Submit CSV/Excel File (Use Template)</label>
                <div className="flex gap-2">
                  <div className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-400 bg-white">Attach File (Max 2MB)</div>
                  <Button variant="secondary" size="sm">Download Template</Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Select College*</label>
                    <select value={collegeId} onChange={(e) => setCollegeId(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
                      <option value="">None</option>
                      {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Select Batch*</label>
                    <select value={batch} onChange={(e) => setBatch(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
                      <option value="">None</option>
                      {['Batch of 2024', 'Batch of 2025', 'Batch of 2026'].map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

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
