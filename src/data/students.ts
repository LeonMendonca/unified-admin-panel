import type { Student, JobApplication, Document, CareerDiscoverySession, RoomAttempt, Resume, TestAttempt, CreditTransaction } from './types';
import { colleges } from './colleges';
import { jobs } from './jobs';

const firstNames = ['Aarav', 'Vivaan', 'Diya', 'Ananya', 'Ishaan', 'Myra', 'Kabir', 'Saanvi', 'Reyansh', 'Aadhya', 'Arjun', 'Sara', 'Vihaan', 'Pari', 'Advait', 'Anaya', 'Rohan', 'Kiara', 'Yash', 'Riya'];
const lastNames = ['Sharma', 'Verma', 'Iyer', 'Nair', 'Reddy', 'Gupta', 'Patel', 'Rao', 'Menon', 'Singh'];
const skillsPool = ['React', 'Node.js', 'Python', 'SQL', 'Java', 'DSA', 'Machine Learning', 'AWS', 'Docker', 'System Design'];
const interestsPool = ['Product', 'Backend', 'Frontend', 'Data Science', 'DevOps', 'Design'];

export const students: Student[] = Array.from({ length: 24 }, (_, i) => {
  const id = `stu-${i + 1}`;
  const first = firstNames[i % firstNames.length];
  const last = lastNames[i % lastNames.length];
  const name = `${first} ${last}`;
  const source: Student['registrationSource'] = i % 3 === 0 ? 'Invited' : 'Self-registered';
  // Invited students always come through a college's Add Students flow, so they always have a college.
  // Self-registered students sign up directly on talent.zigme and may not have picked a college yet.
  const hasCollege = source === 'Invited' || i % 6 !== 5;
  const college = hasCollege ? colleges[i % colleges.length] : null;
  const status: Student['status'] = i % 7 === 0 ? 'Pending' : i % 11 === 0 ? 'Disabled' : 'Registered';

  return {
    id,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
    phone: `+91 9${800000000 + i * 137}`,
    collegeId: college?.id ?? null,
    collegeName: college?.name ?? null,
    registrationSource: source,
    status,
    registeredOn: new Date(2025, i % 12, (i % 27) + 1).toISOString().slice(0, 10),
    placementReadinessScore: 40 + ((i * 13) % 60),
    gender: i % 2 === 0 ? 'Male' : 'Female',
    dob: new Date(2002, i % 12, (i % 27) + 1).toISOString().slice(0, 10),
    rollNumber: `21CS${1000 + i}`,
    city: college?.city ?? 'Bengaluru',
    state: college?.state ?? 'Karnataka',
    pincode: `56${1000 + i}`,
    blocked: i % 13 === 0,
    batch: `Batch of 202${4 + (i % 3)}`,
    location: college?.city ?? 'Bengaluru',
    roleTypes: ['SDE', 'Data Analyst', 'Product'].slice(0, 1 + (i % 3)),
    companyTypes: ['Startup', 'MNC', 'Product'].slice(0, 1 + (i % 3)),
    workingTimes: ['Full-time', 'Internship'].slice(0, 1 + (i % 2)),
    preferredLocations: ['Bengaluru', 'Remote', 'Mumbai'].slice(0, 1 + (i % 3)),
    openToRelocate: i % 2 === 0,
    openToTravel: i % 3 === 0,
    sixDayWeek: i % 4 === 0,
    unpaidInternship: i % 5 === 0,
    hasTestAttempt: i % 3 !== 0,
    hasCompletedTest: i % 4 === 0,
    degree: 'B.Tech',
    graduationYear: 2024 + (i % 3),
    skills: skillsPool.slice(i % 4, (i % 4) + 4),
    interests: interestsPool.slice(i % 3, (i % 3) + 3),
    creditsBalance: 50 + (i % 10) * 5,
    creditsEarned: 200 + i * 3,
    creditsSpent: 150 + i * 2,
  };
});

export function getStudentById(id: string) {
  return students.find((s) => s.id === id) || null;
}

export function getJobApplications(studentId: string): JobApplication[] {
  const idx = parseInt(studentId.split('-')[1], 10);
  const count = 1 + (idx % 3);
  return Array.from({ length: count }, (_, j) => {
    const job = jobs[(idx + j) % jobs.length];
    const isCampus = idx % 2 === 0;
    return {
      id: `${studentId}-app-${j}`,
      studentId,
      jobId: job.id,
      jobTitle: job.title,
      status: ['Applied', 'Shortlisted', 'Interview', 'Offered', 'Rejected'][(idx + j) % 5],
      stage: ['Screening', 'Round 1', 'Round 2', 'HR Round', 'Final'][(idx + j) % 5],
      source: isCampus ? 'Campus' : 'Direct',
      campusCollege: isCampus ? job.targetedColleges[0]?.collegeName : undefined,
      appliedDate: new Date(2025, (idx + j) % 12, ((idx + j) % 27) + 1).toISOString().slice(0, 10),
      resumeUsed: 'Primary Resume.pdf',
      links: [`https://zigme.in/applications/${studentId}-app-${j}`],
    };
  });
}

