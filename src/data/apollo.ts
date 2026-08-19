import { tpos } from './tpos';
import { students } from './students';
import { colleges } from './colleges';
import { companies } from './companies';

export interface ApolloStats {
  callsToday: number;
  calls7d: number;
  calls30d: number;
  uniqueUsersToday: number;
  estUnitsToday: number;
  cacheHitToday: number;
  clampedToday: number;
}

export interface EndpointUsage {
  name: 'Search' | 'HR Contacts' | 'TPO Outreach';
  calls: number;
  percent: number;
}

export interface ApolloTopUser {
  id: string;
  name: string;
  email: string;
  type: 'tpo' | 'student';
  college: string | null;
  search: number;
  hr: number;
  outreach: number;
  totalCalls: number;
  units: number;
  lastCall: string;
}

export interface ApolloTopCollege {
  id: string;
  name: string;
  calls: number;
  estUnits: number;
  lastCall: string;
}

export interface ApolloRecentCall {
  id: string;
  when: string;
  endpoint: 'HR Contacts' | 'Search' | 'TPO Outreach';
  userName: string;
  userEmail: string;
  college: string | null;
  companyOrQuery: string;
  results: number;
  units: number;
  status: 'cached' | '200' | 'error';
}

export const apolloStats: ApolloStats = {
  callsToday: 24,
  calls7d: 172,
  calls30d: 879,
  uniqueUsersToday: 8,
  estUnitsToday: 50,
  cacheHitToday: 46,
  clampedToday: 2,
};

export const endpointUsage: EndpointUsage[] = [
  { name: 'Search', calls: 575, percent: 65 },
  { name: 'HR Contacts', calls: 193, percent: 22 },
  { name: 'TPO Outreach', calls: 111, percent: 13 },
];

export function getApolloUsageSummary(range: '7d' | '30d' | '90d') {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const callsPerDay = apolloStats.calls30d / 30;
  const callsLogged = Math.round(callsPerDay * days);
  const billedRecords = Math.round(callsLogged * (1 - apolloStats.cacheHitToday / 100));
  return { callsLogged, billedRecords, days };
}

export const clampedRequests30d = 9;
export const clampedPerPageRequested = 9;
export const failedCalls30d = 137;

export const perUserDailyLimits = {
  search: 30,
  hrContacts: 15,
  tpoOutreach: 60,
};

const topTpos = tpos.slice(0, 3);
const topStudents = students.slice(0, 2);

export const apolloTopUsers: ApolloTopUser[] = [
  ...topTpos.map((t, i) => ({
    id: `apollo-user-${t.id}`,
    name: t.name,
    email: t.email,
    type: 'tpo' as const,
    college: t.collegeName,
    search: [115, 33, 20][i] ?? 10,
    hr: [65, 17, 9][i] ?? 4,
    outreach: [7, 33, 7][i] ?? 3,
    totalCalls: [187, 83, 36][i] ?? 17,
    units: [1590, 196, 89][i] ?? 60,
    lastCall: ['2026-08-19 12:15', '2026-08-13 18:08', '2026-08-17 17:11'][i] ?? '2026-08-10 10:00',
  })),
  ...topStudents.map((s, i) => ({
    id: `apollo-user-${s.id}`,
    name: s.name,
    email: s.email,
    type: 'student' as const,
    college: s.collegeName,
    search: [26, 14][i] ?? 8,
    hr: [0, 8][i] ?? 2,
    outreach: [0, 0][i] ?? 0,
    totalCalls: [26, 22][i] ?? 10,
    units: [26, 182][i] ?? 15,
    lastCall: ['2026-08-17 14:44', '2026-08-13 14:17'][i] ?? '2026-08-09 09:00',
  })),
];

export const apolloTopColleges: ApolloTopCollege[] = colleges.slice(0, 6).map((c, i) => ({
  id: `apollo-college-${c.id}`,
  name: i === 0 ? 'ZigMe Internal College updated' : c.name,
  calls: [270, 80, 41, 36, 36, 30][i] ?? 15,
  estUnits: [1786, 355, 202, 89, 200, 53][i] ?? 40,
  lastCall: ['2026-08-19 12:15', '2026-08-18 13:31', '2026-08-18 12:22', '2026-08-17 17:11', '2026-08-06 15:57', '2026-08-19 07:32'][i] ?? '2026-08-01 10:00',
}));

export const apolloRecentCalls: ApolloRecentCall[] = Array.from({ length: 20 }, (_, i) => {
  const user = apolloTopUsers[i % apolloTopUsers.length];
  const endpoint: ApolloRecentCall['endpoint'] = (['HR Contacts', 'Search', 'TPO Outreach'] as const)[i % 3];
  const company = companies[i % companies.length];
  return {
    id: `apollo-call-${i}`,
    when: `2026-08-${19 - Math.floor(i / 3)} ${String(12 - (i % 12)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}`,
    endpoint,
    userName: user.name,
    userEmail: user.email,
    college: user.college,
    companyOrQuery: company.name,
    results: 10 + (i % 15),
    units: i % 4 === 0 ? 10 : 0,
    status: i % 4 === 0 ? '200' : i % 9 === 0 ? 'error' : 'cached',
  };
});
