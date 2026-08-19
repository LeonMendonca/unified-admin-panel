export interface Room {
  id: number;
  name: string;
  audience: string;
  goal: string;
  defaultModel: string;
}

export interface Question {
  id: string;
  roomId: number;
  date: string; // YYYY-MM-DD
  text: string;
  options: string[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface MultiplierDate {
  roomId: number;
  date: string; // YYYY-MM-DD
  type: '2X' | '3X';
}

export interface LeaderboardEntry {
  studentName: string;
  attempts: number;
  points: number;
  roomPoints: Record<number, number>; // roomId -> points
}

export interface Prize {
  id: string;
  roomId: number | 'overall';
  month: string; // YYYY-MM
  title: string;
  description: string;
  rankRange: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  resumeText: string;
  category: string;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Elite';
  daysRequired: number;
  isActive: boolean;
  image?: string;
}

// 6 rooms as shown in the mockup design
export const rooms: Room[] = [
  {
    id: 1,
    name: 'AI and Digital Productivity Room',
    audience: "First-job seekers / 0-2 years' experience.",
    goal: 'Check and build fluency in daily tools like ChatGPT, Claude, Sheets, OCR, etc.',
    defaultModel: 'GPT-5 Mini',
  },
  {
    id: 2,
    name: 'Business and Strategy Room',
    audience: "First-job seekers / 0-2 years' experience.",
    goal: 'Build practical business acumen, basic strategy framework, client interaction style.',
    defaultModel: 'GPT-4o',
  },
  {
    id: 3,
    name: 'Communication Room',
    audience: "First-job seekers / 0-2 years' experience.",
    goal: 'Strengthen written and verbal communication, email etiquettes, storytelling.',
    defaultModel: 'Claude 3.5 Sonnet',
  },
  {
    id: 4,
    name: 'Knowledge and Awareness Room',
    audience: "First-job seekers / 0-2 years' experience.",
    goal: 'Build broad, practical knowledge across current affairs, basic financial literacy.',
    defaultModel: 'GPT-5 Mini',
  },
  {
    id: 5,
    name: 'Logic and Reasoning Room',
    audience: "First-job seekers / 0-2 years' experience.",
    goal: 'Improve analytical thinking, puzzle solving, numerical aptitude.',
    defaultModel: 'GPT-4o',
  },
  {
    id: 6,
    name: 'Coding and Technical Room',
    audience: "First-job seekers / 0-2 years' experience.",
    goal: 'Build foundational software debugging, Git version control, and logical design fluency.',
    defaultModel: 'Claude 3.5 Sonnet',
  },
];

// Initial Questions Seed Data
export const seedQuestions: Question[] = [
  // AI & Digital Productivity Room - Aug 19, 2026 (matching mockup)
  {
    id: 'q1-1',
    roomId: 1,
    date: '2026-08-19',
    text: 'Which tool turns scanned images into editable text?',
    options: ['OCR', 'VPN', 'ZIP', 'SSO'],
    correctAnswer: 'A',
  },
  {
    id: 'q1-2',
    roomId: 1,
    date: '2026-08-19',
    text: 'Which key commonly refreshes the current webpage?',
    options: ['F5', 'Ctrl+C', 'Esc', 'Tab'],
    correctAnswer: 'A',
  },
  {
    id: 'q1-3',
    roomId: 1,
    date: '2026-08-19',
    text: 'On a video call, which action shares your screen?',
    options: ['Mute microphone', 'Turn camera on', 'Share screen', 'Enable captions'],
    correctAnswer: 'C',
  },
  {
    id: 'q1-4',
    roomId: 1,
    date: '2026-08-19',
    text: 'Which browser feature stores site preferences and login tokens?',
    options: ['Cookies', 'Cache', 'History', 'Bookmarks'],
    correctAnswer: 'A',
  },
  {
    id: 'q1-5',
    roomId: 1,
    date: '2026-08-19',
    text: 'Which action compresses multiple files into one archive?',
    options: ['Zip', 'Encrypt', 'Segment', 'Synchronize'],
    correctAnswer: 'A',
  },

  // Business and Strategy Room - Aug 19, 2026
  {
    id: 'q2-1',
    roomId: 2,
    date: '2026-08-19',
    text: 'What does SWOT analysis stand for?',
    options: [
      'Strengths, Weaknesses, Opportunities, Threats',
      'Sales, Wealth, Organization, Taxes',
      'Strategies, Winners, Operations, Teams',
      'System, Web, Order, Timeline',
    ],
    correctAnswer: 'A',
  },
  {
    id: 'q2-2',
    roomId: 2,
    date: '2026-08-19',
    text: 'Which metric represents the total monetary value of all finished goods and services produced within a country?',
    options: ['GDP', 'ROI', 'LTV', 'CAC'],
    correctAnswer: 'A',
  },

  // Communication Room - Aug 19, 2026
  {
    id: 'q3-1',
    roomId: 3,
    date: '2026-08-19',
    text: 'What is the most professional way to start an email to a new external business partner?',
    options: ['Dear [Name]', 'Hey there!', 'What\'s up [Name]', 'To Whom It May Concern'],
    correctAnswer: 'A',
  },
  {
    id: 'q3-2',
    roomId: 3,
    date: '2026-08-19',
    text: 'In professional writing, what does the acronym TL;DR stand for?',
    options: ['Too Long; Didn\'t Read', 'Text Link; Direct Route', 'Time Limit; Daily Report', 'Technical Language; Draft Revision'],
    correctAnswer: 'A',
  },

  // Knowledge Room - Aug 19, 2026
  {
    id: 'q4-1',
    roomId: 4,
    date: '2026-08-19',
    text: 'Which of the following is commonly considered a safe, low-risk investment for short-term savings?',
    options: ['Fixed Deposit (FD)', 'Cryptocurrencies', 'Penny Stocks', 'High-yield Junk Bonds'],
    correctAnswer: 'A',
  },

  // Logic Room - Aug 19, 2026
  {
    id: 'q5-1',
    roomId: 5,
    date: '2026-08-19',
    text: 'If all A are B, and all B are C, then are all A necessarily C?',
    options: ['Yes', 'No', 'Only if A = B', 'Cannot be determined'],
    correctAnswer: 'A',
  },
];

// Initial pre-seeded Multiplier Dates (for calendar view matching mockup)
// Let's seed multiplier dates for room 1 in August 2026:
// 2X: 2026-08-05
// 3X: 2026-08-12
export const seedMultiplierDates: MultiplierDate[] = [
  { roomId: 1, date: '2026-08-05', type: '2X' },
  { roomId: 1, date: '2026-08-12', type: '3X' },
  { roomId: 2, date: '2026-08-07', type: '2X' },
  { roomId: 2, date: '2026-08-14', type: '3X' },
];

// Active dates in August 2026 (matching mockup calendar active days)
export const seedActiveDates: Record<number, string[]> = {
  // room 1 active days in Aug 2026
  1: [
    '2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05',
    '2026-08-06', '2026-08-07', '2026-08-08', '2026-08-09', '2026-08-10',
    '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14', '2026-08-17',
    '2026-08-18', '2026-08-19'
  ],
  2: ['2026-08-05', '2026-08-06', '2026-08-07', '2026-08-12', '2026-08-13', '2026-08-14', '2026-08-19'],
  3: ['2026-08-08', '2026-08-09', '2026-08-10', '2026-08-19'],
  4: ['2026-08-15', '2026-08-16', '2026-08-19'],
  5: ['2026-08-19'],
  6: ['2026-08-19'],
};

// Seed students leaderboard (pre-calculated values matching mockup ranking overall)
export const seedLeaderboard: LeaderboardEntry[] = [
  {
    studentName: 'MANUGONDA SHIVA KUMAR',
    attempts: 5,
    points: 32,
    roomPoints: { 1: 10, 2: 8, 3: 6, 4: 4, 5: 4 },
  },
  {
    studentName: 'Mohammad Yakub',
    attempts: 5,
    points: 32,
    roomPoints: { 1: 8, 2: 10, 3: 8, 4: 2, 5: 4 },
  },
  {
    studentName: 'Damsalapuri venkataramanaiah',
    attempts: 5,
    points: 32,
    roomPoints: { 1: 9, 2: 9, 3: 6, 4: 5, 5: 3 },
  },
  {
    studentName: 'Harshita Bingi',
    attempts: 10,
    points: 32,
    roomPoints: { 1: 6, 2: 6, 3: 10, 4: 5, 5: 5 },
  },
  {
    studentName: 'MADDURI DINESH KRISHNA SAKETH',
    attempts: 5,
    points: 28,
    roomPoints: { 1: 7, 2: 7, 3: 5, 4: 5, 5: 4 },
  },
  {
    studentName: 'POUDALA NIHARIKA',
    attempts: 5,
    points: 28,
    roomPoints: { 1: 8, 2: 5, 3: 8, 4: 4, 5: 3 },
  },
  {
    studentName: 'Anjali Koppula',
    attempts: 5,
    points: 27,
    roomPoints: { 1: 5, 2: 5, 3: 7, 4: 6, 5: 4 },
  },
  {
    studentName: 'Rohit Sharma',
    attempts: 4,
    points: 24,
    roomPoints: { 1: 8, 2: 4, 3: 4, 4: 4, 5: 4 },
  },
  {
    studentName: 'Aditya Vardhan',
    attempts: 5,
    points: 22,
    roomPoints: { 1: 4, 2: 4, 3: 6, 4: 4, 5: 4 },
  },
  {
    studentName: 'Karthik Raja',
    attempts: 6,
    points: 21,
    roomPoints: { 1: 5, 2: 3, 3: 5, 4: 5, 5: 3 },
  },
  {
    studentName: 'Ananya Deshmukh',
    attempts: 4,
    points: 20,
    roomPoints: { 1: 6, 2: 5, 3: 4, 4: 3, 5: 2 },
  },
  {
    studentName: 'Siddharth Sen',
    attempts: 5,
    points: 18,
    roomPoints: { 1: 3, 2: 4, 3: 4, 4: 4, 5: 3 },
  },
];

// Seed Badges data
export const seedBadges: Badge[] = [
  {
    id: 'b1',
    name: 'Consistency Bronze',
    description: 'Complete quizzes for 7 consecutive days',
    resumeText: 'Earned for demonstrating a solid starting habit of daily skill-building exercises over a continuous 7-day period.',
    category: 'Learner',
    level: 'Bronze',
    daysRequired: 7,
    isActive: true,
  },
  {
    id: 'b2',
    name: 'Consistency Silver',
    description: 'Complete quizzes for 30 consecutive days',
    resumeText: 'Earned for demonstrating a persistent, month-long dedication to self-improvement and consistent daily learning.',
    category: 'Learner',
    level: 'Silver',
    daysRequired: 30,
    isActive: true,
  },
  {
    id: 'b3',
    name: 'Consistency Gold',
    description: 'Complete quizzes for 60 consecutive days',
    resumeText: 'Awarded to candidates maintaining a highly rigorous, consecutive 60-day streak of daily domain assessments.',
    category: 'Learner',
    level: 'Gold',
    daysRequired: 60,
    isActive: true,
  },
  {
    id: 'b4',
    name: 'Consistency Master Platinum',
    description: 'Complete quizzes for 90 consecutive days',
    resumeText: 'Recognizes an elite 90-day consistency record, showcasing high agency, planning, and long-term skill progression.',
    category: 'Learner',
    level: 'Platinum',
    daysRequired: 90,
    isActive: true,
  },
  {
    id: 'b5',
    name: 'Consistency Master Elite',
    description: 'Complete quizzes for 180 consecutive days',
    resumeText: 'Our highest distinction for learning discipline, representing a half-year of unbroken daily analytical work.',
    category: 'Learner',
    level: 'Elite',
    daysRequired: 180,
    isActive: true,
  },
];

// LocalStorage Helper utility
export const getStorageData = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(`zigme_${key}`);
  if (stored) {
    try {
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
};

export const setStorageData = <T>(key: string, data: T): void => {
  localStorage.setItem(`zigme_${key}`, JSON.stringify(data));
};
