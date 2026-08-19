import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye } from 'lucide-react';
import { 
  getAIViolations, 
  updateViolationStatus, 
  type AIDetectionViolation 
} from '../../data/aiDetectionData';
import ReviewModal from '../../components/ai-detection/ReviewModal';

export default function AIDetectionPage() {
  const navigate = useNavigate();
  const [violations, setViolations] = useState<AIDetectionViolation[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [severityFilter, setSeverityFilter] = useState('All Severity');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal
  const [selectedViolation, setSelectedViolation] = useState<AIDetectionViolation | null>(null);

  useEffect(() => {
    setViolations(getAIViolations());
  }, []);

  const handleReview = (id: string, notes: string) => {
    updateViolationStatus(id, 'Reviewed', notes);
    setViolations(getAIViolations());
    setSelectedViolation(null);
  };

  const filteredViolations = useMemo(() => {
    return violations.filter(v => {
      const matchSearch = v.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || v.testOrRoom.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === 'All Types' || v.type === typeFilter;
      const matchSeverity = severityFilter === 'All Severity' || v.severity === severityFilter;
      const matchStatus = statusFilter === 'All' || v.status === statusFilter;
      return matchSearch && matchType && matchSeverity && matchStatus;
    });
  }, [violations, searchQuery, typeFilter, severityFilter, statusFilter]);

  // KPIs
  const totalViolations = violations.length;
  const severeViolations = violations.filter(v => v.severity === 'High').length;
  const pendingReview = violations.filter(v => v.status === 'Pending').length;
  const blockedStudents = 0; // Mock stat for now

  // Unique dropdown options
  const uniqueTypes = Array.from(new Set(violations.map(v => v.type)));

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full pb-12">
      <div>
        <h1 className="text-3xl font-black text-[#003865] tracking-tight">AI Detection Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor and review AI detection violations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-bold text-[#003865] mb-2">Total Violations</p>
          <p className="text-3xl font-black text-gray-900">{totalViolations}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-bold text-[#003865] mb-2">Severe Violations</p>
          <p className="text-3xl font-black text-red-600">{severeViolations}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-bold text-[#003865] mb-2">Blocked Students</p>
          <p className="text-3xl font-black text-[#f58220]">{blockedStudents}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-sm font-bold text-[#003865] mb-2">Pending Review</p>
          <p className="text-3xl font-black text-gray-900">{pendingReview}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-[#003865]" size={20} />
          <h2 className="text-xl font-bold text-[#003865]">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search student..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-400"
          >
            <option value="All Types">All Types</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select 
            value={severityFilter} 
            onChange={e => setSeverityFilter(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-400"
          >
            <option value="All Severity">All Severity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-gray-400"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-[#003865]">Violations ({filteredViolations.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 font-medium">
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Test/Room</th>
                <th className="py-4 px-6">Risk Score</th>
                <th className="py-4 px-6 text-center">Severity</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredViolations.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900">{v.studentName}</td>
                  <td className="py-4 px-6">
                    <span className="bg-white border border-gray-200 text-gray-700 font-bold px-3 py-1 rounded-full text-xs shadow-sm inline-block whitespace-nowrap">
                      {v.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 max-w-[200px] truncate text-gray-600" title={v.testOrRoom}>{v.testOrRoom}</td>
                  <td className="py-4 px-6 text-gray-600 font-medium">{v.riskScore}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block font-bold text-xs px-2.5 py-1 rounded ${
                      v.severity === 'High' ? 'bg-red-100 text-red-700' :
                      v.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {v.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500">{v.date}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block font-bold text-xs px-2.5 py-1 rounded-full ${
                      v.status === 'Pending' ? 'bg-gray-900 text-white' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => navigate(`/users/students/${v.studentId}`)}
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                        title="View Student"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => setSelectedViolation(v)}
                        className="bg-white border border-gray-200 text-[#003865] hover:bg-gray-50 font-bold px-4 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                      >
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredViolations.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 font-medium">
                    No violations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedViolation && (
        <ReviewModal 
          violation={selectedViolation}
          onClose={() => setSelectedViolation(null)}
          onReview={handleReview}
        />
      )}
    </div>
  );
}
