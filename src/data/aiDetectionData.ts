export interface AIDetectionViolation {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  testOrRoom: string;
  riskScore: number;
  severity: 'Low' | 'Medium' | 'High';
  date: string;
  status: 'Pending' | 'Reviewed';
  riskLogs: string;
  adminNotes?: string;
}

const defaultRiskLog = JSON.stringify([
  {
    travel: 362,
    downAge: 18,
    dwellMs: 460,
    hasDown: true,
    reasons: [],
    modality: "mouse",
    sinceMove: 244,
    eventScore: 0
  }
], null, 2);

export const initialAIViolations: AIDetectionViolation[] = [
  {
    id: 'v-1',
    studentId: 'harshita-bingi',
    studentName: 'Harshita Bingi',
    type: 'Room Quiz',
    testOrRoom: 'Logic and Reasoning Room',
    riskScore: 1,
    severity: 'Low',
    date: '19/08/2026',
    status: 'Pending',
    riskLogs: defaultRiskLog
  },
  {
    id: 'v-2',
    studentId: 'harshita-bingi',
    studentName: 'Harshita Bingi',
    type: 'Room Quiz',
    testOrRoom: 'Knowledge and Awareness Room',
    riskScore: 0,
    severity: 'Low',
    date: '19/08/2026',
    status: 'Pending',
    riskLogs: defaultRiskLog
  },
  {
    id: 'v-3',
    studentId: 'leon-mendonca',
    studentName: 'Leon Mendonca',
    type: 'Test',
    testOrRoom: 'Frontend Developer Assessment',
    riskScore: 8,
    severity: 'High',
    date: '18/08/2026',
    status: 'Pending',
    riskLogs: defaultRiskLog
  },
  {
    id: 'v-4',
    studentId: 'amit-verma',
    studentName: 'Amit Verma',
    type: 'Test',
    testOrRoom: 'Backend Systems Evaluation',
    riskScore: 5,
    severity: 'Medium',
    date: '17/08/2026',
    status: 'Reviewed',
    adminNotes: 'Student clicked away for a few seconds. Ignored.',
    riskLogs: defaultRiskLog
  }
];

// In-memory data store for the session to simulate updates
let violationsState = [...initialAIViolations];

export function getAIViolations(): AIDetectionViolation[] {
  const stored = localStorage.getItem('zigme_ai_violations');
  if (stored) {
    return JSON.parse(stored);
  }
  return violationsState;
}

export function saveAIViolations(violations: AIDetectionViolation[]) {
  violationsState = [...violations];
  localStorage.setItem('zigme_ai_violations', JSON.stringify(violationsState));
}

export function updateViolationStatus(id: string, status: 'Pending' | 'Reviewed', adminNotes: string) {
  const current = getAIViolations();
  const updated = current.map(v => v.id === id ? { ...v, status, adminNotes } : v);
  saveAIViolations(updated);
}
