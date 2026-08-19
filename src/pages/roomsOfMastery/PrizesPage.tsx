import { useState, useEffect } from 'react';
import { Gift, Plus, Trophy, Trash2, X, AlertCircle } from 'lucide-react';
import {
  rooms,
  getStorageData,
  setStorageData
} from '../../data/roomsOfMastery';
import type { Prize } from '../../data/roomsOfMastery';

const seedPrizes: Prize[] = [
  {
    id: 'p1',
    roomId: 'overall',
    month: '2026-08',
    title: 'iPad Air M2 (256GB)',
    description: 'Awarded to the absolute top performer of the month with the highest accumulated score across all skill rooms.',
    rankRange: 'Rank 1',
  },
  {
    id: 'p2',
    roomId: 1,
    month: '2026-08',
    title: '₹5,000 Amazon Gift Voucher',
    description: 'Awarded to the student who achieves the highest fluency score in the AI and Digital Productivity Room.',
    rankRange: 'Rank 1-3',
  },
];

export default function PrizesPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-08'); // default Aug 2026
  const [selectedRoomId, setSelectedRoomId] = useState<number | 'overall'>('overall');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRankRange, setNewRankRange] = useState('Rank 1');
  const [newRoomId, setNewRoomId] = useState<number | 'overall'>('overall');

  // Load prizes
  useEffect(() => {
    const data = getStorageData<Prize[]>('prizes', seedPrizes);
    setPrizes(data);
  }, []);

  // Filtered list
  const filteredPrizes = prizes.filter(
    (p) => p.month === selectedMonth && p.roomId === selectedRoomId
  );

  // Add prize
  const handleAddPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    const newPrize: Prize = {
      id: `prize-${Date.now()}`,
      roomId: newRoomId,
      month: selectedMonth,
      title: newTitle,
      description: newDescription,
      rankRange: newRankRange,
    };

    const updated = [...prizes, newPrize];
    setPrizes(updated);
    setStorageData('prizes', updated);

    // Reset and close
    setNewTitle('');
    setNewDescription('');
    setNewRankRange('Rank 1');
    setIsModalOpen(false);
  };

  // Delete prize
  const handleDeletePrize = (id: string) => {
    const updated = prizes.filter((p) => p.id !== id);
    setPrizes(updated);
    setStorageData('prizes', updated);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#02759e]">Room Prizes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage prizes for room leaderboard winners</p>
        </div>

        <button
          onClick={() => {
            setNewRoomId(selectedRoomId);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 bg-[#0a3a60] hover:bg-[#082d4b] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={16} />
          Add Prize
        </button>
      </div>

      {/* Month Filter Card */}
      <div className="flex gap-2">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100"
        >
          <option value="2026-08">This Month</option>
          <option value="2026-07">Last Month</option>
        </select>
      </div>

      {/* Select Room Filter Panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#02759e] font-bold border-b border-gray-100 pb-3">
          <Trophy size={16} />
          <h2 className="text-sm">Select Room</h2>
        </div>
        <div className="max-w-xs">
          <select
            value={selectedRoomId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedRoomId(val === 'overall' ? 'overall' : parseInt(val));
            }}
            className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-[#029bcf]"
          >
            <option value="overall">Overall</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prizes Grid / Empty State */}
      {filteredPrizes.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
            <Trophy size={28} className="stroke-[1.5]" />
          </div>
          <h3 className="text-base font-extrabold text-gray-700">No prizes set for this month</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm">
            Click "Add Prize" to create the first prize for the current filter criteria.
          </p>
          <button
            onClick={() => {
              setNewRoomId(selectedRoomId);
              setIsModalOpen(true);
            }}
            className="mt-5 flex items-center gap-1.5 bg-[#0a3a60] hover:bg-[#082d4b] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            Add Prize
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrizes.map((prize) => {
            const isOverall = prize.roomId === 'overall';
            const roomName = isOverall
              ? 'Overall Leaderboard'
              : rooms.find((r) => r.id === prize.roomId)?.name;

            return (
              <div
                key={prize.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between group hover:border-[#029bcf] transition-all"
              >
                <div>
                  {/* Card Top */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#029bcf] flex items-center justify-center border border-sky-100 shrink-0">
                      {isOverall ? <Trophy size={22} /> : <Gift size={22} />}
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {prize.rankRange}
                      </span>
                      <button
                        onClick={() => handleDeletePrize(prize.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete prize"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="mt-4">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      {roomName}
                    </span>
                    <h3 className="text-base font-extrabold text-gray-900 mt-0.5">
                      {prize.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">
                      {prize.description}
                    </p>
                  </div>
                </div>

                {/* Footer status */}
                <div className="border-t border-gray-100 mt-5 pt-3.5 flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <AlertCircle size={12} />
                  Active for {prize.month}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Prize Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-extrabold text-[#02759e]">Configure Prize</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddPrize} className="p-5 flex flex-col gap-4">
              {/* Target Room */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Applicable Room
                </label>
                <select
                  value={newRoomId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewRoomId(val === 'overall' ? 'overall' : parseInt(val));
                  }}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  <option value="overall">Overall Leaderboard</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rank range */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Winner Rank Range
                </label>
                <select
                  value={newRankRange}
                  onChange={(e) => setNewRankRange(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  <option value="Rank 1">Rank 1 (Top Winner)</option>
                  <option value="Rank 1-3">Rank 1-3 (Top 3)</option>
                  <option value="Rank 1-5">Rank 1-5 (Top 5)</option>
                  <option value="Top 10">Top 10 Overall</option>
                  <option value="Participation">Any participant</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Prize Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹5,000 Amazon Gift Voucher"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain details of the prize, eligibility terms..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-100 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end border-t border-gray-50 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 font-semibold text-xs rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0a3a60] hover:bg-[#082d4b] text-white font-semibold text-xs rounded-lg shadow-sm cursor-pointer"
                >
                  Save Prize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
