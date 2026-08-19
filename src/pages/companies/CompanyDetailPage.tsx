import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { mockCompanies } from '../../data/companyData';
import { Card } from '../../components/ui';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = mockCompanies.find(c => c.id === id) || mockCompanies[0];

  const [openSections, setOpenSections] = useState({
    contact: true,
    admin: true,
    locations: true,
    verticals: true,
    gallery: false,
    social: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [isAssignHrModalOpen, setIsAssignHrModalOpen] = useState(false);
  const [isAddHrModalOpen, setIsAddHrModalOpen] = useState(false);

  return (
    <div className="flex gap-6 max-w-[1200px] w-full pb-12">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between bg-[#f0f4f8] p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/companies')} className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full text-gray-900 shadow-sm transition-all">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-[#003865]">{company.name}</h1>
                {company.hasCampusAccess && (
                  <span className="bg-white text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">Campus-linked</span>
                )}
              </div>
              <p className="text-orange-500 font-semibold text-sm mt-1">{company.website}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 justify-center">
            <p className="text-sm text-gray-500 font-medium">Last Updated {company.lastUpdated.split('On ')[1] || company.createdDate}</p>
          </div>
        </div>

        <Card className="p-0 border border-gray-200 shadow-sm rounded-xl bg-white overflow-hidden">
          {/* Basic Info */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-[#f97316] font-bold mb-6 flex items-center justify-between">
              Basic Information
              <ChevronUp size={20} className="text-[#f97316]" />
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Company Name<span className="text-red-500">*</span></label>
                <input type="text" defaultValue={company.name} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Company Registration No.</label>
                <input type="text" defaultValue="ZMIM99" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Official Website URL<span className="text-red-500">*</span></label>
                <input type="text" defaultValue={company.website} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">LinkedIn URL</label>
                <input type="text" defaultValue={company.linkedInUrl} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Industry</label>
                <input type="text" defaultValue={company.industry} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Founded Year</label>
                <input type="text" defaultValue={company.foundedYear} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Total No. of Employees</label>
                <input type="text" defaultValue={company.employeeCount} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="relative inline-block w-10 h-6">
                  <input type="checkbox" defaultChecked={company.verified} className="peer appearance-none w-10 h-6 bg-gray-200 rounded-full checked:bg-green-500 cursor-pointer transition-colors" />
                  <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="text-sm font-semibold text-gray-900">Verified</span>
              </div>
              
              <div className="col-span-2 border-t border-gray-100 pt-6 mt-2 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Pin code (Headquarters)<span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="400053" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">City, State<span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="mumbai suburban-andheri , maharashtra" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Address Line 1<span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="Veer Desai Road, Azad Nagar, Andheri West, Mumbai-400" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Address Line 2</label>
                  <input type="text" placeholder="Landmark, Locality, Area" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-6 border-b border-gray-100">
                <button onClick={() => toggleSection('contact')} className="w-full text-[#f97316] font-bold mb-6 flex items-center justify-between">
                  Contact Information
                  {openSections.contact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openSections.contact && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Contact No.<span className="text-red-500">*</span></label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-[#f97316] text-sm">+91</span>
                        <input type="text" defaultValue={company.contactNo} className="w-full bg-gray-50 border border-gray-200 rounded-r-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Email<span className="text-red-500">*</span></label>
                      <input type="text" defaultValue={company.contactEmail} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Contact Person<span className="text-red-500">*</span></label>
                      <input type="text" defaultValue={company.contactPerson} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Alternate Contact No.</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-[#f97316] text-sm">+91</span>
                        <input type="text" placeholder="Enter Number" className="w-full bg-gray-50 border border-gray-200 rounded-r-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Details */}
              <div className="p-6 border-b border-gray-100">
                <button onClick={() => toggleSection('admin')} className="w-full text-[#f97316] font-bold mb-6 flex items-center justify-between">
                  Administrative Details
                  {openSections.admin ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openSections.admin && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">Type of Company<span className="text-red-500">*</span></label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none text-gray-900">
                        <option value="Private" selected={company.typeOfCompany === 'Private'}>Private</option>
                        <option value="Public" selected={company.typeOfCompany === 'Public'}>Public</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">HRs <span className="text-red-500">*</span></label>
                      {company.assignedHRs.length > 0 ? (
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <Building2 size={14} />
                            </div>
                            <span className="font-semibold text-gray-900">{company.assignedHRs[0].name}</span>
                          </div>
                          <span className="text-gray-600 text-sm">{company.assignedHRs[0].email}</span>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-500 text-center">No HRs assigned</div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => setIsAssignHrModalOpen(true)}
                          className="bg-[#003865] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#002848] transition-colors"
                        >
                          Assign HR
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Locations */}
              <div className="p-6 border-b border-gray-100">
                <button onClick={() => toggleSection('locations')} className="w-full text-[#f97316] font-bold flex items-center justify-between">
                  Locations
                  {openSections.locations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openSections.locations && (
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="text-[#003865] font-black border-b border-gray-100">
                          <th className="py-3 px-4">Location</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4 text-right">Contact Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.locations.map(loc => (
                          <tr key={loc.id} className="bg-gray-50/50 hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold text-gray-900">{loc.location}</td>
                            <td className="py-3 px-4 text-gray-600">{loc.email}</td>
                            <td className="py-3 px-4 text-right text-gray-900">{loc.contactNumber}</td>
                          </tr>
                        ))}
                        {company.locations.length === 0 && (
                          <tr><td colSpan={3} className="py-6 text-center text-gray-500">No locations added.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Verticals */}
              <div className="p-6 border-b border-gray-100">
                <button onClick={() => toggleSection('verticals')} className="w-full text-[#f97316] font-bold flex items-center justify-between">
                  Verticals
                  {openSections.verticals ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openSections.verticals && (
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="text-[#003865] font-black border-b border-gray-100">
                          <th className="py-3 px-4">Vertical Name</th>
                          <th className="py-3 px-4 text-center">Active Jobs</th>
                          <th className="py-3 px-4 text-center">Onboarded Colleges</th>
                          <th className="py-3 px-4 text-center">Zigged Candidates</th>
                        </tr>
                      </thead>
                      <tbody>
                        {company.verticals.map(v => (
                          <tr key={v.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 font-semibold text-gray-900">{v.name}</td>
                            <td className="py-3 px-4 text-center text-gray-600">{v.activeJobs}</td>
                            <td className="py-3 px-4 text-center text-gray-600">{v.onboardedColleges}</td>
                            <td className="py-3 px-4 text-center text-gray-600">{v.ziggedCandidates}</td>
                          </tr>
                        ))}
                        {company.verticals.length === 0 && (
                          <tr><td colSpan={4} className="py-6 text-center text-gray-500">No verticals added.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Gallery & Social Links */}
              <div className="p-6 border-b border-gray-100">
                <button onClick={() => toggleSection('gallery')} className="w-full text-[#f97316] font-bold flex items-center justify-between">
                  Gallery
                  {openSections.gallery ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
              <div className="p-6 border-b border-gray-100">
                <button onClick={() => toggleSection('social')} className="w-full text-[#f97316] font-bold flex items-center justify-between">
                  Social Links
                  {openSections.social ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
          {/* Members */}
          <div className="p-6">
            <h2 className="text-2xl font-black text-gray-900 mb-1">Members ({company.members.length})</h2>
            <p className="text-sm text-[#f97316] font-medium mb-6">
              No company admin assigned. You can't invite teammates or edit company details until you assign one.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-200">
                    <th className="py-3 font-medium">Name</th>
                    <th className="py-3 font-medium">Email</th>
                    <th className="py-3 font-medium"></th>
                    <th className="py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {company.members.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="py-4 text-[#f97316] font-medium">{m.name}</td>
                      <td className="py-4 text-gray-600">{m.email}</td>
                      <td className="py-4">
                        <select className="border border-gray-200 rounded px-3 py-1.5 text-sm bg-white focus:outline-none">
                          <option selected={m.role === 'Admin'}>Admin</option>
                          <option selected={m.role === 'Recruiter'}>Recruiter</option>
                          <option selected={m.role === 'Viewer'}>Viewer</option>
                        </select>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-6 text-xs font-bold text-gray-900">
                          <button className="flex items-center gap-1.5 hover:text-[#f97316]">
                            <span className="text-base">🛡</span> Make company admin
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-[#f97316]">
                            <span className="text-base">⇹</span> Move
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-[#f97316]">
                            <span className="text-base">👤-</span> Remove
                          </button>
                          <button className="flex items-center gap-1.5 text-red-500 hover:text-red-600">
                            <span className="text-base">🗑</span> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {company.members.length === 0 && (
                    <tr><td colSpan={4} className="py-6 text-center text-gray-500">No members.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="w-[300px] shrink-0">
        {/* <h3 className="text-[#f97316] font-bold mb-4">Company stats & Updates</h3>
        
        <Card className="p-5 border border-gray-100 shadow-sm rounded-xl bg-white flex flex-col gap-4">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Total Jobs Posted</span>
            <span className="text-2xl font-black text-[#f97316]">{company.campusJobsPosted}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#f0f4f8] rounded-xl p-3 flex flex-col justify-center">
              <span className="text-xs font-medium text-gray-900 mb-1">Active</span>
              <span className="text-xl font-medium text-teal-600">0</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-xs font-medium text-gray-900 mb-1">Closed</span>
              <span className="text-xl font-medium text-gray-600">3</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-xs font-medium text-gray-900 mb-1">Drafts</span>
              <span className="text-xl font-medium text-gray-600">0</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-gray-900">Candidates Assessed</span>
            <span className="text-xl font-black text-[#f97316]">0</span>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Candidates Hired</span>
            <span className="text-xl font-black text-teal-600">0</span>
          </div>

          <button 
            onClick={() => navigate(`/companies/${company.id}/jobs`)}
            className="w-full bg-[#003865] text-white font-bold py-3 rounded-lg hover:bg-[#002848] transition-colors mt-2"
          >
            View Jobs
          </button>
        </Card> */}
        <Card className="p-5 border border-gray-100 shadow-sm rounded-xl bg-white flex flex-col gap-4">
          <button className="w-full bg-white border border-[#003865] text-[#003865] font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Preview Company Page
          </button>
        </Card>
      </div>

      {/* Assign HR Modal */}
      {isAssignHrModalOpen && !isAddHrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-500 mb-2">Assign HR</label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <select className="w-full bg-[#f0f4f8] border-none rounded-lg px-4 py-3 text-sm focus:outline-none text-gray-500 appearance-none">
                    <option>Search By HR Name</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button 
                  onClick={() => setIsAddHrModalOpen(true)}
                  className="bg-[#e2e8f0] text-[#003865] px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#cbd5e1] transition-colors whitespace-nowrap"
                >
                  Create New HR
                </button>
              </div>

              <label className="block text-sm font-semibold text-gray-500 mt-6 mb-2">HRs</label>
              <div className="border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 flex items-center justify-center text-gray-300 mb-2">
                  <span className="text-3xl">👤+</span>
                </div>
                <p className="text-gray-300 text-sm font-medium">No HRs assigned yet</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-4 bg-white">
              <button 
                onClick={() => setIsAssignHrModalOpen(false)}
                className="px-8 py-2.5 rounded-lg border border-[#003865] text-[#003865] font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Skip For Now
              </button>
              <button 
                onClick={() => setIsAssignHrModalOpen(false)}
                className="bg-slate-400 text-white px-8 py-2.5 rounded-lg font-bold text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add HR Modal */}
      {isAddHrModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-[#f97316] text-2xl font-black">Add HR</h2>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Name<span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Name" className="w-full bg-white border border-[#f97316]/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#f97316]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Email Id<span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter Email Id" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Contact Number<span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-white border border-r-0 border-gray-200 rounded-l-lg text-[#f97316] text-sm">+91</span>
                  <input type="text" placeholder="Enter Contact Number" className="w-full bg-white border border-gray-200 rounded-r-lg px-4 py-2.5 text-sm focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-4 bg-white">
              <button 
                onClick={() => setIsAddHrModalOpen(false)}
                className="px-8 py-2.5 rounded-lg border border-[#003865] text-[#003865] font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsAddHrModalOpen(false);
                  setIsAssignHrModalOpen(false);
                }}
                className="bg-[#003865] text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-[#002848] transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
