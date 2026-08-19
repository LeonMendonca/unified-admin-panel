import { useParams, Link } from 'react-router-dom';
import { getCompanyById } from '../../data/companies';
import { Badge, statusTone, Card, SectionTitle, Button, EmptyState } from '../../components/ui';

export default function CompanyDetail() {
  const { id } = useParams();
  const company = getCompanyById(id || '');
  if (!company) return <EmptyState label="Company not found" />;

  return (
    <div>
      <Link to="/companies" className="text-xs text-gray-500 hover:text-gray-700">← Back to Companies</Link>

      <div className="flex items-center justify-between mt-3 mb-5">
        <div className="flex items-center gap-4">
          <img src={company.logo} className="w-14 h-14 rounded-lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">{company.name}</h1>
              {company.verified ? <Badge tone="green">Verified</Badge> : <Badge tone="gray">Not verified</Badge>}
            </div>
            <p className="text-sm text-gray-500">{company.industry} · {company.domain}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Enrich from Apollo</Button>
          <Button variant="secondary">Merge into…</Button>
          <Button variant="danger">Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-4">
            <SectionTitle>Basic Info</SectionTitle>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-gray-500">Website</dt><dd className="font-medium text-gray-800">{company.website}</dd></div>
              <div><dt className="text-gray-500">LinkedIn</dt><dd className="font-medium text-gray-800">{company.linkedin}</dd></div>
              <div><dt className="text-gray-500">Employee count</dt><dd className="font-medium text-gray-800">{company.employeeCount}</dd></div>
              <div><dt className="text-gray-500">Founded year</dt><dd className="font-medium text-gray-800">{company.foundedYear}</dd></div>
            </dl>
          </Card>

          <Card className="p-4">
            <SectionTitle>Contact Information</SectionTitle>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-gray-500">Email</dt><dd className="font-medium text-gray-800">{company.contactInfo.email}</dd></div>
              <div><dt className="text-gray-500">Phone</dt><dd className="font-medium text-gray-800">{company.contactInfo.phone}</dd></div>
              <div className="col-span-2"><dt className="text-gray-500">Address</dt><dd className="font-medium text-gray-800">{company.contactInfo.address}</dd></div>
            </dl>
          </Card>

          <Card className="p-4">
            <SectionTitle>Administrative Details</SectionTitle>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div><dt className="text-gray-500">Registration No.</dt><dd className="font-medium text-gray-800">{company.administrativeDetails.registrationNumber}</dd></div>
              <div><dt className="text-gray-500">GST No.</dt><dd className="font-medium text-gray-800">{company.administrativeDetails.gstNumber}</dd></div>
              <div><dt className="text-gray-500">PAN No.</dt><dd className="font-medium text-gray-800">{company.administrativeDetails.panNumber}</dd></div>
            </dl>
          </Card>

          <Card className="p-4">
            <SectionTitle>Locations & Verticals</SectionTitle>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {company.locations.map((l) => <Badge key={l}>{l}</Badge>)}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {company.verticals.map((v) => <Badge key={v} tone="purple">{v}</Badge>)}
            </div>
          </Card>

          <Card className="p-4">
            <SectionTitle>Gallery</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {company.gallery.map((g) => <img key={g} src={g} className="rounded-md w-full h-32 object-cover" />)}
            </div>
          </Card>

          <Card className="p-4">
            <SectionTitle>Social Links</SectionTitle>
            <div className="space-y-1.5 text-sm">
              {company.socialLinks.map((s) => (
                <div key={s.platform} className="flex justify-between">
                  <span className="text-gray-500">{s.platform}</span>
                  <span className="text-purple-600">{s.url}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <SectionTitle>Members ({company.members.length})</SectionTitle>
            {!company.companyAdminAssigned && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5 mb-3">
                No company admin assigned. Nobody here can invite teammates or edit company details until you assign one.
              </p>
            )}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Email</th>
                  <th className="py-2 font-medium">Role</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {company.members.map((m) => (
                  <tr key={m.email}>
                    <td className="py-2 text-gray-800">{m.name}</td>
                    <td className="py-2 text-gray-600">{m.email}</td>
                    <td className="py-2 text-gray-600">{m.role}</td>
                    <td className="py-2 text-xs text-purple-600 space-x-2">
                      <button>Make company admin</button>
                      <button>Move</button>
                      <button>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <Button className="w-full text-center block">Preview Company Page</Button>
          </Card>

          <Card className="p-4">
            <SectionTitle>Stats</SectionTitle>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Active jobs</dt><dd className="font-semibold text-gray-800">{company.activeJobs}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Total applications</dt><dd className="font-semibold text-gray-800">{company.totalApplications}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Company admin</dt><dd>{company.companyAdminAssigned ? <Badge tone="green">Assigned</Badge> : <Badge tone="red">Missing</Badge>}</dd></div>
            </dl>
          </Card>

          {company.campusLinked && (
            <Card className="p-4">
              <SectionTitle>Campus</SectionTitle>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-600">Access status</span>
                <Badge tone={statusTone(company.campusAccessStatus)}>{company.campusAccessStatus}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">Campus jobs posted: <span className="font-medium text-gray-800">{Math.round(company.activeJobs * 0.6)}</span></p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">Activate</Button>
                <Button size="sm" variant="secondary">Deactivate</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
