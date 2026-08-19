import { useParams, Link } from 'react-router-dom';
import { getTpoById } from '../../data/tpos';
import { getCollegeById } from '../../data/colleges';
import { Avatar, Badge, statusTone, Card, SectionTitle, Button, EmptyState } from '../../components/ui';

export default function TPODetail() {
  const { id } = useParams();
  const tpo = getTpoById(id || '');
  if (!tpo) return <EmptyState label="TPO not found" />;
  const college = getCollegeById(tpo.collegeId);

  return (
    <div>
      <Link to="/users" className="text-xs text-gray-500 hover:text-gray-700">← Back to Users</Link>
      <div className="flex items-center justify-between mt-3 mb-5">
        <div className="flex items-center gap-4">
          <Avatar name={tpo.name} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">{tpo.name}</h1>
              <Badge tone={statusTone(tpo.status)}>{tpo.status}</Badge>
            </div>
            <p className="text-sm text-gray-500">{tpo.email} · {tpo.contact}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Edit</Button>
          <Button variant="danger">Deactivate</Button>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <SectionTitle action={college && <Link to={`/colleges/${college.id}`} className="text-xs text-purple-600">View College →</Link>}>
            College Information
          </SectionTitle>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div><dt className="text-gray-500">Name</dt><dd className="font-medium text-gray-800">{tpo.collegeName}</dd></div>
            <div><dt className="text-gray-500">Location</dt><dd className="font-medium text-gray-800">{tpo.city}, {tpo.state}</dd></div>
            <div><dt className="text-gray-500">Type</dt><dd className="font-medium text-gray-800">{tpo.collegeType}</dd></div>
          </dl>
        </Card>

        {college && (
          <Card className="p-4">
            <SectionTitle>College Statistics</SectionTitle>
            <div className="grid grid-cols-6 gap-3 text-sm">
              {[
                ['Total Students', college.totalStudents],
                ['Active Students', college.activeStudents],
                ['Total Jobs', college.totalJobs],
                ['Active Jobs', college.activeJobs],
                ['Placement Rate', `${college.placementRate}%`],
                ['Avg Package', college.avgPackage],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="text-gray-500 text-xs">{label}</p>
                  <p className="font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-4">
          <SectionTitle>Account Information</SectionTitle>
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div><dt className="text-gray-500">Role</dt><dd className="font-medium text-gray-800">tpo</dd></div>
            <div><dt className="text-gray-500">Created</dt><dd className="font-medium text-gray-800">{tpo.createdAt}</dd></div>
            <div><dt className="text-gray-500">Last Updated</dt><dd className="font-medium text-gray-800">{tpo.lastUpdated}</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
