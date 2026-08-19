import { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Users, Award, CheckCircle2, Play } from 'lucide-react';
import {
  rooms,
  seedLeaderboard,
  getStorageData,
  setStorageData
} from '../../data/roomsOfMastery';
import type { LeaderboardEntry } from '../../data/roomsOfMastery';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'overall' | number>('overall');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isComputing, setIsComputing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Countdown timer for next update (4h 58m 13s -> 17893 seconds)
  const [timeLeft, setTimeLeft] = useState(17893);
  const [lastUpdatedText, setLastUpdatedText] = useState('about 2 hours ago');

  useEffect(() => {
    const data = getStorageData<LeaderboardEntry[]>('leaderboard', seedLeaderboard);
    setLeaderboard(data);
  }, []);

  // Timer countdown hook
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 17900; // Reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format seconds to Hh Mm Ss
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Compute Rankings triggers a loader and sorts
  const handleComputeRankings = () => {
    setIsComputing(true);
    setTimeout(() => {
      // Sort: points descending, attempts ascending
      const sorted = [...leaderboard].sort((a, b) => {
        const scoreA = activeTab === 'overall' ? a.points : (a.roomPoints[activeTab] || 0);
        const scoreB = activeTab === 'overall' ? b.points : (b.roomPoints[activeTab] || 0);

        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return a.attempts - b.attempts; // fewer attempts is better
      });

      setLeaderboard(sorted);
      setStorageData('leaderboard', sorted);
      setLastUpdatedText('just now');
      setIsComputing(false);
    }, 800);
  };

  // Refresh rankings
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdatedText('just now');
      setIsRefreshing(false);
    }, 500);
  };

  // Get dynamic statistics based on current active tab
  const getTabStats = () => {
    if (leaderboard.length === 0) return { activeStudents: 0, topPerformer: 'N/A', topScore: 0 };
    
    // Filter out students who haven't attempted anything in this room (if room tab is active)
    const activeForTab = leaderboard.filter(student => {
      if (activeTab === 'overall') return student.attempts > 0;
      return (student.roomPoints[activeTab] || 0) > 0;
    });

    const activeCount = activeForTab.length;

    // Find top performer for the current tab
    let topStudent = leaderboard[0];
    let topScore = activeTab === 'overall' ? topStudent.points : (topStudent.roomPoints[activeTab] || 0);

    for (let i = 1; i < leaderboard.length; i++) {
      const currentScore = activeTab === 'overall' ? leaderboard[i].points : (leaderboard[i].roomPoints[activeTab] || 0);
      if (currentScore > topScore) {
        topStudent = leaderboard[i];
        topScore = currentScore;
      }
    }

    return {
      activeStudents: activeCount || leaderboard.length,
      topPerformer: topStudent ? topStudent.studentName : 'None',
      topScore: topScore,
    };
  };

  const { activeStudents, topPerformer, topScore } = getTabStats();

  // Get sorted list for display
  const sortedDisplayList = [...leaderboard].sort((a, b) => {
    const scoreA = activeTab === 'overall' ? a.points : (a.roomPoints[activeTab] || 0);
    const scoreB = activeTab === 'overall' ? b.points : (b.roomPoints[activeTab] || 0);

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    return a.attempts - b.attempts;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title & Compute Rankings Button */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#02759e]">Rooms Leaderboard (Admin)</h1>
          <p className="text-sm text-gray-500 mt-1">Rankings for 2026-08</p>
        </div>

        <button
          onClick={handleComputeRankings}
          disabled={isComputing}
          className="flex items-center justify-center gap-2 bg-[#0a3a60] hover:bg-[#082d4b] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50"
        >
          <Play size={15} className="fill-white" />
          {isComputing ? 'Computing...' : 'Compute Rankings'}
        </button>
      </div>

      {/* Month selection filter card */}
      <div className="flex gap-2">
        <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none">
          <option value="current">This Month</option>
          <option value="prev">Last Month</option>
        </select>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Students</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{activeStudents}</h3>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Students with quiz attempts</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top Performer</p>
            <h3 className="text-base font-extrabold text-gray-900 mt-1 truncate">{topPerformer}</h3>
            <p className="text-[11px] text-[#02759e] font-semibold mt-1">{topScore} points</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Rooms</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">7</h3>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">6 rooms + overall</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Trophy size={20} />
          </div>
        </div>
      </div>

      {/* Auto-update status row */}
      <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
            <CheckCircle2 size={13} />
            Up to date
          </span>
          <span>Updated: <strong className="text-gray-700 font-semibold">{lastUpdatedText}</strong></span>
          <span className="flex items-center gap-1 text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full font-semibold">
            Next update in: <strong className="font-extrabold">{formatTime(timeLeft)}</strong>
          </span>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-xs font-bold bg-white border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-[#029bcf]' : ''} />
          Refresh
        </button>
      </div>

      {/* Leaderboard Tabbed Panel */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Header Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 shrink-0">
          <h3 className="text-sm font-bold text-[#02759e] uppercase tracking-wider mb-3">Leaderboard Rankings</h3>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={() => setActiveTab('overall')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'overall'
                  ? 'bg-white text-[#02759e] shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overall
            </button>
            {rooms.map((room) => {
              // Extract short name for tab
              const shortName = room.name
                .replace(' Room', '')
                .replace(' and Digital Productivity', '')
                .replace(' and Strategy', '')
                .replace(' and Awareness', '')
                .replace(' and Reasoning', '')
                .replace(' and Technical', '');

              return (
                <button
                  key={room.id}
                  onClick={() => setActiveTab(room.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === room.id
                      ? 'bg-white text-[#02759e] shadow-sm ring-1 ring-black/5'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Title */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h4 className="text-sm font-bold text-gray-800">
            {activeTab === 'overall' ? 'Overall Rankings' : `${rooms.find((r) => r.id === activeTab)?.name} Rankings`}
          </h4>
          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            {sortedDisplayList.length} students
          </span>
        </div>

        {/* Rankings List */}
        <div className="divide-y divide-gray-100 bg-white">
          {sortedDisplayList.map((entry, index) => {
            const rank = index + 1;
            const points = activeTab === 'overall' ? entry.points : (entry.roomPoints[activeTab] || 0);

            // Highlight top 3 slots
            let rowClass = 'hover:bg-gray-50/50';
            let rankIcon = null;
            let badgeStyle = 'text-gray-500 bg-gray-50 border-gray-200';

            if (rank === 1) {
              rowClass = 'bg-amber-50/20 hover:bg-amber-50/30';
              badgeStyle = 'bg-amber-50 border-amber-200 text-amber-600';
              rankIcon = <Trophy size={14} className="text-amber-500 fill-amber-500" />;
            } else if (rank === 2) {
              rowClass = 'bg-slate-50/40 hover:bg-slate-50/60';
              badgeStyle = 'bg-slate-50 border-slate-200 text-slate-500';
              rankIcon = <Trophy size={14} className="text-slate-400 fill-slate-400" />;
            } else if (rank === 3) {
              rowClass = 'bg-amber-50/10 hover:bg-amber-50/20';
              badgeStyle = 'bg-[#fdf2e9] border-[#fad7ba] text-[#d97706]';
              rankIcon = <Trophy size={14} className="text-[#d97706] fill-[#d97706]" />;
            }

            return (
              <div
                key={entry.studentName}
                className={`px-5 py-4 flex items-center justify-between transition-colors ${rowClass}`}
              >
                {/* Left side: Rank & Name */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${badgeStyle}`}>
                    {rankIcon ? rankIcon : rank}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">
                      {entry.studentName}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      {entry.attempts} attempts
                    </p>
                  </div>
                </div>

                {/* Right side: Points */}
                <div className="text-right shrink-0">
                  <p className="text-base font-black text-gray-900 leading-none">
                    {points}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wider">
                    points
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
