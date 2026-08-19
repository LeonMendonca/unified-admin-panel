export type AccessRequestStatus = 'Approved' | 'Rejected' | 'Pending';
export type AccessRequestType = 'Campus' | 'Company' | 'User Requests';

export interface MatchingCollege {
  id: string;
  name: string;
  code: string;
  location: string;
  claimStatus: 'Unclaimed' | 'Claimed';
}

export interface AccessRequest {
  id: string;
  serialNumber: number;
  name: string;
  status: AccessRequestStatus;
  email: string;
  organization: string;
  location: string;
  pincode: string;
  website: string;
  requestType: AccessRequestType;
  phone: string;
  instituteType: string;
  submittedDate: string;
  matchingColleges: MatchingCollege[];
}

const mockColleges: MatchingCollege[] = [
  { id: 'mc-1', name: 'Cambridge Group of Institutons (CIT)', code: 'ACAB43', location: 'Bengaluru, Karnataka', claimStatus: 'Unclaimed' },
  { id: 'mc-2', name: 'Hasanath College for Women', code: 'AHAB45', location: 'Bengaluru, Karnataka', claimStatus: 'Unclaimed' },
  { id: 'mc-3', name: 'R. V. College of Commerce', code: 'ARVB34', location: 'Bengaluru, Karnataka', claimStatus: 'Unclaimed' },
  { id: 'mc-4', name: 'Karnataka University', code: 'AKAB40', location: 'Bengaluru, Karnataka', claimStatus: 'Unclaimed' }
];

export const accessRequests: AccessRequest[] = [
  {
    id: '1C378D10',
    serialNumber: 1,
    name: 'sushanth k',
    status: 'Approved',
    email: 'sushanth.k+tpo_testing571@zigm...',
    organization: 'zigme test 570',
    location: 'pune',
    pincode: '500076',
    website: 'https://zigme.in',
    requestType: 'Campus',
    phone: '9620213239',
    instituteType: 'private',
    submittedDate: '10th August 2026',
    matchingColleges: mockColleges
  },
  {
    id: 'AR-2',
    serialNumber: 2,
    name: 'sushanth k',
    status: 'Rejected',
    email: 'sushanth.k+tpo_testing570@zig...',
    organization: 'zigme 570',
    location: 'hyderabad',
    pincode: '500076',
    website: 'https://zigme.in',
    requestType: 'Campus',
    phone: '9620213239',
    instituteType: 'private',
    submittedDate: '10th August 2026',
    matchingColleges: mockColleges
  },
  {
    id: 'AR-3',
    serialNumber: 3,
    name: 'Dr. Ajay Shrivastava',
    status: 'Pending',
    email: 'profajayshrivastava@gmail.com',
    organization: 'IIIT Bhopal',
    location: 'MANIT CAMPUS,NEW TEACHIN...',
    pincode: '462003',
    website: 'www.iiitbhopal.ac.in',
    requestType: 'Campus',
    phone: '9620213239',
    instituteType: 'public',
    submittedDate: '10th August 2026',
    matchingColleges: mockColleges
  },
  {
    id: 'AR-4',
    serialNumber: 4,
    name: 'Swamy Rao Kulkarni',
    status: 'Approved',
    email: 'placements@avanthi.edu.in',
    organization: 'Avanthi Institute of Engineering & Tech...',
    location: 'Guntapally(V), Abdullapurmet(...',
    pincode: '501512',
    website: 'www.aietg.ac.in',
    requestType: 'Campus',
    phone: '9620213239',
    instituteType: 'private',
    submittedDate: '10th August 2026',
    matchingColleges: mockColleges
  },
  {
    id: 'AR-5',
    serialNumber: 5,
    name: 'DR SHANMUGA SUND...',
    status: 'Approved',
    email: 'shanmugham.viswanathan@gmal...',
    organization: 'dhanalakshmi srinivasan group of intt',
    location: 'perambalur',
    pincode: '621212',
    website: 'www.dsgroupmail.com',
    requestType: 'Campus',
    phone: '9620213239',
    instituteType: 'private',
    submittedDate: '10th August 2026',
    matchingColleges: mockColleges
  },
  {
    id: 'AR-6',
    serialNumber: 6,
    name: 'Vijay Kumar K',
    status: 'Approved',
    email: 'stannsplacement@stannscollege...',
    organization: "St. Ann's College for Women",
    location: 'Hyderabad, Telangana 500006',
    pincode: '500006',
    website: 'www.stannscollege.in',
    requestType: 'Campus',
    phone: '9620213239',
    instituteType: 'private',
    submittedDate: '10th August 2026',
    matchingColleges: mockColleges
  },
  {
    id: 'AR-7',
    serialNumber: 7,
    name: 'DEEPAK MEGHWAL',
    status: 'Rejected',
    email: 'deepakhalu2@gmail.com',
    organization: 'Bhagwant University Ajmer',
    location: 'BU Main Campus, Chachiyavas...',
    pincode: '305023',
    website: 'http://bhagwantuniversity...',
    requestType: 'Campus',
    phone: '9620213239',
    instituteType: 'private',
    submittedDate: '10th August 2026',
    matchingColleges: mockColleges
  },
  {
    id: 'AR-8',
    serialNumber: 8,
    name: 'Ketan Somnath Shend...',
    status: 'Rejected',
    email: 'ketanshendkar2005@gmail.com',
    organization: 'Siddhant college of engineering',
    location: 'Chakan Talegaon road ,sudum...',
    pincode: '410501',
    website: 'https://siddhantcollege.in',
    requestType: 'Campus',
    phone: '9620213239',
    instituteType: 'private',
    submittedDate: '10th August 2026',
    matchingColleges: mockColleges
  },
  {
    id: '1C378D11',
    serialNumber: 9,
    name: 'Kavitha A',
    status: 'Pending',
    email: 'director.crd@nsb.edu.in',
    organization: 'NSB Bangalore',
    location: 'Sy.No.85, Singena Agrahara, Huskur Post Anekal Taluk, Near E-City P-II, Bangalore – 560099 India',
    pincode: '560099',
    website: 'www.nsb.edu.in',
    requestType: 'Campus',
    phone: '9620213239',
    instituteType: 'private',
    submittedDate: '10th August 2026',
    matchingColleges: mockColleges
  }
];

let requestsState = [...accessRequests];

export function getAccessRequests(): AccessRequest[] {
  const stored = localStorage.getItem('zigme_access_requests');
  if (stored) {
    return JSON.parse(stored);
  }
  return requestsState;
}

export function updateRequestStatus(id: string, status: AccessRequestStatus) {
  const current = getAccessRequests();
  const updated = current.map(r => r.id === id ? { ...r, status } : r);
  requestsState = [...updated];
  localStorage.setItem('zigme_access_requests', JSON.stringify(requestsState));
}
