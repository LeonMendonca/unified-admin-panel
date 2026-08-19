export interface LookupCompany {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  savedPeopleCount: number;
  dateAdded: string;
}

export interface LookupDepartment {
  id: string;
  companyId: string;
  name: string;
}

export interface LookupEmployee {
  id: string;
  companyId: string;
  name: string;
  title: string;
  email: string;
  seniority: string;
  location: string;
  salaryRange: string;
  linkedInUrl: string;
  enriched: boolean;
  departmentId: string | null;
  reportsToId: string | null;
}

export interface ApolloSearchResult {
  id: string;
  name: string;
  domain: string;
  founded: string;
  linkedInUrl: string;
}

// Initial Mock Data
export const initialSavedCompanies: LookupCompany[] = [
  { id: 'c-1', name: 'Fox Tale Agency', domain: 'foxtaleagency.com', industry: '-', size: '-', savedPeopleCount: 0, dateAdded: 'Aug 19, 2026' },
  { id: 'c-2', name: 'Fox Talent', domain: 'foxtalent.com.au', industry: '-', size: '-', savedPeopleCount: 0, dateAdded: 'Aug 11, 2026' },
  { id: 'c-3', name: 'ABC Test', domain: '123abc.com', industry: '-', size: '-', savedPeopleCount: 0, dateAdded: 'Aug 11, 2026' },
  { id: 'c-4', name: 'HEAVENLY SECRETS LIMITED', domain: '-', industry: '-', size: '-', savedPeopleCount: 0, dateAdded: 'Feb 22, 2026' },
  { id: 'c-5', name: 'Pilgrim', domain: 'discoverpilgrim.com', industry: '-', size: '-', savedPeopleCount: 266, dateAdded: 'Feb 8, 2026' },
  { id: 'c-6', name: 'Kapiva', domain: 'kapiva.in', industry: '-', size: '-', savedPeopleCount: 281, dateAdded: 'Feb 8, 2026' },
  { id: 'c-7', name: 'Foxtale', domain: 'foxtale.in', industry: '-', size: '-', savedPeopleCount: 204, dateAdded: 'Feb 2, 2026' }
];

export const initialDepartments: LookupDepartment[] = [
  { id: 'd-1', companyId: 'c-7', name: 'Sales' },
  { id: 'd-2', companyId: 'c-7', name: 'Human Resources' },
  { id: 'd-3', companyId: 'c-7', name: 'Marketing' },
  { id: 'd-4', companyId: 'c-7', name: 'Operations' },
  { id: 'd-5', companyId: 'c-7', name: 'Engineering Technical' },
  { id: 'd-6', companyId: 'c-7', name: 'Product Management' },
  { id: 'd-7', companyId: 'c-7', name: 'Design' },
  { id: 'd-8', companyId: 'c-7', name: 'Information Technology' }
];

