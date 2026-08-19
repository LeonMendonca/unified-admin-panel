import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { LookupEmployee, LookupDepartment } from '../../data/lookupData';
import { seniorityLevels } from '../../data/lookupData';

interface EmployeeModalProps {
  onClose: () => void;
  onSave: (data: Partial<LookupEmployee>, newDepartmentName?: string) => void;
  employee?: LookupEmployee | null;
  departments: LookupDepartment[];
  employees: LookupEmployee[];
  companyId: string;
}

export default function EmployeeModal({ onClose, onSave, employee, departments, employees, companyId }: EmployeeModalProps) {
  const [name, setName] = useState(employee?.name || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [title, setTitle] = useState(employee?.title || '');
  const [seniority, setSeniority] = useState(employee?.seniority || '');
  const [linkedInUrl, setLinkedInUrl] = useState(employee?.linkedInUrl || '');
  const [salaryRange, setSalaryRange] = useState(employee?.salaryRange || '');
  const [departmentId, setDepartmentId] = useState(employee?.departmentId || '');
  const [newDepartment, setNewDepartment] = useState('');
  const [reportsToId, setReportsToId] = useState(employee?.reportsToId || '');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name,
      email,
      title,
      seniority,
      linkedInUrl,
      salaryRange,
      departmentId,
      reportsToId: reportsToId || null,
      companyId
    }, newDepartment.trim() ? newDepartment : undefined);
  };

  const companyEmployees = employees.filter(e => e.companyId === companyId && e.id !== employee?.id);
  const companyDepartments = departments.filter(d => d.companyId === companyId);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">{employee ? 'Edit Employee' : 'New Employee'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-orange-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                autoFocus
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input 
                type="email" 
                placeholder="john@company.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-300"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation</label>
              <input 
                type="text" 
                placeholder="Senior Software Engineer" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-300"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
              <select 
                value={seniority}
                onChange={e => setSeniority(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-300 bg-white"
              >
                <option value="">Select level</option>
                {seniorityLevels.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary Range</label>
              <input 
                type="text" 
                placeholder="e.g. ₹25-35 LPA" 
                value={salaryRange}
                onChange={e => setSalaryRange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-300"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn URL</label>
              <input 
                type="url" 
                placeholder="https://linkedin.com/in/johndoe" 
                value={linkedInUrl}
                onChange={e => setLinkedInUrl(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-300"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Departments</label>
              <select 
                value={departmentId}
                onChange={e => {
                  setDepartmentId(e.target.value);
                  setNewDepartment('');
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-300 bg-white mb-2"
              >
                <option value="">Select existing department</option>
                {companyDepartments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Or type new department name" 
                  value={newDepartment}
                  onChange={e => {
                    setNewDepartment(e.target.value);
                    setDepartmentId('');
                  }}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-300"
                />
                <button type="button" className="bg-gray-100 border border-gray-200 text-gray-500 rounded-lg px-3 hover:bg-gray-200 transition-colors">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reports To</label>
              <select 
                value={reportsToId}
                onChange={e => setReportsToId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gray-300 bg-white"
              >
                <option value="">No manager assigned</option>
                {companyEmployees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.title})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors bg-white"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-6 py-2.5 rounded-full text-sm font-bold bg-gray-900 text-white hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Employee
          </button>
        </div>
      </div>
    </div>
  );
}
