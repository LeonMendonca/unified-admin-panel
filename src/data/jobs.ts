import type { Job, JobStatus, CollegeJob, HiringFlowStep, JobCandidate, JobAssessment, CollegeJobApplicant } from './types';
import { companies } from './companies';
import { colleges } from './colleges';

const titles = [
  'Software Development Engineer', 'Frontend Engineer', 'Backend Engineer', 'Data Analyst',
  'Product Manager', 'QA Engineer', 'DevOps Engineer', 'UI/UX Designer',
  'Machine Learning Engineer', 'Business Analyst', 'Sales Executive', 'HR Executive',
  'Content Writer', 'Marketing Associate', 'Full Stack Developer', 'Cloud Engineer',
];

const statuses: JobStatus[] = ['Draft', 'Internal', 'Public', 'Pending review', 'Archived'];
const types: Job['type'][] = ['Full-time', 'Part-time', 'Internship', 'Contract'];
const modes: Job['mode'][] = ['Office', 'Hybrid', 'Remote'];
const skillsPool = ['Communication', 'Problem Solving', 'SQL', 'React', 'Node.js', 'Excel', 'CRM Tools', 'Negotiation', 'Python', 'System Design'];
const candidateFirstNames = ['Rahul', 'Sneha', 'Amit', 'Divya', 'Karan', 'Pooja', 'Vikram', 'Meera', 'Arjun', 'Nisha'];
const candidateLastNames = ['Verma', 'Iyer', 'Nair', 'Reddy', 'Gupta', 'Patel', 'Rao', 'Menon', 'Singh', 'Kulkarni'];

const HIRING_STEPS = ['JD Match', 'Shortlisting', 'Speed Interview', 'Interview', 'Job Offer'];

function makeHiringFlowSteps(i: number): HiringFlowStep[] {
  return HIRING_STEPS.map((name, j) => ({
    name,
    tag: name.toLowerCase().replace(/\s+/g, '_'),
    inProgress: Math.max(0, (i + j) % 4),
    completed: Math.max(0, (i * 2 + j) % 6),
  }));
}

function makeCandidates(i: number, count: number, isCampusJob: boolean, targetedColleges: Job['targetedColleges']): JobCandidate[] {
  return Array.from({ length: count }, (_, j) => {
    const idx = i * 7 + j;
    const first = candidateFirstNames[idx % candidateFirstNames.length];
    const last = candidateLastNames[idx % candidateLastNames.length];
    const isCampus = isCampusJob && j % 2 === 0 && targetedColleges.length > 0;
    const stepsTotal = HIRING_STEPS.length;
    const stepsCompleted = idx % (stepsTotal + 1);
    return {
      id: `job-${i + 1}-cand-${j}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${idx}@example.com`,
      phone: `+91 9${900000000 + idx * 113}`,
      profile: ['Full stack developer', 'Business graduate', 'Design generalist', 'Data enthusiast'][idx % 4],
      source: isCampus ? 'Campus' : idx % 3 === 0 ? 'Manual' : 'Direct',
      campusCollege: isCampus ? targetedColleges[j % targetedColleges.length]?.collegeName : undefined,
      resumeAvailable: idx % 5 !== 0,
      jdMatchScore: 20 + (idx * 13) % 75,
      hiringProgress: stepsCompleted >= stepsTotal ? 'All Steps Complete' : HIRING_STEPS[stepsCompleted],
      interviewStatus: stepsCompleted >= 3 ? 'Scheduled' : 'Not scheduled',
      appliedOn: new Date(2026, idx % 12, (idx % 27) + 1).toISOString().slice(0, 10),
      currentStep: stepsCompleted >= stepsTotal ? 'Job Offer' : HIRING_STEPS[stepsCompleted],
      stepsCompleted,
      stepsTotal,
    };
  });
}

function makeAssessments(i: number): JobAssessment[] {
  if (i % 3 === 0) return [];
  return [
    {
      id: `job-${i + 1}-assess-1`,
      name: 'Aptitude',
      questionCount: 2 + (i % 4),
      durationMins: 30,
      passPercent: 60 + (i % 20),
      attempts: (i * 3) % 20,
      completed: (i * 2) % 15,
      passed: i % 10,
    },
  ];
}