export const initialEmployees: LookupEmployee[] = [
  { id: 'e-1', companyId: 'c-7', name: 'Tushar Choudhary', title: 'AI Product Manager', email: 'tushar@foxtale.in', seniority: 'Owner', location: 'Mumbai, Maharashtra, India', salaryRange: '₹20-35 LPA', linkedInUrl: 'https://linkedin.com/in/tushar', enriched: true, departmentId: 'd-6', reportsToId: null },
  { id: 'e-2', companyId: 'c-7', name: 'Anuj Sharma', title: 'Co-Founder', email: 'anuj@foxtale.in', seniority: 'Founder', location: 'Bengaluru, Karnataka, India', salaryRange: '₹90-210 LPA', linkedInUrl: 'https://linkedin.com/in/anuj', enriched: true, departmentId: null, reportsToId: null },
  { id: 'e-3', companyId: 'c-7', name: 'Lata Mahajan', title: 'Founder', email: 'lata@foxtale.in', seniority: 'Founder', location: 'Mumbai, Maharashtra, India', salaryRange: '₹32-85 LPA', linkedInUrl: 'https://linkedin.com/in/lata', enriched: true, departmentId: null, reportsToId: null },
  { id: 'e-4', companyId: 'c-7', name: 'Shantanu', title: 'Co-Founder', email: 'shantanu@foxtale.in', seniority: 'Founder', location: 'Bengaluru, Karnataka, India', salaryRange: '₹75-160 LPA', linkedInUrl: 'https://linkedin.com/in/shantanu', enriched: true, departmentId: null, reportsToId: null },
  { id: 'e-5', companyId: 'c-7', name: 'Ameve Sharma', title: 'Founder & CEO', email: 'ameve@foxtale.in', seniority: 'Founder', location: 'Bengaluru, Karnataka, India', salaryRange: '₹95-280 LPA', linkedInUrl: 'https://linkedin.com/in/ameve', enriched: true, departmentId: null, reportsToId: null },
  { id: 'e-6', companyId: 'c-7', name: 'Govindarajan Raghavan', title: 'Chief Innovation Officer', email: 'govind@foxtale.in', seniority: 'C-Suite', location: 'Bengaluru, Karnataka, India', salaryRange: '₹65-120 LPA', linkedInUrl: 'https://linkedin.com/in/govind', enriched: true, departmentId: 'd-5', reportsToId: 'e-5' },
  { id: 'e-7', companyId: 'c-7', name: 'Sunil Jaiswal', title: 'Chief Financial Officer', email: 'sunil@foxtale.in', seniority: 'C-Suite', location: 'Karnataka, India', salaryRange: '₹85-150 LPA', linkedInUrl: 'https://linkedin.com/in/sunil', enriched: true, departmentId: null, reportsToId: 'e-5' },
  { id: 'e-8', companyId: 'c-7', name: 'Prasanth Narra', title: 'Vice President', email: 'prasanth@foxtale.in', seniority: 'VP', location: 'Bengaluru, Karnataka, India', salaryRange: '₹70-120 LPA', linkedInUrl: 'https://linkedin.com/in/prasanth', enriched: true, departmentId: 'd-1', reportsToId: 'e-5' },
  // Adding a few employees for Kapiva (c-6) to test org chart if needed
  { id: 'e-9', companyId: 'c-6', name: 'Meenakshi Jalan', title: 'Co-Founder', email: 'meenakshi@kapiva.in', seniority: 'Founder', location: 'Mumbai, Maharashtra, India', salaryRange: '₹50-100 LPA', linkedInUrl: 'https://linkedin.com/in/meenakshi', enriched: true, departmentId: null, reportsToId: null },
  { id: 'e-10', companyId: 'c-6', name: 'Rima Naware', title: 'Co-Founder', email: 'rima@kapiva.in', seniority: 'Founder', location: 'Mumbai, Maharashtra, India', salaryRange: '₹50-100 LPA', linkedInUrl: 'https://linkedin.com/in/rima', enriched: true, departmentId: null, reportsToId: null },
  { id: 'e-11', companyId: 'c-6', name: 'Amit Verma', title: 'CTO', email: 'amit@kapiva.in', seniority: 'C-Suite', location: 'Mumbai, Maharashtra, India', salaryRange: '₹80-120 LPA', linkedInUrl: 'https://linkedin.com/in/amit', enriched: true, departmentId: null, reportsToId: 'e-9' },
];

export const apolloMockResults: ApolloSearchResult[] = [
  { id: 'a-1', name: 'Test Yantra', domain: 'testyantra.com', founded: '2007', linkedInUrl: '#' },
  { id: 'a-2', name: 'Test IO', domain: 'test.io', founded: '2011', linkedInUrl: '#' },
  { id: 'a-3', name: 'The Test Tribe', domain: 'thetesttribe.com', founded: '2018', linkedInUrl: '#' },
  { id: 'a-4', name: 'Testbook', domain: 'testbook.com', founded: '2013', linkedInUrl: '#' },
  { id: 'a-5', name: 'GRE® General Test', domain: 'takethegre.com', founded: '1947', linkedInUrl: '#' },
  { id: 'a-6', name: 'TEST Angola', domain: 'testangola.com', founded: '2004', linkedInUrl: '#' }
];

export const seniorityLevels = [
  { id: 'Owner', label: 'Owner', desc: 'Business owners' },
  { id: 'Founder', label: 'Founder', desc: 'Company founders' },
  { id: 'C-Suite', label: 'C-Suite', desc: 'C-level executives' },
  { id: 'Partner', label: 'Partner', desc: 'Partners' },
  { id: 'VP', label: 'VP', desc: 'Vice Presidents' },
  { id: 'Head', label: 'Head', desc: 'Heads of departments' },
  { id: 'Director', label: 'Director', desc: 'Directors' },
  { id: 'Manager', label: 'Manager', desc: 'Managers' },
  { id: 'Senior', label: 'Senior', desc: 'Senior contributors' },
  { id: 'Entry', label: 'Entry', desc: 'Entry-level' },
  { id: 'Intern', label: 'Intern', desc: 'Interns' }
];

// Data access functions
export function getSavedCompanies(): LookupCompany[] {
  const v = localStorage.getItem('zigme_lookup_companies');
  return v ? JSON.parse(v) : initialSavedCompanies;
}

export function saveCompanies(data: LookupCompany[]) {
  localStorage.setItem('zigme_lookup_companies', JSON.stringify(data));
}

export function getSavedDepartments(): LookupDepartment[] {
  const v = localStorage.getItem('zigme_lookup_departments');
  return v ? JSON.parse(v) : initialDepartments;
}

export function saveDepartments(data: LookupDepartment[]) {
  localStorage.setItem('zigme_lookup_departments', JSON.stringify(data));
}

export function getSavedEmployees(): LookupEmployee[] {
  const v = localStorage.getItem('zigme_lookup_employees');
  return v ? JSON.parse(v) : initialEmployees;
}

export function saveEmployees(data: LookupEmployee[]) {
  localStorage.setItem('zigme_lookup_employees', JSON.stringify(data));
}
