import type { TPO } from './types';
import { colleges } from './colleges';

const firstNames = ['Rajesh', 'Sunita', 'Manoj', 'Priya', 'Anil', 'Deepa', 'Suresh', 'Kavita'];
const lastNames = ['Kulkarni', 'Joshi', 'Desai', 'Bhat', 'Menon', 'Chawla'];

export const tpos: TPO[] = colleges.flatMap((college, ci) =>
  Array.from({ length: ci % 2 === 0 ? 2 : 1 }, (_, j) => {
    const idx = ci * 2 + j;
    const first = firstNames[idx % firstNames.length];
    const last = lastNames[idx % lastNames.length];
    const status: TPO['status'] = idx % 6 === 0 ? 'Pending' : idx % 9 === 0 ? 'Disabled' : 'Registered';
    return {
      id: `tpo-${idx + 1}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${college.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10)}.edu.in`,
      contact: `+91 87${idx}0044556`,
      collegeId: college.id,
      collegeName: college.name,
      city: college.city,
      state: college.state,
      collegeType: college.institutionType,
      status,
      registrationSource: idx % 2 === 0 ? 'Invited' : 'Self-registered',
      registeredOn: new Date(2025, idx % 12, (idx % 27) + 1).toISOString().slice(0, 10),
      createdAt: new Date(2025, idx % 12, (idx % 27) + 1).toISOString().slice(0, 10),
      lastUpdated: new Date(2025, (idx + 2) % 12, (idx % 27) + 1).toISOString().slice(0, 10),
    };
  })
);

export function getTpoById(id: string) {
  return tpos.find((t) => t.id === id) || null;
}
