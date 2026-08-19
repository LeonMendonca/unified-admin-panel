import type { Company } from './types';

const companyNames = [
  'Acme Technologies', 'Nimbus Cloud', 'Bluepeak Software', 'Vertex Analytics',
  'Orbit Retail', 'Skyline Finserv', 'Quantum Health', 'Harbor Logistics',
  'Crestline Media', 'Pinecone AI',
];

const industries = ['Information Technology', 'Cloud Computing', 'Software', 'Data & Analytics', 'Retail', 'Finance', 'Healthcare', 'Logistics', 'Media', 'Artificial Intelligence'];

export const companies: Company[] = companyNames.map((name, i) => {
  const id = `comp-${i + 1}`;
  const domain = `${name.toLowerCase().replace(/[^a-z]/g, '')}.com`;
  const campusLinked = i % 3 === 0;
  const companyAdminAssigned = i % 4 !== 0;
  return {
    id,
    name,
    domain,
    website: `https://${domain}`,
    industry: industries[i],
    logo: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
    linkedin: `https://linkedin.com/company/${domain.split('.')[0]}`,
    employeeCount: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'][i % 6],
    foundedYear: 1998 + i * 2,
    verified: i % 2 === 0,
    companyAdminAssigned,
    campusLinked,
    campusAccessStatus: campusLinked ? (['Approved', 'Pending', 'Not requested', 'Rejected'][i % 4] as Company['campusAccessStatus']) : 'Not requested',
    activeJobs: 3 + (i % 5),
    totalApplications: 120 + i * 37,
    members: [
      { name: `${name.split(' ')[0]} HR Lead`, email: `hr.lead@${domain}`, role: companyAdminAssigned ? 'Company Admin' : 'Member' },
      { name: `${name.split(' ')[0]} Recruiter`, email: `recruiter@${domain}`, role: 'Member' },
    ],
    contactInfo: {
      email: `contact@${domain}`,
      phone: `+91 90${i}1122334`,
      address: `${100 + i}, Business Park, Bengaluru, Karnataka`,
    },
    administrativeDetails: {
      registrationNumber: `REG-${10000 + i}`,
      gstNumber: `29AAAAA${1000 + i}A1Z${i}`,
      panNumber: `AAAAA${1000 + i}A`,
    },
    locations: ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Remote'].slice(0, 1 + (i % 4)),
    verticals: ['SaaS', 'Consumer', 'Enterprise', 'B2B', 'D2C'].slice(0, 1 + (i % 3)),
    gallery: [
      `https://picsum.photos/seed/${id}-1/400/300`,
      `https://picsum.photos/seed/${id}-2/400/300`,
    ],
    socialLinks: [
      { platform: 'LinkedIn', url: `https://linkedin.com/company/${domain.split('.')[0]}` },
      { platform: 'Twitter', url: `https://twitter.com/${domain.split('.')[0]}` },
    ],
  };
});

export function getCompanyById(id: string) {
  return companies.find((c) => c.id === id) || null;
}
