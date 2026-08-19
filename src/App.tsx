import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/users/UsersPage';
import StudentDetail from './pages/users/StudentDetail';
import TPODetail from './pages/users/TPODetail';
import HRDetail from './pages/users/HRDetail';
import CompaniesList from './pages/companies/CompaniesList';
import CompanyDetail from './pages/companies/CompanyDetail';
import JobsPage from './pages/jobs/JobsPage';
import JobDetail from './pages/jobs/JobDetail';
import CollegeJobDetail from './pages/jobs/CollegeJobDetail';
import CollegesList from './pages/colleges/CollegesList';
import CollegeDetail from './pages/colleges/CollegeDetail';
import TemplatesPage, {
  SendToCandidatesPage,
  SendToTposPage,
  CampaignLogsPage,
  SuppressionsPage,
  TestTemplatesPage,
} from './pages/emailTemplates/EmailTemplatesPage';
import HrTemplatesPage from './pages/emailTemplates/HrTemplatesPage';
import ApolloUsagePage from './pages/ApolloUsagePage';
import TestsPage from './pages/TestsPage';
import CareerDiscoveryPage from './pages/CareerDiscoveryPage';
import PinnedJobsPage from './pages/PinnedJobsPage';
import QuestionsPage from './pages/roomsOfMastery/QuestionsPage';
import LeaderboardPage from './pages/roomsOfMastery/LeaderboardPage';
import PrizesPage from './pages/roomsOfMastery/PrizesPage';
import RulesBadgesPage from './pages/roomsOfMastery/RulesBadgesPage';
import JobMatchingPage from './pages/jobs/JobMatchingPage';
import JobFamiliesPage from './pages/jobs/JobFamiliesPage';
import CandidatesPage from './pages/candidates/CandidatesPage';
import CandidateTagsPage from './pages/candidateTags/CandidateTagsPage';
import LookupPage from './pages/lookup/LookupPage';
import LookupSearchPage from './pages/lookup/LookupSearchPage';
import LookupCompanyDetail from './pages/lookup/LookupCompanyDetail';
import LookupOrgChart from './pages/lookup/LookupOrgChart';
import CompaniesListPage from './pages/companies/CompaniesListPage';
import CompanyDetailPage from './pages/companies/CompanyDetailPage';
import CompanyJobsPage from './pages/companies/CompanyJobsPage';
import AIDetectionPage from './pages/ai-detection/AIDetectionPage';
import WhatsAppIntakePage from './pages/whatsapp-intake/WhatsAppIntakePage';
import AccessRequestPage from './pages/access-requests/AccessRequestPage';
import GeneralSettingsPage from './pages/settings/GeneralSettingsPage';
import CreditSettingsPage from './pages/settings/CreditSettingsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/apollo-usage" element={<ApolloUsagePage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/career-discovery" element={<CareerDiscoveryPage />} />
        <Route path="/pinned-jobs" element={<PinnedJobsPage />} />
        <Route path="/rooms-of-mastery/questions" element={<QuestionsPage />} />
        <Route path="/rooms-of-mastery/leaderboard" element={<LeaderboardPage />} />
        <Route path="/rooms-of-mastery/prizes" element={<PrizesPage />} />
        <Route path="/rooms-of-mastery/rules-badges" element={<RulesBadgesPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/candidate-tags" element={<CandidateTagsPage />} />
        <Route path="/ai-detection" element={<AIDetectionPage />} />
        <Route path="/whatsapp-intake" element={<WhatsAppIntakePage />} />
        <Route path="/access-requests" element={<AccessRequestPage />} />
        <Route path="/settings" element={<GeneralSettingsPage />} />
        <Route path="/credit-settings" element={<CreditSettingsPage />} />
        <Route path="/lookup" element={<LookupPage />} />
        <Route path="/companies" element={<CompaniesListPage />} />
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
        <Route path="/companies/:id/jobs" element={<CompanyJobsPage />} />
        <Route path="/lookup/search" element={<LookupSearchPage />} />
        <Route path="/lookup/company/:id" element={<LookupCompanyDetail />} />
        <Route path="/lookup/company/:id/org-chart" element={<LookupOrgChart />} />
        <Route path="/users/students/:id" element={<StudentDetail />} />
        <Route path="/users/tpos/:id" element={<TPODetail />} />
        <Route path="/users/hrs/:id" element={<HRDetail />} />
        <Route path="/companies" element={<CompaniesList />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/matching" element={<JobMatchingPage />} />
        <Route path="/jobs/families" element={<JobFamiliesPage />} />
        <Route path="/jobs/college/:id" element={<CollegeJobDetail />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/colleges" element={<CollegesList />} />
        <Route path="/colleges/:id" element={<CollegeDetail />} />
        <Route path="/email-templates/hr-templates" element={<HrTemplatesPage />} />
        <Route path="/email-templates" element={<TemplatesPage />} />
        <Route path="/email-templates/send-to-candidates" element={<SendToCandidatesPage />} />
        <Route path="/email-templates/send-to-tpos" element={<SendToTposPage />} />
        <Route path="/email-templates/campaign-logs" element={<CampaignLogsPage />} />
        <Route path="/email-templates/suppressions" element={<SuppressionsPage />} />
        <Route path="/email-templates/test-templates" element={<TestTemplatesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
