export interface PlatformTest {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  type: 'Personality' | 'General';
  description: string;
  durationMins: number;
  maxQuestions: number;
  createdOn: string;
}

export const platformTests: PlatformTest[] = [
  {
    id: 'test-1',
    name: "ZigMe's Work DNA Assessment",
    status: 'Active',
    type: 'Personality',
    description:
      "ZigMe's Work DNA assessment simulates real workplace scenarios to evaluate your attitude toward work, highlighting strengths and areas for improvement—especially crucial for freshers unfamiliar with such situations.",
    durationMins: 30,
    maxQuestions: 50,
    createdOn: '2025-08-05',
  },
  {
    id: 'test-2',
    name: 'Digital Tools Proficiency Assessment',
    status: 'Active',
    type: 'General',
    description:
      'Welcome to the Digital Tools Proficiency Assessment. This 32-question evaluation is designed to assess your familiarity and comfort with commonly used digital tools in modern workplaces, including Canva, Microsoft Excel, PowerPoint, and the Google Suite (Docs, Sheets, Slides, and Drive). These tools are essential for day-to-day productivity and collaboration in corporate environments. The assessment will help us understand how prepared you are to work efficiently with these platforms as you transition into the professional world. Please answer each question to the best of your ability. There are no trick questions—this is about gauging practical, real-world readiness. Good luck!',
    durationMins: 20,
    maxQuestions: 35,
    createdOn: '2025-08-01',
  },
  {
    id: 'test-3',
    name: 'Aptitude & Logical Reasoning Test',
    status: 'Active',
    type: 'General',
    description:
      'A timed assessment covering quantitative aptitude, logical reasoning, and verbal ability, used as a baseline screening test across placement drives.',
    durationMins: 45,
    maxQuestions: 60,
    createdOn: '2025-06-20',
  },
  {
    id: 'test-4',
    name: 'Communication Style Assessment',
    status: 'Inactive',
    type: 'Personality',
    description:
      'Evaluates a candidate\'s preferred communication style across written, verbal, and collaborative scenarios to help match them with suitable team environments.',
    durationMins: 15,
    maxQuestions: 25,
    createdOn: '2025-04-11',
  },
];
