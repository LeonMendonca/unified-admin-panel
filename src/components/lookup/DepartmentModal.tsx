import { useState } from 'react';
import { X } from 'lucide-react';
import type { LookupEmployee } from '../../data/lookupData';

interface DepartmentModalProps {
  onClose: () => void;
  onSave: (name: string, assigneeId: string) => void;
  employees: LookupEmployee[];
  companyId: string;
}

export default function DepartmentModal({ onClose, onSave, employees, companyId }: DepartmentModalProps) {
  const [name, setName] = useState('');
  const [assigneeId, setAssigneeId] = useState('');

  const companyEmployees = employees.filter(e => e.companyId === companyId);

  const handleSave = () => {
    if (!name.trim() || !assigneeId) return;
    onSave(name.trim(), assigneeId);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-8" onClick={e => e.stopPropagation()}>
        <div className="p-6 pb-2 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Department</h2>
            <p className="text-sm text-gray-500 mt-1">Create a new department by assigning an employee to it.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors mt-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
            <input 
              type="text" 
              placeholder="e.g., Marketing, Engineering, Sales" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-shadow"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Employee *</label>
            <select 
              value={assigneeId}
              onChange={e => setAssigneeId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-shadow bg-white"
            >
              <option value="">Select an employee</option>
              {companyEmployees.map(e => (
                <option key={e.id} value={e.id}>{e.name} - {e.title}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">Select an employee from this department to create it</p>
          </div>
        </div>

        <div className="p-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors bg-white"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!name.trim() || !assigneeId}
            className="px-6 py-2.5 rounded-full text-sm font-bold bg-gray-500 text-white hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Department
          </button>
        </div>
      </div>
    </div>
  );
}
