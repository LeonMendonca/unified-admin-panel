import { useState } from 'react';

export default function AddProgramModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-[#E87A40] mb-8">Add Program</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Program Type<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full px-3 py-2 bg-[#e8eef3] border border-transparent rounded-lg focus:outline-none text-gray-500 appearance-none">
                  <option>Select Program Type</option>
                  <option>UG</option>
                  <option>PG</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Program Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none text-gray-400 appearance-none">
                  <option>Select program type first</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Please select a program type first</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Specialization
              </label>
              <input
                type="text"
                placeholder="Eg. Marketing"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 shadow-sm text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Program Code<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Eg. BSC"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 shadow-sm text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Program Duration<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Eg. 3 years"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 shadow-sm text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Minimum Annual Package (Expected)
              </label>
              <input
                type="text"
                placeholder="Eg. 6LPA"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 shadow-sm text-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Student Intake
              </label>
              <input
                type="number"
                placeholder="Eg. 120"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 shadow-sm text-gray-700"
              />
            </div>
          </div>

          <div className="bg-[#f3f6f8] rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Program Stats & Information</h3>
            <p className="text-sm text-[#022A40] font-medium mb-1">
              Providing this information improves program visibility for employers & helps prospective students make informed decisions.
            </p>
            <p className="text-sm text-gray-400 mb-6">These fields are optional and editable anytime.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">
                  Median Salary
                </label>
                <input
                  type="text"
                  placeholder="Eg. 6LPA"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 shadow-sm text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">
                  Annual Tuition Fees
                </label>
                <input
                  type="text"
                  placeholder="Eg. 6LPA"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 shadow-sm text-gray-700"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1.5">
                  Entrance Exams Accepted
                </label>
                <div className="relative">
                  <select className="w-full px-3 py-2 bg-[#e8eef3] border border-transparent rounded-lg focus:outline-none text-gray-500 appearance-none">
                    <option>Select Exams</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-white border border-[#022A40] text-[#022A40] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-[#022A40] text-white rounded-lg font-semibold hover:bg-[#021d2d] transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
