import { students } from './students';
import { tpos } from './tpos';
import { hrs } from './hrs';
import { companies } from './companies';
import { colleges } from './colleges';
import { jobs, collegeJobs } from './jobs';

export const RANGE_OPTIONS = ['Today', '7 Days', '30 Days', '90 Days', 'All Time', 'Custom'] as const;
export type RangeOption = (typeof RANGE_OPTIONS)[number];

export function rangeToDays(range: RangeOption, customDays = 30): number {
  switch (range) {
    case 'Today': return 1;
    case '7 Days': return 7;
    case '30 Days': return 30;
    case '90 Days': return 90;
    case 'All Time': return 540;
    case 'Custom': return Math.max(1, customDays);
  }
}

function metric(perDay: number, days: number, growthPct: number) {
  const value = Math.max(0, Math.round(perDay * days));
  const prior = Math.max(0, Math.round(value / (1 + growthPct / 100)));
  return { value, prior, deltaPct: growthPct };
}

// ---- Growth strip (section 3) ----
export function getGrowthStripMetrics(days: number) {
  const studentsM = metric(8.1, days, 11);
  const tposM = metric(0.62, days, 4);
  const hrsM = metric(1.8, days, 9);
  const newSignups = metric(10.5, days, 9);
  return {
    newSignups: { ...newSignups, breakdown: { students: studentsM.value, tpos: tposM.value, hrs: hrsM.value } },
    newJobs: metric(2.9, days, 8),
    newCompanies: metric(0.5, days, -3),
    newCandidates: metric(6.6, days, 15),
    interviewsBooked: metric(4.1, days, 6),
    offersMade: metric(1.6, days, 21),
  };
}

// ---- Activity breakdown table (section 3) — always fixed windows, never driven by the range selector ----
export interface ActivityRow {
  label: string;
  last24h: number;
  last7d: number;
  allTime: number;
}

const activityBaseRates: [string, number][] = [
  ['New Candidates', 6.6],
  ['New Jobs Posted', 2.9],
  ['New Users', 10.5],
  ['Interviews Booked', 4.1],
  ['Interviews Completed', 3.3],
  ['Assessments Sent', 7.8],
  ['Assessments Completed', 5.9],
  ['Video Responses', 2.4],
  ['Credits Used', 340],
];

export function getActivityBreakdown(): ActivityRow[] {
  return activityBaseRates.map(([label, perDay]) => ({
    label,
    last24h: Math.round(perDay),
    last7d: Math.round(perDay * 7),
    allTime: Math.round(perDay * 540),
  }));
}

// ---- Needs Your Attention (section 4) ----
export function getNeedsAttention() {
  return {
    pendingStudents: students.filter((s) => s.status === 'Pending').length,
    pendingTpos: tpos.filter((t) => t.status === 'Pending').length,
    pendingHrs: Math.max(1, Math.round(hrs.length / 6)),
    platformAccessRequests: companies.filter((c) => !c.companyAdminAssigned).length,
    campusAccessRequests: companies.filter((c) => c.campusAccessStatus === 'Pending').length + hrs.filter((h) => h.campusAccessStatus === 'Pending').length,
  };
}

// ---- Hiring Pipeline Funnel (section 5) ----
export type FunnelScope = 'All' | 'Platform-sourced' | 'Campus-sourced';

const funnelStageRates: [string, number][] = [
  ['Applied', 140],
  ['Assessment', 86],
  ['Video Q&A', 52],
  ['Interview', 38],
  ['Offer', 14],
  ['Hired', 9],
];

export function getFunnelData(days: number, scope: FunnelScope) {
  const scopeFactor = scope === 'Platform-sourced' ? 0.65 : scope === 'Campus-sourced' ? 0.35 : 1;
  const stages = funnelStageRates.map(([name, perDay]) => ({
    name,
    count: Math.max(0, Math.round(perDay * days * scopeFactor)),
  }));
  const withConversion = stages.map((s, i) => ({
    ...s,
    conversionFromPrev: i === 0 ? 100 : stages[i - 1].count > 0 ? Math.round((s.count / stages[i - 1].count) * 1000) / 10 : 0,
  }));
  return {
    stages: withConversion,
    velocity: {
      toShortlist: 1.8,
      toInterview: 4.2,
      toOffer: 9.6,
      toHire: 14.3,
    },
  };
}

// ---- Revenue & Credits (section 6) ----
export function getRevenueCredits(days: number) {
  const revenuePerDay = 61000;
  const revenueTotal = Math.round(revenuePerDay * days);
  const chartDays = Math.min(days, 30);
  const dailySeries = Array.from({ length: chartDays }, (_, i) => ({
    day: i + 1,
    value: Math.round(revenuePerDay * (0.7 + 0.6 * Math.abs(Math.sin(i * 1.3)))),
  }));
  const creditsSold = Math.round(1400 * days);
  const creditsSpent = Math.round(980 * days);
  const topSpenders = [...hrs]
    .sort((a, b) => b.creditBalance - a.creditBalance)
    .slice(0, 5)
    .map((h) => ({
      name: h.name,
      company: h.companyName,
      amount: Math.round((h.creditBalance / 4) * (days / 30 + 0.4)),
    }));
  return {
    revenueTotal,
    paidOrders: Math.max(1, Math.round(days * 1.4)),
    revenueDeltaPct: 12,
    dailySeries,
    creditsSold,
    creditsSpent,
    netChange: creditsSold - creditsSpent,
    topSpenders,
  };
}

