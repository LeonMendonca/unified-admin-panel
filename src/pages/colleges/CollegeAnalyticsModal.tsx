import { useState } from 'react';
import { Button } from '../../components/ui';

export default function CollegeAnalyticsModal({ collegeName, onClose }: { collegeName: string; onClose: () => void }) {
  const [leaderboardTest, setLeaderboardTest] = useState<string | null>(null);

  const tests = [
    { name: 'Digital Tools Proficiency Assessment', students: 1 },
    { name: 'Placement Readiness Test', students: 12 },
    { name: 'General Assessment Test 1', students: 45 },
  ];

  const personalityTraits = [
    'Work Ethics', 'Willingness to Learn', 'Creativity', 'Commitment/Ownership', 
    'Communication', 'Self-drive', 'Service Mindset', 'Leadership', 'Confidence'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#022A40]">College Analytics Dashboard</h2>
            <p className="text-sm text-gray-500">Performance analytics for {collegeName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-gray-50">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#022A40]">Analytics Dashboard</h3>
            <p className="text-sm text-gray-500">{collegeName} - Student Performance Analytics</p>
          </div>

          <div className="flex items-center gap-2 mb-4 text-[#022A40]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            <h4 className="font-semibold">General Test Performance</h4>
          </div>

          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.name} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h5 className="font-bold text-[#022A40] text-lg">{test.name}</h5>
                    <p className="text-sm text-gray-500">Score distribution across {test.students} students</p>
                  </div>
                  <button 
                    onClick={() => setLeaderboardTest(test.name)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                    View Leaderboard
                  </button>
                </div>
                
                {/* Mock Chart */}
                <div className="relative h-48 w-full max-w-lg flex items-end gap-1 border-b border-l border-gray-400 pb-1 pl-1 text-xs text-gray-400">
                  <div className="absolute -left-6 bottom-0 flex flex-col justify-between h-full items-end pb-1">
                    <span>1</span>
                    <span>0.75</span>
                    <span>0.5</span>
                    <span>0.25</span>
                    <span>0</span>
                  </div>
                  <div className="flex-1 flex items-end justify-around h-full">
                    <div className="w-12 bg-[#0B1A28] h-[95%] relative">
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">0-20%</span>
                    </div>
                    <div className="w-12 h-0 relative">
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">21-40%</span>
                    </div>
                    <div className="w-12 h-0 relative">
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">41-60%</span>
                    </div>
                    <div className="w-12 h-0 relative">
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">61-80%</span>
                    </div>
                    <div className="w-12 h-0 relative">
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">81-100%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-8 mb-4 text-[#022A40]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <h4 className="font-semibold">Personality Test Analytics</h4>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-[#022A40] text-lg mb-1">ZigMe's Work DNA Assessment</h3>
            <p className="text-sm text-gray-500 mb-6">Feature score analytics across all students</p>

            <div className="space-y-4">
              {personalityTraits.map((trait) => (
                <div key={trait} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-semibold text-[#022A40]">{trait}</h5>
                    <button 
                      onClick={() => setLeaderboardTest(trait)}
                      className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                      View Leaderboard
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-2">Average: <span className="font-medium text-gray-900 ml-1">4%</span></p>
                      <p className="text-gray-500">Min: <span className="font-medium text-gray-900 ml-1">4%</span></p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-2">Students: <span className="font-medium text-gray-900 ml-1">1</span></p>
                      <p className="text-gray-500">Max: <span className="font-medium text-gray-900 ml-1">4%</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {leaderboardTest && (
        <LeaderboardModal testName={leaderboardTest} onClose={() => setLeaderboardTest(null)} />
      )}
    </div>
  );
}

function LeaderboardModal({ testName, onClose }: { testName: string; onClose: () => void }) {
  const students = [
    { rank: 1, name: 'Sushanth K', score: 4, maxScore: 35, percentage: '11.4%' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-md p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#022A40] mb-1">{testName} - Leaderboard</h2>
          <p className="text-sm text-gray-500">Student rankings for {testName}</p>
        </div>

        <div className="p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-center text-gray-500 border-b border-gray-100">
                <th className="py-3 font-medium text-left px-2">Rank</th>
                <th className="py-3 font-medium text-left">Student Name</th>
                <th className="py-3 font-medium">Score</th>
                <th className="py-3 font-medium">Max Score</th>
                <th className="py-3 font-medium text-right px-2">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((s) => (
                <tr key={s.rank} className="text-center">
                  <td className="py-4 text-left px-2 flex items-center gap-1">
                    {s.rank} 
                    {s.rank === 1 && <span className="text-yellow-500 text-lg">🏆</span>}
                  </td>
                  <td className="py-4 text-left font-medium text-gray-800">{s.name}</td>
                  <td className="py-4 font-bold text-gray-900">{s.score}</td>
                  <td className="py-4 text-gray-600">{s.maxScore}</td>
                  <td className="py-4 text-right px-2 text-gray-600 font-medium">{s.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
