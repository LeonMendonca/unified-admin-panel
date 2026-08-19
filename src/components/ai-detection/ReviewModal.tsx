import { useState } from 'react';
import { X } from 'lucide-react';
import type { AIDetectionViolation } from '../../data/aiDetectionData';

interface ReviewModalProps {
  violation: AIDetectionViolation;
  onClose: () => void;
  onReview: (id: string, notes: string) => void;
}

export default function ReviewModal({ violation, onClose, onReview }: ReviewModalProps) {
  const [notes, setNotes] = useState(violation.adminNotes || '');

  const handleReview = () => {
    onReview(violation.id, notes);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8" onClick={e => e.stopPropagation()}>
        <div className="p-6 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-[#003865]">Review Violation</h2>
            <p className="text-sm text-gray-500 mt-1">Student: {violation.studentName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Admin Notes</label>
            <textarea 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add review notes..."
              className="w-full border border-gray-900 rounded-lg p-3 text-sm focus:outline-none min-h-[100px] resize-y"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#003865] mb-2">Risk Logs</label>
            <div className="bg-[#e8eff5] rounded-xl p-4 text-sm font-mono text-gray-800 overflow-x-auto max-h-[250px] overflow-y-auto">
              <pre>{violation.riskLogs}</pre>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 flex justify-end gap-3 mt-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors bg-white"
          >
            Cancel
          </button>
          <button 
            onClick={handleReview}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#003865] text-white hover:bg-[#002848] transition-colors"
          >
            Mark as Reviewed
          </button>
        </div>
      </div>
    </div>
  );
}
