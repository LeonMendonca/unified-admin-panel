export interface PinnedJob {
  id: string;
  jobTitle: string;
  companyName: string;
  logo: string;
  pinType: 'Single job' | 'Job Family';
  expiresOn: string;
  daysUntilExpiry: number;
}

export const pinnedJobs: PinnedJob[] = [
  {
    id: 'pin-1',
    jobTitle: 'Store Sales Executive [Experienced] - Pan India',
    companyName: 'Tata Croma',
    logo: 'https://api.dicebear.com/9.x/initials/svg?seed=Tata%20Croma',
    pinType: 'Single job',
    expiresOn: '2026-08-28',
    daysUntilExpiry: 9,
  },
  {
    id: 'pin-2',
    jobTitle: 'Store Sales Executive [Freshers] - Pan India',
    companyName: 'Tata Croma',
    logo: 'https://api.dicebear.com/9.x/initials/svg?seed=Tata%20Croma',
    pinType: 'Single job',
    expiresOn: '2026-08-28',
    daysUntilExpiry: 9,
  },
];