export function getDocuments(studentId: string): Document[] {
  const idx = parseInt(studentId.split('-')[1], 10);
  const labels = ['10th Marksheet', '12th Marksheet', 'Degree Certificate', 'Aadhar Card'];
  return labels.slice(0, 2 + (idx % 3)).map((label, j) => ({
    id: `${studentId}-doc-${j}`,
    label,
    file: `${label.replace(/\s+/g, '_')}.pdf`,
    size: `${200 + j * 80}KB`,
    uploadedDate: new Date(2025, j, 5).toISOString().slice(0, 10),
    campusSynced: idx % 2 === 0,
  }));
}

export function getCareerDiscoverySessions(studentId: string): CareerDiscoverySession[] {
  const idx = parseInt(studentId.split('-')[1], 10);
  if (idx % 3 === 0) return [];
  return [
    {
      id: `${studentId}-cds-1`,
      phase: 'Self Discovery',
      started: '2025-06-01',
      completed: idx % 2 === 0 ? '2025-06-03' : null,
      aiReportStatus: idx % 2 === 0 ? 'Generated' : 'Pending',
    },
  ];
}

export function getRoomAttempts(studentId: string): RoomAttempt[] {
  const idx = parseInt(studentId.split('-')[1], 10);
  const rooms = ['DSA Basics', 'System Design', 'Aptitude', 'SQL Mastery'];
  return rooms.slice(0, 2 + (idx % 3)).map((roomName, j) => ({
    id: `${studentId}-room-${j}`,
    roomName,
    attempts: 1 + ((idx + j) % 5),
    averageScore: 50 + ((idx + j * 7) % 45),
    bestScore: 70 + ((idx + j * 3) % 30),
    points30d: 10 + ((idx + j) % 90),
    lastAttempt: new Date(2025, (idx + j) % 12, ((idx + j) % 27) + 1).toISOString().slice(0, 10),
  }));
}

export function getResumes(studentId: string): Resume[] {
  const idx = parseInt(studentId.split('-')[1], 10);
  const origins: Resume['origin'][] = ['Imported from Hiring', 'Auto-imported from Job Application', 'Manually created'];
  return Array.from({ length: 1 + (idx % 2) }, (_, j) => ({
    id: `${studentId}-resume-${j}`,
    name: j === 0 ? 'Primary Resume' : `Resume v${j + 1}`,
    origin: origins[(idx + j) % origins.length],
    status: j === 0 ? 'Active' : 'Draft',
    completion: 60 + ((idx + j * 11) % 40),
    visibility: idx % 2 === 0 ? 'Public' : 'Private',
    views: (idx + j) * 3,
    contactReveals: (idx + j) % 6,
  }));
}

export function getTestAttempts(studentId: string): TestAttempt[] {
  const idx = parseInt(studentId.split('-')[1], 10);
  if (idx % 3 === 0) return [];
  const tests = ['Aptitude Test', 'Coding Test', 'Personality Assessment'];
  return tests.slice(0, 1 + (idx % 3)).map((testName, j) => ({
    id: `${studentId}-test-${j}`,
    testName,
    type: j === 1 ? 'Coding' : 'MCQ',
    attemptNumber: 1,
    started: new Date(2025, (idx + j) % 12, 3).toISOString().slice(0, 10),
    completed: idx % 4 !== 0 ? new Date(2025, (idx + j) % 12, 3).toISOString().slice(0, 10) : null,
    status: idx % 4 !== 0 ? 'Completed' : 'In Progress',
    progress: idx % 4 !== 0 ? 100 : 45,
    score: idx % 4 !== 0 ? 55 + ((idx + j * 5) % 45) : null,
  }));
}

export function getCreditTransactions(studentId: string): CreditTransaction[] {
  const student = getStudentById(studentId);
  if (!student) return [];
  const idx = parseInt(studentId.split('-')[1], 10);
  const entries: { type: string; amount: number; description: string }[] = [
    { type: 'signup_bonus', amount: 25, description: 'Welcome bonus credits' },
    { type: 'hr_outreach', amount: -1, description: 'Sent request to an HR contact' },
    { type: 'test_completion', amount: 10, description: 'Completed a placement readiness test' },
    { type: 'resume_unlock', amount: -5, description: 'Unlocked resume review' },
  ];
  let balance = 0;
  const rows: CreditTransaction[] = [];
  const count = 2 + (idx % 3);
  for (let j = 0; j < count; j++) {
    const entry = entries[(idx + j) % entries.length];
    balance += entry.amount;
    rows.push({
      id: `${studentId}-credit-${j}`,
      date: new Date(2026, (idx + j) % 12, ((idx + j) % 27) + 1).toISOString().slice(0, 10),
      type: entry.type,
      amount: entry.amount,
      balanceAfter: Math.max(0, balance),
      description: entry.description,
    });
  }
  return rows.reverse();
}
