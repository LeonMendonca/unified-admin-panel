export type CandidateSource = 'Manual' | 'Resume Upload' | 'ZigMe' | 'Campus';
export type CandidateStatus = 'Active' | 'Suspended';

export interface GlobalCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: CandidateSource;
  applicationsCount: number;
  status: CandidateStatus;
  createdAt: string;
}

export interface CandidateJobApplication {
  id: string;
  candidateId: string;
  jobTitle: string;
  department: string;
  company: string;
  jdMatchScore: number;
  flowStatus: string;
  appliedDate: string;
  stepsTotal: number;
  stepsCompleted: number;
  currentStep: string;
}

export const seedCandidates: GlobalCandidate[] = [
  {
    id: 'c-101',
    name: 'Sai Pavani Yamsani',
    email: 'ysaipavani053@gmail.com',
    phone: '+91 9441108235',
    source: 'ZigMe',
    applicationsCount: 1,
    status: 'Active',
    createdAt: '19/8/2026',
  },
  {
    id: 'c-102',
    name: 'Ankit Kumar',
    email: 'ankitfreefire1185@gmail.com',
    phone: '',
    source: 'ZigMe',
    applicationsCount: 6,
    status: 'Active',
    createdAt: '19/8/2026',
  },
  {
    id: 'c-103',
    name: 'Bashaboina Susmitha',
    email: 'bashaboinasusmitha@gmail.com',
    phone: '',
    source: 'ZigMe',
    applicationsCount: 1,
    status: 'Active',
    createdAt: '19/8/2026',
  },
  {
    id: 'c-104',
    name: 'Sufiyan Zubair',
    email: 'sk5459299@gmail.com',
    phone: '+91 8218341574',
    source: 'ZigMe',
    applicationsCount: 1,
    status: 'Active',
    createdAt: '19/8/2026',
  },
  {
    id: 'c-105',
    name: 'Harish Bisht',
    email: 'Hrharishbisht@gmail.com',
    phone: '+91 8506995574',
    source: 'Resume Upload',
    applicationsCount: 1,
    status: 'Active',
    createdAt: '19/8/2026',
  },
  {
    id: 'c-106',
    name: 'Shaik Subhan',
    email: 'raffanshaik786@gmail.com',
    phone: '+91 8790770586',
    source: 'ZigMe',
    applicationsCount: 1,
    status: 'Active',
    createdAt: '19/8/2026',
  },
  {
    id: 'c-107',
    name: 'Anuragini Tripathi',
    email: 'tripathianuragini853@gmail.com',
    phone: '+91 9828221582',
    source: 'Resume Upload',
    applicationsCount: 1,
    status: 'Active',
    createdAt: '19/8/2026',
  },
  {
    id: 'c-108',
    name: 'Amaan Kazi',
    email: 'amaankazi10225@gmail.com',
    phone: '+91 9082488629',
    source: 'Campus',
    applicationsCount: 2,
    status: 'Active',
    createdAt: '19/8/2026',
  },
  {
    id: 'c-109',
    name: 'Amaan Qureshi',
    email: 'amaan.qureshi@example.com',
    phone: '+91 9876543210',
    source: 'Manual',
    applicationsCount: 1,
    status: 'Suspended',
    createdAt: '18/8/2026',
  }
];

export const seedApplications: Record<string, CandidateJobApplication[]> = {
  'c-108': [
    {
      id: 'app-1',
      candidateId: 'c-108',
      jobTitle: 'Backend Developer - Python/Node',
      department: 'Engineering',
      company: 'Chien technologies pvt ltd.',
      jdMatchScore: 85,
      flowStatus: 'Not started',
      appliedDate: '23/8/2025',
      stepsTotal: 5,
      stepsCompleted: 0,
      currentStep: 'JD Match',
    }
  ],
  'c-109': [
    {
      id: 'app-2',
      candidateId: 'c-109',
      jobTitle: 'Frontend React Developer',
      department: 'Engineering',
      company: 'Tech Solutions Inc.',
      jdMatchScore: 44,
      flowStatus: 'In progress',
      appliedDate: '10/8/2025',
      stepsTotal: 3,
      stepsCompleted: 1,
      currentStep: 'Speed Interview',
    }
  ],
};

export const GLOBAL_HIRING_STEPS = ['JD Match', 'Speed Interview', 'Normal Interview', 'Job Offer'];

export function getStorage<T>(key: string, defaultVal: T): T {
  const v = localStorage.getItem(`zigme_candidates_${key}`);
  return v ? JSON.parse(v) : defaultVal;
}

export function setStorage<T>(key: string, val: T) {
  localStorage.setItem(`zigme_candidates_${key}`, JSON.stringify(val));
}
