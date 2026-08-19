import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Users,
  Briefcase,
  GraduationCap,
  Mail,
  ChevronDown,
  ChevronRight,
  FileText,
  Compass,
  Brain,
  Trophy,
  Gift,
  Award,
  Sparkles,
  Coins,
  Settings,
  HelpCircle,
  UserCheck,
  Tag,
  Search,
  BarChart2,
  Database,
  MessageSquare,
  ClipboardCheck
} from 'lucide-react';

const mainNav = [
  { to: '/', label: 'Dashboard', icon: BarChart2 },
  { to: '/apollo-usage', label: 'Apollo Usage', icon: Database },
  { to: '/users', label: 'All Users', icon: Users },
  { to: '/candidates', label: 'Candidates', icon: UserCheck },
  { to: '/companies', label: 'Companies', icon: Briefcase },
  { to: '/tests', label: 'Tests', icon: FileText },
  { to: '/access-requests', label: 'Access Request Form', icon: ClipboardCheck },
  { to: '/career-discovery', label: 'Career Discovery', icon: Compass },
];

const roomsOfMasteryGroup = {
  label: 'Rooms of Mastery',
  icon: Brain,
  base: '/rooms-of-mastery',
  children: [
    { to: '/rooms-of-mastery/questions', label: 'Questions', icon: HelpCircle },
    { to: '/rooms-of-mastery/leaderboard', label: 'Leaderboards', icon: Trophy },
    { to: '/rooms-of-mastery/prizes', label: 'Prizes', icon: Gift },
    { to: '/rooms-of-mastery/rules-badges', label: 'Rules/Badges', icon: Award },
  ],
};

const jobsGroup = {
  label: 'Jobs',
  icon: Briefcase,
  base: '/jobs',
  children: [
    { to: '/jobs', label: 'Jobs', end: true },
    { to: '/jobs/matching', label: 'Job Matching' },
    { to: '/jobs/families', label: 'Job Families' },
    { to: '/pinned-jobs', label: 'Pinned Jobs' },
  ],
};

const emailUtilityGroup = {
  label: 'Email Utility',
  icon: Mail,
  base: '/email-templates',
  children: [
    { to: '/email-templates/hr-templates', label: 'HR Templates' },
    { to: '/email-templates', label: 'Templates', end: true },
    { to: '/email-templates/send-to-candidates', label: 'Send to Candidates' },
    { to: '/email-templates/send-to-tpos', label: 'Send to TPOs' },
    { to: '/email-templates/campaign-logs', label: 'Campaign Logs' },
    { to: '/email-templates/suppressions', label: 'Suppressions' },
    { to: '/email-templates/test-templates', label: 'Test Templates' },
  ],
};

const footerNav = [
  { to: '/credit-settings', label: 'Credit Settings', icon: Coins },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  
  const isRoomsActive = location.pathname.startsWith(roomsOfMasteryGroup.base);
  const isJobsActive = location.pathname.startsWith('/jobs') || location.pathname.startsWith('/pinned-jobs');
  const isEmailActive = location.pathname.startsWith(emailUtilityGroup.base);
  
  const [roomsOpen, setRoomsOpen] = useState(isRoomsActive);
  const [jobsOpen, setJobsOpen] = useState(isJobsActive);
  const [emailOpen, setEmailOpen] = useState(isEmailActive);

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        {/* ZigMe Logo Header */}
        <div className="h-16 flex items-center px-5 border-b border-gray-200 shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight select-none">
                <span className="text-[#029bcf]">Zig</span>
                <span className="text-[#f58220]">Me</span>
              </span>
              <span className="bg-[#f0f9ff] text-[#02759e] border border-[#d0effa] text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin
              </span>
            </div>
            <span className="text-[8px] text-gray-400 font-bold tracking-wider -mt-1 pl-0.5 uppercase">
              Make Dreams Work
            </span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {/* Main Navigation */}
          {mainNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive ? 'bg-[#f4f7fe] text-[#029bcf]' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}

          {/* Rooms of Mastery - Expandable Group */}
          <div>
            <button
              onClick={() => setRoomsOpen((v) => !v)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isRoomsActive && !roomsOpen ? 'bg-[#f4f7fe] text-[#029bcf]' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <roomsOfMasteryGroup.icon size={17} />
              <span className="flex-1 text-left">{roomsOfMasteryGroup.label}</span>
              {roomsOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
            {roomsOpen && (
              <div className="mt-1 ml-4 pl-3 border-l border-gray-200 space-y-0.5">
                {roomsOfMasteryGroup.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-gray-100 text-gray-900 font-bold'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Colleges Link */}
          <NavLink
            to="/colleges"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive ? 'bg-[#f4f7fe] text-[#029bcf]' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <GraduationCap size={17} />
            Colleges
          </NavLink>

          {/* Jobs - Expandable Group */}
          <div>
            <button
              onClick={() => setJobsOpen((v) => !v)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isJobsActive && !jobsOpen ? 'bg-[#f4f7fe] text-[#029bcf]' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <jobsGroup.icon size={17} />
              <span className="flex-1 text-left">{jobsGroup.label}</span>
              {jobsOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
            {jobsOpen && (
              <div className="mt-1 ml-4 pl-3 border-l border-gray-200 space-y-0.5">
                {jobsGroup.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    end={child.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-gray-100 text-gray-900 font-bold'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* AI Detection Link */}
          <NavLink
            to="/ai-detection"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive ? 'bg-[#f4f7fe] text-[#029bcf]' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Sparkles size={17} className={isActive ? 'text-[#029bcf]' : ''} />
                AI Detection
              </>
            )}
          </NavLink>

          {/* Email Utility - Expandable Group */}
          <div>
            <button
              onClick={() => setEmailOpen((v) => !v)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isEmailActive && !emailOpen ? 'bg-[#f4f7fe] text-[#029bcf]' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <emailUtilityGroup.icon size={17} />
              <span className="flex-1 text-left">{emailUtilityGroup.label}</span>
              {emailOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
            {emailOpen && (
              <div className="mt-1 ml-4 pl-3 border-l border-gray-200 space-y-0.5">
                {emailUtilityGroup.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    end={child.end}
                    className={({ isActive }) =>
                      `block px-3 py-1.5 rounded-md text-sm transition-colors ${
                        isActive ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:bg-gray-50'
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Candidate Tags Link */}
          <NavLink
            to="/candidate-tags"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive ? 'bg-[#f4f7fe] text-[#029bcf]' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Tag size={17} className={isActive ? 'text-[#029bcf]' : ''} />
                Candidate Tags
              </>
            )}
          </NavLink>

          {/* LookUp Link */}
          <NavLink
            to="/lookup"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive ? 'bg-[#f4f7fe] text-[#029bcf]' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Search size={17} className={isActive ? 'text-[#029bcf]' : ''} />
                LookUp
              </>
            )}
          </NavLink>

          {/* WhatsApp Intake Link */}
          <NavLink
            to="/whatsapp-intake"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive ? 'bg-gray-900 text-white hover:bg-black' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <MessageSquare size={17} className={isActive ? 'text-white' : ''} />
                WhatsApp Intake
              </>
            )}
          </NavLink>

          {/* Footer settings/credit settings inside nav */}
          {footerNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive ? 'bg-[#f4f7fe] text-[#029bcf]' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Super Admin User Footer */}
        <div className="p-3 border-t border-gray-200 shrink-0">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 select-none">
              M
            </div>
            <div className="text-xs overflow-hidden">
              <p className="font-semibold text-gray-800 truncate">manish+22@zigme.in</p>
              <p className="text-gray-400 font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

