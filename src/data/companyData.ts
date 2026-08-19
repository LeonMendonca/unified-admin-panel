export interface CompanyMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Recruiter' | 'Viewer';
}

export interface CompanyLocation {
  id: string;
  location: string;
  email: string;
  contactNumber: string;
}

export interface CompanyVertical {
  id: string;
  name: string;
  activeJobs: number;
  onboardedColleges: number;
  ziggedCandidates: number;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  website: string;
  industry: string;
  logoUrl: string;
  linkedInUrl: string;
  employeeCount: string;
  foundedYear: string;
  verified: boolean;
  hasCampusAccess: boolean;

  // Hiring List View Extras
  membersCount: number;
  status: string; // e.g., 'No company admin', 'Activated', 'Deactivated'
  createdDate: string;

  // Campus List View Extras
  campusJobsPosted: number;
  hrCount: number;
  paymentPlan: string;
  contactNo: string;
  contactEmail: string;
  lastUpdated: string;

  // Campus-linked details
  contactPerson: string;
  alternateContactNo: string;
  typeOfCompany: string; // e.g., 'Private'
  assignedHRs: { id: string; name: string; email: string }[];
  locations: CompanyLocation[];
  verticals: CompanyVertical[];
  gallery: string[];
  socialLinks: { platform: string; url: string }[];
  members: CompanyMember[];
}

export const mockCompanies: Company[] = [
  {
    id: 'comp_1',
    name: '1minfootball',
    domain: '1minfootball.com',
    website: 'https://1minfootball.com/',
    industry: 'Sports',
    logoUrl: 'https://ui-avatars.com/api/?name=1minfootball&background=0D8ABC&color=fff',
    linkedInUrl: '',
    employeeCount: '51-200',
    foundedYear: '2015',
    verified: true,
    hasCampusAccess: true,

    membersCount: 1,
    status: 'Activated',
    createdDate: 'Aug 18, 2026',

    campusJobsPosted: 2,
    hrCount: 1,
    paymentPlan: 'Starter',
    contactNo: '9461577021',
    contactEmail: 'info@1minfootball.com',
    lastUpdated: '11:26 AM On 18/06/2026',

    contactPerson: 'Shrey',
    alternateContactNo: '',
    typeOfCompany: 'Private',
    assignedHRs: [{ id: 'hr_1', name: 'Shrey', email: 'info@1minfootball.com' }],
    locations: [
      { id: 'loc_1', location: 'Mumbai (mumbai suburban)', email: 'info@1minfootball.com', contactNumber: '9461577021' },
    ],
    verticals: [
      { id: 'v_1', name: 'Creative Merchandising', activeJobs: 0, onboardedColleges: 0, ziggedCandidates: 0 },
      { id: 'v_2', name: 'Content Creation', activeJobs: 0, onboardedColleges: 0, ziggedCandidates: 0 },
    ],
    gallery: [],
    socialLinks: [],
    members: [
      { id: 'mem_1', name: 'hr', email: 'hr@slci.in', role: 'Recruiter' },
    ]
  },
  {
    id: 'comp_2',
    name: 'Shakti Legal Compliance India',
    domain: 'slci.in',
    website: 'https://slci.in/',
    industry: 'Other',
    logoUrl: '',
    linkedInUrl: '',
    employeeCount: '51-200',
    foundedYear: '2010',
    verified: false,
    hasCampusAccess: true,

    membersCount: 1,
    status: 'No company admin',
    createdDate: 'Aug 18, 2026',

    campusJobsPosted: 0,
    hrCount: 1,
    paymentPlan: '-',
    contactNo: '9988776655',
    contactEmail: 'admin@slci.in',
    lastUpdated: '10:00 AM On 18/08/2026',

    contactPerson: 'Admin',
    alternateContactNo: '',
    typeOfCompany: 'Private',
    assignedHRs: [],
    locations: [],
    verticals: [],
    gallery: [],
    socialLinks: [],
    members: []
  },
  {
    id: 'comp_3',
    name: 'Aiolos Cloud Solutions Pvt. Ltd.',
    domain: 'aiolos.cloud',
    website: 'https://aiolos.cloud/',
    industry: 'Information Technology Services',
    logoUrl: '',
    linkedInUrl: '',
    employeeCount: '11-50',
    foundedYear: '2020',
    verified: true,
    hasCampusAccess: true,

    membersCount: 2,
    status: 'Activated',
    createdDate: 'Aug 17, 2026',

    campusJobsPosted: 3,
    hrCount: 2,
    paymentPlan: 'Pro',
    contactNo: '9123456780',
    contactEmail: 'hello@aiolos.cloud',
    lastUpdated: '12:00 PM On 17/08/2026',

    contactPerson: 'Jane Doe',
    alternateContactNo: '',
    typeOfCompany: 'Private',
    assignedHRs: [],
    locations: [
      { id: 'loc_2', location: 'Mumbai', email: 'careers@aiolos.cloud', contactNumber: '9123456780' }
    ],
    verticals: [
      { id: 'v_3', name: 'Coding', activeJobs: 2, onboardedColleges: 1, ziggedCandidates: 5 },
      { id: 'v_4', name: 'Founder\'s Office', activeJobs: 1, onboardedColleges: 0, ziggedCandidates: 1 },
    ],
    gallery: [],
    socialLinks: [],
    members: []
  },
  {
    id: 'comp_4',
    name: 'ABC Pvt. Ltd.',
    domain: 'abc.com',
    website: '',
    industry: 'Education',
    logoUrl: '',
    linkedInUrl: '',
    employeeCount: '1-10',
    foundedYear: '2022',
    verified: false,
    hasCampusAccess: false,

    membersCount: 0,
    status: 'Deactivated',
    createdDate: 'Aug 14, 2026',

    campusJobsPosted: 0,
    hrCount: 0,
    paymentPlan: '-',
    contactNo: '-',
    contactEmail: 'unknown+221@zigme.in',
    lastUpdated: '5:33 PM On 14/08/2026',

    contactPerson: '',
    alternateContactNo: '',
    typeOfCompany: '',
    assignedHRs: [],
    locations: [],
    verticals: [],
    gallery: [],
    socialLinks: [],
    members: []
  }
];

export interface CompanyJob {
  id: string;
  title: string;
  vertical: string;
  locations: string;
  applications: number;
  hired: number;
  postedOn: string;
}

export const mockCompanyJobs: CompanyJob[] = [
  { id: 'cj_1', title: 'Full Stack Developer - Python', vertical: 'Coding', locations: 'Mumbai', applications: 2, hired: 1, postedOn: '22 Apr 2026' },
  { id: 'cj_2', title: 'Full Stack Developer - MERN', vertical: 'Coding', locations: 'Mumbai', applications: 0, hired: 1, postedOn: '22 Apr 2026' },
  { id: 'cj_3', title: 'Chief Of Staff - Strategy & Growth (Founder\'s Office)', vertical: 'Founder\'s Office', locations: 'Mumbai', applications: 5, hired: 1, postedOn: '22 Apr 2026' },
];