// ---- Agencies (section 7) — standalone, not merged with Campus ----
export function getAgencyStats(days: number) {
  const poolOwners = hrs.filter((h) => h.agency === 'Pool owner').length;
  const poolMembers = hrs.filter((h) => h.agency === 'Pool member').length;
  return {
    activeSubscriptions: poolOwners,
    poolMembersActive: poolMembers,
    monthlyCreditsGranted: 18500,
    agencyRevenue: Math.round(9400 * (days / 30 + 0.3)),
  };
}

// ---- Top Performers (section 8) ----
export function getTopPerformers() {
  const topColleges = [...colleges].sort((a, b) => b.placementRate - a.placementRate).slice(0, 5);
  const topCompanies = [...companies].sort((a, b) => b.totalApplications - a.totalApplications).slice(0, 5);
  const topPlacements = [...students]
    .map((s, i) => ({
      student: s,
      company: companies[i % companies.length],
      package: `${(6 + (i * 3) % 40).toFixed(1)} LPA`,
      packageValue: 6 + ((i * 3) % 40),
    }))
    .sort((a, b) => b.packageValue - a.packageValue)
    .slice(0, 5);
  return { topColleges, topCompanies, topPlacements };
}

// ---- Trends & Analytics (section 9) ----
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getTrendsAnalytics() {
  const placementTrends = Array.from({ length: 12 }, (_, i) => ({
    month: MONTH_NAMES[i],
    value: 40 + Math.round(35 * Math.abs(Math.sin(i * 0.7))) + i * 3,
  }));
  const jobTrends = Array.from({ length: 12 }, (_, i) => ({
    month: MONTH_NAMES[i],
    value: 60 + Math.round(45 * Math.abs(Math.cos(i * 0.55))) + i * 2,
  }));
  const peakPlacement = placementTrends.reduce((a, b) => (b.value > a.value ? b : a));
  const peakJob = jobTrends.reduce((a, b) => (b.value > a.value ? b : a));

  const registrationTrends = Array.from({ length: 13 }, (_, i) => {
    const monthIdx = i % 12;
    return {
      label: `${MONTH_NAMES[monthIdx]} 202${5 + Math.floor(i / 12)}`,
      students: 30 + ((i * 7) % 45),
      tpos: 2 + (i % 6),
      hrs: 6 + ((i * 3) % 14),
    };
  });
  const peakRegistrations = registrationTrends.reduce((a, b) => (b.students + b.tpos + b.hrs > a.students + a.tpos + a.hrs ? b : a));

  return {
    placementsGrowthPct: 18,
    jobsGrowthPct: 11,
    registrationsGrowthPct: 9,
    peakPlacementMonth: peakPlacement.month,
    peakJobMonth: peakJob.month,
    peakRegistrationMonth: peakRegistrations.label,
    placementTrends,
    jobTrends,
    registrationTrends,
  };
}

// ---- Recent Activity feed (section 10) — single shared component ----
export interface ActivityItem {
  id: string;
  text: string;
  when: string;
}

export function getRecentActivity(limit = 8): ActivityItem[] {
  const items: ActivityItem[] = [];
  students.slice(0, 3).forEach((s, i) => items.push({ id: `act-stu-${s.id}`, text: `${s.name} registered as a student${s.collegeName ? ` at ${s.collegeName}` : ''}.`, when: `${i + 1}h ago` }));
  tpos.slice(0, 2).forEach((t, i) => items.push({ id: `act-tpo-${t.id}`, text: `${t.name} registered as TPO at ${t.collegeName}.`, when: `${i + 3}h ago` }));
  jobs.slice(0, 2).forEach((j, i) => items.push({ id: `act-job-${j.id}`, text: `Job "${j.title}" moved to ${j.status}.`, when: `${i + 5}h ago` }));
  companies.slice(0, 2).forEach((c, i) => {
    if (c.campusAccessStatus === 'Approved') items.push({ id: `act-comp-${c.id}`, text: `Campus access approved for ${c.name}.`, when: `${i + 7}h ago` });
  });
  collegeJobs.slice(0, 1).forEach((cj, i) => items.push({ id: `act-cjob-${cj.id}`, text: `${cj.collegeName} posted a college job: "${cj.title}".`, when: `${i + 9}h ago` }));
  return items.slice(0, limit);
}

// ---- Platform Status (section 11) — single shared widget ----
export function getPlatformStatus() {
  const activeUsers = students.filter((s) => s.status === 'Registered').length + tpos.filter((t) => t.status === 'Registered').length + hrs.filter((h) => h.status === 'Active').length;
  const disabledUsers = students.filter((s) => s.status === 'Disabled').length + tpos.filter((t) => t.status === 'Disabled').length + hrs.filter((h) => h.status === 'Suspended').length;
  return { activeUsers, disabledUsers, operational: true };
}