export const jobs: Job[] = titles.map((title, i) => {
  const id = `job-${i + 1}`;
  const company = companies[i % companies.length];
  const isCampusJob = i % 3 === 0;
  const status = statuses[i % statuses.length];
  const targeted = isCampusJob
    ? colleges.slice(0, 1 + (i % 3)).map((c) => ({
        collegeId: c.id,
        collegeName: c.name,
        applications: 5 + ((i * 7) % 60),
        accepted: (i + c.name.length) % 2 === 0,
      }))
    : [];
  const candidatesCount = 4 + ((i * 11) % 90);
  const candidates = makeCandidates(i, Math.min(candidatesCount, 6), isCampusJob, targeted);
  const interviewSlots = 2 + (i % 6);

  return {
    id,
    title,
    companyId: company.id,
    companyName: company.name,
    type: types[i % types.length],
    mode: modes[i % modes.length],
    status,
    deadline: new Date(2026, (i % 12), (i % 27) + 1).toISOString().slice(0, 10),
    createdOn: new Date(2025, (i * 2) % 12, (i % 27) + 1).toISOString().slice(0, 10),
    lastUpdated: new Date(2026, i % 12, ((i + 3) % 27) + 1).toISOString().slice(0, 10),
    candidatesCount,
    slots: 1 + (i % 5),
    openings: 1 + (i % 5),
    experienceRequired: i % 4 === 0 ? '0-1 years' : `${1 + (i % 4)}+ years`,
    minQualification: ['High School', 'Diploma', "Bachelor's Degree", "Master's Degree"][i % 4],
    salaryRange: `₹${2 + (i % 6)}-${5 + (i % 8)} LPA`,
    location: ['Bengaluru', 'Mumbai', 'Pune', 'Hyderabad', 'Remote'][i % 5],
    isCampusJob,
    targetedColleges: targeted,
    role: title,
    description: `We are looking for a ${title} to join ${company.name}. This role involves working closely with cross-functional teams to deliver high-quality outcomes.`,
    keySkills: skillsPool.slice(i % 4, (i % 4) + 4),
    hiringFlow: ['Application', 'Screening', 'Assessment', 'Interview', 'Offer'],
    hiringFlowSteps: makeHiringFlowSteps(i),
    assessments: makeAssessments(i),
    candidates,
    warnings: status === 'Archived' && i % 2 === 0
      ? [{ id: `${id}-warn-1`, message: 'This job post was flagged and archived because the job description was unclear. Please update the JD with clear responsibilities, qualifications, and experience before republishing.', date: new Date(2026, i % 12, 10).toISOString().slice(0, 10) }]
      : [],
    interviewSlots,
    bookedSlots: Math.min(interviewSlots, i % (interviewSlots + 1)),
  };
});

export function getJobById(id: string) {
  return jobs.find((j) => j.id === id) || null;
}

const collegeJobTitles = ['Campus Placement Drive - CSE', 'On-Campus Internship - ECE', 'Batch Hiring - Mechanical', 'Pre-Placement Talk - MBA'];
const tpoNames = ['Rajesh Kulkarni', 'Sunita Joshi', 'Manoj Desai', 'Priya Bhat'];
const applicantFirstNames = ['Abhishek', 'Nidhi', 'Imran', 'Kavya', 'Vamshi', 'Sanjana', 'Rohan', 'Divya'];
const applicantLastNames = ['Bidwe', 'Shinu', 'Khan', 'Sri', 'Kumar', 'Reddy', 'Patil', 'Nair'];

function makeCollegeApplicants(collegeName: string, batch: string, seed: number): CollegeJobApplicant[] {
  const count = 2 + (seed % 6);
  return Array.from({ length: count }, (_, j) => {
    const idx = seed * 5 + j;
    const first = applicantFirstNames[idx % applicantFirstNames.length];
    const last = applicantLastNames[idx % applicantLastNames.length];
    return {
      id: `cjob-${seed}-app-${j}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}${last.toLowerCase()}${idx}@gmail.com`,
      phone: `+91 9${600000000 + idx * 137}`,
      college: collegeName,
      batch,
      degree: ['B.Tech', 'MCA', 'BBA', 'M.Tech'][idx % 4],
      experience: `${idx % 3} years`,
      status: idx % 6 === 0 ? 'Placed' : 'Submitted',
      gender: idx % 2 === 0 ? 'Male' : 'Female',
      dob: new Date(2002, idx % 12, (idx % 27) + 1).toISOString().slice(0, 10),
      city: 'Not provided',
      state: 'Not provided',
      totalApplications: 1 + (idx % 3),
      activeApplications: 1,
      placementStatus: idx % 6 === 0 ? 'Placed' : 'Not Placed',
      profileCompletion: 10 + (idx * 7) % 85,
      placementReadiness: (idx * 11) % 70,
      registeredStudent: true,
    };
  });
}

export const collegeJobs: CollegeJob[] = colleges.flatMap((college, ci) =>
  collegeJobTitles.slice(0, 2 + (ci % 2)).map((title, ji) => {
    const idx = ci * 10 + ji;
    const batch = `Batch of 202${4 + (idx % 3)}`;
    const applicants = makeCollegeApplicants(college.name, batch, idx);
    return {
      id: `cjob-${idx}`,
      title,
      collegeId: college.id,
      collegeName: college.name,
      batch,
      postedDate: new Date(2026, idx % 12, (idx % 27) + 1).toISOString().slice(0, 10),
      lastEdited: new Date(2026, idx % 12, ((idx + 2) % 27) + 1).toISOString().slice(0, 10),
      deadline: new Date(2026, (idx + 2) % 12, (idx % 27) + 1).toISOString().slice(0, 10),
      status: idx % 3 === 0 ? 'Past' : 'Active',
      applicantCount: applicants.length,
      postedBy: tpoNames[idx % tpoNames.length],
      jobType: ['Full-time', 'Part-time', 'Internship', 'Contract'][idx % 4] as CollegeJob['jobType'],
      salaryRange: `₹${1 + (idx % 4)}-${3 + (idx % 6)} LPA`,
      location: college.city,
      visibleOnZigme: idx % 4 !== 0,
      mandatoryDocs: ['ZigMe Resume', 'Cover Letter'].slice(0, 1 + (idx % 2)),
      description: `${title} — an opportunity posted by ${college.name}'s placement cell for students of ${batch}.`,
      experienceRequired: idx % 2 === 0 ? '0 years' : '1-2 years',
      minQualification: ['High School', 'Diploma', "Bachelor's Degree"][idx % 3],
      skills: skillsPool.slice(idx % 5, (idx % 5) + 3),
      applicants,
    };
  })
);

export function getCollegeJobById(id: string) {
  return collegeJobs.find((j) => j.id === id) || null;
}
