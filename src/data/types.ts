export type Status = 'Registered' | 'Pending' | 'Disabled';
export type RegistrationSource = 'Self-registered' | 'Invited';

export interface CreditTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  collegeId: string | null;
  collegeName: string | null;
  registrationSource: RegistrationSource;
  status: Status;
  registeredOn: string;
  placementReadinessScore: number;
  gender: string;
  dob: string;
  rollNumber: string;
  city: string;
  state: string;
  pincode: string;
  blocked: boolean;
  batch: string;
  location: string;
  roleTypes: string[];
  companyTypes: string[];
  workingTimes: string[];
  preferredLocations: string[];
  openToRelocate: boolean;
  openToTravel: boolean;
  sixDayWeek: boolean;
  unpaidInternship: boolean;
  hasTestAttempt: boolean;
  hasCompletedTest: boolean;
  degree: string;
  graduationYear: number;
  skills: string[];
  interests: string[];
  creditsBalance: number;
  creditsEarned: number;
  creditsSpent: number;
}

export interface JobApplication {
  id: string;
  studentId: string;
  jobId: string;
  jobTitle: string;
  status: string;
  stage: string;
  source: 'Direct' | 'Campus';
  campusCollege?: string;
  appliedDate: string;
  resumeUsed: string;
  links: string[];
}

export interface Document {
  id: string;
  label: string;
  file: string;
  size: string;
  uploadedDate: string;
  campusSynced: boolean;
}

export interface CareerDiscoverySession {
  id: string;
  phase: string;
  started: string;
  completed: string | null;
  aiReportStatus: 'Pending' | 'Generated' | 'Failed';
}

export interface RoomAttempt {
  id: string;
  roomName: string;
  attempts: number;
  averageScore: number;
  bestScore: number;
  points30d: number;
  lastAttempt: string;
}

export interface Resume {
  id: string;
  name: string;
  origin: 'Imported from Hiring' | 'Auto-imported from Job Application' | 'Manually created';
  status: string;
  completion: number;
  visibility: 'Public' | 'Private';
  views: number;
  contactReveals: number;
}

export interface TestAttempt {
  id: string;
  testName: string;
  type: string;
  attemptNumber: number;
  started: string;
  completed: string | null;
  status: string;
  progress: number;
  score: number | null;
}

export interface TPO {
  id: string;
  name: string;
  email: string;
  contact: string;
  collegeId: string;
  collegeName: string;
  city: string;
  state: string;
  collegeType: string;
  status: Status;
  registrationSource: RegistrationSource;
  registeredOn: string;
  createdAt: string;
  lastUpdated: string;
}

export interface HR {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyId: string;
  companyName: string;
  timezone: string;
  jobsCount: number;
  creditBalance: number;
  agency: 'Pool owner' | 'Pool member' | 'None';
  status: 'Active' | 'Suspended';
  joined: string;
  memberSince: string;
  lastUpdated: string;
  whatsappEnabled: boolean;
  countryCode: string;
  campusAccessStatus: 'Not requested' | 'Pending' | 'Approved' | 'Rejected';
  campusAccessGrant: {
    state: 'Off' | 'Active' | 'Not company-approved';
    activeUntil: string | null;
    reason: string | null;
  };
  totalCandidates: number;
  interviewsConducted: number;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  website: string;
  industry: string;
  logo: string;
  linkedin: string;
  employeeCount: string;
  foundedYear: number;
  verified: boolean;
  companyAdminAssigned: boolean;
  campusLinked: boolean;
  campusAccessStatus: 'Approved' | 'Pending' | 'Not requested' | 'Rejected';
  activeJobs: number;
  totalApplications: number;
  members: { name: string; email: string; role: string }[];
  contactInfo: { email: string; phone: string; address: string };
  administrativeDetails: { registrationNumber: string; gstNumber: string; panNumber: string };
  locations: string[];
  verticals: string[];
  gallery: string[];
  socialLinks: { platform: string; url: string }[];
}

export type JobStatus = 'Draft' | 'Internal' | 'Public' | 'Pending review' | 'Archived';

export interface HiringFlowStep {
  name: string;
  tag: string;
  inProgress: number;
  completed: number;
}

export interface JobCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile: string;
  source: 'Manual' | 'Direct' | 'Campus';
  campusCollege?: string;
  resumeAvailable: boolean;
  jdMatchScore: number;
  hiringProgress: string;
  interviewStatus: 'Not scheduled' | 'Scheduled' | 'Completed';
  appliedOn: string;
  currentStep: string;
  stepsCompleted: number;
  stepsTotal: number;
}

