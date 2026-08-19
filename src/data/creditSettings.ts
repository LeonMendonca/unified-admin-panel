import { students } from './students';
import { hrs } from './hrs';

export interface CreditPackage {
  id: string;
  name: string;
  type: 'Student Pack' | 'Agency Monthly' | 'Agency Annual' | 'Campus add-on';
  credits: number;
  pricePerCredit: number | null;
  totalPrice: number | null;
  periodDays: number | null;
  status: 'Active' | 'Archived';
}

export const creditPackages: CreditPackage[] = [
  { id: 'pkg-starter', name: 'Starter', type: 'Student Pack', credits: 200, pricePerCredit: 10, totalPrice: 2000, periodDays: null, status: 'Active' },
  { id: 'pkg-growth', name: 'Growth', type: 'Student Pack', credits: 500, pricePerCredit: 7.5, totalPrice: 3750, periodDays: null, status: 'Active' },
  { id: 'pkg-scale', name: 'Scale', type: 'Student Pack', credits: 2000, pricePerCredit: 5, totalPrice: 10000, periodDays: null, status: 'Active' },
  { id: 'pkg-pro', name: 'Pro', type: 'Student Pack', credits: 5000, pricePerCredit: 4, totalPrice: 20000, periodDays: null, status: 'Active' },
  { id: 'pkg-agency-monthly', name: 'Agency Monthly', type: 'Agency Monthly', credits: 20000, pricePerCredit: 1.25, totalPrice: 25000, periodDays: 30, status: 'Active' },
  { id: 'pkg-agency-annual', name: 'Agency Annual', type: 'Agency Annual', credits: 240000, pricePerCredit: 1.04, totalPrice: 249600, periodDays: 365, status: 'Active' },
  { id: 'pkg-campus-access', name: 'Campus access', type: 'Campus add-on', credits: 200, pricePerCredit: null, totalPrice: null, periodDays: 30, status: 'Active' },
];

export const CAMPUS_ACCESS_PACKAGE_ID = 'pkg-campus-access';

export function getCampusAccessPackage() {
  return creditPackages.find((p) => p.id === CAMPUS_ACCESS_PACKAGE_ID)!;
}

export interface CreditBalanceRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  audience: 'Student' | 'HR';
  balance: number;
  earned: number;
  spent: number;
}

export const creditBalances: CreditBalanceRow[] = [
  ...students.slice(0, 10).map((s) => ({
    id: `bal-stu-${s.id}`,
    name: s.name,
    email: s.email,
    company: null,
    audience: 'Student' as const,
    balance: s.creditsBalance,
    earned: s.creditsEarned,
    spent: s.creditsSpent,
  })),
  ...hrs.slice(0, 10).map((h) => ({
    id: `bal-hr-${h.id}`,
    name: h.name,
    email: h.email,
    company: h.companyName,
    audience: 'HR' as const,
    balance: h.creditBalance,
    earned: h.creditBalance + 550,
    spent: 550,
  })),
];

export interface LedgerEntry {
  id: string;
  when: string;
  type: 'debit' | 'credit';
  amount: number;
  balanceAfter: number;
  description: string;
  ref: string;
  audience: 'Student' | 'HR' | 'Agency';
}

const ledgerTemplates: { type: 'debit' | 'credit'; amount: number; description: string; ref: string; audience: LedgerEntry['audience'] }[] = [
  { type: 'debit', amount: -5, description: 'Job post: senior software engineer', ref: 'job_post', audience: 'HR' },
  { type: 'debit', amount: -1, description: 'Resume parsing for Store Sales Executive [Experienced] - Mumbai', ref: 'resume_parse', audience: 'HR' },
  { type: 'debit', amount: -1, description: 'Resume parsing for Store Sales Executive [Experienced] - Mumbai', ref: 'resume_parse', audience: 'HR' },
  { type: 'credit', amount: 25, description: 'Welcome signup bonus', ref: 'signup_bonus', audience: 'Student' },
  { type: 'debit', amount: -1, description: 'Room of Mastery entry: DSA Basics', ref: 'room_entry', audience: 'Student' },
  { type: 'debit', amount: -200, description: 'Campus access activated for Nimbus Cloud', ref: 'campus_access', audience: 'HR' },
  { type: 'credit', amount: 20000, description: 'Agency monthly grant', ref: 'agency_grant', audience: 'Agency' },
  { type: 'debit', amount: -1, description: 'Apollo enrichment: HR contact lookup', ref: 'apollo_hr_contact', audience: 'HR' },
  { type: 'debit', amount: -5, description: 'Job post: data analyst', ref: 'job_post', audience: 'HR' },
  { type: 'credit', amount: 10, description: 'Test completion bonus', ref: 'test_completion', audience: 'Student' },
];

export const creditLedger: LedgerEntry[] = ledgerTemplates.map((t, i) => {
  const hoursAgo = i * 7 + 3;
  const when = new Date(Date.now() - hoursAgo * 3600 * 1000);
  const balanceAfter = 1900 - i * 20 + t.amount;
  return {
    id: `ledger-${i}`,
    when: when.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).replace(',', ','),
    type: t.type,
    amount: t.amount,
    balanceAfter: Math.max(0, balanceAfter),
    description: t.description,
    ref: t.ref,
    audience: t.audience,
  };
});

export interface AgencyPool {
  id: string;
  ownerName: string;
  ownerEmail: string;
  plan: 'monthly' | 'annual';
  members: number;
  balance: number;
  monthlyGrant: number;
  renews: string;
  status: 'active' | 'cancelled';
}

export const agencyPools: AgencyPool[] = hrs
  .filter((h) => h.agency !== 'None')
  .slice(0, 5)
  .map((h, i) => ({
    id: `agency-${h.id}`,
    ownerName: h.name,
    ownerEmail: h.email,
    plan: i % 3 === 0 ? 'annual' : 'monthly',
    members: h.agency === 'Pool owner' ? 1 + (i % 4) : 0,
    balance: h.creditBalance * 8 + 15000,
    monthlyGrant: 20000,
    renews: new Date(2026, (8 + i) % 12, 4 + i).toISOString().slice(0, 10),
    status: 'active',
  }));

export interface DiscountCoupon {
  id: string;
  code: string;
  discountPct: number;
  appliesTo: 'All' | 'Student Packs' | 'Agency Plans';
  validUntil: string;
  used: number;
  max: number;
  status: 'Active' | 'Archived';
}

export const discountCoupons: DiscountCoupon[] = [
  { id: 'coupon-1', code: 'TRIAL99', discountPct: 99, appliesTo: 'All', validUntil: '2026-06-19', used: 2, max: 5, status: 'Active' },
  { id: 'coupon-2', code: 'AGENCY20', discountPct: 20, appliesTo: 'Agency Plans', validUntil: '2026-12-31', used: 4, max: 50, status: 'Active' },
  { id: 'coupon-3', code: 'LAUNCH50', discountPct: 50, appliesTo: 'Student Packs', validUntil: '2025-12-01', used: 120, max: 120, status: 'Archived' },
];

export const studentCreditDefaults = {
  defaultSignupCredits: 25,
  roomEntryCost: 1,
};

export function getCreditSummary() {
  const usersWithCredits = creditBalances.length + 750;
  const totalBalance = creditBalances.reduce((s, b) => s + b.balance, 0) + 197478;
  const totalEarned = creditBalances.reduce((s, b) => s + b.earned, 0) + 208736;
  const totalSpent = creditBalances.reduce((s, b) => s + b.spent, 0) + 8358;
  return { usersWithCredits, totalBalance, totalEarned, totalSpent };
}
