import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, Download, Plus, ChevronDown, ChevronUp, Users, Pencil, Trash2 } from 'lucide-react';
import { 
  getSavedCompanies, 
  getSavedEmployees, 
  getSavedDepartments,
  saveEmployees,
  saveCompanies,
  seniorityLevels,
  type LookupCompany,
  type LookupEmployee,
  type LookupDepartment
} from '../../data/lookupData';
import EmployeeModal from '../../components/lookup/EmployeeModal';

export default function LookupOrgChart() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState<LookupCompany | null>(null);
  const [employees, setEmployees] = useState<LookupEmployee[]>([]);
  const [departments, setDepartments] = useState<LookupDepartment[]>([]);
  
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({
    'Founder': true,
    'C-Suite': true
  });

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<LookupEmployee | null>(null);

  useEffect(() => {
    const allCompanies = getSavedCompanies();
    const comp = allCompanies.find(c => c.id === id);
    if (!comp) {
      navigate('/lookup');
      return;
    }
    setCompany(comp);
    
    setEmployees(getSavedEmployees().filter(e => e.companyId === id));
    setDepartments(getSavedDepartments().filter(d => d.companyId === id));
  }, [id, navigate]);

  if (!company) return null;

  const toggleLevel = (levelId: string) => {
    setExpandedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };

  const handleDeleteEmployee = (empId: string) => {
    if (window.confirm('Delete this employee?')) {
      const allEmps = getSavedEmployees().filter(e => e.id !== empId);
      saveEmployees(allEmps);
      setEmployees(allEmps.filter(e => e.companyId === company.id));

      const allCompanies = getSavedCompanies();
      saveCompanies(allCompanies.map(c => c.id === company.id ? { ...c, savedPeopleCount: Math.max(0, c.savedPeopleCount - 1) } : c));
    }
  };

  const handleSaveEmployee = (data: Partial<LookupEmployee>) => {
    const allEmps = getSavedEmployees();
    let updatedEmps: LookupEmployee[];

    if (editingEmployee) {
      updatedEmps = allEmps.map(e => e.id === editingEmployee.id ? { ...e, ...data } as LookupEmployee : e);
    } else {
      const newEmp: LookupEmployee = {
        ...data,
        id: `e-${Date.now()}`,
        companyId: company.id,
        departmentId: data.departmentId || null,
        enriched: true
      } as LookupEmployee;
      updatedEmps = [...allEmps, newEmp];
      
      const allCompanies = getSavedCompanies();
      saveCompanies(allCompanies.map(c => c.id === company.id ? { ...c, savedPeopleCount: c.savedPeopleCount + 1 } : c));
    }

    saveEmployees(updatedEmps);
    setEmployees(updatedEmps.filter(e => e.companyId === company.id));
    setIsEmployeeModalOpen(false);
    setEditingEmployee(null);
  };

  const getEmployeesByLevel = (levelId: string) => employees.filter(e => e.seniority === levelId);

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full pb-20">
      <div>
        <button 
          onClick={() => navigate(`/lookup/company/${company.id}`)}
          className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-black mb-6"
        >
          <ArrowLeft size={16} /> Back to Company
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded border border-gray-100 flex items-center justify-center bg-white shadow-sm overflow-hidden shrink-0">
              <img 
                src={`https://logo.clearbit.com/${company.domain !== '-' ? company.domain : 'example.com'}`} 
                alt="" 
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>';
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-gray-900">{company.name} - Organization Chart</h1>
              {company.domain !== '-' && (
                <a href={`https://${company.domain}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#f58220] hover:underline font-semibold text-sm">
                  {company.domain} <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              )}
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                {employees.length} saved
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 font-bold text-sm text-gray-700 hover:text-black hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-gray-200 bg-white">
              <LayoutGrid size={16} /> Visual Chart
            </button>
            <button className="flex items-center gap-1.5 font-bold text-sm text-gray-700 hover:text-black hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-gray-200 bg-white">
              <Download size={16} /> Export CSV
            </button>
            <button 
              onClick={() => {
                setEditingEmployee(null);
                setIsEmployeeModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-gray-900 text-white hover:bg-black px-4 py-2 rounded-full text-sm font-bold transition-colors shadow-sm ml-2"
            >
              <Plus size={16} /> Add Employee
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {seniorityLevels.map(level => {
          const emps = getEmployeesByLevel(level.id);
          if (emps.length === 0) return null;
          
          const isExpanded = expandedLevels[level.id];

          return (
            <div key={level.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleLevel(level.id)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-gray-900">{level.label}</h2>
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                    {emps.length}
                  </span>
                </div>
                <div className="text-gray-400">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-400 font-medium">
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6">Title</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6">Location</th>
                        <th className="py-4 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {emps.map(emp => (
                        <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                <Users size={14} className="text-slate-500" />
                              </div>
                              <span className="font-semibold text-gray-800">{emp.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-500">{emp.title}</td>
                          <td className="py-4 px-6 text-[#f58220] font-medium">{emp.email || '-'}</td>
                          <td className="py-4 px-6 text-gray-500">{emp.location || '-'}</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-4 text-gray-400">
                              {emp.linkedInUrl && (
                                <a href={emp.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-[#f58220] hover:text-[#e07519] transition-colors" title="LinkedIn">
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                              )}
                              <button 
                                onClick={() => {
                                  setEditingEmployee(emp);
                                  setIsEmployeeModalOpen(true);
                                }}
                                className="hover:text-gray-900 transition-colors"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteEmployee(emp.id)}
                                className="hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isEmployeeModalOpen && (
        <EmployeeModal 
          onClose={() => {
            setIsEmployeeModalOpen(false);
            setEditingEmployee(null);
          }}
          onSave={handleSaveEmployee}
          employee={editingEmployee}
          departments={departments}
          employees={employees}
          companyId={company.id}
        />
      )}
    </div>
  );
}
