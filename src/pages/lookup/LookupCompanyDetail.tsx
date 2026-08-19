import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Building, Trash2, GitMerge, Pencil, Plus, Check } from 'lucide-react';
import { 
  getSavedCompanies, 
  getSavedEmployees, 
  getSavedDepartments,
  saveCompanies,
  saveEmployees,
  saveDepartments,
  seniorityLevels,
  type LookupCompany,
  type LookupEmployee,
  type LookupDepartment
} from '../../data/lookupData';
import EmployeeModal from '../../components/lookup/EmployeeModal';
import DepartmentModal from '../../components/lookup/DepartmentModal';

export default function LookupCompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState<LookupCompany | null>(null);
  const [employees, setEmployees] = useState<LookupEmployee[]>([]);
  const [departments, setDepartments] = useState<LookupDepartment[]>([]);

  const [activeSeniority, setActiveSeniority] = useState<string | null>(null);
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<LookupEmployee | null>(null);
  
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

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

  const handleDeleteCompany = () => {
    if (window.confirm('Are you sure you want to delete this company and all its data?')) {
      const allCompanies = getSavedCompanies().filter(c => c.id !== id);
      saveCompanies(allCompanies);
      navigate('/lookup');
    }
  };

  const handleSaveEmployee = (data: Partial<LookupEmployee>, newDepartmentName?: string) => {
    let newDeptId = data.departmentId;

    if (newDepartmentName) {
      const allDepts = getSavedDepartments();
      const newDept: LookupDepartment = {
        id: `d-${Date.now()}`,
        companyId: company.id,
        name: newDepartmentName
      };
      saveDepartments([...allDepts, newDept]);
      setDepartments([...departments, newDept]);
      newDeptId = newDept.id;
    }

    const allEmps = getSavedEmployees();
    let updatedEmps: LookupEmployee[];

    if (editingEmployee) {
      updatedEmps = allEmps.map(e => e.id === editingEmployee.id ? { ...e, ...data, departmentId: newDeptId || null } as LookupEmployee : e);
    } else {
      const newEmp: LookupEmployee = {
        ...data,
        id: `e-${Date.now()}`,
        companyId: company.id,
        departmentId: newDeptId || null,
        enriched: true
      } as LookupEmployee;
      updatedEmps = [...allEmps, newEmp];
      
      // Update company count
      const allCompanies = getSavedCompanies();
      saveCompanies(allCompanies.map(c => c.id === company.id ? { ...c, savedPeopleCount: c.savedPeopleCount + 1 } : c));
    }

    saveEmployees(updatedEmps);
    setEmployees(updatedEmps.filter(e => e.companyId === company.id));
    setIsEmployeeModalOpen(false);
    setEditingEmployee(null);
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

  const handleSaveDepartment = (name: string, assigneeId: string) => {
    const allDepts = getSavedDepartments();
    const newDept: LookupDepartment = {
      id: `d-${Date.now()}`,
      companyId: company.id,
      name
    };
    saveDepartments([...allDepts, newDept]);
    setDepartments([...departments, newDept]);

    const allEmps = getSavedEmployees();
    const updatedEmps = allEmps.map(e => e.id === assigneeId ? { ...e, departmentId: newDept.id } : e);
    saveEmployees(updatedEmps);
    setEmployees(updatedEmps.filter(e => e.companyId === company.id));
    
    setIsDeptModalOpen(false);
  };

  // Derived counts for grids
  const getSeniorityCount = (level: string) => employees.filter(e => e.seniority === level).length;
  const getDeptCount = (deptId: string) => employees.filter(e => e.departmentId === deptId).length;

  const filteredEmployees = employees.filter(e => {
    if (activeSeniority && e.seniority !== activeSeniority) return false;
    if (activeDepartment && e.departmentId !== activeDepartment) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full pb-20">
      {/* Top Nav */}
      <div>
        <button 
          onClick={() => navigate('/lookup')}
          className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-black mb-6"
        >
          <ArrowLeft size={16} /> Back to Companies
        </button>

        <div className="flex items-center justify-between">
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
              <h1 className="text-2xl font-black text-gray-900">{company.name}</h1>
              {company.domain !== '-' && (
                <a href={`https://${company.domain}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#f58220] hover:underline font-semibold text-sm">
                  {company.domain} <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              )}
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                {employees.length} saved
              </span>
            </div>
            
            <div className="h-6 w-px bg-gray-200 mx-2" />
            
            <button 
              onClick={() => navigate(`/lookup/company/${company.id}/org-chart`)}
              className="flex items-center gap-1.5 font-bold text-sm text-gray-700 hover:text-black hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
              <GitMerge size={16} /> Org Chart
            </button>
          </div>

          <button onClick={handleDeleteCompany} className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-100">
            <Trash2 size={16} /> Delete Company
          </button>
        </div>
      </div>

      {/* Dynamic Grids */}
      <div className="space-y-6">
        {/* Seniority Grid - hide if department is active */}
        {!activeDepartment && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Users className="text-gray-900" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Search Employees by Seniority</h2>
            </div>
            <div className="flex justify-between items-end mb-6">
              <p className="text-sm text-gray-500">Click a seniority level to find employees at {company.name}</p>
              {activeSeniority && (
                <button onClick={() => setActiveSeniority(null)} className="text-sm font-bold text-[#029bcf] hover:underline">Clear Filter</button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {seniorityLevels.map(level => {
                const count = getSeniorityCount(level.id);
                const isActive = activeSeniority === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => setActiveSeniority(isActive ? null : level.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      isActive 
                        ? 'border-gray-900 bg-gray-900 text-white shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
                    }`}
                  >
                    <span className="font-bold">{level.label}</span>
                    <span className={`text-xs mt-1 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>{level.desc}</span>
                    {count > 0 && !isActive && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Departments Grid - hide if seniority is active */}
        {!activeSeniority && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building className="text-gray-900" size={20} />
                  <h2 className="text-lg font-bold text-gray-900">Departments ({departments.length})</h2>
                </div>
                <p className="text-sm text-gray-500">Departments extracted from employee profiles</p>
                {activeDepartment && (
                  <button onClick={() => setActiveDepartment(null)} className="text-sm font-bold text-[#029bcf] hover:underline mt-2">Clear Filter</button>
                )}
              </div>
              <button 
                onClick={() => setIsDeptModalOpen(true)}
                className="flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors border border-gray-200 bg-white shadow-sm"
              >
                <Plus size={16} /> Add Department
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {departments.map(dept => {
                const count = getDeptCount(dept.id);
                const isActive = activeDepartment === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setActiveDepartment(isActive ? null : dept.id)}
                    className={`flex flex-col items-start p-4 rounded-xl border transition-all text-left ${
                      isActive 
                        ? 'border-gray-900 bg-gray-900 text-white shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
                    }`}
                  >
                    <span className="font-bold truncate w-full">{dept.name}</span>
                    <span className={`text-xs mt-1 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>{count} employees</span>
                  </button>
                );
              })}
              {departments.length === 0 && (
                <div className="col-span-full py-8 text-center text-gray-500 font-medium border border-dashed border-gray-200 rounded-xl">
                  No departments found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Employees Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={18} />
              Saved Employees ({filteredEmployees.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Previously saved employees from this company</p>
          </div>
          <button 
            onClick={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors border border-gray-200 bg-white shadow-sm"
          >
            <Plus size={16} /> Add Employee
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-medium">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6 text-center">Seniority</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Sal Range</th>
                <th className="py-4 px-6 text-center">Enrich</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                        <Users size={14} className="text-slate-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#f58220] hover:underline cursor-pointer">{emp.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 max-w-xs text-gray-500 truncate" title={emp.title}>{emp.title}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-gray-100 text-gray-700 font-bold text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-gray-200">
                      {emp.seniority}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 max-w-xs truncate" title={emp.location}>{emp.location}</td>
                  <td className="py-4 px-6 font-medium">{emp.salaryRange}</td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <a href={emp.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-[#f58220] hover:text-[#e07519] transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                      {emp.enriched ? (
                        <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Check size={10} /> Enriched
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px] font-bold border border-gray-200 px-2 py-0.5 rounded-full">Unenriched</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-3 text-gray-400">
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

              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 font-medium">
                    No employees found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      {isDeptModalOpen && (
        <DepartmentModal 
          onClose={() => setIsDeptModalOpen(false)}
          onSave={handleSaveDepartment}
          employees={employees}
          companyId={company.id}
        />
      )}
    </div>
  );
}
