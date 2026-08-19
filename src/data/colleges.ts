import type { College, Batch, Program, BatchStudent } from './types';

const collegeNames = [
  'Indian Institute of Technology, Bombay',
  'National Institute of Technology, Trichy',
  'BITS Pilani',
  'Vellore Institute of Technology',
  'Delhi Technological University',
  'Manipal Institute of Technology',
];

const cities = ['Mumbai', 'Tiruchirappalli', 'Pilani', 'Vellore', 'Delhi', 'Manipal'];
const states = ['Maharashtra', 'Tamil Nadu', 'Rajasthan', 'Tamil Nadu', 'Delhi', 'Karnataka'];
const studentFirstNames = ['Aarav', 'Diya', 'Ishaan', 'Myra', 'Kabir', 'Saanvi', 'Reyansh', 'Aadhya'];
const studentLastNames = ['Sharma', 'Verma', 'Iyer', 'Nair', 'Reddy', 'Gupta', 'Patel', 'Rao'];

function makeBatchStudents(batchId: string, count: number): BatchStudent[] {
  return Array.from({ length: count }, (_, i) => {
    const first = studentFirstNames[i % studentFirstNames.length];
    const last = studentLastNames[i % studentLastNames.length];
    const registered = i % 4 !== 0;
    return {
      id: `${batchId}-stu-${i}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      rollNumber: registered ? `${batchId.toUpperCase()}-${100 + i}` : '-',
      role: 'Student',
      placement: i % 7 === 0 ? 'Placed' : registered ? 'Not Placed' : 'N/A',
      registered,
    };
  });
}

const PROGRAM_TEMPLATES: { name: string; code: string; type: 'UG' | 'PG'; specialization: string; intake: number; duration: number }[] = [
  { name: 'Bachelor of Technology', code: 'b.tech', type: 'UG', specialization: 'CSE', intake: 120, duration: 4 },
  { name: 'Bachelor of Technology', code: 'b.tech', type: 'UG', specialization: 'ECE', intake: 90, duration: 4 },
  { name: 'Bachelor of Commerce', code: 'b.com', type: 'UG', specialization: 'General', intake: 60, duration: 3 },
  { name: 'Master of Business Administration', code: 'mba', type: 'PG', specialization: 'Finance', intake: 60, duration: 2 },
  { name: 'Master of Technology', code: 'm.tech', type: 'PG', specialization: 'AI/ML', intake: 30, duration: 2 },
];

function makePrograms(collegeId: string, count: number): Program[] {
  return PROGRAM_TEMPLATES.slice(0, count).map((p, i) => ({
    id: `${collegeId}-prog-${i}`,
    name: p.name,
    code: p.code,
    programType: p.type,
    specialization: p.specialization,
    intake: p.intake,
    durationYears: p.duration,
  }));
}

function makeBatches(collegeId: string, collegeCode: string, programs: Program[]): Batch[] {
  return ['2024', '2025', '2026'].map((year, i) => {
    const program = programs[i % programs.length];
    const studentCount = 40 + i * 30;
    const registeredCount = Math.round(studentCount * (0.6 + i * 0.1));
    const batchId = `${collegeId}-batch-${year}`;
    return {
      id: batchId,
      code: `${collegeCode}-${program.code.toUpperCase()}-${year}-${String.fromCharCode(65 + i)}`,
      name: `Batch of ${year}`,
      programName: program.name.toLowerCase(),
      programLevel: program.programType,
      startDate: `${year}-08-01`,
      endDate: `${Number(year) + program.durationYears}-05-31`,
      studentCount,
      placedCount: Math.round(studentCount * (0.2 + i * 0.05)),
      registeredCount,
      notRegisteredCount: studentCount - registeredCount,
      barredCount: i % 3 === 0 ? 1 : 0,
      deactivated: i === 1,
      studentAdmin: i === 2 ? `${studentFirstNames[i]} ${studentLastNames[i]}` : null,
      signupLink: `https://zigme.in/signup/${collegeId}/${year}`,
      students: makeBatchStudents(batchId, Math.min(6, studentCount)),
    };
  });
}

export const colleges: College[] = collegeNames.map((name, i) => {
  const id = `col-${i + 1}`;
  const code = `${name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()}${10 + i}`;
  const programs = makePrograms(id, 3 + (i % 3));
  return {
    id,
    name,
    code,
    logo: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
    websiteUrl: `https://${name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)}.edu.in`,
    city: cities[i],
    state: states[i],
    pincode: `${400000 + i * 1111}`,
    addressLine1: `${100 + i}, College Road`,
    addressLine2: '',
    contactEmail: `placement@${name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}.edu.in`,
    contactPhone: `+91 98${i}0011223`,
    contactPerson: `${studentFirstNames[i % studentFirstNames.length]} ${studentLastNames[i % studentLastNames.length]}`,
    alternateContactPhone: '',
    institutionType: i % 2 === 0 ? 'Government' : 'Private',
    enrollment: 3000 + i * 500,
    tier: i < 2 ? 'Tier 1' : i < 4 ? 'Tier 2' : 'Tier 3',
    accreditationStatus: 'NAAC A++',
    officialRecognition: {
      nbaAccreditation: i % 2 === 0,
      ugcRecognition: true,
      aicteApproval: i % 3 === 0,
      instituteOfEminence: i === 0,
    },
    placementRate: 72 + i * 3,
    avgPackage: `${(6 + i * 1.5).toFixed(1)} LPA`,
    highestPackage: `${(18 + i * 4).toFixed(1)} LPA`,
    totalStudents: 480 + i * 60,
    activeStudents: 400 + i * 50,
    totalJobs: 24 + i * 4,
    activeJobs: 8 + i,
    activeTests: 1 + (i % 4),
    status: i === 4 ? 'Deactivated' : 'Activated',
    lastUpdated: new Date(2026, (i + 2) % 12, ((i * 3) % 27) + 1).toISOString().slice(0, 10),
    programs,
    batches: makeBatches(id, code, programs),
  };
});

export function getCollegeById(id: string | null) {
  return colleges.find((c) => c.id === id) || null;
}
