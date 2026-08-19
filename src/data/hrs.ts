import type { HR } from './types';
import { companies } from './companies';

const firstNames = ['Neha', 'Karan', 'Pooja', 'Amit', 'Sneha', 'Rahul', 'Divya', 'Vikram', 'Meera', 'Sameer'];
const lastNames = ['Agarwal', 'Kapoor', 'Malhotra', 'Bose', 'Pillai', 'Chatterjee'];

export const hrs: HR[] = companies.map((company, i) => {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[i % lastNames.length];
  const status: HR['status'] = i % 8 === 0 ? 'Suspended' : 'Active';
  const campusStatuses: HR['campusAccessStatus'][] = ['Not requested', 'Pending', 'Approved', 'Rejected'];
  const grantStates: HR['campusAccessGrant']['state'][] = ['Off', 'Active', 'Not company-approved'];
  const grantState = grantStates[i % grantStates.length];
  return {
    id: `hr-${i + 1}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${company.domain}`,
    phone: `+91 91${i}2233445`,
    companyId: company.id,
    companyName: company.name,
    timezone: 'Asia/Kolkata (IST)',
    jobsCount: company.activeJobs,
    creditBalance: 100 + i * 25,
    agency: i % 4 === 0 ? 'Pool owner' : i % 4 === 1 ? 'Pool member' : 'None',
    status,
    joined: new Date(2024, i % 12, (i % 27) + 1).toISOString().slice(0, 10),
    memberSince: new Date(2024, i % 12, (i % 27) + 1).toISOString().slice(0, 10),
    lastUpdated: new Date(2025, i % 12, (i % 27) + 1).toISOString().slice(0, 10),
    whatsappEnabled: i % 2 === 0,
    countryCode: '+91',
    campusAccessStatus: campusStatuses[i % campusStatuses.length],
    campusAccessGrant: {
      state: grantState,
      activeUntil: grantState === 'Active' ? new Date(2026, (i % 12), 15).toISOString().slice(0, 10) : null,
      reason: grantState !== 'Off' ? 'Approved for regional campus hiring drive' : null,
    },
    totalCandidates: 20 + i * 8,
    interviewsConducted: 5 + i * 2,
  };
});

export function getHrById(id: string) {
  return hrs.find((h) => h.id === id) || null;
}
