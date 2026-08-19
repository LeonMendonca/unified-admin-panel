export interface ActiveJob {
  id: string;
  title: string;
  company: string;
  location: string;
  expBand: string;
  minDegreeRank: number;
  skillsCount: number;
  lastEmbed: string;
  vectorStatus: 'Present' | 'Missing';
}

export interface PastRun {
  id: string;
  name: string;
  started: string;
  jobId: string;
  topN: number;
  found: number;
  status: 'Matched' | 'Pending' | 'Failed';
}

export interface OutreachHistory {
  id: string;
  when: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  status: 'sent' | 'failed' | 'skipped_no_email' | 'skipped_dedupe';
  note: string;
}

export interface JobVariant {
  id: string;
  title: string;
  location: string;
  isActive: boolean;
  isPublic: boolean;
  deadline: string;
}

export interface JobFamily {
  id: string;
  title: string;
  company: string;
  locations: string[];
  jobType: 'apprenticeship' | 'full_time' | 'internship' | 'part_time';
  rawText: string;
  variants: JobVariant[];
}

// 1. Seed Active Jobs for Picking
export const seedActiveJobs: ActiveJob[] = [
  {
    id: 'job-1',
    title: 'Compliance Executive',
    company: 'Shakti Legal Compliance India',
    location: 'Delhi',
    expBand: '60-96 mo',
    minDegreeRank: 4,
    skillsCount: 3,
    lastEmbed: '19/08/2026 03:30',
    vectorStatus: 'Present',
  },
  {
    id: 'job-2',
    title: 'HR Executive',
    company: 'KIRAS TECH',
    location: 'Hyderbada MADHUPUR, AMEERPET',
    expBand: '12-36 mo',
    minDegreeRank: 3,
    skillsCount: 4,
    lastEmbed: '18/08/2026 15:45',
    vectorStatus: 'Present',
  },
  {
    id: 'job-3',
    title: 'Sales Officer',
    company: 'Hdb finance',
    location: 'Rajkot',
    expBand: '0-24 mo',
    minDegreeRank: 2,
    skillsCount: 2,
    lastEmbed: '19/08/2026 11:20',
    vectorStatus: 'Present',
  },
  {
    id: 'job-4',
    title: 'Payroll Executive',
    company: 'Shakti Legal Compliance India',
    location: 'Delhi',
    expBand: '24-48 mo',
    minDegreeRank: 3,
    skillsCount: 3,
    lastEmbed: '17/08/2026 10:00',
    vectorStatus: 'Present',
  },
  {
    id: 'job-5',
    title: 'Edtech Sales Representative',
    company: 'uCertify',
    location: 'Mulund Mumbai',
    expBand: '6-18 mo',
    minDegreeRank: 2,
    skillsCount: 5,
    lastEmbed: '19/08/2026 09:15',
    vectorStatus: 'Present',
  },
];

// 2. Seed Past Runs
export const seedPastRuns: PastRun[] = [
  {
    id: 'run-1',
    name: 'BD Zigme run 1',
    started: '06/06/2026 22:42',
    jobId: 'a/Jb59cc',
    topN: 50,
    found: 42,
    status: 'Matched',
  },
];

// 3. Seed Outreach History
export const seedOutreach: OutreachHistory[] = [
  {
    id: 'o-1',
    when: '24/06/2026 14:47',
    candidateName: 'Vaishali Phalke',
    candidateEmail: 'phalkealka07@gmail.com',
    jobTitle: 'Senior Accountant',
    companyName: 'ZigMe - Make Dreams Work',
    status: 'sent',
    note: 'This is a trial email sent by Amit. forward the email to amit@zigme.in',
  },
  {
    id: 'o-2',
    when: '24/06/2026 14:47',
    candidateName: 'Vaishali Kacharnath Phalke',
    candidateEmail: 'phalkevaishali02@gmail.com',
    jobTitle: 'Senior Accountant',
    companyName: 'ZigMe - Make Dreams Work',
    status: 'sent',
    note: 'This is a trial email sent by Amit. forward the email to amit@zigme.in',
  },
  {
    id: 'o-3',
    when: '23/06/2026 11:20',
    candidateName: 'John Doe',
    candidateEmail: 'johndoe@test.com',
    jobTitle: 'HR Recruiter',
    companyName: 'KIRAS TECH',
    status: 'failed',
    note: 'SMTP Connection timeout. Retrying queue.',
  },
];

