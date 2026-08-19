import { useState } from 'react';
import { 
  FileText, XCircle, CheckCircle, Search, Info, Eye
} from 'lucide-react';
import type { AccessRequest } from '../../data/accessRequestData';
import { Badge } from '../ui';

interface AccessRequestModalProps {
  request: AccessRequest;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function AccessRequestModal({ request, onClose, onApprove, onReject }: AccessRequestModalProps) {
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);

  const handleApprove = () => {
    onApprove(request.id);
    onClose();
  };

  const handleReject = () => {
    onReject(request.id);
    onClose();
  };

  const hasClaimed = request.matchingColleges.some(c => c.claimStatus === 'Claimed');

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center z-50 overflow-y-auto pt-10 pb-10" onClick={onClose}>
      <div 
        className="bg-white rounded-t-lg rounded-b-lg w-full max-w-4xl shadow-2xl flex flex-col my-auto relative" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Access Request Details</h2>
              <p className="text-sm text-gray-500 font-medium">ID: {request.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={request.status === 'Approved' ? 'green' : request.status === 'Rejected' ? 'red' : 'yellow'}>
              {request.status}
            </Badge>
            <Badge tone="green">{request.requestType}</Badge>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Personal Information */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm font-semibold text-gray-500">Name</p>
                <p className="text-[15px] font-bold text-gray-900 mt-1">{request.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Email</p>
                <p className="text-[15px] font-medium text-gray-900 mt-1">{request.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Contact Number</p>
                <p className="text-[15px] font-medium text-gray-900 mt-1">{request.phone}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Pincode</p>
                <p className="text-[15px] font-medium text-gray-900 mt-1">{request.pincode}</p>
              </div>
              <div className="col-span-1">
                <p className="text-sm font-semibold text-gray-500">Location</p>
                <p className="text-[15px] font-medium text-gray-900 mt-1 leading-relaxed">{request.location}</p>
              </div>
              <div className="col-span-1">
                <p className="text-sm font-semibold text-gray-500">Website</p>
                <a href={request.website} target="_blank" rel="noreferrer" className="text-[15px] font-medium text-blue-600 mt-1 hover:underline break-all block">
                  {request.website}
                </a>
              </div>
            </div>
          </section>

          {/* Organization Information */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Organization Information</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm font-semibold text-gray-500">Institute Name</p>
                <p className="text-[15px] font-bold text-gray-900 mt-1">{request.organization}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Institute Type</p>
                <p className="text-[15px] font-medium text-gray-900 mt-1">{request.instituteType}</p>
              </div>
            </div>
          </section>

          {/* Matching Colleges */}
          {request.status === 'Pending' && (
            <section className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Search size={18} className="text-[#003865]" />
                <h3 className="text-base font-bold text-gray-900">Matching Colleges</h3>
                <span className="text-xs text-gray-400 font-medium">({request.matchingColleges.length} found)</span>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100 mb-6">
                {request.matchingColleges.map((c) => (
                  <label 
                    key={c.id} 
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedCollegeId === c.id ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <input 
                        type="radio" 
                        name="college" 
                        checked={selectedCollegeId === c.id}
                        onChange={() => setSelectedCollegeId(selectedCollegeId === c.id ? null : c.id)}
                        onClick={(e) => {
                          if (selectedCollegeId === c.id) {
                            e.preventDefault();
                            setSelectedCollegeId(null);
                          }
                        }}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <div className="grid grid-cols-3 w-full items-center">
                        <span className="font-bold text-gray-900 text-sm">{c.name}</span>
                        <span className="text-gray-500 text-sm">{c.code}</span>
                        <span className="text-gray-500 text-sm">{c.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge tone={c.claimStatus === 'Claimed' ? 'green' : 'yellow'}>{c.claimStatus}</Badge>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-white rounded-md text-xs font-semibold hover:bg-gray-800 transition-colors">
                        <Eye size={14} /> View Details
                      </button>
                    </div>
                  </label>
                ))}
              </div>

              {hasClaimed && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                  <div className="mt-0.5">
                    <p className="text-sm font-bold text-[#b44d12]">Claimed Colleges Detected</p>
                    <p className="text-sm text-[#b44d12] mt-0.5">Colleges marked as "Claimed" already have TPO and students registered.</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-700">Click on a row to select a college, or click again to deselect.</p>
                  <p className="text-sm text-blue-600 mt-0.5">
                    {selectedCollegeId ? 'College selected. Clicking "Approve" will assign the user to this college.' : 'No college selected. Clicking "Approve" will create a new college.'}
                  </p>
                </div>
              </div>
            </section>
          )}

          <div className="grid grid-cols-2 mt-8 pt-6 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-500">Submitted</p>
              <p className="text-[15px] text-gray-900 mt-1">{request.submittedDate}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Last Updated</p>
              <p className="text-[15px] text-gray-900 mt-1">{request.submittedDate}</p>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="bg-white border-t border-gray-200 p-4 px-6 flex items-center justify-between shrink-0 rounded-b-lg">
          <p className="text-sm font-medium text-gray-400">Request submitted {request.submittedDate}</p>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#4b5563] text-white rounded-md text-sm font-semibold hover:bg-[#374151] transition-colors"
            >
              <XCircle size={16} /> Cancel
            </button>
            
            {request.status === 'Pending' && (
              <>
                <button 
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#10b981] text-white rounded-md text-sm font-semibold hover:bg-[#059669] transition-colors"
                >
                  <CheckCircle size={16} /> {selectedCollegeId ? 'Approve & Assign' : 'Approve & Create College'}
                </button>
                <button 
                  onClick={handleReject}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#ef4444] text-white rounded-md text-sm font-semibold hover:bg-[#dc2626] transition-colors"
                >
                  <XCircle size={16} /> Reject
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