export interface JobAssessment {
  id: string;
  name: string;
  questionCount: number;
  durationMins: number;
  passPercent: number;
  attempts: number;
  completed: number;
  passed: number;
}

export interface JobWarning {
  id: string;
  message: string;
  date: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  mode: 'Office' | 'Hybrid' | 'Remote';
  status: JobStatus;
  deadline: string;
  createdOn: string;
  lastUpdated: string;
  candidatesCount: number;
  slots: number;
  openings: number;
  experienceRequired: string;
  minQualification: string;
  salaryRange: string;
  location: string;
  isCampusJob: boolean;
  targetedColleges: { collegeId: string; collegeName: string; applications: number; accepted: boolean }[];
  role: string;
  description: string;
  keySkills: string[];
  hiringFlow: string[];
  hiringFlowSteps: HiringFlowStep[];
  assessments: JobAssessment[];
  candidates: JobCandidate[];
  warnings: JobWarning[];
  interviewSlots: number;
  bookedSlots: number;
}

export interface CollegeJobApplicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  batch: string;
  degree: string;
  experience: string;
  status: 'Submitted' | 'Placed';
  gender: string;
  dob: string;
  city: string;
  state: string;
  totalApplications: number;
  activeApplications: number;
  placementStatus: string;
  profileCompletion: number;
  placementReadiness: number;
  registeredStudent: boolean;
}

export interface CollegeJob {
  id: string;
  title: string;
  collegeId: string;
  collegeName: string;
  batch: string;
  postedDate: string;
  lastEdited: string;
  deadline: string;
  status: 'Active' | 'Past';
  applicantCount: number;
  postedBy: string;
  jobType: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  salaryRange: string;
  location: string;
  visibleOnZigme: boolean;
  mandatoryDocs: string[];
  description: string;
  experienceRequired: string;
  minQualification: string;
  skills: string[];
  applicants: CollegeJobApplicant[];
}

export interface BatchStudent {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  role: string;
  placement: 'N/A' | 'Placed' | 'Not Placed';
  registered: boolean;
}

export interface Batch {
  id: string;
  code: string;
  name: string;
  programName: string;
  programLevel: 'UG' | 'PG';
  startDate: string;
  endDate: string;
  studentCount: number;
  placedCount: number;
  registeredCount: number;
  notRegisteredCount: number;
  barredCount: number;
  deactivated: boolean;
  studentAdmin: string | null;
  signupLink: string;
  students: BatchStudent[];
}

export interface Program {
  id: string;
  name: string;
  code: string;
  programType: 'UG' | 'PG';
  specialization: string;
  intake: number;
  durationYears: number;
}

export interface OfficialRecognition {
  nbaAccreditation: boolean;
  ugcRecognition: boolean;
  aicteApproval: boolean;
  instituteOfEminence: boolean;
}

export interface College {
  id: string;
  name: string;
  code: string;
  logo: string;
  websiteUrl: string;
  city: string;
  state: string;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  contactEmail: string;
  contactPhone: string;
  contactPerson: string;
  alternateContactPhone: string;
  institutionType: string;
  enrollment: number;
  tier: string;
  accreditationStatus: string;
  officialRecognition: OfficialRecognition;
  placementRate: number;
  avgPackage: string;
  highestPackage: string;
  totalStudents: number;
  activeStudents: number;
  totalJobs: number;
  activeJobs: number;
  activeTests: number;
  status: 'Activated' | 'Deactivated';
  lastUpdated: string;
  programs: Program[];
  batches: Batch[];
}

export type EmailSource = 'Hiring' | 'Talent' | 'Campus';

export interface EmailTemplate {
  id: string;
  name: string;
  key: string;
  trigger: string;
  isMarketing: boolean;
  audience: ('Student' | 'Candidate' | 'TPO' | 'HR')[];
  type: 'Trigger' | 'Marketing';
  source: EmailSource;
  status: 'Active' | 'Inactive';
  version: number;
  subject: string;
  body: string;
  variables: string[];
  lastEdited: string;
  category?: string;
  isSystem?: boolean;
  isActiveVariant?: boolean;
}

export interface CampaignLog {
  id: string;
  templateName: string;
  audience: 'Candidate' | 'TPO';
  recipients: number;
  sent: number;
  failed: number;
  sentDate: string;
  status: 'Completed' | 'Partial' | 'Sending';
  durationSeconds: number;
}

export interface Suppression {
  id: string;
  email: string;
  reason: 'Hard bounce' | 'Spam complaint' | 'Unsubscribed' | 'Invalid format';
  source: string;
  when: string;
  detail: string;
}