// 4. Seed Job Families
export const seedJobFamilies: JobFamily[] = [
  {
    id: 'fam-1',
    title: 'Store Sales Executive [ Freshers ]',
    company: 'Tata Croma',
    locations: [
      'Bengaluru', 'Chandigarh', 'Chennai', 'Dehradun', 'Faridabad', 'Ferozepur',
      'Greater Noida', 'Gurugram', 'Hyderabad', 'Jalna', 'Ludhiana', 'Mumbai',
      'Nashik', 'Panipat', 'Pathankot', 'Pune', 'Sangamner(Ahilyanagar)', 'Sonipat'
    ],
    jobType: 'apprenticeship',
    rawText: 'raw: Store Sales Executive [ Freshers ] - Nashik, Sangamner(Ahilyanagar), Jalna',
    variants: [
      { id: 'var-1-1', title: 'Store Sales Executive [ Freshers ] - Nashik', location: 'Nashik', isActive: true, isPublic: true, deadline: '25/08/2026' },
      { id: 'var-1-2', title: 'Store Sales Executive [ Freshers ] - Jalna', location: 'Jalna', isActive: true, isPublic: true, deadline: '22/08/2026' },
      { id: 'var-1-3', title: 'Store Sales Executive [ Freshers ] - Sangamner', location: 'Sangamner(Ahilyanagar)', isActive: false, isPublic: false, deadline: '15/07/2026' }
    ]
  },
  {
    id: 'fam-2',
    title: 'senior software engineer',
    company: 'ZigMe test Company',
    locations: ['Hyderabad', 'hyderabad', 'mumbai'],
    jobType: 'full_time',
    rawText: 'raw: senior software engineer - Hyderabad, mumbai',
    variants: [
      { id: 'var-2-1', title: 'senior software engineer', location: 'hyderabad', isActive: true, isPublic: false, deadline: '27/08/2026' },
      { id: 'var-2-2', title: 'Senior Software Engineer', location: 'Hyderabad', isActive: true, isPublic: true, deadline: '22/08/2026' },
      { id: 'var-2-3', title: 'senior software engineer', location: 'hyderabad,mumbai', isActive: false, isPublic: false, deadline: '30/04/2026' },
      { id: 'var-2-4', title: 'Senior Software Engineer', location: 'mumbai', isActive: false, isPublic: false, deadline: '05/06/2026' },
      { id: 'var-2-5', title: 'senior software engineer', location: 'hyderabad', isActive: false, isPublic: true, deadline: '31/07/2026' }
    ]
  }
];

// Helper to pull all raw listings for the Merge Popup
export const seedAllRawJobs = [
  { id: 'raw-1', title: 'Store Sales Executive [Experienced] - Pan India', company: 'Tata Croma', location: 'Mumbai' },
  { id: 'raw-2', title: 'Store Sales Executive [Freshers] - Pan India', company: 'Tata Croma', location: 'Mumbai' },
  { id: 'raw-3', title: 'Store Sales Executive [Freshers] - Hyderabad', company: 'Tata Croma', location: 'Hyderabad' },
  { id: 'raw-4', title: 'Accounts Executive / Cashier - Experienced - Mumbai', company: 'Tata Croma', location: 'Mumbai' },
  { id: 'raw-5', title: 'Store Sales Executive [Freshers] - Pune', company: 'Tata Croma', location: 'Pune' },
  { id: 'raw-6', title: 'Inventory Executive - Experienced - Mumbai', company: 'Tata Croma', location: 'Mumbai' },
  { id: 'raw-7', title: 'Accounts Executive / Cashier - Pune', company: 'Tata Croma', location: 'Pune' },
  { id: 'raw-8', title: 'Store Sales Executive [Freshers] - Mumbai', company: 'Tata Croma', location: 'Mumbai' }
];

export const getStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(`zigme_jobs_${key}`);
  if (stored) {
    try {
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
};

export const setStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(`zigme_jobs_${key}`, JSON.stringify(data));
};
